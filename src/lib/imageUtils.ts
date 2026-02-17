/**
 * Image optimization utilities for Cloudinary images
 * Converts Cloudinary URLs to WebP format with quality optimization
 */

interface OptimizationOptions {
  width?: number;
  quality?: number;
  format?: 'webp' | 'auto';
}

/**
 * Optimizes a Cloudinary image URL by converting to WebP and applying quality settings
 * @param url - Original image URL
 * @param options - Optimization options (width, quality, format)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  url: string,
  options: OptimizationOptions = {}
): string => {
  const { width, quality = 85, format = 'webp' } = options;

  // If not a Cloudinary URL, return as-is
  if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
    return url;
  }

  // Build transformation string
  const transformations: string[] = [`f_${format}`, `q_${quality}`];

  if (width) {
    transformations.push(`w_${width}`);
  }

  // Insert transformations into URL
  // Cloudinary URL format: https://res.cloudinary.com/{cloud}/image/upload/{transformations}/{path}
  const transformationString = transformations.join(',');

  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformationString}/`);
  }

  return url;
};

/**
 * Generates srcset for responsive images
 * @param url - Original image URL
 * @param widths - Array of widths to generate
 * @returns Srcset string
 */
export const generateSrcSet = (
  url: string,
  widths: number[] = [400, 800, 1200, 1600]
): string => {
  if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
    return url;
  }

  return widths
    .map((width) => `${getOptimizedImageUrl(url, { width })} ${width}w`)
    .join(', ');
};

/**
 * Gets appropriate image size based on container/purpose
 */
export const ImageSizes = {
  thumbnail: 400,
  small: 600,
  medium: 800,
  large: 1200,
  hero: 1600,
  fullscreen: 1920,
} as const;

/**
 * Preloads a critical image
 * @param url - Image URL to preload
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};
