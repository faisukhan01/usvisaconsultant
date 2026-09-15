"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BadgeCheck, Quote, Award, Users, Target } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";

const VALUES = [
  {
    icon: Award,
    title: "Expert Guidance",
    text: "Seasoned professionals dedicated to your case from the first call to the final stamp.",
  },
  {
    icon: Target,
    title: "Personalized Approach",
    text: "We dig into your unique circumstances and build the strategy that fits them — never a template.",
  },
  {
    icon: BadgeCheck,
    title: "Commitment to Success",
    text: "An unwavering dedication to your approval is what sets us apart in this industry.",
  },
];

export function About() {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgWrapRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About Us"
          title={
            <>
              Discover the journey of our <span className="text-gradient-gold font-serif-accent italic">commitment</span> to visa success
            </>
          }
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image side */}
          <div ref={imgWrapRef} className="relative">
            <Reveal>
              <div className="gold-ring relative overflow-hidden rounded-[2rem]">
                <motion.div style={{ y: imgY }} className="relative aspect-[4/3] scale-[1.18]">
                  <Image
                    src="/images/about-office.png"
                    alt="US Visa Consultant office — advisors guiding clients with skyline view"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={false}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080a]/70 via-transparent to-transparent" />
              </div>
            </Reveal>

            {/* Floating founder card */}
            <Reveal delay={0.2} className="relative z-10 -mt-16 ml-4 max-w-sm sm:ml-8">
              <div className="glass gold-ring animate-floaty rounded-2xl p-5 shadow-2xl">
                <Quote className="h-5 w-5 text-gold" />
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  “We don’t process applications — we build futures, one approved visa at a time.”
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-soft font-display text-sm font-bold text-[#17130a]">
                    US
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">Ume Salma</p>
                    <p className="text-xs text-gold">Founder & Lead Consultant</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Experience badge */}
            <div className="glass gold-ring absolute -right-3 -top-6 flex h-28 w-28 flex-col items-center justify-center rounded-full text-center sm:-right-6 sm:h-32 sm:w-32">
              <span className="font-display text-3xl font-extrabold text-gradient-gold sm:text-4xl">15+</span>
              <span className="mt-1 max-w-[80px] text-[9.5px] font-semibold uppercase leading-tight tracking-[0.14em] text-muted-foreground">
                Years Of Excellence
              </span>
            </div>
          </div>

          {/* Text side */}
          <div>
            <Reveal>
              <h3 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
                Founded by seasoned professionals to{" "}
                <span className="text-gold">simplify the complex</span> visa process — for individuals worldwide.
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                What began as a small consultancy with a single conviction — that no dream should be
                buried under paperwork — has grown into a worldwide visa partner trusted by thousands of
                families, students and professionals.
              </p>
            </Reveal>

            <div className="mt-9 space-y-5">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={0.12 + i * 0.08}>
                  <div className="group flex gap-4 rounded-2xl border border-transparent p-4 transition-all hover:border-gold/20 hover:bg-gold/[0.04]">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <v.icon className="h-5.5 w-5.5 text-gold" />
                    </span>
                    <div>
                      <h4 className="font-display text-base font-bold text-foreground">{v.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.4}>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <Users className="h-4.5 w-4.5 text-emerald-400" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">8,000+ families</span> reunited & counting
                  </span>
                </div>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold"
                >
                  Learn more about us
                  <span className="h-px w-8 bg-gold transition-all group-hover:w-12" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
