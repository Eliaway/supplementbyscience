/**
 * الشاشة الرئيسية — مُعاد تصميمها بالكامل
 * - RTL صحيح على جميع العناصر
 * - تجميع 113 شاشة تحت 10 فئات واضحة
 * - تصميم بطاقات بدلاً من قائمة مسطّحة
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { CATEGORY_COLORS, CATEGORY_ICONS, useSupplements } from "@/hooks/use-supplements";

I18nManager.forceRTL(true);

// ─── تعريف الفئات الرئيسية ───────────────────────────────────────────────────
type ScreenItem = {
  title: string;
  route: string;
  icon: string;
  desc?: string;
};

type Category = {
  id: string;
  title: string;
  icon: string;
  color: string;
  emoji: string;
  screens: ScreenItem[];
};

const MAIN_CATEGORIES: Category[] = [
  {
    id: "ai",
    title: "الذكاء الاصطناعي والتشخيص",
    icon: "sparkles",
    color: "#0EA5E9",
    emoji: "🤖",
    screens: [
      { title: "المساعد الذكي المتخصص", route: "/(tabs)/tools", icon: "sparkles", desc: "4 خبراء متخصصون" },
      { title: "تحليل التحاليل المخبرية", route: "/lab-analysis", icon: "cross.case.fill", desc: "قراءة نتائجك بالذكاء الاصطناعي" },
      { title: "خبير الهرمونات والببتيدات", route: "/hormone-expert", icon: "waveform.path.ecg", desc: "تحليل متخصص للهرمونات" },
      { title: "المساعد الصوتي", route: "/voice-assistant", icon: "waveform", desc: "اسأل بصوتك" },
      { title: "التوصيات اليومية الذكية", route: "/daily-tips", icon: "sun.max.fill", desc: "نصيحة مخصصة كل صباح" },
      { title: "نظام التوصيات التكيّفي", route: "/adaptive-protocols", icon: "arrow.triangle.2.circlepath", desc: "يتعلم من بياناتك" },
      { title: "الإنذار المبكر الصحي", route: "/health-alerts", icon: "exclamationmark.triangle.fill", desc: "تنبيهات صحية مبكرة" },
      { title: "التنبؤ بالاستجابة الجينية", route: "/genetics-guide", icon: "dna", desc: "تحليل جيني للمكملات" },
    ],
  },
  {
    id: "profile",
    title: "ملفي الصحي وجدول الجرعات",
    icon: "person.crop.circle.fill",
    color: "#A855F7",
    emoji: "👤",
    screens: [
      { title: "الملف الصحي الشامل", route: "/(tabs)/profile", icon: "person.crop.circle.fill", desc: "بياناتك الصحية الكاملة" },
      { title: "مكملاتي الحالية", route: "/(tabs)/profile", icon: "pills.fill", desc: "إدارة مكملاتك" },
      { title: "جدول الجرعات والإشعارات", route: "/(tabs)/profile", icon: "clock.fill", desc: "مواعيد جرعاتك اليومية" },
      { title: "تتبع المزاج والطاقة", route: "/mood-tracker", icon: "heart.fill", desc: "سجّل حالتك يومياً" },
      { title: "متابعة التقدم الصحي", route: "/progress", icon: "chart.bar.fill", desc: "رسوم بيانية لتقدمك" },
      { title: "تقرير التكلفة الشهرية", route: "/cost-report", icon: "chart.bar.fill", desc: "احسب تكلفة مكملاتك" },
      { title: "تصدير الملف الصحي PDF", route: "/export-pdf", icon: "doc.fill", desc: "شارك ملفك مع طبيبك" },
      { title: "النسخ الاحتياطي المشفّر", route: "/backup", icon: "externaldrive.fill", desc: "احفظ بياناتك بأمان" },
    ],
  },
  {
    id: "protocols",
    title: "البروتوكولات الصحية المتخصصة",
    icon: "list.bullet.clipboard.fill",
    color: "#22C55E",
    emoji: "📋",
    screens: [
      { title: "بروتوكولات الأعضاء الرئيسية", route: "/protocols", icon: "heart.circle.fill", desc: "كبد • قلب • كلى • دماغ" },
      { title: "بروتوكولات متقدمة", route: "/protocols-advanced", icon: "list.bullet.clipboard.fill", desc: "خصوبة • زهايمر • عظام" },
      { title: "بروتوكولات إضافية", route: "/protocols-extra", icon: "plus.square.fill", desc: "تدوير • صيام • مناعة" },
      { title: "البروتوكول الشخصي المخصص", route: "/personalized-protocols", icon: "person.text.rectangle.fill", desc: "خطة بناءً على ملفك" },
      { title: "بروتوكول الميتوكوندريا", route: "/protocols-extra", icon: "bolt.fill", desc: "تحسين إنتاج الطاقة" },
      { title: "بروتوكول إزالة السموم", route: "/detox-protocol", icon: "leaf.fill", desc: "تنظيف الجسم طبيعياً" },
      { title: "بروتوكول صحة الأمعاء", route: "/protocols-advanced", icon: "waveform.path.ecg", desc: "إصلاح الأمعاء المتسربة" },
      { title: "بروتوكول الصيام المتقطع", route: "/fasting-supplements", icon: "clock.fill", desc: "مكملات الصيام" },
    ],
  },
  {
    id: "health",
    title: "الصحة العامة والأمراض المزمنة",
    icon: "heart.circle.fill",
    color: "#EF4444",
    emoji: "❤️",
    screens: [
      { title: "صحة القلب والأوعية", route: "/protocols-advanced", icon: "heart.fill", desc: "ضغط • كوليستيرول • دورة دموية" },
      { title: "صحة الكبد والجهاز الهضمي", route: "/protocols", icon: "waveform.path.ecg", desc: "كبد • أمعاء • إنزيمات هضم" },
      { title: "صحة الكلى والمسالك البولية", route: "/kidney-health", icon: "drop.fill", desc: "دعم وظائف الكلى" },
      { title: "صحة الجهاز التنفسي", route: "/respiratory-health", icon: "wind", desc: "رئة • مناعة • تنفس" },
      { title: "الصحة النفسية والتوتر", route: "/mental-health", icon: "brain.head.profile", desc: "قلق • اكتئاب • إجهاد" },
      { title: "التعب المزمن وما بعد كوفيد", route: "/chronic-fatigue", icon: "bolt.slash.fill", desc: "استعادة الطاقة" },
      { title: "التفاعلات الدوائية", route: "/drug-interactions", icon: "exclamationmark.triangle.fill", desc: "تحذيرات التفاعلات" },
      { title: "إدارة الألم المزمن", route: "/protocols-advanced", icon: "cross.case.fill", desc: "مكملات تخفيف الألم" },
    ],
  },
  {
    id: "sports",
    title: "الرياضة والأداء البدني",
    icon: "figure.walk",
    color: "#F97316",
    emoji: "💪",
    screens: [
      { title: "الأداء الرياضي والتعافي", route: "/sports-performance", icon: "figure.walk", desc: "قبل وبعد التمرين" },
      { title: "بروتوكول الرياضيين المحترفين", route: "/athlete-advanced", icon: "trophy.fill", desc: "خطة احترافية متكاملة" },
      { title: "قائمة المحظورات الرياضية", route: "/(tabs)/library", icon: "nosign", desc: "قائمة WADA المحدّثة" },
      { title: "حاسبة الجرعة حسب الوزن", route: "/dose-calculator", icon: "scalemass.fill", desc: "جرعة دقيقة لوزنك" },
      { title: "مكملات ما قبل التمرين", route: "/sports-performance", icon: "bolt.fill", desc: "طاقة وتركيز" },
      { title: "مكملات التعافي", route: "/sports-performance", icon: "arrow.clockwise.heart.fill", desc: "تعافٍ أسرع" },
      { title: "تحدي 30 يوم", route: "/challenge-30", icon: "trophy.fill", desc: "برنامج شهري منظّم" },
      { title: "العمال البدنيون", route: "/protocols-extra", icon: "hammer.fill", desc: "مكملات العمل الشاق" },
    ],
  },
  {
    id: "brain",
    title: "الدماغ والأداء الذهني",
    icon: "brain.head.profile",
    color: "#8B5CF6",
    emoji: "🧠",
    screens: [
      { title: "الأداء الذهني والنوتروبيكس", route: "/nootropics", icon: "brain.head.profile", desc: "تحسين التركيز والذاكرة" },
      { title: "بروتوكول الوقاية من الزهايمر", route: "/protocols-advanced", icon: "brain.head.profile", desc: "حماية الدماغ طويلة المدى" },
      { title: "اضطراب التركيز والانتباه", route: "/adhd-neuro", icon: "scope", desc: "دعم التركيز طبيعياً" },
      { title: "صحة الأعصاب والميلين", route: "/protocols-advanced", icon: "waveform", desc: "دعم الجهاز العصبي" },
      { title: "محور الأمعاء والدماغ", route: "/gut-brain", icon: "arrow.left.arrow.right", desc: "الميكروبيوم الدماغي" },
      { title: "بروتوكول النوم العميق", route: "/sleep-protocol", icon: "moon.fill", desc: "جودة النوم ومكملاتها" },
      { title: "مؤشر جودة النوم", route: "/sleep-protocol", icon: "chart.bar.fill", desc: "تقييم نومك" },
      { title: "مكملات الطلاب والمعلمين", route: "/protocols-extra", icon: "graduationcap.fill", desc: "دعم الدراسة والتركيز" },
    ],
  },
  {
    id: "hormones",
    title: "الهرمونات والخصوبة والجنسية",
    icon: "waveform.path.ecg",
    color: "#EC4899",
    emoji: "⚗️",
    screens: [
      { title: "توازن الهرمونات للمرأة", route: "/hormone-balance", icon: "waveform.path.ecg", desc: "إستروجين • بروجستيرون" },
      { title: "مكملات دعم التستوستيرون", route: "/protocols-advanced", icon: "bolt.fill", desc: "للرجال" },
      { title: "الصحة الجنسية والخصوبة", route: "/sexual-health", icon: "heart.fill", desc: "خصوبة ذكورية وأنثوية" },
      { title: "صحة المرأة الشاملة", route: "/protocols", icon: "person.fill", desc: "دورة شهرية • حمل • رضاعة" },
      { title: "مكملات الحمل والرضاعة", route: "/pregnancy-supplements", icon: "heart.fill", desc: "أمان الأم والجنين" },
      { title: "الغدة الدرقية", route: "/protocols-advanced", icon: "waveform.path.ecg", desc: "دعم وظائف الغدة" },
      { title: "مكملات رمضان", route: "/ramadan-supplements", icon: "moon.stars.fill", desc: "خطة خاصة لرمضان" },
      { title: "الدورة الشهرية والمكملات", route: "/hormone-balance", icon: "calendar", desc: "جدول حسب مراحل الدورة" },
    ],
  },
  {
    id: "beauty",
    title: "الجمال والجلد والشيخوخة",
    icon: "sparkles",
    color: "#F59E0B",
    emoji: "✨",
    screens: [
      { title: "الجلد والشعر والجمال", route: "/skin-beauty", icon: "sparkles", desc: "بشرة • شعر • أظافر" },
      { title: "مكافحة الشيخوخة", route: "/longevity", icon: "clock.arrow.circlepath", desc: "إطالة العمر الصحي" },
      { title: "بروتوكول الطول العمر", route: "/longevity", icon: "infinity", desc: "Senolytic • NAD+ • Autophagy" },
      { title: "مكملات الجلد في المناخ الجاف", route: "/climate-supplements", icon: "sun.max.fill", desc: "ترطيب وحماية" },
      { title: "حماية العيون من الشاشات", route: "/protocols-extra", icon: "eye.fill", desc: "لوتين وزياكسانثين" },
      { title: "مكملات الوقاية من السرطان", route: "/cancer-prevention", icon: "shield.fill", desc: "مضادات الأكسدة" },
      { title: "مؤشر الأكسدة والالتهاب", route: "/inflammation-tracker", icon: "flame.fill", desc: "قياس مستوى الالتهاب" },
      { title: "الاستدامة والمنتجات النباتية", route: "/sustainability", icon: "leaf.fill", desc: "Vegan • صديق للبيئة" },
    ],
  },
  {
    id: "groups",
    title: "فئات خاصة ومجموعات مستهدفة",
    icon: "person.3.fill",
    color: "#06B6D4",
    emoji: "👥",
    screens: [
      { title: "مكملات الأطفال والمراهقين", route: "/children-supplements", icon: "figure.child", desc: "جرعات آمنة للأطفال" },
      { title: "مكملات كبار السن", route: "/protocols", icon: "person.fill", desc: "احتياجات المسنّين" },
      { title: "المرضى المزمنون", route: "/protocols", icon: "cross.case.fill", desc: "مكملات آمنة للأمراض المزمنة" },
      { title: "مكملات المسافر", route: "/travel-supplements", icon: "airplane", desc: "اضطراب الرحلات والمناعة" },
      { title: "العمال في الشيفت الليلي", route: "/shift-workers", icon: "moon.fill", desc: "تعديل الساعة البيولوجية" },
      { title: "مكملات المناخ الحار والبارد", route: "/climate-supplements", icon: "thermometer", desc: "التكيّف مع الطقس" },
      { title: "التدخين والإقلاع", route: "/smoking-detox", icon: "nosign", desc: "دعم الإقلاع عن التدخين" },
      { title: "الإرهاق الوظيفي", route: "/protocols-extra", icon: "bolt.slash.fill", desc: "استعادة الطاقة والتركيز" },
    ],
  },
  {
    id: "tools",
    title: "الأدوات والحاسبات والمتابعة",
    icon: "wand.and.stars",
    color: "#10B981",
    emoji: "🔧",
    screens: [
      { title: "حاسبة الجرعة حسب الوزن", route: "/dose-calculator", icon: "scalemass.fill", desc: "جرعة دقيقة لوزنك" },
      { title: "حاسبة الحمل الغذائي", route: "/nutrition-load", icon: "chart.bar.fill", desc: "الجرعة الإجمالية اليومية" },
      { title: "حاسبة التوافق الغذائي", route: "/food-compatibility", icon: "checkmark.circle.fill", desc: "توافق المكملات مع طعامك" },
      { title: "خريطة الجسم التفاعلية", route: "/body-map", icon: "figure.stand", desc: "اضغط على عضو لرؤية مكملاته" },
      { title: "اختبار نقص الفيتامينات", route: "/vitamin-deficiency-test", icon: "list.number", desc: "اكتشف ما ينقصك" },
      { title: "اختبار المعرفة العلمية", route: "/knowledge-quiz", icon: "questionmark.circle.fill", desc: "اختبر معلوماتك" },
      { title: "قائمة التسوق الذكية", route: "/shopping-list", icon: "cart.fill", desc: "تتبع مخزونك" },
      { title: "مقارنة الأسعار والقيمة", route: "/price-comparison", icon: "tag.fill", desc: "أفضل سعر لجودة أعلى" },
      { title: "محاكاة بروتوكول المكملات", route: "/protocol-simulator", icon: "play.circle.fill", desc: "جرّب قبل أن تبدأ" },
      { title: "خريطة التفاعلات البصرية", route: "/interactions-map", icon: "arrow.triangle.branch", desc: "تفاعلات مكملاتك الحالية" },
      { title: "توقيت المكملات الأمثل", route: "/timing-optimizer", icon: "clock.fill", desc: "متى تأخذ كل مكمل؟" },
      { title: "دليل الامتصاص", route: "/absorption-guide", icon: "arrow.down.circle.fill", desc: "كيف تزيد الامتصاص؟" },
    ],
  },
  {
    id: "library",
    title: "المكتبة العلمية والتعليم",
    icon: "book.fill",
    color: "#7C3AED",
    emoji: "📚",
    screens: [
      { title: "المكتبة العلمية", route: "/(tabs)/library", icon: "book.fill", desc: "مقالات علمية موثّقة" },
      { title: "الأكاديمية العلمية", route: "/academy", icon: "graduationcap.fill", desc: "تعلّم أساسيات المكملات" },
      { title: "الأساطير والحقائق", route: "/myths-facts", icon: "questionmark.circle.fill", desc: "افصل الحقيقة عن الخرافة" },
      { title: "دليل الأشكال الدوائية", route: "/forms-guide", icon: "pills.fill", desc: "كبسولات • مسحوق • سائل" },
      { title: "دليل الجودة والشهادات", route: "/quality-guide", icon: "checkmark.seal.fill", desc: "كيف تختار منتجاً موثوقاً" },
      { title: "دليل العلامات التجارية", route: "/brands-guide", icon: "star.fill", desc: "أفضل الماركات العالمية" },
      { title: "مركز الأبحاث العلمية", route: "/research-hub", icon: "magnifyingglass", desc: "دراسات سريرية حديثة" },
      { title: "مقارنة الدراسات السريرية", route: "/clinical-studies", icon: "chart.bar.fill", desc: "أدلة علمية موثّقة" },
      { title: "البدائل الغذائية الطبيعية", route: "/(tabs)/library", icon: "leaf.fill", desc: "مصادر طبيعية لكل مكمل" },
      { title: "قاموس مصطلحات المكملات", route: "/(tabs)/library", icon: "text.book.closed.fill", desc: "شرح المصطلحات العلمية" },
      { title: "أخبار عالم المكملات", route: "/news", icon: "newspaper.fill", desc: "آخر الأبحاث والأخبار" },
      { title: "الأسئلة الشائعة", route: "/faq", icon: "questionmark.circle.fill", desc: "إجابات على أكثر الأسئلة" },
    ],
  },
  {
    id: "tracking",
    title: "المتابعة والإنجازات والمجتمع",
    icon: "chart.bar.fill",
    color: "#64748B",
    emoji: "📊",
    screens: [
      { title: "متابعة التقدم الصحي", route: "/progress", icon: "chart.bar.fill", desc: "رسوم بيانية لتقدمك" },
      { title: "التقرير الأسبوعي الذكي", route: "/progress", icon: "doc.text.fill", desc: "ملخص أسبوعي تلقائي" },
      { title: "نظام النقاط والإنجازات", route: "/achievements", icon: "trophy.fill", desc: "اكسب نقاطاً بالالتزام" },
      { title: "تحدي 30 يوم", route: "/challenge-30", icon: "star.fill", desc: "برنامج شهري منظّم" },
      { title: "تقييماتي للمنتجات", route: "/product-ratings", icon: "star.fill", desc: "قيّم تجربتك مع كل منتج" },
      { title: "المنتجات المفضلة", route: "/favorites", icon: "heart.fill", desc: "مكملاتك المفضلة" },
      { title: "تنبيهات انتهاء الصلاحية", route: "/expiry-alerts", icon: "exclamationmark.triangle.fill", desc: "تنبيه قبل الانتهاء" },
      { title: "مجتمع النقاشات العلمية", route: "/community", icon: "person.3.fill", desc: "تواصل مع المهتمين" },
    ],
  },
  {
    id: "settings",
    title: "الإعدادات والخصوصية والأمان",
    icon: "gearshape.fill",
    color: "#94A3B8",
    emoji: "⚙️",
    screens: [
      { title: "قفل التطبيق بالبصمة", route: "/biometric-lock", icon: "lock.fill", desc: "حماية بياناتك الصحية" },
      { title: "وضع الخصوصية الكاملة", route: "/privacy-mode", icon: "eye.slash.fill", desc: "بيانات محلية فقط" },
      { title: "النسخ الاحتياطي المشفّر", route: "/backup", icon: "externaldrive.fill", desc: "احفظ واستعد بياناتك" },
      { title: "الثيمات والألوان", route: "/advanced-themes", icon: "paintpalette.fill", desc: "8 ثيمات مختلفة" },
      { title: "دليل التخزين الصحيح", route: "/storage-guide", icon: "archivebox.fill", desc: "كيف تحفظ مكملاتك" },
      { title: "ما الجديد؟", route: "/whats-new", icon: "sparkles", desc: "آخر الميزات المضافة" },
      { title: "الشهادات والاعتمادات", route: "/certifications", icon: "checkmark.seal.fill", desc: "مصادرنا العلمية" },
      { title: "تقرير الصيدلاني", route: "/pharmacist-report", icon: "cross.case.fill", desc: "ملخص طبي احترافي" },
    ],
  },
];

// ─── المكوّن الرئيسي ─────────────────────────────────────────────────────────
export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { categories, getTopProducts, totalProducts, totalCategories } = useSupplements();
  const topProducts = getTopProducts(4);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // First-launch: redirect to quick setup
  useEffect(() => {
    AsyncStorage.getItem("setup_complete").then((val) => {
      if (!val) {
        router.push("/quick-setup" as any);
      }
    });
  }, []);

  function toggleCategory(id: string) {
    setExpandedCategory((prev) => (prev === id ? null : id));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─── */}
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerRight}>
              <Text style={[styles.greeting, { color: colors.muted }]}>مرحباً بك في</Text>
              <Text style={[styles.appName, { color: colors.primary }]}>علم المكملات</Text>
            </View>
            <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
              <Pressable
                onPress={() => router.push("/global-search" as any)}
                style={({ pressed }) => [styles.searchBtn, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={{ fontSize: 18 }}>🔍</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/quick-setup" as any)}
                style={({ pressed }) => [styles.setupBtn, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "40", opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={[styles.setupBtnText, { color: colors.primary }]}>إعداد سريع</Text>
              </Pressable>
            </View>
          </View>

          {/* Stats Row */}
          <View style={[styles.statsRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {[
              { value: totalProducts, label: "منتج", color: colors.primary },
              { value: totalCategories, label: "فئة", color: "#22C55E" },
              { value: MAIN_CATEGORIES.length, label: "قسم", color: "#F59E0B" },
              { value: "100%", label: "علمي", color: "#8B5CF6" },
            ].map((stat, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Quick Actions ─── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأدوات الرئيسية</Text>
          <View style={styles.quickGrid}>
            {[
              { title: "كورس مخصص", icon: "graduationcap.fill" as const, route: "/(tabs)/courses" as const, color: colors.primary },
              { title: "مقارنة منتجين", icon: "arrow.left.arrow.right" as const, route: "/(tabs)/compare" as const, color: "#22C55E" },
              { title: "ملفي الصحي", icon: "person.crop.circle.fill" as const, route: "/(tabs)/profile" as const, color: "#A855F7" },
              { title: "الأدوات والحاسبات", icon: "wand.and.stars" as const, route: "/(tabs)/tools" as const, color: "#F59E0B" },
            ].map((action, i) => (
              <Pressable
                key={i}
                style={({ pressed }) => [
                  styles.quickCard,
                  { backgroundColor: colors.surface, borderColor: action.color + "35" },
                  pressed && { opacity: 0.72, transform: [{ scale: 0.97 }] },
                ]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.quickIcon, { backgroundColor: action.color + "20" }]}>
                  <IconSymbol name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.quickTitle, { color: colors.foreground }]}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ─── Top Rated Products ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأعلى تقييماً</Text>
            <Pressable onPress={() => router.push("/(tabs)/products" as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>← عرض الكل</Text>
            </Pressable>
          </View>
          {topProducts.map((product, idx) => {
            const catColor = CATEGORY_COLORS[product.category] || "#64748B";
            const scoreColor = product.score >= 8.5 ? "#22C55E" : product.score >= 7 ? "#F59E0B" : "#EF4444";
            return (
              <Pressable
                key={product.id}
                style={({ pressed }) => [
                  styles.productRow,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } } as any)}
              >
                <View style={[styles.rankBadge, { backgroundColor: idx < 3 ? "#F59E0B25" : colors.border }]}>
                  <Text style={[styles.rankText, { color: idx < 3 ? "#F59E0B" : colors.muted }]}>#{idx + 1}</Text>
                </View>
                <View style={[styles.productIcon, { backgroundColor: catColor + "20" }]}>
                  <IconSymbol name={(CATEGORY_ICONS[product.category] || "pills.fill") as any} size={20} color={catColor} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>{product.name_ar || product.name_en}</Text>
                  <Text style={[styles.productBrand, { color: colors.muted }]}>{product.category_ar}</Text>
                </View>
                <View style={[styles.scorePill, { backgroundColor: scoreColor + "20", borderColor: scoreColor + "50" }]}>
                  <Text style={[styles.scoreNum, { color: scoreColor }]}>{product.score.toFixed(1)}</Text>
                  <Text style={{ fontSize: 10 }}>⭐</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* ─── Main Categories (Expandable) ─── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>استكشف حسب القسم</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>اضغط على أي قسم لعرض محتواه</Text>
        </View>

        {MAIN_CATEGORIES.map((cat) => {
          const isExpanded = expandedCategory === cat.id;
          return (
            <View key={cat.id} style={[styles.categoryBlock, { borderColor: cat.color + "30" }]}>
              {/* Category Header */}
              <Pressable
                style={({ pressed }) => [
                  styles.categoryHeader,
                  { backgroundColor: isExpanded ? cat.color + "15" : colors.surface, borderBottomColor: isExpanded ? cat.color + "30" : "transparent" },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => toggleCategory(cat.id)}
              >
                <View style={[styles.catIconWrap, { backgroundColor: cat.color + "20" }]}>
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                </View>
                <View style={styles.catHeaderText}>
                  <Text style={[styles.catTitle, { color: colors.foreground }]}>{cat.title}</Text>
                  <Text style={[styles.catCount, { color: cat.color }]}>{cat.screens.length} شاشة</Text>
                </View>
                <View style={[styles.chevron, { transform: [{ rotate: isExpanded ? "90deg" : "0deg" }] }]}>
                  <Text style={[styles.chevronText, { color: cat.color }]}>‹</Text>
                </View>
              </Pressable>

              {/* Category Screens Grid */}
              {isExpanded && (
                <View style={[styles.screensGrid, { backgroundColor: colors.background }]}>
                  {cat.screens.map((screen, idx) => (
                    <Pressable
                      key={idx}
                      style={({ pressed }) => [
                        styles.screenCard,
                        { backgroundColor: colors.surface, borderColor: cat.color + "25" },
                        pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
                      ]}
                      onPress={() => router.push(screen.route as any)}
                    >
                      <View style={[styles.screenIconWrap, { backgroundColor: cat.color + "18" }]}>
                        <IconSymbol name={screen.icon as any} size={20} color={cat.color} />
                      </View>
                      <Text style={[styles.screenTitle, { color: colors.foreground }]} numberOfLines={2}>
                        {screen.title}
                      </Text>
                      {screen.desc && (
                        <Text style={[styles.screenDesc, { color: colors.muted }]} numberOfLines={1}>
                          {screen.desc}
                        </Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* ─── Bottom Spacer ─── */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// ─── الأنماط ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
  },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  headerRight: { alignItems: "flex-start" },
  greeting: { fontSize: 12, marginBottom: 2, fontFamily: "Cairo", textAlign: "right" },
  appName: { fontSize: 24, fontWeight: "900", letterSpacing: -0.5, fontFamily: "Cairo-Black", textAlign: "right" },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  setupBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  setupBtnText: { fontSize: 12, fontFamily: "Cairo-Bold" },

  // Stats
  statsRow: {
    flexDirection: "row-reverse",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 2,
  },
  statValue: { fontSize: 16, fontWeight: "800", fontFamily: "Cairo-Black" },
  statLabel: { fontSize: 10, fontFamily: "Cairo" },

  // Section
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "700", fontFamily: "Cairo-Black", textAlign: "right" },
  sectionSubtitle: { fontSize: 12, fontFamily: "Cairo", marginTop: 2, textAlign: "right" },
  seeAll: { fontSize: 13, fontFamily: "Cairo-Bold" },

  // Quick Actions
  quickGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  quickCard: {
    width: "47%",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-end",
    gap: 8,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickTitle: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold", textAlign: "right" },

  // Products
  productRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: { flex: 1, alignItems: "flex-end" },
  productName: { fontSize: 13, fontWeight: "600", fontFamily: "Cairo-Bold", textAlign: "right" },
  productBrand: { fontSize: 11, fontFamily: "Cairo", marginTop: 2, textAlign: "right" },
  scorePill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  scoreNum: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },

  // Category Block
  categoryBlock: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  catEmoji: { fontSize: 22 },
  catHeaderText: { flex: 1, alignItems: "flex-end" },
  catTitle: { fontSize: 15, fontWeight: "700", fontFamily: "Cairo-Bold", textAlign: "right" },
  catCount: { fontSize: 11, fontFamily: "Cairo", marginTop: 2 },
  chevron: { width: 24, alignItems: "center" },
  chevronText: { fontSize: 24, fontWeight: "300", lineHeight: 28 },

  // Screens Grid
  screensGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    padding: 10,
    gap: 8,
  },
  screenCard: {
    width: "47%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-end",
    gap: 6,
  },
  screenIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: { fontSize: 12, fontWeight: "600", fontFamily: "Cairo-Bold", textAlign: "right", lineHeight: 18 },
  screenDesc: { fontSize: 10, fontFamily: "Cairo", textAlign: "right", lineHeight: 14 },
});
