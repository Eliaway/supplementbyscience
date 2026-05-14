import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IngredientCard } from '@/components/IngredientCard';
import { ComparisonTable } from '@/components/ComparisonTable';
import { WinnerCard } from '@/components/WinnerCard';
import { AppHeader } from '@/components/AppHeader';
import type { OrganSection } from '@/assets/data/organData';

interface OrganScreenProps {
  section: OrganSection;
}

export function OrganScreen({ section }: OrganScreenProps) {
  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'left', 'right']}>
      {/* App Header */}
      <AppHeader
        title="🔬 لوحة المقارنة العلمية"
        subtitle="مبنية على أحدث الدراسات السريرية والأبحاث المحكّمة"
        badge="✅ جميع الجرعات مستندة إلى تجارب سريرية موثّقة"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Title */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>{section.icon}</Text>
          <View style={styles.sectionTitleText}>
            <Text style={styles.sectionH2}>{section.title}</Text>
            <Text style={styles.sectionSub}>{section.subtitle}</Text>
          </View>
        </View>

        {/* Ingredient Cards */}
        {section.ingredients.map((ing) => (
          <IngredientCard key={ing.id} ingredient={ing} />
        ))}

        {/* Comparison Table */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>📊</Text>
          <Text style={styles.sectionH2}>مقارنة المنتجات</Text>
        </View>
        <View style={styles.tableWrapper}>
          <ComparisonTable table={section.comparison} />
        </View>

        {/* Winner Cards */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionIcon}>🏆</Text>
          <Text style={styles.sectionH2}>الفائزون</Text>
        </View>
        {section.winners.map((w, i) => (
          <WinnerCard key={i} winner={w} />
        ))}

        <View style={styles.bottomPad} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitleText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sectionIcon: {
    fontSize: 28,
  },
  sectionH2: {
    fontSize: 16,
    fontWeight: '900',
    color: '#e2e8f0',
    fontFamily: 'Cairo-Black',
    textAlign: 'right',
  },
  sectionSub: {
    fontSize: 12,
    color: '#475569',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  tableWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f2040',
    marginBottom: 20,
  },
  bottomPad: {
    height: 20,
  },
});
