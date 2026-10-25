import React from 'react';
import type { Metadata } from 'next';
import BlogPage from '@/views/blog-page';

export const metadata: Metadata = {
  title: 'مدونة ودليل أصباغ الكويت | نصائح وتشطيب قسائم ومقارنات 2026',
  description:
    'دليل إرشادي شامل لكل ما يخص أصباغ وتشطيب المنازل والقسائم في الكويت: مقارنات جوتن وهمبل، علاج الرطوبة، بديل الرخام، دهان الأبواب، وأحدث ألوان الديكور 2026.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/blog',
  },
};

export default function BlogIndexRoute() {
  return <BlogPage />;
}
