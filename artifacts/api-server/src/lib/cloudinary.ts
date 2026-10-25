import crypto from "node:crypto";

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "lgbve8cd";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "857327558951392";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "W-zWSq9K9AoHv9MKLxjvDxxM9Bk";

export interface UploadImageOptions {
  dataUriOrBase64: string;
  folder: string;
  tags?: string[];
}

export interface UploadImageResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
}

/**
 * Uploads an image (Data URI or Base64) to Cloudinary, converting it to WebP format
 * and organizing under the specified folder with cryptographic SHA-1 signing.
 */
export async function uploadImageToCloudinary(options: {
  dataUriOrBase64: string;
  folder: string;
  tags?: string[];
}): Promise<{ url: string; publicId: string; bytes: number; format: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "lgbve8cd";
  const apiKey = process.env.CLOUDINARY_API_KEY || "857327558951392";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "W-zWSq9K9AoHv9MKLxjvDxxM9Bk";

  const timestamp = Math.floor(Date.now() / 1000);
  const format = "webp";

  const paramsToSign: Record<string, string> = {
    folder: options.folder,
    format,
    timestamp: String(timestamp),
  };

  if (options.tags && options.tags.length > 0) {
    paramsToSign.tags = options.tags.join(",");
  }

  // Cloudinary signatures require parameters sorted in alphabetical order
  const sortedKeys = Object.keys(paramsToSign).sort();
  const stringToSign = sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join("&") + apiSecret;
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

  // Ensure base64 string has proper Data URI prefix if raw base64 was passed
  let file = options.dataUriOrBase64;
  if (!file.startsWith("data:") && !file.startsWith("http://") && !file.startsWith("https://")) {
    file = `data:image/jpeg;base64,${file}`;
  }

  const payload: Record<string, any> = {
    file,
    ...paramsToSign,
    api_key: apiKey,
    signature,
  };

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as any;
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `Cloudinary upload failed with status ${response.status}`);
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    bytes: data.bytes,
    format: data.format,
  };
}

/**
 * Permanently deletes an image from Cloudinary using signed authentication.
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) return false;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "lgbve8cd";
  const apiKey = process.env.CLOUDINARY_API_KEY || "857327558951392";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "W-zWSq9K9AoHv9MKLxjvDxxM9Bk";

  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_id: publicId,
        timestamp,
        api_key: apiKey,
        signature,
      }),
    });

    const data = (await response.json()) as any;
    return data?.result === "ok";
  } catch (error) {
    console.error(`Failed to delete image ${publicId} from Cloudinary:`, error);
    return false;
  }
}
