/*
  Warnings:

  - Added the required column `assetCategoryId` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."assets" ADD COLUMN     "assetCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_assetCategoryId_fkey" FOREIGN KEY ("assetCategoryId") REFERENCES "public"."asset_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
