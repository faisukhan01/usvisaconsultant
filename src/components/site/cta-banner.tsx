"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";

export function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  // Lazy-load: the banner only downloads/starts the video when it scrolls into
  // view, so it never competes with the hero video for bandwidth on slow links.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative px-4 py-10 sm:px-6">
      <Reveal>
        <div className="noise relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-gold/20 sm:rounded-[2.5rem]">
          {/* Video bg */}
          <motion.div style={{ scale }} className="absolute inset-0">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/videos/hero-sky-journey.mp4"
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[#0a142e]/72" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a142e]/88 via-[#0a142e]/35 to-[#0a142e]/88" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5b85ec]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#5b85ec]/50 to-transparent" />

          <div className="relative z-10 flex flex-col items-center px-5 py-16 text-center sm:px-6 sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#5b85ec]/40 bg-[#0a142e]/55 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9db9f9] backdrop-blur-md sm:text-[11px] sm:tracking-[0.22em]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9db9f9]" />
              Limited slots each week
            </span>
            <h2 className="mt-6 max-w-3xl font-display text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Ready to secure <span className="text-gradient-light font-serif-accent italic">your visa?</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Contact us today for expert assistance — and make your visa journey seamless,
              stress-free and successful.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="group relative h-13 overflow-hidden rounded-full bg-[#1d4fd8] px-9 text-base font-bold text-white shadow-[0_16px_50px_-12px_rgba(29,79,216,0.95)] transition-all hover:bg-[#1a46c2] sm:h-14"
              >
                <a href="#booking">
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
