-- ============================================================================
-- CHECK IMAGES STATUS
-- See which products have images and their URLs
-- ============================================================================

-- 1. Count total products with images
SELECT 
  COUNT(DISTINCT p.id) as products_with_images,
  COUNT(pi.id) as total_image_records
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id;

-- 2. List products with their image URLs
SELECT 
  p.name as product,
  c.name as school,
  pi.url as image_url,
  pi.created_at as uploaded_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE pi.sort_order = 1 OR pi.sort_order IS NULL
ORDER BY pi.created_at DESC NULLS LAST, p.name;

-- 3. Products WITHOUT images
SELECT 
  p.name as product,
  c.name as school,
  p.slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE pi.id IS NULL
ORDER BY c.name, p.name;

-- 4. Recently uploaded images
SELECT 
  p.name as product,
  pi.url,
  pi.created_at
FROM product_images pi
JOIN products p ON pi.product_id = p.id
ORDER BY pi.created_at DESC
LIMIT 10;
