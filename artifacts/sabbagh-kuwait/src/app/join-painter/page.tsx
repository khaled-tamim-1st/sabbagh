import React from 'react';
import type { Metadata } from 'next';
import JoinPainterPage from '@/views/join-painter';

export const metadata: Metadata = {
  title: 'انضم كفني وصباغ معتمد في الكويت | منصة فني الكويت (صباغ الكويت)',
  description:
    'سجل ورشتك أو خدماتك كصباغ وفني معتمد في الكويت: استقبل طلبات المعاينات المباشرة في منطقتك، اعرض سابقة أعمالك، وتواصل مع العملاء عبر واتساب والاتصال الهاتفي مباشرة.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/join-painter',
  },
  openGraph: {
    title: 'انضم كفني وصباغ معتمد في الكويت | منصة فني الكويت',
    description: 'انضم لشبكة فنيي وصباغي الكويت واستقبل طلبات معاينة مباشرة.',
    url: 'https://sabbagh-kuwait.com/join-painter',
    siteName: 'فني الكويت | صباغ الكويت',
  },
};

export default function JoinPainterRoute() {
  return <JoinPainterPage />;
}
