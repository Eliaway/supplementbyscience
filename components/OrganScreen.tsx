import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IngredientCard } from '@/components/IngredientCard';
import { ComparisonTable } from '@/components/ComparisonTable';
import { WinnerCard } from '@/components/WinnerCard';
import { AppHeader } from '@/components/AppHeader';
import { COLORS, FONTS, RADIUS } from '@/constants/styles';
import type { OrganSection } from '@/assets/data/organData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

interface OrganScreenProps {
  section: OrganSection;
  accentColor?: string;
}

export function OrganScreen({ section, accentColor = COLORS.blue }: OrganScreenProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('favorites').then(v => {
        if (v) setFavorites(JSON.parse(v));
      });
    }, [])
  );

  const toggleFavorite = async (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'left', 'right']}>
      <AppHeader
        title="🔬 لوحة المقارنة العلمية"
        subtitle="مبنية على أحدث الدراسات السريرية والأبحاث المحكّمة"
        badge="✅ جميع الجرعات مستندة إلى تجارب سريرية موثّقة"
        accentColor={accentColor}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section Title */}
        <View style={[styles.sectionBadge, { backgroundColor: accentColor + '18', borderColor: accentColor + '40' }]}>
          <Text style={styles.sectionIcon}>{section.icon}</Text>
          <View style={styles.sectionTitleText}>
            <Text style={[styles.sectionH2, { color: accentColor }]}>{section.title}</Text>
            <Text style={styles.sectionSub}>{section.subtitle}</Text>
          </View>
        </View>

        {/* Ingredient Cards */}
        {section.ingredients.map((ing) => (
          <IngredientCard
            key={ing.id}
            ingredient={ing}
            isFavorite={favorites.includes(ing.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}

        {/* Comparison Table */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionIcon}>📊</Text>
          <Text style={styles.sectionH2}>مقارنة المنتجات</Text>
        </View>
        <View style={styles.tableWrapper}>
          <ComparisonTable table={section.comparison} />
        </View>

        {/* Winner Cards */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionIcon}>🏆</Text>
          <Text style={styles.sectionH2}>الفائزون</Text>
        </View>
        {section.winners.map((w, i) => (
          <WinnerCard key={i} winner={w} />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14 },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: 14,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitleText: { flex: 1, alignItems: 'flex-end' },
  sectionIcon: { fontSize: 26 },
  sectionH2: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    fontFamily: FONTS.black,
    textAlign: 'right',
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    textAlign: 'right',
    marginTop: 2,
  },
  tableWrapper: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
});
