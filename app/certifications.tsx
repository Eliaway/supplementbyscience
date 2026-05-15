/**
 * شهادات الجودة والاختبارات المستقلة
 * Feature #82: Supplement certifications and third-party testing
 */
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const CERTIFICATIONS = [
  {
    name: "NSF International",
    logo: "🏅",
    level: "الأعلى موثوقية",
    color: "#3B82F6",
    description: "أصعب شهادة للحصول عليها. تضمن النقاء والجرعة الصحيحة وغياب المواد المحظورة في الرياضة.",
    whatItMeans: ["فحص كل دفعة إنتاج", "اختبار للمواد المحظورة WADA", "فحص المعادن الثقيلة", "تحقق من الجرعة المكتوبة"],
    bestFor: "الرياضيين المحترفين والمهتمين بالجودة العالية",
  },
  {
    name: "USP Verified",
    logo: "✅",
    level: "موثوق جداً",
    color: "#10B981",
    description: "شهادة من دار الأدوية الأمريكية. تضمن أن المنتج يحتوي على ما هو مكتوب على العبوة.",
    whatItMeans: ["تحقق من المكونات والجرعة", "اختبار الذوبان والامتصاص", "فحص الملوثات", "معايير التصنيع الجيد"],
    bestFor: "العامة والمهتمين بالجودة",
  },
  {
    name: "Informed Sport",
    logo: "🏆",
    level: "للرياضيين",
    color: "#F59E0B",
    description: "متخصصة في الرياضيين. تختبر كل دفعة للمواد المحظورة قبل الإفراج عنها.",
    whatItMeans: ["اختبار كل دفعة قبل البيع", "قائمة المواد المحظورة WADA", "تتبع سلسلة التوريد", "ضمان للرياضيين"],
    bestFor: "الرياضيين المحترفين والهواة",
  },
  {
    name: "Informed Choice",
    logo: "🎯",
    level: "للرياضيين",
    color: "#8B5CF6",
    description: "مشابهة لـ Informed Sport لكن للمكملات العامة. تضمن خلو المنتج من المواد المحظورة.",
    whatItMeans: ["اختبار المواد المحظورة", "فحص دوري للمنتجات", "شفافية في المكونات"],
    bestFor: "الرياضيين والمهتمين بالنظافة",
  },
  {
    name: "GMP (Good Manufacturing Practice)",
    logo: "🏭",
    level: "معيار أساسي",
    color: "#6366F1",
    description: "معيار التصنيع الجيد. يضمن أن المصنع يتبع معايير النظافة والجودة في الإنتاج.",
    whatItMeans: ["معايير نظافة المصنع", "تتبع المواد الخام", "اختبار الجودة الداخلي", "توثيق العمليات"],
    bestFor: "الحد الأدنى المقبول لأي مكمل",
  },
  {
    name: "Halal Certified",
    logo: "☪️",
    level: "للمسلمين",
    color: "#10B981",
    description: "تضمن أن المنتج خالٍ من المواد المحرمة (جيلاتين خنزير، كحول، إلخ).",
    whatItMeans: ["خالٍ من مشتقات الخنزير", "خالٍ من الكحول", "مذبوح حلالاً (للمنتجات الحيوانية)", "مراجعة المكونات"],
    bestFor: "المسلمين",
  },
];

const RED_FLAGS = [
  { flag: "لا توجد شهادات جودة", risk: "عالي", description: "المنتج قد لا يحتوي على ما هو مكتوب" },
  { flag: "ادعاءات مبالغ فيها", risk: "عالي", description: "\"يعالج\"، \"يشفي\"، \"معجزة\" - علامات تحذير" },
  { flag: "مكونات سرية أو proprietary blend", risk: "متوسط", description: "لا تعرف الجرعة الفعلية لكل مكون" },
  { flag: "سعر منخفض جداً", risk: "متوسط", description: "الجودة لها ثمن - الرخيص جداً مشبوه" },
  { flag: "لا معلومات عن المصنع", risk: "عالي", description: "لا يمكن التحقق من مصدر المنتج" },
  { flag: "تاريخ انتهاء صلاحية غير واضح", risk: "متوسط", description: "يصعب معرفة طازجية المنتج" },
];

export default function CertificationsScreen() {
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>شهادات الجودة</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>كيف تعرف المكمل الموثوق من المزيف</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الشهادات المعتمدة</Text>
        {CERTIFICATIONS.map((cert, i) => (
          <View key={i} style={[styles.certCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.certHeader}>
              <View style={[styles.levelBadge, { backgroundColor: cert.color + "15" }]}>
                <Text style={[styles.levelText, { color: cert.color }]}>{cert.level}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 }}>
                <Text style={styles.certLogo}>{cert.logo}</Text>
                <Text style={[styles.certName, { color: colors.foreground }]}>{cert.name}</Text>
              </View>
            </View>
            <Text style={[styles.certDesc, { color: colors.muted }]}>{cert.description}</Text>
            <View style={styles.meansSection}>
              {cert.whatItMeans.map((item, mi) => (
                <View key={mi} style={styles.meansRow}>
                  <IconSymbol name="checkmark.circle.fill" size={13} color={cert.color} />
                  <Text style={[styles.meansText, { color: colors.foreground }]}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.bestForRow, { backgroundColor: cert.color + "10" }]}>
              <Text style={[styles.bestForLabel, { color: cert.color }]}>الأنسب لـ: </Text>
              <Text style={[styles.bestForText, { color: colors.foreground }]}>{cert.bestFor}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>علامات التحذير (Red Flags)</Text>
        {RED_FLAGS.map((flag, i) => (
          <View key={i} style={[styles.flagCard, { backgroundColor: colors.surface, borderColor: flag.risk === "عالي" ? colors.error + "30" : colors.warning + "30" }]}>
            <View style={[styles.riskBadge, { backgroundColor: flag.risk === "عالي" ? colors.error + "15" : colors.warning + "15" }]}>
              <Text style={[styles.riskText, { color: flag.risk === "عالي" ? colors.error : colors.warning }]}>خطر {flag.risk}</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.flagName, { color: colors.foreground }]}>{flag.flag}</Text>
              <Text style={[styles.flagDesc, { color: colors.muted }]}>{flag.description}</Text>
            </View>
            <IconSymbol name="exclamationmark.triangle.fill" size={18} color={flag.risk === "عالي" ? colors.error : colors.warning} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  certCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  certHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  certLogo: { fontSize: 24 },
  certName: { fontSize: 16, fontWeight: "900" },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  levelText: { fontSize: 11, fontWeight: "700" },
  certDesc: { fontSize: 13, textAlign: "right", lineHeight: 20 },
  meansSection: { gap: 6 },
  meansRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  meansText: { fontSize: 12, textAlign: "right" },
  bestForRow: { borderRadius: 8, padding: 8, flexDirection: "row-reverse", alignItems: "center" },
  bestForLabel: { fontSize: 12, fontWeight: "800" },
  bestForText: { fontSize: 12, flex: 1, textAlign: "right" },
  flagCard: { borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  riskText: { fontSize: 11, fontWeight: "700" },
  flagName: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  flagDesc: { fontSize: 12, textAlign: "right" },
});
