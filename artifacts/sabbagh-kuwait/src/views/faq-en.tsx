'use client';

import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Paintbrush,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Search,
  AlertCircle,
  Phone,
  Calculator,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Link } from '@/lib/nav';
import {
  SeoSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
} from '@/components/seo-schema';

interface FaqItemEn {
  id: string;
  category: 'pricing' | 'materials' | 'warranty' | 'process';
  categoryLabel: string;
  question: string;
  answer: string;
  highlight?: string;
}

const FAQS_DATA_EN: FaqItemEn[] = [
  {
    id: 'f1',
    category: 'pricing',
    categoryLabel: 'Pricing & Costs',
    question: 'How is house and apartment painting calculated in Kuwait?',
    answer:
      'Painting in Kuwait is calculated either per room (ranging between 18 to 35 KWD for labor with putty prep, or 30 to 50 KWD including genuine Jotun Fenomastic paint), or as a lump-sum package for the entire apartment or villa. Repainting a complete 3-bedroom flat typically ranges between 85 to 140 KWD, offering substantial volume savings compared to individual rooms.',
    highlight: 'On-site inspections are always 100% free with zero commitment.',
  },
  {
    id: 'f2',
    category: 'pricing',
    categoryLabel: 'Pricing & Costs',
    question: 'Do quoted rates include authentic paint materials or labor only?',
    answer:
      'Both options are available. Our turnkey packages include genuine Jotun Fenomastic Pure paint, crack-resistant putty, masking tapes, floor plastic protection, and complete post-job cleanup. Alternatively, you can opt for labor-only contracts and purchase the paint yourself from authorized Jotun/Caparol distributors in Shuwaikh or Fahaheel.',
  },
  {
    id: 'f3',
    category: 'pricing',
    categoryLabel: 'Pricing & Costs',
    question: 'How can I ensure my rental deposit is fully refunded when moving out?',
    answer:
      'We specialize in rapid 24-48 hour move-out refresh painting for rental flats in Salmiya, Hawalli, and Mahboula. We match the original landlord wall colors, patch drywall holes, and apply a clean topcoat that satisfies property managers, ensuring your security deposit is returned in full.',
    highlight: 'Completed in as little as 24-48 hours before your handover inspection.',
  },
  {
    id: 'f4',
    category: 'materials',
    categoryLabel: 'Materials & Brands',
    question: 'What are the best paint brands for Kuwait’s climate (50°C heat & humidity)?',
    answer:
      'Jotun is the undisputed market leader in Kuwait with their Fenomastic Pure Colours range for interior walls and Jotashield Extreme for exterior heat-reflective facades. Caparol (German quality) is highly recommended for waterproofing primers and crack sealing, while Hempel excels in coastal marine environments like Khiran and Salmiya.',
    highlight: 'All vetted painters use sealed, barcode-verified original buckets.',
  },
  {
    id: 'f5',
    category: 'materials',
    categoryLabel: 'Materials & Brands',
    question: 'What is the practical difference between Matt, Eggshell, and Semi-Gloss?',
    answer:
      'Matt finishes conceal wall imperfections and eliminate light reflections (ideal for ceilings and master bedrooms). Eggshell (Quarter-Gloss) is the most popular choice for Kuwait living rooms and kids bedrooms because it provides an elegant low sheen while allowing regular damp sponge scrubbing. Semi-Gloss provides maximum moisture resistance for kitchens and bathrooms.',
  },
  {
    id: 'f6',
    category: 'warranty',
    categoryLabel: 'Warranty & Trust',
    question: 'Do you offer a written warranty against paint peeling or blistering?',
    answer:
      'Yes. Our full-prep painting services include a written guarantee (ranging from 1 to 3 years for interior work and up to 10 years for exterior Sigma/Jotashield applications) against blistering, flaking, or delamination, provided there are no underlying plumbing leaks.',
  },
  {
    id: 'f7',
    category: 'warranty',
    categoryLabel: 'Warranty & Trust',
    question: 'How is my furniture, marble, and parquet protected during painting?',
    answer:
      'Before opening any paint can, our painters move furniture to the center of the room, seal it completely with heavy-gauge polyethylene plastic sheeting, tape baseboards and switches, and cover marble or parquet floors with protective heavy duty paper and drop cloths.',
    highlight: 'Complete site cleaning and vacuuming is mandatory before job handover.',
  },
  {
    id: 'f8',
    category: 'process',
    categoryLabel: 'Workflow & Process',
    question: 'Can you provide English-speaking coordination and WhatsApp support?',
    answer:
      'Yes! We recognize that communication is paramount. Our team provides fluent English customer support via WhatsApp and coordinates directly with bilingual supervisors on site.',
  },
  {
    id: 'f9',
    category: 'process',
    categoryLabel: 'Workflow & Process',
    question: 'How long does it take to paint a typical 2 to 3-bedroom apartment in Kuwait?',
    answer:
      'A standard 2-3 bedroom flat takes between 2 to 4 working days, including furniture protection, crack scraping, 2 coats of skim putty, machine sanding, primer, and two finish coats of Jotun paint.',
  },
];

