/**
 * دليل أشكال المكملات
 * Feature: 34 (الفرق بين الأشكال الدوائية), 35 (مقارنة الأشكال)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const FORMS_DATA = [
  {
    supplement: "Magnesium",
    icon: "moon.fill" as const,
    color: "#3B82F6",
    forms: [
      { name: "Glycinate", absorption: "عالي جداً", bioavailability: "90%", bestFor: "النوم، القلق، الأعصاب", sideEffects: "نادرة", rating: 5 },
      { name: "Malate", absorption: "عالي", bioavailability: "80%", bestFor: "الطاقة، الألم العضلي، Fibromyalgia", sideEffects: "نادرة", rating: 4 },
      { name: "L-Threonate", absorption: "عالي جداً (للدماغ)", bioavailability: "75%", bestFor: "الذاكرة، الدماغ، الإدراك", sideEffects: "نادرة", rating: 5 },
      { name: "Citrate", absorption: "جيد", bioavailability: "70%", bestFor: "الإمساك، العظام", sideEffects: "ملين خفيف", rating: 3 },
      { name: "Oxide", absorption: "ضعيف", bioavailability: "4%", bestFor: "الإمساك فقط", sideEffects: "إسهال", rating: 1 },
    ],
  },
  {
    supplement: "Zinc",
    icon: "shield.fill" as const,
    color: "#8B5CF6",
    forms: [
      { name: "Picolinate", absorption: "عالي جداً", bioavailability: "85%", bestFor: "المناعة، الجلد، الخصوبة", sideEffects: "نادرة", rating: 5 },
      { name: "Glycinate", absorption: "عالي جداً", bioavailability: "82%", bestFor: "المناعة، الهضم الحساس", sideEffects: "نادرة جداً", rating: 5 },
      { name: "Bisglycinate", absorption: "عالي", bioavailability: "80%", bestFor: "المناعة، عام", sideEffects: "نادرة", rating: 4 },
      { name: "Citrate", absorption: "جيد", bioavailability: "60%", bestFor: "عام", sideEffects: "خفيفة", rating: 3 },
      { name: "Oxide", absorption: "ضعيف", bioavailability: "10%", bestFor: "لا يُنصح به", sideEffects: "غثيان", rating: 1 },
    ],
  },
  {
    supplement: "Iron",
    icon: "bolt.fill" as const,
    color: "#EF4444",
    forms: [
      { name: "Bisglycinate", absorption: "عالي جداً", bioavailability: "90%", bestFor: "فقر الدم، الحمل، الحساسية", sideEffects: "نادرة جداً", rating: 5 },
      { name: "Fumarate", absorption: "جيد", bioavailability: "60%", bestFor: "فقر الدم", sideEffects: "إمساك خفيف", rating: 3 },
      { name: "Sulfate", absorption: "متوسط", bioavailability: "50%", bestFor: "فقر الدم (رخيص)", sideEffects: "إمساك، غثيان", rating: 2 },
    ],
  },
  {
    supplement: "Vitamin B12",
    icon: "star.fill" as const,
    color: "#F59E0B",
    forms: [
      { name: "Methylcobalamin", absorption: "عالي جداً", bioavailability: "95%", bestFor: "الأعصاب، الدماغ، الطاقة", sideEffects: "نادرة", rating: 5 },
      { name: "Adenosylcobalamin", absorption: "عالي", bioavailability: "90%", bestFor: "الميتوكوندريا، الطاقة", sideEffects: "نادرة", rating: 5 },
      { name: "Hydroxocobalamin", absorption: "عالي", bioavailability: "85%", bestFor: "التخزين طويل الأمد", sideEffects: "نادرة", rating: 4 },
      { name: "Cyanocobalamin", absorption: "متوسط", bioavailability: "50%", bestFor: "الأرخص (تحتاج تحويل)", sideEffects: "نادرة", rating: 2 },
    ],
  },
  {
    supplement: "Omega-3",
    icon: "drop.fill" as const,
    color: "#0EA5E9",
    forms: [
      { name: "Triglyceride (rTG)", absorption: "عالي جداً", bioavailability: "90%", bestFor: "القلب، الدماغ، الالتهاب", sideEffects: "نادرة", rating: 5 },
      { name: "Phospholipid (Krill)", absorption: "عالي جداً", bioavailability: "85%", bestFor: "الدماغ، الكوليسترول", sideEffects: "نادرة", rating: 5 },
      { name: "Ethyl Ester (EE)", absorption: "متوسط", bioavailability: "50%", bestFor: "الأرخص", sideEffects: "ارتداد سمكي", rating: 2 },
    ],
  },
];

const getRatingStars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

export default function FormsGuideScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>مقارنة أشكال المكملات</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>أي شكل أفضل امتصاصاً وأقل آثاراً جانبية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={[styles.infoCard, { backgroundColor: "#F59E0B15", borderColor: "#F59E0B30" }]}>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            الشكل الكيميائي للمكمل يؤثر بشكل كبير على الامتصاص والفعالية. نفس المعدن بأشكال مختلفة قد يختلف امتصاصه من 4% إلى 90%.
          </Text>
        </View>

        {FORMS_DATA.map((item) => (
          <View key={item.supplement} style={[styles.card, { backgroundColor: colors.surface, borderColor: item.color + "30" }]}>
            <Pressable
              style={[styles.cardHeader, { backgroundColor: item.color + "10" }]}
              onPress={() => setExpandedId(expandedId === item.supplement ? null : item.supplement)}
            >
              <IconSymbol name={expandedId === item.supplement ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.supplement}</Text>
              <View style={[styles.cardIcon, { backgroundColor: item.color + "20" }]}>
                <IconSymbol name={item.icon} size={22} color={item.color} />
              </View>
            </Pressable>

            {expandedId === item.supplement && (
              <View style={{ padding: 12, gap: 8 }}>
                {item.forms.map((form, i) => (
                  <View key={i} style={[styles.formCard, { backgroundColor: colors.background, borderColor: colors.border, borderLeftColor: form.rating >= 4 ? "#10B981" : form.rating >= 3 ? "#F59E0B" : "#EF4444" }]}>
                    <View style={styles.formHeader}>
                      <Text style={[styles.formRating, { color: form.rating >= 4 ? "#10B981" : form.rating >= 3 ? "#F59E0B" : "#EF4444" }]}>{getRatingStars(form.rating)}</Text>
                      <Text style={[styles.formName, { color: colors.foreground }]}>{item.supplement} {form.name}</Text>
                    </View>
                    <View style={styles.formMeta}>
                      <View style={[styles.metaBadge, { backgroundColor: "#10B98115" }]}>
                        <Text style={[styles.metaText, { color: "#10B981" }]}>{form.bioavailability}</Text>
                      </View>
                      <Text style={[styles.formBestFor, { color: colors.muted }]}>{form.bestFor}</Text>
                    </View>
                    {form.sideEffects !== "نادرة" && form.sideEffects !== "نادرة جداً" && (
                      <Text style={[styles.sideEffects, { color: "#F59E0B" }]}>⚠️ {form.sideEffects}</Text>
                    )}
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
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  infoText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cardHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: "800", textAlign: "right" },
  cardIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  formCard: { borderRadius: 12, borderWidth: 1, borderLeftWidth: 4, padding: 10, gap: 6 },
  formHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  formName: { flex: 1, fontSize: 12, fontWeight: "800", textAlign: "right" },
  formRating: { fontSize: 11 },
  formMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  metaBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  metaText: { fontSize: 11, fontWeight: "700" },
  formBestFor: { flex: 1, fontSize: 11, textAlign: "right" },
  sideEffects: { fontSize: 11, textAlign: "right" },
});
