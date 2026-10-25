import { Router, type Request, type Response } from "express";
import { storage } from "@workspace/db";
import { createRateLimiter } from "../middlewares/rate-limiter";

const router = Router();

const quoteLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: "تم تجاوز الحد المسموح لإرسال طلبات الأسعار مؤقتاً، يرجى المحاولة بعد قليل.",
});

const reviewLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: "تم تجاوز الحد المسموح لإرسال التقييمات، يرجى المحاولة لاحقاً.",
});

// POST /quotes
router.post("/quotes", quoteLimiter, (req: Request, res: Response) => {
  const {
    customerName,
    customerPhone,
    customerNotes,
    propertyType,
    workType,
    roomsCount,
    includeMaterials,
    paintQuality,
    governorateId,
    areaId,
    preferredDate,
    estimatedMinKwd,
    estimatedMaxKwd,
    estimatedAverageKwd,
    assignedPainterId,
  } = req.body;

  if (!customerPhone) {
    res.status(400).json({ error: "Customer phone number is required" });
    return;
  }

  const quote = storage.createQuote({
    customerName: customerName || "عميل",
    customerPhone,
    customerNotes: customerNotes || "",
    propertyType: propertyType || "apartment",
    workType: workType || "interior",
    roomsCount: roomsCount ? Number(roomsCount) : 3,
    includeMaterials: includeMaterials !== undefined ? Boolean(includeMaterials) : true,
    paintQuality: paintQuality || "jotun-fenomastic",
    governorateId: governorateId || "hawalli",
    areaId: areaId || "al-salmiya",
    preferredDate: preferredDate || "morning",
    estimatedMinKwd: estimatedMinKwd ? Number(estimatedMinKwd) : 50,
    estimatedMaxKwd: estimatedMaxKwd ? Number(estimatedMaxKwd) : 80,
    estimatedAverageKwd: estimatedAverageKwd ? Number(estimatedAverageKwd) : 65,
    assignedPainterId: assignedPainterId ? Number(assignedPainterId) : null,
  });

  res.status(201).json({ success: true, quote });
});

// GET /painters
router.get("/painters", (req: Request, res: Response) => {
  const { region, search } = req.query as {
    region?: string;
    search?: string;
  };

  const painters = storage.getAllPainters({
    status: "approved",
    region,
    search,
  });

  res.json(painters);
});

// GET /painters/:id
router.get("/painters/:id", (req: Request, res: Response) => {
  const param = decodeURIComponent(req.params.id as string).trim();
  const painter = storage.getPainterBySlugOrId(param);
  if (!painter) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  const reviews = storage.getReviewsByPainterId(painter.id);

  // Sanitize reviews for public view - strip authorPhone and whatsapp
  const sanitizedReviews = reviews.map((r) => ({
    id: r.id,
    painterId: r.painterId,
    author: r.author,
    date: r.date,
    rating: r.rating,
    area: r.area,
    comment: r.comment,
    serviceType: r.serviceType,
    verified: r.verified,
  }));

  res.json({
    ...painter,
    avatarUrl: painter.avatarUrl ?? null,
    avatarPublicId: painter.avatarPublicId ?? null,
    portfolioProjects: painter.portfolioProjects || [],
    reviews: typeof painter.reviews === 'number' ? painter.reviews : (Array.isArray(reviews) ? reviews.length : 0),
    customerReviews: sanitizedReviews,
  });
});

// POST /painters/:id/reviews
router.post("/painters/:id/reviews", reviewLimiter, (req: Request, res: Response) => {
  const param = decodeURIComponent(req.params.id as string).trim();
  const painter = storage.getPainterBySlugOrId(param);
  if (!painter) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  const { author, whatsapp, rating, comment, area, serviceType } = req.body;

  if (!author || !author.trim()) {
    res.status(400).json({ error: "اسم صاحب التقييم مطلوب" });
    return;
  }

  if (!whatsapp || !whatsapp.trim()) {
    res.status(400).json({ error: "رقم الواتساب مطلوب للتحقق من صحة التقييم" });
    return;
  }

  if (!comment || !comment.trim()) {
    res.status(400).json({ error: "نص التقييم وتفاصيل التجربة مطلوبة" });
    return;
  }

  const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));

  const newReview = storage.createReview({
    painterId: painter.id,
    author: author.trim(),
    whatsapp: whatsapp.trim(),
    authorPhone: whatsapp.trim(),
    rating: numericRating,
    comment: comment.trim(),
    area: area ? area.trim() : painter.region,
    serviceType: serviceType ? serviceType.trim() : "صبغ وتشطيب",
    status: "pending",
    verified: false,
  });

  res.status(201).json({
    success: true,
    message: "تم استلام تقييمك بنجاح! سيتم التحقق منه وتوثيقه من قِبل إدارة المنصة قبل نشره على البروفايل لضمان المصداقية.",
    review: {
      id: newReview.id,
      painterId: newReview.painterId,
      author: newReview.author,
      rating: newReview.rating,
      comment: newReview.comment,
      status: newReview.status,
    },
  });
});

// POST /inquiries
router.post("/inquiries", (req: Request, res: Response) => {
  const { customerName, customerPhone, message, painterId } = req.body;

  if (!customerPhone) {
    res.status(400).json({ error: "Customer phone number is required" });
    return;
  }

  const inquiry = storage.createInquiry({
    painterId: painterId ? Number(painterId) : null,
    customerName: customerName || "عميل",
    customerPhone,
    message: message || "",
  });

  res.status(201).json({ success: true, inquiry });
});

export default router;
