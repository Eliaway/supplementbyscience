import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { COLORS, RADIUS, SPACING } from '@/constants/styles';

// ─── أنواع البيانات ───────────────────────────────────────────────────────────
type DiagSection = 'organs' | 'liver_calc' | 'sleep' | 'risk' | 'labs_compare';

interface LabValues {
  alt: string; ast: string; ggt: string; bilirubin: string;
  creatinine: string; gfr: string; cholesterol: string;
  hdl: string; ldl: string; triglycerides: string;
  glucose: string; hba1c: string;
}

interface SleepData {
  hours: string; quality: 'poor' | 'fair' | 'good' | 'excellent';
  wakeUps: string; deepSleep: string;
}

interface RiskAnswers {
  [key: string]: boolean;
}

const STORAGE_KEY = 'diagnostics_data_v1';

// ─── المعدلات الطبيعية للتحاليل ──────────────────────────────────────────────
const LAB_NORMALS: Record<string, { name: string; unit: string; min: number; max: number; organ: string }> = {
  alt:          { name: 'ALT (SGPT)',      unit: 'U/L',    min: 7,   max: 56,   organ: 'liver' },
  ast:          { name: 'AST (SGOT)',      unit: 'U/L',    min: 10,  max: 40,   organ: 'liver' },
  ggt:          { name: 'GGT',            unit: 'U/L',    min: 9,   max: 48,   organ: 'liver' },
  bilirubin:    { name: 'Bilirubin Total', unit: 'mg/dL',  min: 0.2, max: 1.2,  organ: 'liver' },
  creatinine:   { name: 'Creatinine',      unit: 'mg/dL',  min: 0.6, max: 1.2,  organ: 'kidney' },
  gfr:          { name: 'eGFR',           unit: 'mL/min', min: 60,  max: 120,  organ: 'kidney' },
  cholesterol:  { name: 'Total Cholesterol', unit: 'mg/dL', min: 0, max: 200,  organ: 'heart' },
  hdl:          { name: 'HDL',            unit: 'mg/dL',  min: 40,  max: 999,  organ: 'heart' },
  ldl:          { name: 'LDL',            unit: 'mg/dL',  min: 0,   max: 100,  organ: 'heart' },
  triglycerides:{ name: 'Triglycerides',  unit: 'mg/dL',  min: 0,   max: 150,  organ: 'heart' },
  glucose:      { name: 'Glucose (Fasting)', unit: 'mg/dL', min: 70, max: 100, organ: 'general' },
  hba1c:        { name: 'HbA1c',          unit: '%',      min: 0,   max: 5.7,  organ: 'general' },
};

// ─── أسئلة تقييم الخطر ───────────────────────────────────────────────────────
const RISK_QUESTIONS = [
  { id: 'q1',  text: 'هل تشرب الكحول بانتظام؟',                    organ: 'liver',  weight: 3 },
  { id: 'q2',  text: 'هل تتناول أدوية يومية لأكثر من 3 أشهر؟',     organ: 'liver',  weight: 2 },
  { id: 'q3',  text: 'هل وزنك زائد (BMI > 25)؟',                   organ: 'liver',  weight: 2 },
  { id: 'q4',  text: 'هل لديك تاريخ عائلي لأمراض الكبد؟',          organ: 'liver',  weight: 2 },
  { id: 'q5',  text: 'هل تعاني من ضغط الدم المرتفع؟',              organ: 'heart',  weight: 3 },
  { id: 'q6',  text: 'هل تدخّن أو تستخدم منتجات التبغ؟',           organ: 'heart',  weight: 3 },
  { id: 'q7',  text: 'هل لديك تاريخ عائلي لأمراض القلب؟',          organ: 'heart',  weight: 2 },
  { id: 'q8',  text: 'هل نشاطك البدني أقل من 3 مرات أسبوعياً؟',   organ: 'heart',  weight: 2 },
  { id: 'q9',  text: 'هل تعاني من مرض السكري؟',                    organ: 'kidney', weight: 3 },
  { id: 'q10', text: 'هل سبق أن أُصبت بالتهاب الكلى؟',             organ: 'kidney', weight: 3 },
  { id: 'q11', text: 'هل تتناول مسكنات الألم (NSAIDS) بكثرة؟',     organ: 'kidney', weight: 2 },
  { id: 'q12', text: 'هل تشرب أقل من 2 لتر ماء يومياً؟',           organ: 'kidney', weight: 2 },
];

// ─── حساب درجة صحة الكبد ─────────────────────────────────────────────────────
function calcLiverScore(alt: number, ast: number, ggt: number, bili: number): number {
  let score = 100;
  if (alt > 56)  score -= Math.min(30, (alt - 56) / 5);
  if (alt > 100) score -= 10;
  if (ast > 40)  score -= Math.min(25, (ast - 40) / 4);
  if (ggt > 48)  score -= Math.min(20, (ggt - 48) / 5);
  if (bili > 1.2) score -= Math.min(15, (bili - 1.2) * 10);
  return Math.max(0, Math.round(score));
}

function getScoreColor(score: number): string {
  if (score >= 80) return COLORS.success;
  if (score >= 60) return COLORS.warning;
  if (score >= 40) return '#f97316';
  return COLORS.error;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'ممتاز';
  if (score >= 60) return 'جيد';
  if (score >= 40) return 'متوسط';
  return 'يحتاج متابعة';
}

