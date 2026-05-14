import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { WinnerCard as WinnerCardType } from '@/assets/data/organData';

interface WinnerCardProps {
  winner: WinnerCardType;
}

const typeColors: Record<string, string> = {
  liver: '#f59e0b',
  heart: '#ef4444',
  kidney: '#8b5cf6',
  compare: '#38bdf8',
};

export function WinnerCard({ winner }: WinnerCardProps) {
  const color = typeColors[winner.type] || '#38bdf8';

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.badge}>{winner.badge}</Text>
      <Text style={styles.name}>{winner.name}</Text>
      <Text style={styles.reason}>{winner.reason}</Text>
      <View style={styles.citations}>
        {winner.citations.map((c, i) => (
          <View key={i} style={styles.cite}>
            <Text style={styles.citeText}>{c}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.price}>{winner.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(10,22,42,0.8)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#0f2040',
    borderLeftWidth: 3,
    marginBottom: 10,
  },
  badge: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 6,
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 4,
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  reason: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 20,
    fontFamily: 'Cairo',
    textAlign: 'right',
    marginBottom: 6,
  },
  citations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  cite: {
    backgroundColor: 'rgba(56,189,248,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  citeText: {
    fontSize: 10,
    color: '#38bdf8',
    fontWeight: '700',
    fontFamily: 'Cairo',
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38bdf8',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
});
