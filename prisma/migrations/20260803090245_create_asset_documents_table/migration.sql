-- AlterTable
ALTER TABLE "public"."commercial_proposals" ADD COLUMN     "discount_percentage" DECIMAL(5,2),
ADD COLUMN     "discount_value" DECIMAL(10,2),
ADD COLUMN     "follow_up_date" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "public"."asset_documents" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file_path" TEXT,
    "filename" TEXT,
    "mime_type" TEXT,
    "file_size" INTEGER,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3),
    "no_expiration" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."asset_documents" ADD CONSTRAINT "asset_documents_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commercial_proposals" ADD CONSTRAINT "commercial_proposals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
