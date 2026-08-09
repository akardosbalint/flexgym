import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { CONTACT } from "@/lib/site-data";

export const metadata: Metadata = { title: "Adatkezelési tájékoztató | Flex Gym" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Jogi információk" title="ADATKEZELÉS" highlight="ÉS" />

      <div className="bg-ink py-16">
        <Container>
          <ContentCard className="prose-legal">
            <div className="mb-8 rounded-md border border-accent/30 bg-accent/10 p-4 text-sm text-paper-fg">
              <strong>Minta szöveg.</strong> Ez az oldal egy általános
              sablon, ami bemutatja a tájékoztató szerkezetét — élesítés
              előtt jogi szakértővel/adatvédelmi tisztviselővel
              szükséges véleményeztetni és a Flex Gym tényleges
              adatkezelési gyakorlatához igazítani.
            </div>

            <h1 className="font-heading text-2xl font-bold text-paper-fg">
              Adatkezelési tájékoztató
            </h1>
            <p className="mt-2 text-sm text-muted-light">Hatályos: 2026. január 1-től</p>

            <Section title="1. Az adatkezelő">
              <p>
                Flex Gym ({CONTACT.address}, {CONTACT.email}, {CONTACT.phone})
                a jelen weboldal (a továbbiakban: „Weboldal”) üzemeltetője és
                az azon keresztül megadott személyes adatok adatkezelője.
              </p>
            </Section>

            <Section title="2. Milyen adatokat kezelünk">
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Regisztráció / bejelentkezés:</strong> név, email
                  cím, jelszó (kizárólag titkosított, visszafejthetetlen
                  formában tárolva).
                </li>
                <li>
                  <strong>Kapcsolatfelvételi űrlap:</strong> név, email cím,
                  az üzenet tartalma.
                </li>
                <li>
                  <strong>Tagsági adatok (bérlet, belépés, vásárlás):</strong>{" "}
                  a beléptetést és a bérletkezelést a GPass rendszere végzi;
                  a Weboldal a tagsági dashboardon ezen adatok egy részét
                  jeleníti meg a bejelentkezett tag számára.
                </li>
                <li>
                  <strong>Technikai adatok:</strong> cookie-k útján gyűjtött,
                  a Weboldal működéséhez szükséges adatok (lásd 6. pont).
                </li>
              </ul>
            </Section>

            <Section title="3. Az adatkezelés célja és jogalapja">
              <p>
                A regisztrációs és kapcsolattartási adatok kezelésének célja
                a tagsági dashboard biztosítása, illetve a megkeresésekre
                való válaszadás. Jogalapja az érintett hozzájárulása
                (GDPR 6. cikk (1) bekezdés a) pont), illetve szerződés
                teljesítése (GDPR 6. cikk (1) bekezdés b) pont) a
                tagsághoz kapcsolódó szolgáltatások nyújtása esetén.
              </p>
            </Section>

            <Section title="4. Adatmegőrzés">
              <p>
                A megadott adatokat a fiók fennállásáig, illetve a
                hozzájárulás visszavonásáig, vagy jogszabályban előírt
                megőrzési ideig kezeljük.
              </p>
            </Section>

            <Section title="5. Adatfeldolgozók, adattovábbítás">
              <p>
                A tagsági és beléptetési adatok kezelésében a GPass mint
                önálló adatkezelő/adatfeldolgozó vesz részt. A Weboldal
                üzemeltetéséhez tárhely- és adatbázis-szolgáltatót veszünk
                igénybe; ezek a szolgáltatók kizárólag a technikai
                üzemeltetéshez szükséges mértékben férnek hozzá az
                adatokhoz.
              </p>
            </Section>

            <Section title="6. Cookie-k (sütik)">
              <p>
                A Weboldal a bejelentkezés fenntartásához szükséges,
                elengedhetetlen sütiket használ. A látogatás során
                megjelenő sütitájékoztató elfogadásával/elutasításával az
                érintett dönthet a nem elengedhetetlen sütik használatáról.
              </p>
            </Section>

            <Section title="7. Az érintettek jogai">
              <p>
                Az érintett jogosult tájékoztatást kérni személyes adatai
                kezeléséről, kérheti azok helyesbítését, törlését,
                kezelésének korlátozását, tiltakozhat az adatkezelés ellen,
                továbbá élhet adathordozhatósághoz való jogával. Panasszal a
                Nemzeti Adatvédelmi és Információszabadság Hatóságnál
                (NAIH) lehet élni.
              </p>
            </Section>

            <Section title="8. Kapcsolat">
              <p>
                Adatkezeléssel kapcsolatos kérdés, kérelem esetén az{" "}
                <a href={`mailto:${CONTACT.email}`} className="text-accent hover:underline">
                  {CONTACT.email}
                </a>{" "}
                címen érhető el az adatkezelő.
              </p>
            </Section>
          </ContentCard>
        </Container>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-lg font-semibold text-paper-fg">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-light">{children}</div>
    </section>
  );
}
