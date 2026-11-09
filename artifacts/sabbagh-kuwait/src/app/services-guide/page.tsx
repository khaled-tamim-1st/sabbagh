import React from 'react';
import type { Metadata } from 'next';
import ServicesGuidePage from '@/views/services-guide';

export const metadata: Metadata = {
  title: 'دليل خدمات ومواصفات الأصباغ والتشطيبات في الكويت | صباغ الكويت',
  description:
    'دليل شامل ومحدث لمواصفات ومعايير خدمات الأصباغ في الكويت: صبغ الغرف والشقق، بستيل جوتن، سيجما الواجهات، بديل الرخام والخشب، وعوازل الأسطح مع كفالة معتمدة.',
  alternates: {
    canonical: 'https://sabbaghelkuwait.online/services-guide',
  },
  openGraph: {
    title: 'دليل خدمات ومواصفات الأصباغ والتشطيبات في الكويت | صباغ الكويت',
    description: 'الدليل المعتمد لمواصفات خدمات الأصباغ والتشطيب من صباغ الكويت.',
    url: 'https://sabbaghelkuwait.online/services-guide',
    siteName: 'صباغ الكويت',
  },
};

export default function ServicesGuideIndexRoute() {
  return <ServicesGuidePage />;
}
