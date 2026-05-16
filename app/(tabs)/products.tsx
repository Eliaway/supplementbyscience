import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { CATEGORY_COLORS, CATEGORY_ICONS, Product, useSupplements } from "@/hooks/use-supplements";

I18nManager.forceRTL(true);

const SORT_OPTIONS = [
  { id: "score", label: "الأعلى تقييماً" },
  { id: "name", label: "الاسم" },
  { id: "brand", label: "الشركة" },
];

export default function ProductsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { products, categories } = useSupplements();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(params.category || "all");
  const [sortBy, setSortBy] = useState("score");

  useEffect(() => {
    if (params.category) setSelectedCategory(params.category);
  }, [params.category]);

  const filtered = products
    .filter((p) => {
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        p.name_en.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category_ar.includes(search) ||
        p.key_ingredients.some((i) => i.toLowerCase().includes(q));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "name") return a.name_en.localeCompare(b.name_en);
      if (sortBy === "brand") return a.brand.localeCompare(b.brand);
      return 0;
    });

  const renderProduct = ({ item }: { item: Product }) => {
    const catColor = CATEGORY_COLORS[item.category] || "#64748B";
    const catIcon = CATEGORY_ICONS[item.category] || "pills.fill";
    const scoreColor =
      item.score >= 9 ? colors.success :
      item.score >= 7.5 ? colors.primary :
      colors.warning;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.productCard,
          { backgroundColor: colors.card, borderColor: catColor + "30" },
          pressed && { opacity: 0.75 },
        ]}
        onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
      >
        <View style={styles.productRow}>
          <View style={[styles.productIcon, { backgroundColor: catColor + "20" }]}>
            <IconSymbol name={catIcon as any} size={26} color={catColor} />
          </View>
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.foreground }]}>{item.name_en}</Text>
            <Text style={[styles.productBrand, { color: colors.muted }]}>{item.brand}</Text>
            <View style={[styles.catBadge, { backgroundColor: catColor + "20" }]}>
              <Text style={[styles.catBadgeText, { color: catColor }]}>{item.category_ar}</Text>
            </View>
          </View>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreNum, { color: scoreColor }]}>{item.score.toFixed(1)}</Text>
            <Text style={[styles.scoreSub, { color: colors.muted }]}>/10</Text>
          </View>
        </View>
        <View style={styles.keyIngRow}>
          {item.key_ingredients.slice(0, 3).map((ing, i) => (
            <View key={i} style={[styles.ingChip, { backgroundColor: colors.surface }]}>
              <Text style={[styles.ingChipText, { color: colors.muted }]} numberOfLines={1}>{ing}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>المنتجات</Text>
        <Text style={[styles.headerCount, { color: colors.muted }]}>{filtered.length} منتج</Text>
      </View>

      <View style={[styles.searchRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="ابحث عن منتج أو مكوّن..."
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterScroll, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
        contentContainerStyle={styles.filterContent}
      >
        <Pressable
          style={[
            styles.filterChip,
            selectedCategory === "all"
              ? { backgroundColor: colors.primary, borderColor: colors.primary }
              : { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => setSelectedCategory("all")}
        >
          <Text style={[styles.filterChipText, { color: selectedCategory === "all" ? "#fff" : colors.muted }]}>الكل</Text>
        </Pressable>
        {categories.map((cat) => {
          const catColor = CATEGORY_COLORS[cat.id] || "#64748B";
          const isActive = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[
                styles.filterChip,
                isActive
                  ? { backgroundColor: catColor, borderColor: catColor }
                  : { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.filterChipText, { color: isActive ? "#fff" : colors.muted }]}>{cat.name_ar}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.sortRow, { backgroundColor: colors.background }]}>
        <Text style={[styles.sortLabel, { color: colors.muted }]}>ترتيب:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              style={[
                styles.sortChip,
                sortBy === opt.id
                  ? { backgroundColor: colors.primary + "20", borderColor: colors.primary }
                  : { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setSortBy(opt.id)}
            >
              <Text style={[styles.sortChipText, { color: sortBy === opt.id ? colors.primary : colors.muted }]}>{opt.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>لا توجد نتائج</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", fontFamily: "Cairo-Black" },
  headerCount: { fontSize: 13, fontFamily: "Cairo" },
  searchRow: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 0.5 },
  searchBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Cairo" },
  filterScroll: { maxHeight: 52, borderBottomWidth: 0.5 },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: 12, fontWeight: "600", fontFamily: "Cairo-Bold" },
  sortRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  sortLabel: { fontSize: 12, fontFamily: "Cairo" },
  sortChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, borderWidth: 1 },
  sortChipText: { fontSize: 11, fontWeight: "600", fontFamily: "Cairo-Bold" },
  listContent: { padding: 16, gap: 12 },
  productCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  productRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  productIcon: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  productInfo: { flex: 1, alignItems: "flex-end", gap: 4 },
  productName: { fontSize: 15, fontWeight: "700", fontFamily: "Cairo-Bold" },
  productBrand: { fontSize: 12, fontFamily: "Cairo" },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  catBadgeText: { fontSize: 10, fontWeight: "600", fontFamily: "Cairo-Bold" },
  scoreBox: { alignItems: "center", gap: 2 },
  scoreNum: { fontSize: 22, fontWeight: "800", fontFamily: "Cairo-Black" },
  scoreSub: { fontSize: 10, fontFamily: "Cairo" },
  keyIngRow: { flexDirection: "row-reverse", gap: 6, flexWrap: "wrap" },
  ingChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  ingChipText: { fontSize: 10, fontFamily: "Cairo" },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: "Cairo" },
});
