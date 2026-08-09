import { clsx } from "clsx";

export function RatingBadge({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2.5 rounded-full border px-4 py-2",
        tone === "light" ? "border-white/15 bg-white/5" : "border-paper-border bg-paper",
        className,
      )}
    >
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="15" height="15" viewBox="0 0 20 20" className="text-accent">
            <path
              fill="currentColor"
              d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.7l-5.2 2.8 1-5.8L1.6 7.6l5.8-.8L10 1.5Z"
            />
          </svg>
        ))}
      </div>
      <span
        className={clsx("text-sm font-semibold", tone === "light" ? "text-white" : "text-paper-fg")}
      >
        4,5
      </span>
      <span className={tone === "light" ? "text-sm text-muted-dark" : "text-sm text-muted-light"}>
        · 944 Google-értékelés
      </span>
    </div>
  );
}
