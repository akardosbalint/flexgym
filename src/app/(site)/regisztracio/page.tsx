import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = { title: "Regisztráció | Flex Gym" };

export default function RegisterPage() {
  return (
    <div className="brand-pattern flex min-h-[calc(100vh-4.5rem)] items-center bg-ink">
      <Container className="flex justify-center py-16">
        <ContentCard className="w-full max-w-sm">
          <h1 className="font-display text-3xl tracking-wide text-paper-fg uppercase">
            Regisztráció
          </h1>
          <p className="mt-1 text-sm text-muted-light">
            Hozz létre fiókot, és kövesd a bérletedet a dashboardon.
          </p>

          <div className="mt-6">
            <RegisterForm />
          </div>

          <p className="mt-6 text-sm text-muted-light">
            Már van fiókod?{" "}
            <Link href="/bejelentkezes" className="font-medium text-accent hover:underline">
              Belépés
            </Link>
          </p>
        </ContentCard>
      </Container>
    </div>
  );
}
