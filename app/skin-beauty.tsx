/**
 * الجلد والجمال ومكافحة الشيخوخة
 * Features #43, #44, #45: Skin, hair, nails, anti-aging protocols
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const SECTIONS = [
  {
    id: "skin",
    title: "بروتوكول الجلد الصحي",
    icon: "sparkles" as const,
    color: "#EC4899",
    description: "مكملات مدعومة علمياً لتحسين مرونة الجلد وتقليل التجاعيد",
    supplements: [
      { name: "كولاجين Hydrolyzed Type I+III", dose: "10 غ/يوم", timing: "صباحاً على معدة فارغة", reason: "يحسن مرونة الجلد ويقلل التجاعيد في 8-12 أسبوع", priority: "أساسي" as const },
      { name: "فيتامين C Buffered", dose: "1000-2000 مغ/يوم", timing: "مع الكولاجين", reason: "ضروري لتركيب الكولاجين — يضاعف فعاليته", priority: "أساسي" as const },
      { name: "فيتامين E (Mixed Tocopherols)", dose: "400 IU/يوم", timing: "مع الطعام", reason: "مضاد أكسدة يحمي الجلد من الشيخوخة المبكرة", priority: "مهم" as const },
      { name: "أوميغا-3", dose: "2-3 غ/يوم", timing: "مع الطعام", reason: "يرطب الجلد من الداخل ويقلل الالتهاب", priority: "مهم" as const },
      { name: "الزنك Picolinate", dose: "25-30 مغ/يوم", timing: "مع الطعام", reason: "يعالج حب الشباب ويسرع شفاء الجروح", priority: "مهم" as const },
      { name: "Astaxanthin", dose: "4-8 مغ/يوم", timing: "مع الطعام الدهني", reason: "أقوى مضاد أكسدة للجلد — يحمي من الشمس من الداخل", priority: "اختياري" as const },
      { name: "Hyaluronic Acid", dose: "120-240 مغ/يوم", timing: "مع الماء", reason: "يرطب الجلد عمقاً ويملأ التجاعيد", priority: "اختياري" as const },
    ],
    tips: [
      "اشرب 2-3 لتر ماء يومياً — الترطيب الداخلي أهم من الكريمات",
      "الكولاجين يحتاج 8-12 أسبوع لرؤية النتائج — الصبر مهم",
      "النوم الكافي (7-9 ساعات) يضاعف تجديد خلايا الجلد",
      "تجنب السكر المكرر — يسبب Glycation يدمر الكولاجين",
    ],
  },
  {
    id: "hair",
    title: "مكملات الشعر والأظافر",
    icon: "scissors" as const,
    color: "#8B5CF6",
    description: "مكملات لتقوية الشعر وتقليل التساقط وتحسين الأظافر",
    supplements: [
      { name: "البيوتين (B7)", dose: "5000-10000 مكغ/يوم", timing: "مع الطعام", reason: "يقوي الشعر والأظافر — نتائج في 3-6 أشهر", priority: "أساسي" as const },
      { name: "الحديد (Ferrous Bisglycinate)", dose: "25-50 مغ/يوم", timing: "على معدة فارغة مع C", reason: "نقص الحديد السبب الأول لتساقط الشعر عند المرأة", priority: "أساسي" as const },
      { name: "الزنك", dose: "25-30 مغ/يوم", timing: "مع الطعام", reason: "يقلل تساقط الشعر ويحسن كثافته", priority: "مهم" as const },
      { name: "فيتامين D3", dose: "5000 IU/يوم", timing: "مع وجبة دهنية", reason: "نقصه يسبب تساقط الشعر — ضروري لبصيلات الشعر", priority: "مهم" as const },
      { name: "Saw Palmetto", dose: "320 مغ/يوم", timing: "مع الطعام", reason: "يمنع تحويل التستوستيرون لـ DHT المسبب للصلع", priority: "اختياري" as const },
      { name: "Collagen Type I+III", dose: "10 غ/يوم", timing: "صباحاً", reason: "يقوي بنية الشعر والأظافر من الداخل", priority: "اختياري" as const },
    ],
    tips: [
      "افحص مستوى الحديد والفيريتين قبل البدء — الهدف فيريتين > 70",
      "البيوتين يحتاج 3-6 أشهر — لا تتوقع نتائج سريعة",
      "تجنب الحرارة الشديدة والمواد الكيميائية القاسية",
      "البروتين الكافي في الغذاء ضروري — الشعر مصنوع من الكيراتين",
    ],
  },
  {
    id: "antiaging",
    title: "مكافحة الشيخوخة المتقدمة",
    icon: "clock.arrow.circlepath" as const,
    color: "#F59E0B",
    description: "بروتوكول علمي لإبطاء الشيخوخة على المستوى الخلوي",
    supplements: [
      { name: "NMN أو NR (NAD+ Precursor)", dose: "500-1000 مغ/يوم", timing: "صباحاً على معدة فارغة", reason: "يرفع مستويات NAD+ — يحسن طاقة الخلايا ويبطئ الشيخوخة", priority: "أساسي" as const },
      { name: "Resveratrol", dose: "500 مغ/يوم", timing: "مع الطعام الدهني", reason: "يفعّل Sirtuins — جينات طول العمر", priority: "أساسي" as const },
      { name: "CoQ10 Ubiquinol", dose: "200-400 مغ/يوم", timing: "مع الطعام", reason: "يحسن طاقة الميتوكوندريا — يتناقص مع العمر", priority: "أساسي" as const },
      { name: "Alpha Lipoic Acid", dose: "300-600 مغ/يوم", timing: "بين الوجبات", reason: "مضاد أكسدة قوي يعمل في الماء والدهون", priority: "مهم" as const },
      { name: "Pterostilbene", dose: "50-100 مغ/يوم", timing: "مع الطعام", reason: "أقوى من Resveratrol وامتصاصه أفضل", priority: "مهم" as const },
      { name: "Astaxanthin", dose: "8-12 مغ/يوم", timing: "مع الطعام الدهني", reason: "أقوى مضاد أكسدة طبيعي — يحمي DNA والجلد", priority: "مهم" as const },
      { name: "Spermidine", dose: "1-2 مغ/يوم", timing: "مع الطعام", reason: "يحفز Autophagy — تنظيف الخلايا الطبيعي", priority: "اختياري" as const },
    ],
    tips: [
      "الصيام المتقطع يفعّل Autophagy ويضاعف فعالية هذه المكملات",
      "التمرين المنتظم يرفع NAD+ بشكل طبيعي",
      "تجنب السكر والكربوهيدرات المكررة — تسرع الشيخوخة",
      "النوم الكافي ضروري — معظم إصلاح الخلايا يحدث أثناء النوم",
    ],
  },
  {
    id: "sleep",
    title: "بروتوكول النوم العميق",
    icon: "moon.stars.fill" as const,
    color: "#6366F1",
    description: "مكملات لتحسين جودة النوم وتعميق مراحل REM",
    supplements: [
      { name: "المغنيسيوم Glycinate/Threonate", dose: "400-500 مغ", timing: "قبل النوم بساعة", reason: "يهدئ الجهاز العصبي ويحسن جودة النوم بشكل كبير", priority: "أساسي" as const },
      { name: "Ashwagandha KSM-66", dose: "300-600 مغ", timing: "قبل النوم", reason: "يخفض الكورتيزول ويقلل القلق — يحسن النوم", priority: "أساسي" as const },
      { name: "L-Theanine", dose: "200-400 مغ", timing: "قبل النوم بساعة", reason: "يحفز موجات ألفا في الدماغ — يهدئ دون نعاس", priority: "مهم" as const },
      { name: "الميلاتونين", dose: "0.5-3 مغ", timing: "قبل النوم بـ 30 دقيقة", reason: "يضبط الساعة البيولوجية — ابدأ بجرعة صغيرة", priority: "مهم" as const },
      { name: "Glycine", dose: "3-5 غ", timing: "قبل النوم مباشرة", reason: "يخفض درجة حرارة الجسم الأساسية — يحسن جودة النوم", priority: "مهم" as const },
      { name: "Valerian Root", dose: "300-600 مغ", timing: "قبل النوم بساعة", reason: "عشبة طبيعية تحسن النوم وتقلل الاستيقاظ الليلي", priority: "اختياري" as const },
      { name: "GABA", dose: "500-750 مغ", timing: "قبل النوم", reason: "ناقل عصبي مهدئ — يقلل الأفكار المتسارعة", priority: "اختياري" as const },
    ],
    tips: [
      "أطفئ الشاشات قبل ساعة من النوم — الضوء الأزرق يمنع الميلاتونين",
      "اجعل غرفتك باردة (18-20°C) — الحرارة تعطل النوم العميق",
      "النوم والاستيقاظ في نفس الوقت يومياً يضبط الساعة البيولوجية",
      "تجنب الكافيين بعد الساعة 2 ظهراً",
    ],
  },
];

const PRIORITY_COLORS = { "أساسي": "#EF4444", "مهم": "#F59E0B", "اختياري": "#10B981" };

export default function SkinBeautyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const selected = SECTIONS.find((s) => s.id === activeSection);

  if (selected) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setActiveSection(null)}>
            <IconSymbol name="chevron.right" size={22} color={colors.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{selected.title}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <View style={[styles.descCard, { backgroundColor: selected.color + "10", borderColor: selected.color + "25" }]}>
            <IconSymbol name={selected.icon} size={24} color={selected.color} />
            <Text style={[styles.descText, { color: colors.foreground }]}>{selected.description}</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكملات الموصى بها</Text>
          {selected.supplements.map((s, i) => (
            <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: PRIORITY_COLORS[s.priority] + "30", borderLeftColor: PRIORITY_COLORS[s.priority], borderLeftWidth: 4 }]}>
              <View style={styles.suppHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[s.priority] + "15" }]}>
                  <Text style={[styles.priorityText, { color: PRIORITY_COLORS[s.priority] }]}>{s.priority}</Text>
                </View>
                <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
              </View>
              <View style={styles.suppMeta}>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.muted }]}>التوقيت</Text>
                  <Text style={[styles.metaValue, { color: colors.primary }]}>{s.timing}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.muted }]}>الجرعة</Text>
                  <Text style={[styles.metaValue, { color: colors.foreground }]}>{s.dose}</Text>
                </View>
              </View>
              <Text style={[styles.suppReason, { color: colors.muted }]}>{s.reason}</Text>
            </View>
          ))}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نصائح مهمة</Text>
          {selected.tips.map((tip, i) => (
            <View key={i} style={[styles.tipRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.tipNum, { color: selected.color }]}>{i + 1}</Text>
              <Text style={[styles.tipText, { color: colors.foreground }]}>{tip}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الجلد والجمال والنوم</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>بروتوكولات متخصصة مدعومة علمياً</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {SECTIONS.map((section) => (
          <Pressable
            key={section.id}
            style={({ pressed }) => [styles.sectionCard, { backgroundColor: colors.surface, borderColor: section.color + "30", opacity: pressed ? 0.85 : 1 }]}
            onPress={() => setActiveSection(section.id)}
          >
            <View style={[styles.sectionIcon, { backgroundColor: section.color + "15" }]}>
              <IconSymbol name={section.icon} size={28} color={section.color} />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={[styles.sectionCardTitle, { color: colors.foreground }]}>{section.title}</Text>
              <Text style={[styles.sectionCardSub, { color: colors.muted }]}>{section.description}</Text>
              <Text style={[styles.sectionCount, { color: section.color }]}>{section.supplements.length} مكمل</Text>
            </View>
            <IconSymbol name="chevron.left" size={18} color={colors.muted} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  descCard: { borderRadius: 14, padding: 16, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  descText: { flex: 1, fontSize: 14, lineHeight: 22, textAlign: "right", fontFamily: "Cairo" },
  suppCard: { borderRadius: 12, padding: 14, borderWidth: 1, gap: 10 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  suppName: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppMeta: { flexDirection: "row-reverse", gap: 16 },
  metaItem: { alignItems: "flex-end", gap: 2 },
  metaLabel: { fontSize: 10, fontFamily: "Cairo" },
  metaValue: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppReason: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  tipRow: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  tipNum: { fontSize: 18, fontWeight: "900", width: 24, textAlign: "center", fontFamily: "Cairo-Black" },
  tipText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  sectionCard: { borderRadius: 16, padding: 16, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  sectionIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  sectionCardTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  sectionCardSub: { fontSize: 12, lineHeight: 18, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  sectionCount: { fontSize: 12, fontWeight: "700", marginTop: 4, fontFamily: "Cairo-Bold" },
});
