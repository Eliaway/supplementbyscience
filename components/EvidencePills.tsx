import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { EvidencePill } from '@/assets/data/organData';

interface EvidencePillsProps {
  pills: EvidencePill[];
}

const levelStyles: Record<number, { bg: string; border: string; text: string }> = {
  5: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  4: { bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.3)', text: '#38bdf8' },
  3: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24' },
  2: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: '#f87171' },
};

export function EvidencePills({ pills }: EvidencePillsProps) {
  return (
    <View style={styles.container}>
      {pills.map((pill, idx) => {
        const s = levelStyles[pill.level] || levelStyles[3];
        return (
          <View
            key={idx}
            style={[styles.pill, { backgroundColor: s.bg, borderColor: s.border }]}
          >
            <Text style={[styles.pillText, { color: s.text }]}>{pill.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Cairo',
  },
});
