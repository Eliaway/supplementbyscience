import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const GOALS = [
  { id: "energy", label: "تحسين الطاقة والحيوية", emoji: "⚡" },
  { id: "immunity", label: "تقوية المناعة", emoji: "🛡️" },
  { id: "muscle", label: "بناء العضلات", emoji: "💪" },
  { id: "sleep", label: "تحسين النوم", emoji: "😴" },
  { id: "brain", label: "تحسين التركيز والذاكرة", emoji: "🧠" },
  { id: "joints", label: "صحة المفاصل والعظام", emoji: "🦴" },
  { id: "heart", label: "صحة القلب والأوعية", emoji: "❤️" },
  { id: "skin", label: "صحة الجلد والشعر", emoji: "✨" },
  { id: "weight", label: "إدارة الوزن", emoji: "⚖️" },
  { id: "hormones", label: "توازن الهرمونات", emoji: "🔬" },
];

const AGE_GROUPS = [
  { id: "teen", label: "15-20 سنة" },
  { id: "young", label: "21-35 سنة" },
  { id: "adult", label: "36-50 سنة" },
  { id: "senior", label: "51+ سنة" },
];

const ACTIVITY_LEVELS = [
  { id: "low", label: "قليل النشاط", emoji: "🪑" },
  { id: "moderate", label: "نشاط معتدل", emoji: "🚶" },
  { id: "active", label: "نشيط", emoji: "🏃" },
  { id: "athlete", label: "رياضي محترف", emoji: "🏆" },
];

const HEALTH_CONDITIONS = [
  { id: "diabetes", label: "السكري" },
  { id: "hypertension", label: "ضغط الدم" },
  { id: "thyroid", label: "الغدة الدرقية" },
  { id: "anemia", label: "الأنيميا" },
  { id: "ibs", label: "القولون العصبي" },
  { id: "none", label: "لا يوجد" },
];

const STEPS = [
  { id: 1, title: "ما هدفك الرئيسي؟", subtitle: "اختر حتى 3 أهداف" },
  { id: 2, title: "ما فئتك العمرية؟", subtitle: "لتخصيص التوصيات" },
  { id: 3, title: "مستوى نشاطك البدني؟", subtitle: "يؤثر على احتياجاتك" },
  { id: 4, title: "هل لديك حالات صحية؟", subtitle: "لضمان سلامتك" },
  { id: 5, title: "ملفك الصحي جاهز! 🎉", subtitle: "سنخصّص التطبيق لك" },
];

