/**
 * دليل الميزانية والتوفير في المكملات
 * Features: 89 (تحسين الميزانية), 90 (أفضل قيمة مقابل السعر)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const BUDGET_TIERS = [
  {
    budget: "ميزانية محدودة (50-100 ريال/شهر)",
    color: "#10B981",
    supplements: [
      { name: "Vitamin D3 + K2", cost: "~15 ريال", priority: 1, note: "أعلى عائد على الاستثمار الصحي" },
      { name: "Magnesium Glycinate", cost: "~20 ريال", priority: 2, note: "يحل 50+ مشكلة صحية" },
      { name: "Omega-3 (جودة متوسطة)", cost: "~25 ريال", priority: 3, note: "أساسي للقلب والدماغ" },
    ],
  },
  {
    budget: "ميزانية متوسطة (200-400 ريال/شهر)",
    color: "#3B82F6",
    supplements: [
      { name: "Vitamin D3 5000 IU + K2 200 مكغ", cost: "~30 ريال", priority: 1, note: "أساس الصحة" },
      { name: "Magnesium Glycinate 400 مغ", cost: "~35 ريال", priority: 2, note: "النوم والأعصاب" },
      { name: "Omega-3 (Nordic Naturals)", cost: "~80 ريال", priority: 3, note: "أفضل جودة" },
      { name: "Zinc Bisglycinate 30 مغ", cost: "~25 ريال", priority: 4, note: "المناعة والهرمونات" },
      { name: "Vitamin B-Complex", cost: "~30 ريال", priority: 5, note: "الطاقة والأعصاب" },
    ],
  },
  {
    budget: "ميزانية مرتفعة (600+ ريال/شهر)",
    color: "#8B5CF6",
    supplements: [
      { name: "Thorne Multi-Vitamin Elite", cost: "~120 ريال", priority: 1, note: "أفضل متعدد فيتامينات" },
      { name: "Nordic Naturals Omega-3", cost: "~100 ريال", priority: 2, note: "أعلى جودة" },
      { name: "Magnesium Glycinate (Thorne)", cost: "~60 ريال", priority: 3, note: "أعلى امتصاص" },
      { name: "Creatine Monohydrate", cost: "~50 ريال", priority: 4, note: "أفضل مكمل للأداء" },
      { name: "Ashwagandha KSM-66", cost: "~80 ريال", priority: 5, note: "إدارة التوتر" },
      { name: "NMN أو NR", cost: "~200 ريال", priority: 6, note: "الطول العمر" },
    ],
  },
];

const SAVING_TIPS = [
  { tip: "اشترِ بالجملة", desc: "الحجم الكبير (180-360 كبسولة) أوفر بـ 30-50%" },
  { tip: "تابع عروض Amazon", desc: "Subscribe & Save يوفر 15% إضافية" },
  { tip: "قارن بالجرعة لا بالسعر", desc: "احسب تكلفة الجرعة اليومية لا سعر العبوة" },
  { tip: "اختر الأشكال الفعالة", desc: "Glycinate وCitrate أغلى لكن تحتاج جرعة أقل" },
  { tip: "تجنب المركبات المبالغ فيها", desc: "المكملات المركبة غالباً جرعاتها غير كافية" },
  { tip: "تحقق من iHerb وAmazon", desc: "أسعار أقل بـ 40-60% من الصيدليات المحلية" },
];

const BEST_VALUE = [
  { name: "Creatine Monohydrate", value: "★★★★★", note: "أرخص مكمل بأعلى أدلة علمية" },
  { name: "Vitamin D3", value: "★★★★★", note: "أرخص 5 ريال/شهر — أعلى فائدة" },
  { name: "Magnesium Glycinate", value: "★★★★★", note: "يحل مشاكل النوم والتوتر والعضلات" },
  { name: "Zinc Bisglycinate", value: "★★★★☆", note: "رخيص ومهم للمناعة والهرمونات" },
  { name: "Omega-3 (NOW Foods)", value: "★★★★☆", note: "جودة جيدة بسعر معقول" },
  { name: "B-Complex", value: "★★★★☆", note: "يحسن الطاقة والمزاج بتكلفة منخفضة" },
];

export default function BudgetGuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedBudget, setExpandedBudget] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>دليل الميزانية والتوفير</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>أفضل قيمة مقابل السعر</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>حسب ميزانيتك</Text>
        {BUDGET_TIERS.map((tier, i) => (
          <View key={i} style={[styles.tierCard, { backgroundColor: colors.card, borderColor: tier.color + "40" }]}>
            <Pressable
              style={[styles.tierHeader, { backgroundColor: tier.color + "10" }]}
              onPress={() => setExpandedBudget(expandedBudget === tier.budget ? null : tier.budget)}
            >
              <IconSymbol name={expandedBudget === tier.budget ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.tierTitle, { color: tier.color }]}>{tier.budget}</Text>
            </Pressable>
            {expandedBudget === tier.budget && (
              <View style={{ padding: 12, gap: 10 }}>
                {tier.supplements.map((supp, j) => (
                  <View key={j} style={[styles.suppCard, { backgroundColor: tier.color + "06", borderColor: tier.color + "20" }]}>
                    <View style={styles.suppHeader}>
                      <View style={[styles.priorityBadge, { backgroundColor: tier.color + "25" }]}>
                        <Text style={[styles.priorityText, { color: tier.color }]}>#{supp.priority}</Text>
                      </View>
                      <Text style={[styles.suppCost, { color: tier.color }]}>{supp.cost}</Text>
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    </View>
                    <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نصائح التوفير</Text>
        {SAVING_TIPS.map((tip, i) => (
          <View key={i} style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.tipTitle, { color: colors.primary }]}>💡 {tip.tip}</Text>
            <Text style={[styles.tipDesc, { color: colors.muted }]}>{tip.desc}</Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أفضل قيمة مقابل السعر</Text>
        {BEST_VALUE.map((item, i) => (
          <View key={i} style={[styles.valueCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.valueRow}>
              <Text style={[styles.valueStars, { color: "#F59E0B" }]}>{item.value}</Text>
              <Text style={[styles.valueName, { color: colors.foreground }]}>{item.name}</Text>
            </View>
            <Text style={[styles.valueNote, { color: colors.muted }]}>{item.note}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  tierCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  tierHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  tierTitle: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 6 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  priorityBadge: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  priorityText: { fontSize: 12, fontWeight: "800", fontFamily: "Cairo-Black" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppCost: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  tipCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  tipTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  tipDesc: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  valueCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  valueRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  valueName: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  valueStars: { fontSize: 14, fontFamily: "Cairo" },
  valueNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
