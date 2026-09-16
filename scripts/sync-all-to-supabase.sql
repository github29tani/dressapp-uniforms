-- ============================================================================
-- Complete data sync script for Supabase
-- Run this in your Supabase SQL Editor: 
-- https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/sql
-- ============================================================================

-- Step 1: Clear existing data
-- ============================================================================
DELETE FROM school_products;
DELETE FROM product_variants;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM schools;

-- Step 2: Insert Schools
-- ============================================================================
INSERT INTO schools (name, slug, is_active, created_at) VALUES
('David', 'david', true, '2026-09-15T14:05:00.992Z'),
('JJPS', 'jjps', true, '2026-09-15T14:05:01.003Z'),
('KV', 'kv', true, '2026-09-15T14:05:01.003Z'),
('Nav Jeevan', 'nav-jeevan', true, '2026-09-15T14:05:01.003Z'),
('ND', 'nd', true, '2026-09-15T14:05:01.004Z'),
('ST Mary', 'st-mary', true, '2026-09-15T14:05:01.004Z'),
('Common', 'common', true, '2026-09-15T14:05:01.004Z'),
('Global Nav Jeevan School', 'global-nav-jeevan-school', true, '2026-09-15T14:05:01.004Z');

-- Step 3: Insert Categories (using school names as categories)
-- ============================================================================
INSERT INTO categories (name, slug, is_active, sort_order, created_at)
SELECT name, slug, is_active, 0, created_at
FROM schools;

-- Step 4: Get school/category IDs and store them
-- ============================================================================
-- We'll need to reference these IDs in the next steps
-- Run this query first to see the IDs, then use them in the products insert

-- To see school IDs:
-- SELECT id, name, slug FROM schools ORDER BY name;

-- To see category IDs:
-- SELECT id, name, slug FROM categories ORDER BY name;

-- ============================================================================
-- IMPORTANT: Before running the product inserts below, you need to:
-- 1. Run the above queries to get the actual UUIDs for schools/categories
-- 2. Replace the placeholder IDs in the product inserts below
-- ============================================================================

-- Example: If David school has ID '123e4567-e89b-12d3-a456-426614174000'
-- Replace all instances of 'DAVID_CATEGORY_ID' with that UUID

-- Step 5: Insert Products
-- ============================================================================
-- Replace the CATEGORY_ID placeholders with actual UUIDs from your database

-- DAVID Products (9 products)
INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
('T-Shirt', 't-shirt-david', 'T-Shirt for David. Boys, Summer, T-Shirt', 'DAVID_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Lower', 'lower-david', 'Lower for David. Boys, Summer, Lower', 'DAVID_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Shirt', 'shirt-david', 'Shirt for David. Boys, Summer, Shirt', 'DAVID_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Pant', 'pant-david', 'Pant for David. Boys, Summer, Pant', 'DAVID_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Socks', 'socks-david', 'Socks for David. Boys, Summer, Socks', 'DAVID_CATEGORY_ID', 'boys', 32000, true, NOW()),
('David Girls I - V', 'david-girls-i-v', 'David Girls I - V. Girls', 'DAVID_CATEGORY_ID', 'girls', 32000, true, NOW()),
('David Girls VI - VIII', 'david-girls-vi-viii', 'David Girls VI - VIII. Girls', 'DAVID_CATEGORY_ID', 'girls', 32000, true, NOW()),
('David Girls IX - XII', 'david-girls-ix-xii', 'David Girls IX - XII. Girls', 'DAVID_CATEGORY_ID', 'girls', 32000, true, NOW()),
('Nikkar', 'nikkar-david', 'Nikkar for David. Boys, Summer', 'DAVID_CATEGORY_ID', 'boys', 32000, true, NOW());

-- JJPS Products (4 products)
INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
('Shirt', 'shirt-jjps', 'Shirt for JJPS. Boys, Shirt, Summer', 'JJPS_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Pant', 'pant-jjps', 'Pant for JJPS. Boys, Pant, Summer', 'JJPS_CATEGORY_ID', 'boys', 32000, true, NOW()),
('T-Shirt', 't-shirt-jjps', 'T-Shirt for JJPS. Boys, T-Shirt, Summer', 'JJPS_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Lower', 'lower-jjps', 'Lower for JJPS. Boys, Lower, Summer', 'JJPS_CATEGORY_ID', 'boys', 32000, true, NOW());

