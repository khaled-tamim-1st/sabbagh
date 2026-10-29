import React from 'react';
import type { Metadata } from 'next';
import FaqEnPage from '@/views/faq-en';

export const metadata: Metadata = {
  title: 'Kuwait Painting FAQ & Warranty Guide | Fani Kuwait',
  description:
    'Answers to top questions regarding painting costs in KWD, genuine Jotun & Caparol paints, move-out apartment handover, warranty, and free inspections in Kuwait.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/faq/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/faq/',
      'en-KW': 'https://sabbagh-kuwait.com/en/faq/',
    },
  },
};

export default function EnglishFaqRoute() {
  return <FaqEnPage />;
}
