import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ==========================================
// 1. جدول المستخدمين (مديرين وصباغين)
// ==========================================
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("painter"), // 'admin' | 'painter'
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const selectUserSchema = createSelectSchema(usersTable);
export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

// ==========================================
// 2. واجهات وصور معرض الأعمال والمشاريع
// ==========================================
export interface PortfolioImage {
  id: string;
  url: string;
  publicId?: string;
  dataUri?: string;
  caption?: string;
  isBefore?: boolean;
  isAfter?: boolean;
}

export interface PortfolioProject {
  id: string;
  painterId?: number;
  title: string;
  category: string;
  description: string;
  displayMode: 'standard' | 'before_after';
  galleryImages: PortfolioImage[];
  beforeImage?: PortfolioImage;
  afterImage?: PortfolioImage;
  beforeDetails?: string;
  afterDetails?: string;
  materialsUsed?: string;
  area?: string;
  createdAt: string;
  updatedAt?: string;
}

// ==========================================
// 2. جدول بيانات الصباغين والورش
// ==========================================
export const paintersTable = pgTable("painters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().default(""),
  avatarUrl: text("avatar_url"),
  avatarPublicId: text("avatar_public_id"),
  initials: text("initials").notNull().default("صب"),
  region: text("region").notNull().default("كل المناطق"),
  rating: text("rating").notNull().default("4.9"),
  reviews: integer("reviews").notNull().default(0),
  years: integer("years").notNull().default(5),
  startingAt: text("starting_at").notNull().default("18 د.ك"),
  services: jsonb("services").notNull().$type<string[]>(),
  description: text("description").notNull().default(""),
  tone: text("tone").notNull().default(""), // '' | 'ochre' | 'rose' | 'blue'
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  whatsappPrefill: text("whatsapp_prefill").notNull().default(""),
  bio: text("bio").notNull().default(""),
  governorates: jsonb("governorates").notNull().$type<string[]>(),
  warrantyYears: integer("warranty_years").notNull().default(3),
  crewSize: integer("crew_size").notNull().default(4),
  paintBrands: jsonb("paint_brands").notNull().$type<string[]>(),
  completedProjects: integer("completed_projects").notNull().default(50),
  portfolioProjects: jsonb("portfolio_projects").$type<PortfolioProject[]>().default([]),
  isAvailableToday: boolean("is_available_today").notNull().default(true),
  responseTime: text("response_time").notNull().default("خلال 15 دقيقة"),
  coverageAreaIds: jsonb("coverage_area_ids").notNull().$type<string[]>(),
  primaryGovernorates: jsonb("primary_governorates").notNull().$type<string[]>(),
  isVerified: boolean("is_verified").notNull().default(false),
  status: text("status").notNull().default("approved"), // 'approved' | 'pending' | 'rejected' | 'suspended'
  accountType: text("account_type").notNull().default("individual"), // 'company' | 'individual'
  companyName: text("company_name"),
  managerName: text("manager_name"),
  commercialLicense: text("commercial_license"),
  sampleWorkImages: jsonb("sample_work_images").$type<PortfolioImage[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPainterSchema = createInsertSchema(paintersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const selectPainterSchema = createSelectSchema(paintersTable);
export type Painter = typeof paintersTable.$inferSelect;
export type InsertPainter = typeof paintersTable.$inferInsert;

// ==========================================
// 3. جدول قائمة أسعار الصباغ
// ==========================================
export const painterPricingTable = pgTable("painter_pricing", {
  id: serial("id").primaryKey(),
  painterId: integer("painter_id").references(() => paintersTable.id, { onDelete: "cascade" }).notNull(),
  item: text("item").notNull(),
  price: text("price").notNull(),
  note: text("note").notNull().default(""),
});

export type PainterPriceItem = typeof painterPricingTable.$inferSelect;

// ==========================================
// 4. جدول معرض الأعمال (قبل وبعد)
// ==========================================
export const painterGalleryTable = pgTable("painter_gallery", {
  id: serial("id").primaryKey(),
  painterId: integer("painter_id").references(() => paintersTable.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull().default(""),
  beforeLabel: text("before_label"),
  afterLabel: text("after_label"),
  beforeDetails: text("before_details").notNull().default(""),
  afterDetails: text("after_details").notNull().default(""),
  materialsUsed: text("materials_used").notNull().default(""),
  imageUrl: text("image_url"),
});

export type PainterGalleryItem = typeof painterGalleryTable.$inferSelect;

// ==========================================
// 5. جدول تقييمات العملاء
// ==========================================
export const painterReviewsTable = pgTable("painter_reviews", {
  id: serial("id").primaryKey(),
  painterId: integer("painter_id").references(() => paintersTable.id, { onDelete: "cascade" }).notNull(),
  author: text("author").notNull(),
  authorPhone: text("author_phone"),
  whatsapp: text("whatsapp"),
  date: text("date").notNull(),
  rating: integer("rating").notNull().default(5),
  area: text("area").notNull().default("الكويت"),
  comment: text("comment").notNull(),
  serviceType: text("service_type").notNull().default("صبغ داخلي"),
  verified: boolean("verified").notNull().default(false),
  status: text("status").notNull().default("pending"), // 'approved' | 'pending' | 'rejected'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PainterReview = typeof painterReviewsTable.$inferSelect;

// ==========================================
// 6. جدول طلبات المعاينة وعروض الأسعار (Leads)
// ==========================================
export const quoteRequestsTable = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerNotes: text("customer_notes").default(""),
  propertyType: text("property_type").notNull().default("apartment"),
  workType: text("work_type").notNull().default("interior"),
  roomsCount: integer("rooms_count").notNull().default(3),
  includeMaterials: boolean("include_materials").notNull().default(true),
  paintQuality: text("paint_quality").notNull().default("jotun-fenomastic"),
  governorateId: text("governorate_id").notNull().default("hawalli"),
  areaId: text("area_id").notNull().default("al-salmiya"),
  preferredDate: text("preferred_date").notNull().default("morning"),
  estimatedMinKwd: integer("estimated_min_kwd").notNull().default(0),
  estimatedMaxKwd: integer("estimated_max_kwd").notNull().default(0),
  estimatedAverageKwd: integer("estimated_average_kwd").notNull().default(0),
  assignedPainterId: integer("assigned_painter_id").references(() => paintersTable.id, { onDelete: "set null" }),
  status: text("status").notNull().default("new"), // 'new' | 'assigned' | 'contacted' | 'completed' | 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuoteSchema = createInsertSchema(quoteRequestsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type QuoteRequest = typeof quoteRequestsTable.$inferSelect;
export type InsertQuoteRequest = typeof quoteRequestsTable.$inferInsert;

// ==========================================
// 7. جدول استفسارات التواصل السريع
// ==========================================
export const contactInquiriesTable = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  painterId: integer("painter_id").references(() => paintersTable.id, { onDelete: "set null" }),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("new"), // 'new' | 'contacted' | 'closed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ContactInquiry = typeof contactInquiriesTable.$inferSelect;