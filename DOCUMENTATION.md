# 📘 التوثيق التقني والمعماري الشامل لمنصة JINNA 5.0
### نظام المحاكاة والتعليم الهندسي المتقدم لنظم الذكاء الاصطناعي (AI Systems & Research)
**المطور والمالك الرئيسي:** المهندس يوسف الباز (Automation Ai Yousuf Albaz)  
**البيئة السحابية:** Google AI Studio Enterprise Enclave / Cloud Run Container  
**محرك الاستدلال الذكي:** Google Gemini 3.8 Flash Core  

---

## 📑 فهرس المحتويات
1. [نظرة عامة وفلسفة التصميم المعماري (Architectural Overview)](#1-نظرة-عامة-وفلسفة-التصميم-المعماري)
2. [مخطط تدفق البيانات والأمان (Security & Data Flow)](#2-مخطط-تدفق-البيانات-والأمان)
3. [ملف الخادم الرئيسي: `server.ts`](#3-ملف-الخادم-الرئيسي-serverts)
4. [ملف نقطة انطلاق التطبيق: `src/main.tsx` و `index.html`](#4-ملف-نقطة-انطلاق-التطبيق-srcmaintsx-و-indexhtml)
5. [المتحكم الرئيسي للواجهة: `src/App.tsx`](#5-المتحكم-الرئيسي-للواجهة-srcapptsx)
6. [الأنماط والأنواع الصارمة: `src/types.ts`](#6-الأنماط-والأنواع-الصارمة-srctypests)
7. [إدارة المظهر والحالة: `src/context/ThemeContext.tsx`](#7-إدارة-المظهر-والحالة-srccontextthemecontexttsx)
8. [محرك المساعد الذكي: `src/components/AiMentorDrawer.tsx`](#8-محرك-المساعد-الذكي-srccomponentsaimentordrawertsx)
9. [عرض الدروس والتنفيذ البرمجي: `src/components/LessonView.tsx`](#9-عرض-الدروس-والتنفيذ-البرمجي-srccomponentslessonviewtsx)
10. [شريط الملاحة والقائمة الجانبية: `Header.tsx` & `Sidebar.tsx`](#10-شريط-الملاحة-والقائمة-الجانبية-headertsx--sidebartsx)
11. [نظام الشهادة والاعتماد الأكاديمي: `CertificateModal.tsx`](#11-نظام-الشهادة-والاعتماد-الأكاديمي-certificatemodaltsx)
12. [بوابة إدارة المنصة السرية للمطور: `AdminPortalModal.tsx`](#12-بوابة-إدارة-المنصة-السرية-للمطور-adminportalmodaltsx)
13. [بيانات المنهج الـ 2000 ساعة: مجلد `src/data/`](#13-بيانات-المنهج-الـ-2000-ساعة-مجلد-srcdata)
14. [ملف تطبيق الموبايل PWA: `public/manifest.json`](#14-ملف-تطبيق-الموبايل-pwa-publicmanifestjson)

---

## 1. نظرة عامة وفلسفة التصميم المعماري
تعتمد منصة **JINNA 5.0** نمط البناء الهجين المتكامل **Full-Stack Single-Port Architecture**؛ حيث يعمل خادم خلفي مبني بواسطة Node.js / Express مع بيئة العرض التفاعلية React 18 و Vite على منفذ حوسبة سحابي موحد (`Port 3000`).

### المبادئ الهندسية الصارمة للمنصة:
1. **Zero-Client-Key Leakage:** مفاتيح API الخاصة بنماذج الذكاء الاصطناعي (Gemini API Key) لا تُرسل مطلقاً إلى متصفح العميل؛ بل تُحفظ في متغيرات بيئة الخادم المشفرة (`process.env.GEMINI_API_KEY`).
2. **Server-Side AI Proxy:** يتم توجيه استفسارات الطلاب آلياً عبر وسيط خلفي بالخادم، مع فحص وتطهير المدخلات وإضافة السياق الهندسي (System Prompts) لضمان دقة الإجابات بدون أي حاجة لتدخل المستخدم.
3. **PWA Native Performance:** الواجهة مصممة كـ Progressive Web App قابل للتثبيت المباشر على الهواتف الذكية مع استجابة بصرية في أجزاء من الثانية بواسطة Tailwind CSS و Framer Motion (`motion/react`).

---

## 2. مخطط تدفق البيانات والأمان
```
[متصفح العميل / تطبيق الهاتف]
         │
         ├── 1. طلبات الدروس والمحتوى (Static Assets) ──> Vite Express Middleware
         │
         ├── 2. استشارة المساعد الذكي (AI Mentor Query) 
         │      │
         │      ▼ (POST /api/ai-mentor)
         │ [خادم Node.js / Express الداخلي]
         │      │  - فحص الصلاحية ومعدل الطلبات (Rate Limiting)
         │      │  - حقن السياق الأكاديمي ومستوى الطالب
         │      │  - جلب مفتاح GEMINI_API_KEY السري من البيئة
         │      ▼
         │ [Google Gemini 3.8 Flash Neural Core]
         │      │
         │      └──> تدفق الرد المشفر (JSON / Stream) ──> إلى المتصفح
         │
         └── 3. حفظ تقدم الطالب والملاحظات ──> التخزين المحلي الآمن (Client LocalStorage)
```

---

## 3. ملف الخادم الرئيسي: `server.ts`
يمثل هذا الملف العمود الفقري لمعالجة الطلبات، حماية المنصة، وتأمين الاتصال بمحركات الذكاء الاصطناعي.

### تحليل الكود البرمجي والوظائف التقنية:

```typescript
// استيراد الحزم الأساسية لبناء الخادم الشبكي والتعامل مع الملفات
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
```
* **فائدة السطور:** تجهيز بيئة Express الخفيفة والسريعة، واستيراد حزمة `@google/genai` الرسمية للاتصال بنماذج الجيل الأحدث من Gemini.

```typescript
const app = express();
const PORT = 3000;
```
* **فائدة السطور:** تهيئة تطبيق Express وتثبيت المنفذ على `3000`، وهو المنفذ الوحيد المعتمد في حاويات Google Cloud Run لربط الـ Ingress Proxy.

```typescript
// Middleware لمعالجة حمولات JSON وضبط حدود الأمان
app.use(express.json({ limit: '2mb' }));
```
* **فائدة السطور:** السماح للخادم بقراءة البيانات القادمة بصيغة JSON من المتصفح، مع تحديد حد أقصى للرسالة (2 ميجابايت) لمنع هجمات حجب الخدمة (DoS).

```typescript
// تهيئة عميل الذكاء الاصطناعي بنمط الـ Lazy Initialization
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}
```
* **فائدة السطور:** تطبيق نمط التصميم المتقدم **Lazy Initialization**؛ حيث لا يُستدعى العميل إلا عند أول طلب فعلي، مما يحمي الخادم من الانهيار أثناء الإقلاع إذا تأخر تحميل متغيرات البيئة.

```typescript
// مسار التحقق الصحي للخادم (Health Check Endpoint)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    platform: 'JINNA 5.0 AI Platform',
    developer: 'Yousuf Albaz' 
  });
});
```
* **فائدة السطور:** مسار تستخدمه أنظمة الفحص التلقائي في السحابة للتأكد من أن الخادم يعمل بكفاءة ولا يحتاج لإعادة تشغيل.

```typescript
// المسار المحمي للوسيط الذكي (Secure AI Mentor Endpoint)
app.post('/api/ai-mentor', async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;
    // التحقق من صحة المدخلات
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'حقل الرسالة مطلوب ويجب أن يكون نصاً' });
    }

    const ai = getAiClient();
    
    // حقن السياق الهندسي ومطالب الأمان في النظام
    const systemInstruction = `
أنت المساعد الأكاديمي والهندسي الذكي لمنصة JINNA 5.0 المتخصصة في أبحاث ونظم الذكاء الاصطناعي،
والتي أسسها وطورها المهندس يوسف الباز (Automation Ai Yousuf Albaz).
وظيفتك: تقديم شروحات عميقة بالرياضيات، وكود Python/PyTorch و CUDA، مع التركيز على الكفاءة الحسابية ونظم الاستدلال.
`;

    // استدعاء الموديل gemini-3.8-flash مع إعدادات الدقة
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.3, // قيمة منخفضة لضمان الدقة الرياضية وتجنب الهلوسة
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('AI Proxy Error:', error);
    res.status(500).json({ 
      error: 'فشل في معالجة الاستفسار عبر الخادم الوسيط',
      details: error.message 
    });
  }
});
```
* **فائدة السطور:** نقطة النهاية الأكثر أهمية في المنصة؛ تستقبل رسالة الطالب، تحصنها بتعليمات النظام الأكاديمية الصارمة، تطلب التوليد من نموذج `gemini-3.8-flash` وتُعيد الرد المهندم بدون كشف مفاتيح الاتصال.

```typescript
// دمج خادم تطوير Vite أو خدمة الملفات الثابتة في بيئة الإنتاج
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}
```
* **فائدة السطور:** إدارة ذكية للملفات؛ في وضع التطوير يُدمج Vite للتعديل الفوري، وفي وضع الإنتاج يتم تقديم الحزم المضغوطة من مجلد `dist/` مع الحفاظ على مسارات الـ SPA.

---

## 4. ملف نقطة انطلاق التطبيق: `src/main.tsx` و `index.html`

### أ. ملف `index.html`:
* **المسار:** `/index.html`
* **المهمة:** تجهيز واجهة العرض للمتصفح، وتحميل الخطوط العربية الحديثة (Cairo و IBM Plex Sans Arabic و JetBrains Mono للرموز البرمجية).
* **إعدادات الـ PWA:** يحتوي على وسوم الـ viewport المحكمة لمنع التكبير العشوائي على الموبايل (`maximum-scale=1.0, user-scalable=no`) وربط ملف الـ `manifest.json`.

### ب. ملف `src/main.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```
* **فائدة السطور:** تهيئة شجرة مكونات React 18 داخل عنصر DOM الأساسي `#root`، مع تغليف التطبيق بـ `ThemeProvider` لضمان وصول حالة المظهر المظلم/الفاتح لكافة المكونات الفرعية.

---

## 5. المتحكم الرئيسي للواجهة: `src/App.tsx`
يمثل `App.tsx` العقل التنفيذي لواجهة المستخدم بالكامل؛ حيث يدير الحالة العامة (Global State)، التبديل بين الفصول، وتنسيق النوافذ المنبثقة.

### أهم المتغيرات والحالات (States) داخل الملف:
1. `currentChapterId` و `currentLessonId`: تحددان الدرس الفعلي المعروض للمتعلم.
2. `progress`: كائن يحتوي على الدروس المكتملة، ودرجات الاختبارات لكل فصل، ومسجّل بالـ `localStorage` لحفظ تقدم الطالب عند إغلاق المتصفح.
3. `isAiMentorOpen`: مفتاح منطقي (Boolean) يتحكم بفتح وإغلاق درج المساعد الذكي.
4. `isDevMode`: حالة سرية تتيح للمهندس يوسف الباز التحكم في المنصة والوصول إلى بوابة الإدارة عبر كلمة المرور.
5. `isSyllabusOpen` و `isCertificateModalOpen`: تتحكمان في عرض المنهج الكامل وشهادة الاعتماد السحابية.

### آلية الانتقال الانسيابي (Fluid Motion):
```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={currentLesson.id}
    initial={{ opacity: 0, y: 14, scale: 0.995 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -14, scale: 0.995 }}
    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
  >
    <LessonView ... />
  </motion.div>
</AnimatePresence>
```
* **الشرح التقني:** استخدام مكون `AnimatePresence` مع مفتاح المعرف للدرس `currentLesson.id` يسمح بمحو الدرس القديم بنعومة وتلاشي صعودي خاطف للدرس الجديد، مما يمنح تجربة تصفح تضاهي التطبيقات المكتوبة بلغة Swift الأصلية.

---

## 6. الأنماط والأنواع الصارمة: `src/types.ts`
يضمن هذا الملف الأمان البرمجي الصارم (Strict Type-Safety) لمنع أي خطأ وقت التشغيل (Runtime Bug).

### النماذج الهيكلية الأساسية:
* **`Lesson`:** يمثل بنية الدرس الواحد، ويتضمن:
  - `id`: المعرف الفريد للدرس (مثل `ch0-l1`).
  - `title` و `duration`: اسم الدرس والوقت التقديري.
  - `sections`: مصفوفة تتضمن الأقسام النظرية والمعادلات الرياضية بصيغة LaTeX.
  - `codeSnippets`: أكواد برمجية تفاعلية بـ PyTorch أو CUDA جاهزة للتنفيذ.
  - `videoResources`: روابط المحاضرات البصرية المعتمدة مع المعرفات (`embedId`).
* **`Chapter`:** كائن الفصل الدراسي الذي يجمع مجموعة من الدروس متبوعة باختبار تقييمي `Quiz`.
* **`UserProgress`:** يسجل الدروس المكتملة، ونسبة الإنجاز، وسجل الاختبارات.

---

## 7. إدارة المظهر والحالة: `src/context/ThemeContext.tsx`
* **المهمة:** تفعيل وضع الرؤية المريحة للعين ليلاً (Cyberpunk Dark Mode) ووضع النهار عالي التباين (Crisp Engineering Light Mode).
* **آلية العمل:** يقوم الكود بحفظ تفضيل المستخدم في `localStorage` باسم مفتاح `jinna5_theme_mode`، ثم يقوم بحقن الخاصية `data-theme="light"` أو `data-theme="dark"` على عنصر الـ `<html>` الجذري لتفعيل متغيرات ألوان الـ CSS المعرفة في `index.css`.

---

## 8. محرك المساعد الذكي: `src/components/AiMentorDrawer.tsx`
درج جانبي عائم يمثل الواجهة التنفيذية للدردشة مع نموذج الذكاء الاصطناعي.

### المزايا التقنية المنفذة:
1. **واجهة نظيفة وخالية من المشتتات (Minimalist Executive Interface):** تم استبعاد كافة الأزرار الزائدة وتوفير شاشة حوارية مباشرة تركز على السؤال والإجابة.
2. **عرض الأكواد التفاعلية:** يدعم معالجة نصوص الـ Markdown وعزل كتل الأكواد (Code Blocks) مع أزرار نسخ لحظية (One-Click Copy).
3. **الاتصال بالخادم الوسيط:** يرسل الأسئلة إلى مسار `/api/ai-mentor`، مع مؤشر كتابة نابض واحترافي أثناء انتظار رد النموذج.

---

## 9. عرض الدروس والتنفيذ البرمجي: `src/components/LessonView.tsx`
أكبر مكون تفاعلي في المنصة؛ مقسم إلى تبويبات متخصصة:
1. **تبويب النظريات والرياضيات (`Theory & Math`):** يعرض إثباتات الخوارزميات، وتوزيع المصفوفات، وميكانيكا التضمين.
2. **تبويب المختبر البرمجي (`Code & Playground`):** يعرض أكواد PyTorch التنفيذية مع زر لتشغيل المحاكاة ورؤية النتائج اللحظية.
3. **تبويب المحاضرات المعتمدة (`Masterclasses`):** يدمج مشغل يوتيوب متقدم داخل المنصة بدون إعلانات مزعجة وبأعلى جودة لدراسة المحاضرات البصرية.
4. **تبويب الملاحظات الشخصية (`Student Notes`):** يتيح للمتعلم تدوين ملاحظاته وحفظها محلياً لكل درس.

---

## 10. شريط الملاحة والقائمة الجانبية: `Header.tsx` & `Sidebar.tsx`
* **`Header.tsx`:** يحتوي على شعار المنصة المتحرك، وشريط إحصاء التقدم الدراسي الإجمالي، وحقل البحث الفوري في كافة موضوعات الدبلومة، وزر فتح المساعد الذكي.
* **`Sidebar.tsx`:** يمثل الشجرة الأكاديمية الكاملة؛ يحتوي على قائمة الفصول التفاعلية القابلة للطي (Accordion)، مع إشارات النجاح الخضراء أمام الدروس المنجزة، وبطاقة تعريف بالمطور الرئيسي **المهندس يوسف الباز**.

---

## 11. نظام الشهادة والاعتماد الأكاديمي: `CertificateModal.tsx`
* **المهمة:** توليد وثيقة التخرج الرسمية بعد إتمام متطلبات المنهج.
* **المعايير المدمجة:**
  - اعتماد بيئة **Google AI Studio Enterprise Cloud Ecosystem** الرسمية.
  - ختم التوثيق الرقمي المعتمد برقم تسلسلي فريد مشفر (`Credential ID`).
  - تسجيل ساعات الدبلومة المعتمدة (**2,000+ ساعة بحث وتطبيق معملي**).
  - إمكانية طباعة الشهادة أو تصديرها كملف PDF عالي الجودة بنقرة واحدة (`window.print()`).
  - نافذة فحص التوثيق السحابي أونلاين لمراجعة حالة الاعتماد وحاوية التشغيل ومحرك الذكاء الاصطناعي.

---

## 12. بوابة إدارة المنصة السرية للمطور: `AdminPortalModal.tsx`
* **المهمة:** لوحة تحكم مخصصة حصرياً للمهندس يوسف الباز لمراقبة حالة النظام وتحديث الإعدادات.
* **الأمان:** محمية برمز مرور مشفر (Master PIN)؛ بمجرد إدخاله يتاح للمطور:
  - تعديل مفاتيح وسياق المساعد الذكي.
  - إدارة وضع الصيانة ومفاتيح المطورين.
  - فحص أداء الخادم وسلامة الاتصال السحابي.

---

## 13. بيانات المنهج الـ 2000 ساعة: مجلد `src/data/`
يحتوي هذا المجلد على المنهج الأكاديمي الأكثر عمقاً:
* `chaptersPart0.ts`: علوم الحاسب الصلبة، نواة لغة بايثون CPython، وإدارة الذاكرة الافتراضية.
* `chaptersPart1.ts`: عتاد المعالجات المتوازية (GPUs)، وحدات التنسور (Tensor Cores)، ومعمارية الذاكرة عالية النطاق HBM3.
* `chaptersPart2.ts`: بناء المحولات (Transformers) من الصفر، وآليات الانتباه الذاتي (Multi-Head Self-Attention)، وتدريب نماذج GPT.
* `chaptersPart3.ts`: تقنيات التحسين والمحاذاة الفائقة (LoRA, FlashAttention, vLLM, RLHF, DPO) وهندسة الوكلاء الذكية.
* `curriculumData.ts`: دالة تجميعية ذكية تقوم بحساب إجمالي الساعات والدروس تلقائياً.

---

## 14. ملف تطبيق الموبايل PWA: `public/manifest.json`
* **المهمة:** تزويد أنظمة الهواتف (أندرويد وآيفون) بالمعلومات اللازمة لتحويل الموقع إلى تطبيق مثبت:
```json
{
  "short_name": "JINNA 5",
  "name": "JINNA 5.0 • AI Systems & Research Fellowship",
  "icons": [
    {
      "src": "/icon.png",
      "sizes": "192x192 512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "background_color": "#0B0B0F",
  "theme_color": "#0B0B0F",
  "display": "standalone",
  "orientation": "portrait"
}
```
* **النتيجة:** عند تثبيت التطبيق يختفي شريط المتصفح ويعمل التطبيق بملء الشاشة بسرعة فائقة وبمظهر تطبيقي أصيل.

---

**تم إعداد وتوثيق هذا الملف بمعايير هندسية احترافية ليكون مرجعاً تقنياً دائماً للمهندس يوسف الباز في صيانة وتطوير المنصة.**
