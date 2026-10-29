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
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Globe,
} from 'lucide-react';

export function Brand({
  light = false,
  showName = true,
  size = 52,
  priority = false,
  href = '/',
}: {
  light?: boolean;
  showName?: boolean;
  size?: number;
  priority?: boolean;
  href?: string;
}) {
  const width = Math.round(size * 1.28);
  const webpSrc = light ? '/logo-light.webp' : '/logo.webp';
  const pngSrc = light ? '/logo-light.png' : '/logo.png';

  return (
    <Link
      href={href}
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
export const SiteFooter: FC<{ lang?: string }> = () => {

  // محافظات الكويت الست
  const governorates = [
        { name: 'صباغ محافظة العاصمة', href: '/areas/capital', count: '29 منطقة' },
        { name: 'صباغ محافظة حولي', href: '/areas/hawalli', count: '16 منطقة' },
        { name: 'صباغ محافظة الفروانية', href: '/areas/farwaniyah', count: '16 منطقة' },
        { name: 'صباغ محافظة الأحمدي', href: '/areas/ahmadi', count: '20 منطقة' },
        { name: 'صباغ محافظة مبارك الكبير', href: '/areas/mubarak-al-kabeer', count: '12 منطقة' },
        { name: 'صباغ محافظة الجهراء', href: '/areas/jahra', count: '15 منطقة' },
      ];

  // المدن السكنية الجديدة الأكثر طلباً
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

  // أحدث مقالات وأدلة
  const blogArticles = [
        { name: 'سعر صبغ الغرفة والشقة بالدينار الكويتي 2026', href: '/blog/room-painting-cost-kuwait', category: 'أسعار وتكاليف' },
        { name: 'سعر متر السيجما والواجهات الخارجية بالكويت', href: '/blog/sigma-exterior-cost-kuwait', category: 'واجهات وسيجما' },
        { name: 'أسعار دهانات جوتن بالكويت (فينوماستيك وجوتاشيلد)', href: '/blog/jotun-paint-prices-kuwait', category: 'أسعار وتكاليف' },
        { name: 'شلون تختار صباغ شاطر ورخيص في الكويت؟', href: '/blog/how-to-choose-skilled-affordable-painter-kuwait', category: 'اختيار الصباغ' },
      ];

  // المناطق الأكثر طلباً (سريعة النقر)
  const popularAreas = [
        { name: 'السالمية', href: '/areas/hawalli/al-salmiya' },
        { name: 'حولي', href: '/areas/hawalli/hawalli-city' },
        { name: 'الجابرية', href: '/areas/hawalli/al-jabriya' },
        { name: 'الرميثية', href: '/areas/hawalli/al-rumaithiya' },
        { name: 'صباح السالم', href: '/areas/mubarak-al-kabeer/sabah-al-salem' },
        { name: 'خيطان', href: '/areas/farwaniyah/khaitan' },
        { name: 'الفروانية', href: '/areas/farwaniyah/farwaniyah-city' },
        { name: 'الفنطاس', href: '/areas/ahmadi/al-fintas' },
        { name: 'المهبولة', href: '/areas/ahmadi/mahboula' },
        { name: 'الفحيحيل', href: '/areas/ahmadi/al-fahaheel' },
        { name: 'كيفان', href: '/areas/capital/kaifan' },
        { name: 'الروضة', href: '/areas/capital/al-rawda' },
      ];

  const ArrowIcon = ArrowUpLeft;

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
            <Brand light={true} href="/" />
            <p
              style={{
                margin: '10px 0 0',
                fontSize: '12px',
                color: '#b0bfb2',
                maxWidth: '480px',
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
            <span style={{ fontSize: '11px', color: '#d9e0d3' }}>Jotun Kuwait</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: '11px', color: '#d9e0d3' }}>Caparol</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: '11px', color: '#d9e0d3' }}>Sigma Coatings</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: '11px', color: '#d9e0d3' }}>San Marco (Italy)</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e9bd77', marginBottom: '14px', fontWeight: 700, fontSize: '13px' }}>
              <Building2 size={16} />
              <span>محافظات الكويت الست</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {governorates.map((gov) => (
                <li key={gov.name}>
                  <Link
                    href={gov.href}
                    style={{
                      color: '#d9e0d3',
                      textDecoration: 'none',
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{gov.name}</span>
                    <span style={{ fontSize: '10px', color: '#899d90', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px' }}>
                      {gov.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود 2: المدن والمناطق الحيوية */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e9bd77', marginBottom: '14px', fontWeight: 700, fontSize: '13px' }}>
              <Compass size={16} />
              <span>مدن ومناطق حيوية</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {newCities.map((city) => (
                <li key={city.name}>
                  <Link
                    href={city.href}
                    style={{
                      color: '#d9e0d3',
                      textDecoration: 'none',
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{city.name}</span>
                    <span style={{ fontSize: '10px', color: '#e9bd77', background: 'rgba(233,189,119,0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                      {city.badge}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود 3: خدمات الأصباغ والديكور */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e9bd77', marginBottom: '14px', fontWeight: 700, fontSize: '13px' }}>
              <Paintbrush size={16} />
              <span>خدمات الأصباغ والتشطيب</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paintingServices.slice(0, 6).map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    style={{
                      color: '#d9e0d3',
                      textDecoration: 'none',
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{service.name}</span>
                    <span style={{ fontSize: '10px', color: '#899d90' }}>{service.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود 4: أدلة الأسعار والمقالات */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e9bd77', marginBottom: '14px', fontWeight: 700, fontSize: '13px' }}>
              <BookOpen size={16} />
              <span>أدلة الأسعار والمعرفة</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {blogArticles.map((art) => (
                <li key={art.name}>
                  <Link
                    href={art.href}
                    style={{
                      color: '#d9e0d3',
                      textDecoration: 'none',
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <span style={{ lineHeight: 1.4 }}>{art.name}</span>
                    <span style={{ fontSize: '10px', color: '#e9bd77' }}>{art.category}</span>
                  </Link>
                </li>
              ))}
              <li style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Link
                  href="/request-quote"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(233,189,119,0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(233,189,119,0.3)',
                  }}
                >
                  <Calculator size={14} color="#e9bd77" />
                  <span>احسب تكلفة صبغ بيتك فوراً</span>
                  <ArrowIcon size={14} style={{ marginInlineStart: 'auto' }} />
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
            <span style={{ color: '#d9c597' }}>
              تواصل مباشر مع الصباغ بدون وسيط أو عمولة
            </span>
            <span>•</span>
            <Link href="/faq" aria-label="شروط الضمان والمصداقية" style={{ color: 'inherit', textDecoration: 'none' }}>
              الضمان والمصداقية
            </Link>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
