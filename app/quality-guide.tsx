/**
 * دليل الجودة والشهادات — Quality & Certification Guide
 * Features #41, #42, #43: Quality certifications, brand evaluation, red flags
 */
import { FlatList, I18nManager, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface Certification {
  name: string;
  fullName: string;
  description: string;
  importance: "ضروري" | "مهم" | "إضافي";
  color: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
}

interface RedFlag {
  flag: string;
  explanation: string;
}

interface BrandTier {
  tier: string;
  description: string;
  examples: string;
  color: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    name: "USP Verified",
    fullName: "United States Pharmacopeia",
    description: "يضمن أن المنتج يحتوي على ما هو مكتوب على الملصق، خالٍ من الملوثات، ويمتص بشكل صحيح.",
    importance: "ضروري",
    color: "#0EA5E9",
    icon: "checkmark.seal.fill",
  },
  {
    name: "NSF International",
    fullName: "National Sanitation Foundation",
    description: "اختبار مستقل للجودة والنقاء. NSF Sport يضمن خلو المنتج من المواد المحظورة في الرياضة.",
    importance: "ضروري",
    color: "#10B981",
    icon: "checkmark.seal.fill",
  },
  {
    name: "Informed Sport",
    fullName: "Informed Sport Certification",
    description: "كل دفعة إنتاج تُختبر للمواد المحظورة. الأهم للرياضيين المحترفين.",
    importance: "ضروري",
    color: "#F97316",
    icon: "checkmark.seal.fill",
  },
  {
    name: "GMP Certified",
    fullName: "Good Manufacturing Practice",
    description: "يضمن أن المصنع يتبع معايير التصنيع الجيد. FDA يطلبه لجميع المكملات الأمريكية.",
    importance: "مهم",
    color: "#6366F1",
    icon: "building.2.fill",
  },
  {
    name: "USDA Organic",
    fullName: "United States Department of Agriculture",
    description: "يضمن أن المكونات عضوية خالية من المبيدات الكيميائية والمعدلات الجينية.",
    importance: "مهم",
    color: "#22C55E",
    icon: "leaf.fill",
  },
  {
    name: "Non-GMO Project",
    fullName: "Non-GMO Project Verified",
    description: "يضمن خلو المنتج من المكونات المعدلة وراثياً.",
    importance: "مهم",
    color: "#84CC16",
    icon: "leaf.arrow.circlepath",
  },
  {
    name: "Informed Choice",
    fullName: "Informed Choice Certification",
    description: "اختبار مستقل للمنتجات الرياضية. أقل صرامة من Informed Sport.",
    importance: "إضافي",
    color: "#F59E0B",
    icon: "checkmark.circle.fill",
  },
  {
    name: "Kosher / Halal",
    fullName: "Kosher or Halal Certified",
    description: "يضمن أن المكونات تتوافق مع المتطلبات الدينية اليهودية أو الإسلامية.",
    importance: "إضافي",
    color: "#8B5CF6",
    icon: "checkmark.circle.fill",
  },
  {
    name: "Vegan Society",
    fullName: "The Vegan Society Certified",
    description: "يضمن خلو المنتج من أي مكونات حيوانية أو اختبارات على الحيوانات.",
    importance: "إضافي",
    color: "#10B981",
    icon: "leaf.fill",
  },
];

const RED_FLAGS: RedFlag[] = [
  { flag: "ادعاءات علاج أمراض محددة", explanation: "المكملات لا تعالج الأمراض قانونياً. أي منتج يدّعي 'يعالج السكري' أو 'يشفي السرطان' هو ادعاء كاذب وخطير." },
  { flag: "نتائج سريعة جداً (أسبوع أو أقل)", explanation: "المكملات تحتاج أسابيع لأشهر لتظهر نتائجها. وعود النتائج الفورية مؤشر على منتج مشكوك فيه." },
  { flag: "مكونات سرية أو 'Proprietary Blend'", explanation: "Proprietary Blend يخفي الكميات الحقيقية لكل مكون. قد يحتوي على جرعات ضئيلة جداً من المكونات الفعالة." },
  { flag: "لا يوجد Lot Number أو تاريخ انتهاء", explanation: "المنتجات الموثوقة دائماً تحمل رقم الدفعة وتاريخ الانتهاء للتتبع والمساءلة." },
  { flag: "سعر منخفض جداً مقارنة بالمنافسين", explanation: "جودة المكملات تعكس سعرها. المنتجات الرخيصة جداً قد تحتوي على مكونات رديئة أو جرعات غير صحيحة." },
  { flag: "لا يوجد Certificate of Analysis (COA)", explanation: "الشركات الموثوقة توفر COA من مختبر مستقل. عدم توفره يعني عدم الشفافية." },
  { flag: "شهادات مشاهير فقط بدون دراسات", explanation: "الفعالية تُثبت بالدراسات العلمية لا بشهادات المشاهير. ابحث عن مراجع علمية." },
  { flag: "مكونات غير معروفة أو أسماء غريبة", explanation: "بعض الشركات تستخدم أسماء تسويقية لمكونات عادية أو مجهولة. ابحث عن كل مكون." },
];

