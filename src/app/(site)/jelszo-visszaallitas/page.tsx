import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = { title: "Jelszó visszaállítása | Flex Gym" };

export default function ResetPasswordPage() {
  return (
    <div className="brand-pattern flex min-h-[calc(100vh-4.5rem)] items-center bg-ink">
      <Container className="flex justify-center py-16">
        <ContentCard className="w-full max-w-sm">
          <h1 className="font-display text-3xl tracking-wide text-paper-fg uppercase">
            Új jelszó
          </h1>
          <p className="mt-1 text-sm text-muted-light">Add meg az új jelszavadat.</p>

          <div className="mt-6">
            <Suspense>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </ContentCard>
      </Container>
    </div>
  );
}
