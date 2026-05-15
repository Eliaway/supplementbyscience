/**
 * الطول العمر ومكافحة الشيخوخة
 * Features: 103 (NAD+), 104 (الأوتوفاجي), 105 (Telomere), 106 (Senolytics)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const LONGEVITY_PROTOCOLS = [
  {
    id: "nad",
    title: "بروتوكول NAD+",
    subtitle: "وقود الميتوكوندريا وإصلاح الحمض النووي",
    color: "#F59E0B",
    icon: "bolt.fill" as const,
    description: "NAD+ يتناقص مع العمر بنسبة 50% كل 20 سنة. رفعه يحسن الطاقة، يصلح الحمض النووي، ويطيل العمر في الدراسات الحيوانية.",
    supplements: [
      { name: "NMN (Nicotinamide Mononucleotide)", dose: "500-1000 مغ صباحاً", benefit: "يرفع NAD+ بشكل مباشر وفعال", evidence: "قوي" },
      { name: "NR (Nicotinamide Riboside)", dose: "300-600 مغ", benefit: "بديل NMN — أرخص وفعال", evidence: "قوي" },
      { name: "Resveratrol", dose: "500 مغ مع الدهون", benefit: "يفعّل Sirtuins — بروتينات الطول العمر", evidence: "متوسط" },
      { name: "Quercetin", dose: "500 مغ", benefit: "يدعم مسارات الطول العمر", evidence: "متوسط" },
      { name: "TMG (Trimethylglycine)", dose: "500-1000 مغ", benefit: "يمنع نضوب المثيل مع NMN", evidence: "مهم" },
    ],
  },
  {
    id: "autophagy",
    title: "تحفيز الأوتوفاجي",
    subtitle: "إعادة تدوير الخلايا التالفة",
    color: "#10B981",
    icon: "arrow.triangle.2.circlepath" as const,
    description: "الأوتوفاجي هو عملية تنظيف الخلايا من البروتينات التالفة والميتوكوندريا المعطوبة. فاز يوشينوري أوسومي بنوبل 2016 لاكتشافه.",
    supplements: [
      { name: "Spermidine", dose: "1-5 مغ", benefit: "أقوى محفز للأوتوفاجي — موجود في القمح الجرثومي", evidence: "قوي" },
      { name: "Berberine", dose: "500 مغ × 2", benefit: "يحفز AMPK — مسار الأوتوفاجي الرئيسي", evidence: "قوي" },
      { name: "Fasting (الصيام المتقطع)", dose: "16-18 ساعة", benefit: "أقوى محفز للأوتوفاجي بدون مكملات", evidence: "قوي جداً" },
      { name: "EGCG (الشاي الأخضر)", dose: "400 مغ", benefit: "يحفز الأوتوفاجي ومضاد أكسدة", evidence: "متوسط" },
    ],
  },
  {
    id: "telomere",
    title: "حماية التيلومير",
    subtitle: "ساعة الشيخوخة الخلوية",
    color: "#6366F1",
    icon: "testtube.2" as const,
    description: "التيلومير هو الغطاء الواقي لنهايات الكروموسومات. كلما قصر، كلما شاخت الخلية. الإجهاد والتدخين يقصرانه بسرعة.",
    supplements: [
      { name: "Astragalus (TA-65)", dose: "250-1000 مغ", benefit: "يحفز Telomerase — الإنزيم الذي يطيل التيلومير", evidence: "قوي" },
      { name: "Omega-3", dose: "2-3 غ", benefit: "يحمي التيلومير من الأكسدة", evidence: "قوي" },
      { name: "Vitamin D3", dose: "4000-6000 IU", benefit: "يرتبط بطول التيلومير في الدراسات", evidence: "متوسط" },
      { name: "Folate (Methylfolate)", dose: "400-800 مكغ", benefit: "يدعم إصلاح الحمض النووي", evidence: "متوسط" },
    ],
  },
  {
    id: "senolytics",
    title: "مكملات Senolytics",
    subtitle: "إزالة الخلايا الشيخوخية",
    color: "#EF4444",
    icon: "trash.fill" as const,
    description: "الخلايا الشيخوخية هي خلايا متوقفة عن الانقسام لكنها تفرز مواد التهابية تضر الخلايا المجاورة. إزالتها تحسن الصحة بشكل ملحوظ.",
    supplements: [
      { name: "Quercetin + Dasatinib (بإشراف طبي)", dose: "1000 مغ Quercetin", benefit: "أكثر بروتوكول Senolytic مدروس", evidence: "قوي" },
      { name: "Fisetin", dose: "100-500 مغ", benefit: "Senolytic طبيعي — موجود في الفراولة", evidence: "قوي" },
      { name: "Luteolin", dose: "100 مغ", benefit: "يزيل الخلايا الشيخوخية ومضاد التهاب", evidence: "متوسط" },
      { name: "Piperlongumine", dose: "موجود في الفلفل الطويل", benefit: "Senolytic طبيعي واعد", evidence: "أولي" },
    ],
  },
  {
    id: "mitochondria",
    title: "تحسين الميتوكوندريا",
    subtitle: "مصنع الطاقة الخلوي",
    color: "#F97316",
    icon: "bolt.circle.fill" as const,
    description: "الميتوكوندريا تنتج 90% من طاقة الجسم. ضعفها يسبب التعب المزمن والشيخوخة المبكرة وكثير من الأمراض.",
    supplements: [
      { name: "CoQ10 (Ubiquinol)", dose: "200-400 مغ", benefit: "ضروري لسلسلة نقل الإلكترون في الميتوكوندريا", evidence: "قوي" },
      { name: "PQQ", dose: "10-20 مغ", benefit: "يحفز نمو ميتوكوندريا جديدة (Biogenesis)", evidence: "قوي" },
      { name: "L-Carnitine", dose: "1-2 غ", benefit: "ينقل الدهون إلى الميتوكوندريا للحرق", evidence: "قوي" },
      { name: "Alpha Lipoic Acid", dose: "300-600 مغ", benefit: "مضاد أكسدة داخل الميتوكوندريا", evidence: "قوي" },
    ],
  },
];

const EVIDENCE_COLORS: Record<string, string> = {
  "قوي": "#22C55E",
  "قوي جداً": "#16A34A",
  "متوسط": "#F59E0B",
  "أولي": "#94A3B8",
  "مهم": "#6366F1",
};

export default function LongevityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0f172a", borderBottomColor: "#1e293b" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#60a5fa" />
          <Text style={[styles.backText, { color: "#60a5fa" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>الطول العمر ومكافحة الشيخوخة</Text>
        <Text style={[styles.headerSub, { color: "#94a3b8" }]}>أحدث بروتوكولات علم الشيخوخة (Longevity Science)</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Intro */}
        <View style={[styles.introCard, { backgroundColor: "#1e293b", borderColor: "#334155" }]}>
          <Text style={[styles.introTitle, { color: "#f1f5f9" }]}>لماذا نشيخ؟</Text>
          <Text style={[styles.introText, { color: "#94a3b8" }]}>
            علم الشيخوخة (Geroscience) يحدد 9 علامات للشيخوخة: عدم استقرار الجينوم، تقصير التيلومير، تغيرات إيبيجينية، فقدان التوازن البروتيني، ضعف الاستشعار الغذائي، خلل الميتوكوندريا، الشيخوخة الخلوية، استنزاف الخلايا الجذعية، وتغير التواصل بين الخلايا.
          </Text>
        </View>

        {LONGEVITY_PROTOCOLS.map((protocol) => (
          <View key={protocol.id} style={[styles.protocolCard, { backgroundColor: colors.card, borderColor: protocol.color + "40" }]}>
            <Pressable
              style={[styles.protocolHeader, { backgroundColor: protocol.color + "10" }]}
              onPress={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
            >
              <IconSymbol name={expandedProtocol === protocol.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.protocolHeaderInfo}>
                <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{protocol.title}</Text>
                <Text style={[styles.protocolSubtitle, { color: colors.muted }]}>{protocol.subtitle}</Text>
              </View>
              <View style={[styles.protocolIcon, { backgroundColor: protocol.color + "20" }]}>
                <IconSymbol name={protocol.icon} size={22} color={protocol.color} />
              </View>
            </Pressable>

            {expandedProtocol === protocol.id && (
              <View style={{ padding: 14, gap: 12 }}>
                <Text style={[styles.protocolDesc, { color: colors.muted }]}>{protocol.description}</Text>
                {protocol.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: protocol.color + "08", borderColor: protocol.color + "20" }]}>
                    <View style={styles.suppHeader}>
                      <View style={[styles.evidenceBadge, { backgroundColor: EVIDENCE_COLORS[supp.evidence] + "20" }]}>
                        <Text style={[styles.evidenceText, { color: EVIDENCE_COLORS[supp.evidence] }]}>{supp.evidence}</Text>
                      </View>
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    </View>
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppBenefit, { color: colors.muted }]}>{supp.benefit}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
          <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
          <Text style={[styles.disclaimerText, { color: colors.muted }]}>
            معظم هذه الدراسات أُجريت على حيوانات أو في مراحل مبكرة على البشر. استشر طبيبك قبل البدء بأي بروتوكول.
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
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  introCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  introTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", marginBottom: 8 },
  introText: { fontSize: 12, lineHeight: 20, textAlign: "right" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolHeaderInfo: { flex: 1, alignItems: "flex-end" },
  protocolTitle: { fontSize: 15, fontWeight: "800" },
  protocolSubtitle: { fontSize: 12, marginTop: 2 },
  protocolIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  protocolDesc: { fontSize: 12, lineHeight: 20, textAlign: "right" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  suppBenefit: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  disclaimer: { flexDirection: "row-reverse", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
});
