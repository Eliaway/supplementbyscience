/**
 * الإقلاع عن التدخين والتخلص من السموم
 * Features: 55 (مكملات المدخنين), 56 (الإقلاع عن التدخين)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const SMOKER_SUPPLEMENTS = [
  { name: "Vitamin C (High Dose)", dose: "2-3 غ/يوم", priority: "عاجل", note: "التدخين يستنزف فيتامين C - المدخن يحتاج 3 أضعاف غير المدخن" },
  { name: "NAC (N-Acetyl Cysteine)", dose: "600-1200 مغ", priority: "عاجل", note: "يرقق المخاط ويحمي الرئتين ويرفع Glutathione" },
  { name: "Vitamin E (Mixed Tocopherols)", dose: "400 IU", priority: "مهم", note: "يحمي أغشية الخلايا من الأكسدة الشديدة للتدخين" },
  { name: "Zinc", dose: "25-30 مغ", priority: "مهم", note: "التدخين يستنزف الزنك - ضروري لإصلاح الأنسجة" },
  { name: "Magnesium", dose: "400 مغ", priority: "مهم", note: "يقلل القلق والتوتر المصاحب للتدخين" },
  { name: "Omega-3", dose: "3 غ", priority: "مهم", note: "يقلل الالتهاب المزمن من التدخين" },
  { name: "CoQ10", dose: "200 مغ", priority: "مفيد", note: "التدخين يستنزف CoQ10 - ضروري لطاقة القلب" },
];

const QUIT_PHASES = [
  {
    phase: "الأسبوع الأول",
    color: "#EF4444",
    supplements: [
      { name: "Magnesium Glycinate", dose: "400-600 مغ", note: "يقلل القلق والتهيج" },
      { name: "5-HTP", dose: "100-200 مغ", note: "يرفع السيروتونين ويقلل الرغبة" },
      { name: "Vitamin C", dose: "2 غ", note: "يقلل الرغبة في التدخين" },
    ],
  },
  {
    phase: "الشهر الأول",
    color: "#F59E0B",
    supplements: [
      { name: "NAC", dose: "600 مغ مرتين", note: "يصلح الرئتين ويقلل السعال" },
      { name: "Ashwagandha", dose: "600 مغ", note: "يقلل التوتر من الإقلاع" },
      { name: "Melatonin", dose: "1-3 مغ", note: "يصلح اضطرابات النوم" },
    ],
  },
  {
    phase: "3-6 أشهر (إصلاح الأضرار)",
    color: "#10B981",
    supplements: [
      { name: "Vitamin D3 + K2", dose: "5000 IU + 200 مكغ", note: "يصلح أضرار العظام والقلب" },
      { name: "CoQ10", dose: "200-300 مغ", note: "يصلح الطاقة الخلوية" },
      { name: "Resveratrol", dose: "500 مغ", note: "يحفز إصلاح الحمض النووي" },
    ],
  },
];

export default function SmokingDetoxScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"smoker" | "quit">("smoker");
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>التدخين والتخلص من السموم</Text>
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {[
          { id: "smoker" as const, label: "للمدخنين" },
          { id: "quit" as const, label: "الإقلاع" },
        ].map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, { borderBottomColor: activeTab === tab.id ? colors.primary : "transparent" }]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {activeTab === "smoker" ? (
          SMOKER_SUPPLEMENTS.map((supp, i) => (
            <View key={i} style={[styles.suppCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.suppHeader}>
                <View style={[styles.priorityBadge, {
                  backgroundColor: supp.priority === "عاجل" ? colors.error + "20" : supp.priority === "مهم" ? colors.warning + "20" : colors.success + "20"
                }]}>
                  <Text style={[styles.priorityText, {
                    color: supp.priority === "عاجل" ? colors.error : supp.priority === "مهم" ? colors.warning : colors.success
                  }]}>{supp.priority}</Text>
                </View>
                <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
              </View>
              <Text style={[styles.suppDose, { color: colors.primary }]}>{supp.dose}</Text>
              <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
            </View>
          ))
        ) : (
          QUIT_PHASES.map((phase) => (
            <View key={phase.phase} style={[styles.phaseCard, { backgroundColor: colors.card, borderColor: phase.color + "40" }]}>
              <Pressable
                style={[styles.phaseHeader, { backgroundColor: phase.color + "10" }]}
                onPress={() => setExpandedPhase(expandedPhase === phase.phase ? null : phase.phase)}
              >
                <IconSymbol name={expandedPhase === phase.phase ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
                <Text style={[styles.phaseTitle, { color: colors.foreground }]}>{phase.phase}</Text>
              </Pressable>
              {expandedPhase === phase.phase && (
                <View style={{ padding: 12, gap: 8 }}>
                  {phase.supplements.map((supp, i) => (
                    <View key={i} style={[styles.suppCard, { backgroundColor: phase.color + "06", borderColor: phase.color + "20" }]}>
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                      <Text style={[styles.suppDose, { color: phase.color }]}>{supp.dose}</Text>
                      <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
                    </View>
                  ))}
                </View>
              )}
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
  tabs: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2 },
  tabText: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  phaseCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  phaseHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  phaseTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
});
