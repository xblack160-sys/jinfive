import { Chapter } from '../types';

export const chaptersPart1: Chapter[] = [
  {
    id: 1,
    title: "عتاد الحوسبة وإدارة الذاكرة (Hardware, VRAM & CUDA)",
    subtitle: "المعالجات (CPU vs GPU vs TPU)، معمارية NVLink، حسابات الذاكرة، وCUDA Kernels",
    description: "فهم العتاد الفيزيائي هو الفارق الجوهري بين مهندس الذكاء الاصطناعي العادي وكبير مهندسي النظم. ستتعلم هنا كيف تتدفق البيانات بين HBM وSRAM وCompute Cores وكيف تدير الـ VRAM حتى آخر ميغابايت.",
    iconName: "Cpu",
    estimatedHours: 50,
    badge: "Hardware & Memory Architect",
    lessons: [
      {
        id: "1-1",
        title: "معمارية المعالجات: CPU vs GPU vs TPU ومسارات البيانات",
        subtitle: "الفرق الجوهري بين المعالجة التسلسلية والمتوازية، ونطاق نقل البيانات عبر PCIe وNVLink",
        duration: "30 ساعة دراسية شاملة",
        readTime: "30 دقيقة قراءة تفكيكية + 25 ساعة محاضرات ومعامل",
        hoursBreakdown: {
          lecturesHours: 16,
          labHours: 8,
          readingHours: 3,
          projectHours: 3,
          totalHours: 30
        },
        handsOnLabs: [
          {
            title: "معمل قياس نطاق نقل البيانات عبر PCIe و VRAM Memory Bandwidth",
            difficulty: "Advanced Systems",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1GPU_Bandwidth_Benchmark_PyTorch",
            githubUrl: "https://github.com/pytorch/pytorch/tree/main/benchmarks/operator_benchmark",
            description: "برمجة Benchmark كامل في PyTorch وCUDA لقياس سرعة نقل التنسورات بين Host RAM وDevice VRAM واكتشاف سقف الأداء وفق Roofline Model."
          },
          {
            title: "كتابة أول CUDA Kernel بنظام NVIDIA Triton و PyTorch C++ Extension",
            difficulty: "Kernel Engineering",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Triton_GPU_Kernel_Vector_Add",
            githubUrl: "https://github.com/openai/triton",
            description: "بناء Kernel لجمع وضرب المصفوفات فائق السرعة وتجاوز مفسر بايثون للعمل مباشرة داخل وحدات الـ Streaming Multiprocessors (SMs)."
          }
        ],
        sections: [
          {
            id: "1-1-1",
            title: "لماذا تفوقت الـ GPUs على الـ CPUs في تدريب نماذج الذكاء الاصطناعي؟",
            content: `تعتمد معالجات الـ CPU على تصميم يحسن زمن الوصول (Latency-Oriented) لنواة واحدة أو عدد قليل من الأنوية المعقدة المزودة بذاكرة كاش ضخمة (L1/L2/L3) ووحدات تنبؤ تفرع متقدمة (Branch Predictor). على النقيض التام، صُممت الـ GPUs بنمط تحسين الإنتاجية المتزامنة (Throughput-Oriented)، حيث تحتوي شريحة مثل NVIDIA H100 على ما يزيد عن 16,896 نواة CUDA و528 نواة Tensor.\n\nفي تدريب النماذج اللغوية، العملية الحسابية الأساسية هي ضرب المصفوفات الكثيفة (General Matrix Multiply - GEMM)، وهي عمليات متوازية بإحكام ومستقلة يمكن تقسيمها على آلاف خيوط التنفيذ (Threads) المتزامنة.`,
            mathFormulas: [
              "\\text{Compute Intensity} = \\frac{\\text{FLOPs}}{\\text{Bytes transferred from HBM}}",
              "\\text{Throughput} = \\min(\\text{Peak FLOPs}, \\text{Memory Bandwidth} \\times \\text{Arithmetic Intensity})"
            ],
            architectureDiagram: "Host CPU (PCIe Gen5: 64 GB/s bidirectional) <---> GPU HBM3 (3.35 TB/s Bandwidth) <---> SM (Streaming Multiprocessors) <---> Tensor Cores & Shared Memory (L1 SRAM: ~33 TB/s)",
            takeaway: "الـ CPU يدير المنطق والجدولة، بينما الـ GPU ينفذ الحوسبة المتوازية فائقة الكثافة. عنق الزجاجة الأول غالباً ما يكون نقل البيانات عبر PCIe وليس سرعة الحساب."
          },
          {
            id: "1-1-2",
            title: "شبكات الترابط البيني: NVLink 4 vs PCIe Gen 5 وحساب زمن التزامن",
            content: `عند تدريب نماذج بمليارات المعلمات، تصبح الـ GPU الواحدة غير كافية، ويتحتم علينا الربط بين عدة وحدات معالجة. في حين يوفر مسرى PCIe Gen5 سرعة نقل تبلغ 64 جيجابايت/ثانية في كل اتجاه، يوفر جيل NVLink 4 في شريحة H100 سرعة نقل مهولة تصل إلى 900 جيجابايت/ثانية ثنائية الاتجاه (أسرع بنحو 14 ضعفاً!).\n\nهذا الفارق الهائل في نطاق التردد (Bandwidth) هو ما يجعل تقنيات موازاة التنسور (Tensor Parallelism) ممكنة داخل السيرفر الواحد (DGX Node)، حيث تتطلب عملية All-Reduce تبادل أوزان المصفوفات عند كل طبقة في أجزاء من الميلي ثانية.`,
            takeaway: "تُنفذ موازاة التنسور (Tensor Parallelism) حصراً عبر قنوات NVLink فائقة السرعة، بينما تُستخدم شبكات InfiniBand/RoCE (400-800 Gbps) للموازاة بين السيرفرات."
          }
        ],
        pythonCode: {
          title: "فحص مواصفات الـ GPU وتدفق الذاكرة بـ PyTorch",
          filename: "gpu_bandwidth_profiler.py",
          explanation: "يقوم هذا الكود بالاستعلام عن مواصفات عتاد الـ GPU، وتوليد مصفوفة تنسور ضخمة، وقياس سرعة المعالجة الفعلية (TFLOPs) وحجم الذاكرة المحجوزة.",
          code: `import torch
import time

def profile_gpu_compute():
    if not torch.cuda.is_available():
        print("CUDA غير متوفر. جاري المحاكاة على الـ CPU...")
        device = torch.device("cpu")
    else:
        device = torch.device("cuda:0")
        props = torch.cuda.get_device_properties(device)
        print(f"اسم المعالج: {props.name}")
        print(f"الذاكرة الكلية (VRAM): {props.total_memory / (1024**3):.2f} GB")
        print(f"عدد معالجات التدفق (SMs): {props.multi_processor_count}")

    # مصفوفات بحجم 4096 x 4096 لحساب 2 * N^3 عمليات نقطية عائمة (FLOPs)
    N = 4096
    print(f"\\nتوليد مصفوفتين بحجم {N}x{N} بنوع بيانات bfloat16...")
    
    dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float32
    A = torch.randn(N, N, device=device, dtype=dtype)
    B = torch.randn(N, N, device=device, dtype=dtype)

    # تسخين المعالج (Warm-up)
    for _ in range(5):
        _ = torch.matmul(A, B)
    if device.type == "cuda":
        torch.cuda.synchronize()

    # قياس الأداء الفعلي
    iterations = 20
    start = time.perf_counter()
    for _ in range(iterations):
        C = torch.matmul(A, B)
    if device.type == "cuda":
        torch.cuda.synchronize()
    elapsed = time.perf_counter() - start

    # حساب الـ TFLOPs
    total_flops = iterations * (2 * (N ** 3))
    tflops = (total_flops / elapsed) / 1e12

    print(f"الزمن الإجمالي: {elapsed:.4f} ثانية ({elapsed/iterations*1000:.2f} ms لكل ضرب)")
    print(f"الإنتاجية الحسابية المحققة: {tflops:.2f} TFLOPs")
    
    if device.type == "cuda":
        allocated = torch.cuda.memory_allocated() / (1024**2)
        reserved = torch.cuda.memory_reserved() / (1024**2)
        print(f"الذاكرة المستخدمة: {allocated:.1f} MB | المحجوزة لدى PyTorch Caching Allocator: {reserved:.1f} MB")

if __name__ == "__main__":
    profile_gpu_compute()`
        },
        videoResources: [
          {
            title: "CMU 15-442 / 10-414: Deep Learning Systems - Hardware & GPU Architectures",
            instructor: "Tianqi Chen (Creator of XGBoost & TVM) & Zico Kolter (Carnegie Mellon University)",
            duration: "24 ساعة محاضرات جامعية كاملة",
            totalCourseHours: "24 ساعة معتمدة",
            courseType: "GPU Architecture & CUDA Course",
            institution: "FreeCodeCamp & GPU Architecture Lab",
            videoUrl: "https://www.youtube.com/watch?v=86FAWCzIe_4",
            playlistUrl: "https://www.youtube.com/watch?v=86FAWCzIe_4",
            slidesUrl: "https://docs.nvidia.com/cuda/",
            codeRepoUrl: "https://github.com/cuda-samples",
            embedId: "86FAWCzIe_4",
            platform: "YouTube",
            summary: "المقرر الجامعي الأقوى لفهم هندسة نظم العتاد ومعمارية الـ GPU وبرمجة الـ CUDA Kernels والحوسبة المتوازية ومحركات الاستدلال من الصفر.",
            keyTakeaways: [
              "فهم التسلسل الهرمي للذاكرة (HBM, L2 Cache, L1 Shared Memory, Registers)",
              "كيفية برمجة وتجميع الـ Kernels وتجنب عنق الزجاجة في نقل البيانات عبر PCIe",
              "بناء محرك تسريع مصفوفات متوازي بلغة C++ وCUDA"
            ],
            lectures: [
              { id: "cuda-1", title: "المحاضرة 1: مقدمة في الحوسبة الفائقة وبيئة التعلم العميق ونظم GPUs", duration: "75 دقيقة", embedId: "86FAWCzIe_4", startTime: 0 },
              { id: "cuda-2", title: "المحاضرة 2: معمارية GPU وإعداد CUDA وأنوية المعالجة المتوازية", duration: "80 دقيقة", embedId: "86FAWCzIe_4", startTime: 1100 },
              { id: "cuda-3", title: "المحاضرة 3: كتابة وتشغيل أول CUDA Kernels والتعامل مع Threads و Blocks", duration: "78 دقيقة", embedId: "86FAWCzIe_4", startTime: 2710 },
              { id: "cuda-4", title: "المحاضرة 4: تحسين عمليات ضرب المصفوفات GEMM والتسلسل الهرمي للذاكرة", duration: "82 دقيقة", embedId: "86FAWCzIe_4", startTime: 5700 }
            ]
          },
          {
            title: "Intro to Large Language Models: Hardware, VRAM, Training & Compute Clusters",
            instructor: "Andrej Karpathy (Former OpenAI & Tesla AI Director)",
            duration: "ساعة كاملة مكثفة",
            totalCourseHours: "ساعة مكثفة",
            courseType: "Industry Masterclass",
            institution: "OpenAI / Independent",
            videoUrl: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
            embedId: "zjkBMFhNj_g",
            platform: "YouTube",
            summary: "نظرة شمولية استثنائية من أندريه كارباثي عن عتاد الحوسبة، وحدات الـ GPU، مزارع الخوادم، تدفق الـ VRAM، وتكلفة التدريب والاستنتاج.",
            keyTakeaways: [
              "فهم معمارية كتل المعالجة في الـ GPU والفرق الحقيقي بين الـ Pre-training والـ Inference",
              "إدراك متطلبات الـ VRAM والاتصال البيني بين كروت الشاشة"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Demystifying the NVIDIA Ampere & Hopper Architecture for Deep Learning",
            authors: "NVIDIA Whitepaper Team",
            year: 2023,
            arxivUrl: "https://arxiv.org/abs/2210.15570",
            badge: "Foundational Architecture",
            citation: "NVIDIA Technical Report on Transformer Engine and 4th Gen NVLink."
          }
        ],
        practicalExercise: {
          prompt: "اكتب دالة بايثون تقيس معدل نقل البيانات (PCIe Transfer Bandwidth) بوحدة GB/s بين ذاكرة الـ RAM الرئيسية وذاكرة الـ VRAM لمصفوفة بحجم 1GB.",
          initialCode: `import torch, time

def test_pcie_transfer():
    size_bytes = 1024 * 1024 * 1024 # 1 GB
    # أكمل الكود هنا: أنشئ التنسور على الـ CPU ثم انقله إلى الـ CUDA وقس الزمن
    pass`,
          expectedOutputHint: "المعدل يجب أن يقع بين 20 إلى 55 GB/s اعتماداً على جيل مسرى PCIe لديك.",
          solutionCode: `import torch, time

def test_pcie_transfer():
    num_floats = 256 * 1024 * 1024 # 256M float32 = 1 GB
    cpu_tensor = torch.randn(num_floats, dtype=torch.float32, pin_memory=True)
    
    torch.cuda.synchronize()
    start = time.perf_counter()
    gpu_tensor = cpu_tensor.to('cuda', non_blocking=True)
    torch.cuda.synchronize()
    duration = time.perf_counter() - start
    
    bandwidth_gbs = 1.0 / duration
    print(f"معدل نقل PCIe المحقق: {bandwidth_gbs:.2f} GB/s")
    return bandwidth_gbs`
        },
        interviewTips: [
          "في مقابلة Meta Systems: إذا سُئلت عن الفرق بين Memory Bandwidth و Compute Throughput، اذكر فوراً سقف الأداء (Roofline Model) وحساب الـ Arithmetic Intensity.",
          "في مقابلة OpenAI: تأكد من معرفة سبب استخدام Pinned Memory (Page-locked memory) لتسريع عمليات النقل بين Host وDevice دون تدخل الـ CPU."
        ]
      },
      {
        id: "1-2",
        title: "تشريح VRAM وحساب ميزانية الذاكرة (Memory Budgeting)",
        subtitle: "أوزان النماذج، حالات المحسن (AdamW)، التدرجات (Gradients)، وتنشيطات الطبقات (Activations)",
        duration: "24 ساعة دراسية معتمدة",
        readTime: "20 دقيقة قراءة تفصيلية + 20 ساعة محاضرات ومعامل",
        hoursBreakdown: {
          lecturesHours: 12,
          labHours: 7,
          readingHours: 3,
          projectHours: 2,
          totalHours: 24
        },
        handsOnLabs: [
          {
            title: "معمل قياس وحساب ميزانية VRAM ومراقبة تسريب الذاكرة باستخدام PyTorch CUDA Memory Snapshot",
            difficulty: "Advanced",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1PyTorch_VRAM_Snapshot_Lab",
            githubUrl: "https://github.com/pytorch/pytorch",
            description: "تحليل وتتبع استهلاك الذاكرة في كل طبقة مع استخدام أداة torch.cuda.memory._record_memory_history لكشف الـ Fragmentation."
          },
          {
            title: "معمل تكميم النماذج إلى 4-بت (INT4 AWQ & GPTQ) لقياس توفير الـ VRAM وسرعة الاستدلال",
            difficulty: "Intermediate",
            estimatedHours: "3 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Quantization_AWQ_Lab",
            githubUrl: "https://github.com/mit-han-lab/llm-awq",
            description: "تطبيق عملي لتخفيض حجم نموذج 8B من 16GB إلى 4.5GB وتشغيله بسلاسة على كرت شاشة تجاري."
          }
        ],
        sections: [
          {
            id: "1-2-1",
            title: "المكونات الأربعة الأساسية لاستهلاك الذاكرة أثناء التدريب",
            content: `يخطئ الكثيرون بالاعتقاد أن حجم النموذج في الذاكرة يساوي عدد المعلمات مضروباً في حجم البايت فقط. في الواقع، يتطلب تدريب نموذج بحجم 7 مليار معلمة (7B) بدقة 16-بت (Mixed Precision) ما يصل إلى 112 إلى 120 جيجابايت من الـ VRAM! إليك التشريح الدقيق:\n\n1. أوزان النموذج (Model Parameters): لكل معلمة 2 بايت في FP16/BF16 (أو 1 بايت في FP8).\n2. التدرجات (Gradients): 2 بايت لكل معلمة في BF16.\n3. حالات المحسن (Optimizer States - AdamW):\n   - نسخة المعلمات بدقة FP32 (4 بايت)\n   - العزم الأول First Momentum (4 بايت)\n   - العزم الثاني Second Variance (4 بايت)\n   المجموع = 12 إلى 16 بايت لكل معلمة!\n4. التنشيطات (Activation Memory): تخزين المخرجات الوسطية لكل طبقة للانتشار الخلفي، وهو يتناسب طردياً مع طول السياق (Sequence Length) وحجم الدفعة (Batch Size).`,
            mathFormulas: [
              "\\text{Memory}_{\\text{Weights}} = P \\times 2 \\text{ bytes}",
              "\\text{Memory}_{\\text{Gradients}} = P \\times 2 \\text{ bytes}",
              "\\text{Memory}_{\\text{AdamW}} = P \\times 16 \\text{ bytes}",
              "\\text{Static Training Memory} = P \\times (2 + 2 + 16) = P \\times 20 \\text{ bytes}"
            ],
            takeaway: "لنموذج 7B معلمات: الذاكرة الثابتة بدون تنشيطات = 7 × 10^9 × 20 بايت ≈ 140 جيجابايت! لذلك لا يمكن تدريب 7B على كرت RTX 4090 واحد (24GB) بدون تقنيات التوزيع أو LoRA."
          }
        ],
        pythonCode: {
          title: "حاسبة ميزانية الذاكرة الدقيقة لأي نموذج لغوي",
          filename: "llm_vram_calculator.py",
          explanation: "برنامج عملي يحسب بالتفصيل متطلبات الـ VRAM لمراحل التدريب الكامل (Full Fine-Tuning) والاستنتاج (Inference) مع حساب حجم الـ KV Cache.",
          code: `def calculate_llm_memory(params_billion, precision_bits=16, seq_len=4096, batch_size=1, is_training=True):
    bytes_per_param = precision_bits / 8.0
    p = params_billion * 1e9
    
    # 1. وزن النموذج
    weight_mem_gb = (p * bytes_per_param) / (1024**3)
    
    if is_training:
        grad_mem_gb = (p * bytes_per_param) / (1024**3)
        # AdamW يحفظ المعلمات بدقة FP32 + First Moment + Second Moment = 16 bytes
        opt_mem_gb = (p * 16) / (1024**3)
        static_total_gb = weight_mem_gb + grad_mem_gb + opt_mem_gb
        return {
            "Weight (GB)": round(weight_mem_gb, 2),
            "Gradients (GB)": round(grad_mem_gb, 2),
            "Optimizer (AdamW) (GB)": round(opt_mem_gb, 2),
            "Static Training Total (GB)": round(static_total_gb, 2),
            "Minimum 80GB GPUs needed": -(-int(static_total_gb) // 80)
        }
    else:
        # الاستنتاج: وزن النموذج + KV Cache
        # تقريب KV Cache لنموذج مثل LLaMA: 2 * num_layers * num_kv_heads * head_dim * seq_len * batch
        kv_cache_estimate_gb = (2 * 32 * 8 * 128 * seq_len * batch_size * bytes_per_param) / (1024**3)
        return {
            "Model Weights (GB)": round(weight_mem_gb, 2),
            "KV Cache Estimate (GB)": round(kv_cache_estimate_gb, 2),
            "Total Inference RAM (GB)": round(weight_mem_gb + kv_cache_estimate_gb, 2)
        }

print("ميزانية تدريب نموذج LLaMA 3 (8B) بدقة BF16:")
print(calculate_llm_memory(8, precision_bits=16, is_training=True))

print("\\nميزانية استنتاج نموذج 70B بسياق 8k و batch_size=4:")
print(calculate_llm_memory(70, precision_bits=16, seq_len=8192, batch_size=4, is_training=False))`
        },
        videoResources: [
          {
            title: "MIT 6.S191: Introduction to Deep Learning & Neural Network Computation",
            instructor: "Alexander Amini & Ava Soleimany (MIT)",
            duration: "18 ساعة محاضرات متسلسلة",
            totalCourseHours: "18 ساعة معتمدة",
            courseType: "Full University Course",
            institution: "MIT (Massachusetts Institute of Technology)",
            videoUrl: "https://www.youtube.com/playlist?list=PLtBw6njkvG-WEkx1y0m8aA4gA2B7kLSmZ",
            playlistUrl: "https://www.youtube.com/playlist?list=PLtBw6njkvG-WEkx1y0m8aA4gA2B7kLSmZ",
            slidesUrl: "http://introtodeeplearning.com/",
            codeRepoUrl: "https://github.com/aamini/introtodeeplearning",
            embedId: "QDX-1M5Nj7s",
            platform: "YouTube",
            summary: "المساق الأكاديمي الرسمي في معهد ماساتشوستس للتكنولوجيا (MIT) لأسس الشبكات العصبية العميقة، وحسابات الذاكرة، وبناء النماذج التوليدية.",
            keyTakeaways: [
              "فهم حسابات مصفوفات الأوزان وإدارة تدفق البيانات عبر طبقات الـ Backpropagation",
              "استراتيجيات تحسين الذاكرة وتخفيض زمن الاستدلال"
            ],
            lectures: [
              { id: "mit-1", title: "المحاضرة 1: مدخل إلى التعلم العميق والشبكات العصبية", duration: "55 دقيقة", embedId: "QDX-1M5Nj7s" },
              { id: "mit-2", title: "المحاضرة 2: النماذج العصبية التكرارية والانتباه والتعلم المتسلسل", duration: "58 دقيقة", embedId: "5tvmMX8r_OM" },
              { id: "mit-3", title: "المحاضرة 3: شبكات التعلم العميق الرؤيوية والالتفافية CNNs", duration: "62 دقيقة", embedId: "NmLK_WQBxB4" }
            ]
          },
          {
            title: "State of GPT: Memory & Compute Frontiers",
            instructor: "Andrej Karpathy (ex-OpenAI)",
            duration: "ساعة ونصف مراجعة شاملة",
            totalCourseHours: "ساعة و 30 دقيقة",
            courseType: "Industry Masterclass",
            institution: "OpenAI / Microsoft Build",
            videoUrl: "https://www.youtube.com/watch?v=bZQun8Y4L2A",
            embedId: "bZQun8Y4L2A",
            platform: "YouTube",
            summary: "نظرة شمولية من أندريه كارباثي عن خط أنابيب تدريب النماذج اللغوية وإدارة موارد الحوسبة والمحاذاة.",
            keyTakeaways: [
              "كيف يتم توزيع الحوسبة بين ما قبل التدريب والضبط الدقيق",
              "تكلفة السياق الطويل والذاكرة المطلوبة لتشغيل النماذج الضخمة"
            ]
          }
        ],
        referencePapers: [
          {
            title: "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models",
            authors: "Samyam Rajbhandari et al. (Microsoft)",
            year: 2020,
            arxivUrl: "https://arxiv.org/abs/1910.02054",
            badge: "Seminal Paper",
            citation: "The foundational paper introducing ZeRO-1, ZeRO-2, and ZeRO-3 partitioning."
          }
        ],
        practicalExercise: {
          prompt: "احسب بدقة الذاكرة اللازمة لتشغيل نموذج 70 مليار معلمة مكمم بدقة INT4 (4-bit quantization) مع سياق 16,000 توكن.",
          initialCode: `# احسب حجم الأوزان بالجيجابايت لطريقة التكميم 4-bit
params = 70e9
bytes_per_param = 0.5 # 4 bits = 0.5 bytes
# أكمل الحساب وطباعة النتيجة
`,
          expectedOutputHint: "حجم الأوزان فقط سيكون نحو 32.6 جيجابايت، مما يسمح بتشغيله على بطاقة واحدة 48GB أو اثنتين 24GB.",
          solutionCode: `params = 70e9
bytes_per_param = 4 / 8 # 0.5 byte
weights_gb = (params * bytes_per_param) / (1024**3)
print(f"حجم أوزان 70B INT4: {weights_gb:.2f} GB")`
        },
        interviewTips: [
          "سؤال مقابلة قياسي في Google DeepMind: 'كم بايت يستهلك كل معامل في تدريب AdamW مختلط الدقة (Mixed Precision) ولماذا؟' الإجابة الفورية: 16 إلى 20 بايت مع التدرجات والنسخة الأصلية."
        ]
      }
    ],
    quiz: [
      {
        id: "q1-1",
        question: "كم يبلغ حجم الذاكرة الثابتة (Static Memory) المطلوبة حصراً لحفظ أوزان وحالات محسن AdamW لنموذج بحجم 10 مليار معلمة بدقة BF16؟",
        options: [
          "20 جيجابايت تقريباً",
          "60 جيجابايت تقريباً",
          "160 إلى 180 جيجابايت تقريباً",
          "10 جيجابايت فقط"
        ],
        correctIndex: 2,
        explanation: "كل معامل يحتاج 2 بايت للأوزان + 2 بايت للتدرجات + 12-16 بايت لحالات AdamW (نسخة المعلمات بدقة FP32 + الأول والثاني للعزم) = ~16-20 بايت للمعامل الواحد. 10B × 18 بايت ≈ 180 جيجابايت.",
        difficulty: "Hard"
      },
      {
        id: "q1-2",
        question: "ما هي الميزة الأساسية لمسرى NVLink 4 في شريحة H100 مقارنة بـ PCIe Gen 5؟",
        options: [
          "استهلاك كهربائي أقل بنسبة 90%",
          "نطاق ترددي يصل إلى 900 GB/s ثنائي الاتجاه مقارنة بـ 64 GB/s في PCIe Gen 5",
          "القدرة على تشغيل كود Python مباشرة دون مفسر",
          "تقليل زمن معالجة أقراص NVMe"
        ],
        correctIndex: 1,
        explanation: "يوفر NVLink 4 سرعة نقل بيانات تصل إلى 900 GB/s، وهو ما يمثل طفرة بنحو 14 ضعفاً مقارنة بمسرى PCIe Gen 5، مما يتيح التزامن اللحظي للـ Tensor Parallelism.",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: 2,
    title: "الرياضيات التطبيقية للتعلم العميق (Applied Math & Tensors)",
    subtitle: "الجبر الخطي، تفكيك التنسورات، التفاضل متعدد المتغيرات، ونظرية المعلومات وKL-Divergence",
    description: "كل شبكة عصبية عميقة هي في جوهرها دالة تفاضلية ضخمة في فضاء متعدد الأبعاد. ستتعلم هنا الرياضيات الأكاديمية الصارمة وفق مقررات معهد ماساتشوستس للتقنية (MIT) وجامعة ستانفورد التي تبنى عليها أبحاث المحولات وضغط النماذج.",
    iconName: "Binary",
    estimatedHours: 35,
    badge: "MIT / Stanford Math Standard",
    lessons: [
      {
        id: "2-1",
        title: "الجبر الخطي المتقدم وتفكيك المصفوفات (SVD & Low-Rank Approximations)",
        subtitle: "كيف يعمل تفكيك القيمة المفردة (SVD) ولماذا هو الأساس الرياضي لتقنية LoRA وضغط التنسورات",
        duration: "35 ساعة دراسية معتمدة",
        readTime: "30 دقيقة قراءة تفكيكية + 30 ساعة محاضرات ومعامل",
        hoursBreakdown: {
          lecturesHours: 18,
          labHours: 10,
          readingHours: 4,
          projectHours: 3,
          totalHours: 35
        },
        handsOnLabs: [
          {
            title: "معمل تفكيك المصفوفات SVD ومحاكاة تقنية LoRA من الصفر في PyTorch",
            difficulty: "Advanced Math",
            estimatedHours: "5 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1SVD_LoRA_PyTorch_Lab",
            githubUrl: "https://github.com/microsoft/LoRA",
            description: "برمجة SVD وتفكيك مصفوفات انتباه المحولات (Self-Attention Projections) واستخراج المتجهات ذات الطاقة العالية لضغط الذاكرة بنسبة 99%."
          },
          {
            title: "معمل استخراج القيم والمتجهات الذاتية وتطبيق PCA على صور عالية الأبعاد",
            difficulty: "Applied Linear Algebra",
            estimatedHours: "5 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1PCA_Eigenvectors_Dimensionality_Reduction",
            githubUrl: "https://github.com/scikit-learn/scikit-learn/tree/main/sklearn/decomposition",
            description: "تطبيق خوارزميات الانحدار الطيفي والإسقاط المتعامد لاختزال مصفوفات التنسورات دون فقدان المعلومات الأساسية."
          }
        ],
        sections: [
          {
            id: "2-1-1",
            title: "تفكيك المصفوفات منخفضة الرتبة (Low-Rank Decomposition)",
            content: `مصفوفة الأوزان $W \\in \\mathbb{R}^{d \\times k}$ في المحولات تحتوي على ملايين المعلمات. ولكن الأبحاث التجريبية (مثل ورقة LoRA من مايكروسوفت 2021) أثبتت أن مصفوفة التحديث أثناء التكيف $\\Delta W$ تمتلك 'رتبة جوهرية منخفضة' (Low Intrinsic Rank).\n\nبدلاً من تعديل كل عناصر المصفوفة $d \\times k$، يمكننا تفكيكها إلى حاصل ضرب مصفوفتين صغيرتين:\n$$\\Delta W = B \\times A$$\nحيث $A \\in \\mathbb{R}^{r \\times k}$ و $B \\in \\mathbb{R}^{d \\times r}$ مع رتبة $r \\ll \\min(d, k)$. إذا كان $d=4096$ و $r=8$، ينخفض عدد المعلمات بنسبة تزيد عن 99.6%!`,
            mathFormulas: [
              "W = U \\Sigma V^T = \\sum_{i=1}^r \\sigma_i u_i v_i^T",
              "\\Delta W = B \\times A, \\quad B \\in \\mathbb{R}^{d \\times r}, \\quad A \\in \\mathbb{R}^{r \\times k}, \\quad r \\ll \\min(d, k)"
            ],
            takeaway: "الرتبة المنخفضة تعني أن المعلومات المهمة تتركز في عدد قليل من المتجهات الرئيسية؛ وهذا هو المبدأ الرياضي المباشر وراء LoRA وضغط النماذج."
          }
        ],
        pythonCode: {
          title: "تطبيق عملي لتفكيك SVD ومحاكاة تقنية LoRA رياضياً",
          filename: "svd_low_rank_demo.py",
          explanation: "كود بايثون يوضح كيف نقرب مصفوفة أوزان كاملة باستخدام رتبة منخفضة r=8 ونقيس نسبة استرجاع الطاقة والمعلومات والوفر في المعلمات.",
          code: `import numpy as np

def demonstrate_low_rank():
    # محاكاة مصفوفة وزن طبقة إسقاط في المحول (Projection Weight)
    d, k = 4096, 4096
    print(f"المصفوفة الأصلية: {d} x {k} = {d*k:,} معامل")

    # توليد مصفوفة ذات رتبة منخفضة جزئياً
    np.random.seed(42)
    W = np.random.randn(d, 64) @ np.random.randn(64, k)
    
    # تفكيك SVD الكامل
    U, S, Vt = np.linalg.svd(W, full_matrices=False)
    
    # اختيار رتبة منخفضة r = 8 كما في LoRA
    r = 8
    U_r = U[:, :r]
    S_r = np.diag(S[:r])
    Vt_r = Vt[:r, :]
    
    # إعادة بناء المصفوفة المقربة
    W_approx = U_r @ S_r @ Vt_r
    
    # حساب نسبة حفظ الطاقة (Frobenius norm)
    energy_orig = np.linalg.norm(W)
    energy_approx = np.linalg.norm(W_approx)
    error = np.linalg.norm(W - W_approx) / energy_orig
    
    lora_params = (d * r) + (r * k)
    savings = (1 - (lora_params / (d * k))) * 100
    
    print(f"عدد معلمات التفكيك برتبة r={r}: {lora_params:,}")
    print(f"نسبة التوفير في الذاكرة: {savings:.2f}%")
    print(f"خطأ التقريب النسبي (Relative Error): {error:.4f}")

if __name__ == "__main__":
    demonstrate_low_rank()`
        },
        videoResources: [
          {
            title: "Essence of Linear Algebra & Matrix Systems for Deep Learning",
            instructor: "Grant Sanderson (3Blue1Brown)",
            duration: "16 حلقة بصرية ثلاثية الأبعاد كاملة",
            videoUrl: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
            playlistUrl: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
            slidesUrl: "https://www.3blue1brown.com/topics/linear-algebra",
            codeRepoUrl: "https://github.com/3b1b/manim",
            embedId: "fNk_zzaMoSs",
            platform: "YouTube",
            institution: "3Blue1Brown Mathematics Research",
            courseType: "Foundational Masterclass",
            totalCourseHours: "12 ساعة أكاديمية معتمدة",
            summary: "السلسلة الأيقونية الأبرز في تاريخ تدريس الرياضيات والذكاء الاصطناعي لفهم الجبر الخطي والمصفوفات والتحويلات الهندسية والفضاءات المتجهة بصرياً وحدسياً.",
            keyTakeaways: [
              "فهم هندسة ضرب المصفوفات والأعمدة والصفوف (Column Space & Row Space)",
              "التفكيك الحاسم للقيم الذاتية (Eigenvalues & Eigenvectors) ودوره في تحليل فضاءات التنسور",
              "التحويلات الخطية والتركيب الرياضي في الفضاءات عالية الأبعاد",
              "الربط الرياضي المباشر بين المصفوفات وخوارزميات تعلم الآلة والشبكات العصبية"
            ],
            lectures: [
              {
                lectureNumber: 1,
                title: "المحاضرة 1: المتجهات والفضاءات الخطية (Vectors & Linear Combinations)",
                duration: "48 دقيقة",
                embedId: "fNk_zzaMoSs",
                description: "كيف تنظر للتعلم العميق كعمليات ضرب مصفوفات متتالية وأعمدة التنسورات في فضاء البيانات."
              },
              {
                lectureNumber: 2,
                title: "المحاضرة 2: التحويلات الخطية والمصفوفات (Linear Transformations & Matrices)",
                duration: "50 دقيقة",
                embedId: "kYB8IZa5AuE",
                description: "الفضاء الخطي للمصفوفات وكيف تمثل الطبقات العصبية تحويلات خطية متتالية."
              },
              {
                lectureNumber: 3,
                title: "المحاضرة 3: ضرب المصفوفات كتركيب تحويلات (Matrix Multiplication as Composition)",
                duration: "52 دقيقة",
                embedId: "XkY2DOUCWMU",
                description: "الشرح الهندسي الحاسم لعمليات ضرب المصفوفات GEMM وهو جوهر الحوسبة العصبية."
              },
              {
                lectureNumber: 4,
                title: "المحاضرة 4: المتجهات الذاتية والقيم الذاتية (Eigenvectors & Eigenvalues)",
                duration: "51 دقيقة",
                embedId: "PFDu9oVAE-g",
                description: "استخراج محاور التباين الرئيسية واختزال الأبعاد في الفضاءات الكثيفة."
              }
            ]
          },
          {
            title: "But what is a neural network? Deep Learning Foundations",
            instructor: "Grant Sanderson (3Blue1Brown)",
            duration: "1 ساعة مكثفة",
            videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
            embedId: "aircAruvnKk",
            platform: "YouTube",
            institution: "3Blue1Brown",
            courseType: "Foundational Lecture",
            totalCourseHours: "2 ساعة تدريبية",
            summary: "الشرح البصري الأسطوري للطبقات العصبية والأوزان والانحيازات وكيف تتعلم الشبكة التعرف على الأنماط بدقة رياضية.",
            keyTakeaways: [
              "حساب التدرجات للمصفوفات والتنسورات متعددة الأبعاد",
              "الاشتقاق الدقيق لدوال التنشيط ودوال الخسارة في الشبكات العميقة"
            ]
          },
          {
            title: "Attention in transformers, step-by-step: Mathematical Deep Dive",
            instructor: "Grant Sanderson (3Blue1Brown)",
            duration: "45 دقيقة",
            videoUrl: "https://www.youtube.com/watch?v=eMlx5fFNoYc",
            embedId: "eMlx5fFNoYc",
            platform: "YouTube",
            institution: "3Blue1Brown AI Series",
            courseType: "Paper Implementation Deep Dive",
            totalCourseHours: "2 ساعة تطبيقية",
            summary: "تشريح بصري رياضي كامل لآلية الانتباه الذاتي Self-Attention، ومصفوفات Q و K و V، وحساب الـ Softmax عبر الأبعاد.",
            keyTakeaways: [
              "فهم الأساس الرياضي لمصفوفات الاستعلام والمفتاح والقيمة (Query, Key, Value)",
              "تطبيق عملي خطوة بخطوة بالمعادلات لفهم هندسة النماذج اللغوية الحديثة"
            ]
          }
        ],
        referencePapers: [
          {
            title: "LoRA: Low-Rank Adaptation of Large Language Models",
            authors: "Edward J. Hu et al. (Microsoft)",
            year: 2021,
            arxivUrl: "https://arxiv.org/abs/2106.09685",
            badge: "Essential",
            citation: "Introduced Low-Rank Adaptation for parameter-efficient LLM fine-tuning."
          }
        ],
        practicalExercise: {
          prompt: "اكتب دالة تحسب المسافة بين توزيعين احتماليين باستخدام مقياس Kullback-Leibler Divergence (KL-Divergence) لمصفوفتي احتمالات P و Q.",
          initialCode: `import numpy as np

def kl_divergence(p, q):
    # تجنب القسمة على صفر أو log(0) بإضافة epsilon صغير
    eps = 1e-12
    # اكتب المعادلة الرياضية لـ KL(P || Q)
    pass`,
          expectedOutputHint: "D_{KL}(P || Q) = sum(P(x) * log(P(x) / Q(x)))",
          solutionCode: `import numpy as np

def kl_divergence(p, q):
    eps = 1e-12
    p = np.clip(p, eps, 1.0)
    q = np.clip(q, eps, 1.0)
    return np.sum(p * np.log(p / q))`
        },
        interviewTips: [
          "في أسئلة RLHF ومحاذاة النماذج (Alignment): يسأل المقابل دائماً: 'لماذا نضيف حد KL Penalty في دالة الهدف لخوارزمية PPO؟' الإجابة: لمنع السياسة المدربة من الانحراف المفرط عن النموذج المرجعي الأصلي ولتجنب الـ Reward Hacking."
        ]
      }
    ],
    quiz: [
      {
        id: "q2-1",
        question: "إذا كانت أبعاد مصفوفة الأوزان الأصلية 8192 × 8192، واستخدمنا تقنية LoRA برتبة r = 16، فما هو عدد المعلمات القابلة للتدريب؟",
        options: [
          "67,108,864 معامل",
          "262,144 معامل",
          "131,072 معامل",
          "524,288 معامل"
        ],
        correctIndex: 1,
        explanation: "المصفوفة A أبعادها 16 × 8192 = 131,072. والمصفوفة B أبعادها 8192 × 16 = 131,072. المجموع = 131,072 + 131,072 = 262,144 معامل فقط (مقارنة بـ 67.1 مليون للمعاملات الأصلية!).",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: 3,
    title: "الشبكات العصبية والانتشار الخلفي من الصفر (Backprop from Scratch)",
    subtitle: "بناء المحرك التفاضلي التلقائي (Autograd)، دوال الخسارة، ومحسنات AdamW",
    description: "لن تفهم التعلم العميق حقاً حتى تبني الـ Backpropagation بيدك دون PyTorch أو TensorFlow. سنبني هنا شبكة عصبية كاملة وAutograd Engine ومحسن AdamW بالاعتماد على المنهج المعتمد من أندريه كارباثي (سلسلة Zero to Hero) ومعهد MIT.",
    iconName: "GitBranch",
    estimatedHours: 32,
    badge: "Stanford / Karpathy Standard",
    lessons: [
      {
        id: "3-1",
        title: "بناء محرك التفاضل التلقائي (Micro-Autograd Engine) وشبكة MLP كاملة بلغة بايثون",
        subtitle: "كيف يتم إنشاء رسم الحوسبة الحركي (Dynamic Computational Graph) وحساب المشتقات عبر قاعدة السلسلة (Chain Rule)",
        duration: "32 ساعة دراسية معتمدة",
        readTime: "35 دقيقة قراءة تفكيكية + 28 ساعة محاضرات ومعامل",
        hoursBreakdown: {
          lecturesHours: 16,
          labHours: 9,
          readingHours: 4,
          projectHours: 3,
          totalHours: 32
        },
        handsOnLabs: [
          {
            title: "معمل بناء محرك Autograd مصغر وحساب التدرجات الرياضية في بايثون الخالصة",
            difficulty: "Core Architecture",
            estimatedHours: "5 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Micrograd_Autograd_Engine_Lab",
            githubUrl: "https://github.com/karpathy/micrograd",
            description: "برمجة كائن Value وتتبع الأبناء والأوبيراتورات الحسابية (+, *, tanh, relu) والفرز الطوبولوجي لتمرير التدرجات العكسية بدقة متناهية."
          },
          {
            title: "معمل بناء وتدريب شبكة MLP ومحسن AdamW ودوال Cross-Entropy من الصفر",
            difficulty: "Deep Learning Engineering",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Makemore_MLP_Neural_Net_From_Scratch",
            githubUrl: "https://github.com/karpathy/makemore",
            description: "بناء نموذج توليد نصوص مصغر بتطبيق طبقات Linear كاملة وحساب Negative Log Likelihood ومحاكاة مصفوفات الأوزان وتحديثها يدوياً."
          }
        ],
        sections: [
          {
            id: "3-1-1",
            title: "تشريح الرسم البياني للحوسبة وتدفق التدرجات",
            content: `في كل عملية ضرب أو جمع، يقوم محرك التفاضل التلقائي بحفظ المؤشرات للقيم الداخلة (Children) وحساب المشتقة المحلية (Local Gradient). عند استدعاء دالة \`.backward()\`، نبدأ بفرز عقَد الرسم البياني ترتيباً طوبولوجياً (Topological Sort) من الناتج النهائي إلى البداية، ثم نطبق قاعدة السلسلة لمضاعفة التدرجات وتراكمها في \`.grad\` لكل عقدة.`,
            mathFormulas: [
              "\\frac{\\partial L}{\\partial x} = \\sum_{y \\in \\text{children}(x)} \\frac{\\partial L}{\\partial y} \\cdot \\frac{\\partial y}{\\partial x}",
              "\\text{Chain Rule}: \\quad (f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)"
            ],
            takeaway: "محرك Autograd هو جوهر PyTorch؛ فهم كيفية تخزين الـ Graph والتعامل مع التدرجات يمنحك القدرة على تشخيص مشكلات انفجار وتلاشي التدرجات بدقة."
          }
        ],
        pythonCode: {
          title: "محرك تفاضل تلقائي مصغر كامل (Scalar Autograd Engine)",
          filename: "micro_autograd.py",
          explanation: "فئة Value المصغرة التي تدعم العمليات الحسابية وتتبع رسم الحوسبة والانتشار الخلفي الكامل المشابه لمكتبة micrograd لكارباثي.",
          code: `class Value:
    def __init__(self, data, _children=(), _op='', label=''):
        self.data = float(data)
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op
        self.label = label

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        def _backward():
            self.grad += 1.0 * out.grad
            other.grad += 1.0 * out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def backward(self):
        topo = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                topo.append(v)
        build_topo(self)
        
        self.grad = 1.0
        for node in reversed(topo):
            node._backward()

    def __repr__(self):
        return f"Value(data={self.data:.4f}, grad={self.grad:.4f})"

# تجربة عملية: f = (a * b) + c
a = Value(2.0, label='a')
b = Value(-3.0, label='b')
c = Value(10.0, label='c')
e = a * b; e.label = 'e'
d = e + c; d.label = 'd'

d.backward()
print(f"النتيجة: {d.data}")
print(f"مشتقة d بالنسبة إلى a: {a.grad} (المتوقع: b = -3.0)")
print(f"مشتقة d بالنسبة إلى b: {b.grad} (المتوقع: a = 2.0)")
print(f"مشتقة d بالنسبة إلى c: {c.grad} (المتوقع: 1.0)")`
        },
        videoResources: [
          {
            title: "Neural Networks: Zero to Hero (The Spelled-out Intro to Backpropagation & Building Micrograd)",
            instructor: "Andrej Karpathy (Former Director of AI at Tesla / OpenAI)",
            duration: "سلسلة كاملة (8 محاضرات تفصيلية - 24 ساعة)",
            videoUrl: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
            playlistUrl: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
            embedId: "VMj-3S1tku0",
            platform: "YouTube (Karpathy Deep Learning Series)",
            institution: "Stanford / OpenAI Standard",
            courseType: "Masterclass Series (8 In-Depth Lectures)",
            totalCourseHours: "24 ساعة تدريبية معتمدة",
            summary: "أعظم سلسلة تعليمية مسجلة في تاريخ الذكاء الاصطناعي الحديث يقدمها د. أندريه كارباثي. يشرح فيها بناء محرك تفاضل تلقائي، وشبكات MLP، ونماذج توليد الحروف، وطبقات الانتباه من الصفر التام دون أي سحر خفي.",
            keyTakeaways: [
              "بناء محرك Autograd ديناميكي من الصفر وتتبع رسم الحوسبة (Dynamic Graph)",
              "فهم رياضي دقيق لقاعدة السلسلة وتراكم التدرجات وتفادي الأخطاء الصامتة",
              "بناء مصفوفات التنبؤ وحساب دالة الخسارة Negative Log Likelihood و Cross-Entropy",
              "استكشاف مشكلات اختفاء وانفجار التدرجات وتأثير الـ Initialization و Batch Normalization"
            ],
            lectures: [
              {
                lectureNumber: 1,
                title: "المحاضرة 1: The spelled-out intro to neural networks and backpropagation: building micrograd",
                duration: "2 ساعة و 25 دقيقة",
                embedId: "VMj-3S1tku0",
                description: "بناء الانتشار الخلفي الكامل ومحرك micrograd سطر بسطر في بايثون."
              },
              {
                lectureNumber: 2,
                title: "المحاضرة 2: The spelled-out intro to language modeling: building makemore (Bigram)",
                duration: "1 ساعة و 57 دقيقة",
                embedId: "PaCmpygFfXo",
                description: "كيف تفكر النماذج التوليدية واحتمالات الحروف وتدريب أول شبكة عصبية بـ Loss."
              },
              {
                lectureNumber: 3,
                title: "المحاضرة 3: Building makemore Part 4: Becoming a Backprop Ninja",
                duration: "1 ساعة و 45 دقيقة",
                embedId: "q8SA3rM6ckI",
                description: "تطبيق بنية الانتشار الخلفي اليدوي وتتبع تدفق التدرجات دون الاعتماد على autograd."
              },
              {
                lectureNumber: 4,
                title: "المحاضرة 4: Building makemore Part 3: Activations, Gradients & Batch Normalization",
                duration: "1 ساعة و 58 دقيقة",
                embedId: "P6sfmUTpUmc",
                description: "تشريح الـ Dead Neurons وتشبع دوال Tanh وضرورة التهيئات Kaiming He Init."
              }
            ]
          },
          {
            title: "MIT 6.S191: Introduction to Deep Learning (Lecture 1: Deep Learning Foundations & Backprop)",
            instructor: "Prof. Alexander Amini",
            duration: "52 دقيقة",
            videoUrl: "https://www.youtube.com/watch?v=7sB052Pz0sQ",
            embedId: "7sB052Pz0sQ",
            platform: "MIT OpenCourseWare (YouTube)",
            institution: "MIT (Massachusetts Institute of Technology)",
            courseType: "University Lecture",
            totalCourseHours: "2 ساعة دراسية",
            summary: "المحاضرة الافتتاحية المعتمدة في معهد ماساتشوستس للتقنية (MIT) للتعلم العميق، ودوال الخسارة، والانتشار الخلفي.",
            keyTakeaways: [
              "الأساس الرياضي للبيرسبترون (Perceptron) والشبكات متعددة الطبقات",
              "خوارزميات النزول التدريجي (Stochastic Gradient Descent) ووزن التعلم"
            ]
          },
          {
            title: "3Blue1Brown: What is Backpropagation really doing? Neural Networks Chapter 3",
            instructor: "Grant Sanderson (3Blue1Brown)",
            duration: "14 دقيقة",
            videoUrl: "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
            embedId: "Ilg3gGewQ5U",
            platform: "YouTube",
            institution: "3Blue1Brown",
            courseType: "Mathematical Visualization Masterclass",
            totalCourseHours: "1 ساعة إدراكية",
            summary: "أوضح تمثيل بصري ثلاثي الأبعاد لكيفية دفع التدرجات لأوزان الشبكة العصبية لتقليل دالة التكلفة.",
            keyTakeaways: [
              "الرؤية الهندسية لميل دالة التكلفة في فضاء آلاف المتغيرات",
              "فهم بديهي لسبب حاجة كل عصبون لتعديل أوزانه بناءً على الخطأ التراكمي"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Automatic Differentiation in PyTorch",
            authors: "Adam Paszke et al.",
            year: 2017,
            arxivUrl: "https://openreview.net/forum?id=BJJsrmfCZ",
            badge: "Architecture",
            citation: "Introduced the dynamic reverse-mode autodiff tape engine used in PyTorch."
          }
        ],
        practicalExercise: {
          prompt: "أضف دالة التنشيط ReLU إلى كائن Value مع دالة backward المناسبة لها.",
          initialCode: `# أكمل إضافة دالة relu
# تذكر: إذا كانت self.data > 0 فالمشتقة 1.0، وإلا فالمشتقة 0.0`,
          expectedOutputHint: "def relu(self): out = Value(max(0, self.data), (self,), 'ReLU'); ...",
          solutionCode: `def relu(self):
    out = Value(max(0, self.data), (self,), 'ReLU')
    def _backward():
        self.grad += (1.0 if self.data > 0 else 0.0) * out.grad
    out._backward = _backward
    return out`
        },
        interviewTips: [
          "في مقابلة مهندسي الأبحاث: قد يطلب منك كتابة كود Custom Autograd Function في PyTorch مع كتابة الدوال `forward` و`backward` يدوياً واستخدام `ctx.save_for_backward`."
        ]
      }
    ],
    quiz: [
      {
        id: "q3-1",
        question: "لماذا نستخدم عامل الجمع `self.grad += ...` بدلاً من المساواة `self.grad = ...` داخل دوال الانتشار الخلفي؟",
        options: [
          "لأن لغة بايثون لا تدعم إعادة تعيين المتغيرات",
          "للسماح بتراكم التدرجات (Gradient Accumulation) إذا استخدم المتغير كمدخل لأكثر من عملية",
          "لتحويل المتغير تلقائياً إلى مصفوفة",
          "لتقليل استهلاك الذاكرة في كاش الـ CPU"
        ],
        correctIndex: 1,
        explanation: "عندما يشارك نفس المتغير في أكثر من تفريع في رسم الحوسبة (Multivariate Chain Rule)، تنص قاعدة السلسلة على جمع المشتقات القادمة من جميع المسارات.",
        difficulty: "Medium"
      }
    ]
  }
];
