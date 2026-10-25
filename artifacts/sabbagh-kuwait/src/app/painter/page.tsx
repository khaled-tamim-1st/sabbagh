import React from 'react';
import type { Metadata } from 'next';
import PainterDashboardPage from '@/views/painter-dashboard';

export const metadata: Metadata = {
  title: 'لوحة تحكم الصباغ الميداني | صباغ الكويت',
  description: 'إدارة التوافر الفوري والطلبات المسندة والتواصل مع العملاء.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PainterRoute() {
  return <PainterDashboardPage />;
}
