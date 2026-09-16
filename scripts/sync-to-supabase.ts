/**
 * Sync local JSON data to Supabase database
 * Run with: npx tsx scripts/sync-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read local data
const dataDir = path.join(process.cwd(), 'src/lib/data')
const schools = JSON.parse(fs.readFileSync(path.join(dataDir, 'schools.json'), 'utf-8'))
const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf-8'))
const products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8'))

async function syncSchools() {
  console.log('\n🏫 Syncing schools...')
  
  // Delete existing schools
  const { error: deleteError } = await supabase.from('schools').delete().neq('id', 'none')
  if (deleteError) {
    console.warn('⚠️  Could not delete existing schools:', deleteError.message)
  }
  
  // Insert new schools
  const { data, error } = await supabase.from('schools').insert(schools).select()
  if (error) {
    console.error('❌ Error inserting schools:', error.message)
    return
  }
  console.log(`✅ Synced ${schools.length} schools`)
}

async function syncCategories() {
  console.log('\n📁 Syncing categories...')
  
  // Delete existing categories
  const { error: deleteError } = await supabase.from('categories').delete().neq('id', 'none')
  if (deleteError) {
    console.warn('⚠️  Could not delete existing categories:', deleteError.message)
  }
  
  // Insert new categories
  const { data, error } = await supabase.from('categories').insert(categories).select()
  if (error) {
    console.error('❌ Error inserting categories:', error.message)
    return
  }
  console.log(`✅ Synced ${categories.length} categories`)
}

async function syncProducts() {
  console.log('\n📦 Syncing products...')
  
  // Delete existing products
  const { error: deleteError } = await supabase.from('products').delete().neq('id', 'none')
  if (deleteError) {
    console.warn('⚠️  Could not delete existing products:', deleteError.message)
  }
  
  // Insert new products
  const { data, error } = await supabase.from('products').insert(products).select()
  if (error) {
    console.error('❌ Error inserting products:', error.message)
    return
  }
  console.log(`✅ Synced ${products.length} products`)
}

async function main() {
  console.log('🚀 Starting Supabase sync...')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  
  try {
    await syncSchools()
    await syncCategories()
    await syncProducts()
    
    console.log('\n✨ Sync complete!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Schools: ${schools.length}`)
    console.log(`   - Categories: ${categories.length}`)
    console.log(`   - Products: ${products.length}`)
  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    process.exit(1)
  }
}

main()
