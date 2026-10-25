# Kuwait-Painters Production SEO Content Generation System

A production-grade, highly researched Arabic SEO content pipeline built for **Kuwait-Painters** (`sabbagh-kuwait`). The system coordinates 30 specialized article jobs covering painting, decorative wall finishes, exterior facades, and waterproofing in Kuwait.

---

## 🏗️ Architecture & Conventions

```
content-system/
├── README.md
├── article-registry.json          # Master 30-job state registry and tracking
├── keyword-ownership-map.json     # Zero-cannibalization keyword ownership matrix
├── internal-link-map.json         # Topological link graph linking articles to service hubs
├── prompts/                       # Modular reusable agent prompts
│   ├── orchestrator.md
│   ├── research-agent.md
│   ├── keyword-agent.md
│   ├── outline-agent.md
│   ├── writing-agent.md
│   ├── seo-editor.md
│   └── qa-agent.md
├── research/                      # Research dossiers, sources, keyword maps, and outlines
│   └── ARTICLE-XX/
├── drafts/                        # Production Arabic drafts (1,800 - 3,000 words)
│   └── ARTICLE-XX.md
├── seo/                           # On-page metadata, slug, alt text, and Schema JSON
│   └── ARTICLE-XX.json
├── qa/                            # 10-category weighted QA evaluation reports
│   └── ARTICLE-XX-report.md
└── logs/
    └── execution-log.jsonl        # Immutable timestamped execution ledger
```

---

## 🔄 The 10-Stage Article Workflow (Stages A - N)

Each article progresses through strict sequential gates:

1. **Stage A: Article Brief** -> Core intent, audience pain points, and risk assessment.
2. **Stage B: Deep Web Research** -> Genuine Kuwait market grounding, competitor analysis, source recording in `sources.json` & `research-dossier.md`.
3. **Stage C: Keyword Research** -> Intent validation, zero-cannibalization check against `keyword-ownership-map.json`.
4. **Stage D: Content Gap & Information Gain** -> Identifying missing competitor answers, unique value additions.
5. **Stage E: Structured Outline** -> Direct answer front-loading, tables, checklists, Kuwait context, FAQs.
6. **Stage F: Arabic Draft** -> Fluent, high-grade Arabic (1,800–2,600+ words), native Kuwaiti finishing terminology, scannable mobile paragraphs.
7. **Stage G & H: Kuwait Localization & Pricing Safeguards** -> Transparent price frameworks (KWD / د.ك), no invented official prices, clear assumptions.
8. **Stage I: Technical & Safety Review** -> Chemical/substrate compatibility, moisture source diagnostics, no painting over active mold/leaks.
9. **Stage K & L: On-Page SEO & Internal Linking** -> Title, description, slug, alt texts, JSON-LD schemas, contextual links to `/services-guide`, `/request-quote`.
10. **Stage N: Editorial QA Audit** -> Weighted scoring (Gate: Overall >= 90%, Factual >= 95%, Research >= 85%).

---

## 📦 Batch Execution Schedule

- **Batch 1 (Active)**: `ARTICLE-01` to `ARTICLE-05` — Painting Prices & Finishing Costs.
- **Batch 2**: `ARTICLE-06` to `ARTICLE-10` — Wooden Doors & Extreme Climate/Moisture.
- **Batch 3**: `ARTICLE-11` to `ARTICLE-15` — Bathrooms, Old Putty, Sheens, Colors & Italian Stucco.
- **Batch 4**: `ARTICLE-16` to `ARTICLE-20` — Moldings, Wallpapers, Low-VOC, Al-Mutlaa & Sigma Types.
- **Batch 5**: `ARTICLE-21` to `ARTICLE-25` — Sequences, Boundary Walls, Roofs, Metal & Scam Prevention.
- **Batch 6**: `ARTICLE-26` to `ARTICLE-30` — Painter Selection, Handover Checks, Rentals, Cladding & Lighting.

---

## 🛡️ Anti-Hallucination & Compliance Policy

- **No Fake Prices**: All pricing estimates are labeled as indicative ranges based on Kuwait building suppliers (Jawad Al-Saffar, Tashtebat, local contractor surveys) and require on-site measurement.
- **No Fabricated Local Entities**: Only verified geographic locations, materials, and established industrial districts (e.g. Shuwaikh Industrial, Fahaheel, Al-Mutlaa) are referenced.
- **No Manipulative SEO**: No keyword stuffing, hidden text, or promises of guaranteed Google rankings.
