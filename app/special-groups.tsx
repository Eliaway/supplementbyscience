/**
 * فئات خاصة — Special Groups
 * Features: الأطفال، العمال، الأطباء، الطلاب، المسافرون، المدخنون، الإرهاق الوظيفي
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface GroupProtocol {
  id: string;
  title: string;
  subtitle: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  supplements: {
    name: string;
    dose: string;
    reason: string;
    priority: "أساسي" | "مهم" | "اختياري";
  }[];
  avoidList: string[];
  tips: string[];
}

const GROUPS: GroupProtocol[] = [
  {
    id: "children",
    title: "الأطفال (4-12 سنة)",
    subtitle: "مكملات آمنة لدعم النمو والتطور",
    icon: "figure.child",
    color: "#F97316",
    supplements: [
      { name: "فيتامين D3 للأطفال", dose: "1000-2000 IU/يوم", reason: "أكثر من 50% من الأطفال يعانون نقصاً — ضروري للعظام والمناعة", priority: "أساسي" },
      { name: "أوميغا-3 DHA للأطفال", dose: "500-1000 مغ DHA/يوم", reason: "ضروري لتطور الدماغ والتركيز والتعلم", priority: "أساسي" },
      { name: "الزنك للأطفال", dose: "5-10 مغ/يوم", reason: "يدعم النمو والمناعة والشهية", priority: "مهم" },
      { name: "فيتامين C", dose: "250-500 مغ/يوم", reason: "يقوي المناعة ويقلل مدة الزكام", priority: "مهم" },
      { name: "المغنيسيوم للأطفال", dose: "100-200 مغ/يوم", reason: "يحسن النوم والتركيز ويقلل فرط الحركة", priority: "اختياري" },
    ],
    avoidList: ["الحديد بدون تشخيص نقص", "فيتامين A جرعات عالية", "مكملات البالغين بجرعات مخففة"],
    tips: ["استشر طبيب الأطفال قبل أي مكمل", "اختر مكملات مصممة للأطفال مع نكهات مناسبة", "الغذاء المتنوع أولاً — المكملات لسد الفجوات فقط"],
  },
  {
    id: "workers",
    title: "العمال والمهن الشاقة",
    subtitle: "للعمل البدني الشاق والتعرض للمواد الكيميائية",
    icon: "hammer.fill",
    color: "#F59E0B",
    supplements: [
      { name: "المغنيسيوم Glycinate", dose: "400-600 مغ/يوم", reason: "يقلل تشنجات العضلات والإرهاق الجسدي", priority: "أساسي" },
      { name: "فيتامين C", dose: "1000-2000 مغ/يوم", reason: "يحمي من الإجهاد التأكسدي والمواد الكيميائية", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000 IU/يوم", reason: "العمال الداخليون معرضون لنقص شديد", priority: "أساسي" },
      { name: "NAC (N-Acetyl Cysteine)", dose: "600 مغ مرتين/يوم", reason: "يحمي الكبد والرئتين من التلوث والمواد الكيميائية", priority: "مهم" },
      { name: "الكرياتين", dose: "5 غ/يوم", reason: "يحسن الأداء البدني ويقلل الإرهاق العضلي", priority: "مهم" },
      { name: "Electrolytes", dose: "حسب التعرق", reason: "يعوض الصوديوم والبوتاسيوم والمغنيسيوم المفقودة بالتعرق", priority: "أساسي" },
    ],
    avoidList: ["مكملات الطاقة المحتوية على إيفيدرين", "جرعات عالية من الحديد بدون فحص"],
    tips: ["اشرب ماءً كافياً — الجفاف يزيد الإرهاق بشكل كبير", "وجبة بروتين بعد العمل الشاق لإصلاح العضلات", "نوم 8 ساعات ضروري للتعافي من العمل الشاق"],
  },
  {
    id: "doctors",
    title: "الأطباء والكوادر الصحية",
    subtitle: "لمكافحة الإرهاق والتوتر المزمن",
    icon: "stethoscope",
    color: "#0EA5E9",
    supplements: [
      { name: "Ashwagandha KSM-66", dose: "600 مغ/يوم", reason: "يخفض الكورتيزول 28% — يقلل الإرهاق المزمن", priority: "أساسي" },
      { name: "المغنيسيوم Glycinate", dose: "400 مغ قبل النوم", reason: "يحسن جودة النوم القصير ويقلل القلق", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000 IU/يوم", reason: "العمل الداخلي يسبب نقصاً — يؤثر على المزاج والمناعة", priority: "أساسي" },
      { name: "أوميغا-3", dose: "2-3 غ/يوم", reason: "يقلل الالتهاب ويحمي الدماغ من الإرهاق المزمن", priority: "مهم" },
      { name: "L-Theanine + الكافيين", dose: "200 مغ + 100 مغ", reason: "تركيز بدون قلق — مثالي للمناوبات الليلية", priority: "مهم" },
      { name: "Rhodiola Rosea", dose: "400 مغ صباحاً", reason: "يقلل الإرهاق الذهني ويحسن الأداء تحت الضغط", priority: "اختياري" },
    ],
    avoidList: ["مكملات تسبب نعاساً أثناء المناوبة", "جرعات عالية من الميلاتونين قبل المناوبات الليلية"],
    tips: ["وجبات منتظمة حتى في المناوبات — نقص السكر يضعف التركيز", "15 دقيقة مشي في الهواء الطلق تعيد شحن الطاقة", "تقنيات التنفس العميق تخفض الكورتيزول خلال دقائق"],
  },
  {
    id: "students",
    title: "الطلاب وفترات الامتحانات",
    subtitle: "لتحسين الذاكرة والتركيز وتقليل التوتر",
    icon: "book.fill",
    color: "#8B5CF6",
    supplements: [
      { name: "أوميغا-3 DHA", dose: "1-2 غ DHA/يوم", reason: "DHA يشكل 40% من دهون الدماغ — ضروري للذاكرة", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000 IU/يوم", reason: "نقصه يضعف الذاكرة والتركيز — شائع جداً بين الطلاب", priority: "أساسي" },
      { name: "L-Theanine", dose: "200 مغ", reason: "يحسن التركيز ويقلل قلق الامتحانات", priority: "أساسي" },
      { name: "Bacopa Monnieri", dose: "300 مغ/يوم", reason: "يحسن الذاكرة والاستيعاب — نتائج بعد 12 أسبوع", priority: "مهم" },
      { name: "المغنيسيوم Glycinate", dose: "300 مغ قبل النوم", reason: "يحسن جودة النوم وتثبيت الذاكرة أثناء النوم", priority: "مهم" },
      { name: "Rhodiola Rosea", dose: "400 مغ صباحاً", reason: "يقلل الإرهاق الذهني أثناء الدراسة المكثفة", priority: "اختياري" },
    ],
    avoidList: ["مشروبات الطاقة المفرطة — تسبب انهياراً بعد ساعات", "Nootropics غير مرخصة من مصادر مجهولة"],
    tips: ["النوم 7-8 ساعات يثبت المعلومات في الذاكرة طويلة المدى", "تقنية Pomodoro (25 دقيقة دراسة + 5 راحة) تحسن التركيز", "التمرين 30 دقيقة يومياً يحسن الذاكرة أكثر من أي مكمل"],
  },
  {
    id: "travelers",
    title: "المسافرون كثيراً",
    subtitle: "لمكافحة Jet Lag والمناعة أثناء السفر",
    icon: "airplane",
    color: "#06B6D4",
    supplements: [
      { name: "الميلاتونين", dose: "0.5-1 مغ", reason: "يعيد ضبط الساعة البيولوجية — خذه عند وقت نوم الوجهة", priority: "أساسي" },
      { name: "فيتامين C", dose: "1000-2000 مغ/يوم", reason: "يقوي المناعة ضد الجراثيم في الطائرات والفنادق", priority: "أساسي" },
      { name: "الزنك Lozenges", dose: "13-25 مغ عند الأعراض", reason: "يقلل مدة الزكام إذا بدأته خلال 24 ساعة", priority: "مهم" },
      { name: "البروبيوتيك", dose: "10-50 مليار CFU/يوم", reason: "يحمي من إسهال المسافر وتغيرات الميكروبيوم", priority: "مهم" },
      { name: "المغنيسيوم Glycinate", dose: "300-400 مغ", reason: "يساعد على النوم في البيئات الجديدة", priority: "اختياري" },
      { name: "Electrolytes", dose: "حسب الحاجة", reason: "الطيران يسبب جفافاً — يعوض المعادن المفقودة", priority: "مهم" },
    ],
    avoidList: ["الكحول في الطائرة — يزيد الجفاف وJet Lag", "مضادات النوم القوية في الرحلات القصيرة"],
    tips: ["اشرب ماءً كافياً في الطائرة — الهواء جاف جداً", "تعرض للضوء الطبيعي فور الوصول لإعادة ضبط الساعة البيولوجية", "تجنب القيلولة الطويلة عند الوصول — انتظر حتى وقت النوم المحلي"],
  },
  {
    id: "smokers",
    title: "المدخنون والراغبون في الإقلاع",
    subtitle: "لتعويض النقص وتقليل الأضرار",
    icon: "wind",
    color: "#6B7280",
    supplements: [
      { name: "فيتامين C", dose: "2000-3000 مغ/يوم", reason: "التدخين يستنزف فيتامين C — المدخن يحتاج ضعف الجرعة", priority: "أساسي" },
      { name: "فيتامين E", dose: "400 IU/يوم", reason: "مضاد أكسدة يحمي الرئتين من الجذور الحرة", priority: "أساسي" },
      { name: "NAC (N-Acetyl Cysteine)", dose: "600 مغ مرتين/يوم", reason: "يرقق المخاط ويحمي الرئتين — يرفع Glutathione", priority: "أساسي" },
      { name: "أوميغا-3", dose: "3-4 غ/يوم", reason: "يقلل الالتهاب المزمن الناتج عن التدخين", priority: "مهم" },
      { name: "فيتامين D3", dose: "5000 IU/يوم", reason: "التدخين يقلل مستوياته — يؤثر على المناعة والرئتين", priority: "مهم" },
      { name: "Quercetin", dose: "500-1000 مغ/يوم", reason: "يحمي الرئتين من الأكسدة ويقلل التهاب المجاري التنفسية", priority: "اختياري" },
    ],
    avoidList: ["بيتا كاروتين جرعات عالية — يزيد خطر سرطان الرئة عند المدخنين", "فيتامين A جرعات عالية"],
    tips: ["الإقلاع عن التدخين أهم قرار صحي — المكملات تساعد لكن لا تعوض الإقلاع", "Nicotine Replacement Therapy يضاعف فرص الإقلاع الناجح", "التمرين يقلل الرغبة في التدخين ويساعد في الإقلاع"],
  },
  {
    id: "burnout",
    title: "الإرهاق الوظيفي (Burnout)",
    subtitle: "لاستعادة الطاقة والتوازن النفسي",
    icon: "flame.fill",
    color: "#EF4444",
    supplements: [
      { name: "Ashwagandha KSM-66", dose: "600 مغ/يوم", reason: "يخفض الكورتيزول المزمن المرتفع — جوهر الـ Burnout", priority: "أساسي" },
      { name: "المغنيسيوم Glycinate", dose: "400-500 مغ قبل النوم", reason: "يحسن النوم ويقلل القلق المزمن", priority: "أساسي" },
      { name: "فيتامين B Complex", dose: "جرعة يومية كاملة", reason: "فيتامينات B تستنزف بالتوتر المزمن — ضروري لإنتاج الطاقة", priority: "أساسي" },
      { name: "أوميغا-3", dose: "2-3 غ/يوم", reason: "يقلل الالتهاب العصبي المرتبط بالاكتئاب والإرهاق", priority: "مهم" },
      { name: "Rhodiola Rosea", dose: "400 مغ صباحاً", reason: "Adaptogen يساعد الجسم على التكيف مع الضغط المزمن", priority: "مهم" },
      { name: "5-HTP", dose: "100-200 مغ مساءً", reason: "يرفع السيروتونين — يحسن المزاج والنوم", priority: "اختياري" },
      { name: "فيتامين D3", dose: "5000 IU/يوم", reason: "نقصه مرتبط بالاكتئاب والإرهاق المزمن", priority: "مهم" },
    ],
    avoidList: ["5-HTP مع أدوية SSRI/SNRI — خطر Serotonin Syndrome", "مكملات الطاقة المحفزة — تزيد الكورتيزول"],
    tips: ["الإرهاق الوظيفي يحتاج تغييراً في نمط الحياة — المكملات داعمة فقط", "حدود واضحة بين العمل والراحة — أوقف الإشعارات بعد ساعات العمل", "الطبيعة والهواء الطلق يخفضان الكورتيزول بشكل مثبت علمياً"],
  },
];

export default function SpecialGroupsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<GroupProtocol | null>(null);

  if (selectedGroup) {
    const g = selectedGroup;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: g.color + "12", borderBottomColor: g.color + "30" }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedGroup(null)}>
            <IconSymbol name="chevron.right" size={22} color={g.color} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{g.title}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكملات الموصى بها</Text>
          {g.supplements.map((s, i) => (
            <View key={i} style={[styles.suppCard, { backgroundColor: colors.surface, borderColor: s.priority === "أساسي" ? g.color + "40" : colors.border, borderLeftColor: s.priority === "أساسي" ? g.color : colors.border, borderLeftWidth: s.priority === "أساسي" ? 4 : 1 }]}>
              <View style={styles.suppRow}>
                <View style={[styles.priorityBadge, { backgroundColor: s.priority === "أساسي" ? g.color + "15" : s.priority === "مهم" ? colors.warning + "15" : colors.success + "15" }]}>
                  <Text style={[styles.priorityText, { color: s.priority === "أساسي" ? g.color : s.priority === "مهم" ? colors.warning : colors.success }]}>{s.priority}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
                  <Text style={[styles.suppDose, { color: g.color }]}>{s.dose}</Text>
                </View>
              </View>
              <Text style={[styles.suppReason, { color: colors.muted }]}>{s.reason}</Text>
            </View>
          ))}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>تجنب هذه المكملات</Text>
          {g.avoidList.map((a, i) => (
            <View key={i} style={[styles.avoidRow, { backgroundColor: colors.error + "08", borderColor: colors.error + "20" }]}>
              <IconSymbol name="xmark.circle.fill" size={14} color={colors.error} />
              <Text style={[styles.avoidText, { color: colors.foreground }]}>{a}</Text>
            </View>
          ))}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>نصائح مهمة</Text>
          {g.tips.map((t, i) => (
            <View key={i} style={[styles.tipRow, { backgroundColor: g.color + "08", borderColor: g.color + "20" }]}>
              <IconSymbol name="lightbulb.fill" size={14} color={g.color} />
              <Text style={[styles.tipText, { color: colors.foreground }]}>{t}</Text>
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>فئات خاصة</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>مكملات مخصصة لكل فئة</Text>
        </View>
      </View>
      <FlatList
        data={GROUPS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.groupCard, { backgroundColor: colors.surface, borderColor: item.color + "25", borderLeftColor: item.color, borderLeftWidth: 4 }, pressed && { opacity: 0.85 }]}
            onPress={() => setSelectedGroup(item)}
          >
            <View style={styles.groupTop}>
              <View style={[styles.groupIcon, { backgroundColor: item.color + "15" }]}>
                <IconSymbol name={item.icon} size={24} color={item.color} />
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.groupTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.groupSub, { color: colors.muted }]}>{item.subtitle}</Text>
              </View>
              <IconSymbol name="chevron.left" size={16} color={colors.muted} />
            </View>
            <View style={[styles.countBadge, { backgroundColor: item.color + "10" }]}>
              <Text style={[styles.countText, { color: item.color }]}>{item.supplements.length} مكمل موصى به</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  groupCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  groupTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  groupIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  groupTitle: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  groupSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  countBadge: { alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { fontSize: 11, fontWeight: "700" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", marginTop: 4 },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  suppRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  suppName: { fontSize: 14, fontWeight: "800", textAlign: "right" },
  suppDose: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: "700" },
  suppReason: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  avoidRow: { flexDirection: "row-reverse", gap: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  avoidText: { flex: 1, fontSize: 13, lineHeight: 18, textAlign: "right" },
  tipRow: { flexDirection: "row-reverse", gap: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18, textAlign: "right" },
});
