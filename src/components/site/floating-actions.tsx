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
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-foreground shadow-lg transition-colors hover:bg-gold/15 hover:text-gold"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href="#contact"
        aria-label="Chat with a consultant"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gold text-[#17130a] shadow-[0_10px_30px_rgba(232,182,76,0.45)] transition-transform hover:scale-110"
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full border-2 border-gold" />
        <MessageCircle className="h-6 w-6" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl border border-white/10 bg-[#131318] px-3 py-2 text-xs font-semibold text-foreground shadow-xl group-hover:block">
          Chat with a consultant
        </span>
      </a>
    </div>
  );
}
