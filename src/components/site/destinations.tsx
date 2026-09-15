"use client";

import Image from "next/image";
import { ArrowUpRight, TrendingUp, Timer } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { DESTINATIONS } from "@/lib/site-data";

export function Destinations() {
  return (
    <section id="destinations" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-24 h-[24rem] w-[24rem] rounded-full bg-gold/[0.05] blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Visa Destinations"
          title={
            <>
              Where will your <span className="text-gradient-gold font-serif-accent italic">next chapter</span> begin?
            </>
          }
          description="Our most-travelled routes, with real approval rates and honest timelines. Your destination isn't listed? We almost certainly cover it too."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d, i) => (
            <Reveal key={d.id} delay={(i % 3) * 0.1}>
              <article className="group relative overflow-hidden rounded-3xl border border-white/8 bg-card transition-all duration-700 hover:border-gold/40 hover:shadow-[0_30px_80px_-24px_rgba(232,182,76,0.4)]">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={d.image}
                    alt={`${d.city}, ${d.country} — visa assistance`}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/25 to-transparent" />

                  {/* Tag */}
                  <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold backdrop-blur-md">
                    {d.tag}
                  </span>

                  {/* Success rate */}
                  <div className="glass absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-foreground">{d.success}</span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/90">{d.country}</p>
                    <div className="mt-1 flex items-end justify-between gap-2">
                      <h3 className="font-display text-2xl font-bold text-white">{d.city}</h3>
                      <span className="flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full bg-gold text-[#17130a] opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-4.5 w-4.5" />
                      </span>
                    </div>

                    {/* Reveal-on-hover details */}
                    <div className="mt-3 max-h-0 overflow-hidden opacity-0 transition-all duration-700 group-hover:max-h-32 group-hover:opacity-100">
                      <div className="flex flex-wrap gap-1.5">
                        {d.visas.map((v) => (
                          <span key={v} className="rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                            {v} Visa
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-white/70">
                        <Timer className="h-3 w-3 text-gold" />
                        Typical processing: {d.time}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            + 34 more countries across Europe, Asia, Africa & the Americas —{" "}
            <a href="#contact" className="font-semibold text-gold underline-offset-4 hover:underline">
              ask us about yours
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
