import React from 'react';
import type { Metadata } from 'next';
import LoginPage from '@/views/login';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | منصة صباغ الكويت',
  description: 'بوابة تسجيل دخول مدير المنصة والصباغين المعتمدين.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginRoute() {
  return <LoginPage />;
}
