import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { CATEGORY_COLORS, CATEGORY_ICONS, Product, useSupplements } from "@/hooks/use-supplements";

I18nManager.forceRTL(true);

interface UserAnswers {
  goals: string[];
  age: string;
  gender: string;
  activityLevel: string;
  healthConditions: string[];
  allergies: string[];
  experienceLevel: string;
  budget: string;
}

interface CourseProduct {
  product: Product;
  timing: string;
  duration: string;
  priority: "أساسي" | "مكمّل" | "اختياري";
  reason: string;
}

interface GeneratedCourse {
  title: string;
  duration: string;
  goals: string[];
  products: CourseProduct[];
  warnings: string[];
  notes: string;
  createdAt: string;
}

const GOALS = [
  { id: "liver", label: "حماية الكبد", icon: "leaf.fill", color: "#F59E0B" },
  { id: "heart", label: "صحة القلب", icon: "heart.fill", color: "#EF4444" },
  { id: "kidney", label: "صحة الكلى", icon: "drop.fill", color: "#8B5CF6" },
  { id: "brain", label: "تحسين التركيز والذاكرة", icon: "brain.head.profile", color: "#3B82F6" },
  { id: "mood", label: "تخفيف التوتر والقلق", icon: "sparkles", color: "#EC4899" },
  { id: "hormones", label: "دعم الهرمونات", icon: "bolt.fill", color: "#84CC16" },
  { id: "prostate", label: "صحة البروستاتا", icon: "shield.fill", color: "#06B6D4" },
  { id: "sleep", label: "تحسين النوم", icon: "moon.fill", color: "#A78BFA" },
  { id: "vitamins", label: "الفيتامينات والمعادن", icon: "pills.fill", color: "#10B981" },
  { id: "metabolism", label: "تنظيم السكر والتمثيل الغذائي", icon: "flame.fill", color: "#F97316" },
  { id: "longevity", label: "طول العمر ومكافحة الشيخوخة", icon: "trophy.fill", color: "#6366F1" },
  { id: "general", label: "الصحة العامة والمناعة", icon: "cross.fill", color: "#64748B" },
];

const QUESTIONS = [
  {
    id: "age", title: "ما هي فئتك العمرية؟",
    subtitle: "يؤثر العمر على احتياجات الجسم من المكملات",
    type: "single", field: "age" as keyof UserAnswers,
    options: ["18-25", "26-35", "36-45", "46-55", "56+"].map((a) => ({ id: a, label: a })),
  },
  {
    id: "gender", title: "ما هو جنسك؟",
    subtitle: "بعض المكملات تختلف احتياجاتها بين الجنسين",
    type: "single", field: "gender" as keyof UserAnswers,
    options: [{ id: "male", label: "ذكر" }, { id: "female", label: "أنثى" }],
  },
  {
    id: "activityLevel", title: "ما هو مستوى نشاطك البدني؟",
    subtitle: "النشاط البدني يحدد احتياجاتك من الطاقة والتعافي",
    type: "single", field: "activityLevel" as keyof UserAnswers,
    options: [
      { id: "sedentary", label: "خامل (مكتبي)" },
      { id: "light", label: "خفيف (1-2 مرة/أسبوع)" },
      { id: "moderate", label: "متوسط (3-4 مرات/أسبوع)" },
      { id: "active", label: "نشيط (5+ مرات/أسبوع)" },
      { id: "athlete", label: "رياضي محترف" },
    ],
  },
  {
    id: "experienceLevel", title: "ما هي خبرتك مع المكملات الغذائية؟",
    subtitle: "نحدد التوصيات بناءً على مستوى خبرتك",
    type: "single", field: "experienceLevel" as keyof UserAnswers,
    options: [
      { id: "beginner", label: "مبتدئ (أقل من سنة)" },
      { id: "intermediate", label: "متوسط (1-3 سنوات)" },
      { id: "advanced", label: "متقدم (3+ سنوات)" },
    ],
  },
  {
    id: "healthConditions", title: "هل تعاني من أي أمراض مزمنة؟",
    subtitle: "هذا يساعدنا على تجنب التعارضات الصحية",
    type: "multi", field: "healthConditions" as keyof UserAnswers,
    options: [
      "ضغط الدم المرتفع", "السكري النوع 2", "أمراض الكبد", "أمراض الكلى",
      "أمراض القلب", "الغدة الدرقية", "الكوليسترول المرتفع", "التهاب المفاصل",
      "القولون العصبي", "الاكتئاب/القلق", "لا يوجد",
    ].map((h) => ({ id: h, label: h })),
  },
  {
    id: "allergies", title: "هل لديك أي حساسيات؟",
    subtitle: "نتجنب المكملات التي تحتوي على مسببات الحساسية",
    type: "multi", field: "allergies" as keyof UserAnswers,
    options: ["الغلوتين", "منتجات الألبان", "فول الصويا", "المكسرات", "المأكولات البحرية", "البيض", "لا يوجد"]
      .map((a) => ({ id: a, label: a })),
  },
  {
    id: "budget", title: "ما هي ميزانيتك الشهرية للمكملات؟",
    subtitle: "نختار المنتجات المناسبة لميزانيتك",
    type: "single", field: "budget" as keyof UserAnswers,
    options: [
      { id: "low", label: "اقتصادي (أقل من $50/شهر)" },
      { id: "medium", label: "متوسط ($50-150/شهر)" },
      { id: "high", label: "مرتفع ($150+/شهر)" },
    ],
  },
];

