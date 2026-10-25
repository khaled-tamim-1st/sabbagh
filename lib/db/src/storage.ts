import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  INITIAL_USERS,
  INITIAL_PAINTERS,
  INITIAL_QUOTES,
  INITIAL_REVIEWS,
  hashPassword,
  verifyPassword,
  type UserRecord,
  type PainterRecord,
  type QuoteRecord,
  type ReviewRecord,
  type InquiryRecord,
} from "./seed-data";
import type { PortfolioProject } from "./schema";

export interface DatabaseState {
  users: UserRecord[];
  painters: PainterRecord[];
  quotes: QuoteRecord[];
  reviews: ReviewRecord[];
  inquiries: InquiryRecord[];
}

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "kuwait-painters-db.json");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Generate an SEO-friendly URL slug from painter name or company name.
 * Replaces spaces and separators with hyphens, preserving clean Arabic and alphanumeric characters.
 */
export function generatePainterSlug(nameOrCompany: string, id?: number): string {
  const clean = (nameOrCompany || "")
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, "-")
    .replace(/[^\p{L}\p{N}\-]+/gu, "")
    .replace(/^-+|-+$/g, "");
  return clean || (id ? `painter-${id}` : "painter");
}

class StorageManager {
  private state: DatabaseState;

  constructor() {
    this.state = this.load();
  }

