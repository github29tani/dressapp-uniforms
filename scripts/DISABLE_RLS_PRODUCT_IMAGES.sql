-- ============================================================================
-- DISABLE RLS ON PRODUCT_IMAGES TABLE
-- This allows the API route to insert/update images
-- ============================================================================

-- Disable RLS on product_images table
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'product_images';

-- Expected result: rowsecurity = false
