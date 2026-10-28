import React from 'react';
import type { Metadata } from 'next';
import ServicesGuidePage from '@/views/services-guide';

export const metadata: Metadata = {
  title: 'دليل أسعار الأصباغ والتشطيبات في الكويت 2026 | فني الكويت (صباغ معتمد)',
  description:
    'دليل شامل ومحدث لأسعار ومواصفات خدمات الأصباغ في الكويت: تكلفة صبغ الغرف والشقق، أسعار بستيل جوتن، سعر متر السيجما، بديل الرخام، وعوازل الأسطح بالدينار الكويتي.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/services-guide',
  },
  openGraph: {
    title: 'دليل أسعار الأصباغ والتشطيبات في الكويت 2026 | فني الكويت',
    description: 'الدليل المعتمد لأسعار الأصباغ والتشطيب بالدينار الكويتي.',
    url: 'https://sabbagh-kuwait.com/services-guide',
    siteName: 'فني الكويت | صباغ الكويت',
  },
};

export default function ServicesGuideIndexRoute() {
  return <ServicesGuidePage />;
}
