'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Home,
  Building2,
  Paintbrush,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { KUWAIT_GOVERNORATES } from '@/data/kuwait-areas';
import { Link } from '@/lib/nav';

export function RequestQuoteEn() {
  const [propertyType, setPropertyType] = useState<'apartment' | 'villa' | 'building' | 'commercial'>('apartment');
  const [workType, setWorkType] = useState<'interior' | 'exterior' | 'wallpaper' | 'decorative' | 'repair'>('interior');
  const [roomsCount, setRoomsCount] = useState<number>(3);
  const [includeMaterials, setIncludeMaterials] = useState<boolean>(true);
  const [paintQuality, setPaintQuality] = useState<'jotun-standard' | 'jotun-fenomastic' | 'caparol'>('jotun-fenomastic');
  const [selectedGovId, setSelectedGovId] = useState<string>('hawalli');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Live Instant KWD Estimate Calculation
  const calculation = useMemo(() => {
    let baseRatePerRoom = 22;
    if (workType === 'interior') baseRatePerRoom = 24;
    else if (workType === 'wallpaper') baseRatePerRoom = 28;
    else if (workType === 'decorative') baseRatePerRoom = 35;
    else if (workType === 'repair') baseRatePerRoom = 26;
    else if (workType === 'exterior') baseRatePerRoom = 75;

    let propertyMultiplier = 1;
    if (propertyType === 'villa') propertyMultiplier = 1.15;
    else if (propertyType === 'building') propertyMultiplier = 0.9;

    let materialCostPerRoom = 0;
    if (includeMaterials) {
      if (paintQuality === 'jotun-fenomastic') materialCostPerRoom = 14;
      else if (paintQuality === 'caparol') materialCostPerRoom = 12;
      else materialCostPerRoom = 10;
    }

    const totalMin = Math.round((baseRatePerRoom * 0.85 + materialCostPerRoom) * roomsCount * propertyMultiplier);
    const totalMax = Math.round((baseRatePerRoom * 1.25 + materialCostPerRoom * 1.15) * roomsCount * propertyMultiplier);
    const average = Math.round((totalMin + totalMax) / 2);

    return { totalMin, totalMax, average };
  }, [propertyType, workType, roomsCount, includeMaterials, paintQuality]);

  const waSummary = encodeURIComponent(
    `Hello Fani Kuwait, I used the online painting calculator:
• Property: ${propertyType}
• Service: ${workType}
• Rooms: ${roomsCount}
• Materials: ${includeMaterials ? paintQuality : 'Labor only'}
• Area: ${selectedGovId}
• Estimated Cost: ${calculation.totalMin} - ${calculation.totalMax} KWD
• Name: ${customerName || 'Customer'}
• Phone: ${customerPhone || 'Not provided'}
Please contact me to schedule a free on-site inspection.`
  );

  return (
    <Layout activeNav="/en/request-quote" lang="en">
      {/* Breadcrumbs */}
      <nav className="bg-stone-100 py-3 px-4 sm:px-6 border-b border-stone-200 text-xs text-stone-600">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link href="/en/" className="hover:text-[#17483e] hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="font-bold text-stone-900">Cost Calculator & Free Inspection</span>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-b from-[#123830] to-[#17483e] text-white py-12 px-4 sm:px-6 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
            Transparent Pricing Engine
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-3 mb-3">
            Calculate Your Painting Cost in Kuwait
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Get an instant, itemized estimate in Kuwaiti Dinar (KWD) and book a 100% free on-site inspection anywhere in Kuwait.
          </p>
        </div>
      </section>

      {/* Calculator Body */}
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Options (2 cols) */}
          <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
            {/* 1. Property Type */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-3">
                1. Select Property Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'apartment', label: 'Apartment / Flat' },
                  { id: 'villa', label: 'Private Villa' },
                  { id: 'commercial', label: 'Office / Shop' },
                  { id: 'building', label: 'Full Building' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPropertyType(p.id as any)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      propertyType === p.id
                        ? 'bg-[#17483e] text-amber-200 border-[#17483e] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Service Type */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-3">
                2. Select Required Service
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'interior', label: 'Interior Wall Painting' },
                  { id: 'wallpaper', label: 'Wallpaper Installation' },
                  { id: 'decorative', label: 'Italian Stucco / Accent' },
                  { id: 'repair', label: 'Moisture & Crack Repair' },
                  { id: 'exterior', label: 'Exterior Facade & Sigma' },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWorkType(w.id as any)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      workType === w.id
                        ? 'bg-[#17483e] text-amber-200 border-[#17483e] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Number of Rooms */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-stone-900">
                  3. Number of Rooms or Spaces:
                </label>
                <span className="text-base font-extrabold text-[#17483e] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value))}
                className="w-full accent-[#17483e] h-2 bg-stone-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>1 Room</span>
                <span>3 Rooms (Standard Flat)</span>
                <span>5 Rooms</span>
                <span>10+ Rooms (Villa)</span>
              </div>
            </div>

            {/* 4. Materials Inclusion */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-3">
                4. Materials & Paint Brand
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setIncludeMaterials(true)}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                    includeMaterials
                      ? 'bg-amber-50/80 border-[#17483e] text-[#17483e] font-bold shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className={includeMaterials ? 'text-[#17483e]' : 'text-stone-400'} />
                    <span className="font-bold text-sm">Labor + Materials Included</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 pl-6">
                    Genuine Jotun/Caparol paints, putty, tapes, and nylon coverings.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeMaterials(false)}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                    !includeMaterials
                      ? 'bg-amber-50/80 border-[#17483e] text-[#17483e] font-bold shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className={!includeMaterials ? 'text-[#17483e]' : 'text-stone-400'} />
                    <span className="font-bold text-sm">Labor Only (Client Buys Paint)</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 pl-6">
                    Skilled painters only; you supply the paint drums from Shuwaikh.
                  </p>
                </button>
              </div>

              {includeMaterials && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setPaintQuality('jotun-fenomastic')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold ${
                      paintQuality === 'jotun-fenomastic'
                        ? 'border-[#17483e] bg-[#17483e]/5 text-[#17483e]'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    Jotun Fenomastic Pure (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaintQuality('caparol')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold ${
                      paintQuality === 'caparol'
                        ? 'border-[#17483e] bg-[#17483e]/5 text-[#17483e]'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    Caparol German Quality
                  </button>
                </div>
              )}
            </div>

            {/* 5. Location */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                5. Location / Governorate in Kuwait
              </label>
              <select
                value={selectedGovId}
                onChange={(e) => setSelectedGovId(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-[#17483e]"
              >
                {KUWAIT_GOVERNORATES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nameEn} (e.g., {g.areas.slice(0, 3).map((a) => a.nameEn).join(', ')})
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Optional Contact Inputs */}
            <div className="pt-4 border-t border-stone-100">
              <label className="block text-sm font-bold text-stone-900 mb-2">
                6. Your Contact Info (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#17483e]"
                />
                <input
                  type="tel"
                  placeholder="Kuwait Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#17483e]"
                />
              </div>
            </div>
          </div>

          {/* Real-time Calculation Summary Card (1 col sticky) */}
          <div>
            <div className="bg-[#17483e] text-white rounded-2xl p-6 shadow-md sticky top-6 border-2 border-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Live Cost Estimation
              </span>

              <div className="mt-2 mb-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-300">
                  {calculation.totalMin} - {calculation.totalMax} <span className="text-xl">KWD</span>
                </div>
                <div className="text-xs text-emerald-200 mt-1">
                  Average expected cost: ~{calculation.average} KWD
                </div>
              </div>

              <div className="space-y-2 py-4 border-y border-white/10 text-xs text-emerald-100 mb-6">
                <div className="flex justify-between">
                  <span>Scope:</span>
                  <strong className="text-white capitalize">{propertyType} ({roomsCount} rooms)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <strong className="text-white capitalize">{workType}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Materials:</span>
                  <strong className="text-white">
                    {includeMaterials ? paintQuality.replace('-', ' ') : 'Labor only'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Inspection:</span>
                  <strong className="text-amber-300">100% Free On-site</strong>
                </div>
              </div>

              <a
                href={`https://wa.me/96590936801?text=${waSummary}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#123830] font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md mb-3"
              >
                <MessageCircle size={18} />
                <span>Confirm Estimate via WhatsApp</span>
              </a>

              <a
                href="tel:96590936801"
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all border border-white/20"
              >
                <Phone size={15} />
                <span>Call Coordinator: +965 90936801</span>
              </a>

              <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-emerald-200/80 leading-relaxed text-center">
                * Final price confirmed upon free physical inspection. No advance payment required before work starts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RequestQuoteEn;
