import React from 'react';
import type { Metadata } from 'next';
import ServicesCatalogEn from '@/views/services-catalog-en';

export const metadata: Metadata = {
  title: 'Painting & Decorating Services in Kuwait | Full Directory - Fani Kuwait',
  description:
    'Browse the complete guide to painting and decorating services in Kuwait: interior wall painting, Italian stucco, wallpaper, PVC marble cladding, exterior sigma, and epoxy flooring.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/services/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/services/',
      'en-KW': 'https://sabbagh-kuwait.com/en/services/',
    },
  },
};

export default function EnglishServicesIndex() {
  return <ServicesCatalogEn />;
}
