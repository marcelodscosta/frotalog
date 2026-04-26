-- AlterTable
ALTER TABLE "public"."bank_accounts" ADD COLUMN     "initial_balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "initial_balance_date" TIMESTAMP(3);
