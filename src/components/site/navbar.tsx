"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NAV_LINKS, SITE } from "@/lib/site-data";
import { OfficeStatus } from "@/components/site/office-status";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#home");
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Main bar */}
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "border-b border-[#0d1b33]/8 bg-white/92 py-2 shadow-[0_10px_40px_-12px_rgba(13,27,51,0.18)] backdrop-blur-xl"
            : "bg-transparent py-3 sm:py-4"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main navigation">
          {/* Logo (original brand mark) */}
          <a href="#home" className="group flex items-center gap-2.5 sm:gap-3" aria-label="US Visa Consultant — home">
            <span
              className={`relative flex items-center justify-center rounded-2xl bg-white shadow-[0_8px_26px_-8px_rgba(13,27,51,0.4)] ring-1 ring-[#0d1b33]/10 transition-all duration-500 group-hover:shadow-[0_10px_30px_-8px_rgba(29,79,216,0.5)] group-hover:ring-[#1d4fd8]/30 ${
                scrolled ? "h-12 w-12 sm:h-13 sm:w-13" : "h-14 w-14 sm:h-16 sm:w-16"
              }`}
            >
              <Image
                src="/logo.png"
                alt="US Visa Consultant official logo"
                width={64}
                height={64}
                className={`object-contain transition-all duration-500 ${
                  scrolled ? "h-10 w-10 sm:h-11 sm:w-11" : "h-12 w-12 sm:h-14 sm:w-14"
                }`}
                priority
              />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-base font-extrabold tracking-wide text-[#0d1b33]">
                US VISA <span className="text-[#1d4fd8]">CONSULTANT</span>
              </span>
              <span className="mt-0.5 block text-[9.5px] font-bold uppercase tracking-[0.3em] text-[#e23a3a]">
                World Wide Visa
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.slice(0, 8).map((l) => {
              const isActive = active === l.href;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-[#1d4fd8] after:transition-transform ${
                      isActive
                        ? "text-[#1d4fd8] after:scale-x-100"
                        : "text-[#3d4d6b] after:scale-x-0 hover:text-[#1d4fd8] hover:after:scale-x-100"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Button
              asChild
              className="group relative hidden overflow-hidden rounded-full bg-[#1d4fd8] font-semibold text-white shadow-[0_8px_28px_-8px_rgba(29,79,216,0.7)] transition-all hover:bg-[#1a46c2] hover:shadow-[0_10px_36px_-8px_rgba(29,79,216,0.85)] sm:inline-flex"
            >
              <a href="#booking">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Sparkles className="mr-1.5 h-4 w-4" />
                Free Consultation
              </a>
            </Button>

            {/* Mobile sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-[#0d1b33]/10 bg-white/80 text-[#0d1b33] shadow-sm backdrop-blur xl:hidden"
                  aria-label="Open menu"
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[86vw] max-w-sm border-[#0d1b33]/10 bg-white/95 backdrop-blur-2xl"
              >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="mt-6 flex items-center gap-3 border-b border-[#0d1b33]/8 pb-5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_8px_26px_-8px_rgba(13,27,51,0.35)] ring-1 ring-[#0d1b33]/10">
                    <Image src="/logo.png" alt="US Visa Consultant logo" width={56} height={56} className="h-12 w-12 object-contain" />
                  </span>
                  <div className="leading-tight">
                    <p className="font-display text-sm font-extrabold text-[#0d1b33]">
                      US VISA <span className="text-[#1d4fd8]">CONSULTANT</span>
                    </p>
                    <p className="text-[8.5px] font-bold uppercase tracking-[0.28em] text-[#e23a3a]">World Wide Visa</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-1">
                  {NAV_LINKS.map((l, i) => (
                    <motion.a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i }}
                      className={`group flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                        active === l.href
                          ? "bg-[#1d4fd8]/8 text-[#1d4fd8]"
                          : "text-[#3d4d6b] hover:bg-[#1d4fd8]/8 hover:text-[#1d4fd8]"
                      }`}
                    >
                      {l.label}
                      <span className="text-xs text-[#1d4fd8]/60 opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </motion.a>
                  ))}
                </div>
                <Button asChild className="mt-6 w-full rounded-full bg-[#1d4fd8] font-semibold text-white">
                  <a href="#contact" onClick={() => setOpen(false)}>
                    Free Consultation
                  </a>
                </Button>
                <div className="mt-7 rounded-2xl border border-[#0d1b33]/8 bg-[#f5f8fe] p-4 text-sm text-[#5a6a86]">
                  <p className="font-bold text-[#0d1b33]">Call us directly</p>
                  <a href={`tel:${SITE.phone}`} className="mt-1 block font-semibold text-[#1d4fd8]">
                    {SITE.phone}
                  </a>
                  <div className="mt-2 [&>span]:text-[12px]">
                    <OfficeStatus />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>

      {/* Scroll progress indicator */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="h-[2.5px] origin-left bg-gradient-to-r from-[#1d4fd8] via-[#3b6ae8] to-[#5b85ec]"
      />
    </motion.header>
  );
}
