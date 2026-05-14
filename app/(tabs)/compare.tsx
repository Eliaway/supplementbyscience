import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { overallProducts } from '@/assets/data/organData';

type FilterType = 'all' | 'liver' | 'heart' | 'kidney';

const filters: { id: FilterType; label: string; icon: string; color: string }[] = [
  { id: 'all', label: 'الكل', icon: '📊', color: '#38bdf8' },
  { id: 'liver', label: 'الكبد', icon: '🟡', color: '#f59e0b' },
  { id: 'heart', label: 'القلب', icon: '❤️', color: '#ef4444' },
  { id: 'kidney', label: 'الكلى', icon: '🟣', color: '#8b5cf6' },
];

const scoreColors = { s: '#10b981', m: '#0ea5e9', l: '#f59e0b' };
const ppsColors = { g: '#34d399', m: '#fbbf24', b: '#f87171' };

export default function CompareScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filtered = overallProducts.filter(p => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'liver') return p.organ.includes('الكبد');
    if (activeFilter === 'heart') return p.organ.includes('القلب');
    if (activeFilter === 'kidney') return p.organ.includes('الكلى');
    return true;
  });

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 المقارنة الشاملة</Text>
        <Text style={styles.headerSub}>تقييم موحّد بناءً على الجرعة + الدليل العلمي + القيمة + التوفر</Text>
        <View style={styles.sciBadge}>
          <Text style={styles.sciBadgeText}>✅ جميع الجرعات مستندة إلى تجارب سريرية موثّقة</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filters.map(f => (
          <Pressable
            key={f.id}
            style={[
              styles.filterBtn,
              activeFilter === f.id && { borderBottomColor: f.color, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveFilter(f.id)}
          >
            <Text style={styles.filterIcon}>{f.icon}</Text>
            <Text style={[styles.filterLabel, activeFilter === f.id && { color: f.color }]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Best of each organ */}
        {activeFilter === 'all' && (
          <View style={styles.bestSection}>
            <Text style={styles.bestTitle}>🏆 الأفضل في كل فئة</Text>
            <View style={styles.bestGrid}>
              {[
                { icon: '🟡', label: 'الكبد', name: 'Infinis LIVER', score: 96, color: '#f59e0b' },
                { icon: '❤️', label: 'القلب', name: 'Morphogen CARDIO', score: 94, color: '#ef4444' },
                { icon: '🟣', label: 'الكلى', name: 'Morphogen RENAL', score: 88, color: '#8b5cf6' },
              ].map((b, i) => (
                <View key={i} style={[styles.bestCard, { borderTopColor: b.color }]}>
                  <Text style={styles.bestCardIcon}>{b.icon}</Text>
                  <Text style={styles.bestCardLabel}>{b.label}</Text>
                  <Text style={styles.bestCardName}>{b.name}</Text>
                  <Text style={[styles.bestCardScore, { color: b.color }]}>{b.score}/100</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Products List */}
        <Text style={styles.listTitle}>
          {activeFilter === 'all' ? 'جميع المنتجات' : `منتجات ${filters.find(f => f.id === activeFilter)?.label}`}
          {' '}({filtered.length})
        </Text>

        {filtered.map((product, idx) => (
          <View key={idx} style={styles.productCard}>
            <View style={styles.productHeader}>
              <View style={styles.productLeft}>
                {product.badge && <Text style={styles.productBadge}>{product.badge}</Text>}
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={[styles.productOrgan, { color: product.organColor }]}>{product.organ}</Text>
              </View>
              <View style={styles.productRight}>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={[styles.productPps, { color: ppsColors[product.ppsType] }]}>
                  {product.pps}/حصة
                </Text>
              </View>
            </View>

            {/* Score Bar */}
            <View style={styles.scoreRow}>
              <View style={styles.scoreBarBg}>
                <View
                  style={[
                    styles.scoreBarFill,
                    { width: `${product.score}%`, backgroundColor: scoreColors[product.scoreType] },
                  ]}
                />
              </View>
              <Text style={[styles.scoreNum, { color: scoreColors[product.scoreType] }]}>
                {product.score}/100
              </Text>
            </View>

            {/* Key Ingredients */}
            <Text style={styles.keyIngredients}>{product.keyIngredients}</Text>

            {/* Availability */}
            <Text style={product.available ? styles.availY : styles.availN}>
              {product.available ? '✅ متوفر' : '❌ نفذ من المخزون'}
            </Text>
          </View>
        ))}

        {/* Scientific Note */}
        <View style={styles.sciNote}>
          <Text style={styles.sciNoteTitle}>🔬 ملاحظة علمية</Text>
          <Text style={styles.sciNoteText}>
            جميع التقييمات مبنية على: جرعة المكوّن الفعّالة سريرياً + شكل المكوّن (امتصاصية) + وجود أدلة RCT/Meta-Analysis + القيمة مقابل السعر + التوفر الفعلي.
          </Text>
          <Text style={styles.sciNoteText}>
            المصادر: PubMed · NIH · Examine.com · Cochrane Reviews
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#060d1a',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#38bdf8',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
  sciBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sciBadgeText: {
    fontSize: 11,
    color: '#34d399',
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(6,13,26,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#0f2040',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterIcon: {
    fontSize: 18,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    fontFamily: 'Cairo',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  bestSection: {
    marginBottom: 20,
  },
  bestTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    fontFamily: 'Cairo',
    textAlign: 'right',
    marginBottom: 12,
  },
  bestGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  bestCard: {
    flex: 1,
    backgroundColor: 'rgba(10,22,42,0.8)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#0f2040',
    borderTopWidth: 2,
    alignItems: 'center',
  },
  bestCardIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  bestCardLabel: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: 'Cairo',
    marginBottom: 2,
  },
  bestCardName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#e2e8f0',
    fontFamily: 'Cairo',
    textAlign: 'center',
    marginBottom: 4,
  },
  bestCardScore: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Cairo',
  },
  listTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    fontFamily: 'Cairo',
    textAlign: 'right',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: 'rgba(10,22,42,0.8)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#0f2040',
    marginBottom: 10,
    gap: 8,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productLeft: {
    flex: 1,
    alignItems: 'flex-end',
  },
  productRight: {
    alignItems: 'flex-start',
    marginLeft: 12,
  },
  productBadge: {
    fontSize: 16,
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  productOrgan: {
    fontSize: 11,
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e2e8f0',
    fontFamily: 'Cairo',
  },
  productPps: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Cairo',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#0a1628',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f2040',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreNum: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Cairo',
    minWidth: 50,
    textAlign: 'right',
  },
  keyIngredients: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'Cairo',
    textAlign: 'right',
    lineHeight: 18,
  },
  availY: {
    fontSize: 11,
    color: '#34d399',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  availN: {
    fontSize: 11,
    color: '#f87171',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  sciNote: {
    backgroundColor: 'rgba(56,189,248,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.15)',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    gap: 8,
  },
  sciNoteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38bdf8',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  sciNoteText: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'Cairo',
    textAlign: 'right',
    lineHeight: 18,
  },
});
