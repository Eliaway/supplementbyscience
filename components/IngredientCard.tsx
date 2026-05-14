import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { IngredientCard as IngredientCardType } from '@/assets/data/organData';
import { DoseMeter } from './DoseMeter';
import { EvidencePills } from './EvidencePills';
import { COLORS, FONTS, RADIUS } from '@/constants/styles';

interface IngredientCardProps {
  ingredient: IngredientCardType;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function IngredientCard({ ingredient, isFavorite, onToggleFavorite }: IngredientCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setExpanded(!expanded)}>
        <View style={[styles.iconBox, { backgroundColor: ingredient.iconBg, borderColor: ingredient.iconBorder }]}>
          <Text style={styles.iconText}>{ingredient.icon}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{ingredient.name}</Text>
          <Text style={styles.role} numberOfLines={2}>{ingredient.role}</Text>
        </View>
        <View style={styles.headerRight}>
          {onToggleFavorite && (
            <Pressable
              style={styles.favBtn}
              onPress={() => onToggleFavorite(ingredient.id)}
            >
              <Text style={{ fontSize: 18 }}>{isFavorite ? '⭐' : '☆'}</Text>
            </Pressable>
          )}
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          <DoseMeter doses={ingredient.doses} />
          <EvidencePills pills={ingredient.evidence} />
          <Text style={styles.description}>{ingredient.description}</Text>
          <View style={styles.citations}>
            {ingredient.citations.map((c, i) => (
              <View key={i} style={styles.cite}>
                <Text style={styles.citeText}>{c}</Text>
              </View>
            ))}
          </View>
          {ingredient.synergy && (
            <View style={styles.synergyBox}>
              <Text style={styles.synergyTitle}>✅ تآزر مع:</Text>
              <Text style={styles.synergyText}>{ingredient.synergy}</Text>
            </View>
          )}
          {ingredient.conflict && (
            <View style={styles.conflictBox}>
              <Text style={styles.conflictTitle}>⚠️ تعارض محتمل:</Text>
              <Text style={styles.conflictText}>{ingredient.conflict}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 10,
  },
  header: {
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  iconText: { fontSize: 20 },
  headerText: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    textAlign: 'right',
  },
  role: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    textAlign: 'right',
    marginTop: 2,
    lineHeight: 16,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  favBtn: { padding: 2 },
  chevron: { fontSize: 10, color: COLORS.textMuted },
  body: {
    padding: 13,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  citations: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cite: {
    backgroundColor: COLORS.blueBg,
    borderWidth: 1,
    borderColor: COLORS.blueBorder,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  citeText: { fontSize: 10, color: COLORS.blue, fontWeight: '700', fontFamily: FONTS.bold },
  synergyBox: {
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    borderRadius: RADIUS.sm,
    padding: 10,
  },
  synergyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
    fontFamily: FONTS.bold,
    textAlign: 'right',
    marginBottom: 3,
  },
  synergyText: {
    fontSize: 12,
    color: '#86efac',
    lineHeight: 20,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  conflictBox: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: RADIUS.sm,
    padding: 10,
  },
  conflictTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error,
    fontFamily: FONTS.bold,
    textAlign: 'right',
    marginBottom: 3,
  },
  conflictText: {
    fontSize: 12,
    color: '#fca5a5',
    lineHeight: 20,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
});
