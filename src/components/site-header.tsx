"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { clsx } from "clsx";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { NAV_LINKS, CONTACT } from "@/lib/site-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isStaff = session?.user?.role === "STAFF";

  return (
    <header className="sticky top-0 z-50 border-b border-ink-border bg-ink">
      <a href="#main-content" className="skip-link">
        Ugrás a tartalomra
      </a>
      <div className="hidden border-b border-ink-border/70 text-xs text-muted-dark lg:block">
        <Container className="flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <span>{CONTACT.phone}</span>
            <span>{CONTACT.address}</span>
          </div>
          <span>{CONTACT.email}</span>
        </Container>
      </div>

      <Container className="flex h-18 items-center justify-between py-3">
        <Logo tone="dark" />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "font-heading text-sm font-medium tracking-wide uppercase transition-colors",
                  active ? "text-accent-on-dark" : "text-ink-fg hover:text-accent-on-dark",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {status === "authenticated" ? (
            <>
              <Button href={isStaff ? "/admin" : "/dashboard"} variant="outline-light" size="md">
                {isStaff ? "Admin" : "Dashboard"}
              </Button>
              <ButtonSignOut />
            </>
          ) : (
            <>
              <Button href="/bejelentkezes" variant="outline-light" size="md">
                Bejelentkezés
              </Button>
              <Button href="/regisztracio" variant="primary" size="md">
                Regisztráció
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-ink-border text-ink-fg lg:hidden"
          aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
          aria-expanded={open}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M4 4L16 16M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </Container>

      {open && (
        <div className="border-t border-ink-border bg-ink lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-sm px-3 py-2.5 font-heading text-sm font-medium tracking-wide uppercase",
                  pathname === link.href
                    ? "bg-ink-2 text-accent-on-dark"
                    : "text-ink-fg hover:bg-ink-2",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-ink-border pt-3">
              {status === "authenticated" ? (
                <>
                  <Button
                    href={isStaff ? "/admin" : "/dashboard"}
                    variant="outline-light"
                    onClick={() => setOpen(false)}
                  >
                    {isStaff ? "Admin" : "Dashboard"}
                  </Button>
                  <ButtonSignOut />
                </>
              ) : (
                <>
                  <Button href="/bejelentkezes" variant="outline-light" onClick={() => setOpen(false)}>
                    Bejelentkezés
                  </Button>
                  <Button href="/regisztracio" variant="primary" onClick={() => setOpen(false)}>
                    Regisztráció
                  </Button>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function ButtonSignOut() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/30 px-5 py-2.5 font-heading text-sm font-semibold tracking-wide uppercase text-white transition-colors hover:border-accent hover:text-accent-on-dark"
    >
      Kilépés
    </button>
  );
}
