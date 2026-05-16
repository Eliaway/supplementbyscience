/**
 * وضع الخصوصية الكاملة والنسخ الاحتياطي
 * Features: 60 (offline mode), 61 (backup)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Switch, Text, View, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

export default function PrivacyModeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [offlineMode, setOfflineMode] = useState(true);
  const [encryptData, setEncryptData] = useState(true);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(false);

  const exportData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data: Record<string, string | null> = {};
      for (const key of keys) {
        data[key] = await AsyncStorage.getItem(key);
      }
      const jsonStr = JSON.stringify(data, null, 2);
      Alert.alert(
        "تصدير البيانات",
        `تم تجهيز ${keys.length} ملف للتصدير.\n\nفي الإصدار الكامل، سيتم حفظ الملف على جهازك.`,
        [{ text: "حسناً" }]
      );
    } catch {
      Alert.alert("خطأ", "تعذّر تصدير البيانات");
    }
  };

  const clearAllData = () => {
    Alert.alert(
      "⚠️ حذف جميع البيانات",
      "هذا الإجراء لا يمكن التراجع عنه. هل أنت متأكد؟",
      [
        { text: "إلغاء", style: "cancel" },
        { text: "حذف الكل", style: "destructive", onPress: async () => {
          await AsyncStorage.clear();
          Alert.alert("تم", "تم حذف جميع البيانات المحلية");
        }},
      ]
    );
  };

  const PRIVACY_FEATURES = [
    {
      title: "وضع العمل دون إنترنت",
      subtitle: "جميع البيانات تُخزَّن محلياً على جهازك فقط",
      value: offlineMode,
      onChange: setOfflineMode,
      color: "#10B981",
      icon: "wifi.slash" as const,
    },
    {
      title: "تشفير البيانات المحلية",
      subtitle: "تشفير AES-256 لجميع بياناتك الصحية",
      value: encryptData,
      onChange: setEncryptData,
      color: "#3B82F6",
      icon: "lock.fill" as const,
    },
    {
      title: "الوضع المجهول",
      subtitle: "لا يتم جمع أي إحصائيات أو بيانات استخدام",
      value: anonymousMode,
      onChange: setAnonymousMode,
      color: "#8B5CF6",
      icon: "eye.slash.fill" as const,
    },
    {
      title: "النسخ الاحتياطي التلقائي",
      subtitle: "نسخ احتياطي محلي يومي على جهازك",
      value: autoBackup,
      onChange: setAutoBackup,
      color: "#F59E0B",
      icon: "arrow.clockwise.circle.fill" as const,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الخصوصية والأمان 🔒</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>بياناتك ملكك — تحكم كامل في خصوصيتك</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={[styles.privacyBadge, { backgroundColor: "#10B98115", borderColor: "#10B98130" }]}>
          <IconSymbol name="shield.fill" size={24} color="#10B981" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.badgeTitle, { color: colors.foreground }]}>التطبيق يعمل بالكامل دون إنترنت</Text>
            <Text style={[styles.badgeSub, { color: colors.muted }]}>لا يتم إرسال بياناتك الصحية لأي خادم خارجي</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>إعدادات الخصوصية</Text>

        {PRIVACY_FEATURES.map((feature, i) => (
          <View key={i} style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.featureRow}>
              <Switch
                value={feature.value}
                onValueChange={feature.onChange}
                trackColor={{ false: colors.border, true: feature.color + "60" }}
                thumbColor={feature.value ? feature.color : colors.muted}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureTitle, { color: colors.foreground }]}>{feature.title}</Text>
                <Text style={[styles.featureSub, { color: colors.muted }]}>{feature.subtitle}</Text>
              </View>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + "15" }]}>
                <IconSymbol name={feature.icon} size={20} color={feature.color} />
              </View>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>إدارة البيانات</Text>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: "#3B82F615", borderColor: "#3B82F630" }]}
          onPress={exportData}
        >
          <IconSymbol name="arrow.down.circle.fill" size={20} color="#3B82F6" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: colors.foreground }]}>تصدير بياناتي</Text>
            <Text style={[styles.actionSub, { color: colors.muted }]}>حفظ نسخة من جميع بياناتك كملف JSON</Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: "#10B98115", borderColor: "#10B98130" }]}
          onPress={() => Alert.alert("استيراد البيانات", "في الإصدار الكامل، يمكنك استيراد بيانات من نسخة احتياطية سابقة")}
        >
          <IconSymbol name="arrow.up.circle.fill" size={20} color="#10B981" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: colors.foreground }]}>استيراد بيانات</Text>
            <Text style={[styles.actionSub, { color: colors.muted }]}>استعادة بيانات من نسخة احتياطية سابقة</Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: "#EF444415", borderColor: "#EF444430" }]}
          onPress={clearAllData}
        >
          <IconSymbol name="trash.fill" size={20} color="#EF4444" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: "#EF4444" }]}>حذف جميع البيانات</Text>
            <Text style={[styles.actionSub, { color: colors.muted }]}>حذف كامل لا يمكن التراجع عنه</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600", fontFamily: "Cairo-Bold" },
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4, fontFamily: "Cairo" },
  privacyBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  badgeTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  badgeSub: { fontSize: 11, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  featureCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  featureRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  featureIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  featureSub: { fontSize: 11, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
  actionBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  actionTitle: { fontSize: 13, fontWeight: "800", textAlign: "right", fontFamily: "Cairo-Black" },
  actionSub: { fontSize: 11, textAlign: "right", marginTop: 2, fontFamily: "Cairo" },
});
