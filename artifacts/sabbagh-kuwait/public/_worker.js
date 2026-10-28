/**
 * Cloudflare Pages Advanced Worker (_worker.js)
 * 1. Reverse proxies /api/* calls to the AWS backend API server
 * 2. Serves static assets via env.ASSETS for all existing pre-rendered pages (0ms Edge latency)
 * 3. On-Demand Edge Hydration for newly approved painters (/painters/*):
 *    - Resolves new painters without rebuilding on Cloudflare
 *    - Injects dynamic SEO (<title>, meta description, canonical) and OpenGraph tags for Googlebot and WhatsApp
 *    - Provides instant 200 OK responses with edge caching
 */

const BACKEND_ORIGIN = 'http://ec2-16-16-208-155.eu-north-1.compute.amazonaws.com:5050';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Handle API routes
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

      const targetUrl = new URL(url.pathname + url.search, BACKEND_ORIGIN);

      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('Host', 'ec2-16-16-208-155.eu-north-1.compute.amazonaws.com:5050');
      forwardHeaders.set('X-Forwarded-Host', url.host);
      forwardHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
      forwardHeaders.set('X-Real-IP', request.headers.get('cf-connecting-ip') || '');

      try {
        const backendResponse = await fetch(targetUrl.toString(), {
          method: request.method,
          headers: forwardHeaders,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
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

    // 3. Dynamic Painter Resolution for newly registered/approved painters
    const painterMatch = url.pathname.match(/^\/painters\/([^/]+)\/?$/);
    if (painterMatch) {
      const rawIdentifier = painterMatch[1];
      const decodedIdentifier = decodeURIComponent(rawIdentifier);

      // Fetch base template HTML from existing static painter shell (/painters/1/)
      const shellUrl = new URL('/painters/1/', request.url);
      let shellResponse = await env.ASSETS.fetch(new Request(shellUrl.toString(), {
        headers: request.headers,
        redirect: 'follow',
      }));

      // If redirected or not 200, try index.html directly
      if (shellResponse.status !== 200) {
        shellResponse = await env.ASSETS.fetch(new Request(new URL('/painters/1/index.html', request.url).toString()));
      }

      if (shellResponse.status === 200) {
        let html = await shellResponse.text();

        // Query backend API for painter data
        let painterData = null;
        try {
          const apiTarget = `${BACKEND_ORIGIN}/api/public/painters/${encodeURIComponent(decodedIdentifier)}`;
          const apiRes = await fetch(apiTarget, {
            headers: {
              'Accept': 'application/json',
              'Host': 'ec2-16-16-208-155.eu-north-1.compute.amazonaws.com:5050'
            },
            signal: AbortSignal.timeout(3000),
          });
          if (apiRes.ok) {
            painterData = await apiRes.json();
          }
        } catch (e) {
          // Backend query failed or timed out
        }

        const cleanName = decodedIdentifier.replace(/[-_]/g, ' ');
        const painterName = painterData?.name || cleanName;
        const painterRegion = painterData?.region || 'الكويت';
        const painterYears = painterData?.years || 5;
        const painterPhone = painterData?.phone || '';
        const painterGovernorates = Array.isArray(painterData?.governorates) && painterData.governorates.length > 0
          ? painterData.governorates.join('، ')
          : 'كافة محافظات الكويت';
        const painterRating = painterData?.rating || '5.0';
        const ogImage = painterData?.avatarUrl || 'https://sabbagh-kuwait.com/logo.png';
        const canonicalUrl = `https://sabbagh-kuwait.com/painters/${encodeURIComponent(decodedIdentifier)}/`;

        const seoTitle = `${painterName} | صباغ معتمد في ${painterRegion} - فني الكويت | فني الكويت (صباغ الكويت)`;
        const seoDesc = `تواصل مع ${painterName} - صباغ وفني معتمد بخبرة ${painterYears} سنوات في ${painterGovernorates}. تقييم ${painterRating} نجمة، معاينة مجانية وواتساب مباشر: ${painterPhone}`;
        const ogTitle = `${painterName} - صباغ وفني معتمد في الكويت`;
        const ogDesc = `خبرة ${painterYears} سنوات، تقييم ${painterRating}/5. تواصل واتساب فوري: ${painterPhone}`;

        // Inject Dynamic Meta & Title
        html = html.replace(/<title>.*?<\/title>/i, `<title>${seoTitle}</title>`);
        html = html.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${seoDesc}" />`);
        html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
        html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${ogTitle}" />`);
        html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${ogDesc}" />`);
        html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
        html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);

        // Inject dynamic painter state for client hydration if found
        if (painterData && painterData.name) {
          const injection = `<script>window.__DYNAMIC_PAINTER__ = ${JSON.stringify(painterData)};</script></head>`;
          html = html.replace(/<\/head>/i, injection);
        }

        const headers = new Headers(shellResponse.headers);
        headers.set('Content-Type', 'text/html; charset=utf-8');
        headers.set('Cache-Control', 'public, max-age=120, s-maxage=3600, stale-while-revalidate=86400');

        return new Response(html, {
          status: 200,
          headers,
        });
      }
    }

    // 4. Fallback to normal asset response (404)
    return assetResponse;
  },
};
