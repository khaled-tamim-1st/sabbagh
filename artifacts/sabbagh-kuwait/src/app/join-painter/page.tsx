import React from 'react';
import type { Metadata } from 'next';
import JoinPainterPage from '@/views/join-painter';

export const metadata: Metadata = {
  title: 'انضم كصباغ معتمد في الكويت | صباغ الكويت',
  description:
    'سجل ورشتك كصباغ معتمد في الكويت: استقبل طلبات المعاينات المباشرة في منطقتك، اعرض سابقة أعمالك، وتواصل مع العملاء عبر واتساب والاتصال مباشرة.'.slice(0, 155),
  alternates: {
    canonical: 'https://sabbaghelkuwait.online/join-painter',
  },
  openGraph: {
    title: 'انضم كصباغ معتمد في الكويت | صباغ الكويت',
    description: 'انضم لشبكة فنيي وصباغي الكويت واستقبل طلبات معاينة مباشرة.',
    url: 'https://sabbaghelkuwait.online/join-painter',
    siteName: 'صباغ الكويت',
    type: 'website',
    images: [
      {
        url: 'https://sabbaghelkuwait.online/logo.png',
        width: 1200,
        height: 630,
        alt: 'انضم كصباغ معتمد',
      },
    ],
  },
};

export default function JoinPainterRoute() {
  return <JoinPainterPage />;
}
