const fs = require('fs');
const path = require('path');

const CATEGORY_MAP = {
  'ARTICLE-06': { category: 'doors-woodwork', categoryLabelAr: 'الأبواب والمظلات والحديد' },
  'ARTICLE-07': { category: 'humidity-repair', categoryLabelAr: 'علاج الرطوبة والخرير' },
  'ARTICLE-08': { category: 'exterior-facades', categoryLabelAr: 'الواجهات والسيجما الخارجية' },
  'ARTICLE-09': { category: 'humidity-repair', categoryLabelAr: 'علاج الرطوبة والخرير' },
  'ARTICLE-10': { category: 'exterior-facades', categoryLabelAr: 'الواجهات والسيجما الخارجية' },
  'ARTICLE-11': { category: 'humidity-repair', categoryLabelAr: 'علاج الرطوبة والخرير' },
  'ARTICLE-12': { category: 'interior-decor', categoryLabelAr: 'الأصباغ والديكورات الداخلية' },
  'ARTICLE-13': { category: 'comparisons', categoryLabelAr: 'مقارنات وأنواع الأصباغ' },
  'ARTICLE-14': { category: 'color-trends', categoryLabelAr: 'كتالوجات وتنسيق الألوان' },
  'ARTICLE-15': { category: 'cladding-decor', categoryLabelAr: 'بديل الرخام والديكورات' },
  'ARTICLE-16': { category: 'cladding-decor', categoryLabelAr: 'بديل الرخام والديكورات' },
  'ARTICLE-17': { category: 'comparisons', categoryLabelAr: 'مقارنات وأنواع الأصباغ' },
  'ARTICLE-18': { category: 'interior-decor', categoryLabelAr: 'الأصباغ والديكورات الداخلية' },
  'ARTICLE-19': { category: 'qasima-finishing', categoryLabelAr: 'تشطيب قسائم جديدة' },
  'ARTICLE-20': { category: 'comparisons', categoryLabelAr: 'مقارنات وأنواع الأصباغ' },
  'ARTICLE-21': { category: 'qasima-finishing', categoryLabelAr: 'تشطيب قسائم جديدة' },
  'ARTICLE-22': { category: 'exterior-facades', categoryLabelAr: 'الواجهات والسيجما الخارجية' },
  'ARTICLE-23': { category: 'humidity-repair', categoryLabelAr: 'علاج الرطوبة والخرير' },
  'ARTICLE-24': { category: 'doors-woodwork', categoryLabelAr: 'الأبواب والمظلات والحديد' },
  'ARTICLE-25': { category: 'contractor-guide', categoryLabelAr: 'اختيار الصباغ والفحص' },
  'ARTICLE-26': { category: 'contractor-guide', categoryLabelAr: 'اختيار الصباغ والفحص' },
  'ARTICLE-27': { category: 'contractor-guide', categoryLabelAr: 'اختيار الصباغ والفحص' },
  'ARTICLE-28': { category: 'pricing-costs', categoryLabelAr: 'الأسعار وتكلفة الصبغ' },
  'ARTICLE-29': { category: 'exterior-facades', categoryLabelAr: 'الواجهات والسيجما الخارجية' },
  'ARTICLE-30': { category: 'color-trends', categoryLabelAr: 'كتالوجات وتنسيق الألوان' },
};

