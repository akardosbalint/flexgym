import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/bejelentkezes");
  }

  if (session.user.role === "MEMBER") {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { profilePhotoUrl: true },
    });
    // Mandatory profile photo: no dashboard (and so no QR code) without one.
    if (!user.profilePhotoUrl) {
      redirect("/profilkep-keszites");
    }
  }

  return <DashboardShell userName={session.user.name ?? session.user.email ?? "Tag"}>{children}</DashboardShell>;
}
