import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PKPass } from "passkit-generator";
import { checkInCodeToQrContent, formatCheckInCode } from "@/lib/qr-checkin";

function pemFromEnv(value: string | undefined) {
  return value?.replace(/\\n/g, "\n");
}

async function getCertificates() {
  const wwdr = pemFromEnv(process.env.APPLE_WWDR_CERT);
  const signerCert = pemFromEnv(process.env.APPLE_SIGNER_CERT);
  const signerKey = pemFromEnv(process.env.APPLE_SIGNER_KEY);
  const signerKeyPassphrase = process.env.APPLE_SIGNER_KEY_PASSPHRASE;
  const teamIdentifier = process.env.APPLE_TEAM_ID;
  const passTypeIdentifier = process.env.APPLE_PASS_TYPE_ID;

  if (!wwdr || !signerCert || !signerKey || !teamIdentifier || !passTypeIdentifier) {
    throw new Error(
      "Az Apple Wallet nincs beállítva (APPLE_TEAM_ID / APPLE_PASS_TYPE_ID / APPLE_WWDR_CERT / " +
        "APPLE_SIGNER_CERT / APPLE_SIGNER_KEY). Lásd a .env.example fájlt — ehhez érvényes Apple " +
        "Developer Program tagság és Pass Type ID tanúsítvány szükséges.",
    );
  }

  return {
    teamIdentifier,
    passTypeIdentifier,
    certificates: { wwdr, signerCert, signerKey, signerKeyPassphrase },
  };
}

async function readIcon(fileName: string) {
  const iconPath = path.join(process.cwd(), "public", "wallet", fileName);
  try {
    return await readFile(iconPath);
  } catch {
    throw new Error(
      `Hiányzik a(z) public/wallet/${fileName} ikonfájl — ez kell az Apple Wallet-passzhoz ` +
        "(helyezd el a valódi márka-ikonokat ott, lásd a .env.example / README instrukciókat).",
    );
  }
}

export async function buildApplePassBuffer({
  userId,
  memberName,
  checkInCode,
}: {
  userId: string;
  memberName: string;
  checkInCode: string;
}) {
  const { teamIdentifier, passTypeIdentifier, certificates } = await getCertificates();

  const [icon, icon2x, logo] = await Promise.all([
    readIcon("icon.png"),
    readIcon("icon@2x.png"),
    readIcon("logo.png"),
  ]);

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier,
    teamIdentifier,
    organizationName: "Forge Gym",
    serialNumber: userId,
    description: "Forge Gym belépőkód",
    backgroundColor: "rgb(11,11,12)",
    foregroundColor: "rgb(255,255,255)",
    labelColor: "rgb(224,18,31)",
    logoText: "Forge Gym",
    storeCard: {
      headerFields: [],
      primaryFields: [{ key: "name", label: "TAG", value: memberName }],
      secondaryFields: [
        { key: "code", label: "KÓD", value: formatCheckInCode(checkInCode) },
      ],
      backFields: [
        {
          key: "info",
          label: "Infó",
          value: "Mutasd ezt a recepción belépéskor — a munkatárs beolvassa a kamerával.",
        },
      ],
    },
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: checkInCodeToQrContent(checkInCode),
        messageEncoding: "iso-8859-1",
      },
    ],
  };

  const pass = new PKPass(
    {
      "pass.json": Buffer.from(JSON.stringify(passJson)),
      "icon.png": icon,
      "icon@2x.png": icon2x,
      "logo.png": logo,
    },
    certificates,
  );

  return pass.getAsBuffer();
}
