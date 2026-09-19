# Create Admin Account

## Option 1: Sign Up via Website (Easiest)

1. **Go to signup page**: https://dressapp-uniforms.netlify.app/signup

2. **Create account with:**
   - Email: your-email@example.com
   - Password: your-secure-password
   - Full name: Admin User

3. **Check your email** for verification link (check spam folder)

4. **Click verification link** to activate account

5. **Go to login**: https://dressapp-uniforms.netlify.app/login

6. **Login** with your email and password

7. **Now go to**: https://dressapp-uniforms.netlify.app/admin/images

---

## Option 2: Create User Directly in Supabase (Faster)

1. **Go to Supabase Authentication**:  
   👉 https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/auth/users

2. **Click "Add user"** → **"Create new user"**

3. **Enter details**:
   - Email: `admin@dressappuniforms.in` (or your email)
   - Password: `Admin@123` (or your password)
   - ✅ Check "Auto Confirm User" (skip email verification)

4. **Click "Create user"**

5. **Now login at**: https://dressapp-uniforms.netlify.app/login
   - Email: `admin@dressappuniforms.in`
   - Password: `Admin@123`

---

## Option 3: Use SQL to Create User

Run this in **Supabase SQL Editor**:

```sql
-- This won't work directly, use Option 2 instead
-- Supabase requires using the dashboard or API to create auth users
```

---

## Recommended: Option 2 (Supabase Dashboard)

This is the fastest way:
1. Open: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/auth/users
2. Click "Add user"
3. Email: `admin@dressappuniforms.in`
4. Password: `YourSecurePassword123!`
5. Check "Auto Confirm User"
6. Create

Then login at: https://dressapp-uniforms.netlify.app/login

---

## After Login:

Once logged in, go to:
- **Admin Panel**: https://dressapp-uniforms.netlify.app/admin
- **Upload Images**: https://dressapp-uniforms.netlify.app/admin/images

---

## Test Credentials (if you create via dashboard):

```
Email: admin@dressappuniforms.in
Password: Admin@123
```

(You can change these in Supabase Auth dashboard)
