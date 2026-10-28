'use client';

import React, { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  ChevronDown,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  X,
  Clock3,
  ExternalLink,
  Building2,
  Sparkles,
  Phone,
} from 'lucide-react';
import { PAINTERS_DATA, SERVICES_LIST, type Painter } from '@/data/painters';
import { catalogStore } from '@/lib/catalog-store';
import { KUWAIT_GOVERNORATES } from '@/data/kuwait-areas';
import { SiteFooter } from '@/components/footer';
import { Header } from '@/components/header';
import { Link } from '@/lib/nav';
import { apiClient } from '@/lib/api-client';
import { PainterAvatar } from '@/components/painter-avatar';
import { LeadQuoteSection } from '@/components/lead-quote-section';

const regions = [
  'كل المناطق',
  'العاصمة',
  'حولي',
  'الفروانية',
  'الأحمدي',
  'مبارك الكبير',
  'الجهراء',
  'السالمية',
  'صباح السالم',
];
const services = SERVICES_LIST;

function PainterCard({
  painter,
  saved,
  onFavorite,
  onDetails,
  onContact,
}: {
  painter: Painter;
  saved: boolean;
  onFavorite: () => void;
  onDetails: () => void;
  onContact: () => void;
}) {
  return (
    <article className="painter-card" data-testid={`card-painter-${painter.id}`}>
      <div className="card-top">
        <Link
          href={`/painters/${encodeURIComponent(painter.slug || painter.name || painter.id)}`}
          className="painter-identity"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <PainterAvatar painter={painter} />
          <div className="identity-copy">
            <h3>{painter.name}</h3>
            <span className="verified">
              <BadgeCheck aria-hidden="true" /> ملف موثّق ومفحوص
            </span>
          </div>
        </Link>
        <button
          type="button"
          className={`favorite-btn${saved ? ' saved' : ''}`}
          onClick={onFavorite}
          aria-label={saved ? `إزالة ${painter.name} من المفضلة` : `حفظ ${painter.name} في المفضلة`}
          aria-pressed={saved}
          data-testid={`button-favorite-${painter.id}`}
        >
          <Heart fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </div>
      <div className="card-meta">
        <span className="meta-item">
          <Star fill="currentColor" aria-hidden="true" />
          <b className="rating-number">{painter.rating}</b>
          <span>({typeof painter.reviews === 'number' ? painter.reviews : (Array.isArray(painter.reviews) ? (painter.reviews as any[]).length : 0)})</span>
        </span>
        <span className="meta-item">
          <MapPin aria-hidden="true" />
          {painter.region}
        </span>
        <span className="meta-item">
          <Clock3 aria-hidden="true" />
          {painter.years} سنوات خبرة
        </span>
      </div>
      <p className="card-desc">{painter.description}</p>
      <div className="card-tags">
        {painter.services.slice(0, 3).map((service) => (
          <span key={service} className="tag">
            {service}
          </span>
        ))}
      </div>
      <div className="card-bottom">
        <div>
          <span className="price-label">يبدأ من</span>
          <span className="price-value">
            {painter.startingAt} <small>للغرفة</small>
          </span>
        </div>
        <div className="card-actions">
          <button
            className="detail-button"
            type="button"
            onClick={onDetails}
            data-testid={`button-details-${painter.id}`}
          >
            التفاصيل
          </button>
          <button
            className="contact-button"
            type="button"
            onClick={onContact}
            data-testid={`button-contact-${painter.id}`}
          >
            تواصل
          </button>
        </div>
      </div>
    </article>
  );
}

