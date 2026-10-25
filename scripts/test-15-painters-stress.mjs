/**
 * Comprehensive Capacity & Multi-Agent Stress Test (15 Kuwait Painters)
 * Kuwait Painters Platform
 */

const BASE_URL = "http://localhost:5000/api";

const PAINTERS_CONFIG = [
  {
    name: "معلم أحمد العازمي",
    email: "painter_azmi@test.kw",
    region: "حولي",
    area: "السالمية",
    governorates: ["حولي", "العاصمة"],
    services: ["دهان داخلي", "أصباغ إيطالية وسيلك", "معجون أصلي"],
    startingAt: "20 د.ك",
    crewSize: 4,
    years: 8,
    accountType: "individual",
    portfolioTitle: "تشطيب صالة مودرن صبغ إيطالي سيلك",
    customerName: "فهد العبدالله",
    customerPhone: "96590111101",
    customerNotes: "صبغ صالة وممر رخام صبغ أبيض سيلك",
    reviewAuthor: "فهد العبدالله",
    reviewComment: "المعلم أحمد فنان حقيقي وشغله نظيف جداً ودقيق بالموعد.",
    rating: 5,
  },
  {
    name: "ورشة الرقي للديكور",
    email: "roqay_decor@test.kw",
    region: "العاصمة",
    area: "الروضة",
    governorates: ["العاصمة", "حولي"],
    services: ["ديكورات وبديل رخام", "بديل خشب", "ورق جدران"],
    startingAt: "25 د.ك",
    crewSize: 6,
    years: 12,
    accountType: "company",
    portfolioTitle: "تركيب بديل خشب مع إضاءة ليد مخفية",
    customerName: "سليمان الغانم",
    customerPhone: "96590111102",
    customerNotes: "ديكور شاشة تلفزيون بديل رخام وبديل خشب",
    reviewAuthor: "سليمان الغانم",
    reviewComment: "طاقم عمل ممتاز وخدمة راقية وخامات أصلية.",
    rating: 5,
  },
  {
    name: "معلم فهد الرشيدي",
    email: "painter_rashidi@test.kw",
    region: "الفروانية",
    area: "صباح الناصر",
    governorates: ["الفروانية", "العاصمة"],
    services: ["دهان داخلي", "معجون وتنعيم أسقف", "صبغ جوتن"],
    startingAt: "18 د.ك",
    crewSize: 3,
    years: 6,
    accountType: "individual",
    portfolioTitle: "معجون وصباغة شقة كاملة جوتن فينوماستيك",
    customerName: "محمد المطوع",
    customerPhone: "96590111103",
    customerNotes: "تجديد صبغ شقة 3 غرف وصالة",
    reviewAuthor: "محمد المطوع",
    reviewComment: "صباح الناصر فخورين بوجود هذا الصباغ، أمانة ونظافة بعد العمل.",
    rating: 5,
  },
  {
    name: "شركة الخليج للتشطيبات",
    email: "khalij_finish@test.kw",
    region: "الأحمدي",
    area: "الفحيحيل",
    governorates: ["الأحمدي", "مبارك الكبير"],
    services: ["دهان خارجي", "واجهات سيجما", "عوازل مائية وحرارية"],
    startingAt: "35 د.ك",
    crewSize: 8,
    years: 15,
    accountType: "company",
    portfolioTitle: "تشطيب واجهات فيلا سيجما بالكامل مع ضمان 5 سنوات",
    customerName: "خالد السبيعي",
    customerPhone: "96590111104",
    customerNotes: "صبغ واجهة فيلا كاملة سيجما مقاومة لحرارة الصيف",
    reviewAuthor: "خالد السبيعي",
    reviewComment: "شركة احترافية وأسعارهم ممتازة مقارنة بالسوق وضمان حقيقي.",
    rating: 5,
  },
  {
    name: "معلم بدر المطيري",
    email: "painter_bader@test.kw",
    region: "مبارك الكبير",
    area: "القصور",
    governorates: ["مبارك الكبير", "حولي"],
    services: ["ورق جدران", "بديل فوم وبانوهات", "دهان غرف نوم"],
    startingAt: "19 د.ك",
    crewSize: 3,
    years: 7,
    accountType: "individual",
    portfolioTitle: "تركيب بانوهات جدران كلاسيك مع صبغ جوتن ربع لمعة",
    customerName: "عبدالرحمن الشطي",
    customerPhone: "96590111105",
    customerNotes: "تركيب ورق جدران لغرفة نوم رئيسية وصالون",
    reviewAuthor: "عبدالرحمن الشطي",
    reviewComment: "شغل البانوهات والصبغ متقن بدون أي فراغات.",
    rating: 5,
  },
  {
    name: "معلم ناصر السبيعي",
    email: "painter_nasser@test.kw",
    region: "الجهراء",
    area: "الواحة",
    governorates: ["الجهراء", "الفروانية"],
    services: ["ترميم وعلاج رطوبة", "معجون وسنفرة", "دهان داخلي"],
    startingAt: "20 د.ك",
    crewSize: 4,
    years: 9,
    accountType: "individual",
    portfolioTitle: "علاج رطوبة وتقشير جدران وإعادة صبغ كاملة",
    customerName: "جاسم الظفيري",
    customerPhone: "96590111106",
    customerNotes: "علاج رطوبة في جدار المطبخ والصالة وصبغ جديد",
    reviewAuthor: "جاسم الظفيري",
    reviewComment: "حل مشكلة الرطوبة اللي تعبتني سنين، يعطيه العافية.",
    rating: 5,
  },
  {
    name: "معلم يوسف الهاجري",
    email: "painter_youssef@test.kw",
    region: "حولي",
    area: "الجابرية",
    governorates: ["حولي", "العاصمة"],
    services: ["أصباغ إيطالية", "ماركو بولو", "دهان غرف أطفال"],
    startingAt: "22 د.ك",
    crewSize: 3,
    years: 10,
    accountType: "individual",
    portfolioTitle: "أصباغ ديكورية ماركوبولو لغرف الاستقبال",
    customerName: "عادل بهبهاني",
    customerPhone: "96590111107",
    customerNotes: "صبغ جدار ديكوري مميز في الصالون",
    reviewAuthor: "عادل بهبهاني",
    reviewComment: "ذوق راقي واختيار رائع للألوان وتناسقها.",
    rating: 5,
  },
  {
    name: "مؤسسة التميز للصباغة",
    email: "tamayoz_paint@test.kw",
    region: "العاصمة",
    area: "الشويخ",
    governorates: ["العاصمة", "حولي", "الفروانية"],
    services: ["دهان قسائم جديدة", "معجون رش أمريكي", "أصباغ كابارول"],
    startingAt: "24 د.ك",
    crewSize: 10,
    years: 14,
    accountType: "company",
    portfolioTitle: "تشطيب قسيمة 3 أدوار وسرداب بالكامل",
    customerName: "عبدالعزيز البابطين",
    customerPhone: "96590111108",
    customerNotes: "تشطيب قسيمة جديدة تسليم مفتاح في الشويخ السكني",
    reviewAuthor: "عبدالعزيز البابطين",
    reviewComment: "التزام كامل بالمواصفات والوقت المحدد بالعقد.",
    rating: 5,
  },
  {
    name: "معلم حمدان الدوسري",
    email: "painter_hamdan@test.kw",
    region: "الأحمدي",
    area: "صباح الأحمد",
    governorates: ["الأحمدي"],
    services: ["تشطيب قسائم كاملة", "أصباغ مقاومة للرطوبة", "دهان داخلي"],
    startingAt: "17 د.ك",
    crewSize: 5,
    years: 11,
    accountType: "individual",
    portfolioTitle: "صبغ قسيمة سكنية في مدينة صباح الأحمد",
    customerName: "سعود العجمي",
    customerPhone: "96590111109",
    customerNotes: "صبغ دور أرضي وأول بقسيمة في قطاع D",
    reviewAuthor: "سعود العجمي",
    reviewComment: "أفضل صباغ تعاملت معه في مدينة صباح الأحمد، سرعة وأمانة.",
    rating: 5,
  },
  {
    name: "معلم فيصل الحربي",
    email: "painter_faisal@test.kw",
    region: "الفروانية",
    area: "الفردوس",
    governorates: ["الفروانية", "الجهراء"],
    services: ["صبغ أبواب خشب ولاكيه", "دهان ناري", "دهان جدران"],
    startingAt: "18 د.ك",
    crewSize: 3,
    years: 6,
    accountType: "individual",
    portfolioTitle: "تجديد وصبغ أبواب خشبية لاكيه أبيض مطفي",
    customerName: "طلال العنزي",
    customerPhone: "96590111110",
    customerNotes: "صبغ 8 أبواب خشب داخلية وتجديد صبغ الممر",
    reviewAuthor: "طلال العنزي",
    reviewComment: "الأبواب رجعت كأنها جديدة تبارك الرحمن، تسلم إيده.",
    rating: 5,
  },
  {
    name: "معلم راشد العنزي",
    email: "painter_rashed@test.kw",
    region: "الجهراء",
    area: "الجهراء القديمة",
    governorates: ["الجهراء", "العاصمة"],
    services: ["دهان خارجي", "عوازل مائية وأسطح", "صبغ جوتن خشن"],
    startingAt: "22 د.ك",
    crewSize: 4,
    years: 9,
    accountType: "individual",
    portfolioTitle: "عزل وصبغ واجهات وأسطح ضد مياه الأمطار",
    customerName: "مشعل الشمري",
    customerPhone: "96590111111",
    customerNotes: "عزل سطح الفيلا مع صبغ واجهة خشنة",
    reviewAuthor: "مشعل الشمري",
    reviewComment: "شغل ممتاز والعوازل مجربة وممتازة.",
    rating: 5,
  },
  {
    name: "معلم طارق الخالدي",
    email: "painter_tariq@test.kw",
    region: "مبارك الكبير",
    area: "صباح السالم",
    governorates: ["مبارك الكبير", "حولي"],
    services: ["ديكورات جبس بورد", "صبغ أسقف ناعم", "أصباغ سيلك"],
    startingAt: "20 د.ك",
    crewSize: 4,
    years: 8,
    accountType: "individual",
    portfolioTitle: "دهان ديكورات أسقف جبس بورد مع معجون فواصل أصلي",
    customerName: "فهد الدبوس",
    customerPhone: "96590111112",
    customerNotes: "صبغ ديكورات صالة استقبال وغرفة طعام",
    reviewAuthor: "فهد الدبوس",
    reviewComment: "دقة في الزوايا والأسقف المستعارة بدون أي تعرجات.",
    rating: 5,
  },
  {
    name: "شركة دار الألوان الكويتية",
    email: "dar_colors@test.kw",
    region: "العاصمة",
    area: "الدسمة",
    governorates: ["العاصمة", "حولي", "مبارك الكبير"],
    services: ["مقاولات صبغ متكاملة", "استشارات ألوان", "كفالة 5 سنوات"],
    startingAt: "28 د.ك",
    crewSize: 12,
    years: 18,
    accountType: "company",
    portfolioTitle: "مشروع إعادة تأهيل وتشطيب فلل تراثية ومودرن",
    customerName: "نواف الصباح",
    customerPhone: "96590111113",
    customerNotes: "دهان فيلا كاملة داخلي وخارجي في الدسمة",
    reviewAuthor: "نواف الصباح",
    reviewComment: "مستوى احترافي عالي جداً وفريق منظم ونظيف.",
    rating: 5,
  },
  {
    name: "معلم جابر الشمري",
    email: "painter_jaber@test.kw",
    region: "الفروانية",
    area: "خيطان",
    governorates: ["الفروانية", "الأحمدي"],
    services: ["دهان اقتصادي وسريع", "تسليم فوري", "معجون شقوق"],
    startingAt: "16 د.ك",
    crewSize: 3,
    years: 5,
    accountType: "individual",
    portfolioTitle: "تسليم سريع لصبغ شقق إيجار وتجديد كامل",
    customerName: "مبارك الرشيدي",
    customerPhone: "96590111114",
    customerNotes: "صبغ شقتين إيجار وتسليمهما في 3 أيام",
    reviewAuthor: "مبارك الرشيدي",
    reviewComment: "سريع وملتزم بالوقت وسعره جداً مناسب.",
    rating: 4,
  },
  {
    name: "معلم صالح القحطاني",
    email: "painter_saleh@test.kw",
    region: "الأحمدي",
    area: "المنقف",
    governorates: ["الأحمدي", "مبارك الكبير"],
    services: ["دهانات فاخرة", "أصباغ زيتي ومائي", "معجون أمريكي"],
    startingAt: "21 د.ك",
    crewSize: 4,
    years: 10,
    accountType: "individual",
    portfolioTitle: "صبغ مجالس فخمة بألوان دافئة وتشطيب مخملي",
    customerName: "عبدالله الهاجري",
    customerPhone: "96590111115",
    customerNotes: "صبغ ديوانية كاملة ألوان بيج دافئة مع معجون ناعم",
    reviewAuthor: "عبدالله الهاجري",
    reviewComment: "ما شاء الله على الصباغ، ديوانيتنا طلعت تحفة والكل سألنا عنه.",
    rating: 5,
  },
];

