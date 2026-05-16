/**
 * تقييمات المستخدمين
 * Feature #15: User ratings and reviews
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface Review {
  id: string;
  user: string;
  supplement: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  goal: string;
}

const REVIEWS: Review[] = [
  { id: "1", user: "أحمد م.", supplement: "فيتامين D3 + K2", rating: 5, comment: "بعد 3 أشهر من الاستخدام، ارتفع مستوى فيتامين D لدي من 18 إلى 65 ng/mL. تحسن ملحوظ في الطاقة والمزاج.", date: "2026-04-15", helpful: 47, verified: true, goal: "رفع مستوى فيتامين D" },
  { id: "2", user: "سارة ع.", supplement: "المغنيسيوم Glycinate", rating: 5, comment: "حل مشكلة الأرق التي عانيت منها لسنوات! أنام الآن بعمق وأستيقظ بنشاط. الجرعة 400 mg قبل النوم.", date: "2026-04-20", helpful: 89, verified: true, goal: "تحسين النوم" },
  { id: "3", user: "محمد ك.", supplement: "Ashwagandha KSM-66", rating: 4, comment: "تقليل ملحوظ للتوتر والقلق خلال 4 أسابيع. الطاقة أفضل لكن التأثير على التستوستيرون لم يكن واضحاً.", date: "2026-05-01", helpful: 32, verified: true, goal: "تقليل التوتر" },
  { id: "4", user: "فاطمة ر.", supplement: "أوميغا-3 EPA/DHA", rating: 5, comment: "مفيد جداً لصحة القلب والمزاج. استخدمت 2 g يومياً وتحسنت نتائج الدهون في الدم بشكل واضح.", date: "2026-05-05", helpful: 61, verified: true, goal: "صحة القلب" },
  { id: "5", user: "خالد ب.", supplement: "Creatine Monohydrate", rating: 5, comment: "أفضل مكمل رياضي بلا منازع. زيادة واضحة في القوة والكتلة العضلية خلال 6 أسابيع. آمن وفعال.", date: "2026-05-08", helpful: 103, verified: true, goal: "بناء العضلات" },
  { id: "6", user: "نورة ح.", supplement: "البيوتين B7", rating: 3, comment: "تحسن طفيف في الشعر بعد 3 أشهر. ليس معجزة كما يُروَّج له، لكنه مفيد مع الزنك والحديد.", date: "2026-05-10", helpful: 28, verified: false, goal: "صحة الشعر" },
  { id: "7", user: "عمر ف.", supplement: "CoQ10 Ubiquinol", rating: 4, comment: "طاقة أفضل بشكل ملحوظ خاصة بعد الأربعين. مفيد جداً مع الستاتينات التي تستنزف CoQ10.", date: "2026-05-12", helpful: 44, verified: true, goal: "الطاقة" },
];

export default function UserReviewsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"helpful" | "recent" | "rating">("helpful");
  const [filterRating, setFilterRating] = useState<number>(0);

  const sortedReviews = [...REVIEWS]
    .filter(r => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === "helpful") return b.helpful - a.helpful;
      if (sortBy === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.rating - a.rating;
    });

  const avgRating = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: REVIEWS.filter(rev => rev.rating === r).length }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>تقييمات المستخدمين</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{REVIEWS.length} تقييم موثق</Text>
        </View>
      </View>

      <FlatList
        data={sortedReviews}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={{ gap: 12, paddingBottom: 8 }}>
            {/* Summary */}
            <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.avgRow}>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.avgNum, { color: colors.foreground }]}>{avgRating.toFixed(1)}</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Text key={s} style={{ color: s <= Math.round(avgRating) ? "#F59E0B" : colors.border, fontSize: 16 }}>★</Text>
                    ))}
                  </View>
                  <Text style={[styles.totalText, { color: colors.muted }]}>{REVIEWS.length} تقييم</Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  {ratingCounts.map(({ rating, count }) => (
                    <View key={rating} style={styles.ratingBarRow}>
                      <View style={[styles.ratingBar, { backgroundColor: colors.border }]}>
                        <View style={[styles.ratingBarFill, { width: `${(count / REVIEWS.length) * 100}%` as any, backgroundColor: "#F59E0B" }]} />
                      </View>
                      <Text style={[styles.ratingBarLabel, { color: colors.muted }]}>{rating}★</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Sort & Filter */}
            <View style={styles.controlsRow}>
              <View style={styles.sortRow}>
                {[
                  { id: "helpful", label: "الأكثر إفادة" },
                  { id: "recent", label: "الأحدث" },
                  { id: "rating", label: "الأعلى تقييماً" },
                ].map(s => (
                  <Pressable
                    key={s.id}
                    style={[styles.sortBtn, sortBy === s.id && { backgroundColor: colors.primary }]}
                    onPress={() => setSortBy(s.id as any)}
                  >
                    <Text style={[styles.sortBtnText, { color: sortBy === s.id ? "#fff" : colors.muted }]}>{s.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        }
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewMeta}>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Text key={s} style={{ color: s <= item.rating ? "#F59E0B" : colors.border, fontSize: 14 }}>★</Text>
                  ))}
                </View>
                {item.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.success + "15" }]}>
                    <IconSymbol name="checkmark.seal.fill" size={12} color={colors.success} />
                    <Text style={[styles.verifiedText, { color: colors.success }]}>موثق</Text>
                  </View>
                )}
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.reviewUser, { color: colors.foreground }]}>{item.user}</Text>
                <Text style={[styles.reviewDate, { color: colors.muted }]}>{item.date}</Text>
              </View>
            </View>
            <View style={[styles.suppTag, { backgroundColor: colors.primary + "10" }]}>
              <Text style={[styles.suppTagText, { color: colors.primary }]}>{item.supplement}</Text>
            </View>
            <View style={[styles.goalTag, { backgroundColor: colors.surface }]}>
              <Text style={[styles.goalTagText, { color: colors.muted }]}>الهدف: {item.goal}</Text>
            </View>
            <Text style={[styles.reviewComment, { color: colors.foreground }]}>{item.comment}</Text>
            <View style={styles.helpfulRow}>
              <Pressable style={[styles.helpfulBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <IconSymbol name="hand.thumbsup.fill" size={14} color={colors.muted} />
                <Text style={[styles.helpfulText, { color: colors.muted }]}>مفيد ({item.helpful})</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  summaryCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  avgRow: { flexDirection: "row-reverse", alignItems: "center", gap: 16 },
  avgNum: { fontSize: 40, fontWeight: "900", fontFamily: "Cairo-Black" },
  starsRow: { flexDirection: "row-reverse" },
  totalText: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  ratingBarRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  ratingBar: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  ratingBarFill: { height: "100%", borderRadius: 3 },
  ratingBarLabel: { fontSize: 11, minWidth: 20, textAlign: "right", fontFamily: "Cairo" },
  controlsRow: { gap: 8 },
  sortRow: { flexDirection: "row-reverse", gap: 6, flexWrap: "wrap" },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: "transparent" },
  sortBtnText: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  reviewCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  reviewHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start" },
  reviewMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  verifiedBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  verifiedText: { fontSize: 10, fontWeight: "700", fontFamily: "Cairo-Bold" },
  reviewUser: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  reviewDate: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  suppTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-end" },
  suppTagText: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  goalTag: { alignSelf: "flex-end" },
  goalTagText: { fontSize: 11, fontFamily: "Cairo" },
  reviewComment: { fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  helpfulRow: { flexDirection: "row-reverse" },
  helpfulBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  helpfulText: { fontSize: 12, fontFamily: "Cairo" },
});
