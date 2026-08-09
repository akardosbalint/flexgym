import QRCode from "qrcode";
import { checkInCodeToQrContent, formatCheckInCode } from "@/lib/qr-checkin";

export async function MemberQrCard({ checkInCode }: { checkInCode: string }) {
  const dataUrl = await QRCode.toDataURL(checkInCodeToQrContent(checkInCode), {
    margin: 1,
    width: 220,
    color: { dark: "#18181b", light: "#ffffff" },
  });

  return (
    <div className="flex flex-col items-center rounded-lg border border-paper-border bg-paper p-6 text-center">
      <p className="font-heading text-sm font-semibold tracking-widest text-accent uppercase">
        Belépőkódom
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element -- small data: URI, no need for next/image optimization */}
      <img
        src={dataUrl}
        alt="Személyes belépő QR-kód"
        width={180}
        height={180}
        className="mt-4 rounded-md border border-paper-border"
      />
      <p className="mt-3 font-mono text-sm tracking-widest text-paper-fg">
        {formatCheckInCode(checkInCode)}
      </p>
      <p className="mt-2 max-w-[220px] text-xs text-muted-light">
        Mutasd ezt a recepción belépéskor — a munkatárs beolvassa a kamerával.
      </p>

      <div className="mt-4 flex w-full flex-col gap-2">
        <a
          href="/api/wallet/google"
          className="flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-ink-2"
        >
          <WalletIcon /> Hozzáadás Google Wallethez
        </a>
        <a
          href="/api/wallet/apple"
          className="flex items-center justify-center gap-2 rounded-md border border-paper-border px-4 py-2.5 text-xs font-semibold tracking-wide text-paper-fg uppercase transition-colors hover:border-accent hover:text-accent"
        >
          <WalletIcon /> Hozzáadás Apple Wallethez
        </a>
      </div>
    </div>
  );
}

function WalletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 14.5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
