/**
 * أخبار وتحديثات عالم المكملات
 * Features: 93 (أخبار المكملات), 94 (التحديثات العلمية)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const NEWS_ITEMS = [
  {
    category: "بحث جديد",
    color: "#3B82F6",
    title: "NMN يحسن اللياقة البدنية في أول دراسة بشرية كبيرة",
    date: "مارس 2024",
    summary: "دراسة على 80 شخصاً: NMN 300 مغ/يوم رفع مستويات NAD+ بـ 38% وحسّن اللياقة البدنية خلال 12 أسبوعاً",
    impact: "مهم",
  },
  {
    category: "تحذير",
    color: "#EF4444",
    title: "FDA تحذر من مكملات تحتوي على Ephedra",
    date: "فبراير 2024",
    summary: "تم سحب عدة منتجات تحتوي على Ephedra أو مشتقاتها من السوق — تسبب مشاكل قلبية خطيرة",
    impact: "عالي",
  },
  {
    category: "دراسة مهمة",
    color: "#10B981",
    title: "Omega-3 يقلل وفيات السرطان بـ 13% في دراسة VITAL",
    date: "يناير 2024",
    summary: "متابعة 5 سنوات على 25,000 شخص: D3 + Omega-3 يقللان وفيات السرطان بشكل ملحوظ",
    impact: "مهم جداً",
  },
  {
    category: "تحديث توصيات",
    color: "#8B5CF6",
    title: "تحديث توصيات Vitamin D للبالغين",
    date: "ديسمبر 2023",
    summary: "Endocrine Society ترفع التوصية إلى 1500-2000 IU/يوم للبالغين — ضعف التوصية السابقة",
    impact: "متوسط",
  },
  {
    category: "اكتشاف جديد",
    color: "#F59E0B",
    title: "Magnesium L-Threonate يزيد حجم الدماغ",
    date: "نوفمبر 2023",
    summary: "دراسة صورة MRI: Magnesium L-Threonate يزيد حجم الحصين بـ 7% ويحسن الذاكرة في كبار السن",
    impact: "مهم",
  },
  {
    category: "تحذير",
    color: "#EF4444",
    title: "تلوث في بعض منتجات Pre-workout",
    date: "أكتوبر 2023",
    summary: "ConsumerLab وجد مواد محظورة في 15% من منتجات Pre-workout — اختر منتجات Informed Sport",
    impact: "عالي",
  },
  {
    category: "بحث جديد",
    color: "#3B82F6",
    title: "Berberine يحسن تنوع الميكروبيوم",
    date: "سبتمبر 2023",
    summary: "دراسة صينية: Berberine يغير تركيبة الميكروبيوم بشكل إيجابي — يفسر جزءاً من فوائده الأيضية",
    impact: "متوسط",
  },
];

const TRENDING_SUPPLEMENTS = [
  { name: "NMN / NR", trend: "↑ 340%", reason: "أبحاث الطول العمر والـ NAD+" },
  { name: "Spermidine", trend: "↑ 280%", reason: "تفعيل الأوتوفاجي وإطالة العمر" },
  { name: "Berberine", trend: "↑ 220%", reason: "البديل الطبيعي لـ Ozempic" },
  { name: "Magnesium L-Threonate", trend: "↑ 180%", reason: "صحة الدماغ والذاكرة" },
  { name: "Urolithin A", trend: "↑ 150%", reason: "صحة الميتوكوندريا والعضلات" },
  { name: "Ashwagandha", trend: "↑ 120%", reason: "إدارة التوتر والقلق" },
];

export default function NewsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedNews, setExpandedNews] = useState<string | null>(null);

  const impactColor = (impact: string) => {
    if (impact === "مهم جداً") return colors.error;
    if (impact === "مهم") return "#F59E0B";
    if (impact === "عالي") return colors.error;
    return colors.muted;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>أخبار عالم المكملات</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>آخر الأبحاث والتحديثات العلمية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكملات الأكثر بحثاً الآن</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
          {TRENDING_SUPPLEMENTS.map((item, i) => (
            <View key={i} style={[styles.trendCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.trendName, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.trendPercent, { color: colors.success }]}>{item.trend}</Text>
              <Text style={[styles.trendReason, { color: colors.muted }]}>{item.reason}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>آخر الأخبار</Text>
        {NEWS_ITEMS.map((news, i) => (
          <Pressable
            key={i}
            style={[styles.newsCard, { backgroundColor: colors.card, borderColor: news.color + "30" }]}
            onPress={() => setExpandedNews(expandedNews === news.title ? null : news.title)}
          >
            <View style={[styles.newsHeader, { backgroundColor: news.color + "10" }]}>
              <View style={styles.newsMeta}>
                <View style={[styles.impactBadge, { backgroundColor: impactColor(news.impact) + "20" }]}>
                  <Text style={[styles.impactText, { color: impactColor(news.impact) }]}>{news.impact}</Text>
                </View>
                <Text style={[styles.newsDate, { color: colors.muted }]}>{news.date}</Text>
                <View style={[styles.catBadge, { backgroundColor: news.color + "20" }]}>
                  <Text style={[styles.catText, { color: news.color }]}>{news.category}</Text>
                </View>
              </View>
              <Text style={[styles.newsTitle, { color: colors.foreground }]}>{news.title}</Text>
            </View>
            {expandedNews === news.title && (
              <Text style={[styles.newsSummary, { color: colors.muted }]}>{news.summary}</Text>
            )}
          </Pressable>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  trendCard: { width: 150, padding: 12, borderRadius: 14, borderWidth: 1, gap: 4 },
  trendName: { fontSize: 13, fontWeight: "800", textAlign: "center", fontFamily: "Cairo-Black" },
  trendPercent: { fontSize: 16, fontWeight: "900", textAlign: "center", fontFamily: "Cairo-Black" },
  trendReason: { fontSize: 10, textAlign: "center", lineHeight: 14, fontFamily: "Cairo" },
  newsCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  newsHeader: { padding: 14, gap: 8 },
  newsMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  newsDate: { fontSize: 11, fontFamily: "Cairo" },
  impactBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  impactText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  newsTitle: { fontSize: 14, fontWeight: "800", lineHeight: 20, textAlign: "right", fontFamily: "Cairo-Black" },
  newsSummary: { padding: 14, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
