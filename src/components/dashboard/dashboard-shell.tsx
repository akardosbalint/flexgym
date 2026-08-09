"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/dashboard", label: "Áttekintés", icon: "grid" },
  { href: "/dashboard/berlet", label: "Bérletem", icon: "card" },
  { href: "/dashboard/tortenet", label: "Előzmények", icon: "clock" },
  { href: "/dashboard/profil", label: "Profil", icon: "user" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  grid: (
    <path
      d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
};

export function DashboardShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = NAV.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setMobileOpen(false)}
      className={clsx(
        "flex items-center gap-3 rounded-sm px-3.5 py-2.5 font-heading text-sm font-medium transition-colors",
        pathname === item.href
          ? "bg-accent text-accent-foreground"
          : "text-muted-dark hover:bg-ink-2 hover:text-ink-fg",
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {ICONS[item.icon]}
      </svg>
      {item.label}
    </Link>
  ));

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-border bg-ink lg:flex">
        <div className="border-b border-ink-border px-6 py-5">
          <Logo tone="dark" />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">{navItems}</nav>
        <div className="border-t border-ink-border p-4">
          <p className="truncate px-1 text-xs text-muted-dark">Bejelentkezve mint</p>
          <p className="truncate px-1 text-sm font-medium text-ink-fg">{userName}</p>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-3 w-full rounded-sm border border-ink-border px-3.5 py-2 text-sm font-medium text-muted-dark transition-colors hover:border-accent hover:text-accent"
          >
            Kilépés
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-border bg-ink px-4 py-3 lg:hidden">
          <Logo tone="dark" />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-ink-border text-ink-fg"
            aria-label="Menü"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {mobileOpen && (
          <div className="border-b border-ink-border bg-ink p-4 lg:hidden">
            <nav className="flex flex-col gap-1">{navItems}</nav>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-3 w-full rounded-sm border border-ink-border px-3.5 py-2 text-sm font-medium text-muted-dark"
            >
              Kilépés
            </button>
          </div>
        )}

        <main className="flex-1 bg-paper-2 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
