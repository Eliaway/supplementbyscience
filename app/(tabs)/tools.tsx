import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Pressable,
  FlatList, Modal, Alert
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { COLORS, FONTS, RADIUS } from '@/constants/styles';
import { organSections, overallProducts } from '@/assets/data/organData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

type Tool = 'search' | 'favorites' | 'calculator' | 'interactions' | 'labtest' | 'deficiency' | 'protocols' | 'compare' | 'inventory' | 'library' | 'schedule' | 'settings';

// ─── بيانات التعارضات ───
const INTERACTIONS: Record<string, { item: string; type: 'danger' | 'caution' | 'synergy'; note: string }[]> = {
  'TUDCA': [
    { item: 'Warfarin', type: 'caution', note: 'قد يؤثر على تخثر الدم — استشر طبيبك' },
    { item: 'NAC', type: 'synergy', note: 'تآزر ممتاز: يرفعان الجلوتاثيون معاً' },
    { item: 'Milk Thistle', type: 'synergy', note: 'حماية مضاعفة للكبد' },
  ],
  'NAC': [
    { item: 'Nitroglycerin', type: 'danger', note: 'تفاعل خطير — لا تجمع' },
    { item: 'Activated Charcoal', type: 'danger', note: 'يمتص NAC ويُلغي فعاليته' },
    { item: 'CoQ10', type: 'synergy', note: 'دعم مضاد للأكسدة متكامل' },
  ],
  'CoQ10': [
    { item: 'Statins', type: 'synergy', note: 'الستاتينات تُنضب CoQ10 — التكملة ضرورية' },
    { item: 'Warfarin', type: 'caution', note: 'قد يُقلل تأثير مضادات التخثر' },
    { item: 'Magnesium', type: 'synergy', note: 'دعم قلبي متكامل' },
  ],
  'Magnesium': [
    { item: 'Antibiotics (Quinolones)', type: 'danger', note: 'يُقلل امتصاص المضادات الحيوية' },
    { item: 'CoQ10', type: 'synergy', note: 'تآزر لصحة القلب' },
    { item: 'Zinc', type: 'caution', note: 'تنافس على الامتصاص — خذهما بفارق ساعتين' },
  ],
};

// ─── بروتوكولات الحماية ───
const PROTOCOLS = [
  {
    id: 'liver',
    title: '🟡 بروتوكول حماية الكبد الكامل',
    color: COLORS.liver,
    items: [
      { name: 'TUDCA', dose: '500 mg', timing: 'مع الطعام — صباحاً' },
      { name: 'NAC', dose: '600 mg', timing: 'على معدة فارغة — مساءً' },
      { name: 'Milk Thistle (80% Silymarin)', dose: '400 mg', timing: 'مع الطعام — ظهراً' },
      { name: 'Alpha Lipoic Acid', dose: '300 mg', timing: 'مع الطعام' },
    ],
    note: 'مثالي لمن يستخدم الأدوية أو المكملات الكثيفة أو لديه تاريخ مرضي كبدي',
  },
  {
    id: 'heart',
    title: '❤️ بروتوكول القلب الوقائي',
    color: COLORS.heart,
    items: [
      { name: 'CoQ10 (Ubiquinol)', dose: '200 mg', timing: 'مع وجبة دسمة — صباحاً' },
      { name: 'Magnesium Glycinate', dose: '400 mg', timing: 'قبل النوم' },
      { name: 'Omega-3 (EPA+DHA)', dose: '2000 mg', timing: 'مع الطعام' },
      { name: 'L-Carnitine', dose: '1000 mg', timing: 'قبل التمرين أو الصباح' },
    ],
    note: 'مثالي لمن لديه ضغط دم مرتفع أو يستخدم الستاتينات أو تاريخ عائلي لأمراض القلب',
  },
  {
    id: 'kidney',
    title: '🟣 بروتوكول حماية الكلى',
    color: COLORS.kidney,
    items: [
      { name: 'NAC', dose: '1200 mg', timing: 'مقسّمة — صباح ومساء' },
      { name: 'Astragalus', dose: '500 mg', timing: 'مع الطعام' },
      { name: 'Vitamin D3', dose: '2000 IU', timing: 'مع وجبة دسمة' },
      { name: 'Omega-3', dose: '1000 mg', timing: 'مع الطعام' },
    ],
    note: 'مثالي لمن يستخدم مسكنات الألم بكثرة أو لديه مرض السكري أو ضغط دم غير مُسيطر',
  },
];

