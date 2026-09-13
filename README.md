<p align="center">
  <img src="https://img.shields.io/badge/Vercel-Deployment--Active-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Status" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini API" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" />
</p>

---

# 🚀 منصة JINNA 5 | من الأساسيات إلى بناء نماذج الذكاء الاصطناعي من الصفر

> **إشراف وتطوير:** المهندس يوسف الباز (Automation AI Yousuf Albaz)

منصة تعليمية وتطبيقية متكاملة تهدف لتأهيل وتدريب مهندسي الذكاء الاصطناعي للعمل في أكبر الشركات العالمية. تأخذك المنصة في رحلة هندسية كاملة تبدأ من **علوم الحاسب ومكونات العتاد (Hardware)** وحتى **بناء وتدريب النماذج اللغوية الضخمة (LLMs) وتعديلها بنفسك من الصفر**.

🌐 **رابط المنصة الحي المباشر:** [jinfi.vercel.app](https://jinfi.vercel.app/)

---

## 🖥️ معاينة المنصة (Platform Interface)

<p align="center">
  <img src="https://jinfi.vercel.app/og-image.png" alt="JINNA 5 Preview" width="100%" />
</p>

---

## 🧩 هيكل الفصول التعليمية (Curriculum Matrix)

| # | الفصل (Module) | التغطية التقنية (Technical Scope) |
|---|---|---|
| **01** | Computer Architecture & Hardware | Memory Bandwidth, SRAM vs DRAM, GPU HBM, CUDA Cores |
| **02** | Mathematics for Deep Learning | Matrix Multiplications, Backpropagation, Gradient Descent |
| **03** | Neural Network Foundations | Perceptrons, Activation Functions, Loss Functions |
| **04** | Transformer Mechanics | Self-Attention, Multi-Head Attention, RoPE Embeddings |
| **05** | Pre-training LLMs from Scratch | Data Tokenization, Context Window Optimization, Loss Convergence |
| **06** | Distributed Systems & Scaling | FSDP, DeepSpeed, Tensor Parallelism, Megatron-LM |
| **07** | Model Quantization & Compression | GGUF, AWQ, GPTQ, KV-Cache Optimization |
| **08** | Alignment & Fine-Tuning | LoRA, QLoRA, SFT, RLHF, DPO |
| **09** | Production & Inference Engines | vLLM, TensorRT-LLM, API Server Deployment |
| **10** | Enterprise AI Benchmarks | MMLU Evaluation, Security, Red Teaming, Edge Deployment |

---

## 📚 المسار التعليمي للمنصة (Learning Path)

1. **أساسيات علوم الحاسب والعتاد (Computer Science & Hardware):**
   - فهم معمارية المعالجات (CPUs vs GPUs vs TPUs).
   - إدارة الذاكرة (VRAM & RAM) وكيفية التعامل مع الـ Data Streams.

2. **الرياضيات والبرمجة للذكاء الاصطناعي (Math & Programming Core):**
   - الجبر الخطي (Linear Algebra) وحساب التغير (Calculus) المخصص للتعلم العميق.
   - كود تفاعلي بلغة Python ومكتبات NumPy وPyTorch.

3. **بناء الشبكات العصبية (Neural Networks Architecture):**
   - فهم التنعيم والإشراف (Forward & Backward Propagation).
   - تصميم معماريات الانتباه (Transformers & Self-Attention Mechanics).

4. **بناء وتدريب النماذج الضخمة من الصفر (LLM Training from Scratch):**
   - تجميع ومعالجة البيانات الضخمة (Data Tokenization & Pre-training).
   - التدريب الموزع على عدة كروت شاشة (`FSDP` / `Megatron-LM`).
   - ضبط النماذج الدقيق (Fine-Tuning & Quantization) لنشرها واستهلاك موارد أقل.

5. **التأهيل السريري والشركات الكبرى (Industry & Enterprise Readiness):**
   - مراجعة الأوراق البحثية الحديثة (*arXiv / Meta / OpenAI / DeepMind*).
   - محاكاة أسئلة وأكواد المقابلات التقنية لشركات الذكاء الاصطناعي العالمية.

---

## 🌟 مميزات المنصة الرئيسية

- ⚡ **معمل كود تفاعلي:** كتابة واختبار خوارزميات الذكاء الاصطناعي مباشرة داخل المتصفح.
- 🤖 **مساعد ذكي مدعوم بـ Gemini:** يقدم شروحات مخصصة، مراجعة أكواد، وتصحيح الأخطاء لحظياً.
- 🏆 **شهادة إتمام معتمدة:** تصدر باسم المتعلم وتتضمن كود تحقق مشفر `JINNA5-XXXX` بعد إكمال كافة الفصول والتحديات.

---

## 🛠️ التكنولوجيا المستخدمة (Tech Stack)

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI Core:** Google Gemini API Integration
- **Deployment & Hosting:** Vercel (Production Automation)

---

## 🚀 كيفية تشغيل المنصة محلياً (Local Development)

```bash
# 1. تثبيت الحزم والمكتبات
npm install

# 2. إنشاء ملف المتغيرات البيئية
cp .env.example .env

# 3. تشغيل خادم التطوير
npm run dev
