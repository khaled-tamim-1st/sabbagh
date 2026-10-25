import React from 'react';
import type { Metadata } from 'next';
import RequestQuotePage from '@/views/request-quote';

export const metadata: Metadata = {
  title: 'حاسبة تكلفة الصبغ وطلب معاينة مجانية | صباغ الكويت',
  description:
    'احسب تكلفة صبغ شقتك أو فيلتك بالدينار الكويتي فوراً: حدد عدد الغرف، نوع الصبغ (جوتن فينوماستيك، كابارول)، واطلب موعد معاينة مجاني مع صباغين معتمدين في منطقتك.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/request-quote',
  },
};

export default function RequestQuoteRoute() {
  return <RequestQuotePage />;
}
