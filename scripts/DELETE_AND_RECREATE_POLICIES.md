# 🚨 Fix: "new row violates row-level security policy"

## The Problem
The policies exist but they're blocking uploads. We need to delete them and recreate with correct rules.

---

## ✅ **Solution: Delete Old Policies and Recreate**

### **Step 1: Delete Existing Policies**

Go to: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/policies

Find these 4 policies under **product-images** and **delete each one**:
1. Public read access - Click ⋮ → Delete
2. Authenticated uploads - Click ⋮ → Delete
3. Authenticated updates - Click ⋮ → Delete
4. Authenticated deletes - Click ⋮ → Delete

---

### **Step 2: Recreate with Correct Rules**

After deleting, create 4 new policies using the form:

#### **Policy 1: Public Read**
- Click **"New Policy"** → **"For full customization"**
- Policy name: `public_select`
- Allowed operation: Check **SELECT** only
- Target roles: Check **public**
- Policy definition (USING expression):
  ```sql
  bucket_id = 'product-images'
  ```
- Click **"Review"** → **"Save"**

#### **Policy 2: Authenticated Insert**
- Click **"New Policy"** → **"For full customization"**
- Policy name: `authenticated_insert`
- Allowed operation: Check **INSERT** only
- Target roles: Check **authenticated**
- WITH CHECK expression:
  ```sql
  bucket_id = 'product-images'
  ```
- Click **"Review"** → **"Save"**

#### **Policy 3: Authenticated Update**
- Click **"New Policy"** → **"For full customization"**
- Policy name: `authenticated_update`
- Allowed operation: Check **UPDATE** only
- Target roles: Check **authenticated**
- USING expression:
  ```sql
  bucket_id = 'product-images'
  ```
- WITH CHECK expression:
  ```sql
  bucket_id = 'product-images'
  ```
- Click **"Review"** → **"Save"**

#### **Policy 4: Authenticated Delete**
- Click **"New Policy"** → **"For full customization"**
- Policy name: `authenticated_delete`
- Allowed operation: Check **DELETE** only
- Target roles: Check **authenticated**
- USING expression:
  ```sql
  bucket_id = 'product-images'
  ```
- Click **"Review"** → **"Save"**

---

## ⚡ **Alternative: Use Templates (Easier)**

Instead of manual creation, use Supabase templates:

### **For SELECT (Read):**
1. New Policy → Templates
2. Find: **"Allow access to JPG images in a public folder to anonymous users"**
3. Modify the SQL to:
   ```sql
   CREATE POLICY "public_select_product_images"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'product-images');
   ```
4. Use template

### **For INSERT (Upload):**
1. New Policy → Templates  
2. Find: **"Give users access to a folder only to authenticated users"**
3. Modify to:
   ```sql
   CREATE POLICY "authenticated_insert_product_images"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'product-images');
   ```
4. Use template

### **For UPDATE:**
```sql
CREATE POLICY "authenticated_update_product_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');
```

### **For DELETE:**
```sql
CREATE POLICY "authenticated_delete_product_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

---

## 🧪 **After Recreating All 4 Policies:**

1. **Make sure you're logged in**: https://dressapp-uniforms.netlify.app/login
2. **Go to upload page**: https://dressapp-uniforms.netlify.app/admin/images
3. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. **Try upload again**
5. **Should work!** ✅

---

## 🔍 **Why This Happens:**

The old policies might have had incorrect expressions like:
- `(storage.foldername(name))[1] = 'something'` (too restrictive)
- `auth.uid() = owner` (doesn't apply to new files)
- Missing `bucket_id` check

The new policies simply check:
- ✅ Is it in the `product-images` bucket?
- ✅ Is user authenticated (for write operations)?

That's it! No complex folder checks.

---

## ✅ **Checklist:**

Before testing:
- [ ] Deleted all 4 old policies
- [ ] Created 4 new policies with simple `bucket_id` check
- [ ] Bucket is set to Public
- [ ] Logged in to admin panel
- [ ] Hard refreshed the page

**Delete the old policies and recreate them with the simple rules above!** 🚀
