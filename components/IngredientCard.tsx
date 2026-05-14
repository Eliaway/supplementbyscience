import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { IngredientCard as IngredientCardType } from '@/assets/data/organData';
import { DoseMeter } from './DoseMeter';
import { EvidencePills } from './EvidencePills';

interface IngredientCardProps {
  ingredient: IngredientCardType;
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      {/* Header */}
      <Pressable
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={[styles.iconBox, { backgroundColor: ingredient.iconBg, borderColor: ingredient.iconBorder }]}>
          <Text style={styles.iconText}>{ingredient.icon}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{ingredient.name}</Text>
          <Text style={styles.role}>{ingredient.role}</Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>

      {/* Body */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(10,22,42,0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0f2040',
    overflow: 'hidden',
    marginBottom: 12,
  },
  header: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f2040',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  iconText: {
    fontSize: 18,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  role: {
    fontSize: 11,
    color: '#475569',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  chevron: {
    fontSize: 10,
    color: '#475569',
  },
  body: {
    padding: 12,
    gap: 10,
  },
  description: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 20,
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  citations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
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
  synergyBox: {
    backgroundColor: 'rgba(16,185,129,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  synergyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34d399',
    fontFamily: 'Cairo',
    textAlign: 'right',
    marginBottom: 4,
  },
  synergyText: {
    fontSize: 12,
    color: '#86efac',
    lineHeight: 20,
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  conflictBox: {
    backgroundColor: 'rgba(239,68,68,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  conflictTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f87171',
    fontFamily: 'Cairo',
    textAlign: 'right',
    marginBottom: 4,
  },
  conflictText: {
    fontSize: 12,
    color: '#fca5a5',
    lineHeight: 20,
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
});
