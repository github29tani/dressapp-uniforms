-- ============================================================================
-- STORAGE POLICIES - Create via Policy Editor (not SQL Editor)
-- Copy each policy separately and paste in Supabase Storage Policies UI
-- ============================================================================

-- IMPORTANT: These are NOT run in SQL Editor!
-- Go to: Storage → Policies → New Policy → "Use SQL query"

-- ============================================================================
-- POLICY 1: Public Read Access
-- ============================================================================
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- ============================================================================
-- POLICY 2: Authenticated Upload
-- ============================================================================
CREATE POLICY "Authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- ============================================================================
-- POLICY 3: Authenticated Update
-- ============================================================================
CREATE POLICY "Authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- ============================================================================
-- POLICY 4: Authenticated Delete
-- ============================================================================
CREATE POLICY "Authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- ============================================================================
-- VERIFICATION: Run this in SQL Editor to check policies were created
-- ============================================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%product-images%'
ORDER BY policyname;
