import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DoseLevel } from '@/assets/data/organData';

interface DoseMeterProps {
  doses: DoseLevel[];
}

const doseColors = {
  min: { bar: ['#f59e0b', '#fbbf24'], text: '#fbbf24' },
  opt: { bar: ['#10b981', '#34d399'], text: '#34d399' },
  max: { bar: ['#ef4444', '#f87171'], text: '#f87171' },
};

export function DoseMeter({ doses }: DoseMeterProps) {
  return (
    <View style={styles.container}>
      {doses.map((dose, idx) => {
        const colors = doseColors[dose.type];
        return (
          <View key={idx} style={styles.doseRow}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{dose.label}</Text>
              <Text style={[styles.value, { color: colors.text }]}>{dose.value}</Text>
            </View>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  { width: `${dose.percent}%`, backgroundColor: colors.bar[0] },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  doseRow: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'Cairo',
  },
  value: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Cairo',
  },
  barBg: {
    height: 6,
    backgroundColor: '#0a1628',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f2040',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
