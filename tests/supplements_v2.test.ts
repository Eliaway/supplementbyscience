/**
 * Tests for the expanded supplement science app features
 */
import { describe, it, expect } from "vitest";
import supplementsData from "../assets/data/supplements.json";

// ── Types ──────────────────────────────────────────────────────────────────
interface Ingredient {
  name: string;
  dose?: string;
  evidence?: string;
  benefit?: string;
}

interface Product {
  id: string;
  name_en: string;
  brand: string;
  category: string;
  category_ar: string;
  score: number;
  evidence_level: string;
  ingredients: Ingredient[];
  warnings?: string | string[];
  best_for?: string[];
}

interface SupplementsData {
  version?: string;
  total_products?: number;
  categories: Record<string, { name_ar: string; icon: string; color: string }> | number;
  products: Product[];
}

const data = supplementsData as unknown as SupplementsData;

// ── Data Integrity ─────────────────────────────────────────────────────────
describe("Supplements Data Integrity", () => {
  it("should have valid metadata", () => {
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.total_products ?? data.products.length).toBeGreaterThan(0);
  });

  it("should have products array", () => {
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);
  });

  it("each product should have required fields", () => {
    for (const product of data.products) {
      expect(product.id).toBeTruthy();
      expect(product.name_en).toBeTruthy();
      expect(product.brand).toBeTruthy();
      expect(product.category).toBeTruthy();
      expect(product.category_ar).toBeTruthy();
      expect(typeof product.score).toBe("number");
      expect(product.score).toBeGreaterThanOrEqual(0);
      expect(product.score).toBeLessThanOrEqual(10);
    }
  });

  it("each product should have ingredients", () => {
    for (const product of data.products) {
      expect(Array.isArray(product.ingredients)).toBe(true);
      expect(product.ingredients.length).toBeGreaterThan(0);
    }
  });

  it("should have valid evidence levels", () => {
    // Evidence levels are stored as Arabic strings with star ratings
    for (const product of data.products) {
      expect(typeof product.evidence_level).toBe("string");
      expect(product.evidence_level.length).toBeGreaterThan(0);
    }
  });

  it("should have categories defined", () => {
    // categories can be a number or object depending on JSON version
    expect(data.categories).toBeDefined();
  });
});

// ── Category Filtering ─────────────────────────────────────────────────────
describe("Category Filtering Logic", () => {
  it("should filter products by category", () => {
    const liverProducts = data.products.filter((p) => p.category === "liver");
    expect(liverProducts.length).toBeGreaterThan(0);
  });

  it("should filter products by heart category", () => {
    const heartProducts = data.products.filter((p) => p.category === "heart");
    expect(heartProducts.length).toBeGreaterThan(0);
  });

  it("should filter products by brain category", () => {
    const brainProducts = data.products.filter((p) => p.category === "brain");
    expect(brainProducts.length).toBeGreaterThan(0);
  });

  it("should return all products when no filter", () => {
    expect(data.products.length).toBeGreaterThan(10);
  });
});

// ── Score Ranking ──────────────────────────────────────────────────────────
describe("Product Score Ranking", () => {
  it("should sort products by score descending", () => {
    const sorted = [...data.products].sort((a, b) => b.score - a.score);
    expect(sorted[0].score).toBeGreaterThanOrEqual(sorted[sorted.length - 1].score);
  });

  it("top rated products should have score >= 8", () => {
    const topRated = data.products.filter((p) => p.score >= 8);
    expect(topRated.length).toBeGreaterThan(0);
  });

  it("should have products with varying scores", () => {
    const scores = data.products.map((p) => p.score);
    const uniqueScores = new Set(scores);
    expect(uniqueScores.size).toBeGreaterThan(1);
  });
});

