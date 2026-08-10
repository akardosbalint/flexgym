"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getPlan } from "@/lib/membership-plans";
import { getBaseUrl } from "@/lib/base-url";
import { prisma } from "@/lib/prisma";

async function getOrCreateStripeCustomerId(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { stripeCustomerId: true, email: true, name: true },
  });
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await getStripe().customers.create({
    email: user.email ?? undefined,
    name: user.name,
    metadata: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * Starts a Stripe Checkout session for the selected plan and redirects the
 * member to Stripe's hosted payment page — mode: "payment" for the
 * one-time Alkalmi belépő, mode: "subscription" for the auto-renewing
 * Havi/Negyedéves/Éves plans. The membership itself is only activated once
 * Stripe confirms payment via webhook (see
 * src/app/api/webhooks/stripe/route.ts) — never here, since a redirect to
 * Stripe is not proof of a completed payment.
 */
export async function startCheckout(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/bejelentkezes");
  }

  const planName = String(formData.get("plan") ?? "");
  const plan = getPlan(planName);
  if (!plan) {
    redirect("/dashboard/berlet?error=ismeretlen_berlet");
  }

  let checkoutUrl: string;
  try {
    const baseUrl = await getBaseUrl();
    const stripe = getStripe();
    const customerId = await getOrCreateStripeCustomerId(session.user.id);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: plan.kind === "recurring" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: plan.priceId, quantity: 1 }],
      customer: customerId,
      metadata: { userId: session.user.id, planName: plan.name },
      subscription_data:
        plan.kind === "recurring"
          ? { metadata: { userId: session.user.id, planName: plan.name } }
          : undefined,
      success_url: `${baseUrl}/dashboard/berlet?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/berlet?canceled=1`,
    });

    if (!checkoutSession.url) {
      throw new Error("Stripe checkout session has no url");
    }
    checkoutUrl = checkoutSession.url;
  } catch (err) {
    console.error("[startCheckout] Failed to create Stripe checkout session:", err);
    redirect("/dashboard/berlet?error=fizetes_inditasa_sikertelen");
  }

  redirect(checkoutUrl);
}

/**
 * Redirects the member to the Stripe Billing Portal, where they can cancel
 * or resume their auto-renewing membership, update their card, and view
 * past invoices — all Stripe-hosted, no custom cancellation UI needed here.
 * Requires the Customer Portal to be turned on once in the Stripe Dashboard
 * (Settings → Billing → Customer portal).
 */
export async function manageSubscription() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/bejelentkezes");
  }

  let portalUrl: string;
  try {
    const baseUrl = await getBaseUrl();
    const stripe = getStripe();
    const customerId = await getOrCreateStripeCustomerId(session.user.id);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard/berlet`,
    });
    portalUrl = portalSession.url;
  } catch (err) {
    console.error("[manageSubscription] Failed to create billing portal session:", err);
    redirect("/dashboard/berlet?error=elofizetes_kezelese_sikertelen");
  }

  redirect(portalUrl);
}
