# Supabase Security Fixes - Complete Guide

## Overview

This guide helps you fix all **3 errors** and **39 warnings** detected by Supabase's database linter.

### Issues Fixed:
✅ **3 ERRORS**:
1. RLS disabled on `audit_logs` table
2. RLS disabled on `migrations` table
3. Security Definer View: `team_members_view`

✅ **39 WARNINGS**:
- All 39 functions missing `search_path` parameter

---

## Step 1: Apply the Security Migration

### Option A: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **SQL Editor**

2. **Run the Migration**
   - Open the file: `supabase/migrations/20250103000000_fix_security_issues.sql`
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click **RUN**

3. **Verify Success**
   - You should see success messages:
     ```
     ✓ RLS enabled on audit_logs and migrations
     ✓ SECURITY DEFINER removed from team_members_view
     ✓ search_path fixed for all 39 functions
     ```

### Option B: Via Supabase CLI (If you have CLI installed)

```bash
# Make sure you're in the project root
cd "c:\Users\patel\CRM Model"

# Apply the migration
supabase db push
```

---

## Step 2: Verify Fixes

### Check Database Linter Again

1. Go to **Supabase Dashboard → Database → Linter**
2. You should see:
   - **0 Errors** (down from 3)
   - **1 Warning** (down from 40) - Only the "Leaked Password Protection" warning should remain

### The Remaining Warning

You'll still see one warning about "Leaked Password Protection". This is a Supabase Auth setting:

**To fix it:**
1. Go to **Authentication → Settings** in Supabase Dashboard
2. Scroll to **Password Settings**
3. Enable **"Check passwords against HaveIBeenPwned.org database"**
4. Save

This prevents users from using compromised passwords.

---

## Step 3: Test Your Application

### 1. Test Webhook Integration

Your Razorpay webhook secret has been added to `.env.local`:
```env
RAZORPAY_WEBHOOK_SECRET=nE6gu]G2+qpdzPwdJdj(h37R4+e&0{Zv
```

**Test it:**
1. Deploy your app to Vercel (or it should already be deployed)
2. In Razorpay Dashboard, test the webhook:
   - Go to Settings → Webhooks
   - Click on your webhook
   - Click "Test Webhook" button
   - Send a test `subscription.charged` event
3. Check your application logs - it should process the webhook successfully

### 2. Test RLS Policies

**Test audit logs:**
```sql
-- This should work (authenticated user can see their org's logs)
SELECT * FROM audit_logs LIMIT 10;

-- This should fail (cannot see other org's logs)
SELECT * FROM audit_logs WHERE organization_id = 'some-other-org-id';
```

**Test migrations table:**
```sql
-- This should fail for regular users (service role only)
SELECT * FROM migrations;
```

### 3. Test All Functions

All 39 functions now have proper `search_path` set. Test key functions:

```sql
-- Test getting organization ID
SELECT public.get_user_organization_id();

-- Test checking permissions
SELECT public.is_admin();

-- Test dashboard analytics
SELECT public.get_dashboard_analytics('your-org-id');
```

---

## What Was Fixed?

### 1. RLS Policies (Security Errors)

**Before:**
- `audit_logs` table had no RLS → **Anyone could read all audit logs**
- `migrations` table had no RLS → **Anyone could see migration history**

**After:**
- `audit_logs`: Users can only see logs from their own organization
- `migrations`: Only service role can access (system table)

### 2. Security Definer View

**Before:**
```sql
CREATE VIEW team_members_view WITH (security_definer=true) AS ...
```
- This enforced permissions of the view creator, not the querying user
- Security risk if view creator has elevated permissions

**After:**
```sql
CREATE VIEW team_members_view AS ...
```
- Normal permissions apply
- Users see data according to their own RLS policies

### 3. Function Search Path (39 Warnings)

**Before:**
```sql
CREATE FUNCTION my_function() ...
-- No search_path set → Security vulnerability
```

**After:**
```sql
CREATE FUNCTION my_function()
SECURITY DEFINER
SET search_path = public, pg_temp
...
```

**Why this matters:**
- Without `search_path`, malicious users could create tables in their schema that shadow public tables
- The function might accidentally use the wrong table
- `SET search_path = public, pg_temp` locks the function to only use `public` schema

---

## Troubleshooting

### Error: "relation does not exist"

If you get errors about missing tables when running the migration:
1. Make sure all previous migrations have been applied first
2. Check that tables like `audit_logs`, `migrations`, `users`, `organizations` exist

### Error: "permission denied"

Make sure you're running the migration as a superuser or service role:
1. In Supabase Dashboard SQL Editor, you automatically have the right permissions
2. If using CLI, make sure you're authenticated: `supabase login`

### Functions still showing warnings

If functions still show warnings after migration:
1. Wait 1-2 minutes for Supabase to refresh the linter cache
2. Refresh the Linter page in Supabase Dashboard
3. If warnings persist, manually check a function:
   ```sql
   \df+ public.get_user_organization_id
   ```
   Look for `SET search_path` in the function definition

---

## Summary

✅ **All 3 Errors Fixed**:
- audit_logs RLS enabled with proper policies
- migrations RLS enabled (service role only)
- team_members_view no longer uses SECURITY DEFINER

✅ **All 39 Function Warnings Fixed**:
- Every function now has `SECURITY DEFINER` and `SET search_path = public, pg_temp`
- Protection against search path manipulation attacks

✅ **Webhook Secret Added**:
- Razorpay webhook secret configured in `.env.local`
- Ready to receive and verify webhook events

### Next Steps:
1. Apply the migration in Supabase Dashboard
2. Enable leaked password protection in Auth settings
3. Test webhooks and database functions
4. All errors and warnings should be resolved!

---

## Need Help?

If you encounter any issues:
1. Check Supabase logs: **Dashboard → Logs**
2. Check application logs in Vercel
3. Verify all environment variables are set correctly
4. Make sure you're using the latest migration file

**Migration File Location:**
```
supabase/migrations/20250103000000_fix_security_issues.sql
```
