/**
 * توازن الهرمونات للمرأة
 * Features: 19 (قسم صحة المرأة), 20 (مكملات الدورة الشهرية), 21 (مكملات الحمل والرضاعة)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const HORMONE_SECTIONS = [
  {
    id: "cycle",
    title: "مكملات الدورة الشهرية",
    subtitle: "دعم هرموني طبيعي لكل مرحلة",
    color: "#EC4899",
    icon: "heart.fill" as const,
    phases: [
      {
        name: "الطمث (الأيام 1-5)",
        description: "تقليل الألم والتشنجات",
        supplements: [
          { name: "Magnesium Glycinate", dose: "400-600 مغ", reason: "يقلل تشنجات الرحم بشكل ملحوظ" },
          { name: "Omega-3 (EPA عالي)", dose: "3 غ", reason: "يقلل البروستاجلاندين المسبب للألم" },
          { name: "Vitamin B1 (Thiamine)", dose: "100 مغ", reason: "يقلل آلام الدورة — دراسات قوية" },
          { name: "Ginger Extract", dose: "500 مغ × 3", reason: "مضاد التهاب طبيعي لتشنجات الرحم" },
        ],
      },
      {
        name: "الجريبية (الأيام 6-13)",
        description: "دعم الإستروجين والطاقة",
        supplements: [
          { name: "Iron (Bisglycinate)", dose: "18-25 مغ", reason: "يعوض الحديد المفقود مع الدم" },
          { name: "Vitamin C", dose: "500 مغ", reason: "يحسن امتصاص الحديد" },
          { name: "B-Complex", dose: "B-50 Complex", reason: "يدعم الطاقة والمزاج في هذه المرحلة" },
          { name: "Zinc", dose: "15-20 مغ", reason: "يدعم نضج البويضة" },
        ],
      },
      {
        name: "الإباضة (الأيام 14-16)",
        description: "دعم الخصوبة والطاقة القصوى",
        supplements: [
          { name: "Maca Root", dose: "1.5-3 غ", reason: "يدعم الخصوبة وتوازن الهرمونات" },
          { name: "CoQ10", dose: "300-600 مغ", reason: "يحسن جودة البويضة والطاقة الخلوية" },
          { name: "Vitamin D3", dose: "4000 IU", reason: "ضروري لصحة الإباضة" },
          { name: "DHEA (بإشراف طبي)", dose: "25-50 مغ", reason: "يدعم الخصوبة عند النساء فوق 35" },
        ],
      },
      {
        name: "الطور الأصفر (الأيام 17-28)",
        description: "دعم البروجستيرون وتقليل PMS",
        supplements: [
          { name: "Vitex (Chasteberry)", dose: "400 مغ", reason: "يدعم البروجستيرون ويقلل PMS" },
          { name: "Magnesium Glycinate", dose: "400 مغ", reason: "يقلل توتر ما قبل الدورة" },
          { name: "Vitamin B6 (P5P)", dose: "50-100 مغ", reason: "يقلل PMS والانتفاخ" },
          { name: "Evening Primrose Oil", dose: "1-3 غ", reason: "يقلل ألم الثدي وPMS" },
        ],
      },
    ],
  },
  {
    id: "pregnancy",
    title: "مكملات الحمل والرضاعة",
    subtitle: "تغذية الأم والجنين",
    color: "#8B5CF6",
    icon: "heart.circle.fill" as const,
    phases: [
      {
        name: "الثلث الأول (1-12 أسبوع)",
        description: "الأهم — تكوين الجهاز العصبي",
        supplements: [
          { name: "Folate (Methylfolate)", dose: "400-800 مكغ", reason: "يمنع عيوب الأنبوب العصبي — ضروري جداً" },
          { name: "Vitamin B12 (Methylcobalamin)", dose: "1000 مكغ", reason: "يعمل مع الفولات لتكوين الدماغ" },
          { name: "Vitamin D3", dose: "4000 IU", reason: "يدعم تكوين العظام والمناعة" },
          { name: "Iron (Bisglycinate)", dose: "27 مغ", reason: "يمنع فقر الدم في الحمل" },
        ],
      },
      {
        name: "الثلث الثاني (13-26 أسبوع)",
        description: "نمو العظام والدماغ",
        supplements: [
          { name: "Calcium + Vitamin D3", dose: "1000 مغ + 4000 IU", reason: "يبني عظام الجنين" },
          { name: "DHA (Algae-based)", dose: "300-600 مغ", reason: "يطور دماغ الجنين والرؤية" },
          { name: "Magnesium Glycinate", dose: "300-400 مغ", reason: "يقلل تقلصات الساق ويدعم النوم" },
          { name: "Vitamin C", dose: "500 مغ", reason: "يدعم تكوين الكولاجين والمناعة" },
        ],
      },
      {
        name: "الثلث الثالث (27-40 أسبوع)",
        description: "التحضير للولادة",
        supplements: [
          { name: "Iron (Bisglycinate)", dose: "27-36 مغ", reason: "يمنع فقر الدم قبل الولادة" },
          { name: "Omega-3 DHA", dose: "600 مغ", reason: "يكمل تطور دماغ الجنين" },
          { name: "Raspberry Leaf Tea", dose: "كوبان يومياً", reason: "يقوي عضلة الرحم للولادة" },
          { name: "Vitamin K2", dose: "90-180 مكغ", reason: "يدعم تخثر الدم وصحة العظام" },
        ],
      },
      {
        name: "الرضاعة الطبيعية",
        description: "دعم إنتاج الحليب وصحة الأم",
        supplements: [
          { name: "Fenugreek (حلبة)", dose: "1-3 غ × 3", reason: "يزيد إنتاج الحليب بشكل ملحوظ" },
          { name: "DHA", dose: "300 مغ", reason: "يمر إلى الحليب ويطور دماغ الرضيع" },
          { name: "Vitamin D3", dose: "6400 IU", reason: "يعوض نقص فيتامين D في حليب الأم" },
          { name: "Iron", dose: "18 مغ", reason: "يعوض الحديد المفقود بعد الولادة" },
        ],
      },
    ],
  },
  {
    id: "menopause",
    title: "انقطاع الطمث والسن",
    subtitle: "تخفيف الأعراض بشكل طبيعي",
    color: "#F59E0B",
    icon: "sun.max.fill" as const,
    phases: [
      {
        name: "مرحلة ما قبل انقطاع الطمث",
        description: "الأعراض الأولى والتغيرات الهرمونية",
        supplements: [
          { name: "Black Cohosh", dose: "40-80 مغ", reason: "يقلل الهبات الساخنة — أكثر مكمل مدروس" },
          { name: "Vitex (Chasteberry)", dose: "400 مغ", reason: "يوازن الهرمونات في هذه المرحلة" },
          { name: "Magnesium Glycinate", dose: "400 مغ", reason: "يقلل القلق واضطرابات النوم" },
          { name: "Vitamin B6", dose: "50 مغ", reason: "يقلل تقلبات المزاج" },
        ],
      },
      {
        name: "انقطاع الطمث الكامل",
        description: "حماية العظام والقلب والدماغ",
        supplements: [
          { name: "Calcium + Vitamin D3 + K2", dose: "1200 مغ + 5000 IU + 180 مكغ", reason: "يمنع هشاشة العظام بعد انقطاع الطمث" },
          { name: "Phytoestrogens (Soy Isoflavones)", dose: "40-80 مغ", reason: "يقلل الهبات الساخنة ويحمي العظام" },
          { name: "Omega-3", dose: "2-3 غ", reason: "يحمي القلب والدماغ بعد انقطاع الإستروجين" },
          { name: "Collagen Type I", dose: "10 غ", reason: "يحافظ على الجلد والمفاصل والعظام" },
        ],
      },
    ],
  },
];

export default function HormoneBalanceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>("cycle");
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#4a1040", borderBottomColor: "#6a2060" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#f9a8d4" />
          <Text style={[styles.backText, { color: "#f9a8d4" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>توازن الهرمونات</Text>
        <Text style={[styles.headerSub, { color: "#f9a8d4" }]}>دليل شامل لصحة المرأة الهرمونية</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {HORMONE_SECTIONS.map((section) => (
          <View key={section.id} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: section.color + "40" }]}>
            <Pressable
              style={[styles.sectionHeader, { backgroundColor: section.color + "12" }]}
              onPress={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <IconSymbol name={expandedSection === section.id ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
              <View style={styles.sectionHeaderInfo}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>{section.subtitle}</Text>
              </View>
              <View style={[styles.sectionIcon, { backgroundColor: section.color + "20" }]}>
                <IconSymbol name={section.icon} size={22} color={section.color} />
              </View>
            </Pressable>

            {expandedSection === section.id && (
              <View style={{ padding: 12, gap: 10 }}>
                {section.phases.map((phase) => (
                  <View key={phase.name} style={[styles.phaseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Pressable
                      style={styles.phaseHeader}
                      onPress={() => setExpandedPhase(expandedPhase === phase.name ? null : phase.name)}
                    >
                      <IconSymbol name={expandedPhase === phase.name ? "chevron.down" : "chevron.right"} size={14} color={colors.muted} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.phaseName, { color: colors.foreground }]}>{phase.name}</Text>
                        <Text style={[styles.phaseDesc, { color: colors.muted }]}>{phase.description}</Text>
                      </View>
                    </Pressable>
                    {expandedPhase === phase.name && (
                      <View style={{ padding: 10, gap: 8 }}>
                        {phase.supplements.map((supp, i) => (
                          <View key={i} style={[styles.suppItem, { backgroundColor: section.color + "08", borderColor: section.color + "20" }]}>
                            <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                            <Text style={[styles.suppDose, { color: section.color }]}>{supp.dose}</Text>
                            <Text style={[styles.suppReason, { color: colors.muted }]}>{supp.reason}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
          <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
          <Text style={[styles.disclaimerText, { color: colors.muted }]}>
            استشيري طبيبك قبل تناول أي مكملات خلال الحمل أو الرضاعة. هذه المعلومات للتثقيف فقط.
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
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  sectionHeaderInfo: { flex: 1, alignItems: "flex-end" },
  sectionTitle: { fontSize: 15, fontWeight: "800" },
  sectionSubtitle: { fontSize: 12, marginTop: 2 },
  sectionIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  phaseCard: { borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  phaseHeader: { flexDirection: "row-reverse", alignItems: "flex-start", padding: 12, gap: 8 },
  phaseName: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  phaseDesc: { fontSize: 11, textAlign: "right", marginTop: 2 },
  suppItem: { borderRadius: 10, padding: 10, borderWidth: 1, gap: 3 },
  suppName: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  suppReason: { fontSize: 11, lineHeight: 16, textAlign: "right" },
  disclaimer: { flexDirection: "row-reverse", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
});
