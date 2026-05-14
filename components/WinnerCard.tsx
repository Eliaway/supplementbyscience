import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { WinnerCard as WinnerCardType } from '@/assets/data/organData';
import { COLORS, FONTS, RADIUS } from '@/constants/styles';

interface WinnerCardProps {
  winner: WinnerCardType;
}

const typeColors: Record<string, string> = {
  liver: COLORS.liver,
  heart: COLORS.heart,
  kidney: COLORS.kidney,
  compare: COLORS.compare,
};

export function WinnerCard({ winner }: WinnerCardProps) {
  const color = typeColors[winner.type] || COLORS.blue;
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
      <Text style={[styles.price, { color }]}>{winner.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    marginBottom: 10,
  },
  badge: { fontSize: 11, color: COLORS.textMuted, marginBottom: 5, fontFamily: FONTS.regular, textAlign: 'right' },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 5, fontFamily: FONTS.bold, textAlign: 'right' },
  reason: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 21, fontFamily: FONTS.regular, textAlign: 'right', marginBottom: 8 },
  citations: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 8 },
  cite: {
    backgroundColor: COLORS.blueBg,
    borderWidth: 1,
    borderColor: COLORS.blueBorder,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  citeText: { fontSize: 10, color: COLORS.blue, fontWeight: '700', fontFamily: FONTS.bold },
  price: { fontSize: 13, fontWeight: '700', fontFamily: FONTS.bold, textAlign: 'right' },
});
