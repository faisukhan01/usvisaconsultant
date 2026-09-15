"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plane, GraduationCap, HeartHandshake, Briefcase, FileCheck2, MessagesSquare, ArrowUpRight, Clock } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { SERVICES } from "@/lib/site-data";

const ICONS: Record<string, typeof Plane> = {
  plane: Plane,
  graduation: GraduationCap,
  heart: HeartHandshake,
  briefcase: Briefcase,
  file: FileCheck2,
  message: MessagesSquare,
};

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

function TiltCard({ children, className, intensity = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 180, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Services() {
  const primary = SERVICES.slice(0, 3);
  const secondary = SERVICES.slice(3);

  return (
    <section id="services" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="pointer-events-none absolute -right-52 top-40 h-[30rem] w-[30rem] rounded-full bg-gold/[0.07] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our Services"
          title={
            <>
              Comprehensive visa services, <span className="text-gradient-gold font-serif-accent italic">offered end-to-end</span>
            </>
          }
          description="From the first assessment to the stamp in your passport — every service is handled in-house by specialists who do this every single day."
        />

        {/* Primary 3 tilt cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {primary.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Plane;
            return (
              <Reveal key={s.id} delay={i * 0.1}>
                <TiltCard className="h-full">
                  <article className="shimmer group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-7 transition-colors duration-500 hover:border-gold/35 hover:shadow-[0_24px_70px_-20px_rgba(232,182,76,0.35)]">
                    {/* Glow corner */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gold/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="flex items-start justify-between">
                      <span
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/25 to-gold/5 shadow-[0_8px_24px_rgba(232,182,76,0.25)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                        style={{ transform: "translateZ(40px)" }}
                      >
                        <Icon className="h-6.5 w-6.5 text-gold" />
                      </span>
                      <span className="font-display text-5xl font-extrabold text-white/8 transition-colors duration-500 group-hover:text-gold/25">
                        {s.number}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-xl font-bold text-foreground" style={{ transform: "translateZ(30px)" }}>
                      {s.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>

                    <ul className="mt-5 space-y-2">
                      {s.points.slice(0, 3).map((p) => (
                        <li key={p} className="flex items-center gap-2 text-[13px] text-foreground/75">
                          <span className="h-1 w-1 rounded-full bg-gold" />
                          {p}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold">
                        <Clock className="h-3 w-3" /> {s.processing}
                      </span>
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-1 text-sm font-bold text-foreground transition-colors hover:text-gold"
                        aria-label={`Enquire about ${s.title}`}
                      >
                        Enquire
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {/* Secondary compact cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Plane;
            return (
              <Reveal key={s.id} delay={0.1 + i * 0.08}>
                <TiltCard intensity={6}>
                  <article className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition-all duration-500 hover:border-gold/30 hover:bg-gold/[0.05]">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-5.5 w-5.5 text-gold" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="truncate font-display text-[15px] font-bold text-foreground">{s.title}</h4>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
