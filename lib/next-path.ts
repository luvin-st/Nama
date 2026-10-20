const AUTH_PAGES = ["/welcome", "/login", "/signup"];

/**
 * A page inside the app to return to after logging in, e.g. "/scan/confirm?bin=NAMA-B02".
 * Returns null for anything unsafe (other websites, "//evil.com") or pointless (auth pages).
 */
export function safeNext(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 300) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  const path = value.split("?")[0] ?? "";
  if (path === "/" || AUTH_PAGES.some((p) => path === p || path.startsWith(`${p}/`))) return null;
  return value;
}

/** "/login" + "/scan/confirm?bin=X" → "/login?next=%2Fscan%2Fconfirm%3Fbin%3DX" */
export function withNext(href: string, next: string | null): string {
  return next ? `${href}?next=${encodeURIComponent(next)}` : href;
}