-- KV Products (4 products)
INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
('Shirt', 'shirt-kv', 'Shirt for KV. Boys, Class VI to XII, Shirt, Summer', 'KV_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Pant', 'pant-kv', 'Pant for KV. Boys, Class VI to XII, Pant, Summer', 'KV_CATEGORY_ID', 'boys', 32000, true, NOW()),
('T-Shirt', 't-shirt-kv', 'T-Shirt for KV. Boys, Class VI to XII, T-Shirt, Summer', 'KV_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Top', 'top-kv', 'Top for KV. Class IX to XII, Girls, Summer', 'KV_CATEGORY_ID', 'girls', 32000, true, NOW());

-- NAV JEEVAN Products (2 products)
INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
('Pant', 'pant-nav-jeevan', 'Pant for Nav Jeevan. Boys, Pant, Summer', 'NAV_JEEVAN_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Shirt', 'shirt-nav-jeevan', 'Shirt for Nav Jeevan. Boys, Shirt, Summer', 'NAV_JEEVAN_CATEGORY_ID', 'boys', 32000, true, NOW());

-- ND Products (4 products)
INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
('Shirt', 'shirt-nd', 'Shirt for ND. Boys, Shirt, Summer', 'ND_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Pant', 'pant-nd', 'Pant for ND. Boys, Pant, Summer', 'ND_CATEGORY_ID', 'boys', 32000, true, NOW()),
('T-Shirt', 't-shirt-nd', 'T-Shirt for ND. Boys, T-Shirt, Summer', 'ND_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Wollen Pant', 'wollen-pant-nd', 'Wollen Pant for ND. Boys, Pant', 'ND_CATEGORY_ID', 'boys', 32000, true, NOW());

-- ST MARY Products (2 products)
INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
('Shirt', 'shirt-st-mary', 'Shirt for ST Mary. Boys, Shirt, Summer', 'ST_MARY_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Pant', 'pant-st-mary', 'Pant for ST Mary. Boys, Pant, Summer', 'ST_MARY_CATEGORY_ID', 'boys', 32000, true, NOW());

-- COMMON Products (7 products)
INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
('White Shirt', 'white-shirt-common', 'White Shirt for Common. Boys, Shirt, Summer', 'COMMON_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Blue Pant', 'blue-pant-common', 'Blue Pant for Common. Boys, Pant, Summer', 'COMMON_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Black Pant', 'black-pant-common', 'Black Pant for Common. Boys, Pant, Winter', 'COMMON_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Blue Shirt', 'blue-shirt-common', 'Blue Shirt for Common. Boys, Shirt, Summer', 'COMMON_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Blue Shirt 2', 'blue-shirt-2-common', 'Blue Shirt for Common. Boys, Shirt, Winter', 'COMMON_CATEGORY_ID', 'boys', 32000, true, NOW()),
('White Shirt 2', 'white-shirt-2-common', 'White Shirt for Common. Boys, Shirt, Winter', 'COMMON_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Blue Nikkar', 'blue-nikkar-common', 'Blue Nikkar for Common. Boys, Nikkar', 'COMMON_CATEGORY_ID', 'boys', 32000, true, NOW());

-- GLOBAL NAV JEEVAN SCHOOL Products (2 products)
INSERT INTO products (name, slug, description, category_id, gender, price, is_active, created_at) VALUES
('Shirt', 'shirt-global-nav-jeevan', 'Shirt for Global Nav Jeevan School. Boys, Shirt, Summer', 'GLOBAL_NAV_JEEVAN_CATEGORY_ID', 'boys', 32000, true, NOW()),
('Pant', 'pant-global-nav-jeevan', 'Pant for Global Nav Jeevan School. Boys, Pant, Summer', 'GLOBAL_NAV_JEEVAN_CATEGORY_ID', 'boys', 32000, true, NOW());

-- ============================================================================
-- Step 6: Create school_products linkage
-- ============================================================================
-- This links products to their schools
INSERT INTO school_products (school_id, product_id)
SELECT s.id as school_id, p.id as product_id
FROM schools s
JOIN categories c ON c.slug = s.slug
JOIN products p ON p.category_id = c.id;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the data was inserted correctly:

-- Count schools
SELECT COUNT(*) as school_count FROM schools;

-- Count products per school
SELECT s.name, COUNT(sp.product_id) as product_count
FROM schools s
LEFT JOIN school_products sp ON sp.school_id = s.id
GROUP BY s.id, s.name
ORDER BY s.name;

-- View all products with their schools
SELECT s.name as school, p.name as product, p.price, p.gender
FROM schools s
JOIN school_products sp ON sp.school_id = s.id
JOIN products p ON p.id = sp.product_id
ORDER BY s.name, p.name;
