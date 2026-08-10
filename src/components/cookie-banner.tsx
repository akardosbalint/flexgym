"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ButtonEl } from "@/components/ui/button";
import {
  CONSENT_STORAGE_KEY,
  setConsent,
  subscribeConsent,
  subscribeOpenPreferences,
} from "@/lib/cookie-consent";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return subscribeConsent(callback);
}

function getSnapshot() {
  return window.localStorage.getItem(CONSENT_STORAGE_KEY);
}

// During SSR/hydration we don't know the visitor's stored choice yet, so
// assume consent is already recorded - the real value (and the banner, if
// needed) appears right after hydration via useSyncExternalStore.
function getServerSnapshot() {
  return "recorded";
}

export function CookieBanner() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [forceOpen, setForceOpen] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => subscribeOpenPreferences(() => setForceOpen(true)), []);

  const visible = !stored || forceOpen;
  if (!visible) return null;

  function acceptAll() {
    setConsent({ analytics: true });
    setForceOpen(false);
  }

  function rejectNonEssential() {
    setConsent({ analytics: false });
    setForceOpen(false);
  }

  function saveCustom() {
    setConsent({ analytics: analyticsChecked });
    setForceOpen(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-ink-border bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-dark">
            Cookie-kat használunk a weboldal működéséhez és (a hozzájárulásod
            esetén) a látogatottság méréséhez. Bővebben az{" "}
            <Link href="/adatkezelesi-tajekoztato" className="text-accent-on-dark underline underline-offset-2 hover:no-underline">
              adatkezelési tájékoztatóban
            </Link>
            .
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <ButtonEl variant="outline-light" size="md" onClick={() => setExpanded((v) => !v)}>
              Testreszabás
            </ButtonEl>
            <ButtonEl variant="outline-light" size="md" onClick={rejectNonEssential}>
              Csak a szükségesek
            </ButtonEl>
            <ButtonEl variant="primary" size="md" onClick={acceptAll}>
              Elfogadom mindet
            </ButtonEl>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 border-t border-ink-border pt-4">
            <label className="flex items-start gap-3 text-sm text-muted-dark">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
              />
              <span>
                <span className="font-medium text-ink-fg">Szükséges cookie-k</span> — a
                bejelentkezéshez és a beléptető rendszer működéséhez elengedhetetlenek,
                ezek nem kapcsolhatók ki.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-muted-dark">
              <input
                type="checkbox"
                checked={analyticsChecked}
                onChange={(e) => setAnalyticsChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
              />
              <span>
                <span className="font-medium text-ink-fg">Statisztikai cookie-k</span> — segítenek
                megérteni, hogyan használod az oldalt, hogy javíthassuk azt. Csak
                hozzájárulásoddal aktiválódnak.
              </span>
            </label>
            <ButtonEl variant="primary" size="md" onClick={saveCustom}>
              Kiválasztottak mentése
            </ButtonEl>
          </div>
        )}
      </div>
    </div>
  );
}
