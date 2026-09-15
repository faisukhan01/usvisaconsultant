"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, ArrowUp } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const WHATSAPP_URL =
  "https://wa.me/923124541361?text=Hello%20US%20Visa%20Consultant!%20I%20would%20like%20a%20free%20visa%20assessment.";

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

      {/* WhatsApp — direct chat with the consultant */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-[0_12px_34px_-8px_rgba(34,197,94,0.75)] transition-transform hover:scale-110 sm:h-14 sm:w-14"
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full border-2 border-[#22c55e]" />
        <WhatsAppIcon className="h-6.5 w-6.5" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl border border-[#0d1b33]/10 bg-white px-3 py-2 text-xs font-bold text-[#0d1b33] shadow-xl group-hover:block">
          Chat on WhatsApp
        </span>
      </a>

      {/* Contact form */}
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
