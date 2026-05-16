/**
 * نظام النقاط والإنجازات
 * Feature #28: Points and achievements system
 */
import { useState, useEffect } from "react";
import { FlatList, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_log", title: "البداية الصحيحة", description: "سجّل يومك الصحي لأول مرة", icon: "star.fill", color: "#F59E0B", points: 50, unlocked: true },
  { id: "week_streak", title: "أسبوع متواصل", description: "سجّل 7 أيام متتالية", icon: "flame.fill", color: "#EF4444", points: 200, unlocked: false, progress: 3, maxProgress: 7 },
  { id: "first_supplement", title: "المكمل الأول", description: "أضف مكملاً لملفك الصحي", icon: "pills.fill", color: "#10B981", points: 100, unlocked: true },
  { id: "supplement_master", title: "خبير المكملات", description: "أضف 5 مكملات لملفك الصحي", icon: "rosette", color: "#8B5CF6", points: 300, unlocked: false, progress: 2, maxProgress: 5 },
  { id: "quiz_passed", title: "اجتاز الاختبار", description: "احصل على 80%+ في اختبار المعرفة", icon: "checkmark.seal.fill", color: "#0EA5E9", points: 150, unlocked: false },
  { id: "profile_complete", title: "الملف الكامل", description: "أكمل ملفك الصحي بالكامل", icon: "person.fill.checkmark", color: "#F97316", points: 250, unlocked: false, progress: 60, maxProgress: 100 },
  { id: "month_streak", title: "شهر من الالتزام", description: "سجّل 30 يوماً متتالياً", icon: "calendar.badge.checkmark", color: "#EC4899", points: 1000, unlocked: false, progress: 3, maxProgress: 30 },
  { id: "compare_expert", title: "خبير المقارنة", description: "قارن بين 10 منتجات مختلفة", icon: "arrow.left.arrow.right", color: "#14B8A6", points: 200, unlocked: false, progress: 4, maxProgress: 10 },
  { id: "protocol_follower", title: "متبع البروتوكول", description: "اتبع بروتوكولاً لمدة أسبوع كامل", icon: "list.bullet.clipboard.fill", color: "#6366F1", points: 400, unlocked: false },
  { id: "ai_user", title: "مستخدم الذكاء الاصطناعي", description: "استخدم مساعد AI 5 مرات", icon: "brain", color: "#A855F7", points: 100, unlocked: true },
  { id: "library_reader", title: "القارئ المتعلم", description: "اقرأ 10 مقالات علمية", icon: "book.fill", color: "#2563EB", points: 150, unlocked: false, progress: 3, maxProgress: 10 },
  { id: "supplement_free", title: "مكملات نباتية", description: "اكتشف 5 مكملات Vegan", icon: "leaf.fill", color: "#22C55E", points: 100, unlocked: false, progress: 2, maxProgress: 5 },
];

const LEVELS = [
  { name: "مبتدئ", minPoints: 0, color: "#9CA3AF", icon: "star" as const },
  { name: "متعلم", minPoints: 200, color: "#10B981", icon: "star.fill" as const },
  { name: "متقدم", minPoints: 500, color: "#3B82F6", icon: "rosette" as const },
  { name: "خبير", minPoints: 1000, color: "#8B5CF6", icon: "crown.fill" as const },
  { name: "أسطورة", minPoints: 2000, color: "#F59E0B", icon: "trophy.fill" as const },
];

