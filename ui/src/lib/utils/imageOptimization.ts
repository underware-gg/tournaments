/**
 * Image optimization utilities
 */

/**
 * Generates an optimized image URL with width and quality parameters for services like Imgix, Cloudinary, etc.
 * @param src Original image URL
 * @param width Desired width in pixels
 * @param quality Image quality (1-100)
 * @returns Optimized image URL or original URL if no optimization is possible
 */
export function getOptimizedImageUrl(
  src: string,
  width = 0,
  quality = 80
): string {
  // If no source or width provided, return original
  if (!src || width <= 0) return src;

  try {
    // Check if the URL already has a query string
    const url = new URL(src);

    // Different image services support different query parameters
    if (src.includes("cloudinary.com")) {
      // Cloudinary format: /w_width,q_quality/
      const transformationPath = `/w_${width},q_${quality},c_limit/`;
      const parts = url.pathname.split("/upload/");
      if (parts.length === 2) {
        url.pathname = `${parts[0]}/upload${transformationPath}${parts[1]}`;
        return url.toString();
      }
    } else if (src.includes("imgix.net")) {
      // Imgix format: ?w=width&q=quality
      url.searchParams.set("w", width.toString());
      url.searchParams.set("q", quality.toString());
      url.searchParams.set("auto", "compress");
      return url.toString();
    } else if (src.includes("images.unsplash.com")) {
      // Unsplash format: ?w=width&q=quality
      url.searchParams.set("w", width.toString());
      url.searchParams.set("q", quality.toString());
      return url.toString();
    }

    // Return original if no known optimization method
    return src;
  } catch (e) {
    // If URL parsing fails, return the original
    console.warn("Error optimizing image URL:", e);
    return src;
  }
}

/**
 * Calculate aspect ratio for an image to maintain proportions when only one dimension is specified
 * @param width Original width
 * @param height Original height
 * @param targetWidth Target width (if you're constraining by width)
 * @param targetHeight Target height (if you're constraining by height)
 * @returns Object containing calculated width and height
 */
export function calculateAspectRatio(
  width: number,
  height: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  if (targetWidth && !targetHeight) {
    // Calculate height based on target width
    const ratio = targetWidth / width;
    return {
      width: targetWidth,
      height: Math.round(height * ratio),
    };
  } else if (targetHeight && !targetWidth) {
    // Calculate width based on target height
    const ratio = targetHeight / height;
    return {
      width: Math.round(width * ratio),
      height: targetHeight,
    };
  }

  // Return original dimensions if no target specified
  return { width, height };
}

/**
 * Generate a lightweight image placeholder URL or data URL for lazy loading
 * @param src Original image URL
 * @param width Width of the placeholder
 * @returns Placeholder URL
 */
export function generatePlaceholderUrl(src: string, width = 10): string {
  if (!src) return "";

  try {
    const url = new URL(src);

    if (src.includes("cloudinary.com")) {
      // Cloudinary placeholder: very small image with blur
      const transformationPath = `/w_${width},e_blur:200,q_30/`;
      const parts = url.pathname.split("/upload/");
      if (parts.length === 2) {
        url.pathname = `${parts[0]}/upload${transformationPath}${parts[1]}`;
        return url.toString();
      }
    } else if (src.includes("imgix.net")) {
      // Imgix placeholder
      url.searchParams.set("w", width.toString());
      url.searchParams.set("blur", "20");
      url.searchParams.set("q", "30");
      return url.toString();
    }

    // Return original if no known placeholder method
    return src;
  } catch (e) {
    return src;
  }
}
