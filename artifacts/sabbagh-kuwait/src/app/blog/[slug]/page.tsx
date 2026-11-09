import React from 'react';
import type { Metadata } from 'next';
import { BLOG_ARTICLES, getBlogArticleBySlug } from '@/data/blog-posts';
import BlogDetailPage from '@/views/blog-detail';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug) || BLOG_ARTICLES[0];

  return {
    title: `${article.title} | صباغ الكويت`,
    description: article.excerpt.slice(0, 155),
    alternates: {
      canonical: `https://sabbaghelkuwait.online/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt.slice(0, 155),
      url: `https://sabbaghelkuwait.online/blog/${article.slug}`,
      siteName: 'صباغ الكويت',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: 'https://sabbaghelkuwait.online/logo.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function BlogDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogDetailPage slug={slug} />;
}
