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
    <div className="relative border-y border-[#0d1b33]/8 bg-white py-4.5">
      <div className="marquee-paused flex overflow-hidden" aria-hidden="true">
        <div className="animate-marquee flex shrink-0 items-center" style={{ "--marquee-duration": "36s" } as CSSProperties}>
          {row.map((item, i) => (
            <div key={i} className="mx-7 flex shrink-0 items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d4fd8]/10">
                <item.icon className="h-4 w-4 text-[#1d4fd8]" />
              </span>
              <span className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.16em] text-[#3d4d6b]">
                {item.text}
              </span>
              <span className="ml-7 h-1.5 w-1.5 rotate-45 bg-[#e23a3a]/70" />
            </div>
          ))}
        </div>
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent sm:w-32" />
    </div>
  );
}
