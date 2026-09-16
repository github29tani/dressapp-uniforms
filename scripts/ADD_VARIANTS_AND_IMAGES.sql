-- ============================================================================
-- ADD PRODUCT VARIANTS AND IMAGES TO SUPABASE
-- This script adds sizes, colors, stock, and placeholder images
-- Run this AFTER running SUPABASE_SYNC.sql
-- ============================================================================

-- Step 1: Add product variants (sizes and colors)
-- ============================================================================
DO $$
DECLARE
  -- David products
  prod_david_tshirt UUID;
  prod_david_lower UUID;
  prod_david_shirt UUID;
  prod_david_pant UUID;
  prod_david_socks UUID;
  prod_david_girls_1_5 UUID;
  prod_david_girls_6_8 UUID;
  prod_david_girls_9_12 UUID;
  prod_david_nikkar UUID;
  
  -- JJPS products
  prod_jjps_shirt UUID;
  prod_jjps_pant UUID;
  prod_jjps_tshirt UUID;
  prod_jjps_lower UUID;
  
  -- KV products
  prod_kv_shirt UUID;
  prod_kv_pant UUID;
  prod_kv_tshirt UUID;
  prod_kv_top UUID;
  
  -- Other schools
  prod_nav_pant UUID;
  prod_nav_shirt UUID;
  prod_nd_shirt UUID;
  prod_nd_pant UUID;
  prod_nd_tshirt UUID;
  prod_nd_wollen UUID;
  prod_stmary_shirt UUID;
  prod_stmary_pant UUID;
  prod_common_white_shirt UUID;
  prod_common_blue_pant UUID;
  prod_common_black_pant UUID;
  prod_common_blue_shirt UUID;
  prod_common_blue_shirt2 UUID;
  prod_common_white_shirt2 UUID;
  prod_common_blue_nikkar UUID;
  prod_global_shirt UUID;
  prod_global_pant UUID;
  
  size_val TEXT;
  color_val TEXT;
  counter INT;
  prod RECORD;
