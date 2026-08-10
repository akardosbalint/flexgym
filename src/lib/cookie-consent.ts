export const CONSENT_STORAGE_KEY = "forgegym-cookie-consent";
const CONSENT_EVENT = "forgegym-cookie-consent-change";
const OPEN_PREFERENCES_EVENT = "forgegym-cookie-preferences-open";

export type CookieConsent = { analytics: boolean };

export function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { analytics?: unknown };
    return { analytics: parsed.analytics === true };
  } catch {
    return null;
  }
}

export function getConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
}

export function setConsent(consent: CookieConsent) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

export function subscribeOpenPreferences(callback: () => void) {
  window.addEventListener(OPEN_PREFERENCES_EVENT, callback);
  return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, callback);
}
