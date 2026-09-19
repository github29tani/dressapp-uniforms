-- Clean up orphaned product image records
-- Run this in Supabase SQL Editor after deleting images from storage bucket

-- This will remove all records from product_images table where the image file
-- no longer exists in Supabase storage

-- Option 1: Delete ALL product images (use this to start fresh)
DELETE FROM product_images;

-- Option 2: Delete specific product images by product_id
-- Uncomment and replace 'YOUR_PRODUCT_ID' with actual product ID
-- DELETE FROM product_images WHERE product_id = 'YOUR_PRODUCT_ID';

-- Option 3: Delete images for a specific category
-- Uncomment and replace 'category-slug' with actual category slug
-- DELETE FROM product_images 
-- WHERE product_id IN (
--   SELECT id FROM products WHERE category_id IN (
--     SELECT id FROM categories WHERE slug = 'category-slug'
--   )
-- );

-- Verify deletion (should return 0 rows if all cleaned up)
SELECT COUNT(*) as remaining_images FROM product_images;
