import { describe, it, expect } from 'vitest';

// ─── نسخ منطق الحساب من الشاشة للاختبار ──────────────────────────────────────

function calcLiverScore(alt: number, ast: number, ggt: number, bili: number): number {
  let score = 100;
  if (alt > 56)  score -= Math.min(30, (alt - 56) / 5);
  if (alt > 100) score -= 10;
  if (ast > 40)  score -= Math.min(25, (ast - 40) / 4);
  if (ggt > 48)  score -= Math.min(20, (ggt - 48) / 5);
  if (bili > 1.2) score -= Math.min(15, (bili - 1.2) * 10);
  return Math.max(0, Math.round(score));
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'ممتاز';
  if (score >= 60) return 'جيد';
  if (score >= 40) return 'متوسط';
  return 'يحتاج متابعة';
}

function getLabStatus(min: number, max: number, value: number): 'normal' | 'low' | 'high' {
  if (value < min) return 'low';
  if (value > max) return 'high';
  return 'normal';
}

const RISK_QUESTIONS = [
  { id: 'q1', organ: 'liver',  weight: 3 },
  { id: 'q2', organ: 'liver',  weight: 2 },
  { id: 'q3', organ: 'liver',  weight: 2 },
  { id: 'q4', organ: 'liver',  weight: 2 },
  { id: 'q5', organ: 'heart',  weight: 3 },
  { id: 'q6', organ: 'heart',  weight: 3 },
  { id: 'q7', organ: 'heart',  weight: 2 },
  { id: 'q8', organ: 'heart',  weight: 2 },
  { id: 'q9', organ: 'kidney', weight: 3 },
  { id: 'q10', organ: 'kidney', weight: 3 },
  { id: 'q11', organ: 'kidney', weight: 2 },
  { id: 'q12', organ: 'kidney', weight: 2 },
];

function calcRiskScore(organ: string, answers: Record<string, boolean>): number {
  const qs = RISK_QUESTIONS.filter(q => q.organ === organ);
  const maxScore = qs.reduce((s, q) => s + q.weight, 0);
  const userScore = qs.filter(q => answers[q.id]).reduce((s, q) => s + q.weight, 0);
  return Math.round((userScore / maxScore) * 100);
}

// ─── الاختبارات ────────────────────────────────────────────────────────────────

