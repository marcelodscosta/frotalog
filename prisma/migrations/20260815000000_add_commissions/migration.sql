-- CreateEnum
CREATE TYPE "public"."CommissionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PAID');

-- AlterTable
ALTER TABLE "public"."contracts" ADD COLUMN     "commission_end_date" TIMESTAMP(3),
ADD COLUMN     "commission_percentage" DECIMAL(5,2),
ADD COLUMN     "commission_start_date" TIMESTAMP(3),
ADD COLUMN     "sellerId" TEXT;

-- CreateTable
CREATE TABLE "public"."commissions" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "measurementBulletinId" TEXT,
    "reference_month" TIMESTAMP(3) NOT NULL,
    "base_value" DECIMAL(10,2) NOT NULL,
    "commission_percentage" DECIMAL(5,2) NOT NULL,
    "commission_value" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "status" "public"."CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commissions_measurementBulletinId_key" ON "public"."commissions"("measurementBulletinId");

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commissions" ADD CONSTRAINT "commissions_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commissions" ADD CONSTRAINT "commissions_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commissions" ADD CONSTRAINT "commissions_measurementBulletinId_fkey" FOREIGN KEY ("measurementBulletinId") REFERENCES "public"."measurement_bulletins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

