/**
 * الأسئلة الشائعة عن المكملات
 * Features: 91 (FAQ), 92 (الأسئلة الأكثر شيوعاً)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const FAQ_CATEGORIES = [
  {
    category: "البداية مع المكملات",
    color: "#3B82F6",
    questions: [
      { q: "من أين أبدأ إذا لم أتناول مكملات من قبل؟", a: "ابدأ بالأساسيات الثلاثة: Vitamin D3 (5000 IU) + Magnesium Glycinate (400 مغ) + Omega-3 (3 غ). هذه الثلاثة تغطي أكثر النقاوص شيوعاً وتُحدث فرقاً ملحوظاً خلال 4-8 أسابيع." },
      { q: "هل أحتاج تحاليل قبل البدء؟", a: "مثالياً نعم — على الأقل: Vitamin D, Ferritin, B12, Magnesium, Zinc, TSH. لكن يمكنك البدء بالأساسيات بأمان بدون تحاليل." },
      { q: "كم من الوقت حتى أرى النتائج؟", a: "يختلف حسب المكمل: Magnesium (1-2 أسبوع)، Vitamin D (4-8 أسابيع)، Omega-3 (8-12 أسبوع)، Collagen (3-6 أشهر)." },
      { q: "هل يمكن أخذ جميع المكملات في نفس الوقت؟", a: "لا — بعضها يتعارض. الأفضل: صباحاً (D3, B12, Omega-3)، مع الطعام (Zinc, Iron)، قبل النوم (Magnesium, Melatonin)." },
    ],
  },
  {
    category: "السلامة والتفاعلات",
    color: "#EF4444",
    questions: [
      { q: "هل المكملات آمنة مع الأدوية؟", a: "بعضها يتفاعل مع الأدوية. الأهم: Omega-3 مع مضادات التخثر، St. John's Wort مع كثير من الأدوية، Magnesium مع بعض المضادات الحيوية. استشر طبيبك دائماً." },
      { q: "هل يمكن الإفراط في المكملات؟", a: "نعم — خاصة الفيتامينات الدهنية (A, D, E, K) والحديد والزنك. الفيتامينات الذائبة في الماء أكثر أماناً لكن الجرعات العالية جداً تضر أيضاً." },
      { q: "هل المكملات آمنة للحوامل؟", a: "بعضها ضروري (حمض الفوليك، D3، Iron، Iodine) وبعضها ممنوع (Vitamin A عالي، بعض الأعشاب). استشري طبيبك دائماً." },
      { q: "هل المكملات تضر الكبد؟", a: "معظمها آمن بالجرعات الموصى بها. الأكثر خطورة: Vitamin A الزائد، بعض الأعشاب (Kava, Comfrey). تجنب الجرعات العالية لفترات طويلة." },
    ],
  },
  {
    category: "الجودة والشراء",
    color: "#10B981",
    questions: [
      { q: "كيف أعرف المكمل الجيد من الرديء؟", a: "ابحث عن: شهادة NSF أو USP أو Informed Sport، ذكر شكل المكمل (Glycinate لا Oxide)، شركة معروفة بتاريخ جيد، نتائج اختبارات مستقلة (COA)." },
      { q: "هل المكملات الطبيعية أفضل من الاصطناعية؟", a: "ليس دائماً. Vitamin E الطبيعي (d-alpha) أفضل من الاصطناعي (dl-alpha). لكن Vitamin C الاصطناعي مثل الطبيعي تماماً. الشكل الكيميائي أهم من المصدر." },
      { q: "هل أشتري من الصيدلية أم الإنترنت؟", a: "الإنترنت (iHerb, Amazon) أوفر بـ 40-60% وخيارات أكثر. الصيدلية أسهل ولكن أغلى. تأكد من شراء من بائعين موثوقين." },
      { q: "هل المكملات العربية جيدة؟", a: "بعضها جيد لكن الرقابة أقل صرامة من FDA. ابحث عن شهادات دولية وتجنب المنتجات بدون معلومات واضحة." },
    ],
  },
  {
    category: "أسئلة متخصصة",
    color: "#8B5CF6",
    questions: [
      { q: "هل الكرياتين يسبب تساقط الشعر؟", a: "الأدلة ضعيفة جداً. دراسة واحدة أظهرت رفع DHT لكن لم تُكرر. الكرياتين آمن للشعر في الغالبية العظمى." },
      { q: "هل يمكن أخذ Omega-3 مع الكرياتين؟", a: "نعم — لا تعارض بينهما. بل Omega-3 يحسن امتصاص الكرياتين في العضلات." },
      { q: "هل Melatonin يسبب الاعتماد؟", a: "لا اعتماداً جسدياً، لكن الاستخدام المستمر قد يقلل الإنتاج الطبيعي. استخدمه عند الحاجة فقط." },
      { q: "ما الفرق بين Magnesium Glycinate وOxide؟", a: "Glycinate: امتصاص 80%، لطيف على المعدة، الأفضل للنوم والقلق. Oxide: امتصاص 4% فقط، يسبب إسهالاً، تجنبه." },
    ],
  },
];

export default function FAQScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(FAQ_CATEGORIES[0].category);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الأسئلة الشائعة</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>إجابات علمية لأكثر الأسئلة شيوعاً</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {FAQ_CATEGORIES.map((cat) => (
          <View key={cat.category} style={[styles.catCard, { backgroundColor: colors.card, borderColor: cat.color + "40" }]}>
            <Pressable
              style={[styles.catHeader, { backgroundColor: cat.color + "10" }]}
              onPress={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)}
            >
              <IconSymbol name={expandedCat === cat.category ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.catTitle, { color: cat.color }]}>{cat.category}</Text>
            </Pressable>
            {expandedCat === cat.category && (
              <View style={{ gap: 8, padding: 12 }}>
                {cat.questions.map((qa, i) => (
                  <View key={i} style={[styles.qaCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Pressable
                      style={styles.questionRow}
                      onPress={() => setExpandedQ(expandedQ === `${cat.category}-${i}` ? null : `${cat.category}-${i}`)}
                    >
                      <IconSymbol name={expandedQ === `${cat.category}-${i}` ? "chevron.down" : "chevron.right"} size={14} color={colors.muted} />
                      <Text style={[styles.questionText, { color: colors.foreground }]}>{qa.q}</Text>
                    </Pressable>
                    {expandedQ === `${cat.category}-${i}` && (
                      <Text style={[styles.answerText, { color: colors.muted, borderTopColor: colors.border }]}>{qa.a}</Text>
                    )}
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
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  catCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  catHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  catTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  qaCard: { borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  questionRow: { flexDirection: "row-reverse", alignItems: "flex-start", padding: 12, gap: 8 },
  questionText: { flex: 1, fontSize: 13, fontWeight: "700", lineHeight: 20, textAlign: "right" },
  answerText: { padding: 12, fontSize: 12, lineHeight: 20, textAlign: "right", borderTopWidth: 0.5 },
});
