"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plane,
  GraduationCap,
  Briefcase,
  Heart,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
  Timer,
  ClipboardList,
  RotateCcw,
  MessageCircle,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/site/reveal";
import {
  computeReadiness,
  READINESS_META,
  GOAL_OPTIONS,
  TIMELINE_OPTIONS,
  DESTINATION_OPTIONS,
  type Goal,
  type Timeline,
  type Refusals,
  type Readiness,
} from "@/lib/eligibility";

const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL_STEPS = 5;

const GOAL_ICONS = { Visit: Plane, Study: GraduationCap, Work: Briefcase, Family: Heart } as const;

const TIMELINE_LABEL: Record<Timeline, string> = {
  asap: "ASAP (4–8 weeks)",
  "1-3": "1–3 months",
  "3-6": "3–6 months",
  exploring: "still exploring",
};

const READINESS_SCORE: Record<Readiness, number> = { high: 92, medium: 74, starter: 48 };

/** Short label that fits inside the score ring. */
const READINESS_SHORT: Record<Readiness, string> = { high: "Strong", medium: "Promising", starter: "Planning" };

const RESULT_BULLETS: Record<Readiness, string[]> = {
  high: [
    "Your timeline is realistic for a well-prepared file",
    "Embassy-grade documentation checklist ready in one call",
    "Priority slot available with a senior consultant this week",
  ],
  medium: [
    "Timing is workable — document order needs shaping",
    "We'll map the exact evidence embassies expect",
    "A quick strategy session closes most of the gap",
  ],
  starter: [
    "Perfect stage to plan budgets, timelines and documents",
    "We'll build a step-by-step roadmap — no obligations",
    "15 minutes with a consultant saves months of guesswork",
  ],
};

type ContactErrors = Partial<Record<"name" | "phone" | "email", string>>;