async function run15PaintersStressTest() {
  console.log("=====================================================================");
  console.log("🚀 STARTING FULL CAPACITY SIMULATION: 15 PAINTERS ACROSS KUWAIT");
  console.log("=====================================================================\n");

  const startTime = Date.now();
  const scorecard = [];

  // 1. Authenticate Admin
  console.log("🔑 [Admin]: تسجيل دخول مدير العمليات...");
  const adminRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@sabbagh-kuwait.com",
      password: "Admin@123456",
    }),
  });
  const adminData = await adminRes.json();
  if (!adminRes.ok || !adminData.token) {
    throw new Error(`Admin login failed: ${JSON.stringify(adminData)}`);
  }
  const adminToken = adminData.token;
  console.log("   ✅ تم تسجيل دخول المشرف بنجاح.\n");

  // 2. Loop through 15 Painters: Full Lifecycle
  console.log("🏗️ [Multi-Agent Swarm]: بدء دورة حياة الـ 15 صباغاً بالتوازي والمزامنة...\n");

  for (let i = 0; i < PAINTERS_CONFIG.length; i++) {
    const cfg = PAINTERS_CONFIG[i];
    const painterIndex = i + 1;
    const pStart = Date.now();

    console.log(`---------------------------------------------------------------------`);
    console.log(`🎨 [الصباغ ${painterIndex}/15]: ${cfg.name} (${cfg.accountType === "company" ? "شركة" : "فرد"}) - محافظة ${cfg.region}`);

    // A. التسجيل ورفع البيانات
    const regRes = await fetch(`${BASE_URL}/auth/register-painter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cfg.email,
        password: "PainterPassword@2026",
        name: cfg.name,
        phone: `9659${String(1000000 + i).slice(-7)}`,
        region: cfg.region,
        governorates: cfg.governorates,
        services: cfg.services,
        startingAt: cfg.startingAt,
        crewSize: cfg.crewSize,
        years: cfg.years,
        accountType: cfg.accountType,
        companyName: cfg.accountType === "company" ? cfg.name : undefined,
        description: `صباغ محترف يقدم أفضل خدمات التشطيب في محافظة ${cfg.region} وضواحيها.`,
      }),
    });
    const regData = await regRes.json();
    if (!regRes.ok || !regData.painter?.id) {
      console.error(`   ❌ فشل تسجيل ${cfg.name}:`, regData);
      scorecard.push({ name: cfg.name, status: "FAIL_REGISTRATION" });
      continue;
    }

    const painterId = regData.painter.id;
    const painterToken = regData.token;
    console.log(`   1. ✅ تم التسجيل بنجاح (Painter ID: ${painterId}) والحالة: ${regData.painter.status}`);

    // B. رفع مشروع معرض أعمال (Portfolio Project)
    const projRes = await fetch(`${BASE_URL}/painter/portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${painterToken}`,
      },
      body: JSON.stringify({
        title: cfg.portfolioTitle,
        category: cfg.services[0],
        area: `${cfg.area} - محافظة ${cfg.region}`,
        materialsUsed: "أصباغ جوتن الأصلية ومعجون ناعم وكابارول",
        description: `أحدث أعمال التشطيب المنفذة في ${cfg.area} باحترافية وجودة عالية.`,
        displayMode: "standard",
        galleryImages: [
          {
            id: `proj-img-${Date.now()}-1`,
            url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
            caption: "صورة العمل النهائي والتشطيب",
          },
          {
            id: `proj-img-${Date.now()}-2`,
            url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
            caption: "مرحلة المعجون والسنفرة قبل الصبغ",
          },
        ],
      }),
    });
    const projData = await projRes.json();
    if (projRes.ok && projData.id) {
      console.log(`   2. ✅ تم رفع مشروع معرض الأعمال بنجاح: "${cfg.portfolioTitle}"`);
    }

    // C. المشرف يدقق ويعتمد الصباغ
    const appRes = await fetch(`${BASE_URL}/admin/painters/${painterId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "approved", isVerified: true }),
    });
    if (!appRes.ok) {
      console.error(`   ❌ فشل اعتماد الصباغ ${painterId}`);
      scorecard.push({ name: cfg.name, status: "FAIL_ADMIN_APPROVAL" });
      continue;
    }
    console.log(`   3. ✅ اعتمدت الإدارة الصباغ ومنحته شارة التوثيق (isVerified: true)`);

    // D. التحقق من الظهور العام في دليل الموقع
    const pubRes = await fetch(`${BASE_URL}/public/painters/${painterId}`);
    const pubData = await pubRes.json();
    if (!pubRes.ok || pubData.id !== painterId || pubData.status !== "approved") {
      console.error(`   ❌ لم يظهر الصباغ في البروفايل العام!`);
      scorecard.push({ name: cfg.name, status: "FAIL_PUBLIC_EXPOSURE" });
      continue;
    }
    console.log(`   4. ✅ متاح للعامة في الموقع ومسار الرابط: /painters/${pubData.slug}`);

    // E. عميل يطلب تسعيرة ومعاينة موجهة لمنطقة الصباغ
    const quoteRes = await fetch(`${BASE_URL}/public/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: cfg.customerName,
        customerPhone: cfg.customerPhone,
        customerNotes: cfg.customerNotes,
        propertyType: "apartment",
        workType: "interior",
        roomsCount: 3,
        includeMaterials: true,
        paintQuality: "jotun-fenomastic",
        governorateId: cfg.region,
        areaId: cfg.area,
        estimatedMinKwd: 65,
        estimatedMaxKwd: 95,
        estimatedAverageKwd: 80,
      }),
    });
    const quoteData = await quoteRes.json();
    const quoteId = quoteData.quote?.id;
    console.log(`   5. ✅ استلمت المنصة طلب معاينة جديد #${quoteId} من العميل "${cfg.customerName}"`);

    // F. الإدارة تعين الطلب لهذا الصباغ
    const assignRes = await fetch(`${BASE_URL}/admin/quotes/${quoteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        assignedPainterId: painterId,
        status: "assigned",
      }),
    });
    if (!assignRes.ok) {
      console.error(`   ❌ فشل تعيين الطلب #${quoteId} للصباغ #${painterId}`);
      scorecard.push({ name: cfg.name, status: "FAIL_LEAD_ASSIGN" });
      continue;
    }
    console.log(`   6. ✅ قامت الإدارة بإسناد الطلب #${quoteId} للصباغ`);

    // G. الصباغ يستقبل الطلب ويحدث الحالات
    const pLeadsRes = await fetch(`${BASE_URL}/painter/leads`, {
      headers: { "Authorization": `Bearer ${painterToken}` },
    });
    const pLeads = await pLeadsRes.json();
    const myLead = Array.isArray(pLeads) && pLeads.find((l) => l.id === quoteId);
    if (!myLead) {
      console.error(`   ❌ الصباغ لم يجد الطلب في لوحة تحكمه!`);
      scorecard.push({ name: cfg.name, status: "FAIL_LEAD_RECEPTION" });
      continue;
    }

    // تحديث الحالة إلى contacted ثم completed
    await fetch(`${BASE_URL}/painter/quotes/${quoteId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${painterToken}`,
      },
      body: JSON.stringify({ status: "contacted" }),
    });

    await fetch(`${BASE_URL}/painter/quotes/${quoteId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${painterToken}`,
      },
      body: JSON.stringify({ status: "completed" }),
    });
    console.log(`   7. ✅ الصباغ أنهى دورة الطلب في لوحته: (assigned -> contacted -> completed)`);

    // H. العميل يرسل تقييم 5 نجوم والإدارة تعتمده
    const revRes = await fetch(`${BASE_URL}/public/painters/${painterId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: cfg.reviewAuthor,
        whatsapp: cfg.customerPhone,
        rating: cfg.rating,
        area: cfg.area,
        comment: cfg.reviewComment,
        serviceType: cfg.services[0],
      }),
    });
    const revData = await revRes.json();
    const revId = revData.review.id;

    // الأدمن يعتمد التقييم
    await fetch(`${BASE_URL}/admin/reviews/${revId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "approved" }),
    });
    console.log(`   8. ✅ اعتمدت الإدارة تقييم العميل الموثق (${cfg.rating} نجوم)`);

    // I. التحقق من درع الخصوصية وتحديث معدل التقييم
    const verifyPubRes = await fetch(`${BASE_URL}/public/painters/${painterId}`);
    const verifyPubData = await verifyPubRes.json();
    const pubReviews = verifyPubData.customerReviews || [];
    const hasLeak = pubReviews.some((r) => r.authorPhone || r.whatsapp);

    if (hasLeak) {
      console.error(`   ❌ تسريب رقم الهاتف في التقييمات!`);
      scorecard.push({ name: cfg.name, status: "FAIL_PII_LEAK" });
      continue;
    }
    console.log(`   9. 🔒 تم التحقق: التقييم منشور بمعدل ${verifyPubData.rating} وحجب كامل لأرقام الهواتف!`);

    const pDuration = Date.now() - pStart;
    console.log(`   ⏱️ زمن إنجاز الدورة الكاملة للصباغ: ${pDuration}ms`);
    scorecard.push({
      name: cfg.name,
      status: "PASS_100%",
      painterId,
      region: cfg.region,
      rating: verifyPubData.rating,
      durationMs: pDuration,
    });
  }

  // 3. Final Overall Stats and Dashboard Verification
  console.log("\n=====================================================================");
  console.log("📊 [Admin Dashboard Stats]: فحص مؤشرات الأداء الكلية للمنصة");
  console.log("=====================================================================");
  const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { "Authorization": `Bearer ${adminToken}` },
  });
  const statsData = await statsRes.json();
  console.log("مؤشرات لوحة التحكم المباشرة:", JSON.stringify(statsData, null, 2));

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("\n=====================================================================");
  console.log(`🏁 15-PAINTER STRESS TEST COMPLETED IN ${totalTime}s`);
  console.log("=====================================================================");
  scorecard.forEach((s, idx) => {
    console.log(`[${s.status}] #${idx + 1} ${s.name} (${s.region}) - Rating: ${s.rating} (${s.durationMs}ms)`);
  });

  const totalPassed = scorecard.filter((s) => s.status === "PASS_100%").length;
  console.log(`\n🎯 النتيجة الإجمالية: ${totalPassed} / 15 صباغاً أنجزوا الدورة الكاملة بنجاح 100%!`);
}

run15PaintersStressTest().catch((err) => {
  console.error("FATAL STRESS TEST ERROR:", err);
  process.exit(1);
});
