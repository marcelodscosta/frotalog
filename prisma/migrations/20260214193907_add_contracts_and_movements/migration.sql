-- CreateEnum
CREATE TYPE "public"."ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('DAILY', 'MONTHLY', 'WEEKLY');

-- AlterTable
ALTER TABLE "public"."maintenances" ADD COLUMN     "contractId" TEXT;

-- CreateTable
CREATE TABLE "public"."contracts" (
    "id" TEXT NOT NULL,
    "contract_number" TEXT NOT NULL,
    "description" TEXT,
    "clientId" TEXT NOT NULL,
    "responsible_name" TEXT,
    "responsible_phone" TEXT,
    "responsible_email" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "status" "public"."ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "total_value" DECIMAL(10,2),
    "billing_day" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_Active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_movements" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "mobilization_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "integration_date" TIMESTAMP(3),
    "demobilization_date" TIMESTAMP(3),
    "mobilization_checklist_url" TEXT,
    "demobilization_checklist_url" TEXT,
    "rental_value" DECIMAL(10,2) NOT NULL,
    "billing_cycle" "public"."BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "operator_name" TEXT,
    "current_horometer" DOUBLE PRECISION,
    "current_odometer" DOUBLE PRECISION,
    "delivery_location" TEXT,
    "freight_value" DECIMAL(10,2),
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contract_number_key" ON "public"."contracts"("contract_number");

-- AddForeignKey
ALTER TABLE "public"."maintenances" ADD CONSTRAINT "maintenances_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_movements" ADD CONSTRAINT "asset_movements_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_movements" ADD CONSTRAINT "asset_movements_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
