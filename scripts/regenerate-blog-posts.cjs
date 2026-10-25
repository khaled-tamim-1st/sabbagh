const fs = require('fs');
const path = require('path');
const { parseMarkdownArticle } = require('./parse-helper.cjs');

const BLOG_POSTS_PATH = path.join(__dirname, '../artifacts/sabbagh-kuwait/src/data/blog-posts.ts');
const rawCurrent = fs.readFileSync(BLOG_POSTS_PATH, 'utf8');

// Find the first 10 articles by searching for the start of ARTICLE-06
const article6Marker = '// المقال المنشور: صبغ أبواب خشب في الكويت';
let first10Part = '';
if (rawCurrent.includes(article6Marker)) {
  const idx = rawCurrent.indexOf(article6Marker);
  // back up to the comment banner
  const bannerIdx = rawCurrent.lastIndexOf('// ========================================================', idx);
  first10Part = rawCurrent.slice(0, bannerIdx).trim();
} else {
  // If not found, use everything up to `];` before helpers
  const helperIdx = rawCurrent.indexOf('export function getBlogArticleBySlug');
  const closingIdx = rawCurrent.lastIndexOf('];', helperIdx);
  first10Part = rawCurrent.slice(0, closingIdx).trim();
}

// Make sure the interface in first10Part supports all categories
first10Part = first10Part.replace(
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

// Parse ARTICLE-06 to ARTICLE-30
const newArticles = [];
for (let i = 6; i <= 30; i++) {
  const numStr = i < 10 ? '0' + i : '' + i;
  const artId = 'ARTICLE-' + numStr;
  const mdPath = path.join(__dirname, `../content-system/drafts/${artId}.md`);
  const jsonPath = path.join(__dirname, `../content-system/seo/${artId}.json`);

  if (fs.existsSync(mdPath) && fs.existsSync(jsonPath)) {
    const parsed = parseMarkdownArticle(mdPath, jsonPath, artId);
    newArticles.push({ artId, parsed });
  } else {
    console.error(`Missing files for ${artId}`);
  }
}

console.log(`Parsed ${newArticles.length} articles (ARTICLE-06 to ARTICLE-30).`);

// Build string for new articles
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
  newArticlesCode += `    category: ${JSON.stringify(a.category)},\n`;
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

// Assemble full file
const helperFunctions = `\n];

/**
 * الحصول على مقال بواسطة الـ slug
 */
export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug || a.id === slug);
}

/**
 * تصفية المقالات حسب الفئة
 */
export function getBlogArticlesByCategory(category: string): BlogArticle[] {
  if (!category || category === 'all' || category === 'الكل') {
    return BLOG_ARTICLES;
  }
  return BLOG_ARTICLES.filter((a) => a.category === category);
}
`;

const finalFileContent = first10Part + newArticlesCode + helperFunctions;

fs.writeFileSync(BLOG_POSTS_PATH, finalFileContent, 'utf8');
console.log('Generated clean blog-posts.ts with all 35 articles!');
