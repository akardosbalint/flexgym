"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// A 480px-nél nem nagyobb, JPEG minőség 0.8-cal tömörített felvétel jóval
// e limit alatt marad - ez csak a felső korlát tényleges kliens-oldali
// manipuláció ellen.
const MAX_DATA_URL_LENGTH = 2_000_000;

export async function saveProfilePhoto(dataUrl: string): Promise<{ error: string } | void> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Nincs bejelentkezve." };
  }

  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/jpeg;base64,")) {
    return { error: "Érvénytelen kép formátum." };
  }
  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    return { error: "A kép túl nagy méretű." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { profilePhotoUrl: dataUrl },
  });
}
