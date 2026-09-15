"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, BadgeCheck } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_CHANNELS, SERVICES, DESTINATIONS } from "@/lib/site-data";

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  destination: string;
  message: string;
};

const INITIAL: FormState = { name: "", email: "", phone: "", service: "", destination: "", message: "" };

const CHANNEL_ICONS: Record<string, typeof Mail> = {
  mail: Mail,
  phone: Phone,
  map: MapPin,
  clock: Clock,
};

/** Live open/closed status for the Lahore office (Mon–Sat, 9:00–19:00 PKT) */
function useOfficeOpen() {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const compute = () => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Karachi",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
      const weekday = get("weekday");
      const hour = parseInt(get("hour"), 10);
      const minute = parseInt(get("minute"), 10);
      const isWeekday = !["Sun"].includes(weekday);
      const mins = hour * 60 + minute;
      const open = isWeekday && mins >= 9 * 60 && mins < 19 * 60;
      setState({
        open,
        label: open ? "Open now · closes 7 PM" : isWeekday ? "Closed · opens 9 AM" : "Closed · opens Monday 9 AM",
      });
    };
    compute();
    const t = setInterval(compute, 60_000);
    return () => clearInterval(t);
  }, []);

  return state;
}

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=City+Star+Shopping+Mall,+Model+Town+Link+Road,+Lahore,+Pakistan&output=embed";

export function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const office = useOfficeOpen();
  const { toast } = useToast();

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.phone.trim().length < 7) next.phone = "Enter a valid phone number";
    if (!form.service) next.service = "Select a service";
    if (!form.destination) next.destination = "Select a destination";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit");
      }
      setSubmitted(true);
      setForm(INITIAL);
      toast({
        title: "Enquiry received!",
        description: "Our consultant will contact you within 24 hours.",
      });
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-gold/[0.07] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Let Us Help You Today"
          title={
            <>
              Reach out for <span className="text-gradient-gold font-serif-accent italic">personalized</span> visa solutions
            </>
          }
          description="Tell us where you want to go. A senior consultant reviews every enquiry personally and responds within 24 hours."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          {/* Channels */}
          <div className="space-y-4 lg:col-span-2">
            {CONTACT_CHANNELS.map((c, i) => {
              const Icon = CHANNEL_ICONS[c.icon] ?? Mail;
              return (
                <Reveal key={c.label} delay={i * 0.07}>
                  <a
                    href={c.href}
                    className="group flex items-center gap-4 rounded-2xl border border-[#0d1b33]/8 bg-white p-5 shadow-[0_14px_40px_-28px_rgba(13,27,51,0.4)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#1d4fd8]/30 hover:shadow-[0_22px_54px_-24px_rgba(29,79,216,0.5)]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1d4fd8]/25 bg-[#1d4fd8]/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-5 w-5 text-[#1d4fd8]" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {c.label}
                      </span>
                      <span className="mt-1 block font-semibold text-foreground">{c.value}</span>
                    </span>
                  </a>
                </Reveal>
              );
            })}

            <Reveal delay={0.3}>
              <div className="gold-ring relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1d4fd8]/12 via-[#1d4fd8]/5 to-transparent p-6">
                <BadgeCheck className="h-8 w-8 text-[#1d4fd8]" />
                <p className="mt-3 font-display text-lg font-bold text-foreground">Free first consultation</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  No fees, no obligation — just an honest assessment of your case and your best route
                  forward.
                </p>
              </div>
            </Reveal>

            {/* Live office status + location map */}
            <Reveal delay={0.36}>
              <div className="overflow-hidden rounded-2xl border border-[#0d1b33]/8 bg-white shadow-[0_14px_40px_-28px_rgba(13,27,51,0.4)]">
                <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      {office?.open && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                      )}
                      <span
                        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                          office?.open ? "bg-emerald-500" : "bg-[#8291ab]"
                        }`}
                      />
                    </span>
                    <p className="truncate text-[13px] font-bold text-[#0d1b33]">
                      {office ? office.label : "Mon – Sat · 9 AM – 7 PM"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f0f4fd] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1d4fd8]">
                    PKT
                  </span>
                </div>
                <iframe
                  src={MAP_EMBED_URL}
                  title="US Visa Consultant office location — City Star Shopping Mall, Lahore"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-44 w-full border-0 sm:h-52"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.12} className="lg:col-span-3">
            <div className="glass gold-ring relative h-full rounded-[2rem] bg-white/85 p-6 shadow-[0_28px_70px_-32px_rgba(13,27,51,0.45)] sm:p-9">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
                      className="glow-gold flex h-20 w-20 items-center justify-center rounded-full bg-[#1d4fd8]/10"
                    >
                      <CheckCircle2 className="h-10 w-10 text-[#1d4fd8]" />
                    </motion.span>
                    <h3 className="mt-6 font-display text-2xl font-bold text-foreground">Application received!</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      Thank you for trusting US Visa Consultant. A senior consultant will review your case
                      and reach out within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="mt-8 rounded-full border-[#1d4fd8]/40 text-[#1d4fd8] hover:bg-[#1d4fd8]/10"
                    >
                      Submit another enquiry
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    onSubmit={onSubmit}
                    noValidate
                    className="grid gap-5 sm:grid-cols-2"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g. Ahmed Ali"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm focus-visible:ring-[#1d4fd8]/40"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm focus-visible:ring-[#1d4fd8]/40"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Phone / WhatsApp *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+92 3XX XXXXXXX"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm focus-visible:ring-[#1d4fd8]/40"
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Visa Service *
                      </Label>
                      <Select value={form.service} onValueChange={(v) => set("service", v)}>
                        <SelectTrigger
                          id="service"
                          className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm data-[placeholder]:text-[#8291ab]"
                        >
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent className="border-[#0d1b33]/10 bg-white text-[#0d1b33] shadow-xl">
                          {SERVICES.map((s) => (
                            <SelectItem key={s.id} value={s.short}>
                              {s.short}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other / Not sure</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.service && <p className="text-xs text-destructive">{errors.service}</p>}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="destination" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Destination Country *
                      </Label>
                      <Select value={form.destination} onValueChange={(v) => set("destination", v)}>
                        <SelectTrigger
                          id="destination"
                          className="h-12 rounded-xl border-[#0d1b33]/12 bg-white shadow-sm data-[placeholder]:text-[#8291ab]"
                        >
                          <SelectValue placeholder="Where do you want to go?" />
                        </SelectTrigger>
                        <SelectContent className="border-[#0d1b33]/10 bg-white text-[#0d1b33] shadow-xl">
                          {DESTINATIONS.map((d) => (
                            <SelectItem key={d.id} value={d.country}>
                              {d.country}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other country</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.destination && <p className="text-xs text-destructive">{errors.destination}</p>}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your travel plans, timeline, or any previous refusals…"
                        rows={4}
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        className="resize-none rounded-xl border-[#0d1b33]/12 bg-white shadow-sm focus-visible:ring-[#1d4fd8]/40"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Button
                        type="submit"
                        disabled={submitting}
                        size="lg"
                        className="group relative h-14 w-full overflow-hidden rounded-full bg-[#1d4fd8] text-base font-bold text-white shadow-[0_16px_44px_-14px_rgba(29,79,216,0.9)] transition-all hover:bg-[#1a46c2] disabled:opacity-70"
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending…
                          </>
                        ) : (
                          <>
                            Submit Free Enquiry <Send className="ml-2 h-4.5 w-4.5" />
                          </>
                        )}
                      </Button>
                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        Your information is confidential and never shared with third parties.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
