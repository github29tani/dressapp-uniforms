# Upload Real Product Images to Supabase Storage

## Step 1: Create Storage Bucket

1. Go to: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/buckets
2. Click **"New bucket"**
3. Settings:
   - **Name**: `product-images`
   - **Public bucket**: ✅ YES (check this box)
   - Click **"Create bucket"**

## Step 2: Organize Your Images

Create folders for each school and name images clearly:

```
product-images/
├── common/
│   ├── black-pant.jpg
│   ├── blue-nikkar.jpg
│   ├── blue-pant.jpg
│   └── ...
├── david/
│   ├── t-shirt.jpg
│   ├── lower.jpg
│   ├── shirt.jpg
│   ├── pant.jpg
│   ├── socks.jpg
│   └── nikkar.jpg
├── global-nav-jeevan/
├── jjps/
├── kv/
├── nav-jeevan/
├── nd/
└── st-mary/
```

## Step 3: Upload Images

1. Go to: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/buckets/product-images
2. Click **"Upload files"**
3. Upload images for each school folder
4. Image specs:
   - Format: JPG or PNG
   - Recommended size: 600x800 pixels
   - Max file size: 2MB each

## Step 4: Update Database with Real Image URLs

After uploading, run this SQL to update product_images table:

```sql
-- David School Products
UPDATE product_images 
SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/t-shirt.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 't-shirt-david' LIMIT 1);

UPDATE product_images 
SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/lower.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'lower-david' LIMIT 1);

UPDATE product_images 
SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/shirt.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'shirt-david' LIMIT 1);

UPDATE product_images 
SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/pant.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'pant-david' LIMIT 1);

UPDATE product_images 
SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/socks.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'socks-david' LIMIT 1);

UPDATE product_images 
SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/nikkar.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'nikkar-david' LIMIT 1);

-- Common School Products
UPDATE product_images 
SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/common/black-pant.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'black-pant-common' LIMIT 1);

UPDATE product_images 
SET url = 'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/common/blue-nikkar.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'blue-nikkar-common' LIMIT 1);

-- Add more UPDATE statements for other schools...
```

## Step 5: Verify Images Show on Website

After updating URLs, visit:
- https://dressapp-uniforms.netlify.app/schools/david
- https://dressapp-uniforms.netlify.app/schools/common

Images should load from Supabase Storage!

## Quick SQL to Generate All UPDATE Statements

Run this to see all products that need image URLs:

```sql
SELECT 
  p.slug,
  s.name as school_name,
  p.name as product_name,
  'UPDATE product_images SET url = ''https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/' || 
  LOWER(REPLACE(s.name, ' ', '-')) || '/' || 
  LOWER(REPLACE(p.name, ' ', '-')) || '.jpg'' WHERE product_id = (SELECT id FROM products WHERE slug = ''' || p.slug || ''' LIMIT 1);' as sql_command
FROM products p
JOIN categories s ON p.category_id = s.id
ORDER BY s.name, p.name;
```

This will generate UPDATE statements for all 34 products!
