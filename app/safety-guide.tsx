/**
 * دليل الأمان والجرعات الزائدة
 * Feature: 26 (الجرعات الزائدة), 27 (الأمان والسمية)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const SAFETY_DATA = [
  {
    supplement: "Vitamin D",
    icon: "sun.max.fill" as const,
    color: "#F59E0B",
    safeRange: "1000-4000 IU/day",
    upperLimit: "10000 IU/day",
    toxicLevel: "> 40000 IU/day لفترات طويلة",
    toxicitySymptoms: ["غثيان وقيء", "ضعف وتعب", "ألم عظام", "ارتفاع كالسيوم الدم", "حصوات كلى"],
    notes: "السمية نادرة جداً بالجرعات المعتادة. تحقق من مستوى 25-OH-D كل 3 أشهر.",
    riskLevel: "منخفض",
  },
  {
    supplement: "Vitamin A",
    icon: "eye.fill" as const,
    color: "#EF4444",
    safeRange: "700-900 mcg RAE/day",
    upperLimit: "3000 mcg RAE/day",
    toxicLevel: "> 10000 IU/day لأسابيع",
    toxicitySymptoms: ["صداع شديد", "رؤية مزدوجة", "تلف كبد", "تشوهات جنينية (حوامل)", "آلام مفاصل"],
    notes: "Beta-Carotene آمن — الجسم يحوّل ما يحتاجه فقط. Retinol (الحيواني) هو الخطر.",
    riskLevel: "مرتفع",
  },
  {
    supplement: "Iron",
    icon: "bolt.fill" as const,
    color: "#DC2626",
    safeRange: "8-18 mg/day (حسب الجنس والعمر)",
    upperLimit: "45 mg/day",
    toxicLevel: "> 100 mg/day",
    toxicitySymptoms: ["غثيان وقيء", "إمساك شديد", "تلف كبد", "تراكم في الأعضاء (Hemochromatosis)"],
    notes: "لا تأخذ الحديد إلا بعد تحليل دم يثبت النقص. الحديد الزائد يُسرّع الشيخوخة.",
    riskLevel: "مرتفع",
  },
  {
    supplement: "Zinc",
    icon: "shield.fill" as const,
    color: "#F97316",
    safeRange: "8-11 mg/day",
    upperLimit: "40 mg/day",
    toxicLevel: "> 50 mg/day لفترات طويلة",
    toxicitySymptoms: ["نقص نحاس", "ضعف مناعة (عكسي)", "غثيان", "انخفاض HDL"],
    notes: "الزنك الزائد ينافس النحاس — أضف 1-2 mg نحاس مع جرعات > 25 mg.",
    riskLevel: "متوسط",
  },
  {
    supplement: "Magnesium",
    icon: "moon.fill" as const,
    color: "#3B82F6",
    safeRange: "310-420 mg/day",
    upperLimit: "350 mg/day (مكملات فقط)",
    toxicLevel: "> 5000 mg/day",
    toxicitySymptoms: ["إسهال (أول علامة)", "ضعف عضلي", "انخفاض ضغط دم", "صعوبة تنفس (نادر جداً)"],
    notes: "الإسهال هو المؤشر الطبيعي للجرعة الزائدة. الكلى تُفرز الزائد عادةً.",
    riskLevel: "منخفض",
  },
  {
    supplement: "Selenium",
    icon: "star.fill" as const,
    color: "#8B5CF6",
    safeRange: "55-200 mcg/day",
    upperLimit: "400 mcg/day",
    toxicLevel: "> 900 mcg/day",
    toxicitySymptoms: ["تساقط شعر", "هشاشة أظافر", "رائحة ثوم من الجسم", "تلف أعصاب", "غثيان"],
    notes: "السيلينيوم له نافذة علاجية ضيقة — لا تتجاوز 200 mcg/day بدون تحليل.",
    riskLevel: "مرتفع",
  },
];

const getRiskColor = (level: string) => {
  if (level === "منخفض") return "#10B981";
  if (level === "متوسط") return "#F59E0B";
  return "#EF4444";
};

export default function SafetyGuideScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>دليل الأمان والجرعات</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>الحدود الآمنة وأعراض الجرعة الزائدة</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={[styles.warningCard, { backgroundColor: "#EF444415", borderColor: "#EF444430" }]}>
          <IconSymbol name="exclamationmark.triangle.fill" size={18} color="#EF4444" />
          <Text style={[styles.warningText, { color: colors.foreground }]}>
            هذه المعلومات للتثقيف فقط. استشر طبيباً قبل تغيير جرعاتك، خاصةً إذا كنت تتناول أدوية أو لديك حالات صحية.
          </Text>
        </View>

        {SAFETY_DATA.map((item) => {
          const riskColor = getRiskColor(item.riskLevel);
          return (
            <View key={item.supplement} style={[styles.card, { backgroundColor: colors.surface, borderColor: item.color + "30" }]}>
              <Pressable
                style={[styles.cardHeader, { backgroundColor: item.color + "10" }]}
                onPress={() => setExpandedId(expandedId === item.supplement ? null : item.supplement)}
              >
                <View style={[styles.riskBadge, { backgroundColor: riskColor + "15" }]}>
                  <Text style={[styles.riskText, { color: riskColor }]}>خطر {item.riskLevel}</Text>
                </View>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.supplement}</Text>
                <View style={[styles.cardIcon, { backgroundColor: item.color + "20" }]}>
                  <IconSymbol name={item.icon} size={22} color={item.color} />
                </View>
              </Pressable>

              {expandedId === item.supplement && (
                <View style={{ padding: 12, gap: 10 }}>
                  <View style={styles.rangeRow}>
                    <View style={[styles.rangeCard, { backgroundColor: "#10B98115", flex: 1 }]}>
                      <Text style={[styles.rangeLabel, { color: "#10B981" }]}>النطاق الآمن</Text>
                      <Text style={[styles.rangeValue, { color: colors.foreground }]}>{item.safeRange}</Text>
                    </View>
                    <View style={[styles.rangeCard, { backgroundColor: "#F59E0B15", flex: 1 }]}>
                      <Text style={[styles.rangeLabel, { color: "#F59E0B" }]}>الحد الأعلى</Text>
                      <Text style={[styles.rangeValue, { color: colors.foreground }]}>{item.upperLimit}</Text>
                    </View>
                  </View>

                  <View style={[styles.toxicCard, { backgroundColor: "#EF444410", borderColor: "#EF444430" }]}>
                    <Text style={[styles.toxicLabel, { color: "#EF4444" }]}>مستوى السمية:</Text>
                    <Text style={[styles.toxicValue, { color: "#EF4444" }]}>{item.toxicLevel}</Text>
                  </View>

                  <Text style={[styles.sectionLabel, { color: colors.foreground }]}>أعراض الجرعة الزائدة:</Text>
                  <View style={styles.symptomsGrid}>
                    {item.toxicitySymptoms.map((s, i) => (
                      <View key={i} style={[styles.symptomTag, { backgroundColor: "#EF444415", borderColor: "#EF444430" }]}>
                        <Text style={[styles.symptomText, { color: "#EF4444" }]}>{s}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={[styles.noteCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.noteText, { color: colors.muted }]}>💡 {item.notes}</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
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
  warningCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", gap: 8, alignItems: "flex-start" },
  warningText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cardHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  cardIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  riskText: { fontSize: 10, fontWeight: "700", fontFamily: "Cairo-Bold" },
  rangeRow: { flexDirection: "row-reverse", gap: 8 },
  rangeCard: { borderRadius: 10, padding: 10, gap: 4 },
  rangeLabel: { fontSize: 10, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  rangeValue: { fontSize: 11, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  toxicCard: { borderRadius: 10, borderWidth: 1, padding: 10, flexDirection: "row-reverse", gap: 6, alignItems: "flex-start" },
  toxicLabel: { fontSize: 12, fontWeight: "800", fontFamily: "Cairo-Black" },
  toxicValue: { flex: 1, fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  sectionLabel: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  symptomsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  symptomTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  symptomText: { fontSize: 11, fontWeight: "600", fontFamily: "Cairo-Bold" },
  noteCard: { borderRadius: 10, borderWidth: 1, padding: 10 },
  noteText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
