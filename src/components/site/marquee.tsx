"use client";

import type { CSSProperties } from "react";
import { Globe2, Stamp, Award, Handshake, Headset, FileCheck } from "lucide-react";

const ITEMS = [
  { icon: Globe2, text: "40+ Countries Covered" },
  { icon: Stamp, text: "12,400+ Visas Approved" },
  { icon: Award, text: "ICCRC Registered Partners" },
  { icon: Handshake, text: "98% Client Satisfaction" },
  { icon: FileCheck, text: "Embassy-Standard Documentation" },
  { icon: Headset, text: "24/7 Application Support" },
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative border-y border-gold/15 bg-[#0b0b0e] py-5">
      <div className="marquee-paused flex overflow-hidden" aria-hidden="true">
        <div className="animate-marquee flex shrink-0 items-center" style={{ "--marquee-duration": "36s" } as CSSProperties}>
          {row.map((item, i) => (
            <div key={i} className="mx-7 flex shrink-0 items-center gap-3">
              <item.icon className="h-4.5 w-4.5 text-gold" />
              <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] text-foreground/70">
                {item.text}
              </span>
              <span className="ml-7 h-1.5 w-1.5 rotate-45 bg-gold/50" />
            </div>
          ))}
        </div>
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#0b0b0e] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#0b0b0e] to-transparent" />
    </div>
  );
}
