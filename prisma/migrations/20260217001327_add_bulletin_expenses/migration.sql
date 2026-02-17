-- CreateTable
CREATE TABLE "public"."bulletin_expenses" (
    "id" TEXT NOT NULL,
    "measurementBulletinId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit_value" DECIMAL(10,2) NOT NULL,
    "total_value" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bulletin_expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."bulletin_expenses" ADD CONSTRAINT "bulletin_expenses_measurementBulletinId_fkey" FOREIGN KEY ("measurementBulletinId") REFERENCES "public"."measurement_bulletins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
