import type { MetadataRoute } from 'next';
import { PAINTERS_DATA, generatePainterSlug } from '@/data/painters';
import { KUWAIT_GOVERNORATES } from '@/data/kuwait-areas';
import { KUWAIT_SERVICES_DATA } from '@/data/services-data';
import { KUWAIT_SERVICES_DATA_EN } from '@/data/services-data-en';
import { BLOG_ARTICLES } from '@/data/blog-posts';
import { BLOG_ARTICLES_EN } from '@/data/blog-posts-en';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sabbagh-kuwait.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/areas/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/request-quote/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services-guide/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/join-painter/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const staticRoutesEn: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en/services/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/en/areas/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/request-quote/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/services-guide/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/en/faq/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/join-painter/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/login/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const blogRoutesEn: MetadataRoute.Sitemap = BLOG_ARTICLES_EN.map((b) => ({
    url: `${baseUrl}/en/blog/${b.slug}/`,
    lastModified: new Date(b.publishedAt || now),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const painterRoutesEn: MetadataRoute.Sitemap = PAINTERS_DATA.map((p) => {
    const slug = p.slug || generatePainterSlug(p.accountType === 'company' && p.companyName ? p.companyName : p.name, p.id);
    return {
      url: `${baseUrl}/en/painters/${encodeURIComponent(slug)}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    };
  });

  const painterRoutes: MetadataRoute.Sitemap = PAINTERS_DATA.map((p) => {
    const slug = p.slug || generatePainterSlug(p.accountType === 'company' && p.companyName ? p.companyName : p.name, p.id);
    return {
      url: `${baseUrl}/painters/${encodeURIComponent(slug)}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    };
  });

  const governorateRoutes: MetadataRoute.Sitemap = KUWAIT_GOVERNORATES.map((g) => ({
    url: `${baseUrl}/areas/${g.id}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const governorateRoutesEn: MetadataRoute.Sitemap = KUWAIT_GOVERNORATES.map((g) => ({
    url: `${baseUrl}/en/areas/${g.id}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const areaRoutes: MetadataRoute.Sitemap = KUWAIT_GOVERNORATES.flatMap((g) =>
    g.areas.map((a) => ({
      url: `${baseUrl}/areas/${a.id}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.80,
    }))
  );

  const serviceRoutes: MetadataRoute.Sitemap = KUWAIT_SERVICES_DATA.map((s) => ({
    url: `${baseUrl}/services/${s.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.90,
  }));

  const serviceRoutesEn: MetadataRoute.Sitemap = KUWAIT_SERVICES_DATA_EN.map((s) => ({
    url: `${baseUrl}/en/services/${s.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.90,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_ARTICLES.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}/`,
    lastModified: new Date(b.publishedAt || now),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    ...staticRoutes,
    ...staticRoutesEn,
    ...governorateRoutes,
    ...governorateRoutesEn,
    ...areaRoutes,
    ...serviceRoutes,
    ...serviceRoutesEn,
    ...blogRoutes,
    ...blogRoutesEn,
    ...painterRoutes,
    ...painterRoutesEn,
  ];
}
