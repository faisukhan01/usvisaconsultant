"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PhoneCall, FolderCheck, Stamp, BadgeCheck } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { PROCESS_STEPS } from "@/lib/site-data";

const ICONS: Record<string, typeof PhoneCall> = {
  phone: PhoneCall,
  file: FolderCheck,
  stamp: Stamp,
  check: BadgeCheck,
};

export function Process() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 0.75", "end 0.55"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <section id="process" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-52 top-1/3 h-[26rem] w-[26rem] rounded-full bg-gold/[0.06] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              From first call to <span className="text-gradient-gold font-serif-accent italic">boarding pass</span> — in four steps
            </>
          }
          description="A transparent, guided journey. You always know exactly where your application stands and what happens next."
        />

        <div ref={lineRef} className="relative mx-auto mt-20 max-w-4xl">
          {/* Vertical progress rail */}
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-[#0d1b33]/10 sm:left-1/2 sm:-translate-x-1/2">
            <motion.div
              style={{ scaleY: progress }}
              className="h-full w-full origin-top bg-gradient-to-b from-[#1d4fd8] via-[#5b85ec] to-[#1d4fd8]/30 shadow-[0_0_12px_rgba(29,79,216,0.6)]"
            />
          </div>

          <div className="space-y-12 sm:space-y-16">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = ICONS[step.icon] ?? PhoneCall;
              const leftSide = i % 2 === 0;
              return (
                <Reveal key={step.step} delay={0.05 * i}>
                  <div className={`relative flex items-start gap-6 sm:gap-0 ${leftSide ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    {/* Node */}
                    <div className="relative z-10 shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                      <span className="relative flex h-13 w-13 items-center justify-center rounded-2xl border border-[#1d4fd8]/40 bg-white shadow-[0_10px_30px_-10px_rgba(29,79,216,0.6)]">
                        <Icon className="h-6 w-6 text-[#1d4fd8]" />
                        <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-[#1d4fd8]/40" />
                      </span>
                    </div>

                    {/* Card */}
                    <div className={`group flex-1 sm:w-1/2 ${leftSide ? "sm:pr-14" : "sm:pl-14"}`}>
                      <div className="glass gold-ring rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-[#1d4fd8]/[0.04]">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#1d4fd8]">
                            Step {step.step}
                          </span>
                          <span className="rounded-full bg-[#0d1b33]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5a6a86]">
                            {step.duration}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-lg font-bold text-foreground sm:text-xl">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                      </div>
                    </div>

                    {/* Spacer for alternate side */}
                    <div className="hidden sm:block sm:w-1/2" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
