#!/bin/bash
# Baseline script - marks all existing migrations as applied in production DB
# Run this ONCE in the Render Shell before deploying with prisma migrate deploy

echo "Baselining all migrations..."

npx prisma migrate resolve --applied 20250901230727_create_users_table
npx prisma migrate resolve --applied 20250901234454_table_asset_categorys
npx prisma migrate resolve --applied 20250901234951_adjust_asset_category_table
npx prisma migrate resolve --applied 20250902005244_asset_table
npx prisma migrate resolve --applied 20250902234241_create_relationships
npx prisma migrate resolve --applied 20250903001045_create_table_supplier
npx prisma migrate resolve --applied 20250903003722_create_tables_maintenance_and_maintenance_document_and_relations
npx prisma migrate resolve --applied 20250904225139_remove_field_from_asset
npx prisma migrate resolve --applied 20251019212709_schema_adjustments
npx prisma migrate resolve --applied 20251214231901_add_asset_ownership_and_documents_url
npx prisma migrate resolve --applied 20260118154929_add_service_category_and_asset_notes
npx prisma migrate resolve --applied 20260131231326_add_is_client_flag_to_supplier
npx prisma migrate resolve --applied 20260214193907_add_contracts_and_movements
npx prisma migrate resolve --applied 20260216225846_add_measurement_bulletin_and_invoice
npx prisma migrate resolve --applied 20260216235219_add_company_settings
npx prisma migrate resolve --applied 20260217001327_add_bulletin_expenses

echo "Baseline complete! All 16 migrations marked as applied."
