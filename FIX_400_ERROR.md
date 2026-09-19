# 🚨 Fix: 400 Bad Request on Image Upload

## The Problem
You're getting a **400 Bad Request** error when uploading images. This is caused by missing or incorrect storage policies.

---

## ✅ **Solution: Run These 2 SQL Queries**

### **Step 1: Check Current Setup**

Run this in **SQL Editor** to see what's configured:

```sql
-- Check if bucket exists and is public
SELECT 
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets
WHERE name = 'product-images';

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- Check existing policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;
```

**Expected results:**
- Bucket `product-images` should exist and `public = true`
- `rowsecurity = true` (RLS is enabled)
- Should show policies you created

---

### **Step 2: Temporarily Disable RLS (Quick Fix)**

If policies aren't working, **temporarily** disable RLS to test:

```sql
-- TEMPORARY: Disable RLS to allow uploads
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning:** This makes storage fully public. Only use for testing!

After this, try uploading again. It should work.

---

### **Step 3: Proper Fix - Create Policies via Dashboard**

Once upload works with RLS disabled, re-enable it and add proper policies:

1. **Go to**: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/policies

2. **Click "New Policy"** for `product-images` bucket

3. **Use "Get started quickly"** template:
   - Select: **"Allow access to authenticated users only"**
   - Check: **INSERT**, **UPDATE**, **DELETE**
   - Click **"Use this template"**

4. **Create another policy**:
   - Click "New Policy"
   - Select: **"Allow read access for all users"**
   - Check: **SELECT**
   - Click **"Use this template"**

5. **Re-enable RLS**:
   ```sql
   ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
   ```

---

## 🔧 **Alternative: Simpler Policy Setup**

If the UI is confusing, just run this SQL to create ALL policies at once:

**IMPORTANT**: Run each CREATE POLICY separately in the **Storage Policies UI**, not SQL Editor!

Go to: Storage → Policies → New Policy → Look for "SQL" or "Custom" option

```sql
-- Policy 1
CREATE POLICY "product_images_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy 2  
CREATE POLICY "product_images_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Policy 3
CREATE POLICY "product_images_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Policy 4
CREATE POLICY "product_images_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

---

## 🧪 **Test After Fix**

1. Go to: https://dressapp-uniforms.netlify.app/admin/images
2. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
3. Select product
4. Upload image
5. Should work now! ✅

---

## 📋 **Quick Checklist**

Before uploading, verify:
- ✅ Bucket `product-images` exists
- ✅ Bucket is marked as **Public**
- ✅ You're logged into admin panel
- ✅ Either RLS is disabled OR 4 policies are created
- ✅ Browser cache cleared

---

## 🆘 **Still Not Working?**

Try the **nuclear option** (fully public bucket):

```sql
-- Make storage.objects fully public (no RLS)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Make bucket public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'product-images';
```

This removes all restrictions. Upload should definitely work.

Later, you can secure it by re-enabling RLS and adding proper policies.

---

## ✅ **Expected Result**

After fix:
- ✅ Upload works from admin panel
- ✅ Images show on website
- ✅ No 400 errors in console
- ✅ Files appear in Supabase Storage dashboard

---

**Start with Step 2 (disable RLS temporarily) to test if that fixes the 400 error!**
