# Setup Supabase Storage Bucket for Product Images

## Step 1: Create Storage Bucket

1. Go to: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/buckets

2. Click **"New bucket"**

3. Configure the bucket:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **YES** (check this box)
   - Click **"Create bucket"**

## Step 2: Set Storage Policies (Allow Upload from Website)

After creating the bucket, you need to set policies to allow uploads from the admin panel.

1. Click on the `product-images` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. Choose **"For full customization"**

### Policy 1: Allow Public Read (Already set when creating public bucket)

If not already set:
- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**:
  ```sql
  bucket_id = 'product-images'
  ```

### Policy 2: Allow Authenticated Upload

- **Policy name**: `Allow authenticated uploads`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

### Policy 3: Allow Authenticated Update

- **Policy name**: `Allow authenticated updates`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

### Policy 4: Allow Authenticated Delete

- **Policy name**: `Allow authenticated delete`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

## Step 3: Test Upload

1. Go to your admin panel: https://dressapp-uniforms.netlify.app/admin/images
2. Select a product
3. Choose an image file
4. Click "Upload Image"
5. Check if the image appears in Supabase Storage and on the product page

## Storage Structure

Images will be organized by school:
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

## Image Requirements

- **Formats**: JPG, PNG, WebP
- **Max size**: 5MB per file
- **Recommended size**: 600x800 pixels
- **Quality**: High quality for best display

## Troubleshooting

### "Failed to upload image" Error
- Check if bucket is public
- Verify storage policies are set correctly
- Make sure you're logged in to the admin panel

### Images not showing on website
- Clear browser cache
- Redeploy site: `netlify deploy --prod`
- Check if image URL in database matches Storage URL

### Storage quota exceeded
- Check your Supabase plan limits
- Delete old/unused images from Storage
- Consider upgrading your Supabase plan
