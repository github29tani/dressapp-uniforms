-- ============================================================================
-- FIX STORAGE UPLOAD - Disable RLS Temporarily
-- Copy and paste this ENTIRE block into Supabase SQL Editor and click RUN
-- ============================================================================

-- Step 1: Disable Row Level Security on storage.objects
-- This allows uploads without policy restrictions (temporary fix)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Step 2: Ensure bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'product-images';

-- Step 3: Verify the changes
SELECT 
  'Bucket Configuration' as check_type,
  name,
  public,
  file_size_limit
FROM storage.buckets
WHERE name = 'product-images'

UNION ALL

SELECT 
  'RLS Status' as check_type,
  tablename as name,
  rowsecurity::text as public,
  NULL as file_size_limit
FROM pg_tables
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- ============================================================================
-- RESULT SHOULD SHOW:
-- 1. product-images bucket with public = true
-- 2. storage.objects with rowsecurity = false (RLS disabled)
-- ============================================================================

-- ============================================================================
-- AFTER UPLOAD WORKS, RE-ENABLE SECURITY WITH THESE COMMANDS:
-- ============================================================================
-- 
-- -- Re-enable RLS
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- 
-- -- Create policies (run each separately in Storage Policies UI)
-- CREATE POLICY "product_images_public_read" ON storage.objects 
--   FOR SELECT USING (bucket_id = 'product-images');
-- 
-- CREATE POLICY "product_images_auth_insert" ON storage.objects 
--   FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
-- 
-- CREATE POLICY "product_images_auth_update" ON storage.objects 
--   FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
-- 
-- CREATE POLICY "product_images_auth_delete" ON storage.objects 
--   FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
