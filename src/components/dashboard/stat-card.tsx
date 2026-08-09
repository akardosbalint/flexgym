export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-paper-border bg-paper p-5">
      <p className="text-xs font-semibold tracking-widest text-muted-light uppercase">{label}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-paper-fg">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-light">{hint}</p>}
    </div>
  );
}
