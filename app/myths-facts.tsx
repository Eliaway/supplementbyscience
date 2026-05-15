/**
 * أساطير وحقائق — Myths vs Facts
 * Features #56, #57: Supplement myths debunked, science-based facts
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface MythFact {
  id: string;
  myth: string;
  fact: string;
  explanation: string;
  category: string;
  severity: "خرافة شائعة" | "نصف صحيح" | "مبالغة";
}

const MYTHS: MythFact[] = [
  {
    id: "m1",
    myth: "كلما زادت الجرعة كان أفضل",
    fact: "الجرعة الزائدة ضارة وقد تكون خطيرة",
    explanation: "فيتامين A وD والحديد والزنك تسبب تسمماً بالجرعات العالية. الجسم يطرح الزائد من الفيتامينات القابلة للذوبان في الماء، لكن الفيتامينات الدهنية تتراكم. الأكثر ليس دائماً أفضل.",
    category: "جرعات",
    severity: "خرافة شائعة",
  },
  {
    id: "m2",
    myth: "المكملات الطبيعية آمنة 100% بدون آثار جانبية",
    fact: "الطبيعي لا يعني آمناً دائماً",
    explanation: "الكافيين، الكاوا، الكومفري، وغيرها طبيعية لكن لها آثار جانبية خطيرة. الأرسينيك والرصاص طبيعيان أيضاً. الأمان يعتمد على الجرعة والشخص وليس على كون المادة طبيعية.",
    category: "سلامة",
    severity: "خرافة شائعة",
  },
  {
    id: "m3",
    myth: "الفيتامينات تعطيك طاقة فورية",
    fact: "الفيتامينات لا تعطي طاقة مباشرة",
    explanation: "الطاقة تأتي من الكربوهيدرات والدهون والبروتين. الفيتامينات تساعد في تحويل الغذاء إلى طاقة (كمحفزات) لكنها لا تعطي طاقة بحد ذاتها. الشعور بالطاقة بعد الفيتامينات غالباً وهم أو تصحيح نقص.",
    category: "فعالية",
    severity: "خرافة شائعة",
  },
  {
    id: "m4",
    myth: "البروتين الزائد يتحول إلى عضلات",
    fact: "البروتين الزائد يتحول إلى دهون أو يُطرح",
    explanation: "الجسم يستخدم ما يحتاجه من البروتين لبناء العضلات والإصلاح. الزائد يُحوَّل إلى طاقة أو دهون. بناء العضلات يتطلب التمرين + البروتين الكافي، وليس البروتين الزائد.",
    category: "رياضة",
    severity: "نصف صحيح",
  },
  {
    id: "m5",
    myth: "الكرياتين يسبب تلف الكلى",
    fact: "الكرياتين آمن تماماً للكلى السليمة",
    explanation: "عشرات الدراسات على مدى 30 سنة أثبتت سلامة الكرياتين للأشخاص الأصحاء. المخاوف نشأت من ارتفاع Creatinine في الدم (وهو طبيعي مع الكرياتين) وليس من تلف الكلى. أشخاص بأمراض كلوية يجب أن يستشيروا طبيبهم.",
    category: "رياضة",
    severity: "خرافة شائعة",
  },
  {
    id: "m6",
    myth: "الكولاجين الفموي لا يعمل — الجسم يهضمه",
    fact: "الكولاجين الفموي فعال وتدعمه الدراسات",
    explanation: "نعم، الجسم يهضم الكولاجين إلى أحماض أمينية. لكن الدراسات أثبتت أن هذه الأحماض الأمينية (خاصة Hydroxyproline) تحفز خلايا الجلد والمفاصل لإنتاج المزيد من الكولاجين. النتائج تظهر بعد 8-12 أسبوع.",
    category: "جلد ومفاصل",
    severity: "نصف صحيح",
  },
  {
    id: "m7",
    myth: "الحديد يعطيك طاقة فورية",
    fact: "الحديد يحتاج أسابيع لرفع مستوياته",
    explanation: "الحديد يبني الهيموغلوبين تدريجياً. حتى مع نقص الحديد، الطاقة لا تتحسن فوراً بعد الجرعة الأولى. يحتاج 4-8 أسابيع لرؤية تحسن ملحوظ. الطاقة الفورية بعد الحديد هي تأثير وهمي (Placebo).",
    category: "فعالية",
    severity: "خرافة شائعة",
  },
  {
    id: "m8",
    myth: "يجب أخذ مكملات متعددة لتغطية كل الاحتياجات",
    fact: "الغذاء المتنوع يغطي معظم الاحتياجات",
    explanation: "الغذاء الصحي المتنوع يوفر معظم الفيتامينات والمعادن. المكملات لسد الفجوات المحددة (نقص مثبت بالتحاليل) وليس لاستبدال الغذاء. أخذ مكملات بدون نقص حقيقي هدر مالي وقد يكون ضاراً.",
    category: "عام",
    severity: "مبالغة",
  },
  {
    id: "m9",
    myth: "الأوميغا-3 يحسن الذكاء والذاكرة بشكل كبير",
    fact: "الأوميغا-3 مفيد للدماغ لكن التأثير معتدل",
    explanation: "الأوميغا-3 (خاصة DHA) ضروري لصحة الدماغ وتطوره. لكن الدراسات تظهر تأثيراً معتدلاً على الذاكرة والتركيز عند البالغين الأصحاء. التأثير أكبر عند الأطفال والمسنين وأصحاب النقص.",
    category: "دماغ",
    severity: "مبالغة",
  },
  {
    id: "m10",
    myth: "فيتامين C يمنع الزكام",
    fact: "فيتامين C يقلل مدة الزكام لا يمنعه",
    explanation: "مراجعة Cochrane لـ 29 دراسة: فيتامين C لا يمنع الزكام للعامة، لكن يقلل مدته بـ 8-14%. الاستثناء: الرياضيون في ظروف قاسية (الجري في البرد) — يقلل خطر الزكام 50%.",
    category: "مناعة",
    severity: "نصف صحيح",
  },
  {
    id: "m11",
    myth: "المكملات تعوض النظام الغذائي السيئ",
    fact: "لا يوجد مكمل يعوض نظاماً غذائياً سيئاً",
    explanation: "الغذاء يحتوي على آلاف المركبات الفيتوكيميائية التي لا يمكن تعبئتها في حبة. الدراسات تُظهر باستمرار أن الغذاء الكامل أفضل من مكملاته المعزولة. المكملات مكملة — ليست بديلة.",
    category: "عام",
    severity: "خرافة شائعة",
  },
  {
    id: "m12",
    myth: "الزنك يعالج حب الشباب بشكل كامل",
    fact: "الزنك مفيد لكنه ليس علاجاً شاملاً",
    explanation: "الزنك يقلل التهاب حب الشباب ويثبط نمو البكتيريا المسببة له. الدراسات تُظهر فعاليته لكنها أقل من المضادات الحيوية الموضعية. مفيد كجزء من خطة علاجية شاملة.",
    category: "جلد",
    severity: "مبالغة",
  },
];

export default function MythsFactsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getSeverityColor = (severity: MythFact["severity"]) => {
    if (severity === "خرافة شائعة") return colors.error;
    if (severity === "نصف صحيح") return colors.warning;
    return colors.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>أساطير وحقائق</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>12 خرافة شائعة مدحوضة علمياً</Text>
        </View>
      </View>

      <FlatList
        data={MYTHS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          const sevColor = getSeverityColor(item.severity);
          return (
            <Pressable
              style={({ pressed }) => [styles.mythCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.9 }]}
              onPress={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <View style={styles.mythHeader}>
                <IconSymbol name={isExpanded ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                <View style={{ flex: 1, alignItems: "flex-end", gap: 6 }}>
                  <View style={styles.mythTopRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.primary + "12" }]}>
                      <Text style={[styles.categoryText, { color: colors.primary }]}>{item.category}</Text>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: sevColor + "12" }]}>
                      <Text style={[styles.severityText, { color: sevColor }]}>{item.severity}</Text>
                    </View>
                  </View>
                  <View style={styles.mythRow}>
                    <View style={[styles.mythLabel, { backgroundColor: colors.error + "12" }]}>
                      <Text style={[styles.mythLabelText, { color: colors.error }]}>خرافة</Text>
                    </View>
                    <Text style={[styles.mythText, { color: colors.foreground }]}>{item.myth}</Text>
                  </View>
                  <View style={styles.mythRow}>
                    <View style={[styles.mythLabel, { backgroundColor: colors.success + "12" }]}>
                      <Text style={[styles.mythLabelText, { color: colors.success }]}>حقيقة</Text>
                    </View>
                    <Text style={[styles.factText, { color: colors.success }]}>{item.fact}</Text>
                  </View>
                </View>
              </View>
              {isExpanded && (
                <View style={[styles.explanation, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.explanationText, { color: colors.foreground }]}>{item.explanation}</Text>
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  mythCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  mythHeader: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  mythTopRow: { flexDirection: "row-reverse", gap: 8 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  categoryText: { fontSize: 10, fontWeight: "700" },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  severityText: { fontSize: 10, fontWeight: "700" },
  mythRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8 },
  mythLabel: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  mythLabelText: { fontSize: 10, fontWeight: "800" },
  mythText: { flex: 1, fontSize: 13, fontWeight: "700", textAlign: "right", lineHeight: 18 },
  factText: { flex: 1, fontSize: 13, fontWeight: "700", textAlign: "right", lineHeight: 18 },
  explanation: { borderRadius: 10, padding: 12, borderWidth: 1 },
  explanationText: { fontSize: 13, lineHeight: 20, textAlign: "right" },
});
