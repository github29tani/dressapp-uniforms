# How to Upload Product Images to Supabase

## Step 1: Create Storage Bucket

1. **Open Supabase Storage:**
   - https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/buckets

2. **Create a new bucket:**
   - Click **"New bucket"**
   - Name: `product-images`
   - Public bucket: **YES** (so images are accessible)
   - Click **"Create bucket"**

---

## Step 2: Upload Product Images

### Option A: Upload via Supabase Dashboard (Easy)

1. **Click on `product-images` bucket**

2. **Create folders** (optional, for organization):
   - `david/`
   - `jjps/`
   - `kv/`
   - etc.

3. **Upload images:**
   - Click **"Upload"**
   - Select your product images
   - Files should be named clearly: `t-shirt.jpg`, `pant.jpg`, etc.

### Option B: Upload via API (Programmatic)

Use this Node.js script (save as `upload-images.ts`):

```typescript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function uploadImage(filePath: string, bucketPath: string) {
  const fileBuffer = fs.readFileSync(filePath)
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(bucketPath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })
  
  if (error) {
    console.error('Error uploading:', error)
  } else {
    console.log('Uploaded:', bucketPath)
  }
}

// Example usage
uploadImage('./images/david-tshirt.jpg', 'david/t-shirt.jpg')
```

---

## Step 3: Link Images to Products in Database

After uploading, you need to add the image URLs to the `product_images` table.

### Get the Public URL Format

Supabase public URLs follow this pattern:
```
https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/t-shirt.jpg
```

### Add Images to Database

Run this SQL in Supabase SQL Editor:

```sql
-- Add image for David T-Shirt
INSERT INTO product_images (product_id, url, alt_text, sort_order)
VALUES (
  (SELECT id FROM products WHERE slug = 't-shirt-david'),
  'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/t-shirt.jpg',
  'David School T-Shirt',
  1
);

-- Add image for David Lower
INSERT INTO product_images (product_id, url, alt_text, sort_order)
VALUES (
  (SELECT id FROM products WHERE slug = 'lower-david'),
  'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/lower.jpg',
  'David School Lower',
  1
);

-- Repeat for all products...
```

### Bulk Insert Template

Or use this template to insert all at once:

```sql
-- Delete placeholder images first (optional)
DELETE FROM product_images;

-- Insert all real images
INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT 
  p.id,
  'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/' || c.slug || '/' || REPLACE(p.slug, '-' || c.slug, '') || '.jpg',
  p.name || ' - ' || c.name,
  1
FROM products p
JOIN categories c ON c.id = p.category_id;
```

---

## Step 4: Add Multiple Images Per Product

To add multiple views/angles:

```sql
-- Add 3 images for David T-Shirt
INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 't-shirt-david'), 
   'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/t-shirt-front.jpg',
   'David T-Shirt - Front View', 1),
  ((SELECT id FROM products WHERE slug = 't-shirt-david'),
   'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/t-shirt-back.jpg',
   'David T-Shirt - Back View', 2),
  ((SELECT id FROM products WHERE slug = 't-shirt-david'),
   'https://iweetmduezfpobczrjiz.supabase.co/storage/v1/object/public/product-images/david/t-shirt-side.jpg',
   'David T-Shirt - Side View', 3);
```

---

## Quick Setup Script

For now, to make products work immediately, run this to add placeholder images:

```sql
-- Add placeholder images for all products
INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT 
  id,
  'https://placehold.co/600x800/e0e7ff/1e40af?text=' || REPLACE(name, ' ', '+'),
  'Placeholder for ' || name,
  1
FROM products
WHERE id NOT IN (SELECT product_id FROM product_images);
```

---

## Image Requirements

**Recommended specs:**
- Format: JPEG or PNG
- Size: 800x1000px (portrait) or 1000x800px (landscape)
- Quality: 80-85% JPEG compression
- Max file size: 500KB per image
- Background: White or transparent

**Naming convention:**
```
school-slug/product-type.jpg
```

Examples:
- `david/t-shirt.jpg`
- `david/pant.jpg`
- `jjps/shirt-front.jpg`
- `jjps/shirt-back.jpg`

---

## Verification

After adding images, verify they're working:

```sql
-- Check all products have images
SELECT p.name, COUNT(pi.id) as image_count
FROM products p
LEFT JOIN product_images pi ON pi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY image_count, p.name;

-- View all image URLs
SELECT p.name, pi.url, pi.sort_order
FROM products p
JOIN product_images pi ON pi.product_id = p.id
ORDER BY p.name, pi.sort_order;
```

---

## Troubleshooting

### Images not showing on website
1. Check bucket is **public**
2. Verify URL is correct (copy-paste in browser)
3. Check CORS settings in Supabase Storage
4. Redeploy website: `netlify deploy --prod`

### Storage bucket not found
1. Make sure bucket is named exactly `product-images`
2. Check bucket permissions (should be public)

### Upload fails
1. Check file size (< 5MB)
2. Verify you have write permissions
3. Try uploading via dashboard first
