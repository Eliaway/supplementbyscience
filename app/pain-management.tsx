/**
 * إدارة الألم ومضادات الالتهاب
 * Features: 68 (الألم المزمن), 69 (الالتهاب المزمن), 70 (الفيبروميالجيا)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const PAIN_PROTOCOLS = [
  {
    id: "chronic_pain",
    title: "الألم المزمن",
    color: "#EF4444",
    supplements: [
      { name: "Curcumin (Theracurmin)", dose: "180-360 مغ", note: "يثبط COX-2 مثل Ibuprofen — بدون آثار جانبية على المعدة" },
      { name: "Omega-3 (EPA عالي)", dose: "4-6 غ", note: "يقلل الألم المزمن بنسبة 50% في الدراسات" },
      { name: "Magnesium Glycinate", dose: "400-600 مغ", note: "يقلل الألم العصبي وتشنجات العضلات" },
      { name: "PEA (Palmitoylethanolamide)", dose: "600-1200 مغ", note: "مضاد ألم طبيعي قوي — يعمل على مستقبلات الكانابينويد" },
      { name: "Boswellia Serrata", dose: "300-500 مغ", note: "يثبط 5-LOX — أقوى من Ibuprofen في بعض الدراسات" },
    ],
  },
  {
    id: "inflammation",
    title: "الالتهاب المزمن",
    color: "#F59E0B",
    supplements: [
      { name: "Curcumin + Piperine", dose: "500 مغ + 5 مغ", note: "يثبط NF-kB — أهم مسار التهابي في الجسم" },
      { name: "Omega-3 (EPA+DHA)", dose: "3-4 غ", note: "يحول AA إلى Resolvins — يحل الالتهاب بدلاً من كبته" },
      { name: "Quercetin", dose: "500-1000 مغ", note: "يثبط إنتاج السيتوكينات الالتهابية" },
      { name: "Resveratrol", dose: "500 مغ", note: "يثبط COX-2 وNF-kB ويقلل CRP" },
      { name: "Vitamin D3", dose: "5000 IU", note: "يعدل الاستجابة المناعية ويقلل الالتهاب المزمن" },
    ],
  },
  {
    id: "fibromyalgia",
    title: "الفيبروميالجيا",
    color: "#8B5CF6",
    supplements: [
      { name: "Magnesium Malate", dose: "600-1200 مغ", note: "يقلل الألم والتعب في الفيبروميالجيا — مدعوم بدراسات" },
      { name: "5-HTP", dose: "100-300 مغ", note: "يرفع السيروتونين ويقلل الألم والنوم السيئ" },
      { name: "CoQ10", dose: "300 مغ", note: "يحسن طاقة الخلايا ويقلل الألم والتعب" },
      { name: "Vitamin D3", dose: "5000 IU", note: "نقصه شائع جداً في مرضى الفيبروميالجيا" },
      { name: "SAMe", dose: "400-800 مغ", note: "يقلل الألم والاكتئاب المصاحب للفيبروميالجيا" },
    ],
  },
];

const ANTI_INFLAMMATORY_FOODS = [
  { emoji: "🌿", name: "الكركم + الفلفل الأسود", note: "يزيد الامتصاص 2000% مع الفلفل" },
  { emoji: "🐟", name: "سمك السلمون", note: "أغنى مصدر طبيعي لـ EPA وDHA" },
  { emoji: "🫐", name: "التوت الأزرق", note: "Anthocyanins تثبط NF-kB" },
  { emoji: "🥑", name: "الأفوكادو", note: "Oleocanthal — مثل Ibuprofen في العمل" },
  { emoji: "🧄", name: "الثوم", note: "Allicin يثبط COX-1 وCOX-2" },
  { emoji: "🍵", name: "الشاي الأخضر", note: "EGCG يثبط إنتاج السيتوكينات" },
];

export default function PainManagementScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>إدارة الألم ومضادات الالتهاب</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>الألم المزمن • الالتهاب • الفيبروميالجيا</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {PAIN_PROTOCOLS.map((protocol) => (
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

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أطعمة مضادة للالتهاب</Text>
        <View style={styles.foodsGrid}>
          {ANTI_INFLAMMATORY_FOODS.map((food, i) => (
            <View key={i} style={[styles.foodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={styles.foodEmoji}>{food.emoji}</Text>
              <Text style={[styles.foodName, { color: colors.foreground }]}>{food.name}</Text>
              <Text style={[styles.foodNote, { color: colors.muted }]}>{food.note}</Text>
            </View>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  foodsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  foodCard: { width: "47%", padding: 12, borderRadius: 14, borderWidth: 1, alignItems: "center", gap: 4 },
  foodEmoji: { fontSize: 28 },
  foodName: { fontSize: 12, fontWeight: "800", textAlign: "center" },
  foodNote: { fontSize: 11, textAlign: "center", lineHeight: 14 },
});
