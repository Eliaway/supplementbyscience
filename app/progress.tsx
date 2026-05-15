/**
 * متابعة التقدم الصحي — Progress Tracking
 * Features #23 (متابعة التقدم برسوم بيانية), #24 (سجل الاستخدام), #51 (تقرير أسبوعي ذكي)
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, I18nManager, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface DailyLog {
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  sleep: 1 | 2 | 3 | 4 | 5;
  supplementsTaken: boolean;
  notes: string;
}

const STORAGE_KEY = "health_progress_logs";

const MOOD_LABELS = ["سيء جداً", "سيء", "عادي", "جيد", "ممتاز"];
const MOOD_COLORS = ["#EF4444", "#F97316", "#F59E0B", "#84CC16", "#10B981"];
const MOOD_EMOJIS = ["😞", "😕", "😐", "🙂", "😄"];

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [activeTab, setActiveTab] = useState<"log" | "history" | "report">("log");
  const [today] = useState(new Date().toISOString().split("T")[0]);
  const [todayLog, setTodayLog] = useState<DailyLog>({
    date: today,
    mood: 3,
    energy: 3,
    sleep: 3,
    supplementsTaken: false,
    notes: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        const parsed: DailyLog[] = JSON.parse(data);
        setLogs(parsed);
        const existing = parsed.find((l) => l.date === today);
        if (existing) { setTodayLog(existing); setSaved(true); }
      }
    });
  }, [today]);

  const saveLog = async () => {
    const updated = logs.filter((l) => l.date !== today);
    updated.push(todayLog);
    updated.sort((a, b) => b.date.localeCompare(a.date));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLogs(updated);
    setSaved(true);
    Alert.alert("✅ تم الحفظ", "تم تسجيل يومك الصحي بنجاح");
  };

  const last7 = logs.slice(0, 7);
  const avgMood = last7.length ? (last7.reduce((s, l) => s + l.mood, 0) / last7.length).toFixed(1) : "—";
  const avgEnergy = last7.length ? (last7.reduce((s, l) => s + l.energy, 0) / last7.length).toFixed(1) : "—";
  const avgSleep = last7.length ? (last7.reduce((s, l) => s + l.sleep, 0) / last7.length).toFixed(1) : "—";
  const adherence = last7.length ? Math.round((last7.filter((l) => l.supplementsTaken).length / last7.length) * 100) : 0;

  const RatingRow = ({ label, value, onChange, color }: { label: string; value: number; onChange: (v: 1 | 2 | 3 | 4 | 5) => void; color: string }) => (
    <View style={styles.ratingRow}>
      <Text style={[styles.ratingLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.ratingBtns}>
        {([1, 2, 3, 4, 5] as const).map((v) => (
          <Pressable key={v}
            style={[styles.ratingBtn, { backgroundColor: value >= v ? color : colors.surface, borderColor: value >= v ? color : colors.border }]}
            onPress={() => { onChange(v); setSaved(false); }}>
            <Text style={{ fontSize: 10, color: value >= v ? "#fff" : colors.muted, fontWeight: "700" }}>{v}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ fontSize: 18 }}>{MOOD_EMOJIS[value - 1]}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>متابعة التقدم الصحي</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{logs.length} يوم مسجل</Text>
        </View>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {([{ id: "log" as const, label: "اليوم" }, { id: "history" as const, label: "السجل" }, { id: "report" as const, label: "التقرير" }]).map((tab) => (
          <Pressable key={tab.id}
            style={[styles.tab, activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.id)}>
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {activeTab === "log" && (
          <>
            <View style={[styles.dateCard, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
              <IconSymbol name="calendar" size={18} color={colors.primary} />
              <Text style={[styles.dateText, { color: colors.primary }]}>تسجيل يوم: {today}</Text>
              {saved && <View style={[styles.savedBadge, { backgroundColor: colors.success + "20" }]}><Text style={[styles.savedText, { color: colors.success }]}>محفوظ ✓</Text></View>}
            </View>

            <RatingRow label="المزاج العام" value={todayLog.mood} onChange={(v) => setTodayLog((p) => ({ ...p, mood: v }))} color={MOOD_COLORS[todayLog.mood - 1]} />
            <RatingRow label="مستوى الطاقة" value={todayLog.energy} onChange={(v) => setTodayLog((p) => ({ ...p, energy: v }))} color="#F97316" />
            <RatingRow label="جودة النوم" value={todayLog.sleep} onChange={(v) => setTodayLog((p) => ({ ...p, sleep: v }))} color="#6366F1" />

            <Pressable
              style={[styles.supplementToggle, { backgroundColor: todayLog.supplementsTaken ? colors.success + "15" : colors.surface, borderColor: todayLog.supplementsTaken ? colors.success + "40" : colors.border }]}
              onPress={() => { setTodayLog((p) => ({ ...p, supplementsTaken: !p.supplementsTaken })); setSaved(false); }}
            >
              <IconSymbol name={todayLog.supplementsTaken ? "checkmark.circle.fill" : "circle"} size={22} color={todayLog.supplementsTaken ? colors.success : colors.muted} />
              <Text style={[styles.supplementToggleText, { color: todayLog.supplementsTaken ? colors.success : colors.foreground }]}>
                {todayLog.supplementsTaken ? "✅ أخذت مكملاتي اليوم" : "هل أخذت مكملاتك اليوم؟"}
              </Text>
            </Pressable>

            <View style={[styles.notesBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.notesLabel, { color: colors.muted }]}>ملاحظات اليوم (اختياري)</Text>
              <TextInput
                style={[styles.notesInput, { color: colors.foreground }]}
                placeholder="كيف تشعر؟ أي أعراض؟ تحسينات لاحظتها؟"
                placeholderTextColor={colors.muted}
                value={todayLog.notes}
                onChangeText={(t) => { setTodayLog((p) => ({ ...p, notes: t })); setSaved(false); }}
                multiline
                numberOfLines={3}
                textAlign="right"
              />
            </View>

            <Pressable style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={saveLog}>
              <IconSymbol name="checkmark.circle.fill" size={18} color="#fff" />
              <Text style={styles.saveBtnText}>حفظ تسجيل اليوم</Text>
            </Pressable>
          </>
        )}

        {activeTab === "history" && (
          <>
            {logs.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={40} color={colors.muted} />
                <Text style={[styles.emptyText, { color: colors.muted }]}>لا يوجد سجل بعد — ابدأ بتسجيل يومك الأول</Text>
              </View>
            ) : (
              logs.map((log) => (
                <View key={log.date} style={[styles.logCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.logHeader}>
                    <Text style={[styles.logDate, { color: colors.muted }]}>{log.date}</Text>
                    <Text style={{ fontSize: 20 }}>{MOOD_EMOJIS[log.mood - 1]}</Text>
                  </View>
                  <View style={styles.logStats}>
                    {[{ label: "مزاج", value: log.mood, color: MOOD_COLORS[log.mood - 1] }, { label: "طاقة", value: log.energy, color: "#F97316" }, { label: "نوم", value: log.sleep, color: "#6366F1" }].map((s) => (
                      <View key={s.label} style={[styles.logStat, { backgroundColor: s.color + "12" }]}>
                        <Text style={[styles.logStatValue, { color: s.color }]}>{s.value}/5</Text>
                        <Text style={[styles.logStatLabel, { color: colors.muted }]}>{s.label}</Text>
                      </View>
                    ))}
                    <View style={[styles.logStat, { backgroundColor: log.supplementsTaken ? colors.success + "12" : colors.error + "12" }]}>
                      <Text style={[styles.logStatValue, { color: log.supplementsTaken ? colors.success : colors.error }]}>{log.supplementsTaken ? "✓" : "✗"}</Text>
                      <Text style={[styles.logStatLabel, { color: colors.muted }]}>مكملات</Text>
                    </View>
                  </View>
                  {log.notes ? <Text style={[styles.logNotes, { color: colors.foreground }]}>{log.notes}</Text> : null}
                </View>
              ))
            )}
          </>
        )}

        {activeTab === "report" && (
          <>
            <View style={[styles.reportCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.reportTitle, { color: colors.foreground }]}>تقرير آخر 7 أيام</Text>
              {last7.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.muted }]}>سجّل على الأقل يوماً واحداً لرؤية التقرير</Text>
              ) : (
                <View style={styles.reportStats}>
                  {[
                    { label: "متوسط المزاج", value: avgMood, icon: "face.smiling", color: MOOD_COLORS[Math.round(Number(avgMood)) - 1] || colors.primary },
                    { label: "متوسط الطاقة", value: avgEnergy, icon: "bolt.fill", color: "#F97316" },
                    { label: "متوسط النوم", value: avgSleep, icon: "moon.fill", color: "#6366F1" },
                    { label: "الالتزام بالمكملات", value: `${adherence}%`, icon: "pills.fill", color: adherence >= 80 ? colors.success : adherence >= 50 ? colors.warning : colors.error },
                  ].map((stat) => (
                    <View key={stat.label} style={[styles.reportStat, { backgroundColor: stat.color + "10", borderColor: stat.color + "25" }]}>
                      <IconSymbol name={stat.icon as any} size={20} color={stat.color} />
                      <Text style={[styles.reportStatValue, { color: stat.color }]}>{stat.value}</Text>
                      <Text style={[styles.reportStatLabel, { color: colors.muted }]}>{stat.label}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            {last7.length > 0 && (
              <View style={[styles.insightCard, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "25" }]}>
                <IconSymbol name="lightbulb.fill" size={18} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.insightTitle, { color: colors.foreground }]}>تحليل ذكي</Text>
                  <Text style={[styles.insightText, { color: colors.foreground }]}>
                    {adherence >= 80
                      ? `التزامك بالمكملات ممتاز (${adherence}%) — استمر! متوسط طاقتك ${avgEnergy}/5.`
                      : adherence >= 50
                      ? `التزامك بالمكملات متوسط (${adherence}%) — حاول تحسينه لرؤية نتائج أفضل.`
                      : `التزامك بالمكملات منخفض (${adherence}%) — فعّل الإشعارات من شاشة الملف الصحي.`}
                  </Text>
                </View>
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
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontWeight: "700" },
  dateCard: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  dateText: { flex: 1, fontSize: 14, fontWeight: "700", textAlign: "right" },
  savedBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  savedText: { fontSize: 11, fontWeight: "700" },
  ratingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  ratingLabel: { fontSize: 14, fontWeight: "700", width: 100, textAlign: "right" },
  ratingBtns: { flexDirection: "row-reverse", gap: 6, flex: 1 },
  ratingBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  supplementToggle: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  supplementToggleText: { fontSize: 15, fontWeight: "700" },
  notesBox: { borderRadius: 12, padding: 12, borderWidth: 1 },
  notesLabel: { fontSize: 12, marginBottom: 8, textAlign: "right" },
  notesInput: { fontSize: 14, lineHeight: 22, minHeight: 70 },
  saveBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: 14 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  emptyState: { alignItems: "center", gap: 12, padding: 40, borderRadius: 16 },
  emptyText: { fontSize: 14, textAlign: "center" },
  logCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 10 },
  logHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  logDate: { fontSize: 13, fontWeight: "600" },
  logStats: { flexDirection: "row-reverse", gap: 8, flexWrap: "wrap" },
  logStat: { alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, minWidth: 60 },
  logStatValue: { fontSize: 14, fontWeight: "800" },
  logStatLabel: { fontSize: 10 },
  logNotes: { fontSize: 13, lineHeight: 18, textAlign: "right" },
  reportCard: { borderRadius: 14, padding: 16, borderWidth: 1, gap: 14 },
  reportTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  reportStats: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  reportStat: { flex: 1, minWidth: "45%", alignItems: "center", gap: 6, padding: 12, borderRadius: 12, borderWidth: 1 },
  reportStatValue: { fontSize: 22, fontWeight: "900" },
  reportStatLabel: { fontSize: 11, textAlign: "center" },
  insightCard: { flexDirection: "row-reverse", gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  insightTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 4 },
  insightText: { fontSize: 13, lineHeight: 20, textAlign: "right" },
});
