import React from 'react';
import type { Metadata } from 'next';
import { KUWAIT_GOVERNORATES, getGovernorateById } from '@/data/kuwait-areas';
import AreaPageEn from '@/views/area-page-en';
import { SeoSchema, generateBreadcrumbSchema } from '@/components/seo-schema';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return KUWAIT_GOVERNORATES.map((g) => ({
    id: g.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const gov = getGovernorateById(id);
  const title = gov
    ? `Painters in ${gov.nameEn} Kuwait | Top Certified House & Flat Painters`
    : 'Kuwait Painting Services by Area';
  const desc = gov
    ? `Find certified painters in ${gov.nameEn} serving ${gov.areasCount} districts. Authentic Jotun paints, transparent KWD pricing, and free on-site inspections.`
    : 'Certified painting services across all Kuwait governorates.';

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/en/areas/${id}/`,
      languages: {
        'ar-KW': `https://sabbagh-kuwait.com/areas/${id}/`,
        'en-KW': `https://sabbagh-kuwait.com/en/areas/${id}/`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sabbagh-kuwait.com/en/areas/${id}/`,
      siteName: 'Fani Kuwait | Kuwait Painters',
    },
  };
}

export default async function EnglishAreaRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gov = getGovernorateById(id);
  const govName = gov ? gov.nameEn : id;

  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'Home', url: 'https://sabbagh-kuwait.com/en/' },
      { name: 'Kuwait Areas', url: 'https://sabbagh-kuwait.com/en/areas/' },
      { name: govName, url: `https://sabbagh-kuwait.com/en/areas/${id}/` },
    ],
  });

  return (
    <>
      <SeoSchema schemas={[breadcrumbSchema]} />
      <AreaPageEn govId={id} />
    </>
  );
}
