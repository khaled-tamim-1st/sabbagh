import { useState, useEffect, type FC } from 'react';
import { Link, useLocation } from '@/lib/nav';
import {
  Menu,
  X,
  Calculator,
  Heart,
  Home as HomeIcon,
  MapPin,
  BookOpen,
  Newspaper,
  Layers,
  HelpCircle,
  UserPlus,
  MessageCircle,
  ChevronLeft,
  LogIn,
  LogOut,
  ShieldCheck,
  Paintbrush,
  User,
} from 'lucide-react';
import { Brand } from './footer';
import { useAuth } from '@/lib/auth-context';

export interface HeaderProps {
  favoritesCount?: number;
  favoritesOnly?: boolean;
  onToggleFavorites?: () => void;
  activeNav?: string;
}

export const Header: FC<HeaderProps> = ({
  favoritesCount = 0,
  favoritesOnly = false,
  onToggleFavorites,
  activeNav,
}) => {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // إغلاق القائمة تلقائياً عند تغيير المسار
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // منع التمرير في الخلفية عند فتح درج القائمة في الموبايل
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: HomeIcon, exact: true },
    { href: '/areas', label: 'مناطق الكويت', icon: MapPin },
    { href: '/services-guide', label: 'دليل الخدمات', icon: Layers },
    { href: '/blog', label: 'المدونة والنصائح', icon: Newspaper },
    { href: '/request-quote', label: 'احسب التكلفة', icon: Calculator },
    { href: '/faq', label: 'الأسئلة والضمان', icon: HelpCircle },
    { href: '/join-painter', label: 'انضم كصبّاغ', icon: UserPlus },
  ];

  const handleFavoritesClick = () => {
    if (onToggleFavorites) {
      onToggleFavorites();
      setIsMenuOpen(false);
      const directoryEl = document.getElementById('directory');
      if (directoryEl) {
        directoryEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/#directory';
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          {/* يمين: اللوجو واسم صباغ الكويت */}
          <Brand />

          {/* وسط: روابط التنقل في الأجهزة الكبيرة فقط */}
          <nav className="navlinks" aria-label="التنقل الرئيسي">
            {navItems.map((item) => {
              const currentPath = activeNav || location;
              const isActive = item.href === '/'
                ? currentPath === '/'
                : (item.href === '/areas'
                  ? currentPath.startsWith('/areas')
                  : (item.href === '/services-guide'
                    ? (currentPath.startsWith('/services') || currentPath.startsWith('/services-guide'))
                    : (item.href === '/blog'
                      ? currentPath.startsWith('/blog')
                      : currentPath === item.href)));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? 'font-bold text-[#17483e] pb-1 border-b-2 border-[#17483e]' : ''}
                  style={isActive ? { color: '#17483e', fontWeight: 700 } : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* يسار للأجهزة الكبيرة: أزرار سريعة لا تظهر على الموبايل */}
          <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {mounted && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/painter'}
                  className="saved-nav"
                  style={{
                    background: '#17483e',
                    color: '#fff9ee',
                    borderColor: '#17483e',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {user.role === 'admin' ? (
                    <ShieldCheck size={15} color="#e9bd77" />
                  ) : (
                    <Paintbrush size={15} color="#e9bd77" />
                  )}
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      background: 'rgba(233,189,119,0.25)',
                      color: '#e9bd77',
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      fontWeight: 700,
                    }}
                  >
                    {user.role === 'admin' ? 'مدير' : 'صباغ'}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="saved-nav"
                  title="تسجيل خروج"
                  style={{ padding: '6px 10px', color: '#c7664f', borderColor: '#e6ded0' }}
                >
                  <LogOut size={14} />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="saved-nav"
                style={{
                  background: '#fffdf9',
                  color: '#17483e',
                  borderColor: '#17483e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <LogIn size={15} color="#17483e" />
                <span>تسجيل الدخول</span>
              </Link>
            )}

            <Link
              href="/request-quote"
              className="saved-nav"
              style={{ background: '#17483e', color: '#fff9ee', borderColor: '#17483e' }}
            >
              <Calculator size={15} aria-hidden="true" />
              <span>احسب التكلفة</span>
            </Link>

            <button
              type="button"
              className="saved-nav"
              onClick={handleFavoritesClick}
              aria-pressed={favoritesOnly}
              data-testid="button-favorites-filter"
            >
              <Heart fill={favoritesOnly ? 'currentColor' : 'none'} aria-hidden="true" />
              <span>المفضلة</span>
              <span>({favoritesCount})</span>
            </button>
          </div>

          {/* يسار للهواتف: زر شريط القائمة الوحيد (Name + Logo + Menu Bar) */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="فتح القائمة الرئيسية"
            aria-expanded={isMenuOpen}
          >
            <Menu size={20} aria-hidden="true" />
            <span>القائمة</span>
          </button>
        </div>
      </header>

      {/* درج القائمة الجانبي للهواتف (Mobile Navigation Drawer) */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="شريط القائمة الرئيسي"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
          }}
        >
          {/* الخلفية المعتمة */}
          <div
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(17, 48, 41, 0.58)',
              backdropFilter: 'blur(4px)',
              animation: 'fade-in 0.2s ease',
            }}
          />

          {/* لوحة القائمة المنزلقة من اليمين (RTL) */}
          <aside
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(330px, 86vw)',
              background: '#fffdf9',
              boxShadow: '-8px 0 32px rgba(18, 51, 44, 0.22)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              borderLeft: '1px solid #e7decd',
              animation: 'modal-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* رأس القائمة: الشعار وزر الإغلاق */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderBottom: '1px solid #ede5d7',
                background: '#f9f5ed',
              }}
            >
              <Brand />
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="إغلاق القائمة"
                style={{
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  border: '1px solid #ded4c3',
                  background: '#fff',
                  color: '#17483e',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* الأزرار السريعة الأساسية */}
            <div style={{ padding: '20px 18px 12px' }}>
              {/* بطاقة المستخدم المسجل أو زر تسجيل الدخول للهواتف */}
              {mounted && user ? (
                <div
                  style={{
                    background: '#f2ece0',
                    border: '1px solid #dfd5c3',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {user.role === 'admin' ? (
                        <ShieldCheck size={18} color="#17483e" />
                      ) : (
                        <Paintbrush size={18} color="#17483e" />
                      )}
                      <strong style={{ fontSize: '13px', color: '#17483e' }}>{user.name}</strong>
                    </div>
                    <span
                      style={{
                        background: '#17483e',
                        color: '#e9bd77',
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontWeight: 700,
                      }}
                    >
                      {user.role === 'admin' ? 'مدير النظام' : 'صباغ معتمد'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={user.role === 'admin' ? '/admin' : '/painter'}
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        flex: 1,
                        background: '#17483e',
                        color: '#fff9ee',
                        padding: '8px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      لوحة التحكم
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      style={{
                        background: '#fff',
                        color: '#c7664f',
                        border: '1px solid #dcd4c6',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      خروج
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    background: '#fff',
                    color: '#17483e',
                    border: '1.5px solid #17483e',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '13px',
                    textDecoration: 'none',
                    marginBottom: '10px',
                  }}
                >
                  <LogIn size={16} />
                  <span>تسجيل الدخول / لوحة التحكم</span>
                </Link>
              )}

              <Link
                href="/request-quote"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  background: '#17483e',
                  color: '#f6f1e6',
                  padding: '13px 16px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(23,72,62,0.2)',
                  marginBottom: '10px',
                }}
              >
                <Calculator size={18} />
                <span>احسب التكلفة واطلب معاينة</span>
              </Link>

              <button
                type="button"
                onClick={handleFavoritesClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  background: favoritesOnly ? '#f2ece0' : '#fff',
                  color: '#17483e',
                  border: '1px solid #dcd3c3',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <Heart size={16} fill={favoritesOnly ? '#c7664f' : 'none'} color={favoritesOnly ? '#c7664f' : '#17483e'} />
                <span>الصباغون المفضلون ({favoritesCount})</span>
              </button>
            </div>

            {/* فاصل مبسط */}
            <div style={{ padding: '0 18px', margin: '4px 0' }}>
              <div style={{ height: '1px', background: '#ece3d3' }} />
            </div>

            {/* روابط التنقل الرئيسية */}
            <nav style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#889389', fontWeight: 600, padding: '0 8px 6px' }}>
                أقسام المنصة
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/'
                  ? location === '/'
                  : (item.href === '/areas'
                    ? location.startsWith('/areas')
                    : (item.href === '/services-guide'
                      ? (location.startsWith('/services') || location.startsWith('/services-guide'))
                      : (item.href === '/blog'
                        ? location.startsWith('/blog')
                        : location === item.href)));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      background: isActive ? '#f2ece0' : 'transparent',
                      color: isActive ? '#17483e' : '#334940',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={17} color={isActive ? '#17483e' : '#c7664f'} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronLeft size={16} color="#aaa59a" />
                  </Link>
                );
              })}
            </nav>

            {/* أسفل القائمة: تواصل مباشر */}
            <div
              style={{
                padding: '16px 18px',
                borderTop: '1px solid #ede5d7',
                background: '#faf6ee',
              }}
            >
              <a
                href="https://wa.me/96590000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A7%D8%AD%D8%AA%D8%A7%D8%AC%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B5%D8%A8%D8%A7%D8%BA%D8%A9"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: '#fff',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={17} />
                <span>تواصل مع الإدارة واتساب</span>
              </a>
              <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: '11px', color: '#889389' }}>
                دليل معتمد وموثق لخدمات الصبغ في الكويت
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
