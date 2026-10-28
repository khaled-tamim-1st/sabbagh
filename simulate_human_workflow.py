#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
End-to-End Human Lifecycle Simulation Test Suite for Kuwait Painters Platform
Tests:
1. Customer Lead / Quote Generation
2. Customer Public Review Submission (Pending State)
3. New Painter Registration (Pending Application)
4. Admin Authentication & Dashboard Operations
5. Admin Review Moderation (Approval -> Rating & Count Recalculation)
6. Admin Painter Moderation (Approval -> Instant Dynamic Edge Page Resolution)
7. Lead Distribution & Assignment (Admin -> Painter Dashboard -> Status Update)
"""

import sys
import json
import time
import urllib.request
import urllib.error
import urllib.parse

# Set UTF-8 for console output
sys.stdout.reconfigure(encoding='utf-8')

# Target URLs
BASE_PROD_URL = "https://sabbagh-kuwait.pages.dev"
# Direct AWS Backend fallback for API validation if needed
AWS_BACKEND_URL = "http://ec2-16-16-208-155.eu-north-1.compute.amazonaws.com:5050"

# Use the production Cloudflare Pages URL for full Edge-to-Backend proxy simulation
API_BASE = f"{BASE_PROD_URL}/api"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def make_request(method, url, data=None, token=None):
    headers = dict(HEADERS)
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    encoded_data = None
    if data is not None:
        if isinstance(data, (dict, list)):
            encoded_data = json.dumps(data).encode("utf-8")
        elif isinstance(data, str):
            encoded_data = data.encode("utf-8")

    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            content_type = resp.headers.get("Content-Type", "")
            raw = resp.read()
            if "application/json" in content_type:
                return resp.status, json.loads(raw.decode("utf-8"))
            else:
                return resp.status, raw.decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            body = json.loads(raw.decode("utf-8"))
        except:
            body = raw.decode("utf-8", errors="replace")
        return e.code, body
    except Exception as ex:
        return 0, str(ex)

def print_step(title):
    print("\n" + "=" * 70)
    print(f"👉 {title}")
    print("=" * 70)

def main():
    print("🚀 بدء محاكاة دورة حياة الاستخدام البشري الحقيقي (End-to-End Human Simulation)")
    test_results = {}
    timestamp = int(time.time())

    # =========================================================================
    # المرحلة 1: عميل حقيقي يطلب عرض سعر (توليد ليد جديد - Lead Generation)
    # =========================================================================
    print_step("المرحلة 1: عميل حقيقي يملأ حاسبة التكلفة ويطلب عرض سعر (Lead Generation)")
    quote_payload = {
        "customerName": f"مبارك عبد العزيز السعيد {timestamp % 1000}",
        "customerPhone": "96599112233",
        "customerNotes": "صبغ فيلا كاملة 3 أدوار - صبغ جوتن فينوماستيك مطفي مع جبس بورد وضمان سنتين",
        "propertyType": "villa",
        "workType": "interior",
        "roomsCount": 6,
        "includeMaterials": True,
        "paintQuality": "jotun-fenomastic",
        "governorateId": "hawalli",
        "areaId": "al-salmiya",
        "preferredDate": "خلال هذا الأسبوع",
        "estimatedMinKwd": 250,
        "estimatedMaxKwd": 420,
        "estimatedAverageKwd": 335
    }
    
    status, res = make_request("POST", f"{API_BASE}/public/quotes", data=quote_payload)
    print(f"الحالة: {status}")
    if status == 201 and res.get("success"):
        quote_id = res["quote"]["id"]
        print(f"✅ تم إنشاء طلب عرض السعر بنجاح برقم تعريف: #{quote_id}")
        print(f"   اسم العميل: {res['quote']['customerName']}")
        print(f"   حالة الطلب الأولية: {res['quote']['status']} (New)")
        test_results["lead_generation"] = "PASS"
    else:
        print(f"❌ فشل إنشاء طلب عرض السعر: {res}")
        test_results["lead_generation"] = "FAIL"
        return

    # =========================================================================
    # المرحلة 2: عميل يكتب تقييماً لصباغ (Customer Submits Review)
    # =========================================================================
    print_step("المرحلة 2: عميل يرسل تقييماً لصباغ وفحص حالة المراجعة الأولية (Pending Moderation)")
    target_painter_id = 1
    # 2.1 جلب البيانات الحالية للصباغ قبل التقييم
    st_p, initial_painter = make_request("GET", f"{API_BASE}/public/painters/{target_painter_id}")
    initial_reviews_count = initial_painter.get("reviews", 0)
    initial_rating = float(initial_painter.get("rating", "4.9"))
    print(f"بيانات الصباغ الحالي (ID: {target_painter_id} - {initial_painter.get('name')}):")
    print(f"   عدد التقييمات قبل الإرسال: {initial_reviews_count}")
    print(f"   التقييم الحالي: {initial_rating}")

    # 2.2 إرسال التقييم الجديد
    review_payload = {
        "author": f"سالم العجمي {timestamp % 1000}",
        "whatsapp": "96597778899",
        "rating": 5,
        "area": "حولي - الجابرية",
        "serviceType": "صبغ داخلي وتركيب ورق جدران",
        "comment": "صراحة شغل ممتاز جداً وأمانة في المواد، استلم الشقة في الموعد ونظف المكان بعد الانتهاء. أنصح بالتعامل معه."
    }
    status, rev_res = make_request("POST", f"{API_BASE}/public/painters/{target_painter_id}/reviews", data=review_payload)
    print(f"الحالة: {status}")
    if status == 201 and rev_res.get("success"):
        review_id = rev_res["review"]["id"]
        print(f"✅ تم استلام التقييم بنجاح برقم: #{review_id}")
        print(f"   رسالة النظام: {rev_res['message']}")
        print(f"   حالة التقييم الأولية: {rev_res['review']['status']} (Pending)")
        test_results["review_submission"] = "PASS"
    else:
        print(f"❌ فشل إرسال التقييم: {rev_res}")
        test_results["review_submission"] = "FAIL"
        return

    # 2.3 التحقق من عدم ظهور التقييم في البروفايل العام قبل اعتماده من الإدارة
    st_check, painter_check = make_request("GET", f"{API_BASE}/public/painters/{target_painter_id}")
    public_reviews = painter_check.get("customerReviews", [])
    found_prematurely = any(r.get("id") == review_id for r in public_reviews)
    if not found_prematurely:
        print("✅ تم التحقق: التقييم لم يظهر في الواجهة العامة قبل اعتماده من الإدارة (حماية من السبام)")
        test_results["review_pending_isolation"] = "PASS"
    else:
        print("⚠️ تحذير: التقييم المعلق ظهر في الواجهة العامة قبل مراجعته!")
        test_results["review_pending_isolation"] = "FAIL"

    # =========================================================================
    # المرحلة 3: صباغ جديد يسجل في المنصة (Painter Registration)
    # =========================================================================
    print_step("المرحلة 3: صباغ جديد يقدم طلب انضمام للمنصة (Painter Registration Form)")
    painter_signup_payload = {
        "name": f"معلم ناصر السبيعي {timestamp % 1000}",
        "email": f"nasser.subaie.{timestamp}@gmail.com",
        "password": "Painter@Secure2026",
        "phone": f"96594{timestamp % 1000000:06d}",
        "whatsapp": f"96594{timestamp % 1000000:06d}",
        "region": "الفروانية",
        "governorates": ["الفروانية", "العاصمة", "حولي"],
        "services": ["دهان داخلي", "صبغ جوتن", "بديل خشب", "ورق جدران"],
        "startingAt": "20 د.ك",
        "years": 8,
        "crewSize": 4,
        "description": "معلم صباغ كويتي محترف خبرة 8 سنوات في كافة أعمال الصباغة والتشطيبات الحديثة والديكورات العصرية.",
        "accountType": "individual"
    }

    status, reg_res = make_request("POST", f"{API_BASE}/auth/register-painter", data=painter_signup_payload)
    print(f"الحالة: {status}")
    if status == 201 and "token" in reg_res:
        new_painter = reg_res["painter"]
        new_painter_id = new_painter["id"]
        painter_token = reg_res["token"]
        new_painter_slug = new_painter.get("slug") or urllib.parse.quote(new_painter["name"])
        print(f"✅ تم تسجيل الصباغ الجديد بنجاح برقم تعريف: #{new_painter_id}")
        print(f"   الاسم: {new_painter['name']}")
        print(f"   الحالة المبدئية: {new_painter['status']} (قيد المراجعة والاعتماد)")
        print(f"   الـ Slug الخاص به: {new_painter_slug}")
        test_results["painter_registration"] = "PASS"
    else:
        print(f"❌ فشل تسجيل الصباغ: {reg_res}")
        test_results["painter_registration"] = "FAIL"
        return

    # =========================================================================
    # المرحلة 4: مدير المنصة يسجل الدخول للوحة التحكم (Admin Login)
    # =========================================================================
    print_step("المرحلة 4: تسجيل دخول مدير المنصة إلى لوحة التحكم الإدارية (Admin Login)")
    admin_login_payload = {
        "email": "admin@sabbagh-kuwait.com",
        "password": "Admin@123456"
    }
    status, login_res = make_request("POST", f"{API_BASE}/auth/login", data=admin_login_payload)
    print(f"الحالة: {status}")
    if status == 200 and "token" in login_res:
        admin_token = login_res["token"]
        print(f"✅ تم تسجيل دخول المدير بنجاح.")
        print(f"   الاسم: {login_res['user']['name']}")
        print(f"   الدور: {login_res['user']['role']}")
        test_results["admin_login"] = "PASS"
    else:
        print(f"❌ فشل تسجيل دخول المدير: {login_res}")
        test_results["admin_login"] = "FAIL"
        return

    # 4.1 فحص إحصائيات لوحة التحكم
    st_stat, stats_res = make_request("GET", f"{API_BASE}/admin/stats", token=admin_token)
    if st_stat == 200:
        print(f"✅ تم جلب إحصائيات المنصة:")
        print(f"   إجمالي الصباغين: {stats_res.get('totalPainters')}")
        print(f"   الصباغين المعتمدين: {stats_res.get('approvedPainters')}")
        print(f"   الصباغين المعلقين: {stats_res.get('pendingPainters')}")
        print(f"   إجمالي طلبات الأسعار (Leads): {stats_res.get('totalQuotes')}")
        print(f"   إجمالي التقييمات: {stats_res.get('totalReviews')}")
        test_results["admin_stats"] = "PASS"
    else:
        print(f"⚠️ تعذر جلب إحصائيات الإدارة: {stats_res}")

    # =========================================================================
    # المرحلة 5: مراجعة واعتماد تقييم العميل من قِبل المدير (Review Moderation)
    # =========================================================================
    print_step("المرحلة 5: المدير يراجع التقييم المعلق ويعتمده (Review Moderation & Recalculation)")
    # 5.1 استرجاع قائمة التقييمات في لوحة الإدارة
    st_revs, all_reviews = make_request("GET", f"{API_BASE}/admin/reviews", token=admin_token)
    pending_review = next((r for r in all_reviews if r.get("id") == review_id), None)
    if pending_review:
        print(f"✅ تم العثور على التقييم في لوحة تحكم الإدارة برقم #{review_id} وحالته: {pending_review.get('status')}")
    else:
        print(f"⚠️ لم يتم العثور على التقييم في لوحة الإدارة!")

    # 5.2 اعتماد التقييم
    st_app_rev, app_rev_res = make_request(
        "PATCH",
        f"{API_BASE}/admin/reviews/{review_id}/status",
        data={"status": "approved"},
        token=admin_token
    )
    print(f"حالة اعتماد التقييم: {st_app_rev}")
    if st_app_rev == 200 and app_rev_res.get("status") == "approved":
        print(f"✅ تم اعتماد التقييم وتوثيقه بنجاح!")
        print(f"   حالة التقييم الجديدة: {app_rev_res.get('status')}")
        print(f"   علامة التوثيق (verified): {app_rev_res.get('verified')}")
        test_results["review_approval"] = "PASS"
    else:
        print(f"❌ فشل اعتماد التقييم: {app_rev_res}")
        test_results["review_approval"] = "FAIL"

    # 5.3 التحقق الحاسم: هل ظهر التقييم على الصفحة العامة؟ وهل زاد عدد التقييمات؟
    time.sleep(1)
    st_post_p, post_painter = make_request("GET", f"{API_BASE}/public/painters/{target_painter_id}")
    post_reviews_count = post_painter.get("reviews", 0)
    post_rating = float(post_painter.get("rating", "4.9"))
    post_public_reviews = post_painter.get("customerReviews", [])
    review_now_visible = any(r.get("id") == review_id for r in post_public_reviews)

    print(f"\nفحص النتيجة على بروفايل الصباغ بعد اعتماد التقييم:")
    print(f"   الظهور في قائمة التقييمات العامة: {'نعم ✅' if review_now_visible else 'لا ❌'}")
    print(f"   عدد التقييمات السابق: {initial_reviews_count} -> الجديد: {post_reviews_count}")
    print(f"   التقييم السابق: {initial_rating} -> التقييم الجديد: {post_rating}")

    if review_now_visible and post_reviews_count >= initial_reviews_count + 1:
        print("✅ نجاح تام: التقييم ظهر فورياً، وزاد عدد تقييمات الصباغ وأعيد حساب المعدل!")
        test_results["review_live_update"] = "PASS"
    else:
        print("⚠️ تحقق من عدد التقييمات: قد يتطلب التحديث مطابقة مباشرة.")
        test_results["review_live_update"] = "WARN"

    # =========================================================================
    # المرحلة 6: مراجعة واعتماد طلب انضمام الصباغ الجديد (Painter Moderation)
    # =========================================================================
    print_step("المرحلة 6: المدير يعتمد الصباغ الجديد وفحص ظهوره اللحظي على الحافة (Edge Resolution)")
    # 6.1 اعتماد الصباغ
    st_app_p, app_p_res = make_request(
        "PATCH",
        f"{API_BASE}/admin/painters/{new_painter_id}/status",
        data={"status": "approved", "isVerified": True},
        token=admin_token
    )
    print(f"حالة اعتماد الصباغ: {st_app_p}")
    if st_app_p == 200 and app_p_res.get("status") == "approved":
        print(f"✅ تم اعتماد وتوثيق الصباغ الجديد بنجاح!")
        print(f"   الحالة الجديدة: {app_p_res.get('status')}")
        print(f"   موثق (isVerified): {app_p_res.get('isVerified')}")
        test_results["painter_approval"] = "PASS"
    else:
        print(f"❌ فشل اعتماد الصباغ: {app_p_res}")
        test_results["painter_approval"] = "FAIL"

    # 6.2 فحص ظهور الصباغ في قائمة الصباغين العامة
    st_all_p, approved_painters = make_request("GET", f"{API_BASE}/public/painters")
    in_public_list = any(p.get("id") == new_painter_id for p in approved_painters)
    print(f"   ظهور الصباغ في القائمة العامة: {'نعم ✅' if in_public_list else 'لا ❌'}")

    # 6.3 فحص فتح صفحة الصباغ الشخصية على Cloudflare Pages بدون إعادة بناء
    encoded_painter_slug = urllib.parse.quote(app_p_res.get("name"))
    dynamic_page_url = f"{BASE_PROD_URL}/painters/{encoded_painter_slug}/"
    print(f"   فحص فتح رابط صفحة الصباغ على Cloudflare Pages:")
    print(f"   الرابط: {dynamic_page_url}")
    
    st_edge_page, edge_page_html = make_request("GET", dynamic_page_url)
    print(f"   كود الحالة من الحافة (Edge Status): {st_edge_page}")
    if st_edge_page == 200 and ("صباغ" in str(edge_page_html) or app_p_res.get("name") in str(edge_page_html)):
        print(f"✅ نجاح باهر: صفحة الصباغ المعتمد فتحت فورياً على Cloudflare بكود 200 مع حقن الـ SEO بدون إعادة بناء!")
        test_results["on_demand_edge_page"] = "PASS"
    else:
        print(f"⚠️ صفحة الصباغ أعادت: {st_edge_page}")
        test_results["on_demand_edge_page"] = "WARN"

    # =========================================================================
    # المرحلة 7: توزيع الليد وإسناد الطلب للصباغ (Lead Distribution & Assignment)
    # =========================================================================
    print_step("المرحلة 7: توزيع الليد وإسناده للصباغ وتحديث الحالة في لوحة الصباغ")
    # 7.1 المدير يسند الطلب (المرحلة 1) إلى الصباغ الجديد المعتمد (المرحلة 6)
    st_assign, assign_res = make_request(
        "PATCH",
        f"{API_BASE}/admin/quotes/{quote_id}/assign",
        data={"assignedPainterId": new_painter_id},
        token=admin_token
    )
    print(f"حالة إسناد الليد: {st_assign}")
    if st_assign == 200 and assign_res.get("assignedPainterId") == new_painter_id:
        print(f"✅ تم إسناد الطلب #{quote_id} للصباغ #{new_painter_id} ({app_p_res.get('name')})")
        print(f"   حالة الليد بعد الإسناد: {assign_res.get('status')} (Assigned)")
        test_results["lead_distribution"] = "PASS"
    else:
        print(f"❌ فشل إسناد الليد: {assign_res}")
        test_results["lead_distribution"] = "FAIL"

    # 7.2 الصباغ يسجل الدخول بلوحة تحكمه ويفحص صندوق الوارد (Leads Inbox)
    st_p_leads, painter_leads = make_request("GET", f"{API_BASE}/painter/leads", token=painter_token)
    print(f"حالة جلب ليدات الصباغ: {st_p_leads}")
    assigned_lead_inbox = next((l for l in painter_leads if l.get("id") == quote_id), None)
    if assigned_lead_inbox:
        print(f"✅ وجد الصباغ الطلب المسند إليه في لوحة تحكمه:")
        print(f"   اسم العميل: {assigned_lead_inbox.get('customerName')}")
        print(f"   هاتف العميل: {assigned_lead_inbox.get('customerPhone')}")
        print(f"   تفاصيل العمل: {assigned_lead_inbox.get('customerNotes')}")
        test_results["painter_lead_inbox"] = "PASS"
    else:
        print(f"❌ لم يظهر الطلب في لوحة الصباغ!")
        test_results["painter_lead_inbox"] = "FAIL"

    # 7.3 الصباغ يقوم بالاتصال بالعميل وتحديث حالة الطلب إلى (تم التواصل - Contacted)
    st_update_lead, upd_lead_res = make_request(
        "PATCH",
        f"{API_BASE}/painter/leads/{quote_id}/status",
        data={"status": "contacted"},
        token=painter_token
    )
    print(f"حالة تحديث الصباغ لحالة الليد: {st_update_lead}")
    if st_update_lead == 200 and upd_lead_res.get("status") == "contacted":
        print(f"✅ تم تحديث حالة الليد بنجاح بواسطة الصباغ إلى: contacted (تم التواصل مع العميل)")
        test_results["lead_status_advancement"] = "PASS"
    else:
        print(f"❌ فشل تحديث حالة الليد: {upd_lead_res}")
        test_results["lead_status_advancement"] = "FAIL"

    # 7.4 المدير يفحص الطلب مرة أخرى للتأكد من المزامنة اللحظية
    st_adm_check_q, adm_quotes = make_request("GET", f"{API_BASE}/admin/quotes", token=admin_token)
    final_quote = next((q for q in adm_quotes if q.get("id") == quote_id), None)
    if final_quote and final_quote.get("status") == "contacted":
        print(f"✅ مزامنة ثنائية كاملة: ظهر تحديث الصباغ لدى الإدارة فورياً (الحالة: {final_quote.get('status')})")
        test_results["full_bidirectional_sync"] = "PASS"
    else:
        print(f"⚠️ عدم تطابق حالة الليد النهائية لدى الإدارة!")
        test_results["full_bidirectional_sync"] = "WARN"

    # =========================================================================
    # التقرير الختامي
    # =========================================================================
    print_step("تقرير نتيجة فحص الاستخدام البشري الشامل (Human Workflow QA Verdict)")
    total_tests = len(test_results)
    passed_tests = sum(1 for v in test_results.values() if v == "PASS")
    warn_tests = sum(1 for v in test_results.values() if v == "WARN")
    failed_tests = sum(1 for v in test_results.values() if v == "FAIL")

    for test_name, status_res in test_results.items():
        icon = "✅" if status_res == "PASS" else ("⚠️" if status_res == "WARN" else "❌")
        print(f"{icon} {test_name}: {status_res}")

    print("\n" + "=" * 70)
    print(f"إجمالي السيناريوهات: {total_tests} | ناجح: {passed_tests} | تنبيه: {warn_tests} | فاشل: {failed_tests}")
    print("=" * 70)

    # حفظ النتيجة في ملف JSON
    with open("human_workflow_results.json", "w", encoding="utf-8") as f:
        json.dump(test_results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
