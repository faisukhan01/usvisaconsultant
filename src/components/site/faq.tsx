"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { FAQS } from "@/lib/site-data";

export function Faq() {
  return (
    <section id="faq" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-gold/[0.05] blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions? <span className="text-gradient-gold font-serif-accent italic">Answered.</span>
            </>
          }
          description="Everything people usually ask before starting their visa journey with us."
        />

        <Reveal delay={0.15}>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="overflow-hidden rounded-2xl border border-[#0d1b33]/8 bg-white px-5 shadow-[0_12px_36px_-28px_rgba(13,27,51,0.45)] transition-colors data-[state=open]:border-[#1d4fd8]/30 data-[state=open]:bg-[#1d4fd8]/[0.04]"
              >
                <AccordionTrigger className="py-5 text-left font-display text-[15px] font-bold text-[#0d1b33] hover:no-underline sm:text-base [&[data-state=open]>svg]:text-[#1d4fd8]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
