"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_STATS } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Autoplay fallback
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => undefined);
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <section ref={sectionRef} id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Cinematic background — airliner cruising above the clouds */}
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        {/* Poster stays beneath the video: instant paint + graceful fallback */}
        <Image
          src="/images/hero-plane-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_50%]"
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          className={`h-full w-full object-cover object-[62%_50%] transition-opacity duration-[1800ms] ease-out ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          poster="/images/hero-plane-poster.jpg"
          src="/videos/hero-plane-flight.mp4"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          aria-hidden="true"
        />
      </motion.div>

      {/* Cinematic scrims — readable left column, sky stays visible on the right */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 via-white/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/25 to-transparent sm:from-white/70 sm:via-white/15" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#f7f9fd]" />

      {/* Editorial content — anchored left, breathes against the sky on the right */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:pt-36"
      >
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
            className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#1d4fd8] sm:text-xs"
          >
            <span className="h-px w-8 bg-[#1d4fd8]/60 sm:w-10" aria-hidden="true" />
            Trusted visa consultants since 2010
          </motion.p>

          {/* Headline */}
          <h1 className="mt-5 font-display text-[11.5vw] font-extrabold leading-[1.06] tracking-[-0.02em] text-[#0d1b33] sm:text-6xl lg:text-7xl xl:text-[5.1rem]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.85, ease: EASE }}
            >
              Your Passport
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.85, ease: EASE }}
            >
              To The{" "}
              <span className="font-serif-accent font-semibold italic tracking-normal text-[#1d4fd8]">
                World
              </span>
              <span className="text-[#1d4fd8]">.</span>
            </motion.span>
          </h1>

          {/* Subcopy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56, duration: 0.8, ease: EASE }}
            className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#3d4d6b] sm:mt-6 sm:text-lg"
          >
            Visit, study, work or reunite — expert guidance and a flawless file for
            embassies across <span className="font-bold text-[#0d1b33]">40+ countries</span>,
            prepared for you end to end.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
            className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-4"
          >
            <Button
              asChild
              size="lg"
              className="group relative h-13 w-full overflow-hidden rounded-full bg-[#1d4fd8] px-8 text-[15px] font-bold text-white shadow-[0_18px_44px_-14px_rgba(29,79,216,0.75)] transition-all hover:bg-[#1a46c2] sm:h-14 sm:w-auto sm:px-9"
            >
              <a href="#contact">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Free Consultation
                <ArrowRight className="ml-2 h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 w-full rounded-full border-[#0d1b33]/12 bg-white/85 px-8 text-[15px] font-semibold text-[#0d1b33] shadow-[0_12px_32px_-16px_rgba(13,27,51,0.35)] backdrop-blur-md hover:bg-white sm:h-14 sm:w-auto sm:px-9"
            >
              <a href="#services">Explore Services</a>
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.88, duration: 0.9 }}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <span className="flex items-center gap-1" aria-label="Rated 4.9 out of 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1 text-[13px] font-bold text-[#0d1b33]">4.9</span>
            </span>
            <span className="hidden h-3.5 w-px bg-[#0d1b33]/15 sm:block" aria-hidden="true" />
            <span className="text-[13px] font-medium text-[#3d4d6b]">
              12,400+ visas approved · 98% client satisfaction
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats — grounded glass strip at the bottom of the hero */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.9, ease: EASE }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-6 sm:px-8 sm:pb-8"
      >
        <div className="grid grid-cols-2 gap-y-4 rounded-2xl border border-white/70 bg-white/80 px-4 py-4 shadow-[0_24px_60px_-28px_rgba(13,27,51,0.4)] backdrop-blur-xl sm:rounded-3xl sm:px-8 sm:py-5 md:grid-cols-4">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center gap-0.5 text-center ${
                i > 0 ? "md:border-l md:border-[#0d1b33]/10" : ""
              } ${i % 2 === 1 ? "pr-16 sm:pr-14 md:pr-0" : ""}`}
            >
              <span className="font-display text-2xl font-extrabold leading-none text-[#1d4fd8] sm:text-3xl">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#5a6a86] sm:text-[10.5px]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
