/**
 * دليل التخزين وانتهاء الصلاحية
 * Feature #31: Supplement storage and expiry guide
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const STORAGE_RULES = [
  {
    category: "الفيتامينات الدهنية (A, D, E, K)",
    icon: "sun.max.fill",
    color: "#F59E0B",
    rules: [
      { title: "درجة الحرارة", value: "أقل من 25°C", icon: "thermometer" },
      { title: "الرطوبة", value: "جافة - بعيداً عن الحمام", icon: "drop.fill" },
      { title: "الضوء", value: "بعيداً عن الضوء المباشر", icon: "sun.max.fill" },
      { title: "الصلاحية بعد الفتح", value: "6-12 شهر", icon: "calendar" },
    ],
    tips: ["احفظها في علبة معتمة", "لا تحفظها في السيارة صيفاً", "التبريد يطيل العمر الافتراضي"],
  },
  {
    category: "الفيتامينات المذابة في الماء (B, C)",
    icon: "drop.fill",
    color: "#3B82F6",
    rules: [
      { title: "درجة الحرارة", value: "درجة حرارة الغرفة", icon: "thermometer" },
      { title: "الرطوبة", value: "جافة جداً", icon: "drop.fill" },
      { title: "الضوء", value: "فيتامين C حساس للضوء جداً", icon: "sun.max.fill" },
      { title: "الصلاحية بعد الفتح", value: "3-6 أشهر", icon: "calendar" },
    ],
    tips: ["فيتامين C يتأكسد بسرعة - أغلق الغطاء جيداً", "لا تخلط مع الماء مسبقاً", "المسحوق أقل استقراراً من الكبسولات"],
  },
  {
    category: "البروبيوتيك",
    icon: "leaf.fill",
    color: "#10B981",
    rules: [
      { title: "درجة الحرارة", value: "2-8°C (ثلاجة) أو حسب التعليمات", icon: "thermometer" },
      { title: "الرطوبة", value: "جافة جداً", icon: "drop.fill" },
      { title: "الضوء", value: "بعيداً عن الضوء", icon: "sun.max.fill" },
      { title: "الصلاحية بعد الفتح", value: "30-60 يوم", icon: "calendar" },
    ],
    tips: ["بعض الأنواع لا تحتاج تبريداً - اقرأ التعليمات", "الحرارة تقتل البكتيريا النافعة", "لا تفتح في بيئة رطبة"],
  },
  {
    category: "مسحوق البروتين والكرياتين",
    icon: "figure.strengthtraining.traditional",
    color: "#8B5CF6",
    rules: [
      { title: "درجة الحرارة", value: "درجة حرارة الغرفة", icon: "thermometer" },
      { title: "الرطوبة", value: "جافة جداً - أضف كيس السيليكا", icon: "drop.fill" },
      { title: "الضوء", value: "غير حساس للضوء", icon: "sun.max.fill" },
      { title: "الصلاحية بعد الفتح", value: "6-12 شهر", icon: "calendar" },
    ],
    tips: ["استخدم ملعقة جافة دائماً", "أضف كيس السيليكا من العبوة", "لا تحفظ في الحمام"],
  },
  {
    category: "زيت السمك (أوميغا-3)",
    icon: "drop.fill",
    color: "#0EA5E9",
    rules: [
      { title: "درجة الحرارة", value: "ثلاجة بعد الفتح", icon: "thermometer" },
      { title: "الرطوبة", value: "مغلق جيداً", icon: "drop.fill" },
      { title: "الضوء", value: "علبة معتمة", icon: "sun.max.fill" },
      { title: "الصلاحية بعد الفتح", value: "3-4 أشهر", icon: "calendar" },
    ],
    tips: ["الزيت المؤكسد يسبب رائحة كريهة - تخلص منه", "الكبسولات أكثر استقراراً من الزيت السائل", "احفظ في الثلاجة لإطالة العمر"],
  },
];

const EXPIRY_SIGNS = [
  { sign: "تغير اللون", meaning: "تأكسد أو تحلل - لا تستخدم", safe: false },
  { sign: "رائحة كريهة", meaning: "خاصة في زيت السمك - تأكسد", safe: false },
  { sign: "تكتل المسحوق", meaning: "امتصاص رطوبة - قد يكون آمناً لكن فاعليته قلت", safe: null },
  { sign: "تغير الطعم", meaning: "خاصة في المضغ - قد يكون فاسداً", safe: false },
  { sign: "تغير الملمس", meaning: "الكبسولات اللينة - قد تكون آمنة", safe: null },
  { sign: "انتهاء تاريخ الصلاحية", meaning: "الفاعلية قلت لكن ليس بالضرورة ضاراً", safe: null },
];

export default function StorageGuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"storage" | "expiry">("storage");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>دليل التخزين والصلاحية</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>كيف تحفظ مكملاتك وتعرف إذا فسدت</Text>
        </View>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {[
          { id: "storage", label: "قواعد التخزين" },
          { id: "expiry", label: "علامات الفساد" },
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

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {activeTab === "storage" && STORAGE_RULES.map((cat, ci) => (
          <View key={ci} style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.catHeader}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + "15" }]}>
                <IconSymbol name={cat.icon as any} size={22} color={cat.color} />
              </View>
              <Text style={[styles.catName, { color: colors.foreground }]}>{cat.category}</Text>
            </View>
            <View style={styles.rulesGrid}>
              {cat.rules.map((rule, ri) => (
                <View key={ri} style={[styles.ruleItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.ruleValue, { color: cat.color }]}>{rule.value}</Text>
                  <Text style={[styles.ruleTitle, { color: colors.muted }]}>{rule.title}</Text>
                </View>
              ))}
            </View>
            <View style={styles.tipsSection}>
              {cat.tips.map((tip, ti) => (
                <View key={ti} style={styles.tipRow}>
                  <IconSymbol name="lightbulb.fill" size={12} color={cat.color} />
                  <Text style={[styles.tipText, { color: colors.muted }]}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {activeTab === "expiry" && (
          <>
            <View style={[styles.warningBanner, { backgroundColor: colors.warning + "10", borderColor: colors.warning + "30" }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
              <Text style={[styles.warningText, { color: colors.foreground }]}>
                المكملات المنتهية الصلاحية نادراً ما تكون ضارة، لكن فاعليتها تقل بمرور الوقت.
              </Text>
            </View>
            {EXPIRY_SIGNS.map((sign, i) => (
              <View key={i} style={[styles.signCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.signIcon, {
                  backgroundColor: sign.safe === false ? colors.error + "15" : sign.safe === null ? colors.warning + "15" : colors.success + "15"
                }]}>
                  <IconSymbol
                    name={sign.safe === false ? "xmark.circle.fill" : sign.safe === null ? "exclamationmark.triangle.fill" : "checkmark.circle.fill"}
                    size={20}
                    color={sign.safe === false ? colors.error : sign.safe === null ? colors.warning : colors.success}
                  />
                </View>
                <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
                  <Text style={[styles.signName, { color: colors.foreground }]}>{sign.sign}</Text>
                  <Text style={[styles.signMeaning, { color: colors.muted }]}>{sign.meaning}</Text>
                </View>
                <View style={[styles.safeBadge, {
                  backgroundColor: sign.safe === false ? colors.error + "15" : sign.safe === null ? colors.warning + "15" : colors.success + "15"
                }]}>
                  <Text style={[styles.safeText, {
                    color: sign.safe === false ? colors.error : sign.safe === null ? colors.warning : colors.success
                  }]}>
                    {sign.safe === false ? "تخلص منه" : sign.safe === null ? "احتياط" : "آمن"}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
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
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  categoryCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 12 },
  catHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  catIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  catName: { fontSize: 14, fontWeight: "800", flex: 1, textAlign: "right", fontFamily: "Cairo-Black" },
  rulesGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  ruleItem: { borderRadius: 10, padding: 10, borderWidth: 1, width: "47%", alignItems: "flex-end" },
  ruleTitle: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  ruleValue: { fontSize: 12, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  tipsSection: { gap: 6 },
  tipRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 6 },
  tipText: { flex: 1, fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  warningBanner: { borderRadius: 12, padding: 14, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  warningText: { flex: 1, fontSize: 13, textAlign: "right", lineHeight: 20, fontFamily: "Cairo" },
  signCard: { borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  signIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  signName: { fontSize: 14, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  signMeaning: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  safeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  safeText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
});
