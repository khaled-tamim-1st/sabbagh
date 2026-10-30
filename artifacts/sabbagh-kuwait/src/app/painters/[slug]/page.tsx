import React from 'react';
import type { Metadata } from 'next';
import { PAINTERS_DATA, getPainterById, generatePainterSlug } from '@/data/painters';
import PainterProfilePage from '@/views/painter-profile';
import {
  SeoSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from '@/components/seo-schema';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const p of PAINTERS_DATA) {
    const slug = p.slug || generatePainterSlug(p.accountType === 'company' && p.companyName ? p.companyName : p.name, p.id);
    const decodedSlug = decodeURIComponent(slug);
    const encodedSlug = encodeURIComponent(decodedSlug);
    params.push({ slug: decodedSlug });
    if (encodedSlug !== decodedSlug) {
      params.push({ slug: encodedSlug });
    }
    // Also include numeric ID for backward compatibility
    params.push({ slug: p.id.toString() });
  }

  // Next.js static export requires at least one route parameter
  if (params.length === 0) {
    params.push({ slug: 'preview' });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const painter = getPainterById(decoded);

  if (!painter) {
    return {
      title: 'صباغ في الكويت | دليل صباغ الكويت',
      description: 'دليل صباغين وفنيي دهان معتمدين في كافة مناطق الكويت.',
    };
  }

  const targetSlug = painter.slug || generatePainterSlug(painter.accountType === 'company' && painter.companyName ? painter.companyName : painter.name, painter.id);

  return {
    title: `${painter.name} | صباغ معتمد في ${painter.region} - فني الكويت`,
    description: `تواصل مع ${painter.name} - صباغ وفني معتمد بخبرة ${painter.years} سنوات في ${painter.governorates.join('، ')}. تقييم ${painter.rating} نجمة، معاينة مجانية وواتساب مباشر: ${painter.phone}`,
    keywords: [
      painter.name,
      `صباغ ${painter.region}`,
      ...painter.services,
      ...painter.governorates.map((g) => `صباغ ${g}`),
    ],
    openGraph: {
      title: `${painter.name} - صباغ وفني معتمد في الكويت`,
      description: `خبرة ${painter.years} سنوات، تقييم ${painter.rating}/5. تواصل واتساب فوري: ${painter.phone}`,
      url: `https://sabbagh-kuwait.com/painters/${encodeURIComponent(targetSlug)}`,
      siteName: 'فني الكويت | صباغ الكويت',
      type: 'profile',
      images: [
        {
          url: painter.avatarUrl || '/logo.png',
          alt: painter.name,
        },
      ],
    },
    alternates: {
      canonical: `https://sabbagh-kuwait.com/painters/${encodeURIComponent(targetSlug)}`,
    },
  };
}

export default async function PainterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const painter = getPainterById(decoded);

  if (!painter) {
    return <PainterProfilePage id={decoded} />;
  }

  const targetSlug = painter.slug || generatePainterSlug(painter.accountType === 'company' && painter.companyName ? painter.companyName : painter.name, painter.id);

  const businessSchema = generateLocalBusinessSchema({
    name: painter.name,
    description: painter.description,
    telephone: painter.phone,
    whatsapp: painter.whatsapp,
    addressLocality: painter.region,
    ratingValue: painter.rating,
    reviewCount: painter.reviews,
    services: painter.services,
    url: `https://sabbagh-kuwait.com/painters/${encodeURIComponent(targetSlug)}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'الرئيسية', url: 'https://sabbagh-kuwait.com' },
      { name: 'دليل الصباغين', url: 'https://sabbagh-kuwait.com/#directory' },
      { name: painter.name, url: `https://sabbagh-kuwait.com/painters/${encodeURIComponent(targetSlug)}` },
    ],
  });

  return (
    <>
      <SeoSchema schemas={[businessSchema, breadcrumbSchema]} />
      <PainterProfilePage id={decoded} />
    </>
  );
}
