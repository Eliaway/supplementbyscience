/**
 * المكتبة العلمية — Scientific Library
 * مقالات علمية، بروتوكولات متخصصة، بدائل غذائية، قائمة WADA، فلتر Vegan
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

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

// ═══════════════════════════════════════
// DATA
// ═══════════════════════════════════════

const ARTICLES = [
  {
    id: "protein_types",
    title: "أنواع البروتين: المصادر، الفوائد، والتفاعلات",
    category: "تغذية",
    icon: "🥩",
    color: "#f87171",
    readTime: "8 دقائق",
    content: `## أنواع البروتين

### Whey Protein (بروتين مصل اللبن)
**المصدر:** مشتق من الحليب أثناء صناعة الجبن.
**الفوائد:** امتصاص سريع، غني بالـ BCAA، يحفز بناء العضلات.
**الأنواع:** Concentrate (80%)، Isolate (90%+)، Hydrolysate (أسرع امتصاصاً).
**أفضل وقت:** بعد التمرين مباشرة أو صباحاً.
**التفاعلات:** آمن مع معظم المكملات. يتآزر مع الكرياتين والـ BCAA.
**الآثار الجانبية:** انتفاخ عند حساسية اللاكتوز — استخدم Isolate.
**المصادر الطبيعية:** الدجاج، البيض، الأسماك، الحليب.

### Casein Protein (الكازين)
**المصدر:** بروتين الحليب البطيء الهضم.
**الفوائد:** يوفر أحماض أمينية ببطء لساعات — مثالي قبل النوم.
**أفضل وقت:** قبل النوم بـ 30 دقيقة.
**التفاعلات:** لا تخلطه مع الحديد (يقلل امتصاصه).

### Plant Protein (بروتين نباتي)
**المصادر:** البازلاء، الأرز، القنب، فول الصويا.
**الفوائد:** مناسب للنباتيين، يحتوي على ألياف.
**ملاحظة:** اجمع مصدرين (أرز + بازلاء) للحصول على بروفايل أحماض أمينية كامل.

### Egg White Protein (بروتين بياض البيض)
**الفوائد:** بروفايل أحماض أمينية ممتاز، خالٍ من اللاكتوز.
**الامتصاص:** متوسط السرعة.`,
  },
  {
    id: "omega3_science",
    title: "أوميغا-3: العلم الكامل وراء أهم مكمل",
    category: "قلب وأوعية",
    icon: "🐟",
    color: "#60a5fa",
    readTime: "6 دقائق",
    content: `## أوميغا-3: الدليل العلمي الشامل

### ما هو أوميغا-3؟
أحماض دهنية أساسية لا يستطيع الجسم تصنيعها. أهمها:
- **EPA** (Eicosapentaenoic acid): مضاد للالتهاب، يدعم القلب والمزاج.
- **DHA** (Docosahexaenoic acid): أساسي لصحة الدماغ والعين.
- **ALA** (Alpha-linolenic acid): من المصادر النباتية، تحويله لـ EPA/DHA ضعيف (5-10%).

### الجرعات المثلى
- للصحة العامة: 1-2 غ EPA+DHA يومياً.
- لخفض الثلاثيات: 4 غ يومياً (تحت إشراف طبي).
- لمكافحة الالتهاب: 2-3 غ يومياً.

### أفضل الأشكال
1. **rTG (Reesterified Triglyceride):** امتصاص أعلى بـ 70% — الأفضل.
2. **Phospholipid (Krill Oil):** امتصاص ممتاز، يعبر الحاجز الدموي الدماغي.
3. **Ethyl Ester:** الأرخص، امتصاص أقل.

### التفاعلات
- يتآزر مع: فيتامين D3، المغنيسيوم، CoQ10.
- تنبيه مع: مضادات التخثر (وارفارين) — استشر طبيبك.

### المصادر الغذائية
السلمون، السردين، الماكريل، الأنشوجة، بذور الكتان، الجوز.`,
  },
  {
    id: "vitamin_d_complete",
    title: "فيتامين D: أكثر من مجرد فيتامين",
    category: "فيتامينات",
    icon: "☀️",
    color: "#fbbf24",
    readTime: "7 دقائق",
    content: `## فيتامين D: الدليل الشامل

### لماذا يُعتبر هرموناً لا فيتاميناً؟
فيتامين D يعمل كهرمون ستيرويدي — يؤثر على أكثر من 2000 جين في الجسم.

### الأدوار الحيوية
- امتصاص الكالسيوم والفوسفور (صحة العظام).
- تنظيم المناعة (يقلل أمراض المناعة الذاتية).
- دعم صحة القلب وتنظيم ضغط الدم.
- تحسين المزاج وتقليل الاكتئاب.
- دعم إنتاج التستوستيرون.
- الوقاية من بعض أنواع السرطان.

### المستويات المثلى
- **نقص حاد:** أقل من 20 ng/mL.
- **نقص:** 20-30 ng/mL.
- **كافٍ:** 30-40 ng/mL.
- **أمثل:** 60-80 ng/mL.
- **سمية:** فوق 150 ng/mL (نادر جداً).

### الجرعة
- للوصول للمستوى الأمثل: 5000 IU يومياً مع K2.
- للصيانة: 2000-3000 IU.
- خذه مع وجبة دهنية لتحسين الامتصاص.

### لماذا مع K2؟
K2 يوجّه الكالسيوم إلى العظام ويمنعه من الترسب في الشرايين.

### المصادر الغذائية
أشعة الشمس (الأفضل)، سمك السلمون، صفار البيض، الكبد.`,
  },
  {
    id: "magnesium_guide",
    title: "المغنيسيوم: المعدن المنسي الأهم",
    category: "معادن",
    icon: "💎",
    color: "#34d399",
    readTime: "5 دقائق",
    content: `## المغنيسيوم: دليل شامل

### الأهمية
يشارك في أكثر من 300 تفاعل إنزيمي في الجسم. 70% من الناس يعانون من نقصه.

### أعراض النقص
تشنجات عضلية، رجفة الجفن، صعوبة النوم، قلق، إرهاق، صداع، ارتفاع ضغط الدم.

### أنواع المغنيسيوم
| النوع | الامتصاص | الأفضل لـ |
|-------|----------|---------|
| Glycinate | ممتاز | النوم، القلق، التشنجات |
| Malate | جيد جداً | الطاقة، الألم العضلي |
| Citrate | جيد | الإمساك، الامتصاص العام |
| L-Threonate | ممتاز | الدماغ والذاكرة |
| Oxide | ضعيف (4%) | تجنّبه |

### الجرعة
200-400 مغ يومياً. قبل النوم للنوم الأفضل.

### التآزر
يتآزر مع فيتامين D3، B6، الكالسيوم.`,
  },
  {
    id: "liver_health",
    title: "صحة الكبد: المكملات والبروتوكول الكامل",
    category: "صحة الأعضاء",
    icon: "🫀",
    color: "#f59e0b",
    readTime: "10 دقائق",
    content: `## بروتوكول صحة الكبد الشامل

### المكملات الأساسية
**TUDCA (حمض أورسوديوكسيكوليك التوروريني)**
- الجرعة: 250-500 مغ يومياً.
- الفائدة: يحمي خلايا الكبد من الموت المبرمج، يحسن تدفق الصفراء.
- مثالي مع: TRT، الستيرويدات، الأدوية الكبدية.

**NAC (N-Acetyl Cysteine)**
- الجرعة: 600-1200 مغ يومياً.
- الفائدة: يرفع الغلوتاثيون (أقوى مضاد أكسدة في الجسم).
- مثالي لـ: إزالة السموم، حماية الكبد من الأدوية.

**Milk Thistle (Silymarin)**
- الجرعة: 140-420 مغ يومياً (موحّد 70-80% Silymarin).
- الفائدة: يجدد خلايا الكبد، مضاد أكسدة قوي.

**Alpha Lipoic Acid (ALA)**
- الجرعة: 300-600 مغ يومياً.
- الفائدة: مضاد أكسدة مزدوج (ذائب في الماء والدهون).

### البروتوكول الكامل
صباحاً: NAC 600مغ + ALA 300مغ.
مساءً: TUDCA 250مغ + Milk Thistle 280مغ.

### الأطعمة الداعمة
الثوم، الكركم، الشمندر، الجريب فروت، الشاي الأخضر، القهوة (2-3 أكواب يومياً تقلل تليف الكبد).

### التحاليل المطلوبة
ALT، AST، GGT، Bilirubin، Albumin كل 3 أشهر.`,
  },
  {
    id: "testosterone_natural",
    title: "رفع التستوستيرون طبيعياً: الدليل العلمي",
    category: "هرمونات",
    icon: "💪",
    color: "#8b5cf6",
    readTime: "9 دقائق",
    content: `## رفع التستوستيرون طبيعياً

### المكملات المدعومة علمياً

**الزنك**
- الجرعة: 25-40 مغ يومياً.
- الآلية: ضروري لإنتاج التستوستيرون وتثبيط الأروماتاز.
- الأدلة: نقص الزنك يخفض التستوستيرون بنسبة 50%.

**فيتامين D3**
- الجرعة: 3000-5000 IU يومياً.
- الآلية: مستقبلات فيتامين D موجودة في خلايا Leydig المنتجة للتستوستيرون.
- الأدلة: رفع مستوى D إلى 70+ ng/mL رفع التستوستيرون بـ 25%.

**Ashwagandha (KSM-66)**
- الجرعة: 300-600 مغ يومياً.
- الآلية: يخفض الكورتيزول (عدو التستوستيرون).
- الأدلة: رفع التستوستيرون بـ 17% في 8 أسابيع.

**Boron (البورون)**
- الجرعة: 6-10 مغ يومياً.
- الآلية: يخفض SHBG ويرفع التستوستيرون الحر.

**Tongkat Ali**
- الجرعة: 200-400 مغ يومياً (موحّد 2%).
- الآلية: يحفز محور LH/FSH.

### نمط الحياة
- النوم 7-9 ساعات (80% من التستوستيرون يُنتج أثناء النوم).
- تمارين المقاومة (Compound movements: Squat, Deadlift).
- تقليل الكحول والتوتر.
- الدهون الصحية (أفوكادو، زيت الزيتون، البيض).

### التحاليل المطلوبة
Total Testosterone، Free Testosterone، SHBG، LH، FSH، E2 كل 6 أشهر.`,
  },
  {
    id: "sleep_protocol",
    title: "بروتوكول النوم العميق: العلم والتطبيق",
    category: "نوم",
    icon: "🌙",
    color: "#a78bfa",
    readTime: "7 دقائق",
    content: `## بروتوكول النوم العميق

### لماذا النوم مهم للمكملات؟
80% من هرمون النمو يُفرز أثناء النوم العميق (N3).
التستوستيرون يُنتج أثناء النوم.
الجهاز المناعي يُجدَّد أثناء النوم.

### المكملات الداعمة للنوم

**المغنيسيوم Glycinate**
- الجرعة: 300-400 مغ قبل النوم بساعة.
- الآلية: يفعّل GABA ويهدئ الجهاز العصبي.

**L-Theanine**
- الجرعة: 200-400 مغ قبل النوم.
- الآلية: يرفع موجات ألفا الدماغية (استرخاء بدون نعاس).

**Glycine**
- الجرعة: 3 غ قبل النوم.
- الآلية: يخفض درجة حرارة الجسم الأساسية (محفز طبيعي للنوم).

**Melatonin**
- الجرعة: 0.5-1 مغ (لا تزد عن 3 مغ).
- الآلية: هرمون النوم الطبيعي.
- ملاحظة: جرعة صغيرة أفضل من كبيرة.

**Ashwagandha**
- الجرعة: 300 مغ قبل النوم.
- الآلية: يخفض الكورتيزول ويحسن جودة النوم.

### البروتوكول الكامل
قبل النوم بساعة: المغنيسيوم + L-Theanine + Glycine.
قبل النوم بـ 30 دقيقة: Melatonin 0.5 مغ.

### نصائح إضافية
- أطفئ الشاشات قبل ساعة من النوم.
- درجة حرارة الغرفة: 18-20°C.
- الظلام التام يرفع الميلاتونين بـ 50%.`,
  },
  {
    id: "gut_health",
    title: "صحة الأمعاء: الميكروبيوم والمكملات",
    category: "هضم",
    icon: "🦠",
    color: "#10b981",
    readTime: "8 دقائق",
    content: `## صحة الأمعاء والميكروبيوم

### لماذا الأمعاء مهمة؟
70% من جهاز المناعة في الأمعاء.
90% من السيروتونين (هرمون السعادة) يُنتج في الأمعاء.
الأمعاء تؤثر على الدماغ عبر محور Gut-Brain Axis.

### المكملات الأساسية

**البروبيوتيك**
- الجرعة: 10-50 مليار CFU يومياً.
- أفضل السلالات: Lactobacillus acidophilus، Bifidobacterium longum.
- خذه على معدة فارغة أو مع وجبة خفيفة.

**البريبيوتيك (Inulin / FOS)**
- الجرعة: 5-10 غ يومياً.
- الفائدة: يغذّي البكتيريا النافعة.

**L-Glutamine**
- الجرعة: 5-10 غ يومياً.
- الفائدة: يُرمّم جدار الأمعاء (Leaky Gut).

**إنزيمات الهضم**
- تؤخذ مع الوجبات.
- تساعد في هضم البروتين، الدهون، والكربوهيدرات.

**Zinc Carnosine**
- الجرعة: 75 مغ مرتين يومياً.
- الفائدة: يُعالج قرحة المعدة ويحمي الغشاء المخاطي.

### الأطعمة الداعمة
الكفير، الزبادي، الكيمتشي، المخلل الطبيعي، الثوم، البصل، الموز الأخضر.`,
  },
  {
    id: "anti_aging",
    title: "مكافحة الشيخوخة: العلم الحديث",
    category: "طول العمر",
    icon: "⏳",
    color: "#6366f1",
    readTime: "10 دقائق",
    content: `## مكافحة الشيخوخة: الدليل العلمي

### آليات الشيخوخة
1. **قصر التيلوميرات** — نهايات الكروموسومات تقصر مع كل انقسام.
2. **تراكم الخلايا الشيخوخية (Senescent Cells)** — خلايا ميتة تُفرز مواد التهابية.
3. **انخفاض NAD+** — جزيء الطاقة الأساسي في الخلية.
4. **الإجهاد التأكسدي** — تراكم الجذور الحرة.
5. **الالتهاب المزمن المنخفض الدرجة** — Inflammaging.

### مكملات مكافحة الشيخوخة

**NMN / NR (رافعات NAD+)**
- الجرعة: 250-500 مغ يومياً.
- الفائدة: يرفع NAD+ الذي ينخفض 50% بعمر 50.

**Resveratrol**
- الجرعة: 250-500 مغ يومياً مع الدهون.
- الفائدة: يفعّل Sirtuins (جينات طول العمر).

**Quercetin + Dasatinib (Senolytic)**
- يُستخدم دورياً (5 أيام كل 3 أشهر).
- الفائدة: يزيل الخلايا الشيخوخية.

**Spermidine**
- الجرعة: 1-2 مغ يومياً.
- الفائدة: يحفز الـ Autophagy (تنظيف الخلايا).

**Fisetin**
- الجرعة: 100-200 مغ يومياً.
- الفائدة: Senolytic قوي، يحمي الدماغ.

### نمط الحياة
- الصيام المتقطع (16:8) يحفز Autophagy.
- التمرين الهوائي يطيل التيلوميرات.
- تقليل السكر والكربوهيدرات المكررة.`,
  },
  {
    id: "myth_vs_fact",
    title: "أسطورة أم حقيقة؟ أكبر المفاهيم الخاطئة",
    category: "تعليم",
    icon: "🔍",
    color: "#ec4899",
    readTime: "6 دقائق",
    content: `## أسطورة أم حقيقة؟

### ❌ أسطورة: "البروتين يضر الكلى"
**الحقيقة:** لدى الأشخاص الأصحاء، حتى 3 غ/كغ يومياً آمن تماماً. فقط المرضى بأمراض كلوية مسبقة يحتاجون تقليل البروتين.

### ❌ أسطورة: "الكرياتين يسبب تساقط الشعر"
**الحقيقة:** دراسة واحدة وجدت ارتفاع DHT بـ 56%، لكن DHT لا يسبب الصلع إلا عند الذين لديهم استعداد وراثي. عشرات الدراسات لم تجد علاقة.

### ❌ أسطورة: "المكملات الطبيعية آمنة دائماً"
**الحقيقة:** حتى المكملات الطبيعية لها جرعات سامة وتفاعلات دوائية. مثال: St. John's Wort يتفاعل مع أكثر من 50 دواء.

### ❌ أسطورة: "يجب أخذ المكملات على معدة فارغة"
**الحقيقة:** يعتمد على المكمل. فيتامين D وأوميغا-3 يُمتصان أفضل مع الدهون. المغنيسيوم قد يسبب غثياناً على معدة فارغة.

### ✅ حقيقة: "الكرياتين Monohydrate هو الأفضل"
الكرياتين Monohydrate هو الأكثر بحثاً والأرخص والأكثر فعالية. لا حاجة للأشكال الأغلى.

### ✅ حقيقة: "توقيت المكملات مهم"
البروتين بعد التمرين، المغنيسيوم قبل النوم، فيتامين D مع الدهون — التوقيت يؤثر على الفعالية.

### ❌ أسطورة: "أكثر = أفضل"
**الحقيقة:** كثير من المكملات لها منحنى U — الجرعة الزائدة تضر. فيتامين A، D، E، K تتراكم في الدهون.`,
  },
];

const PROTOCOLS = [
  {
    id: "liver_protocol",
    title: "بروتوكول صحة الكبد",
    icon: "🫀",
    color: "#f59e0b",
    category: "أعضاء",
    duration: "3 أشهر",
    supplements: [
      { name: "TUDCA", dose: "250-500 مغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "NAC", dose: "600-1200 مغ", timing: "بعيداً عن الطعام", priority: "أساسي" },
      { name: "Milk Thistle", dose: "280-420 مغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "Alpha Lipoic Acid", dose: "300-600 مغ", timing: "مع الطعام", priority: "مكمّل" },
      { name: "Vitamin E (Mixed Tocopherols)", dose: "400 IU", timing: "مع الطعام الدهني", priority: "مكمّل" },
    ],
    foods: ["الثوم", "الكركم", "الشمندر", "الجريب فروت", "القهوة", "الشاي الأخضر"],
    avoid: ["الكحول", "الأسيتامينوفين بجرعات عالية", "الأطعمة المقلية", "السكر الزائد"],
    labs: ["ALT", "AST", "GGT", "Bilirubin", "Albumin"],
    warning: "استشر طبيبك إذا كانت إنزيمات الكبد مرتفعة أكثر من 3 أضعاف الطبيعي.",
  },
  {
    id: "heart_protocol",
    title: "بروتوكول صحة القلب",
    icon: "❤️",
    color: "#ef4444",
    category: "أعضاء",
    duration: "6 أشهر",
    supplements: [
      { name: "أوميغا-3 (rTG)", dose: "2-4 غ EPA+DHA", timing: "مع الطعام", priority: "أساسي" },
      { name: "CoQ10 (Ubiquinol)", dose: "100-200 مغ", timing: "مع الطعام الدهني", priority: "أساسي" },
      { name: "المغنيسيوم", dose: "300-400 مغ", timing: "قبل النوم", priority: "أساسي" },
      { name: "Berberine", dose: "500 مغ × 3", timing: "مع الطعام", priority: "مكمّل" },
      { name: "Nattokinase", dose: "2000 FU", timing: "بعيداً عن الطعام", priority: "مكمّل" },
      { name: "فيتامين K2 (MK-7)", dose: "100-200 مكغ", timing: "مع الطعام الدهني", priority: "مكمّل" },
    ],
    foods: ["الأسماك الدهنية", "الجوز", "زيت الزيتون", "التوت", "الخضروات الورقية", "الشوكولاتة الداكنة"],
    avoid: ["الدهون المتحولة", "الصوديوم الزائد", "السكر المكرر", "التدخين"],
    labs: ["Cholesterol Total", "HDL", "LDL", "Triglycerides", "CRP (hs)", "Homocysteine"],
    warning: "إذا كنت تأخذ مضادات التخثر، استشر طبيبك قبل أوميغا-3 وNattokinase.",
  },
  {
    id: "kidney_protocol",
    title: "بروتوكول صحة الكلى",
    icon: "💧",
    color: "#8b5cf6",
    category: "أعضاء",
    duration: "مستمر",
    supplements: [
      { name: "فيتامين D3", dose: "2000-3000 IU", timing: "مع الطعام الدهني", priority: "أساسي" },
      { name: "أوميغا-3", dose: "1-2 غ", timing: "مع الطعام", priority: "أساسي" },
      { name: "Astragalus", dose: "500-1000 مغ", timing: "مع الطعام", priority: "مكمّل" },
      { name: "Cordyceps", dose: "1000-3000 مغ", timing: "مع الطعام", priority: "مكمّل" },
    ],
    foods: ["التفاح", "التوت البري", "الثوم", "البصل", "الزيت الزيتون", "الأسماك"],
    avoid: ["الصوديوم الزائد", "البروتين الزائد (فوق 1.5 غ/كغ)", "مسكنات الألم NSAID بانتظام", "الكافيين الزائد"],
    labs: ["Creatinine", "BUN", "eGFR", "Uric Acid", "Potassium"],
    warning: "مرضى الكلى يحتاجون تعديل جرعات معظم المكملات. استشر طبيبك دائماً.",
  },
  {
    id: "brain_protocol",
    title: "بروتوكول الدماغ والتركيز",
    icon: "🧠",
    color: "#3b82f6",
    category: "دماغ",
    duration: "3 أشهر",
    supplements: [
      { name: "أوميغا-3 (DHA عالي)", dose: "2 غ DHA", timing: "مع الطعام", priority: "أساسي" },
      { name: "Lion's Mane", dose: "500-1000 مغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "Bacopa Monnieri", dose: "300-450 مغ", timing: "مع الطعام الدهني", priority: "أساسي" },
      { name: "فيتامين B12 (Methylcobalamin)", dose: "1000 مكغ", timing: "صباحاً", priority: "أساسي" },
      { name: "Alpha GPC", dose: "300-600 مغ", timing: "صباحاً", priority: "مكمّل" },
      { name: "L-Theanine + Caffeine", dose: "200 مغ + 100 مغ", timing: "صباحاً", priority: "مكمّل" },
      { name: "Phosphatidylserine", dose: "100 مغ × 3", timing: "مع الطعام", priority: "مكمّل" },
    ],
    foods: ["التوت الأزرق", "الجوز", "السلمون", "البيض", "الكركم", "الشوكولاتة الداكنة"],
    avoid: ["السكر الزائد", "الكحول", "قلة النوم", "الجلوس الطويل"],
    labs: ["Vitamin B12", "Vitamin D", "Homocysteine", "TSH"],
    warning: "Bacopa يحتاج 8-12 أسبوع لتظهر نتائجه. تحلّ بالصبر.",
  },
  {
    id: "testosterone_protocol",
    title: "بروتوكول دعم التستوستيرون",
    icon: "💪",
    color: "#84cc16",
    category: "هرمونات",
    duration: "3 أشهر",
    supplements: [
      { name: "الزنك (Picolinate)", dose: "25-40 مغ", timing: "بعيداً عن الحديد", priority: "أساسي" },
      { name: "فيتامين D3", dose: "5000 IU", timing: "مع الطعام الدهني", priority: "أساسي" },
      { name: "Ashwagandha (KSM-66)", dose: "300-600 مغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "Boron", dose: "6-10 مغ", timing: "مع الطعام", priority: "مكمّل" },
      { name: "Tongkat Ali", dose: "200-400 مغ", timing: "صباحاً", priority: "مكمّل" },
      { name: "Fadogia Agrestis", dose: "425-600 مغ", timing: "مع الطعام", priority: "اختياري" },
    ],
    foods: ["البيض", "اللحوم الحمراء", "المحار", "المكسرات", "الأفوكادو", "زيت الزيتون"],
    avoid: ["الكحول", "فول الصويا الزائد", "البلاستيك (BPA)", "قلة النوم", "الإجهاد المزمن"],
    labs: ["Total Testosterone", "Free Testosterone", "SHBG", "LH", "FSH", "E2", "Vitamin D"],
    warning: "Fadogia Agrestis قد يرفع LH بقوة — استخدمه بحذر ودورياً.",
  },
  {
    id: "sleep_protocol",
    title: "بروتوكول النوم العميق",
    icon: "🌙",
    color: "#a78bfa",
    category: "نوم",
    duration: "مستمر",
    supplements: [
      { name: "المغنيسيوم Glycinate", dose: "300-400 مغ", timing: "قبل النوم بساعة", priority: "أساسي" },
      { name: "L-Theanine", dose: "200-400 مغ", timing: "قبل النوم بساعة", priority: "أساسي" },
      { name: "Glycine", dose: "3 غ", timing: "قبل النوم", priority: "أساسي" },
      { name: "Melatonin", dose: "0.5-1 مغ", timing: "قبل النوم بـ 30 دقيقة", priority: "مكمّل" },
      { name: "Ashwagandha", dose: "300 مغ", timing: "قبل النوم", priority: "مكمّل" },
    ],
    foods: ["الكيوي", "الموز", "الحليب الدافئ", "الكرز الحامض", "الجوز"],
    avoid: ["الكافيين بعد الظهر", "الكحول", "الشاشات قبل النوم", "وجبات ثقيلة قبل النوم"],
    labs: ["Cortisol (AM/PM)", "Melatonin", "Vitamin D", "Magnesium RBC"],
    warning: "لا تزد Melatonin عن 1 مغ — الجرعات الكبيرة تعطل الإنتاج الطبيعي.",
  },
  {
    id: "joint_protocol",
    title: "بروتوكول صحة المفاصل",
    icon: "🦴",
    color: "#06b6d4",
    category: "عضلات وعظام",
    duration: "6 أشهر",
    supplements: [
      { name: "الكولاجين Type II", dose: "10-15 غ", timing: "قبل النوم", priority: "أساسي" },
      { name: "Glucosamine Sulfate", dose: "1500 مغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "Chondroitin", dose: "1200 مغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "أوميغا-3", dose: "2-3 غ", timing: "مع الطعام", priority: "أساسي" },
      { name: "Boswellia", dose: "300-500 مغ", timing: "مع الطعام", priority: "مكمّل" },
      { name: "فيتامين C", dose: "500-1000 مغ", timing: "مع الطعام", priority: "مكمّل" },
    ],
    foods: ["مرق العظام", "الأسماك الدهنية", "الكركم", "الزنجبيل", "الكرز"],
    avoid: ["الجلوس الطويل", "الوزن الزائد", "الأطعمة الالتهابية"],
    labs: ["CRP", "ESR", "Uric Acid", "Vitamin D", "Calcium"],
    warning: "Glucosamine مشتق من المحار — تجنّبه إذا كانت لديك حساسية من المحار.",
  },
  {
    id: "immune_protocol",
    title: "بروتوكول تقوية المناعة",
    icon: "🛡️",
    color: "#f97316",
    category: "مناعة",
    duration: "الشتاء أو عند الحاجة",
    supplements: [
      { name: "فيتامين D3", dose: "5000 IU", timing: "مع الطعام الدهني", priority: "أساسي" },
      { name: "الزنك", dose: "25-40 مغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "فيتامين C", dose: "1000-2000 مغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "Elderberry", dose: "500-1000 مغ", timing: "مع الطعام", priority: "مكمّل" },
      { name: "Beta-Glucan", dose: "250-500 مغ", timing: "على معدة فارغة", priority: "مكمّل" },
      { name: "NAC", dose: "600 مغ", timing: "بعيداً عن الطعام", priority: "مكمّل" },
    ],
    foods: ["الثوم", "الزنجبيل", "الكركم", "التوت", "الفطر", "العسل"],
    avoid: ["السكر الزائد", "قلة النوم", "الإجهاد المزمن", "التدخين"],
    labs: ["CBC", "Vitamin D", "Zinc", "CRP"],
    warning: "Elderberry قد يحفز المناعة بقوة — تجنّبه في أمراض المناعة الذاتية.",
  },
  {
    id: "skin_protocol",
    title: "بروتوكول الجلد والشعر والأظافر",
    icon: "✨",
    color: "#ec4899",
    category: "جمال",
    duration: "3-6 أشهر",
    supplements: [
      { name: "الكولاجين Type I", dose: "10-15 غ", timing: "صباحاً مع فيتامين C", priority: "أساسي" },
      { name: "البيوتين", dose: "2500-5000 مكغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "الزنك", dose: "15-25 مغ", timing: "مع الطعام", priority: "أساسي" },
      { name: "أوميغا-3", dose: "1-2 غ", timing: "مع الطعام", priority: "أساسي" },
      { name: "فيتامين E", dose: "400 IU", timing: "مع الطعام الدهني", priority: "مكمّل" },
      { name: "Hyaluronic Acid", dose: "120-240 مغ", timing: "مع الطعام", priority: "مكمّل" },
      { name: "Astaxanthin", dose: "4-12 مغ", timing: "مع الطعام الدهني", priority: "مكمّل" },
    ],
    foods: ["الأسماك الدهنية", "الأفوكادو", "المكسرات", "البيض", "التوت", "الخضروات الورقية"],
    avoid: ["السكر الزائد", "التدخين", "الشمس المفرطة بدون حماية", "الكحول"],
    labs: ["Biotin", "Zinc", "Iron", "Vitamin D", "Thyroid Panel"],
    warning: "البيوتين بجرعات عالية قد يؤثر على نتائج تحاليل الغدة الدرقية والقلب.",
  },
  {
    id: "gut_brain_protocol",
    title: "محور الأمعاء-الدماغ (Gut-Brain Axis)",
    icon: "🦠",
    color: "#10b981",
    category: "دماغ وهضم",
    duration: "3 أشهر",
    supplements: [
      { name: "البروبيوتيك (متعدد السلالات)", dose: "50 مليار CFU", timing: "على معدة فارغة", priority: "أساسي" },
      { name: "L-Glutamine", dose: "5-10 غ", timing: "على معدة فارغة", priority: "أساسي" },
      { name: "أوميغا-3", dose: "2 غ", timing: "مع الطعام", priority: "أساسي" },
      { name: "Magnesium L-Threonate", dose: "2 غ", timing: "قبل النوم", priority: "مكمّل" },
      { name: "Saffron", dose: "30 مغ", timing: "مع الطعام", priority: "مكمّل" },
    ],
    foods: ["الكفير", "الكيمتشي", "المخلل الطبيعي", "الزبادي", "الثوم", "الموز الأخضر"],
    avoid: ["المضادات الحيوية غير الضرورية", "السكر الزائد", "الكحول", "الإجهاد المزمن"],
    labs: ["Comprehensive Stool Analysis", "Zonulin", "Serotonin"],
    warning: "البروبيوتيك قد يسبب انتفاخاً في الأسابيع الأولى — هذا طبيعي.",
  },
  {
    id: "nad_protocol",
    title: "بروتوكول رفع NAD+",
    icon: "⚡",
    color: "#f59e0b",
    category: "طول العمر",
    duration: "مستمر",
    supplements: [
      { name: "NMN", dose: "250-500 مغ", timing: "صباحاً على معدة فارغة", priority: "أساسي" },
      { name: "Resveratrol", dose: "250-500 مغ", timing: "مع الطعام الدهني", priority: "أساسي" },
      { name: "TMG (Trimethylglycine)", dose: "500-1000 مغ", timing: "مع الطعام", priority: "مكمّل" },
      { name: "Quercetin", dose: "500-1000 مغ", timing: "مع الطعام", priority: "مكمّل" },
      { name: "Fisetin", dose: "100-200 مغ", timing: "مع الطعام", priority: "مكمّل" },
    ],
    foods: ["التوت الأزرق", "الكيوي", "الأفوكادو", "البروكلي", "الجوز"],
    avoid: ["الكحول", "السكر الزائد", "الجلوس الطويل"],
    labs: ["NAD+ levels", "Biological Age Tests"],
    warning: "NMN قد يزيد حساسية الأنسولين — راقب مستوى السكر إذا كنت مصاباً بالسكري.",
  },
];

const FOOD_ALTERNATIVES = [
  { supplement: "فيتامين D3",    foods: ["أشعة الشمس (20 دقيقة)", "سمك السلمون", "صفار البيض", "كبد البقر", "الفطر المعرّض للشمس"] },
  { supplement: "أوميغا-3",      foods: ["السلمون", "السردين", "الماكريل", "بذور الكتان", "الجوز", "الأنشوجة"] },
  { supplement: "المغنيسيوم",    foods: ["المكسرات (اللوز، الكاجو)", "بذور اليقطين", "الشوكولاتة الداكنة", "السبانخ", "الأفوكادو"] },
  { supplement: "الزنك",         foods: ["المحار", "لحم البقر", "بذور اليقطين", "الكاجو", "الحمص"] },
  { supplement: "فيتامين C",     foods: ["الفلفل الأحمر", "الكيوي", "البرتقال", "الفراولة", "البروكلي"] },
  { supplement: "الحديد",        foods: ["لحم البقر", "الكبد", "العدس", "السبانخ (مع فيتامين C)", "بذور اليقطين"] },
  { supplement: "الكالسيوم",     foods: ["الحليب", "الزبادي", "الجبن", "السردين", "اللوز", "الكرنب"] },
  { supplement: "فيتامين B12",   foods: ["الكبد", "لحم البقر", "السلمون", "البيض", "الحليب"] },
  { supplement: "الكولاجين",     foods: ["مرق العظام", "جلد الدجاج", "الأسماك", "البيض", "فيتامين C يحفز إنتاجه"] },
  { supplement: "البروبيوتيك",   foods: ["الزبادي", "الكفير", "الكيمتشي", "المخلل الطبيعي", "الميسو"] },
  { supplement: "CoQ10",         foods: ["لحم البقر", "الدجاج", "السردين", "الفستق", "البروكلي"] },
  { supplement: "الكرياتين",     foods: ["لحم البقر", "لحم الخنزير", "التونة", "السلمون"] },
  { supplement: "فيتامين K2",    foods: ["Natto (فول الصويا المخمّر)", "الجبن الأصفر", "صفار البيض", "الكبد"] },
  { supplement: "Ashwagandha",   foods: ["لا يوجد بديل غذائي مباشر — نبات طبي"] },
  { supplement: "Berberine",     foods: ["العنب البري (Barberry)", "الكركم (تأثير مشابه جزئياً)"] },
];

const WADA_BANNED = [
  { name: "Ephedrine / Ephedra", category: "منبهات", risk: "محظور", note: "موجود في بعض منتجات إنقاص الوزن" },
  { name: "DMAA (1,3-Dimethylamylamine)", category: "منبهات", risk: "محظور", note: "موجود في بعض مكملات ما قبل التمرين" },
  { name: "Synephrine (فوق 10 مغ)", category: "منبهات", risk: "مقيّد", note: "موجود في البرتقال المر" },
  { name: "Caffeine (فوق 12 مكغ/مل في البول)", category: "منبهات", risk: "مراقَب", note: "الاستخدام المعتدل مسموح" },
  { name: "SARMs (Ostarine, RAD-140...)", category: "عوامل أنابوليكية", risk: "محظور", note: "محظورة في جميع الرياضات" },
  { name: "Prohormones", category: "عوامل أنابوليكية", risk: "محظور", note: "تحوّل لستيرويدات في الجسم" },
  { name: "Peptides (BPC-157, TB-500...)", category: "ببتيدات", risk: "محظور", note: "محظورة في المنافسات الرسمية" },
  { name: "HGH (هرمون النمو)", category: "هرمونات", risk: "محظور", note: "محظور في جميع الرياضات" },
  { name: "Testosterone (خارجي)", category: "هرمونات", risk: "محظور", note: "إلا بإعفاء طبي TUE" },
  { name: "Diuretics (مدرات البول)", category: "مدرات", risk: "محظور", note: "تُستخدم للتلاعب بالوزن" },
  { name: "Clenbuterol", category: "عوامل أنابوليكية", risk: "محظور", note: "موجود أحياناً في اللحوم الملوثة" },
  { name: "Modafinil", category: "منبهات", risk: "محظور", note: "دواء يقظة" },
];

const VEGAN_SUPPLEMENTS = [
  { name: "فيتامين D3 (من الطحالب)", status: "متاح", note: "D3 من Lichen — بديل نباتي للـ D3 الحيواني" },
  { name: "أوميغا-3 (من الطحالب)", status: "متاح", note: "Algae Oil — مصدر DHA/EPA نباتي مباشر" },
  { name: "الكولاجين", status: "غير متاح", note: "الكولاجين حيواني المصدر دائماً — استخدم Vitamin C + Glycine كبديل" },
  { name: "فيتامين B12", status: "ضروري", note: "النباتيون يحتاجون تكميلاً إلزامياً — Methylcobalamin" },
  { name: "الحديد", status: "تحقق", note: "بعض المنتجات من مصادر حيوانية — ابحث عن Non-heme iron" },
  { name: "الزنك", status: "متاح", note: "معظم أشكال الزنك نباتية المصدر" },
  { name: "المغنيسيوم", status: "متاح", note: "معظم أشكال المغنيسيوم نباتية المصدر" },
  { name: "Whey Protein", status: "غير متاح", note: "مشتق من الحليب — استخدم بروتين البازلاء أو الأرز" },
  { name: "Casein Protein", status: "غير متاح", note: "مشتق من الحليب" },
  { name: "Creatine", status: "متاح", note: "يُصنَّع صناعياً — نباتي 100%" },
  { name: "Beta-Alanine", status: "متاح", note: "يُصنَّع صناعياً — نباتي 100%" },
  { name: "Glucosamine", status: "تحقق", note: "معظمه من المحار — ابحث عن Glucosamine من الذرة" },
];

type LibTab = "articles" | "protocols" | "food" | "wada" | "vegan";

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<LibTab>("articles");
  const [selectedArticle, setSelectedArticle] = useState<typeof ARTICLES[0] | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<typeof PROTOCOLS[0] | null>(null);
  const [protocolTab, setProtocolTab] = useState<"supplements" | "foods" | "labs">("supplements");

  const tabs = [
    { id: "articles" as LibTab,  label: "مقالات",     icon: "book.fill" as const },
    { id: "protocols" as LibTab, label: "بروتوكولات", icon: "list.bullet.clipboard.fill" as const },
    { id: "food" as LibTab,      label: "بدائل غذائية", icon: "leaf.fill" as const },
    { id: "wada" as LibTab,      label: "WADA",        icon: "exclamationmark.shield.fill" as const },
    { id: "vegan" as LibTab,     label: "نباتي",       icon: "checkmark.seal.fill" as const },
  ];

  // ─── Article Detail ───
  if (selectedArticle) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.detailHeader, { paddingTop: insets.top + 8, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedArticle(null)}>
            <IconSymbol name="chevron.right" size={20} color={colors.primary} />
            <Text style={[styles.backText, { color: colors.primary }]}>المكتبة</Text>
          </Pressable>
          <View style={[styles.articleBadge, { backgroundColor: selectedArticle.color + "20" }]}>
            <Text style={[styles.articleBadgeText, { color: selectedArticle.color }]}>{selectedArticle.category}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View style={styles.articleTitleRow}>
            <Text style={styles.articleTitleEmoji}>{selectedArticle.icon}</Text>
            <Text style={[styles.articleTitle, { color: colors.foreground }]}>{selectedArticle.title}</Text>
          </View>
          <View style={[styles.readTimeRow, { borderBottomColor: colors.border }]}>
            <IconSymbol name="clock.fill" size={14} color={colors.muted} />
            <Text style={[styles.readTimeText, { color: colors.muted }]}>وقت القراءة: {selectedArticle.readTime}</Text>
          </View>
          <Text style={[styles.articleContent, { color: colors.foreground }]}>{selectedArticle.content}</Text>
        </ScrollView>
      </View>
    );
  }

  // ─── Protocol Detail ───
  if (selectedProtocol) {
    const p = selectedProtocol;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.detailHeader, { paddingTop: insets.top + 8, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedProtocol(null)}>
            <IconSymbol name="chevron.right" size={20} color={colors.primary} />
            <Text style={[styles.backText, { color: colors.primary }]}>البروتوكولات</Text>
          </Pressable>
          <Text style={[styles.protocolDuration, { color: colors.muted }]}>المدة: {p.duration}</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={[styles.protocolDetailBanner, { backgroundColor: p.color + "15" }]}>
            <Text style={styles.protocolDetailEmoji}>{p.icon}</Text>
            <Text style={[styles.protocolDetailTitle, { color: colors.foreground }]}>{p.title}</Text>
          </View>

          {/* Sub Tabs */}
          <View style={[styles.subTabRow, { borderBottomColor: colors.border }]}>
            {([["supplements", "المكملات"], ["foods", "الطعام والتجنب"], ["labs", "التحاليل"]] as const).map(([id, label]) => (
              <Pressable key={id} style={[styles.subTab, protocolTab === id && { borderBottomColor: p.color, borderBottomWidth: 2 }]}
                onPress={() => setProtocolTab(id)}>
                <Text style={[styles.subTabText, { color: protocolTab === id ? p.color : colors.muted }]}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ padding: 16, gap: 10 }}>
            {protocolTab === "supplements" && p.supplements.map((s, i) => (
              <View key={i} style={[styles.suppRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.priorityDot, { backgroundColor: s.priority === "أساسي" ? p.color : s.priority === "مكمّل" ? colors.warning : colors.muted }]} />
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.suppName, { color: colors.foreground }]}>{s.name}</Text>
                  <Text style={[styles.suppDose, { color: colors.muted }]}>{s.dose} — {s.timing}</Text>
                </View>
                <View style={[styles.priorityChip, { backgroundColor: s.priority === "أساسي" ? p.color + "20" : colors.surface }]}>
                  <Text style={[styles.priorityChipText, { color: s.priority === "أساسي" ? p.color : colors.muted }]}>{s.priority}</Text>
                </View>
              </View>
            ))}

            {protocolTab === "foods" && (
              <>
                <Text style={[styles.foodSectionTitle, { color: colors.success }]}>✅ الأطعمة الداعمة</Text>
                <View style={styles.foodGrid}>
                  {p.foods.map((f, i) => (
                    <View key={i} style={[styles.foodChip, { backgroundColor: colors.success + "15", borderColor: colors.success + "40" }]}>
                      <Text style={[styles.foodChipText, { color: colors.success }]}>{f}</Text>
                    </View>
                  ))}
                </View>
                <Text style={[styles.foodSectionTitle, { color: colors.error, marginTop: 16 }]}>❌ تجنّب</Text>
                <View style={styles.foodGrid}>
                  {p.avoid.map((a, i) => (
                    <View key={i} style={[styles.foodChip, { backgroundColor: colors.error + "15", borderColor: colors.error + "40" }]}>
                      <Text style={[styles.foodChipText, { color: colors.error }]}>{a}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.warningBox, { backgroundColor: colors.warning + "15", borderColor: colors.warning + "40" }]}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
                  <Text style={[styles.warningText, { color: colors.foreground }]}>{p.warning}</Text>
                </View>
              </>
            )}

            {protocolTab === "labs" && (
              <>
                <Text style={[styles.foodSectionTitle, { color: colors.primary }]}>التحاليل المطلوبة</Text>
                {p.labs.map((lab, i) => (
                  <View key={i} style={[styles.labRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <IconSymbol name="testtube.2" size={16} color={colors.primary} />
                    <Text style={[styles.labName, { color: colors.foreground }]}>{lab}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>المكتبة العلمية</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>مقالات، بروتوكولات، وأدلة علمية</Text>
      </View>

      {/* Tab Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {tabs.map((tab) => (
          <Pressable key={tab.id} style={[styles.tabBtn, {
            backgroundColor: activeTab === tab.id ? colors.primary + "18" : colors.surface,
            borderColor: activeTab === tab.id ? colors.primary : colors.border,
          }]} onPress={() => setActiveTab(tab.id)}>
            <IconSymbol name={tab.icon} size={16} color={activeTab === tab.id ? colors.primary : colors.muted} />
            <Text style={[styles.tabLabel, { color: activeTab === tab.id ? colors.primary : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ══ ARTICLES ══ */}
      {activeTab === "articles" && (
        <FlatList
          data={ARTICLES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Pressable style={[styles.articleCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: item.color, borderLeftWidth: 4 }]}
              onPress={() => setSelectedArticle(item)}>
              <View style={styles.articleCardHeader}>
                <Text style={styles.articleCardEmoji}>{item.icon}</Text>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.articleCardTitle, { color: colors.foreground }]}>{item.title}</Text>
                  <View style={styles.articleMeta}>
                    <Text style={[styles.articleCategory, { color: item.color }]}>{item.category}</Text>
                    <Text style={[styles.articleReadTime, { color: colors.muted }]}>{item.readTime}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.readMoreRow}>
                <IconSymbol name="chevron.right" size={14} color={colors.muted} />
                <Text style={[styles.readMoreText, { color: colors.muted }]}>اقرأ المقال</Text>
              </View>
            </Pressable>
          )}
        />
      )}

      {/* ══ PROTOCOLS ══ */}
      {activeTab === "protocols" && (
        <FlatList
          data={PROTOCOLS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Pressable style={[styles.protocolCard, { backgroundColor: colors.card, borderColor: item.color + "40" }]}
              onPress={() => { setSelectedProtocol(item); setProtocolTab("supplements"); }}>
              <View style={[styles.protocolIcon, { backgroundColor: item.color + "20" }]}>
                <Text style={styles.protocolIconText}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.protocolMeta, { color: colors.muted }]}>
                  {item.supplements.length} مكمل · {item.duration}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={18} color={colors.muted} />
            </Pressable>
          )}
        />
      )}

      {/* ══ FOOD ALTERNATIVES ══ */}
      {activeTab === "food" && (
        <FlatList
          data={FOOD_ALTERNATIVES}
          keyExtractor={(item) => item.supplement}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          ListHeaderComponent={() => (
            <View style={[styles.infoCard, { backgroundColor: colors.success + "10", borderColor: colors.success + "30", marginBottom: 4 }]}>
              <IconSymbol name="leaf.fill" size={16} color={colors.success} />
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                الحصول على المغذيات من الطعام أفضل من المكملات كلما أمكن.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={[styles.foodAltCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.foodAltSupp, { color: colors.primary }]}>{item.supplement}</Text>
              <View style={styles.foodAltList}>
                {item.foods.map((f, i) => (
                  <View key={i} style={[styles.foodAltChip, { backgroundColor: colors.success + "12" }]}>
                    <Text style={[styles.foodAltChipText, { color: colors.success }]}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      )}

      {/* ══ WADA ══ */}
      {activeTab === "wada" && (
        <FlatList
          data={WADA_BANNED}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          ListHeaderComponent={() => (
            <View style={[styles.infoCard, { backgroundColor: colors.error + "10", borderColor: colors.error + "30", marginBottom: 4 }]}>
              <IconSymbol name="exclamationmark.shield.fill" size={16} color={colors.error} />
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                قائمة المواد المحظورة في الرياضة (WADA 2024). تحقق دائماً من الموقع الرسمي قبل المنافسات.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={[styles.wadaCard, { backgroundColor: colors.card, borderColor: item.risk === "محظور" ? colors.error + "40" : item.risk === "مقيّد" ? colors.warning + "40" : colors.border }]}>
              <View style={styles.wadaHeader}>
                <View style={[styles.wadaBadge, { backgroundColor: item.risk === "محظور" ? colors.error + "20" : item.risk === "مقيّد" ? colors.warning + "20" : colors.surface }]}>
                  <Text style={[styles.wadaBadgeText, { color: item.risk === "محظور" ? colors.error : item.risk === "مقيّد" ? colors.warning : colors.muted }]}>{item.risk}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.wadaName, { color: colors.foreground }]}>{item.name}</Text>
                  <Text style={[styles.wadaCategory, { color: colors.muted }]}>{item.category}</Text>
                </View>
              </View>
              <Text style={[styles.wadaNote, { color: colors.muted }]}>{item.note}</Text>
            </View>
          )}
        />
      )}

      {/* ══ VEGAN ══ */}
      {activeTab === "vegan" && (
        <FlatList
          data={VEGAN_SUPPLEMENTS}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          ListHeaderComponent={() => (
            <View style={[styles.infoCard, { backgroundColor: colors.success + "10", borderColor: colors.success + "30", marginBottom: 4 }]}>
              <IconSymbol name="leaf.fill" size={16} color={colors.success} />
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                دليل المكملات للنباتيين والنباتيين الصارمين (Vegan).
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={[styles.veganCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.veganHeader}>
                <View style={[styles.veganStatus, {
                  backgroundColor: item.status === "متاح" ? colors.success + "20" : item.status === "غير متاح" ? colors.error + "20" : item.status === "ضروري" ? colors.primary + "20" : colors.warning + "20"
                }]}>
                  <Text style={[styles.veganStatusText, {
                    color: item.status === "متاح" ? colors.success : item.status === "غير متاح" ? colors.error : item.status === "ضروري" ? colors.primary : colors.warning
                  }]}>{item.status}</Text>
                </View>
                <Text style={[styles.veganName, { color: colors.foreground }]}>{item.name}</Text>
              </View>
              <Text style={[styles.veganNote, { color: colors.muted }]}>{item.note}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  tabBar: { flexDirection: "row-reverse", padding: 12, gap: 8, borderBottomWidth: 0.5 },
  tabBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  tabLabel: { fontSize: 12, fontWeight: "600", fontFamily: "Cairo-Bold" },
  infoCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },

  // Article Card
  articleCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  articleCardHeader: { flexDirection: "row-reverse", gap: 12, alignItems: "flex-start" },
  articleCardEmoji: { fontSize: 32, fontFamily: "Cairo" },
  articleCardTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", lineHeight: 22, fontFamily: "Cairo-Black" },
  articleMeta: { flexDirection: "row-reverse", gap: 10, marginTop: 4, alignItems: "center" },
  articleCategory: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  articleReadTime: { fontSize: 11, fontFamily: "Cairo" },
  readMoreRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  readMoreText: { fontSize: 12, fontFamily: "Cairo" },

  // Article Detail
  detailHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  backText: { fontSize: 15, fontWeight: "700", fontFamily: "Cairo-Bold" },
  articleBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  articleBadgeText: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },
  articleTitleRow: { flexDirection: "row-reverse", gap: 12, alignItems: "flex-start", marginBottom: 12 },
  articleTitleEmoji: { fontSize: 40, fontFamily: "Cairo" },
  articleTitle: { fontSize: 20, fontWeight: "900", flex: 1, textAlign: "right", lineHeight: 28, fontFamily: "Cairo-Black" },
  readTimeRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingBottom: 16, marginBottom: 16, borderBottomWidth: 0.5 },
  readTimeText: { fontSize: 12, fontFamily: "Cairo" },
  articleContent: { fontSize: 14, lineHeight: 24, textAlign: "right", fontFamily: "Cairo" },

  // Protocol Card
  protocolCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1.5 },
  protocolIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  protocolIconText: { fontSize: 26, fontFamily: "Cairo" },
  protocolTitle: { fontSize: 15, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  protocolMeta: { fontSize: 12, marginTop: 3, textAlign: "right", fontFamily: "Cairo" },

  // Protocol Detail
  protocolDetailBanner: { padding: 20, alignItems: "center", gap: 8 },
  protocolDetailEmoji: { fontSize: 48, fontFamily: "Cairo" },
  protocolDetailTitle: { fontSize: 20, fontWeight: "900", textAlign: "center", fontFamily: "Cairo-Black" },
  protocolDuration: { fontSize: 13, fontFamily: "Cairo" },
  subTabRow: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  subTab: { flex: 1, alignItems: "center", paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: "transparent" },
  subTabText: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  suppRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  suppName: { fontSize: 14, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  suppDose: { fontSize: 11, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  priorityChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  priorityChipText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  foodSectionTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 8, fontFamily: "Cairo-Black" },
  foodGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  foodChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  foodChipText: { fontSize: 12, fontWeight: "600", fontFamily: "Cairo-Bold" },
  warningBox: { flexDirection: "row-reverse", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 12, alignItems: "flex-start" },
  warningText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  labRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  labName: { fontSize: 14, fontWeight: "600", fontFamily: "Cairo-Bold" },

  // Food Alternatives
  foodAltCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  foodAltSupp: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 8, fontFamily: "Cairo-Black" },
  foodAltList: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  foodAltChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  foodAltChipText: { fontSize: 11, fontWeight: "600", fontFamily: "Cairo-Bold" },

  // WADA
  wadaCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  wadaHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  wadaBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  wadaBadgeText: { fontSize: 11, fontWeight: "800", fontFamily: "Cairo-Black" },
  wadaName: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  wadaCategory: { fontSize: 11, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  wadaNote: { fontSize: 12, textAlign: "right", lineHeight: 18, fontFamily: "Cairo" },

  // Vegan
  veganCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 8 },
  veganHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  veganStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  veganStatusText: { fontSize: 11, fontWeight: "800", fontFamily: "Cairo-Black" },
  veganName: { fontSize: 14, fontWeight: "800", flex: 1, textAlign: "right", fontFamily: "Cairo-Black" },
  veganNote: { fontSize: 12, textAlign: "right", lineHeight: 18, fontFamily: "Cairo" },
});
