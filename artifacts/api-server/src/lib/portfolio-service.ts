import { storage, type PortfolioImage, type PortfolioProject } from "@workspace/db";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "./cloudinary";

/**
 * Handles uploading a painter's avatar to Cloudinary, cleaning up the prior avatar if any,
 * and updating the database record.
 */
export async function uploadPainterAvatar(painterId: number, image: string): Promise<{ avatarUrl: string; avatarPublicId: string }> {
  const painter = storage.getPainterById(painterId);
  if (!painter) {
    throw new Error(`Painter #${painterId} not found`);
  }

  const uploadRes = await uploadImageToCloudinary({
    dataUriOrBase64: image,
    folder: "sabbagh/avatars",
    tags: ["avatar", `painter-${painterId}`],
  });

  if (painter.avatarPublicId) {
    try {
      await deleteImageFromCloudinary(painter.avatarPublicId);
    } catch (err) {
      console.error(`Failed to delete previous avatar ${painter.avatarPublicId}:`, err);
    }
  }

  const updated = storage.updatePainterAvatar(painterId, uploadRes.url, uploadRes.publicId);
  return {
    avatarUrl: updated.avatarUrl || uploadRes.url,
    avatarPublicId: updated.avatarPublicId || uploadRes.publicId,
  };
}

/**
 * Handles deleting a painter's avatar from Cloudinary and resetting the record.
 */
export async function removePainterAvatar(painterId: number): Promise<boolean> {
  const painter = storage.getPainterById(painterId);
  if (!painter) {
    throw new Error(`Painter #${painterId} not found`);
  }

  if (painter.avatarPublicId) {
    try {
      await deleteImageFromCloudinary(painter.avatarPublicId);
    } catch (err) {
      console.error(`Failed to delete avatar ${painter.avatarPublicId}:`, err);
    }
  }

  storage.deletePainterAvatar(painterId);
  return true;
}

/**
 * Handles adding a new portfolio project for a painter, uploading all necessary images to Cloudinary.
 */
export async function createPortfolioProject(
  painterId: number,
  body: {
    title: string;
    category: string;
    description?: string;
    displayMode?: "standard" | "before_after";
    materialsUsed?: string;
    area?: string;
    galleryImages?: Array<{ dataUri?: string; url?: string; publicId?: string; id?: string; caption?: string }>;
    beforeImage?: { dataUri?: string; url?: string; publicId?: string; id?: string; caption?: string } | null;
    afterImage?: { dataUri?: string; url?: string; publicId?: string; id?: string; caption?: string } | null;
    beforeDetails?: string;
    afterDetails?: string;
  }
): Promise<PortfolioProject> {
  const painter = storage.getPainterById(painterId);
  if (!painter) {
    throw new Error(`Painter #${painterId} not found`);
  }

  const displayMode: "standard" | "before_after" = body.displayMode === "before_after" ? "before_after" : "standard";
  const galleryImages: PortfolioImage[] = [];
  let beforeImg: PortfolioImage | undefined = undefined;
  let afterImg: PortfolioImage | undefined = undefined;

  if (displayMode === "standard") {
    if (Array.isArray(body.galleryImages)) {
      for (const item of body.galleryImages) {
        const rawPayload = item.dataUri || (typeof item.url === "string" && item.url.startsWith("data:") ? item.url : null);
        if (rawPayload) {
          try {
            const up = await uploadImageToCloudinary({
              dataUriOrBase64: rawPayload,
              folder: "sabbagh/portfolio",
              tags: ["portfolio", `painter-${painterId}`],
            });
            galleryImages.push({
              id: item.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
              url: up.url,
              publicId: up.publicId,
              caption: item.caption,
            });
          } catch (uploadErr) {
            console.error("Cloudinary upload failed for gallery image:", uploadErr);
          }
        } else if (item.url && !item.url.startsWith("data:")) {
          galleryImages.push({
            id: item.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            url: item.url,
            publicId: item.publicId || "",
            caption: item.caption,
          });
        }
      }
    }
  } else if (displayMode === "before_after") {
    const rawBefore = body.beforeImage?.dataUri || (typeof body.beforeImage?.url === "string" && body.beforeImage.url.startsWith("data:") ? body.beforeImage.url : null);
    if (rawBefore) {
      try {
        const up = await uploadImageToCloudinary({
          dataUriOrBase64: rawBefore,
          folder: "sabbagh/portfolio",
          tags: ["portfolio", "before", `painter-${painterId}`],
        });
        beforeImg = {
          id: body.beforeImage?.id || `img-before-${Date.now()}`,
          url: up.url,
          publicId: up.publicId,
          caption: body.beforeImage?.caption || "قبل العمل",
        };
      } catch (err) {
        console.error("Cloudinary beforeImage upload error:", err);
      }
    } else if (body.beforeImage?.url && !body.beforeImage.url.startsWith("data:")) {
      beforeImg = {
        id: body.beforeImage.id || `img-before-${Date.now()}`,
        url: body.beforeImage.url,
        publicId: body.beforeImage.publicId || "",
        caption: body.beforeImage.caption || "قبل العمل",
      };
    }

    const rawAfter = body.afterImage?.dataUri || (typeof body.afterImage?.url === "string" && body.afterImage.url.startsWith("data:") ? body.afterImage.url : null);
    if (rawAfter) {
      try {
        const up = await uploadImageToCloudinary({
          dataUriOrBase64: rawAfter,
          folder: "sabbagh/portfolio",
          tags: ["portfolio", "after", `painter-${painterId}`],
        });
        afterImg = {
          id: body.afterImage?.id || `img-after-${Date.now()}`,
          url: up.url,
          publicId: up.publicId,
          caption: body.afterImage?.caption || "بعد العمل",
        };
      } catch (err) {
        console.error("Cloudinary afterImage upload error:", err);
      }
    } else if (body.afterImage?.url && !body.afterImage.url.startsWith("data:")) {
      afterImg = {
        id: body.afterImage.id || `img-after-${Date.now()}`,
        url: body.afterImage.url,
        publicId: body.afterImage.publicId || "",
        caption: body.afterImage.caption || "بعد العمل",
      };
    }
  }

  const projectData: Omit<PortfolioProject, "id" | "painterId" | "createdAt" | "updatedAt"> = {
    title: body.title,
    category: body.category,
    description: body.description || "",
    displayMode,
    galleryImages,
    beforeImage: beforeImg,
    afterImage: afterImg,
    beforeDetails: body.beforeDetails || "",
    afterDetails: body.afterDetails || "",
    materialsUsed: body.materialsUsed || "",
    area: body.area || "",
  };

  return storage.addPainterPortfolioProject(painterId, projectData);
}

