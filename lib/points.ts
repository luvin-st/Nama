/** Points per kilogram of verified food scraps. The database (verify_deposit) uses the same rule. */
export const POINTS_PER_KG = 20;
export const MIN_KG = 0.05;
export const MAX_KG = 50;

/** 1.4 → 28, 0.33 → 7. Weight is rounded to 2 decimals first, like the database. */
export function pointsForKg(kg: number): number {
  const w = Math.round(kg * 100) / 100;
  return Math.round(w * POINTS_PER_KG);
}

/** Reads a typed weight like "1.4" or "1,4". Returns null if it isn't a usable weight. */
export function parseKg(input: string): number | null {
  const s = input.trim().replace(",", ".");
  if (!/^\d{1,2}(\.\d{1,2})?$|^\.\d{1,2}$/.test(s)) return null;
  const kg = Number(s);
  return kg >= MIN_KG && kg <= MAX_KG ? kg : null;
}
