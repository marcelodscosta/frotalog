-- CreateEnum
CREATE TYPE "public"."ChecklistType" AS ENUM ('MOBILIZATION', 'PERIODIC', 'DEMOBILIZATION');

-- CreateEnum
CREATE TYPE "public"."ChecklistStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."maintenances" DROP CONSTRAINT IF EXISTS "maintenances_supplierId_fkey";

-- AlterTable
ALTER TABLE "public"."assets" ADD COLUMN     "current_horometer" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "current_odometer" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "initial_horometer" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "initial_odometer" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "last_maintenance_date" TIMESTAMP(3),
ADD COLUMN     "last_maintenance_horometer" DOUBLE PRECISION,
ADD COLUMN     "last_maintenance_odometer" DOUBLE PRECISION,
ADD COLUMN     "maintenance_frequency_hours" DOUBLE PRECISION,
ADD COLUMN     "maintenance_frequency_km" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."maintenances" ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "horometer" DOUBLE PRECISION,
ADD COLUMN     "odometer" DOUBLE PRECISION,
ALTER COLUMN "supplierId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."asset_readings" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "horometer" DOUBLE PRECISION,
    "odometer" DOUBLE PRECISION,
    "notes" TEXT,
    "userId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checklist_parameters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checklist_item_templates" (
    "id" TEXT NOT NULL,
    "checklistParameterId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "requiresPhoto" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_item_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checklists" (
    "id" TEXT NOT NULL,
    "checklistParameterId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "type" "public"."ChecklistType" NOT NULL,
    "status" "public"."ChecklistStatus" NOT NULL DEFAULT 'PENDING',
    "magicLinkId" TEXT NOT NULL,
    "rejectionNotes" TEXT,
    "completedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "supplierId" TEXT,
    "horometer" DOUBLE PRECISION,
    "odometer" DOUBLE PRECISION,
    "meterPhotoUrl" TEXT,

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checklist_answers" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "checklistItemTemplateId" TEXT NOT NULL,
    "conforms" BOOLEAN,
    "notes" TEXT,
    "photoUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checklists_magicLinkId_key" ON "public"."checklists"("magicLinkId");

-- AddForeignKey
ALTER TABLE "public"."asset_readings" ADD CONSTRAINT "asset_readings_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenances" ADD CONSTRAINT "maintenances_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenances" ADD CONSTRAINT "maintenances_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_item_templates" ADD CONSTRAINT "checklist_item_templates_checklistParameterId_fkey" FOREIGN KEY ("checklistParameterId") REFERENCES "public"."checklist_parameters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklists" ADD CONSTRAINT "checklists_checklistParameterId_fkey" FOREIGN KEY ("checklistParameterId") REFERENCES "public"."checklist_parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklists" ADD CONSTRAINT "checklists_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklists" ADD CONSTRAINT "checklists_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_answers" ADD CONSTRAINT "checklist_answers_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "public"."checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_answers" ADD CONSTRAINT "checklist_answers_checklistItemTemplateId_fkey" FOREIGN KEY ("checklistItemTemplateId") REFERENCES "public"."checklist_item_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
