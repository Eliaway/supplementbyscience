/**
 * الصحة الجنسية والخصوبة
 * Features: 46 (الصحة الجنسية للرجل), 47 (الخصوبة), 48 (صحة البروستاتا)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const SEXUAL_HEALTH_PROTOCOLS = [
  {
    id: "male_performance",
    title: "الأداء الجنسي للرجل",
    color: "#3B82F6",
    icon: "figure.stand" as const,
    supplements: [
      { name: "L-Arginine + L-Citrulline", dose: "3 غ + 3 غ", timing: "قبل النشاط", evidence: "قوي", note: "يزيد إنتاج أكسيد النيتريك — يحسن تدفق الدم" },
      { name: "Maca Root", dose: "3 غ", timing: "يومياً", evidence: "قوي", note: "يحسن الرغبة الجنسية والطاقة — مدعوم بدراسات" },
      { name: "Ashwagandha KSM-66", dose: "600 مغ", timing: "مع العشاء", evidence: "قوي", note: "يزيد التستوستيرون ويقلل الكورتيزول" },
      { name: "Zinc Bisglycinate", dose: "30-45 مغ", timing: "مع الطعام", evidence: "قوي", note: "ضروري لإنتاج التستوستيرون والحيوانات المنوية" },
      { name: "Vitamin D3", dose: "5000 IU", timing: "مع الإفطار", evidence: "قوي", note: "ارتباط قوي بين فيتامين D والتستوستيرون" },
    ],
  },
  {
    id: "fertility_male",
    title: "خصوبة الرجل",
    color: "#10B981",
    icon: "figure.2.and.child.holdinghands" as const,
    supplements: [
      { name: "CoQ10 (Ubiquinol)", dose: "200-400 مغ", timing: "مع الطعام", evidence: "قوي", note: "يحسن حركة وجودة الحيوانات المنوية بشكل ملحوظ" },
      { name: "Zinc + Folate", dose: "25 مغ + 400 مكغ", timing: "مع الطعام", evidence: "قوي", note: "يزيد عدد الحيوانات المنوية بنسبة 74% في الدراسات" },
      { name: "Selenium", dose: "200 مكغ", timing: "مع الطعام", evidence: "قوي", note: "ضروري لتكوين ذيل الحيوان المنوي" },
      { name: "Vitamin C + E", dose: "1000 مغ + 400 IU", timing: "مع الطعام", evidence: "قوي", note: "يقلل الإجهاد التأكسدي على الحيوانات المنوية" },
      { name: "L-Carnitine", dose: "3 غ", timing: "قبل الطعام", evidence: "قوي", note: "يحسن حركة الحيوانات المنوية وجودتها" },
    ],
  },
  {
    id: "fertility_female",
    title: "خصوبة المرأة",
    color: "#EC4899",
    icon: "figure.and.child.holdinghands" as const,
    supplements: [
      { name: "Methylfolate (5-MTHF)", dose: "400-800 مكغ", timing: "يومياً", evidence: "قوي جداً", note: "ضروري قبل الحمل وأثناءها — يمنع عيوب الأنبوب العصبي" },
      { name: "CoQ10 (Ubiquinol)", dose: "400-600 مغ", timing: "مع الطعام", evidence: "قوي", note: "يحسن جودة البويضات — مهم جداً فوق 35 سنة" },
      { name: "Myo-Inositol", dose: "4 غ", timing: "مع الطعام", evidence: "قوي", note: "يحسن الاستجابة للتخصيب ويساعد في PCOS" },
      { name: "Vitamin D3", dose: "4000-5000 IU", timing: "مع الطعام", evidence: "قوي", note: "ارتباط قوي بين نقصه وصعوبة الحمل" },
      { name: "Omega-3 DHA", dose: "1-2 غ DHA", timing: "مع الطعام", evidence: "قوي", note: "يدعم تطور الجنين ويحسن جودة البويضات" },
    ],
  },
  {
    id: "prostate",
    title: "صحة البروستاتا",
    color: "#8B5CF6",
    icon: "cross.circle.fill" as const,
    supplements: [
      { name: "Saw Palmetto", dose: "320 مغ", timing: "مع الطعام", evidence: "قوي", note: "يقلل أعراض تضخم البروستاتا الحميد (BPH)" },
      { name: "Zinc", dose: "30-45 مغ", timing: "مع الطعام", evidence: "قوي", note: "أعلى تركيز زنك في الجسم في البروستاتا" },
      { name: "Lycopene", dose: "15-30 مغ", timing: "مع الطعام الدهني", evidence: "قوي", note: "يقلل خطر سرطان البروستاتا" },
      { name: "Selenium", dose: "200 مكغ", timing: "مع الطعام", evidence: "قوي", note: "يقلل خطر سرطان البروستاتا بنسبة 63% في الدراسات" },
      { name: "Pygeum Africanum", dose: "100 مغ", timing: "مع الطعام", evidence: "قوي", note: "يقلل التبول الليلي وأعراض BPH" },
    ],
  },
];

export default function SexualHealthScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الصحة الجنسية والخصوبة</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>بروتوكولات مدعومة علمياً</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.warningCard, { backgroundColor: colors.warning + "15", borderColor: colors.warning + "40" }]}>
          <Text style={[styles.warningText, { color: colors.warning }]}>⚠️ هذه المعلومات للتثقيف الصحي فقط. استشر طبيبك قبل تناول أي مكمل خاصة إذا كنت تعاني من حالة صحية.</Text>
        </View>

        {SEXUAL_HEALTH_PROTOCOLS.map((protocol) => (
          <View key={protocol.id} style={[styles.protocolCard, { backgroundColor: colors.card, borderColor: protocol.color + "40" }]}>
            <Pressable
              style={[styles.protocolHeader, { backgroundColor: protocol.color + "10" }]}
              onPress={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
            >
              <IconSymbol name={expandedProtocol === protocol.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{protocol.title}</Text>
              <View style={[styles.protocolIcon, { backgroundColor: protocol.color + "20" }]}>
                <IconSymbol name={protocol.icon} size={22} color={protocol.color} />
              </View>
            </Pressable>
            {expandedProtocol === protocol.id && (
              <View style={{ padding: 12, gap: 10 }}>
                {protocol.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: protocol.color + "06", borderColor: protocol.color + "20" }]}>
                    <View style={styles.suppHeader}>
                      <View style={[styles.evidenceBadge, { backgroundColor: supp.evidence.includes("قوي") ? colors.success + "20" : colors.warning + "20" }]}>
                        <Text style={[styles.evidenceText, { color: supp.evidence.includes("قوي") ? colors.success : colors.warning }]}>{supp.evidence}</Text>
                      </View>
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    </View>
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose} — {supp.timing}</Text>
                    <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
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
  warningCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  protocolIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
