/**
 * نظام الإنذار المبكر الصحي
 * Feature: 93 (الإنذار المبكر), 25 (تنبيهات الصلاحية والمخزون)
 */
import { useState } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

I18nManager.forceRTL(true);

const HEALTH_ALERTS = [
  {
    id: "1",
    type: "warning",
    title: "نقص محتمل في Vitamin D",
    description: "لم تأخذ Vitamin D منذ 5 أيام — مستوياتك قد تنخفض",
    icon: "sun.max.fill" as const,
    color: "#F59E0B",
    action: "أضف للجدول",
  },
  {
    id: "2",
    type: "info",
    title: "حان وقت إعادة الاختبار",
    description: "مضى 3 أشهر على آخر اختبار نقص — يُنصح بإعادته",
    icon: "chart.bar.fill" as const,
    color: "#3B82F6",
    action: "ابدأ الاختبار",
  },
  {
    id: "3",
    type: "success",
    title: "استمرارية ممتازة!",
    description: "أخذت Omega-3 يومياً لـ 30 يوم متواصل",
    icon: "checkmark.circle.fill" as const,
    color: "#10B981",
    action: null,
  },
  {
    id: "4",
    type: "error",
    title: "تفاعل محتمل",
    description: "Zinc + Calcium في نفس الوقت يقلل امتصاص كليهما",
    icon: "exclamationmark.triangle.fill" as const,
    color: "#EF4444",
    action: "راجع الجدول",
  },
];

const EXPIRY_ALERTS = [
  { supplement: "Omega-3 Nordic Naturals", expiryDate: "2025-08-15", daysLeft: 92, status: "ok" },
  { supplement: "Vitamin D3 Sports Research", expiryDate: "2025-06-30", daysLeft: 46, status: "warning" },
  { supplement: "Magnesium Glycinate", expiryDate: "2025-05-20", daysLeft: 16, status: "urgent" },
];

const NOTIFICATION_SETTINGS = [
  { id: "daily_reminder", title: "تذكير يومي بالجرعات", desc: "إشعار في الوقت المحدد" },
  { id: "expiry_alert", title: "تنبيه انتهاء الصلاحية", desc: "قبل 30 يوم من الانتهاء" },
  { id: "reorder_alert", title: "تنبيه إعادة الطلب", desc: "عند انخفاض المخزون" },
  { id: "health_check", title: "تذكير الفحص الدوري", desc: "كل 3 أشهر" },
  { id: "interaction_alert", title: "تحذير التفاعلات", desc: "عند إضافة مكمل جديد" },
];

export default function HealthAlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    daily_reminder: true,
    expiry_alert: true,
    reorder_alert: false,
    health_check: true,
    interaction_alert: true,
  });

  const getExpiryColor = (status: string) => {
    if (status === "urgent") return "#EF4444";
    if (status === "warning") return "#F59E0B";
    return "#10B981";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>رجوع</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الإنذار المبكر الصحي</Text>
        <Text style={[styles.headerSub, { color: colors.muted }]}>تنبيهات ذكية • صلاحية المكملات • إشعارات</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
        {/* Active Alerts */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>التنبيهات النشطة</Text>
        <View style={{ gap: 10 }}>
          {HEALTH_ALERTS.map((alert) => (
            <View key={alert.id} style={[styles.alertCard, { backgroundColor: alert.color + "10", borderColor: alert.color + "30" }]}>
              <View style={{ flex: 1, gap: 4 }}>
                {alert.action && (
                  <Pressable style={[styles.actionBtn, { backgroundColor: alert.color }]}>
                    <Text style={styles.actionBtnText}>{alert.action}</Text>
                  </Pressable>
                )}
                <Text style={[styles.alertDesc, { color: colors.muted }]}>{alert.description}</Text>
                <Text style={[styles.alertTitle, { color: colors.foreground }]}>{alert.title}</Text>
              </View>
              <View style={[styles.alertIcon, { backgroundColor: alert.color + "20" }]}>
                <IconSymbol name={alert.icon} size={22} color={alert.color} />
              </View>
            </View>
          ))}
        </View>

        {/* Expiry Tracker */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>تتبع الصلاحية</Text>
        <View style={{ gap: 8 }}>
          {EXPIRY_ALERTS.map((item, i) => {
            const expColor = getExpiryColor(item.status);
            return (
              <View key={i} style={[styles.expiryCard, { backgroundColor: colors.surface, borderColor: expColor + "30" }]}>
                <View style={[styles.daysLeft, { backgroundColor: expColor + "15" }]}>
                  <Text style={[styles.daysNum, { color: expColor }]}>{item.daysLeft}</Text>
                  <Text style={[styles.daysLabel, { color: expColor }]}>يوم</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.expiryName, { color: colors.foreground }]}>{item.supplement}</Text>
                  <Text style={[styles.expiryDate, { color: colors.muted }]}>ينتهي: {item.expiryDate}</Text>
                  {item.status === "urgent" && (
                    <Text style={[styles.urgentText, { color: "#EF4444" }]}>⚠️ يجب إعادة الطلب قريباً</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Notification Settings */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>إعدادات الإشعارات</Text>
        <View style={[styles.notifCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {NOTIFICATION_SETTINGS.map((setting, i) => (
            <View key={setting.id}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.notifRow}>
                <Switch
                  value={notifications[setting.id]}
                  onValueChange={(val) => setNotifications((prev) => ({ ...prev, [setting.id]: val }))}
                  trackColor={{ false: colors.border, true: colors.primary + "80" }}
                  thumbColor={notifications[setting.id] ? colors.primary : colors.muted}
                />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.notifTitle, { color: colors.foreground }]}>{setting.title}</Text>
                  <Text style={[styles.notifDesc, { color: colors.muted }]}>{setting.desc}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 0.5 },
  backBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  alertCard: { borderRadius: 14, borderWidth: 1, padding: 12, flexDirection: "row-reverse", gap: 10, alignItems: "flex-start" },
  alertIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  alertTitle: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  alertDesc: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  actionBtn: { alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  actionBtnText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  expiryCard: { borderRadius: 14, borderWidth: 1, padding: 12, flexDirection: "row-reverse", gap: 12, alignItems: "center" },
  daysLeft: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  daysNum: { fontSize: 20, fontWeight: "900" },
  daysLabel: { fontSize: 10, fontWeight: "700" },
  expiryName: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  expiryDate: { fontSize: 11, textAlign: "right" },
  urgentText: { fontSize: 11, fontWeight: "700", textAlign: "right" },
  notifCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  notifRow: { flexDirection: "row-reverse", alignItems: "center", padding: 14, gap: 12 },
  divider: { height: 0.5, marginHorizontal: 14 },
  notifTitle: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  notifDesc: { fontSize: 11, textAlign: "right" },
});
