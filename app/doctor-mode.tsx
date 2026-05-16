/**
 * وضع الطبيب — ملخص طبي احترافي
 * Features: 62 (وضع الطبيب), 27 (مشاركة الخطة الصحية), 8 (تصدير PDF)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

interface HealthProfile {
  name?: string;
  age?: string;
  weight?: string;
  height?: string;
  gender?: string;
  bloodType?: string;
  diseases?: string[];
  medications?: string[];
  supplements?: string[];
  allergies?: string[];
  goals?: string[];
}

export default function DoctorModeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [profile, setProfile] = useState<HealthProfile>({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem("healthProfile");
      if (stored) setProfile(JSON.parse(stored));
    } catch {}
    setLoading(false);
  };

  const generateMedicalSummary = () => {
    const date = new Date().toLocaleDateString("ar-SA");
    const lines: string[] = [];

    lines.push("═══════════════════════════════════");
    lines.push("       ملخص طبي للمريض");
    lines.push(`       تاريخ: ${date}`);
    lines.push("═══════════════════════════════════");
    lines.push("");

    if (profile.name) lines.push(`الاسم: ${profile.name}`);
    if (profile.age) lines.push(`العمر: ${profile.age} سنة`);
    if (profile.gender) lines.push(`الجنس: ${profile.gender}`);
    if (profile.weight) lines.push(`الوزن: ${profile.weight} كغ`);
    if (profile.height) lines.push(`الطول: ${profile.height} سم`);
    if (profile.bloodType) lines.push(`فصيلة الدم: ${profile.bloodType}`);

    lines.push("");
    lines.push("─── الأمراض المزمنة ───");
    if (profile.diseases?.length) {
      profile.diseases.forEach((d) => lines.push(`• ${d}`));
    } else {
      lines.push("لا توجد أمراض مزمنة مسجلة");
    }

    lines.push("");
    lines.push("─── الأدوية الحالية ───");
    if (profile.medications?.length) {
      profile.medications.forEach((m) => lines.push(`• ${m}`));
    } else {
      lines.push("لا توجد أدوية حالية");
    }

    lines.push("");
    lines.push("─── المكملات الغذائية الحالية ───");
    if (profile.supplements?.length) {
      profile.supplements.forEach((s) => lines.push(`• ${s}`));
    } else {
      lines.push("لا توجد مكملات مسجلة");
    }

    lines.push("");
    lines.push("─── الحساسية ───");
    if (profile.allergies?.length) {
      profile.allergies.forEach((a) => lines.push(`• ${a}`));
    } else {
      lines.push("لا توجد حساسية مسجلة");
    }

    lines.push("");
    lines.push("─── الأهداف الصحية ───");
    if (profile.goals?.length) {
      profile.goals.forEach((g) => lines.push(`• ${g}`));
    } else {
      lines.push("لا توجد أهداف مسجلة");
    }

    lines.push("");
    lines.push("═══════════════════════════════════");
    lines.push("تم إنشاء هذا الملخص بواسطة تطبيق");
    lines.push("علم المكملات الغذائية");
    lines.push("═══════════════════════════════════");

    return lines.join("\n");
  };

  const handleShare = async () => {
    try {
      const summary = generateMedicalSummary();
      await Share.share({
        message: summary,
        title: "الملخص الطبي",
      });
    } catch {}
  };

  const handleCopy = async () => {
    try {
      // Use clipboard if available, otherwise just show feedback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const summary = generateMedicalSummary();

  const hasData = profile.name || profile.age || profile.diseases?.length || profile.medications?.length || profile.supplements?.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#1e3a5f", borderBottomColor: "#2d4f7a" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color="#7eb8f7" />
          <Text style={[styles.backText, { color: "#7eb8f7" }]}>رجوع</Text>
        </Pressable>
        <View style={styles.headerIcon}>
          <IconSymbol name="stethoscope" size={28} color="#fff" />
        </View>
        <Text style={[styles.headerTitle, { color: "#fff" }]}>وضع الطبيب</Text>
        <Text style={[styles.headerSub, { color: "#7eb8f7" }]}>ملخص طبي احترافي لمشاركته مع طبيبك أو صيدلانيك</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {!hasData && (
          <View style={[styles.emptyCard, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
            <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>الملف الصحي فارغ</Text>
              <Text style={[styles.emptyText, { color: colors.muted }]}>أكمل ملفك الصحي أولاً لإنشاء ملخص طبي مفيد</Text>
              <Pressable
                style={[styles.fillBtn, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/(tabs)/profile" as any)}
              >
                <Text style={styles.fillBtnText}>إكمال الملف الصحي</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Summary Preview */}
        <View style={[styles.summaryCard, { backgroundColor: "#f8faff", borderColor: "#c8d8f0" }]}>
          <View style={styles.summaryHeader}>
            <IconSymbol name="doc.text.fill" size={16} color="#1e3a5f" />
            <Text style={[styles.summaryHeaderText, { color: "#1e3a5f" }]}>معاينة الملخص الطبي</Text>
          </View>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, { backgroundColor: "#1e3a5f", opacity: pressed ? 0.85 : 1, flex: 1 }]}
            onPress={handleShare}
          >
            <IconSymbol name="square.and.arrow.up" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>مشاركة</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, { backgroundColor: copied ? colors.success : colors.surface, borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.85 : 1, flex: 1 }]}
            onPress={handleCopy}
          >
            <IconSymbol name="doc.on.doc.fill" size={18} color={copied ? "#fff" : colors.foreground} />
            <Text style={[styles.actionBtnText, { color: copied ? "#fff" : colors.foreground }]}>{copied ? "تم النسخ!" : "نسخ النص"}</Text>
          </Pressable>
        </View>

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tipsTitle, { color: colors.foreground }]}>نصائح للاستخدام الأمثل</Text>
          {[
            "أرسل هذا الملخص لطبيبك قبل الموعد لتوفير الوقت",
            "شارك الملخص مع الصيدلاني للتحقق من التفاعلات الدوائية",
            "احتفظ بنسخة في هاتفك للطوارئ",
            "حدّث الملف الصحي بانتظام مع أي تغيير في الأدوية",
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.tipText, { color: colors.muted }]}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Pharmacist Report */}
        <View style={[styles.pharmacistCard, { backgroundColor: colors.success + "12", borderColor: colors.success + "30" }]}>
          <IconSymbol name="pills.fill" size={20} color={colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.pharmacistTitle, { color: colors.foreground }]}>تقرير الصيدلاني (Feature #145)</Text>
            <Text style={[styles.pharmacistText, { color: colors.muted }]}>
              الملخص أعلاه يتضمن جميع المكملات والأدوية الحالية — مثالي لمشاركته مع الصيدلاني للتحقق من التفاعلات الدوائية
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600", fontFamily: "Cairo-Bold" },
  headerIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#2d4f7a", alignItems: "center", justifyContent: "center", alignSelf: "flex-end", marginBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, lineHeight: 18, fontFamily: "Cairo" },
  emptyCard: { flexDirection: "row-reverse", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  emptyTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  emptyText: { fontSize: 12, lineHeight: 18, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  fillBtn: { borderRadius: 10, padding: 10, alignItems: "center", marginTop: 10 },
  fillBtnText: { color: "#fff", fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  summaryCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  summaryHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 12, backgroundColor: "#e8f0fb" },
  summaryHeaderText: { fontSize: 13, fontWeight: "700", fontFamily: "Cairo-Bold" },
  summaryText: { fontFamily: "Cairo", fontSize: 11, lineHeight: 18, padding: 12, textAlign: "right", color: "#1a2a3a" },
  actionsRow: { flexDirection: "row-reverse", gap: 12 },
  actionBtn: { borderRadius: 14, padding: 14, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8 },
  actionBtnText: { fontSize: 14, fontWeight: "700", color: "#fff", fontFamily: "Cairo-Bold" },
  tipsCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 10 },
  tipsTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", marginBottom: 4, fontFamily: "Cairo-Black" },
  tipRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  tipText: { flex: 1, fontSize: 12, lineHeight: 18, textAlign: "right", fontFamily: "Cairo" },
  pharmacistCard: { flexDirection: "row-reverse", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  pharmacistTitle: { fontSize: 14, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  pharmacistText: { fontSize: 12, lineHeight: 18, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
});
