import React from 'react';
import type { Metadata } from 'next';
import JoinPainterPageEn from '@/views/join-painter-en';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Join as a Certified Painter in Kuwait | Fani Kuwait Directory',
  description:
    'Register your painting and decor company or individual workshop on Fani Kuwait. Direct customer quotations across all 6 Kuwait governorates with zero intermediary commission fees.',
  keywords: [
    'join painter kuwait',
    'painter registration kuwait',
    'decor workshop onboarding kuwait',
    'fani kuwait technicians',
  ],
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/join-painter/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/join-painter/',
      'en-KW': 'https://sabbagh-kuwait.com/en/join-painter/',
    },
  },
};

export default function EnJoinPainterPage() {
  return <JoinPainterPageEn />;
}
