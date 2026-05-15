/**
 * اختبار معرفتك بالمكملات — Supplement Knowledge Quiz
 * Feature #95
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "ما هو أفضل وقت لأخذ فيتامين D3؟",
    options: ["على معدة فارغة صباحاً", "مع وجبة تحتوي على دهون", "قبل النوم مباشرة", "مع القهوة"],
    correct: 1,
    explanation: "فيتامين D3 ذائب في الدهون — يمتص بشكل أفضل مع الطعام الذي يحتوي على دهون صحية مثل الزيت أو الأفوكادو.",
    category: "الفيتامينات",
  },
  {
    id: 2,
    question: "ما الفرق الرئيسي بين Magnesium Glycinate و Magnesium Oxide؟",
    options: ["لا فرق بينهما", "Glycinate أعلى امتصاصاً وأقل إسهالاً", "Oxide أغلى ثمناً", "Glycinate للعضلات فقط"],
    correct: 1,
    explanation: "Magnesium Glycinate مرتبط بالجلايسين — امتصاصه أعلى بكثير (80%+) مقارنة بـ Oxide (4%) وأقل تأثيراً على الأمعاء.",
    category: "المعادن",
  },
  {
    id: 3,
    question: "لماذا يجب أخذ الكرياتين مع الكربوهيدرات؟",
    options: ["لتحسين الطعم", "لأن الأنسولين يساعد في نقله للعضلات", "لتقليل الغثيان", "لا يجب أخذه مع الكربوهيدرات"],
    correct: 1,
    explanation: "الأنسولين الناتج عن الكربوهيدرات يحفز ناقل الكرياتين في العضلات — يزيد امتصاصه بنسبة تصل لـ 60%.",
    category: "الرياضة",
  },
  {
    id: 4,
    question: "ما هو الشكل الأفضل من أوميغا-3 للامتصاص؟",
    options: ["Ethyl Ester (EE)", "Triglyceride (rTG)", "كلاهما متساويان", "الزيت الخام"],
    correct: 1,
    explanation: "شكل rTG (re-esterified Triglyceride) يُمتص بنسبة أعلى بـ 70% من شكل EE الأرخص — ابحث عنه في الملصق.",
    category: "الدهون",
  },
  {
    id: 5,
    question: "ما الذي يقلل امتصاص الحديد؟",
    options: ["فيتامين C", "الكالسيوم والقهوة والشاي", "الماء", "البروتين"],
    correct: 1,
    explanation: "الكالسيوم يتنافس مع الحديد على نفس الناقل. التانين في القهوة والشاي يرتبط بالحديد ويمنع امتصاصه — خذهما بفارق ساعتين.",
    category: "المعادن",
  },
  {
    id: 6,
    question: "ما هو Beta-Alanine وما تأثيره الجانبي الشائع؟",
    options: ["حمض أميني يسبب نعاساً", "مقدمة الكارنوزين يسبب وخزاً جلدياً", "فيتامين يسبب غثياناً", "معدن يسبب إمساكاً"],
    correct: 1,
    explanation: "Beta-Alanine يرفع الكارنوزين في العضلات — يقلل حمض اللاكتيك. الوخز الجلدي (Paresthesia) طبيعي تماماً ويختفي مع الاستمرار.",
    category: "الرياضة",
  },
  {
    id: 7,
    question: "لماذا يُفضَّل فيتامين B12 بشكل Methylcobalamin على Cyanocobalamin؟",
    options: ["أرخص ثمناً", "الجسم يستخدمه مباشرة دون تحويل", "أقوى في التأثير", "لا فرق بينهما"],
    correct: 1,
    explanation: "Methylcobalamin هو الشكل النشط الذي يستخدمه الجسم مباشرة. Cyanocobalamin يحتاج تحويلاً كيميائياً وقد يكون أقل كفاءة لبعض الأشخاص.",
    category: "الفيتامينات",
  },
  {
    id: 8,
    question: "ما هو CoQ10 ولماذا يحتاجه من يأخذ الستاتين؟",
    options: ["فيتامين للمناعة", "إنزيم لإنتاج الطاقة تقلله الستاتين", "معدن للعظام", "حمض أميني للعضلات"],
    correct: 1,
    explanation: "الستاتين تمنع إنزيم HMG-CoA الذي ينتج الكوليستيرول — وهو نفس الإنزيم الذي ينتج CoQ10. النقص يسبب آلام عضلية وتعباً.",
    category: "القلب",
  },
  {
    id: 9,
    question: "ما الفرق بين Whey Concentrate و Whey Isolate؟",
    options: ["لا فرق في التأثير", "Isolate أنقى وأقل لاكتوز وأعلى بروتين", "Concentrate أفضل للعضلات", "Isolate أرخص"],
    correct: 1,
    explanation: "Isolate يمر بمرحلة تصفية إضافية — بروتين 90%+ مقابل 70-80% في Concentrate، ولاكتوز أقل من 1% مقابل 3-8%.",
    category: "البروتين",
  },
  {
    id: 10,
    question: "ما هو Ashwagandha KSM-66 وما ميزته؟",
    options: ["نوع من الفيتامينات", "مستخلص جذر الأشواغاندا بنسبة 5% Withanolides", "بروتين نباتي", "معدن نادر"],
    correct: 1,
    explanation: "KSM-66 هو مستخلص جذر الأشواغاندا الأكثر بحثاً — يخفض الكورتيزول 28%، يحسن VO2 max، ويزيد التستوستيرون في الدراسات.",
    category: "الأعشاب",
  },
  {
    id: 11,
    question: "لماذا لا يجب أخذ 5-HTP مع أدوية SSRI؟",
    options: ["يقلل فعاليتها", "قد يسبب Serotonin Syndrome خطير", "يزيد تكلفتها", "لا مشكلة في أخذهما معاً"],
    correct: 1,
    explanation: "5-HTP يرفع السيروتونين مباشرة، والـ SSRI تمنع إعادة امتصاصه — معاً قد يسببان تراكماً خطيراً للسيروتونين (Serotonin Syndrome).",
    category: "الأمان",
  },
  {
    id: 12,
    question: "ما هو أفضل شكل من الزنك للامتصاص؟",
    options: ["Zinc Oxide", "Zinc Picolinate أو Zinc Bisglycinate", "Zinc Sulfate", "كلها متساوية"],
    correct: 1,
    explanation: "Zinc Picolinate و Bisglycinate يمتصان بشكل أفضل بكثير من Oxide وSulfate. Oxide الأرخص لكن امتصاصه ضعيف جداً.",
    category: "المعادن",
  },
];

export default function KnowledgeQuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZ_QUESTIONS.length).fill(null));

  const q = QUIZ_QUESTIONS[current];
  const isAnswered = selected !== null;
  const isCorrect = selected === q.correct;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(answers[current + 1]);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null));
  };

  const getScoreLevel = () => {
    const pct = (score / QUIZ_QUESTIONS.length) * 100;
    if (pct >= 90) return { label: "خبير مكملات! 🏆", color: colors.success };
    if (pct >= 70) return { label: "متقدم ممتاز 🎓", color: colors.primary };
    if (pct >= 50) return { label: "مستوى متوسط 📚", color: colors.warning };
    return { label: "مبتدئ — استمر في التعلم 💪", color: colors.error };
  };

  if (showResult) {
    const level = getScoreLevel();
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <IconSymbol name="chevron.right" size={22} color={colors.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>نتيجة الاختبار</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 24, alignItems: "center", gap: 20, paddingBottom: 40 }}>
          <View style={[styles.scoreCircle, { borderColor: level.color }]}>
            <Text style={[styles.scoreNum, { color: level.color }]}>{score}/{QUIZ_QUESTIONS.length}</Text>
            <Text style={[styles.scorePct, { color: colors.muted }]}>{Math.round((score / QUIZ_QUESTIONS.length) * 100)}%</Text>
          </View>
          <Text style={[styles.levelLabel, { color: level.color }]}>{level.label}</Text>
          <View style={{ width: "100%", gap: 8 }}>
            {QUIZ_QUESTIONS.map((q, i) => {
              const ans = answers[i];
              const correct = ans === q.correct;
              return (
                <View key={q.id} style={[styles.resultRow, { backgroundColor: correct ? colors.success + "12" : colors.error + "12", borderColor: correct ? colors.success + "30" : colors.error + "30" }]}>
                  <IconSymbol name={correct ? "checkmark.circle.fill" : "xmark.circle.fill"} size={18} color={correct ? colors.success : colors.error} />
                  <Text style={[styles.resultQ, { color: colors.foreground }]} numberOfLines={2}>{q.question}</Text>
                </View>
              );
            })}
          </View>
          <Pressable style={[styles.restartBtn, { backgroundColor: colors.primary }]} onPress={handleRestart}>
            <IconSymbol name="arrow.clockwise" size={18} color="#fff" />
            <Text style={styles.restartBtnText}>إعادة الاختبار</Text>
          </Pressable>
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>اختبار المعرفة</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>سؤال {current + 1} من {QUIZ_QUESTIONS.length}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: colors.primary + "15" }]}>
          <Text style={[styles.scoreBadgeText, { color: colors.primary }]}>{score} ✓</Text>
        </View>
      </View>

      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
        <View style={[styles.categoryBadge, { backgroundColor: colors.primary + "15" }]}>
          <Text style={[styles.categoryText, { color: colors.primary }]}>{q.category}</Text>
        </View>
        <Text style={[styles.question, { color: colors.foreground }]}>{q.question}</Text>

        <View style={{ gap: 10 }}>
          {q.options.map((opt, idx) => {
            let bg = colors.surface;
            let border = colors.border;
            let textColor = colors.foreground;
            if (isAnswered) {
              if (idx === q.correct) { bg = colors.success + "20"; border = colors.success; textColor = colors.success; }
              else if (idx === selected && idx !== q.correct) { bg = colors.error + "20"; border = colors.error; textColor = colors.error; }
            } else if (selected === idx) { bg = colors.primary + "20"; border = colors.primary; }
            return (
              <Pressable
                key={idx}
                style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                onPress={() => handleSelect(idx)}
              >
                <View style={[styles.optionDot, { backgroundColor: isAnswered && idx === q.correct ? colors.success : isAnswered && idx === selected ? colors.error : colors.border }]}>
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{["أ", "ب", "ج", "د"][idx]}</Text>
                </View>
                <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {isAnswered && (
          <View style={[styles.explanation, { backgroundColor: isCorrect ? colors.success + "10" : colors.error + "10", borderColor: isCorrect ? colors.success + "30" : colors.error + "30" }]}>
            <IconSymbol name={isCorrect ? "checkmark.circle.fill" : "info.circle.fill"} size={18} color={isCorrect ? colors.success : colors.error} />
            <Text style={[styles.explanationText, { color: colors.foreground }]}>{q.explanation}</Text>
          </View>
        )}

        {isAnswered && (
          <Pressable
            style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>{current < QUIZ_QUESTIONS.length - 1 ? "السؤال التالي" : "عرض النتيجة"}</Text>
            <IconSymbol name="chevron.left" size={18} color="#fff" />
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  scoreBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  scoreBadgeText: { fontSize: 13, fontWeight: "800" },
  progressBar: { height: 4, width: "100%" },
  progressFill: { height: 4, borderRadius: 2 },
  categoryBadge: { alignSelf: "flex-end", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  categoryText: { fontSize: 12, fontWeight: "700" },
  question: { fontSize: 18, fontWeight: "800", textAlign: "right", lineHeight: 28 },
  option: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, borderWidth: 1.5 },
  optionDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  optionText: { flex: 1, fontSize: 14, fontWeight: "600", textAlign: "right", lineHeight: 20 },
  explanation: { flexDirection: "row-reverse", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  explanationText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right" },
  nextBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: 14 },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  scoreCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, alignItems: "center", justifyContent: "center" },
  scoreNum: { fontSize: 36, fontWeight: "900" },
  scorePct: { fontSize: 14, fontWeight: "600" },
  levelLabel: { fontSize: 20, fontWeight: "900" },
  resultRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  resultQ: { flex: 1, fontSize: 13, textAlign: "right" },
  restartBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  restartBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
