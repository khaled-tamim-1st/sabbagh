/**
 * دليل المحافظات والمناطق في دولة الكويت
 * Kuwait Governorates and Areas Data
 * 
 * يغطي كافة المحافظات الست بدقة تامة ومناطقها السكنية والاستثمارية والصناعية والمدن الجديدة
 */

export interface Area {
  id: string;
  nameAr: string;
  nameEn: string;
  governorateId: string;
  popularForPainting?: boolean; // للمناطق ذات الطلب المرتفع على التشطيبات والتجديد
  type?: 'residential' | 'investment' | 'new-city' | 'commercial' | 'chalet';
}

export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  capitalAr: string;
  capitalEn: string;
  descriptionAr: string;
  areasCount: number;
  areas: Area[];
}

export const KUWAIT_GOVERNORATES: Governorate[] = [
  {
    id: 'capital',
    nameAr: 'العاصمة',
    nameEn: 'Al Asimah (Capital)',
    capitalAr: 'مدينة الكويت',
    capitalEn: 'Kuwait City',
    descriptionAr: 'قلب الكويت التجاري والسياسي مع مناطق سكنية عريقة وراقية.',
    areasCount: 29,
    areas: [
      { id: 'kuwait-city', nameAr: 'مدينة الكويت (الشرق، المرقاب، القبلة، الصالحية)', nameEn: 'Kuwait City', governorateId: 'capital', type: 'commercial' },
      { id: 'dasman', nameAr: 'دسمان', nameEn: 'Dasman', governorateId: 'capital', type: 'residential' },
      { id: 'bneid-al-gar', nameAr: 'بنيد القار', nameEn: 'Bneid Al-Gar', governorateId: 'capital', type: 'investment' },
      { id: 'al-dasma', nameAr: 'الدسمة', nameEn: 'Al Dasma', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-daiya', nameAr: 'الدعية', nameEn: 'Al Daiya', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-mansouriya', nameAr: 'المنصورية', nameEn: 'Al Mansouriya', governorateId: 'capital', type: 'residential' },
      { id: 'abdullah-al-salem', nameAr: 'ضاحية عبد الله السالم', nameEn: 'Abdullah Al-Salem', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-nuzha', nameAr: 'النزهة', nameEn: 'Al Nuzha', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-faiha', nameAr: 'الفيحاء', nameEn: 'Al Faiha', governorateId: 'capital', type: 'residential' },
      { id: 'al-shamiya', nameAr: 'الشامية', nameEn: 'Al Shamiya', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-rawda', nameAr: 'الروضة', nameEn: 'Al Rawda', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-adailiya', nameAr: 'العديلية', nameEn: 'Al Adailiya', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-khaldiya', nameAr: 'الخالدية', nameEn: 'Al Khaldiya', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'kaifan', nameAr: 'كيفان', nameEn: 'Kaifan', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-qadisiya', nameAr: 'القادسية', nameEn: 'Al Qadisiya', governorateId: 'capital', type: 'residential' },
      { id: 'qurtoba', nameAr: 'قرطبة', nameEn: 'Qurtoba', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-surra', nameAr: 'السرة', nameEn: 'Al Surra', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'al-yarmouk', nameAr: 'اليرموك', nameEn: 'Al Yarmouk', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'shuwaikh-residential', nameAr: 'الشويخ السكنية', nameEn: 'Shuwaikh Residential', governorateId: 'capital', type: 'residential', popularForPainting: true },
      { id: 'shuwaikh-industrial', nameAr: 'الشويخ الصناعية (سوق الأصباغ ومواد البناء)', nameEn: 'Shuwaikh Industrial', governorateId: 'capital', type: 'commercial' },
      { id: 'al-rai', nameAr: 'الري', nameEn: 'Al Rai', governorateId: 'capital', type: 'commercial' },
      { id: 'gharnata', nameAr: 'غرناطة', nameEn: 'Gharnata', governorateId: 'capital', type: 'residential' },
      { id: 'sulaibikhat', nameAr: 'الصليبيخات', nameEn: 'Sulaibikhat', governorateId: 'capital', type: 'residential' },
      { id: 'al-doha', nameAr: 'الدوحة', nameEn: 'Al Doha', governorateId: 'capital', type: 'residential' },
      { id: 'al-nahda', nameAr: 'النهضة', nameEn: 'Al Nahda', governorateId: 'capital', type: 'residential' },
      { id: 'al-qairawan', nameAr: 'القيروان', nameEn: 'Al Qairawan', governorateId: 'capital', type: 'residential' },
      { id: 'jaber-al-ahmad', nameAr: 'مدينة جابر الأحمد', nameEn: 'Jaber Al-Ahmad City', governorateId: 'capital', type: 'new-city', popularForPainting: true },
      { id: 'al-sawaber', nameAr: 'الصوابر', nameEn: 'Al Sawaber', governorateId: 'capital', type: 'residential' },
      { id: 'al-murqab', nameAr: 'المرقاب', nameEn: 'Al Murqab', governorateId: 'capital', type: 'commercial' },
    ],
  },
  {
    id: 'hawalli',
    nameAr: 'حولي',
    nameEn: 'Hawalli',
    capitalAr: 'حولي',
    capitalEn: 'Hawalli',
    descriptionAr: 'كثافة سكانية وحيوية تجارية عالية مع ضواحي سكنية حديثة في جنوب السرة.',
    areasCount: 16,
    areas: [
      { id: 'hawalli-city', nameAr: 'حولي', nameEn: 'Hawalli', governorateId: 'hawalli', type: 'investment', popularForPainting: true },
      { id: 'al-salmiya', nameAr: 'السالمية', nameEn: 'Al Salmiya', governorateId: 'hawalli', type: 'investment', popularForPainting: true },
      { id: 'al-shaab', nameAr: 'الشعب والشعب البحري', nameEn: 'Al Shaab', governorateId: 'hawalli', type: 'residential' },
      { id: 'al-rumaithiya', nameAr: 'الرميثية', nameEn: 'Al Rumaithiya', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'al-jabriya', nameAr: 'الجابرية', nameEn: 'Al Jabriya', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'mishref', nameAr: 'مشرف', nameEn: 'Mishref', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'bayan', nameAr: 'بيان', nameEn: 'Bayan', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'al-bidaa', nameAr: 'البدع', nameEn: 'Al Bidaa', governorateId: 'hawalli', type: 'residential' },
      { id: 'salwa', nameAr: 'سلوى', nameEn: 'Salwa', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'dhaher-al-surra', nameAr: 'جنوب السرة (حطين)', nameEn: 'Hittin', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'al-salam', nameAr: 'جنوب السرة (السلام)', nameEn: 'Al Salam', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'al-seddiq', nameAr: 'جنوب السرة (الصديق)', nameEn: 'Al Seddiq', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'al-zahra', nameAr: 'جنوب السرة (الزهراء)', nameEn: 'Al Zahra', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'al-shuhada', nameAr: 'جنوب السرة (الشهداء)', nameEn: 'Al Shuhada', governorateId: 'hawalli', type: 'residential', popularForPainting: true },
      { id: 'dubaqiya', nameAr: 'ضاحية مبارك العبدالله (غرب مشرف)', nameEn: 'West Mishref', governorateId: 'hawalli', type: 'residential' },
      { id: 'al-nigra', nameAr: 'النقرة', nameEn: 'Al Nigra', governorateId: 'hawalli', type: 'investment' },
    ],
  },
  {
    id: 'farwaniyah',
    nameAr: 'الفروانية',
    nameEn: 'Al Farwaniyah',
    capitalAr: 'الفروانية',
    capitalEn: 'Al Farwaniyah',
    descriptionAr: 'أكبر المحافظات سكاناً، تشمل مزيجاً من المجمعات السكنية والقسائم العائلية ومناطق التوسع العمراني.',
    areasCount: 16,
    areas: [
      { id: 'farwaniyah-city', nameAr: 'الفروانية', nameEn: 'Al Farwaniyah', governorateId: 'farwaniyah', type: 'investment', popularForPainting: true },
      { id: 'khaitan', nameAr: 'خيطان', nameEn: 'Khaitan', governorateId: 'farwaniyah', type: 'investment', popularForPainting: true },
      { id: 'ishbiliya', nameAr: 'إشبيلية', nameEn: 'Ishbiliya', governorateId: 'farwaniyah', type: 'residential', popularForPainting: true },
      { id: 'al-omariya', nameAr: 'العمرية', nameEn: 'Al Omariya', governorateId: 'farwaniyah', type: 'residential' },
      { id: 'al-rabiya', nameAr: 'الرابية', nameEn: 'Al Rabiya', governorateId: 'farwaniyah', type: 'residential' },
      { id: 'al-rehab', nameAr: 'الرحاب', nameEn: 'Al Rehab', governorateId: 'farwaniyah', type: 'residential', popularForPainting: true },
      { id: 'al-andalus', nameAr: 'الأندلس', nameEn: 'Al Andalus', governorateId: 'farwaniyah', type: 'residential', popularForPainting: true },
      { id: 'al-riggae', nameAr: 'الرقعي', nameEn: 'Al Riggae', governorateId: 'farwaniyah', type: 'investment', popularForPainting: true },
      { id: 'al-firdous', nameAr: 'الفردوس', nameEn: 'Al Firdous', governorateId: 'farwaniyah', type: 'residential' },
      { id: 'sabah-al-nasser', nameAr: 'صباح الناصر', nameEn: 'Sabah Al-Nasser', governorateId: 'farwaniyah', type: 'residential', popularForPainting: true },
      { id: 'jleeb-al-shuyoukh', nameAr: 'جليب الشيوخ', nameEn: 'Jleeb Al-Shuyoukh', governorateId: 'farwaniyah', type: 'investment' },
      { id: 'al-ardhiya', nameAr: 'العارضية السكنية', nameEn: 'Al Ardhiya Residential', governorateId: 'farwaniyah', type: 'residential', popularForPainting: true },
      { id: 'al-ardhiya-industrial', nameAr: 'العارضية الحرفية والصناعية', nameEn: 'Al Ardhiya Industrial', governorateId: 'farwaniyah', type: 'commercial' },
      { id: 'west-abdullah-al-mubarak', nameAr: 'غرب عبد الله المبارك', nameEn: 'West Abdullah Al-Mubarak', governorateId: 'farwaniyah', type: 'new-city', popularForPainting: true },
      { id: 'south-abdullah-al-mubarak', nameAr: 'جنوب عبد الله المبارك', nameEn: 'South Abdullah Al-Mubarak', governorateId: 'farwaniyah', type: 'new-city', popularForPainting: true },
      { id: 'al-dajeej', nameAr: 'الضجيج (سوق الأثاث والديكور)', nameEn: 'Al Dajeej', governorateId: 'farwaniyah', type: 'commercial' },
    ],
  },
  {
    id: 'ahmadi',
    nameAr: 'الأحمدي',
    nameEn: 'Al Ahmadi',
    capitalAr: 'الأحمدي',
    capitalEn: 'Al Ahmadi',
    descriptionAr: 'المحافظة الجنوبية الممتدة، تضم واجهات بحرية ومشاريع إسكانية ضخمة والشاليهات الساحلية.',
    areasCount: 20,
    areas: [
      { id: 'al-fintas', nameAr: 'الفنطاس', nameEn: 'Al Fintas', governorateId: 'ahmadi', type: 'investment', popularForPainting: true },
      { id: 'al-egaila', nameAr: 'العقيلة', nameEn: 'Al Egaila', governorateId: 'ahmadi', type: 'residential', popularForPainting: true },
      { id: 'al-dhaher', nameAr: 'الظهر', nameEn: 'Al Dhaher', governorateId: 'ahmadi', type: 'residential' },
      { id: 'mahboula', nameAr: 'المهبولة', nameEn: 'Mahboula', governorateId: 'ahmadi', type: 'investment', popularForPainting: true },
      { id: 'al-riqqa', nameAr: 'الرقة', nameEn: 'Al Riqqa', governorateId: 'ahmadi', type: 'residential' },
      { id: 'hadiya', nameAr: 'هدية', nameEn: 'Hadiya', governorateId: 'ahmadi', type: 'residential' },
      { id: 'abu-halifa', nameAr: 'أبو حليفة', nameEn: 'Abu Halifa', governorateId: 'ahmadi', type: 'investment' },
      { id: 'al-sabahiya', nameAr: 'الصباحية', nameEn: 'Al Sabahiya', governorateId: 'ahmadi', type: 'residential', popularForPainting: true },
      { id: 'al-mangaf', nameAr: 'المنقف', nameEn: 'Al Mangaf', governorateId: 'ahmadi', type: 'investment', popularForPainting: true },
      { id: 'al-fahaheel', nameAr: 'الفحيحيل', nameEn: 'Al Fahaheel', governorateId: 'ahmadi', type: 'commercial', popularForPainting: true },
      { id: 'ahmadi-city', nameAr: 'مدينة الأحمدي', nameEn: 'Ahmadi City', governorateId: 'ahmadi', type: 'residential' },
      { id: 'sabah-al-ahmad-residential', nameAr: 'مدينة صباح الأحمد السكنية', nameEn: 'Sabah Al-Ahmad Residential City', governorateId: 'ahmadi', type: 'new-city', popularForPainting: true },
      { id: 'sabah-al-ahmad-sea-city', nameAr: 'مدينة صباح الأحمد البحرية (الخيران)', nameEn: 'Sabah Al-Ahmad Sea City (Khiran)', governorateId: 'ahmadi', type: 'chalet', popularForPainting: true },
      { id: 'al-wafra', nameAr: 'الوفرة السكنية والزراعية', nameEn: 'Al Wafra', governorateId: 'ahmadi', type: 'residential' },
      { id: 'al-zour', nameAr: 'الزور', nameEn: 'Al Zour', governorateId: 'ahmadi', type: 'chalet' },
      { id: 'al-khiran', nameAr: 'شاليهات الخيران', nameEn: 'Khiran Chalets', governorateId: 'ahmadi', type: 'chalet', popularForPainting: true },
      { id: 'bnaider', nameAr: 'بنيدر والجليعة', nameEn: 'Bnaider & Al-Julaia', governorateId: 'ahmadi', type: 'chalet' },
      { id: 'ali-sabah-al-salem', nameAr: 'علي صباح السالم (أم الهيمان)', nameEn: 'Ali Sabah Al-Salem (Umm Al-Hayman)', governorateId: 'ahmadi', type: 'residential' },
      { id: 'jaber-al-ali', nameAr: 'جابر العلي', nameEn: 'Jaber Al-Ali', governorateId: 'ahmadi', type: 'residential' },
      { id: 'al-maqwa', nameAr: 'المقوع', nameEn: 'Al Maqwa', governorateId: 'ahmadi', type: 'commercial' },
    ],
  },
  {
    id: 'mubarak-al-kabeer',
    nameAr: 'مبارك الكبير',
    nameEn: 'Mubarak Al-Kabeer',
    capitalAr: 'مبارك الكبير',
    capitalEn: 'Mubarak Al-Kabeer',
    descriptionAr: 'محافظة هادئة ذات طابع سكني عائلي وتوسع عمراني حديث في مناطق شرق القرين.',
    areasCount: 12,
    areas: [
      { id: 'sabah-al-salem', nameAr: 'صباح السالم', nameEn: 'Sabah Al-Salem', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'al-messilah', nameAr: 'المسيلة', nameEn: 'Al Messilah', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'al-adan', nameAr: 'العدان', nameEn: 'Al Adan', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'al-qusour', nameAr: 'القصور', nameEn: 'Al Qusour', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'al-qurain', nameAr: 'القرين', nameEn: 'Al Qurain', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'mubarak-al-kabeer-city', nameAr: 'مبارك الكبير', nameEn: 'Mubarak Al-Kabeer', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'abu-ftaira', nameAr: 'أبو فطيرة', nameEn: 'Abu Ftaira', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'al-fnaitees', nameAr: 'الفنيطيس', nameEn: 'Al Fnaitees', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'al-masayel', nameAr: 'المسايل', nameEn: 'Al Masayel', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'abu-al-hasaniya', nameAr: 'أبو الحصانية', nameEn: 'Abu Al-Hasaniya', governorateId: 'mubarak-al-kabeer', type: 'residential', popularForPainting: true },
      { id: 'subhan', nameAr: 'صبحان الصناعية', nameEn: 'Subhan Industrial', governorateId: 'mubarak-al-kabeer', type: 'commercial' },
      { id: 'west-abu-ftaira', nameAr: 'غرب أبو فطيرة الحرفية (أسواق القرين)', nameEn: 'Aswaq Al-Qurain', governorateId: 'mubarak-al-kabeer', type: 'commercial' },
    ],
  },
  {
    id: 'jahra',
    nameAr: 'الجهراء',
    nameEn: 'Al Jahra',
    capitalAr: 'الجهراء',
    capitalEn: 'Al Jahra',
    descriptionAr: 'المحافظة الشمالية والغربية الأوسع مساحة، وتشهد أضخم حركة بناء حديث في مدينة المطلاع.',
    areasCount: 15,
    areas: [
      { id: 'al-jahra-old', nameAr: 'الجهراء القديمة', nameEn: 'Old Jahra', governorateId: 'jahra', type: 'residential', popularForPainting: true },
      { id: 'al-waha', nameAr: 'الواحة', nameEn: 'Al Waha', governorateId: 'jahra', type: 'residential' },
      { id: 'al-oyoun', nameAr: 'العيون', nameEn: 'Al Oyoun', governorateId: 'jahra', type: 'residential' },
      { id: 'al-qasr', nameAr: 'القصر', nameEn: 'Al Qasr', governorateId: 'jahra', type: 'residential', popularForPainting: true },
      { id: 'al-naseem', nameAr: 'النسيم', nameEn: 'Al Naseem', governorateId: 'jahra', type: 'residential', popularForPainting: true },
      { id: 'teima', nameAr: 'تيماء', nameEn: 'Teima', governorateId: 'jahra', type: 'residential' },
      { id: 'al-naeem', nameAr: 'النعيم', nameEn: 'Al Naeem', governorateId: 'jahra', type: 'residential', popularForPainting: true },
      { id: 'saad-al-abdullah', nameAr: 'مدينة سعد العبد الله', nameEn: 'Saad Al-Abdullah City', governorateId: 'jahra', type: 'residential', popularForPainting: true },
      { id: 'al-mutlaa', nameAr: 'مدينة المطلاع السكنية (أكبر مدن البناء والتشطيب)', nameEn: 'Al Mutlaa City', governorateId: 'jahra', type: 'new-city', popularForPainting: true },
      { id: 'south-saad-al-abdullah', nameAr: 'جنوب سعد العبدالله', nameEn: 'South Saad Al-Abdullah', governorateId: 'jahra', type: 'new-city' },
      { id: 'sulaibiya', nameAr: 'الصليبية', nameEn: 'Sulaibiya', governorateId: 'jahra', type: 'residential' },
      { id: 'amghara', nameAr: 'أمغرة الصناعية (سكراب ومخازن)', nameEn: 'Amghara Industrial', governorateId: 'jahra', type: 'commercial' },
      { id: 'kabd', nameAr: 'كبد والهجن', nameEn: 'Kabd', governorateId: 'jahra', type: 'chalet' },
      { id: 'al-abdali', nameAr: 'العبدلي والمزارع', nameEn: 'Al Abdali', governorateId: 'jahra', type: 'chalet' },
      { id: 'kazma', nameAr: 'كاظمة والصبية', nameEn: 'Kazma & Subiya', governorateId: 'jahra', type: 'chalet' },
    ],
  },
];

/**
 * قائمة مسطحة مبسطة بكافة أسماء المناطق في الكويت (للفلاتر وقوائم الاختيار السريعة)
 */
export const ALL_KUWAIT_AREAS_LIST: string[] = KUWAIT_GOVERNORATES.flatMap((gov) =>
  gov.areas.map((area) => area.nameAr)
);

/**
 * قائمة مختصرة بأشهر المناطق لتسهيل العرض في الواجهات
 */
export const POPULAR_AREAS_SUMMARY: string[] = [
  'السالمية',
  'حولي',
  'الجابرية',
  'جنوب السرة',
  'الفروانية',
  'خيطان',
  'إشبيلية',
  'غرب عبد الله المبارك',
  'صباح السالم',
  'القرين',
  'أبو فطيرة',
  'الفنيطيس',
  'العقيلة',
  'الفنطاس',
  'المهبولة',
  'مدينة صباح الأحمد',
  'كيفان',
  'الروضة',
  'مدينة جابر الأحمد',
  'مدينة سعد العبد الله',
  'مدينة المطلاع السكنية',
];

/**
 * استرجاع محافظة معينة بواسطة معرفها
 */
export function getGovernorateById(id: string): Governorate | undefined {
  if (!id) return undefined;
  const cleanId = id.trim().toLowerCase();
  return KUWAIT_GOVERNORATES.find((g) => 
    g.id === cleanId || 
    (cleanId === 'farwaniya' && g.id === 'farwaniyah') ||
    (cleanId === 'mubarak' && g.id === 'mubarak-al-kabeer')
  );
}

/**
 * استرجاع المحافظة التي تنتمي إليها منطقة بالاسم العربي
 */
export function getGovernorateByAreaName(areaName: string): Governorate | undefined {
  return KUWAIT_GOVERNORATES.find((g) =>
    g.areas.some(
      (a) =>
        a.nameAr.includes(areaName) ||
        areaName.includes(a.nameAr) ||
        a.nameAr.toLowerCase() === areaName.toLowerCase()
    )
  );
}

/**
 * البحث عن المناطق بكلمة مفتاحية (عربي أو إنجليزي)
 */
export function searchAreas(query: string): Area[] {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim().toLowerCase();
  
  const results: Area[] = [];
  for (const gov of KUWAIT_GOVERNORATES) {
    for (const area of gov.areas) {
      if (
        area.nameAr.toLowerCase().includes(cleanQuery) ||
        area.nameEn.toLowerCase().includes(cleanQuery)
      ) {
        results.push(area);
      }
    }
  }
  return results;
}

/**
 * استرجاع منطقة بواسطة معرف المحافظة ومعرف المنطقة
 */
export function getAreaById(govId: string, areaId: string): { governorate: Governorate; area: Area } | undefined {
  const gov = getGovernorateById(govId);
  if (!gov || !areaId) return undefined;
  const cleanAreaId = areaId.trim().toLowerCase();
  const area = gov.areas.find((a) => 
    a.id === cleanAreaId ||
    a.id.replace(/^al-/, '') === cleanAreaId.replace(/^al-/, '')
  );
  if (!area) return undefined;
  return { governorate: gov, area };
}

/**
 * استرجاع منطقة بواسطة معرفها في أي محافظة (Fallback)
 */
export function findAreaById(areaId: string): { governorate: Governorate; area: Area } | undefined {
  if (!areaId) return undefined;
  const cleanId = areaId.trim().toLowerCase();
  for (const gov of KUWAIT_GOVERNORATES) {
    const area = gov.areas.find((a) => 
      a.id === cleanId ||
      a.id.replace(/^al-/, '') === cleanId.replace(/^al-/, '')
    );
    if (area) return { governorate: gov, area };
  }
  return undefined;
}

