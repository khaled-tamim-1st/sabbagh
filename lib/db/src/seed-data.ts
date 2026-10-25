import crypto from "node:crypto";
import type { PortfolioProject, PortfolioImage } from "./schema";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

export interface UserRecord {
  id: number;
  email: string;
  passwordHash: string;
  role: "admin" | "painter";
  name: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PainterRecord {
  id: number;
  userId: number | null;
  name: string;
  slug?: string;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  initials: string;
  region: string;
  rating: string;
  reviews: number;
  years: number;
  startingAt: string;
  services: string[];
  description: string;
  tone: string;
  phone: string;
  whatsapp: string;
  whatsappPrefill: string;
  bio: string;
  governorates: string[];
  warrantyYears: number;
  crewSize: number;
  paintBrands: string[];
  completedProjects: number;
  portfolioProjects?: PortfolioProject[];
  isAvailableToday: boolean;
  responseTime: string;
  coverageAreaIds: string[];
  primaryGovernorates: string[];
  isVerified: boolean;
  status: "approved" | "pending" | "rejected" | "suspended";
  accountType?: "company" | "individual";
  companyName?: string | null;
  managerName?: string | null;
  commercialLicense?: string | null;
  sampleWorkImages?: PortfolioImage[];
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRecord {
  id: number;
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
  propertyType: string;
  workType: string;
  roomsCount: number;
  includeMaterials: boolean;
  paintQuality: string;
  governorateId: string;
  areaId: string;
  preferredDate: string;
  estimatedMinKwd: number;
  estimatedMaxKwd: number;
  estimatedAverageKwd: number;
  assignedPainterId: number | null;
  status: "new" | "assigned" | "contacted" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRecord {
  id: number;
  painterId: number;
  author: string;
  authorPhone?: string | null;
  whatsapp?: string | null;
  date: string;
  rating: number;
  area: string;
  comment: string;
  serviceType: string;
  verified: boolean;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
}

export interface InquiryRecord {
  id: number;
  painterId?: number | null;
  customerName: string;
  customerPhone: string;
  message: string;
  status: string;
  createdAt: string;
}

export const INITIAL_USERS: UserRecord[] = [
  {
    id: 1,
    email: "admin@sabbagh-kuwait.com",
    passwordHash: hashPassword("Admin@123456"),
    role: "admin",
    name: "مدير منصة صباغ الكويت",
    phone: "96590001122",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_PAINTERS: PainterRecord[] = [];

export const INITIAL_QUOTES: QuoteRecord[] = [];

export const INITIAL_REVIEWS: ReviewRecord[] = [];
