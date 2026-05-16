import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

I18nManager.forceRTL(true);

const SEASONS: Record<number, string> = {
  0: "الشتاء", 1: "الشتاء", 2: "الربيع",
  3: "الربيع", 4: "الربيع", 5: "الصيف",
  6: "الصيف", 7: "الصيف", 8: "الخريف",
  9: "الخريف", 10: "الخريف", 11: "الشتاء",
};

const TIME_OF_DAY = () => {
  const h = new Date().getHours();
  if (h < 6) return "منتصف الليل";
  if (h < 12) return "الصباح";
  if (h < 17) return "الظهيرة";
  if (h < 21) return "المساء";
  return "الليل";
};

interface DailyTip {
  title: string;
  content: string;
  category: string;
  emoji: string;
  priority: "عالية" | "متوسطة" | "منخفضة";
}

const FALLBACK_TIPS: DailyTip[] = [
  {
    title: "فيتامين د والشمس",
    content: "التعرض لأشعة الشمس الصباحية لـ 15-20 دقيقة يُنتج ما يكفي من فيتامين د لمعظم الناس. إذا كنت تعيش في منطقة قليلة الشمس، فكّر في مكمل 2000-4000 وحدة يومياً.",
    category: "فيتامينات",
    emoji: "☀️",
    priority: "عالية",
  },
  {
    title: "المغنيسيوم قبل النوم",
    content: "تناول 200-400 ملغ من المغنيسيوم (غليسينات أو مالات) قبل النوم بساعة يُحسّن جودة النوم ويُقلل التوتر العضلي.",
    category: "نوم",
    emoji: "😴",
    priority: "متوسطة",
  },
  {
    title: "أوميغا-3 مع الوجبة الدسمة",
    content: "تناول كبسولات أوميغا-3 مع أكبر وجبة دسمة في اليوم لزيادة امتصاصها بنسبة تصل إلى 50% مقارنة بتناولها على معدة فارغة.",
    category: "امتصاص",
    emoji: "🐟",
    priority: "عالية",
  },
  {
    title: "الزنك والنحاس",
    content: "إذا كنت تتناول الزنك يومياً، تأكد من إضافة 1-2 ملغ من النحاس لمنع نقصه، إذ يتنافسان على الامتصاص في الأمعاء.",
    category: "تفاعلات",
    emoji: "⚖️",
    priority: "عالية",
  },
  {
    title: "الكرياتين والماء",
    content: "عند تناول الكرياتين، اشرب على الأقل 3 لترات من الماء يومياً لتجنب الجفاف وتحقيق أقصى استفادة من المكمل.",
    category: "رياضة",
    emoji: "💧",
    priority: "متوسطة",
  },
];

