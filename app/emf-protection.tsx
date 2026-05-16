/**
 * تقييم موضوعي للحماية من الإشعاع الكهرومغناطيسي
 * Feature: 89
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const EMF_FACTS = [
  {
    claim: "الهواتف الذكية تسبب السرطان",
    verdict: "غير مثبت علمياً",
    color: "#F59E0B",
    explanation: "الدراسات الكبرى (INTERPHONE, Million Women Study) لم تجد دليلاً قاطعاً. الإشعاع الصادر من الهواتف غير مؤيَّن وطاقته منخفضة جداً لكسر الحمض النووي.",
    evidence: "⭐⭐⭐⭐ أدلة علمية قوية على الأمان",
  },
  {
    claim: "الإشعاع الكهرومغناطيسي يسبب الأرق",
    verdict: "دليل محدود",
    color: "#F59E0B",
    explanation: "بعض الدراسات الصغيرة تشير إلى تأثير على النوم، لكن الضوء الأزرق من الشاشات هو السبب الأكثر ثبوتاً.",
    evidence: "⭐⭐ دليل ضعيف غير حاسم",
  },
  {
    claim: "5G خطير على الصحة",
    verdict: "غير صحيح",
    color: "#10B981",
    explanation: "5G يستخدم ترددات أعلى لكنها لا تزال غير مؤيَّنة. منظمة الصحة العالمية والهيئات العلمية الكبرى تؤكد سلامته.",
    evidence: "⭐⭐⭐⭐⭐ إجماع علمي على الأمان",
  },
];

const EVIDENCE_BASED_TIPS = [
  {
    title: "تقليل وقت الشاشة",
    desc: "الضوء الأزرق يؤثر على الميلاتونين — استخدم وضع الليل بعد الغروب",
    icon: "moon.fill" as const,
    color: "#8B5CF6",
    evidence: "مثبت علمياً",
  },
  {
    title: "مسافة آمنة من الهاتف",
    desc: "احتفظ بالهاتف على بُعد 30 سم أثناء النوم — يقلل التعرض بنسبة 90%",
    icon: "iphone" as const,
    color: "#3B82F6",
    evidence: "توصية احترازية",
  },
  {
    title: "فيتامين D والمناعة",
    desc: "يدعم المناعة العامة — لا علاقة مباشرة بـ EMF لكنه مفيد للصحة العامة",
    icon: "sun.max.fill" as const,
    color: "#F59E0B",
    evidence: "مثبت علمياً للصحة العامة",
  },
  {
    title: "مضادات الأكسدة",
    desc: "فيتامين C وE ومضادات الأكسدة الطبيعية تدعم الصحة الخلوية العامة",
    icon: "leaf.fill" as const,
    color: "#10B981",
    evidence: "مثبت للصحة العامة",
  },
];

const PSEUDOSCIENCE_PRODUCTS = [
  { name: "ملصقات مضادة للإشعاع", verdict: "لا دليل علمي", color: "#EF4444" },
  { name: "أساور الطاقة الكمومية", verdict: "لا دليل علمي", color: "#EF4444" },
  { name: "بلورات الحماية من 5G", verdict: "لا دليل علمي", color: "#EF4444" },
  { name: "أجهزة تحييد الطاقة السلبية", verdict: "لا دليل علمي", color: "#EF4444" },
];

export default function EMFProtectionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedFact, setExpandedFact] = useState<number | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الإشعاع الكهرومغناطيسي — الحقيقة العلمية ⚡</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>تقييم موضوعي قائم على الأدلة العلمية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.disclaimerCard, { backgroundColor: "#3B82F615", borderColor: "#3B82F630" }]}>
          <Text style={[styles.disclaimerText, { color: colors.foreground }]}>
            🔬 هذا القسم يقدم تقييماً علمياً موضوعياً — لا نروّج لمنتجات غير مثبتة ولا نبالغ في المخاوف غير المثبتة
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>فحص الادعاءات الشائعة</Text>
        {EMF_FACTS.map((fact, i) => (
          <Pressable
            key={i}
            style={[styles.factCard, { backgroundColor: colors.surface, borderColor: fact.color + "30" }]}
            onPress={() => setExpandedFact(expandedFact === i ? null : i)}
          >
            <View style={styles.factHeader}>
              <IconSymbol name={expandedFact === i ? "chevron.down" : "chevron.right"} size={14} color={colors.muted} />
              <View style={[styles.verdictBadge, { backgroundColor: fact.color + "20" }]}>
                <Text style={[styles.verdictText, { color: fact.color }]}>{fact.verdict}</Text>
              </View>
              <Text style={[styles.factClaim, { color: colors.foreground }]}>{fact.claim}</Text>
            </View>
            {expandedFact === i && (
              <View style={{ gap: 8, marginTop: 10 }}>
                <Text style={[styles.factExplanation, { color: colors.foreground }]}>{fact.explanation}</Text>
                <Text style={[styles.factEvidence, { color: colors.muted }]}>{fact.evidence}</Text>
              </View>
            )}
          </Pressable>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>توصيات مبنية على الأدلة</Text>
        {EVIDENCE_BASED_TIPS.map((tip, i) => (
          <View key={i} style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: tip.color + "20" }]}>
            <View style={[styles.tipIcon, { backgroundColor: tip.color + "15" }]}>
              <IconSymbol name={tip.icon} size={20} color={tip.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tipTitle, { color: colors.foreground }]}>{tip.title}</Text>
              <Text style={[styles.tipDesc, { color: colors.muted }]}>{tip.desc}</Text>
              <View style={[styles.evidenceBadge, { backgroundColor: "#10B98115" }]}>
                <Text style={[styles.evidenceText, { color: "#10B981" }]}>✓ {tip.evidence}</Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>منتجات لا دليل علمي عليها ⚠️</Text>
        <View style={[styles.pseudoCard, { backgroundColor: "#EF444408", borderColor: "#EF444420" }]}>
          {PSEUDOSCIENCE_PRODUCTS.map((p, i) => (
            <View key={i} style={styles.pseudoRow}>
              <View style={[styles.xBadge, { backgroundColor: "#EF444420" }]}>
                <Text style={{ color: "#EF4444", fontSize: 10, fontWeight: "900" }}>✗</Text>
              </View>
              <Text style={[styles.pseudoName, { color: colors.foreground }]}>{p.name}</Text>
              <Text style={[styles.pseudoVerdict, { color: "#EF4444" }]}>{p.verdict}</Text>
            </View>
          ))}
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
  headerTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  disclaimerCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  disclaimerText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  factCard: { borderRadius: 14, borderWidth: 1, padding: 12 },
  factHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  factClaim: { flex: 1, fontSize: 12, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  verdictBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  verdictText: { fontSize: 10, fontWeight: "700", fontFamily: "Cairo-Bold" },
  factExplanation: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  factEvidence: { fontSize: 11, textAlign: "right", fontStyle: "italic", fontFamily: "Cairo" },
  tipCard: { flexDirection: "row-reverse", gap: 12, borderRadius: 14, borderWidth: 1, padding: 12 },
  tipIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  tipTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  tipDesc: { fontSize: 11, lineHeight: 16, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  evidenceBadge: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, marginTop: 4 },
  evidenceText: { fontSize: 10, fontWeight: "700", fontFamily: "Cairo-Bold" },
  pseudoCard: { borderRadius: 14, borderWidth: 1, padding: 12, gap: 8 },
  pseudoRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  xBadge: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  pseudoName: { flex: 1, fontSize: 12, textAlign: "right", fontFamily: "Cairo" },
  pseudoVerdict: { fontSize: 10, fontWeight: "700", fontFamily: "Cairo-Bold" },
});
