-- CreateEnum
CREATE TYPE "public"."ContractType" AS ENUM ('NORMAL', 'SIMPLE');

-- AlterTable
ALTER TABLE "public"."contracts" ADD COLUMN "type" "public"."ContractType" NOT NULL DEFAULT 'NORMAL';
