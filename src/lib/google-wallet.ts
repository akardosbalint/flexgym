import "server-only";
import jwt from "jsonwebtoken";
import { checkInCodeToQrContent, formatCheckInCode } from "@/lib/qr-checkin";

const CLASS_SUFFIX = "forge_gym_member";

function getIssuerId() {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  if (!issuerId) {
    throw new Error(
      "GOOGLE_WALLET_ISSUER_ID nincs beállítva. Lásd a .env.example fájlt a Google Wallet beállításához.",
    );
  }
  return issuerId;
}

function getServiceAccountCredentials() {
  const clientEmail = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_WALLET_PRIVATE_KEY;
  if (!clientEmail || !privateKeyRaw) {
    throw new Error(
      "GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL / GOOGLE_WALLET_PRIVATE_KEY nincs beállítva. Lásd a .env.example fájlt.",
    );
  }
  // .env files can't hold real newlines, so the key is stored with literal \n escapes.
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  return { clientEmail, privateKey };
}

/** Builds the "Add to Google Wallet" save URL for a member's check-in pass. */
export function buildGoogleWalletSaveUrl({
  userId,
  memberName,
  checkInCode,
  baseUrl,
}: {
  userId: string;
  memberName: string;
  checkInCode: string;
  baseUrl: string;
}) {
  const issuerId = getIssuerId();
  const { clientEmail, privateKey } = getServiceAccountCredentials();

  const classId = `${issuerId}.${CLASS_SUFFIX}`;
  const objectId = `${issuerId}.member_${userId}`;

  const genericClass = {
    id: classId,
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: {
                firstValue: { fields: [{ fieldPath: "object.textModulesData['membership']" }] },
              },
              endItem: {
                firstValue: { fields: [{ fieldPath: "object.textModulesData['validity']" }] },
              },
            },
          },
        ],
      },
    },
  };

  const genericObject = {
    id: objectId,
    classId,
    genericType: "GENERIC_TYPE_UNSPECIFIED",
    hexBackgroundColor: "#0b0b0c",
    cardTitle: { defaultValue: { language: "hu", value: "Forge Gym" } },
    header: { defaultValue: { language: "hu", value: memberName } },
    subheader: { defaultValue: { language: "hu", value: "Belépőkód" } },
    textModulesData: [
      { id: "membership", header: "Tagság", body: "Forge Gym Budapest" },
      { id: "validity", header: "Kód", body: formatCheckInCode(checkInCode) },
    ],
    barcode: {
      type: "QR_CODE",
      value: checkInCodeToQrContent(checkInCode),
      alternateText: formatCheckInCode(checkInCode),
    },
  };

  const claims = {
    iss: clientEmail,
    aud: "google",
    typ: "savetowallet",
    iat: Math.floor(Date.now() / 1000),
    origins: [baseUrl],
    payload: {
      genericClasses: [genericClass],
      genericObjects: [genericObject],
    },
  };

  const token = jwt.sign(claims, privateKey, { algorithm: "RS256" });
  return `https://pay.google.com/gp/v/save/${token}`;
}
