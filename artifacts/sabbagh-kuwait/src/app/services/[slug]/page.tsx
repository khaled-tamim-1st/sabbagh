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
    title: `${service.title} في الكويت | الأسعار والمواصفات`,
    description: service.tagline || service.description,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} - صباغ الكويت`,
      description: service.tagline || service.description,
      url: `https://sabbagh-kuwait.com/services/${service.slug}`,
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
