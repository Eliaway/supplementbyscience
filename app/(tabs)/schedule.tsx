import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  Alert, Switch, Modal
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { COLORS, FONTS, RADIUS } from '@/constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface DoseItem {
  id: string;
  name: string;
  dose: string;
  timing: string;
  time: string; // HH:MM
  organ: 'liver' | 'heart' | 'kidney' | 'general';
  taken: boolean;
  notificationId?: string;
  enabled: boolean;
}

const PRESET_SUPPLEMENTS: Omit<DoseItem, 'id' | 'taken' | 'notificationId' | 'enabled'>[] = [
  { name: 'TUDCA', dose: '500 mg', timing: 'مع الطعام', time: '08:00', organ: 'liver' },
  { name: 'NAC', dose: '600 mg', timing: 'على معدة فارغة', time: '07:00', organ: 'liver' },
  { name: 'Milk Thistle', dose: '400 mg', timing: 'مع الطعام', time: '13:00', organ: 'liver' },
  { name: 'CoQ10 Ubiquinol', dose: '200 mg', timing: 'مع وجبة دسمة', time: '08:00', organ: 'heart' },
  { name: 'Magnesium Glycinate', dose: '400 mg', timing: 'قبل النوم', time: '22:00', organ: 'heart' },
  { name: 'Omega-3', dose: '2000 mg', timing: 'مع الطعام', time: '13:00', organ: 'heart' },
  { name: 'Astragalus', dose: '500 mg', timing: 'مع الطعام', time: '08:00', organ: 'kidney' },
  { name: 'Vitamin D3', dose: '2000 IU', timing: 'مع وجبة دسمة', time: '08:00', organ: 'general' },
];

const organColors: Record<string, string> = {
  liver: COLORS.liver,
  heart: COLORS.heart,
  kidney: COLORS.kidney,
  general: COLORS.blue,
};

const organLabels: Record<string, string> = {
  liver: '🟡 الكبد',
  heart: '❤️ القلب',
  kidney: '🟣 الكلى',
  general: '💊 عام',
};

