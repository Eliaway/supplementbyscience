/** @type {const} */
const themeColors = {
  primary:    { light: '#60a5fa', dark: '#60a5fa' },   // أزرق واضح
  background: { light: '#000000', dark: '#000000' },   // أسود AMOLED دائماً
  surface:    { light: '#0f0f0f', dark: '#0f0f0f' },   // سطح داكن جداً
  surface2:   { light: '#1a1a1a', dark: '#1a1a1a' },   // سطح ثانوي
  foreground: { light: '#ffffff', dark: '#ffffff' },   // أبيض نقي للعناوين
  muted:      { light: '#aaaaaa', dark: '#aaaaaa' },   // رمادي فاتح للنصوص الثانوية
  subtle:     { light: '#777777', dark: '#777777' },   // رمادي متوسط للتفاصيل
  border:     { light: '#1f1f1f', dark: '#1f1f1f' },   // حدود خفيفة جداً
  border2:    { light: '#2a2a2a', dark: '#2a2a2a' },   // حدود ثانوية
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
