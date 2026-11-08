import React from 'react';
import type { Metadata } from 'next';
import BlogPage from '@/views/blog-page';

export const metadata: Metadata = {
  title: 'مدونة صباغ الكويت للأصباغ والديكورات | أفكار وحلول تشطيب المنازل',
  description:
    'دليل إرشادي شامل لكل ما يخص أصباغ وتشطيب المنازل والقسائم في الكويت في الكويت: مقارنات جوتن وهمبل، علاج الرطوبة، بديل الرخام، دهان الأبواب، وأحدث ألوان الديكور 2026.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/blog',
  },
  openGraph: {
    title: 'مدونة صباغ الكويت للأصباغ والديكورات | أفكار وحلول تشطيب المنازل',
    description: 'دليل شامل لنصائح وتشطيب المنازل والقسائم في الكويت بالدينار.',
    url: 'https://sabbagh-kuwait.com/blog',
    siteName: 'صباغ الكويت',
  },
};

export default function BlogIndexRoute() {
  return <BlogPage />;
}
