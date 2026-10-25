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
}

export const PAINTERS_DATA: Painter[] = [
  {
    id: 1,
    slug: 'مؤسسة-لون-الدار',
    name: 'مؤسسة لون الدار',
    avatarUrl: 'https://res.cloudinary.com/lgbve8cd/image/upload/v1792828504/sabbagh/avatars/dkltoh2lfbfxs7ti4uiz.webp',
    avatarPublicId: 'sabbagh/avatars/dkltoh2lfbfxs7ti4uiz',
    initials: 'لد',
    region: 'السالمية',
    rating: '4.9',
    reviews: 86,
    years: 11,
    startingAt: '18 د.ك',
    services: ['دهان داخلي', 'ورق جدران', 'معجون'],
    description: 'تشطيب مرتب للبيوت والشقق، مع معاينة الألوان قبل البدء والاهتمام بحماية الأثاث.',
    tone: '',
    phone: '+965 94412356',
    whatsapp: '96594412356',
    whatsappPrefill: 'السلام عليكم مؤسسة لون الدار، شفت ملفكم في صباغ الكويت وأبي استفسر عن صبغ داخلي وموعد معاينة.',
    bio: 'فريق متخصص بأعمال الدهانات الداخلية الراقية للشقق والفلل في السالمية وحوالي والعاصمة. نعتمد معجون جوتن الأصلي وصنفرة شفط حديثة لتقليل الغبار داخل البيوت المأهولة، مع ضمان حماية كاملة للمفروشات والأرضيات قبل أن نلمس أي جدار.',
    governorates: ['حولي', 'العاصمة', 'مبارك الكبير'],
    primaryGovernorates: ['hawalli', 'capital', 'mubarak-al-kabeer'],
    isAvailableToday: true,
    responseTime: 'خلال 30 دقيقة',
    coverageAreaIds: [
      'al-salmiya', 'hawalli-city', 'al-rumaithiya', 'al-jabriya', 'mishref', 'bayan', 'salwa', 'al-shaab', 'al-bidaa',
      'al-dasma', 'al-daiya', 'abdullah-al-salem', 'al-rawda', 'al-shamiya', 'al-nuzha', 'kaifan', 'qurtoba', 'al-surra', 'al-yarmouk',
      'sabah-al-salem', 'al-messilah', 'al-adan', 'al-qurain'
    ],
    warrantyYears: 2,
    crewSize: 6,
    paintBrands: ['جوتن فينوماستيك (Jotun)', 'كابارول (Caparol)', 'همبل (Hempel)'],
    completedProjects: 420,
    pricingList: [
      { item: 'صبغ غرفة نوم قياسية (4×4 م) وجهين', price: '18 - 25 د.ك', note: 'شامل حماية الأثاث وسكينة معجون' },
      { item: 'صبغ غرفة ماستر كاملة مع السقف والتنعيم', price: '28 - 38 د.ك', note: 'شامل صبغ السقف المطفي والجدران ربع لمعة' },
      { item: 'صبغ صالة استقبال أو مجلس كبير', price: '45 - 75 د.ك', note: 'يعتمد على مساحة الصالة والزوايا والديكور' },
      { item: 'تركيب ورق جدران رول كوري / إيطالي', price: '4 - 6 د.ك', note: 'للرول الواحد شامل الغراء الأصلي ضد الرطوبة' },
      { item: 'معالجة الشروخ والنش مع طبقة عازل مائي', price: '12 - 20 د.ك', note: 'للجدار الواحد قبل تطبيق الصبغ' },
    ],
    gallery: [
      {
        id: 101,
        title: 'تجديد صالة شقة دوبلكس بالسالمية',
        category: 'دهان داخلي',
        description: 'تحويل جدران قديمة متشققة إلى مظهر أوف وايت حريري ناعم بتناسق مع الإضاءة المخفية.',
        beforeLabel: 'قبل الصبغ',
        afterLabel: 'بعد التشطيب النهائي',
        beforeDetails: 'جدران باهتة وخدوش بارزة مع اصفرار ناتج عن الرطوبة وتشققات في زوايا الجبس.',
        afterDetails: 'سحب 3 سكينات معجون جوتن فائق النعومة، وصنفرة آلية، ودهان وجهين فينوماستيك ربع لمعة كود (1024 Timeless).',
        materialsUsed: 'جوتن فينوماستيك بيور كولورز + معجون جوتن انتيريور',
      },
      {
        id: 102,
        title: 'غرفة نوم رئيسية مع جدار ديكوري',
        category: 'ورق جدران ودهان',
        description: 'تركيب ورق جدران بارز الملمس خلف السرير ودهان باقي الجدران بدرجة بيج هادئ.',
        beforeLabel: 'قبل العمل',
        afterLabel: 'النتيجة النهائية',
        beforeDetails: 'صبغ زيتي قديم وبقع لاصقة وتفاوت بلون الإضاءة.',
        afterDetails: 'صنفرة كاملة وبرايمر مائي عازل، تركيب ورق جدران كوري ضد الرطوبة مع صبغ متناغم لباقي الغرفة.',
        materialsUsed: 'ورق جدران كوري 16.5 م² + دهان جوتن مائي مطفي',
      },
    ],
    customerReviews: [
      {
        id: 1,
        author: 'أم فهد الخالدي',
        date: 'منذ أسبوعين',
        rating: 5,
        area: 'السالمية',
        comment: 'أمانة شغلهم يبيض الوجه. نظافة تامة وأهم شي عندي تغطية الأثاث بالنايلون والشطرطون. خلصوا صبغ غرفتين بيوم ونص بدون أي روائح مزعجة.',
        serviceType: 'دهان داخلي',
        verified: true,
      },
      {
        id: 2,
        author: 'م. أحمد السريّع',
        date: 'منذ شهر',
        rating: 5,
        area: 'الرميثية',
        comment: 'دقة في موعد المعاينة وأسعارهم واضحة بدون لف ودوران. الألوان طلعت مطابقة لكتالوج جوتن بالضبط.',
        serviceType: 'تجديد شقة كاملة',
        verified: true,
      },
      {
        id: 3,
        author: 'بو طلال القطان',
        date: 'منذ شهرين',
        rating: 4.8,
        area: 'الشعب البحري',
        comment: 'معلم ممتاز وصبور على طلباتنا بتعديل درجات الألوان، وسريع في التنفيذ. أنصح بالتعامل معه.',
        serviceType: 'ورق جدران ودهان',
        verified: true,
      },
    ],
  },
  {
    id: 2,
    slug: 'ورشة-الصفوة-للديكور',
    name: 'ورشة الصفوة للديكور والأصباغ الحديثة',
    avatarUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
    initials: 'صف',
    region: 'حولي',
    rating: '4.8',
    reviews: 64,
    years: 8,
    startingAt: '15 د.ك',
    services: ['دهان داخلي', 'دهان خارجي', 'ترميم'],
    description: 'أعمال صبغ وتجديد للمنازل، ومواعيد مرنة تناسب سكان حولي والمناطق القريبة.',
    tone: 'ochre',
    phone: '+965 97723489',
    whatsapp: '96597723489',
    whatsappPrefill: 'مرحبا بو راشد، لقيت رقمك في صباغ الكويت وحاب استفسر عن صبغ وترميم شقة.',
    bio: 'معلم دهانات متمرس في أعمال التجديد السريع والترميم وصيانة الجدران التالفة من الرطوبة والمكيفات. نعمل بسرعة قياسية مع الحفاظ على نظافة المكان وجودة المواد الأصلية.',
    governorates: ['حولي', 'العاصمة', 'الفروانية'],
    primaryGovernorates: ['hawalli', 'capital', 'farwaniyah'],
    isAvailableToday: true,
    responseTime: 'خلال 45 دقيقة',
    coverageAreaIds: [
      'hawalli-city', 'al-salmiya', 'al-jabriya', 'al-rumaithiya', 'al-nigra', 'dhaher-al-surra', 'al-salam', 'al-zahra',
      'shuwaikh-residential', 'shuwaikh-industrial', 'al-faiha', 'kaifan', 'al-khaldiya', 'al-adailiya',
      'farwaniyah-city', 'khaitan', 'al-omariya', 'al-rehab', 'al-riggae', 'al-ardhiya'
    ],
    warrantyYears: 2,
    crewSize: 4,
    paintBrands: ['جوتن (Jotun)', 'همبل (Hempel)', 'ناشيونال (National)'],
    completedProjects: 310,
    pricingList: [
      { item: 'صبغ غرفة عادية تشطيب سريع', price: '15 - 22 د.ك', note: 'وجهين دهان مائي قابل للمسح' },
      { item: 'صبغ شقة استثمارية 2 غرفة وصالة', price: '60 - 85 د.ك', note: 'شامل المواد والصبغ المائي النظيف' },
      { item: 'ترميم وعلاج رطوبة زوايا النوافذ والمكيفات', price: '10 - 18 د.ك', note: 'تكسير القشور ووضع معجون مقاوم للرطوبة' },
      { item: 'دهان بيبان وأبواب خشب باللاكيه أو الزيتي', price: '7 - 12 د.ك', note: 'للباب الواحد شامل الحف والتأسيس' },
    ],
    gallery: [
      {
        id: 201,
        title: 'ترميم طوفة متضررة من رطوبة التكييف في حولي',
        category: 'ترميم ودهان',
        description: 'معالجة تسرب رطوبة قديم أدى لانتفاخ وسقوط الدهان.',
        beforeLabel: 'قبل المعالجة',
        afterLabel: 'بعد الترميم',
        beforeDetails: 'انتفاخ شديد في اللياسة وتساقط قشور الصبغ الزيتي وسواد ناتج عن العفن.',
        afterDetails: 'كشط كامل حتى اللياسة، معالجة بمادة مانعة للرطوبة وسكينة معجون وتر برايمر، ثم دهان نهائي متطابق.',
        materialsUsed: 'عازل رطوبة + برايمر مقاوم للعفن + جوتن فينوماستيك',
      },
    ],
    customerReviews: [
      {
        id: 4,
        author: 'سالم الشمري',
        date: 'منذ 3 أسابيع',
        rating: 5,
        area: 'حولي',
        comment: 'بو راشد صباغ شاطر وأسعاره جداً معقولة مقارنة بالسوق. جاء بالموعد المحدد وخلص الشغل قبل الوقت.',
        serviceType: 'ترميم ودهان شقة',
        verified: true,
      },
    ],
  },
  {
    id: 3,
    slug: 'صباغ-قسائم-الأحمدي',
    name: 'صباغ قسائم الأحمدي والمنطقة العاشرة',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    initials: 'قم',
    region: 'الفروانية',
    rating: '4.7',
    reviews: 53,
    years: 7,
    startingAt: '20 د.ك',
    services: ['ورق جدران', 'دهان داخلي', 'ديكورات'],
    description: 'اختيارات ألوان هادئة وتنفيذ ديكورات جدارية بسيطة للمجالس وغرف النوم.',
    tone: 'rose',
    phone: '+965 96634512',
    whatsapp: '96596634512',
    whatsappPrefill: 'أهلاً ورشة لمسة فن، حاب استفسر عن تركيب بديل الرخام وبديل الخشب وورق جدران.',
    bio: 'فريق شغوف بالديكورات الحديثة في الكويت: بديل الرخام، بديل الخشب، البانوهات الجبسية مع أصباغ ناعمة بتدرجات الإضاءة الدافئة. نقدم نصائح لاختيار الألوان حسب توزيع الأثاث.',
    governorates: ['الفروانية', 'مبارك الكبير', 'الأحمدي'],
    primaryGovernorates: ['farwaniyah', 'mubarak-al-kabeer', 'ahmadi'],
    isAvailableToday: false,
    responseTime: 'خلال 1 - 2 ساعة',
    coverageAreaIds: [
      'farwaniyah-city', 'khaitan', 'ishbiliya', 'al-rehab', 'al-andalus', 'sabah-al-nasser', 'west-abdullah-al-mubarak', 'south-abdullah-al-mubarak', 'al-firdous',
      'sabah-al-salem', 'al-adan', 'al-qusour', 'al-qurain', 'abu-ftaira', 'al-fnaitees',
      'al-fintas', 'al-egaila', 'mahboula', 'al-mangaf', 'abu-halifa'
    ],
    warrantyYears: 2,
    crewSize: 5,
    paintBrands: ['جوتن ليدي ديزاين (Lady Design)', 'كابارول', 'ورق كوري نانو'],
    completedProjects: 260,
    pricingList: [
      { item: 'صبغ غرفة مع ديكور جدار مميز (Feature Wall)', price: '25 - 40 د.ك', note: 'تطبيق لون مغاير أو تأثير ناعم' },
      { item: 'تركيب لوح بديل الرخام (PVC Marble)', price: '12 - 18 د.ك', note: 'للوح الكامل 122×280 سم شامل السيليكون والمصنعية' },
      { item: 'تركيب شرائح بديل الخشب WPC', price: '4 - 7 د.ك', note: 'للشريحة الواحدة مع الزوايا النهائية' },
      { item: 'تفصيل وتركيب بانوهات جدارية فوم / جبس', price: '1.5 - 2.5 د.ك', note: 'للمتر الطولي مع صبغها بنفس لون الجدار' },
    ],
    gallery: [
      {
        id: 301,
        title: 'تنسيق جدار تلفزيون ببديل الرخام والخشب في خيطان',
        category: 'ديكورات جدارية',
        description: 'تصميم جدار رئيسي يجمع بين فخامة الرخام ودفء الخشب مع ليد مخفي.',
        beforeLabel: 'قبل التركيب',
        afterLabel: 'بعد الإنجاز',
        beforeDetails: 'جدار سادة تقليدي مع أسلاك تلفزيون ومقابس ظاهرة تشوه المنظر.',
        afterDetails: 'إخفاء الأسلاك داخل قنوات، تركيب لوحين بديل رخام أبيض إسباني مع شرائح خشبية جانبية وإضاءة مخفية.',
        materialsUsed: 'بديل رخام PVC + شرائح بديل خشب تركي + سيليكون عالي التماسك',
      },
    ],
    customerReviews: [
      {
        id: 5,
        author: 'خالد العنزي',
        date: 'منذ شهر',
        rating: 5,
        area: 'الفروانية',
        comment: 'سوو لي جدار التلفزيون ببديل الخشب والرخام مع بانوهات، الشغل طلع قطعة فنية تبارك الرحمن. سرعة ودقة متناهية.',
        serviceType: 'ديكورات وبديل الرخام',
        verified: true,
      },
    ],
  },
  {
    id: 4,
    slug: 'صباغ-الجهراء-المحترف',
    name: 'صباغ الجهراء المحترف',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    initials: 'جم',
    region: 'الأحمدي',
    rating: '4.9',
    reviews: 42,
    years: 13,
    startingAt: '22 د.ك',
    services: ['دهان خارجي', 'ترميم', 'دهان داخلي'],
    description: 'خبرة في الواجهات الخارجية ومعالجة آثار الرطوبة والتشققات قبل الدهان.',
    tone: 'blue',
    phone: '+965 98845623',
    whatsapp: '96598845623',
    whatsappPrefill: 'السلام عليكم صباغ الديرة، نحتاج عرض سعر لصبغ واجهة فيلا خارجية مع معالجة الشروخ.',
    bio: 'خبرة تزيد عن 13 سنة في تشطيب واجهات الفلل والقسائم في الأحمدي والمنقف وصباح الأحمد. متخصصون في دهانات جوتاشيلد المقاومة لحرارة صيف الكويت الشديدة والغبار والأملاح، مع توفير السقالات المعتمدة والضمان الخطي.',
    governorates: ['الأحمدي', 'مبارك الكبير', 'العاصمة'],
    primaryGovernorates: ['ahmadi', 'mubarak-al-kabeer', 'capital'],
    isAvailableToday: true,
    responseTime: 'خلال 30 دقيقة',
    coverageAreaIds: [
      'ahmadi-city', 'al-fintas', 'al-egaila', 'mahboula', 'al-sabahiya', 'al-mangaf', 'al-fahaheel', 'sabah-al-ahmad-residential', 'sabah-al-ahmad-sea-city', 'al-khiran', 'al-riqqa', 'hadiya',
      'sabah-al-salem', 'al-messilah', 'abu-ftaira', 'al-masayel', 'abu-al-hasaniya',
      'kuwait-city', 'shuwaikh-industrial', 'al-rai', 'dasman'
    ],
    warrantyYears: 3,
    crewSize: 8,
    paintBrands: ['جوتن جوتاشيلد (Jotashield Extreme)', 'همبل بروتكتيف', 'كابارول اكستيريور'],
    completedProjects: 510,
    pricingList: [
      { item: 'صبغ داخلي للغرفة أو الصالة', price: '22 - 35 د.ك', note: 'شامل المعجون والدهان المقاوم للرطوبة' },
      { item: 'صبغ واجهة فيلا كاملة معالجة وصباغة جوتاشيلد', price: '380 - 850 د.ك', note: 'حسب الارتفاع وعدد الأوجه ومساحة الواجهة' },
      { item: 'معالجة الشروخ الإنشائية وفواصل التمدد بمواد مطاطية', price: '35 - 70 د.ك', note: 'معجون مطاطي ألماني بوليمري يمنع تجدد الشرخ' },
      { item: 'عزل أسقف وجدران خارجية بطبقة أكرليك عاكسة للحرارة', price: '1.2 - 1.8 د.ك', note: 'للمتر المربع' },
    ],
    gallery: [
      {
        id: 401,
        title: 'تجديد واجهة قسيمة كاملة في صباح الأحمد',
        category: 'دهان خارجي',
        description: 'معالجة تصدعات الشمس والغبار وتطبيق جوتاشيلد العاكس للحرارة.',
        beforeLabel: 'قبل الصبغ الخارجي',
        afterLabel: 'الواجهة بعد التجديد',
        beforeDetails: 'بهتان شديد للون الواجهة بسبب الشمس القوية وشروخ شعرية تسرب الرطوبة وقت الأمطار.',
        afterDetails: 'غسيل بالضغط العالي، فتح وتعبئة الشروخ بمعجون مطاطي مرن، طبقة برايمر زيتي مانع للأملاح، وجهين جوتاشيلد اكستريم.',
        materialsUsed: 'جوتن جوتاشيلد إكستريم كول ريفلكت + معجون مرن ضد الشروخ',
      },
    ],
    customerReviews: [
      {
        id: 6,
        author: 'عبدالله الهاجري',
        date: 'منذ شهرين',
        rating: 5,
        area: 'صباح الأحمد السكنية',
        comment: 'صبغوا لي قسيمتي من الخارج بالكامل مع السقالات. التزام بالوقت وشغل نظيف جداً وتفاوض مريح بالدفعات.',
        serviceType: 'صبغ واجهة فيلا خارجية',
        verified: true,
      },
    ],
  },
  {
    id: 5,
    slug: 'فني-صبغ-وديكورات-الكويت',
    name: 'فني صبغ وديكورات الكويت',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    initials: 'صب',
    region: 'الجهراء',
    rating: '4.6',
    reviews: 37,
    years: 6,
    startingAt: '16 د.ك',
    services: ['دهان داخلي', 'معجون', 'ترميم'],
    description: 'صبغ وتجديد الشقق والبيوت في الجهراء، مع توضيح نطاق العمل والتكلفة مسبقاً.',
    tone: 'ochre',
    phone: '+965 93356781',
    whatsapp: '96593356781',
    whatsappPrefill: 'مرحبا ألوان السور، عندي شقة بالجهراء وأبي أعرف السعر والموعد المتاح للمعاينه.',
    bio: 'خدمة سريعة ومخلصة لأهالي الجهراء وسعد العبدالله والمطلاع. نوفر عمالة مدربة ملتزمة بالهدوء وحماية مقتنيات المنزل، مع أسعار مناسبة وشفافة دون أي تكاليف مخفية.',
    governorates: ['الجهراء', 'العاصمة'],
    primaryGovernorates: ['jahra', 'capital'],
    isAvailableToday: true,
    responseTime: 'خلال 20 دقيقة',
    coverageAreaIds: [
      'al-jahra-old', 'saad-al-abdullah', 'al-mutlaa', 'al-qasr', 'al-naseem', 'al-naeem', 'al-waha', 'al-oyoun', 'south-saad-al-abdullah', 'teima',
      'jaber-al-ahmad', 'sulaibikhat', 'al-doha', 'al-nahda', 'al-qairawan', 'gharnata'
    ],
    warrantyYears: 2,
    crewSize: 5,
    paintBrands: ['جوتن (Jotun)', 'ناشيونال', 'همبل'],
    completedProjects: 220,
    pricingList: [
      { item: 'صبغ غرفة عادية وجهين', price: '16 - 24 د.ك', note: 'شامل الصنفرة والتنظيف بعد الانتهاء' },
      { item: 'صبغ شقة جديدة تسليم مفتاح بالمطلاع', price: '110 - 180 د.ك', note: 'تأسيس معجون كامل 3 سكينات مع الصبغ' },
      { item: 'صبغ مجلس ديوانية مع تنسيق درجات فخمة', price: '40 - 70 د.ك', note: 'ألوان كلاسيكية هادئة تعكس هيبة المجلس' },
    ],
    gallery: [
      {
        id: 501,
        title: 'صبغ وتشطيب ديوانية في سعد العبدالله',
        category: 'دهان داخلي',
        description: 'تشطيب ناعم بألوان مطفية راقية تعطي اتساعاً للمجلس وفخامة للإضاءة.',
        beforeLabel: 'قبل الصبغ',
        afterLabel: 'الديوانية بعد التشطيب',
        beforeDetails: 'جدران أسمنتية جديدة تحتاج لتأسيس معجون عميق وصنفرة مستوية.',
        afterDetails: 'سحب 3 أوجه معجون حريري، مع برايمر مائي ووجهين صبغ فينوماستيك لون بيج هادئ مع إطار جبسي ناصع البياض.',
        materialsUsed: 'معجون جوتن بريمير + فينوماستيك مطفي ناعم',
      },
    ],
    customerReviews: [
      {
        id: 7,
        author: 'مشعل الظفيري',
        date: 'منذ أسبوعين',
        rating: 5,
        area: 'سعد العبدالله',
        comment: 'شغل ممتاز وسعر طيب مقارنة بغيرهم. خلصوا صبغ الشقة كاملة بـ 4 أيام بدون أي تعطيل.',
        serviceType: 'صبغ شقة كاملة',
        verified: true,
      },
    ],
  },
  {
    id: 6,
    slug: 'خالد-تميم',
    name: 'خالد تميم',
    avatarUrl: 'https://res.cloudinary.com/lgbve8cd/image/upload/v1792825077/sabbagh/avatars/orbygzn9i2uqkr3yr57u.webp',
    avatarPublicId: 'sabbagh/avatars/orbygzn9i2uqkr3yr57u',
    initials: 'خت',
    region: 'صباح السالم',
    rating: '4.8',
    reviews: 29,
    years: 9,
    startingAt: '24 د.ك',
    services: ['ديكورات', 'ورق جدران', 'دهان داخلي'],
    description: 'لمسات ديكورية وأعمال ورق جدران، مع عناية بالتفاصيل والزوايا النهائية.',
    tone: 'rose',
    phone: '+965 92267894',
    whatsapp: '96592267894',
    whatsappPrefill: 'السلام عليكم دار النقشة، مهتم بتركيب ورق جدران وبانوهات مع صبغ متناسق في صباح السالم.',
    bio: 'متخصصون في اللمسات الفنية الدقيقة: ورق الجدران ثلاثي الأبعاد، ديكورات الشامواه والمخمل، وتنسيق الألوان المعاصرة في صباح السالم ومبارك الكبير والقرين والقصور.',
    governorates: ['مبارك الكبير', 'حولي', 'الأحمدي'],
    primaryGovernorates: ['mubarak-al-kabeer', 'hawalli', 'ahmadi'],
    isAvailableToday: false,
    responseTime: 'خلال ساعتين',
    coverageAreaIds: [
      'sabah-al-salem', 'al-messilah', 'al-adan', 'al-qusour', 'al-qurain', 'mubarak-al-kabeer-city', 'abu-ftaira', 'al-fnaitees', 'al-masayel', 'abu-al-hasaniya',
      'al-salmiya', 'al-rumaithiya', 'bayan', 'mishref', 'salwa', 'al-bidaa', 'al-jabriya',
      'al-fintas', 'al-egaila', 'al-dhaher', 'mahboula'
    ],
    warrantyYears: 2,
    crewSize: 4,
    paintBrands: ['جوتن ليدي', 'أصباغ إيطالية فانتاسيا', 'ورق جدران أوروبي'],
    completedProjects: 340,
    pricingList: [
      { item: 'صبغ غرفة كلاسيك مع زوايا دقيقة', price: '24 - 36 د.ك', note: 'شامل تحديد الإطارات والبراويز بلون مغاير' },
      { item: 'تركيب ورق جدران أوروبي / كوري عالي الجودة', price: '5 - 7 د.ك', note: 'للرول مع معالجة حواف التلاقي بدقة' },
      { item: 'صبغ ديكوري مخملي أو شامواه أو لؤلؤي', price: '30 - 55 د.ك', note: 'تطبيق تأثيرات جوتن ليدي ديزاين' },
    ],
    gallery: [
      {
        id: 601,
        title: 'تزيين صالة معيشة بصبغ لؤلؤي وورق جدران بالمسيلة',
        category: 'ديكورات وصبغ',
        description: 'إدخال تأثيرات اللؤلؤ الناعمة مع إضاءة الثريا والسبوت لايت.',
        beforeLabel: 'قبل العمل',
        afterLabel: 'بعد التشطيب الفاخر',
        beforeDetails: 'جدار باهت يفتقر للحيوية مع علامات أيدي حول مفاتيح الكهرباء.',
        afterDetails: 'تنظيف وتأسيس كامل ثم صبغ تأثير ليدي ديزاين بيرل يعكس لمعة خفيفة راقية.',
        materialsUsed: 'جوتن ليدي ديزاين بيرل + ورق جدران فرنسي فاخر',
      },
    ],
    customerReviews: [
      {
        id: 8,
        author: 'سارة العتيبي',
        date: 'منذ شهر',
        rating: 5,
        area: 'صباح السالم',
        comment: 'ما شاء الله على ذوقهم في تركيب ورق الجدران ولا غلطة بالتقاء النقشات. شكراً دار النقشة.',
        serviceType: 'ورق جدران وديكورات',
        verified: true,
      },
    ],
  },
  {
    id: 7,
    slug: 'شركة-أصباغ-الخليج-الحديثة',
    name: 'شركة أصباغ الخليج الحديثة',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    initials: 'خل',
    region: 'العاصمة',
    rating: '5.0',
    reviews: 12,
    years: 9,
    startingAt: '22 د.ك',
    services: ['دهان داخلي', 'دهان خارجي', 'ترميم ومعجون'],
    description: 'شركة معتمدة في أعمال الدهان والديكور، طاقم متكامل ومواد أصلية.',
    tone: 'ochre',
    phone: '+96599001122',
    whatsapp: '+96599001122',
    whatsappPrefill: 'السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.',
    bio: 'شركة متخصصة في التشطيبات المودرن والدهانات الداخلية والخارجية في جميع مناطق الكويت.',
    governorates: ['العاصمة', 'حولي', 'الفروانية'],
    primaryGovernorates: ['capital', 'hawalli', 'farwaniyah'],
    isAvailableToday: true,
    responseTime: 'خلال 15 دقيقة',
    coverageAreaIds: ['al-salmiya', 'hawalli-city', 'al-dasma', 'al-rawda'],
    warrantyYears: 3,
    crewSize: 8,
    paintBrands: ['جوتن (Jotun)', 'كابارول'],
    completedProjects: 190,
    pricingList: [
      { item: 'صبغ غرفة قياسية وجهين', price: '20 - 28 د.ك', note: 'شامل حماية الأثاث والمواد' }
    ],
    gallery: [],
    customerReviews: [],
  },
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
