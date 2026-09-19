# 🚨 QUICK FIX: "Row-level security policy" Error

## What Happened
You created the `product-images` bucket, but it needs **upload permissions** to allow the admin panel to upload images.

## ⚡ Fix in 2 Steps

### Step 1: Run This SQL

1. **Go to Supabase SQL Editor**:  
   👉 https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/sql

2. **Click "New Query"**

3. **Copy & Paste this SQL**:

```sql
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow PUBLIC READ (so images show on website)
CREATE POLICY "Allow public read access to product-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow AUTHENTICATED UPLOAD (so admin can upload)
CREATE POLICY "Allow authenticated uploads to product-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow AUTHENTICATED UPDATE
CREATE POLICY "Allow authenticated updates to product-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Allow AUTHENTICATED DELETE
CREATE POLICY "Allow authenticated deletes from product-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

4. **Click "Run"**

5. **Done!** ✅

### Step 2: Test Upload

1. Go back to: https://dressapp-uniforms.netlify.app/admin/images
2. Refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Select a product
4. Choose an image
5. Click "Upload Image"
6. Should work now! ✅

## What These Policies Do

1. **Public Read** - Anyone can view images on the website
2. **Authenticated Upload** - Logged-in admins can upload images
3. **Authenticated Update** - Admins can replace images
4. **Authenticated Delete** - Admins can remove images

## Alternative: Use Supabase Dashboard UI

If you prefer clicking instead of SQL:

1. Go to: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/buckets/product-images
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Click **"Get started quickly"**
5. Choose **"Allow access to authenticated users only"**
6. For operations, select: **INSERT, UPDATE, DELETE**
7. Click **"Review"** → **"Save policy"**
8. Create another policy for **SELECT** with **public** access

## Verify It Works

After running SQL, you should see:
- ✅ No more "row-level security" error
- ✅ Image uploads work from admin panel
- ✅ Images show on website

## Still Not Working?

**Check these:**
1. Is the bucket name exactly `product-images`? (no spaces, no capitals)
2. Is the bucket marked as **Public**?
3. Did you run the SQL successfully? (should say "Success" at bottom)
4. Are you logged in to the admin panel?
5. Try logging out and back in

**Need help?** 
- The full SQL script is in: `scripts/FIX_STORAGE_POLICIES.sql`
- Complete guide is in: `IMAGE_UPLOAD_COMPLETE_GUIDE.md`
