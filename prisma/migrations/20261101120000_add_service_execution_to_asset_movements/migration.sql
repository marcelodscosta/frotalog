-- AlterTable
ALTER TABLE "public"."asset_movements"
  ADD COLUMN "service_executed" BOOLEAN,
  ADD COLUMN "final_value" DECIMAL(10,2);
