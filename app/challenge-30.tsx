import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  I18nManager,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

I18nManager.forceRTL(true);

interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  dailyTasks: string[];
}

const CHALLENGES: Challenge[] = [
  {
    id: "immunity",
    title: "تقوية المناعة",
    description: "30 يوماً لبناء مناعة قوية ومستدامة",
    emoji: "🛡️",
    color: "#0ea5e9",
    dailyTasks: [
      "تناول فيتامين د3 (2000 وحدة)",
      "تناول فيتامين ج (500 ملغ)",
      "تناول الزنك (15 ملغ)",
      "شرب 8 أكواب ماء",
      "النوم 7-8 ساعات",
    ],
  },
  {
    id: "energy",
    title: "تعزيز الطاقة",
    description: "30 يوماً لمستويات طاقة مثلى طوال اليوم",
    emoji: "⚡",
    color: "#f59e0b",
    dailyTasks: [
      "تناول مجمع فيتامين ب",
      "تناول الكيو-10 (100 ملغ)",
      "تناول الحديد إذا كان منخفضاً",
      "ممارسة 20 دقيقة رياضة",
      "تجنب السكر المكرر",
    ],
  },
  {
    id: "brain",
    title: "تحسين التركيز",
    description: "30 يوماً لعقل أحد وذاكرة أقوى",
    emoji: "🧠",
    color: "#8b5cf6",
    dailyTasks: [
      "تناول أوميغا-3 (1000 ملغ DHA)",
      "تناول مغنيسيوم ثريونات",
      "القراءة 20 دقيقة",
      "تجنب الشاشات قبل النوم بساعة",
      "التأمل 10 دقائق",
    ],
  },
  {
    id: "sleep",
    title: "تحسين النوم",
    description: "30 يوماً لنوم عميق ومريح",
    emoji: "😴",
    color: "#10b981",
    dailyTasks: [
      "تناول المغنيسيوم قبل النوم بساعة",
      "تناول الميلاتونين (0.5-1 ملغ)",
      "النوم في نفس الوقت يومياً",
      "إيقاف الشاشات قبل النوم بساعة",
      "إبقاء الغرفة باردة ومظلمة",
    ],
  },
  {
    id: "muscle",
    title: "بناء العضلات",
    description: "30 يوماً لبداية رحلة بناء الجسم",
    emoji: "💪",
    color: "#3b82f6",
    dailyTasks: [
      "تناول الكرياتين (5 غرام)",
      "تناول بروتين كافٍ (1.6-2 غرام/كغ)",
      "تمرين المقاومة 45 دقيقة",
      "شرب 3 لترات ماء",
      "النوم 8 ساعات للتعافي",
    ],
  },
];

interface ChallengeState {
  challengeId: string;
  startDate: string;
  completedDays: number[];
}

