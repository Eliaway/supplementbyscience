/**
 * مكملات السفر والتكيف مع المناطق الزمنية
 * Feature: 53 (مكملات المسافرين), 54 (jet lag)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const TRAVEL_PROTOCOLS = [
  {
    id: "jetlag",
    title: "التكيف مع الفارق الزمني (Jet Lag)",
    color: "#6366F1",
    icon: "airplane" as const,
    steps: [
      { phase: "قبل السفر (2-3 أيام)", supplements: [
        { name: "Melatonin", dose: "0.5-1 مغ", note: "ابدأ بتعديل وقت نومك تدريجياً" },
        { name: "Vitamin D3", dose: "4000 IU", note: "يدعم الساعة البيولوجية" },
      ]},
      { phase: "أثناء الرحلة", supplements: [
        { name: "Melatonin", dose: "0.5-1 مغ", note: "خذها عند وقت النوم في الوجهة الجديدة" },
        { name: "Magnesium Glycinate", dose: "400 مغ", note: "يساعد على النوم في الطائرة" },
        { name: "Vitamin C", dose: "1000 مغ", note: "يقلل الإجهاد من الرحلة الطويلة" },
      ]},
      { phase: "بعد الوصول", supplements: [
        { name: "Melatonin", dose: "0.5-3 مغ", note: "خذها عند وقت النوم المحلي لمدة 3-5 أيام" },
        { name: "Bright Light Therapy", dose: "30 دقيقة ضوء طبيعي", note: "أهم علاج لـ Jet Lag — اخرج في الصباح" },
      ]},
    ],
  },
  {
    id: "prevention",
    title: "الوقاية من أمراض السفر",
    color: "#10B981",
    icon: "cross.case.fill" as const,
    supplements: [
      { name: "Probiotics (Multi-strain)", dose: "50 مليار CFU", timing: "ابدأ قبل السفر بأسبوع", note: "يقلل إسهال المسافر بنسبة 40%" },
      { name: "Zinc Lozenges", dose: "25 مغ عند الحاجة", timing: "عند الشعور بالمرض", note: "يقلل مدة الزكام" },
      { name: "Vitamin C", dose: "1000 مغ/يوم", timing: "يومياً أثناء السفر", note: "يدعم المناعة تحت الإجهاد" },
      { name: "Elderberry Extract", dose: "600 مغ/يوم", timing: "أثناء السفر", note: "يقلل خطر الإصابة بالإنفلونزا" },
      { name: "Activated Charcoal", dose: "500-1000 مغ عند الحاجة", timing: "عند الإسهال أو التسمم الغذائي", note: "يمتص السموم والبكتيريا" },
    ],
  },
  {
    id: "altitude",
    title: "مرض الارتفاع (Altitude Sickness)",
    color: "#F59E0B",
    icon: "mountain.2.fill" as const,
    supplements: [
      { name: "Rhodiola Rosea", dose: "400-600 مغ", timing: "ابدأ 5 أيام قبل الصعود", note: "يحسن استخدام الأكسجين ويقلل أعراض الارتفاع" },
      { name: "Ginkgo Biloba", dose: "120 مغ × 2", timing: "ابدأ 5 أيام قبل الصعود", note: "يحسن تدفق الدم للدماغ في الارتفاع" },
      { name: "Iron (إذا كنت ناقصاً)", dose: "حسب الفحص", timing: "قبل السفر", note: "ضروري لنقل الأكسجين في الارتفاع" },
      { name: "Vitamin C + E", dose: "1000 مغ + 400 IU", timing: "يومياً", note: "يقلل الإجهاد التأكسدي في الارتفاع" },
    ],
  },
  {
    id: "tropical",
    title: "السفر للمناطق الاستوائية",
    color: "#EF4444",
    icon: "sun.max.fill" as const,
    supplements: [
      { name: "Probiotics", dose: "50 مليار CFU", timing: "ابدأ أسبوع قبل السفر", note: "أهم مكمل للوقاية من إسهال المسافر" },
      { name: "Vitamin D3", dose: "4000 IU", timing: "يومياً", note: "يدعم المناعة ضد الأمراض الاستوائية" },
      { name: "Artemisinin (استشر طبيبك)", dose: "حسب التوجيه الطبي", timing: "حسب التوجيه", note: "للوقاية من الملاريا في المناطق الموبوءة" },
      { name: "Quercetin", dose: "500 مغ", timing: "يومياً", note: "مضاد فيروسي وبكتيري طبيعي" },
    ],
  },
];

export default function TravelSupplementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>("jetlag");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0a1628", borderBottomColor: "#1a2e4a" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#93c5fd" />
          <Text style={[styles.backText, { color: "#93c5fd" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>مكملات المسافر</Text>
        <Text style={[styles.headerSub, { color: "#93c5fd" }]}>دليل شامل للسفر الصحي</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {TRAVEL_PROTOCOLS.map((protocol) => (
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
                {"steps" in protocol ? (
                  (protocol.steps ?? []).map((step, si) => (
                    <View key={si}>
                      <Text style={[styles.stepTitle, { color: protocol.color }]}>{step.phase}</Text>
                      {step.supplements.map((supp, i) => (
                        <View key={i} style={[styles.suppCard, { backgroundColor: protocol.color + "06", borderColor: protocol.color + "20", marginTop: 6 }]}>
                          <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                          <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose}</Text>
                          <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
                        </View>
                      ))}
                    </View>
                  ))
                ) : (
                  protocol.supplements.map((supp, i) => (
                    <View key={i} style={[styles.suppCard, { backgroundColor: protocol.color + "06", borderColor: protocol.color + "20" }]}>
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                      <Text style={[styles.suppDose, { color: protocol.color }]}>{supp.dose}</Text>
                      {"timing" in supp && <Text style={[styles.suppTiming, { color: colors.muted }]}>التوقيت: {supp.timing}</Text>}
                      <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
                    </View>
                  ))
                )}
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
  protocolCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  protocolTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  protocolIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  stepTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", marginTop: 4, fontFamily: "Cairo-Black" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppTiming: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
