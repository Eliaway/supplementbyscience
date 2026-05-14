import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/constants/styles';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  accentColor?: string;
}

export function AppHeader({ title, subtitle, badge, accentColor = COLORS.blue }: AppHeaderProps) {
  return (
    <View style={[styles.header, { borderBottomColor: accentColor }]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {badge && (
        <View style={[styles.badge, { borderColor: COLORS.successBorder, backgroundColor: COLORS.successBg }]}>
          <Text style={[styles.badgeText, { color: COLORS.success }]}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.bgHeader,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    fontFamily: FONTS.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  badge: {
    marginTop: 7,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
});
