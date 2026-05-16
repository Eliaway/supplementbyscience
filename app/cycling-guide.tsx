/**
 * دليل دورات المكملات (Supplement Cycling)
 * Features: 79 (دورات المكملات), 80 (التدوير والراحة)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const CYCLING_PROTOCOLS = [
  {
    supplement: "Creatine Monohydrate",
    cycle: "مستمر (لا يحتاج دورة)",
    color: "#3B82F6",
    note: "آمن للاستخدام المستمر — لا توجد فائدة من الدورات",
    schedule: null,
  },
  {
    supplement: "Caffeine",
    cycle: "5 أيام تناول / يومان راحة",
    color: "#F59E0B",
    note: "يمنع بناء التحمل ويحافظ على الفعالية",
    schedule: { on: "5 أيام", off: "يومان" },
  },
  {
    supplement: "Ashwagandha",
    cycle: "8 أسابيع تناول / أسبوعان راحة",
    color: "#10B981",
    note: "يمنع التكيف ويحافظ على فعالية خفض الكورتيزول",
    schedule: { on: "8 أسابيع", off: "أسبوعان" },
  },
  {
    supplement: "Berberine",
    cycle: "8 أسابيع تناول / أسبوعان راحة",
    color: "#8B5CF6",
    note: "يمنع التكيف ويحافظ على فعالية تخفيض السكر",
    schedule: { on: "8 أسابيع", off: "أسبوعان" },
  },
  {
    supplement: "Melatonin",
    cycle: "استخدم أقل جرعة فعالة فقط",
    color: "#6366F1",
    note: "الاستخدام المستمر يقلل إنتاج الجسم الطبيعي — استخدم عند الحاجة فقط",
    schedule: null,
  },
  {
    supplement: "Pre-workout (Stimulants)",
    cycle: "5 أيام تناول / يومان راحة",
    color: "#EF4444",
    note: "يمنع بناء التحمل للكافيين والمنشطات الأخرى",
    schedule: { on: "5 أيام", off: "يومان" },
  },
  {
    supplement: "Adaptogens (Rhodiola, Ginseng)",
    cycle: "6 أسابيع تناول / أسبوعان راحة",
    color: "#EC4899",
    note: "المبدأ التقليدي للمحولات — يحافظ على الفعالية",
    schedule: { on: "6 أسابيع", off: "أسبوعان" },
  },
  {
    supplement: "Vitamin D3",
    cycle: "مستمر (مع مراقبة المستويات)",
    color: "#F59E0B",
    note: "فحص المستوى كل 6 أشهر — اضبط الجرعة حسب النتيجة",
    schedule: null,
  },
];

const CYCLING_REASONS = [
  { reason: "منع التحمل", desc: "الجسم يتكيف مع المكمل ويصبح أقل استجابة له" },
  { reason: "تجنب الاعتماد", desc: "بعض المكملات تقلل الإنتاج الطبيعي عند الاستخدام المستمر" },
  { reason: "توفير المال", desc: "الراحة الدورية تقلل التكلفة الإجمالية" },
  { reason: "تقييم الفعالية", desc: "فترة الراحة تساعد في تقييم تأثير المكمل الفعلي" },
  { reason: "سلامة الكبد والكلى", desc: "بعض المكملات تحتاج فترة راحة لحماية الأعضاء" },
];

export default function CyclingGuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>دورات المكملات</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>متى تأخذ راحة من المكملات؟</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>لماذا الدورات مهمة؟</Text>
        <View style={styles.reasonsGrid}>
          {CYCLING_REASONS.map((item, i) => (
            <View key={i} style={[styles.reasonCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.reasonTitle, { color: colors.primary }]}>{item.reason}</Text>
              <Text style={[styles.reasonDesc, { color: colors.muted }]}>{item.desc}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>جدول الدورات</Text>
        {CYCLING_PROTOCOLS.map((item, i) => (
          <Pressable
            key={i}
            style={[styles.cycleCard, { backgroundColor: colors.card, borderColor: item.color + "40" }]}
            onPress={() => setExpandedItem(expandedItem === item.supplement ? null : item.supplement)}
          >
            <View style={[styles.cycleHeader, { backgroundColor: item.color + "10" }]}>
              <IconSymbol name={expandedItem === item.supplement ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.cycleInfo}>
                {item.schedule ? (
                  <View style={styles.scheduleRow}>
                    <View style={[styles.offBadge, { backgroundColor: colors.error + "20" }]}>
                      <Text style={[styles.offText, { color: colors.error }]}>راحة: {item.schedule.off}</Text>
                    </View>
                    <View style={[styles.onBadge, { backgroundColor: colors.success + "20" }]}>
                      <Text style={[styles.onText, { color: colors.success }]}>تناول: {item.schedule.on}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.continuousBadge, { backgroundColor: colors.primary + "20" }]}>
                    <Text style={[styles.continuousText, { color: colors.primary }]}>مستمر</Text>
                  </View>
                )}
                <Text style={[styles.cycleName, { color: colors.foreground }]}>{item.supplement}</Text>
              </View>
            </View>
            {expandedItem === item.supplement && (
              <Text style={[styles.cycleNote, { color: colors.muted }]}>{item.note}</Text>
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
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  reasonsGrid: { gap: 8 },
  reasonCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  reasonTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  reasonDesc: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  cycleCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cycleHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 12, gap: 10 },
  cycleInfo: { flex: 1, gap: 4 },
  cycleName: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  scheduleRow: { flexDirection: "row-reverse", gap: 8 },
  onBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  onText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  offBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  offText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  continuousBadge: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  continuousText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  cycleNote: { padding: 12, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
