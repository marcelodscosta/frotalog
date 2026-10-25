-- AlterTable
ALTER TABLE "public"."commercial_proposals" ADD COLUMN "commission_percentage" DECIMAL(5,2);

-- AlterEnum
ALTER TYPE "public"."CommissionStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
