# How to Sync Data to Supabase

## Quick Steps

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/sql
   - Or: Open your Supabase dashboard → SQL Editor

2. **Copy the SQL Script**
   - Open the file: `scripts/SUPABASE_SYNC.sql`
   - Select all (Cmd+A / Ctrl+A)
   - Copy (Cmd+C / Ctrl+C)

3. **Paste and Run**
   - Paste into the Supabase SQL Editor
   - Click **"Run"** button
   - Wait for completion (should take 2-5 seconds)

4. **Verify the Data**
   - The script includes verification queries at the end
   - You should see:
     - 8 Schools
     - 8 Categories
     - 34 Products
     - 34 School-Product Links

## What This Syncs

### Schools (8 total)
- Common (7 products)
- David (9 products)
- Global Nav Jeevan School (2 products)
- JJPS (4 products)
- KV (4 products)
- Nav Jeevan (2 products)
- ND (4 products)
- ST Mary (2 products)

### All Product Data
- Product names, descriptions
- Prices (in paise, so ₹320 = 32000)
- Gender (boys/girls)
- Categories (linked to schools)
- School-product relationships

## After Syncing

1. **Redeploy your site** (if needed):
   ```bash
   netlify deploy --prod
   ```

2. **Test the pages**:
   - https://dressapp-uniforms.netlify.app/schools
   - https://dressapp-uniforms.netlify.app/schools/david
   - https://dressapp-uniforms.netlify.app/schools/jjps

All school pages should now show their products!

## Troubleshooting

### "new row violates row-level security policy"
- This means you need to disable RLS or use the SQL Editor
- The SQL Editor bypasses RLS, so use that method

### "relation does not exist"
- Your Supabase tables might not be created yet
- Check your database schema and create the tables first

### No products showing
- Make sure you ran the entire script, including the school_products insert
- Check the verification queries at the end of the script
