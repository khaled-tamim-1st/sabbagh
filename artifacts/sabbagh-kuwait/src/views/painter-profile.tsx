'use client';

import { useState, useEffect, useMemo } from 'react';
import { Link, useRoute } from '@/lib/nav';
import {
  BadgeCheck, Clock3, MapPin, Star, Phone, MessageCircle,
  ShieldCheck, ChevronRight, Layers,
  Sparkles, CheckCircle2, UserCheck, AlertCircle, X,
  Building, Check, ThumbsUp, Maximize2, Image as ImageIcon, AlertTriangle
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PainterAvatar } from '@/components/painter-avatar';
import { getPainterById, getPainterCoverageDetails, PAINTERS_DATA, type Painter, type PortfolioProject, type PortfolioImage } from '@/data/painters';
import { catalogStore } from '@/lib/catalog-store';
import { apiClient } from '@/lib/api-client';

export default function PainterProfilePage({ id: propId }: { id?: number | string }) {
  const [, idParams] = useRoute('/painters/:id');
  const [, slugParams] = useRoute('/painters/:slug');
  const rawIdentifier = propId || slugParams?.slug || idParams?.id || 1;
  const decodedIdentifier = typeof rawIdentifier === 'string' ? decodeURIComponent(rawIdentifier) : rawIdentifier;
  const [painter, setPainter] = useState<Painter>(() => catalogStore.getPainterById(decodedIdentifier) || getPainterById(decodedIdentifier) || PAINTERS_DATA[0]);

  useEffect(() => {
    const updated = catalogStore.getPainterById(decodedIdentifier);
    if (updated) setPainter(updated);

    const unsubscribe = catalogStore.subscribe(() => {
      const refreshed = catalogStore.getPainterById(decodedIdentifier);
      if (refreshed) setPainter(refreshed);
    });

    const fetchTarget = encodeURIComponent(String(decodedIdentifier));
    apiClient.get<any>(`/public/painters/${fetchTarget}`)
      .then((data) => {
        if (data && data.name) {
          const reviewCount = typeof data.reviews === 'number'
            ? data.reviews
            : (Array.isArray(data.reviews) ? data.reviews.length : (Array.isArray(data.customerReviews) ? data.customerReviews.length : 0));

          const customerReviewsList = Array.isArray(data.customerReviews)
            ? data.customerReviews
            : (Array.isArray(data.reviews) ? data.reviews : []);

          setPainter((prev) => ({
            ...prev,
            ...data,
            name: data.name || prev.name,
            phone: data.phone || prev.phone,
            whatsapp: data.whatsapp || data.phone || prev.whatsapp,
            bio: data.bio || data.description || prev.bio,
            reviews: reviewCount || prev.reviews,
            customerReviews: customerReviewsList.length > 0 ? customerReviewsList : (prev.customerReviews || []),
            pricingList: Array.isArray(data.pricingList) && data.pricingList.length > 0 ? data.pricingList : (prev.pricingList || []),
            gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : (prev.gallery || []),
            portfolioProjects: Array.isArray(data.portfolioProjects) ? data.portfolioProjects : (prev.portfolioProjects || []),
            avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : (data.avatar || prev.avatarUrl),
          }));
        }
      })
      .catch(() => {
        // Fallback to local cached painter
      });

    return unsubscribe;
  }, [decodedIdentifier]);

  const painterApprovedReviews = useMemo(() => {
    const fromStore = catalogStore.getApprovedReviewsForPainter(painter.id);
    if (fromStore.length > 0) return fromStore;
    return (painter.customerReviews || []).filter((r: any) => (r.status || 'approved') === 'approved');
  }, [painter.id, painter.customerReviews]);

  const coverageGroups = getPainterCoverageDetails(painter);

  const [activeTab, setActiveTab] = useState<'gallery' | 'pricing' | 'reviews' | 'coverage' | 'about'>('gallery');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(painter.gallery?.[0] || null);
  const [viewMode, setViewMode] = useState<'after' | 'before'>('after');

  // Before & After Switcher state for portfolio projects
  const [baViewModes, setBaViewModes] = useState<Record<string, 'after' | 'before'>>({});
  // Standard gallery active thumbnail selection
  const [activeStandardThumbs, setActiveStandardThumbs] = useState<Record<string, number>>({});
  // Lightbox Modal state for full-res WebP viewing
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; title: string; caption?: string } | null>(null);

  // حالة نافذة إضافة التقييم الموثق
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [revRating, setRevRating] = useState(5);
  const [revAuthor, setRevAuthor] = useState('');
  const [revWhatsapp, setRevWhatsapp] = useState('');
  const [revArea, setRevArea] = useState(painter.region || 'الكويت');
  const [revServiceType, setRevServiceType] = useState('دهان داخلي ومعجون');
  const [revComment, setRevComment] = useState('');
  const [revLoading, setRevLoading] = useState(false);
  const [revSubmitted, setRevSubmitted] = useState(false);
  const [revError, setRevError] = useState<string | null>(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revWhatsapp.trim() || !revComment.trim()) return;

    setRevError(null);
    setRevLoading(true);
    try {
      await apiClient.post(`/public/painters/${painter.id}/reviews`, {
        author: revAuthor.trim(),
        whatsapp: revWhatsapp.trim(),
        rating: revRating,
        area: revArea,
        serviceType: revServiceType,
        comment: revComment.trim(),
      });
      setRevSubmitted(true);
    } catch (err: any) {
      console.error('Review submission error:', err);
      setRevError(err?.message || 'تعذر إرسال التقييم حالياً، يرجى التحقق من اتصال الإنترنت والمحاولة مجدداً.');
    } finally {
      setRevLoading(false);
    }
  };

  const cleanPhone = (painter.phone || '').replace(/[^\d+]/g, '');
  const cleanWhatsapp = (painter.whatsapp || painter.phone || '').replace(/[^\d]/g, '');
  const prefill = painter.whatsappPrefill || `السلام عليكم معلم ${painter.name}، اطلعت على سابقة أعمالك في منصة صباغ الكويت وأود الاتفاق على موعد معاينة.`;
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(prefill)}`;
  const telUrl = `tel:${cleanPhone}`;

  if (painter.status === 'suspended') {
    return (
      <Layout activeNav="/painters">
        <div
          dir="rtl"
          style={{
            maxWidth: '760px',
            margin: '60px auto',
            padding: '48px 24px',
            textAlign: 'center',
            background: '#fffdfa',
            borderRadius: '24px',
            border: '1px solid #ebdcc5',
            boxShadow: '0 12px 36px rgba(23,72,62,0.06)',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#fef2f2',
              border: '2px solid #fecaca',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            <AlertTriangle size={34} color="#dc2626" />
          </div>
          <h1
            style={{
              fontSize: '24px',
              color: '#17483e',
              fontWeight: 800,
              margin: '0 0 14px',
            }}
          >
            هذا الحساب موقوف مؤقتاً للمراجعة
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#606c62',
              lineHeight: 1.8,
              maxWidth: '520px',
              margin: '0 auto 28px',
            }}
          >
            تم إيقاف ملف الفني ({painter.name}) مؤقتاً من قبل إدارة المنصة لإجراء التحديثات والمراجعة الإدارية الدورية. لا تتوفر أرقام التواصل أو طلبات المعاينة لهذا الحساب في الوقت الحالي.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 30px',
              borderRadius: '12px',
              background: '#17483e',
              color: '#f5efdf',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            <span>العودة لدليل الصباغين المعتمدين</span>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeNav="/painters">
      {/* مسار التنقل (Breadcrumbs) المتوافق مع معايير السيو و Schema.org */}
      <Breadcrumbs
        items={[
          { label: 'دليل الصباغين', href: '/#directory' },
          { label: `صباغ ${painter.region}`, href: `/?region=${encodeURIComponent(painter.region)}#directory` },
          { label: painter.name, isCurrent: true },
        ]}
      />

      <div className="profile-container">
        
        {/* هيدر البروفايل الرئيسي */}
        <section className="profile-hero-card">
          <div className="profile-header-main">
            
            {/* بيانات الصباغ */}
            <div className="profile-identity-row" style={{ flex: 1, minWidth: 0 }}>
              <PainterAvatar
                painter={painter}
                size={76}
                style={{
                  borderRadius: '20px 20px 20px 6px',
                  border: '2.5px solid #e9bd77',
                  boxShadow: '0 4px 14px rgba(23,72,62,0.12)',
                  flexShrink: 0,
                }}
              />

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 26px)', color: '#1d4038', fontWeight: 800 }}>{painter.name}</h1>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#e7f0e7',
                      color: '#285e42',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '999px',
                    }}
                  >
                    <BadgeCheck size={13} /> ملف موثّق ومفحوص
                  </span>

                  {painter.isAvailableToday ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#e6f4ea',
                        color: '#137333',
                        border: '1px solid #b7dfc6',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        boxShadow: '0 2px 6px rgba(19,115,51,0.08)',
                      }}
                      data-testid="badge-available-today"
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: '#137333',
                          display: 'inline-block',
                          boxShadow: '0 0 0 2px rgba(19,115,51,0.25)',
                        }}
                      />
                      <span>متاح اليوم للمعاينة الفورية</span>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#2b7d48' }}>({painter.responseTime})</span>
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#f5efe3',
                        color: '#7a6039',
                        border: '1px solid #e5dac4',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: '999px',
                      }}
                    >
                      <Clock3 size={12} />
                      <span>الحجز متاح للأيام القادمة</span>
                      <span style={{ fontSize: '10px', opacity: 0.85 }}>({painter.responseTime})</span>
                    </span>
                  )}
                </div>

                <p style={{ margin: '8px 0 10px', color: '#6d746a', fontSize: '13px', lineHeight: 1.7, maxWidth: '580px' }}>
                  {painter.description}
                </p>

                {/* شبكة المؤشرات السريعة المحسنة للهواتف وشاشات الكمبيوتر */}
                <div className="profile-metrics-grid">
                  <div className="profile-metric-card">
                    <span className="metric-label">
                      <Star size={13} fill="#e9bd77" color="#e9bd77" /> التقييم العام
                    </span>
                    <span className="metric-val" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{painter.rating}</span>
                      <span style={{ fontSize: '10px', fontWeight: 500, color: '#7a7e74' }}>
                        ({painterApprovedReviews.length} تقييم)
                      </span>
                    </span>
                  </div>

                  <div className="profile-metric-card">
                    <span className="metric-label">
                      <Clock3 size={13} color="#b08d53" /> سرعة الرد
                    </span>
                    <span className="metric-val">{painter.responseTime}</span>
                  </div>

                  <div className="profile-metric-card">
                    <span className="metric-label">
                      <Sparkles size={13} color="#b08d53" /> سنوات الخبرة
                    </span>
                    <span className="metric-val">{painter.years} سنوات عمل</span>
                  </div>

                  <div className="profile-metric-card">
                    <span className="metric-label">
                      <ShieldCheck size={13} color="#4b8064" /> ضمان العمل
                    </span>
                    <span className="metric-val">{painter.warrantyYears} سنوات ضد التقشير</span>
                  </div>

                  <div className="profile-metric-card">
                    <span className="metric-label">
                      <MapPin size={13} color="#b08d53" /> التواجد الميداني
                    </span>
                    <span className="metric-val">{painter.region}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* بطاقة السعر وزر المعاينة السريع */}
            <div className="profile-price-card">
              <span style={{ fontSize: '11px', color: '#7a7c72', display: 'block', marginBottom: '4px' }}>السعر الاسترشادي</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#17483e' }}>
                {painter.startingAt} <span style={{ fontSize: '13px', fontWeight: 500, color: '#6d746a' }}>/ للغرفة</span>
              </div>
              <p style={{ fontSize: '11px', color: '#888b7d', margin: '4px 0 14px' }}>يعتمد السعر النهائي على المعاينة ومساحة الحوائط</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-button"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#25D366',
                    borderColor: '#25D366',
                    color: '#fff',
                    fontWeight: 700,
                    textDecoration: 'none',
                    minHeight: '44px',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                  }}
                >
                  <MessageCircle size={18} fill="currentColor" />
                  <span>تواصل عبر واتساب</span>
                </a>

                <a
                  href={telUrl}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#17483e',
                    color: '#e9bd77',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    minHeight: '42px',
                    border: '1px solid #17483e',
                  }}
                >
                  <Phone size={15} />
                  <span>اتصال: <strong dir="ltr">{painter.phone}</strong></span>
                </a>
              </div>
            </div>
          </div>

          {/* تغطية المحافظات والخدمات */}
          <div style={{ borderTop: '1px solid #eee8dd', marginTop: '20px', paddingTop: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#23483e' }}>المحافظات المشمولة:</span>
              {painter.governorates.map((gov) => (
                <span key={gov} className="tag" style={{ background: '#f2eee5', color: '#17483e', fontWeight: 600 }}>
                  {gov}
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('coverage');
                  document.getElementById('profile-tabs-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '11px',
                  color: '#17483e',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  marginRight: '6px',
                  cursor: 'pointer',
                }}
              >
                (عرض كافة المناطق المخدومة: {painter.coverageAreaIds.length} منطقة)
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#23483e' }}>الخدمات المقدمة:</span>
              {painter.services.map((srv) => (
                <span key={srv} className="tag" style={{ background: '#e8bb7420', color: '#80552b', fontWeight: 600 }}>
                  {srv}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* أزرار التبويبات (Tabs) المتجاوبة */}
        <div id="profile-tabs-anchor" style={{ scrollMarginTop: '80px' }} />
        <div className="filters" style={{ borderBottom: '1px solid #e0d7c7', paddingBottom: '12px', marginBottom: '24px' }}>
          <button
            type="button"
            className={`filter-chip${activeTab === 'gallery' ? ' active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Sparkles size={14} style={{ display: 'inline', marginLeft: '6px' }} />
            معرض الأعمال (قبل وبعد)
          </button>
          
          <button
            type="button"
            className={`filter-chip${activeTab === 'pricing' ? ' active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            قائمة الأسعار التقديرية
          </button>

          <button
            type="button"
            className={`filter-chip${activeTab === 'reviews' ? ' active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            التقييمات وآراء العملاء ({painterApprovedReviews.length})
          </button>

          <button
            type="button"
            className={`filter-chip${activeTab === 'coverage' ? ' active' : ''}`}
            onClick={() => setActiveTab('coverage')}
          >
            <MapPin size={14} style={{ display: 'inline', marginLeft: '6px' }} />
            المناطق المخدومة ({painter.coverageAreaIds.length})
          </button>

          <button
            type="button"
            className={`filter-chip${activeTab === 'about' ? ' active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            عن الورشة والمواد
          </button>
        </div>

        {/* محتوى التبويب 1: معرض الأعمال (Before & After وبورتفوليو المشاريع) */}
        {activeTab === 'gallery' && (
          <div>
            <div style={{ marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#1d4038', margin: '0 0 6px', fontWeight: 800 }}>
                  معرض الأعمال وسابقة المشاريع (WebP)
                </h2>
                <p style={{ fontSize: '13px', color: '#72776d', margin: 0 }}>
                  شاهد تشطيبات {painter.name} ومقارنات (قبل وبعد) لتجديد جدران منازل وفلل الكويت بجودة عالية وصور مضغوطة وسريعة.
                </p>
              </div>

              <span
                style={{
                  background: 'rgba(23,72,62,0.08)',
                  color: '#17483e',
                  border: '1px solid #c2d6cc',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Sparkles size={12} color="#17483e" />
                <span>صور WebP عالية الدقة وسريعة التحميل</span>
              </span>
            </div>

            {/* Check if painter has portfolioProjects */}
            {painter.portfolioProjects && painter.portfolioProjects.length > 0 ? (
              <div className="portfolio-responsive-grid">
                {painter.portfolioProjects.map((project) => {
                  const isBeforeAfter = project.displayMode === 'before_after';
                  const currentMode = baViewModes[project.id] || 'after';
                  const activeThumbIdx = activeStandardThumbs[project.id] || 0;
                  const currentStandardImg = project.galleryImages?.[activeThumbIdx] || project.galleryImages?.[0];

                  return (
                    <div
                      key={project.id}
                      style={{
                        background: '#fffdf8',
                        border: '1px solid #e8e1d3',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Before / After Mode Card */}
                      {isBeforeAfter ? (
                        <div>
                          {/* Image Display Area with Switcher */}
                          <div style={{ position: 'relative', height: '260px', background: '#ece3d3', overflow: 'hidden' }}>
                            {currentMode === 'after' ? (
                              project.afterImage?.url ? (
                                <img
                                  src={project.afterImage.url}
                                  alt="بعد التشطيب"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#888' }}>
                                  صورة بعد التشطيب
                                </div>
                              )
                            ) : (
                              project.beforeImage?.url ? (
                                <img
                                  src={project.beforeImage.url}
                                  alt="قبل العمل"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#888' }}>
                                  صورة قبل العمل
                                </div>
                              )
                            )}

                            {/* Mode indicator badge on top-right */}
                            <span
                              style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: currentMode === 'after' ? 'rgba(23, 72, 62, 0.92)' : 'rgba(199, 102, 79, 0.92)',
                                color: currentMode === 'after' ? '#e9bd77' : '#fff',
                                padding: '4px 12px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: 800,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              }}
                            >
                              {currentMode === 'after' ? 'النتيجة النهائية (بعد)' : 'الحالة السابقة (قبل)'}
                            </span>

                            {/* Enlarge button */}
                            {(currentMode === 'after' ? project.afterImage?.url : project.beforeImage?.url) && (
                              <button
                                type="button"
                                onClick={() => {
                                  const img = currentMode === 'after' ? project.afterImage : project.beforeImage;
                                  if (img?.url) {
                                    setActiveLightboxImage({
                                      url: img.url,
                                      title: `${project.title} (${currentMode === 'after' ? 'بعد' : 'قبل'})`,
                                      caption: img.caption || (currentMode === 'after' ? project.afterDetails : project.beforeDetails),
                                    });
                                  }
                                }}
                                style={{
                                  position: 'absolute',
                                  top: '12px',
                                  left: '12px',
                                  background: 'rgba(0,0,0,0.65)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '6px 10px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Maximize2 size={13} />
                                <span>تكبير</span>
                              </button>
                            )}

                            {/* Bottom switcher buttons bar */}
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '10px',
                                right: '10px',
                                display: 'flex',
                                gap: '6px',
                                background: 'rgba(0,0,0,0.52)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                padding: '5px',
                                borderRadius: '12px',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setBaViewModes((prev) => ({ ...prev, [project.id]: 'after' }))}
                                style={{
                                  flex: 1,
                                  padding: '7px 8px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: currentMode === 'after' ? '#17483e' : 'rgba(255,255,255,0.22)',
                                  color: currentMode === 'after' ? '#e9bd77' : '#fff',
                                  fontWeight: 700,
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                بعد التشطيب
                              </button>

                              <button
                                type="button"
                                onClick={() => setBaViewModes((prev) => ({ ...prev, [project.id]: 'before' }))}
                                style={{
                                  flex: 1,
                                  padding: '7px 8px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: currentMode === 'before' ? '#c7664f' : 'rgba(255,255,255,0.22)',
                                  color: currentMode === 'before' ? '#fff' : '#fff',
                                  fontWeight: 700,
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                قبل العمل
                              </button>
                            </div>
                          </div>

                          {/* Details Content */}
                          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="tag" style={{ background: '#17483e', color: '#fff9ee', fontWeight: 600 }}>
                                {project.category}
                              </span>
                              {project.area && (
                                <span style={{ fontSize: '11px', color: '#7a8074' }}>
                                  {project.area}
                                </span>
                              )}
                            </div>

                            <h3 style={{ fontSize: '17px', color: '#23483e', margin: 0, fontWeight: 800 }}>
                              {project.title}
                            </h3>

                            {project.description && (
                              <p style={{ fontSize: '12px', color: '#6d746a', lineHeight: 1.8, margin: 0 }}>
                                {project.description}
                              </p>
                            )}

                            {/* Before / After Details Card */}
                            <div
                              style={{
                                background: currentMode === 'after' ? '#eef6f1' : '#fbeefb',
                                borderRight: `4px solid ${currentMode === 'after' ? '#17483e' : '#c7664f'}`,
                                borderRadius: '10px',
                                padding: '12px 14px',
                                fontSize: '12px',
                                color: currentMode === 'after' ? '#1b4a3f' : '#884332',
                              }}
                            >
                              <strong style={{ display: 'block', marginBottom: '4px' }}>
                                {currentMode === 'after' ? 'التشطيب والإنجاز النهائي:' : 'حالة الطوفة قبل العمل:'}
                              </strong>
                              {currentMode === 'after'
                                ? project.afterDetails || 'تم إنجاز الصبغ والمعالجة بأعلى المعايير.'
                                : project.beforeDetails || 'كانت الجدران تعاني من تقشرات وعيوب سابقة.'}
                            </div>

                            {project.materialsUsed && (
                              <div style={{ fontSize: '11px', color: '#5b6357', background: '#f8f5ee', padding: '8px 12px', borderRadius: '8px' }}>
                                <strong style={{ color: '#17483e' }}>المواد المستخدمة:</strong> {project.materialsUsed}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        // Standard Mode Multi-photo Showcase
                        <div>
                          {/* Main Image Preview */}
                          <div
                            style={{
                              position: 'relative',
                              height: '240px',
                              background: '#ece3d3',
                              overflow: 'hidden',
                              cursor: currentStandardImg?.url ? 'pointer' : 'default',
                            }}
                            onClick={() => {
                              if (currentStandardImg?.url) {
                                setActiveLightboxImage({
                                  url: currentStandardImg.url,
                                  title: project.title,
                                  caption: currentStandardImg.caption || project.description,
                                });
                              }
                            }}
                          >
                            {currentStandardImg?.url ? (
                              <img
                                src={currentStandardImg.url}
                                alt={project.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#888' }}>
                                لا توجد صور
                              </div>
                            )}

                            {/* Badge */}
                            <span
                              style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: '#17483e',
                                color: '#fff9ee',
                                padding: '4px 10px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              معرض صور المشروع
                            </span>

                            {currentStandardImg?.url && (
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: '12px',
                                  left: '12px',
                                  background: 'rgba(0,0,0,0.65)',
                                  color: '#fff',
                                  padding: '4px 10px',
                                  borderRadius: '8px',
                                  fontSize: '11px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Maximize2 size={12} />
                                <span>تكبير بالحجم الكامل</span>
                              </span>
                            )}
                          </div>

                          {/* Thumbnail Gallery Row */}
                          {project.galleryImages && project.galleryImages.length > 1 && (
                            <div
                              style={{
                                display: 'flex',
                                gap: '8px',
                                padding: '10px 14px',
                                background: '#f5efe3',
                                overflowX: 'auto',
                                borderBottom: '1px solid #e7ded0',
                              }}
                            >
                              {project.galleryImages.map((img, idx) => (
                                <button
                                  key={img.id || idx}
                                  type="button"
                                  onClick={() => setActiveStandardThumbs((prev) => ({ ...prev, [project.id]: idx }))}
                                  style={{
                                    width: '54px',
                                    height: '54px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '2px solid',
                                    borderColor: activeThumbIdx === idx ? '#17483e' : 'transparent',
                                    opacity: activeThumbIdx === idx ? 1 : 0.65,
                                    cursor: 'pointer',
                                    padding: 0,
                                    flexShrink: 0,
                                    background: '#ddd',
                                  }}
                                >
                                  <img src={img.url} alt="مصغرة" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Project Details */}
                          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="tag" style={{ background: '#17483e', color: '#fff9ee', fontWeight: 600 }}>
                                {project.category}
                              </span>
                              {project.area && (
                                <span style={{ fontSize: '11px', color: '#7a8074' }}>
                                  {project.area}
                                </span>
                              )}
                            </div>

                            <h3 style={{ fontSize: '17px', color: '#23483e', margin: 0, fontWeight: 800 }}>
                              {project.title}
                            </h3>

                            {project.description && (
                              <p style={{ fontSize: '12px', color: '#6d746a', lineHeight: 1.8, margin: 0 }}>
                                {project.description}
                              </p>
                            )}

                            {project.materialsUsed && (
                              <div style={{ fontSize: '11px', color: '#5b6357', background: '#f8f5ee', padding: '8px 12px', borderRadius: '8px', marginTop: '6px' }}>
                                <strong style={{ color: '#17483e' }}>المواد المستخدمة:</strong> {project.materialsUsed}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (painter.gallery && painter.gallery.length > 0) ? (
              // Fallback to legacy painter.gallery
              <div className="portfolio-responsive-grid">
                {painter.gallery.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#fffdf8',
                      border: '1px solid #e8e1d3',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="tag" style={{ background: '#17483e', color: '#fff9ee', fontWeight: 600 }}>{item.category}</span>
                      <span style={{ fontSize: '11px', color: '#888b7d' }}>مشروع موثّق</span>
                    </div>

                    <h3 style={{ fontSize: '16px', color: '#23483e', margin: '0 0 10px' }}>{item.title}</h3>
                    <p style={{ fontSize: '12px', color: '#6d746a', lineHeight: 1.8, marginBottom: '16px' }}>{item.description}</p>

                    {/* بطاقة المقارنة التفاعلية قبل وبعد */}
                    <div
                      style={{
                        background: '#f4ede0',
                        borderRadius: '12px',
                        padding: '14px',
                        border: '1px solid #e2d7c5',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <button
                          type="button"
                          onClick={() => { setSelectedGalleryItem(item); setViewMode('after'); }}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            border: 'none',
                            background: (selectedGalleryItem?.id === item.id ? viewMode === 'after' : true) ? '#17483e' : '#e6ddcc',
                            color: (selectedGalleryItem?.id === item.id ? viewMode === 'after' : true) ? '#fff' : '#555',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          النتيجة النهائية (بعد)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedGalleryItem(item); setViewMode('before'); }}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            border: 'none',
                            background: (selectedGalleryItem?.id === item.id && viewMode === 'before') ? '#c7664f' : '#e6ddcc',
                            color: (selectedGalleryItem?.id === item.id && viewMode === 'before') ? '#fff' : '#555',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          الحالة السابقة (قبل)
                        </button>
                      </div>

                      <div style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {(selectedGalleryItem?.id === item.id && viewMode === 'before') ? (
                          <div style={{ fontSize: '12px', color: '#884332', background: '#fbeefb', padding: '10px', borderRadius: '8px', borderRight: '3px solid #c7664f' }}>
                            <strong style={{ display: 'block', marginBottom: '4px' }}>حالة الطوفة قبل العمل:</strong>
                            {item.beforeDetails}
                          </div>
                        ) : (
                          <div style={{ fontSize: '12px', color: '#215045', background: '#eaf4ee', padding: '10px', borderRadius: '8px', borderRight: '3px solid #17483e' }}>
                            <strong style={{ display: 'block', marginBottom: '4px' }}>التشطيب والإنجاز النهائي:</strong>
                            {item.afterDetails}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: '#5b6357', background: '#f8f5ee', padding: '8px 12px', borderRadius: '8px' }}>
                      <strong style={{ color: '#17483e' }}>المواد المستخدمة:</strong> {item.materialsUsed}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: '#fffdf8',
                  border: '2px dashed #ded4c3',
                  borderRadius: '18px',
                  padding: '50px 20px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: '#eef5f1',
                    color: '#17483e',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <ImageIcon size={28} />
                </div>
                <h3 style={{ fontSize: '18px', color: '#17483e', margin: '0 0 8px', fontWeight: 800 }}>
                  معرض الأعمال قيد الإضافة
                </h3>
                <p style={{ fontSize: '13px', color: '#687266', maxWidth: '480px', margin: '0 auto 18px', lineHeight: 1.8 }}>
                  يقوم الصباغ حالياً بتوثيق وإضافة صور مشاريعه وأعماله المنجزة. يمكنك التواصل معه مباشرة عبر الواتساب أو الهاتف للاستفسار أو طلب معاينة ميدانية فورية.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#25D366',
                    color: '#ffffff',
                    padding: '10px 22px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                  }}
                >
                  <MessageCircle size={16} />
                  <span>تواصل عبر واتساب لطلب صور أعمال</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* محتوى التبويب 2: قائمة الأسعار */}
        {activeTab === 'pricing' && (
          <div style={{ background: '#fffdf8', border: '1px solid #e8e1d3', borderRadius: '16px', padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', color: '#1d4038', margin: '0 0 6px' }}>قائمة الأسعار التقديرية (دينار كويتي KWD)</h2>
              <p style={{ fontSize: '13px', color: '#72776d', margin: 0 }}>
                هذه الأسعار إرشادية وتخضع للمعاينة الميدانية المجانية وتفاصيل الجدران (هل تحتاج معجون تأسيسي أو معالجة نش ورطوبة).
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {painter.pricingList.map((price, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: idx % 2 === 0 ? '#f9f6ef' : '#fff',
                    border: '1px solid #eee8dc',
                    gap: '10px',
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <strong style={{ fontSize: '14px', color: '#23483e', display: 'block', marginBottom: '4px' }}>{price.item}</strong>
                    <span style={{ fontSize: '12px', color: '#7a7e74' }}>{price.note}</span>
                  </div>
                  <div style={{ textAlign: 'left', minWidth: '130px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#17483e' }}>{price.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', padding: '14px', background: '#f5eee1', borderRadius: '10px', fontSize: '12px', color: '#686f63' }}>
              <strong>ملاحظة من فريق صباغ الكويت:</strong> ينصح دائماً بطلب معاينة ميدانية مسبقة لتحديد كمية المعجون وأمتار الصبغ المطلوبة والتفاهم على نوعية الصبغ (مطفي، ربع لمعة، أو نص لمعة).
            </div>
          </div>
        )}

        {/* محتوى التبويب 3: التقييمات */}
        {activeTab === 'reviews' && (
          <div style={{ background: '#fffdf8', border: '1px solid #e8e1d3', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#1d4038', margin: '0 0 6px' }}>تقييمات وآراء العملاء</h2>
                <p style={{ fontSize: '13px', color: '#72776d', margin: 0 }}>مراجعات حقيقية من سكان الكويت تعاملوا مع ورشة {painter.name}.</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f3efe5', padding: '10px 18px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 800, color: '#17483e' }}>{painter.rating}</span>
                  <div>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#e9bd77" color="#e9bd77" />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: '#74776d' }}>بناءً على {painterApprovedReviews.length} تقييماً موثقاً</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setReviewModalOpen(true); setRevSubmitted(false); }}
                  style={{
                    background: '#17483e',
                    color: '#fff9ee',
                    border: '1px solid #e9bd77',
                    padding: '11px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(23,72,62,0.18)',
                  }}
                >
                  <Sparkles size={16} color="#e9bd77" />
                  <span>أضف تقييمك وتجربتك</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {painterApprovedReviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    border: '1px solid #eee8dc',
                    background: '#fffdf9',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '14px', color: '#23483e' }}>{rev.author}</strong>
                      <span className="tag" style={{ background: '#f0ece2', fontSize: '10px' }}>{rev.area}</span>
                      <span className="tag" style={{ background: '#eaf4ee', color: '#26573e', fontSize: '10px' }}>{rev.serviceType}</span>
                      {rev.verified && (
                        <span style={{ fontSize: '11px', color: '#2b7d48', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                          <BadgeCheck size={13} /> موثّق عبر واتساب
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: '#979a8e' }}>{rev.date}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="#e9bd77" color="#e9bd77" />
                    ))}
                  </div>

                  <p style={{ fontSize: '13px', color: '#555e54', lineHeight: 1.8, margin: 0 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* محتوى التبويب: المحافظات والمناطق المخدومة والتواجد الميداني */}
        {activeTab === 'coverage' && (
          <div
            id="coverage-areas"
            style={{
              background: '#fffdf8',
              border: '1px solid #e8e1d3',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '26px',
              boxShadow: '0 4px 18px rgba(23,72,62,0.04)',
            }}
            aria-labelledby="coverage-title"
          >
            {/* رأس قسم التغطية */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '22px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eaf4ee', color: '#17483e', display: 'grid', placeItems: 'center' }}>
                    <MapPin size={18} />
                  </div>
                  <h2 id="coverage-title" style={{ fontSize: '20px', color: '#1d4038', margin: 0, fontWeight: 700 }}>
                    المحافظات والمناطق المخدومة والتواجد الميداني
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: '#6d746a', margin: 0, lineHeight: 1.7, maxWidth: '640px' }}>
                  يتواجد فريق <strong>{painter.name}</strong> ميدانياً في المحافظات والمناطق التالية مع جاهزية تامة للمعاينة الفورية وتحديد الأسعار. اضغط على أي منطقة للانتقال لصفحتها والاطلاع على خدمات وتكلفة الصبغ بها.
                </p>
              </div>

              {/* بطاقات المؤشرات السريعة */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {painter.isAvailableToday && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#e6f4ea',
                      color: '#137333',
                      border: '1px solid #b7dfc6',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: '10px',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#137333' }} />
                    متاح اليوم للمعاينة الفورية ({painter.responseTime})
                  </span>
                )}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f5efe1',
                    color: '#5d4e37',
                    border: '1px solid #e2d7c5',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: '10px',
                  }}
                >
                  <Building size={14} />
                  <span>تغطية لـ {painter.coverageAreaIds.length} منطقة سكنية</span>
                </span>
              </div>
            </div>

            {/* قائمة المحافظات وشبكة المناطق القابلة للنقر */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {coverageGroups.map((group) => (
                <div
                  key={group.governorate.id}
                  style={{
                    background: '#faf6ee',
                    border: '1px solid #e9e0d0',
                    borderRadius: '14px',
                    padding: '18px 20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', borderBottom: '1px solid #ece4d4', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#17483e' }} />
                      <h3 style={{ fontSize: '16px', color: '#17483e', margin: 0, fontWeight: 700 }}>
                        محافظة {group.governorate.nameAr}
                      </h3>
                      <span style={{ fontSize: '11px', color: '#878c80' }}>({group.governorate.nameEn})</span>
                    </div>

                    <span style={{ fontSize: '11px', color: '#687063', background: '#ede5d5', padding: '3px 10px', borderRadius: '6px', fontWeight: 600 }}>
                      {group.areas.length} مناطق مخدومة
                    </span>
                  </div>

                  {/* روابط المناطق القابلة للنقر */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {group.areas.map((area) => (
                      <Link
                        key={area.id}
                        href={`/areas/${group.governorate.id}/${area.id}`}
                        className="area-coverage-link"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#ffffff',
                          border: '1px solid #dfd6c5',
                          color: '#21473d',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <MapPin size={12} color="#b08d53" />
                        <span>{area.nameAr}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* تنويه التغطية والتواصل السريع */}
            <div
              style={{
                marginTop: '20px',
                padding: '14px 18px',
                background: '#f2ece0',
                borderRadius: '12px',
                border: '1px solid #e5dccb',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 320px' }}>
                <ThumbsUp size={16} color="#17483e" />
                <span style={{ fontSize: '12px', color: '#555e53', lineHeight: 1.6 }}>
                  هل قسيمتك أو شقتك في منطقة غير مدرجة بالقائمة؟ يغطي <strong>{painter.name}</strong> معظم المناطق والمشاريع الجديدة بالتنسيق المسبق.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#17483e',
                    color: '#fff',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={14} />
                  <span>استفسر عن منطقتك</span>
                </a>
              </div>
            </div>

            <style>{`
              .area-coverage-link:hover {
                background: #17483e !important;
                color: #fff9ee !important;
                border-color: #17483e !important;
                transform: translateY(-1px);
                box-shadow: 0 3px 8px rgba(23,72,62,0.15);
              }
              .area-coverage-link:hover svg {
                stroke: #e9bd77 !important;
              }
            `}</style>
          </div>
        )}
        {activeTab === 'about' && (
          <div style={{ background: '#fffdf8', border: '1px solid #e8e1d3', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', color: '#1d4038', margin: '0 0 14px' }}>نبذة عن الورشة وخبرتها في الكويت</h2>
            <p style={{ fontSize: '14px', color: '#58645a', lineHeight: 2, marginBottom: '22px' }}>
              {painter.bio}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#f5efe3', padding: '16px', borderRadius: '12px', border: '1px solid #e8e0d0' }}>
                <strong style={{ display: 'block', color: '#17483e', fontSize: '14px', marginBottom: '6px' }}>ماركات الأصباغ المعتمدة</strong>
                <ul style={{ margin: 0, paddingRight: '18px', fontSize: '12px', color: '#687063', lineHeight: 1.9 }}>
                  {painter.paintBrands.map((brand, i) => (
                    <li key={i}>{brand}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#f5efe3', padding: '16px', borderRadius: '12px', border: '1px solid #e8e0d0' }}>
                <strong style={{ display: 'block', color: '#17483e', fontSize: '14px', marginBottom: '6px' }}>ضمان الجودة والتنفيذ</strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#687063', lineHeight: 1.8 }}>
                  ضمان لمدة <strong>{painter.warrantyYears} سنوات</strong> على ثبات اللون وعدم التقشير، مع التزام تام بحماية المفروشات أثناء العمل.
                </p>
              </div>

              <div style={{ background: '#f5efe3', padding: '16px', borderRadius: '12px', border: '1px solid #e8e0d0' }}>
                <strong style={{ display: 'block', color: '#17483e', fontSize: '14px', marginBottom: '6px' }}>طاقم العمل والجاهزية</strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#687063', lineHeight: 1.8 }}>
                  فريق مكون من <strong>{painter.crewSize} فنيين</strong> محترفين، أنجزوا أكثر من <strong>{painter.completedProjects}+ مشروعاً</strong> في مختلف مناطق الكويت.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* شريط التواصل السفلي المخصص للهواتف الذكية (Mobile Dock) */}
      <div className="mobile-painter-bottom-bar" aria-label="خيارات التواصل السريع على الهاتف">
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center' }}>
          <span style={{ fontSize: '10px', color: '#c5d8ca', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: painter.isAvailableToday ? '#22c55e' : '#eab308',
                display: 'inline-block',
                boxShadow: painter.isAvailableToday ? '0 0 0 2px rgba(34,197,94,0.3)' : 'none',
              }}
            />
            {painter.isAvailableToday ? 'متاح للمعاينة اليوم' : 'تواصل مباشر متاح'}
          </span>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#e9bd77', whiteSpace: 'nowrap' }}>
            {painter.startingAt} <span style={{ fontSize: '11px', fontWeight: 500, color: '#f2f7f4' }}>/ غرفة</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <a
            href={telUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
              padding: '9px 13px',
              borderRadius: '11px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              minHeight: '42px',
              boxSizing: 'border-box',
            }}
            title="اتصال هاتفي مباشر"
          >
            <Phone size={14} color="#e9bd77" />
            <span>اتصال</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              background: '#25D366',
              color: '#ffffff',
              padding: '9px 16px',
              borderRadius: '11px',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              minHeight: '42px',
              boxSizing: 'border-box',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
            }}
            title="محادثة واتساب فورية"
          >
            <MessageCircle size={17} fill="currentColor" />
            <span>واتساب مباشر</span>
          </a>
        </div>
      </div>

      {/* الشريط العائم الثابت لشاشات الكمبيوتر واللابتوب */}
      <aside
        className="desktop-floating-bar"
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(760px, calc(100% - 24px))',
          background: 'rgba(23, 63, 54, 0.97)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(233, 189, 119, 0.45)',
          borderRadius: '18px',
          padding: '12px 18px',
          zIndex: 50,
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.3), 0 2px 10px rgba(233, 189, 119, 0.25)',
        }}
        aria-label="خيارات التواصل المباشر مع الصباغ"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* هوية الصباغ السريعة */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div className={`avatar ${painter.tone}`} style={{ width: '42px', height: '42px', fontSize: '15px', borderRadius: '12px', flexShrink: 0 }}>
              {painter.initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ color: '#fff9ee', fontSize: '13px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {painter.name}
              </strong>
              <span style={{ color: '#c5d8ca', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: painter.isAvailableToday ? '#22c55e' : '#eab308',
                    display: 'inline-block',
                    boxShadow: painter.isAvailableToday ? '0 0 0 2px rgba(34,197,94,0.3)' : 'none',
                  }}
                />
                {painter.isAvailableToday ? 'متاح للمعاينة الفورية اليوم' : 'تواصل مباشر متوفر'}
              </span>
            </div>
          </div>

          {/* أزرار الاتصال والواتساب الفورية */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <a
              href={telUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.22)',
              }}
              title="اتصال هاتفي مباشر"
            >
              <Phone size={15} color="#e9bd77" />
              <span dir="ltr">{painter.phone}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#25D366',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
              }}
              title="محادثة واتساب فورية"
            >
              <MessageCircle size={17} />
              <span>واتساب مباشر</span>
            </a>
          </div>
        </div>
      </aside>

      {/* نافذة إضافة تقييم موثق عبر واتساب */}
      {reviewModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setReviewModalOpen(false); }}
        >
          <div className="modal" role="dialog" aria-modal="true" style={{ width: 'min(520px, 100%)', background: '#fffdf9' }}>
            <div className="modal-head">
              <div>
                <h3 className="modal-title">تقييم تجربة العمل مع {painter.name}</h3>
                <p className="modal-subtitle">رأيك الصادق يساعد أهالي الكويت في اختيار الصباغ المناسب</p>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setReviewModalOpen(false)}
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            {revSubmitted ? (
              <div style={{ textAlign: 'center', padding: '32px 14px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eaf4ee', color: '#17483e', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '19px', color: '#1d4038', margin: '0 0 10px', fontWeight: 700 }}>تم استلام تقييمك بنجاح!</h4>
                <p style={{ fontSize: '13px', color: '#687266', lineHeight: 1.9, margin: '0 auto 20px', maxWidth: '420px' }}>
                  شكراً لمشاركتك يا <strong>{revAuthor}</strong>. لحماية مجتمع المنصة من التقييمات الوهمية، سيقوم فريق الإدارة بالتحقق من صحة التقييم عبر رقم الواتساب (<strong dir="ltr">{revWhatsapp}</strong>) قبل نشره بشارة التوثيق.
                </p>
                <button
                  type="button"
                  className="contact-button"
                  style={{ width: '100%', height: '46px', fontSize: '14px' }}
                  onClick={() => setReviewModalOpen(false)}
                >
                  حسناً، فهمت
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ marginTop: '16px' }}>
                {revError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
                    {revError}
                  </div>
                )}
                {/* اختيار النجوم */}
                <div style={{ marginBottom: '18px', textAlign: 'center', background: '#faf5eb', padding: '16px', borderRadius: '14px', border: '1px solid #ebdcc5' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#17483e', display: 'block', marginBottom: '8px' }}>
                    درجة التقييم العام (اختر من 1 إلى 5):
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRevRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          transform: star <= revRating ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        <Star
                          size={28}
                          fill={star <= revRating ? '#e9bd77' : 'none'}
                          color={star <= revRating ? '#e9bd77' : '#cfc8b8'}
                        />
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: '#8d6d37', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                    {revRating === 5 && 'ممتاز جداً (5/5)'}
                    {revRating === 4 && 'جيد جداً (4/5)'}
                    {revRating === 3 && 'متوسط (3/5)'}
                    {revRating === 2 && 'أقل من المتوقع (2/5)'}
                    {revRating === 1 && 'تجربة سيئة (1/5)'}
                  </span>
                </div>

                <div className="form-grid-2">
                  <div>
                    <label className="form-label" htmlFor="rev-author">اسمك الكريم</label>
                    <input
                      id="rev-author"
                      required
                      className="form-input"
                      placeholder="مثال: بو عبدالله العازمي"
                      value={revAuthor}
                      onChange={(e) => setRevAuthor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="rev-area">منطقتك في الكويت</label>
                    <input
                      id="rev-area"
                      required
                      className="form-input"
                      placeholder="مثال: الرميثية، صباح السالم"
                      value={revArea}
                      onChange={(e) => setRevArea(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label className="form-label" htmlFor="rev-whatsapp" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>رقم الواتساب الخاص بك</span>
                    <span style={{ fontSize: '11px', color: '#1f6858', fontWeight: 600 }}>سري للإدارة فقط للتأكد</span>
                  </label>
                  <input
                    id="rev-whatsapp"
                    required
                    type="tel"
                    className="form-input"
                    placeholder="مثال: 9XXXXXXX أو 5XXXXXXX"
                    value={revWhatsapp}
                    onChange={(e) => setRevWhatsapp(e.target.value)}
                    dir="ltr"
                  />
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#7f887b', lineHeight: 1.6 }}>
                    لن يظهر رقمك للعامة أبداً. يستخدمه فريق إدارة المنصة للتحقق من صدق التجربة وحماية الموقع من التقييمات العشوائية.
                  </p>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label className="form-label" htmlFor="rev-service">نوع الخدمة المنجزة</label>
                  <select
                    id="rev-service"
                    name="revServiceType"
                    aria-label="نوع الخدمة المنجزة"
                    className="form-input"
                    value={revServiceType}
                    onChange={(e) => setRevServiceType(e.target.value)}
                  >
                    <option value="دهان داخلي ومعجون">دهان داخلي ومعجون</option>
                    <option value="صبغ جوتن فينوماستيك ربع لمعة">صبغ جوتن فينوماستيك ربع لمعة</option>
                    <option value="ورق جدران وبديل خشب">ورق جدران وبديل خشب</option>
                    <option value="أصباغ خارجية سيجما">أصباغ خارجية سيجما</option>
                    <option value="ترميم وعلاج رطوبة">ترميم وعلاج رطوبة</option>
                    <option value="تشطيب فيلا / قسيمة بالكامل">تشطيب فيلا / قسيمة بالكامل</option>
                  </select>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label className="form-label" htmlFor="rev-comment">رأيك وتفاصيل تجربتك مع الصباغ</label>
                  <textarea
                    id="rev-comment"
                    required
                    className="form-textarea"
                    placeholder="اكتب بالتفصيل: كيف كان التزامه بالمواعيد؟ نظافة الشغل؟ جودة الصبغ ومعاملة العمال؟"
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    style={{ minHeight: '85px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={revLoading}
                  className="contact-button modal-action"
                  style={{ marginTop: '18px', width: '100%', height: '48px', fontSize: '14px', fontWeight: 800 }}
                >
                  {revLoading ? 'جاري إرسال التقييم...' : 'إرسال التقييم للتحقق والاعتماد'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal for Viewing Full Resolution WebP Photos */}
      {activeLightboxImage && (
        <div
          onClick={() => setActiveLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '920px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#fff',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: '#e9bd77',
                    color: '#17483e',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '6px',
                  }}
                >
                  صورة WebP فائقة الدقة
                </span>
                <strong style={{ fontSize: '15px' }}>{activeLightboxImage.title}</strong>
              </div>

              <button
                type="button"
                onClick={() => setActiveLightboxImage(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Image */}
            <img
              src={activeLightboxImage.url}
              alt={activeLightboxImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            />

            {activeLightboxImage.caption && (
              <p
                style={{
                  color: '#e5dbcb',
                  fontSize: '13px',
                  marginTop: '12px',
                  textAlign: 'center',
                  maxWidth: '700px',
                  lineHeight: 1.6,
                }}
              >
                {activeLightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
