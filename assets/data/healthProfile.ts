// ========================
// أنواع بيانات الملف الصحي
// ========================

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type HealthGoal = 'protection' | 'therapeutic' | 'sports' | 'weight_loss' | 'hormonal';
export type SupplementType = 'pill' | 'powder' | 'liquid' | 'capsule' | 'gel' | 'injection';
export type HormoneFrequency = 'daily' | 'eod' | 'twice_week' | 'weekly' | 'biweekly' | 'monthly';

// ========================
// قاعدة بيانات الأمراض المزمنة
// ========================
export const CHRONIC_DISEASES = [
  { id: 'hypertension',      label: 'ضغط الدم المرتفع',    icon: '🩺', color: '#f87171' },
  { id: 'diabetes_t1',       label: 'سكري النوع الأول',     icon: '🩸', color: '#fb923c' },
  { id: 'diabetes_t2',       label: 'سكري النوع الثاني',    icon: '🩸', color: '#fb923c' },
  { id: 'high_cholesterol',  label: 'ارتفاع الكوليسترول',   icon: '💉', color: '#fbbf24' },
  { id: 'kidney_disease',    label: 'أمراض الكلى',          icon: '🫘', color: '#a78bfa' },
  { id: 'liver_disease',     label: 'أمراض الكبد',          icon: '🫀', color: '#fbbf24' },
  { id: 'heart_disease',     label: 'أمراض القلب',          icon: '❤️', color: '#f87171' },
  { id: 'hypothyroidism',    label: 'قصور الغدة الدرقية',   icon: '🦋', color: '#34d399' },
  { id: 'hyperthyroidism',   label: 'فرط الغدة الدرقية',    icon: '🦋', color: '#34d399' },
  { id: 'adhd',              label: 'اضطراب ADHD',          icon: '🧠', color: '#60a5fa' },
  { id: 'depression',        label: 'الاكتئاب',             icon: '🧠', color: '#60a5fa' },
  { id: 'anxiety',           label: 'القلق المزمن',         icon: '🧠', color: '#60a5fa' },
  { id: 'ibs',               label: 'القولون العصبي',       icon: '🫃', color: '#4ade80' },
  { id: 'crohn',             label: 'مرض كرون',             icon: '🫃', color: '#4ade80' },
  { id: 'gerd',              label: 'الارتجاع المريئي',     icon: '🫃', color: '#4ade80' },
  { id: 'osteoporosis',      label: 'هشاشة العظام',         icon: '🦴', color: '#e5e7eb' },
  { id: 'arthritis',         label: 'التهاب المفاصل',       icon: '🦴', color: '#e5e7eb' },
  { id: 'anemia',            label: 'فقر الدم',             icon: '🩸', color: '#f87171' },
  { id: 'pcos',              label: 'تكيس المبايض',         icon: '⚕️', color: '#f472b6' },
  { id: 'sleep_apnea',       label: 'انقطاع التنفس أثناء النوم', icon: '😴', color: '#818cf8' },
  { id: 'asthma',            label: 'الربو',                icon: '🫁', color: '#38bdf8' },
  { id: 'autoimmune',        label: 'أمراض المناعة الذاتية', icon: '🛡️', color: '#fb923c' },
  { id: 'cancer',            label: 'السرطان (في مرحلة علاج)', icon: '⚕️', color: '#f87171' },
  { id: 'epilepsy',          label: 'الصرع',                icon: '🧠', color: '#60a5fa' },
];

