import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Bejelentkezés | Forge Gym" };

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
            <Link href="/regisztracio" className="font-medium text-accent hover:underline">
              Regisztrálj
            </Link>
          </p>

          <div className="mt-6 space-y-3 rounded-md bg-paper-2 p-4 text-xs text-muted-light">
            <div>
              <p className="font-semibold text-paper-fg">Demo tag belépés</p>
              <p className="mt-1">demo@forgegym.hu / forgegym123</p>
            </div>
            <div className="border-t border-paper-border pt-3">
              <p className="font-semibold text-paper-fg">Demo staff belépés (admin / beléptetés)</p>
              <p className="mt-1">staff@forgegym.hu / forgegym123</p>
            </div>
          </div>
        </ContentCard>
      </Container>
    </div>
  );
}
