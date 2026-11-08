import React from 'react';
import type { Metadata } from 'next';
import RequestQuotePage from '@/views/request-quote';

export const metadata: Metadata = {
  title: 'طلب مقايسة وعرض سعر مجاني للأصباغ | صباغ الكويت',
  description:
    'احسب تكلفة صبغ شقتك أو فيلتك بالدينار الكويتي فوراً: حدد نوع الخدمة واطلب موعد معاينة مجاني مع أمهر الصباغين والفنيين المعتمدين في منطقتك من صباغ الكويت.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/request-quote',
  },
  openGraph: {
    title: 'طلب مقايسة وعرض سعر مجاني للأصباغ | صباغ الكويت',
    description: 'احسب تكلفة صبغ منزلك واطلب معاينة مجانية من صباغ الكويت.',
    url: 'https://sabbagh-kuwait.com/request-quote',
    siteName: 'صباغ الكويت',
  },
};

export default function RequestQuoteRoute() {
  return <RequestQuotePage />;
}
