import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import {
  Alert,
  I18nManager,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

I18nManager.forceRTL(true);

const LOCK_KEY = "biometric_lock_enabled";
const LOCK_TIMEOUT_KEY = "biometric_lock_timeout";

const TIMEOUT_OPTIONS = [
  { label: "فوراً عند الخروج", value: 0 },
  { label: "بعد دقيقة", value: 60 },
  { label: "بعد 5 دقائق", value: 300 },
  { label: "بعد 15 دقيقة", value: 900 },
  { label: "بعد 30 دقيقة", value: 1800 },
];

export default function BiometricLockScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricType, setBiometricType] = useState<"face" | "fingerprint" | "none">("none");
  const [lockEnabled, setLockEnabled] = useState(false);
  const [timeout, setTimeout_] = useState(0);

  useEffect(() => {
    checkBiometrics();
    loadSettings();
  }, []);

  async function checkBiometrics() {
    const hw = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasHardware(hw);
    setIsEnrolled(enrolled);

    if (hw && enrolled) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType("face");
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType("fingerprint");
      }
    }
  }

  async function loadSettings() {
    const [lockVal, timeoutVal] = await Promise.all([
      AsyncStorage.getItem(LOCK_KEY),
      AsyncStorage.getItem(LOCK_TIMEOUT_KEY),
    ]);
    setLockEnabled(lockVal === "true");
    if (timeoutVal) setTimeout_(parseInt(timeoutVal));
  }

  async function toggleLock(val: boolean) {
    if (val) {
      // Verify biometrics before enabling
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "تأكيد تفعيل قفل البصمة",
        cancelLabel: "إلغاء",
        fallbackLabel: "استخدام رمز الجهاز",
      });
      if (!result.success) {
        if (result.error !== "user_cancel") {
          Alert.alert("فشل التحقق", "لم يتم التحقق من هويتك. حاول مرة أخرى.");
        }
        return;
      }
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setLockEnabled(val);
    await AsyncStorage.setItem(LOCK_KEY, val ? "true" : "false");
  }

  async function selectTimeout(val: number) {
    setTimeout_(val);
    await AsyncStorage.setItem(LOCK_TIMEOUT_KEY, val.toString());
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  async function testBiometric() {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "اختبار قفل البصمة",
      cancelLabel: "إلغاء",
      fallbackLabel: "استخدام رمز الجهاز",
    });
    if (result.success) {
      Alert.alert("✅ نجح التحقق", "قفل البصمة يعمل بشكل صحيح!");
    } else if (result.error !== "user_cancel") {
      Alert.alert("❌ فشل التحقق", result.warning || "تعذّر التحقق من البصمة.");
    }
  }

  const biometricIcon = biometricType === "face" ? "🫥" : biometricType === "fingerprint" ? "👆" : "🔒";
  const biometricName = biometricType === "face" ? "بصمة الوجه" : biometricType === "fingerprint" ? "بصمة الإصبع" : "البصمة";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
          قفل التطبيق بالبصمة
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Status card */}
        <View style={[styles.statusCard, {
          backgroundColor: hasHardware && isEnrolled ? colors.success + "18" : colors.warning + "18",
          borderColor: hasHardware && isEnrolled ? colors.success + "44" : colors.warning + "44",
        }]}>
          <Text style={styles.statusIcon}>{hasHardware && isEnrolled ? biometricIcon : "⚠️"}</Text>
          <View style={styles.statusText}>
            <Text style={[styles.statusTitle, {
              color: hasHardware && isEnrolled ? colors.success : colors.warning,
              fontFamily: "Cairo-Bold",
            }]}>
              {hasHardware && isEnrolled
                ? `${biometricName} متاحة`
                : !hasHardware
                ? "الجهاز لا يدعم البصمة"
                : "لم يتم تسجيل بصمة على الجهاز"}
            </Text>
            <Text style={[styles.statusDesc, { color: colors.muted, fontFamily: "Cairo" }]}>
              {hasHardware && isEnrolled
                ? `يمكنك تفعيل القفل باستخدام ${biometricName}`
                : !hasHardware
                ? "جهازك لا يحتوي على مستشعر بصمة"
                : "يرجى إضافة بصمة في إعدادات الجهاز"}
            </Text>
          </View>
        </View>

        {/* Lock toggle */}
        <View style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
              {biometricIcon} تفعيل قفل التطبيق
            </Text>
            <Text style={[styles.settingDesc, { color: colors.muted, fontFamily: "Cairo" }]}>
              يُطلب التحقق عند فتح التطبيق
            </Text>
          </View>
          <Switch
            value={lockEnabled}
            onValueChange={toggleLock}
            disabled={!hasHardware || !isEnrolled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* Timeout selection */}
        {lockEnabled && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
              ⏱ وقت القفل التلقائي
            </Text>
            {TIMEOUT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => selectTimeout(opt.value)}
                style={({ pressed }) => [
                  styles.timeoutOption,
                  {
                    backgroundColor: timeout === opt.value ? colors.primary + "18" : "transparent",
                    borderColor: timeout === opt.value ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={[styles.timeoutText, {
                  color: timeout === opt.value ? colors.primary : colors.foreground,
                  fontFamily: timeout === opt.value ? "Cairo-Bold" : "Cairo",
                }]}>
                  {opt.label}
                </Text>
                {timeout === opt.value && (
                  <Text style={{ color: colors.primary, fontSize: 16 }}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Test button */}
        {hasHardware && isEnrolled && (
          <Pressable
            onPress={testBiometric}
            style={({ pressed }) => [
              styles.testBtn,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.testBtnIcon}>{biometricIcon}</Text>
            <Text style={[styles.testBtnText, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
              اختبار {biometricName}
            </Text>
          </Pressable>
        )}

        {/* Info note */}
        <View style={[styles.infoNote, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.infoIcon}>🔐</Text>
          <Text style={[styles.infoText, { color: colors.muted, fontFamily: "Cairo" }]}>
            بياناتك الصحية محفوظة محلياً على جهازك. قفل البصمة يضيف طبقة حماية إضافية لمنع الوصول غير المصرح به.
          </Text>
        </View>
      </View>
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
  content: { flex: 1, padding: 16, gap: 14 },
  statusCard: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  statusIcon: { fontSize: 32 },
  statusText: { flex: 1, alignItems: "flex-end", gap: 4 },
  statusTitle: { fontSize: 14, fontFamily: "Cairo-Bold", textAlign: "right" },
  statusDesc: { fontSize: 12, fontFamily: "Cairo", textAlign: "right" },
  settingRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  settingInfo: { flex: 1, alignItems: "flex-end", gap: 4 },
  settingTitle: { fontSize: 15, fontFamily: "Cairo-Bold" },
  settingDesc: { fontSize: 12, fontFamily: "Cairo" },
  section: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  sectionTitle: { fontSize: 14, fontFamily: "Cairo-Bold", textAlign: "right", marginBottom: 4 },
  timeoutOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeoutText: { fontSize: 13, fontFamily: "Cairo" },
  testBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  testBtnIcon: { fontSize: 24 },
  testBtnText: { fontSize: 15, fontFamily: "Cairo-Bold" },
  infoNote: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  infoIcon: { fontSize: 20 },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Cairo", textAlign: "right", lineHeight: 20 },
});
