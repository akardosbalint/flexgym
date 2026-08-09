import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { MembershipCard } from "@/components/dashboard/membership-card";
import { PRICING } from "@/lib/site-data";
import { purchaseMembership } from "./actions";

export const metadata: Metadata = { title: "Bérletem | Flex Gym" };

function formatHuf(value: number) {
  return `${value.toLocaleString("hu-HU")} Ft`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" });
}

export default async function MembershipPage() {
  const session = await auth();
  const userId = session!.user.id;
  const { activeMembership, memberships } = await getDashboardData(userId);

  const pastMemberships = memberships.filter((m) => m.id !== activeMembership?.id);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-bold text-paper-fg">Bérletem</h1>
        <p className="mt-1 text-muted-light">Aktuális bérleted és a megújítási lehetőségek.</p>
      </div>

      <MembershipCard membership={activeMembership} />

      <div>
        <h2 className="font-heading text-xl font-semibold text-paper-fg">
          {activeMembership ? "Bérlet megújítása" : "Bérlet vásárlása"}
        </h2>
        <p className="mt-1 text-sm text-muted-light">
          A vásárlás ezen a demó felületen azonnal aktiválja a bérletet — élesben ez a
          GPass fizetési folyamatán keresztül történne.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col justify-between rounded-lg border border-paper-border bg-paper p-6"
            >
              <div>
                <h3 className="font-heading text-lg font-semibold text-paper-fg">
                  {plan.name}
                </h3>
                <p className="mt-2 font-heading text-2xl font-bold text-accent">
                  {formatHuf(plan.adult)}
                </p>
                <p className="mt-1 text-xs text-muted-light">Érvényesség: {plan.validity}</p>
              </div>
              <form action={purchaseMembership} className="mt-5">
                <input type="hidden" name="plan" value={plan.name} />
                <button
                  type="submit"
                  className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold tracking-wide text-accent-foreground uppercase transition-colors hover:bg-accent-hover"
                >
                  Vásárlás
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-xl font-semibold text-paper-fg">Korábbi bérletek</h2>
        {pastMemberships.length === 0 ? (
          <p className="mt-3 text-sm text-muted-light">Még nincs korábbi bérleted.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-paper-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper-2 text-xs tracking-widest text-muted-light uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">Bérlet</th>
                  <th className="px-5 py-3 font-semibold">Időszak</th>
                  <th className="px-5 py-3 font-semibold">Felhasználás</th>
                  <th className="px-5 py-3 font-semibold">Ár</th>
                  <th className="px-5 py-3 font-semibold">Állapot</th>
                </tr>
              </thead>
              <tbody>
                {pastMemberships.map((m, i) => (
                  <tr key={m.id} className={i % 2 === 1 ? "bg-paper-2" : "bg-paper"}>
                    <td className="px-5 py-3 font-medium text-paper-fg">{m.name}</td>
                    <td className="px-5 py-3 text-muted-light">
                      {formatDate(m.startDate)} – {formatDate(m.endDate)}
                    </td>
                    <td className="px-5 py-3 text-muted-light">
                      {m.totalEntries ? `${m.usedEntries}/${m.totalEntries} alkalom` : `${m.usedEntries} alkalom`}
                    </td>
                    <td className="px-5 py-3 text-muted-light">{formatHuf(m.priceHuf)}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-paper-2 px-2.5 py-1 text-xs text-muted-light">
                        {m.status === "EXPIRED" ? "Lejárt" : m.status === "CANCELLED" ? "Törölve" : "Aktív"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
