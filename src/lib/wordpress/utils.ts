import { Post } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";

/**
 * Extract a valid image URL from a WordPress post's embedded featured media.
 * Handles the non-standard case where source_url is an array [url, w, h, crop]
 * instead of a plain string (common with AI-generated Hostinger setups).
 */
export function extractFeaturedImage(post: Post): string {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return FALLBACK_IMAGE;

  const raw = media.source_url;

  // Handle array format: ["https://...", 530, 250, ["center","center"]]
  if (Array.isArray(raw)) {
    const url = raw[0];
    return typeof url === "string" && url.length > 0 ? url : FALLBACK_IMAGE;
  }

  // Handle normal string format
  if (typeof raw === "string" && raw.length > 0) {
    return raw;
  }

  return FALLBACK_IMAGE;
}
