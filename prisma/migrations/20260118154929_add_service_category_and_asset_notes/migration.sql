-- AlterTable
ALTER TABLE "public"."assets" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "public"."maintenances" ADD COLUMN     "serviceCategoryId" TEXT;

-- CreateTable
CREATE TABLE "public"."service_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_name_key" ON "public"."service_categories"("name");

-- AddForeignKey
ALTER TABLE "public"."maintenances" ADD CONSTRAINT "maintenances_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "public"."service_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