function buildCourse(answers: UserAnswers, products: Product[]): GeneratedCourse {
  const selectedProducts: CourseProduct[] = [];
  const warnings: string[] = [];
  const maxProducts = answers.budget === "low" ? 3 : answers.budget === "medium" ? 5 : 8;
  const addedCategories = new Set<string>();

  for (const goal of answers.goals) {
    if (selectedProducts.length >= maxProducts) break;
    if (addedCategories.has(goal)) continue;

    const categoryProducts = products
      .filter((p) => p.category === goal)
      .sort((a, b) => b.score - a.score);

    if (categoryProducts.length === 0) continue;
    addedCategories.add(goal);

    const bestProduct = categoryProducts[0];

    const timingMap: Record<string, string> = {
      sleep: "قبل النوم بـ 30 دقيقة",
      brain: "صباحاً مع الإفطار",
      vitamins: "مع وجبة الصباح",
      heart: "مع الوجبة الرئيسية",
      liver: "مع الوجبات",
      kidney: "مع الوجبات مع كمية كافية من الماء",
      mood: "صباحاً أو عند الحاجة",
      hormones: "مع وجبة الصباح",
      prostate: "مع الوجبة الرئيسية",
      metabolism: "قبل الوجبة الرئيسية بـ 15 دقيقة",
      longevity: "صباحاً مع الإفطار",
      general: "مع الوجبات",
    };

    const reasonMap: Record<string, string> = {
      liver: "لحماية الكبد ودعم وظائفه ومساعدته على التخلص من السموم",
      heart: "لدعم صحة القلب والأوعية الدموية وتحسين الدورة الدموية",
      kidney: "لدعم وظائف الكلى والحفاظ على صحة الجهاز البولي",
      brain: "لتحسين التركيز والذاكرة والأداء الذهني",
      mood: "لتخفيف التوتر وتحسين المزاج والصحة النفسية",
      hormones: "لدعم التوازن الهرموني وتحسين مستويات الطاقة",
      prostate: "لصحة البروستاتا والجهاز البولي التناسلي",
      sleep: "لتحسين جودة النوم والتعافي الليلي",
      vitamins: "لتعويض النقص الغذائي وتعزيز المناعة والصحة العامة",
      metabolism: "لتنظيم مستوى السكر في الدم وتحسين التمثيل الغذائي",
      longevity: "لمكافحة الشيخوخة الخلوية وتحسين طول العمر الصحي",
      general: "لتعزيز الصحة العامة والمناعة والحيوية",
    };

    const idx = answers.goals.indexOf(goal);
    const priority: "أساسي" | "مكمّل" | "اختياري" =
      idx < 2 ? "أساسي" : idx < 4 ? "مكمّل" : "اختياري";

    selectedProducts.push({
      product: bestProduct,
      timing: timingMap[goal] || "مع الوجبات",
      duration: "3 أشهر",
      priority,
      reason: reasonMap[goal] || "بناءً على أهدافك الصحية",
    });
  }

  if (answers.healthConditions.includes("أمراض الكبد"))
    warnings.push("⚠️ استشر طبيبك قبل استخدام أي مكمل بسبب وجود أمراض الكبد");
  if (answers.healthConditions.includes("أمراض الكلى"))
    warnings.push("⚠️ تجنب الجرعات العالية من فيتامين C والبروتين مع أمراض الكلى");
  if (answers.healthConditions.includes("ضغط الدم المرتفع"))
    warnings.push("⚠️ بعض المكملات قد تؤثر على ضغط الدم - راجع طبيبك");
  if (answers.healthConditions.includes("السكري النوع 2"))
    warnings.push("⚠️ راقب مستوى السكر عند استخدام Berberine أو Chromium");
  if (answers.healthConditions.includes("أمراض القلب"))
    warnings.push("⚠️ استشر طبيب القلب قبل استخدام مكملات الطاقة أو CoQ10 بجرعات عالية");

  const goalLabels = answers.goals.map((g) => GOALS.find((gl) => gl.id === g)?.label || g);

  return {
    title: `كورس ${goalLabels.slice(0, 2).join(" و")}`,
    duration: "3 أشهر",
    goals: goalLabels,
    products: selectedProducts,
    warnings,
    notes: "هذا الكورس مصمم خصيصاً لك بناءً على أهدافك وحالتك الصحية. يُنصح بمراجعة الطبيب قبل البدء خاصةً إذا كنت تتناول أدوية.",
    createdAt: new Date().toLocaleDateString("ar-SA"),
  };
}

