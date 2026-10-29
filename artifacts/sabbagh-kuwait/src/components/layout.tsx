import { type ReactNode } from 'react';
import { Header } from './header';
import { SiteFooter, Brand } from './footer';

export { Brand };

interface LayoutProps {
  children: ReactNode;
  activeNav?: string;
  hideFooterAction?: boolean;
  lang?: string;
}

export function Layout({ children, activeNav }: LayoutProps) {
  return (
    <div className="site-shell" dir="rtl">
      <Header activeNav={activeNav} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export default Layout;
