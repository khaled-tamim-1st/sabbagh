const fs = require('fs');
const path = require('path');
const { parseMarkdownArticle } = require('./parse-helper.cjs');

const BLOG_POSTS_PATH = path.join(__dirname, '../artifacts/sabbagh-kuwait/src/data/blog-posts.ts');
const BLOG_PAGE_PATH = path.join(__dirname, '../artifacts/sabbagh-kuwait/src/pages/blog-page.tsx');
const SITEMAP_PATH = path.join(__dirname, '../artifacts/sabbagh-kuwait/public/sitemap.xml');

// Read existing blog-posts.ts
const existingContent = fs.readFileSync(BLOG_POSTS_PATH, 'utf8');

// Parse new articles (ARTICLE-06 to ARTICLE-30)
const newArticles = [];
for (let i = 6; i <= 30; i++) {
  const numStr = i < 10 ? '0' + i : '' + i;
  const artId = 'ARTICLE-' + numStr;
  const mdPath = path.join(__dirname, `../content-system/drafts/${artId}.md`);
  const jsonPath = path.join(__dirname, `../content-system/seo/${artId}.json`);

  if (fs.existsSync(mdPath) && fs.existsSync(jsonPath)) {
    const parsed = parseMarkdownArticle(mdPath, jsonPath, artId);
    newArticles.push({ artId, parsed });
    console.log(`Parsed ${artId}: ${parsed.slug}`);
  } else {
    console.error(`Missing file for ${artId}`);
  }
}

console.log(`Successfully parsed ${newArticles.length} new articles.`);

// Now let's extract the existing 10 articles from blog-posts.ts
// We want to keep the existing 5 articles (ARTICLE-01 to ARTICLE-05) and the 5 pre-existing articles.
// Let's find the closing `];` of BLOG_ARTICLES in existingContent.
const endOfArticlesIndex = existingContent.lastIndexOf('];');
if (endOfArticlesIndex === -1) {
  throw new Error('Could not find end of BLOG_ARTICLES array in blog-posts.ts');
}

// Generate code for new articles
let newArticlesCode = '\n';
for (const item of newArticles) {
  const a = item.parsed;
  newArticlesCode += `  // ========================================================\n`;
  newArticlesCode += `  // المقال المنشور: ${a.title} (${item.artId})\n`;
  newArticlesCode += `  // ========================================================\n`;
  newArticlesCode += `  {\n`;
  newArticlesCode += `    id: ${JSON.stringify(a.id)},\n`;
  newArticlesCode += `    slug: ${JSON.stringify(a.slug)},\n`;
  newArticlesCode += `    title: ${JSON.stringify(a.title)},\n`;
  newArticlesCode += `    excerpt: ${JSON.stringify(a.excerpt)},\n`;
  newArticlesCode += `    category: ${JSON.stringify(a.category)} as any,\n`;
  newArticlesCode += `    categoryLabelAr: ${JSON.stringify(a.categoryLabelAr)},\n`;
  newArticlesCode += `    author: {\n`;
  newArticlesCode += `      name: ${JSON.stringify(a.author.name)},\n`;
  newArticlesCode += `      role: ${JSON.stringify(a.author.role)},\n`;
  newArticlesCode += `      experience: ${JSON.stringify(a.author.experience)},\n`;
  newArticlesCode += `    },\n`;
  newArticlesCode += `    publishedAt: ${JSON.stringify(a.publishedAt)},\n`;
  newArticlesCode += `    readTime: ${JSON.stringify(a.readTime)},\n`;
  newArticlesCode += `    viewsCount: ${a.viewsCount},\n`;
  newArticlesCode += `    tags: ${JSON.stringify(a.tags)},\n`;
  newArticlesCode += `    tableOfContents: ${JSON.stringify(a.tableOfContents, null, 6)},\n`;
  newArticlesCode += `    contentSections: ${JSON.stringify(a.contentSections, null, 6)},\n`;
  newArticlesCode += `  },\n`;
}

// Update BlogArticle interface category union
const updatedInterface = existingContent.replace(
  /category:\s*'qasima-finishing'[^;]+;/,
  `category:
    | 'qasima-finishing'
    | 'comparisons'
    | 'humidity-repair'
    | 'cladding-decor'
    | 'color-trends'
    | 'pricing-costs'
    | 'doors-woodwork'
    | 'exterior-facades'
    | 'interior-decor'
    | 'contractor-guide'
    | string;`
);

// Insert new articles before `];`
const beforeClosing = updatedInterface.slice(0, endOfArticlesIndex);
const afterClosing = updatedInterface.slice(endOfArticlesIndex);
const updatedBlogPostsContent = beforeClosing + newArticlesCode + afterClosing;

fs.writeFileSync(BLOG_POSTS_PATH, updatedBlogPostsContent, 'utf8');
console.log(`Updated ${BLOG_POSTS_PATH} successfully!`);

// Update blog-page.tsx categories
let blogPageContent = fs.readFileSync(BLOG_PAGE_PATH, 'utf8');
const newCategoriesCode = `  const categories = [
    { id: 'all', label: 'كافة المقالات' },
    { id: 'pricing-costs', label: 'الأسعار وتكلفة الصبغ' },
    { id: 'qasima-finishing', label: 'تشطيب قسائم جديدة' },
    { id: 'exterior-facades', label: 'الواجهات والسيجما الخارجية' },
    { id: 'humidity-repair', label: 'علاج الرطوبة والخرير' },
    { id: 'doors-woodwork', label: 'الأبواب والمظلات والحديد' },
    { id: 'interior-decor', label: 'الأصباغ والديكورات الداخلية' },
    { id: 'color-trends', label: 'كتالوجات وتنسيق الألوان' },
    { id: 'contractor-guide', label: 'اختيار الصباغ والفحص' },
    { id: 'cladding-decor', label: 'بديل الرخام والديكورات' },
    { id: 'comparisons', label: 'مقارنات وأنواع الأصباغ' },
  ];`;

blogPageContent = blogPageContent.replace(/const categories = \[\s*\{ id: 'all'[^\]]+\];/s, newCategoriesCode);
fs.writeFileSync(BLOG_PAGE_PATH, blogPageContent, 'utf8');
console.log(`Updated ${BLOG_PAGE_PATH} categories!`);

// Update sitemap.xml with the 25 new URLs
let sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
let sitemapUrls = '\n  <!-- مقالات مدونة صباغ الكويت المنشورة حديثاً (ARTICLE-06 إلى ARTICLE-30) -->\n';
for (const item of newArticles) {
  const slug = item.parsed.slug;
  if (!sitemapContent.includes(`/blog/${slug}`)) {
    sitemapUrls += `  <url>\n    <loc>https://sabbagh-kuwait.com/blog/${slug}</loc>\n    <lastmod>2026-10-23</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.88</priority>\n  </url>\n`;
  }
}

// Insert before </urlset>
sitemapContent = sitemapContent.replace('</urlset>', sitemapUrls + '</urlset>');
fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
console.log(`Updated ${SITEMAP_PATH} with 25 new URLs!`);

console.log('ALL ARTICLES SUCCESSFULLY PUBLISHED TO LIVE APP!');
