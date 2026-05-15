/**
 * قائمة التسوق الذكية — Smart Shopping List
 * Feature #55
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, FlatList, I18nManager, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface ShoppingItem {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  priority: "ضروري" | "مهم" | "اختياري";
  price: string;
  notes: string;
  checked: boolean;
  addedAt: string;
}

const STORAGE_KEY = "shopping_list_v1";

const SUGGESTED_ITEMS: Omit<ShoppingItem, "id" | "checked" | "addedAt">[] = [
  { name: "فيتامين D3 5000 IU", nameEn: "Vitamin D3", category: "الفيتامينات", priority: "ضروري", price: "20-50 ريال", notes: "مع K2 للامتصاص الأفضل" },
  { name: "أوميغا-3 rTG", nameEn: "Omega-3 rTG", category: "الدهون", priority: "ضروري", price: "80-150 ريال", notes: "ابحث عن شكل rTG" },
  { name: "المغنيسيوم Glycinate", nameEn: "Magnesium Glycinate", category: "المعادن", priority: "ضروري", price: "40-80 ريال", notes: "للنوم والعضلات" },
  { name: "الزنك Picolinate", nameEn: "Zinc Picolinate", category: "المعادن", priority: "مهم", price: "25-50 ريال", notes: "25-30 مغ يومياً" },
  { name: "الكرياتين Monohydrate", nameEn: "Creatine Monohydrate", category: "الرياضة", priority: "مهم", price: "50-100 ريال", notes: "5 غ يومياً" },
  { name: "Ashwagandha KSM-66", nameEn: "Ashwagandha KSM-66", category: "الأعشاب", priority: "مهم", price: "60-120 ريال", notes: "600 مغ يومياً" },
  { name: "فيتامين B12 Methylcobalamin", nameEn: "B12 Methylcobalamin", category: "الفيتامينات", priority: "مهم", price: "20-40 ريال", notes: "1000 مكغ يومياً" },
  { name: "Probiotics 50 مليار CFU", nameEn: "Probiotics", category: "الهضم", priority: "اختياري", price: "80-200 ريال", notes: "متعدد السلالات" },
  { name: "CoQ10 Ubiquinol", nameEn: "CoQ10 Ubiquinol", category: "القلب", priority: "اختياري", price: "100-200 ريال", notes: "200 مغ مع الطعام" },
  { name: "Whey Protein Isolate", nameEn: "Whey Isolate", category: "البروتين", priority: "اختياري", price: "150-300 ريال", notes: "25-40 غ بعد التمرين" },
];

export default function ShoppingListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [filter, setFilter] = useState<"all" | "ضروري" | "مهم" | "اختياري" | "checked">("all");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setItems(JSON.parse(data));
    });
  }, []);

  const save = async (updated: ShoppingItem[]) => {
    setItems(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addSuggested = (suggested: typeof SUGGESTED_ITEMS[0]) => {
    const exists = items.find((i) => i.name === suggested.name);
    if (exists) { Alert.alert("موجود بالفعل", `${suggested.name} موجود في قائمتك`); return; }
    const newItem: ShoppingItem = { ...suggested, id: Date.now().toString(), checked: false, addedAt: new Date().toISOString() };
    save([...items, newItem]);
  };

  const toggleItem = (id: string) => {
    save(items.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const removeItem = (id: string) => {
    Alert.alert("حذف", "هل تريد حذف هذا المنتج من القائمة؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => save(items.filter((i) => i.id !== id)) },
    ]);
  };

  const clearChecked = () => {
    Alert.alert("مسح المشتريات", "هل تريد مسح جميع العناصر المشتراة؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "مسح", style: "destructive", onPress: () => save(items.filter((i) => !i.checked)) },
    ]);
  };

  const filtered = filter === "all" ? items : filter === "checked" ? items.filter((i) => i.checked) : items.filter((i) => i.priority === filter);
  const checkedCount = items.filter((i) => i.checked).length;
  const priorityColor = (p: string) => p === "ضروري" ? colors.error : p === "مهم" ? colors.warning : colors.success;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={22} color={colors.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>قائمة التسوق الذكية</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{items.length} منتج — {checkedCount} مشترى</Text>
        </View>
        {checkedCount > 0 && (
          <Pressable style={[styles.clearBtn, { backgroundColor: colors.error + "15" }]} onPress={clearChecked}>
            <Text style={[styles.clearBtnText, { color: colors.error }]}>مسح المشترى</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ gap: 14 }}>
            <View style={{ flexDirection: "row-reverse", gap: 8, flexWrap: "wrap" }}>
              {(["all", "ضروري", "مهم", "اختياري", "checked"] as const).map((f) => (
                <Pressable key={f}
                  style={[styles.filterChip, { backgroundColor: filter === f ? colors.primary : colors.surface, borderColor: colors.border }]}
                  onPress={() => setFilter(f)}>
                  <Text style={[styles.filterChipText, { color: filter === f ? "#fff" : colors.muted }]}>
                    {f === "all" ? "الكل" : f === "checked" ? "المشترى" : f}
                  </Text>
                </Pressable>
              ))}
            </View>
            {items.length === 0 && (
              <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
                <IconSymbol name="cart.fill" size={40} color={colors.muted} />
                <Text style={[styles.emptyText, { color: colors.muted }]}>قائمتك فارغة — أضف منتجات من الاقتراحات أدناه</Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={{ gap: 12, marginTop: 20 }}>
            <Text style={[styles.suggestionsTitle, { color: colors.foreground }]}>اقتراحات ذكية</Text>
            {SUGGESTED_ITEMS.map((s, i) => {
              const alreadyAdded = items.some((item) => item.name === s.name);
              return (
                <View key={i} style={[styles.suggestionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.suggestionTop}>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <Text style={[styles.suggestionName, { color: colors.foreground }]}>{s.name}</Text>
                      <Text style={[styles.suggestionNameEn, { color: colors.muted }]}>{s.nameEn}</Text>
                    </View>
                    <View style={[styles.priorityBadge, { backgroundColor: priorityColor(s.priority) + "15" }]}>
                      <Text style={[styles.priorityText, { color: priorityColor(s.priority) }]}>{s.priority}</Text>
                    </View>
                  </View>
                  <View style={styles.suggestionBottom}>
                    <Text style={[styles.suggestionPrice, { color: colors.muted }]}>{s.price}</Text>
                    <Text style={[styles.suggestionNotes, { color: colors.muted }]}>{s.notes}</Text>
                    <Pressable
                      style={[styles.addBtn, { backgroundColor: alreadyAdded ? colors.success + "15" : colors.primary }]}
                      onPress={() => !alreadyAdded && addSuggested(s)}
                    >
                      <IconSymbol name={alreadyAdded ? "checkmark" : "plus"} size={14} color={alreadyAdded ? colors.success : "#fff"} />
                      <Text style={[styles.addBtnText, { color: alreadyAdded ? colors.success : "#fff" }]}>{alreadyAdded ? "مضاف" : "أضف"}</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        }
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.listItem, { backgroundColor: item.checked ? colors.success + "08" : colors.surface, borderColor: item.checked ? colors.success + "30" : colors.border }]}
            onPress={() => toggleItem(item.id)}
          >
            <IconSymbol name={item.checked ? "checkmark.circle.fill" : "circle"} size={22} color={item.checked ? colors.success : colors.muted} />
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={[styles.itemName, { color: item.checked ? colors.muted : colors.foreground, textDecorationLine: item.checked ? "line-through" : "none" }]}>{item.name}</Text>
              <View style={styles.itemMeta}>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColor(item.priority) + "12" }]}>
                  <Text style={[styles.priorityText, { color: priorityColor(item.priority) }]}>{item.priority}</Text>
                </View>
                <Text style={[styles.itemPrice, { color: colors.muted }]}>{item.price}</Text>
              </View>
            </View>
            <Pressable style={styles.deleteBtn} onPress={() => removeItem(item.id)}>
              <IconSymbol name="trash.fill" size={16} color={colors.error} />
            </Pressable>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  backBtn: { padding: 4 },
  clearBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  clearBtnText: { fontSize: 12, fontWeight: "700" },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: 12, fontWeight: "700" },
  emptyState: { alignItems: "center", gap: 12, padding: 40, borderRadius: 16 },
  emptyText: { fontSize: 14, textAlign: "center" },
  listItem: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  itemName: { fontSize: 14, fontWeight: "700", textAlign: "right" },
  itemMeta: { flexDirection: "row-reverse", gap: 8, marginTop: 4, alignItems: "center" },
  itemPrice: { fontSize: 12 },
  deleteBtn: { padding: 6 },
  suggestionsTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  suggestionCard: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 10 },
  suggestionTop: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  suggestionName: { fontSize: 14, fontWeight: "800", textAlign: "right" },
  suggestionNameEn: { fontSize: 11, textAlign: "right" },
  suggestionBottom: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  suggestionPrice: { fontSize: 12, flex: 1, textAlign: "right" },
  suggestionNotes: { fontSize: 11, flex: 1, textAlign: "right" },
  addBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  addBtnText: { fontSize: 12, fontWeight: "700" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: "700" },
});
