import React from 'react';
import type { Metadata } from 'next';
import BlogPage from '@/views/blog-page';

export const metadata: Metadata = {
  title: 'مدونة فني الكويت للأصباغ والديكورات | أفكار وحلول تشطيب المنازل (صباغ معتمد)',
  description:
    'دليل إرشادي شامل لكل ما يخص أصباغ وتشطيب المنازل والقسائم في الكويت من فني الكويت: مقارنات جوتن وهمبل، علاج الرطوبة، بديل الرخام، دهان الأبواب، وأحدث ألوان الديكور 2026.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/blog',
  },
  openGraph: {
    title: 'مدونة فني الكويت للأصباغ والديكورات | أفكار وحلول تشطيب المنازل',
    description: 'دليل شامل لنصائح وتشطيب المنازل والقسائم في الكويت بالدينار.',
    url: 'https://sabbagh-kuwait.com/blog',
    siteName: 'فني الكويت | صباغ الكويت',
  },
};

export default function BlogIndexRoute() {
  return <BlogPage />;
}
