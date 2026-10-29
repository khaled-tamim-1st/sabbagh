'use client';

import React, { useState } from 'react';
import {
  Paintbrush,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  Calculator,
  ChevronDown,
  Sparkles,
  HelpCircle,
  ArrowRight,
  BadgeCheck,
  Building,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import {
  KUWAIT_SERVICES_DATA_EN,
  getServiceBySlugEn,
  type KuwaitServiceEn,
} from '@/data/services-data-en';
import { catalogStore } from '@/lib/catalog-store';
import {
  SeoSchema,
  generateServiceSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
} from '@/components/seo-schema';
import { Link } from '@/lib/nav';
import { PainterAvatar } from '@/components/painter-avatar';

export function ServiceDetailEnPage({ slug }: { slug: string }) {
  const service = getServiceBySlugEn(slug) || KUWAIT_SERVICES_DATA_EN[0];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Relevant approved painters
  const specializedPainters = catalogStore.getApprovedPainters().slice(0, 3);

  const relatedServices = KUWAIT_SERVICES_DATA_EN.filter(
    (s) => s.id !== service.id
  ).slice(0, 3);

  const canonicalUrl = `https://sabbagh-kuwait.com/en/services/${service.slug}/`;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://sabbagh-kuwait.com/en/' },
    { name: 'Services', url: 'https://sabbagh-kuwait.com/en/services/' },
    { name: service.shortName, url: canonicalUrl },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema({ items: breadcrumbItems });
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.description,
    category: service.categoryLabelEn,
    price: service.price.averageKWD,
    priceUnit: service.price.unit,
    url: canonicalUrl,
  });
  const faqSchema =
    service.faqs.length > 0
      ? generateFaqSchema({
          items: service.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          })),
        })
      : null;

  const waLeadMessage = encodeURIComponent(
    `Hello, I need a quotation for ${service.title} in Kuwait. Please advise on prices and free inspection availability.`
  );

  return (
    <Layout activeNav="/en/services" lang="en">
      <SeoSchema schemas={[breadcrumbSchema, serviceSchema, faqSchema]} />

      {/* Breadcrumbs */}
      <nav className="bg-stone-100 py-3 px-4 sm:px-6 border-b border-stone-200 text-xs text-stone-600">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link href="/en/" className="hover:text-[#17483e] hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/en/services/" className="hover:text-[#17483e] hover:underline">
            Services
          </Link>
          <span>/</span>
          <span className="font-bold text-stone-900">{service.shortName}</span>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#123830] to-[#17483e] text-white py-14 px-4 sm:px-6 border-b-4 border-amber-400">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-400/30">
              <Sparkles size={14} />
              <span>{service.categoryLabelEn}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              {service.title}
            </h1>

            <p className="text-emerald-100 text-base sm:text-lg mb-6 leading-relaxed">
              {service.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/96590936801?text=${waLeadMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#123830] font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md"
              >
                <MessageCircle size={18} />
                <span>WhatsApp Quote (English)</span>
              </a>

              <Link
                href="/en/request-quote/"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm border border-white/20 backdrop-blur-xs transition-all"
              >
                <Calculator size={18} />
                <span>Calculate Cost in KWD</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: In-depth Service Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* BLUF Direct Answer Box */}
          <section className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-[#17483e] font-bold text-sm mb-2">
              <ShieldCheck size={18} className="text-amber-600" />
              <span>Quick Service & Pricing Summary (Kuwait Market)</span>
            </div>
            <p className="text-stone-800 text-sm leading-relaxed mb-4">
              {service.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-amber-200/60 text-xs">
              <div>
                <span className="text-stone-500 block">Starting Price:</span>
                <strong className="text-sm font-extrabold text-[#17483e]">
                  {service.price.fromKWD} - {service.price.toKWD} KWD
                </strong>
                <span className="text-stone-500 block text-[11px]">{service.price.unit}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Turnaround:</span>
                <strong className="text-sm font-bold text-stone-900">{service.executionTime}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">Inspection:</span>
                <strong className="text-sm font-bold text-emerald-700">100% Free On-site</strong>
              </div>
            </div>
          </section>

          {/* Local Kuwait Relevance: Climate, Humidity & Dust */}
          <section className="bg-white rounded-2xl p-6 border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Building size={20} className="text-[#17483e]" />
              Why This Service is Essential for Kuwait Homes
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              {service.whyInKuwait}
            </p>
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 flex items-center gap-3 text-xs text-stone-700">
              <strong className="text-[#17483e] shrink-0 font-bold">Approved Paint Brands:</strong>
              <span>{service.popularBrands.join(' • ')}</span>
            </div>
          </section>

          {/* Features Checklist */}
          <section className="bg-white rounded-2xl p-6 border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-4">
              What Is Included in Our Service
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-stone-700">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Professional Step-by-Step Workflow */}
          <section className="bg-white rounded-2xl p-6 border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-5">
              Professional Execution Steps
            </h2>
            <div className="space-y-4">
              {service.executionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-[#17483e] text-amber-200 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-stone-700 pt-0.5 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Expert Field Advice */}
          {service.expertAdvice && service.expertAdvice.length > 0 && (
            <section className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200">
              <h2 className="text-xl font-bold text-emerald-950 mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-emerald-700" />
                Kuwait Expert Painter Tips
              </h2>
              <ul className="space-y-2 text-sm text-emerald-900">
                {service.expertAdvice.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Service FAQ Accordion */}
          {service.faqs && service.faqs.length > 0 && (
            <section className="bg-white rounded-2xl p-6 border border-stone-200">
              <h2 className="text-xl font-bold text-stone-900 mb-5 flex items-center gap-2">
                <HelpCircle size={20} className="text-[#17483e]" />
                Frequently Asked Questions About {service.shortName}
              </h2>
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-stone-200 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full flex justify-between items-center p-4 text-left font-bold text-stone-900 text-sm hover:bg-stone-50"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openFaqIndex === idx ? 'rotate-180 text-[#17483e]' : 'text-stone-400'
                        }`}
                      />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50/40 border-t border-stone-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Sticky Contact & Booking Sidebar */}
        <div className="space-y-6">
          {/* Price & Booking Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#17483e]/20 shadow-sm sticky top-6">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Pricing Overview
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#17483e] mt-1 mb-2">
              {service.price.fromKWD} - {service.price.toKWD} KWD
            </div>
            <p className="text-xs text-stone-500 mb-6">{service.price.notesEn}</p>

            <a
              href={`https://wa.me/96590936801?text=${waLeadMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all mb-3"
            >
              <MessageCircle size={18} />
              <span>Book Free On-Site Inspection</span>
            </a>

            <a
              href="tel:96590936801"
              className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 px-4 rounded-xl text-sm transition-all mb-6"
            >
              <Phone size={16} />
              <span>Direct Call: +965 90936801</span>
            </a>

            <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                <span>Zero call-out fees for quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                <span>English-speaking supervisor</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                <span>Written guarantee against peeling</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                <span>Floor & furniture masking included</span>
              </div>
            </div>
          </div>

          {/* Top Verified Painters for this Service */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-sm mb-4 flex items-center gap-1.5">
              <BadgeCheck size={16} className="text-emerald-600" />
              <span>Available Painters for This Service</span>
            </h3>
            <div className="space-y-3">
              {specializedPainters.map((painter) => (
                <div
                  key={painter.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100"
                >
                  <div className="flex items-center gap-2.5">
                    <PainterAvatar painter={painter} />
                    <div>
                      <div className="font-bold text-xs text-stone-900">{painter.name}</div>
                      <div className="text-[11px] text-stone-500">{painter.region}</div>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${(painter.whatsapp || '96590936801').replace(/[^0-9]/g, '')}?text=${waLeadMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                    aria-label={`WhatsApp ${painter.name}`}
                  >
                    <MessageCircle size={15} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Related Services Links */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-sm mb-3">
              Other Painting Services
            </h3>
            <div className="space-y-2">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/en/services/${rel.slug}/`}
                  className="flex items-center justify-between text-xs text-stone-700 hover:text-[#17483e] font-medium py-1.5 border-b border-stone-100 last:border-0"
                >
                  <span>{rel.title}</span>
                  <ArrowRight size={13} className="text-stone-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ServiceDetailEnPage;
