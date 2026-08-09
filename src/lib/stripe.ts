import "server-only";
import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Lazily constructs the Stripe client on first use, rather than at module
 * load time — so pages/routes that merely import this module (without
 * actually calling Stripe) don't crash before STRIPE_SECRET_KEY is set.
 */
export function getStripe() {
  if (cached) return cached;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error(
      "STRIPE_SECRET_KEY nincs beállítva. Lásd a .env.example fájlt a Stripe teszt kulcs beszerzéséhez.",
    );
  }
  cached = new Stripe(apiKey);
  return cached;
}
