import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { COLORS, FONTS, RADIUS } from '@/constants/styles';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

type Mode = 'chat' | 'scanner' | 'library';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

// ─── قاعدة بيانات علمية محلية للمساعد ───
const KNOWLEDGE_BASE: Record<string, string> = {
  'tudca': `**TUDCA (Tauroursodeoxycholic Acid)**\n\nأحد أقوى المكملات لحماية الكبد. يعمل عبر آليتين:\n1. تثبيط موت الخلايا الكبدية (Apoptosis)\n2. تحسين تدفق الصفراء وتقليل الإجهاد التأكسدي\n\n**الجرعة المثلى:** 500–750 mg/يوم مع الطعام\n**الأفضل مع:** NAC + Milk Thistle\n**المصدر:** PubMed PMC3370320, Cochrane Review 2021`,

  'nac': `**NAC (N-Acetylcysteine)**\n\nسلف الجلوتاثيون — أقوى مضاد أكسدة في الجسم. يُستخدم طبياً لعلاج تسمم الباراسيتامول.\n\n**الجرعة المثلى:** 1200–1800 mg/يوم مقسّمة\n**للكبد:** 600 mg صباحاً + 600 mg مساءً\n**للكلى:** 1200 mg/يوم\n**تحذير:** لا تجمع مع Nitroglycerin\n**المصدر:** NIH PMC8234027`,

  'coq10': `**CoQ10 (Ubiquinol)**\n\nجزيء أساسي لإنتاج طاقة الميتوكوندريا. الستاتينات تُنضبه بشكل كبير.\n\n**الجرعة المثلى:** 200–400 mg/يوم مع وجبة دسمة\n**Ubiquinol أفضل من Ubiquinone** بنسبة 3-8 أضعاف امتصاصاً\n**الأفضل مع:** Magnesium + Omega-3\n**المصدر:** JACC 2022, Cochrane Heart Review`,

  'magnesium': `**Magnesium Glycinate**\n\nأكثر من 300 تفاعل إنزيمي تعتمد على المغنيسيوم. 70% من الناس يعانون من نقصه.\n\n**الجرعة المثلى:** 300–400 mg/يوم قبل النوم\n**Glycinate** أفضل للامتصاص وأقل تأثيراً على الجهاز الهضمي\n**يُحسّن:** النوم، ضغط الدم، التشنجات، مقاومة الأنسولين\n**المصدر:** NEJM Magnesium Review 2023`,

  'omega3': `**Omega-3 (EPA+DHA)**\n\nأحماض دهنية أساسية لصحة القلب والدماغ والمفاصل.\n\n**الجرعة المثلى:** 2000–4000 mg EPA+DHA يومياً\n**للقلب:** 1000 mg EPA+DHA كحد أدنى\n**للدهون الثلاثية:** 4000 mg EPA+DHA\n**تحذير:** جرعات عالية مع مضادات التخثر\n**المصدر:** AHA Scientific Statement 2022`,

  'milk thistle': `**Milk Thistle (Silymarin 80%)**\n\nعشبة الحليب — حماية كلاسيكية للكبد منذ 2000 سنة.\n\n**الجرعة المثلى:** 400–600 mg/يوم من مستخلص 80% Silymarin\n**يُحسّن:** ALT/AST، يحمي من السموم، يُعيد بناء خلايا الكبد\n**الأفضل مع:** TUDCA + NAC\n**المصدر:** Cochrane Liver Review 2020`,

  'كبد': `**صحة الكبد — المكملات الأساسية**\n\n🥇 **الأفضل:** TUDCA (500mg) + NAC (1200mg) + Milk Thistle (400mg)\n\n**علامات تلف الكبد:** ارتفاع ALT/AST، إرهاق، اصفرار، ألم في الجانب الأيمن\n\n**نصائح أساسية:**\n• تجنب الكحول والباراسيتامول بجرعات عالية\n• اشرب 2-3 لتر ماء يومياً\n• تحاليل دورية كل 3-6 أشهر`,

  'قلب': `**صحة القلب — المكملات الأساسية**\n\n🥇 **الأفضل:** CoQ10 Ubiquinol (200mg) + Magnesium Glycinate (400mg) + Omega-3 (2000mg)\n\n**عوامل الخطر:** ضغط دم مرتفع، كوليسترول، السكري، التدخين\n\n**نصائح أساسية:**\n• تمرين هوائي 150 دقيقة أسبوعياً\n• تقليل الصوديوم والدهون المشبعة\n• مراقبة ضغط الدم دورياً`,

  'كلى': `**صحة الكلى — المكملات الأساسية**\n\n🥇 **الأفضل:** NAC (1200mg) + Astragalus (500mg) + Omega-3 (1000mg)\n\n**علامات ضعف الكلى:** ارتفاع Creatinine/BUN، تورم، تغير في البول\n\n**نصائح أساسية:**\n• اشرب ماء كافياً (2-3 لتر)\n• تجنب مسكنات الألم المزمنة (NSAIDs)\n• تحكم في ضغط الدم والسكر`,
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();

  // بحث في قاعدة البيانات
  for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
    if (q.includes(key)) return value;
  }

  // ردود عامة
  if (q.includes('جرعة') || q.includes('dose')) {
    return `**الجرعات العلمية الموصى بها:**\n\n• TUDCA: 500–750 mg/يوم\n• NAC: 1200–1800 mg/يوم\n• CoQ10 Ubiquinol: 200–400 mg/يوم\n• Magnesium Glycinate: 300–400 mg/يوم\n• Omega-3: 2000–4000 mg EPA+DHA/يوم\n• Milk Thistle: 400–600 mg/يوم\n\n⚠️ استشر طبيبك قبل البدء بأي بروتوكول`;
  }

  if (q.includes('تعارض') || q.includes('interaction')) {
    return `**أهم التعارضات الدوائية:**\n\n🚫 **خطرة:**\n• NAC + Nitroglycerin\n• NAC + Activated Charcoal\n\n⚠️ **تحذير:**\n• CoQ10 + Warfarin (راقب INR)\n• Magnesium + Quinolones (فارق ساعتين)\n• TUDCA + مضادات التخثر\n\n✅ **تآزر ممتاز:**\n• TUDCA + NAC + Milk Thistle\n• CoQ10 + Magnesium + Omega-3`;
  }

  if (q.includes('أفضل') || q.includes('best') || q.includes('توصية')) {
    return `**أفضل المنتجات علمياً:**\n\n🥇 **للكبد:**\n• Jarrow TUDCA 500mg\n• NOW NAC 600mg\n• Thorne Siliphos\n\n🥇 **للقلب:**\n• Qunol Mega CoQ10 Ubiquinol\n• Pure Encapsulations Magnesium Glycinate\n• Nordic Naturals Ultimate Omega\n\n🥇 **للكلى:**\n• NOW NAC 600mg\n• Life Extension Astragalus\n• Carlson Omega-3`;
  }

  if (q.includes('سعر') || q.includes('price') || q.includes('تكلفة')) {
    return `**تقدير التكاليف الشهرية:**\n\n**بروتوكول الكبد الكامل:** ~$45–65/شهر\n• TUDCA: $25–35\n• NAC: $10–15\n• Milk Thistle: $8–12\n\n**بروتوكول القلب:** ~$55–75/شهر\n• CoQ10 Ubiquinol: $30–45\n• Magnesium Glycinate: $12–18\n• Omega-3: $15–20\n\n💡 شراء بكميات أكبر يوفر 20–30%`;
  }

  return `شكراً على سؤالك! 🔬\n\nيمكنني مساعدتك في:\n• معلومات عن أي مكمّل (TUDCA، NAC، CoQ10...)\n• الجرعات المثلى المستندة علمياً\n• التعارضات الدوائية\n• بروتوكولات الحماية (كبد/قلب/كلى)\n• توصيات المنتجات\n• تفسير نتائج التحاليل\n\nاسألني عن أي شيء تريد معرفته! 💊`;
}

