'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from '@/lib/nav';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import { Layout } from '@/components/layout';
import { PAINTERS_DATA, type Painter, type PortfolioImage } from '@/data/painters';
import {
  ShieldCheck,
  Users,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Phone,
  MessageCircle,
  BadgeCheck,
  ChevronDown,
  Layers,
  Sparkles,
  UserCheck,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Building,
  User,
  Check,
  X,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';

interface LeadQuote {
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

interface ReviewItem {
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

const INITIAL_FALLBACK_REVIEWS: ReviewItem[] = PAINTERS_DATA.flatMap((p) =>
  (p.customerReviews || []).map((r) => ({
    id: r.id,
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
    status: 'approved' as const,
  }))
);

const INITIAL_FALLBACK_QUOTES: LeadQuote[] = [
  {
    id: 1,
    customerName: 'عبدالله الهاجري',
    customerPhone: '96590111115',
    customerNotes: 'صبغ ديوانية وصالة استقبال بالأوف وايت وجبس بورد',
    propertyType: 'villa',
    workType: 'interior',
    roomsCount: 4,
    includeMaterials: true,
    paintQuality: 'jotun-fenomastic',
    governorateId: 'hawalli',
    areaId: 'al-jabriya',
    preferredDate: 'صباحاً',
    estimatedMinKwd: 60,
    estimatedMaxKwd: 110,
    estimatedAverageKwd: 85,
    assignedPainterId: 1,
    status: 'new',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    customerName: 'أم فهد الخالدي',
    customerPhone: '96594412356',
    customerNotes: 'تجديد دهان غرفتين نوم وصنفرة شروخ',
    propertyType: 'apartment',
    workType: 'interior',
    roomsCount: 2,
    includeMaterials: true,
    paintQuality: 'jotun-fenomastic',
    governorateId: 'capital',
    areaId: 'al-dasma',
    preferredDate: 'عصراً',
    estimatedMinKwd: 40,
    estimatedMaxKwd: 65,
    estimatedAverageKwd: 52,
    assignedPainterId: 2,
    status: 'contacted',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 3,
    customerName: 'فهد المطيري',
    customerPhone: '96590111104',
    customerNotes: 'تركيب ورق جدران وبديل رخام لجدار التلفزيون',
    propertyType: 'villa',
    workType: 'decorative',
    roomsCount: 1,
    includeMaterials: true,
    paintQuality: 'caparol',
    governorateId: 'farwaniyah',
    areaId: 'al-firdous',
    preferredDate: 'أقرب وقت',
    estimatedMinKwd: 35,
    estimatedMaxKwd: 55,
    estimatedAverageKwd: 45,
    assignedPainterId: 5,
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation('/login');
      } else if (user.role !== 'admin') {
        setLocation('/painter');
      }
    }
  }, [user, authLoading, setLocation]);

  const [activeTab, setActiveTab] = useState<'applications' | 'painters' | 'leads' | 'reviews'>('painters');
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; title: string } | null>(null);

  // Painters State initialized with complete 17 painters
  const [painters, setPainters] = useState<Painter[]>(PAINTERS_DATA);
  const [painterSearch, setPainterSearch] = useState('');
  const [painterGovFilter, setPainterGovFilter] = useState('الكل');
  const [painterStatusFilter, setPainterStatusFilter] = useState('الكل');

  // Leads State initialized with fallback quotes
  const [leads, setLeads] = useState<LeadQuote[]>(INITIAL_FALLBACK_QUOTES);
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');

  // Reviews State initialized with real customer reviews
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_FALLBACK_REVIEWS);

  // Fetch real data from API on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const remotePainters = await apiClient.get('/admin/painters');
        if (Array.isArray(remotePainters) && remotePainters.length > 0) {
          setPainters(remotePainters);
        }
      } catch (err) {
        console.warn('Error fetching painters for admin, using local catalog:', err);
      }

      try {
        const remoteQuotes = await apiClient.get('/admin/quotes');
        if (Array.isArray(remoteQuotes) && remoteQuotes.length > 0) {
          setLeads(remoteQuotes);
        }
      } catch (err) {
        console.warn('Error fetching leads for admin, using local fallback:', err);
      }

      try {
        const remoteReviews = await apiClient.get('/admin/reviews');
        if (Array.isArray(remoteReviews) && remoteReviews.length > 0) {
          setReviews(remoteReviews);
        }
      } catch (err) {
        console.warn('Error fetching reviews for admin, using local fallback:', err);
      }
    };

    fetchAdminData();
  }, []);

  // Handlers for Painters Tab
  const togglePainterVerified = async (id: number) => {
    const target = painters.find((p) => p.id === id);
    if (!target) return;
    const newVerified = !target.isVerified;

    setPainters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVerified: newVerified } : p))
    );

    try {
      await apiClient.patch(`/admin/painters/${id}/verify`, { isVerified: newVerified });
    } catch (err) {
      console.warn('API verify painter failed, local state maintained', err);
    }
  };

  const movePainterOrder = async (id: number, delta: number) => {
    const targetIdx = painters.findIndex((p) => p.id === id);
    if (targetIdx === -1) return;

    const currentOrder = painters[targetIdx].displayOrder ?? (targetIdx + 1);
    const newOrder = Math.max(1, currentOrder + delta);
    if (newOrder === currentOrder) return;

    const updated = painters.map((p) => {
      if (p.id === id) {
        return { ...p, displayOrder: newOrder };
      }
      return p;
    }).sort((a, b) => (a.displayOrder ?? a.id) - (b.displayOrder ?? b.id));

    setPainters(updated);

    try {
      await apiClient.patch(`/admin/painters/${id}/order`, { displayOrder: newOrder });
    } catch (err) {
      console.warn('Could not persist order to API, kept locally:', err);
    }
  };

  const setPainterOrderDirect = async (id: number, newOrder: number) => {
    const validOrder = Math.max(1, Math.floor(newOrder) || 1);
    const updated = painters.map((p) => {
      if (p.id === id) {
        return { ...p, displayOrder: validOrder };
      }
      return p;
    }).sort((a, b) => (a.displayOrder ?? a.id) - (b.displayOrder ?? b.id));

    setPainters(updated);

    try {
      await apiClient.patch(`/admin/painters/${id}/order`, { displayOrder: validOrder });
    } catch (err) {
      console.warn('Could not persist order to API, kept locally:', err);
    }
  };

  const changePainterStatus = async (id: number, newStatus: 'approved' | 'pending' | 'rejected' | 'suspended') => {
    setPainters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus, isVerified: newStatus === 'approved' ? true : p.isVerified } : p))
    );

    try {
      await apiClient.patch(`/admin/painters/${id}/status`, {
        status: newStatus,
        isVerified: newStatus === 'approved' ? true : undefined,
      });
    } catch (err) {
      console.warn('API status change failed, local state maintained', err);
    }
  };

  // Handlers for Leads Tab
  const changeLeadStatus = async (leadId: number, newStatus: LeadQuote['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      await apiClient.patch(`/admin/quotes/${leadId}`, { status: newStatus });
    } catch (err) {
      console.warn('API lead status change failed, local state maintained', err);
    }
  };

  const assignPainterToLead = async (leadId: number, painterId: number | null) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assignedPainterId: painterId,
              status: painterId ? 'assigned' : 'new',
            }
          : l
      )
    );

    try {
      await apiClient.patch(`/admin/quotes/${leadId}`, {
        assignedPainterId: painterId,
        status: painterId ? 'assigned' : 'new',
      });
    } catch (err) {
      console.warn('API lead assignment failed, local state maintained', err);
    }
  };

  // Handlers for Reviews Tab
  const changeReviewStatus = async (reviewId: number, newStatus: 'approved' | 'pending' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, status: newStatus, verified: newStatus === 'approved' } : r
      )
    );

    try {
      await apiClient.patch(`/admin/reviews/${reviewId}/status`, { status: newStatus });
    } catch (err) {
      console.warn('API review status change failed, local state maintained', err);
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalP = painters.length;
    const verifiedP = painters.filter((p) => p.isVerified).length;
    const verifiedPercent = totalP > 0 ? Math.round((verifiedP / totalP) * 100) : 0;
    const pendingP = painters.filter((p) => p.status === 'pending').length;
    const newLeadsCount = leads.filter((l) => l.status === 'new').length;

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '4.9';

    return {
      totalPainters: totalP,
      verifiedPercent,
      pendingPainters: pendingP,
      newLeads: newLeadsCount,
      averageRating: avgRating,
    };
  }, [painters, leads, reviews]);

  // Filtered Painters
  const filteredPainters = useMemo(() => {
    return painters.filter((p) => {
      const matchSearch =
        !painterSearch.trim() ||
        p.name.toLowerCase().includes(painterSearch.toLowerCase()) ||
        p.phone.includes(painterSearch) ||
        p.region.includes(painterSearch);

      const matchGov =
        painterGovFilter === 'الكل' ||
        p.region.includes(painterGovFilter) ||
        (p.governorates && p.governorates.includes(painterGovFilter));

      const matchStatus =
        painterStatusFilter === 'الكل' || p.status === painterStatusFilter;

      return matchSearch && matchGov && matchStatus;
    }).sort((a, b) => {
      const orderA = a.displayOrder !== undefined ? a.displayOrder : a.id;
      const orderB = b.displayOrder !== undefined ? b.displayOrder : b.id;
      return orderA - orderB;
    });
  }, [painters, painterSearch, painterGovFilter, painterStatusFilter]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    if (leadStatusFilter === 'all') return leads;
    return leads.filter((l) => l.status === leadStatusFilter);
  }, [leads, leadStatusFilter]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#17483e' }}>
          <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600 }}>جاري التحقق من صلاحيات مدير النظام...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeNav="/admin">
      <div dir="rtl" style={{ background: '#f5efe3', minHeight: '100vh', paddingBottom: '60px' }}>
        {/* Admin Dashboard Header */}
        <section
          style={{
            background: 'linear-gradient(135deg, #17483e 0%, #0d2e27 100%)',
            color: '#fff9ee',
            padding: '36px 0 28px',
            borderBottom: '3px solid #e9bd77',
          }}
        >
          <div style={{ width: 'min(1240px, calc(100% - 48px))', margin: 'auto' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span
                    style={{
                      background: 'rgba(233,189,119,0.2)',
                      color: '#e9bd77',
                      border: '1px solid #e9bd77',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    لوحة تحكم المشرف الأعلى
                  </span>
                  <span style={{ fontSize: '13px', color: '#b9cbbe' }}>مرحباً، {user.name}</span>
                </div>
                <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0 }}>
                  إدارة منصة صباغ الكويت
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff9ee',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={14} />
                  <span>تحديث البيانات</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  style={{
                    background: '#c7664f',
                    color: '#fff',
                    border: '0',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  تسجيل خروج
                </button>
              </div>
            </div>
          </div>
        </section>

        <div style={{ width: 'min(1240px, calc(100% - 48px))', margin: '30px auto 0' }}>
          {/* Top KPI Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '30px',
            }}
          >
            {/* Card 1: Total Painters & Verified % */}
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#687266', fontWeight: 600 }}>إجمالي الصباغين</span>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#17483e', marginTop: '4px' }}>
                    {stats.totalPainters}
                  </div>
                </div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#eef5f1',
                    color: '#17483e',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Users size={20} />
                </div>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#2d6a4f' }}>
                <BadgeCheck size={14} color="#e9bd77" />
                <span>{stats.verifiedPercent}% موثقون بشارة الاعتماد الرسمية</span>
              </div>
            </div>

            {/* Card 2: Pending Approval Painters */}
            <div
              onClick={() => setActiveTab('applications')}
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#687266', fontWeight: 600 }}>بانتظار الاعتماد (انقر للعرض)</span>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#c7664f', marginTop: '4px' }}>
                    {stats.pendingPainters}
                  </div>
                </div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#fdf3f0',
                    color: '#c7664f',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '11px', color: stats.pendingPainters > 0 ? '#c7664f' : '#687266' }}>
                {stats.pendingPainters > 0 ? '⚠️ يتطلب مراجعة فورية للملفات' : '✅ لا توجد طلبات معلقة حالياً'}
              </div>
            </div>

            {/* Card 3: New Leads / Quote Requests */}
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#687266', fontWeight: 600 }}>طلبات المعاينة الجديدة</span>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#17483e', marginTop: '4px' }}>
                    {stats.newLeads}
                  </div>
                </div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#fcf7ec',
                    color: '#c48927',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Sparkles size={20} />
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '11px', color: '#687266' }}>
                إجمالي مسجل في بايبلاين المعاينات: <strong>{leads.length}</strong>
              </div>
            </div>

            {/* Card 4: Average Customer Rating */}
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#687266', fontWeight: 600 }}>متوسط التقييم العام</span>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#17483e', marginTop: '4px' }}>
                    {stats.averageRating} <span style={{ fontSize: '16px', color: '#c48927' }}>★</span>
                  </div>
                </div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#fcf7ec',
                    color: '#c48927',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Star size={20} fill="currentColor" />
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '11px', color: '#687266' }}>
                مبني على <strong>{reviews.length}</strong> تقييم ومراجعة من العملاء
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '2px solid #e2d7c5',
              marginBottom: '24px',
              overflowX: 'auto',
              paddingBottom: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 700,
                border: '0',
                background: 'transparent',
                cursor: 'pointer',
                color: activeTab === 'applications' ? '#17483e' : '#687266',
                borderBottom: activeTab === 'applications' ? '3px solid #17483e' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <AlertTriangle size={16} color={stats.pendingPainters > 0 ? '#c7664f' : '#687266'} />
              <span>طلبات الانضمام الجديدة</span>
              {stats.pendingPainters > 0 && (
                <span
                  style={{
                    background: '#c7664f',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                  }}
                >
                  {stats.pendingPainters} جديد
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('painters')}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 700,
                border: '0',
                background: 'transparent',
                cursor: 'pointer',
                color: activeTab === 'painters' ? '#17483e' : '#687266',
                borderBottom: activeTab === 'painters' ? '3px solid #17483e' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <Users size={16} />
              <span>إدارة الصباغين والورش ({painters.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 700,
                border: '0',
                background: 'transparent',
                cursor: 'pointer',
                color: activeTab === 'leads' ? '#17483e' : '#687266',
                borderBottom: activeTab === 'leads' ? '3px solid #17483e' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <Sparkles size={16} />
              <span>طلبات المعاينة (Leads) ({leads.length})</span>
              {stats.newLeads > 0 && (
                <span
                  style={{
                    background: '#c7664f',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '11px',
                    padding: '1px 7px',
                  }}
                >
                  {stats.newLeads}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 700,
                border: '0',
                background: 'transparent',
                cursor: 'pointer',
                color: activeTab === 'reviews' ? '#17483e' : '#687266',
                borderBottom: activeTab === 'reviews' ? '3px solid #17483e' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <Star size={16} />
              <span>تقييمات العملاء ({reviews.length})</span>
            </button>
          </div>

          {/* TAB 0: NEW JOIN APPLICATIONS */}
          {activeTab === 'applications' && (
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #ede3d2',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#17483e', margin: '0 0 6px 0' }}>
                    طلبات انضمام الصباغين والورش الجديدة
                  </h2>
                  <p style={{ margin: 0, fontSize: '13px', color: '#687266' }}>
                    راجع بيانات وطلبات المؤسسات والورش والفنيين المستقلين وعينات أعمالهم واتخذ قرار القبول والتوثيق المباشر أو الرفض
                  </p>
                </div>
                <div
                  style={{
                    background: stats.pendingPainters > 0 ? '#fdf3f0' : '#eef5f1',
                    color: stats.pendingPainters > 0 ? '#c7664f' : '#17483e',
                    border: `1px solid ${stats.pendingPainters > 0 ? '#f2cfc7' : '#c3dcce'}`,
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {stats.pendingPainters > 0 ? (
                    <>
                      <AlertTriangle size={16} />
                      <span>{stats.pendingPainters} طلبات بحاجة لقرار الإدارة</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>جميع طلبات الانضمام معتمدة ولا توجد طلبات معلقة</span>
                    </>
                  )}
                </div>
              </div>

              {painters.filter((p) => p.status === 'pending').length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: '#faf6ee',
                    borderRadius: '14px',
                    border: '1px dashed #dcd4c6',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#eef5f1',
                      color: '#17483e',
                      display: 'grid',
                      placeItems: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#17483e', margin: '0 0 8px 0' }}>
                    لا توجد طلبات انضمام جديدة بانتظار المراجعة
                  </h3>
                  <p style={{ color: '#687266', fontSize: '13px', maxWidth: '480px', margin: '0 auto 20px' }}>
                    تم البت في جميع طلبات الشركات والورش والفنيين. يمكنك متابعة وتعديل بيانات الصباغين المعتمدين من تبويب "إدارة الصباغين والورش".
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('painters')}
                    style={{
                      background: '#17483e',
                      color: '#fff9ee',
                      border: '0',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    عرض الصباغين المعتمدين ({painters.length})
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {painters
                    .filter((p) => p.status === 'pending')
                    .map((applicant) => {
                      const isCompany = applicant.accountType === 'company';
                      const sampleImgs: PortfolioImage[] =
                        applicant.sampleWorkImages && applicant.sampleWorkImages.length > 0
                          ? applicant.sampleWorkImages
                          : (applicant.portfolioProjects?.[0]?.galleryImages || []);

                      return (
                        <div
                          key={applicant.id}
                          style={{
                            border: '1.5px solid #dcd4c6',
                            borderRadius: '16px',
                            background: '#ffffff',
                            padding: '24px',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {/* Header of Application Card */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              flexWrap: 'wrap',
                              gap: '16px',
                              marginBottom: '18px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <img
                                src={applicant.avatar || applicant.avatarUrl || ''}
                                alt={applicant.name}
                                style={{
                                  width: '64px',
                                  height: '64px',
                                  borderRadius: isCompany ? '12px' : '50%',
                                  objectFit: 'cover',
                                  border: '2px solid #e9bd77',
                                }}
                              />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#17483e', margin: 0 }}>
                                    {applicant.name}
                                  </h3>
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      padding: '3px 10px',
                                      borderRadius: '999px',
                                      background: isCompany ? '#eef5f1' : '#fcf7ec',
                                      color: isCompany ? '#17483e' : '#b07718',
                                      border: `1px solid ${isCompany ? '#c3dcce' : '#f1d59f'}`,
                                    }}
                                  >
                                    {isCompany ? <Building size={12} /> : <User size={12} />}
                                    <span>{isCompany ? 'مؤسسة / ورشة صباغة' : 'صباغ فني مستقل'}</span>
                                  </span>
                                  <span
                                    style={{
                                      background: '#fdf3f0',
                                      color: '#c7664f',
                                      border: '1px solid #f2cfc7',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      padding: '3px 10px',
                                      borderRadius: '999px',
                                    }}
                                  >
                                    بانتظار قرار الإدارة
                                  </span>
                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    flexWrap: 'wrap',
                                    fontSize: '13px',
                                    color: '#687266',
                                    marginTop: '6px',
                                  }}
                                >
                                  {isCompany && applicant.managerName && (
                                    <span>
                                      <strong>المدير المسؤول:</strong> {applicant.managerName}
                                    </span>
                                  )}
                                  {isCompany && applicant.commercialLicense && (
                                    <span>
                                      <strong>رقم السجل التجاري:</strong> {applicant.commercialLicense}
                                    </span>
                                  )}
                                  <span>
                                    <strong>{isCompany ? 'طاقم العمل:' : 'سنوات الخبرة:'}</strong>{' '}
                                    {applicant.years} {isCompany ? 'فنيين متفرغين' : 'سنوات بالكويت'}
                                  </span>
                                  <span>
                                    <strong>سعر الغرفة يبدأ من:</strong> {applicant.priceStart || applicant.startingAt || '25'} د.ك
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Direct Action Decision Buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => changePainterStatus(applicant.id, 'approved')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: '#17483e',
                                  color: '#fff9ee',
                                  border: '0',
                                  borderRadius: '10px',
                                  padding: '10px 18px',
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  boxShadow: '0 3px 12px rgba(23,72,62,0.25)',
                                }}
                              >
                                <Check size={16} />
                                <span>قبول واعتماد وتوثيق فوراً</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => changePainterStatus(applicant.id, 'rejected')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: '#fff',
                                  color: '#c7664f',
                                  border: '1px solid #e2c0b8',
                                  borderRadius: '10px',
                                  padding: '10px 16px',
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                <X size={16} />
                                <span>رفض الطلب</span>
                              </button>
                            </div>
                          </div>

                          {/* Contact and Overview row */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                              gap: '14px',
                              padding: '14px',
                              background: '#fbf8f2',
                              borderRadius: '12px',
                              border: '1px solid #ede3d2',
                              marginBottom: '16px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '8px',
                                  background: '#eef5f1',
                                  color: '#17483e',
                                  display: 'grid',
                                  placeItems: 'center',
                                }}
                              >
                                <Phone size={18} />
                              </div>
                              <div>
                                <span style={{ fontSize: '11px', color: '#687266', display: 'block' }}>الهاتف للتواصل</span>
                                <a
                                  href={`tel:${applicant.phone}`}
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: '#17483e',
                                    direction: 'ltr',
                                    display: 'inline-block',
                                    textDecoration: 'none',
                                  }}
                                >
                                  {applicant.phone}
                                </a>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '8px',
                                  background: '#e7f7ed',
                                  color: '#25d366',
                                  display: 'grid',
                                  placeItems: 'center',
                                }}
                              >
                                <MessageCircle size={18} />
                              </div>
                              <div>
                                <span style={{ fontSize: '11px', color: '#687266', display: 'block' }}>مراسلة واتساب</span>
                                <a
                                  href={`https://wa.me/${applicant.whatsapp?.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: '#1b8b47',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <span>فتح محادثة واتساب</span>
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '8px',
                                  background: '#f4ede1',
                                  color: '#846738',
                                  display: 'grid',
                                  placeItems: 'center',
                                }}
                              >
                                <Layers size={18} />
                              </div>
                              <div>
                                <span style={{ fontSize: '11px', color: '#687266', display: 'block' }}>المناطق المشمولة</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#17483e' }}>
                                  {applicant.governorates?.join('، ') || applicant.region}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bio and Services */}
                          <div style={{ marginBottom: '16px' }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#3f473e', lineHeight: 1.6 }}>
                              <strong>نبذة المتقدم:</strong> {applicant.bio || 'لا توجد نبذة إضافية'}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {applicant.services?.map((svc, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    fontSize: '11px',
                                    background: '#eef5f1',
                                    color: '#17483e',
                                    border: '1px solid #d2e4da',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                  }}
                                >
                                  {svc}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Work Samples / Images Gallery */}
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '10px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#17483e' }}>
                                <ImageIcon size={15} color="#e9bd77" />
                                <span>صور نماذج الأعمال المرفقة بالطلب ({sampleImgs.length} صور):</span>
                              </div>
                              <span style={{ fontSize: '11px', color: '#888' }}>
                                انقر على أي صورة لتكبيرها وفحص جودة التنفيذ
                              </span>
                            </div>

                            {sampleImgs.length === 0 ? (
                              <div
                                style={{
                                  padding: '16px',
                                  background: '#faf6ee',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  color: '#846738',
                                  textAlign: 'center',
                                }}
                              >
                                لم يقم المتقدم برفع صور أعمال إضافية أثناء التسجيل
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                                  gap: '10px',
                                }}
                              >
                                {sampleImgs.map((img: PortfolioImage, imgIdx: number) => (
                                  <div
                                    key={imgIdx}
                                    onClick={() =>
                                      setActiveLightboxImg({
                                        url: img.url,
                                        title: img.caption || `${applicant.name} - صورة عمل ${imgIdx + 1}`,
                                      })
                                    }
                                    style={{
                                      position: 'relative',
                                      aspectRatio: '1',
                                      borderRadius: '10px',
                                      overflow: 'hidden',
                                      border: '1.5px solid #dcd4c6',
                                      cursor: 'pointer',
                                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                                      background: '#000',
                                    }}
                                  >
                                    <img
                                      src={img.url}
                                      alt={img.caption || `نموذج ${imgIdx + 1}`}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.08)';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                      }}
                                    />
                                    {img.isAfter && (
                                      <span
                                        style={{
                                          position: 'absolute',
                                          bottom: '4px',
                                          right: '4px',
                                          background: 'rgba(23,72,62,0.85)',
                                          color: '#fff',
                                          fontSize: '9px',
                                          padding: '1px 5px',
                                          borderRadius: '4px',
                                          fontWeight: 700,
                                        }}
                                      >
                                        بعد
                                      </span>
                                    )}
                                    {img.isBefore && (
                                      <span
                                        style={{
                                          position: 'absolute',
                                          bottom: '4px',
                                          right: '4px',
                                          background: 'rgba(199,102,79,0.85)',
                                          color: '#fff',
                                          fontSize: '9px',
                                          padding: '1px 5px',
                                          borderRadius: '4px',
                                          fontWeight: 700,
                                        }}
                                      >
                                        قبل
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: PAINTERS MANAGEMENT */}
          {activeTab === 'painters' && (
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              {/* Search & Filter Toolbar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      placeholder="بحث باسم الصباغ أو الهاتف أو المنطقة..."
                      value={painterSearch}
                      onChange={(e) => setPainterSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 38px 10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #d8cfbe',
                        fontSize: '13px',
                        background: '#fff',
                        boxSizing: 'border-box',
                      }}
                    />
                    <Search
                      size={16}
                      color="#889389"
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={painterGovFilter}
                    onChange={(e) => setPainterGovFilter(e.target.value)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid #d8cfbe',
                      fontSize: '12px',
                      background: '#fff',
                    }}
                  >
                    <option value="الكل">كل المحافظات</option>
                    <option value="العاصمة">العاصمة</option>
                    <option value="حولي">حولي</option>
                    <option value="الفروانية">الفروانية</option>
                    <option value="الأحمدي">الأحمدي</option>
                    <option value="الجهراء">الجهراء</option>
                    <option value="مبارك الكبير">مبارك الكبير</option>
                  </select>

                  <select
                    value={painterStatusFilter}
                    onChange={(e) => setPainterStatusFilter(e.target.value)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid #d8cfbe',
                      fontSize: '12px',
                      background: '#fff',
                    }}
                  >
                    <option value="الكل">كل الحالات</option>
                    <option value="approved">معتمد (Approved)</option>
                    <option value="pending">قيد المراجعة (Pending)</option>
                    <option value="suspended">موقوف (Suspended)</option>
                  </select>
                </div>
              </div>

              {/* Painters Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8f4eb', borderBottom: '2px solid #e7ddcd', color: '#17483e' }}>
                      <th style={{ padding: '12px 14px', width: '90px' }}>الترتيب</th>
                      <th style={{ padding: '12px 14px' }}>الصباغ / الورشة</th>
                      <th style={{ padding: '12px 14px' }}>المحافظات والتغطية</th>
                      <th style={{ padding: '12px 14px' }}>الهاتف / واتساب</th>
                      <th style={{ padding: '12px 14px' }}>التقييم والخبرة</th>
                      <th style={{ padding: '12px 14px' }}>شارة التوثيق</th>
                      <th style={{ padding: '12px 14px' }}>حالة الاعتماد</th>
                      <th style={{ padding: '12px 14px' }}>إجراءات المشرف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPainters.map((p) => (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: '1px solid #ede4d5',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '28px',
                                height: '28px',
                                padding: '0 6px',
                                borderRadius: '6px',
                                background: (p.displayOrder ?? p.id) === 1 ? '#17483e' : '#f0e8da',
                                color: (p.displayOrder ?? p.id) === 1 ? '#e9bd77' : '#17483e',
                                fontWeight: 800,
                                fontSize: '13px',
                                border: (p.displayOrder ?? p.id) === 1 ? '1px solid #e9bd77' : '1px solid #ddd2bf',
                              }}
                            >
                              #{(p.displayOrder ?? p.id)}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <button
                                type="button"
                                title="تقديم الصباغ للأعلى"
                                disabled={(p.displayOrder ?? p.id) <= 1}
                                onClick={() => movePainterOrder(p.id, -1)}
                                style={{
                                  background: '#f2ecdf',
                                  border: '1px solid #d8cfbe',
                                  borderRadius: '3px',
                                  padding: '1px 5px',
                                  cursor: (p.displayOrder ?? p.id) <= 1 ? 'not-allowed' : 'pointer',
                                  opacity: (p.displayOrder ?? p.id) <= 1 ? 0.3 : 1,
                                  fontSize: '9px',
                                  lineHeight: 1,
                                }}
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                title="تأخير الصباغ للأسفل"
                                onClick={() => movePainterOrder(p.id, 1)}
                                style={{
                                  background: '#f2ecdf',
                                  border: '1px solid #d8cfbe',
                                  borderRadius: '3px',
                                  padding: '1px 5px',
                                  cursor: 'pointer',
                                  fontSize: '9px',
                                  lineHeight: 1,
                                }}
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: '#17483e',
                                color: '#e9bd77',
                                display: 'grid',
                                placeItems: 'center',
                                fontWeight: 700,
                                fontSize: '13px',
                                flexShrink: 0,
                              }}
                            >
                              {p.initials}
                            </div>
                            <div>
                              <strong style={{ display: 'block', color: '#17483e', fontSize: '14px' }}>
                                {p.name}
                              </strong>
                              <span style={{ fontSize: '11px', color: '#7a8277' }}>
                                يبدأ من {p.startingAt} • {p.services?.[0]}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '14px', color: '#444d42' }}>
                          <div>{p.region}</div>
                          <span style={{ fontSize: '11px', color: '#7a8277' }}>
                            {p.governorates?.slice(0, 2).join('، ')}
                          </span>
                        </td>

                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <a
                              href={`tel:${p.phone}`}
                              style={{
                                color: '#17483e',
                                textDecoration: 'none',
                                fontWeight: 600,
                                direction: 'ltr',
                              }}
                            >
                              {p.phone}
                            </a>
                          </div>
                        </td>

                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={13} fill="#c48927" color="#c48927" />
                            <strong>{p.rating}</strong>
                            <span style={{ fontSize: '11px', color: '#7a8277' }}>({p.reviews})</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#7a8277' }}>{p.years} سنوات خبرة</span>
                        </td>

                        {/* Verified Toggle */}
                        <td style={{ padding: '14px' }}>
                          <button
                            type="button"
                            onClick={() => togglePainterVerified(p.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 10px',
                              borderRadius: '999px',
                              fontSize: '11px',
                              fontWeight: 700,
                              border: '0',
                              cursor: 'pointer',
                              background: p.isVerified ? '#eef7f0' : '#f5f0e6',
                              color: p.isVerified ? '#1b5e20' : '#888f83',
                            }}
                          >
                            <BadgeCheck size={14} color={p.isVerified ? '#2e7d32' : '#888f83'} />
                            <span>{p.isVerified ? 'موثق رسمياً' : 'غير موثق'}</span>
                          </button>
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: '14px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background:
                                p.status === 'approved'
                                  ? '#e8f5e9'
                                  : p.status === 'pending'
                                  ? '#fff8e1'
                                  : '#ffebee',
                              color:
                                p.status === 'approved'
                                  ? '#2e7d32'
                                  : p.status === 'pending'
                                  ? '#f57f17'
                                  : '#c62828',
                            }}
                          >
                            {p.status === 'approved'
                              ? 'معتمد'
                              : p.status === 'pending'
                              ? 'قيد المراجعة'
                              : 'موقوف'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {p.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => changePainterStatus(p.id, 'approved')}
                                title="اعتماد الصباغ"
                                style={{
                                  background: '#17483e',
                                  color: '#fff',
                                  border: '0',
                                  borderRadius: '6px',
                                  padding: '5px 8px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                اعتماد
                              </button>
                            )}
                            {p.status !== 'suspended' && (
                              <button
                                type="button"
                                onClick={() => changePainterStatus(p.id, 'suspended')}
                                title="إيقاف مؤقت"
                                style={{
                                  background: '#fff',
                                  color: '#c7664f',
                                  border: '1px solid #dcd4c6',
                                  borderRadius: '6px',
                                  padding: '5px 8px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                إيقاف
                              </button>
                            )}
                            {p.status === 'suspended' && (
                              <button
                                type="button"
                                onClick={() => changePainterStatus(p.id, 'pending')}
                                title="إعادة للمراجعة"
                                style={{
                                  background: '#fff',
                                  color: '#17483e',
                                  border: '1px solid #dcd4c6',
                                  borderRadius: '6px',
                                  padding: '5px 8px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                مراجعة
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LEADS PIPELINE */}
          {activeTab === 'leads' && (
            <div>
              {/* Filter Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'all', label: 'كل الطلبات' },
                    { id: 'new', label: 'جديد (New)' },
                    { id: 'assigned', label: 'تم الإسناد' },
                    { id: 'contacted', label: 'تم التواصل' },
                    { id: 'completed', label: 'منجز (Completed)' },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setLeadStatusFilter(chip.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: '1px solid',
                        cursor: 'pointer',
                        borderColor: leadStatusFilter === chip.id ? '#17483e' : '#dcd4c6',
                        background: leadStatusFilter === chip.id ? '#17483e' : '#fff',
                        color: leadStatusFilter === chip.id ? '#fff9ee' : '#33483f',
                      }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leads Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '16px',
                }}
              >
                {filteredLeads.map((lead) => {
                  const assignedP = painters.find((p) => p.id === lead.assignedPainterId);

                  return (
                    <div
                      key={lead.id}
                      style={{
                        background: '#fffdf9',
                        border: '1px solid #e4d7c3',
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* Header: Customer Name & Status Badge */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '10px',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '11px', color: '#889389' }}>
                              طلب رقم #{lead.id} • {new Date(lead.createdAt).toLocaleDateString('ar-KW')}
                            </span>
                            <h3 style={{ margin: '2px 0 0', fontSize: '17px', color: '#17483e', fontWeight: 800 }}>
                              {lead.customerName}
                            </h3>
                          </div>

                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background:
                                lead.status === 'new'
                                  ? '#fdf2e9'
                                  : lead.status === 'contacted'
                                  ? '#e3f2fd'
                                  : lead.status === 'completed'
                                  ? '#e8f5e9'
                                  : '#f3e5f5',
                              color:
                                lead.status === 'new'
                                  ? '#d35400'
                                  : lead.status === 'contacted'
                                  ? '#1976d2'
                                  : lead.status === 'completed'
                                  ? '#2e7d32'
                                  : '#7b1fa2',
                            }}
                          >
                            {lead.status === 'new'
                              ? 'طلب جديد'
                              : lead.status === 'contacted'
                              ? 'تم التواصل'
                              : lead.status === 'completed'
                              ? 'مكتمل'
                              : 'مسند لصباغ'}
                          </span>
                        </div>

                        {/* Customer Phone & Quick Actions */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px',
                            background: '#faf5eb',
                            padding: '8px 12px',
                            borderRadius: '10px',
                          }}
                        >
                          <Phone size={14} color="#17483e" />
                          <strong style={{ fontSize: '13px', color: '#17483e', direction: 'ltr' }}>
                            {lead.customerPhone}
                          </strong>
                          <div style={{ marginRight: 'auto', display: 'flex', gap: '6px' }}>
                            <a
                              href={`tel:${lead.customerPhone}`}
                              style={{
                                background: '#17483e',
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                textDecoration: 'none',
                                fontWeight: 600,
                              }}
                            >
                              اتصال
                            </a>
                            <a
                              href={`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `السلام عليكم أخي ${lead.customerName}، نتواصل معك بخصوص طلب المعاينة والصبغ عبر منصة صباغ الكويت.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                background: '#25D366',
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                textDecoration: 'none',
                                fontWeight: 600,
                              }}
                            >
                              واتساب
                            </a>
                          </div>
                        </div>

                        {/* Quote Specs */}
                        <div style={{ fontSize: '12px', color: '#555e53', lineHeight: 1.8, marginBottom: '14px' }}>
                          <div>
                            📍 <strong>المنطقة:</strong> {lead.governorateId} - {lead.areaId}
                          </div>
                          <div>
                            🏠 <strong>المشروع:</strong> {lead.roomsCount} غرف •{' '}
                            {lead.workType === 'interior' ? 'صبغ داخلي' : 'صبغ واجهات وترميم'}
                          </div>
                          <div>
                            💰 <strong>التكلفة المقدرة:</strong> {lead.estimatedMinKwd} - {lead.estimatedMaxKwd} د.ك
                            (متوسط {lead.estimatedAverageKwd} د.ك)
                          </div>
                          {lead.customerNotes && (
                            <div
                              style={{
                                marginTop: '6px',
                                background: '#fff',
                                padding: '8px',
                                borderRadius: '8px',
                                border: '1px dashed #dcd4c6',
                                color: '#444d42',
                              }}
                            >
                              📝 "{lead.customerNotes}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions: Assign Painter & Status Selector */}
                      <div
                        style={{
                          borderTop: '1px solid #eee4d5',
                          paddingTop: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {/* Painter Assignment */}
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#687266', marginBottom: '4px' }}>
                            إسناد إلى صباغ معتمد:
                          </label>
                          <select
                            value={lead.assignedPainterId || ''}
                            onChange={(e) =>
                              assignPainterToLead(lead.id, e.target.value ? Number(e.target.value) : null)
                            }
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              borderRadius: '8px',
                              border: '1px solid #dcd4c6',
                              fontSize: '12px',
                              background: '#fff',
                            }}
                          >
                            <option value="">-- لم يتم الإسناد بعد --</option>
                            {painters.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.region})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status Change Buttons */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => changeLeadStatus(lead.id, 'contacted')}
                            style={{
                              flex: 1,
                              padding: '6px',
                              borderRadius: '8px',
                              border: '1px solid #dcd4c6',
                              background: lead.status === 'contacted' ? '#e3f2fd' : '#fff',
                              color: lead.status === 'contacted' ? '#1565c0' : '#444d42',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            تم التواصل
                          </button>
                          <button
                            type="button"
                            onClick={() => changeLeadStatus(lead.id, 'completed')}
                            style={{
                              flex: 1,
                              padding: '6px',
                              borderRadius: '8px',
                              border: '1px solid #dcd4c6',
                              background: lead.status === 'completed' ? '#e8f5e9' : '#fff',
                              color: lead.status === 'completed' ? '#2e7d32' : '#444d42',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            منجز بنجاح
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#17483e' }}>
                مراقبة واعتماد تقييمات العملاء
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviews.map((rev) => {
                  const targetP = painters.find((p) => p.id === rev.painterId);
                  const clientPhone = rev.whatsapp || rev.authorPhone || '';
                  const rawCleanPhone = clientPhone.replace(/[^\d+]/g, '');
                  const normalizedWaDigits = rawCleanPhone.replace('+', '').replace(/^00/, '');
                  const cleanWa = normalizedWaDigits
                    ? normalizedWaDigits.startsWith('965')
                      ? normalizedWaDigits
                      : `965${normalizedWaDigits}`
                    : '';
                  const waVerifyUrl = cleanWa
                    ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(
                        `السلام عليكم يا ${rev.author}، معك إدارة منصة صباغ الكويت بخصوص تقييمك للأستاذ (${targetP ? targetP.name : 'الصباغ'}). نود التأكد من جودة العمل لاعتماد التقييم وتوثيقه رسمياً على المنصة.`
                      )}`
                    : null;

                  return (
                    <div
                      key={rev.id}
                      style={{
                        background: rev.status === 'pending' ? '#fffdf7' : '#faf6ee',
                        border: rev.status === 'pending' ? '1.5px solid #e9bd77' : '1px solid #e7ddcd',
                        borderRadius: '14px',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                        boxShadow: rev.status === 'pending' ? '0 2px 10px rgba(233,189,119,0.15)' : 'none',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '14px', color: '#17483e' }}>{rev.author}</strong>
                          <span style={{ fontSize: '11px', color: '#889389' }}>• {rev.area}</span>
                          <span style={{ fontSize: '11px', color: '#889389' }}>• {rev.date}</span>
                          <div style={{ display: 'flex', color: '#e9bd77', marginRight: '6px' }}>
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={13} fill="currentColor" />
                            ))}
                          </div>
                          {rev.status === 'approved' && rev.verified && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#eaf4ee',
                                color: '#17483e',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              <BadgeCheck size={13} color="#17483e" /> موثق عبر واتساب
                            </span>
                          )}
                        </div>

                        <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#33483f', lineHeight: 1.6 }}>
                          "{rev.comment}"
                        </p>

                        <div style={{ fontSize: '12px', color: '#687266', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span>
                            الصباغ المقيم: <strong>{targetP ? targetP.name : `صباغ #${rev.painterId}`}</strong>
                          </span>
                          <span>• الخدمة: {rev.serviceType}</span>
                          {clientPhone && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              • واتساب العميل:{' '}
                              <strong dir="ltr" style={{ color: '#17483e' }}>
                                {clientPhone}
                              </strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Moderation & Verification Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            padding: '5px 12px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background:
                              rev.status === 'approved'
                                ? '#e8f5e9'
                                : rev.status === 'pending'
                                ? '#fff8e1'
                                : '#ffebee',
                            color:
                              rev.status === 'approved'
                                ? '#2e7d32'
                                : rev.status === 'pending'
                                ? '#b45309'
                                : '#c62828',
                            border:
                              rev.status === 'pending' ? '1px solid rgba(233,189,119,0.5)' : 'none',
                          }}
                        >
                          {rev.status === 'pending' && (
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: '#f59e0b',
                                display: 'inline-block',
                              }}
                            />
                          )}
                          {rev.status === 'approved'
                            ? 'معتمد ومنشور'
                            : rev.status === 'pending'
                            ? 'بانتظار التحقق'
                            : 'محجوب'}
                        </span>

                        {waVerifyUrl && (
                          <a
                            href={waVerifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#25D366',
                              color: '#ffffff',
                              padding: '7px 13px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              textDecoration: 'none',
                              boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
                            }}
                            title="التواصل مع العميل عبر واتساب للتأكد من صحة التقييم"
                          >
                            <MessageCircle size={14} />
                            <span>تحقق عبر واتساب</span>
                          </a>
                        )}

                        {rev.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => changeReviewStatus(rev.id, 'approved')}
                            style={{
                              background: '#17483e',
                              color: '#fff',
                              border: '0',
                              borderRadius: '8px',
                              padding: '7px 14px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              boxShadow: '0 2px 8px rgba(23,72,62,0.25)',
                            }}
                          >
                            <BadgeCheck size={14} color="#e9bd77" />
                            <span>اعتماد وتوثيق</span>
                          </button>
                        )}

                        {rev.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => changeReviewStatus(rev.id, 'rejected')}
                            style={{
                              background: '#fff',
                              color: '#c7664f',
                              border: '1px solid #dcd4c6',
                              borderRadius: '8px',
                              padding: '7px 12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            حجب
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Lightbox Modal for Work Samples Inspection */}
        {activeLightboxImg && (
          <div
            onClick={() => setActiveLightboxImg(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(13, 26, 22, 0.92)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveLightboxImg(null)}
                style={{
                  position: 'absolute',
                  top: '-42px',
                  left: '0',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  border: '0',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>

              <img
                src={activeLightboxImg.url}
                alt={activeLightboxImg.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  border: '2px solid rgba(233,189,119,0.4)',
                }}
              />

              <div
                style={{
                  marginTop: '12px',
                  color: '#f5efe3',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span>{activeLightboxImg.title}</span>
                <a
                  href={activeLightboxImg.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#e9bd77',
                    textDecoration: 'none',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ExternalLink size={13} />
                  <span>فتح الرابط الأصلي</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
