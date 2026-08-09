export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink-border bg-accent py-3">
      <div className="flex w-max animate-marquee">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 px-6 font-display text-lg tracking-wide whitespace-nowrap text-white uppercase"
          >
            {item}
            <span aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
