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

  // الحقول المترجمة بالإنجليزية (Cloudflare Workers AI Localization)
  nameEn?: string;
  bioEn?: string;
  descriptionEn?: string;
  servicesEn?: string[];
  regionEn?: string;
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
    "reviews": 2,
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
      },
      {
        "id": 2,
        "title": "تركيب بديل رخام وبديل خشب مع إضاءة مخفية",
        "category": "ديكورات وبديل رخام",
        "description": "تنفيذ جدار تلفزيون راقي من بديل الرخام وبديل الخشب بأعلى دقة.",
        "beforeDetails": "جدار عادي بدون أي لمسات ديكورية.",
        "afterDetails": "تثبيت ألواح بديل الرخام والشرائح الخشبية بدقة مع شريط ليد مخفي.",
        "materialsUsed": "بديل رخام UV + شرائح بديل خشب تركي + سيليكون تثبيت قوي"
      }
    ],
    "customerReviews": [
      {
        "id": 101,
        "author": "م. ناصر العتيبي",
        "date": "منذ يومين",
        "rating": 5,
        "area": "حولي",
        "comment": "المعلم خالد تميم قمة في الذوق والاحترافية، دقة بالمواعيد ونظافة غير طبيعية بعد الشغل. صبغ الشقة كاملة بوقت قياسي وبدون روائح.",
        "serviceType": "دهان داخلي وديكورات",
        "verified": true
      },
      {
        "id": 102,
        "author": "أبو فهد الرشيدي",
        "date": "منذ أسبوع",
        "rating": 5,
        "area": "السالمية",
        "comment": "شغل ممتاز وسعر مناسب جداً، الألوان طلعت مطابقة تماماً للكتالوج وتغطية الأثاث كانت ممتازة.",
        "serviceType": "دهان داخلي ومعجون",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 1
  },
  {
    "id": 2,
    "slug": "معلم-مبارك-العازمي",
    "name": "معلم مبارك العازمي",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مم",
    "region": "حولي",
    "rating": "5.0",
    "reviews": 1,
    "years": 7,
    "startingAt": "20 د.ك",
    "services": [
      "دهان داخلي",
      "معجون أصلي",
      "صبغ جوتن"
    ],
    "description": "تشطيب متقن وأصباغ أصلية مع ضمان نظافة المكان وسرعة الإنجاز.",
    "tone": "ochre",
    "phone": "96597711223",
    "whatsapp": "96597711223",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "معلم مبارك العازمي - متخصص في دهان داخلي، معجون أصلي، صبغ جوتن بأعلى مستويات الجودة والالتزام بالمواعيد في مناطق حولي والعاصمة.",
    "governorates": [
      "حولي",
      "العاصمة"
    ],
    "primaryGovernorates": [
      "hawalli",
      "capital"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 3,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "20 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 1,
        "author": "سعد الشمري",
        "date": "الآن",
        "rating": 5,
        "area": "السالمية",
        "comment": "شغل احترافي ومواعيد دقيقة، أنصح بالتعامل معه.",
        "serviceType": "دهان داخلي ومعجون",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 2
  },
  {
    "id": 3,
    "slug": "معلم-أحمد-العازمي",
    "name": "معلم أحمد العازمي",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مأ",
    "region": "حولي",
    "rating": "5.0",
    "reviews": 1,
    "years": 8,
    "startingAt": "20 د.ك",
    "services": [
      "دهان داخلي",
      "أصباغ إيطالية وسيلك",
      "معجون أصلي"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة حولي وضواحيها.",
    "tone": "ochre",
    "phone": "96591000000",
    "whatsapp": "96591000000",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة حولي وضواحيها.",
    "governorates": [
      "حولي",
      "العاصمة"
    ],
    "primaryGovernorates": [
      "hawalli",
      "capital"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 4,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "20 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 2,
        "author": "فهد العبدالله",
        "date": "الآن",
        "rating": 5,
        "area": "السالمية",
        "comment": "المعلم أحمد فنان حقيقي وشغله نظيف جداً ودقيق بالموعد.",
        "serviceType": "دهان داخلي",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 3
  },
  {
    "id": 4,
    "slug": "ورشة-الرقي-للديكور",
    "name": "ورشة الرقي للديكور",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "وا",
    "region": "العاصمة",
    "rating": "5.0",
    "reviews": 1,
    "years": 12,
    "startingAt": "25 د.ك",
    "services": [
      "ديكورات وبديل رخام",
      "بديل خشب",
      "ورق جدران"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة العاصمة وضواحيها.",
    "tone": "ochre",
    "phone": "96591000001",
    "whatsapp": "96591000001",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة العاصمة وضواحيها.",
    "governorates": [
      "العاصمة",
      "حولي"
    ],
    "primaryGovernorates": [
      "capital",
      "hawalli"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "company",
    "warrantyYears": 3,
    "crewSize": 6,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "25 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 3,
        "author": "سليمان الغانم",
        "date": "الآن",
        "rating": 5,
        "area": "الروضة",
        "comment": "طاقم عمل ممتاز وخدمة راقية وخامات أصلية.",
        "serviceType": "ديكورات وبديل رخام",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 4
  },
  {
    "id": 5,
    "slug": "معلم-فهد-الرشيدي",
    "name": "معلم فهد الرشيدي",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مف",
    "region": "الفروانية",
    "rating": "5.0",
    "reviews": 1,
    "years": 6,
    "startingAt": "18 د.ك",
    "services": [
      "دهان داخلي",
      "معجون وتنعيم أسقف",
      "صبغ جوتن"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الفروانية وضواحيها.",
    "tone": "ochre",
    "phone": "96591000002",
    "whatsapp": "96591000002",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الفروانية وضواحيها.",
    "governorates": [
      "الفروانية",
      "العاصمة"
    ],
    "primaryGovernorates": [
      "farwaniyah",
      "capital"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 3,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "18 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 4,
        "author": "محمد المطوع",
        "date": "الآن",
        "rating": 5,
        "area": "صباح الناصر",
        "comment": "صباح الناصر فخورين بوجود هذا الصباغ، أمانة ونظافة بعد العمل.",
        "serviceType": "دهان داخلي",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 5
  },
  {
    "id": 6,
    "slug": "شركة-الخليج-للتشطيبات",
    "name": "شركة الخليج للتشطيبات",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "شا",
    "region": "الأحمدي",
    "rating": "5.0",
    "reviews": 1,
    "years": 15,
    "startingAt": "35 د.ك",
    "services": [
      "دهان خارجي",
      "واجهات سيجما",
      "عوازل مائية وحرارية"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الأحمدي وضواحيها.",
    "tone": "ochre",
    "phone": "96591000003",
    "whatsapp": "96591000003",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الأحمدي وضواحيها.",
    "governorates": [
      "الأحمدي",
      "مبارك الكبير"
    ],
    "primaryGovernorates": [
      "ahmadi",
      "mubarak-al-kabeer"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "company",
    "warrantyYears": 3,
    "crewSize": 8,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "35 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 5,
        "author": "خالد السبيعي",
        "date": "الآن",
        "rating": 5,
        "area": "الفحيحيل",
        "comment": "شركة احترافية وأسعارهم ممتازة مقارنة بالسوق وضمان حقيقي.",
        "serviceType": "دهان خارجي",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 6
  },
  {
    "id": 7,
    "slug": "معلم-بدر-المطيري",
    "name": "معلم بدر المطيري",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مب",
    "region": "مبارك الكبير",
    "rating": "5.0",
    "reviews": 1,
    "years": 7,
    "startingAt": "19 د.ك",
    "services": [
      "ورق جدران",
      "بديل فوم وبانوهات",
      "دهان غرف نوم"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة مبارك الكبير وضواحيها.",
    "tone": "ochre",
    "phone": "96591000004",
    "whatsapp": "96591000004",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة مبارك الكبير وضواحيها.",
    "governorates": [
      "مبارك الكبير",
      "حولي"
    ],
    "primaryGovernorates": [
      "mubarak-al-kabeer",
      "hawalli"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 3,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "19 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 6,
        "author": "عبدالرحمن الشطي",
        "date": "الآن",
        "rating": 5,
        "area": "القصور",
        "comment": "شغل البانوهات والصبغ متقن بدون أي فراغات.",
        "serviceType": "ورق جدران",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 7
  },
  {
    "id": 8,
    "slug": "معلم-ناصر-السبيعي",
    "name": "معلم ناصر السبيعي",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "من",
    "region": "الجهراء",
    "rating": "5.0",
    "reviews": 1,
    "years": 9,
    "startingAt": "20 د.ك",
    "services": [
      "ترميم وعلاج رطوبة",
      "معجون وسنفرة",
      "دهان داخلي"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الجهراء وضواحيها.",
    "tone": "ochre",
    "phone": "96591000005",
    "whatsapp": "96591000005",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الجهراء وضواحيها.",
    "governorates": [
      "الجهراء",
      "الفروانية"
    ],
    "primaryGovernorates": [
      "jahra",
      "farwaniyah"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 4,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "20 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 7,
        "author": "جاسم الظفيري",
        "date": "الآن",
        "rating": 5,
        "area": "الواحة",
        "comment": "حل مشكلة الرطوبة اللي تعبتني سنين، يعطيه العافية.",
        "serviceType": "ترميم وعلاج رطوبة",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 8
  },
  {
    "id": 9,
    "slug": "معلم-يوسف-الهاجري",
    "name": "معلم يوسف الهاجري",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مي",
    "region": "حولي",
    "rating": "5.0",
    "reviews": 1,
    "years": 10,
    "startingAt": "22 د.ك",
    "services": [
      "أصباغ إيطالية",
      "ماركو بولو",
      "دهان غرف أطفال"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة حولي وضواحيها.",
    "tone": "ochre",
    "phone": "96591000006",
    "whatsapp": "96591000006",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة حولي وضواحيها.",
    "governorates": [
      "حولي",
      "العاصمة"
    ],
    "primaryGovernorates": [
      "hawalli",
      "capital"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 3,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "22 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 8,
        "author": "عادل بهبهاني",
        "date": "الآن",
        "rating": 5,
        "area": "الجابرية",
        "comment": "ذوق راقي واختيار رائع للألوان وتناسقها.",
        "serviceType": "أصباغ إيطالية",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 9
  },
  {
    "id": 10,
    "slug": "مؤسسة-التميز-للصباغة",
    "name": "مؤسسة التميز للصباغة",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "ما",
    "region": "العاصمة",
    "rating": "5.0",
    "reviews": 1,
    "years": 14,
    "startingAt": "24 د.ك",
    "services": [
      "دهان قسائم جديدة",
      "معجون رش أمريكي",
      "أصباغ كابارول"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة العاصمة وضواحيها.",
    "tone": "ochre",
    "phone": "96591000007",
    "whatsapp": "96591000007",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة العاصمة وضواحيها.",
    "governorates": [
      "العاصمة",
      "حولي",
      "الفروانية"
    ],
    "primaryGovernorates": [
      "capital",
      "hawalli",
      "farwaniyah"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "company",
    "warrantyYears": 3,
    "crewSize": 10,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "24 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 9,
        "author": "عبدالعزيز البابطين",
        "date": "الآن",
        "rating": 5,
        "area": "الشويخ",
        "comment": "التزام كامل بالمواصفات والوقت المحدد بالعقد.",
        "serviceType": "دهان قسائم جديدة",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 10
  },
  {
    "id": 11,
    "slug": "معلم-حمدان-الدوسري",
    "name": "معلم حمدان الدوسري",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مح",
    "region": "الأحمدي",
    "rating": "5.0",
    "reviews": 1,
    "years": 11,
    "startingAt": "17 د.ك",
    "services": [
      "تشطيب قسائم كاملة",
      "أصباغ مقاومة للرطوبة",
      "دهان داخلي"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الأحمدي وضواحيها.",
    "tone": "ochre",
    "phone": "96591000008",
    "whatsapp": "96591000008",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الأحمدي وضواحيها.",
    "governorates": [
      "الأحمدي"
    ],
    "primaryGovernorates": [
      "ahmadi"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 5,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "17 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 10,
        "author": "سعود العجمي",
        "date": "الآن",
        "rating": 5,
        "area": "صباح الأحمد",
        "comment": "أفضل صباغ تعاملت معه في مدينة صباح الأحمد، سرعة وأمانة.",
        "serviceType": "تشطيب قسائم كاملة",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 11
  },
  {
    "id": 12,
    "slug": "معلم-فيصل-الحربي",
    "name": "معلم فيصل الحربي",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مف",
    "region": "الفروانية",
    "rating": "5.0",
    "reviews": 1,
    "years": 6,
    "startingAt": "18 د.ك",
    "services": [
      "صبغ أبواب خشب ولاكيه",
      "دهان ناري",
      "دهان جدران"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الفروانية وضواحيها.",
    "tone": "ochre",
    "phone": "96591000009",
    "whatsapp": "96591000009",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الفروانية وضواحيها.",
    "governorates": [
      "الفروانية",
      "الجهراء"
    ],
    "primaryGovernorates": [
      "farwaniyah",
      "jahra"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 3,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "18 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 11,
        "author": "طلال العنزي",
        "date": "الآن",
        "rating": 5,
        "area": "الفردوس",
        "comment": "الأبواب رجعت كأنها جديدة تبارك الرحمن، تسلم إيده.",
        "serviceType": "صبغ أبواب خشب ولاكيه",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 12
  },
  {
    "id": 13,
    "slug": "معلم-راشد-العنزي",
    "name": "معلم راشد العنزي",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مر",
    "region": "الجهراء",
    "rating": "5.0",
    "reviews": 1,
    "years": 9,
    "startingAt": "22 د.ك",
    "services": [
      "دهان خارجي",
      "عوازل مائية وأسطح",
      "صبغ جوتن خشن"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الجهراء وضواحيها.",
    "tone": "ochre",
    "phone": "96591000010",
    "whatsapp": "96591000010",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الجهراء وضواحيها.",
    "governorates": [
      "الجهراء",
      "العاصمة"
    ],
    "primaryGovernorates": [
      "jahra",
      "capital"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 4,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "22 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 12,
        "author": "مشعل الشمري",
        "date": "الآن",
        "rating": 5,
        "area": "الجهراء القديمة",
        "comment": "شغل ممتاز والعوازل مجربة وممتازة.",
        "serviceType": "دهان خارجي",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 13
  },
  {
    "id": 14,
    "slug": "معلم-طارق-الخالدي",
    "name": "معلم طارق الخالدي",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مط",
    "region": "مبارك الكبير",
    "rating": "5.0",
    "reviews": 1,
    "years": 8,
    "startingAt": "20 د.ك",
    "services": [
      "ديكورات جبس بورد",
      "صبغ أسقف ناعم",
      "أصباغ سيلك"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة مبارك الكبير وضواحيها.",
    "tone": "ochre",
    "phone": "96591000011",
    "whatsapp": "96591000011",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة مبارك الكبير وضواحيها.",
    "governorates": [
      "مبارك الكبير",
      "حولي"
    ],
    "primaryGovernorates": [
      "mubarak-al-kabeer",
      "hawalli"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 4,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "20 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 13,
        "author": "فهد الدبوس",
        "date": "الآن",
        "rating": 5,
        "area": "صباح السالم",
        "comment": "دقة في الزوايا والأسقف المستعارة بدون أي تعرجات.",
        "serviceType": "ديكورات جبس بورد",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 14
  },
  {
    "id": 15,
    "slug": "شركة-دار-الألوان-الكويتية",
    "name": "شركة دار الألوان الكويتية",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "شد",
    "region": "العاصمة",
    "rating": "5.0",
    "reviews": 1,
    "years": 18,
    "startingAt": "28 د.ك",
    "services": [
      "مقاولات صبغ متكاملة",
      "استشارات ألوان",
      "كفالة 5 سنوات"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة العاصمة وضواحيها.",
    "tone": "ochre",
    "phone": "96591000012",
    "whatsapp": "96591000012",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة العاصمة وضواحيها.",
    "governorates": [
      "العاصمة",
      "حولي",
      "مبارك الكبير"
    ],
    "primaryGovernorates": [
      "capital",
      "hawalli",
      "mubarak-al-kabeer"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "company",
    "warrantyYears": 3,
    "crewSize": 12,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "28 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 14,
        "author": "نواف الصباح",
        "date": "الآن",
        "rating": 5,
        "area": "الدسمة",
        "comment": "مستوى احترافي عالي جداً وفريق منظم ونظيف.",
        "serviceType": "مقاولات صبغ متكاملة",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 15
  },
  {
    "id": 16,
    "slug": "معلم-جابر-الشمري",
    "name": "معلم جابر الشمري",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مج",
    "region": "الفروانية",
    "rating": "4.0",
    "reviews": 1,
    "years": 5,
    "startingAt": "16 د.ك",
    "services": [
      "دهان اقتصادي وسريع",
      "تسليم فوري",
      "معجون شقوق"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الفروانية وضواحيها.",
    "tone": "ochre",
    "phone": "96591000013",
    "whatsapp": "96591000013",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الفروانية وضواحيها.",
    "governorates": [
      "الفروانية",
      "الأحمدي"
    ],
    "primaryGovernorates": [
      "farwaniyah",
      "ahmadi"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 3,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "16 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 15,
        "author": "مبارك الرشيدي",
        "date": "الآن",
        "rating": 4,
        "area": "خيطان",
        "comment": "سريع وملتزم بالوقت وسعره جداً مناسب.",
        "serviceType": "دهان اقتصادي وسريع",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 16
  },
  {
    "id": 17,
    "slug": "معلم-صالح-القحطاني",
    "name": "معلم صالح القحطاني",
    "avatarUrl": null,
    "avatarPublicId": null,
    "initials": "مص",
    "region": "الأحمدي",
    "rating": "5.0",
    "reviews": 1,
    "years": 10,
    "startingAt": "21 د.ك",
    "services": [
      "دهانات فاخرة",
      "أصباغ زيتي ومائي",
      "معجون أمريكي"
    ],
    "description": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الأحمدي وضواحيها.",
    "tone": "ochre",
    "phone": "96591000014",
    "whatsapp": "96591000014",
    "whatsappPrefill": "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
    "bio": "صباغ محترف يقدم أفضل خدمات التشطيب في محافظة الأحمدي وضواحيها.",
    "governorates": [
      "الأحمدي",
      "مبارك الكبير"
    ],
    "primaryGovernorates": [
      "ahmadi",
      "mubarak-al-kabeer"
    ],
    "isAvailableToday": true,
    "responseTime": "خلال 15 دقيقة",
    "coverageAreaIds": [],
    "isVerified": true,
    "status": "approved",
    "accountType": "individual",
    "warrantyYears": 3,
    "crewSize": 4,
    "paintBrands": [
      "جوتن"
    ],
    "completedProjects": 10,
    "pricingList": [
      {
        "item": "صبغ غرفة قياسية (4×4 م) وجهين",
        "price": "21 د.ك - 25 د.ك",
        "note": "شامل حماية الأثاث والمواد"
      },
      {
        "item": "صبغ صالة أو مجلس",
        "price": "35 - 55 د.ك",
        "note": "شامل معجون وتنعيم الجدران"
      },
      {
        "item": "تركيب ديكورات أو ورق جدران",
        "price": "5 - 8 د.ك",
        "note": "للرول الواحد أو المتر المربع"
      }
    ],
    "gallery": [],
    "customerReviews": [
      {
        "id": 16,
        "author": "عبدالله الهاجري",
        "date": "الآن",
        "rating": 5,
        "area": "المنقف",
        "comment": "ما شاء الله على الصباغ، ديوانيتنا طلعت تحفة والكل سألنا عنه.",
        "serviceType": "دهانات فاخرة",
        "verified": true
      }
    ],
    "portfolioProjects": [],
    "displayOrder": 17
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
