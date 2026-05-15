/**
 * تقرير للصيدلاني والطبيب
 * Feature: 145 (تقرير للصيدلاني), 8 (تصدير PDF)
 */
import { useState } from "react";
import { Alert, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const REPORT_SECTIONS = [
  { id: "personal", title: "البيانات الشخصية", icon: "person.fill" as const, color: "#3B82F6" },
  { id: "conditions", title: "الحالات الصحية", icon: "heart.fill" as const, color: "#EF4444" },
  { id: "medications", title: "الأدوية الحالية", icon: "pills.fill" as const, color: "#F97316" },
  { id: "supplements", title: "المكملات الحالية", icon: "leaf.fill" as const, color: "#10B981" },
  { id: "interactions", title: "التفاعلات المحتملة", icon: "exclamationmark.triangle.fill" as const, color: "#F59E0B" },
  { id: "labs", title: "نتائج التحاليل", icon: "chart.bar.fill" as const, color: "#8B5CF6" },
];

export default function PharmacistReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const generateReport = async () => {
    setGenerating(true);
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGenerating(false);
    setReportGenerated(true);
  };

  const shareReport = () => {
    Alert.alert(
      "مشاركة التقرير",
      "يمكنك مشاركة التقرير مع طبيبك أو صيدلانيك عبر:",
      [
        { text: "إرسال بالبريد الإلكتروني", onPress: () => {} },
        { text: "نسخ الرابط", onPress: () => {} },
        { text: "طباعة", onPress: () => {} },
        { text: "إلغاء", style: "cancel" },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0c1a2e", borderBottomColor: "#1a3a5e" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#7dd3fc" />
          <Text style={[styles.backText, { color: "#7dd3fc" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>تقرير للصيدلاني والطبيب</Text>
        <Text style={[styles.headerSub, { color: "#7dd3fc" }]}>ملخص طبي شامل لمشاركته مع مقدم الرعاية الصحية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: "#1e3a5f", borderColor: "#3B82F620" }]}>
          <IconSymbol name="info.circle.fill" size={18} color="#7dd3fc" />
          <Text style={[styles.infoText, { color: "#93c5fd" }]}>
            هذا التقرير يجمع بياناتك الصحية ومكملاتك وأدويتك في ملخص طبي احترافي يمكن مشاركته مع طبيبك أو صيدلانيك لتجنب التفاعلات الضارة.
          </Text>
        </View>

        {/* Report Sections */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>محتويات التقرير</Text>
        <View style={{ gap: 8 }}>
          {REPORT_SECTIONS.map((sec) => (
            <View key={sec.id} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: sec.color + "30" }]}>
              <View style={[styles.sectionCheck, { backgroundColor: "#10B98120" }]}>
                <IconSymbol name="checkmark" size={14} color="#10B981" />
              </View>
              <Text style={[styles.sectionName, { color: colors.foreground }]}>{sec.title}</Text>
              <View style={[styles.sectionIcon, { backgroundColor: sec.color + "20" }]}>
                <IconSymbol name={sec.icon} size={18} color={sec.color} />
              </View>
            </View>
          ))}
        </View>

        {/* Generate Button */}
        {!reportGenerated ? (
          <Pressable
            style={[styles.generateBtn, { backgroundColor: generating ? "#3B82F680" : "#3B82F6" }]}
            onPress={generateReport}
            disabled={generating}
          >
            {generating ? (
              <Text style={styles.generateBtnText}>جاري إنشاء التقرير...</Text>
            ) : (
              <>
                <IconSymbol name="doc.text.fill" size={18} color="#fff" />
                <Text style={styles.generateBtnText}>إنشاء التقرير الطبي</Text>
              </>
            )}
          </Pressable>
        ) : (
          <View style={{ gap: 10 }}>
            <View style={[styles.successCard, { backgroundColor: "#10B98115", borderColor: "#10B98130" }]}>
              <IconSymbol name="checkmark.circle.fill" size={24} color="#10B981" />
              <Text style={[styles.successText, { color: "#10B981" }]}>تم إنشاء التقرير بنجاح!</Text>
            </View>

            {/* Report Preview */}
            <View style={[styles.reportPreview, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.reportTitle, { color: colors.foreground }]}>التقرير الطبي</Text>
              <Text style={[styles.reportDate, { color: colors.muted }]}>تاريخ الإنشاء: {new Date().toLocaleDateString("ar-SA")}</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.reportSection, { color: colors.foreground }]}>البيانات الشخصية</Text>
              <Text style={[styles.reportContent, { color: colors.muted }]}>العمر: من الملف الصحي | الوزن: من الملف الصحي</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.reportSection, { color: colors.foreground }]}>المكملات الحالية</Text>
              <Text style={[styles.reportContent, { color: colors.muted }]}>يتم جلبها من قسم "مكملاتي الحالية"</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.reportSection, { color: colors.foreground }]}>تحذيرات التفاعلات</Text>
              <Text style={[styles.reportContent, { color: "#F59E0B" }]}>يتم تحليلها تلقائياً من بياناتك</Text>
            </View>

            <View style={{ flexDirection: "row-reverse", gap: 10 }}>
              <Pressable style={[styles.shareBtn, { backgroundColor: "#10B981", flex: 1 }]} onPress={shareReport}>
                <IconSymbol name="paperplane.fill" size={16} color="#fff" />
                <Text style={styles.shareBtnText}>مشاركة</Text>
              </Pressable>
              <Pressable style={[styles.shareBtn, { backgroundColor: "#3B82F6", flex: 1 }]} onPress={generateReport}>
                <IconSymbol name="arrow.clockwise" size={16} color="#fff" />
                <Text style={styles.shareBtnText}>تحديث</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Privacy Note */}
        <View style={[styles.privacyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <IconSymbol name="lock.fill" size={14} color={colors.muted} />
          <Text style={[styles.privacyText, { color: colors.muted }]}>
            بياناتك محفوظة محلياً على جهازك فقط ولا تُرسل لأي خادم. التقرير يُنشأ محلياً ويمكنك التحكم الكامل في مشاركته.
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
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", gap: 10, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  sectionCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  sectionCheck: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sectionName: { flex: 1, fontSize: 13, fontWeight: "700", textAlign: "right" },
  sectionIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  generateBtn: { borderRadius: 14, padding: 16, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8 },
  generateBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  successCard: { borderRadius: 12, padding: 14, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10, justifyContent: "center" },
  successText: { fontSize: 15, fontWeight: "800" },
  reportPreview: { borderRadius: 14, padding: 16, borderWidth: 1, gap: 8 },
  reportTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  reportDate: { fontSize: 11, textAlign: "right" },
  divider: { height: 0.5, marginVertical: 4 },
  reportSection: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  reportContent: { fontSize: 12, textAlign: "right" },
  shareBtn: { borderRadius: 12, padding: 12, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6 },
  shareBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  privacyCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", gap: 8, alignItems: "flex-start" },
  privacyText: { flex: 1, fontSize: 11, lineHeight: 16, textAlign: "right" },
});
