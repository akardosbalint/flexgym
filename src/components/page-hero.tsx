import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
}: {
  eyebrow?: string;
  title: string;
  /** Trailing part of the title rendered inside a solid red box, echoing the brand's title treatment. */
  highlight?: string;
  description?: string;
}) {
  const base = highlight && title.endsWith(highlight) ? title.slice(0, -highlight.length) : title;

  return (
    <div className="brand-pattern relative overflow-hidden border-b border-ink-border bg-ink">
      <Container className="relative py-16 sm:py-20">
        {eyebrow && (
          <p className="font-heading text-sm font-semibold tracking-widest text-accent uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-wide text-white uppercase sm:text-6xl">
          {base}
          {highlight && (
            <span className="ml-2 inline-block bg-accent px-3 py-0.5 text-white">{highlight}</span>
          )}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base text-muted-dark sm:text-lg">{description}</p>
        )}
      </Container>
    </div>
  );
}
