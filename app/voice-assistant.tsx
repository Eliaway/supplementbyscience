import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { trpc } from "@/lib/trpc";
import { useAudioRecorder, AudioModule, RecordingPresets } from "expo-audio";
import * as Haptics from "expo-haptics";

I18nManager.forceRTL(true);

type Message = { role: "user" | "assistant"; content: string };
type RecordingState = "idle" | "recording" | "processing" | "speaking";

export default function VoiceAssistantScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [statusText, setStatusText] = useState("اضغط للتحدث");
  const [profileContext, setProfileContext] = useState("");

  const transcribeMutation = trpc.voice.transcribe.useMutation();
  const chatMutation = trpc.ai.chat.useMutation();
  const uploadMutation = trpc.storage.uploadBase64.useMutation();

  useEffect(() => {
    loadProfile();
    // Welcome message
    setMessages([
      {
        role: "assistant",
        content: "مرحباً! أنا مساعدك الصوتي الذكي. اضغط على الزر واسألني عن أي مكمل غذائي أو استفسار صحي.",
      },
    ]);
  }, []);

  async function loadProfile() {
    try {
      const [profileStr, suppsStr] = await Promise.all([
        AsyncStorage.getItem("health_profile"),
        AsyncStorage.getItem("my_supplements"),
      ]);
      const parts: string[] = [];
      if (profileStr) parts.push(`الملف الصحي: ${profileStr}`);
      if (suppsStr) parts.push(`مكملاتي: ${suppsStr}`);
      setProfileContext(parts.join("\n"));
    } catch {}
  }

  async function startRecording() {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        setStatusText("لم يتم منح إذن الميكروفون");
        return;
      }
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setRecordingState("recording");
      setStatusText("جاري التسجيل... اضغط للإيقاف");
    } catch (e) {
      setStatusText("خطأ في بدء التسجيل");
    }
  }

  async function stopRecording() {
    if (recordingState !== "recording") return;
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setRecordingState("processing");
      setStatusText("جاري معالجة صوتك...");
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (!uri) {
        setStatusText("لم يتم التسجيل بشكل صحيح");
        setRecordingState("idle");
        return;
      }

      // Read audio file as base64
      const FileSystem = await import("expo-file-system/legacy");
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload to storage
      const uploadResult = await uploadMutation.mutateAsync({
        base64,
        mimeType: "audio/m4a",
        filename: `voice_${Date.now()}.m4a`,
      });

      // Transcribe
      const transcribeResult = await transcribeMutation.mutateAsync({
        audioUrl: uploadResult.url,
        language: "ar",
        prompt: "تفريغ صوتي باللغة العربية عن المكملات الغذائية والصحة",
      });

      const userText = transcribeResult.text?.trim();
      if (!userText) {
        setStatusText("لم أفهم ما قلته، حاول مرة أخرى");
        setRecordingState("idle");
        return;
      }

      // Add user message
      const newMessages: Message[] = [...messages, { role: "user", content: userText }];
      setMessages(newMessages);
      setStatusText("جاري التفكير...");

      // Get AI response
      const aiResponse = await chatMutation.mutateAsync({
        messages: newMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        profileContext,
        expertType: "general",
      });

      const assistantText = aiResponse.content as string;
      setMessages([...newMessages, { role: "assistant", content: assistantText }]);
      setStatusText("اضغط للتحدث");
      setRecordingState("idle");

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      setStatusText("حدث خطأ، حاول مرة أخرى");
      setRecordingState("idle");
    }
  }

  function handleMicPress() {
    if (recordingState === "idle") {
      startRecording();
    } else if (recordingState === "recording") {
      stopRecording();
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRecorder) {
        try { audioRecorder.stop(); } catch {}
      }
    };
  }, []);

  const micBgColor =
    recordingState === "recording" ? "#ef4444" :
    recordingState === "processing" ? colors.border :
    colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Cairo-Black" }]}>
          المساعد الصوتي
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              msg.role === "user"
                ? [styles.userBubble, { backgroundColor: colors.primary }]
                : [styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }],
            ]}
          >
            {msg.role === "assistant" && (
              <Text style={styles.aiIcon}>🤖</Text>
            )}
            <Text
              style={[
                styles.bubbleText,
                {
                  color: msg.role === "user" ? "#fff" : colors.foreground,
                  fontFamily: "Cairo",
                },
              ]}
            >
              {msg.content}
            </Text>
          </View>
        ))}
        {recordingState === "processing" && (
          <View style={[styles.aiBubble, styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.bubbleText, { color: colors.muted, fontFamily: "Cairo" }]}>
              جاري المعالجة...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Voice control */}
      <View style={[styles.voiceControl, { paddingBottom: insets.bottom + 16, backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Text style={[styles.statusText, { color: colors.muted, fontFamily: "Cairo" }]}>
          {statusText}
        </Text>

        <Pressable
          onPress={handleMicPress}
          disabled={recordingState === "processing"}
          style={({ pressed }) => [
            styles.micBtn,
            {
              backgroundColor: micBgColor,
              opacity: pressed || recordingState === "processing" ? 0.7 : 1,
              transform: [{ scale: recordingState === "recording" ? 1.1 : 1 }],
            },
          ]}
        >
          {recordingState === "processing" ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.micIcon}>
              {recordingState === "recording" ? "⏹" : "🎤"}
            </Text>
          )}
        </Pressable>

        {recordingState === "recording" && (
          <View style={styles.waveContainer}>
            {[1, 2, 3, 4, 5].map((n) => (
              <View
                key={n}
                style={[styles.wave, { backgroundColor: colors.primary, height: 8 + n * 4 }]}
              />
            ))}
          </View>
        )}

        <Text style={[styles.hintText, { color: colors.muted, fontFamily: "Cairo" }]}>
          {recordingState === "recording" ? "اضغط للإيقاف وإرسال" : "اضغط مطولاً للتحدث"}
        </Text>
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
  messages: { padding: 16, gap: 12, paddingBottom: 20 },
  bubble: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 16,
    gap: 6,
  },
  userBubble: { alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  aiBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
    borderWidth: 1,
    flexDirection: "row-reverse",
    gap: 8,
    alignItems: "flex-start",
  },
  aiIcon: { fontSize: 18 },
  bubbleText: { fontSize: 14, fontFamily: "Cairo", lineHeight: 22, flex: 1, textAlign: "right" },
  voiceControl: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  statusText: { fontSize: 13, fontFamily: "Cairo" },
  micBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micIcon: { fontSize: 36 },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 30,
  },
  wave: { width: 4, borderRadius: 2 },
  hintText: { fontSize: 11, fontFamily: "Cairo" },
});
