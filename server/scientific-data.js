// قاعدة البيانات العلمية الشاملة للمكملات الغذائية
// مبنية على دراسات PubMed وCochrane وNIH وEFSA

export const SUPPLEMENTS_SCIENTIFIC = [
  {
    id: "vitamin_d3",
    name_ar: "فيتامين د3",
    name_en: "Vitamin D3 (Cholecalciferol)",
    category: "vitamins",
    category_ar: "الفيتامينات",
    best_form: {
      name: "Cholecalciferol (D3)",
      why: "أكثر فعالية من D2 في رفع مستوى 25(OH)D في الدم بنسبة 87% أعلى",
      avoid: "Ergocalciferol (D2) — أقل فاعلية وأقصر مدة تأثير"
    },
    benefits: [
      "تقوية العظام والأسنان عبر تنظيم امتصاص الكالسيوم والفوسفور",
      "دعم الجهاز المناعي وتقليل خطر العدوى التنفسية",
      "تحسين المزاج وتقليل أعراض الاكتئاب الموسمي (SAD)",
      "تقليل خطر الإصابة بسرطان القولون والثدي والبروستاتا",
      "تحسين حساسية الأنسولين وتقليل خطر السكري النوع الثاني",
      "دعم صحة القلب وتقليل خطر أمراض القلب والأوعية الدموية",
      "تحسين وظائف العضلات وتقليل خطر السقوط لدى كبار السن"
    ],
    side_effects: [
      "الغثيان والقيء عند الجرعات العالية (>10,000 IU/يوم)",
      "فرط كالسيوم الدم (Hypercalcemia) عند الإفراط",
      "الإمساك وآلام البطن",
      "الضعف والتعب الشديد",
      "تكلس الأنسجة الرخوة عند الجرعات السامة"
    ],
    warnings: [
      "لا تتجاوز 4000 IU/يوم دون إشراف طبي",
      "فحص مستوى 25(OH)D قبل البدء والمتابعة كل 3 أشهر",
      "خطر التراكم لأنه فيتامين ذائب في الدهون",
      "المصابون بحصوات الكلى يحتاجون إشرافاً طبياً"
    ],
    drug_interactions: [
      { drug: "Thiazide diuretics (هيدروكلوروثيازيد)", effect: "خطر فرط كالسيوم الدم" },
      { drug: "Digoxin (ديجوكسين)", effect: "فرط الكالسيوم يزيد سمية الديجوكسين" },
      { drug: "Corticosteroids (كورتيزون)", effect: "يقلل امتصاص فيتامين د" },
      { drug: "Orlistat (أورليستات)", effect: "يقلل امتصاص فيتامين د" },
      { drug: "Cholestyramine", effect: "يقلل امتصاص فيتامين د" }
    ],
    disease_interactions: [
      { disease: "فرط كالسيوم الدم", effect: "ممنوع", severity: "high" },
      { disease: "حصوات الكلى الكالسيومية", effect: "تحت إشراف طبي فقط", severity: "high" },
      { disease: "الساركويد (Sarcoidosis)", effect: "ممنوع — يزيد الكالسيوم", severity: "high" },
      { disease: "الفشل الكلوي", effect: "جرعة مخفضة تحت إشراف طبي", severity: "medium" },
      { disease: "فرط نشاط الغدة الدرقية", effect: "احتياط", severity: "medium" }
    ],
    dosage: {
      preventive: "1000-2000 IU/يوم",
      therapeutic: "2000-5000 IU/يوم (بإشراف طبي)",
      upper_limit: "4000 IU/يوم للبالغين",
      timing: "مع وجبة تحتوي على دهون لتحسين الامتصاص",
      notes: "الجرعة الأمثل تعتمد على مستوى الدم المقاس"
    },
    food_sources: ["أسماك السلمون والتونة والسردين", "صفار البيض", "الكبد البقري", "الحليب المدعم", "التعرض لأشعة الشمس (15-30 دقيقة/يوم)"],
    references: [
      { title: "Vitamin D and Health", journal: "NEJM", year: 2011, pmid: "21463001" },
      { title: "Vitamin D supplementation and prevention of type 2 diabetes", journal: "NEJM", year: 2019, pmid: "31173679" },
      { title: "Vitamin D and COVID-19", journal: "BMJ", year: 2020, pmid: "32641344" }
    ],
    evidence_level: "strong",
    score: 9.2
  },
  {
    id: "magnesium",
    name_ar: "المغنيسيوم",
    name_en: "Magnesium",
    category: "minerals",
    category_ar: "المعادن",
    best_form: {
      name: "Magnesium Glycinate / Bisglycinate",
      why: "أعلى امتصاصاً وأقل تأثيراً مسهلاً. Magnesium Threonate للدماغ والذاكرة. Magnesium Citrate للإمساك",
      avoid: "Magnesium Oxide — امتصاص ضعيف جداً (4% فقط)"
    },
    benefits: [
      "تنظيم أكثر من 300 تفاعل إنزيمي في الجسم",
      "تحسين جودة النوم وتقليل الأرق",
      "تقليل القلق والتوتر وتحسين المزاج",
      "تخفيف الصداع النصفي وتقليل تكراره",
      "تحسين حساسية الأنسولين وضبط سكر الدم",
      "تقليل ضغط الدم وحماية القلب",
      "تقوية العظام والوقاية من هشاشة العظام",
      "تخفيف تشنجات العضلات وآلام ما قبل الدورة الشهرية"
    ],
    side_effects: [
      "إسهال وآلام بطنية (خاصة Oxide وCitrate بجرعات عالية)",
      "غثيان عند الجرعات العالية",
      "انخفاض ضغط الدم عند الإفراط",
      "ضعف العضلات في حالات التسمم النادرة"
    ],
    warnings: [
      "لا تتجاوز 350 ملغ/يوم من المكملات (UL للبالغين)",
      "الجرعات العالية تسبب إسهالاً",
      "مرضى الكلى: خطر تراكم المغنيسيوم في الدم"
    ],
    drug_interactions: [
      { drug: "Antibiotics (Tetracyclines, Fluoroquinolones)", effect: "يقلل امتصاص المضادات الحيوية — فاصل 2 ساعة" },
      { drug: "Bisphosphonates (علاج هشاشة العظام)", effect: "يقلل الامتصاص — فاصل 2 ساعة" },
      { drug: "Diuretics (مدرات البول)", effect: "بعضها يزيد فقدان المغنيسيوم" },
      { drug: "Proton Pump Inhibitors (أوميبرازول)", effect: "الاستخدام طويل الأمد يسبب نقص المغنيسيوم" },
      { drug: "Digoxin", effect: "نقص المغنيسيوم يزيد سمية الديجوكسين" }
    ],
    disease_interactions: [
      { disease: "الفشل الكلوي", effect: "ممنوع بدون إشراف طبي", severity: "high" },
      { disease: "انسداد القلب (Heart Block)", effect: "احتياط شديد", severity: "high" },
      { disease: "الوهن العضلي الوبيل (Myasthenia Gravis)", effect: "احتياط", severity: "medium" }
    ],
    dosage: {
      preventive: "200-400 ملغ/يوم",
      therapeutic: "400-600 ملغ/يوم (بإشراف طبي)",
      upper_limit: "350 ملغ/يوم من المكملات",
      timing: "قبل النوم لتحسين النوم، أو مقسمة على الوجبات",
      notes: "Glycinate للنوم والقلق، Citrate للإمساك، Threonate للذاكرة"
    },
    food_sources: ["المكسرات (اللوز، الكاجو)", "البذور (اليقطين، الكتان)", "الخضروات الورقية (السبانخ)", "الشوكولاتة الداكنة", "البقوليات", "الحبوب الكاملة"],
    references: [
      { title: "Magnesium in Prevention and Therapy", journal: "Nutrients", year: 2015, pmid: "26404370" },
      { title: "Magnesium and Sleep", journal: "Magnesium Research", year: 2012, pmid: "23853635" },
      { title: "Magnesium and Migraine", journal: "Headache", year: 2012, pmid: "22533351" }
    ],
    evidence_level: "strong",
    score: 9.0
  },
  {
    id: "omega3",
    name_ar: "أوميغا 3",
    name_en: "Omega-3 Fatty Acids (EPA/DHA)",
    category: "fatty_acids",
    category_ar: "الأحماض الدهنية",
    best_form: {
      name: "Triglyceride Form (rTG) أو Phospholipid Form (كريل)",
      why: "امتصاص أعلى بـ 70% من الشكل الإيثيل إستر (EE). كريل أوميغا 3 يحتوي على فوسفوليبيد وأستاكسانثين",
      avoid: "Ethyl Ester (EE) — امتصاص أضعف خاصة بدون دهون"
    },
    benefits: [
      "خفض الدهون الثلاثية (Triglycerides) بنسبة 15-30%",
      "تقليل الالتهابات المزمنة في الجسم",
      "دعم صحة القلب وتقليل خطر النوبات القلبية",
      "تحسين وظائف الدماغ والذاكرة والتركيز",
      "تقليل أعراض الاكتئاب والقلق",
      "دعم صحة العيون والوقاية من التنكس البقعي",
      "تقليل آلام المفاصل في التهاب المفاصل الروماتويدي",
      "دعم نمو الدماغ والشبكية لدى الأجنة والرضع"
    ],
    side_effects: [
      "رائحة السمك في التجشؤ (يقلله التجميد أو أخذه مع الطعام)",
      "اضطرابات هضمية خفيفة",
      "تخفيف تخثر الدم بجرعات عالية (>3 غ/يوم)",
      "ارتفاع LDL الكوليسترول في بعض الحالات"
    ],
    warnings: [
      "احتياط قبل العمليات الجراحية (يخفف الدم)",
      "حساسية من الأسماك: استخدم مصادر نباتية (ALA من بذر الكتان)",
      "لا تتجاوز 3 غ/يوم بدون إشراف طبي"
    ],
    drug_interactions: [
      { drug: "Warfarin / Anticoagulants (مضادات التخثر)", effect: "يزيد خطر النزيف — مراقبة INR" },
      { drug: "Aspirin", effect: "تأثير تراكمي على تخفيف الدم" },
      { drug: "Antihypertensives (خافضات الضغط)", effect: "قد يزيد تأثير خفض الضغط" }
    ],
    disease_interactions: [
      { disease: "اضطرابات التخثر", effect: "احتياط شديد", severity: "high" },
      { disease: "قبل العمليات الجراحية", effect: "إيقاف 2 أسبوع قبل العملية", severity: "high" },
      { disease: "الرجفان الأذيني", effect: "الجرعات العالية قد تزيد الخطر", severity: "medium" }
    ],
    dosage: {
      preventive: "1-2 غ EPA+DHA/يوم",
      therapeutic: "2-4 غ EPA+DHA/يوم (بإشراف طبي)",
      upper_limit: "3 غ/يوم للبالغين",
      timing: "مع الوجبات الدسمة لتحسين الامتصاص",
      notes: "نسبة EPA:DHA = 2:1 للاكتئاب والالتهابات، 1:2 لصحة الدماغ"
    },
    food_sources: ["السلمون البري", "الماكريل", "السردين", "التونة", "بذر الكتان", "الجوز", "طحالب البحر"],
    references: [
      { title: "Omega-3 Fatty Acids and Cardiovascular Disease", journal: "NEJM", year: 2019, pmid: "31141680" },
      { title: "Marine omega-3 supplementation and cardiovascular disease", journal: "Cochrane", year: 2018, pmid: "30019766" },
      { title: "Omega-3 and Depression", journal: "Translational Psychiatry", year: 2019, pmid: "31383846" }
    ],
    evidence_level: "strong",
    score: 9.1
  },
  {
    id: "zinc",
    name_ar: "الزنك",
    name_en: "Zinc",
    category: "minerals",
    category_ar: "المعادن",
    best_form: {
      name: "Zinc Bisglycinate / Zinc Picolinate",
      why: "امتصاص أعلى بكثير من الأشكال الأخرى، وأقل تأثيراً على المعدة",
      avoid: "Zinc Oxide — امتصاص ضعيف جداً. Zinc Sulfate — يسبب غثياناً"
    },
    benefits: [
      "دعم الجهاز المناعي وتقليل مدة نزلات البرد",
      "ضروري لالتئام الجروح وتجديد الخلايا",
      "دعم إنتاج هرمون التستوستيرون",
      "تحسين صحة الجلد وعلاج حب الشباب",
      "دعم وظائف الدماغ والذاكرة",
      "تحسين حاسة الشم والتذوق",
      "دعم صحة العيون والوقاية من التنكس البقعي",
      "تنظيم سكر الدم وتحسين حساسية الأنسولين"
    ],
    side_effects: [
      "غثيان وقيء على معدة فارغة",
      "طعم معدني في الفم",
      "نقص النحاس عند الاستخدام طويل الأمد بجرعات عالية",
      "تقليل امتصاص الحديد والنحاس"
    ],
    warnings: [
      "لا تتجاوز 40 ملغ/يوم (UL للبالغين)",
      "الاستخدام طويل الأمد >40 ملغ/يوم يسبب نقص النحاس",
      "أخذه مع الطعام لتقليل الغثيان"
    ],
    drug_interactions: [
      { drug: "Antibiotics (Tetracyclines, Fluoroquinolones)", effect: "يقلل امتصاص المضادات الحيوية — فاصل 2 ساعة" },
      { drug: "Penicillamine", effect: "يقلل امتصاص الدواء" },
      { drug: "Iron supplements", effect: "تنافس على الامتصاص — فاصل 2 ساعة" },
      { drug: "Diuretics (Thiazides)", effect: "تزيد فقدان الزنك في البول" }
    ],
    disease_interactions: [
      { disease: "أمراض الكلى", effect: "احتياط — تراكم محتمل", severity: "medium" },
      { disease: "مرض ويلسون (Wilson's Disease)", effect: "قد يكون مفيداً أو ضاراً — استشر طبيباً", severity: "medium" }
    ],
    dosage: {
      preventive: "8-11 ملغ/يوم (الاحتياج اليومي)",
      therapeutic: "25-40 ملغ/يوم (قصير الأمد)",
      upper_limit: "40 ملغ/يوم",
      timing: "مع الطعام لتقليل الغثيان",
      notes: "إضافة 1-2 ملغ نحاس عند الاستخدام طويل الأمد"
    },
    food_sources: ["المحار", "اللحم الأحمر", "الدواجن", "البقوليات", "المكسرات والبذور", "الجبن"],
    references: [
      { title: "Zinc for the common cold", journal: "Cochrane", year: 2013, pmid: "23775705" },
      { title: "Zinc and Immune Function", journal: "Nutrients", year: 2017, pmid: "29186856" }
    ],
    evidence_level: "strong",
    score: 8.7
  },
  {
    id: "vitamin_c",
    name_ar: "فيتامين ج",
    name_en: "Vitamin C (Ascorbic Acid)",
    category: "vitamins",
    category_ar: "الفيتامينات",
    best_form: {
      name: "Liposomal Vitamin C أو Sodium Ascorbate",
      why: "Liposomal: امتصاص أعلى بكثير (90%+). Sodium Ascorbate: أقل حموضة وأفضل للمعدة الحساسة",
      avoid: "Ascorbic Acid بجرعات عالية على معدة فارغة — يسبب حرقة"
    },
    benefits: [
      "مضاد أكسدة قوي يحمي الخلايا من التلف",
      "ضروري لتصنيع الكولاجين وصحة الجلد",
      "تعزيز المناعة وتقليل مدة نزلات البرد",
      "تحسين امتصاص الحديد غير الهيمي",
      "حماية القلب والأوعية الدموية",
      "دعم وظائف الدماغ وتقليل خطر الزهايمر",
      "تقليل مستوى حمض البوليك (النقرس)"
    ],
    side_effects: [
      "إسهال وآلام بطنية بجرعات >2 غ/يوم",
      "حصوات الكلى الأوكزالاتية بجرعات عالية جداً",
      "حرقة المعدة",
      "الصداع عند الجرعات العالية"
    ],
    warnings: [
      "لا تتجاوز 2000 ملغ/يوم (UL)",
      "مرضى الكلى والنقرس: احتياط من الجرعات العالية",
      "مرضى الثلاسيميا وداء الهيموكروماتوز: احتياط"
    ],
    drug_interactions: [
      { drug: "Chemotherapy drugs", effect: "قد يقلل فعالية بعض أدوية الكيماوي — استشر طبيبك" },
      { drug: "Warfarin", effect: "جرعات عالية قد تؤثر على INR" },
      { drug: "Statins (كوليسترول)", effect: "قد يقلل فعالية الستاتين" },
      { drug: "Iron supplements", effect: "يزيد امتصاص الحديد — مفيد في فقر الدم" }
    ],
    disease_interactions: [
      { disease: "حصوات الكلى الأوكزالاتية", effect: "تجنب الجرعات العالية", severity: "high" },
      { disease: "داء الهيموكروماتوز", effect: "يزيد امتصاص الحديد — خطر", severity: "high" },
      { disease: "الثلاسيميا", effect: "احتياط من الجرعات العالية", severity: "medium" }
    ],
    dosage: {
      preventive: "500-1000 ملغ/يوم",
      therapeutic: "1000-2000 ملغ/يوم",
      upper_limit: "2000 ملغ/يوم",
      timing: "مقسمة على وجبتين لتحسين الامتصاص",
      notes: "الجسم يمتص أقل من 50% عند الجرعة الواحدة >1000 ملغ"
    },
    food_sources: ["الفلفل الأحمر والأصفر", "الكيوي", "البرتقال والحمضيات", "الفراولة", "البروكلي", "الطماطم"],
    references: [
      { title: "Vitamin C and Immune Function", journal: "Nutrients", year: 2017, pmid: "29099763" },
      { title: "Vitamin C and Collagen Synthesis", journal: "J Int Soc Sports Nutr", year: 2019, pmid: "31555911" }
    ],
    evidence_level: "strong",
    score: 8.8
  },
  {
    id: "vitamin_b12",
    name_ar: "فيتامين ب12",
    name_en: "Vitamin B12 (Cobalamin)",
    category: "vitamins",
    category_ar: "الفيتامينات",
    best_form: {
      name: "Methylcobalamin أو Adenosylcobalamin",
      why: "الشكل النشط الجاهز للاستخدام مباشرة دون تحويل. Methylcobalamin أفضل للجهاز العصبي",
      avoid: "Cyanocobalamin — يحتاج تحويل في الكبد وأقل فاعلية لمن لديهم طفرة MTHFR"
    },
    benefits: [
      "ضروري لتكوين خلايا الدم الحمراء ومنع فقر الدم الضخم الأرومات",
      "دعم وظائف الجهاز العصبي وصحة الأعصاب",
      "تحسين الذاكرة والتركيز والوظائف الإدراكية",
      "تقليل مستوى الهوموسيستين (خطر أمراض القلب)",
      "دعم إنتاج الطاقة على مستوى الخلية",
      "ضروري لتصنيع DNA وتكاثر الخلايا",
      "تحسين المزاج وتقليل أعراض الاكتئاب"
    ],
    side_effects: [
      "نادراً: حب الشباب عند بعض الأشخاص",
      "نادراً: تفاعلات حساسية",
      "آمن جداً حتى بجرعات عالية جداً"
    ],
    warnings: [
      "النباتيون والنباتيون الصارمون (Vegans) معرضون لنقصه",
      "مرضى Metformin (السكري) يحتاجون مراقبة مستوياته",
      "كبار السن أقل امتصاصاً له من الطعام"
    ],
    drug_interactions: [
      { drug: "Metformin (ميتفورمين)", effect: "يقلل امتصاص ب12 — فحص دوري مطلوب" },
      { drug: "Proton Pump Inhibitors (أوميبرازول)", effect: "يقلل امتصاص ب12 من الطعام" },
      { drug: "H2 blockers (رانيتيدين)", effect: "يقلل امتصاص ب12" },
      { drug: "Colchicine (النقرس)", effect: "يقلل امتصاص ب12" }
    ],
    disease_interactions: [
      { disease: "فقر الدم الخبيث (Pernicious Anemia)", effect: "يحتاج حقن ب12 وليس فموياً", severity: "high" },
      { disease: "ضمور المعدة (Atrophic Gastritis)", effect: "ضعف الامتصاص — يفضل تحت اللسان أو حقن", severity: "medium" }
    ],
    dosage: {
      preventive: "500-1000 ميكروغرام/يوم",
      therapeutic: "1000-2000 ميكروغرام/يوم",
      upper_limit: "لا يوجد حد أعلى محدد",
      timing: "تحت اللسان لامتصاص أفضل، أو مع الطعام",
      notes: "الجرعات العالية آمنة لأن الفائض يُطرح في البول"
    },
    food_sources: ["الكبد البقري", "المحار", "السردين", "اللحم الأحمر", "البيض", "منتجات الألبان"],
    references: [
      { title: "Vitamin B12 Deficiency", journal: "NEJM", year: 2013, pmid: "24152261" },
      { title: "Metformin and B12 deficiency", journal: "Diabetes Care", year: 2010, pmid: "20488957" }
    ],
    evidence_level: "strong",
    score: 9.0
  },
  {
    id: "iron",
    name_ar: "الحديد",
    name_en: "Iron",
    category: "minerals",
    category_ar: "المعادن",
    best_form: {
      name: "Iron Bisglycinate (Ferrous Bisglycinate)",
      why: "امتصاص ضعف الأشكال الأخرى مع تأثيرات جانبية أقل بكثير على الجهاز الهضمي",
      avoid: "Ferrous Sulfate — يسبب إمساكاً وغثياناً شديدين. Ferric forms — امتصاص أضعف"
    },
    benefits: [
      "علاج وقاية من فقر الدم بنقص الحديد",
      "تحسين الطاقة ومستوى النشاط البدني",
      "دعم وظائف الدماغ والتركيز",
      "ضروري لإنتاج الهيموغلوبين ونقل الأكسجين",
      "دعم جهاز المناعة",
      "تحسين الأداء الرياضي والتحمل"
    ],
    side_effects: [
      "إمساك شديد (خاصة Ferrous Sulfate)",
      "غثيان وآلام معدية",
      "براز داكن اللون (طبيعي)",
      "تلوين الأسنان (المحاليل السائلة)",
      "الجرعات العالية سامة جداً خاصة للأطفال"
    ],
    warnings: [
      "لا تأخذه إلا بعد تشخيص نقص الحديد بفحص دم",
      "الجرعات الزائدة سامة جداً — احفظه بعيداً عن الأطفال",
      "لا تأخذه مع الشاي أو القهوة أو منتجات الألبان",
      "الرجال وبعد انقطاع الطمث: خطر تراكم الحديد"
    ],
    drug_interactions: [
      { drug: "Antibiotics (Tetracyclines, Fluoroquinolones)", effect: "يقلل امتصاص المضادات الحيوية — فاصل 2-3 ساعات" },
      { drug: "Levothyroxine (هرمون الغدة الدرقية)", effect: "يقلل امتصاص الدواء — فاصل 4 ساعات" },
      { drug: "Levodopa (باركنسون)", effect: "يقلل امتصاص الدواء" },
      { drug: "Proton Pump Inhibitors", effect: "يقلل امتصاص الحديد" },
      { drug: "Calcium supplements", effect: "يقلل امتصاص الحديد — فاصل 2 ساعات" }
    ],
    disease_interactions: [
      { disease: "داء الهيموكروماتوز (Hemochromatosis)", effect: "ممنوع تماماً", severity: "high" },
      { disease: "الثلاسيميا", effect: "ممنوع إلا بإشراف طبي صارم", severity: "high" },
      { disease: "التهاب القولون والأمراض الالتهابية", effect: "احتياط — قد يزيد الالتهاب", severity: "medium" },
      { disease: "أمراض الكبد", effect: "احتياط من التراكم", severity: "medium" }
    ],
    dosage: {
      preventive: "8-18 ملغ/يوم (الاحتياج اليومي)",
      therapeutic: "100-200 ملغ عنصر حديد/يوم مقسمة",
      upper_limit: "45 ملغ/يوم",
      timing: "على معدة فارغة مع فيتامين ج لتحسين الامتصاص",
      notes: "فحص Ferritin وCBC قبل وأثناء العلاج"
    },
    food_sources: ["الكبد البقري", "اللحم الأحمر", "المحار", "البقوليات", "السبانخ", "التوفو"],
    references: [
      { title: "Iron Deficiency Anemia", journal: "Lancet", year: 2016, pmid: "26314490" },
      { title: "Iron Bisglycinate Chelate", journal: "J Am Coll Nutr", year: 2005, pmid: "15798075" }
    ],
    evidence_level: "strong",
    score: 8.9
  },
  {
    id: "probiotics",
    name_ar: "البروبيوتيك",
    name_en: "Probiotics",
    category: "gut_health",
    category_ar: "صحة الجهاز الهضمي",
    best_form: {
      name: "Multi-strain formula: Lactobacillus + Bifidobacterium (10-50 مليار CFU)",
      why: "التنوع في السلالات يعطي فوائد أشمل. عدد CFU مهم ويجب أن يكون مضموناً حتى تاريخ الانتهاء",
      avoid: "المنتجات ذات CFU المنخفض جداً (<1 مليار) أو غير المبردة إذا كانت تحتاج تبريداً"
    },
    benefits: [
      "تحسين صحة الجهاز الهضمي وعلاج الإسهال",
      "تقليل أعراض متلازمة القولون العصبي (IBS)",
      "تعزيز المناعة وتقليل العدوى",
      "تقليل أعراض عدم تحمل اللاكتوز",
      "دعم صحة الدماغ عبر محور الأمعاء-الدماغ",
      "تقليل خطر الإصابة بالحساسية والأكزيما",
      "تحسين امتصاص العناصر الغذائية",
      "تقليل الانتفاخ والغازات"
    ],
    side_effects: [
      "انتفاخ وغازات في الأسابيع الأولى (مؤقت)",
      "إسهال خفيف في البداية",
      "نادراً: عدوى في المرضى ضعيفي المناعة"
    ],
    warnings: [
      "المرضى ضعيفو المناعة (كيماوي، HIV): استشر طبيبك",
      "مرضى القلب الذين لديهم صمامات اصطناعية: احتياط",
      "ابدأ بجرعة منخفضة وزدها تدريجياً"
    ],
    drug_interactions: [
      { drug: "Antibiotics", effect: "يقلل فعالية البروبيوتيك — فاصل 2 ساعات على الأقل" },
      { drug: "Antifungals", effect: "قد يقلل فعالية البروبيوتيك" },
      { drug: "Immunosuppressants", effect: "احتياط — استشر طبيبك" }
    ],
    disease_interactions: [
      { disease: "نقص المناعة الشديد", effect: "خطر عدوى — استشر طبيبك", severity: "high" },
      { disease: "التهاب البنكرياس الحاد", effect: "احتياط — بعض الدراسات تشير لخطر", severity: "medium" },
      { disease: "متلازمة الأمعاء القصيرة", effect: "احتياط", severity: "medium" }
    ],
    dosage: {
      preventive: "5-10 مليار CFU/يوم",
      therapeutic: "10-50 مليار CFU/يوم",
      upper_limit: "لا يوجد حد أعلى محدد",
      timing: "قبل الوجبة بـ 30 دقيقة أو مع الطعام",
      notes: "استمر 4-8 أسابيع على الأقل لرؤية النتائج"
    },
    food_sources: ["الزبادي الطبيعي", "الكفير", "الكيمتشي", "مخلل الملفوف (Sauerkraut)", "الميسو", "الكومبوتشا"],
    references: [
      { title: "Probiotics and IBS", journal: "Cochrane", year: 2018, pmid: "30040873" },
      { title: "Probiotics and Immune Function", journal: "Nutrients", year: 2019, pmid: "30720707" }
    ],
    evidence_level: "moderate",
    score: 8.3
  },
  {
    id: "coq10",
    name_ar: "الكوينزيم Q10",
    name_en: "Coenzyme Q10 (CoQ10)",
    category: "antioxidants",
    category_ar: "مضادات الأكسدة",
    best_form: {
      name: "Ubiquinol (الشكل المختزل)",
      why: "Ubiquinol هو الشكل النشط الجاهز للاستخدام. امتصاصه أعلى بـ 3-8 مرات من Ubiquinone خاصة لكبار السن",
      avoid: "Ubiquinone بجرعات منخفضة — امتصاص ضعيف بدون دهون"
    },
    benefits: [
      "إنتاج الطاقة في الخلايا (ATP) — ضروري للقلب والعضلات",
      "مضاد أكسدة قوي يحمي الخلايا من التلف",
      "تحسين وظائف القلب في قصور القلب",
      "تقليل آثار أدوية الستاتين (ألم العضلات)",
      "تحسين الخصوبة لدى الرجال والنساء",
      "تقليل الصداع النصفي",
      "دعم صحة الدماغ وتقليل خطر الزهايمر",
      "تحسين التحمل الرياضي"
    ],
    side_effects: [
      "اضطرابات هضمية خفيفة",
      "صداع خفيف في البداية",
      "أرق عند أخذه في المساء",
      "نادراً: طفح جلدي"
    ],
    warnings: [
      "أخذه في الصباح لتجنب الأرق",
      "مع الطعام الدهني لتحسين الامتصاص",
      "قد يخفض ضغط الدم قليلاً"
    ],
    drug_interactions: [
      { drug: "Warfarin", effect: "قد يقلل فعالية الوارفارين — مراقبة INR" },
      { drug: "Statins (كوليسترول)", effect: "الستاتين يقلل CoQ10 — مفيد أخذه معه" },
      { drug: "Antihypertensives", effect: "تأثير تراكمي على خفض الضغط" },
      { drug: "Chemotherapy", effect: "قد يؤثر على بعض أدوية الكيماوي" }
    ],
    disease_interactions: [
      { disease: "قصور القلب", effect: "مفيد جداً — تحت إشراف طبي", severity: "low" },
      { disease: "السكري", effect: "قد يخفض سكر الدم — مراقبة", severity: "medium" }
    ],
    dosage: {
      preventive: "100-200 ملغ/يوم",
      therapeutic: "200-600 ملغ/يوم (قصور القلب)",
      upper_limit: "لا يوجد حد أعلى محدد",
      timing: "مع وجبة دسمة في الصباح",
      notes: "Ubiquinol أفضل لمن فوق 40 سنة"
    },
    food_sources: ["الكبد البقري", "القلب البقري", "السردين", "الماكريل", "الفستق", "السبانخ"],
    references: [
      { title: "CoQ10 and Heart Failure", journal: "JACC Heart Failure", year: 2014, pmid: "24944408" },
      { title: "CoQ10 and Statin Myopathy", journal: "Am J Cardiol", year: 2007, pmid: "17719333" }
    ],
    evidence_level: "moderate",
    score: 8.5
  },
  {
    id: "ashwagandha",
    name_ar: "الأشواغاندا",
    name_en: "Ashwagandha (Withania somnifera)",
    category: "adaptogens",
    category_ar: "المكيفات العشبية",
    best_form: {
      name: "KSM-66 أو Sensoril (مستخلص موحد المواصفات)",
      why: "KSM-66: أعلى تركيز من Withanolides (5%+) مع دراسات سريرية موثقة. Sensoril: تركيز أعلى من المستخلص الكامل",
      avoid: "المسحوق الخام غير الموحد — تركيز غير معروف وفعالية متذبذبة"
    },
    benefits: [
      "تقليل الكورتيزول وهرمونات التوتر بنسبة 27-30%",
      "تحسين جودة النوم وتقليل الأرق",
      "تحسين الأداء الرياضي وزيادة القوة العضلية",
      "رفع مستوى التستوستيرون وتحسين الخصوبة لدى الرجال",
      "تحسين الوظائف الإدراكية والذاكرة",
      "تقليل أعراض القلق والاكتئاب",
      "دعم الغدة الدرقية (قد يرفع T3 وT4)",
      "تقليل الالتهابات وتعزيز المناعة"
    ],
    side_effects: [
      "غثيان واضطرابات هضمية بجرعات عالية",
      "نعاس (خاصة Sensoril)",
      "نادراً: تسمم كبدي بجرعات عالية جداً",
      "قد يرفع هرمونات الغدة الدرقية"
    ],
    warnings: [
      "الحوامل: ممنوع — قد يسبب الإجهاض",
      "أمراض الغدة الدرقية: استشر طبيبك",
      "أمراض المناعة الذاتية: احتياط",
      "قبل العمليات الجراحية: إيقاف 2 أسبوع"
    ],
    drug_interactions: [
      { drug: "Thyroid medications (ليفوثيروكسين)", effect: "قد يزيد مستوى هرمونات الغدة — مراقبة" },
      { drug: "Immunosuppressants", effect: "يزيد المناعة — قد يتعارض" },
      { drug: "Sedatives / Benzodiazepines", effect: "تأثير تراكمي على النوم والتهدئة" },
      { drug: "Antidiabetics", effect: "قد يخفض سكر الدم — مراقبة" }
    ],
    disease_interactions: [
      { disease: "الحمل", effect: "ممنوع تماماً", severity: "high" },
      { disease: "أمراض المناعة الذاتية (Lupus, MS)", effect: "احتياط — يحفز المناعة", severity: "medium" },
      { disease: "فرط نشاط الغدة الدرقية", effect: "احتياط — قد يزيد النشاط", severity: "medium" },
      { disease: "أمراض الكبد", effect: "احتياط من الجرعات العالية", severity: "medium" }
    ],
    dosage: {
      preventive: "300-600 ملغ/يوم (KSM-66)",
      therapeutic: "600-1200 ملغ/يوم",
      upper_limit: "1200 ملغ/يوم",
      timing: "مع الطعام، يفضل في المساء للنوم",
      notes: "دورات 8-12 أسبوع ثم استراحة شهر"
    },
    food_sources: ["لا توجد مصادر غذائية طبيعية — نبات طبي فقط"],
    references: [
      { title: "Ashwagandha and Stress", journal: "Medicine (Baltimore)", year: 2019, pmid: "31517876" },
      { title: "Ashwagandha and Testosterone", journal: "Fertility and Sterility", year: 2010, pmid: "19501822" },
      { title: "KSM-66 and Muscle Strength", journal: "J Int Soc Sports Nutr", year: 2015, pmid: "26609282" }
    ],
    evidence_level: "moderate",
    score: 8.4
  },
  {
    id: "creatine",
    name_ar: "الكرياتين",
    name_en: "Creatine Monohydrate",
    category: "sports",
    category_ar: "الأداء الرياضي",
    best_form: {
      name: "Creatine Monohydrate (المونوهيدرات)",
      why: "الأكثر دراسةً في التاريخ (500+ دراسة). فعالية مساوية أو أعلى من جميع الأشكال الأخرى بسعر أقل بكثير",
      avoid: "Creatine Ethyl Ester — أقل فعالية وأكثر تكلفة. Creatine HCL — لا يوجد دليل على أفضليته"
    },
    benefits: [
      "زيادة قوة العضلات والأداء في التمارين عالية الشدة",
      "تسريع نمو العضلات (Muscle Hypertrophy)",
      "تحسين التعافي بعد التمرين",
      "تحسين الوظائف الإدراكية والذاكرة",
      "تقليل الإرهاق الذهني",
      "فوائد محتملة في الوقاية من الزهايمر وباركنسون",
      "تحسين الأداء في الرياضات المتقطعة (كرة القدم، التنس)"
    ],
    side_effects: [
      "احتباس الماء في العضلات (طبيعي ومؤقت)",
      "زيادة وزن 1-2 كغ في الأسابيع الأولى (ماء)",
      "اضطرابات هضمية بجرعات عالية (>10 غ دفعة واحدة)",
      "تشنجات عضلية نادرة (غير مثبت علمياً)"
    ],
    warnings: [
      "شرب كميات كافية من الماء (2-3 لتر/يوم)",
      "مرضى الكلى: استشر طبيبك",
      "لا داعي لـ Loading Phase — 3-5 غ/يوم كافية"
    ],
    drug_interactions: [
      { drug: "NSAIDs (إيبوبروفين)", effect: "الجمع مع الكرياتين قد يضر الكلى" },
      { drug: "Caffeine (بجرعات عالية)", effect: "قد يقلل فعالية الكرياتين في بعض الدراسات" },
      { drug: "Nephrotoxic drugs", effect: "احتياط على الكلى" }
    ],
    disease_interactions: [
      { disease: "أمراض الكلى", effect: "احتياط — استشر طبيبك", severity: "medium" },
      { disease: "مرض الكبد", effect: "احتياط", severity: "medium" }
    ],
    dosage: {
      preventive: "3-5 غ/يوم",
      therapeutic: "3-5 غ/يوم (لا حاجة لجرعة تحميل)",
      upper_limit: "لا يوجد حد أعلى محدد",
      timing: "أي وقت — بعد التمرين أفضل قليلاً",
      notes: "Micronized Creatine أفضل ذوباناً في الماء"
    },
    food_sources: ["اللحم الأحمر", "الأسماك (خاصة الرنجة والسلمون)", "الدواجن"],
    references: [
      { title: "Creatine Supplementation and Exercise Performance", journal: "J Int Soc Sports Nutr", year: 2017, pmid: "28615996" },
      { title: "Creatine and Cognitive Function", journal: "Psychopharmacology", year: 2003, pmid: "12905672" }
    ],
    evidence_level: "strong",
    score: 9.3
  },
  {
    id: "collagen",
    name_ar: "الكولاجين",
    name_en: "Collagen Peptides",
    category: "skin_joints",
    category_ar: "الجلد والمفاصل",
    best_form: {
      name: "Hydrolyzed Collagen Peptides (Type I & III للجلد، Type II للمفاصل)",
      why: "الببتيدات المتحللة أصغر حجماً وتُمتص بشكل أفضل. Type I+III للجلد والشعر والأظافر. Type II للغضاريف",
      avoid: "الكولاجين غير المتحلل — امتصاص ضعيف جداً"
    },
    benefits: [
      "تحسين مرونة الجلد وتقليل التجاعيد",
      "تقوية الشعر والأظافر",
      "دعم صحة المفاصل وتقليل آلام الركبة",
      "تحسين صحة الأمعاء وعلاج متلازمة الأمعاء المتسربة",
      "دعم صحة العظام وزيادة الكثافة العظمية",
      "تحسين التعافي بعد التمرين",
      "دعم صحة القلب والأوعية الدموية"
    ],
    side_effects: [
      "اضطرابات هضمية خفيفة",
      "طعم غير مستساغ في بعض المنتجات",
      "حساسية لمن لديهم حساسية من الأسماك أو البيض (حسب المصدر)"
    ],
    warnings: [
      "مصدر الكولاجين مهم: بقري، سمكي، دجاجي — اختر حسب حساسيتك",
      "النباتيون: لا يوجد كولاجين نباتي حقيقي — استخدم مكونات تحفز إنتاجه (فيتامين ج، سيليكا)"
    ],
    drug_interactions: [
      { drug: "لا تفاعلات دوائية معروفة مهمة", effect: "آمن مع معظم الأدوية", }
    ],
    disease_interactions: [
      { disease: "حساسية الأسماك (إذا كان مصدره سمكياً)", effect: "ممنوع", severity: "high" },
      { disease: "حساسية البيض (إذا كان مصدره بيضاً)", effect: "ممنوع", severity: "high" }
    ],
    dosage: {
      preventive: "5-10 غ/يوم",
      therapeutic: "10-20 غ/يوم",
      upper_limit: "لا يوجد حد أعلى محدد",
      timing: "مع فيتامين ج لتحسين تصنيع الكولاجين",
      notes: "النتائج تظهر بعد 8-12 أسبوع من الاستخدام المنتظم"
    },
    food_sources: ["مرق العظام", "الجلد الحيواني", "الأسماك مع جلدها", "البيض (غشاء القشرة)"],
    references: [
      { title: "Collagen Peptides and Skin Aging", journal: "Skin Pharmacol Physiol", year: 2014, pmid: "24401291" },
      { title: "Collagen and Joint Pain", journal: "Curr Med Res Opin", year: 2008, pmid: "18416885" }
    ],
    evidence_level: "moderate",
    score: 8.1
  },
  {
    id: "turmeric_curcumin",
    name_ar: "الكركم (الكركمين)",
    name_en: "Turmeric / Curcumin",
    category: "anti_inflammatory",
    category_ar: "مضادات الالتهاب",
    best_form: {
      name: "Curcumin Phytosome (Meriva) أو BCM-95 أو Curcumin + Piperine",
      why: "الكركمين العادي امتصاصه ضعيف جداً (<1%). Meriva وBCM-95 يزيدان الامتصاص 29-46 مرة. البيبيرين يزيده 2000%",
      avoid: "مسحوق الكركم العادي بدون محسن امتصاص — فعالية ضعيفة جداً"
    },
    benefits: [
      "مضاد التهاب قوي يعادل بعض الأدوية المضادة للالتهاب",
      "مضاد أكسدة قوي جداً",
      "تقليل آلام التهاب المفاصل",
      "دعم صحة الدماغ وتقليل خطر الزهايمر",
      "دعم صحة القلب وخفض الكوليسترول",
      "خصائص مضادة للسرطان (في الدراسات المخبرية)",
      "تحسين صحة الجهاز الهضمي",
      "تقليل أعراض الاكتئاب"
    ],
    side_effects: [
      "اضطرابات هضمية بجرعات عالية",
      "غثيان",
      "إسهال",
      "تلوين البراز والبول باللون الأصفر (طبيعي)"
    ],
    warnings: [
      "حصوات الكلى الأوكزالاتية: احتياط",
      "قبل العمليات الجراحية: إيقاف 2 أسبوع (يخفف الدم)",
      "الحوامل: تجنب الجرعات العالية",
      "مرضى المرارة: احتياط"
    ],
    drug_interactions: [
      { drug: "Warfarin / Anticoagulants", effect: "يزيد خطر النزيف" },
      { drug: "Aspirin / NSAIDs", effect: "تأثير تراكمي على تخفيف الدم" },
      { drug: "Diabetes medications", effect: "قد يخفض سكر الدم — مراقبة" },
      { drug: "Chemotherapy", effect: "قد يتفاعل مع بعض أدوية الكيماوي" },
      { drug: "Tacrolimus / Cyclosporine", effect: "يزيد مستوى الدواء في الدم" }
    ],
    disease_interactions: [
      { disease: "اضطرابات النزيف", effect: "احتياط شديد", severity: "high" },
      { disease: "حصوات الكلى الأوكزالاتية", effect: "احتياط", severity: "medium" },
      { disease: "انسداد القناة الصفراوية", effect: "ممنوع", severity: "high" }
    ],
    dosage: {
      preventive: "500-1000 ملغ كركمين/يوم",
      therapeutic: "1000-2000 ملغ كركمين/يوم",
      upper_limit: "8000 ملغ/يوم (دراسات السلامة)",
      timing: "مع الطعام الدهني والفلفل الأسود",
      notes: "BCM-95 أو Meriva أفضل من الكركمين العادي + بيبيرين"
    },
    food_sources: ["الكركم الطازج", "الكركم المطحون (مع الفلفل الأسود لتحسين الامتصاص)"],
    references: [
      { title: "Curcumin and Inflammation", journal: "Nutrients", year: 2017, pmid: "28930668" },
      { title: "Curcumin and Arthritis", journal: "Phytother Res", year: 2012, pmid: "22407780" }
    ],
    evidence_level: "moderate",
    score: 8.2
  }
];