export function Eligibility() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [refusals, setRefusals] = useState<Refusals | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<Readiness | null>(null);

  const readiness = useMemo(
    () => (goal && timeline && refusals ? computeReadiness(goal, timeline, refusals) : null),
    [goal, timeline, refusals]
  );

  const stepAnswered = [
    goal !== null,
    destination !== null,
    timeline !== null,
    refusals !== null,
    name.trim().length >= 2 && phone.trim().length >= 7 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
  ];

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const choose = <T,>(setter: (v: T) => void, value: T) => {
    setter(value);
    // Auto-advance feels snappy for single-choice steps — small delay so the
    // selection state paints first.
    window.setTimeout(() => {
      setDir(1);
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    }, 320);
  };

  const validateContact = (): boolean => {
    const next: ContactErrors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name";
    if (phone.trim().length < 7) next.phone = "Please enter a valid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Please enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validateContact() || !goal || !destination || !timeline || !refusals || !readiness) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          goal,
          destination,
          timeline,
          refusals,
          readiness,
        }),
      });
      if (!res.ok) throw new Error("failed");
      go(TOTAL_STEPS); // result screen
    } catch {
      setServerError("We couldn't save your check. Please try again or reach us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(0);
    setDir(-1);
    setGoal(null);
    setDestination(null);
    setTimeline(null);
    setRefusals(null);
    setName("");
    setPhone("");
    setEmail("");
    setErrors({});
    setServerError(null);
    setResult(null);
  };

  const whatsappSummary = () => {
    const verdict = readiness ? READINESS_META[readiness].label : "checked";
    return encodeURIComponent(
      `Hello US Visa Consultant! I just completed the eligibility check: ${goal} visa for ${destination}, travel window ${TIMELINE_LABEL[timeline as Timeline]}, ${
        refusals === "yes" ? "one previous refusal" : "no previous refusals"
      }. Result: ${verdict}. Please guide me on the next steps.`
    );
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: 44 * d }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: -44 * d }),
  };

  return (
    <section id="eligibility" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-[#f5f8fe] to-white" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_70%)]" />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#1d4fd8]/[0.07] blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16">
        {/* ── Pitch column ── */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#1d4fd8] sm:text-xs">
              <span className="h-px w-8 bg-[#1d4fd8]/60" aria-hidden="true" />
              Free Eligibility Check
            </p>
            <h2 className="mt-4 font-display text-[27px] font-extrabold leading-[1.15] tracking-tight text-[#0d1b33] sm:text-4xl lg:text-[2.6rem]">
              Find out where you stand in{" "}
              <span className="font-serif-accent font-semibold italic text-[#1d4fd8]">60 seconds</span>.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-[#5a6a86] sm:text-[17px]">
              Five quick questions — no documents, no sign-up. You&apos;ll get an honest readiness
              snapshot and the exact next step a senior consultant would recommend for your profile.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Timer, title: "Takes about a minute", desc: "Five taps on mobile — designed for busy people." },
                { icon: ClipboardList, title: "Instant, personalised result", desc: "Matched to your goal, destination and timeline." },
                { icon: ShieldCheck, title: "Honest & private", desc: "An indicative check, not legal advice. Your details stay with us." },
              ].map((f) => (
                <li key={f.title} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0f4fd] ring-1 ring-[#1d4fd8]/15">
                    <f.icon className="h-5 w-5 text-[#1d4fd8]" />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-[#0d1b33]">{f.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#5a6a86]">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-9 flex items-center gap-4 rounded-2xl border border-[#0d1b33]/8 bg-white/80 p-4 shadow-[0_16px_44px_-28px_rgba(13,27,51,0.4)] backdrop-blur">
              <div className="flex -space-x-2.5" aria-hidden="true">
                {["AM", "SK", "RB"].map((n, i) => (
                  <span
                    key={n}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-extrabold text-white ring-2 ring-white ${
                      ["bg-[#1d4fd8]", "bg-[#3d4d6b]", "bg-[#e23a3a]"][i]
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <p className="text-[13px] leading-snug text-[#5a6a86]">
                <span className="font-bold text-[#0d1b33]">2,300+ checks</span> completed this year —
                most get a consultant callback within 24 hours.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── Quiz card ── */}
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <div className="relative rounded-[1.75rem] border border-[#0d1b33]/8 bg-white p-5 shadow-[0_40px_100px_-40px_rgba(13,27,51,0.45)] sm:p-7">
            {/* top accent */}
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#1d4fd8]/70 to-transparent" aria-hidden="true" />

            {/* Header + progress */}
            {step < TOTAL_STEPS && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f4fd] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1d4fd8]">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Step {step + 1} of {TOTAL_STEPS}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8291ab]">
                    ~60 sec
                  </span>
                </div>
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f0f4fd]"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={TOTAL_STEPS}
                  aria-valuenow={step + 1}
                  aria-label="Quiz progress"
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#1d4fd8] to-[#5b85ec]"
                    initial={false}
                    animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                {/* ── STEP 0 · Goal ── */}
                {step === 0 && (
                  <motion.fieldset
                    key="step-goal"
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <legend className="font-display text-xl font-extrabold text-[#0d1b33] sm:text-2xl">
                      What&apos;s your visa goal?
                    </legend>
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {GOAL_OPTIONS.map((o) => {
                        const Icon = GOAL_ICONS[o.value];
                        const selected = goal === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => choose(setGoal, o.value)}
                            aria-pressed={selected}
                            className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4fd8] ${
                              selected
                                ? "border-[#1d4fd8] bg-[#f0f4fd] shadow-[0_10px_30px_-14px_rgba(29,79,216,0.55)]"
                                : "border-[#0d1b33]/10 bg-white hover:border-[#1d4fd8]/45 hover:bg-[#f8baff05] hover:shadow-[0_10px_26px_-18px_rgba(13,27,51,0.4)]"
                            }`}
                          >
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                selected ? "bg-[#1d4fd8] text-white" : "bg-[#f0f4fd] text-[#1d4fd8] group-hover:bg-[#1d4fd8]/10"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <span>
                              <span className="block text-[15px] font-bold text-[#0d1b33]">{o.title}</span>
                              <span className="mt-0.5 block text-xs leading-snug text-[#5a6a86]">{o.desc}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.fieldset>
                )}

                {/* ── STEP 1 · Destination ── */}
                {step === 1 && (
                  <motion.fieldset
                    key="step-dest"
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <legend className="font-display text-xl font-extrabold text-[#0d1b33] sm:text-2xl">
                      Where are you headed?
                    </legend>
                    <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {DESTINATION_OPTIONS.map((d) => {
                        const selected = destination === d;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => choose(setDestination, d)}
                            aria-pressed={selected}
                            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-[13px] font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4fd8] ${
                              selected
                                ? "border-[#1d4fd8] bg-[#1d4fd8] text-white shadow-[0_10px_26px_-12px_rgba(29,79,216,0.7)]"
                                : "border-[#0d1b33]/10 bg-white text-[#3d4d6b] hover:border-[#1d4fd8]/45 hover:text-[#1d4fd8]"
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </motion.fieldset>
                )}

                {/* ── STEP 2 · Timeline ── */}
                {step === 2 && (
                  <motion.fieldset
                    key="step-time"
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <legend className="font-display text-xl font-extrabold text-[#0d1b33] sm:text-2xl">
                      When do you plan to travel?
                    </legend>
                    <div className="mt-5 space-y-2.5">
                      {TIMELINE_OPTIONS.map((o) => {
                        const selected = timeline === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => choose(setTimeline, o.value)}
                            aria-pressed={selected}
                            className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4fd8] ${
                              selected
                                ? "border-[#1d4fd8] bg-[#f0f4fd] shadow-[0_10px_30px_-14px_rgba(29,79,216,0.55)]"
                                : "border-[#0d1b33]/10 bg-white hover:border-[#1d4fd8]/45"
                            }`}
                          >
                            <span>
                              <span className="block text-[15px] font-bold text-[#0d1b33]">{o.title}</span>
                              <span className="mt-0.5 block text-xs text-[#5a6a86]">{o.desc}</span>
                            </span>
                            <span
                              className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                selected ? "border-[#1d4fd8] bg-[#1d4fd8] text-white" : "border-[#0d1b33]/20"
                              }`}
                              aria-hidden="true"
                            >
                              {selected && <Check className="h-3 w-3" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.fieldset>
                )}

                {/* ── STEP 3 · Refusals ── */}
                {step === 3 && (
                  <motion.fieldset
                    key="step-ref"
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <legend className="font-display text-xl font-extrabold text-[#0d1b33] sm:text-2xl">
                      Have you ever been refused a visa?
                    </legend>
                    <p className="mt-2 text-sm text-[#5a6a86]">
                      It happens more often than you think — refusals are very recoverable with the right file.
                    </p>
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(
                        [
                          { value: "no" as Refusals, title: "Never refused", desc: "Clean travel record" },
                          { value: "yes" as Refusals, title: "Yes, once or more", desc: "We specialise in refusals" },
                        ]
                      ).map((o) => {
                        const selected = refusals === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => choose(setRefusals, o.value)}
                            aria-pressed={selected}
                            className={`rounded-2xl border p-4 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4fd8] ${
                              selected
                                ? "border-[#1d4fd8] bg-[#f0f4fd] shadow-[0_10px_30px_-14px_rgba(29,79,216,0.55)]"
                                : "border-[#0d1b33]/10 bg-white hover:border-[#1d4fd8]/45"
                            }`}
                          >
                            <span className="block text-[15px] font-bold text-[#0d1b33]">{o.title}</span>
                            <span className="mt-0.5 block text-xs text-[#5a6a86]">{o.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.fieldset>
                )}

                {/* ── STEP 4 · Contact ── */}
                {step === 4 && (
                  <motion.fieldset
                    key="step-contact"
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <legend className="font-display text-xl font-extrabold text-[#0d1b33] sm:text-2xl">
                      Where should we send your result?
                    </legend>
                    <p className="mt-2 text-sm text-[#5a6a86]">
                      A senior consultant reviews every check personally — expect a call within 24 hours.
                    </p>
                    <div className="mt-5 space-y-3.5">
                      <div>
                        <label htmlFor="eq-name" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#3d4d6b]">
                          Full name
                        </label>
                        <Input
                          id="eq-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ahmed Raza"
                          autoComplete="name"
                          aria-invalid={!!errors.name}
                          className="h-11 rounded-xl border-[#0d1b33]/12 bg-[#f8baff02] focus-visible:ring-[#1d4fd8]/40"
                        />
                        {errors.name && <p className="mt-1 text-xs font-semibold text-[#e23a3a]">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="eq-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#3d4d6b]">
                          Phone / WhatsApp
                        </label>
                        <Input
                          id="eq-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 3XX XXXXXXX"
                          autoComplete="tel"
                          aria-invalid={!!errors.phone}
                          className="h-11 rounded-xl border-[#0d1b33]/12 focus-visible:ring-[#1d4fd8]/40"
                        />
                        {errors.phone && <p className="mt-1 text-xs font-semibold text-[#e23a3a]">{errors.phone}</p>}
                      </div>
                      <div>
                        <label htmlFor="eq-email" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#3d4d6b]">
                          Email
                        </label>
                        <Input
                          id="eq-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          className="h-11 rounded-xl border-[#0d1b33]/12 focus-visible:ring-[#1d4fd8]/40"
                        />
                        {errors.email && <p className="mt-1 text-xs font-semibold text-[#e23a3a]">{errors.email}</p>}
                      </div>
                    </div>
                    {serverError && (
                      <p role="alert" className="mt-4 rounded-xl bg-[#e23a3a]/8 px-4 py-3 text-[13px] font-semibold text-[#e23a3a]">
                        {serverError}
                      </p>
                    )}
                    <Button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="group relative mt-5 h-12 w-full overflow-hidden rounded-full bg-[#1d4fd8] text-[15px] font-bold text-white shadow-[0_14px_36px_-12px_rgba(29,79,216,0.7)] hover:bg-[#1a46c2] disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                          Checking your profile…
                        </>
                      ) : (
                        <>
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                          Reveal My Result
                          <ArrowRight className="ml-1.5 h-4.5 w-4.5" />
                        </>
                      )}
                    </Button>
                    <p className="mt-3 text-center text-[11px] leading-relaxed text-[#8291ab]">
                      By continuing you agree to be contacted about your enquiry. No spam, ever.
                    </p>
                  </motion.fieldset>
                )}

                {/* ── RESULT ── */}
                {step === TOTAL_STEPS && readiness && (
                  <motion.div
                    key="step-result"
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: EASE }}
                    role="status"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Score ring */}
                      <div className="relative h-32 w-32">
                        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
                          <circle cx="60" cy="60" r="52" fill="none" stroke="#f0f4fd" strokeWidth="10" />
                          <motion.circle
                            cx="60"
                            cy="60"
                            r="52"
                            fill="none"
                            strokeWidth="10"
                            strokeLinecap="round"
                            className={READINESS_META[readiness].ring}
                            stroke="currentColor"
                            initial={{ strokeDashoffset: 327 }}
                            animate={{ strokeDashoffset: 327 - (327 * READINESS_SCORE[readiness]) / 100 }}
                            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
                            strokeDasharray="327"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-display text-3xl font-extrabold text-[#0d1b33]">
                            {READINESS_SCORE[readiness]}%
                          </span>
                          <span className={`mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${READINESS_META[readiness].ring}`}>
                            {READINESS_SHORT[readiness]}
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-4 font-display text-xl font-extrabold text-[#0d1b33] sm:text-2xl">
                        {READINESS_META[readiness].headline}
                      </h3>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#5a6a86]">
                        {READINESS_META[readiness].blurb}
                      </p>

                      <span className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ${READINESS_META[readiness].chip}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${READINESS_META[readiness].dot}`} aria-hidden="true" />
                        {goal} · {destination}
                      </span>
                    </div>

                    <ul className="mt-6 space-y-2.5 rounded-2xl bg-[#f5f8fe] p-4 sm:p-5">
                      {RESULT_BULLETS[readiness].map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-[#3d4d6b]">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1d4fd8]" aria-hidden="true" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      <Button
                        asChild
                        className="h-11 rounded-full bg-[#1d4fd8] text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(29,79,216,0.7)] hover:bg-[#1a46c2]"
                      >
                        <a href="#booking">
                          <CalendarCheck className="mr-1.5 h-4 w-4" />
                          Book Free Consultation
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 rounded-full border-emerald-500/40 bg-white text-sm font-bold text-emerald-600 hover:bg-emerald-50"
                      >
                        <a href={`https://wa.me/923124541361?text=${whatsappSummary()}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-1.5 h-4 w-4" />
                          Send on WhatsApp
                        </a>
                      </Button>
                    </div>

                    <button
                      type="button"
                      onClick={reset}
                      className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#8291ab] transition-colors hover:text-[#1d4fd8]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      Retake the check
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer nav for choice steps */}
            {step > 0 && step < TOTAL_STEPS && (
              <div className="mt-6 flex items-center justify-between border-t border-[#0d1b33]/8 pt-4">
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-[#5a6a86] transition-colors hover:bg-[#f0f4fd] hover:text-[#1d4fd8]"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </button>
                {!stepAnswered[step] && (
                  <span className="text-[11px] font-medium text-[#8291ab]">Pick an option to continue</span>
                )}
                <button
                  type="button"
                  onClick={() => stepAnswered[step] && go(step + 1)}
                  disabled={!stepAnswered[step]}
                  aria-label="Next step"
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    stepAnswered[step]
                      ? "bg-[#1d4fd8] text-white shadow-[0_8px_20px_-8px_rgba(29,79,216,0.8)] hover:bg-[#1a46c2]"
                      : "cursor-not-allowed bg-[#f0f4fd] text-[#8291ab]"
                  }`}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
            {step === 0 && (
              <p className="mt-6 border-t border-[#0d1b33]/8 pt-4 text-center text-[11px] font-medium text-[#8291ab]">
                Indicative result only — not a legal assessment. Final advice follows a consultant review.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