const BRAND_TIERS: BrandTier[] = [
  {
    tier: "الدرجة الأولى — موثوقة جداً",
    description: "شركات تمتلك مختبرات خاصة، تنشر COA، وتحصل على شهادات متعددة",
    examples: "Thorne, Pure Encapsulations, Life Extension, Jarrow Formulas, NOW Foods",
    color: "#10B981",
  },
  {
    tier: "الدرجة الثانية — جيدة",
    description: "شركات ذات سمعة جيدة مع شهادات GMP وبعض الاختبارات المستقلة",
    examples: "Nature Made, Solgar, Garden of Life, Nordic Naturals, Doctor's Best",
    color: "#F59E0B",
  },
  {
    tier: "الدرجة الثالثة — مقبولة",
    description: "شركات متوسطة مع شهادات أساسية — تحقق من COA قبل الشراء",
    examples: "Natrol, Nature's Bounty, Kirkland (Costco), Spring Valley",
    color: "#F97316",
  },
  {
    tier: "تجنب — مخاطر عالية",
    description: "منتجات بدون شهادات، ادعاءات مبالغ فيها، أو تاريخ سلبي مع الجهات التنظيمية",
    examples: "المنتجات بدون شهادات، منتجات مجهولة المصدر، منتجات بادعاءات علاجية",
    color: "#EF4444",
  },
];

export default function QualityGuideScreen() {
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>دليل الجودة والشهادات</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>كيف تختار مكملاً موثوقاً</Text>
        </View>
      </View>

      <FlatList
        data={CERTIFICATIONS}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 8 }}>
            <View style={[styles.heroBanner, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "20" }]}>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>لماذا الشهادات مهمة؟</Text>
              <Text style={[styles.heroText, { color: colors.muted }]}>
                دراسات أثبتت أن 30-40% من المكملات لا تحتوي على ما هو مكتوب على الملصق. الشهادات المستقلة هي ضمانتك الوحيدة للجودة.
              </Text>
            </View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الشهادات المعترف بها عالمياً</Text>
          </View>
        }
        ListFooterComponent={
          <View style={{ gap: 12, marginTop: 20 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>تصنيف الشركات</Text>
            {BRAND_TIERS.map((tier, i) => (
              <View key={i} style={[styles.tierCard, { backgroundColor: tier.color + "08", borderColor: tier.color + "25", borderLeftColor: tier.color, borderLeftWidth: 4 }]}>
                <Text style={[styles.tierTitle, { color: tier.color }]}>{tier.tier}</Text>
                <Text style={[styles.tierDesc, { color: colors.foreground }]}>{tier.description}</Text>
                <Text style={[styles.tierExamples, { color: colors.muted }]}>أمثلة: {tier.examples}</Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 8 }]}>علامات التحذير 🚩</Text>
            {RED_FLAGS.map((rf, i) => (
              <View key={i} style={[styles.redFlagCard, { backgroundColor: colors.error + "06", borderColor: colors.error + "20" }]}>
                <View style={styles.redFlagTop}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.error} />
                  <Text style={[styles.redFlagTitle, { color: colors.error }]}>{rf.flag}</Text>
                </View>
                <Text style={[styles.redFlagExpl, { color: colors.muted }]}>{rf.explanation}</Text>
              </View>
            ))}
          </View>
        }
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={[styles.certCard, { backgroundColor: colors.surface, borderColor: item.color + "25", borderLeftColor: item.color, borderLeftWidth: 4 }]}>
            <View style={styles.certTop}>
              <View style={[styles.certIcon, { backgroundColor: item.color + "15" }]}>
                <IconSymbol name={item.icon} size={20} color={item.color} />
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <View style={styles.certNameRow}>
                  <View style={[styles.importanceBadge, { backgroundColor: item.importance === "ضروري" ? item.color + "15" : item.importance === "مهم" ? colors.warning + "15" : colors.success + "15" }]}>
                    <Text style={[styles.importanceText, { color: item.importance === "ضروري" ? item.color : item.importance === "مهم" ? colors.warning : colors.success }]}>{item.importance}</Text>
                  </View>
                  <Text style={[styles.certName, { color: colors.foreground }]}>{item.name}</Text>
                </View>
                <Text style={[styles.certFullName, { color: colors.muted }]}>{item.fullName}</Text>
              </View>
            </View>
            <Text style={[styles.certDesc, { color: colors.foreground }]}>{item.description}</Text>
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
  heroBanner: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  heroTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  heroText: { fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  certCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  certTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  certIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  certNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 2 },
  certName: { fontSize: 15, fontWeight: "800", fontFamily: "Cairo-Black" },
  certFullName: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  importanceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  importanceText: { fontSize: 10, fontWeight: "700", fontFamily: "Cairo-Bold" },
  certDesc: { fontSize: 13, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  tierCard: { borderRadius: 12, padding: 14, borderWidth: 1, gap: 6 },
  tierTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  tierDesc: { fontSize: 13, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  tierExamples: { fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  redFlagCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  redFlagTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  redFlagTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", flex: 1, fontFamily: "Cairo-Black" },
  redFlagExpl: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
