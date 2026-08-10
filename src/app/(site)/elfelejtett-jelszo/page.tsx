import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Elfelejtett jelszó",
  description: "Kérj új jelszó-visszaállító linket a Forge Gym fiókodhoz.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="brand-pattern flex min-h-[calc(100vh-4.5rem)] items-center bg-ink">
      <Container className="flex justify-center py-16">
        <ContentCard className="w-full max-w-sm">
          <h1 className="font-display text-3xl tracking-wide text-paper-fg uppercase">
            Elfelejtett jelszó
          </h1>
          <p className="mt-1 text-sm text-muted-light">
            Add meg az email címed, és küldünk egy linket, amivel új jelszót állíthatsz be.
          </p>

          <div className="mt-6">
            <ForgotPasswordForm />
          </div>

          <p className="mt-6 text-sm text-muted-light">
            Eszedbe jutott?{" "}
            <Link href="/bejelentkezes" className="font-medium text-accent underline underline-offset-2 hover:no-underline">
              Vissza a bejelentkezéshez
            </Link>
          </p>
        </ContentCard>
      </Container>
    </div>
  );
}
