import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    n: "01",
    title: "Regisztrálsz",
    description: "Fiókot hozol létre, és kiválasztod a bérleted.",
  },
  {
    n: "02",
    title: "Megkapod a QR-kódod",
    description: "A dashboardodon mindig elérhető a személyes belépőkódod.",
  },
  {
    n: "03",
    title: "Beolvasás a recepción",
    description: "A munkatárs egy pillanat alatt beolvassa — irány az edzés.",
  },
];

export function QrShowcaseSection() {
  return (
    <section className="brand-pattern relative overflow-hidden border-y border-ink-border bg-ink py-20">
      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <QrMock />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-heading text-sm font-semibold tracking-widest text-accent-on-dark uppercase">
            Belépés, ahogy lennie kell
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.02] tracking-wide text-white uppercase sm:text-5xl">
            Kártya helyett{" "}
            <span className="bg-accent px-2 shadow-[0_0_50px_-10px_rgba(224,18,31,0.7)]">
              egy QR-kód
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-muted-dark">
            Nincs több elfelejtett kártya. A saját fejlesztésű beléptető
            rendszerünk a telefonodon megjelenő QR-kóddal azonosít — a
            recepciós egy pillanat alatt tudja, aktív-e a bérleted.
          </p>

          <ol className="mt-8 space-y-5">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-4">
                <span className="font-display text-2xl text-accent-on-dark">{step.n}</span>
                <div>
                  <p className="font-heading text-base font-semibold text-white">{step.title}</p>
                  <p className="mt-0.5 text-sm text-muted-dark">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}

function QrMock() {
  return (
    <div className="mx-auto flex max-w-xs flex-col items-center rounded-lg border border-paper-border bg-paper p-8 shadow-2xl">
      <svg width="140" height="140" viewBox="0 0 29 29" className="text-paper-fg" aria-hidden="true">
        <rect width="29" height="29" fill="none" />
        {[
          "1110111 0101 0111011",
          "1000101 1010 0101001",
          "1011101 1101 1011101",
          "1011101 0011 1011101",
          "1011101 1000 1011101",
          "1000101 0110 0101001",
          "1110111 0101 0111011",
          "0000000 1111 0000000",
          "1101011 0010 1101011",
          "0010110 1101 0010110",
          "1110100 0011 1101101",
          "0001011 1010 0110010",
          "1011110 0101 1011011",
          "0100010 1100 0011100",
        ]
          .flatMap((row, y) =>
            row
              .replace(/ /g, "")
              .split("")
              .map((bit, x) => (bit === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)),
          )}
      </svg>
      <p className="mt-4 font-mono text-xs tracking-widest text-muted-light uppercase">
        FORGE-4F82-K91X
      </p>
      <p className="mt-1 text-xs text-muted-light">Kovács Bence saját belépőkódja</p>
    </div>
  );
}
