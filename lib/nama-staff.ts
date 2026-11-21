import type { Booking } from "@/lib/booking";
import { formatKg } from "@/lib/format";
import { WASTE, WASTE_TYPES, type PickupGrade, type WasteType } from "@/lib/kitchen";

/** Nama staff side: today's route and the collections they record. */

export const MIN_COLLECT_KG = 0.1;
export const MAX_COLLECT_KG = 500;

/** Shown when choosing a grade at the kerb. */
export const GRADE_HELP: Record<PickupGrade, string> = {
  A: "Clean: food only",
  B: "Minor mix: a few bits of packaging",
  C: "Mixed: too much non-food, add a reason",
};

export type StopCollected = { kg: number; grade: PickupGrade | null; at: string };

/** One branch on today's route. */
export type Stop = {
  branchId: number;
  name: string;
  location: string;
  todayKg: number;
  byType: Partial<Record<WasteType, number>>;
  collected: StopCollected | null;
};

export type Collection = {
  id: number;
  collectedKg: number;
  collectedAt: string;
  grade: PickupGrade | null;
  reason: string | null;
  collectedBy: string | null;
  branch: string | null;
};

export type StaffRoute = {
  restaurant: string;
  nextPickup: string;
  openRequest: string | null;
  booking: Booking | null;
  stops: Stop[];
  collected: Collection[];
};

/** Reads a truck-scale weight like "42.5" or "42,5". Returns null if it isn't usable. */
export function parseCollectKg(input: string): number | null {
  const s = input.trim().replace(",", ".");
  if (!/^\d{1,3}(\.\d)?$|^\.\d$/.test(s)) return null;
  const kg = Number(s);
  return kg >= MIN_COLLECT_KG && kg <= MAX_COLLECT_KG ? kg : null;
}

/** "12.4 kg logged today: 4.2 prep scraps, 8.2 spoilage" or "Nothing logged yet today". */
export function loggedToday(stop: Stop): string {
  if (stop.todayKg <= 0) return "Nothing logged yet today";
  const parts = WASTE_TYPES.filter((t) => (stop.byType[t] ?? 0) > 0).map((t) => `${stop.byType[t]} ${WASTE[t].label.toLowerCase()}`);
  return `${formatKg(stop.todayKg)} logged today: ${parts.join(", ")}`;
}
