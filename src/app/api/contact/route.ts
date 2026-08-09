import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Add meg a neved."),
  email: z.email("Érvénytelen email cím."),
  message: z.string().trim().min(5, "Írj pár szót az üzenetben."),
});

// Mock contact endpoint: validates and accepts the message. Wiring this up
// to a real inbox (email/CRM) is a follow-up once that's decided.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Hibás adatok." },
      { status: 400 },
    );
  }

  console.log("[kapcsolat] Új üzenet:", parsed.data);

  return NextResponse.json({ ok: true });
}
