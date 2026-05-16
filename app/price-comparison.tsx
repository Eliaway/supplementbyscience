/**
 * مقارنة الأسعار والقيمة
 * Feature: 12 (مقارنة الأسعار)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const PRICE_DATA = [
  {
    supplement: "Omega-3",
    icon: "drop.fill" as const,
    color: "#3B82F6",
    options: [
      { brand: "Nordic Naturals Ultimate Omega", price: 45, servings: 60, dosePerServing: "1280 مغ EPA+DHA", quality: "ممتاز", valueScore: 9.2 },
      { brand: "NOW Foods Ultra Omega-3", price: 22, servings: 90, dosePerServing: "750 مغ EPA+DHA", quality: "جيد جداً", valueScore: 8.8 },
      { brand: "Kirkland Signature", price: 18, servings: 180, dosePerServing: "600 مغ EPA+DHA", quality: "جيد", valueScore: 8.5 },
    ],
  },
  {
    supplement: "Vitamin D3",
    icon: "sun.max.fill" as const,
    color: "#F59E0B",
    options: [
      { brand: "Sports Research Vitamin D3 K2", price: 25, servings: 90, dosePerServing: "5000 IU D3 + 100 mcg K2", quality: "ممتاز", valueScore: 9.5 },
      { brand: "NOW Foods Vitamin D3", price: 12, servings: 120, dosePerServing: "5000 IU", quality: "جيد جداً", valueScore: 9.0 },
      { brand: "Nature Made Vitamin D3", price: 10, servings: 100, dosePerServing: "2000 IU", quality: "جيد", valueScore: 7.5 },
    ],
  },
  {
    supplement: "Magnesium",
    icon: "bolt.fill" as const,
    color: "#10B981",
    options: [
      { brand: "Thorne Magnesium Bisglycinate", price: 35, servings: 60, dosePerServing: "200 مغ", quality: "ممتاز", valueScore: 9.0 },
      { brand: "Doctor's Best High Absorption", price: 18, servings: 120, dosePerServing: "200 مغ", quality: "جيد جداً", valueScore: 9.2 },
      { brand: "Nature Made Magnesium", price: 12, servings: 90, dosePerServing: "250 مغ (أكسيد)", quality: "متوسط", valueScore: 6.0 },
    ],
  },
  {
    supplement: "Zinc",
    icon: "shield.fill" as const,
    color: "#8B5CF6",
    options: [
      { brand: "Thorne Zinc Picolinate", price: 20, servings: 60, dosePerServing: "30 مغ", quality: "ممتاز", valueScore: 9.3 },
      { brand: "NOW Foods Zinc Glycinate", price: 12, servings: 120, dosePerServing: "30 مغ", quality: "جيد جداً", valueScore: 9.0 },
      { brand: "Nature's Bounty Zinc", price: 8, servings: 100, dosePerServing: "50 مغ (أكسيد)", quality: "ضعيف الامتصاص", valueScore: 5.5 },
    ],
  },
];

const VALUE_TIPS = [
  "احسب تكلفة الجرعة الواحدة (السعر ÷ عدد الجرعات) لا سعر المنتج كاملاً",
  "الشكل الكيميائي أهم من العلامة التجارية — Glycinate أفضل من Oxide",
  "الشهادات (NSF, USP, Informed Sport) تضمن الجودة",
  "الكميات الكبيرة (Bulk) أوفر لكن تحقق من الصلاحية",
  "المنتجات الرخيصة جداً قد تحتوي على جرعات غير فعالة",
];

export default function PriceComparisonScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getQualityColor = (quality: string) => {
    if (quality === "ممتاز") return "#10B981";
    if (quality === "جيد جداً") return "#3B82F6";
    if (quality === "جيد") return "#F59E0B";
    return "#EF4444";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>مقارنة الأسعار والقيمة</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>أفضل قيمة مقابل المال لكل مكمل</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Value Tips */}
        <View style={[styles.tipsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tipsTitle, { color: colors.foreground }]}>نصائح لاختيار أفضل قيمة</Text>
          {VALUE_TIPS.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={[styles.tipNum, { color: colors.primary }]}>{i + 1}</Text>
              <Text style={[styles.tipText, { color: colors.muted }]}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Price Comparisons */}
        {PRICE_DATA.map((item) => (
          <View key={item.supplement} style={[styles.priceCard, { backgroundColor: colors.surface, borderColor: item.color + "30" }]}>
            <Pressable
              style={[styles.priceHeader, { backgroundColor: item.color + "10" }]}
              onPress={() => setExpandedId(expandedId === item.supplement ? null : item.supplement)}
            >
              <IconSymbol name={expandedId === item.supplement ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.priceTitle, { color: colors.foreground }]}>{item.supplement}</Text>
              <View style={[styles.priceIcon, { backgroundColor: item.color + "20" }]}>
                <IconSymbol name={item.icon} size={22} color={item.color} />
              </View>
            </Pressable>
            {expandedId === item.supplement && (
              <View style={{ padding: 12, gap: 10 }}>
                {item.options.map((opt, i) => (
                  <View key={i} style={[styles.optionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <View style={styles.optionHeader}>
                      <View style={[styles.valueBadge, { backgroundColor: item.color + "15" }]}>
                        <Text style={[styles.valueScore, { color: item.color }]}>★ {opt.valueScore}</Text>
                      </View>
                      <Text style={[styles.optionBrand, { color: colors.foreground }]}>{opt.brand}</Text>
                    </View>
                    <View style={styles.optionMeta}>
                      <Text style={[styles.optionDose, { color: colors.muted }]}>{opt.dosePerServing}</Text>
                      <Text style={[styles.optionServings, { color: colors.muted }]}>{opt.servings} جرعة</Text>
                      <Text style={[styles.optionPrice, { color: item.color }]}>${opt.price}</Text>
                    </View>
                    <View style={styles.optionFooter}>
                      <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(opt.quality) + "15" }]}>
                        <Text style={[styles.qualityText, { color: getQualityColor(opt.quality) }]}>{opt.quality}</Text>
                      </View>
                      <Text style={[styles.costPerDose, { color: colors.muted }]}>
                        ${(opt.price / opt.servings).toFixed(2)}/جرعة
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
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
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  tipsCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  tipsTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  tipRow: { flexDirection: "row-reverse", gap: 8, alignItems: "flex-start" },
  tipNum: { fontSize: 12, fontWeight: "800", width: 16, textAlign: "center", fontFamily: "Cairo-Black" },
  tipText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  priceCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  priceHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  priceTitle: { flex: 1, fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  priceIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  optionCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  optionHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  valueBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  valueScore: { fontSize: 12, fontWeight: "800", fontFamily: "Cairo-Black" },
  optionBrand: { flex: 1, fontSize: 12, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  optionMeta: { flexDirection: "row-reverse", gap: 10 },
  optionDose: { flex: 1, fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  optionServings: { fontSize: 11, fontFamily: "Cairo" },
  optionPrice: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  optionFooter: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  qualityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  qualityText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  costPerDose: { fontSize: 11, fontFamily: "Cairo" },
});