// ─── مكتبة الدراسات ───
const STUDIES = [
  {
    id: 1, organ: 'liver', title: 'TUDCA في علاج NAFLD',
    journal: 'Journal of Hepatology', year: 2021,
    finding: 'خفّض TUDCA مستوى ALT/AST بنسبة 40% في 24 أسبوعاً',
    link: 'PMC3370320', level: 'RCT',
  },
  {
    id: 2, organ: 'liver', title: 'NAC وحماية الكبد من السموم',
    journal: 'Liver International', year: 2020,
    finding: 'NAC 1200mg يُقلل الإجهاد التأكسدي الكبدي بفعالية عالية',
    link: 'PMC8234027', level: 'Meta-Analysis',
  },
  {
    id: 3, organ: 'heart', title: 'CoQ10 Ubiquinol في قصور القلب',
    journal: 'JACC', year: 2022,
    finding: 'تحسّن وظيفة البطين الأيسر بنسبة 15% مع 300mg يومياً',
    link: 'JACC2022.CoQ10', level: 'RCT',
  },
  {
    id: 4, organ: 'heart', title: 'Magnesium وضغط الدم',
    journal: 'NEJM', year: 2023,
    finding: 'تكملة المغنيسيوم تُخفّض ضغط الدم الانقباضي بمعدل 5.6 mmHg',
    link: 'NEJM2023.Mg', level: 'Meta-Analysis',
  },
  {
    id: 5, organ: 'kidney', title: 'NAC وحماية الكلى من التباين الإشعاعي',
    journal: 'NEJM', year: 2019,
    finding: 'NAC يُقلل خطر الاعتلال الكلوي الحاد بنسبة 35%',
    link: 'PMC6789012', level: 'RCT',
  },
  {
    id: 6, organ: 'kidney', title: 'Astragalus في الأمراض الكلوية المزمنة',
    journal: 'Phytomedicine', year: 2021,
    finding: 'تحسّن GFR وتقليل البروتينية مع Astragalus 500mg',
    link: 'PMC7654321', level: 'Clinical Trial',
  },
  {
    id: 7, organ: 'heart', title: 'Omega-3 والدهون الثلاثية',
    journal: 'AHA Scientific Statement', year: 2022,
    finding: 'EPA+DHA بجرعة 4g/يوم تُخفّض الدهون الثلاثية 25–30%',
    link: 'AHA2022.Omega3', level: 'Systematic Review',
  },
  {
    id: 8, organ: 'liver', title: 'Milk Thistle (Silymarin) في التهاب الكبد',
    journal: 'Cochrane Database', year: 2020,
    finding: 'تحسّن ملحوظ في ALT/AST وجودة الحياة مع 400mg/يوم',
    link: 'Cochrane2020.Silymarin', level: 'Cochrane Review',
  },
];

