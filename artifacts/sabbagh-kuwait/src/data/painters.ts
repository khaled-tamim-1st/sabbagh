/**
 * بيانات الصباغين والورش المعتمدة في دليل صباغ الكويت
 * Comprehensive Painters Data for Kuwait Directory
 */

import { KUWAIT_GOVERNORATES, type Area, type Governorate } from './kuwait-areas';

export interface PainterPriceItem {
  item: string;
  price: string;
  note: string;
}

export interface PainterGalleryItem {
  id: number;
  title: string;
  category: string;
  description: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeDetails: string;
  afterDetails: string;
  materialsUsed: string;
}

export interface PainterReview {
  id: number;
  author: string;
  date: string;
  rating: number;
  area: string;
  comment: string;
  serviceType: string;
  verified: boolean;
}

export interface PainterCoverageGroup {
  governorate: Governorate;
  areas: Area[];
}

export interface PortfolioImage {
  id: string;
  url: string;
  publicId?: string;
  dataUri?: string;
  caption?: string;
  isBefore?: boolean;
  isAfter?: boolean;
}

export interface PortfolioProject {
  id: string;
  painterId?: number;
  title: string;
  category: string;
  description: string;
  displayMode: 'standard' | 'before_after';
  galleryImages: PortfolioImage[];
  beforeImage?: PortfolioImage;
  afterImage?: PortfolioImage;
  beforeDetails?: string;
  afterDetails?: string;
  materialsUsed?: string;
  area?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Painter {
  id: number;
  name: string;
  avatarUrl?: string | null;
  avatar?: string;
  avatarPublicId?: string | null;
  initials: string;
  region: string;
  rating: string;
  reviews: number;
  years: number;
  startingAt: string;
  priceStart?: string | number;
  services: string[];
  description: string;
  tone: '' | 'ochre' | 'rose' | 'blue';
  
  // بيانات موسعة للبروفايل والتواصل الفوري
  phone: string;
  whatsapp: string;
  whatsappPrefill: string;
  bio: string;
  governorates: string[];
  warrantyYears: number;
  crewSize: number;
  paintBrands: string[];
  completedProjects: number;
  pricingList: PainterPriceItem[];
  gallery: PainterGalleryItem[];
  customerReviews: PainterReview[];
  portfolioProjects?: PortfolioProject[];

  // خاصية التوافر الميداني والتغطية الجغرافية
  isAvailableToday: boolean;
  responseTime: string;
  coverageAreaIds: string[];
  primaryGovernorates: string[];
  isVerified?: boolean;
  status?: 'approved' | 'pending' | 'rejected' | 'suspended';
  accountType?: 'company' | 'individual';
  companyName?: string | null;
  managerName?: string | null;
  commercialLicense?: string | null;
  sampleWorkImages?: PortfolioImage[];
  slug?: string;
  displayOrder?: number;
}

export const PAINTERS_DATA: Painter[] = [
  {
    "id": 1,
    "slug": "خالد-تميم",
    "name": "خالد تميم",
    "avatarUrl": "https://res.cloudinary.com/lgbve8cd/image/upload/c_thumb,w_160,h_160,g_face,q_auto,f_auto/v1792829294/sabbagh/avatars/piw5pk9gp5rwatbzlx2s.webp",
    "avatarPublicId": "sabbagh/avatars/piw5pk9gp5rwatbzlx2s",
    "initials": "خت",
    "region": "حولي",
    "rating": "5.0",
    "reviews": 0,
    "years": 8,
    "startingAt": "18 د.ك",
    "services": [
      "دهان داخلي",
      "معجون وتنعيم أسقف",
      "ورق جدران",
      "ديكورات وبديل رخام",
      "ترميم وعلاج رطوبة",
      "أصباغ إيطالية وسيلك",
      "دهان خارجي"
    ],
    "description": "صباغ محترف بخبرة في الدهانات الداخلية والخارجية والتشطيب الراقي، معالجة الرطوبة والتشققات، وتنفيذ أحدث الديكورات وبديل الرخام.",
    "tone": "ochre",
    "phone": "01554637673",
    "whatsapp": "01559646676",
    "whatsappPrefill": "السلام عليكم أ/ خالد تميم، اطلعت على ملفك في دليل صباغ الكويت وأود الاستفسار عن موعد معاينة وأسعار الصبغ.",
    "bio": "فني صباغة وتشطيبات معتمد في جميع محافظات الكويت. متخصص في تنفيذ الدهانات الحديثة (جوتن، كابارول)، معالجة الرطوبة والنش، سحب المعجون، وتثبيت بديل الرخام وبديل الخشب والبانوهات بدقة متناهية ونظافة تامة وحماية شاملة للأثاث.",
    "governorates": [
      "حولي",
      "العاصمة",
      "الفروانية",
      "الأحمدي",
      "الجهراء",
      "مبارك الكبير"
    ],
    "primaryGovernorates": [
      "hawalli",
      "capital",
      "farwaniyah",
      "ahmadi",
      "jahra",
      "mubarak-al-kabeer"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [
      "hawalli-city",
      "al-salmiya",
      "al-jabriya",
      "al-rawda",
      "al-dasma",
      "sabah-al-salem"
    ],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 4,
    "paintBrands": [
      "جوتن (Jotun)",
      "كابارول (Caparol)",
      "همبل (Hempel)"
    ],
    "completedProjects": 350,
    "pricingList": [
      {
        "item": "صبغ غرفة نوم كاملة (4×4 م) وجهين",
        "price": "18 - 25 د.ك",
        "note": "شامل حماية الأثاث والأرضيات وسكينة معجون"
      },
      {
        "item": "صبغ ماستر مع السقف والتنعيم",
        "price": "28 - 38 د.ك",
        "note": "شامل صبغ السقف وجدران فينوماستيك ربع لمعة"
      },
      {
        "item": "صبغ صالة استقبال كبيرة أو ديوانية",
        "price": "45 - 70 د.ك",
        "note": "يعتمد على المساحة والديكورات"
      },
      {
        "item": "تركيب ورق جدران أو بديل رخام",
        "price": "4 - 7 د.ك",
        "note": "للرول/اللوح الواحد مع المواد الأصلية"
      },
      {
        "item": "معالجة رطوبة ونش مع طبقة عازل",
        "price": "15 - 25 د.ك",
        "note": "للجدار الواحد قبل تطبيق الصبغ"
      }
    ],
    "gallery": [
      {
        "id": 1,
        "title": "تشطيب صالة مودرن بأصباغ جوتن الهادئة",
        "category": "دهان داخلي",
        "description": "صبغ جدران وسقف صالة استقبال باللون الأوف وايت مع تحديد البانوهات.",
        "beforeDetails": "جدران قديمة باهتة مع بعض الشروخ السطحية في الزوايا.",
        "afterDetails": "معالجة الشروخ وسحب معجون جوتن، ودهان وجهين فينوماستيك ربع لمعة كود Timeless.",
        "materialsUsed": "جوتن فينوماستيك بيور + معجون جوتن الأصلي"
      }
    ],
    "customerReviews": [],
    "portfolioProjects": [],
    "displayOrder": 1
  }
];

export const REGIONS_LIST = ['كل المناطق', 'السالمية', 'حولي', 'الفروانية', 'الأحمدي', 'الجهراء', 'صباح السالم'];
export const SERVICES_LIST = ['الكل', 'دهان داخلي', 'دهان خارجي', 'ورق جدران', 'ترميم', 'ديكورات', 'معجون'];

/**
 * توليد الرابط (Slug) المناسب لمحركات البحث من اسم الفني أو اسم المؤسسة
 */
export function generatePainterSlug(nameOrCompany: string, id?: number): string {
  const clean = (nameOrCompany || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, '-')
    .replace(/[^\p{L}\p{N}\-]+/gu, '')
    .replace(/^-+|-+$/g, '');
  return clean || (id ? `painter-${id}` : 'painter');
}

/**
 * استرجاع صباغ بواسطة الـ Slug أو الاسم
 */
export function getPainterBySlug(slug: string): Painter | undefined {
  if (!slug) return undefined;
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  return PAINTERS_DATA.find((p) => {
    const pSlug = (p.slug || generatePainterSlug(p.accountType === 'company' && p.companyName ? p.companyName : p.name, p.id)).toLowerCase();
    return (
      pSlug === cleanSlug ||
      p.name.trim().toLowerCase() === cleanSlug ||
      (p.companyName && p.companyName.trim().toLowerCase() === cleanSlug)
    );
  });
}

/**
 * استرجاع صباغ بواسطة معرفه الرقمي أو الـ Slug
 */
export function getPainterById(id: number | string): Painter | undefined {
  if (typeof id === 'number' || (/^\d+$/.test(String(id).trim()) && !isNaN(Number(id)))) {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const match = PAINTERS_DATA.find((p) => p.id === numericId);
    if (match) return match;
  }
  return getPainterBySlug(String(id));
}

export const getPainterBySlugOrId = getPainterById;

/**
 * استرجاع الصباغين الذين يخدمون منطقة معينة مع إمكانية التحديد بالمحافظة
 * @param areaId معرف المنطقة (مثال: 'al-salmiya' أو 'al-mutlaa')
 * @param govId معرف المحافظة الاختياري (مثال: 'hawalli' أو 'jahra')
 */
export function getPaintersByArea(areaId: string, govId?: string): Painter[] {
  const cleanAreaId = areaId.trim().toLowerCase();
  const cleanGovId = govId?.trim().toLowerCase();

  // في حال عدم تمرير معرف المحافظة، نستنتجه من دليل المناطق
  let resolvedGovId = cleanGovId;
  if (!resolvedGovId) {
    for (const gov of KUWAIT_GOVERNORATES) {
      if (gov.areas.some((a) => a.id.toLowerCase() === cleanAreaId)) {
        resolvedGovId = gov.id.toLowerCase();
        break;
      }
    }
  }

  return PAINTERS_DATA.filter((p) => {
    // 1. تطابق مباشر للمنطقة في قائمة المناطق المحددة للصباغ
    const matchesDirectArea = p.coverageAreaIds.some(
      (id) => id.toLowerCase() === cleanAreaId
    );
    if (matchesDirectArea) return true;

    // 2. تطابق بالمحافظة في حال عدم ذكر المنطقة بالتحديد لكن الصباغ يغطي المحافظة بأكملها
    if (resolvedGovId) {
      const matchesGovId = p.primaryGovernorates.some(
        (g) => g.toLowerCase() === resolvedGovId
      );
      if (matchesGovId) return true;

      const matchesGovName = p.governorates.some((gName) => {
        const govObj = KUWAIT_GOVERNORATES.find(
          (kg) => kg.id.toLowerCase() === resolvedGovId
        );
        return (
          govObj !== undefined &&
          (govObj.nameAr === gName || govObj.id.toLowerCase() === gName.toLowerCase())
        );
      });
      if (matchesGovName) return true;
    }

    return false;
  }).sort((a, b) => {
    // نضع أولاً من يغطي المنطقة تحديداً
    const aDirect = a.coverageAreaIds.some((id) => id.toLowerCase() === cleanAreaId) ? 1 : 0;
    const bDirect = b.coverageAreaIds.some((id) => id.toLowerCase() === cleanAreaId) ? 1 : 0;
    if (aDirect !== bDirect) return bDirect - aDirect;

    // ثم من هو متاح اليوم للمعاينة الفورية
    const aAvail = a.isAvailableToday ? 1 : 0;
    const bAvail = b.isAvailableToday ? 1 : 0;
    return bAvail - aAvail;
  });
}

/**
 * استرجاع كافة الصباغين الذين يغطون محافظة معينة
 * @param govId معرف المحافظة بالإنجليزية (مثل 'hawalli') أو اسمها بالعربية (مثل 'حولي')
 */
export function getPaintersByGovernorate(govId: string): Painter[] {
  const cleanId = govId.trim().toLowerCase();
  const govObj = KUWAIT_GOVERNORATES.find(
    (g) => g.id.toLowerCase() === cleanId || g.nameAr === cleanId
  );
  const targetId = govObj ? govObj.id.toLowerCase() : cleanId;
  const targetNameAr = govObj ? govObj.nameAr : cleanId;

  return PAINTERS_DATA.filter((p) => {
    return (
      p.primaryGovernorates.some((g) => g.toLowerCase() === targetId) ||
      p.governorates.some((g) => g === targetNameAr || g.toLowerCase() === targetId)
    );
  }).sort((a, b) => {
    // ترتيب المتاحين اليوم أولاً
    const aAvail = a.isAvailableToday ? 1 : 0;
    const bAvail = b.isAvailableToday ? 1 : 0;
    return bAvail - aAvail;
  });
}

/**
 * استرجاع الصباغين المتاحين اليوم للمعاينة الفورية الميدانية
 */
export function getAvailableTodayPainters(): Painter[] {
  return PAINTERS_DATA.filter((p) => p.isAvailableToday);
}

/**
 * تنظيم واسترجاع تفاصيل المحافظات والمناطق التي يغطيها الصباغ
 */
export function getPainterCoverageDetails(painter: Painter): PainterCoverageGroup[] {
  const groups: PainterCoverageGroup[] = [];

  for (const gov of KUWAIT_GOVERNORATES) {
    const isGovIncluded =
      painter.primaryGovernorates.some((g) => g.toLowerCase() === gov.id.toLowerCase()) ||
      painter.governorates.some((g) => g === gov.nameAr || g.toLowerCase() === gov.id.toLowerCase());

    const matchedAreas = gov.areas.filter((area) =>
      painter.coverageAreaIds.some((id) => id.toLowerCase() === area.id.toLowerCase())
    );

    if (matchedAreas.length > 0 || isGovIncluded) {
      groups.push({
        governorate: gov,
        areas: matchedAreas.length > 0 ? matchedAreas : gov.areas,
      });
    }
  }

  return groups;
}
