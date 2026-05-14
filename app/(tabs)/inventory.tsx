import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { COLORS, RADIUS, SPACING } from '@/constants/styles';

interface SupplementItem {
  id: string;
  name: string;
  brand: string;
  dose: string;
  quantity: number;
  dailyDose: number; // عدد الكبسولات يومياً
  price: number;
  currency: 'USD' | 'SAR' | 'KWD' | 'AED';
  organ: 'liver' | 'heart' | 'kidney' | 'general' | 'hormones';
  expiryDate: string; // YYYY-MM-DD
  purchaseDate: string;
  notes: string;
  isActive: boolean;
}

const ORGAN_OPTIONS = [
  { key: 'liver',    label: 'الكبد',     emoji: '🟡', color: COLORS.liver },
  { key: 'heart',    label: 'القلب',     emoji: '❤️', color: COLORS.heart },
  { key: 'kidney',   label: 'الكلى',     emoji: '🟣', color: COLORS.kidney },
  { key: 'hormones', label: 'الهرمونات', emoji: '💉', color: '#a78bfa' },
  { key: 'general',  label: 'عام',       emoji: '💊', color: COLORS.blue },
];

const CURRENCY_OPTIONS = ['USD', 'SAR', 'KWD', 'AED'];

const STORAGE_KEY = 'supplement_inventory_v1';

