/**
 * الأداء الذهني والنوتروبيكس
 * Features: 73 (تحسين الذاكرة والتركيز), 74 (مكملات الذكاء), 75 (الأداء الإدراكي)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const NOOTROPIC_STACKS = [
  {
    id: "focus",
    title: "ستاك التركيز والإنتاجية",
    subtitle: "للعمل والدراسة المكثفة",
    color: "#6366F1",
    icon: "brain.head.profile" as const,
    timing: "صباحاً قبل العمل",
    supplements: [
      { name: "L-Theanine + Caffeine", dose: "200 مغ + 100 مغ", mechanism: "يوازن تنبيه الكافيين مع هدوء L-Theanine", effect: "تركيز هادئ بدون قلق" },
      { name: "Bacopa Monnieri", dose: "300-600 مغ", mechanism: "يزيد Acetylcholine ويحمي الخلايا العصبية", effect: "تحسين الذاكرة طويلة المدى" },
      { name: "Lion's Mane Mushroom", dose: "1-3 غ", mechanism: "يحفز NGF لنمو الخلايا العصبية", effect: "تحسين الإدراك والذاكرة" },
      { name: "Rhodiola Rosea", dose: "200-400 مغ", mechanism: "يقلل التعب الذهني ويحسن المزاج", effect: "مقاومة الإجهاد الذهني" },
    ],
  },
  {
    id: "memory",
    title: "ستاك الذاكرة",
    subtitle: "للطلاب وكبار السن",
    color: "#10B981",
    icon: "memorychip" as const,
    timing: "صباحاً ومساءً",
    supplements: [
      { name: "Alpha-GPC", dose: "300-600 مغ", mechanism: "يرفع Acetylcholine — ناقل الذاكرة الرئيسي", effect: "تحسين الذاكرة قصيرة وطويلة المدى" },
      { name: "Huperzine A", dose: "50-200 مكغ", mechanism: "يثبط تكسير Acetylcholine", effect: "يطيل تأثير Alpha-GPC" },
      { name: "Phosphatidylserine", dose: "300 مغ", mechanism: "يدعم بنية غشاء الخلية العصبية", effect: "تحسين الذاكرة والتعلم" },
      { name: "Vinpocetine", dose: "10-30 مغ", mechanism: "يزيد تدفق الدم للدماغ", effect: "تحسين الذاكرة والتركيز" },
    ],
  },
  {
    id: "mood",
    title: "ستاك المزاج والطاقة الذهنية",
    subtitle: "لمكافحة الاكتئاب والقلق الخفيف",
    color: "#F59E0B",
    icon: "sun.max.fill" as const,
    timing: "صباحاً",
    supplements: [
      { name: "5-HTP", dose: "100-200 مغ", mechanism: "سلف السيروتونين المباشر", effect: "تحسين المزاج والنوم" },
      { name: "SAMe (S-Adenosyl Methionine)", dose: "400-800 مغ", mechanism: "يدعم إنتاج الدوبامين والسيروتونين", effect: "مضاد اكتئاب طبيعي قوي" },
      { name: "Saffron Extract", dose: "30 مغ", mechanism: "يثبط امتصاص السيروتونين مثل SSRIs", effect: "تحسين المزاج — دراسات ممتازة" },
      { name: "Ashwagandha KSM-66", dose: "600 مغ", mechanism: "يخفض الكورتيزول ويوازن الناقلات العصبية", effect: "تقليل القلق والإجهاد" },
    ],
  },
  {
    id: "neuroprotection",
    title: "الحماية العصبية طويلة المدى",
    subtitle: "الوقاية من الزهايمر وشيخوخة الدماغ",
    color: "#8B5CF6",
    icon: "shield.fill" as const,
    timing: "يومياً مع الطعام",
    supplements: [
      { name: "DHA (Algae-based)", dose: "1-2 غ", mechanism: "يشكل 40% من دهون الدماغ — ضروري للبنية", effect: "الوقاية من الزهايمر والخرف" },
      { name: "Curcumin (Theracurmin)", dose: "90-180 مغ", mechanism: "يزيل لويحات Amyloid-beta", effect: "الوقاية من الزهايمر" },
      { name: "Ginkgo Biloba", dose: "120-240 مغ", mechanism: "يزيد تدفق الدم للدماغ ومضاد أكسدة", effect: "تحسين الذاكرة والوقاية من الخرف" },
      { name: "Pterostilbene", dose: "50-100 مغ", mechanism: "يحفز BDNF ومضاد أكسدة قوي", effect: "حماية الخلايا العصبية" },
    ],
  },
  {
    id: "sleep_brain",
    title: "تحسين النوم للأداء الذهني",
    subtitle: "النوم = أهم نوتروبيك",
    color: "#0EA5E9",
    icon: "moon.fill" as const,
    timing: "قبل النوم بساعة",
    supplements: [
      { name: "Magnesium L-Threonate", dose: "2 غ", mechanism: "يخترق الحاجز الدموي الدماغي بكفاءة", effect: "يحسن جودة النوم والذاكرة" },
      { name: "Glycine", dose: "3 غ", mechanism: "يخفض درجة حرارة الجسم ويهدئ الجهاز العصبي", effect: "نوم أعمق وأسرع" },
      { name: "Apigenin (Chamomile)", dose: "50 مغ", mechanism: "يرتبط بمستقبلات GABA", effect: "يقلل القلق ويحسن النوم" },
      { name: "L-Theanine", dose: "200-400 مغ", mechanism: "يزيد موجات ألفا الدماغية", effect: "نوم هادئ بدون خمول صباحي" },
    ],
  },
];

const BRAIN_FOODS = [
  { name: "بلوبيري", benefit: "يحمي الدماغ من الأكسدة ويحسن الذاكرة" },
  { name: "سمك السلمون", benefit: "غني بـ DHA — أهم دهن للدماغ" },
  { name: "الجوز", benefit: "يشبه الدماغ شكلاً ومحتوىً — غني بـ Omega-3" },
  { name: "الكركم", benefit: "يزيل لويحات الزهايمر ويحفز BDNF" },
  { name: "البيض", benefit: "كولين — سلف Acetylcholine" },
  { name: "الشوكولاتة الداكنة", benefit: "يزيد تدفق الدم للدماغ ويحسن المزاج" },
];

export default function NootropicsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedStack, setExpandedStack] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#1e1b4b", borderBottomColor: "#312e81" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#a5b4fc" />
          <Text style={[styles.backText, { color: "#a5b4fc" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>الأداء الذهني والنوتروبيكس</Text>
        <Text style={[styles.headerSub, { color: "#a5b4fc" }]}>مكملات علمية لتحسين الذاكرة والتركيز والمزاج</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Brain Foods */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أطعمة الدماغ الأولى</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 2 }}>
          {BRAIN_FOODS.map((food, i) => (
            <View key={i} style={[styles.foodCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.foodName, { color: colors.primary }]}>{food.name}</Text>
              <Text style={[styles.foodBenefit, { color: colors.muted }]}>{food.benefit}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Stacks */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>بروتوكولات النوتروبيكس</Text>
        {NOOTROPIC_STACKS.map((stack) => (
          <View key={stack.id} style={[styles.stackCard, { backgroundColor: colors.card, borderColor: stack.color + "40" }]}>
            <Pressable
              style={[styles.stackHeader, { backgroundColor: stack.color + "10" }]}
              onPress={() => setExpandedStack(expandedStack === stack.id ? null : stack.id)}
            >
              <IconSymbol name={expandedStack === stack.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.stackHeaderInfo}>
                <Text style={[styles.stackTitle, { color: colors.foreground }]}>{stack.title}</Text>
                <Text style={[styles.stackSubtitle, { color: colors.muted }]}>{stack.subtitle}</Text>
                <View style={[styles.timingBadge, { backgroundColor: stack.color + "20" }]}>
                  <Text style={[styles.timingText, { color: stack.color }]}>{stack.timing}</Text>
                </View>
              </View>
              <View style={[styles.stackIcon, { backgroundColor: stack.color + "20" }]}>
                <IconSymbol name={stack.icon} size={22} color={stack.color} />
              </View>
            </Pressable>

            {expandedStack === stack.id && (
              <View style={{ padding: 12, gap: 10 }}>
                {stack.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: stack.color + "08", borderColor: stack.color + "20" }]}>
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    <Text style={[styles.suppDose, { color: stack.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppMechanism, { color: colors.muted }]}>آلية: {supp.mechanism}</Text>
                    <View style={[styles.effectBadge, { backgroundColor: stack.color + "15" }]}>
                      <Text style={[styles.effectText, { color: stack.color }]}>{supp.effect}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Warning */}
        <View style={[styles.warning, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
          <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
          <Text style={[styles.warningText, { color: colors.muted }]}>
            لا تجمع أكثر من ستاك واحد في البداية. ابدأ بجرعات منخفضة وراقب الاستجابة. بعض المكملات قد تتفاعل مع الأدوية.
          </Text>
        </View>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  foodCard: { width: 150, padding: 12, borderRadius: 14, borderWidth: 1, gap: 6 },
  foodName: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  foodBenefit: { fontSize: 11, lineHeight: 16, textAlign: "right", fontFamily: "Cairo" },
  stackCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  stackHeader: { flexDirection: "row-reverse", alignItems: "flex-start", padding: 14, gap: 10 },
  stackHeaderInfo: { flex: 1, alignItems: "flex-end", gap: 4 },
  stackTitle: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  stackSubtitle: { fontSize: 12, fontFamily: "Cairo" },
  timingBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  timingText: { fontSize: 11, fontWeight: "600", fontFamily: "Cairo-Bold" },
  stackIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppMechanism: { fontSize: 11, lineHeight: 16, textAlign: "right", fontFamily: "Cairo" },
  effectBadge: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  effectText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  warning: { flexDirection: "row-reverse", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  warningText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
