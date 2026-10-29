import React from 'react';
import type { Metadata } from 'next';
import BlogPageEn from '@/views/blog-page-en';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Kuwait Painting & Decor Knowledge Hub | Cost Guides 2026 - Fani Kuwait',
  description:
    'Comprehensive guides to house, apartment, and villa painting in Kuwait: prices in KWD, genuine Jotun Fenomastic paint specs, exterior Sigma facades, moisture repair, and expat move-out tips.',
  keywords: [
    'painting cost kuwait',
    'how much to paint room kuwait',
    'apartment painting price salmiya',
    'jotun paint price kuwait',
    'sigma coating cost kuwait',
    'wall dampness repair kuwait',
    'move out repaint kuwait',
    'english speaking painter kuwait',
  ],
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/blog/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/blog/',
      'en-KW': 'https://sabbagh-kuwait.com/en/blog/',
    },
  },
  openGraph: {
    title: 'Kuwait Painting & Decor Knowledge Hub | Cost Guides 2026 - Fani Kuwait',
    description:
      'Verified cost guides and technical specifications for house painting and wall finishes across all Kuwait governorates.',
    url: 'https://sabbagh-kuwait.com/en/blog/',
    siteName: 'Fani Kuwait | Kuwait Painters',
    locale: 'en_KW',
    type: 'website',
  },
};

export default function EnBlogPage() {
  return <BlogPageEn />;
}
