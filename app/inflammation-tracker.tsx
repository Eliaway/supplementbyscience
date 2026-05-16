/**
 * تحليل الأكسدة والالتهاب المزمن
 * Features: 112 (مؤشر الأكسدة والجذور الحرة), 113 (تحليل مستويات الالتهاب المزمن)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface Question {
  id: string;
  text: string;
  category: "oxidation" | "inflammation";
  weight: number;
}

const QUESTIONS: Question[] = [
  // Oxidation
  { id: "q1", text: "هل تتعرض للتلوث الهوائي يومياً (مدينة كبيرة، مصانع)؟", category: "oxidation", weight: 2 },
  { id: "q2", text: "هل تدخن أو تتعرض للدخان السلبي؟", category: "oxidation", weight: 3 },
  { id: "q3", text: "هل تأكل الأطعمة المقلية أو المحترقة بانتظام؟", category: "oxidation", weight: 2 },
  { id: "q4", text: "هل تشعر بالإرهاق المزمن رغم النوم الكافي؟", category: "oxidation", weight: 2 },
  { id: "q5", text: "هل تلاحظ شيخوخة مبكرة في الجلد (تجاعيد، بقع)؟", category: "oxidation", weight: 2 },
  { id: "q6", text: "هل تتناول كميات قليلة من الفواكه والخضروات الملونة؟", category: "oxidation", weight: 2 },
  { id: "q7", text: "هل تتعرض لأشعة الشمس المباشرة لفترات طويلة دون حماية؟", category: "oxidation", weight: 1 },
  // Inflammation
  { id: "q8", text: "هل تعاني من آلام مفاصل أو عضلات مزمنة؟", category: "inflammation", weight: 3 },
  { id: "q9", text: "هل تعاني من أمراض مناعية ذاتية (مثل الروماتيزم، الذئبة)؟", category: "inflammation", weight: 3 },
  { id: "q10", text: "هل تعاني من مشاكل هضمية مزمنة (انتفاخ، إسهال، إمساك)؟", category: "inflammation", weight: 2 },
  { id: "q11", text: "هل تعاني من حساسية أو ربو مزمن؟", category: "inflammation", weight: 2 },
  { id: "q12", text: "هل تأكل السكر المكرر والأطعمة المعالجة بانتظام؟", category: "inflammation", weight: 2 },
  { id: "q13", text: "هل تعاني من زيادة الوزن خاصة في منطقة البطن؟", category: "inflammation", weight: 2 },
  { id: "q14", text: "هل تعاني من مشاكل جلدية مزمنة (أكزيما، صدفية)؟", category: "inflammation", weight: 2 },
  { id: "q15", text: "هل تعاني من الاكتئاب أو القلق المزمن؟", category: "inflammation", weight: 2 },
];

interface Supplement { name: string; dose: string; reason: string }

function getRecommendations(oxidationScore: number, inflammationScore: number): { antioxidants: Supplement[]; antiInflammatory: Supplement[] } {
  const antioxidants: Supplement[] = [];
  const antiInflammatory: Supplement[] = [];

  if (oxidationScore >= 8) {
    antioxidants.push(
      { name: "NAC (N-Acetyl Cysteine)", dose: "600 مغ × 2", reason: "يرفع الجلوتاثيون — أقوى مضاد أكسدة داخلي" },
      { name: "Vitamin C (Liposomal)", dose: "2-3 غ", reason: "يحيّد الجذور الحرة ويجدد فيتامين E" },
      { name: "Astaxanthin", dose: "12 مغ", reason: "أقوى مضاد أكسدة خارجي — 6000× أقوى من فيتامين C" },
    );
  } else if (oxidationScore >= 4) {
    antioxidants.push(
      { name: "Vitamin C", dose: "1-2 غ", reason: "مضاد أكسدة أساسي" },
      { name: "Vitamin E (Mixed Tocopherols)", dose: "400 IU", reason: "يحمي الدهون من الأكسدة" },
    );
  } else {
    antioxidants.push(
      { name: "Multivitamin مع مضادات الأكسدة", dose: "حسب المنتج", reason: "وقاية عامة" },
    );
  }

  if (inflammationScore >= 8) {
    antiInflammatory.push(
      { name: "Curcumin (Theracurmin)", dose: "1-2 غ", reason: "مضاد التهاب قوي — يثبط NF-kB" },
      { name: "Omega-3 (EPA عالي)", dose: "3-4 غ EPA", reason: "يحول الالتهاب إلى مسار الشفاء" },
      { name: "Boswellia (AKBA)", dose: "500 مغ", reason: "يثبط 5-LOX — مضاد التهاب قوي" },
      { name: "Quercetin", dose: "500 مغ", reason: "يثبط الهيستامين والالتهاب" },
    );
  } else if (inflammationScore >= 4) {
    antiInflammatory.push(
      { name: "Omega-3", dose: "2-3 غ", reason: "يقلل الالتهاب المعتدل" },
      { name: "Curcumin", dose: "500 مغ", reason: "مضاد التهاب طبيعي" },
    );
  } else {
    antiInflammatory.push(
      { name: "Omega-3", dose: "1-2 غ", reason: "وقاية من الالتهاب" },
    );
  }

  return { antioxidants, antiInflammatory };
}

export default function InflammationTrackerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const toggleAnswer = (id: string) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const oxidationScore = QUESTIONS.filter((q) => q.category === "oxidation" && answers[q.id]).reduce((sum, q) => sum + q.weight, 0);
  const inflammationScore = QUESTIONS.filter((q) => q.category === "inflammation" && answers[q.id]).reduce((sum, q) => sum + q.weight, 0);
  const maxOxidation = QUESTIONS.filter((q) => q.category === "oxidation").reduce((sum, q) => sum + q.weight, 0);
  const maxInflammation = QUESTIONS.filter((q) => q.category === "inflammation").reduce((sum, q) => sum + q.weight, 0);

  const oxidationLevel = oxidationScore / maxOxidation;
  const inflammationLevel = inflammationScore / maxInflammation;

  const getLevel = (ratio: number) => {
    if (ratio >= 0.6) return { label: "مرتفع", color: colors.error };
    if (ratio >= 0.3) return { label: "متوسط", color: colors.warning };
    return { label: "منخفض", color: colors.success };
  };

  const oxLevel = getLevel(oxidationLevel);
  const infLevel = getLevel(inflammationLevel);
  const recs = getRecommendations(oxidationScore, inflammationScore);

  const answeredCount = Object.keys(answers).length;

  if (showResults) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setShowResults(false)}>
            <IconSymbol name="chevron.right" size={20} color={colors.primary} />
            <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>نتائج التحليل</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          {/* Scores */}
          <View style={styles.scoresRow}>
            <View style={[styles.scoreCard, { backgroundColor: oxLevel.color + "12", borderColor: oxLevel.color + "40" }]}>
              <Text style={[styles.scoreLabel, { color: colors.muted }]}>مؤشر الأكسدة</Text>
              <Text style={[styles.scoreValue, { color: oxLevel.color }]}>{oxLevel.label}</Text>
              <View style={[styles.scoreBar, { backgroundColor: colors.border }]}>
                <View style={[styles.scoreBarFill, { backgroundColor: oxLevel.color, width: `${oxidationLevel * 100}%` as any }]} />
              </View>
              <Text style={[styles.scoreNum, { color: colors.muted }]}>{oxidationScore}/{maxOxidation}</Text>
            </View>
            <View style={[styles.scoreCard, { backgroundColor: infLevel.color + "12", borderColor: infLevel.color + "40" }]}>
              <Text style={[styles.scoreLabel, { color: colors.muted }]}>مؤشر الالتهاب</Text>
              <Text style={[styles.scoreValue, { color: infLevel.color }]}>{infLevel.label}</Text>
              <View style={[styles.scoreBar, { backgroundColor: colors.border }]}>
                <View style={[styles.scoreBarFill, { backgroundColor: infLevel.color, width: `${inflammationLevel * 100}%` as any }]} />
              </View>
              <Text style={[styles.scoreNum, { color: colors.muted }]}>{inflammationScore}/{maxInflammation}</Text>
            </View>
          </View>

          {/* Antioxidants */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>مضادات الأكسدة الموصى بها</Text>
          {recs.antioxidants.map((s, i) => (
            <View key={i} style={[styles.suppCard, { backgroundColor: colors.card, borderColor: colors.primary + "30" }]}>
              <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
              <Text style={[styles.suppDose, { color: colors.primary }]}>{s.dose}</Text>
              <Text style={[styles.suppReason, { color: colors.muted }]}>{s.reason}</Text>
            </View>
          ))}

          {/* Anti-inflammatory */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>مضادات الالتهاب الموصى بها</Text>
          {recs.antiInflammatory.map((s, i) => (
            <View key={i} style={[styles.suppCard, { backgroundColor: colors.card, borderColor: colors.error + "30" }]}>
              <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
              <Text style={[styles.suppDose, { color: colors.error }]}>{s.dose}</Text>
              <Text style={[styles.suppReason, { color: colors.muted }]}>{s.reason}</Text>
            </View>
          ))}

          {/* Lab Tests */}
          <View style={[styles.labCard, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
            <IconSymbol name="flask.fill" size={18} color={colors.warning} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.labTitle, { color: colors.foreground }]}>تحاليل مخبرية مقترحة</Text>
              <Text style={[styles.labText, { color: colors.muted }]}>
                • hs-CRP (بروتين سي التفاعلي عالي الحساسية){"\n"}
                • Homocysteine (الهوموسيستين){"\n"}
                • Ferritin (الفيريتين){"\n"}
                • Oxidized LDL (LDL المؤكسد){"\n"}
                • 8-OHdG (مؤشر تلف الحمض النووي)
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>مؤشر الأكسدة والالتهاب</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>أجب على {QUESTIONS.length} سؤال لتقييم مستوى الأكسدة والالتهاب في جسمك</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 100 }}>
        <Text style={[styles.categoryTitle, { color: colors.primary }]}>مؤشر الأكسدة والجذور الحرة</Text>
        {QUESTIONS.filter((q) => q.category === "oxidation").map((q) => (
          <Pressable
            key={q.id}
            style={[styles.questionCard, { backgroundColor: answers[q.id] ? colors.primary + "12" : colors.surface, borderColor: answers[q.id] ? colors.primary : colors.border }]}
            onPress={() => toggleAnswer(q.id)}
          >
            <View style={[styles.checkbox, { backgroundColor: answers[q.id] ? colors.primary : "transparent", borderColor: answers[q.id] ? colors.primary : colors.muted }]}>
              {answers[q.id] && <IconSymbol name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={[styles.questionText, { color: colors.foreground }]}>{q.text}</Text>
          </Pressable>
        ))}

        <Text style={[styles.categoryTitle, { color: colors.error, marginTop: 8 }]}>مؤشر الالتهاب المزمن</Text>
        {QUESTIONS.filter((q) => q.category === "inflammation").map((q) => (
          <Pressable
            key={q.id}
            style={[styles.questionCard, { backgroundColor: answers[q.id] ? colors.error + "12" : colors.surface, borderColor: answers[q.id] ? colors.error : colors.border }]}
            onPress={() => toggleAnswer(q.id)}
          >
            <View style={[styles.checkbox, { backgroundColor: answers[q.id] ? colors.error : "transparent", borderColor: answers[q.id] ? colors.error : colors.muted }]}>
              {answers[q.id] && <IconSymbol name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={[styles.questionText, { color: colors.foreground }]}>{q.text}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <Text style={[styles.footerCount, { color: colors.muted }]}>{answeredCount}/{QUESTIONS.length} سؤال</Text>
        <Pressable
          style={({ pressed }) => [styles.analyzeBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          onPress={() => setShowResults(true)}
        >
          <Text style={styles.analyzeBtnText}>تحليل النتائج</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600", fontFamily: "Cairo-Bold" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, lineHeight: 18, fontFamily: "Cairo" },
  categoryTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", marginBottom: 4, fontFamily: "Cairo-Black" },
  questionCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 1 },
  questionText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 0.5, gap: 12 },
  footerCount: { fontSize: 13, fontFamily: "Cairo" },
  analyzeBtn: { flex: 1, borderRadius: 14, padding: 14, alignItems: "center" },
  analyzeBtnText: { color: "#fff", fontSize: 15, fontWeight: "800", fontFamily: "Cairo-Black" },
  scoresRow: { flexDirection: "row-reverse", gap: 12 },
  scoreCard: { flex: 1, borderRadius: 16, padding: 14, borderWidth: 1, alignItems: "center", gap: 8 },
  scoreLabel: { fontSize: 12, fontWeight: "600", fontFamily: "Cairo-Bold" },
  scoreValue: { fontSize: 18, fontWeight: "800", fontFamily: "Cairo-Black" },
  scoreBar: { width: "100%", height: 6, borderRadius: 3, overflow: "hidden" },
  scoreBarFill: { height: "100%", borderRadius: 3 },
  scoreNum: { fontSize: 11, fontFamily: "Cairo" },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 13, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppReason: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  labCard: { flexDirection: "row-reverse", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  labTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 6, fontFamily: "Cairo-Black" },
  labText: { fontSize: 12, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
});
