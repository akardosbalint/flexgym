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

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "invoice.paid":
      await handleInvoicePaid(event.data.object as Stripe.Invoice);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
  }

  return NextResponse.json({ received: true });
}

function generateInvoiceNo(date: Date) {
  return `FG-${date.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/** First payment for a plan — one-time purchase, or a new subscription's initial period. */
async function handleCheckoutCompleted(checkoutSession: Stripe.Checkout.Session) {
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
  let endDate = new Date(startDate.getTime() + plan.days * DAY);
  let stripeSubscriptionId: string | null = null;

  if (plan.kind === "recurring" && checkoutSession.subscription) {
    stripeSubscriptionId =
      typeof checkoutSession.subscription === "string"
        ? checkoutSession.subscription
        : checkoutSession.subscription.id;

    const subscription = await getStripe().subscriptions.retrieve(stripeSubscriptionId);
    const periodEnd = subscription.items.data[0]?.current_period_end;
    if (periodEnd) endDate = new Date(periodEnd * 1000);
  }

  const amountHuf = checkoutSession.amount_total != null ? checkoutSession.amount_total / 100 : plan.priceHuf;
  const invoiceNo = generateInvoiceNo(startDate);

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
        priceHuf: amountHuf,
        purchasedAt: startDate,
        stripeSubscriptionId,
      },
    }),
    prisma.purchase.create({
      data: {
        userId,
        item: plan.name,
        amountHuf,
        invoiceNo,
        method: "Bankkártya (Stripe)",
        status: "PAID",
        stripeSessionId: checkoutSession.id,
        createdAt: startDate,
      },
    }),
  ]);
}

/** Renewal charge for an existing subscription — extends the membership's endDate. */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Only renewals: the initial payment is already handled by
  // checkout.session.completed, and other billing_reasons (updates,
  // one-off invoice items, ...) aren't a case this app produces.
  if (invoice.billing_reason !== "subscription_cycle") return;

  const subscriptionRef = invoice.parent?.subscription_details?.subscription;
  const stripeSubscriptionId = typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef?.id;
  if (!stripeSubscriptionId) return;

  const existing = await prisma.purchase.findUnique({
    where: { stripeInvoiceId: invoice.id },
  });
  if (existing) return;

  const membership = await prisma.membership.findUnique({
    where: { stripeSubscriptionId },
  });
  if (!membership) return;

  const periodEnd = invoice.lines.data[0]?.period?.end;
  const newEndDate = periodEnd ? new Date(periodEnd * 1000) : membership.endDate;
  const amountHuf = invoice.amount_paid / 100;
  const paidAt = new Date();

  await prisma.$transaction([
    prisma.membership.update({
      where: { id: membership.id },
      data: { endDate: newEndDate, status: "ACTIVE" },
    }),
    prisma.purchase.create({
      data: {
        userId: membership.userId,
        item: membership.name,
        amountHuf,
        invoiceNo: generateInvoiceNo(paidAt),
        method: "Bankkártya (Stripe, megújítás)",
        status: "PAID",
        stripeInvoiceId: invoice.id,
        createdAt: paidAt,
      },
    }),
  ]);
}

/** Member cancels/resumes auto-renewal via the Stripe Billing Portal. */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.membership.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { cancelAtPeriodEnd: subscription.cancel_at_period_end },
  });
}

/** Subscription has fully ended (canceled and period elapsed, or unrecoverable payment failure). */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.membership.updateMany({
    where: { stripeSubscriptionId: subscription.id, status: "ACTIVE" },
    data: { status: "CANCELLED" },
  });
}
