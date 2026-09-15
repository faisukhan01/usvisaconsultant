"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Plane, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NAV_LINKS, SITE } from "@/lib/site-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Top info bar */}
      <div
        className={`hidden overflow-hidden border-b border-white/5 bg-[#0c0c0f] transition-all duration-500 lg:block ${
          scrolled ? "max-h-0 border-transparent opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Free consultation this week — slots open worldwide
          </p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gold">
              {SITE.email}
            </a>
            <span className="h-3 w-px bg-white/10" />
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 transition-colors hover:text-gold">
              <Phone className="h-3 w-3" /> {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`transition-all duration-500 ${
          scrolled ? "border-b border-white/5 bg-[#08080a]/85 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl" : "bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main navigation">
          {/* Logo */}
          <a href="#home" className="group flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 transition-all group-hover:bg-gold/20">
              <Plane className="h-5 w-5 text-gold transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-12" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold tracking-wide text-foreground">
                US VISA <span className="text-gradient-gold">CONSULTANT</span>
              </span>
              <span className="block text-[9.5px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Worldwide Visa Partner
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.slice(0, 7).map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative rounded-full px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button
              asChild
              className="group relative hidden overflow-hidden rounded-full bg-gold font-semibold text-[#17130a] shadow-[0_0_24px_rgba(232,182,76,0.35)] transition-all hover:shadow-[0_0_36px_rgba(232,182,76,0.55)] sm:inline-flex"
            >
              <a href="#contact">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Free Consultation
              </a>
            </Button>

            {/* Mobile sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-white/10 bg-white/5 text-foreground xl:hidden"
                  aria-label="Open menu"
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[86vw] max-w-sm border-white/10 bg-[#0c0c0f]/95 backdrop-blur-2xl"
              >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="mt-8 flex flex-col gap-1">
                  {NAV_LINKS.map((l, i) => (
                    <motion.a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
                    >
                      {l.label}
                      <span className="text-xs text-gold/50 opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </motion.a>
                  ))}
                </div>
                <Button asChild className="mt-6 w-full rounded-full bg-gold font-semibold text-[#17130a]">
                  <a href="#contact" onClick={() => setOpen(false)}>
                    Free Consultation
                  </a>
                </Button>
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Call us directly</p>
                  <a href={`tel:${SITE.phone}`} className="mt-1 block text-gold">
                    {SITE.phone}
                  </a>
                  <p className="mt-2 text-xs">{SITE.hours}</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
