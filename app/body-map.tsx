import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

I18nManager.forceRTL(true);

interface BodyPart {
  id: string;
  name: string;
  emoji: string;
  color: string;
  supplements: SupplementRec[];
  description: string;
}

interface SupplementRec {
  name: string;
  dose: string;
  benefit: string;
  evidence: "قوي" | "متوسط" | "محدود";
  emoji: string;
}

const BODY_PARTS: BodyPart[] = [
  {
    id: "brain",
    name: "الدماغ والأعصاب",
    emoji: "🧠",
    color: "#8b5cf6",
    description: "تحسين التركيز والذاكرة والصحة العصبية",
    supplements: [
      { name: "أوميغا-3 (DHA)", dose: "1000-2000 ملغ/يوم", benefit: "بناء أغشية الخلايا العصبية", evidence: "قوي", emoji: "🐟" },
      { name: "مغنيسيوم ثريونات", dose: "144 ملغ/يوم", benefit: "تحسين الذاكرة والتعلم", evidence: "متوسط", emoji: "🔮" },
      { name: "فيتامين ب12", dose: "500-1000 ميكروغرام/يوم", benefit: "صحة الأعصاب والمايلين", evidence: "قوي", emoji: "💊" },
      { name: "ليون مان (فطر الأسد)", dose: "500-1000 ملغ/يوم", benefit: "تحفيز نمو الخلايا العصبية", evidence: "متوسط", emoji: "🍄" },
      { name: "فوسفاتيديل سيرين", dose: "100-300 ملغ/يوم", benefit: "تحسين الذاكرة والتركيز", evidence: "قوي", emoji: "🧬" },
    ],
  },
  {
    id: "heart",
    name: "القلب والأوعية",
    emoji: "❤️",
    color: "#ef4444",
    description: "دعم صحة القلب وتنظيم ضغط الدم",
    supplements: [
      { name: "أوميغا-3", dose: "2000-4000 ملغ/يوم", benefit: "تقليل الدهون الثلاثية وحماية القلب", evidence: "قوي", emoji: "🐟" },
      { name: "كيو-10", dose: "100-300 ملغ/يوم", benefit: "طاقة خلايا القلب ومضاد أكسدة", evidence: "قوي", emoji: "⚡" },
      { name: "المغنيسيوم", dose: "300-400 ملغ/يوم", benefit: "تنظيم ضربات القلب وضغط الدم", evidence: "قوي", emoji: "🔮" },
      { name: "ثوم (أليسين)", dose: "600-1200 ملغ/يوم", benefit: "تقليل ضغط الدم والكوليسترول", evidence: "متوسط", emoji: "🧄" },
      { name: "الريسفيراترول", dose: "150-500 ملغ/يوم", benefit: "حماية الأوعية الدموية", evidence: "متوسط", emoji: "🍇" },
    ],
  },
  {
    id: "liver",
    name: "الكبد",
    emoji: "🟤",
    color: "#92400e",
    description: "دعم وظائف الكبد وإزالة السموم",
    supplements: [
      { name: "حليب الشوك (سيليمارين)", dose: "420-600 ملغ/يوم", benefit: "حماية وتجديد خلايا الكبد", evidence: "قوي", emoji: "🌿" },
      { name: "NAC (سيستين)", dose: "600-1800 ملغ/يوم", benefit: "رفع الغلوتاثيون وإزالة السموم", evidence: "قوي", emoji: "🧬" },
      { name: "الكركم (كيوركومين)", dose: "500-1000 ملغ/يوم", benefit: "مضاد التهاب وحماية الكبد", evidence: "متوسط", emoji: "🟡" },
      { name: "ألفا ليبويك أسيد", dose: "300-600 ملغ/يوم", benefit: "مضاد أكسدة قوي ودعم الكبد", evidence: "متوسط", emoji: "⚡" },
    ],
  },
  {
    id: "kidneys",
    name: "الكلى",
    emoji: "🫘",
    color: "#dc2626",
    description: "دعم وظائف الكلى والترشيح",
    supplements: [
      { name: "المغنيسيوم سيترات", dose: "200-400 ملغ/يوم", benefit: "منع حصوات الكلى", evidence: "قوي", emoji: "🔮" },
      { name: "فيتامين ب6", dose: "25-50 ملغ/يوم", benefit: "تقليل الأوكسالات وحصوات الكلى", evidence: "متوسط", emoji: "💊" },
      { name: "الكرانبيري", dose: "400-500 ملغ/يوم", benefit: "منع التهابات المسالك البولية", evidence: "متوسط", emoji: "🫐" },
    ],
  },
  {
    id: "gut",
    name: "الأمعاء والهضم",
    emoji: "🦠",
    color: "#10b981",
    description: "صحة الميكروبيوم والجهاز الهضمي",
    supplements: [
      { name: "البروبيوتيك", dose: "10-50 مليار وحدة/يوم", benefit: "تحسين الميكروبيوم والمناعة", evidence: "قوي", emoji: "🦠" },
      { name: "البريبيوتيك (إينولين)", dose: "5-10 غرام/يوم", benefit: "تغذية البكتيريا النافعة", evidence: "قوي", emoji: "🌾" },
      { name: "الغلوتامين", dose: "5-10 غرام/يوم", benefit: "إصلاح بطانة الأمعاء", evidence: "متوسط", emoji: "🔬" },
      { name: "إنزيمات هضمية", dose: "مع كل وجبة", benefit: "تحسين هضم البروتين والدهون", evidence: "متوسط", emoji: "⚗️" },
    ],
  },
  {
    id: "bones",
    name: "العظام والمفاصل",
    emoji: "🦴",
    color: "#f59e0b",
    description: "تقوية العظام وصحة المفاصل",
    supplements: [
      { name: "كالسيوم سيترات", dose: "500-1000 ملغ/يوم", benefit: "بناء وصيانة العظام", evidence: "قوي", emoji: "🥛" },
      { name: "فيتامين د3", dose: "2000-5000 وحدة/يوم", benefit: "امتصاص الكالسيوم وصحة العظام", evidence: "قوي", emoji: "☀️" },
      { name: "فيتامين ك2 (MK-7)", dose: "100-200 ميكروغرام/يوم", benefit: "توجيه الكالسيوم للعظام", evidence: "متوسط", emoji: "🥬" },
      { name: "كولاجين نوع 2", dose: "40 ملغ/يوم", benefit: "صحة الغضاريف والمفاصل", evidence: "متوسط", emoji: "🦷" },
      { name: "بوسويليا", dose: "300-500 ملغ/يوم", benefit: "تقليل التهاب المفاصل", evidence: "متوسط", emoji: "🌿" },
    ],
  },
  {
    id: "muscles",
    name: "العضلات والأداء",
    emoji: "💪",
    color: "#3b82f6",
    description: "بناء العضلات وتحسين الأداء الرياضي",
    supplements: [
      { name: "الكرياتين مونوهيدرات", dose: "3-5 غرام/يوم", benefit: "زيادة القوة والكتلة العضلية", evidence: "قوي", emoji: "⚡" },
      { name: "بروتين مصل اللبن", dose: "20-40 غرام/وجبة", benefit: "بناء وإصلاح العضلات", evidence: "قوي", emoji: "🥛" },
      { name: "بيتا ألانين", dose: "3.2-6.4 غرام/يوم", benefit: "تحمّل العضلات وتقليل الحموضة", evidence: "قوي", emoji: "🏃" },
      { name: "HMB", dose: "3 غرام/يوم", benefit: "منع هدم العضلات", evidence: "متوسط", emoji: "🔬" },
    ],
  },
  {
    id: "skin",
    name: "الجلد والشعر",
    emoji: "✨",
    color: "#ec4899",
    description: "صحة الجلد والشعر والأظافر",
    supplements: [
      { name: "كولاجين هيدروليزد", dose: "5-10 غرام/يوم", benefit: "مرونة الجلد وتقليل التجاعيد", evidence: "قوي", emoji: "💎" },
      { name: "بيوتين", dose: "2.5-5 ملغ/يوم", benefit: "صحة الشعر والأظافر", evidence: "متوسط", emoji: "💊" },
      { name: "فيتامين ج", dose: "500-1000 ملغ/يوم", benefit: "تصنيع الكولاجين ومضاد أكسدة", evidence: "قوي", emoji: "🍊" },
      { name: "زنك", dose: "15-30 ملغ/يوم", benefit: "إصلاح الجلد ومنع حب الشباب", evidence: "قوي", emoji: "🔬" },
    ],
  },
  {
    id: "immune",
    name: "المناعة",
    emoji: "🛡️",
    color: "#0ea5e9",
    description: "تقوية الجهاز المناعي والوقاية",
    supplements: [
      { name: "فيتامين د3", dose: "2000-5000 وحدة/يوم", benefit: "تنظيم المناعة والوقاية من العدوى", evidence: "قوي", emoji: "☀️" },
      { name: "زنك", dose: "15-30 ملغ/يوم", benefit: "دعم المناعة وتقليل مدة الزكام", evidence: "قوي", emoji: "🔬" },
      { name: "فيتامين ج", dose: "500-2000 ملغ/يوم", benefit: "مضاد أكسدة ودعم المناعة", evidence: "قوي", emoji: "🍊" },
      { name: "إلديربيري (توت البزق)", dose: "300-600 ملغ/يوم", benefit: "تقليل شدة ومدة الإنفلونزا", evidence: "متوسط", emoji: "🫐" },
    ],
  },
  {
    id: "hormones",
    name: "الهرمونات والغدد",
    emoji: "🔬",
    color: "#7c3aed",
    description: "توازن الهرمونات ودعم الغدد",
    supplements: [
      { name: "أشواغاندا", dose: "300-600 ملغ/يوم", benefit: "تقليل الكورتيزول ودعم هرمون التستوستيرون", evidence: "قوي", emoji: "🌿" },
      { name: "فيتامين د3", dose: "2000-5000 وحدة/يوم", benefit: "دعم إنتاج هرمون التستوستيرون", evidence: "قوي", emoji: "☀️" },
      { name: "الزنك", dose: "15-30 ملغ/يوم", benefit: "ضروري لإنتاج هرمون التستوستيرون", evidence: "قوي", emoji: "🔬" },
      { name: "يود", dose: "150-300 ميكروغرام/يوم", benefit: "دعم الغدة الدرقية", evidence: "قوي", emoji: "💊" },
    ],
  },
];

