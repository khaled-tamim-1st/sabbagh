import React from 'react';
import type { Metadata } from 'next';
import { KUWAIT_GOVERNORATES, getGovernorateById, findAreaById } from '@/data/kuwait-areas';
import AreaPage from '@/views/area-page';
import { SeoSchema, generateBreadcrumbSchema } from '@/components/seo-schema';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const govParams = KUWAIT_GOVERNORATES.map((g) => ({ id: g.id }));
  const aliasParams = [{ id: 'farwaniya' }];
  const areaParams = KUWAIT_GOVERNORATES.flatMap((g) =>
    g.areas.map((a) => ({ id: a.id }))
  );
  return [...govParams, ...aliasParams, ...areaParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const gov = getGovernorateById(id);
  const areaMatch = !gov ? findAreaById(id) : null;
  const title = gov
    ? `صباغ محافظة ${gov.nameAr} | أفضل فني دهانات وديكورات - فني الكويت`
    : areaMatch
    ? `صباغ ${areaMatch.area.nameAr} | أفضل فني دهانات وديكورات - فني الكويت`
    : 'صباغ الكويت | دليل مناطق ومحافظات فني الكويت';

  const desc = gov
    ? `ابحث عن أفضل صباغ في محافظة ${gov.nameAr} (${gov.areasCount} منطقة). أسعار حقيقية بالدينار، دهانات جوتن، معاينة مجانية وواتساب مباشر من فني الكويت.`
    : areaMatch
    ? `خدمات أصباغ ودهانات وديكورات في ${areaMatch.area.nameAr} بمحافظة ${areaMatch.governorate.nameAr}. صباغين موثوقين ومحترفين من فني الكويت.`
    : 'دليل مناطق ومحافظات الكويت للأصباغ والدهانات من فني الكويت.';

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/areas/${id}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sabbagh-kuwait.com/areas/${id}`,
      siteName: 'فني الكويت | صباغ الكويت',
      type: 'website',
    },
  };
}

export default async function AreaRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gov = getGovernorateById(id);
  const areaMatch = !gov ? findAreaById(id) : null;
  const pageName = gov ? gov.nameAr : areaMatch ? areaMatch.area.nameAr : id;

  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'الرئيسية', url: 'https://sabbagh-kuwait.com' },
      { name: 'مناطق الكويت', url: 'https://sabbagh-kuwait.com/areas' },
      { name: pageName, url: `https://sabbagh-kuwait.com/areas/${id}` },
    ],
  });

  return (
    <>
      <SeoSchema schemas={[breadcrumbSchema]} />
      <AreaPage
        govId={gov ? gov.id : areaMatch?.governorate.id}
        areaId={areaMatch?.area.id}
      />
    </>
  );
}