// قاعدة بيانات الأمراض المزمنة
export const CHRONIC_DISEASES = [
  // أمراض القلب والأوعية
  { id: "hypertension", name_ar: "ارتفاع ضغط الدم", name_en: "Hypertension", category: "cardiovascular" },
  { id: "heart_disease", name_ar: "أمراض القلب التاجية", name_en: "Coronary Artery Disease", category: "cardiovascular" },
  { id: "heart_failure", name_ar: "قصور القلب", name_en: "Heart Failure", category: "cardiovascular" },
  { id: "arrhythmia", name_ar: "اضطراب نظم القلب", name_en: "Arrhythmia", category: "cardiovascular" },
  { id: "atrial_fibrillation", name_ar: "الرجفان الأذيني", name_en: "Atrial Fibrillation", category: "cardiovascular" },
  { id: "stroke_history", name_ar: "تاريخ سكتة دماغية", name_en: "Stroke History", category: "cardiovascular" },
  { id: "dvt", name_ar: "جلطة الأوردة العميقة", name_en: "Deep Vein Thrombosis", category: "cardiovascular" },
  { id: "high_cholesterol", name_ar: "ارتفاع الكوليسترول", name_en: "Hyperlipidemia", category: "cardiovascular" },
  // أمراض الغدد الصماء
  { id: "diabetes_t1", name_ar: "السكري النوع الأول", name_en: "Type 1 Diabetes", category: "endocrine" },
  { id: "diabetes_t2", name_ar: "السكري النوع الثاني", name_en: "Type 2 Diabetes", category: "endocrine" },
  { id: "prediabetes", name_ar: "مقدمات السكري", name_en: "Prediabetes", category: "endocrine" },
  { id: "hypothyroidism", name_ar: "قصور الغدة الدرقية", name_en: "Hypothyroidism", category: "endocrine" },
  { id: "hyperthyroidism", name_ar: "فرط نشاط الغدة الدرقية", name_en: "Hyperthyroidism", category: "endocrine" },
  { id: "pcos", name_ar: "تكيس المبايض", name_en: "PCOS", category: "endocrine" },
  { id: "adrenal_insufficiency", name_ar: "قصور الغدة الكظرية", name_en: "Adrenal Insufficiency", category: "endocrine" },
  // أمراض الكلى
  { id: "kidney_disease_ckd", name_ar: "الفشل الكلوي المزمن", name_en: "Chronic Kidney Disease", category: "kidney" },
  { id: "kidney_stones", name_ar: "حصوات الكلى", name_en: "Kidney Stones", category: "kidney" },
  { id: "kidney_stones_oxalate", name_ar: "حصوات الكلى الأوكزالاتية", name_en: "Oxalate Kidney Stones", category: "kidney" },
  // أمراض الكبد
  { id: "fatty_liver", name_ar: "الكبد الدهني", name_en: "Fatty Liver (NAFLD)", category: "liver" },
  { id: "hepatitis_b", name_ar: "التهاب الكبد ب", name_en: "Hepatitis B", category: "liver" },
  { id: "hepatitis_c", name_ar: "التهاب الكبد ج", name_en: "Hepatitis C", category: "liver" },
  { id: "cirrhosis", name_ar: "تليف الكبد", name_en: "Liver Cirrhosis", category: "liver" },
  // أمراض الجهاز الهضمي
  { id: "ibs", name_ar: "متلازمة القولون العصبي", name_en: "IBS", category: "digestive" },
  { id: "ibd_crohn", name_ar: "مرض كرون", name_en: "Crohn's Disease", category: "digestive" },
  { id: "ibd_colitis", name_ar: "التهاب القولون التقرحي", name_en: "Ulcerative Colitis", category: "digestive" },
  { id: "gerd", name_ar: "ارتجاع المريء", name_en: "GERD", category: "digestive" },
  { id: "peptic_ulcer", name_ar: "قرحة المعدة", name_en: "Peptic Ulcer", category: "digestive" },
  { id: "celiac", name_ar: "مرض الاضطرابات الهضمية (سيلياك)", name_en: "Celiac Disease", category: "digestive" },
  // أمراض المناعة الذاتية
  { id: "lupus", name_ar: "الذئبة الحمراء", name_en: "Lupus (SLE)", category: "autoimmune" },
  { id: "rheumatoid_arthritis", name_ar: "التهاب المفاصل الروماتويدي", name_en: "Rheumatoid Arthritis", category: "autoimmune" },
  { id: "ms", name_ar: "التصلب المتعدد", name_en: "Multiple Sclerosis", category: "autoimmune" },
  { id: "psoriasis", name_ar: "الصدفية", name_en: "Psoriasis", category: "autoimmune" },
  { id: "hashimoto", name_ar: "هاشيموتو (التهاب الغدة الدرقية)", name_en: "Hashimoto's Thyroiditis", category: "autoimmune" },
  { id: "type1_diabetes", name_ar: "السكري المناعي الذاتي", name_en: "Type 1 Diabetes (Autoimmune)", category: "autoimmune" },
  // أمراض الجهاز التنفسي
  { id: "asthma", name_ar: "الربو", name_en: "Asthma", category: "respiratory" },
  { id: "copd", name_ar: "الانسداد الرئوي المزمن", name_en: "COPD", category: "respiratory" },
  { id: "sleep_apnea", name_ar: "انقطاع النفس أثناء النوم", name_en: "Sleep Apnea", category: "respiratory" },
  // أمراض العظام والمفاصل
  { id: "osteoporosis", name_ar: "هشاشة العظام", name_en: "Osteoporosis", category: "musculoskeletal" },
  { id: "osteoarthritis", name_ar: "التهاب المفاصل التنكسي", name_en: "Osteoarthritis", category: "musculoskeletal" },
  { id: "gout", name_ar: "النقرس", name_en: "Gout", category: "musculoskeletal" },
  { id: "fibromyalgia", name_ar: "الفيبروميالجيا", name_en: "Fibromyalgia", category: "musculoskeletal" },
  // أمراض الجهاز العصبي
  { id: "migraine", name_ar: "الصداع النصفي", name_en: "Migraine", category: "neurological" },
  { id: "epilepsy", name_ar: "الصرع", name_en: "Epilepsy", category: "neurological" },
  { id: "parkinsons", name_ar: "باركنسون", name_en: "Parkinson's Disease", category: "neurological" },
  { id: "alzheimers", name_ar: "الزهايمر", name_en: "Alzheimer's Disease", category: "neurological" },
  { id: "adhd", name_ar: "اضطراب فرط الحركة وتشتت الانتباه", name_en: "ADHD", category: "neurological" },
  // الصحة النفسية
  { id: "depression", name_ar: "الاكتئاب", name_en: "Depression", category: "mental_health" },
  { id: "anxiety", name_ar: "القلق المزمن", name_en: "Anxiety Disorder", category: "mental_health" },
  { id: "bipolar", name_ar: "الاضطراب ثنائي القطب", name_en: "Bipolar Disorder", category: "mental_health" },
  { id: "schizophrenia", name_ar: "الفصام", name_en: "Schizophrenia", category: "mental_health" },
  // السرطان
  { id: "cancer_active", name_ar: "سرطان نشط (تحت العلاج)", name_en: "Active Cancer", category: "cancer" },
  { id: "cancer_history", name_ar: "تاريخ سرطان (شافٍ)", name_en: "Cancer History (Remission)", category: "cancer" },
  // أمراض الدم
  { id: "anemia_iron", name_ar: "فقر الدم بنقص الحديد", name_en: "Iron Deficiency Anemia", category: "blood" },
  { id: "anemia_b12", name_ar: "فقر الدم بنقص ب12", name_en: "B12 Deficiency Anemia", category: "blood" },
  { id: "hemochromatosis", name_ar: "داء الهيموكروماتوز", name_en: "Hemochromatosis", category: "blood" },
  { id: "thalassemia", name_ar: "الثلاسيميا", name_en: "Thalassemia", category: "blood" },
  { id: "sickle_cell", name_ar: "فقر الدم المنجلي", name_en: "Sickle Cell Disease", category: "blood" },
  { id: "bleeding_disorder", name_ar: "اضطراب التخثر", name_en: "Bleeding Disorder", category: "blood" },
  // أخرى
  { id: "obesity", name_ar: "السمنة المفرطة", name_en: "Obesity (BMI>30)", category: "metabolic" },
  { id: "metabolic_syndrome", name_ar: "متلازمة التمثيل الغذائي", name_en: "Metabolic Syndrome", category: "metabolic" },
  { id: "sarcoidosis", name_ar: "الساركويد", name_en: "Sarcoidosis", category: "other" },
  { id: "pregnancy", name_ar: "الحمل", name_en: "Pregnancy", category: "other" },
  { id: "breastfeeding", name_ar: "الرضاعة الطبيعية", name_en: "Breastfeeding", category: "other" },
  { id: "organ_transplant", name_ar: "زراعة الأعضاء", name_en: "Organ Transplant", category: "other" },
  { id: "wilson_disease", name_ar: "مرض ويلسون", name_en: "Wilson's Disease", category: "other" },
  { id: "pernicious_anemia", name_ar: "فقر الدم الخبيث", name_en: "Pernicious Anemia", category: "other" }
];

