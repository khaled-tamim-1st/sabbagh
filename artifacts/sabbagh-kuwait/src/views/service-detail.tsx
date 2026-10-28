'use client';

import { useState } from 'react';
import { Link, useRoute } from '@/lib/nav';
import {
  Paintbrush,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  Calculator,
  Layers,
  ChevronDown,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ChevronLeft,
  CalendarCheck,
  BadgeCheck,
  Building,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
  KUWAIT_SERVICES_DATA,
  getServiceBySlug,
  type KuwaitService,
} from '@/data/services-data';
import { PAINTERS_DATA, type Painter } from '@/data/painters';
import { catalogStore } from '@/lib/catalog-store';
import {
  SeoSchema,
  generateServiceSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
} from '@/components/seo-schema';

export default function ServiceDetailPage({ slug: propSlug }: { slug?: string }) {
  const [matchService, serviceParams] = useRoute('/services/:slug');
  const [matchGuide, guideParams] = useRoute('/services-guide/:slug');

  const slug = propSlug || serviceParams?.slug || guideParams?.slug || 'interior-painting';
  const service = getServiceBySlug(slug) || KUWAIT_SERVICES_DATA[0];

  // فلترة الصباغين المتخصصين في هذه الخدمة أو الفئة من الصباغين المعتمدين فقط
  const specializedPainters = catalogStore.getApprovedPainters().filter((p) => {
    return (
      p.services.some(
        (s) =>
          s.includes(service.shortName) ||
          service.title.includes(s) ||
          s.includes(service.categoryLabelAr)
      ) || p.rating >= '4.8'
    );
  }).slice(0, 3);

  // خدمات ذات صلة في نفس التصنيف أو قريبة منه
  const relatedServices = KUWAIT_SERVICES_DATA.filter(
    (s) => s.id !== service.id
  ).slice(0, 3);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [inspectionSent, setInspectionSent] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'دليل الأصباغ والديكور', href: '/services' },
    { label: service.shortName, isCurrent: true },
  ];

  const canonicalUrl = `https://sabbagh-kuwait.com/services/${service.slug}`;

  // Schemas
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: breadcrumbItems.map((b) => ({
      name: b.label,
      url: b.href || `/services/${service.slug}`,
    })),
  });
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.description,
    category: service.categoryLabelAr,
    price: service.price.averageKWD,
    priceUnit: service.price.unit,
    url: canonicalUrl,
  });
  const faqSchema = service.faqs.length > 0 ? generateFaqSchema({ items: service.faqs }) : null;

  return (
    <Layout activeNav="/services">
      {/* Schemas للسيو الغني لمحركات البحث */}
      <SeoSchema schemas={[breadcrumbSchema, serviceSchema, faqSchema]} />

      {/* مسار التنقل Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* الهيدر الرئيسي للخدمة */}
      <section
        style={{
          background: '#17483e',
          color: '#f6f1e6',
          padding: '48px 0 42px',
          borderBottom: '3px solid #e9bd77',
        }}
      >
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
          <div style={{ maxWidth: '820px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(233,189,119,0.18)',
                color: '#e9bd77',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '14px',
              }}
            >
              <Sparkles size={14} />
              <span>{service.categoryLabelAr}</span>
            </span>

            <h1
              style={{
                fontSize: 'clamp(28px, 4.5vw, 42px)',
                margin: '8px 0 14px',
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: '-0.03em',
              }}
            >
              {service.title}
            </h1>

            <p
              style={{
                color: '#d5e2da',
                fontSize: '16px',
                lineHeight: 1.9,
                margin: '0 0 24px',
              }}
            >
              {service.tagline}. {service.description}
            </p>

            {/* بطاقة السعر السريع وأزرار الإجراء */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
                marginTop: '10px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(233,189,119,0.3)',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '12px', color: '#cad8cf' }}>متوسط السعر:</span>
                <strong style={{ fontSize: '22px', color: '#e9bd77' }}>
                  {service.price.fromKWD} - {service.price.toKWD} د.ك
                </strong>
                <span style={{ fontSize: '11px', color: '#b9c9be' }}>/ {service.price.unit}</span>
              </div>

              <Link
                href={`/request-quote?service=${encodeURIComponent(service.id)}`}
                className="contact-button"
                style={{
                  background: '#e9bd77',
                  color: '#17483e',
                  fontWeight: 700,
                  textDecoration: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                }}
              >
                <Calculator size={16} />
                <span>احسب التكلفة واطلب معاينة</span>
              </Link>

              <button
                type="button"
                onClick={() => setInspectionModalOpen(true)}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.35)',
                  padding: '11px 20px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Phone size={15} />
                <span>طلب اتصال فوري</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* المحتوى التفصيلي للخدمة */}
      <div
        style={{
          width: 'min(1192px, calc(100% - 48px))',
          margin: '40px auto 90px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* العمود الأيمن: التفاصيل الهندسية والخطوات والماركات */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* صندوق ملاءمة الخدمة لبيوت الكويت */}
          <section
            style={{
              background: '#fffdf9',
              border: '1px solid #e7decd',
              borderRadius: '18px',
              padding: '28px',
              boxShadow: '0 3px 14px rgba(23,72,62,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Building size={20} color="#17483e" />
              <h2 style={{ fontSize: '20px', color: '#17483e', margin: 0, fontWeight: 700 }}>
                لماذا تحتاج هذه الخدمة في بيتك بالكويت؟
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: '#44544b', lineHeight: 2, margin: '0 0 18px' }}>
              {service.whyInKuwait}
            </p>

            <div style={{ background: '#f8f4ec', borderRadius: '12px', padding: '16px', border: '1px solid #ebdcc5' }}>
              <strong style={{ display: 'block', fontSize: '13px', color: '#c7664f', marginBottom: '8px' }}>
                أماكن مناسبة داخل البيت لتطبيق الخدمة:
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {service.recommendedAreas.map((area, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#fff',
                      border: '1px solid #ded5c5',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#284339',
                    }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* خطوات العمل الاحترافية */}
          <section
            style={{
              background: '#fffdf9',
              border: '1px solid #e7decd',
              borderRadius: '18px',
              padding: '28px',
              boxShadow: '0 3px 14px rgba(23,72,62,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} color="#17483e" />
                <h2 style={{ fontSize: '20px', color: '#17483e', margin: 0, fontWeight: 700 }}>
                  مراحل وخطوات التنفيذ المعتمدة
                </h2>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#65746b',
                  background: '#f2eee5',
                  padding: '5px 10px',
                  borderRadius: '6px',
                }}
              >
                <Clock size={14} />
                <span>{service.executionTime}</span>
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {service.executionSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#faf6ee',
                    border: '1px solid #eee5d5',
                  }}
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#17483e',
                      color: '#f6f1e6',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <p style={{ margin: 0, fontSize: '13px', color: '#33443a', lineHeight: 1.8 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* الماركات ومصادر المواد المعتمدة في الكويت */}
          <section
            style={{
              background: '#fffdf9',
              border: '1px solid #e7decd',
              borderRadius: '18px',
              padding: '28px',
              boxShadow: '0 3px 14px rgba(23,72,62,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <ShieldCheck size={20} color="#17483e" />
              <h2 style={{ fontSize: '20px', color: '#17483e', margin: 0, fontWeight: 700 }}>
                الماركات الأصلية الموصى بها في سوق الكويت
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#66756d', margin: '0 0 14px' }}>
              يتم شراء كافة المواد والدهانات الأصلية مباشرة من كبرى وكالات ومستودعات الشويخ والري وأسواق القرين مع تقديم الفواتير الرسمية.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {service.popularBrands.map((brand, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fcfaf4',
                    border: '1px solid #e5dccb',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <CheckCircle2 size={16} color="#25D366" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#17483e' }}>{brand}</span>
                </div>
              ))}
            </div>
          </section>

          {/* نصائح الخبير للعميل الكويتي */}
          <section
            style={{
              background: '#fbf8f0',
              border: '1px solid #ebdcc5',
              borderRadius: '18px',
              padding: '24px 28px',
            }}
          >
            <h3 style={{ fontSize: '17px', color: '#c7664f', margin: '0 0 12px', fontWeight: 700 }}>
              نصائح ذهبية من معلم الصبغ قبل البدء:
            </h3>
            <ul style={{ paddingRight: '20px', margin: 0, fontSize: '13px', color: '#44554b', lineHeight: 2 }}>
              {service.expertAdvice.map((adv, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  {adv}
                </li>
              ))}
            </ul>
          </section>

          {/* الأسئلة الشائعة حول الخدمة */}
          {service.faqs.length > 0 && (
            <section
              style={{
                background: '#fffdf9',
                border: '1px solid #e7decd',
                borderRadius: '18px',
                padding: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <HelpCircle size={20} color="#17483e" />
                <h2 style={{ fontSize: '20px', color: '#17483e', margin: 0, fontWeight: 700 }}>
                  أسئلة شائعة حول {service.shortName}
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {service.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #ede4d5',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        background: isOpen ? '#faf6ee' : '#fff',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        style={{
                          width: '100%',
                          textAlign: 'right',
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#17483e',
                        }}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          size={18}
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s',
                          }}
                        />
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 18px 16px', color: '#55645b', fontSize: '13px', lineHeight: 1.8 }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* العمود الأيسر: بطاقة التسعير، حجز المعاينة، والصباغون المتخصصون */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* بطاقة السعر بالدينار الكويتي */}
          <div
            style={{
              background: '#fffdf9',
              border: '2px solid #e9bd77',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 6px 20px rgba(23,72,62,0.06)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#c7664f', fontWeight: 700, display: 'block' }}>
              جدول تسعير الخدمة في الكويت KWD
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '10px 0 6px' }}>
              <strong style={{ fontSize: '32px', color: '#17483e', fontWeight: 800 }}>
                {service.price.averageKWD} د.ك
              </strong>
              <span style={{ fontSize: '13px', color: '#77857d' }}>/ {service.price.unit} تقريباً</span>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#55665d', lineHeight: 1.6 }}>
              {service.price.notesAr}
            </p>

            <div
              style={{
                background: '#f5f0e4',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#284338',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} color="#17483e" />
              <span>
                {service.price.includesMaterials
                  ? 'السعر يشمل المواد الأصلية ومصنعية اليد'
                  : 'السعر لمصنعية اليد والعمالة فقط'}
              </span>
            </div>

            <Link
              href={`/request-quote?service=${encodeURIComponent(service.id)}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#17483e',
                color: '#f6f1e6',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(23,72,62,0.2)',
                marginBottom: '10px',
              }}
            >
              <Calculator size={18} />
              <span>احسب تكلفة بيتك بدقة</span>
            </Link>

            <button
              type="button"
              onClick={() => setInspectionModalOpen(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#fff',
                color: '#17483e',
                border: '1px solid #d4c8b6',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <CalendarCheck size={16} />
              <span>طلب معاينة فنية مجانية 100%</span>
            </button>
          </div>

          {/* فنيون معتمدون يقدمون هذه الخدمة */}
          <div
            style={{
              background: '#fffdf9',
              border: '1px solid #e7decd',
              borderRadius: '18px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '17px', color: '#17483e', margin: '0 0 16px', fontWeight: 700 }}>
              فنيون معتمدون لتنفيذ {service.shortName}:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {specializedPainters.map((painter) => (
                <div
                  key={painter.id}
                  style={{
                    border: '1px solid #ede5d7',
                    borderRadius: '12px',
                    padding: '14px',
                    background: '#fcfaf5',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#17483e', fontWeight: 700 }}>
                        {painter.name}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#77857c' }}>
                        {painter.region} • {painter.years} سنوات خبرة
                      </span>
                    </div>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#e9bd77',
                        color: '#17483e',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      <Star size={12} fill="#17483e" />
                      {painter.rating}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <a
                      href={`https://wa.me/${painter.whatsapp}?text=${encodeURIComponent(
                        `مرحباً ${painter.name}، أود الاستفسار عن خدمة ${service.title} لمنزلي.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: '#25D366',
                        color: '#fff',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>واتساب</span>
                    </a>
                    <Link
                      href={`/painters/${encodeURIComponent(painter.slug || painter.name || painter.id)}`}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #d4c8b6',
                        background: '#fff',
                        color: '#17483e',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      البروفايل
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* خدمات أخرى ذات صلة */}
          <div
            style={{
              background: '#f9f5ed',
              border: '1px solid #ebdcc5',
              borderRadius: '18px',
              padding: '22px',
            }}
          >
            <h3 style={{ fontSize: '16px', color: '#17483e', margin: '0 0 12px', fontWeight: 700 }}>
              خدمات أصباغ وديكور أخرى:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/services/${rel.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#fff',
                    border: '1px solid #e5dccb',
                    color: '#17483e',
                    fontSize: '13px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  <span>{rel.title}</span>
                  <ChevronLeft size={16} color="#c7664f" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* مودال طلب المعاينة الفورية */}
      {inspectionModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(17,48,41,0.6)',
            padding: '16px',
            backdropFilter: 'blur(3px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setInspectionModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#fffdf9',
              borderRadius: '20px',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
          >
            {inspectionSent ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={48} color="#25D366" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '20px', color: '#17483e', margin: '0 0 8px' }}>
                  تم استلام طلب المعاينة بنجاح!
                </h3>
                <p style={{ fontSize: '13px', color: '#55665d', lineHeight: 1.7, margin: '0 0 20px' }}>
                  سيتواصل معك خبير الصبغ المختص بخدمة ({service.shortName}) لترتيب موعد المعاينة المجانية في أسرع وقت.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setInspectionModalOpen(false);
                    setInspectionSent(false);
                  }}
                  className="contact-button"
                  style={{ width: '100%', padding: '12px' }}
                >
                  حسناً، تم
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInspectionSent(true);
                }}
                data-webmcp-tool="service_inspection_request"
                data-webmcp-description={`طلب معاينة فنية مجانية لخدمة: ${service.title}`}
                aria-label={`طلب معاينة مجانية لـ ${service.shortName}`}
              >
                <h3 style={{ fontSize: '20px', color: '#17483e', margin: '0 0 6px', fontWeight: 700 }}>
                  طلب معاينة مجانية لـ {service.shortName}
                </h3>
                <p style={{ fontSize: '12px', color: '#4a5649', margin: '0 0 18px', lineHeight: 1.6 }}>
                  معاينة ميدانية مجانية 100% دون أي التزام مالي في كافة مناطق الكويت.
                </p>

                <div style={{ marginBottom: '14px' }}>
                  <label htmlFor="service-cust-name" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#33443a', marginBottom: '6px' }}>
                    الاسم الكريم
                  </label>
                  <input
                    id="service-cust-name"
                    name="customerName"
                    aria-label="الاسم الكريم"
                    autoComplete="name"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اكتب اسمك"
                    className="form-input"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="service-cust-phone" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#33443a', marginBottom: '6px' }}>
                    رقم الهاتف / الواتساب
                  </label>
                  <input
                    id="service-cust-phone"
                    name="customerPhone"
                    aria-label="رقم الهاتف أو الواتساب"
                    autoComplete="tel"
                    required
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="مثال: 5XXXXXXX أو 6XXXXXXX"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="contact-button modal-action" style={{ flex: 1, margin: 0 }}>
                    تأكيد طلب المعاينة
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectionModalOpen(false)}
                    className="detail-button"
                    style={{ padding: '0 16px' }}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
