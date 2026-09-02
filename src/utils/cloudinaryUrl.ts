/**
 * Cloudinary delivery-time URL optimizer.
 *
 * Injects transformation parameters into existing Cloudinary secure_url values
 * WITHOUT modifying stored URLs in Supabase or re-uploading any assets.
 *
 * All original Cloudinary assets remain untouched.
 * Optimization happens purely at delivery time via URL transformation parameters.
 */

interface CloudinaryOptions {
  /** Limit width (px). Uses c_limit so images are never upscaled. */
  width?: number;
  /** Quality. Defaults to "auto". Pass "auto:best" for hero images where quality is critical. */
  quality?: string;
}

const CLOUDINARY_HOST = "res.cloudinary.com";

/**
 * Returns true if the URL is a Cloudinary delivery URL.
 */
export function isCloudinaryUrl(url: string): boolean {
  try {
    return new URL(url).hostname === CLOUDINARY_HOST;
  } catch {
    return false;
  }
}

/**
 * Injects Cloudinary transformation parameters into a stored secure_url.
 *
 * Example input:
 *   https://res.cloudinary.com/lcesuwf4/image/upload/v1234/teex_clothings/abc.jpg
 *
 * Example output (width 600):
 *   https://res.cloudinary.com/lcesuwf4/image/upload/f_auto,q_auto,c_limit,w_600/v1234/teex_clothings/abc.jpg
 *
 * If the URL is not a Cloudinary URL (e.g. a Supabase URL or local path),
 * it is returned unchanged — safe to call on any image URL in the app.
 *
 * Never upscales images (c_limit instead of c_scale).
 */
export function buildCloudinaryUrl(
  url: string | null | undefined,
  options: CloudinaryOptions = {}
): string {
  if (!url) return "";
  if (!isCloudinaryUrl(url)) return url;

  const { width, quality = "auto" } = options;

  // Build the transformation string
  const transforms: string[] = [`f_auto`, `q_${quality}`];
  if (width) {
    transforms.push(`c_limit,w_${width}`);
  }
  const transformStr = transforms.join(",");

  // Insert directly after /upload/ — prepends our transforms before any
  // existing version string (v1234/...) or existing transform segments.
  // This works correctly for both:
  //   /upload/v1234/...          → /upload/f_auto,q_auto/v1234/...
  //   /upload/c_fill,h_500/v...  → /upload/f_auto,q_auto/c_fill,h_500/v...
  return url.replace(/\/upload\//, `/upload/${transformStr}/`);
}

/**
 * Generates a srcset string for responsive image delivery.
 * Useful for product cards and hero banners where viewport size varies widely.
 *
 * Usage:
 *   <img
 *     src={buildCloudinaryUrl(url, { width: 600 })}
 *     srcSet={buildCloudinarySrcSet(url, [300, 600, 900])}
 *     sizes="(max-width: 640px) 50vw, 25vw"
 *     loading="lazy"
 *   />
 */
export function buildCloudinarySrcSet(
  url: string | null | undefined,
  widths: number[],
  quality = "auto"
): string {
  if (!url || !isCloudinaryUrl(url)) return "";
  return widths
    .map((w) => `${buildCloudinaryUrl(url, { width: w, quality })} ${w}w`)
    .join(", ");
}
