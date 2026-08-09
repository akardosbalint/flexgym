import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { MembershipCard } from "@/components/dashboard/membership-card";
import { MemberQrCard } from "@/components/dashboard/member-qr-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsageChart } from "@/components/dashboard/usage-chart";

export const metadata: Metadata = { title: "Dashboard | Forge Gym" };

function formatDateTime(d: Date) {
  return d.toLocaleString("hu-HU", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardOverviewPage() {
  const session = await auth();
  const userId = session!.user.id;
  const { checkInCode, activeMembership, checkIns, checkInsLast30Days, avgDurationMin, weeklyUsage } =
    await getDashboardData(userId);

  const firstName = (session!.user.name ?? "Tag").split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-paper-fg">Szia, {firstName}!</h1>
        <p className="mt-1 text-muted-light">Itt a heti összefoglalód és az aktuális bérleted.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <MemberQrCard checkInCode={checkInCode} />
        <MembershipCard membership={activeMembership} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Belépés (30 nap)"
          value={String(checkInsLast30Days.length)}
          hint="alkalom az elmúlt hónapban"
        />
        <StatCard
          label="Átlagos edzésidő"
          value={`${avgDurationMin} perc`}
          hint="az összes rögzített belépés alapján"
        />
        <StatCard
          label="Összes belépés"
          value={String(checkIns.length)}
          hint="mióta tag vagy nálunk"
        />
      </div>

      <div className="rounded-lg border border-paper-border bg-paper p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-paper-fg">
            Heti edzésgyakoriság
          </h2>
          <span className="text-xs text-muted-light">Elmúlt 8 hét</span>
        </div>
        <div className="mt-4">
          <UsageChart data={weeklyUsage} />
        </div>
      </div>

      <div className="rounded-lg border border-paper-border bg-paper p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-paper-fg">
            Legutóbbi belépések
          </h2>
          <Link href="/dashboard/tortenet" className="text-sm font-medium text-accent hover:underline">
            Összes megtekintése →
          </Link>
        </div>

        {checkIns.length === 0 ? (
          <p className="mt-4 text-sm text-muted-light">Még nincs rögzített belépésed.</p>
        ) : (
          <ul className="mt-4 divide-y divide-paper-border">
            {checkIns.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-paper-fg">{formatDateTime(c.checkedInAt)}</p>
                  <p className="text-muted-light">{c.gate}</p>
                </div>
                <span className="text-muted-light">{c.durationMin ?? "—"} perc</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
