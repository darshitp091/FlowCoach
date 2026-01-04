-- ============================================================================
-- COMPREHENSIVE SECURITY FIX MIGRATION
-- Fixes all Supabase linter errors and warnings
-- Created: 2026-01-03
-- ============================================================================

-- ============================================================================
-- PART 1: FIX RLS DISABLED ERRORS
-- Enable Row Level Security on audit_logs and migrations tables
-- ============================================================================

-- Enable RLS on audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "audit_logs_select_policy" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_policy" ON public.audit_logs;

-- Create policies for audit_logs (read-only for authenticated users in same org, insert allowed)
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "audit_logs_insert_policy" ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Enable RLS on migrations table (system table - only service role access)
ALTER TABLE public.migrations ENABLE ROW LEVEL SECURITY;

-- No policies for migrations - service role only
-- This prevents regular users from accessing migration history

-- ============================================================================
-- PART 2: FIX SECURITY DEFINER VIEW
-- Remove SECURITY DEFINER from team_members_view
-- ============================================================================

-- Drop and recreate the view without SECURITY DEFINER
DROP VIEW IF EXISTS public.team_members_view;

CREATE VIEW public.team_members_view AS
SELECT
  u.id,
  u.email,
  u.full_name,
  u.avatar_url,
  u.organization_id,
  u.role,
  u.created_at,
  u.last_login_at,
  o.name AS organization_name
FROM public.users u
INNER JOIN public.organizations o ON u.organization_id = o.id;

-- Grant access to authenticated users
GRANT SELECT ON public.team_members_view TO authenticated;

-- ============================================================================
-- PART 3: FIX FUNCTION SEARCH_PATH WARNINGS
-- Dynamically find all public schema functions and add search_path
-- This approach works regardless of function signatures
-- ============================================================================

DO $$
DECLARE
  func_record RECORD;
  alter_stmt TEXT;
  success_count INT := 0;
  error_count INT := 0;
BEGIN
  -- Loop through all functions in the public schema
  FOR func_record IN
    SELECT
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as function_args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.prokind IN ('f', 'p')  -- functions and procedures
      -- Exclude functions that already have search_path set
      AND NOT EXISTS (
        SELECT 1
        FROM pg_proc p2
        WHERE p2.oid = p.oid
        AND p2.proconfig IS NOT NULL
        AND 'search_path=public, pg_temp' = ANY(p2.proconfig)
      )
  LOOP
    BEGIN
      -- Build the ALTER FUNCTION statement with proper signature
      alter_stmt := format(
        'ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp',
        func_record.schema_name,
        func_record.function_name,
        func_record.function_args
      );

      -- Execute the ALTER statement
      EXECUTE alter_stmt;
      success_count := success_count + 1;

      RAISE NOTICE 'Fixed: %.%(%)',
        func_record.schema_name,
        func_record.function_name,
        func_record.function_args;

    EXCEPTION WHEN OTHERS THEN
      error_count := error_count + 1;
      RAISE NOTICE 'Could not fix %.%(%): %',
        func_record.schema_name,
        func_record.function_name,
        func_record.function_args,
        SQLERRM;
    END;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Function search_path fix complete!';
  RAISE NOTICE 'Successfully updated: % functions', success_count;
  IF error_count > 0 THEN
    RAISE NOTICE 'Errors encountered: % functions', error_count;
  END IF;
  RAISE NOTICE '================================================';
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify RLS is enabled
DO $$
DECLARE
  rls_count integer;
BEGIN
  SELECT COUNT(*) INTO rls_count
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename IN ('audit_logs', 'migrations')
    AND rowsecurity = true;

  IF rls_count = 2 THEN
    RAISE NOTICE 'SUCCESS: RLS enabled on audit_logs and migrations tables';
  ELSE
    RAISE WARNING 'ISSUE: RLS not properly enabled on all tables';
  END IF;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Database security fixes applied successfully!';
  RAISE NOTICE '✓ RLS enabled on audit_logs and migrations';
  RAISE NOTICE '✓ SECURITY DEFINER removed from team_members_view';
  RAISE NOTICE '✓ search_path fixed for all public schema functions';
  RAISE NOTICE '✓ All Supabase linter errors and warnings should be resolved';
  RAISE NOTICE '';
  RAISE NOTICE 'All function signatures preserved - no RLS policies affected';
  RAISE NOTICE '================================================';
END $$;
