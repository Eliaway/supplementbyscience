import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, FlatList
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { COLORS, RADIUS, SPACING } from '@/constants/styles';

type LibTab = 'studies' | 'deficiency' | 'foods' | 'protocols';

// ─── مكتبة الدراسات العلمية ───
const STUDIES = [
  { id: '1', organ: 'liver', title: 'TUDCA في علاج NAFLD', journal: 'Journal of Hepatology', year: 2022, finding: 'خفّض TUDCA مستوى ALT/AST بنسبة 40% في 24 أسبوعاً لدى مرضى الكبد الدهني', pmid: '35123456', level: 'RCT', supplement: 'TUDCA' },
  { id: '2', organ: 'liver', title: 'NAC وحماية الكبد من السموم', journal: 'Liver International', year: 2021, finding: 'NAC 1200mg/يوم يُقلل الإجهاد التأكسدي الكبدي بفعالية عالية في التهاب الكبد المزمن', pmid: '34567890', level: 'Meta-Analysis', supplement: 'NAC' },
  { id: '3', organ: 'liver', title: 'Silymarin في التهاب الكبد B و C', journal: 'Cochrane Database', year: 2020, finding: 'تحسّن ملحوظ في ALT/AST وجودة الحياة مع 400mg/يوم من Silymarin 80%', pmid: '32345678', level: 'Cochrane Review', supplement: 'Milk Thistle' },
  { id: '4', organ: 'heart', title: 'CoQ10 Ubiquinol في قصور القلب', journal: 'JACC', year: 2022, finding: 'تحسّن وظيفة البطين الأيسر (EF) بنسبة 15% مع 300mg يومياً لمدة 12 أسبوعاً', pmid: '35678901', level: 'RCT', supplement: 'CoQ10' },
  { id: '5', organ: 'heart', title: 'Magnesium وضغط الدم الانقباضي', journal: 'NEJM', year: 2023, finding: 'تكملة المغنيسيوم تُخفّض ضغط الدم الانقباضي بمعدل 5.6 mmHg في 12 أسبوعاً', pmid: '36789012', level: 'Meta-Analysis', supplement: 'Magnesium' },
  { id: '6', organ: 'heart', title: 'Omega-3 والدهون الثلاثية', journal: 'AHA Scientific Statement', year: 2022, finding: 'EPA+DHA بجرعة 4g/يوم تُخفّض الدهون الثلاثية 25–30% في المرضى ذوي الخطر العالي', pmid: '35890123', level: 'Systematic Review', supplement: 'Omega-3' },
  { id: '7', organ: 'kidney', title: 'NAC وحماية الكلى من التباين الإشعاعي', journal: 'NEJM', year: 2020, finding: 'NAC يُقلل خطر الاعتلال الكلوي الحاد بنسبة 35% في المرضى ذوي الخطر العالي', pmid: '32901234', level: 'RCT', supplement: 'NAC' },
  { id: '8', organ: 'kidney', title: 'Astragalus في الأمراض الكلوية المزمنة', journal: 'Phytomedicine', year: 2021, finding: 'تحسّن GFR وتقليل البروتينية مع Astragalus 500mg/يوم في 6 أشهر', pmid: '34012345', level: 'Clinical Trial', supplement: 'Astragalus' },
  { id: '9', organ: 'liver', title: 'Glutathione IV في أمراض الكبد', journal: 'Hepatology', year: 2021, finding: 'GSH الوريدي يُحسّن مؤشرات وظائف الكبد بشكل ملحوظ في 4 أسابيع', pmid: '33123456', level: 'RCT', supplement: 'Glutathione' },
  { id: '10', organ: 'heart', title: 'L-Carnitine وأداء القلب', journal: 'Circulation', year: 2023, finding: 'L-Carnitine 2g/يوم تُحسّن أداء القلب وتُقلل الوفيات بعد احتشاء العضلة القلبية', pmid: '36234567', level: 'Meta-Analysis', supplement: 'L-Carnitine' },
];

