/**
 * الخطة الصحية الشخصية المتكاملة
 * Features: 53, 54
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const PLAN_SECTIONS = [
  {
    id: "morning",
    title: "روتين الصباح",
    icon: "sun.max.fill",
    color: "#F59E0B",
    items: [
      { time: "عند الاستيقاظ", supplements: ["ماء 500ml", "فيتامين D3 + K2", "أوميغا 3"], notes: "على معدة فارغة أو مع وجبة خفيفة" },
      { time: "مع الإفطار", supplements: ["مغنيسيوم", "B-Complex", "زنك"], notes: "مع الطعام لتحسين الامتصاص" },
    ],
  },
  {
    id: "afternoon",
    title: "منتصف اليوم",
    icon: "sun.min.fill",
    color: "#3B82F6",
    items: [
      { time: "مع الغداء", supplements: ["بروبيوتيك", "إنزيمات هضمية", "CoQ10"], notes: "مع الوجبة الرئيسية" },
      { time: "بعد التمرين", supplements: ["بروتين مصل اللبن", "كرياتين", "BCAA"], notes: "خلال 30 دقيقة بعد التمرين" },
    ],
  },
  {
    id: "evening",
    title: "المساء والنوم",
    icon: "moon.fill",
    color: "#8B5CF6",
    items: [
      { time: "مع العشاء", supplements: ["أوميغا 3 (جرعة ثانية)", "فيتامين C", "ثيانين"], notes: "مع الطعام" },
      { time: "قبل النوم", supplements: ["مغنيسيوم غليسينات", "ميلاتونين (عند الحاجة)", "أشواغاندا"], notes: "30-60 دقيقة قبل النوم" },
    ],
  },
];

const HEALTH_GOALS = [
  { id: "energy", label: "تحسين الطاقة", icon: "bolt.fill", color: "#F59E0B", supplements: ["B12", "Iron", "CoQ10", "Rhodiola", "Vitamin D"] },
  { id: "immunity", label: "تقوية المناعة", icon: "shield.fill", color: "#10B981", supplements: ["Vitamin C", "Zinc", "Vitamin D", "Elderberry", "Beta-Glucan"] },
  { id: "brain", label: "تحسين الذاكرة", icon: "brain", color: "#3B82F6", supplements: ["Omega-3", "Lion's Mane", "Bacopa", "Alpha-GPC", "Phosphatidylserine"] },
  { id: "sleep", label: "تحسين النوم", icon: "moon.fill", color: "#8B5CF6", supplements: ["Magnesium Glycinate", "L-Theanine", "Ashwagandha", "Melatonin"] },
  { id: "muscle", label: "بناء العضلات", icon: "figure.walk", color: "#EF4444", supplements: ["Creatine", "Protein", "BCAA", "Beta-Alanine", "HMB"] },
  { id: "heart", label: "صحة القلب", icon: "heart.fill", color: "#EC4899", supplements: ["Omega-3", "CoQ10", "Magnesium", "Berberine", "Nattokinase"] },
  { id: "hormones", label: "توازن الهرمونات", icon: "waveform", color: "#6366F1", supplements: ["Zinc", "Vitamin D", "Ashwagandha", "Boron", "DIM"] },
  { id: "gut", label: "صحة الجهاز الهضمي", icon: "leaf.fill", color: "#14B8A6", supplements: ["Probiotics", "Prebiotics", "L-Glutamine", "Digestive Enzymes", "Zinc Carnosine"] },
];

const WEEKLY_PLAN = [
  { day: "السبت", focus: "طاقة وتركيز", color: "#F59E0B" },
  { day: "الأحد", focus: "تعافي ونوم", color: "#8B5CF6" },
  { day: "الاثنين", focus: "مناعة وحماية", color: "#10B981" },
  { day: "الثلاثاء", focus: "أداء وعضلات", color: "#EF4444" },
  { day: "الأربعاء", focus: "دماغ وذاكرة", color: "#3B82F6" },
  { day: "الخميس", focus: "هرمونات وتوازن", color: "#6366F1" },
  { day: "الجمعة", focus: "راحة وتجديد", color: "#14B8A6" },
];

export default function PersonalPlanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"daily" | "goals" | "weekly">("daily");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["energy", "immunity"]);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الخطة الصحية الشخصية 📋</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>جدول مكملاتك اليومي والأسبوعي المتكامل</Text>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {([
          { id: "daily", label: "الجدول اليومي" },
          { id: "goals", label: "الأهداف الصحية" },
          { id: "weekly", label: "التركيز الأسبوعي" },
        ] as const).map(tab => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && { borderBottomWidth: 2, borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {activeTab === "daily" && (
          <>
            <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                💡 هذا الجدول نموذجي — قم بتخصيصه حسب ملفك الصحي واحتياجاتك الشخصية.
              </Text>
            </View>

            {PLAN_SECTIONS.map((section, i) => (
              <View key={i} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: section.color + "30" }]}>
                <View style={[styles.sectionHeader, { borderBottomColor: section.color + "20" }]}>
                  <View style={[styles.sectionIcon, { backgroundColor: section.color + "15" }]}>
                    <IconSymbol name={section.icon as any} size={20} color={section.color} />
                  </View>
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
                </View>

                {section.items.map((item, j) => (
                  <View key={j} style={[styles.timeBlock, j < section.items.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}>
                    <View style={[styles.timeBadge, { backgroundColor: section.color + "15" }]}>
                      <Text style={[styles.timeText, { color: section.color }]}>{item.time}</Text>
                    </View>
                    <View style={styles.suppList}>
                      {item.supplements.map((s, k) => (
                        <View key={k} style={[styles.suppItem, { backgroundColor: colors.background }]}>
                          <Text style={[styles.suppText, { color: colors.foreground }]}>• {s}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={[styles.noteText, { color: colors.muted }]}>💡 {item.notes}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        {activeTab === "goals" && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>اختر أهدافك الصحية لتخصيص خطتك:</Text>
            <View style={styles.goalsGrid}>
              {HEALTH_GOALS.map(goal => (
                <Pressable
                  key={goal.id}
                  style={[styles.goalCard, {
                    backgroundColor: selectedGoals.includes(goal.id) ? goal.color + "15" : colors.surface,
                    borderColor: selectedGoals.includes(goal.id) ? goal.color : colors.border,
                  }]}
                  onPress={() => toggleGoal(goal.id)}
                >
                  <IconSymbol name={goal.icon as any} size={24} color={goal.color} />
                  <Text style={[styles.goalLabel, { color: colors.foreground }]}>{goal.label}</Text>
                  {selectedGoals.includes(goal.id) && (
                    <View style={[styles.checkBadge, { backgroundColor: goal.color }]}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            {selectedGoals.length > 0 && (
              <View style={[styles.recommendCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.recommendTitle, { color: colors.foreground }]}>المكملات الموصى بها لأهدافك:</Text>
                {HEALTH_GOALS.filter(g => selectedGoals.includes(g.id)).map(goal => (
                  <View key={goal.id} style={styles.goalRow}>
                    <Text style={[styles.goalRowLabel, { color: goal.color }]}>{goal.label}:</Text>
                    <View style={styles.suppChips}>
                      {goal.supplements.slice(0, 3).map((s, i) => (
                        <View key={i} style={[styles.suppChip, { backgroundColor: goal.color + "15" }]}>
                          <Text style={[styles.suppChipText, { color: goal.color }]}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {activeTab === "weekly" && (
          <>
            <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                🗓️ تركيز مختلف كل يوم يساعد على تحقيق توازن صحي شامل طوال الأسبوع.
              </Text>
            </View>

            {WEEKLY_PLAN.map((day, i) => (
              <View key={i} style={[styles.dayCard, { backgroundColor: colors.surface, borderColor: day.color + "30" }]}>
                <View style={[styles.dayBadge, { backgroundColor: day.color }]}>
                  <Text style={styles.dayText}>{day.day}</Text>
                </View>
                <View style={styles.dayContent}>
                  <Text style={[styles.dayFocus, { color: colors.foreground }]}>{day.focus}</Text>
                  <Text style={[styles.dayNote, { color: colors.muted }]}>ركّز على مكملات {day.focus} اليوم</Text>
                </View>
                <IconSymbol name="chevron.left" size={16} color={day.color} />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 17, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  tabRow: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 11, fontWeight: "700" },
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  infoText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  sectionLabel: { fontSize: 12, textAlign: "right" },
  sectionCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 12, borderBottomWidth: 0.5 },
  sectionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 15, fontWeight: "800" },
  timeBlock: { padding: 12, gap: 8 },
  timeBadge: { alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  timeText: { fontSize: 11, fontWeight: "700" },
  suppList: { gap: 4 },
  suppItem: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  suppText: { fontSize: 12, textAlign: "right" },
  noteText: { fontSize: 10, textAlign: "right" },
  goalsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  goalCard: { width: "47%", borderRadius: 14, borderWidth: 1.5, padding: 12, alignItems: "center", gap: 6, position: "relative" },
  goalLabel: { fontSize: 11, fontWeight: "700", textAlign: "center" },
  checkBadge: { position: "absolute", top: 6, left: 6, width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  checkText: { color: "#fff", fontSize: 10, fontWeight: "900" },
  recommendCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  recommendTitle: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  goalRow: { gap: 6 },
  goalRowLabel: { fontSize: 11, fontWeight: "700", textAlign: "right" },
  suppChips: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  suppChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  suppChipText: { fontSize: 10, fontWeight: "600" },
  dayCard: { borderRadius: 14, borderWidth: 1, padding: 12, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  dayBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  dayText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  dayContent: { flex: 1 },
  dayFocus: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  dayNote: { fontSize: 10, textAlign: "right", marginTop: 2 },
});
