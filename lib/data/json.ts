import { isDay, isSlot, type Booking } from "@/lib/booking";

/** Small readers for JSON returned by database functions (shape checked, never trusted). */
export type Obj = Record<string, unknown>;

export const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
export const num = (v: unknown): number => (typeof v === "number" ? v : Number(v ?? 0)) || 0;
export const str = (v: unknown): string => (typeof v === "string" ? v : "");
export const list = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);

/** A booking { day, slot, requestedAt } from the database, or null. */
export function toBooking(v: unknown): Booking | null {
  if (!isObj(v) || !isDay(v.day) || !isSlot(v.slot)) return null;
  return { day: v.day, slot: v.slot, requestedAt: str(v.requestedAt) };
}
