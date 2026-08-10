"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ButtonEl } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

export function LoginForm({ defaultRedirect = "/dashboard" }: { defaultRedirect?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Hibás email cím vagy jelszó.");
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? defaultRedirect);
    router.refresh();
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

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="password" className="text-sm font-medium text-paper-fg">
            Jelszó
          </label>
          <Link href="/elfelejtett-jelszo" className="text-xs text-accent underline underline-offset-2 hover:no-underline">
            Elfelejtetted?
          </Link>
        </div>
        <PasswordInput id="password" name="password" required autoComplete="current-password" />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <ButtonEl type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? "Belépés..." : "Belépés"}
      </ButtonEl>
    </form>
  );
}
