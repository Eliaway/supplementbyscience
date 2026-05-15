/**
 * صحة الكلى والجهاز البولي
 * Features: 60 (صحة الكلى), 61 (حصوات الكلى), 62 (صحة المثانة)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const KIDNEY_PROTOCOLS = [
  {
    id: "kidney_support",
    title: "دعم صحة الكلى",
    color: "#3B82F6",
    supplements: [
      { name: "Astragalus Root", dose: "500-1000 مغ", note: "يحمي الكلى ويحسن وظيفتها — مدعوم بدراسات" },
      { name: "Cordyceps Mushroom", dose: "1-3 غ", note: "يحسن وظيفة الكلى في المرضى المزمنين" },
      { name: "Vitamin D3", dose: "4000 IU", note: "نقصه شائع في أمراض الكلى ويزيد تدهورها" },
      { name: "Omega-3", dose: "3 غ", note: "يقلل الالتهاب ويحمي الكلى من التلف" },
      { name: "CoQ10", dose: "200 مغ", note: "يقلل الإجهاد التأكسدي في الكلى" },
    ],
  },
  {
    id: "kidney_stones",
    title: "الوقاية من حصوات الكلى",
    color: "#F59E0B",
    supplements: [
      { name: "Magnesium Citrate", dose: "400 مغ", note: "يربط الأكسالات في الأمعاء ويمنع تكون الحصوات" },
      { name: "Vitamin B6", dose: "25-50 مغ", note: "يقلل إنتاج الأكسالات في الجسم" },
      { name: "Potassium Citrate", dose: "حسب الطبيب", note: "يقلل حموضة البول ويمنع تكون الحصوات" },
      { name: "Vitamin K2 (MK-7)", dose: "200 مكغ", note: "يوجه الكالسيوم للعظام بدلاً من الكلى" },
    ],
    warning: "تجنب فيتامين C الزائد (>500 مغ) — يزيد الأكسالات",
  },
  {
    id: "bladder",
    title: "صحة المثانة",
    color: "#10B981",
    supplements: [
      { name: "D-Mannose", dose: "2 غ", note: "يمنع التصاق البكتيريا بجدار المثانة — للوقاية من UTI" },
      { name: "Cranberry Extract (PAC)", dose: "36 مغ PAC", note: "يقلل UTI المتكررة بنسبة 40%" },
      { name: "Probiotics (Lactobacillus)", dose: "10 مليار CFU", note: "يحمي المسالك البولية من البكتيريا الضارة" },
      { name: "Pumpkin Seed Extract", dose: "320-640 مغ", note: "يقوي عضلات المثانة ويقلل التبول اللاإرادي" },
    ],
  },
];

const KIDNEY_DIET = [
  { food: "الماء", amount: "2-3 لتر/يوم", note: "أهم شيء لصحة الكلى" },
  { food: "الليمون", amount: "عصير ليمونة/يوم", note: "يزيد سيترات البول ويمنع الحصوات" },
  { food: "البطيخ", amount: "حسب الرغبة", note: "مدر طبيعي للبول يحمي الكلى" },
  { food: "الكرفس", amount: "2-3 أعواد/يوم", note: "يطهر الكلى ويقلل حمض اليوريك" },
  { food: "الكركم", amount: "1 ملعقة صغيرة", note: "يقلل الالتهاب في الكلى" },
];

export default function KidneyHealthScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>صحة الكلى والجهاز البولي</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>بروتوكولات الحماية والدعم</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {KIDNEY_PROTOCOLS.map((protocol) => (
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
                {"warning" in protocol && (
                  <View style={[styles.warningCard, { backgroundColor: colors.error + "12", borderColor: colors.error + "30" }]}>
                    <Text style={[styles.warningText, { color: colors.error }]}>⚠️ {protocol.warning}</Text>
                  </View>
                )}
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

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أطعمة تدعم الكلى</Text>
        {KIDNEY_DIET.map((item, i) => (
          <View key={i} style={[styles.foodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.foodRow}>
              <Text style={[styles.foodAmount, { color: colors.primary }]}>{item.amount}</Text>
              <Text style={[styles.foodName, { color: colors.foreground }]}>{item.food}</Text>
            </View>
            <Text style={[styles.foodNote, { color: colors.muted }]}>{item.note}</Text>
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
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  warningCard: { borderRadius: 10, padding: 10, borderWidth: 1 },
  warningText: { fontSize: 12, textAlign: "right" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  foodCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  foodRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  foodName: { fontSize: 14, fontWeight: "800" },
  foodAmount: { fontSize: 12, fontWeight: "600" },
  foodNote: { fontSize: 12, lineHeight: 18, textAlign: "right" },
});
