-- ============================================================================
-- UPDATE IMAGE URLS FROM PLACEHOLDER TO REAL SUPABASE STORAGE
-- Run this AFTER uploading real images to product-images bucket
-- ============================================================================

-- Common School (7 products)
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/common/black-pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'black-pant-common' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/common/blue-nikkar.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'blue-nikkar-common' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/common/blue-pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'blue-pant-common' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/common/blue-shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'blue-shirt-common' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/common/blue-shirt-2.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'blue-shirt-2-common' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/common/white-shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'white-shirt-common' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/common/white-shirt-2.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'white-shirt-2-common' LIMIT 1);

-- David School (9 products)
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/t-shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 't-shirt-david' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/lower.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'lower-david' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'shirt-david' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'pant-david' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/socks.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'socks-david' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/nikkar.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'nikkar-david' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/girls-i-v.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'david-girls-i-v-david' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/girls-ix-xii.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'david-girls-ix-xii-david' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/girls-vi-viii.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'david-girls-vi-viii-david' LIMIT 1);

-- Global Nav Jeevan School (2 products)
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/global-nav-jeevan/pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'pant-global-nav-jeevan-school' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/global-nav-jeevan/shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'shirt-global-nav-jeevan-school' LIMIT 1);

-- JJPS School (4 products)
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/jjps/lower.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'lower-jjps' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/jjps/pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'pant-jjps' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/jjps/shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'shirt-jjps' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/jjps/t-shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 't-shirt-jjps' LIMIT 1);

-- KV School (4 products)
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/kv/pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'pant-kv' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/kv/shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'shirt-kv' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/kv/t-shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 't-shirt-kv' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/kv/top.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'top-kv' LIMIT 1);

-- Nav Jeevan School (2 products)
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/nav-jeevan/pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'pant-nav-jeevan' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/nav-jeevan/shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'shirt-nav-jeevan' LIMIT 1);

-- ND School (4 products)
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/nd/pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'pant-nd' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/nd/shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'shirt-nd' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/nd/t-shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 't-shirt-nd' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/nd/wollen-pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'wollen-pant-nd' LIMIT 1);

-- ST Mary School (2 products)
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/st-mary/pant.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'pant-st-mary' LIMIT 1);
UPDATE product_images SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/st-mary/shirt.jpg' WHERE product_id = (SELECT id FROM products WHERE slug = 'shirt-st-mary' LIMIT 1);

-- Verify all images are updated
SELECT 
  p.name as product,
  s.name as school,
  pi.url as image_url
FROM product_images pi
JOIN products p ON pi.product_id = p.id
JOIN categories s ON p.category_id = s.id
ORDER BY s.name, p.name;
