/**
 * حاسبة التوافق الغذائي
 * Feature #39: Food and supplement compatibility calculator
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface CompatibilityRule {
  supplement: string;
  enhancedBy: { food: string; reason: string }[];
  reducedBy: { food: string; reason: string }[];
  bestTime: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
}

const COMPATIBILITY_RULES: CompatibilityRule[] = [
  {
    supplement: "فيتامين D3",
    icon: "sun.max.fill",
    color: "#F59E0B",
    bestTime: "مع الوجبة الدسمة",
    enhancedBy: [
      { food: "الأفوكادو", reason: "الدهون الصحية تعزز الامتصاص 50%" },
      { food: "البيض", reason: "يحتوي على فيتامين D طبيعي ودهون" },
      { food: "السمك الدهني", reason: "أوميغا-3 تعزز الامتصاص" },
      { food: "زيت الزيتون", reason: "دهون أحادية غير مشبعة تعزز الامتصاص" },
    ],
    reducedBy: [
      { food: "القهوة (مع الكبسولة)", reason: "تسرّع العبور المعوي وتقلل الامتصاص" },
      { food: "الألياف الزائدة", reason: "تربط الفيتامينات الدهنية وتقلل امتصاصها" },
    ],
  },
  {
    supplement: "الحديد",
    icon: "bolt.fill",
    color: "#DC2626",
    bestTime: "على معدة فارغة أو مع فيتامين C",
    enhancedBy: [
      { food: "البرتقال / فيتامين C", reason: "يحوّل الحديد للشكل الأسهل امتصاصاً بنسبة 300%" },
      { food: "اللحم الأحمر", reason: "الحديد الهيمي يعزز امتصاص الحديد غير الهيمي" },
      { food: "الفلفل الأحمر", reason: "غني بفيتامين C الطبيعي" },
    ],
    reducedBy: [
      { food: "الشاي والقهوة", reason: "التانين يربط الحديد ويقلل امتصاصه 60%" },
      { food: "الحليب ومشتقاته", reason: "الكالسيوم ينافس الحديد على الامتصاص" },
      { food: "الحبوب الكاملة", reason: "الفيتات تربط الحديد وتمنع امتصاصه" },
    ],
  },
  {
    supplement: "الكالسيوم",
    icon: "figure.walk",
    color: "#F97316",
    bestTime: "مع الوجبات (جرعات صغيرة)",
    enhancedBy: [
      { food: "فيتامين D3", reason: "ضروري لامتصاص الكالسيوم في الأمعاء" },
      { food: "الخضروات الورقية", reason: "تحتوي على فيتامين K2 الذي يوجّه الكالسيوم للعظام" },
    ],
    reducedBy: [
      { food: "الحديد (في نفس الوقت)", reason: "ينافس الكالسيوم على الامتصاص" },
      { food: "الأوكزالات (السبانخ)", reason: "تربط الكالسيوم وتمنع امتصاصه" },
      { food: "الصوديوم الزائد", reason: "يزيد إفراز الكالسيوم في البول" },
    ],
  },
  {
    supplement: "الزنك",
    icon: "shield.fill",
    color: "#3B82F6",
    bestTime: "بين الوجبات أو مع وجبة خفيفة",
    enhancedBy: [
      { food: "البروتين الحيواني", reason: "يعزز امتصاص الزنك بشكل كبير" },
      { food: "الجبن", reason: "بروتين + دهون تعزز الامتصاص" },
    ],
    reducedBy: [
      { food: "الحليب والكالسيوم", reason: "ينافس الزنك على الامتصاص" },
      { food: "الحبوب الكاملة", reason: "الفيتات تربط الزنك بقوة" },
      { food: "القهوة", reason: "تقلل امتصاص الزنك" },
    ],
  },
  {
    supplement: "أوميغا-3",
    icon: "drop.fill",
    color: "#0EA5E9",
    bestTime: "مع الوجبة الرئيسية",
    enhancedBy: [
      { food: "الدهون الصحية", reason: "تعزز امتصاص EPA/DHA" },
      { food: "مضادات الأكسدة (فيتامين E)", reason: "تحمي أوميغا-3 من الأكسدة" },
    ],
    reducedBy: [
      { food: "الدهون المتحولة", reason: "تنافس أوميغا-3 وتقلل فاعليتها" },
      { food: "الكحول", reason: "يقلل امتصاص وفاعلية أوميغا-3" },
    ],
  },
  {
    supplement: "المغنيسيوم",
    icon: "moon.zzz.fill",
    color: "#10B981",
    bestTime: "مع العشاء أو قبل النوم",
    enhancedBy: [
      { food: "فيتامين D3", reason: "يعزز امتصاص المغنيسيوم" },
      { food: "البروتين", reason: "يحسن استخدام المغنيسيوم في الجسم" },
    ],
    reducedBy: [
      { food: "الكالسيوم الزائد", reason: "ينافس المغنيسيوم على الامتصاص" },
      { food: "الكحول", reason: "يزيد إفراز المغنيسيوم في البول" },
      { food: "السكر الزائد", reason: "يستنزف مخزون المغنيسيوم" },
    ],
  },
];

export default function FoodCompatibilityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<CompatibilityRule | null>(null);

  if (selected) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelected(null)}>
            <IconSymbol name="chevron.right" size={22} color={colors.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{selected.supplement}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <View style={[styles.timeBanner, { backgroundColor: selected.color + "15", borderColor: selected.color + "30" }]}>
            <IconSymbol name="clock.fill" size={18} color={selected.color} />
            <Text style={[styles.timeText, { color: selected.color }]}>أفضل وقت: {selected.bestTime}</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>يُعزَّز امتصاصه بـ</Text>
          {selected.enhancedBy.map((item, i) => (
            <View key={i} style={[styles.foodCard, { backgroundColor: colors.surface, borderColor: colors.success + "30" }]}>
              <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.foodName, { color: colors.foreground }]}>{item.food}</Text>
                <Text style={[styles.foodReason, { color: colors.muted }]}>{item.reason}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>يُقلَّل امتصاصه بـ</Text>
          {selected.reducedBy.map((item, i) => (
            <View key={i} style={[styles.foodCard, { backgroundColor: colors.surface, borderColor: colors.error + "30" }]}>
              <IconSymbol name="xmark.circle.fill" size={18} color={colors.error} />
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.foodName, { color: colors.foreground }]}>{item.food}</Text>
                <Text style={[styles.foodReason, { color: colors.muted }]}>{item.reason}</Text>
              </View>
            </View>
          ))}
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>التوافق الغذائي</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>ما الأطعمة التي تعزز أو تقلل امتصاص مكملاتك</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>
        {COMPATIBILITY_RULES.map(rule => (
          <Pressable
            key={rule.supplement}
            style={[styles.ruleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setSelected(rule)}
          >
            <View style={[styles.ruleIcon, { backgroundColor: rule.color + "15" }]}>
              <IconSymbol name={rule.icon} size={24} color={rule.color} />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.ruleName, { color: colors.foreground }]}>{rule.supplement}</Text>
              <Text style={[styles.ruleTime, { color: colors.muted }]}>{rule.bestTime}</Text>
              <View style={styles.countRow}>
                <View style={[styles.countBadge, { backgroundColor: colors.error + "10" }]}>
                  <Text style={[styles.countText, { color: colors.error }]}>تجنب {rule.reducedBy.length}</Text>
                </View>
                <View style={[styles.countBadge, { backgroundColor: colors.success + "10" }]}>
                  <Text style={[styles.countText, { color: colors.success }]}>معزز {rule.enhancedBy.length}</Text>
                </View>
              </View>
            </View>
            <IconSymbol name="chevron.left" size={16} color={colors.muted} />
          </Pressable>
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
  timeBanner: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  timeText: { fontSize: 14, fontWeight: "700", fontFamily: "Cairo-Bold" },
  foodCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  foodName: { fontSize: 14, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  foodReason: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  ruleCard: { borderRadius: 14, padding: 14, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  ruleIcon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  ruleName: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  ruleTime: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  countRow: { flexDirection: "row-reverse", gap: 6 },
  countBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  countText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
});
