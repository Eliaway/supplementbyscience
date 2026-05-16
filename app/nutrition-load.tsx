/**
 * حاسبة الحمل الغذائي اليومي
 * Feature #42: Daily nutritional load calculator
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface NutrientEntry {
  name: string;
  amount: string;
  unit: string;
  rda: number;
  rdaUnit: string;
  color: string;
}

const COMMON_NUTRIENTS: NutrientEntry[] = [
  { name: "فيتامين D3", amount: "", unit: "IU", rda: 2000, rdaUnit: "IU", color: "#F59E0B" },
  { name: "فيتامين C", amount: "", unit: "mg", rda: 1000, rdaUnit: "mg", color: "#EF4444" },
  { name: "فيتامين B12", amount: "", unit: "mcg", rda: 2.4, rdaUnit: "mcg", color: "#8B5CF6" },
  { name: "المغنيسيوم", amount: "", unit: "mg", rda: 400, rdaUnit: "mg", color: "#10B981" },
  { name: "الزنك", amount: "", unit: "mg", rda: 40, rdaUnit: "mg", color: "#3B82F6" },
  { name: "الحديد", amount: "", unit: "mg", rda: 45, rdaUnit: "mg", color: "#DC2626" },
  { name: "أوميغا-3", amount: "", unit: "g", rda: 3, rdaUnit: "g", color: "#0EA5E9" },
  { name: "الكالسيوم", amount: "", unit: "mg", rda: 2500, rdaUnit: "mg", color: "#F97316" },
  { name: "فيتامين A", amount: "", unit: "IU", rda: 10000, rdaUnit: "IU", color: "#EC4899" },
  { name: "فيتامين E", amount: "", unit: "IU", rda: 1500, rdaUnit: "IU", color: "#6366F1" },
];

export default function NutritionLoadScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [nutrients, setNutrients] = useState<NutrientEntry[]>(COMMON_NUTRIENTS);

  const updateAmount = (index: number, value: string) => {
    setNutrients(prev => prev.map((n, i) => i === index ? { ...n, amount: value } : n));
  };

  const getPercentage = (amount: string, rda: number) => {
    const val = parseFloat(amount);
    if (isNaN(val) || val === 0) return 0;
    return Math.min((val / rda) * 100, 200);
  };

  const getStatus = (pct: number) => {
    if (pct === 0) return { label: "غير محدد", color: colors.muted };
    if (pct < 50) return { label: "منخفض", color: colors.error };
    if (pct < 80) return { label: "دون المثالي", color: colors.warning };
    if (pct <= 100) return { label: "مثالي", color: colors.success };
    if (pct <= 150) return { label: "مرتفع", color: colors.warning };
    return { label: "مرتفع جداً", color: colors.error };
  };

  const filledNutrients = nutrients.filter(n => parseFloat(n.amount) > 0);
  const overLimit = filledNutrients.filter(n => getPercentage(n.amount, n.rda) > 100);
  const underLimit = filledNutrients.filter(n => getPercentage(n.amount, n.rda) < 80 && parseFloat(n.amount) > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>حاسبة الحمل الغذائي</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>أدخل جرعاتك اليومية لتحليل الحمل الكلي</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {filledNutrients.length > 0 && (
          <View style={styles.summaryRow}>
            {overLimit.length > 0 && (
              <View style={[styles.summaryCard, { backgroundColor: colors.error + "10", borderColor: colors.error + "30" }]}>
                <Text style={[styles.summaryNum, { color: colors.error }]}>{overLimit.length}</Text>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>تجاوز الحد</Text>
              </View>
            )}
            {underLimit.length > 0 && (
              <View style={[styles.summaryCard, { backgroundColor: colors.warning + "10", borderColor: colors.warning + "30" }]}>
                <Text style={[styles.summaryNum, { color: colors.warning }]}>{underLimit.length}</Text>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>دون المثالي</Text>
              </View>
            )}
            <View style={[styles.summaryCard, { backgroundColor: colors.success + "10", borderColor: colors.success + "30" }]}>
              <Text style={[styles.summaryNum, { color: colors.success }]}>{filledNutrients.length - overLimit.length - underLimit.length}</Text>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>مثالي</Text>
            </View>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أدخل جرعاتك اليومية</Text>
        {nutrients.map((nutrient, i) => {
          const pct = getPercentage(nutrient.amount, nutrient.rda);
          const status = getStatus(pct);
          return (
            <View key={i} style={[styles.nutrientCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.nutrientHeader}>
                <View style={styles.statusRow}>
                  {parseFloat(nutrient.amount) > 0 && (
                    <View style={[styles.statusBadge, { backgroundColor: status.color + "15" }]}>
                      <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  )}
                  <Text style={[styles.rdaText, { color: colors.muted }]}>الحد: {nutrient.rda} {nutrient.rdaUnit}</Text>
                </View>
                <Text style={[styles.nutrientName, { color: colors.foreground }]}>{nutrient.name}</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={[styles.unitText, { color: colors.muted }]}>{nutrient.unit}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                  value={nutrient.amount}
                  onChangeText={val => updateAmount(i, val)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  textAlign="right"
                />
              </View>
              {parseFloat(nutrient.amount) > 0 && (
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%` as any, backgroundColor: status.color }]} />
                    {pct > 100 && (
                      <View style={[styles.overFill, { width: `${Math.min(pct - 100, 100)}%` as any, backgroundColor: colors.error + "60" }]} />
                    )}
                  </View>
                  <Text style={[styles.pctText, { color: status.color }]}>{Math.round(pct)}%</Text>
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
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  summaryRow: { flexDirection: "row-reverse", gap: 10 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, alignItems: "center", gap: 4 },
  summaryNum: { fontSize: 24, fontWeight: "900", fontFamily: "Cairo-Black" },
  summaryLabel: { fontSize: 11, textAlign: "center", fontFamily: "Cairo" },
  nutrientCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  nutrientHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start" },
  nutrientName: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  statusRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  rdaText: { fontSize: 11, fontFamily: "Cairo" },
  inputRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  input: { flex: 1, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, fontWeight: "700", fontFamily: "Cairo-Bold" },
  unitText: { fontSize: 13, fontWeight: "700", minWidth: 30, fontFamily: "Cairo-Bold" },
  progressContainer: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  progressBar: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden", flexDirection: "row" },
  progressFill: { height: "100%" },
  overFill: { height: "100%" },
  pctText: { fontSize: 12, fontWeight: "800", minWidth: 40, textAlign: "right", fontFamily: "Cairo-Black" },
});
