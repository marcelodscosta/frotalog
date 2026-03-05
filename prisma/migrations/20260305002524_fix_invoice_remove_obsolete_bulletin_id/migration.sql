-- ============================================================
-- Fix: Remove obsolete measurementBulletinId column from invoices
-- 
-- Background: The Invoice <-> MeasurementBulletin relationship
-- was inverted. Previously invoices.measurementBulletinId held
-- the FK (1 invoice -> 1 bulletin). Now, measurement_bulletins.invoiceId
-- holds the FK (1 invoice -> N bulletins). The old column was never
-- dropped, causing a NOT NULL constraint violation in production.
-- All statements use IF EXISTS / IF NOT EXISTS for idempotency.
-- ============================================================

-- Step 1: Drop the foreign key constraint
ALTER TABLE "public"."invoices" DROP CONSTRAINT IF EXISTS "invoices_measurementBulletinId_fkey";

-- Step 2: Drop the unique index
DROP INDEX IF EXISTS "public"."invoices_measurementBulletinId_key";

-- Step 3: Drop the obsolete column
ALTER TABLE "public"."invoices" DROP COLUMN IF EXISTS "measurementBulletinId";

-- Step 4: Add missing columns to measurement_bulletins (may not exist in production)
ALTER TABLE "public"."measurement_bulletins"
  ADD COLUMN IF NOT EXISTS "current_horometer" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "current_odometer" DOUBLE PRECISION;

-- Step 5: Add quantity column to bulletin_expenses (may not exist in production)
ALTER TABLE "public"."bulletin_expenses"
  ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1;
