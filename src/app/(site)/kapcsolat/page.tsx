import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { ContactForm } from "@/components/contact-form";
import { CONTACT, OPENING_HOURS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Kapcsolat",
  description: "Elérhetőségeink, nyitvatartásunk és a Forge Gym Budapest pontos címe — írj nekünk, vagy hívj minket.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Elérhetőségeink" title="KAPCSOLAT" />

      <div className="bg-ink py-16">
        <Container>
          <ContentCard>
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="font-heading text-xl font-semibold text-paper-fg">
                  Elérhetőségek
                </h2>
                <ul className="mt-5 space-y-3 text-sm">
                  <li className="flex items-center gap-3 text-muted-light">
                    <span className="text-accent">●</span> {CONTACT.address}
                  </li>
                  <li className="flex items-center gap-3 text-muted-light">
                    <span className="text-accent">●</span>{" "}
                    <a
                      href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                      className="hover:text-accent"
                    >
                      {CONTACT.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-muted-light">
                    <span className="text-accent">●</span>{" "}
                    <a href={`mailto:${CONTACT.email}`} className="hover:text-accent">
                      {CONTACT.email}
                    </a>
                  </li>
                </ul>

                <h3 className="mt-8 font-heading text-lg font-semibold text-paper-fg">
                  Nyitvatartás
                </h3>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {OPENING_HOURS.map((row) => (
                    <li key={row.day} className="flex justify-between text-muted-light">
                      <span className="text-paper-fg">{row.day}</span>
                      <span>{row.hours}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 aspect-video overflow-hidden rounded-lg border border-paper-border">
                  <iframe
                    title="Forge Gym térkép"
                    src="https://www.google.com/maps?q=Budapest%2C%20V%C3%A1ci%20%C3%BAt%2047%2C%201134&output=embed"
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold text-paper-fg">Írj nekünk</h2>
                <div className="mt-5">
                  <ContactForm />
                </div>
              </div>
            </div>
          </ContentCard>
        </Container>
      </div>
    </>
  );
}
