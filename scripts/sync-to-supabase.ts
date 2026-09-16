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
const products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8'))

async function syncSchools() {
  console.log('\n🏫 Syncing schools...')
  
  // Delete existing data
  await supabase.from('school_products').delete().gte('created_at', '2000-01-01')
  await supabase.from('product_variants').delete().gte('created_at', '2000-01-01')
  await supabase.from('product_images').delete().gte('created_at', '2000-01-01')
  await supabase.from('products').delete().gte('created_at', '2000-01-01')
  await supabase.from('categories').delete().gte('created_at', '2000-01-01')
  await supabase.from('schools').delete().gte('created_at', '2000-01-01')
  
  // Insert schools (without IDs, let Supabase generate UUIDs)
  const schoolsToInsert = schools.map((s: any) => ({
    name: s.name,
    slug: s.slug,
    is_active: s.is_active,
    created_at: s.created_at
  }))
  
  const { data: insertedSchools, error } = await supabase
    .from('schools')
    .insert(schoolsToInsert)
    .select()
  
  if (error) {
    console.error('❌ Error inserting schools:', error.message)
    throw error
  }
  
  console.log(`✅ Inserted ${insertedSchools.length} schools`)
  return insertedSchools
}

async function syncCategories(insertedSchools: any[]) {
  console.log('\n📁 Syncing categories...')
  
  // Create categories from schools
  const categoriesToInsert = insertedSchools.map((s: any) => ({
    name: s.name,
    slug: s.slug,
    is_active: s.is_active,
    sort_order: 0,
    created_at: s.created_at
  }))
  
  const { data: insertedCategories, error } = await supabase
    .from('categories')
    .insert(categoriesToInsert)
    .select()
  
  if (error) {
    console.error('❌ Error inserting categories:', error.message)
    throw error
  }
  
  console.log(`✅ Inserted ${insertedCategories.length} categories`)
  return insertedCategories
}

async function syncProducts(insertedSchools: any[], insertedCategories: any[]) {
  console.log('\n📦 Syncing products...')
  
  // Create a map of old school IDs to new category IDs
  const schoolIdMap = new Map()
  schools.forEach((oldSchool: any, index: number) => {
    const newCategory = insertedCategories.find((c: any) => c.slug === oldSchool.slug)
    if (newCategory) {
      schoolIdMap.set(oldSchool.id, newCategory.id)
    }
  })
  
  // Update products with new category IDs
  const productsToInsert = products.map((p: any) => {
    const newCategoryId = schoolIdMap.get(p.category_id)
    if (!newCategoryId) {
      console.warn(`⚠️  No category found for product ${p.name} (old category_id: ${p.category_id})`)
    }
    return {
      name: p.name,
      slug: p.slug,
      description: p.description,
      category_id: newCategoryId,
      gender: p.gender,
      price: p.price,
      is_active: p.is_active,
      created_at: p.created_at
    }
  }).filter((p: any) => p.category_id) // Only include products with valid category
  
  const { data: insertedProducts, error } = await supabase
    .from('products')
    .insert(productsToInsert)
    .select()
  
  if (error) {
    console.error('❌ Error inserting products:', error.message)
    throw error
  }
  
  console.log(`✅ Inserted ${insertedProducts.length} products`)
  return insertedProducts
}

async function linkSchoolProducts(insertedSchools: any[], insertedProducts: any[]) {
  console.log('\n🔗 Linking schools to products...')
  
  const schoolProductLinks = []
  
  for (const school of insertedSchools) {
    // Find all products that belong to this school (via category)
    const schoolProducts = insertedProducts.filter((p: any) => {
      // Find the category for this product
      const product = products.find((oldP: any) => oldP.slug === p.slug)
      if (!product) return false
      
      // Check if this product's category matches this school
      const oldSchool = schools.find((s: any) => s.id === product.category_id)
      return oldSchool && oldSchool.slug === school.slug
    })
    
    for (const product of schoolProducts) {
      schoolProductLinks.push({
        school_id: school.id,
        product_id: product.id
      })
    }
  }
  
  if (schoolProductLinks.length > 0) {
    const { error } = await supabase
      .from('school_products')
      .insert(schoolProductLinks)
    
    if (error) {
      console.error('❌ Error linking schools to products:', error.message)
      throw error
    }
    
    console.log(`✅ Created ${schoolProductLinks.length} school-product links`)
  }
}

async function main() {
  console.log('🚀 Starting Supabase sync...')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  
  try {
    const insertedSchools = await syncSchools()
    const insertedCategories = await syncCategories(insertedSchools)
    const insertedProducts = await syncProducts(insertedSchools, insertedCategories)
    await linkSchoolProducts(insertedSchools, insertedProducts)
    
    console.log('\n✨ Sync complete!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Schools: ${insertedSchools.length}`)
    console.log(`   - Categories: ${insertedCategories.length}`)
    console.log(`   - Products: ${insertedProducts.length}`)
    
    // Show products per school
    console.log('\n📋 Products per school:')
    for (const school of insertedSchools) {
      const count = insertedProducts.filter((p: any) => {
        const oldProduct = products.find((op: any) => op.slug === p.slug)
        if (!oldProduct) return false
        const oldSchool = schools.find((s: any) => s.id === oldProduct.category_id)
        return oldSchool && oldSchool.slug === school.slug
      }).length
      console.log(`   - ${school.name}: ${count} products`)
    }
  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    process.exit(1)
  }
}

main()
