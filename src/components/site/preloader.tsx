"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

export function Preloader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / 1600) * 100));
      setProgress(p);
      if (p >= 100) {
        window.clearInterval(timer);
        window.setTimeout(() => setDone(true), 350);
      }
    }, 40);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08080a]"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="glow-gold flex h-20 w-20 items-center justify-center rounded-3xl border border-gold/30 bg-gold/10">
              <Plane className="h-9 w-9 text-gold" />
            </div>
            <motion.div
              className="absolute -inset-3 rounded-[2rem] border border-gold/20"
              animate={{ scale: [1, 1.25], opacity: [0.8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.4em] text-foreground"
          >
            US Visa <span className="text-gradient-gold">Consultant</span>
          </motion.p>

          <div className="mt-8 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold-soft"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs tabular-nums tracking-widest text-muted-foreground">{progress}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
