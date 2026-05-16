/**
 * خريطة التفاعلات — Supplement Interactions Map
 * Feature #36
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface Interaction {
  id: string;
  supplement1: string;
  supplement2: string;
  type: "synergy" | "conflict" | "neutral" | "timing";
  severity: "ممتاز" | "جيد" | "تحذير" | "خطر";
  title: string;
  description: string;
  recommendation: string;
}

const INTERACTIONS: Interaction[] = [
  {
    id: "i1", supplement1: "فيتامين D3", supplement2: "فيتامين K2",
    type: "synergy", severity: "ممتاز",
    title: "تآزر ممتاز — D3 + K2",
    description: "K2 يوجه الكالسيوم الذي يمتصه D3 إلى العظام بدلاً من الشرايين — يقلل خطر تكلس الأوعية.",
    recommendation: "خذهما معاً دائماً. النسبة المثالية: D3 5000 IU مع K2 100-200 مكغ.",
  },
  {
    id: "i2", supplement1: "الكالسيوم", supplement2: "الحديد",
    type: "conflict", severity: "تحذير",
    title: "تنافس على الامتصاص",
    description: "الكالسيوم والحديد يتنافسان على نفس الناقل المعوي — أخذهما معاً يقلل امتصاص كليهما.",
    recommendation: "فصل بينهما بساعتين على الأقل. الحديد صباحاً، الكالسيوم مساءً.",
  },
  {
    id: "i3", supplement1: "الزنك", supplement2: "النحاس",
    type: "conflict", severity: "تحذير",
    title: "الزنك يستنزف النحاس",
    description: "الزنك العالي يقلل امتصاص النحاس — النقص المزمن في النحاس يسبب فقر الدم وضعف المناعة.",
    recommendation: "لكل 15 مغ زنك، أضف 1 مغ نحاس. أو خذ مركب متعدد المعادن.",
  },
  {
    id: "i4", supplement1: "الكرياتين", supplement2: "الكافيين",
    type: "neutral", severity: "جيد",
    title: "لا تأثير متبادل مثبت",
    description: "الدراسات القديمة أشارت لتعارض، لكن الأبحاث الحديثة لم تجد تأثيراً سلبياً لأخذهما معاً.",
    recommendation: "يمكن أخذهما معاً بأمان. الكرياتين 5 غ يومياً مع أي وقت.",
  },
  {
    id: "i5", supplement1: "أوميغا-3", supplement2: "فيتامين E",
    type: "synergy", severity: "جيد",
    title: "E يحمي أوميغا-3 من الأكسدة",
    description: "أوميغا-3 عرضة للأكسدة — فيتامين E كمضاد أكسدة يحمي الأحماض الدهنية ويطيل فعاليتها.",
    recommendation: "خذهما معاً مع وجبة دهنية. فيتامين E 100-200 IU كافٍ.",
  },
  {
    id: "i6", supplement1: "الحديد", supplement2: "فيتامين C",
    type: "synergy", severity: "ممتاز",
    title: "C يضاعف امتصاص الحديد",
    description: "فيتامين C يحول الحديد من الشكل الثلاثي إلى الثنائي الأسهل امتصاصاً — يزيد الامتصاص 3-4 أضعاف.",
    recommendation: "خذ الحديد مع عصير برتقال أو 500 مغ فيتامين C. تجنب الشاي والقهوة.",
  },
  {
    id: "i7", supplement1: "المغنيسيوم", supplement2: "فيتامين B6",
    type: "synergy", severity: "ممتاز",
    title: "B6 يعزز دخول المغنيسيوم للخلايا",
    description: "B6 يساعد في نقل المغنيسيوم داخل الخلايا — يحسن فعاليته في تقليل التوتر والقلق.",
    recommendation: "ابحث عن مكملات تجمعهما. Magnesium Bisglycinate مع B6 50 مغ.",
  },
  {
    id: "i8", supplement1: "5-HTP", supplement2: "SSRIs / SNRIs",
    type: "conflict", severity: "خطر",
    title: "خطر Serotonin Syndrome",
    description: "5-HTP يرفع السيروتونين مباشرة — مع أدوية SSRI/SNRI قد يسبب تراكماً خطيراً للسيروتونين.",
    recommendation: "لا تجمع 5-HTP مع أي دواء نفسي دون استشارة طبيب متخصص.",
  },
  {
    id: "i9", supplement1: "الجنكو بيلوبا", supplement2: "مضادات التخثر",
    type: "conflict", severity: "خطر",
    title: "خطر نزيف مرتفع",
    description: "الجنكو يثبط تجمع الصفائح الدموية — مع Warfarin أو Aspirin يزيد خطر النزيف بشكل كبير.",
    recommendation: "أخبر طبيبك إذا كنت تأخذ مضادات التخثر. لا تجمعهما دون إشراف طبي.",
  },
  {
    id: "i10", supplement1: "الكرياتين", supplement2: "البروتين",
    type: "synergy", severity: "ممتاز",
    title: "مزيج مثالي لبناء العضلات",
    description: "الكرياتين يزيد قوة التمرين، البروتين يوفر اللبنات — معاً يحققان أفضل نتائج لبناء العضلات.",
    recommendation: "الكرياتين 5 غ قبل أو بعد التمرين، البروتين 25-40 غ بعد التمرين مباشرة.",
  },
  {
    id: "i11", supplement1: "الأشواغاندا", supplement2: "أدوية الغدة الدرقية",
    type: "conflict", severity: "تحذير",
    title: "قد تؤثر على هرمونات الغدة",
    description: "الأشواغاندا قد ترفع هرمون T4 — قد يتطلب تعديل جرعة Levothyroxine.",
    recommendation: "أخبر طبيبك إذا كنت تأخذ أدوية الغدة الدرقية. راقب مستوياتك بانتظام.",
  },
  {
    id: "i12", supplement1: "CoQ10", supplement2: "الستاتين",
    type: "synergy", severity: "جيد",
    title: "CoQ10 يعوض استنزاف الستاتين",
    description: "الستاتين تمنع إنتاج CoQ10 الطبيعي — الإضافة قد تقلل آلام العضلات الجانبية.",
    recommendation: "200 مغ CoQ10 Ubiquinol يومياً مع وجبة دهنية. استشر طبيبك.",
  },
  {
    id: "i13", supplement1: "الكالسيوم", supplement2: "Levothyroxine",
    type: "conflict", severity: "تحذير",
    title: "الكالسيوم يقلل امتصاص دواء الغدة",
    description: "الكالسيوم يرتبط بـ Levothyroxine ويمنع امتصاصه — يقلل فعالية الدواء.",
    recommendation: "خذ Levothyroxine على معدة فارغة، وانتظر 4 ساعات قبل الكالسيوم.",
  },
  {
    id: "i14", supplement1: "فيتامين D3", supplement2: "المغنيسيوم",
    type: "synergy", severity: "ممتاز",
    title: "المغنيسيوم ضروري لتفعيل D3",
    description: "المغنيسيوم ضروري لتحويل D3 لشكله النشط — نقصه يجعل D3 غير فعال حتى بجرعات عالية.",
    recommendation: "خذ المغنيسيوم مع D3 دائماً. 300-400 مغ Glycinate مع D3 5000 IU.",
  },
  {
    id: "i15", supplement1: "البروبيوتيك", supplement2: "المضادات الحيوية",
    type: "timing", severity: "جيد",
    title: "توقيت مهم — ليس تعارضاً",
    description: "المضادات الحيوية تقتل البروبيوتيك — لكن أخذهما بفارق ساعتين يحافظ على فعالية كليهما.",
    recommendation: "خذ البروبيوتيك بعد انتهاء المضادات الحيوية بساعتين. استمر 4 أسابيع بعدها.",
  },
];

const SEVERITY_COLORS = { "ممتاز": "#10B981", "جيد": "#3B82F6", "تحذير": "#F59E0B", "خطر": "#EF4444" };
const TYPE_ICONS: Record<string, Parameters<typeof IconSymbol>[0]["name"]> = {
  synergy: "arrow.up.forward.circle.fill",
  conflict: "xmark.circle.fill",
  neutral: "minus.circle.fill",
  timing: "clock.fill",
};

export default function InteractionsMapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "synergy" | "conflict" | "timing">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all" ? INTERACTIONS : INTERACTIONS.filter((i) => i.type === filter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>خريطة التفاعلات</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{INTERACTIONS.length} تفاعل موثق علمياً</Text>
        </View>
      </View>

      <View style={[styles.legend, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(["all", "synergy", "conflict", "timing"] as const).map((f) => {
          const labels = { all: "الكل", synergy: "تآزر", conflict: "تعارض", timing: "توقيت" };
          const fColors = { all: colors.primary, synergy: "#10B981", conflict: "#EF4444", timing: "#F59E0B" };
          return (
            <Pressable key={f}
              style={[styles.filterChip, { backgroundColor: filter === f ? fColors[f] : colors.background, borderColor: fColors[f] + "40" }]}
              onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, { color: filter === f ? "#fff" : fColors[f] }]}>{labels[f]}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
        renderItem={({ item }) => {
          const isExpanded = expanded === item.id;
          const sColor = SEVERITY_COLORS[item.severity];
          return (
            <Pressable
              style={[styles.card, { backgroundColor: colors.surface, borderColor: sColor + "30", borderLeftColor: sColor, borderLeftWidth: 4 }]}
              onPress={() => setExpanded(isExpanded ? null : item.id)}
            >
              <View style={styles.cardTop}>
                <IconSymbol name={TYPE_ICONS[item.type]} size={20} color={sColor} />
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.title}</Text>
                  <View style={styles.supplementTags}>
                    <View style={[styles.tag, { backgroundColor: colors.primary + "12" }]}>
                      <Text style={[styles.tagText, { color: colors.primary }]}>{item.supplement2}</Text>
                    </View>
                    <Text style={[styles.tagSep, { color: colors.muted }]}>+</Text>
                    <View style={[styles.tag, { backgroundColor: colors.primary + "12" }]}>
                      <Text style={[styles.tagText, { color: colors.primary }]}>{item.supplement1}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: sColor + "15" }]}>
                  <Text style={[styles.severityText, { color: sColor }]}>{item.severity}</Text>
                </View>
              </View>
              {isExpanded && (
                <View style={{ gap: 10, marginTop: 8 }}>
                  <Text style={[styles.description, { color: colors.foreground }]}>{item.description}</Text>
                  <View style={[styles.recommendation, { backgroundColor: sColor + "08", borderColor: sColor + "25" }]}>
                    <IconSymbol name="lightbulb.fill" size={14} color={sColor} />
                    <Text style={[styles.recommendationText, { color: colors.foreground }]}>{item.recommendation}</Text>
                  </View>
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  legend: { flexDirection: "row-reverse", gap: 8, padding: 12, borderBottomWidth: 0.5 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  card: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 0 },
  cardTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  cardTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  supplementTags: { flexDirection: "row-reverse", gap: 6, marginTop: 6, alignItems: "center" },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  tagSep: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  severityText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  description: { fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  recommendation: { flexDirection: "row-reverse", gap: 8, padding: 10, borderRadius: 10, borderWidth: 1 },
  recommendationText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
