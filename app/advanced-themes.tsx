import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  I18nManager,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

I18nManager.forceRTL(true);

interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  primary: string;
  background: string;
  surface: string;
  foreground: string;
  description: string;
}

const THEMES: AppTheme[] = [
  {
    id: "default_light",
    name: "الافتراضي الفاتح",
    emoji: "☀️",
    primary: "#0a7ea4",
    background: "#ffffff",
    surface: "#f5f5f5",
    foreground: "#11181C",
    description: "الثيم الأصلي للتطبيق",
  },
  {
    id: "default_dark",
    name: "الافتراضي الداكن",
    emoji: "🌙",
    primary: "#0a7ea4",
    background: "#151718",
    surface: "#1e2022",
    foreground: "#ECEDEE",
    description: "وضع الظلام الكلاسيكي",
  },
  {
    id: "ocean_dark",
    name: "المحيط الداكن",
    emoji: "🌊",
    primary: "#0ea5e9",
    background: "#0a1628",
    surface: "#0f2040",
    foreground: "#e0f2fe",
    description: "أزرق عميق مريح للعيون",
  },
  {
    id: "forest_dark",
    name: "الغابة الداكنة",
    emoji: "🌿",
    primary: "#22c55e",
    background: "#0a1a0f",
    surface: "#0f2a18",
    foreground: "#dcfce7",
    description: "أخضر طبيعي هادئ",
  },
  {
    id: "purple_dark",
    name: "البنفسجي الداكن",
    emoji: "💜",
    primary: "#a855f7",
    background: "#120a1e",
    surface: "#1e1030",
    foreground: "#f3e8ff",
    description: "بنفسجي أنيق وعصري",
  },
  {
    id: "sunset",
    name: "غروب الشمس",
    emoji: "🌅",
    primary: "#f97316",
    background: "#1a0f08",
    surface: "#2a1810",
    foreground: "#fff7ed",
    description: "برتقالي دافئ ومريح",
  },
  {
    id: "rose",
    name: "الوردي الناعم",
    emoji: "🌸",
    primary: "#ec4899",
    background: "#fdf2f8",
    surface: "#fce7f3",
    foreground: "#1f0a14",
    description: "وردي ناعم للاستخدام النهاري",
  },
  {
    id: "gold",
    name: "الذهبي الفاخر",
    emoji: "✨",
    primary: "#d97706",
    background: "#1a1200",
    surface: "#2a1e00",
    foreground: "#fef3c7",
    description: "ذهبي فاخر وكلاسيكي",
  },
];

export default function AdvancedThemesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [activeTheme, setActiveTheme] = useState("default_light");

  useEffect(() => {
    AsyncStorage.getItem("active_theme").then((v) => {
      if (v) setActiveTheme(v);
    });
  }, []);

  async function applyTheme(theme: AppTheme) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setActiveTheme(theme.id);
    await AsyncStorage.setItem("active_theme", theme.id);
    await AsyncStorage.setItem("theme_primary", theme.primary);
    // Note: Full theme switching requires app restart for native
    // For web preview it works immediately
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
          الثيمات والألوان
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.muted, fontFamily: "Cairo" }]}>
          اختر الثيم المناسب لك. يُطبَّق التغيير فوراً.
        </Text>

        <View style={styles.grid}>
          {THEMES.map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <Pressable
                key={theme.id}
                onPress={() => applyTheme(theme)}
                style={({ pressed }) => [
                  styles.themeCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isActive ? theme.primary : "transparent",
                    borderWidth: isActive ? 2.5 : 1.5,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                {/* Preview */}
                <View style={[styles.preview, { backgroundColor: theme.background }]}>
                  <View style={[styles.previewBar, { backgroundColor: theme.surface }]}>
                    <View style={[styles.previewDot, { backgroundColor: theme.primary }]} />
                    <View style={[styles.previewLine, { backgroundColor: theme.foreground + "44", width: "50%" }]} />
                  </View>
                  <View style={[styles.previewContent, { backgroundColor: theme.surface }]}>
                    <View style={[styles.previewLine, { backgroundColor: theme.primary, width: "70%" }]} />
                    <View style={[styles.previewLine, { backgroundColor: theme.foreground + "33", width: "90%" }]} />
                  </View>
                  <View style={[styles.previewBtn, { backgroundColor: theme.primary }]}>
                    <View style={[styles.previewBtnLine, { backgroundColor: "#fff" }]} />
                  </View>
                </View>

                {/* Info */}
                <View style={styles.themeInfo}>
                  <View style={styles.themeNameRow}>
                    <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                    <Text style={[styles.themeName, { color: theme.foreground, fontFamily: "Cairo-Bold" }]}>
                      {theme.name}
                    </Text>
                  </View>
                  <Text style={[styles.themeDesc, { color: theme.foreground + "88", fontFamily: "Cairo" }]}>
                    {theme.description}
                  </Text>
                </View>

                {isActive && (
                  <View style={[styles.activeBadge, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.activeBadgeText, { fontFamily: "Cairo-Bold" }]}>✓ مفعّل</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.note, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.noteIcon}>💡</Text>
          <Text style={[styles.noteText, { color: colors.muted, fontFamily: "Cairo" }]}>
            بعض الثيمات تحتاج إعادة تشغيل التطبيق لتطبيق التغييرات الكاملة على الأجهزة المحمولة.
          </Text>
        </View>
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
  subtitle: { fontSize: 13, fontFamily: "Cairo", textAlign: "right" },
  grid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 12 },
  themeCard: {
    width: "47%",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  preview: {
    height: 90,
    padding: 8,
    gap: 6,
  },
  previewBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    padding: 4,
    borderRadius: 4,
  },
  previewDot: { width: 8, height: 8, borderRadius: 4 },
  previewLine: { height: 4, borderRadius: 2 },
  previewContent: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    gap: 4,
    justifyContent: "center",
  },
  previewBtn: {
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  previewBtnLine: { width: "40%", height: 3, borderRadius: 2 },
  themeInfo: { padding: 10, gap: 3 },
  themeNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  themeEmoji: { fontSize: 16 },
  themeName: { fontSize: 13, fontFamily: "Cairo-Bold" },
  themeDesc: { fontSize: 10, fontFamily: "Cairo", textAlign: "right" },
  activeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeBadgeText: { fontSize: 10, color: "#fff", fontFamily: "Cairo-Bold" },
  note: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  noteIcon: { fontSize: 16 },
  noteText: { flex: 1, fontSize: 12, fontFamily: "Cairo", textAlign: "right", lineHeight: 20 },
});
