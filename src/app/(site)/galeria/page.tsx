import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";

export const metadata: Metadata = { title: "Galéria | Forge Gym" };

const GALLERY_ITEMS = [
  { title: "Testépítő terem", tall: true },
  { title: "Kardió park" },
  { title: "Szabadsúlyos zóna" },
  { title: "Küzdősport terem", tall: true },
  { title: "Öltöző & szauna" },
  { title: "Recepció" },
  { title: "Csoportos foglalkozás" },
  { title: "Masszázs szoba" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Nézz körül"
        title="GALÉRIA"
        highlight="RIA"
        description="Fotók hamarosan érkeznek a teremről. Addig is itt egy előzetes a tereinkről — a végleges galéria valódi felvételekkel töltődik majd fel."
      />

      <div className="bg-ink py-16">
        <Container>
          <ContentCard>
            <div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {GALLERY_ITEMS.map((item, i) => (
                <div
                  key={item.title}
                  className={`group relative overflow-hidden rounded-lg border border-paper-border ${
                    item.tall ? "row-span-2" : ""
                  }`}
                  style={{
                    background: "linear-gradient(135deg, var(--ink-2), var(--ink) 60%)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-80 transition-opacity group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at ${20 + ((i * 17) % 60)}% ${
                        20 + ((i * 29) % 60)
                      }%, rgba(224,18,31,0.35), transparent 60%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </Container>
      </div>
    </>
  );
}
