-- ============================================================================
-- FIX STORAGE POLICIES - Allow Image Uploads
-- Run this in Supabase SQL Editor to enable uploads from admin panel
-- ============================================================================

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Allow authenticated uploads to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to product-images" ON storage.objects;

-- Policy 1: Allow PUBLIC READ ACCESS (so images show on website)
CREATE POLICY "Allow public read access to product-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Policy 2: Allow AUTHENTICATED UPLOADS
CREATE POLICY "Allow authenticated uploads to product-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Policy 3: Allow AUTHENTICATED UPDATES
CREATE POLICY "Allow authenticated updates to product-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Policy 4: Allow AUTHENTICATED DELETES
CREATE POLICY "Allow authenticated deletes from product-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%product-images%'
ORDER BY policyname;
