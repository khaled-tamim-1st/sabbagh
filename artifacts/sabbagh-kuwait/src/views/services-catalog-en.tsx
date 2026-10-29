'use client';

import React, { useState } from 'react';
import {
  Paintbrush,
  Sparkles,
  Layers,
  Clock,
  HelpCircle,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { KUWAIT_SERVICES_DATA_EN, type KuwaitServiceEn } from '@/data/services-data-en';
import { Link } from '@/lib/nav';

export function ServicesCatalogEn() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services (12)' },
    { id: 'interior', label: 'Interior Wall Painting' },
    { id: 'exterior', label: 'Exterior Facade & Sigma' },
    { id: 'decorative', label: 'Italian Stucco & Microcement' },
    { id: 'cladding', label: 'PVC Marble & Wood Cladding' },
    { id: 'wallpaper', label: 'Wallpaper Installation' },
    { id: 'flooring', label: 'Epoxy Flooring' },
    { id: 'woodwork', label: 'Doors & Wood Spray' },
    { id: 'repair', label: 'Wall Moisture Repair' },
    { id: 'insulation', label: 'Roof Insulation' },
  ];

  const filteredServices =
    selectedCategory === 'all'
      ? KUWAIT_SERVICES_DATA_EN
      : KUWAIT_SERVICES_DATA_EN.filter((s) => s.category === selectedCategory);

  return (
    <Layout activeNav="/en/services" lang="en">
      {/* Breadcrumbs */}
      <nav className="bg-stone-100 py-3 px-4 sm:px-6 border-b border-stone-200 text-xs text-stone-600">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link href="/en/" className="hover:text-[#17483e] hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="font-bold text-stone-900">Painting & Decorating Services</span>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-b from-[#123830] to-[#17483e] text-white py-14 px-4 sm:px-6 border-b-4 border-amber-400">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/15">
            Full Service Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-3 mb-4">
            Kuwait Painting & Decorating Services
          </h1>
          <p className="text-emerald-100 text-base max-w-2xl leading-relaxed">
            Explore complete interior, exterior, and specialty decorating services across Kuwait. 
            Official prices in KWD, genuine Jotun & Caparol paints, and certified technicians.
          </p>
        </div>
      </section>

      {/* Category Filter Pills */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#17483e] text-amber-200 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-[#17483e] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                  {service.categoryLabelEn}
                </span>

                <h2 className="text-lg font-bold text-stone-900 mt-3 mb-2 leading-tight">
                  {service.title}
                </h2>

                <p className="text-stone-600 text-xs leading-relaxed line-clamp-3 mb-4">
                  {service.description}
                </p>

                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 mb-4">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wide block">
                    Estimated Price in KWD:
                  </span>
                  <div className="text-lg font-extrabold text-[#17483e] mt-0.5">
                    {service.price.fromKWD} - {service.price.toKWD} KWD{' '}
                    <span className="text-xs font-normal text-stone-500">/{service.price.unit}</span>
                  </div>
                </div>

                <div className="text-xs text-stone-500 flex items-center gap-2 mb-4">
                  <Clock size={14} className="text-stone-400" />
                  <span>Execution: {service.executionTime}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href={`/en/services/${service.slug}/`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17483e] hover:underline"
                >
                  <span>Full Details & Specs</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/en/request-quote/"
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Get Quote
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ServicesCatalogEn;
