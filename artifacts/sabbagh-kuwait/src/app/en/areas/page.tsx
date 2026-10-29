import React from 'react';
import type { Metadata } from 'next';
import AreaPageEn from '@/views/area-page-en';

export const metadata: Metadata = {
  title: 'Kuwait Painting Services by Area & Governorate | Fani Kuwait',
  description:
    'Find vetted painters in your area across all 6 Kuwait governorates: Hawalli, Capital, Farwaniya, Ahmadi, Mubarak Al-Kabeer, and Jahra. Free inspection & clear KWD prices.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/areas/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/areas/',
      'en-KW': 'https://sabbagh-kuwait.com/en/areas/',
    },
  },
};

export default function EnglishAreasIndexPage() {
  return <AreaPageEn />;
}
