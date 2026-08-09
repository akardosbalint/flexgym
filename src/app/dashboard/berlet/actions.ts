"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PRICING } from "@/lib/site-data";

const DAY = 86_400_000;

const PLAN_DURATIONS: Record<string, { days: number; totalEntries: number | null }> = {
  "1 alkalom": { days: 1, totalEntries: 1 },
  "2 alkalom": { days: 14, totalEntries: 2 },
  "10 alkalom": { days: 49, totalEntries: 10 },
  "20 alkalom": { days: 70, totalEntries: 20 },
  "1 havi bérlet": { days: 30, totalEntries: null },
  "1 éves bérlet": { days: 365, totalEntries: null },
};

export async function purchaseMembership(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/bejelentkezes");
  }

  const planName = String(formData.get("plan") ?? "");
  const plan = PRICING.find((p) => p.name === planName);
  const duration = PLAN_DURATIONS[planName];
  if (!plan || !duration) {
    throw new Error("Ismeretlen bérlet típus.");
  }

  const userId = session.user.id;

  await prisma.membership.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "EXPIRED" },
  });

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + duration.days * DAY);
  const invoiceNo = `FG-${startDate.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  await prisma.membership.create({
    data: {
      userId,
      name: plan.name,
      totalEntries: duration.totalEntries,
      usedEntries: 0,
      startDate,
      endDate,
      status: "ACTIVE",
      priceHuf: plan.adult,
      purchasedAt: startDate,
    },
  });

  await prisma.purchase.create({
    data: {
      userId,
      item: plan.name,
      amountHuf: plan.adult,
      invoiceNo,
      method: "Bankkártya (demo)",
      createdAt: startDate,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/berlet");
  revalidatePath("/dashboard/tortenet");
  redirect("/dashboard?vasarlas=siker");
}
