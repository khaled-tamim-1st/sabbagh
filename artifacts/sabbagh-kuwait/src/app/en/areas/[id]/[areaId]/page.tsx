import React from 'react';
import type { Metadata } from 'next';
import { KUWAIT_GOVERNORATES, getGovernorateById, findAreaById } from '@/data/kuwait-areas';
import AreaPageEn from '@/views/area-page-en';
import { SeoSchema, generateBreadcrumbSchema } from '@/components/seo-schema';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return KUWAIT_GOVERNORATES.flatMap((g) =>
    g.areas.map((a) => ({
      id: g.id,
      areaId: a.id,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; areaId: string }>;
}): Promise<Metadata> {
  const { id, areaId } = await params;
  const gov = getGovernorateById(id);
  const areaMatch = gov?.areas.find((a) => a.id === areaId) || findAreaById(areaId)?.area;
  const govName = gov ? gov.nameEn : id;
  const areaName = areaMatch ? areaMatch.nameEn : areaId;

  const title = `Painters in ${areaName}, ${govName} | Kuwait House Painting Services`;
  const desc = `Certified house, villa, and apartment painting services in ${areaName} (${govName} Governorate). Authentic Jotun paints, free estimates, fast WhatsApp inquiry.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/en/areas/${id}/${areaId}/`,
      languages: {
        'ar-KW': `https://sabbagh-kuwait.com/areas/${id}/${areaId}/`,
        'en-KW': `https://sabbagh-kuwait.com/en/areas/${id}/${areaId}/`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sabbagh-kuwait.com/en/areas/${id}/${areaId}/`,
      siteName: 'Fani Kuwait | Kuwait Painters',
    },
  };
}

export default async function EnglishAreaDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string; areaId: string }>;
}) {
  const { id, areaId } = await params;
  const gov = getGovernorateById(id);
  const areaMatch = gov?.areas.find((a) => a.id === areaId) || findAreaById(areaId)?.area;
  const govName = gov ? gov.nameEn : id;
  const areaName = areaMatch ? areaMatch.nameEn : areaId;

  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'Home', url: 'https://sabbagh-kuwait.com/en/' },
      { name: 'Kuwait Areas', url: 'https://sabbagh-kuwait.com/en/areas/' },
      { name: govName, url: `https://sabbagh-kuwait.com/en/areas/${id}/` },
      { name: areaName, url: `https://sabbagh-kuwait.com/en/areas/${id}/${areaId}/` },
    ],
  });

  return (
    <>
      <SeoSchema schemas={[breadcrumbSchema]} />
      <AreaPageEn govId={id} />
    </>
  );
}
