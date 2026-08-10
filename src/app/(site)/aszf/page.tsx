import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { CONTACT } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "ÁSZF",
  description: "A Forge Gym Általános Szerződési Feltételei — tagsági, bérleti és beléptetési szabályzat.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Jogi információk" title="ÁSZF" highlight="SZF" />

      <div className="bg-ink py-16">
        <Container>
          <ContentCard>
            <div className="mb-8 rounded-md border border-accent/30 bg-accent/10 p-4 text-sm text-paper-fg">
              <strong>Minta szöveg.</strong> Ez az Általános Szerződési
              Feltételek oldal egy általános sablon — élesítés előtt jogi
              szakértővel szükséges véleményeztetni és a Forge Gym tényleges
              szolgáltatásaihoz, díjaihoz és házirendjéhez igazítani.
            </div>

            <h1 className="font-heading text-2xl font-bold text-paper-fg">
              Általános Szerződési Feltételek
            </h1>
            <p className="mt-2 text-sm text-muted-light">Hatályos: 2026. január 1-től</p>

            <Section title="1. Szolgáltató adatai">
              <p>
                Forge Gym, {CONTACT.address}. Elérhetőség: {CONTACT.email},{" "}
                {CONTACT.phone}.
              </p>
            </Section>

            <Section title="2. A szolgáltatás tárgya">
              <p>
                A Forge Gym edzőtermi szolgáltatásokat (terembérlet,
                alkalmi belépő, edzői/csoportos órák) nyújt, az „Árak”
                oldalon feltüntetett díjazás szerint. A bérletek
                aktiválása bankkártyás fizetéssel, a beléptetés a
                Weboldalon generált, személyes QR-kóddal, a helyszínen
                történő beolvasás útján zajlik.
              </p>
            </Section>

            <Section title="3. Regisztráció és fiók">
              <p>
                A Weboldalon történő regisztráció a tagsági dashboard
                eléréséhez szükséges. A fiók adatainak valódiságáért a
                regisztráló felhasználó felel. A jelszó bizalmas
                kezeléséért a felhasználó felelős.
              </p>
            </Section>

            <Section title="4. Vásárlás és fizetés">
              <p>
                A bérlet megvásárlásával a felhasználó és a Forge Gym között
                szerződés jön létre. A fizetés a Weboldalon feltüntetett
                módokon (bankkártya, a fizetési szolgáltató — Stripe —
                hosztolt fizetési oldalán) történik; Szép Kártyával jelenleg
                nem lehet fizetni. Az árak forintban, bruttó (áfával növelt)
                összegben szerepelnek, az „Árak” oldalon feltüntetve,
                rejtett költség nélkül. A bankkártyás fizetéseknél az erős
                ügyfél-hitelesítés (PSD2/SCA) követelményeit a fizetési
                szolgáltató biztosítja.
              </p>
              <p>
                <strong>Az „Alkalmi belépő” egyszeri vásárlás</strong> — a
                fizetés egy alkalommal történik, nem újul meg automatikusan.
              </p>
              <p>
                <strong>A Havi, Negyedéves és Éves bérlet automatikusan
                megújuló előfizetés.</strong> Ez azt jelenti, hogy a
                megvásárolt időszak (1 hónap, 3 hónap, illetve 1 év) lejártakor
                a Weboldal — külön értesítés nélkül — automatikusan újra
                terheli a megadott bankkártyát a mindenkori, az „Árak” oldalon
                feltüntetett díjjal, és a bérlet a következő időszakra
                meghosszabbodik. Ez addig ismétlődik, amíg a felhasználó le
                nem mondja az előfizetést.
              </p>
              <p>
                Az előfizetés bármikor, indoklás nélkül lemondható a tagsági
                dashboardon (Bérletem → Előfizetés kezelése), ahol a Stripe
                biztonságos előfizetés-kezelő felülete nyílik meg. A lemondás
                a folyó, már kifizetett időszak végéig nem szünteti meg a
                hozzáférést — csak azt, hogy a következő időszakra újra
                terhelésre kerüljön a kártya. A folyó időszakra arányos
                visszatérítés lemondás esetén nem jár.
              </p>
            </Section>

            <Section title="5. Elállás, lemondás, visszatérítés">
              <p>
                Ha a felhasználó fogyasztónak minősül, a bérlet online
                megvásárlásától (egyszeri vásárlás esetén az „Alkalmi
                belépőnél”, előfizetés esetén az első terheléstől) számított
                14 napon belül indoklás nélkül elállhat a szerződéstől,
                feltéve, hogy a bérletet ez idő alatt még nem vette igénybe
                (nem történt beléptetés). Ha a felhasználó a 14 napos
                határidőn belül igénybe vette a szolgáltatást, az elállási
                jog a már felhasznált mértékkel arányosan csökken. Az elállási
                jog kizárólag az adott (első) fizetésre vonatkozik — az
                előfizetés lemondását a 4. pontban leírt módon, a
                dashboardon keresztül lehet kezdeményezni.
              </p>
              <p>
                Elálláshoz, illetve visszatérítési igény esetén a{" "}
                {CONTACT.email} címen lehet jelezni; jogos igény esetén a
                visszatérítés az eredeti fizetési módra, a jelzéstől
                számított 14 napon belül történik.
              </p>
            </Section>

            <Section title="6. Házirend, belépés">
              <p>
                Az edzőterem használatára a helyszínen kifüggesztett
                házirend, valamint az online felületen közzétett
                korhatár-szabályok (16 év alatt szülői felügyelet mellett,
                12 év alatt nem látogatható) irányadók.
              </p>
            </Section>

            <Section title="7. Felelősség korlátozása">
              <p>
                A Forge Gym a tőle elvárható gondossággal üzemelteti a
                Weboldalt, a tagsági dashboardot, a QR-kódos beléptető
                rendszert és a fizetési szolgáltató (bankkártyás
                fizetés) integrációját, de nem vállal felelősséget az
                ezekben esetlegesen felmerülő technikai hibákért.
              </p>
            </Section>

            <Section title="8. Panaszkezelés, vitarendezés">
              <p>
                Panasz esetén a felhasználó a {CONTACT.email} címen
                fordulhat a Forge Gymhez. A felek közötti jogvita esetén a
                hatályos magyar jogszabályok az irányadók.
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
