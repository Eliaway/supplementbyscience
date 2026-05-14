import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

// ========================
// مساعد AI — 4 خبراء مستقلون
// ========================

const EXPERTS = {
  doctor: {
    name: 'الطبيب المتخصص',
    emoji: '👨‍⚕️',
    systemPrompt: `أنت طبيب متخصص في الطب الباطني وصحة الأعضاء. تحلّل الملف الصحي للمستخدم وتقدّم:
1. تقييم طبي شامل بناءً على الأمراض المزمنة والأدوية
2. المكملات الغذائية الموصى بها طبياً مع الجرعات الدقيقة
3. تحذيرات التفاعلات الدوائية الخطيرة
4. التحاليل المخبرية الموصى بإجرائها
5. متى يجب مراجعة الطبيب فوراً
أجب باللغة العربية بشكل علمي دقيق وموجز.`,
  },
  pharmacist: {
    name: 'الصيدلاني',
    emoji: '💊',
    systemPrompt: `أنت صيدلاني متخصص في المكملات الغذائية والتفاعلات الدوائية. تحلّل الملف الصحي وتقدّم:
1. قائمة المكملات المثلى مع الجرعات والتوقيت (مع/بدون طعام)
2. التفاعلات بين المكملات والأدوية الحالية (أخضر=آمن، أصفر=تنبيه، أحمر=خطر)
3. المكملات غير الضرورية أو المتداخلة
4. أفضل الأشكال الصيدلانية (كبسولة/مسحوق/سائل)
5. جدول زمني مثالي للجرعات اليومية
أجب باللغة العربية بشكل عملي ومنظّم.`,
  },
  nutritionist: {
    name: 'خبير التغذية الرياضية',
    emoji: '🥗',
    systemPrompt: `أنت خبير تغذية رياضية وعلاجية. تحلّل الملف الصحي وتقدّم:
1. خطة غذائية مخصصة حسب الهدف الصحي ومستوى النشاط
3. المكملات الرياضية المناسبة مع التوقيت (قبل/بعد التمرين)
4. مصادر غذائية طبيعية بديلة لكل مكمّل
5. كمية الماء اليومية المثلى
6. الأطعمة التي يجب تجنّبها بناءً على الحساسيات
أجب باللغة العربية بشكل عملي ومفصّل.`,
  },
  hormones: {
    name: 'متخصص الهرمونات والببتيدات',
    emoji: '💉',
    systemPrompt: `أنت متخصص في الهرمونات والببتيدات وSARMs والمحسّنات الأدائية. تحلّل الملف الصحي وتقدّم:
1. تقييم البروتوكول الهرموني الحالي (TRT/Peptides/SARMs)
2. الجرعات المثلى والتوقيت المناسب
3. بروتوكول الحماية الضروري (AI/SERM/Liver protection)
4. التحاليل الدورية المطلوبة (Testosterone/E2/CBC/Liver panel)
5. التحذيرات والآثار الجانبية المحتملة
6. بروتوكول PCT إذا لزم
أجب باللغة العربية بشكل علمي دقيق مع التحذيرات الضرورية.`,
  },
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ========================
  // AI Routes
  // ========================
  ai: router({

    // تحليل الملف الصحي بواسطة خبير محدد
    analyzeProfile: publicProcedure
      .input(z.object({
        expertType: z.enum(['doctor', 'pharmacist', 'nutritionist', 'hormones']),
        profile: z.object({
          name: z.string().optional(),
          age: z.number().optional(),
          weight: z.number().optional(),
          height: z.number().optional(),
          gender: z.string().optional(),
          activityLevel: z.string().optional(),
          healthGoal: z.string().optional(),
          chronicDiseases: z.array(z.string()).optional(),
          allergies: z.array(z.string()).optional(),
          injuries: z.array(z.string()).optional(),
          medications: z.array(z.object({
            name: z.string(),
            dose: z.string().optional(),
            frequency: z.string().optional(),
          })).optional(),
          hormones: z.array(z.object({
            label: z.string(),
            dose: z.number(),
            unit: z.string(),
            frequency: z.string(),
            company: z.string().optional(),
          })).optional(),
          supplements: z.array(z.string()).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const expert = EXPERTS[input.expertType];
        const { profile } = input;

        const profileText = `
ملف المستخدم الصحي:
- الاسم: ${profile.name || 'غير محدد'}
- العمر: ${profile.age || 'غير محدد'} سنة
- الوزن: ${profile.weight || 'غير محدد'} كجم
- الطول: ${profile.height || 'غير محدد'} سم
- الجنس: ${profile.gender === 'male' ? 'ذكر' : profile.gender === 'female' ? 'أنثى' : 'غير محدد'}
- مستوى النشاط: ${profile.activityLevel || 'غير محدد'}
- الهدف الصحي: ${profile.healthGoal || 'غير محدد'}
- الأمراض المزمنة: ${profile.chronicDiseases?.join('، ') || 'لا يوجد'}
- الحساسيات: ${profile.allergies?.join('، ') || 'لا يوجد'}
- الإصابات: ${profile.injuries?.join('، ') || 'لا يوجد'}
- الأدوية الحالية: ${profile.medications?.map(m => `${m.name} ${m.dose}`).join('، ') || 'لا يوجد'}
- الهرمونات/الببتيدات: ${profile.hormones?.map(h => `${h.label} ${h.dose}${h.unit} ${h.frequency}`).join('، ') || 'لا يوجد'}
- المكملات الحالية: ${profile.supplements?.join('، ') || 'لا يوجد'}
        `.trim();

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: expert.systemPrompt },
            { role: 'user', content: `قم بتحليل هذا الملف الصحي وقدّم توصياتك:\n\n${profileText}` },
          ],
        });

        return {
          expert: expert.name,
          emoji: expert.emoji,
          analysis: response.choices[0].message.content,
        };
      }),

    // محادثة ذكية مع سياق الملف الصحي
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })),
        profileContext: z.string().optional(),
        expertType: z.enum(['doctor', 'pharmacist', 'nutritionist', 'hormones', 'general']).optional(),
      }))
      .mutation(async ({ input }) => {
        const systemContent = input.expertType && input.expertType !== 'general'
          ? EXPERTS[input.expertType].systemPrompt
          : `أنت مساعد صحي ذكي متخصص في المكملات الغذائية وصحة الأعضاء (الكبد، القلب، الكلى).
تقدّم معلومات علمية دقيقة مستندة إلى الأبحاث. تتحدث باللغة العربية.
${input.profileContext ? `\nملف المستخدم:\n${input.profileContext}` : ''}`;

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemContent },
            ...input.messages,
          ],
        });

        return { content: response.choices[0].message.content };
      }),

    // تحليل صورة ملصق المنتج
    analyzeLabel: publicProcedure
      .input(z.object({
        imageUrl: z.string(),
        profileContext: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `أنت خبير في تحليل ملصقات المكملات الغذائية. عند رؤية صورة ملصق:
1. اقرأ جميع المكونات والجرعات
2. قيّم جودة المنتج وفعاليته
3. حدّد المكونات النشطة الرئيسية
4. أشر إلى أي مواد حشو أو مكونات غير ضرورية
5. قارن الجرعات بالجرعات العلمية المثلى
6. أعطِ تقييماً من 10 للمنتج
${input.profileContext ? `\nملف المستخدم للمراعاة:\n${input.profileContext}` : ''}
أجب باللغة العربية.`,
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'حلّل هذا الملصق وأعطني تقييماً شاملاً:' },
                { type: 'image_url', image_url: { url: input.imageUrl } },
              ],
            },
          ],
        });

        return { analysis: response.choices[0].message.content };
      }),

    // تحليل صورة التحاليل المخبرية
    analyzeLabImage: publicProcedure
      .input(z.object({
        imageUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `أنت طبيب متخصص في تفسير التحاليل المخبرية. عند رؤية صورة نتائج تحاليل:
1. استخرج جميع القيم المذكورة مع وحداتها
2. حدّد القيم الطبيعية والشاذة
3. فسّر النتائج بشكل مبسّط
4. اقترح المكملات المناسبة لتحسين القيم الشاذة
5. أشر إلى الحالات التي تستدعي مراجعة الطبيب
أجب باللغة العربية بشكل منظّم.`,
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'حلّل هذه التحاليل المخبرية:' },
                { type: 'image_url', image_url: { url: input.imageUrl } },
              ],
            },
          ],
          response_format: { type: 'json_object' },
        });

        const raw = response.choices[0].message.content ?? '';
        try {
          const parsed = JSON.parse(raw as string);
          return { values: parsed, raw };
        } catch {
          return { values: null, raw };
        }
      }),

    // تحليل نصي للتحاليل
    analyzeLabText: publicProcedure
      .input(z.object({
        labText: z.string(),
        profileContext: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `أنت طبيب متخصص في تفسير التحاليل المخبرية وتوصية المكملات الغذائية المناسبة.
${input.profileContext ? `ملف المستخدم:\n${input.profileContext}` : ''}`,
            },
            {
              role: 'user',
              content: `فسّر هذه النتائج المخبرية وأعطني توصيات مكملات مخصصة:\n\n${input.labText}`,
            },
          ],
        });

        return { analysis: response.choices[0].message.content };
      }),
  }),
});

export type AppRouter = typeof appRouter;
