import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DoseLevel } from '@/assets/data/organData';
import { COLORS, FONTS } from '@/constants/styles';

interface DoseMeterProps {
  doses: DoseLevel[];
}

const doseColors = {
  min: { bar: '#fbbf24', text: '#fbbf24' },
  opt: { bar: '#4ade80', text: '#4ade80' },
  max: { bar: '#f87171', text: '#f87171' },
};

export function DoseMeter({ doses }: DoseMeterProps) {
  return (
    <View style={styles.container}>
      {doses.map((dose, idx) => {
        const c = doseColors[dose.type];
        return (
          <View key={idx} style={styles.doseRow}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{dose.label}</Text>
              <Text style={[styles.value, { color: c.text }]}>{dose.value}</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${dose.percent}%` as any, backgroundColor: c.bar }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7 },
  doseRow: { gap: 4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  value: { fontSize: 12, fontWeight: '700', fontFamily: FONTS.bold },
  barBg: {
    height: 7,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },
});
