/**
 * Comprehensive English curriculum translation mappings for all 11 Chapters and Lessons.
 * Provides high-level engineering titles, descriptions, and section titles for pure bilingual fluency.
 */

export interface TranslatedContent {
  title: string;
  subtitle: string;
  description?: string;
  badge?: string;
  duration?: string;
  readTime?: string;
}

export const curriculumTranslationsEn: {
  chapters: Record<number, {
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    prefix: string;
  }>;
  lessons: Record<string, {
    title: string;
    subtitle: string;
    duration: string;
    readTime: string;
    sections?: Record<string, string>; // sec-id -> translated title
  }>;
} = {
  chapters: {
    0: {
      title: "Foundations: Computer Science, Advanced Python & Systems Engineering for OpenAI & DeepMind Standards",
      subtitle: "From Absolute Zero to CPython Memory, Data Structures, Applied Math & Pure-Python Autograd Engine",
      description: "Rigorous foundational engineering curriculum designed to match elite AI research standards (OpenAI & Google DeepMind). Covering transistor logic, CPython memory & GIL internals, Big-O algorithm analysis, applied multivariable calculus and building an Autograd engine from scratch in pure Python.",
      badge: "OpenAI Foundation Standard",
      prefix: "Preparatory Course (From Scratch)"
    },
    1: {
      title: "Neural Networks Foundations & Mathematical Engine: From Perceptron to Backpropagation",
      subtitle: "Applied Linear Algebra, Vector Calculus, Loss Functions, Gradient Descent & Numerical Stability",
      description: "Deep dive into computational graphs, matrix calculus, automatic differentiation, activation dynamics, loss landscape optimization, and custom vectorized backpropagation implementation.",
      badge: "Stanford CS229 Standard",
      prefix: "Course 1"
    },
    2: {
      title: "Transformer Architecture & Self-Attention Mechanics: The Engine of Modern LLMs",
      subtitle: "Scaled Dot-Product Attention, Multi-Head Dynamics, RoPE, KV-Cache & Decoder-Only Architecture",
      description: "Exhaustive deconstruction of the Transformer paper (Vaswani et al.). Implementation of FlashAttention intuition, rotary positional embeddings (RoPE), grouped-query attention (GQA), and KV caching from first principles.",
      badge: "Architecture Core",
      prefix: "Course 2"
    },
    3: {
      title: "LLM Pretraining at Massive Scale: Data Pipelines, Tokenizers & Distributed Training",
      subtitle: "Byte-Pair Encoding (BPE), Data Curating, FSDP, DeepSpeed ZeRO-1/2/3, Megatron Tensor Parallelism",
      description: "Engineering massive scale distributed pretraining runs. Custom Byte-Pair Encoding implementation, WebText deduplication pipelines, 3D parallelism (Tensor, Pipeline, Data), and Megatron-LM orchestration.",
      badge: "Industrial Scale",
      prefix: "Course 3"
    },
    4: {
      title: "Post-Training & Alignment Engineering: SFT, RLHF, DPO & PPO Systems",
      subtitle: "Instruction Tuning, Reward Modeling, Direct Preference Optimization & Safety Guardrails",
      description: "Transforming base raw language models into helpful, steerable conversational reasoning systems. Hands-on Direct Preference Optimization (DPO), Proximal Policy Optimization (PPO), and constitutional AI frameworks.",
      badge: "State of the Art",
      prefix: "Course 4"
    },
    5: {
      title: "Low-Rank Adaptation & Parameter-Efficient Fine-Tuning (PEFT): LoRA, QLoRA & DoRA",
      subtitle: "Singular Value Decomposition, Adapter Architecture, 4-bit Quantized Optimization on Consumer GPUs",
      description: "Mastering parameter-efficient fine-tuning math. Mathematical derivation of low-rank matrix updates $W = W_0 + B A$, NF4 double-quantization mechanisms, and deploying fine-tuned models on modest hardware.",
      badge: "Hardware Efficient",
      prefix: "Course 5"
    },
    6: {
      title: "Quantization & High-Throughput Inference Serving: vLLM, TensorRT-LLM, AWQ & GGUF",
      subtitle: "Continuous Batching, PagedAttention, FP8/INT4 Quantization, Speculative Decoding & CUDA Kernels",
      description: "Production inference infrastructure engineering. PagedAttention memory management, continuous request batching in vLLM, speculative decoding with draft models, and kernel-level latency optimizations.",
      badge: "Production Serving",
      prefix: "Course 6"
    },
    7: {
      title: "Advanced Retrieval-Augmented Generation (RAG) & Vector Database Architecture",
      subtitle: "Hybrid Search, Semantic Chunking, Cross-Encoder Reranking, GraphRAG & Context Window Compression",
      description: "Industrial enterprise knowledge retrieval pipelines. Dense & sparse hybrid search, dense passage retrieval, Cross-Encoder reranking, multi-vector embeddings, GraphRAG, and self-reflective query routers.",
      badge: "Enterprise AI",
      prefix: "Course 7"
    },
    8: {
      title: "Autonomous AI Agents & Reasoning Systems: ReAct, Chain-of-Thought & Function Calling",
      subtitle: "Multi-Agent Protocols, Tree of Thoughts (ToT), Code Execution Sandboxes & Tool Use Architecture",
      description: "Engineering autonomous problem-solving agents. Dynamic tool dispatching, ReAct loop mechanics, structured JSON schema generation, iterative error self-correction, and long-horizon planning.",
      badge: "Autonomous Systems",
      prefix: "Course 8"
    },
    9: {
      title: "Multimodal AI Architectures: Vision-Language Models (VLMs) & Cross-Attention",
      subtitle: "CLIP Encoders, Patch Projections, Perceiver Resampler, LLaVA & Cross-Modal Latent Spaces",
      description: "Deep technical dive into vision-language foundation models. Vision Transformers (ViT), cross-modal attention projection layers, text-image grounding, and multimodal reasoning engines.",
      badge: "Next-Gen AI",
      prefix: "Course 9"
    },
    10: {
      title: "JINNA 5 Capstone Defense: End-to-End Frontier LLM Deployment & Accredited Board Review",
      subtitle: "Production System Architecture, Real-time Live Defense, Security Hardening & Certification",
      description: "Final comprehensive engineering defense. Complete architectural synthesis, adversarial penetration testing, production cluster stress tests, and automated credential issuance.",
      badge: "Graduation Capstone",
      prefix: "Course 10"
    }
  },
  lessons: {
    "0-1": {
      title: "Computer Architecture, Operating Systems & Memory Hierarchy from Absolute Scratch",
      subtitle: "Transistors, Binary Logic, Memory Hierarchy (SRAM, DRAM, SSD) & Address Management in OS",
      duration: "28 Accredited Study Hours",
      readTime: "25 min reading + 25 hrs lectures & labs",
      sections: {
        "sec-0-1-1": "How Do Computers Physically Compute? From Silicon Gates to Binary Representation",
        "sec-0-1-2": "Memory Hierarchy & Latency Gap: SRAM, DRAM, and Storage Architecture",
        "sec-0-1-3": "CPU Execution Cycle: Fetch, Decode, Execute & ALU Pipeline",
        "sec-0-1-4": "Virtual Memory, Page Tables & Why Cache Misses Cripple LLM Throughput"
      }
    },
    "0-2": {
      title: "CPython Internals, Memory Management, and the Global Interpreter Lock (GIL)",
      subtitle: "PyObject Anatomy, Reference Counting, Garbage Collection & Cython/C Extension Bridges",
      duration: "24 Accredited Study Hours",
      readTime: "22 min reading + 20 hrs lectures & labs"
    },
    "0-3": {
      title: "Advanced Data Structures & Big-O Computational Complexity for AI Engineers",
      subtitle: "Hash Maps, Dynamic Arrays, Priority Queues, Binary Trees & Memory Contiguity",
      duration: "22 Accredited Study Hours",
      readTime: "20 min reading + 18 hrs lectures & labs"
    },
    "0-4": {
      title: "Vectorized Linear Algebra & Multivariable Calculus: The Math That Powers Tensors",
      subtitle: "Matrix Multiplications, Eigenvalues, SVD, Gradient Vectors, Jacobians & Hessians",
      duration: "25 Accredited Study Hours",
      readTime: "25 min reading + 20 hrs lectures & labs"
    },
    "0-5": {
      title: "Building an Autograd Engine & Multi-Layer Perceptron (MLP) from Scratch in Pure Python",
      subtitle: "Computational DAG, Reverse-Mode Automatic Differentiation & Topological Sorting",
      duration: "30 Accredited Study Hours",
      readTime: "30 min reading + 25 hrs lectures & labs"
    },
    "1-1": {
      title: "The Mathematical Anatomy of Artificial Neurons & Forward Propagation",
      subtitle: "Dot Products, Non-Linear Activations (ReLU, GELU, SwiGLU) & Vectorization",
      duration: "20 Accredited Study Hours",
      readTime: "20 min reading + 18 hrs lectures & labs"
    },
    "1-2": {
      title: "Loss Surfaces, Matrix Calculus & Reverse Backpropagation Derivation",
      subtitle: "Chain Rule on Computational DAGs, Cross-Entropy Loss & Softmax Derivatives",
      duration: "22 Accredited Study Hours",
      readTime: "22 min reading + 18 hrs lectures & labs"
    },
    "1-3": {
      title: "First-Order Optimization Algorithms: SGD, Momentum, RMSprop & AdamW",
      subtitle: "Exponential Moving Averages, Adaptive Learning Rates, Weight Decay vs L2 Regularization",
      duration: "24 Accredited Study Hours",
      readTime: "22 min reading + 20 hrs lectures & labs"
    },
    "2-1": {
      title: "Scaled Dot-Product Attention: From Vector Alignment to Matrix Multiplication",
      subtitle: "Query, Key, Value Projections, Scaling Factor $\\sqrt{d_k}$ & Attention Maps",
      duration: "26 Accredited Study Hours",
      readTime: "25 min reading + 22 hrs lectures & labs"
    },
    "2-2": {
      title: "Multi-Head Attention (MHA), Multi-Query (MQA) & Grouped-Query Attention (GQA)",
      subtitle: "Parallel Subspace Projections, KV-Cache Memory Bandwidth & Modern LLM Efficiency",
      duration: "26 Accredited Study Hours",
      readTime: "25 min reading + 22 hrs lectures & labs"
    },
    "2-3": {
      title: "Positional Encodings: From Sinusoidal Waves to Rotary Position Embeddings (RoPE)",
      subtitle: "Relative Positional Angles, Complex Plane Rotations, Context Extension & YaRN",
      duration: "24 Accredited Study Hours",
      readTime: "22 min reading + 20 hrs lectures & labs"
    },
    "3-1": {
      title: "Subword Tokenization Engineering: Byte-Pair Encoding (BPE) & SentencePiece",
      subtitle: "Vocab Creation, Regex Splitting, Byte-Level BPE in tiktoken, Special Tokens & Merges",
      duration: "20 Accredited Study Hours",
      readTime: "20 min reading + 18 hrs lectures & labs"
    },
    "3-2": {
      title: "Industrial Distributed Training: FSDP, ZeRO Stages, and 3D Parallelism",
      subtitle: "ZeRO-1/2/3 Memory Partitioning, Tensor Parallelism, Pipeline Bubble Optimization",
      duration: "30 Accredited Study Hours",
      readTime: "28 min reading + 26 hrs lectures & labs"
    },
    "4-1": {
      title: "Supervised Fine-Tuning (SFT) & Instruction Dataset Engineering",
      subtitle: "Chat Templates, System Prompts, Multi-Turn Masking & Curriculum Datasets",
      duration: "22 Accredited Study Hours",
      readTime: "20 min reading + 20 hrs lectures & labs"
    },
    "4-2": {
      title: "Preference Alignment: From RLHF (PPO) to Direct Preference Optimization (DPO)",
      subtitle: "Bradley-Terry Preference Models, Implicit Reward Formulation & Reference Policy KL",
      duration: "26 Accredited Study Hours",
      readTime: "24 min reading + 22 hrs lectures & labs"
    },
    "5-1": {
      title: "Low-Rank Adaptation (LoRA) & Quantized LoRA (QLoRA) Architecture",
      subtitle: "Intrinsic Dimensionality Hypothesis, SVD Updates, 4-bit NormalFloat & Double Quantization",
      duration: "24 Accredited Study Hours",
      readTime: "22 min reading + 20 hrs lectures & labs"
    },
    "6-1": {
      title: "Production LLM Serving: PagedAttention, Continuous Batching & vLLM Architecture",
      subtitle: "Virtual Memory Allocation for KV-Cache, TTFT, Inter-Token Latency & Speculative Decoding",
      duration: "28 Accredited Study Hours",
      readTime: "25 min reading + 24 hrs lectures & labs"
    },
    "7-1": {
      title: "Enterprise Advanced RAG Systems: Hybrid Search, Reranking & GraphRAG",
      subtitle: "Dense Embeddings, Sparse BM25, Cross-Encoder Scoring, Knowledge Graphs & Self-Correction",
      duration: "25 Accredited Study Hours",
      readTime: "24 min reading + 22 hrs lectures & labs"
    },
    "8-1": {
      title: "Autonomous Agent Architectures: ReAct Loops, Plan-and-Solve & Structured Outputs",
      subtitle: "Tool Selection, Constrained Decoding, JSON Schema Enforcers & Long-Term Memory",
      duration: "26 Accredited Study Hours",
      readTime: "24 min reading + 22 hrs lectures & labs"
    },
    "9-1": {
      title: "Vision-Language Foundation Models: CLIP, Vision Transformers (ViT) & LLaVA",
      subtitle: "Image Patch Embeddings, Contrastive Pretraining, Cross-Modal Projections & VQA Pipelines",
      duration: "25 Accredited Study Hours",
      readTime: "24 min reading + 22 hrs lectures & labs"
    },
    "10-1": {
      title: "Grand Defense Capstone: Architecture Review, Cluster Deployment & Certification",
      subtitle: "Defense Examination, Rigorous System Auditing, VRAM Profiling & Verified Board Credential",
      duration: "30 Accredited Study Hours",
      readTime: "30 min reading + 28 hrs capstone defense"
    }
  }
};
