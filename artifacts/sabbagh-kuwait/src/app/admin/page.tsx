import React from 'react';
import type { Metadata } from 'next';
import AdminDashboardPage from '@/views/admin-dashboard';

export const metadata: Metadata = {
  title: 'لوحة تحكم مدير المنصة | صباغ الكويت',
  description: 'إدارة الصباغين ومسار المعاينات والتقييمات الموثقة.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRoute() {
  return <AdminDashboardPage />;
}
