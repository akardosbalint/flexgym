"use client";

import { useState, type FormEvent } from "react";
import { ButtonEl } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const body = await res.json().catch(() => null);
    setLoading(false);

    if (!res.ok) {
      setError(body?.error ?? "Hiba történt, próbáld újra.");
      return;
    }

    setMessage(body?.message ?? "Ha ez az email cím regisztrálva van nálunk, hamarosan kapsz egy jelszó-visszaállító linket.");
    form.reset();
  }

  if (message) {
    return <div className="rounded-lg bg-accent p-6 text-sm text-white">{message}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-paper-fg">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 w-full border-b border-paper-border bg-transparent px-1 py-2.5 text-sm text-paper-fg outline-none focus:border-accent"
        />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <ButtonEl type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? "Küldés..." : "Visszaállító link küldése"}
      </ButtonEl>
    </form>
  );
}