// قاعدة بيانات الحساسيات
export const ALLERGIES = [
  { id: "fish", name_ar: "حساسية الأسماك", name_en: "Fish Allergy" },
  { id: "shellfish", name_ar: "حساسية المحار والقشريات", name_en: "Shellfish Allergy" },
  { id: "eggs", name_ar: "حساسية البيض", name_en: "Egg Allergy" },
  { id: "milk_dairy", name_ar: "حساسية الحليب ومنتجات الألبان", name_en: "Milk/Dairy Allergy" },
  { id: "lactose_intolerance", name_ar: "عدم تحمل اللاكتوز", name_en: "Lactose Intolerance" },
  { id: "gluten", name_ar: "حساسية الغلوتين", name_en: "Gluten Sensitivity/Celiac" },
  { id: "nuts_tree", name_ar: "حساسية المكسرات", name_en: "Tree Nut Allergy" },
  { id: "peanuts", name_ar: "حساسية الفول السوداني", name_en: "Peanut Allergy" },
  { id: "soy", name_ar: "حساسية الصويا", name_en: "Soy Allergy" },
  { id: "wheat", name_ar: "حساسية القمح", name_en: "Wheat Allergy" },
  { id: "sesame", name_ar: "حساسية السمسم", name_en: "Sesame Allergy" },
  { id: "sulfites", name_ar: "حساسية الكبريتيت", name_en: "Sulfite Sensitivity" },
  { id: "latex", name_ar: "حساسية اللاتكس", name_en: "Latex Allergy" },
  { id: "iodine", name_ar: "حساسية اليود", name_en: "Iodine Allergy" },
  { id: "aspirin_nsaids", name_ar: "حساسية الأسبرين والمضادات غير الستيرويدية", name_en: "Aspirin/NSAIDs Sensitivity" },
  { id: "penicillin", name_ar: "حساسية البنسلين", name_en: "Penicillin Allergy" },
  { id: "sulfa", name_ar: "حساسية السلفا", name_en: "Sulfa Drug Allergy" },
  { id: "bee_stings", name_ar: "حساسية لسعة النحل", name_en: "Bee Sting Allergy" },
  { id: "pollen", name_ar: "حساسية حبوب اللقاح", name_en: "Pollen Allergy" },
  { id: "dust_mites", name_ar: "حساسية عث الغبار", name_en: "Dust Mite Allergy" },
  { id: "mold", name_ar: "حساسية العفن", name_en: "Mold Allergy" },
  { id: "cat_dander", name_ar: "حساسية وبر القطط", name_en: "Cat Dander Allergy" },
  { id: "nickel", name_ar: "حساسية النيكل", name_en: "Nickel Allergy" }
];

