/**
 * Bi-directional Painter Profile Auto-Translation Tool (Arabic <-> English)
 * Translates painter registrations automatically between Arabic and English
 * using Google Gemini API with fallback to domain-specific terminology dictionary.
 */

export interface RawPainterProfile {
  name: string;
  bio?: string;
  description?: string;
  services?: string[];
  governorates?: string[];
  region?: string;
  whatsappPrefill?: string;
  responseTime?: string;
}

export interface TranslatedPainterProfile {
  nameEn: string;
  nameAr: string;
  bioEn: string;
  bioAr: string;
  descriptionEn: string;
  descriptionAr: string;
  servicesEn: string[];
  servicesAr: string[];
  regionEn: string;
  regionAr: string;
  whatsappPrefillEn: string;
  whatsappPrefillAr: string;
  responseTimeEn: string;
  responseTimeAr: string;
  sourceLanguage: 'ar' | 'en';
}

// Domain-specific translation dictionary for Kuwait painting trade
const SERVICES_DICTIONARY: Record<string, { en: string; ar: string }> = {
  'دهان داخلي': { en: 'Interior Wall Painting', ar: 'دهان داخلي' },
  'أصباغ داخلية': { en: 'Interior Wall Painting', ar: 'دهان داخلي' },
  'معجون وتنعيم أسقف': { en: 'Putty Skimming & Ceiling Prep', ar: 'معجون وتنعيم أسقف' },
  'معجون أصلي': { en: 'Authentic Putty Skim Coat', ar: 'معجون أصلي' },
  'ورق جدران': { en: 'Wallpaper Installation', ar: 'ورق جدران' },
  'أصباغ إيطالية وسيلك': { en: 'Italian Stucco & Silk Paint', ar: 'أصباغ إيطالية وسيلك' },
  'أصباغ إيطالية': { en: 'Italian Stucco & Marmorino', ar: 'أصباغ إيطالية' },
  'ديكورات وبديل رخام': { en: 'PVC Marble & Wall Cladding', ar: 'ديكورات وبديل رخام' },
  'بديل رخام': { en: 'PVC Faux Marble Cladding', ar: 'بديل رخام' },
  'بديل خشب': { en: 'WPC Fluted Wood Panels', ar: 'بديل خشب' },
  'واجهات سيجما': { en: 'Exterior Sigma Weatherproof Texture', ar: 'واجهات سيجما' },
  'دهان خارجي': { en: 'Exterior Facade Painting', ar: 'دهان خارجي' },
  'عوازل مائية وحرارية': { en: 'Roof Leak & Thermal Insulation', ar: 'عوازل مائية وحرارية' },
  'أرضيات إيبوكسي': { en: 'Epoxy Floor Coatings', ar: 'أرضيات إيبوكسي' },
  'أصباغ أبواب وخشب': { en: 'Door & Wood Spray Painting', ar: 'أصباغ أبواب وخشب' },
  'معالجة رطوبة وشروخ': { en: 'Moisture, Salt & Crack Repair', ar: 'معالجة رطوبة وشروخ' },
};

const GOVERNORATES_DICTIONARY: Record<string, { en: string; ar: string }> = {
  'حولي': { en: 'Hawalli', ar: 'حولي' },
  'العاصمة': { en: 'Capital (Kuwait City)', ar: 'العاصمة' },
  'الفروانية': { en: 'Farwaniya', ar: 'الفروانية' },
  'الأحمدي': { en: 'Al Ahmadi', ar: 'الأحمدي' },
  'مبارك الكبير': { en: 'Mubarak Al-Kabeer', ar: 'مبارك الكبير' },
  'الجهراء': { en: 'Al Jahra', ar: 'الجهراء' },
  'المطلاع': { en: 'Al Mutlaa City', ar: 'مدينة المطلاع' },
  'صباح الأحمد': { en: 'Sabah Al Ahmad', ar: 'صباح الأحمد' },
  'الخيران': { en: 'Khiran Chalets', ar: 'الخيران' },
  'كل المناطق': { en: 'All Kuwait Areas', ar: 'كافة مناطق الكويت' },
};

/**
 * Helper to translate a service string to English
 */
export function translateServiceToEn(service: string): string {
  return SERVICES_DICTIONARY[service]?.en || service;
}

/**
 * Helper to translate a governorate string to English
 */
export function translateGovernorateToEn(governorate: string): string {
  return GOVERNORATES_DICTIONARY[governorate]?.en || governorate;
}

/**
 * Detect primary language (Arabic vs English)
 */
