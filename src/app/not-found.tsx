import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Az oldal nem található",
  robots: { index: false, follow: false },
};

// Root-level not-found.tsx (not one nested inside the (site) route group):
// in this Next.js version only the root file catches genuinely unmatched
// URLs - a not-found.tsx inside a route group only fires when notFound()
// is thrown explicitly within that segment. Since this renders outside the
// (site) layout, it can't reuse SiteHeader/SiteFooter, so it's a small
// self-contained page instead.
export default function NotFound() {
  return (
    <div className="brand-pattern flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center">
      <Logo tone="dark" className="mb-10" />
      <p className="font-heading text-sm font-semibold tracking-widest text-accent-on-dark uppercase">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-wide text-white uppercase sm:text-5xl">
        Ez az oldal nem létezik
      </h1>
      <p className="mt-4 max-w-md text-muted-dark">
        Előfordulhat, hogy elgépelted a címet, vagy a keresett oldal már nem
        elérhető. Innen biztosan tovább jutsz.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button href="/" variant="primary" size="lg">
          Vissza a kezdőlapra
        </Button>
        <Button href="/arak" variant="outline-light" size="lg">
          Áraink megtekintése
        </Button>
      </div>
    </div>
  );
}
