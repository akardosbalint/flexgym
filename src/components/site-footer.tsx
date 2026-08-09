import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { CONTACT, NAV_LINKS, OPENING_HOURS } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-border bg-ink">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl leading-tight tracking-wide text-accent">
            FLEX GYM
            <br />
            WELCOME HOME
          </p>
          <div className="mt-3 h-1 w-14 bg-accent" />
          <p className="mt-4 max-w-xs text-sm text-muted-dark">
            Edzz legendák között, válj legendává! Testépítés, kardió és
            küzdősport egy helyen, a budai Márvány utcában.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-dark">
            <li>{CONTACT.address}</li>
            <li>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-accent">
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-accent">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-widest text-muted-dark uppercase">
            Menü
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-fg hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-widest text-muted-dark uppercase">
            Nyitvatartás
          </h3>
          <ul className="mt-4 space-y-1.5 text-sm">
            {OPENING_HOURS.map((row) => (
              <li key={row.day} className="flex justify-between gap-4 text-muted-dark">
                <span className="text-ink-fg">{row.day}</span>
                <span>{row.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-ink-border py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-muted-dark sm:flex-row">
          <div className="flex items-center gap-2">
            <Logo tone="dark" className="scale-90" />
            <span>© {new Date().getFullYear()} Minden jog fenntartva.</span>
          </div>
          <span>Belépés és bérletkezelés: GPass</span>
        </Container>
      </div>
    </footer>
  );
}
