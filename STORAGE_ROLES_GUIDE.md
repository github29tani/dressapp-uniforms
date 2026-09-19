# Supabase Storage Policies - Available Roles

## 🎭 **Available Roles for Storage Policies**

When creating storage policies in Supabase, you can assign them to these roles:

### **1. `public` or `anon`**
- **Who**: Anyone (not logged in)
- **Use for**: Public file access (images, downloads)
- **Example**: Product images that anyone can view

### **2. `authenticated`**
- **Who**: Logged in users only
- **Use for**: User-specific uploads, protected files
- **Example**: User profile photos, admin uploads

### **3. `service_role`**
- **Who**: Backend/server with service role key
- **Use for**: Server-side operations that bypass RLS
- **Example**: API routes, background jobs

### **4. `postgres`**
- **Who**: Database owner (superuser)
- **Use for**: Database administration
- **Not recommended**: For app-level policies

---

## 📋 **Policies You Need for product-images Bucket**

### **Policy 1: Public Read (SELECT)**
```
Target role: public
Operation: SELECT
Expression: bucket_id = 'product-images'
```
**Purpose**: Let anyone view/download images

### **Policy 2: Authenticated Insert (INSERT)**
```
Target role: authenticated
Operation: INSERT
Expression: bucket_id = 'product-images'
```
**Purpose**: Let logged-in admins upload images

### **Policy 3: Authenticated Update (UPDATE)**
```
Target role: authenticated
Operation: UPDATE
Expression: bucket_id = 'product-images'
```
**Purpose**: Let admins replace images

### **Policy 4: Authenticated Delete (DELETE)**
```
Target role: authenticated
Operation: DELETE
Expression: bucket_id = 'product-images'
```
**Purpose**: Let admins remove images

---

## ✅ **Quick Setup in Dashboard**

1. **Go to Storage Policies**:  
   https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/storage/policies

2. **For each policy above, click "New Policy"**

3. **Fill in**:
   - Policy name: (e.g., "public_read")
   - Allowed operation: (e.g., SELECT)
   - Target roles: Select from dropdown (e.g., `public`)
   - Policy definition: `bucket_id = 'product-images'`

4. **Save**

---

## 🔍 **Check Current Policies (Run SQL)**

```sql
-- See all existing storage policies
SELECT 
  policyname,
  cmd as operation,
  roles,
  qual as expression
FROM pg_policies 
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;
```

---

## 🚨 **Common Issues**

### **Images show 400 error**
**Cause**: Missing `public` SELECT policy  
**Fix**: Create policy for `public` role with SELECT operation

### **Upload fails with RLS error**
**Cause**: Missing `authenticated` INSERT policy  
**Fix**: Create policy for `authenticated` role with INSERT operation

### **Can't delete images**
**Cause**: Missing `authenticated` DELETE policy  
**Fix**: Create policy for `authenticated` role with DELETE operation

---

## ✅ **Verify Roles Available**

Run this SQL to see all roles:

```sql
SELECT rolname FROM pg_roles ORDER BY rolname;
```

You should see:
- `anon` or `public`
- `authenticated` 
- `service_role`
- `postgres`
- Others (system roles)

---

## 🎯 **For Your Use Case (Product Images)**

Use these roles:
1. **public** - for viewing images (SELECT)
2. **authenticated** - for admin uploads (INSERT, UPDATE, DELETE)

The roles are **case-sensitive** and must match exactly!
