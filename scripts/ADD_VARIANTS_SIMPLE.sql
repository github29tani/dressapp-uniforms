-- ============================================================================
-- ADD PRODUCT VARIANTS (Simple version - sizes only)
-- This works with the existing product_variants table schema
-- Run this AFTER running SUPABASE_SYNC.sql
-- ============================================================================

DO $$
DECLARE
  prod RECORD;
  size_val TEXT;
BEGIN
  -- Add variants for ALL products with standard sizes
  FOR prod IN SELECT id, slug FROM products LOOP
    -- Standard clothing sizes 22-42
    FOREACH size_val IN ARRAY ARRAY['22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42'] LOOP
      INSERT INTO product_variants (product_id, size, stock, sku)
      VALUES (
        prod.id, 
        size_val, 
        50, 
        UPPER(SUBSTRING(prod.slug, 1, 6)) || '-' || size_val
      );
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Added variants for all products!';
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Count variants per product
SELECT p.name, p.slug, COUNT(pv.id) as variant_count
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id
GROUP BY p.id, p.name, p.slug
ORDER BY p.name;

-- Total summary
SELECT 
  'Products' as type, COUNT(*) as count FROM products
UNION ALL
SELECT 'Variants', COUNT(*) FROM product_variants;

-- Sample variants
SELECT p.name, pv.size, pv.stock, pv.sku
FROM products p
JOIN product_variants pv ON pv.product_id = p.id
WHERE p.slug = 't-shirt-david'
ORDER BY pv.size
LIMIT 10;
