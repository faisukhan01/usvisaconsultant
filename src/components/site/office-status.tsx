"use client";

import { useEffect, useState } from "react";

export type OfficeStatus = {
  /** True while the Lahore office is reachable right now (Mon–Sat, 9:00–19:00 PKT). */
  open: boolean;
  /** Bold headline, e.g. "Open now" / "Opens tomorrow 9:00 AM". */
  label: string;
  /** Muted follow-up, e.g. "closes 7:00 PM · 2h 5m left · 4:55 PM in Lahore". */
  detail: string;
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SHORT_TO_IDX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function fmtTime(h: number, m: number): string {
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/**
 * Real-time open/closed state for the Lahore office.
 * Pure function of `now` so callers can verify every branch without a browser.
 */
export function computeOfficeStatus(now: Date): OfficeStatus {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayIdx = SHORT_TO_IDX[get("weekday")] ?? 0;
  const h = parseInt(get("hour"), 10) % 24; // some ICU builds emit "24" at midnight
  const m = parseInt(get("minute"), 10);
  const minutes = h * 60 + m;
  const lahoreTime = fmtTime(h, m);

  const isBusinessDay = dayIdx >= 1 && dayIdx <= 6; // Mon..Sat
  const OPEN_MIN = 9 * 60;
  const CLOSE_MIN = 19 * 60;

  if (isBusinessDay && minutes >= OPEN_MIN && minutes < CLOSE_MIN) {
    const minsLeft = CLOSE_MIN - minutes;
    const left =
      minsLeft >= 60
        ? `${Math.floor(minsLeft / 60)}h ${String(minsLeft % 60).padStart(2, "0")}m left`
        : `${minsLeft}m left`;
    return {
      open: true,
      label: "Open now",
      detail: `closes 7:00 PM · ${left} · ${lahoreTime} in Lahore`,
    };
  }

  // Closed — find the next business day the doors open.
  let daysAhead: number;
  if (isBusinessDay && minutes < OPEN_MIN) {
    daysAhead = 0; // later this morning
  } else {
    daysAhead = 1;
    while (daysAhead <= 7) {
      const next = (dayIdx + daysAhead) % 7;
      if (next >= 1 && next <= 6) break;
      daysAhead += 1;
    }
  }
  const when =
    daysAhead === 0 ? "today" : daysAhead === 1 ? "tomorrow" : DAY_NAMES[(dayIdx + daysAhead) % 7];
  return {
    open: false,
    label: `Opens ${when} 9:00 AM`,
    detail: `Mon – Sat · 9:00 AM – 7:00 PM · ${lahoreTime} in Lahore`,
  };
}

/**
 * Live office badge. Renders a static placeholder until mounted (no hydration
 * mismatch — the live clock is client-only by nature), then ticks every 30s.
 */
export function OfficeStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<OfficeStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(computeOfficeStatus(new Date()));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  const open = status?.open ?? true;
  const dot = open ? "bg-emerald-500" : "bg-amber-500";
  const headline = status ? status.label : "Mon – Sat · 9 AM – 7 PM PKT";
  const detail = status ? status.detail : "Lahore office hours";

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot}`} />
      </span>
      <span className="text-[13px] font-bold text-[#0d1b33]">{headline}</span>
      <span className="h-3.5 w-px bg-[#0d1b33]/15" aria-hidden="true" />
      <span className="min-w-0 truncate text-[13px] font-semibold text-[#5a6a86]">{detail}</span>
    </span>
  );
}