export default function DailyTipsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [tips, setTips] = useState<DailyTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastGenDate, setLastGenDate] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);

  const chatMutation = trpc.ai.chat.useMutation();

  useEffect(() => {
    loadTips();
  }, []);

  async function loadTips() {
    try {
      const today = new Date().toDateString();
      const [cachedDate, cachedTips, profileStr] = await Promise.all([
        AsyncStorage.getItem("daily_tips_date"),
        AsyncStorage.getItem("daily_tips_cache"),
        AsyncStorage.getItem("health_profile"),
      ]);

      if (profileStr) setProfile(JSON.parse(profileStr));
      setLastGenDate(today);

      // Use cached tips if generated today
      if (cachedDate === today && cachedTips) {
        setTips(JSON.parse(cachedTips));
        setLoading(false);
        return;
      }

      // Generate new tips
      await generateTips(profileStr);
    } catch {
      setTips(FALLBACK_TIPS);
      setLoading(false);
    }
  }

  async function generateTips(profileStr: string | null) {
    try {
      const season = SEASONS[new Date().getMonth()];
      const timeOfDay = TIME_OF_DAY();
      const profileContext = profileStr
        ? `ملف المستخدم: ${profileStr}`
        : "لا يوجد ملف صحي محدد";

      const response = await chatMutation.mutateAsync({
        messages: [
          {
            role: "user",
            content: `أنشئ 5 توصيات صحية يومية مخصصة لهذا المستخدم.
الموسم الحالي: ${season}
وقت اليوم: ${timeOfDay}
${profileContext}

أجب بصيغة JSON مصفوفة من 5 عناصر، كل عنصر يحتوي على:
- title: عنوان قصير (أقل من 30 حرف)
- content: شرح تفصيلي (50-100 كلمة)
- category: الفئة (فيتامينات/معادن/رياضة/نوم/تغذية/امتصاص/تفاعلات)
- emoji: رمز تعبيري واحد مناسب
- priority: (عالية/متوسطة/منخفضة)

أجب بـ JSON فقط بدون أي نص إضافي.`,
          },
        ],
        expertType: "nutritionist",
      });

      const raw = response.content as string;
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as DailyTip[];
        setTips(parsed);
        await AsyncStorage.setItem("daily_tips_cache", JSON.stringify(parsed));
        await AsyncStorage.setItem("daily_tips_date", new Date().toDateString());
      } else {
        setTips(FALLBACK_TIPS);
      }
    } catch {
      setTips(FALLBACK_TIPS);
    } finally {
      setLoading(false);
    }
  }

  async function refreshTips() {
    setLoading(true);
    await AsyncStorage.removeItem("daily_tips_date");
    const profileStr = await AsyncStorage.getItem("health_profile");
    await generateTips(profileStr);
  }

  const priorityColor = { عالية: "#ef4444", متوسطة: "#f59e0b", منخفضة: "#10b981" };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
            توصياتك اليومية
          </Text>
          <Text style={[styles.headerSub, { color: colors.muted, fontFamily: "Cairo" }]}>
            {new Date().toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" })}
          </Text>
        </View>
        <Pressable
          onPress={refreshTips}
          style={({ pressed }) => [styles.refreshBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={{ fontSize: 20 }}>🔄</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.muted, fontFamily: "Cairo" }]}>
            جاري تخصيص توصياتك...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <View style={[styles.banner, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "33" }]}>
            <Text style={styles.bannerEmoji}>🌟</Text>
            <View style={styles.bannerText}>
              <Text style={[styles.bannerTitle, { color: colors.primary, fontFamily: "Cairo-Bold" }]}>
                توصيات مخصصة لك
              </Text>
              <Text style={[styles.bannerSub, { color: colors.muted, fontFamily: "Cairo" }]}>
                بناءً على ملفك الصحي وموسم {SEASONS[new Date().getMonth()]}
              </Text>
            </View>
          </View>

          {/* Tips */}
          {tips.map((tip, i) => (
            <View
              key={i}
              style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipLeft}>
                  <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                  <View>
                    <Text style={[styles.tipTitle, { color: colors.foreground, fontFamily: "Cairo-Bold" }]}>
                      {tip.title}
                    </Text>
                    <Text style={[styles.tipCategory, { color: colors.muted, fontFamily: "Cairo" }]}>
                      {tip.category}
                    </Text>
                  </View>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColor[tip.priority] + "22" }]}>
                  <Text style={[styles.priorityText, { color: priorityColor[tip.priority], fontFamily: "Cairo-Bold" }]}>
                    {tip.priority}
                  </Text>
                </View>
              </View>
              <Text style={[styles.tipContent, { color: colors.foreground, fontFamily: "Cairo" }]}>
                {tip.content}
              </Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.muted, fontFamily: "Cairo" }]}>
              تُحدَّث التوصيات يومياً بناءً على ملفك الصحي
            </Text>
          </View>
        </ScrollView>
      )}
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
    gap: 12,
  },
  backBtn: { padding: 8 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Cairo-Black" },
  headerSub: { fontSize: 12, fontFamily: "Cairo" },
  refreshBtn: { padding: 8 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  loadingText: { fontSize: 14, fontFamily: "Cairo" },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  banner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  bannerEmoji: { fontSize: 32 },
  bannerText: { flex: 1, alignItems: "flex-end" },
  bannerTitle: { fontSize: 15, fontFamily: "Cairo-Bold" },
  bannerSub: { fontSize: 12, fontFamily: "Cairo" },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  tipHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tipLeft: { flexDirection: "row-reverse", alignItems: "center", gap: 10, flex: 1 },
  tipEmoji: { fontSize: 28 },
  tipTitle: { fontSize: 14, fontFamily: "Cairo-Bold" },
  tipCategory: { fontSize: 11, fontFamily: "Cairo" },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 11, fontFamily: "Cairo-Bold" },
  tipContent: { fontSize: 13, fontFamily: "Cairo", lineHeight: 22, textAlign: "right" },
  footer: { alignItems: "center", paddingTop: 8 },
  footerText: { fontSize: 12, fontFamily: "Cairo", textAlign: "center" },
});
