import React from 'react';
import type { Metadata } from 'next';
import ServicesGuidePage from '@/views/services-guide';

export const metadata: Metadata = {
  title: 'خدمات الأصباغ والديكورات بالكويت | فني الكويت للتشطيبات (صباغ معتمد)',
  description:
    'دليل شامل لخدمات وأسعار الأصباغ والدهانات والديكور في الكويت: أصباغ جوتن وكابارول داخلية، سيجما واجهات خارجية، بديل الرخام، بديل الخشب، ورق جدران، وعوازل معتمدة بالدينار.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/services',
  },
  openGraph: {
    title: 'خدمات الأصباغ والديكورات بالكويت | فني الكويت للتشطيبات',
    description:
      'تصفح دليل خدمات الأصباغ والدهانات والديكور في الكويت. أسعار معتمدة بالدينار، معاينة مجانية، وتواصل واتساب مباشر.',
    url: 'https://sabbagh-kuwait.com/services',
    siteName: 'فني الكويت | صباغ الكويت',
  },
};

export default function ServicesIndexRoute() {
  return <ServicesGuidePage />;
}
