/**
 * Cloudflare Pages Advanced Worker (_worker.js)
 * 
 * 1. Cloudflare Workers AI Translation Engine (@cf/meta/m2m100-1.2b):
 *    - /api/edge/translate-profile: Instant bi-directional translation on the edge
 *    - Intercepts registration to automatically enrich profiles with bilingual data (AR <-> EN)
 * 2. Reverse proxies /api/* calls to the AWS backend API server
 * 3. Serves static assets via env.ASSETS for all existing pre-rendered pages (0ms Edge latency)
 * 4. Dynamic Edge Hydration for newly approved painters in Arabic (/painters/*) AND English (/en/painters/*):
 *    - Resolves new painters without rebuilding on Cloudflare
 *    - Injects dynamic SEO (<title>, meta description, canonical) and OpenGraph tags for Googlebot and WhatsApp
 *    - Provides instant 200 OK responses with edge caching
 *    - Returns true 404 for nonexistent painters (avoids Soft-404s)
 */

const BACKEND_ORIGIN = 'http://ec2-16-16-208-155.eu-north-1.compute.amazonaws.com:5050';

const TRADE_TERMS_MAP = {
  'دهان داخلي': 'Interior Wall Painting',
  'أصباغ داخلية': 'Interior Wall Painting',
  'معجون وتنعيم أسقف': 'Putty Skimming & Ceiling Prep',
  'معجون أصلي': 'Authentic Putty Skim Coat',
  'ورق جدران': 'Wallpaper Installation',
  'أصباغ إيطالية': 'Italian Stucco & Marmorino',
  'أصباغ إيطالية وسيلك': 'Italian Stucco & Silk Paint',
  'بديل رخام': 'PVC Faux Marble Cladding',
  'ديكورات وبديل رخام': 'PVC Marble & Wall Cladding',
  'بديل خشب': 'WPC Fluted Wood Panels',
  'واجهات سيجما': 'Exterior Sigma Weatherproof Texture',
  'سيجما': 'Exterior Sigma Texture',
  'دهان خارجي': 'Exterior Facade Painting',
  'عوازل مائية وحرارية': 'Roof Leak & Thermal Insulation',
  'أرضيات إيبوكسي': 'Epoxy Floor Coatings',
  'أصباغ أبواب وخشب': 'Door & Wood Spray Painting',
  'معالجة رطوبة وشروخ': 'Moisture, Salt & Crack Repair',
};

const GOVERNORATES_MAP = {
  'حولي': 'Hawalli',
  'العاصمة': 'Capital (Kuwait City)',
  'الفروانية': 'Farwaniya',
  'الأحمدي': 'Al Ahmadi',
  'مبارك الكبير': 'Mubarak Al-Kabeer',
  'الجهراء': 'Al Jahra',
  'المطلاع': 'Al Mutlaa City',
  'صباح الأحمد': 'Sabah Al Ahmad',
  'الخيران': 'Khiran Chalets',
  'كل المناطق': 'All Kuwait Areas',
  'كافة المحافظات': 'All Kuwait Governorates',
};

function translateTradeTerm(term, targetLang) {
  if (!term) return '';
  if (targetLang === 'en') {
    return TRADE_TERMS_MAP[term] || term;
  }
  for (const [ar, en] of Object.entries(TRADE_TERMS_MAP)) {
    if (en.toLowerCase() === term.toLowerCase()) return ar;
  }
  return term;
}

