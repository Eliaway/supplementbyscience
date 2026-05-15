/**
 * بروتوكول التعافي من كوفيد وما بعد كوفيد
 * Feature: 143
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const PHASES = [
  {
    phase: "المرحلة الحادة",
    subtitle: "أثناء الإصابة (أول 10 أيام)",
    color: "#EF4444",
    supplements: [
      { name: "فيتامين D3", dose: "10,000 IU يومياً", note: "يدعم المناعة ويخفف الالتهاب" },
      { name: "زنك", dose: "30-50 مغ يومياً", note: "يثبط تكاثر الفيروسات" },
      { name: "فيتامين C", dose: "2-4 غ يومياً مقسمة", note: "مضاد أكسدة قوي ودعم مناعي" },
      { name: "Quercetin", dose: "500-1000 مغ", note: "يساعد الزنك على دخول الخلايا" },
      { name: "Melatonin", dose: "10-20 مغ قبل النوم", note: "مضاد التهاب قوي ومضاد للفيروسات" },
    ],
  },
  {
    phase: "مرحلة التعافي",
    subtitle: "الأسابيع 2-6 بعد الإصابة",
    color: "#F59E0B",
    supplements: [
      { name: "NAC (N-Acetyl Cysteine)", dose: "600-1200 مغ", note: "يدعم إنتاج الجلوتاثيون ويحمي الرئتين" },
      { name: "CoQ10 (Ubiquinol)", dose: "200-400 مغ", note: "يستعيد طاقة الميتوكوندريا" },
      { name: "Omega-3", dose: "3-4 غ يومياً", note: "يخفف الالتهاب ويدعم القلب" },
      { name: "Magnesium Glycinate", dose: "400 مغ", note: "يخفف آلام العضلات والإجهاد" },
      { name: "B-Complex", dose: "جرعة عالية", note: "يدعم الجهاز العصبي والطاقة" },
    ],
  },
  {
    phase: "Long COVID",
    subtitle: "الأعراض المستمرة بعد 12 أسبوع",
    color: "#8B5CF6",
    supplements: [
      { name: "Low-dose Naltrexone (LDN)", dose: "1.5-4.5 مغ (بوصفة طبية)", note: "يعدّل المناعة ويخفف الأعراض" },
      { name: "NADH + CoQ10", dose: "10 مغ + 200 مغ", note: "لمتلازمة التعب المزمن المرتبطة بكوفيد" },
      { name: "Nattokinase", dose: "2000 FU يومياً", note: "يذيب جلطات الميكرو المرتبطة بكوفيد" },
      { name: "Lumbrokinase", dose: "20 مغ يومياً", note: "إنزيم تحلل الجلطات — بديل أو مكمل للناتوكيناز" },
      { name: "Vitamin D3 + K2", dose: "5000 IU + 200 ميكروغرام", note: "يدعم المناعة ويحمي الأوعية" },
    ],
  },
];

const SYMPTOMS_MAP = [
  { symptom: "ضباب الدماغ", supplements: ["Lion's Mane", "Omega-3 DHA", "Phosphatidylserine", "NADH"], color: "#8B5CF6" },
  { symptom: "التعب الشديد", supplements: ["CoQ10", "D-Ribose", "L-Carnitine", "NADH", "B12"], color: "#F59E0B" },
  { symptom: "ضيق التنفس", supplements: ["NAC", "Magnesium", "Vitamin D3", "Omega-3"], color: "#3B82F6" },
  { symptom: "خفقان القلب", supplements: ["Magnesium Glycinate", "CoQ10", "Omega-3", "Taurine"], color: "#EF4444" },
  { symptom: "آلام العضلات", supplements: ["Magnesium Malate", "Vitamin D3", "Omega-3", "Turmeric"], color: "#10B981" },
  { symptom: "اضطرابات النوم", supplements: ["Melatonin", "Magnesium Glycinate", "L-Theanine", "5-HTP"], color: "#6366F1" },
];

export default function PostCovidScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activePhase, setActivePhase] = useState(0);
  const [expandedSymptom, setExpandedSymptom] = useState<number | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>التعافي من كوفيد وما بعده 🦠</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>بروتوكولات مكملات مبنية على أحدث الأبحاث</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.warningCard, { backgroundColor: "#EF444410", borderColor: "#EF444430" }]}>
          <Text style={[styles.warningText, { color: colors.foreground }]}>
            ⚠️ هذه المعلومات للتثقيف فقط. استشر طبيبك قبل استخدام أي مكملات خاصة في مرحلة المرض الحاد.
          </Text>
        </View>

        {/* Phase Selector */}
        <View style={styles.phaseSelector}>
          {PHASES.map((phase, i) => (
            <Pressable
              key={i}
              style={[styles.phaseBtn, {
                backgroundColor: activePhase === i ? phase.color : colors.surface,
                borderColor: phase.color + "50",
              }]}
              onPress={() => setActivePhase(i)}
            >
              <Text style={[styles.phaseBtnText, { color: activePhase === i ? "#fff" : phase.color }]}>
                {phase.phase}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Active Phase */}
        <View style={[styles.phaseCard, { backgroundColor: colors.surface, borderColor: PHASES[activePhase].color + "30" }]}>
          <Text style={[styles.phaseTitle, { color: PHASES[activePhase].color }]}>{PHASES[activePhase].phase}</Text>
          <Text style={[styles.phaseSub, { color: colors.muted }]}>{PHASES[activePhase].subtitle}</Text>
          <View style={{ gap: 10, marginTop: 10 }}>
            {PHASES[activePhase].supplements.map((supp, i) => (
              <View key={i} style={[styles.suppRow, { borderColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                  <Text style={[styles.suppDose, { color: colors.muted }]}>{supp.dose}</Text>
                  <Text style={[styles.suppNote, { color: PHASES[activePhase].color }]}>{supp.note}</Text>
                </View>
                <View style={[styles.pillIcon, { backgroundColor: PHASES[activePhase].color + "15" }]}>
                  <IconSymbol name="pills.fill" size={18} color={PHASES[activePhase].color} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Symptoms Map */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>خريطة الأعراض والمكملات</Text>
        {SYMPTOMS_MAP.map((item, i) => (
          <Pressable
            key={i}
            style={[styles.symptomCard, { backgroundColor: colors.surface, borderColor: item.color + "30" }]}
            onPress={() => setExpandedSymptom(expandedSymptom === i ? null : i)}
          >
            <View style={styles.symptomHeader}>
              <IconSymbol name={expandedSymptom === i ? "chevron.down" : "chevron.right"} size={14} color={colors.muted} />
              <Text style={[styles.symptomName, { color: colors.foreground }]}>{item.symptom}</Text>
              <View style={[styles.symptomBadge, { backgroundColor: item.color + "15" }]}>
                <Text style={[styles.symptomCount, { color: item.color }]}>{item.supplements.length} مكملات</Text>
              </View>
            </View>
            {expandedSymptom === i && (
              <View style={styles.suppList}>
                {item.supplements.map((s, j) => (
                  <View key={j} style={[styles.suppChip, { backgroundColor: item.color + "10", borderColor: item.color + "30" }]}>
                    <Text style={[styles.suppChipText, { color: item.color }]}>{s}</Text>
                  </View>
                ))}
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
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  warningCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  phaseSelector: { flexDirection: "row-reverse", gap: 6 },
  phaseBtn: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 8, alignItems: "center" },
  phaseBtnText: { fontSize: 10, fontWeight: "800", textAlign: "center" },
  phaseCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  phaseTitle: { fontSize: 16, fontWeight: "900", textAlign: "right" },
  phaseSub: { fontSize: 11, textAlign: "right", marginTop: 2 },
  suppRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, borderTopWidth: 0.5, paddingTop: 10 },
  pillIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 11, textAlign: "right", marginTop: 2 },
  suppNote: { fontSize: 11, textAlign: "right", marginTop: 2, fontStyle: "italic" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  symptomCard: { borderRadius: 14, borderWidth: 1, padding: 12 },
  symptomHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  symptomName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" },
  symptomBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  symptomCount: { fontSize: 10, fontWeight: "700" },
  suppList: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6, marginTop: 8 },
  suppChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  suppChipText: { fontSize: 11, fontWeight: "600" },
});
