/**
 * دليل الجينات والمكملات
 * Feature: 118 (الجينات والمكملات), 119 (MTHFR وغيرها)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const GENETIC_VARIANTS = [
  {
    gene: "MTHFR",
    icon: "testtube.2" as const,
    color: "#8B5CF6",
    prevalence: "40-60% من الناس",
    description: "يؤثر على تحويل Folate إلى شكله النشط (Methylfolate). يرتبط بارتفاع Homocysteine.",
    symptoms: ["تعب مزمن", "ضباب ذهني", "اكتئاب", "إجهاض متكرر", "أمراض قلب مبكرة"],
    supplements: [
      { name: "Methylfolate (5-MTHF)", dose: "400-1000 mcg", note: "بدلاً من Folic Acid" },
      { name: "Methylcobalamin (B12)", dose: "500-1000 mcg", note: "الشكل النشط" },
      { name: "B6 (P5P)", dose: "25-50 mg", note: "الشكل النشط" },
      { name: "Riboflavin (B2)", dose: "100-400 mg", note: "يدعم MTHFR" },
      { name: "TMG (Betaine)", dose: "500-1500 mg", note: "يخفض Homocysteine" },
    ],
    avoid: ["Folic Acid الاصطناعي (يتراكم غير محوّل)", "Methotrexate بدون استشارة"],
  },
  {
    gene: "VDR (Vitamin D Receptor)",
    icon: "sun.max.fill" as const,
    color: "#F59E0B",
    prevalence: "30-50% من الناس",
    description: "يؤثر على استجابة الجسم لفيتامين D. قد يحتاج جرعات أعلى لنفس المستوى.",
    symptoms: ["نقص D رغم التناول", "ضعف مناعة", "آلام عظام", "اكتئاب موسمي"],
    supplements: [
      { name: "Vitamin D3", dose: "5000-10000 IU", note: "جرعات أعلى من المعتاد" },
      { name: "Vitamin K2 (MK-7)", dose: "100-200 mcg", note: "ضروري مع D3" },
      { name: "Magnesium", dose: "300-400 mg", note: "يُفعّل D3" },
    ],
    avoid: ["الاعتماد على الجرعة القياسية (1000 IU) فقط"],
  },
  {
    gene: "APOE4",
    icon: "brain.head.profile" as const,
    color: "#EF4444",
    prevalence: "25% من الناس",
    description: "يزيد خطر الزهايمر وأمراض القلب. يؤثر على استقلاب الدهون.",
    symptoms: ["خطر مرتفع للزهايمر", "ارتفاع LDL", "التهاب مزمن"],
    supplements: [
      { name: "Omega-3 (DHA عالي)", dose: "2-4 g/day", note: "يحمي الدماغ" },
      { name: "Curcumin + Piperine", dose: "500-1000 mg", note: "مضاد التهاب قوي" },
      { name: "Resveratrol", dose: "250-500 mg", note: "يُفعّل SIRT1" },
      { name: "Lion's Mane", dose: "1000-3000 mg", note: "يُحفّز NGF" },
    ],
    avoid: ["الدهون المشبعة الزائدة", "السكر المكرر"],
  },
  {
    gene: "COMT",
    icon: "bolt.fill" as const,
    color: "#10B981",
    prevalence: "50% من الناس",
    description: "يؤثر على تكسير الدوبامين والإستروجين. يحدد مستوى الطاقة والتركيز.",
    symptoms: ["إما: قلق وتوتر زائد (بطيء COMT)", "أو: تعب وضباب ذهني (سريع COMT)"],
    supplements: [
      { name: "Magnesium L-Threonate", dose: "144 mg عنصر", note: "يُوازن الدوبامين" },
      { name: "B2 (Riboflavin)", dose: "100 mg", note: "يدعم COMT" },
      { name: "SAMe (بطيء COMT)", dose: "400-800 mg", note: "للطاقة والمزاج" },
    ],
    avoid: ["Methyl donors الزائدة (بطيء COMT يُسبب قلق)"],
  },
];

export default function GeneticsGuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0c1a2e", borderBottomColor: "#1a3a5e" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#7dd3fc" />
          <Text style={[styles.backText, { color: "#7dd3fc" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>الجينات والمكملات</Text>
        <Text style={[styles.headerSub, { color: "#7dd3fc" }]}>كيف تؤثر جيناتك على احتياجاتك من المكملات</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={[styles.infoCard, { backgroundColor: "#8B5CF615", borderColor: "#8B5CF630" }]}>
          <IconSymbol name="info.circle.fill" size={16} color="#8B5CF6" />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            اختبارات الجينات (23andMe, AncestryDNA) يمكن أن تكشف عن هذه الطفرات. استشر طبيباً متخصصاً قبل تعديل نظامك بناءً على الجينات.
          </Text>
        </View>

        {GENETIC_VARIANTS.map((variant) => (
          <View key={variant.gene} style={[styles.card, { backgroundColor: colors.surface, borderColor: variant.color + "30" }]}>
            <Pressable
              style={[styles.cardHeader, { backgroundColor: variant.color + "10" }]}
              onPress={() => setExpandedId(expandedId === variant.gene ? null : variant.gene)}
            >
              <View style={[styles.prevalenceBadge, { backgroundColor: variant.color + "15" }]}>
                <Text style={[styles.prevalenceText, { color: variant.color }]}>{variant.prevalence}</Text>
              </View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>جين {variant.gene}</Text>
              <View style={[styles.cardIcon, { backgroundColor: variant.color + "20" }]}>
                <IconSymbol name={variant.icon} size={22} color={variant.color} />
              </View>
            </Pressable>

            {expandedId === variant.gene && (
              <View style={{ padding: 12, gap: 10 }}>
                <Text style={[styles.description, { color: colors.muted }]}>{variant.description}</Text>

                <Text style={[styles.sectionLabel, { color: "#F59E0B" }]}>الأعراض المرتبطة:</Text>
                <View style={styles.symptomsRow}>
                  {variant.symptoms.map((s, i) => (
                    <View key={i} style={[styles.symptomTag, { backgroundColor: "#F59E0B15", borderColor: "#F59E0B30" }]}>
                      <Text style={[styles.symptomText, { color: "#F59E0B" }]}>{s}</Text>
                    </View>
                  ))}
                </View>

                <Text style={[styles.sectionLabel, { color: "#10B981" }]}>المكملات الموصى بها:</Text>
                {variant.supplements.map((s, i) => (
                  <View key={i} style={[styles.supplementRow, { backgroundColor: "#10B98110", borderColor: "#10B98130" }]}>
                    <Text style={[styles.supplementNote, { color: colors.muted }]}>{s.note}</Text>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.supplementName, { color: colors.foreground }]}>{s.name}</Text>
                      <Text style={[styles.supplementDose, { color: "#10B981" }]}>{s.dose}</Text>
                    </View>
                  </View>
                ))}

                <Text style={[styles.sectionLabel, { color: "#EF4444" }]}>تجنب:</Text>
                {variant.avoid.map((a, i) => (
                  <Text key={i} style={[styles.avoidText, { color: "#EF4444" }]}>⚠️ {a}</Text>
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
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", gap: 8, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cardHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  cardIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  prevalenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  prevalenceText: { fontSize: 10, fontWeight: "700" },
  description: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  sectionLabel: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  symptomsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  symptomTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  symptomText: { fontSize: 11, fontWeight: "600" },
  supplementRow: { borderRadius: 10, borderWidth: 1, padding: 10, flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  supplementName: { fontSize: 12, fontWeight: "700", textAlign: "right" },
  supplementDose: { fontSize: 11, textAlign: "right" },
  supplementNote: { fontSize: 11, textAlign: "right", maxWidth: 100 },
  avoidText: { fontSize: 12, textAlign: "right" },
});
