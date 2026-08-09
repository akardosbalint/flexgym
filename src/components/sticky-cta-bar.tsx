"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const HIDDEN_ON = [
  "/bejelentkezes",
  "/regisztracio",
  "/elfelejtett-jelszo",
  "/jelszo-visszaallitas",
  "/adatkezelesi-tajekoztato",
  "/aszf",
];

export function StickyCtaBar() {
  const pathname = usePathname();
  const { status } = useSession();

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-border bg-ink/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-white uppercase">
            Csatlakozz a Forge Gymhez
          </p>
          <p className="truncate text-xs text-muted-dark">Első bérlet ma is aktiválható</p>
        </div>
        <Button
          href={status === "authenticated" ? "/dashboard" : "/regisztracio"}
          variant="primary"
          size="md"
          className="shrink-0"
        >
          {status === "authenticated" ? "Dashboard" : "Csatlakozom"}
        </Button>
      </div>
    </div>
  );
}
