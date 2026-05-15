/**
 * الأدوات العلمية — Scientific Tools
 * حاسبة الجرعة، اختبار النقص، تحليل التحاليل، قاموس علمي، أشكال المكملات،
 * حاسبة BMI، محلل نمط الحياة، خريطة التفاعلات، تقييم التعب المزمن
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
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
  "فيتامين B12":   { min: 500,  max: 2000,  unit: "مكغ",       note: "Methylcobalamin أفضل من Cyanocobalamin",              timing: "صباحاً" },
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
  { term: "Autophagy",           ar: "الالتهام الذاتي",       def: "عملية تنظيف الخلايا التالفة — تُحفَّز بالصيام والتمرين." },
  { term: "Senolytic",           ar: "مُزيل الخلايا الشيخوخية", def: "مواد تُزيل الخلايا الشيخوخية المتراكمة التي تسبب الالتهاب." },
  { term: "Nootropic",           ar: "معزز إدراكي",           def: "مواد تحسّن الوظائف المعرفية كالذاكرة والتركيز والإبداع." },
  { term: "Ergogenic",           ar: "معزز الأداء",           def: "مواد تحسّن الأداء الرياضي أو تقلل التعب." },
  { term: "MTHFR",               ar: "جين MTHFR",             def: "طفرة جينية تؤثر على معالجة حمض الفوليك — يحتاج أصحابها Methylfolate بدلاً من Folic Acid." },
  { term: "Biofilm",             ar: "الغشاء الحيوي",         def: "طبقة واقية تبنيها البكتيريا تجعلها مقاومة للمضادات الحيوية." },
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

// ─── Interaction Map Data ───
const INTERACTIONS = [
  { a: "فيتامين D3",   b: "فيتامين K2",    type: "synergy",   note: "D3 يرفع الكالسيوم، K2 يوجّهه للعظام ويمنع ترسّبه في الشرايين." },
  { a: "أوميغا-3",     b: "فيتامين E",     type: "synergy",   note: "E يحمي أوميغا-3 من الأكسدة ويطيل فعاليته." },
  { a: "الزنك",        b: "الحديد",        type: "conflict",  note: "يتنافسان على نفس ناقلات الامتصاص. خذهما في أوقات مختلفة." },
  { a: "الكالسيوم",    b: "الحديد",        type: "conflict",  note: "الكالسيوم يقلل امتصاص الحديد بنسبة 60%. فاصل بينهما ساعتين." },
  { a: "المغنيسيوم",   b: "فيتامين D3",    type: "synergy",   note: "المغنيسيوم ضروري لتفعيل فيتامين D في الجسم." },
  { a: "الكرياتين",    b: "الكافيين",      type: "conflict",  note: "الكافيين قد يقلل فعالية الكرياتين — لا تأخذهما معاً." },
  { a: "NAC",          b: "فيتامين C",     type: "synergy",   note: "كلاهما يرفع الغلوتاثيون ويعمل بشكل تآزري." },
  { a: "فيتامين B12",  b: "حمض الفوليك",  type: "synergy",   note: "يعملان معاً في دورة الميثيلة — نقص أحدهما يؤثر على الآخر." },
  { a: "الزنك",        b: "النحاس",        type: "conflict",  note: "الزنك الزائد يستنزف النحاس. أضف 1-2 مغ نحاس مع الزنك." },
  { a: "أوميغا-3",     b: "وارفارين",      type: "warning",   note: "أوميغا-3 يرقق الدم — استشر طبيبك إذا كنت على وارفارين." },
  { a: "Ashwagandha",  b: "أدوية الغدة الدرقية", type: "warning", note: "Ashwagandha قد يرفع T3/T4 — راقب مستوياتك." },
  { a: "Berberine",    b: "الميتفورمين",   type: "warning",   note: "كلاهما يخفض السكر — قد يسبب انخفاضاً مفرطاً." },
  { a: "فيتامين C",    b: "الحديد",        type: "synergy",   note: "فيتامين C يحوّل الحديد غير الهيمي إلى شكل أكثر امتصاصاً." },
  { a: "CoQ10",        b: "الستاتين",      type: "synergy",   note: "الستاتين يستنزف CoQ10 — إضافته ضرورية لمن يأخذ الستاتين." },
  { a: "المغنيسيوم",   b: "الكالسيوم",     type: "balance",   note: "نسبة Mg:Ca المثلى 1:2. الكالسيوم الزائد يستنزف المغنيسيوم." },
];

// ─── Fatigue Assessment ───
const FATIGUE_QUESTIONS = [
  { id: "f1", text: "هل تشعر بإرهاق شديد حتى بعد 8 ساعات نوم؟", weight: 3 },
  { id: "f2", text: "هل يزداد تعبك بعد أي مجهود بسيط؟", weight: 3 },
  { id: "f3", text: "هل تعاني من ضباب ذهني وصعوبة في التفكير؟", weight: 2 },
  { id: "f4", text: "هل تعاني من ألم عضلي أو مفصلي مزمن؟", weight: 2 },
  { id: "f5", text: "هل تعاني من صداع متكرر؟", weight: 1 },
  { id: "f6", text: "هل تعاني من حساسية للضوء أو الصوت؟", weight: 2 },
  { id: "f7", text: "هل تعاني من اضطرابات في الجهاز الهضمي؟", weight: 1 },
  { id: "f8", text: "هل تعاني من اضطرابات في النوم رغم التعب؟", weight: 2 },
  { id: "f9", text: "هل انخفض مستوى نشاطك بشكل ملحوظ خلال 6 أشهر؟", weight: 3 },
  { id: "f10", text: "هل تعاني من تقلبات مزاجية أو اكتئاب؟", weight: 1 },
];

const FATIGUE_SUPPLEMENTS = [
  { name: "فيتامين D3", dose: "5000 IU", reason: "نقصه من أكثر أسباب التعب المزمن" },
  { name: "فيتامين B12 (Methylcobalamin)", dose: "1000-2000 مكغ", reason: "ضروري لإنتاج الطاقة في الخلايا" },
  { name: "المغنيسيوم Malate", dose: "300-400 مغ", reason: "Malate يدخل في دورة Krebs لإنتاج ATP" },
  { name: "CoQ10 (Ubiquinol)", dose: "200-300 مغ", reason: "محرك الطاقة في الميتوكوندريا" },
  { name: "أوميغا-3", dose: "2 غ", reason: "يقلل الالتهاب المزمن المسبب للتعب" },
  { name: "Ashwagandha", dose: "300-600 مغ", reason: "يخفض الكورتيزول ويحسن الطاقة" },
  { name: "Rhodiola Rosea", dose: "200-400 مغ", reason: "Adaptogen يحسن التحمل ويقلل التعب" },
  { name: "الحديد (إذا كان Ferritin منخفض)", dose: "حسب التحليل", reason: "فقر الدم من أكثر أسباب التعب" },
];

// ─── Lifestyle Analyzer ───
const LIFESTYLE_QUESTIONS = [
  { id: "l1", text: "كم ساعة تنام في المتوسط؟", options: ["أقل من 6", "6-7", "7-8", "أكثر من 8"], scores: [0, 1, 3, 2] },
  { id: "l2", text: "كم مرة تمارس الرياضة أسبوعياً؟", options: ["لا أمارس", "1-2", "3-4", "5+"], scores: [0, 1, 3, 2] },
  { id: "l3", text: "كيف تصف مستوى توترك اليومي؟", options: ["مرتفع جداً", "مرتفع", "متوسط", "منخفض"], scores: [0, 1, 2, 3] },
  { id: "l4", text: "كم كوب ماء تشرب يومياً؟", options: ["أقل من 4", "4-6", "6-8", "أكثر من 8"], scores: [0, 1, 2, 3] },
  { id: "l5", text: "كيف تصف نظامك الغذائي؟", options: ["وجبات سريعة دائماً", "غير منتظم", "متوسط", "صحي ومتوازن"], scores: [0, 1, 2, 3] },
  { id: "l6", text: "هل تتعرض لأشعة الشمس يومياً؟", options: ["نادراً", "أحياناً", "معظم الأيام", "يومياً"], scores: [0, 1, 2, 3] },
  { id: "l7", text: "كم ساعة تجلس أمام الشاشات يومياً؟", options: ["أكثر من 10", "8-10", "4-8", "أقل من 4"], scores: [0, 1, 2, 3] },
  { id: "l8", text: "هل تدخن أو تتناول الكحول؟", options: ["كلاهما", "أحدهما", "أحياناً", "لا"], scores: [0, 1, 2, 3] },
];

type ToolTab = "calc" | "test" | "labs" | "glossary" | "bio" | "bmi" | "lifestyle" | "interactions" | "fatigue";

export default function ToolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTool, setActiveTool] = useState<ToolTab>("calc");
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

  // BMI
  const [bmiHeight, setBmiHeight] = useState("");
  const [bmiWeight, setBmiWeight] = useState("");

  // Lifestyle
  const [lifestyleAnswers, setLifestyleAnswers] = useState<Record<string, number>>({});
  const [lifestyleDone, setLifestyleDone] = useState(false);

  // Fatigue
  const [fatigueAnswers, setFatigueAnswers] = useState<Record<string, boolean>>({});
  const [fatigueDone, setFatigueDone] = useState(false);

  const analyzeLabMutation = trpc.ai.analyzeLabText.useMutation();

  useEffect(() => {
    AsyncStorage.getItem("@health_profile_v3").then((str) => {
      if (str) {
        try {
          const p = JSON.parse(str);
          setProfileContext(`المستخدم: ${p.name || "غير محدد"}, ${p.age || "?"} سنة, ${p.weight || "?"} كغ`);
          if (p.weight) setWeight(String(p.weight));
          if (p.weight) setBmiWeight(String(p.weight));
          if (p.height) setBmiHeight(String(p.height));
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

  const getBMI = () => {
    const h = parseFloat(bmiHeight) / 100;
    const w = parseFloat(bmiWeight);
    if (!h || !w || h <= 0) return null;
    return w / (h * h);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "نقص الوزن", color: colors.warning, supplements: ["البروتين", "فيتامين D3", "الزنك", "الحديد"] };
    if (bmi < 25) return { label: "وزن طبيعي ✅", color: colors.success, supplements: ["فيتامين D3", "أوميغا-3", "المغنيسيوم"] };
    if (bmi < 30) return { label: "زيادة وزن", color: colors.warning, supplements: ["Berberine", "أوميغا-3", "الكروم", "الألياف"] };
    return { label: "سمنة", color: colors.error, supplements: ["Berberine", "Glucomannan", "أوميغا-3", "فيتامين D3"] };
  };

  const getLifestyleScore = () => {
    const total = Object.values(lifestyleAnswers).reduce((a, b) => a + b, 0);
    const max = LIFESTYLE_QUESTIONS.length * 3;
    return Math.round((total / max) * 100);
  };

  const getLifestyleCategory = (score: number) => {
    if (score >= 80) return { label: "ممتاز", color: colors.success, icon: "🌟" };
    if (score >= 60) return { label: "جيد", color: colors.primary, icon: "👍" };
    if (score >= 40) return { label: "متوسط", color: colors.warning, icon: "⚠️" };
    return { label: "يحتاج تحسين", color: colors.error, icon: "🔴" };
  };

  const getFatigueScore = () => {
    return FATIGUE_QUESTIONS.reduce((sum, q) => {
      return sum + (fatigueAnswers[q.id] ? q.weight : 0);
    }, 0);
  };

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

  const tools: { id: ToolTab; label: string; icon: Parameters<typeof IconSymbol>[0]["name"] }[] = [
    { id: "calc",         label: "جرعة",          icon: "pills.fill" },
    { id: "test",         label: "نقص",            icon: "heart.text.square.fill" },
    { id: "labs",         label: "تحاليل",         icon: "testtube.2" },
    { id: "bmi",          label: "BMI",             icon: "figure.walk" },
    { id: "lifestyle",    label: "نمط الحياة",     icon: "chart.bar.fill" },
    { id: "interactions", label: "التفاعلات",      icon: "arrow.left.arrow.right" },
    { id: "fatigue",      label: "التعب المزمن",   icon: "waveform" },
    { id: "glossary",     label: "قاموس",          icon: "book.fill" },
    { id: "bio",          label: "أشكال",          icon: "atom" },
  ];

  const bmi = getBMI();

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

      {/* ══ BMI CALCULATOR ══ */}
      {activeTool === "bmi" && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
          <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
            <IconSymbol name="figure.walk" size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.foreground }]}>
              مؤشر كتلة الجسم (BMI) يساعد في تحديد المكملات الأنسب لوزنك الحالي.
            </Text>
          </View>
          <View style={{ gap: 12 }}>
            <View>
              <Text style={[styles.sectionLabel, { color: colors.muted }]}>الطول (سم)</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                placeholder="مثال: 175" placeholderTextColor={colors.muted} keyboardType="numeric"
                value={bmiHeight} onChangeText={setBmiHeight} textAlign="right" />
            </View>
            <View>
              <Text style={[styles.sectionLabel, { color: colors.muted }]}>الوزن (كغ)</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                placeholder="مثال: 80" placeholderTextColor={colors.muted} keyboardType="numeric"
                value={bmiWeight} onChangeText={setBmiWeight} textAlign="right" />
            </View>
          </View>
          {bmi !== null && (() => {
            const cat = getBMICategory(bmi);
            return (
              <View style={[styles.bmiResult, { backgroundColor: colors.card, borderColor: cat.color + "40" }]}>
                <View style={[styles.bmiCircle, { borderColor: cat.color }]}>
                  <Text style={[styles.bmiValue, { color: cat.color }]}>{bmi.toFixed(1)}</Text>
                  <Text style={[styles.bmiUnit, { color: colors.muted }]}>BMI</Text>
                </View>
                <Text style={[styles.bmiCategory, { color: cat.color }]}>{cat.label}</Text>
                <View style={[styles.bmiScale, { backgroundColor: colors.surface }]}>
                  {[
                    { label: "نقص", range: "< 18.5", color: colors.warning },
                    { label: "طبيعي", range: "18.5-25", color: colors.success },
                    { label: "زيادة", range: "25-30", color: colors.warning },
                    { label: "سمنة", range: "> 30", color: colors.error },
                  ].map((s) => (
                    <View key={s.label} style={styles.bmiScaleItem}>
                      <View style={[styles.bmiScaleDot, { backgroundColor: s.color }]} />
                      <Text style={[styles.bmiScaleLabel, { color: colors.muted }]}>{s.label}</Text>
                      <Text style={[styles.bmiScaleRange, { color: colors.muted }]}>{s.range}</Text>
                    </View>
                  ))}
                </View>
                <Text style={[styles.sectionLabel, { color: colors.foreground, marginTop: 8 }]}>المكملات الموصى بها</Text>
                <View style={styles.nutrientGrid}>
                  {cat.supplements.map((s) => (
                    <View key={s} style={[styles.nutrientChip, { backgroundColor: cat.color + "15", borderColor: cat.color + "40" }]}>
                      <Text style={[styles.nutrientText, { color: cat.color }]}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })()}
        </ScrollView>
      )}

      {/* ══ LIFESTYLE ANALYZER ══ */}
      {activeTool === "lifestyle" && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          {!lifestyleDone ? (
            <>
              <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
                <IconSymbol name="chart.bar.fill" size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>
                  أجب على هذه الأسئلة لتحليل نمط حياتك وتحديد المكملات الأنسب لك.
                </Text>
              </View>
              {LIFESTYLE_QUESTIONS.map((q) => (
                <View key={q.id} style={[styles.questionCard, { backgroundColor: colors.card, borderColor: lifestyleAnswers[q.id] !== undefined ? colors.primary + "50" : colors.border }]}>
                  <Text style={[styles.questionText, { color: colors.foreground }]}>{q.text}</Text>
                  <View style={{ gap: 8 }}>
                    {q.options.map((opt, i) => (
                      <Pressable key={opt} style={[styles.lifestyleOption, {
                        backgroundColor: lifestyleAnswers[q.id] === q.scores[i] ? colors.primary + "20" : colors.surface,
                        borderColor: lifestyleAnswers[q.id] === q.scores[i] ? colors.primary : colors.border,
                      }]} onPress={() => setLifestyleAnswers({ ...lifestyleAnswers, [q.id]: q.scores[i] })}>
                        <Text style={[styles.lifestyleOptionText, { color: lifestyleAnswers[q.id] === q.scores[i] ? colors.primary : colors.foreground }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
              <Pressable style={[styles.primaryBtn, { backgroundColor: Object.keys(lifestyleAnswers).length < LIFESTYLE_QUESTIONS.length ? colors.muted : colors.primary }]}
                onPress={() => setLifestyleDone(true)}
                disabled={Object.keys(lifestyleAnswers).length < LIFESTYLE_QUESTIONS.length}>
                <Text style={styles.primaryBtnText}>تحليل نمط حياتي</Text>
              </Pressable>
            </>
          ) : (
            <>
              {(() => {
                const score = getLifestyleScore();
                const cat = getLifestyleCategory(score);
                return (
                  <>
                    <View style={[styles.lifestyleResult, { backgroundColor: colors.card, borderColor: cat.color + "40" }]}>
                      <Text style={styles.lifestyleResultEmoji}>{cat.icon}</Text>
                      <Text style={[styles.lifestyleScore, { color: cat.color }]}>{score}%</Text>
                      <Text style={[styles.lifestyleCategory, { color: cat.color }]}>{cat.label}</Text>
                      <View style={[styles.lifestyleBar, { backgroundColor: colors.surface }]}>
                        <View style={[styles.lifestyleBarFill, { width: `${score}%` as any, backgroundColor: cat.color }]} />
                      </View>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.warning + "10", borderColor: colors.warning + "30" }]}>
                      <IconSymbol name="lightbulb.fill" size={16} color={colors.warning} />
                      <Text style={[styles.infoText, { color: colors.foreground }]}>
                        {score >= 80
                          ? "نمط حياتك ممتاز! المكملات الأساسية كافية لك."
                          : score >= 60
                          ? "نمط حياتك جيد. بعض التحسينات ستزيد فعالية المكملات."
                          : score >= 40
                          ? "نمط حياتك يحتاج تحسيناً. المكملات وحدها لن تكفي بدون تغيير العادات."
                          : "نمط حياتك يحتاج مراجعة شاملة. ابدأ بتحسين النوم والتغذية أولاً."}
                      </Text>
                    </View>
                  </>
                );
              })()}
              <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => { setLifestyleDone(false); setLifestyleAnswers({}); }}>
                <Text style={[styles.secondaryBtnText, { color: colors.muted }]}>إعادة التحليل</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      )}

      {/* ══ INTERACTION MAP ══ */}
      {activeTool === "interactions" && (
        <FlatList
          data={INTERACTIONS}
          keyExtractor={(item) => `${item.a}-${item.b}`}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          ListHeaderComponent={() => (
            <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30", marginBottom: 4 }]}>
              <IconSymbol name="arrow.left.arrow.right" size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                خريطة التفاعلات بين المكملات — تآزر ✅، تعارض ⚠️، تحذير ❌
              </Text>
            </View>
          )}
          renderItem={({ item }) => {
            const typeColor = item.type === "synergy" ? colors.success : item.type === "conflict" ? colors.warning : item.type === "warning" ? colors.error : colors.primary;
            const typeLabel = item.type === "synergy" ? "تآزر ✅" : item.type === "conflict" ? "تعارض ⚠️" : item.type === "warning" ? "تحذير ❌" : "توازن ⚖️";
            return (
              <View style={[styles.interactionCard, { backgroundColor: colors.card, borderColor: typeColor + "40", borderLeftColor: typeColor, borderLeftWidth: 4 }]}>
                <View style={styles.interactionPair}>
                  <Text style={[styles.interactionName, { color: colors.foreground }]}>{item.a}</Text>
                  <View style={[styles.interactionBadge, { backgroundColor: typeColor + "20" }]}>
                    <Text style={[styles.interactionBadgeText, { color: typeColor }]}>{typeLabel}</Text>
                  </View>
                  <Text style={[styles.interactionName, { color: colors.foreground }]}>{item.b}</Text>
                </View>
                <Text style={[styles.interactionNote, { color: colors.muted }]}>{item.note}</Text>
              </View>
            );
          }}
        />
      )}

      {/* ══ FATIGUE ASSESSMENT ══ */}
      {activeTool === "fatigue" && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
          {!fatigueDone ? (
            <>
              <View style={[styles.infoCard, { backgroundColor: colors.warning + "10", borderColor: colors.warning + "30" }]}>
                <IconSymbol name="waveform" size={16} color={colors.warning} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>
                  أداة تقييم التعب المزمن (CFS/ME). هذا الاختبار استرشادي — استشر طبيبك للتشخيص الدقيق.
                </Text>
              </View>
              {FATIGUE_QUESTIONS.map((q) => (
                <View key={q.id} style={[styles.questionCard, { backgroundColor: colors.card, borderColor: fatigueAnswers[q.id] ? colors.error + "50" : colors.border }]}>
                  <Text style={[styles.questionText, { color: colors.foreground }]}>{q.text}</Text>
                  <View style={styles.answerRow}>
                    {[true, false].map((ans) => (
                      <Pressable key={String(ans)} style={[styles.answerBtn, {
                        backgroundColor: fatigueAnswers[q.id] === ans ? (ans ? colors.error + "20" : colors.success + "20") : colors.surface,
                        borderColor: fatigueAnswers[q.id] === ans ? (ans ? colors.error : colors.success) : colors.border,
                      }]} onPress={() => setFatigueAnswers({ ...fatigueAnswers, [q.id]: ans })}>
                        <Text style={[styles.answerText, { color: fatigueAnswers[q.id] === ans ? (ans ? colors.error : colors.success) : colors.muted }]}>
                          {ans ? "نعم" : "لا"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
              <Pressable style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={() => setFatigueDone(true)}>
                <Text style={styles.primaryBtnText}>تقييم التعب</Text>
              </Pressable>
            </>
          ) : (
            <>
              {(() => {
                const score = getFatigueScore();
                const maxScore = FATIGUE_QUESTIONS.reduce((s, q) => s + q.weight, 0);
                const pct = Math.round((score / maxScore) * 100);
                const level = score >= 15 ? "شديد" : score >= 10 ? "متوسط" : score >= 5 ? "خفيف" : "طبيعي";
                const levelColor = score >= 15 ? colors.error : score >= 10 ? colors.warning : score >= 5 ? colors.primary : colors.success;
                return (
                  <>
                    <View style={[styles.fatigueResult, { backgroundColor: colors.card, borderColor: levelColor + "40" }]}>
                      <Text style={[styles.fatigueLevel, { color: levelColor }]}>مستوى التعب: {level}</Text>
                      <Text style={[styles.fatigueScore, { color: colors.muted }]}>النقاط: {score}/{maxScore} ({pct}%)</Text>
                      <View style={[styles.lifestyleBar, { backgroundColor: colors.surface, marginTop: 12 }]}>
                        <View style={[styles.lifestyleBarFill, { width: `${pct}%` as any, backgroundColor: levelColor }]} />
                      </View>
                    </View>
                    {score >= 5 && (
                      <>
                        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>المكملات الموصى بها للتعب المزمن</Text>
                        {FATIGUE_SUPPLEMENTS.map((s) => (
                          <View key={s.name} style={[styles.fatigueSuppCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.fatigueSuppName, { color: colors.primary }]}>{s.name}</Text>
                            <Text style={[styles.fatigueSuppDose, { color: colors.muted }]}>الجرعة: {s.dose}</Text>
                            <Text style={[styles.fatigueSuppReason, { color: colors.foreground }]}>{s.reason}</Text>
                          </View>
                        ))}
                      </>
                    )}
                    {score < 5 && (
                      <View style={styles.emptyState}>
                        <IconSymbol name="checkmark.seal.fill" size={48} color={colors.success} />
                        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>مستوى طاقة جيد</Text>
                        <Text style={[styles.emptyDesc, { color: colors.muted }]}>لا تظهر عليك علامات التعب المزمن</Text>
                      </View>
                    )}
                    <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => { setFatigueDone(false); setFatigueAnswers({}); }}>
                      <Text style={[styles.secondaryBtnText, { color: colors.muted }]}>إعادة التقييم</Text>
                    </Pressable>
                  </>
                );
              })()}
            </>
          )}
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

          {/* ── Extra Navigation Cards ── */}
          <View style={[styles.infoCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30", marginTop: 8 }]}>
            <IconSymbol name="sparkles" size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.foreground }]}>أدوات إضافية — انقر للوصول</Text>
          </View>
          {[
            { label: "دليل الجودة والشهادات", icon: "checkmark.seal.fill" as const, route: "/quality-guide", color: colors.success },
            { label: "الأساطير والحقائق", icon: "exclamationmark.triangle.fill" as const, route: "/myths-facts", color: colors.warning },
            { label: "حاسبة الجرعات المتقدمة", icon: "pills.fill" as const, route: "/dose-calculator", color: colors.primary },
            { label: "دليل توقيت المكملات", icon: "clock.fill" as const, route: "/timing-guide", color: colors.error },
            { label: "اختبار المعرفة العلمية", icon: "brain.head.profile" as const, route: "/knowledge-quiz", color: colors.primary },
            { label: "الجلد والشعر والجمال", icon: "sparkles" as const, route: "/skin-beauty", color: colors.warning },
          ].map((item) => (
            <Pressable key={item.route} style={[styles.extraToolCard, { backgroundColor: colors.card, borderColor: item.color + "40" }]}
              onPress={() => router.push(item.route as any)}>
              <IconSymbol name={item.icon} size={22} color={item.color} />
              <Text style={[styles.extraToolLabel, { color: colors.foreground }]}>{item.label}</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </Pressable>
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
  // BMI
  bmiResult: { borderRadius: 16, padding: 20, borderWidth: 1.5, alignItems: "center", gap: 12 },
  bmiCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, alignItems: "center", justifyContent: "center" },
  bmiValue: { fontSize: 28, fontWeight: "900" },
  bmiUnit: { fontSize: 12 },
  bmiCategory: { fontSize: 18, fontWeight: "800" },
  bmiScale: { width: "100%", borderRadius: 12, padding: 12, gap: 8 },
  bmiScaleItem: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  bmiScaleDot: { width: 10, height: 10, borderRadius: 5 },
  bmiScaleLabel: { fontSize: 12, fontWeight: "600", width: 50 },
  bmiScaleRange: { fontSize: 11 },
  // Lifestyle
  lifestyleOption: { padding: 12, borderRadius: 10, borderWidth: 1, alignItems: "flex-end" },
  lifestyleOptionText: { fontSize: 14, fontWeight: "600" },
  lifestyleResult: { borderRadius: 16, padding: 20, borderWidth: 1.5, alignItems: "center", gap: 8 },
  lifestyleResultEmoji: { fontSize: 48 },
  lifestyleScore: { fontSize: 36, fontWeight: "900" },
  lifestyleCategory: { fontSize: 18, fontWeight: "800" },
  lifestyleBar: { width: "100%", height: 12, borderRadius: 6, overflow: "hidden" },
  lifestyleBarFill: { height: "100%", borderRadius: 6 },
  // Interactions
  interactionCard: { borderRadius: 12, padding: 14, borderWidth: 1, gap: 8 },
  interactionPair: { flexDirection: "row-reverse", alignItems: "center", gap: 8, justifyContent: "space-between" },
  interactionName: { fontSize: 13, fontWeight: "800", flex: 1, textAlign: "center" },
  interactionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  interactionBadgeText: { fontSize: 11, fontWeight: "700" },
  interactionNote: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  // Fatigue
  fatigueResult: { borderRadius: 16, padding: 20, borderWidth: 1.5, alignItems: "center", gap: 8 },
  fatigueLevel: { fontSize: 20, fontWeight: "900" },
  fatigueScore: { fontSize: 14 },
  fatigueSuppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 4 },
  fatigueSuppName: { fontSize: 14, fontWeight: "800", textAlign: "right" },
  fatigueSuppDose: { fontSize: 12, textAlign: "right" },
  fatigueSuppReason: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  // Extra Tool Cards
  extraToolCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  extraToolLabel: { flex: 1, fontSize: 14, fontWeight: "700", textAlign: "right" },
});
