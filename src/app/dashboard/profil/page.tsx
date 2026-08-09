import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Profil | Flex Gym" };

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
        <p className="mt-1 text-muted-light">Fiókadataid a Flex Gymnél.</p>
      </div>

      <div className="rounded-lg border border-paper-border bg-paper p-6">
        <dl className="divide-y divide-paper-border text-sm">
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
        A profiladatok szerkesztése és a jelszóváltoztatás egy következő
        fejlesztési körben érkezik, miután a GPass fiókoddal is
        összekapcsoljuk a profilt.
      </div>
    </div>
  );
}
