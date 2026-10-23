import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  BadgeCheck, Check, ChevronDown, Heart, MapPin, MessageCircle,
  Paintbrush, Search, ShieldCheck, SlidersHorizontal,
  Star, X, Clock3,
} from 'lucide-react';

const queryClient = new QueryClient();

type Painter = {
  id: number;
  name: string;
  initials: string;
  region: string;
  rating: string;
  reviews: number;
  years: number;
  startingAt: string;
  services: string[];
  description: string;
  tone: string;
};

const painters: Painter[] = [
  { id: 1, name: 'مؤسسة لون الدار', initials: 'لد', region: 'السالمية', rating: '4.9', reviews: 86, years: 11, startingAt: '18 د.ك', services: ['دهان داخلي', 'ورق جدران', 'معجون'], description: 'تشطيب مرتب للبيوت والشقق، مع معاينة الألوان قبل البدء والاهتمام بحماية الأثاث.', tone: '' },
  { id: 2, name: 'صباغ بو راشد', initials: 'بر', region: 'حولي', rating: '4.8', reviews: 64, years: 8, startingAt: '15 د.ك', services: ['دهان داخلي', 'دهان خارجي', 'ترميم'], description: 'أعمال صبغ وتجديد للمنازل، ومواعيد مرنة تناسب سكان حولي والمناطق القريبة.', tone: 'ochre' },
  { id: 3, name: 'ورشة لمسة فن', initials: 'لف', region: 'الفروانية', rating: '4.7', reviews: 53, years: 7, startingAt: '20 د.ك', services: ['ورق جدران', 'دهان داخلي', 'ديكورات'], description: 'اختيارات ألوان هادئة وتنفيذ ديكورات جدارية بسيطة للمجالس وغرف النوم.', tone: 'rose' },
  { id: 4, name: 'صباغ الديرة', initials: 'صد', region: 'الأحمدي', rating: '4.9', reviews: 42, years: 13, startingAt: '22 د.ك', services: ['دهان خارجي', 'ترميم', 'دهان داخلي'], description: 'خبرة في الواجهات الخارجية ومعالجة آثار الرطوبة والتشققات قبل الدهان.', tone: 'blue' },
  { id: 5, name: 'ألوان السور', initials: 'اس', region: 'الجهراء', rating: '4.6', reviews: 37, years: 6, startingAt: '16 د.ك', services: ['دهان داخلي', 'معجون', 'ترميم'], description: 'صبغ وتجديد الشقق والبيوت في الجهراء، مع توضيح نطاق العمل والتكلفة مسبقاً.', tone: 'ochre' },
  { id: 6, name: 'دار النقشة', initials: 'دن', region: 'صباح السالم', rating: '4.8', reviews: 29, years: 9, startingAt: '24 د.ك', services: ['ديكورات', 'ورق جدران', 'دهان داخلي'], description: 'لمسات ديكورية وأعمال ورق جدران، مع عناية بالتفاصيل والزوايا النهائية.', tone: 'rose' },
];

const regions = ['كل المناطق', 'السالمية', 'حولي', 'الفروانية', 'الأحمدي', 'الجهراء', 'صباح السالم'];
const services = ['الكل', 'دهان داخلي', 'دهان خارجي', 'ورق جدران', 'ترميم', 'ديكورات', 'معجون'];

function Brand() {
  return <a className="brand" href="/" aria-label="صباغ الكويت، الرئيسية"><span className="brand-mark"><Paintbrush aria-hidden="true" /></span><span>صباغ الكويت</span></a>;
}

