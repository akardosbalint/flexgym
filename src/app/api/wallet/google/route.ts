import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildGoogleWalletSaveUrl } from "@/lib/google-wallet";
import { getBaseUrl } from "@/lib/base-url";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/bejelentkezes", request.url));
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, checkInCode: true },
  });
  if (!user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  try {
    const baseUrl = await getBaseUrl();
    const saveUrl = buildGoogleWalletSaveUrl({
      userId: session.user.id,
      memberName: user.name,
      checkInCode: user.checkInCode,
      baseUrl,
    });
    return NextResponse.redirect(saveUrl);
  } catch (err) {
    console.error("[wallet/google] Failed to build save url:", err);
    return NextResponse.redirect(
      new URL("/dashboard?walletError=google", request.url),
    );
  }
}
