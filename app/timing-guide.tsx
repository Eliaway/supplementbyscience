/**
 * دليل التوقيت الأمثل — Supplement Timing Guide
 * Features #38, #39, #40: Best timing, meal interactions, stacking rules
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

type TimeSlot = "صباح_فارغ" | "صباح_طعام" | "قبل_تمرين" | "بعد_تمرين" | "ظهر_طعام" | "مساء_طعام" | "قبل_نوم";

interface TimingEntry {
  supplement: string;
  bestTime: TimeSlot[];
  avoidWith: string[];
  takeWith: string[];
  reason: string;
  absorption: "عالي" | "متوسط" | "منخفض_بدون_دهون";
}

const TIME_LABELS: Record<TimeSlot, { label: string; icon: Parameters<typeof IconSymbol>[0]["name"]; color: string }> = {
  "صباح_فارغ": { label: "صباح — معدة فارغة", icon: "sun.max.fill", color: "#F59E0B" },
  "صباح_طعام": { label: "صباح — مع الطعام", icon: "fork.knife", color: "#F97316" },
  "قبل_تمرين": { label: "قبل التمرين (30-60 دقيقة)", icon: "figure.run", color: "#EF4444" },
  "بعد_تمرين": { label: "بعد التمرين (30 دقيقة)", icon: "figure.strengthtraining.traditional", color: "#10B981" },
  "ظهر_طعام": { label: "الظهر — مع الطعام", icon: "sun.max.fill", color: "#F59E0B" },
  "مساء_طعام": { label: "المساء — مع الطعام", icon: "moon.fill", color: "#6366F1" },
  "قبل_نوم": { label: "قبل النوم (1-2 ساعة)", icon: "moon.stars.fill", color: "#8B5CF6" },
};

const TIMING_DATA: TimingEntry[] = [
  {
    supplement: "فيتامين D3",
    bestTime: ["صباح_طعام", "ظهر_طعام"],
    avoidWith: ["الكافيين (يقلل الامتصاص)", "الحديد"],
    takeWith: ["الدهون الصحية", "فيتامين K2", "المغنيسيوم"],
    reason: "قابل للذوبان في الدهون — يحتاج وجبة دهنية للامتصاص. تجنب المساء لأنه قد يؤثر على النوم.",
    absorption: "منخفض_بدون_دهون",
  },
  {
    supplement: "المغنيسيوم Glycinate",
    bestTime: ["قبل_نوم"],
    avoidWith: ["الكالسيوم (منافسة في الامتصاص)", "الحديد"],
    takeWith: ["فيتامين D3", "فيتامين B6"],
    reason: "يرخي الجهاز العصبي ويحسن النوم العميق. أخذه مساءً يعطي أفضل النتائج.",
    absorption: "عالي",
  },
  {
    supplement: "الكالسيوم Citrate",
    bestTime: ["صباح_طعام", "مساء_طعام"],
    avoidWith: ["المغنيسيوم في نفس الوقت", "الحديد", "الزنك"],
    takeWith: ["فيتامين D3", "فيتامين K2"],
    reason: "Citrate يمتص بدون حمض معدي. قسّم الجرعة — لا تأخذ أكثر من 500 مغ في مرة واحدة.",
    absorption: "عالي",
  },
  {
    supplement: "الحديد",
    bestTime: ["صباح_فارغ"],
    avoidWith: ["الكالسيوم", "القهوة والشاي (تانينات)", "مضادات الحموضة"],
    takeWith: ["فيتامين C (يضاعف الامتصاص 3×)", "عصير البرتقال"],
    reason: "يمتص بشكل أفضل على معدة فارغة مع فيتامين C. القهوة والشاي يقللان امتصاصه بنسبة 60-70%.",
    absorption: "منخفض_بدون_دهون",
  },
  {
    supplement: "الزنك",
    bestTime: ["صباح_طعام", "مساء_طعام"],
    avoidWith: ["الكالسيوم", "الحديد", "القهوة"],
    takeWith: ["فيتامين C", "البروتين"],
    reason: "يمتص بشكل أفضل مع الطعام لتجنب الغثيان. تجنب أخذه مع الكالسيوم أو الحديد.",
    absorption: "متوسط",
  },
  {
    supplement: "أوميغا-3",
    bestTime: ["صباح_طعام", "مساء_طعام"],
    avoidWith: ["مضادات التخثر (استشر الطبيب)"],
    takeWith: ["فيتامين E (يمنع الأكسدة)", "وجبة دهنية"],
    reason: "قابل للذوبان في الدهون — وجبة دهنية تضاعف امتصاصه. تجنب أخذه على معدة فارغة لتجنب الارتجاع.",
    absorption: "منخفض_بدون_دهون",
  },
  {
    supplement: "فيتامين C",
    bestTime: ["صباح_طعام", "ظهر_طعام"],
    avoidWith: ["جرعات كبيرة مع الحديد (يزيد الامتصاص كثيراً)"],
    takeWith: ["الكولاجين", "الحديد (إذا أردت زيادة امتصاصه)", "فيتامين E"],
    reason: "قابل للذوبان في الماء — يُطرح الزائد في البول. قسّم الجرعات طوال اليوم للحصول على أفضل مستوى.",
    absorption: "عالي",
  },
  {
    supplement: "CoQ10 Ubiquinol",
    bestTime: ["صباح_طعام", "ظهر_طعام"],
    avoidWith: ["الستاتين (يقلل مستوياته)"],
    takeWith: ["وجبة دهنية", "فيتامين E"],
    reason: "قابل للذوبان في الدهون — وجبة دهنية تزيد امتصاصه 3×. Ubiquinol أفضل من Ubiquinone لكبار السن.",
    absorption: "منخفض_بدون_دهون",
  },
  {
    supplement: "الكرياتين",
    bestTime: ["بعد_تمرين", "صباح_طعام"],
    avoidWith: ["الكافيين (قد يقلل الفعالية في بعض الدراسات)"],
    takeWith: ["الكربوهيدرات", "البروتين"],
    reason: "بعد التمرين مع الكربوهيدرات يحسن امتصاصه في العضلات. لا توقيت مثالي ثابت — الاتساق أهم.",
    absorption: "عالي",
  },
  {
    supplement: "البروتين (Whey)",
    bestTime: ["بعد_تمرين", "صباح_فارغ"],
    avoidWith: [],
    takeWith: ["الكرياتين", "الكربوهيدرات"],
    reason: "بعد التمرين مباشرة (نافذة الأنابوليك 30-60 دقيقة) لبناء العضلات. صباحاً لكسر الصيام الليلي.",
    absorption: "عالي",
  },
  {
    supplement: "Ashwagandha",
    bestTime: ["مساء_طعام", "قبل_نوم"],
    avoidWith: ["أدوية الغدة الدرقية (استشر الطبيب)", "مضادات القلق"],
    takeWith: ["الحليب الدافئ (التقليد الأيورفيدي)", "الدهون"],
    reason: "يخفض الكورتيزول — أخذه مساءً يساعد على الاسترخاء والنوم. مع الطعام لتجنب الغثيان.",
    absorption: "متوسط",
  },
  {
    supplement: "الكولاجين",
    bestTime: ["صباح_فارغ"],
    avoidWith: [],
    takeWith: ["فيتامين C (ضروري لتخليق الكولاجين)", "الماء"],
    reason: "على معدة فارغة يمتص بشكل أفضل. فيتامين C ضروري لتحويله إلى كولاجين في الجسم.",
    absorption: "عالي",
  },
  {
    supplement: "البروبيوتيك",
    bestTime: ["صباح_فارغ"],
    avoidWith: ["المضادات الحيوية (خذها بفارق ساعتين)", "الكلور في الماء"],
    takeWith: ["البريبيوتيك (يغذي البكتيريا النافعة)"],
    reason: "على معدة فارغة قبل الفطور — حموضة المعدة أقل فتبقى البكتيريا حية أكثر.",
    absorption: "عالي",
  },
  {
    supplement: "فيتامين B12",
    bestTime: ["صباح_فارغ"],
    avoidWith: ["مضادات الحموضة (تقلل الامتصاص)"],
    takeWith: ["فيتامين B6", "حمض الفوليك"],
    reason: "يمتص بشكل أفضل على معدة فارغة. Methylcobalamin أفضل من Cyanocobalamin.",
    absorption: "متوسط",
  },
  {
    supplement: "فيتامين K2 (MK-7)",
    bestTime: ["صباح_طعام", "مساء_طعام"],
    avoidWith: ["مضادات التخثر (Warfarin) — استشر الطبيب"],
    takeWith: ["فيتامين D3", "الكالسيوم", "وجبة دهنية"],
    reason: "قابل للذوبان في الدهون. MK-7 نصف حياته 72 ساعة — مرة يومياً كافية.",
    absorption: "منخفض_بدون_دهون",
  },
];

const STACKING_RULES = [
  { title: "مضخم التأثير ✅", desc: "D3 + K2 + المغنيسيوم — الثلاثي الذهبي لصحة العظام والقلب", color: "#10B981" },
  { title: "مضخم التأثير ✅", desc: "الحديد + فيتامين C — يضاعف امتصاص الحديد 3 أضعاف", color: "#10B981" },
  { title: "مضخم التأثير ✅", desc: "الكولاجين + فيتامين C — بدون C الكولاجين لا يعمل", color: "#10B981" },
  { title: "مضخم التأثير ✅", desc: "أوميغا-3 + فيتامين E — E يمنع أكسدة الأوميغا-3", color: "#10B981" },
  { title: "تعارض ⚠️", desc: "الكالسيوم + المغنيسيوم في نفس الوقت — ينافسان بعضهما في الامتصاص", color: "#F59E0B" },
  { title: "تعارض ⚠️", desc: "الحديد + الكالسيوم أو الزنك — يقللان امتصاص بعضهما", color: "#F59E0B" },
  { title: "خطر ❌", desc: "5-HTP + SSRI/SNRI — خطر Serotonin Syndrome", color: "#EF4444" },
  { title: "خطر ❌", desc: "Nattokinase + Warfarin — خطر نزيف", color: "#EF4444" },
  { title: "خطر ❌", desc: "بيتا كاروتين جرعة عالية + التدخين — يزيد خطر سرطان الرئة", color: "#EF4444" },
];

export default function TimingGuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"timing" | "stacking">("timing");
  const [selectedEntry, setSelectedEntry] = useState<TimingEntry | null>(null);

  if (selectedEntry) {
    const e = selectedEntry;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedEntry(null)}>
            <IconSymbol name="chevron.right" size={22} color={colors.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{e.supplement}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أفضل أوقات الأخذ</Text>
          {e.bestTime.map((t) => {
            const info = TIME_LABELS[t];
            return (
              <View key={t} style={[styles.timeCard, { backgroundColor: info.color + "12", borderColor: info.color + "30" }]}>
                <IconSymbol name={info.icon} size={20} color={info.color} />
                <Text style={[styles.timeLabel, { color: colors.foreground }]}>{info.label}</Text>
              </View>
            );
          })}

          <View style={[styles.reasonCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.reasonTitle, { color: colors.foreground }]}>لماذا هذا التوقيت؟</Text>
            <Text style={[styles.reasonText, { color: colors.muted }]}>{e.reason}</Text>
          </View>

          {e.takeWith.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>خذه مع ✅</Text>
              {e.takeWith.map((item, i) => (
                <View key={i} style={[styles.itemRow, { backgroundColor: colors.success + "08", borderColor: colors.success + "20" }]}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                  <Text style={[styles.itemText, { color: colors.foreground }]}>{item}</Text>
                </View>
              ))}
            </>
          )}

          {e.avoidWith.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>تجنب أخذه مع ⚠️</Text>
              {e.avoidWith.map((item, i) => (
                <View key={i} style={[styles.itemRow, { backgroundColor: colors.error + "08", borderColor: colors.error + "20" }]}>
                  <IconSymbol name="xmark.circle.fill" size={16} color={colors.error} />
                  <Text style={[styles.itemText, { color: colors.foreground }]}>{item}</Text>
                </View>
              ))}
            </>
          )}

          <View style={[styles.absorptionCard, { backgroundColor: e.absorption === "عالي" ? colors.success + "10" : e.absorption === "متوسط" ? colors.warning + "10" : colors.error + "10", borderColor: e.absorption === "عالي" ? colors.success + "30" : e.absorption === "متوسط" ? colors.warning + "30" : colors.error + "30" }]}>
            <Text style={[styles.absorptionLabel, { color: colors.muted }]}>معدل الامتصاص</Text>
            <Text style={[styles.absorptionValue, { color: e.absorption === "عالي" ? colors.success : e.absorption === "متوسط" ? colors.warning : colors.error }]}>
              {e.absorption === "منخفض_بدون_دهون" ? "منخفض بدون دهون" : e.absorption}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>دليل التوقيت الأمثل</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>متى وكيف تأخذ مكملاتك</Text>
        </View>
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(["timing", "stacking"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.muted }]}>
              {tab === "timing" ? "توقيت المكملات" : "قواعد الدمج"}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "timing" ? (
        <FlatList
          data={TIMING_DATA}
          keyExtractor={(item) => item.supplement}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.entryCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.85 }]}
              onPress={() => setSelectedEntry(item)}
            >
              <View style={styles.entryTop}>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.entryName, { color: colors.foreground }]}>{item.supplement}</Text>
                  <View style={styles.timeBadges}>
                    {item.bestTime.slice(0, 2).map((t) => {
                      const info = TIME_LABELS[t];
                      return (
                        <View key={t} style={[styles.timeBadge, { backgroundColor: info.color + "12" }]}>
                          <Text style={[styles.timeBadgeText, { color: info.color }]}>{info.label.split(" — ")[0]}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <View style={[styles.absorptionDot, { backgroundColor: item.absorption === "عالي" ? colors.success : item.absorption === "متوسط" ? colors.warning : colors.error }]} />
              </View>
              <Text style={[styles.entryReason, { color: colors.muted }]} numberOfLines={2}>{item.reason}</Text>
            </Pressable>
          )}
        />
      ) : (
        <FlatList
          data={STACKING_RULES}
          keyExtractor={(item, i) => `${i}`}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          ListHeaderComponent={
            <View style={[styles.stackHeader, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "20" }]}>
              <Text style={[styles.stackHeaderText, { color: colors.foreground }]}>
                قواعد الدمج تحدد ما إذا كانت المكملات تتعاون أو تتعارض. اتبع هذه القواعد لأقصى فائدة وأقل مخاطر.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.stackCard, { backgroundColor: item.color + "08", borderColor: item.color + "25", borderLeftColor: item.color, borderLeftWidth: 4 }]}>
              <Text style={[styles.stackTitle, { color: item.color }]}>{item.title}</Text>
              <Text style={[styles.stackDesc, { color: colors.foreground }]}>{item.desc}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  tabs: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 14, fontWeight: "700", fontFamily: "Cairo-Bold" },
  entryCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  entryTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  entryName: { fontSize: 15, fontWeight: "800", textAlign: "right", marginBottom: 6, fontFamily: "Cairo-Black" },
  timeBadges: { flexDirection: "row-reverse", gap: 6, flexWrap: "wrap" },
  timeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  timeBadgeText: { fontSize: 10, fontWeight: "700", fontFamily: "Cairo-Bold" },
  absorptionDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  entryReason: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", marginTop: 4, fontFamily: "Cairo-Black" },
  timeCard: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  timeLabel: { fontSize: 14, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  reasonCard: { borderRadius: 12, padding: 14, borderWidth: 1, gap: 8 },
  reasonTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  reasonText: { fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  itemRow: { flexDirection: "row-reverse", gap: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  itemText: { flex: 1, fontSize: 13, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  absorptionCard: { borderRadius: 12, padding: 14, borderWidth: 1, flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  absorptionLabel: { fontSize: 13, fontFamily: "Cairo" },
  absorptionValue: { fontSize: 15, fontWeight: "800", fontFamily: "Cairo-Black" },
  stackHeader: { borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 4 },
  stackHeaderText: { fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  stackCard: { borderRadius: 12, padding: 14, borderWidth: 1, gap: 6 },
  stackTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  stackDesc: { fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
});
