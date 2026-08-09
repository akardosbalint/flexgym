-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEMBER', 'STAFF');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "checkInCode" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "scannedById" TEXT,
ALTER COLUMN "gate" SET DEFAULT 'Forge Gym Budapest - Fő bejárat';

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "status" "PurchaseStatus" NOT NULL DEFAULT 'PAID',
ADD COLUMN     "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_checkInCode_key" ON "User"("checkInCode");

-- CreateIndex
CREATE INDEX "CheckIn_scannedById_idx" ON "CheckIn"("scannedById");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_stripeSessionId_key" ON "Purchase"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_scannedById_fkey" FOREIGN KEY ("scannedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