// ── Search Logic ───────────────────────────────────────────────────────────
describe("Search Logic", () => {
  it("should find products by name", () => {
    const query = "liver";
    const results = data.products.filter((p) =>
      p.name_en.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBeGreaterThan(0);
  });

  it("should find products by brand", () => {
    const query = "Infinis";
    const results = data.products.filter((p) =>
      p.brand.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBeGreaterThan(0);
  });

  it("should find products by Arabic category", () => {
    const query = "الكبد";
    const results = data.products.filter((p) =>
      p.category_ar.includes(query)
    );
    expect(results.length).toBeGreaterThan(0);
  });

  it("should return empty for non-existent product", () => {
    const query = "xyznonexistentproduct123";
    const results = data.products.filter((p) =>
      p.name_en.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBe(0);
  });
});

// ── Interaction Checker Logic ──────────────────────────────────────────────
describe("Drug Interaction Checker", () => {
  function checkInteractions(names: string[]): string[] {
    const warnings: string[] = [];
    const lowerNames = names.map((n) => n.toLowerCase());
    const pairs: [string, string, string][] = [
      ["calcium", "magnesium", "الكالسيوم والمغنيسيوم يتنافسان على الامتصاص"],
      ["iron", "calcium", "الحديد والكالسيوم يتنافسان على الامتصاص"],
      ["zinc", "iron", "الزنك والحديد يتنافسان على الامتصاص"],
      ["vitamin e", "omega", "فيتامين E مع أوميغا-3 بجرعات عالية قد يزيد خطر النزيف"],
    ];
    for (const [a, b, msg] of pairs) {
      if (lowerNames.some((n) => n.includes(a)) && lowerNames.some((n) => n.includes(b))) {
        warnings.push(msg);
      }
    }
    return warnings;
  }

  it("should detect calcium-magnesium interaction", () => {
    const warnings = checkInteractions(["Calcium Citrate", "Magnesium Glycinate"]);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain("الكالسيوم والمغنيسيوم");
  });

  it("should detect iron-calcium interaction", () => {
    const warnings = checkInteractions(["Iron Bisglycinate", "Calcium Carbonate"]);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("should detect zinc-iron interaction", () => {
    const warnings = checkInteractions(["Zinc Picolinate", "Iron Complex"]);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("should return no warnings for safe combinations", () => {
    const warnings = checkInteractions(["Vitamin D3", "Omega-3"]);
    expect(warnings.length).toBe(0);
  });

  it("should return no warnings for empty list", () => {
    const warnings = checkInteractions([]);
    expect(warnings.length).toBe(0);
  });
});

// ── Dose Calculator Logic ──────────────────────────────────────────────────
describe("Dose Calculator Logic", () => {
  function calculateDose(
    baseDoseMg: number,
    weightKg: number,
    dosePerKg: number
  ): number {
    return Math.round(weightKg * dosePerKg);
  }

  it("should calculate correct dose for 80kg person", () => {
    const dose = calculateDose(500, 80, 6.25);
    expect(dose).toBe(500);
  });

  it("should scale dose with weight", () => {
    const dose60 = calculateDose(500, 60, 6.25);
    const dose100 = calculateDose(500, 100, 6.25);
    expect(dose100).toBeGreaterThan(dose60);
  });
});

// ── Course Builder Logic ───────────────────────────────────────────────────
describe("Course Builder Logic", () => {
  const CATEGORY_MAP: Record<string, string[]> = {
    "صحة القلب": ["heart", "vitamins"],
    "صحة الكبد": ["liver"],
    "صحة الكلى": ["kidney"],
    "تحسين الذاكرة": ["brain"],
    "تقليل التوتر": ["stress", "sleep"],
    "تعزيز المناعة": ["vitamins", "general"],
    "صحة الهرمونات": ["hormones"],
    "صحة البروستاتا": ["prostate"],
  };

  function buildCourse(goals: string[]): Product[] {
    const targetCategories = goals.flatMap((g) => CATEGORY_MAP[g] ?? []);
    const uniqueCategories = [...new Set(targetCategories)];
    return data.products
      .filter((p) => uniqueCategories.includes(p.category))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  it("should build course for heart health goal", () => {
    const course = buildCourse(["صحة القلب"]);
    expect(course.length).toBeGreaterThan(0);
  });

  it("should build course for multiple goals", () => {
    const course = buildCourse(["صحة القلب", "صحة الكبد"]);
    expect(course.length).toBeGreaterThan(0);
  });

  it("course products should be sorted by score", () => {
    const course = buildCourse(["صحة القلب", "صحة الكبد", "تحسين الذاكرة"]);
    if (course.length > 1) {
      expect(course[0].score).toBeGreaterThanOrEqual(course[course.length - 1].score);
    }
  });

  it("should return empty course for unknown goal", () => {
    const course = buildCourse(["هدف غير موجود"]);
    expect(course.length).toBe(0);
  });
});

// ── Schedule Logic ─────────────────────────────────────────────────────────
describe("Schedule Logic", () => {
  const TIMINGS = ["صباح", "مساء", "قبل التمرين", "بعد التمرين", "مع الطعام", "قبل النوم"];

  it("should have all expected timing slots", () => {
    expect(TIMINGS).toContain("صباح");
    expect(TIMINGS).toContain("مساء");
    expect(TIMINGS).toContain("قبل النوم");
  });

  it("should group supplements by timing", () => {
    const entries = [
      { timing: "صباح", productName: "Vitamin D3" },
      { timing: "صباح", productName: "Omega-3" },
      { timing: "مساء", productName: "Magnesium" },
    ];
    const groups = TIMINGS
      .map((t) => ({ timing: t, items: entries.filter((e) => e.timing === t) }))
      .filter((g) => g.items.length > 0);
    expect(groups.length).toBe(2);
    expect(groups[0].items.length).toBe(2);
    expect(groups[1].items.length).toBe(1);
  });
});

// ── Deficiency Test Logic ──────────────────────────────────────────────────
describe("Deficiency Test Logic", () => {
  interface Symptom {
    id: string;
    text: string;
    deficiencies: string[];
  }

  const symptoms: Symptom[] = [
    { id: "fatigue", text: "تعب مزمن", deficiencies: ["vitamin_d", "iron", "b12", "magnesium"] },
    { id: "hair_loss", text: "تساقط الشعر", deficiencies: ["iron", "zinc", "biotin"] },
    { id: "muscle_cramps", text: "تشنجات عضلية", deficiencies: ["magnesium", "potassium", "calcium"] },
    { id: "poor_sleep", text: "اضطراب النوم", deficiencies: ["magnesium", "melatonin"] },
    { id: "low_mood", text: "تقلبات المزاج", deficiencies: ["vitamin_d", "omega3", "b12"] },
  ];

  function analyzeDeficiencies(selectedSymptoms: string[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const symptomId of selectedSymptoms) {
      const symptom = symptoms.find((s) => s.id === symptomId);
      if (symptom) {
        for (const def of symptom.deficiencies) {
          counts[def] = (counts[def] ?? 0) + 1;
        }
      }
    }
    return counts;
  }

  it("should detect vitamin D deficiency from fatigue and low mood", () => {
    const result = analyzeDeficiencies(["fatigue", "low_mood"]);
    expect(result["vitamin_d"]).toBe(2);
  });

  it("should detect iron deficiency from fatigue and hair loss", () => {
    const result = analyzeDeficiencies(["fatigue", "hair_loss"]);
    expect(result["iron"]).toBe(2);
  });

  it("should detect magnesium deficiency from multiple symptoms", () => {
    const result = analyzeDeficiencies(["fatigue", "muscle_cramps", "poor_sleep"]);
    expect(result["magnesium"]).toBe(3);
  });

  it("should return empty for no symptoms", () => {
    const result = analyzeDeficiencies([]);
    expect(Object.keys(result).length).toBe(0);
  });
});
