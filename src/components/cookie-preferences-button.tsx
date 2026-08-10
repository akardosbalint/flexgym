"use client";

import { openCookiePreferences } from "@/lib/cookie-consent";

export function CookiePreferencesButton() {
  return (
    <button type="button" onClick={openCookiePreferences} className="hover:text-accent-on-dark">
      Cookie beállítások
    </button>
  );
}
