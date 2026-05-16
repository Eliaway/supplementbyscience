/**
 * دليل تكديس المكملات (Supplement Stacking)
 * Features: 76 (تكديس المكملات), 77 (التآزر), 78 (التعارض)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const SYNERGY_STACKS = [
  {
    name: "مجموعة الطاقة والتركيز",
    color: "#F59E0B",
    items: ["Caffeine 100 مغ", "L-Theanine 200 مغ", "B-Complex", "CoQ10 100 مغ"],
    benefit: "تركيز حاد + طاقة مستدامة بدون قلق أو هبوط",
    timing: "صباحاً مع الإفطار",
  },
  {
    name: "مجموعة النوم العميق",
    color: "#8B5CF6",
    items: ["Magnesium Glycinate 400 مغ", "L-Theanine 200 مغ", "Glycine 3 غ", "Melatonin 0.5-1 مغ"],
    benefit: "نوم أعمق + تحسين مرحلة REM + استيقاظ منتعش",
    timing: "30-60 دقيقة قبل النوم",
  },
  {
    name: "مجموعة الصحة العامة (الأساسية)",
    color: "#10B981",
    items: ["Omega-3 3 غ", "Vitamin D3 5000 IU", "Vitamin K2 200 مكغ", "Magnesium 400 مغ"],
    benefit: "أساس صحي متكامل — يغطي أكثر النقاوص شيوعاً",
    timing: "مع الطعام",
  },
  {
    name: "مجموعة بناء العضلات",
    color: "#3B82F6",
    items: ["Creatine Monohydrate 5 غ", "Protein Powder 25-30 غ", "Beta-Alanine 3.2 غ", "Citrulline Malate 8 غ"],
    benefit: "زيادة القوة + الكتلة العضلية + التحمل",
    timing: "قبل التمرين وبعده",
  },
  {
    name: "مجموعة الطول العمر (Longevity Stack)",
    color: "#EC4899",
    items: ["NMN أو NR 500 مغ", "Resveratrol 500 مغ", "Quercetin 500 مغ", "Spermidine 1 مغ"],
    benefit: "تفعيل Sirtuins + تنشيط الأوتوفاجي + إصلاح الحمض النووي",
    timing: "صباحاً مع الإفطار",
  },
  {
    name: "مجموعة الهرمونات الذكورية",
    color: "#6366F1",
    items: ["Zinc 30 مغ", "Magnesium 400 مغ", "Vitamin D3 5000 IU", "Ashwagandha 600 مغ"],
    benefit: "دعم مستويات التستوستيرون الطبيعية",
    timing: "قبل النوم",
  },
];

const CONFLICTS = [
  {
    combo: "Calcium + Iron",
    severity: "عالي",
    note: "يتنافسان على نفس الناقل — خذهما بفارق 2 ساعة على الأقل",
    color: "#EF4444",
  },
  {
    combo: "Zinc + Copper",
    severity: "عالي",
    note: "الزنك الزائد يستنزف النحاس — أضف 2 مغ نحاس لكل 30 مغ زنك",
    color: "#EF4444",
  },
  {
    combo: "5-HTP + SSRI",
    severity: "خطير",
    note: "خطر متلازمة السيروتونين — لا تجمع أبداً",
    color: "#7F1D1D",
  },
  {
    combo: "Vitamin E + Warfarin",
    severity: "عالي",
    note: "يزيد خطر النزيف — استشر طبيبك",
    color: "#EF4444",
  },
  {
    combo: "Magnesium + Calcium (جرعات عالية)",
    severity: "متوسط",
    note: "يتنافسان على الامتصاص — خذهما في أوقات مختلفة",
    color: "#F59E0B",
  },
  {
    combo: "Iron + Vitamin E",
    severity: "متوسط",
    note: "يتأكسد الحديد فيتامين E — خذهما بفارق ساعتين",
    color: "#F59E0B",
  },
  {
    combo: "Fat-soluble vitamins (A, D, E, K) معاً",
    severity: "منخفض",
    note: "يتنافسون على الامتصاص — خذهما مع الدهون الصحية",
    color: "#10B981",
  },
];

const ABSORPTION_TIPS = [
  { tip: "مع الدهون", supplements: "D3, K2, A, E, CoQ10, Omega-3, Curcumin", icon: "🥑" },
  { tip: "مع الطعام", supplements: "Iron, Zinc, Magnesium, B-Complex", icon: "🍽️" },
  { tip: "على معدة فارغة", supplements: "Probiotics, L-Glutamine, Collagen", icon: "⏰" },
  { tip: "صباحاً", supplements: "Vitamin D3, B12, Iodine, Adaptogens", icon: "🌅" },
  { tip: "قبل النوم", supplements: "Magnesium, Melatonin, Glycine, Zinc", icon: "🌙" },
  { tip: "قبل التمرين", supplements: "Creatine, Caffeine, Beta-Alanine, Citrulline", icon: "💪" },
];

export default function StackingGuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"synergy" | "conflicts" | "absorption">("synergy");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>دليل تكديس المكملات</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>التآزر • التعارض • أوقات الامتصاص</Text>
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(["synergy", "conflicts", "absorption"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.muted }]}>
              {tab === "synergy" ? "مجموعات فعالة" : tab === "conflicts" ? "تعارضات" : "أوقات الامتصاص"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {activeTab === "synergy" && SYNERGY_STACKS.map((stack, i) => (
          <View key={i} style={[styles.stackCard, { backgroundColor: colors.card, borderColor: stack.color + "40" }]}>
            <View style={[styles.stackHeader, { backgroundColor: stack.color + "12" }]}>
              <Text style={[styles.stackName, { color: colors.foreground }]}>{stack.name}</Text>
            </View>
            <View style={{ padding: 12, gap: 8 }}>
              <View style={styles.itemsRow}>
                {stack.items.map((item, j) => (
                  <View key={j} style={[styles.itemBadge, { backgroundColor: stack.color + "15" }]}>
                    <Text style={[styles.itemText, { color: stack.color }]}>{item}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.benefitText, { color: colors.foreground }]}>✅ {stack.benefit}</Text>
              <Text style={[styles.timingText, { color: colors.muted }]}>⏰ {stack.timing}</Text>
            </View>
          </View>
        ))}

        {activeTab === "conflicts" && CONFLICTS.map((conflict, i) => (
          <View key={i} style={[styles.conflictCard, { backgroundColor: colors.card, borderColor: conflict.color + "40" }]}>
            <View style={[styles.conflictHeader, { backgroundColor: conflict.color + "12" }]}>
              <View style={[styles.severityBadge, { backgroundColor: conflict.color + "25" }]}>
                <Text style={[styles.severityText, { color: conflict.color }]}>{conflict.severity}</Text>
              </View>
              <Text style={[styles.conflictCombo, { color: colors.foreground }]}>{conflict.combo}</Text>
            </View>
            <Text style={[styles.conflictNote, { color: colors.muted }]}>{conflict.note}</Text>
          </View>
        ))}

        {activeTab === "absorption" && ABSORPTION_TIPS.map((tip, i) => (
          <View key={i} style={[styles.absorptionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.absorptionHeader}>
              <Text style={styles.absorptionIcon}>{tip.icon}</Text>
              <Text style={[styles.absorptionTip, { color: colors.primary }]}>{tip.tip}</Text>
            </View>
            <Text style={[styles.absorptionSupps, { color: colors.muted }]}>{tip.supplements}</Text>
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
  tabs: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  stackCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  stackHeader: { padding: 12 },
  stackName: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  itemsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  itemBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  itemText: { fontSize: 11, fontWeight: "600", fontFamily: "Cairo-Bold" },
  benefitText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  timingText: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  conflictCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  conflictHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 12, gap: 10 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  severityText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  conflictCombo: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  conflictNote: { padding: 12, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  absorptionCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  absorptionHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  absorptionIcon: { fontSize: 24, fontFamily: "Cairo" },
  absorptionTip: { fontSize: 15, fontWeight: "800", fontFamily: "Cairo-Black" },
  absorptionSupps: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
