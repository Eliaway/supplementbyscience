/**
 * أكاديمية المكملات — Supplement Academy
 * Features #56 (أكاديمية المكملات), #57 (أسطورة أم حقيقة؟)
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface MythFact {
  id: string;
  myth: string;
  verdict: "خرافة" | "حقيقة" | "نصف صحيح";
  explanation: string;
  source: string;
}

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  duration: string;
  content: string[];
}

const MYTHS: MythFact[] = [
  {
    id: "m1",
    myth: "البروتين الزائد يضر الكلى لدى الأصحاء",
    verdict: "خرافة",
    explanation: "الأبحاث الحديثة أثبتت أن البروتين العالي (حتى 3 غ/كغ) آمن تماماً للأشخاص الأصحاء. المشكلة فقط لمن لديهم مرض كلوي موجود مسبقاً.",
    source: "Journal of Nutrition, 2020",
  },
  {
    id: "m2",
    myth: "الكرياتين يسبب تساقط الشعر",
    verdict: "نصف صحيح",
    explanation: "دراسة واحدة وجدت ارتفاعاً في DHT (مرتبط بتساقط الشعر) لكن لم تُقِس تساقط الشعر فعلياً. عشرات الدراسات الأخرى لم تجد هذا التأثير.",
    source: "Clinical Journal of Sport Medicine, 2009",
  },
  {
    id: "m3",
    myth: "يجب أخذ فيتامين C جرعات كبيرة لمنع الزكام",
    verdict: "نصف صحيح",
    explanation: "فيتامين C يقلل مدة الزكام بيوم واحد فقط في المتوسط، ولا يمنعه. الجرعات فوق 2000 مغ يومياً قد تسبب حصى الكلى.",
    source: "Cochrane Review, 2013",
  },
  {
    id: "m4",
    myth: "المكملات الطبيعية آمنة دائماً",
    verdict: "خرافة",
    explanation: "كلمة 'طبيعي' لا تعني آمن. الكافا يسبب تلف الكبد، الأفيدرا سببت وفيات، والسانت جون وورت يتفاعل مع أدوية خطيرة.",
    source: "FDA Safety Reports",
  },
  {
    id: "m5",
    myth: "الكولاجين المأخوذ فموياً يذهب مباشرة للجلد",
    verdict: "خرافة",
    explanation: "الجسم يهضم الكولاجين لأحماض أمينية. لكن الدراسات أثبتت أن بعض الببتيدات الصغيرة تصل للجلد وتحفز إنتاج الكولاجين الطبيعي.",
    source: "Journal of Cosmetic Dermatology, 2019",
  },
  {
    id: "m6",
    myth: "الأوميغا-3 يرقق الدم بشكل خطير",
    verdict: "نصف صحيح",
    explanation: "الجرعات العادية (2-3 غ) آمنة. الجرعات فوق 4 غ يومياً قد تزيد خطر النزيف، خاصة مع مضادات التخثر. استشر طبيبك.",
    source: "American Heart Association, 2018",
  },
  {
    id: "m7",
    myth: "المكملات تعوض النظام الغذائي السيئ",
    verdict: "خرافة",
    explanation: "المكملات مكملة للنظام الغذائي وليست بديلاً عنه. الطعام الكامل يحتوي على آلاف المركبات النشطة التي لا يمكن تعويضها بكبسولة.",
    source: "Harvard Health, 2023",
  },
  {
    id: "m8",
    myth: "الزنك يعالج نزلات البرد",
    verdict: "حقيقة",
    explanation: "الزنك Acetate أو Gluconate عند أخذه خلال 24 ساعة من بداية الأعراض يقلل مدة الزكام بـ 33%. الجرعة: 75+ مغ يومياً.",
    source: "Cochrane Review, 2015",
  },
  {
    id: "m9",
    myth: "البيوتين يحسن الشعر لجميع الناس",
    verdict: "نصف صحيح",
    explanation: "البيوتين يفيد فقط من لديهم نقص حقيقي (نادر جداً). للأصحاء، لا دليل على فائدته للشعر. لكنه يؤثر على نتائج تحاليل الغدة الدرقية.",
    source: "JAMA Dermatology, 2017",
  },
  {
    id: "m10",
    myth: "الـ Pre-workout يسبب مشاكل قلبية",
    verdict: "نصف صحيح",
    explanation: "الكافيين والمنشطات في الـ Pre-workout آمنة للأصحاء بالجرعات المعتدلة. لكن من لديهم مشاكل قلبية أو ضغط مرتفع يجب استشارة الطبيب.",
    source: "British Journal of Sports Medicine, 2021",
  },
];

const LESSONS: Lesson[] = [
  {
    id: "l1",
    title: "أساسيات الامتصاص والتوافر البيولوجي",
    subtitle: "لماذا لا تعمل بعض المكملات رغم ارتفاع سعرها؟",
    icon: "atom",
    color: "#6366F1",
    level: "مبتدئ",
    duration: "5 دقائق",
    content: [
      "**التوافر البيولوجي (Bioavailability)** هو النسبة المئوية من المكمل التي تصل فعلياً إلى مجرى الدم وتُستخدم من الجسم.",
      "**العوامل المؤثرة:** شكل المكمل الكيميائي، وجود الطعام، حموضة المعدة، التفاعل مع مواد أخرى، والعوامل الجينية.",
      "**أمثلة عملية:** Magnesium Oxide (4% امتصاص) مقابل Glycinate (80%+). Zinc Oxide ضعيف جداً مقابل Picolinate ممتاز.",
      "**القاعدة الذهبية:** الأرخص ليس دائماً الأفضل — ابحث عن الشكل الكيميائي في الملصق، وليس فقط الاسم.",
      "**الدهنية مقابل المائية:** الفيتامينات الذائبة في الدهون (A, D, E, K) تحتاج طعاماً دهنياً. المائية (B, C) تُمتص بدون طعام.",
    ],
  },
  {
    id: "l2",
    title: "التفاعلات بين المكملات والأدوية",
    subtitle: "ما الذي يجب أن يعرفه كل شخص يأخذ أدوية",
    icon: "exclamationmark.triangle.fill",
    color: "#EF4444",
    level: "مبتدئ",
    duration: "7 دقائق",
    content: [
      "**التفاعلات الخطيرة الشائعة:** سانت جون وورت مع مضادات الاكتئاب (Serotonin Syndrome). الجنكو مع مضادات التخثر (نزيف). الثوم مع Warfarin.",
      "**الكالسيوم والحديد:** يتنافسان على نفس الناقل — خذهما بفارق ساعتين على الأقل.",
      "**أدوية الغدة الدرقية:** Levothyroxine يتأثر بالكالسيوم، الحديد، والمغنيسيوم — خذه على معدة فارغة وبعيداً عنهم بساعتين.",
      "**الستاتين والكوبيوتين:** الستاتين تستنزف CoQ10 — إضافته قد تقلل آلام العضلات الجانبية.",
      "**القاعدة:** أخبر طبيبك وصيدلانيك بجميع المكملات التي تأخذها — حتى 'الطبيعية' منها.",
    ],
  },
  {
    id: "l3",
    title: "علم الهرمونات والمكملات",
    subtitle: "كيف تؤثر المكملات على التستوستيرون والكورتيزول؟",
    icon: "bolt.fill",
    color: "#F97316",
    level: "متوسط",
    duration: "8 دقائق",
    content: [
      "**التستوستيرون والزنك:** الزنك ضروري لإنتاج التستوستيرون — نقصه يخفضه بشكل ملحوظ. الجرعة: 25-30 مغ يومياً.",
      "**الكورتيزول والأشواغاندا:** KSM-66 يخفض الكورتيزول 28% في الدراسات — يحسن الأداء الرياضي والنوم.",
      "**DHEA والعمر:** ينخفض بعد الثلاثين — يمكن قياسه بتحليل دم. المكملة مثيرة للجدل وتحتاج إشراف طبي.",
      "**الإستروجين والـ DIM:** موجود في الخضروات الصليبية — يساعد في توازن الإستروجين لدى المرأة.",
      "**تحذير:** لا تأخذ هرمونات أو مقدماتها دون تحليل دم وإشراف طبي — قد تسبب اختلالاً هرمونياً خطيراً.",
    ],
  },
  {
    id: "l4",
    title: "الميكروبيوم والمكملات",
    subtitle: "العلاقة بين صحة الأمعاء والصحة العامة",
    icon: "waveform.path",
    color: "#10B981",
    level: "متوسط",
    duration: "6 دقائق",
    content: [
      "**الميكروبيوم:** 100 تريليون بكتيريا في أمعائك — تؤثر على المناعة، المزاج، الوزن، وحتى الدماغ (Gut-Brain Axis).",
      "**البروبيوتيك:** يحتاج سلالات متعددة (Lactobacillus + Bifidobacterium) بتركيز 10-50 مليار CFU. خذه بعيداً عن الطعام الساخن.",
      "**البريبيوتيك:** الألياف التي تغذي البكتيريا النافعة — Inulin, FOS, Resistant Starch. ابدأ بجرعة صغيرة لتجنب الغازات.",
      "**L-Glutamine:** يصلح بطانة الأمعاء — مفيد لـ Leaky Gut والقولون العصبي. الجرعة: 5-10 غ يومياً.",
      "**المضادات الحيوية:** تدمر الميكروبيوم — خذ البروبيوتيك بعد انتهاء الدورة بساعتين، واستمر 4 أسابيع بعدها.",
    ],
  },
  {
    id: "l5",
    title: "مكملات الأداء الذهني (Nootropics)",
    subtitle: "ما الذي يعمل فعلاً لتحسين الذاكرة والتركيز؟",
    icon: "brain.head.profile",
    color: "#8B5CF6",
    level: "متقدم",
    duration: "9 دقائق",
    content: [
      "**الأدلة القوية:** Bacopa Monnieri (يحسن الذاكرة بعد 12 أسبوع)، Lion's Mane (يحفز NGF لنمو الأعصاب)، Phosphatidylserine (يحسن الذاكرة لكبار السن).",
      "**أدلة متوسطة:** Ginkgo Biloba (يحسن الدورة الدموية الدماغية)، Alpha-GPC (يرفع الأسيتيلكولين)، Rhodiola (يقلل التعب الذهني).",
      "**الكافيين + L-Theanine:** أفضل مزيج مدروس — الكافيين للتركيز، الثيانين يلغي القلق والتوتر. النسبة المثالية 1:2.",
      "**تحذير من Racetams:** Piracetam وغيرها غير مرخصة كغذاء في كثير من الدول — احذر من المصادر المجهولة.",
      "**الأساس أولاً:** النوم الكافي، الأوميغا-3، وفيتامين D3 أثبتوا تأثيراً على الذاكرة أكثر من كثير من الـ Nootropics.",
    ],
  },
];

export default function AcademyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"lessons" | "myths">("lessons");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [revealedMyths, setRevealedMyths] = useState<Set<string>>(new Set());

  const toggleMyth = (id: string) => {
    setRevealedMyths((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (selectedLesson) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: selectedLesson.color + "12", borderBottomColor: selectedLesson.color + "30" }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedLesson(null)}>
            <IconSymbol name="chevron.right" size={22} color={selectedLesson.color} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>{selectedLesson.title}</Text>
            <View style={styles.lessonMeta}>
              <View style={[styles.levelBadge, { backgroundColor: selectedLesson.color + "20" }]}>
                <Text style={[styles.levelText, { color: selectedLesson.color }]}>{selectedLesson.level}</Text>
              </View>
              <Text style={[styles.duration, { color: colors.muted }]}>{selectedLesson.duration}</Text>
            </View>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 40 }}>
          {selectedLesson.content.map((para, i) => (
            <View key={i} style={[styles.lessonPara, { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: selectedLesson.color, borderLeftWidth: 3 }]}>
              <Text style={[styles.lessonParaText, { color: colors.foreground }]}>{para.replace(/\*\*(.*?)\*\*/g, "$1")}</Text>
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>أكاديمية المكملات</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>تعلم علم المكملات بشكل صحيح</Text>
        </View>
        <Pressable
          style={[styles.quizBtn, { backgroundColor: colors.primary + "15" }]}
          onPress={() => router.push("/knowledge-quiz" as any)}
        >
          <IconSymbol name="checkmark.circle.fill" size={14} color={colors.primary} />
          <Text style={[styles.quizBtnText, { color: colors.primary }]}>اختبار</Text>
        </Pressable>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {([{ id: "lessons" as const, label: "الدروس", count: LESSONS.length }, { id: "myths" as const, label: "أسطورة أم حقيقة؟", count: MYTHS.length }]).map((tab) => (
          <Pressable key={tab.id}
            style={[styles.tab, activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.id)}>
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label} ({tab.count})</Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "lessons" ? (
        <FlatList
          data={LESSONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.lessonCard, { backgroundColor: colors.surface, borderColor: item.color + "30", borderLeftColor: item.color, borderLeftWidth: 4 }, pressed && { opacity: 0.8 }]}
              onPress={() => setSelectedLesson(item)}
            >
              <View style={styles.lessonCardTop}>
                <View style={[styles.lessonIcon, { backgroundColor: item.color + "15" }]}>
                  <IconSymbol name={item.icon} size={22} color={item.color} />
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.lessonTitle, { color: colors.foreground }]}>{item.title}</Text>
                  <Text style={[styles.lessonSubtitle, { color: colors.muted }]}>{item.subtitle}</Text>
                </View>
                <IconSymbol name="chevron.left" size={16} color={colors.muted} />
              </View>
              <View style={styles.lessonFooter}>
                <View style={[styles.levelBadge, { backgroundColor: item.color + "15" }]}>
                  <Text style={[styles.levelText, { color: item.color }]}>{item.level}</Text>
                </View>
                <View style={[styles.durationBadge, { backgroundColor: colors.background }]}>
                  <IconSymbol name="clock.fill" size={10} color={colors.muted} />
                  <Text style={[styles.duration, { color: colors.muted }]}>{item.duration}</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <FlatList
          data={MYTHS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const revealed = revealedMyths.has(item.id);
            const verdictColor = item.verdict === "خرافة" ? colors.error : item.verdict === "حقيقة" ? colors.success : colors.warning;
            return (
              <Pressable
                style={[styles.mythCard, { backgroundColor: colors.surface, borderColor: revealed ? verdictColor + "40" : colors.border }]}
                onPress={() => toggleMyth(item.id)}
              >
                <View style={styles.mythTop}>
                  <View style={[styles.mythIcon, { backgroundColor: revealed ? verdictColor + "15" : colors.background }]}>
                    <IconSymbol name={revealed ? (item.verdict === "خرافة" ? "xmark.circle.fill" : item.verdict === "حقيقة" ? "checkmark.circle.fill" : "info.circle.fill") : "questionmark.circle.fill"} size={22} color={revealed ? verdictColor : colors.muted} />
                  </View>
                  <Text style={[styles.mythText, { color: colors.foreground }]}>{item.myth}</Text>
                </View>
                {!revealed && (
                  <View style={[styles.revealBtn, { backgroundColor: colors.primary + "15" }]}>
                    <Text style={[styles.revealBtnText, { color: colors.primary }]}>اضغط لمعرفة الحقيقة</Text>
                  </View>
                )}
                {revealed && (
                  <>
                    <View style={[styles.verdictBadge, { backgroundColor: verdictColor + "15" }]}>
                      <Text style={[styles.verdictText, { color: verdictColor }]}>{item.verdict}</Text>
                    </View>
                    <Text style={[styles.mythExplanation, { color: colors.foreground }]}>{item.explanation}</Text>
                    <Text style={[styles.mythSource, { color: colors.muted }]}>المصدر: {item.source}</Text>
                  </>
                )}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  quizBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  quizBtnText: { fontSize: 12, fontWeight: "700" },
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontWeight: "700" },
  lessonCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  lessonCardTop: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  lessonIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  lessonTitle: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  lessonSubtitle: { fontSize: 12, textAlign: "right", marginTop: 2 },
  lessonFooter: { flexDirection: "row-reverse", gap: 8 },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  levelText: { fontSize: 11, fontWeight: "700" },
  durationBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  duration: { fontSize: 11 },
  lessonMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 4 },
  lessonPara: { borderRadius: 12, padding: 14, borderWidth: 1 },
  lessonParaText: { fontSize: 14, lineHeight: 22, textAlign: "right" },
  mythCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  mythTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  mythIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  mythText: { flex: 1, fontSize: 15, fontWeight: "700", textAlign: "right", lineHeight: 22 },
  revealBtn: { alignItems: "center", padding: 10, borderRadius: 10 },
  revealBtnText: { fontSize: 13, fontWeight: "700" },
  verdictBadge: { alignSelf: "flex-end", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  verdictText: { fontSize: 14, fontWeight: "900" },
  mythExplanation: { fontSize: 13, lineHeight: 20, textAlign: "right" },
  mythSource: { fontSize: 11, textAlign: "right", fontStyle: "italic" },
});
