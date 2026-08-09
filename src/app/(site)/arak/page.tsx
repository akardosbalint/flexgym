import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/ui/content-card";
import { PRICING, FREE_PERKS } from "@/lib/site-data";

export const metadata: Metadata = { title: "Árak | Forge Gym" };

function formatHuf(value: number) {
  return `${value.toLocaleString("hu-HU")} Ft`;
}

const ICONS: Record<string, React.ReactNode> = {
  sauna: (
    <path
      d="M4 17h16M6 17V9c0-3 2.5-5 6-5s6 2 6 5v8M9 17v-4M15 17v-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  shower: (
    <path
      d="M4 9h16M9 4h6l1 2H8l1-2ZM7 13v.01M11 13v.01M15 13v.01M9 17v.01M13 17v.01M7 21v.01M11 21v.01M15 21v.01"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 16V8h3.5a2.5 2.5 0 1 1 0 5H9" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Bérletek"
        title="ÁRAK"
        highlight="AK"
        description="Válaszd ki a hozzád illő bérletet — a vásárlás bankkártyával, a beléptetés a saját QR-kódos rendszerünkkel zajlik, a felhasználásod pedig a saját dashboardodon követhető."
      />

      <div className="bg-ink py-16">
        <Container>
          <ContentCard>
            <div className="overflow-hidden rounded-lg border border-paper-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-paper-2 text-xs tracking-widest text-muted-light uppercase">
                  <tr>
                    <th className="px-5 py-4 font-heading font-semibold">Bérlet</th>
                    <th className="px-5 py-4 font-heading font-semibold">Felnőtt</th>
                    <th className="px-5 py-4 font-heading font-semibold">Diák</th>
                    <th className="px-5 py-4 font-heading font-semibold">Érvényesség</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING.map((row, i) => (
                    <tr key={row.name} className={i % 2 === 1 ? "bg-paper-2" : "bg-paper"}>
                      <td className="px-5 py-4 font-medium text-paper-fg">{row.name}</td>
                      <td className="px-5 py-4 text-muted-light">{formatHuf(row.adult)}</td>
                      <td className="px-5 py-4 text-muted-light">
                        {row.student ? formatHuf(row.student) : "—"}
                      </td>
                      <td className="px-5 py-4 text-muted-light">{row.validity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/regisztracio" variant="primary" size="lg">
                Online bérletvásárlás
              </Button>
            </div>

            <p className="mt-8 max-w-2xl text-sm text-muted-light">
              A <strong className="text-paper-fg">diák kedvezmény</strong>{" "}
              érvényes fényképes nappali tagozatos diákigazolvány felmutatásával
              vehető igénybe, 24 éves korig.
            </p>

            <h2 className="mt-16 text-center font-heading text-2xl font-bold text-paper-fg">
              Ingyenesen szolgáltatásaink
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {FREE_PERKS.map((perk) => (
                <div key={perk.label} className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      {ICONS[perk.icon]}
                    </svg>
                  </div>
                  <span className="text-sm text-muted-light">{perk.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-16 rounded-lg bg-accent p-6 text-sm text-white">
              <p className="font-heading text-lg font-bold uppercase">Figyelem!</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Az árak forintban értendők, az áfát tartalmazzák.</li>
                <li>Szép kártyával nem lehet fizetni.</li>
                <li>
                  Az órák, személyi, kiscsoportos edzések a terembelépőn felül
                  külön díj ellenében vehetők igénybe.
                </li>
              </ul>
            </div>
          </ContentCard>
        </Container>
      </div>
    </>
  );
}
