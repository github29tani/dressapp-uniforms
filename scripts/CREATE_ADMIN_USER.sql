-- ============================================================================
-- CREATE ADMIN USER
-- NOTE: You CANNOT create auth.users directly via SQL for security reasons
-- Use Supabase Dashboard or API instead
-- ============================================================================

-- This will NOT work:
-- INSERT INTO auth.users (email, encrypted_password) VALUES (...);
-- Error: permission denied for table users

-- ============================================================================
-- ALTERNATIVE: Create user via Supabase Dashboard
-- ============================================================================
-- 1. Go to: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/auth/users
-- 2. Click "Add user" → "Create new user"
-- 3. Email: admin@dressappuniforms.in
-- 4. Password: Admin@123
-- 5. Check "Auto Confirm User"
-- 6. Click "Create user"

-- ============================================================================
-- WORKAROUND: If you have a user already, make them admin
-- ============================================================================

-- If you already signed up via the website, you can find your user ID:
SELECT id, email, created_at, confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Then add them to profiles table as admin (if profiles table has role column):
-- UPDATE profiles SET role = 'admin' WHERE id = 'USER_ID_HERE';

-- ============================================================================
-- VERIFICATION: Check if user exists
-- ============================================================================

-- After creating user via dashboard, verify:
SELECT 
  id,
  email,
  created_at,
  confirmed_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'admin@dressappuniforms.in';

-- Expected result: 1 row with your admin user details

-- ============================================================================
-- TEMPORARY WORKAROUND: Disable email confirmation requirement
-- ============================================================================

-- If you want to allow login without email confirmation:
-- This setting is in: Dashboard → Authentication → Email Auth → 
-- Uncheck "Enable email confirmations"

-- Or update existing user to be confirmed:
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email = 'admin@dressappuniforms.in' 
  AND email_confirmed_at IS NULL;
