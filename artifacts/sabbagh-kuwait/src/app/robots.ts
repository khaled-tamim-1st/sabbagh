import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/painter', '/api'],
      },
      // تمكين وترحيب عناكب محركات البحث التوليدي والذكاء الاصطناعي (GEO & AEO)
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
        ],
        allow: [
          '/',
          '/services/',
          '/services/*',
          '/areas/',
          '/areas/*',
          '/painters/',
          '/painters/*',
          '/blog/',
          '/blog/*',
          '/faq/',
          '/services-guide/',
        ],
        disallow: ['/admin', '/painter', '/api'],
      },
    ],
    sitemap: 'https://sabbagh-kuwait.com/sitemap.xml',
  };
}
