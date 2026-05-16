/**
 * الجهاز المناعي والوقاية من الأمراض
 * Features: 40 (تقوية المناعة), 41 (الوقاية من العدوى), 42 (بروتوكول الإنفلونزا)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const IMMUNE_PROTOCOLS = [
  {
    id: "daily",
    title: "بروتوكول المناعة اليومي",
    subtitle: "للوقاية طوال العام",
    color: "#10B981",
    icon: "shield.fill" as const,
    supplements: [
      { name: "Vitamin D3 + K2", dose: "4000 IU + 180 مكغ", timing: "مع الإفطار", evidence: "قوي جداً", note: "أهم مكمل للمناعة — 70% من الناس ناقصون" },
      { name: "Zinc Bisglycinate", dose: "25-30 مغ", timing: "مع الطعام", evidence: "قوي", note: "يدعم إنتاج الخلايا المناعية" },
      { name: "Vitamin C (Buffered)", dose: "500-1000 مغ", timing: "مع الوجبات", evidence: "قوي", note: "مضاد أكسدة ويدعم النشاط المناعي" },
      { name: "Quercetin", dose: "500 مغ", timing: "مع الطعام", evidence: "قوي", note: "يحمل الزنك داخل الخلية ومضاد فيروسي" },
      { name: "Omega-3 (EPA+DHA)", dose: "2-3 غ", timing: "مع الطعام", evidence: "قوي", note: "يقلل الالتهاب ويحسن استجابة المناعة" },
    ],
  },
  {
    id: "acute",
    title: "بروتوكول الإصابة الحادة",
    subtitle: "عند بداية المرض أو التعرض للعدوى",
    color: "#EF4444",
    icon: "cross.case.fill" as const,
    supplements: [
      { name: "Zinc Acetate Lozenges", dose: "75 مغ/يوم لمدة 5-7 أيام", timing: "كل 2-3 ساعات", evidence: "قوي", note: "يقلل مدة الزكام بـ 33% إذا بدأت خلال 24 ساعة" },
      { name: "Vitamin C (High Dose)", dose: "2-4 غ/يوم", timing: "موزعة على اليوم", evidence: "متوسط", note: "جرعات عالية مؤقتة — قلل عند الشفاء" },
      { name: "Elderberry (Sambucol)", dose: "4 ملاعق صغيرة/يوم", timing: "4 مرات يومياً", evidence: "قوي", note: "يقلل مدة الإنفلونزا بـ 4 أيام في الدراسات" },
      { name: "Andrographis", dose: "400 مغ × 3", timing: "مع الوجبات", evidence: "قوي", note: "عشبة آسيوية قوية ضد العدوى الفيروسية" },
      { name: "NAC (N-Acetyl Cysteine)", dose: "600 مغ × 2", timing: "مع الوجبات", evidence: "قوي", note: "يرقق المخاط ويحمي الرئتين" },
    ],
  },
  {
    id: "autoimmune",
    title: "دعم المناعة الذاتية",
    subtitle: "للمرضى الذين يعانون من أمراض المناعة الذاتية",
    color: "#8B5CF6",
    icon: "shield.fill" as const,
    supplements: [
      { name: "Vitamin D3 (High Dose)", dose: "5000-10000 IU (بإشراف طبي)", timing: "مع الطعام الدهني", evidence: "قوي", note: "يوازن المناعة — ضروري في أمراض المناعة الذاتية" },
      { name: "Omega-3 (EPA عالي)", dose: "3-4 غ EPA", timing: "مع الطعام", evidence: "قوي", note: "يقلل الالتهاب المزمن" },
      { name: "Curcumin (Theracurmin)", dose: "90-180 مغ", timing: "مع الطعام", evidence: "قوي", note: "يثبط NF-kB — المسار الالتهابي الرئيسي" },
      { name: "Boswellia Serrata", dose: "300-400 مغ", timing: "مع الطعام", evidence: "قوي", note: "مضاد التهاب قوي — يثبط 5-LOX" },
      { name: "Probiotics (Multi-strain)", dose: "50 مليار CFU", timing: "قبل النوم", evidence: "متوسط", note: "70% من المناعة في الأمعاء" },
    ],
  },
  {
    id: "seasonal",
    title: "بروتوكول الحساسية الموسمية",
    subtitle: "لمرضى حمى القش والحساسية",
    color: "#F59E0B",
    icon: "allergens" as const,
    supplements: [
      { name: "Quercetin + Bromelain", dose: "500 مغ + 400 مغ", timing: "قبل الوجبات", evidence: "قوي", note: "يثبط إفراز الهيستامين بشكل طبيعي" },
      { name: "Vitamin C (Buffered)", dose: "2 غ/يوم", timing: "موزعة", evidence: "متوسط", note: "يكسر الهيستامين ويقلل الأعراض" },
      { name: "Stinging Nettle Extract", dose: "300-600 مغ", timing: "قبل التعرض", evidence: "متوسط", note: "يثبط مستقبلات الهيستامين بشكل طبيعي" },
      { name: "Butterbur Extract (PA-free)", dose: "50-75 مغ × 2", timing: "مع الطعام", evidence: "قوي", note: "فعال مثل Cetirizine في الدراسات" },
    ],
  },
];

const IMMUNE_FOODS = [
  { emoji: "🧄", name: "الثوم", benefit: "Allicin — مضاد بكتيري وفيروسي قوي" },
  { emoji: "🫚", name: "زيت جوز الهند", benefit: "Lauric Acid — يدمر غشاء الفيروسات" },
  { emoji: "🍄", name: "فطر الشيتاكي", benefit: "Beta-glucans — يحفز الخلايا القاتلة الطبيعية" },
  { emoji: "🫐", name: "التوت الأزرق", benefit: "Anthocyanins — مضاد أكسدة قوي للمناعة" },
  { emoji: "🥦", name: "البروكلي", benefit: "Sulforaphane — يحفز إنزيمات المناعة" },
  { emoji: "🍵", name: "الشاي الأخضر", benefit: "EGCG — يمنع تكاثر الفيروسات" },
];

export default function ImmuneSystemScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0f2a1a", borderBottomColor: "#1a4a2a" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#4ade80" />
          <Text style={[styles.backText, { color: "#4ade80" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>الجهاز المناعي والوقاية</Text>
        <Text style={[styles.headerSub, { color: "#86efac" }]}>بروتوكولات علمية لتقوية المناعة</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Immune Foods */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أطعمة المناعة الأولى</Text>
        <View style={styles.foodsGrid}>
          {IMMUNE_FOODS.map((food, i) => (
            <View key={i} style={[styles.foodCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={styles.foodEmoji}>{food.emoji}</Text>
              <Text style={[styles.foodName, { color: colors.foreground }]}>{food.name}</Text>
              <Text style={[styles.foodBenefit, { color: colors.muted }]}>{food.benefit}</Text>
            </View>
          ))}
        </View>

        {/* Protocols */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>بروتوكولات المناعة</Text>
        {IMMUNE_PROTOCOLS.map((protocol) => (
          <View key={protocol.id} style={[styles.protocolCard, { backgroundColor: colors.card, borderColor: protocol.color + "40" }]}>
            <Pressable
              style={[styles.protocolHeader, { backgroundColor: protocol.color + "10" }]}
              onPress={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
            >
              <IconSymbol name={expandedProtocol === protocol.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.protocolInfo}>
                <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{protocol.title}</Text>
                <Text style={[styles.protocolSubtitle, { color: colors.muted }]}>{protocol.subtitle}</Text>
              </View>
              <View style={[styles.protocolIcon, { backgroundColor: protocol.color + "20" }]}>
                <IconSymbol name={protocol.icon} size={22} color={protocol.color} />
              </View>
            </Pressable>
            {expandedProtocol === protocol.id && (
              <View style={{ padding: 12, gap: 10 }}>
                {protocol.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: protocol.color + "06", borderColor: protocol.color + "20" }]}>
                    <View style={styles.suppHeader}>
                      <View style={[styles.evidenceBadge, { backgroundColor: supp.evidence.includes("قوي") ? colors.success + "20" : colors.warning + "20" }]}>
                        <Text style={[styles.evidenceText, { color: supp.evidence.includes("قوي") ? colors.success : colors.warning }]}>{supp.evidence}</Text>
                      </View>
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    </View>
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppTiming, { color: colors.muted }]}>التوقيت: {supp.timing}</Text>
                    <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  foodsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  foodCard: { width: "47%", padding: 12, borderRadius: 14, borderWidth: 1, alignItems: "center", gap: 6 },
  foodEmoji: { fontSize: 28, fontFamily: "Cairo" },
  foodName: { fontSize: 13, fontWeight: "800", fontFamily: "Cairo-Black" },
  foodBenefit: { fontSize: 11, lineHeight: 16, textAlign: "center", fontFamily: "Cairo" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "flex-start", padding: 14, gap: 10 },
  protocolInfo: { flex: 1, alignItems: "flex-end", gap: 4 },
  protocolTitle: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  protocolSubtitle: { fontSize: 12, fontFamily: "Cairo" },
  protocolIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppTiming: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
