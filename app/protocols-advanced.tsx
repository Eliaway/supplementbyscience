/**
 * البروتوكولات المتقدمة — Advanced Protocols
 * Features #63-#87: Fertility, Alzheimer, Bones, Pain, Circulation, Skin, Sleep, etc.
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface Protocol {
  id: string;
  title: string;
  subtitle: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  duration: string;
  supplements: {
    name: string;
    dose: string;
    timing: string;
    reason: string;
    priority: "أساسي" | "مهم" | "اختياري";
  }[];
  warnings: string[];
  tips: string[];
}

const PROTOCOLS: Protocol[] = [
  {
    id: "fertility",
    title: "بروتوكول الخصوبة والإنجاب",
    subtitle: "للرجل والمرأة — تحسين جودة البويضات والحيوانات",
    icon: "heart.circle.fill",
    color: "#EC4899",
    duration: "3-6 أشهر",
    supplements: [
      { name: "CoQ10 Ubiquinol", dose: "400-600 مغ/يوم", timing: "مع الطعام", reason: "يحسن جودة البويضات والحيوانات المنوية بشكل كبير", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000 IU/يوم", timing: "مع وجبة دهنية", reason: "ضروري للتوازن الهرموني والخصوبة", priority: "أساسي" },
      { name: "حمض الفوليك (Methylfolate)", dose: "400-800 مكغ/يوم", timing: "صباحاً", reason: "يقلل عيوب الأنبوب العصبي — ضروري قبل الحمل", priority: "أساسي" },
      { name: "أوميغا-3", dose: "2-3 غ/يوم", timing: "مع الطعام", reason: "يحسن جودة الحيوانات المنوية وتطور الجنين", priority: "أساسي" },
      { name: "الزنك", dose: "25-30 مغ/يوم", timing: "مع الطعام", reason: "ضروري لإنتاج التستوستيرون وجودة الحيوانات المنوية", priority: "مهم" },
      { name: "Myo-Inositol", dose: "2-4 غ/يوم", timing: "مع الطعام", reason: "يحسن حساسية الأنسولين ويساعد في PCOS", priority: "مهم" },
      { name: "NAC (N-Acetyl Cysteine)", dose: "600 مغ مرتين/يوم", timing: "بين الوجبات", reason: "مضاد أكسدة قوي يحمي البويضات والحيوانات", priority: "اختياري" },
    ],
    warnings: ["استشر طبيب متخصص في الخصوبة قبل البدء", "CoQ10 يحتاج 3 أشهر على الأقل لرؤية النتائج", "Methylfolate أفضل من Folic Acid العادي لمن لديهم MTHFR"],
    tips: ["ابدأ البروتوكول قبل 3 أشهر من محاولة الحمل", "تجنب التدخين والكحول والحرارة الشديدة", "النوم الكافي والتوتر المنخفض يحسنان الخصوبة بشكل كبير"],
  },
  {
    id: "alzheimer",
    title: "بروتوكول صحة الدماغ والوقاية من الزهايمر",
    subtitle: "مبني على بروتوكول Bredesen ReCODE",
    icon: "brain.head.profile",
    color: "#8B5CF6",
    duration: "مستمر — 6+ أشهر",
    supplements: [
      { name: "أوميغا-3 DHA عالي", dose: "2-3 غ DHA/يوم", timing: "مع الطعام", reason: "DHA يشكل 40% من دهون الدماغ — ضروري للذاكرة", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000-8000 IU/يوم", timing: "مع وجبة دهنية", reason: "نقصه مرتبط بزيادة خطر الزهايمر بنسبة 50%+", priority: "أساسي" },
      { name: "Lion's Mane Mushroom", dose: "1000-3000 مغ/يوم", timing: "صباحاً", reason: "يحفز NGF (عامل نمو الأعصاب) — يحسن الذاكرة", priority: "أساسي" },
      { name: "Phosphatidylserine", dose: "300 مغ/يوم", timing: "مع الطعام", reason: "يحسن التواصل بين خلايا الدماغ والذاكرة", priority: "مهم" },
      { name: "Bacopa Monnieri", dose: "300 مغ/يوم", timing: "مع الطعام", reason: "يحسن الذاكرة والتعلم — نتائج بعد 12 أسبوع", priority: "مهم" },
      { name: "Curcumin (Theracurmin)", dose: "90 مغ مرتين/يوم", timing: "مع الطعام", reason: "يقلل البلاك الأميلويدي المرتبط بالزهايمر", priority: "مهم" },
      { name: "Resveratrol", dose: "500 مغ/يوم", timing: "مع الطعام", reason: "يفعّل SIRT1 — يحمي الخلايا العصبية من الشيخوخة", priority: "اختياري" },
    ],
    warnings: ["هذا البروتوكول وقائي وليس علاجاً للزهايمر المشخص", "استشر طبيباً أعصاب للحالات المتقدمة", "Curcumin العادي امتصاصه ضعيف — استخدم Theracurmin أو Meriva"],
    tips: ["النوم 7-8 ساعات ضروري لتنظيف الدماغ من السموم (Glymphatic System)", "التمرين الهوائي 150 دقيقة/أسبوع يقلل خطر الزهايمر 40%", "الصيام المتقطع يحفز Autophagy ويحمي الدماغ"],
  },
  {
    id: "bones",
    title: "بروتوكول صحة العظام وهشاشة العظام",
    subtitle: "للوقاية والعلاج الداعم لهشاشة العظام",
    icon: "figure.walk",
    color: "#F97316",
    duration: "مستمر",
    supplements: [
      { name: "الكالسيوم (Calcium Citrate)", dose: "500 مغ مرتين/يوم", timing: "مع الطعام", reason: "Citrate يمتص بدون حمض معدي — أفضل لكبار السن", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000 IU/يوم", timing: "مع وجبة دهنية", reason: "ضروري لامتصاص الكالسيوم — بدونه الكالسيوم لا يعمل", priority: "أساسي" },
      { name: "فيتامين K2 (MK-7)", dose: "180-200 مكغ/يوم", timing: "مع الطعام", reason: "يوجه الكالسيوم للعظام ويمنع تكلس الشرايين", priority: "أساسي" },
      { name: "المغنيسيوم Glycinate", dose: "300-400 مغ/يوم", timing: "مساءً", reason: "50% من المغنيسيوم في الجسم موجود في العظام", priority: "مهم" },
      { name: "الكولاجين النوع الأول", dose: "10 غ/يوم", timing: "صباحاً مع فيتامين C", reason: "يبني المصفوفة العضوية للعظام — يقلل الكسور", priority: "مهم" },
      { name: "البورون", dose: "3-6 مغ/يوم", timing: "مع الطعام", reason: "يحسن استخدام الكالسيوم والمغنيسيوم في العظام", priority: "اختياري" },
    ],
    warnings: ["لا تأخذ أكثر من 500 مغ كالسيوم في جرعة واحدة", "الكالسيوم بدون D3 وK2 قد يتراكم في الشرايين", "استشر طبيبك إذا كنت تأخذ أدوية هشاشة العظام"],
    tips: ["تمارين المقاومة (الأوزان) تبني العظام أكثر من أي مكمل", "قلل الكافيين والكحول — يزيدان فقدان الكالسيوم", "الشمس 20 دقيقة يومياً تنتج D3 طبيعياً"],
  },
  {
    id: "pain",
    title: "بروتوكول إدارة الألم المزمن",
    subtitle: "للألم العضلي والمفصلي والعصبي",
    icon: "bolt.heart.fill",
    color: "#EF4444",
    duration: "4-12 أسبوع",
    supplements: [
      { name: "Curcumin + Piperine", dose: "1000-2000 مغ/يوم", timing: "مع الطعام", reason: "مضاد التهاب طبيعي — فعال كـ Ibuprofen في الدراسات", priority: "أساسي" },
      { name: "أوميغا-3", dose: "3-4 غ/يوم", timing: "مع الطعام", reason: "يقلل الالتهاب الجهازي — يخفف الألم المزمن", priority: "أساسي" },
      { name: "المغنيسيوم Glycinate", dose: "400-600 مغ/يوم", timing: "مساءً", reason: "يرخي العضلات ويقلل الألم العضلي والصداع", priority: "أساسي" },
      { name: "Boswellia Serrata", dose: "300 مغ ثلاث مرات/يوم", timing: "مع الطعام", reason: "يثبط 5-LOX — يقلل التهاب المفاصل بشكل فعال", priority: "مهم" },
      { name: "Glucosamine + Chondroitin", dose: "1500 مغ + 1200 مغ/يوم", timing: "مع الطعام", reason: "يبني الغضروف ويقلل ألم الركبة والورك", priority: "مهم" },
      { name: "فيتامين D3", dose: "5000 IU/يوم", timing: "مع وجبة دهنية", reason: "نقصه يزيد حساسية الألم — تصحيحه يخفف الألم", priority: "مهم" },
      { name: "PEA (Palmitoylethanolamide)", dose: "600 مغ مرتين/يوم", timing: "مع الطعام", reason: "يقلل الألم العصبي والالتهاب — بدون آثار جانبية", priority: "اختياري" },
    ],
    warnings: ["لا يغني عن العلاج الطبي للألم الشديد", "Curcumin يخفف تجلط الدم — احذر مع مضادات التخثر", "استشر طبيبك إذا كان الألم مصاحباً لأعراض أخرى"],
    tips: ["الحرارة والبرودة المتناوبة تخفف الألم الموضعي", "النوم الكافي يقلل حساسية الألم بشكل كبير", "التمرين المعتدل يقلل الألم المزمن أكثر من الراحة التامة"],
  },
  {
    id: "circulation",
    title: "بروتوكول الدورة الدموية والقلب",
    subtitle: "لتحسين تدفق الدم وصحة الأوعية",
    icon: "heart.fill",
    color: "#EF4444",
    duration: "3-6 أشهر",
    supplements: [
      { name: "أوميغا-3", dose: "2-4 غ/يوم", timing: "مع الطعام", reason: "يخفض الدهون الثلاثية ويقلل التهاب الأوعية", priority: "أساسي" },
      { name: "CoQ10 Ubiquinol", dose: "200-400 مغ/يوم", timing: "مع وجبة دهنية", reason: "يحسن كفاءة القلب وإنتاج الطاقة في عضلة القلب", priority: "أساسي" },
      { name: "المغنيسيوم Taurate", dose: "400 مغ/يوم", timing: "مساءً", reason: "يرخي الأوعية الدموية ويخفض ضغط الدم", priority: "أساسي" },
      { name: "Nattokinase", dose: "2000 FU/يوم", timing: "بين الوجبات", reason: "يذيب الجلطات الصغيرة ويحسن تدفق الدم", priority: "مهم" },
      { name: "Bergamot Extract", dose: "500-1000 مغ/يوم", timing: "مع الطعام", reason: "يخفض LDL ويرفع HDL — بديل طبيعي للستاتين", priority: "مهم" },
      { name: "Resveratrol", dose: "500 مغ/يوم", timing: "مع الطعام", reason: "يحمي بطانة الأوعية ويقلل الأكسدة", priority: "اختياري" },
    ],
    warnings: ["Nattokinase يخفف الدم — لا تجمعه مع Warfarin أو Aspirin", "استشر طبيبك إذا كنت تأخذ أدوية ضغط أو قلب", "راقب ضغط الدم بانتظام أثناء البروتوكول"],
    tips: ["تمارين الكارديو 150 دقيقة/أسبوع أهم من أي مكمل", "قلل الملح والسكر المضاف لتحسين ضغط الدم", "الإقلاع عن التدخين يحسن الدورة الدموية خلال أسابيع"],
  },
  {
    id: "skin",
    title: "بروتوكول صحة الجلد والشعر والأظافر",
    subtitle: "من الداخل للخارج — تغذية خلايا الجلد",
    icon: "sparkles",
    color: "#F472B6",
    duration: "3-6 أشهر",
    supplements: [
      { name: "الكولاجين النوع الأول والثالث", dose: "10-15 غ/يوم", timing: "صباحاً مع فيتامين C", reason: "يزيد مرونة الجلد ويقلل التجاعيد", priority: "أساسي" },
      { name: "فيتامين C", dose: "1000-2000 مغ/يوم", timing: "مع الكولاجين", reason: "ضروري لتخليق الكولاجين — يضاعف فعاليته", priority: "أساسي" },
      { name: "أوميغا-3", dose: "2-3 غ/يوم", timing: "مع الطعام", reason: "يرطب الجلد من الداخل ويقلل الالتهاب والحب", priority: "أساسي" },
      { name: "الزنك Picolinate", dose: "25-30 مغ/يوم", timing: "مع الطعام", reason: "يعالج حب الشباب ويدعم تجديد خلايا الجلد", priority: "مهم" },
      { name: "Biotin (فيتامين H)", dose: "2500-5000 مكغ/يوم", timing: "مع الطعام", reason: "يقوي الشعر والأظافر — فعال لنقص البيوتين", priority: "مهم" },
      { name: "Silica (Silicon)", dose: "10-20 مغ/يوم", timing: "مع الطعام", reason: "يقوي الشعر والأظافر ويحسن مرونة الجلد", priority: "اختياري" },
      { name: "Astaxanthin", dose: "4-12 مغ/يوم", timing: "مع وجبة دهنية", reason: "أقوى مضاد أكسدة للجلد — يحمي من الشيخوخة", priority: "اختياري" },
    ],
    warnings: ["البيوتين يؤثر على نتائج تحاليل الغدة الدرقية — أوقفه قبل التحاليل بأسبوع", "الكولاجين يحتاج فيتامين C ليعمل — لا تأخذه بدونه", "النتائج تظهر بعد 3 أشهر على الأقل"],
    tips: ["الماء الكافي (8-10 أكواب) أساسي لصحة الجلد", "النوم الكافي يجدد خلايا الجلد أثناء الليل", "واقي الشمس يمنع تدمير الكولاجين من الأشعة فوق البنفسجية"],
  },
  {
    id: "sleep",
    title: "بروتوكول تحسين النوم العميق",
    subtitle: "للأرق وضعف جودة النوم",
    icon: "moon.stars.fill",
    color: "#6366F1",
    duration: "4-8 أسابيع",
    supplements: [
      { name: "المغنيسيوم Glycinate", dose: "400-500 مغ", timing: "قبل النوم بساعة", reason: "يرخي الجهاز العصبي ويحسن جودة النوم العميق", priority: "أساسي" },
      { name: "L-Theanine", dose: "200-400 مغ", timing: "قبل النوم بساعة", reason: "يهدئ الدماغ دون نعاس — يحسن نوعية النوم", priority: "أساسي" },
      { name: "Ashwagandha KSM-66", dose: "300-600 مغ", timing: "مساءً", reason: "يخفض الكورتيزول المرتفع الذي يمنع النوم", priority: "مهم" },
      { name: "الميلاتونين", dose: "0.5-1 مغ", timing: "قبل النوم بـ 30 دقيقة", reason: "يضبط الساعة البيولوجية — جرعة صغيرة أفضل", priority: "مهم" },
      { name: "Glycine", dose: "3 غ", timing: "قبل النوم مباشرة", reason: "يخفض درجة حرارة الجسم الأساسية — يحسن النوم العميق", priority: "مهم" },
      { name: "Valerian Root", dose: "300-600 مغ", timing: "قبل النوم بساعة", reason: "يزيد GABA — يقلل الوقت للنوم", priority: "اختياري" },
      { name: "فيتامين D3", dose: "5000 IU", timing: "صباحاً فقط", reason: "نقصه يسبب اضطرابات النوم — خذه صباحاً لا مساءً", priority: "اختياري" },
    ],
    warnings: ["الميلاتونين جرعة كبيرة (5-10 مغ) قد تسبب نعاساً في اليوم التالي", "لا تقود بعد أخذ Valerian", "إذا استمر الأرق أكثر من شهر استشر طبيباً"],
    tips: ["درجة حرارة الغرفة 18-20°C مثالية للنوم", "لا شاشات قبل النوم بساعة — الضوء الأزرق يمنع الميلاتونين", "وقت نوم ثابت يومياً أهم من أي مكمل"],
  },
];

export default function AdvancedProtocolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  if (selectedProtocol) {
    const p = selectedProtocol;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: p.color + "12", borderBottomColor: p.color + "30" }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedProtocol(null)}>
            <IconSymbol name="chevron.right" size={22} color={p.color} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>{p.title}</Text>
            <Text style={[styles.headerSub, { color: colors.muted }]}>المدة: {p.duration}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكملات المطلوبة</Text>
          {p.supplements.map((s, i) => (
            <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: s.priority === "أساسي" ? p.color + "40" : colors.border, borderLeftColor: s.priority === "أساسي" ? p.color : colors.border, borderLeftWidth: s.priority === "أساسي" ? 4 : 1 }]}>
              <View style={styles.suppTop}>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
                  <Text style={[styles.suppDose, { color: p.color }]}>{s.dose}</Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: s.priority === "أساسي" ? p.color + "15" : s.priority === "مهم" ? colors.warning + "15" : colors.success + "15" }]}>
                  <Text style={[styles.priorityText, { color: s.priority === "أساسي" ? p.color : s.priority === "مهم" ? colors.warning : colors.success }]}>{s.priority}</Text>
                </View>
              </View>
              <View style={styles.suppMeta}>
                <View style={[styles.timingBadge, { backgroundColor: colors.background }]}>
                  <IconSymbol name="clock.fill" size={10} color={colors.muted} />
                  <Text style={[styles.timingText, { color: colors.muted }]}>{s.timing}</Text>
                </View>
              </View>
              <Text style={[styles.suppReason, { color: colors.muted }]}>{s.reason}</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>تحذيرات مهمة</Text>
          {p.warnings.map((w, i) => (
            <View key={i} style={[styles.warningRow, { backgroundColor: colors.error + "08", borderColor: colors.error + "20" }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={14} color={colors.error} />
              <Text style={[styles.warningText, { color: colors.foreground }]}>{w}</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نصائح لتحسين النتائج</Text>
          {p.tips.map((t, i) => (
            <View key={i} style={[styles.tipRow, { backgroundColor: p.color + "08", borderColor: p.color + "20" }]}>
              <IconSymbol name="lightbulb.fill" size={14} color={p.color} />
              <Text style={[styles.tipText, { color: colors.foreground }]}>{t}</Text>
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>البروتوكولات المتقدمة</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>7 بروتوكولات متخصصة</Text>
        </View>
      </View>

      <FlatList
        data={PROTOCOLS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.protocolCard, { backgroundColor: colors.surface, borderColor: item.color + "25", borderLeftColor: item.color, borderLeftWidth: 4 }, pressed && { opacity: 0.85 }]}
            onPress={() => setSelectedProtocol(item)}
          >
            <View style={styles.protocolTop}>
              <View style={[styles.protocolIcon, { backgroundColor: item.color + "15" }]}>
                <IconSymbol name={item.icon} size={24} color={item.color} />
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.protocolSub, { color: colors.muted }]}>{item.subtitle}</Text>
              </View>
              <IconSymbol name="chevron.left" size={16} color={colors.muted} />
            </View>
            <View style={styles.protocolMeta}>
              <View style={[styles.durationBadge, { backgroundColor: item.color + "12" }]}>
                <IconSymbol name="clock.fill" size={10} color={item.color} />
                <Text style={[styles.durationText, { color: item.color }]}>{item.duration}</Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.countText, { color: colors.muted }]}>{item.supplements.length} مكمل</Text>
              </View>
            </View>
          </Pressable>
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
  protocolCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  protocolTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  protocolIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  protocolTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  protocolSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  protocolMeta: { flexDirection: "row-reverse", gap: 8 },
  durationBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  durationText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { fontSize: 11, fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", marginTop: 4, fontFamily: "Cairo-Black" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  suppTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  suppName: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 13, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppMeta: { flexDirection: "row-reverse" },
  timingBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  timingText: { fontSize: 11, fontFamily: "Cairo" },
  suppReason: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  warningRow: { flexDirection: "row-reverse", gap: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  warningText: { flex: 1, fontSize: 13, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  tipRow: { flexDirection: "row-reverse", gap: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
