import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  I18nManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSupplements } from "@/hooks/use-supplements";

I18nManager.forceRTL(true);

// ─── Static screens index ───────────────────────────────────────────────────
const SCREENS = [
  { id: "s1", title: "الملف الصحي", icon: "person.fill", route: "/(tabs)/profile", desc: "بياناتك الصحية وجدول الجرعات" },
  { id: "s2", title: "مساعد ذكي", icon: "sparkles", route: "/(tabs)/ai", desc: "تحليل التحاليل والاستشارات" },
  { id: "s3", title: "الأدوات", icon: "wrench.fill", route: "/(tabs)/tools", desc: "حاسبات وأدوات تشخيصية" },
  { id: "s4", title: "المكتبة", icon: "book.fill", route: "/(tabs)/library", desc: "مقالات ودراسات علمية" },
  { id: "s5", title: "المقارنة", icon: "arrow.left.arrow.right", route: "/compare", desc: "قارن بين منتجين علمياً" },
  { id: "s6", title: "اختبار النقص", icon: "checklist", route: "/deficiency-test", desc: "اكتشف نقص الفيتامينات" },
  { id: "s7", title: "جدول الجرعات", icon: "clock.fill", route: "/dose-schedule", desc: "جدول مكملاتك اليومي" },
  { id: "s8", title: "التفاعلات الدوائية", icon: "exclamationmark.triangle.fill", route: "/drug-interactions", desc: "تحذيرات التفاعلات" },
  { id: "s9", title: "خريطة الجسم", icon: "heart.fill", route: "/body-map", desc: "اختر العضو لرؤية مكملاته" },
  { id: "s10", title: "تتبع المزاج", icon: "face.smiling", route: "/mood-tracker", desc: "سجّل طاقتك ومزاجك اليومي" },
  { id: "s11", title: "تحدي 30 يوم", icon: "flag.fill", route: "/challenge-30", desc: "التزم بروتوكولك 30 يوماً" },
  { id: "s12", title: "تقرير التكلفة", icon: "dollarsign.circle.fill", route: "/cost-report", desc: "تكلفة مكملاتك الشهرية" },
  { id: "s13", title: "تقييم المنتجات", icon: "star.fill", route: "/product-reviews", desc: "تجارب المستخدمين" },
  { id: "s14", title: "الأكاديمية", icon: "graduationcap.fill", route: "/academy", desc: "تعلّم علم المكملات" },
  { id: "s15", title: "تصدير PDF", icon: "doc.fill", route: "/export-pdf", desc: "صدّر ملفك الصحي" },
  { id: "s16", title: "النسخ الاحتياطي", icon: "externaldrive.fill", route: "/backup", desc: "احفظ بياناتك وأعدها" },
  { id: "s17", title: "الإعدادات", icon: "gearshape.fill", route: "/settings", desc: "الثيم والإشعارات والخصوصية" },
  { id: "s18", title: "ما الجديد؟", icon: "sparkles", route: "/whats-new", desc: "آخر الميزات المضافة" },
];

// ─── Article titles for search ───────────────────────────────────────────────
const ARTICLE_TITLES = [
  "أفضل وقت لتناول الفيتامينات",
  "فيتامين D والمناعة: الحقيقة الكاملة",
  "المغنيسيوم: المعدن المنسي",
  "أوميغا-3 والقلب: ماذا تقول الدراسات؟",
  "الكرياتين: الحقائق والأساطير",
  "الكولاجين: هل يعمل فعلاً؟",
  "البروبيوتيك وصحة الأمعاء",
  "الزنك والمناعة والتعافي",
];

type ResultType = "product" | "screen" | "article";
interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  icon: string;
  route?: string;
  productId?: string;
}

export default function GlobalSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { products } = useSupplements();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase().trim();

    const productResults: SearchResult[] = products
      .filter(
        (p) =>
          p.name_ar.toLowerCase().includes(q) ||
          p.name_en.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category_ar?.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((p) => ({
        id: `p-${p.id}`,
        type: "product",
        title: p.name_ar,
        subtitle: `${p.brand} · تقييم ${p.score}/10`,
        icon: "pills.fill",
        productId: p.id,
      }));

    const screenResults: SearchResult[] = SCREENS.filter(
      (s) =>
        s.title.includes(q) ||
        s.desc.includes(q)
    )
      .slice(0, 4)
      .map((s) => ({
        id: s.id,
        type: "screen",
        title: s.title,
        subtitle: s.desc,
        icon: s.icon,
        route: s.route,
      }));

    const articleResults: SearchResult[] = ARTICLE_TITLES.filter((a) =>
      a.includes(q)
    )
      .slice(0, 3)
      .map((a, i) => ({
        id: `a-${i}`,
        type: "article",
        title: a,
        subtitle: "مقال علمي",
        icon: "book.fill",
        route: "/(tabs)/library",
      }));

    setResults([...productResults, ...screenResults, ...articleResults]);
  }, [query, products]);

  const typeLabel: Record<ResultType, string> = {
    product: "منتج",
    screen: "شاشة",
    article: "مقال",
  };
  const typeColor: Record<ResultType, string> = {
    product: "#0ea5e9",
    screen: "#8b5cf6",
    article: "#10b981",
  };

  function handleSelect(item: SearchResult) {
    if (item.type === "product" && item.productId) {
      router.push(`/product/${item.productId}` as any);
    } else if (item.route) {
      router.push(item.route as any);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.right" size={22} color={colors.muted} />
        </Pressable>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.foreground, fontFamily: "Cairo" }]}
          placeholder="ابحث في المكملات، الشاشات، المقالات..."
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          textAlign="right"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} style={styles.clearBtn}>
            <IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* Results */}
      {query.trim() === "" ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon]}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
            ابحث عن أي شيء
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.muted, fontFamily: "Cairo" }]}>
            منتجات، فيتامينات، معادن، شاشات، مقالات...
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>😕</Text>
          <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
            لا توجد نتائج
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.muted, fontFamily: "Cairo" }]}>
            جرّب كلمة مختلفة
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelect(item)}
              style={({ pressed }) => [
                styles.resultCard,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View style={styles.resultRight}>
                <View style={[styles.iconBg, { backgroundColor: typeColor[item.type] + "22" }]}>
                  <Text style={styles.iconEmoji}>
                    {item.type === "product" ? "💊" : item.type === "article" ? "📖" : "📱"}
                  </Text>
                </View>
                <View style={styles.resultText}>
                  <Text style={[styles.resultTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.resultSub, { color: colors.muted, fontFamily: "Cairo" }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: typeColor[item.type] + "22" }]}>
                <Text style={[styles.typeText, { color: typeColor[item.type], fontFamily: "Cairo-Bold" }]}>
                  {typeLabel[item.type]}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    margin: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  backBtn: { padding: 4 },
  input: { flex: 1, fontSize: 15, fontFamily: "Cairo" },
  clearBtn: { padding: 4 },
  list: { padding: 16, gap: 10 },
  resultCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  resultRight: { flexDirection: "row-reverse", alignItems: "center", gap: 12, flex: 1 },
  iconBg: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  iconEmoji: { fontSize: 22 },
  resultText: { flex: 1, alignItems: "flex-end", gap: 2 },
  resultTitle: { fontSize: 14, fontFamily: "Cairo-Bold" },
  resultSub: { fontSize: 11, fontFamily: "Cairo" },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 11, fontFamily: "Cairo-Bold" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontFamily: "Cairo-Bold" },
  emptyDesc: { fontSize: 13, fontFamily: "Cairo", textAlign: "center" },
});
