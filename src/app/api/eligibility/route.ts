import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const GOALS = ["Visit", "Study", "Work", "Family"] as const;
const TIMELINES = ["asap", "1-3", "3-6", "exploring"] as const;

const eligibilitySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(24),
  goal: z.enum(GOALS),
  destination: z.string().trim().min(1, "Please choose a destination").max(60),
  timeline: z.enum(TIMELINES),
  refusals: z.enum(["no", "yes"]),
  readiness: z.enum(["high", "medium", "starter"]),
});

/** Verdict label — mirrors the client-side logic in src/lib/eligibility.ts. */
function computeReadiness(goal: string, timeline: string, refusals: string): "high" | "medium" | "starter" {
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = eligibilitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Validation failed",
          issues: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        },
        { status: 400 }
      );
    }

    const readiness = computeReadiness(parsed.data.goal, parsed.data.timeline, parsed.data.refusals);

    const lead = await db.eligibilityCheck.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        goal: parsed.data.goal,
        destination: parsed.data.destination,
        timeline: parsed.data.timeline,
        refusals: parsed.data.refusals,
        readiness,
      },
    });

    return NextResponse.json({ ok: true, id: lead.id, readiness }, { status: 201 });
  } catch (err) {
    console.error("[/api/eligibility] failed:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
