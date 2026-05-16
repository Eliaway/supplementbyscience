/**
 * صحة العيون والرؤية
 * Features: 43 (صحة العيون), 44 (الوقاية من ضمور الشبكية)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const EYE_PROTOCOLS = [
  {
    id: "general",
    title: "صحة العيون العامة",
    color: "#0EA5E9",
    icon: "eye.fill" as const,
    supplements: [
      { name: "Lutein + Zeaxanthin", dose: "10-20 مغ + 2 مغ", benefit: "يحمي الشبكية من الضوء الأزرق والأشعة فوق البنفسجية", evidence: "قوي جداً" },
      { name: "Astaxanthin", dose: "6-12 مغ", benefit: "أقوى مضاد أكسدة للعيون — يحسن حدة البصر", evidence: "قوي" },
      { name: "Vitamin A (Beta-Carotene)", dose: "5000 IU", benefit: "ضروري لإنتاج Rhodopsin — بروتين الرؤية الليلية", evidence: "قوي" },
      { name: "Omega-3 DHA", dose: "1-2 غ DHA", benefit: "يشكل 60% من دهون الشبكية — ضروري لبنيتها", evidence: "قوي" },
    ],
  },
  {
    id: "amd",
    title: "الوقاية من ضمور البقعة (AMD)",
    color: "#8B5CF6",
    icon: "eye.fill" as const,
    supplements: [
      { name: "AREDS2 Formula", dose: "Lutein 10مغ + Zeaxanthin 2مغ + Vitamin C 500مغ + Vitamin E 400IU + Zinc 80مغ + Copper 2مغ", benefit: "يقلل خطر تطور AMD بنسبة 25%", evidence: "قوي جداً — دراسات NIH" },
      { name: "Saffron Extract", dose: "20 مغ", benefit: "يحسن وظيفة الشبكية في مرضى AMD المبكر", evidence: "قوي" },
      { name: "Ginkgo Biloba", dose: "120 مغ", benefit: "يزيد تدفق الدم للعين ويحمي الخلايا البصرية", evidence: "متوسط" },
    ],
  },
  {
    id: "dry_eye",
    title: "علاج جفاف العيون",
    color: "#F59E0B",
    icon: "drop.fill" as const,
    supplements: [
      { name: "Omega-3 (EPA+DHA)", dose: "3 غ/يوم", benefit: "يحسن جودة الدموع ويقلل الالتهاب", evidence: "قوي" },
      { name: "Vitamin D3", dose: "4000 IU", benefit: "نقصه يسبب جفاف العيون", evidence: "متوسط" },
      { name: "Hyaluronic Acid (قطرات)", dose: "0.1-0.4%", benefit: "يرطب العيون ويحتفظ بالماء", evidence: "قوي" },
      { name: "Evening Primrose Oil", dose: "3 غ", benefit: "غني بـ GLA — يحسن إفراز الدموع", evidence: "متوسط" },
    ],
  },
  {
    id: "screen_fatigue",
    title: "إجهاد العيون من الشاشات",
    color: "#10B981",
    icon: "sun.max.fill" as const,
    supplements: [
      { name: "Lutein + Zeaxanthin", dose: "20 مغ + 4 مغ", benefit: "يبني الصبغة البقعية التي تصفي الضوء الأزرق", evidence: "قوي" },
      { name: "Astaxanthin", dose: "6 مغ", benefit: "يقلل إجهاد العيون من الشاشات بشكل ملحوظ", evidence: "قوي" },
      { name: "Bilberry Extract", dose: "160 مغ", benefit: "يحسن الرؤية الليلية ويقلل إجهاد العيون", evidence: "متوسط" },
      { name: "Magnesium", dose: "400 مغ", benefit: "يقلل التشنج العضلي في عضلات العين", evidence: "متوسط" },
    ],
  },
];

const EYE_FOODS = [
  { name: "الجزر", compound: "Beta-Carotene", benefit: "يتحول لفيتامين A — ضروري للرؤية الليلية" },
  { name: "السبانخ والكرنب", compound: "Lutein + Zeaxanthin", benefit: "أغنى مصدر غذائي لصبغات الشبكية" },
  { name: "السلمون والتونة", compound: "DHA + EPA", benefit: "يبني بنية الشبكية ويقلل التهابها" },
  { name: "البيض", compound: "Lutein + Zeaxanthin + Zinc", benefit: "امتصاص أفضل من الخضروات" },
  { name: "المحار", compound: "Zinc", benefit: "يدعم إنتاج الميلانين في شبكية العين" },
  { name: "الفلفل الأحمر", compound: "Vitamin C + Zeaxanthin", benefit: "يحمي العيون من الإجهاد التأكسدي" },
];

export default function EyeHealthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0c1a2e", borderBottomColor: "#1a3a5e" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#7dd3fc" />
          <Text style={[styles.backText, { color: "#7dd3fc" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>صحة العيون والرؤية</Text>
        <Text style={[styles.headerSub, { color: "#7dd3fc" }]}>مكملات مدعومة علمياً لحماية بصرك</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Eye Foods */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أطعمة صحة العيون</Text>
        {EYE_FOODS.map((food, i) => (
          <View key={i} style={[styles.foodCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.foodHeader}>
              <Text style={[styles.foodCompound, { color: "#0EA5E9" }]}>{food.compound}</Text>
              <Text style={[styles.foodName, { color: colors.foreground }]}>{food.name}</Text>
            </View>
            <Text style={[styles.foodBenefit, { color: colors.muted }]}>{food.benefit}</Text>
          </View>
        ))}

        {/* Protocols */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>بروتوكولات المكملات</Text>
        {EYE_PROTOCOLS.map((protocol) => (
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
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppBenefit, { color: colors.muted }]}>{supp.benefit}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  foodCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  foodHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  foodName: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  foodCompound: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  foodBenefit: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
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
  suppBenefit: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