export default function CoursesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { products } = useSupplements();

  const [step, setStep] = useState<"goals" | "questions" | "result">("goals");
  const [questionStep, setQuestionStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({
    goals: [], age: "", gender: "", activityLevel: "",
    healthConditions: [], allergies: [], experienceLevel: "", budget: "",
  });
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [savedCourses, setSavedCourses] = useState<GeneratedCourse[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("saved_courses").then((v) => {
      if (v) setSavedCourses(JSON.parse(v));
    }).catch(() => {});
  }, []);

  function toggleGoal(id: string) {
    setAnswers((prev) => ({
      ...prev,
      goals: prev.goals.includes(id) ? prev.goals.filter((g) => g !== id) : [...prev.goals, id],
    }));
  }

  function toggleMulti(field: "healthConditions" | "allergies", value: string) {
    setAnswers((prev) => {
      const arr = prev[field];
      if (value === "لا يوجد") return { ...prev, [field]: ["لا يوجد"] };
      const filtered = arr.filter((v) => v !== "لا يوجد");
      return {
        ...prev,
        [field]: filtered.includes(value) ? filtered.filter((v) => v !== value) : [...filtered, value],
      };
    });
  }

  function resetAll() {
    setStep("goals");
    setQuestionStep(0);
    setAnswers({ goals: [], age: "", gender: "", activityLevel: "", healthConditions: [], allergies: [], experienceLevel: "", budget: "" });
    setGeneratedCourse(null);
  }

  async function saveCourse(course: GeneratedCourse) {
    try {
      const updated = [course, ...savedCourses];
      await AsyncStorage.setItem("saved_courses", JSON.stringify(updated));
      setSavedCourses(updated);
      Alert.alert("✅ تم الحفظ", "تم حفظ الكورس بنجاح في مكتبتك");
    } catch {}
  }

  // ── GOALS STEP
  if (step === "goals") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>بناء كورس مخصص</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>اختر أهدافك الصحية (يمكن اختيار أكثر من هدف)</Text>
        </View>
        <ScrollView contentContainerStyle={styles.goalsContent} showsVerticalScrollIndicator={false}>
          <View style={styles.goalsGrid}>
            {GOALS.map((goal) => {
              const isSelected = answers.goals.includes(goal.id);
              return (
                <Pressable
                  key={goal.id}
                  style={({ pressed }) => [
                    styles.goalCard,
                    { backgroundColor: isSelected ? goal.color + "25" : colors.card },
                    { borderColor: isSelected ? goal.color : colors.border },
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() => toggleGoal(goal.id)}
                >
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: goal.color }]}>
                      <IconSymbol name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                  <View style={[styles.goalIcon, { backgroundColor: goal.color + "20" }]}>
                    <IconSymbol name={goal.icon as any} size={24} color={goal.color} />
                  </View>
                  <Text style={[styles.goalLabel, { color: colors.foreground }]}>{goal.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <View style={[styles.footer, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 16, borderTopColor: colors.border }]}>
          <Text style={[styles.selectedCount, { color: colors.muted }]}>
            {answers.goals.length > 0 ? `${answers.goals.length} هدف محدد` : "لم تحدد أي هدف بعد"}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: answers.goals.length > 0 ? colors.primary : colors.border },
              pressed && { opacity: 0.8 },
            ]}
            disabled={answers.goals.length === 0}
            onPress={() => setStep("questions")}
          >
            <Text style={[styles.nextBtnText, { color: answers.goals.length > 0 ? "#fff" : colors.muted }]}>
              التالي — الأسئلة التخصصية
            </Text>
            <IconSymbol name="chevron.left" size={18} color={answers.goals.length > 0 ? "#fff" : colors.muted} />
          </Pressable>
        </View>
      </View>
    );
  }

  // ── QUESTIONS STEP
  if (step === "questions") {
    const currentQ = QUESTIONS[questionStep];
    const progress = ((questionStep + 1) / QUESTIONS.length) * 100;
    const val = answers[currentQ.field];
    const isAnswered = Array.isArray(val) ? val.length > 0 : val !== "";

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.progressRow}>
            <Pressable onPress={() => questionStep === 0 ? setStep("goals") : setQuestionStep((s) => s - 1)}>
              <IconSymbol name="chevron.right" size={22} color={colors.foreground} />
            </Pressable>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${progress}%` as any }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.muted }]}>{questionStep + 1}/{QUESTIONS.length}</Text>
          </View>
          <Text style={[styles.questionTitle, { color: colors.foreground }]}>{currentQ.title}</Text>
          <Text style={[styles.questionSub, { color: colors.muted }]}>{currentQ.subtitle}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.optionsContent} showsVerticalScrollIndicator={false}>
          {currentQ.options.map((opt) => {
            const isSelected = Array.isArray(val) ? val.includes(opt.id) : val === opt.id;
            return (
              <Pressable
                key={opt.id}
                style={({ pressed }) => [
                  styles.optionCard,
                  { backgroundColor: isSelected ? colors.primary + "20" : colors.card },
                  { borderColor: isSelected ? colors.primary : colors.border },
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => {
                  if (currentQ.type === "single") {
                    setAnswers((prev) => ({ ...prev, [currentQ.field]: opt.id }));
                  } else {
                    toggleMulti(currentQ.field as "healthConditions" | "allergies", opt.id);
                  }
                }}
              >
                <Text style={[styles.optionText, { color: isSelected ? colors.primary : colors.foreground }]}>{opt.label}</Text>
                {isSelected && <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />}
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={[styles.footer, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 16, borderTopColor: colors.border }]}>
          <Pressable
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: isAnswered ? colors.primary : colors.border },
              pressed && { opacity: 0.8 },
            ]}
            disabled={!isAnswered}
            onPress={() => {
              if (questionStep < QUESTIONS.length - 1) {
                setQuestionStep((s) => s + 1);
              } else {
                const course = buildCourse(answers, products);
                setGeneratedCourse(course);
                setStep("result");
              }
            }}
          >
            <Text style={[styles.nextBtnText, { color: isAnswered ? "#fff" : colors.muted }]}>
              {questionStep < QUESTIONS.length - 1 ? "التالي" : "إنشاء الكورس"}
            </Text>
            <IconSymbol name={questionStep < QUESTIONS.length - 1 ? "chevron.left" : "sparkles"} size={18} color={isAnswered ? "#fff" : colors.muted} />
          </Pressable>
        </View>
      </View>
    );
  }

  // ── RESULT STEP
  if (step === "result" && generatedCourse) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.resultHeaderRow}>
            <Pressable onPress={resetAll}>
              <IconSymbol name="xmark" size={22} color={colors.muted} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>كورسك المخصص</Text>
            <Pressable onPress={() => saveCourse(generatedCourse)}>
              <IconSymbol name="bookmark" size={22} color={colors.primary} />
            </Pressable>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.courseSummary, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}>
            <IconSymbol name="graduationcap.fill" size={32} color={colors.primary} />
            <Text style={[styles.courseTitle, { color: colors.foreground }]}>{generatedCourse.title}</Text>
            <Text style={[styles.courseDuration, { color: colors.primary }]}>المدة: {generatedCourse.duration}</Text>
            <View style={styles.goalsRow}>
              {generatedCourse.goals.map((g, i) => (
                <View key={i} style={[styles.goalTag, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.goalTagText, { color: colors.muted }]}>{g}</Text>
                </View>
              ))}
            </View>
          </View>

          {generatedCourse.warnings.length > 0 && (
            <View style={[styles.warningBox, { backgroundColor: colors.warning + "15", borderColor: colors.warning + "40" }]}>
              <Text style={[styles.warningTitle, { color: colors.warning }]}>تحذيرات مهمة</Text>
              {generatedCourse.warnings.map((w, i) => (
                <Text key={i} style={[styles.warningText, { color: colors.foreground }]}>{w}</Text>
              ))}
            </View>
          )}

          <Text style={[styles.productsTitle, { color: colors.foreground }]}>المنتجات الموصى بها</Text>
          {generatedCourse.products.map((cp, i) => {
            const catColor = CATEGORY_COLORS[cp.product.category] || "#64748B";
            const catIcon = CATEGORY_ICONS[cp.product.category] || "pills.fill";
            const priorityColor = cp.priority === "أساسي" ? colors.success : cp.priority === "مكمّل" ? colors.primary : colors.muted;
            return (
              <Pressable
                key={i}
                style={({ pressed }) => [
                  styles.courseProductCard,
                  { backgroundColor: colors.card, borderColor: catColor + "40" },
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: cp.product.id } })}
              >
                <View style={styles.cpHeader}>
                  <View style={[styles.cpIcon, { backgroundColor: catColor + "20" }]}>
                    <IconSymbol name={catIcon as any} size={24} color={catColor} />
                  </View>
                  <View style={styles.cpInfo}>
                    <Text style={[styles.cpName, { color: colors.foreground }]}>{cp.product.name_en}</Text>
                    <Text style={[styles.cpBrand, { color: colors.muted }]}>{cp.product.brand}</Text>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: priorityColor + "20" }]}>
                    <Text style={[styles.priorityText, { color: priorityColor }]}>{cp.priority}</Text>
                  </View>
                </View>
                <Text style={[styles.cpReason, { color: colors.muted }]}>{cp.reason}</Text>
                <View style={styles.cpMeta}>
                  <View style={[styles.cpMetaItem, { backgroundColor: colors.surface }]}>
                    <IconSymbol name="clock.fill" size={12} color={colors.muted} />
                    <Text style={[styles.cpMetaText, { color: colors.muted }]}>{cp.timing}</Text>
                  </View>
                  <View style={[styles.cpMetaItem, { backgroundColor: colors.surface }]}>
                    <IconSymbol name="calendar" size={12} color={colors.muted} />
                    <Text style={[styles.cpMetaText, { color: colors.muted }]}>{cp.duration}</Text>
                  </View>
                  <View style={[styles.cpMetaItem, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.cpMetaText, { color: colors.primary }]}>{cp.product.price}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

          <View style={[styles.notesBox, { backgroundColor: colors.secondary + "15", borderColor: colors.secondary + "40" }]}>
            <IconSymbol name="info.circle" size={18} color={colors.secondary} />
            <Text style={[styles.notesText, { color: colors.foreground }]}>{generatedCourse.notes}</Text>
          </View>

          <View style={styles.actionBtns}>
            <Pressable
              style={({ pressed }) => [styles.saveBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.8 }]}
              onPress={() => saveCourse(generatedCourse)}
            >
              <IconSymbol name="bookmark.fill" size={18} color="#fff" />
              <Text style={[styles.saveBtnText, { color: "#fff" }]}>حفظ الكورس</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.resetBtn, { backgroundColor: colors.card, borderColor: colors.border }, pressed && { opacity: 0.8 }]}
              onPress={resetAll}
            >
              <IconSymbol name="arrow.clockwise" size={18} color={colors.muted} />
              <Text style={[styles.resetBtnText, { color: colors.muted }]}>إنشاء كورس جديد</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 13, marginTop: 4, textAlign: "right" },
  goalsContent: { padding: 16 },
  goalsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  goalCard: {
    width: "47%", borderRadius: 14, padding: 14, alignItems: "center",
    borderWidth: 1.5, gap: 8, position: "relative",
  },
  checkBadge: {
    position: "absolute", top: 8, left: 8,
    width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center",
  },
  goalIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  goalLabel: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  footer: { paddingHorizontal: 20, paddingTop: 12, gap: 8, borderTopWidth: 0.5 },
  selectedCount: { fontSize: 13, textAlign: "right" },
  nextBtn: {
    flexDirection: "row-reverse", alignItems: "center", justifyContent: "center",
    borderRadius: 14, paddingVertical: 14, gap: 8,
  },
  nextBtnText: { fontSize: 16, fontWeight: "700" },
  progressRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginBottom: 12 },
  progressBar: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: "600" },
  questionTitle: { fontSize: 18, fontWeight: "700", textAlign: "right" },
  questionSub: { fontSize: 13, marginTop: 4, textAlign: "right" },
  optionsContent: { padding: 16, gap: 10 },
  optionCard: {
    flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between",
    borderRadius: 12, padding: 14, borderWidth: 1.5,
  },
  optionText: { fontSize: 15, fontWeight: "500" },
  resultHeaderRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  resultContent: { padding: 16, gap: 16 },
  courseSummary: {
    borderRadius: 16, padding: 20, alignItems: "center", gap: 8, borderWidth: 1,
  },
  courseTitle: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  courseDuration: { fontSize: 14, fontWeight: "600" },
  goalsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6, justifyContent: "center" },
  goalTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  goalTagText: { fontSize: 11 },
  warningBox: { borderRadius: 12, padding: 14, gap: 6, borderWidth: 1 },
  warningTitle: { fontSize: 14, fontWeight: "700", textAlign: "right" },
  warningText: { fontSize: 13, textAlign: "right", lineHeight: 20 },
  productsTitle: { fontSize: 18, fontWeight: "700", textAlign: "right" },
  courseProductCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  cpHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  cpIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cpInfo: { flex: 1, alignItems: "flex-end" },
  cpName: { fontSize: 14, fontWeight: "700" },
  cpBrand: { fontSize: 11, marginTop: 2 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: "700" },
  cpReason: { fontSize: 12, textAlign: "right", lineHeight: 18 },
  cpMeta: { flexDirection: "row-reverse", gap: 6, flexWrap: "wrap" },
  cpMetaItem: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cpMetaText: { fontSize: 11 },
  notesBox: { borderRadius: 12, padding: 14, flexDirection: "row-reverse", gap: 10, borderWidth: 1 },
  notesText: { flex: 1, fontSize: 12, textAlign: "right", lineHeight: 18 },
  actionBtns: { gap: 10 },
  saveBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 14, gap: 8 },
  saveBtnText: { fontSize: 16, fontWeight: "700" },
  resetBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1 },
  resetBtnText: { fontSize: 15, fontWeight: "600" },
});
