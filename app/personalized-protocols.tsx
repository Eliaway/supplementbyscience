/**
 * البروتوكولات الشخصية
 * Features: 135 (فصيلة الدم), 136 (النوع الأيضي), 137 (الكرونوتايب), 138 (مستوى النشاط)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type MetabolicType = "fast" | "slow" | "mixed";
type Chronotype = "morning" | "evening" | "intermediate";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "athlete";

interface PersonalizedRecommendation {
  supplement: string;
  dose: string;
  reason: string;
  priority: "أساسي" | "مهم" | "اختياري";
}

const BLOOD_TYPE_PROTOCOLS: Record<BloodType, { description: string; avoid: string[]; recommend: PersonalizedRecommendation[] }> = {
  "O+": {
    description: "فصيلة O — أقدم فصيلة دم. الجهاز الهضمي قوي لكن الجهاز المناعي مفرط النشاط. يستجيب جيداً للبروتين الحيواني والتمرين المكثف.",
    avoid: ["الجلوتين", "منتجات الألبان بكميات كبيرة", "القمح"],
    recommend: [
      { supplement: "Betaine HCl", dose: "500 مغ مع الوجبات", reason: "يدعم حموضة المعدة العالية الطبيعية لفصيلة O", priority: "أساسي" },
      { supplement: "Vitamin B12", dose: "1000 مكغ", reason: "فصيلة O تحتاج كميات أعلى من B12", priority: "أساسي" },
      { supplement: "Iodine", dose: "150-300 مكغ", reason: "يدعم الغدة الدرقية التي تتأثر بفصيلة O", priority: "مهم" },
      { supplement: "Licorice Root", dose: "500 مغ", reason: "يدعم الغدة الكظرية الأكثر نشاطاً في فصيلة O", priority: "اختياري" },
    ],
  },
  "O-": {
    description: "فصيلة O سالبة — نفس خصائص O+ مع حساسية أعلى للبيئة والإجهاد.",
    avoid: ["الجلوتين", "منتجات الألبان بكميات كبيرة"],
    recommend: [
      { supplement: "Betaine HCl", dose: "500 مغ مع الوجبات", reason: "يدعم الهضم القوي لفصيلة O", priority: "أساسي" },
      { supplement: "Vitamin B12", dose: "1000 مكغ", reason: "ضروري لفصيلة O", priority: "أساسي" },
      { supplement: "Magnesium", dose: "400 مغ", reason: "يقلل الحساسية للإجهاد", priority: "مهم" },
      { supplement: "Adaptogens (Ashwagandha)", dose: "600 مغ", reason: "يوازن الاستجابة للإجهاد", priority: "مهم" },
    ],
  },
  "A+": {
    description: "فصيلة A — جهاز هضمي أضعف وحموضة معدة أقل. يستجيب جيداً للنظام النباتي والتمرين الهادئ.",
    avoid: ["اللحوم الحمراء بكميات كبيرة", "منتجات الألبان الدهنية", "الكحول"],
    recommend: [
      { supplement: "Digestive Enzymes", dose: "مع كل وجبة", reason: "يعوض ضعف الهضم الطبيعي لفصيلة A", priority: "أساسي" },
      { supplement: "Vitamin B12", dose: "1000 مكغ", reason: "فصيلة A أقل كفاءة في امتصاص B12 من اللحوم", priority: "أساسي" },
      { supplement: "Hawthorn Berry", dose: "500 مغ", reason: "يدعم صحة القلب — فصيلة A أكثر عرضة لأمراض القلب", priority: "مهم" },
      { supplement: "Probiotics", dose: "20 مليار CFU", reason: "يدعم الميكروبيوم الضعيف نسبياً في فصيلة A", priority: "أساسي" },
    ],
  },
  "A-": {
    description: "فصيلة A سالبة — نفس خصائص A+ مع حاجة أعلى للمضادات الأكسدة.",
    avoid: ["اللحوم الحمراء بكميات كبيرة", "الأطعمة المعالجة"],
    recommend: [
      { supplement: "Digestive Enzymes", dose: "مع كل وجبة", reason: "يعوض ضعف الهضم لفصيلة A", priority: "أساسي" },
      { supplement: "Vitamin C", dose: "1-2 غ", reason: "يدعم المناعة ومضاد أكسدة قوي", priority: "أساسي" },
      { supplement: "Green Tea Extract", dose: "400 مغ", reason: "مضاد أكسدة قوي مناسب لفصيلة A", priority: "مهم" },
      { supplement: "Probiotics", dose: "20 مليار CFU", reason: "يدعم الميكروبيوم", priority: "أساسي" },
    ],
  },
  "B+": {
    description: "فصيلة B — الأكثر مرونة. يتكيف جيداً مع أنواع مختلفة من الطعام. يستجيب جيداً لمنتجات الألبان.",
    avoid: ["الدجاج (يحتوي على Lectin ضار لفصيلة B)", "الذرة", "الفول السوداني"],
    recommend: [
      { supplement: "Magnesium", dose: "400 مغ", reason: "يدعم التوازن الهرموني لفصيلة B", priority: "أساسي" },
      { supplement: "Licorice Root", dose: "500 مغ", reason: "يدعم الغدة الكظرية", priority: "مهم" },
      { supplement: "Ginkgo Biloba", dose: "120 مغ", reason: "يدعم صحة الدماغ — فصيلة B أكثر عرضة لمشاكل الذاكرة", priority: "مهم" },
      { supplement: "Vitamin B12", dose: "500 مكغ", reason: "يدعم الجهاز العصبي", priority: "أساسي" },
    ],
  },
  "B-": {
    description: "فصيلة B سالبة — نفس خصائص B+ مع حساسية أعلى للبيئة.",
    avoid: ["الدجاج", "الذرة"],
    recommend: [
      { supplement: "Magnesium Glycinate", dose: "400 مغ", reason: "يدعم الجهاز العصبي", priority: "أساسي" },
      { supplement: "Vitamin D3", dose: "4000 IU", reason: "يدعم المناعة", priority: "أساسي" },
      { supplement: "Omega-3", dose: "2 غ", reason: "يقلل الالتهاب", priority: "مهم" },
      { supplement: "Probiotics", dose: "20 مليار CFU", reason: "يدعم الميكروبيوم", priority: "مهم" },
    ],
  },
  "AB+": {
    description: "فصيلة AB — أحدث فصيلة دم. يجمع خصائص A و B. جهاز مناعي أضعف لكن أكثر تكيفاً.",
    avoid: ["اللحوم الحمراء بكميات كبيرة", "الذرة", "الفلفل الأسود"],
    recommend: [
      { supplement: "Digestive Enzymes", dose: "مع كل وجبة", reason: "يعوض ضعف الهضم المشترك من A و B", priority: "أساسي" },
      { supplement: "Vitamin C", dose: "1 غ", reason: "يدعم المناعة الأضعف نسبياً", priority: "أساسي" },
      { supplement: "Hawthorn + CoQ10", dose: "500 مغ + 200 مغ", reason: "يدعم صحة القلب — فصيلة AB أكثر عرضة", priority: "مهم" },
      { supplement: "Probiotics", dose: "30 مليار CFU", reason: "يدعم الميكروبيوم المعقد", priority: "أساسي" },
    ],
  },
  "AB-": {
    description: "فصيلة AB سالبة — أنادر فصيلة دم (1% من السكان). نفس خصائص AB+ مع حاجة أعلى للمضادات الأكسدة.",
    avoid: ["اللحوم الحمراء بكميات كبيرة", "الذرة"],
    recommend: [
      { supplement: "Digestive Enzymes", dose: "مع كل وجبة", reason: "ضروري لفصيلة AB", priority: "أساسي" },
      { supplement: "Antioxidant Complex", dose: "حسب المنتج", reason: "حاجة أعلى للمضادات الأكسدة", priority: "أساسي" },
      { supplement: "Vitamin D3 + K2", dose: "4000 IU + 180 مكغ", reason: "يدعم المناعة والعظام", priority: "مهم" },
      { supplement: "Probiotics", dose: "30 مليار CFU", reason: "يدعم الميكروبيوم", priority: "أساسي" },
    ],
  },
};

const METABOLIC_PROTOCOLS: Record<MetabolicType, { title: string; description: string; recommend: PersonalizedRecommendation[] }> = {
  fast: {
    title: "الأيض السريع",
    description: "تحرق السعرات بسرعة، تشعر بالجوع كثيراً، قد تعاني من نقص في المغذيات رغم الأكل الجيد",
    recommend: [
      { supplement: "B-Complex (High Dose)", dose: "B-100 Complex", reason: "الأيض السريع يستنزف فيتامينات B بسرعة", priority: "أساسي" },
      { supplement: "Magnesium Glycinate", dose: "400-500 مغ", reason: "يُستهلك بسرعة في الأيض السريع", priority: "أساسي" },
      { supplement: "Zinc", dose: "25-30 مغ", reason: "يُستهلك بسرعة في التمثيل الغذائي السريع", priority: "مهم" },
      { supplement: "CoQ10", dose: "200 مغ", reason: "يدعم إنتاج الطاقة الكثيف", priority: "مهم" },
    ],
  },
  slow: {
    title: "الأيض البطيء",
    description: "تكتسب الوزن بسهولة، تشعر بالخمول، الجهاز الهضمي بطيء، تحتاج لدعم إضافي",
    recommend: [
      { supplement: "Berberine", dose: "500 مغ × 2", reason: "يحسن حساسية الأنسولين ويرفع معدل الأيض", priority: "أساسي" },
      { supplement: "Green Tea Extract (EGCG)", dose: "400 مغ", reason: "يرفع معدل الأيض بشكل طبيعي", priority: "أساسي" },
      { supplement: "Iodine + Selenium", dose: "200 مكغ + 200 مكغ", reason: "يدعم الغدة الدرقية المسؤولة عن الأيض", priority: "مهم" },
      { supplement: "Digestive Enzymes", dose: "مع كل وجبة", reason: "يعوض بطء الهضم", priority: "أساسي" },
    ],
  },
  mixed: {
    title: "الأيض المتوازن",
    description: "أيضك متوازن نسبياً — تستجيب جيداً للتغذية المتنوعة",
    recommend: [
      { supplement: "Multivitamin (High Quality)", dose: "حسب المنتج", reason: "يضمن تغطية شاملة للمغذيات", priority: "أساسي" },
      { supplement: "Omega-3", dose: "2 غ", reason: "يدعم التوازن الهرموني والأيضي", priority: "أساسي" },
      { supplement: "Vitamin D3", dose: "4000 IU", reason: "يدعم الأيض العام", priority: "مهم" },
      { supplement: "Probiotics", dose: "20 مليار CFU", reason: "يحافظ على توازن الميكروبيوم", priority: "مهم" },
    ],
  },
};

const CHRONOTYPE_PROTOCOLS: Record<Chronotype, { title: string; emoji: string; description: string; recommend: PersonalizedRecommendation[] }> = {
  morning: {
    title: "النوع الصباحي (الحمامة)",
    emoji: "🌅",
    description: "تستيقظ بنشاط، ذروة طاقتك في الصباح، تنام مبكراً",
    recommend: [
      { supplement: "Vitamin D3", dose: "4000 IU — صباحاً", reason: "يعزز اليقظة الصباحية ويدعم الساعة البيولوجية", priority: "أساسي" },
      { supplement: "B-Complex", dose: "صباحاً مع الطعام", reason: "يدعم إنتاج الطاقة في ذروة النشاط الصباحي", priority: "أساسي" },
      { supplement: "Magnesium Glycinate", dose: "400 مغ — مساءً مبكراً", reason: "يدعم النوم المبكر الطبيعي", priority: "مهم" },
      { supplement: "L-Theanine", dose: "200 مغ — بعد الظهر", reason: "يقلل التعب بعد الظهر عند النوع الصباحي", priority: "اختياري" },
    ],
  },
  evening: {
    title: "النوع الليلي (البومة)",
    emoji: "🦉",
    description: "ذروة طاقتك في المساء والليل، صعوبة في الاستيقاظ مبكراً",
    recommend: [
      { supplement: "Melatonin (Low Dose)", dose: "0.5-1 مغ — قبل النوم بساعتين", reason: "يساعد على تقديم وقت النوم تدريجياً", priority: "أساسي" },
      { supplement: "Vitamin D3", dose: "4000 IU — ظهراً", reason: "يساعد على ضبط الساعة البيولوجية", priority: "أساسي" },
      { supplement: "Magnesium L-Threonate", dose: "2 غ — مساءً", reason: "يحسن جودة النوم ويدعم الدماغ الليلي", priority: "مهم" },
      { supplement: "Ashwagandha", dose: "600 مغ — مساءً", reason: "يخفض الكورتيزول المرتفع ليلاً", priority: "مهم" },
    ],
  },
  intermediate: {
    title: "النوع المتوسط",
    emoji: "🌤️",
    description: "توازن بين الصباح والمساء — أكثر الأنواع شيوعاً",
    recommend: [
      { supplement: "Vitamin D3", dose: "4000 IU — صباحاً", reason: "يدعم الساعة البيولوجية المتوازنة", priority: "أساسي" },
      { supplement: "Magnesium Glycinate", dose: "400 مغ — قبل النوم", reason: "يحسن جودة النوم", priority: "أساسي" },
      { supplement: "B-Complex", dose: "صباحاً", reason: "يدعم الطاقة طوال اليوم", priority: "مهم" },
      { supplement: "L-Theanine + Caffeine", dose: "200 مغ + 100 مغ", reason: "يحسن التركيز عند الحاجة", priority: "اختياري" },
    ],
  },
};

const ACTIVITY_PROTOCOLS: Record<ActivityLevel, { title: string; description: string; recommend: PersonalizedRecommendation[] }> = {
  sedentary: {
    title: "خامل (أقل من 30 دقيقة يومياً)",
    description: "جلوس طويل، قلة حركة — تحتاج لمكملات تعوض نقص النشاط",
    recommend: [
      { supplement: "Vitamin D3", dose: "5000 IU", reason: "نقصه شائع جداً عند قليلي الحركة", priority: "أساسي" },
      { supplement: "Nattokinase", dose: "2000 FU", reason: "يحسن سيولة الدم ويقلل خطر الجلطات", priority: "أساسي" },
      { supplement: "Omega-3", dose: "3 غ", reason: "يقلل الالتهاب المزمن من قلة الحركة", priority: "أساسي" },
      { supplement: "Berberine", dose: "500 مغ × 2", reason: "يحسن حساسية الأنسولين المنخفضة", priority: "مهم" },
    ],
  },
  light: {
    title: "خفيف (30-60 دقيقة يومياً)",
    description: "نشاط خفيف منتظم — مشي، يوغا، تمارين خفيفة",
    recommend: [
      { supplement: "Vitamin D3", dose: "4000 IU", reason: "يدعم صحة العظام والعضلات", priority: "أساسي" },
      { supplement: "Magnesium Glycinate", dose: "400 مغ", reason: "يدعم وظيفة العضلات", priority: "أساسي" },
      { supplement: "Omega-3", dose: "2 غ", reason: "يقلل الالتهاب الخفيف من التمرين", priority: "مهم" },
      { supplement: "Vitamin C", dose: "1 غ", reason: "يدعم المناعة والتعافي", priority: "مهم" },
    ],
  },
  moderate: {
    title: "معتدل (60-90 دقيقة يومياً)",
    description: "نشاط منتظم — جيم، سباحة، ركض خفيف",
    recommend: [
      { supplement: "Creatine Monohydrate", dose: "5 غ", reason: "يحسن الأداء والقوة في التمارين المعتدلة", priority: "أساسي" },
      { supplement: "Magnesium Malate", dose: "400 مغ", reason: "يقلل تعب العضلات بعد التمرين", priority: "أساسي" },
      { supplement: "Vitamin D3 + K2", dose: "4000 IU + 180 مكغ", reason: "يدعم صحة العظام مع التمرين المنتظم", priority: "مهم" },
      { supplement: "Protein (Whey/Plant)", dose: "25-30 غ بروتين", reason: "يدعم بناء العضلات والتعافي", priority: "مهم" },
    ],
  },
  active: {
    title: "نشيط (90-120 دقيقة يومياً)",
    description: "نشاط عالٍ منتظم — تمارين شديدة، رياضة تنافسية",
    recommend: [
      { supplement: "Creatine Monohydrate", dose: "5 غ", reason: "يحسن القوة والتحمل بشكل ملحوظ", priority: "أساسي" },
      { supplement: "Beta-Alanine", dose: "3.2 غ", reason: "يقلل حمض اللاكتيك ويزيد التحمل", priority: "أساسي" },
      { supplement: "Electrolytes (Na+K+Mg)", dose: "أثناء التمرين", reason: "يعوض الأملاح المفقودة مع العرق", priority: "أساسي" },
      { supplement: "CoQ10", dose: "300 مغ", reason: "يحسن كفاءة إنتاج الطاقة", priority: "مهم" },
    ],
  },
  athlete: {
    title: "رياضي محترف (+120 دقيقة يومياً)",
    description: "تدريب مكثف يومي — رياضيون محترفون أو هواة متقدمون",
    recommend: [
      { supplement: "Creatine Monohydrate", dose: "5 غ", reason: "أكثر مكمل مدعوم علمياً للأداء الرياضي", priority: "أساسي" },
      { supplement: "Beta-Alanine", dose: "3.2-6.4 غ", reason: "يزيد التحمل بشكل ملحوظ", priority: "أساسي" },
      { supplement: "Protein (Whey Isolate)", dose: "30-40 غ بروتين", reason: "يدعم بناء العضلات والتعافي السريع", priority: "أساسي" },
      { supplement: "Omega-3 (High EPA)", dose: "4 غ", reason: "يقلل الالتهاب المزمن من التدريب المكثف", priority: "أساسي" },
    ],
  },
};

const PRIORITY_COLORS: Record<string, string> = {
  "أساسي": "#22C55E",
  "مهم": "#F59E0B",
  "اختياري": "#94A3B8",
};

export default function PersonalizedProtocolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [bloodType, setBloodType] = useState<BloodType | null>(null);
  const [metabolicType, setMetabolicType] = useState<MetabolicType | null>(null);
  const [chronotype, setChronotype] = useState<Chronotype | null>(null);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(null);
  const [showResults, setShowResults] = useState(false);

  const allSelected = bloodType && metabolicType && chronotype && activityLevel;

  const allRecommendations: PersonalizedRecommendation[] = [
    ...(bloodType ? BLOOD_TYPE_PROTOCOLS[bloodType].recommend : []),
    ...(metabolicType ? METABOLIC_PROTOCOLS[metabolicType].recommend : []),
    ...(chronotype ? CHRONOTYPE_PROTOCOLS[chronotype].recommend : []),
    ...(activityLevel ? ACTIVITY_PROTOCOLS[activityLevel].recommend : []),
  ];

  const essentialRecs = allRecommendations.filter((r) => r.priority === "أساسي");
  const importantRecs = allRecommendations.filter((r) => r.priority === "مهم");

  if (showResults && allSelected) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setShowResults(false)}>
            <IconSymbol name="chevron.right" size={20} color={colors.primary} />
            <Text style={[styles.backText, { color: colors.primary }]}>تعديل</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>توصياتك الشخصية</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>بناءً على ملفك الشخصي الكامل</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          {/* Profile Summary */}
          <View style={[styles.profileCard, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
            <Text style={[styles.profileTitle, { color: colors.primary }]}>ملفك الشخصي</Text>
            <View style={styles.profileGrid}>
              <View style={styles.profileItem}>
                <Text style={[styles.profileLabel, { color: colors.muted }]}>فصيلة الدم</Text>
                <Text style={[styles.profileValue, { color: colors.foreground }]}>{bloodType}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={[styles.profileLabel, { color: colors.muted }]}>نوع الأيض</Text>
                <Text style={[styles.profileValue, { color: colors.foreground }]}>{METABOLIC_PROTOCOLS[metabolicType!].title.split(" ")[0]}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={[styles.profileLabel, { color: colors.muted }]}>الكرونوتايب</Text>
                <Text style={[styles.profileValue, { color: colors.foreground }]}>{CHRONOTYPE_PROTOCOLS[chronotype!].emoji}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={[styles.profileLabel, { color: colors.muted }]}>مستوى النشاط</Text>
                <Text style={[styles.profileValue, { color: colors.foreground }]}>{ACTIVITY_PROTOCOLS[activityLevel!].title.split(" ")[0]}</Text>
              </View>
            </View>
          </View>

          {/* Essential */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكملات الأساسية ({essentialRecs.length})</Text>
          {essentialRecs.map((rec, i) => (
            <View key={i} style={[styles.recCard, { backgroundColor: colors.card, borderColor: PRIORITY_COLORS[rec.priority] + "40" }]}>
              <View style={styles.recHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[rec.priority] + "20" }]}>
                  <Text style={[styles.priorityText, { color: PRIORITY_COLORS[rec.priority] }]}>{rec.priority}</Text>
                </View>
                <Text style={[styles.recName, { color: colors.foreground }]}>{rec.supplement}</Text>
              </View>
              <Text style={[styles.recDose, { color: colors.primary }]}>{rec.dose}</Text>
              <Text style={[styles.recReason, { color: colors.muted }]}>{rec.reason}</Text>
            </View>
          ))}

          {/* Important */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>مكملات مهمة ({importantRecs.length})</Text>
          {importantRecs.map((rec, i) => (
            <View key={i} style={[styles.recCard, { backgroundColor: colors.card, borderColor: PRIORITY_COLORS[rec.priority] + "40" }]}>
              <View style={styles.recHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[rec.priority] + "20" }]}>
                  <Text style={[styles.priorityText, { color: PRIORITY_COLORS[rec.priority] }]}>{rec.priority}</Text>
                </View>
                <Text style={[styles.recName, { color: colors.foreground }]}>{rec.supplement}</Text>
              </View>
              <Text style={[styles.recDose, { color: colors.primary }]}>{rec.dose}</Text>
              <Text style={[styles.recReason, { color: colors.muted }]}>{rec.reason}</Text>
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
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>البروتوكول الشخصي</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>توصيات مخصصة بناءً على ملفك الفريد</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }}>

        {/* Blood Type */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>1. فصيلة الدم</Text>
          <View style={styles.optionsGrid}>
            {(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as BloodType[]).map((bt) => (
              <Pressable
                key={bt}
                style={[styles.optionChip, { backgroundColor: bloodType === bt ? colors.primary : colors.surface, borderColor: bloodType === bt ? colors.primary : colors.border }]}
                onPress={() => setBloodType(bt)}
              >
                <Text style={[styles.optionChipText, { color: bloodType === bt ? "#fff" : colors.foreground }]}>{bt}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Metabolic Type */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>2. نوع الأيض</Text>
          {(["fast", "slow", "mixed"] as MetabolicType[]).map((mt) => (
            <Pressable
              key={mt}
              style={[styles.optionCard, { backgroundColor: metabolicType === mt ? colors.primary + "12" : colors.surface, borderColor: metabolicType === mt ? colors.primary : colors.border }]}
              onPress={() => setMetabolicType(mt)}
            >
              <Text style={[styles.optionCardTitle, { color: metabolicType === mt ? colors.primary : colors.foreground }]}>{METABOLIC_PROTOCOLS[mt].title}</Text>
              <Text style={[styles.optionCardDesc, { color: colors.muted }]}>{METABOLIC_PROTOCOLS[mt].description}</Text>
            </Pressable>
          ))}
        </View>

        {/* Chronotype */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>3. الكرونوتايب (نوع نومك)</Text>
          {(["morning", "intermediate", "evening"] as Chronotype[]).map((ct) => (
            <Pressable
              key={ct}
              style={[styles.optionCard, { backgroundColor: chronotype === ct ? colors.primary + "12" : colors.surface, borderColor: chronotype === ct ? colors.primary : colors.border }]}
              onPress={() => setChronotype(ct)}
            >
              <Text style={[styles.optionCardTitle, { color: chronotype === ct ? colors.primary : colors.foreground }]}>{CHRONOTYPE_PROTOCOLS[ct].emoji} {CHRONOTYPE_PROTOCOLS[ct].title}</Text>
              <Text style={[styles.optionCardDesc, { color: colors.muted }]}>{CHRONOTYPE_PROTOCOLS[ct].description}</Text>
            </Pressable>
          ))}
        </View>

        {/* Activity Level */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>4. مستوى النشاط البدني</Text>
          {(["sedentary", "light", "moderate", "active", "athlete"] as ActivityLevel[]).map((al) => (
            <Pressable
              key={al}
              style={[styles.optionCard, { backgroundColor: activityLevel === al ? colors.primary + "12" : colors.surface, borderColor: activityLevel === al ? colors.primary : colors.border }]}
              onPress={() => setActivityLevel(al)}
            >
              <Text style={[styles.optionCardTitle, { color: activityLevel === al ? colors.primary : colors.foreground }]}>{ACTIVITY_PROTOCOLS[al].title}</Text>
              <Text style={[styles.optionCardDesc, { color: colors.muted }]}>{ACTIVITY_PROTOCOLS[al].description}</Text>
            </Pressable>
          ))}
        </View>

        {allSelected && (
          <Pressable
            style={({ pressed }) => [styles.resultBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
            onPress={() => setShowResults(true)}
          >
            <IconSymbol name="sparkles" size={20} color="#fff" />
            <Text style={styles.resultBtnText}>احصل على توصياتك الشخصية</Text>
          </Pressable>
        )}
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", marginBottom: 10, fontFamily: "Cairo-Black" },
  optionsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  optionChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, minWidth: 60, alignItems: "center" },
  optionChipText: { fontSize: 14, fontWeight: "700", fontFamily: "Cairo-Bold" },
  optionCard: { borderRadius: 14, padding: 14, borderWidth: 1.5, marginBottom: 8 },
  optionCardTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  optionCardDesc: { fontSize: 12, lineHeight: 18, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  resultBtn: { borderRadius: 16, padding: 16, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10 },
  resultBtnText: { color: "#fff", fontSize: 16, fontWeight: "800", fontFamily: "Cairo-Black" },
  profileCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  profileTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 12, fontFamily: "Cairo-Black" },
  profileGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 12 },
  profileItem: { alignItems: "center", minWidth: 70 },
  profileLabel: { fontSize: 11, marginBottom: 4, fontFamily: "Cairo" },
  profileValue: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  recCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 6 },
  recHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  recName: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  recDose: { fontSize: 13, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  recReason: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
