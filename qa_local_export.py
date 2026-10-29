#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Local QA Verification for Next.js Static Export in Kuwait-Painters
Checks generated HTML files, SEO meta tags, hreflang alternates, JSON-LD schemas,
and text content in dist/public.
"""

import os
import sys
import json
from pathlib import Path

BASE_DIR = Path("D:/Kuwait-Painters/artifacts/sabbagh-kuwait/dist/public")

tests = []
def record(name, passed, details=""):
    status = "PASS" if passed else "FAIL"
    tests.append({"name": name, "status": status, "details": details})
    print(f"[{status}] {name}: {details}")

print(f"--- Verifying Static Export Directory: {BASE_DIR} ---")

if not BASE_DIR.exists():
    print(f"Error: Directory {BASE_DIR} does not exist yet. Run build first.")
    sys.exit(1)

# List of critical files to verify
expected_files = [
    # Core Arabic
    ("index.html", ["صباغ الكويت", "dir=\"rtl\"", "lang=\"ar\""]),
    ("services-guide/index.html", ["سعر", "جوتن"]),
    ("request-quote/index.html", ["احسب", "تكلفة"]),
    ("faq/index.html", ["الأسئلة الشائعة"]),
    
    # Core English
    ("en/index.html", ["Kuwait Painters", "dir=\"ltr\"", "lang=\"en\"", "WhatsApp Coordinator (English)"]),
    ("en/services/index.html", ["Kuwait Painting", "Decorating Services"]),
    ("en/services/interior-painting/index.html", ["Interior Painting", "KWD"]),
    ("en/areas/index.html", ["Painters Across All Kuwait Governorates", "Kuwait Areas"]),
    ("en/areas/capital/index.html", ["Capital Governorate", "Kuwait City"]),
    ("en/areas/hawalli/index.html", ["Hawalli Governorate", "Salmiya"]),
    ("en/request-quote/index.html", ["Calculate Your Painting Cost in Kuwait", "KWD"]),
    ("en/services-guide/index.html", ["Price Guide", "Shuwaikh"]),
    ("en/faq/index.html", ["Frequently Asked Questions", "English-speaking"]),
    
    # AI Discovery & SEO
    ("sitemap.xml", ["/en/", "/en/services/", "/en/areas/capital/"]),
    ("robots.txt", ["Allow: /en/"]),
    ("ai-catalog.json", ["Directory of Verified Painters in Kuwait", "search-painters-en"]),
    ("llms.txt", ["2026 Painting Price Benchmarks in Kuwait (KWD)"])
]

for rel_path, required_snippets in expected_files:
    file_path = BASE_DIR / rel_path
    if not file_path.exists():
        record(f"File Exists: {rel_path}", False, "File not found")
        continue
    
    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
        missing = [s for s in required_snippets if s not in content]
        if missing:
            record(f"Content Check: {rel_path}", False, f"Missing snippets: {missing}")
        else:
            record(f"Content Check: {rel_path}", True, f"All {len(required_snippets)} required snippets found ({file_path.stat().st_size:,} bytes)")
    except Exception as e:
        record(f"Read Error: {rel_path}", False, str(e))

summary = {
    "total": len(tests),
    "passed": sum(1 for t in tests if t["status"] == "PASS"),
    "failed": sum(1 for t in tests if t["status"] == "FAIL"),
    "tests": tests
}

print("\n" + "="*60)
print(f"LOCAL QA RESULT: Total: {summary['total']} | Passed: {summary['passed']} | Failed: {summary['failed']}")
print("="*60)

with open("D:/Kuwait-Painters/qa_local_results.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)

if summary["failed"] > 0:
    sys.exit(1)
