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

  return {
    title: `${service.title} في الكويت | فني الكويت (صباغ معتمد)`,
    description: `${service.tagline || service.description} - خدمات معتمدة من فني الكويت بأسعار تبدأ من ${service.price.fromKWD} د.ك مع معاينة مجانية وواتساب مباشر.`,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} في الكويت | فني الكويت`,
      description: service.tagline || service.description,
      url: `https://sabbagh-kuwait.com/services/${service.slug}`,
      siteName: 'فني الكويت | صباغ الكويت',
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
