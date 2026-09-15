"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, MapPin } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/site/reveal";
import { TESTIMONIALS } from "@/lib/site-data";

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

        <Reveal delay={0.15}>
          <div className="relative mt-14">
            {/* Big quote mark */}
            <Quote className="absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 text-gold/15" />

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
                      <Star key={i} className="h-4.5 w-4.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="mt-5 max-w-2xl font-display text-lg font-medium leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-4">
                    <span className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-soft font-display text-base font-bold text-[#17130a] sm:h-14 sm:w-14">
                      {t.initials}
                    </span>
                    <span className="text-left">
                      <span className="block font-bold text-foreground">{t.name}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {t.location}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gold/60" />
                        <span className="text-gold">{t.service}</span>
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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
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
                      i === index ? "w-8 bg-gold" : "w-2 bg-white/20 hover:bg-white/40"
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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
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
