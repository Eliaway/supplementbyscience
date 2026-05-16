/**
 * ملفي الصحي الشامل
 * My Complete Health Profile
 * Features: Personal Info, Chronic Diseases, Allergies, Medications,
 *           My Supplements, Hormones & Peptides, Dose Schedule, AI Analysis
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
import {
  ACTIVITY_LABELS,
  ALLERGIES,
  CHRONIC_DISEASES,
  DEFAULT_PROFILE,
  FREQUENCY_LABELS,
  GOAL_LABELS,
  HORMONES_PEPTIDES,
  INJURIES,
  type HormoneEntry,
  type HealthProfile,
  type Medication,
} from "@/assets/data/healthProfile";

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

const TIMINGS = ["صباح", "مساء", "قبل التمرين", "بعد التمرين", "مع الطعام", "قبل النوم"];

const SK_SUPPS = "@my_supplements_v3";
const SK_PROFILE = "@health_profile_v3";

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: "person.crop.circle.fill" as const },
  { id: "supplements", label: "مكملاتي", icon: "pills.fill" as const },
  { id: "hormones", label: "هرمونات", icon: "bolt.fill" as const },
  { id: "health", label: "الصحة", icon: "heart.fill" as const },
  { id: "schedule", label: "الجدول", icon: "calendar" as const },
] as const;

type TabId = typeof TABS[number]["id"];

function checkInteractions(entries: MySupplementEntry[]): string[] {
  const warnings: string[] = [];
  const names = entries.map((e) => e.productName.toLowerCase());
  const pairs: [string, string, string][] = [
    ["calcium", "magnesium", "⚠️ الكالسيوم والمغنيسيوم يتنافسان على الامتصاص — خذهما في أوقات مختلفة"],
    ["iron", "calcium", "⚠️ الحديد والكالسيوم يتنافسان — فصل بينهما ساعتان على الأقل"],
    ["zinc", "iron", "⚠️ الزنك والحديد يتنافسان — لا تأخذهما معاً"],
    ["vitamin e", "omega", "⚠️ فيتامين E مع أوميغا-3 بجرعات عالية قد يزيد خطر النزيف"],
    ["tudca", "liver", "✅ TUDCA مع مكمل الكبد تآزر ممتاز"],
    ["magnesium", "sleep", "✅ المغنيسيوم مع مكمل النوم تأثير تآزري"],
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

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mySupplements, setMySupplements] = useState<MySupplementEntry[]>([]);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({ ...DEFAULT_PROFILE });
  const [myHormones, setMyHormones] = useState<HormoneEntry[]>([]);

  // Modals
  const [showAddSuppModal, setShowAddSuppModal] = useState(false);
  const [showAddHormoneModal, setShowAddHormoneModal] = useState(false);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Add supplement form
  const [suppSearch, setSuppSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [doseInput, setDoseInput] = useState("");
  const [timingInput, setTimingInput] = useState("صباح");
  const [notesInput, setNotesInput] = useState("");

  // Add hormone form
  const [selectedHormone, setSelectedHormone] = useState<typeof HORMONES_PEPTIDES[0] | null>(null);
  const [hormDose, setHormDose] = useState("");
  const [hormCompany, setHormCompany] = useState("");
  const [hormFreq, setHormFreq] = useState<HormoneEntry["frequency"]>("weekly");
  const [hormNotes, setHormNotes] = useState("");

  // Add medication form
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medFreq, setMedFreq] = useState("");

  // Profile edit form
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editHeight, setEditHeight] = useState("");

  // Load data
  useEffect(() => {
    (async () => {
      try {
        const [suppStr, profStr] = await Promise.all([
          AsyncStorage.getItem(SK_SUPPS),
          AsyncStorage.getItem(SK_PROFILE),
        ]);
        if (suppStr) setMySupplements(JSON.parse(suppStr));
        if (profStr) {
          const p = JSON.parse(profStr);
          setHealthProfile({ ...DEFAULT_PROFILE, ...p });
          setMyHormones(p.hormones || []);
        }
      } catch {}
    })();
  }, []);

  const saveSupplements = useCallback(async (list: MySupplementEntry[]) => {
    setMySupplements(list);
    await AsyncStorage.setItem(SK_SUPPS, JSON.stringify(list));
  }, []);

  const saveProfile = useCallback(async (p: HealthProfile, hormones?: HormoneEntry[]) => {
    const updated = { ...p, hormones: hormones ?? myHormones, updatedAt: new Date().toISOString() };
    setHealthProfile(updated);
    if (hormones) setMyHormones(hormones);
    await AsyncStorage.setItem(SK_PROFILE, JSON.stringify(updated));
  }, [myHormones]);

  const toggleDisease = async (id: string) => {
    const list = healthProfile.chronicDiseases.includes(id)
      ? healthProfile.chronicDiseases.filter((d) => d !== id)
      : [...healthProfile.chronicDiseases, id];
    await saveProfile({ ...healthProfile, chronicDiseases: list });
  };

  const toggleAllergy = async (id: string) => {
    const list = healthProfile.allergies.includes(id)
      ? healthProfile.allergies.filter((a) => a !== id)
      : [...healthProfile.allergies, id];
    await saveProfile({ ...healthProfile, allergies: list });
  };

  const toggleInjury = async (id: string) => {
    const list = healthProfile.injuries.includes(id)
      ? healthProfile.injuries.filter((i) => i !== id)
      : [...healthProfile.injuries, id];
    await saveProfile({ ...healthProfile, injuries: list });
  };

  const addSupplement = async () => {
    if (!selectedProduct || !doseInput.trim()) {
      Alert.alert("تنبيه", "اختر منتجاً وأدخل الجرعة");
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
    setShowAddSuppModal(false);
    setSelectedProduct(null);
    setDoseInput("");
    setNotesInput("");
    setSuppSearch("");
  };

  const removeSupplement = async (idx: number) => {
    Alert.alert("حذف", "هل تريد حذف هذا المكمل؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: async () => {
        await saveSupplements(mySupplements.filter((_, i) => i !== idx));
      }},
    ]);
  };

  const addHormone = async () => {
    if (!selectedHormone || !hormDose.trim()) {
      Alert.alert("تنبيه", "اختر هرموناً وأدخل الجرعة");
      return;
    }
    const entry: HormoneEntry = {
      id: Date.now().toString(),
      hormoneId: selectedHormone.id,
      label: selectedHormone.label,
      dose: parseFloat(hormDose) || selectedHormone.defaultDose,
      unit: selectedHormone.unit,
      frequency: hormFreq,
      company: hormCompany.trim(),
      startDate: new Date().toISOString().split("T")[0],
      notes: hormNotes.trim(),
    };
    const updated = [...myHormones, entry];
    await saveProfile(healthProfile, updated);
    setShowAddHormoneModal(false);
    setSelectedHormone(null);
    setHormDose("");
    setHormCompany("");
    setHormNotes("");
  };

  const removeHormone = async (id: string) => {
    Alert.alert("حذف", "هل تريد حذف هذا الإدخال؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: async () => {
        await saveProfile(healthProfile, myHormones.filter((h) => h.id !== id));
      }},
    ]);
  };

  const addMedication = async () => {
    if (!medName.trim()) return;
    const med: Medication = {
      id: Date.now().toString(),
      name: medName.trim(),
      dose: medDose.trim(),
      frequency: medFreq.trim(),
    };
    await saveProfile({ ...healthProfile, medications: [...healthProfile.medications, med] });
    setShowAddMedModal(false);
    setMedName(""); setMedDose(""); setMedFreq("");
  };

  const removeMedication = async (id: string) => {
    await saveProfile({ ...healthProfile, medications: healthProfile.medications.filter((m) => m.id !== id) });
  };

  const saveEditProfile = async () => {
    await saveProfile({
      ...healthProfile,
      name: editName,
      age: parseInt(editAge) || 0,
      weight: parseFloat(editWeight) || 0,
      height: parseFloat(editHeight) || 0,
    });
    setShowEditProfile(false);
  };

  const interactions = checkInteractions(mySupplements);

  const filteredProducts = products.filter((p) =>
    suppSearch.length < 2 || p.name_en.toLowerCase().includes(suppSearch.toLowerCase()) || p.brand.toLowerCase().includes(suppSearch.toLowerCase())
  );

  const hormoneCategories = ["TRT", "Peptide", "SARM"];

  // ─── Completion ───
  const completionItems = [
    healthProfile.name, healthProfile.age, healthProfile.weight, healthProfile.height,
    healthProfile.chronicDiseases.length > 0 || true,
    mySupplements.length > 0,
  ];
  const completionPct = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ─── Header ─── */}
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>ملفي الصحي</Text>
          <Pressable
            style={[styles.editBtn, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "40" }]}
            onPress={() => {
              setEditName(healthProfile.name);
              setEditAge(healthProfile.age ? String(healthProfile.age) : "");
              setEditWeight(healthProfile.weight ? String(healthProfile.weight) : "");
              setEditHeight(healthProfile.height ? String(healthProfile.height) : "");
              setShowEditProfile(true);
            }}
          >
            <IconSymbol name="pencil" size={14} color={colors.primary} />
            <Text style={[styles.editBtnText, { color: colors.primary }]}>تعديل</Text>
          </Pressable>
        </View>

        {/* Profile Summary */}
        <View style={[styles.profileSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary + "20" }]}>
            <IconSymbol name="person.crop.circle.fill" size={36} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>
              {healthProfile.name || "أضف اسمك"}
            </Text>
            <Text style={[styles.profileMeta, { color: colors.muted }]}>
              {[
                healthProfile.age ? `${healthProfile.age} سنة` : null,
                healthProfile.weight ? `${healthProfile.weight} كغ` : null,
                healthProfile.height ? `${healthProfile.height} سم` : null,
                healthProfile.gender === "male" ? "ذكر" : "أنثى",
              ].filter(Boolean).join(" · ")}
            </Text>
            <View style={styles.progressRow}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, { width: `${completionPct}%` as any, backgroundColor: colors.primary }]} />
              </View>
              <Text style={[styles.progressText, { color: colors.primary }]}>{completionPct}%</Text>
            </View>
          </View>
          <View style={styles.statsCol}>
            <View style={[styles.statBadge, { backgroundColor: colors.success + "18" }]}>
              <Text style={[styles.statBadgeNum, { color: colors.success }]}>{mySupplements.length}</Text>
              <Text style={[styles.statBadgeLabel, { color: colors.muted }]}>مكمل</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: colors.accent + "18" }]}>
              <Text style={[styles.statBadgeNum, { color: colors.accent }]}>{myHormones.length}</Text>
              <Text style={[styles.statBadgeLabel, { color: colors.muted }]}>هرمون</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: colors.primary, borderColor: colors.primary },
                activeTab !== tab.id && { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <IconSymbol name={tab.icon} size={13} color={activeTab === tab.id ? "#fff" : colors.muted} />
              <Text style={[styles.tabLabel, { color: activeTab === tab.id ? "#fff" : colors.muted }]}>{tab.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ─── Content ─── */}
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* ══ OVERVIEW ══ */}
        {activeTab === "overview" && (
          <View style={styles.section}>
            {/* Quick Stats */}
            <View style={[styles.statsGrid, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {[
                { label: "مكملات", value: mySupplements.length, color: colors.success, icon: "pills.fill" as const },
                { label: "هرمونات", value: myHormones.length, color: colors.accent, icon: "bolt.fill" as const },
                { label: "أمراض", value: healthProfile.chronicDiseases.length, color: colors.warning, icon: "heart.fill" as const },
                { label: "أدوية", value: healthProfile.medications.length, color: colors.primary, icon: "cross.fill" as const },
              ].map((s, i) => (
                <View key={i} style={styles.statGridItem}>
                  <View style={[styles.statGridIcon, { backgroundColor: s.color + "20" }]}>
                    <IconSymbol name={s.icon} size={18} color={s.color} />
                  </View>
                  <Text style={[styles.statGridNum, { color: s.color }]}>{s.value}</Text>
                  <Text style={[styles.statGridLabel, { color: colors.muted }]}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Interactions Alert */}
            {interactions.length > 0 && (
              <View style={[styles.alertBox, { backgroundColor: colors.warning + "15", borderColor: colors.warning + "50" }]}>
                <View style={styles.alertHeader}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={18} color={colors.warning} />
                  <Text style={[styles.alertTitle, { color: colors.warning }]}>تنبيهات التفاعلات</Text>
                </View>
                {interactions.map((w, i) => (
                  <Text key={i} style={[styles.alertItem, { color: colors.foreground }]}>{w}</Text>
                ))}
              </View>
            )}

            {/* Chronic Diseases Summary */}
            {healthProfile.chronicDiseases.length > 0 && (
              <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.summaryTitle, { color: colors.foreground }]}>الأمراض المزمنة</Text>
                <View style={styles.tagRow}>
                  {healthProfile.chronicDiseases.map((id) => {
                    const d = CHRONIC_DISEASES.find((x) => x.id === id);
                    return d ? (
                      <View key={id} style={[styles.tag, { backgroundColor: d.color + "20", borderColor: d.color + "50" }]}>
                        <Text style={[styles.tagText, { color: d.color }]}>{d.label}</Text>
                      </View>
                    ) : null;
                  })}
                </View>
              </View>
            )}

            {/* Allergies Summary */}
            {healthProfile.allergies.length > 0 && (
              <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.summaryTitle, { color: colors.foreground }]}>الحساسيات</Text>
                <View style={styles.tagRow}>
                  {healthProfile.allergies.map((id) => {
                    const a = ALLERGIES.find((x) => x.id === id);
                    return a ? (
                      <View key={id} style={[styles.tag, { backgroundColor: a.color + "20", borderColor: a.color + "50" }]}>
                        <Text style={[styles.tagText, { color: a.color }]}>{a.label}</Text>
                      </View>
                    ) : null;
                  })}
                </View>
              </View>
            )}

            {/* Medications */}
            {healthProfile.medications.length > 0 && (
              <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.summaryTitle, { color: colors.foreground }]}>الأدوية الحالية</Text>
                {healthProfile.medications.map((m) => (
                  <View key={m.id} style={[styles.medRow, { borderBottomColor: colors.border }]}>
                    <View>
                      <Text style={[styles.medName, { color: colors.foreground }]}>{m.name}</Text>
                      <Text style={[styles.medMeta, { color: colors.muted }]}>{m.dose} · {m.frequency}</Text>
                    </View>
                    <Pressable onPress={() => removeMedication(m.id)}>
                      <IconSymbol name="xmark.circle.fill" size={20} color={colors.error} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            <Pressable
              style={[styles.addMedBtn, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}
              onPress={() => setShowAddMedModal(true)}
            >
              <IconSymbol name="plus.circle.fill" size={18} color={colors.primary} />
              <Text style={[styles.addMedBtnText, { color: colors.primary }]}>إضافة دواء حالي</Text>
            </Pressable>
          </View>
        )}

        {/* ══ MY SUPPLEMENTS ══ */}
        {activeTab === "supplements" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>مكملاتي الحالية ({mySupplements.length})</Text>
              <Pressable
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
                onPress={() => setShowAddSuppModal(true)}
              >
                <IconSymbol name="plus" size={14} color="#fff" />
                <Text style={styles.addBtnText}>إضافة</Text>
              </Pressable>
            </View>

            {mySupplements.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <IconSymbol name="pills.fill" size={40} color={colors.muted} />
                <Text style={[styles.emptyText, { color: colors.muted }]}>لم تضف أي مكملات بعد</Text>
                <Text style={[styles.emptySubText, { color: colors.muted }]}>أضف مكملاتك لتتبع الجرعات والتفاعلات</Text>
              </View>
            ) : (
              mySupplements.map((s, idx) => (
                <View key={idx} style={[styles.suppCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.suppCardLeft}>
                    <Text style={[styles.suppName, { color: colors.foreground }]}>{s.productName}</Text>
                    <Text style={[styles.suppBrand, { color: colors.muted }]}>{s.brand} · {s.category_ar}</Text>
                    <View style={styles.suppMeta}>
                      <View style={[styles.metaChip, { backgroundColor: colors.primary + "18" }]}>
                        <Text style={[styles.metaChipText, { color: colors.primary }]}>{s.dose}</Text>
                      </View>
                      <View style={[styles.metaChip, { backgroundColor: colors.secondary + "18" }]}>
                        <Text style={[styles.metaChipText, { color: colors.secondary }]}>{s.timing}</Text>
                      </View>
                    </View>
                    {s.notes ? <Text style={[styles.suppNotes, { color: colors.muted }]}>{s.notes}</Text> : null}
                  </View>
                  <Pressable onPress={() => removeSupplement(idx)}>
                    <IconSymbol name="xmark.circle.fill" size={22} color={colors.error} />
                  </Pressable>
                </View>
              ))
            )}

            {interactions.length > 0 && (
              <View style={[styles.alertBox, { backgroundColor: colors.warning + "15", borderColor: colors.warning + "50", marginTop: 12 }]}>
                <View style={styles.alertHeader}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
                  <Text style={[styles.alertTitle, { color: colors.warning }]}>تفاعلات محتملة</Text>
                </View>
                {interactions.map((w, i) => (
                  <Text key={i} style={[styles.alertItem, { color: colors.foreground }]}>{w}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ══ HORMONES & PEPTIDES ══ */}
        {activeTab === "hormones" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الهرمونات والببتيدات ({myHormones.length})</Text>
              <Pressable
                style={[styles.addBtn, { backgroundColor: colors.accent }]}
                onPress={() => setShowAddHormoneModal(true)}
              >
                <IconSymbol name="plus" size={14} color="#fff" />
                <Text style={styles.addBtnText}>إضافة</Text>
              </Pressable>
            </View>

            {/* Warning */}
            <View style={[styles.alertBox, { backgroundColor: colors.error + "12", borderColor: colors.error + "40" }]}>
              <View style={styles.alertHeader}>
                <IconSymbol name="shield.fill" size={16} color={colors.error} />
                <Text style={[styles.alertTitle, { color: colors.error }]}>تنبيه طبي مهم</Text>
              </View>
              <Text style={[styles.alertItem, { color: colors.foreground }]}>
                هذا القسم للتوثيق الشخصي فقط. استشر طبيباً متخصصاً قبل استخدام أي هرمون أو ببتيد. المعلومات هنا لا تُعدّ نصيحة طبية.
              </Text>
            </View>

            {myHormones.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <IconSymbol name="bolt.fill" size={40} color={colors.muted} />
                <Text style={[styles.emptyText, { color: colors.muted }]}>لم تضف أي هرمونات بعد</Text>
                <Text style={[styles.emptySubText, { color: colors.muted }]}>وثّق هرموناتك وببتيداتك لمتابعة البروتوكول</Text>
              </View>
            ) : (
              myHormones.map((h) => (
                <View key={h.id} style={[styles.hormCard, { backgroundColor: colors.card, borderColor: colors.accent + "40" }]}>
                  <View style={styles.hormCardTop}>
                    <View style={[styles.hormIcon, { backgroundColor: colors.accent + "20" }]}>
                      <IconSymbol name="bolt.fill" size={18} color={colors.accent} />
                    </View>
                    <View style={styles.hormInfo}>
                      <Text style={[styles.hormName, { color: colors.foreground }]}>{h.label}</Text>
                      <Text style={[styles.hormMeta, { color: colors.muted }]}>
                        {h.dose} {h.unit} · {FREQUENCY_LABELS[h.frequency]}
                      </Text>
                      {h.company ? <Text style={[styles.hormCompany, { color: colors.primary }]}>{h.company}</Text> : null}
                    </View>
                    <Pressable onPress={() => removeHormone(h.id)}>
                      <IconSymbol name="xmark.circle.fill" size={22} color={colors.error} />
                    </Pressable>
                  </View>
                  {h.notes ? <Text style={[styles.hormNotes, { color: colors.muted }]}>{h.notes}</Text> : null}
                </View>
              ))
            )}

            {/* Reference Guide */}
            <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}>
              <Text style={[styles.summaryTitle, { color: colors.foreground }]}>دليل الهرمونات والببتيدات</Text>
              {hormoneCategories.map((cat) => {
                const items = HORMONES_PEPTIDES.filter((h) => h.category === cat);
                return (
                  <View key={cat} style={styles.hormCatSection}>
                    <Text style={[styles.hormCatTitle, { color: colors.accent }]}>{cat}</Text>
                    {items.map((item) => (
                      <View key={item.id} style={[styles.hormRefRow, { borderBottomColor: colors.border }]}>
                        <View>
                          <Text style={[styles.hormRefName, { color: colors.foreground }]}>{item.label}</Text>
                          <Text style={[styles.hormRefDose, { color: colors.muted }]}>
                            الجرعة الافتراضية: {item.defaultDose} {item.unit} · {FREQUENCY_LABELS[item.frequency]}
                          </Text>
                        </View>
                        <Pressable
                          style={[styles.quickAddBtn, { backgroundColor: colors.accent + "20" }]}
                          onPress={() => {
                            setSelectedHormone(item);
                            setHormDose(String(item.defaultDose));
                            setHormFreq(item.frequency);
                            setShowAddHormoneModal(true);
                          }}
                        >
                          <IconSymbol name="plus" size={14} color={colors.accent} />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ══ HEALTH ══ */}
        {activeTab === "health" && (
          <View style={styles.section}>
            {/* Chronic Diseases */}
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأمراض المزمنة</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>اضغط للتحديد — تؤثر على توصيات المكملات</Text>
            <View style={styles.tagGrid}>
              {CHRONIC_DISEASES.map((d) => {
                const selected = healthProfile.chronicDiseases.includes(d.id);
                return (
                  <Pressable
                    key={d.id}
                    style={[
                      styles.selectTag,
                      { borderColor: selected ? d.color : colors.border },
                      selected && { backgroundColor: d.color + "20" },
                      !selected && { backgroundColor: colors.card },
                    ]}
                    onPress={() => toggleDisease(d.id)}
                  >
                    <Text style={styles.tagIcon}>{d.icon}</Text>
                    <Text style={[styles.selectTagText, { color: selected ? d.color : colors.muted }]}>{d.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Allergies */}
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>الحساسيات</Text>
            <View style={styles.tagGrid}>
              {ALLERGIES.map((a) => {
                const selected = healthProfile.allergies.includes(a.id);
                return (
                  <Pressable
                    key={a.id}
                    style={[
                      styles.selectTag,
                      { borderColor: selected ? a.color : colors.border },
                      selected && { backgroundColor: a.color + "20" },
                      !selected && { backgroundColor: colors.card },
                    ]}
                    onPress={() => toggleAllergy(a.id)}
                  >
                    <Text style={styles.tagIcon}>{a.icon}</Text>
                    <Text style={[styles.selectTagText, { color: selected ? a.color : colors.muted }]}>{a.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Injuries */}
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>الإصابات</Text>
            <View style={styles.tagGrid}>
              {INJURIES.map((inj) => {
                const selected = healthProfile.injuries.includes(inj.id);
                return (
                  <Pressable
                    key={inj.id}
                    style={[
                      styles.selectTag,
                      { borderColor: selected ? colors.warning : colors.border },
                      selected && { backgroundColor: colors.warning + "20" },
                      !selected && { backgroundColor: colors.card },
                    ]}
                    onPress={() => toggleInjury(inj.id)}
                  >
                    <Text style={styles.tagIcon}>{inj.icon}</Text>
                    <Text style={[styles.selectTagText, { color: selected ? colors.warning : colors.muted }]}>{inj.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* ══ SCHEDULE ══ */}
        {activeTab === "schedule" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>جدول الجرعات اليومي</Text>
            {mySupplements.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <IconSymbol name="calendar" size={40} color={colors.muted} />
                <Text style={[styles.emptyText, { color: colors.muted }]}>أضف مكملاتك أولاً</Text>
              </View>
            ) : (
              TIMINGS.map((timing) => {
                const items = mySupplements.filter((s) => s.timing === timing);
                if (items.length === 0) return null;
                return (
                  <View key={timing} style={[styles.scheduleGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.scheduleHeader, { backgroundColor: colors.primary + "15" }]}>
                      <IconSymbol name="clock.fill" size={14} color={colors.primary} />
                      <Text style={[styles.scheduleTime, { color: colors.primary }]}>{timing}</Text>
                      <View style={[styles.scheduleCount, { backgroundColor: colors.primary }]}>
                        <Text style={styles.scheduleCountText}>{items.length}</Text>
                      </View>
                    </View>
                    {items.map((item, idx) => (
                      <View key={idx} style={[styles.scheduleItem, { borderBottomColor: colors.border }]}>
                        <View style={[styles.scheduleItemDot, { backgroundColor: colors.success }]} />
                        <View style={styles.scheduleItemInfo}>
                          <Text style={[styles.scheduleItemName, { color: colors.foreground }]}>{item.productName}</Text>
                          <Text style={[styles.scheduleItemDose, { color: colors.muted }]}>{item.dose} · {item.brand}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })
            )}

            {/* Hormones Schedule */}
            {myHormones.length > 0 && (
              <View style={[styles.scheduleGroup, { backgroundColor: colors.card, borderColor: colors.accent + "40", marginTop: 16 }]}>
                <View style={[styles.scheduleHeader, { backgroundColor: colors.accent + "15" }]}>
                  <IconSymbol name="bolt.fill" size={14} color={colors.accent} />
                  <Text style={[styles.scheduleTime, { color: colors.accent }]}>الهرمونات والببتيدات</Text>
                </View>
                {myHormones.map((h) => (
                  <View key={h.id} style={[styles.scheduleItem, { borderBottomColor: colors.border }]}>
                    <View style={[styles.scheduleItemDot, { backgroundColor: colors.accent }]} />
                    <View style={styles.scheduleItemInfo}>
                      <Text style={[styles.scheduleItemName, { color: colors.foreground }]}>{h.label}</Text>
                      <Text style={[styles.scheduleItemDose, { color: colors.muted }]}>
                        {h.dose} {h.unit} · {FREQUENCY_LABELS[h.frequency]}
                        {h.company ? ` · ${h.company}` : ""}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ════ MODALS ════ */}

      {/* Add Supplement Modal */}
      <Modal visible={showAddSuppModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>إضافة مكمل</Text>
            <Pressable onPress={() => { setShowAddSuppModal(false); setSelectedProduct(null); setSuppSearch(""); }}>
              <IconSymbol name="xmark.circle.fill" size={26} color={colors.muted} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalBody}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="ابحث عن منتج..."
              placeholderTextColor={colors.muted}
              value={suppSearch}
              onChangeText={setSuppSearch}
            />
            {selectedProduct ? (
              <View style={[styles.selectedCard, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}>
                <Text style={[styles.selectedName, { color: colors.primary }]}>{selectedProduct.name_en}</Text>
                <Text style={[styles.selectedBrand, { color: colors.muted }]}>{selectedProduct.brand}</Text>
                <Pressable onPress={() => setSelectedProduct(null)}>
                  <Text style={[styles.changeBtn, { color: colors.error }]}>تغيير</Text>
                </Pressable>
              </View>
            ) : (
              <FlatList
                data={filteredProducts.slice(0, 20)}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <Pressable
                    style={[styles.productPickRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => setSelectedProduct(item)}
                  >
                    <View>
                      <Text style={[styles.productPickName, { color: colors.foreground }]}>{item.name_en}</Text>
                      <Text style={[styles.productPickBrand, { color: colors.muted }]}>{item.brand} · {item.category_ar}</Text>
                    </View>
                    <View style={[styles.scoreMini, { backgroundColor: colors.success + "20" }]}>
                      <Text style={[styles.scoreMiniText, { color: colors.success }]}>{item.score.toFixed(1)}</Text>
                    </View>
                  </Pressable>
                )}
              />
            )}
            {selectedProduct && (
              <>
                <Text style={[styles.inputLabel, { color: colors.muted }]}>الجرعة</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="مثال: 2 كبسولة / 5 غ"
                  placeholderTextColor={colors.muted}
                  value={doseInput}
                  onChangeText={setDoseInput}
                />
                <Text style={[styles.inputLabel, { color: colors.muted }]}>التوقيت</Text>
                <View style={styles.timingRow}>
                  {TIMINGS.map((t) => (
                    <Pressable
                      key={t}
                      style={[
                        styles.timingChip,
                        { borderColor: timingInput === t ? colors.primary : colors.border },
                        timingInput === t && { backgroundColor: colors.primary + "20" },
                        timingInput !== t && { backgroundColor: colors.card },
                      ]}
                      onPress={() => setTimingInput(t)}
                    >
                      <Text style={[styles.timingChipText, { color: timingInput === t ? colors.primary : colors.muted }]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={[styles.inputLabel, { color: colors.muted }]}>ملاحظات (اختياري)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="أي ملاحظات..."
                  placeholderTextColor={colors.muted}
                  value={notesInput}
                  onChangeText={setNotesInput}
                />
                <Pressable style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={addSupplement}>
                  <Text style={styles.saveBtnText}>إضافة المكمل</Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Add Hormone Modal */}
      <Modal visible={showAddHormoneModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>إضافة هرمون / ببتيد</Text>
            <Pressable onPress={() => { setShowAddHormoneModal(false); setSelectedHormone(null); }}>
              <IconSymbol name="xmark.circle.fill" size={26} color={colors.muted} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalBody}>
            {!selectedHormone ? (
              <>
                {hormoneCategories.map((cat) => (
                  <View key={cat}>
                    <Text style={[styles.hormCatTitle, { color: colors.accent, marginBottom: 8 }]}>{cat}</Text>
                    {HORMONES_PEPTIDES.filter((h) => h.category === cat).map((item) => (
                      <Pressable
                        key={item.id}
                        style={[styles.productPickRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => {
                          setSelectedHormone(item);
                          setHormDose(String(item.defaultDose));
                          setHormFreq(item.frequency);
                        }}
                      >
                        <Text style={[styles.productPickName, { color: colors.foreground }]}>{item.label}</Text>
                        <Text style={[styles.productPickBrand, { color: colors.muted }]}>
                          {item.defaultDose} {item.unit} · {FREQUENCY_LABELS[item.frequency]}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ))}
              </>
            ) : (
              <>
                <View style={[styles.selectedCard, { backgroundColor: colors.accent + "15", borderColor: colors.accent + "40" }]}>
                  <Text style={[styles.selectedName, { color: colors.accent }]}>{selectedHormone.label}</Text>
                  <Pressable onPress={() => setSelectedHormone(null)}>
                    <Text style={[styles.changeBtn, { color: colors.error }]}>تغيير</Text>
                  </Pressable>
                </View>
                <Text style={[styles.inputLabel, { color: colors.muted }]}>الجرعة ({selectedHormone.unit})</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                  placeholder={`مثال: ${selectedHormone.defaultDose}`}
                  placeholderTextColor={colors.muted}
                  value={hormDose}
                  onChangeText={setHormDose}
                  keyboardType="numeric"
                />
                <Text style={[styles.inputLabel, { color: colors.muted }]}>التكرار</Text>
                <View style={styles.timingRow}>
                  {(Object.keys(FREQUENCY_LABELS) as HormoneEntry["frequency"][]).map((f) => (
                    <Pressable
                      key={f}
                      style={[
                        styles.timingChip,
                        { borderColor: hormFreq === f ? colors.accent : colors.border },
                        hormFreq === f && { backgroundColor: colors.accent + "20" },
                        hormFreq !== f && { backgroundColor: colors.card },
                      ]}
                      onPress={() => setHormFreq(f)}
                    >
                      <Text style={[styles.timingChipText, { color: hormFreq === f ? colors.accent : colors.muted }]}>
                        {FREQUENCY_LABELS[f]}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={[styles.inputLabel, { color: colors.muted }]}>الشركة / المصدر</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="اسم الشركة أو المصدر"
                  placeholderTextColor={colors.muted}
                  value={hormCompany}
                  onChangeText={setHormCompany}
                />
                <Text style={[styles.inputLabel, { color: colors.muted }]}>ملاحظات</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="أي ملاحظات..."
                  placeholderTextColor={colors.muted}
                  value={hormNotes}
                  onChangeText={setHormNotes}
                />
                <Pressable style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={addHormone}>
                  <Text style={styles.saveBtnText}>إضافة</Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Add Medication Modal */}
      <Modal visible={showAddMedModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>إضافة دواء</Text>
            <Pressable onPress={() => setShowAddMedModal(false)}>
              <IconSymbol name="xmark.circle.fill" size={26} color={colors.muted} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={[styles.inputLabel, { color: colors.muted }]}>اسم الدواء</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="مثال: Metformin"
              placeholderTextColor={colors.muted}
              value={medName}
              onChangeText={setMedName}
            />
            <Text style={[styles.inputLabel, { color: colors.muted }]}>الجرعة</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="مثال: 500 مغ"
              placeholderTextColor={colors.muted}
              value={medDose}
              onChangeText={setMedDose}
            />
            <Text style={[styles.inputLabel, { color: colors.muted }]}>التكرار</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="مثال: مرتين يومياً"
              placeholderTextColor={colors.muted}
              value={medFreq}
              onChangeText={setMedFreq}
            />
            <Pressable style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={addMedication}>
              <Text style={styles.saveBtnText}>إضافة الدواء</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>تعديل الملف الشخصي</Text>
            <Pressable onPress={() => setShowEditProfile(false)}>
              <IconSymbol name="xmark.circle.fill" size={26} color={colors.muted} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={[styles.inputLabel, { color: colors.muted }]}>الاسم</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="اسمك"
              placeholderTextColor={colors.muted}
              value={editName}
              onChangeText={setEditName}
            />
            <Text style={[styles.inputLabel, { color: colors.muted }]}>العمر</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="سنة"
              placeholderTextColor={colors.muted}
              value={editAge}
              onChangeText={setEditAge}
              keyboardType="numeric"
            />
            <Text style={[styles.inputLabel, { color: colors.muted }]}>الوزن (كغ)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="كغ"
              placeholderTextColor={colors.muted}
              value={editWeight}
              onChangeText={setEditWeight}
              keyboardType="numeric"
            />
            <Text style={[styles.inputLabel, { color: colors.muted }]}>الطول (سم)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="سم"
              placeholderTextColor={colors.muted}
              value={editHeight}
              onChangeText={setEditHeight}
              keyboardType="numeric"
            />
            <Text style={[styles.inputLabel, { color: colors.muted }]}>الجنس</Text>
            <View style={styles.genderRow}>
              {[{ id: "male" as const, label: "ذكر" }, { id: "female" as const, label: "أنثى" }].map((g) => (
                <Pressable
                  key={g.id}
                  style={[
                    styles.genderBtn,
                    { borderColor: healthProfile.gender === g.id ? colors.primary : colors.border },
                    healthProfile.gender === g.id && { backgroundColor: colors.primary + "20" },
                    healthProfile.gender !== g.id && { backgroundColor: colors.card },
                  ]}
                  onPress={() => setHealthProfile((p) => ({ ...p, gender: g.id }))}
                >
                  <Text style={[styles.genderBtnText, { color: healthProfile.gender === g.id ? colors.primary : colors.muted }]}>
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={saveEditProfile}>
              <Text style={styles.saveBtnText}>حفظ التغييرات</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: { borderBottomWidth: 0.5 },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: "900", fontFamily: "Cairo-Black" },
  editBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  editBtnText: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },

  // Profile Summary
  profileSummary: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1, alignItems: "flex-end" },
  profileName: { fontSize: 16, fontWeight: "800", marginBottom: 2, fontFamily: "Cairo-Black" },
  profileMeta: { fontSize: 11, marginBottom: 6, fontFamily: "Cairo" },
  progressRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, width: "100%" },
  progressBar: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  progressText: { fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  statsCol: { gap: 6 },
  statBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignItems: "center" },
  statBadgeNum: { fontSize: 16, fontWeight: "900", fontFamily: "Cairo-Black" },
  statBadgeLabel: { fontSize: 9, fontFamily: "Cairo" },

  // Tabs
  tabsScroll: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  tab: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabLabel: { fontSize: 12, fontWeight: "700", fontFamily: "Cairo-Bold" },

  // Section
  section: { padding: 16 },
  sectionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 10, fontFamily: "Cairo-Black" },
  sectionSubtitle: { fontSize: 12, marginBottom: 12, marginTop: -8, fontFamily: "Cairo" },

  // Stats Grid
  statsGrid: {
    flexDirection: "row-reverse",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  statGridItem: { flex: 1, alignItems: "center", gap: 4 },
  statGridIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statGridNum: { fontSize: 20, fontWeight: "900", fontFamily: "Cairo-Black" },
  statGridLabel: { fontSize: 10, fontFamily: "Cairo" },

  // Alert Box
  alertBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    gap: 6,
  },
  alertHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  alertTitle: { fontSize: 13, fontWeight: "800", fontFamily: "Cairo-Black" },
  alertItem: { fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },

  // Summary Card
  summaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  summaryTitle: { fontSize: 14, fontWeight: "800", marginBottom: 10, textAlign: "right", fontFamily: "Cairo-Black" },
  tagRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: "600", fontFamily: "Cairo-Bold" },

  // Tag Grid (selectable)
  tagGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  selectTag: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagIcon: { fontSize: 14, fontFamily: "Cairo" },
  selectTagText: { fontSize: 12, fontWeight: "600", fontFamily: "Cairo-Bold" },

  // Buttons
  addBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  addMedBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  addMedBtnText: { fontSize: 14, fontWeight: "700", fontFamily: "Cairo-Bold" },

  // Supplement Card
  suppCard: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    gap: 10,
  },
  suppCardLeft: { flex: 1, alignItems: "flex-end" },
  suppName: { fontSize: 14, fontWeight: "700", marginBottom: 2, fontFamily: "Cairo-Bold" },
  suppBrand: { fontSize: 11, marginBottom: 6, fontFamily: "Cairo" },
  suppMeta: { flexDirection: "row-reverse", gap: 6, marginBottom: 4 },
  metaChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  metaChipText: { fontSize: 11, fontWeight: "600", fontFamily: "Cairo-Bold" },
  suppNotes: { fontSize: 11, fontStyle: "italic", fontFamily: "Cairo" },

  // Hormone Card
  hormCard: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderLeftWidth: 3,
  },
  hormCardTop: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  hormIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  hormInfo: { flex: 1, alignItems: "flex-end" },
  hormName: { fontSize: 14, fontWeight: "700", fontFamily: "Cairo-Bold" },
  hormMeta: { fontSize: 11, marginTop: 2, fontFamily: "Cairo" },
  hormCompany: { fontSize: 11, fontWeight: "600", marginTop: 2, fontFamily: "Cairo-Bold" },
  hormNotes: { fontSize: 11, marginTop: 6, textAlign: "right", fontStyle: "italic", fontFamily: "Cairo" },
  hormCatSection: { marginBottom: 16 },
  hormCatTitle: { fontSize: 14, fontWeight: "800", marginBottom: 8, textAlign: "right", fontFamily: "Cairo-Black" },
  hormRefRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  hormRefName: { fontSize: 13, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  hormRefDose: { fontSize: 11, marginTop: 2, textAlign: "right", fontFamily: "Cairo" },
  quickAddBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },

  // Medication Row
  medRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  medName: { fontSize: 13, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  medMeta: { fontSize: 11, marginTop: 2, textAlign: "right", fontFamily: "Cairo" },

  // Empty Box
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    gap: 10,
  },
  emptyText: { fontSize: 15, fontWeight: "700", fontFamily: "Cairo-Bold" },
  emptySubText: { fontSize: 12, textAlign: "center", fontFamily: "Cairo" },

  // Schedule
  scheduleGroup: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
  scheduleTime: { fontSize: 13, fontWeight: "800", flex: 1, textAlign: "right", fontFamily: "Cairo-Black" },
  scheduleCount: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  scheduleCountText: { color: "#fff", fontSize: 11, fontWeight: "700", fontFamily: "Cairo-Bold" },
  scheduleItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderBottomWidth: 0.5,
  },
  scheduleItemDot: { width: 8, height: 8, borderRadius: 4 },
  scheduleItemInfo: { flex: 1, alignItems: "flex-end" },
  scheduleItemName: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  scheduleItemDose: { fontSize: 11, marginTop: 2, fontFamily: "Cairo" },

  // Modal
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 52,
    borderBottomWidth: 0.5,
  },
  modalTitle: { fontSize: 18, fontWeight: "900", fontFamily: "Cairo-Black" },
  modalBody: { padding: 16 },

  // Form
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    marginBottom: 14,
    textAlign: "right",
    fontFamily: "Cairo",
  },
  inputLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, textAlign: "right", fontFamily: "Cairo-Bold" },
  timingRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  timingChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  timingChipText: { fontSize: 12, fontWeight: "600", fontFamily: "Cairo-Bold" },
  genderRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 14 },
  genderBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  genderBtnText: { fontSize: 14, fontWeight: "700", fontFamily: "Cairo-Bold" },
  saveBtn: {
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "800", fontFamily: "Cairo-Black" },

  // Product picker
  selectedCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
    alignItems: "flex-end",
  },
  selectedName: { fontSize: 14, fontWeight: "800", fontFamily: "Cairo-Black" },
  selectedBrand: { fontSize: 11, marginTop: 2, fontFamily: "Cairo" },
  changeBtn: { fontSize: 12, fontWeight: "700", marginTop: 6, fontFamily: "Cairo-Bold" },
  productPickRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  productPickName: { fontSize: 13, fontWeight: "700", textAlign: "right", fontFamily: "Cairo-Bold" },
  productPickBrand: { fontSize: 11, marginTop: 2, textAlign: "right", fontFamily: "Cairo" },
  scoreMini: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scoreMiniText: { fontSize: 12, fontWeight: "800", fontFamily: "Cairo-Black" },
});
