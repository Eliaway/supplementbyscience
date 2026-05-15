/**
 * الوقاية من السرطان ودعم مرضى الأورام
 * Features: 51 (الوقاية من السرطان), 52 (دعم مرضى الكيماوي)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const CANCER_PREVENTION = [
  { name: "Vitamin D3", dose: "4000-5000 IU", evidence: "قوي جداً", note: "نقصه مرتبط بزيادة خطر 17 نوع من السرطان — يقلل الخطر بـ 67% في الدراسات" },
  { name: "Omega-3 (EPA+DHA)", dose: "3 غ", evidence: "قوي", note: "يقلل الالتهاب المزمن — عامل رئيسي في السرطان" },
  { name: "Curcumin (Theracurmin)", dose: "180-360 مغ", evidence: "قوي", note: "يثبط نمو الخلايا السرطانية ويحفز موتها الطبيعي" },
  { name: "Selenium", dose: "200 مكغ", evidence: "قوي", note: "يقلل خطر سرطان البروستاتا والكبد والرئة" },
  { name: "Green Tea Extract (EGCG)", dose: "400-500 مغ", evidence: "قوي", note: "يثبط نمو الأوعية الدموية للأورام (Anti-angiogenesis)" },
  { name: "Resveratrol", dose: "500 مغ", evidence: "متوسط", note: "يفعّل SIRT1 ويثبط NF-kB — مسار السرطان الرئيسي" },
  { name: "Sulforaphane (Broccoli Extract)", dose: "50-100 مغ", evidence: "قوي", note: "يحفز إنزيمات إزالة السموم ويثبط نمو الخلايا السرطانية" },
  { name: "Lycopene", dose: "15-30 مغ", evidence: "قوي", note: "يقلل خطر سرطان البروستاتا والثدي والرئة" },
];

const CHEMO_SUPPORT = [
  { name: "Glutamine", dose: "10-30 غ/يوم", note: "يقلل التهاب الفم والأمعاء من الكيماوي", warning: "استشر طبيبك أولاً" },
  { name: "Vitamin D3", dose: "4000 IU", note: "يحسن استجابة العلاج ويقلل الآثار الجانبية", warning: "آمن عموماً" },
  { name: "Omega-3", dose: "3-4 غ", note: "يقلل الكاشيكسيا (هزال السرطان) ويحسن الشهية", warning: "آمن عموماً" },
  { name: "Melatonin", dose: "20-40 مغ (جرعة علاجية)", note: "يزيد فعالية الكيماوي ويقلل آثاره الجانبية — دراسات واعدة", warning: "استشر طبيبك" },
  { name: "Probiotics", dose: "50 مليار CFU", note: "يقلل الإسهال من الكيماوي ويحمي الأمعاء", warning: "تجنب في حالات نقص المناعة الشديد" },
  { name: "Ginger Extract", dose: "1-2 غ", note: "يقلل الغثيان من الكيماوي بشكل ملحوظ", warning: "آمن عموماً" },
  { name: "CoQ10 (Ubiquinol)", dose: "300-600 مغ", note: "يحمي القلب من سمية Anthracyclines", warning: "استشر طبيبك" },
];

const ANTI_CANCER_FOODS = [
  { emoji: "🥦", name: "البروكلي", compound: "Sulforaphane", note: "اسحقه واتركه 40 دقيقة قبل الطهي" },
  { emoji: "🍅", name: "الطماطم المطبوخة", compound: "Lycopene", note: "الطهي يزيد الامتصاص 4 أضعاف" },
  { emoji: "🧄", name: "الثوم", compound: "Allicin + Organosulfur", note: "اسحقه واتركه 10 دقائق" },
  { emoji: "🫐", name: "التوت الأزرق", compound: "Anthocyanins + Pterostilbene", note: "المجمد بنفس الفائدة" },
  { emoji: "🍵", name: "الشاي الأخضر", compound: "EGCG", note: "3-5 أكواب يومياً" },
  { emoji: "🌿", name: "الكركم", compound: "Curcumin", note: "مع الفلفل الأسود وزيت الزيتون" },
];

export default function CancerPreventionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"prevention" | "support">("prevention");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#1a0a0a", borderBottomColor: "#3a1a1a" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#fca5a5" />
          <Text style={[styles.backText, { color: "#fca5a5" }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>الوقاية من السرطان</Text>
        <Text style={[styles.headerSub, { color: "#fca5a5" }]}>مكملات مدعومة علمياً للوقاية والدعم</Text>
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {[
          { id: "prevention" as const, label: "الوقاية" },
          { id: "support" as const, label: "دعم مرضى الكيماوي" },
        ].map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, { borderBottomColor: activeTab === tab.id ? "#EF4444" : "transparent" }]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? "#EF4444" : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.warningCard, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
          <Text style={[styles.warningText, { color: colors.warning }]}>⚠️ هذه المعلومات للتوعية فقط. مرضى السرطان يجب استشارة الطبيب المعالج قبل أي مكمل.</Text>
        </View>

        {activeTab === "prevention" ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أطعمة مضادة للسرطان</Text>
            <View style={styles.foodsGrid}>
              {ANTI_CANCER_FOODS.map((food, i) => (
                <View key={i} style={[styles.foodCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={styles.foodEmoji}>{food.emoji}</Text>
                  <Text style={[styles.foodName, { color: colors.foreground }]}>{food.name}</Text>
                  <Text style={[styles.foodCompound, { color: "#EF4444" }]}>{food.compound}</Text>
                  <Text style={[styles.foodNote, { color: colors.muted }]}>{food.note}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>مكملات الوقاية</Text>
            {CANCER_PREVENTION.map((supp, i) => (
              <View key={i} style={[styles.suppCard, { backgroundColor: colors.card, borderColor: "#EF444420" }]}>
                <View style={styles.suppHeader}>
                  <View style={[styles.evidenceBadge, { backgroundColor: supp.evidence.includes("قوي") ? colors.success + "20" : colors.warning + "20" }]}>
                    <Text style={[styles.evidenceText, { color: supp.evidence.includes("قوي") ? colors.success : colors.warning }]}>{supp.evidence}</Text>
                  </View>
                  <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                </View>
                <Text style={[styles.suppDose, { color: "#EF4444" }]}>{supp.dose}</Text>
                <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>مكملات دعم مرضى الكيماوي</Text>
            {CHEMO_SUPPORT.map((supp, i) => (
              <View key={i} style={[styles.suppCard, { backgroundColor: colors.card, borderColor: "#EF444420" }]}>
                <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
                <Text style={[styles.suppDose, { color: "#EF4444" }]}>{supp.dose}</Text>
                <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
                <View style={[styles.warningBadge, { backgroundColor: supp.warning.includes("استشر") ? colors.warning + "15" : colors.success + "15" }]}>
                  <Text style={[styles.warningBadgeText, { color: supp.warning.includes("استشر") ? colors.warning : colors.success }]}>{supp.warning}</Text>
                </View>
              </View>
            ))}
          </>
        )}
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
  tabs: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2 },
  tabText: { fontSize: 13, fontWeight: "700" },
  warningCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  foodsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  foodCard: { width: "47%", padding: 12, borderRadius: 14, borderWidth: 1, alignItems: "center", gap: 4 },
  foodEmoji: { fontSize: 28 },
  foodName: { fontSize: 13, fontWeight: "800" },
  foodCompound: { fontSize: 11, fontWeight: "700" },
  foodNote: { fontSize: 10, textAlign: "center", lineHeight: 14 },
  suppCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 6 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 11, fontWeight: "700" },
  suppName: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  warningBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-end" },
  warningBadgeText: { fontSize: 11, fontWeight: "700" },
});
