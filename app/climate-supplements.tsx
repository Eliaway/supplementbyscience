/**
 * مكملات التكيّف مع المناخ والبيئة
 * Features: 105 (الحرارة), 106 (البرد), 107 (الجلد الجاف), 108 (الشتاء)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const CLIMATE_PROTOCOLS = [
  {
    id: "heat",
    title: "التكيّف مع الحرارة الشديدة",
    icon: "sun.max.fill" as const,
    color: "#F97316",
    description: "مكملات تحمي الجسم من الإجهاد الحراري وتحسن التعرق والترطيب",
    supplements: [
      { name: "Electrolytes (Na, K, Mg, Cl)", dose: "حسب التعرق", benefit: "يعوض الأملاح المفقودة ويمنع الإجهاد الحراري" },
      { name: "Vitamin C", dose: "1-2 غ/يوم", benefit: "يحمي الخلايا من الإجهاد التأكسدي الحراري" },
      { name: "Taurine", dose: "1-3 غ/يوم", benefit: "يحسن تنظيم الحرارة ويقلل الإجهاد الحراري" },
      { name: "Astaxanthin", dose: "12 مغ/يوم", benefit: "يحمي الجلد من الشمس من الداخل" },
      { name: "Coenzyme Q10", dose: "200 مغ/يوم", benefit: "يحسن كفاءة الطاقة في الحرارة" },
    ],
  },
  {
    id: "cold",
    title: "التكيّف مع البرد الشديد",
    icon: "snowflake" as const,
    color: "#3B82F6",
    description: "مكملات تحسن الدورة الدموية وتدفئة الجسم وتقوي المناعة في الشتاء",
    supplements: [
      { name: "Vitamin D3", dose: "5000-10000 IU/يوم", benefit: "يعوض نقص الشمس في الشتاء — ضروري للمناعة" },
      { name: "Ginger Extract", dose: "1-2 غ/يوم", benefit: "يحسن الدورة الدموية ويدفئ الجسم" },
      { name: "Cayenne Pepper (Capsaicin)", dose: "حسب التحمل", benefit: "يحفز الدورة الدموية الطرفية" },
      { name: "Iron + B12", dose: "حسب الفحص", benefit: "يمنع فقر الدم الذي يزيد الشعور بالبرد" },
      { name: "Omega-3", dose: "3 غ/يوم", benefit: "يمنع سماكة الدم في البرد" },
    ],
  },
  {
    id: "dry_skin",
    title: "الجلد في المناخ الجاف",
    icon: "drop.fill" as const,
    color: "#EC4899",
    description: "مكملات تحافظ على رطوبة الجلد وتمنع الجفاف والتشقق",
    supplements: [
      { name: "Hyaluronic Acid", dose: "120-240 مغ/يوم", benefit: "يحتفظ بالماء في الجلد — 1000x وزنه ماء" },
      { name: "Evening Primrose Oil", dose: "3 غ/يوم", benefit: "غني بـ GLA — يقوي حاجز الجلد" },
      { name: "Vitamin E", dose: "400 IU/يوم", benefit: "يحمي دهون الجلد من الأكسدة" },
      { name: "Biotin", dose: "5000 mcg/يوم", benefit: "يقوي حاجز الجلد ويمنع الجفاف" },
      { name: "Collagen Type I", dose: "10 غ/يوم", benefit: "يحسن مرونة الجلد وترطيبه" },
    ],
  },
  {
    id: "winter",
    title: "الوقاية من أمراض الشتاء",
    icon: "shield.fill" as const,
    color: "#10B981",
    description: "مكملات تقوي المناعة وتحمي من الإنفلونزا والزكام في الشتاء",
    supplements: [
      { name: "Vitamin D3 + K2", dose: "5000 IU + 100 mcg", benefit: "أهم مكمل للمناعة الشتوية" },
      { name: "Zinc Lozenges", dose: "75 مغ/يوم (عند المرض)", benefit: "يقلل مدة الزكام بـ 33%" },
      { name: "Elderberry (Sambucus)", dose: "600-900 مغ/يوم", benefit: "يقلل شدة الإنفلونزا ومدتها" },
      { name: "Vitamin C", dose: "1-2 غ/يوم", benefit: "يقلل مدة الزكام ويقوي المناعة" },
      { name: "Echinacea", dose: "900 مغ/يوم (دورات)", benefit: "يحفز المناعة الفطرية" },
    ],
  },
  {
    id: "screen",
    title: "حماية العيون من الشاشات",
    icon: "eye.fill" as const,
    color: "#8B5CF6",
    description: "مكملات تحمي العيون من الضوء الأزرق وإجهاد الشاشات",
    supplements: [
      { name: "Lutein + Zeaxanthin", dose: "20 مغ + 4 مغ", benefit: "يبني الصبغة البقعية التي تصفي الضوء الأزرق" },
      { name: "Astaxanthin", dose: "6-12 مغ", benefit: "يقلل إجهاد العيون من الشاشات بشكل ملحوظ" },
      { name: "Omega-3 DHA", dose: "1-2 غ", benefit: "يبني بنية الشبكية ويقلل جفاف العيون" },
      { name: "Vitamin A", dose: "5000 IU", benefit: "ضروري لإنتاج الدموع وصحة القرنية" },
    ],
  },
  {
    id: "sedentary",
    title: "مكافحة الجلوس الطويل",
    icon: "figure.walk" as const,
    color: "#F59E0B",
    description: "مكملات تحمي من أضرار الجلوس الطويل وتحسن الدورة الدموية",
    supplements: [
      { name: "Nattokinase", dose: "2000 FU/يوم", benefit: "يمنع تجلط الدم من الجلوس الطويل" },
      { name: "Pycnogenol", dose: "100-200 مغ/يوم", benefit: "يحسن الدورة الدموية في الأوردة" },
      { name: "Magnesium", dose: "400 مغ/يوم", benefit: "يقلل توتر العضلات من الجلوس" },
      { name: "Vitamin D3", dose: "4000 IU/يوم", benefit: "يعوض نقص الشمس من العمل الداخلي" },
      { name: "Omega-3", dose: "2-3 غ/يوم", benefit: "يقلل الالتهاب الناتج عن الخمول" },
    ],
  },
];

export default function ClimateSupplementsScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>مكملات المناخ والبيئة</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>تكيّف مع الحرارة والبرد والجفاف والشاشات</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {CLIMATE_PROTOCOLS.map((proto) => (
          <View key={proto.id} style={[styles.protoCard, { backgroundColor: colors.surface, borderColor: proto.color + "30" }]}>
            <Pressable
              style={[styles.protoHeader, { backgroundColor: proto.color + "10" }]}
              onPress={() => setExpandedId(expandedId === proto.id ? null : proto.id)}
            >
              <IconSymbol name={expandedId === proto.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={{ flex: 1, alignItems: "flex-end", gap: 2 }}>
                <Text style={[styles.protoTitle, { color: colors.foreground }]}>{proto.title}</Text>
                <Text style={[styles.protoDesc, { color: colors.muted }]}>{proto.description}</Text>
              </View>
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
  protoTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  protoDesc: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  protoIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppBenefit: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
