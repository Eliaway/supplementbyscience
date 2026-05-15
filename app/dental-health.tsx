/**
 * صحة الأسنان والفم
 * Feature: 45 (صحة الأسنان واللثة)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const DENTAL_SUPPLEMENTS = [
  {
    category: "تقوية المينا والأسنان",
    color: "#0EA5E9",
    items: [
      { name: "Vitamin D3 + K2", dose: "4000 IU + 180 مكغ", benefit: "يحسن امتصاص الكالسيوم وترسيبه في الأسنان", evidence: "قوي" },
      { name: "Calcium Hydroxyapatite", dose: "500-1000 مغ", benefit: "يُعيد بناء المينا — أفضل من الفلورايد في الدراسات", evidence: "قوي" },
      { name: "Magnesium", dose: "300-400 مغ", benefit: "ضروري لبنية الأسنان ويمنع تسوسها", evidence: "متوسط" },
      { name: "Vitamin C", dose: "500-1000 مغ", benefit: "ضروري لإنتاج الكولاجين في اللثة", evidence: "قوي" },
    ],
  },
  {
    category: "صحة اللثة والوقاية من التهابها",
    color: "#EF4444",
    items: [
      { name: "CoQ10 (Ubiquinol)", dose: "100-200 مغ", benefit: "يقلل التهاب اللثة ويحسن شفاءها", evidence: "قوي" },
      { name: "Vitamin C (Buffered)", dose: "1-2 غ/يوم", benefit: "يقوي الكولاجين في اللثة ويقلل النزيف", evidence: "قوي" },
      { name: "Zinc", dose: "25 مغ", benefit: "مضاد بكتيري ويسرع شفاء اللثة", evidence: "متوسط" },
      { name: "Probiotics (L. reuteri)", dose: "100 مليون CFU", benefit: "يقلل البكتيريا الضارة في الفم ويحسن صحة اللثة", evidence: "قوي" },
    ],
  },
  {
    category: "تبييض الأسنان الطبيعي",
    color: "#F59E0B",
    items: [
      { name: "Activated Charcoal (خارجي)", dose: "مرة أسبوعياً", benefit: "يمتص الملونات السطحية", evidence: "محدود — لا تفرط" },
      { name: "Oil Pulling (زيت جوز الهند)", dose: "15-20 دقيقة صباحاً", benefit: "يقلل البكتيريا ويحسن بياض الأسنان", evidence: "متوسط" },
      { name: "Vitamin C + Baking Soda (خارجي)", dose: "مرة أسبوعياً", benefit: "يزيل الصبغات بلطف", evidence: "تقليدي" },
    ],
  },
  {
    category: "الوقاية من التسوس",
    color: "#10B981",
    items: [
      { name: "Xylitol", dose: "5-10 غ/يوم (علكة أو حلوى)", benefit: "يمنع تكاثر Streptococcus mutans — البكتيريا الرئيسية للتسوس", evidence: "قوي جداً" },
      { name: "Vitamin D3", dose: "4000 IU", benefit: "نقصه يزيد خطر التسوس — يحسن مناعة الفم", evidence: "قوي" },
      { name: "Calcium + Phosphorus", dose: "من الغذاء", benefit: "يُعيد تمعدن الأسنان بعد الوجبات", evidence: "قوي" },
    ],
  },
];

const ORAL_TIPS = [
  { title: "قاعدة 2-2-2", desc: "فرش الأسنان مرتين يومياً لمدة دقيقتين، وزيارة طبيب الأسنان مرتين سنوياً" },
  { title: "الخيط الأسني", desc: "أهم من الفرشاة — يزيل 40% من البلاك الذي لا تصله الفرشاة" },
  { title: "تجنب السكر الحمضي", desc: "المشروبات الغازية + العصائر الحمضية = أسوأ مزيج للأسنان" },
  { title: "الماء بعد الوجبات", desc: "شرب الماء بعد الأكل يرفع pH الفم ويحمي المينا" },
  { title: "الجبن بعد الوجبات", desc: "الجبن يرفع pH الفم ويوفر الكالسيوم والفوسفور لإعادة التمعدن" },
];

export default function DentalHealthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>صحة الأسنان والفم</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>مكملات ونصائح لأسنان قوية ولثة صحية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نصائح أساسية</Text>
        {ORAL_TIPS.map((tip, i) => (
          <View key={i} style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.tipTitle, { color: colors.primary }]}>{tip.title}</Text>
            <Text style={[styles.tipDesc, { color: colors.muted }]}>{tip.desc}</Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكملات حسب الهدف</Text>
        {DENTAL_SUPPLEMENTS.map((cat) => (
          <View key={cat.category} style={[styles.catCard, { backgroundColor: colors.card, borderColor: cat.color + "40" }]}>
            <Pressable
              style={[styles.catHeader, { backgroundColor: cat.color + "10" }]}
              onPress={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)}
            >
              <IconSymbol name={expandedCat === cat.category ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.catTitle, { color: colors.foreground }]}>{cat.category}</Text>
            </Pressable>
            {expandedCat === cat.category && (
              <View style={{ padding: 12, gap: 10 }}>
                {cat.items.map((item, i) => (
                  <View key={i} style={[styles.itemCard, { backgroundColor: cat.color + "06", borderColor: cat.color + "20" }]}>
                    <View style={styles.itemHeader}>
                      <View style={[styles.evidenceBadge, { backgroundColor: item.evidence.includes("قوي") ? colors.success + "20" : colors.warning + "20" }]}>
                        <Text style={[styles.evidenceText, { color: item.evidence.includes("قوي") ? colors.success : colors.warning }]}>{item.evidence}</Text>
                      </View>
                      <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
                    </View>
                    <Text style={[styles.itemDose, { color: cat.color }]}>{item.dose}</Text>
                    <Text style={[styles.itemBenefit, { color: colors.muted }]}>{item.benefit}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  tipCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  tipTitle: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  tipDesc: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  catCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  catHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  catTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  itemCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  itemHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  itemName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700" },
  itemDose: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  itemBenefit: { fontSize: 12, lineHeight: 18, textAlign: "right" },
});
