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

// Protect all painter routes with authentication and painter role check
router.use(authenticate, requireRole(["painter"]));

// GET /profile
router.get("/profile", (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  res.json(painter);
});

// PUT /profile
router.put("/profile", (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  const {
    name,
    region,
    startingAt,
    services,
    description,
    phone,
    whatsapp,
    bio,
    governorates,
    paintBrands,
    years,
    crewSize,
    coverageAreaIds,
    primaryGovernorates,
  } = req.body;

  const updated = storage.updatePainter(painter.id, {
    ...(name !== undefined ? { name } : {}),
    ...(region !== undefined ? { region } : {}),
    ...(startingAt !== undefined ? { startingAt } : {}),
    ...(services !== undefined ? { services } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(phone !== undefined ? { phone } : {}),
    ...(whatsapp !== undefined ? { whatsapp } : {}),
    ...(bio !== undefined ? { bio } : {}),
    ...(governorates !== undefined ? { governorates } : {}),
    ...(paintBrands !== undefined ? { paintBrands } : {}),
    ...(years !== undefined ? { years: Number(years) } : {}),
    ...(crewSize !== undefined ? { crewSize: Number(crewSize) } : {}),
    ...(coverageAreaIds !== undefined ? { coverageAreaIds } : {}),
    ...(primaryGovernorates !== undefined ? { primaryGovernorates } : {}),
  });

  res.json(updated);
});

// POST /avatar
router.post("/avatar", async (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  const image = req.body.image || req.body.avatarUrl;
  if (!image || typeof image !== "string") {
    res.status(400).json({ error: "Image data URI or base64 is required" });
    return;
  }

  try {
    const result = await uploadPainterAvatar(painter.id, image);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to upload avatar" });
  }
});

// DELETE /avatar
router.delete("/avatar", async (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  try {
    await removePainterAvatar(painter.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete avatar" });
  }
});

// GET /portfolio
router.get("/portfolio", (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  const portfolio = storage.getPainterPortfolio(painter.id);
  res.json(portfolio);
});

// POST /portfolio
router.post("/portfolio", async (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  const { title, category } = req.body;
  if (!title || !category) {
    res.status(400).json({ error: "title and category are required" });
    return;
  }

  try {
    const project = await createPortfolioProject(painter.id, req.body);
    res.status(201).json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create portfolio project" });
  }
});

// PUT /portfolio/:id
router.put("/portfolio/:id", async (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  try {
    const updated = await updatePortfolioProject(painter.id, req.params.id as string, req.body);
    res.json(updated);
  } catch (err: any) {
    if (err.message?.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: err.message || "Failed to update portfolio project" });
  }
});

// DELETE /portfolio/:id
router.delete("/portfolio/:id", async (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  try {
    await deletePortfolioProject(painter.id, req.params.id as string);
    res.json({ success: true });
  } catch (err: any) {
    if (err.message?.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: err.message || "Failed to delete portfolio project" });
  }
});

// PATCH /availability
router.patch("/availability", (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  const { isAvailable } = req.body;
  if (typeof isAvailable !== "boolean") {
    res.status(400).json({ error: "isAvailable (boolean) is required in request body" });
    return;
  }

  const updated = storage.setPainterAvailability(painter.id, isAvailable);
  res.json(updated);
});

// GET /quotes
router.get("/quotes", (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  const quotes = storage.getAllQuotes({ painterId: painter.id });
  res.json(quotes);
});

// GET /leads (alias for quotes)
router.get("/leads", (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  const quotes = storage.getAllQuotes({ painterId: painter.id });
  res.json(quotes);
});

// PATCH /quotes/:id/status
router.patch("/quotes/:id/status", (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid quote ID" });
    return;
  }

  const quote = storage.getQuoteById(id);
  if (!quote) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  if (quote.assignedPainterId !== painter.id) {
    res.status(403).json({ error: "Forbidden: You are not assigned to this quote" });
    return;
  }

  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: "status is required in request body" });
    return;
  }

  const updated = storage.updateQuoteStatus(id, status);
  res.json(updated);
});

// PATCH /leads/:id/status (alias for quotes status)
router.patch("/leads/:id/status", (req: Request, res: Response) => {
  const painter = storage.getPainterByUserId(req.user!.userId);
  if (!painter) {
    res.status(404).json({ error: "Painter profile not found" });
    return;
  }

  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid lead ID" });
    return;
  }

  const quote = storage.getQuoteById(id);
  if (!quote) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  if (quote.assignedPainterId !== painter.id) {
    res.status(403).json({ error: "Forbidden: You are not assigned to this lead" });
    return;
  }

  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: "status is required in request body" });
    return;
  }

  const updated = storage.updateQuoteStatus(id, status);
  res.json(updated);
});

export default router;
