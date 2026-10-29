'use client';

import { useState, useEffect } from 'react';
import { Link, useRoute } from '@/lib/nav';
import {
  BadgeCheck, Clock3, MapPin, Star, Phone, MessageCircle,
  ShieldCheck, ChevronRight, Layers,
  Sparkles, CheckCircle2, UserCheck, AlertCircle, X,
  Building, Check, ThumbsUp, Maximize2, Image as ImageIcon,
  Calculator, ArrowLeft
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PainterAvatar } from '@/components/painter-avatar';
import { getPainterById, PAINTERS_DATA, type Painter } from '@/data/painters';
import { catalogStore } from '@/lib/catalog-store';
import { apiClient } from '@/lib/api-client';
import { translateServiceToEn, translateGovernorateToEn } from '@/lib/profile-translator';

export default function PainterProfilePageEn({ id: propId }: { id?: number | string }) {
  let browserSlug = '';
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/\/en\/painters\/([^/]+)/);
    if (match) {
      browserSlug = decodeURIComponent(match[1]);
    }
  }

  const [, idParams] = useRoute('/en/painters/:id');
  const [, slugParams] = useRoute('/en/painters/:slug');
  const rawIdentifier = browserSlug || propId || slugParams?.slug || idParams?.id || 1;
  const decodedIdentifier = typeof rawIdentifier === 'string' ? decodeURIComponent(rawIdentifier) : rawIdentifier;

  const [painter, setPainter] = useState<Painter>(() => {
    return catalogStore.getPainterById(decodedIdentifier) || getPainterById(decodedIdentifier) || PAINTERS_DATA[0];
  });

  useEffect(() => {
    const updated = catalogStore.getPainterById(decodedIdentifier);
    if (updated) setPainter(updated);

    const unsubscribe = catalogStore.subscribe(() => {
      const refreshed = catalogStore.getPainterById(decodedIdentifier);
      if (refreshed) setPainter(refreshed);
    });

    const fetchTarget = encodeURIComponent(String(decodedIdentifier));
    apiClient.get<any>(`/public/painters/${fetchTarget}`)
      .then((data) => {
        if (data && data.name) {
          setPainter((prev) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch(() => {});

    return () => unsubscribe();
  }, [decodedIdentifier]);

  const displayName = painter.nameEn || painter.name;
  const displayBio = painter.bioEn || painter.bio || painter.description || 'Experienced professional painter offering comprehensive interior, exterior, and specialty decorative finishes across Kuwait with authentic materials.';
  const displayRegion = painter.regionEn || translateGovernorateToEn(painter.region) || 'All Kuwait Governorates';
  const displayServices = painter.servicesEn || (painter.services || []).map(translateServiceToEn);
  const displayGovernorates = (painter.governorates || []).map(translateGovernorateToEn);

  const whatsappMessage = encodeURIComponent(
    `Hello ${displayName}, I found your verified profile on Fani Kuwait. I would like to request an inspection and quotation for my property.`
  );

  return (
    <Layout lang="en">
      <div className="bg-[#fbf9f4] min-h-screen pb-20" dir="ltr">
        {/* Breadcrumb Navigation */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/en/' },
              { label: 'Painters Directory', href: '/en/areas/' },
              { label: displayName, isCurrent: true },
            ]}
          />
        </div>

        {/* Profile Header Card */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 border-2 border-amber-300 shrink-0">
                  <PainterAvatar
                    painter={painter}
                    size={96}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                      {displayName}
                    </h1>
                    {painter.isVerified && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-200">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-2">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{painter.rating}</span>
                      <span className="text-stone-400">({painter.reviews} reviews)</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{displayRegion}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="w-3.5 h-3.5 text-stone-400" />
                      <span>{painter.years} years exp</span>
                    </span>
                  </div>

                  <div className="text-xs text-emerald-800 font-semibold bg-emerald-50/80 px-3 py-1 rounded-lg inline-block">
                    Starting from {painter.startingAt || '18 KWD'} per standard room
                  </div>
                </div>
              </div>

              {/* Direct Call / WhatsApp Actions */}
              <div className="flex flex-row sm:flex-col w-full md:w-auto gap-2.5 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
                <a
                  href={`https://wa.me/${painter.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Quote</span>
                </a>
                <a
                  href={`tel:${painter.phone}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {painter.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Profile Content Details */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Bio & Overview */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <h2 className="text-lg font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100">
                Technician Bio &amp; Experience
              </h2>
              <p className="text-stone-700 text-sm leading-relaxed mb-4">
                {displayBio}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100 text-center">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="text-lg font-bold text-[#17483e]">{painter.years}+ yrs</div>
                  <div className="text-[11px] text-stone-500">Experience</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="text-lg font-bold text-[#17483e]">{painter.crewSize || 4}</div>
                  <div className="text-[11px] text-stone-500">Crew Size</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="text-lg font-bold text-[#17483e]">{painter.warrantyYears || 3} yrs</div>
                  <div className="text-[11px] text-stone-500">Warranty</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="text-lg font-bold text-[#17483e]">100%</div>
                  <div className="text-[11px] text-stone-500">Free Inspection</div>
                </div>
              </div>
            </section>

            {/* Specialties & Services */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                Provided Painting Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {displayServices.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-800 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Coverage Areas */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <h2 className="text-lg font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100">
                Covered Kuwait Governorates
              </h2>
              <div className="flex flex-wrap gap-2">
                {displayGovernorates.map((gov, idx) => (
                  <span
                    key={idx}
                    className="bg-[#17483e]/10 text-[#17483e] border border-[#17483e]/20 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    {gov}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar CTA & Instant Calculation */}
          <aside className="space-y-6">
            <div className="bg-gradient-to-br from-[#17483e] to-[#123830] rounded-2xl p-6 text-white shadow-md sticky top-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-2">
                Book with Confidence
              </span>
              <h3 className="text-xl font-bold mb-3">Schedule Free On-Site Inspection</h3>
              <p className="text-emerald-100 text-xs leading-relaxed mb-6">
                Connect directly with {painter.name}. No upfront deposit required before inspection and color matching.
              </p>

              <a
                href={`https://wa.me/${painter.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#123830] font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md mb-3"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>

              <Link
                href="/en/request-quote/"
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors border border-white/20"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Cost Estimate</span>
              </Link>
            </div>
          </aside>
        </main>
      </div>
    </Layout>
  );
}
