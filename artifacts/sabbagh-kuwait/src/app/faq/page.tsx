import React from 'react';
import type { Metadata } from 'next';
import FaqPage from '@/views/faq';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة حول أصباغ ودهانات الكويت | صباغ الكويت',
  description:
    'إجابات شاملة لأسئلة أهالي الكويت: أسعار صبغ الغرف والشقق، مدة التنفيذ، الفرق بين جوتن وهمبل، ضمان العمل، وكيفية حساب الأمتار والمعاينة المجانية.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/faq',
  },
};

export default function FaqRoute() {
  return <FaqPage />;
}
