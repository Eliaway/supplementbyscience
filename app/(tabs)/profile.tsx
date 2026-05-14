/**
 * ملفي الصحي — My Health Profile
 * Features: My Supplements, Dose Schedule, Drug Interactions, Health Profile
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  Alert, FlatList, I18nManager, Modal, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSupplements } from "@/hooks/use-supplements";

I18nManager.forceRTL(true);

interface MySupplementEntry {
  productId: string;
  productName: string;
  brand: string;
  category_ar: string;
  dose: string;
  timing: string;
  notes: string;
}

interface HealthProfile {
  name: string;
  age: string;
  weight: string;
  height: string;
  gender: "male" | "female";
  goals: string[];
}

const TIMINGS = ["صباح", "مساء", "قبل التمرين", "بعد التمرين", "مع الطعام", "قبل النوم"];
const HEALTH_GOALS = [
  "صحة القلب", "صحة الكبد", "صحة الكلى", "تحسين الذاكرة",
  "بناء العضلات", "فقدان الوزن", "تحسين النوم", "تقليل التوتر",
  "تعزيز المناعة", "صحة العظام", "تحسين الهرمونات", "طاقة ونشاط",
];

const SK_SUPPS = "@my_supplements_v2";
const SK_PROFILE = "@health_profile_v2";

function checkInteractions(entries: MySupplementEntry[]): string[] {
  const warnings: string[] = [];
  const names = entries.map((e) => e.productName.toLowerCase());
  const pairs: [string, string, string][] = [
    ["calcium", "magnesium", "الكالسيوم والمغنيسيوم يتنافسان على الامتصاص — خذهما في أوقات مختلفة"],
    ["iron", "calcium", "الحديد والكالسيوم يتنافسان على الامتصاص — فصل بينهما ساعتان"],
    ["zinc", "iron", "الزنك والحديد يتنافسان على الامتصاص — لا تأخذهما معاً"],
    ["vitamin e", "omega", "فيتامين E مع أوميغا-3 بجرعات عالية قد يزيد خطر النزيف"],
  ];
  for (const [a, b, msg] of pairs) {
    if (names.some((n) => n.includes(a)) && names.some((n) => n.includes(b))) {
      warnings.push(msg);
    }
  }
  return warnings;
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { products } = useSupplements();

  const [activeTab, setActiveTab] = useState<"supplements" | "schedule" | "profile">("supplements");
  const [mySupplements, setMySupplements] = useState<MySupplementEntry[]>([]);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    name: "", age: "", weight: "", height: "", gender: "male", goals: [],
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [doseInput, setDoseInput] = useState("");
  const [timingInput, setTimingInput] = useState("صباح");
  const [notesInput, setNotesInput] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const s = await AsyncStorage.getItem(SK_SUPPS);
        if (s) setMySupplements(JSON.parse(s));
        const p = await AsyncStorage.getItem(SK_PROFILE);
        if (p) setHealthProfile(JSON.parse(p));
      } catch {}
    })();
  }, []);

  const saveSupplements = useCallback(async (list: MySupplementEntry[]) => {
    setMySupplements(list);
    await AsyncStorage.setItem(SK_SUPPS, JSON.stringify(list));
  }, []);

  const saveProfile = useCallback(async (prof: HealthProfile) => {
    setHealthProfile(prof);
    await AsyncStorage.setItem(SK_PROFILE, JSON.stringify(prof));
  }, []);

  const addSupplement = useCallback(async () => {
    if (!selectedProduct || !doseInput.trim()) {
      Alert.alert("تنبيه", "يرجى اختيار منتج وإدخال الجرعة");
      return;
    }
    const entry: MySupplementEntry = {
      productId: selectedProduct.id,
      productName: selectedProduct.name_en,
      brand: selectedProduct.brand,
      category_ar: selectedProduct.category_ar,
      dose: doseInput.trim(),
      timing: timingInput,
      notes: notesInput.trim(),
    };
    await saveSupplements([...mySupplements, entry]);
    setShowAddModal(false);
    setSelectedProduct(null);
    setDoseInput(""); setNotesInput(""); setTimingInput("صباح"); setSearchQuery("");
  }, [selectedProduct, doseInput, timingInput, notesInput, mySupplements, saveSupplements]);

  const removeSupplement = useCallback((idx: number) => {
    Alert.alert("حذف", "هل تريد حذف هذا المكمل؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: async () => {
        await saveSupplements(mySupplements.filter((_, i) => i !== idx));
      }},
    ]);
  }, [mySupplements, saveSupplements]);

  const interactions = checkInteractions(mySupplements);
  const scheduleGroups = TIMINGS
    .map((t) => ({ timing: t, items: mySupplements.filter((s) => s.timing === t) }))
    .filter((g) => g.items.length > 0);

  const filteredProducts = products.filter((p) =>
    p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category_ar.includes(searchQuery)
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>ملفي الصحي</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>{mySupplements.length} مكمل مضاف</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(["supplements", "schedule", "profile"] as const).map((tab) => {
          const labels = { supplements: "مكملاتي", schedule: "الجدول", profile: "بياناتي" };
          const icons = { supplements: "pills.fill" as const, schedule: "calendar" as const, profile: "person.fill" as const };
          const isActive = activeTab === tab;
          return (
            <Pressable key={tab} style={[styles.tabBtn, isActive && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => setActiveTab(tab)}>
              <IconSymbol name={icons[tab]} size={16} color={isActive ? colors.primary : colors.muted} />
              <Text style={[styles.tabLabel, { color: isActive ? colors.primary : colors.muted }]}>{labels[tab]}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── My Supplements ── */}
      {activeTab === "supplements" && (
        <View style={{ flex: 1 }}>
          {interactions.length > 0 && (
            <View style={[styles.warningBanner, { backgroundColor: colors.warning + "18", borderColor: colors.warning + "50" }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={18} color={colors.warning} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.warningTitle, { color: colors.warning }]}>تحذيرات التفاعل</Text>
                {interactions.map((w, i) => <Text key={i} style={[styles.warningText, { color: colors.foreground }]}>• {w}</Text>)}
              </View>
            </View>
          )}
          {mySupplements.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="pills.fill" size={48} color={colors.border} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>لا توجد مكملات بعد</Text>
              <Text style={[styles.emptyDesc, { color: colors.muted }]}>أضف مكملاتك الحالية لتتبع جرعاتها وتحليل تفاعلاتها</Text>
            </View>
          ) : (
            <FlatList
              data={mySupplements}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={{ padding: 16, gap: 10 }}
              renderItem={({ item, index }) => (
                <View style={[styles.suppCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.suppCardHeader}>
                    <Pressable onPress={() => removeSupplement(index)} style={{ padding: 4 }}>
                      <IconSymbol name="trash.fill" size={16} color={colors.error} />
                    </Pressable>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <Text style={[styles.suppName, { color: colors.foreground }]}>{item.productName}</Text>
                      <Text style={[styles.suppBrand, { color: colors.muted }]}>{item.brand}</Text>
                    </View>
                  </View>
                  <View style={styles.suppMeta}>
                    {[
                      { icon: "pills.fill" as const, text: item.dose, color: colors.primary },
                      { icon: "clock.fill" as const, text: item.timing, color: colors.secondary },
                      { icon: "tag.fill" as const, text: item.category_ar, color: colors.accent },
                    ].map((badge, i) => (
                      <View key={i} style={[styles.metaBadge, { backgroundColor: badge.color + "18" }]}>
                        <IconSymbol name={badge.icon} size={11} color={badge.color} />
                        <Text style={[styles.metaText, { color: badge.color }]}>{badge.text}</Text>
                      </View>
                    ))}
                  </View>
                  {item.notes ? <Text style={[styles.suppNotes, { color: colors.muted }]}>{item.notes}</Text> : null}
                </View>
              )}
            />
          )}
          <Pressable style={[styles.fab, { backgroundColor: colors.primary }]} onPress={() => setShowAddModal(true)}>
            <IconSymbol name="plus" size={24} color="#fff" />
          </Pressable>
        </View>
      )}

      {/* ── Schedule ── */}
      {activeTab === "schedule" && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {scheduleGroups.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="calendar" size={48} color={colors.border} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>الجدول فارغ</Text>
              <Text style={[styles.emptyDesc, { color: colors.muted }]}>أضف مكملاتك لتظهر هنا مرتبة حسب التوقيت</Text>
            </View>
          ) : scheduleGroups.map((group) => (
            <View key={group.timing} style={{ marginBottom: 20 }}>
              <View style={[styles.scheduleHeader, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
                <IconSymbol name="clock.fill" size={16} color={colors.primary} />
                <Text style={[styles.scheduleTitle, { color: colors.primary }]}>{group.timing}</Text>
                <Text style={[styles.scheduleCount, { color: colors.muted }]}>{group.items.length} مكمل</Text>
              </View>
              {group.items.map((item, i) => (
                <View key={i} style={[styles.scheduleItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.scheduleCheck, { borderColor: colors.border }]} />
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={[styles.scheduleItemName, { color: colors.foreground }]}>{item.productName}</Text>
                    <Text style={[styles.scheduleItemDose, { color: colors.muted }]}>{item.dose} — {item.brand}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── Health Profile ── */}
      {activeTab === "profile" && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.profileSectionTitle, { color: colors.foreground }]}>البيانات الشخصية</Text>
            {[
              { label: "الاسم", key: "name", placeholder: "اسمك" },
              { label: "العمر (سنة)", key: "age", placeholder: "مثال: 30", kb: "numeric" as const },
              { label: "الوزن (كغ)", key: "weight", placeholder: "مثال: 80", kb: "numeric" as const },
              { label: "الطول (سم)", key: "height", placeholder: "مثال: 175", kb: "numeric" as const },
            ].map((f) => (
              <View key={f.key} style={styles.profileField}>
                <Text style={[styles.fieldLabel, { color: colors.muted }]}>{f.label}</Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                  placeholder={f.placeholder} placeholderTextColor={colors.muted}
                  value={(healthProfile as any)[f.key]} keyboardType={f.kb} textAlign="right"
                  onChangeText={(v) => saveProfile({ ...healthProfile, [f.key]: v })}
                />
              </View>
            ))}
            <View style={styles.profileField}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>الجنس</Text>
              <View style={styles.genderRow}>
                {(["male", "female"] as const).map((g) => (
                  <Pressable key={g} style={[styles.genderBtn, {
                    backgroundColor: healthProfile.gender === g ? colors.primary + "20" : colors.surface,
                    borderColor: healthProfile.gender === g ? colors.primary : colors.border,
                  }]} onPress={() => saveProfile({ ...healthProfile, gender: g })}>
                    <Text style={[styles.genderText, { color: healthProfile.gender === g ? colors.primary : colors.muted }]}>
                      {g === "male" ? "ذكر" : "أنثى"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}>
            <Text style={[styles.profileSectionTitle, { color: colors.foreground }]}>أهدافك الصحية</Text>
            <View style={styles.goalsGrid}>
              {HEALTH_GOALS.map((goal) => {
                const sel = healthProfile.goals.includes(goal);
                return (
                  <Pressable key={goal} style={[styles.goalChip, {
                    backgroundColor: sel ? colors.primary + "20" : colors.surface,
                    borderColor: sel ? colors.primary : colors.border,
                  }]} onPress={() => {
                    const goals = sel ? healthProfile.goals.filter((g) => g !== goal) : [...healthProfile.goals, goal];
                    saveProfile({ ...healthProfile, goals });
                  }}>
                    {sel && <IconSymbol name="checkmark" size={11} color={colors.primary} />}
                    <Text style={[styles.goalText, { color: sel ? colors.primary : colors.muted }]}>{goal}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {mySupplements.length > 0 && (
            <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}>
              <Text style={[styles.profileSectionTitle, { color: colors.foreground }]}>ملخص البروتوكول</Text>
              <View style={styles.summaryRow}>
                {[
                  { val: mySupplements.length, label: "مكمل", color: colors.primary },
                  { val: [...new Set(mySupplements.map((s) => s.timing))].length, label: "أوقات", color: colors.secondary },
                  { val: interactions.length, label: "تحذير", color: interactions.length > 0 ? colors.warning : colors.success },
                ].map((s, i) => (
                  <View key={i} style={[styles.summaryItem, { backgroundColor: s.color + "15" }]}>
                    <Text style={[styles.summaryValue, { color: s.color }]}>{s.val}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.muted }]}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* ── Add Modal ── */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <Pressable onPress={() => { setShowAddModal(false); setSelectedProduct(null); setSearchQuery(""); }}>
              <Text style={[styles.modalCancel, { color: colors.error }]}>إلغاء</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>إضافة مكمل</Text>
            <Pressable onPress={addSupplement}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>حفظ</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
              <TextInput style={[styles.searchInput, { color: colors.foreground }]}
                placeholder="ابحث عن منتج..." placeholderTextColor={colors.muted}
                value={searchQuery} onChangeText={setSearchQuery} textAlign="right" />
            </View>

            {!selectedProduct && filteredProducts.slice(0, 20).map((item) => (
              <Pressable key={item.id} style={[styles.productSelectRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setSelectedProduct(item)}>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.productSelectName, { color: colors.foreground }]}>{item.name_en}</Text>
                  <Text style={[styles.productSelectBrand, { color: colors.muted }]}>{item.brand} · {item.category_ar}</Text>
                </View>
                <View style={[styles.scoreSmall, { backgroundColor: colors.primary + "18" }]}>
                  <Text style={[styles.scoreSmallText, { color: colors.primary }]}>{item.score.toFixed(1)}</Text>
                </View>
              </Pressable>
            ))}

            {selectedProduct && (
              <View style={[styles.selectedProduct, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "40" }]}>
                <Pressable onPress={() => setSelectedProduct(null)}>
                  <IconSymbol name="xmark.circle.fill" size={20} color={colors.error} />
                </Pressable>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={[styles.selectedName, { color: colors.foreground }]}>{selectedProduct.name_en}</Text>
                  <Text style={[styles.selectedBrand, { color: colors.muted }]}>{selectedProduct.brand}</Text>
                </View>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
              </View>
            )}

            <View>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>الجرعة</Text>
              <TextInput style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                placeholder="مثال: 2 كبسولة" placeholderTextColor={colors.muted}
                value={doseInput} onChangeText={setDoseInput} textAlign="right" />
            </View>

            <View>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>وقت الأخذ</Text>
              <View style={styles.timingGrid}>
                {TIMINGS.map((t) => (
                  <Pressable key={t} style={[styles.timingChip, {
                    backgroundColor: timingInput === t ? colors.primary + "20" : colors.surface,
                    borderColor: timingInput === t ? colors.primary : colors.border,
                  }]} onPress={() => setTimingInput(t)}>
                    <Text style={[styles.timingText, { color: timingInput === t ? colors.primary : colors.muted }]}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>ملاحظات (اختياري)</Text>
              <TextInput style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground, height: 80 }]}
                placeholder="أي ملاحظات إضافية..." placeholderTextColor={colors.muted}
                value={notesInput} onChangeText={setNotesInput} multiline textAlign="right" />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 2 },
  tabsRow: { flexDirection: "row-reverse", borderBottomWidth: 0.5 },
  tabBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12 },
  tabLabel: { fontSize: 13, fontWeight: "600" },
  warningBanner: { flexDirection: "row-reverse", margin: 16, padding: 12, borderRadius: 12, borderWidth: 1, gap: 10, alignItems: "flex-start" },
  warningTitle: { fontSize: 13, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  warningText: { fontSize: 12, textAlign: "right", lineHeight: 18 },
  emptyState: { alignItems: "center", justifyContent: "center", padding: 40, gap: 12, marginTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyDesc: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  suppCard: { borderRadius: 14, padding: 14, borderWidth: 1 },
  suppCardHeader: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  suppName: { fontSize: 15, fontWeight: "700" },
  suppBrand: { fontSize: 12, marginTop: 2 },
  suppMeta: { flexDirection: "row-reverse", gap: 8, flexWrap: "wrap" },
  metaBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  metaText: { fontSize: 11, fontWeight: "600" },
  suppNotes: { fontSize: 12, marginTop: 8, textAlign: "right", lineHeight: 18 },
  fab: { position: "absolute", bottom: 24, left: 24, width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  scheduleHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 10, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  scheduleTitle: { fontSize: 14, fontWeight: "700", flex: 1, textAlign: "right" },
  scheduleCount: { fontSize: 11 },
  scheduleItem: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 6 },
  scheduleCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  scheduleItemName: { fontSize: 14, fontWeight: "600" },
  scheduleItemDose: { fontSize: 12, marginTop: 2 },
  profileCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  profileSectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", marginBottom: 14 },
  profileField: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: "600", textAlign: "right", marginBottom: 6 },
  fieldInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15, fontWeight: "500" },
  genderRow: { flexDirection: "row-reverse", gap: 10 },
  genderBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  genderText: { fontSize: 14, fontWeight: "600" },
  goalsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  goalChip: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  goalText: { fontSize: 12, fontWeight: "600" },
  summaryRow: { flexDirection: "row-reverse", gap: 10 },
  summaryItem: { flex: 1, borderRadius: 12, padding: 12, alignItems: "center", gap: 4 },
  summaryValue: { fontSize: 22, fontWeight: "900" },
  summaryLabel: { fontSize: 11 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 0.5 },
  modalTitle: { fontSize: 17, fontWeight: "700" },
  modalCancel: { fontSize: 15, fontWeight: "600" },
  modalSave: { fontSize: 15, fontWeight: "700" },
  searchBox: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  productSelectRow: { flexDirection: "row-reverse", alignItems: "center", padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8, gap: 10 },
  productSelectName: { fontSize: 14, fontWeight: "600" },
  productSelectBrand: { fontSize: 11, marginTop: 2 },
  scoreSmall: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scoreSmallText: { fontSize: 13, fontWeight: "800" },
  selectedProduct: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  selectedName: { fontSize: 15, fontWeight: "700" },
  selectedBrand: { fontSize: 12 },
  inputLabel: { fontSize: 13, fontWeight: "600", textAlign: "right", marginBottom: 8 },
  textInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15 },
  timingGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  timingChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  timingText: { fontSize: 13, fontWeight: "600" },
});
