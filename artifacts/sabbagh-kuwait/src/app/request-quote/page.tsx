import React from 'react';
import type { Metadata } from 'next';
import RequestQuotePage from '@/views/request-quote';

export const metadata: Metadata = {
  title: 'طلب معاينة فنية مجانية | صباغ الكويت',
  description:
    'اطلب معاينة فنية مجانية لمنزلك أو قسيمتك بالكويت: حدد الخدمة وموقعك وسيتواصل معك فني صباغ معتمد لرفع المقاسات والاستشارة مجاناً بدون التزام.'.slice(0, 155),
  alternates: {
    canonical: 'https://sabbaghelkuwait.online/request-quote',
  },
  openGraph: {
    title: 'طلب معاينة فنية مجانية | صباغ الكويت',
    description: 'اطلب معاينة فنية مجانية لمنزلك أو قسيمتك من صباغ الكويت.',
    url: 'https://sabbaghelkuwait.online/request-quote',
    siteName: 'صباغ الكويت',
    type: 'website',
    images: [
      {
        url: 'https://sabbaghelkuwait.online/logo.png',
        width: 1200,
        height: 630,
        alt: 'طلب معاينة فنية مجانية',
      },
    ],
  },
};

export default function RequestQuoteRoute() {
  return <RequestQuotePage />;
}
