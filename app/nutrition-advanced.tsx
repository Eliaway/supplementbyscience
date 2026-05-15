/**
 * التغذية المتقدمة والمغذيات الدقيقة
 * Features: 28 (المغذيات الدقيقة), 29 (نقص الفيتامينات), 30 (الأطعمة الوظيفية)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const MICRONUTRIENTS = [
  {
    category: "الفيتامينات الذائبة في الدهون",
    color: "#F59E0B",
    items: [
      { name: "فيتامين A", rda: "700-900 مكغ", sources: "الكبد، الجزر، البطاطا الحلوة", deficiency: "ضعف البصر الليلي، جفاف الجلد", toxicity: "ممكن عند الإفراط — لا تتجاوز 3000 مكغ" },
      { name: "فيتامين D3", rda: "600-4000 IU", sources: "الشمس، السمك الدهني، صفار البيض", deficiency: "هشاشة العظام، ضعف المناعة، اكتئاب", toxicity: "نادر — يحتاج جرعات عالية جداً" },
      { name: "فيتامين E", rda: "15 مغ", sources: "المكسرات، زيت عباد الشمس، الأفوكادو", deficiency: "ضعف المناعة، تلف الأعصاب", toxicity: "ممكن — يزيد خطر النزيف" },
      { name: "فيتامين K2 (MK-7)", rda: "120 مكغ", sources: "الناتو، الجبن، البيض", deficiency: "ترسب الكالسيوم في الشرايين", toxicity: "نادر جداً" },
    ],
  },
  {
    category: "فيتامينات B المركب",
    color: "#10B981",
    items: [
      { name: "B1 (Thiamine)", rda: "1.1-1.2 مغ", sources: "الحبوب الكاملة، البقوليات", deficiency: "تعب، مشاكل عصبية (Beriberi)", toxicity: "نادر جداً" },
      { name: "B2 (Riboflavin)", rda: "1.1-1.3 مغ", sources: "الألبان، اللحوم، البيض", deficiency: "تشقق الشفاه، التهاب اللسان", toxicity: "نادر — يلوّن البول أصفر" },
      { name: "B3 (Niacin)", rda: "14-16 مغ", sources: "الدجاج، التونة، الفول السوداني", deficiency: "Pellagra (التهاب الجلد والإسهال)", toxicity: "احمرار الجلد بالجرعات العالية" },
      { name: "B5 (Pantothenic Acid)", rda: "5 مغ", sources: "موجود في معظم الأطعمة", deficiency: "نادر جداً — تعب وتنميل", toxicity: "نادر جداً" },
      { name: "B6 (Pyridoxine)", rda: "1.3-1.7 مغ", sources: "الدجاج، السمك، الموز", deficiency: "فقر الدم، ضعف المناعة", toxicity: "اعتلال الأعصاب بالجرعات العالية" },
      { name: "B7 (Biotin)", rda: "30 مكغ", sources: "البيض، المكسرات، البطاطا الحلوة", deficiency: "تساقط الشعر، هشاشة الأظافر", toxicity: "نادر جداً" },
      { name: "B9 (Methylfolate)", rda: "400-800 مكغ", sources: "الخضروات الورقية، البقوليات", deficiency: "عيوب الأنبوب العصبي، فقر الدم", toxicity: "نادر — يخفي نقص B12" },
      { name: "B12 (Methylcobalamin)", rda: "2.4 مكغ", sources: "اللحوم، الألبان، البيض", deficiency: "فقر الدم، تلف الأعصاب", toxicity: "نادر جداً — ذائب في الماء" },
    ],
  },
  {
    category: "المعادن الكبرى",
    color: "#6366F1",
    items: [
      { name: "الكالسيوم", rda: "1000-1200 مغ", sources: "الألبان، الخضروات الورقية، السردين", deficiency: "هشاشة العظام، تشنجات عضلية", toxicity: "حصى الكلى، ترسب في الشرايين" },
      { name: "المغنيسيوم", rda: "310-420 مغ", sources: "المكسرات، البذور، الخضروات الورقية", deficiency: "تشنجات، قلق، أرق، ارتفاع ضغط", toxicity: "إسهال بالجرعات العالية" },
      { name: "الفوسفور", rda: "700 مغ", sources: "اللحوم، الألبان، البقوليات", deficiency: "نادر — ضعف العظام", toxicity: "يضر الكلى ويقلل امتصاص الكالسيوم" },
      { name: "البوتاسيوم", rda: "2600-3400 مغ", sources: "الموز، البطاطا، الأفوكادو", deficiency: "ضعف عضلي، اضطراب نبض القلب", toxicity: "خطير على القلب بالجرعات العالية" },
    ],
  },
  {
    category: "المعادن الصغرى",
    color: "#EF4444",
    items: [
      { name: "الحديد", rda: "8-18 مغ", sources: "اللحم الأحمر، السبانخ، البقوليات", deficiency: "فقر الدم، تعب، ضعف تركيز", toxicity: "يضر الكبد والقلب بالإفراط" },
      { name: "الزنك", rda: "8-11 مغ", sources: "المحار، اللحم الأحمر، البذور", deficiency: "ضعف مناعة، تساقط شعر، بطء التئام", toxicity: "يقلل امتصاص النحاس" },
      { name: "السيلينيوم", rda: "55 مكغ", sources: "المكسرات البرازيلية، السمك، البيض", deficiency: "ضعف الغدة الدرقية، ضعف مناعة", toxicity: "تساقط شعر وأظافر هشة" },
      { name: "اليود", rda: "150 مكغ", sources: "الملح المعالج، الأسماك، الألبان", deficiency: "تضخم الغدة الدرقية، قصور الغدة", toxicity: "يضر الغدة الدرقية" },
      { name: "النحاس", rda: "900 مكغ", sources: "الكبد، المحار، المكسرات", deficiency: "فقر الدم، ضعف العظام", toxicity: "يضر الكبد — نادر" },
      { name: "المنغنيز", rda: "1.8-2.3 مغ", sources: "الحبوب الكاملة، المكسرات، الشاي", deficiency: "نادر — ضعف عظام", toxicity: "يضر الجهاز العصبي بالإفراط" },
    ],
  },
];

const FUNCTIONAL_FOODS = [
  { name: "الكركم", compound: "Curcumin", benefit: "مضاد التهاب قوي — يساوي بعض الأدوية", tip: "أضف الفلفل الأسود لزيادة الامتصاص 2000%" },
  { name: "الثوم", compound: "Allicin", benefit: "مضاد بكتيري، يخفض الكوليسترول والضغط", tip: "اسحق الثوم واتركه 10 دقائق قبل الطهي" },
  { name: "الزنجبيل", compound: "Gingerol + Shogaol", benefit: "مضاد غثيان، مضاد التهاب، يحسن الهضم", tip: "الزنجبيل الطازج أفضل من المجفف" },
  { name: "الشاي الأخضر", compound: "EGCG + L-Theanine", benefit: "مضاد أكسدة قوي، يحسن التركيز والتمثيل الغذائي", tip: "لا تضف الحليب — يقلل امتصاص EGCG" },
  { name: "البروكلي", compound: "Sulforaphane", benefit: "يحفز إنزيمات إزالة السموم، مضاد سرطان", tip: "اقطعه واتركه 40 دقيقة قبل الطهي" },
  { name: "التوت الأزرق", compound: "Anthocyanins", benefit: "يحمي الدماغ والعيون، يحسن الذاكرة", tip: "المجمد يحتفظ بنفس الفوائد" },
  { name: "الأفوكادو", compound: "Oleic Acid + Lutein", benefit: "يزيد امتصاص الفيتامينات الذائبة في الدهون", tip: "كله مع السلطة لمضاعفة امتصاص الكاروتينات" },
  { name: "الجوز", compound: "ALA Omega-3 + Polyphenols", benefit: "يحسن صحة الدماغ والقلب والأمعاء", tip: "7 حبات يومياً كافية" },
];

export default function NutritionAdvancedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"micronutrients" | "functional">("micronutrients");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>التغذية المتقدمة</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>المغذيات الدقيقة والأطعمة الوظيفية</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {[
          { id: "micronutrients" as const, label: "المغذيات الدقيقة" },
          { id: "functional" as const, label: "الأطعمة الوظيفية" },
        ].map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, { borderBottomColor: activeTab === tab.id ? colors.primary : "transparent" }]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {activeTab === "micronutrients" ? (
          MICRONUTRIENTS.map((cat) => (
            <View key={cat.category} style={[styles.catCard, { backgroundColor: colors.card, borderColor: cat.color + "40" }]}>
              <Pressable
                style={[styles.catHeader, { backgroundColor: cat.color + "10" }]}
                onPress={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
              >
                <IconSymbol name={expandedCategory === cat.category ? "chevron.down" : "chevron.right"} size={16} color={colors.muted} />
                <Text style={[styles.catTitle, { color: colors.foreground }]}>{cat.category}</Text>
                <View style={[styles.countBadge, { backgroundColor: cat.color + "20" }]}>
                  <Text style={[styles.countText, { color: cat.color }]}>{cat.items.length}</Text>
                </View>
              </Pressable>
              {expandedCategory === cat.category && (
                <View style={{ padding: 12, gap: 10 }}>
                  {cat.items.map((item, i) => (
                    <View key={i} style={[styles.itemCard, { backgroundColor: cat.color + "06", borderColor: cat.color + "20" }]}>
                      <View style={styles.itemHeader}>
                        <Text style={[styles.itemRDA, { color: cat.color }]}>{item.rda}</Text>
                        <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
                      </View>
                      <Text style={[styles.itemSources, { color: colors.muted }]}>المصادر: {item.sources}</Text>
                      <Text style={[styles.itemDeficiency, { color: colors.error }]}>نقص: {item.deficiency}</Text>
                      <Text style={[styles.itemToxicity, { color: colors.warning }]}>إفراط: {item.toxicity}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          FUNCTIONAL_FOODS.map((food, i) => (
            <View key={i} style={[styles.foodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.foodHeader}>
                <Text style={[styles.foodCompound, { color: colors.primary }]}>{food.compound}</Text>
                <Text style={[styles.foodName, { color: colors.foreground }]}>{food.name}</Text>
              </View>
              <Text style={[styles.foodBenefit, { color: colors.muted }]}>{food.benefit}</Text>
              <View style={[styles.tipBox, { backgroundColor: colors.success + "12", borderColor: colors.success + "30" }]}>
                <Text style={[styles.tipLabel, { color: colors.success }]}>💡 نصيحة: </Text>
                <Text style={[styles.tipText, { color: colors.muted }]}>{food.tip}</Text>
              </View>
            </View>
          ))
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
  catCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  catHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 10 },
  catTitle: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  countBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  countText: { fontSize: 12, fontWeight: "700" },
  itemCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  itemHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  itemName: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" },
  itemRDA: { fontSize: 12, fontWeight: "700" },
  itemSources: { fontSize: 11, lineHeight: 16, textAlign: "right" },
  itemDeficiency: { fontSize: 11, lineHeight: 16, textAlign: "right" },
  itemToxicity: { fontSize: 11, lineHeight: 16, textAlign: "right" },
  foodCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 8 },
  foodHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  foodName: { flex: 1, fontSize: 15, fontWeight: "800", textAlign: "right" },
  foodCompound: { fontSize: 12, fontWeight: "700" },
  foodBenefit: { fontSize: 13, lineHeight: 20, textAlign: "right" },
  tipBox: { flexDirection: "row-reverse", padding: 10, borderRadius: 10, borderWidth: 1, gap: 4 },
  tipLabel: { fontSize: 12, fontWeight: "700" },
  tipText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
});
