/*
  Warnings:

  - You are about to drop the column `adrdress` on the `suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."suppliers" DROP COLUMN "adrdress",
ADD COLUMN     "address" TEXT;