function getLabStatus(key: string, value: number): 'normal' | 'low' | 'high' {
  const ref = LAB_NORMALS[key];
  if (!ref) return 'normal';
  if (value < ref.min) return 'low';
  if (value > ref.max) return 'high';
  return 'normal';
}

function getStatusColor(status: 'normal' | 'low' | 'high'): string {
  if (status === 'normal') return COLORS.success;
  if (status === 'low')    return COLORS.blue;
  return COLORS.error;
}

function getStatusLabel(status: 'normal' | 'low' | 'high'): string {
  if (status === 'normal') return '✅ طبيعي';
  if (status === 'low')    return '⬇️ منخفض';
  return '⬆️ مرتفع';
}

// ─── الشاشة الرئيسية ──────────────────────────────────────────────────────────
export default function DiagnosticsScreen() {
  const [section, setSection] = useState<DiagSection>('organs');
  const [labValues, setLabValues] = useState<LabValues>({
    alt: '', ast: '', ggt: '', bilirubin: '',
    creatinine: '', gfr: '', cholesterol: '',
    hdl: '', ldl: '', triglycerides: '', glucose: '', hba1c: '',
  });
  const [sleepData, setSleepData] = useState<SleepData>({ hours: '', quality: 'fair', wakeUps: '', deepSleep: '' });
  const [riskAnswers, setRiskAnswers] = useState<RiskAnswers>({});
  const [liverScore, setLiverScore] = useState<number | null>(null);
  const [organScores, setOrganScores] = useState<{ liver: number; heart: number; kidney: number } | null>(null);

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const loadData = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d.labValues) setLabValues(d.labValues);
      if (d.sleepData) setSleepData(d.sleepData);
      if (d.riskAnswers) setRiskAnswers(d.riskAnswers);
      if (d.liverScore !== undefined) setLiverScore(d.liverScore);
      if (d.organScores) setOrganScores(d.organScores);
    }
  };

  const saveData = async (updates: Record<string, any>) => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...updates }));
  };

  const calcLiver = () => {
    const alt = parseFloat(labValues.alt) || 0;
    const ast = parseFloat(labValues.ast) || 0;
    const ggt = parseFloat(labValues.ggt) || 0;
    const bili = parseFloat(labValues.bilirubin) || 0;
    const score = calcLiverScore(alt, ast, ggt, bili);
    setLiverScore(score);

    // حساب درجات الأعضاء الثلاثة
    const crea = parseFloat(labValues.creatinine) || 0;
    const gfrVal = parseFloat(labValues.gfr) || 0;
    const chol = parseFloat(labValues.cholesterol) || 0;
    const ldlVal = parseFloat(labValues.ldl) || 0;

    let kidneyScore = 100;
    if (crea > 1.2) kidneyScore -= Math.min(40, (crea - 1.2) * 20);
    if (gfrVal > 0 && gfrVal < 60) kidneyScore -= Math.min(40, (60 - gfrVal));
    kidneyScore = Math.max(0, Math.round(kidneyScore));

    let heartScore = 100;
    if (chol > 200) heartScore -= Math.min(30, (chol - 200) / 5);
    if (ldlVal > 100) heartScore -= Math.min(30, (ldlVal - 100) / 3);
    heartScore = Math.max(0, Math.round(heartScore));

    const scores = { liver: score, heart: heartScore, kidney: kidneyScore };
    setOrganScores(scores);
    saveData({ labValues, liverScore: score, organScores: scores });
  };

  const toggleRisk = (id: string) => {
    const updated = { ...riskAnswers, [id]: !riskAnswers[id] };
    setRiskAnswers(updated);
    saveData({ riskAnswers: updated });
  };

  const calcRiskScore = (organ: 'liver' | 'heart' | 'kidney') => {
    const qs = RISK_QUESTIONS.filter(q => q.organ === organ);
    const maxScore = qs.reduce((s, q) => s + q.weight, 0);
    const userScore = qs.filter(q => riskAnswers[q.id]).reduce((s, q) => s + q.weight, 0);
    return Math.round((userScore / maxScore) * 100);
  };

  const getSleepOrganImpact = () => {
    const h = parseFloat(sleepData.hours) || 0;
    const impacts = [];
    if (h < 6) {
      impacts.push({ organ: '🟡 الكبد', effect: 'انخفاض قدرة التجديد الخلوي وتراكم السموم', severity: 'high' });
      impacts.push({ organ: '❤️ القلب', effect: 'ارتفاع ضغط الدم وزيادة خطر الأمراض القلبية بنسبة 48%', severity: 'high' });
      impacts.push({ organ: '🟣 الكلى', effect: 'اضطراب في تنظيم الضغط وتراكم الفضلات', severity: 'medium' });
    } else if (h < 7) {
      impacts.push({ organ: '🟡 الكبد', effect: 'تقليل طفيف في كفاءة إزالة السموم', severity: 'medium' });
      impacts.push({ organ: '❤️ القلب', effect: 'زيادة خطر الأمراض القلبية بنسبة 15%', severity: 'medium' });
    } else if (h >= 7 && h <= 9) {
      impacts.push({ organ: '🟡 الكبد', effect: 'تجديد خلوي مثالي وإزالة سموم فعّالة', severity: 'good' });
      impacts.push({ organ: '❤️ القلب', effect: 'ضغط دم منتظم وتعافٍ قلبي أمثل', severity: 'good' });
      impacts.push({ organ: '🟣 الكلى', effect: 'تصفية دم مثالية وتوازن الإلكتروليتات', severity: 'good' });
    } else {
      impacts.push({ organ: '🟡 الكبد', effect: 'نوم زائد قد يشير لمشكلة كبدية، راجع طبيبك', severity: 'medium' });
      impacts.push({ organ: '❤️ القلب', effect: 'النوم الزائد مرتبط بزيادة خطر السكتة الدماغية', severity: 'medium' });
    }
    return impacts;
  };

  const NAV_ITEMS: { id: DiagSection; label: string; icon: string }[] = [
    { id: 'organs',      label: 'مؤشر الأعضاء',  icon: '🫀' },
    { id: 'liver_calc',  label: 'حاسبة الكبد',    icon: '🟡' },
    { id: 'sleep',       label: 'تحليل النوم',     icon: '😴' },
    { id: 'risk',        label: 'تقييم الخطر',     icon: '⚠️' },
    { id: 'labs_compare',label: 'مقارنة التحاليل', icon: '🧪' },
  ];

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔬 التشخيص والتحليل المتقدم</Text>
        <Text style={styles.headerSub}>تحليل علمي شامل لصحة أعضائك</Text>
      </View>

      {/* Navigation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navScroll}>
        <View style={styles.navContent}>
          {NAV_ITEMS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.navBtn, section === item.id && styles.navBtnActive]}
              onPress={() => setSection(item.id)}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, section === item.id && styles.navLabelActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 80 }}>

        {/* ══════════════════════════════════════════════════════════════════════
            1. مؤشر صحة الأعضاء التفاعلي
        ══════════════════════════════════════════════════════════════════════ */}
        {section === 'organs' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>مؤشر صحة الأعضاء</Text>
            <Text style={styles.sectionSub}>أدخل قيم تحاليلك في "حاسبة الكبد" لتحديث المؤشرات</Text>

            {/* نموذج الجسم البشري المبسّط */}
            <View style={styles.bodyModel}>
              {/* الرأس */}
              <View style={styles.bodyHead}>
                <Text style={styles.bodyHeadText}>👤</Text>
              </View>

              {/* الجسم */}
              <View style={styles.bodyTorso}>
                {/* القلب */}
                <TouchableOpacity
                  style={[styles.organBubble, styles.heartBubble,
                    { borderColor: organScores ? getScoreColor(organScores.heart) : COLORS.heart }]}
                  onPress={() => setSection('liver_calc')}
                >
                  <Text style={styles.organEmoji}>❤️</Text>
                  <Text style={[styles.organScore, { color: organScores ? getScoreColor(organScores.heart) : COLORS.heart }]}>
                    {organScores ? organScores.heart : '--'}
                  </Text>
                  <Text style={styles.organName}>القلب</Text>
                </TouchableOpacity>

                {/* الكبد */}
                <TouchableOpacity
                  style={[styles.organBubble, styles.liverBubble,
                    { borderColor: organScores ? getScoreColor(organScores.liver) : COLORS.liver }]}
                  onPress={() => setSection('liver_calc')}
                >
                  <Text style={styles.organEmoji}>🟡</Text>
                  <Text style={[styles.organScore, { color: organScores ? getScoreColor(organScores.liver) : COLORS.liver }]}>
                    {organScores ? organScores.liver : '--'}
                  </Text>
                  <Text style={styles.organName}>الكبد</Text>
                </TouchableOpacity>
              </View>

              {/* الكلى */}
              <View style={styles.kidneyRow}>
                <TouchableOpacity
                  style={[styles.organBubble,
                    { borderColor: organScores ? getScoreColor(organScores.kidney) : COLORS.kidney }]}
                  onPress={() => setSection('liver_calc')}
                >
                  <Text style={styles.organEmoji}>🟣</Text>
                  <Text style={[styles.organScore, { color: organScores ? getScoreColor(organScores.kidney) : COLORS.kidney }]}>
                    {organScores ? organScores.kidney : '--'}
                  </Text>
                  <Text style={styles.organName}>الكلى</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* مقياس الدرجات */}
            <View style={styles.legendRow}>
              {[
                { label: '80-100 ممتاز', color: COLORS.success },
                { label: '60-79 جيد', color: COLORS.warning },
                { label: '40-59 متوسط', color: '#f97316' },
                { label: '0-39 يحتاج متابعة', color: COLORS.error },
              ].map(l => (
                <View key={l.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                  <Text style={styles.legendText}>{l.label}</Text>
                </View>
              ))}
            </View>

            {/* ملخص الحالة */}
            {organScores && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>📊 ملخص الحالة الصحية</Text>
                {[
                  { label: 'الكبد', score: organScores.liver, color: COLORS.liver },
                  { label: 'القلب', score: organScores.heart, color: COLORS.heart },
                  { label: 'الكلى', score: organScores.kidney, color: COLORS.kidney },
                ].map(o => (
                  <View key={o.label} style={styles.scoreRow}>
                    <View style={styles.scoreBarBg}>
                      <View style={[styles.scoreBarFill, { width: `${o.score}%`, backgroundColor: getScoreColor(o.score) }]} />
                    </View>
                    <Text style={[styles.scoreLabel, { color: getScoreColor(o.score) }]}>{o.score}/100</Text>
                    <Text style={styles.scoreName}>{o.label}</Text>
                  </View>
                ))}
              </View>
            )}

            {!organScores && (
              <TouchableOpacity style={styles.ctaBtn} onPress={() => setSection('liver_calc')}>
                <Text style={styles.ctaBtnText}>📥 أدخل قيم تحاليلك لتفعيل المؤشر</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            2. حاسبة الكبد الوظيفي
        ══════════════════════════════════════════════════════════════════════ */}
        {section === 'liver_calc' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>حاسبة صحة الأعضاء الوظيفية</Text>
            <Text style={styles.sectionSub}>أدخل قيم تحاليلك لحساب درجة صحة كل عضو</Text>

            {/* تحاليل الكبد */}
            <View style={styles.groupCard}>
              <Text style={styles.groupTitle}>🟡 تحاليل الكبد</Text>
              <View style={styles.inputGrid}>
                {(['alt','ast','ggt','bilirubin'] as const).map(key => (
                  <View key={key} style={styles.inputBox}>
                    <Text style={styles.inputLabel}>{LAB_NORMALS[key].name}</Text>
                    <TextInput
                      style={styles.input}
                      value={labValues[key]}
                      onChangeText={v => setLabValues(prev => ({ ...prev, [key]: v }))}
                      keyboardType="decimal-pad"
                      placeholder={`${LAB_NORMALS[key].min}–${LAB_NORMALS[key].max}`}
                      placeholderTextColor={COLORS.textMuted}
                    />
                    <Text style={styles.inputUnit}>{LAB_NORMALS[key].unit}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* تحاليل الكلى */}
            <View style={styles.groupCard}>
              <Text style={styles.groupTitle}>🟣 تحاليل الكلى</Text>
              <View style={styles.inputGrid}>
                {(['creatinine','gfr'] as const).map(key => (
                  <View key={key} style={styles.inputBox}>
                    <Text style={styles.inputLabel}>{LAB_NORMALS[key].name}</Text>
                    <TextInput
                      style={styles.input}
                      value={labValues[key]}
                      onChangeText={v => setLabValues(prev => ({ ...prev, [key]: v }))}
                      keyboardType="decimal-pad"
                      placeholder={`${LAB_NORMALS[key].min}–${LAB_NORMALS[key].max}`}
                      placeholderTextColor={COLORS.textMuted}
                    />
                    <Text style={styles.inputUnit}>{LAB_NORMALS[key].unit}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* تحاليل القلب */}
            <View style={styles.groupCard}>
              <Text style={styles.groupTitle}>❤️ تحاليل القلب والدهون</Text>
              <View style={styles.inputGrid}>
                {(['cholesterol','hdl','ldl','triglycerides'] as const).map(key => (
                  <View key={key} style={styles.inputBox}>
                    <Text style={styles.inputLabel}>{LAB_NORMALS[key].name}</Text>
                    <TextInput
                      style={styles.input}
                      value={labValues[key]}
                      onChangeText={v => setLabValues(prev => ({ ...prev, [key]: v }))}
                      keyboardType="decimal-pad"
                      placeholder={`≤${LAB_NORMALS[key].max}`}
                      placeholderTextColor={COLORS.textMuted}
                    />
                    <Text style={styles.inputUnit}>{LAB_NORMALS[key].unit}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* السكر */}
            <View style={styles.groupCard}>
              <Text style={styles.groupTitle}>🩸 سكر الدم</Text>
              <View style={styles.inputGrid}>
                {(['glucose','hba1c'] as const).map(key => (
                  <View key={key} style={styles.inputBox}>
                    <Text style={styles.inputLabel}>{LAB_NORMALS[key].name}</Text>
                    <TextInput
                      style={styles.input}
                      value={labValues[key]}
                      onChangeText={v => setLabValues(prev => ({ ...prev, [key]: v }))}
                      keyboardType="decimal-pad"
                      placeholder={`${LAB_NORMALS[key].min}–${LAB_NORMALS[key].max}`}
                      placeholderTextColor={COLORS.textMuted}
                    />
                    <Text style={styles.inputUnit}>{LAB_NORMALS[key].unit}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.calcBtn} onPress={calcLiver}>
              <Text style={styles.calcBtnText}>🔬 احسب درجة صحة الأعضاء</Text>
            </TouchableOpacity>

            {/* النتيجة */}
            {liverScore !== null && organScores && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>📊 نتائج التحليل</Text>
                {[
                  { label: 'الكبد', score: organScores.liver, icon: '🟡' },
                  { label: 'القلب', score: organScores.heart, icon: '❤️' },
                  { label: 'الكلى', score: organScores.kidney, icon: '🟣' },
                ].map(o => (
                  <View key={o.label} style={styles.resultOrgan}>
                    <View style={[styles.scoreCircle, { borderColor: getScoreColor(o.score) }]}>
                      <Text style={styles.scoreCircleEmoji}>{o.icon}</Text>
                      <Text style={[styles.scoreCircleNum, { color: getScoreColor(o.score) }]}>{o.score}</Text>
                      <Text style={[styles.scoreCircleLabel, { color: getScoreColor(o.score) }]}>{getScoreLabel(o.score)}</Text>
                    </View>
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultOrganName}>{o.label}</Text>
                      <View style={styles.resultBar}>
                        <View style={[styles.resultBarFill, { width: `${o.score}%`, backgroundColor: getScoreColor(o.score) }]} />
                      </View>
                      <Text style={[styles.resultStatus, { color: getScoreColor(o.score) }]}>{getScoreLabel(o.score)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            3. تحليل نمط النوم
        ══════════════════════════════════════════════════════════════════════ */}
        {section === 'sleep' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>تحليل نمط النوم وتأثيره على الأعضاء</Text>
            <Text style={styles.sectionSub}>النوم الجيد ضروري لتجديد خلايا الكبد والكلى وصحة القلب</Text>

            <View style={styles.groupCard}>
              <View style={styles.inputGrid}>
                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>ساعات النوم اليومية</Text>
                  <TextInput
                    style={styles.input}
                    value={sleepData.hours}
                    onChangeText={v => setSleepData(p => ({ ...p, hours: v }))}
                    keyboardType="decimal-pad"
                    placeholder="7–9"
                    placeholderTextColor={COLORS.textMuted}
                  />
                  <Text style={styles.inputUnit}>ساعة</Text>
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>عدد الاستيقاظات ليلاً</Text>
                  <TextInput
                    style={styles.input}
                    value={sleepData.wakeUps}
                    onChangeText={v => setSleepData(p => ({ ...p, wakeUps: v }))}
                    keyboardType="number-pad"
                    placeholder="0–3"
                    placeholderTextColor={COLORS.textMuted}
                  />
                  <Text style={styles.inputUnit}>مرة</Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>جودة النوم العامة</Text>
              <View style={styles.qualityRow}>
                {([
                  { id: 'poor', label: 'سيئ', emoji: '😫' },
                  { id: 'fair', label: 'مقبول', emoji: '😐' },
                  { id: 'good', label: 'جيد', emoji: '😊' },
                  { id: 'excellent', label: 'ممتاز', emoji: '😴' },
                ] as const).map(q => (
                  <TouchableOpacity
                    key={q.id}
                    style={[styles.qualityBtn, sleepData.quality === q.id && styles.qualityBtnActive]}
                    onPress={() => setSleepData(p => ({ ...p, quality: q.id }))}
                  >
                    <Text style={styles.qualityEmoji}>{q.emoji}</Text>
                    <Text style={[styles.qualityLabel, sleepData.quality === q.id && styles.qualityLabelActive]}>{q.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* التأثيرات على الأعضاء */}
            {sleepData.hours !== '' && (
              <View>
                <Text style={styles.subTitle}>🔬 التأثير على أعضائك</Text>
                {getSleepOrganImpact().map((impact, i) => (
                  <View key={i} style={[styles.impactCard, {
                    borderColor: impact.severity === 'good' ? COLORS.success :
                                 impact.severity === 'high' ? COLORS.error : COLORS.warning
                  }]}>
                    <Text style={styles.impactOrgan}>{impact.organ}</Text>
                    <Text style={styles.impactEffect}>{impact.effect}</Text>
                    <View style={[styles.impactBadge, {
                      backgroundColor: impact.severity === 'good' ? COLORS.successBg :
                                       impact.severity === 'high' ? COLORS.errorBg : COLORS.warningBg
                    }]}>
                      <Text style={[styles.impactBadgeText, {
                        color: impact.severity === 'good' ? COLORS.success :
                               impact.severity === 'high' ? COLORS.error : COLORS.warning
                      }]}>
                        {impact.severity === 'good' ? '✅ مثالي' : impact.severity === 'high' ? '⚠️ خطر' : '⚡ تنبيه'}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* توصيات تحسين النوم */}
                <View style={styles.tipsCard}>
                  <Text style={styles.tipsTitle}>💡 توصيات لتحسين النوم</Text>
                  {[
                    'تجنّب الشاشات قبل النوم بساعة',
                    'درجة حرارة الغرفة المثلى: 18-20°C',
                    'Magnesium Glycinate 200-400mg قبل النوم يحسّن جودة النوم',
                    'L-Theanine 200mg يقلل القلق ويعمّق النوم',
                    'تجنّب الكافيين بعد الساعة 2 ظهراً',
                  ].map((tip, i) => (
                    <Text key={i} style={styles.tipItem}>• {tip}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            4. تقييم خطر الأمراض المزمنة
        ══════════════════════════════════════════════════════════════════════ */}
        {section === 'risk' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>تقييم خطر الأمراض المزمنة</Text>
            <Text style={styles.sectionSub}>استبيان علمي يحسب احتمالية خطر الإصابة بأمراض الأعضاء</Text>

            {/* أسئلة الكبد */}
            <View style={styles.groupCard}>
              <Text style={styles.groupTitle}>🟡 عوامل خطر الكبد</Text>
              {RISK_QUESTIONS.filter(q => q.organ === 'liver').map(q => (
                <TouchableOpacity key={q.id} style={styles.riskQ} onPress={() => toggleRisk(q.id)}>
                  <View style={[styles.riskCheck, riskAnswers[q.id] && styles.riskCheckActive]}>
                    {riskAnswers[q.id] && <Text style={styles.riskCheckMark}>✓</Text>}
                  </View>
                  <Text style={styles.riskText}>{q.text}</Text>
                  <View style={[styles.riskWeight, { backgroundColor: q.weight >= 3 ? COLORS.errorBg : COLORS.warningBg }]}>
                    <Text style={[styles.riskWeightText, { color: q.weight >= 3 ? COLORS.error : COLORS.warning }]}>
                      ×{q.weight}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={[styles.riskResult, { borderColor: getScoreColor(100 - calcRiskScore('liver')) }]}>
                <Text style={styles.riskResultLabel}>مستوى الخطر</Text>
                <Text style={[styles.riskResultScore, { color: getScoreColor(100 - calcRiskScore('liver')) }]}>
                  {calcRiskScore('liver')}%
                </Text>
                <View style={styles.riskBar}>
                  <View style={[styles.riskBarFill, {
                    width: `${calcRiskScore('liver')}%`,
                    backgroundColor: calcRiskScore('liver') > 60 ? COLORS.error : calcRiskScore('liver') > 30 ? COLORS.warning : COLORS.success
                  }]} />
                </View>
              </View>
            </View>

            {/* أسئلة القلب */}
            <View style={styles.groupCard}>
              <Text style={styles.groupTitle}>❤️ عوامل خطر القلب</Text>
              {RISK_QUESTIONS.filter(q => q.organ === 'heart').map(q => (
                <TouchableOpacity key={q.id} style={styles.riskQ} onPress={() => toggleRisk(q.id)}>
                  <View style={[styles.riskCheck, riskAnswers[q.id] && { ...styles.riskCheckActive, borderColor: COLORS.heartBorder, backgroundColor: COLORS.heartBg }]}>
                    {riskAnswers[q.id] && <Text style={styles.riskCheckMark}>✓</Text>}
                  </View>
                  <Text style={styles.riskText}>{q.text}</Text>
                  <View style={[styles.riskWeight, { backgroundColor: q.weight >= 3 ? COLORS.errorBg : COLORS.warningBg }]}>
                    <Text style={[styles.riskWeightText, { color: q.weight >= 3 ? COLORS.error : COLORS.warning }]}>×{q.weight}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={[styles.riskResult, { borderColor: getScoreColor(100 - calcRiskScore('heart')) }]}>
                <Text style={styles.riskResultLabel}>مستوى الخطر</Text>
                <Text style={[styles.riskResultScore, { color: calcRiskScore('heart') > 60 ? COLORS.error : calcRiskScore('heart') > 30 ? COLORS.warning : COLORS.success }]}>
                  {calcRiskScore('heart')}%
                </Text>
                <View style={styles.riskBar}>
                  <View style={[styles.riskBarFill, {
                    width: `${calcRiskScore('heart')}%`,
                    backgroundColor: calcRiskScore('heart') > 60 ? COLORS.error : calcRiskScore('heart') > 30 ? COLORS.warning : COLORS.success
                  }]} />
                </View>
              </View>
            </View>

            {/* أسئلة الكلى */}
            <View style={styles.groupCard}>
              <Text style={styles.groupTitle}>🟣 عوامل خطر الكلى</Text>
              {RISK_QUESTIONS.filter(q => q.organ === 'kidney').map(q => (
                <TouchableOpacity key={q.id} style={styles.riskQ} onPress={() => toggleRisk(q.id)}>
                  <View style={[styles.riskCheck, riskAnswers[q.id] && { ...styles.riskCheckActive, borderColor: COLORS.kidneyBorder, backgroundColor: COLORS.kidneyBg }]}>
                    {riskAnswers[q.id] && <Text style={styles.riskCheckMark}>✓</Text>}
                  </View>
                  <Text style={styles.riskText}>{q.text}</Text>
                  <View style={[styles.riskWeight, { backgroundColor: q.weight >= 3 ? COLORS.errorBg : COLORS.warningBg }]}>
                    <Text style={[styles.riskWeightText, { color: q.weight >= 3 ? COLORS.error : COLORS.warning }]}>×{q.weight}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={[styles.riskResult, { borderColor: getScoreColor(100 - calcRiskScore('kidney')) }]}>
                <Text style={styles.riskResultLabel}>مستوى الخطر</Text>
                <Text style={[styles.riskResultScore, { color: calcRiskScore('kidney') > 60 ? COLORS.error : calcRiskScore('kidney') > 30 ? COLORS.warning : COLORS.success }]}>
                  {calcRiskScore('kidney')}%
                </Text>
                <View style={styles.riskBar}>
                  <View style={[styles.riskBarFill, {
                    width: `${calcRiskScore('kidney')}%`,
                    backgroundColor: calcRiskScore('kidney') > 60 ? COLORS.error : calcRiskScore('kidney') > 30 ? COLORS.warning : COLORS.success
                  }]} />
                </View>
              </View>
            </View>

            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>⚠️ هذا التقييم للتوعية فقط وليس تشخيصاً طبياً. استشر طبيبك للتشخيص الدقيق.</Text>
            </View>
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            5. مقارنة التحاليل مع المعدلات الطبيعية
        ══════════════════════════════════════════════════════════════════════ */}
        {section === 'labs_compare' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>مقارنة التحاليل مع المعدلات الطبيعية</Text>
            <Text style={styles.sectionSub}>أدخل قيمك في "حاسبة الكبد" أولاً لرؤية المقارنة</Text>

            {/* جدول الكبد */}
            <View style={styles.tableCard}>
              <Text style={styles.tableTitle}>🟡 تحاليل الكبد</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>التحليل</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>قيمتك</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>الطبيعي</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>الحالة</Text>
              </View>
              {(['alt','ast','ggt','bilirubin'] as const).map(key => {
                const val = parseFloat(labValues[key]);
                const status = labValues[key] ? getLabStatus(key, val) : null;
                return (
                  <View key={key} style={[styles.tableRow, status && status !== 'normal' && styles.tableRowAlert]}>
                    <Text style={[styles.tableCell, styles.tableCellName, { flex: 2 }]}>{LAB_NORMALS[key].name}</Text>
                    <Text style={[styles.tableCell, { color: status ? getStatusColor(status) : COLORS.textMuted, fontWeight: '700' }]}>
                      {labValues[key] || '—'} {labValues[key] ? LAB_NORMALS[key].unit : ''}
                    </Text>
                    <Text style={[styles.tableCell, { color: COLORS.textSecondary }]}>
                      {LAB_NORMALS[key].min}–{LAB_NORMALS[key].max}
                    </Text>
                    <Text style={[styles.tableCell, { color: status ? getStatusColor(status) : COLORS.textMuted, fontSize: 11 }]}>
                      {status ? getStatusLabel(status) : '—'}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* جدول الكلى */}
            <View style={styles.tableCard}>
              <Text style={styles.tableTitle}>🟣 تحاليل الكلى</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>التحليل</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>قيمتك</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>الطبيعي</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>الحالة</Text>
              </View>
              {(['creatinine','gfr'] as const).map(key => {
                const val = parseFloat(labValues[key]);
                const status = labValues[key] ? getLabStatus(key, val) : null;
                return (
                  <View key={key} style={[styles.tableRow, status && status !== 'normal' && styles.tableRowAlert]}>
                    <Text style={[styles.tableCell, styles.tableCellName, { flex: 2 }]}>{LAB_NORMALS[key].name}</Text>
                    <Text style={[styles.tableCell, { color: status ? getStatusColor(status) : COLORS.textMuted, fontWeight: '700' }]}>
                      {labValues[key] || '—'} {labValues[key] ? LAB_NORMALS[key].unit : ''}
                    </Text>
                    <Text style={[styles.tableCell, { color: COLORS.textSecondary }]}>
                      {LAB_NORMALS[key].min}–{LAB_NORMALS[key].max}
                    </Text>
                    <Text style={[styles.tableCell, { color: status ? getStatusColor(status) : COLORS.textMuted, fontSize: 11 }]}>
                      {status ? getStatusLabel(status) : '—'}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* جدول القلب */}
            <View style={styles.tableCard}>
              <Text style={styles.tableTitle}>❤️ تحاليل القلب والدهون</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>التحليل</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>قيمتك</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>الطبيعي</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>الحالة</Text>
              </View>
              {(['cholesterol','hdl','ldl','triglycerides','glucose','hba1c'] as const).map(key => {
                const val = parseFloat(labValues[key]);
                const status = labValues[key] ? getLabStatus(key, val) : null;
                return (
                  <View key={key} style={[styles.tableRow, status && status !== 'normal' && styles.tableRowAlert]}>
                    <Text style={[styles.tableCell, styles.tableCellName, { flex: 2 }]}>{LAB_NORMALS[key].name}</Text>
                    <Text style={[styles.tableCell, { color: status ? getStatusColor(status) : COLORS.textMuted, fontWeight: '700' }]}>
                      {labValues[key] || '—'} {labValues[key] ? LAB_NORMALS[key].unit : ''}
                    </Text>
                    <Text style={[styles.tableCell, { color: COLORS.textSecondary }]}>
                      {LAB_NORMALS[key].max === 999 ? `>${LAB_NORMALS[key].min}` : `${LAB_NORMALS[key].min}–${LAB_NORMALS[key].max}`}
                    </Text>
                    <Text style={[styles.tableCell, { color: status ? getStatusColor(status) : COLORS.textMuted, fontSize: 11 }]}>
                      {status ? getStatusLabel(status) : '—'}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>📌 المعدلات الطبيعية تختلف حسب المختبر والعمر والجنس. استشر طبيبك لتفسير دقيق.</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </ScreenContainer>
  );
}

// ─── الأنماط ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: { padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.bg },
  headerTitle: { fontSize: 17, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'right' },
  headerSub: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginTop: 2 },

  navScroll: { backgroundColor: COLORS.bg, borderBottomWidth: 1, borderBottomColor: COLORS.border, maxHeight: 64 },
  navContent: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: 6, alignItems: 'center', paddingVertical: 8 },
  navBtn: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', backgroundColor: COLORS.bgCard },
  navBtnActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  navIcon: { fontSize: 16 },
  navLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },
  navLabelActive: { color: COLORS.blue },

  body: { flex: 1, backgroundColor: COLORS.bg },
  section: { padding: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'right', marginBottom: 4 },
  sectionSub: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginBottom: SPACING.lg },
  subTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textAccent, textAlign: 'right', marginBottom: SPACING.md, marginTop: SPACING.sm },

  // نموذج الجسم
  bodyModel: { alignItems: 'center', paddingVertical: SPACING.lg, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  bodyHead: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.bgSection, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  bodyHeadText: { fontSize: 32 },
  bodyTorso: { flexDirection: 'row', gap: 20, marginBottom: 12 },
  heartBubble: { },
  liverBubble: { },
  kidneyRow: { flexDirection: 'row', gap: 12 },
  organBubble: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, backgroundColor: COLORS.bgSection, alignItems: 'center', justifyContent: 'center' },
  organEmoji: { fontSize: 24 },
  organScore: { fontSize: 18, fontWeight: '900', marginTop: 2 },
  organName: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },

  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: SPACING.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: COLORS.textMuted },

  summaryCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, marginBottom: SPACING.md },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textAccent, textAlign: 'right', marginBottom: SPACING.md },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  scoreBarBg: { flex: 1, height: 8, backgroundColor: COLORS.bgSection, borderRadius: 4, overflow: 'hidden' },
  scoreBarFill: { height: 8, borderRadius: 4 },
  scoreLabel: { fontSize: 12, fontWeight: '700', width: 50, textAlign: 'right' },
  scoreName: { fontSize: 12, color: COLORS.textSecondary, width: 36, textAlign: 'right' },

  ctaBtn: { backgroundColor: COLORS.blueBg, borderWidth: 1, borderColor: COLORS.blue, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center' },
  ctaBtnText: { color: COLORS.blue, fontWeight: '700', fontSize: 13 },

  // مجموعات الإدخال
  groupCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md },
  groupTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textAccent, textAlign: 'right', marginBottom: SPACING.md },
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.sm },
  inputBox: { flex: 1, minWidth: '45%', alignItems: 'center' },
  inputLabel: { fontSize: 10, color: COLORS.textAccent, textAlign: 'right', marginBottom: 4, fontWeight: '700', width: '100%' },
  input: { backgroundColor: COLORS.bgInput, borderWidth: 1, borderColor: COLORS.borderLight, borderRadius: RADIUS.md, padding: SPACING.sm, color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', textAlign: 'center', width: '100%' },
  inputUnit: { fontSize: 9, color: COLORS.textMuted, marginTop: 2 },

  calcBtn: { backgroundColor: COLORS.blue, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', marginTop: SPACING.sm },
  calcBtnText: { color: '#000', fontWeight: '900', fontSize: 14 },

  // نتيجة الحساب
  resultCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, marginTop: SPACING.lg },
  resultTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textAccent, textAlign: 'right', marginBottom: SPACING.lg },
  resultOrgan: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  scoreCircle: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgSection },
  scoreCircleEmoji: { fontSize: 18 },
  scoreCircleNum: { fontSize: 16, fontWeight: '900' },
  scoreCircleLabel: { fontSize: 8, fontWeight: '700' },
  resultInfo: { flex: 1 },
  resultOrganName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'right', marginBottom: 6 },
  resultBar: { height: 8, backgroundColor: COLORS.bgSection, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  resultBarFill: { height: 8, borderRadius: 4 },
  resultStatus: { fontSize: 11, fontWeight: '700', textAlign: 'right' },

  // النوم
  qualityRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  qualityBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 8, alignItems: 'center', backgroundColor: COLORS.bgCard },
  qualityBtnActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  qualityEmoji: { fontSize: 20, marginBottom: 2 },
  qualityLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  qualityLabelActive: { color: COLORS.blue },

  impactCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1.5, padding: SPACING.md, marginBottom: 8 },
  impactOrgan: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'right', marginBottom: 4 },
  impactEffect: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'right', lineHeight: 18, marginBottom: 8 },
  impactBadge: { alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  impactBadgeText: { fontSize: 10, fontWeight: '700' },

  tipsCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.blueBorder, padding: SPACING.lg, marginTop: SPACING.md },
  tipsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.blue, textAlign: 'right', marginBottom: SPACING.md },
  tipItem: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'right', lineHeight: 22 },

  // تقييم الخطر
  riskQ: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  riskCheck: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgSection },
  riskCheckActive: { borderColor: COLORS.success, backgroundColor: COLORS.successBg },
  riskCheckMark: { color: COLORS.success, fontSize: 12, fontWeight: '900' },
  riskText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, textAlign: 'right', lineHeight: 18 },
  riskWeight: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.sm },
  riskWeightText: { fontSize: 10, fontWeight: '700' },
  riskResult: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.md, backgroundColor: COLORS.bgSection, borderRadius: RADIUS.md, borderWidth: 1, padding: SPACING.md },
  riskResultLabel: { fontSize: 11, color: COLORS.textMuted, flex: 1, textAlign: 'right' },
  riskResultScore: { fontSize: 18, fontWeight: '900' },
  riskBar: { flex: 2, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  riskBarFill: { height: 6, borderRadius: 3 },

  // جدول المقارنة
  tableCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md },
  tableTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textAccent, textAlign: 'right', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.bgSection, paddingHorizontal: SPACING.sm, paddingVertical: 8 },
  tableHeaderText: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700', textAlign: 'center' },
  tableRow: { flexDirection: 'row', paddingHorizontal: SPACING.sm, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableRowAlert: { backgroundColor: '#1a0a0a' },
  tableCell: { flex: 1, fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
  tableCellName: { color: COLORS.textPrimary, fontWeight: '600', textAlign: 'right' },

  disclaimerBox: { backgroundColor: COLORS.bgSection, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight, padding: SPACING.md, marginTop: SPACING.md },
  disclaimerText: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', lineHeight: 18 },
});
