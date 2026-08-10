import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/bejelentkezes");
  }
  if (session.user.role !== "STAFF") {
    redirect("/dashboard");
  }

  return <AdminShell staffName={session.user.name ?? session.user.email ?? "Munkatárs"}>{children}</AdminShell>;
}
