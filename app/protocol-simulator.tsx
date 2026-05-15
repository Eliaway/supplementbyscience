/**
 * محاكاة بروتوكول المكملات
 * Feature #97: Protocol simulation and planning
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface ProtocolStep {
  time: string;
  supplements: { name: string; dose: string; note?: string }[];
}

interface SimulatedProtocol {
  id: string;
  title: string;
  goal: string;
  duration: string;
  difficulty: "سهل" | "متوسط" | "متقدم";
  color: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  steps: ProtocolStep[];
  expectedResults: string[];
  warnings: string[];
  monthlyCost: string;
}

const PROTOCOLS: SimulatedProtocol[] = [
  {
    id: "energy",
    title: "بروتوكول الطاقة والحيوية",
    goal: "رفع مستوى الطاقة وتقليل الإرهاق",
    duration: "8 أسابيع",
    difficulty: "سهل",
    color: "#F59E0B",
    icon: "bolt.fill",
    steps: [
      { time: "الصباح مع الإفطار", supplements: [
        { name: "فيتامين D3 5000 IU", dose: "1 كبسولة", note: "مع الدهون" },
        { name: "فيتامين B12 Methylcobalamin", dose: "1000 mcg", note: "تحت اللسان" },
        { name: "CoQ10 Ubiquinol", dose: "200 mg", note: "مع الدهون" },
      ]},
      { time: "قبل التمرين بساعة", supplements: [
        { name: "L-Carnitine", dose: "2 g", note: "مع الكربوهيدرات" },
        { name: "Rhodiola Rosea", dose: "500 mg" },
      ]},
      { time: "المساء مع العشاء", supplements: [
        { name: "المغنيسيوم Glycinate", dose: "400 mg", note: "يحسن النوم" },
        { name: "أوميغا-3", dose: "2 g" },
      ]},
    ],
    expectedResults: ["تحسن الطاقة خلال 2-3 أسابيع", "تقليل الإرهاق بنسبة 40-60%", "تحسن جودة النوم", "تحسن الأداء الرياضي"],
    warnings: ["تجنب CoQ10 مع مضادات التخثر", "B12 قد يسبب أرقاً إذا أُخذ مساءً"],
    monthlyCost: "250-400 ريال",
  },
  {
    id: "brain",
    title: "بروتوكول تحسين الدماغ",
    goal: "تعزيز الذاكرة والتركيز والوظائف المعرفية",
    duration: "12 أسبوع",
    difficulty: "متوسط",
    color: "#8B5CF6",
    icon: "brain",
    steps: [
      { time: "الصباح مع الإفطار", supplements: [
        { name: "أوميغا-3 DHA عالي", dose: "2 g DHA", note: "أساسي للدماغ" },
        { name: "فيتامين D3", dose: "5000 IU" },
        { name: "Lion's Mane", dose: "1000 mg" },
      ]},
      { time: "قبل الدراسة أو العمل", supplements: [
        { name: "L-Theanine", dose: "200 mg", note: "مع كافيين 100 mg" },
        { name: "Bacopa Monnieri", dose: "300 mg", note: "يحتاج 8 أسابيع لتأثير كامل" },
      ]},
      { time: "المساء", supplements: [
        { name: "المغنيسيوم L-Threonate", dose: "2000 mg", note: "يعبر حاجز الدم-الدماغ" },
        { name: "Phosphatidylserine", dose: "300 mg" },
      ]},
    ],
    expectedResults: ["تحسن الذاكرة قصيرة المدى", "زيادة التركيز والانتباه", "تقليل ضبابية الذهن", "تحسن المزاج والدافعية"],
    warnings: ["Bacopa يسبب نعاساً في البداية", "تجنب مع مضادات الاكتئاب بدون استشارة طبيب"],
    monthlyCost: "350-550 ريال",
  },
  {
    id: "hormones",
    title: "بروتوكول تحسين الهرمونات الذكورية",
    goal: "دعم مستويات التستوستيرون الطبيعية",
    duration: "16 أسبوع",
    difficulty: "متقدم",
    color: "#EF4444",
    icon: "flame.fill",
    steps: [
      { time: "الصباح مع الإفطار", supplements: [
        { name: "فيتامين D3 + K2", dose: "5000 IU D3 + 200 mcg K2" },
        { name: "الزنك Bisglycinate", dose: "30 mg", note: "لا تتجاوز 40 mg يومياً" },
        { name: "المغنيسيوم", dose: "400 mg" },
      ]},
      { time: "قبل التمرين", supplements: [
        { name: "Ashwagandha KSM-66", dose: "600 mg", note: "يخفض الكورتيزول" },
        { name: "Tongkat Ali", dose: "200 mg", note: "مستخلص 100:1" },
      ]},
      { time: "المساء", supplements: [
        { name: "Boron Glycinate", dose: "10 mg", note: "يحرر التستوستيرون الحر" },
        { name: "أوميغا-3", dose: "3 g" },
      ]},
    ],
    expectedResults: ["رفع التستوستيرون الحر 20-30%", "تحسن الطاقة والقوة", "تحسن الرغبة الجنسية", "تحسن تكوين الجسم"],
    warnings: ["استشر طبيباً إذا كانت لديك مشاكل هرمونية", "لا تُستخدم مع علاجات هرمونية", "راقب مستويات الهرمونات كل 3 أشهر"],
    monthlyCost: "400-600 ريال",
  },
  {
    id: "sleep",
    title: "بروتوكول النوم العميق",
    goal: "تحسين جودة النوم وعمقه",
    duration: "4 أسابيع",
    difficulty: "سهل",
    color: "#6366F1",
    icon: "moon.zzz.fill",
    steps: [
      { time: "ساعتان قبل النوم", supplements: [
        { name: "المغنيسيوم Glycinate", dose: "400 mg", note: "الأفضل للنوم" },
        { name: "L-Theanine", dose: "200 mg", note: "يهدئ الذهن" },
      ]},
      { time: "30 دقيقة قبل النوم", supplements: [
        { name: "الميلاتونين", dose: "0.5-1 mg", note: "جرعة منخفضة أفضل" },
        { name: "Glycine", dose: "3 g", note: "يخفض درجة حرارة الجسم" },
      ]},
    ],
    expectedResults: ["تقليل وقت النوم إلى أقل من 20 دقيقة", "تقليل الاستيقاظ الليلي", "تحسن جودة النوم العميق", "الاستيقاظ بنشاط"],
    warnings: ["الميلاتونين قد يسبب أحلاماً حيوية", "لا تقد السيارة بعد أخذ الجرعة"],
    monthlyCost: "150-250 ريال",
  },
];

export default function ProtocolSimulatorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedProtocol, setSelectedProtocol] = useState<SimulatedProtocol | null>(null);

  if (selectedProtocol) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedProtocol(null)}>
            <IconSymbol name="chevron.right" size={22} color={colors.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{selectedProtocol.title}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <View style={[styles.protocolBanner, { backgroundColor: selectedProtocol.color + "15", borderColor: selectedProtocol.color + "30" }]}>
            <IconSymbol name={selectedProtocol.icon} size={32} color={selectedProtocol.color} />
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={[styles.protocolGoal, { color: colors.foreground }]}>{selectedProtocol.goal}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.metaBadge, { backgroundColor: selectedProtocol.color + "20" }]}>
                  <Text style={[styles.metaText, { color: selectedProtocol.color }]}>{selectedProtocol.duration}</Text>
                </View>
                <View style={[styles.metaBadge, { backgroundColor: selectedProtocol.color + "20" }]}>
                  <Text style={[styles.metaText, { color: selectedProtocol.color }]}>{selectedProtocol.difficulty}</Text>
                </View>
                <View style={[styles.metaBadge, { backgroundColor: selectedProtocol.color + "20" }]}>
                  <Text style={[styles.metaText, { color: selectedProtocol.color }]}>{selectedProtocol.monthlyCost}</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>جدول البروتوكول اليومي</Text>
          {selectedProtocol.steps.map((step, si) => (
            <View key={si} style={[styles.stepCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.stepTime, { backgroundColor: selectedProtocol.color + "15" }]}>
                <IconSymbol name="clock.fill" size={14} color={selectedProtocol.color} />
                <Text style={[styles.stepTimeText, { color: selectedProtocol.color }]}>{step.time}</Text>
              </View>
              {step.supplements.map((supp, i) => (
                <View key={i} style={[styles.suppItem, { borderTopColor: colors.border }]}>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={[styles.suppItemName, { color: colors.foreground }]}>{supp.name}</Text>
                    {supp.note && <Text style={[styles.suppItemNote, { color: colors.muted }]}>{supp.note}</Text>}
                  </View>
                  <View style={[styles.doseBadge, { backgroundColor: colors.primary + "15" }]}>
                    <Text style={[styles.doseText, { color: colors.primary }]}>{supp.dose}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>النتائج المتوقعة</Text>
          {selectedProtocol.expectedResults.map((result, i) => (
            <View key={i} style={[styles.resultRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={[styles.resultText, { color: colors.foreground }]}>{result}</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>تحذيرات مهمة</Text>
          {selectedProtocol.warnings.map((warning, i) => (
            <View key={i} style={[styles.warningRow, { backgroundColor: colors.warning + "10", borderColor: colors.warning + "30" }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
              <Text style={[styles.warningText, { color: colors.foreground }]}>{warning}</Text>
            </View>
          ))}

          <Pressable
            style={[styles.startBtn, { backgroundColor: selectedProtocol.color }]}
            onPress={() => router.push("/(tabs)/profile" as any)}
          >
            <IconSymbol name="play.fill" size={18} color="#fff" />
            <Text style={styles.startBtnText}>ابدأ هذا البروتوكول</Text>
          </Pressable>
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>محاكاة البروتوكول</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>اختر بروتوكولاً وشاهد جدوله اليومي</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {PROTOCOLS.map(protocol => (
          <Pressable
            key={protocol.id}
            style={[styles.protocolCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setSelectedProtocol(protocol)}
          >
            <View style={[styles.protocolIcon, { backgroundColor: protocol.color + "15" }]}>
              <IconSymbol name={protocol.icon} size={28} color={protocol.color} />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{protocol.title}</Text>
              <Text style={[styles.protocolGoalSmall, { color: colors.muted }]}>{protocol.goal}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.metaBadge, { backgroundColor: protocol.color + "15" }]}>
                  <Text style={[styles.metaText, { color: protocol.color }]}>{protocol.duration}</Text>
                </View>
                <View style={[styles.metaBadge, { backgroundColor: protocol.color + "15" }]}>
                  <Text style={[styles.metaText, { color: protocol.color }]}>{protocol.difficulty}</Text>
                </View>
              </View>
            </View>
            <IconSymbol name="chevron.left" size={16} color={colors.muted} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  protocolCard: { borderRadius: 16, padding: 14, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  protocolIcon: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  protocolTitle: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  protocolGoalSmall: { fontSize: 12, textAlign: "right" },
  metaRow: { flexDirection: "row-reverse", gap: 6, flexWrap: "wrap" },
  metaBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  metaText: { fontSize: 11, fontWeight: "700" },
  protocolBanner: { borderRadius: 16, padding: 16, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  protocolGoal: { fontSize: 14, fontWeight: "700", textAlign: "right", marginBottom: 8 },
  stepCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 0 },
  stepTime: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingBottom: 10, marginBottom: 4 },
  stepTimeText: { fontSize: 13, fontWeight: "800" },
  suppItem: { flexDirection: "row-reverse", alignItems: "center", gap: 10, paddingVertical: 8, borderTopWidth: 0.5 },
  suppItemName: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  suppItemNote: { fontSize: 11, textAlign: "right" },
  doseBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  doseText: { fontSize: 12, fontWeight: "700" },
  resultRow: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  resultText: { flex: 1, fontSize: 13, textAlign: "right" },
  warningRow: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  warningText: { flex: 1, fontSize: 13, textAlign: "right" },
  startBtn: { borderRadius: 14, padding: 16, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8 },
  startBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
