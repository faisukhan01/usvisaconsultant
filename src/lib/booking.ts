/**
 * Shared booking domain logic — used by both the client UI and the API route
 * so validation rules can never drift between the two.
 *
 * Office hours: Mon–Sat, 09:00–19:00 PKT (hourly slots, last one 18:00–19:00).
 */

/** Bookable hour starts, PKT (Asia/Karachi). 18:00 is the last slot of the day. */
export const BOOKING_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

export type BookingSlot = (typeof BOOKING_SLOTS)[number];

/** How many days ahead the calendar shows (client) / accepts (server). */
export const BOOKING_WINDOW_DAYS = 21;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse a YYYY-MM-DD string into a UTC-noon Date so that weekday calculations
 * are stable regardless of the host machine's local timezone.
 */
export function parseISODate(date: string): Date | null {
  if (!DATE_RE.test(date)) return null;
  const d = new Date(`${date}T12:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Today's date in Asia/Karachi as YYYY-MM-DD. */
export function todayPKT(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  // en-CA yields YYYY-MM-DD directly
  return parts;
}

/** Add n days (UTC arithmetic on a UTC-noon date) and return YYYY-MM-DD. */
function addDaysISO(d: Date, n: number): string {
  const next = new Date(d.getTime() + n * 86_400_000);
  return next.toISOString().slice(0, 10);
}

/** A date is bookable when: valid, not a Sunday, and within [tomorrow … +window] PKT. */
export function isBookableDate(date: string): boolean {
  const d = parseISODate(date);
  if (!d) return false;
  if (d.getUTCDay() === 0) return false; // closed Sundays
  const t = parseISODate(todayPKT());
  if (!t) return false;
  const min = addDaysISO(t, 1);
  const max = addDaysISO(t, BOOKING_WINDOW_DAYS);
  return date >= min && date <= max;
}

/** Server-side slot guard — client list and server list share one source of truth. */
export function isValidSlot(slot: string): slot is BookingSlot {
  return (BOOKING_SLOTS as readonly string[]).includes(slot);
}

/** "10:00 – 11:00" label for a slot start. */
export function slotRangeLabel(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const end = `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return `${slot} – ${end}`;
}

/** Weekday label for a date, e.g. "Tuesday". */
export function weekdayLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(
    parseISODate(date) as Date
  );
}

/** "Tue, 16 Sep 2025" — used on the confirmation screen. */
export function prettyDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseISODate(date) as Date);
}
