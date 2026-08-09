import Link from "next/link";
import { clsx } from "clsx";

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const onDark = tone === "dark";

  return (
    <Link
      href="/"
      className={clsx("group flex items-center gap-2.5", className)}
      aria-label="Forge Gym - Kezdőlap"
    >
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" className="shrink-0" aria-hidden="true">
        <rect
          x="1.5"
          y="1.5"
          width="35"
          height="35"
          rx="4"
          fill="var(--accent)"
          stroke="var(--accent)"
          strokeWidth="2.5"
        />
        <text
          x="19"
          y="26"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="24"
          fill="#ffffff"
        >
          F
        </text>
      </svg>
      <span
        className={clsx(
          "font-display text-2xl leading-none tracking-wide",
          onDark ? "text-ink-fg" : "text-paper-fg",
        )}
      >
        FORGE <span className="text-accent">GYM</span>
      </span>
    </Link>
  );
}
