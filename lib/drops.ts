/** Reasons staff can give when a drop isn't accepted. Shown to the resident. */
export const REJECT_REASONS = ["Plastic or packaging", "Not food waste", "Bin code mismatch", "Other"] as const;
export type RejectReason = (typeof REJECT_REASONS)[number];

export function isRejectReason(s: string): s is RejectReason {
  return (REJECT_REASONS as readonly string[]).includes(s);
}
