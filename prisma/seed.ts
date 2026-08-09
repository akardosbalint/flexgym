import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DAY = 24 * 60 * 60 * 1000;

function generateCheckInCode() {
  return randomBytes(6).toString("hex");
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * DAY);
}

function daysFromNow(n: number) {
  return new Date(Date.now() + n * DAY);
}

// Deterministic pseudo-random check-in times so the demo data looks the
// same on every seed run instead of shuffling around.
const CHECKIN_OFFSETS = [
  { day: 1, hour: 18, min: 10, duration: 74 },
  { day: 2, hour: 7, min: 5, duration: 52 },
  { day: 4, hour: 19, min: 42, duration: 88 },
  { day: 6, hour: 17, min: 20, duration: 63 },
  { day: 7, hour: 8, min: 0, duration: 45 },
  { day: 9, hour: 18, min: 55, duration: 71 },
  { day: 11, hour: 6, min: 40, duration: 58 },
  { day: 13, hour: 19, min: 15, duration: 82 },
  { day: 14, hour: 17, min: 30, duration: 66 },
  { day: 16, hour: 18, min: 5, duration: 77 },
  { day: 18, hour: 7, min: 50, duration: 49 },
  { day: 20, hour: 19, min: 0, duration: 90 },
  { day: 21, hour: 17, min: 45, duration: 60 },
  { day: 23, hour: 18, min: 25, duration: 73 },
  { day: 25, hour: 6, min: 55, duration: 55 },
  { day: 27, hour: 19, min: 10, duration: 85 },
  { day: 29, hour: 18, min: 0, duration: 68 },
  { day: 31, hour: 17, min: 15, duration: 62 },
  { day: 33, hour: 8, min: 10, duration: 47 },
  { day: 35, hour: 18, min: 40, duration: 79 },
  { day: 38, hour: 19, min: 20, duration: 91 },
  { day: 40, hour: 17, min: 5, duration: 57 },
  { day: 42, hour: 7, min: 30, duration: 50 },
  { day: 45, hour: 18, min: 50, duration: 80 },
];

async function main() {
  await prisma.checkIn.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("forgegym123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Kovács Bence",
      email: "demo@forgegym.hu",
      phone: "+36 30 123 4567",
      passwordHash,
      checkInCode: generateCheckInCode(),
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: "Nagy Réka",
      email: "staff@forgegym.hu",
      phone: "+36 30 987 6543",
      passwordHash,
      role: "STAFF",
      checkInCode: generateCheckInCode(),
    },
  });

  // Active membership: unlimited monthly pass, started 12 days ago.
  await prisma.membership.create({
    data: {
      userId: user.id,
      name: "1 havi bérlet",
      totalEntries: null,
      usedEntries: 9,
      startDate: daysAgo(12),
      endDate: daysFromNow(18),
      status: "ACTIVE",
      priceHuf: 31500,
      purchasedAt: daysAgo(12),
    },
  });

  // Expired history so the dashboard has something to look back on.
  await prisma.membership.create({
    data: {
      userId: user.id,
      name: "10 alkalmas bérlet",
      totalEntries: 10,
      usedEntries: 10,
      startDate: daysAgo(61),
      endDate: daysAgo(12),
      status: "EXPIRED",
      priceHuf: 29500,
      purchasedAt: daysAgo(61),
    },
  });

  await prisma.membership.create({
    data: {
      userId: user.id,
      name: "1 havi bérlet",
      totalEntries: null,
      usedEntries: 21,
      startDate: daysAgo(91),
      endDate: daysAgo(61),
      status: "EXPIRED",
      priceHuf: 31500,
      purchasedAt: daysAgo(91),
    },
  });

  await prisma.purchase.createMany({
    data: [
      {
        userId: user.id,
        item: "1 havi bérlet",
        amountHuf: 31500,
        invoiceNo: "FG-2026-3311",
        method: "Bankkártya",
        createdAt: daysAgo(12),
      },
      {
        userId: user.id,
        item: "10 alkalmas bérlet",
        amountHuf: 29500,
        invoiceNo: "FG-2026-2984",
        method: "Bankkártya",
        createdAt: daysAgo(61),
      },
      {
        userId: user.id,
        item: "1 havi bérlet",
        amountHuf: 31500,
        invoiceNo: "FG-2025-9931",
        method: "Utalás",
        createdAt: daysAgo(91),
      },
      {
        userId: user.id,
        item: "Személyi edzés (5 alkalom)",
        amountHuf: 45000,
        invoiceNo: "FG-2025-9902",
        method: "Bankkártya",
        createdAt: daysAgo(88),
      },
    ],
  });

  await prisma.checkIn.createMany({
    data: CHECKIN_OFFSETS.map((c) => {
      const d = daysAgo(c.day);
      d.setHours(c.hour, c.min, 0, 0);
      return {
        userId: user.id,
        scannedById: staff.id,
        checkedInAt: d,
        durationMin: c.duration,
        gate: "Forge Gym Budapest - Fő bejárat",
      };
    }),
  });

  console.log("Seed kész.");
  console.log("Demo tag belépés: demo@forgegym.hu / forgegym123");
  console.log("Demo staff belépés (admin): staff@forgegym.hu / forgegym123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
