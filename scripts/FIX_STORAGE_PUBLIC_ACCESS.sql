-- ============================================================================
-- FIX STORAGE PUBLIC ACCESS
-- Ensure bucket is public and files can be read by anyone
-- ============================================================================

-- 1. Make sure bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'product-images';

-- 2. Check if public read policy exists
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%product_images%'
ORDER BY policyname;

-- If no policies exist, they need to be created via Dashboard UI
-- because ALTER TABLE storage.objects requires superuser permissions

-- 3. Verify bucket is public
SELECT name, public FROM storage.buckets WHERE name = 'product-images';
