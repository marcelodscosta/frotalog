-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE IF NOT EXISTS 'FINANCEIRO';
ALTER TYPE "public"."Role" ADD VALUE IF NOT EXISTS 'OPERACIONAL';

-- AlterTable
ALTER TABLE "public"."suppliers" ALTER COLUMN "cnpj" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."invoice_documents" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "document_type" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."invoice_documents" ADD CONSTRAINT "invoice_documents_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
