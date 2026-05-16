import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
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
const { width: SCREEN_W } = Dimensions.get("window");

interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: number; // 1-5
  energy: number; // 1-5
  focus: number; // 1-5
  sleep: number; // 1-5
  note?: string;
}

const MOOD_LABELS = ["سيء جداً", "سيء", "عادي", "جيد", "ممتاز"];
const MOOD_EMOJIS = ["😞", "😕", "😐", "😊", "😄"];
const ENERGY_LABELS = ["منهك", "متعب", "عادي", "نشيط", "مفعم بالطاقة"];
const FOCUS_LABELS = ["مشتت جداً", "مشتت", "عادي", "مركّز", "مركّز جداً"];
const SLEEP_LABELS = ["أقل من 4 ساعات", "4-5 ساعات", "6-7 ساعات", "7-8 ساعات", "أكثر من 8 ساعات"];

const METRIC_COLORS = {
  mood: "#8b5cf6",
  energy: "#f59e0b",
  focus: "#3b82f6",
  sleep: "#10b981",
};

export default function MoodTrackerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<MoodEntry>({
    date: new Date().toISOString().split("T")[0],
    mood: 3,
    energy: 3,
    focus: 3,
    sleep: 3,
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"log" | "history">("log");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const raw = await AsyncStorage.getItem("mood_entries");
      const all: MoodEntry[] = raw ? JSON.parse(raw) : [];
      setEntries(all);
      const today = new Date().toISOString().split("T")[0];
      const todayData = all.find((e) => e.date === today);
      if (todayData) {
        setTodayEntry(todayData);
        setSaved(true);
      }
    } catch {}
  }

  async function saveToday() {
    try {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      const today = new Date().toISOString().split("T")[0];
      const updated = entries.filter((e) => e.date !== today);
      updated.unshift({ ...todayEntry, date: today });
      await AsyncStorage.setItem("mood_entries", JSON.stringify(updated));
      setEntries(updated);
      setSaved(true);
    } catch {}
  }

  function setMetric(key: keyof MoodEntry, val: number) {
    setTodayEntry((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  }

  function avg(arr: number[]) {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  const last7 = entries.slice(0, 7).reverse();
  const avgMood = avg(last7.map((e) => e.mood));
  const avgEnergy = avg(last7.map((e) => e.energy));
  const avgFocus = avg(last7.map((e) => e.focus));
  const avgSleep = avg(last7.map((e) => e.sleep));

  function ScaleSelector({
    value,
    onChange,
    labels,
    emojis,
    color,
  }: {
    value: number;
    onChange: (v: number) => void;
    labels: string[];
    emojis?: string[];
    color: string;
  }) {
    return (
      <View style={styles.scaleRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            style={({ pressed }) => [
              styles.scaleBtn,
              {
                backgroundColor: value === n ? color : colors.surface,
                borderColor: value === n ? color : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            {emojis ? (
              <Text style={styles.scaleEmoji}>{emojis[n - 1]}</Text>
            ) : (
              <Text style={[styles.scaleNum, { color: value === n ? "#fff" : colors.muted, fontFamily: "Cairo-Bold" }]}>
                {n}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    );
  }

  function MiniBar({ value, color }: { value: number; color: string }) {
    const pct = (value - 1) / 4;
    return (
      <View style={[styles.miniBarBg, { backgroundColor: colors.border }]}>
        <View style={[styles.miniBarFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
          تتبع المزاج والطاقة
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(["log", "history"] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.muted, fontFamily: activeTab === tab ? "Cairo-Bold" : "Cairo" }]}>
              {tab === "log" ? "تسجيل اليوم" : "السجل والإحصائيات"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "log" ? (
          <>
            {/* Date */}
            <View style={[styles.dateCard, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "33" }]}>
              <Text style={styles.dateEmoji}>📅</Text>
              <Text style={[styles.dateText, { color: colors.primary, fontFamily: "Cairo-Bold" }]}>
                {new Date().toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </Text>
              {saved && <Text style={styles.savedBadge}>✓ محفوظ</Text>}
            </View>

            {/* Mood */}
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.metricHeader}>
                <Text style={[styles.metricTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>المزاج</Text>
                <Text style={[styles.metricValue, { color: METRIC_COLORS.mood, fontFamily: "Cairo-Black" }]}>
                  {MOOD_EMOJIS[todayEntry.mood - 1]} {MOOD_LABELS[todayEntry.mood - 1]}
                </Text>
              </View>
              <ScaleSelector
                value={todayEntry.mood}
                onChange={(v) => setMetric("mood", v)}
                labels={MOOD_LABELS}
                emojis={MOOD_EMOJIS}
                color={METRIC_COLORS.mood}
              />
            </View>

            {/* Energy */}
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.metricHeader}>
                <Text style={[styles.metricTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>مستوى الطاقة</Text>
                <Text style={[styles.metricValue, { color: METRIC_COLORS.energy, fontFamily: "Cairo-Bold" }]}>
                  ⚡ {ENERGY_LABELS[todayEntry.energy - 1]}
                </Text>
              </View>
              <ScaleSelector
                value={todayEntry.energy}
                onChange={(v) => setMetric("energy", v)}
                labels={ENERGY_LABELS}
                color={METRIC_COLORS.energy}
              />
            </View>

            {/* Focus */}
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.metricHeader}>
                <Text style={[styles.metricTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>التركيز</Text>
                <Text style={[styles.metricValue, { color: METRIC_COLORS.focus, fontFamily: "Cairo-Bold" }]}>
                  🎯 {FOCUS_LABELS[todayEntry.focus - 1]}
                </Text>
              </View>
              <ScaleSelector
                value={todayEntry.focus}
                onChange={(v) => setMetric("focus", v)}
                labels={FOCUS_LABELS}
                color={METRIC_COLORS.focus}
              />
            </View>

            {/* Sleep */}
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.metricHeader}>
                <Text style={[styles.metricTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>النوم</Text>
                <Text style={[styles.metricValue, { color: METRIC_COLORS.sleep, fontFamily: "Cairo-Bold" }]}>
                  😴 {SLEEP_LABELS[todayEntry.sleep - 1]}
                </Text>
              </View>
              <ScaleSelector
                value={todayEntry.sleep}
                onChange={(v) => setMetric("sleep", v)}
                labels={SLEEP_LABELS}
                color={METRIC_COLORS.sleep}
              />
            </View>

            {/* Save button */}
            <Pressable
              onPress={saveToday}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: saved ? colors.success : colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={[styles.saveBtnText, { fontFamily: "Cairo-Black" }]}>
                {saved ? "✓ تم الحفظ" : "حفظ تسجيل اليوم"}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            {/* Stats summary */}
            {last7.length > 0 ? (
              <>
                <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.statsTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
                    متوسط آخر {last7.length} أيام
                  </Text>
                  {[
                    { label: "المزاج", value: avgMood, color: METRIC_COLORS.mood, emoji: "😊" },
                    { label: "الطاقة", value: avgEnergy, color: METRIC_COLORS.energy, emoji: "⚡" },
                    { label: "التركيز", value: avgFocus, color: METRIC_COLORS.focus, emoji: "🎯" },
                    { label: "النوم", value: avgSleep, color: METRIC_COLORS.sleep, emoji: "😴" },
                  ].map((m) => (
                    <View key={m.label} style={styles.statRow}>
                      <Text style={[styles.statLabel, { color: colors.foreground, fontFamily: "Cairo" }]}>
                        {m.emoji} {m.label}
                      </Text>
                      <View style={styles.statRight}>
                        <MiniBar value={m.value} color={m.color} />
                        <Text style={[styles.statNum, { color: m.color, fontFamily: "Cairo-Black" }]}>
                          {m.value.toFixed(1)}/5
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* History list */}
                <Text style={[styles.historyTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
                  السجل اليومي
                </Text>
                {entries.slice(0, 14).map((entry, i) => (
                  <View
                    key={i}
                    style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <Text style={[styles.historyDate, { color: colors.muted, fontFamily: "Cairo" }]}>
                      {new Date(entry.date).toLocaleDateString("ar-SA", { weekday: "short", day: "numeric", month: "short" })}
                    </Text>
                    <View style={styles.historyMetrics}>
                      <Text style={styles.historyEmoji}>{MOOD_EMOJIS[entry.mood - 1]}</Text>
                      <Text style={[styles.historyVal, { color: METRIC_COLORS.energy, fontFamily: "Cairo-Bold" }]}>⚡{entry.energy}</Text>
                      <Text style={[styles.historyVal, { color: METRIC_COLORS.focus, fontFamily: "Cairo-Bold" }]}>🎯{entry.focus}</Text>
                      <Text style={[styles.historyVal, { color: METRIC_COLORS.sleep, fontFamily: "Cairo-Bold" }]}>😴{entry.sleep}</Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📊</Text>
                <Text style={[styles.emptyText, { color: colors.muted, fontFamily: "Cairo" }]}>
                  لا يوجد سجل بعد. ابدأ بتسجيل مزاجك اليوم!
                </Text>
              </View>
            )}
          </>
        )}
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
  tabs: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 14, fontFamily: "Cairo" },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  dateCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  dateEmoji: { fontSize: 22 },
  dateText: { flex: 1, fontSize: 14, fontFamily: "Cairo-Bold", textAlign: "right" },
  savedBadge: { fontSize: 12, color: "#10b981", fontFamily: "Cairo-Bold" },
  metricCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  metricHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricTitle: { fontSize: 15, fontFamily: "Cairo-Bold" },
  metricValue: { fontSize: 13, fontFamily: "Cairo-Bold" },
  scaleRow: { flexDirection: "row-reverse", gap: 8, justifyContent: "center" },
  scaleBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  scaleEmoji: { fontSize: 24 },
  scaleNum: { fontSize: 18, fontFamily: "Cairo-Black" },
  saveBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { fontSize: 16, color: "#fff", fontFamily: "Cairo-Black" },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  statsTitle: { fontSize: 16, fontFamily: "Cairo-Black", textAlign: "right" },
  statRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  statLabel: { fontSize: 13, fontFamily: "Cairo", width: 90, textAlign: "right" },
  statRight: { flex: 1, flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  miniBarBg: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  miniBarFill: { height: "100%", borderRadius: 4 },
  statNum: { fontSize: 13, fontFamily: "Cairo-Black", width: 36, textAlign: "center" },
  historyTitle: { fontSize: 16, fontFamily: "Cairo-Black", textAlign: "right" },
  historyItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  historyDate: { fontSize: 12, fontFamily: "Cairo" },
  historyMetrics: { flexDirection: "row-reverse", gap: 10, alignItems: "center" },
  historyEmoji: { fontSize: 20 },
  historyVal: { fontSize: 13, fontFamily: "Cairo-Bold" },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 14, fontFamily: "Cairo", textAlign: "center" },
});
