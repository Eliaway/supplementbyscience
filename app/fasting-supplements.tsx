/**
 * بروتوكولات الصيام المتقطع والمكملات
 * Feature #40: Intermittent fasting and supplements
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const FASTING_PROTOCOLS = [
  {
    id: "16_8",
    name: "16:8 (الأكثر شيوعاً)",
    fasting: "16 ساعة صيام",
    eating: "8 ساعات أكل",
    example: "12 ظهراً - 8 مساءً",
    color: "#10B981",
    difficulty: "سهل",
    benefits: ["حرق الدهون", "تحسين حساسية الأنسولين", "تحفيز الأوتوفاجي الخفيف"],
    supplements: {
      duringFast: [
        { name: "الكافيين", dose: "100-200 mg", note: "لا يكسر الصيام، يعزز الحرق" },
        { name: "الملح الوردي", dose: "1/4 ملعقة صغيرة في الماء", note: "يمنع الصداع" },
        { name: "L-Tyrosine", dose: "500 mg", note: "يحسن التركيز أثناء الصيام" },
      ],
      breakFast: [
        { name: "أوميغا-3", dose: "2 g", note: "مع أول وجبة" },
        { name: "فيتامين D3 + K2", dose: "5000 IU", note: "مع الدهون" },
        { name: "المغنيسيوم", dose: "400 mg", note: "مع الطعام" },
      ],
    },
  },
  {
    id: "18_6",
    name: "18:6",
    fasting: "18 ساعة صيام",
    eating: "6 ساعات أكل",
    example: "2 ظهراً - 8 مساءً",
    color: "#3B82F6",
    difficulty: "متوسط",
    benefits: ["حرق دهون أعمق", "تحفيز الأوتوفاجي المتوسط", "تحسين الحساسية للأنسولين"],
    supplements: {
      duringFast: [
        { name: "الكافيين", dose: "100-200 mg", note: "لا يكسر الصيام" },
        { name: "الملح + البوتاسيوم", dose: "حسب الحاجة", note: "يمنع الإرهاق" },
        { name: "Berberine", dose: "500 mg", note: "يعزز حساسية الأنسولين" },
      ],
      breakFast: [
        { name: "البروتين عالي الجودة", dose: "30-40 g", note: "أول شيء عند كسر الصيام" },
        { name: "أوميغا-3", dose: "3 g" },
        { name: "الزنك", dose: "30 mg" },
      ],
    },
  },
  {
    id: "omad",
    name: "OMAD (وجبة واحدة)",
    fasting: "23 ساعة صيام",
    eating: "ساعة واحدة أكل",
    example: "وجبة واحدة في الساعة 6 مساءً",
    color: "#8B5CF6",
    difficulty: "متقدم",
    benefits: ["أقصى حرق للدهون", "تحفيز الأوتوفاجي القوي", "تحسين الوضوح الذهني"],
    supplements: {
      duringFast: [
        { name: "الكافيين + L-Theanine", dose: "100 mg + 200 mg", note: "يحسن التركيز" },
        { name: "الملح الوردي + المغنيسيوم", dose: "حسب الحاجة", note: "ضروري جداً" },
        { name: "Exogenous Ketones", dose: "حسب التعليمات", note: "يدعم الطاقة" },
      ],
      breakFast: [
        { name: "البروتين الكامل", dose: "50-60 g", note: "ضروري لمنع فقدان العضلات" },
        { name: "جميع الفيتامينات والمعادن", dose: "الجرعة اليومية", note: "في الوجبة الوحيدة" },
        { name: "الكريتين", dose: "5 g", note: "للحفاظ على العضلات" },
      ],
    },
  },
];

const SUPPLEMENTS_THAT_BREAK_FAST = [
  { name: "البروتين (مسحوق أو شيك)", breaks: true, reason: "يرفع الأنسولين ويوقف الأوتوفاجي" },
  { name: "الأحماض الأمينية BCAA", breaks: true, reason: "تحفز mTOR وترفع الأنسولين" },
  { name: "الكافيين (قهوة سوداء)", breaks: false, reason: "لا يرفع الأنسولين بشكل معتبر" },
  { name: "الكريتين", breaks: false, reason: "لا يرفع الأنسولين" },
  { name: "الفيتامينات المذابة في الماء", breaks: false, reason: "لا تأثير على الأنسولين" },
  { name: "الفيتامينات المذابة في الدهون", breaks: true, reason: "تحتاج دهون للامتصاص وتحفز الهضم" },
  { name: "الكولاجين", breaks: true, reason: "يحتوي على أحماض أمينية ترفع الأنسولين قليلاً" },
  { name: "MCT Oil", breaks: false, reason: "يحفز الكيتونات ولا يرفع الأنسولين بشكل معتبر" },
  { name: "الملح والمعادن", breaks: false, reason: "ضروري لمنع الإرهاق ولا يكسر الصيام" },
];

export default function FastingSupplementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedProtocol, setSelectedProtocol] = useState<typeof FASTING_PROTOCOLS[0] | null>(null);
  const [activeTab, setActiveTab] = useState<"protocols" | "breaks">("protocols");

  if (selectedProtocol) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedProtocol(null)}>
            <IconSymbol name="chevron.right" size={22} color={colors.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{selectedProtocol.name}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <View style={[styles.protocolBanner, { backgroundColor: selectedProtocol.color + "15", borderColor: selectedProtocol.color + "30" }]}>
            <View style={styles.timeRow}>
              <View style={[styles.timeBadge, { backgroundColor: selectedProtocol.color }]}>
                <Text style={styles.timeBadgeText}>{selectedProtocol.fasting}</Text>
              </View>
              <View style={[styles.timeBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.timeBadgeText}>{selectedProtocol.eating}</Text>
              </View>
            </View>
            <Text style={[styles.exampleText, { color: colors.muted }]}>مثال: {selectedProtocol.example}</Text>
            <View style={[styles.diffBadge, { backgroundColor: selectedProtocol.color + "20" }]}>
              <Text style={[styles.diffText, { color: selectedProtocol.color }]}>صعوبة: {selectedProtocol.difficulty}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الفوائد المتوقعة</Text>
          {selectedProtocol.benefits.map((b, i) => (
            <View key={i} style={[styles.benefitRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={[styles.benefitText, { color: colors.foreground }]}>{b}</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكملات أثناء الصيام</Text>
          {selectedProtocol.supplements.duringFast.map((s, i) => (
            <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
                {s.note && <Text style={[styles.suppNote, { color: colors.muted }]}>{s.note}</Text>}
              </View>
              <View style={[styles.doseBadge, { backgroundColor: colors.primary + "15" }]}>
                <Text style={[styles.doseText, { color: colors.primary }]}>{s.dose}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكملات عند كسر الصيام</Text>
          {selectedProtocol.supplements.breakFast.map((s, i) => (
            <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
                {s.note && <Text style={[styles.suppNote, { color: colors.muted }]}>{s.note}</Text>}
              </View>
              <View style={[styles.doseBadge, { backgroundColor: colors.success + "15" }]}>
                <Text style={[styles.doseText, { color: colors.success }]}>{s.dose}</Text>
              </View>
            </View>
          ))}
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الصيام المتقطع والمكملات</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>أي مكملات تأخذ وأيها تتجنب</Text>
        </View>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {[
          { id: "protocols", label: "البروتوكولات" },
          { id: "breaks", label: "ماذا يكسر الصيام؟" },
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
        {activeTab === "protocols" && FASTING_PROTOCOLS.map(p => (
          <Pressable
            key={p.id}
            style={[styles.protocolCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setSelectedProtocol(p)}
          >
            <View style={[styles.protocolDot, { backgroundColor: p.color }]} />
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.protocolName, { color: colors.foreground }]}>{p.name}</Text>
              <Text style={[styles.protocolDesc, { color: colors.muted }]}>{p.fasting} / {p.eating}</Text>
              <View style={[styles.diffBadge, { backgroundColor: p.color + "15" }]}>
                <Text style={[styles.diffText, { color: p.color }]}>{p.difficulty}</Text>
              </View>
            </View>
            <IconSymbol name="chevron.left" size={16} color={colors.muted} />
          </Pressable>
        ))}

        {activeTab === "breaks" && SUPPLEMENTS_THAT_BREAK_FAST.map((item, i) => (
          <View
            key={i}
            style={[styles.breakCard, { backgroundColor: colors.surface, borderColor: item.breaks ? colors.error + "30" : colors.success + "30" }]}
          >
            <View style={[styles.breakIcon, { backgroundColor: item.breaks ? colors.error + "15" : colors.success + "15" }]}>
              <IconSymbol
                name={item.breaks ? "xmark.circle.fill" : "checkmark.circle.fill"}
                size={20}
                color={item.breaks ? colors.error : colors.success}
              />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.breakName, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.breakReason, { color: colors.muted }]}>{item.reason}</Text>
            </View>
            <View style={[styles.breakBadge, { backgroundColor: item.breaks ? colors.error + "15" : colors.success + "15" }]}>
              <Text style={[styles.breakBadgeText, { color: item.breaks ? colors.error : colors.success }]}>
                {item.breaks ? "يكسر الصيام" : "آمن"}
              </Text>
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
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  protocolCard: { borderRadius: 14, padding: 14, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  protocolDot: { width: 12, height: 12, borderRadius: 6, flexShrink: 0 },
  protocolName: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  protocolDesc: { fontSize: 12, textAlign: "right" },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  diffText: { fontSize: 11, fontWeight: "700" },
  protocolBanner: { borderRadius: 16, padding: 16, borderWidth: 1, alignItems: "center", gap: 10 },
  timeRow: { flexDirection: "row-reverse", gap: 10 },
  timeBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  timeBadgeText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  exampleText: { fontSize: 13, textAlign: "center" },
  benefitRow: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  benefitText: { flex: 1, fontSize: 13, textAlign: "right" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  suppName: { fontSize: 14, fontWeight: "700", textAlign: "right" },
  suppNote: { fontSize: 11, textAlign: "right" },
  doseBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  doseText: { fontSize: 12, fontWeight: "700" },
  breakCard: { borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  breakIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  breakName: { fontSize: 14, fontWeight: "700", textAlign: "right" },
  breakReason: { fontSize: 11, textAlign: "right" },
  breakBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  breakBadgeText: { fontSize: 11, fontWeight: "700" },
});
