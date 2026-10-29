import type { Metadata, Viewport } from 'next';
import '../index.css';
import { Providers } from './providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'صباغ الكويت | أفضل فني دهانات وديكورات معتمد - فني الكويت',
    template: '%s | فني الكويت (صباغ الكويت)',
  },
  description:
    'دليل صباغ الكويت المعتمد من فني الكويت: تواصل مع أمهر الصباغين وفنيي الديكورات في كافة المحافظات (حولي، العاصمة، الفروانية، الأحمدي، مبارك الكبير، والجهراء). أسعار حقيقية بالدينار، دهانات جوتن الأصلية، معاينة مجانية وواتساب فوري.',
  keywords: [
    'صباغ الكويت',
    'فني الكويت',
    'فني صباغ الكويت',
    'صباغ شاطر ورخيص',
    'رقم صباغ بالكويت',
    'معلم دهانات الكويت',
    'صباغ حولي',
    'صباغ السالمية',
    'صباغ العاصمة',
    'صباغ الفروانية',
    'أصباغ جوتن الكويت',
    'دهان منازل',
    'بديل الرخام',
    'بديل الخشب',
    'ورق جدران',
    'سيجما واجهات الكويت',
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
    title: 'صباغ الكويت | أفضل فني دهانات وديكورات معتمد - فني الكويت',
    description:
      'قارن بين أمهر الصباغين في الكويت، تعرف على الأسعار بالدينار، واطلب معاينة مجانية عبر الواتساب مباشرة من منصة فني الكويت.',
    siteName: 'فني الكويت | صباغ الكويت',
    locale: 'ar_KW',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'صباغ الكويت - فني الكويت',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'صباغ الكويت | أفضل فني دهانات وتشطيبات - فني الكويت',
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
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="service-catalog" type="application/json" href="/.well-known/ai-catalog.json" />
        <link rel="ai-catalog" type="application/json" href="/ai-catalog.json" />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground"
        style={{ fontFamily: "'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
