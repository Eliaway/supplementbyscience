import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  I18nManager,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

I18nManager.forceRTL(true);

interface ProductRating {
  id: string;
  name: string;
  brand: string;
  rating: number; // 1-5
  effectiveness: number; // 1-5
  sideEffects: number; // 1-5 (5 = no side effects)
  value: number; // 1-5 (price/quality)
  review: string;
  date: string;
  wouldRecommend: boolean;
}

const STAR_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981"];

export default function ProductRatingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [ratings, setRatings] = useState<ProductRating[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<ProductRating>>({
    rating: 4,
    effectiveness: 4,
    sideEffects: 5,
    value: 4,
    wouldRecommend: true,
  });

  useEffect(() => {
    loadRatings();
  }, []);

  async function loadRatings() {
    const raw = await AsyncStorage.getItem("product_ratings");
    if (raw) setRatings(JSON.parse(raw));
  }

  async function saveRating() {
    if (!form.name?.trim()) return;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const newRating: ProductRating = {
      id: Date.now().toString(),
      name: form.name.trim(),
      brand: form.brand?.trim() || "غير محدد",
      rating: form.rating ?? 4,
      effectiveness: form.effectiveness ?? 4,
      sideEffects: form.sideEffects ?? 5,
      value: form.value ?? 4,
      review: form.review?.trim() || "",
      date: new Date().toLocaleDateString("ar-SA"),
      wouldRecommend: form.wouldRecommend ?? true,
    };
    const updated = [newRating, ...ratings];
    setRatings(updated);
    await AsyncStorage.setItem("product_ratings", JSON.stringify(updated));
    setForm({ rating: 4, effectiveness: 4, sideEffects: 5, value: 4, wouldRecommend: true });
    setShowForm(false);
  }

  async function deleteRating(id: string) {
    const updated = ratings.filter((r) => r.id !== id);
    setRatings(updated);
    await AsyncStorage.setItem("product_ratings", JSON.stringify(updated));
  }

  function StarRow({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
    return (
      <View style={styles.starRow}>
        <Text style={[styles.starLabel, { color: colors.muted, fontFamily: "Cairo" }]}>{label}</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} onPress={() => onChange(n)}>
              <Text style={[styles.star, { color: n <= value ? STAR_COLORS[value - 1] : colors.border }]}>★</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  function RatingCard({ item }: { item: ProductRating }) {
    const avgScore = ((item.rating + item.effectiveness + item.sideEffects + item.value) / 4).toFixed(1);
    return (
      <View style={[styles.ratingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <Text style={[styles.productName, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
              {item.name}
            </Text>
            <Text style={[styles.brandName, { color: colors.muted, fontFamily: "Cairo" }]}>
              {item.brand}
            </Text>
          </View>
          <View style={styles.cardRight}>
            <View style={[styles.scoreBadge, { backgroundColor: STAR_COLORS[Math.round(parseFloat(avgScore)) - 1] + "22" }]}>
              <Text style={[styles.scoreText, { color: STAR_COLORS[Math.round(parseFloat(avgScore)) - 1], fontFamily: "Cairo-Black" }]}>
                {avgScore} ★
              </Text>
            </View>
            <Pressable onPress={() => deleteRating(item.id)}>
              <Text style={{ color: colors.error, fontSize: 14 }}>🗑</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.metricsRow}>
          {[
            { label: "الفعالية", val: item.effectiveness },
            { label: "الأعراض", val: item.sideEffects },
            { label: "القيمة", val: item.value },
          ].map((m) => (
            <View key={m.label} style={styles.metricChip}>
              <Text style={[styles.metricLabel, { color: colors.muted, fontFamily: "Cairo" }]}>{m.label}</Text>
              <Text style={[styles.metricVal, { color: STAR_COLORS[m.val - 1], fontFamily: "Cairo-Black" }]}>
                {"★".repeat(m.val)}
              </Text>
            </View>
          ))}
        </View>

        {item.review ? (
          <Text style={[styles.reviewText, { color: colors.foreground, fontFamily: "Cairo" }]}>
            "{item.review}"
          </Text>
        ) : null}

        <View style={styles.cardFooter}>
          <Text style={[styles.dateText, { color: colors.muted, fontFamily: "Cairo" }]}>{item.date}</Text>
          <View style={[styles.recommendBadge, {
            backgroundColor: item.wouldRecommend ? colors.success + "22" : colors.error + "22",
          }]}>
            <Text style={[styles.recommendText, {
              color: item.wouldRecommend ? colors.success : colors.error,
              fontFamily: "Cairo-Bold",
            }]}>
              {item.wouldRecommend ? "✓ أنصح به" : "✗ لا أنصح"}
            </Text>
          </View>
        </View>
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
          تقييماتي للمنتجات
        </Text>
        <Pressable
          onPress={() => setShowForm(!showForm)}
          style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}
        >
          <Text style={[styles.addBtnText, { fontFamily: "Cairo-Bold" }]}>{showForm ? "✕" : "+"}</Text>
        </Pressable>
      </View>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TextInput
            value={form.name ?? ""}
            onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
            placeholder="اسم المنتج *"
            placeholderTextColor={colors.muted}
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: "Cairo" }]}
            textAlign="right"
          />
          <TextInput
            value={form.brand ?? ""}
            onChangeText={(t) => setForm((f) => ({ ...f, brand: t }))}
            placeholder="الشركة المصنّعة"
            placeholderTextColor={colors.muted}
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: "Cairo" }]}
            textAlign="right"
          />
          <StarRow value={form.rating ?? 4} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} label="التقييم العام" />
          <StarRow value={form.effectiveness ?? 4} onChange={(v) => setForm((f) => ({ ...f, effectiveness: v }))} label="الفعالية" />
          <StarRow value={form.sideEffects ?? 5} onChange={(v) => setForm((f) => ({ ...f, sideEffects: v }))} label="خلو من الأعراض" />
          <StarRow value={form.value ?? 4} onChange={(v) => setForm((f) => ({ ...f, value: v }))} label="قيمة مقابل السعر" />
          <TextInput
            value={form.review ?? ""}
            onChangeText={(t) => setForm((f) => ({ ...f, review: t }))}
            placeholder="تجربتك مع المنتج (اختياري)"
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.reviewInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: "Cairo" }]}
            textAlign="right"
          />
          <View style={styles.recommendRow}>
            <Text style={[styles.recommendLabel, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
              هل تنصح به؟
            </Text>
            <View style={styles.recommendBtns}>
              <Pressable
                onPress={() => setForm((f) => ({ ...f, wouldRecommend: true }))}
                style={[styles.recBtn, { backgroundColor: form.wouldRecommend ? colors.success : colors.background, borderColor: colors.success }]}
              >
                <Text style={[styles.recBtnText, { color: form.wouldRecommend ? "#fff" : colors.success, fontFamily: "Cairo-Bold" }]}>نعم</Text>
              </Pressable>
              <Pressable
                onPress={() => setForm((f) => ({ ...f, wouldRecommend: false }))}
                style={[styles.recBtn, { backgroundColor: !form.wouldRecommend ? colors.error : colors.background, borderColor: colors.error }]}
              >
                <Text style={[styles.recBtnText, { color: !form.wouldRecommend ? "#fff" : colors.error, fontFamily: "Cairo-Bold" }]}>لا</Text>
              </Pressable>
            </View>
          </View>
          <Pressable
            onPress={saveRating}
            style={({ pressed }) => [styles.saveBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={[styles.saveBtnText, { fontFamily: "Cairo-Black" }]}>حفظ التقييم</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={ratings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RatingCard item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>⭐</Text>
            <Text style={[styles.emptyText, { color: colors.muted, fontFamily: "Cairo" }]}>
              لم تضف أي تقييم بعد. اضغط + لإضافة تقييم أول منتج
            </Text>
          </View>
        }
      />
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
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  addBtnText: { fontSize: 20, color: "#fff", fontFamily: "Cairo-Bold" },
  form: {
    padding: 14,
    gap: 10,
    borderBottomWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    fontFamily: "Cairo",
  },
  reviewInput: { minHeight: 70, textAlignVertical: "top" },
  starRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  starLabel: { fontSize: 13, fontFamily: "Cairo" },
  stars: { flexDirection: "row-reverse", gap: 4 },
  star: { fontSize: 24 },
  recommendRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  recommendLabel: { fontSize: 14, fontFamily: "Cairo-Bold" },
  recommendBtns: { flexDirection: "row-reverse", gap: 8 },
  recBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  recBtnText: { fontSize: 13, fontFamily: "Cairo-Bold" },
  saveBtn: { borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { fontSize: 15, color: "#fff", fontFamily: "Cairo-Black" },
  list: { padding: 14, gap: 12, paddingBottom: 40 },
  ratingCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  cardHeader: { flexDirection: "row-reverse", alignItems: "flex-start", justifyContent: "space-between" },
  cardLeft: { flex: 1, alignItems: "flex-end", gap: 2 },
  productName: { fontSize: 15, fontFamily: "Cairo-Black" },
  brandName: { fontSize: 12, fontFamily: "Cairo" },
  cardRight: { alignItems: "flex-end", gap: 6 },
  scoreBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  scoreText: { fontSize: 14, fontFamily: "Cairo-Black" },
  metricsRow: { flexDirection: "row-reverse", gap: 8 },
  metricChip: { flex: 1, alignItems: "center", gap: 2 },
  metricLabel: { fontSize: 10, fontFamily: "Cairo" },
  metricVal: { fontSize: 12, fontFamily: "Cairo-Black" },
  reviewText: { fontSize: 13, fontFamily: "Cairo", textAlign: "right", lineHeight: 20, fontStyle: "italic" },
  cardFooter: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  dateText: { fontSize: 11, fontFamily: "Cairo" },
  recommendBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  recommendText: { fontSize: 11, fontFamily: "Cairo-Bold" },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 14, fontFamily: "Cairo", textAlign: "center" },
});
