"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, Send, Loader2, Check, Plane } from "lucide-react";
import { NAV_LINKS, SERVICES, SITE } from "@/lib/site-data";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      toast({ title: "Subscribed!", description: "Visa tips & updates are on their way." });
    } catch {
      toast({ title: "Subscription failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[#0d1b33]/10 bg-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#1d4fd8]/60 to-transparent" />
      <div className="pointer-events-none absolute -top-20 left-1/4 h-44 w-44 rounded-full bg-[#1d4fd8]/[0.06] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <a href="#home" className="inline-flex items-center gap-4" aria-label="US Visa Consultant — home">
              <span className="flex h-18 w-18 items-center justify-center rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(13,27,51,0.35)] ring-1 ring-[#0d1b33]/10 sm:h-20 sm:w-20">
                <Image
                  src="/logo.png"
                  alt="US Visa Consultant official logo"
                  width={80}
                  height={80}
                  className="h-15 w-15 object-contain sm:h-17 sm:w-17"
                />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-extrabold tracking-wide text-[#0d1b33] sm:text-xl">
                  US VISA <span className="text-[#1d4fd8]">CONSULTANT</span>
                </span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.3em] text-[#e23a3a]">
                  World Wide Visa
                </span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#5a6a86]">
              Expert guidance for all your visa needs — ensuring a smooth and successful application
              process tailored just for you, anywhere in the world.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0d1b33]/10 bg-white text-[#5a6a86] transition-all duration-300 hover:-translate-y-1 hover:border-[#1d4fd8]/40 hover:bg-[#1d4fd8] hover:text-white"
                >
                  <s.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[#0d1b33]">Explore</h4>
              <ul className="mt-5 space-y-2.5">
                {NAV_LINKS.slice(1, 6).map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="group inline-flex items-center gap-2 text-sm text-[#5a6a86] transition-colors hover:text-[#1d4fd8]">
                      <span className="h-0.5 w-0 rounded-full bg-[#1d4fd8] transition-all duration-300 group-hover:w-3" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[#0d1b33]">Services</h4>
              <ul className="mt-5 space-y-2.5">
                {SERVICES.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <a href="#services" className="group inline-flex items-center gap-2 text-sm text-[#5a6a86] transition-colors hover:text-[#1d4fd8]">
                      <span className="h-0.5 w-0 rounded-full bg-[#1d4fd8] transition-all duration-300 group-hover:w-3" />
                      {s.short}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[#0d1b33]">Contact</h4>
              <ul className="mt-5 space-y-3 text-sm text-[#5a6a86]">
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#1d4fd8]" />
                  <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-[#1d4fd8]">{SITE.email}</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#1d4fd8]" />
                  <a href={`tel:${SITE.phone}`} className="transition-colors hover:text-[#1d4fd8]">{SITE.phone}</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1d4fd8]" />
                  {SITE.address}
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[#0d1b33]">Visa Insights</h4>
            <p className="mt-5 text-sm leading-relaxed text-[#5a6a86]">
              Monthly embassy updates, deadline alerts and approval tips — straight to your inbox.
            </p>
            <form onSubmit={subscribe} className="mt-5 flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setDone(false);
                }}
                aria-label="Email for newsletter"
                className="h-11 rounded-xl border-[#0d1b33]/12 bg-[#f5f8fe] focus-visible:ring-[#1d4fd8]/40"
              />
              <Button
                type="submit"
                disabled={loading}
                size="icon"
                aria-label="Subscribe to newsletter"
                className="h-11 w-11 shrink-0 rounded-xl bg-[#1d4fd8] text-white hover:bg-[#1a46c2]"
              >
                {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : done ? <Check className="h-4.5 w-4.5" /> : <Send className="h-4.5 w-4.5" />}
              </Button>
            </form>
            <p className="mt-3 text-[11px] leading-relaxed text-[#8291ab]">
              By subscribing you agree to our privacy policy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#0d1b33]/8 pt-6 sm:flex-row">
          <p className="text-xs text-[#5a6a86]">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-xs text-[#5a6a86]">
            Crafted for dreamers
            <Plane className="h-3.5 w-3.5 text-[#1d4fd8]" />
            Borders shouldn&apos;t be the limit
          </p>
        </div>
      </div>
    </footer>
  );
}
