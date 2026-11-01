// Base URL of the API. On Vercel the frontend and API share one domain, so
// leaving VITE_BACKEND_URL unset means "same origin" (relative /api URLs).
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/$/, '');

// Turn a stored file path into a URL the browser can load: full URLs
// (Vercel Blob) and bundled /images assets are used as-is, while local
// upload paths like "uploads/pdfs/x.pdf" are served by the backend.
export function assetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path) || path.startsWith('/images')) return path;
  return `${BACKEND_URL}/${path.replace(/^\//, '')}`;
}