/**
 * Handles updating an existing portfolio project, uploading any new images, deleting removed ones,
 * and updating the record in storage.
 */
export async function updatePortfolioProject(
  painterId: number,
  projectId: string,
  body: {
    title?: string;
    category?: string;
    description?: string;
    displayMode?: "standard" | "before_after";
    materialsUsed?: string;
    area?: string;
    galleryImages?: Array<{ dataUri?: string; url?: string; publicId?: string; id?: string; caption?: string }>;
    beforeImage?: { dataUri?: string; url?: string; publicId?: string; id?: string; caption?: string } | null;
    afterImage?: { dataUri?: string; url?: string; publicId?: string; id?: string; caption?: string } | null;
    beforeDetails?: string;
    afterDetails?: string;
    removedPublicIds?: string[];
  }
): Promise<PortfolioProject> {
  const painter = storage.getPainterById(painterId);
  if (!painter) {
    throw new Error(`Painter #${painterId} not found`);
  }

  const existingPortfolio = storage.getPainterPortfolio(painterId);
  const existingProject = existingPortfolio.find((p) => p.id === projectId);
  if (!existingProject) {
    throw new Error(`Project #${projectId} not found`);
  }

  // 1. Delete removed images from Cloudinary if requested
  if (Array.isArray(body.removedPublicIds)) {
    for (const pid of body.removedPublicIds) {
      if (typeof pid === "string" && pid.trim()) {
        try {
          await deleteImageFromCloudinary(pid.trim());
        } catch (err) {
          console.error(`Failed to delete removed image ${pid}:`, err);
        }
      }
    }
  }

  // 2. Process galleryImages if provided
  let updatedGallery: PortfolioImage[] | undefined = undefined;
  if (Array.isArray(body.galleryImages)) {
    updatedGallery = [];
    for (const item of body.galleryImages) {
      const rawPayload = item.dataUri || (typeof item.url === "string" && item.url.startsWith("data:") ? item.url : null);
      if (rawPayload) {
        try {
          const up = await uploadImageToCloudinary({
            dataUriOrBase64: rawPayload,
            folder: "sabbagh/portfolio",
            tags: ["portfolio", `painter-${painterId}`],
          });
          updatedGallery.push({
            id: item.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            url: up.url,
            publicId: up.publicId,
            caption: item.caption,
          });
        } catch (uploadErr) {
          console.error("Cloudinary upload failed during update:", uploadErr);
        }
      } else if (item.url && !item.url.startsWith("data:")) {
        updatedGallery.push({
          id: item.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          url: item.url,
          publicId: item.publicId || "",
          caption: item.caption,
        });
      }
    }
  }

  // 3. Process beforeImage if provided
  let updatedBeforeImage: PortfolioImage | undefined = existingProject.beforeImage;
  if (body.beforeImage !== undefined) {
    if (body.beforeImage === null) {
      updatedBeforeImage = undefined;
    } else {
      const rawBefore = body.beforeImage.dataUri || (typeof body.beforeImage.url === "string" && body.beforeImage.url.startsWith("data:") ? body.beforeImage.url : null);
      if (rawBefore) {
        try {
          const up = await uploadImageToCloudinary({
            dataUriOrBase64: rawBefore,
            folder: "sabbagh/portfolio",
            tags: ["portfolio", "before", `painter-${painterId}`],
          });
          updatedBeforeImage = {
            id: body.beforeImage.id || `img-before-${Date.now()}`,
            url: up.url,
            publicId: up.publicId,
            caption: body.beforeImage.caption || "قبل العمل",
          };
        } catch (err) {
          console.error("Cloudinary beforeImage update error:", err);
        }
      } else if (body.beforeImage.url && !body.beforeImage.url.startsWith("data:")) {
        updatedBeforeImage = {
          id: body.beforeImage.id || `img-before-${Date.now()}`,
          url: body.beforeImage.url,
          publicId: body.beforeImage.publicId || "",
          caption: body.beforeImage.caption || "قبل العمل",
        };
      }
    }
  }

  // 4. Process afterImage if provided
  let updatedAfterImage: PortfolioImage | undefined = existingProject.afterImage;
  if (body.afterImage !== undefined) {
    if (body.afterImage === null) {
      updatedAfterImage = undefined;
    } else {
      const rawAfter = body.afterImage.dataUri || (typeof body.afterImage.url === "string" && body.afterImage.url.startsWith("data:") ? body.afterImage.url : null);
      if (rawAfter) {
        try {
          const up = await uploadImageToCloudinary({
            dataUriOrBase64: rawAfter,
            folder: "sabbagh/portfolio",
            tags: ["portfolio", "after", `painter-${painterId}`],
          });
          updatedAfterImage = {
            id: body.afterImage.id || `img-after-${Date.now()}`,
            url: up.url,
            publicId: up.publicId,
            caption: body.afterImage.caption || "بعد العمل",
          };
        } catch (err) {
          console.error("Cloudinary afterImage update error:", err);
        }
      } else if (body.afterImage.url && !body.afterImage.url.startsWith("data:")) {
        updatedAfterImage = {
          id: body.afterImage.id || `img-after-${Date.now()}`,
          url: body.afterImage.url,
          publicId: body.afterImage.publicId || "",
          caption: body.afterImage.caption || "بعد العمل",
        };
      }
    }
  }

  const updates: Partial<PortfolioProject> = {
    ...(body.title !== undefined ? { title: body.title } : {}),
    ...(body.category !== undefined ? { category: body.category } : {}),
    ...(body.description !== undefined ? { description: body.description } : {}),
    ...(body.displayMode !== undefined ? { displayMode: body.displayMode } : {}),
    ...(body.materialsUsed !== undefined ? { materialsUsed: body.materialsUsed } : {}),
    ...(body.area !== undefined ? { area: body.area } : {}),
    ...(body.beforeDetails !== undefined ? { beforeDetails: body.beforeDetails } : {}),
    ...(body.afterDetails !== undefined ? { afterDetails: body.afterDetails } : {}),
    ...(updatedGallery !== undefined ? { galleryImages: updatedGallery } : {}),
    ...(body.beforeImage !== undefined ? { beforeImage: updatedBeforeImage } : {}),
    ...(body.afterImage !== undefined ? { afterImage: updatedAfterImage } : {}),
  };

  return storage.updatePainterPortfolioProject(painterId, projectId, updates);
}

/**
 * Handles deleting a portfolio project and removing all associated images from Cloudinary.
 */
export async function deletePortfolioProject(painterId: number, projectId: string): Promise<boolean> {
  const painter = storage.getPainterById(painterId);
  if (!painter) {
    throw new Error(`Painter #${painterId} not found`);
  }

  const portfolio = storage.getPainterPortfolio(painterId);
  const project = portfolio.find((p) => p.id === projectId);
  if (!project) {
    throw new Error(`Project #${projectId} not found`);
  }

  const publicIds: string[] = [];
  if (project.beforeImage?.publicId) publicIds.push(project.beforeImage.publicId);
  if (project.afterImage?.publicId) publicIds.push(project.afterImage.publicId);
  if (Array.isArray(project.galleryImages)) {
    for (const img of project.galleryImages) {
      if (img.publicId) publicIds.push(img.publicId);
    }
  }

  for (const pid of publicIds) {
    try {
      await deleteImageFromCloudinary(pid);
    } catch (err) {
      console.error(`Failed to delete project image ${pid}:`, err);
    }
  }

  storage.deletePainterPortfolioProject(painterId, projectId);
  return true;
}
