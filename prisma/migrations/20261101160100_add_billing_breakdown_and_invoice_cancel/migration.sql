-- AlterTable
ALTER TABLE "commercial_proposals" ADD COLUMN "sent_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "asset_movements" ADD COLUMN "franchise_hours" DOUBLE PRECISION,
ADD COLUMN "extra_hour_value" DECIMAL(10, 2);

-- AlterTable
ALTER TABLE "measurement_bulletins" ADD COLUMN "rental_value_total" DECIMAL(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN "expenses_total" DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN "cancel_reason" TEXT,
ADD COLUMN "cancelled_at" TIMESTAMP(3);

-- Backfill: separar locação de despesas nos boletins existentes
UPDATE "measurement_bulletins" mb
SET
  "expenses_total" = e.total,
  "rental_value_total" = GREATEST(mb."total_value" - e.total, 0)
FROM (
  SELECT "measurementBulletinId", SUM("total_value") AS total
  FROM "bulletin_expenses"
  GROUP BY "measurementBulletinId"
) e
WHERE e."measurementBulletinId" = mb."id";

UPDATE "measurement_bulletins" mb
SET "rental_value_total" = mb."total_value"
WHERE mb."rental_value_total" = 0
  AND mb."total_value" > 0
  AND NOT EXISTS (
    SELECT 1 FROM "bulletin_expenses" e WHERE e."measurementBulletinId" = mb."id"
  );

-- Backfill: propostas enviadas passam a ter data de envio
UPDATE "commercial_proposals"
SET "sent_at" = "updated_at"
WHERE "status" = 'SENT' AND "sent_at" IS NULL;
