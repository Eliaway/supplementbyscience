import { useLocalSearchParams, useRouter } from "expo-router";
import {
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { CATEGORY_COLORS, CATEGORY_ICONS, useSupplements } from "@/hooks/use-supplements";

I18nManager.forceRTL(true);

export default function ProductDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products } = useSupplements();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()}>
            <IconSymbol name="chevron.right" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>المنتج</Text>
          <View style={{ width: 22 }} />
        </View>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.muted }]}>المنتج غير موجود</Text>
        </View>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[product.category] || "#64748B";
  const catIcon = CATEGORY_ICONS[product.category] || "pills.fill";
  const scoreColor =
    product.score >= 9 ? colors.success :
    product.score >= 7.5 ? colors.primary :
    colors.warning;

  const evidenceColors: Record<string, string> = {
    "عالي جداً": colors.success,
    "عالي": colors.primary,
    "متوسط": colors.warning,
    "منخفض": colors.error,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>{product.name_en}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: catColor + "15", borderColor: catColor + "40" }]}>
          <View style={[styles.heroIcon, { backgroundColor: catColor + "25" }]}>
            <IconSymbol name={catIcon as any} size={40} color={catColor} />
          </View>
          <View style={styles.heroInfo}>
            <Text style={[styles.heroName, { color: colors.foreground }]}>{product.name_en}</Text>
            <Text style={[styles.heroBrand, { color: colors.muted }]}>{product.brand}</Text>
            <View style={[styles.heroCatBadge, { backgroundColor: catColor + "20" }]}>
              <Text style={[styles.heroCatText, { color: catColor }]}>{product.category_ar}</Text>
            </View>
          </View>
          <View style={styles.heroScore}>
            <Text style={[styles.heroScoreNum, { color: scoreColor }]}>{product.score.toFixed(1)}</Text>
            <Text style={[styles.heroScoreSub, { color: colors.muted }]}>/10</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statVal, { color: colors.primary }]}>{product.price}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>السعر</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statVal, { color: evidenceColors[product.evidence_level] || colors.muted }]}>
              {product.evidence_level}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>مستوى الأدلة</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statVal, { color: colors.foreground }]}>{product.ingredients.length}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>مكوّن</Text>
          </View>
        </View>

        {/* Score Bar */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>التقييم العلمي الشامل</Text>
          <View style={styles.scoreBarRow}>
            <View style={[styles.scoreBarBg, { backgroundColor: colors.surface }]}>
              <View style={[styles.scoreBarFill, { width: `${(product.score / 10) * 100}%` as any, backgroundColor: scoreColor }]} />
            </View>
            <Text style={[styles.scoreBarNum, { color: scoreColor }]}>{product.score.toFixed(1)}/10</Text>
          </View>
        </View>

        {/* Ingredients */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكونات الرئيسية</Text>
          {product.ingredients.map((ing, i) => {
            const ingScoreColor =
              ing.score >= 9 ? colors.success :
              ing.score >= 7 ? colors.primary :
              colors.warning;
            return (
              <View
                key={i}
                style={[
                  styles.ingRow,
                  i < product.ingredients.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 0.5 },
                ]}
              >
                <View style={styles.ingLeft}>
                  <View style={[styles.ingScoreBadge, { backgroundColor: ingScoreColor + "20" }]}>
                    <Text style={[styles.ingScoreText, { color: ingScoreColor }]}>{ing.score.toFixed(1)}</Text>
                  </View>
                </View>
                <View style={styles.ingInfo}>
                  <Text style={[styles.ingName, { color: colors.foreground }]}>{ing.name}</Text>
                  <Text style={[styles.ingDose, { color: colors.muted }]}>{ing.dose}</Text>
                  {ing.form && (
                    <View style={[styles.ingFormBadge, { backgroundColor: colors.primary + "15" }]}>
                      <Text style={[styles.ingFormText, { color: colors.primary }]}>{ing.form}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Strengths & Weaknesses */}
        <View style={styles.swRow}>
          <View style={[styles.swCard, { backgroundColor: colors.success + "10", borderColor: colors.success + "30" }]}>
            <View style={styles.swHeader}>
              <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
              <Text style={[styles.swTitle, { color: colors.success }]}>نقاط القوة</Text>
            </View>
            <Text style={[styles.swText, { color: colors.foreground }]}>{product.strengths}</Text>
          </View>
          <View style={[styles.swCard, { backgroundColor: colors.error + "10", borderColor: colors.error + "30" }]}>
            <View style={styles.swHeader}>
              <IconSymbol name="exclamationmark.circle.fill" size={18} color={colors.error} />
              <Text style={[styles.swTitle, { color: colors.error }]}>نقاط الضعف</Text>
            </View>
            <Text style={[styles.swText, { color: colors.foreground }]}>{product.weaknesses}</Text>
          </View>
        </View>

        {/* Best For */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <IconSymbol name="person.fill" size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأفضل لـ</Text>
          </View>
          <Text style={[styles.bodyText, { color: colors.muted }]}>{product.best_for}</Text>
        </View>

        {/* Warnings */}
        {product.warnings && (
          typeof product.warnings === 'string' ? (
            product.warnings.length > 0 && (
              <View style={[styles.section, { backgroundColor: colors.warning + "10", borderColor: colors.warning + "30" }]}>
                <View style={styles.sectionHeaderRow}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
                  <Text style={[styles.sectionTitle, { color: colors.warning }]}>تحذيرات وتفاعلات</Text>
                </View>
                <Text style={[styles.bodyText, { color: colors.foreground }]}>{product.warnings}</Text>
              </View>
            )
          ) : (
            product.warnings.length > 0 && (
              <View style={[styles.section, { backgroundColor: colors.warning + "10", borderColor: colors.warning + "30" }]}>
                <View style={styles.sectionHeaderRow}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
                  <Text style={[styles.sectionTitle, { color: colors.warning }]}>تحذيرات وتفاعلات</Text>
                </View>
                {(product.warnings as string[]).map((w: string, i: number) => (
                  <Text key={i} style={[styles.bodyText, { color: colors.foreground }]}>• {w}</Text>
                ))}
              </View>
            )
          )
        )}

        {/* Food Sources */}
        {product.food_sources && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <IconSymbol name="leaf.fill" size={16} color={colors.success} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المصادر الغذائية البديلة</Text>
            </View>
            <Text style={[styles.bodyText, { color: colors.muted }]}>{product.food_sources}</Text>
          </View>
        )}

        {/* Scientific Note */}
        <View style={[styles.sciNote, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "20" }]}>
          <IconSymbol name="flask.fill" size={16} color={colors.primary} />
          <Text style={[styles.sciNoteText, { color: colors.muted }]}>
            التقييم مبني على الأدلة العلمية من PubMed · NIH · Examine.com · Cochrane Reviews
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", flex: 1, textAlign: "center" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: 16 },
  content: { padding: 16, gap: 14 },
  heroCard: {
    borderRadius: 18, padding: 16, flexDirection: "row-reverse",
    alignItems: "center", gap: 14, borderWidth: 1,
  },
  heroIcon: { width: 72, height: 72, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  heroInfo: { flex: 1, alignItems: "flex-end", gap: 6 },
  heroName: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  heroBrand: { fontSize: 13 },
  heroCatBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  heroCatText: { fontSize: 11, fontWeight: "600" },
  heroScore: { alignItems: "center" },
  heroScoreNum: { fontSize: 32, fontWeight: "900" },
  heroScoreSub: { fontSize: 12 },
  statsRow: { flexDirection: "row-reverse", gap: 10 },
  statCard: { flex: 1, borderRadius: 12, padding: 12, alignItems: "center", gap: 4, borderWidth: 1 },
  statVal: { fontSize: 14, fontWeight: "700", textAlign: "center" },
  statLabel: { fontSize: 10, textAlign: "center" },
  section: { borderRadius: 14, padding: 14, gap: 10, borderWidth: 1 },
  sectionTitle: { fontSize: 15, fontWeight: "700" },
  sectionHeaderRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  scoreBarRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  scoreBarBg: { flex: 1, height: 10, borderRadius: 5, overflow: "hidden" },
  scoreBarFill: { height: "100%", borderRadius: 5 },
  scoreBarNum: { fontSize: 16, fontWeight: "700", minWidth: 40, textAlign: "center" },
  ingRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, paddingVertical: 10 },
  ingLeft: { alignItems: "center" },
  ingScoreBadge: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  ingScoreText: { fontSize: 13, fontWeight: "800" },
  ingInfo: { flex: 1, alignItems: "flex-end", gap: 4 },
  ingName: { fontSize: 14, fontWeight: "600" },
  ingDose: { fontSize: 12 },
  ingFormBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  ingFormText: { fontSize: 10, fontWeight: "600" },
  swRow: { flexDirection: "row-reverse", gap: 10 },
  swCard: { flex: 1, borderRadius: 14, padding: 12, gap: 8, borderWidth: 1 },
  swHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  swTitle: { fontSize: 13, fontWeight: "700" },
  swText: { fontSize: 12, textAlign: "right", lineHeight: 18 },
  bodyText: { fontSize: 13, textAlign: "right", lineHeight: 20 },
  sciNote: {
    borderRadius: 12, padding: 12, flexDirection: "row-reverse",
    gap: 10, alignItems: "flex-start", borderWidth: 1,
  },
  sciNoteText: { flex: 1, fontSize: 11, textAlign: "right", lineHeight: 17 },
});
