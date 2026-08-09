import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/ui/content-card";
import { OPENING_HOURS, CONTACT } from "@/lib/site-data";
import { TRAINERS } from "@/lib/site-data";

const SERVICES = [
  {
    title: "Testépítés",
    description:
      "Hardcore edzőterem a testépítés aranykorának hangulatával. Több tonna szabadsúly, kézisúlyzó és gépes állomás.",
  },
  {
    title: "Kardió park",
    description:
      "Modern futópadok, lépcsőgépek és szobakerékpárok panorámás kilátással a városra.",
  },
  {
    title: "Küzdősport & masszázs",
    description:
      "Box, kickbox oktatás és sportmasszázs a regenerációért — mindez egy tető alatt.",
  },
];

const STATS = [
  { value: "1974", label: "óta a budai edzők otthona" },
  { value: "2 000+", label: "aktív tag" },
  { value: "40+", label: "gépes állomás" },
  { value: "06–22", label: "nyitva minden hétköznap" },
];

export default function HomePage() {
  return (
    <>
      <section className="brand-pattern relative overflow-hidden border-b border-ink-border bg-ink">
        <Container className="relative grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-heading text-sm font-semibold tracking-widest text-accent uppercase">
              Flex Gym Budapest
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-wide text-white uppercase sm:text-6xl">
              Edzz legendák között,
              <br />
              válj <span className="bg-accent px-2">legendává!</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-dark">
              A Márvány utcai csarnokban négy évtizede formálódnak a legjobb
              formák. Csatlakozz, és kövesd a fejlődésed a saját
              tagsági dashboardodon.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/regisztracio" variant="primary" size="lg">
                Csatlakozz még ma
              </Button>
              <Button href="/arak" variant="outline-light" size="lg">
                Bérletek megtekintése
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-paper-border bg-paper p-6">
                <p className="font-display text-3xl text-accent">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-20">
        <Container>
          <ContentCard>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-heading text-sm font-semibold tracking-widest text-accent uppercase">
                  Szolgáltatásaink
                </p>
                <h2 className="mt-2 font-heading text-3xl font-bold text-paper-fg">
                  Minden, amire egy komoly edzéshez szükséged van
                </h2>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {SERVICES.map((service) => (
                <div
                  key={service.title}
                  className="rounded-lg border border-paper-border bg-paper-2 p-7 transition-colors hover:border-accent"
                >
                  <h3 className="font-heading text-xl font-semibold text-paper-fg">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-light">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </ContentCard>
        </Container>
      </section>

      <section className="border-y border-ink-border bg-ink-2 py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="font-heading text-sm font-semibold tracking-widest text-accent uppercase">
              Edzőink
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-wide text-white uppercase">
              Tapasztalt szakemberek a fejlődésedért
            </h2>
            <p className="mt-4 max-w-md text-muted-dark">
              Erőnléti, küzdősport és masszázs szakágban is a legjobbakra
              bízhatod magad. Nézd meg a teljes csapatot, és találd meg a
              hozzád illő edzőt.
            </p>
            <Button href="/edzoink" variant="outline-light" size="md" className="mt-6">
              Edzőink megtekintése
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {TRAINERS.slice(0, 5).map((trainer) => (
              <div key={trainer.name} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-ink font-display text-lg text-accent">
                  {trainer.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <span className="text-xs text-muted-dark">{trainer.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-20">
        <Container className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <ContentCard className="bg-paper-2">
            <p className="font-heading text-sm font-semibold tracking-widest text-accent uppercase">
              Tagság
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-paper-fg">
              Kövesd a bérletedet és a fejlődésedet
            </h2>
            <p className="mt-4 max-w-xl text-muted-light">
              Bejelentkezés után saját dashboardon látod az aktuális
              bérletedet, a hátralévő alkalmaidat és a belépéseid
              történetét — a beléptetés a GPass rendszerén keresztül
              történik.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/dashboard" variant="primary" size="md">
                Ugrás a dashboardra
              </Button>
              <Button href="/arak" variant="outline-dark" size="md">
                Árak
              </Button>
            </div>
          </ContentCard>

          <ContentCard>
            <h3 className="font-heading text-lg font-semibold text-paper-fg">Nyitvatartás</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {OPENING_HOURS.map((row) => (
                <li key={row.day} className="flex justify-between text-muted-light">
                  <span className="text-paper-fg">{row.day}</span>
                  <span>{row.hours}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-paper-border pt-4 text-sm text-muted-light">
              <p>{CONTACT.address}</p>
              <p className="mt-1">{CONTACT.phone}</p>
            </div>
          </ContentCard>
        </Container>
      </section>
    </>
  );
}
