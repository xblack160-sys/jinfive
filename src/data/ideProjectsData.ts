export interface ProjectFile {
  name: string;
  language: 'python' | 'cuda' | 'cpp' | 'yaml' | 'json' | 'shell' | 'markdown';
  content: string;
  description: string;
}

export interface IDEProject {
  id: string;
  title: string;
  category: string;
  level: 'Intermediate' | 'Advanced' | 'Mastery / Research';
  description: string;
  files: ProjectFile[];
  defaultFile: string;
  runCommand: string;
  simulationOutput: string;
  benchmarkStats: {
    tflops?: string;
    vramUsage?: string;
    throughput?: string;
    lossEnd?: string;
  };
}

export const ideProjects: IDEProject[] = [
  {
    id: "nanogpt-mastery",
    title: "بناء وتدريب نموذج NanoGPT متكامل من الصفر",
    category: "معماريات النماذج اللغوية (LLM Core)",
    level: "Advanced",
    description: "مشروع احترافي متكامل لبناء وتدريب نموذج لغوي ذاتي الانتباه بلغة بايثون و PyTorch، يتضمن مصفوفات QKV، القناع السببي، كتل التغذية الأمامية، وحلقة التدريب الحية مع تقييم الخسارة وتوليد النصوص.",
    defaultFile: "model.py",
    runCommand: "python train.py --config config.yaml",
    benchmarkStats: {
      tflops: "142.6 TFLOPS",
      vramUsage: "4.8 GB / 24 GB",
      throughput: "18,450 Tokens/sec",
      lossEnd: "1.42 (Validation Perplexity: 4.13)"
    },
    simulationOutput: `=== [JINNA 5 Enterprise GPU Cluster] ===
> Initializing CUDA Device 0: NVIDIA A100-SXM4-80GB (Ampere)
> Loading dataset: Arabic & Multilingual Technical Corpus (1.2M tokens)
> Compiling PyTorch Model with TorchDynamo (Inductor Backend)...
======================================================================
Model Architecture Summary:
- Layers: 8 Transformer Blocks | Heads: 8 | Embedding Dim: 512
- Context Window: 512 Tokens | Parameters: 25.4 Million
======================================================================
[Epoch 1/5] Step 100/500 | Loss: 3.842 | LR: 3.00e-4 | VRAM: 4.8 GB
[Epoch 1/5] Step 200/500 | Loss: 2.915 | LR: 2.85e-4 | Speed: 18,200 tok/s
[Epoch 2/5] Step 300/500 | Loss: 2.180 | LR: 2.40e-4 | Gradient Norm: 0.82
[Epoch 3/5] Step 400/500 | Loss: 1.764 | LR: 1.80e-4 | Validation Loss: 1.812
[Epoch 5/5] Step 500/500 | Loss: 1.421 | LR: 5.00e-5 | Finished in 42.6s!
======================================================================
[Text Generation Test]:
Prompt: "مفهوم آلية الانتباه في الذكاء الاصطناعي هو"
Output: "مفهوم آلية الانتباه في الذكاء الاصطناعي هو قدرة النموذج على ترجيح أهمية الكلمات المختلفة داخل السياق النصي عبر حساب مصفوفات الاستعلام والمفاتيح، مما يتيح له فهم العلاقات المكانية بدقة فائقة."
>>> Checkpoint saved to: checkpoints/nanogpt_final.pt [PASSED]`,
    files: [
      {
        name: "model.py",
        language: "python",
        description: "معمارية كتل المحول الكاملة (Transformer Block, Causal Self-Attention, MLP)",
        content: `import math
import torch
import torch.nn as nn
from torch.nn import functional as F

class CausalSelfAttention(nn.Module):
    """
    طبقة الانتباه الذاتي متعدد الرؤوس مع تطبيق القناع السببي (Causal Mask)
    لمنع النموذج من النظر إلى التوكنات المستقبلية أثناء التوليد والتدريب.
    """
    def __init__(self, config):
        super().__init__()
        assert config.n_embd % config.n_head == 0
        # ننتج مصفوفات الاستعلام (Q) والمفاتيح (K) والقيم (V) معاً في عملية ضرب خطية واحدة
        self.c_attn = nn.Linear(config.n_embd, 3 * config.n_embd, bias=config.bias)
        # مصفوفة الإسقاط النهائية
        self.c_proj = nn.Linear(config.n_embd, config.n_embd, bias=config.bias)
        # التنظيم ومكافحة فرط التخصيص
        self.attn_dropout = nn.Dropout(config.dropout)
        self.resid_dropout = nn.Dropout(config.dropout)
        self.n_head = config.n_head
        self.n_embd = config.n_embd
        # مصفوفة القناع السببي (مصفوفة مثلثية سفلية)
        self.register_buffer("bias", torch.tril(torch.ones(config.block_size, config.block_size))
                                        .view(1, 1, config.block_size, config.block_size))

    def forward(self, x):
        B, T, C = x.size() # Batch size, Sequence length, Embedding dimensionality
        # حساب Q, K, V
        q, k, v = self.c_attn(x).split(self.n_embd, dim=2)
        k = k.view(B, T, self.n_head, C // self.n_head).transpose(1, 2)
        q = q.view(B, T, self.n_head, C // self.n_head).transpose(1, 2)
        v = v.view(B, T, self.n_head, C // self.n_head).transpose(1, 2)

        # حساب درجات الانتباه المتدرجة: (Q @ K^T) / sqrt(d_k)
        att = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(k.size(-1)))
        # حجب المواضع المستقبلية عبر إعطائها -Infinity قبل الـ Softmax
        att = att.masked_fill(self.bias[:,:,:T,:T] == 0, float('-inf'))
        att = F.softmax(att, dim=-1)
        att = self.attn_dropout(att)
        
        # ضرب درجات الانتباه في مصفوفة القيم (V)
        y = att @ v
        y = y.transpose(1, 2).contiguous().view(B, T, C)
        return self.resid_dropout(self.c_proj(y))

class MLP(nn.Module):
    """شبكة التغذية الأمامية العصبية مع دالة تنشيط GELU والتوسع 4 أضعاف"""
    def __init__(self, config):
        super().__init__()
        self.c_fc    = nn.Linear(config.n_embd, 4 * config.n_embd, bias=config.bias)
        self.gelu    = nn.GELU()
        self.c_proj  = nn.Linear(4 * config.n_embd, config.n_embd, bias=config.bias)
        self.dropout = nn.Dropout(config.dropout)

    def forward(self, x):
        x = self.c_fc(x)
        x = self.gelu(x)
        x = self.c_proj(x)
        return self.dropout(x)

class Block(nn.Module):
    """كتلة محول كاملة مع وصلات متبقية (Residual Connections) وتطبيع مسبق (Pre-LayerNorm)"""
    def __init__(self, config):
        super().__init__()
        self.ln_1 = nn.LayerNorm(config.n_embd)
        self.attn = CausalSelfAttention(config)
        self.ln_2 = nn.LayerNorm(config.n_embd)
        self.mlp = MLP(config)

    def forward(self, x):
        x = x + self.attn(self.ln_1(x))
        x = x + self.mlp(self.ln_2(x))
        return x
`
      },
      {
        name: "train.py",
        language: "python",
        description: "حلقة التدريب الكاملة مع تحسين AdamW ومراقبة معدل التعلم وحفظ الأوزان",
        content: `import time
import torch
from model import Block
import torch.nn as nn

class NanoGPTConfig:
    n_layer = 8
    n_head = 8
    n_embd = 512
    block_size = 512
    vocab_size = 32000
    dropout = 0.1
    bias = False

def train_step(model, optimizer, x, y):
    optimizer.zero_grad(set_to_none=True)
    # استخدام التدريب بالحسابات المختلطة FP16 / BF16 لتسريع الأداء وتوفير الذاكرة
    with torch.amp.autocast(device_type="cuda", dtype=torch.bfloat16):
        logits = model(x)
        loss = nn.functional.cross_entropy(logits.view(-1, logits.size(-1)), y.view(-1))
    
    loss.backward()
    # قص التدرجات (Gradient Clipping) لمنع انفجار المشتقات
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    optimizer.step()
    return loss.item()

print(">> Starting Training Loop with AdamW Optimizer (Beta1=0.9, Beta2=0.95)...")
`
      },
      {
        name: "config.yaml",
        language: "yaml",
        description: "إعدادات المعاملات الفائقة ومسارات التدريب",
        content: `# JINNA 5 Hyperparameter Configuration for NanoGPT
model:
  vocab_size: 32000
  block_size: 512
  n_layer: 8
  n_head: 8
  n_embd: 512
  dropout: 0.1
  bias: false

training:
  batch_size: 32
  learning_rate: 3.0e-4
  min_lr: 3.0e-5
  max_steps: 1000
  weight_decay: 0.1
  warmup_steps: 100
  eval_interval: 200
  mixed_precision: "bf16"
`
      },
      {
        name: "dataset.py",
        language: "python",
        description: "تجهيز وتحميل الدفعات النصية بـ Tensors متوازية",
        content: `import torch

class TextDataset:
    """تحميل النصوص وتقطيعها إلى أزواج (x: المدخل، y: الكلمة التالية المستهدفة)"""
    def __init__(self, data_tensor, block_size):
        self.data = data_tensor
        self.block_size = block_size

    def get_batch(self, batch_size):
        ix = torch.randint(len(self.data) - self.block_size, (batch_size,))
        x = torch.stack([self.data[i:i+self.block_size] for i in ix])
        y = torch.stack([self.data[i+1:i+1+self.block_size] for i in ix])
        return x.cuda(), y.cuda()
`
      }
    ]
  },
  {
    id: "cuda-gemm-acceleration",
    title: "نواة حوسبة مصفوفات متوازية فائقة السرعة بلغة CUDA C++",
    category: "الحوسبة الفائقة وهندسة العتاد (High-Performance GPU Computing)",
    level: "Mastery / Research",
    description: "كتابة وبرمجة نواة كودا (CUDA Kernel) لضرب المصفوفات الكبيرة GEMM باستخدام الذاكرة المشتركة السريعة (Shared Memory Tiling) وتجنب تصادمات الذاكرة للوصول إلى أقصى أداء ممكن للشريحة.",
    defaultFile: "gemm_kernel.cu",
    runCommand: "make && ./gemm_benchmark",
    benchmarkStats: {
      tflops: "285.4 TFLOPS (FP16)",
      vramUsage: "1.2 GB",
      throughput: "93.8% of Peak Hardware Bandwidth",
      lossEnd: "Max Absolute Error: 1.1e-6 (Bit-accurate)"
    },
    simulationOutput: `=== [NVIDIA CUDA Toolkit v12.4 Compiler] ===
> nvcc -O3 -arch=sm_80 --use_fast_math -Xptxas -v gemm_kernel.cu -o gemm_benchmark
ptxas info : 0 bytes gmem, 4096 bytes smem, 32 registers per thread
> Launching Matrix Multiplication: A(4096x4096) @ B(4096x4096) -> C(4096x4096)
======================================================================
Benchmark Comparison:
1. Naive Global Memory Kernel:   12.8ms  (28.4 TFLOPS)
2. Tiled Shared Memory (16x16):   3.4ms  (107.1 TFLOPS)
3. Optimized 2D Register Block:   1.28ms (285.4 TFLOPS) [93.8% cuBLAS Speed]
======================================================================
Verification Check: All 16,777,216 tensor elements match cuBLAS reference!
>>> Kernel Benchmark PASSED with Zero Numerical Drift.`,
    files: [
      {
        name: "gemm_kernel.cu",
        language: "cuda",
        description: "كود النواة المتوازية بلغة CUDA مع التجزئة بالذاكرة المشتركة Shared Memory",
        content: `// JINNA 5 High-Performance Computing: Tiled Matrix Multiply in CUDA
#include <cuda_runtime.h>
#include <stdio.h>

#define TILE_SIZE 16

__global__ void matrixMultiplyShared(float *A, float *B, float *C, int N) {
    // تخصيص ذاكرة مشتركة داخل الشريحة (On-Chip L1 Shared Memory)
    __shared__ float tileA[TILE_SIZE][TILE_SIZE];
    __shared__ float tileB[TILE_SIZE][TILE_SIZE];

    int row = blockIdx.y * TILE_SIZE + threadIdx.y;
    int col = blockIdx.x * TILE_SIZE + threadIdx.x;
    float sum = 0.0f;

    // المرور عبر كتل المصفوفة
    for (int t = 0; t < (N + TILE_SIZE - 1) / TILE_SIZE; ++t) {
        // تحميل عنصر واحد لكل خيط إلى الذاكرة المشتركة السريعة
        if (row < N && (t * TILE_SIZE + threadIdx.x) < N)
            tileA[threadIdx.y][threadIdx.x] = A[row * N + t * TILE_SIZE + threadIdx.x];
        else
            tileA[threadIdx.y][threadIdx.x] = 0.0f;

        if (col < N && (t * TILE_SIZE + threadIdx.y) < N)
            tileB[threadIdx.y][threadIdx.x] = B[(t * TILE_SIZE + threadIdx.y) * N + col];
        else
            tileB[threadIdx.y][threadIdx.x] = 0.0f;

        // مزامنة جميع الخيوط لضمان اكتمال تحميل البيانات قبل بدء الحساب
        __syncthreads();

        // حساب الضرب التراكمي من الذاكرة المشتركة بدون الرجوع للـ VRAM البطيئة
        #pragma unroll
        for (int k = 0; k < TILE_SIZE; ++k) {
            sum += tileA[threadIdx.y][k] * tileB[k][threadIdx.x];
        }

        __syncthreads();
    }

    // كتابة النتيجة النهائية في الذاكرة العامة (Global Memory)
    if (row < N && col < N) {
        C[row * N + col] = sum;
    }
}
`
      },
      {
        name: "Makefile",
        language: "shell",
        description: "أوامر الترجمة والتحسين بواسطة NVCC",
        content: `NVCC = nvcc
CFLAGS = -O3 -arch=sm_80 --use_fast_math -lcublas

all: gemm_benchmark

gemm_benchmark: gemm_kernel.cu
\t$(NVCC) $(CFLAGS) gemm_kernel.cu -o gemm_benchmark

clean:
\trm -f gemm_benchmark
`
      }
    ]
  },
  {
    id: "lora-finetuning",
    title: "محرك الضبط الدقيق منخفض الرتبة (LoRA & QLoRA Fine-Tuning)",
    category: "تكييف النماذج الضخمة (Model Adaptation)",
    level: "Intermediate",
    description: "تطبيق هندسي عملي لتقنية LoRA لحقن مصفوفات خفيفة ذات رتبة منخفضة لتعديل النماذج الضخمة (مثل LLaMA أو Mistral) بتوفير 80% من استهلاك الذاكرة وتدريب النموذج على بطاقة رسومية واحدة.",
    defaultFile: "lora_layer.py",
    runCommand: "python train_lora.py",
    benchmarkStats: {
      tflops: "65.2 TFLOPS",
      vramUsage: "6.1 GB / 16 GB",
      throughput: "3,400 Tokens/sec",
      lossEnd: "0.89 (Arabic Instruction Tuning)"
    },
    simulationOutput: `=== [LoRA Parameter-Efficient Fine-Tuning Engine] ===
> Base Model: LLaMA-3-8B (Quantized 4-Bit NF4)
> Original Trainable Parameters: 8,030,000,000
> Injecting LoRA Adapters into (q_proj, v_proj):
  - Rank (r): 16 | Alpha: 32 | Dropout: 0.05
> New Trainable Parameters: 6,815,744 (Only 0.084% of total weights!)
======================================================================
[LoRA Epoch 1/3] Step 50/300  | Loss: 1.84 | VRAM: 6.1 GB
[LoRA Epoch 2/3] Step 150/300 | Loss: 1.12 | Peak VRAM: 6.3 GB
[LoRA Epoch 3/3] Step 300/300 | Loss: 0.89 | Adaptor Convergence Achieved!
======================================================================
>>> LoRA weights saved: ./adapter_model.bin (Size: 26.5 MB only!)
>>> Ready for zero-overhead inference merging.`,
    files: [
      {
        name: "lora_layer.py",
        language: "python",
        description: "برمجة طبقة LoRA الخطية يدوياً بمصفوفات التفكيك A و B",
        content: `import torch
import torch.nn as nn
import math

class LoRALinear(nn.Module):
    """
    طبقة LoRA: تجمد الوزن الأساسي W وتضيف مساراً توازياً رخيصاً:
    h = W*x + (B * A * x) * (alpha / r)
    حيث A تُهيأ بتوزيع غاوسي، و B تُهيأ بالأصفار لتكون النتيجة في البداية مطابقة للأصل.
    """
    def __init__(self, in_features, out_features, r=16, lora_alpha=32, lora_dropout=0.05):
        super().__init__()
        # الوزن الأساسي المجمد
        self.weight = nn.Parameter(torch.randn(out_features, in_features), requires_grad=False)
        self.r = r
        self.scaling = lora_alpha / r
        self.dropout = nn.Dropout(p=lora_dropout)

        if r > 0:
            self.lora_A = nn.Parameter(torch.zeros(r, in_features))
            self.lora_B = nn.Parameter(torch.zeros(out_features, r))
            # تهيئة كايمنغ لـ A والأصفار لـ B
            nn.init.kaiming_uniform_(self.lora_A, a=math.sqrt(5))
            nn.init.zeros_(self.lora_B)

    def forward(self, x):
        result = nn.functional.linear(x, self.weight)
        if self.r > 0:
            # مرور المدخل عبر المسار التكيفي منخفض الرتبة
            lora_out = (self.dropout(x) @ self.lora_A.T) @ self.lora_B.T
            result += lora_out * self.scaling
        return result
`
      }
    ]
  }
];
