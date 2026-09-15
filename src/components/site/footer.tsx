"use client";

import { useState } from "react";
import { Plane, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, Send, Loader2, Check } from "lucide-react";
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
    <footer className="relative mt-auto overflow-hidden border-t border-white/5 bg-[#0a0a0d]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-48 w-48 rounded-full bg-gold/[0.05] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <a href="#home" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                <Plane className="h-5.5 w-5.5 text-gold" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-base font-bold tracking-wide">
                  US VISA <span className="text-gradient-gold">CONSULTANT</span>
                </span>
                <span className="block text-[9.5px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  Worldwide Visa Partner
                </span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Expert guidance for all your visa needs — ensuring a smooth and successful application
              process tailored just for you, anywhere in the world.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
                >
                  <s.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground">Explore</h4>
              <ul className="mt-5 space-y-2.5">
                {NAV_LINKS.slice(1, 6).map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold">
                      <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground">Services</h4>
              <ul className="mt-5 space-y-2.5">
                {SERVICES.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <a href="#services" className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold">
                      <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
                      {s.short}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground">Contact</h4>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gold">{SITE.email}</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <a href={`tel:${SITE.phone}`} className="transition-colors hover:text-gold">{SITE.phone}</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {SITE.address}
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground">Visa Insights</h4>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
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
                className="h-11 rounded-xl border-white/10 bg-white/5 focus-visible:ring-gold/50"
              />
              <Button
                type="submit"
                disabled={loading}
                size="icon"
                aria-label="Subscribe to newsletter"
                className="h-11 w-11 shrink-0 rounded-xl bg-gold text-[#17130a] hover:bg-gold-soft"
              >
                {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : done ? <Check className="h-4.5 w-4.5" /> : <Send className="h-4.5 w-4.5" />}
              </Button>
            </form>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">
              By subscribing you agree to our privacy policy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-7 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            Crafted for dreamers
            <Plane className="h-3.5 w-3.5 text-gold" />
            Borders shouldn&apos;t be the limit
          </p>
        </div>
      </div>
    </footer>
  );
}
