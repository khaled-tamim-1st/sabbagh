/**
 * Kuwait Painters Platform - Unified Catalog & State Store
 * Manages persistent state for painters, reviews, and lead quotes.
 * Supports LocalStorage persistence, multi-tab live sync, and backend API sync.
 */

import { PAINTERS_DATA, type Painter, type PortfolioProject, type PortfolioImage, generatePainterSlug } from '@/data/painters';
import { apiClient } from '@/lib/api-client';

export interface LeadQuote {
  id: number;
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
  propertyType: string;
  workType: string;
  roomsCount: number;
  includeMaterials?: boolean;
  paintQuality?: string;
  preferredDate?: string;
  governorateId: string;
  areaId: string;
  estimatedMinKwd: number;
  estimatedMaxKwd: number;
  estimatedAverageKwd: number;
  assignedPainterId?: number | null;
  status: 'new' | 'assigned' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ReviewItem {
  id: number;
  painterId: number;
  author: string;
  whatsapp?: string;
  authorPhone?: string;
  date: string;
  rating: number;
  area: string;
  comment: string;
  serviceType: string;
  verified: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

const STORAGE_KEYS = {
  PAINTERS: 'kuwait_painters_catalog_empty_v2',
  REVIEWS: 'kuwait_painters_reviews_empty_v2',
  QUOTES: 'kuwait_painters_quotes_empty_v2',
};

const EVENT_NAME = 'kuwait-catalog-updated';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function buildInitialReviews(): ReviewItem[] {
  let counter = 1;
  const list: ReviewItem[] = [];
  for (const p of PAINTERS_DATA) {
    if (Array.isArray(p.customerReviews)) {
      for (const r of p.customerReviews) {
        list.push({
          id: r.id || counter++,
          painterId: p.id,
          author: r.author,
          whatsapp: p.whatsapp || p.phone,
          authorPhone: p.phone,
          date: r.date,
          rating: r.rating,
          area: r.area,
          comment: r.comment,
          serviceType: r.serviceType,
          verified: r.verified !== false,
          status: 'approved',
        });
      }
    }
  }
  return list;
}

export const INITIAL_QUOTES: LeadQuote[] = [];

class CatalogStore {
  private painters: Painter[] = [];
  private reviews: ReviewItem[] = [];
  private quotes: LeadQuote[] = [];
  private listeners: Set<() => void> = new Set();
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (!isBrowser()) {
      this.reviews = buildInitialReviews();
      this.painters = [...PAINTERS_DATA];
      this.syncPaintersReviewCounts();
      this.quotes = [...INITIAL_QUOTES];
      return;
    }

    try {
      localStorage.removeItem('kuwait_painters_catalog_v1');
      localStorage.removeItem('kuwait_painters_catalog_v2');
      localStorage.removeItem('kuwait_painters_catalog_v3');
      localStorage.removeItem('kuwait_painters_reviews_v3');
      localStorage.removeItem('kuwait_painters_quotes_v3');
      localStorage.removeItem('kuwait_painters_catalog_clean_v1');
      localStorage.removeItem('kuwait_painters_reviews_clean_v1');
      localStorage.removeItem('kuwait_painters_quotes_clean_v1');
    } catch {}

    this.loadFromStorage();
    this.initialized = true;

    // Cross-tab synchronization
    window.addEventListener('storage', (e) => {
      if (
        e.key === STORAGE_KEYS.PAINTERS ||
        e.key === STORAGE_KEYS.REVIEWS ||
        e.key === STORAGE_KEYS.QUOTES
      ) {
        this.loadFromStorage();
        this.notify();
      }
    });

    // Same-window live update event
    window.addEventListener(EVENT_NAME, () => {
      this.loadFromStorage();
      this.notify();
    });
  }

  private syncPaintersReviewCounts() {
    const countsMap = new Map<number, number>();
    for (const r of this.reviews) {
      if (r.status === 'approved') {
        countsMap.set(r.painterId, (countsMap.get(r.painterId) || 0) + 1);
      }
    }
    this.painters = this.painters.map((p) => {
      const actualCount = countsMap.has(p.id)
        ? countsMap.get(p.id)!
        : (Array.isArray(p.customerReviews)
            ? p.customerReviews.filter((r: any) => (r.status || 'approved') === 'approved').length
            : (typeof p.reviews === 'number' ? p.reviews : 0));
      return {
        ...p,
        reviews: actualCount,
      };
    });
  }

  private loadFromStorage() {
    if (!isBrowser()) return;

    // 1. Reviews
    try {
      const rawR = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (rawR) {
        const parsed = JSON.parse(rawR);
        this.reviews = Array.isArray(parsed) && parsed.length > 0 ? parsed : buildInitialReviews();
      } else {
        this.reviews = buildInitialReviews();
      }
    } catch {
      this.reviews = buildInitialReviews();
    }

    // 2. Painters
    try {
      const rawP = localStorage.getItem(STORAGE_KEYS.PAINTERS);
      if (rawP) {
        const parsed = JSON.parse(rawP);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingMap = new Map<number, Painter>(parsed.map((p: Painter) => [p.id, p]));
          const baseIds = new Set(PAINTERS_DATA.map(p => p.id));
          const customPainters = parsed.filter(p => !baseIds.has(p.id));
          const mergedBase = PAINTERS_DATA.map((base) => {
            const saved = existingMap.get(base.id);
            if (saved) {
              return {
                ...base,
                ...saved,
                status: saved.status || base.status || 'approved',
                isVerified: saved.isVerified !== undefined ? saved.isVerified : base.isVerified,
                displayOrder: saved.displayOrder !== undefined ? saved.displayOrder : base.displayOrder,
              };
            }
            return base;
          });
          this.painters = [...mergedBase, ...customPainters].sort((a, b) => (a.displayOrder ?? a.id) - (b.displayOrder ?? b.id));
        } else {
          this.painters = [...PAINTERS_DATA];
        }
      } else {
        this.painters = [...PAINTERS_DATA];
      }
    } catch {
      this.painters = [...PAINTERS_DATA];
    }

    // Synchronize review counts from actual approved reviews
    this.syncPaintersReviewCounts();

    // 3. Quotes
    try {
      const rawQ = localStorage.getItem(STORAGE_KEYS.QUOTES);
      if (rawQ) {
        const parsed = JSON.parse(rawQ);
        this.quotes = Array.isArray(parsed) ? parsed : [...INITIAL_QUOTES];
      } else {
        this.quotes = [...INITIAL_QUOTES];
      }
    } catch {
      this.quotes = [...INITIAL_QUOTES];
    }
  }

