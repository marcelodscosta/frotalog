DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'ChecklistStatus'
          AND n.nspname = 'public'
          AND e.enumlabel = 'IN_PROGRESS'
    ) THEN
        ALTER TYPE "public"."ChecklistStatus" ADD VALUE 'IN_PROGRESS';
    END IF;
END $$;
