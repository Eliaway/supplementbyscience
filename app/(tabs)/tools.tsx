/**
 * الأدوات العلمية — Scientific Tools
 * حاسبة الجرعة، اختبار النقص، تحليل التحاليل، قاموس علمي، أشكال المكملات
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

I18nManager.forceRTL(true);

const SK_PROFILE = "@health_profile_v3";

const DOSE_GUIDE: Record<string, { min: number; max: number; unit: string; note: string; timing: string }> = {
  "فيتامين D3":    { min: 1000, max: 5000,  unit: "IU",        note: "يُعدَّل حسب مستوى الدم. مع K2 لتحسين التوزيع",       timing: "مع الطعام الدهني" },
  "أوميغا-3":      { min: 1,    max: 4,     unit: "غ EPA+DHA", note: "للقلب: 1-2غ، للثلاثيات: 4غ. rTG أفضل امتصاصاً",     timing: "مع الطعام" },
  "المغنيسيوم":    { min: 200,  max: 400,   unit: "مغ",        note: "Glycinate للنوم والتوتر، Malate للطاقة",              timing: "قبل النوم" },
  "الزنك":         { min: 15,   max: 40,    unit: "مغ",        note: "لا تتجاوز 40مغ يومياً. Picolinate أفضل امتصاصاً",    timing: "بعيداً عن الحديد" },
  "فيتامين C":     { min: 500,  max: 2000,  unit: "مغ",        note: "فوق 2غ قد يسبب إسهال. Liposomal أفضل امتصاصاً",      timing: "مع الطعام" },
  "الكرياتين":     { min: 3,    max: 5,     unit: "غ",         note: "0.03غ/كغ وزن جسم. Monohydrate الأكثر بحثاً",         timing: "بعد التمرين" },
  "الكولاجين":     { min: 5,    max: 15,    unit: "غ",         note: "Type I للجلد، Type II للمفاصل",                       timing: "قبل النوم" },
  "Ashwagandha":   { min: 300,  max: 600,   unit: "مغ",        note: "KSM-66 أو Sensoril أفضل. يخفض الكورتيزول",           timing: "مع الطعام" },
  "CoQ10":         { min: 100,  max: 300,   unit: "مغ",        note: "Ubiquinol أفضل فوق 40 سنة",                           timing: "مع الطعام الدهني" },
  "NAC":           { min: 600,  max: 1800,  unit: "مغ",        note: "مقسّمة على جرعتين. دعم الكبد والرئة",                timing: "بعيداً عن الطعام" },
  "Berberine":     { min: 500,  max: 1500,  unit: "مغ",        note: "مقسّمة على 3 جرعات مع الطعام. يخفض السكر",           timing: "مع الطعام" },
  "TUDCA":         { min: 250,  max: 1000,  unit: "مغ",        note: "للكبد: 250-500مغ. حماية ممتازة للكبد",               timing: "مع الطعام" },
  "فيتامين B12":   { min: 500,  max: 2000,  unit: "مغ",        note: "Methylcobalamin أفضل من Cyanocobalamin",              timing: "صباحاً" },
  "الحديد":        { min: 15,   max: 45,    unit: "مغ",        note: "مع فيتامين C لتحسين الامتصاص. Bisglycinate أفضل",    timing: "بعيداً عن الكالسيوم" },
  "الكالسيوم":     { min: 500,  max: 1200,  unit: "مغ",        note: "Citrate يُمتص بدون طعام. لا تتجاوز 500مغ بجرعة",    timing: "مع الطعام" },
  "L-Theanine":    { min: 100,  max: 400,   unit: "مغ",        note: "مع الكافيين لتحسين التركيز بدون قلق",                timing: "صباحاً" },
  "البيوتين":      { min: 2500, max: 10000, unit: "مكغ",       note: "للشعر والأظافر. قد يؤثر على نتائج بعض التحاليل",     timing: "مع الطعام" },
  "فيتامين K2":    { min: 100,  max: 200,   unit: "مكغ",       note: "MK-7 أفضل من MK-4. مع D3 لتوزيع الكالسيوم",         timing: "مع الطعام الدهني" },
};

const DEFICIENCY_QUESTIONS = [
  { id: "a", text: "هل تشعر بتعب وإرهاق مستمر حتى بعد النوم الكافي؟",   nutrients: ["فيتامين D3", "الحديد", "B12", "المغنيسيوم"] },
  { id: "b", text: "هل تعاني من تساقط الشعر أو هشاشة الأظافر؟",          nutrients: ["البيوتين", "الزنك", "الحديد", "البروتين"] },
  { id: "c", text: "هل تعاني من تشنجات عضلية أو رجفة في الجفن؟",         nutrients: ["المغنيسيوم", "البوتاسيوم", "الكالسيوم"] },
  { id: "d", text: "هل تعاني من مشاكل في التركيز والذاكرة؟",              nutrients: ["أوميغا-3", "B12", "فيتامين D3", "Bacopa"] },
  { id: "e", text: "هل تشعر بالاكتئاب أو تقلبات مزاجية متكررة؟",         nutrients: ["فيتامين D3", "أوميغا-3", "المغنيسيوم", "Saffron"] },
  { id: "f", text: "هل تعاني من مشاكل في الجهاز الهضمي (انتفاخ، إمساك)؟", nutrients: ["البروبيوتيك", "الألياف", "المغنيسيوم", "Digestive Enzymes"] },
  { id: "g", text: "هل تعاني من ألم في المفاصل أو صعوبة في الحركة؟",      nutrients: ["الكولاجين", "Glucosamine", "أوميغا-3", "فيتامين D3"] },
  { id: "h", text: "هل تمرض كثيراً أو تعاني من ضعف المناعة؟",             nutrients: ["فيتامين C", "فيتامين D3", "الزنك", "Elderberry"] },
  { id: "i", text: "هل تعاني من صعوبة في النوم أو نوم متقطع؟",            nutrients: ["المغنيسيوم", "Melatonin", "L-Theanine", "Ashwagandha"] },
  { id: "j", text: "هل تعاني من جفاف الجلد أو بطء التئام الجروح؟",        nutrients: ["فيتامين C", "الزنك", "أوميغا-3", "الكولاجين"] },
  { id: "k", text: "هل تعاني من ضعف الرؤية الليلية أو جفاف العيون؟",      nutrients: ["فيتامين A", "أوميغا-3", "Lutein", "Zeaxanthin"] },
  { id: "l", text: "هل تشعر بخدر أو وخز في الأطراف؟",                    nutrients: ["B12", "المغنيسيوم", "فيتامين D3", "Alpha Lipoic Acid"] },
];

const GLOSSARY = [
  { term: "Bioavailability",     ar: "التوافر الحيوي",        def: "نسبة المادة الفعّالة التي تصل فعلاً إلى مجرى الدم بعد الامتصاص." },
  { term: "Half-life",           ar: "عمر النصف",             def: "الوقت اللازم لانخفاض تركيز المادة في الجسم إلى النصف." },
  { term: "Chelated",            ar: "مخلّب",                 def: "شكل معدني مرتبط بحمض أميني لتحسين الامتصاص. مثال: Magnesium Glycinate." },
  { term: "Standardized Extract",ar: "مستخلص موحّد",          def: "مستخلص نباتي يضمن نسبة ثابتة من المادة الفعّالة في كل جرعة." },
  { term: "Liposomal",           ar: "ليبوزومي",              def: "تقنية تغليف المادة الفعّالة بطبقة دهنية لتحسين امتصاصها عبر جدار الخلية." },
  { term: "Adaptogen",           ar: "مادة تكيّفية",          def: "مواد طبيعية تساعد الجسم على التكيّف مع الضغط والإجهاد وتعيد التوازن الهرموني." },
  { term: "Synergistic",         ar: "تآزري",                 def: "تأثير إيجابي مضاعف عند دمج مكملين معاً، مثل فيتامين D3 مع K2." },
  { term: "Antagonistic",        ar: "تعارضي",                def: "تأثير سلبي عند دمج مكملين يتنافسان على الامتصاص." },
  { term: "RDA",                 ar: "الجرعة اليومية الموصى بها", def: "الكمية الكافية لتلبية احتياجات 97% من الأفراد الأصحاء." },
  { term: "Therapeutic Dose",    ar: "الجرعة العلاجية",       def: "الجرعة المطلوبة لتحقيق تأثير علاجي محدد، وغالباً أعلى من RDA." },
  { term: "Enteric Coated",      ar: "معوي الطلاء",           def: "طلاء خاص يمنع ذوبان الكبسولة في المعدة ويضمن إطلاق المادة في الأمعاء." },
  { term: "Third-party Tested",  ar: "اختبار مستقل",          def: "اختبار المنتج من جهة خارجية مستقلة للتحقق من النقاء والجرعة الفعلية." },
  { term: "rTG",                 ar: "ثلاثي الجليسريد المُعاد تكوينه", def: "أفضل شكل لأوميغا-3 — امتصاص أعلى بـ 70% من Ethyl Ester." },
  { term: "Ubiquinol",           ar: "يوبيكوينول",            def: "الشكل المختزل من CoQ10، أكثر نشاطاً وامتصاصاً خاصة فوق 40 سنة." },
  { term: "Methylcobalamin",     ar: "ميثيل كوبالامين",       def: "الشكل النشط من B12، جاهز للاستخدام مباشرة دون تحويل في الجسم." },
  { term: "PCT",                 ar: "علاج ما بعد الدورة",    def: "Post Cycle Therapy — بروتوكول لاستعادة الإنتاج الطبيعي للهرمونات بعد الدورة." },
  { term: "AI",                  ar: "مثبط الأروماتاز",       def: "Aromatase Inhibitor — يمنع تحويل التستوستيرون إلى إستروجين." },
  { term: "SERM",                ar: "مُعدِّل انتقائي لمستقبلات الإستروجين", def: "Selective Estrogen Receptor Modulator — يُستخدم في PCT لتحفيز إنتاج LH/FSH." },
];

const BIO_FORMS = [
  { mineral: "المغنيسيوم",  best: "Glycinate / Malate",     worst: "Oxide (4%)",        note: "Glycinate للنوم والتوتر، Malate للطاقة" },
  { mineral: "الزنك",       best: "Picolinate / Bisglycinate", worst: "Oxide",           note: "Picolinate الأكثر بحثاً" },
  { mineral: "الحديد",      best: "Bisglycinate",            worst: "Sulfate (يسبب إمساك)", note: "خذه مع فيتامين C لتحسين الامتصاص" },
  { mineral: "الكالسيوم",   best: "Citrate",                 worst: "Carbonate (يحتاج حمض)", note: "Citrate يُمتص بدون طعام" },
  { mineral: "أوميغا-3",    best: "rTG / Phospholipid",      worst: "EE (Ethyl Ester)",  note: "rTG أعلى امتصاصاً بـ 70%" },
  { mineral: "فيتامين B12", best: "Methylcobalamin",         worst: "Cyanocobalamin",    note: "Methyl جاهز للاستخدام مباشرة" },
  { mineral: "الكركمين",    best: "Meriva / BCM-95",         worst: "Standard (امتصاص ضعيف)", note: "مع الفلفل الأسود يرفع الامتصاص 2000%" },
  { mineral: "CoQ10",       best: "Ubiquinol",               worst: "Ubiquinone (فوق 40 سنة)", note: "Ubiquinol الشكل المختزل والأكثر نشاطاً" },
  { mineral: "فيتامين D3",  best: "D3 + K2 (MK-7)",         worst: "D2 (Ergocalciferol)", note: "D3 أكثر فعالية بـ 3 أضعاف من D2" },
];

// نماذج تحاليل شائعة مع القيم الطبيعية
const LAB_REFERENCE = [
  { name: "Testosterone Total", unit: "ng/dL", min: 300, max: 1000, note: "الذكور البالغون" },
  { name: "Free Testosterone",  unit: "pg/mL", min: 50,  max: 210,  note: "الذكور البالغون" },
  { name: "Estradiol (E2)",     unit: "pg/mL", min: 10,  max: 40,   note: "الذكور — أعلى من 40 يتطلب AI" },
  { name: "LH",                 unit: "IU/L",  min: 1.7, max: 8.6,  note: "منخفض مع TRT طبيعي" },
  { name: "FSH",                unit: "IU/L",  min: 1.5, max: 12.4, note: "منخفض مع TRT طبيعي" },
  { name: "SHBG",               unit: "nmol/L",min: 10,  max: 57,   note: "مرتفع يقلل التستوستيرون الحر" },
  { name: "Vitamin D (25-OH)",  unit: "ng/mL", min: 40,  max: 80,   note: "المستوى الأمثل 60-80" },
  { name: "Ferritin",           unit: "ng/mL", min: 30,  max: 300,  note: "أقل من 30 نقص حديد" },
  { name: "TSH",                unit: "mIU/L", min: 0.4, max: 4.0,  note: "أعلى من 2.5 يستدعي متابعة" },
  { name: "ALT",                unit: "U/L",   min: 7,   max: 56,   note: "مؤشر وظائف الكبد" },
  { name: "AST",                unit: "U/L",   min: 10,  max: 40,   note: "مؤشر وظائف الكبد" },
  { name: "Creatinine",         unit: "mg/dL", min: 0.7, max: 1.3,  note: "وظائف الكلى" },
  { name: "HbA1c",              unit: "%",     min: 4.0, max: 5.7,  note: "أعلى من 5.7 ما قبل السكري" },
  { name: "Cholesterol Total",  unit: "mg/dL", min: 0,   max: 200,  note: "أقل من 200 مثالي" },
  { name: "HDL",                unit: "mg/dL", min: 40,  max: 999,  note: "أعلى أفضل — الكوليسترول الجيد" },
  { name: "LDL",                unit: "mg/dL", min: 0,   max: 100,  note: "أقل من 100 مثالي" },
  { name: "Triglycerides",      unit: "mg/dL", min: 0,   max: 150,  note: "أعلى من 150 يستدعي أوميغا-3" },
  { name: "CRP (hs)",           unit: "mg/L",  min: 0,   max: 1.0,  note: "مؤشر الالتهاب — أقل من 1 مثالي" },
  { name: "IGF-1",              unit: "ng/mL", min: 100, max: 300,  note: "يرتفع مع HGH/Peptides" },
  { name: "Cortisol (AM)",      unit: "mcg/dL",min: 6,   max: 23,   note: "قياس صباحي الساعة 8" },
];

export default function ToolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTool, setActiveTool] = useState<"calc" | "test" | "labs" | "glossary" | "bio">("calc");
  const [weight, setWeight] = useState("");
  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [testDone, setTestDone] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState("");

  // Lab Analysis
  const [labText, setLabText] = useState("");
  const [labAnalysis, setLabAnalysis] = useState("");
  const [labLoading, setLabLoading] = useState(false);
  const [profileContext, setProfileContext] = useState("");

  const analyzeLabMutation = trpc.ai.analyzeLabText.useMutation();

  useEffect(() => {
    AsyncStorage.getItem("@health_profile_v3").then((str) => {
      if (str) {
        try {
          const p = JSON.parse(str);
          setProfileContext(`المستخدم: ${p.name || "غير محدد"}, ${p.age || "?"} سنة, ${p.weight || "?"} كغ`);
        } catch {}
      }
    });
  }, []);

  const analyzeLabs = async () => {
    if (!labText.trim()) return;
    setLabLoading(true);
    setLabAnalysis("");
    try {
      const result = await analyzeLabMutation.mutateAsync({
        labText: labText.trim(),
        profileContext: profileContext || undefined,
      });
      setLabAnalysis(String(result.analysis ?? ""));
    } catch {
      setLabAnalysis("حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.");
    } finally {
      setLabLoading(false);
    }
  };

  const tools = [
    { id: "calc" as const,     label: "حاسبة الجرعة",   icon: "pills.fill" as const },
    { id: "test" as const,     label: "اختبار النقص",   icon: "heart.text.square.fill" as const },
    { id: "labs" as const,     label: "تحليل التحاليل", icon: "testtube.2" as const },
    { id: "glossary" as const, label: "قاموس علمي",     icon: "book.fill" as const },
    { id: "bio" as const,      label: "أشكال المكملات", icon: "atom" as const },
  ];

  const getDeficiencyResults = () => {
    const counts: Record<string, number> = {};
    Object.entries(answers).forEach(([qId, ans]) => {
      if (ans) {
        const q = DEFICIENCY_QUESTIONS.find((q) => q.id === qId);
        q?.nutrients.forEach((n) => { counts[n] = (counts[n] || 0) + 1; });
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  };

  const filteredGlossary = GLOSSARY.filter((g) =>
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.ar.includes(glossarySearch) ||
    g.def.includes(glossarySearch)
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الأدوات العلمية</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>أدوات تحليل وتقييم متخصصة</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.toolSelector, { borderBottomColor: colors.border }]}>
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <Pressable key={tool.id} style={[styles.toolBtn, {
              backgroundColor: isActive ? colors.primary + "18" : colors.surface,
              borderColor: isActive ? colors.primary : colors.border,
            }]} onPress={() => setActiveTool(tool.id)}>
              <IconSymbol name={tool.icon} size={18} color={isActive ? colors.primary : colors.muted} />
              <Text style={[styles.toolLabel, { color: isActive ? colors.primary : colors.muted }]}>{tool.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ══ DOSE CALCULATOR ══ */}
      {activeTool === "calc" && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
          <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
            <IconSymbol name="info.circle.fill" size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.foreground }]}>
              الجرعات مبنية على الأبحاث العلمية. استشر طبيبك قبل البدء.
            </Text>
          </View>
          <View>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>وزنك (كغ) — اختياري</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              placeholder="مثال: 80" placeholderTextColor={colors.muted} keyboardType="numeric"
              value={weight} onChangeText={setWeight} textAlign="right" />
          </View>
          <View>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>اختر المكمل ({Object.keys(DOSE_GUIDE).length} مكمل)</Text>
            <View style={styles.nutrientGrid}>
              {Object.keys(DOSE_GUIDE).map((n) => (
                <Pressable key={n} style={[styles.nutrientChip, {
                  backgroundColor: selectedNutrient === n ? colors.primary + "20" : colors.surface,
                  borderColor: selectedNutrient === n ? colors.primary : colors.border,
                }]} onPress={() => setSelectedNutrient(selectedNutrient === n ? null : n)}>
                  <Text style={[styles.nutrientText, { color: selectedNutrient === n ? colors.primary : colors.foreground }]}>{n}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          {selectedNutrient && (() => {
            const guide = DOSE_GUIDE[selectedNutrient];
            const w = parseFloat(weight);
            return (
              <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.primary + "40" }]}>
                <Text style={[styles.resultTitle, { color: colors.primary }]}>{selectedNutrient}</Text>
                <View style={styles.doseRow}>
                  <View style={[styles.doseBox, { backgroundColor: colors.success + "15" }]}>
                    <Text style={[styles.doseLabel, { color: colors.muted }]}>الحد الأدنى</Text>
                    <Text style={[styles.doseValue, { color: colors.success }]}>{guide.min} {guide.unit}</Text>
                  </View>
                  <View style={[styles.doseBox, { backgroundColor: colors.primary + "15" }]}>
                    <Text style={[styles.doseLabel, { color: colors.muted }]}>الحد الأقصى</Text>
                    <Text style={[styles.doseValue, { color: colors.primary }]}>{guide.max} {guide.unit}</Text>
                  </View>
                </View>
                {!isNaN(w) && w > 0 && selectedNutrient === "الكرياتين" && (
                  <View style={[styles.doseBox, { backgroundColor: colors.accent + "15", marginBottom: 12 }]}>
                    <Text style={[styles.doseLabel, { color: colors.muted }]}>جرعتك المحسوبة</Text>
                    <Text style={[styles.doseValue, { color: colors.accent }]}>{(w * 0.03).toFixed(1)} غ</Text>
                  </View>
                )}
                <View style={[styles.noteBox, { backgroundColor: colors.surface }]}>
                  <IconSymbol name="lightbulb.fill" size={14} color={colors.warning} />
                  <Text style={[styles.noteText, { color: colors.foreground }]}>{guide.note}</Text>
                </View>
                <View style={[styles.timingBox, { backgroundColor: colors.success + "10", borderColor: colors.success + "30" }]}>
                  <IconSymbol name="clock.fill" size={14} color={colors.success} />
                  <Text style={[styles.timingText, { color: colors.success }]}>أفضل وقت: {guide.timing}</Text>
                </View>
              </View>
            );
          })()}
        </ScrollView>
      )}

      {/* ══ DEFICIENCY TEST ══ */}
      {activeTool === "test" && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          {!testDone ? (
            <>
              <View style={[styles.infoCard, { backgroundColor: colors.warning + "10", borderColor: colors.warning + "30" }]}>
                <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>
                  هذا الاختبار استرشادي فقط وليس تشخيصاً طبياً. استشر طبيبك لتحليل دم دقيق.
                </Text>
              </View>
              {DEFICIENCY_QUESTIONS.map((q) => (
                <View key={q.id} style={[styles.questionCard, { backgroundColor: colors.card, borderColor: answers[q.id] ? colors.primary + "50" : colors.border }]}>
                  <Text style={[styles.questionText, { color: colors.foreground }]}>{q.text}</Text>
                  <View style={styles.answerRow}>
                    {[true, false].map((ans) => (
                      <Pressable key={String(ans)} style={[styles.answerBtn, {
                        backgroundColor: answers[q.id] === ans ? (ans ? colors.error + "20" : colors.success + "20") : colors.surface,
                        borderColor: answers[q.id] === ans ? (ans ? colors.error : colors.success) : colors.border,
                      }]} onPress={() => setAnswers({ ...answers, [q.id]: ans })}>
                        <Text style={[styles.answerText, { color: answers[q.id] === ans ? (ans ? colors.error : colors.success) : colors.muted }]}>
                          {ans ? "نعم" : "لا"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
              <Pressable style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={() => setTestDone(true)}>
                <Text style={styles.primaryBtnText}>عرض النتائج</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={[styles.resultHeader, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                <Text style={[styles.resultHeaderText, { color: colors.foreground }]}>المكملات المحتملة حسب أعراضك</Text>
              </View>
              {getDeficiencyResults().length === 0 ? (
                <View style={styles.emptyState}>
                  <IconSymbol name="checkmark.seal.fill" size={48} color={colors.success} />
                  <Text style={[styles.emptyTitle, { color: colors.foreground }]}>لا أعراض واضحة</Text>
                  <Text style={[styles.emptyDesc, { color: colors.muted }]}>لم تُبلّغ عن أعراض تدل على نقص واضح</Text>
                </View>
              ) : getDeficiencyResults().map(([nutrient, count], i) => (
                <View key={nutrient} style={[styles.deficiencyResult, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.deficiencyRank, { backgroundColor: i === 0 ? colors.primary : colors.surface }]}>
                    <Text style={[styles.deficiencyRankText, { color: i === 0 ? "#fff" : colors.muted }]}>{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={[styles.deficiencyName, { color: colors.foreground }]}>{nutrient}</Text>
                    <Text style={[styles.deficiencyCount, { color: colors.muted }]}>مرتبط بـ {count} أعراض</Text>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: count >= 3 ? colors.error + "20" : count >= 2 ? colors.warning + "20" : colors.success + "20" }]}>
                    <Text style={[styles.priorityText, { color: count >= 3 ? colors.error : count >= 2 ? colors.warning : colors.success }]}>
                      {count >= 3 ? "أولوية عالية" : count >= 2 ? "متوسط" : "منخفض"}
                    </Text>
                  </View>
                </View>
              ))}
              <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => { setTestDone(false); setAnswers({}); }}>
                <Text style={[styles.secondaryBtnText, { color: colors.muted }]}>إعادة الاختبار</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      )}

      {/* ══ LAB ANALYSIS ══ */}
      {activeTool === "labs" && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
            <IconSymbol name="testtube.2" size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.foreground }]}>
              أدخل نتائج تحاليلك وسيقوم الذكاء الاصطناعي بتفسيرها وتوصية المكملات المناسبة.
            </Text>
          </View>

          {/* Reference Table */}
          <View style={[styles.refCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.refTitle, { color: colors.foreground }]}>القيم المرجعية الشائعة</Text>
            {LAB_REFERENCE.slice(0, 8).map((ref) => (
              <View key={ref.name} style={[styles.refRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.refName, { color: colors.foreground }]}>{ref.name}</Text>
                  <Text style={[styles.refNote, { color: colors.muted }]}>{ref.note}</Text>
                </View>
                <Text style={[styles.refRange, { color: colors.primary }]}>
                  {ref.min}–{ref.max} {ref.unit}
                </Text>
              </View>
            ))}
          </View>

          {/* Input */}
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>أدخل نتائج تحاليلك</Text>
          <TextInput
            style={[styles.labInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder={"مثال:\nTestosterone: 450 ng/dL\nVitamin D: 25 ng/mL\nALT: 45 U/L\n..."}
            placeholderTextColor={colors.muted}
            value={labText}
            onChangeText={setLabText}
            multiline
            numberOfLines={8}
            textAlign="right"
            textAlignVertical="top"
          />

          <Pressable
            style={[styles.primaryBtn, { backgroundColor: labLoading ? colors.muted : colors.primary }]}
            onPress={analyzeLabs}
            disabled={labLoading || !labText.trim()}
          >
            {labLoading ? (
              <View style={{ flexDirection: "row-reverse", gap: 8, alignItems: "center" }}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.primaryBtnText}>يحلّل التحاليل...</Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row-reverse", gap: 8, alignItems: "center" }}>
                <IconSymbol name="sparkles" size={18} color="#fff" />
                <Text style={styles.primaryBtnText}>تحليل بالذكاء الاصطناعي</Text>
              </View>
            )}
          </Pressable>

          {labAnalysis ? (
            <View style={[styles.analysisResult, { backgroundColor: colors.card, borderColor: colors.primary + "40" }]}>
              <View style={[styles.analysisResultHeader, { borderBottomColor: colors.border }]}>
                <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
                <Text style={[styles.analysisResultTitle, { color: colors.foreground }]}>نتائج التحليل</Text>
              </View>
              <Text style={[styles.analysisResultText, { color: colors.foreground }]}>{labAnalysis}</Text>
            </View>
          ) : null}
        </ScrollView>
      )}

      {/* ══ GLOSSARY ══ */}
      {activeTool === "glossary" && (
        <View style={{ flex: 1 }}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border, margin: 16 }]}>
            <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
            <TextInput style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="ابحث في المصطلحات..." placeholderTextColor={colors.muted}
              value={glossarySearch} onChangeText={setGlossarySearch} textAlign="right" />
          </View>
          <FlatList
            data={filteredGlossary}
            keyExtractor={(item) => item.term}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 10 }}
            renderItem={({ item }) => (
              <View style={[styles.glossaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.glossaryHeader}>
                  <Text style={[styles.glossaryAr, { color: colors.primary }]}>{item.ar}</Text>
                  <Text style={[styles.glossaryEn, { color: colors.muted }]}>{item.term}</Text>
                </View>
                <Text style={[styles.glossaryDef, { color: colors.foreground }]}>{item.def}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* ══ BIO FORMS ══ */}
      {activeTool === "bio" && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
          <View style={[styles.infoCard, { backgroundColor: colors.success + "10", borderColor: colors.success + "30" }]}>
            <IconSymbol name="checkmark.seal.fill" size={16} color={colors.success} />
            <Text style={[styles.infoText, { color: colors.foreground }]}>
              اختيار الشكل الصحيح للمكمل قد يضاعف فعاليته حتى 10 أضعاف.
            </Text>
          </View>
          {BIO_FORMS.map((item) => (
            <View key={item.mineral} style={[styles.bioCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.bioMineral, { color: colors.foreground }]}>{item.mineral}</Text>
              <View style={styles.bioRow}>
                <View style={[styles.bioBadge, { backgroundColor: colors.success + "15", flex: 1 }]}>
                  <IconSymbol name="checkmark.circle.fill" size={14} color={colors.success} />
                  <Text style={[styles.bioBadgeText, { color: colors.success }]}>{item.best}</Text>
                </View>
                <View style={[styles.bioBadge, { backgroundColor: colors.error + "15", flex: 1 }]}>
                  <IconSymbol name="xmark.circle.fill" size={14} color={colors.error} />
                  <Text style={[styles.bioBadgeText, { color: colors.error }]}>{item.worst}</Text>
                </View>
              </View>
              <View style={[styles.bioNote, { backgroundColor: colors.surface }]}>
                <IconSymbol name="lightbulb.fill" size={12} color={colors.warning} />
                <Text style={[styles.bioNoteText, { color: colors.muted }]}>{item.note}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  toolSelector: { flexDirection: "row-reverse", padding: 12, gap: 8, borderBottomWidth: 0.5 },
  toolBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  toolLabel: { fontSize: 13, fontWeight: "600" },
  infoCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
  sectionLabel: { fontSize: 13, fontWeight: "600", textAlign: "right", marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15 },
  nutrientGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  nutrientChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  nutrientText: { fontSize: 13, fontWeight: "600" },
  resultCard: { borderRadius: 16, padding: 16, borderWidth: 1.5, gap: 10 },
  resultTitle: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  doseRow: { flexDirection: "row-reverse", gap: 10 },
  doseBox: { flex: 1, borderRadius: 12, padding: 12, alignItems: "center", gap: 4 },
  doseLabel: { fontSize: 11 },
  doseValue: { fontSize: 20, fontWeight: "900" },
  noteBox: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8, padding: 10, borderRadius: 10 },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right" },
  timingBox: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 10, borderRadius: 10, borderWidth: 1 },
  timingText: { fontSize: 12, fontWeight: "700" },
  questionCard: { borderRadius: 14, padding: 14, borderWidth: 1 },
  questionText: { fontSize: 14, fontWeight: "600", textAlign: "right", lineHeight: 22, marginBottom: 12 },
  answerRow: { flexDirection: "row-reverse", gap: 10 },
  answerBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  answerText: { fontSize: 14, fontWeight: "700" },
  primaryBtn: { padding: 16, borderRadius: 14, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  secondaryBtn: { padding: 14, borderRadius: 14, alignItems: "center", borderWidth: 1 },
  secondaryBtnText: { fontSize: 14, fontWeight: "600" },
  resultHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  resultHeaderText: { fontSize: 16, fontWeight: "700", flex: 1, textAlign: "right" },
  emptyState: { alignItems: "center", padding: 40, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyDesc: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  deficiencyResult: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  deficiencyRank: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  deficiencyRankText: { fontSize: 14, fontWeight: "800" },
  deficiencyName: { fontSize: 15, fontWeight: "700" },
  deficiencyCount: { fontSize: 12, marginTop: 2 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  priorityText: { fontSize: 11, fontWeight: "700" },
  // Lab Analysis
  refCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  refTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", padding: 12, paddingBottom: 8 },
  refRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 0.5 },
  refName: { fontSize: 12, fontWeight: "700", textAlign: "right" },
  refNote: { fontSize: 10, textAlign: "right", marginTop: 2 },
  refRange: { fontSize: 11, fontWeight: "700" },
  labInput: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 13, minHeight: 140 },
  analysisResult: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  analysisResultHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 12, borderBottomWidth: 0.5 },
  analysisResultTitle: { fontSize: 14, fontWeight: "800" },
  analysisResultText: { fontSize: 13, lineHeight: 22, textAlign: "right", padding: 12 },
  // Glossary
  searchBox: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  glossaryCard: { borderRadius: 14, padding: 14, borderWidth: 1 },
  glossaryHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  glossaryAr: { fontSize: 15, fontWeight: "800" },
  glossaryEn: { fontSize: 12 },
  glossaryDef: { fontSize: 13, lineHeight: 20, textAlign: "right" },
  // Bio Forms
  bioCard: { borderRadius: 14, padding: 14, borderWidth: 1 },
  bioMineral: { fontSize: 16, fontWeight: "800", textAlign: "right", marginBottom: 10 },
  bioRow: { flexDirection: "row-reverse", gap: 8, marginBottom: 10 },
  bioBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 6, padding: 8, borderRadius: 10 },
  bioBadgeText: { fontSize: 11, fontWeight: "600", flex: 1, textAlign: "right" },
  bioNote: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 6, padding: 8, borderRadius: 8 },
  bioNoteText: { flex: 1, fontSize: 11, lineHeight: 16, textAlign: "right" },
});
