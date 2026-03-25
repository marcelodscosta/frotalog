-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."BillingCycle" ADD VALUE 'HOURLY';
ALTER TYPE "public"."BillingCycle" ADD VALUE 'PER_UNIT';

-- AlterEnum
ALTER TYPE "public"."ProposalStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "public"."measurement_bulletins" ADD COLUMN     "measured_quantity" DECIMAL(10,2),
ADD COLUMN     "measurement_unit" TEXT DEFAULT 'DAYS';
