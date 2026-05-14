import { describe, it, expect } from 'vitest';
import { organSections, overallProducts } from '../assets/data/organData';

describe('organData', () => {
  it('should have 3 organ sections', () => {
    expect(organSections).toHaveLength(3);
  });

  it('should have liver, heart, kidney sections', () => {
    const ids = organSections.map(s => s.id);
    expect(ids).toContain('liver');
    expect(ids).toContain('heart');
    expect(ids).toContain('kidney');
  });

  it('each section should have ingredients', () => {
    organSections.forEach(section => {
      expect(section.ingredients.length).toBeGreaterThan(0);
    });
  });

  it('each section should have comparison table', () => {
    organSections.forEach(section => {
      expect(section.comparison.headers.length).toBeGreaterThan(0);
      expect(section.comparison.rows.length).toBeGreaterThan(0);
    });
  });

  it('each section should have winners', () => {
    organSections.forEach(section => {
      expect(section.winners.length).toBeGreaterThan(0);
    });
  });

  it('overallProducts should have 12 products', () => {
    expect(overallProducts).toHaveLength(12);
  });

  it('each product should have a valid score between 0 and 100', () => {
    overallProducts.forEach(product => {
      expect(product.score).toBeGreaterThanOrEqual(0);
      expect(product.score).toBeLessThanOrEqual(100);
    });
  });

  it('liver section should have TUDCA ingredient', () => {
    const liver = organSections.find(s => s.id === 'liver');
    const tudca = liver?.ingredients.find(i => i.id === 'tudca');
    expect(tudca).toBeDefined();
    expect(tudca?.name).toBe('TUDCA');
  });

  it('heart section should have CoQ10 ingredient', () => {
    const heart = organSections.find(s => s.id === 'heart');
    const coq10 = heart?.ingredients.find(i => i.id === 'coq10');
    expect(coq10).toBeDefined();
    expect(coq10?.name).toContain('CoQ10');
  });

  it('kidney section should have NAC ingredient', () => {
    const kidney = organSections.find(s => s.id === 'kidney');
    const nac = kidney?.ingredients.find(i => i.id === 'nac-kidney');
    expect(nac).toBeDefined();
  });

  it('all ingredients should have at least one dose', () => {
    organSections.forEach(section => {
      section.ingredients.forEach(ingredient => {
        expect(ingredient.doses.length).toBeGreaterThan(0);
      });
    });
  });

  it('all ingredients should have evidence pills', () => {
    organSections.forEach(section => {
      section.ingredients.forEach(ingredient => {
        expect(ingredient.evidence.length).toBeGreaterThan(0);
      });
    });
  });
});