export default function QuickSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  function toggleGoal(id: string) {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  function toggleCondition(id: string) {
    if (id === "none") {
      setSelectedConditions(["none"]);
      return;
    }
    setSelectedConditions((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev.filter((c) => c !== "none"), id]
    );
  }

  async function handleNext() {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save profile
      const profile = {
        goals: selectedGoals,
        ageGroup: selectedAge,
        activityLevel: selectedActivity,
        conditions: selectedConditions,
        setupComplete: true,
        setupDate: new Date().toISOString(),
      };
      await AsyncStorage.setItem("quick_setup_profile", JSON.stringify(profile));
      await AsyncStorage.setItem("setup_complete", "true");
      setStep(5);
    }
  }

  async function handleFinish() {
    router.replace("/(tabs)");
  }

  const canProceed =
    (step === 1 && selectedGoals.length > 0) ||
    (step === 2 && selectedAge !== "") ||
    (step === 3 && selectedActivity !== "") ||
    (step === 4 && selectedConditions.length > 0);

  const progress = (step / 5) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Progress bar */}
      <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: "#0ea5e9" }]} />
      </View>

      {/* Step indicator */}
      <View style={styles.stepRow}>
        <Text style={[styles.stepLabel, { color: colors.muted, fontFamily: "Cairo" }]}>
          {step < 5 ? `الخطوة ${step} من 4` : "مكتمل!"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={[styles.title, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
          {STEPS[step - 1].title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted, fontFamily: "Cairo" }]}>
          {STEPS[step - 1].subtitle}
        </Text>

        {/* Step 1: Goals */}
        {step === 1 && (
          <View style={styles.optionsGrid}>
            {GOALS.map((g) => (
              <Pressable
                key={g.id}
                onPress={() => toggleGoal(g.id)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: selectedGoals.includes(g.id) ? "#0ea5e9" : colors.surface,
                    borderColor: selectedGoals.includes(g.id) ? "#0ea5e9" : colors.border,
                  },
                ]}
              >
                <Text style={styles.optionEmoji}>{g.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    {
                      color: selectedGoals.includes(g.id) ? "#fff" : colors.foreground,
                      fontFamily: "Cairo-Bold",
                    },
                  ]}
                >
                  {g.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Step 2: Age */}
        {step === 2 && (
          <View style={styles.optionsList}>
            {AGE_GROUPS.map((a) => (
              <Pressable
                key={a.id}
                onPress={() => setSelectedAge(a.id)}
                style={[
                  styles.listOption,
                  {
                    backgroundColor: selectedAge === a.id ? "#0ea5e9" : colors.surface,
                    borderColor: selectedAge === a.id ? "#0ea5e9" : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.listOptionText,
                    {
                      color: selectedAge === a.id ? "#fff" : colors.foreground,
                      fontFamily: "Cairo-Bold",
                    },
                  ]}
                >
                  {a.label}
                </Text>
                {selectedAge === a.id && <Text style={styles.checkMark}>✓</Text>}
              </Pressable>
            ))}
          </View>
        )}

        {/* Step 3: Activity */}
        {step === 3 && (
          <View style={styles.optionsGrid}>
            {ACTIVITY_LEVELS.map((a) => (
              <Pressable
                key={a.id}
                onPress={() => setSelectedActivity(a.id)}
                style={[
                  styles.activityCard,
                  {
                    backgroundColor: selectedActivity === a.id ? "#0ea5e9" : colors.surface,
                    borderColor: selectedActivity === a.id ? "#0ea5e9" : colors.border,
                  },
                ]}
              >
                <Text style={styles.activityEmoji}>{a.emoji}</Text>
                <Text
                  style={[
                    styles.activityLabel,
                    {
                      color: selectedActivity === a.id ? "#fff" : colors.foreground,
                      fontFamily: "Cairo-Bold",
                    },
                  ]}
                >
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Step 4: Health conditions */}
        {step === 4 && (
          <View style={styles.optionsList}>
            {HEALTH_CONDITIONS.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => toggleCondition(c.id)}
                style={[
                  styles.listOption,
                  {
                    backgroundColor: selectedConditions.includes(c.id) ? "#0ea5e9" : colors.surface,
                    borderColor: selectedConditions.includes(c.id) ? "#0ea5e9" : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.listOptionText,
                    {
                      color: selectedConditions.includes(c.id) ? "#fff" : colors.foreground,
                      fontFamily: "Cairo-Bold",
                    },
                  ]}
                >
                  {c.label}
                </Text>
                {selectedConditions.includes(c.id) && <Text style={styles.checkMark}>✓</Text>}
              </Pressable>
            ))}
          </View>
        )}

        {/* Step 5: Summary */}
        {step === 5 && (
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.summaryTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
                ملخص ملفك الصحي
              </Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted, fontFamily: "Cairo" }]}>أهدافك:</Text>
                <Text style={[styles.summaryValue, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                  {selectedGoals.map((g) => GOALS.find((x) => x.id === g)?.label).join("، ")}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted, fontFamily: "Cairo" }]}>الفئة العمرية:</Text>
                <Text style={[styles.summaryValue, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                  {AGE_GROUPS.find((a) => a.id === selectedAge)?.label}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted, fontFamily: "Cairo" }]}>النشاط البدني:</Text>
                <Text style={[styles.summaryValue, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                  {ACTIVITY_LEVELS.find((a) => a.id === selectedActivity)?.label}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted, fontFamily: "Cairo" }]}>الحالات الصحية:</Text>
                <Text style={[styles.summaryValue, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                  {selectedConditions.map((c) => HEALTH_CONDITIONS.find((x) => x.id === c)?.label).join("، ")}
                </Text>
              </View>
            </View>
            <Text style={[styles.readyText, { color: colors.muted, fontFamily: "Cairo" }]}>
              سيستخدم التطبيق هذه المعلومات لتخصيص التوصيات والتحذيرات لك
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        {step < 5 ? (
          <Pressable
            onPress={handleNext}
            disabled={!canProceed}
            style={({ pressed }) => [
              styles.nextBtn,
              {
                backgroundColor: canProceed ? "#0ea5e9" : colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.nextBtnText, { fontFamily: "Cairo-Bold" }]}>
              {step === 4 ? "إنشاء الملف الصحي" : "التالي"}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleFinish}
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: "#10b981", opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.nextBtnText, { fontFamily: "Cairo-Bold" }]}>
              ابدأ الاستخدام 🚀
            </Text>
          </Pressable>
        )}
        {step < 5 && (
          <Pressable onPress={handleFinish} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.muted, fontFamily: "Cairo" }]}>
              تخطّي الإعداد
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressBg: { height: 4, marginHorizontal: 0 },
  progressFill: { height: 4, borderRadius: 2 },
  stepRow: { alignItems: "flex-end", paddingHorizontal: 20, paddingTop: 12 },
  stepLabel: { fontSize: 12, fontFamily: "Cairo" },
  content: { padding: 20, gap: 16, paddingBottom: 120 },
  title: { fontSize: 26, fontFamily: "Cairo-Black", textAlign: "right", marginTop: 8 },
  subtitle: { fontSize: 14, fontFamily: "Cairo", textAlign: "right", marginBottom: 8 },
  optionsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  optionCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 4,
    minWidth: "45%",
    flex: 1,
  },
  optionEmoji: { fontSize: 24 },
  optionLabel: { fontSize: 13, fontFamily: "Cairo-Bold", textAlign: "center" },
  optionsList: { gap: 10 },
  listOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  listOptionText: { fontSize: 15, fontFamily: "Cairo-Bold" },
  checkMark: { fontSize: 18, color: "#fff" },
  activityCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 8,
  },
  activityEmoji: { fontSize: 32 },
  activityLabel: { fontSize: 13, fontFamily: "Cairo-Bold", textAlign: "center" },
  summaryContainer: { gap: 16 },
  summaryCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 12 },
  summaryTitle: { fontSize: 18, fontFamily: "Cairo-Black", textAlign: "right", marginBottom: 4 },
  summaryRow: { gap: 4, alignItems: "flex-end" },
  summaryLabel: { fontSize: 12, fontFamily: "Cairo" },
  summaryValue: { fontSize: 14, fontFamily: "Cairo-Bold", textAlign: "right" },
  readyText: { fontSize: 13, fontFamily: "Cairo", textAlign: "center", lineHeight: 22 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, gap: 8 },
  nextBtn: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  nextBtnText: { color: "#fff", fontSize: 16, fontFamily: "Cairo-Bold" },
  skipBtn: { alignItems: "center", padding: 8 },
  skipText: { fontSize: 13, fontFamily: "Cairo" },
});