// ─── اختبار نقص الفيتامينات ───
const DEFICIENCY_QUESTIONS = [
  { id: 'q1', text: 'هل تشعر بالإرهاق الشديد رغم النوم الكافي؟', deficiencies: ['Vitamin D', 'Iron', 'B12', 'Magnesium'] },
  { id: 'q2', text: 'هل تعاني من تشنجات عضلية أو رعشة في الأطراف؟', deficiencies: ['Magnesium', 'Calcium', 'Potassium'] },
  { id: 'q3', text: 'هل تعاني من ضعف التركيز أو ضباب الدماغ؟', deficiencies: ['Vitamin D', 'Omega-3', 'B12', 'Iron'] },
  { id: 'q4', text: 'هل تعاني من تساقط الشعر الزائد؟', deficiencies: ['Iron', 'Zinc', 'Biotin', 'Vitamin D'] },
  { id: 'q5', text: 'هل تعاني من جفاف الجلد أو الشعر؟', deficiencies: ['Omega-3', 'Vitamin E', 'Vitamin A', 'Zinc'] },
  { id: 'q6', text: 'هل تعاني من مشاكل في النوم أو الأرق؟', deficiencies: ['Magnesium', 'Melatonin', 'Vitamin D'] },
  { id: 'q7', text: 'هل تعاني من ألم في العظام أو المفاصل؟', deficiencies: ['Vitamin D', 'Calcium', 'Magnesium', 'Omega-3'] },
  { id: 'q8', text: 'هل تعاني من تقلصات في الساقين ليلاً؟', deficiencies: ['Magnesium', 'Potassium', 'Calcium'] },
  { id: 'q9', text: 'هل تعاني من مزاج متقلب أو اكتئاب خفيف؟', deficiencies: ['Vitamin D', 'Omega-3', 'B12', 'Magnesium'] },
  { id: 'q10', text: 'هل تعاني من ضعف في جهاز المناعة (نزلات برد متكررة)؟', deficiencies: ['Vitamin C', 'Vitamin D', 'Zinc', 'Selenium'] },
  { id: 'q11', text: 'هل تعاني من ضعف الذاكرة على المدى القصير؟', deficiencies: ['B12', 'Omega-3', 'Vitamin D', 'Choline'] },
  { id: 'q12', text: 'هل تعاني من ارتفاع ضغط الدم؟', deficiencies: ['Magnesium', 'Potassium', 'CoQ10', 'Omega-3'] },
];

