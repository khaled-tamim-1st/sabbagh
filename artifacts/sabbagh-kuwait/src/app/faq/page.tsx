import React from 'react';
import type { Metadata } from 'next';
import FaqPage from '@/views/faq';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة حول أصباغ ودهانات الكويت | صباغ الكويت',
  description:
    'إجابات دقيقة وموثقة من خبراء صباغ الكويت: أسعار صبغ الغرف والشقق بالدينار، مدة التنفيذ، الفرق بين جوتن وهمبل، ضمان العمل، وكيفية حجز المعاينة المجانية.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/faq',
  },
  openGraph: {
    title: 'الأسئلة الشائعة حول أصباغ ودهانات الكويت | صباغ الكويت',
    description: 'إجابات شاملة لأسئلة أهالي الكويت حول أسعار وخامات الأصباغ.',
    url: 'https://sabbagh-kuwait.com/faq',
    siteName: 'صباغ الكويت',
  },
};

export default function FaqRoute() {
  return <FaqPage />;
}
