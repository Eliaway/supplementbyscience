import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  I18nManager,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { CATEGORY_COLORS, CATEGORY_ICONS, Product, useSupplements } from "@/hooks/use-supplements";

I18nManager.forceRTL(true);

export default function CompareScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { products } = useSupplements();

  const [productA, setProductA] = useState<Product | null>(null);
  const [productB, setProductB] = useState<Product | null>(null);
  const [pickingFor, setPickingFor] = useState<"A" | "B" | null>(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      !search ||
      p.name_en.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category_ar.includes(search)
    );
  });

  function selectProduct(p: Product) {
    if (pickingFor === "A") setProductA(p);
    else setProductB(p);
    setPickingFor(null);
    setSearch("");
  }

  const CompareRow = ({
    label, valA, valB, higherIsBetter = true,
  }: { label: string; valA: number; valB: number; higherIsBetter?: boolean }) => {
    const aWins = higherIsBetter ? valA > valB : valA < valB;
    const bWins = higherIsBetter ? valB > valA : valB < valA;
    return (
      <View style={[styles.compareRow, { borderBottomColor: colors.border }]}>
        <View style={[styles.compareCell, aWins && { backgroundColor: colors.success + "15" }]}>
          <Text style={[styles.compareCellText, { color: aWins ? colors.success : colors.foreground }]}>
            {valA.toFixed(1)}
          </Text>
          {aWins && <IconSymbol name="checkmark" size={12} color={colors.success} />}
        </View>
        <View style={styles.compareLabel}>
          <Text style={[styles.compareLabelText, { color: colors.muted }]}>{label}</Text>
        </View>
        <View style={[styles.compareCell, bWins && { backgroundColor: colors.success + "15" }]}>
          <Text style={[styles.compareCellText, { color: bWins ? colors.success : colors.foreground }]}>
            {valB.toFixed(1)}
          </Text>
          {bWins && <IconSymbol name="checkmark" size={12} color={colors.success} />}
        </View>
      </View>
    );
  };

  const ProductSlot = ({
    product, label, onPick, onClear,
  }: { product: Product | null; label: string; onPick: () => void; onClear: () => void }) => {
    const catColor = product ? (CATEGORY_COLORS[product.category] || "#64748B") : colors.muted;
    const catIcon = product ? (CATEGORY_ICONS[product.category] || "pills.fill") : "plus.circle.fill";
    return (
      <View style={[styles.slot, { backgroundColor: colors.card, borderColor: product ? catColor + "50" : colors.border }]}>
        {product ? (
          <>
            <Pressable style={styles.clearBtn} onPress={onClear}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.muted} />
            </Pressable>
            <View style={[styles.slotIcon, { backgroundColor: catColor + "20" }]}>
              <IconSymbol name={catIcon as any} size={28} color={catColor} />
            </View>
            <Text style={[styles.slotName, { color: colors.foreground }]} numberOfLines={2}>{product.name_en}</Text>
            <Text style={[styles.slotBrand, { color: colors.muted }]}>{product.brand}</Text>
            <View style={[styles.slotScore, { backgroundColor: catColor + "20" }]}>
              <Text style={[styles.slotScoreText, { color: catColor }]}>{product.score.toFixed(1)}/10</Text>
            </View>
          </>
        ) : (
          <Pressable style={styles.slotEmpty} onPress={onPick}>
            <IconSymbol name="plus.circle.fill" size={36} color={colors.primary} />
            <Text style={[styles.slotEmptyText, { color: colors.primary }]}>اختر {label}</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>مقارنة المنتجات</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>قارن منتجين جنباً إلى جنب</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Product Slots */}
        <View style={styles.slotsRow}>
          <ProductSlot
            product={productA} label="الأول"
            onPick={() => setPickingFor("A")}
            onClear={() => setProductA(null)}
          />
          <View style={[styles.vsCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <ProductSlot
            product={productB} label="الثاني"
            onPick={() => setPickingFor("B")}
            onClear={() => setProductB(null)}
          />
        </View>

        {/* Comparison Table */}
        {productA && productB && (
          <View style={[styles.comparisonTable, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Header */}
            <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
              <Pressable
                style={styles.tableHeaderCell}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: productA.id } })}
              >
                <Text style={[styles.tableHeaderName, { color: colors.primary }]} numberOfLines={2}>
                  {productA.name_en}
                </Text>
              </Pressable>
              <View style={styles.tableHeaderLabel}>
                <Text style={[styles.tableHeaderLabelText, { color: colors.muted }]}>المقارنة</Text>
              </View>
              <Pressable
                style={styles.tableHeaderCell}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: productB.id } })}
              >
                <Text style={[styles.tableHeaderName, { color: colors.secondary }]} numberOfLines={2}>
                  {productB.name_en}
                </Text>
              </Pressable>
            </View>

            <CompareRow label="التقييم الكلي" valA={productA.score} valB={productB.score} />
            <CompareRow
              label="متوسط المكونات"
              valA={productA.ingredients.reduce((s, i) => s + i.score, 0) / Math.max(productA.ingredients.length, 1)}
              valB={productB.ingredients.reduce((s, i) => s + i.score, 0) / Math.max(productB.ingredients.length, 1)}
            />
            <CompareRow label="عدد المكونات" valA={productA.ingredients.length} valB={productB.ingredients.length} />

            {/* Evidence Level */}
            <View style={[styles.compareRow, { borderBottomColor: colors.border }]}>
              <View style={styles.compareCell}>
                <Text style={[styles.evidenceText, { color: colors.foreground }]} numberOfLines={2}>
                  {productA.evidence_level}
                </Text>
              </View>
              <View style={styles.compareLabel}>
                <Text style={[styles.compareLabelText, { color: colors.muted }]}>مستوى الأدلة</Text>
              </View>
              <View style={styles.compareCell}>
                <Text style={[styles.evidenceText, { color: colors.foreground }]} numberOfLines={2}>
                  {productB.evidence_level}
                </Text>
              </View>
            </View>

            {/* Price */}
            <View style={[styles.compareRow, { borderBottomColor: colors.border }]}>
              <View style={styles.compareCell}>
                <Text style={[styles.compareCellText, { color: colors.primary }]}>{productA.price}</Text>
              </View>
              <View style={styles.compareLabel}>
                <Text style={[styles.compareLabelText, { color: colors.muted }]}>السعر</Text>
              </View>
              <View style={styles.compareCell}>
                <Text style={[styles.compareCellText, { color: colors.secondary }]}>{productB.price}</Text>
              </View>
            </View>

            {/* Strengths */}
            <View style={[styles.compareTextRow, { borderBottomColor: colors.border }]}>
              <View style={styles.compareTextCell}>
                <Text style={[styles.compareTextVal, { color: colors.foreground }]}>{productA.strengths}</Text>
              </View>
              <View style={styles.compareLabel}>
                <Text style={[styles.compareLabelText, { color: colors.muted }]}>نقاط القوة</Text>
              </View>
              <View style={styles.compareTextCell}>
                <Text style={[styles.compareTextVal, { color: colors.foreground }]}>{productB.strengths}</Text>
              </View>
            </View>

            {/* Weaknesses */}
            <View style={[styles.compareTextRow, { borderBottomColor: colors.border }]}>
              <View style={styles.compareTextCell}>
                <Text style={[styles.compareTextVal, { color: colors.foreground }]}>{productA.weaknesses}</Text>
              </View>
              <View style={styles.compareLabel}>
                <Text style={[styles.compareLabelText, { color: colors.muted }]}>نقاط الضعف</Text>
              </View>
              <View style={styles.compareTextCell}>
                <Text style={[styles.compareTextVal, { color: colors.foreground }]}>{productB.weaknesses}</Text>
              </View>
            </View>

            {/* Best For */}
            <View style={[styles.compareTextRow, { borderBottomColor: colors.border }]}>
              <View style={styles.compareTextCell}>
                <Text style={[styles.compareTextVal, { color: colors.foreground }]}>{productA.best_for}</Text>
              </View>
              <View style={styles.compareLabel}>
                <Text style={[styles.compareLabelText, { color: colors.muted }]}>الأفضل لـ</Text>
              </View>
              <View style={styles.compareTextCell}>
                <Text style={[styles.compareTextVal, { color: colors.foreground }]}>{productB.best_for}</Text>
              </View>
            </View>

            {/* Winner */}
            <View style={[styles.winnerRow, { backgroundColor: colors.success + "15" }]}>
              <IconSymbol name="trophy.fill" size={20} color={colors.success} />
              <Text style={[styles.winnerText, { color: colors.success }]}>
                {productA.score > productB.score
                  ? `الفائز: ${productA.name_en}`
                  : productB.score > productA.score
                  ? `الفائز: ${productB.name_en}`
                  : "تعادل في التقييم"}
              </Text>
            </View>
          </View>
        )}

        {(!productA || !productB) && (
          <View style={styles.hint}>
            <IconSymbol name="arrow.left.arrow.right" size={40} color={colors.muted} />
            <Text style={[styles.hintText, { color: colors.muted }]}>اختر منتجين للمقارنة بينهما</Text>
          </View>
        )}
      </ScrollView>

      {/* Product Picker Modal */}
      <Modal visible={pickingFor !== null} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <Pressable onPress={() => { setPickingFor(null); setSearch(""); }}>
              <IconSymbol name="xmark" size={22} color={colors.muted} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              اختر {pickingFor === "A" ? "المنتج الأول" : "المنتج الثاني"}
            </Text>
            <View style={{ width: 22 }} />
          </View>
          <View style={[styles.modalSearch, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
              <TextInput
                style={[styles.searchInput, { color: colors.foreground }]}
                placeholder="ابحث..."
                placeholderTextColor={colors.muted}
                value={search}
                onChangeText={setSearch}
                textAlign="right"
                autoFocus
              />
            </View>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const catColor = CATEGORY_COLORS[item.category] || "#64748B";
              const catIcon = CATEGORY_ICONS[item.category] || "pills.fill";
              return (
                <Pressable
                  style={({ pressed }) => [
                    styles.pickerItem,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() => selectProduct(item)}
                >
                  <View style={[styles.pickerIcon, { backgroundColor: catColor + "20" }]}>
                    <IconSymbol name={catIcon as any} size={22} color={catColor} />
                  </View>
                  <View style={styles.pickerInfo}>
                    <Text style={[styles.pickerName, { color: colors.foreground }]}>{item.name_en}</Text>
                    <Text style={[styles.pickerBrand, { color: colors.muted }]}>{item.brand} · {item.category_ar}</Text>
                  </View>
                  <Text style={[styles.pickerScore, { color: colors.primary }]}>{item.score.toFixed(1)}</Text>
                </Pressable>
              );
            }}
            contentContainerStyle={{ padding: 16, gap: 8 }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 13, marginTop: 4, textAlign: "right" },
  slotsRow: { flexDirection: "row-reverse", padding: 16, gap: 12, alignItems: "center" },
  slot: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: "center",
    borderWidth: 1.5, gap: 8, minHeight: 160,
  },
  slotIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  slotName: { fontSize: 13, fontWeight: "700", textAlign: "center" },
  slotBrand: { fontSize: 11, textAlign: "center" },
  slotScore: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  slotScoreText: { fontSize: 13, fontWeight: "700" },
  slotEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  slotEmptyText: { fontSize: 13, fontWeight: "600" },
  clearBtn: { position: "absolute", top: 8, left: 8 },
  vsCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  vsText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  comparisonTable: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  tableHeader: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tableHeaderCell: { flex: 1, padding: 12, alignItems: "center" },
  tableHeaderName: { fontSize: 12, fontWeight: "700", textAlign: "center" },
  tableHeaderLabel: { width: 80, padding: 12, alignItems: "center", justifyContent: "center" },
  tableHeaderLabelText: { fontSize: 11, fontWeight: "600" },
  compareRow: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  compareCell: {
    flex: 1, padding: 12, alignItems: "center",
    flexDirection: "row-reverse", justifyContent: "center", gap: 4,
  },
  compareCellText: { fontSize: 16, fontWeight: "700" },
  evidenceText: { fontSize: 10, textAlign: "center" },
  compareLabel: { width: 80, padding: 12, alignItems: "center", justifyContent: "center" },
  compareLabelText: { fontSize: 10, fontWeight: "600", textAlign: "center" },
  compareTextRow: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  compareTextCell: { flex: 1, padding: 10, alignItems: "flex-end" },
  compareTextVal: { fontSize: 10, textAlign: "right", lineHeight: 15 },
  winnerRow: {
    flexDirection: "row-reverse", alignItems: "center",
    justifyContent: "center", padding: 14, gap: 8,
  },
  winnerText: { fontSize: 15, fontWeight: "700" },
  hint: { alignItems: "center", paddingTop: 60, gap: 12 },
  hintText: { fontSize: 15, textAlign: "center" },
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 0.5,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  modalSearch: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 0.5 },
  searchBox: {
    flexDirection: "row-reverse", alignItems: "center",
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  pickerItem: {
    flexDirection: "row-reverse", alignItems: "center",
    borderRadius: 12, padding: 12, borderWidth: 1, gap: 10,
  },
  pickerIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  pickerInfo: { flex: 1, alignItems: "flex-end" },
  pickerName: { fontSize: 14, fontWeight: "600" },
  pickerBrand: { fontSize: 11, marginTop: 2 },
  pickerScore: { fontSize: 18, fontWeight: "800" },
});
