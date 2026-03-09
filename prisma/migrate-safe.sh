#!/bin/bash
# This script baselines all existing migrations (safe to run on every deploy)
# then applies any new pending migrations.

echo "==> Baselining existing migrations (safe to run multiple times)..."

npx prisma migrate resolve --applied 20250901230727_create_users_table 2>/dev/null || true
npx prisma migrate resolve --applied 20250901234454_table_asset_categorys 2>/dev/null || true
npx prisma migrate resolve --applied 20250901234951_adjust_asset_category_table 2>/dev/null || true
npx prisma migrate resolve --applied 20250902005244_asset_table 2>/dev/null || true
npx prisma migrate resolve --applied 20250902234241_create_relationships 2>/dev/null || true
npx prisma migrate resolve --applied 20250903001045_create_table_supplier 2>/dev/null || true
npx prisma migrate resolve --applied 20250903003722_create_tables_maintenance_and_maintenance_document_and_relations 2>/dev/null || true
npx prisma migrate resolve --applied 20250904225139_remove_field_from_asset 2>/dev/null || true
npx prisma migrate resolve --applied 20251019212709_schema_adjustments 2>/dev/null || true
npx prisma migrate resolve --applied 20251214231901_add_asset_ownership_and_documents_url 2>/dev/null || true
npx prisma migrate resolve --applied 20260118154929_add_service_category_and_asset_notes 2>/dev/null || true
npx prisma migrate resolve --applied 20260131231326_add_is_client_flag_to_supplier 2>/dev/null || true
npx prisma migrate resolve --applied 20260214193907_add_contracts_and_movements 2>/dev/null || true
npx prisma migrate resolve --applied 20260216225846_add_measurement_bulletin_and_invoice 2>/dev/null || true
npx prisma migrate resolve --applied 20260216235219_add_company_settings 2>/dev/null || true
npx prisma migrate resolve --applied 20260217001327_add_bulletin_expenses 2>/dev/null || true

# Recover if this migration was left in failed state (P3009 in production)
npx prisma migrate resolve --rolled-back 20260308213440_create_checklist_tables 2>/dev/null || true

echo "==> Running pending migrations..."
npx prisma migrate deploy
