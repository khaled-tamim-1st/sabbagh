import React from 'react';
import type { Metadata } from 'next';
import { PAINTERS_DATA, getPainterById, generatePainterSlug } from '@/data/painters';
import PainterProfilePageEn from '@/views/painter-profile-en';

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
    params.push({ slug: p.id.toString() });
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
  const painter = getPainterById(decoded) || PAINTERS_DATA[0];
  const targetSlug = painter.slug || generatePainterSlug(painter.accountType === 'company' && painter.companyName ? painter.companyName : painter.name, painter.id);

  return {
    title: `${painter.name} | Verified Painter in ${painter.region || 'Kuwait'} - Fani Kuwait`,
    description: `Connect directly with ${painter.name}. Verified house painter and decorator covering ${painter.region || 'Kuwait'}. Authentic Jotun paints, free on-site quote, and direct WhatsApp contact.`,
    alternates: {
      canonical: `https://sabbagh-kuwait.com/en/painters/${encodeURIComponent(targetSlug)}/`,
      languages: {
        'ar-KW': `https://sabbagh-kuwait.com/painters/${encodeURIComponent(targetSlug)}/`,
        'en-KW': `https://sabbagh-kuwait.com/en/painters/${encodeURIComponent(targetSlug)}/`,
      },
    },
    openGraph: {
      title: `${painter.name} | Certified Painter in Kuwait`,
      description: `Verified painting technician in ${painter.region || 'Kuwait'}.`,
      url: `https://sabbagh-kuwait.com/en/painters/${encodeURIComponent(targetSlug)}/`,
      siteName: 'Fani Kuwait | Kuwait Painters',
      locale: 'en_KW',
      type: 'profile',
    },
  };
}

export default async function EnPainterDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PainterProfilePageEn id={slug} />;
}
