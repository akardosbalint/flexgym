"use client";

import { useState, type FormEvent } from "react";
import { ButtonEl } from "@/components/ui/button";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      setError("Az adatkezelési tájékoztató elfogadása kötelező.");
      return;
    }

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    setStatus("loading");
    setError(null);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
      setConsent(false);
    } else {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Hiba történt, próbáld újra.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-accent p-6 text-sm text-white">
        Köszönjük az üzeneted! Hamarosan válaszolunk.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-paper-fg">
          Név<span className="text-accent">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          className="mt-1.5 w-full border-b border-paper-border bg-transparent px-1 py-2.5 text-sm text-paper-fg outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-paper-fg">
          Email<span className="text-accent">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full border-b border-paper-border bg-transparent px-1 py-2.5 text-sm text-paper-fg outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-paper-fg">
          Üzenet<span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          rows={4}
          className="mt-1.5 w-full border-b border-paper-border bg-transparent px-1 py-2.5 text-sm text-paper-fg outline-none focus:border-accent"
        />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-muted-light">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-paper-border accent-accent"
        />
        <span>
          Az{" "}
          <a href="#" className="text-accent underline underline-offset-2">
            adatkezelési tájékoztatót
          </a>{" "}
          elfogadom.
        </span>
      </label>

      {error && <p className="text-sm text-accent">{error}</p>}

      <ButtonEl type="submit" variant="dark" disabled={status === "loading"}>
        {status === "loading" ? "Küldés..." : "Küldés"}
      </ButtonEl>
    </form>
  );
}
