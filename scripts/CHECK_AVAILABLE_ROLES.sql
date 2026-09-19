-- ============================================================================
-- CHECK AVAILABLE ROLES FOR STORAGE POLICIES
-- This shows what roles you can use in storage policies
-- ============================================================================

-- 1. List all available roles in PostgreSQL
SELECT 
  rolname as role_name,
  rolsuper as is_superuser,
  rolinherit as can_inherit,
  rolcreaterole as can_create_roles,
  rolcreatedb as can_create_db
FROM pg_roles
ORDER BY rolname;

-- 2. Check existing storage policies and their roles
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  roles,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;

-- 3. Common roles used in Supabase storage policies:
-- - public           : Anonymous users (not logged in)
-- - authenticated    : Logged in users
-- - service_role     : Backend service (bypasses RLS)
-- - anon             : Same as public
-- - postgres         : Database owner (full access)

-- 4. Check if bucket is public
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'product-images';

-- 5. Test if files can be read publicly
-- If bucket is public, this should work without authentication
SELECT 
  name,
  bucket_id,
  owner,
  created_at
FROM storage.objects
WHERE bucket_id = 'product-images'
LIMIT 5;
