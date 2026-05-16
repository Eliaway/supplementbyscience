/**
 * بروتوكول النوم العميق وجودة النوم
 * Features: 46 (بروتوكول النوم العميق), 48 (مؤشر جودة النوم), 110 (شيفت ليلي)
 */
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const SLEEP_PROTOCOLS = [
  {
    id: "basic",
    title: "بروتوكول النوم الأساسي",
    subtitle: "للأشخاص الذين يعانون من صعوبة في النوم",
    color: "#6366F1",
    icon: "moon.fill" as const,
    supplements: [
      { name: "Magnesium Glycinate", dose: "300-400 مغ", timing: "قبل النوم بـ 30 دقيقة", evidence: "قوي جداً", note: "أهم مكمل للنوم — يهدئ الجهاز العصبي ويرخي العضلات" },
      { name: "L-Theanine", dose: "200 مغ", timing: "قبل النوم بـ 30-60 دقيقة", evidence: "قوي", note: "يزيد موجات ألفا في الدماغ — استرخاء بدون نعاس" },
      { name: "Ashwagandha (KSM-66)", dose: "300-600 مغ", timing: "مع العشاء", evidence: "قوي", note: "يخفض الكورتيزول ويحسن جودة النوم بـ 72% في الدراسات" },
      { name: "Glycine", dose: "3 غ", timing: "قبل النوم مباشرة", evidence: "قوي", note: "يخفض درجة حرارة الجسم الأساسية — محفز طبيعي للنوم" },
    ],
  },
  {
    id: "deep",
    title: "بروتوكول النوم العميق (SWS)",
    subtitle: "لتحسين نسبة النوم العميق وإصلاح الجسم",
    color: "#8B5CF6",
    icon: "moon.stars.fill" as const,
    supplements: [
      { name: "Melatonin (Low Dose)", dose: "0.5-1 مغ", timing: "قبل النوم بـ 30 دقيقة", evidence: "قوي", note: "جرعات منخفضة أفضل — الجرعات العالية تعكس التأثير" },
      { name: "5-HTP", dose: "100 مغ", timing: "قبل النوم بساعة", evidence: "قوي", note: "سلف السيروتونين والميلاتونين — يحسن النوم العميق" },
      { name: "GABA", dose: "500 مغ", timing: "قبل النوم بـ 30 دقيقة", evidence: "متوسط", note: "ناقل عصبي مثبط — يقلل القلق ويحسن النوم" },
      { name: "Valerian Root", dose: "300-600 مغ", timing: "قبل النوم بساعة", evidence: "متوسط", note: "عشبة الحشيشة — تحسن جودة النوم بعد أسبوعين من الاستخدام" },
    ],
  },
  {
    id: "night_shift",
    title: "بروتوكول العمل الليلي",
    subtitle: "للعاملين في الشيفت الليلي والسفر عبر المناطق الزمنية",
    color: "#F59E0B",
    icon: "moon.fill" as const,
    supplements: [
      { name: "Melatonin (Timed)", dose: "3-5 مغ", timing: "عند الرغبة في النوم (نهاراً)", evidence: "قوي", note: "يعيد ضبط الساعة البيولوجية — ضروري للعمل الليلي" },
      { name: "Vitamin D3", dose: "4000 IU", timing: "عند الاستيقاظ", evidence: "قوي", note: "يعوض نقص التعرض للشمس في العمل الليلي" },
      { name: "Magnesium Glycinate", dose: "400 مغ", timing: "قبل النوم النهاري", evidence: "قوي", note: "يحسن جودة النوم النهاري" },
      { name: "Rhodiola Rosea", dose: "200-400 مغ", timing: "في بداية الشيفت", evidence: "قوي", note: "يقاوم التعب والإرهاق في الشيفت الليلي" },
    ],
  },
  {
    id: "anxiety_sleep",
    title: "بروتوكول القلق والنوم",
    subtitle: "عندما يمنع القلق والأفكار من النوم",
    color: "#10B981",
    icon: "brain.head.profile" as const,
    supplements: [
      { name: "Ashwagandha (KSM-66)", dose: "600 مغ", timing: "مع العشاء", evidence: "قوي", note: "يخفض الكورتيزول والقلق بشكل ملحوظ" },
      { name: "L-Theanine + Magnesium", dose: "200 مغ + 300 مغ", timing: "قبل النوم بساعة", evidence: "قوي", note: "تركيبة مثالية لإسكات العقل المفرط النشاط" },
      { name: "Passionflower Extract", dose: "300-400 مغ", timing: "قبل النوم بساعة", evidence: "متوسط", note: "عشبة الآلام — تهدئ القلق وتحسن النوم" },
      { name: "Lemon Balm Extract", dose: "300-600 مغ", timing: "قبل النوم بساعة", evidence: "متوسط", note: "تقلل القلق وتحسن الاسترخاء" },
    ],
  },
];

