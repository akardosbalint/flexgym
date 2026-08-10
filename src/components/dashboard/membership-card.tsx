import Link from "next/link";
import type { Membership } from "@/generated/prisma/client";
import { getMembershipProgress } from "@/lib/membership-progress";
import { manageSubscription } from "@/app/dashboard/berlet/actions";

function formatHuf(value: number) {
  return `${value.toLocaleString("hu-HU")} Ft`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
}

export function MembershipCard({ membership }: { membership: Membership | null }) {
  if (!membership) {
    return (
      <div className="rounded-lg border border-paper-border bg-linear-to-br from-paper to-paper-2 p-8">
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Bérlet</p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-paper-fg">
          Jelenleg nincs aktív bérleted
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-light">
          Válassz bérletet, és a QR-kódos belépőkódodat azonnal
          használhatod is a teremben.
        </p>
        <Link
          href="/dashboard/berlet"
          className="mt-5 inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold tracking-wide text-accent-foreground uppercase hover:bg-accent-hover"
        >
          Bérlet vásárlása
        </Link>
      </div>
    );
  }

  const { daysLeft, timeProgress, entriesProgress } = getMembershipProgress(membership);
  const isSubscription = Boolean(membership.stripeSubscriptionId);

  return (
    <div className="rounded-lg border border-paper-border bg-linear-to-br from-paper to-paper-2 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">
            Aktív bérlet
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-paper-fg">
            {membership.name}
          </h2>
          {isSubscription ? (
            membership.cancelAtPeriodEnd ? (
              <p className="mt-1 text-sm text-accent">
                Nem újul meg — {formatDate(membership.endDate)}-ig aktív.
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-light">
                Következő megújulás: {formatDate(membership.endDate)}
              </p>
            )
          ) : (
            <p className="mt-1 text-sm text-muted-light">
              Érvényes: {formatDate(membership.startDate)} – {formatDate(membership.endDate)}
            </p>
          )}
        </div>
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase">
          {daysLeft} nap van hátra
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="flex justify-between text-xs text-muted-light">
            <span>Bérleti időszak</span>
            <span>{timeProgress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-2">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${timeProgress}%` }}
            />
          </div>
        </div>

        {entriesProgress !== null ? (
          <div>
            <div className="flex justify-between text-xs text-muted-light">
              <span>
                Felhasznált alkalmak ({membership.usedEntries}/{membership.totalEntries})
              </span>
              <span>{entriesProgress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${entriesProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between text-xs text-muted-light">
              <span>Belépések ebben az időszakban</span>
            </div>
            <p className="mt-2 font-heading text-xl font-semibold text-paper-fg">
              {membership.usedEntries} alkalom
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-paper-border pt-5 text-sm">
        <span className="text-muted-light">Ár: {formatHuf(membership.priceHuf)}</span>
        {isSubscription ? (
          <form action={manageSubscription}>
            <button
              type="submit"
              className="font-semibold text-accent underline underline-offset-2 hover:no-underline"
            >
              Előfizetés kezelése →
            </button>
          </form>
        ) : (
          <Link href="/dashboard/berlet" className="font-semibold text-accent underline underline-offset-2 hover:no-underline">
            Bérlet vásárlása →
          </Link>
        )}
      </div>
    </div>
  );
}
