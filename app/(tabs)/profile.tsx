import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, Share
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { COLORS, RADIUS, SPACING } from '@/constants/styles';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import {
  CHRONIC_DISEASES, ALLERGIES, INJURIES, HORMONES_PEPTIDES,
  ACTIVITY_LABELS, GOAL_LABELS, FREQUENCY_LABELS,
  HormoneEntry, Medication, HealthGoal, ActivityLevel
} from '@/assets/data/healthProfile';

type Section = 'main' | 'diseases' | 'allergies' | 'injuries' | 'medications' | 'hormones' | 'labs';

export default function ProfileScreen() {
  const { profile, loading, completionPercent, updateField, toggleDisease, toggleAllergy, toggleInjury, addHormone, removeHormone, addMedication, removeMedication, exportProfileJSON } = useHealthProfile();
  const [section, setSection] = useState<Section>('main');
  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddHormone, setShowAddHormone] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [selectedHormoneId, setSelectedHormoneId] = useState('');
  const [hormoneDose, setHormoneDose] = useState('');
  const [hormoneCompany, setHormoneCompany] = useState('');
  const [hormoneFreq, setHormoneFreq] = useState<'daily'|'eod'|'twice_week'|'weekly'|'biweekly'|'monthly'>('weekly');

  if (loading) {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.blue} size="large" />
        </View>
      </View>
    );
  }

  const handleExport = async () => {
    const json = exportProfileJSON();
    await Share.share({ message: json, title: 'ملفي الصحي' });
  };

  const handleAddMed = async () => {
    if (!medName.trim()) return;
    await addMedication({
      id: Date.now().toString(),
      name: medName.trim(),
      dose: medDose.trim(),
      frequency: medFreq.trim(),
    });
    setMedName(''); setMedDose(''); setMedFreq('');
    setShowAddMed(false);
  };

  const handleAddHormone = async () => {
    if (!selectedHormoneId) return;
    const h = HORMONES_PEPTIDES.find(x => x.id === selectedHormoneId);
    if (!h) return;
    const entry: HormoneEntry = {
      id: Date.now().toString(),
      hormoneId: selectedHormoneId,
      label: h.label,
      dose: parseFloat(hormoneDose) || h.defaultDose,
      unit: h.unit,
      frequency: hormoneFreq,
      company: hormoneCompany.trim() || 'غير محدد',
      startDate: new Date().toISOString().split('T')[0],
    };
    await addHormone(entry);
    setSelectedHormoneId(''); setHormoneDose(''); setHormoneCompany('');
    setShowAddHormone(false);
  };

  const navItems: { key: Section; label: string; icon: string }[] = [
    { key: 'main',        label: 'الملف',     icon: '👤' },
    { key: 'diseases',    label: 'الأمراض',   icon: '🩺' },
    { key: 'allergies',   label: 'الحساسية',  icon: '⚠️' },
    { key: 'injuries',    label: 'الإصابات',  icon: '🦴' },
    { key: 'medications', label: 'الأدوية',   icon: '💊' },
    { key: 'hormones',    label: 'الهرمونات', icon: '💉' },
    { key: 'labs',        label: 'التحاليل',  icon: '🧪' },
  ];

  return (
    <View style={styles.rootContainer}>
      {/* هيدر */}
      <View style={[styles.header, { borderBottomColor: COLORS.border }]}>
        <Text style={styles.headerTitle}>👤 ملفي الصحي</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>اكتمال الملف: {completionPercent}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionPercent}%` as any }]} />
          </View>
        </View>
      </View>

      {/* شريط التنقل الداخلي */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navScroll} contentContainerStyle={styles.navContent}>
        {navItems.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[styles.navBtn, section === item.key && styles.navBtnActive]}
            onPress={() => setSection(item.key)}
          >
            <Text style={styles.navBtnIcon}>{item.icon}</Text>
            <Text style={[styles.navBtnLabel, section === item.key && styles.navBtnLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ===== الملف الرئيسي ===== */}
        {section === 'main' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>البيانات الشخصية</Text>

            {/* الاسم */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>الاسم</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={v => updateField('name', v)}
                placeholder="أدخل اسمك"
                placeholderTextColor={COLORS.textMuted}
                textAlign="right"
              />
            </View>

            {/* العمر والوزن والطول */}
            <View style={styles.row3}>
              {[
                { label: 'العمر', key: 'age' as const, unit: 'سنة' },
                { label: 'الوزن', key: 'weight' as const, unit: 'كجم' },
                { label: 'الطول', key: 'height' as const, unit: 'سم' },
              ].map(f => (
                <View key={f.key} style={styles.inputGroupSmall}>
                  <Text style={styles.inputLabel}>{f.label}</Text>
                  <TextInput
                    style={styles.inputSmall}
                    value={profile[f.key] ? String(profile[f.key]) : ''}
                    onChangeText={v => updateField(f.key, parseFloat(v) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={COLORS.textMuted}
                    textAlign="center"
                  />
                  <Text style={styles.inputUnit}>{f.unit}</Text>
                </View>
              ))}
            </View>

            {/* الجنس */}
            <Text style={styles.inputLabel}>الجنس</Text>
            <View style={styles.chipRow}>
              {[{ v: 'male', l: '👨 ذكر' }, { v: 'female', l: '👩 أنثى' }].map(g => (
                <TouchableOpacity
                  key={g.v}
                  style={[styles.chip, profile.gender === g.v && styles.chipActive]}
                  onPress={() => updateField('gender', g.v as any)}
                >
                  <Text style={[styles.chipText, profile.gender === g.v && styles.chipTextActive]}>{g.l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* مستوى النشاط */}
            <Text style={[styles.inputLabel, { marginTop: SPACING.md }]}>مستوى النشاط</Text>
            <View style={styles.chipRow}>
              {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(([k, v]) => (
                <TouchableOpacity
                  key={k}
                  style={[styles.chip, profile.activityLevel === k && styles.chipActive]}
                  onPress={() => updateField('activityLevel', k)}
                >
                  <Text style={[styles.chipText, profile.activityLevel === k && styles.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* الهدف الصحي */}
            <Text style={[styles.inputLabel, { marginTop: SPACING.md }]}>الهدف الصحي</Text>
            <View style={styles.chipRow}>
              {(Object.entries(GOAL_LABELS) as [HealthGoal, string][]).map(([k, v]) => (
                <TouchableOpacity
                  key={k}
                  style={[styles.chip, profile.healthGoal === k && styles.chipActive]}
                  onPress={() => updateField('healthGoal', k)}
                >
                  <Text style={[styles.chipText, profile.healthGoal === k && styles.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* تصدير */}
            <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
              <Text style={styles.exportBtnText}>📤 تصدير الملف الصحي</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===== الأمراض المزمنة ===== */}
        {section === 'diseases' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الأمراض المزمنة</Text>
            <Text style={styles.sectionSub}>اختر جميع الأمراض التي تعاني منها</Text>
            <View style={styles.tagGrid}>
              {CHRONIC_DISEASES.map(d => {
                const active = profile.chronicDiseases.includes(d.id);
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.tagItem, active && { borderColor: d.color, backgroundColor: d.color + '18' }]}
                    onPress={() => toggleDisease(d.id)}
                  >
                    <Text style={styles.tagIcon}>{d.icon}</Text>
                    <Text style={[styles.tagLabel, active && { color: d.color }]}>{d.label}</Text>
                    {active && <Text style={[styles.tagCheck, { color: d.color }]}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
            {profile.chronicDiseases.length > 0 && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>✅ المحدّد ({profile.chronicDiseases.length})</Text>
                <Text style={styles.summaryText}>
                  {profile.chronicDiseases.map(id => CHRONIC_DISEASES.find(d => d.id === id)?.label).filter(Boolean).join(' • ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ===== الحساسيات ===== */}
        {section === 'allergies' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الحساسيات</Text>
            <Text style={styles.sectionSub}>اختر جميع الحساسيات التي تعاني منها</Text>
            <View style={styles.tagGrid}>
              {ALLERGIES.map(a => {
                const active = profile.allergies.includes(a.id);
                return (
                  <TouchableOpacity
                    key={a.id}
                    style={[styles.tagItem, active && { borderColor: a.color, backgroundColor: a.color + '18' }]}
                    onPress={() => toggleAllergy(a.id)}
                  >
                    <Text style={styles.tagIcon}>{a.icon}</Text>
                    <Text style={[styles.tagLabel, active && { color: a.color }]}>{a.label}</Text>
                    {active && <Text style={[styles.tagCheck, { color: a.color }]}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ===== الإصابات ===== */}
        {section === 'injuries' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الإصابات</Text>
            <Text style={styles.sectionSub}>اختر الإصابات الحالية أو السابقة</Text>
            <View style={styles.tagGrid}>
              {INJURIES.map(inj => {
                const active = profile.injuries.includes(inj.id);
                return (
                  <TouchableOpacity
                    key={inj.id}
                    style={[styles.tagItem, active && { borderColor: COLORS.orange, backgroundColor: COLORS.orangeBg }]}
                    onPress={() => toggleInjury(inj.id)}
                  >
                    <Text style={styles.tagIcon}>{inj.icon}</Text>
                    <Text style={[styles.tagLabel, active && { color: COLORS.orange }]}>{inj.label}</Text>
                    {active && <Text style={[styles.tagCheck, { color: COLORS.orange }]}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ===== الأدوية ===== */}
        {section === 'medications' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الأدوية الحالية</Text>
            <Text style={styles.sectionSub}>أضف الأدوية التي تتناولها حالياً</Text>

            {profile.medications.map(med => (
              <View key={med.id} style={styles.medCard}>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>💊 {med.name}</Text>
                  <Text style={styles.medDetail}>{med.dose} — {med.frequency}</Text>
                </View>
                <TouchableOpacity onPress={() => removeMedication(med.id)}>
                  <Text style={styles.removeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {showAddMed ? (
              <View style={styles.addForm}>
                <TextInput style={styles.input} value={medName} onChangeText={setMedName} placeholder="اسم الدواء" placeholderTextColor={COLORS.textMuted} textAlign="right" />
                <TextInput style={styles.input} value={medDose} onChangeText={setMedDose} placeholder="الجرعة (مثال: 20mg)" placeholderTextColor={COLORS.textMuted} textAlign="right" />
                <TextInput style={styles.input} value={medFreq} onChangeText={setMedFreq} placeholder="التكرار (مثال: يومياً)" placeholderTextColor={COLORS.textMuted} textAlign="right" />
                <View style={styles.formBtns}>
                  <TouchableOpacity style={styles.btnPrimary} onPress={handleAddMed}><Text style={styles.btnPrimaryText}>إضافة</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.btnOutline} onPress={() => setShowAddMed(false)}><Text style={styles.btnOutlineText}>إلغاء</Text></TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddMed(true)}>
                <Text style={styles.addBtnText}>+ إضافة دواء</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ===== الهرمونات والببتيدات ===== */}
        {section === 'hormones' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💉 الهرمونات والببتيدات</Text>
            <Text style={styles.sectionSub}>TRT • Peptides • SARMs</Text>

            {profile.hormones.map(h => (
              <View key={h.id} style={[styles.medCard, { borderColor: COLORS.kidneyBg + '40' }]}>
                <View style={styles.medInfo}>
                  <Text style={[styles.medName, { color: COLORS.kidney }]}>💉 {h.label}</Text>
                  <Text style={styles.medDetail}>{h.dose}{h.unit} — {FREQUENCY_LABELS[h.frequency]} — {h.company}</Text>
                </View>
                <TouchableOpacity onPress={() => removeHormone(h.id)}>
                  <Text style={styles.removeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* إضافة سريعة */}
            <Text style={[styles.inputLabel, { marginTop: SPACING.md }]}>إضافة سريعة</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['TRT', 'Peptide', 'SARM'].map(cat => (
                  <View key={cat}>
                    <Text style={[styles.inputLabel, { color: COLORS.kidney, marginBottom: 4 }]}>{cat}</Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {HORMONES_PEPTIDES.filter(h => h.category === cat).slice(0, 4).map(h => (
                        <TouchableOpacity
                          key={h.id}
                          style={[styles.chip, selectedHormoneId === h.id && { borderColor: COLORS.kidney, backgroundColor: COLORS.kidneyBg }]}
                          onPress={() => { setSelectedHormoneId(h.id); setHormoneDose(String(h.defaultDose)); }}
                        >
                          <Text style={[styles.chipText, selectedHormoneId === h.id && { color: COLORS.kidney }]}>{h.id.toUpperCase()}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {showAddHormone && selectedHormoneId && (
              <View style={styles.addForm}>
                <Text style={[styles.medName, { color: COLORS.kidney, marginBottom: 8 }]}>
                  {HORMONES_PEPTIDES.find(h => h.id === selectedHormoneId)?.label}
                </Text>
                <TextInput style={styles.input} value={hormoneDose} onChangeText={setHormoneDose} placeholder="الجرعة" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" textAlign="right" />
                <TextInput style={styles.input} value={hormoneCompany} onChangeText={setHormoneCompany} placeholder="الشركة المصنّعة" placeholderTextColor={COLORS.textMuted} textAlign="right" />
                <View style={styles.chipRow}>
                  {(['daily','eod','twice_week','weekly'] as const).map(f => (
                    <TouchableOpacity key={f} style={[styles.chip, hormoneFreq === f && { borderColor: COLORS.kidney, backgroundColor: COLORS.kidneyBg }]} onPress={() => setHormoneFreq(f)}>
                      <Text style={[styles.chipText, hormoneFreq === f && { color: COLORS.kidney }]}>{FREQUENCY_LABELS[f]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.formBtns}>
                  <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: COLORS.kidney }]} onPress={handleAddHormone}><Text style={styles.btnPrimaryText}>إضافة</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.btnOutline} onPress={() => setShowAddHormone(false)}><Text style={styles.btnOutlineText}>إلغاء</Text></TouchableOpacity>
                </View>
              </View>
            )}

            {selectedHormoneId && !showAddHormone && (
              <TouchableOpacity style={[styles.addBtn, { borderColor: COLORS.kidney }]} onPress={() => setShowAddHormone(true)}>
                <Text style={[styles.addBtnText, { color: COLORS.kidney }]}>+ إضافة {HORMONES_PEPTIDES.find(h => h.id === selectedHormoneId)?.label}</Text>
              </TouchableOpacity>
            )}

            {!selectedHormoneId && (
              <View style={[styles.summaryBox, { borderColor: COLORS.kidneyBorder }]}>
                <Text style={[styles.summaryTitle, { color: COLORS.kidney }]}>💡 اختر من القائمة أعلاه للإضافة</Text>
              </View>
            )}
          </View>
        )}

        {/* ===== التحاليل ===== */}
        {section === 'labs' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧪 تتبّع التحاليل</Text>
            <Text style={styles.sectionSub}>سجّل نتائج تحاليلك لمتابعة التحسّن</Text>

            {profile.labResults.length === 0 ? (
              <View style={[styles.summaryBox, { alignItems: 'center', paddingVertical: 32 }]}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🧪</Text>
                <Text style={styles.summaryTitle}>لا توجد نتائج بعد</Text>
                <Text style={styles.summaryText}>استخدم مساعد AI لتحليل صورة نتائج تحاليلك</Text>
              </View>
            ) : (
              profile.labResults.map((result, idx) => (
                <View key={result.id} style={styles.labCard}>
                  <Text style={styles.labDate}>📅 {result.date}</Text>
                  {Object.entries(result.values).map(([key, val]) => (
                    <View key={key} style={styles.labRow}>
                      <Text style={styles.labKey}>{key}</Text>
                      <Text style={styles.labVal}>{val}</Text>
                    </View>
                  ))}
                </View>
              ))
            )}

            <View style={[styles.summaryBox, { borderColor: COLORS.kidneyBorder }]}>
              <Text style={[styles.summaryTitle, { color: COLORS.blue }]}>💡 نصيحة</Text>
              <Text style={styles.summaryText}>اذهب إلى تبويب مساعد AI واضغط على "تحليل التحاليل" لرفع صورة نتائجك وتحليلها تلقائياً</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    backgroundColor: COLORS.bg,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'right', marginBottom: 8 },
  progressRow: { gap: 4 },
  progressLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'right' },
  progressBar: { height: 4, backgroundColor: COLORS.bgSection, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: COLORS.blue, borderRadius: 2 },

  navScroll: { backgroundColor: COLORS.bg, borderBottomWidth: 1, borderBottomColor: COLORS.border, maxHeight: 60 },
  navContent: { paddingHorizontal: SPACING.md, gap: 4, alignItems: 'center', paddingVertical: 8 },
  navBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', gap: 4 },
  navBtnActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  navBtnIcon: { fontSize: 14 },
  navBtnLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  navBtnLabelActive: { color: COLORS.blue },

  body: { flex: 1, backgroundColor: COLORS.bg },
  section: { padding: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'right', marginBottom: 4 },
  sectionSub: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginBottom: SPACING.md },

  inputGroup: { marginBottom: SPACING.md },
  inputGroupSmall: { flex: 1, alignItems: 'center' },
  inputLabel: { fontSize: 12, color: COLORS.textAccent, textAlign: 'right', marginBottom: 6, fontWeight: '700' },
  input: {
    backgroundColor: COLORS.bgInput, borderWidth: 1, borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md, padding: SPACING.md, color: COLORS.textPrimary, fontSize: 14,
    textAlign: 'right',
  },
  inputSmall: {
    backgroundColor: COLORS.bgInput, borderWidth: 1, borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md, padding: SPACING.sm, color: COLORS.textPrimary, fontSize: 16,
    fontWeight: '700', textAlign: 'center', width: '100%',
  },
  inputUnit: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  row3: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.sm },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.borderLight, backgroundColor: COLORS.bgCard },
  chipActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  chipText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: COLORS.blue },

  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.md },
  tagItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  tagIcon: { fontSize: 14 },
  tagLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  tagCheck: { fontSize: 12, fontWeight: '900' },

  summaryBox: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.borderLight, padding: SPACING.md, marginTop: SPACING.sm,
  },
  summaryTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'right', marginBottom: 4 },
  summaryText: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'right', lineHeight: 18 },

  medCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.borderLight, padding: SPACING.md, marginBottom: 8,
  },
  medInfo: { flex: 1 },
  medName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'right' },
  medDetail: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'right', marginTop: 2 },
  removeBtn: { fontSize: 16, color: COLORS.error, paddingLeft: 8 },

  addForm: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight, padding: SPACING.md, marginBottom: SPACING.md, gap: 8 },
  formBtns: { flexDirection: 'row', gap: 8, marginTop: 4 },
  btnPrimary: { flex: 1, backgroundColor: COLORS.blue, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center' },
  btnPrimaryText: { color: '#000', fontWeight: '700', fontSize: 13 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: COLORS.borderLight, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center' },
  btnOutlineText: { color: COLORS.textSecondary, fontSize: 13 },

  addBtn: { borderWidth: 1.5, borderColor: COLORS.blue, borderRadius: RADIUS.md, borderStyle: 'dashed', padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.md },
  addBtnText: { color: COLORS.blue, fontWeight: '700', fontSize: 13 },

  exportBtn: { backgroundColor: COLORS.bgSection, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  exportBtnText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },

  labCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight, padding: SPACING.md, marginBottom: 8 },
  labDate: { fontSize: 11, color: COLORS.blue, fontWeight: '700', textAlign: 'right', marginBottom: 8 },
  labRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  labKey: { fontSize: 12, color: COLORS.textSecondary },
  labVal: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '700' },
});