// ========================
// قاعدة بيانات الحساسيات
// ========================
export const ALLERGIES = [
  { id: 'lactose',     label: 'حساسية اللاكتوز',       icon: '🥛', color: '#fbbf24' },
  { id: 'gluten',      label: 'حساسية الجلوتين',        icon: '🌾', color: '#fb923c' },
  { id: 'nuts',        label: 'حساسية المكسرات',        icon: '🥜', color: '#a16207' },
  { id: 'shellfish',   label: 'حساسية المحار',          icon: '🦐', color: '#f87171' },
  { id: 'fish',        label: 'حساسية السمك',           icon: '🐟', color: '#38bdf8' },
  { id: 'eggs',        label: 'حساسية البيض',           icon: '🥚', color: '#fbbf24' },
  { id: 'soy',         label: 'حساسية الصويا',          icon: '🫘', color: '#4ade80' },
  { id: 'sulfa',       label: 'حساسية السلفا (دواء)',   icon: '💊', color: '#f472b6' },
  { id: 'penicillin',  label: 'حساسية البنسلين',        icon: '💊', color: '#f472b6' },
  { id: 'nsaids',      label: 'حساسية مضادات الالتهاب', icon: '💊', color: '#f472b6' },
  { id: 'iodine',      label: 'حساسية اليود',           icon: '⚗️', color: '#818cf8' },
  { id: 'latex',       label: 'حساسية اللاتكس',         icon: '🧤', color: '#a78bfa' },
  { id: 'pollen',      label: 'حساسية حبوب اللقاح',     icon: '🌸', color: '#f9a8d4' },
  { id: 'dust',        label: 'حساسية الغبار',          icon: '🌫️', color: '#9ca3af' },
  { id: 'gelatin',     label: 'حساسية الجيلاتين',       icon: '🫙', color: '#fbbf24' },
];

// ========================
// قاعدة بيانات الإصابات
// ========================
export const INJURIES = [
  { id: 'knee',        label: 'إصابة الركبة',           icon: '🦵' },
  { id: 'shoulder',    label: 'إصابة الكتف',            icon: '💪' },
  { id: 'back',        label: 'إصابة الظهر',            icon: '🦴' },
  { id: 'ankle',       label: 'إصابة الكاحل',           icon: '🦶' },
  { id: 'wrist',       label: 'إصابة الرسغ',            icon: '✋' },
  { id: 'hip',         label: 'إصابة الورك',            icon: '🦴' },
  { id: 'neck',        label: 'إصابة الرقبة',           icon: '🦴' },
  { id: 'elbow',       label: 'إصابة الكوع',            icon: '💪' },
];