const SLEEP_HYGIENE = [
  { icon: "🌡️", title: "درجة الحرارة", desc: "18-20 درجة مئوية — الجسم يحتاج لانخفاض الحرارة للنوم" },
  { icon: "🌑", title: "الظلام الكامل", desc: "أي ضوء يثبط الميلاتونين — استخدم ستائر معتمة" },
  { icon: "📵", title: "الشاشات", desc: "أوقف الشاشات قبل ساعتين — الضوء الأزرق يؤخر الميلاتونين" },
  { icon: "☕", title: "الكافيين", desc: "آخر كوب قهوة قبل الظهر — نصف عمر الكافيين 5-7 ساعات" },
  { icon: "🛁", title: "حمام دافئ", desc: "قبل النوم بساعة — يخفض درجة حرارة الجسم عند الخروج" },
  { icon: "⏰", title: "ثبات المواعيد", desc: "نفس وقت النوم والاستيقاظ يومياً — حتى في عطلة نهاية الأسبوع" },
];

const SLEEP_SCORE_QUESTIONS = [
  { q: "هل تستغرق أكثر من 30 دقيقة للنوم؟", bad: true },
  { q: "هل تستيقظ في الليل أكثر من مرة؟", bad: true },
  { q: "هل تشعر بالتعب عند الاستيقاظ؟", bad: true },
  { q: "هل تنام 7-9 ساعات يومياً؟", bad: false },
  { q: "هل تحلم وتتذكر أحلامك؟", bad: false },
  { q: "هل تستيقظ تلقائياً بدون منبه؟", bad: false },
];

