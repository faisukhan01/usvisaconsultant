"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Reveal } from "@/components/site/reveal";
import { Loader2 } from "lucide-react";

const GlobeScene = dynamic(() => import("@/components/three/globe-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gold/70" />
    </div>
  ),
});

const ROUTE_CHIPS = [
  { from: "Lahore", to: "London", days: "9h 40m" },
  { from: "Karachi", to: "New York", days: "14h 20m" },
  { from: "Islamabad", to: "Toronto", days: "13h 05m" },
  { from: "Lahore", to: "Dubai", days: "3h 15m" },
  { from: "Lahore", to: "Sydney", days: "12h 50m" },
  { from: "Karachi", to: "Paris", days: "8h 55m" },
];

export function GlobeSection() {
  return (
    <section id="global" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-gold/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-gold/5 blur-[140px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
        {/* Copy */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Global Reach
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
              One Hub.
              <br />
              <span className="text-gradient-gold">Every Corner Of The World.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              From our home base in Lahore, we file applications across 40+ countries — every route mapped,
              every requirement known, every embassy relationship earned through years of trust.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {ROUTE_CHIPS.map((r) => (
                <div
                  key={`${r.from}-${r.to}`}
                  className="group gold-ring glass flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-gold/[0.06]"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">{r.from}</span>
                    <span className="relative inline-flex h-px w-8 bg-gold/40">
                      <span className="absolute -right-0.5 -top-[3px] h-[7px] w-[7px] rotate-45 border-r border-t border-gold" />
                    </span>
                    <span className="font-medium text-foreground">{r.to}</span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold">{r.days}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-gold/70" />
              Drag the globe to explore our live routes
            </p>
          </Reveal>
        </div>

        {/* 3D Globe */}
        <div className="relative order-1 h-[380px] sm:h-[480px] lg:order-2 lg:h-[620px]">
          <div className="absolute inset-0 rounded-full bg-gold/[0.04] blur-3xl" />
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-gold/60" />
              </div>
            }
          >
            <GlobeScene />
          </Suspense>

          {/* Floating badges */}
          <div className="animate-floaty gold-ring glass absolute left-2 top-8 hidden rounded-2xl px-4 py-3 sm:block">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Countries</p>
            <p className="font-display text-2xl font-bold text-gradient-gold">40+</p>
          </div>
          <div
            className="animate-floaty gold-ring glass absolute bottom-10 right-2 hidden rounded-2xl px-4 py-3 sm:block"
            style={{ animationDelay: "1.6s" }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Visas Approved</p>
            <p className="font-display text-2xl font-bold text-gradient-gold">12,400+</p>
          </div>
        </div>
      </div>
    </section>
  );
}
