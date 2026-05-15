/**
 * الأمراض المناعية الذاتية وتعديل المناعة
 * Features: 71 (أمراض المناعة الذاتية), 72 (تعديل المناعة)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const AUTOIMMUNE_PROTOCOLS = [
  {
    id: "general_autoimmune",
    title: "بروتوكول عام للأمراض المناعية الذاتية",
    color: "#8B5CF6",
    supplements: [
      { name: "Vitamin D3 (High Dose)", dose: "10,000-20,000 IU", note: "أهم مكمل للمناعة الذاتية — يعدل Th1/Th2 — يحتاج مراقبة طبية" },
      { name: "Omega-3 (EPA+DHA)", dose: "4-6 غ", note: "يقلل الالتهاب المناعي ويحسن Treg" },
      { name: "Curcumin (Theracurmin)", dose: "360 مغ", note: "يثبط NF-kB ويقلل الاستجابة المناعية المفرطة" },
      { name: "Probiotics (Multi-strain)", dose: "50-100 مليار CFU", note: "80% من المناعة في الأمعاء — يعدل المناعة الذاتية" },
      { name: "Glutamine", dose: "10-20 غ", note: "يصلح الأمعاء المتسربة — جذر كثير من الأمراض المناعية" },
    ],
  },
  {
    id: "lupus",
    title: "الذئبة الحمراء (SLE)",
    color: "#EF4444",
    supplements: [
      { name: "Vitamin D3", dose: "5000-10000 IU", note: "نقصه شديد في SLE ويزيد النشاط المرضي" },
      { name: "Omega-3", dose: "4-6 غ", note: "يقلل نشاط المرض والتهاب الكلى" },
      { name: "DHEA", dose: "200 مغ (للنساء)", note: "يقلل نشاط SLE — استشر طبيبك" },
      { name: "Curcumin", dose: "500 مغ × 3", note: "يقلل الأجسام المضادة وعلامات الالتهاب" },
    ],
  },
  {
    id: "rheumatoid",
    title: "التهاب المفاصل الروماتويدي",
    color: "#F59E0B",
    supplements: [
      { name: "Omega-3 (EPA عالي)", dose: "4-6 غ EPA", note: "يقلل الألم والتورم — مدعوم بـ 20+ دراسة" },
      { name: "Boswellia Serrata", dose: "300-500 مغ", note: "يثبط 5-LOX ويقلل الالتهاب المفصلي" },
      { name: "Curcumin", dose: "500 مغ × 3", note: "يقلل الألم مثل Diclofenac في الدراسات" },
      { name: "Vitamin D3", dose: "5000 IU", note: "نقصه مرتبط بشدة الروماتويد" },
      { name: "Probiotics", dose: "50 مليار CFU", note: "يعدل المناعة ويقلل نشاط الروماتويد" },
    ],
  },
  {
    id: "ms",
    title: "التصلب المتعدد (MS)",
    color: "#10B981",
    supplements: [
      { name: "Vitamin D3 (High Dose)", dose: "10,000-40,000 IU", note: "بروتوكول Coimbra — يحتاج إشراف طبي متخصص" },
      { name: "Omega-3", dose: "4 غ", note: "يقلل الالتهاب ويحمي الميالين" },
      { name: "Alpha Lipoic Acid", dose: "600-1200 مغ", note: "يحمي الأعصاب ويقلل الإجهاد التأكسدي" },
      { name: "Biotin (High Dose)", dose: "100-300 مغ", note: "يحسن وظيفة الأعصاب في MS — دراسات واعدة" },
    ],
  },
];

export default function AutoimmuneScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الأمراض المناعية الذاتية</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>بروتوكولات مدعومة علمياً</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.warningCard, { backgroundColor: colors.error + "12", borderColor: colors.error + "30" }]}>
          <Text style={[styles.warningText, { color: colors.error }]}>⚠️ الأمراض المناعية الذاتية تحتاج إشراف طبي متخصص. المكملات مساعدة وليست بديلاً عن العلاج الطبي.</Text>
        </View>

        {AUTOIMMUNE_PROTOCOLS.map((protocol) => (
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
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose}</Text>
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
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  warningCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right" },
});
