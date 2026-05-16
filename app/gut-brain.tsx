/**
 * محور الأمعاء والدماغ (Gut-Brain Axis)
 * Features: 120 (مكملات الميكروبيوم الدماغي), 65 (تحسين صحة الميكروبيوم)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const GUT_BRAIN_CONTENT = {
  intro: "محور الأمعاء-الدماغ هو شبكة اتصال ثنائية الاتجاه بين الجهاز الهضمي والدماغ عبر العصب المبهم (Vagus Nerve). 90% من السيروتونين يُنتج في الأمعاء!",
  sections: [
    {
      title: "البروبيوتيك النفسي (Psychobiotics)",
      color: "#6366F1",
      icon: "brain.head.profile" as const,
      description: "سلالات بكتيرية محددة تؤثر على المزاج والدماغ",
      supplements: [
        { name: "Lactobacillus rhamnosus (JB-1)", dose: "10 مليار CFU", effect: "يقلل القلق والكورتيزول — أكثر سلالة مدروسة للمزاج" },
        { name: "Bifidobacterium longum (1714)", dose: "10 مليار CFU", effect: "يحسن الذاكرة ويقلل الإجهاد" },
        { name: "Lactobacillus helveticus R0052", dose: "3 مليار CFU", effect: "يقلل القلق والاكتئاب الخفيف" },
        { name: "Bifidobacterium bifidum W23", dose: "5 مليار CFU", effect: "يقلل الحساسية العاطفية" },
      ],
    },
    {
      title: "البريبيوتيك لتغذية الميكروبيوم",
      color: "#10B981",
      icon: "leaf.fill" as const,
      description: "ألياف تغذي البكتيريا النافعة في الأمعاء",
      supplements: [
        { name: "Inulin (FOS)", dose: "5-10 غ", effect: "يغذي Bifidobacterium — يزيد إنتاج SCFA" },
        { name: "GOS (Galacto-oligosaccharides)", dose: "5 غ", effect: "يزيد Bifidobacterium ويقلل القلق" },
        { name: "Resistant Starch", dose: "10-20 غ", effect: "يزيد Butyrate — وقود خلايا الأمعاء" },
        { name: "Psyllium Husk", dose: "5-10 غ", effect: "يوازن الميكروبيوم ويقلل الالتهاب" },
      ],
    },
    {
      title: "دعم إنتاج الناقلات العصبية",
      color: "#F59E0B",
      icon: "bolt.fill" as const,
      description: "مكملات تدعم إنتاج السيروتونين والدوبامين في الأمعاء",
      supplements: [
        { name: "5-HTP", dose: "100-200 مغ", effect: "سلف السيروتونين — يحسن المزاج والنوم" },
        { name: "L-Tryptophan", dose: "500-1000 مغ", effect: "سلف 5-HTP والسيروتونين" },
        { name: "L-Tyrosine", dose: "500 مغ", effect: "سلف الدوبامين والنورإبينفرين" },
        { name: "Vitamin B6 (P5P)", dose: "50 مغ", effect: "ضروري لتحويل 5-HTP إلى سيروتونين" },
      ],
    },
    {
      title: "إصلاح بطانة الأمعاء",
      color: "#EF4444",
      icon: "shield.fill" as const,
      description: "مكملات تصلح الأمعاء المتسربة وتقلل الالتهاب الذي يؤثر على الدماغ",
      supplements: [
        { name: "L-Glutamine", dose: "5-10 غ", effect: "الوقود الأساسي لخلايا بطانة الأمعاء" },
        { name: "Zinc Carnosine", dose: "75 مغ", effect: "يصلح بطانة الأمعاء ويقلل النفاذية" },
        { name: "Colostrum", dose: "2-4 غ", effect: "يحتوي على IgA وعوامل نمو تصلح الأمعاء" },
        { name: "Butyrate (Sodium Butyrate)", dose: "600 مغ", effect: "يغذي خلايا الأمعاء ويقلل الالتهاب" },
      ],
    },
    {
      title: "دعم العصب المبهم (Vagus Nerve)",
      color: "#8B5CF6",
      icon: "waveform.path" as const,
      description: "مكملات تدعم وظيفة العصب المبهم — الرابط الرئيسي بين الأمعاء والدماغ",
      supplements: [
        { name: "Omega-3 (DHA)", dose: "2 غ DHA", effect: "يدعم غمد الميلين للعصب المبهم" },
        { name: "Magnesium Glycinate", dose: "400 مغ", effect: "يدعم وظيفة الجهاز العصبي اللاإرادي" },
        { name: "Acetyl-L-Carnitine", dose: "1-2 غ", effect: "يدعم وظيفة الأعصاب والميتوكوندريا العصبية" },
        { name: "Lion's Mane", dose: "1-3 غ", effect: "يحفز NGF لنمو وإصلاح الأعصاب" },
      ],
    },
  ],
  facts: [
    "الأمعاء تحتوي على 500 مليون خلية عصبية — أكثر من الحبل الشوكي",
    "90% من السيروتونين يُنتج في الأمعاء وليس الدماغ",
    "الميكروبيوم يؤثر على القلق والاكتئاب والذاكرة",
    "الأمعاء المتسربة ترتبط بالاكتئاب والضباب الذهني",
    "التوتر يغير تركيبة الميكروبيوم خلال 24 ساعة",
    "الأطفال الذين يتناولون المضادات الحيوية أكثر عرضة للاكتئاب لاحقاً",
  ],
};

export default function GutBrainScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>محور الأمعاء والدماغ</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>Gut-Brain Axis — العلاقة السرية بين أمعائك ودماغك</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Intro */}
        <View style={[styles.introCard, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
          <IconSymbol name="brain.head.profile" size={24} color={colors.primary} />
          <Text style={[styles.introText, { color: colors.foreground }]}>{GUT_BRAIN_CONTENT.intro}</Text>
        </View>

        {/* Facts */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>حقائق مذهلة</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 2 }}>
          {GUT_BRAIN_CONTENT.facts.map((fact, i) => (
            <View key={i} style={[styles.factCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.factNum, { color: colors.primary }]}>{i + 1}</Text>
              <Text style={[styles.factText, { color: colors.foreground }]}>{fact}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Sections */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>بروتوكول محور الأمعاء-الدماغ</Text>
        {GUT_BRAIN_CONTENT.sections.map((section) => (
          <View key={section.title} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: section.color + "40" }]}>
            <Pressable
              style={styles.sectionHeader}
              onPress={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
            >
              <IconSymbol name={expandedSection === section.title ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.sectionHeaderInfo}>
                <Text style={[styles.sectionCardTitle, { color: colors.foreground }]}>{section.title}</Text>
                <Text style={[styles.sectionCardDesc, { color: colors.muted }]}>{section.description}</Text>
              </View>
              <View style={[styles.sectionIcon, { backgroundColor: section.color + "20" }]}>
                <IconSymbol name={section.icon} size={20} color={section.color} />
              </View>
            </Pressable>
            {expandedSection === section.title && (
              <View style={styles.suppList}>
                {section.supplements.map((supp, i) => (
                  <View key={i} style={[styles.suppItem, { backgroundColor: section.color + "08", borderColor: section.color + "20" }]}>
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                    <Text style={[styles.suppDose, { color: section.color }]}>{supp.dose}</Text>
                    <Text style={[styles.suppEffect, { color: colors.muted }]}>{supp.effect}</Text>
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
  introCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 16, borderWidth: 1 },
  introText: { flex: 1, fontSize: 13, lineHeight: 22, textAlign: "right", fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  factCard: { width: 180, padding: 14, borderRadius: 14, borderWidth: 1, gap: 8 },
  factNum: { fontSize: 20, fontWeight: "800", fontFamily: "Cairo-Black" },
  factText: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  sectionHeaderInfo: { flex: 1, alignItems: "flex-end" },
  sectionCardTitle: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  sectionCardDesc: { fontSize: 12, marginTop: 2, textAlign: "right", fontFamily: "Cairo" },
  sectionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  suppList: { padding: 12, gap: 8 },
  suppItem: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppEffect: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
});