function PainterCard({ painter, saved, onFavorite, onDetails, onContact }: {
  painter: Painter; saved: boolean; onFavorite: () => void; onDetails: () => void; onContact: () => void;
}) {
  return (
    <article className="painter-card" data-testid={`card-painter-${painter.id}`}>
      <div className="card-top">
        <div className="painter-identity">
          <div className={`avatar ${painter.tone}`} aria-hidden="true">{painter.initials}</div>
          <div className="identity-copy">
            <h3>{painter.name}</h3>
            <span className="verified"><BadgeCheck aria-hidden="true" /> ملف تجريبي موثّق شكلياً</span>
          </div>
        </div>
        <button type="button" className={`favorite-btn${saved ? ' saved' : ''}`} onClick={onFavorite} aria-label={saved ? `إزالة ${painter.name} من المفضلة` : `حفظ ${painter.name} في المفضلة`} aria-pressed={saved} data-testid={`button-favorite-${painter.id}`}>
          <Heart fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </div>
      <div className="card-meta">
        <span className="meta-item"><Star fill="currentColor" aria-hidden="true" /><b className="rating-number">{painter.rating}</b><span>({painter.reviews})</span></span>
        <span className="meta-item"><MapPin aria-hidden="true" />{painter.region}</span>
        <span className="meta-item"><Clock3 aria-hidden="true" />{painter.years} سنوات خبرة</span>
      </div>
      <p className="card-desc">{painter.description}</p>
      <div className="card-tags">{painter.services.slice(0, 3).map((service) => <span key={service} className="tag">{service}</span>)}</div>
      <div className="card-bottom">
        <div><span className="price-label">يبدأ من</span><span className="price-value">{painter.startingAt} <small>للغرفة</small></span></div>
        <div className="card-actions">
          <button className="detail-button" type="button" onClick={onDetails} data-testid={`button-details-${painter.id}`}>التفاصيل</button>
          <button className="contact-button" type="button" onClick={onContact} data-testid={`button-contact-${painter.id}`}>تواصل</button>
        </div>
      </div>
    </article>
  );
}

