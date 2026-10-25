#!/usr/bin/env node
/**
 * Migration Script: Ingest .data/kuwait-painters-db.json into PostgreSQL
 * Usage: DATABASE_URL="postgresql://user:pass@host:5432/db" node scripts/migrate-json-to-postgres.cjs
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const DATA_FILE = process.env.DATA_FILE || path.resolve(__dirname, '../.data/kuwait-painters-db.json');
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required.");
  process.exit(1);
}

if (!fs.existsSync(DATA_FILE)) {
  console.error(`ERROR: Data file not found at ${DATA_FILE}`);
  process.exit(1);
}

async function runMigration() {
  console.log(`[INFO] Reading source JSON from: ${DATA_FILE}`);
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const dbData = JSON.parse(raw);

  const pool = new Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('[INFO] Transaction started.');

    // 1. Users
    if (Array.isArray(dbData.users) && dbData.users.length > 0) {
      console.log(`[INFO] Migrating ${dbData.users.length} users...`);
      for (const u of dbData.users) {
        await client.query(`
          INSERT INTO users (id, email, password_hash, role, name, phone, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            password_hash = EXCLUDED.password_hash,
            role = EXCLUDED.role,
            name = EXCLUDED.name,
            phone = EXCLUDED.phone,
            is_active = EXCLUDED.is_active,
            updated_at = EXCLUDED.updated_at
        `, [
          u.id,
          u.email,
          u.passwordHash,
          u.role || 'painter',
          u.name,
          u.phone,
          u.isActive !== false,
          u.createdAt ? new Date(u.createdAt) : new Date(),
          u.updatedAt ? new Date(u.updatedAt) : new Date(),
        ]);
      }
      await client.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`);
    }

    // 2. Painters
    if (Array.isArray(dbData.painters) && dbData.painters.length > 0) {
      console.log(`[INFO] Migrating ${dbData.painters.length} painters...`);
      for (const p of dbData.painters) {
        await client.query(`
          INSERT INTO painters (
            id, user_id, name, slug, avatar_url, avatar_public_id, initials, region, rating,
            reviews, years, starting_at, services, description, tone, phone, whatsapp,
            whatsapp_prefill, bio, governorates, warranty_years, crew_size, paint_brands,
            completed_projects, portfolio_projects, is_available_today, response_time,
            coverage_area_ids, primary_governorates, is_verified, status, account_type,
            company_name, manager_name, commercial_license, sample_work_images, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15, $16, $17,
            $18, $19, $20, $21, $22, $23,
            $24, $25, $26, $27,
            $28, $29, $30, $31, $32,
            $33, $34, $35, $36, $37, $38
          )
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            avatar_url = EXCLUDED.avatar_url,
            avatar_public_id = EXCLUDED.avatar_public_id,
            rating = EXCLUDED.rating,
            reviews = EXCLUDED.reviews,
            portfolio_projects = EXCLUDED.portfolio_projects,
            is_verified = EXCLUDED.is_verified,
            status = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at
        `, [
          p.id,
          p.userId || null,
          p.name,
          p.slug || '',
          p.avatarUrl || null,
          p.avatarPublicId || null,
          p.initials || 'صب',
          p.region || 'كل المناطق',
          p.rating || '4.9',
          p.reviews || 0,
          p.years || 5,
          p.startingAt || '18 د.ك',
          JSON.stringify(p.services || []),
          p.description || '',
          p.tone || '',
          p.phone || '',
          p.whatsapp || '',
          p.whatsappPrefill || '',
          p.bio || '',
          JSON.stringify(p.governorates || []),
          p.warrantyYears || 3,
          p.crewSize || 4,
          JSON.stringify(p.paintBrands || []),
          p.completedProjects || 50,
          JSON.stringify(p.portfolioProjects || []),
          p.isAvailableToday !== false,
          p.responseTime || 'خلال 15 دقيقة',
          JSON.stringify(p.coverageAreaIds || []),
          JSON.stringify(p.primaryGovernorates || []),
          p.isVerified || false,
          p.status || 'approved',
          p.accountType || 'individual',
          p.companyName || null,
          p.managerName || null,
          p.commercialLicense || null,
          JSON.stringify(p.sampleWorkImages || []),
          p.createdAt ? new Date(p.createdAt) : new Date(),
          p.updatedAt ? new Date(p.updatedAt) : new Date(),
        ]);
      }
      await client.query(`SELECT setval('painters_id_seq', (SELECT MAX(id) FROM painters));`);
    }

    // 3. Quotes
    if (Array.isArray(dbData.quotes) && dbData.quotes.length > 0) {
      console.log(`[INFO] Migrating ${dbData.quotes.length} quote requests...`);
      for (const q of dbData.quotes) {
        await client.query(`
          INSERT INTO quote_requests (
            id, customer_name, customer_phone, customer_notes, property_type, work_type,
            rooms_count, include_materials, paint_quality, governorate_id, area_id,
            preferred_date, estimated_min_kwd, estimated_max_kwd, estimated_average_kwd,
            assigned_painter_id, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (id) DO NOTHING
        `, [
          q.id,
          q.customerName,
          q.customerPhone,
          q.customerNotes || '',
          q.propertyType || 'apartment',
          q.workType || 'interior',
          q.roomsCount || 3,
          q.includeMaterials !== false,
          q.paintQuality || 'jotun-fenomastic',
          q.governorateId || 'hawalli',
          q.areaId || 'al-salmiya',
          q.preferredDate || 'morning',
          q.estimatedMinKwd || 0,
          q.estimatedMaxKwd || 0,
          q.estimatedAverageKwd || 0,
          q.assignedPainterId || null,
          q.status || 'new',
          q.createdAt ? new Date(q.createdAt) : new Date(),
          q.updatedAt ? new Date(q.updatedAt) : new Date(),
        ]);
      }
      await client.query(`SELECT setval('quote_requests_id_seq', (SELECT MAX(id) FROM quote_requests));`);
    }

    // 4. Reviews
    if (Array.isArray(dbData.reviews) && dbData.reviews.length > 0) {
      console.log(`[INFO] Migrating ${dbData.reviews.length} reviews...`);
      for (const r of dbData.reviews) {
        await client.query(`
          INSERT INTO painter_reviews (
            id, painter_id, author, author_phone, whatsapp, date, rating, area,
            comment, service_type, verified, status, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO NOTHING
        `, [
          r.id,
          r.painterId,
          r.author,
          r.authorPhone || null,
          r.whatsapp || null,
          r.date || 'الآن',
          r.rating || 5,
          r.area || 'الكويت',
          r.comment || '',
          r.serviceType || 'صبغ داخلي',
          r.verified || false,
          r.status || 'pending',
          r.createdAt ? new Date(r.createdAt) : new Date(),
        ]);
      }
      await client.query(`SELECT setval('painter_reviews_id_seq', (SELECT MAX(id) FROM painter_reviews));`);
    }

    await client.query('COMMIT');
    console.log('[SUCCESS] Migration completed successfully with all records intact!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[ERROR] Migration failed, transaction rolled back:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
