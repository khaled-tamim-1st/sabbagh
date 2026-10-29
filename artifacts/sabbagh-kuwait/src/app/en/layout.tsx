import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Painting Services Kuwait | Top Certified House & Flat Painters - Fani Kuwait',
    template: '%s | Fani Kuwait (Kuwait Painters)',
  },
  description:
    'Certified painting services directory in Kuwait: connect with vetted, expert house and apartment painters across all governorates (Hawalli, Capital, Farwaniya, Ahmadi, Jahra). Genuine Jotun Fenomastic paints, transparent KWD prices, free inspection and fast English WhatsApp coordination.',
  keywords: [
    'painting services kuwait',
    'painters in kuwait',
    'cheap painter in kuwait',
    'apartment painting kuwait',
    'villa painting cost kuwait',
    'english speaking painter kuwait',
    'jotun painter kuwait',
    'wall painter salmiya',
    'move out repaint kuwait',
    'house painter hawally',
    'italian stucco paint kuwait',
    'wallpaper installation kuwait',
    'moisture wall repair kuwait',
    'sigma coating kuwait',
    'epoxy flooring kuwait',
  ],
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/',
      'en-KW': 'https://sabbagh-kuwait.com/en/',
      'x-default': 'https://sabbagh-kuwait.com/',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://sabbagh-kuwait.com/en/',
    title: 'Painting Services Kuwait | Top Certified House & Flat Painters - Fani Kuwait',
    description:
      'Compare top certified painters in Kuwait. Transparent prices in KWD, genuine Jotun & Caparol paints, free inspection and direct WhatsApp coordination.',
    siteName: 'Fani Kuwait | Kuwait Painters',
    locale: 'en_KW',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Kuwait Painters - Fani Kuwait',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Painting Services Kuwait | Expert House & Villa Painters',
    description: 'Verified painting and wall finishing directory across all Kuwait areas.',
    images: ['/logo.png'],
  },
};

export default function EnglishRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`en-locale-container ${inter.className} ${inter.variable}`} dir="ltr" lang="en">
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{document.documentElement.lang='en';document.documentElement.dir='ltr';}catch(e){}})();`,
        }}
      />
      {children}
    </div>
  );
}
