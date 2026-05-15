/**
 * إدارة الوزن والتمثيل الغذائي
 * Features: 35 (إدارة الوزن), 36 (حرق الدهون), 37 (التمثيل الغذائي)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const WEIGHT_PROTOCOLS = [
  {
    id: "fat_loss",
    title: "بروتوكول حرق الدهون",
    color: "#EF4444",
    icon: "flame.fill" as const,
    description: "مكملات مدعومة علمياً لزيادة حرق الدهون مع الحمية والتمرين",
    supplements: [
      { name: "Caffeine + L-Theanine", dose: "200 مغ + 200 مغ", timing: "قبل التمرين", evidence: "قوي", mechanism: "يزيد معدل الأيض ويحسن حرق الدهون" },
      { name: "Green Tea Extract (EGCG)", dose: "400-500 مغ", timing: "مع الوجبات", evidence: "متوسط", mechanism: "يزيد الأكسدة ويقلل امتصاص الدهون" },
      { name: "L-Carnitine L-Tartrate", dose: "2-3 غ", timing: "قبل التمرين", evidence: "متوسط", mechanism: "ينقل الأحماض الدهنية للميتوكوندريا" },
      { name: "CLA (Conjugated Linoleic Acid)", dose: "3-6 غ", timing: "مع الوجبات", evidence: "متوسط", mechanism: "يقلل تخزين الدهون ويزيد حرقها" },
      { name: "Berberine", dose: "500 مغ × 2", timing: "قبل الوجبات", evidence: "قوي", mechanism: "يحسن حساسية الأنسولين ويفعّل AMPK" },
    ],
  },
  {
    id: "metabolism",
    title: "تحسين التمثيل الغذائي",
    color: "#F59E0B",
    icon: "bolt.fill" as const,
    description: "مكملات تحسن كفاءة الجسم في استخدام الطاقة",
    supplements: [
      { name: "Chromium Picolinate", dose: "200-400 مكغ", timing: "مع الوجبات", evidence: "متوسط", mechanism: "يحسن استجابة الأنسولين ويقلل الشهية" },
      { name: "Alpha Lipoic Acid", dose: "600 مغ", timing: "قبل الوجبات", evidence: "قوي", mechanism: "يحسن حساسية الأنسولين ومضاد أكسدة" },
      { name: "Magnesium Glycinate", dose: "400 مغ", timing: "مع العشاء", evidence: "قوي", mechanism: "يحسن حساسية الأنسولين ويقلل الكورتيزول" },
      { name: "Zinc", dose: "25-30 مغ", timing: "مع الطعام", evidence: "متوسط", mechanism: "يدعم إنتاج الأنسولين وعمل الغدة الدرقية" },
      { name: "Iodine + Selenium", dose: "150 مكغ + 200 مكغ", timing: "صباحاً", evidence: "قوي", mechanism: "يدعم الغدة الدرقية — المتحكم الرئيسي في الأيض" },
    ],
  },
  {
    id: "muscle_preservation",
    title: "الحفاظ على العضلات أثناء الحمية",
    color: "#10B981",
    icon: "figure.strengthtraining.traditional" as const,
    description: "منع فقدان العضلات أثناء خسارة الوزن",
    supplements: [
      { name: "Leucine (BCAA)", dose: "3-5 غ", timing: "مع الوجبات", evidence: "قوي", mechanism: "يحفز بناء البروتين العضلي (mTOR)" },
      { name: "HMB (Beta-Hydroxy Beta-Methylbutyrate)", dose: "3 غ", timing: "مع الوجبات", evidence: "متوسط", mechanism: "يقلل هدم العضلات أثناء الحمية" },
      { name: "Creatine Monohydrate", dose: "5 غ", timing: "يومياً", evidence: "قوي", mechanism: "يحافظ على القوة والعضلات أثناء الحمية" },
      { name: "Whey Protein Isolate", dose: "25-30 غ", timing: "بعد التمرين", evidence: "قوي", mechanism: "يوفر الأحماض الأمينية لبناء العضلات" },
    ],
  },
  {
    id: "appetite",
    title: "التحكم في الشهية",
    color: "#6366F1",
    icon: "fork.knife" as const,
    description: "مكملات طبيعية تساعد على تقليل الشهية",
    supplements: [
      { name: "Glucomannan (Konjac)", dose: "3-5 غ", timing: "قبل الوجبات بـ 30 دقيقة مع ماء كثير", evidence: "قوي", mechanism: "يتمدد في المعدة ويعطي شعور بالامتلاء" },
      { name: "5-HTP", dose: "100-300 مغ", timing: "قبل الوجبات", evidence: "متوسط", mechanism: "يزيد السيروتونين ويقلل الشهية للكربوهيدرات" },
      { name: "Saffron Extract", dose: "88 مغ", timing: "مرتين يومياً", evidence: "قوي", mechanism: "يقلل الأكل العاطفي والشهية" },
      { name: "Inulin/FOS (Prebiotics)", dose: "5-10 غ", timing: "مع الوجبات", evidence: "متوسط", mechanism: "يغذي البكتيريا المفيدة ويزيد هرمون الشبع" },
    ],
  },
];

const CALORIE_TIPS = [
  { title: "قاعدة البروتين", desc: "1.6-2.2 غ/كغ من وزن الجسم يومياً للحفاظ على العضلات" },
  { title: "عجز السعرات", desc: "500 سعرة يومياً = خسارة ~0.5 كغ أسبوعياً (آمن ومستدام)" },
  { title: "توقيت الكربوهيدرات", desc: "ركّز الكربوهيدرات حول التمرين لتحسين الأداء وتقليل تخزين الدهون" },
  { title: "الألياف", desc: "25-35 غ يومياً تحسن الشبع وتغذي البكتيريا المفيدة" },
  { title: "الماء", desc: "شرب 500 مل قبل الوجبة يقلل السعرات المتناولة بـ 13%" },
];

export default function WeightManagementScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const bmi = weight && height ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : null;
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "نقص وزن", color: colors.warning };
    if (bmi < 25) return { label: "وزن طبيعي ✓", color: colors.success };
    if (bmi < 30) return { label: "زيادة وزن", color: colors.warning };
    return { label: "سمنة", color: colors.error };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>إدارة الوزن والتمثيل الغذائي</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* BMI Calculator */}
        <View style={[styles.bmiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>حاسبة مؤشر كتلة الجسم</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>الطول (سم)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="170"
                placeholderTextColor={colors.muted}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>الوزن (كغ)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="70"
                placeholderTextColor={colors.muted}
                textAlign="right"
              />
            </View>
          </View>
          {bmi && (
            <View style={[styles.bmiResult, { backgroundColor: getBMICategory(parseFloat(bmi)).color + "15", borderColor: getBMICategory(parseFloat(bmi)).color + "40" }]}>
              <Text style={[styles.bmiValue, { color: getBMICategory(parseFloat(bmi)).color }]}>{bmi}</Text>
              <Text style={[styles.bmiCategory, { color: getBMICategory(parseFloat(bmi)).color }]}>{getBMICategory(parseFloat(bmi)).label}</Text>
            </View>
          )}
        </View>

        {/* Nutrition Tips */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نصائح تغذوية أساسية</Text>
        {CALORIE_TIPS.map((tip, i) => (
          <View key={i} style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.tipTitle, { color: colors.primary }]}>{tip.title}</Text>
            <Text style={[styles.tipDesc, { color: colors.muted }]}>{tip.desc}</Text>
          </View>
        ))}

        {/* Protocols */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>بروتوكولات المكملات</Text>
        {WEIGHT_PROTOCOLS.map((protocol) => (
          <View key={protocol.id} style={[styles.protocolCard, { backgroundColor: colors.card, borderColor: protocol.color + "40" }]}>
            <Pressable
              style={[styles.protocolHeader, { backgroundColor: protocol.color + "10" }]}
              onPress={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
            >
              <IconSymbol name={expandedProtocol === protocol.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.protocolInfo}>
                <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{protocol.title}</Text>
                <Text style={[styles.protocolDesc, { color: colors.muted }]}>{protocol.description}</Text>
              </View>
              <View style={[styles.protocolIcon, { backgroundColor: protocol.color + "20" }]}>
                <IconSymbol name={protocol.icon} size={22} color={protocol.color} />
              </View>
            </Pressable>
            {expandedProtocol === protocol.id && (
              <View style={{ padding: 12, gap: 10 }}>
                {protocol.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: protocol.color + "06", borderColor: protocol.color + "20" }]}>
                    <View style={styles.suppHeader}>
                      <View style={[styles.evidenceBadge, { backgroundColor: supp.evidence === "قوي" ? colors.success + "20" : colors.warning + "20" }]}>
                        <Text style={[styles.evidenceText, { color: supp.evidence === "قوي" ? colors.success : colors.warning }]}>{supp.evidence}</Text>
                      </View>
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    </View>
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose} — {supp.timing}</Text>
                    <Text style={[styles.suppMechanism, { color: colors.muted }]}>{supp.mechanism}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  bmiCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 12 },
  inputRow: { flexDirection: "row-reverse", gap: 12 },
  inputGroup: { flex: 1, gap: 6 },
  inputLabel: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  input: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, fontWeight: "700" },
  bmiResult: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  bmiValue: { fontSize: 32, fontWeight: "900" },
  bmiCategory: { fontSize: 16, fontWeight: "700" },
  tipCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  tipTitle: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  tipDesc: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "flex-start", padding: 14, gap: 10 },
  protocolInfo: { flex: 1, alignItems: "flex-end", gap: 4 },
  protocolTitle: { fontSize: 14, fontWeight: "800" },
  protocolDesc: { fontSize: 12, lineHeight: 18 },
  protocolIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  suppMechanism: { fontSize: 12, lineHeight: 18, textAlign: "right" },
});
