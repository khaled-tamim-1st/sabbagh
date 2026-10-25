import React from 'react';
import type { Metadata } from 'next';
import ServicesGuidePage from '@/views/services-guide';

export const metadata: Metadata = {
  title: 'دليل خدمات وأسعار الأصباغ والتشطيب في الكويت 2026',
  description:
    'دليل شامل لأسعار ومواصفات خدمات الأصباغ في الكويت: أصباغ داخلية وخارجية سيجما، بديل الرخام، بديل الخشب، ورق جدران، أرضيات إيبوكسي، وعوازل أسطح معتمدة بالدينار الكويتي.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/services',
  },
};

export default function ServicesIndexRoute() {
  return <ServicesGuidePage />;
}
