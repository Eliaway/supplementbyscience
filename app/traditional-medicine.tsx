/**
 * الطب التقليدي بمنظور علمي
 * Features: 128 (الطب الصيني), 129 (الأيورفيدا), 130 (الطب النبوي), 131 (الطب الأمريكي الأصلي)
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface TraditionalHerb {
  name: string;
  arabicName: string;
  scientificName: string;
  traditionalUse: string;
  scientificEvidence: "قوي" | "متوسط" | "ضعيف" | "لا يوجد";
  activeCompound: string;
  dose: string;
  caution?: string;
}

interface TraditionalSystem {
  id: string;
  name: string;
  origin: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  description: string;
  herbs: TraditionalHerb[];
}

const TRADITIONAL_SYSTEMS: TraditionalSystem[] = [
  {
    id: "chinese",
    name: "الطب الصيني التقليدي",
    origin: "الصين — أكثر من 3000 سنة",
    icon: "leaf.fill",
    color: "#EF4444",
    description: "نظام طبي شامل يعتمد على توازن الـ Qi (الطاقة الحيوية) ومبدأ اليين واليانغ",
    herbs: [
      { name: "Astragalus (Huang Qi)", arabicName: "الأستراغالوس", scientificName: "Astragalus membranaceus", traditionalUse: "تقوية المناعة وإطالة العمر", scientificEvidence: "قوي", activeCompound: "Polysaccharides, Saponins", dose: "500-1500 مغ", caution: "تجنب مع أمراض المناعة الذاتية" },
      { name: "Reishi (Ling Zhi)", arabicName: "ريشي", scientificName: "Ganoderma lucidum", traditionalUse: "الهدوء والمناعة وطول العمر", scientificEvidence: "متوسط", activeCompound: "Beta-glucans, Triterpenes", dose: "1-3 غ", caution: "قد يتفاعل مع مضادات التخثر" },
      { name: "Panax Ginseng", arabicName: "الجنسنج الكوري", scientificName: "Panax ginseng", traditionalUse: "الطاقة والقدرة الجنسية والذاكرة", scientificEvidence: "قوي", activeCompound: "Ginsenosides", dose: "200-400 مغ", caution: "تجنب مع ارتفاع ضغط الدم" },
      { name: "Schisandra (Wu Wei Zi)", arabicName: "شيزاندرا", scientificName: "Schisandra chinensis", traditionalUse: "الكبد والطاقة والتكيف مع الإجهاد", scientificEvidence: "متوسط", activeCompound: "Schisandrins, Lignans", dose: "500-1500 مغ" },
      { name: "Dong Quai", arabicName: "دونج كواي", scientificName: "Angelica sinensis", traditionalUse: "صحة المرأة والدورة الشهرية", scientificEvidence: "ضعيف", activeCompound: "Ferulic acid, Phthalides", dose: "500-1000 مغ", caution: "تجنب أثناء الحمل" },
      { name: "Cordyceps", arabicName: "كورديسيبس", scientificName: "Cordyceps sinensis", traditionalUse: "الطاقة والأداء الرياضي والكلى", scientificEvidence: "متوسط", activeCompound: "Cordycepin, Beta-glucans", dose: "1-3 غ" },
    ],
  },
  {
    id: "ayurveda",
    name: "الأيورفيدا",
    origin: "الهند — أكثر من 5000 سنة",
    icon: "leaf.fill",
    color: "#F59E0B",
    description: "نظام طبي هندي قديم يعتمد على توازن الـ Doshas (Vata, Pitta, Kapha) والعلاج الشامل",
    herbs: [
      { name: "Ashwagandha (KSM-66)", arabicName: "أشواغاندا", scientificName: "Withania somnifera", traditionalUse: "تقوية الجسم وتقليل الإجهاد وزيادة الخصوبة", scientificEvidence: "قوي", activeCompound: "Withanolides", dose: "600 مغ", caution: "تجنب مع أمراض الغدة الدرقية" },
      { name: "Turmeric (Curcumin)", arabicName: "الكركم", scientificName: "Curcuma longa", traditionalUse: "مضاد التهاب وتطهير الدم وصحة الكبد", scientificEvidence: "قوي", activeCompound: "Curcuminoids", dose: "500-2000 مغ (مع Piperine)", caution: "يتفاعل مع مضادات التخثر" },
      { name: "Triphala", arabicName: "تريفالا", scientificName: "Amalaki + Bibhitaki + Haritaki", traditionalUse: "صحة الجهاز الهضمي والتخلص من السموم", scientificEvidence: "متوسط", activeCompound: "Tannins, Polyphenols", dose: "500-1000 مغ" },
      { name: "Brahmi (Bacopa)", arabicName: "براهمي", scientificName: "Bacopa monnieri", traditionalUse: "تحسين الذاكرة والتركيز", scientificEvidence: "قوي", activeCompound: "Bacosides", dose: "300-600 مغ", caution: "يحتاج 8-12 أسبوع للتأثير" },
      { name: "Boswellia (Shallaki)", arabicName: "البخور الهندي", scientificName: "Boswellia serrata", traditionalUse: "صحة المفاصل وتقليل الالتهاب", scientificEvidence: "قوي", activeCompound: "AKBA (Boswellic acids)", dose: "300-500 مغ" },
      { name: "Shatavari", arabicName: "شاتافاري", scientificName: "Asparagus racemosus", traditionalUse: "صحة المرأة والخصوبة وزيادة الحليب", scientificEvidence: "متوسط", activeCompound: "Saponins (Shatavarins)", dose: "500-1000 مغ", caution: "تجنب مع حساسية الأسبرجس" },
    ],
  },
  {
    id: "prophetic",
    name: "الطب النبوي بمنظور علمي",
    origin: "الإسلام — القرن السابع الميلادي",
    icon: "star.fill",
    color: "#10B981",
    description: "الأعشاب والمواد الطبية المذكورة في الأحاديث النبوية الشريفة مع الدليل العلمي الحديث",
    herbs: [
      { name: "Black Seed (Nigella Sativa)", arabicName: "الحبة السوداء", scientificName: "Nigella sativa", traditionalUse: "شفاء كل داء إلا الموت (حديث شريف)", scientificEvidence: "قوي", activeCompound: "Thymoquinone", dose: "500-2000 مغ أو 1-2 ملعقة صغيرة زيت", caution: "قد يخفض ضغط الدم" },
      { name: "Honey (Raw)", arabicName: "العسل الطبيعي", scientificName: "Mel (Raw Honey)", traditionalUse: "الشفاء والتغذية", scientificEvidence: "قوي", activeCompound: "Hydrogen Peroxide, Methylglyoxal, Polyphenols", dose: "1-2 ملعقة كبيرة يومياً", caution: "تجنب للأطفال أقل من سنة" },
      { name: "Olive Oil (Extra Virgin)", arabicName: "زيت الزيتون", scientificName: "Olea europaea", traditionalUse: "الطعام والدواء والتدهين", scientificEvidence: "قوي", activeCompound: "Oleocanthal, Oleuropein, Polyphenols", dose: "2-3 ملاعق كبيرة يومياً" },
      { name: "Dates (Ajwa)", arabicName: "التمر (العجوة)", scientificName: "Phoenix dactylifera", traditionalUse: "الوقاية من السم والسحر", scientificEvidence: "متوسط", activeCompound: "Polyphenols, Flavonoids, Potassium", dose: "7 تمرات صباحاً" },
      { name: "Sidr (Lote Tree)", arabicName: "السدر", scientificName: "Ziziphus spina-christi", traditionalUse: "الغسل والشفاء", scientificEvidence: "ضعيف", activeCompound: "Saponins, Flavonoids", dose: "مستخدم موضعياً" },
      { name: "Costus (Qust)", arabicName: "القسط", scientificName: "Saussurea costus", traditionalUse: "علاج ذات الجنب والحلق", scientificEvidence: "متوسط", activeCompound: "Sesquiterpene lactones", dose: "500-1000 مغ", caution: "تجنب الجرعات العالية" },
    ],
  },
  {
    id: "native_american",
    name: "الطب الأمريكي الأصلي",
    origin: "أمريكا الشمالية — آلاف السنين",
    icon: "leaf.fill",
    color: "#F97316",
    description: "الطب التقليدي للشعوب الأصلية في أمريكا الشمالية مع التحقق العلمي الحديث",
    herbs: [
      { name: "Echinacea", arabicName: "إيكيناسيا", scientificName: "Echinacea purpurea", traditionalUse: "تقوية المناعة وعلاج الجروح", scientificEvidence: "متوسط", activeCompound: "Alkylamides, Polysaccharides", dose: "300-500 مغ × 3", caution: "لا تستخدم أكثر من 8 أسابيع متواصلة" },
      { name: "Goldenseal", arabicName: "الختم الذهبي", scientificName: "Hydrastis canadensis", traditionalUse: "مضاد للبكتيريا والتهابات الجهاز الهضمي", scientificEvidence: "متوسط", activeCompound: "Berberine, Hydrastine", dose: "500-1000 مغ", caution: "تجنب أثناء الحمل" },
      { name: "Valerian Root", arabicName: "حشيشة القط", scientificName: "Valeriana officinalis", traditionalUse: "تهدئة الأعصاب وتحسين النوم", scientificEvidence: "متوسط", activeCompound: "Valerenic acid, GABA", dose: "300-600 مغ", caution: "لا تجمع مع المهدئات" },
      { name: "Elderberry (Sambucus)", arabicName: "البلدرشون", scientificName: "Sambucus nigra", traditionalUse: "علاج نزلات البرد والإنفلونزا", scientificEvidence: "قوي", activeCompound: "Anthocyanins, Flavonoids", dose: "500-1000 مغ أو 15 مل شراب" },
      { name: "Saw Palmetto", arabicName: "نخيل المنشار", scientificName: "Serenoa repens", traditionalUse: "صحة البروستاتا والجهاز البولي", scientificEvidence: "متوسط", activeCompound: "Fatty acids, Sterols", dose: "320 مغ", caution: "قد يؤثر على هرمون DHT" },
      { name: "American Ginseng", arabicName: "الجنسنج الأمريكي", scientificName: "Panax quinquefolius", traditionalUse: "الطاقة والمناعة وتوازن السكر", scientificEvidence: "متوسط", activeCompound: "Ginsenosides (Rb1 dominant)", dose: "200-400 مغ" },
    ],
  },
];

const EVIDENCE_COLORS: Record<string, string> = {
  "قوي": "#22C55E",
  "متوسط": "#F59E0B",
  "ضعيف": "#EF4444",
  "لا يوجد": "#94A3B8",
};

export default function TraditionalMedicineScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedSystem, setSelectedSystem] = useState<TraditionalSystem | null>(null);
  const [selectedHerb, setSelectedHerb] = useState<TraditionalHerb | null>(null);

  if (selectedHerb && selectedSystem) {
    const evColor = EVIDENCE_COLORS[selectedHerb.scientificEvidence];
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: selectedSystem.color + "12", borderBottomColor: selectedSystem.color + "30" }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedHerb(null)}>
            <IconSymbol name="chevron.right" size={20} color={selectedSystem.color} />
            <Text style={[styles.backText, { color: selectedSystem.color }]}>رجوع</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{selectedHerb.arabicName}</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{selectedHerb.scientificName}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <View style={[styles.infoCard, { backgroundColor: evColor + "15", borderColor: evColor + "40" }]}>
            <View style={[styles.evidenceBadge, { backgroundColor: evColor }]}>
              <Text style={styles.evidenceBadgeText}>دليل علمي: {selectedHerb.scientificEvidence}</Text>
            </View>
          </View>
          {[
            { label: "الاسم العلمي", value: selectedHerb.scientificName, icon: "atom" as const },
            { label: "الاستخدام التقليدي", value: selectedHerb.traditionalUse, icon: "book.fill" as const },
            { label: "المركب الفعّال", value: selectedHerb.activeCompound, icon: "flask.fill" as const },
            { label: "الجرعة الموصى بها", value: selectedHerb.dose, icon: "pills.fill" as const },
          ].map((item) => (
            <View key={item.label} style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.detailHeader}>
                <IconSymbol name={item.icon} size={16} color={selectedSystem.color} />
                <Text style={[styles.detailLabel, { color: colors.muted }]}>{item.label}</Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>{item.value}</Text>
            </View>
          ))}
          {selectedHerb.caution && (
            <View style={[styles.cautionCard, { backgroundColor: colors.warning + "15", borderColor: colors.warning + "40" }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={18} color={colors.warning} />
              <Text style={[styles.cautionText, { color: colors.foreground }]}>{selectedHerb.caution}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  if (selectedSystem) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: selectedSystem.color + "12", borderBottomColor: selectedSystem.color + "30" }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedSystem(null)}>
            <IconSymbol name="chevron.right" size={20} color={selectedSystem.color} />
            <Text style={[styles.backText, { color: selectedSystem.color }]}>رجوع</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{selectedSystem.name}</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{selectedSystem.origin}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
          <View style={[styles.infoCard, { backgroundColor: selectedSystem.color + "12", borderColor: selectedSystem.color + "30" }]}>
            <Text style={[styles.infoText, { color: colors.foreground }]}>{selectedSystem.description}</Text>
          </View>
          {selectedSystem.herbs.map((herb, i) => {
            const evColor = EVIDENCE_COLORS[herb.scientificEvidence];
            return (
              <Pressable
                key={i}
                style={({ pressed }) => [styles.herbCard, { backgroundColor: colors.card, borderColor: selectedSystem.color + "30" }, pressed && { opacity: 0.8 }]}
                onPress={() => setSelectedHerb(herb)}
              >
                <View style={styles.herbHeader}>
                  <View style={[styles.herbNum, { backgroundColor: selectedSystem.color + "20" }]}>
                    <Text style={[styles.herbNumText, { color: selectedSystem.color }]}>{i + 1}</Text>
                  </View>
                  <View style={styles.herbInfo}>
                    <Text style={[styles.herbName, { color: colors.foreground }]}>{herb.arabicName}</Text>
                    <Text style={[styles.herbScientific, { color: colors.muted }]}>{herb.name}</Text>
                  </View>
                  <View style={[styles.evidenceMini, { backgroundColor: evColor + "20" }]}>
                    <Text style={[styles.evidenceMiniText, { color: evColor }]}>{herb.scientificEvidence}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={14} color={colors.muted} />
                </View>
                <Text style={[styles.herbUse, { color: colors.muted }]} numberOfLines={1}>{herb.traditionalUse}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الطب التقليدي بمنظور علمي</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>4 أنظمة طبية تقليدية مع الدليل العلمي الحديث</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.infoCard, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
          <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            هذه المعلومات للتثقيف فقط. الطب التقليدي يمكن أن يكون مفيداً لكنه ليس بديلاً عن الطب الحديث. استشر طبيبك دائماً.
          </Text>
        </View>

        {TRADITIONAL_SYSTEMS.map((system) => (
          <Pressable
            key={system.id}
            style={({ pressed }) => [styles.systemCard, { backgroundColor: colors.card, borderColor: system.color + "40" }, pressed && { opacity: 0.8 }]}
            onPress={() => setSelectedSystem(system)}
          >
            <View style={styles.systemHeader}>
              <View style={[styles.systemIcon, { backgroundColor: system.color + "20" }]}>
                <IconSymbol name={system.icon} size={28} color={system.color} />
              </View>
              <View style={styles.systemInfo}>
                <Text style={[styles.systemName, { color: colors.foreground }]}>{system.name}</Text>
                <Text style={[styles.systemOrigin, { color: system.color }]}>{system.origin}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </View>
            <Text style={[styles.systemDesc, { color: colors.muted }]} numberOfLines={2}>{system.description}</Text>
            <View style={styles.evidenceRow}>
              {system.herbs.slice(0, 4).map((herb, i) => {
                const evColor = EVIDENCE_COLORS[herb.scientificEvidence];
                return (
                  <View key={i} style={[styles.herbChip, { backgroundColor: evColor + "15", borderColor: evColor + "30" }]}>
                    <Text style={[styles.herbChipText, { color: evColor }]}>{herb.arabicName}</Text>
                  </View>
                );
              })}
              {system.herbs.length > 4 && (
                <View style={[styles.herbChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.herbChipText, { color: colors.muted }]}>+{system.herbs.length - 4}</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}

        {/* Legend */}
        <View style={[styles.legendCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.legendTitle, { color: colors.foreground }]}>مستوى الدليل العلمي</Text>
          {Object.entries(EVIDENCE_COLORS).map(([level, color]) => (
            <View key={level} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={[styles.legendText, { color: colors.foreground }]}>{level}</Text>
            </View>
          ))}
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
  infoCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right" },
  systemCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  systemHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  systemIcon: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  systemInfo: { flex: 1, alignItems: "flex-end" },
  systemName: { fontSize: 16, fontWeight: "800" },
  systemOrigin: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  systemDesc: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  evidenceRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  herbChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  herbChipText: { fontSize: 11, fontWeight: "600" },
  herbCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  herbHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  herbNum: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  herbNumText: { fontSize: 13, fontWeight: "800" },
  herbInfo: { flex: 1, alignItems: "flex-end" },
  herbName: { fontSize: 14, fontWeight: "800" },
  herbScientific: { fontSize: 11, marginTop: 1 },
  herbUse: { fontSize: 12, textAlign: "right" },
  evidenceMini: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  evidenceMiniText: { fontSize: 10, fontWeight: "700" },
  evidenceBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, alignSelf: "flex-end" },
  evidenceBadgeText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  detailCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  detailHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  detailLabel: { fontSize: 12, fontWeight: "600" },
  detailValue: { fontSize: 14, lineHeight: 20, textAlign: "right" },
  cautionCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  cautionText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right" },
  legendCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  legendTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 4 },
  legendRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13 },
});
