import Link from "next/link";
import { clsx } from "clsx";

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const onDark = tone === "dark";

  return (
    <Link
      href="/"
      className={clsx("group flex items-center gap-2.5", className)}
      aria-label="Flex Gym - Kezdőlap"
    >
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" className="shrink-0" aria-hidden="true">
        <rect x="1.5" y="1.5" width="35" height="35" rx="4" fill={onDark ? "#0b0b0c" : "#ffffff"} stroke="var(--accent)" strokeWidth="2.5" />
        <text
          x="19"
          y="16.5"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="11"
          letterSpacing="0.5"
          fill={onDark ? "#ffffff" : "#0b0b0c"}
        >
          FLEX
        </text>
        <rect x="6" y="21" width="26" height="10" fill="var(--accent)" />
        <text
          x="19"
          y="28.7"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="9.5"
          letterSpacing="1"
          fill="#ffffff"
        >
          GYM
        </text>
      </svg>
      <span
        className={clsx(
          "font-display text-2xl leading-none tracking-wide",
          onDark ? "text-ink-fg" : "text-paper-fg",
        )}
      >
        FLEX <span className="text-accent">GYM</span>
      </span>
    </Link>
  );
}
