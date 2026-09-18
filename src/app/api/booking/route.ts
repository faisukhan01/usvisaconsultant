import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { isBookableDate, isValidSlot } from "@/lib/booking";

/**
 * Human-friendly booking reference, e.g. "UVC-7K3M9Q".
 * Ambiguous glyphs (0/O, 1/I/L) are excluded so it can be read out on a call.
 */
const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateBookingReference(): string {
  const bytes = randomBytes(6);
  let code = "";
  for (let i = 0; i < bytes.length; i++) {
    code += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return `UVC-${code}`;
}

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(24),
  visaType: z.string().trim().min(2, "Please choose a visa type").max(60),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a date")
    .refine(
      isBookableDate,
      "That date is unavailable — closed on Sundays; bookings open from tomorrow up to 3 weeks ahead"
    ),
  slot: z.string().refine(isValidSlot, "Please pick a time slot between 09:00 and 18:00"),
  notes: z.string().trim().max(500).optional().default(""),
});

/** GET /api/booking?date=YYYY-MM-DD → which slots are already taken. */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? "";
  if (!isBookableDate(date)) {
    return NextResponse.json({ ok: false, error: "Invalid date" }, { status: 400 });
  }
  try {
    const rows = await db.booking.findMany({
      where: { date, status: { not: "cancelled" } },
      select: { slot: true },
    });
    return NextResponse.json({ ok: true, date, booked: rows.map((r) => r.slot) });
  } catch (err) {
    console.error("GET /api/booking failed", err);
    return NextResponse.json({ ok: false, error: "Could not load slots" }, { status: 500 });
  }
}

/** POST /api/booking → reserve a slot. Double-booking is rejected with 409. */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
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

  const { name, email, phone, visaType, date, slot, notes } = parsed.data;

  // The @@unique([date, slot]) constraint is the single source of truth against
  // double-booking races. A collision on the generated reference (astronomically
  // rare) simply retries with a fresh code; a collision on date+slot is a 409.
  try {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const booking = await db.booking.create({
          data: { name, email, phone, visaType, date, slot, notes, reference: generateBookingReference() },
          select: { id: true, reference: true, date: true, slot: true },
        });
        return NextResponse.json({ ok: true, booking }, { status: 201 });
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002" &&
          JSON.stringify(err.meta?.target ?? []).includes("reference")
        ) {
          continue; // regenerate the reference and try again
        }
        throw err;
      }
    }
    return NextResponse.json(
      { ok: false, error: "Could not allocate a booking reference — please try again." },
      { status: 500 }
    );
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "That slot was just booked by someone else — please pick another time." },
        { status: 409 }
      );
    }
    console.error("POST /api/booking failed", err);
    return NextResponse.json({ ok: false, error: "Could not create booking" }, { status: 500 });
  }
}
