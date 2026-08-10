import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Beléptetés",
  description: "Munkatársi bejelentkezés a Forge Gym QR-kódos beléptető rendszeréhez.",
  robots: { index: false, follow: false },
};

export default function StaffLoginPage() {
  return (
    <div className="brand-pattern flex min-h-[calc(100vh-4.5rem)] items-center bg-ink">
      <Container className="flex justify-center py-16">
        <ContentCard className="w-full max-w-sm">
          <p className="font-heading text-sm font-semibold tracking-widest text-accent uppercase">
            Munkatársaknak
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-wide text-paper-fg uppercase">
            Beléptetés
          </h1>
          <p className="mt-1 text-sm text-muted-light">
            Jelentkezz be a QR-kódos beléptető felülethez.
          </p>

          <div className="mt-6">
            <Suspense>
              <LoginForm defaultRedirect="/admin" />
            </Suspense>
          </div>

          <div className="mt-6 rounded-md bg-paper-2 p-4 text-xs text-muted-light">
            <p className="font-semibold text-paper-fg">Demo admin belépés</p>
            <p className="mt-1">demo@gym.miepitettuk.hu / DemoAdmin123</p>
          </div>
        </ContentCard>
      </Container>
    </div>
  );
}
