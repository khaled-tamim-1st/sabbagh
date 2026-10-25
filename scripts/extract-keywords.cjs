const fs = require('fs');
const path = require('path');

console.log('=== 1. HOMEPAGE & GLOBAL META ===');
const indexHtmlPath = path.join(__dirname, '../artifacts/sabbagh-kuwait/index.html');
if (fs.existsSync(indexHtmlPath)) {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const desc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/)?.[1];
  const keywords = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/)?.[1];
  console.log('Title:', title);
  console.log('Description:', desc);
  console.log('Keywords:', keywords);
}

console.log('\n=== 2. SERVICES LAYER ===');
const servicesPath = path.join(__dirname, '../artifacts/sabbagh-kuwait/src/data/services-data.ts');
if (fs.existsSync(servicesPath)) {
  const content = fs.readFileSync(servicesPath, 'utf8');
  const serviceRegex = /id:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',\s*shortName:\s*'([^']+)',\s*category:\s*'([^']+)',\s*categoryLabelAr:\s*'([^']+)'/g;
  let match;
  while ((match = serviceRegex.exec(content)) !== null) {
    console.log(`- Service: [${match[4]}] | Slug: /services/${match[2]} | Title: ${match[3]} | Category: ${match[6]}`);
  }
}

console.log('\n=== 3. BLOG POSTS LAYER (35 ARTICLES) ===');
const seoDir = path.join(__dirname, '../content-system/seo');
if (fs.existsSync(seoDir)) {
  const files = fs.readdirSync(seoDir).filter(f => f.endsWith('.json')).sort();
  files.forEach(f => {
    const d = JSON.parse(fs.readFileSync(path.join(seoDir, f), 'utf8'));
    const pk = d.primary_keyword || d.primaryKeyword;
    const sk = (d.secondary_keywords || d.secondaryKeywords || []).join(' | ');
    const slug = d.slug;
    console.log(`[${d.article_id}] Slug: /blog/${slug}`);
    console.log(`   الرئيسية: "${pk}"`);
    console.log(`   الثانوية: ${sk}`);
  });
}

console.log('\n=== 4. AREAS & GOVERNORATES LAYER ===');
const areasPath = path.join(__dirname, '../artifacts/sabbagh-kuwait/src/data/kuwait-areas.ts');
if (fs.existsSync(areasPath)) {
  const content = fs.readFileSync(areasPath, 'utf8');
  const govRegex = /id:\s*'([^']+)',\s*nameAr:\s*'([^']+)',\s*nameEn:\s*'([^']+)'/g;
  let match;
  const govs = [];
  while ((match = govRegex.exec(content)) !== null) {
    govs.push({ id: match[1], ar: match[2], en: match[3] });
  }
  console.log(`Found ${govs.length} governorate entries:`, govs.map(g => g.ar).join(', '));
}
