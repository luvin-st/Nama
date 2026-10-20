const TZ = "Asia/Dubai";

/** 1240 → "1,240" */
export function formatPoints(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

/** 2.3 → "2.3 kg", 8 → "8 kg" */
export function formatKg(n: number): string {
  const v = Math.round(n * 10) / 10;
  return `${v.toLocaleString("en-US", { maximumFractionDigits: 1 })} kg`;
}

function dubaiDay(d: Date): number {
  const [y, m, day] = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(d)
    .split("-")
    .map(Number);
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, day ?? 1) / 86_400_000;
}

/** "Today", "Yesterday", "3 days ago", or "12 Oct" — counted in Dubai time. */
export function relativeDay(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const diff = dubaiDay(now) - dubaiDay(then);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "numeric", month: "short" }).format(then);
}

/** "Free coffee" → "free coffee" (for use mid-sentence). */
export function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
