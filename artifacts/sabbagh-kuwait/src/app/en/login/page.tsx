import React from 'react';
import type { Metadata } from 'next';
import LoginPageEn from '@/views/login-en';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sign In | Painter & Admin Portal - Fani Kuwait',
  description:
    'Sign in to manage your painter profile, view incoming quotation leads, update your portfolio, and respond to clients across Kuwait.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/en/login/',
    languages: {
      'ar-KW': 'https://sabbagh-kuwait.com/login/',
      'en-KW': 'https://sabbagh-kuwait.com/en/login/',
    },
  },
};

export default function EnLoginPage() {
  return <LoginPageEn />;
}
