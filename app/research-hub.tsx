/**
 * مركز الأبحاث والدراسات السريرية
 * Features: 86 (أحدث الأبحاث), 87 (مستوى الأدلة), 88 (الدراسات السريرية)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const EVIDENCE_LEVELS = [
  { level: "A", desc: "أدلة قاطعة من تجارب عشوائية متعددة (RCT)", color: "#10B981", examples: "Omega-3 للقلب، Vitamin D للعظام، Creatine للعضلات" },
  { level: "B", desc: "أدلة جيدة من RCT واحدة أو دراسات مراقبة", color: "#3B82F6", examples: "Berberine للسكر، Ashwagandha للتوتر، Magnesium للنوم" },
  { level: "C", desc: "أدلة محدودة أو دراسات صغيرة", color: "#F59E0B", examples: "Lion's Mane للذاكرة، Spermidine للعمر" },
  { level: "D", desc: "أدلة نظرية أو دراسات حيوانية فقط", color: "#EF4444", examples: "معظم مضادات الأكسدة الجديدة" },
];

const LATEST_RESEARCH = [
  {
    title: "NMN وإطالة العمر",
    year: "2023-2024",
    finding: "أول دراسة بشرية تُظهر تحسن مستويات NAD+ بنسبة 38% مع تحسن اللياقة البدنية",
    evidence: "B",
    source: "Nature Aging 2023",
  },
  {
    title: "Berberine مقابل Ozempic",
    year: "2023",
    finding: "دراسة صينية: Berberine يخفض الوزن ومقاومة الأنسولين بفعالية مشابهة للأدوية",
    evidence: "B",
    source: "Frontiers in Endocrinology",
  },
  {
    title: "Omega-3 والاكتئاب",
    year: "2024",
    finding: "Meta-analysis: EPA بجرعة 2+ غ يوازي مضادات الاكتئاب في الحالات المتوسطة",
    evidence: "A",
    source: "JAMA Psychiatry 2024",
  },
  {
    title: "Magnesium وصحة الدماغ",
    year: "2023",
    finding: "دراسة: Magnesium L-Threonate يزيد حجم الدماغ ويحسن الذاكرة في كبار السن",
    evidence: "B",
    source: "European Journal of Nutrition",
  },
  {
    title: "Vitamin D والسرطان",
    year: "2024",
    finding: "VITAL Trial: D3 5000 IU يقلل وفيات السرطان بنسبة 13% في 5 سنوات",
    evidence: "A",
    source: "NEJM 2024",
  },
  {
    title: "Spermidine والأوتوفاجي",
    year: "2023",
    finding: "أول دراسة بشرية: Spermidine يحفز الأوتوفاجي ويحسن الذاكرة في كبار السن",
    evidence: "B",
    source: "Cell Reports Medicine",
  },
];

const MYTH_BUSTERS = [
  { myth: "فيتامين C يمنع الزكام", truth: "يقلل المدة بـ 8% فقط — لا يمنعه", evidence: "A" },
  { myth: "البيوتين يقوي الشعر دائماً", truth: "فعال فقط إذا كان هناك نقص حقيقي (نادر جداً)", evidence: "B" },
  { myth: "الكولاجين الفموي يصل للجلد مباشرة", truth: "يُهضم لأحماض أمينية — لكن يحفز إنتاج الكولاجين الداخلي", evidence: "B" },
  { myth: "المزيد من مضادات الأكسدة = أفضل", truth: "الجرعات العالية قد تضر — الجسم يحتاج توازناً", evidence: "A" },
  { myth: "الكرياتين يضر الكلى", truth: "آمن تماماً للكلى السليمة — 30+ سنة من الأبحاث", evidence: "A" },
];

export default function ResearchHubScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"evidence" | "research" | "myths">("research");

  const evidenceColor = (level: string) => {
    const found = EVIDENCE_LEVELS.find(e => e.level === level);
    return found?.color ?? colors.muted;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>مركز الأبحاث العلمية</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>أحدث الدراسات • مستوى الأدلة • تصحيح الأساطير</Text>
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(["research", "evidence", "myths"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.muted }]}>
              {tab === "research" ? "أحدث الأبحاث" : tab === "evidence" ? "مستوى الأدلة" : "تصحيح الأساطير"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {activeTab === "evidence" && (
          <>
            <Text style={[styles.sectionDesc, { color: colors.muted }]}>نظام تصنيف الأدلة العلمية المستخدم في هذا التطبيق:</Text>
            {EVIDENCE_LEVELS.map((level, i) => (
              <View key={i} style={[styles.evidenceCard, { backgroundColor: colors.card, borderColor: level.color + "40" }]}>
                <View style={[styles.levelBadge, { backgroundColor: level.color }]}>
                  <Text style={styles.levelText}>{level.level}</Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[styles.levelDesc, { color: colors.foreground }]}>{level.desc}</Text>
                  <Text style={[styles.levelExamples, { color: colors.muted }]}>أمثلة: {level.examples}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === "research" && LATEST_RESEARCH.map((study, i) => (
          <View key={i} style={[styles.studyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.studyHeader}>
              <View style={[styles.evidenceMini, { backgroundColor: evidenceColor(study.evidence) + "20" }]}>
                <Text style={[styles.evidenceMiniText, { color: evidenceColor(study.evidence) }]}>مستوى {study.evidence}</Text>
              </View>
              <Text style={[styles.studyYear, { color: colors.muted }]}>{study.year}</Text>
              <Text style={[styles.studyTitle, { color: colors.foreground }]}>{study.title}</Text>
            </View>
            <Text style={[styles.studyFinding, { color: colors.muted }]}>{study.finding}</Text>
            <Text style={[styles.studySource, { color: colors.primary }]}>📚 {study.source}</Text>
          </View>
        ))}

        {activeTab === "myths" && MYTH_BUSTERS.map((item, i) => (
          <View key={i} style={[styles.mythCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.mythHeader, { backgroundColor: colors.error + "10" }]}>
              <Text style={[styles.mythText, { color: colors.error }]}>❌ الأسطورة: {item.myth}</Text>
            </View>
            <View style={[styles.truthHeader, { backgroundColor: colors.success + "10" }]}>
              <Text style={[styles.truthText, { color: colors.success }]}>✅ الحقيقة: {item.truth}</Text>
            </View>
            <View style={[styles.evidenceMini, { backgroundColor: evidenceColor(item.evidence) + "20", margin: 8, alignSelf: "flex-end" }]}>
              <Text style={[styles.evidenceMiniText, { color: evidenceColor(item.evidence) }]}>مستوى الأدلة: {item.evidence}</Text>
            </View>
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
  tabs: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  sectionDesc: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  evidenceCard: { flexDirection: "row-reverse", alignItems: "flex-start", borderRadius: 14, padding: 12, borderWidth: 1, gap: 12 },
  levelBadge: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  levelText: { color: "white", fontSize: 20, fontWeight: "900", fontFamily: "Cairo-Black" },
  levelDesc: { fontSize: 13, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  levelExamples: { fontSize: 11, lineHeight: 16, textAlign: "right", fontFamily: "Cairo" },
  studyCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  studyHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, flexWrap: "wrap" },
  studyTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  studyYear: { fontSize: 11, fontFamily: "Cairo" },
  evidenceMini: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceMiniText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  studyFinding: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  studySource: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  mythCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  mythHeader: { padding: 12 },
  mythText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  truthHeader: { padding: 12 },
  truthText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