function parseMarkdownArticle(mdPath, jsonPath, articleId) {
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const seoData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const catInfo = CATEGORY_MAP[articleId] || { category: 'pricing-costs', categoryLabelAr: 'الأسعار وتكلفة الصبغ' };

  const lines = mdContent.split(/\r?\n/);
  let title = seoData.title || seoData.seo_title || seoData.h1 || '';
  if (!title) {
    const h1Match = lines.find(l => l.startsWith('# '));
    if (h1Match) title = h1Match.replace(/^#\s+/, '').trim();
  }

  const excerpt = seoData.metaDescription || seoData.meta_description || '';

  const primary = seoData.primaryKeyword || seoData.primary_keyword || '';
  const secondaries = seoData.secondaryKeywords || seoData.secondary_keywords || [];
  let rawTags = [primary, ...(Array.isArray(secondaries) ? secondaries : [])];
  let tags = rawTags.filter(t => typeof t === 'string' && t.trim().length > 0);
  if (tags.length === 0) {
    tags = [title.split(':')[0] || 'صباغ الكويت'];
  }

  const sections = [];
  let currentSec = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      if (currentSec) sections.push(currentSec);
      const heading = line.replace(/^##\s+/, '').trim();
      const id = 'sec-' + (sections.length + 1);
      currentSec = {
        id,
        heading,
        paragraphs: [],
        bulletPoints: [],
        table: null,
        calloutBox: null
      };
    } else if (currentSec) {
      if (line.startsWith('>')) {
        let calloutText = line.replace(/^>\s*/, '').trim();
        let j = i + 1;
        while (j < lines.length && lines[j].startsWith('>')) {
          calloutText += ' ' + lines[j].replace(/^>\s*/, '').trim();
          j++;
        }
        i = j - 1;
        currentSec.calloutBox = {
          title: 'تنبيه فني وتوصية هندسية:',
          text: calloutText.replace(/\*\*/g, '').trim(),
          type: 'info'
        };
      } else if (line.trim().startsWith('|') && line.includes('|')) {
        const tableLines = [line];
        let j = i + 1;
        while (j < lines.length && lines[j].trim().startsWith('|')) {
          tableLines.push(lines[j]);
          j++;
        }
        i = j - 1;
        if (tableLines.length >= 3) {
          const parseRow = (r) => r.split('|').map(c => c.trim().replace(/\*\*/g, '')).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
          const headers = parseRow(tableLines[0]);
          const rows = [];
          for (let k = 2; k < tableLines.length; k++) {
            const rowData = parseRow(tableLines[k]);
            if (rowData.length > 0) rows.push(rowData);
          }
          if (headers.length > 0 && rows.length > 0) {
            currentSec.table = { headers, rows };
          }
        }
      } else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const bp = line.trim().replace(/^[\*\-]\s+/, '').replace(/\*\*/g, '').trim();
        if (bp) currentSec.bulletPoints.push(bp);
      } else if (
        line.trim().length > 0 &&
        !line.startsWith('#') &&
        !line.startsWith('---') &&
        !line.startsWith('```') &&
        !line.startsWith('**إعداد:') &&
        !line.startsWith('**تاريخ') &&
        !line.startsWith('**التصنيف:') &&
        !line.startsWith('**الكلمة')
      ) {
        currentSec.paragraphs.push(line.trim());
      }
    }
  }
  if (currentSec) sections.push(currentSec);

  // Clean empty fields
  sections.forEach(s => {
    if (!s.bulletPoints || s.bulletPoints.length === 0) delete s.bulletPoints;
    if (!s.table) delete s.table;
    if (!s.calloutBox) delete s.calloutBox;
  });

  const views = Math.floor(Math.random() * 1800) + 2400;

  let authorName = 'فريق التدقيق الهندسي | صباغ الكويت';
  if (seoData.author && typeof seoData.author === 'object' && seoData.author.name) {
    authorName = seoData.author.name;
  }

  return {
    id: seoData.slug,
    slug: seoData.slug,
    title,
    excerpt,
    category: catInfo.category,
    categoryLabelAr: catInfo.categoryLabelAr,
    author: {
      name: authorName,
      role: 'قسم الاستشارات والرقابة الفنية | صباغ الكويت',
      experience: 'رصد دوري وميداني لمعايير التشطيب والدهانات في الكويت'
    },
    publishedAt: seoData.publishedDate || seoData.published_date || '2026-10-23',
    readTime: '9 دقائق قراءة',
    viewsCount: views,
    tags,
    tableOfContents: sections.map(s => ({ id: s.id, title: s.heading })),
    contentSections: sections
  };
}

module.exports = { parseMarkdownArticle, CATEGORY_MAP };
