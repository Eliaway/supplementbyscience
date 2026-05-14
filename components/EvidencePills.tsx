import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { EvidencePill } from '@/assets/data/organData';
import { COLORS, FONTS } from '@/constants/styles';

interface EvidencePillsProps {
  pills: EvidencePill[];
}

const levelStyles: Record<number, { bg: string; border: string; text: string }> = {
  5: { bg: COLORS.successBg, border: COLORS.successBorder, text: COLORS.success },
  4: { bg: COLORS.blueBg, border: COLORS.blueBorder, text: COLORS.blue },
  3: { bg: COLORS.warningBg, border: COLORS.warningBorder, text: COLORS.warning },
  2: { bg: COLORS.errorBg, border: COLORS.errorBorder, text: COLORS.error },
};

export function EvidencePills({ pills }: EvidencePillsProps) {
  return (
    <View style={styles.container}>
      {pills.map((pill, idx) => {
        const s = levelStyles[pill.level] || levelStyles[3];
        return (
          <View key={idx} style={[styles.pill, { backgroundColor: s.bg, borderColor: s.border }]}>
            <Text style={[styles.pillText, { color: s.text }]}>{pill.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  pill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  pillText: { fontSize: 11, fontWeight: '700', fontFamily: FONTS.bold },
});
