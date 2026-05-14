import { useMemo } from "react";
import supplementsData from "@/assets/data/supplements.json";

export interface Ingredient {
  name: string;
  dose: string;
  score: number;
  note: string;
  form?: string;
}

export interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  brand: string;
  category: string;
  category_ar: string;
  price: string;
  url: string;
  score: number;
  evidence_level: string;
  recommendation: string;
  ingredients: Ingredient[];
  key_ingredients: string[];
  strengths: string;
  weaknesses: string;
  best_for: string;
  warnings: string | string[];
  food_sources?: string;
  drug_interactions: string;
  serving_size: string;
  servings_per_container: number;
  description: string;
}

export interface Category {
  id: string;
  name_ar: string;
  count: number;
  products: string[];
}

export function useSupplements() {
  const data = supplementsData as any;

  const products: Product[] = useMemo(() => data.products || [], [data]);
  const categories: Category[] = useMemo(
    () => Object.values(data.categories || {}),
    [data]
  );

  function getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
  }

  function getProductsByCategory(categoryId: string): Product[] {
    return products.filter((p) => p.category === categoryId);
  }

  function searchProducts(query: string): Product[] {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name_en.toLowerCase().includes(q) ||
        p.name_ar.includes(query) ||
        p.brand.toLowerCase().includes(q) ||
        p.category_ar.includes(query) ||
        p.key_ingredients.some((i) => i.toLowerCase().includes(q))
    );
  }

  function getTopProducts(limit = 5): Product[] {
    return [...products].sort((a, b) => b.score - a.score).slice(0, limit);
  }

  return {
    products,
    categories,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getTopProducts,
    totalProducts: products.length,
    totalCategories: categories.length,
  };
}

// Category colors mapping
export const CATEGORY_COLORS: Record<string, string> = {
  liver:      "#F59E0B",
  heart:      "#EF4444",
  kidney:     "#8B5CF6",
  brain:      "#3B82F6",
  mood:       "#EC4899",
  vitamins:   "#10B981",
  metabolism: "#F97316",
  prostate:   "#06B6D4",
  longevity:  "#6366F1",
  hormones:   "#84CC16",
  sleep:      "#A78BFA",
  general:    "#64748B",
};

// Category icons mapping
export const CATEGORY_ICONS: Record<string, string> = {
  liver:      "leaf.fill",
  heart:      "heart.fill",
  kidney:     "drop.fill",
  brain:      "brain.head.profile",
  mood:       "sparkles",
  vitamins:   "pills.fill",
  metabolism: "flame.fill",
  prostate:   "shield.fill",
  longevity:  "trophy.fill",
  hormones:   "bolt.fill",
  sleep:      "moon.fill",
  general:    "cross.fill",
};
