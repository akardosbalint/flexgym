import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountDangerZone } from "@/components/dashboard/account-danger-zone";

export const metadata: Metadata = { title: "Profil" };

function formatDate(d: Date) {
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session!.user.id } });

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-paper-fg">Profil</h1>
        <p className="mt-1 text-muted-light">Fiókadataid a Forge Gymnél.</p>
      </div>

      <div className="rounded-lg border border-paper-border bg-paper p-6">
        <div className="flex items-center gap-4">
          {user.profilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- small data: URI, no need for next/image optimization
            <img
              src={user.profilePhotoUrl}
              alt="Profilképed"
              className="h-16 w-16 shrink-0 rounded-full border border-paper-border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-paper-border bg-ink/5 text-xs text-muted-light">
              Nincs kép
            </div>
          )}
          <div>
            <p className="text-sm text-muted-light">
              Ezt a fotót látja a recepciós munkatárs beléptetéskor.
            </p>
            <Link
              href="/profilkep-keszites"
              className="mt-1 inline-block text-sm font-medium text-accent underline underline-offset-2 hover:no-underline"
            >
              Profilkép frissítése →
            </Link>
          </div>
        </div>

        <dl className="mt-6 divide-y divide-paper-border border-t border-paper-border text-sm">
          <div className="flex justify-between py-3">
            <dt className="text-muted-light">Név</dt>
            <dd className="font-medium text-paper-fg">{user.name}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-muted-light">Email</dt>
            <dd className="font-medium text-paper-fg">{user.email}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-muted-light">Telefon</dt>
            <dd className="font-medium text-paper-fg">{user.phone ?? "—"}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-muted-light">Tag azóta</dt>
            <dd className="font-medium text-paper-fg">{formatDate(user.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-paper-border bg-paper p-6 text-sm text-muted-light">
        A profiladatok szerkesztése egy következő fejlesztési körben
        érkezik. Jelszavadat addig is bármikor visszaállíthatod az{" "}
        <a href="/elfelejtett-jelszo" className="text-accent underline underline-offset-2 hover:no-underline">
          elfelejtett jelszó
        </a>{" "}
        oldalon.
      </div>

      <div className="rounded-lg border border-paper-border bg-paper p-6">
        <h2 className="font-heading text-lg font-semibold text-paper-fg">Adataim letöltése</h2>
        <p className="mt-2 text-sm text-muted-light">
          Töltsd le egy fájlban minden adatot, amit rólad tárolunk: fiókadatok,
          bérletek, belépések és vásárlások.
        </p>
        <a
          href="/api/account/export"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm border border-paper-border px-5 py-2.5 font-heading text-sm font-semibold tracking-wide uppercase text-paper-fg transition-colors hover:border-accent hover:text-accent"
        >
          Adataim letöltése (JSON)
        </a>
      </div>

      <AccountDangerZone />
    </div>
  );
}
