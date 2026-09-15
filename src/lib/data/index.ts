/**
 * Local Data Service
 * Serves real product data from JSON files as fallback when Supabase is not available
 */

import type { School, Product, Category } from '@/types';
import schoolsData from './schools.json';
import categoriesData from './categories.json';
import productsData from './products.json';

// Type-safe imports
const schools: School[] = schoolsData as School[];
const categories: Category[] = categoriesData as Category[];
const products: Product[] = productsData as Product[];

// ─── SCHOOLS ────────────────────────────────────────────────

export function getLocalSchools(limit?: number): School[] {
  let result = schools.filter(s => s.is_active);
  if (limit) result = result.slice(0, limit);
  return result;
}

export function getLocalSchoolBySlug(slug: string): School | null {
  return schools.find(s => s.slug === slug && s.is_active) || null;
}

export function getAllLocalSchools(): School[] {
  return schools;
}

// ─── CATEGORIES ─────────────────────────────────────────────

export function getLocalCategories(): Category[] {
  return categories.filter(c => c.is_active !== false)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getLocalCategoryBySlug(slug: string): Category | null {
  return categories.find(c => c.slug === slug) || null;
}

// ─── PRODUCTS ───────────────────────────────────────────────

export function getLocalProducts(opts?: {
  categorySlug?: string;
  gender?: string;
  search?: string;
  sort?: string;
  onSale?: boolean;
  limit?: number;
  schoolSlug?: string;
}): Product[] {
  let result = products.filter(p => p.is_active);

  // Filter by category
  if (opts?.categorySlug && opts.categorySlug !== 'all') {
    const category = categories.find(c => c.slug === opts.categorySlug);
    if (category) {
      result = result.filter(p => p.category_id === category.id);
    }
  }

  // Filter by school (using category as school)
  if (opts?.schoolSlug) {
    const school = schools.find(s => s.slug === opts.schoolSlug);
    if (school) {
      result = result.filter(p => p.category_id === school.id);
    }
  }

  // Filter by gender
  if (opts?.gender && opts.gender !== 'all') {
    result = result.filter(p => p.gender === opts.gender || p.gender === 'unisex');
  }

  // Search
  if (opts?.search) {
    const searchLower = opts.search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower)
    );
  }

  // Filter on sale
  if (opts?.onSale) {
    result = result.filter(p => p.discount_price !== undefined && p.discount_price !== null);
  }

  // Sort
  if (opts?.sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (opts?.sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (opts?.sort === 'rating') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (opts?.sort === 'newest') {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else {
    result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
  }

  // Limit
  if (opts?.limit) {
    result = result.slice(0, opts.limit);
  }

  return result;
}

export function getLocalProductBySlug(slug: string): Product | null {
  return products.find(p => p.slug === slug) || null;
}

export function getAllLocalProducts(): Product[] {
  return products;
}

export function getLocalProductsForSchool(schoolId: string): Product[] {
  return products.filter(p => p.category_id === schoolId && p.is_active);
}

// ─── STATS ──────────────────────────────────────────────────

export function getLocalStats() {
  return {
    totalSchools: schools.filter(s => s.is_active).length,
    totalCategories: categories.filter(c => c.is_active !== false).length,
    totalProducts: products.filter(p => p.is_active).length,
    totalVariants: products.reduce((sum, p) => sum + (p.variants?.length || 0), 0),
  };
}
