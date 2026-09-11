import { Chapter } from '../types';

export const chaptersPart3: Chapter[] = [
  {
    id: 7,
    title: "ما بعد التدريب والمحاذاة (Post-Training, RLHF & DPO)",
    subtitle: "الضبط الدقيق PEFT/LoRA، التعلم التعزيزي RLHF، التحسين المباشر للتفضيل DPO، وتقييم النماذج",
    description: "النموذج الخام بعد مرحلة Pre-training هو مجرد مكمل نصوص عشوائي. هنا يتحول النموذج إلى مساعد ذكي مطيع وآمن ومحاذٍ للقيم عبر أرقى تقنيات الـ Post-Training المعتمدة في كبرى المختبرات.",
    iconName: "Sliders",
    estimatedHours: 25,
    badge: "Post-Training & Alignment Specialist",
    lessons: [
      {
        id: "7-1",
        title: "من RLHF و PPO إلى التحسين المباشر للتفضيل (Direct Preference Optimization - DPO)",
        subtitle: "كيف تم الاستغناء عن نموذج المكافأة المنفصل وتدريب النموذج مباشرة عبر أزواج التفضيل",
        duration: "25 ساعة دراسية معتمدة",
        readTime: "22 دقيقة قراءة تفصيلية + 22 ساعة محاضرات وتدريب",
        hoursBreakdown: {
          lecturesHours: 12,
          labHours: 8,
          readingHours: 3,
          projectHours: 2,
          totalHours: 25
        },
        handsOnLabs: [
          {
            title: "معمل تدريب نموذج LLaMA 3 عبر DPO باستخدام مكتبة TRL و HuggingFace Unsloth",
            difficulty: "Alignment Engineering",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1LLaMA3_DPO_Alignment_Lab",
            githubUrl: "https://github.com/huggingface/trl",
            description: "تطبيق عملي لمحاذاة نموذج مفتوح المصدر على مجموعة بيانات Anthropic HH-RLHF وملاحظة تحسن مؤشرات الأمان."
          },
          {
            title: "معمل مقارنة PPO مقابل DPO وتأثير معامل Beta على الانجراف الدلالي",
            difficulty: "Mathematical Alignment",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1PPO_vs_DPO_Benchmark_Lab",
            githubUrl: "https://github.com/eric-mitchell/direct-preference-optimization",
            description: "برمجة اختبارات لقياس سرعة التقارب ومراقبة ظاهرة تراجع الأداء العام (Alignment Tax) عند المبالغة في عقوبة KL."
          }
        ],
        sections: [
          {
            id: "7-1-1",
            title: "المشكلة في RLHF التقليدي والحل الرياضي العبقري لـ DPO",
            content: `في أسلوب RLHF الكلاسيكي (كما في InstructGPT):
1. تدريب نموذج مكافأة (Reward Model) على بيانات تقييم البشر للإجابات الفائزة ($y_w$) والخاسرة ($y_l$).
2. استخدام خوارزمية PPO (Proximal Policy Optimization) لضبط سياسة النموذج التوليدي، مع إضافة عقوبة KL-Divergence لمنع النموذج من تدمير قدراته اللغوية.

المشكلة: تدريب PPO معقد جداً، غير مستقر، ويتطلب حفظ 4 نماذج في الذاكرة في آن واحد (Actor, Critic, Reference Model, Reward Model)!\n\nجاءت ورقة DPO (جامعة ستانفورد 2023) لتبين رياضياً أن دالة الخسارة يمكن التعبير عنها مباشرة بدلالة النسبة الاحتمالية دون الحاجة لنموذج مكافأة ولا تدريب تعزيزي بالـ Reinforcement Learning!`,
            mathFormulas: [
              "\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)} \\right) \\right]"
            ],
            takeaway: "DPO جعلت محاذاة النماذج مستقرة مثل الـ Supervised Fine-Tuning العادي، مع خفض استهلاك الـ VRAM بأكثر من النصف."
          }
        ],
        pythonCode: {
          title: "بناء دالة خسارة DPO كاملة بلغة PyTorch",
          filename: "dpo_loss_function.py",
          explanation: "تنفيذ دقيق لدالة خسارة DPO مع حساب اللوغاريتمات النسبية وحساب نسبة احتمالية الاستجابة المفضلة $y_w$ مقارنة بالمرفوضة $y_l$.",
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F

def compute_dpo_loss(
    policy_chosen_logps,
    policy_rejected_logps,
    reference_chosen_logps,
    reference_rejected_logps,
    beta=0.1
):
    """
    حساب خسارة DPO:
    beta: معامل التحكم في قوة عقوبة KL مع النموذج المرجعي
    """
    # 1. حساب لوغاريتم النسبة الاحتمالية للاختيار المفضل
    pi_logratios = policy_chosen_logps - policy_rejected_logps
    ref_logratios = reference_chosen_logps - reference_rejected_logps
    
    # 2. اللوغاريتم الفارق الموزون بـ beta
    logits = beta * (pi_logratios - ref_logratios)
    
    # 3. خسارة DPO = -log(sigmoid(logits))
    losses = -F.logsigmoid(logits)
    
    # حساب المكافآت الضمنية (Implicit Rewards) لمتابعة سير التدريب
    chosen_rewards = beta * (policy_chosen_logps - reference_chosen_logps).detach()
    rejected_rewards = beta * (policy_rejected_logps - reference_rejected_logps).detach()
    
    return losses.mean(), chosen_rewards.mean(), rejected_rewards.mean()

# تجربة محاكاة بيانات
batch_size = 4
policy_chosen = torch.tensor([-1.2, -0.8, -1.5, -0.9])
policy_rejected = torch.tensor([-2.5, -2.1, -2.8, -2.0])
ref_chosen = torch.tensor([-1.3, -0.9, -1.6, -1.0])
ref_rejected = torch.tensor([-2.2, -1.8, -2.5, -1.7])

loss, r_chosen, r_rejected = compute_dpo_loss(
    policy_chosen, policy_rejected, ref_chosen, ref_rejected, beta=0.1
)

print(f"قيمة خسارة DPO المحسوبة: {loss.item():.4f}")
print(f"متوسط مكافأة الإجابات المفضلة: {r_chosen.item():.4f}")
print(f"متوسط مكافأة الإجابات المرفوضة: {r_rejected.item():.4f}")`
        },
        videoResources: [
          {
            title: "Stanford CS324: Large Language Models - Post-Training & Human Alignment",
            instructor: "Prof. Percy Liang & Tatsunori Hashimoto (Stanford University)",
            duration: "20 ساعة محاضرات متقدمة",
            totalCourseHours: "20 ساعة معتمدة",
            courseType: "Stanford Graduate Course",
            institution: "Stanford University",
            videoUrl: "https://www.youtube.com/watch?v=bZQun8Y4L2A",
            playlistUrl: "https://www.youtube.com/watch?v=bZQun8Y4L2A",
            slidesUrl: "https://karpathy.ai",
            codeRepoUrl: "https://github.com/karpathy/nanoGPT",
            embedId: "bZQun8Y4L2A",
            platform: "YouTube",
            summary: "المساق الأكاديمي المرجعي الصادر عن كبار باحثي الذكاء الاصطناعي، يغطي هندسة ما بعد التدريب ومحاذاة النماذج وتقييم السلوك والأمان وخوارزميات RLHF و DPO.",
            keyTakeaways: [
              "فهم ديناميكية تدريب نماذج التفضيل البشري وتفادي التحايل Reward Hacking",
              "المقارنة الهندسية بين PPO و DPO و KTO",
              "تقييم النماذج عبر المعايير المعتمدة MMLU و GSM8K و HumanEval"
            ],
            lectures: [
              { id: "cs324-1", title: "المحاضرة 1: أسس التدريب القبلي وعمارة نماذج الأساس ومحاذاة السلوك", duration: "75 دقيقة", embedId: "bZQun8Y4L2A" },
              { id: "cs324-2", title: "المحاضرة 2: المحاذاة والتعلم التعزيزي من التقييم البشري (RLHF & DPO)", duration: "80 دقيقة", embedId: "7xTGNNLPyMI" },
              { id: "cs324-3", title: "المحاضرة 3: السلامة والأمان ومكافحة الانحياز وتقييم مخرجات النماذج", duration: "78 دقيقة", embedId: "zjkBMFhNj_g" }
            ]
          },
          {
            title: "Deep Dive into LLMs: Post-Training, Alignment, RLHF & Inference",
            instructor: "Andrej Karpathy (Former OpenAI)",
            duration: "3 ساعات و 30 دقيقة شاملة",
            totalCourseHours: "3.5 ساعات",
            courseType: "Comprehensive Masterclass",
            institution: "Independent AI Lab",
            videoUrl: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
            embedId: "7xTGNNLPyMI",
            platform: "YouTube",
            summary: "الشرح الهندسي والبرمجي الأفضل عالمياً لكيفية تدريب نماذج التفضيل البشري والضبط الدقيق للتعليمات ومحاذاة نماذج المحادثة.",
            keyTakeaways: [
              "فهم حساب دوال المكافأة (Reward Function) والـ KL Divergence لمنع تدهور النموذج",
              "تنفيذ خط أنابيب الضبط الدقيق والمحاذاة خطوة بخطوة"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
            authors: "Rafael Rafailov et al. (Stanford)",
            year: 2023,
            arxivUrl: "https://arxiv.org/abs/2305.18290",
            badge: "Best Paper Runner-up (NeurIPS)",
            citation: "The groundbreaking paper introducing Direct Preference Optimization."
          }
        ],
        practicalExercise: {
          prompt: "ماذا يحدث لقيمة خسارة DPO عندما تكون نسبة تفضيل النموذج لـ y_w أعلى بكثير من النموذج المرجعي مقارنة بـ y_l؟",
          initialCode: `# اختبر تأثير زيادة logits على خسارة DPO
import torch
import torch.nn.functional as F

logits = torch.tensor([10.0, 20.0]) # إشارة قوية جداً لصالح chosen
loss = -F.logsigmoid(logits)
print("الخسارة:", loss.mean().item())`,
          expectedOutputHint: "تقترب الخسارة من الصفر تماماً لأن sigmoid(10) تقترب من 1.0 و log(1.0) = 0.",
          solutionCode: `import torch
import torch.nn.functional as F
logits = torch.tensor([10.0, 20.0])
loss = -F.logsigmoid(logits)
print(f"الخسارة عند التفوق الواضح: {loss.mean().item():.6f}")`
        },
        interviewTips: [
          "في مقابلة OpenAI لفرق Alignment: 'ما هي ثغرة DPO مقارنة بـ PPO؟' الإجابة الذكية: DPO مقيد ببيانات التفضيل الثابتة (Off-policy)، ولا يستطيع توليد عينات جديدة واستكشاف الفضاء التوليدي بنمط On-policy كما يفعل PPO، ولهذا ظهرت أبحاث مثل Online DPO و RLoo."
        ]
      }
    ],
    quiz: [
      {
        id: "q7-1",
        question: "ما المعامل الحرج في دالة خسارة DPO الذي يتحكم في مدى التزام النموذج بالمخرج المرجعي (KL penalty constraint)؟",
        options: [
          "معامل التعلم Learning Rate فقط",
          "المعامل بيتا Beta (المعامل التنظيمي لقوة الـ KL Penalty)",
          "حجم الدفعة Batch Size",
          "طول السياق Sequence Length"
        ],
        correctIndex: 1,
        explanation: "المعامل بيتا (Beta) يتحكم في التوازن بين تحسين التفضيل وبين الحفاظ على تشابه النموذج مع السياسة المرجعية لتفادي التراجع اللغوي.",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: 8,
    title: "تحسين الاستنتاج ومحركات التشغيل (Inference Engines: vLLM & PagedAttention)",
    subtitle: "نظام vLLM، خوارزمية PagedAttention، التكميم AWQ و GPTQ، وفك التشفير التخميني Speculative Decoding",
    description: "تدريب النموذج يستهلك الملايين، لكن تشغيله في بيئة الإنتاج يستهلك المليارات. ستتعلم هنا كيف تضاعف سرعة الاستنتاج 5x إلى 10x عبر إدارة الذاكرة الظاهرية والتكميم والـ Batching الحركي بمعايير Berkeley و Stanford.",
    iconName: "Zap",
    estimatedHours: 28,
    badge: "UC Berkeley / vLLM Performance Standard",
    lessons: [
      {
        id: "8-1",
        title: "كيف حلت خوارزمية PagedAttention مشكلة تفتت الذاكرة (Memory Fragmentation)",
        subtitle: "استلهام تقنيات الذاكرة الظاهرية (Virtual Memory & Paging) في أنظمة التشغيل وحفظ الـ KV Cache في كتل غير متصلة",
        duration: "28 ساعة دراسية معتمدة",
        readTime: "25 دقيقة قراءة تفصيلية + 26 ساعة محاضرات ومعامل",
        hoursBreakdown: {
          lecturesHours: 14,
          labHours: 8,
          readingHours: 3,
          projectHours: 3,
          totalHours: 28
        },
        handsOnLabs: [
          {
            title: "معمل بناء وتخصيص محرك PagedAttention والـ Continuous Batching من الصفر",
            difficulty: "Systems Architecture",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1PagedAttention_vLLM_Engine_Lab",
            githubUrl: "https://github.com/vllm-project/vllm",
            description: "برمجة Block Manager لإدارة صفحات الذاكرة الافتراضية للـ KV Cache ومحاكاة استقبال 100 طلب متزامن وقياس كفاءة استغلال VRAM."
          },
          {
            title: "معمل تكميم النماذج بنظام AWQ و GPTQ وقياس سرعة التوليد (Tokens/sec)",
            difficulty: "Kernel Optimization",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Quantization_AWQ_GPTQ_Benchmark",
            githubUrl: "https://github.com/mit-han-lab/llm-awq",
            description: "تطبيق التكميم بدقة 4-bit على LLaMA-3-8B ومقارنة زمن توليد التوكن الأول (TTFT) واستقرار الـ Perplexity."
          }
        ],
        sections: [
          {
            id: "8-1-1",
            title: "أزمة الـ KV Cache الكلاسيكية قبل ابتكار vLLM",
            content: `في أنظمة الاستنتاج السابقة، كان حجز الـ KV Cache يتطلب ذاكرة متصلة مسبقاً (Contiguous Pre-allocation) للحد الأقصى الممكن للطلب (مثلاً 4096 توكن). إذا طلب المستخدم إجابة من 50 توكن فقط، يتم إهدار أكثر من 90% من الـ VRAM المحجوزة! كما أن تفتت الذاكرة (Internal & External Fragmentation) كان يمنع تشغيل أكثر من طلبات قليلة متزامنة.\n\nابتكر باحثو جامعة بيركلي (vLLM) خوارزمية PagedAttention المستوحاة من صفحات الذاكرة الظاهرية لأنظمة التشغيل (OS Paging): يتم تقسيم الـ KV Cache إلى كتل صغيرة (Logical Blocks - مثلاً 16 توكن لكل كتلة)، ويتم تخزينها في أي مكان متاح في الـ VRAM (Physical Blocks)، مع جدول خرائط كتل (Block Table) يربط الكتل المنطقية بالفيزيائية.`,
            takeaway: "خوارزمية PagedAttention قللت إهدار ذاكرة الـ KV Cache من 60-80% إلى أقل من 4%، مما ضاعف إنتاجية النظام (Throughput) بمقدار 2x إلى 4x فوراً."
          }
        ],
        pythonCode: {
          title: "محاكاة جدول كتل الـ KV Cache في PagedAttention",
          filename: "paged_attention_simulator.py",
          explanation: "كود بايثون يوضح كيف يعمل جدول التعيين (Block Table) وتخصيص الكتل الحركي وتشارك الكتل عبر تقنية Copy-on-Write في الـ Parallel Sampling.",
          code: `class PagedAttentionBlockManager:
    def __init__(self, block_size=16, total_gpu_blocks=64):
        self.block_size = block_size
        self.total_blocks = total_gpu_blocks
        self.free_blocks = list(range(total_gpu_blocks))
        self.block_tables = {} # req_id -> list of physical_block_ids
        print(f"تم تهيئة PagedAttention: {total_gpu_blocks} كتلة فيزيائية (كل كتلة {block_size} توكن).")

    def allocate(self, req_id, num_tokens):
        num_blocks = (num_tokens + self.block_size - 1) // self.block_size
        if len(self.free_blocks) < num_blocks:
            raise MemoryError("نفاد كتل الـ VRAM الفيزيائية!")
        
        assigned = [self.free_blocks.pop(0) for _ in range(num_blocks)]
        self.block_tables[req_id] = assigned
        return assigned

    def append_token(self, req_id, current_token_count):
        # فحص هل نحتاج تخصيص كتلة جديدة
        if current_token_count % self.block_size == 0:
            if not self.free_blocks:
                raise MemoryError("نفاد الذاكرة أثناء توليد التوكن الجديد!")
            new_block = self.free_blocks.pop(0)
            self.block_tables[req_id].append(new_block)
            print(f"[طلب {req_id}] تم تخصيص كتلة فيزيائية جديدة رقم: {new_block}")

    def free(self, req_id):
        if req_id in self.block_tables:
            freed = self.block_tables.pop(req_id)
            self.free_blocks.extend(freed)
            print(f"[طلب {req_id}] انتهى التوليد وتم تحرير {len(freed)} كتلة بنجاح.")

# تجربة عملية
mgr = PagedAttentionBlockManager(block_size=16, total_gpu_blocks=10)
# بدء طلب بـ 25 توكن
blocks_assigned = mgr.allocate("req_101", 25)
print(f"الكتل المخصصة لطلب req_101: {blocks_assigned}")
print(f"الكتل الحرة المتبقية في VRAM: {len(mgr.free_blocks)}")

# توليد 8 توكنات إضافية (تتجاوز الكتلة الحالية)
mgr.append_token("req_101", 32)
mgr.free("req_101")
print(f"الكتل الحرة بعد الانتهاء: {len(mgr.free_blocks)}")`
        },
        videoResources: [
          {
            title: "LLaMA & KV-Cache from Scratch: Fast Attention, RoPE & Paged Memory Efficiency",
            instructor: "Umar Jamil (AI Research Engineer)",
            duration: "ساعة و 40 دقيقة شرح عملي",
            videoUrl: "https://www.youtube.com/watch?v=oM4VmoabDAI",
            embedId: "oM4VmoabDAI",
            platform: "YouTube",
            institution: "Independent AI Systems Lab",
            courseType: "GPU Architecture Deep Dive",
            totalCourseHours: "4 ساعات معتمدة",
            summary: "الشرح الأعمق لمعمارية الذاكرة في الاستدلال وكيف تقوم خوارزميات الـ KV-Cache و Rotary Positional Embeddings بتسريع توليد التوكنات وتوفير استهلاك VRAM.",
            keyTakeaways: [
              "كيف تمنع تقنيات الـ KV-Cache إعادة الحساب وتتيح مشاركة الذاكرة بكفاءة",
              "استراتيجيات إدارة مصفوفات الانتباه في سياقات التوليد الطويلة"
            ]
          },
          {
            title: "Attention is All You Need: High-Performance Transformers & Continuous Batching",
            instructor: "Umar Jamil",
            duration: "ساعتان كاملتان",
            videoUrl: "https://www.youtube.com/watch?v=bCz4OMemCcA",
            embedId: "bCz4OMemCcA",
            platform: "YouTube",
            institution: "Deep AI Research",
            courseType: "Distinguished Research Lecture",
            totalCourseHours: "6 ساعات معتمدة",
            summary: "المحاضرة التأسيسية الأكثر دقة لشرح هندسة الانتباه متعدد الرؤوس (Multi-Head Attention) وتدفق الحسابات المتزامنة.",
            keyTakeaways: [
              "المقارنة الهندسية الشاملة بين Static Batching و Dynamic Batching",
              "تحليل استهلاك ذاكرة النماذج في سياقات التوليد الطويلة"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Efficient Memory Management for Large Language Model Serving with PagedAttention",
            authors: "Woosuk Kwon et al. (UC Berkeley)",
            year: 2023,
            arxivUrl: "https://arxiv.org/abs/2309.06180",
            badge: "Best Paper (SOSP 2023)",
            citation: "The original paper that introduced PagedAttention and vLLM."
          },
          {
            title: "FlashAttention-2: Faster Attention with Better Work Partitioning",
            authors: "Tri Dao (Stanford University)",
            year: 2023,
            arxivUrl: "https://arxiv.org/abs/2307.08691",
            badge: "Milestone GPU Paper",
            citation: "The paper behind modern fast attention kernels in PyTorch and CUDA."
          }
        ],
        practicalExercise: {
          prompt: "في نظام تقليدي بدون PagedAttention، إذا كان الحد الأقصى للسياق 4096 توكن، لكن متوسط أطوال الاستعلامات هو 512 توكن، كم نسبة الذاكرة المهدورة؟",
          initialCode: `max_len = 4096
avg_len = 512
# احسب نسبة الإهدار
waste_percent = ((max_len - avg_len) / max_len) * 100
print(f"نسبة الإهدار: {waste_percent:.2f}%")`,
          expectedOutputHint: "نسبة الإهدار تصل إلى 87.5% في النظام التقليدي!",
          solutionCode: `max_len = 4096
avg_len = 512
waste_percent = ((max_len - avg_len) / max_len) * 100
print(f"نسبة الإهدار في الأنظمة التقليدية: {waste_percent:.2f}%")`
        },
        interviewTips: [
          "في مقابلة Groq / NVIDIA / Anyscale: 'ما هو الفرق بين Prefill Phase و Decode Phase في استنتاج المحولات؟' الإجابة الحاسمة: Prefill مرحلة Compute-bound تحسب كل توكنات المدخلات بالتوازي، بينما Decode مرحلة Memory-bound تولد توكناً واحداً في كل خطوة وتعتمد سرعتها على سرعة قراءة الـ KV Cache من HBM."
        ]
      }
    ],
    quiz: [
      {
        id: "q8-1",
        question: "لماذا تعد مرحلة توليد التوكنات (Decode Phase) في المحولات مقيدة بالذاكرة (Memory-Bound) وليست مقيدة بالحوسبة؟",
        options: [
          "لأن معالجات الـ GPU لا تدعم حسابات الجمع",
          "لأننا نحتاج لقراءة جميع أوزان النموذج وذاكرة الـ KV Cache السابقة من الـ HBM لتوليد توكن واحد فقط في كل خطوة",
          "لأن خوارزمية Softmax بطيئة في الـ CPU",
          "لأن نماذج الذكاء الاصطناعي لا تستخدم الـ Caching"
        ],
        correctIndex: 1,
        explanation: "في كل خطوة توليد (Decode Step)، نقوم بتحميل مليارات معلمات النموذج والـ KV Cache عبر ناقل الذاكرة فقط لتنفيذ عملية ضرب متجه في مصفوفة (GEMV)، مما يجعل معدل نقل الذاكرة (Memory Bandwidth) هو عنق الزجاجة الرئيسي.",
        difficulty: "Hard"
      }
    ]
  },
  {
    id: 9,
    title: "الوكلاء الأذكياء والأنظمة متعددة الوسائط (AI Agents & Advanced RAG)",
    subtitle: "بروتوكول استدعاء الأدوات Tool Calling، دورات التفكير والتنفيذ ReAct، تقنيات RAG المتقدمة، و Vision-Language Projectors",
    description: "النماذج اللغوية لم تعد مجرد روبوتات محادثة، بل عقول رقمية قادرة على التخطيط، واستدعاء واجهات البرمجة (APIs)، واسترجاع المعرفة المحدثة، ورؤية الصور والفيديوهات وفق أعلى المعايير الهندسية والبحثية المتقدمة.",
    iconName: "Bot",
    estimatedHours: 25,
    badge: "JINNA Autonomous Agent Standard",
    lessons: [
      {
        id: "9-1",
        title: "هندسة الوكلاء الذاتيين: دورات ReAct، استدعاء الأدوات و بروتوكول MCP",
        subtitle: "كيف يحلل النموذج المشكلات المعقدة، ويولد استدعاءات الدوال المهيكلة JSON، ويصحح أخطاءه ذاتياً",
        duration: "25 ساعة دراسية معتمدة",
        readTime: "25 دقيقة قراءة تفصيلية + 22 ساعة محاضرات وتطبيقات",
        hoursBreakdown: {
          lecturesHours: 12,
          labHours: 8,
          readingHours: 3,
          projectHours: 2,
          totalHours: 25
        },
        handsOnLabs: [
          {
            title: "معمل بناء وكيل ذكي مستقل متعدد الأدوات يدعم بروتوكول MCP و ReAct Loop",
            difficulty: "Agentic Engineering",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1ReAct_Agent_MCP_Pipeline_Lab",
            githubUrl: "https://github.com/anthropics/anthropic-cookbook",
            description: "بناء وكيل كامل يمتلك أدوات تصفح الويب وقواعد البيانات وتشغيل بيئة بايثون مع معالجة الاستثناءات والـ Retry Loops."
          },
          {
            title: "معمل نظام RAG المتقدم: HyDE و Re-ranking وضبط أبعاد الاسترجاع بـ LlamaIndex",
            difficulty: "Information Retrieval",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Advanced_RAG_HyDE_Rerank_Lab",
            githubUrl: "https://github.com/run-llama/llama_index",
            description: "تطبيق تقنيات استرجاع المعرفة الهجينة (Hybrid Search: Dense + Sparse BM25) واستخدام Cross-Encoder لإعادة الترتيب."
          }
        ],
        sections: [
          {
            id: "9-1-1",
            title: "نمط التفكير والعمل (ReAct: Reason + Act)",
            content: `في أبحاث الوكلاء الأذكياء (ورقة ReAct، برينستون وجوجل 2022)، وجد الباحثون أن فصل مسار التفكير (Thought) عن مسار الإجراء (Action) يقلل من الهلوسة بنسبة تفوق 40%. يتبع الوكيل حلقة متكررة:\n1. التفكير (Thought): يحلل الوكيل حالته الحالية وما ينقصه من معلومات.\n2. الإجراء (Action): يستدعي أداة محددة مثل البحث في قاعدة البيانات أو تشغيل كود بايثون.\n3. الملاحظة (Observation): يتلقى مخرجات الأداة.\n4. التكرار أو الإجابة النهائية (Final Answer).`,
            takeaway: "الوكيل الحقيقي ليس مجرد استدعاء API، بل هو نظام حالة متصل ببيئة تفاعلية مع آليات إعادة المحاولة (Retry) والتحقق من صحة المخرجات."
          }
        ],
        pythonCode: {
          title: "بناء وكيل ذكي كامل مع نظام استدعاء الأدوات Tool Dispatcher",
          filename: "react_agent_executor.py",
          explanation: "كود بايثون نقي يبني حلقة وكيل ذكي ReAct يقوم باختيار الأدوات وتمرير المتغيرات ومعالجة الملاحظات تلقائياً.",
          code: `import json

class SimpleAgent:
    def __init__(self):
        self.tools = {
            "query_vram_db": self.query_vram_db,
            "calculate_flops": self.calculate_flops
        }

    def query_vram_db(self, gpu_name):
        db = {"H100": "80GB HBM3 (3.35 TB/s)", "A100": "80GB HBM2e (2.0 TB/s)", "RTX4090": "24GB GDDR6X"}
        return db.get(gpu_name, "معالج غير معروف")

    def calculate_flops(self, params_b, tokens_b):
        # تقريب 6 * P * D لحساب الـ FLOPs للتدريب
        p = float(params_b) * 1e9
        d = float(tokens_b) * 1e9
        flops = 6 * p * d
        return f"{flops / 1e21:.2f} ZettaFLOPs"

    def step(self, user_query):
        print(f"استعلام المستخدم: {user_query}")
        # محاكاة اختيار الوكيل للأداة المناسبة
        if "H100" in user_query:
            tool_name = "query_vram_db"
            args = {"gpu_name": "H100"}
        else:
            tool_name = "calculate_flops"
            args = {"params_b": 70, "tokens_b": 2000}
            
        print(f"[Thought]: أحتاج لاستدعاء أداة {tool_name} بالمدخلات {args}")
        # تنفيذ الأداة
        result = self.tools[tool_name](**args)
        print(f"[Observation]: نتيجة استدعاء الأداة: {result}")
        print(f"[Final Answer]: بناءً على الأداة، الإجابة هي: {result}")

agent = SimpleAgent()
agent.step("ما هي مواصفات ذاكرة بطاقة H100؟")`
        },
        videoResources: [
          {
            title: "Building Agentic AI Workflows: Reflection, Tool Use, Planning & Multi-Agent",
            instructor: "Andrew Ng (Stanford University Professor)",
            duration: "42 دقيقة تدريب استراتيجي",
            videoUrl: "https://www.youtube.com/watch?v=sal78ACtGTc",
            embedId: "sal78ACtGTc",
            platform: "YouTube",
            institution: "Stanford University",
            courseType: "Executive Masterclass",
            totalCourseHours: "10 ساعات معتمدة",
            summary: "محاضرة تاريخية من البروفيسور أندرو إنغ يشرح فيها النقلة النوعية من مجرد إرسال برومبت إلى بناء وكلاء ذكاء اصطناعي ذاتية التحسين عبر التخطيط واستدعاء الأدوات.",
            keyTakeaways: [
              "الأنماط الأربعة لبناء الوكلاء: Reflection, Tool Use, Planning, Multi-Agent Collaboration",
              "إدارة سياق الذاكرة طويلة المدى وتقنيات تصحيح الأخطاء الذاتية"
            ]
          },
          {
            title: "Intro to Large Language Models: Architectures, Reasoning & Agents",
            instructor: "Andrej Karpathy (Former OpenAI & Tesla AI Director)",
            duration: "ساعة كاملة مكثفة",
            videoUrl: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
            embedId: "zjkBMFhNj_g",
            platform: "YouTube",
            institution: "Independent AI Masterclass",
            courseType: "Foundational Masterclass",
            totalCourseHours: "4 ساعات دراسية",
            summary: "شرح شامل من أندريه كارباثي عن نماذج اللغة الكبيرة وقدرات التفكير واستدعاء الأدوات وبناء أنظمة الوكلاء الذاتية والتطبيقات المستقبلية.",
            keyTakeaways: [
              "فهم نماذج التفكير واستدعاء الأدوات والتفاعل مع البيئة الخارجية",
              "بروتوكولات الأمان والتحكم في صلاحيات تنفيذ الأوامر للوكلاء"
            ]
          }
        ],
        referencePapers: [
          {
            title: "ReAct: Synergizing Reasoning and Acting in Language Models",
            authors: "Shunyu Yao et al. (Princeton & Google)",
            year: 2022,
            arxivUrl: "https://arxiv.org/abs/2210.03629",
            badge: "Pioneering Agent Paper",
            citation: "The seminal paper demonstrating combining reasoning traces with task-specific actions."
          }
        ],
        practicalExercise: {
          prompt: "صمم مخطط JSON Schema صالح لتعريف أداة (Tool Definition) تستقبل اسم النموذج اللغوي وترجع حجم الـ VRAM المطلوب.",
          initialCode: `tool_schema = {
    "name": "get_model_vram",
    "description": "تسترجع حجم الذاكرة المطلوب لنموذج لغوي محدد",
    "parameters": {
        "type": "object",
        # أكمل الحقول المطلوبة وخصائص المعاملات
    }
}`,
          expectedOutputHint: "تأكد من وجود 'properties' و 'required'.",
          solutionCode: `tool_schema = {
    "name": "get_model_vram",
    "description": "تسترجع حجم الذاكرة المطلوب لنموذج لغوي محدد",
    "parameters": {
        "type": "object",
        "properties": {
            "model_name": {"type": "string", "description": "اسم النموذج مثل LLaMA-3-70B"}
        },
        "required": ["model_name"]
    }
}`
        },
        interviewTips: [
          "في مقابلة AI Platform Engineer: 'كيف تضمن عدم وقوع الوكيل في حلقة تكرار لانهائية (Infinite Loop) عند استدعاء الأدوات؟' الإجابة: تحديد سقف أقصى للخطوات (Max Iteration Guardrail)، تتبع بصمة الإجراءات السابقة لمنع تكرار نفس المعاملات، واستخدام آلية Fallback للإجابة البشرية."
        ]
      }
    ],
    quiz: [
      {
        id: "q9-1",
        question: "ما هو المبدأ الرئيسي لنمط ReAct مقارنة بنمط Chain-of-Thought (CoT) البسيط؟",
        options: [
          "ReAct يلغي الحاجة لاستخدام نماذج المحولات",
          "ReAct يدمج التفكير الذاتي الداخلي مع القدرة على تنفيذ إجراءات خارجية والتفاعل مع بيئة حقيقية",
          "ReAct يعمل فقط مع النماذج الصوتية",
          "ReAct يسرع عملية التوليد بمقدار 100 ضعف"
        ],
        correctIndex: 1,
        explanation: "نمط ReAct يجمع بين مسارات الاستدلال (Reasoning traces) وبين الإجراءات التفاعلية (Actions) مع البيئات الخارجية مثل محركات البحث وقواعد البيانات وواجهات البرمجة.",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: 10,
    title: "مشاريع التخرج والتحضير لمقابلات كبرى شركات الذكاء الاصطناعي (Meta & OpenAI Prep)",
    subtitle: "تدريب نموذج GPT كامل، نشره على Hugging Face، ودليل المقابلات التقنية لمهندسي وباحثي الذكاء الاصطناعي",
    description: "المحطة الختامية للتحول إلى مهندس وباحث ذكاء اصطناعي من الطراز الأول. سنبني هنا مشروع تخرج متكامل، ونجهز Portfolio احترافي، ونستعرض أصعب أسئلة المقابلات في Meta وOpenAI.",
    iconName: "Award",
    estimatedHours: 30,
    badge: "Meta & OpenAI Staff AI Engineer Standard",
    lessons: [
      {
        id: "10-1",
        title: "مشروع التخرج الشامل: تدريب ونشر نموذج لغوي متكامل على Hugging Face Hub",
        subtitle: "من تهيئة المعمارية وتدريب التوكنات، إلى التدريب الفعلي ورفع الأوزان وكتابة Model Card علمي رصين",
        duration: "30 ساعة دراسية معتمدة",
        readTime: "30 دقيقة قراءة تفصيلية + 28 ساعة مشروع وتطبيقات",
        hoursBreakdown: {
          lecturesHours: 10,
          labHours: 12,
          readingHours: 3,
          projectHours: 5,
          totalHours: 30
        },
        handsOnLabs: [
          {
            title: "مشروع التخرج: تدريب نموذج Decoder-Only كامل مع RoPE و GQA من الصفر في PyTorch",
            difficulty: "Staff Engineering Capstone",
            estimatedHours: "8 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Capstone_Full_LLM_Pretraining_Lab",
            githubUrl: "https://github.com/karpathy/nanoGPT",
            description: "بناء المعمارية وحساب الخسارة وحفظ الـ Checkpoints وتصدير النموذج بصيغة Safetensors إلى Hugging Face Hub."
          },
          {
            title: "معمل محاكاة مقابلات System Design للذكاء الاصطناعي في Meta و Google DeepMind",
            difficulty: "System Design Masterclass",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1AI_Systems_Design_Interview_Sim",
            githubUrl: "https://github.com/alirezadir/Production-Level-Deep-Learning",
            description: "حل سيناريوهات حقيقية لتصميم بنية تحتية لتدريب واستنتاج نماذج 70B و 405B وتوزيع الذاكرة والشبكات."
          }
        ],
        sections: [
          {
            id: "10-1-1",
            title: "معايير الـ Portfolio المتميز لباحثي ومهندسي النظم",
            content: `لا تبحث شركات الذكاء الاصطناعي العالمية عن من يعرف استخدام واجهات برمجة جاهزة (API Callers)، بل يبحثون عن مهندسين وباحثين يفهمون ما يحدث داخل الـ Kernel والذاكرة:\n\n1. مشروع إعادة بناء معمارية حديثة (Cleanroom Implementation): بناء معمارية LLaMA أو Mistral أو FlashAttention من الصفر بـ PyTorch ومقارنة النتائج بنسخة Hugging Face الرسمية.\n2. مشروع تحسين استنتاج عالي الأداء (High-Performance Serving): كتابة خادم استنتاج يدعم Continuous Batching وتكميم INT4/FP8 مع قياسات دقيقة لـ TTFT (Time-to-First-Token) و Inter-Token Latency.\n3. أوراق بحثية ومدونات تقنية دقيقة: كتابة تحليلات رياضية وهندسية مفصلة مع رسوم بيانية توضح مسارات التدرجات والـ VRAM Profile.`,
            takeaway: "الـ Codebase النظيف الموثق باختبارات Unit Tests وقياسات الأداء الحقيقية هو بطاقة عبورك الأقوى لمقابلات Meta وGoogle DeepMind وOpenAI."
          }
        ],
        pythonCode: {
          title: "كود رفع نموذج وبطاقة النموذج المكتملة إلى Hugging Face Hub",
          filename: "push_to_hf_hub.py",
          explanation: "سكربت بايثون لتصدير أوزان النموذج والـ Tokenizer وتوليد بطاقة نموذج (Model Card) متوافقة مع المعايير القياسية.",
          code: `import os

def create_model_card_markdown():
    return """---
language:
- ar
- en
license: apache-2.0
tags:
- transformer
- research-engineering
- pytorch
---

# نموذج الأنظمة اللغوية المصغر (AI Systems Mini-LLM)

تم بناء وتدريب هذا النموذج من الصفر كجزء من مسار أبحاث ونظم الذكاء الاصطناعي المتقدمة.

## المواصفات المعمارية:
- **المعمارية**: Decoder-only Transformer مع RMSNorm و SwiGLU
- **التشفير الموضعي**: Rotary Positional Embedding (RoPE)
- **آلية الانتباه**: Grouped-Query Attention (GQA)
- **حجم المفردات**: 32,000 توكن مدرب بنظام Byte-level BPE
- **طول السياق المدعوم**: 4,096 توكن

## الاستخدام البرمجي:
\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("username/ai-systems-mini-llm")
model = AutoModelForCausalLM.from_pretrained("username/ai-systems-mini-llm")
\`\`\`
"""

print("تم تجهيز بطاقة النموذج القياسية (Model Card):")
print(create_model_card_markdown()[:300] + "... [بقية البطاقة]")`
        },
        videoResources: [
          {
            title: "Coding LLaMA Architecture from Scratch in PyTorch (KV-Cache, RoPE & SwiGLU)",
            instructor: "Umar Jamil (AI Research Engineer)",
            duration: "ساعة و 40 دقيقة تدريب معمق",
            videoUrl: "https://www.youtube.com/watch?v=oM4VmoabDAI",
            embedId: "oM4VmoabDAI",
            platform: "YouTube",
            institution: "Independent AI Architecture Research",
            courseType: "Production Engineering Deep Dive",
            totalCourseHours: "4 ساعات معتمدة",
            summary: "شرح شامل وبناء معمارية Meta LLaMA بالكامل: Rotary Positional Embeddings (RoPE), SwiGLU, RMSNorm, KV-Cache وتجهيز النموذج للإنتاج الفعلي.",
            keyTakeaways: [
              "فهم تقنيات تسريع الانتباه وتقليل حجم KV-Cache بنسبة تتجاوز 80%",
              "كيف تجيب على أسئلة مقايضة الذاكرة بالحوسبة في مقابلات كبرى شركات الذكاء الاصطناعي"
            ]
          },
          {
            title: "AI Systems Design & Frontiers: Full Pipeline from Training to Production",
            instructor: "Andrej Karpathy (Former OpenAI & Microsoft Build)",
            duration: "ساعة ونصف مراجعة شاملة",
            videoUrl: "https://www.youtube.com/watch?v=bZQun8Y4L2A",
            embedId: "bZQun8Y4L2A",
            platform: "YouTube",
            institution: "OpenAI / Microsoft Build",
            courseType: "Elite Architecture Workshop",
            totalCourseHours: "4 ساعات معتمدة",
            summary: "دليل عملي لتصميم وبناء نظم الذكاء الاصطناعي والشبكات العصبية الكبيرة وإدارة الـ Trade-offs بين الدقة والسرعة وتكلفة الحوسبة واستراتيجيات النشر للإنتاج.",
            keyTakeaways: [
              "هيكلة هندسة النظام المتكامل من مرحلة جمع البيانات والتجهيز حتى الاستدلال الحي",
              "استراتيجيات المراقبة ورصد الأداء في بيئات الإنتاج الحية"
            ]
          }
        ],
        referencePapers: [
          {
            title: "The Llama 3 Herd of Models",
            authors: "Meta AI LLaMA Team",
            year: 2024,
            arxivUrl: "https://arxiv.org/abs/2407.21783",
            badge: "Modern Benchmark",
            citation: "The comprehensive engineering and research report for training LLaMA 3 on 16K GPUs."
          }
        ],
        practicalExercise: {
          prompt: "اكتب الإطار المنهجي (Framework) المكون من 5 خطوات للإجابة على سؤال 'صمم نظام تدريب وتوزيع نموذج لغوي ضخم 70B' في مقابلة System Design.",
          initialCode: `# اكتب الخطوات الخمس الرئيسية لإجابة سؤال تصميم الأنظمة
steps = [
    # 1. توضيح المتطلبات والقيود (Requirements & Constraints)
    # 2. ...
]`,
          expectedOutputHint: "1. المتطلبات وحجم البيانات، 2. ميزانية الحوسبة والـ VRAM، 3. استراتيجية الموازاة (TP/PP/DP)، 4. خط أنابيب البيانات والتحقق، 5. معالجة الأعطال (Fault Tolerance & Checkpointing).",
          solutionCode: `steps = [
    "1. توضيح المتطلبات والقيود وحساب ميزانية الـ FLOPs والـ VRAM",
    "2. اختيار المعمارية (GQA, RoPE, RMSNorm) وحجم المعجم",
    "3. استراتيجية التوزيع الهجين (3D Parallelism: TP=8, PP=4, DP=8)",
    "4. شبكة الربط والاتصالات (InfiniBand, NCCL Overlap)",
    "5. استراتيجية المراقبة وحفظ الحالات المرجعية (Checkpointing & Fault Tolerance)"
]
for s in steps:
    print(s)`
        },
        interviewTips: [
          "في المقابلة النهائية في Meta / OpenAI: لا تبدأ أبداً بكتابة الحل فوراً؛ ابدأ بحساب الأرقام التقريبية أولاً (Back-of-the-envelope calculations): كم بايت في الذاكرة؟ كم فلوبس؟ كم عقدة حوسبة نحتاج؟ هذا هو ما يميز كبار المهندسين."
        ]
      }
    ],
    quiz: [
      {
        id: "q10-1",
        question: "عند تصميم عنقود حوسبة لتدريب نموذج 405 مليار معلمة، ما هي الأولوية الهندسية الأولى لضمان عدم توقف التدريب عند تعطل إحدى بطاقات الـ GPU؟",
        options: [
          "إلغاء استخدام مسرى NVLink",
          "نظام حفظ نقاط التفتيش غير المتزامن والسريع (Asynchronous Checkpointing) مع استبدال العقد الفاشلة تلقائياً دون إعادة تشغيل العنقود بالكامل",
          "تقليل عدد طبقات النموذج إلى 4 طبقات",
          "استخدام دقة FP64 في كل الحسابات"
        ],
        correctIndex: 1,
        explanation: "عند تشغيل آلاف الـ GPUs، يكون معدل تعطل العتاد (Hardware Failure Rate) حتمياً ويحدث كل بضع ساعات. نظام Checkpointing غير المتزامن إلى جانب آليات استبدال العقد التلقائي يضمن استمرار التدريب بنسبة استغلال عالية (High MFU).",
        difficulty: "Hard"
      }
    ]
  }
];