BEGIN
  -- Get all product IDs
  SELECT id INTO prod_david_tshirt FROM products WHERE slug = 't-shirt-david';
  SELECT id INTO prod_david_lower FROM products WHERE slug = 'lower-david';
  SELECT id INTO prod_david_shirt FROM products WHERE slug = 'shirt-david';
  SELECT id INTO prod_david_pant FROM products WHERE slug = 'pant-david';
  SELECT id INTO prod_david_socks FROM products WHERE slug = 'socks-david';
  SELECT id INTO prod_david_girls_1_5 FROM products WHERE slug = 'david-girls-i-v';
  SELECT id INTO prod_david_girls_6_8 FROM products WHERE slug = 'david-girls-vi-viii';
  SELECT id INTO prod_david_girls_9_12 FROM products WHERE slug = 'david-girls-ix-xii';
  SELECT id INTO prod_david_nikkar FROM products WHERE slug = 'nikkar-david';
  
  SELECT id INTO prod_jjps_shirt FROM products WHERE slug = 'shirt-jjps';
  SELECT id INTO prod_jjps_pant FROM products WHERE slug = 'pant-jjps';
  SELECT id INTO prod_jjps_tshirt FROM products WHERE slug = 't-shirt-jjps';
  SELECT id INTO prod_jjps_lower FROM products WHERE slug = 'lower-jjps';
  
  SELECT id INTO prod_kv_shirt FROM products WHERE slug = 'shirt-kv';
  SELECT id INTO prod_kv_pant FROM products WHERE slug = 'pant-kv';
  SELECT id INTO prod_kv_tshirt FROM products WHERE slug = 't-shirt-kv';
  SELECT id INTO prod_kv_top FROM products WHERE slug = 'top-kv';
  
  SELECT id INTO prod_nav_pant FROM products WHERE slug = 'pant-nav-jeevan';
  SELECT id INTO prod_nav_shirt FROM products WHERE slug = 'shirt-nav-jeevan';
  SELECT id INTO prod_nd_shirt FROM products WHERE slug = 'shirt-nd';
  SELECT id INTO prod_nd_pant FROM products WHERE slug = 'pant-nd';
  SELECT id INTO prod_nd_tshirt FROM products WHERE slug = 't-shirt-nd';
  SELECT id INTO prod_nd_wollen FROM products WHERE slug = 'wollen-pant-nd';
  SELECT id INTO prod_stmary_shirt FROM products WHERE slug = 'shirt-st-mary';
  SELECT id INTO prod_stmary_pant FROM products WHERE slug = 'pant-st-mary';
  
  SELECT id INTO prod_common_white_shirt FROM products WHERE slug = 'white-shirt-common';
  SELECT id INTO prod_common_blue_pant FROM products WHERE slug = 'blue-pant-common';
  SELECT id INTO prod_common_black_pant FROM products WHERE slug = 'black-pant-common';
  SELECT id INTO prod_common_blue_shirt FROM products WHERE slug = 'blue-shirt-common';
  SELECT id INTO prod_common_blue_shirt2 FROM products WHERE slug = 'blue-shirt-2-common';
  SELECT id INTO prod_common_white_shirt2 FROM products WHERE slug = 'white-shirt-2-common';
  SELECT id INTO prod_common_blue_nikkar FROM products WHERE slug = 'blue-nikkar-common';
  
  SELECT id INTO prod_global_shirt FROM products WHERE slug = 'shirt-global-nav-jeevan';
  SELECT id INTO prod_global_pant FROM products WHERE slug = 'pant-global-nav-jeevan';

  -- David T-Shirt: sizes 28-42, colors Blue/Green/Red/Yellow
  FOREACH size_val IN ARRAY ARRAY['28', '30', '32', '34', '36', '38', '40', '42'] LOOP
    FOREACH color_val IN ARRAY ARRAY['Blue', 'Green', 'Red', 'Yellow'] LOOP
      INSERT INTO product_variants (product_id, size, color, stock, sku)
      VALUES (prod_david_tshirt, size_val, color_val, 50, 'DAVID-TS-' || size_val || '-' || UPPER(SUBSTRING(color_val, 1, 1)));
    END LOOP;
  END LOOP;

  -- David Lower: sizes 28-42, colors Blue/Green/Red/Yellow
  FOREACH size_val IN ARRAY ARRAY['28', '30', '32', '34', '36', '38', '40', '42'] LOOP
    FOREACH color_val IN ARRAY ARRAY['Blue', 'Green', 'Red', 'Yellow'] LOOP
      INSERT INTO product_variants (product_id, size, color, stock, sku)
      VALUES (prod_david_lower, size_val, color_val, 50, 'DAVID-LOW-' || size_val || '-' || UPPER(SUBSTRING(color_val, 1, 1)));
    END LOOP;
  END LOOP;

  -- David Shirt: sizes 24-44 (no colors)
  FOREACH size_val IN ARRAY ARRAY['24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44'] LOOP
    INSERT INTO product_variants (product_id, size, stock, sku)
    VALUES (prod_david_shirt, size_val, 50, 'DAVID-SH-' || size_val);
  END LOOP;

  -- David Pant: sizes 22-44
  FOREACH size_val IN ARRAY ARRAY['22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44'] LOOP
    INSERT INTO product_variants (product_id, size, stock, sku)
    VALUES (prod_david_pant, size_val, 50, 'DAVID-PN-' || size_val);
  END LOOP;

  -- David Socks: sizes 22/24-36/34
  FOREACH size_val IN ARRAY ARRAY['22/24', '24/24', '26/24', '28/24', '30/24', '32/24', '34/24', '36/34'] LOOP
    INSERT INTO product_variants (product_id, size, stock, sku)
    VALUES (prod_david_socks, size_val, 50, 'DAVID-SK-' || REPLACE(size_val, '/', '-'));
  END LOOP;

  -- David Girls uniforms: sizes 22-42
  FOREACH size_val IN ARRAY ARRAY['22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42'] LOOP
    INSERT INTO product_variants (product_id, size, stock, sku)
    VALUES (prod_david_girls_1_5, size_val, 50, 'DAVID-G15-' || size_val);
    INSERT INTO product_variants (product_id, size, stock, sku)
    VALUES (prod_david_girls_6_8, size_val, 50, 'DAVID-G68-' || size_val);
    INSERT INTO product_variants (product_id, size, stock, sku)
    VALUES (prod_david_girls_9_12, size_val, 50, 'DAVID-G912-' || size_val);
  END LOOP;

  -- David Nikkar: sizes 12-18
  FOREACH size_val IN ARRAY ARRAY['12', '13', '14', '15', '16', '17', '18'] LOOP
    INSERT INTO product_variants (product_id, size, stock, sku)
    VALUES (prod_david_nikkar, size_val, 50, 'DAVID-NK-' || size_val);
  END LOOP;

  -- Add variants for other schools (simplified - all use standard sizes 22-42)
  FOR prod IN SELECT id FROM products WHERE slug IN (
    'shirt-jjps', 'pant-jjps', 't-shirt-jjps', 'lower-jjps',
    'shirt-kv', 'pant-kv', 't-shirt-kv', 'top-kv',
    'pant-nav-jeevan', 'shirt-nav-jeevan',
    'shirt-nd', 'pant-nd', 't-shirt-nd', 'wollen-pant-nd',
    'shirt-st-mary', 'pant-st-mary',
    'white-shirt-common', 'blue-pant-common', 'black-pant-common',
    'blue-shirt-common', 'blue-shirt-2-common', 'white-shirt-2-common', 'blue-nikkar-common',
    'shirt-global-nav-jeevan', 'pant-global-nav-jeevan'
  ) LOOP
    FOREACH size_val IN ARRAY ARRAY['22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42'] LOOP
      INSERT INTO product_variants (product_id, size, stock, sku)
      VALUES (prod, size_val, 50, 'VAR-' || SUBSTRING(MD5(prod::text), 1, 6) || '-' || size_val);
    END LOOP;
  END LOOP;

END $$;

-- Step 2: Add placeholder product images
-- ============================================================================
DO $$
DECLARE
  prod RECORD;
BEGIN
  -- Add a placeholder image for each product
  FOR prod IN SELECT id, slug FROM products LOOP
    INSERT INTO product_images (product_id, url, alt_text, sort_order)
    VALUES (
      prod.id,
      'https://placehold.co/600x800/e0e7ff/1e40af?text=' || REPLACE(prod.slug, '-', '+'),
      'Product image for ' || prod.slug,
      1
    );
  END LOOP;
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

-- Count images per product
SELECT p.name, COUNT(pi.id) as image_count
FROM products p
LEFT JOIN product_images pi ON pi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY p.name;

-- Show sample variants for David T-Shirt
SELECT p.name, pv.size, pv.color, pv.stock, pv.sku
FROM products p
JOIN product_variants pv ON pv.product_id = p.id
WHERE p.slug = 't-shirt-david'
ORDER BY pv.size, pv.color
LIMIT 10;

-- Total summary
SELECT 
  'Products' as type, COUNT(*) as count FROM products
UNION ALL
SELECT 'Variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'Images', COUNT(*) FROM product_images;
