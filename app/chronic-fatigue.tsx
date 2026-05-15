/**
 * متلازمة التعب المزمن والفيبروميالجيا
 * Features: 99, 100
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const CFS_SUPPLEMENTS = [
  {
    name: "CoQ10 (Ubiquinol)",
    dose: "200-400 مغ يومياً",
    timing: "مع وجبة دسمة",
    evidence: "⭐⭐⭐⭐",
    mechanism: "يدعم إنتاج الطاقة في الميتوكوندريا — مستوياته منخفضة في CFS",
    notes: "استخدم شكل Ubiquinol للامتصاص الأفضل",
    color: "#F59E0B",
  },
  {
    name: "D-Ribose",
    dose: "5 غ 3 مرات يومياً",
    timing: "مع الوجبات",
    evidence: "⭐⭐⭐",
    mechanism: "يدعم إنتاج ATP — الوقود الخلوي الأساسي",
    notes: "دراسة 2012 أظهرت تحسناً في الطاقة والنوم",
    color: "#3B82F6",
  },
  {
    name: "Magnesium Malate",
    dose: "300-400 مغ يومياً",
    timing: "مقسمة على وجبتين",
    evidence: "⭐⭐⭐",
    mechanism: "يدعم وظيفة الميتوكوندريا ويخفف آلام العضلات",
    notes: "شكل Malate أفضل للتعب العضلي من Oxide",
    color: "#10B981",
  },
  {
    name: "NADH",
    dose: "10-20 مغ صباحاً",
    timing: "على معدة فارغة",
    evidence: "⭐⭐⭐",
    mechanism: "ينشط إنتاج الطاقة الخلوية وإصلاح DNA",
    notes: "تجنب مساءً لأنه قد يسبب الأرق",
    color: "#8B5CF6",
  },
  {
    name: "L-Carnitine",
    dose: "1-2 غ يومياً",
    timing: "قبل النشاط البدني",
    evidence: "⭐⭐⭐",
    mechanism: "ينقل الأحماض الدهنية للميتوكوندريا لإنتاج الطاقة",
    notes: "دراسات تشير لتحسن في التعب الذهني والجسدي",
    color: "#EF4444",
  },
  {
    name: "Vitamin B12 (Methylcobalamin)",
    dose: "1000-5000 ميكروغرام",
    timing: "صباحاً تحت اللسان",
    evidence: "⭐⭐⭐⭐",
    mechanism: "ضروري لوظيفة الأعصاب وإنتاج الطاقة",
    notes: "شكل Methylcobalamin أفضل من Cyanocobalamin",
    color: "#F97316",
  },
  {
    name: "Ashwagandha (KSM-66)",
    dose: "300-600 مغ يومياً",
    timing: "مع الطعام",
    evidence: "⭐⭐⭐⭐",
    mechanism: "يخفض الكورتيزول ويحسن تحمل الإجهاد",
    notes: "دراسات تشير لتحسن في الطاقة والنوم والتعب",
    color: "#6366F1",
  },
  {
    name: "Alpha Lipoic Acid",
    dose: "300-600 مغ يومياً",
    timing: "على معدة فارغة",
    evidence: "⭐⭐⭐",
    mechanism: "مضاد أكسدة قوي يدعم وظيفة الميتوكوندريا",
    notes: "يعمل بشكل تآزري مع CoQ10",
    color: "#10B981",
  },
];

const FIBRO_SUPPLEMENTS = [
  { name: "Magnesium Malate", dose: "400-600 مغ", note: "يخفف آلام الفيبروميالجيا", color: "#10B981" },
  { name: "5-HTP", dose: "100-300 مغ مساءً", note: "يحسن النوم ويخفف الألم", color: "#8B5CF6" },
  { name: "Vitamin D3", dose: "5000 IU", note: "نقصه يرتبط بتفاقم الأعراض", color: "#F59E0B" },
  { name: "SAMe", dose: "400-800 مغ", note: "يحسن المزاج ويخفف الألم", color: "#3B82F6" },
  { name: "Melatonin", dose: "3-5 مغ قبل النوم", note: "يحسن جودة النوم المضطربة", color: "#6366F1" },
];

export default function ChronicFatigueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cfs" | "fibro">("cfs");
  const [expandedSupp, setExpandedSupp] = useState<number | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>التعب المزمن والفيبروميالجيا ⚡</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>بروتوكولات مكملات مبنية على الأدلة</Text>
      </View>

      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {[
          { id: "cfs" as const, label: "متلازمة التعب المزمن (CFS)" },
          { id: "fibro" as const, label: "الفيبروميالجيا" },
        ].map(tab => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {activeTab === "cfs" ? (
          <>
            <View style={[styles.infoCard, { backgroundColor: "#F59E0B10", borderColor: "#F59E0B30" }]}>
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                ⚠️ متلازمة التعب المزمن (ME/CFS) حالة معقدة تتطلب إشراف طبي. هذه المكملات مساعدة وليست علاجاً.
              </Text>
            </View>

            {CFS_SUPPLEMENTS.map((supp, i) => (
              <Pressable
                key={i}
                style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: supp.color + "30" }]}
                onPress={() => setExpandedSupp(expandedSupp === i ? null : i)}
              >
                <View style={styles.suppHeader}>
                  <View style={[styles.evidenceBadge, { backgroundColor: supp.color + "15" }]}>
                    <Text style={[styles.evidenceText, { color: supp.color }]}>{supp.evidence}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    <Text style={[styles.suppDose, { color: colors.muted }]}>{supp.dose} — {supp.timing}</Text>
                  </View>
                  <IconSymbol name={expandedSupp === i ? "chevron.down" : "chevron.right"} size={14} color={colors.muted} />
                </View>
                {expandedSupp === i && (
                  <View style={{ gap: 6, marginTop: 8 }}>
                    <Text style={[styles.suppMechanism, { color: colors.foreground }]}>🔬 {supp.mechanism}</Text>
                    <Text style={[styles.suppNotes, { color: "#3B82F6" }]}>💡 {supp.notes}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </>
        ) : (
          <>
            <View style={[styles.infoCard, { backgroundColor: "#8B5CF610", borderColor: "#8B5CF630" }]}>
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                الفيبروميالجيا متلازمة ألم مزمن منتشر. المكملات تساعد في إدارة الأعراض بجانب العلاج الطبي.
              </Text>
            </View>

            {FIBRO_SUPPLEMENTS.map((supp, i) => (
              <View key={i} style={[styles.fibroCard, { backgroundColor: colors.surface, borderColor: supp.color + "30" }]}>
                <View style={[styles.fibroIcon, { backgroundColor: supp.color + "15" }]}>
                  <IconSymbol name="pills.fill" size={20} color={supp.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                  <Text style={[styles.suppDose, { color: colors.muted }]}>{supp.dose}</Text>
                  <Text style={[styles.suppNotes, { color: supp.color }]}>{supp.note}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 11, fontWeight: "700", textAlign: "center" },
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  infoText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  suppCard: { borderRadius: 14, borderWidth: 1, padding: 12 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  evidenceText: { fontSize: 10, fontWeight: "700" },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 11, textAlign: "right", marginTop: 2 },
  suppMechanism: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  suppNotes: { fontSize: 11, lineHeight: 16, textAlign: "right" },
  fibroCard: { flexDirection: "row-reverse", gap: 12, borderRadius: 14, borderWidth: 1, padding: 12 },
  fibroIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
