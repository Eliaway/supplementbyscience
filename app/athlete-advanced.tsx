/**
 * بروتوكولات الرياضيين المتقدمة
 * Feature: 16-18 (الرياضيين), 116 (WADA المتقدم)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const SPORT_TYPES = [
  {
    sport: "رياضة القوة (Powerlifting/Bodybuilding)",
    icon: "bolt.fill" as const,
    color: "#EF4444",
    phases: [
      {
        phase: "قبل التمرين (30-60 دقيقة)",
        supplements: [
          { name: "Creatine Monohydrate", dose: "5 g", note: "القوة والانفجارية" },
          { name: "Beta-Alanine", dose: "3.2 g", note: "تأخير الحمض اللبني" },
          { name: "Caffeine", dose: "200-400 mg", note: "تركيز وقوة" },
          { name: "Citrulline Malate", dose: "6-8 g", note: "ضخ الدم للعضلات" },
        ],
      },
      {
        phase: "أثناء التمرين",
        supplements: [
          { name: "EAA / BCAA", dose: "10-15 g", note: "منع الهدم العضلي" },
          { name: "Electrolytes", dose: "حسب التعرق", note: "توازن الأملاح" },
        ],
      },
      {
        phase: "بعد التمرين (30 دقيقة)",
        supplements: [
          { name: "Whey Protein", dose: "30-40 g", note: "بناء عضلي سريع" },
          { name: "Dextrose / Carbs", dose: "50-70 g", note: "تعبئة الجليكوجين" },
          { name: "Creatine", dose: "5 g", note: "إذا لم تأخذها قبل" },
        ],
      },
      {
        phase: "قبل النوم",
        supplements: [
          { name: "Casein Protein", dose: "30-40 g", note: "بروتين بطيء الهضم" },
          { name: "ZMA (Zinc+Magnesium+B6)", dose: "1 كبسولة", note: "هرمونات + نوم" },
          { name: "Ashwagandha", dose: "600 mg", note: "تعافي + تستوستيرون" },
        ],
      },
    ],
  },
  {
    sport: "رياضة التحمل (Marathon/Cycling)",
    icon: "figure.run" as const,
    color: "#10B981",
    phases: [
      {
        phase: "قبل التمرين الطويل",
        supplements: [
          { name: "Beta-Alanine", dose: "3.2 g", note: "تأخير الإجهاد" },
          { name: "Sodium Bicarbonate", dose: "0.3 g/kg", note: "تأخير الحمض اللبني" },
          { name: "Caffeine", dose: "3-6 mg/kg", note: "تحمل وتركيز" },
          { name: "Iron + Vitamin C", dose: "حسب الحاجة", note: "نقل الأكسجين" },
        ],
      },
      {
        phase: "أثناء التمرين (+90 دقيقة)",
        supplements: [
          { name: "Carbohydrates (Gels)", dose: "30-60 g/ساعة", note: "وقود مستمر" },
          { name: "Electrolytes", dose: "كل 20-30 دقيقة", note: "منع التشنجات" },
          { name: "Caffeine", dose: "100 mg", note: "في المنتصف" },
        ],
      },
      {
        phase: "التعافي",
        supplements: [
          { name: "Protein + Carbs (4:1)", dose: "40g بروتين + 80g كارب", note: "إعادة بناء" },
          { name: "Tart Cherry", dose: "480 ml عصير", note: "مضاد التهاب طبيعي" },
          { name: "Omega-3", dose: "3-4 g", note: "تقليل الالتهاب" },
        ],
      },
    ],
  },
  {
    sport: "الرياضات الجماعية (كرة قدم/كرة سلة)",
    icon: "sportscourt.fill" as const,
    color: "#F59E0B",
    phases: [
      {
        phase: "خلال الموسم",
        supplements: [
          { name: "Creatine", dose: "3-5 g", note: "انفجارية وسرعة" },
          { name: "Vitamin D3", dose: "4000 IU", note: "قوة عضلية ومناعة" },
          { name: "Omega-3", dose: "2-3 g", note: "مفاصل وتعافي" },
          { name: "Magnesium", dose: "300-400 mg", note: "منع التشنجات" },
        ],
      },
      {
        phase: "أيام المباريات",
        supplements: [
          { name: "Caffeine", dose: "200-300 mg", note: "3 ساعات قبل" },
          { name: "Creatine", dose: "5 g", note: "مع الإفطار" },
          { name: "Electrolytes", dose: "قبل وأثناء", note: "الترطيب" },
        ],
      },
    ],
  },
];

export default function AthleteAdvancedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedSport, setExpandedSport] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0c1a2e", borderBottomColor: "#1a3a5e" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#7dd3fc" />
          <Text style={[styles.backText, { color: "#7dd3fc" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>بروتوكولات الرياضيين المتقدمة 🏆</Text>
        <Text style={[styles.headerSub, { color: "#7dd3fc" }]}>حسب نوع الرياضة والمرحلة التدريبية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* WADA Warning */}
        <View style={[styles.wadaCard, { backgroundColor: "#EF444415", borderColor: "#EF444430" }]}>
          <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#EF4444" />
          <Text style={[styles.wadaText, { color: colors.foreground }]}>
            تحقق دائماً من قائمة WADA قبل المنافسات الرسمية. بعض المكملات قد تحتوي على مواد محظورة.
          </Text>
        </View>

        {SPORT_TYPES.map((sport) => (
          <View key={sport.sport} style={[styles.sportCard, { backgroundColor: colors.surface, borderColor: sport.color + "30" }]}>
            <Pressable
              style={[styles.sportHeader, { backgroundColor: sport.color + "10" }]}
              onPress={() => setExpandedSport(expandedSport === sport.sport ? null : sport.sport)}
            >
              <IconSymbol name={expandedSport === sport.sport ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.sportTitle, { color: colors.foreground }]}>{sport.sport}</Text>
              <View style={[styles.sportIcon, { backgroundColor: sport.color + "20" }]}>
                <IconSymbol name={sport.icon} size={22} color={sport.color} />
              </View>
            </Pressable>

            {expandedSport === sport.sport && (
              <View style={{ padding: 12, gap: 12 }}>
                {sport.phases.map((phase, pi) => (
                  <View key={pi} style={[styles.phaseCard, { backgroundColor: colors.background, borderColor: sport.color + "20" }]}>
                    <Text style={[styles.phaseTitle, { color: sport.color }]}>{phase.phase}</Text>
                    {phase.supplements.map((s, si) => (
                      <View key={si} style={styles.suppRow}>
                        <Text style={[styles.suppNote, { color: colors.muted }]}>{s.note}</Text>
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
                          <Text style={[styles.suppDose, { color: sport.color }]}>{s.dose}</Text>
                        </View>
                      </View>
                    ))}
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
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  wadaCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", gap: 8, alignItems: "flex-start" },
  wadaText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
  sportCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  sportHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  sportTitle: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" },
  sportIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  phaseCard: { borderRadius: 12, borderWidth: 1, padding: 10, gap: 8 },
  phaseTitle: { fontSize: 12, fontWeight: "800", textAlign: "right" },
  suppRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, paddingVertical: 4, borderTopWidth: 0.5, borderTopColor: "#00000010" },
  suppName: { fontSize: 12, fontWeight: "700", textAlign: "right" },
  suppDose: { fontSize: 11, textAlign: "right" },
  suppNote: { fontSize: 11, textAlign: "right", maxWidth: 100 },
});
