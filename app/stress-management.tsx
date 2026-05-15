/**
 * إدارة التوتر والصحة النفسية بالمكملات
 * Features #57, #58, #59
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const STRESS_SUPPLEMENTS = [
  {
    name: "Ashwagandha KSM-66",
    dose: "600 mg يومياً",
    mechanism: "يخفض الكورتيزول بنسبة 27-30%",
    evidence: "قوي جداً",
    timing: "مع الطعام",
    timeToEffect: "2-4 أسابيع",
    color: "#8B5CF6",
    benefits: ["تقليل التوتر والقلق", "تحسين النوم", "دعم الطاقة", "تحسين التركيز"],
  },
  {
    name: "L-Theanine",
    dose: "200-400 mg",
    mechanism: "يرفع GABA والسيروتونين",
    evidence: "قوي",
    timing: "عند الحاجة أو مع الكافيين",
    timeToEffect: "30-60 دقيقة",
    color: "#10B981",
    benefits: ["هدوء بدون نعاس", "تحسين التركيز", "تقليل القلق", "تحسين جودة النوم"],
  },
  {
    name: "المغنيسيوم Glycinate",
    dose: "400 mg مساءً",
    mechanism: "يثبط NMDA ويرفع GABA",
    evidence: "قوي",
    timing: "قبل النوم",
    timeToEffect: "1-2 أسبوع",
    color: "#6366F1",
    benefits: ["تقليل القلق", "تحسين النوم", "تقليل توتر العضلات", "تحسين المزاج"],
  },
  {
    name: "Rhodiola Rosea",
    dose: "400-600 mg صباحاً",
    mechanism: "يعدل محور HPA ويقلل الكورتيزول",
    evidence: "متوسط-قوي",
    timing: "الصباح على معدة فارغة",
    timeToEffect: "1-3 أسابيع",
    color: "#F59E0B",
    benefits: ["مقاومة الإرهاق الجسدي والذهني", "تحسين المزاج", "تقليل الاكتئاب الخفيف", "تحسين الأداء"],
  },
  {
    name: "أوميغا-3 EPA",
    dose: "2-3 g EPA يومياً",
    mechanism: "يقلل الالتهاب العصبي ويدعم السيروتونين",
    evidence: "قوي للاكتئاب",
    timing: "مع الطعام",
    timeToEffect: "4-8 أسابيع",
    color: "#0EA5E9",
    benefits: ["تقليل الاكتئاب", "تحسين المزاج", "تقليل الالتهاب", "دعم الدماغ"],
  },
  {
    name: "فيتامين D3",
    dose: "5000 IU يومياً",
    mechanism: "يدعم إنتاج السيروتونين والدوبامين",
    evidence: "قوي (خاصة عند النقص)",
    timing: "الصباح مع الدهون",
    timeToEffect: "4-8 أسابيع",
    color: "#F59E0B",
    benefits: ["تحسين المزاج", "تقليل الاكتئاب الموسمي", "تحسين الطاقة", "دعم المناعة"],
  },
];

const STRESS_LEVELS = [
  {
    level: "توتر خفيف",
    color: "#10B981",
    description: "ضغط يومي طبيعي، صعوبة في التركيز أحياناً",
    protocol: ["L-Theanine 200 mg", "المغنيسيوم 400 mg مساءً", "فيتامين D3 2000 IU"],
  },
  {
    level: "توتر متوسط",
    color: "#F59E0B",
    description: "قلق ملحوظ، صعوبة في النوم، إرهاق مزمن",
    protocol: ["Ashwagandha 600 mg", "L-Theanine 200-400 mg", "المغنيسيوم Glycinate 400 mg", "أوميغا-3 EPA 2 g"],
  },
  {
    level: "توتر شديد",
    color: "#EF4444",
    description: "قلق حاد، أرق، إرهاق تام، مزاج منخفض",
    protocol: ["Ashwagandha KSM-66 600 mg", "Rhodiola Rosea 400 mg صباحاً", "L-Theanine 400 mg", "المغنيسيوم L-Threonate 2000 mg", "أوميغا-3 EPA 3 g", "فيتامين D3 5000 IU", "استشر طبيباً أو معالجاً نفسياً"],
  },
];

export default function StressManagementScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"supplements" | "protocol">("supplements");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>إدارة التوتر والقلق</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>مكملات علمية لدعم الصحة النفسية</Text>
        </View>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {[
          { id: "supplements", label: "المكملات" },
          { id: "protocol", label: "بروتوكول حسب الشدة" },
        ].map(tab => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {activeTab === "supplements" && STRESS_SUPPLEMENTS.map((supp, i) => (
          <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.suppHeader}>
              <View style={[styles.evidenceBadge, { backgroundColor: supp.color + "15" }]}>
                <Text style={[styles.evidenceText, { color: supp.color }]}>دليل: {supp.evidence}</Text>
              </View>
              <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
            </View>
            <View style={styles.metaRow}>
              <View style={[styles.metaBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.metaText, { color: colors.muted }]}>⏱ {supp.timeToEffect}</Text>
              </View>
              <View style={[styles.metaBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.metaText, { color: colors.muted }]}>💊 {supp.dose}</Text>
              </View>
            </View>
            <Text style={[styles.mechanism, { color: colors.muted }]}>{supp.mechanism}</Text>
            <View style={styles.benefitsRow}>
              {supp.benefits.map((b, bi) => (
                <View key={bi} style={[styles.benefitTag, { backgroundColor: supp.color + "10" }]}>
                  <Text style={[styles.benefitText, { color: supp.color }]}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {activeTab === "protocol" && STRESS_LEVELS.map((level, i) => (
          <View key={i} style={[styles.levelCard, { backgroundColor: colors.surface, borderColor: level.color + "40" }]}>
            <View style={[styles.levelHeader, { backgroundColor: level.color + "15" }]}>
              <Text style={[styles.levelTitle, { color: level.color }]}>{level.level}</Text>
            </View>
            <Text style={[styles.levelDesc, { color: colors.muted }]}>{level.description}</Text>
            <View style={styles.protocolList}>
              {level.protocol.map((item, pi) => (
                <View key={pi} style={styles.protocolItem}>
                  <IconSymbol name="checkmark.circle.fill" size={14} color={level.color} />
                  <Text style={[styles.protocolText, { color: colors.foreground }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
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
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontWeight: "700" },
  suppCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  suppHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  suppName: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700" },
  metaRow: { flexDirection: "row-reverse", gap: 8 },
  metaBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  metaText: { fontSize: 11 },
  mechanism: { fontSize: 12, textAlign: "right" },
  benefitsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  benefitTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  benefitText: { fontSize: 11, fontWeight: "700" },
  levelCard: { borderRadius: 16, overflow: "hidden", borderWidth: 1 },
  levelHeader: { padding: 12 },
  levelTitle: { fontSize: 16, fontWeight: "900", textAlign: "right" },
  levelDesc: { fontSize: 12, textAlign: "right", paddingHorizontal: 12, paddingTop: 8 },
  protocolList: { padding: 12, gap: 8 },
  protocolItem: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  protocolText: { fontSize: 13, textAlign: "right", flex: 1 },
});
