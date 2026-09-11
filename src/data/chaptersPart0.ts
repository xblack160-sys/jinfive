import { Chapter } from '../types';

export const chaptersPart0: Chapter[] = [
  {
    id: 0,
    title: "الوحدة التأسيسية الكبرى: علوم الحاسب، بايثون المتقدمة، وهندسة الأنظمة لمعايير OpenAI & DeepMind",
    subtitle: "من الصفر المطلق إلى هندسة الذاكرة CPython، الخوارزميات، هياكل البيانات، الرياضيات التطبيقية، وبناء محرك Autograd متكامل",
    description: "هذه ليست مجرد مقدمة عابرة، بل هي الأكاديمية التأسيسية الصارمة المصممة وفقاً لمعايير اختبارات كبار مهندسي الذكاء الاصطناعي في OpenAI و Google DeepMind. تبدأ من تفكيك الترانزستورات والبتات، وتتعمق في نموذج ذاكرة بايثون وإدارة CPython والـ GIL، مروراً بهياكل البيانات وخوارزميات Big-O، والرياضيات التطبيقية (الجبر الخطي والتفاضل المتعدد)، وصولاً إلى بناء محرك تفاضل تلقائي وشبكة عصبية بـ Pure Python من الصفر دون أي مكتبات مساعدة.",
    iconName: "Monitor",
    estimatedHours: 95,
    badge: "OpenAI Foundation Standard",
    lessons: [
      {
        id: "0-1",
        title: "معمارية الحاسوب، نظم التشغيل، وتدفق الذاكرة من الصفر التام",
        subtitle: "الترانزستورات، المنطق الثنائي (Binary)، هرمية الذاكرة (SRAM, DRAM, SSD)، وإدارة العناوين في نظم التشغيل",
        duration: "28 ساعة دراسية معتمدة",
        readTime: "25 دقيقة قراءة تفصيلية + 25 ساعة محاضرات ومعامل",
        hoursBreakdown: {
          lecturesHours: 16,
          labHours: 7,
          readingHours: 3,
          projectHours: 2,
          totalHours: 28
        },
        handsOnLabs: [
          {
            title: "معمل هرمية الذاكرة وقياس Cache Misses ومعدل نقل DRAM في Linux C & Python",
            difficulty: "Systems Architecture",
            estimatedHours: "4 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Memory_Hierarchy_Cache_Misses_Lab",
            githubUrl: "https://github.com/mit-pdos/xv6-riscv",
            description: "برمجة اختبارات لقياس زمن الوصول بين L1 Cache و DRAM وكتابة كود يستغل خطوط الكاش (Cache Line Spatial Locality) لتسريع معالجة التنسورات."
          },
          {
            title: "محاكي بوابات المنطق الثنائي والدوائر المتكاملة من مستوى الترانزستور",
            difficulty: "Hardware Logic",
            estimatedHours: "3 ساعات",
            colabUrl: "https://colab.research.google.com/drive/1Digital_Logic_Gates_Nand2Tetris",
            githubUrl: "https://github.com/havivha/Nand2Tetris",
            description: "بناء ALU كاملة ومسجلات الحفظ (Registers) من بوابات NAND الأساسية وصولاً إلى وحدة معالجة مركزية قادرة على تنفيذ الأوامر."
          }
        ],
        sections: [
          {
            id: "sec-0-1-1",
            title: "كيف يفكر الحاسوب فيزيائياً؟ من بوابات السيليكون إلى تمثيل البيانات",
            content: `في عمق أي سيرفر حوسبة أو بطاقة فائقة مثل NVIDIA H100، لا يوجد أي فهم مجرد للحروف أو الكلمات أو الصور. الحقيقة الفيزيائية هي أن الحاسوب يتكون من مليارات **الترانزستورات (Field-Effect Transistors)** التي تعمل كمفاتيح مجهرية تقطع التيار الكهربائي أو تمرره.
            
عندما يمر تيار كهربائي (جهد مرتفع مثلاً 1.2V) نمثله بالرقم **1**، وعند انعدامه (جهد منخفض 0V) نمثله بالرقم **0**.
- **البت (Bit):** الوحدة الذرية للمعلومة، تخزن 0 أو 1 فقط.
- **البايت (Byte):** حزمة من 8 بتات ($2^8 = 256$ احتمال مختلف)، كافية لترميز محرف ASCII واحد.
- **أنظمة الترميز المتقدمة (UTF-8):** في عصر النماذج اللغوية، نستخدم ترميزاً متغير الطول يمتد من 1 إلى 4 بايتات لتمثيل كل لغات العالم بما فيها العربية والرموز التعبيرية (Emojis).`,
            mathFormulas: [
              "N_{\\text{states}} = 2^k \\quad (k = \\text{number of bits})",
              "1 \\text{ Byte} = 8 \\text{ bits} \\implies 2^8 = 256 \\text{ discrete values (0 to 255)}",
              "\\text{Memory Address Space (64-bit)} = 2^{64} \\text{ bytes} \\approx 18.4 \\times 10^{18} \\text{ bytes (16 Exabytes)}"
            ],
            takeaway: "الأساس الذي يُبنى عليه كل نموذج ذكاء اصطناعي في العالم هو تمثيل كل فكرة ومعلومة كأعداد ثنائية مصفوفة داخل خلايا الذاكرة الفيزيائية."
          },
          {
            id: "sec-0-1-2",
            title: "هرمية الذاكرة (Memory Hierarchy) وزمن الوصول (Latency Gap)",
            content: `لماذا لا نضع كل بيانات التدريب داخل كاش المعالج السريع؟ ولماذا نحتاج إلى رامات وهارد ديسك؟
السر يكمن في **معادلة التكلفة والسرعة والفيزياء (The Memory Latency Hierarchy)**:

1. **سجلات المعالج (CPU Registers):** تقع داخل نواة المعالج مباشرة، زمن الوصول أقل من 0.5 نانو ثانية (Cycle واحدة)، ولكن سعتها بضعة كيلوبايتات فقط.
2. **ذاكرة الكاش المخبأة (SRAM L1, L2, L3):** مدمجة في شريحة المعالج، سريعة جداً (1 إلى 15 نانو ثانية)، تحفظ التعليمات التي تتكرر بكثرة لتفادي إبطاء المعالج.
3. **الذاكرة العشوائية الرئيسية (DRAM / RAM):** ذاكرة واسعة النطاق ولكنها تبعد مسافة فيزيائية عن المعالج، زمن وصولها حوالي 50 إلى 100 نانو ثانية (أبطأ 100 مرة من الكاش!).
4. **وحدات التخزين الدائمة (NVMe SSD):** تحتفظ بالبيانات بعد انقطاع الطاقة، ولكن زمن وصولها يصل إلى 10,000 إلى 50,000 نانو ثانية (10-50 ميكروثانية).
5. **كروت الشاشة الفائقة (HBM3e on GPUs):** ذاكرة مكدسة رأسياً (High Bandwidth Memory) تلتصق بالمعالج عبر جسر Silicon Interposer لتصل سرعة نقلها إلى 3.35 تيرابايت/ثانية، وهي عصب تدريب نماذج الذكاء الاصطناعي اليوم.`,
            architectureDiagram: "Registers (< 1 ns) ---> L1/L2 SRAM (1-4 ns) ---> L3 Cache (10-20 ns) ---> Host DRAM (60-100 ns) ---> NVMe SSD (10-50 μs) | In GPU: HBM3e (3.35 TB/s Bandwidth)",
            takeaway: "مهندس النظم المحترف يكتب كوداً يراعي هرمية الذاكرة ويقلل من حالات الـ Cache Misses لأن انتظار البيانات من الرام هو العدو الأول لسرعة تدريب النماذج."
          }
        ],
        pythonCode: {
          title: "محاكاة الفارق في زمن الوصول بين الكاش والذاكرة العشوائية",
          filename: "memory_latency_benchmark.py",
          explanation: "كود يقيس الفارق الزمني الحقيقي لمعالجة مصفوفة صغيرة تقع بالكامل داخل كاش المعالج L1/L2 مقابل مصفوفة ضخمة تضطر المعالج للقراءة المباشرة من الرام الرئيسي.",
          code: `import time
import array

# 1. مصفوفة صغيرة جداً (تتسع بالكامل في كاش المعالج L1 Cache)
small_size = 1024  # 1K elements (~4 KB)
small_arr = array.array('i', [1] * small_size)

# 2. مصفوفة ضخمة تتجاوز كاش المعالج وتضطر لجلب البيانات من الـ RAM
large_size = 20_000_000  # 20M elements (~80 MB)
large_arr = array.array('i', [1] * large_size)

# قياس سرعة القراءة المتتابعة في الكاش
start_time = time.perf_counter()
total_small = sum(small_arr)
small_duration = time.perf_counter() - start_time

# قياس سرعة القراءة من الرام (عينة متساوية 1K عنصر لكن من مواقع متباعدة لتوليد Cache Misses)
step = large_size // small_size
start_time = time.perf_counter()
total_scattered = sum(large_arr[i * step] for i in range(small_size))
ram_duration = time.perf_counter() - start_time

print(f"قراءة 1,000 عنصر من كاش المعالج (SRAM): {small_duration * 1e6:.2f} ميكروثانية")
print(f"قراءة 1,000 عنصر متفرق من الرام (DRAM Latency): {ram_duration * 1e6:.2f} ميكروثانية")
print(f"الفارق: الوصول للرام أبطأ بنحو {ram_duration / max(small_duration, 1e-9):.1f} ضعفاً!")`
        },
        videoResources: [
          {
            title: "CS50: Introduction to Computer Science (Full Harvard University Course)",
            instructor: "Prof. David J. Malan (Harvard University)",
            duration: "26 ساعة محاضرات جامعية معتمدة",
            totalCourseHours: "26 ساعة كاملة",
            courseType: "Harvard University Full Course",
            institution: "Harvard University",
            videoUrl: "https://www.youtube.com/watch?v=LfaMVlDaQ24",
            playlistUrl: "https://www.youtube.com/watch?v=LfaMVlDaQ24",
            slidesUrl: "https://cs50.harvard.edu/x/2024/weeks/",
            codeRepoUrl: "https://github.com/cs50",
            embedId: "LfaMVlDaQ24",
            platform: "Harvard Online (YouTube)",
            summary: "المساق الأكاديمي الأبرز والأكثر شمولية في العالم من جامعة هارفارد، يغطي التفكير الحوسبي، معمارية المعالج، لغة C، إدارة الذاكرة اليدوية، هياكل البيانات، والخوارزميات.",
            keyTakeaways: [
              "فهم التحويل بين الأنظمة الثنائية والعشرية والست عشرية على مستوى البتات",
              "إدراك تدفق الأوامر في المسجلات ومؤشرات الذاكرة Pointers",
              "بناء أسس صلبة للتعامل مع الذاكرة قبل الانتقال للنماذج الضخمة"
            ],
            lectures: [
              { id: "cs50-0", title: "المحاضرة 0: التفكير الحوسبي، الترانزستورات، والمنطق الثنائي", duration: "125 دقيقة", embedId: "LfaMVlDaQ24", startTime: 0 },
              { id: "cs50-1", title: "المحاضرة 1: لغة C وهندسة الذاكرة وسجلات المعالج", duration: "149 دقيقة", embedId: "LfaMVlDaQ24", startTime: 7547 },
              { id: "cs50-2", title: "المحاضرة 2: المصفوفات (Arrays) وعناوين الذاكرة المتسلسلة", duration: "144 دقيقة", embedId: "LfaMVlDaQ24", startTime: 16519 },
              { id: "cs50-3", title: "المحاضرة 3: الخوارزميات وتعقيد الحوسبة Big-O والبحث", duration: "121 دقيقة", embedId: "LfaMVlDaQ24", startTime: 25178 },
              { id: "cs50-4", title: "المحاضرة 4: مؤشرات الذاكرة (Pointers) والتعامل مع Heap و Stack", duration: "145 دقيقة", embedId: "LfaMVlDaQ24", startTime: 32473 },
              { id: "cs50-5", title: "المحاضرة 5: هياكل البيانات (Data Structures): القوائم والجداول والأشجار", duration: "136 دقيقة", embedId: "LfaMVlDaQ24", startTime: 41193 }
            ]
          }
        ],
        referencePapers: [
          {
            title: "Computer Architecture: A Quantitative Approach (6th Edition)",
            authors: "John L. Hennessy & David A. Patterson (Turing Award Laureates)",
            year: 2017,
            arxivUrl: "https://www.elsevier.com/books/computer-architecture/hennessy/978-0-12-811905-1",
            badge: "إنجيل معمارية الحاسوب وهندسة المعالجات عالمياً",
            citation: "Hennessy, J. L., & Patterson, D. A. (2017). Computer architecture: a quantitative approach. Morgan Kaufmann."
          }
        ],
        practicalExercise: {
          prompt: "اكتب دالة بايثون تأخذ عدداً صحيحاً موجبًا بالتمثيل العشري، وتعيد تمثيله كسلسلة ثنائية (Binary String) مع إضافة الأصفار التكميلية لتبلغ 8 بتات.",
          initialCode: `def decimal_to_8bit_binary(n: int) -> str:
    # اكتب الحل بدون استخدام دالة bin() الجاهزة:
    ...

# تجربة الرقم 65 (وهو ترميز حرف A في ASCII)
print(decimal_to_8bit_binary(65))`,
          expectedOutputHint: "01000001",
          solutionCode: `def decimal_to_8bit_binary(n: int) -> str:
    bits = []
    for _ in range(8):
        bits.append(str(n % 2))
        n //= 2
    return "".join(reversed(bits))

print(decimal_to_8bit_binary(65))`
        },
        interviewTips: [
          "في مقابلات OpenAI: عندما يسألونك عن سبب كون الذاكرة HBM أساسية في الـ LLMs، ركز على 'نطاق النقل (Memory Bandwidth)' وتجاوز اختناق Von Neumann Bottleneck.",
          "تجنب الإجابات السطحية مثل 'الرام تخزن كل شيء'؛ ميز بدقة بين SRAM (كاش المعالج) و DRAM (الرام) و Non-Volatile Storage (SSD)."
        ]
      },
      {
        id: "0-2",
        title: "هندسة لغة بايثون الاحترافية ونموذج الذاكرة CPython",
        subtitle: "كيف تدير بايثون الكائنات، عداد المراجع (Reference Counting)، جامع القمامة (Garbage Collector)، والـ GIL",
        duration: "3 ساعات دراسية + مختبر برمجي",
        readTime: "30 دقيقة قراءة",
        sections: [
          {
            id: "sec-0-2-1",
            title: "ما الذي يحدث فعلياً عند تشغيل كود بايثون؟ تشريح CPython",
            content: `بايثون ليست مجرد لغة مفسرة عادية؛ المفسر القياسي لبايثون هو **CPython**، وهو برنامج ضخم مكتوب بلغة C.
عندما تكتب \`x = 1000\`، بايثون لا تضع الرقم 1000 في خلية ذاكرة مباشرة كما في لغة C، بل تقوم بإنشاء **كائن بايثون كامل (PyObject)** على الـ Heap يحتوي على:
1. **عداد المراجع (\`ob_refcnt\`):** عدد المتغيرات التي تشير إلى هذا الكائن في الذاكرة.
2. **مؤشر نوع الكائن (\`ob_type\`):** يشير إلى أن هذا الكائن هو \`PyLongObject\` (عدد صحيح).
3. **القيمة الحقيقية للرقم:** مصفوفة من الأرقام الرقمية لتمثيل أعداد صحيحة بدقة غير محدودة!

لهذا السبب، فإن عدداً صحيحاً بسيطاً في بايثون يستهلك **28 بايت** بدلاً من 4 بايتات في لغة C!`,
            mathFormulas: [
              "\\text{sizeof}(\\text{C int}) = 4 \\text{ bytes}",
              "\\text{sizeof}(\\text{PyObject integer}) = 28 \\text{ bytes (Overhead factor} \\approx 7\\times)",
              "\\text{Ref Count Rule}: \\quad \\text{if } ob\\_refcnt == 0 \\implies \\text{Free Memory Immediately}"
            ],
            takeaway: "كل شيء في بايثون هو كائن مخصص على الـ Heap مع عبء بيانات وصفية (Metadata Overhead)، وفهم ذلك جوهري لمنع استنزاف ذاكرة السيرفرات."
          },
          {
            id: "sec-0-2-2",
            title: "قفل المفسر العام (GIL - Global Interpreter Lock) ومعضلة التوازي",
            content: `أحد أهم الأسئلة في مقابلات كبار مهندسي النظم: **ما هو الـ GIL ولماذا صُمم هكذا؟**
الـ GIL هو قفل تزامن متبادل (Mutex) في CPython يمنع تشغيل أكثر من خيط عمل أصلي (Native Thread) واحد في نفس اللحظة لكل معالج، حتى لو كان جهازك يمتلك 128 نواة معالجة!

**لماذا وُجد الـ GIL؟**
لأن إدارة الذاكرة في بايثون تعتمد على عداد المراجع (\`ob_refcnt\`). بدون قفل عام، قد يحاول خيطان في معالجين مختلفين تعديل عداد المراجع لنفس الكائن في نفس اللحظة (Race Condition)، مما يتسبب في تلف الذاكرة وانهيار البرنامج.

**كيف يتغلب مهندسو الذكاء الاصطناعي على الـ GIL؟**
1. **استخدام مكتبات C++ و CUDA الخارجية:** مكتبات مثل PyTorch و NumPy تحرر الـ GIL فوراً (\`Py_BEGIN_ALLOW_THREADS\`) لتنفيذ العمليات الرياضية على كل أنوية المعالج وكرت الشاشة بأقصى سرعة عتادية.
2. **استخدام المعالجة المتعددة (Multiprocessing):** تشغيل عمليات مستقلة تماماً لكل منها مفسر CPython خاص وذاكرة منفصلة، وهو ما تفعله أدوات تحميل البيانات (PyTorch DataLoader with \`num_workers > 0\`).`,
            takeaway: "الـ GIL يقيد المهام الحسابية الصرفة في بايثون، لكن مكتبات الذكاء الاصطناعي (PyTorch/CUDA) مصممة لتجاوزه تماماً في العمليات الكثيفة."
          }
        ],
        pythonCode: {
          title: "فحص عداد المراجع وإدارة الذاكرة لكائنات بايثون حياً",
          filename: "cpython_memory_internals.py",
          explanation: "كود يستخدم مكتبة sys ومكتبة ctypes لفحص البنية الداخلية لكائنات بايثون في الذاكرة ومراقبة تغير عداد المراجع لحظة بلحظة.",
          code: `import sys
import gc

# إنشاء قائمة بيانات
data_sample = [1, 2, 3, "AI Engineer"]

print(f"الحجم الأساسي للكائن في الذاكرة: {sys.getsizeof(data_sample)} بايت")
# ملاحظة: getrefcount يضيف مرجعاً مؤقتاً أثناء تمرير المتغير للدالة، لذا فالعدد الحقيقي أقل بـ 1
print(f"عدد المراجع لكائن data_sample: {sys.getrefcount(data_sample) - 1}")

# إنشاء مرجع جديد لنفس الكائن (لا ينسخ البيانات بل يضيف مؤشراً فقط)
alias_pointer = data_sample
print(f"عدد المراجع بعد إضافة مؤشر جديد: {sys.getrefcount(data_sample) - 1}")

# حذف المرجع الأصلي
del data_sample
print(f"عدد المراجع بعد حذف المتغير الأصلي (الكائن ما زال حياً بفضل alias_pointer): {sys.getrefcount(alias_pointer) - 1}")

# إثبات مشاركة نفس العنوان في الذاكرة (Memory Identity)
a = [10, 20, 30]
b = a
print(f"عنوان a في الذاكرة: {hex(id(a))}")
print(f"عنوان b في الذاكرة: {hex(id(b))}")
print(f"هل a و b يشيران لنفس الكائن؟ {a is b}")`
        },
        videoResources: [
          {
            title: "Harvard CS50: Introduction to Programming with Python (Full University Course)",
            instructor: "Prof. David J. Malan (Harvard University)",
            duration: "16 ساعة كاملة من الشرح المعمق المعتمد",
            totalCourseHours: "16 ساعة",
            courseType: "Harvard University Full Course",
            institution: "Harvard University",
            videoUrl: "https://www.youtube.com/watch?v=nLRL_NcnK-4",
            embedId: "nLRL_NcnK-4",
            platform: "Harvard Online (YouTube)",
            summary: "رحلة تفصيلية من جامعة هارفارد لفهم لغة بايثون بعمق، من الأساسيات إلى الدوال والمكتبات وهياكل البيانات والبرمجة الكائنية والتعامل مع الملفات والاستثناءات.",
            keyTakeaways: [
              "إتقان بناء البرامج بلغة Python وفق المعايير البرمجية الاحترافية القياسية",
              "فهم تسلسل التنفيذ البرمجي وإدارة الذاكرة والتنظيم المعياري للكود"
            ],
            lectures: [
              { id: "cs50p-0", title: "المحاضرة 0: الدوال والمتغيرات (Functions & Variables)", duration: "105 دقيقة", embedId: "nLRL_NcnK-4", startTime: 288 },
              { id: "cs50p-1", title: "المحاضرة 1: الشروط والمنطق البرمجي (Conditionals)", duration: "56 دقيقة", embedId: "nLRL_NcnK-4", startTime: 6624 },
              { id: "cs50p-2", title: "المحاضرة 2: التكرار وحلقات Loops", duration: "80 دقيقة", embedId: "nLRL_NcnK-4", startTime: 9983 },
              { id: "cs50p-3", title: "المحاضرة 3: معالجة الاستثناءات والأخطاء (Exceptions)", duration: "44 دقيقة", embedId: "nLRL_NcnK-4", startTime: 14830 },
              { id: "cs50p-4", title: "المحاضرة 4: المكتبات والحزم (Libraries & Packages)", duration: "77 دقيقة", embedId: "nLRL_NcnK-4", startTime: 17505 },
              { id: "cs50p-5", title: "المحاضرة 5: الاختبارات الأحادية وجودة الكود (Unit Tests)", duration: "51 دقيقة", embedId: "nLRL_NcnK-4", startTime: 22155 },
              { id: "cs50p-6", title: "المحاضرة 6: قراءة وكتابة الملفات (File I/O)", duration: "92 دقيقة", embedId: "nLRL_NcnK-4", startTime: 25222 },
              { id: "cs50p-7", title: "المحاضرة 7: التعبيرات النمطية (Regular Expressions)", duration: "125 دقيقة", embedId: "nLRL_NcnK-4", startTime: 30752 },
              { id: "cs50p-8", title: "المحاضرة 8: البرمجة كائنية التوجه (OOP & Classes)", duration: "171 دقيقة", embedId: "nLRL_NcnK-4", startTime: 38255 },
              { id: "cs50p-9", title: "المحاضرة 9: ميزات بايثون المتقدمة (Decorators & Generators)", duration: "151 دقيقة", embedId: "nLRL_NcnK-4", startTime: 48527 }
            ]
          }
        ],
        referencePapers: [
          {
            title: "CPython Internals: Your Guide to the Python 3 Interpreter",
            authors: "Anthony Shaw",
            year: 2021,
            arxivUrl: "https://realpython.com/products/cpython-internals-book/",
            badge: "المرجع القياسي المعتمد لمطوري نواة بايثون",
            citation: "Shaw, Anthony. CPython Internals: Your Guide to the Python 3 Interpreter. Real Python, 2021."
          }
        ],
        practicalExercise: {
          prompt: "اكتب دالة تكتشف ما إذا كانت قائمتان في بايثون تشتركان في نفس مساحة الذاكرة (Memory Aliasing) أم أنهما نسختان مستقلتان.",
          initialCode: `def is_same_memory_object(obj1, obj2) -> bool:
    # اكتب التحقق هنا مستخدماً مشغل الهوية البرمجي:
    ...

list1 = [1, 2, 3]
list2 = list1
list3 = [1, 2, 3]

print(is_same_memory_object(list1, list2)) # يجب أن تعيد True
print(is_same_memory_object(list1, list3)) # يجب أن تعيد False`,
          expectedOutputHint: "True ثم False",
          solutionCode: `def is_same_memory_object(obj1, obj2) -> bool:
    return obj1 is obj2

list1 = [1, 2, 3]
list2 = list1
list3 = [1, 2, 3]

print(is_same_memory_object(list1, list2))
print(is_same_memory_object(list1, list3))`
        },
        interviewTips: [
          "في مقابلات Google/OpenAI: إذا سُئلت عن الفرق بين == و is في بايثون: مشغل == يتحقق من تساوي القيم (Equality of values)، بينما مشغل is يتحقق من تطابق العنوان الفيزيائي في الذاكرة (Identity of object).",
          "اذكر دائماً أن Multi-threading في بايثون ممتاز لعمليات الإدخال والإخراج (I/O-Bound) مثل استدعاءات الشبكة، بينما Multi-processing إلزامي للعمليات الحسابية الخالصة (CPU-Bound)."
        ]
      },
      {
        id: "0-3",
        title: "البرمجة كائنية التوجه المتقدمة والدوال الخاصة (Advanced OOP & Dunder Methods)",
        subtitle: "بناء فئات احترافية، أسلوب Magic Methods (__call__, __getitem__, __len__)، والمولدات (Generators) للتدريب الضخم",
        duration: "3 ساعات دراسية + تطبيقات إنتاجية",
        readTime: "25 دقيقة قراءة",
        sections: [
          {
            id: "sec-0-3-1",
            title: "لماذا تُبنى كل طبقات PyTorch كفئات كائنية التوجه (OOP Modules)؟",
            content: `عندما تبني شبكة عصبية في مكتبات مثل PyTorch، ستلاحظ أن كل طبقة وكل نموذج يرث من الفئة الأساسية \`torch.nn.Module\`.
لماذا اعتمد كبار مهندسي الذكاء الاصطناعي هذا النمط البرمجي؟
1. **تغليف المعلمات (Parameter Encapsulation):** كل طبقة تحتفظ بأوزانها ($W$) وانحيازاتها ($b$) وتدرجاتها الحسابية في مكان موحد.
2. **أسلوب الدالة السحرية \`__call__\`:** يتيح لك معاملة الكائن كدالة رياضية قابلة للاستدعاء المباشر (\`output = model(inputs)\`) مع تشغيل خطافات التدرجات (Forward Hooks) تلقائياً خلف الكواليس.
3. **الدوال السحرية \`__repr__\` و \`__len__\` و \`__getitem__\`:** هي حجر الزاوية لبناء وحدات تحميل البيانات (Custom Datasets) التي تستوعب مليارات التوكنات دون استهلاك رامات الجهاز.`,
            takeaway: "البرمجة كائنية التوجه في بايثون ليست مجرد تنظيم كود، بل هي الأساس المعماري لكل مكتبات التعلم العميق في العالم."
          },
          {
            id: "sec-0-3-2",
            title: "المولدات (Generators) والدفق التكراري للبيانات الضخمة (Streaming Iterators)",
            content: `تخيل أنك تدرب نموذجاً لغوياً على مجموعة بيانات بحجم 500 جيجابايت. إذا حاولت تحميل كل هذا الملف داخل قائمة بايثون عادية (\`list\`)، سيمتلئ الرام وينهار السيرفر فوراً بـ \`MemoryError\`!

**الحل الهندسي: المولدات بكلمة \`yield\` (Generators)**
المولد لا يقوم بتحميل كل البيانات في الذاكرة دفعة واحدة، بل يحتفظ بحالة التنفيذ (Execution State) وينتج عنصراً واحداً فقط في كل مرة يُطلب فيها (\`Lazy Evaluation\`).
- **القائمة العادية (\`list\`):** $O(N)$ مساحة في الذاكرة.
- **المولد (\`Generator\`):** $O(1)$ مساحة في الذاكرة دائماً (يستهلك بضعة بايتات فقط مهما كان حجم البيانات بالمليارات!).`,
            mathFormulas: [
              "\\text{Memory Space of List}: \\quad S_{\\text{list}} = O(N) \\implies 10^9 \\text{ items} \\approx 8 \\text{ GB RAM}",
              "\\text{Memory Space of Generator}: \\quad S_{\\text{gen}} = O(1) \\implies 10^9 \\text{ items} \\approx 120 \\text{ bytes RAM}"
            ],
            takeaway: "كل خط أنابيب بيانات (Data Pipeline) حديث في تدريب نماذج الذكاء الاصطناعي يعتمد على المولدات التكرارية لتفادي اختناق الذاكرة."
          }
        ],
        pythonCode: {
          title: "بناء طبقة ذكاء اصطناعي كاملة بأسلوب PyTorch OOP ومولد دفعات بيانات",
          filename: "custom_nn_module_and_generator.py",
          explanation: "كود احترافي يطبق فئة LinearLayer خاصة تحاكي طريقة عمل nn.Module مع مولد ذكي لدفق دفعات التدريب (Batches) خطوة بخطوة بذاكرة مستقرة O(1).",
          code: `import random

# 1. بناء طبقة خطية بأسلوب الكائنات المتقدمة (Dunder Methods)
class CustomLinearLayer:
    def __init__(self, in_features: int, out_features: int):
        self.in_features = in_features
        self.out_features = out_features
        # تهيئة الأوزان والانحياز بقيم عشوائية صغيرة
        self.weight = [[random.uniform(-0.1, 0.1) for _ in range(in_features)] for _ in range(out_features)]
        self.bias = [0.0 for _ in range(out_features)]
        
    # الدالة السحرية التي تجعل الكائن قابلاً للاستدعاء مباشرة model(x)
    def __call__(self, x: list[float]) -> list[float]:
        # حساب الضرب الماتريكسي y = Wx + b
        outputs = []
        for row, b in zip(self.weight, self.bias):
            val = sum(w_val * x_val for w_val, x_val in zip(row, x)) + b
            outputs.append(val)
        return outputs
        
    def __repr__(self) -> str:
        return f"CustomLinearLayer(in_features={self.in_features}, out_features={self.out_features})"

# 2. مولد بيانات لتدريب النماذج بذاكرة O(1) دون ملء الرام
def stream_training_batches(total_samples: int, batch_size: int):
    """ينتج دفعات بيانات خطوة بخطوة باستخدام yield"""
    current_sample = 0
    while current_sample < total_samples:
        batch = [random.gauss(0, 1) for _ in range(batch_size)]
        current_sample += batch_size
        yield batch

# تجربة الطبقة والمولد
layer = CustomLinearLayer(in_features=4, out_features=2)
print("معلومات الطبقة:", layer)

# استدعاء المولد ومعالجة الدفعات دون استهلاك ذاكرة
data_stream = stream_training_batches(total_samples=100_000, batch_size=4)
first_batch = next(data_stream)
layer_output = layer(first_batch)

print("المدخلات (Batch):", [round(v, 2) for v in first_batch])
print("مخرجات الطبقة:", [round(v, 2) for v in layer_output])`
        },
        videoResources: [
          {
            title: "Python Object Oriented Programming (OOP) Masterclass",
            instructor: "Tech With Tim",
            duration: "ساعتان كاملتان",
            videoUrl: "https://www.youtube.com/watch?v=JeznW_7DlB0",
            embedId: "JeznW_7DlB0",
            platform: "YouTube",
            summary: "شرح شامل وتطبيقي للبرمجة كائنية التوجه في بايثون: الأصناف (Classes)، الكائنات، الوراثة (Inheritance)، التغليف، وتطبيقها في تنظيم طبقات التعلم العميق.",
            keyTakeaways: [
              "فهم المبادئ الأربعة للـ OOP في بايثون وتطبيقها في الشبكات العصبية",
              "استخدام الدوال السحرية Dunder Methods وتنظيم كود النماذج"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Fluent Python: Clear, Concise, and Effective Programming (2nd Edition)",
            authors: "Luciano Ramalho",
            year: 2022,
            arxivUrl: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
            badge: "الكتاب المقدس لبايثون المتقدمة وهندسة الكائنات",
            citation: "Ramalho, Luciano. Fluent Python: Clear, Concise, and Effective Programming. O'Reilly Media, 2022."
          }
        ],
        practicalExercise: {
          prompt: "اكتب مولد بايثون (Generator) يسمى chunk_tokens يأخذ قائمة من التوكنات وحجم النافذة k، ويعيد شرائح بطول k بالتتابع باستخدام كلمة yield.",
          initialCode: `def chunk_tokens(tokens: list, k: int):
    # اكتب المولد هنا باستخدام yield:
    ...

# تجربة المولد
sample_tokens = [101, 2054, 2003, 1037, 3231, 102]
for chunk in chunk_tokens(sample_tokens, k=2):
    print(chunk)`,
          expectedOutputHint: "[101, 2054] ثم [2003, 1037] ثم [3231, 102]",
          solutionCode: `def chunk_tokens(tokens: list, k: int):
    for i in range(0, len(tokens), k):
        yield tokens[i:i + k]

sample_tokens = [101, 2054, 2003, 1037, 3231, 102]
for chunk in chunk_tokens(sample_tokens, k=2):
    print(chunk)`
        },
        interviewTips: [
          "في مقابلات كبار المهندسين: عندما يسألونك عن الفرق بين المولدات (Generators) والقوائم (Lists): الإجابة الاحترافية هي 'Generators employ lazy evaluation with O(1) memory space, yielding elements on-demand without materializing the full collection in RAM'.",
          "احرص دائماً على تطبيق __call__ عند تصميم بنى الذكاء الاصطناعي لتمكين التكوين السهل (Composable Architectures)."
        ]
      },
      {
        id: "0-4",
        title: "هياكل البيانات والخوارزميات ونظرية التعقيد لمقابلات OpenAI",
        subtitle: "تحليل Big-O الزمني والمكاني، جداول التجزئة (Hash Tables)، الأشجار، والـ Tries لترميز الكلمات (Tokenization)",
        duration: "4 ساعات دراسية + حل مسائل خوارزمية",
        readTime: "35 دقيقة قراءة",
        sections: [
          {
            id: "sec-0-4-1",
            title: "لماذا يسألون في OpenAI و DeepMind عن هياكل البيانات والخوارزميات؟",
            content: `قد تتساءل: ما علاقة خوارزميات البحث وجداول التجزئة بنماذج الذكاء الاصطناعي التي تزن مليارات المعلمات؟
الحقيقة أن أنظمة الذكاء الاصطناعي تعتمد في جوهرها على خوارزميات فائقة الكفاءة:
1. **خوارزميات الـ Tokenizers (مثل Byte-Pair Encoding):** تعتمد بالكامل على قواميس التجزئة (Hash Maps) وأشجار الـ Trie وأكوام الأسبقية (Min-Heaps / Priority Queues) لتجميع أكثر التوكنات تكراراً في نصوص مليارات الكلمات في زمن خطي أو شبه خطي $O(N \\log V)$.
2. **استرجاع المتجهات وقواعد البيانات الفيكتورية (Vector Search in RAG):** خوارزميات مثل HNSW (Hierarchical Navigable Small World) هي عبارة عن رسوم بيانية معقدة (Graph Algorithms) تبحث عن أقرب جيران في فضاء $D$-dimensional في زمن $O(\\log N)$.
3. **تحليل التعقيد الحسابي (Big-O Notation):** إذا كانت خوارزميتك تعمل بتعقيد $O(N^2)$، فإن مضاعفة طول السياق (Context Window) من 8K إلى 128K سيتطلب $16^2 = 256$ ضعفاً من الحوسبة، وهو ما جعل باحثي الذكاء الاصطناعي يخترعون FlashAttention ليتحول من تعقيد الذاكرة $O(N^2)$ إلى $O(N)$!`,
            mathFormulas: [
              "\\text{Self-Attention Standard Memory}: \\quad O(N^2) \\quad (N = \\text{sequence length})",
              "\\text{Hash Table Lookup}: \\quad \\text{Average } O(1), \\quad \\text{Worst-case } O(N)",
              "\\text{Trie Prefix Search}: \\quad O(L) \\quad (L = \\text{length of token string})"
            ],
            takeaway: "المهندس الذي لا يتقن تعقيد الخوارزميات وهياكل البيانات سيكتب كوداً ينهار عند التعامل مع أطوال سياق النماذج الضخمة."
          },
          {
            id: "sec-0-4-2",
            title: "بنية شجرة الـ Trie: كيف تبحث خوارزميات التوكنات عن الكلمات بسرعة فائقة؟",
            content: `عندما يقرأ النموذج اللغوي نصاً مثل *"Automating"*:
هل يفحص كل كلمة في معجم يضم 100,000 توكن واحداً تلو الآخر في زمن $O(V)$؟ مستحيل!
يستخدم المحلل شجرة سابقة (Trie - Prefix Tree):
- كل عقدة في الشجرة تمثل حرفاً أو بايتًا واحداً.
- عند البحث، نسير من الجذر إلى الأفرع حرفاً بحرف.
- زمن البحث يعتمد فقط على **طول الكلمة المراد تقطيعها ($L$)**، وهو مستقل تماماً عن حجم المعجم الضخم!`,
            takeaway: "شجرة الـ Trie هي هيكل البيانات الأساسي للبحث السريع في معاجم ومحللات التوكنات الضخمة (Tokenizers)."
          }
        ],
        pythonCode: {
          title: "بناء هيكل بيانات Trie للبحث السريع عن التوكنات والكلمات المفتاحية",
          filename: "trie_tokenizer_index.py",
          explanation: "تطبيق عملي كامل لهيكل بيانات Trie قادر على فهرسة الكلمات والبحث عن أطول بادئة مطابقة (Longest Prefix Match) كما تفعل خوارزميات التوكنات في LLMs.",
          code: `class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end_of_token = False
        self.token_id: int | None = None

class TokenTrie:
    def __init__(self):
        self.root = TrieNode()
        
    def insert(self, word: str, token_id: int):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_token = True
        node.token_id = token_id
        
    def find_longest_prefix(self, text: str) -> tuple[str, int | None]:
        node = self.root
        longest_match = ""
        matched_token_id = None
        current_str = ""
        
        for char in text:
            if char in node.children:
                current_str += char
                node = node.children[char]
                if node.is_end_of_token:
                    longest_match = current_str
                    matched_token_id = node.token_id
            else:
                break
                
        return longest_match, matched_token_id

# تجربة فهرسة مجموعة توكنات في الـ Trie
vocab_trie = TokenTrie()
vocab_trie.insert("auto", token_id=101)
vocab_trie.insert("automate", token_id=102)
vocab_trie.insert("automation", token_id=103)
vocab_trie.insert("ai", token_id=104)

# اختبار البحث عن أطول مطابقة لكلمة "automation_platform"
match_word, t_id = vocab_trie.find_longest_prefix("automation_platform")
print(f"أطول توكن تم العثور عليه: '{match_word}' بمعرف توكن (ID): {t_id}")`
        },
        videoResources: [
          {
            title: "Algorithms & Data Structures Full Course - Stanford CS166 / LeetCode Hard Patterns",
            instructor: "William Fiset (Former Google Software Engineer)",
            duration: "ساعتان ونصف",
            videoUrl: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
            embedId: "RBSGKlAvoiM",
            platform: "YouTube",
            summary: "شرح شامل وعميق لهياكل البيانات المتقدمة: Dynamic Arrays, Hash Tables, Trees, Tries, Disjoint-Set Unions والمفاهيم الخوارزمية الأساسية في المقابلات.",
            keyTakeaways: [
              "فهم تقنيات حل تصادمات جداول التجزئة (Chaining vs Open Addressing)",
              "إتقان تحليل التعقيد الزمني والمكاني لمختلف الهياكل"
            ],
            lectures: [
              { id: "ds-0", title: "مقدمة وتعقيد الخوارزميات Big-O", duration: "27 دقيقة", embedId: "RBSGKlAvoiM", startTime: 0 },
              { id: "ds-1", title: "المصفوفات الديناميكية (Dynamic Arrays)", duration: "8 دقائق", embedId: "RBSGKlAvoiM", startTime: 1660 },
              { id: "ds-2", title: "القوائم المترابطة (Singly & Doubly Linked Lists)", duration: "23 دقيقة", embedId: "RBSGKlAvoiM", startTime: 2103 },
              { id: "ds-3", title: "المكدس والطابور (Stacks & Queues)", duration: "33 دقيقة", embedId: "RBSGKlAvoiM", startTime: 3506 },
              { id: "ds-4", title: "طوابير الأولية وأشجار الهيب (Priority Queues & Heaps)", duration: "56 دقيقة", embedId: "RBSGKlAvoiM", startTime: 5492 },
              { id: "ds-5", title: "مجموعات الاتحاد والتفكيك (Union Find / Disjoint Set)", duration: "48 دقيقة", embedId: "RBSGKlAvoiM", startTime: 8906 }
            ]
          }
        ],
        referencePapers: [
          {
            title: "Introduction to Algorithms (CLRS - 4th Edition)",
            authors: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
            year: 2022,
            arxivUrl: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
            badge: "المرجع الخوارزمي الأعظم على وجه الأرض (CLRS)",
            citation: "Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). Introduction to algorithms. MIT press."
          }
        ],
        practicalExercise: {
          prompt: "اكتب دالة خوارزمية تأخذ قائمة من أعداد صحيحة وتبحث عن قيمتين مجموعهما يساوي target في زمن O(N) مستخدماً جدول تجزئة (Hash Map).",
          initialCode: `def two_sum_linear(nums: list[int], target: int) -> tuple[int, int]:
    # اكتب الحل الخطي O(N):
    ...

# تجربة: البحث عن رقمين مجموعهما 9 في [2, 7, 11, 15]
print(two_sum_linear([2, 7, 11, 15], 9))`,
          expectedOutputHint: "(0, 1) - لأن 2 + 7 = 9",
          solutionCode: `def two_sum_linear(nums: list[int], target: int) -> tuple[int, int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return (seen[complement], i)
        seen[num] = i
    return (-1, -1)

print(two_sum_linear([2, 7, 11, 15], 9))`
        },
        interviewTips: [
          "السؤال المفضل في مقابلات OpenAI: 'ما هو تعقيد الذاكرة لـ Self-Attention مع زيادة طول السياق؟' الإجابة الفورية: O(N^2) بسبب مصفوفة الانتباه N x N، مع الإشارة لحلول FlashAttention و RingAttention.",
          "احرص دائماً على ذكر الـ Space Complexity بجانب الـ Time Complexity؛ إهمال استهلاك الذاكرة هو السبب الأول لرسوب المهندسين في المقابلات التقنية."
        ]
      },
      {
        id: "0-5",
        title: "مكدس الحوسبة العلمية والرياضية بـ NumPy و Vectorization",
        subtitle: "تخطيط الذاكرة C-Contiguous، الـ Strides، قواعد البث التلقائي (Broadcasting)، ورمزية آينشتاين (Einsum)",
        duration: "3 ساعات دراسية + مختبر مصفوفات",
        readTime: "25 دقيقة قراءة",
        sections: [
          {
            id: "sec-0-5-1",
            title: "تشريح مصفوفات NumPy من الداخل: لماذا هي أسرع بـ 100 ضعف من قوائم بايثون؟",
            content: `في بايثون، القائمة العادية \`[1, 2, 3]\` هي عبارة عن مصفوفة من المؤشرات (Pointers) إلى كائنات منفصلة مبعثرة في الـ Heap، مما يتسبب في بطء شديد أثناء القراءة المتتابعة.

على العكس تماماً، مصفوفة **NumPy (\`ndarray\`)** هي كتلة متصلة واحدة ومباشرة في الذاكرة الفيزيائية (**C-Contiguous Buffer**):
1. **البيانات مكدسة بدون أي Overload:** الأعداد مخزنة كأعداد صحيحة خام (Raw Bytes).
2. **الـ Strides:** هو عدد البايتات التي يجب أن يقفزها المعالج في الذاكرة للانتقال إلى العنصر التالي في كل بُعد. تغيير شكل المصفوفة (\`reshape\` أو \`transpose\`) في NumPy لا ينسخ البيانات إطلاقاً، بل يغير فقط أرقام الـ Strides في زمن $O(1)$!
3. **تعليمات SIMD في المعالج:** تتيح لعتاد المعالج إجراء عمليات الجمع والضرب على 8 أو 16 رقماً في نفس نبضة الساعة الواحدة (Vectorization).`,
            mathFormulas: [
              "\\text{Address of } A[i, j] = \\text{Base Address} + (i \\times \\text{stride}_0) + (j \\times \\text{stride}_1)",
              "\\text{Transpose Operation}: \\quad \\text{Strides}(A^T) = (\\text{stride}_1, \\text{stride}_0) \\implies O(1) \\text{ Zero-Copy!}"
            ],
            takeaway: "مصفوفات NumPy هي الجسر السريع بين بايثون وعالم الحوسبة المتوازية منخفضة المستوى، وعمليات تغيير الشكل تكون غالباً بلا نسخ (Zero-Copy Views)."
          },
          {
            id: "sec-0-5-2",
            title: "رمزية جمع آينشتاين (Einstein Summation - Einsum): لغة كبار الباحثين",
            content: `في أكواد النماذج الحديثة ومكتبات مثل PyTorch و JAX، نادراً ما يستخدم الباحثون دوال مثل \`matmul\` أو \`tensordot\`. بدلاً من ذلك، يستخدمون **\`torch.einsum\`**:
تتيح لك كتابة أي عملية ضرب متعدد الأبعاد أو استخراج قطر أو تبديل أبعاد أو حساب انتباه متعدد الرؤوس (Multi-Head Attention) بسطر كود واحد فائق الوضوح والسرعة:

- **الضرب النقطي (Dot Product):** \`np.einsum('i,i->', a, b)\`
- **ضرب المصفوفات (Matrix Multiply):** \`np.einsum('ik,kj->ij', A, B)\`
- **ضرب مصفوفات الانتباه في نماذج اللغة (Batch Multi-Head Attention):**
\`torch.einsum('bqhd,bkhd->bhqk', Q, K)\``,
            takeaway: "إتقان Einsum هو الفارق الذي يميز مبرمج بايثون العادي عن باحث ومهندس أنظمة الذكاء الاصطناعي المحترف."
          }
        ],
        pythonCode: {
          title: "فحص الـ Strides ومقارنة أداء الحوسبة المتجهة بـ NumPy مقابل الحلقات",
          filename: "numpy_strides_and_einsum.py",
          explanation: "كود يستعرض مصفوفة ثنائية الأبعاد، ويفحص الـ strides الخاصة بها، ثم يقارن سرعة حساب ضرب المصفوفات بحلقات بايثون مقابل NumPy المتجه ورمزية einsum.",
          code: `import numpy as np
import time

# 1. فحص الـ Strides والـ Zero-Copy Transpose
arr = np.arange(12, dtype=np.int32).reshape(3, 4)
print("المصفوفة الأصلية (3x4):\n", arr)
print(f"خطوات الانتقال (Strides): {arr.strides} بايت")
# 16 بايت للقفز بين الصفوف (4 عناصر * 4 بايت لكل int32)، و 4 بايت للقفز بين الأعمدة

# تدوير المصفوفة (Transpose)
transposed = arr.T
print(f"خطوات انتقال المصفوفة المدورة: {transposed.strides} بايت")
print(f"هل تشارك المصفوفة المدورة نفس الذاكرة الأصلية دون نسخ؟ {transposed.base is arr}")

# 2. مقارنة سرعة الضرب الماتريكسي (1000x1000)
A = np.random.randn(800, 800).astype(np.float32)
B = np.random.randn(800, 800).astype(np.float32)

# حساب الناتج باستخدام np.matmul (BLAS Vectorized)
t0 = time.perf_counter()
C_matmul = np.matmul(A, B)
t_matmul = time.perf_counter() - t0

# حساب نفس الناتج باستخدام رمزية آينشتاين (Einsum)
t0 = time.perf_counter()
C_einsum = np.einsum('ik,kj->ij', A, B)
t_einsum = time.perf_counter() - t0

print(f"وقت التنفيذ بـ np.matmul: {t_matmul * 1000:.2f} ميلي ثانية")
print(f"وقت التنفيذ بـ np.einsum: {t_einsum * 1000:.2f} ميلي ثانية")
print(f"هل نتائج Matmul و Einsum متطابقة تماماً؟ {np.allclose(C_matmul, C_einsum)}")`
        },
        videoResources: [
          {
            title: "Python for Data Science - NumPy, Pandas, Tensors & Vectorization Full Course",
            instructor: "FreeCodeCamp & Keith Galli",
            duration: "12 ساعة كاملة من التطبيقات العملية",
            totalCourseHours: "12 ساعة",
            courseType: "Complete Series",
            videoUrl: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
            embedId: "LHBE6Q9XlzI",
            platform: "YouTube",
            summary: "شرح شامل وعميق لهندسة المصفوفات والتنسورات ومكتبة NumPy وعمليات الضرب النقطي والـ Broadcasting وتسريع الحسابات الرياضية للذكاء الاصطناعي.",
            keyTakeaways: [
              "كيف تستفيد العمليات الرياضية من مسجلات التوجيه المتوازي في المعالجات",
              "تطبيق قواعد البث التلقائي (Broadcasting Rules) دون استهلاك مفرط للذاكرة"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Array Programming with NumPy",
            authors: "Charles R. Harris et al.",
            year: 2020,
            arxivUrl: "https://www.nature.com/articles/s41586-020-2649-2",
            badge: "الورقة البحثية القياسية المنشورة في مجلة Nature",
            citation: "Harris, C. R., et al. (2020). Array programming with NumPy. Nature, 585(7825), 357-362."
          }
        ],
        practicalExercise: {
          prompt: "باستخدام np.einsum، اكتب تعبيراً واحداً لحساب حاصل ضرب مصفوفتين A و B، ثم استخراج مجموع عناصر القطر الرئيسي (Trace) للمصفوفة الناتجة.",
          initialCode: `import numpy as np

def matrix_product_trace(A: np.ndarray, B: np.ndarray) -> float:
    # اكتب حل einsum بسطر واحد هنا:
    ...

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(matrix_product_trace(A, B))`,
          expectedOutputHint: "70.0 (لأن حاصل الضرب يحتوي على 19 و 51 في القطر الرئيسي، ومجموعهما 70)",
          solutionCode: `import numpy as np

def matrix_product_trace(A: np.ndarray, B: np.ndarray) -> float:
    return float(np.einsum('ik,ki->', A, B))

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(matrix_product_trace(A, B))`
        },
        interviewTips: [
          "في المقابلات الرياضية: إذا سُئلت 'كيف تطبق Broadcasting في NumPy؟'، اذكر الشرطين: يجب أن يتساوى بعدا المصفوفتين، أو أن يكون أحد البعدين مساوياً للرقم 1.",
          "احذر دائماً من استخدام حلقات for العادية عند معالجة المصفوفات في بايثون؛ أظهر للمقابل أنك تعتمد دائماً على المتجهات والحوسبة المتزامنة (Vectorized Operations)."
        ]
      },
      {
        id: "0-6",
        title: "الرياضيات التطبيقية للذكاء الاصطناعي: الجبر الخطي، التفاضل، ونظرية المعلومات",
        subtitle: "المتجهات والتحويلات الخطية، الاشتقاق متعدد المتغيرات (Gradients & Jacobians)، وقاعدة السلسلة (Chain Rule)",
        duration: "4 ساعات دراسية + حل اشتقاقات رياضية",
        readTime: "35 دقيقة قراءة",
        sections: [
          {
            id: "sec-0-6-1",
            title: "الجبر الخطي (Linear Algebra): لغة الفضاءات المتعددة الأبعاد",
            content: `لماذا الجبر الخطي هو العمود الفقري للذكاء الاصطناعي؟
لأن كل توكن وكل صورة وكل وزن في الشبكة العصبية هو عبارة عن **متجه في فضاء متعدد الأبعاد (High-Dimensional Vector Space)**:
- في نموذج مثل LLaMA 3، أبعاد التضمين (Embedding Dimension) $d = 4096$. كل كلمة يتم تمثيلها بنقطة في فضاء ذي 4096 بُعد!
- ضرب المصفوفات هو في حقيقته **تحويل خطي (Linear Transformation)** يقوم بتدوير الفضاء وتمديده ليعزل المفاهيم الدلالية.
- **تفكيك القيم المفردة (SVD - Singular Value Decomposition):** هو الأساس الرياضي لتقنيات ضغط النماذج وخفض الرتبة (LoRA - Low-Rank Adaptation)، حيث نحول مصفوفة أوزان عملاقة إلى مصفوفتين صغيرتين $W \\approx B \\times A$.`,
            mathFormulas: [
              "\\text{Linear Map}: \\quad y = Wx + b \\quad (W \\in \\mathbb{R}^{m \\times n}, x \\in \\mathbb{R}^n)",
              "\\text{SVD Decomposition}: \\quad W = U \\Sigma V^T",
              "\\text{Low-Rank Approximation (LoRA)}: \\quad \\Delta W = B \\times A \\quad (B \\in \\mathbb{R}^{d \\times r}, A \\in \\mathbb{R}^{r \\times k}, r \\ll d)"
            ],
            takeaway: "الشبكات العصبية هي في جوهرها تسلسل من التحويلات الخطية متعددة الأبعاد تتخللها دوال تنشيط غير خطية."
          },
          {
            id: "sec-0-6-2",
            title: "التفاضل وقاعدة السلسلة (Calculus & The Multivariable Chain Rule)",
            content: `كيف يتعلم النموذج من أخطائه؟
عبر حساب **التدرج (Gradient - $\\nabla L$)**، وهو متجه يحدد اتجاه أقصى صعود لدالة الخطأ (Loss Function). لتحسين النموذج، نسير في عكس اتجاه هذا التدرج (Gradient Descent):
$$\\theta_{\\text{new}} = \\theta_{\\text{old}} - \\eta \\nabla L$$

**قاعدة السلسلة (Chain Rule):**
الشبكة العصبية هي دالة مركبة ضخمة: $L = f_3(f_2(f_1(x)))$.
لحساب تدرج الخطأ بالنسبة لأوزان الطبقة الأولى، نستخدم قاعدة السلسلة لمضاعفة المصفوفات الجاكوبية (Jacobian Matrices):
$$\\frac{\\partial L}{\\partial W_1} = \\frac{\\partial L}{\\partial f_3} \\cdot \\frac{\\partial f_3}{\\partial f_2} \\cdot \\frac{\\partial f_2}{\\partial f_1} \\cdot \\frac{\\partial f_1}{\\partial W_1}$$

هذه المعادلة الرياضية هي الأساس الحسابي لخوارزمية **الانتشار الخلفي (Backpropagation)**!`,
            mathFormulas: [
              "\\text{Gradient}: \\quad \\nabla L = \\left[ \\frac{\\partial L}{\\partial w_1}, \\frac{\\partial L}{\\partial w_2}, \\dots, \\frac{\\partial L}{\\partial w_n} \\right]^T",
              "\\text{Gradient Descent Update}: \\quad w \\leftarrow w - \\eta \\frac{\\partial L}{\\partial w}",
              "\\text{Cross-Entropy Loss}: \\quad L = -\\sum_{i} y_i \\log(\\hat{y}_i)"
            ],
            takeaway: "التعلم في الذكاء الاصطناعي هو مسألة تحسين رياضي مستمرة لحساب المشتقات عبر قاعدة السلسلة وتحديث الأوزان لتقليل دالة الخسارة."
          }
        ],
        pythonCode: {
          title: "حساب المشتقة رياضياً وبرمجياً والتحقق من التدرج (Numerical Gradient Checking)",
          filename: "analytical_vs_numerical_gradients.py",
          explanation: "كود يقارن بين المشتقة التحليلية الدقيقة المحسوبة يدوياً بقواعد التفاضل والمشتقة العددية التقريبية عبر تعريف نهاية نيوتن للتأكد من صحة الحسابات.",
          code: `import math

# لنفترض أن دالتنا الرياضية هي: f(x) = x^3 + 2*x^2 + 5
def f(x: float) -> float:
    return x**3 + 2 * (x**2) + 5

# 1. المشتقة التحليلية بالورقة والقلم: f'(x) = 3*x^2 + 4*x
def analytical_derivative(x: float) -> float:
    return 3 * (x**2) + 4 * x

# 2. المشتقة العددية التقريبية باستخدام الفروق المركزية (Centered Difference Formula)
def numerical_derivative(f, x: float, h: float = 1e-5) -> float:
    return (f(x + h) - f(x - h)) / (2 * h)

# اختبار النتيجة عند النقطة x = 4.0
x_val = 4.0
exact_grad = analytical_derivative(x_val)
approx_grad = numerical_derivative(f, x_val)

print(f"المشتقة التحليلية الدقيقة f'({x_val}): {exact_grad:.6f}")
print(f"المشتقة العددية التقريبية f'({x_val}): {approx_grad:.6f}")
print(f"الخطأ النسبي بين الحسابين: {abs(exact_grad - approx_grad):.2e}")`
        },
        videoResources: [
          {
            title: "The Essence of Calculus & Linear Algebra (3Blue1Brown Full Series)",
            instructor: "Grant Sanderson (3Blue1Brown)",
            duration: "3 ساعات",
            videoUrl: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
            embedId: "WUvTyaaNkzM",
            platform: "YouTube",
            summary: "المرجع البصري والرياضي الأشهر عالمياً الذي يجسد معاني التحويلات الخطية والمشتقات والمتجهات بصرياً بطريقة سينمائية ساحرة ومثبتة في الذاكرة.",
            keyTakeaways: [
              "فهم التحويلات الخطية وتغير المساحات والحجوم (Determinant)",
              "تخيل متجهات التدرج كمنحدرات طوبوغرافية في أسطح متعددة الأبعاد"
            ],
            lectures: [
              { id: "calc-1", title: "الفصل 1: جوهر علم التفاضل والتكامل (The Essence of Calculus)", duration: "17 دقيقة", embedId: "WUvTyaaNkzM" },
              { id: "calc-2", title: "الفصل 2: مفارقة المشتقة ومعدل التغير اللحظي (Paradox of the Derivative)", duration: "18 دقيقة", embedId: "9vKqVkMQHKk" },
              { id: "calc-3", title: "الفصل 3: القوانين الهندسية لاشتقاق الدوال (Derivative Formulas Through Geometry)", duration: "19 دقيقة", embedId: "Loa_ATWUMp0" },
              { id: "calc-4", title: "الفصل 4: قاعدة السلسلة والضرب بصرياً (Visualizing Chain & Product Rule)", duration: "16 دقيقة", embedId: "YG15m2VwSjA" },
              { id: "calc-5", title: "الفصل 5: النهايات وقاعدة لوبيتال (Limits & L'Hôpital's Rule)", duration: "18 دقيقة", embedId: "gkiRhkru8Nc" },
              { id: "calc-6", title: "الفصل 6: التكامل وحساب المساحات تحت المنحنيات (Integration & Areas)", duration: "15 دقيقة", embedId: "FnJqaIESC2s" }
            ]
          }
        ],
        referencePapers: [
          {
            title: "Mathematics for Machine Learning",
            authors: "Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong",
            year: 2020,
            arxivUrl: "https://mml-book.github.io/",
            badge: "المرجع الرياضي الأكاديمي المعتمد من جامعة كامبريدج",
            citation: "Deisenroth, M. P., Faisal, A. A., & Ong, C. S. (2020). Mathematics for machine learning. Cambridge University Press."
          }
        ],
        practicalExercise: {
          prompt: "اكتب دالة بايثون لحساب خسارة الإنتروبيا المتقاطعة (Cross-Entropy Loss) بين متجه التوزيع الحقيقي y والتوزيع المتوقع y_pred.",
          initialCode: `import math

def compute_cross_entropy(y_true: list[float], y_pred: list[float]) -> float:
    # احسب L = -sum(y * log(p))
    ...

# تجربة: فئة صحيحة [0, 1, 0] وتوقع [0.1, 0.8, 0.1]
print(compute_cross_entropy([0, 1, 0], [0.1, 0.8, 0.1]))`,
          expectedOutputHint: "0.2231 (تقريباً)",
          solutionCode: `import math

def compute_cross_entropy(y_true: list[float], y_pred: list[float]) -> float:
    eps = 1e-12  # لمنع log(0)
    loss = 0.0
    for yt, yp in zip(y_true, y_pred):
        loss -= yt * math.log(max(yp, eps))
    return loss

print(compute_cross_entropy([0, 1, 0], [0.1, 0.8, 0.1]))`
        },
        interviewTips: [
          "في مقابلات DeepMind: عندما يسألونك عن سبب إضافة epsilon متناهية الصغر داخل دالة log في دالة الخسارة: أجب فوراً 'To prevent numerical instability and division by zero when probability predictions approach zero'.",
          "تأكد من معرفتك الكاملة بأن مصفوفة الجاكوبي (Jacobian) هي مصفوفة المشتقات الأولى لدالة متعددة المدخلات والمخرجات، بينما مصفوفة الهيسيان (Hessian) تمثل المشتقات الجزئية من الدرجة الثانية (Curvature)."
        ]
      },
      {
        id: "0-7",
        title: "بناء محرك التعلم العميق والانتشار الخلفي من الصفر المطلق (Building Autograd from Scratch)",
        subtitle: "بناء فئة Value، رسم بياني حسابي (Computational DAG)، حساب التدرجات التلقائي، وتدريب شبكة عصبية بـ Pure Python",
        duration: "5 ساعات دراسية + بناء محرك كامل",
        readTime: "40 دقيقة قراءة تفصيلية",
        sections: [
          {
            id: "sec-0-7-1",
            title: "تحدي كبار المهندسين: هل تفهم PyTorch حقاً أم أنك مجرد مستخدم لمكتباتها؟",
            content: `في مقابلات النخبة في OpenAI، السؤال الحقيقي ليس *"هل تعرف كيف تكتب \`loss.backward()\` في PyTorch؟"*.
السؤال الحقيقي هو: **"لو حذفت منك مكتبة PyTorch و TensorFlow، هل تستطيع بناء محرك حساب التدرجات التلقائي (Automatic Differentiation Engine) بيدك من الصفر؟"**

هذا ما قام به أندريه كارباثي (مدير الذكاء الاصطناعي السابق في تسلا والمؤسس المشارك لـ OpenAI) عندما بنى محرك **micrograd**.
في هذا الدرس، سنبني معاً كلاس \`Value\` الذي:
1. يغلف الأعداد الحقيقية ويسجل العمليات الحسابية (+, -, *, /).
2. يبني شجرة العلاقات الحسابية (Directed Acyclic Graph - DAG) تلقائياً.
3. يطبق خوارزمية الترتيب الطوبولوجي (Topological Sort) لزيارة العقد بالترتيب العكسي الصحيح وحساب مشتقات كل متغير!`,
            takeaway: "بناء محرك التفاضل التلقائي بيدك هو الاختبار الفاصل الذي يحولك من مستخدم هاوٍ إلى مهندس أنظمة ذكاء اصطناعي محترف يدرك كل نبضة في محرك PyTorch."
          },
          {
            id: "sec-0-7-2",
            title: "المعادلات الرياضية للتفاضل التلقائي داخل العقدة العصبية",
            content: `لكل عملية حسابية، نقوم بحساب تدرج المدخلات بناءً على تدرج المخرجات القادم من الأمام (\`out.grad\`):

1. **عملية الجمع ($c = a + b$):**
   $$\\frac{\\partial L}{\\partial a} = \\frac{\\partial L}{\\partial c} \\times 1, \\quad \\frac{\\partial L}{\\partial b} = \\frac{\\partial L}{\\partial c} \\times 1$$
   (الجمع يوزع التدرج بالتساوي على كلا الطرفين).

2. **عملية الضرب ($c = a \\times b$):**
   $$\\frac{\\partial L}{\\partial a} = \\frac{\\partial L}{\\partial c} \\times b, \\quad \\frac{\\partial L}{\\partial b} = \\frac{\\partial L}{\\partial c} \\times a$$
   (التدرج لكل طرف يساوي تدرج المخرج مضروباً في قيمة الطرف الآخر!).

3. **دالة التنشيط التانجه (Tanh):**
   $$\\frac{\\partial L}{\\partial a} = \\frac{\\partial L}{\\partial c} \\times (1 - c^2)$$`,
            mathFormulas: [
              "\\text{Chain Rule at Node}: \\quad \\frac{\\partial L}{\\partial x} = \\sum_{y \\in \\text{Children}} \\frac{\\partial L}{\\partial y} \\frac{\\partial y}{\\partial x}",
              "\\text{Topological Sort Order}: \\quad v_n \\to v_{n-1} \\to \\dots \\to v_1 \\quad (\\text{Reverse DAG Traversal})"
            ],
            takeaway: "محرك التفاضل التلقائي يقوم بتخزين دوال الاشتقاق الموضعي كـ Closures ثم يستدعيها بالترتيب الطوبولوجي العكسي."
          }
        ],
        pythonCode: {
          title: "محرك Autograd مصغر متكامل بـ Pure Python يدرب خلية عصبية من الصفر",
          filename: "micro_autograd_engine.py",
          explanation: "محرك تفاضل تلقائي مكتمل مبني بـ Pure Python بدون أي مكتبة خارجية، ينشئ Graph حسابي ويحسب التدرجات ويدرب خلية عصبية.",
          code: `class Value:
    def __init__(self, data: float, _children=(), _op=""):
        self.data = float(data)
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), "+")
        def _backward():
            self.grad += 1.0 * out.grad
            other.grad += 1.0 * out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), "*")
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def relu(self):
        out = Value(max(0.0, self.data), (self,), "ReLU")
        def _backward():
            self.grad += (1.0 if self.data > 0 else 0.0) * out.grad
        out._backward = _backward
        return out

    def backward(self):
        # الترتيب الطوبولوجي لزيارة العقد بالترتيب العكسي
        topo = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                topo.append(v)
        build_topo(self)

        self.grad = 1.0  # مشتقة الناتج النهائي بالنسبة لنفسه تساوي 1
        for node in reversed(topo):
            node._backward()

    def __repr__(self):
        return f"Value(data={self.data:.4f}, grad={self.grad:.4f})"

# تجربة عملية لتدريب متغير W لتقليل الخطأ
w = Value(2.0)
x = Value(3.0)
target = Value(10.0)
learning_rate = 0.05

print("تدريب المتغير w لتقريب w*x من القيمة 10:")
for step in range(15):
    # 1. Forward pass
    pred = w * x
    diff = pred + (target * -1.0)
    loss = diff * diff  # Mean Squared Error
    
    # 2. Reset gradients
    w.grad = 0.0
    x.grad = 0.0
    
    # 3. Backward pass
    loss.backward()
    
    # 4. Optimizer step (Gradient Descent)
    w.data -= learning_rate * w.grad
    
    if step % 3 == 0 or step == 14:
        print(f"الخطوة {step+1}: التنبؤ = {pred.data:.2f} | الخطأ = {loss.data:.4f} | الوزن = {w.data:.4f}")`
        },
        videoResources: [
          {
            title: "Andrej Karpathy: The spelled-out intro to neural networks and backpropagation: building micrograd",
            instructor: "Andrej Karpathy (Former Director of AI at Tesla / OpenAI)",
            duration: "ساعتان و25 دقيقة",
            videoUrl: "https://www.youtube.com/watch?v=VMj-3S1tku0",
            embedId: "VMj-3S1tku0",
            platform: "YouTube",
            summary: "أهم فيديو تعليمي في تاريخ هندسة الذكاء الاصطناعي الحديث. يبني فيه أندريه كارباثي محرك micrograd والشبكة العصبية كاملة سطراً بسطر أمام عينك بدون أي مكتبات.",
            keyTakeaways: [
              "كيف يعمل الترتيب الطوبولوجي في حساب مشتقات الـ DAG",
              "إدراك كيفية تدفق التدرجات وتحديث الأوزان في نماذج GPT"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Automatic Differentiation in Machine Learning: a Survey",
            authors: "Atilim Gunes Baydin, Barak A. Pearlmutter, Alexey Andreyevich Radul, Jeffrey Mark Siskind",
            year: 2018,
            arxivUrl: "https://arxiv.org/abs/1502.05767",
            badge: "الورقة البحثية المرجعية لتقنيات الـ Autograd الحديثة",
            citation: "Baydin, A. G., Pearlmutter, B. A., Radul, A. A., & Siskind, J. M. (2018). Automatic differentiation in machine learning: a survey. JMLR, 18(1), 5595-5637."
          }
        ],
        practicalExercise: {
          prompt: "باستخدام كلاس Value أعلاه، احسب مشتقة الدالة y = (a + b) * a بالنسبة للمتغير a عندما يكون a = 3 و b = 4.",
          initialCode: `# احسب مشتقة y بالنسبة لـ a:
a = Value(3.0)
b = Value(4.0)
y = (a + b) * a
y.backward()

print("مشتقة y بالنسبة لـ a:", a.grad)`,
          expectedOutputHint: "10.0 (لأن y = a^2 + ab، ومشتقتها بالنسبة لـ a هي 2a + b = 2(3) + 4 = 10)",
          solutionCode: `a = Value(3.0)
b = Value(4.0)
y = (a + b) * a
y.backward()

print("مشتقة y بالنسبة لـ a:", a.grad)`
        },
        interviewTips: [
          "في مقابلات كبار الباحثين في OpenAI: سيطلبون منك كتابة كود backward لعملية الضرب النقطي أو دالة التنشيط على السبورة. احفظ دائماً أن تدرج الإدخال هو حاصل ضرب تدرج الإخراج في القيمة المرافقة.",
          "تذكر دائماً أن علامة += (تراكم التدرجات Gradient Accumulation) إلزامية في كود backward لأن المتغير قد يُستخدم في أكثر من عملية حسابية داخل نفس الـ DAG!"
        ]
      }
    ],
    quiz: [
      {
        id: "q-0-1",
        question: "ما السبب الجوهري الذي يجعل كائن العدد الصحيح البسيط في بايثون (CPython) يستهلك 28 بايت بدلاً من 4 بايتات في لغة C؟",
        options: [
          "لأن بايثون لغة قديمة وغير منظمة",
          "لأن كل عدد في CPython هو كائن PyObject يحتوي على عداد مراجع (ob_refcnt) ومؤشر نوع (ob_type) ومصفوفة أرقام لدقة غير محدودة",
          "لأن بايثون تقوم بتشفير الأعداد بكلمات سرية",
          "لأن كروت الشاشة تتطلب 28 بايت إجبارياً"
        ],
        correctIndex: 1,
        explanation: "في CPython، كل عدد صحيح هو كائن متكامل مخصص على الـ Heap مع بيانات وصفية لعداد المراجع ونوع الكائن ومصفوفة الدقة العالية.",
        difficulty: "Medium"
      },
      {
        id: "q-0-2",
        question: "كيف يتغلب مهندسو نماذج الذكاء الاصطناعي (مثل PyTorch) على قفل المفسر العام (GIL) في بايثون؟",
        options: [
          "يقومون بمسح لغة بايثون وتثبيت لغة أخرى",
          "يقومون بتحرير الـ GIL داخل كود C++ و CUDA لتنفيذ الحسابات المتوازية على كل أنوية المعالج والـ GPU",
          "لا يمكن التغلب عليه أبداً",
          "يقومون بزيادة سرعة الإنترنت فقط"
        ],
        correctIndex: 1,
        explanation: "مكتبات الذكاء الاصطناعي مثل PyTorch تحرر الـ GIL فور بدء العمليات الحسابية الثقيلة لتنفيذها مباشرة على العتاد فائق السرعة عبر C++ و CUDA.",
        difficulty: "Hard"
      },
      {
        id: "q-0-3",
        question: "لماذا تُعد المولدات (Generators بكلمة yield) إلزامية في خطوط أنابيب تدريب النماذج اللغوية الضخمة؟",
        options: [
          "لأنها توفر مساحة الذاكرة بتعقيد O(1) وتنتج البيانات عند الطلب (Lazy Evaluation) دون تحميل كل الملفات في الرام",
          "لأنها تجعل النصوص ملونة",
          "لأنها تترجم الكود إلى لغة جافا",
          "لأنها تمنع المستخدم من إغلاق المتصفح"
        ],
        correctIndex: 0,
        explanation: "المولدات تنتج دفعات التدريب واحدة تلو الأخرى مع بقاء استهلاك الرام شبه معدوم O(1) مهما بلغ حجم بيانات التدريب بمئات الجيجابايتات.",
        difficulty: "Medium"
      },
      {
        id: "q-0-4",
        question: "في مصفوفات NumPy، ما الذي يحدث فعلياً عند إجراء عملية تدوير (Transpose أو Reshape)؟",
        options: [
          "يتم نسخ كل البيانات وحجز مصفوفة جديدة ومضاعفة استهلاك الرام",
          "تعديل خطوات الانتقال (Strides) وأبعاد المصفوفة في زمن O(1) دون أي نسخ للبيانات الفيزيائية (Zero-Copy View)",
          "تتحول المصفوفة إلى ملف نصي",
          "يتوقف البرنامج حتى يكتمل النسخ"
        ],
        correctIndex: 1,
        explanation: "NumPy تغير فقط معاملات الـ Strides ومصفوفة الأبعاد في رأس الكائن، مما يجعل التدوير وتغيير الشكل فورياً وبلا أي نسخ للذاكرة.",
        difficulty: "Hard"
      },
      {
        id: "q-0-5",
        question: "لماذا نستخدم += لتراكم التدرجات (grad += ...) في دوال backward بدلاً من علامة = العادية؟",
        options: [
          "لتفادي الأخطاء الإملائية فقط",
          "لأن المتغير قد يُستخدم في أكثر من تفريع في شجرة الحسابات (DAG)، وقاعدة السلسلة تقتضي جمع كافة التدرجات الواردة من كل المسارات",
          "لأن بايثون لا تدعم علامة =",
          "لزيادة سرعة كرت الشاشة"
        ],
        correctIndex: 1,
        explanation: "وفقاً لقاعدة السلسلة متعددة المتغيرات، إذا تفرع المتغير لأكثر من عقدة، فإن المشتقة الإجمالية هي مجموع المشتقات الجزئية القادمة من كل الفروع.",
        difficulty: "Hard"
      }
    ]
  }
];
