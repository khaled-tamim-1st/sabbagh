import React from 'react';
import type { Metadata } from 'next';
import RequestQuotePage from '@/views/request-quote';

export const metadata: Metadata = {
  title: 'طلب معاينة فنية مجانية للأصباغ والديكورات | صباغ الكويت',
  description:
    'اطلب موعد معاينة فنية مجانية لمنزلك أو قسيمتك في الكويت: حدد نوع الخدمة وموقعك وسيتواصل معك أمهر فني صباغ معتمد لرفع المقاسات وتقديم الاستشارة مجاناً وبدون أي التزام.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/request-quote',
  },
  openGraph: {
    title: 'طلب معاينة فنية مجانية للأصباغ والديكورات | صباغ الكويت',
    description: 'اطلب معاينة فنية مجانية لمنزلك أو قسيمتك من صباغ الكويت.',
    url: 'https://sabbagh-kuwait.com/request-quote',
    siteName: 'صباغ الكويت',
  },
};

export default function RequestQuoteRoute() {
  return <RequestQuotePage />;
}
