import React from 'react';
import type { Metadata } from 'next';
import AreaPage from '@/views/area-page';

export const metadata: Metadata = {
  title: 'مناطق ومحافظات الكويت | دليل الصباغين والدهانات المعتمدين',
  description:
    'دليل شامل لصباغين لكافة محافظات الكويت: العاصمة، حولي، الفروانية، الأحمدي، مبارك الكبير، والجهراء مع المدن السكنية الجديدة (المطلاع، صباح الأحمد، جابر الأحمد).',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/areas',
  },
};

export default function AreasIndexPage() {
  return <AreaPage />;
}
