-- AlterTable
ALTER TABLE "public"."company_settings" ADD COLUMN     "contract_start_number" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "proposal_start_number" INTEGER NOT NULL DEFAULT 1;
