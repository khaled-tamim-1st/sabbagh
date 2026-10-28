import { Router, type Request, type Response } from "express";
import { storage } from "@workspace/db";
import { authenticate, requireRole } from "../middlewares/auth";
import {
  uploadPainterAvatar,
  removePainterAvatar,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
} from "../lib/portfolio-service";

const router = Router();

// Protect all admin routes with authentication and admin role check
router.use(authenticate, requireRole(["admin"]));

// GET /stats
router.get("/stats", (_req: Request, res: Response) => {
  const stats = storage.getAdminStats();
  res.json(stats);
});

// GET /painters
router.get("/painters", (req: Request, res: Response) => {
  const { status, region, search } = req.query as {
    status?: string;
    region?: string;
    search?: string;
  };
  const painters = storage.getAllPainters({ status, region, search });
  res.json(painters);
});

// PATCH /painters/:id/verify
router.patch("/painters/:id/verify", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid painter ID" });
    return;
  }

  const { isVerified } = req.body || {};
  if (typeof isVerified !== "boolean") {
    res.status(400).json({ error: "isVerified (boolean) is required in request body" });
    return;
  }

  const updated = storage.setPainterVerified(id, isVerified);
  if (!updated) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  res.json(updated);
});

// PATCH /painters/:id/status
router.patch("/painters/:id/status", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid painter ID" });
    return;
  }

  const { status } = req.body || {};
  const validStatuses = ["approved", "pending", "rejected", "suspended"] as const;
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "status must be one of: approved, pending, rejected, suspended" });
    return;
  }

  const isVerified = req.body.isVerified !== undefined
    ? Boolean(req.body.isVerified)
    : (status === "approved" ? true : undefined);

  let updated = storage.setPainterStatus(id, status);
  if (isVerified !== undefined && updated) {
    updated = storage.setPainterVerified(id, isVerified);
  }

  if (!updated) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  res.json(updated);
});

// PATCH /painters/:id/order
router.patch("/painters/:id/order", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid painter ID" });
    return;
  }

  const { displayOrder } = req.body || {};
  if (typeof displayOrder !== "number") {
    res.status(400).json({ error: "displayOrder (number) is required in request body" });
    return;
  }

  const updated = storage.setPainterDisplayOrder(id, displayOrder);
  if (!updated) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  res.json(updated);
});

// POST /painters/:id/avatar
router.post("/painters/:id/avatar", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid painter ID" });
    return;
  }

  const painter = storage.getPainterById(id);
  if (!painter) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  const image = req.body.image || req.body.avatarUrl;
  if (!image || typeof image !== "string") {
    res.status(400).json({ error: "Image data URI or base64 is required" });
    return;
  }

  try {
    const result = await uploadPainterAvatar(id, image);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to upload avatar" });
  }
});

// DELETE /painters/:id/avatar
router.delete("/painters/:id/avatar", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid painter ID" });
    return;
  }

  const painter = storage.getPainterById(id);
  if (!painter) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  try {
    await removePainterAvatar(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete avatar" });
  }
});

// GET /painters/:id/portfolio
router.get("/painters/:id/portfolio", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid painter ID" });
    return;
  }

  const painter = storage.getPainterById(id);
  if (!painter) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  const portfolio = storage.getPainterPortfolio(id);
  res.json(portfolio);
});

// POST /painters/:id/portfolio
router.post("/painters/:id/portfolio", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid painter ID" });
    return;
  }

  const painter = storage.getPainterById(id);
  if (!painter) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  const { title, category } = req.body;
  if (!title || !category) {
    res.status(400).json({ error: "title and category are required" });
    return;
  }

  try {
    const project = await createPortfolioProject(id, req.body);
    res.status(201).json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create portfolio project" });
  }
});

// PUT /painters/:id/portfolio/:projectId
router.put("/painters/:id/portfolio/:projectId", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid painter ID" });
    return;
  }

  const painter = storage.getPainterById(id);
  if (!painter) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  try {
    const updated = await updatePortfolioProject(id, req.params.projectId as string, req.body);
    res.json(updated);
  } catch (err: any) {
    if (err.message?.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: err.message || "Failed to update portfolio project" });
  }
});

// DELETE /painters/:id/portfolio/:projectId
router.delete("/painters/:id/portfolio/:projectId", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid painter ID" });
    return;
  }

  const painter = storage.getPainterById(id);
  if (!painter) {
    res.status(404).json({ error: "Painter not found" });
    return;
  }

  try {
    await deletePortfolioProject(id, req.params.projectId as string);
    res.json({ success: true });
  } catch (err: any) {
    if (err.message?.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: err.message || "Failed to delete portfolio project" });
  }
});

// GET /quotes
router.get("/quotes", (req: Request, res: Response) => {
  const { status, painterId } = req.query as {
    status?: string;
    painterId?: string;
  };
  const quotes = storage.getAllQuotes({
    status,
    painterId: painterId ? Number(painterId) : undefined,
  });
  res.json(quotes);
});

// PATCH /quotes/:id & /quotes/:id/status
router.patch(["/quotes/:id", "/quotes/:id/status"], (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid quote ID" });
    return;
  }

  const { status, assignedPainterId } = req.body || {};
  if (!status && assignedPainterId === undefined) {
    res.status(400).json({ error: "status or assignedPainterId is required" });
    return;
  }

  const quote = storage.getQuoteById(id);
  if (!quote) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  const resolvedStatus = status || (assignedPainterId ? "assigned" : quote.status);
  const resolvedPainterId = assignedPainterId !== undefined
    ? (assignedPainterId ? Number(assignedPainterId) : null)
    : quote.assignedPainterId;

  const updated = storage.updateQuoteStatus(
    id,
    resolvedStatus,
    resolvedPainterId,
  );

  if (!updated) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  res.json(updated);
});

// PATCH /quotes/:id/assign
router.patch("/quotes/:id/assign", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid quote ID" });
    return;
  }

  const assignedPainterId = req.body.assignedPainterId ?? req.body.painterId;
  if (assignedPainterId === undefined || isNaN(Number(assignedPainterId))) {
    res.status(400).json({ error: "assignedPainterId is required" });
    return;
  }

  const quote = storage.getQuoteById(id);
  if (!quote) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  const updated = storage.updateQuoteStatus(id, "assigned", Number(assignedPainterId));
  res.json(updated);
});

// GET /reviews
router.get("/reviews", (_req: Request, res: Response) => {
  const reviews = storage.getAllReviews();
  res.json(reviews);
});

// PATCH /reviews/:id/status & /reviews/:id
router.patch(["/reviews/:id/status", "/reviews/:id"], (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid review ID" });
    return;
  }

  const { status } = req.body || {};
  const validStatuses = ["approved", "pending", "rejected"] as const;
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "status must be one of: approved, pending, rejected" });
    return;
  }

  const updated = storage.updateReviewStatus(id, status);
  if (!updated) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  res.json(updated);
});

export default router;
