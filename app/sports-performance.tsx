/**
 * الأداء الرياضي والتعافي
 * Features: 16 (خطة مكملات الرياضيين), 17 (ما قبل وبعد التمرين), 18 (بروتوكول التعافي)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

type SportGoal = "strength" | "endurance" | "bodycomp" | "recovery";

const SPORT_GOALS: { id: SportGoal; title: string; icon: string; color: string }[] = [
  { id: "strength", title: "القوة والضخامة", icon: "💪", color: "#EF4444" },
  { id: "endurance", title: "التحمل والكارديو", icon: "🏃", color: "#F59E0B" },
  { id: "bodycomp", title: "تحسين التركيبة الجسمية", icon: "⚖️", color: "#10B981" },
  { id: "recovery", title: "التعافي السريع", icon: "🔄", color: "#6366F1" },
];

const TIMING_PROTOCOLS = [
  {
    phase: "قبل التمرين (30-60 دقيقة)",
    color: "#EF4444",
    icon: "bolt.fill" as const,
    supplements: [
      { name: "Caffeine", dose: "3-6 مغ/كغ", benefit: "يزيد القوة والتحمل والتركيز" },
      { name: "Beta-Alanine", dose: "3.2 غ", benefit: "يقلل حمض اللاكتيك ويزيد التحمل" },
      { name: "Citrulline Malate", dose: "6-8 غ", benefit: "يزيد تدفق الدم للعضلات (Pump)" },
      { name: "Creatine Monohydrate", dose: "5 غ", benefit: "يزيد ATP المتاح للعضلات" },
    ],
  },
  {
    phase: "أثناء التمرين",
    color: "#F59E0B",
    icon: "flame.fill" as const,
    supplements: [
      { name: "EAAs (الأحماض الأمينية الأساسية)", dose: "10 غ في الماء", benefit: "يمنع هدم العضلات أثناء التمرين الطويل" },
      { name: "Electrolytes (Na+K+Mg+Ca)", dose: "حسب المنتج", benefit: "يعوض الأملاح المفقودة مع العرق" },
      { name: "Carbohydrates (للتحمل)", dose: "30-60 غ/ساعة", benefit: "يحافظ على مستوى الجليكوجين" },
    ],
  },
  {
    phase: "بعد التمرين (30-60 دقيقة)",
    color: "#10B981",
    icon: "arrow.triangle.2.circlepath" as const,
    supplements: [
      { name: "Whey Protein Isolate", dose: "25-40 غ بروتين", benefit: "يبدأ بناء العضلات فوراً" },
      { name: "Creatine Monohydrate", dose: "5 غ", benefit: "يعبئ مخازن الكرياتين" },
      { name: "Carbohydrates (High GI)", dose: "50-80 غ", benefit: "يعيد تعبئة الجليكوجين بسرعة" },
      { name: "Tart Cherry Extract", dose: "480 مغ", benefit: "يقلل التعب العضلي وألم التمرين" },
    ],
  },
  {
    phase: "قبل النوم (للتعافي الليلي)",
    color: "#6366F1",
    icon: "moon.fill" as const,
    supplements: [
      { name: "Casein Protein", dose: "30-40 غ بروتين", benefit: "بروتين بطيء الهضم يغذي العضلات طوال الليل" },
      { name: "Magnesium Glycinate", dose: "400 مغ", benefit: "يقلل ألم العضلات ويحسن جودة النوم" },
      { name: "ZMA (Zinc+Magnesium+B6)", dose: "حسب المنتج", benefit: "يدعم هرمون النمو والتستوستيرون ليلاً" },
      { name: "Glycine", dose: "3 غ", benefit: "يحسن جودة النوم ويدعم التعافي" },
    ],
  },
];

const GOAL_PROTOCOLS: Record<SportGoal, { title: string; supplements: { name: string; dose: string; priority: string; reason: string }[] }> = {
  strength: {
    title: "بروتوكول القوة والضخامة",
    supplements: [
      { name: "Creatine Monohydrate", dose: "5 غ يومياً", priority: "أساسي", reason: "أكثر مكمل مدعوم علمياً لزيادة القوة والضخامة" },
      { name: "Whey Protein Isolate", dose: "1.6-2.2 غ/كغ بروتين يومياً", priority: "أساسي", reason: "يوفر الأحماض الأمينية لبناء العضلات" },
      { name: "Beta-Alanine", dose: "3.2-6.4 غ", priority: "مهم", reason: "يزيد التحمل في التمارين عالية الشدة" },
      { name: "Vitamin D3 + K2", dose: "4000 IU + 180 مكغ", priority: "مهم", reason: "يدعم صحة العظام وإنتاج التستوستيرون" },
      { name: "Zinc + Magnesium", dose: "30 مغ + 400 مغ", priority: "مهم", reason: "يدعم التستوستيرون والتعافي" },
    ],
  },
  endurance: {
    title: "بروتوكول التحمل والكارديو",
    supplements: [
      { name: "Iron (Bisglycinate)", dose: "18-25 مغ", priority: "أساسي", reason: "يمنع فقر الدم الرياضي — شائع جداً عند الرياضيين" },
      { name: "Vitamin B12", dose: "1000 مكغ", priority: "أساسي", reason: "يدعم إنتاج كريات الدم الحمراء" },
      { name: "CoQ10", dose: "200-400 مغ", priority: "مهم", reason: "يحسن كفاءة إنتاج الطاقة الهوائية" },
      { name: "Beetroot/Nitrates", dose: "500 مغ نيترات", priority: "مهم", reason: "يزيد كفاءة استخدام الأكسجين بنسبة 3-5%" },
      { name: "Electrolytes", dose: "أثناء التمرين", priority: "أساسي", reason: "يمنع الجفاف ونقص الأملاح" },
    ],
  },
  bodycomp: {
    title: "بروتوكول تحسين التركيبة الجسمية",
    supplements: [
      { name: "Protein (High Quality)", dose: "1.8-2.4 غ/كغ", priority: "أساسي", reason: "يحافظ على العضلات أثناء الحمية" },
      { name: "Creatine", dose: "5 غ", priority: "مهم", reason: "يحافظ على القوة والعضلات أثناء الحمية" },
      { name: "Caffeine + L-Carnitine", dose: "200 مغ + 2 غ", priority: "مهم", reason: "يزيد حرق الدهون أثناء التمرين" },
      { name: "Berberine", dose: "500 مغ × 2", priority: "مهم", reason: "يحسن حساسية الأنسولين ويقلل تخزين الدهون" },
      { name: "Omega-3", dose: "3 غ EPA+DHA", priority: "مهم", reason: "يقلل الالتهاب ويدعم حرق الدهون" },
    ],
  },
  recovery: {
    title: "بروتوكول التعافي السريع",
    supplements: [
      { name: "Tart Cherry Extract", dose: "480 مغ × 2", priority: "أساسي", reason: "يقلل ألم العضلات بعد التمرين بشكل ملحوظ" },
      { name: "Omega-3 (EPA عالي)", dose: "3-4 غ EPA", priority: "أساسي", reason: "يقلل الالتهاب العضلي بعد التمرين" },
      { name: "Magnesium Glycinate", dose: "400-600 مغ", priority: "أساسي", reason: "يقلل تشنجات وألم العضلات" },
      { name: "Collagen + Vitamin C", dose: "15 غ + 500 مغ", priority: "مهم", reason: "يصلح الأوتار والمفاصل والغضاريف" },
      { name: "Glutamine", dose: "5-10 غ", priority: "مهم", reason: "يدعم مناعة الرياضيين ويقلل الإجهاد" },
    ],
  },
};

export default function SportsPerformanceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<SportGoal>("strength");
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const goalProtocol = GOAL_PROTOCOLS[selectedGoal];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#1a0a0a", borderBottomColor: "#3a1a1a" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#fca5a5" />
          <Text style={[styles.backText, { color: "#fca5a5" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>الأداء الرياضي والتعافي</Text>
        <Text style={[styles.headerSub, { color: "#fca5a5" }]}>بروتوكولات علمية مبنية على الأبحاث</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
        {/* Goal Selection */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>اختر هدفك الرياضي</Text>
        <View style={styles.goalsGrid}>
          {SPORT_GOALS.map((goal) => (
            <Pressable
              key={goal.id}
              style={[styles.goalCard, { backgroundColor: selectedGoal === goal.id ? goal.color + "20" : colors.surface, borderColor: selectedGoal === goal.id ? goal.color : colors.border }]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <Text style={styles.goalEmoji}>{goal.icon}</Text>
              <Text style={[styles.goalTitle, { color: selectedGoal === goal.id ? goal.color : colors.foreground }]}>{goal.title}</Text>
            </Pressable>
          ))}
        </View>

        {/* Goal Protocol */}
        <View style={[styles.protocolCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{goalProtocol.title}</Text>
          {goalProtocol.supplements.map((supp, i) => (
            <View key={i} style={[styles.suppItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.suppHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: supp.priority === "أساسي" ? colors.success + "20" : colors.warning + "20" }]}>
                  <Text style={[styles.priorityText, { color: supp.priority === "أساسي" ? colors.success : colors.warning }]}>{supp.priority}</Text>
                </View>
                <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
              </View>
              <Text style={[styles.suppDose, { color: colors.primary }]}>{supp.dose}</Text>
              <Text style={[styles.suppReason, { color: colors.muted }]}>{supp.reason}</Text>
            </View>
          ))}
        </View>

        {/* Timing Protocol */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>توقيت المكملات</Text>
        {TIMING_PROTOCOLS.map((phase) => (
          <View key={phase.phase} style={[styles.phaseCard, { backgroundColor: colors.card, borderColor: phase.color + "40" }]}>
            <Pressable
              style={[styles.phaseHeader, { backgroundColor: phase.color + "10" }]}
              onPress={() => setExpandedPhase(expandedPhase === phase.phase ? null : phase.phase)}
            >
              <IconSymbol name={expandedPhase === phase.phase ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.phaseTitle, { color: colors.foreground }]}>{phase.phase}</Text>
              <View style={[styles.phaseIcon, { backgroundColor: phase.color + "20" }]}>
                <IconSymbol name={phase.icon} size={18} color={phase.color} />
              </View>
            </Pressable>
            {expandedPhase === phase.phase && (
              <View style={{ padding: 12, gap: 8 }}>
                {phase.supplements.map((supp, i) => (
                  <View key={i} style={[styles.timingSupp, { backgroundColor: phase.color + "08", borderColor: phase.color + "20" }]}>
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    <Text style={[styles.suppDose, { color: phase.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppReason, { color: colors.muted }]}>{supp.benefit}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  goalsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  goalCard: { width: "47%", padding: 14, borderRadius: 14, borderWidth: 1.5, alignItems: "center", gap: 8 },
  goalEmoji: { fontSize: 28, fontFamily: "Cairo" },
  goalTitle: { fontSize: 13, fontWeight: "700", textAlign: "center", fontFamily: "Cairo-Bold" },
  protocolCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  protocolTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", marginBottom: 4, fontFamily: "Cairo-Black" },
  suppItem: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppReason: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  phaseCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  phaseHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  phaseTitle: { flex: 1, fontSize: 14, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  phaseIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  timingSupp: { borderRadius: 10, padding: 10, borderWidth: 1, gap: 3 },
});
