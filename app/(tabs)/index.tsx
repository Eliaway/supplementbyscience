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

        {/* ─── Banner: Protocols ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#22C55E" + "12", borderColor: "#22C55E" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/protocols" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#22C55E" + "20" }]}>
              <IconSymbol name="list.bullet.clipboard.fill" size={28} color="#22C55E" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>البروتوكولات المتخصصة</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>كبد • قلب • هرمونات • نوم • دماغ • مناعة • جلد • رياضة</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#22C55E" />
          </Pressable>
        </View>

        {/* ─── Banner: Library ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#8B5CF6" + "12", borderColor: "#8B5CF6" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/(tabs)/library" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#8B5CF6" + "20" }]}>
              <IconSymbol name="book.fill" size={28} color="#8B5CF6" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>المكتبة العلمية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>مقالات • بدائل غذائية • قائمة WADA • منتجات Vegan</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#8B5CF6" />
          </Pressable>
        </View>
        {/* ─── Banner: Advanced Protocols ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#EF4444" + "12", borderColor: "#EF4444" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/protocols-advanced" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#EF4444" + "20" }]}>
              <IconSymbol name="heart.circle.fill" size={28} color="#EF4444" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>بروتوكولات متقدمة</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>خصوبة • زهايمر • عظام • ألم • دورة دموية • جلد • نوم</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#EF4444" />
          </Pressable>
        </View>

        {/* ─── Banner: Special Groups ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#F97316" + "12", borderColor: "#F97316" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/special-groups" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#F97316" + "20" }]}>
              <IconSymbol name="person.3.fill" size={28} color="#F97316" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>فئات خاصة</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>أطفال • أطباء • طلاب • مسافرون • مدخنون • إرهاق وظيفي</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#F97316" />
          </Pressable>
        </View>

        {/* ─── Banner: Progress Tracking ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#06B6D4" + "12", borderColor: "#06B6D4" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/progress" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#06B6D4" + "20" }]}>
              <IconSymbol name="chart.bar.fill" size={28} color="#06B6D4" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>متابعة التقدم</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>سجل يومي • تقرير أسبوعي • رسوم بيانية</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#06B6D4" />
          </Pressable>
        </View>

        {/* ─── Banner: Shopping List ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#10B981" + "12", borderColor: "#10B981" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/shopping-list" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#10B981" + "20" }]}>
              <IconSymbol name="cart.fill" size={28} color="#10B981" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>قائمة التسوق الذكية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>أضف مكملاتك وتتبع مخزونك</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#10B981" />
          </Pressable>
        </View>

        {/* ─── Banner: Sustainability ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#10B981" + "08", borderColor: "#10B981" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/sustainability" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#10B981" + "15" }]}>
              <IconSymbol name="leaf.fill" size={28} color="#10B981" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الاستدامة والبيئة 🌱</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>مكملات صديقة للكوكب • بدائل مستدامة</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#10B981" />
          </Pressable>
        </View>

        {/* ─── Banner: Academy ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#7C3AED" + "12", borderColor: "#7C3AED" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/academy" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#7C3AED" + "20" }]}>
              <IconSymbol name="graduationcap.fill" size={28} color="#7C3AED" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الأكاديمية العلمية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>دليل الجودة • الأساطير والحقائق • توقيت المكملات</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#7C3AED" />
          </Pressable>
        </View>

        {/* ─── Banner: Knowledge Quiz ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#0EA5E9" + "12", borderColor: "#0EA5E9" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/knowledge-quiz" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#0EA5E9" + "20" }]}>
              <IconSymbol name="brain.head.profile" size={28} color="#0EA5E9" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>اختبار المعرفة العلمية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>20 سؤالاً • اختبر معرفتك بالمكملات الغذائية</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#0EA5E9" />
          </Pressable>
        </View>

        {/* ─── Banner: Skin & Beauty ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#EC4899" + "12", borderColor: "#EC4899" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/skin-beauty" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#EC4899" + "20" }]}>
              <IconSymbol name="sparkles" size={28} color="#EC4899" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الجلد والشعر والجمال</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>بروتوكولات متخصصة • مكملات مضادة للشيخوخة</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#EC4899" />
          </Pressable>
        </View>

        {/* ─── Banner: Longevity ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#0f172a" + "12", borderColor: "#334155" + "80" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/longevity" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#F59E0B" + "20" }]}>
              <IconSymbol name="infinity" size={28} color="#F59E0B" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الطول العمر ومكافحة الشيخوخة</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>NAD+ • الأوتوفاجي • التيلومير • Senolytics • الميتوكوندريا</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#F59E0B" />
          </Pressable>
        </View>

        {/* ─── Banner: Nootropics ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#1e1b4b" + "12", borderColor: "#6366F1" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/nootropics" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#6366F1" + "20" }]}>
              <IconSymbol name="brain.head.profile" size={28} color="#6366F1" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الأداء الذهني والنوتروبيكس</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>ذاكرة • تركيز • مزاج • حماية عصبية • نوم ذكي</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#6366F1" />
          </Pressable>
        </View>

        {/* ─── Banner: Sports Performance ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#EF4444" + "08", borderColor: "#EF4444" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/sports-performance" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#EF4444" + "20" }]}>
              <IconSymbol name="figure.run" size={28} color="#EF4444" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الأداء الرياضي والتعافي</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>قوة • تحمل • تركيبة جسمية • توقيت المكملات</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#EF4444" />
          </Pressable>
        </View>

        {/* ─── Banner: Hormone Balance ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#EC4899" + "08", borderColor: "#EC4899" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/hormone-balance" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#EC4899" + "20" }]}>
              <IconSymbol name="heart.circle.fill" size={28} color="#EC4899" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>توازن الهرمونات للمرأة</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>دورة شهرية • حمل ورضاعة • انقطاع الطمث</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#EC4899" />
          </Pressable>
        </View>

        {/* ─── Banner: Gut Brain ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#10B981" + "08", borderColor: "#10B981" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/gut-brain" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#10B981" + "20" }]}>
              <IconSymbol name="brain.head.profile" size={28} color="#10B981" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>محور الأمعاء والدماغ</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>Gut-Brain Axis • بروبيوتيك نفسي • ناقلات عصبية</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#10B981" />
          </Pressable>
        </View>

        {/* ─── Banner: Inflammation Tracker ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#EF4444" + "08", borderColor: "#EF4444" + "25" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/inflammation-tracker" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#EF4444" + "20" }]}>
              <IconSymbol name="flame.fill" size={28} color="#EF4444" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>مؤشر الأكسدة والالتهاب</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>تقييم مستوى الالتهاب المزمن والجذور الحرة</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#EF4444" />
          </Pressable>
        </View>

        {/* ─── Banner: Personalized Protocols ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#8B5CF6" + "08", borderColor: "#8B5CF6" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/personalized-protocols" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#8B5CF6" + "20" }]}>
              <IconSymbol name="person.crop.circle.badge.checkmark" size={28} color="#8B5CF6" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>البروتوكول الشخصي</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>فصيلة الدم • نوع الأيض • الكرونوتايب • مستوى النشاط</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#8B5CF6" />
          </Pressable>
        </View>

        {/* ─── Banner: Doctor Mode ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#1e3a5f" + "12", borderColor: "#2d4f7a" + "60" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/doctor-mode" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#1e3a5f" + "20" }]}>
              <IconSymbol name="stethoscope" size={28} color="#1e3a5f" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>وضع الطبيب</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>ملخص طبي احترافي • مشاركة مع طبيبك أو صيدلانيك</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#1e3a5f" />
          </Pressable>
        </View>

        {/* ─── Banner: Sexual Health ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#EC4899" + "08", borderColor: "#EC4899" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/sexual-health" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#EC4899" + "20" }]}>
              <IconSymbol name="heart.fill" size={28} color="#EC4899" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الصحة الجنسية والخصوبة</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>بروتوكولات الخصوبة • صحة البروستاتا • الأداء الجنسي</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#EC4899" />
          </Pressable>
        </View>

        {/* ─── Banner: Children Supplements ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#8B5CF6" + "08", borderColor: "#8B5CF6" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/children-supplements" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#8B5CF6" + "20" }]}>
              <IconSymbol name="figure.and.child.holdinghands" size={28} color="#8B5CF6" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>مكملات الأطفال والمراهقين</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>دليل آمن حسب الفئة العمرية • ADHD • النمو</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#8B5CF6" />
          </Pressable>
        </View>

        {/* ─── Banner: Cancer Prevention ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#EF4444" + "08", borderColor: "#EF4444" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/cancer-prevention" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#EF4444" + "20" }]}>
              <IconSymbol name="cross.circle.fill" size={28} color="#EF4444" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الوقاية من السرطان</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>مكملات الوقاية • دعم مرضى الكيماوي • أطعمة مضادة</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#EF4444" />
          </Pressable>
        </View>

        {/* ─── Banner: Travel Supplements ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#6366F1" + "08", borderColor: "#6366F1" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/travel-supplements" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#6366F1" + "20" }]}>
              <IconSymbol name="airplane" size={28} color="#6366F1" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>مكملات المسافر</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>Jet Lag • مرض الارتفاع • الوقاية أثناء السفر</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#6366F1" />
          </Pressable>
        </View>

        {/* ─── Banner: Smoking Detox ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#F59E0B" + "08", borderColor: "#F59E0B" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/smoking-detox" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#F59E0B" + "20" }]}>
              <IconSymbol name="wind" size={28} color="#F59E0B" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>التدخين والإقلاع</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>مكملات المدخنين • بروتوكول الإقلاع • إزالة السموم</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#F59E0B" />
          </Pressable>
        </View>

        {/* ─── Banner: Cycling Guide ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#3B82F6" + "08", borderColor: "#3B82F6" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/cycling-guide" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#3B82F6" + "20" }]}>
              <IconSymbol name="arrow.clockwise" size={28} color="#3B82F6" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>دورات المكملات</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>متى تأخذ راحة • منع التحمل • جدول الدورات</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#3B82F6" />
          </Pressable>
        </View>

        {/* ─── Banner: Brands Guide ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#10B981" + "08", borderColor: "#10B981" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/brands-guide" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#10B981" + "20" }]}>
              <IconSymbol name="checkmark.seal.fill" size={28} color="#10B981" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>دليل العلامات التجارية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>أفضل الماركات • شهادات الجودة • علامات التحذير</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#10B981" />
          </Pressable>
        </View>

        {/* ─── Banner: Special Diets ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#F59E0B" + "08", borderColor: "#F59E0B" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/special-diets" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#F59E0B" + "20" }]}>
              <IconSymbol name="fork.knife" size={28} color="#F59E0B" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>مكملات الأنظمة الغذائية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>كيتو • نباتي • لحوم • صيام متقطع</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#F59E0B" />
          </Pressable>
        </View>

        {/* ─── Banner: Research Hub ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#6366F1" + "08", borderColor: "#6366F1" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/research-hub" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#6366F1" + "20" }]}>
              <IconSymbol name="magnifyingglass" size={28} color="#6366F1" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>مركز الأبحاث العلمية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>أحدث الدراسات • مستوى الأدلة • تصحيح الأساطير</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#6366F1" />
          </Pressable>
        </View>

        {/* ─── Banner: Budget Guide ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#10B981" + "08", borderColor: "#10B981" + "25" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/budget-guide" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#10B981" + "20" }]}>
              <IconSymbol name="dollarsign.circle.fill" size={28} color="#10B981" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>دليل الميزانية والتوفير</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>أفضل قيمة مقابل السعر • نصائح التوفير</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#10B981" />
          </Pressable>
        </View>

        {/* ─── Banner: FAQ ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#8B5CF6" + "08", borderColor: "#8B5CF6" + "25" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/faq" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#8B5CF6" + "20" }]}>
              <IconSymbol name="questionmark.circle.fill" size={28} color="#8B5CF6" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الأسئلة الشائعة</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>إجابات علمية لأكثر الأسئلة شيوعاً</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#8B5CF6" />
          </Pressable>
        </View>

        {/* ─── Banner: News ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#3B82F6" + "08", borderColor: "#3B82F6" + "25" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/news" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#3B82F6" + "20" }]}>
              <IconSymbol name="newspaper.fill" size={28} color="#3B82F6" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>أخبار عالم المكملات</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>آخر الأبحاث • التحديثات العلمية • المكملات الرائجة</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#3B82F6" />
          </Pressable>
        </View>

        {/* ─── Banner: Mental Health ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#8B5CF6" + "08", borderColor: "#8B5CF6" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/mental-health" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#8B5CF6" + "20" }]}>
              <IconSymbol name="brain.head.profile" size={28} color="#8B5CF6" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الصحة النفسية والتوتر</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>اكتئاب • قلق • إجهاد • مكملات المزاج</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#8B5CF6" />
          </Pressable>
        </View>

        {/* ─── Banner: Kidney Health ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#06B6D4" + "08", borderColor: "#06B6D4" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/kidney-health" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#06B6D4" + "20" }]}>
              <IconSymbol name="drop.fill" size={28} color="#06B6D4" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>صحة الكلى والمسالك البولية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>حصى الكلى • تنظيف الكلى • حماية الكلى</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#06B6D4" />
          </Pressable>
        </View>

        {/* ─── Banner: Respiratory Health ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#10B981" + "08", borderColor: "#10B981" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/respiratory-health" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#10B981" + "20" }]}>
              <IconSymbol name="lungs.fill" size={28} color="#10B981" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>صحة الجهاز التنفسي</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>ربو • حساسية • تقوية الرئتين</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#10B981" />
          </Pressable>
        </View>

        {/* ─── Banner: Blood Sugar ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#EF4444" + "08", borderColor: "#EF4444" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/blood-sugar" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#EF4444" + "20" }]}>
              <IconSymbol name="drop.degreesign.fill" size={28} color="#EF4444" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>سكر الدم والتمثيل الغذائي</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>مقاومة الأنسولين • توازن السكر • السكري</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#EF4444" />
          </Pressable>
        </View>

        {/* ─── Banner: Pain Management ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#F97316" + "08", borderColor: "#F97316" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/pain-management" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#F97316" + "20" }]}>
              <IconSymbol name="bandage.fill" size={28} color="#F97316" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>إدارة الألم والالتهاب</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>ألم مزمن • التهاب • بدائل طبيعية</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#F97316" />
          </Pressable>
        </View>

        {/* ─── Banner: Autoimmune ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#8B5CF6" + "08", borderColor: "#8B5CF6" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/autoimmune" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#8B5CF6" + "20" }]}>
              <IconSymbol name="shield.fill" size={28} color="#8B5CF6" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>أمراض المناعة الذاتية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>لوبس • رثيان • تهدئة المناعة</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#8B5CF6" />
          </Pressable>
        </View>

        {/* ─── Banner: Hair Health ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#EC4899" + "08", borderColor: "#EC4899" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/hair-health" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#EC4899" + "20" }]}>
              <IconSymbol name="sparkles" size={28} color="#EC4899" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>صحة الشعر وتساقط الشعر</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>بروتوكولات لتكثيف الشعر • منع التساقط</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#EC4899" />
          </Pressable>
        </View>

        {/* ─── Banner: Stacking Guide ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#6366F1" + "08", borderColor: "#6366F1" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/stacking-guide" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#6366F1" + "20" }]}>
              <IconSymbol name="square.stack.fill" size={28} color="#6366F1" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>دليل تكديس المكملات</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>تركيبات فعالة • ما يجمع وما لا يجمع</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#6366F1" />
          </Pressable>
        </View>

        {/* ─── Banner: Nutrition Advanced ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#10B981" + "08", borderColor: "#10B981" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/nutrition-advanced" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#10B981" + "20" }]}>
              <IconSymbol name="fork.knife" size={28} color="#10B981" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>التغذية المتقدمة والمغذيات الدقيقة</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>معادن • فيتامينات • أحماض أمينية</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#10B981" />
          </Pressable>
        </View>

        {/* ─── Banner: Weight Management ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#F59E0B" + "08", borderColor: "#F59E0B" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/weight-management" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#F59E0B" + "20" }]}>
              <IconSymbol name="figure.run" size={28} color="#F59E0B" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>إدارة الوزن والأيض الأيض</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>حرق الدهون • بناء العضلات • الأيض الأيض</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#F59E0B" />
          </Pressable>
        </View>

        {/* ─── Banner: Immune System ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#10B981" + "08", borderColor: "#10B981" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/immune-system" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#10B981" + "20" }]}>
              <IconSymbol name="shield.fill" size={28} color="#10B981" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الجهاز المناعي والوقاية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>بروتوكول يومي • إصابة حادة • حساسية موسمية</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#10B981" />
          </Pressable>
        </View>

        {/* ─── Banner: Eye Health ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#06B6D4" + "08", borderColor: "#06B6D4" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/eye-health" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#06B6D4" + "20" }]}>
              <IconSymbol name="eye.fill" size={28} color="#06B6D4" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>صحة العين والرؤية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>ماكولا • جلوكوما • تعب العين الرقمي</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#06B6D4" />
          </Pressable>
        </View>

        {/* ─── Banner: Dental Health ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#3B82F6" + "08", borderColor: "#3B82F6" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/dental-health" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#3B82F6" + "20" }]}>
              <IconSymbol name="cross.case.fill" size={28} color="#3B82F6" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>صحة الأسنان والفم</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>مكملات صحة الفم • تقوية المينا • التهاب اللثة</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#3B82F6" />
          </Pressable>
        </View>

        {/* ─── Banner: Traditional Medicine ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#78350F" + "12", borderColor: "#92400E" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/traditional-medicine" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#92400E" + "20" }]}>
              <IconSymbol name="leaf.fill" size={28} color="#92400E" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>الطب التقليدي والعلمي</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>طب صيني • آيورفيدا • طب نبوي • أدلة علمية</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#92400E" />
          </Pressable>
        </View>

        {/* ─── Banner: Protocols Extra ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#6366F1" + "08", borderColor: "#6366F1" + "30" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/protocols-extra" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#6366F1" + "20" }]}>
              <IconSymbol name="list.bullet.clipboard.fill" size={28} color="#6366F1" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>بروتوكولات إضافية</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>خصوبة • زهايمر • عظام • NAD+ • أوتوفاجي</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#6366F1" />
          </Pressable>
        </View>

        {/* ─── Banner: Whats New ─── */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.aiBanner,
              { backgroundColor: "#F59E0B" + "12", borderColor: "#F59E0B" + "40" },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/whats-new" as any)}
          >
            <View style={[styles.aiBannerIcon, { backgroundColor: "#F59E0B" + "20" }]}>
              <IconSymbol name="star.fill" size={28} color="#F59E0B" />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={[styles.aiBannerTitle, { color: colors.foreground }]}>ما الجديد ✨</Text>
              <Text style={[styles.aiBannerDesc, { color: colors.muted }]}>جميع الميزات المضافة • دليل استخدام التطبيق</Text>
            </View>
            <IconSymbol name="chevron.left" size={20} color="#F59E0B" />
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
