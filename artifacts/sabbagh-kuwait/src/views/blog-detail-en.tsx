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
  ChevronRight,
  List,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Tag,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BLOG_ARTICLES_EN, getBlogArticleBySlugEn, type BlogArticleEn } from '@/data/blog-posts-en';
import { SeoSchema } from '@/components/seo-schema';

export default function BlogDetailPageEn({ slug: propSlug }: { slug?: string }) {
  const [, params] = useRoute('/en/blog/:slug');
  const slug = propSlug || params?.slug || 'room-painting-cost-kuwait';
  const article = getBlogArticleBySlugEn(slug) || BLOG_ARTICLES_EN[0];

  const [copiedLink, setCopiedLink] = useState(false);

  const relatedArticles = BLOG_ARTICLES_EN.filter((a) => a.id !== article.id).slice(0, 3);

  const breadcrumbItems = [
    { label: 'Home', href: '/en/' },
    { label: 'Guides & Articles', href: '/en/blog/' },
    { label: article.title, isCurrent: true },
  ];

  const currentUrl = `https://sabbagh-kuwait.com/en/blog/${article.slug}/`;

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
      url: 'https://sabbagh-kuwait.com/en/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fani Kuwait | Kuwait Painters Platform',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sabbagh-kuwait.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <Layout lang="en">
      <SeoSchema schemas={[articleSchema]} />
      <div className="bg-[#fbf9f4] min-h-screen pb-20" dir="ltr">
        {/* Breadcrumb Navigation */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Article Header */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-bold text-[#17483e] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                {article.categoryLabelEn}
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published: {article.publishedAt}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-6 font-normal">
              {article.excerpt}
            </p>

            {/* Author Metadata Bar */}
            <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#17483e]/10 text-[#17483e] flex items-center justify-center font-bold text-sm shrink-0">
                  <User className="w-5 h-5 text-[#17483e]" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                    {article.author.name}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {article.author.role} · {article.author.experience}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body + Table of Contents Sidebar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content */}
          <main className="lg:col-span-8 space-y-8">
            {article.contentSections.map((section, sIdx) => (
              <section
                key={section.id || sIdx}
                id={section.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs scroll-mt-24"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100 leading-snug">
                  {section.heading}
                </h2>

                <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {/* Callout Box (if present) */}
                {section.calloutBox && (
                  <div
                    className={`mt-6 p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                      section.calloutBox.type === 'warning'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : section.calloutBox.type === 'tip'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-sky-50/70 border-sky-200 text-sky-900'
                    }`}
                  >
                    <div className="font-bold mb-1.5 flex items-center gap-1.5 text-stone-900">
                      {section.calloutBox.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span>{section.calloutBox.title}</span>
                    </div>
                    <p className="text-stone-700">{section.calloutBox.text}</p>
                  </div>
                )}

                {/* Table (if present) */}
                {section.table && (
                  <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 shadow-2xs">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#17483e] text-white">
                        <tr>
                          {section.table.headers.map((th, thIdx) => (
                            <th key={thIdx} className="py-3 px-3.5 font-bold whitespace-nowrap">
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 text-stone-700 bg-white">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-amber-50/30 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`py-3 px-3.5 ${
                                  cIdx === 0
                                    ? 'font-bold text-stone-900'
                                    : cIdx === 2 || cIdx === 3
                                    ? 'text-[#17483e] font-semibold'
                                    : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Bullet Points (if present) */}
                {section.bulletPoints && (
                  <ul className="mt-4 space-y-2 text-stone-700 text-sm">
                    {section.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Tags Cloud */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-3">
                Related Search Keywords:
              </span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-lg font-medium"
                  >
                    <Tag className="w-3 h-3 text-stone-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Consultation Card */}
            <div className="bg-gradient-to-br from-[#17483e] to-[#123830] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-0.5 rounded-full">
                  100% Free Inspection
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-2 mb-2">
                  Need a Customized Painting Quotation?
                </h3>
                <p className="text-emerald-100 text-xs sm:text-sm max-w-md leading-relaxed">
                  Send your room dimensions or floor plan on WhatsApp. Our English-speaking coordinator provides itemized estimates within 15 minutes.
                </p>
              </div>

              <div className="flex flex-col w-full sm:w-auto gap-2.5 shrink-0">
                <a
                  href={`https://wa.me/96590936801?text=${encodeURIComponent(
                    `Hi Fani Kuwait, I read your article "${article.title}" and would like to request an inspection and quotation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#123830] font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Inspection</span>
                </a>
                <Link
                  href="/en/request-quote/"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all border border-white/20"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Calculate Online</span>
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents & Quick Action Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Table of Contents */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs sticky top-6">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-4 pb-3 border-b border-stone-100">
                <List className="w-4 h-4 text-[#17483e]" />
                <span>Table of Contents</span>
              </div>

              <nav className="space-y-2 text-xs">
                {article.tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-stone-600 hover:text-[#17483e] hover:font-bold py-1 leading-snug transition-all border-l-2 border-transparent hover:border-[#17483e] pl-2.5"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-5 border-t border-stone-100">
                <Link
                  href="/en/request-quote/"
                  className="w-full flex items-center justify-center gap-2 bg-[#17483e] hover:bg-[#123830] text-amber-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-300" />
                  <span>Calculate Room Cost</span>
                </Link>
              </div>
            </div>

            {/* Related Articles Box */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <div className="font-bold text-stone-900 text-sm mb-4 pb-2 border-b border-stone-100">
                Related Painting Guides
              </div>

              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/en/blog/${rel.slug}/`}
                    className="block group"
                  >
                    <span className="text-[10px] font-bold text-[#17483e] uppercase tracking-wider block mb-1">
                      {rel.categoryLabelEn}
                    </span>
                    <h4 className="font-semibold text-xs text-stone-800 group-hover:text-[#17483e] leading-snug transition-colors">
                      {rel.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