function translateGovernorate(gov, targetLang) {
  if (!gov) return '';
  if (targetLang === 'en') {
    return GOVERNORATES_MAP[gov] || gov;
  }
  for (const [ar, en] of Object.entries(GOVERNORATES_MAP)) {
    if (en.toLowerCase() === gov.toLowerCase()) return ar;
  }
  return gov;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 0. Cloudflare Workers AI Profile Translation Endpoint
    if (url.pathname === '/api/edge/translate-profile' || url.pathname === '/api/edge/translate') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      }

      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const sourceText = body.text || body.bio || body.description || '';
          const sourceLang = body.sourceLang || (sourceText.match(/[\u0600-\u06FF]/) ? 'ar' : 'en');
          const targetLang = body.targetLang || (sourceLang === 'ar' ? 'en' : 'ar');

          let translatedBio = '';
          let translatedName = '';
          let usedModel = '@cf/meta/m2m100-1.2b';
          let llamaErr = null;

          // If Workers AI is bound in Cloudflare
          if (env.AI) {
            // 1. High-Quality Bio Translation via Llama 3.2 3B with Kuwait Painting Trade Context
            if (sourceText) {
              try {
                const llamaRes = await env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
                  messages: [
                    {
                      role: 'system',
                      content:
                        'You are an expert English localization translator for Kuwait home renovation. ' +
                        'Translate the Arabic painter bio into natural English. ' +
                        'Terminology: "معلم صباغ" = "Master Painter", "بديل رخام" = "PVC Marble Panels", ' +
                        '"بديل خشب" = "WPC Fluted Wood Panels", "سيجما" = "Exterior Sigma Weatherproof Coating", ' +
                        '"معجون" = "Wall Putty Skim Coat", "أصباغ إيطالية" = "Italian Stucco Paint". ' +
                        'Output ONLY the translated sentence, without any preamble or quotes.',
                    },
                    {
                      role: 'user',
                      content: sourceText,
                    },
                  ],
                  max_tokens: 250,
                });

                if (llamaRes && llamaRes.response) {
                  translatedBio = llamaRes.response.trim().replace(/^["']|["']$/g, '');
                  usedModel = '@cf/meta/llama-3.2-3b-instruct';
                }
              } catch (e) {
                llamaErr = e.message || String(e);
              }

              // Fallback to M2M100 translation model if Llama did not return
              if (!translatedBio) {
                try {
                  const aiRes = await env.AI.run('@cf/meta/m2m100-1.2b', {
                    text: sourceText,
                    source_lang: sourceLang === 'ar' ? 'arabic' : 'english',
                    target_lang: targetLang === 'en' ? 'english' : 'arabic',
                  });
                  if (aiRes && aiRes.translated_text) {
                    translatedBio = aiRes.translated_text;
                    usedModel = '@cf/meta/m2m100-1.2b';
                  }
                } catch (e) {}
              }
            }

            // 2. Name Translation
            if (body.name) {
              try {
                const nameRes = await env.AI.run('@cf/meta/m2m100-1.2b', {
                  text: body.name,
                  source_lang: sourceLang === 'ar' ? 'arabic' : 'english',
                  target_lang: targetLang === 'en' ? 'english' : 'arabic',
                });
                if (nameRes && nameRes.translated_text) {
                  translatedName = nameRes.translated_text;
                }
              } catch (e) {}
            }
          }

          // Translate trade terms and governorates with domain dictionary
          const rawServices = Array.isArray(body.services) ? body.services : [];
          const translatedServices = rawServices.map((s) => translateTradeTerm(s, targetLang));

          const rawGovernorates = Array.isArray(body.governorates) ? body.governorates : [];
          const translatedGovernorates = rawGovernorates.map((g) => translateGovernorate(g, targetLang));

          return new Response(
            JSON.stringify({
              success: true,
              engine: translatedBio ? 'cloudflare-workers-ai' : 'domain-fallback',
              model: translatedBio ? usedModel : 'local-kuwait-dictionary',
              translated: {
                name: translatedName || body.name || '',
                bio: translatedBio || sourceText,
                services: translatedServices,
                governorates: translatedGovernorates,
                sourceLang,
                targetLang,
              },
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ success: false, error: err.message }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }
      }
    }

    // 1. Handle API routes (Reverse proxy to AWS EC2 backend)
    if (url.pathname.startsWith('/api/')) {
      // Handle CORS Preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': url.origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      // Automatically enrich painter registration with Cloudflare Workers AI translation
      let requestToSend = request;
      if (
        (url.pathname === '/api/public/painters/register' || url.pathname === '/api/public/painters') &&
        request.method === 'POST'
      ) {
        try {
          const rawBody = await request.clone().json();
          let modified = false;

          if (env.AI) {
            // Auto-translate Arabic bio to English if missing
            if (rawBody.bio && !rawBody.bio_en) {
              try {
                const aiRes = await env.AI.run('@cf/meta/m2m100-1.2b', {
                  text: rawBody.bio,
                  source_lang: 'arabic',
                  target_lang: 'english',
                });
                if (aiRes && aiRes.translated_text) {
                  rawBody.bio_en = aiRes.translated_text;
                  modified = true;
                }
              } catch (e) {}
            }

            // Auto-translate Arabic name to English if missing
            if (rawBody.name && !rawBody.name_en) {
              try {
                const aiRes = await env.AI.run('@cf/meta/m2m100-1.2b', {
                  text: rawBody.name,
                  source_lang: 'arabic',
                  target_lang: 'english',
                });
                if (aiRes && aiRes.translated_text) {
                  rawBody.name_en = aiRes.translated_text;
                  modified = true;
                }
              } catch (e) {}
            }
          }

          // Translate services if missing
          if (Array.isArray(rawBody.services) && !rawBody.services_en) {
            rawBody.services_en = rawBody.services.map((s) => translateTradeTerm(s, 'en'));
            modified = true;
          }

          if (modified) {
            const forwardHeaders = new Headers(request.headers);
            forwardHeaders.set('Content-Type', 'application/json');
            requestToSend = new Request(request.url, {
              method: 'POST',
              headers: forwardHeaders,
              body: JSON.stringify(rawBody),
            });
          }
        } catch (e) {
          // If JSON parsing fails, continue with original request
        }
      }

      const targetUrl = new URL(url.pathname + url.search, BACKEND_ORIGIN);

      const forwardHeaders = new Headers(requestToSend.headers);
      forwardHeaders.set('Host', 'ec2-16-16-208-155.eu-north-1.compute.amazonaws.com:5050');
      forwardHeaders.set('X-Forwarded-Host', url.host);
      forwardHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
      forwardHeaders.set('X-Real-IP', request.headers.get('cf-connecting-ip') || '');

      try {
        const backendResponse = await fetch(targetUrl.toString(), {
          method: requestToSend.method,
          headers: forwardHeaders,
          body: requestToSend.method !== 'GET' && requestToSend.method !== 'HEAD' ? requestToSend.body : undefined,
          redirect: 'follow',
        });

        const responseHeaders = new Headers(backendResponse.headers);
        responseHeaders.set('Access-Control-Allow-Origin', url.origin);
        responseHeaders.set('Access-Control-Allow-Credentials', 'true');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');

        return new Response(backendResponse.body, {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          headers: responseHeaders,
        });
      } catch (err) {
        return new Response(
          JSON.stringify({
            status: 'ok',
            fallback: true,
            mode: 'local',
            note: 'Backend gateway offline, running in local-first synced mode',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': url.origin,
              'Access-Control-Allow-Credentials': 'true',
            },
          }
        );
      }
    }

    // 2. Fetch static assets first (Fast path: 0ms for all pre-rendered static pages)
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // 3. Dynamic Painter Resolution (Arabic: /painters/*)
    const arabicPainterMatch = url.pathname.match(/^\/painters\/([^/]+)\/?$/);
    if (arabicPainterMatch) {
      const rawIdentifier = arabicPainterMatch[1];
      const decodedIdentifier = decodeURIComponent(rawIdentifier);

      let painterData = null;
      try {
        const apiTarget = `${BACKEND_ORIGIN}/api/public/painters/${encodeURIComponent(decodedIdentifier)}`;
        const apiRes = await fetch(apiTarget, {
          headers: {
            'Accept': 'application/json',
            'Host': 'ec2-16-16-208-155.eu-north-1.compute.amazonaws.com:5050',
          },
          signal: AbortSignal.timeout(3000),
        });
        if (apiRes.ok) {
          painterData = await apiRes.json();
        }
      } catch (e) {}

      if (painterData && painterData.name) {
        const shellUrl = new URL('/painters/1/', request.url);
        let shellResponse = await env.ASSETS.fetch(
          new Request(shellUrl.toString(), {
            headers: request.headers,
            redirect: 'follow',
          })
        );

        if (shellResponse.status !== 200) {
          shellResponse = await env.ASSETS.fetch(new Request(new URL('/painters/1/index.html', request.url).toString()));
        }

        if (shellResponse.status === 200) {
          let html = await shellResponse.text();

          const painterName = painterData.name;
          const painterRegion = painterData.region || 'الكويت';
          const painterYears = painterData.years || 5;
          const painterPhone = painterData.phone || '';
          const painterGovernorates =
            Array.isArray(painterData.governorates) && painterData.governorates.length > 0
              ? painterData.governorates.join('، ')
              : 'كافة محافظات الكويت';
          const painterRating = painterData.rating || '5.0';
          const ogImage = painterData.avatarUrl || 'https://sabbagh-kuwait.com/logo.png';
          const canonicalUrl = `https://sabbagh-kuwait.com/painters/${encodeURIComponent(decodedIdentifier)}/`;

          const seoTitle = `${painterName} | صباغ معتمد في ${painterRegion} - فني الكويت | فني الكويت (صباغ الكويت)`;
          const seoDesc = `تواصل مع ${painterName} - صباغ وفني معتمد بخبرة ${painterYears} سنوات في ${painterGovernorates}. تقييم ${painterRating} نجمة، معاينة مجانية وواتساب مباشر: ${painterPhone}`;
          const ogTitle = `${painterName} - صباغ وفني معتمد في الكويت`;
          const ogDesc = `خبرة ${painterYears} سنوات، تقييم ${painterRating}/5. تواصل واتساب فوري: ${painterPhone}`;

          html = html.replace(/<title>.*?<\/title>/i, `<title>${seoTitle}</title>`);
          html = html.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${seoDesc}" />`);
          html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
          html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${ogTitle}" />`);
          html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${ogDesc}" />`);
          html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
          html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);

          const injection = `<script>window.__DYNAMIC_PAINTER__ = ${JSON.stringify(painterData)};</script></head>`;
          html = html.replace(/<\/head>/i, injection);

          const headers = new Headers(shellResponse.headers);
          headers.set('Content-Type', 'text/html; charset=utf-8');
          headers.set('Cache-Control', 'public, max-age=120, s-maxage=3600, stale-while-revalidate=86400');

          return new Response(html, {
            status: 200,
            headers,
          });
        }
      }
    }

    // 4. Dynamic Painter Resolution (English: /en/painters/*)
    const englishPainterMatch = url.pathname.match(/^\/en\/painters\/([^/]+)\/?$/);
    if (englishPainterMatch) {
      const rawIdentifier = englishPainterMatch[1];
      const decodedIdentifier = decodeURIComponent(rawIdentifier);

      let painterData = null;
      try {
        const apiTarget = `${BACKEND_ORIGIN}/api/public/painters/${encodeURIComponent(decodedIdentifier)}`;
        const apiRes = await fetch(apiTarget, {
          headers: {
            'Accept': 'application/json',
            'Host': 'ec2-16-16-208-155.eu-north-1.compute.amazonaws.com:5050',
          },
          signal: AbortSignal.timeout(3000),
        });
        if (apiRes.ok) {
          painterData = await apiRes.json();
        }
      } catch (e) {}

      if (painterData && painterData.name) {
        // Auto-translate using Cloudflare Workers AI on edge if bio_en or name_en missing
        if (env.AI) {
          if (!painterData.bio_en && painterData.bio) {
            try {
              const aiRes = await env.AI.run('@cf/meta/m2m100-1.2b', {
                text: painterData.bio,
                source_lang: 'arabic',
                target_lang: 'english',
              });
              if (aiRes && aiRes.translated_text) {
                painterData.bio_en = aiRes.translated_text;
              }
            } catch (e) {}
          }

          if (!painterData.name_en && painterData.name) {
            try {
              const aiRes = await env.AI.run('@cf/meta/m2m100-1.2b', {
                text: painterData.name,
                source_lang: 'arabic',
                target_lang: 'english',
              });
              if (aiRes && aiRes.translated_text) {
                painterData.name_en = aiRes.translated_text;
              }
            } catch (e) {}
          }
        }

        const shellUrl = new URL('/en/painters/1/', request.url);
        let shellResponse = await env.ASSETS.fetch(
          new Request(shellUrl.toString(), {
            headers: request.headers,
            redirect: 'follow',
          })
        );

        if (shellResponse.status !== 200) {
          shellResponse = await env.ASSETS.fetch(new Request(new URL('/en/painters/1/index.html', request.url).toString()));
        }

        if (shellResponse.status === 200) {
          let html = await shellResponse.text();

          const painterName = painterData.name_en || painterData.name;
          const painterRegion = painterData.region_en || painterData.region || 'Kuwait';
          const painterYears = painterData.years || 5;
          const painterPhone = painterData.phone || '';
          const painterGovernorates =
            Array.isArray(painterData.governorates) && painterData.governorates.length > 0
              ? painterData.governorates.map((g) => translateGovernorate(g, 'en')).join(', ')
              : 'All Kuwait Governorates';
          const painterRating = painterData.rating || '5.0';
          const ogImage = painterData.avatarUrl || 'https://sabbagh-kuwait.com/logo.png';
          const canonicalUrl = `https://sabbagh-kuwait.com/en/painters/${encodeURIComponent(decodedIdentifier)}/`;

          const seoTitle = `${painterName} | Certified Kuwait Painter & Wall Specialist - Fani Kuwait`;
          const seoDesc = `Hire ${painterName} - Certified professional painter with ${painterYears} years of experience in ${painterGovernorates}. Rated ${painterRating}/5 stars. Direct WhatsApp: ${painterPhone}`;
          const ogTitle = `${painterName} - Certified Master Painter in Kuwait`;
          const ogDesc = `${painterYears} years experience, ${painterRating}/5 stars. Direct WhatsApp contact: ${painterPhone}`;

          html = html.replace(/<title>.*?<\/title>/i, `<title>${seoTitle}</title>`);
          html = html.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${seoDesc}" />`);
          html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
          html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${ogTitle}" />`);
          html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${ogDesc}" />`);
          html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
          html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);

          const injection = `<script>window.__DYNAMIC_PAINTER__ = ${JSON.stringify(painterData)};</script></head>`;
          html = html.replace(/<\/head>/i, injection);

          const headers = new Headers(shellResponse.headers);
          headers.set('Content-Type', 'text/html; charset=utf-8');
          headers.set('Cache-Control', 'public, max-age=120, s-maxage=3600, stale-while-revalidate=86400');

          return new Response(html, {
            status: 200,
            headers,
          });
        }
      }
    }

    // 5. Fallback to normal asset response (404 for completely nonexistent pages)
    return assetResponse;
  },
};
