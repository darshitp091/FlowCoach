-- ============================================================================
-- FIX REMAINING SECURITY ISSUES
-- Fixes the remaining error and suggestion from Supabase linter
-- Created: 2026-01-04
-- ============================================================================

-- ============================================================================
-- PART 1: FIX SECURITY DEFINER VIEW ERROR
-- The team_members_view has SECURITY DEFINER property that needs to be removed
-- ============================================================================

-- First, check what the current view definition is
DO $$
BEGIN
  RAISE NOTICE 'Recreating team_members_view without SECURITY DEFINER...';
END $$;

-- Drop the existing view completely
DROP VIEW IF EXISTS public.team_members_view CASCADE;

-- Recreate the view with SECURITY INVOKER (opposite of SECURITY DEFINER)
-- This ensures the view uses the permissions of the querying user, not the creator
CREATE VIEW public.team_members_view
WITH (security_invoker=true)
AS
SELECT
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.is_supervisor,
  u.is_biller,
  u.organization_id,
  u.role_assigned_at,
  u.created_at,
  COUNT(DISTINCT cca.client_id) as assigned_clients_count
FROM public.users u
LEFT JOIN public.coach_client_assignments cca ON u.id = cca.coach_id
GROUP BY u.id, u.email, u.full_name, u.role, u.is_supervisor, u.is_biller,
         u.organization_id, u.role_assigned_at, u.created_at;

-- Grant proper permissions
GRANT SELECT ON public.team_members_view TO authenticated;

-- Add a comment to document the view
COMMENT ON VIEW public.team_members_view IS 'Team members with role information and client counts - uses SECURITY INVOKER for proper RLS enforcement';

-- ============================================================================
-- PART 2: ADD RLS POLICY FOR MIGRATIONS TABLE
-- The migrations table has RLS enabled but no policies (INFO suggestion)
-- ============================================================================

-- The migrations table is a system table and should only be accessible by service_role
-- We'll create a policy that effectively blocks all regular user access
-- Only the service_role (used by Supabase backend) can access it

-- Policy: Block all access for regular users (service_role bypasses RLS)
CREATE POLICY "migrations_service_role_only" ON public.migrations
  FOR ALL
  TO authenticated
  USING (false)  -- Always returns false, blocking all access
  WITH CHECK (false);  -- Also blocks inserts/updates

-- Add comment to explain the policy
COMMENT ON POLICY "migrations_service_role_only" ON public.migrations IS 'Blocks all user access - only service_role can access migrations table';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
  view_security_type TEXT;
  policy_count INT;
BEGIN
  -- Check if view has security_invoker set
  SELECT reloptions::text INTO view_security_type
  FROM pg_class
  WHERE relname = 'team_members_view'
    AND relnamespace = 'public'::regnamespace;

  IF view_security_type LIKE '%security_invoker=true%' THEN
    RAISE NOTICE '✓ team_members_view now uses SECURITY INVOKER (correct)';
  ELSE
    RAISE WARNING '⚠ team_members_view may still have SECURITY DEFINER';
  END IF;

  -- Check if migrations table has policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'migrations';

  IF policy_count > 0 THEN
    RAISE NOTICE '✓ migrations table now has % RLS policy/policies', policy_count;
  ELSE
    RAISE WARNING '⚠ migrations table still has no policies';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Remaining security fixes applied successfully!';
  RAISE NOTICE '================================================';
END $$;

-- ============================================================================
-- NOTES
-- ============================================================================

-- Note about the leaked password protection warning:
-- This is NOT a database issue - it's a Supabase Auth configuration setting.
-- To fix this warning:
-- 1. Go to Supabase Dashboard → Authentication → Settings
-- 2. Scroll to "Password Settings"
-- 3. Enable "Check passwords against HaveIBeenPwned.org database"
-- 4. Click Save
--
-- This cannot be fixed via SQL migration.