// قاعدة بيانات الأدوية الشائعة
export const COMMON_MEDICATIONS = [
  // أدوية القلب والضغط
  { id: "warfarin", name_ar: "وارفارين (مضاد تخثر)", name_en: "Warfarin", category: "blood_thinners" },
  { id: "aspirin", name_ar: "أسبرين", name_en: "Aspirin", category: "blood_thinners" },
  { id: "clopidogrel", name_ar: "كلوبيدوغريل (بلافيكس)", name_en: "Clopidogrel (Plavix)", category: "blood_thinners" },
  { id: "rivaroxaban", name_ar: "ريفاروكسابان (كساريلتو)", name_en: "Rivaroxaban (Xarelto)", category: "blood_thinners" },
  { id: "metoprolol", name_ar: "ميتوبرولول (حاصر بيتا)", name_en: "Metoprolol (Beta-blocker)", category: "heart" },
  { id: "amlodipine", name_ar: "أملوديبين (حاصر كالسيوم)", name_en: "Amlodipine", category: "heart" },
  { id: "lisinopril", name_ar: "ليسينوبريل (ACE inhibitor)", name_en: "Lisinopril (ACE Inhibitor)", category: "heart" },
  { id: "losartan", name_ar: "لوسارتان (ARB)", name_en: "Losartan (ARB)", category: "heart" },
  { id: "digoxin", name_ar: "ديجوكسين", name_en: "Digoxin", category: "heart" },
  { id: "furosemide", name_ar: "فوروسيميد (مدر بول)", name_en: "Furosemide (Lasix)", category: "diuretics" },
  { id: "hydrochlorothiazide", name_ar: "هيدروكلوروثيازيد", name_en: "Hydrochlorothiazide", category: "diuretics" },
  // الكوليسترول
  { id: "atorvastatin", name_ar: "أتورفاستاتين (ليبيتور)", name_en: "Atorvastatin (Lipitor)", category: "statins" },
  { id: "rosuvastatin", name_ar: "روزوفاستاتين (كريستور)", name_en: "Rosuvastatin (Crestor)", category: "statins" },
  { id: "simvastatin", name_ar: "سيمفاستاتين (زوكور)", name_en: "Simvastatin (Zocor)", category: "statins" },
  // السكري
  { id: "metformin", name_ar: "ميتفورمين (جلوكوفاج)", name_en: "Metformin (Glucophage)", category: "diabetes" },
  { id: "insulin", name_ar: "الأنسولين", name_en: "Insulin", category: "diabetes" },
  { id: "glibenclamide", name_ar: "غليبنكلاميد", name_en: "Glibenclamide", category: "diabetes" },
  { id: "sitagliptin", name_ar: "سيتاغليبتين (جانوفيا)", name_en: "Sitagliptin (Januvia)", category: "diabetes" },
  // الغدة الدرقية
  { id: "levothyroxine", name_ar: "ليفوثيروكسين (إليتروكسين)", name_en: "Levothyroxine (Eltroxin)", category: "thyroid" },
  { id: "carbimazole", name_ar: "كاربيمازول", name_en: "Carbimazole", category: "thyroid" },
  // المعدة
  { id: "omeprazole", name_ar: "أوميبرازول (لوسيك)", name_en: "Omeprazole (Losec)", category: "gastric" },
  { id: "pantoprazole", name_ar: "بانتوبرازول", name_en: "Pantoprazole", category: "gastric" },
  { id: "ranitidine", name_ar: "رانيتيدين", name_en: "Ranitidine", category: "gastric" },
  // المضادات الحيوية
  { id: "amoxicillin", name_ar: "أموكسيسيلين", name_en: "Amoxicillin", category: "antibiotics" },
  { id: "azithromycin", name_ar: "أزيثروميسين (زيثروماكس)", name_en: "Azithromycin (Zithromax)", category: "antibiotics" },
  { id: "ciprofloxacin", name_ar: "سيبروفلوكساسين", name_en: "Ciprofloxacin", category: "antibiotics" },
  { id: "doxycycline", name_ar: "دوكسيسيكلين", name_en: "Doxycycline", category: "antibiotics" },
  // الصحة النفسية
  { id: "sertraline", name_ar: "سيرترالين (زولوفت)", name_en: "Sertraline (Zoloft)", category: "antidepressants" },
  { id: "fluoxetine", name_ar: "فلوكستين (بروزاك)", name_en: "Fluoxetine (Prozac)", category: "antidepressants" },
  { id: "escitalopram", name_ar: "إسسيتالوبرام (سيبرالكس)", name_en: "Escitalopram (Cipralex)", category: "antidepressants" },
  { id: "lithium", name_ar: "ليثيوم", name_en: "Lithium", category: "mood_stabilizers" },
  { id: "alprazolam", name_ar: "ألبرازولام (زاناكس)", name_en: "Alprazolam (Xanax)", category: "anxiolytics" },
  { id: "quetiapine", name_ar: "كيتيابين (سيروكويل)", name_en: "Quetiapine (Seroquel)", category: "antipsychotics" },
  // مسكنات الألم
  { id: "ibuprofen", name_ar: "إيبوبروفين (أدفيل)", name_en: "Ibuprofen (Advil)", category: "nsaids" },
  { id: "naproxen", name_ar: "نابروكسين", name_en: "Naproxen", category: "nsaids" },
  { id: "diclofenac", name_ar: "ديكلوفيناك (فولتارين)", name_en: "Diclofenac (Voltaren)", category: "nsaids" },
  { id: "paracetamol", name_ar: "باراسيتامول (بانادول)", name_en: "Paracetamol (Panadol)", category: "analgesics" },
  { id: "tramadol", name_ar: "ترامادول", name_en: "Tramadol", category: "opioids" },
  // المناعة
  { id: "prednisolone", name_ar: "بريدنيزولون (كورتيزون)", name_en: "Prednisolone (Cortisone)", category: "steroids" },
  { id: "methotrexate", name_ar: "ميثوتريكسات", name_en: "Methotrexate", category: "immunosuppressants" },
  { id: "cyclosporine", name_ar: "سيكلوسبورين", name_en: "Cyclosporine", category: "immunosuppressants" },
  { id: "tacrolimus", name_ar: "تاكروليموس", name_en: "Tacrolimus", category: "immunosuppressants" },
  // أخرى
  { id: "allopurinol", name_ar: "ألوبيورينول (النقرس)", name_en: "Allopurinol (Gout)", category: "gout" },
  { id: "colchicine", name_ar: "كولشيسين (النقرس)", name_en: "Colchicine", category: "gout" },
  { id: "isotretinoin", name_ar: "إيزوتريتينوين (روأكيوتان)", name_en: "Isotretinoin (Roaccutane)", category: "dermatology" },
  { id: "chemotherapy", name_ar: "العلاج الكيماوي", name_en: "Chemotherapy", category: "cancer" },
  { id: "tamoxifen", name_ar: "تاموكسيفين", name_en: "Tamoxifen", category: "cancer" }
];

