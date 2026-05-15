/**
 * تنبيهات انتهاء الصلاحية والمخزون
 * Feature: 25
 */
import { useState, useEffect } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface SupplementItem {
  id: string;
  name: string;
  expiryDate: string;
  quantity: number;
  minQuantity: number;
  unit: string;
}

const STORAGE_KEY = "expiry_alerts_data";

export default function ExpiryAlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [items, setItems] = useState<SupplementItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", expiryDate: "", quantity: "", minQuantity: "", unit: "حبة" });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setItems(JSON.parse(data));
      else {
        // Sample data
        const sampleItems: SupplementItem[] = [
          { id: "1", name: "فيتامين D3", expiryDate: "2025-03-15", quantity: 15, minQuantity: 10, unit: "حبة" },
          { id: "2", name: "أوميغا-3", expiryDate: "2025-08-20", quantity: 45, minQuantity: 20, unit: "كبسولة" },
          { id: "3", name: "مغنيسيوم", expiryDate: "2024-12-01", quantity: 5, minQuantity: 15, unit: "حبة" },
          { id: "4", name: "زنك", expiryDate: "2025-06-10", quantity: 30, minQuantity: 10, unit: "حبة" },
        ];
        setItems(sampleItems);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleItems));
      }
    } catch {}
  };

  const saveItems = async (updated: SupplementItem[]) => {
    setItems(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.expiryDate) {
      Alert.alert("خطأ", "يرجى إدخال اسم المكمل وتاريخ الانتهاء");
      return;
    }
    const item: SupplementItem = {
      id: Date.now().toString(),
      name: newItem.name,
      expiryDate: newItem.expiryDate,
      quantity: parseInt(newItem.quantity) || 0,
      minQuantity: parseInt(newItem.minQuantity) || 10,
      unit: newItem.unit,
    };
    const updated = [...items, item];
    await saveItems(updated);
    setNewItem({ name: "", expiryDate: "", quantity: "", minQuantity: "", unit: "حبة" });
    setShowAdd(false);
  };

  const deleteItem = async (id: string) => {
    Alert.alert("حذف", "هل تريد حذف هذا المكمل؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: async () => {
        const updated = items.filter(i => i.id !== id);
        await saveItems(updated);
      }},
    ]);
  };

  const getStatus = (item: SupplementItem) => {
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const lowStock = item.quantity <= item.minQuantity;

    if (daysLeft < 0) return { label: "منتهي الصلاحية", color: "#EF4444", icon: "exclamationmark.circle.fill" as const };
    if (daysLeft <= 30) return { label: `ينتهي خلال ${daysLeft} يوم`, color: "#F59E0B", icon: "exclamationmark.triangle.fill" as const };
    if (lowStock) return { label: "مخزون منخفض", color: "#F97316", icon: "cart.fill" as const };
    return { label: `${daysLeft} يوم متبقي`, color: "#10B981", icon: "checkmark.circle.fill" as const };
  };

  const expiredCount = items.filter(i => new Date(i.expiryDate) < new Date()).length;
  const lowStockCount = items.filter(i => i.quantity <= i.minQuantity).length;
  const soonCount = items.filter(i => {
    const daysLeft = Math.floor((new Date(i.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= 30;
  }).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>تنبيهات الصلاحية والمخزون 📦</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={() => setShowAdd(!showAdd)}>
          <Text style={styles.addBtnText}>+ إضافة</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {/* Summary */}
        <View style={styles.summaryRow}>
          {[
            { label: "منتهية", count: expiredCount, color: "#EF4444" },
            { label: "تنتهي قريباً", count: soonCount, color: "#F59E0B" },
            { label: "مخزون منخفض", count: lowStockCount, color: "#F97316" },
          ].map((s, i) => (
            <View key={i} style={[styles.summaryCard, { backgroundColor: s.color + "15", borderColor: s.color + "30" }]}>
              <Text style={[styles.summaryCount, { color: s.color }]}>{s.count}</Text>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Add Form */}
        {showAdd && (
          <View style={[styles.addForm, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>إضافة مكمل جديد</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
              placeholder="اسم المكمل"
              placeholderTextColor={colors.muted}
              value={newItem.name}
              onChangeText={t => setNewItem(p => ({ ...p, name: t }))}
              textAlign="right"
            />
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
              placeholder="تاريخ الانتهاء (YYYY-MM-DD)"
              placeholderTextColor={colors.muted}
              value={newItem.expiryDate}
              onChangeText={t => setNewItem(p => ({ ...p, expiryDate: t }))}
              textAlign="right"
            />
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.inputHalf, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                placeholder="الكمية الحالية"
                placeholderTextColor={colors.muted}
                value={newItem.quantity}
                onChangeText={t => setNewItem(p => ({ ...p, quantity: t }))}
                keyboardType="numeric"
                textAlign="right"
              />
              <TextInput
                style={[styles.inputHalf, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                placeholder="الحد الأدنى"
                placeholderTextColor={colors.muted}
                value={newItem.minQuantity}
                onChangeText={t => setNewItem(p => ({ ...p, minQuantity: t }))}
                keyboardType="numeric"
                textAlign="right"
              />
            </View>
            <Pressable style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={addItem}>
              <Text style={styles.saveBtnText}>حفظ</Text>
            </Pressable>
          </View>
        )}

        {/* Items List */}
        {items.map((item) => {
          const status = getStatus(item);
          return (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: status.color + "30" }]}>
              <View style={styles.itemHeader}>
                <Pressable onPress={() => deleteItem(item.id)}>
                  <IconSymbol name="trash.fill" size={16} color={colors.error} />
                </Pressable>
                <View style={[styles.statusBadge, { backgroundColor: status.color + "15" }]}>
                  <IconSymbol name={status.icon} size={12} color={status.color} />
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
                <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
              </View>
              <View style={styles.itemDetails}>
                <Text style={[styles.itemDetail, { color: colors.muted }]}>
                  📅 {item.expiryDate}
                </Text>
                <Text style={[styles.itemDetail, { color: item.quantity <= item.minQuantity ? "#F97316" : colors.muted }]}>
                  📦 {item.quantity} {item.unit} (الحد الأدنى: {item.minQuantity})
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right" },
  addBtn: { alignSelf: "flex-end", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  summaryRow: { flexDirection: "row-reverse", gap: 8 },
  summaryCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 10, alignItems: "center" },
  summaryCount: { fontSize: 24, fontWeight: "900" },
  summaryLabel: { fontSize: 10, textAlign: "center", marginTop: 2 },
  addForm: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  formTitle: { fontSize: 14, fontWeight: "800", textAlign: "right" },
  input: { borderRadius: 10, borderWidth: 1, padding: 10, fontSize: 13 },
  inputRow: { flexDirection: "row-reverse", gap: 8 },
  inputHalf: { flex: 1, borderRadius: 10, borderWidth: 1, padding: 10, fontSize: 13 },
  saveBtn: { borderRadius: 10, padding: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  itemCard: { borderRadius: 14, borderWidth: 1, padding: 12, gap: 8 },
  itemHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  itemName: { flex: 1, fontSize: 14, fontWeight: "800", textAlign: "right" },
  statusBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: "700" },
  itemDetails: { gap: 4 },
  itemDetail: { fontSize: 11, textAlign: "right" },
});
