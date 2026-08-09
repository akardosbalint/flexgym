import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildApplePassBuffer } from "@/lib/apple-wallet";

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
    const buffer = await buildApplePassBuffer({
      userId: session.user.id,
      memberName: user.name,
      checkInCode: user.checkInCode,
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": 'attachment; filename="forge-gym.pkpass"',
      },
    });
  } catch (err) {
    console.error("[wallet/apple] Failed to build pass:", err);
    return NextResponse.redirect(new URL("/dashboard?walletError=apple", request.url));
  }
}
