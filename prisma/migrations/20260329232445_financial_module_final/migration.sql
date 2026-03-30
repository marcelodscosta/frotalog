-- CreateEnum
CREATE TYPE "public"."PayableExpenseStatus" AS ENUM ('PENDING_MAINTENANCE_APPROVAL', 'PENDING_FINANCE_APPROVAL', 'PENDING_DIRECTOR_APPROVAL', 'APPROVED', 'PARTIALLY_PAID', 'PAID', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."InstallmentStatus" AS ENUM ('PENDING', 'SCHEDULED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('BOLETO', 'PIX', 'TRANSFERENCIA', 'CHEQUE', 'DINHEIRO', 'CARTAO');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "public"."ChartOfAccountType" AS ENUM ('REVENUE', 'EXPENSE');

-- DropIndex
DROP INDEX "public"."invoices_invoice_number_key";

-- AlterTable
ALTER TABLE "public"."invoices" ADD COLUMN     "chartOfAccountId" TEXT,
ADD COLUMN     "contractId" TEXT,
ALTER COLUMN "invoice_number" DROP NOT NULL,
ALTER COLUMN "issue_date" DROP NOT NULL,
ALTER COLUMN "total_value" SET DATA TYPE DECIMAL(15,2);

-- CreateTable
CREATE TABLE "public"."bank_accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bank_name" TEXT,
    "agency" TEXT,
    "account_number" TEXT,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payable_expenses" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT,
    "contractId" TEXT,
    "supplierId" TEXT,
    "description" TEXT NOT NULL,
    "total_value" DECIMAL(15,2) NOT NULL,
    "payment_method" "public"."PaymentMethod" NOT NULL DEFAULT 'BOLETO',
    "status" "public"."PayableExpenseStatus" NOT NULL DEFAULT 'PENDING_MAINTENANCE_APPROVAL',
    "maintenance_approved_by" TEXT,
    "maintenance_approved_at" TIMESTAMP(3),
    "finance_approved_by" TEXT,
    "finance_approved_at" TIMESTAMP(3),
    "director_approved_by" TEXT,
    "director_approved_at" TIMESTAMP(3),
    "rejection_notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "chartOfAccountId" TEXT,

    CONSTRAINT "payable_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."expense_installments" (
    "id" TEXT NOT NULL,
    "payableExpenseId" TEXT NOT NULL,
    "installment_number" INTEGER NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "barcode" TEXT,
    "pix_key" TEXT,
    "status" "public"."InstallmentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "scheduledBankAccountId" TEXT,

    CONSTRAINT "expense_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."expense_documents" (
    "id" TEXT NOT NULL,
    "payableExpenseId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "document_type" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expense_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."financial_transactions" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "expenseInstallmentId" TEXT,
    "invoiceId" TEXT,
    "receipt_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chart_of_accounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ChartOfAccountType" NOT NULL,
    "parent_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chart_of_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chart_of_accounts_code_key" ON "public"."chart_of_accounts"("code");

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_chartOfAccountId_fkey" FOREIGN KEY ("chartOfAccountId") REFERENCES "public"."chart_of_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payable_expenses" ADD CONSTRAINT "payable_expenses_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "public"."maintenances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payable_expenses" ADD CONSTRAINT "payable_expenses_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payable_expenses" ADD CONSTRAINT "payable_expenses_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payable_expenses" ADD CONSTRAINT "payable_expenses_chartOfAccountId_fkey" FOREIGN KEY ("chartOfAccountId") REFERENCES "public"."chart_of_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expense_installments" ADD CONSTRAINT "expense_installments_payableExpenseId_fkey" FOREIGN KEY ("payableExpenseId") REFERENCES "public"."payable_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expense_installments" ADD CONSTRAINT "expense_installments_scheduledBankAccountId_fkey" FOREIGN KEY ("scheduledBankAccountId") REFERENCES "public"."bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expense_documents" ADD CONSTRAINT "expense_documents_payableExpenseId_fkey" FOREIGN KEY ("payableExpenseId") REFERENCES "public"."payable_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."financial_transactions" ADD CONSTRAINT "financial_transactions_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "public"."bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."financial_transactions" ADD CONSTRAINT "financial_transactions_expenseInstallmentId_fkey" FOREIGN KEY ("expenseInstallmentId") REFERENCES "public"."expense_installments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."financial_transactions" ADD CONSTRAINT "financial_transactions_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

