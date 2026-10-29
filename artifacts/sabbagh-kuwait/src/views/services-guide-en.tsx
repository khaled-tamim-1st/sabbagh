'use client';

import React from 'react';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Paintbrush,
  Calculator,
  MessageCircle,
  Phone,
  Building,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Link } from '@/lib/nav';
import { KUWAIT_SERVICES_DATA_EN } from '@/data/services-data-en';

export function ServicesGuideEn() {
  return (
    <Layout activeNav="/en/services-guide" lang="en">
      {/* Breadcrumbs */}
      <nav className="bg-stone-100 py-3 px-4 sm:px-6 border-b border-stone-200 text-xs text-stone-600">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link href="/en/" className="hover:text-[#17483e] hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="font-bold text-stone-900">Kuwait Painting Price Guide 2026</span>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#123830] to-[#17483e] text-white py-14 px-4 sm:px-6 border-b-4 border-amber-400">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
            Official 2026 Benchmark
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-3 mb-4">
            Kuwait House & Apartment Painting Price Guide (2026)
          </h1>
          <p className="text-emerald-100 text-base max-w-2xl leading-relaxed">
            A comprehensive, transparent cost breakdown for painting, wall decorating, and waterproofing services in Kuwait. 
            All rates verified against Shuwaikh building materials wholesale markets and certified Jotun/Caparol contractors.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-12">
        {/* Core Pricing Table */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Average Painting Costs in Kuwait by Job Scope
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mb-6">
            Realistic market estimates in Kuwaiti Dinar (KWD). Pricing covers furniture wrapping, surface patching, putty skimming, and dustless vacuum cleanup.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#17483e] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold">Service / Property Scope</th>
                  <th className="py-3 px-4 font-bold">Labor Only</th>
                  <th className="py-3 px-4 font-bold">Labor + Genuine Materials</th>
                  <th className="py-3 px-4 font-bold">Recommended Paint</th>
                  <th className="py-3 px-4 font-bold">Average Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-700 text-xs sm:text-sm">
                <tr className="hover:bg-amber-50/40">
                  <td className="py-3.5 px-4 font-bold text-stone-900">Standard Room (4×4m)</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">18 - 25 KWD</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#17483e]">30 - 45 KWD</td>
                  <td className="py-3.5 px-4">Jotun Fenomastic Eggshell</td>
                  <td className="py-3.5 px-4">1 Day</td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-3.5 px-4 font-bold text-stone-900">2-Bedroom Flat (Full Repaint)</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">50 - 75 KWD</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#17483e]">75 - 110 KWD</td>
                  <td className="py-3.5 px-4">Jotun Fenomastic Pure</td>
                  <td className="py-3.5 px-4">2 - 3 Days</td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-3.5 px-4 font-bold text-stone-900">3-Bedroom Apartment (Move-Out Refresh)</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">70 - 100 KWD</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#17483e]">95 - 145 KWD</td>
                  <td className="py-3.5 px-4">Jotun Fenomastic / Caparol</td>
                  <td className="py-3.5 px-4">3 - 4 Days</td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-3.5 px-4 font-bold text-stone-900">Villa Interior (Full 2-Story)</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">350 - 600 KWD</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#17483e]">650 - 1,100 KWD</td>
                  <td className="py-3.5 px-4">Jotun Lady Design + Fenomastic</td>
                  <td className="py-3.5 px-4">7 - 12 Days</td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-3.5 px-4 font-bold text-stone-900">Exterior Facade & Sigma (per m²)</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">1.2 - 2.0 KWD</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#17483e]">2.2 - 4.5 KWD</td>
                  <td className="py-3.5 px-4">Jotashield Extreme 50°C+</td>
                  <td className="py-3.5 px-4">Scaffolding + 7-14 Days</td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-3.5 px-4 font-bold text-stone-900">Double Garage Epoxy (35 m²)</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">60 - 80 KWD</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#17483e]">130 - 190 KWD</td>
                  <td className="py-3.5 px-4">Jotun Penguard / Sika</td>
                  <td className="py-3.5 px-4">2 Days + 48h cure</td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-3.5 px-4 font-bold text-stone-900">Modern TV Wall Unit (PVC Marble)</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">25 - 40 KWD</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#17483e]">60 - 95 KWD</td>
                  <td className="py-3.5 px-4">Korean UV PVC + WPC Wood</td>
                  <td className="py-3.5 px-4">Half Day</td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-3.5 px-4 font-bold text-stone-900">Italian Stucco / Marmorino (per m²)</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">2.5 - 4.5 KWD</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#17483e]">4.5 - 9.0 KWD</td>
                  <td className="py-3.5 px-4">San Marco / Valpaint</td>
                  <td className="py-3.5 px-4">2 - 3 Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Wholesale Material Price Index (Shuwaikh & Rai) */}
        <section className="bg-amber-50/60 rounded-2xl p-6 sm:p-8 border border-amber-200/80">
          <h2 className="text-xl font-bold text-stone-900 mb-2 flex items-center gap-2">
            <Building size={20} className="text-[#17483e]" />
            Shuwaikh Wholesale Paint & Material Benchmark (2026)
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mb-6">
            If you choose to purchase paints directly from authorized dealers in Shuwaikh Industrial or Fahaheel, here are standard retail prices:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
              <span className="text-stone-500 block">Jotun Fenomastic Pure (18L Drum)</span>
              <strong className="text-lg font-extrabold text-[#17483e] block mt-1">18 - 25 KWD</strong>
              <span className="text-stone-500 text-[11px]">Covers ~70-90 m² (2 coats)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
              <span className="text-stone-500 block">Caparol Wall Putty (25kg Drum)</span>
              <strong className="text-lg font-extrabold text-[#17483e] block mt-1">4.5 - 7 KWD</strong>
              <span className="text-stone-500 text-[11px]">Crack-resistant skim filler</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
              <span className="text-stone-500 block">Jotashield Extreme Exterior (18L)</span>
              <strong className="text-lg font-extrabold text-[#17483e] block mt-1">24 - 34 KWD</strong>
              <span className="text-stone-500 text-[11px]">50°C+ Heat-reflective coat</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
              <span className="text-stone-500 block">Korean 3D Wallpaper (16.5 m² Roll)</span>
              <strong className="text-lg font-extrabold text-[#17483e] block mt-1">12 - 25 KWD</strong>
              <span className="text-stone-500 text-[11px]">Heavy moisture-resistant vinyl</span>
            </div>
          </div>
        </section>

        {/* 4 Expert Saving Tips */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-[#17483e]" />
            How to Save Money on Painting in Kuwait Without Sacrificing Quality
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-700">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-stone-900 block mb-1">Repaint as a Complete Package</strong>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Contracting an entire 2 or 3-bedroom flat reduces the average cost per room by 25-30% compared to painting individual rooms separately.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-stone-900 block mb-1">Choose Eggshell (Quarter-Gloss)</strong>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Avoid dead-flat paints in rental flats. Eggshell finishes allow scrubbing off scuffs with water, saving you from frequent full repainting cycles.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-stone-900 block mb-1">Always Demand a Free On-Site Inspection</strong>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Never finalize a quotation over phone messages alone. A certified painter will measure walls with laser tools and verify peeling moisture roots upfront.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-stone-900 block mb-1">Verify Factory Sealed Paint Drums</strong>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Insist on seeing newly delivered Jotun or Caparol paint cans before they are opened to ensure paint has not been diluted with excess water or mixed with commercial grade white.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action CTA */}
        <div className="bg-[#17483e] text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Need a Personalized Itemized Quote?</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mb-6 max-w-lg mx-auto">
            Use our instant calculator to estimate your home painting cost, or speak with an English-speaking coordinator for a free inspection.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/en/request-quote/"
              className="bg-amber-400 hover:bg-amber-300 text-[#123830] font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md"
            >
              Use Online Calculator
            </Link>
            <a
              href="https://wa.me/96590936801?text=Hi%20Fani%20Kuwait,%20I%20reviewed%20your%202026%20Price%20Guide.%20I%20would%20like%20a%20quotation."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl text-xs border border-white/20 transition-all"
            >
              Chat on WhatsApp (English)
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ServicesGuideEn;