// ─── اختبار نقص الفيتامينات ───
const DEFICIENCY_QUESTIONS = [
  { q: 'هل تشعر بتعب مزمن وإرهاق حتى بعد النوم الكافي؟', supplements: ['CoQ10', 'Iron', 'Vitamin B12', 'Magnesium'] },
  { q: 'هل تعاني من تشنجات عضلية أو رعشة في الأطراف؟', supplements: ['Magnesium', 'Potassium', 'Calcium', 'Vitamin D3'] },
  { q: 'هل لاحظت تساقطاً في الشعر أو هشاشة في الأظافر؟', supplements: ['Biotin', 'Zinc', 'Iron', 'Vitamin D3'] },
  { q: 'هل تعاني من آلام في المفاصل أو العظام؟', supplements: ['Vitamin D3', 'Omega-3', 'Glucosamine', 'Magnesium'] },
  { q: 'هل تشعر بضبابية ذهنية أو صعوبة في التركيز؟', supplements: ['Omega-3', 'Vitamin B12', 'Magnesium', 'CoQ10'] },
  { q: 'هل لديك مشاكل في الجهاز الهضمي (انتفاخ، إمساك)؟', supplements: ['Probiotics', 'Magnesium', 'Digestive Enzymes', 'Zinc'] },
  { q: 'هل تعاني من اضطرابات في النوم؟', supplements: ['Magnesium Glycinate', 'L-Theanine', 'Vitamin D3', 'Zinc'] },
  { q: 'هل تعاني من جفاف الجلد أو الشفاه المتشققة؟', supplements: ['Vitamin E', 'Omega-3', 'Vitamin A', 'Zinc'] },
];

// ─── بيانات التحاليل المخبرية ───
const LAB_RANGES = [
  { name: 'ALT (SGPT)', unit: 'U/L', min: 7, max: 56, high: 'ارتفاع ALT يشير إلى التهاب أو تلف الكبد', supplements: ['TUDCA', 'NAC', 'Milk Thistle', 'Alpha Lipoic Acid'] },
  { name: 'AST (SGOT)', unit: 'U/L', min: 10, max: 40, high: 'ارتفاع AST يشير إلى تلف الكبد أو القلب', supplements: ['TUDCA', 'NAC', 'Vitamin E'] },
  { name: 'GGT', unit: 'U/L', min: 9, max: 48, high: 'ارتفاع GGT مرتبط بأمراض الكبد والكحول', supplements: ['NAC', 'Milk Thistle', 'Alpha Lipoic Acid'] },
  { name: 'Creatinine', unit: 'mg/dL', min: 0.6, max: 1.2, high: 'ارتفاع الكرياتينين يشير إلى ضعف وظائف الكلى', supplements: ['NAC', 'Astragalus', 'Omega-3', 'Vitamin D3'] },
  { name: 'BUN', unit: 'mg/dL', min: 7, max: 20, high: 'ارتفاع BUN يشير إلى ضعف الكلى أو جفاف', supplements: ['Astragalus', 'NAC', 'Omega-3'] },
  { name: 'Cholesterol', unit: 'mg/dL', min: 0, max: 200, high: 'ارتفاع الكوليسترول يزيد خطر أمراض القلب', supplements: ['Omega-3', 'CoQ10', 'Red Yeast Rice', 'Berberine'] },
  { name: 'Triglycerides', unit: 'mg/dL', min: 0, max: 150, high: 'ارتفاع الدهون الثلاثية يرتبط بأمراض القلب والكبد الدهني', supplements: ['Omega-3', 'Berberine', 'NAC'] },
];

