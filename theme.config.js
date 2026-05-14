/** @type {const} */
const themeColors = {
  primary:    { light: '#60a5fa', dark: '#60a5fa' },   // أزرق واضح
  background: { light: '#f8f9fa', dark: '#000000' },   // أسود AMOLED
  surface:    { light: '#ffffff', dark: '#0f0f0f' },   // سطح داكن جداً
  surface2:   { light: '#f0f2f5', dark: '#1a1a1a' },   // سطح ثانوي
  foreground: { light: '#0d0d0d', dark: '#ffffff' },   // أبيض نقي للعناوين
  muted:      { light: '#6b7280', dark: '#aaaaaa' },   // رمادي فاتح للنصوص الثانوية
  subtle:     { light: '#9ca3af', dark: '#777777' },   // رمادي متوسط للتفاصيل
  border:     { light: '#e5e7eb', dark: '#1f1f1f' },   // حدود خفيفة جداً
  border2:    { light: '#d1d5db', dark: '#2a2a2a' },   // حدود ثانوية
  success:    { light: '#22c55e', dark: '#4ade80' },   // أخضر
  warning:    { light: '#f59e0b', dark: '#fbbf24' },   // ذهبي
  error:      { light: '#ef4444', dark: '#f87171' },   // أحمر
  // ألوان الأعضاء
  liver:      { light: '#d97706', dark: '#fbbf24' },   // ذهبي الكبد
  heart:      { light: '#dc2626', dark: '#f87171' },   // أحمر القلب
  kidney:     { light: '#7c3aed', dark: '#a78bfa' },   // بنفسجي الكلى
  // ألوان AI والأدوات
  aiBlue:     { light: '#2563eb', dark: '#60a5fa' },   // أزرق AI
  tint:       { light: '#60a5fa', dark: '#60a5fa' },   // لون التمييز
};

module.exports = { themeColors };
