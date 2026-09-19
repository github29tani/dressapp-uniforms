# ✅ Product Image Upload - Complete Guide

## 🎯 What's New

You can now upload product images **directly from your website** without manually editing database or storage!

## 📍 Access the Image Upload Page

**Admin Image Upload**: https://dressapp-uniforms.netlify.app/admin/images

Or navigate: **Admin Dashboard** → Click **"Images"** button

## 🚀 Before You Start: Setup Supabase Storage (One-time setup)

### Step 1: Create Storage Bucket

1. Go to: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/buckets
2. Click **"New bucket"**
3. Settings:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **YES** (must check this!)
   - Click **"Create bucket"**

### Step 2: Set Upload Permissions

1. Click on the `product-images` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"** → **"For full customization"**

Create these 3 policies:

**Policy 1: Allow Authenticated Upload**
- Policy name: `Allow authenticated uploads`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- Policy definition:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

**Policy 2: Allow Authenticated Update**
- Policy name: `Allow authenticated updates`
- Allowed operation: `UPDATE`
- Target roles: `authenticated`
- Policy definition:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

**Policy 3: Allow Authenticated Delete**
- Policy name: `Allow authenticated delete`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- Policy definition:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

## 📸 How to Upload Images

### Step 1: Navigate to Image Upload Page

1. Go to https://dressapp-uniforms.netlify.app/admin
2. Click **"Images"** button in the navigation
3. You'll see the upload form

### Step 2: Select Product

1. Click the dropdown under **"Select Product"**
2. Choose the product you want to upload an image for
3. You'll see the current image if one exists

### Step 3: Choose Image File

1. Click the upload area **OR** drag and drop an image
2. Supported formats: **JPG, PNG, WebP**
3. Max file size: **5MB**
4. Recommended size: **600x800 pixels**
5. Preview will appear after selecting

### Step 4: Upload

1. Click **"Upload Image"** button
2. Wait for upload to complete (shows loading spinner)
3. Success message appears when done
4. Image is automatically:
   - ✅ Uploaded to Supabase Storage
   - ✅ Linked to the product in database
   - ✅ Visible on the website immediately

## 📁 Where Images are Stored

Images are automatically organized by school in Supabase Storage:

```
product-images/
├── common/
│   └── black-pant-1234567890.jpg
├── david/
│   ├── t-shirt-1234567890.jpg
│   └── pant-1234567890.jpg
├── kv/
├── jjps/
└── ...
```

## ✅ Current Status

**Live Site**: https://dressapp-uniforms.netlify.app

**Database Status**:
- ✅ 8 schools synced
- ✅ 34 products synced
- ✅ 374 product variants (sizes 22-42, stock=50)
- ✅ 30 products have real images
- ⏳ 4 products need images:
  - David Girls I-V
  - David Girls IX-XII
  - David Girls VI-VIII
  - Global Nav Jeevan: Pant, Shirt

## 🎨 Image Guidelines

### Best Practices:
- **Use high-quality photos** of actual products
- **White or light background** works best
- **Product should fill 70-80%** of the frame
- **Good lighting** - no shadows
- **Sharp focus** - not blurry
- **Portrait orientation** (vertical) preferred

### Technical Specs:
- Format: JPG (best for photos), PNG (for transparent backgrounds)
- Dimensions: 600x800 pixels recommended
- File size: Under 2MB for best performance
- Color space: sRGB
- Resolution: 72 DPI for web

## 🔧 Troubleshooting

### "Failed to upload image" error

**Causes:**
1. Storage bucket not created
2. Upload policies not set
3. Not logged in to admin panel
4. File too large (>5MB)

**Solutions:**
1. Follow "Setup Supabase Storage" steps above
2. Make sure bucket is **Public**
3. Log in to admin panel first
4. Compress image if too large

### Image uploaded but not showing on website

**Solutions:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Wait 1-2 minutes for CDN to update
4. Check if image shows in Supabase Storage

### Can't see upload button

**Solutions:**
1. Make sure you're on: `/admin/images`
2. Log in to admin panel
3. Clear browser cache and refresh

## 📊 Admin Panel Navigation

From **Admin Dashboard** (https://dressapp-uniforms.netlify.app/admin):

- **Products** - Manage products, prices, variants
- **Images** - Upload product images ← NEW!
- **Schools** - Manage schools and details
- **Orders** - View and manage orders
- **Inventory** - Track stock levels
- **Customers** - View customer information

## 🎉 Benefits of Website Upload

✅ **Easy** - No SQL knowledge needed  
✅ **Fast** - Upload in seconds  
✅ **Safe** - Automatic file naming and organization  
✅ **Live** - Images appear immediately after upload  
✅ **Preview** - See before you upload  
✅ **Replace** - Upload new image to replace old one  

## 📝 Next Steps

1. **Setup Storage Bucket** (one-time, follow steps above)
2. **Upload images** for your 34 products
3. **Test** by visiting product pages
4. **Share** website with customers!

---

**Need Help?**
- Check `scripts/SETUP_STORAGE_BUCKET.md` for detailed storage setup
- Check `scripts/UPDATE_IMAGE_URLS.sql` for manual database updates
- All product data from Excel is already synced ✅
