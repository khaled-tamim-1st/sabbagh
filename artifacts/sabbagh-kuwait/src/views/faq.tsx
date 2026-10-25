'use client';

import { useState, useMemo } from 'react';
import {
  HelpCircle, ChevronDown, ShieldCheck, DollarSign,
  Paintbrush, Sparkles, CheckCircle2, MessageCircle,
  Search, AlertCircle, Phone
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Link } from '@/lib/nav';

interface FaqItem {
  id: string;
  category: 'pricing' | 'materials' | 'warranty' | 'process';
  categoryLabel: string;
  question: string;
  answer: string;
  highlight?: string;
}

const FAQS_DATA: FaqItem[] = [
  {
    id: 'f1',
    category: 'pricing',
    categoryLabel: 'الأسعار والتكاليف',
    question: 'كيف يُحسب سعر صبغ الغرفة أو الشقة في الكويت؟',
    answer: 'يعتمد الحساب غالباً على نمطين: إما بالسعر الإفرادي للغرفة (ويتراوح بين 18 إلى 35 دينار كويتي شامل الصبغ والمعجون وتغطية الأثاث)، أو بسعر إجمالي مقطوع للشقة بالكامل. صبغ الشقة كاملة (3 غرف وصالة) يكون أوفر بكثير للمستهلك مقارنة بصبغ كل غرفة بشكل منفصل.',
    highlight: 'المعاينة الميدانية دائماً مجانية لتحديد السعر الدقيق.',
  },
  {
    id: 'f2',
    category: 'pricing',
    categoryLabel: 'الأسعار والتكاليف',
    question: 'هل الأسعار المعروضة في الدليل تشمل الصبغ والمعجون أم المصنعية فقط؟',
    answer: 'توضح بطاقات الصباغين وحاسبة الأسعار ما إذا كان السعر شاملاً المواد أو مصنعية فقط. في العادة، تشمل باقات "تسليم مفتاح" الصبغ المائي الأصلي (مثل جوتن فينوماستيك) مع سكينة المعجون وتغليف الأثاث، بينما يمكنك أيضاً الاتفاق على دفع أجرة اليد العاملة وشراء الصبغ بنفسك من وكلاء جوتن أو همبل.',
  },
  {
    id: 'f3',
    category: 'materials',
    categoryLabel: 'المواد والماركات',
    question: 'شنو أفضل ماركات الأصباغ المناسبة لبيوت الكويت؟',
    answer: 'تحتل شركة "جوتن" (Jotun) المركز الأول في الكويت بلا منازع بفضل دهانات فينوماستيك الداخلية (Fenomastic) ودهانات جوتاشيلد (Jotashield) الخارجية المقاومة للشمس والغبار. تليها شركة "همبل" (Hempel) الشهيرة بمقاومتها للأملاح والرطوبة، وشركة "كابارول" (Caparol) الألمانية الممتازة في التأسيس وعزل الشروخ.',
    highlight: 'نوصي دائماً بالتأكد من شراء العبوات الأصلية المعتمدة.',
  },
  {
    id: 'f4',
    category: 'materials',
    categoryLabel: 'المواد والماركات',
    question: 'شنو الفرق بين الصبغ المطفي، ربع اللمعة، ونصف اللمعة؟',
    answer: 'الصبغ المطفي (Matt) يعطي مظهراً فخماً هادئاً ويخفي تعرجات الطوفة ولكنه أصعب في الغسيل، لذا يناسب الأسقف والمجالس الرسمية. صبغ ربع اللمعة (Silk / Semi-Matt) هو الخيار الأفضل والأكثر مبيعاً في الكويت لغرف النوم والمعيشة لأنه ناعم الملمس وقابل للمسح والتنظيف بالماء والإسفنجة. أما نصف اللمعة فيناسب المطابخ والمستودعات لمقاومته العالية للرطوبة.',
  },
  {
    id: 'f5',
    category: 'materials',
    categoryLabel: 'المواد والماركات',
    question: 'هل من الأفضل أن أشتري الأصباغ بنفسي أم أترك الصباغ يشتريها؟',
    answer: 'إذا كان لديك وقت ومعرفة بأكواد الألوان وترغب في اختيار نوع فينوماستيك محدد وضبط الفاتورة بنفسك، فإن الشراء من محلات الشويخ الصناعية أو الفحيحيل خيار ممتاز. أما إذا كنت تفضل راحة البال، فالصباغ المعتمد لديه خصومات ورش ويستطيع توفير الكميات الدقيقة بدون إهدار، مع إحضار فاتورة المواد لك.',
  },
  {
    id: 'f6',
    category: 'warranty',
    categoryLabel: 'الضمان والجودة',
    question: 'هل يوجد ضمان على أعمال الصبغ والتشطيب؟',
    answer: 'نعم، يقدم الصباغون المعتمدون في دليلنا ضماناً يتراوح بين سنتين إلى 3 سنوات ضد تقشير الدهان أو انفصاله أو التغير المفاجئ في درجات اللون. يشترط لسريان الضمان عدم وجود تسريب مياه أو نش مواسير جديد داخل الجدار.',
    highlight: 'احرص على توضيح مدة الضمان كتابياً قبل بدء العمل.',
  },
  {
    id: 'f7',
    category: 'warranty',
    categoryLabel: 'الضمان والجودة',
    question: 'كيف يتم علاج الرطوبة والنش في الجدران قبل الصبغ؟',
    answer: 'الصبغ فوق طوفة رطبة أو متقشرة خطأ فادح يؤدي لسقوط الدهان خلال أسابيع. الخطوات الصحيحة تشمل: كشط اللياسة التالفة حتى الطابوق، ترك الجدار يجف، دهان وجه برايمر زيتي عازل للأملاح، ثم سحب معجون وتر بلص المقاوم للماء قبل تطبيق اللون النهائي.',
  },
  {
    id: 'f8',
    category: 'process',
    categoryLabel: 'طريقة العمل وحماية الأثاث',
    question: 'كيف يحافظ الصباغ على نظافة الأثاث والأرضيات والباركيه؟',
    answer: 'الفنيون المحترفون يبدأون دائماً بمرحلة التجهيز: تجميع قطع الأثاث في منتصف الغرفة، تغطيتها بالكامل برولات النايلون السميك وتثبيتها بالشطرطون الورقي الخاص الذي لا يترك أثراً، وتغطية الأرضيات بالكرتون المقوى أو اللباد، مع فك أغطية مفاتيح الكهرباء قبل الصبغ وإعادتها بعد الانتهاء.',
  },
  {
    id: 'f9',
    category: 'process',
    categoryLabel: 'طريقة العمل وحماية الأثاث',
    question: 'كم يوم تستغرق صبغ شقة سكنية كاملة؟',
    answer: 'تستغرق الشقة المكونة من 3 غرف وصالة في العادة من 3 إلى 5 أيام عمل، وتشمل مراحل: كشط وتأسيس المعجون، تركه يجف، الصنفرة بماكينات الشفط، دهان الوجه الأول، ثم الوجه الثاني والتشطيب وتسليم الشقة نظيفة وجاهزة للسكن.',
  },
  {
    id: 'f10',
    category: 'process',
    categoryLabel: 'طريقة العمل وحماية الأثاث',
    question: 'كيف يتم دفع مستحقات الصباغ؟',
    answer: 'العرف المعتمد في الكويت هو الدفع على دفعات مرحلية: دفعة أولى بسيطة بعد معاينة الموقع وتوريد المواد وبدء التأسيس (20-30%)، دفعة ثانية بعد الانتهاء من المعجون والوجه الأول (30-40%)، والدفعة الأخيرة بعد فحص العميل لكافة الجدران واستلام العمل بنظافة ورضا تام (30-40%). لا تدفع كامل المبلغ مقدماً أبداً.',
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<string[]>(['f1', 'f3', 'f6']);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const term = searchQuery.trim().toLocaleLowerCase('ar');
      const matchesSearch = !term || faq.question.toLocaleLowerCase('ar').includes(term) || faq.answer.toLocaleLowerCase('ar').includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <Layout activeNav="/faq">
      {/* مسار التنقل المهيأ لمحركات البحث */}
      <Breadcrumbs
        items={[
          { label: 'الأسئلة الشائعة والضمان', isCurrent: true },
        ]}
      />

      {/* هيدر الصفحة */}
      <section style={{ background: '#17483e', color: '#f6f1e6', padding: '52px 0 42px', borderBottom: '3px solid #e9bd77' }}>
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
          <span className="eyebrow" style={{ color: '#d9c597' }}>إجابات واضحة وشفافة</span>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', margin: '14px 0 10px', fontWeight: 700 }}>
            الأسئلة الشائعة والضمان
          </h1>
          <p style={{ margin: 0, color: '#d2dfd7', fontSize: '15px', maxWidth: '640px', lineHeight: 1.9 }}>
            كل ما تحتاج معرفته عن أسعار الصبغ في الكويت، شروط الضمان، طرق شراء أصباغ جوتن وهمبل الأصلية، وكيفية حماية أثاث منزلك أثناء العمل.
          </p>
        </div>
      </section>

      {/* شريط البحث والفلاتر */}
      <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: '36px auto 70px' }}>
        
        {/* حقل البحث */}
        <div style={{ maxWidth: '620px', margin: '0 auto 28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fffdf8',
              border: '1px solid #dcd5c7',
              borderRadius: '14px',
              padding: '6px 16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <Search size={18} color="#17483e" style={{ marginLeft: '10px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سؤال... (مثال: جوتن، ضمان، غرف، رطوبة، دفعات)"
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                padding: '10px 0',
                fontSize: '13px',
                color: '#1d4038',
                background: 'transparent',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '12px' }}
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* فئات الأسئلة */}
        <div className="filters" style={{ justifyContent: 'center', marginBottom: '32px' }}>
          {[
            { id: 'all', label: 'كافة الأسئلة' },
            { id: 'pricing', label: 'الأسعار والتكاليف' },
            { id: 'materials', label: 'المواد والماركات (جوتن/همبل)' },
            { id: 'warranty', label: 'الضمان وجودة التنفيذ' },
            { id: 'process', label: 'طريقة العمل وحماية الأثاث' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* قائمة الأسئلة (Accordion) */}
        <div style={{ maxWidth: '820px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openItems.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  style={{
                    background: '#fffdf8',
                    border: '1px solid #e8e1d3',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    boxShadow: isOpen ? '0 6px 20px rgba(23,72,62,0.04)' : 'none',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
                      background: isOpen ? '#f8f4ea' : '#fffdf8',
                      border: 'none',
                      textAlign: 'right',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="tag" style={{ background: '#f0ece2', fontSize: '10px', color: '#17483e' }}>
                        {faq.categoryLabel}
                      </span>
                      <strong style={{ fontSize: '15px', color: '#1d4038', lineHeight: 1.5 }}>
                        {faq.question}
                      </strong>
                    </div>

                    <ChevronDown
                      size={18}
                      color="#17483e"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ padding: '16px 22px 22px', borderTop: '1px solid #eee5d4' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#555e53', lineHeight: 2 }}>
                        {faq.answer}
                      </p>

                      {faq.highlight && (
                        <div
                          style={{
                            marginTop: '12px',
                            background: '#eaf4ee',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#215045',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <ShieldCheck size={16} />
                          <strong>معلومة مهمة:</strong> {faq.highlight}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <h3>لم نجد سؤالاً يطابق بحثك</h3>
              <p>جرّب استخدام كلمات أخرى أو تواصل معنا مباشرة لطرح سؤالك.</p>
              <button
                type="button"
                className="clear-button"
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              >
                عرض كافة الأسئلة
              </button>
            </div>
          )}
        </div>

        {/* صندوق طرح سؤال إضافي أو طلب استشارة */}
        <div
          style={{
            maxWidth: '820px',
            margin: '46px auto 0',
            background: 'linear-gradient(135deg, #17483e 0%, #205c50 100%)',
            color: '#fff9ee',
            borderRadius: '20px',
            padding: '30px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#e9bd77' }}>عندك استفسار خاص ببيتك لم تجده هنا؟</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#d2dfd7', maxWidth: '480px', lineHeight: 1.8 }}>
              فريقنا وصبّاغونا المعتمدون جاهزون لتقديم استشارة فنية مجانية وحساب التكلفة بدقة لبيتك.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              href="/request-quote"
              className="saved-nav"
              style={{ background: '#e9bd77', color: '#17483e', border: 'none', padding: '12px 20px', textDecoration: 'none' }}
            >
              احسب التكلفة واطلب معاينة
            </Link>
            <Link
              href="/"
              className="saved-nav"
              style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', padding: '12px 18px', textDecoration: 'none' }}
            >
              تصفح الصباغين
            </Link>
          </div>
        </div>

      </div>
    </Layout>
  );
}