export function detectLanguage(text: string): 'ar' | 'en' {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text) ? 'ar' : 'en';
}

/**
 * Translate painter profile bi-directionally
 */
export async function translatePainterProfile(
  profile: RawPainterProfile,
  geminiApiKey?: string
): Promise<TranslatedPainterProfile> {
  const detectedLang = detectLanguage(profile.name + ' ' + (profile.bio || profile.description || ''));

  // 1. Primary Engine: Cloudflare Workers AI Edge Endpoint (@cf/meta/m2m100-1.2b)
  try {
    const edgeRes = await fetch('/api/edge/translate-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profile.name,
        bio: profile.bio || profile.description || '',
        services: profile.services || [],
        governorates: profile.governorates || [],
        sourceLang: detectedLang,
        targetLang: detectedLang === 'ar' ? 'en' : 'ar',
      }),
    });

    if (edgeRes.ok) {
      const edgeData = await edgeRes.json();
      if (edgeData?.success && edgeData.translated) {
        const trans = edgeData.translated;
        const nameEn = detectedLang === 'ar' ? (trans.name || transliterateArabicNameToEn(profile.name)) : profile.name;
        const nameAr = detectedLang === 'ar' ? profile.name : (trans.name || profile.name);
        const bioEn = detectedLang === 'ar' ? (trans.bio || '') : (profile.bio || '');
        const bioAr = detectedLang === 'ar' ? (profile.bio || '') : (trans.bio || '');
        const servicesEn = detectedLang === 'ar' ? trans.services : (profile.services || []);
        const servicesAr = detectedLang === 'ar' ? (profile.services || []) : trans.services;

        return {
          nameEn,
          nameAr,
          bioEn,
          bioAr,
          descriptionEn: bioEn,
          descriptionAr: bioAr,
          servicesEn: servicesEn.length > 0 ? servicesEn : ['Interior Wall Painting', 'Putty Skim Coat', 'Authentic Jotun Paints'],
          servicesAr: servicesAr.length > 0 ? servicesAr : ['دهان داخلي', 'معجون أصلي', 'أصباغ جوتن'],
          regionEn: detectedLang === 'ar' ? (GOVERNORATES_DICTIONARY[profile.region || '']?.en || 'All Kuwait') : (profile.region || 'All Kuwait'),
          regionAr: detectedLang === 'ar' ? (profile.region || 'كافة المناطق') : (GOVERNORATES_DICTIONARY[profile.region || '']?.ar || 'كافة المناطق'),
          whatsappPrefillEn: `Hello ${nameEn}, I need a painting quotation.`,
          whatsappPrefillAr: `مرحباً ${nameAr}، أود طلب مقايسة صبغ.`,
          responseTimeEn: 'Within 15 minutes',
          responseTimeAr: 'خلال 15 دقيقة',
          sourceLanguage: detectedLang,
        };
      }
    }
  } catch (e) {
    // Edge API not available or in local mode, continue to next fallback
  }

  // 2. Secondary Engine: Google Gemini Flash API (if API Key provided)
  if (geminiApiKey) {
    try {
      const prompt = `You are a Kuwait construction and painting localization specialist.
Translate the following painter profile ${detectedLang === 'ar' ? 'from Arabic to English' : 'from English to Kuwaiti Arabic'}.

Input Profile:
- Name: ${profile.name}
- Bio: ${profile.bio || profile.description || ''}
- Services: ${(profile.services || []).join(', ')}
- Region: ${profile.region || 'All Kuwait'}

Return a valid JSON object matching this schema:
{
  "nameTranslated": "string",
  "bioTranslated": "string",
  "descriptionTranslated": "string",
  "regionTranslated": "string",
  "servicesTranslated": ["string"]
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
        if (parsed.nameTranslated) {
          return {
            nameEn: detectedLang === 'ar' ? parsed.nameTranslated : profile.name,
            nameAr: detectedLang === 'ar' ? profile.name : parsed.nameTranslated,
            bioEn: detectedLang === 'ar' ? parsed.bioTranslated : (profile.bio || ''),
            bioAr: detectedLang === 'ar' ? (profile.bio || '') : parsed.bioTranslated,
            descriptionEn: detectedLang === 'ar' ? parsed.descriptionTranslated : (profile.description || ''),
            descriptionAr: detectedLang === 'ar' ? (profile.description || '') : parsed.descriptionTranslated,
            servicesEn: detectedLang === 'ar' ? parsed.servicesTranslated : (profile.services || []),
            servicesAr: detectedLang === 'ar' ? (profile.services || []) : parsed.servicesTranslated,
            regionEn: detectedLang === 'ar' ? parsed.regionTranslated : (profile.region || 'All Kuwait'),
            regionAr: detectedLang === 'ar' ? (profile.region || 'كافة المناطق') : parsed.regionTranslated,
            whatsappPrefillEn: `Hello ${detectedLang === 'ar' ? parsed.nameTranslated : profile.name}, I need a painting quotation.`,
            whatsappPrefillAr: `مرحباً ${detectedLang === 'ar' ? profile.name : parsed.nameTranslated}، أود طلب مقايسة صبغ.`,
            responseTimeEn: 'Within 15 minutes',
            responseTimeAr: 'خلال 15 دقيقة',
            sourceLanguage: detectedLang,
          };
        }
      }
    } catch (e) {
      // Fallback to rule-based dictionary
    }
  }

  // Fallback Rule-Based Dictionary Engine
  const servicesEn: string[] = [];
  const servicesAr: string[] = [];
  (profile.services || []).forEach((s) => {
    const match = SERVICES_DICTIONARY[s];
    if (match) {
      servicesEn.push(match.en);
      servicesAr.push(match.ar);
    } else {
      servicesEn.push(s);
      servicesAr.push(s);
    }
  });

  const regionMatch = GOVERNORATES_DICTIONARY[profile.region || ''] || {
    en: 'All Kuwait Areas',
    ar: 'كافة مناطق الكويت',
  };

  const nameEn = detectedLang === 'ar' ? transliterateArabicNameToEn(profile.name) : profile.name;
  const nameAr = detectedLang === 'ar' ? profile.name : profile.name;

  return {
    nameEn,
    nameAr,
    bioEn: detectedLang === 'ar' ? (profile.bio || profile.description || 'Certified master technician with extensive experience in Kuwait.') : (profile.bio || ''),
    bioAr: detectedLang === 'ar' ? (profile.bio || profile.description || '') : 'صباغ وفني معتمد يقدم أفضل خدمات التشطيب في الكويت.',
    descriptionEn: detectedLang === 'ar' ? (profile.description || 'High-quality interior and exterior painting services.') : (profile.description || ''),
    descriptionAr: detectedLang === 'ar' ? (profile.description || '') : 'خدمات دهانات وتشطيبات عالية الجودة.',
    servicesEn: servicesEn.length > 0 ? servicesEn : ['Interior Wall Painting', 'Putty Skim Coat', 'Authentic Jotun Paints'],
    servicesAr: servicesAr.length > 0 ? servicesAr : ['دهان داخلي', 'معجون أصلي', 'أصباغ جوتن'],
    regionEn: regionMatch.en,
    regionAr: regionMatch.ar,
    whatsappPrefillEn: `Hello ${nameEn}, I found your profile on Fani Kuwait and need a painting quotation.`,
    whatsappPrefillAr: `مرحباً ${nameAr}، وجدت ملفك على منصة صباغ الكويت وأود طلب مقايسة.`,
    responseTimeEn: 'Within 15 minutes',
    responseTimeAr: 'خلال 15 دقيقة',
    sourceLanguage: detectedLang,
  };
}

/**
 * Transliterate common Arabic trade titles and names to English
 */
function transliterateArabicNameToEn(arabicName: string): string {
  let clean = arabicName
    .replace(/^معلم\s+/, 'Master ')
    .replace(/^صباغ\s+/, 'Painter ')
    .replace(/^ورشة\s+/, 'Workshop ')
    .replace(/^شركة\s+/, 'Company ')
    .replace(/^فني\s+/, 'Technician ');

  const nameMap: Record<string, string> = {
    'خالد تميم': 'Khaled Tamim',
    'مبارك العازمي': 'Mubarak Al-Azmi',
    'أحمد العازمي': 'Ahmad Al-Azmi',
    'فهد الرشيدي': 'Fahad Al-Rashidi',
    'بدر المطيري': 'Bader Al-Mutairi',
    'الرقي للديكور': 'Al-Raqi Decor',
    'الخليج للتشطيبات': 'Gulf Finishing Est.',
    'لمسة فن': 'Lamsat Fan Decor',
    'ألوان السور': 'Alwan Al-Soor',
    'دار النقشة': 'Dar Al-Naqsha',
  };

  for (const [ar, en] of Object.entries(nameMap)) {
    if (clean.includes(ar)) {
      clean = clean.replace(ar, en);
      return clean;
    }
  }

  return clean;
}
