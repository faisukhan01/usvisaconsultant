import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { isBookableDate, isValidSlot } from "@/lib/booking";

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

  try {
    const booking = await db.booking.create({
      data: { name, email, phone, visaType, date, slot, notes },
      select: { id: true, date: true, slot: true },
    });
    return NextResponse.json({ ok: true, booking }, { status: 201 });
  } catch (err) {
    // The @@unique([date, slot]) constraint is the single source of truth against races.
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
