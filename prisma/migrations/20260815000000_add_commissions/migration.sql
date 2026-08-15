-- CreateEnum
CREATE TYPE "public"."CommissionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PAID');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Role" ADD VALUE 'FINANCEIRO';
ALTER TYPE "public"."Role" ADD VALUE 'OPERACIONAL';

-- AlterTable
ALTER TABLE "public"."contracts" ADD COLUMN     "commission_end_date" TIMESTAMP(3),
ADD COLUMN     "commission_percentage" DECIMAL(5,2),
ADD COLUMN     "commission_start_date" TIMESTAMP(3),
ADD COLUMN     "sellerId" TEXT;

-- AlterTable
ALTER TABLE "public"."commercial_proposals" ADD COLUMN     "discount_percentage" DECIMAL(5,2),
ADD COLUMN     "discount_value" DECIMAL(10,2),
ADD COLUMN     "follow_up_date" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "public"."invoice_documents" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "document_type" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_documents_pkey" PRIMARY KEY ("id")
);

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
ALTER TABLE "public"."invoice_documents" ADD CONSTRAINT "invoice_documents_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commercial_proposals" ADD CONSTRAINT "commercial_proposals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commissions" ADD CONSTRAINT "commissions_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commissions" ADD CONSTRAINT "commissions_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commissions" ADD CONSTRAINT "commissions_measurementBulletinId_fkey" FOREIGN KEY ("measurementBulletinId") REFERENCES "public"."measurement_bulletins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