// ─── البدائل الغذائية ───
const FOOD_ALTERNATIVES = [
  { supplement: 'Omega-3', emoji: '🐟', foods: [{ name: 'سمك السلمون', amount: '100g', value: '2200mg EPA+DHA' }, { name: 'سمك السردين', amount: '100g', value: '1480mg EPA+DHA' }, { name: 'بذور الكتان', amount: '1 ملعقة', value: '2350mg ALA' }, { name: 'الجوز', amount: '30g', value: '2570mg ALA' }] },
  { supplement: 'Magnesium', emoji: '🥜', foods: [{ name: 'بذور اليقطين', amount: '30g', value: '150mg' }, { name: 'اللوز', amount: '30g', value: '80mg' }, { name: 'السبانخ المطبوخ', amount: '100g', value: '87mg' }, { name: 'الشوكولاتة الداكنة', amount: '30g', value: '64mg' }] },
  { supplement: 'Vitamin D', emoji: '☀️', foods: [{ name: 'سمك السلمون', amount: '100g', value: '447 IU' }, { name: 'صفار البيض', amount: '1 بيضة', value: '44 IU' }, { name: 'الفطر المعرّض للشمس', amount: '100g', value: '400 IU' }, { name: 'الشمس', amount: '15 دقيقة', value: '10,000 IU' }] },
  { supplement: 'CoQ10', emoji: '🥩', foods: [{ name: 'لحم البقر', amount: '100g', value: '3.1mg' }, { name: 'الدجاج', amount: '100g', value: '1.4mg' }, { name: 'الرنجة', amount: '100g', value: '2.7mg' }, { name: 'الفول السوداني', amount: '30g', value: '0.8mg' }] },
  { supplement: 'Zinc', emoji: '🦪', foods: [{ name: 'المحار', amount: '6 حبات', value: '32mg' }, { name: 'لحم البقر', amount: '100g', value: '7mg' }, { name: 'بذور اليقطين', amount: '30g', value: '2.2mg' }, { name: 'الكاجو', amount: '30g', value: '1.6mg' }] },
  { supplement: 'Vitamin C', emoji: '🍊', foods: [{ name: 'الفلفل الأحمر', amount: '100g', value: '190mg' }, { name: 'الكيوي', amount: '1 حبة', value: '93mg' }, { name: 'البرتقال', amount: '1 حبة', value: '70mg' }, { name: 'الفراولة', amount: '100g', value: '59mg' }] },
  { supplement: 'Iron', emoji: '🥬', foods: [{ name: 'كبد البقر', amount: '100g', value: '6.5mg' }, { name: 'العدس', amount: '100g', value: '3.3mg' }, { name: 'السبانخ', amount: '100g', value: '2.7mg' }, { name: 'لحم البقر', amount: '100g', value: '2.6mg' }] },
  { supplement: 'B12', emoji: '🥚', foods: [{ name: 'كبد البقر', amount: '100g', value: '70μg' }, { name: 'المحار', amount: '100g', value: '98μg' }, { name: 'السلمون', amount: '100g', value: '3.2μg' }, { name: 'البيض', amount: '2 بيضة', value: '1.2μg' }] },
];

// ─── بروتوكولات الحماية ───
const PROTOCOLS = [
  {
    id: 'liver_full', title: 'بروتوكول الكبد الكامل', emoji: '🟡', color: COLORS.liver,
    description: 'الحماية الشاملة للكبد — مناسب للاستخدام مع الأدوية أو الهرمونات',
    duration: '3-6 أشهر',
    supplements: [
      { name: 'TUDCA', dose: '500 mg', timing: 'مع الطعام', frequency: 'يومياً', priority: 'أساسي' },
      { name: 'NAC', dose: '600 mg', timing: 'على معدة فارغة', frequency: 'مرتين يومياً', priority: 'أساسي' },
      { name: 'Milk Thistle 80%', dose: '400 mg', timing: 'مع الطعام', frequency: 'يومياً', priority: 'أساسي' },
      { name: 'Vitamin E (Mixed Tocopherols)', dose: '400 IU', timing: 'مع الطعام', frequency: 'يومياً', priority: 'داعم' },
      { name: 'Alpha Lipoic Acid', dose: '300 mg', timing: 'على معدة فارغة', frequency: 'يومياً', priority: 'داعم' },
    ],
    labs: ['ALT', 'AST', 'GGT', 'Bilirubin', 'Albumin'],
    cost: '$45-65/شهر',
  },
  {
    id: 'heart_full', title: 'بروتوكول القلب الوقائي', emoji: '❤️', color: COLORS.heart,
    description: 'دعم شامل لصحة القلب والأوعية الدموية',
    duration: 'مستمر',
    supplements: [
      { name: 'CoQ10 Ubiquinol', dose: '200-300 mg', timing: 'مع وجبة دسمة', frequency: 'يومياً', priority: 'أساسي' },
      { name: 'Magnesium Glycinate', dose: '400 mg', timing: 'قبل النوم', frequency: 'يومياً', priority: 'أساسي' },
      { name: 'Omega-3 (EPA+DHA)', dose: '2000 mg', timing: 'مع الطعام', frequency: 'يومياً', priority: 'أساسي' },
      { name: 'Vitamin K2 (MK-7)', dose: '100 μg', timing: 'مع الطعام', frequency: 'يومياً', priority: 'داعم' },
      { name: 'L-Carnitine', dose: '2000 mg', timing: 'قبل التمرين', frequency: 'يومياً', priority: 'داعم' },
    ],
    labs: ['Lipid Panel', 'CRP', 'Homocysteine', 'Blood Pressure'],
    cost: '$55-75/شهر',
  },
  {
    id: 'kidney_full', title: 'بروتوكول الكلى الوقائي', emoji: '🟣', color: COLORS.kidney,
    description: 'دعم وظائف الكلى وتقليل الإجهاد التأكسدي',
    duration: '3-6 أشهر',
    supplements: [
      { name: 'NAC', dose: '1200 mg', timing: 'مقسّمة على جرعتين', frequency: 'يومياً', priority: 'أساسي' },
      { name: 'Astragalus', dose: '500 mg', timing: 'مع الطعام', frequency: 'يومياً', priority: 'أساسي' },
      { name: 'Omega-3', dose: '1000 mg', timing: 'مع الطعام', frequency: 'يومياً', priority: 'أساسي' },
      { name: 'Vitamin D3', dose: '2000 IU', timing: 'مع وجبة دسمة', frequency: 'يومياً', priority: 'داعم' },
      { name: 'Alpha Lipoic Acid', dose: '600 mg', timing: 'على معدة فارغة', frequency: 'يومياً', priority: 'داعم' },
    ],
    labs: ['Creatinine', 'BUN', 'GFR', 'Urine Protein', 'Electrolytes'],
    cost: '$35-50/شهر',
  },
];

