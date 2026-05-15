/**
 * مقارنة الدراسات السريرية عبر الزمن
 * Features: 59 (مقارنة الدراسات), 96 (الأبحاث عبر الزمن)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const STUDY_COMPARISONS = [
  {
    supplement: "Omega-3",
    icon: "drop.fill" as const,
    color: "#3B82F6",
    evolution: [
      { year: "1970s", finding: "اكتشاف أن الإنويت لديهم معدلات قلب منخفضة رغم أكلهم الدهون" },
      { year: "1980s", finding: "دراسات DART: Omega-3 يقلل وفيات القلب بـ 29%" },
      { year: "2000s", finding: "GISSI-P: يقلل الوفيات المفاجئة بـ 45%" },
      { year: "2010s", finding: "مراجعات Cochrane: الفوائد القلبية أقل مما كان يُعتقد" },
      { year: "2018", finding: "VITAL Study: يقلل الأحداث القلبية بـ 28% في من لا يأكلون السمك" },
      { year: "2023", finding: "التوافق: مفيد للدماغ والالتهاب — الفوائد القلبية مشروطة" },
    ],
    currentConsensus: "مفيد للدماغ والالتهاب — الجرعة والشكل مهمان",
  },
  {
    supplement: "Vitamin D",
    icon: "sun.max.fill" as const,
    color: "#F59E0B",
    evolution: [
      { year: "1920s", finding: "اكتشاف دوره في الوقاية من الكساح" },
      { year: "1980s", finding: "ربطه بصحة العظام والكالسيوم" },
      { year: "2000s", finding: "اكتشاف مستقبلاته في كل خلية — دور في المناعة والسرطان" },
      { year: "2010s", finding: "VITAL Study: لا يقلل السرطان أو القلب بشكل كبير" },
      { year: "2020", finding: "COVID-19: ارتباط قوي بين نقصه وشدة المرض" },
      { year: "2023", finding: "التوافق: ضروري للمناعة — الجرعة المثلى 4000-6000 IU" },
    ],
    currentConsensus: "ضروري للمناعة والعظام — معظم الناس ناقصون",
  },
  {
    supplement: "Magnesium",
    icon: "bolt.fill" as const,
    color: "#10B981",
    evolution: [
      { year: "1960s", finding: "دوره في أكثر من 300 تفاعل إنزيمي" },
      { year: "1990s", finding: "ربطه بضغط الدم وصحة القلب" },
      { year: "2000s", finding: "اكتشاف دوره في مقاومة الأنسولين والسكري" },
      { year: "2010s", finding: "دوره في النوم والقلق والاكتئاب" },
      { year: "2020s", finding: "اكتشاف أن 80% من الناس ناقصون" },
      { year: "2023", finding: "التوافق: أحد أهم المكملات — Glycinate أفضل الأشكال" },
    ],
    currentConsensus: "ضروري للطاقة والنوم والقلب — نقصه شائع جداً",
  },
  {
    supplement: "Vitamin C",
    icon: "leaf.fill" as const,
    color: "#EF4444",
    evolution: [
      { year: "1747", finding: "اكتشاف علاج الإسقربوط بالحمضيات" },
      { year: "1970s", finding: "Linus Pauling: يعالج السرطان والزكام بجرعات عالية" },
      { year: "1980s", finding: "دراسات: لا يعالج السرطان — يقلل مدة الزكام قليلاً" },
      { year: "2000s", finding: "IV Vitamin C: نتائج واعدة في السرطان" },
      { year: "2020", finding: "COVID-19: جرعات عالية IV تقلل الإقامة في ICU" },
      { year: "2023", finding: "التوافق: مضاد أكسدة ممتاز — الجرعة العالية للحالات الحادة" },
    ],
    currentConsensus: "مضاد أكسدة قوي — مفيد للمناعة والجلد والالتهاب",
  },
];

export default function ClinicalStudiesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الدراسات السريرية عبر الزمن</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>كيف تطورت الأبحاث العلمية للمكملات</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <IconSymbol name="info.circle.fill" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.muted }]}>
            العلم يتطور — ما كان صحيحاً بالأمس قد يتغير غداً. هذا القسم يعرض تطور الأبحاث العلمية للمكملات الرئيسية عبر العقود.
          </Text>
        </View>

        {STUDY_COMPARISONS.map((study) => (
          <View key={study.supplement} style={[styles.studyCard, { backgroundColor: colors.surface, borderColor: study.color + "30" }]}>
            <Pressable
              style={[styles.studyHeader, { backgroundColor: study.color + "10" }]}
              onPress={() => setExpandedId(expandedId === study.supplement ? null : study.supplement)}
            >
              <IconSymbol name={expandedId === study.supplement ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={{ flex: 1, alignItems: "flex-end", gap: 2 }}>
                <Text style={[styles.studyTitle, { color: colors.foreground }]}>{study.supplement}</Text>
                <Text style={[styles.studyConsensus, { color: study.color }]}>{study.currentConsensus}</Text>
              </View>
              <View style={[styles.studyIcon, { backgroundColor: study.color + "20" }]}>
                <IconSymbol name={study.icon} size={22} color={study.color} />
              </View>
            </Pressable>
            {expandedId === study.supplement && (
              <View style={{ padding: 12, gap: 8 }}>
                <Text style={[styles.timelineTitle, { color: colors.foreground }]}>التطور التاريخي:</Text>
                {study.evolution.map((ev, i) => (
                  <View key={i} style={styles.timelineItem}>
                    <View style={[styles.timelineYear, { backgroundColor: study.color + "20" }]}>
                      <Text style={[styles.yearText, { color: study.color }]}>{ev.year}</Text>
                    </View>
                    <Text style={[styles.findingText, { color: colors.muted }]}>{ev.finding}</Text>
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
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", gap: 10, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
  studyCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  studyHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  studyTitle: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  studyConsensus: { fontSize: 11, textAlign: "right" },
  studyIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  timelineTitle: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  timelineItem: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  timelineYear: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, flexShrink: 0 },
  yearText: { fontSize: 11, fontWeight: "700" },
  findingText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
});
