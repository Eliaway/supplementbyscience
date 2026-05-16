/**
 * البروتوكولات التكيّفية والعمل الليلي
 * Features: 52 (التوصيات التكيّفية), 110 (الشيفت الليلي), 111 (الجلوس الطويل)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const ADAPTIVE_PROTOCOLS = [
  {
    id: "night_shift",
    title: "العمل في الشيفت الليلي",
    icon: "moon.fill" as const,
    color: "#6366F1",
    supplements: [
      { name: "Melatonin", dose: "0.5-3 مغ (قبل النوم النهاري)", benefit: "يعيد ضبط الساعة البيولوجية" },
      { name: "Vitamin D3", dose: "5000 IU (مع الوجبة)", benefit: "يعوض نقص الشمس من العمل الليلي" },
      { name: "Magnesium Glycinate", dose: "400 مغ (قبل النوم)", benefit: "يحسن جودة النوم النهاري" },
      { name: "Ashwagandha", dose: "600 مغ (صباحاً)", benefit: "يقلل الكورتيزول المرتفع من اضطراب الساعة البيولوجية" },
      { name: "Omega-3", dose: "2 غ/يوم", benefit: "يقلل الالتهاب الناتج عن اضطراب النوم" },
    ],
    tips: [
      "استخدم نظارات تحجب الضوء الأزرق عند العودة للمنزل",
      "أغمق غرفة النوم تماماً بستائر معتمة",
      "تجنب الكافيين 6 ساعات قبل النوم",
    ],
  },
  {
    id: "grief_trauma",
    title: "إدارة الحزن والصدمة النفسية",
    icon: "heart.fill" as const,
    color: "#EC4899",
    supplements: [
      { name: "Omega-3 (EPA dominant)", dose: "3 غ/يوم EPA", benefit: "يقلل الاكتئاب والحزن المزمن" },
      { name: "Saffron Extract", dose: "30 مغ/يوم", benefit: "يحسن المزاج — فاعلية مشابهة للـ SSRIs" },
      { name: "Ashwagandha", dose: "600 مغ/يوم", benefit: "يقلل الكورتيزول ويحسن المرونة النفسية" },
      { name: "L-Theanine + Magnesium", dose: "200 مغ + 400 مغ", benefit: "يهدئ الجهاز العصبي دون تخدير" },
      { name: "Vitamin D3", dose: "5000 IU", benefit: "نقصه يزيد الاكتئاب والحزن" },
    ],
    tips: [
      "الحزن طبيعي — لا تقمعه بل اعمل على المرونة",
      "الدعم الاجتماعي أهم من أي مكمل",
      "استشر متخصصاً إذا استمر الحزن أكثر من شهرين",
    ],
  },
  {
    id: "motivation",
    title: "تحسين الثقة والدافعية",
    icon: "bolt.fill" as const,
    color: "#F59E0B",
    supplements: [
      { name: "Tyrosine", dose: "500-2000 مغ/يوم", benefit: "مقدمة الدوبامين — يحسن الدافعية والتركيز" },
      { name: "Rhodiola Rosea", dose: "400-600 مغ/يوم", benefit: "يقلل الإرهاق ويحسن الأداء الذهني" },
      { name: "Panax Ginseng", dose: "200-400 مغ/يوم", benefit: "يحسن الطاقة والثقة والأداء" },
      { name: "Vitamin B Complex", dose: "حسب المنتج", benefit: "ضروري لإنتاج الطاقة والناقلات العصبية" },
      { name: "Zinc + Magnesium (ZMA)", dose: "30 مغ + 450 مغ", benefit: "يدعم التستوستيرون والطاقة والنوم" },
    ],
    tips: [
      "الدافعية تبدأ بالفعل لا بالانتظار",
      "اربط المكملات بعادات صحية يومية",
      "التمرين هو أقوى محفز للدوبامين",
    ],
  },
  {
    id: "epigenetics",
    title: "التعبير الجيني والإيبيجينيتيكس",
    icon: "testtube.2" as const,
    color: "#10B981",
    supplements: [
      { name: "Methylfolate (MTHFR)", dose: "400-800 mcg", benefit: "يحسن المثيلة — عملية تنظيم الجينات" },
      { name: "Vitamin B12 (Methylcobalamin)", dose: "1000 mcg", benefit: "يدعم دورة المثيلة مع الفولات" },
      { name: "Sulforaphane (Broccoli Sprouts)", dose: "حسب المنتج", benefit: "يحفز جينات Nrf2 — مضاد أكسدة قوي" },
      { name: "Resveratrol", dose: "500 مغ/يوم", benefit: "يحفز جينات SIRT1 — جينات طول العمر" },
      { name: "Curcumin (Liposomal)", dose: "500-1000 مغ", benefit: "يعدّل التعبير الجيني الالتهابي" },
    ],
    tips: [
      "الإيبيجينيتيكس تعني أن نمط حياتك يؤثر على جيناتك",
      "الصيام المتقطع يحسن التعبير الجيني بشكل ملحوظ",
      "التوتر المزمن يضر بالتعبير الجيني",
    ],
  },
  {
    id: "hormone_receptors",
    title: "تحسين حساسية مستقبلات الهرمونات",
    icon: "waveform.path" as const,
    color: "#8B5CF6",
    supplements: [
      { name: "Berberine", dose: "500 مغ × 3/يوم", benefit: "يحسن حساسية الأنسولين مثل الميتفورمين" },
      { name: "Zinc", dose: "30 مغ/يوم", benefit: "يحسن حساسية مستقبلات التستوستيرون" },
      { name: "Vitamin D3", dose: "5000 IU", benefit: "يحسن حساسية مستقبلات الفيتامين D والهرمونات" },
      { name: "Magnesium", dose: "400 مغ", benefit: "يحسن حساسية مستقبلات الأنسولين والهرمونات" },
      { name: "Omega-3", dose: "3 غ/يوم", benefit: "يحسن سيولة غشاء الخلية وحساسية المستقبلات" },
    ],
    tips: [
      "الوزن الزائد يقلل حساسية مستقبلات الهرمونات",
      "التمرين المقاوم يحسن حساسية المستقبلات بشكل ملحوظ",
      "النوم الجيد ضروري لتجديد المستقبلات",
    ],
  },
];

export default function AdaptiveProtocolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>البروتوكولات التكيّفية</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>الشيفت الليلي • الدافعية • الإيبيجينيتيكس • الهرمونات</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {ADAPTIVE_PROTOCOLS.map((proto) => (
          <View key={proto.id} style={[styles.protoCard, { backgroundColor: colors.surface, borderColor: proto.color + "30" }]}>
            <Pressable
              style={[styles.protoHeader, { backgroundColor: proto.color + "10" }]}
              onPress={() => setExpandedId(expandedId === proto.id ? null : proto.id)}
            >
              <IconSymbol name={expandedId === proto.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.protoTitle, { color: colors.foreground }]}>{proto.title}</Text>
              <View style={[styles.protoIcon, { backgroundColor: proto.color + "20" }]}>
                <IconSymbol name={proto.icon} size={22} color={proto.color} />
              </View>
            </Pressable>
            {expandedId === proto.id && (
              <View style={{ padding: 12, gap: 8 }}>
                {proto.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: proto.color + "06", borderColor: proto.color + "20" }]}>
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    <Text style={[styles.suppDose, { color: proto.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppBenefit, { color: colors.muted }]}>{supp.benefit}</Text>
                  </View>
                ))}
                {proto.tips && (
                  <View style={{ gap: 6, marginTop: 4 }}>
                    <Text style={[styles.tipsTitle, { color: colors.foreground }]}>نصائح مهمة:</Text>
                    {proto.tips.map((tip, i) => (
                      <View key={i} style={styles.tipRow}>
                        <IconSymbol name="lightbulb.fill" size={12} color={colors.warning} />
                        <Text style={[styles.tipText, { color: colors.muted }]}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600", fontFamily: "Cairo-Bold" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  protoCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protoHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protoTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  protoIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppBenefit: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  tipsTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  tipRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 6 },
  tipText: { fontSize: 11, textAlign: "right", flex: 1, fontFamily: "Cairo" },
});
