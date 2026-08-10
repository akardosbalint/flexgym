"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ButtonEl } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { trackEvent } from "@/lib/analytics-events";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Hiba történt, próbáld újra.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.error) {
      router.push("/bejelentkezes");
      return;
    }

    trackEvent("register_completed");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-paper-fg">
          Teljes név
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          autoComplete="name"
          className="mt-1.5 w-full border-b border-paper-border bg-transparent px-1 py-2.5 text-sm text-paper-fg outline-none focus:border-accent"
        />
      </div>

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

      <div>
        <label htmlFor="password" className="text-sm font-medium text-paper-fg">
          Jelszó
        </label>
        <PasswordInput id="password" name="password" required minLength={8} autoComplete="new-password" />
        <p className="mt-1 text-xs text-muted-light">Legalább 8 karakter.</p>
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <p className="text-xs text-muted-light">
        A regisztrációval elfogadod az{" "}
        <Link
          href="/adatkezelesi-tajekoztato"
          target="_blank"
          className="text-accent underline underline-offset-2"
        >
          adatkezelési tájékoztatót
        </Link>
        .
      </p>

      <ButtonEl type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? "Regisztráció..." : "Regisztráció"}
      </ButtonEl>
    </form>
  );
}
