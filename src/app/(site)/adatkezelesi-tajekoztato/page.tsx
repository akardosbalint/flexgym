import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { CONTACT } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató",
  description: "Hogyan kezeli a Forge Gym a személyes adataidat: milyen adatokat gyűjtünk, miért, meddig, és milyen jogaid vannak.",
};

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
              szükséges véleményeztetni és a Forge Gym tényleges
              adatkezelési gyakorlatához igazítani.
            </div>

            <h1 className="font-heading text-2xl font-bold text-paper-fg">
              Adatkezelési tájékoztató
            </h1>
            <p className="mt-2 text-sm text-muted-light">Hatályos: 2026. január 1-től</p>

            <Section title="1. Az adatkezelő">
              <p>
                Forge Gym ({CONTACT.address}, {CONTACT.email}, {CONTACT.phone})
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
                  a bérleteidet, a QR-kódos belépőkódodhoz köthető
                  beléptetéseidet (időpont, ügyeletes munkatárs) és a
                  vásárlásaidat a Weboldal saját rendszerében tároljuk és
                  jelenítjük meg a tagsági dashboardon.
                </li>
                <li>
                  <strong>Fizetési adatok:</strong> a bankkártyás fizetést a
                  Weboldal fizetési szolgáltatója (Stripe) bonyolítja le;
                  kártyaadatokat mi magunk nem tárolunk, azokhoz nem is
                  férünk hozzá. Automatikusan megújuló bérlet (Havi,
                  Negyedéves, Éves) esetén a Stripe a bérlet lemondásáig a
                  megadott kártyát a megújuláskor is jogosult megterhelni.
                </li>
                <li>
                  <strong>Technikai adatok:</strong> cookie-k útján gyűjtött,
                  a Weboldal működéséhez szükséges, illetve — kizárólag
                  hozzájárulásod esetén — látogatottságmérési adatok (lásd
                  6. pont).
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
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Fiókadatok, tagsági adatok:</strong> a fiók
                  fennállásáig, vagy amíg az érintett a fiókját a
                  profiloldalon található „Fiók törlése” funkcióval nem
                  törli.
                </li>
                <li>
                  <strong>Vásárlási/számlázási adatok:</strong> a számviteli
                  jogszabályokban előírt megőrzési idő szerint (jellemzően 8
                  év), fiók törlése esetén is.
                </li>
                <li>
                  <strong>Kapcsolatfelvételi üzenetek:</strong> a megkeresés
                  elintézésétől számított legfeljebb 1 évig.
                </li>
                <li>
                  <strong>Jelszó-visszaállító tokenek:</strong> kibocsátástól
                  számított 1 óráig, utána automatikusan érvénytelenek.
                </li>
              </ul>
            </Section>

            <Section title="5. Adatfeldolgozók, adattovábbítás">
              <p>Az adatkezelés során az alábbi adatfeldolgozókat/önálló adatkezelőket vesszük igénybe:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li><strong>Stripe</strong> — bankkártyás fizetések lebonyolítása.</li>
                <li><strong>Google Workspace</strong> — tranzakciós emailek (jelszó-visszaállítás, kapcsolatfelvétel) kézbesítése.</li>
                <li>Tárhely- és adatbázis-szolgáltató a Weboldal üzemeltetéséhez.</li>
                <li>Hozzájárulás esetén statisztikai/elemző szolgáltató (lásd 6. pont).</li>
              </ul>
              <p className="mt-2">
                Ezek a szolgáltatók kizárólag a feladatuk ellátásához
                szükséges mértékben férnek hozzá az adatokhoz.
              </p>
            </Section>

            <Section title="6. Cookie-k (sütik)">
              <p>
                A Weboldal a bejelentkezés fenntartásához és a beléptető
                rendszer működéséhez elengedhetetlenül szükséges sütiket
                mindig használja. A sütitájékoztatóban választható,
                nem elengedhetetlen <strong>statisztikai</strong> kategória
                (látogatottságmérés) kizárólag kifejezett hozzájárulás esetén
                aktiválódik, és a hozzájárulás bármikor módosítható a lábléc
                „Cookie beállítások” linkjén.
              </p>
            </Section>

            <Section title="7. Az érintettek jogai">
              <p>
                Az érintett jogosult tájékoztatást kérni személyes adatai
                kezeléséről, kérheti azok helyesbítését, törlését,
                kezelésének korlátozását, tiltakozhat az adatkezelés ellen,
                továbbá élhet adathordozhatósághoz való jogával.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Az adathordozhatósághoz való jog gyakorlásához bejelentkezve
                  a profiloldalon az „Adataim letöltése” funkcióval bármikor
                  letöltheted az összes rólad tárolt adatot.
                </li>
                <li>
                  A törléshez való jog gyakorlásához bejelentkezve a
                  profiloldalon a „Fiók törlése” funkcióval kezdeményezheted
                  fiókod és a hozzá tartozó adatok végleges törlését.
                </li>
                <li>
                  Egyéb kérelem esetén a 8. pontban megadott elérhetőségen
                  fordulhatsz hozzánk.
                </li>
              </ul>
              <p className="mt-2">
                Panasszal a Nemzeti Adatvédelmi és Információszabadság
                Hatóságnál (NAIH) lehet élni: 1055 Budapest, Falk Miksa utca
                9-11.,{" "}
                <a href="https://naih.hu" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:no-underline">
                  naih.hu
                </a>
                , ugyfelszolgalat@naih.hu.
              </p>
            </Section>

            <Section title="8. Kapcsolat">
              <p>
                Adatkezeléssel kapcsolatos kérdés, kérelem esetén az{" "}
                <a href={`mailto:${CONTACT.email}`} className="text-accent underline underline-offset-2 hover:no-underline">
                  {CONTACT.email}
                </a>{" "}
                címen érhető el az adatkezelő.
              </p>
            </Section>

            <Section title="9. Adatbiztonság">
              <p>
                A jelszavakat visszafejthetetlen, titkosított formában
                tároljuk. A bejelentkezés HttpOnly, biztonságos sütiken
                alapul. A jelszó-visszaállító linkek egyszer használatosak és
                1 óra után lejárnak. Adatvédelmi incidens esetén az
                érintetteket és — jogszabályi kötelezettség esetén — a NAIH-t
                indokolatlan késedelem nélkül tájékoztatjuk.
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
