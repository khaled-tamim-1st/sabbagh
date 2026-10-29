import React from 'react';
import type { Metadata } from 'next';
import { BLOG_ARTICLES_EN, getBlogArticleBySlugEn } from '@/data/blog-posts-en';
import BlogDetailPageEn from '@/views/blog-detail-en';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return BLOG_ARTICLES_EN.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticleBySlugEn(slug) || BLOG_ARTICLES_EN[0];

  return {
    title: `${article.title} - Fani Kuwait`,
    description: article.excerpt,
    keywords: article.tags,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/en/blog/${article.slug}/`,
      languages: {
        'ar-KW': `https://sabbagh-kuwait.com/blog/${article.slug}/`,
        'en-KW': `https://sabbagh-kuwait.com/en/blog/${article.slug}/`,
      },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://sabbagh-kuwait.com/en/blog/${article.slug}/`,
      siteName: 'Fani Kuwait | Kuwait Painters',
      locale: 'en_KW',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  };
}

export default async function EnBlogDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogDetailPageEn slug={slug} />;
}
