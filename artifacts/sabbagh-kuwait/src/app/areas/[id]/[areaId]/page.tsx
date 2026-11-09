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

  const title = `صباغ ${areaName} | فني دهانات ${govName} - صباغ الكويت`;
  const desc = `خدمات أصباغ وتشطيبات في ${areaName} بمحافظة ${govName}. أمهر صباغي جوتن وبديل الرخام، معاينة مجانية وواتساب مباشر من صباغ الكويت.`.slice(0, 155);

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sabbaghelkuwait.online/areas/${id}/${areaId}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sabbaghelkuwait.online/areas/${id}/${areaId}`,
      siteName: 'صباغ الكويت',
      type: 'website',
      images: [
        {
          url: 'https://sabbaghelkuwait.online/logo.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
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
      { name: 'الرئيسية', url: 'https://sabbaghelkuwait.online' },
      { name: 'مناطق الكويت', url: 'https://sabbaghelkuwait.online/areas' },
      { name: govName, url: `https://sabbaghelkuwait.online/areas/${id}` },
      { name: areaName, url: `https://sabbaghelkuwait.online/areas/${id}/${areaId}` },
    ],
  });

  return (
    <>
      <SeoSchema schemas={[breadcrumbSchema]} />
      <AreaPage govId={id} areaId={areaId} />
    </>
  );
}
