-- CreateTable
CREATE TABLE "public"."company_settings" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "trading_name" TEXT,
    "cnpj" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logo_url" TEXT,
    "invoice_start_number" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);
