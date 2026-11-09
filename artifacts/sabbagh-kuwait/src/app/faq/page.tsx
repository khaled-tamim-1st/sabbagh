import React from 'react';
import type { Metadata } from 'next';
import FaqPage from '@/views/faq';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة عن الأصباغ | صباغ الكويت',
  description:
    'إجابات دقيقة من خبراء صباغ الكويت: أسعار صبغ الغرف والشقق، مدة التنفيذ، الفرق بين جوتن وهمبل، كفالة العمل، وحجز المعاينة المجانية.'.slice(0, 155),
  alternates: {
    canonical: 'https://sabbaghelkuwait.online/faq',
  },
  openGraph: {
    title: 'الأسئلة الشائعة عن الأصباغ | صباغ الكويت',
    description: 'إجابات شاملة لأسئلة أهالي الكويت حول أسعار وخامات الأصباغ.',
    url: 'https://sabbaghelkuwait.online/faq',
    siteName: 'صباغ الكويت',
    type: 'website',
    images: [
      {
        url: 'https://sabbaghelkuwait.online/logo.png',
        width: 1200,
        height: 630,
        alt: 'الأسئلة الشائعة - صباغ الكويت',
      },
    ],
  },
};

export default function FaqRoute() {
  return <FaqPage />;
}
