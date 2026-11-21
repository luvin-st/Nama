/** Booking a pickup: one day (today to 6 days ahead, Dubai time) and one of 4 time slots. */

export const SLOTS = ["morning", "midday", "afternoon", "night"] as const;
export type Slot = (typeof SLOTS)[number];

/** Label and start hour (Dubai time). Must match kitchen_slot_start() in 0009_pickup_booking.sql. */
export const SLOT: Record<Slot, { label: string; start: number }> = {
  morning: { label: "7 to 9 am", start: 7 },
  midday: { label: "11 am to 1 pm", start: 11 },
  afternoon: { label: "3 to 5 pm", start: 15 },
  night: { label: "10 pm to midnight", start: 22 },
};

export const BOOK_DAYS = 7;

/** day is "YYYY-MM-DD" (a Dubai calendar day). */
export type Booking = { day: string; slot: Slot; requestedAt: string };

export function isSlot(v: unknown): v is Slot {
  return typeof v === "string" && (SLOTS as readonly string[]).includes(v);
}

export function isDay(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

const TZ = "Asia/Dubai";

/** Today's date ("YYYY-MM-DD") and hour (0 to 23) in Dubai. */
export function dubaiNow(now: Date = new Date()): { day: string; hour: number } {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" }).format(now));
  return { day, hour };
}

const asUtc = (day: string) => new Date(`${day}T00:00:00Z`);
const fmt = (day: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(asUtc(day));

export type BookDay = { day: string; top: string; bottom: string };

/** The days that can be booked: Today, Tomorrow, then "Mon" over "23 Nov". */
export function bookingDays(now: Date = new Date()): BookDay[] {
  const start = asUtc(dubaiNow(now).day);
  return Array.from({ length: BOOK_DAYS }, (_, i) => {
    const day = new Date(start.getTime() + i * 86_400_000).toISOString().slice(0, 10);
    const top = i === 0 ? "Today" : i === 1 ? "Tomorrow" : fmt(day, { weekday: "short" });
    return { day, top, bottom: fmt(day, { day: "numeric", month: "short" }) };
  });
}

/** A slot can be booked unless it is today and has already started. */
export function slotOpen(day: string, slot: Slot, now: Date = new Date()): boolean {
  const d = dubaiNow(now);
  return day !== d.day || d.hour < SLOT[slot].start;
}

/** "Monday 23 Nov, 7 to 9 am" (or "Mon 23 Nov, 7 to 9 am" when short). */
export function bookingLabel(b: Pick<Booking, "day" | "slot">, short = false): string {
  return `${fmt(b.day, { weekday: short ? "short" : "long", day: "numeric", month: "short" })}, ${SLOT[b.slot].label}`;
}