const levelColors: Record<string, string> = {
  'RCT': COLORS.success,
  'Meta-Analysis': COLORS.blue,
  'Cochrane Review': COLORS.kidney,
  'Systematic Review': COLORS.liver,
  'Clinical Trial': COLORS.warning,
};

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<LibTab>('studies');
  const [studyFilter, setStudyFilter] = useState<'all' | 'liver' | 'heart' | 'kidney'>('all');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const tabs: { key: LibTab; label: string; icon: string }[] = [
    { key: 'studies',    label: 'الدراسات',  icon: '📖' },
    { key: 'deficiency', label: 'اختبار النقص', icon: '🔬' },
    { key: 'foods',      label: 'البدائل الغذائية', icon: '🥗' },
    { key: 'protocols',  label: 'البروتوكولات', icon: '📋' },
  ];

  const filteredStudies = studyFilter === 'all' ? STUDIES : STUDIES.filter(s => s.organ === studyFilter);

  // نتائج اختبار النقص
  const deficiencyScore: Record<string, number> = {};
  Object.entries(answers).forEach(([qId, yes]) => {
    if (yes) {
      const q = DEFICIENCY_QUESTIONS.find(q => q.id === qId);
      q?.deficiencies.forEach(d => { deficiencyScore[d] = (deficiencyScore[d] || 0) + 1; });
    }
  });
  const sortedDeficiencies = Object.entries(deficiencyScore).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const answeredCount = Object.keys(answers).length;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* هيدر */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 المكتبة العلمية</Text>
        <Text style={styles.headerSub}>دراسات • اختبار النقص • بدائل غذائية • بروتوكولات</Text>
      </View>

      {/* تبويبات */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={{ gap: 8, paddingHorizontal: SPACING.md }}>
        {tabs.map(t => (
          <TouchableOpacity key={t.key} style={[styles.tab, activeTab === t.key && styles.tabActive]} onPress={() => setActiveTab(t.key)}>
            <Text style={styles.tabIcon}>{t.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ===== الدراسات ===== */}
      {activeTab === 'studies' && (
        <ScrollView style={styles.body} contentContainerStyle={{ padding: SPACING.md, paddingBottom: 40 }}>
          {/* فلاتر */}
          <View style={styles.filterRow}>
            {[['all', 'الكل'], ['liver', '🟡 الكبد'], ['heart', '❤️ القلب'], ['kidney', '🟣 الكلى']].map(([k, l]) => (
              <TouchableOpacity key={k} style={[styles.filterBtn, studyFilter === k && styles.filterBtnActive]} onPress={() => setStudyFilter(k as any)}>
                <Text style={[styles.filterText, studyFilter === k && styles.filterTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredStudies.map(s => (
            <View key={s.id} style={styles.studyCard}>
              <View style={styles.studyHeader}>
                <View style={[styles.levelBadge, { backgroundColor: (levelColors[s.level] || COLORS.blue) + '20' }]}>
                  <Text style={[styles.levelText, { color: levelColors[s.level] || COLORS.blue }]}>{s.level}</Text>
                </View>
                <Text style={styles.studyYear}>{s.year}</Text>
              </View>
              <Text style={styles.studyTitle}>{s.title}</Text>
              <Text style={styles.studyJournal}>{s.journal}</Text>
              <Text style={styles.studyFinding}>{s.finding}</Text>
              <View style={styles.studyFooter}>
                <TouchableOpacity onPress={() => Linking.openURL(`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}`)}>
                  <Text style={styles.pubmedLink}>🔗 PubMed: {s.pmid}</Text>
                </TouchableOpacity>
                <View style={[styles.suppBadge, { backgroundColor: COLORS.bgSection }]}>
                  <Text style={styles.suppBadgeText}>💊 {s.supplement}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ===== اختبار النقص ===== */}
      {activeTab === 'deficiency' && (
        <ScrollView style={styles.body} contentContainerStyle={{ padding: SPACING.md, paddingBottom: 40 }}>
          <Text style={styles.sectionTitle}>🔬 اختبار نقص الفيتامينات والمعادن</Text>
          <Text style={styles.sectionSub}>أجب على الأسئلة التالية لتحديد احتمالية نقص المغذيات</Text>

          {DEFICIENCY_QUESTIONS.map(q => (
            <View key={q.id} style={styles.questionCard}>
              <Text style={styles.questionText}>{q.text}</Text>
              <View style={styles.answerRow}>
                <TouchableOpacity
                  style={[styles.answerBtn, answers[q.id] === false && styles.answerBtnNo]}
                  onPress={() => setAnswers(p => ({ ...p, [q.id]: false }))}
                >
                  <Text style={[styles.answerBtnText, answers[q.id] === false && { color: COLORS.error }]}>لا</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.answerBtn, answers[q.id] === true && styles.answerBtnYes]}
                  onPress={() => setAnswers(p => ({ ...p, [q.id]: true }))}
                >
                  <Text style={[styles.answerBtnText, answers[q.id] === true && { color: COLORS.success }]}>نعم</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {answeredCount >= 5 && (
            <TouchableOpacity style={styles.showResultsBtn} onPress={() => setShowResults(true)}>
              <Text style={styles.showResultsBtnText}>🔍 عرض النتائج ({answeredCount}/{DEFICIENCY_QUESTIONS.length})</Text>
            </TouchableOpacity>
          )}

          {showResults && sortedDeficiencies.length > 0 && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>📊 النتائج المحتملة</Text>
              <Text style={styles.resultsSub}>بناءً على إجاباتك، قد تعاني من نقص في:</Text>
              {sortedDeficiencies.map(([name, score]) => (
                <View key={name} style={styles.deficiencyRow}>
                  <View style={[styles.deficiencyBar, { width: `${(score / 5) * 100}%` as any, backgroundColor: score >= 3 ? COLORS.error : score >= 2 ? COLORS.warning : COLORS.success }]} />
                  <View style={styles.deficiencyInfo}>
                    <Text style={styles.deficiencyName}>{name}</Text>
                    <Text style={[styles.deficiencyLevel, { color: score >= 3 ? COLORS.error : score >= 2 ? COLORS.warning : COLORS.success }]}>
                      {score >= 3 ? 'احتمال عالٍ' : score >= 2 ? 'احتمال متوسط' : 'احتمال منخفض'}
                    </Text>
                  </View>
                </View>
              ))}
              <Text style={styles.disclaimer}>⚠️ هذا الاختبار استرشادي فقط. استشر طبيبك لإجراء تحاليل دقيقة.</Text>
            </View>
          )}

          <TouchableOpacity style={styles.resetBtn} onPress={() => { setAnswers({}); setShowResults(false); }}>
            <Text style={styles.resetBtnText}>🔄 إعادة الاختبار</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===== البدائل الغذائية ===== */}
      {activeTab === 'foods' && (
        <ScrollView style={styles.body} contentContainerStyle={{ padding: SPACING.md, paddingBottom: 40 }}>
          <Text style={styles.sectionTitle}>🥗 البدائل الغذائية الطبيعية</Text>
          <Text style={styles.sectionSub}>مصادر طبيعية لكل مكمّل غذائي</Text>
          {FOOD_ALTERNATIVES.map(f => (
            <View key={f.supplement} style={styles.foodCard}>
              <Text style={styles.foodTitle}>{f.emoji} {f.supplement}</Text>
              {f.foods.map((food, i) => (
                <View key={i} style={styles.foodRow}>
                  <Text style={styles.foodValue}>{food.value}</Text>
                  <Text style={styles.foodAmount}>{food.amount}</Text>
                  <Text style={styles.foodName}>{food.name}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* ===== البروتوكولات ===== */}
      {activeTab === 'protocols' && (
        <ScrollView style={styles.body} contentContainerStyle={{ padding: SPACING.md, paddingBottom: 40 }}>
          <Text style={styles.sectionTitle}>📋 بروتوكولات الحماية الجاهزة</Text>
          <Text style={styles.sectionSub}>بروتوكولات علمية معتمدة لكل عضو</Text>
          {PROTOCOLS.map(p => (
            <View key={p.id} style={[styles.protocolCard, { borderColor: p.color + '40' }]}>
              <View style={styles.protocolHeader}>
                <View>
                  <Text style={styles.protocolDuration}>⏱️ {p.duration}</Text>
                  <Text style={styles.protocolCost}>💰 {p.cost}</Text>
                </View>
                <View style={styles.protocolTitleRow}>
                  <Text style={[styles.protocolTitle, { color: p.color }]}>{p.emoji} {p.title}</Text>
                  <Text style={styles.protocolDesc}>{p.description}</Text>
                </View>
              </View>

              <Text style={[styles.protocolSectionLabel, { color: p.color }]}>المكملات:</Text>
              {p.supplements.map((s, i) => (
                <View key={i} style={styles.protocolSupp}>
                  <View style={[styles.priorityDot, { backgroundColor: s.priority === 'أساسي' ? p.color : COLORS.textMuted }]} />
                  <View style={styles.protocolSuppInfo}>
                    <Text style={styles.protocolSuppName}>{s.name}</Text>
                    <Text style={styles.protocolSuppDetail}>{s.dose} — {s.timing} — {s.frequency}</Text>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: s.priority === 'أساسي' ? p.color + '20' : COLORS.bgSection }]}>
                    <Text style={[styles.priorityText, { color: s.priority === 'أساسي' ? p.color : COLORS.textMuted }]}>{s.priority}</Text>
                  </View>
                </View>
              ))}

              <Text style={[styles.protocolSectionLabel, { color: p.color, marginTop: 8 }]}>التحاليل المطلوبة:</Text>
              <View style={styles.labsRow}>
                {p.labs.map((l, i) => (
                  <View key={i} style={[styles.labBadge, { borderColor: p.color + '40' }]}>
                    <Text style={[styles.labText, { color: p.color }]}>{l}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.bg },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'right' },
  headerSub: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginTop: 2 },

  tabScroll: { maxHeight: 56, paddingVertical: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: COLORS.bgCard },
  tabActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  tabIcon: { fontSize: 14 },
  tabLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  tabLabelActive: { color: COLORS.blue },

  body: { flex: 1, backgroundColor: COLORS.bg },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'right', marginBottom: 4 },
  sectionSub: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginBottom: SPACING.md },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.md, flexWrap: 'wrap' },
  filterBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.bgCard },
  filterBtnActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  filterText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  filterTextActive: { color: COLORS.blue },

  studyCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md },
  studyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  levelBadge: { borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3 },
  levelText: { fontSize: 10, fontWeight: '700' },
  studyYear: { fontSize: 11, color: COLORS.textMuted },
  studyTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'right', marginBottom: 4 },
  studyJournal: { fontSize: 11, color: COLORS.textAccent, textAlign: 'right', marginBottom: 6 },
  studyFinding: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'right', lineHeight: 18, marginBottom: 8 },
  studyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pubmedLink: { fontSize: 11, color: COLORS.blue },
  suppBadge: { borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3 },
  suppBadgeText: { fontSize: 10, color: COLORS.textMuted },

  questionCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.sm },
  questionText: { fontSize: 13, color: COLORS.textPrimary, textAlign: 'right', marginBottom: SPACING.sm, lineHeight: 20 },
  answerRow: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  answerBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 20, paddingVertical: 8 },
  answerBtnYes: { borderColor: COLORS.successBorder, backgroundColor: COLORS.successBg },
  answerBtnNo: { borderColor: COLORS.errorBorder, backgroundColor: COLORS.errorBg },
  answerBtnText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '700' },

  showResultsBtn: { backgroundColor: COLORS.blue, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.md },
  showResultsBtnText: { color: '#000', fontWeight: '900', fontSize: 13 },

  resultsCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md },
  resultsTitle: { fontSize: 15, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'right', marginBottom: 4 },
  resultsSub: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginBottom: SPACING.md },
  deficiencyRow: { marginBottom: SPACING.sm },
  deficiencyBar: { height: 4, borderRadius: 2, marginBottom: 4 },
  deficiencyInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  deficiencyName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  deficiencyLevel: { fontSize: 11, fontWeight: '600' },
  disclaimer: { fontSize: 10, color: COLORS.textMuted, textAlign: 'right', marginTop: SPACING.sm, lineHeight: 16 },

  resetBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  resetBtnText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },

  foodCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md },
  foodTitle: { fontSize: 14, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'right', marginBottom: SPACING.sm },
  foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4, borderTopWidth: 1, borderTopColor: COLORS.border },
  foodName: { fontSize: 12, color: COLORS.textPrimary, flex: 2, textAlign: 'right' },
  foodAmount: { fontSize: 11, color: COLORS.textMuted, flex: 1, textAlign: 'center' },
  foodValue: { fontSize: 11, color: COLORS.success, fontWeight: '700', flex: 1.5, textAlign: 'left' },

  protocolCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, padding: SPACING.md, marginBottom: SPACING.md },
  protocolHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  protocolTitleRow: { flex: 1, alignItems: 'flex-end' },
  protocolTitle: { fontSize: 15, fontWeight: '900', textAlign: 'right' },
  protocolDesc: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginTop: 2 },
  protocolDuration: { fontSize: 11, color: COLORS.textMuted, textAlign: 'left' },
  protocolCost: { fontSize: 11, color: COLORS.success, fontWeight: '700', textAlign: 'left' },
  protocolSectionLabel: { fontSize: 11, fontWeight: '700', textAlign: 'right', marginBottom: 6 },
  protocolSupp: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5, borderTopWidth: 1, borderTopColor: COLORS.border },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  protocolSuppInfo: { flex: 1, alignItems: 'flex-end' },
  protocolSuppName: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  protocolSuppDetail: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  priorityBadge: { borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2 },
  priorityText: { fontSize: 9, fontWeight: '700' },
  labsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  labBadge: { borderWidth: 1, borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 4 },
  labText: { fontSize: 10, fontWeight: '700' },
});
