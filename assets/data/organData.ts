export type EvidenceLevel = 5 | 4 | 3 | 2;

export interface EvidencePill {
  label: string;
  level: EvidenceLevel;
}

export interface DoseLevel {
  label: string;
  value: string;
  type: 'min' | 'opt' | 'max';
  percent: number;
}

export interface IngredientCard {
  id: string;
  icon: string;
  iconBg: string;
  iconBorder: string;
  name: string;
  role: string;
  doses: DoseLevel[];
  evidence: EvidencePill[];
  description: string;
  citations: string[];
  synergy?: string;
  conflict?: string;
}

export interface ProductRow {
  name: string;
  cols: { value: string; type: 'best' | 'warn' | 'mid' | 'normal' }[];
  price: string;
  pricePerServing: string;
  ppsType: 'g' | 'm' | 'b';
  score: number;
  scoreType: 's' | 'm' | 'l';
  available: boolean;
}

export interface ComparisonTable {
  headers: string[];
  rows: ProductRow[];
}

export interface WinnerCard {
  badge: string;
  name: string;
  reason: string;
  citations: string[];
  price: string;
  type: 'liver' | 'heart' | 'kidney' | 'compare';
}

export interface OrganSection {
  id: 'liver' | 'heart' | 'kidney';
  label: string;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  ingredients: IngredientCard[];
  comparison: ComparisonTable;
  winners: WinnerCard[];
}