function Home() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('كل المناطق');
  const [service, setService] = useState('الكل');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<Painter | null>(null);
  const [contacting, setContacting] = useState<Painter | null>(null);
  const [previewed, setPreviewed] = useState(false);

  const filteredPainters = useMemo(() => painters.filter((painter) => {
    const term = appliedQuery.trim().toLocaleLowerCase('ar');
    const matchesQuery = !term || [painter.name, painter.region, ...painter.services].some((value) => value.toLocaleLowerCase('ar').includes(term));
    return matchesQuery && (region === 'كل المناطق' || painter.region === region) &&
      (service === 'الكل' || painter.services.includes(service)) &&
      (!favoritesOnly || favorites.includes(painter.id));
  }), [appliedQuery, region, service, favoritesOnly, favorites]);

  useEffect(() => {
    if (!selected && !contacting) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { setSelected(null); setContacting(null); } };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, contacting]);

  const toggleFavorite = (id: number) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const doSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedQuery(query);
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const resetFilters = () => { setQuery(''); setAppliedQuery(''); setRegion('كل المناطق'); setService('الكل'); setFavoritesOnly(false); };

  return (
    <div className="site-shell" dir="rtl">
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <nav className="navlinks" aria-label="التنقل الرئيسي">
            <a href="#directory">اكتشف الصبّاغين</a>
            <a href="#how-it-works">كيف تعمل الخدمة</a>
          </nav>
          <button type="button" className="saved-nav" onClick={() => { setFavoritesOnly((value) => !value); document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' }); }} aria-pressed={favoritesOnly} data-testid="button-favorites-filter">
            <Heart fill={favoritesOnly ? 'currentColor' : 'none'} aria-hidden="true" /> المفضلة <span>({favorites.length})</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">دليلك المحلي لخدمات الصبغ</span>
              <h1>خلّ لون بيتك<br /><em>على ذوقك.</em></h1>
              <p>قارن بين صبّاغين في منطقتك، شوف تقييماتهم وخدماتهم، واختر اللي يناسب بيتك.</p>
              <form className="search-panel" onSubmit={doSearch} role="search">
                <label className="search-field">
                  <Search aria-hidden="true" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="اسم الصبّاغ أو الخدمة" aria-label="ابحث عن صباغ أو خدمة" data-testid="input-search" />
                </label>
                <label className="search-field">
                  <MapPin aria-hidden="true" />
                  <select aria-label="اختر المنطقة" value={region} onChange={(event) => setRegion(event.target.value)} data-testid="select-region">
                    {regions.map((item) => <option key={item} value={item}>{item === 'كل المناطق' ? 'كل مناطق الكويت' : item}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" />
                </label>
                <button className="search-button" type="submit" data-testid="button-search"><span>ابحث الآن</span><Search aria-hidden="true" /></button>
              </form>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-arch"><div className="room-art" /><div className="paint-swatch" /></div>
              <div className="hero-stamp"><ShieldCheck /><span>اختيارك<br />بكل وضوح</span></div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="معلومات عن الدليل">
          <div className="trust-inner">
            <span className="trust-note"><ShieldCheck aria-hidden="true" /><strong>قارن قبل ما تقرر</strong></span>
            <span className="trust-note"><MapPin aria-hidden="true" /><strong>خدمات حول الكويت</strong></span>
            <span className="trust-note"><Star aria-hidden="true" /><strong>تقييمات واضحة</strong> من بيانات العرض</span>
            <span className="trust-note"><MessageCircle aria-hidden="true" /><strong>تواصل مباشر</strong> من داخل الواجهة</span>
          </div>
        </section>

        <section className="main-content" id="directory">
          <div className="section-head">
            <div><div className="section-kicker">دليل الخدمات</div><h2>{favoritesOnly ? 'صبّاغونك المفضّلون' : 'صبّاغون قريبون منك'}</h2><p className="section-caption">تعرّف على الخيارات، ثم اختر الأنسب لمساحتك.</p></div>
            <span className="result-count" aria-live="polite" data-testid="text-results-count">{filteredPainters.length} نتائج</span>
          </div>
          <div className="filters" aria-label="تصفية حسب المنطقة">
            {regions.map((item) => <button key={item} type="button" className={`filter-chip${region === item ? ' active' : ''}`} onClick={() => setRegion(item)} aria-pressed={region === item} data-testid={`filter-region-${item}`}>{item}</button>)}
          </div>
          <div className="service-row" aria-label="تصفية حسب نوع الخدمة">
            {services.map((item) => <button key={item} type="button" className={`service-chip${service === item ? ' active' : ''}`} onClick={() => setService(item)} aria-pressed={service === item} data-testid={`filter-service-${item}`}>{item}</button>)}
          </div>
          {filteredPainters.length > 0 ? (
            <div className="directory-grid" aria-live="polite">
              {filteredPainters.map((painter) => <PainterCard key={painter.id} painter={painter} saved={favorites.includes(painter.id)} onFavorite={() => toggleFavorite(painter.id)} onDetails={() => setSelected(painter)} onContact={() => { setContacting(painter); setPreviewed(false); }} />)}
            </div>
          ) : (
            <div className="empty-state" data-testid="status-no-results">
              <div><div className="empty-icon"><SlidersHorizontal aria-hidden="true" /></div><h3>ما لقينا نتائج بهالاختيارات</h3><p>جرّب تغيّر المنطقة أو الخدمة، أو ابدأ من جديد.</p><button className="clear-button" type="button" onClick={resetFilters}>مسح الفلاتر</button></div>
            </div>
          )}
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-inner">
            <div className="how-intro"><span className="eyebrow" style={{ color: '#a36549' }}>خطوات واضحة</span><h2>قرار أهدأ، وبيت أجمل.</h2><p>الدليل يساعدك تجمع المعلومات الأساسية قبل ما تتواصل وتنسّق بنفسك.</p></div>
            <div className="steps">
              <div className="step"><span className="step-num">٠١</span><h3>حدّد احتياجك</h3><p>ابحث بالخدمة أو اختر المنطقة المناسبة لك.</p></div>
              <div className="step"><span className="step-num">٠٢</span><h3>قارن الخيارات</h3><p>اطّلع على التقييم والخبرة ونطاق السعر.</p></div>
              <div className="step"><span className="step-num">٠٣</span><h3>تواصل وتفاهم</h3><p>ناقش التفاصيل والموعد مباشرة مع مقدم الخدمة.</p></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner"><Brand /><span className="demo-disclaimer">دليل تجريبي ببيانات توضيحية فقط. الأسماء والتقييمات والأسعار ليست عروضاً حقيقية ولا يتم إرسال أي طلبات.</span><span>صباغ الكويت · دليل خدمات المنازل</span></div>
      </footer>
      <div className="mobile-bottom"><span>تبحث عن صبّاغ؟ ابدأ من منطقتك</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>ابدأ البحث</button></div>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
          <div className="modal-head"><div><h2 id="details-title" className="modal-title">ملف مقدم الخدمة</h2><p className="modal-subtitle">معلومات توضيحية ضمن النسخة التجريبية</p></div><button className="close-button" type="button" onClick={() => setSelected(null)} aria-label="إغلاق التفاصيل"><X /></button></div>
          <div className="profile-heading"><div className={`avatar ${selected.tone}`}>{selected.initials}</div><div><h3>{selected.name}</h3><p><MapPin size={13} /> {selected.region}، الكويت</p></div></div>
          <div className="detail-stats"><div className="detail-stat"><strong>{selected.rating} <Star size={12} fill="currentColor" /></strong><span>تقييم توضيحي</span></div><div className="detail-stat"><strong>{selected.reviews}</strong><span>مراجعة تجريبية</span></div><div className="detail-stat"><strong>{selected.years} سنوات</strong><span>خبرة مدرجة</span></div></div>
          <div className="modal-section"><h4>نبذة</h4><p>{selected.description}</p></div>
          <div className="modal-section"><h4>الخدمات</h4><div className="modal-tags">{selected.services.map((item) => <span className="modal-tag" key={item}>{item}</span>)}</div></div>
          <div className="modal-section"><h4>السعر الإرشادي</h4><p>يبدأ من <strong>{selected.startingAt}</strong> للغرفة. السعر النهائي يعتمد على المساحة ونوع المواد.</p></div>
          <button className="contact-button modal-action" type="button" onClick={() => { setContacting(selected); setSelected(null); setPreviewed(false); }}>اطلب معلومات التواصل</button>
        </section>
      </div>}

      {contacting && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setContacting(null); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
          <div className="modal-head"><div><h2 id="contact-title" className="modal-title">تواصل مع {contacting.name}</h2><p className="modal-subtitle">نموذج توضيحي — لن يتم إرسال بياناتك</p></div><button className="close-button" type="button" onClick={() => setContacting(null)} aria-label="إغلاق نموذج التواصل"><X /></button></div>
          {previewed ? <div className="success-note" role="status" data-testid="status-contact-preview"><Check size={17} /> تمت معاينة طلبك داخل هذه الصفحة فقط. لم يتم إرسال أي بيانات أو التواصل مع مقدم الخدمة.</div> :
            <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setPreviewed(true); }}>
              <label className="form-label" htmlFor="contact-name">اسمك</label><input className="form-input" id="contact-name" name="name" required placeholder="اكتب اسمك" data-testid="input-contact-name" />
              <label className="form-label" htmlFor="contact-phone">رقم الهاتف</label><input className="form-input" id="contact-phone" name="phone" required inputMode="tel" pattern="[0-9+٠-٩\s-]{7,}" placeholder="مثال: 5XXXXXXX" data-testid="input-contact-phone" />
              <label className="form-label" htmlFor="contact-message">شنو الخدمة اللي تحتاجها؟</label><textarea className="form-textarea" id="contact-message" name="message" placeholder="اكتب تفاصيل مختصرة عن المكان أو العمل" data-testid="input-contact-message" />
              <button className="contact-button modal-action" type="submit">معاينة الطلب</button><p className="form-note">للتوضيح فقط: لا يوجد إرسال أو اتصال حقيقي في هذه النسخة. استخدم المعلومات كمثال على تجربة التواصل.</p>
            </form>
          }
          {previewed && <button className="detail-button modal-action" type="button" onClick={() => setContacting(null)}>إغلاق</button>}
        </section>
      </div>}
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