  private savePainters() {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PAINTERS, JSON.stringify(this.painters));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch (err) {
      console.error('Failed to save painters to localStorage:', err);
    }
  }

  private saveReviews() {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(this.reviews));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch (err) {
      console.error('Failed to save reviews to localStorage:', err);
    }
  }

  private saveQuotes() {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(this.quotes));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch (err) {
      console.error('Failed to save quotes to localStorage:', err);
    }
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('CatalogStore listener error:', err);
      }
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // --- Painters Accessors & Mutators ---

  /** Returns all painters (including suspended/pending for admin view) */
  public getAllPainters(): Painter[] {
    if (!this.initialized && isBrowser()) this.loadFromStorage();
    return [...this.painters];
  }

  /** Returns ONLY approved painters, properly sorted by displayOrder */
  public getApprovedPainters(): Painter[] {
    if (!this.initialized && isBrowser()) this.loadFromStorage();
    return this.painters
      .filter((p) => (p.status || 'approved') === 'approved')
      .sort((a, b) => (a.displayOrder ?? a.id) - (b.displayOrder ?? b.id));
  }

  public getPainterById(idOrSlug: string | number): Painter | undefined {
    if (!this.initialized && isBrowser()) this.loadFromStorage();
    const str = String(idOrSlug).trim();
    const numericId = Number(str);

    return this.painters.find((p) => {
      if (!isNaN(numericId) && p.id === numericId) return true;
      if (p.slug && p.slug === str) return true;
      const computedSlug = generatePainterSlug(p.name, p.id);
      return computedSlug === str || decodeURIComponent(str) === computedSlug || decodeURIComponent(str) === p.name;
    });
  }

  public updatePainterStatus(
    id: number,
    newStatus: 'approved' | 'pending' | 'rejected' | 'suspended'
  ): void {
    this.painters = this.painters.map((p) =>
      p.id === id
        ? {
            ...p,
            status: newStatus,
            isVerified: newStatus === 'approved' ? true : p.isVerified,
          }
        : p
    );
    this.savePainters();
    this.notify();

    // Async background API sync
    apiClient
      .patch(`/admin/painters/${id}/status`, {
        status: newStatus,
        isVerified: newStatus === 'approved' ? true : undefined,
      })
      .catch((err) => {
        console.warn('API sync painter status failed (persisted locally):', err);
      });
  }

  public updatePainter(id: number, partial: Partial<Painter>): void {
    const idx = this.painters.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.painters[idx] = { ...this.painters[idx], ...partial };
      this.savePainters();
      this.notify();
    }
  }

  public updatePainterOrder(id: number, newOrder: number): void {
    const validOrder = Math.max(1, Math.floor(newOrder) || 1);
    this.painters = this.painters
      .map((p) => (p.id === id ? { ...p, displayOrder: validOrder } : p))
      .sort((a, b) => (a.displayOrder ?? a.id) - (b.displayOrder ?? b.id));
    this.savePainters();
    this.notify();

    // Async background API sync
    apiClient
      .patch(`/admin/painters/${id}/order`, { displayOrder: validOrder })
      .catch((err) => {
        console.warn('API sync painter order failed (persisted locally):', err);
      });
  }

  public togglePainterVerified(id: number): void {
    const target = this.painters.find((p) => p.id === id);
    if (!target) return;
    const newVerified = !target.isVerified;

    this.painters = this.painters.map((p) =>
      p.id === id ? { ...p, isVerified: newVerified } : p
    );
    this.savePainters();
    this.notify();

    apiClient
      .patch(`/admin/painters/${id}/verify`, { isVerified: newVerified })
      .catch((err) => {
        console.warn('API sync painter verification failed (persisted locally):', err);
      });
  }

  public addPainter(painterData: Partial<Painter>): Painter {
    if (!this.initialized && isBrowser()) this.loadFromStorage();
    const maxId = this.painters.length > 0 ? Math.max(...this.painters.map((p) => p.id)) : 0;
    const newId = maxId + 1;
    const name = (painterData.name || 'صباغ جديد').trim();
    const slug = painterData.slug || generatePainterSlug(name, newId);

    const newPainter: Painter = {
      id: newId,
      slug,
      name,
      avatarUrl: painterData.avatarUrl || painterData.avatar || null,
      avatar: (painterData.avatar || painterData.avatarUrl) || undefined,
      avatarPublicId: painterData.avatarPublicId || null,
      initials: painterData.initials || name.slice(0, 2),
      region: painterData.region || painterData.governorates?.[0] || 'الكويت',
      rating: '5.0',
      reviews: 0,
      years: Number(painterData.years) || 5,
      startingAt: painterData.startingAt || '18 د.ك',
      priceStart: painterData.priceStart || 18,
      services:
        painterData.services && painterData.services.length > 0
          ? painterData.services
          : ['دهان داخلي', 'معجون وتنعيم أسقف'],
      description:
        painterData.description ||
        (painterData.accountType === 'company'
          ? 'مؤسسة متخصصة في أعمال الأصباغ والتشطيبات الحديثة في الكويت.'
          : 'صباغ محترف بخبرة في الدهانات والتشطيب.'),
      tone: painterData.tone || 'ochre',
      phone: painterData.phone || '',
      whatsapp: painterData.whatsapp || painterData.phone || '',
      whatsappPrefill:
        painterData.whatsappPrefill ||
        `السلام عليكم معلم ${name}، اطلعت على ملفك في دليل صباغ الكويت وأود حجز موعد معاينة.`,
      bio: painterData.bio || painterData.description || 'فني صباغة وتشطيبات معتمد في الكويت.',
      governorates:
        painterData.governorates && painterData.governorates.length > 0
          ? painterData.governorates
          : ['العاصمة', 'حولي'],
      warrantyYears: painterData.warrantyYears || 3,
      crewSize: painterData.crewSize || 3,
      paintBrands: painterData.paintBrands || ['جوتن', 'كابارول'],
      completedProjects: painterData.completedProjects || 0,
      pricingList: painterData.pricingList || [],
      gallery: painterData.gallery || [],
      customerReviews: [],
      portfolioProjects: painterData.portfolioProjects || [],
      isAvailableToday:
        painterData.isAvailableToday !== undefined ? painterData.isAvailableToday : true,
      responseTime: painterData.responseTime || 'خلال 15 دقيقة',
      coverageAreaIds: painterData.coverageAreaIds || [],
      primaryGovernorates: painterData.primaryGovernorates || ['capital', 'hawalli'],
      isVerified: false,
      status: 'pending', // Starts as pending so it appears in Admin -> Applications tab!
      accountType: painterData.accountType || 'individual',
      companyName: painterData.companyName || null,
      managerName: painterData.managerName || null,
      commercialLicense: painterData.commercialLicense || null,
      sampleWorkImages: painterData.sampleWorkImages || [],
      displayOrder: this.painters.length + 1,
    };

    this.painters = [newPainter, ...this.painters];
    this.savePainters();
    this.notify();

    apiClient.post('/auth/register-painter', painterData).catch((err) => {
      console.warn('API sync painter registration failed (persisted locally):', err);
    });

    return newPainter;
  }

  public updatePainterPortfolio(
    painterId: number,
    portfolioProjects: PortfolioProject[]
  ): void {
    if (!this.initialized && isBrowser()) this.loadFromStorage();
    this.painters = this.painters.map((p) =>
      p.id === painterId
        ? {
            ...p,
            portfolioProjects,
            sampleWorkImages:
              portfolioProjects.length > 0 && portfolioProjects[0].galleryImages
                ? portfolioProjects[0].galleryImages
                : p.sampleWorkImages,
          }
        : p
    );
    this.savePainters();
    this.notify();

    apiClient
      .put(`/painter/portfolio`, { painterId, portfolioProjects })
      .catch((err) => {
        console.warn('API sync portfolio failed (persisted locally):', err);
      });
  }

  // --- Reviews Accessors & Mutators ---

  public getAllReviews(): ReviewItem[] {
    if (!this.initialized && isBrowser()) this.loadFromStorage();
    return [...this.reviews];
  }

  public getApprovedReviewsForPainter(painterId: number): ReviewItem[] {
    if (!this.initialized && isBrowser()) this.loadFromStorage();
    return this.reviews.filter(
      (r) => r.painterId === painterId && r.status === 'approved'
    );
  }

  public addReview(review: {
    painterId: number;
    author: string;
    whatsapp?: string;
    rating: number;
    area?: string;
    comment: string;
    serviceType?: string;
    status?: 'approved' | 'pending' | 'rejected';
  }): ReviewItem {
    if (!this.initialized && isBrowser()) this.loadFromStorage();
    const newId = this.reviews.length > 0 ? Math.max(...this.reviews.map((r) => r.id)) + 1 : 1;
    const painter = this.painters.find((p) => p.id === review.painterId);

    const newReview: ReviewItem = {
      id: newId,
      painterId: review.painterId,
      author: review.author.trim() || 'عميل محترم',
      whatsapp: review.whatsapp?.trim() || '',
      authorPhone: review.whatsapp?.trim() || '',
      date: 'اليوم',
      rating: Number(review.rating) || 5,
      area: review.area?.trim() || painter?.region || 'الكويت',
      comment: review.comment.trim(),
      serviceType: review.serviceType?.trim() || 'تشطيب ودهان عام',
      verified: true,
      status: review.status || 'pending', // Pending so admin can review and approve!
    };

    this.reviews = [newReview, ...this.reviews];
    this.saveReviews();
    this.syncPaintersReviewCounts();
    this.savePainters();
    this.notify();

    apiClient
      .post(`/public/painters/${review.painterId}/reviews`, {
        author: newReview.author,
        whatsapp: newReview.whatsapp,
        rating: newReview.rating,
        area: newReview.area,
        serviceType: newReview.serviceType,
        comment: newReview.comment,
      })
      .catch((err) => {
        console.warn('API sync review creation failed (persisted locally):', err);
      });

    return newReview;
  }

  public updateReviewStatus(
    reviewId: number,
    newStatus: 'approved' | 'pending' | 'rejected'
  ): void {
    this.reviews = this.reviews.map((r) =>
      r.id === reviewId
        ? { ...r, status: newStatus, verified: newStatus === 'approved' }
        : r
    );
    this.saveReviews();
    this.syncPaintersReviewCounts();
    this.savePainters();
    this.notify();

    apiClient
      .patch(`/admin/reviews/${reviewId}/status`, { status: newStatus })
      .catch((err) => {
        console.warn('API sync review status failed (persisted locally):', err);
      });
  }

  // --- Quotes Accessors & Mutators ---

  public getAllQuotes(): LeadQuote[] {
    if (!this.initialized && isBrowser()) this.loadFromStorage();
    return [...this.quotes];
  }

  public updateQuoteStatus(
    quoteId: number,
    status: LeadQuote['status'],
    assignedPainterId?: number | null
  ): void {
    this.quotes = this.quotes.map((q) =>
      q.id === quoteId
        ? {
            ...q,
            status,
            assignedPainterId:
              assignedPainterId !== undefined ? assignedPainterId : q.assignedPainterId,
          }
        : q
    );
    this.saveQuotes();
    this.notify();

    apiClient
      .patch(`/admin/quotes/${quoteId}`, { status, assignedPainterId })
      .catch((err) => {
        console.warn('API sync quote status failed (persisted locally):', err);
      });
  }

  public addQuote(quote: Partial<LeadQuote>): LeadQuote {
    const newQuote: LeadQuote = {
      id: Date.now(),
      customerName: quote.customerName || 'عميل مجهول',
      customerPhone: quote.customerPhone || '',
      customerNotes: quote.customerNotes || '',
      propertyType: quote.propertyType || 'apartment',
      workType: quote.workType || 'interior',
      roomsCount: quote.roomsCount || 1,
      includeMaterials: quote.includeMaterials || false,
      paintQuality: quote.paintQuality || 'standard',
      preferredDate: quote.preferredDate || 'صباحاً',
      governorateId: quote.governorateId || 'capital',
      areaId: quote.areaId || '',
      estimatedMinKwd: quote.estimatedMinKwd || 30,
      estimatedMaxKwd: quote.estimatedMaxKwd || 80,
      estimatedAverageKwd: quote.estimatedAverageKwd || 55,
      assignedPainterId: quote.assignedPainterId || null,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    this.quotes = [newQuote, ...this.quotes];
    this.saveQuotes();
    this.notify();

    apiClient.post('/public/quotes', newQuote).catch((err) => {
      console.warn('API sync quote creation failed (persisted locally):', err);
    });

    return newQuote;
  }

  // --- Reset Function ---
  public resetCatalog(): void {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.PAINTERS);
      localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.QUOTES);
      this.reviews = buildInitialReviews();
      this.painters = [...PAINTERS_DATA];
      this.syncPaintersReviewCounts();
      this.quotes = [...INITIAL_QUOTES];
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
      this.notify();
    } catch (err) {
      console.error('Failed to reset catalog:', err);
    }
  }
}

export const catalogStore = new CatalogStore();
export default catalogStore;
