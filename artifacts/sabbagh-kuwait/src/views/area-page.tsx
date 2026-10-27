'use client';

import { useState, useEffect, useMemo } from 'react';
import { Link, useRoute } from '@/lib/nav';
import {
  MapPin, ShieldCheck, Star, Phone, MessageCircle, CheckCircle2,
  Calculator, Clock3, ChevronDown, ChevronUp, ChevronRight, ArrowRight,
  Search, Building2, Sparkles, Droplets, Flame, Wind, Home as HomeIcon,
  Layers, BadgeCheck, ExternalLink, HelpCircle, AlertCircle, Check, X,
  FileText, ArrowUpRight, Compass, Wrench, Share2
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { PainterAvatar } from '@/components/painter-avatar';
import { LeadQuoteSection } from '@/components/lead-quote-section';
import {
  KUWAIT_GOVERNORATES,
  getGovernorateById,
  findAreaById,
  POPULAR_AREAS_SUMMARY,
  type Area,
  type Governorate,
} from '@/data/kuwait-areas';
import { PAINTERS_DATA, type Painter } from '@/data/painters';
import {
  getAreaSeoMeta,
  getAreaAdvice,
  getAreaFaqs,
  getGovernorateSeoMeta,
  getGovernorateFaqs,
} from '@/data/area-seo-data';
import { KUWAIT_SERVICES_DATA } from '@/data/services-data';
import { BLOG_ARTICLES } from '@/data/blog-posts';

export default function AreaPage({ govId: propGovId, areaId: propAreaId }: { govId?: string; areaId?: string }) {
  const [matchArea, areaParams] = useRoute('/areas/:govId/:areaId');
  const [matchGov, govParams] = useRoute('/areas/:govId');
  const currentGovId = propGovId || areaParams?.govId || govParams?.govId;
  const currentAreaId = propAreaId || areaParams?.areaId;
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactModalPainter, setContactModalPainter] = useState<Painter | null>(null);
  const [modalCustomerName, setModalCustomerName] = useState('');
  const [modalCustomerPhone, setModalCustomerPhone] = useState('');
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // استخراج المحافظة والمنطقة بمرونة ذكية
  const resolution = useMemo(() => {
    if (currentGovId && currentAreaId) {
      const gov = getGovernorateById(currentGovId);
      const area = gov?.areas.find((a) => a.id === currentAreaId) || findAreaById(currentAreaId)?.area;
      const finalGov = gov || (area ? getGovernorateById(area.governorateId) : undefined);
      if (finalGov && area) {
        return { type: 'area' as const, governorate: finalGov, area };
      }
    }

    if (currentGovId) {
      const gov = getGovernorateById(currentGovId);
      if (gov) {
        return { type: 'governorate' as const, governorate: gov, area: null };
      }
      const areaMatch = findAreaById(currentGovId);
      if (areaMatch) {
        return { type: 'area' as const, governorate: areaMatch.governorate, area: areaMatch.area };
      }
    }

    // 1. مسار كامل: /areas/:govId/:areaId
    if (matchArea && areaParams) {
      const gov = getGovernorateById(areaParams.govId);
      const area = gov?.areas.find((a) => a.id === areaParams.areaId) || findAreaById(areaParams.areaId)?.area;
      const finalGov = gov || (area ? getGovernorateById(area.governorateId) : undefined);
      if (finalGov && area) {
        return { type: 'area' as const, governorate: finalGov, area };
      }
    }

    // 2. مسار أحادي: /areas/:govId
    if (matchGov && govParams) {
      const gov = getGovernorateById(govParams.govId);
      if (gov) {
        return { type: 'governorate' as const, governorate: gov, area: null };
      }
      // فحص إن كان المعرف خاصاً بمنطقة مباشرة: /areas/al-salmiya
      const areaMatch = findAreaById(govParams.govId);
      if (areaMatch) {
        return { type: 'area' as const, governorate: areaMatch.governorate, area: areaMatch.area };
      }
    }

    // 3. الدليل العام: /areas
    return { type: 'directory' as const, governorate: null, area: null };
  }, [matchArea, areaParams, matchGov, govParams]);

  const { type, governorate, area } = resolution;

  // تحديث عنوان الصفحة ووسوم الميتا ديناميكياً لأجل السيو
  useEffect(() => {
    if (type === 'area' && area && governorate) {
      const seo = getAreaSeoMeta(area, governorate);
      document.title = seo.metaTitle;
    } else if (type === 'governorate' && governorate) {
      const govSeo = getGovernorateSeoMeta(governorate);
      document.title = govSeo.metaTitle;
    } else {
      document.title = 'دليل مناطق ومحافظات الكويت لخدمات الأصباغ والدهانات | صباغ الكويت';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type, governorate, area]);

  // تصفية الصباغين الذين يغطون المحافظة والمنطقة
  const relevantPainters = useMemo(() => {
    if (!governorate) return PAINTERS_DATA;

    const matched = PAINTERS_DATA.filter((p) => {
      const coversGov = p.governorates.some(
        (g) => g.includes(governorate.nameAr) || governorate.nameAr.includes(g)
      );
      const coversRegion = area ? p.region.includes(area.nameAr) || area.nameAr.includes(p.region) : false;
      return coversGov || coversRegion;
    });

    // في حال عدم وجود عدد كافٍ، نعرض الصباغين مع إبراز تغطيتهم العامة للكويت
    return matched.length > 0 ? matched : PAINTERS_DATA.slice(0, 4);
  }, [governorate, area]);

  // مشاركة أو نسخ الرابط
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // فتح وإغلاق الأسئلة الشائعة
  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  // تقديم نموذج المعاينة السريعة
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSubmitted(true);
  };

  // -------------------------------------------------------------
  // عرض صفحة المنطقة المحددة (Targeted Area Landing Page)
  // -------------------------------------------------------------
  if (type === 'area' && area && governorate) {
    const seoMeta = getAreaSeoMeta(area, governorate);
    const advice = getAreaAdvice(area, governorate);
    const faqs = getAreaFaqs(area, governorate);
    const neighborAreas = governorate.areas.filter((a) => a.id !== area.id);

    // Schema.org Structured Data
    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://sabbagh-kuwait.com/' },
            { '@type': 'ListItem', position: 2, name: 'مناطق الكويت', item: 'https://sabbagh-kuwait.com/areas' },
            { '@type': 'ListItem', position: 3, name: `محافظة ${governorate.nameAr}`, item: `https://sabbagh-kuwait.com/areas/${governorate.id}` },
            { '@type': 'ListItem', position: 4, name: area.nameAr, item: `https://sabbagh-kuwait.com/areas/${governorate.id}/${area.id}` },
          ],
        },
        {
          '@type': 'LocalBusiness',
          name: `خدمات صباغ الكويت في ${area.nameAr}`,
          description: seoMeta.metaDescription,
          areaServed: {
            '@type': 'AdministrativeArea',
            name: `${area.nameAr}، محافظة ${governorate.nameAr}، دولة الكويت`,
          },
          priceRange: '$$',
          telephone: relevantPainters[0]?.phone || '+965 94412356',
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        },
      ],
    };

    return (
      <Layout activeNav="/areas">
        {/* إضافة JSON-LD للسيو المتقدم */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />

        {/* شريط مسار التنقل (Breadcrumb Silo) */}
        <div style={{ background: '#f5efe1', borderBottom: '1px solid #e7decd' }}>
          <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto', padding: '12px 0' }}>
            <nav aria-label="مسار التنقل" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6d746a', flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: '#17483e', textDecoration: 'none', fontWeight: 600 }}>الرئيسية</Link>
              <ChevronRight size={14} />
              <Link href="/areas" style={{ color: '#17483e', textDecoration: 'none', fontWeight: 600 }}>مناطق الكويت</Link>
              <ChevronRight size={14} />
              <Link href={`/areas/${governorate.id}`} style={{ color: '#17483e', textDecoration: 'none', fontWeight: 600 }}>
                محافظة {governorate.nameAr}
              </Link>
              <ChevronRight size={14} />
              <span style={{ color: '#23483e', fontWeight: 700 }}>صباغ {area.nameAr}</span>
            </nav>
          </div>
        </div>

        {/* هيدر الصفحة الرئيسي المستهدف للسيو طويل الذيل (Hero Section) */}
        <section style={{ background: '#17483e', color: '#f6f1e6', padding: '48px 0 38px', borderBottom: '3px solid #e9bd77', position: 'relative' }}>
          <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <span className="eyebrow" style={{ color: '#d9c597' }}>
                <MapPin size={14} />
                {seoMeta.heroKicker}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#f6f1e6',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {copiedLink ? <Check size={14} color="#e9bd77" /> : <Share2 size={14} />}
                <span>{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة الصفحة'}</span>
              </button>
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', lineHeight: 1.25, margin: '8px 0 14px', fontWeight: 700, letterSpacing: '-0.03em' }}>
              {seoMeta.h1}
            </h1>

            <p style={{ margin: 0, color: '#d2dfd7', fontSize: '15px', maxWidth: '780px', lineHeight: 1.9 }}>
              {seoMeta.metaDescription}
            </p>

            {/* بطاقات مميزات وسرعة الخدمة في المنطقة */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '24px' }}>
              {seoMeta.featuresList.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12px',
                    color: '#f3efe6',
                  }}
                >
                  <CheckCircle2 size={16} color="#e9bd77" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* أزرار الإجراء السريع للمنطقة */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '26px' }}>
              <a
                href={`tel:${relevantPainters[0]?.phone.replace(/\s+/g, '') || '+96594412356'}`}
                className="contact-button"
                style={{
                  background: '#e9bd77',
                  color: '#17483e',
                  borderColor: '#e9bd77',
                  padding: '12px 22px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                }}
              >
                <Phone size={16} />
                <span>اتصل بصباغ {area.nameAr} الآن</span>
              </a>

              <a
                href={`https://wa.me/${relevantPainters[0]?.whatsapp || '96594412356'}?text=${encodeURIComponent(`السلام عليكم، شفت إعلانكم في صباغ الكويت وأبي استفسر عن صبغ في منطقة ${area.nameAr}، هل متاح موعد للمعاينة؟`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-button"
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                  borderColor: '#25D366',
                  padding: '12px 20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={16} />
                <span>واتساب مباشر للمعاينة</span>
              </a>

              <Link
                href="/request-quote"
                className="detail-button"
                style={{
                  background: 'transparent',
                  color: '#f6f1e6',
                  borderColor: 'rgba(255,255,255,0.4)',
                  padding: '12px 18px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                }}
              >
                <Calculator size={15} />
                <span>حاسبة تكلفة الصبغ</span>
              </Link>
            </div>
          </div>
        </section>

        {/* شريط الإحصائيات وضمان العمل بالمنطقة */}
        <section className="trust-strip">
          <div className="trust-inner">
            <span className="trust-note">
              <Building2 aria-hidden="true" />
              <span>المحافظة: <strong>{governorate.nameAr}</strong></span>
            </span>
            <span className="trust-note">
              <ShieldCheck aria-hidden="true" />
              <span>الضمان: <strong>كفالة من سنة إلى 5 سنوات</strong></span>
            </span>
            <span className="trust-note">
              <Clock3 aria-hidden="true" />
              <span>سرعة الوصول: <strong>معاينة خلال ساعتين</strong></span>
            </span>
            <span className="trust-note">
              <Sparkles aria-hidden="true" />
              <span>المواد: <strong>جوتن وهمبل أصلية 100%</strong></span>
            </span>
          </div>
        </section>

        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: '36px auto 80px' }}>
          
          {/* قسم النصائح المحلية لطبيعة المنطقة (المناخ والرطوبة والبيوت الجديدة) */}
          <section
            style={{
              background: '#fffdf8',
              border: '1px solid #e8e1d3',
              borderRadius: '20px',
              padding: '28px',
              marginBottom: '38px',
              boxShadow: '0 4px 18px rgba(23, 72, 62, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: advice.theme === 'coastal' ? '#e2efea' : advice.theme === 'new-city' ? '#faede8' : '#f2eee5',
                  color: advice.theme === 'coastal' ? '#17483e' : advice.theme === 'new-city' ? '#c7664f' : '#68593a',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {advice.theme === 'coastal' ? <Droplets size={20} /> : advice.theme === 'new-city' ? <Flame size={20} /> : <Sparkles size={20} />}
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700 }}>{advice.badge}</span>
                <h2 style={{ fontSize: '20px', color: '#17483e', margin: '2px 0 0', fontWeight: 700 }}>
                  {advice.title}
                </h2>
              </div>
            </div>

            <p style={{ color: '#58645a', fontSize: '13px', lineHeight: 1.9, margin: '12px 0 20px' }}>
              {advice.summary}
            </p>

            {/* نقاط النصائح المحددة */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {advice.points.map((pt, i) => (
                <div
                  key={i}
                  style={{
                    background: '#f9f6ef',
                    border: '1px solid #e8e2d4',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <strong style={{ display: 'block', color: '#17483e', fontSize: '13px', marginBottom: '6px' }}>
                    {i + 1}. {pt.title}
                  </strong>
                  <p style={{ margin: 0, color: '#687063', fontSize: '12px', lineHeight: 1.8 }}>
                    {pt.description}
                  </p>
                </div>
              ))}
            </div>

            {/* ماركات الصبغ الموصى بها في هذه المنطقة */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eee7d9' }}>
              <span style={{ fontSize: '12px', color: '#23483e', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                المواد والدهانات المعتمدة الموصى بها لمباني {area.nameAr}:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {advice.recommendedPaints.map((paint, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#17483e',
                      color: '#f6f1e6',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {paint}
                  </span>
                ))}
              </div>
            </div>

            {advice.warningNote && (
              <div
                style={{
                  marginTop: '16px',
                  background: '#fcf3f0',
                  borderRight: '4px solid #c7664f',
                  borderRadius: '0 8px 8px 0',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12px',
                  color: '#843825',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{advice.warningNote}</span>
              </div>
            )}
          </section>

          {/* قسم الفنيين والورش التي تغطي المنطقة */}
          <section style={{ marginBottom: '44px' }}>
            <div className="section-head">
              <div>
                <div className="section-kicker">فنيون معتمدون في {area.nameAr}</div>
                <h2>صباغون وورش تغطي منطقة {area.nameAr} ومحافظة {governorate.nameAr}</h2>
                <p className="section-caption">
                  تواصل مباشر بدون وسيط أو عمولة مع فنيين موثوقين ومجربين.
                </p>
              </div>
              <span className="result-count">{relevantPainters.length} فنيين متاحين</span>
            </div>

            <div className="directory-grid">
              {relevantPainters.map((painter) => (
                <article key={painter.id} className="painter-card" data-testid={`card-area-painter-${painter.id}`}>
                  <div className="card-top">
                    <Link href={`/painters/${encodeURIComponent(painter.slug || painter.name || painter.id)}`} className="painter-identity" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <PainterAvatar painter={painter} />
                      <div className="identity-copy">
                        <h3>{painter.name}</h3>
                        <span className="verified"><BadgeCheck aria-hidden="true" /> معتمد ويغطي {area.nameAr}</span>
                      </div>
                    </Link>
                  </div>

                  <div className="card-meta">
                    <span className="meta-item"><Star fill="currentColor" aria-hidden="true" /><b className="rating-number">{painter.rating}</b><span>({painter.reviews})</span></span>
                    <span className="meta-item"><MapPin aria-hidden="true" />{painter.region}</span>
                    <span className="meta-item"><Clock3 aria-hidden="true" />{painter.years} سنوات خبرة</span>
                  </div>

                  <p className="card-desc">{painter.description}</p>

                  <div className="card-tags">
                    {painter.services.map((service) => (
                      <span key={service} className="tag">{service}</span>
                    ))}
                    <span className="tag" style={{ background: '#e2efea', color: '#17483e' }}>
                      ضمان {painter.warrantyYears} سنوات
                    </span>
                  </div>

                  {/* معلومات التواصل الفوري والأسعار */}
                  <div className="card-bottom">
                    <div>
                      <span className="price-label">يبدأ من</span>
                      <span className="price-value">{painter.startingAt} <small>للغرفة</small></span>
                    </div>
                    <div className="card-actions">
                      <a
                        href={`tel:${painter.phone.replace(/\s+/g, '')}`}
                        className="contact-button"
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title={`اتصال بصباغ ${painter.name}`}
                      >
                        <Phone size={13} />
                        <span>اتصال</span>
                      </a>
                      <a
                        href={`https://wa.me/${painter.whatsapp}?text=${encodeURIComponent(`السلام عليكم ${painter.name}، شفت ملفكم في موقع صباغ الكويت وأبي استفسر عن صبغ في منطقة ${area.nameAr}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-button"
                        style={{
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#1a7e44',
                          borderColor: '#b4e0c4',
                        }}
                        title="مراسلة واتساب"
                      >
                        <MessageCircle size={13} />
                        <span>واتساب</span>
                      </a>
                      <button
                        type="button"
                        className="detail-button"
                        onClick={() => {
                          setContactModalPainter(painter);
                          setModalSubmitted(false);
                        }}
                      >
                        معاينة
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* جدول الأسعار الإرشادية لخدمات الصبغ في المنطقة */}
          <section
            style={{
              background: '#fffdf8',
              border: '1px solid #e8e1d3',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '42px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700 }}>دليل الأسعار المعتمدة</span>
              <h2 style={{ fontSize: '18px', color: '#17483e', margin: '4px 0' }}>
                كم تكلفة خدمات الصباغ في {area.nameAr}؟ (أسعار تقريبية {new Date().getFullYear()})
              </h2>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'right' }}>
                <thead>
                  <tr style={{ background: '#f5efe1', borderBottom: '2px solid #e4dac7', color: '#17483e' }}>
                    <th style={{ padding: '10px 14px', borderRadius: '0 8px 8px 0' }}>نوع العمل أو الغرفة</th>
                    <th style={{ padding: '10px 14px' }}>متوسط السعر بالدينار الكويتي</th>
                    <th style={{ padding: '10px 14px', borderRadius: '8px 0 0 8px' }}>ملاحظات وتفاصيل المواد</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee7d9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#23483e' }}>صبغ غرفة نوم قياسية (4×4 م)</td>
                    <td style={{ padding: '10px 14px', color: '#c7664f', fontWeight: 700 }}>18 - 25 د.ك</td>
                    <td style={{ padding: '10px 14px', color: '#687063' }}>شامل حماية الأثاث، صنفرة، سكينة معجون، ووجهين صبغ جوتن</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee7d9', background: '#fdfbf6' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#23483e' }}>صبغ غرفة ماستر كبيرة مع السقف</td>
                    <td style={{ padding: '10px 14px', color: '#c7664f', fontWeight: 700 }}>28 - 38 د.ك</td>
                    <td style={{ padding: '10px 14px', color: '#687063' }}>صبغ السقف مطفي ناصع البياض والجدران ربع لمعة أو مطفي مخملي</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee7d9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#23483e' }}>صبغ صالة استقبال أو ديوانية عائلية</td>
                    <td style={{ padding: '10px 14px', color: '#c7664f', fontWeight: 700 }}>45 - 75 د.ك</td>
                    <td style={{ padding: '10px 14px', color: '#687063' }}>يعتمد على المساحة وارتفاع الأسقف وإطارات الجبس الديكورية</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee7d9', background: '#fdfbf6' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#23483e' }}>تركيب رول ورق جدران (كوري / إيطالي)</td>
                    <td style={{ padding: '10px 14px', color: '#c7664f', fontWeight: 700 }}>4 - 6 د.ك</td>
                    <td style={{ padding: '10px 14px', color: '#687063' }}>للرول الواحد (16 م² للكوري) شامل الغراء الأصلي ضد الرطوبة</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#23483e' }}>معالجة نش الرطوبة والأملاح للجدار</td>
                    <td style={{ padding: '10px 14px', color: '#c7664f', fontWeight: 700 }}>12 - 20 د.ك</td>
                    <td style={{ padding: '10px 14px', color: '#687063' }}>كشط المعجون التالف، دهان برايمر عازل مائي، وإعادة التأسيس بالكامل</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* قسم الربط الداخلي المحكم (Internal Linking Silo) - مناطق مجاورة بالمحافظة */}
          <section
            style={{
              background: '#f4ede1',
              border: '1px solid #e5dac7',
              borderRadius: '20px',
              padding: '28px',
              marginBottom: '42px',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700 }}>
                شبكة الربط الداخلي في {governorate.nameAr}
              </span>
              <h2 style={{ fontSize: '20px', color: '#17483e', margin: '4px 0' }}>
                مناطق مجاورة في محافظة {governorate.nameAr} نغطيها أيضاً
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7266' }}>
                يتنقل فنيو الصباغة بسرعة بين مناطق {governorate.nameAr}. اضغط على أي منطقة لاستعراض صباغيها ونطاقات الأسعار:
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {neighborAreas.map((neighbor) => (
                <Link
                  key={neighbor.id}
                  href={`/areas/${governorate.id}/${neighbor.id}`}
                  style={{
                    background: '#fffdf8',
                    border: '1px solid #dfd6c6',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    textDecoration: 'none',
                    color: '#21453c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: 'all 0.18s ease',
                  }}
                  className="hover:border-[#17483e] hover:shadow-sm"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="#c7664f" />
                    <span>صباغ {neighbor.nameAr.replace(/\s*\(.*?\)\s*/g, '')}</span>
                  </div>
                  <ChevronRight size={14} color="#8a9488" />
                </Link>
              ))}
            </div>

            {/* روابط الانتقال لباقي محافظات الكويت */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #ded3bf' }}>
              <span style={{ fontSize: '12px', color: '#23483e', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                تصفح صباغين في باقي محافظات الكويت الست:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {KUWAIT_GOVERNORATES.filter((g) => g.id !== governorate.id).map((otherGov) => (
                  <Link
                    key={otherGov.id}
                    href={`/areas/${otherGov.id}`}
                    style={{
                      background: '#fffdf8',
                      border: '1px solid #d5cbba',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      fontSize: '11px',
                      color: '#17483e',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    صباغ محافظة {otherGov.nameAr} ({otherGov.areasCount} منطقة)
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* قسم خدمات الأصباغ والديكور المتاحة في المنطقة مع روابط السيو المباشرة */}
          <section style={{ marginBottom: '42px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700 }}>
                  خدمات احترافية متوفرة في {area.nameAr}
                </span>
                <h2 style={{ fontSize: '20px', color: '#17483e', margin: '4px 0' }}>
                  أشهر خدمات الصبغ والديكور المطلوبة في {area.nameAr}
                </h2>
              </div>
              <Link
                href="/services"
                style={{
                  color: '#17483e',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>دليل كافة الخدمات (12 خدمة)</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {KUWAIT_SERVICES_DATA.slice(0, 4).map((srv) => (
                <div
                  key={srv.id}
                  style={{
                    background: '#fffdf8',
                    border: '1px solid #e8e1d3',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span className="tag" style={{ background: '#f5eee1', color: '#17483e', fontWeight: 600, fontSize: '10px', marginBottom: '8px', display: 'inline-block' }}>
                      {srv.categoryLabelAr}
                    </span>
                    <h3 style={{ fontSize: '15px', color: '#17483e', margin: '0 0 8px', fontWeight: 700 }}>
                      {srv.shortName} في {area.nameAr}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#687165', lineHeight: 1.7, margin: '0 0 14px' }}>
                      {srv.tagline}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #eee7dc', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#c7664f' }}>
                      {srv.price.fromKWD} - {srv.price.toKWD} د.ك
                    </span>
                    <Link
                      href={`/services/${srv.slug}`}
                      style={{
                        fontSize: '11px',
                        color: '#17483e',
                        fontWeight: 700,
                        textDecoration: 'none',
                        background: '#f2ece0',
                        padding: '5px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      التفاصيل والأسعار ←
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* قسم مقالات توعوية من المدونة لسكان المنطقة */}
          <section
            style={{
              background: '#f9f6f0',
              border: '1px solid #e7decd',
              borderRadius: '20px',
              padding: '26px',
              marginBottom: '42px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700 }}>
                  توجيهات وإرشادات هندسية
                </span>
                <h2 style={{ fontSize: '20px', color: '#17483e', margin: '4px 0' }}>
                  مقالات تهم أصحاب البيوت والشقق في {area.nameAr}
                </h2>
              </div>
              <Link
                href="/blog"
                style={{
                  color: '#17483e',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>زيارة المدونة</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {BLOG_ARTICLES.slice(0, 3).map((art) => (
                <article
                  key={art.id}
                  style={{
                    background: '#fffdf9',
                    border: '1px solid #e8e1d3',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '10px', color: '#dfb56c', background: 'rgba(233,189,119,0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, display: 'inline-block', marginBottom: '8px' }}>
                      {art.categoryLabelAr}
                    </span>
                    <h3 style={{ fontSize: '14px', color: '#17483e', margin: '0 0 8px', lineHeight: 1.6, fontWeight: 700 }}>
                      <Link href={`/blog/${art.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {art.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '12px', color: '#667064', lineHeight: 1.7, margin: '0 0 12px' }}>
                      {art.excerpt.slice(0, 95)}...
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #eee8dd', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#889387' }}>
                    <span>{art.readTime}</span>
                    <Link href={`/blog/${art.slug}`} style={{ color: '#17483e', fontWeight: 700, textDecoration: 'none' }}>
                      اقرأ المقال الكامل ←
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* قسم الأسئلة الشائعة المخصصة للمنطقة (Area-specific FAQ) */}
          <section style={{ marginBottom: '40px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700 }}>
                إجابات استفسارات أهالي {area.nameAr}
              </span>
              <h2 style={{ fontSize: '22px', color: '#17483e', margin: '4px 0' }}>
                الأسئلة الشائعة حول صباغين ودهانات {area.nameAr}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6d746a' }}>
                كل ما تحتاج معرفته عن الأسعار، المعاينة، الكفالة، ومقاومة الرطوبة في المنطقة.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      background: '#fffdf8',
                      border: '1px solid #e8e1d3',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      style={{
                        width: '100%',
                        textAlign: 'right',
                        padding: '16px 18px',
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isOpen ? '#17483e' : '#23463d',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HelpCircle size={16} color={isOpen ? '#17483e' : '#c7664f'} style={{ flexShrink: 0 }} />
                        <span>{faq.question}</span>
                      </div>
                      {isOpen ? <ChevronUp size={18} color="#17483e" /> : <ChevronDown size={18} color="#7c8477" />}
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          padding: '0 18px 18px 44px',
                          color: '#5b6459',
                          fontSize: '13px',
                          lineHeight: 1.85,
                          borderTop: '1px solid #f2eee5',
                          paddingTop: '12px',
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* بانر ختامي للحث على التواصل (CTA) */}
          <section
            style={{
              background: 'linear-gradient(135deg, #17483e 0%, #1f5a4e 100%)',
              color: '#fff9ee',
              borderRadius: '22px',
              padding: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 14px 34px rgba(23,72,62,0.18)',
            }}
          >
            <div style={{ maxWidth: '580px' }}>
              <span className="eyebrow" style={{ color: '#e9bd77' }}>معاينة مجانية في منزلك</span>
              <h2 style={{ fontSize: '24px', margin: '8px 0 10px', color: '#fff9ee', fontWeight: 700 }}>
                تبي تصبغ بيتك أو قسيمتك في {area.nameAr} بأعلى جودة؟
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#d5e2dc', lineHeight: 1.8 }}>
                فنيونا متواجدون الآن في {area.nameAr} ومستعدون للمعاينة وتحديد كميات المعجون ودرجات الصبغ من كتالوج جوتن وكابارول مع ضمان الجودة والنظافة.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={`tel:${relevantPainters[0]?.phone.replace(/\s+/g, '') || '+96594412356'}`}
                className="contact-button"
                style={{
                  background: '#e9bd77',
                  color: '#17483e',
                  borderColor: '#e9bd77',
                  padding: '13px 24px',
                  fontWeight: 700,
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Phone size={16} />
                <span>اتصل الآن ({relevantPainters[0]?.phone})</span>
              </a>

              <Link
                href="/request-quote"
                className="detail-button"
                style={{
                  background: 'transparent',
                  color: '#fff9ee',
                  borderColor: 'rgba(255,255,255,0.4)',
                  padding: '13px 20px',
                  fontWeight: 600,
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Calculator size={16} />
                <span>حساب التكلفة الفورية</span>
              </Link>
            </div>
          </section>

          {/* نموذج طلب المعاينة وعرض السعر الفوري */}
          <LeadQuoteSection initialGovernorate={governorate.nameAr} />

        </div>

        {/* نافذة معاينة وطلب الصباغ السريعة */}
        {contactModalPainter && (
          <div
            className="modal-backdrop"
            role="presentation"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setContactModalPainter(null);
            }}
          >
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="area-modal-title">
              <div className="modal-head">
                <div>
                  <h2 id="area-modal-title" className="modal-title">
                    طلب معاينة في {area.nameAr}
                  </h2>
                  <p className="modal-subtitle">
                    مقدم الخدمة: <strong>{contactModalPainter.name}</strong> · هاتف:{' '}
                    <span dir="ltr">{contactModalPainter.phone}</span>
                  </p>
                </div>
                <button
                  className="close-button"
                  type="button"
                  onClick={() => setContactModalPainter(null)}
                  aria-label="إغلاق"
                >
                  <X />
                </button>
              </div>

              {modalSubmitted ? (
                <div style={{ marginTop: '20px' }}>
                  <div className="success-note">
                    <Check size={18} />
                    تم تسجيل طلبك لمعاينة منزلك في <strong>{area.nameAr}</strong> بنجاح! سيتواصل معك فريق{' '}
                    <strong>{contactModalPainter.name}</strong> خلال وقت قصير.
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <a
                      href={`tel:${contactModalPainter.phone.replace(/\s+/g, '')}`}
                      className="contact-button modal-action"
                      style={{ textDecoration: 'none', textAlign: 'center', margin: 0 }}
                    >
                      اتصال فوري بالصباغ الآن ({contactModalPainter.phone})
                    </a>
                    <button
                      className="detail-button"
                      type="button"
                      onClick={() => setContactModalPainter(null)}
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleModalSubmit}>
                  <label className="form-label" htmlFor="cust-name">الاسم الكريم</label>
                  <input
                    className="form-input"
                    id="cust-name"
                    required
                    value={modalCustomerName}
                    onChange={(e) => setModalCustomerName(e.target.value)}
                    placeholder="اكتب اسمك"
                  />

                  <label className="form-label" htmlFor="cust-phone">رقم الهاتف (الكويت)</label>
                  <input
                    className="form-input"
                    id="cust-phone"
                    required
                    type="tel"
                    value={modalCustomerPhone}
                    onChange={(e) => setModalCustomerPhone(e.target.value)}
                    placeholder="مثال: 9XXXXXXX أو 5XXXXXXX"
                  />

                  <label className="form-label">المنطقة والموقع</label>
                  <input
                    className="form-input"
                    disabled
                    value={`${area.nameAr} - محافظة ${governorate.nameAr}`}
                    style={{ background: '#f5efe1', color: '#17483e', fontWeight: 600 }}
                  />

                  <button className="contact-button modal-action" type="submit">
                    تأكيد طلب المعاينة المجانية
                  </button>
                  <p className="form-note">
                    * المعاينة مجانية بدون أي التزام مسبق داخل منطقة {area.nameAr}.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </Layout>
    );
  }

  // -------------------------------------------------------------
  // عرض صفحة المحافظة (Governorate Landing Page)
  // -------------------------------------------------------------
  if (type === 'governorate' && governorate) {
    const govSeo = getGovernorateSeoMeta(governorate);
    const govFaqs = getGovernorateFaqs(governorate);

    // تصفية مناطق المحافظة عبر البحث الداخلي
    const filteredAreas = governorate.areas.filter(
      (a) =>
        !searchQuery ||
        a.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Layout activeNav="/areas">
        {/* مسار التنقل */}
        <div style={{ background: '#f5efe1', borderBottom: '1px solid #e7decd' }}>
          <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto', padding: '12px 0' }}>
            <nav aria-label="مسار التنقل" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6d746a' }}>
              <Link href="/" style={{ color: '#17483e', textDecoration: 'none', fontWeight: 600 }}>الرئيسية</Link>
              <ChevronRight size={14} />
              <Link href="/areas" style={{ color: '#17483e', textDecoration: 'none', fontWeight: 600 }}>مناطق الكويت</Link>
              <ChevronRight size={14} />
              <span style={{ color: '#23483e', fontWeight: 700 }}>محافظة {governorate.nameAr}</span>
            </nav>
          </div>
        </div>

        {/* هيدر المحافظة */}
        <section style={{ background: '#17483e', color: '#f6f1e6', padding: '48px 0 38px', borderBottom: '3px solid #e9bd77' }}>
          <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
            <span className="eyebrow" style={{ color: '#d9c597' }}>
              <Building2 size={14} />
              {govSeo.heroKicker}
            </span>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', lineHeight: 1.25, margin: '10px 0 14px', fontWeight: 700 }}>
              {govSeo.h1}
            </h1>
            <p style={{ margin: 0, color: '#d2dfd7', fontSize: '15px', maxWidth: '750px', lineHeight: 1.9 }}>
              {governorate.descriptionAr} تضم المحافظة {governorate.areasCount} منطقة وضاحية سكنية واستثمارية، مع تواجد أمهر فنيي الصباغة والديكورات والمعجون الأصلي.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
              {govSeo.highlights.map((h, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    color: '#f6f1e6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={14} color="#e9bd77" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: '36px auto 80px' }}>
          
          {/* شبكة مناطق المحافظة الكاملة */}
          <section style={{ marginBottom: '46px' }}>
            <div className="section-head" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <div className="section-kicker">دليل مناطق {governorate.nameAr}</div>
                <h2>اختر منطقتك لعرض فنيي الصباغة والأسعار المخصصة</h2>
                <p className="section-caption">
                  اضغط على أي منطقة للانتقال لصفحتها المخصصة ومعرفة نصائح الرطوبة والتشطيب.
                </p>
              </div>

              {/* حقل بحث سريع داخل المحافظة */}
              <div style={{ minWidth: '240px' }}>
                <div className="search-field" style={{ background: '#fffdf8', border: '1px solid #dcd3c1', borderRadius: '12px', padding: '6px 12px' }}>
                  <Search size={16} />
                  <input
                    placeholder={`ابحث داخل ${governorate.nameAr}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: '12px', padding: '6px 0' }}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', padding: 0 }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {filteredAreas.map((item) => (
                <Link
                  key={item.id}
                  href={`/areas/${governorate.id}/${item.id}`}
                  style={{
                    background: '#fffdf8',
                    border: '1px solid #e4dccc',
                    borderRadius: '14px',
                    padding: '16px',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '100px',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:border-[#17483e] hover:shadow-md"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: '#17483e', display: 'block', marginBottom: '2px' }}>
                        صباغ {item.nameAr}
                      </strong>
                      <span style={{ fontSize: '11px', color: '#888f83' }}>{item.nameEn}</span>
                    </div>
                    {item.popularForPainting && (
                      <span style={{ background: '#faede8', color: '#c7664f', fontSize: '10px', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        شائع
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f2eee5', paddingTop: '10px', marginTop: '12px', fontSize: '11px', color: '#17483e', fontWeight: 600 }}>
                    <span>استعرض الفنيين والأسعار</span>
                    <ChevronRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* الفنيون المعتمدون في هذه المحافظة */}
          <section style={{ marginBottom: '46px' }}>
            <div className="section-head">
              <div>
                <div className="section-kicker">الفنيون المتاحون</div>
                <h2>أفضل فنيي ودهاني الصبغ في محافظة {governorate.nameAr}</h2>
                <p className="section-caption">جاهزون للمعاينة الفورية لكافة مناطق المحافظة.</p>
              </div>
            </div>

            <div className="directory-grid">
              {relevantPainters.map((painter) => (
                <article key={painter.id} className="painter-card">
                  <div className="card-top">
                    <Link href={`/painters/${encodeURIComponent(painter.slug || painter.name || painter.id)}`} className="painter-identity" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <PainterAvatar painter={painter} />
                      <div className="identity-copy">
                        <h3>{painter.name}</h3>
                        <span className="verified"><BadgeCheck aria-hidden="true" /> يغطي {governorate.nameAr}</span>
                      </div>
                    </Link>
                  </div>
                  <div className="card-meta">
                    <span className="meta-item"><Star fill="currentColor" aria-hidden="true" /><b className="rating-number">{painter.rating}</b></span>
                    <span className="meta-item"><MapPin aria-hidden="true" />{painter.region}</span>
                    <span className="meta-item"><Clock3 aria-hidden="true" />{painter.years} سنوات خبرة</span>
                  </div>
                  <p className="card-desc">{painter.description}</p>
                  <div className="card-tags">
                    {painter.services.map((s) => <span key={s} className="tag">{s}</span>)}
                  </div>
                  <div className="card-bottom">
                    <div>
                      <span className="price-label">يبدأ من</span>
                      <span className="price-value">{painter.startingAt} <small>للغرفة</small></span>
                    </div>
                    <div className="card-actions">
                      <a href={`tel:${painter.phone.replace(/\s+/g, '')}`} className="contact-button" style={{ textDecoration: 'none' }}>
                        اتصال
                      </a>
                      <a href={`https://wa.me/${painter.whatsapp}`} target="_blank" rel="noopener noreferrer" className="detail-button" style={{ textDecoration: 'none', color: '#1a7e44' }}>
                        واتساب
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* أسئلة شائعة للمحافظة */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', color: '#17483e', marginBottom: '16px' }}>
              الأسئلة الشائعة حول خدمات الصبغ في محافظة {governorate.nameAr}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {govFaqs.map((faq, idx) => (
                <div key={idx} style={{ background: '#fffdf8', border: '1px solid #e8e1d3', borderRadius: '12px', padding: '16px' }}>
                  <strong style={{ color: '#17483e', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                    س: {faq.question}
                  </strong>
                  <p style={{ margin: 0, color: '#5e685c', fontSize: '13px', lineHeight: 1.85 }}>
                    ج: {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* روابط المحافظات الأخرى */}
          <section style={{ background: '#f5efe1', borderRadius: '16px', padding: '22px' }}>
            <h3 style={{ fontSize: '15px', color: '#17483e', margin: '0 0 12px' }}>محافظات أخرى في دولة الكويت:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {KUWAIT_GOVERNORATES.filter((g) => g.id !== governorate.id).map((other) => (
                <Link
                  key={other.id}
                  href={`/areas/${other.id}`}
                  style={{
                    background: '#fffdf8',
                    border: '1px solid #d5cbb8',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    textDecoration: 'none',
                    color: '#20483d',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  صباغ محافظة {other.nameAr} ({other.areasCount} منطقة)
                </Link>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    );
  }

  // -------------------------------------------------------------
  // عرض الدليل العام لكافة مناطق الكويت (/areas Directory)
  // -------------------------------------------------------------
  const allFilteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    const matches: { area: Area; gov: Governorate }[] = [];
    for (const gov of KUWAIT_GOVERNORATES) {
      for (const a of gov.areas) {
        if (a.nameAr.toLowerCase().includes(q) || a.nameEn.toLowerCase().includes(q)) {
          matches.push({ area: a, gov });
        }
      }
    }
    return matches;
  }, [searchQuery]);

  return (
    <Layout activeNav="/areas">
      {/* مسار التنقل */}
      <div style={{ background: '#f5efe1', borderBottom: '1px solid #e7decd' }}>
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto', padding: '12px 0' }}>
          <nav aria-label="مسار التنقل" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6d746a' }}>
            <Link href="/" style={{ color: '#17483e', textDecoration: 'none', fontWeight: 600 }}>الرئيسية</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#23483e', fontWeight: 700 }}>دليل مناطق ومحافظات الكويت</span>
          </nav>
        </div>
      </div>

      {/* هيدر الدليل العام */}
      <section style={{ background: '#17483e', color: '#f6f1e6', padding: '52px 0 42px', borderBottom: '3px solid #e9bd77' }}>
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
          <span className="eyebrow" style={{ color: '#d9c597' }}>
            <Compass size={14} />
            تغطية شاملة لجميع مناطق ومحافظات الكويت
          </span>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', lineHeight: 1.25, margin: '12px 0 14px', fontWeight: 700 }}>
            دليل صباغين مناطق ومحافظات الكويت
          </h1>
          <p style={{ margin: 0, color: '#d2dfd7', fontSize: '15px', maxWidth: '720px', lineHeight: 1.9 }}>
            تصفح أمهر فنيي الصباغة والدهانات والديكورات بحسب محافظتك ومنطقتك. تغطية تشمل أكثر من 100 منطقة سكنية واستثمارية ومدن جديدة في الكويت بأسعار تبدأ من 15 د.ك ومعاينة مجانية.
          </p>

          {/* محرك البحث الفوري عن أي منطقة */}
          <div style={{ marginTop: '28px', maxWidth: '640px' }}>
            <div
              style={{
                background: '#fffdf8',
                borderRadius: '16px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            >
              <Search size={20} color="#17483e" />
              <input
                type="text"
                placeholder="ابحث عن منطقتك (مثال: الرميثية، المطلاع، السالمية، كيفان، صباح السالم...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px',
                  color: '#17483e',
                  padding: '10px 0',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#687063', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* نتائج البحث المباشر */}
            {searchQuery.trim() && (
              <div
                style={{
                  background: '#fffdf8',
                  borderRadius: '14px',
                  marginTop: '8px',
                  padding: '14px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                  maxHeight: '260px',
                  overflowY: 'auto',
                }}
              >
                {allFilteredAreas.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {allFilteredAreas.map(({ area: a, gov }) => (
                      <Link
                        key={a.id}
                        href={`/areas/${gov.id}/${a.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#f9f6ef',
                          textDecoration: 'none',
                          color: '#17483e',
                          fontSize: '13px',
                          fontWeight: 600,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={14} color="#c7664f" />
                          <span>صباغ {a.nameAr}</span>
                          <span style={{ fontSize: '11px', color: '#7a8277' }}>({gov.nameAr})</span>
                        </div>
                        <ChevronRight size={14} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '12px', color: '#747a70', textAlign: 'center', padding: '12px' }}>
                    لم نجد منطقة مطابقة للاسم "{searchQuery}". جرّب اسماً آخر أو تصفح المحافظات أدناه.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* شريط الإحصائيات العامة */}
      <section className="trust-strip">
        <div className="trust-inner">
          <span className="trust-note">
            <Building2 aria-hidden="true" />
            <strong>6 محافظات كويتية</strong> بتغطية كاملة
          </span>
          <span className="trust-note">
            <MapPin aria-hidden="true" />
            <strong>+100 منطقة وضاحية</strong> سكنية واستثمارية
          </span>
          <span className="trust-note">
            <ShieldCheck aria-hidden="true" />
            <strong>فنيون مفحوصون ومعتمدون</strong> مع كفالة
          </span>
          <span className="trust-note">
            <Calculator aria-hidden="true" />
            <strong>أسعار تبدأ من 15 د.ك</strong> للغرفة
          </span>
        </div>
      </section>

      <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: '40px auto 90px' }}>
        
        {/* بطاقات المحافظات الست */}
        <section style={{ marginBottom: '48px' }}>
          <div className="section-head">
            <div>
              <div className="section-kicker">تصفح بالمحافظة</div>
              <h2>محافظات دولة الكويت الست</h2>
              <p className="section-caption">اختر المحافظة لاستعراض كافة مناطقها وفنيي الصبغ العاملين بها.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {KUWAIT_GOVERNORATES.map((gov) => (
              <article
                key={gov.id}
                style={{
                  background: '#fffdf8',
                  border: '1px solid #e8e1d3',
                  borderRadius: '18px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(23,72,62,0.03)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                className="hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: '#f2eee5',
                          color: '#17483e',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <Building2 size={22} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#17483e' }}>محافظة {gov.nameAr}</h3>
                        <span style={{ fontSize: '11px', color: '#888f83' }}>{gov.nameEn} · العاصمة: {gov.capitalAr}</span>
                      </div>
                    </div>
                    <span style={{ background: '#e2efea', color: '#17483e', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>
                      {gov.areasCount} منطقة
                    </span>
                  </div>

                  <p style={{ color: '#5f675c', fontSize: '12px', lineHeight: 1.8, margin: '0 0 16px' }}>
                    {gov.descriptionAr}
                  </p>

                  {/* عينات من أشهر مناطق المحافظة */}
                  <div style={{ marginBottom: '18px' }}>
                    <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                      أبرز المناطق التابعة:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {gov.areas.slice(0, 5).map((a) => (
                        <Link
                          key={a.id}
                          href={`/areas/${gov.id}/${a.id}`}
                          style={{
                            background: '#f5efe1',
                            color: '#21453c',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          {a.nameAr.replace(/\s*\(.*?\)\s*/g, '')}
                        </Link>
                      ))}
                      {gov.areas.length > 5 && (
                        <span style={{ color: '#8a9488', fontSize: '10px', padding: '4px' }}>
                          +{gov.areas.length - 5} أخرى
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #eee7d9', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link
                    href={`/areas/${gov.id}`}
                    className="contact-button"
                    style={{ textDecoration: 'none', fontSize: '12px', padding: '8px 16px' }}
                  >
                    استعرض كافة مناطق {gov.nameAr}
                  </Link>
                  <span style={{ fontSize: '11px', color: '#7a8174' }}>تغطية فورية</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* شبكة سريعة لأكثر المناطق طلباً لخدمات الصبغ (Quick Long-tail Silo) */}
        <section
          style={{
            background: '#fffdf8',
            border: '1px solid #e8e1d3',
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '44px',
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700 }}>الكلمات الأكثر بحثاً</span>
            <h2 style={{ fontSize: '20px', color: '#17483e', margin: '4px 0' }}>
              المناطق الأكثر طلباً لخدمات الصبغ والتشطيب في الكويت
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6a7266' }}>
              روابط مباشرة لصفحات المناطق ذات الإقبال الكثيف على تشطيب الفلل والشقق والقسائم الجديدة:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {POPULAR_AREAS_SUMMARY.map((name) => {
              // العثور على المنطقة لمعرفة رابطها
              const found = findAreaById(
                name.includes('المطلاع') ? 'al-mutlaa'
                : name.includes('السالمية') ? 'al-salmiya'
                : name.includes('حولي') ? 'hawalli-city'
                : name.includes('الجابرية') ? 'al-jabriya'
                : name.includes('جنوب السرة') ? 'dhaher-al-surra'
                : name.includes('الفروانية') ? 'farwaniyah-city'
                : name.includes('خيطان') ? 'khaitan'
                : name.includes('إشبيلية') ? 'ishbiliya'
                : name.includes('عبد الله المبارك') ? 'west-abdullah-al-mubarak'
                : name.includes('صباح السالم') ? 'sabah-al-salem'
                : name.includes('القرين') ? 'al-qurain'
                : name.includes('أبو فطيرة') ? 'abu-ftaira'
                : name.includes('الفنيطيس') ? 'al-fnaitees'
                : name.includes('العقيلة') ? 'al-egaila'
                : name.includes('الفنطاس') ? 'al-fintas'
                : name.includes('المهبولة') ? 'mahboula'
                : name.includes('صباح الأحمد') ? 'sabah-al-ahmad-residential'
                : name.includes('كيفان') ? 'kaifan'
                : name.includes('الروضة') ? 'al-rawda'
                : name.includes('جابر الأحمد') ? 'jaber-al-ahmad'
                : name.includes('سعد العبد الله') ? 'saad-al-abdullah'
                : 'al-salmiya'
              );

              const targetHref = found
                ? `/areas/${found.governorate.id}/${found.area.id}`
                : `/areas`;

              return (
                <Link
                  key={name}
                  href={targetHref}
                  style={{
                    background: '#f9f6ef',
                    border: '1px solid #e5dcce',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    textDecoration: 'none',
                    color: '#17483e',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className="hover:border-[#17483e] hover:bg-[#fffdf8]"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="#c7664f" />
                    <span>صباغ {name}</span>
                  </div>
                  <ChevronRight size={13} color="#99a093" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* أسئلة عامة عن صباغين الكويت */}
        <section
          style={{
            background: '#fffdf8',
            border: '1px solid #e8e1d3',
            borderRadius: '20px',
            padding: '28px',
          }}
        >
          <h2 style={{ fontSize: '20px', color: '#17483e', margin: '0 0 16px' }}>
            أسئلة شائعة حول خدمات الصبغ والمناطق في دولة الكويت
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ borderBottom: '1px solid #eee7d9', paddingBottom: '12px' }}>
              <strong style={{ color: '#17483e', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                س: هل يغطي الصباغون كافة محافظات الكويت أم محافظات محددة؟
              </strong>
              <p style={{ margin: 0, color: '#5f675c', fontSize: '13px', lineHeight: 1.8 }}>
                ج: يمتلك معظم المقاولين والورش المعتمدة في دليلنا فرق عمل موزعة على كافة المحافظات (العاصمة، حولي، الفروانية، الأحمدي، مبارك الكبير، والجهراء)، مما يضمن وصول الفني لمعاينة منزلك خلال ساعات قليلة وبدون رسوم إضافية على الانتقال.
              </p>
            </div>
            <div style={{ borderBottom: '1px solid #eee7d9', paddingBottom: '12px' }}>
              <strong style={{ color: '#17483e', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                س: كيف يتم التعامل مع خصوصية كل منطقة (المناطق الساحلية مقابل المدن الصحراوية الجديدة)؟
              </strong>
              <p style={{ margin: 0, color: '#5f675c', fontSize: '13px', lineHeight: 1.8 }}>
                ج: يختار الفني المواد الملائمة لكل بيئة؛ ففي المناطق الساحلية (مثل السالمية والفنطاس والخيران) يتم استخدام أصباغ مقاومة للأملاح والرطوبة وبرايمر عازل، بينما في المدن الجديدة (مثل المطلاع وصباح الأحمد) يتم التركيز على معالجة قلوية المسّاح الأسمنتي وسحب معجون عالي التماسك لواجهات السيجما العاكسة للشمس.
              </p>
            </div>
            <div>
              <strong style={{ color: '#17483e', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                س: كيف أحصل على معاينة فورية وعرض سعر دقيق؟
              </strong>
              <p style={{ margin: 0, color: '#5f675c', fontSize: '13px', lineHeight: 1.8 }}>
                ج: يمكنك الضغط على منطقتك في هذا الدليل، واختيار أحد الفنيين والاتصال به مباشرة أو عبر الواتساب لتنسيق موعد مناسب لك، أو استخدام حاسبة تكلفة الصبغ التلقائية في الموقع.
              </p>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
