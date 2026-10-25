/**
 * Kuwait Painters Platform - Client-side WebP Image Compressor
 * Optimizes portfolio & avatar images directly in the browser via HTML5 Canvas.
 */

export interface CompressImageOptions {
  maxWidth?: number;
  quality?: number;
}

/**
 * Loads an image File, resizes it down if its width exceeds maxWidth (default 1600px),
 * and compresses it to modern WebP format via HTML5 Canvas.
 *
 * @param file - Image File from user upload (JPEG, PNG, HEIC converted, WebP, etc.)
 * @param options - Configuration for maxWidth and compression quality (0.0 - 1.0)
 * @returns Promise resolving to a WebP Data URI string ('data:image/webp;base64,...')
 */
export function compressImageToWebP(
  file: File,
  options?: CompressImageOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Basic validation
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('الملف المرفق ليس صورة صالحة'));
      return;
    }

    const maxWidth = options?.maxWidth ?? 1600;
    const quality = options?.quality ?? 0.82;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Downscale while preserving aspect ratio if larger than maxWidth
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('تعذر إنشاء سياق رسم HTML5 Canvas'));
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP with target quality
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(webpDataUrl);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('فشل ضغط الصورة إلى WebP'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('فشل تحميل الصورة في المتصفح للضغط'));
    };

    img.src = objectUrl;
  });
}

/**
 * Convenience helper to compress a batch of files to WebP concurrently
 */
export async function compressMultipleImagesToWebP(
  files: File[],
  options?: CompressImageOptions
): Promise<string[]> {
  return Promise.all(files.map((file) => compressImageToWebP(file, options)));
}
