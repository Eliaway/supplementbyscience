/**
 * محسّن توقيت المكملات
 * Feature: 30 (توقيت الجرعات), 31 (تحسين الامتصاص), 32 (التوقيت مع الوجبات)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const TIMING_RULES = [
  {
    category: "مع الطعام الدهني",
    icon: "drop.fill" as const,
    color: "#F59E0B",
    supplements: ["Omega-3", "Vitamin D", "Vitamin K2", "Vitamin E", "CoQ10", "Curcumin", "Astaxanthin"],
    reason: "تذوب في الدهون — الامتصاص يزيد 3-5 أضعاف مع الطعام الدهني",
  },
  {
    category: "على معدة فارغة",
    icon: "clock.fill" as const,
    color: "#3B82F6",
    supplements: ["Magnesium Glycinate", "L-Glutamine", "Probiotics", "Melatonin", "5-HTP", "Berberine"],
    reason: "الامتصاص أفضل بدون تنافس مع بروتينات الطعام",
  },
  {
    category: "صباحاً",
    icon: "sun.max.fill" as const,
    color: "#F97316",
    supplements: ["Vitamin B Complex", "Vitamin C", "Iron", "Iodine", "Ashwagandha (صباحي)", "Rhodiola"],
    reason: "يعطي طاقة ونشاطاً — لا يعطل النوم",
  },
  {
    category: "مساءً / قبل النوم",
    icon: "moon.fill" as const,
    color: "#8B5CF6",
    supplements: ["Magnesium", "Zinc", "Melatonin", "L-Theanine", "Glycine", "Ashwagandha (مسائي)", "Apigenin"],
    reason: "يدعم النوم والتعافي الليلي وإفراز هرمون النمو",
  },
  {
    category: "قبل التمرين (30-60 دقيقة)",
    icon: "bolt.fill" as const,
    color: "#10B981",
    supplements: ["Creatine", "Beta-Alanine", "Caffeine", "L-Citrulline", "Pre-workout", "B12"],
    reason: "يُحسّن الأداء والتركيز والضخ العضلي",
  },
  {
    category: "بعد التمرين",
    icon: "figure.run" as const,
    color: "#EF4444",
    supplements: ["Protein Powder", "Creatine (بديل)", "L-Glutamine", "BCAAs", "Vitamin C", "Magnesium"],
    reason: "يدعم التعافي وإعادة بناء العضلات",
  },
  {
    category: "لا تجمع معاً",
    icon: "xmark.circle.fill" as const,
    color: "#DC2626",
    supplements: ["Zinc + Calcium", "Iron + Calcium", "Iron + Coffee/Tea", "Magnesium + Zinc (جرعات عالية)", "Fat-soluble vitamins + Fiber"],
    reason: "ينافسون على نفس ناقلات الامتصاص — يقلل الفعالية",
  },
];

const MEAL_TIMING = [
  { time: "07:00", label: "الإفطار", icon: "sun.max.fill" as const, color: "#F59E0B", supplements: ["Vitamin D", "Omega-3", "Vitamin K2", "B Complex", "Iron"] },
  { time: "13:00", label: "الغداء", icon: "fork.knife" as const, color: "#10B981", supplements: ["CoQ10", "Vitamin E", "Curcumin", "Zinc"] },
  { time: "17:00", label: "قبل التمرين", icon: "bolt.fill" as const, color: "#3B82F6", supplements: ["Creatine", "Beta-Alanine", "L-Citrulline"] },
  { time: "19:00", label: "العشاء", icon: "moon.stars.fill" as const, color: "#8B5CF6", supplements: ["Magnesium", "Vitamin C", "Probiotics"] },
  { time: "22:00", label: "قبل النوم", icon: "moon.fill" as const, color: "#6366F1", supplements: ["Melatonin", "L-Theanine", "Glycine", "Ashwagandha"] },
];

export default function TimingOptimizerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"rules" | "schedule">("rules");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>محسّن توقيت المكملات</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>متى تأخذ كل مكمل لأقصى امتصاص</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {[{ id: "rules", label: "قواعد التوقيت" }, { id: "schedule", label: "الجدول اليومي" }].map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {activeTab === "rules" ? (
          TIMING_RULES.map((rule) => (
            <View key={rule.category} style={[styles.ruleCard, { backgroundColor: colors.surface, borderColor: rule.color + "30" }]}>
              <Pressable
                style={[styles.ruleHeader, { backgroundColor: rule.color + "10" }]}
                onPress={() => setExpandedId(expandedId === rule.category ? null : rule.category)}
              >
                <IconSymbol name={expandedId === rule.category ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
                <Text style={[styles.ruleTitle, { color: colors.foreground }]}>{rule.category}</Text>
                <View style={[styles.ruleIcon, { backgroundColor: rule.color + "20" }]}>
                  <IconSymbol name={rule.icon} size={22} color={rule.color} />
                </View>
              </Pressable>
              {expandedId === rule.category && (
                <View style={{ padding: 12, gap: 8 }}>
                  <Text style={[styles.ruleReason, { color: colors.muted, backgroundColor: rule.color + "10" }]}>{rule.reason}</Text>
                  <View style={styles.supplementsGrid}>
                    {rule.supplements.map((s) => (
                      <View key={s} style={[styles.supplementTag, { backgroundColor: rule.color + "15", borderColor: rule.color + "30" }]}>
                        <Text style={[styles.supplementTagText, { color: rule.color }]}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          MEAL_TIMING.map((meal) => (
            <View key={meal.time} style={[styles.mealCard, { backgroundColor: colors.surface, borderColor: meal.color + "30" }]}>
              <View style={[styles.mealTime, { backgroundColor: meal.color + "15" }]}>
                <Text style={[styles.mealTimeText, { color: meal.color }]}>{meal.time}</Text>
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <View style={styles.mealHeader}>
                  <IconSymbol name={meal.icon} size={16} color={meal.color} />
                  <Text style={[styles.mealLabel, { color: colors.foreground }]}>{meal.label}</Text>
                </View>
                <View style={styles.supplementsRow}>
                  {meal.supplements.map((s) => (
                    <View key={s} style={[styles.supplementTag, { backgroundColor: meal.color + "15", borderColor: meal.color + "30" }]}>
                      <Text style={[styles.supplementTagText, { color: meal.color }]}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))
        )}
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
  tabText: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  ruleCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  ruleHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  ruleTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  ruleIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  ruleReason: { fontSize: 12, lineHeight: 18, textAlign: "right", padding: 10, borderRadius: 10, fontFamily: "Cairo" },
  supplementsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  supplementTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  supplementTagText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  mealCard: { borderRadius: 16, borderWidth: 1, padding: 12, flexDirection: "row-reverse", gap: 12, alignItems: "flex-start" },
  mealTime: { width: 60, height: 60, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  mealTimeText: { fontSize: 14, fontWeight: "900", fontFamily: "Cairo-Black" },
  mealHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  mealLabel: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  supplementsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
});
