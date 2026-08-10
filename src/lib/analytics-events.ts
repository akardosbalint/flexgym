"use client";

import { track } from "@vercel/analytics";
import { getConsent } from "@/lib/cookie-consent";

type GtagFn = (...args: unknown[]) => void;

/**
 * Fires a named conversion/micro-conversion event through whichever
 * analytics is actually active (Vercel Analytics, and GA4 if configured),
 * gated on the visitor having opted into the "statisztikai cookie-k"
 * consent category. No-ops silently otherwise instead of throwing, since
 * neither integration is guaranteed to be configured in every environment.
 */
export function trackEvent(name: string, properties?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  if (!getConsent()?.analytics) return;

  try {
    track(name, properties);
  } catch {
    // Vercel Analytics not active in this environment - ignore.
  }

  const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
  if (typeof gtag === "function") {
    gtag("event", name, properties);
  }
}
