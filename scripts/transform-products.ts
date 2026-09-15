import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Product, School, ProductVariant, ProductImage, Category } from '../src/types';

interface ExcelProduct {
  'Product Name': string;
  'Category': string;
  'Tags': string;
  'Brand': string;
  'Colours'?: string;
  'Sizes'?: string;
  'Product Type': string;
  'Price (₹)'?: string;
  'Status': string;
  'Image URL': string;
}

// Read the JSON data
const rawData: ExcelProduct[] = JSON.parse(
  readFileSync(join(__dirname, '../products-data.json'), 'utf-8')
);

// Helper functions
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function parsePrice(priceStr?: string): number {
  if (!priceStr) return 0;
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  return Math.round(num * 100); // Convert to paise
}

function determineGender(tags: string): 'boys' | 'girls' | 'unisex' {
  const lower = tags.toLowerCase();
  if (lower.includes('boys')) return 'boys';
  if (lower.includes('girls')) return 'girls';
  return 'unisex';
}

// Extract unique schools/categories
const schoolsMap = new Map<string, School>();
const categoriesMap = new Map<string, Category>();

rawData.forEach((item) => {
  // Skip trash items
  if (item.Status === 'trash') return;

  const categories = item.Category.split(',').map(c => c.trim());
  
  categories.forEach((schoolName) => {
    if (!schoolsMap.has(schoolName)) {
      const schoolId = generateId();
      schoolsMap.set(schoolName, {
        id: schoolId,
        name: schoolName,
        slug: slugify(schoolName),
        is_active: true,
        created_at: new Date().toISOString(),
      });
      
      // Also create as category
      categoriesMap.set(schoolName, {
        id: schoolId,
        name: schoolName,
        slug: slugify(schoolName),
        sort_order: Array.from(schoolsMap.keys()).length,
        is_active: true,
        created_at: new Date().toISOString(),
      });
    }
  });
});

// Transform products
const products: Product[] = [];
const variants: ProductVariant[] = [];
const images: ProductImage[] = [];

rawData.forEach((item, index) => {
  // Skip trash items
  if (item.Status === 'trash') return;

  const productId = generateId();
  const price = parsePrice(item['Price (₹)']);
  const firstCategory = item.Category.split(',')[0].trim();
  const category = categoriesMap.get(firstCategory);
  
  // Create product
  const product: Product = {
    id: productId,
    name: item['Product Name'],
    slug: `${slugify(item['Product Name'])}-${slugify(firstCategory)}-${index}`,
    description: `${item['Product Name']} for ${item.Category}. ${item.Tags}`,
    category_id: category?.id,
    gender: determineGender(item.Tags),
    price: price,
    is_active: item.Status === 'publish',
    created_at: new Date().toISOString(),
    images: [],
    variants: [],
  };

  // Create variants from sizes
  const sizes = item.Sizes ? item.Sizes.split(',').map(s => s.trim()) : ['One Size'];
  const colors = item.Colours ? item.Colours.split(',').map(c => c.trim()) : [];

  if (colors.length > 0) {
    // Create variants for each size-color combination
    colors.forEach((color) => {
      sizes.forEach((size) => {
        const variant: ProductVariant = {
          id: generateId(),
          product_id: productId,
          size: `${size} - ${color}`,
          price: price,
          stock: 100, // Default stock
          created_at: new Date().toISOString(),
        };
        variants.push(variant);
        product.variants.push(variant);
      });
    });
  } else {
    // Create variants for each size only
    sizes.forEach((size) => {
      const variant: ProductVariant = {
        id: generateId(),
        product_id: productId,
        size: size,
        price: price,
        stock: 100, // Default stock
        created_at: new Date().toISOString(),
      };
      variants.push(variant);
      product.variants.push(variant);
    });
  }

  // Create placeholder image
  const image: ProductImage = {
    id: generateId(),
    product_id: productId,
    url: `/images/products/placeholder-${slugify(item['Product Name'])}.jpg`,
    alt_text: item['Product Name'],
    sort_order: 0,
    created_at: new Date().toISOString(),
  };
  images.push(image);
  product.images.push(image);

  products.push(product);
});

// Save all data
const outputDir = join(__dirname, '../src/lib/data');

writeFileSync(
  join(outputDir, 'schools.json'),
  JSON.stringify(Array.from(schoolsMap.values()), null, 2)
);

writeFileSync(
  join(outputDir, 'categories.json'),
  JSON.stringify(Array.from(categoriesMap.values()), null, 2)
);

writeFileSync(
  join(outputDir, 'products.json'),
  JSON.stringify(products, null, 2)
);

writeFileSync(
  join(outputDir, 'variants.json'),
  JSON.stringify(variants, null, 2)
);

writeFileSync(
  join(outputDir, 'images.json'),
  JSON.stringify(images, null, 2)
);

// Summary
console.log('✅ Data transformation complete!');
console.log(`📊 Schools: ${schoolsMap.size}`);
console.log(`📊 Categories: ${categoriesMap.size}`);
console.log(`📊 Products: ${products.length}`);
console.log(`📊 Variants: ${variants.length}`);
console.log(`📊 Images: ${images.length}`);
console.log('\nFiles created in src/lib/data/:');
console.log('  - schools.json');
console.log('  - categories.json');
console.log('  - products.json');
console.log('  - variants.json');
console.log('  - images.json');