export function FaqEnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['f1', 'f3', 'f8']);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    let list = FAQS_DATA_EN;
    if (selectedCategory !== 'all') {
      list = list.filter((f) => f.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'Home', url: 'https://sabbagh-kuwait.com/en/' },
      { name: 'FAQ', url: 'https://sabbagh-kuwait.com/en/faq/' },
    ],
  });

  const faqSchema = generateFaqSchema({
    items: FAQS_DATA_EN.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
  });

  return (
    <Layout activeNav="/en/faq" lang="en">
      <SeoSchema schemas={[breadcrumbSchema, faqSchema]} />

      {/* Breadcrumbs */}
      <nav className="bg-stone-100 py-3 px-4 sm:px-6 border-b border-stone-200 text-xs text-stone-600">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/en/" className="hover:text-[#17483e] hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="font-bold text-stone-900">Frequently Asked Questions</span>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-b from-[#123830] to-[#17483e] text-white py-14 px-4 sm:px-6 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
            Knowledge Base & Warranty
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-3 mb-3">
            Kuwait Painting & Decorating FAQ
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Everything expats and homeowners need to know about pricing, genuine paint brands, warranties, and move-out handovers in Kuwait.
          </p>
        </div>
      </section>

      {/* Search & Category Pills */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search questions (e.g. price, Jotun, move-out, warranty)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#17483e] shadow-2xs"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-8">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'pricing', label: 'Pricing & Costs' },
            { id: 'materials', label: 'Materials & Brands' },
            { id: 'warranty', label: 'Warranty & Trust' },
            { id: 'process', label: 'Workflow & Process' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#17483e] text-amber-200 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-stone-900 text-sm sm:text-base hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-2">
                    <HelpCircle size={18} className="text-[#17483e] shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#17483e]' : 'text-stone-400'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    <p>{faq.answer}</p>
                    {faq.highlight && (
                      <div className="mt-3 bg-amber-50 p-2.5 rounded-lg border border-amber-200/80 text-amber-900 text-xs font-semibold flex items-center gap-2">
                        <Sparkles size={14} className="text-amber-600 shrink-0" />
                        <span>{faq.highlight}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 text-center">
          <h2 className="text-xl font-bold text-stone-900 mb-2">
            Have a Specific Question About Your Home or Flat?
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mb-6 max-w-md mx-auto">
            Our English-speaking coordinators are available on WhatsApp to answer questions, check color swatches, or schedule a free inspection.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/96590936801?text=Hi%20Fani%20Kuwait,%20I%20have%20a%20question%20about%20painting%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Us in English</span>
            </a>
            <Link
              href="/en/request-quote/"
              className="inline-flex items-center gap-2 bg-[#17483e] text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#123830] transition-colors"
            >
              <Calculator size={16} />
              <span>Calculate Painting Cost</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FaqEnPage;
