-- ============================================================================
-- FIX PRODUCT_IMAGES TABLE CONSTRAINT
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Check current constraints
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'product_images'::regclass;

-- Step 2: Drop existing unique constraint if it exists (might fail if doesn't exist)
ALTER TABLE product_images DROP CONSTRAINT IF EXISTS product_images_product_id_sort_order_key;
ALTER TABLE product_images DROP CONSTRAINT IF EXISTS product_images_pkey;

-- Step 3: Add primary key on id (if not exists)
ALTER TABLE product_images ADD PRIMARY KEY (id);

-- Step 4: Add unique constraint on product_id and sort_order
ALTER TABLE product_images 
ADD CONSTRAINT product_images_product_id_sort_order_key 
UNIQUE (product_id, sort_order);

-- Step 5: Verify constraints are created
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'product_images'::regclass;

-- Expected results:
-- 1. product_images_pkey (PRIMARY KEY on id)
-- 2. product_images_product_id_sort_order_key (UNIQUE on product_id, sort_order)
