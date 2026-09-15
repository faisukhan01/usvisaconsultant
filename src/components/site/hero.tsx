"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_STATS } from "@/lib/site-data";

const HEADLINE = ["Your", "Passport", "To", "The"];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
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
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

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
    <section ref={sectionRef} id="home" className="noise relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Video background */}
      <motion.div style={{ y: yBg, scale }} className="absolute inset-0">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-[1600ms] ${videoReady ? "opacity-100" : "opacity-0"}`}
          src="/videos/plane-takeoff-sunrise.mp4"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          aria-hidden="true"
        />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080a]/85 via-[#08080a]/55 to-[#08080a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(8,8,10,0.75)_100%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-gold/15 blur-[150px]" />

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-28 pt-40 sm:px-6 sm:pt-44">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-black/40 py-1.5 pl-2 pr-4 backdrop-blur-md"
          >
            <span className="flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#17130a]">
              <Sparkles className="h-3 w-3" /> Since 2010
            </span>
            <span className="text-xs font-medium tracking-wide text-foreground/90">
              Trusted Worldwide Visa Assistance Partner
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-[13vw] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
            {HEADLINE.map((word, i) => (
              <motion.span
                key={word}
                className="mr-[0.28em] inline-block"
                initial={{ opacity: 0, y: 60, rotateX: -50 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 2.1 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              className="text-gradient-gold inline-block font-serif-accent italic"
              initial={{ opacity: 0, y: 60, rotateX: -50 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 2.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              World.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.75, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg"
          >
            Expert guidance for every visa journey — visit, study, work or family.
            A smooth, successful application process tailored just for you, in{" "}
            <span className="font-semibold text-gold">40+ countries</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="group relative h-14 overflow-hidden rounded-full bg-gold px-8 text-base font-bold text-[#17130a] shadow-[0_0_40px_rgba(232,182,76,0.4)] transition-all hover:shadow-[0_0_60px_rgba(232,182,76,0.6)]"
            >
              <a href="#contact">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Start My Visa Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="glass h-14 rounded-full px-8 text-base font-semibold text-foreground hover:bg-white/10"
            >
              <a href="#services">
                <PlayCircle className="mr-2 h-5 w-5 text-gold" />
                Explore Services
              </a>
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 1 }}
            className="mt-7 flex items-center gap-2 text-xs text-foreground/60"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Licensed advisors · Embassy-standard files · 98% satisfaction
          </motion.div>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 z-10"
      >
        <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
          <div className="glass gold-ring grid grid-cols-2 gap-y-6 rounded-3xl px-6 py-6 sm:px-10 md:grid-cols-4">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center md:items-start md:text-left">
                <span className="font-display text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </span>
                <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.6 }}
        className="absolute bottom-36 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground lg:flex"
      >
        <span className="flex h-9 w-5.5 items-start justify-center rounded-full border border-white/20 p-1.5">
          <span className="animate-scroll-dot h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
      </motion.a>
    </section>
  );
}
