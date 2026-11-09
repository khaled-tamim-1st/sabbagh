import React from 'react';
import type { Metadata } from 'next';
import AreaPage from '@/views/area-page';

export const metadata: Metadata = {
  title: 'دليل مناطق الكويت للأصباغ | صباغ الكويت',
  description:
    'ابحث عن صباغين وفنيين معتمدين في منطقتك بكافة محافظات الكويت ومدن المطلاع وصباح الأحمد. معاينة مجانية، أسعار حقيقية، وواتساب مباشر.'.slice(0, 155),
  alternates: {
    canonical: 'https://sabbaghelkuwait.online/areas',
  },
  openGraph: {
    title: 'دليل مناطق الكويت للأصباغ | صباغ الكويت',
    description: 'ابحث عن صباغ وفني معتمد في منطقتك بجميع محافظات الكويت.',
    url: 'https://sabbaghelkuwait.online/areas',
    siteName: 'صباغ الكويت',
    type: 'website',
    images: [
      {
        url: 'https://sabbaghelkuwait.online/logo.png',
        width: 1200,
        height: 630,
        alt: 'مناطق الكويت للأصباغ',
      },
    ],
  },
};

export default function AreasIndexPage() {
  return <AreaPage />;
}
