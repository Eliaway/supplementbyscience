/**
 * حاسبة الجرعات المتقدمة — Advanced Dose Calculator
 * Features #44, #45: Personalized dosing based on weight, age, condition
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface DoseFormula {
  id: string;
  name: string;
  unit: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  baseFormula: (weight: number, age: number) => number;
  minDose: number;
  maxDose: number;
  adjustments: {
    condition: string;
    multiplier: number;
    note: string;
  }[];
  timing: string;
  notes: string;
}

const FORMULAS: DoseFormula[] = [
  {
    id: "vitd",
    name: "فيتامين D3",
    unit: "IU",
    icon: "sun.max.fill",
    color: "#F59E0B",
    baseFormula: (weight, age) => {
      if (age < 1) return 400;
      if (age < 18) return 1000;
      if (age >= 65) return 2000;
      return Math.round(weight * 40);
    },
    minDose: 400,
    maxDose: 10000,
    adjustments: [
      { condition: "نقص شديد (أقل من 20 ng/mL)", multiplier: 2.5, note: "جرعة علاجية مؤقتة" },
      { condition: "نقص متوسط (20-30 ng/mL)", multiplier: 1.5, note: "جرعة تصحيحية" },
      { condition: "مستوى طبيعي (30-60 ng/mL)", multiplier: 1, note: "جرعة صيانة" },
      { condition: "بدانة (BMI > 30)", multiplier: 2, note: "الدهون تحجز D3" },
    ],
    timing: "مع وجبة دهنية صباحاً",
    notes: "راقب مستوياتك كل 3 أشهر. الهدف: 50-80 ng/mL",
  },
  {
    id: "magnesium",
    name: "المغنيسيوم",
    unit: "مغ",
    icon: "bolt.fill",
    color: "#6366F1",
    baseFormula: (weight, age) => {
      if (age < 18) return 200;
      if (age >= 65) return 420;
      return Math.round(weight * 4.5);
    },
    minDose: 100,
    maxDose: 600,
    adjustments: [
      { condition: "رياضة مكثفة", multiplier: 1.3, note: "التعرق يستنزف المغنيسيوم" },
      { condition: "توتر مزمن", multiplier: 1.2, note: "الكورتيزول يستنزف المغنيسيوم" },
      { condition: "أمراض هضمية", multiplier: 1.5, note: "امتصاص أقل" },
      { condition: "مرضى السكري", multiplier: 1.4, note: "نقص شائع جداً" },
    ],
    timing: "قبل النوم بساعة",
    notes: "Glycinate الأفضل للنوم. Citrate للإمساك. Malate للطاقة.",
  },
  {
    id: "omega3",
    name: "أوميغا-3 (EPA+DHA)",
    unit: "مغ",
    icon: "drop.fill",
    color: "#0EA5E9",
    baseFormula: (weight, age) => {
      if (age < 18) return 500;
      return Math.round(weight * 25);
    },
    minDose: 500,
    maxDose: 5000,
    adjustments: [
      { condition: "أمراض قلبية", multiplier: 2, note: "4 غ/يوم موصى به طبياً" },
      { condition: "التهاب مفاصل", multiplier: 1.8, note: "3-4 غ للتأثير المضاد للالتهاب" },
      { condition: "اكتئاب/قلق", multiplier: 1.6, note: "EPA أهم من DHA للمزاج" },
      { condition: "حمل ورضاعة", multiplier: 1.4, note: "DHA ضروري لتطور الجنين" },
    ],
    timing: "مع وجبة دهنية",
    notes: "نسبة EPA:DHA المثالية 2:1 للالتهاب. DHA أهم للدماغ.",
  },
  {
    id: "zinc",
    name: "الزنك",
    unit: "مغ",
    icon: "shield.fill",
    color: "#10B981",
    baseFormula: (weight, age) => {
      if (age < 18) return 8;
      return Math.min(Math.round(weight * 0.2), 30);
    },
    minDose: 5,
    maxDose: 40,
    adjustments: [
      { condition: "حب الشباب", multiplier: 1.5, note: "25-30 مغ للتأثير المضاد للالتهاب" },
      { condition: "نقص مناعة", multiplier: 1.3, note: "يقوي المناعة" },
      { condition: "نباتي/نباتي صارم", multiplier: 1.5, note: "امتصاص أقل من المصادر النباتية" },
      { condition: "رياضة مكثفة", multiplier: 1.3, note: "التعرق يستنزف الزنك" },
    ],
    timing: "مع الطعام لتجنب الغثيان",
    notes: "لا تأخذ أكثر من 40 مغ/يوم. خذ نحاساً (2 مغ) مع الزنك العالي.",
  },
  {
    id: "vitc",
    name: "فيتامين C",
    unit: "مغ",
    icon: "leaf.fill",
    color: "#F97316",
    baseFormula: (weight, age) => {
      if (age < 18) return 500;
      return Math.round(weight * 15);
    },
    minDose: 250,
    maxDose: 3000,
    adjustments: [
      { condition: "مدخن", multiplier: 2, note: "التدخين يستنزف فيتامين C بشكل كبير" },
      { condition: "مرض حاد أو التهاب", multiplier: 2, note: "الاحتياج يرتفع أثناء المرض" },
      { condition: "رياضة مكثفة", multiplier: 1.5, note: "الإجهاد التأكسدي يستنزف C" },
      { condition: "جرح أو عملية جراحية", multiplier: 2, note: "ضروري لالتئام الجروح" },
    ],
    timing: "مقسم على مرتين يومياً",
    notes: "Liposomal C أفضل امتصاصاً. قسّم الجرعات لتجنب الإسهال.",
  },
];

export default function DoseCalculatorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [selectedFormula, setSelectedFormula] = useState<DoseFormula | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [calculatedDose, setCalculatedDose] = useState<number | null>(null);

  const calculate = (formula: DoseFormula, condition: string | null) => {
    const w = parseFloat(weight) || 70;
    const a = parseInt(age) || 30;
    let dose = formula.baseFormula(w, a);
    if (condition) {
      const adj = formula.adjustments.find((a) => a.condition === condition);
      if (adj) dose = Math.round(dose * adj.multiplier);
    }
    dose = Math.max(formula.minDose, Math.min(formula.maxDose, dose));
    setCalculatedDose(dose);
  };

  if (selectedFormula) {
    const f = selectedFormula;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => { setSelectedFormula(null); setCalculatedDose(null); setSelectedCondition(null); }}>
            <IconSymbol name="chevron.right" size={22} color={colors.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>حاسبة {f.name}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <View style={[styles.inputCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>بياناتك الأساسية</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.inputHint, { color: colors.muted }]}>الوزن (كغ)</Text>
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="70"
                  placeholderTextColor={colors.muted}
                  textAlign="center"
                />
              </View>
              <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.inputHint, { color: colors.muted }]}>العمر (سنة)</Text>
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor={colors.muted}
                  textAlign="center"
                />
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>حالتك الصحية (اختياري)</Text>
          {f.adjustments.map((adj) => (
            <Pressable
              key={adj.condition}
              style={({ pressed }) => [
                styles.conditionCard,
                { backgroundColor: selectedCondition === adj.condition ? f.color + "15" : colors.surface, borderColor: selectedCondition === adj.condition ? f.color : colors.border },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => {
                const newCond = selectedCondition === adj.condition ? null : adj.condition;
                setSelectedCondition(newCond);
                calculate(f, newCond);
              }}
            >
              <View style={styles.conditionRow}>
                <IconSymbol name={selectedCondition === adj.condition ? "checkmark.circle.fill" : "circle"} size={18} color={selectedCondition === adj.condition ? f.color : colors.muted} />
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.conditionTitle, { color: colors.foreground }]}>{adj.condition}</Text>
                  <Text style={[styles.conditionNote, { color: colors.muted }]}>{adj.note}</Text>
                </View>
                <View style={[styles.multiplierBadge, { backgroundColor: f.color + "12" }]}>
                  <Text style={[styles.multiplierText, { color: f.color }]}>×{adj.multiplier}</Text>
                </View>
              </View>
            </Pressable>
          ))}

          <Pressable
            style={({ pressed }) => [styles.calcBtn, { backgroundColor: f.color }, pressed && { opacity: 0.85 }]}
            onPress={() => calculate(f, selectedCondition)}
          >
            <IconSymbol name="sparkles" size={20} color="#fff" />
            <Text style={styles.calcBtnText}>احسب الجرعة المثالية</Text>
          </Pressable>

          {calculatedDose !== null && (
            <View style={[styles.resultCard, { backgroundColor: f.color + "12", borderColor: f.color + "30" }]}>
              <Text style={[styles.resultLabel, { color: colors.muted }]}>الجرعة الموصى بها</Text>
              <Text style={[styles.resultDose, { color: f.color }]}>{calculatedDose.toLocaleString()} {f.unit}</Text>
              <Text style={[styles.resultTiming, { color: colors.foreground }]}>⏰ {f.timing}</Text>
              <View style={[styles.resultRange, { backgroundColor: colors.background }]}>
                <Text style={[styles.resultRangeText, { color: colors.muted }]}>النطاق الآمن: {f.minDose.toLocaleString()} — {f.maxDose.toLocaleString()} {f.unit}</Text>
              </View>
              <Text style={[styles.resultNotes, { color: colors.muted }]}>{f.notes}</Text>
            </View>
          )}
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>حاسبة الجرعات المتقدمة</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>جرعة مخصصة بناءً على وزنك وعمرك وحالتك</Text>
        </View>
      </View>

      <FlatList
        data={FORMULAS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={[styles.heroBanner, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "20" }]}>
            <Text style={[styles.heroText, { color: colors.foreground }]}>
              اختر مكملاً لحساب جرعتك المثالية بناءً على وزنك وعمرك وحالتك الصحية.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.formulaCard, { backgroundColor: colors.surface, borderColor: item.color + "25", borderLeftColor: item.color, borderLeftWidth: 4 }, pressed && { opacity: 0.85 }]}
            onPress={() => { setSelectedFormula(item); setCalculatedDose(null); setSelectedCondition(null); }}
          >
            <View style={styles.formulaTop}>
              <View style={[styles.formulaIcon, { backgroundColor: item.color + "15" }]}>
                <IconSymbol name={item.icon} size={24} color={item.color} />
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.formulaName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.formulaRange, { color: item.color }]}>{item.minDose.toLocaleString()} — {item.maxDose.toLocaleString()} {item.unit}</Text>
              </View>
              <IconSymbol name="chevron.left" size={16} color={colors.muted} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  heroBanner: { borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 4 },
  heroText: { fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  formulaCard: { borderRadius: 14, padding: 14, borderWidth: 1 },
  formulaTop: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  formulaIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  formulaName: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  formulaRange: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  inputCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 12 },
  inputLabel: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  inputRow: { flexDirection: "row-reverse", gap: 12 },
  inputBox: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center", gap: 4 },
  inputHint: { fontSize: 11, fontFamily: "Cairo" },
  input: { fontSize: 24, fontWeight: "800", width: "100%", textAlign: "center", fontFamily: "Cairo-Black" },
  conditionCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  conditionRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  conditionTitle: { fontSize: 13, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  conditionNote: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  multiplierBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  multiplierText: { fontSize: 12, fontWeight: "800", fontFamily: "Cairo-Black" },
  calcBtn: { borderRadius: 14, padding: 16, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8 },
  calcBtnText: { color: "#fff", fontSize: 16, fontWeight: "800", fontFamily: "Cairo-Black" },
  resultCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10, alignItems: "flex-end" },
  resultLabel: { fontSize: 12, fontFamily: "Cairo" },
  resultDose: { fontSize: 36, fontWeight: "900", fontFamily: "Cairo-Black" },
  resultTiming: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  resultRange: { borderRadius: 8, padding: 8, alignSelf: "stretch" },
  resultRangeText: { fontSize: 12, textAlign: "center", fontFamily: "Cairo" },
  resultNotes: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  circleIcon: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5 },
});
