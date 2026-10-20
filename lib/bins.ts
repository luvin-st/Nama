const CODE = /^NAMA-[A-Z][0-9]{2}$/;

/**
 * Reads a bin code from what the resident typed or scanned.
 * Accepts "NAMA-B02", " nama-b02 ", or a sticker link like ".../scan/confirm?bin=NAMA-B02".
 * Returns null if it isn't a valid Nama' bin code.
 */
export function parseBinCode(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  let candidate = raw;
  if (/^https?:\/\//i.test(raw)) {
    try {
      candidate = new URL(raw).searchParams.get("bin") ?? "";
    } catch {
      return null;
    }
  }

  const code = candidate.replace(/\s+/g, "").toUpperCase();
  return CODE.test(code) ? code : null;
}

/** Link printed in a bin's QR sticker. */
export function stickerUrl(origin: string, code: string): string {
  return `${origin.replace(/\/$/, "")}/scan/confirm?bin=${encodeURIComponent(code)}`;
}
