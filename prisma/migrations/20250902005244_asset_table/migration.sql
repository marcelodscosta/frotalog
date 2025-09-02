-- CreateTable
CREATE TABLE "public"."assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "plate" TEXT,
    "serial_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_Active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assets_plate_key" ON "public"."assets"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "assets_serial_number_key" ON "public"."assets"("serial_number");
