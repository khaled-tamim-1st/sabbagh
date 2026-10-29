import React from 'react';
import type { Metadata } from 'next';
import { KUWAIT_GOVERNORATES, getGovernorateById, findAreaById } from '@/data/kuwait-areas';
import AreaPage from '@/views/area-page';
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
  const govName = gov ? gov.nameAr : id;
  const areaName = areaMatch ? areaMatch.nameAr : areaId;

  const title = `صباغ ${areaName} | أفضل فني دهانات وديكورات في ${govName} - فني الكويت`;
  const desc = `خدمات أصباغ ودهانات وتشطيبات في ${areaName} بمحافظة ${govName}. أمهر الصباغين المعتمدين، دهانات جوتن الأصلية، بديل الرخام، معاينة مجانية وواتساب مباشر.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/areas/${id}/${areaId}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sabbagh-kuwait.com/areas/${id}/${areaId}`,
      siteName: 'فني الكويت | صباغ الكويت',
      type: 'website',
    },
  };
}

export default async function AreaDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string; areaId: string }>;
}) {
  const { id, areaId } = await params;
  const gov = getGovernorateById(id);
  const areaMatch = gov?.areas.find((a) => a.id === areaId) || findAreaById(areaId)?.area;
  const govName = gov ? gov.nameAr : id;
  const areaName = areaMatch ? areaMatch.nameAr : areaId;

  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'الرئيسية', url: 'https://sabbagh-kuwait.com' },
      { name: 'مناطق الكويت', url: 'https://sabbagh-kuwait.com/areas' },
      { name: govName, url: `https://sabbagh-kuwait.com/areas/${id}` },
      { name: areaName, url: `https://sabbagh-kuwait.com/areas/${id}/${areaId}` },
    ],
  });

  return (
    <>
      <SeoSchema schemas={[breadcrumbSchema]} />
      <AreaPage govId={id} areaId={areaId} />
    </>
  );
}
