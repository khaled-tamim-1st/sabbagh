import React from 'react';
import type { Metadata } from 'next';
import ServicesGuidePage from '@/views/services-guide';

export const metadata: Metadata = {
  title: 'خدمات الأصباغ والديكورات بالكويت | صباغ الكويت',
  description:
    'دليل شامل لخدمات وأسعار الأصباغ والدهانات والديكور في الكويت: أصباغ جوتن وكابارول داخلية، سيجما واجهات خارجية، بديل الرخام، بديل الخشب، ورق جدران، وعوازل معتمدة بالدينار.',
  alternates: {
    canonical: 'https://sabbaghelkuwait.online/services',
  },
  openGraph: {
    title: 'خدمات الأصباغ والديكورات بالكويت | صباغ الكويت',
    description:
      'تصفح دليل خدمات الأصباغ والدهانات والديكور في الكويت. أسعار معتمدة بالدينار، معاينة مجانية، وتواصل واتساب مباشر.',
    url: 'https://sabbaghelkuwait.online/services',
    siteName: 'صباغ الكويت',
  },
};

export default function ServicesIndexRoute() {
  return <ServicesGuidePage />;
}
