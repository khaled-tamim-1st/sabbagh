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
  title: 'صباغ الكويت | أفضل فني دهانات وديكورات معتمد - فني الكويت',
  description:
    'دليل صباغ الكويت الأول من منصة فني الكويت: قارن وتواصل مباشرة مع أمهر صباغين وفنيين موثقين في كافة مناطق الكويت. أسعار حقيقية بالدينار، دهانات جوتن الأصلية، معاينة مجانية وواتساب فوري.',
  alternates: {
    canonical: 'https://sabbagh-kuwait.com/',
  },
};

export default function HomePage() {
  const platformSchema = generatePlatformSchema();
  const faqSchema = generateFaqSchema({
    items: [
      {
        question: 'كم سعر صبغ الغرفة في الكويت بالدينار الكويتي؟',
        answer:
          'يتراوح سعر صبغ الغرفة المتوسطة (4×4 أمتار) في الكويت بين 18 إلى 35 دينار كويتي معجون وسحب سكينة وصبغ يد عاملة، وتصل إلى 35 - 55 دينار شاملة مواد وأصباغ جوتن فينوماستيك بيور الأصلية.',
      },
      {
        question: 'كيف أختار أفضل صباغ شاطر وموثوق في الكويت؟',
        answer:
          'يمكنك عبر منصة فني الكويت تصفح بروفايلات الصباغين المعتمدين والمفحوصين، والاطلاع على صور سابقة أعمالهم وتقييمات العملاء الموثقة، ثم التواصل المباشر عبر الواتساب لتحديد موعد معاينة مجانية وفحص الموقع قبل الاتفاق.',
      },
      {
        question: 'ما هي أفضل أنواع الأصباغ المناسبة لأجواء الكويت؟',
        answer:
          'تعد أصباغ جوتن (Jotun) خاصة مجموعة فينوماستيك ربع لمعة ومطفي للصبغ الداخلي، وأصباغ كابارول (Caparol) وهمبل (Hempel)، بالإضافة إلى مواد السيجما وجوتاشيلد إكستريم للواجهات الخارجية الأفضل لمقاومة الحرارة العالية 50°C+ والرطوبة والغبار في الكويت.',
      },
      {
        question: 'هل توفرون معاينة مجانية لتقدير سعر الصبغ والتشطيب؟',
        answer:
          'نعم، يوفر كافة الصباغين والفنيين المعتمدين في دليل فني الكويت خدمة المعاينة الميدانية المجانية للمنازل والشقق والقسائم في جميع محافظات الكويت لتحديد كميات المواد والتكلفة بدقة تامة وبدون أي التزام مسبق.',
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
