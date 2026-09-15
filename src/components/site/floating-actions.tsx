"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, ArrowUp } from "lucide-react";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-[calc(1.1rem+env(safe-area-inset-bottom))] right-[calc(1.1rem+env(safe-area-inset-right))] z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="glass flex h-11 w-11 items-center justify-center rounded-full border-[#0d1b33]/10 bg-white text-[#0d1b33] shadow-lg transition-colors hover:bg-[#1d4fd8]/10 hover:text-[#1d4fd8]"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href="#contact"
        aria-label="Chat with a consultant"
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-[#1d4fd8] text-white shadow-[0_12px_34px_-8px_rgba(29,79,216,0.8)] transition-transform hover:scale-110 sm:h-14 sm:w-14"
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full border-2 border-[#1d4fd8]" />
        <MessageCircle className="h-6 w-6" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl border border-[#0d1b33]/10 bg-white px-3 py-2 text-xs font-bold text-[#0d1b33] shadow-xl group-hover:block">
          Chat with a consultant
        </span>
      </a>
    </div>
  );
}