  private load(): DatabaseState {
    try {
      ensureDirectoryExists(DATA_DIR);
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.painters && parsed.quotes) {
          parsed.painters = parsed.painters.map((p: any) => {
            const seed = INITIAL_PAINTERS.find((ip) => ip.id === p.id);
            const baseName = (p.accountType === "company" && p.companyName) ? p.companyName : (p.name || seed?.name || "");
            const slug = p.slug || (seed as any)?.slug || generatePainterSlug(baseName, p.id);
            return {
              ...p,
              slug,
              avatarUrl: p.avatarUrl !== undefined ? p.avatarUrl : (seed?.avatarUrl ?? null),
              avatarPublicId: p.avatarPublicId !== undefined ? p.avatarPublicId : (seed?.avatarPublicId ?? null),
              accountType: p.accountType || seed?.accountType || "individual",
              companyName: p.companyName ?? seed?.companyName ?? null,
              managerName: p.managerName ?? seed?.managerName ?? null,
              commercialLicense: p.commercialLicense ?? seed?.commercialLicense ?? null,
              sampleWorkImages: (p.sampleWorkImages && Array.isArray(p.sampleWorkImages))
                ? p.sampleWorkImages
                : (seed?.sampleWorkImages || []),
              portfolioProjects: (p.portfolioProjects && p.portfolioProjects.length > 0)
                ? p.portfolioProjects
                : (seed?.portfolioProjects || []),
            };
          });
          return parsed;
        }
      }
    } catch (err) {
      console.warn("StorageManager: Could not load existing db file, initializing with seed data:", err);
    }

    const defaultState: DatabaseState = {
      users: [...INITIAL_USERS],
      painters: [...INITIAL_PAINTERS],
      quotes: [...INITIAL_QUOTES],
      reviews: [...INITIAL_REVIEWS],
      inquiries: [],
    };
    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: DatabaseState) {
    try {
      ensureDirectoryExists(DATA_DIR);
      fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
    } catch (err) {
      console.error("StorageManager: Error saving db state:", err);
    }
  }

  private commit() {
    this.saveState(this.state);
  }

  // ==========================================
  // USERS
  // ==========================================
  public findUserByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    return this.state.users.find((u) => u.email.toLowerCase() === normalized) || null;
  }

  public findUserById(id: number) {
    return this.state.users.find((u) => u.id === id) || null;
  }

  public createUser(userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role?: "admin" | "painter";
  }) {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error("البريد الإلكتروني مسجل بالفعل");
    }

    const newId = this.state.users.length > 0 ? Math.max(...this.state.users.map((u) => u.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newUser = {
      id: newId,
      email: userData.email.trim().toLowerCase(),
      passwordHash: hashPassword(userData.password),
      role: userData.role || "painter",
      name: userData.name,
      phone: userData.phone,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.state.users.push(newUser);
    this.commit();
    return newUser;
  }

  public getAllUsers() {
    return this.state.users.map(({ passwordHash, ...safe }) => safe);
  }

  // ==========================================
  // PAINTERS
  // ==========================================
  public getAllPainters(filters?: { status?: string; region?: string; search?: string }) {
    let result = [...this.state.painters];

    if (filters?.status && filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters?.region && filters.region !== "كل المناطق") {
      result = result.filter(
        (p) =>
          p.region.includes(filters.region!) ||
          p.governorates.some((g) => g.includes(filters.region!))
      );
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.phone.includes(q)
      );
    }

    return result;
  }

  public getPainterById(id: number) {
    return this.state.painters.find((p) => p.id === id) || null;
  }

  public getPainterBySlug(slug: string) {
    if (!slug) return null;
    const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
    return this.state.painters.find((p) => {
      const pSlug = (p.slug || generatePainterSlug(p.accountType === "company" && p.companyName ? p.companyName : p.name, p.id)).toLowerCase();
      return pSlug === cleanSlug || p.name.trim().toLowerCase() === cleanSlug;
    }) || null;
  }

  public getPainterBySlugOrId(identifier: string | number) {
    if (typeof identifier === "number" || (/^\d+$/.test(String(identifier).trim()) && !isNaN(Number(identifier)))) {
      const byId = this.getPainterById(Number(identifier));
      if (byId) return byId;
    }
    return this.getPainterBySlug(String(identifier));
  }

  public getPainterByUserId(userId: number) {
    return this.state.painters.find((p) => p.userId === userId) || null;
  }

  public createPainter(data: Partial<PainterRecord>) {
    const newId = this.state.painters.length > 0 ? Math.max(...this.state.painters.map((p) => p.id)) + 1 : 1;
    const now = new Date().toISOString();

    const initials = data.name ? data.name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("") : "صب";
    const baseName = data.accountType === "company" && data.companyName ? data.companyName : (data.name || "صباغ كويتي");
    const slug = data.slug || generatePainterSlug(baseName, newId);

    const newPainter: PainterRecord = {
      id: newId,
      userId: data.userId ?? null,
      name: data.name || "صباغ كويتي",
      slug,
      avatarUrl: data.avatarUrl ?? null,
      avatarPublicId: data.avatarPublicId ?? null,
      initials,
      region: data.region || "كل المناطق",
      rating: "5.0",
      reviews: 0,
      years: Number(data.years) || 5,
      startingAt: data.startingAt || "18 د.ك",
      services: data.services || ["دهان داخلي", "معجون"],
      description: data.description || "",
      tone: data.tone || "ochre",
      phone: data.phone || "",
      whatsapp: data.whatsapp || data.phone || "",
      whatsappPrefill: "السلام عليكم، اطلعت على ملفكم في دليل صباغ الكويت.",
      bio: data.bio || data.description || "",
      governorates: data.governorates || ["العاصمة", "حولي"],
      warrantyYears: Number(data.warrantyYears) || 3,
      crewSize: Number(data.crewSize) || 4,
      paintBrands: data.paintBrands || ["جوتن"],
      completedProjects: Number(data.completedProjects) || 10,
      portfolioProjects: data.portfolioProjects || [],
      isAvailableToday: true,
      responseTime: "خلال 15 دقيقة",
      coverageAreaIds: data.coverageAreaIds || [],
      primaryGovernorates: data.primaryGovernorates || data.governorates || ["العاصمة"],
      isVerified: false,
      status: data.status || "pending",
      accountType: data.accountType || "individual",
      companyName: data.companyName ?? null,
      managerName: data.managerName ?? null,
      commercialLicense: data.commercialLicense ?? null,
      sampleWorkImages: data.sampleWorkImages || [],
      createdAt: now,
      updatedAt: now,
    };

    this.state.painters.push(newPainter);
    this.commit();
    return newPainter;
  }

  public updatePainter(id: number, updates: Partial<PainterRecord>) {
    const idx = this.state.painters.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    this.state.painters[idx] = {
      ...this.state.painters[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.commit();
    return this.state.painters[idx];
  }

  public setPainterAvailability(id: number, isAvailable: boolean) {
    return this.updatePainter(id, { isAvailableToday: isAvailable });
  }

  public setPainterVerified(id: number, isVerified: boolean) {
    return this.updatePainter(id, { isVerified });
  }

  public setPainterStatus(id: number, status: "approved" | "pending" | "rejected" | "suspended") {
    return this.updatePainter(id, { status });
  }

  // ==========================================
  // PAINTER AVATAR & PORTFOLIO MANAGEMENT
  // ==========================================
  public updatePainterAvatar(painterId: number, avatarUrl: string, avatarPublicId?: string): PainterRecord {
    const idx = this.state.painters.findIndex((p) => p.id === painterId);
    if (idx === -1) {
      throw new Error(`الصباغ غير موجود (معرف: ${painterId})`);
    }

    this.state.painters[idx] = {
      ...this.state.painters[idx],
      avatarUrl,
      avatarPublicId: avatarPublicId !== undefined ? avatarPublicId : (this.state.painters[idx].avatarPublicId ?? null),
      updatedAt: new Date().toISOString(),
    };
    this.commit();
    return this.state.painters[idx];
  }

  public deletePainterAvatar(painterId: number): { updatedPainter: PainterRecord; deletedPublicId?: string | null } {
    const idx = this.state.painters.findIndex((p) => p.id === painterId);
    if (idx === -1) {
      throw new Error(`الصباغ غير موجود (معرف: ${painterId})`);
    }

    const deletedPublicId = this.state.painters[idx].avatarPublicId ?? null;
    this.state.painters[idx] = {
      ...this.state.painters[idx],
      avatarUrl: null,
      avatarPublicId: null,
      updatedAt: new Date().toISOString(),
    };
    this.commit();
    return {
      updatedPainter: this.state.painters[idx],
      deletedPublicId,
    };
  }

  public getPainterPortfolio(painterId: number): PortfolioProject[] {
    const painter = this.getPainterById(painterId);
    if (!painter) return [];
    return painter.portfolioProjects || [];
  }

  public addPainterPortfolioProject(
    painterId: number,
    projectData: Omit<PortfolioProject, 'id' | 'painterId' | 'createdAt' | 'updatedAt'>
  ): PortfolioProject {
    const idx = this.state.painters.findIndex((p) => p.id === painterId);
    if (idx === -1) {
      throw new Error(`الصباغ غير موجود (معرف: ${painterId})`);
    }

    const painter = this.state.painters[idx];
    if (!painter.portfolioProjects) {
      painter.portfolioProjects = [];
    }

    const now = new Date().toISOString();
    const newProject: PortfolioProject = {
      id: `proj-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      painterId,
      title: projectData.title,
      category: projectData.category,
      description: projectData.description || "",
      displayMode: projectData.displayMode || "standard",
      galleryImages: projectData.galleryImages || [],
      beforeImage: projectData.beforeImage,
      afterImage: projectData.afterImage,
      beforeDetails: projectData.beforeDetails,
      afterDetails: projectData.afterDetails,
      materialsUsed: projectData.materialsUsed,
      area: projectData.area,
      createdAt: now,
      updatedAt: now,
    };

    painter.portfolioProjects.unshift(newProject);
    painter.updatedAt = now;
    this.commit();

    return newProject;
  }

  public updatePainterPortfolioProject(
    painterId: number,
    projectId: string,
    updates: Partial<PortfolioProject>
  ): PortfolioProject {
    const idx = this.state.painters.findIndex((p) => p.id === painterId);
    if (idx === -1) {
      throw new Error(`الصباغ غير موجود (معرف: ${painterId})`);
    }

    const painter = this.state.painters[idx];
    if (!painter.portfolioProjects) {
      painter.portfolioProjects = [];
    }

    const projIdx = painter.portfolioProjects.findIndex((p) => p.id === projectId);
    if (projIdx === -1) {
      throw new Error(`المشروع غير موجود (معرف: ${projectId})`);
    }

    const currentProject = painter.portfolioProjects[projIdx];
    const updatedProject: PortfolioProject = {
      ...currentProject,
      ...updates,
      id: currentProject.id,
      painterId: currentProject.painterId,
      updatedAt: new Date().toISOString(),
    };

    painter.portfolioProjects[projIdx] = updatedProject;
    painter.updatedAt = new Date().toISOString();
    this.commit();

    return updatedProject;
  }

  public deletePainterPortfolioProject(
    painterId: number,
    projectId: string
  ): { updatedPainter: PainterRecord; deletedProject?: PortfolioProject } {
    const idx = this.state.painters.findIndex((p) => p.id === painterId);
    if (idx === -1) {
      throw new Error(`الصباغ غير موجود (معرف: ${painterId})`);
    }

    const painter = this.state.painters[idx];
    if (!painter.portfolioProjects) {
      painter.portfolioProjects = [];
    }

    const projIdx = painter.portfolioProjects.findIndex((p) => p.id === projectId);
    let deletedProject: PortfolioProject | undefined = undefined;

    if (projIdx !== -1) {
      const removed = painter.portfolioProjects.splice(projIdx, 1);
      deletedProject = removed[0];
      painter.updatedAt = new Date().toISOString();
      this.commit();
    }

    return {
      updatedPainter: painter,
      deletedProject,
    };
  }

  // ==========================================
  // QUOTE REQUESTS (LEADS)
  // ==========================================
  public getAllQuotes(filters?: { status?: string; painterId?: number }) {
    let result = [...this.state.quotes];

    if (filters?.status && filters.status !== "all") {
      result = result.filter((q) => q.status === filters.status);
    }

    if (filters?.painterId) {
      result = result.filter((q) => q.assignedPainterId === filters.painterId);
    }

    // Sort descending by creation date
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getQuoteById(id: number) {
    return this.state.quotes.find((q) => q.id === id) || null;
  }

  public createQuote(data: Partial<QuoteRecord>) {
    const newId = this.state.quotes.length > 0 ? Math.max(...this.state.quotes.map((q) => q.id)) + 1 : 1;
    const now = new Date().toISOString();

    const newQuote: QuoteRecord = {
      id: newId,
      customerName: data.customerName || "عميل",
      customerPhone: data.customerPhone || "",
      customerNotes: data.customerNotes || "",
      propertyType: data.propertyType || "apartment",
      workType: data.workType || "interior",
      roomsCount: Number(data.roomsCount) || 3,
      includeMaterials: data.includeMaterials !== false,
      paintQuality: data.paintQuality || "jotun-fenomastic",
      governorateId: data.governorateId || "hawalli",
      areaId: data.areaId || "al-salmiya",
      preferredDate: data.preferredDate || "morning",
      estimatedMinKwd: Number(data.estimatedMinKwd) || 50,
      estimatedMaxKwd: Number(data.estimatedMaxKwd) || 80,
      estimatedAverageKwd: Number(data.estimatedAverageKwd) || 65,
      assignedPainterId: data.assignedPainterId ?? null,
      status: (data.status as QuoteRecord["status"]) || "new",
      createdAt: now,
      updatedAt: now,
    };

    this.state.quotes.unshift(newQuote);
    this.commit();
    return newQuote;
  }

  public updateQuoteStatus(id: number, status: string, assignedPainterId?: number | null) {
    const idx = this.state.quotes.findIndex((q) => q.id === id);
    if (idx === -1) return null;

    this.state.quotes[idx] = {
      ...this.state.quotes[idx],
      status: status as QuoteRecord["status"],
      ...(assignedPainterId !== undefined ? { assignedPainterId } : {}),
      updatedAt: new Date().toISOString(),
    };
    this.commit();
    return this.state.quotes[idx];
  }

  // ==========================================
  // REVIEWS
  // ==========================================
  public getAllReviews() {
    return [...this.state.reviews]
      .map((r) => {
        const painter = this.getPainterById(r.painterId);
        return {
          ...r,
          painterName: painter ? painter.name : `صباغ #${r.painterId}`,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getReviewsByPainterId(painterId: number) {
    return this.state.reviews.filter((r) => r.painterId === painterId && r.status === "approved");
  }

  public createReview(data: Partial<ReviewRecord>) {
    const newId = this.state.reviews.length > 0 ? Math.max(...this.state.reviews.map((r) => r.id)) + 1 : 1;
    const now = new Date().toISOString();

    const newReview: ReviewRecord = {
      id: newId,
      painterId: data.painterId || 1,
      author: data.author || "عميل",
      authorPhone: data.authorPhone || data.whatsapp || null,
      whatsapp: data.whatsapp || data.authorPhone || null,
      date: "الآن",
      rating: Number(data.rating) || 5,
      area: data.area || "الكويت",
      comment: data.comment || "",
      serviceType: data.serviceType || "صبغ داخلي",
      verified: false,
      status: data.status || "pending",
      createdAt: now,
    };

    this.state.reviews.unshift(newReview);
    this.commit();
    return newReview;
  }

  public updateReviewStatus(id: number, status: "approved" | "pending" | "rejected") {
    const idx = this.state.reviews.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    
    this.state.reviews[idx].status = status;
    if (status === "approved") {
      this.state.reviews[idx].verified = true;
    }

    // Recalculate painter's average rating and review count
    const painterId = this.state.reviews[idx].painterId;
    const approvedPainterReviews = this.state.reviews.filter(
      (r) => r.painterId === painterId && r.status === "approved"
    );

    if (approvedPainterReviews.length > 0) {
      const avg = (
        approvedPainterReviews.reduce((sum, r) => sum + r.rating, 0) /
        approvedPainterReviews.length
      ).toFixed(1);
      this.updatePainter(painterId, {
        rating: avg,
        reviews: approvedPainterReviews.length,
      });
    }

    this.commit();
    return this.state.reviews[idx];
  }

  // ==========================================
  // INQUIRIES
  // ==========================================
  public getAllInquiries() {
    return [...this.state.inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createInquiry(data: Partial<InquiryRecord>) {
    const newId = this.state.inquiries.length > 0 ? Math.max(...this.state.inquiries.map((i) => i.id)) + 1 : 1;
    const now = new Date().toISOString();

    const newInquiry: InquiryRecord = {
      id: newId,
      painterId: data.painterId ?? null,
      customerName: data.customerName || "عميل",
      customerPhone: data.customerPhone || "",
      message: data.message || "",
      status: data.status || "new",
      createdAt: now,
    };

    this.state.inquiries.unshift(newInquiry);
    this.commit();
    return newInquiry;
  }

  // ==========================================
  // STATS & KPI METRICS
  // ==========================================
  public getAdminStats() {
    const totalPainters = this.state.painters.length;
    const verifiedPainters = this.state.painters.filter((p) => p.isVerified).length;
    const pendingPainters = this.state.painters.filter((p) => p.status === "pending").length;
    const availableToday = this.state.painters.filter((p) => p.isAvailableToday).length;

    const totalQuotes = this.state.quotes.length;
    const newQuotes = this.state.quotes.filter((q) => q.status === "new").length;
    const contactedQuotes = this.state.quotes.filter((q) => q.status === "contacted" || q.status === "assigned").length;
    const completedQuotes = this.state.quotes.filter((q) => q.status === "completed").length;

    const totalReviews = this.state.reviews.length;
    const averageRating = totalReviews > 0
      ? (this.state.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "4.9";

    return {
      painters: {
        total: totalPainters,
        verified: verifiedPainters,
        pending: pendingPainters,
        availableToday,
      },
      quotes: {
        total: totalQuotes,
        new: newQuotes,
        inProgress: contactedQuotes,
        completed: completedQuotes,
      },
      reviews: {
        total: totalReviews,
        averageRating,
      },
    };
  }
}

export const storage = new StorageManager();
