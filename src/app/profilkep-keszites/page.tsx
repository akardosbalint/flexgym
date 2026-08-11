import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { ProfilePhotoCapture } from "@/components/profile-photo-capture";

export const metadata: Metadata = {
  title: "Profilkép készítése",
  robots: { index: false, follow: false },
};

export default async function ProfilePhotoPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/bejelentkezes");
  }
  if (session.user.role !== "MEMBER") {
    redirect("/admin");
  }

  return (
    <div className="brand-pattern flex min-h-full flex-col items-center bg-ink px-4 py-16">
      <Logo tone="dark" className="mb-8" />
      <div className="w-full max-w-sm text-center">
        <h1 className="font-display text-3xl tracking-wide text-ink-fg uppercase">
          Profilkép készítése
        </h1>
        <p className="mt-2 text-sm text-muted-dark">
          Ezt a fotót látja majd a recepciós munkatárs beléptetéskor, hogy
          könnyebben megbizonyosodjon róla, hogy a QR-kóddal tényleg te lépsz
          be. Feltöltés helyett élőben, a kamerával kell elkészítened.
        </p>
      </div>

      <div className="mt-8">
        <ProfilePhotoCapture />
      </div>
    </div>
  );
}
