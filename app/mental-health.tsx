/**
 * الصحة النفسية وإدارة التوتر
 * Features: 57 (القلق والاكتئاب), 58 (التوتر المزمن), 59 (الصحة النفسية العامة)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const MENTAL_PROTOCOLS = [
  {
    id: "anxiety",
    title: "القلق والتوتر",
    color: "#6366F1",
    icon: "brain.head.profile" as const,
    supplements: [
      { name: "Ashwagandha KSM-66", dose: "600 مغ", timing: "مع العشاء", evidence: "قوي جداً", note: "يقلل الكورتيزول بنسبة 28% — أفضل مكمل للقلق المزمن" },
      { name: "Magnesium Glycinate", dose: "400-600 مغ", timing: "قبل النوم", evidence: "قوي", note: "يهدئ الجهاز العصبي ويقلل القلق والتوتر" },
      { name: "L-Theanine", dose: "200-400 مغ", timing: "عند الحاجة", evidence: "قوي", note: "يحفز موجات ألفا في الدماغ — هدوء بدون نعاس" },
      { name: "GABA", dose: "500-750 مغ", timing: "عند الحاجة", evidence: "متوسط", note: "الناقل العصبي الرئيسي للاسترخاء" },
      { name: "Rhodiola Rosea", dose: "400-600 مغ", timing: "صباحاً", evidence: "قوي", note: "يقلل القلق والتعب النفسي ويحسن المرونة" },
    ],
  },
  {
    id: "depression",
    title: "الاكتئاب والمزاج",
    color: "#F59E0B",
    icon: "sun.max.fill" as const,
    supplements: [
      { name: "5-HTP", dose: "100-300 مغ", timing: "مع الطعام", evidence: "قوي", note: "يرفع السيروتونين مباشرة — لا تجمع مع SSRI" },
      { name: "SAMe", dose: "400-800 مغ", timing: "قبل الطعام", evidence: "قوي جداً", note: "مثل SSRI في الدراسات لكن بدون آثار جانبية" },
      { name: "Omega-3 (EPA عالي)", dose: "2-4 غ EPA", timing: "مع الطعام", evidence: "قوي جداً", note: "EPA أفضل من DHA للاكتئاب — مدعوم بـ 30+ دراسة" },
      { name: "Vitamin D3", dose: "5000 IU", timing: "مع الإفطار", evidence: "قوي", note: "نقصه مرتبط بالاكتئاب — يحسن المزاج بشكل ملحوظ" },
      { name: "Saffron Extract", dose: "30 مغ", timing: "مع الطعام", evidence: "قوي", note: "مثل Fluoxetine في بعض الدراسات — بدون آثار جانبية" },
    ],
  },
  {
    id: "sleep",
    title: "النوم والاسترخاء",
    color: "#8B5CF6",
    icon: "moon.fill" as const,
    supplements: [
      { name: "Melatonin", dose: "0.5-3 مغ", timing: "30-60 دقيقة قبل النوم", evidence: "قوي جداً", note: "ابدأ بأقل جرعة — الكثير يسبب الكوابيس" },
      { name: "Magnesium Glycinate", dose: "400 مغ", timing: "قبل النوم بساعة", evidence: "قوي", note: "يعمق النوم ويقلل الاستيقاظ الليلي" },
      { name: "Glycine", dose: "3 غ", timing: "قبل النوم", evidence: "قوي", note: "يخفض درجة حرارة الجسم ويحسن جودة النوم" },
      { name: "L-Theanine", dose: "200 مغ", timing: "قبل النوم", evidence: "قوي", note: "يهدئ الدماغ ويقلل الأفكار المتسارعة" },
      { name: "Valerian Root", dose: "300-600 مغ", timing: "قبل النوم", evidence: "متوسط", note: "يقلل وقت النوم ويحسن جودته" },
    ],
  },
  {
    id: "focus",
    title: "التركيز والإنتاجية",
    color: "#10B981",
    icon: "target" as const,
    supplements: [
      { name: "Lion's Mane Mushroom", dose: "1-3 غ", timing: "مع الإفطار", evidence: "قوي", note: "يحفز NGF — ينمو الخلايا العصبية ويحسن التركيز" },
      { name: "Bacopa Monnieri", dose: "300-600 مغ", timing: "مع الطعام", evidence: "قوي", note: "يحسن الذاكرة والتعلم — يحتاج 8-12 أسبوع" },
      { name: "Alpha GPC", dose: "300-600 مغ", timing: "صباحاً", evidence: "قوي", note: "يرفع الأسيتيل كولين — أهم ناقل عصبي للذاكرة" },
      { name: "Phosphatidylserine", dose: "100-300 مغ", timing: "مع الطعام", evidence: "قوي", note: "يحسن الذاكرة والتركيز — مدعوم بـ FDA" },
      { name: "Caffeine + L-Theanine", dose: "100 مغ + 200 مغ", timing: "صباحاً", evidence: "قوي جداً", note: "أفضل مجموعة للتركيز — الثيانين يلغي القلق من الكافيين" },
    ],
  },
];

export default function MentalHealthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الصحة النفسية وإدارة التوتر</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>مكملات مدعومة علمياً للصحة النفسية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.warningCard, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
          <Text style={[styles.warningText, { color: colors.warning }]}>⚠️ المكملات مساعدة وليست بديلاً عن العلاج النفسي. استشر طبيبك إذا كنت تتناول أدوية نفسية.</Text>
        </View>

        {MENTAL_PROTOCOLS.map((protocol) => (
          <View key={protocol.id} style={[styles.protocolCard, { backgroundColor: colors.card, borderColor: protocol.color + "40" }]}>
            <Pressable
              style={[styles.protocolHeader, { backgroundColor: protocol.color + "10" }]}
              onPress={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
            >
              <IconSymbol name={expandedProtocol === protocol.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{protocol.title}</Text>
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
                    <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose} — {supp.timing}</Text>
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
  warningCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  protocolIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
