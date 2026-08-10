import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/ui/content-card";
import { Reveal } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";
import { QrShowcaseSection } from "@/components/qr-showcase-section";
import { Marquee } from "@/components/marquee";
import { RatingBadge } from "@/components/rating-badge";
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

const MARQUEE_ITEMS = [
  "LEGENDÁK EDZŐTERME",
  "QR-KÓDOS BELÉPÉS",
  "1974 ÓTA BUDAPESTEN",
  "2000+ AKTÍV TAG",
];

export default function HomePage() {
  return (
    <>
      <section className="brand-pattern clip-diagonal-down relative overflow-hidden bg-ink pb-24 sm:pb-32">
        <Container className="relative grid gap-12 pt-20 sm:pt-28 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-heading text-sm font-semibold tracking-widest text-accent-on-dark uppercase">
              Forge Gym Budapest
            </p>
            <h1 className="mt-3 font-display text-6xl leading-[0.92] tracking-wide text-white uppercase [text-wrap:balance] sm:text-7xl">
              Kovácsold magad,
              <br />
              válj{" "}
              <span className="bg-accent px-2 shadow-[0_0_60px_-8px_rgba(224,18,31,0.75)]">
                legendává!
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-dark">
              A Váci úti csarnokban négy évtizede formálódnak a legjobb
              formák. Csatlakozz, és kövesd a fejlődésed a saját tagsági
              dashboardodon.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/regisztracio" variant="primary" size="lg">
                Csatlakozz még ma
              </Button>
              <Button href="/arak" variant="outline-light" size="lg">
                Bérletek megtekintése
              </Button>
            </div>
            <RatingBadge className="mt-8" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Reveal className="rounded-lg border border-paper-border bg-paper p-6" delay={0}>
              <p className="font-display text-4xl text-accent">
                <Counter value={1974} />
              </p>
              <p className="mt-1 text-sm text-muted-light">óta a budai edzők otthona</p>
            </Reveal>
            <Reveal className="rounded-lg border border-paper-border bg-paper p-6" delay={0.08}>
              <p className="font-display text-4xl text-accent">
                <Counter value={2000} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-muted-light">aktív tag</p>
            </Reveal>
            <Reveal className="rounded-lg border border-paper-border bg-paper p-6" delay={0.16}>
              <p className="font-display text-4xl text-accent">
                <Counter value={40} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-muted-light">gépes állomás</p>
            </Reveal>
            <Reveal className="rounded-lg border border-paper-border bg-paper p-6" delay={0.24}>
              <p className="font-display text-4xl text-accent">06–22</p>
              <p className="mt-1 text-sm text-muted-light">nyitva minden hétköznap</p>
            </Reveal>
          </div>
        </Container>
      </section>

      <Marquee items={MARQUEE_ITEMS} />

      <QrShowcaseSection />

      <section className="bg-ink py-20">
        <Container>
          <Reveal>
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
                {SERVICES.map((service, i) => (
                  <Reveal key={service.title} delay={i * 0.08}>
                    <div className="group h-full rounded-lg border border-paper-border bg-paper-2 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl">
                      <h3 className="font-heading text-xl font-semibold text-paper-fg">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-light">
                        {service.description}
                      </p>
                      <span className="mt-4 inline-block text-sm font-semibold text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Tudj meg többet →
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </ContentCard>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-ink-border bg-ink-2 py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <p className="font-heading text-sm font-semibold tracking-widest text-accent-on-dark uppercase">
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
          </Reveal>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {TRAINERS.slice(0, 5).map((trainer, i) => (
              <Reveal key={trainer.name} delay={i * 0.06} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-ink font-display text-lg text-accent-on-dark transition-transform duration-300 hover:scale-110 hover:bg-accent hover:text-white">
                  {trainer.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <span className="text-xs text-muted-dark">{trainer.name.split(" ")[0]}</span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-20">
        <Container className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <ContentCard className="glow-accent bg-paper-2">
              <p className="font-heading text-sm font-semibold tracking-widest text-accent uppercase">
                Tagság
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-paper-fg">
                Kövesd a bérletedet és a fejlődésedet
              </h2>
              <p className="mt-4 max-w-xl text-muted-light">
                Bejelentkezés után saját dashboardon látod az aktuális
                bérletedet, a hátralévő alkalmaidat, a belépéseid
                történetét és a személyes QR-kódodat, amivel a recepción
                beléphetsz.
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
          </Reveal>

          <Reveal delay={0.1}>
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
          </Reveal>
        </Container>
      </section>

      <section className="brand-pattern relative overflow-hidden bg-ink py-24">
        <Container className="relative flex flex-col items-center text-center">
          <Reveal>
            <p className="font-heading text-sm font-semibold tracking-widest text-accent-on-dark uppercase">
              Ne halogasd
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-wide text-white uppercase sm:text-5xl">
              Készen állsz a <span className="bg-accent px-2">változásra?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-muted-dark">
              Regisztrálj most, és még ma elkezdheted — az első bérleted
              bankkártyával azonnal aktiválható.
            </p>
            <Button href="/regisztracio" variant="primary" size="lg" className="mt-8">
              Csatlakozom a Forge Gymhez
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
