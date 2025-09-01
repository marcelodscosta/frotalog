-- CreateEnum
CREATE TYPE "public"."AssetType" AS ENUM ('VEHICLE', 'EQUIPMENT');

-- CreateTable
CREATE TABLE "public"."asset_categorys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."AssetType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_Active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "asset_categorys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "asset_categorys_name_key" ON "public"."asset_categorys"("name");
