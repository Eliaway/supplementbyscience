/**
 * دليل تحسين الامتصاص
 * Feature: 31 (تحسين الامتصاص), 32 (المعززات الطبيعية)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const ABSORPTION_DATA = [
  {
    supplement: "Curcumin (الكركمين)",
    icon: "leaf.fill" as const,
    color: "#F59E0B",
    baseAbsorption: "1%",
    enhancers: [
      { name: "Piperine (فلفل أسود)", boost: "+2000%", mechanism: "يثبط إنزيمات التكسير في الكبد" },
      { name: "دهون صحية", boost: "+300%", mechanism: "يذوب في الدهون" },
      { name: "Lecithin (ليسيثين)", boost: "+500%", mechanism: "يُحسّن الذوبانية" },
    ],
    blockers: ["معدة فارغة تماماً", "الكمية الزائدة من الألياف"],
  },
  {
    supplement: "Vitamin D3",
    icon: "sun.max.fill" as const,
    color: "#F97316",
    baseAbsorption: "60-80%",
    enhancers: [
      { name: "Vitamin K2", boost: "+تآزر", mechanism: "يوجّه الكالسيوم للعظام لا الشرايين" },
      { name: "Magnesium", boost: "+ضروري", mechanism: "يُفعّل إنزيمات تحويل D3" },
      { name: "دهون صحية", boost: "+40%", mechanism: "يذوب في الدهون" },
    ],
    blockers: ["نقص المغنيسيوم", "أدوية الكوليسترول (Statins)"],
  },
  {
    supplement: "Iron (الحديد)",
    icon: "bolt.fill" as const,
    color: "#EF4444",
    baseAbsorption: "10-15%",
    enhancers: [
      { name: "Vitamin C", boost: "+300%", mechanism: "يحوّل Fe3+ إلى Fe2+ الأسهل امتصاصاً" },
      { name: "اللحوم الحمراء", boost: "+تآزر", mechanism: "Heme Iron أسهل امتصاصاً" },
      { name: "حمض الليمون", boost: "+100%", mechanism: "يُكوّن مركبات قابلة للذوبان" },
    ],
    blockers: ["القهوة والشاي (Tannins)", "الكالسيوم", "الألياف الزائدة", "مضادات الحموضة"],
  },
  {
    supplement: "Zinc (الزنك)",
    icon: "shield.fill" as const,
    color: "#8B5CF6",
    baseAbsorption: "20-40%",
    enhancers: [
      { name: "بروتين حيواني", boost: "+50%", mechanism: "يُقلل تأثير Phytates" },
      { name: "Picolinic acid", boost: "+تآزر", mechanism: "شكل Picolinate أفضل امتصاصاً" },
    ],
    blockers: ["Phytates (الحبوب الكاملة)", "الكالسيوم الزائد", "الحديد (تنافس)"],
  },
  {
    supplement: "Magnesium",
    icon: "moon.fill" as const,
    color: "#3B82F6",
    baseAbsorption: "30-50%",
    enhancers: [
      { name: "Vitamin D", boost: "+تآزر", mechanism: "يُحسّن امتصاص المغنيسيوم" },
      { name: "B6 (P5P)", boost: "+تآزر", mechanism: "يُساعد في دخول الخلايا" },
    ],
    blockers: ["الكحول", "الكافيين الزائد", "الإجهاد المزمن (يستنزف المغنيسيوم)"],
  },
  {
    supplement: "Omega-3",
    icon: "drop.fill" as const,
    color: "#0EA5E9",
    baseAbsorption: "60-80%",
    enhancers: [
      { name: "وجبة دهنية", boost: "+50%", mechanism: "يُحسّن الإذابة والامتصاص" },
      { name: "Astaxanthin", boost: "+تآزر", mechanism: "يحمي من الأكسدة" },
    ],
    blockers: ["معدة فارغة (قد يسبب حرقة)", "الحرارة الزائدة (يُفسد الزيت)"],
  },
];

export default function AbsorptionGuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>دليل تحسين الامتصاص</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>معززات وعوائق امتصاص كل مكمل</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {/* Intro */}
        <View style={[styles.infoCard, { backgroundColor: "#3B82F615", borderColor: "#3B82F630" }]}>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            الامتصاص الفعلي للمكملات يختلف كثيراً بناءً على ما تأكله معها. بعض المكملات تزيد فعاليتها 20 ضعفاً مع المعززات الصحيحة.
          </Text>
        </View>

        {ABSORPTION_DATA.map((item) => (
          <View key={item.supplement} style={[styles.card, { backgroundColor: colors.surface, borderColor: item.color + "30" }]}>
            <Pressable
              style={[styles.cardHeader, { backgroundColor: item.color + "10" }]}
              onPress={() => setExpandedId(expandedId === item.supplement ? null : item.supplement)}
            >
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
                <View style={[styles.absorptionBadge, { backgroundColor: item.color + "20" }]}>
                  <Text style={[styles.absorptionText, { color: item.color }]}>{item.baseAbsorption}</Text>
                </View>
                <Text style={[styles.absorptionLabel, { color: colors.muted }]}>امتصاص أساسي</Text>
              </View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.supplement}</Text>
              <View style={[styles.cardIcon, { backgroundColor: item.color + "20" }]}>
                <IconSymbol name={item.icon} size={22} color={item.color} />
              </View>
            </Pressable>

            {expandedId === item.supplement && (
              <View style={{ padding: 12, gap: 10 }}>
                {/* Enhancers */}
                <Text style={[styles.sectionLabel, { color: "#10B981" }]}>✅ المعززات</Text>
                {item.enhancers.map((e, i) => (
                  <View key={i} style={[styles.enhancerRow, { backgroundColor: "#10B98110", borderColor: "#10B98130" }]}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.enhancerMechanism, { color: colors.muted }]}>{e.mechanism}</Text>
                      <Text style={[styles.enhancerName, { color: colors.foreground }]}>{e.name}</Text>
                    </View>
                    <View style={[styles.boostBadge, { backgroundColor: "#10B98120" }]}>
                      <Text style={[styles.boostText, { color: "#10B981" }]}>{e.boost}</Text>
                    </View>
                  </View>
                ))}

                {/* Blockers */}
                <Text style={[styles.sectionLabel, { color: "#EF4444" }]}>❌ العوائق</Text>
                <View style={[styles.blockersCard, { backgroundColor: "#EF444410", borderColor: "#EF444430" }]}>
                  {item.blockers.map((b, i) => (
                    <Text key={i} style={[styles.blockerText, { color: "#EF4444" }]}>• {b}</Text>
                  ))}
                </View>
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
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  infoText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cardHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  cardIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  absorptionBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  absorptionText: { fontSize: 11, fontWeight: "800" },
  absorptionLabel: { fontSize: 10 },
  sectionLabel: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  enhancerRow: { borderRadius: 10, borderWidth: 1, padding: 10, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  enhancerName: { fontSize: 12, fontWeight: "700", textAlign: "right" },
  enhancerMechanism: { fontSize: 11, textAlign: "right" },
  boostBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  boostText: { fontSize: 12, fontWeight: "900" },
  blockersCard: { borderRadius: 10, borderWidth: 1, padding: 10, gap: 4 },
  blockerText: { fontSize: 12, textAlign: "right" },
});