// ═══════════════ LIVER DATA ═══════════════
const liverIngredients: IngredientCard[] = [
  {
    id: 'tudca',
    icon: '🧪',
    iconBg: 'rgba(245,158,11,0.12)',
    iconBorder: 'rgba(245,158,11,0.3)',
    name: 'TUDCA',
    role: 'Tauroursodeoxycholic Acid — حماية خلايا الكبد',
    doses: [
      { label: 'الجرعة الدنيا', value: '250 mg/يوم', type: 'min', percent: 50 },
      { label: 'الجرعة المثلى ✅', value: '500–750 mg/يوم', type: 'opt', percent: 100 },
      { label: 'الجرعة العلاجية', value: '1000–1500 mg/يوم', type: 'max', percent: 75 },
    ],
    evidence: [
      { label: 'RCT ✅', level: 5 },
      { label: 'PubMed موثّق', level: 5 },
      { label: 'NAFLD/NASH', level: 4 },
      { label: 'حماية الصفراء', level: 4 },
    ],
    description: 'دراسات سريرية تُثبت تحسين إنزيمات الكبد وتقليل التهاب الخلايا الكبدية.',
    citations: ['NIH/PMC', 'Examine.com'],
    synergy: 'NAC — يعمل معاً لرفع الجلوتاثيون وتقليل الإجهاد التأكسدي بشكل تكاملي',
  },
  {
    id: 'nac-liver',
    icon: '🛡️',
    iconBg: 'rgba(16,185,129,0.12)',
    iconBorder: 'rgba(16,185,129,0.3)',
    name: 'NAC (N-Acetylcysteine)',
    role: 'سلف الجلوتاثيون — مضاد أكسدة قوي',
    doses: [
      { label: 'الجرعة الدنيا', value: '600 mg/يوم', type: 'min', percent: 50 },
      { label: 'الجرعة المثلى ✅', value: '1200–1800 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'Meta-Analysis ✅', level: 5 },
      { label: 'NIH موثّق', level: 5 },
      { label: 'حماية كبدية', level: 4 },
      { label: 'مضاد التهاب', level: 4 },
    ],
    description: '1200mg/يوم أثبتت فعاليتها في تجارب سريرية متعددة لتقليل ALT/AST وتراكم الدهون الكبدية.',
    citations: ['PMC8234027', 'NMI Health'],
    conflict: 'لا يُؤخذ مع جرعات عالية من الزنك في نفس الوقت — يقلل الامتصاص. افصل بـ 2 ساعة.',
  },
  {
    id: 'silymarin',
    icon: '🌿',
    iconBg: 'rgba(132,204,22,0.12)',
    iconBorder: 'rgba(132,204,22,0.3)',
    name: 'Silymarin (Milk Thistle)',
    role: 'حليب الشوك — تجديد خلايا الكبد',
    doses: [
      { label: 'الجرعة الدنيا', value: '420 mg/يوم', type: 'min', percent: 40 },
      { label: 'الجرعة المثلى ✅', value: '700–1050 mg/يوم', type: 'opt', percent: 100 },
      { label: 'الجرعة العلاجية (NASH)', value: '2100 mg/يوم', type: 'max', percent: 80 },
    ],
    evidence: [
      { label: 'Phase I/II Trials ✅', level: 5 },
      { label: 'NAFLD/NASH', level: 4 },
      { label: 'تليف الكبد', level: 4 },
    ],
    description: 'Siliphos® (فوسفاتيديل سيلمارين) يرفع الامتصاص 4–10 أضعاف مقارنة بالشكل العادي.',
    citations: ['PMC10067788', 'PMC7140758'],
    synergy: 'TUDCA + NAC — الثلاثة معاً تُشكّل أقوى بروتوكول حماية كبدية موثّق علمياً',
  },
  {
    id: 'glutathione',
    icon: '⚡',
    iconBg: 'rgba(56,189,248,0.12)',
    iconBorder: 'rgba(56,189,248,0.3)',
    name: 'Glutathione (S-Acetyl)',
    role: 'الجلوتاثيون — سيد مضادات الأكسدة',
    doses: [
      { label: 'الجرعة الدنيا', value: '250 mg/يوم', type: 'min', percent: 50 },
      { label: 'الجرعة المثلى ✅', value: '500–1000 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'RCT ✅', level: 5 },
      { label: 'S-Acetyl أعلى امتصاصاً', level: 4 },
      { label: 'NAFLD مُثبَت', level: 4 },
    ],
    description: 'S-Acetyl Glutathione يخترق الخلية مباشرة. دراسات تُثبت تحسين إنزيمات الكبد وتقليل الإجهاد التأكسدي.',
    citations: ['PMC9355942', 'Examine GSH'],
  },
  {
    id: 'choline',
    icon: '🔬',
    iconBg: 'rgba(139,92,246,0.12)',
    iconBorder: 'rgba(139,92,246,0.3)',
    name: 'Choline (Alpha-GPC/CDP)',
    role: 'الكولين — منع تراكم الدهون الكبدية',
    doses: [
      { label: 'الجرعة الدنيا', value: '250 mg/يوم', type: 'min', percent: 40 },
      { label: 'الجرعة المثلى ✅', value: '500–1000 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'NIH Essential ✅', level: 5 },
      { label: 'NAFLD مُثبَت', level: 5 },
      { label: 'نقص = تلف كبدي', level: 4 },
    ],
    description: 'نقص الكولين يسبب NAFLD مباشرة. Alpha-GPC وCDP-Choline أعلى امتصاصاً من Choline Bitartrate.',
    citations: ['NIH Choline', 'PMC6213596'],
  },
  {
    id: 'ala',
    icon: '🌟',
    iconBg: 'rgba(245,158,11,0.12)',
    iconBorder: 'rgba(245,158,11,0.3)',
    name: 'Alpha Lipoic Acid (ALA)',
    role: 'حمض الليبويك — مضاد أكسدة مزدوج',
    doses: [
      { label: 'الجرعة الدنيا', value: '300 mg/يوم', type: 'min', percent: 50 },
      { label: 'الجرعة المثلى ✅', value: '600–1200 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'RCT ✅', level: 5 },
      { label: 'مزدوج ذوبان', level: 4 },
      { label: 'إعادة تدوير GSH', level: 4 },
    ],
    description: 'يذوب في الماء والدهون معاً — يعيد تدوير الجلوتاثيون وفيتامين C وE. R-ALA أكثر فعالية من الشكل العادي.',
    citations: ['PMC7019700', 'Examine ALA'],
    synergy: 'NAC + Glutathione — الثلاثة تُشكّل شبكة مضادات أكسدة متكاملة',
  },
];

const liverComparison: ComparisonTable = {
  headers: ['المنتج', 'TUDCA', 'NAC', 'Silymarin', 'Glutathione', 'Choline', 'ALA', 'السعر', '$/حصة', 'الدرجة', 'التوفر'],
  rows: [
    {
      name: '🟡 Infinis LIVER',
      cols: [
        { value: '500mg ✅', type: 'best' },
        { value: '600mg ✅', type: 'best' },
        { value: 'Siliphos® ✅', type: 'best' },
        { value: 'S-Acetyl ✅', type: 'best' },
        { value: 'Alpha-GPC ✅', type: 'best' },
        { value: 'R-ALA ✅', type: 'best' },
      ],
      price: '$64.99',
      pricePerServing: '$2.17',
      ppsType: 'b',
      score: 96,
      scoreType: 's',
      available: true,
    },
    {
      name: '🟡 Morphogen LIVER',
      cols: [
        { value: '500mg ✅', type: 'best' },
        { value: '1200mg ✅', type: 'best' },
        { value: '700mg ✅', type: 'best' },
        { value: '❌', type: 'warn' },
        { value: 'CDP ✅', type: 'best' },
        { value: '600mg ✅', type: 'best' },
      ],
      price: '$54.99',
      pricePerServing: '$1.83',
      ppsType: 'm',
      score: 91,
      scoreType: 's',
      available: true,
    },
    {
      name: '🟡 Apollon LIVER',
      cols: [
        { value: '250mg ⚠️', type: 'mid' },
        { value: '600mg ✅', type: 'best' },
        { value: '420mg ⚠️', type: 'mid' },
        { value: '❌', type: 'warn' },
        { value: '❌', type: 'warn' },
        { value: '300mg ⚠️', type: 'mid' },
      ],
      price: '$47.99',
      pricePerServing: '$1.60',
      ppsType: 'g',
      score: 72,
      scoreType: 'm',
      available: true,
    },
    {
      name: '🟡 Core LIVER',
      cols: [
        { value: '❌', type: 'warn' },
        { value: '600mg ✅', type: 'best' },
        { value: '700mg ✅', type: 'best' },
        { value: '❌', type: 'warn' },
        { value: '❌', type: 'warn' },
        { value: '❌', type: 'warn' },
      ],
      price: '$39.99',
      pricePerServing: '$1.33',
      ppsType: 'g',
      score: 58,
      scoreType: 'l',
      available: true,
    },
  ],
};

const liverWinners: WinnerCard[] = [
  {
    badge: '🏆 الأفضل تركيبةً علمياً',
    name: 'Infinis LIVER — 96/100',
    reason: 'TUDCA 500mg + NAC 600mg + Siliphos® + S-Acetyl GSH + Alpha-GPC + R-ALA = أشمل تركيبة كبدية مبنية على أدلة.',
    citations: ['NIH/PMC', 'Examine.com'],
    price: '$64.99 | $2.17/حصة',
    type: 'liver',
  },
  {
    badge: '💰 أفضل قيمة علمية',
    name: 'Morphogen LIVER — 91/100',
    reason: 'TUDCA + NAC 1200mg + Silymarin 700mg + CDP-Choline + ALA = تركيبة شاملة بسعر معقول.',
    citations: ['PMC8234027', 'PMC10067788'],
    price: '$54.99 | $1.83/حصة',
    type: 'liver',
  },
];

// ═══════════════ HEART DATA ═══════════════
const heartIngredients: IngredientCard[] = [
  {
    id: 'coq10',
    icon: '⚡',
    iconBg: 'rgba(239,68,68,0.12)',
    iconBorder: 'rgba(239,68,68,0.3)',
    name: 'CoQ10 (Ubiquinol/Ubiquinone)',
    role: 'إنزيم Q10 — طاقة القلب ومضاد أكسدة',
    doses: [
      { label: 'الجرعة الدنيا', value: '100 mg/يوم', type: 'min', percent: 33 },
      { label: 'الجرعة المثلى ✅', value: '200–300 mg/يوم', type: 'opt', percent: 100 },
      { label: 'الجرعة العلاجية (Q-SYMBIO)', value: '300 mg/يوم', type: 'max', percent: 100 },
    ],
    evidence: [
      { label: 'Q-SYMBIO RCT ✅', level: 5 },
      { label: 'Meta-Analysis ✅', level: 5 },
      { label: 'قصور القلب', level: 4 },
      { label: 'Ubiquinol أعلى امتصاصاً', level: 4 },
    ],
    description: 'تجربة Q-SYMBIO: 300mg/يوم قللت وفيات القلب 43%. Ubiquinol يُمتص 2–3 أضعاف Ubiquinone.',
    citations: ['Q-SYMBIO Trial', 'PMC12883399'],
    synergy: 'Omega-3 + L-Carnitine — الثلاثة معاً تُشكّل بروتوكول دعم قلبي متكامل',
  },
  {
    id: 'omega3',
    icon: '🐟',
    iconBg: 'rgba(14,165,233,0.12)',
    iconBorder: 'rgba(14,165,233,0.3)',
    name: 'Omega-3 (EPA/DHA)',
    role: 'أوميغا-3 — تقليل الدهون الثلاثية وحماية القلب',
    doses: [
      { label: 'الجرعة الدنيا', value: '1000 mg/يوم', type: 'min', percent: 33 },
      { label: 'الجرعة المثلى ✅', value: '2000–4000 mg/يوم', type: 'opt', percent: 100 },
      { label: 'الجرعة العلاجية (TG)', value: '4000 mg/يوم', type: 'max', percent: 100 },
    ],
    evidence: [
      { label: 'AHA Endorsed ✅', level: 5 },
      { label: 'REDUCE-IT Trial ✅', level: 5 },
      { label: 'تقليل TG', level: 5 },
      { label: 'مضاد التهاب', level: 4 },
    ],
    description: 'REDUCE-IT: 4g/يوم EPA قللت الأحداث القلبية 25%. نسبة EPA:DHA المثلى 2:1 لصحة القلب.',
    citations: ['REDUCE-IT Trial', 'AHA Guidelines'],
  },
  {
    id: 'lcarnitine',
    icon: '🔥',
    iconBg: 'rgba(245,158,11,0.12)',
    iconBorder: 'rgba(245,158,11,0.3)',
    name: 'L-Carnitine (LCLT)',
    role: 'نقل الأحماض الدهنية — وقود عضلة القلب',
    doses: [
      { label: 'الجرعة الدنيا', value: '500 mg/يوم', type: 'min', percent: 25 },
      { label: 'الجرعة المثلى ✅', value: '2000–3000 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'Meta-Analysis ✅', level: 5 },
      { label: 'قصور القلب', level: 4 },
      { label: 'تحسين EF', level: 4 },
    ],
    description: 'Meta-analysis: L-Carnitine يُحسّن الكسر القذفي (EF) ويقلل الوفيات في قصور القلب.',
    citations: ['PMC3099008', 'Examine L-Carnitine'],
  },
  {
    id: 'magnesium',
    icon: '💎',
    iconBg: 'rgba(139,92,246,0.12)',
    iconBorder: 'rgba(139,92,246,0.3)',
    name: 'Magnesium (Glycinate/Taurate)',
    role: 'المغنيسيوم — تنظيم إيقاع القلب وضغط الدم',
    doses: [
      { label: 'الجرعة الدنيا', value: '200 mg/يوم', type: 'min', percent: 50 },
      { label: 'الجرعة المثلى ✅', value: '400–600 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'Systematic Review ✅', level: 5 },
      { label: 'ضغط الدم', level: 5 },
      { label: 'إيقاع القلب', level: 4 },
    ],
    description: 'Magnesium Taurate الأفضل لصحة القلب — يجمع المغنيسيوم مع التورين لتأثير تآزري.',
    citations: ['PMC5637834', 'NIH Magnesium'],
    synergy: 'Taurine — كلاهما يدعمان إيقاع القلب بآليات متكاملة',
  },
  {
    id: 'berberine',
    icon: '🌱',
    iconBg: 'rgba(16,185,129,0.12)',
    iconBorder: 'rgba(16,185,129,0.3)',
    name: 'Berberine',
    role: 'البربرين — تحسين الكوليسترول وضغط الدم',
    doses: [
      { label: 'الجرعة المثلى ✅', value: '500–1500 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'Meta-Analysis ✅', level: 5 },
      { label: 'LDL تقليل', level: 4 },
      { label: 'AMPK تفعيل', level: 4 },
    ],
    description: 'يُفعّل AMPK مثل الميتفورمين. يُقلل LDL بـ 20% ويرفع HDL في دراسات متعددة.',
    citations: ['PMC6111450', 'Examine Berberine'],
    conflict: 'يتفاعل مع أدوية تخفيف الدم والستاتينات — استشر طبيبك.',
  },
  {
    id: 'taurine',
    icon: '💧',
    iconBg: 'rgba(56,189,248,0.12)',
    iconBorder: 'rgba(56,189,248,0.3)',
    name: 'Taurine',
    role: 'التورين — حماية القلب وتنظيم الكالسيوم',
    doses: [
      { label: 'الجرعة المثلى ✅', value: '1000–3000 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'RCT ✅', level: 5 },
      { label: 'قصور القلب', level: 4 },
      { label: 'مضاد أكسدة', level: 4 },
    ],
    description: 'دراسات تُثبت تحسين وظيفة القلب في قصور القلب الاحتقاني. يُنظّم دخول الكالسيوم للخلايا.',
    citations: ['PMC3501277', 'Examine Taurine'],
  },
];

const heartComparison: ComparisonTable = {
  headers: ['المنتج', 'CoQ10', 'شكل CoQ10', 'Omega-3', 'L-Carnitine', 'السعر', '$/حصة', 'الدرجة', 'التوفر'],
  rows: [
    {
      name: '❤️ Infinis HEART',
      cols: [
        { value: 'Ubiqsome® ✅', type: 'best' },
        { value: 'Ubiquinol ✅', type: 'best' },
        { value: '❌', type: 'warn' },
        { value: '❌', type: 'warn' },
      ],
      price: '$57.99',
      pricePerServing: '$1.93',
      ppsType: 'b',
      score: 90,
      scoreType: 's',
      available: true,
    },
    {
      name: '❤️ Morphogen CARDIO',
      cols: [
        { value: '300mg ✅', type: 'best' },
        { value: 'Ubiquinone ⚠️', type: 'mid' },
        { value: '✅', type: 'best' },
        { value: '✅ PQQ', type: 'best' },
      ],
      price: '$49.99',
      pricePerServing: '$1.67',
      ppsType: 'm',
      score: 94,
      scoreType: 's',
      available: true,
    },
    {
      name: '❤️ Apollon HEART',
      cols: [
        { value: '200mg ⚠️', type: 'mid' },
        { value: 'Ubiquinone ⚠️', type: 'mid' },
        { value: '✅', type: 'best' },
        { value: '❌', type: 'warn' },
      ],
      price: '$44.99',
      pricePerServing: '$1.50',
      ppsType: 'g',
      score: 74,
      scoreType: 'm',
      available: true,
    },
    {
      name: '❤️ Core HEART',
      cols: [
        { value: '200mg ⚠️', type: 'mid' },
        { value: 'Ubiquinone ⚠️', type: 'mid' },
        { value: '✅', type: 'best' },
        { value: '❌', type: 'warn' },
      ],
      price: '$39.99',
      pricePerServing: '$1.33',
      ppsType: 'g',
      score: 76,
      scoreType: 'm',
      available: true,
    },
  ],
};

const heartWinners: WinnerCard[] = [
  {
    badge: '🏆 الأفضل تركيبةً علمياً',
    name: 'Morphogen CARDIO — 94/100',
    reason: 'CoQ10 300mg (جرعة Q-SYMBIO) + PQQ + Omega-3 + L-Carnitine = أشمل تركيبة قلبية مبنية على أدلة.',
    citations: ['Q-SYMBIO Trial', 'PMC12883399'],
    price: '$49.99 | $1.67/حصة',
    type: 'heart',
  },
  {
    badge: '💎 أفضل جودة مكونات',
    name: 'Infinis HEART — 90/100',
    reason: 'Ubiqsome® CoQ10 (Ubiquinol) + Rejuna® + GG-Gold® = أعلى امتصاصية وجودة مكونات مسجّلة.',
    citations: ['Ubiqsome® RCT'],
    price: '$57.99 | $1.93/حصة',
    type: 'heart',
  },
];

// ═══════════════ KIDNEY DATA ═══════════════
const kidneyIngredients: IngredientCard[] = [
  {
    id: 'nac-kidney',
    icon: '🛡️',
    iconBg: 'rgba(16,185,129,0.12)',
    iconBorder: 'rgba(16,185,129,0.3)',
    name: 'NAC للكلى',
    role: 'حماية من التلف الكلوي والإجهاد التأكسدي',
    doses: [
      { label: 'الجرعة المثلى ✅ (كلى)', value: '1200–1800 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'Systematic Review ✅', level: 5 },
      { label: 'Meta-Analysis NIH', level: 5 },
      { label: 'CKD مُثبَت', level: 4 },
    ],
    description: 'Meta-analysis شامل: NAC يحسّن وظائف الكلى ويقلل الالتهاب في أمراض الكلى المزمنة بأمان تام.',
    citations: ['PMC8129408', 'ResearchGate CKD'],
  },
  {
    id: 'astragaloside',
    icon: '🌿',
    iconBg: 'rgba(139,92,246,0.12)',
    iconBorder: 'rgba(139,92,246,0.3)',
    name: 'Astragaloside IV',
    role: 'إطالة التيلومير — حماية الكلى المزمنة',
    doses: [
      { label: 'الجرعة الدنيا', value: '25 mg/يوم', type: 'min', percent: 50 },
      { label: 'الجرعة المثلى ✅', value: '50 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'دراسات حيوانية قوية', level: 4 },
      { label: 'بشري محدود', level: 3 },
      { label: 'تيلوميراز ✅', level: 4 },
    ],
    description: 'Infinis KIDNEY يحتوي على 50mg — ضعف أي منافس. يُثبّط التليف الكلوي ويحمي الخلايا الأنبوبية.',
    citations: ['PubMed Astragaloside'],
    synergy: 'Cordyceps — كلاهما يدعمان وظيفة الكلى بآليات مختلفة ومتكاملة',
  },
  {
    id: 'cordyceps',
    icon: '🍄',
    iconBg: 'rgba(245,158,11,0.12)',
    iconBorder: 'rgba(245,158,11,0.3)',
    name: 'Cordyceps Sinensis',
    role: 'فطر الكوردسيبس — تحسين GFR وتقليل التليف',
    doses: [
      { label: 'الجرعة المثلى ✅', value: '1000–3000 mg/يوم', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'Cochrane Review', level: 4 },
      { label: 'CKD مُثبَت', level: 4 },
      { label: 'جودة الدراسات متوسطة', level: 3 },
    ],
    description: 'مراجعة Cochrane: Cordyceps يحسّن معدل الترشيح الكبيبي (GFR) ويقلل Creatinine في CKD.',
    citations: ['Cochrane CKD'],
  },
  {
    id: 'cranberry',
    icon: '🫐',
    iconBg: 'rgba(239,68,68,0.12)',
    iconBorder: 'rgba(239,68,68,0.3)',
    name: 'Cranberry Extract',
    role: 'التوت البري — حماية المسالك البولية',
    doses: [
      { label: 'الجرعة المثلى ✅', value: '400–500 mg/يوم (مركّز)', type: 'opt', percent: 100 },
    ],
    evidence: [
      { label: 'Cochrane UTI', level: 4 },
      { label: 'وقائي فقط', level: 3 },
    ],
    description: 'فعّال وقائياً ضد UTI — ليس علاجياً. Anthocran® Phytosome (في Infinis) يرفع الامتصاص 5 أضعاف.',
    citations: ['Cochrane UTI Review'],
  },
];

const kidneyComparison: ComparisonTable = {
  headers: ['المنتج', 'NAC', 'Astragaloside IV', 'Cordyceps', 'Cranberry', 'السعر', '$/حصة', 'الدرجة', 'التوفر'],
  rows: [
    {
      name: '🟣 Infinis KIDNEY',
      cols: [
        { value: '❌', type: 'warn' },
        { value: '50mg ✅ أعلى', type: 'best' },
        { value: '✅', type: 'best' },
        { value: 'Anthocran® ✅', type: 'best' },
      ],
      price: '$59.99',
      pricePerServing: '$2.14',
      ppsType: 'b',
      score: 85,
      scoreType: 's',
      available: false,
    },
    {
      name: '🟣 Morphogen RENAL',
      cols: [
        { value: '600mg ✅', type: 'best' },
        { value: 'موجود ⚠️', type: 'mid' },
        { value: '✅', type: 'best' },
        { value: '✅', type: 'best' },
      ],
      price: '$49.99',
      pricePerServing: '$1.67',
      ppsType: 'm',
      score: 88,
      scoreType: 's',
      available: true,
    },
    {
      name: '🟣 Apollon KIDNEY',
      cols: [
        { value: '400mg ⚠️', type: 'mid' },
        { value: 'موجود ⚠️', type: 'mid' },
        { value: '❌', type: 'warn' },
        { value: '✅', type: 'best' },
      ],
      price: '$44.99',
      pricePerServing: '$1.50',
      ppsType: 'g',
      score: 65,
      scoreType: 'l',
      available: true,
    },
    {
      name: '🟣 Core KIDNEY',
      cols: [
        { value: '❌', type: 'warn' },
        { value: '❌', type: 'warn' },
        { value: '❌', type: 'warn' },
        { value: '✅', type: 'best' },
      ],
      price: '$34.99',
      pricePerServing: '$1.17',
      ppsType: 'g',
      score: 45,
      scoreType: 'l',
      available: true,
    },
  ],
};

const kidneyWinners: WinnerCard[] = [
  {
    badge: '🏆 الأفضل تركيبةً علمياً',
    name: 'Morphogen RENAL — 88/100',
    reason: 'NAC 600mg + Astragalus + Cordyceps + Cranberry = أشمل تركيبة كلوية متوفرة. NAC بجرعة فعالة مُثبَتة سريرياً.',
    citations: ['PMC8129408', 'Cochrane CKD'],
    price: '$49.99 | $1.67/حصة',
    type: 'kidney',
  },
  {
    badge: '💎 أعلى جرعة Astragaloside IV',
    name: 'Infinis KIDNEY — 85/100',
    reason: '50mg Astragaloside IV = ضعف أي منافس + Anthocran® Phytosome. لكن غياب NAC وعدم التوفر نقطة ضعف.',
    citations: ['PubMed Astragaloside'],
    price: '$59.99 | $2.14/حصة ⚠️ نفذ',
    type: 'kidney',
  },
];

export const organSections: OrganSection[] = [
  {
    id: 'liver',
    label: 'الكبد',
    icon: '🟡',
    color: '#f59e0b',
    title: 'علم مكونات دعم الكبد',
    subtitle: 'الجرعات المثلى حسب الدراسات السريرية المحكّمة',
    ingredients: liverIngredients,
    comparison: liverComparison,
    winners: liverWinners,
  },
  {
    id: 'heart',
    label: 'القلب',
    icon: '❤️',
    color: '#ef4444',
    title: 'علم مكونات دعم القلب',
    subtitle: 'الجرعات المثلى حسب الدراسات السريرية',
    ingredients: heartIngredients,
    comparison: heartComparison,
    winners: heartWinners,
  },
  {
    id: 'kidney',
    label: 'الكلى',
    icon: '🟣',
    color: '#8b5cf6',
    title: 'علم مكونات دعم الكلى',
    subtitle: 'الجرعات المثلى حسب الدراسات السريرية',
    ingredients: kidneyIngredients,
    comparison: kidneyComparison,
    winners: kidneyWinners,
  },
];

// ═══════════════ COMPARE DATA ═══════════════
export interface OverallProduct {
  name: string;
  organ: string;
  organColor: string;
  score: number;
  scoreType: 's' | 'm' | 'l';
  price: string;
  pps: string;
  ppsType: 'g' | 'm' | 'b';
  keyIngredients: string;
  available: boolean;
  badge?: string;
}

export const overallProducts: OverallProduct[] = [
  { name: 'Infinis LIVER', organ: 'الكبد 🟡', organColor: '#f59e0b', score: 96, scoreType: 's', price: '$64.99', pps: '$2.17', ppsType: 'b', keyIngredients: 'TUDCA + NAC + Siliphos® + S-Acetyl GSH', available: true, badge: '🏆' },
  { name: 'Morphogen LIVER', organ: 'الكبد 🟡', organColor: '#f59e0b', score: 91, scoreType: 's', price: '$54.99', pps: '$1.83', ppsType: 'm', keyIngredients: 'TUDCA + NAC 1200mg + Silymarin + ALA', available: true },
  { name: 'Morphogen CARDIO', organ: 'القلب ❤️', organColor: '#ef4444', score: 94, scoreType: 's', price: '$49.99', pps: '$1.67', ppsType: 'm', keyIngredients: 'CoQ10 300mg + PQQ + Omega-3 + L-Carnitine', available: true, badge: '🏆' },
  { name: 'Infinis HEART', organ: 'القلب ❤️', organColor: '#ef4444', score: 90, scoreType: 's', price: '$57.99', pps: '$1.93', ppsType: 'b', keyIngredients: 'Ubiqsome® CoQ10 + Rejuna® + GG-Gold®', available: true },
  { name: 'Morphogen RENAL', organ: 'الكلى 🟣', organColor: '#8b5cf6', score: 88, scoreType: 's', price: '$49.99', pps: '$1.67', ppsType: 'm', keyIngredients: 'NAC 600mg + Astragalus + Cordyceps + Cranberry', available: true, badge: '🏆' },
  { name: 'Infinis KIDNEY', organ: 'الكلى 🟣', organColor: '#8b5cf6', score: 85, scoreType: 's', price: '$59.99', pps: '$2.14', ppsType: 'b', keyIngredients: 'Astragaloside IV 50mg + Anthocran®', available: false },
  { name: 'Core HEART', organ: 'القلب ❤️', organColor: '#ef4444', score: 76, scoreType: 'm', price: '$39.99', pps: '$1.33', ppsType: 'g', keyIngredients: 'CoQ10 200mg + Omega-3', available: true },
  { name: 'Apollon HEART', organ: 'القلب ❤️', organColor: '#ef4444', score: 74, scoreType: 'm', price: '$44.99', pps: '$1.50', ppsType: 'g', keyIngredients: 'CoQ10 200mg + Omega-3', available: true },
  { name: 'Apollon LIVER', organ: 'الكبد 🟡', organColor: '#f59e0b', score: 72, scoreType: 'm', price: '$47.99', pps: '$1.60', ppsType: 'g', keyIngredients: 'TUDCA 250mg + NAC + Silymarin', available: true },
  { name: 'Apollon KIDNEY', organ: 'الكلى 🟣', organColor: '#8b5cf6', score: 65, scoreType: 'l', price: '$44.99', pps: '$1.50', ppsType: 'g', keyIngredients: 'NAC 400mg + Cranberry', available: true },
  { name: 'Core LIVER', organ: 'الكبد 🟡', organColor: '#f59e0b', score: 58, scoreType: 'l', price: '$39.99', pps: '$1.33', ppsType: 'g', keyIngredients: 'NAC + Silymarin', available: true },
  { name: 'Core KIDNEY', organ: 'الكلى 🟣', organColor: '#8b5cf6', score: 45, scoreType: 'l', price: '$34.99', pps: '$1.17', ppsType: 'g', keyIngredients: 'Cranberry فقط', available: true },
];
