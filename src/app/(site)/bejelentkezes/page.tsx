import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Bejelentkezés",
  description: "Jelentkezz be a Forge Gym tagsági fiókodba a bérleted, belépéseid és a QR-kódos belépőkódod eléréséhez.",
};

export default function LoginPage() {
  return (
    <div className="brand-pattern flex min-h-[calc(100vh-4.5rem)] items-center bg-ink">
      <Container className="flex justify-center py-16">
        <ContentCard className="w-full max-w-sm">
          <h1 className="font-display text-3xl tracking-wide text-paper-fg uppercase">
            Bejelentkezés
          </h1>
          <p className="mt-1 text-sm text-muted-light">Lépj be a tagsági dashboardodhoz.</p>

          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-6 text-sm text-muted-light">
            Még nincs fiókod?{" "}
            <Link href="/regisztracio" className="font-medium text-accent underline underline-offset-2 hover:no-underline">
              Regisztrálj
            </Link>
          </p>
        </ContentCard>
      </Container>
    </div>
  );
}
