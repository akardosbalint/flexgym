import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function ArnoldSection() {
  return (
    <section className="brand-pattern relative overflow-hidden border-y border-ink-border bg-ink py-20">
      <Container className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <Reveal>
          <p className="font-heading text-sm font-semibold tracking-widest text-accent uppercase">
            Legendás múlt
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.02] tracking-wide text-white uppercase sm:text-5xl">
            Arnold Schwarzenegger
            <br />
            <span className="bg-accent px-2 shadow-[0_0_50px_-10px_rgba(224,18,31,0.7)]">
              kedvenc budapesti terme
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-muted-dark">
            A Flex Gym négy évtizede a budapesti testépítés otthona — Arnold
            Schwarzenegger is többször megfordult nálunk, és azóta is
            büszkén valljuk magunkat az ő kedvenc budapesti termének. Az
            aláírt emlékek és közös fotók ma is a csarnok falait díszítik.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <PhotoFramePlaceholder />
        </Reveal>
      </Container>
    </section>
  );
}

function PhotoFramePlaceholder() {
  return (
    <figure className="rounded-lg border border-paper-border bg-paper p-3 transition-transform duration-500 hover:-rotate-1">
      <div
        className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-paper-border text-center"
        style={{ background: "linear-gradient(135deg, var(--paper-2), var(--paper))" }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          className="text-muted-light"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="10.5" r="1.8" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M4 17l5-4.5 3.5 3L17 11l4 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="px-6 text-xs font-medium tracking-wide text-muted-light uppercase">
          Fotó helye — hamarosan
        </span>
      </div>
      <figcaption className="mt-2 px-1 pb-1 text-xs text-muted-light">
        Flex Gym & Arnold Schwarzenegger
      </figcaption>
    </figure>
  );
}
