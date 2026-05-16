/**
 * مقياس الأعراض التفاعلي
 * Feature #124: Interactive symptom tracker
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface Symptom {
  id: string;
  name: string;
  category: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  relatedSupplements: string[];
  possibleCauses: string[];
}

const SYMPTOMS: Symptom[] = [
  {
    id: "fatigue",
    name: "التعب والإرهاق المزمن",
    category: "الطاقة",
    icon: "bolt.slash.fill",
    color: "#F59E0B",
    relatedSupplements: ["فيتامين B12", "الحديد", "فيتامين D3", "CoQ10", "المغنيسيوم", "أوميغا-3"],
    possibleCauses: ["نقص B12 أو الحديد", "قصور الغدة الدرقية", "نقص فيتامين D", "اضطراب النوم", "فقر الدم"],
  },
  {
    id: "brain_fog",
    name: "ضبابية الذهن وصعوبة التركيز",
    category: "الدماغ",
    icon: "brain",
    color: "#8B5CF6",
    relatedSupplements: ["أوميغا-3 DHA", "Lion's Mane", "فيتامين B12", "المغنيسيوم Threonate", "فيتامين D3"],
    possibleCauses: ["نقص أوميغا-3", "اضطراب النوم", "نقص B12", "التهاب مزمن منخفض الدرجة", "نقص الحديد"],
  },
  {
    id: "joint_pain",
    name: "آلام المفاصل والعضلات",
    category: "الجهاز الحركي",
    icon: "figure.walk",
    color: "#EF4444",
    relatedSupplements: ["كولاجين Type II", "كركمين Curcumin", "أوميغا-3", "فيتامين D3", "المغنيسيوم", "MSM"],
    possibleCauses: ["نقص فيتامين D", "التهاب مزمن", "نقص كولاجين", "نقص المغنيسيوم", "الجفاف"],
  },
  {
    id: "poor_sleep",
    name: "صعوبة النوم أو النوم المتقطع",
    category: "النوم",
    icon: "moon.zzz.fill",
    color: "#6366F1",
    relatedSupplements: ["المغنيسيوم Glycinate", "الميلاتونين", "L-Theanine", "Ashwagandha", "Glycine"],
    possibleCauses: ["نقص المغنيسيوم", "ارتفاع الكورتيزول", "نقص الميلاتونين", "الضوء الأزرق", "التوتر المزمن"],
  },
  {
    id: "hair_loss",
    name: "تساقط الشعر المفرط",
    category: "الجلد والشعر",
    icon: "scissors",
    color: "#EC4899",
    relatedSupplements: ["البيوتين B7", "الحديد Ferrous Bisglycinate", "الزنك", "فيتامين D3", "Saw Palmetto"],
    possibleCauses: ["نقص الحديد أو الفيريتين", "نقص فيتامين D", "قصور الغدة الدرقية", "نقص الزنك", "التوتر المزمن"],
  },
  {
    id: "mood_issues",
    name: "تقلبات المزاج والقلق",
    category: "الصحة النفسية",
    icon: "face.smiling",
    color: "#10B981",
    relatedSupplements: ["أوميغا-3 EPA", "المغنيسيوم", "فيتامين D3", "Ashwagandha", "5-HTP", "L-Theanine"],
    possibleCauses: ["نقص أوميغا-3", "نقص فيتامين D", "اختلال الميكروبيوم", "نقص المغنيسيوم", "التوتر المزمن"],
  },
  {
    id: "digestive",
    name: "مشاكل الهضم والانتفاخ",
    category: "الجهاز الهضمي",
    icon: "waveform.path",
    color: "#F97316",
    relatedSupplements: ["البروبيوتيك", "إنزيمات الهضم", "L-Glutamine", "الزنك Carnosine", "Slippery Elm"],
    possibleCauses: ["خلل الميكروبيوم", "نقص إنزيمات الهضم", "الأمعاء المتسربة", "حساسية طعام", "التوتر"],
  },
  {
    id: "skin_issues",
    name: "مشاكل الجلد (جفاف، حب شباب، طفح)",
    category: "الجلد والشعر",
    icon: "sparkles",
    color: "#14B8A6",
    relatedSupplements: ["الزنك", "فيتامين A", "أوميغا-3", "فيتامين C", "البروبيوتيك", "Astaxanthin"],
    possibleCauses: ["نقص الزنك", "خلل الميكروبيوم", "نقص أوميغا-3", "نقص فيتامين A", "الالتهاب المزمن"],
  },
  {
    id: "immune_weak",
    name: "ضعف المناعة وكثرة الإصابة بالأمراض",
    category: "المناعة",
    icon: "shield.fill",
    color: "#2563EB",
    relatedSupplements: ["فيتامين D3", "الزنك", "فيتامين C", "Elderberry", "Beta-Glucan", "Quercetin"],
    possibleCauses: ["نقص فيتامين D", "نقص الزنك", "خلل الميكروبيوم", "نقص النوم", "التوتر المزمن"],
  },
  {
    id: "low_libido",
    name: "انخفاض الرغبة الجنسية",
    category: "الهرمونات",
    icon: "heart.fill",
    color: "#DC2626",
    relatedSupplements: ["الزنك", "فيتامين D3", "Ashwagandha", "Maca Root", "Tongkat Ali", "Fenugreek"],
    possibleCauses: ["نقص التستوستيرون", "نقص الزنك", "نقص فيتامين D", "التوتر المزمن", "نقص النوم"],
  },
];

export default function SymptomTrackerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getTopSupplements = () => {
    const selected = SYMPTOMS.filter(s => selectedSymptoms.includes(s.id));
    const counts: Record<string, number> = {};
    selected.forEach(s => {
      s.relatedSupplements.forEach(supp => {
        counts[supp] = (counts[supp] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  };

  if (selectedSymptom) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedSymptom(null)}>
            <IconSymbol name="chevron.right" size={22} color={colors.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{selectedSymptom.name}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <View style={[styles.symptomHeader, { backgroundColor: selectedSymptom.color + "15", borderColor: selectedSymptom.color + "30" }]}>
            <IconSymbol name={selectedSymptom.icon} size={32} color={selectedSymptom.color} />
            <Text style={[styles.symptomCategory, { color: selectedSymptom.color }]}>{selectedSymptom.category}</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المكملات الموصى بها</Text>
          {selectedSymptom.relatedSupplements.map((supp, i) => (
            <View key={i} style={[styles.suppRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.suppNum, { backgroundColor: selectedSymptom.color + "20" }]}>
                <Text style={[styles.suppNumText, { color: selectedSymptom.color }]}>{i + 1}</Text>
              </View>
              <Text style={[styles.suppName, { color: colors.foreground }]}>{supp}</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأسباب المحتملة</Text>
          {selectedSymptom.possibleCauses.map((cause, i) => (
            <View key={i} style={[styles.causeRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <IconSymbol name="exclamationmark.circle.fill" size={16} color={colors.warning} />
              <Text style={[styles.causeText, { color: colors.foreground }]}>{cause}</Text>
            </View>
          ))}

          <Pressable
            style={[styles.aiBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/ai" as any)}
          >
            <IconSymbol name="brain" size={18} color="#fff" />
            <Text style={styles.aiBtnText}>استشر مساعد AI للتحليل المتعمق</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  const topSupplements = getTopSupplements();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>مقياس الأعراض</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>اختر أعراضك لمعرفة المكملات المناسبة</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "25" }]}>
          <IconSymbol name="info.circle.fill" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            اختر الأعراض التي تعاني منها وسنقترح المكملات الأنسب لك
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأعراض الشائعة</Text>
        {SYMPTOMS.map(symptom => (
          <Pressable
            key={symptom.id}
            style={[
              styles.symptomCard,
              { backgroundColor: colors.surface, borderColor: selectedSymptoms.includes(symptom.id) ? symptom.color : colors.border },
              selectedSymptoms.includes(symptom.id) && { backgroundColor: symptom.color + "08" },
            ]}
            onPress={() => toggleSymptom(symptom.id)}
          >
            <View style={styles.symptomLeft}>
              <Pressable
                style={[styles.detailBtn, { backgroundColor: colors.primary + "15" }]}
                onPress={() => setSelectedSymptom(symptom)}
              >
                <IconSymbol name="chevron.left" size={14} color={colors.primary} />
              </Pressable>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 2 }}>
              <Text style={[styles.symptomName, { color: colors.foreground }]}>{symptom.name}</Text>
              <Text style={[styles.symptomCat, { color: colors.muted }]}>{symptom.category}</Text>
            </View>
            <View style={[styles.symptomIcon, { backgroundColor: symptom.color + "15" }]}>
              <IconSymbol name={symptom.icon} size={20} color={symptom.color} />
            </View>
            {selectedSymptoms.includes(symptom.id) && (
              <View style={[styles.checkMark, { backgroundColor: symptom.color }]}>
                <IconSymbol name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </Pressable>
        ))}

        {selectedSymptoms.length > 0 && topSupplements.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              المكملات الموصى بها ({selectedSymptoms.length} أعراض محددة)
            </Text>
            {topSupplements.map((supp, i) => (
              <View key={i} style={[styles.topSuppCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.suppRank, { backgroundColor: i < 3 ? colors.primary + "20" : colors.border }]}>
                  <Text style={[styles.suppRankText, { color: i < 3 ? colors.primary : colors.muted }]}>#{i + 1}</Text>
                </View>
                <Text style={[styles.topSuppName, { color: colors.foreground }]}>{supp.name}</Text>
                <View style={[styles.countBadge, { backgroundColor: colors.primary + "15" }]}>
                  <Text style={[styles.countText, { color: colors.primary }]}>مذكور {supp.count}×</Text>
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
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  infoCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 8 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  symptomCard: { borderRadius: 14, padding: 12, borderWidth: 1.5, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  symptomIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  symptomName: { fontSize: 14, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  symptomCat: { fontSize: 11, textAlign: "right", fontFamily: "Cairo" },
  symptomLeft: { flexShrink: 0 },
  detailBtn: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  checkMark: { position: "absolute", top: -6, left: -6, width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  symptomHeader: { borderRadius: 16, padding: 20, borderWidth: 1, alignItems: "center", gap: 8 },
  symptomCategory: { fontSize: 14, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppRow: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  suppNum: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  suppNumText: { fontSize: 12, fontWeight: "800", fontFamily: "Cairo-Black" },
  suppName: { flex: 1, fontSize: 14, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  causeRow: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  causeText: { flex: 1, fontSize: 13, textAlign: "right", fontFamily: "Cairo" },
  aiBtn: { borderRadius: 14, padding: 16, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8 },
  aiBtnText: { color: "#fff", fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  topSuppCard: { borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  suppRank: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  suppRankText: { fontSize: 12, fontWeight: "800", fontFamily: "Cairo-Black" },
  topSuppName: { flex: 1, fontSize: 14, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  countBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  countText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
});
