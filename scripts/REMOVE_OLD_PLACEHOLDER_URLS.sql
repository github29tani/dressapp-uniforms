-- ============================================================================
-- REMOVE OLD PLACEHOLDER URLs
-- This removes the URLs we added earlier, so only uploaded images show
-- ============================================================================

-- Delete all placeholder image URLs
DELETE FROM product_images
WHERE url LIKE '%placehold.co%'
   OR url LIKE '%/storage/v1/object/public/product-images/%';

-- Verify - should show 0 rows or only images you manually uploaded
SELECT 
  p.name,
  pi.url
FROM product_images pi
JOIN products p ON pi.product_id = p.id
ORDER BY pi.created_at DESC;