export default function ScheduleScreen() {
  const [items, setItems] = useState<DoseItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newOrgan, setNewOrgan] = useState<DoseItem['organ']>('general');
  const [newTiming, setNewTiming] = useState('مع الطعام');
  const [filter, setFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [notifPermission, setNotifPermission] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadItems();
      checkNotifPermission();
    }, [])
  );

  const checkNotifPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotifPermission(status === 'granted');
  };

  const requestNotifPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifPermission(status === 'granted');
    if (status !== 'granted') {
      Alert.alert('الإشعارات', 'يحتاج التطبيق إذن الإشعارات لتذكيرك بمواعيد الجرعات');
    }
  };

  const loadItems = async () => {
    const saved = await AsyncStorage.getItem('doseSchedule');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  };

  const saveItems = async (newItems: DoseItem[]) => {
    setItems(newItems);
    await AsyncStorage.setItem('doseSchedule', JSON.stringify(newItems));
  };

  const scheduleNotification = async (item: DoseItem): Promise<string | undefined> => {
    if (!notifPermission) return undefined;
    try {
      const [h, m] = item.time.split(':').map(Number);
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `💊 وقت جرعة ${item.name}`,
          body: `${item.dose} — ${item.timing}`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: h,
          minute: m,
        },
      });
      return id;
    } catch {
      return undefined;
    }
  };

  const cancelNotification = async (notifId?: string) => {
    if (notifId) {
      await Notifications.cancelScheduledNotificationAsync(notifId).catch(() => {});
    }
  };

  const addPreset = async (preset: typeof PRESET_SUPPLEMENTS[0]) => {
    const existing = items.find(i => i.name === preset.name);
    if (existing) {
      Alert.alert('موجود', `${preset.name} موجود بالفعل في جدولك`);
      return;
    }
    const newItem: DoseItem = {
      ...preset,
      id: Date.now().toString(),
      taken: false,
      enabled: true,
    };
    const notifId = await scheduleNotification(newItem);
    newItem.notificationId = notifId;
    await saveItems([...items, newItem]);
  };

  const addCustom = async () => {
    if (!newName.trim() || !newDose.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الجرعة والكمية');
      return;
    }
    const newItem: DoseItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      dose: newDose.trim(),
      timing: newTiming,
      time: newTime,
      organ: newOrgan,
      taken: false,
      enabled: true,
    };
    const notifId = await scheduleNotification(newItem);
    newItem.notificationId = notifId;
    await saveItems([...items, newItem]);
    setShowAddModal(false);
    setNewName(''); setNewDose(''); setNewTime('08:00');
  };

  const toggleTaken = async (id: string) => {
    const updated = items.map(i => i.id === id ? { ...i, taken: !i.taken } : i);
    await saveItems(updated);
  };

  const toggleEnabled = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.enabled) {
      await cancelNotification(item.notificationId);
    } else {
      const notifId = await scheduleNotification(item);
      const updated = items.map(i => i.id === id ? { ...i, enabled: true, notificationId: notifId } : i);
      await saveItems(updated);
      return;
    }
    const updated = items.map(i => i.id === id ? { ...i, enabled: false } : i);
    await saveItems(updated);
  };

  const deleteItem = async (id: string) => {
    const item = items.find(i => i.id === id);
    await cancelNotification(item?.notificationId);
    await saveItems(items.filter(i => i.id !== id));
  };

  const resetDay = async () => {
    const updated = items.map(i => ({ ...i, taken: false }));
    await saveItems(updated);
  };

  // فلترة حسب الوقت
  const filterItems = (item: DoseItem) => {
    if (filter === 'all') return true;
    const h = parseInt(item.time.split(':')[0]);
    if (filter === 'morning') return h >= 6 && h < 12;
    if (filter === 'afternoon') return h >= 12 && h < 18;
    if (filter === 'evening') return h >= 18 || h < 6;
    return true;
  };

  const sortedItems = [...items].filter(filterItems).sort((a, b) => a.time.localeCompare(b.time));
  const takenCount = items.filter(i => i.taken).length;
  const progress = items.length > 0 ? (takenCount / items.length) * 100 : 0;

  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 جدول الجرعات اليومي</Text>
        <Text style={styles.headerSub}>تتبّع مكملاتك اليومية مع إشعارات تذكير</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{takenCount}/{items.length} جرعة</Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
        </View>
        {!notifPermission && (
          <Pressable style={styles.notifBanner} onPress={requestNotifPermission}>
            <Text style={styles.notifBannerText}>🔔 فعّل الإشعارات لتلقّي تذكيرات الجرعات</Text>
          </Pressable>
        )}
      </View>

      {/* Filter + Actions */}
      <View style={styles.actionRow}>
        <Pressable style={styles.resetBtn} onPress={resetDay}>
          <Text style={styles.resetBtnText}>🔄 يوم جديد</Text>
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          {([['all', 'الكل'], ['morning', '🌅 صباح'], ['afternoon', '☀️ ظهر'], ['evening', '🌙 مساء']] as const).map(([f, label]) => (
            <Pressable
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterBtnText, filter === f && { color: COLORS.success }]}>{label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

        {/* جدول الجرعات */}
        {sortedItems.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>لا توجد جرعات في جدولك</Text>
            <Text style={styles.emptySub}>أضف مكملاتك من القوائم أدناه</Text>
          </View>
        )}

        {sortedItems.map(item => (
          <View key={item.id} style={[styles.doseCard, item.taken && styles.doseCardTaken, { borderLeftColor: organColors[item.organ] }]}>
            <View style={styles.doseCardLeft}>
              <Text style={styles.doseTime}>{item.time}</Text>
              <Switch
                value={item.enabled}
                onValueChange={() => toggleEnabled(item.id)}
                trackColor={{ false: COLORS.border, true: COLORS.success + '60' }}
                thumbColor={item.enabled ? COLORS.success : COLORS.textMuted}
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </View>
            <View style={styles.doseCardCenter}>
              <Text style={[styles.doseName, item.taken && styles.doseNameTaken]}>{item.name}</Text>
              <Text style={styles.doseDose}>{item.dose} — {item.timing}</Text>
              <Text style={[styles.doseOrgan, { color: organColors[item.organ] }]}>{organLabels[item.organ]}</Text>
            </View>
            <View style={styles.doseCardRight}>
              <Pressable
                style={[styles.checkBtn, item.taken && styles.checkBtnDone]}
                onPress={() => toggleTaken(item.id)}
              >
                <Text style={styles.checkBtnText}>{item.taken ? '✅' : '⬜'}</Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={() => deleteItem(item.id)}>
                <Text style={styles.deleteBtnText}>✕</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* إضافة سريعة من القوائم الجاهزة */}
        <View style={styles.presetsSection}>
          <Text style={styles.presetTitle}>⚡ إضافة سريعة من المكملات الموصى بها</Text>
          {PRESET_SUPPLEMENTS.filter(p => !items.find(i => i.name === p.name)).map((p, i) => (
            <Pressable key={i} style={styles.presetItem} onPress={() => addPreset(p)}>
              <Text style={styles.presetAdd}>+</Text>
              <View style={styles.presetInfo}>
                <Text style={styles.presetName}>{p.name}</Text>
                <Text style={styles.presetDose}>{p.dose} — {p.timing} — {p.time}</Text>
              </View>
              <Text style={[styles.presetOrgan, { color: organColors[p.organ] }]}>{organLabels[p.organ]}</Text>
            </Pressable>
          ))}
        </View>

        {/* زر إضافة مخصص */}
        <Pressable style={styles.addCustomBtn} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addCustomBtnText}>+ إضافة مكمّل مخصص</Text>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal إضافة مخصص */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>إضافة مكمّل مخصص</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="اسم المكمّل (مثال: Zinc)"
              placeholderTextColor={COLORS.textMuted}
              value={newName}
              onChangeText={setNewName}
              textAlign="right"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="الجرعة (مثال: 30 mg)"
              placeholderTextColor={COLORS.textMuted}
              value={newDose}
              onChangeText={setNewDose}
              textAlign="right"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="وقت الأخذ (مثال: 08:00)"
              placeholderTextColor={COLORS.textMuted}
              value={newTime}
              onChangeText={setNewTime}
              textAlign="right"
              keyboardType="numbers-and-punctuation"
            />
            <View style={styles.modalRow}>
              {(['مع الطعام', 'قبل الأكل', 'قبل النوم', 'بعد التمرين'] as const).map(t => (
                <Pressable
                  key={t}
                  style={[styles.timingChip, newTiming === t && styles.timingChipActive]}
                  onPress={() => setNewTiming(t)}
                >
                  <Text style={[styles.timingChipText, newTiming === t && { color: COLORS.success }]}>{t}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.modalRow}>
              {(['liver', 'heart', 'kidney', 'general'] as const).map(o => (
                <Pressable
                  key={o}
                  style={[styles.organChip, newOrgan === o && { borderColor: organColors[o], backgroundColor: organColors[o] + '20' }]}
                  onPress={() => setNewOrgan(o)}
                >
                  <Text style={[styles.organChipText, newOrgan === o && { color: organColors[o] }]}>{organLabels[o]}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalCancel} onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalCancelText}>إلغاء</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={addCustom}>
                <Text style={styles.modalConfirmText}>إضافة</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#111111',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.success,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, fontFamily: FONTS.black, textAlign: 'center' },
  headerSub: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'center', marginTop: 3 },
  progressSection: { padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  progressPercent: { fontSize: 13, fontWeight: '700', color: COLORS.success, fontFamily: FONTS.bold },
  progressBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 3 },
  notifBanner: {
    marginTop: 10,
    backgroundColor: COLORS.warningBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.warningBorder,
    padding: 10,
    alignItems: 'center',
  },
  notifBannerText: { fontSize: 12, color: COLORS.warning, fontFamily: FONTS.bold, textAlign: 'center' },
  actionRow: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  resetBtn: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 10, paddingVertical: 7 },
  resetBtnText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  filterBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgCard, marginRight: 6 },
  filterBtnActive: { borderColor: COLORS.success, backgroundColor: COLORS.successBg },
  filterBtnText: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular },
  body: { flex: 1 },
  bodyContent: { padding: 12 },
  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, fontFamily: FONTS.bold, textAlign: 'center' },
  emptySub: { fontSize: 12, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'center' },
  doseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    gap: 10,
  },
  doseCardTaken: { opacity: 0.55 },
  doseCardLeft: { alignItems: 'center', gap: 4, minWidth: 50 },
  doseTime: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold },
  doseCardCenter: { flex: 1, alignItems: 'flex-end' },
  doseName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right' },
  doseNameTaken: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  doseDose: { fontSize: 11, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'right', marginTop: 2 },
  doseOrgan: { fontSize: 10, fontFamily: FONTS.regular, textAlign: 'right', marginTop: 2 },
  doseCardRight: { alignItems: 'center', gap: 6 },
  checkBtn: { padding: 4 },
  checkBtnDone: {},
  checkBtnText: { fontSize: 22 },
  deleteBtn: { padding: 4, backgroundColor: COLORS.errorBg, borderRadius: 6 },
  deleteBtnText: { fontSize: 11, color: COLORS.error, fontWeight: '700' },
  presetsSection: { marginTop: 16 },
  presetTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, fontFamily: FONTS.bold, textAlign: 'right', marginBottom: 10 },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 6,
    gap: 10,
  },
  presetAdd: { fontSize: 20, color: COLORS.success, fontWeight: '900', width: 24, textAlign: 'center' },
  presetInfo: { flex: 1, alignItems: 'flex-end' },
  presetName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right' },
  presetDose: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'right', marginTop: 2 },
  presetOrgan: { fontSize: 11, fontFamily: FONTS.regular },
  addCustomBtn: {
    marginTop: 14,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderStyle: 'dashed',
    padding: 14,
    alignItems: 'center',
  },
  addCustomBtnText: { fontSize: 14, color: COLORS.blue, fontFamily: FONTS.bold },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, fontFamily: FONTS.black, textAlign: 'center', marginBottom: 4 },
  modalInput: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
  },
  modalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timingChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgCard },
  timingChipActive: { borderColor: COLORS.success, backgroundColor: COLORS.successBg },
  timingChipText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  organChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgCard },
  organChipText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalCancel: { flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 12, alignItems: 'center' },
  modalCancelText: { fontSize: 14, color: COLORS.textSecondary, fontFamily: FONTS.bold },
  modalConfirm: { flex: 1, backgroundColor: COLORS.success, borderRadius: RADIUS.md, padding: 12, alignItems: 'center' },
  modalConfirmText: { fontSize: 14, color: '#000', fontFamily: FONTS.bold },
});
