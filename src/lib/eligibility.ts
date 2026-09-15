export type Goal = "Visit" | "Study" | "Work" | "Family";
export type Timeline = "asap" | "1-3" | "3-6" | "exploring";
export type Refusals = "no" | "yes";
export type Readiness = "high" | "medium" | "starter";

export function computeReadiness(goal: Goal, timeline: Timeline, refusals: Refusals): Readiness {
  let score = 50;
  if (timeline === "asap") score += 20;
  else if (timeline === "1-3") score += 16;
  else if (timeline === "3-6") score += 10;
  if (refusals === "no") score += 20;
  else score += 4;
  if (goal === "Study" || goal === "Work") score += 10;
  else score += 6;
  if (score >= 82) return "high";
  if (score >= 62) return "medium";
  return "starter";
}

export const READINESS_META: Record<
  Readiness,
  { label: string; headline: string; blurb: string; ring: string; chip: string; dot: string }
> = {
  high: {
    label: "Strong Profile",
    headline: "You look application-ready.",
    blurb:
      "Your profile shows clear intent and timing — exactly the kind of file we love to take to an embassy. Let's lock the checklist while your window is open.",
    ring: "text-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  medium: {
    label: "Promising — Needs Shaping",
    headline: "A strong start with a few gaps to close.",
    blurb:
      "You're on a realistic track. A short strategy session will tell us exactly which documents and timing tweaks turn this into an approval-grade file.",
    ring: "text-amber-500",
    chip: "bg-amber-50 text-amber-700 ring-amber-600/25",
    dot: "bg-amber-500",
  },
  starter: {
    label: "Early Explorer",
    headline: "Great that you're planning ahead.",
    blurb:
      "Most of our successful clients started exactly here. A free 15-minute call will give you a concrete roadmap — timelines, budget and documents.",
    ring: "text-[#1d4fd8]",
    chip: "bg-[#f0f4fd] text-[#1d4fd8] ring-[#1d4fd8]/20",
    dot: "bg-[#1d4fd8]",
  },
};

export const GOAL_OPTIONS: { value: Goal; title: string; desc: string }[] = [
  { value: "Visit", title: "Visit / Tourism", desc: "Holidays, family visits, business trips" },
  { value: "Study", title: "Study", desc: "Universities, colleges, language schools" },
  { value: "Work", title: "Work", desc: "Skilled jobs, transfers, contracts" },
  { value: "Family", title: "Family", desc: "Spouse, dependents, reunification" },
];

export const TIMELINE_OPTIONS: { value: Timeline; title: string; desc: string }[] = [
  { value: "asap", title: "As soon as possible", desc: "Next 4–8 weeks" },
  { value: "1-3", title: "1 – 3 months", desc: "Planning an near-term trip" },
  { value: "3-6", title: "3 – 6 months", desc: "Preparing carefully" },
  { value: "exploring", title: "Just exploring", desc: "No fixed date yet" },
];

export const DESTINATION_OPTIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Schengen Europe",
  "UAE / Dubai",
  "Turkey",
  "Saudi Arabia",
  "Malaysia",
  "Somewhere else",
];
