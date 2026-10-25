import { Router, type Request, type Response } from "express";
import { storage, verifyPassword } from "@workspace/db";
import { generateToken } from "../lib/jwt";
import { authenticate } from "../middlewares/auth";
import { createRateLimiter } from "../middlewares/rate-limiter";
import { uploadImageToCloudinary } from "../lib/cloudinary";
import type { PortfolioImage, PortfolioProject } from "@workspace/db";

const router = Router();

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول، يرجى الانتظار 15 دقيقة والمحاولة مجدداً.",
});

const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: "تم تجاوز الحد الأقصى لطلبات التسجيل، يرجى المحاولة لاحقاً.",
});

// POST /login
router.post("/login", loginLimiter, (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = storage.findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({ error: "Account is inactive" });
    return;
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const painter = user.role === "painter" ? storage.getPainterByUserId(user.id) : null;

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
    },
    painter,
  });
});

// GET /me
router.get("/me", authenticate, (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = storage.findUserById(req.user.userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const painter = user.role === "painter" ? storage.getPainterByUserId(user.id) : null;

  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
    },
    painter,
  });
});

// POST /register-painter
router.post("/register-painter", registerLimiter, async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name || !phone) {
    res.status(400).json({ error: "الاسم والبريد الإلكتروني وكلمة المرور ورقم الهاتف حقول مطلوبة" });
    return;
  }

  const existing = storage.findUserByEmail(email);
  if (existing) {
    res.status(400).json({ error: "البريد الإلكتروني مسجل بالفعل في المنصة" });
    return;
  }

  try {
    const accountType = req.body.accountType === "company" ? "company" : "individual";
    const companyName = req.body.companyName || (accountType === "company" ? name : null);
    const managerName = req.body.managerName || null;
    const commercialLicense = req.body.commercialLicense || null;

    // 1. Process Avatar upload if provided
    let avatarUrl: string | null = req.body.avatarUrl || null;
    let avatarPublicId: string | null = null;
    if (req.body.avatar && typeof req.body.avatar === "string" && req.body.avatar.startsWith("data:")) {
      try {
        const avatarRes = await uploadImageToCloudinary({
          dataUriOrBase64: req.body.avatar,
          folder: "sabbagh/avatars",
          tags: ["painter_registration", accountType],
        });
        avatarUrl = avatarRes.url;
        avatarPublicId = avatarRes.publicId;
      } catch (avErr) {
        console.warn("Avatar upload notice:", avErr);
      }
    }

    // 2. Process Work Sample Images if provided (up to 8 images)
    const sampleWorkImages: PortfolioImage[] = [];
    if (Array.isArray(req.body.sampleImages) && req.body.sampleImages.length > 0) {
      const imagesToUpload = req.body.sampleImages.slice(0, 8);
      const uploadPromises = imagesToUpload.map(async (img: string, idx: number) => {
        if (typeof img === "string" && img.startsWith("data:")) {
          try {
            const uploadRes = await uploadImageToCloudinary({
              dataUriOrBase64: img,
              folder: "sabbagh/applications",
              tags: ["sample_work", accountType],
            });
            return {
              id: `sample-${Date.now()}-${idx}`,
              url: uploadRes.url,
              publicId: uploadRes.publicId,
              caption: `نموذج عمل ${idx + 1}`,
            };
          } catch (uploadErr) {
            console.warn(`Work sample image ${idx} upload error:`, uploadErr);
            return null;
          }
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      results.forEach((res) => {
        if (res) sampleWorkImages.push(res);
      });
    }

    // 3. Construct initial portfolio project if sample work images exist
    const portfolioProjects: PortfolioProject[] = [];
    if (sampleWorkImages.length > 0) {
      portfolioProjects.push({
        id: `initial-proj-${Date.now()}`,
        painterId: 0,
        title: accountType === "company" ? "سابقة أعمال ونماذج تشطيب معتمدة" : "أعمال وتشطيبات الصباغ الميدانية",
        category: "دهان داخلي ومعجون وديكورات",
        description: "مجموعة نماذج أعمال حقيقية تم رفعها واعتمادها أثناء التسجيل في منصة صباغ الكويت.",
        displayMode: "standard",
        galleryImages: sampleWorkImages,
        materialsUsed: "أصباغ جوتن وكابارول معجون أصلي",
        area: req.body.region || "الكويت",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 4. Create User Account
    const user = storage.createUser({
      email,
      password,
      name,
      phone,
      role: "painter",
    });

    // 5. Create Painter Profile
    const painter = storage.createPainter({
      userId: user.id,
      name: req.body.name || name,
      avatarUrl,
      avatarPublicId,
      phone: req.body.phone || phone,
      whatsapp: req.body.whatsapp || phone,
      region: req.body.region || "كل المناطق",
      governorates: req.body.governorates || ["العاصمة"],
      services: req.body.services || ["دهان داخلي", "معجون"],
      startingAt: req.body.startingAt || "18 د.ك",
      years: req.body.years ? Number(req.body.years) : 5,
      bio: req.body.bio || req.body.description || "",
      description: req.body.description || req.body.bio || "",
      crewSize: req.body.crewSize ? Number(req.body.crewSize) : 4,
      paintBrands: req.body.paintBrands || ["جوتن"],
      accountType,
      companyName,
      managerName,
      commercialLicense,
      sampleWorkImages,
      portfolioProjects,
      status: "pending",
      isVerified: false,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
      painter,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to register painter" });
  }
});

// POST /logout
router.post("/logout", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
