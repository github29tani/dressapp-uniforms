# Complete Supabase Setup Guide

## Step 1: Add Schools and Products

1. **Open Supabase SQL Editor:**
   - https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/sql

2. **Run the main sync script:**
   - Open: `scripts/SUPABASE_SYNC.sql`
   - Copy all content
   - Paste in SQL Editor
   - Click **Run**
   - ✅ This adds: 8 schools, 34 products, categories

---

## Step 2: Add Product Variants and Images

1. **In the same SQL Editor:**
   - Open: `scripts/ADD_VARIANTS_AND_IMAGES.sql`
   - Copy all content
   - Paste in SQL Editor
   - Click **Run**
   - ✅ This adds: ~400 product variants (sizes/colors), 34 product images

---

## What Gets Added

### Product Variants (Sizes & Colors)

**David School:**
- T-Shirt: 8 sizes × 4 colors = 32 variants
- Lower: 8 sizes × 4 colors = 32 variants
- Shirt: 11 sizes = 11 variants
- Pant: 12 sizes = 12 variants
- Socks: 8 sizes = 8 variants
- Girls uniforms (3 products): 11 sizes each = 33 variants
- Nikkar: 7 sizes = 7 variants

**Other Schools:**
- Each product: 11 standard sizes (22-42)

**Total: ~400+ variants across all products**

### Product Images

- Each product gets a placeholder image
- URL format: `https://placehold.co/600x800/...`
- You can replace these with real images later

---

## After Running Both Scripts

### Test the Site

Visit these pages to verify:

1. **David School**: https://dressapp-uniforms.netlify.app/schools/david
   - Should show 9 products
   - All should be "In Stock" (not "Out of Stock")
   - Prices show as ₹320

2. **All Products**: https://dressapp-uniforms.netlify.app/products
   - Should show 34 products with images

3. **Individual Product**: Click any product to see:
   - Size selector dropdown
   - Color selector (if applicable)
   - "Add to Cart" button enabled

---

## Verification Queries

The scripts include verification queries at the end that show:

- ✅ Variant count per product
- ✅ Image count per product
- ✅ Sample variants with sizes/colors
- ✅ Total summary

---

## Replace Placeholder Images (Optional)

To add real product images later:

1. Upload images to Supabase Storage or external CDN
2. Update the `product_images` table:

```sql
UPDATE product_images 
SET url = 'https://your-cdn.com/david-tshirt.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 't-shirt-david');
```

Or add multiple images per product:

```sql
INSERT INTO product_images (product_id, url, alt_text, sort_order)
VALUES (
  (SELECT id FROM products WHERE slug = 't-shirt-david'),
  'https://your-cdn.com/david-tshirt-2.jpg',
  'David T-Shirt alternate view',
  2
);
```

---

## Stock Management

All variants start with **50 units in stock**.

To update stock:

```sql
-- Update specific variant
UPDATE product_variants
SET stock = 25
WHERE sku = 'DAVID-TS-28-B';

-- Update all variants of a product
UPDATE product_variants
SET stock = 100
WHERE product_id = (SELECT id FROM products WHERE slug = 't-shirt-david');
```

---

## Troubleshooting

### Products still show "Out of Stock"
- Make sure you ran `ADD_VARIANTS_AND_IMAGES.sql`
- Verify variants exist: Run the verification queries
- Redeploy: `netlify deploy --prod`

### Images not showing
- Check browser console for errors
- Verify images exist in `product_images` table
- Placeholder images should load automatically

### Wrong prices
- Prices should show as ₹320 (not ₹32,000)
- If wrong, make sure you deployed after the price fix
