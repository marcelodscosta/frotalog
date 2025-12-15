-- CreateEnum
CREATE TYPE "public"."AssetOwnership" AS ENUM ('OWN', 'THIRD');

-- AlterTable
ALTER TABLE "public"."assets" ADD COLUMN     "documentsUrl" TEXT,
ADD COLUMN     "ownership" "public"."AssetOwnership" NOT NULL DEFAULT 'OWN';