export default function AchievementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const totalPoints = ACHIEVEMENTS.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const currentLevel = LEVELS.reduce((best, level) => totalPoints >= level.minPoints ? level : best, LEVELS[0]);
  const nextLevel = LEVELS.find(l => l.minPoints > totalPoints);
  const progressToNext = nextLevel ? (totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints) * 100 : 100;

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الإنجازات والنقاط</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{unlockedCount}/{ACHIEVEMENTS.length} إنجاز مكتمل</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Level Card */}
        <View style={[styles.levelCard, { backgroundColor: currentLevel.color + "15", borderColor: currentLevel.color + "30" }]}>
          <View style={styles.levelHeader}>
            <View style={[styles.levelBadge, { backgroundColor: currentLevel.color }]}>
              <IconSymbol name={currentLevel.icon} size={24} color="#fff" />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={[styles.levelName, { color: currentLevel.color }]}>{currentLevel.name}</Text>
              <Text style={[styles.levelPoints, { color: colors.foreground }]}>{totalPoints} نقطة</Text>
            </View>
          </View>
          {nextLevel && (
            <>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, { width: `${progressToNext}%` as any, backgroundColor: currentLevel.color }]} />
              </View>
              <Text style={[styles.progressText, { color: colors.muted }]}>
                {nextLevel.minPoints - totalPoints} نقطة للوصول إلى مستوى "{nextLevel.name}"
              </Text>
            </>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: "النقاط الكلية", value: totalPoints.toString(), color: "#F59E0B" },
            { label: "الإنجازات", value: `${unlockedCount}/${ACHIEVEMENTS.length}`, color: "#10B981" },
            { label: "المستوى", value: currentLevel.name, color: currentLevel.color },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Achievements List */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>جميع الإنجازات</Text>
        {ACHIEVEMENTS.map(achievement => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              { backgroundColor: colors.surface, borderColor: achievement.unlocked ? achievement.color + "30" : colors.border },
              !achievement.unlocked && styles.lockedCard,
            ]}
          >
            <View style={[styles.achievementIcon, { backgroundColor: achievement.unlocked ? achievement.color + "20" : colors.border + "50" }]}>
              <IconSymbol name={achievement.icon} size={24} color={achievement.unlocked ? achievement.color : colors.muted} />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <View style={styles.achievementHeader}>
                <View style={[styles.pointsBadge, { backgroundColor: achievement.unlocked ? achievement.color + "20" : colors.border }]}>
                  <Text style={[styles.pointsText, { color: achievement.unlocked ? achievement.color : colors.muted }]}>+{achievement.points}</Text>
                </View>
                <Text style={[styles.achievementTitle, { color: achievement.unlocked ? colors.foreground : colors.muted }]}>{achievement.title}</Text>
              </View>
              <Text style={[styles.achievementDesc, { color: colors.muted }]}>{achievement.description}</Text>
              {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                <View style={styles.progressContainer}>
                  <View style={[styles.miniProgressBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.miniProgressFill, { width: `${(achievement.progress / achievement.maxProgress) * 100}%` as any, backgroundColor: achievement.color }]} />
                  </View>
                  <Text style={[styles.miniProgressText, { color: colors.muted }]}>{achievement.progress}/{achievement.maxProgress}</Text>
                </View>
              )}
            </View>
            {achievement.unlocked && (
              <View style={[styles.unlockedBadge, { backgroundColor: achievement.color }]}>
                <IconSymbol name="checkmark" size={12} color="#fff" />
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
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  levelCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 12 },
  levelHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  levelBadge: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  levelName: { fontSize: 20, fontWeight: "900", textAlign: "right", fontFamily: "Cairo-Black" },
  levelPoints: { fontSize: 14, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressText: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  statsRow: { flexDirection: "row-reverse", gap: 10 },
  statCard: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontWeight: "900", fontFamily: "Cairo-Black" },
  statLabel: { fontSize: 11, textAlign: "center", fontFamily: "Cairo" },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  achievementCard: { borderRadius: 14, padding: 14, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  lockedCard: { opacity: 0.7 },
  achievementIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  achievementHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  achievementTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  achievementDesc: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  pointsBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  pointsText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  progressContainer: { flexDirection: "row-reverse", alignItems: "center", gap: 8, width: "100%" },
  miniProgressBar: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  miniProgressFill: { height: "100%", borderRadius: 2 },
  miniProgressText: { fontSize: 10, fontFamily: "Cairo" },
  unlockedBadge: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
});
