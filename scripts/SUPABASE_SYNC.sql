-- ============================================================================
-- COMPLETE DATA SYNC FOR SUPABASE
-- Copy and paste this entire script into your Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/sql
-- ============================================================================

-- Step 1: Clean existing data
-- ============================================================================
TRUNCATE school_products CASCADE;
TRUNCATE product_variants CASCADE;
TRUNCATE product_images CASCADE;
TRUNCATE products CASCADE;
TRUNCATE categories CASCADE;
TRUNCATE schools CASCADE;

-- Step 2: Insert Schools (8 schools)
-- ============================================================================
INSERT INTO schools (name, slug, is_active, created_at) VALUES
('Common', 'common', true, '2026-09-15T14:05:01.004Z'),
('David', 'david', true, '2026-09-15T14:05:00.992Z'),
('Global Nav Jeevan School', 'global-nav-jeevan-school', true, '2026-09-15T14:05:01.004Z'),
('JJPS', 'jjps', true, '2026-09-15T14:05:01.003Z'),
('KV', 'kv', true, '2026-09-15T14:05:01.003Z'),
('Nav Jeevan', 'nav-jeevan', true, '2026-09-15T14:05:01.003Z'),
('ND', 'nd', true, '2026-09-15T14:05:01.004Z'),
('ST Mary', 'st-mary', true, '2026-09-15T14:05:01.004Z');

-- Step 3: Insert Categories (same as schools)
-- ============================================================================
INSERT INTO categories (name, slug, is_active, sort_order, created_at)
SELECT name, slug, is_active, 0 as sort_order, created_at
FROM schools;

-- Step 4: Insert Products (34 products)
-- ============================================================================

