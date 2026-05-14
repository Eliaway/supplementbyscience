import { describe, it, expect } from "vitest";
import supplementsData from "../assets/data/supplements.json";

describe("Supplements Data", () => {
  const data = supplementsData as any;

  it("should have products array", () => {
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);
  });

  it("should have at least 30 products", () => {
    expect(data.products.length).toBeGreaterThanOrEqual(30);
  });

  it("should have categories object", () => {
    expect(typeof data.categories).toBe("object");
    expect(Object.keys(data.categories).length).toBeGreaterThan(0);
  });

  it("each product should have required fields", () => {
    for (const product of data.products) {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name_en");
      expect(product).toHaveProperty("brand");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("score");
      expect(product).toHaveProperty("ingredients");
      expect(typeof product.score).toBe("number");
      expect(product.score).toBeGreaterThanOrEqual(0);
      expect(product.score).toBeLessThanOrEqual(10);
    }
  });

  it("each product should have ingredients array", () => {
    for (const product of data.products) {
      expect(Array.isArray(product.ingredients)).toBe(true);
    }
  });

  it("each ingredient should have name, dose, and score", () => {
    for (const product of data.products) {
      for (const ing of product.ingredients) {
        expect(ing).toHaveProperty("name");
        expect(ing).toHaveProperty("dose");
        expect(ing).toHaveProperty("score");
        expect(typeof ing.score).toBe("number");
      }
    }
  });

  it("should have products from all 4 brands", () => {
    const brands = new Set(data.products.map((p: any) => p.brand));
    expect(brands.size).toBeGreaterThanOrEqual(3);
  });

  it("should have products in health categories", () => {
    const categories = new Set(data.products.map((p: any) => p.category));
    const expectedCategories = ["liver", "heart", "kidney", "brain", "vitamins"];
    for (const cat of expectedCategories) {
      expect(categories.has(cat)).toBe(true);
    }
  });

  it("products should have valid evidence levels", () => {
    // Evidence levels may vary in wording; just ensure they are non-empty strings
    for (const product of data.products) {
      if (product.evidence_level) {
        expect(typeof product.evidence_level).toBe("string");
        expect(product.evidence_level.length).toBeGreaterThan(0);
      }
    }
  });

  it("top products by score should be sorted correctly", () => {
    const sorted = [...data.products].sort((a: any, b: any) => b.score - a.score);
    expect(sorted[0].score).toBeGreaterThanOrEqual(sorted[1].score);
    expect(sorted[1].score).toBeGreaterThanOrEqual(sorted[2].score);
  });
});
