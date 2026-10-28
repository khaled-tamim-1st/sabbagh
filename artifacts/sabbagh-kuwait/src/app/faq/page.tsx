import React from 'react';
import type { Metadata } from 'next';
import FaqPage from '@/views/faq';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة حول أصباغ ودهانات الكويت | فني الكويت (صباغ معتمد)',
  description:
    'إجابات دقيقة وموثقة من خبراء فني الكويت: أسعار صبغ الغرف والشقق بالدينار، مدة التنفيذ، الفرق بين جوتن وهمبل، ضمان العمل، وكيفية حجز المعاينة المجانية.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/faq',
  },
  openGraph: {
    title: 'الأسئلة الشائعة حول أصباغ ودهانات الكويت | فني الكويت',
    description: 'إجابات شاملة لأسئلة أهالي الكويت حول أسعار وخامات الأصباغ.',
    url: 'https://sabbagh-kuwait.com/faq',
    siteName: 'فني الكويت | صباغ الكويت',
  },
};

export default function FaqRoute() {
  return <FaqPage />;
}
