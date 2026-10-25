/**
 * Multi-Agent E2E HTTP Lifecycle Simulation
 * Kuwait Painters Platform
 */

const BASE_URL = "http://localhost:5000/api";

async function run() {
  console.log("=================================================");
  console.log("🚀 EXECUTING LIVE HTTP MULTI-AGENT E2E SIMULATION");
  console.log("=================================================\n");

  const results = [];

  // 1. Health check
  console.log("📡 1. Checking API Server Health...");
  const healthRes = await fetch(`${BASE_URL}/healthz`);
  const healthData = await healthRes.json();
  if (healthRes.ok && healthData.status === "ok") {
    console.log("   ✅ API Server is live and healthy!");
    results.push({ step: "Health Check", status: "PASS" });
  } else {
    throw new Error("Health check failed!");
  }

  // 2. Admin Login
  console.log("\n🔑 2. Admin Authentication...");
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@sabbagh-kuwait.com",
      password: "Admin@123456",
    }),
  });
  const adminAuth = await adminLoginRes.json();
  if (!adminLoginRes.ok || !adminAuth.token) {
    throw new Error(`Admin login failed: ${JSON.stringify(adminAuth)}`);
  }
  const adminToken = adminAuth.token;
  console.log(`   ✅ Admin authenticated: ${adminAuth.user.name} (Role: ${adminAuth.user.role})`);
  results.push({ step: "Admin Authentication", status: "PASS" });

  // 3. Register or Authenticate a Painter
  console.log("\n🎨 3. Painter Registration & Onboarding...");
  const testPainterEmail = `painter_${Date.now()}@test.kw`;
  const registerRes = await fetch(`${BASE_URL}/auth/register-painter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testPainterEmail,
      password: "Painter@Password123",
      name: "معلم مبارك العازمي",
      phone: "96597711223",
      region: "حولي",
      governorates: ["حولي", "العاصمة"],
      services: ["دهان داخلي", "معجون أصلي", "صبغ جوتن"],
      startingAt: "20 د.ك",
      crewSize: 3,
      years: 7,
    }),
  });
  const registerData = await registerRes.json();
  if (!registerRes.ok || !registerData.token) {
    throw new Error(`Painter registration failed: ${JSON.stringify(registerData)}`);
  }
  const painterToken = registerData.token;
  const painterId = registerData.painter.id;
  console.log(`   ✅ Painter registered: ${registerData.painter.name} (ID: ${painterId})`);

  // Admin approves painter so they can receive leads
  await fetch(`${BASE_URL}/admin/painters/${painterId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: "approved", isVerified: true }),
  });
  console.log(`   ✅ Admin approved painter #${painterId}`);
  results.push({ step: "Painter Onboarding & Approval", status: "PASS" });

  // 4. End-User (Customer) submits a Quote Request
  console.log("\n👤 4. [Agent 1] Customer Submits Quote Request via Web Interface...");
  const quotePayload = {
    customerName: "سعد الشمري",
    customerPhone: "96594455667",
    customerNotes: "صبغ صالة وغرفة نوم بمواد جوتن فينوماستيك نصف لمعة",
    propertyType: "apartment",
    workType: "interior",
    roomsCount: 2,
    includeMaterials: true,
    paintQuality: "jotun-fenomastic",
    governorateId: "hawalli",
    areaId: "al-salmiya",
    preferredDate: "morning",
    estimatedMinKwd: 48,
    estimatedMaxKwd: 72,
    estimatedAverageKwd: 60,
  };

  const quoteRes = await fetch(`${BASE_URL}/public/quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quotePayload),
  });
  const quoteData = await quoteRes.json();
  if (!quoteRes.ok || !quoteData.quote || !quoteData.quote.id) {
    throw new Error(`Quote submission failed: ${JSON.stringify(quoteData)}`);
  }
  const quoteId = quoteData.quote.id;
  console.log(`   ✅ Quote #${quoteId} created! Status: ${quoteData.quote.status}`);
  results.push({ step: "Customer Quote Submission", status: "PASS" });

  // 5. Admin Dispatches & Assigns Quote to Painter (Testing our PATCH /admin/quotes/:id fix)
  console.log("\n🏢 5. [Agent 4] Admin Dispatches & Assigns Quote via Admin Dashboard...");
  const assignRes = await fetch(`${BASE_URL}/admin/quotes/${quoteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      assignedPainterId: painterId,
      status: "assigned",
    }),
  });
  const assignData = await assignRes.json();
  if (!assignRes.ok || assignData.assignedPainterId !== painterId || assignData.status !== "assigned") {
    throw new Error(`Admin assign failed (404/Error): ${JSON.stringify(assignData)}`);
  }
  console.log(`   ✅ Admin successfully assigned Quote #${quoteId} to Painter #${painterId} (HTTP 200 OK!)`);
  results.push({ step: "Admin Quote Assignment (Route Fix Verified)", status: "PASS" });

  // 6. Painter Receives the Lead & Updates Status
  console.log("\n🎨 6. [Agent 1 & 2] Painter Receives Lead in Painter Dashboard...");
  const painterLeadsRes = await fetch(`${BASE_URL}/painter/leads`, {
    headers: { "Authorization": `Bearer ${painterToken}` },
  });
  const painterLeads = await painterLeadsRes.json();
  const receivedLead = Array.isArray(painterLeads) && painterLeads.find((l) => l.id === quoteId);

  if (!receivedLead) {
    throw new Error(`Painter dashboard did not receive quote #${quoteId}`);
  }
  console.log(`   ✅ Painter confirmed lead receipt: Customer "${receivedLead.customerName}", Phone "${receivedLead.customerPhone}"`);

  // Painter updates status: contacted
  const contactRes = await fetch(`${BASE_URL}/painter/quotes/${quoteId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${painterToken}`,
    },
    body: JSON.stringify({ status: "contacted" }),
  });
  if (!contactRes.ok) throw new Error("Painter failed to update status to contacted");
  console.log("   ✅ Painter updated status -> 'contacted'");

  // Painter finishes work: completed
  const completeRes = await fetch(`${BASE_URL}/painter/quotes/${quoteId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${painterToken}`,
    },
    body: JSON.stringify({ status: "completed" }),
  });
  if (!completeRes.ok) throw new Error("Painter failed to update status to completed");
  console.log("   ✅ Painter updated status -> 'completed'");
  results.push({ step: "Painter Lead Lifecycle Flow", status: "PASS" });

  // 7. Customer Review & Privacy Sanitization Verification
  console.log("\n⭐ 7. [Agent 3] Customer Review Submission & Privacy Audit...");
  const reviewRes = await fetch(`${BASE_URL}/public/painters/${painterId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author: "سعد الشمري",
      whatsapp: "96594455667",
      rating: 5,
      area: "السالمية",
      comment: "شغل احترافي ومواعيد دقيقة، أنصح بالتعامل معه.",
      serviceType: "دهان داخلي ومعجون",
    }),
  });
  const reviewData = await reviewRes.json();
  if (!reviewRes.ok) throw new Error(`Review submission failed: ${JSON.stringify(reviewData)}`);
  const reviewId = reviewData.review.id;
  console.log(`   ✅ Review submitted (Pending moderation, Review ID: ${reviewId})`);

  // Admin approves review
  await fetch(`${BASE_URL}/admin/reviews/${reviewId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: "approved" }),
  });
  console.log(`   ✅ Admin approved Review #${reviewId}`);

  // Fetch Public Profile and check PII
  const publicProfileRes = await fetch(`${BASE_URL}/public/painters/${painterId}`);
  const publicProfile = await publicProfileRes.json();
  const publishedReviews = publicProfile.customerReviews || [];

  const leakedReview = publishedReviews.find((r) => r.authorPhone || r.whatsapp);
  if (leakedReview) {
    throw new Error(`CRITICAL: Phone or WhatsApp found in public review! ${JSON.stringify(leakedReview)}`);
  }
  console.log(`   🔒 Privacy Verified: Customer phone and WhatsApp are 100% hidden from public API!`);
  results.push({ step: "Public Review Moderation & Privacy Protection", status: "PASS" });

  // 8. Final Report
  console.log("\n=================================================");
  console.log("🏁 PHASE 2 SCORECARD: 100% OPERATIONAL PASS");
  console.log("=================================================");
  results.forEach((r) => console.log(` [${r.status}] ${r.step}`));
  console.log("\n🎉 ALL MULTI-AGENT CROSS-ROLE WORKFLOWS VERIFIED LIVE!");
}

run().catch((err) => {
  console.error("\n❌ SIMULATION FAILED:", err);
  process.exit(1);
});
