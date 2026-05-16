/**
 * بروتوكول إزالة السموم والتطهير الطبيعي
 * Feature: 88
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const DETOX_ORGANS = [
  {
    organ: "الكبد",
    icon: "❤️",
    color: "#EF4444",
    phase1: ["NAC", "Milk Thistle", "Alpha Lipoic Acid", "Vitamin C", "B-Complex"],
    phase2: ["Glycine", "Taurine", "Glutamine", "Sulfur Foods", "Cruciferous Vegetables"],
    tips: "تجنب الكحول والأدوية غير الضرورية. شرب 2-3 لتر ماء يومياً.",
  },
  {
    organ: "الكلى",
    icon: "🫘",
    color: "#3B82F6",
    phase1: ["Vitamin C", "Cranberry Extract", "Dandelion Root", "Nettle Leaf"],
    phase2: ["Magnesium", "Potassium", "Hydration"],
    tips: "شرب الماء الكافي هو أفضل دعم للكلى. تجنب الإفراط في البروتين.",
  },
  {
    organ: "الجهاز الليمفاوي",
    icon: "🔵",
    color: "#8B5CF6",
    phase1: ["Astragalus", "Echinacea", "Cat's Claw", "Cleavers"],
    phase2: ["Exercise", "Dry Brushing", "Massage"],
    tips: "التمرين والحركة ضروريان لتدفق الليمف. الجلسات الساخنة والباردة تساعد.",
  },
  {
    organ: "الأمعاء",
    icon: "🌿",
    color: "#10B981",
    phase1: ["Probiotics", "Prebiotics", "Psyllium Husk", "Activated Charcoal"],
    phase2: ["Glutamine", "Zinc Carnosine", "Slippery Elm", "Aloe Vera"],
    tips: "الألياف والبروبيوتيك أساسيان. تجنب الأطعمة المصنعة والسكر.",
  },
];

const HEAVY_METALS_PROTOCOL = [
  { metal: "الرصاص (Lead)", sources: "دهانات قديمة، مياه الصنبور، بعض الأطعمة", chelators: ["DMSA (بوصفة طبية)", "Chlorella", "Cilantro", "Pectin"], color: "#6366F1" },
  { metal: "الزئبق (Mercury)", sources: "الأسماك الكبيرة، حشوات الأسنان القديمة", chelators: ["DMSA (بوصفة طبية)", "Chlorella", "NAC", "Selenium"], color: "#8B5CF6" },
  { metal: "الكادميوم (Cadmium)", sources: "التدخين، بعض الأطعمة", chelators: ["Zinc", "Selenium", "Vitamin C", "NAC"], color: "#F59E0B" },
  { metal: "الألومنيوم (Aluminum)", sources: "مضادات التعرق، أواني الطهي، بعض الأدوية", chelators: ["Silica", "Malic Acid", "Curcumin"], color: "#EF4444" },
];

export default function DetoxProtocolScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeOrgan, setActiveOrgan] = useState(0);
  const [expandedMetal, setExpandedMetal] = useState<number | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>بروتوكول إزالة السموم 🌿</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>دعم أعضاء الإخراج والتطهير الطبيعي</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.infoCard, { backgroundColor: "#10B98110", borderColor: "#10B98130" }]}>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            💡 الجسم يمتلك أنظمة إزالة سموم طبيعية فعّالة. هدف هذه المكملات هو دعم هذه الأنظمة وليس "تطهير" الجسم من الخارج.
          </Text>
        </View>

        {/* Organ Selector */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>دعم أعضاء الإخراج</Text>
        <View style={styles.organSelector}>
          {DETOX_ORGANS.map((organ, i) => (
            <Pressable
              key={i}
              style={[styles.organBtn, {
                backgroundColor: activeOrgan === i ? organ.color : colors.surface,
                borderColor: organ.color + "50",
              }]}
              onPress={() => setActiveOrgan(i)}
            >
              <Text style={styles.organEmoji}>{organ.icon}</Text>
              <Text style={[styles.organBtnText, { color: activeOrgan === i ? "#fff" : organ.color }]}>
                {organ.organ}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Active Organ Detail */}
        <View style={[styles.organCard, { backgroundColor: colors.surface, borderColor: DETOX_ORGANS[activeOrgan].color + "30" }]}>
          <Text style={[styles.organTitle, { color: DETOX_ORGANS[activeOrgan].color }]}>
            {DETOX_ORGANS[activeOrgan].icon} دعم {DETOX_ORGANS[activeOrgan].organ}
          </Text>
          
          <Text style={[styles.phaseLabel, { color: colors.foreground }]}>المرحلة الأولى (التنشيط)</Text>
          <View style={styles.chipRow}>
            {DETOX_ORGANS[activeOrgan].phase1.map((s, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: DETOX_ORGANS[activeOrgan].color + "15", borderColor: DETOX_ORGANS[activeOrgan].color + "30" }]}>
                <Text style={[styles.chipText, { color: DETOX_ORGANS[activeOrgan].color }]}>{s}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.phaseLabel, { color: colors.foreground }]}>المرحلة الثانية (الإخراج)</Text>
          <View style={styles.chipRow}>
            {DETOX_ORGANS[activeOrgan].phase2.map((s, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: "#10B98115", borderColor: "#10B98130" }]}>
                <Text style={[styles.chipText, { color: "#10B981" }]}>{s}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.tipsCard, { backgroundColor: DETOX_ORGANS[activeOrgan].color + "08" }]}>
            <Text style={[styles.tipsText, { color: colors.foreground }]}>💡 {DETOX_ORGANS[activeOrgan].tips}</Text>
          </View>
        </View>

        {/* Heavy Metals */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>إزالة المعادن الثقيلة</Text>
        <View style={[styles.warningCard, { backgroundColor: "#F59E0B10", borderColor: "#F59E0B30" }]}>
          <Text style={[styles.warningText, { color: colors.foreground }]}>
            ⚠️ إزالة المعادن الثقيلة الطبية (Chelation) تتطلب إشراف طبي متخصص. المكملات المذكورة هي دعم خفيف فقط.
          </Text>
        </View>

        {HEAVY_METALS_PROTOCOL.map((metal, i) => (
          <Pressable
            key={i}
            style={[styles.metalCard, { backgroundColor: colors.surface, borderColor: metal.color + "30" }]}
            onPress={() => setExpandedMetal(expandedMetal === i ? null : i)}
          >
            <View style={styles.metalHeader}>
              <IconSymbol name={expandedMetal === i ? "chevron.down" : "chevron.right"} size={14} color={colors.muted} />
              <Text style={[styles.metalName, { color: colors.foreground }]}>{metal.metal}</Text>
              <Text style={[styles.metalSources, { color: colors.muted }]}>{metal.sources}</Text>
            </View>
            {expandedMetal === i && (
              <View style={{ gap: 8, marginTop: 8 }}>
                <Text style={[styles.chelatorLabel, { color: colors.foreground }]}>مواد الربط والإزالة:</Text>
                <View style={styles.chipRow}>
                  {metal.chelators.map((c, j) => (
                    <View key={j} style={[styles.chip, { backgroundColor: metal.color + "15", borderColor: metal.color + "30" }]}>
                      <Text style={[styles.chipText, { color: metal.color }]}>{c}</Text>
                    </View>
                  ))}
                </View>
              </View>
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
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  infoText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  organSelector: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  organBtn: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", minWidth: "45%" },
  organEmoji: { fontSize: 20, fontFamily: "Cairo" },
  organBtnText: { fontSize: 11, fontWeight: "800", marginTop: 2, fontFamily: "Cairo-Black" },
  organCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  organTitle: { fontSize: 16, fontWeight: "900", textAlign: "right", fontFamily: "Cairo-Black" },
  phaseLabel: { fontSize: 12, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  chipRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 11, fontWeight: "600", fontFamily: "Cairo-Bold" },
  tipsCard: { borderRadius: 10, padding: 10 },
  tipsText: { fontSize: 11, lineHeight: 16, textAlign: "right", fontFamily: "Cairo" },
  warningCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  metalCard: { borderRadius: 14, borderWidth: 1, padding: 12 },
  metalHeader: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8 },
  metalName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  metalSources: { fontSize: 10, textAlign: "right", flex: 1, fontFamily: "Cairo" },
  chelatorLabel: { fontSize: 12, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
});
