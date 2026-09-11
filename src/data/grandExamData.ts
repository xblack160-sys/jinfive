import { QuizQuestion } from '../types';

export const GRAND_EXAM_PASSING_PERCENTAGE = 85; // 85% passing grade - Strict Fellow Standard
export const GRAND_EXAM_TOTAL_QUESTIONS = 25;
export const GRAND_EXAM_DURATION_MINUTES = 45;

export interface ExamQuestionPoolItem extends QuizQuestion {
  category: string;
}

export const grandDefenseQuestionBank: ExamQuestionPoolItem[] = [
  {
    id: "defense-q1",
    category: "Memory & Optimizer Math",
    question: "لنموذج Llama 3 بقوة 70 مليار معامل (70B) بنوع بيانات FP16، كم تبلغ الذاكرة المطلوبة لحفظ 'حالات المحسن' فقط (Optimizer States) باستخدام مُحسن AdamW القياسي أثناء التدريب الكامل من الصفر؟",
    options: [
      "560 جيجابايت (8 بايت لكل معامل لنسختي FP32 للزخم والتباين و FP32 Master Weights = 16 بايت إضافي لكل معامل)",
      "140 جيجابايت فقط (2 بايت لكل معامل)",
      "70 جيجابايت",
      "280 جيجابايت"
    ],
    correctIndex: 0,
    explanation: "في التدريب المختلط FP16 Mixed Precision مع AdamW: يحتاج النموذج إلى Master Weights بـ FP32 (4 بايت)، والزخم الأول Momentum بـ FP32 (4 بايت)، والتباين الثاني Variance بـ FP32 (4 بايت) بالإضافة إلى Gradients. إجمالي حالات المحسن وحدها تستهلك 12 إلى 16 بايت لكل معامل، أي لـ 70B تبلغ 560 جيجابايت على الأقل لحالات المحسن.",
    difficulty: "Hard"
  },
  {
    id: "defense-q2",
    category: "Attention & Kernels",
    question: "في دالة انتباه FlashAttention-2، لماذا يتم حساب Online Softmax وتحديث الإحصائيات (m_i, l_i) تراكمياً بدلاً من حساب دالة Softmax التقليدية بعد ضرب كامل المصفوفة؟",
    options: [
      "لتجنب كتابة وقراءة مصفوفة الانتباه بالحجم الكامل (N × N) من ذاكرة HBM البطيئة، وحصر كامل العمليات الحسابية داخل ذاكرة SRAM السريعة المدمجة بالشريحة",
      "لأن الـ Softmax التقليدية تنتج أرقاماً مركبة خيالية في بايثون",
      "لتقليل عدد المعاملات الإجمالية للنموذج بنسبة 50%",
      "لإلغاء الحاجة لتقسيم البيانات إلى دُفعات (Batches)"
    ],
    correctIndex: 0,
    explanation: "مصفوفة الانتباه N×N تتطلب مساحة O(N^2). لسياق 64K توكن، تتطلب مصفوفة الانتباه وحدها مئات الجيجابايت. عبر Online Softmax و Tiling، يتم استهلاك فقط O(N) من الذاكرة وتظل المصفوفات المؤقتة في SRAM، مما يرفع سرعة الحساب بمقدار 2× إلى 4× ويلغي اختناق الذاكرة الترددي.",
    difficulty: "Hard"
  },
  {
    id: "defense-q3",
    category: "Inference & KV Cache",
    question: "ما المعادلة الدقيقة لحجم ذاكرة KV Cache بالبايت في معمارية Grouped-Query Attention (GQA) لتوليد تسلسل بطول S مع دفعة B لنموذج بعدد طبقات L ورؤوس KV تساوي H_kv وحجم رأس D_head بنوع بيانات FP16؟",
    options: [
      "2 × 2 × L × H_kv × D_head × S × B",
      "4 × L × H_kv × S × B / D_head",
      "L × S × B × 16",
      "2 × L × D_head × S"
    ],
    correctIndex: 0,
    explanation: "نخزن كلا من Key و Value (عامل 2)، وكل عنصر في FP16 يستهلك 2 بايت (عامل 2). بالتالي الحجم الدقيق = 4 × L × H_kv × D_head × S × B بايت. وجود H_kv أصغر بكثير من رؤوس الاستعلام H_q في GQA يقلص هذه القيمة بنسبة 4× إلى 8× مقارنة بـ MHA.",
    difficulty: "Hard"
  },
  {
    id: "defense-q4",
    category: "Mixture of Experts",
    question: "في نموذج MoE مثل Mixtral 8x7B، إذا تم توجيه توكن معين إلى خبيرين (Top-2 Routing)، كيف تصاغ دالة المخرجات النهائية للطبقة الرياضية؟",
    options: [
      "y = ∑_{i ∈ Top2} [ Softmax(Top2(H(x)))_i × E_i(x) ] حيث E_i هو ناتج الخبير و H(x) دالة التوجيه الخطي",
      "y = E_1(x) + E_2(x) بدون أي معاملات ترجيح",
      "y = max(E_1(x), E_2(x)) عنصر بعنصر",
      "y = E_1(E_2(x)) متتالية خطية"
    ],
    correctIndex: 0,
    explanation: "المعادلة الرسمية لـ Sparse MoE تعتمد على أخذ ناتج دالة التوجيه H(x) = W_g * x، اختيار أعلى خبيرين، تطبيق Softmax على هذين الخبيرين فقط لإعادة المعايرة (Normalized Gating Weights)، ثم حساب المجموع المرجح لمخرجاتهما.",
    difficulty: "Hard"
  },
  {
    id: "defense-q5",
    category: "Distributed Training",
    question: "في تقنية تجزئة البيانات FSDP (Fully Sharded Data Parallel) و ZeRO-3، ما هي عملية الاتصال الجماعية (Collective Communication Primitive) التي يتم استدعاؤها في بداية التمريرة الأمامية (Forward) لكل طبقة لجلب أوزانها؟",
    options: [
      "All-Gather (لجمع أوزان الطبقة الموزعة عبر الكروت لإعادة بنائها محلياً مؤقتاً)",
      "Reduce-Scatter",
      "All-to-All",
      "Broadcast أحادي الاتجاه"
    ],
    correctIndex: 0,
    explanation: "في ZeRO-3 و FSDP، أوزان كل طبقة تكون مجزأة بنسبة 1/N عبر الكروت. عند وصول الحساب لتلك الطبقة، ينفذ الكرت All-Gather لجلب قطع الأوزان من بقية الكروت، يجري الحساب الأمامي، ثم يحذف الأوزان فوراً لتحرير الذاكرة للطبقة التالية.",
    difficulty: "Hard"
  },
  {
    id: "defense-q6",
    category: "Architecture & Positional Embeddings",
    question: "في تقنية RoPE (Rotary Position Embeddings)، لماذا يُفضل تعديل التردد الأساسي Base Frequency (مثلاً رفعه من 10,000 إلى 500,000 كما في Llama 3) عند تدريب النماذج على سياقات طويلة (128K)؟",
    options: [
      "لتقليل سرعة دوران المتجهات في الأبعاد ذات التردد العالي وتوسيع الطول الموجي للأبعاد المنخفضة لمنع تداخل الزوايا والارتباك الرياضي في المواقع البعيدة",
      "لزيادة سرعة التبريد في رقاقات GPU",
      "لأن الأرقام الأكبر من 10,000 لا تدعمها لغة بايثون",
      "لتقليل حجم الذاكرة المستهلكة في طبقة Embedding"
    ],
    correctIndex: 0,
    explanation: "في RoPE، التردد θ_i = base^(-2i/d). عند زيادة طول السياق دون تعديل base، فإن الأبعاد الأبطأ دوراناً تكمل دورات كاملة وتتداخل الزوايا مما يفقد النموذج القدرة على التمييز النسبي. رفع قيمة base يمدد الأطوال الموجية ويسمح بتمثيل إحداثي فريد عبر 128 ألف توكن.",
    difficulty: "Hard"
  },
  {
    id: "defense-q7",
    category: "Alignment & RLHF",
    question: "في اشتقاق خوارزمية Direct Preference Optimization (DPO)، ما الذي أتاح للباحثين استبدال دالة المكافأة المجهولة r(x, y) بنسبة لوغاريتم الاحتماليات (Log-Ratio) مباشرة؟",
    options: [
      "الحل الدقيق لمعادلة الـ Optimal Policy المقيدة بـ KL-Divergence تحت نموذج تفضيلات Bradley-Terry: π*(y|x) ∝ π_ref(y|x) exp(r(x,y)/β)",
      "الاستغناء عن الرياضيات واستخدام خوارزمية بحث عشوائي",
      "استبدال دالة الخسارة بـ Mean Squared Error الكلاسيكية",
      "استخدام نموذج تم تدريبه مسبقاً على ترجمة اللغات"
    ],
    correctIndex: 0,
    explanation: "من خلال الحل الرياضي لمعادلة استمثال RL المقيدة بـ KL Divergence، نحصل على العلاقة المغلقة: r(x, y) = β log(π_θ(y|x) / π_ref(y|x)) + β log Z(x). وبالتعويض في دالة احتمالية التفضيل لـ Bradley-Terry، يتم إلغاء دالة التجزئة Z(x) تماماً، مما يتيح صياغة الخسارة مباشرة كـ Binary Cross-Entropy على احتمالات النموذج نفسه.",
    difficulty: "Hard"
  },
  {
    id: "defense-q8",
    category: "Distributed Scaling",
    question: "ما الفرق التقني الحاسم بين Tensor Parallelism (TP) و Pipeline Parallelism (PP) في تدريب النماذج العملاقة على مئات الكروت؟",
    options: [
      "TP تقسم المصفوفات داخل الطبقة الواحدة وتتطلب اتصالاً فائق السرعة عبر NVLink داخل العقدة الواحدة (High Bandwidth / Low Latency)، بينما PP تقسم الطبقات المتتالية عبر العقد ويمكن تمرير التنشيطات عبر شبكات InfiniBand العادية مع فقاعة جدولة (Bubble Overhead)",
      "TP تعمل فقط على المعالجات المركزية CPU و PP تعمل على GPU",
      "PP لا تستهلك أي ذاكرة على الإطلاق",
      "كلاهما متطابقان تماماً ولا يوجد أي فرق في طبولوجيا الشبكة"
    ],
    correctIndex: 0,
    explanation: "التوازي التنسوري (Megatron-LM) يقتضي All-Reduce متزامن مرتين في كل طبقة، وهو ما يدمر الأداء إذا جرى عبر كابلات بين الخوادم ذات Latency عالية. لذلك يُحصر TP في نطاق 8 كروت داخل السيرفر الواحد بـ NVLink، بينما يُستخدم PP أو DP بين السيرفرات المتعددة عبر الشبكة.",
    difficulty: "Hard"
  },
  {
    id: "defense-q9",
    category: "Serving & vLLM",
    question: "عند تشغيل نموذج لغوي باستخدام محرك vLLM بنظام PagedAttention، ماذا يحدث عندما تمتلئ ذاكرة الـ GPU بالكامل ولا يتبقى أي كتل فارغة (Block Tables) لطلبات التوليد المستمرة؟",
    options: [
      "يقوم المحرك بعمل تعليق مؤقت (Preemption) لبعض الطلبات إما بترحيل كتلها (Swapping) إلى ذاكرة الـ CPU أو بإعادة حسابها (Recomputation) لاحقاً دون التسبب في انهيار الخادم بـ OOM",
      "ينهار الخادم فوراً بخطأ CUDA Out Of Memory ويتوقف عن العمل",
      "يقوم النظام بحذف النموذج من كارت الشاشة",
      "يتم تقليص حجم أوزان النموذج تلقائياً إلى 1-bit"
    ],
    correctIndex: 0,
    explanation: "vLLM يمتلك نظام Preemption مستوحى من أنظمة التشغيل (OS Virtual Memory). إذا نفدت كتل الذاكرة الفيزيائية، يختار الطلبات الأقل أولوية ويقوم بترحيل كتل KV الخاصة بها إلى RAM الخادم (CPU Swap) أو يفرغها ليعيد حسابها في خطوة واحدة (Recompute) بمجرد فراغ الموارد.",
    difficulty: "Hard"
  },
  {
    id: "defense-q10",
    category: "Quantization",
    question: "في تكميم النماذج باستخدام AWQ (Activation-aware Weight Quantization) إلى 4-bit، كيف يتم حماية الأوزان الحرجة دون تخزينها في صيغة FP16 منفصلة؟",
    options: [
      "عن طريق تطبيق تحويل تكافؤ رياضي مقياسي (Per-channel Scaling Transformation): W' = W × S و X' = X / S بحيث تظل النتيجة W'X' متطابقة بينما تقل الأخطاء الناتجة عن التكميم في الأوزان الحساسة",
      "بإخفاء الأوزان في ملف مضغوط بكلمة سر",
      "بتقليل دقة الأرقام إلى الصفر تماماً",
      "بإضافة ضوضاء بيضاء عشوائية للأوزان"
    ],
    correctIndex: 0,
    explanation: "المعادلة الأساسية لـ AWQ هي: WX = (W * S) * (S^-1 * X). من خلال إيجاد مصفوفة المقاييس المثالية S بناءً على توزيع التنشيطات البارزة، يتم تكبير الأوزان الحساسة قبل التكميم لتقليل خطأ التقريب الرياضي إلى أدنى حد ممكن، ثم دمج S^-1 في الطبقة السابقة دون أي زيادة في المعاملات.",
    difficulty: "Hard"
  },
  {
    id: "defense-q11",
    category: "Memory Optimization",
    question: "لماذا يؤدي استخدام تقنية تقطيع التنشيطات (Activation Checkpointing / Gradient Checkpointing) إلى توفير ما يصل إلى 75% من ذاكرة VRAM أثناء التدريب، وما هي التكلفة الحسابية المقابلة؟",
    options: [
      "لأنها تحذف تنشيطات الطبقات الوسيطة أثناء التمريرة الأمامية وتحتفظ فقط بنقاط التفتيش، ثم تعيد حساب التنشيطات عند التمريرة الخلفية بتكلفة زيادة ~33% في زمن الحسابات (Compute FLOPs)",
      "لأنها تحذف أوزان الموديل وتجعل التدريب يتم على بطاقات ذاكرة رخيصة بتكلفة 50% وقت إضافي",
      "لأنها تضغط البيانات باستخدام خوارزمية JPEG",
      "لأنها تلغي التمريرة الخلفية (Backward Pass) تماماً"
    ],
    correctIndex: 0,
    explanation: "في التدريب التقليدي، تُخزن كافة التنشيطات الوسيطة في الذاكرة لحساب التدرجات في الـ Backward. مع Gradient Checkpointing، يتم تخزين مخرجات كل طبقة رئيسية فقط، وتُعاد الحسابات للأجزاء الداخلية أثناء الرجوع، مما يبادل ذاكرة VRAM الضخمة بـ ~33% فقط من العمليات الحسابية الإضافية.",
    difficulty: "Hard"
  },
  {
    id: "defense-q12",
    category: "CUDA & Systems",
    question: "في مكتبة PyTorch، عند ظهور خطأ 'CUDA Out of Memory: tried to allocate 2.00 GiB (GPU 0; 23.69 GiB total capacity; 18.20 GiB already allocated; 1.40 GiB free; 4.09 GiB reserved by PyTorch)'، ما السبب الأرجح لعدم قدرة PyTorch على توفير الـ 2 جيجابايت رغم وجود 5.49 جيجابايت غير مخصصة؟",
    options: [
      "تجزئة الذاكرة في مدير الحصص (Memory Fragmentation in Caching Allocator) حيث الذاكرة المحجوزة مقسمة إلى أجزاء غير متصلة (Non-contiguous Blocks) أصغر من 2 جيجابايت متصلة",
      "عطل فيزيائي في اللوحة الأم لجهاز الكمبيوتر",
      "امتلاء مساحة القرص الصلب لنظام التشغيل Linux",
      "أن كارت الشاشة يعمل بتردد كهربائي خاطئ"
    ],
    correctIndex: 0,
    explanation: "الذاكرة المحجوزة في الـ Caching Allocator تنقسم إلى كتل متفرقة بسبب عمليات الحجز والتحرير المتتالية لتنسورات مختلفة الأحجام. إذا طلبت كتلة متصلة بحجم 2 GiB ولم تجد مساحة متصلة واحدة بتلك السعة، يفشل الحجز رغم أن مجموع الفراغات المتفرقة يتجاوز المطلوب. الحل هو ضبط max_split_size_mb أو استخدام تفريغ الكاش.",
    difficulty: "Hard"
  },
  {
    id: "defense-q13",
    category: "Numerical Precision",
    question: "ما الفرق الأساسي بين صيغتي الأرقام العائمة FP16 و BF16 (Bfloat16)، ولماذا اعتمدتها Google و OpenAI و Meta كمعيار موحد في تدريب نماذج LLM الكبرى؟",
    options: [
      "BF16 تحتفظ بـ 8 bits للأس (Exponent) تماماً مثل FP32 مما يمنحها نفس المدى الديناميكي الهائل ويلغي مشاكل تلاشي وانفجار التدرجات والحاجة لـ Dynamic Loss Scaling المطلوبة في FP16",
      "BF16 تستهلك 1 بايت فقط بينما FP16 تستهلك 2 بايت",
      "FP16 لا يمكن تشغيلها على كروت NVIDIA",
      "BF16 تعمل فقط على نصوص اللغة العربية"
    ],
    correctIndex: 0,
    explanation: "FP16 تخصص 5 bits للأس و 10 للكسر (نطاق ديناميكي ضيق جداً يسبب Underflow للتدرجات مالم يستخدم Loss Scaling معقد). BF16 خصصت 8 bits للأس و 7 للكسر، مما يوفر نفس المدى الرقمي لـ FP32 (حتى 10^38) مما يضمن ثباتاً مطلقاً في استقرار تدريب الشبكات العميقة دون أي انهيار عددي.",
    difficulty: "Hard"
  },
  {
    id: "defense-q14",
    category: "RAG & Retrieval",
    question: "في أنظمة استرجاع المعلومات RAG، ما هو مبدأ عمل خوارزمية Reciprocal Rank Fusion (RRF) عند دمج نتائج البحث النصي الكلاسيكي (BM25) مع البحث الشعاعي الدلالي (Dense Vector Search)؟",
    options: [
      "حساب وزن دمج يعتمد على مقلوب رتبة الوثيقة في القوائم المسترجعة: Score(d) = ∑_{m} [ 1 / (k + Rank_m(d)) ] لتفادي مشاكل عدم توافق مقاييس الدرجات الخام (Scores Calibration)",
      "ضرب الدرجات الخام لـ BM25 في المتجهات وقسمتها على 100",
      "اختيار الوثائق التي تظهر في البحث النصي فقط وحذف نتائج الفيكتور",
      "حساب المتوسط الحسابي العادي للأرقام الخام"
    ],
    correctIndex: 0,
    explanation: "البحث بالـ Vector ينتج درجات Cosine Similarity بين 0 و 1، بينما BM25 ينتج درجات غير مقيدة قد تصل لمئات. دمج الدرجات الخام مباشرة مستحيل بدون معايرة صعبة. RRF تتجاوز المشكلة بالاعتماد فقط على الرتبة (Rank) في كل قائمة، محققة أفضل أداء هجين (Hybrid Search) مستقر.",
    difficulty: "Hard"
  },
  {
    id: "defense-q15",
    category: "Transformer Architecture",
    question: "في معمارية المحولات السببية، لماذا يُفضل استخدام دالة المعايرة RMSNorm بدلاً من Batch Normalization الكلاسيكية؟",
    options: [
      "لأن BatchNorm تعتمد على إحصائيات الدفعة (Batch Statistics) مما يجعلها غير صالحة في مرحلة الاستدلال التوليدي المستقل (Batch Size = 1) وتعاني من التغير الحاد مع الأطوال المتفاوتة للسياق",
      "لأن RMSNorm مجانية بينما BatchNorm تحتاج لاشتراك مدفوع",
      "لأن BatchNorm تعمل فقط على الصور ولا تعمل أبداً في البرمجة",
      "لأن RMSNorm تزيد من حجم النموذج 10 أضعاف"
    ],
    correctIndex: 0,
    explanation: "BatchNorm تفشل كارثياً في معالجة اللغات الطبيعية بسبب تباين أطوال الجمل واختلاف التوزيعات بين عينات الدفعة، فضلاً عن انهيارها في التوليد الآني الفردي لتوكن واحد (Batch=1). LayerNorm و RMSNorm تعايران عبر أبعاد التضمين لكل عينة بشكل مستقل تماماً عن بقية الدفعة.",
    difficulty: "Medium"
  },
  {
    id: "defense-q16",
    category: "CUDA Architecture",
    question: "في بنية كودا (CUDA Programming Model)، ما هي وحدة التنفيذ المتزامنة الدنيا التي يطلق عليها اسم 'Warp'، وما هو عدد الخيوط البرمجية (Threads) فيها داخل بطاقات NVIDIA؟",
    options: [
      "مجموعة من 32 خيطاً برمجياً تنفذ نفس التعليمة في وقت واحد وفق معمارية SIMT (Single Instruction, Multiple Threads)",
      "مجموعة من 1024 خيطاً برمجياً تعمل بالتوالي",
      "شريحة فيزيائية إضافية توضع بجانب المعالج",
      "برنامج تشغيل في نظام Windows"
    ],
    correctIndex: 0,
    explanation: "الـ Warp هو الوحدة الأساسية لجدولة وتنفيذ الأوامر في معالجات NVIDIA GPU، ويتكون حصراً من 32 خيطاً متزامناً (32 Threads). إذا تفرعت الشروط البرمجية (if/else) داخل نفس الـ Warp، يحدث ما يسمى بـ Warp Divergence حيث تنفذ المسارات بالتسلسل مما يهدر طاقة المعالجة.",
    difficulty: "Hard"
  },
  {
    id: "defense-q17",
    category: "Alignment & RLHF",
    question: "ما المقصود بظاهرة 'Reward Hacking' في تدريب النماذج اللغوية عبر التعلم المعزز RLHF؟",
    options: [
      "استغلال النموذج لثغرات في نموذج المكافأة (Reward Model) للحصول على درجات تقييم فائقة عبر إنتاج إجابات طويلة بشكل مصطنع أو مجاملة مفرطة بدلاً من تقديم إجابة دقيقة وصحيحة",
      "قيام هاكرز باختراق خوادم الشركة وسرقة أوزان النموذج",
      "انخفاض دقة النموذج بسبب انقطاع الإنترنت أثناء التدريب",
      "توقف النموذج عن الإجابة وإصدار رسائل خطأ برمجية"
    ],
    correctIndex: 0,
    explanation: "Reward Hacking يمثل ظاهرة قانون Goodhart: عندما يصبح المقياس هدفاً، يتوقف عن كونه مقياساً جيداً. يكتشف النموذج أن نموذج المكافأة يميل لتفضيل الإجابات الأطول أو المنسقة بنقاط كثيرة، فيبدأ بتوليد نصوص طويلة جوفاء لكسب أعلى مكافأة متجاهلاً الصحة الحقيقية.",
    difficulty: "Hard"
  },
  {
    id: "defense-q18",
    category: "Transformer Architecture",
    question: "في نموذج Transformer يمتلك d_model = 4096، وعدد رؤوس انتباه H = 32، ما هي أبعاد كل من مصفوفة الإسقاط W_q ومصفوفة الخرج W_o في رأس الانتباه الواحد وفي الطبقة بالكامل؟",
    options: [
      "حجم رأس الانتباه d_k = 128، وكل مصفوفة طبقة كاملة (W_q, W_k, W_v, W_o) تكون بأبعاد [4096 × 4096]",
      "d_k = 4096 وكل مصفوفة بحجم [32 × 32]",
      "d_k = 64 والمصفوفات بحجم [1024 × 1024]",
      "d_k = 256 والمصفوفات بحجم [2048 × 2048]"
    ],
    correctIndex: 0,
    explanation: "حجم بعد الرأس = d_model / H = 4096 / 32 = 128. لكل رأس W_q^i بأبعاد [4096 × 128]. وبدمج الـ 32 رأساً معاً، تصبح مصفوفة الإسقاط المجمعة للطبقة بالكامل [4096 × 4096]، وكذلك مصفوفة الخرج W_o بأبعاد [4096 × 4096].",
    difficulty: "Hard"
  },
  {
    id: "defense-q19",
    category: "Serving & Latency",
    question: "ما المعنى الدقيق لمصطلح 'Time To First Token' (TTFT) مقابل 'Inter-Token Latency' (ITL) في قياس أداء نشر نماذج الذكاء الاصطناعي؟",
    options: [
      "TTFT هو الزمن المستغرق لمعالجة البرومبت بالكامل (Prefill Phase) وإخراج أول حرف، بينما ITL هو الزمن المستغرق بين توليد كل توكن تالٍ والتوكن الذي يليه (Decoding Phase)",
      "TTFT خاص بنماذج الصور و ITL خاص بنماذج النصوص فقط",
      "TTFT يقيس زمن تنزيل النموذج من الإنترنت و ITL يقيس زمن تشغيل السيرفر",
      "كلاهما يعنيان نفس الشيء ولا يوجد أي فارق في أسلوب القياس"
    ],
    correctIndex: 0,
    explanation: "في أنظمة الإنتاج: مرحلة الـ Prefill تحسب مصفوفات الانتباه لجميع توكنات السؤال بالتوازي وهي مكثفة حسابياً (Compute-bound) وتحدد TTFT. مرحلة الـ Decoding تولد توكن توكن وهي محدودة بنطاق الذاكرة (Memory-bandwidth bound) وتحدد ITL.",
    difficulty: "Medium"
  },
  {
    id: "defense-q20",
    category: "Optimization & Gradients",
    question: "في تدريب الشبكات العصبية، ما هي ميزة دمج مصفوفات التدرجات في الـ Gradient Accumulation؟",
    options: [
      "محاكاة حجم دفعة تدريبية عملاق (Large Effective Batch Size) بتجميع التدرجات عبر عدة خطوات تمريرة صغيرة قبل استدعاء `optimizer.step()` دون زيادة استهلاك ذاكرة الـ VRAM",
      "مضاعفة استهلاك ذاكرة الكارت بمقدار 10 أضعاف في كل خطوة",
      "حذف التدرجات الخاطئة تلقائياً من الذاكرة",
      "تسريع التدريب بنسبة 1000% عبر إلغاء الـ Backpropagation"
    ],
    correctIndex: 0,
    explanation: "إذا كان حجم الدفعة المثالي هو 1024 ولكن كارت الشاشة لا يتسع إلا لـ 16 عينة فقط، يقوم المهندس بضبط batch=16 وتراكم التدرجات على مدار 64 تكراراً (16×64 = 1024)، ثم يطبق خطوة التحسين مرة واحدة، محققاً نفس الخصائص الإحصائية للدفعة الكبيرة بميزانية ذاكرة منخفضة.",
    difficulty: "Medium"
  },
  {
    id: "defense-q21",
    category: "Quantization",
    question: "في هيكل تكميم الأوزان GPTQ، ما المبرر الرياضي لاعتماد عكس مصفوفة الهيسيان H^-1 في تحديد الأوزان المراد تعديلها؟",
    options: [
      "لأنه طبقاً لتقريب تايلور من الدرجة الثانية لدالة الخسارة (Taylor Expansion)، فإن تعويض خطأ تكميم الوزن w_q يتم بضبط بقية الأوزان w_F بمقدار: Δw_F = - (w_q - ŵ_q) / [H^-1]_qq × H^-1_{:, q}",
      "لأن مصفوفة الهيسيان مجرد مصفوفة عشوائية يسهل حذفها",
      "لتحويل النموذج إلى كود بلغة جافاسكريبت",
      "لأن عكس المصفوفة لا يتطلب أي عمليات حسابية"
    ],
    correctIndex: 0,
    explanation: "GPTQ تعتمد على ورقة Optimal Brain Surgeon الكلاسيكية: عند تقريب وزن معين إلى أقرب قيمة صحيحة، يتولد خطأ في الخسارة، ولكن يمكن امتصاص هذا الخطأ بالكامل وإلغاؤه عن طريق إزاحة الأوزان المتبقية غير المكممة في الاتجاه المعاكس الموجه بانحناء مصفوفة الهيسيان.",
    difficulty: "Hard"
  },
  {
    id: "defense-q22",
    category: "Multimodal Models",
    question: "ما هو الدور الجوهري لطبقة Vision Resampler / Cross-Attention في النماذج متعددة الوسائط (Vision-Language Models مثل Flamingo و LLaVA)؟",
    options: [
      "ضغط وتوفيق آلاف رقع الصور (Image Patches) من مخرجات Vision Encoder (مثل CLIP/SigLIP) إلى عدد محدود وثابت من التوكنات المتوافقة في الأبعاد مع فضاء التضمين للنموذج اللغوي",
      "حذف الألوان من الصور لتسريع المعالجة",
      "تحويل الصور إلى ملفات PDF",
      "توليد رسوم متحركة من النصوص"
    ],
    correctIndex: 0,
    explanation: "معالج الصور البصري ينتج مئات أو آلاف التوكنات لكل صورة (مثلاً 576 توكن)، وتمريرها مباشرة للـ LLM يستهلك نافذة السياق ويهدر الموارد. تقوم مكونات مثل Perceiver Resampler أو MLP Projection بمحاذاة وضغط هذه الميزات في فضاء أبعاد النموذج اللغوي لاستيعابها كأنها توكنات نصية.",
    difficulty: "Hard"
  },
  {
    id: "defense-q23",
    category: "Pre-training Metrics",
    question: "لماذا يُعتبر مقياس Perplexity (PPL) معياراً قياسياً لجودة النماذج اللغوية في مرحلة ما قبل التدريب (Pre-training)، وما علاقته بدالة Cross-Entropy Loss؟",
    options: [
      "الـ Perplexity تساوي رياضياً دالة الأس الطبيعي لدالة الخسارة: PPL = exp(Cross-Entropy Loss)، وتمثل متوسط عدد الخيارات التي يحتار بينها النموذج عند توقع التوكن التالي",
      "الـ Perplexity تقيس سرعة الموديل بعدد التوكنات في الثانية",
      "الـ Perplexity تقيس حجم الموديل بالميجابايت",
      "لا توجد أي علاقة رياضية بين Perplexity و Cross-Entropy"
    ],
    correctIndex: 0,
    explanation: "إذا كانت دالة الخسارة Cross-Entropy تساوي L، فإن الحيرة PPL = e^L. إذا كانت PPL تساوي 10، فهذا يعني رياضياً أن النموذج محتار بين 10 كلمات متكافئة الاحتمال. كلما انخفضت PPL، كان النموذج أكثر ثقة ودقة في توقع النص التالي.",
    difficulty: "Medium"
  },
  {
    id: "defense-q24",
    category: "Transformer Parameter Distribution",
    question: "في نموذج Transformer عملاق (مثل Llama 3 405B)، كم تبلغ نسبة المعاملات الموجودة في طبقات Feed-Forward (MLP) مقارنة بطبقات Attention في البلوك الواحد؟",
    options: [
      "طبقات الـ MLP تستحوذ على حوالي ثلثي المعاملات (~67%) بينما Attention تستحوذ على الثلث تقريباً (~33%)، وتصل إلى أكثر من 85% في نماذج MoE",
      "Attention تستحوذ على 99% من المعاملات",
      "كلاهما متطابق بنسبة 50% إلى 50% دائماً",
      "MLP تحتوي على 5% فقط من المعاملات"
    ],
    correctIndex: 0,
    explanation: "في Transformers القياسية مع SwiGLU: طبقة Attention تمتلك 4 مصفوفات بحجم d_model^2 (مع GQA تكون أقل). أما طبقة SwiGLU MLP فتمتلك 3 مصفوفات أبعادها d_model × (8/3 d_model)، أي ما يعادل 8 مصفوفات d_model^2، مما يجعل طبقات MLP تخزن أكثر من ثلثي المعرفة والمعاملات بالكامل.",
    difficulty: "Hard"
  },
  {
    id: "defense-q25",
    category: "Training Stability",
    question: "ما الاستراتيجية المثلى للتعامل مع مشكلة 'Loss Spike' المفاجئ (الارتفاع الكارثي في دالة الخسارة) أثناء تدريب نموذج ضخم بعد أسابيع من التدريب المستمر؟",
    options: [
      "إرجاع التدريب إلى أحدث نقطة تفتيش (Checkpoint) قبل القفزة بـ 100-200 خطوة، استبعاد أو تنظيف حزمة البيانات (Data Batch) التي تسببت في الصدمة، وتخفيض معدل التعلم أو زيادة Gradient Clipping ثم الاستئناف",
      "حذف النموذج بالكامل والبدء من الصفر من اليوم الأول",
      "تجاهل القفزة ومواصلة التدريب لأن النموذج سيصلح نفسه بنفسه تلقائياً",
      "إغلاق السيرفر والتوقف عن التدريب نهائياً"
    ],
    correctIndex: 0,
    explanation: "القفزات المفاجئة (Loss Spikes) في تدريب النماذج الضخمة تنتج عادة عن عينات بيانات شاذة ملوثة تسبب تدرجات متطرفة تدمر إحصائيات Adam. الحل الهندسي المعتمد هو الرجوع لبضع مئات من الخطوات واستبعاد شريحة البيانات المسببة وتطبيق Gradient Clipping صارم لاستئناف التدريب بنجاح.",
    difficulty: "Hard"
  },
  {
    id: "defense-q26",
    category: "Inference Acceleration",
    question: "في تقنية Speculative Decoding، كيف يتم التحقق من صحة K توكن تم توليدها بواسطة نموذج صغير مسود (Draft Model) باستخدام النموذج الأصلي العملاق (Target Model)؟",
    options: [
      "تمرير جميع التوكنات الـ K دفعة واحدة بالتوازي في خطوة Forward واحدة للنموذج العملاق وتطبيق خوارزمية قبول احتمالية (Modified Rejection Sampling) تضمن تطابق التوزيع الإحصائي بدقة 100%",
      "إعادة توليد التوكنات توكن توكن بالتتابع مما يلغي فائدة السرعة",
      "مقارنة النصوص باستخدام دالة Levenshtein Distance لحذف الكلمات غير المتطابقة",
      "الاعتماد على افتراض صحة النموذج الصغير بنسبة 100% دون أي تحقق"
    ],
    correctIndex: 0,
    explanation: "الميزة الرياضية العبقرية لـ Speculative Decoding هي أن النموذج العملاق Target Model يمكنه فحص وتقييم K توكن في خطوة تمريرة واحدة فقط (Parallel Scoring) لأن الـ Prefill سريع جداً، ثم يقرر عبر Modified Rejection Sampling عدد التوكنات المقبولة دون أي انحراف عن توزيع احتمالات النموذج الأصلي.",
    difficulty: "Hard"
  },
  {
    id: "defense-q27",
    category: "CUDA Hardware & Cores",
    question: "ما الفرق المعماري الدقيق في معالجات NVIDIA بين أنوية CUDA Cores القياسية وأنوية Tensor Cores؟",
    options: [
      "CUDA Cores تنفذ عملية حسابية فردية (Scalar FMA: a*b + c) لكل دورة ساعة، بينما Tensor Cores تنفذ عمليات ضرب مصفوفات صغيرة كاملة (Matrix Multiply-Accumulate: D = A*B + C لمصفوفات 16×16 أو 8×8) في دورة ساعة واحدة",
      "Tensor Cores مخصصة لتصفح الويب فقط",
      "CUDA Cores تعمل فقط على لغة جافا",
      "Tensor Cores لا تدعم إلا العمليات الحسابية للأعداد الصحيحة 8-bit فقط"
    ],
    correctIndex: 0,
    explanation: "أنوية Tensor Cores صُممت خصيصاً كمعالجات مصفوفات مدمجة (Systolic Arrays / Matrix Cores). في حين تنفذ نواة CUDA عملية ضرب-وجمع واحدة، تبتلع Tensor Core شريحة مصفوفات (مثلاً FP16 بحجم 16×16) وتنتج ناتج الضرب التراكمي في دورة واحدة، محققة تسارعاً يفوق 5× إلى 16× في عمليات GEMM.",
    difficulty: "Hard"
  },
  {
    id: "defense-q28",
    category: "Distributed Networking",
    question: "في شبكات مراكز البيانات الضخمة المخصصة لتدريب نماذج الذكاء الاصطناعي، لماذا يُعتبر بروتوكول RoCEv2 (RDMA over Converged Ethernet) أو InfiniBand شرطاً إلزامياً بدلاً من شبكات TCP/IP التقليدية؟",
    options: [
      "لتفعيل النقل المباشر للذاكرة عن بُعد (Kernel Bypass & Zero-Copy RDMA) دون تدخل الـ CPU ونظام التشغيل، مما يقلص زمن استجابة الاتصال (Latency) من ميكروثوانٍ عالية إلى أجزاء من الميكروثانية ويوفر نطاقاً ترددياً يصل إلى 800Gbps",
      "لأن كابلات TCP/IP تنقطع إذا زادت حرارة الخادم عن 30 درجة",
      "لأن بروتوكول TCP/IP لا يدعم إرسال النصوص باللغة العربية",
      "لأن الـ InfiniBand يمنع انقطاع التيار الكهربائي عن الخوادم"
    ],
    correctIndex: 0,
    explanation: "في تدريب النماذج الموزعة، عمليات All-Reduce تنقل تيرابايتات من التدرجات كل ثانية. شبكات TCP التقليدية تستهلك زمن معالجة عالي في الـ Kernel وتحتاج لنسخ البيانات عدة مرات عبر RAM و CPU (Context Switches). الـ RDMA ينقل البيانات مباشرة من كارت GPU عبر بطاقة الشبكة إلى GPU الخادم الآخر فوراً.",
    difficulty: "Hard"
  },
  {
    id: "defense-q29",
    category: "Kernel Compilers",
    question: "ما هي الميزة الثورية التي تقدمها لغة OpenAI Triton لمطوري الذكاء الاصطناعي مقارنة بكتابة نوى CUDA C++ الخام من الصفر؟",
    options: [
      "تسمح بكتابة خوارزميات برمجية بلغة بايثون على مستوى كتل المصفوفات (Block-level Programming) ويتولى الـ Compiler تلقائياً جدولة العمليات وإدارة الذاكرة المشتركة Shared Memory ومنع تضارب البنوك (Bank Conflicts) وتوليد كود PTX عالي الكفاءة ينافس الخبراء",
      "تحول كود بايثون إلى تطبيقات للهواتف الذكية بنقرة واحدة",
      "تقوم بتدريب النماذج اللغوية بدون الحاجة لأي كروت شاشة",
      "تعتبر مجرد مكتبة رسوم بيانية مثل Matplotlib"
    ],
    correctIndex: 0,
    explanation: "كتابة كود CUDA C++ يدوي تقتضي التفكير على مستوى كل خيط Thread وحساب الـ Thread Synchronization و Shared Memory Coalescing و Bank Conflicts بدقة متناهية. لغة Triton تنقل المطور لمستوى التفكير في كتل البلوكات Block-level، ومترجم Triton JIT يقوم بتوليد تعليمات LLVM/PTX المثالية تلقائياً.",
    difficulty: "Hard"
  },
  {
    id: "defense-q30",
    category: "Fine-Tuning & PEFT",
    question: "في تقنية QLoRA (Quantized Low-Rank Adaptation)، ما هي الابتكارات الثلاثة المتزامنة التي مكّنت من ضبط نموذج 65B على كارت GPU فردي بذاكرة 48GB؟",
    options: [
      "نوع بيانات التكميم المبتكر NF4 (NormalFloat4)، والتكميم المزدوج (Double Quantization) لتقليل حجم مقاييس التكميم، وترحيل صفحات الذاكرة للـ CPU عند الامتلاء (Paged Optimizers)",
      "حذف نصف طبقات النموذج، وتدريبه على نصوص بدون علامات ترقيم، واستخدام دقة 1-bit",
      "تحويل النموذج إلى صيغة PDF، وتدريبه بدون تدرجات رياضية",
      "استبدال دالة التنشيط بـ Linear Regression"
    ],
    correctIndex: 0,
    explanation: "ابتكارات QLoRA الثلاثة هي: 1. NF4 الذي يعتمد على فرضية التوزيع الطبيعي لأوزان الشبكات العصبية. 2. Double Quantization لتكميم ثوابت المقاييس نفسها مما يوفر 0.37 بايت لكل معامل. 3. Paged Optimizers لمنع انهيار الـ VRAM عبر استعارة ذاكرة الـ RAM للـ Page Faults أثناء قمم التدرجات.",
    difficulty: "Hard"
  },
  {
    id: "defense-q31",
    category: "Inference Attention Variants",
    question: "في استدلال النماذج اللغوية على سياقات طويلة جداً (مثل 128K توكن)، لماذا تصبح مرحلة الـ Decoding بطيئة للغاية في FlashAttention التقليدية، وما الحل الذي تقدمه FlashDecoding؟",
    options: [
      "لأن طول الاستعلام Q يساوي 1 فقط (Batch=1)، فلا تستطيع FlashAttention ملء جميع وحدات SM في الـ GPU؛ والحل هو تقسيم بعد السياق K عبر كتل متعددة بالتوازي (Split-K) ثم دمج النتائج باختزال لوغاريتمي",
      "لأن الـ GPU يسخن ويتوقف عن العمل تلقائياً لحماية المكونات",
      "لأن بايثون لا تدعم المصفوفات التي يزيد طولها عن 1000 عنصر",
      "لأن FlashDecoding تقوم بحذف الكلمات القديمة من الذاكرة تماماً"
    ],
    correctIndex: 0,
    explanation: "في الـ Decoding، استعلامنا هو توكن واحد (Q_len = 1). FlashAttention الكلاسيكية تقسم العمل بالتوازي عبر Q. عند وجود توكن واحد، يعمل SM واحد فقط بينما تظل 80 وحدة SM أخرى خاملة! FlashDecoding تقوم بتجزئة الـ Key/Value بطول الـ 128K عبر جميع وحدات الـ SM بالتوازي وتجمع النتائج عبر Rescaling.",
    difficulty: "Hard"
  },
  {
    id: "defense-q32",
    category: "Reasoning & Deep Thinking",
    question: "في تدريب نماذج التفكير والاستدلال الرياضي العميق (مثل DeepSeek-R1 و OpenAI o1)، ما هو دور خوارزمية GRPO (Group Relative Policy Optimization) مقارنة بـ PPO التقليدية؟",
    options: [
      "الاستغناء الكامل عن تدريب نموذج ناقد منفصل (Value / Critic Model) بتقدير دالة الأساس (Baseline) عبر توليد مجموعة إجابات لنفس السؤال ومقارنة درجات مكافآتها بمتوسط المجموعة وتشتتها المعياري",
      "إلغاء الحاجة لبيانات التدريب والاعتماد على تخمين النموذج",
      "استبدال دالة الـ Softmax بالمتوسط الحسابي البسيط",
      "تسريع التدريب بنسبة 100% عبر إلغاء التمريرة الخلفية Backward"
    ],
    correctIndex: 0,
    explanation: "في PPO التقليدية، تحتاج لحجز نموذج ثانٍ بنفس حجم الـ LLM يسمى الـ Critic لحساب دالة القيمة V(s)، مما يستهلك ضعف ذاكرة الـ VRAM. خوارزمية GRPO تبتكر حل إحصائي: توليد مجموعة G من الإجابات لكل سؤال، وحساب ميزة كل إجابة A_i = (R_i - mean(R)) / std(R) بالنسبة للمجموعة دون الحاجة لأي Critic Model.",
    difficulty: "Hard"
  },
  {
    id: "defense-q33",
    category: "Model Merging",
    question: "في عمليات دمج النماذج اللغوية (Model Merging) دون تدريب إضافي، ما هي خوارزمية TIES-Merging وما وظيفتها الرياضية؟",
    options: [
      "معالجة التداخل والتضارب بين تدرجات المهام المختلفة عبر: تقليم المعاملات الأقل تأثيراً (Trim)، وحل تعارض الإشارات المتعاكسة (+/-) بتصويت الأغلبية (Elect Sign)، ثم دمج القيم التي اتفقت فقط (Disjoint Merge)",
      "ربط أسلاك المعالجات بحزام مطاطي لمنع الاهتزاز",
      "دمج النصوص عن طريق خلط الكلمات بالترتيب الأبجدي",
      "حفظ النماذج في ملف ZIP واحد واستدعائها معاً"
    ],
    correctIndex: 0,
    explanation: "دمج أوزان نموذجين مدربين على مهام مختلفة بالمتوسط العادي يسبب تدمير الأداء بسبب تضارب الاتجاهات (Interference). منهجية TIES: 1. Trim: حذف 80% من التغيرات الضئيلة. 2. Elect Sign: إذا كان النموذج A يرفع الوزن والنموذج B يخفضه، نعتمد إشارة الاتجاه الأقوى. 3. دمج التنسورات المتوافقة في الإشارة فقط.",
    difficulty: "Hard"
  },
  {
    id: "defense-q34",
    category: "Tokenizer Engineering",
    question: "لماذا انتقلت النماذج الحديثة (مثل GPT-4o و Llama 3) إلى استخدام قواميس توكنات ضخمة جداً (128K إلى 200K توكن) مقارنة بـ 32K في Llama 1؟",
    options: [
      "لتحسين كفاءة الضغط (Compression Ratio) للنصوص متعددة اللغات كالعربية والبرمجة، مما يقلص عدد التوكنات المطلوبة لتمثيل المعنى بنسبة 40% إلى 60% ويسرع زمن التوليد ويخفض تكلفة الاستدلال",
      "لأن الأرقام الأصغر من 100K تسبب أخطاء في الذاكرة العشوائية",
      "لزيادة حجم ملفات النموذج على القرص الصلب لبيعه بسعر أعلى",
      "لأن اللغات الأخرى لا يمكن تمثيلها إلا بحجم 200K توكن كحد أدنى"
    ],
    correctIndex: 0,
    explanation: "في القواميس الصغيرة (32K)، تُجزأ الكلمة العربية أو الأسطر البرمجية إلى 3 أو 4 توكنات مجزأة لكل كلمة (Byte-Fallback). رفع القاموس لـ 128K يمنح الكلمات والأنماط الشائعة توكناً واحداً كاملاً، مما يقلص طول التسلسل إلى النصف، ويضاعف سرعة القراءة والتوليد دون زيادة في معاملات Transformer.",
    difficulty: "Medium"
  },
  {
    id: "defense-q35",
    category: "Hardware & Roofline Model",
    question: "في نموذج السقف الحسابي (Roofline Model) لمعالجات الذكاء الاصطناعي، متى تُصنف عملية حوسبة معينة على أنها 'Memory-Bandwidth Bound' مقابل 'Compute-Bound'؟",
    options: [
      "تكون Memory-Bound إذا كانت الكثافة الحسابية (Arithmetic Intensity = FLOPs / Byte) أقل من النسبة الحرجة للشريحة، حيث يقضي المعالج معظم وقته في انتظار وصول البيانات من الذاكرة بدلاً من الحساب",
      "تكون Memory-Bound فقط إذا نفدت مساحة القرص الصلب لجهاز الكمبيوتر",
      "تكون Compute-Bound فقط عندما تنخفض سرعة الإنترنت في السيرفر",
      "كلا المصطلحين متطابقان ولا علاقة لهما بخصائص الشريحة"
    ],
    correctIndex: 0,
    explanation: "مفهوم الـ Roofline يعتمد على Arithmetic Intensity (عدد العمليات الحسابية لكل بايت منقول). بطاقة H100 تمتلك 3.35 TB/s نطاق ذاكرة و 2000 TFLOPs. النقطة الحرجة هي ~600 FLOPs/Byte. في مرحلة الـ Decoding بالـ LLM، نقرأ 2 بايت لكل وزن لنقوم بعمليتي ضرب-وجمع فقط (Intensity = 1)، مما يجعلها Memory-Bound بامتياز.",
    difficulty: "Hard"
  }
];

export const grandDefenseQuestions = grandDefenseQuestionBank;

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a randomized exam:
 * 1. Randomly picks GRAND_EXAM_TOTAL_QUESTIONS (25) questions from the massive bank.
 * 2. For each question, randomizes its 4 options and updates correctIndex dynamically.
 * 3. Guarantees that every exam attempt has unique questions in unique orders with randomized choices.
 */
export function generateRandomizedGrandDefenseExam(): ExamQuestionPoolItem[] {
  // Shuffle all questions in the bank
  const shuffledBank = shuffleArray(grandDefenseQuestionBank);
  
  // Pick the first 25 questions
  const selectedQuestions = shuffledBank.slice(0, GRAND_EXAM_TOTAL_QUESTIONS);

  // Randomize options for each selected question
  return selectedQuestions.map((q, qIndex) => {
    const correctOptionText = q.options[q.correctIndex];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

    return {
      ...q,
      id: `exam-instance-${qIndex}-${q.id}`,
      options: shuffledOptions,
      correctIndex: newCorrectIndex
    };
  });
}
