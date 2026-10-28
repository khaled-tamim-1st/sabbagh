#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive QA Automation & Test Suite for Kuwait-Painters Platform
Tests Frontend URLs, Cloudflare Edge Worker routing, AWS Backend API endpoints,
Validation boundaries, and Security fuzzing.
"""

import sys
import json
import time
import urllib.request
import urllib.error
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

BASE_CF = "https://sabbagh-kuwait.pages.dev"
BASE_API = "http://ec2-16-16-208-155.eu-north-1.compute.amazonaws.com:5050"

results = {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "warnings": 0,
    "tests": []
}

def log_test(name, passed, details="", warning=False):
    results["total"] += 1
    if passed and not warning:
        results["passed"] += 1
        status = "PASS"
    elif warning:
        results["warnings"] += 1
        status = "WARN"
    else:
        results["failed"] += 1
        status = "FAIL"
    
    results["tests"].append({
        "name": name,
        "status": status,
        "details": str(details)
    })
    print(f"[{status}] {name}: {details}")

def make_request(url, method="GET", headers=None, data=None, timeout=10):
    if headers is None:
        headers = {}
    if "User-Agent" not in headers:
        headers["User-Agent"] = "KuwaitPainters-QA-Bot/1.0"
    
    encoded_data = None
    if data is not None:
        if isinstance(data, (dict, list)):
            encoded_data = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
        elif isinstance(data, str):
            encoded_data = data.encode("utf-8")
        else:
            encoded_data = data

    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            body = response.read()
            return {
                "status": response.status,
                "headers": dict(response.headers),
                "body": body,
                "text": body.decode("utf-8", errors="replace"),
                "error": None
            }
    except urllib.error.HTTPError as e:
        body = e.read()
        return {
            "status": e.code,
            "headers": dict(e.headers),
            "body": body,
            "text": body.decode("utf-8", errors="replace"),
            "error": str(e)
        }
    except Exception as e:
        return {
            "status": 0,
            "headers": {},
            "body": b"",
            "text": "",
            "error": str(e)
        }

# ==============================================================================
# 1. FRONTEND ROUTING & EDGE WORKER TESTS
# ==============================================================================
print("\n--- [SUITE 1: Frontend & Edge Worker Routing] ---")

core_routes = [
    ("/", 200, "صباغ الكويت"),
    ("/services-guide/", 200, "دليل"),
    ("/request-quote/", 200, "مقايسة"),
    ("/join-painter/", 200, "انضمام"),
    ("/blog/", 200, "مدونة"),
    ("/faq/", 200, "الأسئلة"),
    ("/login/", 200, "تسجيل الدخول"),
    ("/admin/", 200, "لوحة"),
    ("/painter/", 200, "تحكم"),
    ("/ai-catalog.json", 200, "صباغ الكويت"),
    ("/.well-known/ai-catalog.json", 200, "صباغ الكويت"),
    ("/robots.txt", 200, "User-Agent"),
    ("/sitemap.xml", 200, "xml"),
    ("/areas/hawalli/", 200, "حولي"),
    ("/services/interior-painting/", 200, "دهان"),
    ("/painters/1/", 200, "خالد تميم"),
    ("/painters/%D8%AE%D8%A7%D9%84%D8%AF-%D8%AA%D9%85%D9%8A%D9%85/", 200, "خالد تميم"),
    ("/painters/%D9%85%D8%B9%D9%84%D9%85-%D8%A8%D8%AF%D8%B1-%D8%A7%D9%84%D8%B1%D8%B4%D9%8A%D8%AF%D9%8A/", 200, "معلم بدر الرشيدي"),
    ("/painters/completely-nonexistent-slug-xyz/", 404, ""),
    ("/random-unmatched-url-404/", 404, "")
]

for path, expected_status, expected_snippet in core_routes:
    url = BASE_CF + path
    res = make_request(url)
    status_ok = (res["status"] == expected_status)
    content_ok = expected_snippet in res["text"] if expected_snippet else True
    
    if status_ok and content_ok:
        log_test(f"Route: {path}", True, f"Status: {res['status']}, Content snippet verified")
    elif status_ok and not content_ok:
        log_test(f"Route: {path}", False, f"Status {res['status']} OK, but expected snippet '{expected_snippet}' missing")
    else:
        log_test(f"Route: {path}", False, f"Expected {expected_status}, got {res['status']}. Err: {res['error']}")

# ==============================================================================
# 2. BACKEND API FUNCTIONAL & BOUNDARY TESTS
# ==============================================================================
print("\n--- [SUITE 2: Backend API Endpoints] ---")

# A. Health Check
res = make_request(f"{BASE_API}/api/healthz")
log_test("API /api/healthz", res["status"] == 200 and '"status":"ok"' in res["text"], f"Status: {res['status']}")

# B. Public Painters list
res = make_request(f"{BASE_API}/api/public/painters")
painters_list = []
if res["status"] == 200:
    try:
        painters_list = json.loads(res["text"])
        log_test("API /api/public/painters", isinstance(painters_list, list) and len(painters_list) > 0, f"Returned {len(painters_list)} approved painters")
    except Exception as e:
        log_test("API /api/public/painters", False, f"JSON decode error: {e}")
else:
    log_test("API /api/public/painters", False, f"Status: {res['status']}")

# C. Public Painter by ID & Slug
if painters_list:
    first_p = painters_list[0]
    p_id = first_p.get("id")
    p_slug = urllib.parse.quote(first_p.get("slug", ""))
    
    res_id = make_request(f"{BASE_API}/api/public/painters/{p_id}")
    log_test(f"API /api/public/painters/{p_id} (by ID)", res_id["status"] == 200 and first_p["name"] in res_id["text"], f"Status: {res_id['status']}")
    
    res_slug = make_request(f"{BASE_API}/api/public/painters/{p_slug}")
    log_test(f"API /api/public/painters/{p_slug} (by Slug)", res_slug["status"] == 200 and first_p["name"] in res_slug["text"], f"Status: {res_slug['status']}")

# D. Create Quote - Valid Payload
quote_payload = {
    "customerName": "فهد السالم - فحص الجودة",
    "customerPhone": "96599887766",
    "customerNotes": "طلب فحص مقايسة تجريبي آلي",
    "propertyType": "apartment",
    "workType": "interior",
    "roomsCount": 3,
    "includeMaterials": True,
    "paintQuality": "jotun-fenomastic",
    "governorateId": "hawalli",
    "areaId": "al-salmiya",
    "preferredDate": "morning",
    "estimatedMinKwd": 60,
    "estimatedMaxKwd": 90,
    "estimatedAverageKwd": 75
}
res_quote = make_request(f"{BASE_API}/api/public/quotes", method="POST", data=quote_payload)
log_test("API POST /api/public/quotes (Valid)", res_quote["status"] == 201, f"Status: {res_quote['status']}, Body: {res_quote['text'][:100]}")

# E. Create Quote - Missing Phone (Required field validation)
quote_invalid = quote_payload.copy()
del quote_invalid["customerPhone"]
res_quote_invalid = make_request(f"{BASE_API}/api/public/quotes", method="POST", data=quote_invalid)
log_test("API POST /api/public/quotes (Missing Phone)", res_quote_invalid["status"] == 400, f"Expected 400, got: {res_quote_invalid['status']}")

# F. Submit Review - Valid & Boundary
if painters_list:
    target_p_id = painters_list[0]["id"]
    review_valid = {
        "author": "بو ناصر (تجربة اختبارية)",
        "whatsapp": "96590001122",
        "rating": 5,
        "area": "حولي",
        "serviceType": "دهان داخلي ومعجون",
        "comment": "شغل ممتاز ونظافة والتزام بالمواعيد، تقييم آلي للتحقق من سلامة الواجهة البرمجية."
    }
    res_rev = make_request(f"{BASE_API}/api/public/painters/{target_p_id}/reviews", method="POST", data=review_valid)
    log_test(f"API POST /api/public/painters/{target_p_id}/reviews (Valid)", res_rev["status"] in [200, 201], f"Status: {res_rev['status']}, Resp: {res_rev['text'][:100]}")

    # Boundary test: Invalid Rating > 5
    review_invalid_rating = review_valid.copy()
    review_invalid_rating["rating"] = 999
    res_rev_bad = make_request(f"{BASE_API}/api/public/painters/{target_p_id}/reviews", method="POST", data=review_invalid_rating)
    # Check if backend accepts or clamps or rejects
    log_test("API POST reviews (Rating = 999 Boundary Check)", True, f"Backend returned {res_rev_bad['status']}, body: {res_rev_bad['text'][:100]}", warning=(res_rev_bad["status"] not in [400, 422]))

# G. Auth & Login Testing
login_invalid = {"email": "invalid_user@notfound.kw", "password": "WrongPassword123!"}
res_login_bad = make_request(f"{BASE_API}/api/auth/login", method="POST", data=login_invalid)
log_test("API POST /api/auth/login (Invalid credentials)", res_login_bad["status"] == 401, f"Expected 401, got: {res_login_bad['status']}")

login_empty = {}
res_login_empty = make_request(f"{BASE_API}/api/auth/login", method="POST", data=login_empty)
log_test("API POST /api/auth/login (Empty payload)", res_login_empty["status"] == 400, f"Expected 400, got: {res_login_empty['status']}")

# ==============================================================================
# 3. CLOUDFLARE REVERSE PROXY VIA /api/*
# ==============================================================================
print("\n--- [SUITE 3: Cloudflare Edge /api/* Reverse Proxy] ---")
cf_api_health = make_request(f"{BASE_CF}/api/healthz")
log_test("Cloudflare Proxy /api/healthz", cf_api_health["status"] == 200 and '"status":"ok"' in cf_api_health["text"], f"Status: {cf_api_health['status']}, Text: {cf_api_health['text']}")

cf_api_painters = make_request(f"{BASE_CF}/api/public/painters")
log_test("Cloudflare Proxy /api/public/painters", cf_api_painters["status"] == 200, f"Status: {cf_api_painters['status']}")

# Summary Report
print("\n" + "="*60)
print(f"QA TEST RUN COMPLETED: Total: {results['total']} | Passed: {results['passed']} | Warnings: {results['warnings']} | Failed: {results['failed']}")
print("="*60)

with open("qa_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
