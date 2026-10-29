import React from 'react';
import type { Metadata } from 'next';
import RequestQuoteEn from '@/views/request-quote-en';

export const metadata: Metadata = {
  title: 'Calculate House & Apartment Painting Cost in Kuwait | Free Quote - Fani Kuwait',
  description:
    'Calculate your interior or exterior painting cost in Kuwaiti Dinar (KWD) instantly. Select rooms, property type, and genuine Jotun paint materials. Free on-site inspection.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/request-quote/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/request-quote/',
      'en-KW': 'https://sabbagh-kuwait.com/en/request-quote/',
    },
  },
};

export default function EnglishRequestQuotePage() {
  return <RequestQuoteEn />;
}