function daysUntilExpiry(dateStr: string): number {
  if (!dateStr) return 999;
  const expiry = new Date(dateStr);
  const today = new Date();
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function daysRemaining(item: SupplementItem): number {
  if (!item.dailyDose || item.dailyDose === 0) return 999;
  return Math.floor(item.quantity / item.dailyDose);
}

export default function InventoryScreen() {
  const [items, setItems] = useState<SupplementItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<SupplementItem | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // حقول الإضافة
  const [form, setForm] = useState({
    name: '', brand: '', dose: '', quantity: '', dailyDose: '',
    price: '', currency: 'USD' as 'USD' | 'SAR' | 'KWD' | 'AED',
    organ: 'general' as SupplementItem['organ'],
    expiryDate: '', purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useFocusEffect(useCallback(() => { loadItems(); }, []));

  const loadItems = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) setItems(JSON.parse(raw));
  };

  const saveItems = async (newItems: SupplementItem[]) => {
    setItems(newItems);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const resetForm = () => setForm({
    name: '', brand: '', dose: '', quantity: '', dailyDose: '',
    price: '', currency: 'USD', organ: 'general',
    expiryDate: '', purchaseDate: new Date().toISOString().split('T')[0], notes: '',
  });

  const handleAdd = async () => {
    if (!form.name.trim()) { Alert.alert('تنبيه', 'أدخل اسم المكمّل'); return; }
    const newItem: SupplementItem = {
      id: Date.now().toString(),
      name: form.name.trim(),
      brand: form.brand.trim() || 'غير محدد',
      dose: form.dose.trim(),
      quantity: parseInt(form.quantity) || 0,
      dailyDose: parseInt(form.dailyDose) || 1,
      price: parseFloat(form.price) || 0,
      currency: form.currency,
      organ: form.organ,
      expiryDate: form.expiryDate,
      purchaseDate: form.purchaseDate,
      notes: form.notes.trim(),
      isActive: true,
    };
    await saveItems([...items, newItem]);
    resetForm();
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('حذف', 'هل تريد حذف هذا المكمّل؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => saveItems(items.filter(i => i.id !== id)) },
    ]);
  };

  const handleToggleActive = (id: string) => {
    saveItems(items.map(i => i.id === id ? { ...i, isActive: !i.isActive } : i));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    saveItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i));
  };

  const filteredItems = filter === 'all' ? items : items.filter(i => i.organ === filter);

  // إحصائيات
  const totalMonthly = items.filter(i => i.isActive).reduce((sum, i) => {
    const monthly = i.price * (i.dailyDose * 30) / (i.quantity || 1);
    return sum + monthly;
  }, 0);
  const expiringSoon = items.filter(i => daysUntilExpiry(i.expiryDate) <= 30 && daysUntilExpiry(i.expiryDate) > 0);
  const runningLow = items.filter(i => daysRemaining(i) <= 7 && daysRemaining(i) > 0);

  const getExpiryStatus = (item: SupplementItem) => {
    const d = daysUntilExpiry(item.expiryDate);
    if (d <= 0) return { color: COLORS.error, label: 'منتهي الصلاحية' };
    if (d <= 7) return { color: COLORS.error, label: `${d} أيام للانتهاء` };
    if (d <= 30) return { color: COLORS.warning, label: `${d} يوم للانتهاء` };
    return null;
  };

  const getStockStatus = (item: SupplementItem) => {
    const d = daysRemaining(item);
    if (d <= 0) return { color: COLORS.error, label: 'نفد المخزون' };
    if (d <= 3) return { color: COLORS.error, label: `${d} أيام متبقية` };
    if (d <= 7) return { color: COLORS.warning, label: `${d} أيام متبقية` };
    return { color: COLORS.success, label: `${d} يوم متبقي` };
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* هيدر */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.addBtn} onPress={() => { resetForm(); setShowModal(true); }}>
            <Text style={styles.addBtnText}>+ إضافة</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💊 مخزوني</Text>
        </View>

        {/* إحصائيات سريعة */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: COLORS.blueBorder }]}>
            <Text style={[styles.statValue, { color: COLORS.blue }]}>{items.length}</Text>
            <Text style={styles.statLabel}>مكمّل</Text>
          </View>
          <View style={[styles.statCard, { borderColor: COLORS.successBorder }]}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>${totalMonthly.toFixed(0)}</Text>
            <Text style={styles.statLabel}>شهرياً</Text>
          </View>
          {expiringSoon.length > 0 && (
            <View style={[styles.statCard, { borderColor: COLORS.warningBorder }]}>
              <Text style={[styles.statValue, { color: COLORS.warning }]}>{expiringSoon.length}</Text>
              <Text style={styles.statLabel}>تنتهي قريباً</Text>
            </View>
          )}
          {runningLow.length > 0 && (
            <View style={[styles.statCard, { borderColor: COLORS.errorBorder }]}>
              <Text style={[styles.statValue, { color: COLORS.error }]}>{runningLow.length}</Text>
              <Text style={styles.statLabel}>مخزون منخفض</Text>
            </View>
          )}
        </View>
      </View>

      {/* فلاتر */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ gap: 8, paddingHorizontal: SPACING.lg }}>
        <TouchableOpacity style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]} onPress={() => setFilter('all')}>
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>الكل ({items.length})</Text>
        </TouchableOpacity>
        {ORGAN_OPTIONS.map(o => {
          const count = items.filter(i => i.organ === o.key).length;
          if (count === 0) return null;
          return (
            <TouchableOpacity key={o.key} style={[styles.filterBtn, filter === o.key && { borderColor: o.color, backgroundColor: o.color + '15' }]} onPress={() => setFilter(o.key)}>
              <Text style={[styles.filterText, filter === o.key && { color: o.color }]}>{o.emoji} {o.label} ({count})</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* قائمة المكملات */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 56 }}>💊</Text>
          <Text style={styles.emptyTitle}>لا يوجد مكملات في المخزون</Text>
          <Text style={styles.emptySub}>اضغط "+ إضافة" لإضافة مكملاتك الحالية</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: SPACING.md, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const organInfo = ORGAN_OPTIONS.find(o => o.key === item.organ);
            const expiryStatus = getExpiryStatus(item);
            const stockStatus = getStockStatus(item);
            return (
              <View style={[styles.itemCard, !item.isActive && { opacity: 0.5 }]}>
                {/* رأس البطاقة */}
                <View style={styles.itemHeader}>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.deleteBtn}>✕</Text>
                  </TouchableOpacity>
                  <View style={styles.itemTitleRow}>
                    <Text style={[styles.organBadge, { backgroundColor: (organInfo?.color || COLORS.blue) + '20', color: organInfo?.color || COLORS.blue }]}>
                      {organInfo?.emoji} {organInfo?.label}
                    </Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>
                </View>

                {/* تفاصيل */}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemBrand}>{item.brand}</Text>
                  <Text style={styles.itemDose}>{item.dose}</Text>
                </View>

                {/* تنبيهات */}
                {expiryStatus && (
                  <View style={[styles.alertBadge, { backgroundColor: expiryStatus.color + '15', borderColor: expiryStatus.color + '40' }]}>
                    <Text style={[styles.alertText, { color: expiryStatus.color }]}>⚠️ {expiryStatus.label}</Text>
                  </View>
                )}

                {/* المخزون */}
                <View style={styles.stockRow}>
                  <View style={styles.stockInfo}>
                    <Text style={[styles.stockDays, { color: stockStatus.color }]}>{stockStatus.label}</Text>
                    <Text style={styles.stockCount}>{item.quantity} كبسولة متبقية</Text>
                  </View>
                  <View style={styles.stockControls}>
                    <TouchableOpacity style={styles.stockBtn} onPress={() => handleUpdateQuantity(item.id, -1)}>
                      <Text style={styles.stockBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.stockQty}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.stockBtn} onPress={() => handleUpdateQuantity(item.id, 1)}>
                      <Text style={styles.stockBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* السعر */}
                {item.price > 0 && (
                  <Text style={styles.priceText}>{item.price} {item.currency} / عبوة</Text>
                )}

                {/* تفعيل/تعطيل */}
                <TouchableOpacity style={[styles.toggleBtn, item.isActive && { borderColor: COLORS.successBorder }]} onPress={() => handleToggleActive(item.id)}>
                  <Text style={[styles.toggleBtnText, item.isActive && { color: COLORS.success }]}>
                    {item.isActive ? '✅ نشط' : '⏸️ متوقف'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {/* Modal إضافة مكمّل */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>إضافة مكمّل جديد</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* الاسم والشركة */}
              <Text style={styles.fieldLabel}>اسم المكمّل *</Text>
              <TextInput style={styles.input} value={form.name} onChangeText={v => setForm(p => ({ ...p, name: v }))} placeholder="مثال: TUDCA" placeholderTextColor={COLORS.textMuted} textAlign="right" />

              <Text style={styles.fieldLabel}>الشركة المصنّعة</Text>
              <TextInput style={styles.input} value={form.brand} onChangeText={v => setForm(p => ({ ...p, brand: v }))} placeholder="مثال: Jarrow Formulas" placeholderTextColor={COLORS.textMuted} textAlign="right" />

              <Text style={styles.fieldLabel}>الجرعة</Text>
              <TextInput style={styles.input} value={form.dose} onChangeText={v => setForm(p => ({ ...p, dose: v }))} placeholder="مثال: 500 mg" placeholderTextColor={COLORS.textMuted} textAlign="right" />

              {/* الكمية والجرعة اليومية */}
              <View style={styles.row2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>عدد الكبسولات</Text>
                  <TextInput style={styles.input} value={form.quantity} onChangeText={v => setForm(p => ({ ...p, quantity: v }))} keyboardType="numeric" placeholder="60" placeholderTextColor={COLORS.textMuted} textAlign="center" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>جرعة يومية</Text>
                  <TextInput style={styles.input} value={form.dailyDose} onChangeText={v => setForm(p => ({ ...p, dailyDose: v }))} keyboardType="numeric" placeholder="1" placeholderTextColor={COLORS.textMuted} textAlign="center" />
                </View>
              </View>

              {/* السعر والعملة */}
              <Text style={styles.fieldLabel}>السعر</Text>
              <View style={styles.row2}>
                <TextInput style={[styles.input, { flex: 2 }]} value={form.price} onChangeText={v => setForm(p => ({ ...p, price: v }))} keyboardType="numeric" placeholder="0.00" placeholderTextColor={COLORS.textMuted} textAlign="center" />
                <View style={styles.currencyRow}>
                  {CURRENCY_OPTIONS.map(c => (
                    <TouchableOpacity key={c} style={[styles.currencyBtn, form.currency === c && styles.currencyBtnActive]} onPress={() => setForm(p => ({ ...p, currency: c as any }))}>
                      <Text style={[styles.currencyText, form.currency === c && { color: COLORS.blue }]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* العضو */}
              <Text style={styles.fieldLabel}>العضو المستهدف</Text>
              <View style={styles.organRow}>
                {ORGAN_OPTIONS.map(o => (
                  <TouchableOpacity key={o.key} style={[styles.organBtn, form.organ === o.key && { borderColor: o.color, backgroundColor: o.color + '15' }]} onPress={() => setForm(p => ({ ...p, organ: o.key as any }))}>
                    <Text style={{ fontSize: 18 }}>{o.emoji}</Text>
                    <Text style={[styles.organBtnText, form.organ === o.key && { color: o.color }]}>{o.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* تاريخ الانتهاء */}
              <Text style={styles.fieldLabel}>تاريخ الانتهاء (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} value={form.expiryDate} onChangeText={v => setForm(p => ({ ...p, expiryDate: v }))} placeholder="2026-12-31" placeholderTextColor={COLORS.textMuted} textAlign="right" />

              {/* ملاحظات */}
              <Text style={styles.fieldLabel}>ملاحظات</Text>
              <TextInput style={[styles.input, { height: 70 }]} value={form.notes} onChangeText={v => setForm(p => ({ ...p, notes: v }))} placeholder="أي ملاحظات إضافية..." placeholderTextColor={COLORS.textMuted} multiline textAlign="right" />

              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveBtnText}>💊 إضافة إلى المخزون</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.bg, padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary },
  addBtn: { backgroundColor: COLORS.blue, borderRadius: RADIUS.md, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: '#000', fontWeight: '900', fontSize: 13 },

  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, padding: SPACING.sm, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 9, color: COLORS.textMuted, marginTop: 2 },

  filterScroll: { maxHeight: 48, paddingVertical: 8 },
  filterBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.bgCard },
  filterBtnActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  filterText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  filterTextActive: { color: COLORS.blue },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  emptySub: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },

  itemCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, padding: SPACING.md },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  itemTitleRow: { flex: 1, alignItems: 'flex-end', gap: 4 },
  itemName: { fontSize: 15, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'right' },
  organBadge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  deleteBtn: { color: COLORS.error, fontSize: 16, padding: 4 },
  itemDetails: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginBottom: 8 },
  itemBrand: { fontSize: 11, color: COLORS.textMuted },
  itemDose: { fontSize: 11, color: COLORS.textAccent, fontWeight: '700' },

  alertBadge: { borderWidth: 1, borderRadius: RADIUS.sm, padding: 6, marginBottom: 8 },
  alertText: { fontSize: 11, fontWeight: '700', textAlign: 'right' },

  stockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stockInfo: { alignItems: 'flex-end' },
  stockDays: { fontSize: 12, fontWeight: '700' },
  stockCount: { fontSize: 10, color: COLORS.textMuted },
  stockControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stockBtn: { backgroundColor: COLORS.bgSection, borderRadius: RADIUS.sm, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  stockBtnText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  stockQty: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, minWidth: 30, textAlign: 'center' },

  priceText: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginBottom: 8 },
  toggleBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, padding: 6, alignItems: 'center' },
  toggleBtnText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary },
  modalClose: { color: COLORS.textMuted, fontSize: 20, padding: 4 },

  fieldLabel: { fontSize: 11, color: COLORS.textAccent, fontWeight: '700', textAlign: 'right', marginBottom: 6, marginTop: SPACING.sm },
  input: { backgroundColor: COLORS.bgInput, borderWidth: 1, borderColor: COLORS.borderLight, borderRadius: RADIUS.md, padding: SPACING.md, color: COLORS.textPrimary, fontSize: 13, textAlign: 'right', marginBottom: 4 },
  row2: { flexDirection: 'row', gap: 8 },

  currencyRow: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  currencyBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 6 },
  currencyBtnActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  currencyText: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700' },

  organRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  organBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 8, alignItems: 'center', minWidth: 60 },
  organBtnText: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  saveBtn: { backgroundColor: COLORS.blue, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.lg, marginBottom: 40 },
  saveBtnText: { color: '#000', fontWeight: '900', fontSize: 14 },
});
