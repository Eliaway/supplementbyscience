/**
 * البروتوكولات المتخصصة — Specialized Health Protocols
 * بروتوكولات صحة الكبد، القلب، الكلى، الهرمونات، النوم، الجلد، المناعة، الدماغ، الرياضة
 */
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
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface Protocol {
  id: string;
  name: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  description: string;
  duration: string;
  difficulty: "سهل" | "متوسط" | "متقدم";
  supplements: {
    name: string;
    dose: string;
    timing: string;
    reason: string;
    priority: "أساسي" | "مساعد" | "اختياري";
  }[];
  lifestyle: string[];
  warnings: string[];
  expectedResults: string;
}

const PROTOCOLS: Protocol[] = [
  {
    id: "liver",
    name: "صحة الكبد",
    icon: "shield.fill",
    color: "#22C55E",
    description: "بروتوكول شامل لدعم وظائف الكبد وحمايته من التلف، مثالي لمن يستخدم أدوية أو مكملات مكثفة.",
    duration: "3-6 أشهر",
    difficulty: "متوسط",
    supplements: [
      { name: "TUDCA", dose: "500 مغ", timing: "مع الطعام", reason: "أقوى حامي للكبد — يقلل الإجهاد الخلوي", priority: "أساسي" },
      { name: "NAC", dose: "600 مغ مرتين", timing: "بعيداً عن الطعام", reason: "يرفع الغلوتاثيون — مضاد أكسدة رئيسي للكبد", priority: "أساسي" },
      { name: "Milk Thistle (Silymarin)", dose: "400-600 مغ", timing: "مع الطعام", reason: "يجدد خلايا الكبد ويحميها من السموم", priority: "أساسي" },
      { name: "Alpha Lipoic Acid", dose: "300-600 مغ", timing: "بعيداً عن الطعام", reason: "مضاد أكسدة قوي يعمل في الخلايا الدهنية والمائية", priority: "مساعد" },
      { name: "فيتامين E (Tocotrienols)", dose: "200-400 IU", timing: "مع الطعام الدهني", reason: "يقلل التهاب الكبد الدهني", priority: "مساعد" },
      { name: "Berberine", dose: "500 مغ مرتين", timing: "مع الطعام", reason: "يقلل الدهون في الكبد ويحسن حساسية الأنسولين", priority: "اختياري" },
    ],
    lifestyle: [
      "تجنب الكحول تماماً خلال فترة البروتوكول",
      "قلل السكر المضاف والكربوهيدرات المكررة",
      "اشرب 2-3 لتر ماء يومياً",
      "تجنب الأدوية غير الضرورية",
      "ممارسة الرياضة الخفيفة 30 دقيقة يومياً",
    ],
    warnings: [
      "راجع طبيبك إذا كانت ALT/AST مرتفعة جداً (أكثر من 3 أضعاف الطبيعي)",
      "TUDCA قد يتفاعل مع أدوية الكوليسترول",
      "قس ALT/AST قبل وبعد البروتوكول",
    ],
    expectedResults: "تحسن وظائف الكبد (ALT/AST) خلال 4-8 أسابيع، تحسن الطاقة وتقليل الانتفاخ.",
  },
  {
    id: "heart",
    name: "صحة القلب",
    icon: "heart.fill",
    color: "#EF4444",
    description: "بروتوكول لتحسين صحة القلب والأوعية الدموية، تقليل الالتهاب، وتحسين مستويات الكوليسترول.",
    duration: "3-12 شهر",
    difficulty: "متوسط",
    supplements: [
      { name: "أوميغا-3 (rTG)", dose: "2-4 غ EPA+DHA", timing: "مع الطعام", reason: "يخفض الثلاثيات ويقلل الالتهاب", priority: "أساسي" },
      { name: "CoQ10 (Ubiquinol)", dose: "200-300 مغ", timing: "مع الطعام الدهني", reason: "طاقة عضلة القلب — ضروري مع الستاتين", priority: "أساسي" },
      { name: "المغنيسيوم Glycinate", dose: "400 مغ", timing: "قبل النوم", reason: "ينظم ضغط الدم وضربات القلب", priority: "أساسي" },
      { name: "فيتامين K2 (MK-7)", dose: "200 مكغ", timing: "مع الطعام الدهني", reason: "يمنع ترسب الكالسيوم في الشرايين", priority: "مساعد" },
      { name: "Berberine", dose: "500 مغ مرتين", timing: "مع الطعام", reason: "يخفض LDL ويحسن حساسية الأنسولين", priority: "مساعد" },
      { name: "Nattokinase", dose: "2000 FU", timing: "بعيداً عن الطعام", reason: "يحسن تدفق الدم ويقلل الجلطات", priority: "اختياري" },
    ],
    lifestyle: [
      "تمرين هوائي 150 دقيقة أسبوعياً (مشي، سباحة، دراجة)",
      "تقليل الصوديوم إلى أقل من 2300 مغ يومياً",
      "إضافة الأوميغا-3 من الأسماك الدهنية مرتين أسبوعياً",
      "إدارة التوتر بالتأمل أو اليوغا",
      "النوم 7-8 ساعات يومياً",
    ],
    warnings: [
      "Nattokinase يرقق الدم — لا تأخذه مع وارفارين",
      "استشر طبيبك قبل إضافة CoQ10 مع أدوية القلب",
      "راقب ضغط الدم بانتظام",
    ],
    expectedResults: "تحسن LDL/HDL خلال 8-12 أسبوع، انخفاض ضغط الدم، تحسن الطاقة.",
  },
  {
    id: "hormones",
    name: "تحسين الهرمونات",
    icon: "bolt.fill",
    color: "#F59E0B",
    description: "بروتوكول طبيعي لرفع التستوستيرون وتحسين التوازن الهرموني دون استخدام هرمونات خارجية.",
    duration: "2-4 أشهر",
    difficulty: "متوسط",
    supplements: [
      { name: "فيتامين D3", dose: "5000-10000 IU", timing: "مع الطعام الدهني", reason: "نقصه يرتبط مباشرة بانخفاض التستوستيرون", priority: "أساسي" },
      { name: "الزنك Picolinate", dose: "30-40 مغ", timing: "بعيداً عن الحديد", reason: "ضروري لإنتاج التستوستيرون وصحة الخصيتين", priority: "أساسي" },
      { name: "المغنيسيوم Glycinate", dose: "400-500 مغ", timing: "قبل النوم", reason: "يخفض SHBG ويرفع التستوستيرون الحر", priority: "أساسي" },
      { name: "Ashwagandha KSM-66", dose: "600 مغ", timing: "مع الطعام", reason: "يخفض الكورتيزول ويرفع LH وFSH", priority: "أساسي" },
      { name: "Tongkat Ali", dose: "200-400 مغ", timing: "صباحاً", reason: "يحفز إنتاج التستوستيرون ويخفض SHBG", priority: "مساعد" },
      { name: "Boron", dose: "10 مغ", timing: "مع الطعام", reason: "يخفض SHBG ويرفع التستوستيرون الحر والحر", priority: "مساعد" },
    ],
    lifestyle: [
      "تمرين مقاومة (أوزان) 3-4 مرات أسبوعياً",
      "نوم 7-9 ساعات — معظم التستوستيرون يُنتج أثناء النوم",
      "تقليل التوتر المزمن — الكورتيزول يثبط التستوستيرون",
      "تجنب الدهون المتحولة والسكر الزائد",
      "تناول الدهون الصحية (زيت زيتون، أفوكادو، بيض)",
    ],
    warnings: [
      "قس مستويات التستوستيرون قبل وبعد البروتوكول",
      "لا تتجاوز 40 مغ زنك يومياً — يستنزف النحاس",
      "Ashwagandha قد يؤثر على أدوية الغدة الدرقية",
    ],
    expectedResults: "رفع التستوستيرون الكلي والحر خلال 8-12 أسبوع، تحسن الطاقة والتركيز والرغبة الجنسية.",
  },
  {
    id: "sleep",
    name: "تحسين النوم",
    icon: "moon.fill",
    color: "#8B5CF6",
    description: "بروتوكول لتحسين جودة النوم العميق، تقليل وقت الدخول في النوم، والاستيقاظ بطاقة.",
    duration: "4-8 أسابيع",
    difficulty: "سهل",
    supplements: [
      { name: "المغنيسيوم Glycinate", dose: "400 مغ", timing: "ساعة قبل النوم", reason: "يهدئ الجهاز العصبي ويحسن النوم العميق", priority: "أساسي" },
      { name: "L-Theanine", dose: "200 مغ", timing: "ساعة قبل النوم", reason: "يرفع موجات ألفا في الدماغ — استرخاء بدون نعاس", priority: "أساسي" },
      { name: "Melatonin", dose: "0.5-1 مغ", timing: "30 دقيقة قبل النوم", reason: "يضبط الساعة البيولوجية — جرعة صغيرة أفضل", priority: "مساعد" },
      { name: "Ashwagandha", dose: "300 مغ", timing: "مع العشاء", reason: "يخفض الكورتيزول المرتفع ليلاً", priority: "مساعد" },
      { name: "Apigenin", dose: "50 مغ", timing: "ساعة قبل النوم", reason: "مركب طبيعي من البابونج — مهدئ خفيف", priority: "اختياري" },
      { name: "Glycine", dose: "3 غ", timing: "قبل النوم مباشرة", reason: "يخفض درجة حرارة الجسم ويحسن النوم العميق", priority: "اختياري" },
    ],
    lifestyle: [
      "نفس وقت النوم والاستيقاظ يومياً (حتى الإجازات)",
      "تجنب الشاشات ساعة قبل النوم أو استخدم نظارات حجب الضوء الأزرق",
      "غرفة مظلمة وباردة (18-20 درجة مثالية)",
      "تجنب الكافيين بعد الساعة 2 ظهراً",
      "لا تأكل وجبة ثقيلة قبل 3 ساعات من النوم",
    ],
    warnings: [
      "Melatonin بجرعات كبيرة (5-10 مغ) قد يسبب كوابيس",
      "لا تقد السيارة بعد أخذ المهدئات",
      "إذا استمر الأرق أكثر من شهر، راجع طبيباً",
    ],
    expectedResults: "تحسن ملحوظ في جودة النوم خلال 1-2 أسبوع، تقليل وقت الدخول في النوم، استيقاظ أكثر نشاطاً.",
  },
  {
    id: "brain",
    name: "صحة الدماغ",
    icon: "brain.head.profile",
    color: "#06B6D4",
    description: "بروتوكول لتحسين الذاكرة، التركيز، الإبداع، وحماية الدماغ من التدهور المعرفي.",
    duration: "3-6 أشهر",
    difficulty: "متوسط",
    supplements: [
      { name: "أوميغا-3 (DHA عالي)", dose: "2 غ DHA", timing: "مع الطعام", reason: "DHA يشكل 60% من دهون الدماغ", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000 IU", timing: "مع الطعام الدهني", reason: "مستقبلاته في كل خلية عصبية", priority: "أساسي" },
      { name: "Lion's Mane Mushroom", dose: "1000-2000 مغ", timing: "مع الطعام", reason: "يحفز NGF — ينمي الخلايا العصبية", priority: "أساسي" },
      { name: "Bacopa Monnieri", dose: "300-600 مغ", timing: "مع الطعام", reason: "يحسن الذاكرة طويلة المدى (يحتاج 8-12 أسبوع)", priority: "مساعد" },
      { name: "Alpha GPC", dose: "300-600 مغ", timing: "صباحاً", reason: "يرفع الأسيتيل كولين — ناقل عصبي للذاكرة", priority: "مساعد" },
      { name: "Phosphatidylserine", dose: "300 مغ", timing: "مع الطعام", reason: "يحسن التواصل بين الخلايا العصبية", priority: "اختياري" },
    ],
    lifestyle: [
      "تعلم شيء جديد يومياً — اللغات، الموسيقى، الألغاز",
      "التأمل 10-20 دقيقة يومياً يزيد حجم قشرة الفص الجبهي",
      "التمرين الهوائي يرفع BDNF (هرمون نمو الدماغ)",
      "النوم الكافي ضروري لتنظيف الدماغ من السموم (نظام Glymphatic)",
      "تجنب السكر الزائد — يسبب الالتهاب العصبي",
    ],
    warnings: [
      "Bacopa قد يسبب اضطراب هضمي في البداية — ابدأ بجرعة صغيرة",
      "Alpha GPC قد يسبب صداع عند بعض الأشخاص",
      "استشر طبيبك إذا كنت تأخذ أدوية للاكتئاب",
    ],
    expectedResults: "تحسن التركيز خلال 2-4 أسابيع، تحسن الذاكرة خلال 8-12 أسبوع.",
  },
  {
    id: "immunity",
    name: "تقوية المناعة",
    icon: "shield.fill",
    color: "#10B981",
    description: "بروتوكول لتعزيز المناعة وتقليل التهابات مزمنة، مثالي لفصل الشتاء أو بعد المرض.",
    duration: "2-3 أشهر",
    difficulty: "سهل",
    supplements: [
      { name: "فيتامين D3", dose: "5000-10000 IU", timing: "مع الطعام الدهني", reason: "ينظم الاستجابة المناعية — نقصه يضعف المناعة", priority: "أساسي" },
      { name: "الزنك", dose: "30 مغ", timing: "مع الطعام", reason: "ضروري لنضج خلايا T المناعية", priority: "أساسي" },
      { name: "فيتامين C (Liposomal)", dose: "1000-2000 مغ", timing: "مع الطعام", reason: "يحفز إنتاج الخلايا المناعية ومضاد أكسدة قوي", priority: "أساسي" },
      { name: "Elderberry", dose: "600-1200 مغ", timing: "مع الطعام", reason: "يقلل مدة الإنفلونزا ويثبط الفيروسات", priority: "مساعد" },
      { name: "Beta-Glucan", dose: "250-500 مغ", timing: "صباحاً بعيداً عن الطعام", reason: "يحفز الخلايا القاتلة الطبيعية (NK cells)", priority: "مساعد" },
      { name: "Quercetin", dose: "500-1000 مغ", timing: "مع الطعام", reason: "مضاد فيروسي طبيعي ومضاد التهاب", priority: "اختياري" },
    ],
    lifestyle: [
      "النوم 7-9 ساعات — الحرمان من النوم يخفض المناعة 50%",
      "تجنب التوتر المزمن — الكورتيزول يثبط المناعة",
      "التعرض للشمس يومياً لتفعيل فيتامين D",
      "تناول البروبيوتيك والأطعمة المخمرة",
      "ممارسة الرياضة المعتدلة — الإفراط يضعف المناعة",
    ],
    warnings: [
      "Elderberry ليس مناسباً لأمراض المناعة الذاتية",
      "فيتامين C بجرعات كبيرة قد يسبب حصى الكلى عند بعض الأشخاص",
      "استشر طبيبك إذا كنت تأخذ أدوية مثبطة للمناعة",
    ],
    expectedResults: "تقليل تكرار الإصابة بالأمراض، تعافي أسرع، تحسن مستوى الطاقة.",
  },
  {
    id: "skin",
    name: "صحة الجلد",
    icon: "sparkles",
    color: "#EC4899",
    description: "بروتوكول لتحسين مرونة الجلد، تقليل التجاعيد، علاج حب الشباب، وتحسين البشرة من الداخل.",
    duration: "3-6 أشهر",
    difficulty: "سهل",
    supplements: [
      { name: "الكولاجين (Type I)", dose: "10-15 غ", timing: "قبل النوم", reason: "يحسن مرونة الجلد ويقلل التجاعيد", priority: "أساسي" },
      { name: "فيتامين C (Liposomal)", dose: "1000 مغ", timing: "مع الطعام", reason: "ضروري لتصنيع الكولاجين في الجسم", priority: "أساسي" },
      { name: "الزنك", dose: "30 مغ", timing: "مع الطعام", reason: "يقلل حب الشباب ويسرع التئام الجروح", priority: "أساسي" },
      { name: "أوميغا-3", dose: "2 غ", timing: "مع الطعام", reason: "يرطب الجلد من الداخل ويقلل الالتهاب", priority: "مساعد" },
      { name: "البيوتين", dose: "5000 مكغ", timing: "مع الطعام", reason: "يحسن الجلد والشعر والأظافر", priority: "مساعد" },
      { name: "Astaxanthin", dose: "4-8 مغ", timing: "مع الطعام الدهني", reason: "أقوى مضاد أكسدة للجلد — يحمي من الشمس", priority: "اختياري" },
    ],
    lifestyle: [
      "شرب 2-3 لتر ماء يومياً",
      "واقي شمس SPF 30+ يومياً",
      "تجنب السكر الزائد — يسبب Glycation (تلف الكولاجين)",
      "النوم الكافي — خلاله يُجدَّد الكولاجين",
      "تجنب التدخين — يدمر الكولاجين",
    ],
    warnings: [
      "البيوتين بجرعات عالية قد يؤثر على نتائج تحاليل الغدة الدرقية",
      "الكولاجين من مصادر حيوانية — غير مناسب للنباتيين",
      "الزنك الزائد يستنزف النحاس",
    ],
    expectedResults: "تحسن ملمس الجلد خلال 4-6 أسابيع، تقليل التجاعيد الدقيقة خلال 3-6 أشهر.",
  },
  {
    id: "kidney",
    name: "صحة الكلى",
    icon: "drop.fill",
    color: "#3B82F6",
    description: "بروتوكول لدعم وظائف الكلى وحمايتها، مهم لمن يستخدم مكملات الكرياتين أو البروتين بكثرة.",
    duration: "مستمر",
    difficulty: "سهل",
    supplements: [
      { name: "فيتامين D3", dose: "2000-4000 IU", timing: "مع الطعام الدهني", reason: "يدعم وظائف الكلى ويقلل الالتهاب", priority: "أساسي" },
      { name: "أوميغا-3", dose: "2 غ", timing: "مع الطعام", reason: "يقلل الالتهاب الكلوي ويحسن GFR", priority: "أساسي" },
      { name: "Astragalus", dose: "500-1000 مغ", timing: "مع الطعام", reason: "يحسن الترشيح الكلوي ويحمي الخلايا", priority: "مساعد" },
      { name: "CoQ10", dose: "100-200 مغ", timing: "مع الطعام الدهني", reason: "يقلل الإجهاد التأكسدي في الكلى", priority: "مساعد" },
    ],
    lifestyle: [
      "شرب 2.5-3 لتر ماء يومياً",
      "تقليل البروتين إلى 0.8-1 غ/كغ إذا كان Creatinine مرتفعاً",
      "تقليل الصوديوم",
      "تجنب مسكنات الألم (NSAIDs) المزمنة",
      "مراقبة ضغط الدم",
    ],
    warnings: [
      "إذا كان Creatinine أعلى من 1.5 — استشر طبيب كلى قبل أي مكمل",
      "تجنب الكرياتين إذا كانت وظائف الكلى ضعيفة",
      "بعض الأعشاب قد تضر الكلى — تحقق دائماً",
    ],
    expectedResults: "الحفاظ على وظائف الكلى الطبيعية، تقليل الالتهاب، تحسن GFR.",
  },
  {
    id: "sports",
    name: "الأداء الرياضي",
    icon: "figure.strengthtraining.traditional",
    color: "#F97316",
    description: "بروتوكول لتحسين الأداء الرياضي، بناء العضلات، تسريع التعافي، وتقليل الإصابات.",
    duration: "مستمر",
    difficulty: "متقدم",
    supplements: [
      { name: "الكرياتين Monohydrate", dose: "5 غ", timing: "بعد التمرين", reason: "أكثر مكمل رياضي بحثاً — يزيد القوة والكتلة", priority: "أساسي" },
      { name: "البروتين (Whey/Plant)", dose: "25-40 غ", timing: "بعد التمرين", reason: "يوفر الأحماض الأمينية لبناء العضلات", priority: "أساسي" },
      { name: "Beta-Alanine", dose: "3.2 غ", timing: "قبل التمرين", reason: "يقلل حمض اللاكتيك ويطيل التحمل", priority: "مساعد" },
      { name: "Citrulline Malate", dose: "6-8 غ", timing: "30 دقيقة قبل التمرين", reason: "يرفع أكسيد النيتريك ويحسن ضخ الدم للعضلات", priority: "مساعد" },
      { name: "الكولاجين + فيتامين C", dose: "15 غ + 500 مغ", timing: "30 دقيقة قبل التمرين", reason: "يقوي الأوتار والمفاصل ويقلل الإصابات", priority: "مساعد" },
      { name: "Ashwagandha", dose: "600 مغ", timing: "مع الطعام", reason: "يحسن VO2 max ويقلل الكورتيزول بعد التمرين", priority: "اختياري" },
    ],
    lifestyle: [
      "برنامج تدريب منظم مع تقدم تدريجي",
      "نوم 8-9 ساعات — معظم بناء العضلات يحدث أثناء النوم",
      "بروتين كافٍ: 1.6-2.2 غ/كغ وزن جسم",
      "كاربوهيدرات كافية لإعادة شحن الجليكوجين",
      "يوم راحة واحد على الأقل أسبوعياً",
    ],
    warnings: [
      "Beta-Alanine يسبب وخزاً جلدياً طبيعياً (Paresthesia)",
      "الكرياتين يزيد وزن الماء في البداية — طبيعي",
      "لا تتجاوز 40 مغ كافيين/كغ — قد يسبب اضطراب قلب",
    ],
    expectedResults: "زيادة القوة خلال 2-4 أسابيع، زيادة الكتلة العضلية خلال 8-12 أسبوع.",
  },
  {
    id: "antiaging",
    name: "مكافحة الشيخوخة",
    icon: "sparkles",
    color: "#7C3AED",
    description: "بروتوكول Longevity لإبطاء الشيخوخة الخلوية، تحسين الطاقة، وتقليل الالتهاب المزمن.",
    duration: "مستمر",
    difficulty: "متقدم",
    supplements: [
      { name: "NMN أو NR", dose: "500-1000 مغ", timing: "صباحاً بعيداً عن الطعام", reason: "يرفع NAD+ — يُنشط جينات الطول العمر (Sirtuins)", priority: "أساسي" },
      { name: "Resveratrol", dose: "500 مغ", timing: "مع الطعام الدهني", reason: "يُنشط SIRT1 ويقلد تأثير تقليل السعرات", priority: "أساسي" },
      { name: "Quercetin + Fisetin", dose: "500 مغ + 100 مغ", timing: "مع الطعام", reason: "Senolytics — يُزيلان الخلايا الشيخوخية", priority: "مساعد" },
      { name: "Spermidine", dose: "1-2 مغ", timing: "مع الطعام", reason: "يحفز Autophagy — تنظيف الخلايا التالفة", priority: "مساعد" },
      { name: "Alpha Lipoic Acid", dose: "600 مغ", timing: "بعيداً عن الطعام", reason: "يعيد تدوير مضادات الأكسدة ويحسن حساسية الأنسولين", priority: "اختياري" },
      { name: "Astaxanthin", dose: "12 مغ", timing: "مع الطعام الدهني", reason: "أقوى مضاد أكسدة طبيعي — يحمي DNA", priority: "اختياري" },
    ],
    lifestyle: [
      "الصيام المتقطع (16:8) يحفز Autophagy",
      "تمرين منتظم — أهم عامل واحد لطول العمر",
      "تقليل السعرات الحرارية 10-20% (Caloric Restriction)",
      "إدارة التوتر — الكورتيزول يسرع الشيخوخة",
      "العلاقات الاجتماعية القوية ترتبط بطول العمر",
    ],
    warnings: [
      "NMN/NR مكلف — تأكد من جودة المنتج",
      "Quercetin قد يتفاعل مع بعض الأدوية",
      "استشر طبيبك إذا كنت تأخذ أدوية مزمنة",
    ],
    expectedResults: "تحسن الطاقة والتركيز خلال 4-8 أسابيع، تأثيرات طويلة المدى على الصحة الخلوية.",
  },
];

export default function ProtocolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [activeTab, setActiveTab] = useState<"supplements" | "lifestyle" | "warnings">("supplements");

  if (selectedProtocol) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.detailHeader, { paddingTop: insets.top + 12, backgroundColor: selectedProtocol.color + "15", borderBottomColor: selectedProtocol.color + "30" }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedProtocol(null)}>
            <IconSymbol name="chevron.right" size={22} color={selectedProtocol.color} />
          </Pressable>
          <View style={styles.detailHeaderContent}>
            <View style={[styles.detailIconBg, { backgroundColor: selectedProtocol.color + "20" }]}>
              <IconSymbol name={selectedProtocol.icon} size={28} color={selectedProtocol.color} />
            </View>
            <Text style={[styles.detailTitle, { color: colors.foreground }]}>{selectedProtocol.name}</Text>
            <Text style={[styles.detailDesc, { color: colors.muted }]}>{selectedProtocol.description}</Text>
            <View style={styles.detailMeta}>
              <View style={[styles.metaBadge, { backgroundColor: selectedProtocol.color + "15" }]}>
                <IconSymbol name="clock.fill" size={12} color={selectedProtocol.color} />
                <Text style={[styles.metaBadgeText, { color: selectedProtocol.color }]}>{selectedProtocol.duration}</Text>
              </View>
              <View style={[styles.metaBadge, { backgroundColor: selectedProtocol.color + "15" }]}>
                <IconSymbol name="chart.bar.fill" size={12} color={selectedProtocol.color} />
                <Text style={[styles.metaBadgeText, { color: selectedProtocol.color }]}>{selectedProtocol.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
          {([
            { id: "supplements" as const, label: "المكملات" },
            { id: "lifestyle" as const, label: "نمط الحياة" },
            { id: "warnings" as const, label: "تحذيرات" },
          ]).map((tab) => (
            <Pressable key={tab.id} style={[styles.tab, activeTab === tab.id && { borderBottomColor: selectedProtocol.color, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab.id)}>
              <Text style={[styles.tabText, { color: activeTab === tab.id ? selectedProtocol.color : colors.muted }]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
          {activeTab === "supplements" && (
            <>
              {["أساسي", "مساعد", "اختياري"].map((priority) => {
                const items = selectedProtocol.supplements.filter((s) => s.priority === priority);
                if (items.length === 0) return null;
                const priorityColor = priority === "أساسي" ? colors.error : priority === "مساعد" ? colors.warning : colors.muted;
                return (
                  <View key={priority}>
                    <View style={[styles.priorityHeader, { backgroundColor: priorityColor + "15" }]}>
                      <Text style={[styles.priorityHeaderText, { color: priorityColor }]}>
                        {priority === "أساسي" ? "🔴 أساسي — لا تتخطاه" : priority === "مساعد" ? "🟡 مساعد — يعزز النتائج" : "🟢 اختياري — للتحسين"}
                      </Text>
                    </View>
                    {items.map((s) => (
                      <View key={s.name} style={[styles.suppCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.suppHeader}>
                          <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
                          <Text style={[styles.suppDose, { color: selectedProtocol.color }]}>{s.dose}</Text>
                        </View>
                        <View style={[styles.suppTiming, { backgroundColor: colors.surface }]}>
                          <IconSymbol name="clock.fill" size={12} color={colors.muted} />
                          <Text style={[styles.suppTimingText, { color: colors.muted }]}>{s.timing}</Text>
                        </View>
                        <Text style={[styles.suppReason, { color: colors.foreground }]}>{s.reason}</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
              <View style={[styles.expectedCard, { backgroundColor: selectedProtocol.color + "10", borderColor: selectedProtocol.color + "30" }]}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={16} color={selectedProtocol.color} />
                <Text style={[styles.expectedText, { color: colors.foreground }]}>{selectedProtocol.expectedResults}</Text>
              </View>
            </>
          )}
          {activeTab === "lifestyle" && selectedProtocol.lifestyle.map((tip, i) => (
            <View key={i} style={[styles.lifestyleTip, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.tipNumber, { backgroundColor: selectedProtocol.color + "20" }]}>
                <Text style={[styles.tipNumberText, { color: selectedProtocol.color }]}>{i + 1}</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.foreground }]}>{tip}</Text>
            </View>
          ))}
          {activeTab === "warnings" && selectedProtocol.warnings.map((w, i) => (
            <View key={i} style={[styles.warningCard, { backgroundColor: colors.error + "08", borderColor: colors.error + "30" }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.error} />
              <Text style={[styles.warningText, { color: colors.foreground }]}>{w}</Text>
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>البروتوكولات المتخصصة</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{PROTOCOLS.length} بروتوكول علمي متخصص</Text>
        </View>
      </View>
      <FlatList
        data={PROTOCOLS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable style={[styles.protocolCard, { backgroundColor: colors.card, borderColor: item.color + "30", borderLeftColor: item.color, borderLeftWidth: 4 }]}
            onPress={() => { setSelectedProtocol(item); setActiveTab("supplements"); }}>
            <View style={styles.protocolCardContent}>
              <View style={[styles.protocolIcon, { backgroundColor: item.color + "15" }]}>
                <IconSymbol name={item.icon} size={24} color={item.color} />
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.protocolName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.protocolDesc, { color: colors.muted }]} numberOfLines={2}>{item.description}</Text>
                <View style={styles.protocolMeta}>
                  <View style={[styles.metaBadge, { backgroundColor: item.color + "12" }]}>
                    <Text style={[styles.metaBadgeText, { color: item.color }]}>{item.duration}</Text>
                  </View>
                  <View style={[styles.metaBadge, { backgroundColor: item.color + "12" }]}>
                    <Text style={[styles.metaBadgeText, { color: item.color }]}>{item.supplements.length} مكمل</Text>
                  </View>
                  <View style={[styles.difficultyBadge, {
                    backgroundColor: item.difficulty === "سهل" ? colors.success + "15" : item.difficulty === "متوسط" ? colors.warning + "15" : colors.error + "15"
                  }]}>
                    <Text style={[styles.difficultyText, {
                      color: item.difficulty === "سهل" ? colors.success : item.difficulty === "متوسط" ? colors.warning : colors.error
                    }]}>{item.difficulty}</Text>
                  </View>
                </View>
              </View>
            </View>
            <IconSymbol name="chevron.left" size={18} color={colors.muted} />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  backBtn: { padding: 4 },
  protocolCard: { borderRadius: 14, padding: 14, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  protocolCardContent: { flex: 1, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  protocolIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  protocolName: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  protocolDesc: { fontSize: 12, lineHeight: 18, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  protocolMeta: { flexDirection: "row-reverse", gap: 6, marginTop: 8, flexWrap: "wrap" },
  metaBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  metaBadgeText: { fontSize: 11, fontWeight: "600", fontFamily: "Cairo-Bold" },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  difficultyText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  // Detail
  detailHeader: { paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 0.5 },
  detailHeaderContent: { alignItems: "center", gap: 8, marginTop: 8 },
  detailIconBg: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  detailTitle: { fontSize: 22, fontWeight: "900", fontFamily: "Cairo-Black" },
  detailDesc: { fontSize: 13, lineHeight: 20, textAlign: "center", paddingHorizontal: 16, fontFamily: "Cairo" },
  detailMeta: { flexDirection: "row", gap: 8 },
  tabBar: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8, marginBottom: 8 },
  suppHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  suppName: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  suppDose: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppTiming: { flexDirection: "row-reverse", alignItems: "center", gap: 6, padding: 6, borderRadius: 8 },
  suppTimingText: { fontSize: 11, fontFamily: "Cairo" },
  suppReason: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  priorityHeader: { padding: 8, borderRadius: 10, marginBottom: 8 },
  priorityHeaderText: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  expectedCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  expectedText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  lifestyleTip: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  tipNumber: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  tipNumberText: { fontSize: 13, fontWeight: "800", fontFamily: "Cairo-Black" },
  tipText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
  warningCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  warningText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right", fontFamily: "Cairo" },
});
