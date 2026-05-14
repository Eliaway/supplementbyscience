import { useRouter } from "expo-router";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { CATEGORY_COLORS, CATEGORY_ICONS, useSupplements } from "@/hooks/use-supplements";

I18nManager.forceRTL(true);

const QUICK_ACTIONS = [
  {
    id: "courses",
    icon: "graduationcap.fill" as const,
    title: "كورس مخصص",
    desc: "خطة بناءً على أهدافك",
    route: "/(tabs)/courses" as const,
    colorKey: "primary",
  },
  {
    id: "compare",
    icon: "arrow.left.arrow.right" as const,
    title: "مقارنة",
    desc: "قارن منتجين علمياً",
    route: "/(tabs)/compare" as const,
    colorKey: "secondary",
  },
  {
    id: "profile",
    icon: "person.crop.circle.fill" as const,
    title: "ملفي الصحي",
    desc: "بياناتك وجرعاتك",
    route: "/(tabs)/profile" as const,
    colorKey: "accent",
  },
  {
    id: "tools",
    icon: "wand.and.stars" as const,
    title: "الأدوات",
    desc: "حاسبات وتشخيص",
    route: "/(tabs)/tools" as const,
    colorKey: "success",
  },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { categories, getTopProducts, totalProducts, totalCategories } = useSupplements();
  const topProducts = getTopProducts(5);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─── */}
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: colors.muted }]}>مرحباً بك في</Text>
              <Text style={[styles.appName, { color: colors.primary }]}>علم المكملات</Text>
            </View>
            <View style={[styles.headerBadge, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "40" }]}>
              <IconSymbol name="flask.fill" size={20} color={colors.primary} />
              <Text style={[styles.headerBadgeText, { color: colors.primary }]}>علمي موثوق</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {[
              { value: totalProducts, label: "منتج", color: colors.primary, icon: "pills.fill" as const },
              { value: totalCategories, label: "فئة", color: colors.secondary, icon: "square.grid.2x2.fill" as const },
              { value: 4, label: "مواقع", color: colors.accent, icon: "building.2.fill" as const },
              { value: "100%", label: "علمي", color: colors.success, icon: "checkmark.seal.fill" as const },
            ].map((stat, i) => (
              <View key={i} style={styles.statItem}>
                <IconSymbol name={stat.icon} size={16} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Quick Actions ─── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأدوات الرئيسية</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((action) => {
              const color = colors[action.colorKey as keyof typeof colors] as string;
              return (
                <Pressable
                  key={action.id}
                  style={({ pressed }) => [
                    styles.quickCard,
                    { backgroundColor: colors.card, borderColor: color + "35" },
                    pressed && { opacity: 0.72, transform: [{ scale: 0.97 }] },
                  ]}
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={[styles.quickIcon, { backgroundColor: color + "20" }]}>
                    <IconSymbol name={action.icon} size={26} color={color} />
                  </View>
                  <Text style={[styles.quickTitle, { color: colors.foreground }]}>{action.title}</Text>
                  <Text style={[styles.quickDesc, { color: colors.muted }]}>{action.desc}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ─── Categories ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الفئات الصحية</Text>
            <Pressable onPress={() => router.push("/(tabs)/products" as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>عرض الكل ←</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((cat) => {
              const catColor = CATEGORY_COLORS[cat.id] || "#64748B";
              const catIcon = CATEGORY_ICONS[cat.id] || "pills.fill";
              return (
                <Pressable
                  key={cat.id}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    { backgroundColor: colors.card, borderColor: catColor + "50" },
                    pressed && { opacity: 0.72 },
                  ]}
                  onPress={() => router.push({ pathname: "/(tabs)/products", params: { category: cat.id } } as any)}
                >
                  <View style={[styles.chipIcon, { backgroundColor: catColor + "20" }]}>
                    <IconSymbol name={catIcon as any} size={18} color={catColor} />
                  </View>
                  <View>
                    <Text style={[styles.chipName, { color: colors.foreground }]}>{cat.name_ar}</Text>
                    <Text style={[styles.chipCount, { color: catColor }]}>{cat.count} منتج</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ─── Top Rated ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأعلى تقييماً</Text>
            <Pressable onPress={() => router.push("/(tabs)/products" as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>عرض الكل ←</Text>
            </Pressable>
          </View>
          {topProducts.map((product, idx) => {
            const catColor = CATEGORY_COLORS[product.category] || "#64748B";
            const scoreColor = product.score >= 8.5 ? colors.success : product.score >= 7 ? colors.accent : colors.warning;
            return (
              <Pressable
                key={product.id}
                style={({ pressed }) => [
                  styles.productRow,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } } as any)}
              >
                {/* Rank */}
                <View style={[styles.rankBadge, { backgroundColor: idx < 3 ? colors.accent + "25" : colors.border }]}>
                  <Text style={[styles.rankText, { color: idx < 3 ? colors.accent : colors.muted }]}>#{idx + 1}</Text>
                </View>

                {/* Icon */}
                <View style={[styles.productIcon, { backgroundColor: catColor + "20" }]}>
                  <IconSymbol name={(CATEGORY_ICONS[product.category] || "pills.fill") as any} size={22} color={catColor} />
                </View>

                {/* Info */}
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>{product.name_en}</Text>
                  <Text style={[styles.productBrand, { color: colors.muted }]}>{product.brand}</Text>
                  <View style={[styles.catBadge, { backgroundColor: catColor + "18" }]}>
                    <Text style={[styles.catBadgeText, { color: catColor }]}>{product.category_ar}</Text>
                  </View>
                </View>

                {/* Score */}
                <View style={[styles.scorePill, { backgroundColor: scoreColor + "20", borderColor: scoreColor + "50" }]}>
                  <Text style={[styles.scoreNum, { color: scoreColor }]}>{product.score.toFixed(1)}</Text>
                  <IconSymbol name="star.fill" size={10} color={scoreColor} />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* ─── Banner: AI Assistant ─── */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: colors.primary + "12", borderColor: colors.primary + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/(tabs)/tools" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: colors.primary + "20" }]}>
              <IconSymbol name="sparkles" size={28} color={colors.primary} />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>مساعد AI المتخصص</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>تحليل التحاليل المخبرية • خبير الهرمونات • توصيات مخصصة</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* ─── Banner: Health Profile ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: colors.accent + "12", borderColor: colors.accent + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/(tabs)/profile" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: colors.accent + "20" }]}>
              <IconSymbol name="person.crop.circle.fill" size={28} color={colors.accent} />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>ملفك الصحي الشخصي</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>جدول الجرعات • مكملاتي • تقرير PDF</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color={colors.accent} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
  },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: { alignItems: "flex-end" },
  greeting: { fontSize: 12, marginBottom: 2 },
  appName: { fontSize: 26, fontWeight: "900", letterSpacing: -0.5 },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  headerBadgeText: { fontSize: 11, fontWeight: "700" },

  // Stats
  statsRow: {
    flexDirection: "row-reverse",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 10, fontWeight: "500" },

  // Sections
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", marginBottom: 14 },
  seeAll: { fontSize: 13, fontWeight: "600" },

  // Quick Actions
  quickGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
  },
  quickCard: {
    width: "47.5%",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  quickTitle: { fontSize: 14, fontWeight: "800" },
  quickDesc: { fontSize: 11, lineHeight: 16 },

  // Categories horizontal scroll
  categoriesScroll: {
    gap: 10,
    paddingRight: 4,
  },
  categoryChip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  chipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  chipName: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  chipCount: { fontSize: 10, fontWeight: "600", textAlign: "right" },

  // Product rows
  productRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    gap: 10,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { fontSize: 12, fontWeight: "800" },
  productIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: { flex: 1, alignItems: "flex-end", gap: 3 },
  productName: { fontSize: 14, fontWeight: "700" },
  productBrand: { fontSize: 11 },
  catBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  catBadgeText: { fontSize: 10, fontWeight: "600" },
  scorePill: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  scoreNum: { fontSize: 16, fontWeight: "900" },

  // AI Banner
  aiBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  aiBannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  aiBannerText: { flex: 1, alignItems: "flex-end", gap: 4 },
  aiBannerTitle: { fontSize: 15, fontWeight: "800" },
  aiBannerDesc: { fontSize: 11, textAlign: "right", lineHeight: 16 },
});
