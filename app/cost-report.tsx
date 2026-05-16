import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

I18nManager.forceRTL(true);

interface SupplementCost {
  name: string;
  monthlyPrice: number;
  currency: string;
}

const CURRENCIES = ["ريال", "دولار", "يورو", "جنيه", "درهم"];

const CHEAPER_ALTERNATIVES: Record<string, string> = {
  "أوميغا-3": "زيت السمك العادي بدلاً من العلامات التجارية المميزة",
  "فيتامين د": "فيتامين د3 بدون علامة تجارية (نفس الجودة بسعر أقل)",
  "المغنيسيوم": "مغنيسيوم أكسيد (أرخص) أو مغنيسيوم سيترات (أفضل امتصاصاً)",
  "الكرياتين": "كرياتين مونوهيدرات عادي (نفس الفعالية بربع السعر)",
  "بروتين": "بروتين مصل اللبن المركّز بدلاً من المعزول",
  "الزنك": "زنك غلوكونات أو سيترات (أرخص من البيكولينات)",
};

export default function CostReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [costs, setCosts] = useState<SupplementCost[]>([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [currency, setCurrency] = useState("ريال");
  const [mySupps, setMySupps] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [costsRaw, suppsRaw] = await Promise.all([
      AsyncStorage.getItem("supplement_costs"),
      AsyncStorage.getItem("my_supplements"),
    ]);
    if (costsRaw) setCosts(JSON.parse(costsRaw));
    if (suppsRaw) {
      try {
        const parsed = JSON.parse(suppsRaw);
        if (Array.isArray(parsed)) setMySupps(parsed.map((s: any) => s.name || s));
      } catch {}
    }
  }

  async function saveCosts(updated: SupplementCost[]) {
    setCosts(updated);
    await AsyncStorage.setItem("supplement_costs", JSON.stringify(updated));
  }

  async function addCost() {
    if (!newName.trim() || !newPrice.trim()) return;
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      Alert.alert("خطأ", "يرجى إدخال سعر صحيح");
      return;
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const updated = [...costs, { name: newName.trim(), monthlyPrice: price, currency }];
    await saveCosts(updated);
    setNewName("");
    setNewPrice("");
  }

  async function removeCost(index: number) {
    const updated = costs.filter((_, i) => i !== index);
    await saveCosts(updated);
  }

  const totalByCurrency = costs.reduce((acc, c) => {
    acc[c.currency] = (acc[c.currency] || 0) + c.monthlyPrice;
    return acc;
  }, {} as Record<string, number>);

  const totalYearly = Object.entries(totalByCurrency).map(([cur, val]) => ({
    currency: cur,
    monthly: val,
    yearly: val * 12,
  }));

  const topCost = [...costs].sort((a, b) => b.monthlyPrice - a.monthlyPrice)[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
          تقرير التكلفة الشهرية
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary cards */}
        {totalYearly.length > 0 && (
          <View style={styles.summaryRow}>
            {totalYearly.map((t) => (
              <View key={t.currency} style={[styles.summaryCard, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "33" }]}>
                <Text style={[styles.summaryLabel, { color: colors.muted, fontFamily: "Cairo" }]}>شهرياً</Text>
                <Text style={[styles.summaryAmount, { color: colors.primary, fontFamily: "Cairo-Black" }]}>
                  {t.monthly.toFixed(0)} {t.currency}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.muted, fontFamily: "Cairo" }]}>سنوياً</Text>
                <Text style={[styles.summaryYearly, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                  {t.yearly.toFixed(0)} {t.currency}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Add new cost */}
        <View style={[styles.addCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.addTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
            ➕ إضافة مكمل
          </Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="اسم المكمل"
            placeholderTextColor={colors.muted}
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: "Cairo" }]}
            textAlign="right"
          />
          <View style={styles.priceRow}>
            <TextInput
              value={newPrice}
              onChangeText={setNewPrice}
              placeholder="السعر الشهري"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              style={[styles.priceInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: "Cairo" }]}
              textAlign="right"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
              {CURRENCIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCurrency(c)}
                  style={[styles.currencyBtn, {
                    backgroundColor: currency === c ? colors.primary : colors.background,
                    borderColor: currency === c ? colors.primary : colors.border,
                  }]}
                >
                  <Text style={[styles.currencyText, { color: currency === c ? "#fff" : colors.foreground, fontFamily: "Cairo-Bold" }]}>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <Pressable
            onPress={addCost}
            style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={[styles.addBtnText, { fontFamily: "Cairo-Black" }]}>إضافة</Text>
          </Pressable>
        </View>

        {/* Costs list */}
        {costs.length > 0 && (
          <View style={[styles.listCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.listTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
              قائمة المكملات ({costs.length})
            </Text>
            {costs.map((c, i) => (
              <View key={i} style={[styles.costItem, { borderColor: colors.border }]}>
                <Pressable onPress={() => removeCost(i)} style={styles.deleteBtn}>
                  <Text style={{ color: colors.error, fontSize: 16 }}>🗑</Text>
                </Pressable>
                <View style={styles.costInfo}>
                  <Text style={[styles.costName, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                    {c.name}
                  </Text>
                  <Text style={[styles.costPrice, { color: colors.primary, fontFamily: "Cairo-Black" }]}>
                    {c.monthlyPrice} {c.currency}/شهر
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Savings tips */}
        {topCost && (
          <View style={[styles.tipsCard, { backgroundColor: colors.warning + "18", borderColor: colors.warning + "33" }]}>
            <Text style={[styles.tipsTitle, { color: colors.warning, fontFamily: "Cairo-Bold" }]}>
              💡 نصائح لتوفير المال
            </Text>
            {Object.entries(CHEAPER_ALTERNATIVES)
              .filter(([key]) => costs.some((c) => c.name.includes(key)))
              .slice(0, 3)
              .map(([key, tip]) => (
                <View key={key} style={styles.tipItem}>
                  <Text style={[styles.tipText, { color: colors.foreground, fontFamily: "Cairo" }]}>
                    • {tip}
                  </Text>
                </View>
              ))}
            <Text style={[styles.tipText, { color: colors.muted, fontFamily: "Cairo" }]}>
              • شراء بالجملة يوفر 20-40% من التكلفة
            </Text>
            <Text style={[styles.tipText, { color: colors.muted, fontFamily: "Cairo" }]}>
              • مقارنة الأسعار بين المتاجر الإلكترونية توفر 15-30%
            </Text>
          </View>
        )}

        {costs.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💰</Text>
            <Text style={[styles.emptyText, { color: colors.muted, fontFamily: "Cairo" }]}>
              أضف مكملاتك مع أسعارها لحساب التكلفة الشهرية والسنوية
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontFamily: "Cairo-Black" },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  summaryRow: { flexDirection: "row-reverse", gap: 10 },
  summaryCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  summaryLabel: { fontSize: 11, fontFamily: "Cairo" },
  summaryAmount: { fontSize: 22, fontFamily: "Cairo-Black" },
  summaryYearly: { fontSize: 14, fontFamily: "Cairo-Bold" },
  addCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  addTitle: { fontSize: 15, fontFamily: "Cairo-Bold", textAlign: "right" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Cairo",
  },
  priceRow: { flexDirection: "row-reverse", gap: 8, alignItems: "center" },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Cairo",
  },
  currencyScroll: { maxWidth: 160 },
  currencyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 6,
  },
  currencyText: { fontSize: 12, fontFamily: "Cairo-Bold" },
  addBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  addBtnText: { fontSize: 15, color: "#fff", fontFamily: "Cairo-Black" },
  listCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  listTitle: { fontSize: 15, fontFamily: "Cairo-Bold", textAlign: "right" },
  costItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  deleteBtn: { padding: 6 },
  costInfo: { flex: 1, alignItems: "flex-end", gap: 2 },
  costName: { fontSize: 14, fontFamily: "Cairo-Bold" },
  costPrice: { fontSize: 13, fontFamily: "Cairo-Black" },
  tipsCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  tipsTitle: { fontSize: 15, fontFamily: "Cairo-Bold", textAlign: "right" },
  tipItem: {},
  tipText: { fontSize: 13, fontFamily: "Cairo", textAlign: "right", lineHeight: 22 },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 14, fontFamily: "Cairo", textAlign: "center" },
});
