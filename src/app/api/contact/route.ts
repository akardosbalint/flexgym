import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { CONTACT } from "@/lib/site-data";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2, "Add meg a neved."),
  email: z.email("Érvénytelen email cím."),
  message: z.string().trim().min(5, "Írj pár szót az üzenetben."),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok, retryAfterSeconds } = checkRateLimit(`contact:${ip}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!ok) {
    return NextResponse.json(
      { error: "Túl sok próbálkozás. Kérjük, próbáld újra néhány perc múlva." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Hibás adatok." },
      { status: 400 },
    );
  }

  await sendEmail({
    to: CONTACT.email,
    subject: `Új üzenet a weboldalról - ${parsed.data.name}`,
    text: `Név: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
  });

  return NextResponse.json({ ok: true });
}
