"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ButtonEl } from "@/components/ui/button";

const STORAGE_KEY = "forgegym-cookie-consent";
const CONSENT_EVENT = "forgegym-cookie-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY);
}

// During SSR/hydration we don't know the visitor's stored choice yet, so
// assume consent is already recorded - the real value (and the banner, if
// needed) appears right after hydration via useSyncExternalStore.
function getServerSnapshot() {
  return "accepted";
}

function setConsent(value: "accepted" | "rejected") {
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (consent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-ink-border bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-muted-dark">
          Cookie-kat használunk annak érdekében, hogy a legjobb élményt
          nyújtsuk Önnek weboldalunkon. Bővebben az{" "}
          <Link href="/adatkezelesi-tajekoztato" className="text-accent hover:underline">
            adatkezelési tájékoztatóban
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <ButtonEl variant="outline-light" size="md" onClick={() => setConsent("rejected")}>
            Elutasítom
          </ButtonEl>
          <ButtonEl variant="primary" size="md" onClick={() => setConsent("accepted")}>
            Elfogadom
          </ButtonEl>
        </div>
      </div>
    </div>
  );
}