export function HomeView() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('كل المناطق');
  const [service, setService] = useState('الكل');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<Painter | null>(null);
  const [contacting, setContacting] = useState<Painter | null>(null);
  const [painters, setPainters] = useState<Painter[]>(() => catalogStore.getApprovedPainters());

  useEffect(() => {
    setPainters(catalogStore.getApprovedPainters());

    const unsubscribe = catalogStore.subscribe(() => {
      setPainters(catalogStore.getApprovedPainters());
    });

    apiClient.get<any[]>('/public/painters')
      .then((apiPainters) => {
        if (Array.isArray(apiPainters) && apiPainters.length > 0) {
          const approvedOnly = apiPainters.filter((p) => (p.status || 'approved') === 'approved');
          if (approvedOnly.length > 0) {
            setPainters(approvedOnly);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not fetch latest painters from API, using catalogStore:', err);
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const applyUrlParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const regionParam = searchParams.get('region') || searchParams.get('governorate');
      const serviceParam = searchParams.get('service');
      const queryParam = searchParams.get('q') || searchParams.get('query') || searchParams.get('area');

      if (regionParam) {
        const decoded = decodeURIComponent(regionParam);
        const govMapping: Record<string, string> = {
          capital: 'العاصمة',
          hawalli: 'حولي',
          farwaniyah: 'الفروانية',
          ahmadi: 'الأحمدي',
          'mubarak-al-kabeer': 'مبارك الكبير',
          jahra: 'الجهراء',
        };
        const targetRegion = govMapping[decoded] || decoded;
        setRegion(targetRegion);
      }

      if (serviceParam) {
        setService(decodeURIComponent(serviceParam));
      }

      if (queryParam) {
        const decodedQuery = decodeURIComponent(queryParam);
        setQuery(decodedQuery);
        setAppliedQuery(decodedQuery);
      }
    };

    applyUrlParams();
    window.addEventListener('popstate', applyUrlParams);
    return () => window.removeEventListener('popstate', applyUrlParams);
  }, []);

  const filteredPainters = useMemo(
    () =>
      painters.filter((painter) => {
        const term = appliedQuery.trim().toLocaleLowerCase('ar');
        const matchesQuery =
          !term ||
          [
            painter.name,
            painter.region,
            ...(painter.governorates || []),
            ...painter.services,
          ].some((value) => value.toLocaleLowerCase('ar').includes(term));

        const matchesRegion =
          region === 'كل المناطق' ||
          painter.region === region ||
          (painter.governorates && painter.governorates.includes(region)) ||
          (region === 'العاصمة' && painter.governorates?.includes('العاصمة')) ||
          (region === 'مبارك الكبير' &&
            (painter.region === 'صباح السالم' || painter.governorates?.includes('مبارك الكبير')));

        const isApproved = (painter.status || 'approved') === 'approved';

        return (
          isApproved &&
          matchesQuery &&
          matchesRegion &&
          (service === 'الكل' || painter.services.includes(service)) &&
          (!favoritesOnly || favorites.includes(painter.id))
        );
      }).sort((a, b) => {
        const orderA = a.displayOrder ?? a.id;
        const orderB = b.displayOrder ?? b.id;
        return orderA - orderB;
      }),
    [appliedQuery, region, service, favoritesOnly, favorites, painters]
  );

  useEffect(() => {
    if (!selected && !contacting) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelected(null);
        setContacting(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, contacting]);

  const toggleFavorite = (id: number) =>
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const doSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedQuery(query);
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetFilters = () => {
    setQuery('');
    setAppliedQuery('');
    setRegion('كل المناطق');
    setService('الكل');
    setFavoritesOnly(false);
  };

  const selectRegionAndScroll = (selectedRegion: string) => {
    setRegion(selectedRegion);
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectCityQueryAndScroll = (cityName: string) => {
    setQuery(cityName);
    setAppliedQuery(cityName);
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="site-shell" dir="rtl">
      <Header
        favoritesCount={favorites.length}
        favoritesOnly={favoritesOnly}
        onToggleFavorites={() => {
          setFavoritesOnly((v) => !v);
          document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">دليلك المحلي لخدمات الصبغ</span>
              <h1>
                خلّ لون بيتك
                <br />
                <em>على ذوقك.</em>
              </h1>
              <p>قارن بين صبّاغين في منطقتك، شوف تقييماتهم وخدماتهم، واختر اللي يناسب بيتك.</p>
              <form
                className="search-panel"
                onSubmit={doSearch}
                role="search"
                data-webmcp-tool="search_painters"
                data-webmcp-description="البحث عن صباغين معتمدين في مناطق الكويت حسب المنطقة ونوع الخدمة"
                aria-label="نموذج البحث عن صباغ في الكويت"
              >
                <label className="search-field" htmlFor="home-search-query">
                  <Search aria-hidden="true" />
                  <input
                    id="home-search-query"
                    name="query"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="اسم الصبّاغ أو الخدمة"
                    aria-label="ابحث عن صباغ أو خدمة"
                    data-testid="input-search"
                  />
                </label>
                <label className="search-field" htmlFor="home-region-select">
                  <MapPin aria-hidden="true" />
                  <select
                    id="home-region-select"
                    name="region"
                    aria-label="اختر المنطقة"
                    value={region}
                    onChange={(event) => setRegion(event.target.value)}
                    data-testid="select-region"
                  >
                    {regions.map((item) => (
                      <option key={item} value={item}>
                        {item === 'كل المناطق' ? 'كل مناطق الكويت' : item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden="true" />
                </label>
                <button className="search-button" type="submit" data-testid="button-search">
                  <span>ابحث الآن</span>
                  <Search aria-hidden="true" />
                </button>
              </form>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-arch">
                <div className="room-art" />
                <div className="paint-swatch" />
              </div>
              <div className="hero-stamp">
                <ShieldCheck />
                <span>
                  اختيارك
                  <br />
                  بكل وضوح
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="معلومات عن الدليل">
          <div className="trust-inner">
            <span className="trust-note">
              <ShieldCheck aria-hidden="true" />
              <strong>قارن قبل ما تقرر</strong>
            </span>
            <span className="trust-note">
              <MapPin aria-hidden="true" />
              <strong>خدمات حول الكويت</strong>
            </span>
            <span className="trust-note">
              <Star aria-hidden="true" />
              <strong>تقييمات واضحة</strong> من بيانات العرض
            </span>
            <span className="trust-note">
              <MessageCircle aria-hidden="true" />
              <strong>تواصل مباشر</strong> من داخل الواجهة
            </span>
          </div>
        </section>

        <section className="main-content" id="directory">
          <div className="section-head">
            <div>
              <div className="section-kicker">دليل الخدمات</div>
              <h2>{favoritesOnly ? 'صبّاغونك المفضّلون' : 'صبّاغون قريبون منك'}</h2>
              <p className="section-caption">تعرّف على الخيارات، ثم اختر الأنسب لمساحتك.</p>
            </div>
            <span className="result-count" aria-live="polite" data-testid="text-results-count">
              {filteredPainters.length} نتائج
            </span>
          </div>
          <div className="filters" aria-label="تصفية حسب المنطقة">
            {regions.map((item) => (
              <button
                key={item}
                type="button"
                className={`filter-chip${region === item ? ' active' : ''}`}
                onClick={() => setRegion(item)}
                aria-pressed={region === item}
                data-testid={`filter-region-${item}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="service-row" aria-label="تصفية حسب نوع الخدمة">
            {services.map((item) => (
              <button
                key={item}
                type="button"
                className={`service-chip${service === item ? ' active' : ''}`}
                onClick={() => setService(item)}
                aria-pressed={service === item}
                data-testid={`filter-service-${item}`}
              >
                {item}
              </button>
            ))}
          </div>
          {filteredPainters.length > 0 ? (
            <div className="directory-grid" aria-live="polite">
              {filteredPainters.map((painter) => (
                <PainterCard
                  key={painter.id}
                  painter={painter}
                  saved={favorites.includes(painter.id)}
                  onFavorite={() => toggleFavorite(painter.id)}
                  onDetails={() => setSelected(painter)}
                  onContact={() => setContacting(painter)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state" data-testid="status-no-results">
              <div>
                <div className="empty-icon">
                  <SlidersHorizontal aria-hidden="true" />
                </div>
                {painters.length === 0 ? (
                  <>
                    <h3>لا يوجد صباغين مسجلين حالياً</h3>
                    <p>كن أول المنضمين إلى منصة صباغ الكويت واستقبل طلبات المعاينة المباشرة مجاناً!</p>
                    <Link
                      href="/join-painter"
                      className="clear-button"
                      style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        background: '#17483e',
                        color: '#e9bd77',
                        fontWeight: 700,
                        padding: '10px 24px',
                        borderRadius: '8px',
                        marginTop: '12px',
                      }}
                    >
                      انضم الآن كصباغ
                    </Link>
                  </>
                ) : (
                  <>
                    <h3>ما لقينا نتائج بهالاختيارات</h3>
                    <p>جرّب تغيّر المنطقة أو الخدمة، أو ابدأ من جديد.</p>
                    <button className="clear-button" type="button" onClick={resetFilters}>
                      مسح الفلاتر
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </section>

        {/* قسم مناطق الكويت الشامل لتصدر محركات البحث والربط الداخلي */}
        <section
          className="areas-showcase"
          id="areas"
          style={{
            background: '#f5efe1',
            borderTop: '1px solid #e7decd',
            borderBottom: '1px solid #e7decd',
            padding: '52px 0 60px',
          }}
        >
          <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              <div>
                <span className="section-kicker" style={{ color: '#c16a4c' }}>
                  تغطية لكافة مدن ومحافظات الكويت
                </span>
                <h2
                  style={{
                    fontSize: '26px',
                    color: '#1d4038',
                    margin: '4px 0 8px',
                    letterSpacing: '-0.03em',
                  }}
                >
                  مناطق الكويت: اختر محافظتك واعثر على صبّاغك فوراً
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: '#666e63',
                    fontSize: '13px',
                    maxWidth: '600px',
                    lineHeight: 1.8,
                  }}
                >
                  صباغون معتمدون يغطون كافة مناطق الكويت من العاصمة وحولي إلى قسائم المطلاع وصباح الأحمد
                  السكنية والشاليهات الجنوبية.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectRegionAndScroll('كل المناطق')}
                className="detail-button"
                style={{ background: '#fffdf8', fontSize: '12px', fontWeight: 700 }}
              >
                عرض كل الصباغين ({painters.length})
              </button>
            </div>

            {/* بطاقات المحافظات الست */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                marginBottom: '26px',
              }}
            >
              {KUWAIT_GOVERNORATES.map((gov) => {
                const isSelected = region === gov.nameAr;
                const sampleAreas = gov.areas
                  .slice(0, 5)
                  .map((a) => a.nameAr.split(' ')[0])
                  .join('، ');

                return (
                  <div
                    key={gov.id}
                    style={{
                      background: isSelected ? '#17483e' : '#fffdf8',
                      color: isSelected ? '#f6f1e6' : '#23483e',
                      border: `1px solid ${isSelected ? '#17483e' : '#e4dccf'}`,
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: isSelected ? '0 8px 24px rgba(23, 72, 62, 0.18)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building2 size={18} color={isSelected ? '#e9bd77' : '#c7664f'} />
                          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                            محافظة {gov.nameAr}
                          </h3>
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            color: isSelected ? '#e9bd77' : '#7b8376',
                            background: isSelected ? 'rgba(255,255,255,0.1)' : '#f2ece0',
                            padding: '2px 8px',
                            borderRadius: '999px',
                          }}
                        >
                          {gov.areasCount} منطقة
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: isSelected ? '#dce6dd' : '#697266',
                          lineHeight: 1.7,
                          margin: '0 0 12px',
                        }}
                      >
                        {gov.descriptionAr}
                      </p>
                      <div
                        style={{
                          fontSize: '11px',
                          color: isSelected ? '#b9cbbe' : '#4a5649',
                          marginBottom: '16px',
                        }}
                      >
                        <strong>أبرز المناطق:</strong> {sampleAreas}...
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => selectRegionAndScroll(gov.nameAr)}
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: '0',
                          cursor: 'pointer',
                          background: isSelected ? '#e9bd77' : '#17483e',
                          color: isSelected ? '#17483e' : '#fff9ee',
                        }}
                      >
                        {isSelected ? `معروض حالياً` : `تصفية الدليل`}
                      </button>
                      <Link
                        href={`/areas/${gov.id}`}
                        aria-label={`دليل صباغ محافظة ${gov.nameAr}`}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          background: isSelected ? 'rgba(255,255,255,0.15)' : '#efe7d8',
                          color: isSelected ? '#fff' : '#17483e',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>صفحة {gov.nameAr}</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* بطاقة إرشادية للمدن السكنية الجديدة الأكثر طلباً */}
            <div
              style={{
                background: '#fffdf8',
                border: '1px solid #e1d8ca',
                borderRadius: '18px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={18} color="#c7664f" />
                <h3 style={{ margin: 0, fontSize: '16px', color: '#17483e', fontWeight: 700 }}>
                  المدن السكنية الجديدة وأعمال التشطيبات الكبرى (المطلاع، صباح الأحمد، جابر الأحمد)
                </h3>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#687266', lineHeight: 1.8 }}>
                تشهد المدن السكنية الحديثة في الكويت أعلى طلب على مقاولي الأصباغ لتشطيب القسائم السكنية وعوازل
                الرطوبة ورشات السيجما وبديل الرخام. اضغط للبحث المباشر عن صباغين متوفرين بتلك المدن:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { name: 'مدينة المطلاع السكنية', query: 'المطلاع' },
                  { name: 'مدينة صباح الأحمد', query: 'صباح الأحمد' },
                  { name: 'مدينة جابر الأحمد', query: 'جابر الأحمد' },
                  { name: 'غرب عبد الله المبارك', query: 'غرب عبد الله المبارك' },
                  { name: 'جنوب عبد الله المبارك', query: 'جنوب عبد الله المبارك' },
                  { name: 'مدينة سعد العبدالله', query: 'سعد العبدالله' },
                  { name: 'شاليهات الخيران وبنيدر', query: 'الخيران' },
                ].map((item) => (
                  <button
                    key={item.query}
                    type="button"
                    onClick={() => selectCityQueryAndScroll(item.query)}
                    className="filter-chip"
                    style={{
                      background: appliedQuery.includes(item.query) ? '#17483e' : '#f2ece0',
                      color: appliedQuery.includes(item.query) ? '#fff8eb' : '#23483e',
                      borderColor: '#d7cfbf',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    صباغ {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-inner">
            <div className="how-intro">
              <span className="eyebrow" style={{ color: '#a36549' }}>
                خطوات واضحة
              </span>
              <h2>قرار أهدأ، وبيت أجمل.</h2>
              <p>الدليل يساعدك تجمع المعلومات الأساسية قبل ما تتواصل وتنسّق بنفسك.</p>
            </div>
            <div className="steps">
              <div className="step">
                <span className="step-num">٠١</span>
                <h3>حدّد احتياجك</h3>
                <p>ابحث بالخدمة أو اختر المنطقة المناسبة لك.</p>
              </div>
              <div className="step">
                <span className="step-num">٠٢</span>
                <h3>قارن الخيارات</h3>
                <p>اطّلع على التقييم والخبرة ونطاق السعر.</p>
              </div>
              <div className="step">
                <span className="step-num">٠٣</span>
                <h3>تواصل وتفاهم</h3>
                <p>ناقش التفاصيل والموعد مباشرة مع مقدم الخدمة.</p>
              </div>
            </div>
          </div>
        </section>

        {/* نموذج طلب المعاينة وعرض السعر الفوري */}
        <div style={{ padding: '0 16px' }}>
          <LeadQuoteSection />
        </div>
      </main>

      <SiteFooter />

      {selected && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
            <div className="modal-head">
              <div>
                <h2 id="details-title" className="modal-title">
                  ملف مقدم الخدمة
                </h2>
                <p className="modal-subtitle">معلومات توضيحية ضمن النسخة المعتمدة</p>
              </div>
              <button
                className="close-button"
                type="button"
                onClick={() => setSelected(null)}
                aria-label="إغلاق التفاصيل"
              >
                <X />
              </button>
            </div>
            <div className="profile-heading">
              <PainterAvatar painter={selected} size={62} />
              <div>
                <h3>{selected.name}</h3>
                <p>
                  <MapPin size={13} /> {selected.region}، الكويت
                </p>
              </div>
            </div>
            <div className="detail-stats">
              <div className="detail-stat">
                <strong>
                  {selected.rating} <Star size={12} fill="currentColor" />
                </strong>
                <span>تقييم معتمد</span>
              </div>
              <div className="detail-stat">
                <strong>{typeof selected.reviews === 'number' ? selected.reviews : (Array.isArray(selected.reviews) ? (selected.reviews as any[]).length : 0)}</strong>
                <span>مراجعة</span>
              </div>
              <div className="detail-stat">
                <strong>{selected.years} سنوات</strong>
                <span>خبرة مدرجة</span>
              </div>
            </div>
            <div className="modal-section">
              <h4>نبذة</h4>
              <p>{selected.description}</p>
            </div>
            <div className="modal-section">
              <h4>الخدمات</h4>
              <div className="modal-tags">
                {selected.services.map((item) => (
                  <span className="modal-tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="modal-section">
              <h4>السعر الإرشادي</h4>
              <p>
                يبدأ من <strong>{selected.startingAt}</strong> للغرفة. السعر النهائي يعتمد على المساحة ونوع المواد.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
              <Link
                href={`/painters/${encodeURIComponent(selected.slug || selected.name || selected.id)}`}
                className="detail-button"
                style={{
                  textAlign: 'center',
                  padding: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
                onClick={() => setSelected(null)}
              >
                <span>عرض البروفايل الكامل وسابقة الأعمال</span>
                <ExternalLink size={14} />
              </Link>
              <button
                className="contact-button modal-action"
                type="button"
                style={{ margin: 0 }}
                onClick={() => {
                  setContacting(selected);
                  setSelected(null);
                }}
              >
                تواصل مباشر عبر واتساب أو الهاتف
              </button>
            </div>
          </section>
        </div>
      )}

      {contacting && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setContacting(null);
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            style={{ maxWidth: '480px' }}
          >
            <div className="modal-head">
              <div>
                <h2 id="contact-title" className="modal-title">
                  تواصل مباشر مع {contacting.name}
                </h2>
                <p className="modal-subtitle">اختر وسيلة التواصل الفورية التي تفضلها:</p>
              </div>
              <button
                className="close-button"
                type="button"
                onClick={() => setContacting(null)}
                aria-label="إغلاق"
              >
                <X />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <a
                href={`https://wa.me/${(contacting.whatsapp || contacting.phone).replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                  contacting.whatsappPrefill ||
                    `السلام عليكم، اطلعت على ملفك في منصة صباغ الكويت وأود الاستفسار عن خدمة صبغ.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#25D366',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)',
                }}
              >
                <MessageCircle size={20} fill="currentColor" />
                <span>محادثة واتساب مباشرة</span>
              </a>

              <a
                href={`tel:${contacting.phone.replace(/[^\d+]/g, '')}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#17483e',
                  color: '#fff9ee',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '1px solid #17483e',
                }}
              >
                <Phone size={18} color="#e9bd77" />
                <span>
                  اتصال هاتفي: <strong dir="ltr">{contacting.phone}</strong>
                </span>
              </a>

              <Link
                href={`/painters/${encodeURIComponent(contacting.slug || contacting.name || contacting.id)}`}
                onClick={() => setContacting(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#f5efe3',
                  color: '#17483e',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '1px solid #e2d7c5',
                  marginTop: '4px',
                }}
              >
                <span>مشاهدة سابقة الأعمال والأسعار كاملة</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
