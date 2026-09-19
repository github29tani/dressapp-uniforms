-- ============================================================================
-- TEMPORARY FIX - Disable RLS on Storage (for testing only)
-- This will allow uploads without policies
-- WARNING: This makes the bucket fully public - only use for testing!
-- ============================================================================

-- Disable RLS on storage.objects (TEMPORARY - allows all operations)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- After upload works, RE-ENABLE RLS with proper policies:
-- ============================================================================
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- Then create the 4 policies via UI as shown in previous guides
