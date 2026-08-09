import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/membership-plans";

const DAY = 86_400_000;

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    await activateMembership(checkoutSession);
  }

  return NextResponse.json({ received: true });
}

async function activateMembership(checkoutSession: Stripe.Checkout.Session) {
  const userId = checkoutSession.metadata?.userId;
  const planName = checkoutSession.metadata?.planName;
  if (!userId || !planName) return;

  const plan = getPlan(planName);
  if (!plan) return;

  // Idempotency: Stripe can retry webhook delivery, so skip if this session
  // was already processed.
  const existing = await prisma.purchase.findUnique({
    where: { stripeSessionId: checkoutSession.id },
  });
  if (existing) return;

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + plan.days * DAY);
  const invoiceNo = `FG-${startDate.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  await prisma.$transaction([
    prisma.membership.updateMany({
      where: { userId, status: "ACTIVE" },
      data: { status: "EXPIRED" },
    }),
    prisma.membership.create({
      data: {
        userId,
        name: plan.name,
        totalEntries: plan.totalEntries,
        usedEntries: 0,
        startDate,
        endDate,
        status: "ACTIVE",
        priceHuf: plan.adult,
        purchasedAt: startDate,
      },
    }),
    prisma.purchase.create({
      data: {
        userId,
        item: plan.name,
        amountHuf: plan.adult,
        invoiceNo,
        method: "Bankkártya (Stripe)",
        status: "PAID",
        stripeSessionId: checkoutSession.id,
        createdAt: startDate,
      },
    }),
  ]);
}
