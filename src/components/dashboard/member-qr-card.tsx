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
    </div>
  );
}
