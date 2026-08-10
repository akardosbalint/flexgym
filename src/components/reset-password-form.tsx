"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ButtonEl } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError("Hiányzó vagy érvénytelen link.");
      return;
    }

    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;

    if (password !== confirm) {
      setError("A két jelszó nem egyezik.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const body = await res.json().catch(() => null);
    setLoading(false);

    if (!res.ok) {
      setError(body?.error ?? "Hiba történt, próbáld újra.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/bejelentkezes"), 2000);
  }

  if (!token) {
    return (
      <p className="text-sm text-accent">
        Hiányzik a visszaállító token a linkből. Kérj egy új linket az
        elfelejtett jelszó oldalon.
      </p>
    );
  }

  if (success) {
    return (
      <div className="rounded-lg bg-accent p-6 text-sm text-white">
        A jelszavad megváltozott. Átirányítunk a bejelentkezéshez...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="password" className="text-sm font-medium text-paper-fg">
          Új jelszó
        </label>
        <PasswordInput id="password" name="password" required minLength={8} autoComplete="new-password" />
        <p className="mt-1 text-xs text-muted-light">Legalább 8 karakter.</p>
      </div>

      <div>
        <label htmlFor="confirm" className="text-sm font-medium text-paper-fg">
          Új jelszó megerősítése
        </label>
        <PasswordInput id="confirm" name="confirm" required minLength={8} autoComplete="new-password" />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <ButtonEl type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? "Mentés..." : "Jelszó módosítása"}
      </ButtonEl>
    </form>
  );
}