describe('حاسبة درجة صحة الكبد', () => {
  it('يُعطي 100 لقيم طبيعية تماماً', () => {
    expect(calcLiverScore(30, 25, 30, 0.8)).toBe(100);
  });

  it('يخصم نقاط عند ارتفاع ALT فوق 56', () => {
    const score = calcLiverScore(66, 25, 30, 0.8);
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThan(70);
  });

  it('يخصم نقاط إضافية عند ALT > 100', () => {
    const scoreNormal = calcLiverScore(66, 25, 30, 0.8);
    const scoreHigh   = calcLiverScore(110, 25, 30, 0.8);
    expect(scoreHigh).toBeLessThan(scoreNormal);
  });

  it('يخصم نقاط عند ارتفاع AST فوق 40', () => {
    const score = calcLiverScore(30, 60, 30, 0.8);
    expect(score).toBeLessThan(100);
  });

  it('يخصم نقاط عند ارتفاع GGT فوق 48', () => {
    const score = calcLiverScore(30, 25, 70, 0.8);
    expect(score).toBeLessThan(100);
  });

  it('يخصم نقاط عند ارتفاع Bilirubin فوق 1.2', () => {
    const score = calcLiverScore(30, 25, 30, 2.0);
    expect(score).toBeLessThan(100);
  });

  it('لا تنخفض الدرجة عن 0 مهما ارتفعت القيم', () => {
    const score = calcLiverScore(500, 500, 500, 20);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('قيم حرجة جداً تعطي درجة منخفضة', () => {
    const score = calcLiverScore(200, 150, 200, 5);
    expect(score).toBeLessThan(40);
  });
});

describe('تصنيف درجة الصحة', () => {
  it('80-100 = ممتاز', () => {
    expect(getScoreLabel(100)).toBe('ممتاز');
    expect(getScoreLabel(80)).toBe('ممتاز');
  });

  it('60-79 = جيد', () => {
    expect(getScoreLabel(79)).toBe('جيد');
    expect(getScoreLabel(60)).toBe('جيد');
  });

  it('40-59 = متوسط', () => {
    expect(getScoreLabel(59)).toBe('متوسط');
    expect(getScoreLabel(40)).toBe('متوسط');
  });

  it('0-39 = يحتاج متابعة', () => {
    expect(getScoreLabel(39)).toBe('يحتاج متابعة');
    expect(getScoreLabel(0)).toBe('يحتاج متابعة');
  });
});

describe('مقارنة التحاليل مع المعدلات الطبيعية', () => {
  it('قيمة ALT طبيعية (30 U/L)', () => {
    expect(getLabStatus(7, 56, 30)).toBe('normal');
  });

  it('قيمة ALT مرتفعة (80 U/L)', () => {
    expect(getLabStatus(7, 56, 80)).toBe('high');
  });

  it('قيمة ALT منخفضة (3 U/L)', () => {
    expect(getLabStatus(7, 56, 3)).toBe('low');
  });

  it('قيمة Creatinine طبيعية (0.9 mg/dL)', () => {
    expect(getLabStatus(0.6, 1.2, 0.9)).toBe('normal');
  });

  it('قيمة Creatinine مرتفعة (2.5 mg/dL)', () => {
    expect(getLabStatus(0.6, 1.2, 2.5)).toBe('high');
  });

  it('قيمة HDL منخفضة (30 mg/dL)', () => {
    expect(getLabStatus(40, 999, 30)).toBe('low');
  });

  it('قيمة LDL مرتفعة (150 mg/dL)', () => {
    expect(getLabStatus(0, 100, 150)).toBe('high');
  });

  it('قيمة Glucose طبيعية (85 mg/dL)', () => {
    expect(getLabStatus(70, 100, 85)).toBe('normal');
  });
});

describe('تقييم خطر الأمراض المزمنة', () => {
  it('بدون إجابات = خطر 0%', () => {
    expect(calcRiskScore('liver', {})).toBe(0);
    expect(calcRiskScore('heart', {})).toBe(0);
    expect(calcRiskScore('kidney', {})).toBe(0);
  });

  it('جميع إجابات الكبد = خطر 100%', () => {
    const allLiver = { q1: true, q2: true, q3: true, q4: true };
    expect(calcRiskScore('liver', allLiver)).toBe(100);
  });

  it('جميع إجابات القلب = خطر 100%', () => {
    const allHeart = { q5: true, q6: true, q7: true, q8: true };
    expect(calcRiskScore('heart', allHeart)).toBe(100);
  });

  it('جميع إجابات الكلى = خطر 100%', () => {
    const allKidney = { q9: true, q10: true, q11: true, q12: true };
    expect(calcRiskScore('kidney', allKidney)).toBe(100);
  });

  it('إجابة واحدة عالية الوزن تعطي خطراً معقولاً', () => {
    const score = calcRiskScore('liver', { q1: true });
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it('إجابات عضو لا تؤثر على عضو آخر', () => {
    const allLiver = { q1: true, q2: true, q3: true, q4: true };
    expect(calcRiskScore('heart', allLiver)).toBe(0);
    expect(calcRiskScore('kidney', allLiver)).toBe(0);
  });

  it('الخطر يتراوح دائماً بين 0 و100', () => {
    const allAnswers = { q1: true, q2: true, q3: true, q4: true, q5: true };
    const score = calcRiskScore('liver', allAnswers);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('حساب درجة الكلى والقلب', () => {
  function calcKidneyScore(creatinine: number, gfr: number): number {
    let score = 100;
    if (creatinine > 1.2) score -= Math.min(40, (creatinine - 1.2) * 20);
    if (gfr > 0 && gfr < 60) score -= Math.min(40, (60 - gfr));
    return Math.max(0, Math.round(score));
  }

  function calcHeartScore(cholesterol: number, ldl: number): number {
    let score = 100;
    if (cholesterol > 200) score -= Math.min(30, (cholesterol - 200) / 5);
    if (ldl > 100) score -= Math.min(30, (ldl - 100) / 3);
    return Math.max(0, Math.round(score));
  }

  it('كلى طبيعية تعطي 100', () => {
    expect(calcKidneyScore(0.9, 90)).toBe(100);
  });

  it('Creatinine مرتفع يخفض درجة الكلى', () => {
    expect(calcKidneyScore(2.0, 90)).toBeLessThan(100);
  });

  it('GFR منخفض يخفض درجة الكلى', () => {
    expect(calcKidneyScore(0.9, 45)).toBeLessThan(100);
  });

  it('قلب طبيعي يعطي 100', () => {
    expect(calcHeartScore(180, 90)).toBe(100);
  });

  it('Cholesterol مرتفع يخفض درجة القلب', () => {
    expect(calcHeartScore(250, 90)).toBeLessThan(100);
  });

  it('LDL مرتفع يخفض درجة القلب', () => {
    expect(calcHeartScore(180, 150)).toBeLessThan(100);
  });

  it('لا تنخفض الدرجة عن 0', () => {
    expect(calcKidneyScore(10, 5)).toBeGreaterThanOrEqual(0);
    expect(calcHeartScore(500, 500)).toBeGreaterThanOrEqual(0);
  });
});
