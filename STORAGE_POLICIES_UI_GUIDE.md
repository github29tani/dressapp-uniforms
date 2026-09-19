# 🔧 Fix Storage Policies via Supabase UI (Not SQL)

## ⚠️ Important
You **cannot** set storage policies via SQL Editor. You **must** use the Supabase Storage UI.

---

## ⚡ Step-by-Step Fix (2 minutes)

### Step 1: Go to Storage Policies

1. **Open this link**:  
   👉 https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/policies

2. You should see the Storage Policies page

### Step 2: Create Policy for Public Read

1. Click **"New Policy"** button

2. Choose **"For full customization"**

3. Fill in these details:
   - **Policy name**: `Public read access`
   - **Allowed operation**: Select **`SELECT`** only
   - **Target roles**: Select **`public`**
   - **Policy definition**:
     ```
     bucket_id = 'product-images'
     ```

4. Click **"Review"** → **"Save policy"**

### Step 3: Create Policy for Authenticated Upload

1. Click **"New Policy"** again

2. Choose **"For full customization"**

3. Fill in these details:
   - **Policy name**: `Authenticated uploads`
   - **Allowed operation**: Select **`INSERT`** only
   - **Target roles**: Select **`authenticated`**
   - **USING expression**: Leave blank or enter `true`
   - **WITH CHECK expression**:
     ```
     bucket_id = 'product-images'
     ```

4. Click **"Review"** → **"Save policy"**

### Step 4: Create Policy for Authenticated Update

1. Click **"New Policy"** again

2. Choose **"For full customization"**

3. Fill in these details:
   - **Policy name**: `Authenticated updates`
   - **Allowed operation**: Select **`UPDATE`** only
   - **Target roles**: Select **`authenticated`**
   - **USING expression**:
     ```
     bucket_id = 'product-images'
     ```
   - **WITH CHECK expression**:
     ```
     bucket_id = 'product-images'
     ```

4. Click **"Review"** → **"Save policy"**

### Step 5: Create Policy for Authenticated Delete

1. Click **"New Policy"** again

2. Choose **"For full customization"**

3. Fill in these details:
   - **Policy name**: `Authenticated deletes`
   - **Allowed operation**: Select **`DELETE`** only
   - **Target roles**: Select **`authenticated`**
   - **USING expression**:
     ```
     bucket_id = 'product-images'
     ```

4. Click **"Review"** → **"Save policy"**

---

## ✅ Verify Policies Created

You should now see **4 policies** in the Storage Policies list:
1. ✅ Public read access (SELECT, public)
2. ✅ Authenticated uploads (INSERT, authenticated)
3. ✅ Authenticated updates (UPDATE, authenticated)
4. ✅ Authenticated deletes (DELETE, authenticated)

---

## 🧪 Test Upload Now

1. Go to: https://dressapp-uniforms.netlify.app/admin/images
2. Refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Select a product
4. Choose an image file
5. Click "Upload Image"
6. **Should work!** ✅

---

## 🚀 Alternative: Quick Template Method

Instead of "For full customization", you can use templates:

1. Click **"New Policy"**
2. Click **"Get started quickly"**
3. Select **"Enable access to authenticated users only"**
4. Check boxes: **INSERT, UPDATE, DELETE**
5. Click **"Use this template"**
6. Edit the policy to only apply to `product-images` bucket
7. Save

Then create another policy:
1. **"New Policy"** → **"Get started quickly"**
2. Select **"Enable read access to everyone"**
3. Only check: **SELECT**
4. Save

---

## 🔍 What If It Still Doesn't Work?

**Check these:**

1. **Is bucket public?**
   - Go to Storage → Buckets
   - Click on `product-images`
   - Check if "Public bucket" toggle is ON

2. **Are you logged in?**
   - Make sure you're logged into the admin panel
   - Try logging out and back in

3. **Correct bucket name?**
   - Must be exactly: `product-images` (no spaces, lowercase)

4. **Clear cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 📸 Screenshots to Look For

### Storage Policies Page:
- Should show list of policies
- Green "New Policy" button at top

### Policy Creation Form:
- Policy name field
- Allowed operation dropdown (SELECT, INSERT, UPDATE, DELETE)
- Target roles dropdown (public, authenticated, etc.)
- Policy definition text area

---

## 💡 Why SQL Didn't Work

Supabase restricts direct SQL access to the `storage.objects` table for security reasons. You must use the UI to manage storage policies.

---

## ✅ Once Policies Are Set

After creating all 4 policies:
- ✅ Images will show on website (public read)
- ✅ Admins can upload images
- ✅ Admins can replace images
- ✅ Admins can delete images
- ✅ No more "row-level security" errors

**Complete this setup and your image upload will work perfectly!** 🎉
