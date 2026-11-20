import type { IconName } from "@/components/ui/Icon";

/** Restaurant demo (NAMA for Rania's Kitchen): shared types and helpers. */

export const WASTE_TYPES = ["prep", "spoilage", "plate"] as const;
export type WasteType = (typeof WASTE_TYPES)[number];

/** Label, line icon, icon tile tone and chart colour for each waste type (earlier Nama' palette). */
export const WASTE: Record<WasteType, { label: string; icon: IconName; tone: "forest" | "leaf" | "lime"; bar: string }> = {
  spoilage: { label: "Spoilage", icon: "apple", tone: "leaf", bar: "bg-leaf" },
  prep: { label: "Prep scraps", icon: "knife", tone: "lime", bar: "bg-lime" },
  plate: { label: "Plate leftovers", icon: "plate", tone: "forest", bar: "bg-muted" },
};

/** Order used on the report (biggest category in the sample first). */
export const REPORT_ORDER: readonly WasteType[] = ["spoilage", "prep", "plate"];

export const MIN_LOG_KG = 0.1;
export const MAX_LOG_KG = 60;

/** binsToday = how many of the branch's 3 bins (one per waste type) were logged today. */
export type Branch = { id: number; name: string; location: string; monthKg: number; binsToday: number };
export type BinLog = { id: number; branch: string; wasteType: WasteType; weightKg: number; loggedAt: string };
export type PickupGrade = "A" | "B" | "C";
export type Pickup = { id: number; collectedKg: number; collectedAt: string; grade: PickupGrade | null; collectedBy: string | null };

/** What each contamination grade means, as shown under a pickup. */
export const GRADE_LABEL: Record<PickupGrade, string> = { A: "clean", B: "minor mix", C: "mixed" };

export function isGrade(v: unknown): v is PickupGrade {
  return v === "A" || v === "B" || v === "C";
}

export type KitchenDashboard = {
  restaurant: string;
  aedPerKg: number;
  nextPickup: string;
  tip: string;
  branches: Branch[];
  byType: Record<WasteType, number>;
  logCount: number;
  /** kg logged since midnight (Dubai time), all branches. */
  todayKg: number;
  recentLogs: BinLog[];
  pickups: Pickup[];
  openRequest: string | null;
};

export function isWasteType(v: string): v is WasteType {
  return (WASTE_TYPES as readonly string[]).includes(v);
}

/** Reads a typed weight like "4.2" or "4,2". Returns null if it isn't a usable weight. */
export function parseLogKg(input: string): number | null {
  const s = input.trim().replace(",", ".");
  if (!/^\d{1,2}(\.\d)?$|^\.\d$/.test(s)) return null;
  const kg = Number(s);
  return kg >= MIN_LOG_KG && kg <= MAX_LOG_KG ? kg : null;
}

/** 7480 → "AED 7,480" */
export function formatAed(n: number): string {
  return `AED ${Math.round(n).toLocaleString("en-US")}`;
}

/**
 * Whole-number percentages that always add up to 100 (largest remainder method).
 * [168.3, 130.9, 74.8] → [45, 35, 20]
 */
export function percentages(values: readonly number[]): number[] {
  const total = values.reduce((a, b) => a + b, 0);
  if (total <= 0) return values.map(() => 0);
  const raw = values.map((v) => (v / total) * 100);
  const floors = raw.map(Math.floor);
  let left = 100 - floors.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => ({ i, rest: r - Math.floor(r) })).sort((a, b) => b.rest - a.rest);
  for (const { i } of order) {
    if (left <= 0) break;
    floors[i] = (floors[i] ?? 0) + 1;
    left -= 1;
  }
  return floors;
}

const TZ = "Asia/Dubai";

/** "Thursday, 19 Nov" in Dubai time. */
export function weekdayDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "long", day: "numeric", month: "short" }).format(new Date(iso));
}

/** "9:41 pm" in Dubai time. */
export function clockTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(iso));
}
