'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  Clock3,
  Search,
  Building2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BadgeCheck,
  Check,
  Calculator,
  Compass,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { PainterAvatar } from '@/components/painter-avatar';
import {
  KUWAIT_GOVERNORATES,
  getGovernorateById,
  type Governorate,
} from '@/data/kuwait-areas';
import { catalogStore } from '@/lib/catalog-store';
import { Link } from '@/lib/nav';

export function AreaPageEn({ govId }: { govId?: string }) {
  const [selectedGovId, setSelectedGovId] = useState<string>(govId || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentGov = govId ? getGovernorateById(govId) : null;

  // Filter painters by governorate
  const filteredPainters = useMemo(() => {
    let list = catalogStore.getApprovedPainters();

    if (currentGov) {
      list = list.filter(
        (p) =>
          p.governorates?.includes(currentGov.nameAr) ||
          p.primaryGovernorates?.includes(currentGov.nameAr) ||
          p.region?.includes(currentGov.nameAr) ||
          p.region?.toLowerCase().includes(currentGov.id.toLowerCase())
      );
    } else if (selectedGovId !== 'all') {
      const g = getGovernorateById(selectedGovId);
      if (g) {
        list = list.filter(
          (p) =>
            p.governorates?.includes(g.nameAr) ||
            p.primaryGovernorates?.includes(g.nameAr) ||
            p.region?.includes(g.nameAr) ||
            p.region?.toLowerCase().includes(g.id.toLowerCase())
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [currentGov, selectedGovId, searchQuery]);

  return (
    <Layout activeNav="/en/areas" lang="en">
      {/* Breadcrumbs */}
      <nav className="bg-stone-100 py-3 px-4 sm:px-6 border-b border-stone-200 text-xs text-stone-600">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link href="/en/" className="hover:text-[#17483e] hover:underline">
            Home
          </Link>
          <span>/</span>
          {currentGov ? (
            <>
              <Link href="/en/areas/" className="hover:text-[#17483e] hover:underline">
                Kuwait Areas
              </Link>
              <span>/</span>
              <span className="font-bold text-stone-900">{currentGov.nameEn}</span>
            </>
          ) : (
            <span className="font-bold text-stone-900">Kuwait Areas & Governorates</span>
          )}
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-b from-[#123830] to-[#17483e] text-white py-14 px-4 sm:px-6 border-b-4 border-amber-400">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/15">
            Geographic Coverage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-3 mb-4">
            {currentGov
              ? `Certified Painters in ${currentGov.nameEn}`
              : 'Painters Across All Kuwait Governorates'}
          </h1>
          <p className="text-emerald-100 text-base max-w-2xl leading-relaxed">
            {currentGov
              ? `Connect with vetted house and flat painters serving all ${currentGov.areasCount} districts in ${currentGov.nameEn}. Free on-site inspection, authentic Jotun paints, and English-speaking coordination.`
              : 'Browse certified painting and decorating technicians covering all 6 Kuwait governorates, new urban cities (Al Mutlaa, Sabah Al Ahmad), and chalet coastlines.'}
          </p>
        </div>
      </section>

      {/* Governorates Navigation Tabs */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          <Link
            href="/en/areas/"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              !currentGov
                ? 'bg-[#17483e] text-amber-200 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Governorates
          </Link>
          {KUWAIT_GOVERNORATES.map((g) => (
            <Link
              key={g.id}
              href={`/en/areas/${g.id}/`}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                currentGov?.id === g.id
                  ? 'bg-[#17483e] text-amber-200 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {g.nameEn}
            </Link>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        {/* If viewing a specific governorate, show its districts */}
        {currentGov && (
          <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200/80 mb-10">
            <h2 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Compass size={18} className="text-[#17483e]" />
              <span>Districts Served in {currentGov.nameEn} ({currentGov.areas.length} Areas)</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {currentGov.areas.map((area) => (
                <span
                  key={area.id}
                  className="bg-white border border-amber-200/80 text-stone-800 text-xs px-3 py-1.5 rounded-lg font-medium shadow-2xs"
                >
                  {area.nameEn}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              {currentGov ? `Painters Available in ${currentGov.nameEn}` : 'Available Verified Painters'} ({filteredPainters.length})
            </h2>
            <p className="text-stone-500 text-xs mt-1">
              Direct connection with certified workshops and independent painters.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search painter name or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#17483e]"
            />
          </div>
        </div>

        {/* Painters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredPainters.map((painter) => {
            const waMessage = encodeURIComponent(
              `Hello ${painter.name}, I found you on Fani Kuwait. I need a painting service quotation in ${currentGov ? currentGov.nameEn : 'Kuwait'}.`
            );

            return (
              <article
                key={painter.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <PainterAvatar painter={painter} />
                      <div>
                        <h3 className="font-bold text-stone-900 text-base leading-tight">
                          {painter.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold mt-0.5">
                          <BadgeCheck size={14} />
                          <span>Verified & Inspected</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star size={13} fill="currentColor" />
                      <span>{painter.rating}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      <span>{painter.region}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={13} />
                      <span>{painter.years} yrs exp</span>
                    </span>
                  </div>

                  <p className="text-stone-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {painter.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {painter.services?.slice(0, 3).map((srv, idx) => (
                      <span
                        key={idx}
                        className="bg-stone-100 text-stone-700 text-[11px] px-2 py-0.5 rounded-md font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
                  <a
                    href={`https://wa.me/${(painter.whatsapp || painter.phone || '96590936801').replace(/[^0-9]/g, '')}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${(painter.phone || '96590936801').replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Phone size={14} />
                    <span>Call</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Governorates Directory Grid (when on main areas page) */}
        {!currentGov && (
          <section className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
            <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">
              Explore Painting Services by Governorate
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {KUWAIT_GOVERNORATES.map((g) => (
                <div key={g.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-stone-900 text-base">{g.nameEn}</h3>
                    <span className="text-xs bg-emerald-100 text-[#17483e] font-semibold px-2 py-0.5 rounded-md">
                      {g.areasCount} Areas
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-4 line-clamp-2">
                    {g.descriptionAr}
                  </p>
                  <Link
                    href={`/en/areas/${g.id}/`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17483e] hover:underline"
                  >
                    <span>View {g.nameEn} Painters</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

export default AreaPageEn;
