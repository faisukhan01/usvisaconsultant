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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => undefined);
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <section ref={ref} className="relative px-4 py-10 sm:px-6">
      <Reveal>
        <div className="noise relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-gold/20">
          {/* Video bg */}
          <motion.div style={{ scale }} className="absolute inset-0">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/videos/plane-through-clouds.mp4"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-hidden="true"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[#08080a]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08080a]/85 via-transparent to-[#08080a]/85" />

          <div className="relative z-10 flex flex-col items-center px-6 py-20 text-center sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Limited slots each week
            </span>
            <h2 className="mt-6 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Ready to secure <span className="text-gradient-gold font-serif-accent italic">your visa?</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Contact us today for expert assistance — and make your visa journey seamless,
              stress-free and successful.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="group relative h-14 overflow-hidden rounded-full bg-gold px-9 text-base font-bold text-[#17130a] shadow-[0_0_40px_rgba(232,182,76,0.45)] hover:shadow-[0_0_60px_rgba(232,182,76,0.65)]"
              >
                <a href="#contact">
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
