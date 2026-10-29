import { type ReactNode } from 'react';
import { Header } from './header';
import { SiteFooter, Brand } from './footer';

export { Brand };

interface LayoutProps {
  children: ReactNode;
  activeNav?: string;
  hideFooterAction?: boolean;
  lang?: 'ar' | 'en';
}

export function Layout({ children, activeNav, lang = 'ar' }: LayoutProps) {
  const isEn = lang === 'en';
  return (
    <div className="site-shell" dir={isEn ? 'ltr' : 'rtl'}>
      <Header activeNav={activeNav} lang={lang} />
      <main>{children}</main>
      <SiteFooter lang={lang} />
    </div>
  );
}

export default Layout;

