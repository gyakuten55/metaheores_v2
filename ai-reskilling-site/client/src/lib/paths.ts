/**
 * Base path helpers.
 *
 * `import.meta.env.BASE_URL` comes from `base` in vite.config.ts:
 *   dev        → "/"
 *   production → "/services/ai-training/reskilling/"
 *
 * All in-app links and public assets must go through these helpers so the LP
 * works both at the dev root and under the production sub-directory.
 */
const RAW_BASE = import.meta.env.BASE_URL || "/";

/** Base path without the trailing slash ("" in dev). */
export const BASE = RAW_BASE.replace(/\/$/, "");

/** Absolute in-app URL for a root-relative path, e.g. url("/subsidy"). */
export function url(path = "/"): string {
  if (!path.startsWith("/")) return path;
  return `${BASE}${path}` || "/";
}

/** Absolute URL for a file in client/public, e.g. asset("/images/logo.png"). */
export function asset(path: string): string {
  return url(path);
}
