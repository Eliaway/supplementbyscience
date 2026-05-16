/**
 * المكملات في رمضان والصيام الديني
 * Feature #41: Supplements during Ramadan
 */
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const IFTAR_SUPPLEMENTS = [
  { name: "الماء + الأملاح المعدنية", dose: "فوراً عند الإفطار", priority: "ضروري", note: "تعويض السوائل والأملاح المفقودة", color: "#3B82F6" },
  { name: "التمر (3-7 تمرات)", dose: "مع الإفطار", priority: "ضروري", note: "رفع السكر الطبيعي + المغنيسيوم + البوتاسيوم", color: "#F59E0B" },
  { name: "فيتامين D3 + K2", dose: "مع أول وجبة", priority: "مهم", note: "مع الدهون الموجودة في الطعام", color: "#F59E0B" },
  { name: "أوميغا-3", dose: "مع الإفطار", priority: "مهم", note: "مع الطعام الدهني", color: "#0EA5E9" },
  { name: "الزنك", dose: "مع الإفطار", priority: "مهم", note: "يدعم المناعة والطاقة", color: "#3B82F6" },
  { name: "البروبيوتيك", dose: "مع الإفطار", priority: "مفيد", note: "يدعم صحة الجهاز الهضمي", color: "#10B981" },
];

const SUHOOR_SUPPLEMENTS = [
  { name: "المغنيسيوم Glycinate", dose: "400 mg مع السحور", priority: "ضروري", note: "يقلل الإرهاق أثناء النهار ويحسن النوم", color: "#10B981" },
  { name: "فيتامين B12", dose: "مع السحور", priority: "مهم", note: "يدعم الطاقة طوال اليوم", color: "#8B5CF6" },
  { name: "الكالسيوم", dose: "مع السحور", priority: "مهم", note: "مع الحليب أو الجبن في السحور", color: "#F97316" },
  { name: "فيتامين C", dose: "500 mg مع السحور", priority: "مفيد", note: "مضاد أكسدة يدعم المناعة", color: "#EF4444" },
  { name: "الكرياتين (للرياضيين)", dose: "5 g مع السحور", priority: "للرياضيين", note: "يحافظ على العضلات أثناء الصيام", color: "#8B5CF6" },
];

const RAMADAN_TIPS = [
  { tip: "تجنب المكملات المنبهة (كافيين عالي) قبل النوم", icon: "moon.fill", color: "#6366F1" },
  { tip: "الحديد يُؤخذ مع عصير البرتقال عند الإفطار لأفضل امتصاص", icon: "bolt.fill", color: "#DC2626" },
  { tip: "البروتين ضروري في السحور للحفاظ على العضلات", icon: "figure.strengthtraining.traditional", color: "#8B5CF6" },
  { tip: "اشرب 8-10 أكواب ماء بين الإفطار والسحور", icon: "drop.fill", color: "#3B82F6" },
  { tip: "تجنب الإفراط في الكافيين - يزيد الجفاف", icon: "exclamationmark.triangle.fill", color: "#F59E0B" },
  { tip: "المكملات الدهنية (D, E, K, A) مع وجبة دهنية في الإفطار", icon: "sun.max.fill", color: "#F59E0B" },
];

const PRIORITY_COLORS: Record<string, string> = {
  "ضروري": "#EF4444",
  "مهم": "#F59E0B",
  "مفيد": "#10B981",
  "للرياضيين": "#8B5CF6",
};

export default function RamadanSupplementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>المكملات في رمضان</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>جدول مكملاتك في الإفطار والسحور</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.ramadanBanner, { backgroundColor: "#10B981" + "15", borderColor: "#10B981" + "30" }]}>
          <Text style={[styles.bannerText, { color: "#10B981" }]}>
            رمضان فرصة ذهبية لإعادة ضبط الجسم. المكملات الصحيحة تساعدك على الاستفادة القصوى من الصيام.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>عند الإفطار</Text>
        {IFTAR_SUPPLEMENTS.map((supp, i) => (
          <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
              <Text style={[styles.suppDose, { color: colors.muted }]}>{supp.dose}</Text>
              <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: (PRIORITY_COLORS[supp.priority] || colors.primary) + "15" }]}>
              <Text style={[styles.priorityText, { color: PRIORITY_COLORS[supp.priority] || colors.primary }]}>{supp.priority}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>عند السحور</Text>
        {SUHOOR_SUPPLEMENTS.map((supp, i) => (
          <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
              <Text style={[styles.suppDose, { color: colors.muted }]}>{supp.dose}</Text>
              <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: (PRIORITY_COLORS[supp.priority] || colors.primary) + "15" }]}>
              <Text style={[styles.priorityText, { color: PRIORITY_COLORS[supp.priority] || colors.primary }]}>{supp.priority}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نصائح مهمة</Text>
        {RAMADAN_TIPS.map((tip, i) => (
          <View key={i} style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name={tip.icon as any} size={18} color={tip.color} />
            <Text style={[styles.tipText, { color: colors.foreground }]}>{tip.tip}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  ramadanBanner: { borderRadius: 14, padding: 14, borderWidth: 1 },
  bannerText: { fontSize: 13, textAlign: "right", lineHeight: 22, fontFamily: "Cairo" },
  suppCard: { borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  suppName: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  suppNote: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  priorityText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  tipCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  tipText: { flex: 1, fontSize: 13, textAlign: "right", lineHeight: 20, fontFamily: "Cairo" },
});
