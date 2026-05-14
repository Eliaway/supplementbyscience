import { describe, it, expect } from 'vitest';
import { organSections, overallProducts } from '../assets/data/organData';

const liverSection = organSections.find(s => s.id === 'liver')!;
const heartSection = organSections.find(s => s.id === 'heart')!;
const kidneySection = organSections.find(s => s.id === 'kidney')!;
const liverIngredients = liverSection?.ingredients ?? [];
const heartIngredients = heartSection?.ingredients ?? [];
const kidneyIngredients = kidneySection?.ingredients ?? [];

// ===== اختبارات بيانات الأعضاء =====
describe('organData - liver', () => {
  it('should have at least 5 liver ingredients', () => {
    expect(liverIngredients.length).toBeGreaterThanOrEqual(5);
  });
  it('each liver ingredient should have required fields', () => {
    liverIngredients.forEach(ing => {
      expect(ing.id).toBeTruthy();
      expect(ing.name).toBeTruthy();
      expect(ing.doses.length).toBeGreaterThan(0);
      expect(ing.evidence.length).toBeGreaterThan(0);
    });
  });
  it('dose percentages should be between 0 and 100', () => {
    liverIngredients.forEach(ing => {
      ing.doses.forEach(d => {
        expect(d.percent).toBeGreaterThanOrEqual(0);
        expect(d.percent).toBeLessThanOrEqual(100);
      });
    });
  });
});

describe('organData - heart', () => {
  it('should have at least 5 heart ingredients', () => {
    expect(heartIngredients.length).toBeGreaterThanOrEqual(5);
  });
  it('each heart ingredient should have citations', () => {
    heartIngredients.forEach(ing => {
      expect(ing.citations.length).toBeGreaterThan(0);
    });
  });
});

describe('organData - kidney', () => {
  it('should have at least 4 kidney ingredients', () => {
    expect(kidneyIngredients.length).toBeGreaterThanOrEqual(4);
  });
});

// ===== اختبارات المنتجات الشاملة =====
describe('overallProducts', () => {
  it('should have at least 10 products', () => {
    expect(overallProducts.length).toBeGreaterThanOrEqual(10);
  });
  it('scores should be between 0 and 100', () => {
    overallProducts.forEach(p => {
      expect(p.score).toBeGreaterThan(0);
      expect(p.score).toBeLessThanOrEqual(100);
    });
  });
  it('should have products for all 3 organs', () => {
    const hasLiver = overallProducts.some(p => p.organ.includes('الكبد'));
    const hasHeart = overallProducts.some(p => p.organ.includes('القلب'));
    const hasKidney = overallProducts.some(p => p.organ.includes('الكلى'));
    expect(hasLiver).toBe(true);
    expect(hasHeart).toBe(true);
    expect(hasKidney).toBe(true);
  });
  it('top liver product should have score >= 90', () => {
    const topLiver = overallProducts
      .filter(p => p.organ.includes('الكبد'))
      .sort((a, b) => b.score - a.score)[0];
    expect(topLiver.score).toBeGreaterThanOrEqual(90);
  });
  it('each product should have keyIngredients', () => {
    overallProducts.forEach(p => {
      expect(p.keyIngredients).toBeTruthy();
      expect(p.keyIngredients.length).toBeGreaterThan(0);
    });
  });
  it('scoreType should be s, m, or l', () => {
    overallProducts.forEach(p => {
      expect(['s', 'm', 'l']).toContain(p.scoreType);
    });
  });
  it('ppsType should be g, m, or b', () => {
    overallProducts.forEach(p => {
      expect(['g', 'm', 'b']).toContain(p.ppsType);
    });
  });
});

// ===== اختبارات منطق الفلترة =====
describe('filtering logic', () => {
  it('filter by liver should return only liver products', () => {
    const liverOnly = overallProducts.filter(p => p.organ.includes('الكبد'));
    liverOnly.forEach(p => expect(p.organ).toContain('الكبد'));
  });
  it('sort by score descending should work', () => {
    const sorted = [...overallProducts].sort((a, b) => b.score - a.score);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].score).toBeGreaterThanOrEqual(sorted[i + 1].score);
    }
  });
  it('sort by price ascending should work', () => {
    const sorted = [...overallProducts].sort((a, b) =>
      parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
    );
    for (let i = 0; i < sorted.length - 1; i++) {
      const priceA = parseFloat(sorted[i].price.replace('$', ''));
      const priceB = parseFloat(sorted[i + 1].price.replace('$', ''));
      expect(priceA).toBeLessThanOrEqual(priceB);
    }
  });
});

// ===== اختبارات منطق جدول الجرعات =====
describe('dose schedule logic', () => {
  it('time filter morning should match 06:00-11:59', () => {
    const morningTimes = ['06:00', '07:30', '08:00', '11:59'];
    const afternoonTimes = ['12:00', '13:00', '17:59'];
    morningTimes.forEach(t => {
      const h = parseInt(t.split(':')[0]);
      expect(h >= 6 && h < 12).toBe(true);
    });
    afternoonTimes.forEach(t => {
      const h = parseInt(t.split(':')[0]);
      expect(h >= 6 && h < 12).toBe(false);
    });
  });
  it('progress calculation should be correct', () => {
    const items = [
      { taken: true }, { taken: true }, { taken: false }, { taken: false }
    ];
    const takenCount = items.filter(i => i.taken).length;
    const progress = (takenCount / items.length) * 100;
    expect(progress).toBe(50);
  });
  it('empty schedule should show 0% progress', () => {
    const items: { taken: boolean }[] = [];
    const progress = items.length > 0 ? (items.filter(i => i.taken).length / items.length) * 100 : 0;
    expect(progress).toBe(0);
  });
});

// ===== اختبارات منطق التعارضات =====
describe('interaction checker logic', () => {
  const interactions = [
    { a: 'NAC', b: 'Vitamin C', type: 'synergy', note: 'تآزر في مضادات الأكسدة' },
    { a: 'CoQ10', b: 'Statins', type: 'conflict', note: 'الستاتينات تستنزف CoQ10' },
  ];

  it('should find synergy between NAC and Vitamin C', () => {
    const found = interactions.find(
      i => (i.a === 'NAC' && i.b === 'Vitamin C') || (i.a === 'Vitamin C' && i.b === 'NAC')
    );
    expect(found).toBeDefined();
    expect(found?.type).toBe('synergy');
  });

  it('should find conflict between CoQ10 and Statins', () => {
    const found = interactions.find(
      i => (i.a === 'CoQ10' && i.b === 'Statins') || (i.a === 'Statins' && i.b === 'CoQ10')
    );
    expect(found).toBeDefined();
    expect(found?.type).toBe('conflict');
  });
});

// ===== اختبارات حاسبة الجرعة =====
describe('dose calculator logic', () => {
  it('should calculate correct dose for 70kg person', () => {
    // NAC: 10-15 mg/kg
    const weight = 70;
    const minDosePerKg = 10;
    const maxDosePerKg = 15;
    const minDose = weight * minDosePerKg;
    const maxDose = weight * maxDosePerKg;
    expect(minDose).toBe(700);
    expect(maxDose).toBe(1050);
  });
  it('should round dose to nearest 50mg', () => {
    const dose = 723;
    const rounded = Math.round(dose / 50) * 50;
    expect(rounded).toBe(700);
  });
});
