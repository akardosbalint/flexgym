"use client";

import { signOut } from "next-auth/react";
import { Logo } from "@/components/logo";

export function AdminShell({
  children,
  staffName,
}: {
  children: React.ReactNode;
  staffName: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper-2">
      <header className="flex items-center justify-between border-b border-ink-border bg-ink px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo tone="dark" />
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-heading font-semibold tracking-widest text-white uppercase">
            Staff
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-dark sm:inline">{staffName}</span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-sm border border-ink-border px-3.5 py-2 text-sm font-medium text-muted-dark transition-colors hover:border-accent hover:text-accent"
          >
            Kilépés
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
