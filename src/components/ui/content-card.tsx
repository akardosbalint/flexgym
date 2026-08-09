import { clsx } from "clsx";

export function ContentCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx("rounded-2xl border border-paper-border bg-paper p-6 text-paper-fg shadow-xl shadow-black/20 sm:p-10", className)}>
      {children}
    </div>
  );
}
