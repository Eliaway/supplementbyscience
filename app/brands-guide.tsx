/**
 * دليل العلامات التجارية وجودة المكملات
 * Features: 81 (أفضل الماركات), 82 (مقارنة الجودة)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const BRAND_TIERS = [
  {
    tier: "الدرجة الأولى — بحثية وعلمية",
    color: "#10B981",
    brands: [
      { name: "Thorne Research", specialty: "أعلى جودة — مستخدمة في الأبحاث الطبية", certs: ["NSF", "cGMP"] },
      { name: "Pure Encapsulations", specialty: "خالية من المواد الحشو — للحساسين", certs: ["NSF", "cGMP"] },
      { name: "Jarrow Formulas", specialty: "أشكال متقدمة وأسعار معقولة", certs: ["cGMP", "USP"] },
      { name: "Life Extension", specialty: "بحثية متعمقة — تركيزات عالية", certs: ["cGMP", "NSF"] },
    ],
  },
  {
    tier: "الدرجة الثانية — جيدة وموثوقة",
    color: "#3B82F6",
    brands: [
      { name: "NOW Foods", specialty: "قيمة ممتازة مقابل السعر", certs: ["cGMP", "Non-GMO"] },
      { name: "Solgar", specialty: "تاريخ طويل وجودة ثابتة", certs: ["cGMP"] },
      { name: "Doctor's Best", specialty: "أشكال متقدمة بأسعار معقولة", certs: ["cGMP"] },
      { name: "Nordic Naturals", specialty: "أفضل Omega-3 في السوق", certs: ["IFOS", "cGMP"] },
    ],
  },
  {
    tier: "الدرجة الثالثة — جيدة للمبتدئين",
    color: "#F59E0B",
    brands: [
      { name: "Nature Made", specialty: "متاحة في الصيدليات — USP certified", certs: ["USP"] },
      { name: "Garden of Life", specialty: "عضوية وطبيعية — للمهتمين بالعضوي", certs: ["USDA Organic", "Non-GMO"] },
      { name: "Optimum Nutrition", specialty: "أفضل بروتين للرياضيين", certs: ["Informed Sport"] },
    ],
  },
];

const CERTIFICATIONS = [
  { cert: "NSF International", desc: "أصعب شهادة — تتحقق من المحتوى والنقاء والتلوث", color: "#10B981" },
  { cert: "USP (United States Pharmacopeia)", desc: "تتحقق من الجرعة والنقاء والانحلال", color: "#3B82F6" },
  { cert: "Informed Sport", desc: "مخصصة للرياضيين — تتحقق من غياب المواد المحظورة", color: "#F59E0B" },
  { cert: "IFOS (Fish Oil)", desc: "أعلى معيار لجودة زيت السمك — تتحقق من الأكسدة والتلوث", color: "#8B5CF6" },
  { cert: "cGMP (FDA)", desc: "الحد الأدنى المقبول — تتحقق من عملية الإنتاج فقط", color: "#6B7280" },
  { cert: "Non-GMO Project", desc: "تتحقق من غياب المكونات المعدلة وراثياً", color: "#84CC16" },
];

const RED_FLAGS = [
  "لا توجد شهادة جودة مستقلة",
  "لا يُذكر شكل المكمل (مثل: Magnesium فقط بدون Glycinate/Citrate)",
  "سعر منخفض جداً مقارنة بالمنافسين",
  "مطالبات مبالغ فيها ('يعالج', 'يشفي')",
  "لا يوجد رقم LOT أو تاريخ انتهاء واضح",
  "مصنوع في دول بدون رقابة صارمة",
  "لا يوجد موقع رسمي أو معلومات تواصل",
];

export default function BrandsGuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>دليل العلامات التجارية</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>أفضل الماركات • شهادات الجودة • علامات التحذير</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {BRAND_TIERS.map((tier, i) => (
          <View key={i} style={[styles.tierCard, { backgroundColor: colors.card, borderColor: tier.color + "40" }]}>
            <Pressable
              style={[styles.tierHeader, { backgroundColor: tier.color + "10" }]}
              onPress={() => setExpandedTier(expandedTier === tier.tier ? null : tier.tier)}
            >
              <IconSymbol name={expandedTier === tier.tier ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.tierTitle, { color: tier.color }]}>{tier.tier}</Text>
            </Pressable>
            {expandedTier === tier.tier && (
              <View style={{ padding: 12, gap: 10 }}>
                {tier.brands.map((brand, j) => (
                  <View key={j} style={[styles.brandCard, { backgroundColor: tier.color + "06", borderColor: tier.color + "20" }]}>
                    <Text style={[styles.brandName, { color: colors.foreground }]}>{brand.name}</Text>
                    <Text style={[styles.brandSpecialty, { color: colors.muted }]}>{brand.specialty}</Text>
                    <View style={styles.certsRow}>
                      {brand.certs.map((cert, k) => (
                        <View key={k} style={[styles.certBadge, { backgroundColor: tier.color + "20" }]}>
                          <Text style={[styles.certText, { color: tier.color }]}>{cert}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>شهادات الجودة المعتمدة</Text>
        {CERTIFICATIONS.map((cert, i) => (
          <View key={i} style={[styles.certCard, { backgroundColor: colors.card, borderColor: cert.color + "30" }]}>
            <View style={[styles.certHeader, { backgroundColor: cert.color + "15" }]}>
              <Text style={[styles.certName, { color: cert.color }]}>{cert.cert}</Text>
            </View>
            <Text style={[styles.certDesc, { color: colors.muted }]}>{cert.desc}</Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>علامات التحذير 🚩</Text>
        <View style={[styles.redFlagsCard, { backgroundColor: colors.error + "08", borderColor: colors.error + "30" }]}>
          {RED_FLAGS.map((flag, i) => (
            <Text key={i} style={[styles.redFlag, { color: colors.error }]}>🚩 {flag}</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  tierCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  tierHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  tierTitle: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" },
  brandCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 6 },
  brandName: { fontSize: 14, fontWeight: "800", textAlign: "right" },
  brandSpecialty: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  certsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  certBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  certText: { fontSize: 11, fontWeight: "700" },
  certCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  certHeader: { padding: 10 },
  certName: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  certDesc: { padding: 10, fontSize: 12, lineHeight: 18, textAlign: "right" },
  redFlagsCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  redFlag: { fontSize: 12, lineHeight: 20, textAlign: "right" },
});
