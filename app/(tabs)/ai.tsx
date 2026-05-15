/**
 * مساعد AI المتخصص — AI Health Assistant
 * 4 خبراء متخصصون: طبيب، صيدلاني، خبير تغذية، متخصص هرمونات
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
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
import { trpc } from "@/lib/trpc";
import {
  ACTIVITY_LABELS,
  CHRONIC_DISEASES,
  GOAL_LABELS,
  type HealthProfile,
  DEFAULT_PROFILE,
} from "@/assets/data/healthProfile";

I18nManager.forceRTL(true);

const SK_PROFILE = "@health_profile_v3";
const SK_SUPPS = "@my_supplements_v3";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  expert?: string;
  emoji?: string;
}

interface Expert {
  id: "doctor" | "pharmacist" | "nutritionist" | "hormones";
  name: string;
  emoji: string;
  color: string;
  desc: string;
}

const EXPERTS: Expert[] = [
  {
    id: "doctor",
    name: "الطبيب",
    emoji: "👨‍⚕️",
    color: "#f87171",
    desc: "تقييم طبي شامل وتوصيات مكملات",
  },
  {
    id: "pharmacist",
    name: "الصيدلاني",
    emoji: "💊",
    color: "#60a5fa",
    desc: "التفاعلات والجرعات والجدول الزمني",
  },
  {
    id: "nutritionist",
    name: "خبير التغذية",
    emoji: "🥗",
    color: "#34d399",
    desc: "خطة غذائية ورياضية مخصصة",
  },
  {
    id: "hormones",
    name: "متخصص الهرمونات",
    emoji: "💉",
    color: "#fbbf24",
    desc: "TRT / Peptides / SARMs",
  },
];

const QUICK_QUESTIONS = [
  "ما أفضل مكملات لصحة الكبد؟",
  "كيف أحسّن مستوى التستوستيرون طبيعياً؟",
  "ما التحاليل التي يجب أن أجريها؟",
  "ما أفضل وقت لأخذ المكملات؟",
  "هل يمكن دمج الكرياتين مع البروتين؟",
  "ما أعراض نقص فيتامين D؟",
];

export default function AIScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<"analyze" | "chat">("analyze");
  const [selectedExpert, setSelectedExpert] = useState<Expert>(EXPERTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Record<string, { analysis: string; loading: boolean }>>({});
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({ ...DEFAULT_PROFILE });
  const [mySupplements, setMySupplements] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const analyzeProfileMutation = trpc.ai.analyzeProfile.useMutation();
  const chatMutation = trpc.ai.chat.useMutation();

  // Load profile
  useEffect(() => {
    (async () => {
      try {
        const [profStr, suppStr] = await Promise.all([
          AsyncStorage.getItem(SK_PROFILE),
          AsyncStorage.getItem(SK_SUPPS),
        ]);
        if (profStr) setHealthProfile({ ...DEFAULT_PROFILE, ...JSON.parse(profStr) });
        if (suppStr) {
          const supps = JSON.parse(suppStr);
          setMySupplements(supps.map((s: { productName: string }) => s.productName));
        }
        setProfileLoaded(true);
      } catch {
        setProfileLoaded(true);
      }
    })();
  }, []);

  const buildProfileContext = useCallback(() => {
    return `
الاسم: ${healthProfile.name || "غير محدد"}
العمر: ${healthProfile.age || "غير محدد"} سنة
الوزن: ${healthProfile.weight || "غير محدد"} كغ
الطول: ${healthProfile.height || "غير محدد"} سم
الجنس: ${healthProfile.gender === "male" ? "ذكر" : "أنثى"}
مستوى النشاط: ${ACTIVITY_LABELS[healthProfile.activityLevel] || "غير محدد"}
الهدف: ${GOAL_LABELS[healthProfile.healthGoal] || "غير محدد"}
الأمراض المزمنة: ${healthProfile.chronicDiseases.map((id) => CHRONIC_DISEASES.find((d) => d.id === id)?.label || id).join("، ") || "لا يوجد"}
الحساسيات: ${healthProfile.allergies.join("، ") || "لا يوجد"}
الأدوية: ${healthProfile.medications.map((m) => `${m.name} ${m.dose}`).join("، ") || "لا يوجد"}
الهرمونات: ${healthProfile.hormones.map((h) => `${h.label} ${h.dose}${h.unit}`).join("، ") || "لا يوجد"}
المكملات الحالية: ${mySupplements.join("، ") || "لا يوجد"}
    `.trim();
  }, [healthProfile, mySupplements]);

  const analyzeWithExpert = async (expert: Expert) => {
    setAnalysisResults((prev) => ({
      ...prev,
      [expert.id]: { analysis: "", loading: true },
    }));

    try {
      const result = await analyzeProfileMutation.mutateAsync({
        expertType: expert.id,
        profile: {
          name: healthProfile.name,
          age: healthProfile.age,
          weight: healthProfile.weight,
          height: healthProfile.height,
          gender: healthProfile.gender,
          activityLevel: healthProfile.activityLevel,
          healthGoal: healthProfile.healthGoal,
          chronicDiseases: healthProfile.chronicDiseases,
          allergies: healthProfile.allergies,
          injuries: healthProfile.injuries,
          medications: healthProfile.medications,
          hormones: healthProfile.hormones.map((h) => ({
            label: h.label,
            dose: h.dose,
            unit: h.unit,
            frequency: h.frequency,
            company: h.company,
          })),
          supplements: mySupplements,
        },
      });

      setAnalysisResults((prev) => ({
        ...prev,
        [expert.id]: { analysis: String(result.analysis ?? ""), loading: false },
      }));
    } catch (err) {
      setAnalysisResults((prev) => ({
        ...prev,
        [expert.id]: {
          analysis: "حدث خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.",
          loading: false,
        },
      }));
    }
  };

  const analyzeAll = async () => {
    for (const expert of EXPERTS) {
      analyzeWithExpert(expert);
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: messageText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const result = await chatMutation.mutateAsync({
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        profileContext: buildProfileContext(),
        expertType: selectedExpert.id,
      });

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: String(result.content ?? ""),
        expert: selectedExpert.name,
        emoji: selectedExpert.emoji,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذراً، حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت.",
          expert: selectedExpert.name,
          emoji: "⚠️",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const profileComplete =
    healthProfile.name && healthProfile.age && healthProfile.weight;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>مساعد AI الصحي</Text>
            <Text style={[styles.headerSub, { color: colors.muted }]}>4 خبراء متخصصون</Text>
          </View>
          <View style={[styles.aiBadge, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.aiBadgeText, { color: colors.primary }]}>AI</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
          {[
            { id: "analyze" as const, label: "تحليل الملف الصحي", icon: "chart.bar.fill" as const },
            { id: "chat" as const, label: "محادثة مع خبير", icon: "bubble.left.fill" as const },
          ].map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.mainTab,
                activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <IconSymbol
                name={tab.icon}
                size={16}
                color={activeTab === tab.id ? colors.primary : colors.muted}
              />
              <Text
                style={[
                  styles.mainTabText,
                  { color: activeTab === tab.id ? colors.primary : colors.muted },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ══ ANALYZE TAB ══ */}
      {activeTab === "analyze" && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {/* Profile Status */}
          {!profileComplete ? (
            <View
              style={[
                styles.warningBox,
                { backgroundColor: colors.warning + "15", borderColor: colors.warning + "50" },
              ]}
            >
              <IconSymbol name="exclamationmark.triangle.fill" size={18} color={colors.warning} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.warningTitle, { color: colors.warning }]}>
                  الملف الصحي غير مكتمل
                </Text>
                <Text style={[styles.warningText, { color: colors.foreground }]}>
                  أكمل ملفك الصحي في تبويب "ملفي" للحصول على تحليل أدق وتوصيات مخصصة.
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.profileCard,
                { backgroundColor: colors.success + "12", borderColor: colors.success + "40" },
              ]}
            >
              <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
              <Text style={[styles.profileCardText, { color: colors.foreground }]}>
                الملف الصحي: {healthProfile.name} · {healthProfile.age} سنة · {healthProfile.weight} كغ
              </Text>
            </View>
          )}

          {/* Analyze All Button */}
          <Pressable
            style={[styles.analyzeAllBtn, { backgroundColor: colors.primary }]}
            onPress={analyzeAll}
          >
            <IconSymbol name="sparkles" size={18} color="#fff" />
            <Text style={styles.analyzeAllText}>تحليل شامل بجميع الخبراء</Text>
          </Pressable>

          {/* Expert Cards */}
          {EXPERTS.map((expert) => {
            const result = analysisResults[expert.id];
            return (
              <View
                key={expert.id}
                style={[
                  styles.expertCard,
                  { backgroundColor: colors.card, borderColor: expert.color + "40" },
                ]}
              >
                {/* Expert Header */}
                <View style={styles.expertCardHeader}>
                  <View style={styles.expertInfo}>
                    <View
                      style={[styles.expertEmoji, { backgroundColor: expert.color + "20" }]}
                    >
                      <Text style={styles.expertEmojiText}>{expert.emoji}</Text>
                    </View>
                    <View>
                      <Text style={[styles.expertName, { color: colors.foreground }]}>
                        {expert.name}
                      </Text>
                      <Text style={[styles.expertDesc, { color: colors.muted }]}>
                        {expert.desc}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={[styles.analyzeBtn, { backgroundColor: expert.color + "20", borderColor: expert.color + "50" }]}
                    onPress={() => analyzeWithExpert(expert)}
                  >
                    {result?.loading ? (
                      <ActivityIndicator size="small" color={expert.color} />
                    ) : (
                      <>
                        <IconSymbol name="sparkles" size={14} color={expert.color} />
                        <Text style={[styles.analyzeBtnText, { color: expert.color }]}>
                          {result?.analysis ? "إعادة" : "تحليل"}
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>

                {/* Analysis Result */}
                {result?.loading && (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator color={expert.color} />
                    <Text style={[styles.loadingText, { color: colors.muted }]}>
                      يحلّل {expert.name} ملفك الصحي...
                    </Text>
                  </View>
                )}
                {result?.analysis && !result.loading && (
                  <View
                    style={[styles.analysisBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <Text style={[styles.analysisText, { color: colors.foreground }]}>
                      {result.analysis}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ══ CHAT TAB ══ */}
      {activeTab === "chat" && (
        <View style={{ flex: 1 }}>
          {/* Expert Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.expertSelector, { borderBottomColor: colors.border }]}
          >
            {EXPERTS.map((expert) => (
              <Pressable
                key={expert.id}
                style={[
                  styles.expertChip,
                  {
                    backgroundColor:
                      selectedExpert.id === expert.id
                        ? expert.color + "25"
                        : colors.card,
                    borderColor:
                      selectedExpert.id === expert.id ? expert.color : colors.border,
                  },
                ]}
                onPress={() => setSelectedExpert(expert)}
              >
                <Text style={styles.expertChipEmoji}>{expert.emoji}</Text>
                <Text
                  style={[
                    styles.expertChipName,
                    {
                      color:
                        selectedExpert.id === expert.id ? expert.color : colors.muted,
                    },
                  ]}
                >
                  {expert.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 8 }}
            ListEmptyComponent={() => (
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatEmoji}>{selectedExpert.emoji}</Text>
                <Text style={[styles.emptyChatTitle, { color: colors.foreground }]}>
                  {selectedExpert.name}
                </Text>
                <Text style={[styles.emptyChatDesc, { color: colors.muted }]}>
                  {selectedExpert.desc}
                </Text>
                <Text style={[styles.emptyChatHint, { color: colors.muted }]}>
                  اسألني أي سؤال متعلق بصحتك ومكملاتك
                </Text>
                {/* Quick Questions */}
                <View style={styles.quickQGrid}>
                  {QUICK_QUESTIONS.map((q, i) => (
                    <Pressable
                      key={i}
                      style={[
                        styles.quickQBtn,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => sendMessage(q)}
                    >
                      <Text style={[styles.quickQText, { color: colors.foreground }]}>
                        {q}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageRow,
                  item.role === "user" ? styles.userRow : styles.assistantRow,
                ]}
              >
                {item.role === "assistant" && (
                  <View
                    style={[
                      styles.msgAvatar,
                      { backgroundColor: selectedExpert.color + "25" },
                    ]}
                  >
                    <Text style={styles.msgAvatarText}>{item.emoji || selectedExpert.emoji}</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    item.role === "user"
                      ? [styles.userBubble, { backgroundColor: colors.primary }]
                      : [
                          styles.assistantBubble,
                          { backgroundColor: colors.card, borderColor: colors.border },
                        ],
                  ]}
                >
                  {item.role === "assistant" && item.expert && (
                    <Text
                      style={[styles.expertLabel, { color: selectedExpert.color }]}
                    >
                      {item.expert}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      { color: item.role === "user" ? "#fff" : colors.foreground },
                    ]}
                  >
                    {item.content}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View style={[styles.typingRow, { paddingHorizontal: 16 }]}>
              <View
                style={[styles.msgAvatar, { backgroundColor: selectedExpert.color + "25" }]}
              >
                <Text style={styles.msgAvatarText}>{selectedExpert.emoji}</Text>
              </View>
              <View
                style={[
                  styles.typingBubble,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <ActivityIndicator size="small" color={selectedExpert.color} />
                <Text style={[styles.typingText, { color: colors.muted }]}>
                  يكتب...
                </Text>
              </View>
            </View>
          )}

          {/* Input */}
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                paddingBottom: insets.bottom + 8,
              },
            ]}
          >
            <Pressable
              style={[
                styles.sendBtn,
                {
                  backgroundColor:
                    inputText.trim() ? selectedExpert.color : colors.border,
                },
              ]}
              onPress={() => sendMessage()}
              disabled={!inputText.trim() || isLoading}
            >
              <IconSymbol name="paperplane.fill" size={18} color="#fff" />
            </Pressable>
            <TextInput
              style={[
                styles.chatInput,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder={`اسأل ${selectedExpert.name}...`}
              placeholderTextColor={colors.muted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlign="right"
              returnKeyType="send"
              onSubmitEditing={() => sendMessage()}
            />
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
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
  headerTitle: { fontSize: 22, fontWeight: "900", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right" },
  aiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  aiBadgeText: { fontSize: 13, fontWeight: "900" },

  // Main Tabs
  tabRow: {
    flexDirection: "row-reverse",
    borderBottomWidth: 0.5,
  },
  mainTab: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  mainTabText: { fontSize: 13, fontWeight: "700" },

  // Warning / Profile Card
  warningBox: {
    flexDirection: "row-reverse",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    alignItems: "flex-start",
  },
  warningTitle: { fontSize: 13, fontWeight: "800", marginBottom: 4, textAlign: "right" },
  warningText: { fontSize: 12, lineHeight: 18, textAlign: "right" },
  profileCard: {
    flexDirection: "row-reverse",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    alignItems: "center",
  },
  profileCardText: { fontSize: 13, fontWeight: "600", flex: 1, textAlign: "right" },

  // Analyze All Button
  analyzeAllBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  analyzeAllText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  // Expert Card
  expertCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  expertCardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expertInfo: { flexDirection: "row-reverse", alignItems: "center", gap: 10, flex: 1 },
  expertEmoji: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  expertEmojiText: { fontSize: 22 },
  expertName: { fontSize: 15, fontWeight: "800", textAlign: "right" },
  expertDesc: { fontSize: 11, textAlign: "right", marginTop: 2 },
  analyzeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  analyzeBtnText: { fontSize: 12, fontWeight: "700" },
  loadingBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    padding: 12,
  },
  loadingText: { fontSize: 13 },
  analysisBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  analysisText: { fontSize: 13, lineHeight: 22, textAlign: "right" },

  // Expert Selector (Chat)
  expertSelector: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 0.5,
  },
  expertChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  expertChipEmoji: { fontSize: 16 },
  expertChipName: { fontSize: 12, fontWeight: "700" },

  // Chat
  emptyChat: { alignItems: "center", paddingTop: 32, gap: 8 },
  emptyChatEmoji: { fontSize: 56 },
  emptyChatTitle: { fontSize: 20, fontWeight: "900" },
  emptyChatDesc: { fontSize: 13, textAlign: "center" },
  emptyChatHint: { fontSize: 12, textAlign: "center", marginTop: 4 },
  quickQGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  quickQBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickQText: { fontSize: 12, fontWeight: "600", textAlign: "right" },

  // Messages
  messageRow: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  userRow: { flexDirection: "row-reverse" },
  assistantRow: { flexDirection: "row" },
  msgAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  msgAvatarText: { fontSize: 18 },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    gap: 4,
  },
  userBubble: { borderBottomRightRadius: 4 },
  assistantBubble: { borderWidth: 1, borderBottomLeftRadius: 4 },
  expertLabel: { fontSize: 11, fontWeight: "800", textAlign: "right" },
  messageText: { fontSize: 13, lineHeight: 20, textAlign: "right" },

  // Typing
  typingRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  typingText: { fontSize: 12 },

  // Input
  inputRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 0.5,
  },
  chatInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
