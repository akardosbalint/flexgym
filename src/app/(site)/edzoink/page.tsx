import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/ui/content-card";
import { TrainersGrid } from "@/components/trainers-grid";

export const metadata: Metadata = { title: "Edzőink | Flex Gym" };

export default function TrainersPage() {
  return (
    <>
      <PageHero
        eyebrow="Csapatunk"
        title="EDZŐINK"
        highlight="INK"
        description="Erőnléti, küzdősport és masszázs szakágban is tapasztalt szakembereinkre bízhatod magad."
      />

      <div className="bg-ink py-16">
        <Container>
          <ContentCard>
            <TrainersGrid />

            <div className="mt-16 rounded-lg bg-accent p-8 text-center text-white">
              <h2 className="font-heading text-xl font-semibold uppercase">
                Jelentkezés edzői pozícióba
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/90">
                Ha te is része szeretnél lenni a Flex Gym csapatának, írj nekünk
                pár szót magadról és a szakterületedről.
              </p>
              <Button href="/kapcsolat" variant="dark" size="md" className="mt-5">
                Jelentkezés
              </Button>
            </div>
          </ContentCard>
        </Container>
      </div>
    </>
  );
}
