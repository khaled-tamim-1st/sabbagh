import React from 'react';
import type { Metadata } from 'next';
import { KUWAIT_SERVICES_DATA_EN, getServiceBySlugEn } from '@/data/services-data-en';
import ServiceDetailEnPage from '@/views/service-detail-en';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return KUWAIT_SERVICES_DATA_EN.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlugEn(slug) || KUWAIT_SERVICES_DATA_EN[0];

  return {
    title: `${service.title} in Kuwait | Certified Painters - Fani Kuwait`,
    description: `${service.tagline} - Certified painting services in Kuwait starting from ${service.price.fromKWD} KWD with free on-site inspection & direct WhatsApp coordination.`,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/en/services/${service.slug}/`,
      languages: {
        'ar-KW': `https://sabbagh-kuwait.com/services/${service.slug}/`,
        'en-KW': `https://sabbagh-kuwait.com/en/services/${service.slug}/`,
      },
    },
    openGraph: {
      title: `${service.title} in Kuwait | Fani Kuwait`,
      description: service.tagline,
      url: `https://sabbagh-kuwait.com/en/services/${service.slug}/`,
      siteName: 'Fani Kuwait | Kuwait Painters',
    },
  };
}

export default async function EnglishServiceRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceDetailEnPage slug={slug} />;
}
