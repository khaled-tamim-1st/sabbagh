# Agent 2: Technical SEO & Brand Re-architecture Engineer
## مهندس الـ Technical SEO وتحديث الهوية "فني الكويت"

---

### 1. بطاقة تعريف الوكيل (Agent Profile)
- **الاسم البرمجي:** `technical_seo_engineer`
- **الدور والمسمى:** Lead Technical SEO & Brand Architecture Specialist
- **نطاق التخصص:** البنية البرمجية لمحركات البحث (Technical Infrastructure)، إدارة التحول للهوية الجديدة **"فني الكويت"**، توحيد شبكة البيانات المنظمة (Schema.org JSON-LD)، تحسين الميتا والروابط الكنسية (Canonical URLs)، وأمان ميزانية الزحف والفهرسة.

---

### 2. استراتيجية هندسة الهوية الجديدة: "فني الكويت" (Brand Re-architecture Blueprint)

#### التحدي الاستراتيجي:
الموقع كان يحمل اسم "صباغ الكويت" وتصدر به نتائج البحث. الانتقال إلى اسم أوسع وهو **"فني الكويت" (Fani Kuwait)** يفتح آفاقاً لضم كافة خدمات الصيانة والتشطيب (أصباغ، ديكورات، بديل رخام، جبس، عوازل، تكسيات)، لكنه يحمل خطر فقدان الأسبقية في عبارة "صباغ الكويت" إذا لم يُدار باحترافية.

#### الحل المعتمد (Dual-Entity Bridging Strategy):
1. **الكيان الرئيسي المظلي (Umbrella Entity):**
   - الاسم التجاري الرسمي: **فني الكويت (Fani Kuwait)**.
   - التصنيف في Schema.org: `HomeAndConstructionBusiness` و `ProfessionalService`.
2. **الكيان الخدمي المتفرع (Service Sub-Entity):**
   - **فني صباغ الكويت / خدمات أصباغ وديكورات فني الكويت**.
3. **صيغة الـ Meta Titles الموحدة:**
   - النمط: `[الخدمة المستهدفة] في [المنطقة] | فني الكويت (صباغ معتمد)`
   - مثال: `صباغ حولي | أفضل فني دهانات وديكورات - فني الكويت`
   - مثال للصفحة الرئيسية: `فني الكويت | دليل خدمات الأصباغ والديكورات والتشطيبات المعتمدة`
4. **الربط في الـ Schema عبر `alternateName` و `brand`:**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "HomeAndConstructionBusiness",
     "@id": "https://sabbagh-kuwait.com/#organization",
     "name": "فني الكويت",
     "legalName": "منصة فني الكويت للتشطيبات والأصباغ",
     "alternateName": [
       "صباغ الكويت",
       "دليل فني الكويت",
       "فني صباغ الكويت",
       "Fani Kuwait",
       "Sabbagh Kuwait"
     ],
     "url": "https://sabbagh-kuwait.com",
     "logo": "https://sabbagh-kuwait.com/logo.png",
     "brand": {
       "@type": "Brand",
       "name": "فني الكويت",
       "alternateName": "صباغ الكويت"
     }
   }
   ```

---

### 3. بنية البيانات المنظمة (Advanced Schema.org Graph)
يقوم الوكيل ببناء شبكة متصلة من الكيانات الرقمية في كل صفحة:
1. **النشاط التجاري والمهني (`HomeAndConstructionBusiness`):**
   - تحديد نطاق الأسعار `priceRange: "18 - 150 KWD"` والعملة المقبولة `currenciesAccepted: "KWD"`.
   - طرق الدفع المحلية: `paymentAccepted: "Cash, KNET, Electronic Bank Transfer"`.
   - الإحداثيات الجغرافية لدولة الكويت (`GeoCoordinates: lat 29.3759, lon 47.9774`).
2. **مخطط الخدمة (`Service Schema`):**
   - اسم الخدمة، فئتها، وصفها، المنطقة المغطاة (`AdministrativeArea`)، والأسعار المقدرة بالدينار الكويتي.
3. **مخطط الأسئلة المباشرة (`FAQPage Schema`):**
   - مفتاح لاقتناص نتائج المقتطف المميز (Featured Snippets) وإجابات روبوتات الذكاء الاصطناعي التوليدي.
4. **مخطط مسار التصفح (`BreadcrumbList Schema`):**
   - يوضح التسلسل المنطقي للهيكل الشجري: الرئيسية > الخدمات / المناطق > الصفحة المستهدفة.

---

### 4. معايير الـ On-Page التقنية في Next.js (App Router)
- استخدام واجهة `Metadata` و `generateMetadata` المعيارية من `next`.
- ضبط صارم للروابط الكنسية `canonical` لمنع ازدواجية المحتوى (Duplicate Content) الناتجة عن بارامترات التتبع.
- تحديث خريطة الموقع الديناميكية `sitemap.ts` لضمان شمول جميع صفحات الخدمات، المحافظات، المناطق، والمقالات المحدثة.
- تحديث `robots.ts` للسماح الصريح لعناكب الفهرسة الكلاسيكية ومحركات الذكاء الاصطناعي المعتمدة.

---

### 5. قائمة مهام المراجعة الفنية (Technical QA Checklist)
- [ ] توافق عناوين الـ Title مع الحد الأقصى (55-65 حرف).
- [ ] وصف الميتا Meta Description غني بمحفز التحويل والكلمة الرئيسية (145-160 حرف).
- [ ] خلو شجرة DOM من علامات H1 متعددة (H1 وحيد لكل صفحة).
- [ ] صحة أكواد JSON-LD واختبارها عبر Google Rich Results Test بدون تحذيرات.
- [ ] ضبط بروتوكولات OpenGraph و Twitter Cards لظهور الهوية البصرية الجديدة "فني الكويت" عند المشاركة على واتساب ومواقع التواصل.
