import type { Metadata } from "next";
import { Oswald, Anton, Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { CookieBanner } from "@/components/cookie-banner";
import { ConsentedAnalytics } from "@/components/consented-analytics";
import { CONTACT } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const displayFont = Anton({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const headingFont = Oswald({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

const SITE_DESCRIPTION =
  "Forge Gym Budapest - kovácsold magad, válj legendává! Testépítés, kardió és küzdősport egy helyen, saját QR-kódos beléptető rendszerrel.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: "Forge Gym Budapest", template: "%s | Forge Gym" },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName: "Forge Gym",
    title: "Forge Gym Budapest",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Forge Gym Budapest",
    description: SITE_DESCRIPTION,
  },
};

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: "Forge Gym",
  description: SITE_DESCRIPTION,
  url: getSiteUrl(),
  telephone: CONTACT.phone,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Váci út 47.",
    addressLocality: "Budapest",
    postalCode: "1134",
    addressCountry: "HU",
  },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Forge Gym",
  url: getSiteUrl(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="hu"
      className={`${displayFont.variable} ${headingFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          // Static, non-user-controlled JSON - safe to inject directly.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <SessionProvider>{children}</SessionProvider>
        <CookieBanner />
        <ConsentedAnalytics />
      </body>
    </html>
  );
}
