/**
 * الاستدامة والمكملات الصديقة للبيئة — Sustainability
 * Feature #145
 */
import { FlatList, I18nManager, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface SustainabilityTip {
  id: string;
  title: string;
  description: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  category: string;
}

interface EcoAlternative {
  supplement: string;
  conventional: string;
  sustainable: string;
  benefit: string;
}

const TIPS: SustainabilityTip[] = [
  {
    id: "t1",
    title: "اختر مكملات بتغليف قابل للتدوير",
    description: "ابحث عن شركات تستخدم زجاج أو بلاستيك قابل للتدوير (رمز ♻️ على العبوة). بعض الشركات تقبل إعادة العبوات الفارغة.",
    icon: "arrow.3.trianglepath",
    color: "#10B981",
    category: "التغليف",
  },
  {
    id: "t2",
    title: "أوميغا-3 من مصادر مستدامة",
    description: "ابحث عن شهادة MSC (Marine Stewardship Council) أو IFOS على منتجات الأوميغا-3. تضمن صيد مستدام لا يضر بالنظام البيئي البحري.",
    icon: "fish.fill",
    color: "#0EA5E9",
    category: "المصادر",
  },
  {
    id: "t3",
    title: "الكولاجين من مصادر أخلاقية",
    description: "اختر كولاجين من مصادر تُعامل الحيوانات بشكل أخلاقي (Grass-fed, Pasture-raised). الكولاجين البحري من الأسماك أقل تأثيراً بيئياً.",
    icon: "leaf.fill",
    color: "#84CC16",
    category: "المصادر",
  },
  {
    id: "t4",
    title: "الفيتامينات من مصادر نباتية",
    description: "D3 من الأشنة (Lichen) بدلاً من صوف الخراف. أوميغا-3 من الطحالب (Algal Oil) بدلاً من الأسماك — نفس DHA+EPA بدون صيد.",
    icon: "leaf.arrow.circlepath",
    color: "#22C55E",
    category: "البدائل النباتية",
  },
  {
    id: "t5",
    title: "شراء بالجملة يقلل النفايات",
    description: "شراء كميات أكبر يعني تغليف أقل. احسب احتياجك الشهري واشتر عبوات كبيرة — أوفر مالياً وأقل أثراً بيئياً.",
    icon: "shippingbox.fill",
    color: "#F97316",
    category: "عادات التسوق",
  },
  {
    id: "t6",
    title: "تجنب المكملات الزائدة",
    description: "أخذ مكملات لا تحتاجها هدر مالي وبيئي. اعتمد على تحاليل الدم لمعرفة ما تحتاجه فعلاً — الأقل أحياناً أفضل.",
    icon: "minus.circle.fill",
    color: "#8B5CF6",
    category: "الاستهلاك الواعي",
  },
  {
    id: "t7",
    title: "الأعشاب المحلية أفضل",
    description: "الأعشاب المزروعة محلياً أقل بصمة كربونية من المستوردة. الزعتر، الكركم، والزنجبيل المحلي فعّال ومستدام.",
    icon: "house.fill",
    color: "#F59E0B",
    category: "المصادر",
  },
  {
    id: "t8",
    title: "شهادات الجودة البيئية",
    description: "ابحث عن: USDA Organic، Non-GMO Project، Rainforest Alliance، Fair Trade. تضمن ممارسات زراعية مستدامة وعادلة.",
    icon: "checkmark.seal.fill",
    color: "#10B981",
    category: "الشهادات",
  },
];

const ECO_ALTERNATIVES: EcoAlternative[] = [
  { supplement: "أوميغا-3", conventional: "زيت السمك", sustainable: "زيت الطحالب (Algal Oil)", benefit: "نفس DHA+EPA — بدون صيد أسماك" },
  { supplement: "فيتامين D3", conventional: "من صوف الخراف (Lanolin)", sustainable: "من الأشنة (Lichen D3)", benefit: "100% نباتي — مناسب للنباتيين" },
  { supplement: "الكولاجين", conventional: "من جلد البقر", sustainable: "كولاجين بحري أو نباتي (Vitamin C + Glycine)", benefit: "بصمة كربونية أقل" },
  { supplement: "الحديد", conventional: "Ferrous Sulfate اصطناعي", sustainable: "حديد من الغذاء (Fermented Iron)", benefit: "أقل آثاراً جانبية وأكثر استدامة" },
  { supplement: "الكالسيوم", conventional: "Calcium Carbonate معدني", sustainable: "Algae Calcium (من الطحالب)", benefit: "مصدر طبيعي مستدام مع معادن إضافية" },
  { supplement: "البروتين", conventional: "Whey Protein", sustainable: "بروتين البازلاء أو القنب", benefit: "بصمة مياه وكربون أقل بكثير" },
];

export default function SustainabilityScreen() {
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الاستدامة والبيئة 🌱</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>مكملات صحية وصديقة للكوكب</Text>
        </View>
      </View>

      <FlatList
        data={TIPS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 8 }}>
            <View style={[styles.heroBanner, { backgroundColor: "#10B981" + "15", borderColor: "#10B981" + "30" }]}>
              <Text style={[styles.heroTitle, { color: "#10B981" }]}>اختياراتك تؤثر على الكوكب</Text>
              <Text style={[styles.heroText, { color: colors.foreground }]}>
                صناعة المكملات تستهلك موارد طبيعية ضخمة. باختياراتك الواعية يمكنك الحفاظ على صحتك وصحة البيئة في آن واحد.
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={{ gap: 12, marginTop: 20 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>بدائل مستدامة للمكملات الشائعة</Text>
            {ECO_ALTERNATIVES.map((alt, i) => (
              <View key={i} style={[styles.altCard, { backgroundColor: colors.surface, borderColor: "#10B981" + "25", borderLeftColor: "#10B981", borderLeftWidth: 3 }]}>
                <View style={styles.altTop}>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={[styles.altSupplement, { color: colors.foreground }]}>{alt.supplement}</Text>
                    <View style={styles.altRow}>
                      <View style={[styles.altBadge, { backgroundColor: colors.error + "12" }]}>
                        <Text style={[styles.altBadgeText, { color: colors.error }]}>{alt.conventional}</Text>
                      </View>
                      <IconSymbol name="arrow.left" size={12} color={colors.muted} />
                      <View style={[styles.altBadge, { backgroundColor: "#10B981" + "12" }]}>
                        <Text style={[styles.altBadgeText, { color: "#10B981" }]}>{alt.sustainable}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={[styles.altBenefit, { color: colors.muted }]}>{alt.benefit}</Text>
              </View>
            ))}
          </View>
        }
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: item.color + "25", borderLeftColor: item.color, borderLeftWidth: 4 }]}>
            <View style={styles.tipTop}>
              <View style={[styles.tipIcon, { backgroundColor: item.color + "15" }]}>
                <IconSymbol name={item.icon} size={20} color={item.color} />
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <View style={[styles.categoryBadge, { backgroundColor: item.color + "12" }]}>
                  <Text style={[styles.categoryText, { color: item.color }]}>{item.category}</Text>
                </View>
                <Text style={[styles.tipTitle, { color: colors.foreground }]}>{item.title}</Text>
              </View>
            </View>
            <Text style={[styles.tipDesc, { color: colors.foreground }]}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  heroBanner: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 8 },
  heroTitle: { fontSize: 18, fontWeight: "900", textAlign: "right", fontFamily: "Cairo-Black" },
  heroText: { fontSize: 14, lineHeight: 22, textAlign: "right", fontFamily: "Cairo" },
  tipCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  tipTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  tipIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: "flex-end", marginBottom: 4 },
  categoryText: { fontSize: 10, fontWeight: "700", fontFamily: "Cairo-Bold" },
  tipTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  tipDesc: { fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  altCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  altTop: { flexDirection: "row-reverse", alignItems: "flex-start" },
  altSupplement: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 6, fontFamily: "Cairo-Black" },
  altRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6, flexWrap: "wrap" },
  altBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  altBadgeText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  altBenefit: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
});
