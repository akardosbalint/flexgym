import type { Metadata } from "next";
import { Oswald, Anton, Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { CookieBanner } from "@/components/cookie-banner";
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

export const metadata: Metadata = {
  title: "Forge Gym Budapest",
  description:
    "Forge Gym Budapest - kovácsold magad, válj legendává! Testépítés, kardió és küzdősport egy helyen, saját QR-kódos beléptető rendszerrel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="hu"
      className={`${displayFont.variable} ${headingFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <SessionProvider>{children}</SessionProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
