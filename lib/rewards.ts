import type { RewardCategory } from "@/types/database";

export const CATEGORIES = ["All", "Grocery", "Bakery", "Cafés"] as const satisfies readonly ("All" | RewardCategory)[];
export type CategoryFilter = (typeof CATEGORIES)[number];

/** How many more points you need for something that costs `cost`. 0 means you can afford it. */
export function pointsNeeded(balance: number, cost: number): number {
  return Math.max(0, Math.ceil(cost - balance));
}

const VOUCHER = /^NAMA-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/;

/** Reads a voucher code as typed or scanned: " nama-7kq4 x2pb " → "NAMA-7KQ4-X2PB". Null if it isn't one. */
export function parseVoucherCode(input: string): string | null {
  const compact = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^NAMA[A-Z0-9]{8}$/.test(compact)) return null;
  const code = `NAMA-${compact.slice(4, 8)}-${compact.slice(8, 12)}`;
  return VOUCHER.test(code) ? code : null;
}
