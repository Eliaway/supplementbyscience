/**
 * صحة الجهاز التنفسي والرئتين
 * Features: 63 (صحة الرئتين), 64 (الربو والحساسية)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const RESPIRATORY_PROTOCOLS = [
  {
    id: "lung_support",
    title: "دعم صحة الرئتين",
    color: "#3B82F6",
    supplements: [
      { name: "NAC (N-Acetyl Cysteine)", dose: "600-1200 مغ", note: "يرقق المخاط ويحمي الرئتين من الأكسدة — أفضل مكمل للرئة" },
      { name: "Vitamin D3", dose: "5000 IU", note: "نقصه مرتبط بأمراض الرئة المزمنة والتهابات الجهاز التنفسي" },
      { name: "Quercetin", dose: "500-1000 مغ", note: "مضاد التهاب وحساسية قوي — يحسن وظيفة الرئة" },
      { name: "Magnesium", dose: "400 مغ", note: "يرخي عضلات الشعب الهوائية — يقلل ضيق التنفس" },
      { name: "Omega-3", dose: "3 غ", note: "يقلل الالتهاب في الرئتين والشعب الهوائية" },
    ],
  },
  {
    id: "asthma",
    title: "الربو والحساسية التنفسية",
    color: "#10B981",
    supplements: [
      { name: "Magnesium Glycinate", dose: "400-600 مغ", note: "يرخي الشعب الهوائية — يقلل نوبات الربو" },
      { name: "Vitamin C", dose: "1-2 غ", note: "مضاد أكسدة يقلل الالتهاب التحسسي في الرئة" },
      { name: "Quercetin + Bromelain", dose: "500 مغ + 250 مغ", note: "يثبط الهيستامين ويقلل الحساسية التنفسية" },
      { name: "Butterbur Extract", dose: "75 مغ × 2", note: "فعال مثل Cetirizine للحساسية — بدون نعاس" },
      { name: "Vitamin D3", dose: "5000 IU", note: "نقصه يزيد شدة الربو والحساسية" },
    ],
  },
  {
    id: "copd",
    title: "COPD والأمراض التنفسية المزمنة",
    color: "#F59E0B",
    supplements: [
      { name: "NAC", dose: "1200-1800 مغ", note: "يقلل تفاقم COPD ويحسن وظيفة الرئة" },
      { name: "Vitamin D3", dose: "5000 IU", note: "يقلل تفاقم COPD بنسبة 50% في الناقصين" },
      { name: "CoQ10", dose: "300 مغ", note: "يحسن قدرة التحمل وطاقة عضلات التنفس" },
      { name: "L-Carnitine", dose: "2 غ", note: "يقلل ضيق التنفس ويحسن القدرة على التمرين" },
      { name: "Omega-3", dose: "3 غ", note: "يقلل الالتهاب المزمن في الرئتين" },
    ],
  },
];

const BREATHING_TIPS = [
  { tip: "تمرين 4-7-8", desc: "شهيق 4 ثوانٍ، حبس 7 ثوانٍ، زفير 8 ثوانٍ — يهدئ الجهاز العصبي" },
  { tip: "التنفس البطني", desc: "تنفس من البطن لا الصدر — يزيد كفاءة الأكسجين بـ 30%" },
  { tip: "تجنب الغرف المغلقة", desc: "افتح النوافذ يومياً — الهواء الداخلي أكثر تلوثاً من الخارجي" },
  { tip: "نباتات منزلية", desc: "Spider Plant وPeace Lily تنقي الهواء من المواد الكيميائية" },
];

export default function RespiratoryHealthScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>صحة الجهاز التنفسي</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>الرئتين • الربو • الحساسية • COPD</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {RESPIRATORY_PROTOCOLS.map((protocol) => (
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

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نصائح تحسين التنفس</Text>
        {BREATHING_TIPS.map((item, i) => (
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
  backText: { fontSize: 14, fontWeight: "600", fontFamily: "Cairo-Bold" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  tipCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  tipTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  tipDesc: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
