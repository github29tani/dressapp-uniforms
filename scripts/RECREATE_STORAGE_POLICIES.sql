-- ============================================================================
-- RECREATE STORAGE POLICIES - Delete old and create new
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Drop all existing policies for product-images bucket
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated deletes" ON storage.objects;

-- Drop any other variations that might exist
DROP POLICY IF EXISTS "public_select" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete" ON storage.objects;
DROP POLICY IF EXISTS "auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "auth_update" ON storage.objects;
DROP POLICY IF EXISTS "auth_delete" ON storage.objects;

-- Step 2: Create new policies with correct permissions

-- Policy 1: Allow anyone to READ files (public access)
CREATE POLICY "product_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Policy 2: Allow authenticated users to INSERT (upload) files
CREATE POLICY "product_images_auth_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Policy 3: Allow authenticated users to UPDATE files
CREATE POLICY "product_images_auth_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Policy 4: Allow authenticated users to DELETE files
CREATE POLICY "product_images_auth_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- Step 3: Verify policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  roles,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%product_images%'
ORDER BY policyname;

-- ============================================================================
-- Expected Result: 4 policies should be listed
-- 1. product_images_public_read (SELECT, public)
-- 2. product_images_auth_insert (INSERT, authenticated)
-- 3. product_images_auth_update (UPDATE, authenticated)
-- 4. product_images_auth_delete (DELETE, authenticated)
-- ============================================================================
