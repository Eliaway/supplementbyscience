/**
 * المكملات في الحمل والرضاعة
 * Feature #47: Supplements during pregnancy and breastfeeding
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const PREGNANCY_SUPPLEMENTS = [
  { name: "حمض الفوليك (Folate)", dose: "400-800 mcg يومياً", timing: "قبل الحمل وخلاله", priority: "ضروري جداً", note: "يمنع عيوب الأنبوب العصبي - ابدأ قبل الحمل بـ 3 أشهر", safe: true, color: "#10B981" },
  { name: "الحديد", dose: "27 mg يومياً", timing: "الثلث الثاني والثالث", priority: "ضروري", note: "لمنع فقر الدم في الحمل - خذيه مع فيتامين C", safe: true, color: "#DC2626" },
  { name: "الكالسيوم", dose: "1000-1200 mg يومياً", timing: "طوال الحمل", priority: "ضروري", note: "لبناء عظام الجنين - مقسم على جرعتين", safe: true, color: "#F97316" },
  { name: "فيتامين D3", dose: "1000-2000 IU يومياً", timing: "طوال الحمل", priority: "ضروري", note: "يعزز امتصاص الكالسيوم ويدعم مناعة الجنين", safe: true, color: "#F59E0B" },
  { name: "أوميغا-3 DHA", dose: "200-300 mg DHA يومياً", timing: "طوال الحمل", priority: "مهم جداً", note: "لنمو دماغ وعيون الجنين - اختاري نوع منخفض الزئبق", safe: true, color: "#0EA5E9" },
  { name: "اليود", dose: "150-220 mcg يومياً", timing: "طوال الحمل", priority: "مهم", note: "ضروري لتطور الغدة الدرقية للجنين", safe: true, color: "#8B5CF6" },
  { name: "المغنيسيوم", dose: "350-400 mg يومياً", timing: "طوال الحمل", priority: "مهم", note: "يقلل تشنجات الساق ويدعم نوم الأم", safe: true, color: "#10B981" },
  { name: "فيتامين B6", dose: "10-25 mg يومياً", timing: "الثلث الأول", priority: "مفيد", note: "يقلل الغثيان الصباحي بشكل فعال", safe: true, color: "#8B5CF6" },
];

const DANGEROUS_SUPPLEMENTS = [
  { name: "فيتامين A (جرعة عالية)", danger: "عيوب خلقية في الجنين", note: "تجنبي أكثر من 10,000 IU يومياً" },
  { name: "فيتامين E (جرعة عالية)", danger: "خطر النزيف", note: "لا تتجاوزي 400 IU يومياً" },
  { name: "الأعشاب الطبية", danger: "قد تحفز الانقباضات", note: "تجنبي الزنجبيل الزائد، القرفة المركزة، الكركم المركز" },
  { name: "الكافيين الزائد", danger: "خطر الإجهاض وانخفاض الوزن", note: "لا تتجاوزي 200 mg يومياً" },
  { name: "Ashwagandha", danger: "قد يحفز الإجهاض", note: "تجنبي تماماً في الحمل" },
  { name: "زيت السمك بجرعة عالية", danger: "خطر النزيف قبل الولادة", note: "لا تتجاوزي 3 g يومياً" },
];

const BREASTFEEDING_SUPPLEMENTS = [
  { name: "أوميغا-3 DHA", dose: "200-300 mg DHA", note: "يمر للحليب ويدعم دماغ الرضيع" },
  { name: "فيتامين D3", dose: "1000-2000 IU", note: "الرضيع يحتاج مكملاً منفصلاً" },
  { name: "الكالسيوم", dose: "1000 mg", note: "لتعويض ما يُفقد في الحليب" },
  { name: "الحديد", dose: "حسب الفحص", note: "إذا كان هناك فقر دم بعد الولادة" },
  { name: "المغنيسيوم", dose: "310-360 mg", note: "يدعم الطاقة وجودة النوم" },
];

export default function PregnancySupplementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pregnancy" | "danger" | "breastfeeding">("pregnancy");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>المكملات في الحمل والرضاعة</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>دليل آمن للأمهات</Text>
        </View>
      </View>

      <View style={[styles.warningBanner, { backgroundColor: colors.error + "10", borderColor: colors.error + "30" }]}>
        <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.error} />
        <Text style={[styles.warningText, { color: colors.error }]}>استشيري طبيبك قبل أخذ أي مكمل خلال الحمل</Text>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {[
          { id: "pregnancy", label: "الحمل" },
          { id: "danger", label: "تجنبي" },
          { id: "breastfeeding", label: "الرضاعة" },
        ].map(tab => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>
        {activeTab === "pregnancy" && PREGNANCY_SUPPLEMENTS.map((supp, i) => (
          <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
              <Text style={[styles.suppDose, { color: colors.muted }]}>{supp.dose} — {supp.timing}</Text>
              <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: supp.color + "15" }]}>
              <Text style={[styles.priorityText, { color: supp.color }]}>{supp.priority}</Text>
            </View>
          </View>
        ))}

        {activeTab === "danger" && DANGEROUS_SUPPLEMENTS.map((supp, i) => (
          <View key={i} style={[styles.dangerCard, { backgroundColor: colors.surface, borderColor: colors.error + "30" }]}>
            <IconSymbol name="xmark.circle.fill" size={20} color={colors.error} />
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
              <Text style={[styles.dangerText, { color: colors.error }]}>{supp.danger}</Text>
              <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
            </View>
          </View>
        ))}

        {activeTab === "breastfeeding" && BREASTFEEDING_SUPPLEMENTS.map((supp, i) => (
          <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
              <Text style={[styles.suppDose, { color: colors.muted }]}>{supp.dose}</Text>
              <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
            </View>
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  warningBanner: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 10, borderBottomWidth: 1 },
  warningText: { fontSize: 12, fontWeight: "700", flex: 1, textAlign: "right" },
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontWeight: "700" },
  suppCard: { borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  suppName: { fontSize: 14, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 12, textAlign: "right" },
  suppNote: { fontSize: 11, textAlign: "right" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  priorityText: { fontSize: 11, fontWeight: "700" },
  dangerCard: { borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  dangerText: { fontSize: 12, fontWeight: "700", textAlign: "right" },
});
