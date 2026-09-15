"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";

const MILESTONES = [
  { year: "2010", label: "Founded in Lahore with a single desk and a big conviction" },
  { year: "2016", label: "5,000th approved visa — expansion to study & work routes" },
  { year: "Today", label: "40+ countries served by a team of licensed consultants" },
];

const PROMISES = [
  "A dedicated consultant on your case, start to stamp",
  "Embassy-standard documentation — zero guesswork",
  "Honest eligibility assessment before you pay a rupee",
];

export function About() {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgWrapRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* ── Visual — one clean frame, quietly framed ─────────── */}
          <div ref={imgWrapRef} className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <Reveal>
              <div className="relative">
                {/* offset frame accent */}
                <div
                  aria-hidden="true"
                  className="absolute -left-3 -top-3 h-full w-full rounded-[1.75rem] border border-[#1d4fd8]/15 sm:-left-4 sm:-top-4"
                />
                <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_36px_90px_-36px_rgba(13,27,51,0.45)] ring-1 ring-[#0d1b33]/8">
                  <motion.div style={{ y: imgY }} className="relative aspect-[4/3] scale-[1.14]">
                    <Image
                      src="/images/about-office.png"
                      alt="US Visa Consultant office — advisors guiding clients with skyline view"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a142e]/25 via-transparent to-transparent" />
                </div>
              </div>
            </Reveal>

            {/* Founder chip — aligned below, no overlap */}
            <Reveal delay={0.2}>
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#0d1b33]/8 bg-white px-5 py-4 shadow-[0_14px_40px_-22px_rgba(13,27,51,0.35)]">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#1d4fd8]/20">
                  <Image
                    src="/images/founder.png"
                    alt="Ume Salma — Founder, US Visa Consultant"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#0d1b33]">
                    Ume Salma
                    <span className="ml-2 text-xs font-semibold text-[#1d4fd8]">Founder & Lead Consultant</span>
                  </p>
                  <p className="mt-0.5 truncate text-[13px] italic text-[#5a6a86]">
                    “We build futures, one approved visa at a time.”
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Story ────────────────────────────────────────────── */}
          <div>
            <Reveal>
              <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#1d4fd8] sm:text-xs">
                <span className="h-px w-8 bg-[#1d4fd8]/60" aria-hidden="true" />
                Our Story
              </p>
              <h2 className="mt-4 font-display text-[27px] font-extrabold leading-[1.15] tracking-tight text-[#0d1b33] sm:text-4xl lg:text-[2.6rem]">
                Built on commitment.
                <br />
                Proven by <span className="font-serif-accent font-semibold italic text-[#1d4fd8]">approvals</span>.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl leading-relaxed text-[#5a6a86] sm:text-[17px]">
                What began as a small consultancy with one conviction — that no dream should be
                buried under paperwork — is today a worldwide visa partner trusted by thousands of
                families, students and professionals.
              </p>
            </Reveal>

            {/* Milestones — quiet vertical timeline */}
            <div className="mt-8 space-y-0">
              {MILESTONES.map((m, i) => (
                <Reveal key={m.year} delay={0.14 + i * 0.08}>
                  <div className="relative flex gap-5 pb-6 last:pb-0">
                    {i < MILESTONES.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[27px] top-11 h-[calc(100%-2.4rem)] w-px bg-gradient-to-b from-[#1d4fd8]/35 to-[#1d4fd8]/8"
                      />
                    )}
                    <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f0f4fd] font-display text-[13px] font-extrabold text-[#1d4fd8] ring-1 ring-[#1d4fd8]/15">
                      {m.year}
                    </span>
                    <p className="pt-1.5 text-sm leading-relaxed text-[#3d4d6b] sm:text-[15px]">{m.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Promises checklist */}
            <Reveal delay={0.34}>
              <ul className="mt-8 space-y-2.5 border-t border-[#0d1b33]/8 pt-7">
                {PROMISES.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-[#3d4d6b] sm:text-[15px]">
                    <BadgeCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#1d4fd8]" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.42}>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Button
                  asChild
                  className="group relative h-12 overflow-hidden rounded-full bg-[#1d4fd8] px-7 text-[15px] font-bold text-white shadow-[0_14px_36px_-12px_rgba(29,79,216,0.7)] hover:bg-[#1a46c2]"
                >
                  <a href="#contact">
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    Start Your Story
                    <ArrowRight className="ml-1.5 h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <p className="text-[13px] font-semibold text-[#5a6a86]">
                  <span className="font-display text-lg font-extrabold text-[#0d1b33]">8,000+</span>{" "}
                  families reunited & counting
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
