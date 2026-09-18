"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarCheck2,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  MessageCircle,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SERVICES } from "@/lib/site-data";
import {
  BOOKING_SLOTS,
  BOOKING_WINDOW_DAYS,
  prettyDate,
  slotRangeLabel,
  todayPKT,
  weekdayLabel,
} from "@/lib/booking";

const WHATSAPP_NUMBER = "923124541361";
const MAX_DATE_CHIPS = 12;

const OFFICE_ADDRESS = "US Visa Consultant, Office #G 29, City Star Shopping Mall, Model Town Link Road, Lahore";

/** RFC 5545 text escaping: backslash first, then semicolons/commas/newlines. */
function icsEscape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Build an RFC 5545 .ics file for the confirmed consultation.
 * Office slots are PKT (UTC+5) hourly blocks; 09:00–18:00 PKT map to
 * 04:00–13:00 UTC, so the hour arithmetic never wraps.
 */
function buildIcs(opts: { reference: string; date: string; slot: string; visaType: string; name: string }): string {
  const { reference, date, slot, visaType, name } = opts;
  const [y, mo, d] = date.split("-").map(Number);
  const [h] = slot.split(":").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const startUTC = `${y}${pad(mo)}${pad(d)}T${pad(h - 5)}0000Z`;
  const endUTC = `${y}${pad(mo)}${pad(d)}T${pad(h - 4)}0000Z`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//US Visa Consultant//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${reference}@usvisaconsultantpvtltd.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${startUTC}`,
    `DTEND:${endUTC}`,
    `SUMMARY:${icsEscape(`Free Visa Consultation — US Visa Consultant (${reference})`)}`,
    `LOCATION:${icsEscape(OFFICE_ADDRESS)}`,
    `DESCRIPTION:${icsEscape(
      `Booking ${reference} · ${visaType} · Free 30-minute one-on-one with a senior visa consultant. ` +
        `Booked for ${name}. Questions? WhatsApp +92 312 4541361. ` +
        `Please arrive 10 minutes early and bring any documents related to your case.`
    )}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder — your free visa consultation starts in 1 hour.",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/** Trigger a browser download of the .ics — pure client-side, no server round-trip. */
function downloadIcs(opts: { reference: string; date: string; slot: string; visaType: string; name: string }): void {
  const blob = new Blob([buildIcs(opts)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `usvc-consultation-${opts.reference}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

type ContactFields = { name: string; phone: string; email: string; visaType: string; notes: string };

const INITIAL_FIELDS: ContactFields = { name: "", phone: "", email: "", visaType: "", notes: "" };

type DayChip = { date: string; weekday: string; day: string; month: string };

/** Next `MAX_DATE_CHIPS` bookable days (Sundays removed) in Asia/Karachi. */
function buildDateChips(): DayChip[] {
  const chips: DayChip[] = [];
  const today = todayPKT();
  const base = new Date(`${today}T12:00:00.000Z`);
  for (let i = 1; chips.length < MAX_DATE_CHIPS && i <= BOOKING_WINDOW_DAYS; i++) {
    const d = new Date(base.getTime() + i * 86_400_000);
    if (d.getUTCDay() === 0) continue; // closed Sundays
    const date = d.toISOString().slice(0, 10);
    const fmt = (opts: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(d);
    chips.push({
      date,
      weekday: fmt({ weekday: "short" }),
      day: fmt({ day: "numeric" }),
      month: fmt({ month: "short" }),
    });
  }
  return chips;
}

export function Booking() {
  const { toast } = useToast();

  const [days, setDays] = useState<DayChip[]>([]);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [booked, setBooked] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [fields, setFields] = useState<ContactFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFields, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);

  // Dates are timezone-dependent → generate on the client only (no hydration mismatch).
  useEffect(() => {
    const chips = buildDateChips();
    setDays(chips);
    if (chips.length) setDate(chips[0].date);
  }, []);

  const loadSlots = useCallback(async (d: string) => {
    if (!d) return;
    setSlotsLoading(true);
    setSlot("");
    try {
      const res = await fetch(`/api/booking?date=${d}`, { cache: "no-store" });
      const data = await res.json();
      setBooked(data.ok ? (data.booked as string[]) : []);
    } catch {
      setBooked([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // Whenever the selected date changes, refresh availability.
  useEffect(() => {
    if (date) loadSlots(date);
  }, [date, loadSlots]);

  /** Free slots on the selected day — drives the scarcity hint. */
  const remaining = BOOKING_SLOTS.length - booked.length;

  const pick = (key: keyof ContactFields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof ContactFields, string>> = {};
    if (fields.name.trim().length < 2) next.name = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = "Enter a valid email address";
    if (fields.phone.trim().length < 7) next.phone = "Enter a valid phone / WhatsApp number";
    if (!fields.visaType) next.visaType = "Choose a visa type";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const waConfirmUrl = useMemo(() => {
    const refLine = reference ? ` My booking reference is ${reference}.` : "";
    const text = `Hello US Visa Consultant! I just booked a FREE consultation for ${prettyDate(date)} at ${slotRangeLabel(slot)} (PKT) — ${fields.visaType}.${refLine} Please confirm. Thank you!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [date, slot, fields.visaType, reference]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !slot) {
      toast({ title: "Pick a date & time first", variant: "destructive" });
      return;
    }
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, date, slot }),
      });
      const data = await res.json();
      if (res.status === 409) {
        toast({ title: "Slot just got taken", description: data.error, variant: "destructive" });
        loadSlots(date);
        return;
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Could not create the booking");
      }
      setConfirmed(true);
      setReference(typeof data.booking?.reference === "string" ? data.booking.reference : "");
      setBooked((b) => [...b, slot]);
    } catch (err) {
      toast({
        title: "Booking failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyReference = async () => {
    if (!reference) return;
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Couldn't copy automatically",
        description: `Please note it down: ${reference}`,
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setConfirmed(false);
    setReference("");
    setCopied(false);
    setFields(INITIAL_FIELDS);
    setSlot("");
    if (date) loadSlots(date);
  };

  const perks = [
    { icon: Video, text: "30-minute one-on-one with a senior visa consultant" },
    { icon: BadgeCheck, text: "Personalised document checklist for your case" },
    { icon: Sparkles, text: "Honest timeline & success estimate — no false promises" },
    { icon: Clock, text: "Zero obligation — the first session is always free" },
  ];

  return (
    <section id="booking" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#1d4fd8]/[0.06] blur-[130px]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Pitch column */}
          <div className="min-w-0 lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Book a Free Consultation"
              title={
                <>
                  Reserve your{" "}
                  <span className="text-gradient-gold font-serif-accent italic">one-on-one</span> session
                </>
              }
              description="Pick a slot that suits you — walk in, call or meet us at the office. You'll leave the call knowing exactly what your case needs."
            />

            <ul className="mt-9 space-y-4">
              {perks.map((p, i) => (
                <Reveal key={p.text} delay={0.08 * i}>
                  <li className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1d4fd8]/25 bg-[#1d4fd8]/10">
                      <p.icon className="h-4.5 w-4.5 text-[#1d4fd8]" />
                    </span>
                    <span className="pt-1.5 text-sm font-medium leading-relaxed text-[#3d4d6b]">
                      {p.text}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#0d1b33]/8 bg-white p-4 shadow-[0_14px_40px_-28px_rgba(13,27,51,0.4)]">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <p className="text-[13px] font-bold text-[#0d1b33]">Mon – Sat · 9 AM – 7 PM PKT</p>
                <span className="h-3.5 w-px bg-[#0d1b33]/15" aria-hidden="true" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1d4fd8] underline-offset-4 hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Prefer WhatsApp?
                </a>
              </div>
            </Reveal>
          </div>

          {/* Scheduler card */}
          <Reveal delay={0.15} className="min-w-0 lg:col-span-3">
            <div className="glass gold-ring relative overflow-hidden rounded-[2rem] bg-white/85 p-5 shadow-[0_28px_70px_-32px_rgba(13,27,51,0.45)] sm:p-8">
              <AnimatePresence mode="wait">
                {confirmed ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-h-[480px] flex-col items-center justify-center text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.12 }}
                      className="glow-gold flex h-20 w-20 items-center justify-center rounded-full bg-[#1d4fd8]/10"
                    >
                      <CalendarCheck2 className="h-10 w-10 text-[#1d4fd8]" />
                    </motion.span>
                    <h3 className="mt-6 font-display text-2xl font-bold text-[#0d1b33] sm:text-3xl">
                      You&apos;re booked in, {fields.name.split(" ")[0]}!
                    </h3>
                    <div className="mt-5 w-full max-w-sm rounded-2xl border border-[#1d4fd8]/20 bg-[#f0f4fd] p-5">
                      <p className="font-display text-lg font-extrabold text-[#0d1b33]">
                        {prettyDate(date)}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#1d4fd8]">
                        {slotRangeLabel(slot)} · PKT
                      </p>
                      <p className="mt-2 text-xs font-medium text-[#5a6a86]">
                        {fields.visaType} · Free consultation · City Star Shopping Mall, Lahore
                      </p>
                    </div>
                    {reference && (
                      <div className="mt-3.5 w-full max-w-sm rounded-2xl border-2 border-dashed border-[#1d4fd8]/35 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 text-left">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8291ab]">
                              Booking reference
                            </p>
                            <p className="mt-0.5 font-mono text-lg font-extrabold tracking-[0.2em] text-[#0d1b33]">
                              {reference}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={copyReference}
                            className="h-9 shrink-0 rounded-full border-[#0d1b33]/15 px-4 text-[13px] font-semibold text-[#0d1b33] hover:bg-[#f0f4fd]"
                          >
                            {copied ? (
                              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {copied ? "Copied" : "Copy"}
                          </Button>
                        </div>
                        <p className="mt-2 text-left text-[11px] font-medium text-[#8291ab]">
                          Quote this code on WhatsApp or at the office desk.
                        </p>
                      </div>
                    )}
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#5a6a86]">
                      Save your slot — confirm on WhatsApp and we&apos;ll send a reminder before your
                      visit.
                    </p>
                    <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                      <Button
                        asChild
                        className="h-12 flex-1 rounded-full bg-[#25D366] text-[15px] font-bold text-white shadow-[0_14px_36px_-12px_rgba(37,211,102,0.65)] transition-all hover:bg-[#1fb857]"
                      >
                        <a href={waConfirmUrl} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4.5 w-4.5" /> Confirm on WhatsApp
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          downloadIcs({
                            reference: reference || "UVC-BOOKING",
                            date,
                            slot,
                            visaType: fields.visaType,
                            name: fields.name,
                          })
                        }
                        disabled={!reference}
                        className="h-12 flex-1 rounded-full border-[#1d4fd8]/30 text-[15px] font-semibold text-[#1d4fd8] hover:bg-[#f0f4fd]"
                      >
                        <CalendarPlus className="mr-2 h-4.5 w-4.5" /> Add to calendar
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={reset}
                      className="mt-3 h-10 rounded-full px-6 text-[13px] font-semibold text-[#5a6a86] hover:bg-[#f0f4fd] hover:text-[#0d1b33]"
                    >
                      Book another slot
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    onSubmit={onSubmit}
                    noValidate
                  >
                    {/* Step 1 — date */}
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5a6a86]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1d4fd8] text-[10px] font-bold text-white">
                        1
                      </span>
                      Choose a day
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Choose a day"
                      className="mt-3.5 flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {days.length === 0
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-[74px] w-[76px] shrink-0 animate-pulse rounded-xl bg-[#0d1b33]/8"
                            />
                          ))
                        : days.map((d) => {
                            const active = d.date === date;
                            return (
                              <button
                                key={d.date}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => setDate(d.date)}
                                className={`flex h-[74px] w-[76px] shrink-0 flex-col items-center justify-center rounded-xl border text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d4fd8]/50 focus-visible:ring-offset-2 ${
                                  active
                                    ? "border-[#1d4fd8] bg-[#1d4fd8] text-white shadow-[0_12px_28px_-10px_rgba(29,79,216,0.7)]"
                                    : "border-[#0d1b33]/10 bg-white text-[#0d1b33] hover:border-[#1d4fd8]/40 hover:bg-[#f0f4fd]"
                                }`}
                              >
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider ${
                                    active ? "text-white/80" : "text-[#5a6a86]"
                                  }`}
                                >
                                  {d.weekday}
                                </span>
                                <span className="font-display text-xl font-extrabold leading-tight">
                                  {d.day}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold uppercase ${
                                    active ? "text-white/80" : "text-[#5a6a86]"
                                  }`}
                                >
                                  {d.month}
                                </span>
                              </button>
                            );
                          })}
                    </div>

                    {/* Step 2 — slot */}
                    <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5a6a86]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1d4fd8] text-[10px] font-bold text-white">
                        2
                      </span>
                      Pick a time
                      <span className="ml-auto flex items-center gap-2">
                        <span className="text-[10px] font-semibold normal-case tracking-normal text-[#8291ab]">
                          all times PKT
                        </span>
                        {date && !slotsLoading && remaining > 0 && remaining <= 3 && (
                          <span
                            aria-live="polite"
                            className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-amber-700"
                          >
                            <Zap className="h-3 w-3" /> Only {remaining} left
                          </span>
                        )}
                        {date && !slotsLoading && remaining === 0 && (
                          <span
                            aria-live="polite"
                            className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-red-600"
                          >
                            Fully booked
                          </span>
                        )}
                      </span>
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Pick a time slot"
                      className="mt-3.5 grid grid-cols-4 gap-2 sm:grid-cols-5"
                    >
                      {slotsLoading || !date
                        ? Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-11 animate-pulse rounded-lg bg-[#0d1b33]/8" />
                          ))
                        : [
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
                          ].map((s) => {
                            const taken = booked.includes(s);
                            const active = s === slot;
                            return (
                              <button
                                key={s}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                disabled={taken}
                                onClick={() => setSlot(s)}
                                className={`h-11 rounded-lg border text-[13px] font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d4fd8]/50 focus-visible:ring-offset-2 ${
                                  taken
                                    ? "cursor-not-allowed border-transparent bg-[#0d1b33]/6 text-[#8291ab] line-through"
                                    : active
                                      ? "border-[#1d4fd8] bg-[#1d4fd8] text-white shadow-[0_10px_24px_-8px_rgba(29,79,216,0.7)]"
                                      : "border-[#0d1b33]/10 bg-white text-[#0d1b33] hover:border-[#1d4fd8]/40 hover:bg-[#f0f4fd]"
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                    </div>
                    {date && !slotsLoading && remaining === 0 && (
                      <p className="mt-2.5 text-xs font-semibold text-[#8291ab]">
                        All times for this day are taken — please choose another day.
                      </p>
                    )}

                    {/* Step 3 — details */}
                    <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5a6a86]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1d4fd8] text-[10px] font-bold text-white">
                        3
                      </span>
                      Your details
                    </p>
                    <div className="mt-3.5 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="bk-name" className="sr-only">
                          Full name
                        </Label>
                        <Input
                          id="bk-name"
                          placeholder="Full name *"
                          value={fields.name}
                          onChange={(ev) => pick("name", ev.target.value)}
                          className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm focus-visible:ring-[#1d4fd8]/40"
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bk-phone" className="sr-only">
                          Phone
                        </Label>
                        <Input
                          id="bk-phone"
                          type="tel"
                          placeholder="Phone / WhatsApp *"
                          value={fields.phone}
                          onChange={(ev) => pick("phone", ev.target.value)}
                          className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm focus-visible:ring-[#1d4fd8]/40"
                          aria-invalid={!!errors.phone}
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bk-email" className="sr-only">
                          Email
                        </Label>
                        <Input
                          id="bk-email"
                          type="email"
                          placeholder="Email address *"
                          value={fields.email}
                          onChange={(ev) => pick("email", ev.target.value)}
                          className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm focus-visible:ring-[#1d4fd8]/40"
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bk-visa" className="sr-only">
                          Visa type
                        </Label>
                        <Select value={fields.visaType} onValueChange={(v) => pick("visaType", v)}>
                          <SelectTrigger
                            id="bk-visa"
                            className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm data-[placeholder]:text-[#8291ab]"
                          >
                            <SelectValue placeholder="Visa type *" />
                          </SelectTrigger>
                          <SelectContent className="border-[#0d1b33]/10 bg-white text-[#0d1b33] shadow-xl">
                            {SERVICES.map((s) => (
                              <SelectItem key={s.id} value={s.short}>
                                {s.short}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other / Not sure</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.visaType && (
                          <p className="text-xs text-destructive">{errors.visaType}</p>
                        )}
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="bk-notes" className="sr-only">
                          Notes
                        </Label>
                        <Input
                          id="bk-notes"
                          placeholder="Anything we should know? (optional)"
                          value={fields.notes}
                          onChange={(ev) => pick("notes", ev.target.value)}
                          className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm focus-visible:ring-[#1d4fd8]/40"
                        />
                      </div>
                    </div>

                    {/* Summary + submit */}
                    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#1d4fd8]/20 bg-[#f0f4fd] p-4 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        {date && slot ? (
                          <p className="truncate text-sm font-bold text-[#0d1b33]">
                            <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-[#1d4fd8]" />
                            {weekdayLabel(date)}, {prettyDate(date)} · {slotRangeLabel(slot)} PKT
                          </p>
                        ) : (
                          <p className="truncate text-sm font-semibold text-[#5a6a86]">
                            <Clock className="mr-1.5 inline h-4 w-4" />
                            Choose a day and a time above
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        disabled={submitting || !date || !slot}
                        className="group relative h-12 shrink-0 overflow-hidden rounded-full bg-[#1d4fd8] px-7 text-[15px] font-bold text-white shadow-[0_14px_36px_-12px_rgba(29,79,216,0.8)] transition-all hover:bg-[#1a46c2] disabled:opacity-60"
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" /> Reserving…
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </div>
                    <p className="mt-3 text-center text-xs text-[#8291ab]">
                      Free · no payment required · we&apos;ll confirm on WhatsApp within minutes
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
