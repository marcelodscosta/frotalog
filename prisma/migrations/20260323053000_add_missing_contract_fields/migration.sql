-- AlterTable
ALTER TABLE "public"."contracts" ADD COLUMN IF NOT EXISTS "body_html" TEXT;
ALTER TABLE "public"."contracts" ADD COLUMN IF NOT EXISTS "signed_contract_url" TEXT;