export default function ToolsScreen() {
  const [activeTool, setActiveTool] = useState<Tool>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState<'protect' | 'treat' | 'optimize'>('protect');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [labValues, setLabValues] = useState<Record<string, string>>({});
  const [defAnswers, setDefAnswers] = useState<boolean[]>(new Array(DEFICIENCY_QUESTIONS.length).fill(false));
  const [defResult, setDefResult] = useState<string[]>([]);
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [compareModal, setCompareModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('favorites').then(v => {
        if (v) setFavorites(JSON.parse(v));
      });
    }, [])
  );

  // ─── البحث ───
  const allIngredients = organSections.flatMap(s => s.ingredients.map(i => ({ ...i, organ: s.label })));
  const searchResults = searchQuery.length > 1
    ? allIngredients.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // ─── المفضّلة ───
  const favoriteIngredients = allIngredients.filter(i => favorites.includes(i.id));
  const removeFavorite = async (id: string) => {
    const updated = favorites.filter(f => f !== id);
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  // ─── الحاسبة ───
  const calcDoses = () => {
    if (!weight) return null;
    const w = parseFloat(weight);
    if (isNaN(w) || w < 30 || w > 250) return null;
    const multiplier = goal === 'protect' ? 1 : goal === 'treat' ? 1.5 : 1.2;
    return [
      { name: 'TUDCA', dose: Math.round(500 * multiplier) + ' mg/يوم', note: 'مع الطعام' },
      { name: 'NAC', dose: Math.round(600 * multiplier) + ' mg/يوم', note: 'على معدة فارغة' },
      { name: 'CoQ10 (Ubiquinol)', dose: Math.round(200 * multiplier) + ' mg/يوم', note: 'مع وجبة دسمة' },
      { name: 'Magnesium Glycinate', dose: Math.round(w * 5) + ' mg/يوم', note: 'قبل النوم' },
      { name: 'Omega-3', dose: Math.round(2000 * multiplier) + ' mg/يوم', note: 'مع الطعام' },
    ];
  };

  // ─── التعارضات ───
  const toggleIngredient = (name: string) => {
    setSelectedIngredients(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };
  const interactionResults = selectedIngredients.flatMap(ing =>
    (INTERACTIONS[ing] || []).map(i => ({ from: ing, ...i }))
  );

  // ─── التحاليل ───
  const labResults = LAB_RANGES.map(lab => {
    const val = parseFloat(labValues[lab.name] || '');
    if (isNaN(val)) return null;
    const status = val > lab.max ? 'high' : val < lab.min ? 'low' : 'normal';
    return { ...lab, val, status };
  }).filter(Boolean);

  // ─── اختبار النقص ───
  const runDeficiencyTest = () => {
    const scoreMap: Record<string, number> = {};
    defAnswers.forEach((ans, i) => {
      if (ans) {
        DEFICIENCY_QUESTIONS[i].supplements.forEach(s => {
          scoreMap[s] = (scoreMap[s] || 0) + 1;
        });
      }
    });
    const sorted = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s]) => s);
    setDefResult(sorted);
  };

  // ─── مقارنة مباشرة ───
  const allProductNames = overallProducts.map(p => p.name);
  const prodA = overallProducts.find(p => p.name === compareA);
  const prodB = overallProducts.find(p => p.name === compareB);

  const TOOL_BUTTONS: { id: Tool; label: string; emoji: string; color: string }[] = [
    { id: 'search', label: 'بحث', emoji: '🔍', color: COLORS.blue },
    { id: 'favorites', label: 'مفضّلة', emoji: '⭐', color: COLORS.warning },
    { id: 'calculator', label: 'حاسبة', emoji: '🧮', color: COLORS.success },
    { id: 'interactions', label: 'تعارضات', emoji: '⚠️', color: COLORS.error },
    { id: 'labtest', label: 'تحاليل', emoji: '🧬', color: COLORS.kidney },
    { id: 'deficiency', label: 'اختبار نقص', emoji: '🩺', color: COLORS.liver },
    { id: 'protocols', label: 'بروتوكولات', emoji: '📋', color: COLORS.heart },
    { id: 'compare',   label: 'مقارنة',  emoji: '⚖️', color: COLORS.compare },
    { id: 'inventory', label: 'مخزوني',  emoji: '💊', color: COLORS.liver },
    { id: 'library',   label: 'مكتبة',   emoji: '📚', color: COLORS.kidney },
    { id: 'schedule',  label: 'جدولي',   emoji: '📅', color: COLORS.heart },
    { id: 'settings',  label: 'إعدادات', emoji: '⚙️', color: COLORS.blue },
  ];

  return (
    <View style={styles.rootContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛠️ أدوات علمية</Text>
        <Text style={styles.headerSub}>حاسبة • تعارضات • تحاليل • بروتوكولات</Text>
      </View>

      {/* Tool Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolBar} contentContainerStyle={styles.toolBarContent}>
        {TOOL_BUTTONS.map(btn => (
          <Pressable
            key={btn.id}
            style={[styles.toolBtn, activeTool === btn.id && { backgroundColor: btn.color + '22', borderColor: btn.color }]}
            onPress={() => setActiveTool(btn.id)}
          >
            <Text style={styles.toolEmoji}>{btn.emoji}</Text>
            <Text style={[styles.toolLabel, activeTool === btn.id && { color: btn.color }]}>{btn.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

        {/* ─── مخزون ─── */}
        {activeTool === 'inventory' && (
          <InventoryEmbed />
        )}
        {/* ─── مكتبة ─── */}
        {activeTool === 'library' && (
          <LibraryEmbed />
        )}
        {/* ─── جدول ─── */}
        {activeTool === 'schedule' && (
          <ScheduleEmbed />
        )}
        {/* ─── إعدادات ─── */}
        {activeTool === 'settings' && (
          <SettingsEmbed />
        )}
        {/* ─── بحث ─── */}
        {activeTool === 'search' && (
          <View>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن مكوّن أو منتج أو حالة صحية..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
            />
            {searchQuery.length > 1 && searchResults.length === 0 && (
              <Text style={styles.emptyText}>لا توجد نتائج لـ "{searchQuery}"</Text>
            )}
            {searchResults.map(ing => (
              <View key={ing.id} style={styles.searchResult}>
                <Text style={styles.searchResultIcon}>{ing.icon}</Text>
                <View style={styles.searchResultText}>
                  <Text style={styles.searchResultName}>{ing.name}</Text>
                  <Text style={styles.searchResultOrgan}>{ing.organ} — {ing.role}</Text>
                  <Text style={styles.searchResultDesc} numberOfLines={2}>{ing.description}</Text>
                </View>
              </View>
            ))}
            {searchQuery.length === 0 && (
              <View style={styles.searchHint}>
                <Text style={styles.searchHintIcon}>🔍</Text>
                <Text style={styles.searchHintText}>ابحث عن أي مكوّن علمي عبر جميع الأعضاء</Text>
                <Text style={styles.searchHintSub}>مثال: TUDCA، CoQ10، Magnesium، كبد، قلب...</Text>
              </View>
            )}
          </View>
        )}

        {/* ─── مفضّلة ─── */}
        {activeTool === 'favorites' && (
          <View>
            <Text style={styles.sectionTitle}>⭐ مكوّناتك المفضّلة</Text>
            {favoriteIngredients.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>☆</Text>
                <Text style={styles.emptyText}>لا توجد مفضّلات بعد</Text>
                <Text style={styles.emptySub}>اضغط ☆ على أي مكوّن في شاشات الأعضاء لإضافته</Text>
              </View>
            ) : (
              favoriteIngredients.map(ing => (
                <View key={ing.id} style={styles.favItem}>
                  <Text style={styles.favIcon}>{ing.icon}</Text>
                  <View style={styles.favText}>
                    <Text style={styles.favName}>{ing.name}</Text>
                    <Text style={styles.favRole}>{ing.role}</Text>
                    <Text style={styles.favOrgan}>{ing.organ}</Text>
                  </View>
                  <Pressable style={styles.removeBtn} onPress={() => removeFavorite(ing.id)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        )}

        {/* ─── حاسبة ─── */}
        {activeTool === 'calculator' && (
          <View>
            <Text style={styles.sectionTitle}>🧮 حاسبة البروتوكول الشخصي</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>وزنك بالكيلوغرام</Text>
              <TextInput
                style={styles.numInput}
                placeholder="مثال: 80"
                placeholderTextColor={COLORS.textMuted}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>هدفك الصحي</Text>
              <View style={styles.goalRow}>
                {([['protect', '🛡️ حماية وقائية'], ['treat', '💊 علاجي مكثّف'], ['optimize', '⚡ تحسين الأداء']] as const).map(([g, label]) => (
                  <Pressable
                    key={g}
                    style={[styles.goalBtn, goal === g && styles.goalBtnActive]}
                    onPress={() => setGoal(g)}
                  >
                    <Text style={[styles.goalBtnText, goal === g && { color: COLORS.success }]}>{label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            {calcDoses() ? (
              <View style={styles.calcResults}>
                <Text style={styles.calcResultTitle}>✅ بروتوكولك المخصّص</Text>
                {calcDoses()!.map((d, i) => (
                  <View key={i} style={styles.calcRow}>
                    <Text style={styles.calcNote}>{d.note}</Text>
                    <View style={styles.calcRight}>
                      <Text style={styles.calcDose}>{d.dose}</Text>
                      <Text style={styles.calcName}>{d.name}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>أدخل وزنك لحساب الجرعات المثلى</Text>
              </View>
            )}
          </View>
        )}

        {/* ─── تعارضات ─── */}
        {activeTool === 'interactions' && (
          <View>
            <Text style={styles.sectionTitle}>⚠️ مدقّق التعارضات الدوائية</Text>
            <Text style={styles.subTitle}>اختر المكملات التي تستخدمها:</Text>
            <View style={styles.chipRow}>
              {Object.keys(INTERACTIONS).map(name => (
                <Pressable
                  key={name}
                  style={[styles.chip, selectedIngredients.includes(name) && styles.chipActive]}
                  onPress={() => toggleIngredient(name)}
                >
                  <Text style={[styles.chipText, selectedIngredients.includes(name) && { color: COLORS.blue }]}>{name}</Text>
                </Pressable>
              ))}
            </View>
            {interactionResults.length > 0 && (
              <View style={styles.interactionList}>
                {interactionResults.map((r, i) => (
                  <View key={i} style={[styles.interactionItem, {
                    borderLeftColor: r.type === 'danger' ? COLORS.error : r.type === 'caution' ? COLORS.warning : COLORS.success,
                    backgroundColor: r.type === 'danger' ? COLORS.errorBg : r.type === 'caution' ? COLORS.warningBg : COLORS.successBg,
                  }]}>
                    <Text style={styles.interactionHeader}>
                      {r.type === 'danger' ? '🚫' : r.type === 'caution' ? '⚠️' : '✅'} {r.from} + {r.item}
                    </Text>
                    <Text style={styles.interactionNote}>{r.note}</Text>
                  </View>
                ))}
              </View>
            )}
            {selectedIngredients.length > 0 && interactionResults.length === 0 && (
              <View style={styles.safeBox}>
                <Text style={styles.safeText}>✅ لا تعارضات معروفة بين المكملات المختارة</Text>
              </View>
            )}
          </View>
        )}

        {/* ─── تحاليل ─── */}
        {activeTool === 'labtest' && (
          <View>
            <Text style={styles.sectionTitle}>🧬 تحليل نتائجك المخبرية</Text>
            <Text style={styles.subTitle}>أدخل قيم تحاليلك للحصول على توصيات مخصّصة:</Text>
            {LAB_RANGES.map(lab => (
              <View key={lab.name} style={styles.labRow}>
                <View style={styles.labLeft}>
                  <Text style={styles.labName}>{lab.name}</Text>
                  <Text style={styles.labRange}>المعدل: {lab.min}–{lab.max} {lab.unit}</Text>
                </View>
                <TextInput
                  style={styles.labInput}
                  placeholder="القيمة"
                  placeholderTextColor={COLORS.textMuted}
                  value={labValues[lab.name] || ''}
                  onChangeText={v => setLabValues(prev => ({ ...prev, [lab.name]: v }))}
                  keyboardType="numeric"
                  textAlign="center"
                />
              </View>
            ))}
            {labResults.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.calcResultTitle}>📊 نتائج التحليل</Text>
                {labResults.map((r: any, i) => (
                  <View key={i} style={[styles.labResult, {
                    borderLeftColor: r.status === 'high' ? COLORS.error : r.status === 'low' ? COLORS.warning : COLORS.success,
                    backgroundColor: r.status === 'high' ? COLORS.errorBg : r.status === 'low' ? COLORS.warningBg : COLORS.successBg,
                  }]}>
                    <Text style={styles.labResultName}>
                      {r.status === 'high' ? '🔴' : r.status === 'low' ? '🟡' : '🟢'} {r.name}: {r.val} {r.unit}
                    </Text>
                    {r.status !== 'normal' && (
                      <>
                        <Text style={styles.labResultNote}>{r.high}</Text>
                        <Text style={styles.labResultSupps}>المكملات الموصى بها: {r.supplements.join(' • ')}</Text>
                      </>
                    )}
                    {r.status === 'normal' && <Text style={styles.labResultNormal}>ضمن المعدل الطبيعي ✅</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ─── اختبار النقص ─── */}
        {activeTool === 'deficiency' && (
          <View>
            <Text style={styles.sectionTitle}>🩺 اختبار نقص المكملات</Text>
            <Text style={styles.subTitle}>أجب بصدق لتحديد المكملات التي قد تحتاجها:</Text>
            {DEFICIENCY_QUESTIONS.map((q, i) => (
              <Pressable
                key={i}
                style={[styles.defQuestion, defAnswers[i] && styles.defQuestionActive]}
                onPress={() => {
                  const updated = [...defAnswers];
                  updated[i] = !updated[i];
                  setDefAnswers(updated);
                  setDefResult([]);
                }}
              >
                <Text style={[styles.defCheck, defAnswers[i] && { color: COLORS.success }]}>
                  {defAnswers[i] ? '✅' : '⬜'}
                </Text>
                <Text style={styles.defText}>{q.q}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.runBtn} onPress={runDeficiencyTest}>
              <Text style={styles.runBtnText}>🔍 تحليل النتائج</Text>
            </Pressable>
            {defResult.length > 0 && (
              <View style={styles.defResults}>
                <Text style={styles.calcResultTitle}>🎯 المكملات الموصى بها لك</Text>
                {defResult.map((s, i) => (
                  <View key={i} style={styles.defResultItem}>
                    <Text style={styles.defResultRank}>#{i + 1}</Text>
                    <Text style={styles.defResultName}>{s}</Text>
                  </View>
                ))}
                <Text style={styles.defDisclaimer}>⚠️ هذا الاختبار للتوعية فقط — استشر طبيبك قبل البدء</Text>
              </View>
            )}
          </View>
        )}

        {/* ─── بروتوكولات ─── */}
        {activeTool === 'protocols' && (
          <View>
            <Text style={styles.sectionTitle}>📋 بروتوكولات الحماية الجاهزة</Text>
            {PROTOCOLS.map(p => (
              <View key={p.id} style={[styles.protocolCard, { borderTopColor: p.color }]}>
                <Text style={[styles.protocolTitle, { color: p.color }]}>{p.title}</Text>
                {p.items.map((item, i) => (
                  <View key={i} style={styles.protocolItem}>
                    <Text style={styles.protocolTiming}>{item.timing}</Text>
                    <View style={styles.protocolRight}>
                      <Text style={styles.protocolDose}>{item.dose}</Text>
                      <Text style={styles.protocolName}>{item.name}</Text>
                    </View>
                  </View>
                ))}
                <View style={styles.protocolNote}>
                  <Text style={styles.protocolNoteText}>💡 {p.note}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ─── مقارنة مباشرة ─── */}
        {activeTool === 'compare' && (
          <View>
            <Text style={styles.sectionTitle}>⚖️ مقارنة مباشرة بين منتجَين</Text>
            <View style={styles.compareSelectors}>
              <View style={styles.compareSelector}>
                <Text style={styles.compareSelectorLabel}>المنتج الأول</Text>
                <ScrollView style={styles.productList} nestedScrollEnabled>
                  {allProductNames.map(name => (
                    <Pressable
                      key={name}
                      style={[styles.productItem, compareA === name && styles.productItemActive]}
                      onPress={() => setCompareA(name)}
                    >
                      <Text style={[styles.productItemText, compareA === name && { color: COLORS.blue }]} numberOfLines={2}>{name}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.compareSelector}>
                <Text style={styles.compareSelectorLabel}>المنتج الثاني</Text>
                <ScrollView style={styles.productList} nestedScrollEnabled>
                  {allProductNames.map(name => (
                    <Pressable
                      key={name}
                      style={[styles.productItem, compareB === name && styles.productItemActive]}
                      onPress={() => setCompareB(name)}
                    >
                      <Text style={[styles.productItemText, compareB === name && { color: COLORS.compare }]} numberOfLines={2}>{name}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
            {prodA && prodB && (
              <View style={styles.compareResult}>
                <View style={styles.compareCol}>
                  <Text style={[styles.compareProductName, { color: COLORS.blue }]}>{prodA.name}</Text>
                  <Text style={styles.compareScore}>التقييم: {prodA.score}/100</Text>
                  <Text style={styles.compareOrgan}>{prodA.organ}</Text>
                </View>
                <Text style={styles.compareVs}>VS</Text>
                <View style={styles.compareCol}>
                  <Text style={[styles.compareProductName, { color: COLORS.compare }]}>{prodB.name}</Text>
                  <Text style={styles.compareScore}>التقييم: {prodB.score}/100</Text>
                  <Text style={styles.compareOrgan}>{prodB.organ}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#111111',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.tools,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, fontFamily: FONTS.black, textAlign: 'center' },
  headerSub: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'center', marginTop: 3 },
  toolBar: { maxHeight: 70, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  toolBarContent: { padding: 10, gap: 8, flexDirection: 'row', alignItems: 'center' },
  toolBtn: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
    minWidth: 60,
  },
  toolEmoji: { fontSize: 18 },
  toolLabel: { fontSize: 10, color: COLORS.textMuted, fontFamily: FONTS.regular, marginTop: 2 },
  body: { flex: 1 },
  bodyContent: { padding: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, fontFamily: FONTS.black, textAlign: 'right', marginBottom: 12 },
  subTitle: { fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'right', marginBottom: 10 },
  searchInput: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    marginBottom: 12,
  },
  searchResult: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    alignItems: 'flex-start',
  },
  searchResultIcon: { fontSize: 24 },
  searchResultText: { flex: 1, alignItems: 'flex-end' },
  searchResultName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right' },
  searchResultOrgan: { fontSize: 11, color: COLORS.blue, fontFamily: FONTS.regular, textAlign: 'right', marginTop: 2 },
  searchResultDesc: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'right', marginTop: 4, lineHeight: 18 },
  searchHint: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  searchHintIcon: { fontSize: 48 },
  searchHintText: { fontSize: 15, color: COLORS.textSecondary, fontFamily: FONTS.bold, textAlign: 'center' },
  searchHintSub: { fontSize: 12, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'center' },
  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyIcon: { fontSize: 48, color: COLORS.textMuted },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'center' },
  emptySub: { fontSize: 12, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'center' },
  favItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    gap: 10,
  },
  favIcon: { fontSize: 24 },
  favText: { flex: 1, alignItems: 'flex-end' },
  favName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right' },
  favRole: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'right', marginTop: 2 },
  favOrgan: { fontSize: 11, color: COLORS.blue, fontFamily: FONTS.regular, textAlign: 'right', marginTop: 2 },
  removeBtn: { padding: 6, backgroundColor: COLORS.errorBg, borderRadius: RADIUS.sm },
  removeBtnText: { fontSize: 12, color: COLORS.error, fontWeight: '700' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.bold, textAlign: 'right', marginBottom: 8 },
  numInput: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
  },
  goalRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  goalBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  goalBtnActive: { borderColor: COLORS.success, backgroundColor: COLORS.successBg },
  goalBtnText: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  calcResults: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  calcResultTitle: { fontSize: 14, fontWeight: '700', color: COLORS.success, fontFamily: FONTS.bold, textAlign: 'right', marginBottom: 12 },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  calcRight: { alignItems: 'flex-end' },
  calcName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right' },
  calcDose: { fontSize: 13, color: COLORS.success, fontFamily: FONTS.bold, textAlign: 'right' },
  calcNote: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  chipActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  chipText: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  interactionList: { gap: 8 },
  interactionItem: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: 12,
  },
  interactionHeader: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right', marginBottom: 4 },
  interactionNote: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'right' },
  safeBox: { backgroundColor: COLORS.successBg, borderWidth: 1, borderColor: COLORS.successBorder, borderRadius: RADIUS.md, padding: 14, alignItems: 'center' },
  safeText: { fontSize: 14, color: COLORS.success, fontFamily: FONTS.bold, textAlign: 'center' },
  labRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 8,
  },
  labLeft: { flex: 1, alignItems: 'flex-end' },
  labName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right' },
  labRange: { fontSize: 10, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'right', marginTop: 2 },
  labInput: {
    width: 80,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 8,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    marginLeft: 10,
  },
  labResult: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: 12,
    marginBottom: 8,
  },
  labResultName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right', marginBottom: 4 },
  labResultNote: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'right', marginBottom: 4 },
  labResultSupps: { fontSize: 11, color: COLORS.blue, fontFamily: FONTS.bold, textAlign: 'right' },
  labResultNormal: { fontSize: 12, color: COLORS.success, fontFamily: FONTS.regular, textAlign: 'right' },
  defQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  defQuestionActive: { borderColor: COLORS.success, backgroundColor: COLORS.successBg },
  defCheck: { fontSize: 20, color: COLORS.textMuted },
  defText: { flex: 1, fontSize: 13, color: COLORS.textPrimary, fontFamily: FONTS.regular, textAlign: 'right', lineHeight: 20 },
  runBtn: {
    backgroundColor: COLORS.blue,
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  runBtnText: { fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: FONTS.bold },
  defResults: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  defResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  defResultRank: { fontSize: 16, fontWeight: '900', color: COLORS.warning, fontFamily: FONTS.black, width: 30, textAlign: 'center' },
  defResultName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold },
  defDisclaimer: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'center', marginTop: 12 },
  protocolCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 3,
    padding: 14,
    marginBottom: 14,
  },
  protocolTitle: { fontSize: 15, fontWeight: '900', fontFamily: FONTS.black, textAlign: 'right', marginBottom: 12 },
  protocolItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  protocolRight: { alignItems: 'flex-end' },
  protocolName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right' },
  protocolDose: { fontSize: 12, color: COLORS.success, fontFamily: FONTS.bold, textAlign: 'right' },
  protocolTiming: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular },
  protocolNote: { marginTop: 10, backgroundColor: COLORS.warningBg, borderRadius: RADIUS.sm, padding: 8 },
  protocolNoteText: { fontSize: 12, color: COLORS.warning, fontFamily: FONTS.regular, textAlign: 'right', lineHeight: 18 },
  compareSelectors: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  compareSelector: { flex: 1 },
  compareSelectorLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, fontFamily: FONTS.bold, textAlign: 'center', marginBottom: 8 },
  productList: { maxHeight: 200, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  productItem: { padding: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  productItemActive: { backgroundColor: COLORS.blueBg },
  productItemText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'center' },
  compareResult: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    alignItems: 'center',
    gap: 10,
  },
  compareCol: { flex: 1, alignItems: 'center', gap: 4 },
  compareProductName: { fontSize: 13, fontWeight: '700', fontFamily: FONTS.bold, textAlign: 'center' },
  compareScore: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'center' },
  compareOrgan: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'center' },
  compareVs: { fontSize: 18, fontWeight: '900', color: COLORS.textMuted, fontFamily: FONTS.black },
});

// ─── مكونات مدمجة للشاشات الإضافية ───────────────────────────────────────────

function InventoryEmbed() {
  const Inventory = require('./inventory').default;
  return <Inventory embedded />;
}

function LibraryEmbed() {
  const Library = require('./library').default;
  return <Library embedded />;
}

function ScheduleEmbed() {
  const Schedule = require('./schedule').default;
  return <Schedule embedded />;
}

function SettingsEmbed() {
  const Settings = require('./settings').default;
  return <Settings embedded />;
}
