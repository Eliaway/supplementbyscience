import { useRouter } from "expo-router";
import { I18nManager, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { CATEGORY_COLORS, CATEGORY_ICONS, useSupplements } from "@/hooks/use-supplements";

I18nManager.forceRTL(true);

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { categories, getTopProducts, totalProducts, totalCategories } = useSupplements();
  const topProducts = getTopProducts(6);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.surface }]}>
          <View style={styles.headerContent}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
            />
            <View style={styles.headerText}>
              <Text style={[styles.appName, { color: colors.primary }]}>علم المكملات</Text>
              <Text style={[styles.appSubtitle, { color: colors.muted }]}>تقييم علمي موثوق</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{totalProducts}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>منتج</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.secondary }]}>{totalCategories}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>فئة</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.success }]}>4</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>مواقع</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الفئات</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => {
              const catColor = CATEGORY_COLORS[cat.id] || "#64748B";
              const catIcon = CATEGORY_ICONS[cat.id] || "pills.fill";
              return (
                <Pressable
                  key={cat.id}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    { backgroundColor: colors.card, borderColor: catColor + "40" },
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() => router.push({ pathname: "/(tabs)/products", params: { category: cat.id } })}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: catColor + "20" }]}>
                    <IconSymbol name={catIcon as any} size={22} color={catColor} />
                  </View>
                  <Text style={[styles.categoryName, { color: colors.foreground }]} numberOfLines={2}>
                    {cat.name_ar}
                  </Text>
                  <Text style={[styles.categoryCount, { color: catColor }]}>{cat.count} منتج</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Top Rated */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأعلى تقييماً</Text>
            <Pressable onPress={() => router.push("/(tabs)/products")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>عرض الكل</Text>
            </Pressable>
          </View>
          {topProducts.map((product) => {
            const catColor = CATEGORY_COLORS[product.category] || "#64748B";
            return (
              <Pressable
                key={product.id}
                style={({ pressed }) => [
                  styles.productCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } })}
              >
                <View style={[styles.productIcon, { backgroundColor: catColor + "20" }]}>
                  <IconSymbol name={(CATEGORY_ICONS[product.category] || "pills.fill") as any} size={24} color={catColor} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.foreground }]}>{product.name_en}</Text>
                  <Text style={[styles.productBrand, { color: colors.muted }]}>{product.brand}</Text>
                  <View style={styles.productMeta}>
                    <View style={[styles.categoryBadge, { backgroundColor: catColor + "20" }]}>
                      <Text style={[styles.categoryBadgeText, { color: catColor }]}>{product.category_ar}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.scoreNumber, { color: colors.primary }]}>{product.score.toFixed(1)}</Text>
                  <IconSymbol name="star.fill" size={12} color={colors.primary} />
                  <Text style={[styles.scoreMax, { color: colors.muted }]}>/10</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>ابدأ الآن</Text>
          <View style={styles.quickActions}>
            <Pressable
              style={({ pressed }) => [
                styles.quickAction,
                { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" },
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => router.push("/(tabs)/courses")}
            >
              <IconSymbol name="graduationcap.fill" size={28} color={colors.primary} />
              <Text style={[styles.quickActionTitle, { color: colors.foreground }]}>بناء كورس مخصص</Text>
              <Text style={[styles.quickActionDesc, { color: colors.muted }]}>أجب على أسئلة وخذ توصياتك</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.quickAction,
                { backgroundColor: colors.secondary + "15", borderColor: colors.secondary + "40" },
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => router.push("/(tabs)/compare")}
            >
              <IconSymbol name="arrow.left.arrow.right" size={28} color={colors.secondary} />
              <Text style={[styles.quickActionTitle, { color: colors.foreground }]}>مقارنة المنتجات</Text>
              <Text style={[styles.quickActionDesc, { color: colors.muted }]}>قارن منتجين جنباً إلى جنب</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  headerText: { flex: 1, alignItems: "flex-end" },
  appName: { fontSize: 22, fontWeight: "800" },
  appSubtitle: { fontSize: 13, marginTop: 2 },
  statsRow: {
    flexDirection: "row-reverse",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderBottomWidth: 0.5,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "800" },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, marginVertical: 4 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: "600" },
  categoriesGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryCard: {
    width: "30%",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    gap: 6,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  categoryCount: { fontSize: 10, fontWeight: "700" },
  productCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: { flex: 1, alignItems: "flex-end" },
  productName: { fontSize: 15, fontWeight: "700" },
  productBrand: { fontSize: 12, marginTop: 2 },
  productMeta: { flexDirection: "row-reverse", marginTop: 6, gap: 6 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  categoryBadgeText: { fontSize: 10, fontWeight: "600" },
  scoreContainer: { alignItems: "center", gap: 2 },
  scoreNumber: { fontSize: 20, fontWeight: "800" },
  scoreMax: { fontSize: 10 },
  quickActions: { flexDirection: "row-reverse", gap: 12 },
  quickAction: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    gap: 8,
  },
  quickActionTitle: { fontSize: 14, fontWeight: "700", textAlign: "center" },
  quickActionDesc: { fontSize: 11, textAlign: "center", lineHeight: 16 },
});