// الأهداف الصحية
export const HEALTH_GOALS = [
  { id: "weight_loss", name_ar: "خسارة الوزن", icon: "⚖️" },
  { id: "muscle_gain", name_ar: "بناء العضلات", icon: "💪" },
  { id: "energy_boost", name_ar: "زيادة الطاقة والنشاط", icon: "⚡" },
  { id: "sleep_improvement", name_ar: "تحسين النوم", icon: "😴" },
  { id: "stress_reduction", name_ar: "تقليل التوتر والقلق", icon: "🧘" },
  { id: "immune_support", name_ar: "تقوية المناعة", icon: "🛡️" },
  { id: "heart_health", name_ar: "صحة القلب والأوعية", icon: "❤️" },
  { id: "bone_health", name_ar: "صحة العظام والمفاصل", icon: "🦴" },
  { id: "brain_health", name_ar: "صحة الدماغ والذاكرة", icon: "🧠" },
  { id: "skin_hair", name_ar: "صحة الجلد والشعر", icon: "✨" },
  { id: "digestive_health", name_ar: "صحة الجهاز الهضمي", icon: "🫁" },
  { id: "hormonal_balance", name_ar: "التوازن الهرموني", icon: "⚗️" },
  { id: "athletic_performance", name_ar: "تحسين الأداء الرياضي", icon: "🏃" },
  { id: "anti_aging", name_ar: "مكافحة الشيخوخة", icon: "🌱" },
  { id: "fertility", name_ar: "دعم الخصوبة", icon: "👶" },
  { id: "blood_sugar", name_ar: "ضبط سكر الدم", icon: "🩸" },
  { id: "cholesterol", name_ar: "تحسين مستوى الكوليسترول", icon: "💊" },
  { id: "inflammation", name_ar: "تقليل الالتهابات", icon: "🔥" }
];
