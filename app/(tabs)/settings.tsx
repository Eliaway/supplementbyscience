import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, Share, Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { COLORS, RADIUS, SPACING } from '@/constants/styles';

type Language = 'ar' | 'en';

interface AppSettings {
  language: Language;
  darkMode: boolean;
  notificationsEnabled: boolean;
  waterReminder: boolean;
  waterReminderInterval: number; // hours
  showScientificRefs: boolean;
  compactView: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'ar',
  darkMode: true,
  notificationsEnabled: true,
  waterReminder: false,
  waterReminderInterval: 2,
  showScientificRefs: true,
  compactView: false,
};

const SETTINGS_KEY = 'app_settings_v1';

const TEXTS = {
  ar: {
    title: '⚙️ الإعدادات',
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
    appearance: 'المظهر',
    darkMode: 'الوضع الداكن',
    notifications: 'الإشعارات',
    enableNotif: 'تفعيل الإشعارات',
    waterReminder: 'تذكير شرب الماء',
    waterInterval: 'كل {n} ساعات',
    display: 'العرض',
    showRefs: 'إظهار المراجع العلمية',
    compactView: 'العرض المضغوط',
    data: 'البيانات',
    exportAll: 'تصدير جميع البيانات',
    clearAll: 'مسح جميع البيانات',
    about: 'حول التطبيق',
    version: 'الإصدار 2.0.0',
    developer: 'تطبيق علمي لمقارنة مكملات صحة الأعضاء',
    rateApp: 'تقييم التطبيق',
    shareApp: 'مشاركة التطبيق',
    feedback: 'إرسال ملاحظات',
    clearConfirm: 'هل تريد مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.',
    clearCancel: 'إلغاء',
    clearOk: 'مسح',
    exportSuccess: 'تم تصدير البيانات بنجاح',
    saved: 'تم الحفظ',
  },
  en: {
    title: '⚙️ Settings',
    language: 'Language',
    arabic: 'العربية',
    english: 'English',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    enableNotif: 'Enable Notifications',
    waterReminder: 'Water Reminder',
    waterInterval: 'Every {n} hours',
    display: 'Display',
    showRefs: 'Show Scientific References',
    compactView: 'Compact View',
    data: 'Data',
    exportAll: 'Export All Data',
    clearAll: 'Clear All Data',
    about: 'About',
    version: 'Version 2.0.0',
    developer: 'Scientific app for organ health supplement comparison',
    rateApp: 'Rate App',
    shareApp: 'Share App',
    feedback: 'Send Feedback',
    clearConfirm: 'Are you sure you want to clear all data? This cannot be undone.',
    clearCancel: 'Cancel',
    clearOk: 'Clear',
    exportSuccess: 'Data exported successfully',
    saved: 'Saved',
  },
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => { loadSettings(); }, []));

  const loadSettings = async () => {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
  };

  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const t = TEXTS[settings.language];
  const isRTL = settings.language === 'ar';

  const handleExportAll = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const pairs = await AsyncStorage.multiGet(keys);
      const data: Record<string, any> = {};
      pairs.forEach(([k, v]) => { if (v) data[k] = JSON.parse(v); });
      const json = JSON.stringify(data, null, 2);
      await Share.share({
        message: json,
        title: isRTL ? 'بيانات التطبيق' : 'App Data',
      });
    } catch (e) {
      Alert.alert('خطأ', 'فشل تصدير البيانات');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      isRTL ? 'تحذير' : 'Warning',
      t.clearConfirm,
      [
        { text: t.clearCancel, style: 'cancel' },
        {
          text: t.clearOk, style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            setSettings(DEFAULT_SETTINGS);
          }
        },
      ]
    );
  };

  const handleShareApp = async () => {
    await Share.share({
      message: isRTL
        ? 'تطبيق لوحة المقارنة العلمية — أفضل تطبيق لمقارنة مكملات صحة الكبد والقلب والكلى'
        : 'Organ Health Compare — Best app for comparing liver, heart & kidney supplements',
    });
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t.title}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* اللغة */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t.language}</Text>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, settings.language === 'en' && styles.langBtnActive]}
              onPress={() => updateSetting('language', 'en')}
            >
              <Text style={[styles.langBtnText, settings.language === 'en' && styles.langBtnTextActive]}>🇺🇸 {t.english}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, settings.language === 'ar' && styles.langBtnActive]}
              onPress={() => updateSetting('language', 'ar')}
            >
              <Text style={[styles.langBtnText, settings.language === 'ar' && styles.langBtnTextActive]}>🇸🇦 {t.arabic}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* المظهر */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t.appearance}</Text>
          <View style={styles.settingRow}>
            <Switch
              value={settings.darkMode}
              onValueChange={v => updateSetting('darkMode', v)}
              trackColor={{ false: COLORS.border, true: COLORS.blue }}
              thumbColor={settings.darkMode ? '#fff' : '#888'}
            />
            <Text style={[styles.settingLabel, isRTL && { textAlign: 'right' }]}>{t.darkMode}</Text>
          </View>
        </View>

        {/* الإشعارات */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t.notifications}</Text>
          <View style={styles.settingRow}>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={v => updateSetting('notificationsEnabled', v)}
              trackColor={{ false: COLORS.border, true: COLORS.success }}
              thumbColor={settings.notificationsEnabled ? '#fff' : '#888'}
            />
            <Text style={[styles.settingLabel, isRTL && { textAlign: 'right' }]}>{t.enableNotif}</Text>
          </View>
          <View style={styles.settingRow}>
            <Switch
              value={settings.waterReminder}
              onValueChange={v => updateSetting('waterReminder', v)}
              trackColor={{ false: COLORS.border, true: COLORS.blue }}
              thumbColor={settings.waterReminder ? '#fff' : '#888'}
            />
            <Text style={[styles.settingLabel, isRTL && { textAlign: 'right' }]}>{t.waterReminder}</Text>
          </View>
          {settings.waterReminder && (
            <View style={styles.intervalRow}>
              {[1, 2, 3, 4].map(n => (
                <TouchableOpacity
                  key={n}
                  style={[styles.intervalBtn, settings.waterReminderInterval === n && styles.intervalBtnActive]}
                  onPress={() => updateSetting('waterReminderInterval', n)}
                >
                  <Text style={[styles.intervalText, settings.waterReminderInterval === n && styles.intervalTextActive]}>
                    {t.waterInterval.replace('{n}', String(n))}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* العرض */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t.display}</Text>
          <View style={styles.settingRow}>
            <Switch
              value={settings.showScientificRefs}
              onValueChange={v => updateSetting('showScientificRefs', v)}
              trackColor={{ false: COLORS.border, true: COLORS.blue }}
              thumbColor={settings.showScientificRefs ? '#fff' : '#888'}
            />
            <Text style={[styles.settingLabel, isRTL && { textAlign: 'right' }]}>{t.showRefs}</Text>
          </View>
          <View style={styles.settingRow}>
            <Switch
              value={settings.compactView}
              onValueChange={v => updateSetting('compactView', v)}
              trackColor={{ false: COLORS.border, true: COLORS.blue }}
              thumbColor={settings.compactView ? '#fff' : '#888'}
            />
            <Text style={[styles.settingLabel, isRTL && { textAlign: 'right' }]}>{t.compactView}</Text>
          </View>
        </View>

        {/* البيانات */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t.data}</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={handleExportAll}>
            <Text style={styles.actionBtnText}>📤 {t.exportAll}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.dangerBtn]} onPress={handleClearAll}>
            <Text style={[styles.actionBtnText, { color: COLORS.error }]}>🗑️ {t.clearAll}</Text>
          </TouchableOpacity>
        </View>

        {/* حول التطبيق */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t.about}</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.appName}>🔬 لوحة المقارنة العلمية</Text>
            <Text style={styles.appVersion}>{t.version}</Text>
            <Text style={styles.appDesc}>{t.developer}</Text>
          </View>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShareApp}>
            <Text style={styles.actionBtnText}>📲 {t.shareApp}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL('mailto:feedback@example.com')}>
            <Text style={styles.actionBtnText}>📧 {t.feedback}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.bg },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary },
  body: { flex: 1, backgroundColor: COLORS.bg },

  section: { padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.textAccent, marginBottom: SPACING.md, textTransform: 'uppercase', letterSpacing: 1 },

  langRow: { flexDirection: 'row', gap: 8 },
  langBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', backgroundColor: COLORS.bgCard },
  langBtnActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  langBtnText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  langBtnTextActive: { color: COLORS.blue, fontWeight: '900' },

  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  settingLabel: { fontSize: 14, color: COLORS.textPrimary, flex: 1 },

  intervalRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: SPACING.sm },
  intervalBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLORS.bgCard },
  intervalBtnActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  intervalText: { fontSize: 11, color: COLORS.textMuted },
  intervalTextActive: { color: COLORS.blue, fontWeight: '700' },

  actionBtn: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, alignItems: 'center' },
  dangerBtn: { borderColor: COLORS.errorBorder, backgroundColor: COLORS.errorBg },
  actionBtnText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '600' },

  aboutCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md },
  appName: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 4 },
  appVersion: { fontSize: 12, color: COLORS.blue, marginBottom: 8 },
  appDesc: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
});
