import { type FC } from 'react';
import { Link } from '@/lib/nav';
import {
  MapPin,
  Building2,
  Paintbrush,
  ShieldCheck,
  Phone,
  Calculator,
  Compass,
  ArrowUpLeft,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export function Brand({
  light = false,
  showName = true,
  size = 52,
  priority = false,
}: {
  light?: boolean;
  showName?: boolean;
  size?: number;
  priority?: boolean;
}) {
  const width = Math.round(size * 1.28);
  const webpSrc = light ? '/logo-light.webp' : '/logo.webp';
  const pngSrc = light ? '/logo-light.png' : '/logo.png';

  return (
    <Link
      href="/"
      className="brand"
      aria-label="الرئيسية"
      style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={pngSrc}
            alt="شعار صباغ الكويت"
            width={width}
            height={size}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            style={{ width: `${width}px`, height: `${size}px`, objectFit: 'contain', display: 'block' }}
          />
        </picture>
      </div>
      {showName && (
        <span
          style={{
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: light ? '#f5efdf' : '#17483e',
          }}
        >
          صباغ الكويت
        </span>
      )}
    </Link>
  );
}

/**
 * مصفوفة الروابط الداخلية المبوبة لدليل صباغ الكويت لتصدر محركات البحث (SEO Internal Linking Architecture)
 */
export const SiteFooter: FC = () => {
  // محافظات الكويت الست
  const governorates = [
    { name: 'صباغ محافظة العاصمة', href: '/areas/capital', count: '29 منطقة' },
    { name: 'صباغ محافظة حولي', href: '/areas/hawalli', count: '16 منطقة' },
    { name: 'صباغ محافظة الفروانية', href: '/areas/farwaniyah', count: '16 منطقة' },
    { name: 'صباغ محافظة الأحمدي', href: '/areas/ahmadi', count: '20 منطقة' },
    { name: 'صباغ محافظة مبارك الكبير', href: '/areas/mubarak-al-kabeer', count: '12 منطقة' },
    { name: 'صباغ محافظة الجهراء', href: '/areas/jahra', count: '15 منطقة' },
  ];

  // المدن السكنية الجديدة الأكثر طلباً على التشطيب والصبغ
  const newCities = [
    { name: 'صباغ مدينة المطلاع السكنية', href: '/areas/jahra/al-mutlaa', badge: 'أكبر حركة تشطيب' },
    { name: 'صباغ مدينة صباح الأحمد', href: '/areas/ahmadi/sabah-al-ahmad-residential', badge: 'قسائم وبيوت' },
    { name: 'صباغ مدينة جابر الأحمد', href: '/areas/capital/jaber-al-ahmad', badge: 'شقق وقسائم' },
    { name: 'صباغ غرب عبد الله المبارك', href: '/areas/farwaniyah/west-abdullah-al-mubarak', badge: 'تشطيب كامل' },
    { name: 'صباغ جنوب عبد الله المبارك', href: '/areas/farwaniyah/south-abdullah-al-mubarak', badge: 'قسائم جديدة' },
    { name: 'صباغ مدينة سعد العبد الله', href: '/areas/jahra/saad-al-abdullah', badge: 'تجديد وترميم' },
    { name: 'صباغ شاليهات الخيران وبنيدر', href: '/areas/ahmadi/al-khiran', badge: 'أصباغ ساحلية' },
  ];

  // خدمات الأصباغ والديكور المميزة
  const paintingServices = [
    { name: 'أصباغ داخلية (جوتن فينوماستيك)', href: '/services/interior-painting', desc: 'مطفي، ربع لمعة، نصف لمعة' },
    { name: 'أصباغ إيطالية ديكورية وترافرتينو', href: '/services/italian-decorative-paints', desc: 'مارمورينو، فالفنت، ستوكو' },
    { name: 'تركيب ورق جدران 3D ورول كوري', href: '/services/wallpapers-3d', desc: 'فينيل مقاوم للرطوبة والعفن' },
    { name: 'بديل الرخام وبديل الخشب WPC', href: '/services/pvc-marble-wpc-wood-fluted-panels', desc: 'خلفيات تلفزيون وبانوهات فوم' },
    { name: 'علاج الرطوبة والنش وتمليح الجدران', href: '/services/moisture-humidity-cracks-treatment', desc: 'عوازل مائية وإيبوكسي سويسري' },
    { name: 'صبغ واجهات خارجية ورشة سيجما', href: '/services/exterior-facade-sigma-jotun', desc: 'جوتن جوتاشيلد عاكس للحرارة' },
    { name: 'أرضيات إيبوكسي 3D وميتاليك', href: '/services/epoxy-flooring', desc: 'كراجات ومستودعات وصالات' },
    { name: 'صبغ وتجديد الأبواب الخشبية', href: '/services/doors-wood-painting', desc: 'أبواب ناري ولاكيه وسنديان' },
  ];

  // أحدث مقالات ودراسات مدونة صباغ الكويت
  const blogArticles = [
    { name: 'سعر صبغ الغرفة والشقة بالدينار الكويتي 2026', href: '/blog/room-painting-cost-kuwait', category: 'أسعار وتكاليف' },
    { name: 'سعر متر السيجما والواجهات الخارجية بالكويت', href: '/blog/sigma-exterior-cost-kuwait', category: 'واجهات وسيجما' },
    { name: 'أسعار دهانات جوتن بالكويت (فينوماستيك وجوتاشيلد)', href: '/blog/jotun-paint-prices-kuwait', category: 'أسعار وتكاليف' },
    { name: 'شلون تختار صباغ شاطر ورخيص في الكويت؟', href: '/blog/how-to-choose-skilled-affordable-painter-kuwait', category: 'اختيار الصباغ' },
    { name: 'طرق كشف غش الصباغين وحيل خلط البوية', href: '/blog/detecting-painter-scams-kuwait', category: 'ضبط الجودة' },
    { name: 'عازل جيتاروف الكويت لعزل الأسطح من خرير المطر', href: '/blog/roof-waterproofing-jetaroof-kuwait', category: 'عزل الأسطح' },
    { name: 'صبغ وتجديد أبواب الخشب ناري ولاكر بالكويت', href: '/blog/wood-door-painting-kuwait', category: 'أبواب وأخشاب' },
    { name: 'تجديد صبغ شقة إيجار واسترداد مبلغ التأمين', href: '/blog/repainting-rental-apartment-handover-kuwait', category: 'شقق الإيجار' },
    { name: 'دليل تشطيب قسائم المطلاع وغرب عبدالله المبارك', href: '/blog/finishing-new-villas-mutlaa-kuwait', category: 'تشطيب قسائم' },
    { name: 'طريقة استلام أعمال الصبغ والفحص بالكشاف', href: '/blog/how-to-inspect-completed-paintwork-kuwait', category: 'فحص واستلام' },
  ];

  // المناطق الأكثر طلباً (سريعة النقر)
  const popularAreas = [
    { name: 'السالمية', href: '/areas/hawalli/al-salmiya' },
    { name: 'حولي', href: '/areas/hawalli/hawalli-city' },
    { name: 'الجابرية', href: '/areas/hawalli/al-jabriya' },
    { name: 'الرميثية', href: '/areas/hawalli/al-rumaithiya' },
    { name: 'جنوب السرة', href: '/areas/hawalli/dhaher-al-surra' },
    { name: 'حطين والزهراء', href: '/areas/hawalli/dhaher-al-surra' },
    { name: 'صباح السالم', href: '/areas/mubarak-al-kabeer/sabah-al-salem' },
    { name: 'أبو فطيرة', href: '/areas/mubarak-al-kabeer/abu-ftaira' },
    { name: 'الفنيطيس', href: '/areas/mubarak-al-kabeer/al-fnaitees' },
    { name: 'المسايل', href: '/areas/mubarak-al-kabeer/al-masayel' },
    { name: 'خيطان', href: '/areas/farwaniyah/khaitan' },
    { name: 'الفروانية', href: '/areas/farwaniyah/farwaniyah-city' },
    { name: 'إشبيلية', href: '/areas/farwaniyah/ishbiliya' },
    { name: 'العقيلة', href: '/areas/ahmadi/al-egaila' },
    { name: 'الفنطاس', href: '/areas/ahmadi/al-fintas' },
    { name: 'المهبولة', href: '/areas/ahmadi/mahboula' },
    { name: 'الفحيحيل', href: '/areas/ahmadi/al-fahaheel' },
    { name: 'كيفان', href: '/areas/capital/kaifan' },
    { name: 'الروضة', href: '/areas/capital/al-rawda' },
    { name: 'الشامية', href: '/areas/capital/al-shamiya' },
    { name: 'الصليبيخات', href: '/areas/capital/sulaibikhat' },
    { name: 'سعد العبدالله', href: '/areas/jahra/saad-al-abdullah' },
  ];

  return (
    <footer className="footer" dir="rtl" style={{ background: '#12332c', color: '#d9e0d3', paddingTop: '48px', paddingBottom: '32px' }}>
      <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
        
        {/* صف العلامة والموثوقية العلوية */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            paddingBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div>
            <Brand light={true} />
            <p
              style={{
                margin: '10px 0 0',
                fontSize: '12px',
                color: '#b0bfb2',
                maxWidth: '460px',
                lineHeight: 1.8,
              }}
            >
              دليل الكويت الأول المتخصص في الربط المباشر بين أصحاب المنازل والفلل وأمهر معلمي وورش الأصباغ والديكورات والترميم في كافة محافظات الكويت.
            </p>
          </div>

          {/* شارات الجودة والمواد المعتمدة */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '12px 18px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ fontSize: '11px', color: '#e9bd77', fontWeight: 700 }}>
              مواد أصلية معتمدة:
            </span>
            <span style={{ fontSize: '11px', color: '#d9e0d3' }}>جوتن (Jotun)</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: '11px', color: '#d9e0d3' }}>كابارول (Caparol)</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: '11px', color: '#d9e0d3' }}>سيجما (Sigma)</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: '11px', color: '#d9e0d3' }}>سان ماركو الإيطالية</span>
          </div>
        </div>

        {/* مصفوفة الروابط المبوبة الشاملة (Internal Link Matrix) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px 24px',
            padding: '36px 0 32px',
          }}
        >
          {/* العمود 1: المحافظات الست */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                color: '#e9bd77',
              }}
            >
              <Building2 size={16} />
              <strong style={{ fontSize: '13px', letterSpacing: '-0.02em' }}>
                صباغ حسب المحافظات
              </strong>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {governorates.map((gov) => (
                <li key={gov.name}>
                  <Link
                    href={gov.href}
                    style={{
                      color: '#c4d1c6',
                      textDecoration: 'none',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#c4d1c6')}
                  >
                    <span>{gov.name}</span>
                    <span style={{ fontSize: '10px', color: '#7a8e80', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px' }}>
                      {gov.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود 2: المدن السكنية الجديدة */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                color: '#e9bd77',
              }}
            >
              <Compass size={16} />
              <strong style={{ fontSize: '13px', letterSpacing: '-0.02em' }}>
                المدن السكنية الجديدة
              </strong>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {newCities.map((city) => (
                <li key={city.name}>
                  <Link
                    href={city.href}
                    style={{
                      color: '#c4d1c6',
                      textDecoration: 'none',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#c4d1c6')}
                  >
                    <span>{city.name}</span>
                    <span
                      style={{
                        fontSize: '9px',
                        color: '#dfb56c',
                        background: 'rgba(233, 189, 119, 0.12)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                      }}
                    >
                      {city.badge}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود 3: خدمات الأصباغ والديكور الست */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                color: '#e9bd77',
              }}
            >
              <Paintbrush size={16} />
              <strong style={{ fontSize: '13px', letterSpacing: '-0.02em' }}>
                خدمات الأصباغ والديكور
              </strong>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paintingServices.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    style={{
                      color: '#c4d1c6',
                      textDecoration: 'none',
                      fontSize: '12px',
                      display: 'block',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#c4d1c6')}
                  >
                    <div style={{ fontWeight: 600 }}>{service.name}</div>
                    <div style={{ fontSize: '10px', color: '#889e8f', marginTop: '2px' }}>{service.desc}</div>
                  </Link>
                </li>
              ))}
              <li style={{ paddingTop: '4px' }}>
                <Link
                  href="/services"
                  style={{
                    color: '#e9bd77',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>دليل كافة الخدمات (12 خدمة كاملة)</span>
                  <ArrowUpLeft size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود 4: أحدث مقالات المدونة */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                color: '#e9bd77',
              }}
            >
              <BookOpen size={16} />
              <strong style={{ fontSize: '13px', letterSpacing: '-0.02em' }}>
                مدونة صباغ الكويت
              </strong>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {blogArticles.map((article) => (
                <li key={article.name}>
                  <Link
                    href={article.href}
                    style={{
                      color: '#c4d1c6',
                      textDecoration: 'none',
                      fontSize: '12px',
                      display: 'block',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#c4d1c6')}
                  >
                    <div style={{ fontWeight: 600, lineHeight: 1.5 }}>{article.name}</div>
                    <div style={{ fontSize: '10px', color: '#dfb56c', marginTop: '2px' }}>{article.category}</div>
                  </Link>
                </li>
              ))}
              <li style={{ paddingTop: '4px' }}>
                <Link
                  href="/blog"
                  style={{
                    color: '#e9bd77',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>عرض جميع مقالات المدونة</span>
                  <ArrowUpLeft size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود 5: صفحات ومسارات الدليل */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                color: '#e9bd77',
              }}
            >
              <ShieldCheck size={16} />
              <strong style={{ fontSize: '13px', letterSpacing: '-0.02em' }}>
                أقسام الدليل والخدمة
              </strong>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <li>
                <Link href="/" style={{ color: '#c4d1c6', textDecoration: 'none', fontSize: '12px' }}>
                  الرئيسية ودليل الصباغين
                </Link>
              </li>
              <li>
                <Link href="/areas" style={{ color: '#e9bd77', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>
                  دليل مناطق ومحافظات الكويت
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ color: '#c4d1c6', textDecoration: 'none', fontSize: '12px' }}>
                  دليل الأصباغ والديكور (12 خدمة)
                </Link>
              </li>
              <li>
                <Link href="/blog" style={{ color: '#e9bd77', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>
                  مدونة نصائح وتشطيب الأصباغ
                </Link>
              </li>
              <li>
                <Link href="/request-quote" style={{ color: '#c4d1c6', textDecoration: 'none', fontSize: '12px' }}>
                  حاسبة تكلفة الصبغ والمعاينة
                </Link>
              </li>
              <li>
                <Link href="/faq" style={{ color: '#c4d1c6', textDecoration: 'none', fontSize: '12px' }}>
                  الأسئلة الشائعة وضمان الأعمال
                </Link>
              </li>
              <li>
                <Link href="/join-painter" style={{ color: '#c4d1c6', textDecoration: 'none', fontSize: '12px' }}>
                  انضم كصباغ وسجل ورشتك
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* سحابة المناطق الأكثر طلباً (Quick Geo-Pills for Local SEO) */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '22px',
            paddingBottom: '22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#e9bd77',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            <MapPin size={13} />
            <span>صباغين متاحين الآن في أشهر مناطق الكويت:</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 8px',
            }}
          >
            {popularAreas.map((area) => (
              <Link
                key={area.name}
                href={area.href}
                style={{
                  fontSize: '11px',
                  color: '#b0bfb2',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(233, 189, 119, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(233, 189, 119, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#b0bfb2';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                صباغ {area.name}
              </Link>
            ))}
          </div>
        </div>

        {/* الشريط السفلي النهائي */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '11px',
            color: '#899d90',
          }}
        >
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} صباغ الكويت · إحدى خدمات منصة فني الكويت المعتمدة
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: '#d9c597' }}>تواصل مباشر مع الصباغ بدون وسيط أو عمولة</span>
            <span>•</span>
            <Link href="/faq" aria-label="شروط الضمان والمصداقية" style={{ color: 'inherit', textDecoration: 'none' }}>الضمان والمصداقية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