-- Get category IDs into variables for easier reference
DO $$
DECLARE
  cat_common UUID;
  cat_david UUID;
  cat_global UUID;
  cat_jjps UUID;
  cat_kv UUID;
  cat_nav UUID;
  cat_nd UUID;
  cat_stmary UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_common FROM categories WHERE slug = 'common';
  SELECT id INTO cat_david FROM categories WHERE slug = 'david';
  SELECT id INTO cat_global FROM categories WHERE slug = 'global-nav-jeevan-school';
  SELECT id INTO cat_jjps FROM categories WHERE slug = 'jjps';
  SELECT id INTO cat_kv FROM categories WHERE slug = 'kv';
  SELECT id INTO cat_nav FROM categories WHERE slug = 'nav-jeevan';
  SELECT id INTO cat_nd FROM categories WHERE slug = 'nd';
  SELECT id INTO cat_stmary FROM categories WHERE slug = 'st-mary';

  -- Insert David products (9 products)
  INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
  ('T-Shirt', 't-shirt-david', 'T-Shirt for David. Boys, Summer, T-Shirt', cat_david, 'boys', 32000, true, NOW()),
  ('Lower', 'lower-david', 'Lower for David. Boys, Summer, Lower', cat_david, 'boys', 32000, true, NOW()),
  ('Shirt', 'shirt-david', 'Shirt for David. Boys, Summer, Shirt', cat_david, 'boys', 32000, true, NOW()),
  ('Pant', 'pant-david', 'Pant for David. Boys, Summer, Pant', cat_david, 'boys', 32000, true, NOW()),
  ('Socks', 'socks-david', 'Socks for David. Boys, Summer, Socks', cat_david, 'boys', 32000, true, NOW()),
  ('David Girls I - V', 'david-girls-i-v', 'David Girls I - V. Girls', cat_david, 'girls', 32000, true, NOW()),
  ('David Girls VI - VIII', 'david-girls-vi-viii', 'David Girls VI - VIII. Girls', cat_david, 'girls', 32000, true, NOW()),
  ('David Girls IX - XII', 'david-girls-ix-xii', 'David Girls IX - XII. Girls', cat_david, 'girls', 32000, true, NOW()),
  ('Nikkar', 'nikkar-david', 'Nikkar for David. Boys, Summer', cat_david, 'boys', 32000, true, NOW());

  -- Insert JJPS products (4 products)
  INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
  ('Shirt', 'shirt-jjps', 'Shirt for JJPS. Boys, Shirt, Summer', cat_jjps, 'boys', 32000, true, NOW()),
  ('Pant', 'pant-jjps', 'Pant for JJPS. Boys, Pant, Summer', cat_jjps, 'boys', 32000, true, NOW()),
  ('T-Shirt', 't-shirt-jjps', 'T-Shirt for JJPS. Boys, T-Shirt, Summer', cat_jjps, 'boys', 32000, true, NOW()),
  ('Lower', 'lower-jjps', 'Lower for JJPS. Boys, Lower, Summer', cat_jjps, 'boys', 32000, true, NOW());

  -- Insert KV products (4 products)
  INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
  ('Shirt', 'shirt-kv', 'Shirt for KV. Boys, Class VI to XII, Shirt, Summer', cat_kv, 'boys', 32000, true, NOW()),
  ('Pant', 'pant-kv', 'Pant for KV. Boys, Class VI to XII, Pant, Summer', cat_kv, 'boys', 32000, true, NOW()),
  ('T-Shirt', 't-shirt-kv', 'T-Shirt for KV. Boys, Class VI to XII, T-Shirt, Summer', cat_kv, 'boys', 32000, true, NOW()),
  ('Top', 'top-kv', 'Top for KV. Class IX to XII, Girls, Summer', cat_kv, 'girls', 32000, true, NOW());

  -- Insert Nav Jeevan products (2 products)
  INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
  ('Pant', 'pant-nav-jeevan', 'Pant for Nav Jeevan. Boys, Pant, Summer', cat_nav, 'boys', 32000, true, NOW()),
  ('Shirt', 'shirt-nav-jeevan', 'Shirt for Nav Jeevan. Boys, Shirt, Summer', cat_nav, 'boys', 32000, true, NOW());

  -- Insert ND products (4 products)
  INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
  ('Shirt', 'shirt-nd', 'Shirt for ND. Boys, Shirt, Summer', cat_nd, 'boys', 32000, true, NOW()),
  ('Pant', 'pant-nd', 'Pant for ND. Boys, Pant, Summer', cat_nd, 'boys', 32000, true, NOW()),
  ('T-Shirt', 't-shirt-nd', 'T-Shirt for ND. Boys, T-Shirt, Summer', cat_nd, 'boys', 32000, true, NOW()),
  ('Wollen Pant', 'wollen-pant-nd', 'Wollen Pant for ND. Boys, Pant', cat_nd, 'boys', 32000, true, NOW());

  -- Insert ST Mary products (2 products)
  INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
  ('Shirt', 'shirt-st-mary', 'Shirt for ST Mary. Boys, Shirt, Summer', cat_stmary, 'boys', 32000, true, NOW()),
  ('Pant', 'pant-st-mary', 'Pant for ST Mary. Boys, Pant, Summer', cat_stmary, 'boys', 32000, true, NOW());

  -- Insert Common products (7 products)
  INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
  ('White Shirt', 'white-shirt-common', 'White Shirt for Common. Boys, Shirt, Summer', cat_common, 'boys', 32000, true, NOW()),
  ('Blue Pant', 'blue-pant-common', 'Blue Pant for Common. Boys, Pant, Summer', cat_common, 'boys', 32000, true, NOW()),
  ('Black Pant', 'black-pant-common', 'Black Pant for Common. Boys, Pant, Winter', cat_common, 'boys', 32000, true, NOW()),
  ('Blue Shirt', 'blue-shirt-common', 'Blue Shirt for Common. Boys, Shirt, Summer', cat_common, 'boys', 32000, true, NOW()),
  ('Blue Shirt 2', 'blue-shirt-2-common', 'Blue Shirt for Common. Boys, Shirt, Winter', cat_common, 'boys', 32000, true, NOW()),
  ('White Shirt 2', 'white-shirt-2-common', 'White Shirt for Common. Boys, Shirt, Winter', cat_common, 'boys', 32000, true, NOW()),
  ('Blue Nikkar', 'blue-nikkar-common', 'Blue Nikkar for Common. Boys, Nikkar', cat_common, 'boys', 32000, true, NOW());

  -- Insert Global Nav Jeevan School products (2 products)
  INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
  ('Shirt', 'shirt-global-nav-jeevan', 'Shirt for Global Nav Jeevan School. Boys, Shirt, Summer', cat_global, 'boys', 32000, true, NOW()),
  ('Pant', 'pant-global-nav-jeevan', 'Pant for Global Nav Jeevan School. Boys, Pant, Summer', cat_global, 'boys', 32000, true, NOW());

END $$;

-- Step 5: Link schools to products via school_products table
-- ============================================================================
INSERT INTO school_products (school_id, product_id)
SELECT s.id, p.id
FROM schools s
JOIN categories c ON c.slug = s.slug
JOIN products p ON p.category_id = c.id;

-- ============================================================================
-- VERIFICATION QUERIES - Run these to check the results
-- ============================================================================

-- Check school count
SELECT 'Schools' as table_name, COUNT(*) as count FROM schools
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'School-Product Links', COUNT(*) FROM school_products;

-- Products per school
SELECT s.name as school, COUNT(sp.product_id) as product_count
FROM schools s
LEFT JOIN school_products sp ON sp.school_id = s.id
GROUP BY s.id, s.name
ORDER BY s.name;

-- Show all products with their schools
SELECT s.name as school, p.name as product, p.gender, p.price/100 as price_rupees
FROM schools s
JOIN school_products sp ON sp.school_id = s.id
JOIN products p ON p.id = sp.product_id
ORDER BY s.name, p.name;
