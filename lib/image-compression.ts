/**
 * Browser-side image compression utility using HTML5 Canvas.
 * Compresses large images (e.g. 5MB-10MB camera uploads) down to ~200-450KB
 * before sending to the server, dramatically speeding up uploads and saving bandwidth.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.82 } = options;

  // Don't compress SVGs or GIFs via canvas to preserve vectors and animations
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down dimensions if exceeding max limits
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to plain FileReader if 2D context isn't available
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file fallback.'));
        reader.readAsDataURL(file);
        return;
      }

      // Smooth downscaling rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG (or PNG if original was a small PNG to preserve alpha)
      const exportType = file.type === 'image/png' && file.size < 500 * 1024 ? 'image/png' : 'image/jpeg';
      const compressedBase64 = canvas.toDataURL(exportType, quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to process image for compression.'));
    };

    img.src = objectUrl;
  });
}
