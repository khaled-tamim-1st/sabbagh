import React from 'react';
import type { Metadata } from 'next';
import { BLOG_ARTICLES, getBlogArticleBySlug } from '@/data/blog-posts';
import BlogDetailPage from '@/views/blog-detail';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return BLOG_ARTICLES.slice(0, 30).map((a) => ({
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
    title: `${article.title} | فني الكويت (صباغ معتمد)`,
    description: article.excerpt,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://sabbagh-kuwait.com/blog/${article.slug}`,
      siteName: 'فني الكويت | صباغ الكويت',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
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