// ========================
// قاعدة بيانات الهرمونات والببتيدات
// ========================
export const HORMONES_PEPTIDES = [
  // هرمونات
  { id: 'test_e',      label: 'Testosterone Enanthate',  category: 'TRT',     icon: '💉', unit: 'mg', defaultDose: 250, frequency: 'weekly' as HormoneFrequency },
  { id: 'test_c',      label: 'Testosterone Cypionate',  category: 'TRT',     icon: '💉', unit: 'mg', defaultDose: 250, frequency: 'weekly' as HormoneFrequency },
  { id: 'test_p',      label: 'Testosterone Propionate', category: 'TRT',     icon: '💉', unit: 'mg', defaultDose: 100, frequency: 'eod' as HormoneFrequency },
  { id: 'hcg',         label: 'HCG',                     category: 'TRT',     icon: '💉', unit: 'IU', defaultDose: 500, frequency: 'twice_week' as HormoneFrequency },
  { id: 'anastrozole', label: 'Anastrozole (AI)',         category: 'TRT',     icon: '💊', unit: 'mg', defaultDose: 0.5, frequency: 'eod' as HormoneFrequency },
  // ببتيدات
  { id: 'bpc157',      label: 'BPC-157',                 category: 'Peptide', icon: '🔬', unit: 'mcg', defaultDose: 250, frequency: 'daily' as HormoneFrequency },
  { id: 'tb500',       label: 'TB-500',                  category: 'Peptide', icon: '🔬', unit: 'mg',  defaultDose: 2,   frequency: 'twice_week' as HormoneFrequency },
  { id: 'ipamorelin',  label: 'Ipamorelin',              category: 'Peptide', icon: '🔬', unit: 'mcg', defaultDose: 200, frequency: 'daily' as HormoneFrequency },
  { id: 'cjc1295',     label: 'CJC-1295 DAC',            category: 'Peptide', icon: '🔬', unit: 'mg',  defaultDose: 2,   frequency: 'weekly' as HormoneFrequency },
  { id: 'igf1',        label: 'IGF-1 LR3',               category: 'Peptide', icon: '🔬', unit: 'mcg', defaultDose: 50,  frequency: 'daily' as HormoneFrequency },
  { id: 'hgh',         label: 'HGH (Growth Hormone)',    category: 'Peptide', icon: '🔬', unit: 'IU',  defaultDose: 2,   frequency: 'daily' as HormoneFrequency },
  { id: 'pt141',       label: 'PT-141',                  category: 'Peptide', icon: '🔬', unit: 'mg',  defaultDose: 1.75, frequency: 'daily' as HormoneFrequency },
  { id: 'selank',      label: 'Selank',                  category: 'Peptide', icon: '🔬', unit: 'mcg', defaultDose: 300, frequency: 'daily' as HormoneFrequency },
  // SARMs
  { id: 'rad140',      label: 'RAD-140 (Testolone)',     category: 'SARM',    icon: '⚗️', unit: 'mg', defaultDose: 10, frequency: 'daily' as HormoneFrequency },
  { id: 'ostarine',    label: 'Ostarine (MK-2866)',      category: 'SARM',    icon: '⚗️', unit: 'mg', defaultDose: 25, frequency: 'daily' as HormoneFrequency },
  { id: 'lgd4033',     label: 'LGD-4033 (Ligandrol)',    category: 'SARM',    icon: '⚗️', unit: 'mg', defaultDose: 10, frequency: 'daily' as HormoneFrequency },
  { id: 'cardarine',   label: 'Cardarine (GW-501516)',   category: 'SARM',    icon: '⚗️', unit: 'mg', defaultDose: 20, frequency: 'daily' as HormoneFrequency },
  { id: 'mk677',       label: 'MK-677 (Ibutamoren)',     category: 'SARM',    icon: '⚗️', unit: 'mg', defaultDose: 25, frequency: 'daily' as HormoneFrequency },
];

// ========================
// أنواع البيانات الرئيسية
// ========================
export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  note?: string;
}

export interface HormoneEntry {
  id: string;
  hormoneId: string;
  label: string;
  dose: number;
  unit: string;
  frequency: HormoneFrequency;
  company: string;
  startDate: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  date: string;
  values: Record<string, number>;
}

export interface HealthProfile {
  // بيانات شخصية
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  healthGoal: HealthGoal;

  // بيانات صحية
  chronicDiseases: string[];
  allergies: string[];
  injuries: string[];
  medications: Medication[];

  // هرمونات وببتيدات
  hormones: HormoneEntry[];

  // تحاليل
  labResults: LabResult[];

  // إعدادات
  language: 'ar' | 'en';
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PROFILE: HealthProfile = {
  name: '',
  age: 0,
  weight: 0,
  height: 0,
  gender: 'male',
  activityLevel: 'moderate',
  healthGoal: 'protection',
  chronicDiseases: [],
  allergies: [],
  injuries: [],
  medications: [],
  hormones: [],
  labResults: [],
  language: 'ar',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary:   'خامل (لا رياضة)',
  light:       'خفيف (1-2 أيام/أسبوع)',
  moderate:    'معتدل (3-4 أيام/أسبوع)',
  active:      'نشيط (5-6 أيام/أسبوع)',
  very_active: 'مكثف (يومياً)',
};

export const GOAL_LABELS: Record<HealthGoal, string> = {
  protection:  'حماية وقائية',
  therapeutic: 'علاجي',
  sports:      'رياضي / تحسين الأداء',
  weight_loss: 'خسارة الوزن',
  hormonal:    'دعم هرموني',
};

export const FREQUENCY_LABELS: Record<HormoneFrequency, string> = {
  daily:       'يومياً',
  eod:         'كل يومين (EOD)',
  twice_week:  'مرتين أسبوعياً',
  weekly:      'أسبوعياً',
  biweekly:    'كل أسبوعين',
  monthly:     'شهرياً',
};
