export interface BookChapter {
  id: string;
  chapterNumber: number;
  titleArabic: string;
  titleEnglish: string;
  summaryArabic: string;
  keyConcepts: string[];
  translatedExcerpt: string;
  practicalCodeSummary?: string;
}

export interface TranslatedBook {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  author: string;
  publisher: string;
  year: number;
  badge: string;
  coverGradient: string;
  rating: number;
  pages: number;
  descriptionArabic: string;
  whoShouldRead: string;
  chapters: BookChapter[];
  keyTakeaways: string[];
  pdfDownloadNote: string;
}

export const translatedBooks: TranslatedBook[] = [
  {
    id: "deep-learning-goodfellow",
    titleArabic: "التعلم العميق (الكتاب المرجعي الشامل)",
    titleEnglish: "Deep Learning (The AI Bible)",
    author: "د. إيان جودفيلو، يوشوا بنجيو، وآرون كوفيل (Ian Goodfellow, Yoshua Bengio, Aaron Courville)",
    publisher: "MIT Press",
    year: 2016,
    badge: "المرجع الأكاديمي الأول عالمياً",
    coverGradient: "from-blue-600 to-indigo-900",
    rating: 4.9,
    pages: 800,
    descriptionArabic: "يُعتبر هذا الكتاب بمثابة 'إنجيل الذكاء الاصطناعي' والمصدر المرجعي المعتمد في جامعات ستانفورد وMIT. يغطي الكتاب الأسس الرياضية الدقيقة من الجبر الخطي ونظرية الاحتمالات، انتقالاً إلى الشبكات العصبية العميقة، والانتشار الخلفي، وصولاً إلى النماذج التوليدية العميقة.",
    whoShouldRead: "كل مهندس يرغب في فهم الرياضيات الصارمة التي تقف خلف الأوزان وتحديثات التدرج والتعلم العميق.",
    keyTakeaways: [
      "فهم عميق لتحليل القيم المنفردة (SVD) والمتجهات الذاتية في ضغط الفضاءات المتجهية.",
      "تفكيك خوارزميات الاستمثال المتقدمة: Adam, RMSProp, و Momentum مع برهان تقاربها الرياضي.",
      "الاستيعاب الشامل لتقنيات التنظيم (Regularization) مثل Dropout و Weight Decay ومكافحة فرط التخصيص."
    ],
    pdfDownloadNote: "متاح للمطالعة الحرة المترجمة داخل المنصة وفق رخصة النشر الأكاديمي المفتوح.",
    chapters: [
      {
        id: "dl-ch1",
        chapterNumber: 1,
        titleArabic: "الجبر الخطي ونظم المعادلات للذكاء الاصطناعي",
        titleEnglish: "Linear Algebra for Deep Learning",
        summaryArabic: "شرح معمق لكيفية تمثيل البيانات والطبقات كمصفوفات ومتجهات، وحساب المحددات والمتجهات الذاتية Eigenvalues، ودورها في استقرار انتشار الإشارات عبر الشبكة العصبية.",
        keyConcepts: ["المصفوفات والمتجهات", "ضرب المصفوفات السريع", "تحليل المصفوفات Eigendecomposition", "معايير المتجهات Norms L1 & L2"],
        translatedExcerpt: "في التعلم العميق، لا نتعامل مع الأرقام المفردة بل مع حزم من البيانات المنظمة في فضاءات متعددة الأبعاد تُدعى 'الموترات' (Tensors). إن عملية التنبؤ داخل أي شبكة عصبية ليست سوى سلسلة من التحويلات الخطية متبوعة بدوال تنشيط غير خطية لإعادة تشكيل الفضاء المتجهي.",
        practicalCodeSummary: "# التحويل الخطي الأساسي لطبقة عصبية:\nimport numpy as np\n\ndef linear_forward(X, W, b):\n    # X: (batch_size, in_features)\n    # W: (in_features, out_features)\n    return np.dot(X, W) + b"
      },
      {
        id: "dl-ch2",
        chapterNumber: 2,
        titleArabic: "نظرية الاحتمالات والمعلومات ومقاييس الإنتروبيا",
        titleEnglish: "Probability & Information Theory",
        summaryArabic: "كيف يتعامل الذكاء الاصطناعي مع عدم اليقين (Uncertainty). تفكيك مفهوم الإنتروبيا المتقاطعة (Cross-Entropy Loss) وتباعد كولباك-ليبلر (KL Divergence).",
        keyConcepts: ["دوال التوزيع الاحتمالي", "أقصى احتمال Maximum Likelihood", "الإنتروبيا ومقدار المعلومات Information Content", "تباعد KL Divergence"],
        translatedExcerpt: "الإنتروبيا (Entropy) تقيس مقدار المفاجأة أو عدم اليقين في توزيع احتمالي ما. عندما ندرّب نموذجاً لغوياً أو تصنيفياً، فإن دالة الخسارة Cross-Entropy تقيس بدقة المسافة الرياضية بين توقعات النموذج وتوزيع الحقيقة الفعلية، وكلما نقصت الخسارة اقترب النموذج من محاكاة الواقع.",
        practicalCodeSummary: "# حساب الإنتروبيا المتقاطعة (Cross-Entropy):\ndef cross_entropy(y_true, y_pred):\n    epsilon = 1e-15\n    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)\n    return -np.sum(y_true * np.log(y_pred)) / y_true.shape[0]"
      },
      {
        id: "dl-ch3",
        chapterNumber: 3,
        titleArabic: "الشبكات العصبية الأمامية وخوارزمية الانتشار الخلفي",
        titleEnglish: "Deep Feedforward Networks & Backpropagation",
        summaryArabic: "تشريح المعمارية الجوهرية للشبكات العصبية، وقاعدة السلسلة للتفاضل، وكيف تتدفق المشتقات العكسية لتحديث مصفوفات الأوزان بدون انفجار أو تلاشي التدرجات.",
        keyConcepts: ["قاعدة السلسلة Chain Rule", "حساب الرسوم البيانية Computational Graphs", "تلاشي وانفجار التدرج Vanishing/Exploding Gradients", "دوال التنشيط ReLU vs GELU"],
        translatedExcerpt: "الانتشار الخلفي (Backprop) هو تطبيق بارع لقاعدة السلسلة في التفاضل على رسم بياني حوسبي. بدلاً من إعادة حساب المشتقات لكل وزن على حدة، نقوم بتخزين التدرجات الوسيطة في الذاكرة وتمريرها في اتجاه عكسي بكفاءة حسابية قدرها O(N)."
      },
      {
        id: "dl-ch4",
        chapterNumber: 4,
        titleArabic: "خوارزميات الاستمثال للتعلم العميق (Adam, RMSProp)",
        titleEnglish: "Optimization for Training Deep Models",
        summaryArabic: "مقارنة رياضية وتطبيقية بين Gradient Descent التقليدي، والـ Momentum، ومحسنات معدل التعلم التكيفي مثل Adam ومحسن AdamW المعتمد في تدريب نماذج GPT.",
        keyConcepts: ["Stochastic Gradient Descent (SGD)", "الزخم Momentum و Nesterov", "محسن Adam وتقدير العزمين الأول والثاني", "جدولة معدل التعلم Cosine Annealing"],
        translatedExcerpt: "محسن Adam يجمع بين أفضل ميزتين: فهو يحسب العزم الأول (المتوسط المتحرك للتدرجات) لتوجيه الحركة كالزخم، والعزم الثاني (المتوسط المتحرك لمربعات التدرجات) لتكييف سرعة التعلم لكل باراميتر بصورة مستقلة، مما يجعله المحرك الأقوى لتدريب النماذج اللغوية الضخمة."
      }
    ]
  },
  {
    id: "build-llm-raschka",
    titleArabic: "بناء النماذج اللغوية الضخمة من الصفر",
    titleEnglish: "Build a Large Language Model (From Scratch)",
    author: "د. سيباستيان راشكا (Sebastian Raschka)",
    publisher: "Manning Publications",
    year: 2024,
    badge: "الكتاب التطبيقي الأحدث عالمياً في LLMs",
    coverGradient: "from-emerald-600 to-teal-950",
    rating: 5.0,
    pages: 380,
    descriptionArabic: "الدليل العملي الأقوى لعام 2024 لبناء وتدريب نموذج شبيه بـ ChatGPT/GPT-2 سطراً بسطر بلغة بايثون وPyTorch. يشرح الكتاب التوكنات، والانتباه متعدد الرؤوس، والتدريب المسبق، والضبط بالتعليمات، وتقييم النماذج.",
    whoShouldRead: "المبرمجون ومهندسو الذكاء الاصطناعي الذين يفضلون الكود الحقيقي وبناء كل طبقة يدوياً دون الاعتماد على مكتبات سوداء مغلقة.",
    keyTakeaways: [
      "بناء خوارزمية التوكنات Byte-Pair Encoding وتحويل النصوص إلى متجهات أبعاد.",
      "برمجة طبقة الانتباه الذاتي السببي (Causal Multi-Head Self-Attention) من الصفر.",
      "كتابة حلقة التدريب المسبق الكاملة (Pretraining Loop) وحساب الحيرة (Perplexity)."
    ],
    pdfDownloadNote: "ملخصات تطبيقية وفصول مترجمة حصرياً لمنصة JINNA 5.",
    chapters: [
      {
        id: "llm-ch1",
        chapterNumber: 1,
        titleArabic: "فهم خط أنابيب النماذج اللغوية وهندسة التوكنات",
        titleEnglish: "Understanding LLMs and Working with Text Data",
        summaryArabic: "كيف يتعامل الحاسوب مع النص البشري: من الأحرف الخام إلى أزواج البايتات (BPE Tokenizer)، ومصفوفات التضمين اللفظي ومصفوفات المواضع المكانية Positional Embeddings.",
        keyConcepts: ["ترميز BPE", "حجم المفردات Vocabulary Size", "تضمين الكلمات Word Embeddings", "التضمين الموضعي Positional Encoding"],
        translatedExcerpt: "النماذج اللغوية لا ترى الكلمات ولا تفهم المعاني الإنسانية مباشرة؛ بل ترى أرقاماً صحيحة (Tokens). يتم تحويل كل رقم إلى متجه كثيف في فضاء عالي الأبعاد (مثلاً 768 بعداً)، حيث تكون الكلمات ذات الدلالات المتقاربة قريبة هندسياً من بعضها البعض."
      },
      {
        id: "llm-ch2",
        chapterNumber: 2,
        titleArabic: "برمجة آلية الانتباه الذاتي المشروطة (Causal Attention)",
        titleEnglish: "Coding Attention Mechanisms",
        summaryArabic: "التطبيق الرياضي والبرمجي الكامل لضرب مصفوفات الاستعلامات والمفاتيح والقيم (Q, K, V)، وتطبيق القناع السببي لمنع النموذج من النظر إلى الكلمات المستقبلية أثناء التدريب.",
        keyConcepts: ["Query, Key, Value Matrices", "الضرب القياسي المتدرج Scaled Dot-Product", "القناع الثلاثي Causal Mask", "الانتباه متعدد الرؤوس Multi-Head"],
        translatedExcerpt: "آلية الانتباه الذاتي هي القلب النابض للمحولات. تسمح لكل كلمة بالتواصل مع جميع الكلمات السابقة لها في السياق لحساب 'درجة صلة' ترجح أي الكلمات أكثر تأثيراً في تحديد معنى الكلمة الحالية."
      },
      {
        id: "llm-ch3",
        chapterNumber: 3,
        titleArabic: "تجميع معمارية GPT الكاملة وتوليد النصوص",
        titleEnglish: "Implementing a GPT Model from Scratch",
        summaryArabic: "دمج طبقات التطبيع LayerNorm، والوصلات المتبقية Residual Connections، وشبكات التغذية الأمامية Feed-Forward، وطبقة Softmax لتوليد النصوص كلمة بكلمة.",
        keyConcepts: ["Residual Connections", "LayerNorm vs RMSNorm", "GELU Activation", "استراتيجيات أخذ العينات Temperature & Top-p Sampling"],
        translatedExcerpt: "تعتمد معمارية المحول المفكك للشفرات (Decoder-Only) على تكديس كتل متطابقة من طبقات الانتباه والتغذية الأمامية. بفضل الوصلات المتبقية (Residuals)، يمكن للإشارات التدرجية التدفق عبر عشرات الطبقات دون أي تلاشٍ."
      }
    ]
  },
  {
    id: "designing-ml-huyen",
    titleArabic: "تصميم نظم التعلم الآلي والذكاء الاصطناعي في الإنتاج",
    titleEnglish: "Designing Machine Learning Systems",
    author: "تشيب هيون (Chip Huyen - Stanford University)",
    publisher: "O'Reilly Media",
    year: 2023,
    badge: "دليل مهندسي MLOps في كبرى شركات التقنية",
    coverGradient: "from-purple-600 to-slate-900",
    rating: 4.95,
    pages: 420,
    descriptionArabic: "الكتاب الأهم لمهندسي النظم وهندسة المنصات الإنتاجية. يغطي دورة حياة نماذج الذكاء الاصطناعي خارج دفاتر Jupyter: تدفق البيانات، مخازن الميزات، اختبارات A/B، كشف انحراف البيانات (Data Drift)، وتوسيع الاستدلال السريع.",
    whoShouldRead: "من يريد تحويل النموذج التجريبي إلى نظام برمجي حقيقي يخدم ملايين المستخدمين بموثوقية وزمن استجابة أقل من 50ms.",
    keyTakeaways: [
      "معمارية خطوط أنابيب البيانات اللحظية (Real-time vs Batch Feature Engineering).",
      "استراتيجيات المراقبة وكشف انحراف المفاهيم (Concept Drift & Data Drift).",
      "تقنيات تقليل زمن الاستدلال (Quantization, Pruning, Caching)."
    ],
    pdfDownloadNote: "شروحات فصول هندسة النظم مترجمة وفق بيئات السحابة الحديثة.",
    chapters: [
      {
        id: "dml-ch1",
        chapterNumber: 1,
        titleArabic: "نظرة شمولية لنظم التعلم الآلي ومتطلبات العمل الحقيقي",
        titleEnglish: "Overview of Machine Learning Systems",
        summaryArabic: "الفارق الجوهري بين البحث الأكاديمي والإنتاج الهندسي. كيفية قياس كفاءة النظم: التكلفة، زمن الاستجابة، الإنتاجية، وسرعة التكرار.",
        keyConcepts: ["أهداف العمل مقابل أهداف النموذج", "الموثوقية وقابلية التوسع", "قابلية الصيانة وتحديث الأوزان", "مراقبة الأنظمة في الوقت الفعلي"],
        translatedExcerpt: "في الإنتاج، لا يُقاس نجاح النموذج بدقة 99% وحدها إذا كان يستغرق 3 ثوانٍ للرد ويكلف آلاف الدولارات في الساعة. النظام الناجح هو الذي يوازن بدقة بين الدقة الرياضية، وتكلفة الحوسبة، وزمن الاستجابة الحرج للمستخدم النهائي."
      },
      {
        id: "dml-ch2",
        chapterNumber: 2,
        titleArabic: "تصميم خدمات الاستدلال عالي السرعة (Deployment & Serving)",
        titleEnglish: "Model Deployment and Serving Patterns",
        summaryArabic: "مقارنة أساليب خدمة النماذج: الاستدلال بالدفعات (Batch)، الاستدلال اللحظي (Streaming/Online)، والحوسبة على الحافة (Edge). إدارة ذاكرة VRAM ودمج الطلبات (Dynamic Batching).",
        keyConcepts: ["Dynamic Batching", "vLLM PagedAttention", "الكمية Quantization (INT8 & INT4)", "مخازن الذاكرة المؤقتة للـ KV Cache"],
        translatedExcerpt: "أكبر عنق زجاجة في استدلال النماذج اللغوية الضخمة ليس العمليات الحسابية، بل حركة نقل البيانات بين ذاكرة VRAM ومعالج الرسوميات (Memory Bandwidth). تقنيات مثل PagedAttention تسمح بتخزين مفاتيح وقيم الانتباه السابقة بكفاءة تمنع إهدار الذاكرة وتضاعف الإنتاجية 4 أضعاف."
      }
    ]
  },
  {
    id: "grokking-deep-learning",
    titleArabic: "فهم التعلم العميق وتفكيك أسراره برمجياً",
    titleEnglish: "Grokking Deep Learning",
    author: "أندرو تراسك (Andrew Trask - DeepMind)",
    publisher: "Manning Publications",
    year: 2019,
    badge: "أفضل مدخل برمجى دون مكتبات سحرية",
    coverGradient: "from-amber-600 to-stone-900",
    rating: 4.85,
    pages: 320,
    descriptionArabic: "المنهجية الأكثر إمتاعاً في العالم لفهم الشبكات العصبية. يبني الكتاب مفاهيم التعلم التكراري والتنبؤ وحساب الأخطاء والانتشار الخلفي خطوة بخطوة بالرياضيات الأولية وكود بايثون المجرد دون PyTorch أو TensorFlow.",
    whoShouldRead: "المبتدئون الذين يشعرون بالخوف من تعقيد مكتبات الذكاء الاصطناعي ويريدون بناء حدس بديهي قوي جداً.",
    keyTakeaways: [
      "فهم الشبكة العصبية كآلة لمعايرة الأخطاء وليست صندوقاً سحرياً غامضاً.",
      "حساب الاشتقاق والتدرج يدوياً وفهم سبب ضرب الخطأ في المدخلات.",
      "بناء شبكة تصنيف متكاملة في أقل من 30 سطر كود بايثون بسيط."
    ],
    pdfDownloadNote: "متاح بالكامل مع تطبيقات بايثون سهلة الفهم.",
    chapters: [
      {
        id: "grok-ch1",
        chapterNumber: 1,
        titleArabic: "كيف يتعلم الحاسوب؟ التنبؤ البسيط وحساب نسبة الخطأ",
        titleEnglish: "Predict, Compare, and Learn",
        summaryArabic: "مبدأ التعلم الثلاثي: التنبؤ (Prediction)، المقارنة (Comparison)، وتعديل الأوزان (Adjustment). لماذا نحتاج إلى تربيع الخطأ Mean Squared Error.",
        keyConcepts: ["الوزن كمعامل قوة اتصال", "الخطأ التربيعي Squared Error", "التدرج واتجاه تقليل الخطأ", "معدل التعلم Alpha"],
        translatedExcerpt: "كل ما تفعله الشبكة العصبية هو ثلاث خطوات بديهية: تتنبأ برقم، تقارن هذا الرقم بالنتيجة الحقيقية لتعرف مقدار خطئها، ثم تعدل أوزانها بمقدار ضئيل جداً في الاتجاه الذي يقلل هذا الخطأ للمرة القادمة."
      },
      {
        id: "grok-ch2",
        chapterNumber: 2,
        titleArabic: "الانحدار التدريجي والانتقال إلى الطبقات المتعددة",
        titleEnglish: "Gradient Descent & Multi-Layer Networks",
        summaryArabic: "كيف تتيح الطبقات الخفية للشبكة العصبية اكتشاف الأنماط المعقدة وحل مشاكل الانفصال غير الخطي مثل بوابة XOR.",
        keyConcepts: ["مشكلة XOR", "الطبقات الخفية Hidden Layers", "دوال التنشيط ودورها في كسر الخطية", "حفظ الأنماط Correlation Summaries"],
        translatedExcerpt: "الطبقة الخفية ليست لغزاً؛ إنها ببساطة تسمح للشبكة بدمج الميزات البسيطة لتكوين ميزات أعلى تعقيداً. على سبيل المثال: دمج الحواف لتكوين زوايا، ودمج الزوايا لتكوين أشكال، ودمج الأشكال للتعرف على الوجوه."
      }
    ]
  }
];
