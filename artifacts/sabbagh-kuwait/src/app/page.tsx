import React from 'react';
import type { Metadata } from 'next';
import { HomeView } from '@/components/home-view';
import {
  SeoSchema,
  generatePlatformSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
} from '@/components/seo-schema';

export const metadata: Metadata = {
  title: 'صباغ الكويت | دليل خدمات الأصباغ والدهانات والديكورات المعتمدة',
  description:
    'دليل صباغ الكويت الأول: قارن وتواصل مباشرة مع أفضل صباغين موثقين في كافة مناطق الكويت (حولي، العاصمة، الفروانية، الأحمدي، مبارك الكبير، والجهراء). أسعار حقيقية بالدينار الكويتي، أصباغ جوتن وهمبل وكابارول، معاينة مجانية وواتساب مباشر.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/',
  },
};

export default function HomePage() {
  const platformSchema = generatePlatformSchema();
  const faqSchema = generateFaqSchema({
    items: [
      {
        question: 'كم سعر صبغ الغرفة في الكويت بالدينار؟',
        answer:
          'يتراوح سعر صبغ الغرفة المتوسطة (4×4 أمتار) في الكويت بين 18 إلى 35 دينار كويتي معجون وش كين وصبغ بدون مواد، وتصل إلى 35 - 55 دينار شاملة أصباغ جوتن فينوماستيك الأصلية.',
      },
      {
        question: 'كيف أختار صباغ شاطر وموثوق في الكويت؟',
        answer:
          'يمكنك المقارنة بين الصباغين المعتمدين في المنصة، والاطلاع على صور سابقة أعمالهم، ومراجعة تقييمات العملاء الموثقة عبر واتساب، ثم التواصل المباشر مع الصباغ لمناقشة التفاصيل وتحديد موعد معاينة مجاني.',
      },
      {
        question: 'ما هي أفضل أنواع الأصباغ المناسبة لأجواء الكويت؟',
        answer:
          'تعد أصباغ جوتن (Jotun) خاصة مجموعة فينوماستيك للصبغ الداخلي، وأصباغ همبل (Hempel) وكابارول (Caparol) ومواد السيجما الخارجية الأفضل لمقاومة الحرارة العالية والرطوبة في مناخ الكويت.',
      },
    ],
  });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'الرئيسية', url: 'https://sabbagh-kuwait.com' },
    ],
  });

  return (
    <>
      <SeoSchema schemas={[platformSchema, faqSchema, breadcrumbSchema]} />
      <HomeView />
    </>
  );
}