const evidenceColor = { قوي: "#10b981", متوسط: "#f59e0b", محدود: "#ef4444" };

export default function BodyMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);

  function handleSelect(part: BodyPart) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPart(selectedPart?.id === part.id ? null : part);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
          خريطة الجسم التفاعلية
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Instruction */}
        <View style={[styles.instruction, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "33" }]}>
          <Text style={styles.instrEmoji}>👆</Text>
          <Text style={[styles.instrText, { color: colors.primary, fontFamily: "Cairo" }]}>
            اضغط على أي عضو لرؤية المكملات الموصى بها علمياً
          </Text>
        </View>

        {/* Body parts grid */}
        <View style={styles.grid}>
          {BODY_PARTS.map((part) => (
            <Pressable
              key={part.id}
              onPress={() => handleSelect(part)}
              style={({ pressed }) => [
                styles.partCard,
                {
                  backgroundColor: selectedPart?.id === part.id ? part.color + "22" : colors.surface,
                  borderColor: selectedPart?.id === part.id ? part.color : colors.border,
                  borderWidth: selectedPart?.id === part.id ? 2 : 1,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={styles.partEmoji}>{part.emoji}</Text>
              <Text
                style={[
                  styles.partName,
                  {
                    color: selectedPart?.id === part.id ? part.color : colors.foreground,
                    fontFamily: "Cairo-Bold",
                  },
                ]}
              >
                {part.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Selected part details */}
        {selectedPart && (
          <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: selectedPart.color }]}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailEmoji}>{selectedPart.emoji}</Text>
              <View style={styles.detailTitleBox}>
                <Text style={[styles.detailTitle, { color: selectedPart.color, fontFamily: "Cairo-Black" }]}>
                  {selectedPart.name}
                </Text>
                <Text style={[styles.detailDesc, { color: colors.muted, fontFamily: "Cairo" }]}>
                  {selectedPart.description}
                </Text>
              </View>
            </View>

            <Text style={[styles.suppListTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
              المكملات الموصى بها ({selectedPart.supplements.length})
            </Text>

            {selectedPart.supplements.map((supp, i) => (
              <View
                key={i}
                style={[styles.suppItem, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <View style={styles.suppTop}>
                  <View style={styles.suppLeft}>
                    <Text style={styles.suppEmoji}>{supp.emoji}</Text>
                    <Text style={[styles.suppName, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                      {supp.name}
                    </Text>
                  </View>
                  <View style={[styles.evidenceBadge, { backgroundColor: evidenceColor[supp.evidence] + "22" }]}>
                    <Text style={[styles.evidenceText, { color: evidenceColor[supp.evidence], fontFamily: "Cairo-Bold" }]}>
                      دليل {supp.evidence}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.suppDose, { color: colors.primary, fontFamily: "Cairo-Bold" }]}>
                  الجرعة: {supp.dose}
                </Text>
                <Text style={[styles.suppBenefit, { color: colors.muted, fontFamily: "Cairo" }]}>
                  {supp.benefit}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontFamily: "Cairo-Black" },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  instruction: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  instrEmoji: { fontSize: 22 },
  instrText: { flex: 1, fontSize: 13, fontFamily: "Cairo", textAlign: "right" },
  grid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  partCard: {
    width: "47%",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    gap: 6,
  },
  partEmoji: { fontSize: 32 },
  partName: { fontSize: 13, fontFamily: "Cairo-Bold", textAlign: "center" },
  detailCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    gap: 14,
  },
  detailHeader: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 12,
  },
  detailEmoji: { fontSize: 40 },
  detailTitleBox: { flex: 1, alignItems: "flex-end" },
  detailTitle: { fontSize: 20, fontFamily: "Cairo-Black" },
  detailDesc: { fontSize: 12, fontFamily: "Cairo", textAlign: "right" },
  suppListTitle: { fontSize: 15, fontFamily: "Cairo-Bold", textAlign: "right" },
  suppItem: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    gap: 6,
  },
  suppTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  suppLeft: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  suppEmoji: { fontSize: 20 },
  suppName: { fontSize: 14, fontFamily: "Cairo-Bold" },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceText: { fontSize: 10, fontFamily: "Cairo-Bold" },
  suppDose: { fontSize: 12, fontFamily: "Cairo-Bold", textAlign: "right" },
  suppBenefit: { fontSize: 12, fontFamily: "Cairo", textAlign: "right", lineHeight: 20 },
});
