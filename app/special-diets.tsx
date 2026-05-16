/**
 * مكملات الأنظمة الغذائية الخاصة
 * Features: 83 (الكيتو), 84 (النباتي), 85 (اللحوم فقط)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const DIET_PROTOCOLS = [
  {
    id: "keto",
    title: "نظام الكيتو (Ketogenic)",
    color: "#F59E0B",
    emoji: "🥑",
    description: "نظام عالي الدهون، منخفض الكربوهيدرات — يحتاج مكملات خاصة",
    supplements: [
      { name: "Electrolytes (Na, K, Mg)", dose: "حسب الحاجة", note: "الأهم في الكيتو — يمنع 'Keto Flu'" },
      { name: "Magnesium Glycinate", dose: "400-600 مغ", note: "يُفقد بكميات كبيرة في الكيتو" },
      { name: "MCT Oil", dose: "1-3 ملاعق كبيرة", note: "يرفع الكيتونات ويزيد الطاقة" },
      { name: "Omega-3", dose: "3 غ", note: "يحسن نسبة Omega-6:3 في نظام الكيتو" },
      { name: "Vitamin D3 + K2", dose: "5000 IU + 200 مكغ", note: "مهمان لصحة العظام في الكيتو" },
      { name: "B-Complex", dose: "1 كبسولة", note: "يعوض نقص B-vitamins من الحبوب" },
    ],
  },
  {
    id: "vegan",
    title: "النظام النباتي (Vegan)",
    color: "#10B981",
    emoji: "🌱",
    description: "النظام النباتي الكامل — يحتاج تكميلاً دقيقاً لتجنب النقاوص",
    supplements: [
      { name: "Vitamin B12 (Methylcobalamin)", dose: "1000 مكغ", note: "الأهم للنباتيين — لا يوجد في النباتات أبداً" },
      { name: "Vitamin D3 (Vegan)", dose: "5000 IU", note: "من الطحالب أو الأشنة — ليس من الصوف" },
      { name: "Omega-3 (Algae Oil)", dose: "500-1000 مغ DHA+EPA", note: "من الطحالب مباشرة — أفضل من زيت السمك للنباتيين" },
      { name: "Iron (Bisglycinate)", dose: "25-50 مغ", note: "الحديد النباتي أقل امتصاصاً — خذه مع فيتامين C" },
      { name: "Zinc Bisglycinate", dose: "25-30 مغ", note: "الزنك النباتي أقل امتصاصاً بسبب الفيتات" },
      { name: "Calcium (Citrate)", dose: "500-1000 مغ", note: "إذا لم تتناول منتجات الألبان" },
      { name: "Iodine", dose: "150-300 مكغ", note: "نادر في النباتات — إلا إذا أكلت أعشاب البحر يومياً" },
      { name: "Creatine", dose: "5 غ", note: "لا يوجد في النباتات — مهم جداً للرياضيين النباتيين" },
    ],
  },
  {
    id: "carnivore",
    title: "نظام اللحوم فقط (Carnivore)",
    color: "#EF4444",
    emoji: "🥩",
    description: "نظام اللحوم الكامل — يحتاج مكملات لتعويض غياب النباتات",
    supplements: [
      { name: "Vitamin C", dose: "500-1000 مغ", note: "اللحوم الطازجة تحتوي قليلاً — مهم للمناعة والكولاجين" },
      { name: "Magnesium", dose: "400 مغ", note: "اللحوم فقيرة نسبياً بالمغنيسيوم" },
      { name: "Electrolytes", dose: "حسب الحاجة", note: "مهم خاصة في البداية" },
      { name: "Vitamin K2 (MK-7)", dose: "200 مكغ", note: "يوجه الكالسيوم للعظام بعيداً عن الشرايين" },
    ],
  },
  {
    id: "intermittent_fasting",
    title: "الصيام المتقطع (IF)",
    color: "#8B5CF6",
    emoji: "⏰",
    description: "مكملات آمنة أثناء الصيام لا تكسره",
    supplements: [
      { name: "Electrolytes (بدون سعرات)", dose: "حسب الحاجة", note: "يمنع الصداع والدوخة أثناء الصيام" },
      { name: "Magnesium Glycinate", dose: "400 مغ", note: "آمن أثناء الصيام — يقلل الجوع" },
      { name: "Creatine", dose: "5 غ", note: "آمن أثناء الصيام — لا يكسره" },
      { name: "Caffeine", dose: "100-200 مغ", note: "يزيد الطاقة ويقلل الجوع أثناء الصيام" },
      { name: "Omega-3", dose: "3 غ", note: "خذها مع وجبتك — لا أثناء الصيام" },
    ],
    warning: "تجنب: الأمينو أحماض، البروتين، MCT Oil، الفيتامينات الدهنية — تكسر الصيام",
  },
];

export default function SpecialDietsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedDiet, setExpandedDiet] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>مكملات الأنظمة الغذائية الخاصة</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>كيتو • نباتي • لحوم • صيام متقطع</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {DIET_PROTOCOLS.map((diet) => (
          <View key={diet.id} style={[styles.dietCard, { backgroundColor: colors.card, borderColor: diet.color + "40" }]}>
            <Pressable
              style={[styles.dietHeader, { backgroundColor: diet.color + "10" }]}
              onPress={() => setExpandedDiet(expandedDiet === diet.id ? null : diet.id)}
            >
              <IconSymbol name={expandedDiet === diet.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.dietInfo}>
                <Text style={[styles.dietTitle, { color: colors.foreground }]}>{diet.emoji} {diet.title}</Text>
                <Text style={[styles.dietDesc, { color: colors.muted }]}>{diet.description}</Text>
              </View>
            </Pressable>
            {expandedDiet === diet.id && (
              <View style={{ padding: 12, gap: 10 }}>
                {"warning" in diet && (
                  <View style={[styles.warningCard, { backgroundColor: colors.error + "12", borderColor: colors.error + "30" }]}>
                    <Text style={[styles.warningText, { color: colors.error }]}>⚠️ {diet.warning}</Text>
                  </View>
                )}
                {diet.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: diet.color + "06", borderColor: diet.color + "20" }]}>
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    <Text style={[styles.suppDose, { color: diet.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
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
  backText: { fontSize: 14, fontWeight: "600", fontFamily: "Cairo-Bold" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  dietCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  dietHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  dietInfo: { flex: 1, gap: 4 },
  dietTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  dietDesc: { fontSize: 12, lineHeight: 16, textAlign: "right", fontFamily: "Cairo" },
  warningCard: { borderRadius: 10, padding: 10, borderWidth: 1 },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
