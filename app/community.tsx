/**
 * مجتمع المكملات
 * Features: 139 (تحدي جماعي), 140 (شبكة المستشارين), 141 (نقاشات علمية), 145 (تقرير للصيدلاني)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const ACTIVE_CHALLENGES = [
  { id: "1", title: "تحدي 30 يوم بدون سكر", participants: 1247, daysLeft: 18, color: "#EF4444", icon: "xmark.circle.fill" as const },
  { id: "2", title: "تحدي Omega-3 يومي لشهر", participants: 892, daysLeft: 25, color: "#3B82F6", icon: "drop.fill" as const },
  { id: "3", title: "تحدي النوم 8 ساعات + Magnesium", participants: 2103, daysLeft: 12, color: "#8B5CF6", icon: "moon.fill" as const },
  { id: "4", title: "تحدي Vitamin D + الشمس اليومية", participants: 567, daysLeft: 20, color: "#F59E0B", icon: "sun.max.fill" as const },
];

const ADVISORS = [
  { name: "د. أحمد المنصوري", specialty: "طب التغذية والمكملات", rating: 4.9, reviews: 234, color: "#3B82F6" },
  { name: "د. سارة الحربي", specialty: "الصيدلة السريرية", rating: 4.8, reviews: 189, color: "#EC4899" },
  { name: "م. خالد العتيبي", specialty: "التغذية الرياضية", rating: 4.7, reviews: 156, color: "#10B981" },
  { name: "د. نورة الشمري", specialty: "الطب الوقائي والهرمونات", rating: 4.9, reviews: 312, color: "#F59E0B" },
];

const DISCUSSIONS = [
  { title: "هل Creatine آمن للكلى؟", replies: 47, views: 1203, hot: true },
  { title: "أفضل وقت لأخذ Vitamin D — صباحاً أم مساءً؟", replies: 89, views: 2341, hot: true },
  { title: "تجربتي مع Ashwagandha لمدة 3 أشهر", replies: 34, views: 891, hot: false },
  { title: "هل يمكن الجمع بين Zinc و Magnesium؟", replies: 56, views: 1567, hot: false },
  { title: "Omega-3 من السمك أم النباتي — أيهما أفضل؟", replies: 78, views: 2109, hot: true },
];

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"challenges" | "advisors" | "discussions">("challenges");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0c1a2e", borderBottomColor: "#1a3a5e" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#7dd3fc" />
          <Text style={[styles.backText, { color: "#7dd3fc" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>مجتمع المكملات</Text>
        <Text style={[styles.headerSub, { color: "#7dd3fc" }]}>تحديات • مستشارون • نقاشات علمية</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(["challenges", "advisors", "discussions"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: "#3B82F6", borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? "#3B82F6" : colors.muted }]}>
              {tab === "challenges" ? "التحديات" : tab === "advisors" ? "المستشارون" : "النقاشات"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {activeTab === "challenges" && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>التحديات النشطة</Text>
            {ACTIVE_CHALLENGES.map((ch) => (
              <View key={ch.id} style={[styles.challengeCard, { backgroundColor: colors.surface, borderColor: ch.color + "30" }]}>
                <View style={[styles.challengeIcon, { backgroundColor: ch.color + "20" }]}>
                  <IconSymbol name={ch.icon} size={24} color={ch.color} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[styles.challengeTitle, { color: colors.foreground }]}>{ch.title}</Text>
                  <View style={styles.challengeMeta}>
                    <Text style={[styles.challengeDays, { color: ch.color }]}>{ch.daysLeft} يوم متبقي</Text>
                    <Text style={[styles.challengeParticipants, { color: colors.muted }]}>{ch.participants.toLocaleString()} مشارك</Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.progressFill, { backgroundColor: ch.color, width: `${((30 - ch.daysLeft) / 30) * 100}%` }]} />
                  </View>
                </View>
              </View>
            ))}
            <Pressable style={[styles.joinBtn, { backgroundColor: "#3B82F6" }]}>
              <Text style={styles.joinBtnText}>إنشاء تحدي جديد</Text>
            </Pressable>
          </>
        )}

        {activeTab === "advisors" && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>شبكة المستشارين الصحيين</Text>
            {ADVISORS.map((adv, i) => (
              <View key={i} style={[styles.advisorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.advisorAvatar, { backgroundColor: adv.color + "20" }]}>
                  <Text style={[styles.advisorInitial, { color: adv.color }]}>{adv.name.charAt(3)}</Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[styles.advisorName, { color: colors.foreground }]}>{adv.name}</Text>
                  <Text style={[styles.advisorSpec, { color: colors.muted }]}>{adv.specialty}</Text>
                  <View style={styles.advisorMeta}>
                    <Text style={[styles.advisorReviews, { color: colors.muted }]}>{adv.reviews} تقييم</Text>
                    <View style={styles.ratingRow}>
                      <Text style={[styles.ratingText, { color: "#F59E0B" }]}>{adv.rating} ★</Text>
                    </View>
                  </View>
                </View>
                <Pressable style={[styles.consultBtn, { backgroundColor: adv.color + "15", borderColor: adv.color }]}>
                  <Text style={[styles.consultBtnText, { color: adv.color }]}>استشارة</Text>
                </Pressable>
              </View>
            ))}
          </>
        )}

        {activeTab === "discussions" && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>النقاشات العلمية</Text>
            {DISCUSSIONS.map((disc, i) => (
              <View key={i} style={[styles.discussCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.discussHeader}>
                  {disc.hot && (
                    <View style={[styles.hotBadge, { backgroundColor: "#EF444420" }]}>
                      <Text style={[styles.hotText, { color: "#EF4444" }]}>🔥 رائج</Text>
                    </View>
                  )}
                  <Text style={[styles.discussTitle, { color: colors.foreground }]}>{disc.title}</Text>
                </View>
                <View style={styles.discussMeta}>
                  <Text style={[styles.discussViews, { color: colors.muted }]}>{disc.views.toLocaleString()} مشاهدة</Text>
                  <Text style={[styles.discussReplies, { color: colors.primary }]}>{disc.replies} رد</Text>
                </View>
              </View>
            ))}
            <Pressable style={[styles.joinBtn, { backgroundColor: "#10B981" }]}>
              <Text style={styles.joinBtnText}>إنشاء نقاش جديد</Text>
            </Pressable>
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
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabText: { fontSize: 12, fontWeight: "700" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  challengeCard: { borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row-reverse", gap: 12, alignItems: "center" },
  challengeIcon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  challengeTitle: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  challengeMeta: { flexDirection: "row-reverse", gap: 12 },
  challengeDays: { fontSize: 12, fontWeight: "700" },
  challengeParticipants: { fontSize: 12 },
  progressBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: 4, borderRadius: 2 },
  joinBtn: { borderRadius: 12, padding: 14, alignItems: "center" },
  joinBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  advisorCard: { borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row-reverse", gap: 12, alignItems: "center" },
  advisorAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  advisorInitial: { fontSize: 20, fontWeight: "800" },
  advisorName: { fontSize: 14, fontWeight: "800", textAlign: "right" },
  advisorSpec: { fontSize: 12, textAlign: "right" },
  advisorMeta: { flexDirection: "row-reverse", gap: 12 },
  advisorReviews: { fontSize: 11 },
  ratingRow: { flexDirection: "row-reverse" },
  ratingText: { fontSize: 12, fontWeight: "700" },
  consultBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  consultBtnText: { fontSize: 12, fontWeight: "700" },
  discussCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  discussHeader: { gap: 6 },
  hotBadge: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  hotText: { fontSize: 11, fontWeight: "700" },
  discussTitle: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  discussMeta: { flexDirection: "row-reverse", gap: 12 },
  discussViews: { fontSize: 11 },
  discussReplies: { fontSize: 11, fontWeight: "700" },
});
