/**
 * صحة الشعر والفروة
 * Features: 73 (تساقط الشعر), 74 (تقوية الشعر), 75 (صحة الفروة)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const HAIR_LOSS_CAUSES = [
  { cause: "نقص الحديد", test: "Ferritin < 70", fix: "Iron Bisglycinate 25-50 مغ" },
  { cause: "نقص فيتامين D", test: "< 50 ng/mL", fix: "Vitamin D3 5000 IU" },
  { cause: "نقص الزنك", test: "< 80 mcg/dL", fix: "Zinc Bisglycinate 30 مغ" },
  { cause: "نقص البيوتين", test: "نادر جداً", fix: "Biotin 5-10 مغ" },
  { cause: "نقص البروتين", test: "< 1.2 غ/كغ", fix: "زيادة البروتين في الغذاء" },
  { cause: "ارتفاع DHT", test: "Testosterone/DHT ratio", fix: "Saw Palmetto 320 مغ" },
  { cause: "التوتر المزمن", test: "Cortisol مرتفع", fix: "Ashwagandha + Magnesium" },
];

const HAIR_PROTOCOLS = [
  {
    id: "hair_loss",
    title: "تساقط الشعر (Androgenetic Alopecia)",
    color: "#8B5CF6",
    supplements: [
      { name: "Saw Palmetto", dose: "320 مغ", note: "يثبط 5-alpha reductase ويقلل DHT — بديل طبيعي لـ Finasteride" },
      { name: "Iron Bisglycinate", dose: "25-50 مغ", note: "نقص الفيريتين أكثر سبب لتساقط الشعر عند النساء" },
      { name: "Zinc Bisglycinate", dose: "30 مغ", note: "ضروري لنمو الشعر — نقصه يسبب تساقطاً ملحوظاً" },
      { name: "Biotin", dose: "5-10 مغ", note: "يقوي الشعر والأظافر — يحتاج 3-6 أشهر" },
      { name: "Collagen Type I + III", dose: "10-15 غ", note: "يقوي بصيلات الشعر ويزيد سماكته" },
    ],
  },
  {
    id: "hair_growth",
    title: "تحفيز نمو الشعر",
    color: "#10B981",
    supplements: [
      { name: "Pumpkin Seed Oil", dose: "400 مغ", note: "يثبط 5-alpha reductase ويزيد كثافة الشعر بـ 40%" },
      { name: "Marine Collagen", dose: "10 غ", note: "يزيد سماكة الشعر ويقلل التساقط" },
      { name: "MSM (Methylsulfonylmethane)", dose: "3-5 غ", note: "يزيد طول مرحلة نمو الشعر (Anagen phase)" },
      { name: "Vitamin E (Mixed Tocopherols)", dose: "400 IU", note: "يحسن تدفق الدم لفروة الرأس" },
      { name: "Silica (Bamboo Extract)", dose: "300 مغ", note: "يقوي بنية الشعر ويزيد لمعانه" },
    ],
  },
  {
    id: "scalp_health",
    title: "صحة فروة الرأس",
    color: "#F59E0B",
    supplements: [
      { name: "Omega-3", dose: "3 غ", note: "يقلل الالتهاب والقشرة ويرطب فروة الرأس" },
      { name: "Probiotics", dose: "20 مليار CFU", note: "يقلل الالتهاب الجلدي والقشرة من الداخل" },
      { name: "Zinc", dose: "25 مغ", note: "يقلل الزيت الزائد ويعالج القشرة" },
      { name: "Vitamin D3", dose: "4000 IU", note: "يحفز نمو بصيلات الشعر الجديدة" },
    ],
  },
];

export default function HairHealthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);
  const [showCauses, setShowCauses] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>صحة الشعر والفروة</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>تساقط الشعر • التقوية • النمو</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Causes Section */}
        <View style={[styles.causesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable
            style={styles.causesHeader}
            onPress={() => setShowCauses(!showCauses)}
          >
            <IconSymbol name={showCauses ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
            <Text style={[styles.causesTitle, { color: colors.foreground }]}>أسباب تساقط الشعر وعلاجها</Text>
          </Pressable>
          {showCauses && (
            <View style={{ padding: 12, gap: 8 }}>
              {HAIR_LOSS_CAUSES.map((item, i) => (
                <View key={i} style={[styles.causeRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.causeFix, { color: colors.success }]}>{item.fix}</Text>
                  <Text style={[styles.causeTest, { color: colors.muted }]}>{item.test}</Text>
                  <Text style={[styles.causeName, { color: colors.foreground }]}>{item.cause}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {HAIR_PROTOCOLS.map((protocol) => (
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
  backText: { fontSize: 14, fontWeight: "600", fontFamily: "Cairo-Bold" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  causesCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  causesHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  causesTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  causeRow: { flexDirection: "row-reverse", gap: 8, paddingBottom: 8, borderBottomWidth: 0.5 },
  causeName: { flex: 1, fontSize: 12, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  causeTest: { fontSize: 11, color: "#888", fontFamily: "Cairo" },
  causeFix: { fontSize: 11, fontWeight: "600", fontFamily: "Cairo-Bold" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
