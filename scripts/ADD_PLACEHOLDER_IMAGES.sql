-- ============================================================================
-- ADD PLACEHOLDER IMAGES
-- Run this AFTER running SUPABASE_SYNC.sql and ADD_VARIANTS_SIMPLE.sql
-- ============================================================================

-- Add placeholder images for all products
INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT 
  id,
  'https://placehold.co/600x800/e0e7ff/1e40af?text=' || REPLACE(name, ' ', '+'),
  'Placeholder for ' || name,
  1
FROM products
WHERE id NOT IN (SELECT DISTINCT product_id FROM product_images WHERE product_id IS NOT NULL);
