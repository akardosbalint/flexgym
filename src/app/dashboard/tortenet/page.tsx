import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Előzmények | Forge Gym" };

function formatHuf(value: number) {
  return `${value.toLocaleString("hu-HU")} Ft`;
}

function formatDateTime(d: Date) {
  return d.toLocaleString("hu-HU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(d: Date) {
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" });
}

export default async function HistoryPage() {
  const session = await auth();
  const userId = session!.user.id;
  const { checkIns, purchases } = await getDashboardData(userId);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-bold text-paper-fg">Előzmények</h1>
        <p className="mt-1 text-muted-light">Belépéseid és vásárlásaid teljes története.</p>
      </div>

      <section>
        <h2 className="font-heading text-xl font-semibold text-paper-fg">Belépések</h2>
        {checkIns.length === 0 ? (
          <p className="mt-3 text-sm text-muted-light">Még nincs rögzített belépésed.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-paper-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper-2 text-xs tracking-widest text-muted-light uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">Időpont</th>
                  <th className="px-5 py-3 font-semibold">Kapu</th>
                  <th className="px-5 py-3 font-semibold">Időtartam</th>
                </tr>
              </thead>
              <tbody>
                {checkIns.map((c, i) => (
                  <tr key={c.id} className={i % 2 === 1 ? "bg-paper-2" : "bg-paper"}>
                    <td className="px-5 py-3 font-medium text-paper-fg">
                      {formatDateTime(c.checkedInAt)}
                    </td>
                    <td className="px-5 py-3 text-muted-light">{c.gate}</td>
                    <td className="px-5 py-3 text-muted-light">{c.durationMin ?? "—"} perc</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-paper-fg">Vásárlások</h2>
        {purchases.length === 0 ? (
          <p className="mt-3 text-sm text-muted-light">Még nincs rögzített vásárlásod.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-paper-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper-2 text-xs tracking-widest text-muted-light uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">Dátum</th>
                  <th className="px-5 py-3 font-semibold">Tétel</th>
                  <th className="px-5 py-3 font-semibold">Összeg</th>
                  <th className="px-5 py-3 font-semibold">Fizetési mód</th>
                  <th className="px-5 py-3 font-semibold">Számlaszám</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 1 ? "bg-paper-2" : "bg-paper"}>
                    <td className="px-5 py-3 font-medium text-paper-fg">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-muted-light">{p.item}</td>
                    <td className="px-5 py-3 text-muted-light">{formatHuf(p.amountHuf)}</td>
                    <td className="px-5 py-3 text-muted-light">{p.method}</td>
                    <td className="px-5 py-3 text-muted-light">{p.invoiceNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
