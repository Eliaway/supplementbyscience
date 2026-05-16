/**
 * مكملات ADHD والجهاز العصبي
 * Features: 74 (ADHD والانتباه), 75 (دعم الميلين والأعصاب)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const ADHD_SUPPLEMENTS = [
  {
    name: "Omega-3 (EPA:DHA = 3:1)",
    dose: "2-4 غ/يوم",
    mechanism: "يحسن بنية غشاء الخلايا العصبية وانتقال الإشارات",
    evidence: "قوي جداً — مراجعات Cochrane",
    color: "#3B82F6",
  },
  {
    name: "Magnesium Glycinate",
    dose: "200-400 مغ/يوم",
    mechanism: "يهدئ الجهاز العصبي ويقلل فرط النشاط",
    evidence: "قوي",
    color: "#10B981",
  },
  {
    name: "Zinc Bisglycinate",
    dose: "15-30 مغ/يوم",
    mechanism: "يدعم إنتاج الدوبامين ويحسن الانتباه",
    evidence: "قوي",
    color: "#F59E0B",
  },
  {
    name: "Iron (Ferrous Bisglycinate)",
    dose: "حسب مستوى الفيريتين",
    mechanism: "نقص الحديد يرتبط مباشرة بـ ADHD — ضروري لإنتاج الدوبامين",
    evidence: "قوي جداً",
    color: "#EF4444",
  },
  {
    name: "Vitamin D3",
    dose: "4000-6000 IU/يوم",
    mechanism: "يدعم تطور الدماغ ويحسن الوظائف التنفيذية",
    evidence: "قوي",
    color: "#F97316",
  },
  {
    name: "L-Theanine",
    dose: "200 مغ",
    mechanism: "يحسن التركيز دون تخدير — يوازن الإثارة والهدوء",
    evidence: "قوي",
    color: "#8B5CF6",
  },
  {
    name: "Phosphatidylserine",
    dose: "100-300 مغ/يوم",
    mechanism: "يحسن الذاكرة العاملة والوظائف التنفيذية",
    evidence: "قوي — معتمد FDA",
    color: "#06B6D4",
  },
  {
    name: "Bacopa Monnieri",
    dose: "300-600 مغ/يوم",
    mechanism: "يحسن الذاكرة والتعلم — يقلل القلق",
    evidence: "قوي",
    color: "#84CC16",
  },
];

const NEURO_SUPPLEMENTS = [
  {
    name: "Vitamin B12 (Methylcobalamin)",
    dose: "1000-5000 mcg/يوم",
    mechanism: "ضروري لتكوين الميلين — نقصه يسبب تلف الأعصاب",
    evidence: "قوي جداً",
    color: "#EF4444",
  },
  {
    name: "Vitamin B6 (P5P)",
    dose: "50-100 مغ/يوم",
    mechanism: "يدعم إنتاج الناقلات العصبية (سيروتونين، دوبامين، GABA)",
    evidence: "قوي",
    color: "#F97316",
  },
  {
    name: "Folate (Methylfolate)",
    dose: "400-800 mcg/يوم",
    mechanism: "ضروري لتكوين الميلين وإصلاح DNA العصبي",
    evidence: "قوي جداً",
    color: "#10B981",
  },
  {
    name: "Alpha Lipoic Acid (ALA)",
    dose: "300-600 مغ/يوم",
    mechanism: "مضاد أكسدة قوي يحمي الأعصاب من الأكسدة",
    evidence: "قوي",
    color: "#F59E0B",
  },
  {
    name: "Acetyl-L-Carnitine (ALCAR)",
    dose: "500-2000 مغ/يوم",
    mechanism: "يحسن وظيفة الميتوكوندريا في الخلايا العصبية",
    evidence: "قوي",
    color: "#8B5CF6",
  },
  {
    name: "Lion's Mane Mushroom",
    dose: "500-3000 مغ/يوم",
    mechanism: "يحفز إنتاج NGF — عامل نمو الأعصاب",
    evidence: "قوي — دراسات سريرية",
    color: "#6366F1",
  },
];

export default function ADHDNeuroScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"adhd" | "neuro">("adhd");

  const supplements = activeTab === "adhd" ? ADHD_SUPPLEMENTS : NEURO_SUPPLEMENTS;
  const tabTitle = activeTab === "adhd" ? "ADHD والانتباه" : "الميلين والأعصاب";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#0c1a2e", borderBottomColor: "#1a3a5e" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#7dd3fc" />
          <Text style={[styles.backText, { color: "#7dd3fc" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>مكملات الدماغ والأعصاب</Text>
        <Text style={[styles.headerSub, { color: "#7dd3fc" }]}>ADHD • الميلين • الوظائف التنفيذية</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(["adhd", "neuro"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: "#3B82F6", borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? "#3B82F6" : colors.muted }]}>
              {tab === "adhd" ? "ADHD والانتباه" : "الميلين والأعصاب"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>مكملات {tabTitle}</Text>
        {supplements.map((supp, i) => (
          <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: supp.color + "30" }]}>
            <View style={[styles.colorBar, { backgroundColor: supp.color }]} />
            <View style={{ flex: 1, gap: 6, padding: 12 }}>
              <View style={styles.suppHeader}>
                <View style={[styles.evidenceBadge, { backgroundColor: supp.color + "15" }]}>
                  <Text style={[styles.evidenceText, { color: supp.color }]}>{supp.evidence}</Text>
                </View>
                <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
              </View>
              <Text style={[styles.suppDose, { color: supp.color }]}>{supp.dose}</Text>
              <Text style={[styles.suppMechanism, { color: colors.muted }]}>{supp.mechanism}</Text>
            </View>
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
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabText: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppCard: { borderRadius: 14, borderWidth: 1, flexDirection: "row-reverse", overflow: "hidden" },
  colorBar: { width: 4 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  suppName: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 12, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppMechanism: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
});
