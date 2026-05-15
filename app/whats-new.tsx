/**
 * ما الجديد — What's New Screen
 * Feature #: Application Updates section
 */
import { FlatList, I18nManager, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface UpdateItem {
  version: string;
  date: string;
  badge: "جديد" | "تحسين" | "إصلاح";
  badgeColor: string;
  title: string;
  description: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  iconColor: string;
  route?: string;
}

const UPDATES: UpdateItem[] = [
  {
    version: "2.0",
    date: "مايو 2026",
    badge: "جديد",
    badgeColor: "#10B981",
    title: "مساعد AI مع 4 خبراء",
    description: "طبيب، صيدلاني، خبير تغذية، ومتخصص هرمونات — كل خبير يحلل ملفك الصحي بشكل مستقل ويجيب على أسئلتك",
    icon: "sparkles",
    iconColor: "#6366F1",
    route: "/(tabs)/ai",
  },
  {
    version: "2.0",
    date: "مايو 2026",
    badge: "جديد",
    badgeColor: "#10B981",
    title: "7 كورسات لحالات خاصة",
    description: "كورسات متخصصة للرياضيين، المرأة، كبار السن، السكري، الغدة الدرقية، الجهاز الهضمي، والصحة النفسية",
    icon: "person.2.fill",
    iconColor: "#EC4899",
    route: "/specialized-courses",
  },
  {
    version: "2.0",
    date: "مايو 2026",
    badge: "جديد",
    badgeColor: "#10B981",
    title: "10 بروتوكولات متخصصة",
    description: "بروتوكولات علمية: الكبد، القلب، الكلى، الهرمونات، النوم، الجلد، المناعة، الدماغ، الرياضة، والمفاصل",
    icon: "list.bullet.clipboard.fill",
    iconColor: "#F97316",
    route: "/protocols",
  },
  {
    version: "2.0",
    date: "مايو 2026",
    badge: "جديد",
    badgeColor: "#10B981",
    title: "المكتبة العلمية الشاملة",
    description: "مقالات علمية، بدائل غذائية طبيعية، قائمة WADA للرياضيين، وفلتر المنتجات النباتية",
    icon: "book.fill",
    iconColor: "#0EA5E9",
    route: "/(tabs)/library",
  },
  {
    version: "2.0",
    date: "مايو 2026",
    badge: "جديد",
    badgeColor: "#10B981",
    title: "تحليل التحاليل المخبرية بالـ AI",
    description: "أدخل نتائج تحاليلك واحصل على تفسير علمي وتوصيات مكملات مخصصة لحالتك",
    icon: "testtube.2",
    iconColor: "#8B5CF6",
    route: "/(tabs)/tools",
  },
  {
    version: "2.0",
    date: "مايو 2026",
    badge: "جديد",
    badgeColor: "#10B981",
    title: "أدوات تحليل متقدمة",
    description: "حاسبة BMI، محلل نمط الحياة، تقييم التعب المزمن، وحاسبة الجرعات المتقدمة",
    icon: "wrench.and.screwdriver.fill",
    iconColor: "#F59E0B",
    route: "/(tabs)/tools",
  },
  {
    version: "1.5",
    date: "أبريل 2026",
    badge: "تحسين",
    badgeColor: "#F59E0B",
    title: "الملف الصحي الشامل",
    description: "إضافة قسم الهرمونات، الأدوية المزمنة، والحساسيات مع تحليل التداخلات الدوائية",
    icon: "person.crop.circle.fill",
    iconColor: "#0EA5E9",
    route: "/(tabs)/profile",
  },
  {
    version: "1.5",
    date: "أبريل 2026",
    badge: "تحسين",
    badgeColor: "#F59E0B",
    title: "جدول الجرعات والإشعارات",
    description: "إشعارات فعلية على الهاتف لتذكيرك بمواعيد المكملات مع تحديد أفضل وقت للأخذ",
    icon: "bell.fill",
    iconColor: "#EC4899",
    route: "/(tabs)/profile",
  },
  {
    version: "1.0",
    date: "مارس 2026",
    badge: "جديد",
    badgeColor: "#10B981",
    title: "40 منتج في 12 فئة",
    description: "قاعدة بيانات شاملة للمكملات مع التحليل العلمي، التقييمات، والمقارنة بين المنتجات",
    icon: "pills.fill",
    iconColor: "#10B981",
    route: "/(tabs)/products",
  },
];

export default function WhatsNewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>ما الجديد ✨</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>آخر التحديثات والميزات المضافة</Text>
        </View>
      </View>

      <FlatList
        data={UPDATES}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && item.route && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => item.route && router.push(item.route as any)}
            disabled={!item.route}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconBg, { backgroundColor: item.iconColor + "15" }]}>
                <IconSymbol name={item.icon} size={22} color={item.iconColor} />
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <View style={styles.titleRow}>
                  <View style={[styles.badge, { backgroundColor: item.badgeColor + "20" }]}>
                    <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.title}</Text>
                </View>
                <Text style={[styles.cardDate, { color: colors.muted }]}>الإصدار {item.version} — {item.date}</Text>
              </View>
              {item.route && <IconSymbol name="chevron.left" size={16} color={colors.muted} />}
            </View>
            <Text style={[styles.cardDesc, { color: colors.foreground }]}>{item.description}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  card: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  cardTop: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  iconBg: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  titleRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, flexWrap: "wrap" },
  cardTitle: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  cardDate: { fontSize: 11, textAlign: "right", marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  cardDesc: { fontSize: 13, lineHeight: 20, textAlign: "right" },
});
