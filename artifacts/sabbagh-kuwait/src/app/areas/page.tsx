import React from 'react';
import type { Metadata } from 'next';
import AreaPage from '@/views/area-page';

export const metadata: Metadata = {
  title: 'دليل مناطق ومحافظات الكويت لخدمات الأصباغ | فني الكويت (صباغ معتمد)',
  description:
    'ابحث عن أمهر الصباغين والفنيين المعتمدين في منطقتك بجميع محافظات الكويت الست والمدن الجديدة (المطلاع، صباح الأحمد، الخيران). معاينة مجانية، أسعار حقيقية، وواتساب مباشر.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/areas',
  },
  openGraph: {
    title: 'دليل مناطق ومحافظات الكويت لخدمات الأصباغ | فني الكويت',
    description: 'ابحث عن صباغ وفني معتمد في منطقتك بجميع محافظات الكويت.',
    url: 'https://sabbagh-kuwait.com/areas',
    siteName: 'فني الكويت | صباغ الكويت',
  },
};

export default function AreasIndexPage() {
  return <AreaPage />;
}
