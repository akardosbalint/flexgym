"use client";

import { useState, type FormEvent } from "react";
import { signOut } from "next-auth/react";
import { ButtonEl } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

export function AccountDangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Hiba történt, próbáld újra.");
      setLoading(false);
      return;
    }

    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
      <h2 className="font-heading text-lg font-semibold text-paper-fg">Fiók törlése</h2>
      <p className="mt-2 text-sm text-muted-light">
        A fiókod és minden hozzá tartozó adat (bérletek, belépési előzmények,
        vásárlások) véglegesen törlődik. Ez a művelet nem vonható vissza.
      </p>

      {!confirming ? (
        <ButtonEl
          type="button"
          variant="outline-dark"
          size="md"
          className="mt-4 border-accent text-accent hover:bg-accent hover:text-white"
          onClick={() => setConfirming(true)}
        >
          Fiók törlése
        </ButtonEl>
      ) : (
        <form onSubmit={handleDelete} className="mt-4 max-w-sm space-y-3">
          <label htmlFor="delete-password" className="text-sm font-medium text-paper-fg">
            Erősítsd meg a jelszavaddal
          </label>
          <PasswordInput id="delete-password" name="password" required autoComplete="current-password" />
          {error && <p className="text-sm text-accent">{error}</p>}
          <div className="flex gap-2">
            <ButtonEl type="submit" variant="primary" disabled={loading}>
              {loading ? "Törlés..." : "Végleges törlés megerősítése"}
            </ButtonEl>
            <ButtonEl type="button" variant="outline-dark" onClick={() => setConfirming(false)}>
              Mégse
            </ButtonEl>
          </div>
        </form>
      )}
    </div>
  );
}
