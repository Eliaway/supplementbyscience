/**
 * مكوّن النص العربي الموحّد
 * يضمن استخدام خط القاهرة (Cairo) في جميع النصوص تلقائياً
 * مع دعم الأوزان المختلفة: عادي، عريض، أسود
 */
import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

type FontWeight = 'regular' | 'bold' | 'black';

interface ArabicTextProps extends TextProps {
  weight?: FontWeight;
}

const FONT_MAP: Record<FontWeight, string> = {
  regular: 'Cairo',
  bold: 'Cairo-Bold',
  black: 'Cairo-Black',
};

export function ArabicText({ weight = 'regular', style, ...props }: ArabicTextProps) {
  return (
    <RNText
      style={[{ fontFamily: FONT_MAP[weight] }, style]}
      {...props}
    />
  );
}

// مساعد لتحديد الخط بناءً على fontWeight
export function getFontFamily(fontWeight?: string | number): string {
  if (fontWeight === '900' || fontWeight === '800' || fontWeight === 'black') return 'Cairo-Black';
  if (fontWeight === '700' || fontWeight === '600' || fontWeight === 'bold') return 'Cairo-Bold';
  return 'Cairo';
}
