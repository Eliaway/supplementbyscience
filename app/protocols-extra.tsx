/**
 * بروتوكولات إضافية شاملة
 * Features: 64, 68, 69, 70, 72, 74, 75, 77, 78, 79, 81, 83, 85, 86, 88, 90, 101-115, 120-123, 128-131, 135-138
 */
import { useState } from "react";
import { FlatList, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface Protocol {
  id: string;
  title: string;
  category: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  supplements: { name: string; dose: string; timing: string; note: string }[];
  description: string;
  duration: string;
  caution?: string;
}

const EXTRA_PROTOCOLS: Protocol[] = [
  {
    id: "detox",
    title: "إزالة السموم الثقيلة",
    category: "تخلص من السموم",
    icon: "shield.fill",
    color: "#10B981",
    description: "بروتوكول علمي لدعم الجسم في التخلص من المعادن الثقيلة والسموم البيئية",
    duration: "8-12 أسبوع",
    caution: "استشر طبيبك قبل البدء — لا تستخدم الـ Chelation دون إشراف طبي",
    supplements: [
      { name: "NAC (N-Acetyl Cysteine)", dose: "600 مغ × 2", timing: "مع الطعام", note: "يرفع الجلوتاثيون — مضاد أكسدة قوي" },
      { name: "Chlorella", dose: "3-5 غ يومياً", timing: "قبل الطعام", note: "ترتبط بالمعادن الثقيلة في الجهاز الهضمي" },
      { name: "Zeolite (Clinoptilolite)", dose: "2-3 غ", timing: "بعيداً عن الأدوية", note: "يمتص المعادن الثقيلة في الأمعاء" },
      { name: "Alpha Lipoic Acid", dose: "300 مغ", timing: "مع الطعام", note: "مضاد أكسدة يعبر الحاجز الدموي الدماغي" },
      { name: "Milk Thistle (Silymarin)", dose: "400 مغ", timing: "مع الطعام", note: "يحمي الكبد أثناء عملية التخلص من السموم" },
      { name: "Vitamin C", dose: "2-3 غ", timing: "موزعة على اليوم", note: "يدعم إنتاج الجلوتاثيون ويحمي الخلايا" },
    ],
  },
  {
    id: "fertility_male",
    title: "تحسين الخصوبة الذكورية",
    category: "الصحة الجنسية",
    icon: "bolt.fill",
    color: "#3B82F6",
    description: "بروتوكول علمي لتحسين جودة الحيوانات المنوية وزيادة الخصوبة",
    duration: "3-6 أشهر (دورة إنتاج الحيوانات المنوية 74 يوم)",
    caution: "قيّم مع طبيب متخصص في الخصوبة",
    supplements: [
      { name: "CoQ10 (Ubiquinol)", dose: "200-400 مغ", timing: "مع الطعام الدهني", note: "يحسن حركة الحيوانات المنوية بشكل ملحوظ" },
      { name: "Zinc", dose: "25-30 مغ", timing: "مع الطعام", note: "ضروري لإنتاج التستوستيرون وصحة الحيوانات المنوية" },
      { name: "Selenium", dose: "100-200 مكغ", timing: "مع الطعام", note: "يحمي الحيوانات المنوية من الأكسدة" },
      { name: "Vitamin E", dose: "400 IU", timing: "مع الطعام الدهني", note: "مضاد أكسدة يحمي غشاء الحيوانات المنوية" },
      { name: "L-Carnitine", dose: "2-3 غ", timing: "قبل الطعام", note: "يحسن حركة وعدد الحيوانات المنوية" },
      { name: "Ashwagandha KSM-66", dose: "600 مغ", timing: "مع الطعام", note: "يخفض الكورتيزول ويحسن جودة الحيوانات المنوية" },
    ],
  },
  {
    id: "fertility_female",
    title: "تحسين الخصوبة الأنثوية",
    category: "الصحة الجنسية",
    icon: "heart.fill",
    color: "#EC4899",
    description: "بروتوكول لدعم الصحة الإنجابية للمرأة وتحسين جودة البويضات",
    duration: "3-6 أشهر قبل الحمل",
    caution: "استشري طبيبة متخصصة في الخصوبة قبل البدء",
    supplements: [
      { name: "CoQ10 (Ubiquinol)", dose: "400-600 مغ", timing: "مع الطعام الدهني", note: "يحسن جودة البويضات — مهم جداً فوق 35 سنة" },
      { name: "Folate (Methylfolate)", dose: "400-800 مكغ", timing: "صباحاً", note: "يمنع عيوب الأنبوب العصبي — ابدئي قبل الحمل بـ 3 أشهر" },
      { name: "Vitamin D3", dose: "2000-4000 IU", timing: "مع الطعام الدهني", note: "نقصه يرتبط بمشاكل الخصوبة وتكيس المبايض" },
      { name: "Inositol (Myo + D-Chiro)", dose: "4 غ Myo + 400 مغ D-Chiro", timing: "مقسمة على وجبتين", note: "فعّال جداً لتكيس المبايض PCOS" },
      { name: "Iron (Ferrous Bisglycinate)", dose: "حسب تحليل الدم", timing: "على معدة فارغة", note: "نقص الحديد شائع ويؤثر على الخصوبة" },
      { name: "Omega-3 (EPA+DHA)", dose: "2 غ", timing: "مع الطعام", note: "يدعم صحة الأجنة ويقلل الالتهاب" },
    ],
  },
  {
    id: "estrogen_balance",
    title: "موازنة الإستروجين",
    category: "الهرمونات",
    icon: "waveform.path",
    color: "#A855F7",
    description: "بروتوكول لموازنة مستويات الإستروجين وتحسين استقلابه",
    duration: "2-3 أشهر",
    caution: "قيسي مستويات الهرمونات قبل وبعد البروتوكول",
    supplements: [
      { name: "DIM (Diindolylmethane)", dose: "200-400 مغ", timing: "مع الطعام", note: "يحول الإستروجين الضار إلى شكل مفيد" },
      { name: "Calcium D-Glucarate", dose: "500-1000 مغ", timing: "مع الطعام", note: "يدعم إزالة الإستروجين الزائد عبر الكبد" },
      { name: "Indole-3-Carbinol (I3C)", dose: "200-400 مغ", timing: "مع الطعام", note: "موجود في الخضروات الصليبية — يوازن الإستروجين" },
      { name: "Magnesium Glycinate", dose: "400 مغ", timing: "قبل النوم", note: "يدعم استقلاب الإستروجين في الكبد" },
      { name: "B6 (P5P)", dose: "50 مغ", timing: "مع الطعام", note: "يدعم استقلاب الهرمونات" },
      { name: "Probiotics", dose: "50 مليار CFU", timing: "مع الطعام", note: "الميكروبيوم يؤثر على إعادة امتصاص الإستروجين" },
    ],
  },
  {
    id: "alzheimer_prevention",
    title: "الوقاية من الزهايمر",
    category: "صحة الدماغ",
    icon: "brain.head.profile",
    color: "#6366F1",
    description: "بروتوكول علمي للوقاية من التدهور المعرفي والزهايمر",
    duration: "مدى الحياة — ابدأ مبكراً",
    supplements: [
      { name: "Lion's Mane", dose: "1-3 غ", timing: "مع الطعام", note: "يحفز NGF لنمو الأعصاب — أقوى مكمل للدماغ" },
      { name: "Bacopa Monnieri", dose: "300-600 مغ", timing: "مع الطعام الدهني", note: "يحسن الذاكرة ويحمي الخلايا العصبية" },
      { name: "Omega-3 DHA", dose: "2-3 غ DHA", timing: "مع الطعام", note: "الدماغ 60% دهون — DHA أساسي لصحته" },
      { name: "Phosphatidylserine", dose: "300 مغ", timing: "مع الطعام", note: "يحسن الذاكرة ويبطئ التدهور المعرفي" },
      { name: "Vitamin D3", dose: "4000-5000 IU", timing: "مع الطعام الدهني", note: "نقصه يرتبط بزيادة خطر الزهايمر" },
      { name: "Resveratrol", dose: "250-500 مغ", timing: "مع الطعام", note: "يقلل تراكم Beta-Amyloid في الدماغ" },
    ],
  },
  {
    id: "adhd_support",
    title: "دعم التركيز والانتباه (ADHD)",
    category: "صحة الدماغ",
    icon: "bolt.fill",
    color: "#F59E0B",
    description: "مكملات لدعم التركيز والانتباه — مكملة للعلاج الطبي وليست بديلاً عنه",
    duration: "مستمر",
    caution: "هذا البروتوكول مكمل للعلاج الطبي وليس بديلاً عنه",
    supplements: [
      { name: "Omega-3 (EPA:DHA 3:2)", dose: "2-3 غ", timing: "مع الطعام", note: "الدراسات تظهر تحسناً في أعراض ADHD" },
      { name: "Magnesium Glycinate", dose: "300-400 مغ", timing: "قبل النوم", note: "نقصه شائع في ADHD ويزيد فرط الحركة" },
      { name: "Zinc", dose: "20-25 مغ", timing: "مع الطعام", note: "يدعم إنتاج الدوبامين والنورإبينفرين" },
      { name: "Iron (إذا كان ناقصاً)", dose: "حسب التحليل", timing: "على معدة فارغة", note: "نقص الحديد يشبه أعراض ADHD" },
      { name: "L-Theanine", dose: "200 مغ", timing: "صباحاً", note: "يحسن التركيز دون قلق — مفيد مع الكافيين" },
      { name: "Phosphatidylserine", dose: "200-300 مغ", timing: "مع الطعام", note: "يحسن الذاكرة العاملة والتركيز" },
    ],
  },
  {
    id: "bone_health",
    title: "صحة العظام المتقدمة",
    category: "العظام والمفاصل",
    icon: "figure.walk",
    color: "#64748B",
    description: "بروتوكول شامل لبناء كثافة العظام والوقاية من هشاشة العظام",
    duration: "مستمر — التأثير يظهر بعد 6-12 شهر",
    supplements: [
      { name: "Calcium Citrate", dose: "500 مغ × 2", timing: "مع الطعام (مقسمة)", note: "Citrate أفضل امتصاصاً من Carbonate" },
      { name: "Vitamin D3", dose: "4000-5000 IU", timing: "مع الطعام الدهني", note: "ضروري لامتصاص الكالسيوم" },
      { name: "Vitamin K2 (MK-7)", dose: "180-200 مكغ", timing: "مع الطعام الدهني", note: "يوجه الكالسيوم للعظام بعيداً عن الشرايين" },
      { name: "Magnesium Glycinate", dose: "400 مغ", timing: "قبل النوم", note: "50% من الجسم في العظام — ضروري لبنيتها" },
      { name: "Boron", dose: "3-6 مغ", timing: "مع الطعام", note: "يحسن استخدام الكالسيوم والمغنيسيوم في العظام" },
      { name: "Collagen Type I", dose: "10 غ", timing: "على معدة فارغة", note: "يبني المصفوفة العضوية للعظام" },
    ],
  },
  {
    id: "chronic_pain",
    title: "إدارة الألم المزمن",
    category: "الألم والالتهاب",
    icon: "heart.fill",
    color: "#EF4444",
    description: "مكملات طبيعية لتقليل الالتهاب وإدارة الألم المزمن",
    duration: "2-3 أشهر للتأثير الكامل",
    caution: "لا تستبدل الأدوية الموصوفة — استشر طبيبك",
    supplements: [
      { name: "Curcumin (Meriva/Theracurmin)", dose: "1-2 غ", timing: "مع الطعام الدهني", note: "مضاد التهاب قوي — الشكل المحسّن ضروري" },
      { name: "Omega-3 (EPA عالي)", dose: "3-4 غ EPA", timing: "مع الطعام", note: "يقلل الالتهاب بشكل ملحوظ بجرعات عالية" },
      { name: "Boswellia (AKBA)", dose: "300-500 مغ", timing: "مع الطعام", note: "يثبط 5-LOX — مضاد التهاب قوي للمفاصل" },
      { name: "Magnesium Malate", dose: "400-600 مغ", timing: "مع الطعام", note: "مفيد لألم الفيبروميالجيا والعضلات" },
      { name: "PEA (Palmitoylethanolamide)", dose: "600 مغ × 2", timing: "مع الطعام", note: "مضاد ألم طبيعي — يعمل على مستقبلات الكانابينويد" },
      { name: "Vitamin D3", dose: "5000 IU", timing: "مع الطعام الدهني", note: "نقصه يزيد الحساسية للألم بشكل ملحوظ" },
    ],
  },
  {
    id: "circulation",
    title: "تحسين الدورة الدموية",
    category: "القلب والأوعية",
    icon: "heart.circle.fill",
    color: "#EF4444",
    description: "بروتوكول لتحسين الدورة الدموية وصحة الأوعية الدموية",
    duration: "2-3 أشهر",
    supplements: [
      { name: "Ginkgo Biloba", dose: "120-240 مغ", timing: "مع الطعام", note: "يحسن الدورة الدموية الدماغية والطرفية" },
      { name: "Nattokinase", dose: "2000-4000 FU", timing: "على معدة فارغة", note: "يحسن سيولة الدم — احذر مع مضادات التخثر" },
      { name: "Pycnogenol", dose: "100-200 مغ", timing: "مع الطعام", note: "يقوي جدران الأوعية الدموية" },
      { name: "L-Arginine", dose: "3-6 غ", timing: "قبل التمرين", note: "يحفز إنتاج NO لتوسيع الأوعية" },
      { name: "Vitamin E (Mixed Tocopherols)", dose: "400 IU", timing: "مع الطعام الدهني", note: "يمنع أكسدة LDL ويحمي الأوعية" },
      { name: "Coenzyme Q10", dose: "200-300 مغ", timing: "مع الطعام الدهني", note: "يحسن كفاءة عضلة القلب والأوعية" },
    ],
  },
  {
    id: "ibs_support",
    title: "متلازمة القولون العصبي",
    category: "الجهاز الهضمي",
    icon: "waveform.path",
    color: "#10B981",
    description: "بروتوكول لإدارة أعراض القولون العصبي وتحسين صحة الجهاز الهضمي",
    duration: "2-3 أشهر",
    supplements: [
      { name: "Peppermint Oil (Enteric Coated)", dose: "0.2 مل × 2", timing: "بين الوجبات", note: "يقلل تشنجات القولون — يجب أن يكون Enteric Coated" },
      { name: "Psyllium Husk", dose: "5-10 غ", timing: "مع الماء الكافي", note: "يوازن الحركة المعوية — مفيد للإسهال والإمساك" },
      { name: "L-Glutamine", dose: "5-10 غ", timing: "على معدة فارغة", note: "يصلح بطانة الأمعاء ويقلل النفاذية" },
      { name: "Probiotics (Multi-strain)", dose: "50 مليار CFU", timing: "مع الطعام", note: "يوازن الميكروبيوم — ابحث عن Lactobacillus + Bifidobacterium" },
      { name: "Digestive Enzymes", dose: "1-2 كبسولة", timing: "مع كل وجبة", note: "يحسن الهضم ويقلل الانتفاخ" },
      { name: "Zinc Carnosine", dose: "75 مغ", timing: "مع الطعام", note: "يصلح بطانة المعدة والأمعاء" },
    ],
  },
  {
    id: "burnout",
    title: "إدارة الإرهاق الوظيفي",
    category: "الصحة النفسية",
    icon: "bolt.fill",
    color: "#F97316",
    description: "بروتوكول للتعافي من الإرهاق الوظيفي وإعادة الطاقة",
    duration: "2-4 أشهر",
    supplements: [
      { name: "Ashwagandha KSM-66", dose: "600 مغ", timing: "مع الطعام", note: "يخفض الكورتيزول 28% — أقوى مكمل للإرهاق" },
      { name: "Rhodiola Rosea", dose: "400-600 مغ", timing: "صباحاً على معدة فارغة", note: "يحسن المقاومة للإجهاد ويقلل التعب الذهني" },
      { name: "Magnesium Glycinate", dose: "400-500 مغ", timing: "قبل النوم", note: "نقصه شائع في الإرهاق — يحسن النوم والمزاج" },
      { name: "Vitamin B Complex", dose: "B-100 Complex", timing: "مع الطعام الصباحي", note: "يدعم إنتاج الطاقة والجهاز العصبي" },
      { name: "Coenzyme Q10", dose: "200-300 مغ", timing: "مع الطعام الدهني", note: "يحسن إنتاج الطاقة في الخلايا" },
      { name: "L-Tyrosine", dose: "500-1000 مغ", timing: "على معدة فارغة", note: "يدعم إنتاج الدوبامين والنورإبينفرين" },
    ],
  },
  {
    id: "quit_smoking",
    title: "دعم التوقف عن التدخين",
    category: "الصحة العامة",
    icon: "leaf.fill",
    color: "#22C55E",
    description: "مكملات لدعم الجسم أثناء التوقف عن التدخين وإصلاح الأضرار",
    duration: "3-6 أشهر",
    supplements: [
      { name: "Vitamin C", dose: "2-3 غ", timing: "موزعة على اليوم", note: "التدخين يستنزف فيتامين C بشكل كبير" },
      { name: "NAC", dose: "600 مغ × 2", timing: "مع الطعام", note: "يصلح أضرار الرئة ويقلل الرغبة في التدخين" },
      { name: "Magnesium Glycinate", dose: "400 مغ", timing: "قبل النوم", note: "يقلل القلق والتوتر أثناء الإقلاع" },
      { name: "Omega-3", dose: "3 غ", timing: "مع الطعام", note: "يقلل الالتهاب في الرئة ويحسن المزاج" },
      { name: "Coenzyme Q10", dose: "200 مغ", timing: "مع الطعام الدهني", note: "يصلح أضرار الميتوكوندريا من التدخين" },
      { name: "Zinc", dose: "25 مغ", timing: "مع الطعام", note: "يصلح حاسة الشم والتذوق المتضررة" },
    ],
  },
  {
    id: "eye_protection",
    title: "حماية العيون من الشاشات",
    category: "صحة العيون",
    icon: "eye.fill",
    color: "#0EA5E9",
    description: "بروتوكول لحماية العيون من الضوء الأزرق وإجهاد الشاشات",
    duration: "مستمر",
    supplements: [
      { name: "Lutein + Zeaxanthin", dose: "20 مغ + 4 مغ", timing: "مع الطعام الدهني", note: "يبني الصبغة البقعية ويحمي من الضوء الأزرق" },
      { name: "Astaxanthin", dose: "6-12 مغ", timing: "مع الطعام الدهني", note: "أقوى مضاد أكسدة للعيون — يقلل إجهاد الشاشات" },
      { name: "Omega-3 DHA", dose: "2 غ DHA", timing: "مع الطعام", note: "الشبكية 60% DHA — ضروري لصحة العيون" },
      { name: "Vitamin A (Beta-Carotene)", dose: "10,000 IU", timing: "مع الطعام الدهني", note: "ضروري لإنتاج الرودوبسين في الشبكية" },
      { name: "Bilberry Extract", dose: "160-320 مغ", timing: "مع الطعام", note: "يحسن الرؤية الليلية ويقلل إجهاد العيون" },
      { name: "Zinc", dose: "25 مغ", timing: "مع الطعام", note: "يدعم صحة الشبكية ويقلل خطر AMD" },
    ],
  },
  {
    id: "nad_plus",
    title: "تحسين مستوى NAD+",
    category: "مكافحة الشيخوخة",
    icon: "sparkles",
    color: "#8B5CF6",
    description: "بروتوكول لرفع مستويات NAD+ — جزيء الطاقة والشباب",
    duration: "مستمر",
    supplements: [
      { name: "NMN (Nicotinamide Mononucleotide)", dose: "500-1000 مغ", timing: "صباحاً على معدة فارغة", note: "سلف مباشر لـ NAD+ — الأكثر فعالية" },
      { name: "NR (Nicotinamide Riboside)", dose: "300-500 مغ", timing: "صباحاً", note: "بديل NMN — أرخص وأكثر دراسة" },
      { name: "Resveratrol", dose: "500 مغ", timing: "مع الطعام الدهني", note: "يفعّل Sirtuins التي تستخدم NAD+" },
      { name: "Quercetin", dose: "500 مغ", timing: "مع الطعام", note: "Senolytic — يزيل الخلايا الشائخة" },
      { name: "Fisetin", dose: "100-200 مغ", timing: "مع الطعام الدهني", note: "Senolytic قوي — يحسن الذاكرة" },
      { name: "TMG (Trimethylglycine)", dose: "500 مغ", timing: "مع NMN", note: "يمنع استنزاف المثيل من رفع NAD+" },
    ],
  },
  {
    id: "autophagy",
    title: "دعم الـ Autophagy",
    category: "مكافحة الشيخوخة",
    icon: "arrow.clockwise",
    color: "#14B8A6",
    description: "بروتوكول لتحفيز عملية إعادة تدوير الخلايا (Autophagy) — تنظيف الجسم من الداخل",
    duration: "مستمر — يتحسن مع الصيام المتقطع",
    supplements: [
      { name: "Spermidine", dose: "1-2 مغ", timing: "مع الطعام", note: "محفز قوي للـ Autophagy — موجود في القمح والفول" },
      { name: "Berberine", dose: "500 مغ × 2", timing: "مع الطعام", note: "يفعّل AMPK — يحفز Autophagy" },
      { name: "Resveratrol", dose: "500 مغ", timing: "مع الطعام", note: "يفعّل Sirtuins ويحفز Autophagy" },
      { name: "EGCG (Green Tea Extract)", dose: "400-800 مغ", timing: "بين الوجبات", note: "يحفز Autophagy ومضاد أكسدة قوي" },
      { name: "Quercetin", dose: "500 مغ", timing: "مع الطعام", note: "يحفز Autophagy ويزيل الخلايا الشائخة" },
      { name: "Curcumin", dose: "1 غ", timing: "مع الطعام الدهني", note: "يحفز Autophagy ومضاد التهاب قوي" },
    ],
  },
  {
    id: "travel_health",
    title: "صحة المسافر",
    category: "الصحة العامة",
    icon: "airplane",
    color: "#0EA5E9",
    description: "بروتوكول لحماية الجسم أثناء السفر الطويل والتكيف مع التوقيت",
    duration: "قبل وأثناء وبعد السفر",
    supplements: [
      { name: "Melatonin", dose: "0.5-3 مغ", timing: "وقت النوم في الوجهة الجديدة", note: "يصلح ساعة الجسم بعد السفر عبر المناطق الزمنية" },
      { name: "Vitamin C", dose: "1-2 غ", timing: "يومياً أثناء السفر", note: "يدعم المناعة في الأماكن المزدحمة" },
      { name: "Probiotics", dose: "20 مليار CFU", timing: "مع الطعام", note: "يحمي من إسهال المسافر" },
      { name: "Zinc Lozenges", dose: "15-25 مغ", timing: "عند الشعور بأعراض", note: "يقلل مدة نزلات البرد" },
      { name: "Activated Charcoal", dose: "500-1000 مغ", timing: "عند الإسهال فقط", note: "يمتص السموم — بعيداً عن الأدوية بساعتين" },
      { name: "Magnesium Glycinate", dose: "300 مغ", timing: "قبل النوم", note: "يساعد على النوم في البيئات الجديدة" },
    ],
  },
  {
    id: "environmental_protection",
    title: "الحماية من التلوث البيئي",
    category: "الصحة العامة",
    icon: "leaf.fill",
    color: "#10B981",
    description: "مكملات لحماية الجسم من التلوث الهوائي والمعادن الثقيلة البيئية",
    duration: "مستمر للمقيمين في المدن",
    supplements: [
      { name: "NAC", dose: "600 مغ × 2", timing: "مع الطعام", note: "يرفع الجلوتاثيون — أقوى مضاد سموم طبيعي" },
      { name: "Vitamin C", dose: "2 غ", timing: "موزعة على اليوم", note: "يحيّد الجذور الحرة من التلوث" },
      { name: "Vitamin E", dose: "400 IU", timing: "مع الطعام الدهني", note: "يحمي الرئة من أكسدة الملوثات" },
      { name: "Sulforaphane (Broccoli Sprout)", dose: "10-30 مغ", timing: "مع الطعام", note: "يفعّل Nrf2 — أقوى محفز لمضادات السموم الطبيعية" },
      { name: "Chlorella", dose: "3-5 غ", timing: "قبل الطعام", note: "يرتبط بالمعادن الثقيلة ويساعد في إخراجها" },
      { name: "Milk Thistle", dose: "400 مغ", timing: "مع الطعام", note: "يحمي الكبد من السموم البيئية" },
    ],
  },
  {
    id: "night_shift",
    title: "العاملون في الشيفت الليلي",
    category: "الصحة المهنية",
    icon: "moon.fill",
    color: "#6366F1",
    description: "بروتوكول لدعم صحة العاملين في الشيفت الليلي وتعويض اضطراب الساعة البيولوجية",
    duration: "مستمر",
    supplements: [
      { name: "Vitamin D3", dose: "5000 IU", timing: "مع الطعام", note: "نقصه شائع جداً عند العاملين ليلاً — قلة التعرض للشمس" },
      { name: "Magnesium Glycinate", dose: "400-500 مغ", timing: "قبل النوم (أي وقت)", note: "يحسن جودة النوم في أي وقت" },
      { name: "Melatonin", dose: "0.5-1 مغ", timing: "قبل النوم النهاري", note: "جرعة صغيرة كافية — الكبيرة تسبب خمولاً" },
      { name: "Vitamin B12", dose: "1000 مكغ", timing: "صباح اليوم الأول بعد الشيفت", note: "يدعم الساعة البيولوجية وإنتاج الطاقة" },
      { name: "Ashwagandha", dose: "600 مغ", timing: "مع الطعام", note: "يقلل الكورتيزول المرتفع من اضطراب النوم" },
      { name: "Omega-3", dose: "2 غ", timing: "مع الطعام", note: "يقلل الالتهاب المزمن المرتبط باضطراب النوم" },
    ],
  },
  {
    id: "sedentary_lifestyle",
    title: "مكافحة الجلوس الطويل",
    category: "الصحة المهنية",
    icon: "figure.walk",
    color: "#F97316",
    description: "مكملات لمكافحة أضرار الجلوس الطويل أمام الشاشات",
    duration: "مستمر",
    supplements: [
      { name: "Nattokinase", dose: "2000 FU", timing: "على معدة فارغة", note: "يحسن سيولة الدم ويقلل خطر الجلطات" },
      { name: "Pycnogenol", dose: "100 مغ", timing: "مع الطعام", note: "يقوي الأوعية الدموية ويحسن الدورة" },
      { name: "Magnesium Malate", dose: "400 مغ", timing: "مع الطعام", note: "يقلل توتر العضلات من الجلوس الطويل" },
      { name: "Vitamin D3", dose: "4000 IU", timing: "مع الطعام الدهني", note: "نقصه شائع عند من يقضون وقتاً طويلاً داخل المبنى" },
      { name: "Omega-3", dose: "2 غ", timing: "مع الطعام", note: "يقلل الالتهاب المزمن من قلة الحركة" },
      { name: "Coenzyme Q10", dose: "200 مغ", timing: "مع الطعام الدهني", note: "يعوض انخفاض الطاقة من قلة النشاط" },
    ],
  },
];

const CATEGORIES = ["الكل", "تخلص من السموم", "الصحة الجنسية", "الهرمونات", "صحة الدماغ", "العظام والمفاصل", "الألم والالتهاب", "القلب والأوعية", "الجهاز الهضمي", "الصحة النفسية", "الصحة العامة", "مكافحة الشيخوخة", "صحة العيون", "الصحة المهنية"];

export default function ProtocolsExtraScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  const filtered = selectedCategory === "الكل"
    ? EXTRA_PROTOCOLS
    : EXTRA_PROTOCOLS.filter((p) => p.category === selectedCategory);

  if (selectedProtocol) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: selectedProtocol.color + "12", borderBottomColor: selectedProtocol.color + "30" }]}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedProtocol(null)}>
            <IconSymbol name="chevron.right" size={20} color={selectedProtocol.color} />
            <Text style={[styles.backText, { color: selectedProtocol.color }]}>رجوع</Text>
          </Pressable>
          <View style={[styles.headerIcon, { backgroundColor: selectedProtocol.color + "20" }]}>
            <IconSymbol name={selectedProtocol.icon} size={28} color={selectedProtocol.color} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{selectedProtocol.title}</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{selectedProtocol.description}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.metaBadge, { backgroundColor: selectedProtocol.color + "20" }]}>
              <IconSymbol name="clock.fill" size={12} color={selectedProtocol.color} />
              <Text style={[styles.metaText, { color: selectedProtocol.color }]}>{selectedProtocol.duration}</Text>
            </View>
            <View style={[styles.metaBadge, { backgroundColor: colors.surface }]}>
              <IconSymbol name="pills.fill" size={12} color={colors.muted} />
              <Text style={[styles.metaText, { color: colors.muted }]}>{selectedProtocol.supplements.length} مكملات</Text>
            </View>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
          {selectedProtocol.caution && (
            <View style={[styles.cautionCard, { backgroundColor: colors.warning + "15", borderColor: colors.warning + "40" }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={18} color={colors.warning} />
              <Text style={[styles.cautionText, { color: colors.foreground }]}>{selectedProtocol.caution}</Text>
            </View>
          )}
          {selectedProtocol.supplements.map((supp, i) => (
            <View key={i} style={[styles.suppCard, { backgroundColor: colors.card, borderColor: selectedProtocol.color + "30" }]}>
              <View style={styles.suppHeader}>
                <View style={[styles.suppNum, { backgroundColor: selectedProtocol.color + "20" }]}>
                  <Text style={[styles.suppNumText, { color: selectedProtocol.color }]}>{i + 1}</Text>
                </View>
                <Text style={[styles.suppName, { color: colors.foreground }]}>{supp.name}</Text>
              </View>
              <View style={styles.suppDetails}>
                <View style={[styles.suppBadge, { backgroundColor: colors.primary + "12" }]}>
                  <IconSymbol name="pills.fill" size={12} color={colors.primary} />
                  <Text style={[styles.suppBadgeText, { color: colors.primary }]}>{supp.dose}</Text>
                </View>
                <View style={[styles.suppBadge, { backgroundColor: colors.success + "12" }]}>
                  <IconSymbol name="clock.fill" size={12} color={colors.success} />
                  <Text style={[styles.suppBadgeText, { color: colors.success }]}>{supp.timing}</Text>
                </View>
              </View>
              <Text style={[styles.suppNote, { color: colors.muted }]}>{supp.note}</Text>
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
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>بروتوكولات متخصصة إضافية</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>{EXTRA_PROTOCOLS.length} بروتوكول علمي شامل</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12, gap: 8 }} style={{ maxHeight: 56 }}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.catChip, { backgroundColor: selectedCategory === cat ? colors.primary : colors.surface, borderColor: selectedCategory === cat ? colors.primary : colors.border }]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catChipText, { color: selectedCategory === cat ? "#fff" : colors.muted }]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.protocolCard, { backgroundColor: colors.card, borderColor: item.color + "40" }, pressed && { opacity: 0.8 }]}
            onPress={() => setSelectedProtocol(item)}
          >
            <View style={styles.protocolHeader}>
              <View style={[styles.protocolIcon, { backgroundColor: item.color + "20" }]}>
                <IconSymbol name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.protocolInfo}>
                <Text style={[styles.protocolTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.protocolCat, { color: item.color }]}>{item.category}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </View>
            <Text style={[styles.protocolDesc, { color: colors.muted }]} numberOfLines={2}>{item.description}</Text>
            <View style={styles.protocolMeta}>
              <View style={[styles.metaBadge, { backgroundColor: item.color + "15" }]}>
                <IconSymbol name="clock.fill" size={11} color={item.color} />
                <Text style={[styles.metaText, { color: item.color }]}>{item.duration}</Text>
              </View>
              <View style={[styles.metaBadge, { backgroundColor: colors.surface }]}>
                <IconSymbol name="pills.fill" size={11} color={colors.muted} />
                <Text style={[styles.metaText, { color: colors.muted }]}>{item.supplements.length} مكملات</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600" },
  headerIcon: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", marginBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, lineHeight: 18 },
  metaRow: { flexDirection: "row-reverse", gap: 8, marginTop: 10 },
  metaBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  metaText: { fontSize: 11, fontWeight: "600" },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  catChipText: { fontSize: 12, fontWeight: "600" },
  protocolCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  protocolHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  protocolIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  protocolInfo: { flex: 1, alignItems: "flex-end" },
  protocolTitle: { fontSize: 15, fontWeight: "800" },
  protocolCat: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  protocolDesc: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  protocolMeta: { flexDirection: "row-reverse", gap: 8 },
  cautionCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  cautionText: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right" },
  suppCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  suppHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  suppNum: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  suppNumText: { fontSize: 13, fontWeight: "800" },
  suppName: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  suppDetails: { flexDirection: "row-reverse", gap: 8 },
  suppBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  suppBadgeText: { fontSize: 11, fontWeight: "600" },
  suppNote: { fontSize: 12, lineHeight: 18, textAlign: "right" },
});
