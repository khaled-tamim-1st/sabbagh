-- ==============================================================================
-- Kuwait Painters Platform - PostgreSQL Initial Schema
-- Auto-generated from Drizzle ORM Schema definition for Production Deployment
-- ==============================================================================

-- 1. جدول المستخدمين (مديرين وصباغين)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'painter',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. جدول بيانات الصباغين والورش
CREATE TABLE IF NOT EXISTS painters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  avatar_public_id TEXT,
  initials TEXT NOT NULL DEFAULT 'صب',
  region TEXT NOT NULL DEFAULT 'كل المناطق',
  rating TEXT NOT NULL DEFAULT '4.9',
  reviews INTEGER NOT NULL DEFAULT 0,
  years INTEGER NOT NULL DEFAULT 5,
  starting_at TEXT NOT NULL DEFAULT '18 د.ك',
  services JSONB NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tone TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  whatsapp_prefill TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  governorates JSONB NOT NULL,
  warranty_years INTEGER NOT NULL DEFAULT 3,
  crew_size INTEGER NOT NULL DEFAULT 4,
  paint_brands JSONB NOT NULL,
  completed_projects INTEGER NOT NULL DEFAULT 50,
  portfolio_projects JSONB DEFAULT '[]'::jsonb,
  is_available_today BOOLEAN NOT NULL DEFAULT true,
  response_time TEXT NOT NULL DEFAULT 'خلال 15 دقيقة',
  coverage_area_ids JSONB NOT NULL,
  primary_governorates JSONB NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'approved',
  account_type TEXT NOT NULL DEFAULT 'individual',
  company_name TEXT,
  manager_name TEXT,
  commercial_license TEXT,
  sample_work_images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. جدول قائمة أسعار الصباغ
CREATE TABLE IF NOT EXISTS painter_pricing (
  id SERIAL PRIMARY KEY,
  painter_id INTEGER NOT NULL REFERENCES painters(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  price TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT ''
);

-- 4. جدول معرض الأعمال (قبل وبعد)
CREATE TABLE IF NOT EXISTS painter_gallery (
  id SERIAL PRIMARY KEY,
  painter_id INTEGER NOT NULL REFERENCES painters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  before_label TEXT,
  after_label TEXT,
  before_details TEXT NOT NULL DEFAULT '',
  after_details TEXT NOT NULL DEFAULT '',
  materials_used TEXT NOT NULL DEFAULT '',
  image_url TEXT
);

-- 5. جدول تقييمات العملاء
CREATE TABLE IF NOT EXISTS painter_reviews (
  id SERIAL PRIMARY KEY,
  painter_id INTEGER NOT NULL REFERENCES painters(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_phone TEXT,
  whatsapp TEXT,
  date TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  area TEXT NOT NULL DEFAULT 'الكويت',
  comment TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT 'صبغ داخلي',
  verified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. جدول طلبات المعاينة وعروض الأسعار (Leads)
CREATE TABLE IF NOT EXISTS quote_requests (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_notes TEXT DEFAULT '',
  property_type TEXT NOT NULL DEFAULT 'apartment',
  work_type TEXT NOT NULL DEFAULT 'interior',
  rooms_count INTEGER NOT NULL DEFAULT 3,
  include_materials BOOLEAN NOT NULL DEFAULT true,
  paint_quality TEXT NOT NULL DEFAULT 'jotun-fenomastic',
  governorate_id TEXT NOT NULL DEFAULT 'hawalli',
  area_id TEXT NOT NULL DEFAULT 'al-salmiya',
  preferred_date TEXT NOT NULL DEFAULT 'morning',
  estimated_min_kwd INTEGER NOT NULL DEFAULT 0,
  estimated_max_kwd INTEGER NOT NULL DEFAULT 0,
  estimated_average_kwd INTEGER NOT NULL DEFAULT 0,
  assigned_painter_id INTEGER REFERENCES painters(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 7. جدول استفسارات التواصل السريع
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id SERIAL PRIMARY KEY,
  painter_id INTEGER REFERENCES painters(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 8. الفهارس لتحسين الأداء (Indexes)
CREATE INDEX IF NOT EXISTS idx_painters_user_id ON painters(user_id);
CREATE INDEX IF NOT EXISTS idx_painters_status ON painters(status);
CREATE INDEX IF NOT EXISTS idx_painters_slug ON painters(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_painter_id ON painter_reviews(painter_id);
CREATE INDEX IF NOT EXISTS idx_quotes_painter_id ON quote_requests(assigned_painter_id);
