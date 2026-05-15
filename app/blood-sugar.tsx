/**
 * السكر في الدم والصحة الأيضية
 * Features: 65 (السكري النوع الثاني), 66 (مقاومة الأنسولين), 67 (متلازمة التمثيل الغذائي)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const BLOOD_SUGAR_PROTOCOLS = [
  {
    id: "insulin_resistance",
    title: "مقاومة الأنسولين",
    color: "#F59E0B",
    supplements: [
      { name: "Berberine HCL", dose: "500 مغ × 3", timing: "قبل الوجبات", evidence: "قوي جداً", note: "فعال مثل Metformin في تخفيض السكر — بدون آثار جانبية" },
      { name: "Myo-Inositol + D-Chiro-Inositol", dose: "4 غ + 400 مغ", timing: "مع الطعام", evidence: "قوي", note: "يحسن حساسية الأنسولين بشكل ملحوظ" },
      { name: "Magnesium Glycinate", dose: "400-600 مغ", timing: "مع الطعام", evidence: "قوي", note: "نقصه يزيد مقاومة الأنسولين — 80% من مرضى السكر ناقصون" },
      { name: "Chromium Picolinate", dose: "400-1000 مكغ", timing: "مع الطعام", evidence: "قوي", note: "يحسن عمل الأنسولين ويقلل الرغبة في السكر" },
      { name: "Alpha Lipoic Acid", dose: "600-1200 مغ", timing: "قبل الطعام", evidence: "قوي", note: "يحسن حساسية الأنسولين ويقلل الاعتلال العصبي السكري" },
    ],
  },
  {
    id: "type2_diabetes",
    title: "السكري النوع الثاني",
    color: "#EF4444",
    supplements: [
      { name: "Berberine", dose: "500 مغ × 3", timing: "قبل الوجبات", evidence: "قوي جداً", note: "يخفض HbA1c بنسبة 1-2% — مثل الميتفورمين" },
      { name: "Vitamin D3", dose: "5000 IU", timing: "مع الإفطار", evidence: "قوي", note: "نقصه يزيد خطر السكري بنسبة 40%" },
      { name: "Magnesium", dose: "400 مغ", timing: "مع الطعام", evidence: "قوي", note: "يحسن إفراز الأنسولين وحساسيته" },
      { name: "Cinnamon Extract", dose: "1-3 غ", timing: "مع الطعام", evidence: "متوسط", note: "يقلل السكر بعد الأكل ويحسن حساسية الأنسولين" },
      { name: "Gymnema Sylvestre", dose: "400 مغ", timing: "قبل الطعام", evidence: "قوي", note: "يقلل امتصاص السكر ويحفز إفراز الأنسولين" },
    ],
  },
  {
    id: "metabolic_syndrome",
    title: "متلازمة التمثيل الغذائي",
    color: "#8B5CF6",
    supplements: [
      { name: "Berberine", dose: "500 مغ × 3", timing: "قبل الوجبات", evidence: "قوي جداً", note: "يعالج جميع مكونات المتلازمة: السكر، الكوليسترول، الضغط" },
      { name: "Omega-3 (EPA+DHA)", dose: "4 غ", timing: "مع الطعام", evidence: "قوي", note: "يخفض الدهون الثلاثية بنسبة 30-50%" },
      { name: "Coenzyme Q10", dose: "200-300 مغ", timing: "مع الطعام", evidence: "قوي", note: "يحسن طاقة الخلايا ويحمي القلب" },
      { name: "Resveratrol", dose: "500 مغ", timing: "مع الطعام", evidence: "قوي", note: "يفعّل SIRT1 ويحسن الأيض الكلي" },
    ],
  },
];

const BLOOD_SUGAR_TIPS = [
  { tip: "قاعدة الطبق", desc: "نصف الطبق خضروات، ربع بروتين، ربع كربوهيدرات معقدة" },
  { tip: "ترتيب الأكل", desc: "ابدأ بالخضروات ثم البروتين ثم الكربوهيدرات — يقلل ارتفاع السكر بـ 73%" },
  { tip: "المشي بعد الأكل", desc: "10 دقائق مشي بعد الوجبة تخفض السكر بنسبة 22%" },
  { tip: "الخل قبل الأكل", desc: "ملعقة كبيرة خل التفاح قبل الوجبة تقلل ارتفاع السكر بـ 34%" },
];

export default function BloodSugarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>السكر في الدم والأيض</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>مقاومة الأنسولين • السكري • المتلازمة الأيضية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.warningCard, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
          <Text style={[styles.warningText, { color: colors.warning }]}>⚠️ مرضى السكري يجب مراقبة السكر بعناية عند إضافة المكملات — بعضها يخفض السكر بشكل ملحوظ.</Text>
        </View>

        {BLOOD_SUGAR_PROTOCOLS.map((protocol) => (
          <View key={protocol.id} style={[styles.protocolCard, { backgroundColor: colors.card, borderColor: protocol.color + "40" }]}>
            <Pressable
              style={[styles.protocolHeader, { backgroundColor: protocol.color + "10" }]}
              onPress={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
            >
              <IconSymbol name={expandedProtocol === protocol.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{protocol.title}</Text>
            </Pressable>
            {expandedProtocol === protocol.id && (
              <View style={{ padding: 12, gap: 10 }}>
                {protocol.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: protocol.color + "06", borderColor: protocol.color + "20" }]}>
                    <View style={styles.suppHeader}>
                      {"evidence" in supp && (
                        <View style={[styles.evidenceBadge, { backgroundColor: supp.evidence.includes("قوي") ? colors.success + "20" : colors.warning + "20" }]}>
                          <Text style={[styles.evidenceText, { color: supp.evidence.includes("قوي") ? colors.success : colors.warning }]}>{supp.evidence}</Text>
                        </View>
                      )}
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    </View>
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose} — {"timing" in supp ? supp.timing : ""}</Text>
                    <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نصائح التحكم في السكر</Text>
        {BLOOD_SUGAR_TIPS.map((item, i) => (
          <View key={i} style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.tipTitle, { color: colors.primary }]}>{item.tip}</Text>
            <Text style={[styles.tipDesc, { color: colors.muted }]}>{item.desc}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  warningCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  tipCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  tipTitle: { fontSize: 14, fontWeight: "800", textAlign: "right" },
  tipDesc: { fontSize: 12, lineHeight: 18, textAlign: "right" },
});
