import type { Metadata, Viewport } from 'next';
import '../index.css';
import { Providers } from './providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'صباغ الكويت | دليل خدمات الأصباغ والدهانات والديكورات المعتمدة',
  description:
    'دليل صباغ الكويت الأول: قارن وتواصل مباشرة مع أفضل صباغين موثقين في كافة مناطق الكويت (حولي، العاصمة، الفروانية، الأحمدي، مبارك الكبير، والجهراء). أسعار حقيقية بالدينار الكويتي، أصباغ جوتن وهمبل وكابارول، معاينة مجانية وواتساب مباشر.',
  keywords: [
    'صباغ الكويت',
    'صباغ شاطر ورخيص',
    'صباغ حولي',
    'صباغ السالمية',
    'صباغ العاصمة',
    'صباغ الفروانية',
    'أصباغ جوتن الكويت',
    'دهان منازل',
    'بديل الرخام',
    'ورق جدران',
  ],
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://sabbagh-kuwait.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://sabbagh-kuwait.com/',
    title: 'صباغ الكويت | الدليل المعتمد لخدمات الصباغة والتشطيب',
    description:
      'قارن بين أمهر الصباغين في الكويت، تعرف على الأسعار بالدينار، واطلب معاينة مجانية عبر الواتساب مباشرة.',
    siteName: 'صباغ الكويت',
    locale: 'ar_KW',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'صباغ الكويت',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'صباغ الكويت | دليل الأصباغ والدهانات',
    description: 'دليل معتمد وموثق لخدمات الصبغ والديكورات في جميع محافظات الكويت.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
