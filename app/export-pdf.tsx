import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  I18nManager,
} from 'react-native';

I18nManager.forceRTL(true);
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

interface HealthProfile {
  name?: string;
  age?: string;
  weight?: string;
  height?: string;
  goals?: string[];
  diseases?: string[];
  medications?: string[];
  allergies?: string[];
  supplements?: string[];
}

const EXPORT_OPTIONS = [
  { id: 'full', label: 'الملف الصحي الكامل', icon: '📋', desc: 'جميع البيانات الصحية والمكملات' },
  { id: 'supplements', label: 'قائمة المكملات فقط', icon: '💊', desc: 'المكملات الحالية والجرعات' },
  { id: 'plan', label: 'الخطة الصحية', icon: '🎯', desc: 'الأهداف والبروتوكولات المخصصة' },
  { id: 'interactions', label: 'تقرير التفاعلات', icon: '⚠️', desc: 'تفاعلات المكملات والأدوية' },
];

function generateHealthProfileHTML(profile: HealthProfile, exportType: string): string {
  const today = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const baseStyle = `
    <style>
      @page { margin: 20px; }
      body {
        font-family: Arial, sans-serif;
        direction: rtl;
        text-align: right;
        color: #1a1a1a;
        background: #ffffff;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: white;
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 24px;
        text-align: center;
      }
      .header h1 { font-size: 24px; margin: 0 0 8px 0; }
      .header p { font-size: 14px; margin: 0; opacity: 0.8; }
      .section {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 16px;
        border-right: 4px solid #d4af37;
      }
      .section h2 {
        font-size: 18px;
        color: #1a1a2e;
        margin: 0 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #e0e0e0;
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid #eeeeee;
        font-size: 14px;
      }
      .info-label { color: #666; font-weight: bold; }
      .info-value { color: #1a1a2e; }
      .tag {
        display: inline-block;
        background: #e8f4fd;
        color: #1565c0;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        margin: 3px;
      }
      .tag.warning { background: #fff3e0; color: #e65100; }
      .tag.success { background: #e8f5e9; color: #2e7d32; }
      .footer {
        text-align: center;
        margin-top: 24px;
        padding: 16px;
        background: #f0f0f0;
        border-radius: 8px;
        font-size: 12px;
        color: #666;
      }
      .disclaimer {
        background: #fff8e1;
        border: 1px solid #ffd54f;
        border-radius: 8px;
        padding: 12px;
        margin-top: 16px;
        font-size: 12px;
        color: #5d4037;
      }
    </style>
  `;

  let content = '';

  if (exportType === 'full' || exportType === 'plan') {
    content += `
      <div class="section">
        <h2>📊 البيانات الشخصية</h2>
        <div class="info-row">
          <span class="info-label">الاسم:</span>
          <span class="info-value">${profile.name || 'غير محدد'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">العمر:</span>
          <span class="info-value">${profile.age ? profile.age + ' سنة' : 'غير محدد'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">الوزن:</span>
          <span class="info-value">${profile.weight ? profile.weight + ' كجم' : 'غير محدد'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">الطول:</span>
          <span class="info-value">${profile.height ? profile.height + ' سم' : 'غير محدد'}</span>
        </div>
      </div>
    `;
  }

  if (exportType === 'full' || exportType === 'plan') {
    const goals = profile.goals || ['تحسين الصحة العامة', 'تعزيز الطاقة', 'دعم المناعة'];
    content += `
      <div class="section">
        <h2>🎯 الأهداف الصحية</h2>
        <div style="margin-top: 8px;">
          ${goals.map((g) => `<span class="tag success">${g}</span>`).join('')}
        </div>
      </div>
    `;
  }

  if (exportType === 'full' || exportType === 'supplements') {
    const supplements = profile.supplements || [
      'فيتامين D3 — 5000 IU — مرة يومياً',
      'أوميغا 3 — 2000 مجم — مرتين يومياً',
      'المغنيسيوم — 400 مجم — قبل النوم',
      'فيتامين B12 — 1000 مكجم — مرة يومياً',
      'الزنك — 30 مجم — مع الطعام',
    ];
    content += `
      <div class="section">
        <h2>💊 المكملات الغذائية الحالية</h2>
        ${supplements
          .map(
            (s) => `
          <div class="info-row">
            <span class="info-value">• ${s}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  if (exportType === 'full' || exportType === 'interactions') {
    const diseases = profile.diseases || [];
    const medications = profile.medications || [];
    const allergies = profile.allergies || [];

    content += `
      <div class="section">
        <h2>🏥 الحالات الصحية والأدوية</h2>
        ${
          diseases.length > 0
            ? `<p style="font-size:13px; color:#666; margin:4px 0;">الأمراض المزمنة:</p>
          <div style="margin-bottom:8px;">${diseases.map((d) => `<span class="tag warning">${d}</span>`).join('')}</div>`
            : '<p style="font-size:13px; color:#888;">لا توجد أمراض مزمنة مسجّلة</p>'
        }
        ${
          medications.length > 0
            ? `<p style="font-size:13px; color:#666; margin:4px 0;">الأدوية الحالية:</p>
          <div style="margin-bottom:8px;">${medications.map((m) => `<span class="tag warning">${m}</span>`).join('')}</div>`
            : '<p style="font-size:13px; color:#888;">لا توجد أدوية مسجّلة</p>'
        }
        ${
          allergies.length > 0
            ? `<p style="font-size:13px; color:#666; margin:4px 0;">الحساسية:</p>
          <div>${allergies.map((a) => `<span class="tag warning">${a}</span>`).join('')}</div>`
            : '<p style="font-size:13px; color:#888;">لا توجد حساسية مسجّلة</p>'
        }
      </div>
    `;
  }

  if (exportType === 'full') {
    content += `
      <div class="section">
        <h2>📅 البروتوكول اليومي المقترح</h2>
        <div class="info-row">
          <span class="info-label">🌅 الصباح (مع الإفطار):</span>
        </div>
        <div style="padding: 4px 0 8px 16px; font-size: 13px; color: #444;">
          فيتامين D3 + أوميغا 3 + فيتامين B12
        </div>
        <div class="info-row">
          <span class="info-label">☀️ منتصف النهار:</span>
        </div>
        <div style="padding: 4px 0 8px 16px; font-size: 13px; color: #444;">
          الزنك (مع الطعام)
        </div>
        <div class="info-row">
          <span class="info-label">🌙 المساء (قبل النوم):</span>
        </div>
        <div style="padding: 4px 0 8px 16px; font-size: 13px; color: #444;">
          المغنيسيوم
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>الملف الصحي — علم المكملات</title>
      ${baseStyle}
    </head>
    <body>
      <div class="header">
        <h1>🧬 الملف الصحي الشخصي</h1>
        <p>تطبيق علم المكملات الغذائية — ${today}</p>
      </div>
      ${content}
      <div class="disclaimer">
        ⚠️ <strong>تنبيه طبي:</strong> هذا التقرير للأغراض المعلوماتية فقط ولا يُغني عن استشارة الطبيب أو الصيدلاني المختص. استشر طبيبك قبل البدء بأي نظام مكملات.
      </div>
      <div class="footer">
        تم إنشاء هذا التقرير بواسطة تطبيق علم المكملات الغذائية<br/>
        جميع المعلومات مبنية على أحدث الدراسات العلمية المحكّمة
      </div>
    </body>
    </html>
  `;
}

export default function ExportPDFScreen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('full');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      // Load health profile from AsyncStorage
      const profileData = await AsyncStorage.getItem('healthProfile');
      const supplementsData = await AsyncStorage.getItem('mySupplements');
      
      const profile: HealthProfile = profileData ? JSON.parse(profileData) : {};
      if (supplementsData) {
        const supplements = JSON.parse(supplementsData);
        profile.supplements = supplements.map((s: { name: string; dose?: string; frequency?: string }) => 
          `${s.name}${s.dose ? ' — ' + s.dose : ''}${s.frequency ? ' — ' + s.frequency : ''}`
        );
      }

      const html = generateHealthProfileHTML(profile, selectedOption);

      if (Platform.OS === 'web') {
        // On web, open print dialog
        await Print.printAsync({ html });
      } else {
        // On mobile, generate PDF and share
        const { uri } = await Print.printToFileAsync({ html });
        await shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: 'مشاركة الملف الصحي',
        });
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء إنشاء الملف. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      const profileData = await AsyncStorage.getItem('healthProfile');
      const profile: HealthProfile = profileData ? JSON.parse(profileData) : {};
      const html = generateHealthProfileHTML(profile, selectedOption);
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء الطباعة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>→</Text>
          </TouchableOpacity>
          <Text style={styles.title}>تصدير الملف الصحي</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.descIcon}>📄</Text>
          <Text style={styles.descText}>
            صدّر ملفك الصحي الشخصي كـ PDF احترافي يمكنك مشاركته مع طبيبك أو صيدلانيك
          </Text>
        </View>

        {/* Export Options */}
        <Text style={styles.sectionTitle}>اختر نوع التقرير</Text>
        {EXPORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCard, selectedOption === option.id && styles.optionCardSelected]}
            onPress={() => setSelectedOption(option.id)}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <View>
                <Text style={[styles.optionLabel, selectedOption === option.id && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
                <Text style={styles.optionDesc}>{option.desc}</Text>
              </View>
            </View>
            <View style={[styles.radio, selectedOption === option.id && styles.radioSelected]}>
              {selectedOption === option.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* What's included */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 ما يتضمنه التقرير</Text>
          <Text style={styles.infoItem}>• البيانات الشخصية (العمر، الوزن، الطول)</Text>
          <Text style={styles.infoItem}>• الأهداف الصحية المحددة</Text>
          <Text style={styles.infoItem}>• قائمة المكملات الحالية والجرعات</Text>
          <Text style={styles.infoItem}>• الأمراض المزمنة والأدوية</Text>
          <Text style={styles.infoItem}>• البروتوكول اليومي المقترح</Text>
          <Text style={styles.infoItem}>• تحذيرات التفاعلات الدوائية</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[styles.exportBtn, isGenerating && styles.btnDisabled]}
          onPress={handleExport}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.exportBtnText}>📤 تصدير ومشاركة PDF</Text>
          )}
        </TouchableOpacity>

        {Platform.OS !== 'web' && (
          <TouchableOpacity
            style={[styles.printBtn, isGenerating && styles.btnDisabled]}
            onPress={handlePrint}
            disabled={isGenerating}
          >
            <Text style={styles.printBtnText}>🖨️ طباعة مباشرة</Text>
          </TouchableOpacity>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ هذا التقرير للأغراض المعلوماتية فقط. استشر طبيبك قبل اتخاذ أي قرار صحي.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: "Cairo",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: "Cairo",
  },
  descCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  descIcon: {
    fontSize: 32,
    fontFamily: "Cairo",
  },
  descText: {
    flex: 1,
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    fontFamily: "Cairo",
  },
  sectionTitle: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: "Cairo",
  },
  optionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#333',
  },
  optionCardSelected: {
    borderColor: '#d4af37',
    backgroundColor: '#1a1a2e',
  },
  optionLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionIcon: {
    fontSize: 28,
    fontFamily: "Cairo",
  },
  optionLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    fontFamily: "Cairo",
  },
  optionLabelSelected: {
    color: '#d4af37',
  },
  optionDesc: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
    fontFamily: "Cairo",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioSelected: {
    borderColor: '#d4af37',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d4af37',
  },
  infoCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  infoTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
    fontFamily: "Cairo",
  },
  infoItem: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: "Cairo",
  },
  exportBtn: {
    backgroundColor: '#d4af37',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  exportBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "Cairo",
  },
  printBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  printBtnText: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "Cairo",
  },
  disclaimer: {
    backgroundColor: '#1a1000',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3a2a00',
    marginTop: 8,
  },
  disclaimerText: {
    color: '#aaa',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'right',
    fontFamily: "Cairo",
  },
});
