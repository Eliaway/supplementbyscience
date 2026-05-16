/**
 * قارئ ملصقات المكملات وتحليل المكونات
 * Feature: 38
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const COMMON_ADDITIVES = [
  { name: "Magnesium Stearate", arabic: "ستيارات المغنيسيوم", safety: "آمن", color: "#10B981", info: "مادة تشحيم شائعة في الكبسولات. آمنة بالكميات المستخدمة في المكملات." },
  { name: "Silicon Dioxide", arabic: "ثاني أكسيد السيليكون", safety: "آمن", color: "#10B981", info: "مادة مضادة للتكتل. آمنة تماماً." },
  { name: "Titanium Dioxide", arabic: "ثاني أكسيد التيتانيوم", safety: "تجنب", color: "#F59E0B", info: "يستخدم للتلوين الأبيض. بعض الدراسات تشير إلى مخاوف محتملة — يُفضَّل تجنبه." },
  { name: "Maltodextrin", arabic: "مالتوديكسترين", safety: "مقبول", color: "#3B82F6", info: "مادة حشو من النشا. ترفع مؤشر السكر في الدم — تجنبها إذا كنت مريض سكري." },
  { name: "Gelatin", arabic: "جيلاتين", safety: "غير نباتي", color: "#8B5CF6", info: "مشتق من الحيوانات. غير مناسب للنباتيين والمسلمين (إلا إذا كان حلالاً)." },
  { name: "Hypromellose", arabic: "هيبروميلوز (HPMC)", safety: "نباتي", color: "#10B981", info: "بديل نباتي للجيلاتين. آمن ومناسب للجميع." },
  { name: "Carrageenan", arabic: "كاراجينان", safety: "تجنب", color: "#EF4444", info: "مشتق من الطحالب. بعض الدراسات تربطه بالالتهاب المعوي — يُنصح بتجنبه." },
  { name: "Artificial Colors", arabic: "ألوان صناعية", safety: "تجنب", color: "#EF4444", info: "FD&C Red 40, Blue 1, Yellow 5 — ألوان صناعية لا قيمة غذائية لها. يُفضَّل تجنبها." },
];

const READING_GUIDE = [
  { step: "1", title: "تحقق من الجرعة الفعلية", desc: "قارن الجرعة المكتوبة على الملصق بالجرعة العلاجية الموصى بها في الأبحاث", icon: "1.circle.fill" as const, color: "#3B82F6" },
  { step: "2", title: "اقرأ قائمة المكونات الأخرى", desc: "Other Ingredients — هذه هي المواد المضافة والحشو والمواد الحافظة", icon: "2.circle.fill" as const, color: "#8B5CF6" },
  { step: "3", title: "تحقق من شكل المكمل", desc: "مثال: Magnesium Glycinate أفضل من Magnesium Oxide من حيث الامتصاص", icon: "3.circle.fill" as const, color: "#10B981" },
  { step: "4", title: "ابحث عن شهادات الجودة", desc: "NSF, USP, Informed Sport — تضمن نقاء المنتج وعدم التلوث", icon: "4.circle.fill" as const, color: "#F59E0B" },
  { step: "5", title: "تحقق من تاريخ الانتهاء", desc: "تجنب المنتجات التي تنتهي خلال أقل من 6 أشهر", icon: "5.circle.fill" as const, color: "#EF4444" },
];

export default function LabelReaderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAdditive, setExpandedAdditive] = useState<number | null>(null);

  const filteredAdditives = COMMON_ADDITIVES.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.arabic.includes(searchQuery)
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>قارئ ملصقات المكملات 🏷️</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>افهم ما هو مكتوب على علبة مكملك</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Reading Guide */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>كيف تقرأ ملصق المكمل؟</Text>
        {READING_GUIDE.map((step, i) => (
          <View key={i} style={[styles.stepCard, { backgroundColor: colors.surface, borderColor: step.color + "20" }]}>
            <View style={[styles.stepNum, { backgroundColor: step.color + "15" }]}>
              <Text style={[styles.stepNumText, { color: step.color }]}>{step.step}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>{step.title}</Text>
              <Text style={[styles.stepDesc, { color: colors.muted }]}>{step.desc}</Text>
            </View>
          </View>
        ))}

        {/* Additives Search */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>قاموس المواد المضافة</Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
          placeholder="ابحث عن مادة مضافة..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />

        {filteredAdditives.map((additive, i) => (
          <Pressable
            key={i}
            style={[styles.additiveCard, { backgroundColor: colors.surface, borderColor: additive.color + "30" }]}
            onPress={() => setExpandedAdditive(expandedAdditive === i ? null : i)}
          >
            <View style={styles.additiveHeader}>
              <View style={[styles.safetyBadge, { backgroundColor: additive.color + "15" }]}>
                <Text style={[styles.safetyText, { color: additive.color }]}>{additive.safety}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.additiveName, { color: colors.foreground }]}>{additive.arabic}</Text>
                <Text style={[styles.additiveEn, { color: colors.muted }]}>{additive.name}</Text>
              </View>
              <IconSymbol name={expandedAdditive === i ? "chevron.down" : "chevron.right"} size={14} color={colors.muted} />
            </View>
            {expandedAdditive === i && (
              <Text style={[styles.additiveInfo, { color: colors.foreground }]}>{additive.info}</Text>
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
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  stepCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, borderRadius: 14, borderWidth: 1, padding: 12 },
  stepNum: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  stepNumText: { fontSize: 16, fontWeight: "900", fontFamily: "Cairo-Black" },
  stepTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  stepDesc: { fontSize: 11, lineHeight: 16, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  searchInput: { borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 13, fontFamily: "Cairo" },
  additiveCard: { borderRadius: 14, borderWidth: 1, padding: 12, gap: 8 },
  additiveHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  safetyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  safetyText: { fontSize: 10, fontWeight: "700", fontFamily: "Cairo-Bold" },
  additiveName: { fontSize: 13, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  additiveEn: { fontSize: 10, textAlign: "right", fontFamily: "Cairo" },
  additiveInfo: { fontSize: 12, lineHeight: 18, textAlign: "right", paddingTop: 4, fontFamily: "Cairo" },
});
