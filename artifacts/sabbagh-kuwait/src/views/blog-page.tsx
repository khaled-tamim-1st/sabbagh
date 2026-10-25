'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/lib/nav';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Search,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Tag,
  Eye,
  CheckCircle2,
  Calculator,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BLOG_ARTICLES, type BlogArticle } from '@/data/blog-posts';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = [
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
  ];

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.category === selectedCategory;
      const cleanQ = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !cleanQ ||
        article.title.toLowerCase().includes(cleanQ) ||
        article.excerpt.toLowerCase().includes(cleanQ) ||
        article.tags.some((t) => t.toLowerCase().includes(cleanQ));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticle = BLOG_ARTICLES[0];
  const listArticles = filteredArticles.filter((a) =>
    selectedCategory === 'all' && !searchQuery.trim() ? a.id !== featuredArticle.id : true
  );

  return (
    <Layout activeNav="/blog">
      <Breadcrumbs
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'مدونة الأصباغ والديكور', isCurrent: true },
        ]}
      />

      {/* الهيدر الرئيسي للمدونة */}
      <section
        style={{
          background: '#17483e',
          color: '#f6f1e6',
          padding: '52px 0 46px',
          borderBottom: '3px solid #e9bd77',
        }}
      >
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
          <div style={{ maxWidth: '780px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(233,189,119,0.18)',
                color: '#e9bd77',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '14px',
              }}
            >
              <BookOpen size={14} />
              <span>مدونة صباغ الكويت • دليل ومعرفة هندسية</span>
            </span>

            <h1
              style={{
                fontSize: 'clamp(28px, 4.5vw, 42px)',
                margin: '8px 0 14px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              مقالات وأدلة تشطيب الأصباغ في الكويت
            </h1>

            <p style={{ color: '#d5e2da', fontSize: '15px', lineHeight: 1.9, margin: '0 0 24px' }}>
              دليلك الموثوق لتشطيب القسائم السكنية والفلل، مقارنات فنية بين ماركات الدهانات المعتمدة في الشويخ، حلول الرطوبة والنش الساحلي، وأحدث صيحات الديكور بالدينار الكويتي.
            </p>

            {/* شريط البحث في المقالات */}
            <div
              style={{
                position: 'relative',
                maxWidth: '460px',
              }}
            >
              <Search
                size={18}
                color="#647368"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن: المطلاع، جوتن، علاج النش، بديل الرخام..."
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #d4c8b6',
                  background: '#fffdfa',
                  color: '#17483e',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* المحتوى وقائمة المقالات */}
      <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: '40px auto 90px' }}>
        {/* فلاتر التصنيفات */}
        <div className="filters" style={{ marginBottom: '32px' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip${selectedCategory === cat.id ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* المقال المميز (Featured Article) في البداية عند عرض الكل */}
        {selectedCategory === 'all' && !searchQuery.trim() && (
          <article
            style={{
              background: '#fffdf9',
              border: '2px solid #e9bd77',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '36px',
              boxShadow: '0 6px 24px rgba(23,72,62,0.06)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span
                  style={{
                    background: '#17483e',
                    color: '#f6f1e6',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  مقال مميز
                </span>
                <span style={{ fontSize: '12px', color: '#889389' }}>
                  {featuredArticle.categoryLabelAr}
                </span>
              </div>

              <h2 style={{ fontSize: '24px', color: '#17483e', margin: '0 0 12px', fontWeight: 700, lineHeight: 1.4 }}>
                <Link
                  href={`/blog/${featuredArticle.slug}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {featuredArticle.title}
                </Link>
              </h2>

              <p style={{ fontSize: '14px', color: '#55655c', lineHeight: 1.9, margin: '0 0 20px' }}>
                {featuredArticle.excerpt}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#77847c', marginBottom: '20px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#c7664f" />
                  <strong>{featuredArticle.author.name}</strong>
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} />
                  {featuredArticle.readTime}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} />
                  {featuredArticle.publishedAt}
                </span>
              </div>

              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="contact-button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  padding: '12px 22px',
                  borderRadius: '10px',
                  fontSize: '13px',
                }}
              >
                <span>اقرأ الدليل كاملاً</span>
                <ChevronLeft size={16} />
              </Link>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #17483e 0%, #2a6a5d 100%)',
                borderRadius: '16px',
                padding: '30px',
                color: '#f6f1e6',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
              }}
            >
              <div>
                <span style={{ color: '#e9bd77', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  أبرز محاور المقال:
                </span>
                <ul style={{ paddingRight: '18px', margin: 0, fontSize: '13px', lineHeight: 2, color: '#e2ede7' }}>
                  {featuredArticle.tableOfContents.map((toc) => (
                    <li key={toc.id}>{toc.title}</li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: '16px', fontSize: '11px', color: '#c3d5cb' }}>
                إعداد: {featuredArticle.author.name} • {featuredArticle.author.role}
              </div>
            </div>
          </article>
        )}

        {/* شبكة المقالات */}
        {listArticles.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {listArticles.map((article) => (
              <article
                key={article.id}
                style={{
                  background: '#fffdf9',
                  border: '1px solid #e7decd',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 3px 14px rgba(23,72,62,0.03)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        background: '#f4efe4',
                        color: '#17483e',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {article.categoryLabelAr}
                    </span>
                    <span style={{ fontSize: '11px', color: '#889389', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      color: '#17483e',
                      margin: '0 0 10px',
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    <Link
                      href={`/blog/${article.slug}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p
                    style={{
                      fontSize: '13px',
                      color: '#55655c',
                      lineHeight: 1.8,
                      margin: '0 0 16px',
                    }}
                  >
                    {article.excerpt}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '11px',
                          color: '#77847c',
                          background: '#faf6ee',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #eee5d5',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid #f0e9dc',
                    paddingTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#889389' }}>
                    إعداد: {article.author.name}
                  </span>

                  <Link
                    href={`/blog/${article.slug}`}
                    style={{
                      color: '#c7664f',
                      fontWeight: 700,
                      fontSize: '12px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>قراءة المقال</span>
                    <ChevronLeft size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#fffdf9',
              borderRadius: '16px',
              border: '1px solid #e7decd',
            }}
          >
            <BookOpen size={36} color="#889389" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', color: '#17483e', margin: '0 0 8px' }}>
              لا توجد مقالات مطابقة لبحثك
            </h3>
            <p style={{ fontSize: '13px', color: '#77857c', margin: '0 0 16px' }}>
              جرّب تغيير كلمة البحث أو تصفح كافة التصنيفات.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="detail-button"
            >
              عرض كافة المقالات
            </button>
          </div>
        )}

        {/* بانر سفلي لطلب عرض سعر */}
        <section
          style={{
            marginTop: '60px',
            background: 'linear-gradient(135deg, #17483e 0%, #0d2f28 100%)',
            borderRadius: '20px',
            padding: '36px 32px',
            color: '#f6f1e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <span style={{ color: '#e9bd77', fontSize: '12px', fontWeight: 700 }}>
              جاهز لبدء تشطيب أو تجديد بيتك؟
            </span>
            <h3 style={{ fontSize: '22px', margin: '6px 0 8px', fontWeight: 700 }}>
              احصل على معاينة فنية مجانية وحساب تكلفة فوري
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#d0dfd6', maxWidth: '560px' }}>
              تواصل مع نخبة من معلمي الصباغة والديكور المعتمدين في منطقتك، مع ضمان رسمي للمواد الأصلية ومصنعية اليد.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/request-quote"
              className="contact-button"
              style={{
                background: '#e9bd77',
                color: '#17483e',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '12px 22px',
                borderRadius: '10px',
                fontSize: '13px',
              }}
            >
              <Calculator size={15} style={{ display: 'inline', marginLeft: '6px' }} />
              <span>احسب التكلفة الآن</span>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
