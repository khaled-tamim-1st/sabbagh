'use client';

import React, { useState, useMemo } from 'react';
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Paintbrush,
  Calculator,
  ArrowRight,
  ChevronDown,
  Layers,
  HelpCircle,
  Building2,
} from 'lucide-react';
import { PAINTERS_DATA, type Painter } from '@/data/painters';
import { catalogStore } from '@/lib/catalog-store';
import { KUWAIT_SERVICES_DATA_EN } from '@/data/services-data-en';
import { SiteFooter } from '@/components/footer';
import { Header } from '@/components/header';
import { Link } from '@/lib/nav';
import { PainterAvatar } from '@/components/painter-avatar';

const regionsEn = [
  'All Kuwait Areas',
  'Salmiya',
  'Hawalli',
  'Kuwait City (Sharq)',
  'Mahboula',
  'Fintas',
  'Farwaniya',
  'Al Mutlaa',
  'Jahra',
];

export function HomeViewEn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Kuwait Areas');
  const [selectedService, setSelectedService] = useState('All Services');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  // Filter painters
  const filteredPainters = useMemo(() => {
    let list = catalogStore.getApprovedPainters();

    if (showSavedOnly) {
      list = list.filter((p) => favorites.includes(p.id));
    }

    if (selectedRegion !== 'All Kuwait Areas') {
      list = list.filter((p) =>
        p.region.includes(selectedRegion) ||
        p.governorates?.some((g: string) => g.includes(selectedRegion)) ||
        p.description?.includes(selectedRegion)
      );
    }

    if (selectedService !== 'All Services') {
      list = list.filter((p) =>
        p.services?.some((s) => s.toLowerCase().includes(selectedService.toLowerCase()))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.services?.some((s) => s.toLowerCase().includes(q))
      );
    }

    return list;
  }, [searchQuery, selectedRegion, selectedService, showSavedOnly, favorites]);

  return (
    <div className="site-shell" dir="ltr" lang="en">
      <Header
        lang="en"
        favoritesCount={favorites.length}
        favoritesOnly={showSavedOnly}
        onToggleFavorites={() => setShowSavedOnly(!showSavedOnly)}
      />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#123830] to-[#17483e] text-white pt-16 pb-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6">
              <ShieldCheck size={16} className="text-amber-300" />
              <span>Kuwait’s #1 Verified Painting & Decorating Directory</span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Top Certified House & Apartment <br className="hidden sm:inline" />
              <span className="text-amber-300">Painters in Kuwait</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-emerald-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Connect directly with expert, vetted painters and interior decorators across all Kuwait governorates. 
              Transparent KWD prices, authentic Jotun & Caparol paints, free on-site inspections, and English-speaking coordination.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                href="/en/request-quote/"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#123830] px-7 py-3.5 rounded-xl font-bold text-base shadow-lg transition-all"
              >
                <Calculator size={18} />
                <span>Calculate Painting Cost (Instant)</span>
              </Link>

              <a
                href="https://wa.me/96590936801?text=Hi%20Fani%20Kuwait,%20I%20am%20looking%20for%20a%20painting%20service%20quote%20for%20my%20apartment/villa."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-semibold text-base backdrop-blur-sm transition-all"
              >
                <MessageCircle size={18} className="text-emerald-300" />
                <span>WhatsApp Coordinator (English)</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-white/10 text-left">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
                  <Calculator size={20} className="text-amber-300" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">18 - 35 KWD</div>
                  <div className="text-xs text-emerald-200">Room repainting baseline</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center shrink-0">
                  <Paintbrush size={20} className="text-emerald-300" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">100% Genuine</div>
                  <div className="text-xs text-emerald-200">Jotun Fenomastic paints</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-sky-400/20 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-sky-300" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Free Inspection</div>
                  <div className="text-xs text-emerald-200">No obligation quote</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-purple-400/20 flex items-center justify-center shrink-0">
                  <Clock3 size={20} className="text-purple-300" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">24-48h Move-Out</div>
                  <div className="text-xs text-emerald-200">Fast flat handovers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Citable BLUF Information Gain Pricing Table */}
        <section className="py-12 bg-amber-50/50 border-b border-amber-100 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17483e] bg-emerald-100 px-3 py-1 rounded-full">
                2026 Price Transparency
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                How Much Does House & Flat Painting Cost in Kuwait?
              </h2>
              <p className="text-stone-600 text-sm max-w-2xl mx-auto mt-2">
                Official market estimates in Kuwaiti Dinar (KWD) based on certified labor rates and genuine Jotun Fenomastic materials.
              </p>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#17483e] text-white">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Painting Scope / Job Type</th>
                    <th className="py-3.5 px-4 font-bold">Labor Only (KWD)</th>
                    <th className="py-3.5 px-4 font-bold">Labor + Genuine Jotun Paint (KWD)</th>
                    <th className="py-3.5 px-4 font-bold">Expected Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-700">
                  <tr className="hover:bg-amber-50/40">
                    <td className="py-3 px-4 font-semibold text-stone-900">Standard Single Room (4×4m)</td>
                    <td className="py-3 px-4 text-emerald-800 font-bold">18 - 25 KWD</td>
                    <td className="py-3 px-4 text-[#17483e] font-bold">30 - 45 KWD</td>
                    <td className="py-3 px-4">1 Day</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40">
                    <td className="py-3 px-4 font-semibold text-stone-900">Master Bedroom with Dressing Area</td>
                    <td className="py-3 px-4 text-emerald-800 font-bold">25 - 35 KWD</td>
                    <td className="py-3 px-4 text-[#17483e] font-bold">45 - 65 KWD</td>
                    <td className="py-3 px-4">1 - 2 Days</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40">
                    <td className="py-3 px-4 font-semibold text-stone-900">2-Bedroom Flat (Full Repaint / Handover)</td>
                    <td className="py-3 px-4 text-emerald-800 font-bold">50 - 75 KWD</td>
                    <td className="py-3 px-4 text-[#17483e] font-bold">75 - 110 KWD</td>
                    <td className="py-3 px-4">2 - 3 Days</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40">
                    <td className="py-3 px-4 font-semibold text-stone-900">3-Bedroom Apartment (Move-out Refresh)</td>
                    <td className="py-3 px-4 text-emerald-800 font-bold">70 - 100 KWD</td>
                    <td className="py-3 px-4 text-[#17483e] font-bold">95 - 145 KWD</td>
                    <td className="py-3 px-4">3 - 4 Days</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40">
                    <td className="py-3 px-4 font-semibold text-stone-900">Modern TV Wall (PVC Marble + Wood Slats)</td>
                    <td className="py-3 px-4 text-emerald-800 font-bold">25 - 40 KWD</td>
                    <td className="py-3 px-4 text-[#17483e] font-bold">60 - 95 KWD (all-in)</td>
                    <td className="py-3 px-4">4 - 6 Hours</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40">
                    <td className="py-3 px-4 font-semibold text-stone-900">Double Garage Epoxy Flooring (35 m²)</td>
                    <td className="py-3 px-4 text-emerald-800 font-bold">60 - 80 KWD</td>
                    <td className="py-3 px-4 text-[#17483e] font-bold">130 - 190 KWD</td>
                    <td className="py-3 px-4">2 Days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-3 mt-4 text-xs text-stone-500">
              <span>* Includes floor protection, scraping, putty skimming, and dustless cleanup.</span>
              <Link href="/en/services-guide/" className="text-[#17483e] font-bold hover:underline flex items-center gap-1">
                <span>View Full 2026 Price Guide</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search input */}
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by painter, area, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#17483e]"
                />
              </div>

              {/* Region Select */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-[#17483e]"
              >
                {regionsEn.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* Service Select */}
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-[#17483e]"
              >
                <option value="All Services">All Painting Services</option>
                <option value="Interior">Interior Wall Painting</option>
                <option value="Wallpaper">Wallpaper Installation</option>
                <option value="Italian">Italian Stucco & Marmorino</option>
                <option value="Marble">PVC Marble & Wood Cladding</option>
                <option value="Moisture">Moisture & Crack Repair</option>
                <option value="Exterior">Exterior Facade & Sigma</option>
                <option value="Epoxy">Epoxy Floor Coatings</option>
                <option value="Doors">Door & Wood Spraying</option>
              </select>
            </div>
          </div>

          {/* Painters Grid */}
          <div className="mb-14">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                Verified Painters in Kuwait ({filteredPainters.length})
              </h2>
              {showSavedOnly && (
                <button
                  type="button"
                  onClick={() => setShowSavedOnly(false)}
                  className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full font-semibold"
                >
                  Show All Painters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPainters.slice(0, 9).map((painter) => {
                const isSaved = favorites.includes(painter.id);
                const waMessage = encodeURIComponent(
                  `Hi ${painter.name}, I found your profile on Fani Kuwait. I need a painting service quotation.`
                );

                return (
                  <article
                    key={painter.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <PainterAvatar painter={painter} />
                          <div>
                            <h3 className="font-bold text-stone-900 text-base leading-tight">
                              {painter.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold mt-0.5">
                              <BadgeCheck size={14} />
                              <span>Verified Technician</span>
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleFavorite(painter.id)}
                          className={`p-2 rounded-full border transition-colors ${
                            isSaved
                              ? 'bg-rose-50 border-rose-200 text-rose-600'
                              : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-rose-500'
                          }`}
                          aria-label="Save to favorites"
                        >
                          <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Meta Tags */}
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

                      {/* Description */}
                      <p className="text-stone-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {painter.description}
                      </p>

                      {/* Services Pills */}
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

                    {/* Action CTAs */}
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
          </div>
        </section>

        {/* English Services Grid */}
        <section className="py-16 bg-stone-100 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17483e] bg-emerald-200/60 px-3 py-1 rounded-full">
                Core Specialties
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                Specialized Painting Services in Kuwait
              </h2>
              <p className="text-stone-600 text-sm max-w-2xl mx-auto mt-2">
                From move-in apartment freshening to luxury Italian stucco and waterproof exterior facades.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {KUWAIT_SERVICES_DATA_EN.slice(0, 6).map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-[#17483e] transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                      {service.categoryLabelEn}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mt-3 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-stone-600 text-xs leading-relaxed line-clamp-3 mb-4">
                      {service.description}
                    </p>

                    <div className="bg-stone-50 p-3 rounded-xl mb-4 border border-stone-100">
                      <div className="text-[11px] text-stone-500 uppercase tracking-wide">Standard Price:</div>
                      <div className="text-base font-extrabold text-[#17483e] mt-0.5">
                        {service.price.fromKWD} - {service.price.toKWD} KWD{' '}
                        <span className="text-xs font-normal text-stone-500">/{service.price.unit}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/en/services/${service.slug}/`}
                    className="inline-flex items-center justify-between w-full text-xs font-bold text-[#17483e] hover:text-[#123830] pt-3 border-t border-stone-100"
                  >
                    <span>View Service Details & Pricing</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/en/services/"
                className="inline-flex items-center gap-2 bg-[#17483e] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#123830] transition-colors"
              >
                <Layers size={16} />
                <span>Explore All 12 Painting Services</span>
              </Link>
            </div>
          </div>
        </section>

        {/* English FAQ Section */}
        <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
              Frequently Asked Questions by Expats & Homeowners
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <h3 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-[#17483e]" />
                How much does it cost to paint a 3-bedroom apartment in Kuwait?
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed pl-6">
                A full 3-bedroom apartment (3 bedrooms, living hall, corridors) typically costs between 85 to 140 KWD,
                inclusive of authentic Jotun Fenomastic paint, putty skimming, furniture covering, and floor protection.
                The project usually takes 3 to 4 days.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <h3 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-[#17483e]" />
                Can I get an English-speaking supervisor or painter?
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed pl-6">
                Yes. Our platform connects you with verified painters and customer coordinators who speak English fluently,
                ensuring smooth coordination on site and clear WhatsApp communication for scheduling free inspections.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <h3 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-[#17483e]" />
                What is the best paint finish for rental apartments in Kuwait?
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed pl-6">
                Eggshell (Quarter-Gloss) finish is the gold standard for Kuwait rental properties. It withstands frequent washing,
                resists AC humidity, and prevents fingerprint marks, allowing you to easily recover your security deposit during lease handovers.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <h3 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-[#17483e]" />
                Is the on-site inspection free of charge?
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed pl-6">
                Yes, our vetted painters provide 100% free on-site inspections across all Kuwait governorates (Salmiya, Kuwait City,
                Mahboula, Jahra, etc.) with exact laser measurements and an itemized cost estimate with zero commitment.
              </p>
            </div>
          </div>
        </section>

        {/* Final Conversion CTA */}
        <section className="bg-gradient-to-r from-[#17483e] to-[#123830] text-white py-14 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Ready to Refresh Your Home or Apartment?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base mb-6">
              Get an instant itemized estimate or speak directly with a certified English-speaking painting supervisor in Kuwait.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/en/request-quote/"
                className="bg-amber-400 hover:bg-amber-300 text-[#123830] font-bold px-7 py-3 rounded-xl text-sm transition-all"
              >
                Request Free Inspection & Quote
              </Link>
              <a
                href="https://wa.me/96590936801?text=Hello,%20I%20would%20like%20to%20inquire%20about%20painting%20services%20in%20Kuwait."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Direct WhatsApp Chat
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter lang="en" />
    </div>
  );
}

export default HomeViewEn;