export default function SleepProtocolScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [showScore, setShowScore] = useState(false);

  const calculateScore = () => {
    let score = 100;
    SLEEP_SCORE_QUESTIONS.forEach((q, i) => {
      if (answers[i] !== undefined) {
        if (q.bad && answers[i]) score -= 15;
        if (!q.bad && !answers[i]) score -= 10;
      }
    });
    return Math.max(0, score);
  };

  const score = calculateScore();
  const scoreColor = score >= 80 ? colors.success : score >= 60 ? colors.warning : colors.error;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0f0a2a", borderBottomColor: "#1a1050" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#a78bfa" />
          <Text style={[styles.backText, { color: "#a78bfa" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>بروتوكول النوم العميق</Text>
        <Text style={[styles.headerSub, { color: "#c4b5fd" }]}>علم النوم وتحسين جودته بالمكملات</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Sleep Score */}
        <View style={[styles.scoreCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>مؤشر جودة نومك</Text>
          <Text style={[styles.scoreDesc, { color: colors.muted }]}>أجب على الأسئلة لتقييم جودة نومك</Text>
          {SLEEP_SCORE_QUESTIONS.map((q, i) => (
            <View key={i} style={styles.questionRow}>
              <View style={styles.questionBtns}>
                <Pressable
                  style={[styles.answerBtn, { backgroundColor: answers[i] === true ? "#10B981" + "30" : colors.surface, borderColor: answers[i] === true ? "#10B981" : colors.border }]}
                  onPress={() => { setAnswers(prev => ({ ...prev, [i]: true })); setShowScore(true); }}
                >
                  <Text style={{ color: answers[i] === true ? "#10B981" : colors.muted, fontSize: 12, fontWeight: "700" }}>نعم</Text>
                </Pressable>
                <Pressable
                  style={[styles.answerBtn, { backgroundColor: answers[i] === false ? "#EF4444" + "30" : colors.surface, borderColor: answers[i] === false ? "#EF4444" : colors.border }]}
                  onPress={() => { setAnswers(prev => ({ ...prev, [i]: false })); setShowScore(true); }}
                >
                  <Text style={{ color: answers[i] === false ? "#EF4444" : colors.muted, fontSize: 12, fontWeight: "700" }}>لا</Text>
                </Pressable>
              </View>
              <Text style={[styles.questionText, { color: colors.foreground }]}>{q.q}</Text>
            </View>
          ))}
          {showScore && (
            <View style={[styles.scoreResult, { backgroundColor: scoreColor + "15", borderColor: scoreColor + "40" }]}>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>{score}%</Text>
              <Text style={[styles.scoreLabel, { color: scoreColor }]}>
                {score >= 80 ? "نوم ممتاز 🌟" : score >= 60 ? "نوم متوسط — يحتاج تحسين" : "نوم سيئ — يحتاج تدخل عاجل"}
              </Text>
            </View>
          )}
        </View>

        {/* Sleep Hygiene */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نظافة النوم الأساسية</Text>
        <View style={styles.hygieneGrid}>
          {SLEEP_HYGIENE.map((item, i) => (
            <View key={i} style={[styles.hygieneCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={styles.hygieneEmoji}>{item.icon}</Text>
              <Text style={[styles.hygieneTitle, { color: colors.foreground }]}>{item.title}</Text>
              <Text style={[styles.hygieneDesc, { color: colors.muted }]}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* Protocols */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>بروتوكولات النوم</Text>
        {SLEEP_PROTOCOLS.map((protocol) => (
          <View key={protocol.id} style={[styles.protocolCard, { backgroundColor: colors.surface, borderColor: protocol.color + "40" }]}>
            <Pressable
              style={[styles.protocolHeader, { backgroundColor: protocol.color + "10" }]}
              onPress={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
            >
              <IconSymbol name={expandedProtocol === protocol.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.protocolInfo}>
                <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{protocol.title}</Text>
                <Text style={[styles.protocolSubtitle, { color: colors.muted }]}>{protocol.subtitle}</Text>
              </View>
              <View style={[styles.protocolIcon, { backgroundColor: protocol.color + "20" }]}>
                <IconSymbol name={protocol.icon} size={22} color={protocol.color} />
              </View>
            </Pressable>
            {expandedProtocol === protocol.id && (
              <View style={{ padding: 12, gap: 10 }}>
                {protocol.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: protocol.color + "06", borderColor: protocol.color + "20" }]}>
                    <View style={styles.suppHeader}>
                      <View style={[styles.evidenceBadge, { backgroundColor: supp.evidence.includes("قوي") ? colors.success + "20" : colors.warning + "20" }]}>
                        <Text style={[styles.evidenceText, { color: supp.evidence.includes("قوي") ? colors.success : colors.warning }]}>{supp.evidence}</Text>
                      </View>
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    </View>
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppTiming, { color: colors.muted }]}>التوقيت: {supp.timing}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  scoreCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 12 },
  scoreDesc: { fontSize: 13, textAlign: "right", fontFamily: "Cairo" },
  questionRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  questionText: { flex: 1, fontSize: 13, textAlign: "right", fontFamily: "Cairo" },
  questionBtns: { flexDirection: "row", gap: 6 },
  answerBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  scoreResult: { borderRadius: 12, padding: 14, borderWidth: 1, alignItems: "center", gap: 4 },
  scoreNum: { fontSize: 36, fontWeight: "900", fontFamily: "Cairo-Black" },
  scoreLabel: { fontSize: 14, fontWeight: "700", fontFamily: "Cairo-Bold" },
  hygieneGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  hygieneCard: { width: "47%", padding: 12, borderRadius: 14, borderWidth: 1, gap: 6 },
  hygieneEmoji: { fontSize: 24, fontFamily: "Cairo" },
  hygieneTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  hygieneDesc: { fontSize: 11, lineHeight: 16, textAlign: "right", fontFamily: "Cairo" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "flex-start", padding: 14, gap: 10 },
  protocolInfo: { flex: 1, alignItems: "flex-end", gap: 4 },
  protocolTitle: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  protocolSubtitle: { fontSize: 12, fontFamily: "Cairo" },
  protocolIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppTiming: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
