import React from 'react';
import type { Metadata } from 'next';
import { KUWAIT_SERVICES_DATA, getServiceBySlug } from '@/data/services-data';
import ServiceDetailPage from '@/views/service-detail';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return KUWAIT_SERVICES_DATA.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug) || KUWAIT_SERVICES_DATA[0];

  const desc = `${service.tagline || service.description} - خدمات معتمدة من صباغ الكويت بأسعار تبدأ من ${service.price.fromKWD} د.ك مع معاينة مجانية وواتساب مباشر.`.slice(0, 155);

  return {
    title: `${service.title} في الكويت | صباغ الكويت`,
    description: desc,
    alternates: {
      canonical: `https://sabbaghelkuwait.online/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} في الكويت | صباغ الكويت`,
      description: (service.tagline || service.description).slice(0, 155),
      url: `https://sabbaghelkuwait.online/services/${service.slug}`,
      siteName: 'صباغ الكويت',
      type: 'website',
      images: [
        {
          url: 'https://sabbaghelkuwait.online/logo.png',
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
  };
}

export default async function ServiceRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceDetailPage slug={slug} />;
}
