-- AlterTable
ALTER TABLE "measurement_bulletins" ADD COLUMN     "invoiceId" TEXT;

-- AddForeignKey
ALTER TABLE "measurement_bulletins" ADD CONSTRAINT "measurement_bulletins_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
