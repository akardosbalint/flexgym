"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { CONSENT_STORAGE_KEY, parseConsent, subscribeConsent } from "@/lib/cookie-consent";

function subscribe(callback: () => void) {
  return subscribeConsent(callback);
}

function getSnapshot() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(CONSENT_STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

// Only loads any analytics script once the visitor has explicitly opted
// into the "statisztikai cookie-k" category in the cookie banner - see
// src/components/cookie-banner.tsx and src/lib/cookie-consent.ts.
export function ConsentedAnalytics() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const consent = parseConsent(raw);
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!consent?.analytics) return null;

  return (
    <>
      {/* Vercel Analytics: privacy-friendly, cookie-less pageview/Web
          Vitals tracking. No-ops harmlessly when not deployed on Vercel. */}
      <Analytics />

      {gaMeasurementId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
    </>
  );
}
