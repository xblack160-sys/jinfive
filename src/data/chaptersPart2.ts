import { Chapter } from '../types';

export const chaptersPart2: Chapter[] = [
  {
    id: 4,
    title: "معمارية المحولات من الصفر (Transformers, Attention & RoPE)",
    subtitle: "آلية الانتباه الذاتي Scaled Dot-Product، Multi-Head، تشفير RoPE، وإدارة KV Cache",
    description: "المحولات (Transformers) هي الأساس المشترك لكل النماذج اللغوية الحديثة من GPT-4 إلى LLaMA 3. سنبني هنا كل طبقة من الصفر بالمعادلات الرياضية وكود PyTorch التنفيذي.",
    iconName: "Layers",
    estimatedHours: 26,
    badge: "Transformer Architect",
    lessons: [
      {
        id: "4-1",
        title: "آلية الانتباه متعدد الرؤوس (Multi-Head Self-Attention) بالتفصيل",
        subtitle: "كيف تتفاعل مصفوفات الاستعلام (Q) والمفتاح (K) والقيمة (V) وأهمية التقسيم على جذر d_k",
        duration: "26 ساعة دراسية معتمدة",
        readTime: "22 دقيقة قراءة تفصيلية + 24 ساعة محاضرات ومعامل",
        hoursBreakdown: {
          lecturesHours: 14,
          labHours: 7,
          readingHours: 3,
          projectHours: 2,
          totalHours: 26
        },
        handsOnLabs: [
          {
            title: "بناء نموذج GPT-2 ومحرك الانتباه RoPE من الصفر في PyTorch",
            difficulty: "Architecture Engineering",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Build_GPT_With_RoPE_From_Scratch",
            githubUrl: "https://github.com/karpathy/nanoGPT",
            description: "برمجة طبقات Multi-Head Attention و Rotary Position Embeddings وتدريب نموذج مصغر على Shakespeare dataset."
          },
          {
            title: "معمل قياس وتحسين استهلاك الذاكرة لـ KV Cache في نماذج التوليد",
            difficulty: "Memory Optimization",
            estimatedHours: "3 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1KVCache_Memory_Profile_Lab",
            githubUrl: "https://github.com/vllm-project/vllm",
            description: "قياس تضخم الذاكرة أثناء زيادة طول السياق وبرمجة Paged Attention لإدارة شظايا الذاكرة الديناميكية."
          }
        ],
        sections: [
          {
            id: "4-1-1",
            title: "المعادلة الذهبية للانتباه ولماذا نقسم على جذر أبعاد الرأس",
            content: `معادلة الانتباه الأساسية:\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}} + M\\right)V$$\n\nلماذا نقسم على $\\sqrt{d_k}$؟ إذا كانت عناصر $Q$ و $K$ متغيرات عشوائية مستقلة بمتوسط صفر وتباين 1، فإن حاصل ضربهما النقطي سيكون له تباين يساوي $d_k$ وانحراف معياري يساوي $\\sqrt{d_k}$. إذا كان $d_k = 128$ مثلاً، بدون هذا التقسيم ستكون القيم كبيرة جداً، مما يدفع دالة Softmax إلى مناطق الإشباع (Saturation Regions) حيث تصبح التدرجات متناهية الصغر (تلاشي التدرج)، ويتوقف النموذج عن التعلم.`,
            mathFormulas: [
              "\\text{Var}(q \\cdot k) = \\sum_{i=1}^{d_k} \\text{Var}(q_i k_i) = d_k",
              "\\text{With scaling}: \\quad \\text{Var}\\left(\\frac{q \\cdot k}{\\sqrt{d_k}}\\right) = 1"
            ],
            takeaway: "التقسيم على جذر d_k يضمن بقاء تباين مخرجات الضرب النقطي قريباً من 1، مما يحمي دالة Softmax من تلاشي التدرجات."
          },
          {
            id: "4-1-2",
            title: "تشفير الموضع الدائري (RoPE - Rotary Position Embedding)",
            content: `في النماذج الحديثة مثل LLaMA 3 وMistral، تم استبدال التشفير الموضعي المطلق (Absolute Positional Embedding) بتقنية RoPE. تقوم تقنية RoPE بضرب متجهات الـ Query والـ Key بمصفوفات دوران متعامدة ثنائية الأبعاد تعتمد على زاوية موضع التوكن $m \\theta_i$.\n\nالميزة الجوهرية لـ RoPE هي أنها تجعل الضرب النقطي $Q_m K_n^T$ دالة في المسافة النسبية فقط $(m - n)$، مما يمنح النموذج قدرة استثنائية على التوسع في أطوال السياق (Context Length Extension) مع الحفاظ على التناسق المكاني.`,
            mathFormulas: [
              "\\langle R_{\\Theta, m}^d q, R_{\\Theta, n}^d k \\rangle = g(q, k, m - n)",
              "R_{\\Theta, m}^d = \\text{diag}\\left( R_{\\theta_1, m}, R_{\\theta_2, m}, \\dots, R_{\\theta_{d/2}, m} \\right)"
            ],
            takeaway: "RoPE يشفر الموضع كدوران في المستوى المركب، مما يحول الانتباه إلى دالة للمسافة النسبية تلقائياً دون الحاجة لمعلمات قابلة للتدريب."
          }
        ],
        pythonCode: {
          title: "بناء Multi-Head Self-Attention كامل مع RoPE بلغة PyTorch",
          filename: "multihead_rope_attention.py",
          explanation: "تنفيذ عملي عالي الكفاءة لطبقة انتباه تدعم التشفير الدائري RoPE وتجهيز مصفوفة الـ Mask السببي (Causal Mask) لنماذج التوليد الذاتي.",
          code: `import torch
import torch.nn as nn
import math

class CausalSelfAttention(nn.Module):
    def __init__(self, d_model=4096, num_heads=32):
        super().__init__()
        assert d_model % num_heads == 0
        self.d_model = d_model
        self.num_heads = num_heads
        self.head_dim = d_model // num_heads

        # إسقاطات Q, K, V و output projection
        self.q_proj = nn.Linear(d_model, d_model, bias=False)
        self.k_proj = nn.Linear(d_model, d_model, bias=False)
        self.v_proj = nn.Linear(d_model, d_model, bias=False)
        self.out_proj = nn.Linear(d_model, d_model, bias=False)

    def apply_rope(self, x, seq_len):
        # محاكاة بسيطة لدوران RoPE
        # x shape: (B, num_heads, seq_len, head_dim)
        dim = self.head_dim
        inv_freq = 1.0 / (10000.0 ** (torch.arange(0, dim, 2).float() / dim)).to(x.device)
        t = torch.arange(seq_len, device=x.device, dtype=torch.float32)
        freqs = torch.outer(t, inv_freq)
        sin, cos = freqs.sin(), freqs.cos()
        # تطبيق الدوران على الأزواج
        x1 = x[..., 0::2]
        x2 = x[..., 1::2]
        rotated = torch.stack([x1 * cos - x2 * sin, x1 * sin + x2 * cos], dim=-1).flatten(-2)
        return rotated

    def forward(self, x):
        B, S, D = x.shape
        
        # 1. الإسقاط وإعادة التشكيل (Batch, Heads, Seq_Len, Head_Dim)
        q = self.q_proj(x).view(B, S, self.num_heads, self.head_dim).transpose(1, 2)
        k = self.k_proj(x).view(B, S, self.num_heads, self.head_dim).transpose(1, 2)
        v = self.v_proj(x).view(B, S, self.num_heads, self.head_dim).transpose(1, 2)

        # 2. تطبيق RoPE على Q و K
        q = self.apply_rope(q, S)
        k = self.apply_rope(k, S)

        # 3. حساب مصفوفة الانتباه مع التقسيم على sqrt(head_dim)
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.head_dim)
        
        # 4. قناع السببية (Causal Mask لمنع رؤية المستقبل)
        mask = torch.triu(torch.full((S, S), float('-inf'), device=x.device), diagonal=1)
        scores = scores + mask

        # 5. Softmax وضرب القيم
        attn_weights = torch.softmax(scores, dim=-1)
        out = torch.matmul(attn_weights, v) # (B, Heads, S, Head_Dim)

        # 6. دمج الرؤوس والإسقاط النهائي
        out = out.transpose(1, 2).contiguous().view(B, S, D)
        return self.out_proj(out)

# اختبار الوحدة
x = torch.randn(2, 64, 512) # batch=2, seq_len=64, d_model=512
layer = CausalSelfAttention(d_model=512, num_heads=8)
output = layer(x)
print(f"شكل المدخلات: {x.shape} -> شكل المخرجات: {output.shape}")`
        },
        videoResources: [
          {
            title: "Stanford CS224N: Natural Language Processing with Deep Learning (Full Course)",
            instructor: "Prof. Christopher Manning (Stanford University)",
            duration: "24 ساعة محاضرات أكاديمية معتمدة",
            totalCourseHours: "24 ساعة كاملة",
            courseType: "Stanford University Full Course",
            institution: "Stanford University",
            videoUrl: "https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ",
            playlistUrl: "https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ",
            slidesUrl: "https://web.stanford.edu/class/cs224n/",
            codeRepoUrl: "https://github.com/huggingface/transformers",
            embedId: "rmVRLeJRkl4",
            platform: "Stanford Online (YouTube)",
            summary: "المساق الأكاديمي العالمي الأشهر من جامعة ستانفورد في معالجة اللغات الطبيعية وشبكات المحولات العميقة، يقدم تفكيكاً رياضياً دقيقاً لطبقات الانتباه ونماذج اللغة الكبيرة.",
            keyTakeaways: [
              "الاشتقاق الرياضي الكامل لمصفوفات الانتباه الذاتي Scaled Dot-Product",
              "فهم ديناميكية تدريب نماذج التوليد الذاتي التلقائية وطبقات الإسقاط",
              "إدارة الذاكرة في الـ Context Window الطويلة"
            ],
            lectures: [
              { id: "cs224n-5", title: "محاضرة 5: المحولات والانتباه الذاتي (Self-Attention & Transformers)", duration: "78 دقيقة", embedId: "rmVRLeJRkl4" },
              { id: "cs224n-6", title: "محاضرة 6: بناء معمارية المحولات من الصفر (Transformers from Scratch)", duration: "80 دقيقة", embedId: "bCz4OMemCcA" },
              { id: "cs224n-7", title: "محاضرة 7: هندسة المطالبات والتعلم في السياق (Prompting & In-Context)", duration: "82 دقيقة", embedId: "zjkBMFhNj_g" },
              { id: "cs224n-8", title: "محاضرة 8: محاذاة النماذج والـ RLHF", duration: "79 دقيقة", embedId: "kCc8FmEb1nY" }
            ]
          },
          {
            title: "Let's build GPT: from scratch, in code, spelled out",
            instructor: "Andrej Karpathy (Former Director of AI at Tesla & OpenAI Founder)",
            duration: "ساعتان وربع شرح برمجي خطوة بخطوة",
            totalCourseHours: "ساعتان و15 دقيقة مكثفة",
            courseType: "Deep Engineering Masterclass",
            institution: "Eureka Labs / OpenAI Alum",
            videoUrl: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
            playlistUrl: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
            slidesUrl: "https://github.com/karpathy/ng-video-lecture",
            codeRepoUrl: "https://github.com/karpathy/nanoGPT",
            embedId: "kCc8FmEb1nY",
            platform: "YouTube",
            summary: "الكود المرجعي الأهم في العالم لبناء نموذج شبيه بـ GPT من الصفر التام بسطور PyTorch بسيطة ونقية، من مستوى التوكن إلى توليد النصوص.",
            keyTakeaways: [
              "بناء مصفوفة الانتباه السببي Causal Attention Mask في كود نقي",
              "تطبيق Multi-Head Attention وإعادة دمج الأبعاد مع طبقات Feed-Forward",
              "تدريب النموذج وملاحظة انخفاض دالة الخسارة Cross-Entropy Loss"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Attention Is All You Need",
            authors: "Ashish Vaswani et al. (Google Brain & Research)",
            year: 2017,
            arxivUrl: "https://arxiv.org/abs/1706.03762",
            badge: "Milestone",
            citation: "The groundbreaking paper that introduced the Transformer architecture."
          },
          {
            title: "RoFormer: Enhanced Transformer with Rotary Position Embedding",
            authors: "Jianlin Su et al.",
            year: 2021,
            arxivUrl: "https://arxiv.org/abs/2104.09864",
            badge: "Positional Encoding",
            citation: "The formal derivation and implementation of Rotary Position Embedding."
          }
        ],
        practicalExercise: {
          prompt: "احسب حجم مصفوفة الانتباه (Attention Matrix) بالبايت في الذاكرة لتسلسل بطول 32,768 توكن مع 32 رأس انتباه و batch_size=4 بدقة float32.",
          initialCode: `batch_size = 4
num_heads = 32
seq_len = 32768
bytes_per_elem = 4 # float32

# احسب عدد العناصر الإجمالي وحجم الذاكرة بالجيجابايت
pass`,
          expectedOutputHint: "حجم مصفوفة الانتباه فقط سيتجاوز 512 جيجابايت! وهذا هو السبب وراء ابتكار FlashAttention لتجنب كتابة هذه المصفوفة في ذاكرة HBM.",
          solutionCode: `elements = 4 * 32 * (32768 ** 2)
mem_bytes = elements * 4
mem_gb = mem_bytes / (1024**3)
print(f"حجم مصفوفة الانتباه في HBM: {mem_gb:.2f} GB")`
        },
        interviewTips: [
          "في مقابلة Meta AI (LLaMA Core Team): 'لماذا تحول LLaMA 3 من Multi-Head Attention إلى Grouped-Query Attention (GQA)؟' الإجابة الفورية: لتقليل حجم ذاكرة KV Cache بمقدار 8 أضعاف (مشاركة رأس مفتاح وقيمة واحد لكل 8 رؤوس استعلام)، مما يسمح باستيعاب سياق يصل إلى 128k توكن بأريحية."
        ]
      }
    ],
    quiz: [
      {
        id: "q4-1",
        question: "ما هي الفائدة الأساسية لاعتماد تقنية Grouped-Query Attention (GQA) مقارنة بـ MHA القياسي؟",
        options: [
          "زيادة دقة النموذج في العمليات الحسابية بنسبة 50%",
          "تقليص حجم ذاكرة KV Cache أثناء الاستنتاج بشكل كبير مع الحفاظ على جودة الأداء القريبة من MHA",
          "إلغاء الحاجة إلى تدريب النموذج على الـ GPUs",
          "تقليل عدد طبقات التغذية الأمامية FFN"
        ],
        correctIndex: 1,
        explanation: "في GQA، تشترك مجموعات من رؤوس الـ Query في رأس واحد للـ Key ورأس واحد للـ Value، مما يقلل حجم ذاكرة KV Cache بنسبة قد تصل إلى 75-87.5% دون فقدان ملحوظ في الأداء.",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: 5,
    title: "هندسة البيانات الضخمة وبناء الـ Tokenizers وتنظيف التيرابايت",
    subtitle: "خوارزمية Byte-Pair Encoding (BPE)، إزالة التكرار بالـ MinHash، وخطوط تنظيف بيانات ما قبل التدريب",
    description: "البيانات هي الوقود الحقيقي للنماذج؛ نموذج ذكي بهندسة بيانات ضعيفة سيفشل حتماً. ستتعلم هنا كيف تجمع وتنظف وتصفي تيرابايت من نصوص الويب وتبني Tokenizer كامل من الصفر وفق معايير OpenAI وStanford.",
    iconName: "Database",
    estimatedHours: 25,
    badge: "Stanford / Karpathy Data Standard",
    lessons: [
      {
        id: "5-1",
        title: "بناء خوارزمية ترميز أزواج البايت (Byte-Pair Encoding - BPE) من الصفر",
        subtitle: "كيف تحول النصوص إلى معجم توكنات محكم يدعم كل لغات العالم وحل مشكلة الكلمات النادرة",
        duration: "25 ساعة دراسية معتمدة",
        readTime: "25 دقيقة قراءة تفصيلية + 22 ساعة محاضرات ومعامل",
        hoursBreakdown: {
          lecturesHours: 12,
          labHours: 8,
          readingHours: 3,
          projectHours: 2,
          totalHours: 25
        },
        handsOnLabs: [
          {
            title: "معمل بناء وتدريب Byte-level BPE Tokenizer متطابق مع GPT-4 و tiktoken من الصفر",
            difficulty: "Systems & NLP",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Build_GPT_Tokenizer_MinBPE_Lab",
            githubUrl: "https://github.com/karpathy/minbpe",
            description: "برمجة خوارزمية minbpe وقواعد التجزئة بـ Regex وتدريب معجم 32k توكن على نصوص عربية وإنجليزية وحساب معدل الضغط بدقة."
          },
          {
            title: "معمل تنظيف وتصفية تيرابايت البيانات وإزالة التكرار بخوارزمية MinHash LSH",
            difficulty: "Data Engineering",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1MinHash_Deduplication_Pipeline_Lab",
            githubUrl: "https://github.com/huggingface/datatrove",
            description: "تطبيق خط معالجة لتصفية صفحات الويب من النصوص المكررة ومنخفضة الجودة وتجهيزها للـ Pre-training."
          }
        ],
        sections: [
          {
            id: "5-1-1",
            title: "منطق دمج التكرارات في خوارزمية BPE",
            content: `تبدأ خوارزمية BPE بمعجم أساسي يتكون من جميع البايتات الممكنة (0 إلى 255)، مما يضمن عدم وجود أي توكن غير معروف (Zero Out-of-Vocabulary - OOV Tokens). في كل دورة تكرار، تبحث الخوارزمية عن أكثر زوج متجاور من التوكنات تكراراً في مجموعة النصوص (Corpus)، وتدمجهما في توكن جديد يُضاف إلى المعجم (Vocabulary).\n\nفي نموذج مثل GPT-4 أو LLaMA 3، يصل حجم المعجم (Vocab Size) إلى 100,000 وحتى 128,256 توكن، مما يزيد من كفاءة ضغط النصوص العربية واللغات غير اللاتينية بشكل غير مسبوق.`,
            mathFormulas: [
              "\\text{Compression Ratio} = \\frac{\\text{Raw Text Length in Bytes}}{\\text{Total Generated Tokens}}",
              "\\text{BPE Merge Step}: \\quad (t_i, t_j) \\leftarrow \\arg\\max_{a, b} \\text{Frequency}(a, b)"
            ],
            takeaway: "الـ Tokenizer الجيد يضغط النصوص بكفاءة عالية، مما يقلل عدد التوكنات المطلوبة لتمثيل الجملة، وبالتالي يوفر الذاكرة والحوسبة في كل طبقات النموذج."
          }
        ],
        pythonCode: {
          title: "تنفيذ عملي مبسط لخوارزمية BPE لتدريب معجم توكنات",
          filename: "train_bpe_tokenizer.py",
          explanation: "كود كامل يوضح مرحلة تدريب BPE على نصوص عربية وإنجليزية، واستخراج عمليات الدمج الأكثر تكراراً لتوليد المفردات.",
          code: `from collections import Counter, defaultdict

def get_stats(vocab):
    pairs = defaultdict(int)
    for word, freq in vocab.items():
        symbols = word.split()
        for i in range(len(symbols) - 1):
            pairs[(symbols[i], symbols[i+1])] += freq
    return pairs

def merge_vocab(pair, v_in):
    v_out = {}
    bigram = ' '.join(pair)
    replacement = ''.join(pair)
    for word in v_in:
        w_out = word.replace(bigram, replacement)
        v_out[w_out] = v_in[word]
    return v_out

# نصوص تدريبية للمحاكاة
corpus = [
    "ذكاء اصطناعي", "أنظمة ذكاء", "أبحاث الذكاء",
    "deep learning", "deep neural systems", "learning representations"
]

# تمثيل الكلمات كحروف مفصولة بفراغ مع علامة نهاية الكلمة </w>
vocab = Counter()
for text in corpus:
    for word in text.split():
        vocab[' '.join(list(word)) + ' </w>'] += 1

num_merges = 10
print("--- بدء دورات دمج BPE ---")
for i in range(num_merges):
    pairs = get_stats(vocab)
    if not pairs:
        break
    best_pair = max(pairs, key=pairs.get)
    vocab = merge_vocab(best_pair, vocab)
    print(f"الدمج {i+1}: الزوج {best_pair} (تكرر {pairs[best_pair]} مرة)")

print("\\nالمفردات الناتجة بعد الدمج:")
for word, freq in vocab.items():
    print(f"  {word}: {freq}")`
        },
        videoResources: [
          {
            title: "Let's build the GPT Tokenizer from scratch",
            instructor: "Andrej Karpathy (Former OpenAI Founding Member)",
            duration: "2 ساعة و 13 دقيقة تدريب برمجي معمق",
            videoUrl: "https://www.youtube.com/watch?v=zduSFxRajkE",
            embedId: "zduSFxRajkE",
            platform: "YouTube",
            institution: "OpenAI / Stanford Standard",
            courseType: "Masterclass Workshop",
            totalCourseHours: "12 ساعة دراسية معتمدة",
            summary: "شرح شامل وتفكيك كودي استثنائي لكل تفاصيل الـ Tokenization في نماذج GPT وكيف تعمل خوارزميات BPE في كواليس مكتبة tiktoken لـ OpenAI.",
            keyTakeaways: [
              "فهم سبب فشل النماذج اللغوية في العمليات الحسابية البسيطة بسبب تقسيم الأرقام كأزواج توكنات عشوائية",
              "بناء مصفوفة الدمج (Merges Dictionary) والتعامل المباشر مع UTF-8 Bytes",
              "برمجة مكتبة minbpe ومقارنتها بنتائج GPT-4 الرسمية"
            ],
            lectures: [
              {
                id: "tok-1",
                title: "المحاضرة 1: مقدمة في التوكنات وتشفير بايتات UTF-8",
                duration: "25 دقيقة",
                embedId: "zduSFxRajkE",
                startTime: 0
              },
              {
                id: "tok-2",
                title: "المحاضرة 2: خوارزمية دمج الأزواج BPE وتكوين القاموس",
                duration: "40 دقيقة",
                embedId: "zduSFxRajkE",
                startTime: 1500
              },
              {
                id: "tok-3",
                title: "المحاضرة 3: تدريب المرمز على نصوص حقيقية والتقسيم بالتعبيرات النمطية",
                duration: "35 دقيقة",
                embedId: "zduSFxRajkE",
                startTime: 3900
              },
              {
                id: "tok-4",
                title: "المحاضرة 4: التوكنات الخاصة Special Tokens ومقارنة minbpe مع tiktoken",
                duration: "40 دقيقة",
                embedId: "zduSFxRajkE",
                startTime: 6000
              }
            ]
          },
          {
            title: "Deep Dive into LLMs: Tokenization, Pre-training & Inference Pipelines",
            instructor: "Andrej Karpathy (Former OpenAI & Tesla)",
            duration: "3 ساعات و 30 دقيقة شاملة",
            videoUrl: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
            embedId: "7xTGNNLPyMI",
            platform: "YouTube",
            institution: "Independent AI Masterclass",
            courseType: "Masterclass Lecture",
            totalCourseHours: "3.5 ساعات دراسية",
            summary: "شرح شامل وتفصيلي من أندريه كارباثي عن هندسة التوكنات وتدريب النماذج اللغوية على مجموعات البيانات الضخمة وبناء خطوط أنابيب الاستدلال.",
            keyTakeaways: [
              "الأساس العملي لمفردات النماذج ومعدلات الضغط الإحصائي للكلمات واللغات",
              "المفاضلة بين أحجام المعاجم المختلفة وتأثيرها على استهلاك الذاكرة والسرعة"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Neural Machine Translation of Rare Words with Subword Units",
            authors: "Rico Sennrich et al. (Edinburgh)",
            year: 2016,
            arxivUrl: "https://arxiv.org/abs/1508.07909",
            badge: "Tokenization Classic",
            citation: "The paper that originally adapted BPE for subword segmentation in NLP."
          }
        ],
        practicalExercise: {
          prompt: "اكتب كود يحسب معدل ضغط النصوص (Compression Ratio) للنص العربي: كم بايت لكل توكن (Bytes per Token).",
          initialCode: `arabic_text = "الذكاء الاصطناعي وهندسة الأنظمة الموزعة"
# اكتب دالة تحسب عدد بايتات UTF-8 وعدد التوكنات التقريبي
`,
          expectedOutputHint: "في النماذج القديمة مثل GPT-2 كان الحرف العربي الواحد يستهلك 2-3 توكنات! في LLaMA 3 يستهلك أقل من 0.5 توكن لكل حرف.",
          solutionCode: `arabic_text = "الذكاء الاصطناعي وهندسة الأنظمة الموزعة"
raw_bytes = len(arabic_text.encode('utf-8'))
tokens_estimate = len(arabic_text.split()) * 2
ratio = raw_bytes / tokens_estimate
print(f"عدد البايتات: {raw_bytes} | عدد التوكنات: {tokens_estimate} | معدل الضغط: {ratio:.2f} bytes/token")`
        },
        interviewTips: [
          "في مقابلة OpenAI: 'كيف تفسر أن GPT لا يستطيع عد الحروف في كلمة مثل strawberry بدقة؟' الإجابة: لأن الكلمة تقسم إلى توكنات (مثل straw-berry) ولا يرى النموذج الحروف الفردية بشكل مباشر."
        ]
      }
    ],
    quiz: [
      {
        id: "q5-1",
        question: "ما الفائدة الأساسية للبدء بمعجم يتكون من الـ 256 قيمة للبايت (Byte-level) في خوارزميات BPE الحديثة؟",
        options: [
          "زيادة سرعة التدريب بمقدار 10 أضعاف",
          "القضاء التام على مشكلة الكلمات غير المعروفة (Out-of-Vocabulary / OOV) ودعم أي لغة أو ترميز ثنائي",
          "تقليل استهلاك الـ VRAM في طبقة الانتباه",
          "تحسين حسابات التفاضل التلقائي"
        ],
        correctIndex: 1,
        explanation: "لأن أي نص في العالم يمكن تمثيله كسلسلة من البايتات (0 إلى 255) بنظام UTF-8، فإن البدء بالبايتات يضمن أن الـ Tokenizer يستطيع تشفير أي بايت وارد دون إرجاع [UNK].",
        difficulty: "Easy"
      }
    ]
  },
  {
    id: 6,
    title: "التدريب الموزع واسع النطاق (Distributed Training & Parallelism)",
    subtitle: "DDP, Tensor Parallelism (TP), Pipeline Parallelism (PP), DeepSpeed ZeRO, FSDP و FP8",
    description: "تدريب نموذج لغوي ضخم ليس مجرد كود بايثون بسيط، بل هو أوركسترا هندسية موزعة على آلاف الـ GPUs بتزامن دقيق عبر NVLink وInfiniBand وفق معايير Megatron-LM و Stanford CS336.",
    iconName: "Network",
    estimatedHours: 30,
    badge: "NVIDIA / DeepSpeed Supercomputing Standard",
    lessons: [
      {
        id: "6-1",
        title: "أنماط الموازاة الثلاثية: DDP و Tensor Parallelism و Pipeline Parallelism و FSDP",
        subtitle: "كيف يوزع Megatron-LM و FSDP أوزان الطبقات وتدرجاتها عبر مصفوفة الحواسيب الفائقة",
        duration: "30 ساعة دراسية معتمدة",
        readTime: "30 دقيقة قراءة تفصيلية + 28 ساعة محاضرات ومعامل",
        hoursBreakdown: {
          lecturesHours: 16,
          labHours: 8,
          readingHours: 3,
          projectHours: 3,
          totalHours: 30
        },
        handsOnLabs: [
          {
            title: "معمل تدريب موزع باستخدام PyTorch FSDP (Fully Sharded Data Parallel) و ZeRO-3",
            difficulty: "Distributed Systems",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1FSDP_Distributed_Training_Lab",
            githubUrl: "https://github.com/pytorch/examples/tree/main/distributed/FSDP",
            description: "تطبيق استراتيجية تجزئة معلمات النموذج وحالات المحسن وتمرير البيانات عبر الـ Ranks وقياس سرعة الاتصال بـ NCCL."
          },
          {
            title: "معمل موازاة التنسور (Tensor Parallelism) وتقسيم طبقات GEMM عبر GPU Multi-Node",
            difficulty: "High Performance Computing",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Megatron_Tensor_Parallelism_GEMM",
            githubUrl: "https://github.com/NVIDIA/Megatron-LM",
            description: "برمجة تقسيم مصفوفات الانتباه عمودياً وأفقياً وتنفيذ عمليات All-Reduce لتزامن المخرجات عبر الـ Ranks."
          }
        ],
        sections: [
          {
            id: "6-1-1",
            title: "مقارنة هندسية بين أنماط التوزيع الثلاثة",
            content: `عند تدريب نماذج تفوق 70 مليار معامل، لا تتسع معلمات الطبقة الواحدة لذاكرة كرت واحد. هنا نطبق التوزيع الهجين:\n\n1. موازاة البيانات (Data Parallelism - DDP / FSDP): تكرار النموذج (أو تجزئة أوزانه) وتغذية كل كرت بدفعة بيانات مختلفة (Micro-batch)، ثم دمج التدرجات بعملية All-Reduce.\n2. موازاة التنسور (Tensor Parallelism - TP): تقسيم مصفوفة الأوزان ذاتها داخل الطبقة (مثلاً مصفوفة $W_Q$ تقسم عمودياً عبر 8 بطاقات GPU داخل العقدة الواحدة عبر NVLink).\n3. موازاة خطوط الأنابيب (Pipeline Parallelism - PP): وضع الطبقات 1-8 على GPU 0، والطبقات 9-16 على GPU 1، وهكذا، مع استخدام جدولة فقاعات الهواء (1F1B Schedule) لتقليل زمن انتظار المعالجات (Pipeline Bubble).`,
            mathFormulas: [
              "\\text{Total GPUs} = \\text{TP} \\times \\text{PP} \\times \\text{DP}",
              "\\text{Bubble Fraction (1F1B)} = \\frac{PP - 1}{PP - 1 + M} \\quad \\text{where } M \\text{ is micro-batches}"
            ],
            takeaway: "الـ TP يتطلب نطاق تردد هائل (NVLink حصراً)، بينما الـ PP والـ DP يمكن تشغيلهما عبر شبكات السيرفرات المتصلة بـ InfiniBand أو RoCE."
          },
          {
            id: "6-1-2",
            title: "مراحل DeepSpeed ZeRO الثلاث (ZeRO-1, ZeRO-2, ZeRO-3)",
            content: `ابتكرت مايكروسوفت معمارية ZeRO (Zero Redundancy Optimizer) للتخلص من التكرار في موازاة البيانات:\n- ZeRO-1: تجزئة حالات المحسن (Optimizer States) عبر كروت المعالجة. توفير 4 أضعاف في الذاكرة بدون تكلفة اتصالات إضافية.\n- ZeRO-2: تجزئة حالات المحسن + التدرجات (Gradients). توفير يصل إلى 8 أضعاف.\n- ZeRO-3 (وهو الأساس لـ PyTorch FSDP): تجزئة حالات المحسن + التدرجات + معلمات الأوزان نفسها! يتم جلب الأوزان لحظياً عند الحاجة لها في الـ Forward Pass ثم حذفها فوراً.`,
            takeaway: "باستخدام ZeRO-3 أو FSDP، يمكنك تدريب نموذج بحجم 70B على سيرفر يحتوي على 8 بطاقات H100 دون الحاجة لكتابة كود موازاة تنسور مخصص."
          }
        ],
        pythonCode: {
          title: "إعداد تدريب موزع باستخدام PyTorch FSDP (Fully Sharded Data Parallel)",
          filename: "fsdp_distributed_training.py",
          explanation: "مثال حقيقي متكامل لتهيئة بيئة التدريب الموزع في بايثون باستخدام FSDP وتجزئة طبقات المحول بنمط Auto-Wrap.",
          code: `import os
import torch
import torch.nn as nn
import torch.distributed as dist
from torch.distributed.fsdp import (
    FullyShardedDataParallel as FSDP,
    ShardingStrategy,
    MixedPrecision
)
from torch.distributed.fsdp.wrap import size_based_auto_wrap_policy

def setup_distributed():
    # في بيئة الإنتاج: يحدد عبر torchrun
    os.environ['MASTER_ADDR'] = 'localhost'
    os.environ['MASTER_PORT'] = '12355'
    if torch.cuda.is_available():
        dist.init_process_group("nccl")
        rank = dist.get_rank()
        torch.cuda.set_device(rank)
        print(f"تم تهيئة العقدة رقم (Rank): {rank} بنجاح.")
    else:
        dist.init_process_group("gloo", rank=0, world_size=1)
        print("تهيئة تجريبية محلية بنمط CPU gloo...")

def train_with_fsdp():
    setup_distributed()
    
    # نموذج تجريبي
    model = nn.Sequential(
        nn.Linear(4096, 16384),
        nn.GELU(),
        nn.Linear(16384, 4096)
    )
    
    # إعدادات دقة الحوسبة المختلطة BF16
    bf16_policy = MixedPrecision(
        param_dtype=torch.bfloat16,
        reduce_dtype=torch.bfloat16,
        buffer_dtype=torch.bfloat16
    ) if torch.cuda.is_available() else None

    # تغليف النموذج بـ FSDP (ZeRO-3 equivalent)
    device_id = torch.cuda.current_device() if torch.cuda.is_available() else "cpu"
    fsdp_model = FSDP(
        model,
        sharding_strategy=ShardingStrategy.FULL_SHARD, # ZeRO-3
        mixed_precision=bf16_policy,
        device_id=device_id
    )
    
    optimizer = torch.optim.AdamW(fsdp_model.parameters(), lr=1e-4)
    print("النموذج مهيأ وموزع بنجاح عبر FSDP Sharded States!")

if __name__ == "__main__":
    train_with_fsdp()`
        },
        videoResources: [
          {
            title: "Transformers from Scratch & Distributed Architecture with PyTorch",
            instructor: "Umar Jamil (AI Research Engineer)",
            duration: "ساعتان كاملتان من الشرح البرمجي والرياضي",
            videoUrl: "https://www.youtube.com/watch?v=bCz4OMemCcA",
            playlistUrl: "https://www.youtube.com/watch?v=bCz4OMemCcA",
            embedId: "bCz4OMemCcA",
            platform: "YouTube",
            institution: "Independent AI Systems Research",
            courseType: "Systems & Architecture Deep Dive",
            totalCourseHours: "4 ساعات معتمدة",
            summary: "الكورس التطبيقي الأقوى في العالم لبناء وتدريب النماذج اللغوية والمحولات من الصفر بـ PyTorch، وفهم توزيع مصفوفات الأوزان والحسابات المتوازية.",
            keyTakeaways: [
              "فهم شبكات الربط البيني ومعدلات نقل الذاكرة وتفادي الاختناقات",
              "تطبيق موازاة الانتباه وتفادي فقاعات الانتظار في المعالجة",
              "حساب الـ MFU (Model FLOPs Utilization) وقياس الكفاءة الحسابية الحقيقية"
            ]
          },
          {
            title: "LLaMA from Scratch: RoPE, KV-Cache & Multi-GPU Inference",
            instructor: "Umar Jamil",
            duration: "ساعة و 40 دقيقة",
            videoUrl: "https://www.youtube.com/watch?v=oM4VmoabDAI",
            embedId: "oM4VmoabDAI",
            platform: "YouTube",
            institution: "Deep AI Research",
            courseType: "Architecture Deep Dive",
            totalCourseHours: "3 ساعات تطبيقية",
            summary: "شرح شامل ومفصل لمعمارية النماذج اللغوية الحديثة LLaMA وتطبيق RoPE والتخزين المؤقت KV-Cache وموازاة الاستدلال على كروت الـ GPU.",
            keyTakeaways: [
              "فهم كيفية توزيع أوزان النماذج وتجنب اختناقات الذاكرة عبر الـ KV-Cache",
              "استيعاب الفرق بين موازاة البيانات (Data Parallelism) وموازاة النماذج (Model Parallelism)"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism",
            authors: "Mohammad Shoeybi et al. (NVIDIA)",
            year: 2019,
            arxivUrl: "https://arxiv.org/abs/1909.08053",
            badge: "Foundational System",
            citation: "The pioneering paper establishing Tensor and Pipeline Parallelism for LLMs."
          },
          {
            title: "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models",
            authors: "Samyam Rajbhandari et al. (Microsoft Research)",
            year: 2020,
            arxivUrl: "https://arxiv.org/abs/1910.02054",
            badge: "Best Architecture Innovation",
            citation: "The groundbreaking paper behind DeepSpeed ZeRO and PyTorch FSDP."
          }
        ],
        practicalExercise: {
          prompt: "إذا كان لديك عنقود حوسبة مكون من 64 بطاقة GPU، وتريد استخدام Tensor Parallelism بقيمة 8 و Pipeline Parallelism بقيمة 4، فكم ستكون قيمة موازاة البيانات (Data Parallelism)?",
          initialCode: `total_gpus = 64
tp = 8
pp = 4
# احسب dp
`,
          expectedOutputHint: "DP = Total / (TP * PP) = 64 / 32 = 2.",
          solutionCode: `total_gpus = 64
tp = 8
pp = 4
dp = total_gpus // (tp * pp)
print(f"درجة موازاة البيانات (DP): {dp}")`
        },
        interviewTips: [
          "في مقابلة مهندسي البنية التحتية في Anthropic: 'متى نفضل FSDP على Megatron Tensor Parallelism؟' الإجابة: نفضل FSDP لأنه أسهل في التهيئة ويقلل من تعقيد كتابة الـ Kernels، ويعمل بكفاءة عبر عقد السيرفرات المختلفة طالما أن نطاق الاتصال كافٍ، بينما TP يتطلب NVLink داخل السيرفر الواحد."
        ]
      }
    ],
    quiz: [
      {
        id: "q6-1",
        question: "ما هو الفارق الجوهري بين ZeRO-2 و ZeRO-3 في معمارية DeepSpeed؟",
        options: [
          "ZeRO-2 يلغي الـ Backpropagation تماماً",
          "ZeRO-2 يجزئ التدرجات وحالات المحسن فقط، بينما ZeRO-3 يجزئ معلمات أوزان النموذج ذاتها أثناء فترات الخمول",
          "ZeRO-3 مخصص للـ CPUs فقط",
          "ZeRO-3 لا يدعم موازاة البيانات"
        ],
        correctIndex: 1,
        explanation: "في ZeRO-3، يتم تجزئة الأوزان عبر كل الكروت، ويتم استدعاء الأوزان لحظياً لكل طبقة عبر All-Gather ثم التخلص منها فور انتهاء حسابات الطبقة، مما يوفر أقصى قدر من الـ VRAM.",
        difficulty: "Hard"
      }
    ]
  }
];
