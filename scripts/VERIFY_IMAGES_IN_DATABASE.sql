-- ============================================================================
-- VERIFY IMAGES IN DATABASE
-- Check if images were uploaded and URLs are in database
-- ============================================================================

-- 1. Check how many images are in the database
SELECT COUNT(*) as total_images
FROM product_images;

-- 2. Check sample of uploaded images with their URLs
SELECT 
  p.name as product_name,
  pi.url as image_url,
  pi.alt_text,
  pi.created_at,
  pi.sort_order
FROM product_images pi
JOIN products p ON pi.product_id = p.id
ORDER BY pi.created_at DESC
LIMIT 10;

-- 3. Check which products have images vs placeholders
SELECT 
  p.name as product_name,
  s.name as school_name,
  pi.url as image_url,
  CASE 
    WHEN pi.url LIKE '%placehold.co%' THEN 'Placeholder'
    WHEN pi.url LIKE '%supabase.co%' THEN 'Real Image'
    ELSE 'Unknown'
  END as image_type
FROM products p
LEFT JOIN categories s ON p.category_id = s.id
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.sort_order = 1
ORDER BY s.name, p.name;

-- 4. Count products by image type
SELECT 
  CASE 
    WHEN pi.url LIKE '%placehold.co%' THEN 'Placeholder'
    WHEN pi.url LIKE '%supabase.co%' THEN 'Real Image'
    WHEN pi.url IS NULL THEN 'No Image'
    ELSE 'Unknown'
  END as image_type,
  COUNT(*) as count
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.sort_order = 1
GROUP BY 
  CASE 
    WHEN pi.url LIKE '%placehold.co%' THEN 'Placeholder'
    WHEN pi.url LIKE '%supabase.co%' THEN 'Real Image'
    WHEN pi.url IS NULL THEN 'No Image'
    ELSE 'Unknown'
  END;

-- 5. List all files in product-images bucket
SELECT 
  name as file_path,
  bucket_id,
  created_at,
  metadata->>'size' as size_bytes,
  metadata->>'mimetype' as mime_type
FROM storage.objects
WHERE bucket_id = 'product-images'
ORDER BY created_at DESC;
