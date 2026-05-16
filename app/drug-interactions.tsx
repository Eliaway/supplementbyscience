/**
 * تفاعلات الأدوية والمكملات الشاملة
 * Features: 36, 37
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

type Severity = "خطير" | "متوسط" | "خفيف" | "مفيد";

interface Interaction {
  drug: string;
  supplement: string;
  severity: Severity;
  mechanism: string;
  recommendation: string;
}

const INTERACTIONS: Interaction[] = [
  {
    drug: "Warfarin (وارفارين)",
    supplement: "فيتامين K",
    severity: "خطير",
    mechanism: "فيتامين K يعاكس تأثير الوارفارين المضاد للتخثر",
    recommendation: "تجنب تماماً أو استشر طبيبك لضبط الجرعة",
  },
  {
    drug: "Warfarin (وارفارين)",
    supplement: "أوميغا 3 (جرعات عالية)",
    severity: "متوسط",
    mechanism: "يزيد من تأثير تخفيف الدم — خطر النزيف",
    recommendation: "أبلغ طبيبك — قد يحتاج لمراقبة INR",
  },
  {
    drug: "Statins (ستاتينات)",
    supplement: "CoQ10",
    severity: "مفيد",
    mechanism: "الستاتينات تخفض CoQ10 — التكملة تعوض النقص",
    recommendation: "موصى به مع الستاتينات لتقليل آلام العضلات",
  },
  {
    drug: "SSRIs (مضادات الاكتئاب)",
    supplement: "5-HTP",
    severity: "خطير",
    mechanism: "خطر متلازمة السيروتونين — زيادة مفرطة في السيروتونين",
    recommendation: "تجنب تماماً — خطر حياتي",
  },
  {
    drug: "SSRIs (مضادات الاكتئاب)",
    supplement: "St. John's Wort",
    severity: "خطير",
    mechanism: "يزيد السيروتونين ويؤثر على استقلاب الدواء",
    recommendation: "تجنب تماماً",
  },
  {
    drug: "Metformin (ميتفورمين)",
    supplement: "فيتامين B12",
    severity: "مفيد",
    mechanism: "الميتفورمين يسبب نقص B12 — التكملة ضرورية",
    recommendation: "موصى به مع الميتفورمين لمنع نقص B12",
  },
  {
    drug: "Levothyroxine (هرمون الغدة)",
    supplement: "كالسيوم / حديد / مغنيسيوم",
    severity: "متوسط",
    mechanism: "يقلل امتصاص هرمون الغدة الدرقية",
    recommendation: "خذ هرمون الغدة على معدة فارغة — وانتظر 4 ساعات قبل المكملات",
  },
  {
    drug: "ACE Inhibitors (أدوية ضغط الدم)",
    supplement: "بوتاسيوم",
    severity: "خطير",
    mechanism: "يرفع البوتاسيوم لمستويات خطيرة (Hyperkalemia)",
    recommendation: "تجنب مكملات البوتاسيوم — استشر طبيبك",
  },
  {
    drug: "Aspirin (أسبرين)",
    supplement: "فيتامين E (جرعات عالية)",
    severity: "متوسط",
    mechanism: "يزيد من تأثير تخفيف الدم",
    recommendation: "تجنب جرعات عالية من E مع الأسبرين",
  },
  {
    drug: "Cyclosporine (سيكلوسبورين)",
    supplement: "St. John's Wort",
    severity: "خطير",
    mechanism: "يقلل مستوى الدواء في الدم بشكل كبير — خطر رفض الزرع",
    recommendation: "تجنب تماماً",
  },
  {
    drug: "Chemotherapy (كيموثيرابي)",
    supplement: "مضادات الأكسدة (C, E, NAC)",
    severity: "متوسط",
    mechanism: "قد تحمي الخلايا السرطانية من تأثير الكيمو",
    recommendation: "استشر طبيب الأورام قبل أي مكمل",
  },
  {
    drug: "Digoxin (ديجوكسين)",
    supplement: "Hawthorn (الزعرور)",
    severity: "متوسط",
    mechanism: "يزيد من تأثير الدواء على القلب",
    recommendation: "استشر طبيبك — قد يحتاج لتعديل الجرعة",
  },
];

const SEVERITY_COLORS: Record<Severity, string> = {
  "خطير": "#EF4444",
  "متوسط": "#F59E0B",
  "خفيف": "#3B82F6",
  "مفيد": "#10B981",
};

export default function DrugInteractionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<Severity | "الكل">("الكل");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const filtered = INTERACTIONS.filter(item => {
    const matchSearch = !searchQuery ||
      item.drug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSeverity = filterSeverity === "الكل" || item.severity === filterSeverity;
    return matchSearch && matchSeverity;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>تفاعلات الأدوية والمكملات ⚠️</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>قاعدة بيانات شاملة للتفاعلات المهمة</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={[styles.warningCard, { backgroundColor: "#EF444410", borderColor: "#EF444430" }]}>
          <Text style={[styles.warningText, { color: colors.foreground }]}>
            ⚠️ هذه المعلومات للتثقيف فقط. استشر طبيبك أو صيدلانيك دائماً قبل الجمع بين الأدوية والمكملات.
          </Text>
        </View>

        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
          placeholder="ابحث عن دواء أو مكمل..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />

        {/* Severity Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {(["الكل", "خطير", "متوسط", "خفيف", "مفيد"] as const).map(sev => (
            <Pressable
              key={sev}
              style={[styles.filterBtn, {
                backgroundColor: filterSeverity === sev
                  ? (sev === "الكل" ? colors.primary : SEVERITY_COLORS[sev as Severity] ?? colors.primary)
                  : colors.surface,
                borderColor: sev === "الكل" ? colors.primary : (SEVERITY_COLORS[sev as Severity] ?? colors.border) + "50",
              }]}
              onPress={() => setFilterSeverity(sev)}
            >
              <Text style={[styles.filterText, { color: filterSeverity === sev ? "#fff" : colors.muted }]}>{sev}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[styles.resultCount, { color: colors.muted }]}>{filtered.length} تفاعل</Text>

        {filtered.map((item, i) => (
          <Pressable
            key={i}
            style={[styles.interactionCard, { backgroundColor: colors.surface, borderColor: SEVERITY_COLORS[item.severity] + "30" }]}
            onPress={() => setExpandedItem(expandedItem === i ? null : i)}
          >
            <View style={styles.cardHeader}>
              <IconSymbol name={expandedItem === i ? "chevron.down" : "chevron.right"} size={14} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <View style={styles.drugRow}>
                  <Text style={[styles.drugName, { color: colors.foreground }]}>{item.drug}</Text>
                  <Text style={[styles.plus, { color: colors.muted }]}>+</Text>
                  <Text style={[styles.suppName, { color: colors.primary }]}>{item.supplement}</Text>
                </View>
              </View>
              <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[item.severity] + "15" }]}>
                <Text style={[styles.severityText, { color: SEVERITY_COLORS[item.severity] }]}>{item.severity}</Text>
              </View>
            </View>

            {expandedItem === i && (
              <View style={{ gap: 8, marginTop: 10 }}>
                <View style={[styles.mechanismBox, { backgroundColor: colors.background }]}>
                  <Text style={[styles.mechanismLabel, { color: colors.muted }]}>🔬 الآلية:</Text>
                  <Text style={[styles.mechanismText, { color: colors.foreground }]}>{item.mechanism}</Text>
                </View>
                <View style={[styles.recBox, { backgroundColor: SEVERITY_COLORS[item.severity] + "08" }]}>
                  <Text style={[styles.recLabel, { color: SEVERITY_COLORS[item.severity] }]}>💡 التوصية:</Text>
                  <Text style={[styles.recText, { color: colors.foreground }]}>{item.recommendation}</Text>
                </View>
              </View>
            )}
          </Pressable>
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
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  warningCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  searchInput: { borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 13, fontFamily: "Cairo" },
  filterRow: { flexDirection: "row-reverse", gap: 8, paddingHorizontal: 2 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  resultCount: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  interactionCard: { borderRadius: 14, borderWidth: 1, padding: 12 },
  cardHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  drugRow: { flexDirection: "row-reverse", flexWrap: "wrap", alignItems: "center", gap: 4 },
  drugName: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  plus: { fontSize: 12, fontWeight: "900", fontFamily: "Cairo-Black" },
  suppName: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  severityText: { fontSize: 10, fontWeight: "800", fontFamily: "Cairo-Black" },
  mechanismBox: { borderRadius: 8, padding: 8 },
  mechanismLabel: { fontSize: 10, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  mechanismText: { fontSize: 11, lineHeight: 16, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  recBox: { borderRadius: 8, padding: 8 },
  recLabel: { fontSize: 10, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  recText: { fontSize: 11, lineHeight: 16, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
});
