/**
 * مكملات الأطفال والمراهقين
 * Features: 49 (مكملات الأطفال), 50 (مكملات المراهقين)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const AGE_GROUPS = [
  {
    id: "infants",
    title: "الرضع (0-12 شهر)",
    color: "#F59E0B",
    icon: "figure.and.child.holdinghands" as const,
    warning: "استشر طبيب الأطفال قبل أي مكمل للرضع",
    supplements: [
      { name: "Vitamin D3", dose: "400 IU/يوم", note: "الرضاعة الطبيعية لا تكفي — ضروري لجميع الرضع" },
      { name: "Iron", dose: "1 مغ/كغ/يوم (للرضع الذين يرضعون طبيعياً)", note: "ابدأ من 4 أشهر إذا كانت الرضاعة طبيعية فقط" },
      { name: "Omega-3 DHA", dose: "100 مغ", note: "ضروري لتطور الدماغ والعيون" },
    ],
  },
  {
    id: "toddlers",
    title: "الأطفال الصغار (1-5 سنوات)",
    color: "#10B981",
    icon: "figure.and.child.holdinghands" as const,
    warning: "تجنب الجرعات الكبيرة — الأطفال حساسون جداً",
    supplements: [
      { name: "Vitamin D3", dose: "600-1000 IU/يوم", note: "أكثر من 50% من الأطفال ناقصون" },
      { name: "Omega-3 (DHA+EPA)", dose: "250-500 مغ", note: "يحسن التطور المعرفي والسلوك" },
      { name: "Probiotics", dose: "5-10 مليار CFU", note: "يقوي المناعة ويقلل الإسهال والأمراض" },
      { name: "Zinc", dose: "3-5 مغ", note: "يدعم النمو والمناعة — كثير من الأطفال ناقصون" },
      { name: "Iron (إذا أوصى الطبيب)", dose: "حسب الفحص", note: "فقر الدم شائع في هذه المرحلة" },
    ],
  },
  {
    id: "school",
    title: "أطفال المدرسة (6-12 سنة)",
    color: "#3B82F6",
    icon: "book.fill" as const,
    warning: "ركز على الغذاء المتوازن أولاً",
    supplements: [
      { name: "Vitamin D3", dose: "1000-2000 IU/يوم", note: "يحسن التركيز والمناعة والمزاج" },
      { name: "Omega-3 (DHA+EPA)", dose: "500-1000 مغ", note: "يحسن التركيز والقراءة والسلوك" },
      { name: "Magnesium Glycinate", dose: "100-200 مغ", note: "يقلل القلق والتوتر ويحسن النوم" },
      { name: "Vitamin C", dose: "250-500 مغ", note: "يقلل مدة الأمراض الشائعة" },
      { name: "Probiotics", dose: "10 مليار CFU", note: "يقوي المناعة ويقلل الغياب عن المدرسة" },
    ],
  },
  {
    id: "teens",
    title: "المراهقون (13-18 سنة)",
    color: "#8B5CF6",
    icon: "figure.stand" as const,
    warning: "مرحلة نمو سريع — الاحتياجات أعلى من البالغين",
    supplements: [
      { name: "Vitamin D3", dose: "2000-4000 IU/يوم", note: "نقصه شائع جداً في المراهقين" },
      { name: "Calcium + Vitamin K2", dose: "1000-1300 مغ + 100 مكغ", note: "أهم مرحلة لبناء كثافة العظام" },
      { name: "Iron (للفتيات)", dose: "15-18 مغ", note: "الدورة الشهرية تزيد الحاجة للحديد" },
      { name: "Omega-3", dose: "1-2 غ", note: "يحسن المزاج والتركيز والجلد" },
      { name: "Zinc", dose: "11-13 مغ", note: "يدعم النمو والهرمونات وصحة الجلد" },
      { name: "Magnesium", dose: "300-400 مغ", note: "يقلل القلق والتوتر الدراسي" },
    ],
  },
];

const ADHD_SUPPLEMENTS = [
  { name: "Omega-3 (EPA عالي)", dose: "1-2 غ EPA", note: "أقوى مكمل لـ ADHD — يحسن التركيز والسلوك" },
  { name: "Magnesium Glycinate", dose: "200-300 مغ", note: "يقلل فرط الحركة والتوتر" },
  { name: "Zinc", dose: "15-25 مغ", note: "نقصه مرتبط بشدة أعراض ADHD" },
  { name: "Vitamin D3", dose: "2000-4000 IU", note: "نقصه شائع في أطفال ADHD" },
  { name: "Iron (إذا كان ناقصاً)", dose: "حسب الفحص", note: "نقص الحديد يشبه أعراض ADHD" },
];

export default function ChildrenSupplementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [showADHD, setShowADHD] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#1a1040", borderBottomColor: "#2d1a60" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#c4b5fd" />
          <Text style={[styles.backText, { color: "#c4b5fd" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>مكملات الأطفال والمراهقين</Text>
        <Text style={[styles.headerSub, { color: "#c4b5fd" }]}>دليل آمن حسب الفئة العمرية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.warningCard, { backgroundColor: colors.error + "12", borderColor: colors.error + "30" }]}>
          <Text style={[styles.warningText, { color: colors.error }]}>⚠️ استشر طبيب الأطفال دائماً قبل إعطاء أي مكمل لطفلك. هذه المعلومات للتوعية فقط.</Text>
        </View>

        {AGE_GROUPS.map((group) => (
          <View key={group.id} style={[styles.groupCard, { backgroundColor: colors.card, borderColor: group.color + "40" }]}>
            <Pressable
              style={[styles.groupHeader, { backgroundColor: group.color + "10" }]}
              onPress={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
            >
              <IconSymbol name={expandedGroup === group.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.groupInfo}>
                <Text style={[styles.groupTitle, { color: colors.foreground }]}>{group.title}</Text>
                <Text style={[styles.groupWarning, { color: colors.warning }]}>{group.warning}</Text>
              </View>
              <View style={[styles.groupIcon, { backgroundColor: group.color + "20" }]}>
                <IconSymbol name={group.icon} size={22} color={group.color} />
              </View>
            </Pressable>
            {expandedGroup === group.id && (
              <View style={{ padding: 12, gap: 10 }}>
                {group.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppCard, { backgroundColor: group.color + "06", borderColor: group.color + "20" }]}>
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    <Text style={[styles.suppDose, { color: group.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* ADHD Section */}
        <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: "#F59E0B40" }]}>
          <Pressable
            style={[styles.groupHeader, { backgroundColor: "#F59E0B10" }]}
            onPress={() => setShowADHD(!showADHD)}
          >
            <IconSymbol name={showADHD ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
            <View style={styles.groupInfo}>
              <Text style={[styles.groupTitle, { color: colors.foreground }]}>مكملات ADHD (اضطراب التركيز)</Text>
              <Text style={[styles.groupWarning, { color: colors.warning }]}>مكملات مساعدة — لا تغني عن العلاج الطبي</Text>
            </View>
            <View style={[styles.groupIcon, { backgroundColor: "#F59E0B20" }]}>
              <IconSymbol name="brain.head.profile" size={22} color="#F59E0B" />
            </View>
          </Pressable>
          {showADHD && (
            <View style={{ padding: 12, gap: 10 }}>
              {ADHD_SUPPLEMENTS.map((supp, i) => (
                <View key={i} style={[styles.suppCard, { backgroundColor: "#F59E0B06", borderColor: "#F59E0B20" }]}>
                  <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                  <Text style={[styles.suppDose, { color: "#F59E0B" }]}>{supp.dose}</Text>
                  <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
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
  groupCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  groupHeader: { flexDirection: "row-reverse", alignItems: "flex-start", padding: 14, gap: 10 },
  groupInfo: { flex: 1, alignItems: "flex-end", gap: 4 },
  groupTitle: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  groupWarning: { fontSize: 11, fontFamily: "Cairo" },
  groupIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