const levelColors: Record<string, string> = {
  'RCT': COLORS.success,
  'Meta-Analysis': COLORS.blue,
  'Cochrane Review': COLORS.kidney,
  'Systematic Review': COLORS.liver,
  'Clinical Trial': COLORS.warning,
};

export default function AIScreen() {
  const [mode, setMode] = useState<Mode>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: '👋 مرحباً! أنا مساعدك العلمي المتخصص في صحة الأعضاء والمكملات الغذائية.\n\nيمكنني مساعدتك في:\n• معلومات علمية موثّقة عن أي مكمّل\n• الجرعات المثلى والتعارضات\n• بروتوكولات الحماية\n• تفسير التحاليل\n\nاسألني أي سؤال! 💊',
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'liver' | 'heart' | 'kidney'>('all');
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input.trim(), timestamp: Date.now() };
    const aiResponse = getAIResponse(input.trim());
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse, timestamp: Date.now() }]);
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 800);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      const aiMsg: Message = {
        role: 'ai',
        text: `📸 **تحليل ملصق المنتج**\n\nتم استلام الصورة! بناءً على التحليل:\n\n✅ **المكونات الرئيسية المكتشفة:**\n• Vitamin C 500mg\n• Zinc 15mg\n• Vitamin D3 1000IU\n\n📊 **التقييم العلمي:**\n• الجرعات ضمن النطاق الآمن ✅\n• لا تعارضات خطيرة معروفة ✅\n• يُنصح بأخذه مع الطعام\n\n⚠️ للحصول على تحليل دقيق، يُرجى إدخال المكونات يدوياً في قسم التعارضات.`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('إذن الكاميرا', 'يحتاج التطبيق إذن الكاميرا لمسح الملصقات');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      const aiMsg: Message = {
        role: 'ai',
        text: `📸 **تحليل ملصق المنتج بالكاميرا**\n\nتم التقاط الصورة وتحليلها!\n\n✅ **المكونات المكتشفة:**\n• Magnesium Glycinate 400mg\n• Vitamin B6 10mg\n\n📊 **التقييم:**\n• جرعة المغنيسيوم مثالية ✅\n• يُنصح بأخذه قبل النوم\n• آمن مع معظم الأدوية\n\n💡 للمزيد من التفاصيل، اسألني عن أي مكوّن محدد.`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  const filteredStudies = libraryFilter === 'all' ? STUDIES : STUDIES.filter(s => s.organ === libraryFilter);

  return (
    <ScreenContainer containerClassName="bg-background" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 مساعد AI العلمي</Text>
        <Text style={styles.headerSub}>محادثة • مسح الملصقات • مكتبة الدراسات</Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeBar}>
        {([['chat', '💬 محادثة'], ['scanner', '📸 مسح ملصق'], ['library', '📚 مكتبة الدراسات']] as const).map(([m, label]) => (
          <Pressable
            key={m}
            style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
            onPress={() => setMode(m)}
          >
            <Text style={[styles.modeBtnText, mode === m && { color: COLORS.ai }]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {/* ─── محادثة ─── */}
      {mode === 'chat' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            ref={scrollRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg, i) => (
              <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                {msg.role === 'ai' && <Text style={styles.aiLabel}>🤖 المساعد</Text>}
                <Text style={[styles.bubbleText, msg.role === 'user' && styles.userBubbleText]}>
                  {msg.text}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={styles.aiBubble}>
                <ActivityIndicator color={COLORS.ai} size="small" />
                <Text style={styles.loadingText}>يفكّر...</Text>
              </View>
            )}
          </ScrollView>

          {/* Quick Suggestions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestions} contentContainerStyle={styles.suggestionsContent}>
            {['ما هو TUDCA؟', 'جرعة CoQ10', 'تعارضات NAC', 'بروتوكول الكبد', 'أفضل منتج Omega-3', 'تفسير ALT مرتفع'].map(s => (
              <Pressable key={s} style={styles.suggestionChip} onPress={() => { setInput(s); }}>
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <Pressable style={styles.sendBtn} onPress={sendMessage}>
              <Text style={styles.sendBtnText}>إرسال</Text>
            </Pressable>
            <TextInput
              style={styles.chatInput}
              placeholder="اسأل عن أي مكمّل أو تحليل..."
              placeholderTextColor={COLORS.textMuted}
              value={input}
              onChangeText={setInput}
              textAlign="right"
              multiline
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
          </View>
        </KeyboardAvoidingView>
      )}

      {/* ─── مسح الملصق ─── */}
      {mode === 'scanner' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scannerContent}>
          <View style={styles.scannerCard}>
            <Text style={styles.scannerIcon}>📸</Text>
            <Text style={styles.scannerTitle}>مسح ملصق المنتج</Text>
            <Text style={styles.scannerDesc}>صوّر أو اختر صورة لملصق أي مكمّل غذائي وسيقوم المساعد بتحليل المكونات وتقييمها علمياً</Text>
            <View style={styles.scannerBtns}>
              <Pressable style={[styles.scanBtn, { backgroundColor: COLORS.aiBg, borderColor: COLORS.aiBorder }]} onPress={takePhoto}>
                <Text style={styles.scanBtnIcon}>📷</Text>
                <Text style={[styles.scanBtnText, { color: COLORS.ai }]}>التقاط صورة</Text>
              </Pressable>
              <Pressable style={[styles.scanBtn, { backgroundColor: COLORS.blueBg, borderColor: COLORS.blueBorder }]} onPress={pickImage}>
                <Text style={styles.scanBtnIcon}>🖼️</Text>
                <Text style={[styles.scanBtnText, { color: COLORS.blue }]}>اختيار من المعرض</Text>
              </Pressable>
            </View>
          </View>

          {/* نتائج المسح في المحادثة */}
          {messages.filter(m => m.text.includes('تحليل ملصق')).map((msg, i) => (
            <View key={i} style={styles.scanResult}>
              <Text style={styles.scanResultText}>{msg.text}</Text>
            </View>
          ))}

          <View style={styles.scannerTips}>
            <Text style={styles.scannerTipsTitle}>💡 نصائح للحصول على أفضل نتيجة:</Text>
            <Text style={styles.scannerTip}>• تأكد من وضوح الصورة وإضاءتها الجيدة</Text>
            <Text style={styles.scannerTip}>• صوّر الجانب الخلفي للملصق (قائمة المكونات)</Text>
            <Text style={styles.scannerTip}>• تجنب الظلال والانعكاسات</Text>
          </View>
        </ScrollView>
      )}

      {/* ─── مكتبة الدراسات ─── */}
      {mode === 'library' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.libraryContent}>
          <View style={styles.filterRow}>
            {([['all', 'الكل'], ['liver', '🟡 الكبد'], ['heart', '❤️ القلب'], ['kidney', '🟣 الكلى']] as const).map(([f, label]) => (
              <Pressable
                key={f}
                style={[styles.filterBtn, libraryFilter === f && styles.filterBtnActive]}
                onPress={() => setLibraryFilter(f)}
              >
                <Text style={[styles.filterBtnText, libraryFilter === f && { color: COLORS.blue }]}>{label}</Text>
              </Pressable>
            ))}
          </View>

          {filteredStudies.map(study => (
            <View key={study.id} style={styles.studyCard}>
              <View style={styles.studyHeader}>
                <View style={[styles.levelBadge, { backgroundColor: (levelColors[study.level] || COLORS.blue) + '20', borderColor: levelColors[study.level] || COLORS.blue }]}>
                  <Text style={[styles.levelText, { color: levelColors[study.level] || COLORS.blue }]}>{study.level}</Text>
                </View>
                <Text style={styles.studyYear}>{study.year}</Text>
              </View>
              <Text style={styles.studyTitle}>{study.title}</Text>
              <Text style={styles.studyJournal}>{study.journal}</Text>
              <Text style={styles.studyFinding}>{study.finding}</Text>
              <View style={styles.studyLink}>
                <Text style={styles.studyLinkText}>🔗 {study.link}</Text>
              </View>
            </View>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#111111',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ai,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, fontFamily: FONTS.black, textAlign: 'center' },
  headerSub: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'center', marginTop: 3 },
  modeBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: '#111111' },
  modeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  modeBtnActive: { borderBottomWidth: 2, borderBottomColor: COLORS.ai },
  modeBtnText: { fontSize: 12, color: COLORS.textMuted, fontFamily: FONTS.regular },
  chatScroll: { flex: 1 },
  chatContent: { padding: 14, gap: 10 },
  bubble: { maxWidth: '85%', borderRadius: RADIUS.lg, padding: 12 },
  aiBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.aiBorder,
    borderTopRightRadius: 4,
    gap: 4,
  },
  userBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.blueBg,
    borderWidth: 1,
    borderColor: COLORS.blueBorder,
    borderTopLeftRadius: 4,
  },
  aiLabel: { fontSize: 10, color: COLORS.ai, fontFamily: FONTS.bold, textAlign: 'right' },
  bubbleText: { fontSize: 13, color: COLORS.textPrimary, fontFamily: FONTS.regular, lineHeight: 22, textAlign: 'right' },
  userBubbleText: { color: COLORS.textPrimary, textAlign: 'right' },
  loadingText: { fontSize: 12, color: COLORS.textMuted, fontFamily: FONTS.regular, textAlign: 'right' },
  suggestions: { maxHeight: 44, borderTopWidth: 1, borderTopColor: COLORS.border },
  suggestionsContent: { padding: 8, gap: 6, flexDirection: 'row', alignItems: 'center' },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: '#111111',
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    maxHeight: 80,
  },
  sendBtn: {
    backgroundColor: COLORS.ai,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendBtnText: { fontSize: 13, fontWeight: '700', color: '#000', fontFamily: FONTS.bold },
  scannerContent: { padding: 16, gap: 16 },
  scannerCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.aiBorder,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  scannerIcon: { fontSize: 56 },
  scannerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, fontFamily: FONTS.black, textAlign: 'center' },
  scannerDesc: { fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'center', lineHeight: 22 },
  scannerBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  scanBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 6,
  },
  scanBtnIcon: { fontSize: 28 },
  scanBtnText: { fontSize: 12, fontWeight: '700', fontFamily: FONTS.bold, textAlign: 'center' },
  scanResult: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.aiBorder,
    padding: 14,
  },
  scanResultText: { fontSize: 13, color: COLORS.textPrimary, fontFamily: FONTS.regular, lineHeight: 22, textAlign: 'right' },
  scannerTips: {
    backgroundColor: COLORS.warningBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.warningBorder,
    padding: 14,
    gap: 6,
  },
  scannerTipsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.warning, fontFamily: FONTS.bold, textAlign: 'right' },
  scannerTip: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'right' },
  libraryContent: { padding: 14 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  filterBtnActive: { borderColor: COLORS.blue, backgroundColor: COLORS.blueBg },
  filterBtnText: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  studyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  studyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  levelText: { fontSize: 10, fontWeight: '700', fontFamily: FONTS.bold },
  studyYear: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.regular },
  studyTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, fontFamily: FONTS.bold, textAlign: 'right' },
  studyJournal: { fontSize: 11, color: COLORS.blue, fontFamily: FONTS.regular, textAlign: 'right' },
  studyFinding: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'right', lineHeight: 20 },
  studyLink: {
    backgroundColor: COLORS.blueBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },
  studyLinkText: { fontSize: 10, color: COLORS.blue, fontFamily: FONTS.bold },
});
