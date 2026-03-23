-- CreateEnum
CREATE TYPE "public"."ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CONVERTED');

-- CreateTable
CREATE TABLE "public"."commercial_proposals" (
    "id" TEXT NOT NULL,
    "proposal_number" TEXT NOT NULL,
    "companySettingsId" TEXT,
    "clientId" TEXT NOT NULL,
    "contact_name" TEXT,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "mobilization_value" DECIMAL(10,2),
    "demobilization_value" DECIMAL(10,2),
    "payment_conditions" TEXT,
    "rental_period" TEXT,
    "technical_notes" TEXT,
    "validity_days" INTEGER NOT NULL DEFAULT 5,
    "body_html" TEXT,
    "status" "public"."ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "contractId" TEXT,

    CONSTRAINT "commercial_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."proposal_items" (
    "id" TEXT NOT NULL,
    "commercialProposalId" TEXT NOT NULL,
    "assetId" TEXT,
    "assetCategoryId" TEXT,
    "description" TEXT,
    "unit" TEXT DEFAULT 'UN',
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "monthly_value" DECIMAL(10,2) NOT NULL,
    "franchise_hours" DOUBLE PRECISION,
    "extra_hour_value" DECIMAL(10,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposal_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commercial_proposals_proposal_number_key" ON "public"."commercial_proposals"("proposal_number");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_proposals_contractId_key" ON "public"."commercial_proposals"("contractId");

-- AddForeignKey
ALTER TABLE "public"."commercial_proposals" ADD CONSTRAINT "commercial_proposals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commercial_proposals" ADD CONSTRAINT "commercial_proposals_companySettingsId_fkey" FOREIGN KEY ("companySettingsId") REFERENCES "public"."company_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commercial_proposals" ADD CONSTRAINT "commercial_proposals_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal_items" ADD CONSTRAINT "proposal_items_commercialProposalId_fkey" FOREIGN KEY ("commercialProposalId") REFERENCES "public"."commercial_proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal_items" ADD CONSTRAINT "proposal_items_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal_items" ADD CONSTRAINT "proposal_items_assetCategoryId_fkey" FOREIGN KEY ("assetCategoryId") REFERENCES "public"."asset_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
