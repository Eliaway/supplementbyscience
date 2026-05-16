/**
 * دليل الفحوصات الدورية المرتبطة بالمكملات
 * Feature: 26
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const TEST_CATEGORIES = [
  {
    category: "فيتامينات ومعادن أساسية",
    color: "#3B82F6",
    tests: [
      { name: "فيتامين D (25-OH)", normal: "40-80 ng/mL", deficient: "< 20 ng/mL", frequency: "كل 6 أشهر", supplements: ["D3 + K2"], importance: "⭐⭐⭐⭐⭐" },
      { name: "فيتامين B12", normal: "300-900 pg/mL", deficient: "< 200 pg/mL", frequency: "سنوياً", supplements: ["Methylcobalamin"], importance: "⭐⭐⭐⭐⭐" },
      { name: "حديد + فيريتين", normal: "فيريتين: 50-150 ng/mL", deficient: "< 30 ng/mL", frequency: "سنوياً", supplements: ["Ferrous Bisglycinate"], importance: "⭐⭐⭐⭐" },
      { name: "زنك (بلازما)", normal: "70-120 mcg/dL", deficient: "< 70 mcg/dL", frequency: "سنوياً", supplements: ["Zinc Bisglycinate"], importance: "⭐⭐⭐⭐" },
      { name: "مغنيسيوم (RBC)", normal: "4.2-6.8 mg/dL", deficient: "< 4.2 mg/dL", frequency: "سنوياً", supplements: ["Magnesium Glycinate"], importance: "⭐⭐⭐⭐" },
      { name: "أوميغا 3 (Omega-3 Index)", normal: "> 8%", deficient: "< 4%", frequency: "سنوياً", supplements: ["Fish Oil EPA+DHA"], importance: "⭐⭐⭐⭐" },
    ],
  },
  {
    category: "هرمونات وغدد",
    color: "#8B5CF6",
    tests: [
      { name: "تستوستيرون كلي وحر", normal: "كلي: 400-1000 ng/dL", deficient: "< 300 ng/dL", frequency: "سنوياً", supplements: ["Zinc", "Vitamin D", "Ashwagandha"], importance: "⭐⭐⭐⭐" },
      { name: "TSH + T3 + T4 (الغدة الدرقية)", normal: "TSH: 0.5-4.5 mIU/L", deficient: "TSH > 4.5", frequency: "سنوياً", supplements: ["Selenium", "Iodine", "Zinc"], importance: "⭐⭐⭐⭐⭐" },
      { name: "كورتيزول (صباحي)", normal: "6-23 mcg/dL", deficient: "< 6 أو > 23", frequency: "عند الحاجة", supplements: ["Ashwagandha", "Rhodiola"], importance: "⭐⭐⭐" },
      { name: "إستروجين + بروجستيرون (نساء)", normal: "يعتمد على مرحلة الدورة", deficient: "منخفض عن الطبيعي", frequency: "سنوياً", supplements: ["Vitex", "DIM", "Magnesium"], importance: "⭐⭐⭐⭐" },
    ],
  },
  {
    category: "صحة القلب والأوعية",
    color: "#EF4444",
    tests: [
      { name: "Homocysteine (هوموسيستين)", normal: "< 10 μmol/L", deficient: "> 15 خطر عالٍ", frequency: "سنوياً", supplements: ["B6", "B12", "Folate", "TMG"], importance: "⭐⭐⭐⭐⭐" },
      { name: "CRP عالي الحساسية (hsCRP)", normal: "< 1 mg/L", deficient: "> 3 خطر عالٍ", frequency: "سنوياً", supplements: ["Omega-3", "Curcumin", "Vitamin D"], importance: "⭐⭐⭐⭐⭐" },
      { name: "Lp(a) — ليبوبروتين أ", normal: "< 30 mg/dL", deficient: "> 50 خطر عالٍ", frequency: "مرة واحدة", supplements: ["Niacin", "Omega-3"], importance: "⭐⭐⭐⭐" },
      { name: "دهون الدم (Lipid Panel)", normal: "LDL < 100, HDL > 60", deficient: "LDL > 160", frequency: "سنوياً", supplements: ["Omega-3", "Berberine", "Red Yeast Rice"], importance: "⭐⭐⭐⭐⭐" },
    ],
  },
  {
    category: "صحة الكبد والكلى",
    color: "#10B981",
    tests: [
      { name: "ALT + AST (إنزيمات الكبد)", normal: "ALT: 7-56 U/L", deficient: "ارتفاع = ضغط على الكبد", frequency: "سنوياً", supplements: ["Milk Thistle", "NAC", "TUDCA"], importance: "⭐⭐⭐⭐⭐" },
      { name: "Creatinine + GFR (الكلى)", normal: "GFR > 90", deficient: "GFR < 60 = تراجع وظيفة الكلى", frequency: "سنوياً", supplements: ["Astragalus", "Vitamin D"], importance: "⭐⭐⭐⭐⭐" },
      { name: "حمض البوليك (Uric Acid)", normal: "3.4-7 mg/dL", deficient: "> 7 خطر نقرس", frequency: "سنوياً", supplements: ["Tart Cherry", "Vitamin C", "Quercetin"], importance: "⭐⭐⭐" },
    ],
  },
];

export default function HealthTestsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedTest, setExpandedTest] = useState<number | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الفحوصات الدورية المرتبطة بالمكملات 🔬</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>ما تحتاج قياسه قبل وأثناء استخدام المكملات</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={[styles.infoCard, { backgroundColor: "#3B82F610", borderColor: "#3B82F630" }]}>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            💡 الفحوصات الدورية ضرورية لمعرفة نقاط الضعف الفعلية في جسمك وتحديد المكملات التي تحتاجها فعلاً.
          </Text>
        </View>

        {/* Category Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {TEST_CATEGORIES.map((cat, i) => (
            <Pressable
              key={i}
              style={[styles.catBtn, {
                backgroundColor: activeCategory === i ? cat.color : colors.surface,
                borderColor: cat.color + "50",
              }]}
              onPress={() => { setActiveCategory(i); setExpandedTest(null); }}
            >
              <Text style={[styles.catText, { color: activeCategory === i ? "#fff" : cat.color }]}>
                {cat.category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Tests List */}
        {TEST_CATEGORIES[activeCategory].tests.map((test, i) => (
          <Pressable
            key={i}
            style={[styles.testCard, { backgroundColor: colors.surface, borderColor: TEST_CATEGORIES[activeCategory].color + "30" }]}
            onPress={() => setExpandedTest(expandedTest === i ? null : i)}
          >
            <View style={styles.testHeader}>
              <IconSymbol name={expandedTest === i ? "chevron.down" : "chevron.right"} size={14} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.testName, { color: colors.foreground }]}>{test.name}</Text>
                <Text style={[styles.testFreq, { color: colors.muted }]}>التكرار: {test.frequency}</Text>
              </View>
              <Text style={styles.importance}>{test.importance}</Text>
            </View>

            {expandedTest === i && (
              <View style={{ gap: 8, marginTop: 10 }}>
                <View style={[styles.rangeRow, { backgroundColor: "#10B98110" }]}>
                  <Text style={[styles.rangeLabel, { color: "#10B981" }]}>✅ الطبيعي:</Text>
                  <Text style={[styles.rangeValue, { color: colors.foreground }]}>{test.normal}</Text>
                </View>
                <View style={[styles.rangeRow, { backgroundColor: "#EF444410" }]}>
                  <Text style={[styles.rangeLabel, { color: "#EF4444" }]}>⚠️ النقص:</Text>
                  <Text style={[styles.rangeValue, { color: colors.foreground }]}>{test.deficient}</Text>
                </View>
                <View style={{ gap: 4 }}>
                  <Text style={[styles.suppLabel, { color: colors.muted }]}>💊 المكملات الموصى بها:</Text>
                  <View style={styles.suppChips}>
                    {test.supplements.map((s, j) => (
                      <View key={j} style={[styles.suppChip, { backgroundColor: TEST_CATEGORIES[activeCategory].color + "15", borderColor: TEST_CATEGORIES[activeCategory].color + "30" }]}>
                        <Text style={[styles.suppChipText, { color: TEST_CATEGORIES[activeCategory].color }]}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600", fontFamily: "Cairo-Bold" },
  headerTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  infoText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  catRow: { flexDirection: "row-reverse", gap: 8, paddingHorizontal: 2 },
  catBtn: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  catText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  testCard: { borderRadius: 14, borderWidth: 1, padding: 12 },
  testHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  testName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  testFreq: { fontSize: 10, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  importance: { fontSize: 12, fontFamily: "Cairo" },
  rangeRow: { flexDirection: "row-reverse", gap: 8, borderRadius: 8, padding: 8, alignItems: "flex-start" },
  rangeLabel: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  rangeValue: { fontSize: 11, flex: 1, textAlign: "right", fontFamily: "Cairo" },
  suppLabel: { fontSize: 11, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppChips: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  suppChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  suppChipText: { fontSize: 10, fontWeight: "600", fontFamily: "Cairo-Bold" },
});
