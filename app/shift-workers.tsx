/**
 * مكملات عمال الورديات والعمل الليلي
 * Feature: 110 (عمال الليل), 111 (الإيقاع اليومي)
 */
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const SHIFT_PROTOCOLS = [
  {
    title: "قبل الوردية الليلية",
    icon: "moon.fill" as const,
    color: "#6366F1",
    time: "1-2 ساعة قبل العمل",
    supplements: [
      { name: "Caffeine", dose: "100-200 mg", note: "يقظة بدون قلق" },
      { name: "L-Theanine", dose: "200 mg", note: "يُوازن الكافيين" },
      { name: "Rhodiola Rosea", dose: "200-400 mg", note: "مقاومة الإجهاد" },
      { name: "B-Complex", dose: "1 كبسولة", note: "طاقة عصبية" },
    ],
  },
  {
    title: "أثناء الوردية الليلية",
    icon: "star.fill" as const,
    color: "#F59E0B",
    time: "منتصف الوردية",
    supplements: [
      { name: "Magnesium Malate", dose: "200 mg", note: "طاقة + تركيز" },
      { name: "Vitamin C", dose: "500 mg", note: "مضاد أكسدة للإجهاد" },
      { name: "CoQ10", dose: "100 mg", note: "طاقة خلوية" },
    ],
  },
  {
    title: "بعد الوردية (للنوم النهاري)",
    icon: "sun.max.fill" as const,
    color: "#10B981",
    time: "عند العودة للمنزل",
    supplements: [
      { name: "Melatonin", dose: "0.5-3 mg", note: "تعديل الساعة البيولوجية" },
      { name: "Magnesium Glycinate", dose: "300-400 mg", note: "نوم عميق" },
      { name: "L-Theanine", dose: "200-400 mg", note: "استرخاء بدون خمول" },
      { name: "Ashwagandha", dose: "300-600 mg", note: "خفض الكورتيزول" },
    ],
  },
  {
    title: "مكملات الحماية طويلة الأمد",
    icon: "shield.fill" as const,
    color: "#EF4444",
    time: "يومياً",
    supplements: [
      { name: "Vitamin D3", dose: "4000-5000 IU", note: "تعويض نقص الشمس" },
      { name: "Omega-3", dose: "2-3 g", note: "حماية قلب وأوعية" },
      { name: "Probiotics", dose: "10-30 billion CFU", note: "صحة الأمعاء" },
      { name: "NAC", dose: "600 mg", note: "مضاد أكسدة قوي" },
    ],
  },
];

const RISKS = [
  { risk: "زيادة خطر السرطان", icon: "⚠️", detail: "اضطراب الميلاتونين يُقلل حماية الحمض النووي" },
  { risk: "أمراض القلب والأوعية", icon: "❤️", detail: "الإجهاد المزمن يرفع الكورتيزول وضغط الدم" },
  { risk: "السكري النوع 2", icon: "🩸", detail: "اضطراب الساعة البيولوجية يُخل بمقاومة الأنسولين" },
  { risk: "الاكتئاب والقلق", icon: "🧠", detail: "نقص السيروتونين والدوبامين بسبب قلة الضوء الطبيعي" },
  { risk: "ضعف المناعة", icon: "🛡️", detail: "قلة النوم تُقلل إنتاج الخلايا المناعية" },
];

export default function ShiftWorkersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0c1a2e", borderBottomColor: "#1a3a5e" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#7dd3fc" />
          <Text style={[styles.backText, { color: "#7dd3fc" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>مكملات عمال الورديات 🌙</Text>
        <Text style={[styles.headerSub, { color: "#7dd3fc" }]}>حماية صحتك من مخاطر العمل الليلي</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Risks */}
        <View style={[styles.sectionCard, { backgroundColor: "#EF444415", borderColor: "#EF444430" }]}>
          <Text style={[styles.sectionTitle, { color: "#EF4444" }]}>⚠️ مخاطر العمل الليلي المزمن</Text>
          {RISKS.map((r, i) => (
            <View key={i} style={styles.riskRow}>
              <Text style={[styles.riskDetail, { color: colors.muted }]}>{r.detail}</Text>
              <Text style={[styles.riskName, { color: colors.foreground }]}>{r.icon} {r.risk}</Text>
            </View>
          ))}
        </View>

        {/* Protocols */}
        {SHIFT_PROTOCOLS.map((protocol) => (
          <View key={protocol.title} style={[styles.protocolCard, { backgroundColor: colors.surface, borderColor: protocol.color + "30" }]}>
            <View style={[styles.protocolHeader, { backgroundColor: protocol.color + "10" }]}>
              <Text style={[styles.protocolTime, { color: protocol.color }]}>{protocol.time}</Text>
              <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{protocol.title}</Text>
              <View style={[styles.protocolIcon, { backgroundColor: protocol.color + "20" }]}>
                <IconSymbol name={protocol.icon} size={22} color={protocol.color} />
              </View>
            </View>
            <View style={{ padding: 12, gap: 8 }}>
              {protocol.supplements.map((s, i) => (
                <View key={i} style={[styles.suppRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.suppNote, { color: colors.muted }]}>{s.note}</Text>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{s.dose}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: "#3B82F615", borderColor: "#3B82F630" }]}>
          <Text style={[styles.tipsTitle, { color: "#3B82F6" }]}>💡 نصائح إضافية</Text>
          {[
            "استخدم نظارات حاجبة للضوء الأزرق عند العودة من العمل",
            "اجعل غرفة نومك مظلمة تماماً بستائر معتمة",
            "تجنب الكافيين في آخر 4 ساعات من الوردية",
            "حاول الحصول على 7-8 ساعات نوم متواصلة",
            "مارس الرياضة في وقت ثابت لتثبيت الساعة البيولوجية",
          ].map((tip, i) => (
            <Text key={i} style={[styles.tipText, { color: colors.foreground }]}>• {tip}</Text>
          ))}
        </View>
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
  sectionCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 4 },
  riskRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8, paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: "#EF444420" },
  riskName: { fontSize: 12, fontWeight: "700", minWidth: 160, textAlign: "right" },
  riskDetail: { flex: 1, fontSize: 11, textAlign: "right" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  protocolTime: { fontSize: 10, fontWeight: "700" },
  protocolIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  suppRow: { borderRadius: 10, borderWidth: 1, padding: 10, flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  suppName: { fontSize: 12, fontWeight: "700", textAlign: "right" },
  suppDose: { fontSize: 11, textAlign: "right" },
  suppNote: { fontSize: 11, textAlign: "right", maxWidth: 100 },
  tipsCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 8 },
  tipsTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 4 },
  tipText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
});
