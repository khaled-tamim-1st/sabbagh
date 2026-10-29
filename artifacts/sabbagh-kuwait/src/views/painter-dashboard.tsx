'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from '@/lib/nav';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import { Layout } from '@/components/layout';
import { compressImageToWebP } from '@/lib/image-compressor';
import { AvatarCropperModal } from '@/components/avatar-cropper-modal';
import { catalogStore } from '@/lib/catalog-store';
import type { PortfolioProject, PortfolioImage } from '@/data/painters';
import {
  Paintbrush,
  Phone,
  MessageCircle,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Zap,
  Layers,
  Award,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Calendar,
  AlertCircle,
  Camera,
  Trash2,
  Edit3,
  Plus,
  Image as ImageIcon,
  X,
  Upload,
  Check,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

interface PainterLead {
  id: number;
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
  propertyType: string;
  workType: string;
  roomsCount: number;
  governorateId: string;
  areaId: string;
  estimatedMinKwd: number;
  estimatedMaxKwd: number;
  estimatedAverageKwd: number;
  status: 'new' | 'assigned' | 'contacted' | 'in_progress' | 'completed';
  createdAt: string;
}

const INITIAL_PAINTER_LEADS: PainterLead[] = [];

const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [];

export default function PainterDashboardPage() {
  const { user, isLoading: authLoading, logout, updatePainterAvailability, refreshUser } = useAuth();
  const [, setLocation] = useLocation();

  // Active Dashboard Section Tab
  const [activeSection, setActiveSection] = useState<'leads' | 'portfolio'>('leads');

  // Availability state
  const [isAvailable, setIsAvailable] = useState<boolean>(() => {
    return user?.painterProfile?.isAvailableToday ?? true;
  });
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

  // Leads state
  const [leads, setLeads] = useState<PainterLead[]>(INITIAL_PAINTER_LEADS);
  const [leadFilter, setLeadFilter] = useState<'all' | 'active' | 'completed'>('active');

  // Avatar Management state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    return user?.painterProfile?.avatarUrl || null;
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cropperModalOpen, setCropperModalOpen] = useState(false);
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null);

  // Portfolio Management state
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO_PROJECTS);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  // Project Form state
  const [formDisplayMode, setFormDisplayMode] = useState<'standard' | 'before_after'>('standard');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('دهان داخلي ومعجون');
  const [formArea, setFormArea] = useState('السالمية - محافظة حولي');
  const [formMaterials, setFormMaterials] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Standard mode gallery
  const [formGalleryImages, setFormGalleryImages] = useState<PortfolioImage[]>([]);

  // Before & After mode images
  const [formBeforeImage, setFormBeforeImage] = useState<PortfolioImage | null>(null);
  const [formAfterImage, setFormAfterImage] = useState<PortfolioImage | null>(null);
  const [formBeforeDetails, setFormBeforeDetails] = useState('');
  const [formAfterDetails, setFormAfterDetails] = useState('');

  const [isCompressingImages, setIsCompressingImages] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  // Sync profile details when user changes
  useEffect(() => {
    if (user?.painterProfile) {
      setIsAvailable(user.painterProfile.isAvailableToday);
      if (user.painterProfile.avatarUrl !== undefined) {
        setAvatarUrl(user.painterProfile.avatarUrl);
      }
      if (Array.isArray(user.painterProfile.portfolioProjects)) {
        setPortfolioProjects(user.painterProfile.portfolioProjects);
      }
    }
  }, [user]);

  // Auth protection
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation('/login');
      } else if (user.role !== 'painter') {
        setLocation('/admin');
      }
    }
  }, [user, authLoading, setLocation]);

  // Load leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const remoteLeads = await apiClient.get<PainterLead[]>('/painter/leads');
        if (Array.isArray(remoteLeads)) {
          setLeads(remoteLeads);
        } else {
          setLeads([]);
        }
      } catch (err) {
        console.warn('API leads notice:', err);
        setLeads([]);
      }
    };

    fetchLeads();
  }, []);

  // Load portfolio from store and API
  useEffect(() => {
    const fetchPortfolio = async () => {
      const painterId = user?.painterProfile?.id || 1;
      const painterRecord = catalogStore.getPainterById(painterId);
      if (painterRecord && Array.isArray(painterRecord.portfolioProjects) && painterRecord.portfolioProjects.length > 0) {
        setPortfolioProjects(painterRecord.portfolioProjects);
      }

      try {
        const remotePortfolio = await apiClient.get<PortfolioProject[]>('/painter/portfolio');
        if (Array.isArray(remotePortfolio) && remotePortfolio.length > 0) {
          setPortfolioProjects(remotePortfolio);
          catalogStore.updatePainterPortfolio(painterId, remotePortfolio);
        }
      } catch (err) {
        console.warn('Using catalogStore portfolio:', err);
      }
    };

    fetchPortfolio();
  }, [user]);

  // Availability Toggle Handler
  const handleToggleAvailability = async () => {
    const targetState = !isAvailable;
    setIsAvailable(targetState);
    setIsTogglingAvailability(true);
    try {
      await updatePainterAvailability(targetState);
    } finally {
      setIsTogglingAvailability(false);
    }
  };

  // Avatar Selection & WhatsApp Cropper Trigger
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageForCrop(reader.result as string);
      setCropperModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Avatar Upload when cropped
  const handleCropComplete = async (croppedWebpDataUri: string) => {
    setIsUploadingAvatar(true);
    setAvatarMessage(null);
    const painterId = user?.painterProfile?.id || 1;

    // Immediately update local state & catalogStore (local-first resilient update)
    setAvatarUrl(croppedWebpDataUri);
    catalogStore.updatePainter(painterId, { avatarUrl: croppedWebpDataUri });
    setCropperModalOpen(false);
    setRawImageForCrop(null);
    setAvatarMessage({ type: 'success', text: 'تم قص وضبط وتحديث صورتك الشخصية بنجاح!' });

    try {
      // Upload to backend (which uploads to Cloudinary sabbagh/avatars as WebP)
      const res = await apiClient.post('/painter/avatar', {
        image: croppedWebpDataUri,
        avatarUrl: croppedWebpDataUri,
      });

      const finalUrl = res?.avatarUrl || croppedWebpDataUri;
      setAvatarUrl(finalUrl);
      catalogStore.updatePainter(painterId, { avatarUrl: finalUrl });
      await refreshUser();
    } catch (err: any) {
      console.warn('Backend avatar sync note (preserved locally in catalogStore):', err);
    } finally {
      setIsUploadingAvatar(false);
      setTimeout(() => setAvatarMessage(null), 5000);
    }
  };

  // Delete Avatar
  const handleDeleteAvatar = async () => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف صورتك الشخصية واستعادة الحروف الأولى؟')) {
      return;
    }

    const painterId = user?.painterProfile?.id || 1;
    setIsDeletingAvatar(true);
    setAvatarMessage(null);
    setAvatarUrl(null);
    catalogStore.updatePainter(painterId, { avatarUrl: null });
    setAvatarMessage({ type: 'success', text: 'تم حذف الصورة الشخصية بنجاح.' });

    try {
      await apiClient.delete('/painter/avatar');
      await refreshUser();
    } catch (err: any) {
      console.warn('Backend avatar delete note (removed locally):', err);
    } finally {
      setIsDeletingAvatar(false);
      setTimeout(() => setAvatarMessage(null), 5000);
    }
  };

  // Status Change Handler for Leads
  const handleUpdateLeadStatus = async (leadId: number, newStatus: PainterLead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      await apiClient.patch(`/painter/leads/${leadId}`, { status: newStatus });
    } catch (err) {
      console.warn('API lead status update failed, kept local state:', err);
    }
  };

  const filteredLeads = useMemo(() => {
    if (leadFilter === 'all') return leads;
    if (leadFilter === 'active') return leads.filter((l) => l.status !== 'completed');
    return leads.filter((l) => l.status === 'completed');
  }, [leads, leadFilter]);

  // Modal handlers
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setFormDisplayMode('standard');
    setFormTitle('');
    setFormCategory('دهان داخلي ومعجون');
    setFormArea('السالمية - محافظة حولي');
    setFormMaterials('معجون سيلر أصلي، دهان جوتن فينوماستيك مطفي');
    setFormDescription('');
    setFormGalleryImages([]);
    setFormBeforeImage(null);
    setFormAfterImage(null);
    setFormBeforeDetails('');
    setFormAfterDetails('');
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project: PortfolioProject) => {
    setEditingProject(project);
    setFormDisplayMode(project.displayMode || 'standard');
    setFormTitle(project.title);
    setFormCategory(project.category);
    setFormArea(project.area || 'محافظة حولي');
    setFormMaterials(project.materialsUsed || '');
    setFormDescription(project.description || '');
    setFormGalleryImages(project.galleryImages || []);
    setFormBeforeImage(project.beforeImage || null);
    setFormAfterImage(project.afterImage || null);
    setFormBeforeDetails(project.beforeDetails || '');
    setFormAfterDetails(project.afterDetails || '');
    setIsProjectModalOpen(true);
  };

  // Add multiple images for Standard Project
  const handleAddGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressingImages(true);
    try {
      const newImages: PortfolioImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const webpUri = await compressImageToWebP(file, { maxWidth: 1600, quality: 0.82 });
        newImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url: webpUri,
          dataUri: webpUri,
          caption: file.name.replace(/\.[^/.]+$/, ''),
        });
      }
      setFormGalleryImages((prev) => [...prev, ...newImages]);
    } catch (err: any) {
      alert(err?.message || 'تعذر ضغط بعض الصور إلى WebP');
    } finally {
      setIsCompressingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (idToRemove: string) => {
    setFormGalleryImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  // Upload Before Image
  const handleUploadBeforeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingImages(true);
    try {
      const webpUri = await compressImageToWebP(file, { maxWidth: 1600, quality: 0.82 });
      setFormBeforeImage({
        id: `before-${Date.now()}`,
        url: webpUri,
        dataUri: webpUri,
        caption: 'صورة قبل بدء العمل',
      });
    } catch (err: any) {
      alert(err?.message || 'تعذر ضغط صورة قبل العمل');
    } finally {
      setIsCompressingImages(false);
      e.target.value = '';
    }
  };

  // Upload After Image
  const handleUploadAfterFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingImages(true);
    try {
      const webpUri = await compressImageToWebP(file, { maxWidth: 1600, quality: 0.82 });
      setFormAfterImage({
        id: `after-${Date.now()}`,
        url: webpUri,
        dataUri: webpUri,
        caption: 'صورة بعد التشطيب النهائي',
      });
    } catch (err: any) {
      alert(err?.message || 'تعذر ضغط صورة بعد العمل');
    } finally {
      setIsCompressingImages(false);
      e.target.value = '';
    }
  };

  // Save Project (Create or Edit)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('يرجى كتابة عنوان المشروع أولاً');
      return;
    }

    setIsSubmittingProject(true);
    const payload = {
      title: formTitle.trim(),
      category: formCategory.trim(),
      area: formArea.trim(),
      materialsUsed: formMaterials.trim(),
      description: formDescription.trim(),
      displayMode: formDisplayMode,
      galleryImages: formDisplayMode === 'standard' ? formGalleryImages : [],
      beforeImage: formDisplayMode === 'before_after' ? formBeforeImage || undefined : undefined,
      afterImage: formDisplayMode === 'before_after' ? formAfterImage || undefined : undefined,
      beforeDetails: formDisplayMode === 'before_after' ? formBeforeDetails.trim() : undefined,
      afterDetails: formDisplayMode === 'before_after' ? formAfterDetails.trim() : undefined,
    };

    const painterId = user?.painterProfile?.id || 1;
    let nextProjects: PortfolioProject[] = [];

    if (editingProject) {
      const updatedItem: PortfolioProject = { ...editingProject, ...payload };
      nextProjects = portfolioProjects.map((p) => (p.id === editingProject.id ? updatedItem : p));
    } else {
      const newProj: PortfolioProject = {
        ...payload,
        id: `proj-${Date.now()}`,
        painterId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      nextProjects = [newProj, ...portfolioProjects];
    }

    setPortfolioProjects(nextProjects);
    catalogStore.updatePainterPortfolio(painterId, nextProjects);
    setIsProjectModalOpen(false);

    try {
      if (editingProject) {
        await apiClient.put(`/painter/portfolio/${editingProject.id}`, payload);
      } else {
        await apiClient.post('/painter/portfolio', payload);
      }
      await refreshUser();
    } catch (err: any) {
      console.warn('API sync portfolio note (saved locally in catalogStore):', err);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك بحذف هذا المشروع من معرض أعمالك؟')) {
      return;
    }

    const painterId = user?.painterProfile?.id || 1;
    const nextProjects = portfolioProjects.filter((p) => p.id !== projectId);
    setPortfolioProjects(nextProjects);
    catalogStore.updatePainterPortfolio(painterId, nextProjects);

    try {
      await apiClient.delete(`/painter/portfolio/${projectId}`);
    } catch (err) {
      console.warn('API delete note (removed locally from catalogStore):', err);
    }
  };

  if (authLoading || !user || user.role !== 'painter') {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#17483e' }}>
          <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600 }}>جاري التحقق من صلاحيات حساب الصباغ...</p>
        </div>
      </Layout>
    );
  }

  const painterInfo = user.painterProfile || {
    id: 1,
    name: user.name,
    avatarUrl: avatarUrl,
    initials: 'صب',
    region: 'محافظة العاصمة وحولي',
    isAvailableToday: isAvailable,
    rating: '5.0',
    reviews: 2,
    years: 12,
    isVerified: true,
    status: 'approved',
    completedProjects: 85,
    responseTime: 'خلال 15 دقيقة',
  };

  return (
    <Layout activeNav="/painter">
      <div dir="rtl" style={{ background: '#f5efe3', minHeight: '100vh', paddingBottom: '70px' }}>
        
        {/* Painter Profile Top Hero with Avatar Box */}
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
                gap: '20px',
              }}
            >
              {/* Profile Avatar Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '20px',
                      background: avatarUrl ? '#fffdfa' : 'rgba(233,189,119,0.18)',
                      border: '2.5px solid #e9bd77',
                      color: '#e9bd77',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '26px',
                      fontWeight: 800,
                      overflow: 'hidden',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                    }}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={painterInfo.name}
                        onError={() => setAvatarUrl(null)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      user?.painterProfile?.initials || 'صب'
                    )}
                  </div>

                  {/* Upload photo trigger */}
                  <label
                    title="رفع وتحديث الصورة الشخصية (مضغوطة بصيغة WebP تلقائياً)"
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '-6px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#e9bd77',
                      color: '#17483e',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: isUploadingAvatar ? 'wait' : 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    {isUploadingAvatar ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : (
                      <Camera size={15} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileSelect}
                      disabled={isUploadingAvatar}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
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
                      صباغ معتمد وموثق
                    </span>

                    {/* Subtle WebP Badge */}
                    <span
                      style={{
                        background: 'rgba(74, 222, 128, 0.15)',
                        color: '#86efac',
                        border: '1px solid rgba(74, 222, 128, 0.4)',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="يتم ضغط جميع الصور بتقنية WebP فائقة السرعة لتحميل فوري على هواتف العملاء"
                    >
                      <Sparkles size={11} /> صورة WebP مضغوطة وسريعة
                    </span>

                    <span style={{ fontSize: '13px', color: '#b9cbbe' }}>
                      {painterInfo.region}
                    </span>
                  </div>

                  <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, margin: '0 0 6px' }}>
                    {painterInfo.name}
                  </h1>

                  {/* Quick Avatar Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label
                      style={{
                        color: '#e9bd77',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        textDecoration: 'underline',
                      }}
                    >
                      {isUploadingAvatar ? 'جاري ضغط ورفع الصورة...' : 'تغيير الصورة'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileSelect}
                        disabled={isUploadingAvatar}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleDeleteAvatar}
                        disabled={isDeletingAvatar}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fca5a5',
                          fontSize: '11px',
                          cursor: 'pointer',
                          padding: 0,
                          fontWeight: 600,
                          textDecoration: 'underline',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Trash2 size={12} /> {isDeletingAvatar ? 'جاري الحذف...' : 'حذف الصورة'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Instant Availability Toggle Switch */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '18px',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: isAvailable ? '#4ade80' : '#f87171',
                        boxShadow: isAvailable ? '0 0 10px #4ade80' : 'none',
                      }}
                    />
                    <strong style={{ fontSize: '14px', color: '#fff9ee' }}>
                      {isAvailable ? 'متاح اليوم في الميدان' : 'غير متاح حالياً'}
                    </strong>
                  </div>
                  <span style={{ fontSize: '11px', color: '#c5d5cb', display: 'block', marginTop: '2px' }}>
                    {isAvailable ? 'يظهر ملفك للعملاء لاستقبال اتصالات فورية' : 'ملفك مخفي من الاستقبال الفوري'}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isTogglingAvailability}
                  onClick={handleToggleAvailability}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '0',
                    cursor: 'pointer',
                    background: isAvailable ? '#e9bd77' : 'rgba(255,255,255,0.2)',
                    color: isAvailable ? '#17483e' : '#fff',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isAvailable ? 'تبديل إلى مشغول' : 'تفعيل الإتاحة الآن'}
                </button>
              </div>
            </div>

            {/* Avatar feedback alert */}
            {avatarMessage && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: avatarMessage.type === 'success' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                  border: `1px solid ${avatarMessage.type === 'success' ? '#4ade80' : '#f87171'}`,
                  color: '#fff',
                }}
              >
                {avatarMessage.text}
              </div>
            )}
          </div>
        </section>

        <div style={{ width: 'min(1240px, calc(100% - 48px))', margin: '30px auto 0' }}>
          
          {/* Stats Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {/* Card 1: Leads Assigned */}
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '18px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#687266', fontWeight: 600 }}>الطلبات الموجهة لك</span>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#17483e', marginTop: '4px' }}>
                    {leads.length}
                  </div>
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: '#eef5f1',
                    color: '#17483e',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Sparkles size={18} />
                </div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#2d6a4f' }}>
                منها <strong>{leads.filter((l) => l.status !== 'completed').length}</strong> قيد المتابعة حالياً
              </div>
            </div>

            {/* Card 2: Rating */}
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '18px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#687266', fontWeight: 600 }}>تقييم العملاء</span>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#17483e', marginTop: '4px' }}>
                    {painterInfo.rating} <Star size={18} fill="#c48927" color="#c48927" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
                  </div>
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: '#fcf7ec',
                    color: '#c48927',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Star size={18} fill="currentColor" />
                </div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#687266' }}>
                مبني على <strong>{painterInfo.reviews}</strong> تقييم حقيقي موثق
              </div>
            </div>

            {/* Card 3: Portfolio Count */}
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '18px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                cursor: 'pointer',
              }}
              onClick={() => setActiveSection('portfolio')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#687266', fontWeight: 600 }}>أعمال البورتفوليو</span>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#17483e', marginTop: '4px' }}>
                    {portfolioProjects.length}
                  </div>
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: '#eef5f1',
                    color: '#17483e',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <ImageIcon size={18} />
                </div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#2d6a4f' }}>
                صور WebP مضغوطة ومحدثة بالدليل
              </div>
            </div>

            {/* Card 4: Response Time */}
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #e5dbcb',
                borderRadius: '18px',
                padding: '18px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#687266', fontWeight: 600 }}>سرعة الرد بالواتساب</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#17483e', marginTop: '8px' }}>
                    {painterInfo.responseTime ?? 'خلال 15 دقيقة'}
                  </div>
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: '#fcf7ec',
                    color: '#c48927',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Clock size={18} />
                </div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#2d6a4f' }}>
                جاهزية للرد والاتصال المباشر
              </div>
            </div>
          </div>

          {/* Top Section Nav Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              borderBottom: '2px solid #e6ded0',
              marginBottom: '26px',
              paddingBottom: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveSection('leads')}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: activeSection === 'leads' ? '#17483e' : '#727970',
                borderBottom: activeSection === 'leads' ? '3px solid #17483e' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <MessageCircle size={17} />
              <span>طلبات المعاينة والزبائن ({leads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('portfolio')}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: activeSection === 'portfolio' ? '#17483e' : '#727970',
                borderBottom: activeSection === 'portfolio' ? '3px solid #17483e' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ImageIcon size={17} />
              <span>معرض أعمالي وسابقة المشاريع ({portfolioProjects.length})</span>
            </button>
          </div>

          {/* Main Grid: Left Content (Leads or Portfolio) + Right Sidebar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2.3fr) minmax(280px, 1fr)',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            {/* Main Column */}
            <div>
              {/* TAB 1: Leads View */}
              {activeSection === 'leads' && (
                <div>
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
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#17483e', margin: '0 0 4px' }}>
                        طلبات المعاينة الواردة لمنطقتك
                      </h2>
                      <p style={{ margin: 0, fontSize: '12px', color: '#687266' }}>
                        تواصل فوراً مع العملاء لتحديد موعد المعاينة وإغلاق الاتفاق.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { id: 'active', label: 'الطلبات النشطة' },
                        { id: 'all', label: 'الكل' },
                        { id: 'completed', label: 'المنجزة' },
                      ].map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => setLeadFilter(chip.id as any)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: '1px solid',
                            cursor: 'pointer',
                            borderColor: leadFilter === chip.id ? '#17483e' : '#dcd4c6',
                            background: leadFilter === chip.id ? '#17483e' : '#fff',
                            color: leadFilter === chip.id ? '#fff9ee' : '#33483f',
                          }}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredLeads.length === 0 ? (
                    <div
                      style={{
                        background: '#fffdf9',
                        border: '1px solid #e5dbcb',
                        borderRadius: '16px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: '#687266',
                      }}
                    >
                      <Sparkles size={32} color="#c7664f" style={{ margin: '0 auto 12px' }} />
                      <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#17483e' }}>
                        لا توجد طلبات في هذا القسم
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px' }}>
                        ستظهر هنا الطلبات الجديدة الموجهة لك فور إرسالها من العملاء.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {filteredLeads.map((lead) => (
                        <div
                          key={lead.id}
                          style={{
                            background: '#fffdf9',
                            border: '1px solid #e4d7c3',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                          }}
                        >
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
                                طلب #{lead.id} • {new Date(lead.createdAt).toLocaleDateString('ar-KW')}
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
                                  lead.status === 'completed'
                                    ? '#e8f5e9'
                                    : lead.status === 'in_progress'
                                    ? '#e3f2fd'
                                    : lead.status === 'contacted'
                                    ? '#fff8e1'
                                    : '#fdf2e9',
                                color:
                                  lead.status === 'completed'
                                    ? '#2e7d32'
                                    : lead.status === 'in_progress'
                                    ? '#1976d2'
                                    : lead.status === 'contacted'
                                    ? '#f57f17'
                                    : '#d35400',
                              }}
                            >
                              {lead.status === 'completed'
                                ? 'تم إنجاز المشروع'
                                : lead.status === 'in_progress'
                                ? 'جاري التنفيذ'
                                : lead.status === 'contacted'
                                ? 'تم التواصل هاتفياً'
                                : 'طلب جديد بانتظار الاتصال'}
                            </span>
                          </div>

                          {/* Direct Call & WhatsApp Contact Bar */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              background: '#faf5eb',
                              padding: '10px 14px',
                              borderRadius: '12px',
                              marginBottom: '14px',
                            }}
                          >
                            <Phone size={15} color="#17483e" />
                            <strong style={{ fontSize: '14px', color: '#17483e', direction: 'ltr' }}>
                              {lead.customerPhone}
                            </strong>

                            <div style={{ marginRight: 'auto', display: 'flex', gap: '8px' }}>
                              <a
                                href={`tel:${lead.customerPhone}`}
                                style={{
                                  background: '#17483e',
                                  color: '#fff',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  textDecoration: 'none',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <Phone size={13} />
                                <span>اتصال فوري</span>
                              </a>

                              <a
                                href={`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `السلام عليكم أخي ${lead.customerName}، معك المعلم ${painterInfo.name} من منصة صباغ الكويت بخصوص طلب المعاينة والصبغ لمنزلك في ${lead.areaId}.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  background: '#25D366',
                                  color: '#fff',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  textDecoration: 'none',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <MessageCircle size={13} />
                                <span>محادثة واتساب</span>
                              </a>
                            </div>
                          </div>

                          {/* Lead Specs */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                              gap: '8px',
                              fontSize: '12px',
                              color: '#444d42',
                              marginBottom: '12px',
                            }}
                          >
                            <div>
                              <strong>المنطقة:</strong> {lead.governorateId} ({lead.areaId})
                            </div>
                            <div>
                              <strong>نوع العقار:</strong>{' '}
                              {lead.propertyType === 'apartment' ? 'شقة سكنية' : 'فيلا / قسيمة'}
                            </div>
                            <div>
                              <strong>المساحة:</strong> {lead.roomsCount} غرف
                            </div>
                            <div>
                              <strong>الميزانية التقديرية:</strong> {lead.estimatedMinKwd} - {lead.estimatedMaxKwd} د.ك
                            </div>
                          </div>

                          {lead.customerNotes && (
                            <div
                              style={{
                                background: '#fff',
                                border: '1px dashed #dcd4c6',
                                borderRadius: '10px',
                                padding: '10px 12px',
                                fontSize: '12px',
                                color: '#555e53',
                                marginBottom: '14px',
                              }}
                            >
                              <strong>ملاحظات العميل:</strong> {lead.customerNotes}
                            </div>
                          )}

                          {/* Status Selector */}
                          <div
                            style={{
                              borderTop: '1px solid #eee4d5',
                              paddingTop: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '10px',
                            }}
                          >
                            <span style={{ fontSize: '11px', color: '#687266', fontWeight: 600 }}>
                              تحديث حالة المعاينة والعمل:
                            </span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleUpdateLeadStatus(lead.id, 'contacted')}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  border: '1px solid #dcd4c6',
                                  background: lead.status === 'contacted' ? '#fff8e1' : '#fff',
                                  color: lead.status === 'contacted' ? '#b76e00' : '#444d42',
                                }}
                              >
                                تم التواصل
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateLeadStatus(lead.id, 'in_progress')}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  border: '1px solid #dcd4c6',
                                  background: lead.status === 'in_progress' ? '#e3f2fd' : '#fff',
                                  color: lead.status === 'in_progress' ? '#1565c0' : '#444d42',
                                }}
                              >
                                جاري التنفيذ
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateLeadStatus(lead.id, 'completed')}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  border: '1px solid #dcd4c6',
                                  background: lead.status === 'completed' ? '#e8f5e9' : '#fff',
                                  color: lead.status === 'completed' ? '#2e7d32' : '#444d42',
                                }}
                              >
                                تم الإنجاز
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Portfolio Management Section ("معرض أعمالي وسابقة المشاريع") */}
              {activeSection === 'portfolio' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#17483e', margin: '0 0 4px' }}>
                        معرض أعمالي وسابقة المشاريع
                      </h2>
                      <p style={{ margin: 0, fontSize: '13px', color: '#687266' }}>
                        أضف صور تشطيباتك الحقيقية ومقارنات (قبل وبعد) لتظهر للعملاء في دليلك العام وتزيد ثقة أصحاب البيوت.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddProject}
                      style={{
                        background: '#17483e',
                        color: '#e9bd77',
                        border: '1px solid #17483e',
                        borderRadius: '12px',
                        padding: '10px 18px',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(23,72,62,0.15)',
                      }}
                    >
                      <Plus size={16} />
                      <span>إضافة عمل جديد للبورتفوليو</span>
                    </button>
                  </div>

                  {portfolioProjects.length === 0 ? (
                    <div
                      style={{
                        background: '#fffdf9',
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
                      <h3 style={{ fontSize: '18px', color: '#17483e', margin: '0 0 8px' }}>
                        لم تقم بإضافة أي أعمال للبورتفوليو بعد
                      </h3>
                      <p style={{ fontSize: '13px', color: '#687266', maxWidth: '480px', margin: '0 auto 20px' }}>
                        رفع صور الشغل يرفع نسبة اتصال العملاء بك لأكثر من 3 أضعاف. يمكنك إضافة صور مشاريع أو مقارنة قبل وبعد.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddProject}
                        style={{
                          background: '#17483e',
                          color: '#e9bd77',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '10px 22px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        إضافة أول مشروع الآن
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '18px',
                      }}
                    >
                      {portfolioProjects.map((project) => (
                        <div
                          key={project.id}
                          style={{
                            background: '#fffdf9',
                            border: '1px solid #e5dcce',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {/* Image Thumbnail Showcase */}
                          <div style={{ position: 'relative', height: '190px', background: '#ece4d5' }}>
                            {project.displayMode === 'before_after' ? (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
                                <div style={{ position: 'relative', borderLeft: '1px solid #fff' }}>
                                  {project.beforeImage?.url ? (
                                    <img
                                      src={project.beforeImage.url}
                                      alt="قبل"
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#888', fontSize: '11px' }}>
                                      صورة قبل
                                    </div>
                                  )}
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: '8px',
                                      right: '8px',
                                      background: 'rgba(199, 102, 79, 0.9)',
                                      color: '#fff',
                                      fontSize: '10px',
                                      fontWeight: 700,
                                      padding: '2px 8px',
                                      borderRadius: '6px',
                                    }}
                                  >
                                    قبل
                                  </span>
                                </div>

                                <div style={{ position: 'relative' }}>
                                  {project.afterImage?.url ? (
                                    <img
                                      src={project.afterImage.url}
                                      alt="بعد"
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#888', fontSize: '11px' }}>
                                      صورة بعد
                                    </div>
                                  )}
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: '8px',
                                      left: '8px',
                                      background: 'rgba(23, 72, 62, 0.9)',
                                      color: '#e9bd77',
                                      fontSize: '10px',
                                      fontWeight: 700,
                                      padding: '2px 8px',
                                      borderRadius: '6px',
                                    }}
                                  >
                                    بعد
                                  </span>
                                </div>
                              </div>
                            ) : (
                              // Standard Multi-image preview
                              <div style={{ height: '100%', position: 'relative' }}>
                                {project.galleryImages?.[0]?.url ? (
                                  <img
                                    src={project.galleryImages[0].url}
                                    alt={project.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#888', fontSize: '12px' }}>
                                    لا توجد صور مرفوعة
                                  </div>
                                )}

                                {project.galleryImages && project.galleryImages.length > 1 && (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: '8px',
                                      left: '8px',
                                      background: 'rgba(0,0,0,0.7)',
                                      color: '#fff',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      padding: '3px 8px',
                                      borderRadius: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                  >
                                    <ImageIcon size={12} />
                                    <span>+{project.galleryImages.length} صور</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Display Mode Badge */}
                            <span
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: project.displayMode === 'before_after' ? '#e9bd77' : '#17483e',
                                color: project.displayMode === 'before_after' ? '#17483e' : '#fff9ee',
                                fontSize: '11px',
                                fontWeight: 800,
                                padding: '4px 10px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                              }}
                            >
                              {project.displayMode === 'before_after' ? 'قبل وبعد' : 'صور عمل'}
                            </span>
                          </div>

                          {/* Card Body */}
                          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span
                                style={{
                                  background: '#eef5f1',
                                  color: '#215045',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                }}
                              >
                                {project.category}
                              </span>
                              {project.area && (
                                <span style={{ fontSize: '11px', color: '#727970' }}>
                                  {project.area}
                                </span>
                              )}
                            </div>

                            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#17483e', margin: '4px 0 8px' }}>
                              {project.title}
                            </h3>

                            {project.materialsUsed && (
                              <p style={{ fontSize: '11px', color: '#555e53', margin: '0 0 10px', lineHeight: 1.5 }}>
                                <strong>المواد:</strong> {project.materialsUsed}
                              </p>
                            )}

                            {project.description && (
                              <p style={{ fontSize: '12px', color: '#687266', margin: '0 0 14px', lineHeight: 1.6, flex: 1 }}>
                                {project.description.length > 90 ? `${project.description.slice(0, 90)}...` : project.description}
                              </p>
                            )}

                            {/* Card Actions: Edit & Delete */}
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderTop: '1px solid #eee5d7',
                                paddingTop: '12px',
                                marginTop: 'auto',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => handleOpenEditProject(project)}
                                style={{
                                  background: '#faf5eb',
                                  border: '1px solid #dcd4c6',
                                  color: '#17483e',
                                  borderRadius: '8px',
                                  padding: '6px 14px',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <Edit3 size={13} />
                                <span>تعديل</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteProject(project.id)}
                                style={{
                                  background: '#fff2f0',
                                  border: '1px solid #fecdd3',
                                  color: '#e11d48',
                                  borderRadius: '8px',
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <Trash2 size={13} />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Column: Workshop Profile & Coverage */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Profile Avatar Box Widget */}
              <div
                style={{
                  background: '#fffdf9',
                  border: '1px solid #e4d7c3',
                  borderRadius: '18px',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', justifyContent: 'center' }}>
                  <Camera size={18} color="#17483e" />
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#17483e', fontWeight: 800 }}>
                    الصورة الشخصية للبروفايل
                  </h3>
                </div>

                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '24px',
                    background: avatarUrl ? '#fff' : 'rgba(233,189,119,0.18)',
                    border: '2px solid #e9bd77',
                    margin: '0 auto 12px',
                    overflow: 'hidden',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '32px',
                    fontWeight: 800,
                    color: '#e9bd77',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  }}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={painterInfo.name} onError={() => setAvatarUrl(null)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user?.painterProfile?.initials || 'صب'
                  )}
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <span
                    style={{
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      border: '1px solid #c8e6c9',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sparkles size={11} /> صورة WebP مضغوطة وسريعة
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label
                    style={{
                      background: '#17483e',
                      color: '#e9bd77',
                      borderRadius: '10px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: isUploadingAvatar ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {isUploadingAvatar ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    <span>{isUploadingAvatar ? 'جاري الضغط والرفع...' : 'رفع صورة بروفايل جديدة'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileSelect}
                      disabled={isUploadingAvatar}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      disabled={isDeletingAvatar}
                      style={{
                        background: '#fff2f0',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        borderRadius: '10px',
                        padding: '7px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={12} />
                      <span>{isDeletingAvatar ? 'جاري الحذف...' : 'حذف الصورة الشخصية'}</span>
                    </button>
                  )}
                </div>

                <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#7a8278', lineHeight: 1.6 }}>
                  يتم ضغط الصورة مباشرة داخل المتصفح بصيغة WebP لتظهر فوراً لعملاء الكويت دون استهلاك للبيانات.
                </p>
              </div>

              {/* Workshop Details Card */}
              <div
                style={{
                  background: '#fffdf9',
                  border: '1px solid #e4d7c3',
                  borderRadius: '18px',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Paintbrush size={18} color="#17483e" />
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#17483e', fontWeight: 800 }}>
                    بيانات ورشتك المعتمدة
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#555e53' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee5d7' }}>
                    <span>الاسم المسجل:</span>
                    <strong style={{ color: '#17483e' }}>{painterInfo.name}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee5d7' }}>
                    <span>المحافظة الرئيسية:</span>
                    <strong style={{ color: '#17483e' }}>{painterInfo.region}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee5d7' }}>
                    <span>شارة التوثيق:</span>
                    <span style={{ color: '#2e7d32', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} />
                      موثق ومفحوص
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee5d7' }}>
                    <span>الضمان المقدم:</span>
                    <strong style={{ color: '#17483e' }}>3 سنوات على التقشير</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ماركات الأصباغ:</span>
                    <strong style={{ color: '#17483e' }}>جوتن، كابارول، الجزيرة</strong>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#faf6ee',
                    fontSize: '11px',
                    color: '#687266',
                    lineHeight: 1.7,
                  }}
                >
                  <strong>نصيحة المنصة:</strong> أضف أعمالاً حقيقية من منازل الزبائن في الكويت، حيث يفضل 82% من العملاء رؤية صور Before & After قبل الاتفاق.
                </div>
              </div>

              {/* Quick Profile Link */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #17483e 0%, #205c50 100%)',
                  color: '#fff9ee',
                  borderRadius: '18px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>بروفايلك أمام العملاء</h4>
                <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#c7dcd0' }}>
                  معاينة صفحتك كما يراها أهل الكويت في الدليل مع معرض الأعمال
                </p>
                <a
                  href={`/painters/${encodeURIComponent((painterInfo as any).slug || painterInfo.name || painterInfo.id)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#e9bd77',
                    color: '#17483e',
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={13} />
                  <span>معاينة البروفايل العام</span>
                </a>
              </div>
            </aside>
          </div>
        </div>

        {/* Modal: Add or Edit Portfolio Project */}
        {isProjectModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              display: 'grid',
              placeItems: 'center',
              zIndex: 9999,
              padding: '16px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                background: '#fffdf9',
                borderRadius: '22px',
                width: 'min(720px, 100%)',
                maxHeight: '92vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid #e2d7c5',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 24px',
                  borderBottom: '1px solid #ece4d5',
                  background: '#faf6ee',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#17483e' }}>
                    {editingProject ? 'تعديل مشروع في سابقة الأعمال' : 'إضافة عمل جديد للبورتفوليو'}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#687266' }}>
                    يتم ضغط جميع الصور المرفوعة بتقنية WebP لتحميل فائق السرعة
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  style={{
                    background: '#eee5d7',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    color: '#17483e',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveProject} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Selection for Display Mode */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#17483e', marginBottom: '8px' }}>
                    نمط عرض المشروع في البروفايل:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setFormDisplayMode('standard')}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '2px solid',
                        borderColor: formDisplayMode === 'standard' ? '#17483e' : '#e0d6c4',
                        background: formDisplayMode === 'standard' ? '#eef5f1' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'right',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <ImageIcon size={18} color="#17483e" />
                        <strong style={{ fontSize: '13px', color: '#17483e' }}>معرض صور المشروع</strong>
                      </div>
                      <span style={{ fontSize: '11px', color: '#687266', display: 'block' }}>
                        رفع عدة صور للعمل وتشطيب الغرف والصالات.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormDisplayMode('before_after')}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '2px solid',
                        borderColor: formDisplayMode === 'before_after' ? '#e9bd77' : '#e0d6c4',
                        background: formDisplayMode === 'before_after' ? '#fcf7ec' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'right',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <RefreshCw size={18} color="#80552b" />
                        <strong style={{ fontSize: '13px', color: '#80552b' }}>مقارنة قبل وبعد (Before & After)</strong>
                      </div>
                      <span style={{ fontSize: '11px', color: '#687266', display: 'block' }}>
                        عرض صورة قبل العمل ومقارنتها بنتيجة التشطيب.
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Basic Inputs: Title, Category, Area */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#33483f', marginBottom: '6px' }}>
                      عنوان المشروع *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: تجديد صبغ صالة استقبال ومعالجة رطوبة"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #d5c9b6',
                        background: '#fff',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#33483f', marginBottom: '6px' }}>
                      تصنيف العمل *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #d5c9b6',
                        background: '#fff',
                        fontSize: '13px',
                      }}
                    >
                      <option value="دهان داخلي ومعجون">دهان داخلي ومعجون</option>
                      <option value="تشطيب فلل وقسائم">تشطيب فلل وقسائم</option>
                      <option value="ورق جدران وبديل خشب">ورق جدران وبديل خشب</option>
                      <option value="معالجة رطوبة وعوازل">معالجة رطوبة وعوازل</option>
                      <option value="أصباغ واجهات وسيجما">أصباغ واجهات وسيجما</option>
                      <option value="إيبوكسي وديكورات خاصة">إيبوكسي وديكورات خاصة</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#33483f', marginBottom: '6px' }}>
                      المنطقة / المحافظة
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: السالمية - حولي أو اليرموك"
                      value={formArea}
                      onChange={(e) => setFormArea(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #d5c9b6',
                        background: '#fff',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </div>

                {/* 3. Materials Used */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#33483f', marginBottom: '6px' }}>
                    المواد والأصباغ المستخدمة
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: جوتن فينوماستيك مطفي، معجون سيلر مائي عازل، فريش لوك"
                    value={formMaterials}
                    onChange={(e) => setFormMaterials(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #d5c9b6',
                      background: '#fff',
                      fontSize: '13px',
                    }}
                  />
                </div>

                {/* 4. Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#33483f', marginBottom: '6px' }}>
                    وصف المشروع وتفاصيل التنفيذ
                  </label>
                  <textarea
                    rows={3}
                    placeholder="اشرح للعملاء ما تم إنجازه، معالجة الحوائط، حماية الأثاث..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #d5c9b6',
                      background: '#fff',
                      fontSize: '13px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* 5. Conditioned Sections based on Display Mode */}
                {formDisplayMode === 'standard' ? (
                  // Multi-image uploader for Standard Mode
                  <div
                    style={{
                      background: '#faf5eb',
                      border: '1px dashed #d0c4b0',
                      borderRadius: '14px',
                      padding: '18px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#17483e' }}>صور المشروع (WebP مضغوطة تلقائياً)</strong>
                        <span style={{ fontSize: '11px', color: '#687266', display: 'block' }}>
                          اختر صورة أو أكثر، سيقوم المتصفح بضغطها بجودة WebP فائقة
                        </span>
                      </div>

                      <label
                        style={{
                          background: '#17483e',
                          color: '#e9bd77',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: isCompressingImages ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {isCompressingImages ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                        <span>{isCompressingImages ? 'جاري ضغط الصور...' : 'إضافة صور'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAddGalleryFiles}
                          disabled={isCompressingImages}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {formGalleryImages.length === 0 ? (
                      <p style={{ margin: 0, textAlign: 'center', color: '#888', fontSize: '12px', padding: '16px' }}>
                        لم يتم اختيار صور بعد. اضغط على زر "إضافة صور" لاختيار صور الشغل من جهازك.
                      </p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                        {formGalleryImages.map((img) => (
                          <div
                            key={img.id}
                            style={{
                              position: 'relative',
                              height: '90px',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              border: '1px solid #d4c8b6',
                            }}
                          >
                            <img src={img.url} alt="معاينة" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(img.id)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                left: '4px',
                                background: 'rgba(225, 29, 72, 0.9)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                display: 'grid',
                                placeItems: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Before & After Mode: Two Uploaders + Two Inputs
                  <div
                    style={{
                      background: '#faf5eb',
                      border: '1px dashed #d0c4b0',
                      borderRadius: '14px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <strong style={{ fontSize: '14px', color: '#17483e' }}>
                      إعدادات مقارنة قبل وبعد (Before & After)
                    </strong>

                    {/* Two Uploaders */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      {/* Before Uploader */}
                      <div
                        style={{
                          border: '1px solid #e0d0be',
                          borderRadius: '12px',
                          padding: '12px',
                          background: '#fff',
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#c7664f', display: 'block', marginBottom: '8px' }}>
                          1. صورة الحالة السابقة (قبل)
                        </span>

                        <div
                          style={{
                            height: '110px',
                            borderRadius: '10px',
                            background: '#f4ede0',
                            border: '1px dashed #cbbca8',
                            overflow: 'hidden',
                            marginBottom: '10px',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {formBeforeImage?.url ? (
                            <img src={formBeforeImage.url} alt="قبل" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '11px', color: '#888' }}>لا توجد صورة</span>
                          )}
                        </div>

                        <label
                          style={{
                            background: '#c7664f',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-block',
                          }}
                        >
                          {formBeforeImage ? 'تغيير صورة قبل' : 'رفع صورة قبل'}
                          <input type="file" accept="image/*" onChange={handleUploadBeforeFile} style={{ display: 'none' }} />
                        </label>
                      </div>

                      {/* After Uploader */}
                      <div
                        style={{
                          border: '1px solid #cce3d6',
                          borderRadius: '12px',
                          padding: '12px',
                          background: '#fff',
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#17483e', display: 'block', marginBottom: '8px' }}>
                          2. صورة النتيجة النهائية (بعد)
                        </span>

                        <div
                          style={{
                            height: '110px',
                            borderRadius: '10px',
                            background: '#eef6f1',
                            border: '1px dashed #b7d6c4',
                            overflow: 'hidden',
                            marginBottom: '10px',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {formAfterImage?.url ? (
                            <img src={formAfterImage.url} alt="بعد" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '11px', color: '#888' }}>لا توجد صورة</span>
                          )}
                        </div>

                        <label
                          style={{
                            background: '#17483e',
                            color: '#e9bd77',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-block',
                          }}
                        >
                          {formAfterImage ? 'تغيير صورة بعد' : 'رفع صورة بعد'}
                          <input type="file" accept="image/*" onChange={handleUploadAfterFile} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                    {/* Before & After Details Textareas */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#c7664f', marginBottom: '4px' }}>
                          حالة الطوفة قبل العمل:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="مثال: تقشر شديد في المعجون ورطوبة خفية في الزوايا..."
                          value={formBeforeDetails}
                          onChange={(e) => setFormBeforeDetails(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid #d5c9b6',
                            fontSize: '12px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#17483e', marginBottom: '4px' }}>
                          التشطيب والإنجاز النهائي:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="مثال: كشط كامل، طبقتين عازل رطوبة، دهان 3 أوجه فينوماستيك جوتن..."
                          value={formAfterDetails}
                          onChange={(e) => setFormAfterDetails(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid #d5c9b6',
                            fontSize: '12px',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit & Cancel Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ece4d5', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    style={{
                      background: '#fff',
                      border: '1px solid #dcd4c6',
                      color: '#687266',
                      borderRadius: '10px',
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingProject || isCompressingImages}
                    style={{
                      background: '#17483e',
                      color: '#e9bd77',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 24px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(23,72,62,0.2)',
                    }}
                  >
                    {isSubmittingProject ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    <span>{isSubmittingProject ? 'جاري الحفظ...' : editingProject ? 'حفظ التعديلات' : 'نشر المشروع في دليلك'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* WhatsApp-Style Circular Avatar Cropper Modal */}
        <AvatarCropperModal
          isOpen={cropperModalOpen}
          imageSrc={rawImageForCrop}
          onClose={() => {
            setCropperModalOpen(false);
            setRawImageForCrop(null);
          }}
          onCropComplete={handleCropComplete}
          isSaving={isUploadingAvatar}
        />

      </div>
    </Layout>
  );
}
