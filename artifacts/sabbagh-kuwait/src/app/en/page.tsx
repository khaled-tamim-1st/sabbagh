import React from 'react';
import type { Metadata } from 'next';
import { HomeViewEn } from '@/components/home-view-en';
import {
  SeoSchema,
  generatePlatformSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
} from '@/components/seo-schema';

export const metadata: Metadata = {
  title: 'Painting Services Kuwait | Top Certified House & Flat Painters - Fani Kuwait',
  description:
    'Find and connect directly with vetted house painters and decor technicians in Kuwait. Transparent KWD prices, authentic Jotun paints, free on-site inspection & instant WhatsApp support.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/',
      'en-KW': 'https://sabbagh-kuwait.com/en/',
    },
  },
};

export default function EnglishHomePage() {
  const platformSchema = generatePlatformSchema();
  const faqSchema = generateFaqSchema({
    items: [
      {
        question: 'How much does it cost to paint a room in Kuwait in KWD?',
        answer:
          'Painting a standard 4x4 room in Kuwait ranges from 18 to 35 KWD for labor with putty prep, and 30 to 50 KWD including genuine Jotun Fenomastic Pure paint and materials.',
      },
      {
        question: 'Can you provide English-speaking painters or coordinators in Kuwait?',
        answer:
          'Yes, Fani Kuwait connects expats and property owners with verified technicians and coordinators who speak fluent English and communicate via WhatsApp.',
      },
      {
        question: 'Which paint brand is best for Kuwait hot weather and humidity?',
        answer:
          'Jotun Fenomastic Pure Colours (Eggshell/Matt) is the top choice for interior walls, and Jotun Jotashield Extreme or Caparol for exterior facades to resist 50°C summer heat and coastal humidity.',
      },
      {
        question: 'Do you offer free on-site inspections in Kuwait?',
        answer:
          'Yes, all verified painters on the platform provide 100% free on-site inspections for flats, villas, and commercial properties with no prior obligation.',
      },
    ],
  });

  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'Home', url: 'https://sabbagh-kuwait.com/en/' },
    ],
  });

  return (
    <>
      <SeoSchema schemas={[platformSchema, faqSchema, breadcrumbSchema]} />
      <HomeViewEn />
    </>
  );
}
