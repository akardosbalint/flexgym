"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getPlan } from "@/lib/membership-plans";
import { getBaseUrl } from "@/lib/base-url";

/**
 * Starts a Stripe Checkout session for the selected plan and redirects the
 * member to Stripe's hosted payment page. The membership itself is only
 * activated once Stripe confirms payment via the `checkout.session.completed`
 * webhook (see src/app/api/webhooks/stripe/route.ts) — never here, since a
 * redirect to Stripe is not proof of a completed payment.
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

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: { name: plan.name },
            // HUF is not one of Stripe's zero-decimal currencies, so amounts
            // are expressed in fillér (forint × 100).
            unit_amount: plan.adult * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        planName: plan.name,
      },
      customer_email: session.user.email ?? undefined,
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