export default function Challenge30Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [state, setState] = useState<ChallengeState | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [view, setView] = useState<"select" | "active">("select");

  useEffect(() => {
    loadState();
  }, []);

  async function loadState() {
    const raw = await AsyncStorage.getItem("challenge_30_state");
    if (raw) {
      const s: ChallengeState = JSON.parse(raw);
      setState(s);
      const ch = CHALLENGES.find((c) => c.id === s.challengeId);
      if (ch) {
        setSelectedChallenge(ch);
        setView("active");
      }
    }
  }

  async function startChallenge(ch: Challenge) {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const newState: ChallengeState = {
      challengeId: ch.id,
      startDate: new Date().toISOString().split("T")[0],
      completedDays: [],
    };
    await AsyncStorage.setItem("challenge_30_state", JSON.stringify(newState));
    setState(newState);
    setSelectedChallenge(ch);
    setView("active");
  }

  async function toggleDay(day: number) {
    if (!state) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const updated = state.completedDays.includes(day)
      ? state.completedDays.filter((d) => d !== day)
      : [...state.completedDays, day];
    const newState = { ...state, completedDays: updated };
    setState(newState);
    await AsyncStorage.setItem("challenge_30_state", JSON.stringify(newState));
  }

  async function resetChallenge() {
    Alert.alert(
      "إعادة التحدي",
      "هل تريد إعادة بدء التحدي؟ سيتم حذف تقدمك الحالي.",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "إعادة البدء",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("challenge_30_state");
            setState(null);
            setSelectedChallenge(null);
            setView("select");
          },
        },
      ]
    );
  }

  const todayDay = state
    ? Math.min(
        30,
        Math.floor(
          (new Date().getTime() - new Date(state.startDate).getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      )
    : 0;

  const completedCount = state?.completedDays.length ?? 0;
  const progressPct = (completedCount / 30) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
          تحدي 30 يوم
        </Text>
        {view === "active" && (
          <Pressable onPress={resetChallenge} style={styles.resetBtn}>
            <Text style={{ fontSize: 18 }}>🔄</Text>
          </Pressable>
        )}
        {view === "select" && <View style={{ width: 40 }} />}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {view === "select" ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
              اختر تحديك لـ 30 يوماً
            </Text>
            {CHALLENGES.map((ch) => (
              <Pressable
                key={ch.id}
                onPress={() => startChallenge(ch)}
                style={({ pressed }) => [
                  styles.challengeCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: ch.color + "66",
                    borderWidth: 2,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={[styles.challengeIcon, { backgroundColor: ch.color + "22" }]}>
                  <Text style={styles.challengeEmoji}>{ch.emoji}</Text>
                </View>
                <View style={styles.challengeInfo}>
                  <Text style={[styles.challengeTitle, { color: ch.color, fontFamily: "Cairo-Black" }]}>
                    {ch.title}
                  </Text>
                  <Text style={[styles.challengeDesc, { color: colors.muted, fontFamily: "Cairo" }]}>
                    {ch.description}
                  </Text>
                  <Text style={[styles.challengeTasks, { color: colors.foreground, fontFamily: "Cairo" }]}>
                    {ch.dailyTasks.length} مهمة يومية
                  </Text>
                </View>
                <Text style={{ color: ch.color, fontSize: 20 }}>←</Text>
              </Pressable>
            ))}
          </>
        ) : selectedChallenge && state ? (
          <>
            {/* Progress */}
            <View style={[styles.progressCard, { backgroundColor: selectedChallenge.color + "18", borderColor: selectedChallenge.color + "44" }]}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressEmoji}>{selectedChallenge.emoji}</Text>
                <View style={styles.progressInfo}>
                  <Text style={[styles.progressTitle, { color: selectedChallenge.color, fontFamily: "Cairo-Black" }]}>
                    {selectedChallenge.title}
                  </Text>
                  <Text style={[styles.progressSub, { color: colors.muted, fontFamily: "Cairo" }]}>
                    اليوم {todayDay} من 30
                  </Text>
                </View>
                <Text style={[styles.progressPct, { color: selectedChallenge.color, fontFamily: "Cairo-Black" }]}>
                  {Math.round(progressPct)}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: selectedChallenge.color }]} />
              </View>
              <Text style={[styles.progressCount, { color: colors.muted, fontFamily: "Cairo" }]}>
                {completedCount} يوم مكتمل من 30
              </Text>
            </View>

            {/* Daily tasks */}
            <View style={[styles.tasksCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.tasksTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                المهام اليومية
              </Text>
              {selectedChallenge.dailyTasks.map((task, i) => (
                <View key={i} style={[styles.taskItem, { borderColor: colors.border }]}>
                  <View style={[styles.taskDot, { backgroundColor: selectedChallenge.color }]} />
                  <Text style={[styles.taskText, { color: colors.foreground, fontFamily: "Cairo" }]}>
                    {task}
                  </Text>
                </View>
              ))}
            </View>

            {/* Days grid */}
            <Text style={[styles.daysTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
              تتبع الأيام
            </Text>
            <View style={styles.daysGrid}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const isCompleted = state.completedDays.includes(day);
                const isToday = day === todayDay;
                const isFuture = day > todayDay;
                return (
                  <Pressable
                    key={day}
                    onPress={() => !isFuture && toggleDay(day)}
                    style={({ pressed }) => [
                      styles.dayBtn,
                      {
                        backgroundColor: isCompleted
                          ? selectedChallenge.color
                          : isToday
                          ? selectedChallenge.color + "33"
                          : colors.surface,
                        borderColor: isToday ? selectedChallenge.color : colors.border,
                        borderWidth: isToday ? 2 : 1,
                        opacity: isFuture ? 0.4 : pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.dayNum, {
                      color: isCompleted ? "#fff" : isToday ? selectedChallenge.color : colors.muted,
                      fontFamily: "Cairo-Bold",
                    }]}>
                      {isCompleted ? "✓" : day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {completedCount === 30 && (
              <View style={[styles.completedBanner, { backgroundColor: colors.success + "22", borderColor: colors.success }]}>
                <Text style={styles.completedEmoji}>🏆</Text>
                <Text style={[styles.completedText, { color: colors.success, fontFamily: "Cairo-Black" }]}>
                  مبروك! أكملت التحدي بنجاح!
                </Text>
              </View>
            )}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontFamily: "Cairo-Black" },
  resetBtn: { padding: 8 },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  sectionTitle: { fontSize: 20, fontFamily: "Cairo-Black", textAlign: "right" },
  challengeCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  challengeIcon: { width: 56, height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  challengeEmoji: { fontSize: 28 },
  challengeInfo: { flex: 1, alignItems: "flex-end", gap: 3 },
  challengeTitle: { fontSize: 16, fontFamily: "Cairo-Black" },
  challengeDesc: { fontSize: 12, fontFamily: "Cairo", textAlign: "right" },
  challengeTasks: { fontSize: 11, fontFamily: "Cairo" },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  progressHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  progressEmoji: { fontSize: 36 },
  progressInfo: { flex: 1, alignItems: "flex-end" },
  progressTitle: { fontSize: 18, fontFamily: "Cairo-Black" },
  progressSub: { fontSize: 12, fontFamily: "Cairo" },
  progressPct: { fontSize: 24, fontFamily: "Cairo-Black" },
  progressBar: { height: 10, borderRadius: 5, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 5 },
  progressCount: { fontSize: 12, fontFamily: "Cairo", textAlign: "center" },
  tasksCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  tasksTitle: { fontSize: 15, fontFamily: "Cairo-Bold", textAlign: "right" },
  taskItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  taskDot: { width: 8, height: 8, borderRadius: 4 },
  taskText: { flex: 1, fontSize: 13, fontFamily: "Cairo", textAlign: "right" },
  daysTitle: { fontSize: 15, fontFamily: "Cairo-Bold", textAlign: "right" },
  daysGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  dayBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNum: { fontSize: 14, fontFamily: "Cairo-Bold" },
  completedBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  completedEmoji: { fontSize: 32 },
  completedText: { fontSize: 18, fontFamily: "Cairo-Black" },
});
