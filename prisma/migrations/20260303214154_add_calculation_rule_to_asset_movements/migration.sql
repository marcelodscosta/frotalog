-- CreateEnum
CREATE TYPE "MeasurementCalculationRule" AS ENUM ('COMMERCIAL_30_DAYS', 'CALENDAR_DAYS');

-- AlterTable
ALTER TABLE "asset_movements" ADD COLUMN     "calculation_rule" "MeasurementCalculationRule" NOT NULL DEFAULT 'COMMERCIAL_30_DAYS';
