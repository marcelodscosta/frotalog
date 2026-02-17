-- CreateEnum
CREATE TYPE "public"."MeasurementBulletinStatus" AS ENUM ('DRAFT', 'APPROVED', 'INVOICED');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."maintenances" ADD COLUMN     "equipment_inactive" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."measurement_bulletins" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "assetMovementId" TEXT NOT NULL,
    "reference_start" TIMESTAMP(3) NOT NULL,
    "reference_end" TIMESTAMP(3) NOT NULL,
    "total_days" INTEGER NOT NULL,
    "inactive_days" INTEGER NOT NULL,
    "working_days" INTEGER NOT NULL,
    "daily_rate" DECIMAL(10,2) NOT NULL,
    "total_value" DECIMAL(10,2) NOT NULL,
    "status" "public"."MeasurementBulletinStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measurement_bulletins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoices" (
    "id" TEXT NOT NULL,
    "measurementBulletinId" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "total_value" DECIMAL(10,2) NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "payment_date" TIMESTAMP(3),
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_measurementBulletinId_key" ON "public"."invoices"("measurementBulletinId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "public"."invoices"("invoice_number");

-- AddForeignKey
ALTER TABLE "public"."measurement_bulletins" ADD CONSTRAINT "measurement_bulletins_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."measurement_bulletins" ADD CONSTRAINT "measurement_bulletins_assetMovementId_fkey" FOREIGN KEY ("assetMovementId") REFERENCES "public"."asset_movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_measurementBulletinId_fkey" FOREIGN KEY ("measurementBulletinId") REFERENCES "public"."measurement_bulletins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
