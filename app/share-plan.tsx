/**
 * مشاركة الخطة الصحية كصورة أو PDF
 * Feature: 27
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const PLAN_SECTIONS = [
  {
    id: "supplements",
    title: "مكملاتي الحالية",
    icon: "pills.fill" as const,
    color: "#3B82F6",
    content: [
      "فيتامين D3 — 5000 IU — صباحاً مع الطعام",
      "أوميغا-3 — 2 غ — مع العشاء",
      "مغنيسيوم جليسينات — 400 مغ — قبل النوم",
      "زنك — 25 مغ — مع الطعام",
    ],
  },
  {
    id: "goals",
    title: "أهدافي الصحية",
    icon: "target" as const,
    color: "#10B981",
    content: [
      "تحسين جودة النوم",
      "زيادة مستوى الطاقة",
      "دعم جهاز المناعة",
      "تحسين التركيز والذاكرة",
    ],
  },
  {
    id: "profile",
    title: "ملفي الصحي",
    icon: "person.fill" as const,
    color: "#8B5CF6",
    content: [
      "العمر: 35 سنة",
      "الوزن: 80 كغ",
      "الطول: 175 سم",
      "مؤشر كتلة الجسم: 26.1 (وزن زائد طفيف)",
    ],
  },
  {
    id: "schedule",
    title: "جدول الجرعات",
    icon: "clock.fill" as const,
    color: "#F59E0B",
    content: [
      "🌅 الصباح: فيتامين D3، فيتامين C، B-Complex",
      "🍽️ مع الغداء: أوميغا-3، CoQ10",
      "🌙 قبل النوم: مغنيسيوم، زنك، ميلاتونين",
    ],
  },
];

export default function SharePlanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedSections, setSelectedSections] = useState<string[]>(["supplements", "goals", "schedule"]);
  const [sharing, setSharing] = useState(false);

  const toggleSection = (id: string) => {
    setSelectedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const generatePlanText = () => {
    const selected = PLAN_SECTIONS.filter(s => selectedSections.includes(s.id));
    let text = "🌿 خطتي الصحية — تطبيق علم المكملات\n";
    text += "═══════════════════════\n\n";
    selected.forEach(section => {
      text += `📌 ${section.title}\n`;
      section.content.forEach(item => {
        text += `  • ${item}\n`;
      });
      text += "\n";
    });
    text += "═══════════════════════\n";
    text += "تم إنشاؤها بواسطة تطبيق علم المكملات 💊";
    return text;
  };

  const sharePlan = async () => {
    if (selectedSections.length === 0) return;
    setSharing(true);
    try {
      const text = generatePlanText();
      await Share.share({
        message: text,
        title: "خطتي الصحية",
      });
    } catch {}
    setSharing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>مشاركة الخطة الصحية 📤</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>شارك خطتك مع طبيبك أو صيدلانيك</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.tipCard, { backgroundColor: "#3B82F615", borderColor: "#3B82F630" }]}>
          <Text style={[styles.tipText, { color: colors.foreground }]}>
            💡 اختر الأقسام التي تريد مشاركتها، ثم أرسلها لطبيبك أو صيدلانيك للمراجعة
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>اختر الأقسام للمشاركة</Text>

        {PLAN_SECTIONS.map((section) => {
          const selected = selectedSections.includes(section.id);
          return (
            <Pressable
              key={section.id}
              style={[styles.sectionCard, {
                backgroundColor: selected ? section.color + "10" : colors.surface,
                borderColor: selected ? section.color : colors.border,
              }]}
              onPress={() => toggleSection(section.id)}
            >
              <View style={styles.sectionHeader}>
                <View style={[styles.checkbox, {
                  backgroundColor: selected ? section.color : "transparent",
                  borderColor: selected ? section.color : colors.border,
                }]}>
                  {selected && <IconSymbol name="checkmark" size={12} color="#fff" />}
                </View>
                <Text style={[styles.sectionName, { color: colors.foreground }]}>{section.title}</Text>
                <View style={[styles.sectionIcon, { backgroundColor: section.color + "20" }]}>
                  <IconSymbol name={section.icon} size={20} color={section.color} />
                </View>
              </View>
              {selected && (
                <View style={{ gap: 4, marginTop: 8 }}>
                  {section.content.map((item, i) => (
                    <Text key={i} style={[styles.contentItem, { color: colors.muted }]}>• {item}</Text>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}

        <View style={styles.shareOptions}>
          <Pressable
            style={[styles.shareBtn, { backgroundColor: colors.primary, opacity: selectedSections.length === 0 || sharing ? 0.5 : 1 }]}
            onPress={sharePlan}
            disabled={selectedSections.length === 0 || sharing}
          >
            <IconSymbol name="paperplane.fill" size={18} color="#fff" />
            <Text style={styles.shareBtnText}>{sharing ? "جاري المشاركة..." : "مشاركة الخطة"}</Text>
          </Pressable>

          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>📋 كيف تستخدم هذه الميزة؟</Text>
            <Text style={[styles.infoText, { color: colors.muted }]}>
              1. اختر الأقسام التي تريد مشاركتها{"\n"}
              2. اضغط "مشاركة الخطة"{"\n"}
              3. اختر التطبيق (واتساب، بريد إلكتروني، رسالة){"\n"}
              4. أرسل لطبيبك أو صيدلانيك للمراجعة
            </Text>
          </View>
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
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  tipCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  tipText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  sectionCard: { borderRadius: 14, borderWidth: 1.5, padding: 14 },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  sectionName: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  sectionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  contentItem: { fontSize: 11, textAlign: "right", lineHeight: 18 },
  shareOptions: { gap: 12 },
  shareBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14 },
  shareBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  infoCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  infoTitle: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  infoText: { fontSize: 12, lineHeight: 20, textAlign: "right" },
});
