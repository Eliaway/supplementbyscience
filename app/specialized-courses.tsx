/**
 * الكورسات المتخصصة — Specialized Supplement Courses
 */
import { useState } from "react";
import {
  FlatList,
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface CourseItem {
  name: string;
  dose: string;
  timing: string;
  reason: string;
  priority: "أساسي" | "مساعد" | "اختياري";
}

interface SpecializedCourse {
  id: string;
  title: string;
  subtitle: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  targetAudience: string;
  duration: string;
  items: CourseItem[];
  keyBenefits: string[];
  importantNotes: string[];
}

const SPECIALIZED_COURSES: SpecializedCourse[] = [
  {
    id: "athletes",
    title: "كورس الرياضيين المتقدم",
    subtitle: "بناء العضلات، القوة، والتعافي السريع",
    icon: "figure.strengthtraining.traditional",
    color: "#F97316",
    targetAudience: "الرياضيون الذين يتدربون 4+ أيام أسبوعياً",
    duration: "مستمر",
    items: [
      { name: "الكرياتين Monohydrate", dose: "5 غ يومياً", timing: "بعد التمرين مع الكربوهيدرات", reason: "يزيد ATP — أكثر مكمل بحثاً لبناء القوة والكتلة", priority: "أساسي" },
      { name: "Whey Protein Isolate", dose: "25-40 غ", timing: "خلال 30 دقيقة بعد التمرين", reason: "يوفر الأحماض الأمينية الأساسية لبناء العضلات", priority: "أساسي" },
      { name: "Beta-Alanine", dose: "3.2 غ", timing: "قبل التمرين بـ 30 دقيقة", reason: "يرفع الكارنوزين — يقلل حمض اللاكتيك ويطيل التحمل", priority: "أساسي" },
      { name: "Citrulline Malate", dose: "6-8 غ", timing: "30 دقيقة قبل التمرين", reason: "يرفع NO — يحسن ضخ الدم وتوصيل الأكسجين للعضلات", priority: "مساعد" },
      { name: "الكولاجين + فيتامين C", dose: "15 غ + 500 مغ", timing: "قبل التمرين بـ 30 دقيقة", reason: "يقوي الأوتار والمفاصل — يقلل خطر الإصابات", priority: "مساعد" },
      { name: "Ashwagandha KSM-66", dose: "600 مغ", timing: "مع الطعام", reason: "يحسن VO2 max، يقلل الكورتيزول بعد التمرين", priority: "مساعد" },
      { name: "المغنيسيوم Glycinate", dose: "400 مغ", timing: "قبل النوم", reason: "يسرع التعافي العضلي ويحسن جودة النوم", priority: "مساعد" },
      { name: "Caffeine", dose: "200-400 مغ", timing: "30-60 دقيقة قبل التمرين", reason: "يرفع الأداء والتركيز — أكثر مكمل رياضي فعالاً", priority: "اختياري" },
    ],
    keyBenefits: [
      "زيادة القوة والكتلة العضلية خلال 4-8 أسابيع",
      "تسريع التعافي بين الجلسات",
      "تقليل خطر الإصابات الرياضية",
      "تحسين التحمل والأداء الهوائي",
    ],
    importantNotes: [
      "Beta-Alanine يسبب وخزاً جلدياً طبيعياً (Paresthesia) — يختفي مع الاستمرار",
      "الكرياتين يزيد وزن الماء في الأسبوع الأول — طبيعي جداً",
      "لا تتجاوز 400 مغ كافيين يومياً — قد يسبب اضطراب قلب",
      "تأكد من شرب 3+ لتر ماء يومياً مع الكرياتين",
    ],
  },
  {
    id: "women",
    title: "كورس المرأة الشامل",
    subtitle: "توازن هرموني، صحة العظام، والجمال من الداخل",
    icon: "person.fill",
    color: "#EC4899",
    targetAudience: "النساء في جميع الأعمار",
    duration: "3-6 أشهر",
    items: [
      { name: "فيتامين D3 + K2", dose: "5000 IU + 200 مكغ", timing: "مع الطعام الدهني", reason: "صحة العظام، المناعة، التوازن الهرموني", priority: "أساسي" },
      { name: "الحديد Bisglycinate", dose: "25-30 مغ", timing: "بعيداً عن الكالسيوم والقهوة", reason: "تعويض الحديد المفقود مع الدورة الشهرية — يقلل التعب", priority: "أساسي" },
      { name: "المغنيسيوم Glycinate", dose: "400 مغ", timing: "قبل النوم", reason: "يقلل آلام الدورة، يحسن النوم، يقلل القلق", priority: "أساسي" },
      { name: "أوميغا-3 (EPA عالي)", dose: "2 غ", timing: "مع الطعام", reason: "يقلل التهاب الدورة الشهرية ويدعم صحة القلب", priority: "أساسي" },
      { name: "الكولاجين Type I+III", dose: "10-15 غ", timing: "قبل النوم أو صباحاً", reason: "يحسن الجلد، الشعر، الأظافر، والمفاصل", priority: "مساعد" },
      { name: "فيتامين B Complex", dose: "حسب المنتج", timing: "مع الإفطار", reason: "طاقة، صحة الأعصاب، تقليل PMS", priority: "مساعد" },
      { name: "Vitex (Chasteberry)", dose: "400 مغ", timing: "صباحاً", reason: "ينظم الدورة الشهرية ويقلل أعراض PMS", priority: "مساعد" },
      { name: "Inositol (Myo+D-Chiro)", dose: "4 غ + 400 مغ", timing: "مع الطعام", reason: "يحسن PCOS، يقلل مقاومة الأنسولين", priority: "اختياري" },
    ],
    keyBenefits: [
      "تنظيم الدورة الشهرية وتقليل الألم",
      "تحسين الجلد والشعر والأظافر",
      "رفع مستوى الطاقة وتقليل التعب",
      "دعم صحة العظام وتقليل خطر هشاشة العظام",
    ],
    importantNotes: [
      "Vitex يحتاج 3 أشهر لإظهار نتائجه — الصبر مهم",
      "الحديد يسبب إمساكاً — اشربي ماءً كافياً وتناولي ألياف",
      "لا تأخذي الحديد مع الكالسيوم أو القهوة — يقلل الامتصاص",
      "استشيري طبيبتك إذا كنتِ حاملاً أو مرضعاً",
    ],
  },
  {
    id: "elderly",
    title: "كورس كبار السن",
    subtitle: "الحفاظ على الحيوية، القوة، والوضوح الذهني",
    icon: "figure.walk",
    color: "#0EA5E9",
    targetAudience: "الأشخاص فوق 55 سنة",
    duration: "مستمر",
    items: [
      { name: "فيتامين D3", dose: "5000-10000 IU", timing: "مع الطعام الدهني", reason: "نقصه شائع جداً — يقلل خطر الكسور والأمراض المزمنة", priority: "أساسي" },
      { name: "الكالسيوم Citrate", dose: "500-1000 مغ", timing: "مع الطعام (مقسمة)", reason: "يحمي العظام — Citrate أفضل امتصاصاً من Carbonate", priority: "أساسي" },
      { name: "أوميغا-3", dose: "2-3 غ EPA+DHA", timing: "مع الطعام", reason: "يحمي القلب والدماغ ويقلل الالتهاب", priority: "أساسي" },
      { name: "فيتامين B12 (Methylcobalamin)", dose: "1000 مكغ", timing: "صباحاً", reason: "الامتصاص يتراجع مع العمر — ضروري للأعصاب والذاكرة", priority: "أساسي" },
      { name: "CoQ10 (Ubiquinol)", dose: "200 مغ", timing: "مع الطعام الدهني", reason: "إنتاجه يتراجع مع العمر — يحسن طاقة القلب والعضلات", priority: "مساعد" },
      { name: "المغنيسيوم Glycinate", dose: "400 مغ", timing: "قبل النوم", reason: "يقلل تشنجات العضلات، يحسن النوم، يدعم القلب", priority: "مساعد" },
      { name: "الكرياتين", dose: "3-5 غ", timing: "مع الطعام", reason: "يحمي من ضمور العضلات (Sarcopenia) مع التقدم في السن", priority: "مساعد" },
      { name: "Glucosamine + Chondroitin", dose: "1500 مغ + 1200 مغ", timing: "مع الطعام", reason: "يقلل آلام المفاصل ويحافظ على الغضاريف", priority: "اختياري" },
    ],
    keyBenefits: [
      "الحفاظ على كثافة العظام وتقليل خطر الكسور",
      "تحسين الذاكرة والوضوح الذهني",
      "الحفاظ على كتلة العضلات وقوتها",
      "حماية القلب والعيون والمفاصل",
    ],
    importantNotes: [
      "راجع طبيبك قبل البدء — قد تتفاعل مع الأدوية المزمنة",
      "الكالسيوم Carbonate يحتاج حمض معدي — Citrate أفضل لمن يأخذ مثبطات الحموضة",
      "CoQ10 ضروري جداً لمن يأخذ أدوية الستاتين",
      "ابدأ بجرعات صغيرة وزد تدريجياً",
    ],
  },
  {
    id: "diabetes",
    title: "كورس مرضى السكري",
    subtitle: "تحسين حساسية الأنسولين وتقليل المضاعفات",
    icon: "drop.fill",
    color: "#10B981",
    targetAudience: "مرضى السكري النوع الثاني أو من لديهم مقاومة أنسولين",
    duration: "مستمر",
    items: [
      { name: "Berberine", dose: "500 مغ ثلاث مرات", timing: "مع الوجبات", reason: "يحسن حساسية الأنسولين — مقارن بالميتفورمين في الدراسات", priority: "أساسي" },
      { name: "المغنيسيوم Glycinate", dose: "400-500 مغ", timing: "مع الطعام", reason: "نقصه شائع في السكري — يحسن حساسية الأنسولين", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000 IU", timing: "مع الطعام الدهني", reason: "نقصه يزيد مقاومة الأنسولين", priority: "أساسي" },
      { name: "Alpha Lipoic Acid", dose: "600-1200 مغ", timing: "بعيداً عن الطعام", reason: "يقلل الاعتلال العصبي السكري ويحسن حساسية الأنسولين", priority: "مساعد" },
      { name: "Chromium Picolinate", dose: "400-1000 مكغ", timing: "مع الطعام", reason: "يحسن عمل الأنسولين وتنظيم السكر", priority: "مساعد" },
      { name: "أوميغا-3", dose: "2 غ", timing: "مع الطعام", reason: "يقلل الثلاثيات المرتفعة الشائعة في السكري", priority: "اختياري" },
    ],
    keyBenefits: [
      "تحسين HbA1c وسكر الصيام",
      "تقليل مقاومة الأنسولين",
      "الوقاية من مضاعفات السكري العصبية",
      "تحسين مستوى الدهون في الدم",
    ],
    importantNotes: [
      "Berberine يتفاعل مع أدوية السكري — راقب سكرك عن كثب",
      "لا تستبدل أدويتك بالمكملات دون إشراف طبي",
      "Alpha Lipoic Acid قد يخفض السكر — احذر من نقص السكر",
      "قس HbA1c كل 3 أشهر لمتابعة التحسن",
    ],
  },
  {
    id: "thyroid",
    title: "كورس صحة الغدة الدرقية",
    subtitle: "دعم وظائف الغدة الدرقية طبيعياً",
    icon: "bolt.fill",
    color: "#8B5CF6",
    targetAudience: "من يعاني من خمول أو نشاط زائد في الغدة الدرقية",
    duration: "3-6 أشهر",
    items: [
      { name: "السيلينيوم", dose: "200 مكغ", timing: "مع الطعام", reason: "ضروري لتحويل T4 إلى T3 النشط — نقصه يسبب خمول الغدة", priority: "أساسي" },
      { name: "اليود (من Kelp)", dose: "150-300 مكغ", timing: "مع الطعام", reason: "المادة الأساسية لصنع هرمونات الغدة الدرقية", priority: "أساسي" },
      { name: "الزنك", dose: "25-30 مغ", timing: "مع الطعام", reason: "يدعم تحويل T4 إلى T3 وتنظيم TSH", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000 IU", timing: "مع الطعام الدهني", reason: "نقصه مرتبط بأمراض الغدة الدرقية المناعية", priority: "مساعد" },
      { name: "Ashwagandha", dose: "600 مغ", timing: "مع الطعام", reason: "يحسن وظائف الغدة الدرقية ويقلل TSH في الخمول", priority: "مساعد" },
    ],
    keyBenefits: [
      "دعم إنتاج هرمونات الغدة الدرقية",
      "تحسين تحويل T4 إلى T3 النشط",
      "تقليل أعراض خمول الغدة (تعب، زيادة وزن، برودة)",
      "دعم المناعة ضد أمراض الغدة المناعية",
    ],
    importantNotes: [
      "لا تأخذ اليود إذا كنت مصاباً بـ Graves Disease (نشاط زائد)",
      "Ashwagandha يرفع هرمونات الغدة — احذر إذا كنت على Levothyroxine",
      "البيوتين يؤثر على نتائج تحاليل الغدة — أوقفه قبل 48 ساعة من التحليل",
      "راقب TSH وT3 وT4 كل 3 أشهر",
    ],
  },
  {
    id: "gut_health",
    title: "كورس صحة الجهاز الهضمي",
    subtitle: "ميكروبيوم صحي، هضم أفضل، مناعة أقوى",
    icon: "waveform.path",
    color: "#84CC16",
    targetAudience: "من يعاني من اضطرابات هضمية أو يريد تحسين الميكروبيوم",
    duration: "2-3 أشهر",
    items: [
      { name: "Probiotics (متعدد السلالات)", dose: "50 مليار CFU", timing: "صباحاً بعيداً عن الطعام", reason: "يعيد توازن الميكروبيوم ويقلل الالتهاب", priority: "أساسي" },
      { name: "Prebiotics (Inulin/FOS)", dose: "5-10 غ", timing: "مع الطعام", reason: "يغذي البكتيريا النافعة ويزيد تنوعها", priority: "أساسي" },
      { name: "L-Glutamine", dose: "5-10 غ", timing: "بعيداً عن الطعام", reason: "يصلح بطانة الأمعاء — يقلل Leaky Gut", priority: "مساعد" },
      { name: "Digestive Enzymes", dose: "حسب المنتج", timing: "مع الوجبات الرئيسية", reason: "يحسن هضم البروتين والدهون والكربوهيدرات", priority: "مساعد" },
      { name: "Zinc Carnosine", dose: "75 مغ", timing: "مع الطعام", reason: "يحمي بطانة المعدة ويقلل الالتهاب", priority: "مساعد" },
      { name: "Berberine", dose: "500 مغ", timing: "مع الطعام", reason: "يقلل البكتيريا الضارة ويحسن توازن الميكروبيوم", priority: "اختياري" },
    ],
    keyBenefits: [
      "تقليل الانتفاخ والغازات والإمساك",
      "تحسين تنوع الميكروبيوم",
      "تقوية جدار الأمعاء وتقليل Leaky Gut",
      "تحسين المناعة (70% منها في الأمعاء)",
    ],
    importantNotes: [
      "Berberine يقتل البكتيريا — لا تأخذه مع البروبيوتيك في نفس الوقت",
      "ابدأ بجرعة صغيرة من البروبيوتيك — قد يسبب غازات في البداية",
      "تناول الألياف بكثرة لتغذية البروبيوتيك",
      "تجنب المضادات الحيوية إلا عند الضرورة",
    ],
  },
  {
    id: "depression_anxiety",
    title: "كورس الصحة النفسية",
    subtitle: "دعم المزاج وتقليل القلق والاكتئاب طبيعياً",
    icon: "brain.head.profile",
    color: "#6366F1",
    targetAudience: "من يعاني من قلق خفيف إلى متوسط أو تقلبات مزاجية",
    duration: "2-4 أشهر",
    items: [
      { name: "أوميغا-3 (EPA عالي)", dose: "2-3 غ EPA", timing: "مع الطعام", reason: "EPA يقلل الاكتئاب — فعالية مثبتة في الدراسات", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000-10000 IU", timing: "مع الطعام الدهني", reason: "نقصه مرتبط بالاكتئاب — يؤثر على السيروتونين", priority: "أساسي" },
      { name: "المغنيسيوم Glycinate", dose: "400 مغ", timing: "قبل النوم", reason: "يقلل القلق والتوتر — يهدئ الجهاز العصبي", priority: "أساسي" },
      { name: "Ashwagandha KSM-66", dose: "600 مغ", timing: "مع الطعام", reason: "يخفض الكورتيزول 28% — مضاد للقلق مثبت علمياً", priority: "مساعد" },
      { name: "L-Theanine", dose: "200-400 مغ", timing: "عند الحاجة أو صباحاً", reason: "يقلل القلق دون نعاس — يتآزر مع الكافيين", priority: "مساعد" },
      { name: "Saffron Extract", dose: "30 مغ", timing: "مع الطعام", reason: "يحسن المزاج — فعالية مقاربة للـ SSRIs في الدراسات", priority: "مساعد" },
      { name: "5-HTP", dose: "100-200 مغ", timing: "قبل النوم", reason: "سلف السيروتونين — يحسن المزاج والنوم", priority: "اختياري" },
    ],
    keyBenefits: [
      "تحسين المزاج العام وتقليل الاكتئاب الخفيف",
      "تقليل القلق والتوتر المزمن",
      "تحسين جودة النوم",
      "رفع مستوى الطاقة الذهنية",
    ],
    importantNotes: [
      "لا تأخذ 5-HTP مع أدوية SSRI/SNRI — خطر Serotonin Syndrome",
      "هذا الكورس للحالات الخفيفة — الاكتئاب الشديد يحتاج طبيباً",
      "Saffron قد يتفاعل مع مضادات التخثر",
    ],
  },
];

export default function SpecializedCoursesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<SpecializedCourse | null>(null);
  const [activeTab, setActiveTab] = useState<"items" | "benefits" | "notes">("items");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "أساسي" | "مساعد" | "اختياري">("all");

  if (selectedCourse) {
    const filteredItems = priorityFilter === "all"
      ? selectedCourse.items
      : selectedCourse.items.filter((i) => i.priority === priorityFilter);

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.detailHeader, { paddingTop: insets.top + 12, backgroundColor: selectedCourse.color + "12", borderBottomColor: selectedCourse.color + "30" }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedCourse(null)}>
            <IconSymbol name="chevron.right" size={22} color={selectedCourse.color} />
          </Pressable>
          <View style={styles.detailHeaderContent}>
            <View style={[styles.detailIconBg, { backgroundColor: selectedCourse.color + "20" }]}>
              <IconSymbol name={selectedCourse.icon} size={28} color={selectedCourse.color} />
            </View>
            <Text style={[styles.detailTitle, { color: colors.foreground }]}>{selectedCourse.title}</Text>
            <Text style={[styles.detailSubtitle, { color: colors.muted }]}>{selectedCourse.subtitle}</Text>
            <View style={[styles.targetBadge, { backgroundColor: selectedCourse.color + "15" }]}>
              <IconSymbol name="person.2.fill" size={12} color={selectedCourse.color} />
              <Text style={[styles.targetText, { color: selectedCourse.color }]}>{selectedCourse.targetAudience}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
          {([
            { id: "items" as const, label: "المكملات" },
            { id: "benefits" as const, label: "الفوائد" },
            { id: "notes" as const, label: "تنبيهات" },
          ]).map((tab) => (
            <Pressable key={tab.id}
              style={[styles.tab, activeTab === tab.id && { borderBottomColor: selectedCourse.color, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab.id)}>
              <Text style={[styles.tabText, { color: activeTab === tab.id ? selectedCourse.color : colors.muted }]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>
          {activeTab === "items" && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                  {(["all", "أساسي", "مساعد", "اختياري"] as const).map((f) => (
                    <Pressable key={f}
                      style={[styles.filterChip, { backgroundColor: priorityFilter === f ? selectedCourse.color : colors.surface, borderColor: selectedCourse.color + "40" }]}
                      onPress={() => setPriorityFilter(f)}>
                      <Text style={[styles.filterChipText, { color: priorityFilter === f ? "#fff" : colors.muted }]}>
                        {f === "all" ? "الكل" : f}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
              {filteredItems.map((item) => {
                const priorityColor = item.priority === "أساسي" ? colors.error : item.priority === "مساعد" ? colors.warning : colors.success;
                return (
                  <View key={item.name} style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: priorityColor, borderLeftWidth: 3 }]}>
                    <View style={styles.itemHeader}>
                      <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
                      <View style={[styles.priorityBadge, { backgroundColor: priorityColor + "15" }]}>
                        <Text style={[styles.priorityBadgeText, { color: priorityColor }]}>{item.priority}</Text>
                      </View>
                    </View>
                    <View style={styles.itemMeta}>
                      <View style={[styles.metaChip, { backgroundColor: selectedCourse.color + "12" }]}>
                        <Text style={[styles.metaChipText, { color: selectedCourse.color }]}>{item.dose}</Text>
                      </View>
                      <View style={[styles.metaChip, { backgroundColor: colors.surface }]}>
                        <IconSymbol name="clock.fill" size={10} color={colors.muted} />
                        <Text style={[styles.metaChipText, { color: colors.muted }]}>{item.timing}</Text>
                      </View>
                    </View>
                    <Text style={[styles.itemReason, { color: colors.foreground }]}>{item.reason}</Text>
                  </View>
                );
              })}
            </>
          )}
          {activeTab === "benefits" && selectedCourse.keyBenefits.map((b, i) => (
            <View key={i} style={[styles.benefitCard, { backgroundColor: selectedCourse.color + "08", borderColor: selectedCourse.color + "25" }]}>
              <View style={[styles.checkCircle, { backgroundColor: selectedCourse.color }]}>
                <IconSymbol name="checkmark" size={12} color="#fff" />
              </View>
              <Text style={[styles.benefitText, { color: colors.foreground }]}>{b}</Text>
            </View>
          ))}
          {activeTab === "notes" && selectedCourse.importantNotes.map((n, i) => (
            <View key={i} style={[styles.noteCard, { backgroundColor: colors.warning + "08", borderColor: colors.warning + "30" }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
              <Text style={[styles.noteText, { color: colors.foreground }]}>{n}</Text>
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الكورسات المتخصصة</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{SPECIALIZED_COURSES.length} كورس لحالات خاصة</Text>
        </View>
      </View>
      <FlatList
        data={SPECIALIZED_COURSES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.courseCard,
              { backgroundColor: colors.card, borderColor: item.color + "30", borderLeftColor: item.color, borderLeftWidth: 4 },
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => { setSelectedCourse(item); setActiveTab("items"); setPriorityFilter("all"); }}
          >
            <View style={styles.courseCardTop}>
              <View style={[styles.courseIcon, { backgroundColor: item.color + "15" }]}>
                <IconSymbol name={item.icon} size={24} color={item.color} />
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.courseTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.courseSubtitle, { color: colors.muted }]}>{item.subtitle}</Text>
              </View>
              <IconSymbol name="chevron.left" size={18} color={colors.muted} />
            </View>
            <View style={[styles.targetRow, { backgroundColor: item.color + "10", borderColor: item.color + "25" }]}>
              <IconSymbol name="person.2.fill" size={12} color={item.color} />
              <Text style={[styles.targetRowText, { color: item.color }]}>{item.targetAudience}</Text>
            </View>
            <View style={styles.courseFooter}>
              <View style={[styles.footerBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.footerBadgeText, { color: colors.muted }]}>{item.items.length} مكمل</Text>
              </View>
              <View style={[styles.footerBadge, { backgroundColor: colors.surface }]}>
                <IconSymbol name="clock.fill" size={10} color={colors.muted} />
                <Text style={[styles.footerBadgeText, { color: colors.muted }]}>{item.duration}</Text>
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
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  courseCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  courseCardTop: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  courseIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  courseTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  courseSubtitle: { fontSize: 12, textAlign: "right", marginTop: 2 },
  targetRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6, padding: 8, borderRadius: 10, borderWidth: 1 },
  targetRowText: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  courseFooter: { flexDirection: "row-reverse", gap: 8 },
  footerBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  footerBadgeText: { fontSize: 11, fontWeight: "600" },
  detailHeader: { paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 0.5 },
  detailHeaderContent: { alignItems: "center", gap: 8, marginTop: 8 },
  detailIconBg: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  detailTitle: { fontSize: 20, fontWeight: "900" },
  detailSubtitle: { fontSize: 13, textAlign: "center" },
  targetBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  targetText: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontWeight: "700" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: 12, fontWeight: "700" },
  itemCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  itemHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  itemName: { fontSize: 14, fontWeight: "800", textAlign: "right", flex: 1 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityBadgeText: { fontSize: 11, fontWeight: "700" },
  itemMeta: { flexDirection: "row-reverse", gap: 8, flexWrap: "wrap" },
  metaChip: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  metaChipText: { fontSize: 11, fontWeight: "600" },
  itemReason: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  benefitCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  benefitText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right" },
  noteCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  noteText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right" },
});
