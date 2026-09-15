"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, MapPin } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/site/reveal";
import { TESTIMONIALS } from "@/lib/site-data";

const RATING_BARS = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 6 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function GoogleRatingBadge() {
  return (
    <Reveal delay={0.1}>
      <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-6 rounded-2xl border border-[#0d1b33]/8 bg-white/85 p-6 shadow-[0_18px_50px_-30px_rgba(13,27,51,0.45)] backdrop-blur-md sm:flex-row sm:gap-8 sm:p-7">
        {/* Score side */}
        <div className="flex shrink-0 flex-col items-center">
          <div className="flex items-center gap-2.5">
            <GoogleG className="h-7 w-7" />
            <span className="font-display text-4xl font-extrabold leading-none text-[#0d1b33]">
              4.9
            </span>
          </div>
          <div className="mt-2 flex gap-0.5" aria-label="Rated 4.9 out of 5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-wider text-[#5a6a86]">
            180+ Google reviews
          </p>
        </div>

        {/* Bars side */}
        <div className="w-full space-y-1.5">
          {RATING_BARS.map((b) => (
            <div key={b.stars} className="flex items-center gap-2.5">
              <span className="w-6 shrink-0 text-right text-[11px] font-bold text-[#5a6a86]">
                {b.stars}★
              </span>
              <div
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0d1b33]/8"
                role="presentation"
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${b.pct}%` }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]"
                />
              </div>
              <span className="w-8 shrink-0 text-[11px] font-semibold tabular-nums text-[#8291ab]">
                {b.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const resetTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => go(1), 6000);
  }, [go]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [resetTimer]);

  const t = TESTIMONIALS[index];

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.05] blur-[130px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              What our <span className="text-gradient-gold font-serif-accent italic">clients say</span> about us
            </>
          }
        />

        <GoogleRatingBadge />

        <Reveal delay={0.15}>
          <div className="relative mt-14">
            {/* Big quote mark */}
            <Quote className="absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 text-[#1d4fd8]/12" />

            <div className="glass gold-ring relative min-h-[320px] overflow-hidden rounded-[2rem] p-8 sm:min-h-[280px] sm:p-12">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.figure
                  key={index}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: direction * -60, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex gap-1" aria-label={`${t.rating} star rating`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <blockquote className="mt-5 max-w-2xl font-display text-lg font-medium leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-4">
                    <span className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-[#1d4fd8] to-[#5b85ec] font-display text-base font-bold text-white sm:h-14 sm:w-14">
                      {t.initials}
                    </span>
                    <span className="text-left">
                      <span className="block font-bold text-foreground">{t.name}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {t.location}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[#1d4fd8]/60" />
                        <span className="font-semibold text-[#1d4fd8]">{t.service}</span>
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                onClick={() => {
                  go(-1);
                  resetTimer();
                }}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0d1b33]/10 bg-white text-[#0d1b33] shadow-sm transition-all hover:border-[#1d4fd8]/40 hover:bg-[#1d4fd8]/8 hover:text-[#1d4fd8]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                      resetTimer();
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === index ? "w-8 bg-[#1d4fd8]" : "w-2 bg-[#0d1b33]/15 hover:bg-[#0d1b33]/30"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  go(1);
                  resetTimer();
                }}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0d1b33]/10 bg-white text-[#0d1b33] shadow-sm transition-all hover:border-[#1d4fd8]/40 hover:bg-[#1d4fd8]/8 hover:text-[#1d4fd8]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
