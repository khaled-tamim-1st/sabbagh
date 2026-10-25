import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/painter', '/api'],
    },
    sitemap: 'https://sabbagh-kuwait.com/sitemap.xml',
  };
}
