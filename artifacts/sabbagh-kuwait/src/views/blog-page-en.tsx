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
  ChevronRight,
  Tag,
  Eye,
  CheckCircle2,
  Calculator,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BLOG_ARTICLES_EN, type BlogArticleEn } from '@/data/blog-posts-en';

export default function BlogPageEn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'pricing-costs', label: 'Costs & Pricing Guide' },
    { id: 'exterior-facades', label: 'Exterior & Facades' },
    { id: 'humidity-repair', label: 'Moisture & Wall Repair' },
    { id: 'cladding-decor', label: 'Wall Cladding & TV Decor' },
    { id: 'qasima-finishing', label: 'New Villa Finishing' },
    { id: 'comparisons', label: 'Brand Comparisons' },
    { id: 'color-trends', label: 'Color Trends 2026' },
  ];

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES_EN.filter((article) => {
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

  const featuredArticle = BLOG_ARTICLES_EN[0];
  const listArticles = filteredArticles.filter((a) =>
    selectedCategory === 'all' && !searchQuery.trim() ? a.id !== featuredArticle.id : true
  );

  return (
    <Layout lang="en">
      <div className="bg-[#fbf9f4] min-h-screen pb-20" dir="ltr">
        {/* Breadcrumb Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/en/' },
              { label: 'Painting & Decor Guides', isCurrent: true },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#123830] to-[#17483e] text-white py-14 sm:py-20 px-4 sm:px-6 mt-4">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-200 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Kuwait Painting Knowledge Hub & Price Benchmarks</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Kuwait Painting, Decor &amp; Facade Guides
            </h1>

            <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              Field-tested advice, official 2026 pricing benchmarks in Kuwaiti Dinar (KWD), Jotun and Caparol material specifications, and expert tips for landlords, expats, and villa owners.
            </p>

            {/* Instant Quote Callout */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/en/request-quote/"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#123830] px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>Instant Painting Cost Calculator</span>
              </Link>
              <Link
                href="/en/services-guide/"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-semibold text-sm backdrop-blur-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>2026 Material Price Guide</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Search & Categories Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by topic, Jotun paint, Sigma, moisture repair..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#17483e] bg-stone-50/50"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === 'c.id' || selectedCategory === c.id
                      ? 'bg-[#17483e] text-amber-200 shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Article Hero (When no search query is active) */}
        {!searchQuery.trim() && selectedCategory === 'all' && featuredArticle && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
            <div className="bg-gradient-to-br from-[#17483e] to-[#0f2e27] rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden flex flex-col lg:flex-row gap-8 items-center justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Guide 2026</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-snug">
                  <Link
                    href={`/en/blog/${featuredArticle.slug}/`}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {featuredArticle.title}
                  </Link>
                </h2>
                <p className="text-emerald-100 text-sm leading-relaxed mb-6 line-clamp-3">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200 mb-6">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-300" />
                    <span>{featuredArticle.author.name}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>{featuredArticle.readTime}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>{featuredArticle.publishedAt}</span>
                  </span>
                </div>
                <Link
                  href={`/en/blog/${featuredArticle.slug}/`}
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#123830] font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
                >
                  <span>Read Full Price Breakdown</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="w-full lg:w-72 bg-white/10 rounded-2xl p-5 border border-white/15 backdrop-blur-sm text-xs space-y-3">
                <span className="text-amber-300 font-bold block uppercase tracking-wider text-[11px]">
                  Inside This Guide:
                </span>
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Labor vs all-inclusive KWD rates</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Jotun Fenomastic authentic drum prices</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>3-Bedroom apartment move-out cost</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Traps of commercial watered-down paints</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Published Guides &amp; Insights ({filteredArticles.length})
            </h2>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">No matching guides found</h3>
              <p className="text-stone-500 text-xs mt-1">Try searching for keywords like "Jotun", "Cost", "Sigma", or "Moisture".</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-4 text-xs font-bold text-[#17483e] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-[#17483e] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-[#17483e] bg-emerald-50 px-2.5 py-1 rounded-md">
                        {article.categoryLabelEn}
                      </span>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-base leading-snug mb-2 hover:text-[#17483e] transition-colors">
                      <Link href={`/en/blog/${article.slug}/`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-stone-600 text-xs leading-relaxed line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-stone-400" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="text-[11px] text-stone-500">
                      <span>{article.publishedAt}</span>
                    </div>
                    <Link
                      href={`/en/blog/${article.slug}/`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#17483e] hover:underline"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
