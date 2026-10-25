'use client';

import { useState } from 'react';
import { Link, useRoute } from '@/lib/nav';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  List,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BLOG_ARTICLES, getBlogArticleBySlug, type BlogArticle } from '@/data/blog-posts';
import { SeoSchema } from '@/components/seo-schema';

export default function BlogDetailPage({ slug: propSlug }: { slug?: string }) {
  const [, params] = useRoute('/blog/:slug');
  const slug = propSlug || params?.slug || 'finishing-new-villas-mutlaa-kuwait';
  const article = getBlogArticleBySlug(slug) || BLOG_ARTICLES[0];

  const [copiedLink, setCopiedLink] = useState(false);

  const relatedArticles = BLOG_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'مدونة الأصباغ والديكور', href: '/blog' },
    { label: article.title, isCurrent: true },
  ];

  const currentUrl = `https://sabbagh-kuwait.com/blog/${article.slug}`;

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.author.name,
      url: 'https://sabbagh-kuwait.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'صباغ الكويت',
      url: 'https://sabbagh-kuwait.com',
      logo: 'https://sabbagh-kuwait.com/logo.png',
    },
    mainEntityOfPage: currentUrl,
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <Layout activeNav="/blog">
      <SeoSchema schemas={articleSchema} />

      <Breadcrumbs items={breadcrumbItems} />

      {/* هيدر المقال */}
      <section
        style={{
          background: '#17483e',
          color: '#f6f1e6',
          padding: '48px 0 40px',
          borderBottom: '3px solid #e9bd77',
        }}
      >
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
          <div style={{ maxWidth: '820px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(233,189,119,0.18)',
                color: '#e9bd77',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                marginBottom: '14px',
              }}
            >
              <Sparkles size={13} />
              <span>{article.categoryLabelAr}</span>
            </span>

            <h1
              style={{
                fontSize: 'clamp(26px, 4.2vw, 38px)',
                margin: '8px 0 16px',
                fontWeight: 700,
                lineHeight: 1.35,
                letterSpacing: '-0.03em',
              }}
            >
              {article.title}
            </h1>

            <p style={{ color: '#d5e2da', fontSize: '15px', lineHeight: 1.8, margin: '0 0 22px' }}>
              {article.excerpt}
            </p>

            {/* تفاصيل الكاتب وتاريخ النشر */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                fontSize: '12px',
                color: '#cedbce',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                paddingTop: '16px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color="#e9bd77" />
                <strong style={{ color: '#fff' }}>{article.author.name}</strong> ({article.author.role})
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={14} />
                <span>{article.readTime}</span>
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} />
                <span>{article.publishedAt}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* جسم المقال والسايدبار */}
      <div
        style={{
          width: 'min(1192px, calc(100% - 48px))',
          margin: '40px auto 90px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'start',
        }}
      >
        {/* العمود الأيمن: محتوى المقال الكامل */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* فهرس المحتويات السريع (Table of Contents) */}
          <div
            style={{
              background: '#f8f4ec',
              border: '1px solid #ebdcc5',
              borderRadius: '16px',
              padding: '22px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <List size={18} color="#17483e" />
              <strong style={{ fontSize: '15px', color: '#17483e' }}>فهرس محاور المقال:</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {article.tableOfContents.map((toc, idx) => (
                <a
                  key={idx}
                  href={`#${toc.id}`}
                  style={{
                    color: '#385347',
                    fontSize: '13px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ color: '#c7664f', fontSize: '11px' }}>●</span>
                  <span>{toc.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* فقرات وأقسام المقال */}
          {article.contentSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              style={{
                background: '#fffdf9',
                border: '1px solid #e7decd',
                borderRadius: '18px',
                padding: '28px',
                boxShadow: '0 3px 14px rgba(23,72,62,0.03)',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  color: '#17483e',
                  fontWeight: 700,
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                  borderBottom: '2px solid #f2ece0',
                  paddingBottom: '10px',
                }}
              >
                {section.heading}
              </h2>

              {section.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  style={{
                    fontSize: '14.5px',
                    color: '#44554b',
                    lineHeight: 2,
                    margin: '0 0 16px',
                  }}
                >
                  {p}
                </p>
              ))}

              {/* جدول البيانات والأسعار إن وجد */}
              {section.table && (
                <div style={{ overflowX: 'auto', margin: '20px 0 24px', borderRadius: '12px', border: '1px solid #e7decd' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', background: '#fff', textAlign: 'right' }}>
                    <thead>
                      <tr style={{ background: '#17483e', color: '#f6f1e6' }}>
                        {section.table.headers.map((h, i) => (
                          <th key={i} style={{ padding: '12px 14px', borderBottom: '2px solid #e9bd77', fontWeight: 700 }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? '#faf7f0' : '#ffffff', borderBottom: '1px solid #eee5d8' }}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} style={{ padding: '11px 14px', color: '#2c3e35', lineHeight: 1.6 }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* نقاط محددة إن وجدت */}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul
                  style={{
                    paddingRight: '22px',
                    margin: '0 0 18px',
                    fontSize: '13.5px',
                    color: '#34473d',
                    lineHeight: 2,
                  }}
                >
                  {section.bulletPoints.map((bp, bpIdx) => (
                    <li key={bpIdx} style={{ marginBottom: '6px' }}>
                      {bp}
                    </li>
                  ))}
                </ul>
              )}

              {/* صندوق تمييز (Callout Box) إن وجد */}
              {section.calloutBox && (
                <div
                  style={{
                    background:
                      section.calloutBox.type === 'warning'
                        ? '#fff8f2'
                        : section.calloutBox.type === 'tip'
                        ? '#f2f8f4'
                        : '#f5f1e6',
                    border:
                      section.calloutBox.type === 'warning'
                        ? '1px solid #f3d4be'
                        : section.calloutBox.type === 'tip'
                        ? '1px solid #cce5d5'
                        : '1px solid #e5dccb',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginTop: '14px',
                  }}
                >
                  <strong
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color:
                        section.calloutBox.type === 'warning'
                          ? '#c7664f'
                          : section.calloutBox.type === 'tip'
                          ? '#2a7457'
                          : '#17483e',
                      marginBottom: '6px',
                    }}
                  >
                    {section.calloutBox.type === 'warning' ? (
                      <AlertCircle size={16} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    <span>{section.calloutBox.title}</span>
                  </strong>
                  <p style={{ margin: 0, fontSize: '13px', color: '#44554b', lineHeight: 1.8 }}>
                    {section.calloutBox.text}
                  </p>
                </div>
              )}
            </section>
          ))}

          {/* معلومات كاتب المقال */}
          <div
            style={{
              background: '#faf6ee',
              border: '1px solid #ebdcc5',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#17483e',
                color: '#e9bd77',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <div>
              <strong style={{ fontSize: '15px', color: '#17483e', display: 'block', marginBottom: '4px' }}>
                {article.author.name}
              </strong>
              <span style={{ fontSize: '12px', color: '#68776e', display: 'block' }}>
                {article.author.role} • {article.author.experience}
              </span>
            </div>
          </div>

          {/* مشاركة المقال والوسوم */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              borderTop: '1px solid #e7decd',
              paddingTop: '20px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#f2eee5',
                    color: '#44564c',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={copyShareLink}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fff',
                  border: '1px solid #dcd1c0',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#17483e',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {copiedLink ? <Check size={14} color="#25D366" /> : <Share2 size={14} />}
                <span>{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة المقال'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `مقال مفيد حول ${article.title}: ${currentUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#25D366',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={14} />
                <span>واتساب</span>
              </a>
            </div>
          </div>
        </div>

        {/* العمود الأيسر: طلب معاينة سريعة ومقالات ذات صلة */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* بطاقة اتخاذ القرار: احسب التكلفة والمعاينة */}
          <div
            style={{
              background: '#fffdf9',
              border: '2px solid #e9bd77',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 6px 20px rgba(23,72,62,0.06)',
            }}
          >
            <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              خدمة سريعة في كل مناطق الكويت
            </span>
            <h3 style={{ fontSize: '18px', color: '#17483e', margin: '0 0 10px', fontWeight: 700 }}>
              تخطط لصبغ أو تشطيب منزلك؟
            </h3>
            <p style={{ fontSize: '13px', color: '#55665d', lineHeight: 1.7, margin: '0 0 18px' }}>
              وفّر وقتك واحصل على معاينة فنية مجانية بدون التزام في قسيمتك أو شقتك مع أفضل صباغ معتمد في منطقتك.
            </p>

            <Link
              href="/request-quote"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#17483e',
                color: '#f6f1e6',
                padding: '13px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '13px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(23,72,62,0.18)',
                marginBottom: '10px',
              }}
            >
              <Calculator size={16} />
              <span>احسب تكلفة غرف بيتك فوراً</span>
            </Link>

            <Link
              href="/#directory"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#fff',
                color: '#17483e',
                border: '1px solid #dcd1c0',
                padding: '11px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              <span>تصفح دليل الصباغين</span>
            </Link>
          </div>

          {/* مقالات ذات صلة */}
          <div
            style={{
              background: '#f9f5ed',
              border: '1px solid #ebdcc5',
              borderRadius: '18px',
              padding: '22px',
            }}
          >
            <h3 style={{ fontSize: '16px', color: '#17483e', margin: '0 0 14px', fontWeight: 700 }}>
              مقالات تهمك أيضاً:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  style={{
                    background: '#fff',
                    border: '1px solid #e7decd',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <span style={{ fontSize: '10px', color: '#c7664f', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    {rel.categoryLabelAr}
                  </span>
                  <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#17483e', fontWeight: 700, lineHeight: 1.4 }}>
                    {rel.title}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#889389', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} />
                    {rel.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
