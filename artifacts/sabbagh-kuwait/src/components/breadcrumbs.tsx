import { type FC } from 'react';
import { Link } from '@/lib/nav';
import { Home as HomeIcon, ChevronLeft } from 'lucide-react';

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbCrumb[];
  className?: string;
  includeHome?: boolean;
  homeLabel?: string;
  baseUrl?: string;
  showVisualContainer?: boolean;
}

/**
 * مكوّن مسار التنقل (Breadcrumbs) المتوافق مع معايير السيو ومحركات البحث (Schema.org & Google Rich Results)
 * يولد Microdata و JSON-LD مهيأ للزحف الفوري لتعزيز الروابط الداخلية وترتيب الموقع
 */
export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  items,
  className = '',
  includeHome = true,
  homeLabel = 'الرئيسية',
  baseUrl = 'https://sabbagh-kuwait.com',
  showVisualContainer = true,
}) => {
  // تجميع قائمة المسارات الكاملة مع الرئيسية
  const fullItems: BreadcrumbCrumb[] = includeHome
    ? [{ label: homeLabel, href: '/', isCurrent: items.length === 0 }, ...items]
    : items;

  // إعداد بيانات JSON-LD المتوافقة مع معايير Schema.org لمحركات البحث
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => {
      const position = index + 1;
      const cleanHref = item.href || '/';
      const fullUrl = cleanHref.startsWith('http')
        ? cleanHref
        : `${baseUrl}${cleanHref.startsWith('/') ? cleanHref : `/${cleanHref}`}`;

      return {
        '@type': 'ListItem',
        position,
        name: item.label,
        item: fullUrl,
      };
    }),
  };

  const containerStyle: React.CSSProperties = showVisualContainer
    ? {
        background: '#f7f3ea',
        borderBottom: '1px solid #e7decd',
        padding: '10px 0',
      }
    : {
        padding: '8px 0',
      };

  return (
    <>
      {/* تضمين المخطط البنائي لبيانات السيو المهيكلة (Structured Data JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <nav
        aria-label="مسار التنقل"
        className={`breadcrumb-nav ${className}`}
        style={containerStyle}
        dir="rtl"
      >
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
          <ol
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
              margin: 0,
              padding: 0,
              listStyle: 'none',
              fontSize: '12px',
            }}
          >
            {fullItems.map((item, index) => {
              const isLast = index === fullItems.length - 1 || item.isCurrent;
              const isHome = index === 0 && includeHome;
              const position = index + 1;

              return (
                <li
                  key={`${item.label}-${index}`}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: isLast ? '#17483e' : '#687268',
                    fontWeight: isLast ? 700 : 500,
                  }}
                >
                  {isLast ? (
                    // العنصر الأخير (الصفحة الحالية غير قابلة للنقر لحفظ مسار السيو)
                    <span
                      itemProp="name"
                      aria-current="page"
                      style={{
                        color: '#1d4038',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#ede6d8',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {isHome && <HomeIcon size={13} style={{ color: '#17483e' }} />}
                      {item.label}
                    </span>
                  ) : item.href ? (
                    // روابط مسار التنقل الوسيطة
                    <Link
                      href={item.href}
                      itemProp="item"
                      style={{
                        color: '#495a51',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#17483e';
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#495a51';
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      {isHome && <HomeIcon size={13} style={{ color: '#889487' }} />}
                      <span itemProp="name">{item.label}</span>
                    </Link>
                  ) : (
                    <span itemProp="name">{item.label}</span>
                  )}

                  {/* رقم الترتيب في Schema.org */}
                  <meta itemProp="position" content={String(position)} />

                  {/* فاصل الأسهم الموجه لليمين في اللغة العربية */}
                  {!isLast && (
                    <ChevronLeft
                      size={13}
                      style={{
                        color: '#a6a195',
                        flexShrink: 0,
                        transform: 'rotate(0deg)',
                      }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumbs;
