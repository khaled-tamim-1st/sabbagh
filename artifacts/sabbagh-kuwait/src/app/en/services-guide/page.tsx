import React from 'react';
import type { Metadata } from 'next';
import ServicesGuideEn from '@/views/services-guide-en';

export const metadata: Metadata = {
  title: 'Kuwait Painting Prices Guide 2026 | Full Cost Breakdown - Fani Kuwait',
  description:
    'Comprehensive guide to house and flat painting costs in Kuwait: price per room, Jotun Fenomastic drum prices, exterior Sigma cost per m², epoxy flooring, and money-saving tips.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/services-guide/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/services-guide/',
      'en-KW': 'https://sabbagh-kuwait.com/en/services-guide/',
    },
  },
};

export default function EnglishServicesGuidePage() {
  return <ServicesGuideEn />;
}
