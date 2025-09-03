-- CreateTable
CREATE TABLE "public"."suppliers" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "trading_name" TEXT,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "adrdress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "service_types" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_Active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_cnpj_key" ON "public"."suppliers"("cnpj");
