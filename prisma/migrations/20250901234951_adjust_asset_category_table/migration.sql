/*
  Warnings:

  - You are about to drop the `asset_categorys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."asset_categorys";

-- CreateTable
CREATE TABLE "public"."asset_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."AssetType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_Active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "asset_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "asset_categories_name_key" ON "public"."asset_categories"("name");
