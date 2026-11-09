import React from 'react';
import type { Metadata } from 'next';
import BlogPage from '@/views/blog-page';

export const metadata: Metadata = {
  title: 'مدونة صباغ الكويت | نصائح وأسعار التشطيب 2026',
  description:
    'دليل شامل لكل ما يخص أصباغ وتشطيب المنازل والقسائم في الكويت: مقارنات جوتن وهمبل، علاج الرطوبة، بديل الرخام، دهان الأبواب، وأحدث ألوان الديكور.'.slice(0, 155),
  alternates: {
    canonical: 'https://sabbaghelkuwait.online/blog',
  },
  openGraph: {
    title: 'مدونة صباغ الكويت | نصائح وأسعار التشطيب 2026',
    description: 'دليل شامل لنصائح وتشطيب المنازل والقسائم في الكويت بالدينار.',
    url: 'https://sabbaghelkuwait.online/blog',
    siteName: 'صباغ الكويت',
    type: 'website',
    images: [
      {
        url: 'https://sabbaghelkuwait.online/logo.png',
        width: 1200,
        height: 630,
        alt: 'مدونة صباغ الكويت',
      },
    ],
  },
};

export default function BlogIndexRoute() {
  return <BlogPage />;
}
