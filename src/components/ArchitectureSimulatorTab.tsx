import React, { useState } from 'react';
import { Cpu, Zap, Database, Server, CheckCircle2, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface ModelPreset {
  name: string;
  family: string;
  paramsBillions: number;
  layers: number;
  hiddenDim: number;
  heads: number;
  kvHeads: number;
  vocabSize: number;
  defaultContext: number;
}

const MODEL_PRESETS: ModelPreset[] = [
  {
    name: 'LLaMA-3 8B (Meta)',
    family: 'LLaMA',
    paramsBillions: 8.03,
    layers: 32,
    hiddenDim: 4096,
    heads: 32,
    kvHeads: 8, // Grouped-Query Attention (GQA)
    vocabSize: 128256,
    defaultContext: 8192
  },
  {
    name: 'Mistral 7B (Mistral AI)',
    family: 'Mistral',
    paramsBillions: 7.24,
    layers: 32,
    hiddenDim: 4096,
    heads: 32,
    kvHeads: 8,
    vocabSize: 32000,
    defaultContext: 8192
  },
  {
    name: 'GPT-2 Small (OpenAI)',
    family: 'GPT',
    paramsBillions: 0.124,
    layers: 12,
    hiddenDim: 768,
    heads: 12,
    kvHeads: 12,
    vocabSize: 50257,
    defaultContext: 1024
  },
  {
    name: 'DeepSeek-V3 (671B MoE)',
    family: 'DeepSeek',
    paramsBillions: 671,
    layers: 61,
    hiddenDim: 7168,
    heads: 128,
    kvHeads: 128,
    vocabSize: 102400,
    defaultContext: 32768
  }
];

interface GpuHardware {
  name: string;
  vramGb: number;
  bandwidthTbSec: number;
  fp16Tflops: number;
  type: 'Consumer' | 'DataCenter';
}

const GPU_OPTIONS: GpuHardware[] = [
  { name: 'NVIDIA H100 SXM5 (80GB HBM3)', vramGb: 80, bandwidthTbSec: 3.35, fp16Tflops: 989, type: 'DataCenter' },
  { name: 'NVIDIA A100 SXM4 (80GB HBM2e)', vramGb: 80, bandwidthTbSec: 2.04, fp16Tflops: 312, type: 'DataCenter' },
  { name: 'NVIDIA RTX 4090 (24GB GDDR6X)', vramGb: 24, bandwidthTbSec: 1.01, fp16Tflops: 165, type: 'Consumer' },
  { name: 'NVIDIA B200 NVL (192GB HBM3e)', vramGb: 192, bandwidthTbSec: 8.00, fp16Tflops: 2250, type: 'DataCenter' }
];

export const ArchitectureSimulatorTab: React.FC = () => {
  const { theme } = useTheme();
  const { language, isRtl } = useLanguage();
  const isLight = theme === 'light';

  const [selectedModel, setSelectedModel] = useState<ModelPreset>(MODEL_PRESETS[0]);
  const [contextLength, setContextLength] = useState<number>(4096);
  const [batchSize, setBatchSize] = useState<number>(1);
  const [precisionBytes, setPrecisionBytes] = useState<number>(2); // 2 bytes = BF16/FP16
  const [precisionLabel, setPrecisionLabel] = useState<string>('BF16 (16-bit)');
  const [selectedGpu, setSelectedGpu] = useState<GpuHardware>(GPU_OPTIONS[0]);

  // Calculations
  // 1. Model Weights VRAM: Params * bytes
  const weightsVramGb = selectedModel.paramsBillions * precisionBytes;

  // 2. KV Cache VRAM:
  // 2 * layers * kvHeads * (hiddenDim / heads) * contextLength * batchSize * precisionBytes
  const headDim = selectedModel.hiddenDim / selectedModel.heads;
  const kvCacheBytesPerToken = 2 * selectedModel.layers * selectedModel.kvHeads * headDim * precisionBytes;
  const totalKvCacheGb = (kvCacheBytesPerToken * contextLength * batchSize) / (1024 ** 3);

  // 3. Activation & Overhead (approx 15-20% for inference)
  const overheadGb = (weightsVramGb + totalKvCacheGb) * 0.12;

  // 4. Total Inference VRAM
  const totalInferenceVramGb = weightsVramGb + totalKvCacheGb + overheadGb;

  // 5. Training VRAM (AdamW 8 bytes/param + Gradients 2 bytes/param + Weights 2 bytes/param = 16 bytes/param + activations)
  const trainingVramGb = (selectedModel.paramsBillions * 16) + (totalKvCacheGb * 4) + 4;

  // 6. Memory Bandwidth Bound Throughput (Tokens/sec per user)
  // Time per token = Weights VRAM (bytes) / GPU Memory Bandwidth (bytes/sec)
  const memoryPerTokenBytes = selectedModel.paramsBillions * (10 ** 9) * precisionBytes;
  const secondsPerToken = memoryPerTokenBytes / (selectedGpu.bandwidthTbSec * (10 ** 12));
  const maxTokensPerSec = secondsPerToken > 0 ? Math.round(1 / secondsPerToken) : 0;

  // GPU Fit Evaluation
  const fitsInference = totalInferenceVramGb <= selectedGpu.vramGb;
  const requiredGpusInference = Math.ceil(totalInferenceVramGb / selectedGpu.vramGb);
  const requiredGpusTraining = Math.ceil(trainingVramGb / selectedGpu.vramGb);

  return (
    <div className="space-y-6 animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isLight 
          ? 'bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 border-blue-200 text-slate-800' 
          : 'bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border-cyan-500/20 text-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold text-base sm:text-lg flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span>
                  {language === 'en' 
                    ? 'Interactive Architecture & Silicon Memory Simulator' 
                    : 'مختبر المحاكاة التفاعلي لحسابات المعمارية والذاكرة الفائقة'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30">
                  Interactive Systems Sandbox
                </span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {language === 'en'
                  ? 'Real-time engineering modeling for KV Cache footprint, GPU VRAM allocation, and token generation throughput conforming to OpenAI & Meta research standards.'
                  : 'حساب مباشر في الوقت الفعلي لأحجام الـ KV Cache، استهلاك كروت الشاشة VRAM، وسرعة توليد الكلمات (Tokens/sec) وفق المعايير الهندسية لـ OpenAI و Meta.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Model Selector */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
        }`}>
          <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {language === 'en' ? 'Model & Architecture:' : 'النموذج والمعمارية:'}
          </label>
          <select
            value={selectedModel.name}
            onChange={(e) => {
              const found = MODEL_PRESETS.find(m => m.name === e.target.value);
              if (found) {
                setSelectedModel(found);
                setContextLength(found.defaultContext);
              }
            }}
            className={`w-full p-2.5 rounded-lg text-xs font-semibold border outline-none ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181822] border-white/[0.12] text-white'
            }`}
          >
            {MODEL_PRESETS.map(m => (
              <option key={m.name} value={m.name}>
                {m.name} ({m.paramsBillions >= 1 ? `${m.paramsBillions}B` : `${m.paramsBillions * 1000}M`})
              </option>
            ))}
          </select>
          <div className="text-[11px] font-mono text-cyan-500 pt-1">
            {language === 'en'
              ? `${selectedModel.layers} layers | ${selectedModel.heads} heads | ${selectedModel.kvHeads} KV`
              : `${selectedModel.layers} طبقات | ${selectedModel.heads} رؤوس انتباه | ${selectedModel.kvHeads} KV`}
          </div>
        </div>

        {/* Sequence Length */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
        }`}>
          <div className="flex justify-between items-center">
            <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {language === 'en' ? 'Context Length:' : 'طول السياق (Context Length):'}
            </label>
            <span className="text-xs font-mono font-bold text-indigo-400">{contextLength.toLocaleString()} tokens</span>
          </div>
          <input
            type="range"
            min="1024"
            max="32768"
            step="1024"
            value={contextLength}
            onChange={(e) => setContextLength(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1K</span>
            <span>8K</span>
            <span>16K</span>
            <span>32K</span>
          </div>
        </div>

        {/* Precision Selector */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
        }`}>
          <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {language === 'en' ? 'Quantization & Precision:' : 'دقة التكميم (Quantization / Precision):'}
          </label>
          <select
            value={precisionBytes}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPrecisionBytes(val);
              if (val === 4) setPrecisionLabel('FP32 (32-bit float)');
              else if (val === 2) setPrecisionLabel('BF16 / FP16 (16-bit)');
              else if (val === 1) setPrecisionLabel('FP8 (8-bit Hopper/Ada)');
              else if (val === 0.5) setPrecisionLabel('INT4 (4-bit GPTQ/AWQ)');
            }}
            className={`w-full p-2.5 rounded-lg text-xs font-semibold border outline-none ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181822] border-white/[0.12] text-white'
            }`}
          >
            <option value="2">{language === 'en' ? 'BF16 / FP16 (2 Bytes/Param) - Standard' : 'BF16 / FP16 (2 Bytes/Param) - القياسي'}</option>
            <option value="1">{language === 'en' ? 'FP8 (1 Byte/Param) - H100 Hopper Native' : 'FP8 (1 Byte/Param) - H100 Hopper Native'}</option>
            <option value="0.5">{language === 'en' ? 'INT4 / AWQ (0.5 Byte/Param) - Ultra-Compressed' : 'INT4 / AWQ (0.5 Byte/Param) - الاستدلال فائق الضغط'}</option>
            <option value="4">{language === 'en' ? 'FP32 (4 Bytes/Param) - Full Precision' : 'FP32 (4 Bytes/Param) - الدقة الكاملة'}</option>
          </select>
          <div className="text-[11px] font-mono text-purple-400 pt-1">
            {precisionLabel}
          </div>
        </div>

        {/* GPU Selector */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
        }`}>
          <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {language === 'en' ? 'GPU Hardware:' : 'عتاد كارت الشاشة (GPU Hardware):'}
          </label>
          <select
            value={selectedGpu.name}
            onChange={(e) => {
              const found = GPU_OPTIONS.find(g => g.name === e.target.value);
              if (found) setSelectedGpu(found);
            }}
            className={`w-full p-2.5 rounded-lg text-xs font-semibold border outline-none ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181822] border-white/[0.12] text-white'
            }`}
          >
            {GPU_OPTIONS.map(g => (
              <option key={g.name} value={g.name}>{g.name}</option>
            ))}
          </select>
          <div className="text-[11px] font-mono text-emerald-400 pt-1">
            {language === 'en'
              ? `Bandwidth: ${selectedGpu.bandwidthTbSec} TB/s | Capacity: ${selectedGpu.vramGb} GB`
              : `نطاق الذاكرة: ${selectedGpu.bandwidthTbSec} TB/s | السعة: ${selectedGpu.vramGb} GB`}
          </div>
        </div>
      </div>

      {/* Live System Metrics Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Weights VRAM */}
        <div className={`p-4 rounded-xl border space-y-1 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
        }`}>
          <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {language === 'en' ? 'Model Weights VRAM' : 'ذاكرة الأوزان (Model Weights)'}
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-blue-500">
            {weightsVramGb.toFixed(2)} GB
          </div>
          <p className="text-[10px] text-slate-400">
            = {selectedModel.paramsBillions}B × {precisionBytes} {language === 'en' ? 'Bytes' : 'بايت'}
          </p>
        </div>

        {/* Metric 2: KV Cache VRAM */}
        <div className={`p-4 rounded-xl border space-y-1 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
        }`}>
          <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {language === 'en' ? `KV Cache (${contextLength.toLocaleString()} tokens)` : `ذاكرة الـ KV Cache لسياق ${contextLength.toLocaleString()}`}
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400">
            {totalKvCacheGb.toFixed(2)} GB
          </div>
          <p className="text-[10px] text-slate-400">
            {(kvCacheBytesPerToken / 1024).toFixed(1)} {language === 'en' ? 'KB/token with GQA' : 'KB لكل توكن مع GQA'}
          </p>
        </div>

        {/* Metric 3: Total Inference VRAM */}
        <div className={`p-4 rounded-xl border space-y-1 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
        }`}>
          <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {language === 'en' ? 'Total Inference VRAM' : 'إجمالي VRAM المطلوب للاستدلال'}
          </span>
          <div className={`text-xl sm:text-2xl font-black font-mono ${
            fitsInference ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {totalInferenceVramGb.toFixed(1)} GB
          </div>
          <p className="text-[10px] text-slate-400">
            {language === 'en' ? 'Includes Activation Buffers & Overhead' : 'شامل كاش التنشيطات (Activation Buffer)'}
          </p>
        </div>

        {/* Metric 4: Max Throughput */}
        <div className={`p-4 rounded-xl border space-y-1 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
        }`}>
          <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {language === 'en' ? 'Theoretical Peak Throughput' : 'أقصى سرعة استدلال نظرية (Throughput)'}
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-purple-400 flex items-baseline gap-1">
            <span>{maxTokensPerSec}</span>
            <span className="text-xs font-sans">tokens/sec</span>
          </div>
          <p className="text-[10px] text-slate-400">
            {language === 'en'
              ? `Derived from Memory Bandwidth (${selectedGpu.bandwidthTbSec} TB/s)`
              : `بناءً على Memory Bandwidth (${selectedGpu.bandwidthTbSec} TB/s)`}
          </p>
        </div>
      </div>

      {/* GPU Allocation & Cluster Topology */}
      <div className={`p-5 rounded-2xl border space-y-4 ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
      }`}>
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Server className="w-4 h-4 text-cyan-400" />
            <span>
              {language === 'en'
                ? `Physical Memory Distribution on ${selectedGpu.name}`
                : `توزيع الذاكرة الفيزيائية على ${selectedGpu.name}`}
            </span>
          </h4>
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
            fitsInference 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            {fitsInference 
              ? (language === 'en'
                  ? `Fits on Single GPU (${(totalInferenceVramGb / selectedGpu.vramGb * 100).toFixed(0)}% utilization)`
                  : `يتسع في كارت واحد (${(totalInferenceVramGb / selectedGpu.vramGb * 100).toFixed(0)}% من الذاكرة)`)
              : (language === 'en'
                  ? `Requires Tensor Parallelism (TP=${requiredGpusInference})`
                  : `يتطلب تقسيم تفرعي Tensor Parallelism (TP=${requiredGpusInference})`)}
          </span>
        </div>

        {/* Memory Bar Visualizer */}
        <div className="space-y-1.5">
          <div className="h-6 w-full rounded-xl bg-slate-800/80 overflow-hidden flex p-0.5 border border-white/10">
            {/* Weights bar */}
            <div 
              style={{ width: `${Math.min(100, (weightsVramGb / selectedGpu.vramGb) * 100)}%` }}
              className="h-full bg-blue-500 rounded-l-lg transition-all relative group flex items-center justify-center text-[10px] font-mono text-white font-bold"
              title={`${language === 'en' ? 'Model Weights' : 'أوزان النموذج'}: ${weightsVramGb.toFixed(1)} GB`}
            >
              {(weightsVramGb / selectedGpu.vramGb * 100) > 15 && `${language === 'en' ? 'Weights' : 'أوزان'}: ${weightsVramGb.toFixed(0)}G`}
            </div>
            {/* KV Cache bar */}
            <div 
              style={{ width: `${Math.min(100, (totalKvCacheGb / selectedGpu.vramGb) * 100)}%` }}
              className="h-full bg-cyan-400 transition-all relative group flex items-center justify-center text-[10px] font-mono text-black font-bold"
              title={`KV Cache: ${totalKvCacheGb.toFixed(1)} GB`}
            >
              {(totalKvCacheGb / selectedGpu.vramGb * 100) > 15 && `KV: ${totalKvCacheGb.toFixed(1)}G`}
            </div>
            {/* Overhead bar */}
            <div 
              style={{ width: `${Math.min(100, (overheadGb / selectedGpu.vramGb) * 100)}%` }}
              className="h-full bg-purple-500 rounded-r-lg transition-all relative group flex items-center justify-center text-[10px] font-mono text-white font-bold"
              title={`Buffer: ${overheadGb.toFixed(1)} GB`}
            >
              {(overheadGb / selectedGpu.vramGb * 100) > 10 && 'Buffer'}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span>{language === 'en' ? 'Weights' : 'الأوزان'} ({weightsVramGb.toFixed(1)} GB)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
                <span>KV Cache ({totalKvCacheGb.toFixed(2)} GB)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                <span>{language === 'en' ? 'Activation Buffer' : 'Activation Buffer'} ({overheadGb.toFixed(1)} GB)</span>
              </span>
            </div>
            <span className="font-mono text-slate-300">
              {language === 'en'
                ? `Total Device Capacity: ${selectedGpu.vramGb} GB`
                : `السعة الإجمالية للكارت: ${selectedGpu.vramGb} GB`}
            </span>
          </div>
        </div>

        {/* Engineering Takeaways Box */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0a0f] border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Zap className="w-4 h-4" />
            <span>
              {language === 'en' 
                ? 'Production Engineering Takeaway:' 
                : 'الاستنتاج الهندسي للمنظومة (Production Engineering Rule):'}
            </span>
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {fitsInference 
              ? (language === 'en'
                  ? `${selectedModel.name} fits with complete efficiency on a single ${selectedGpu.name}, ensuring zero inter-GPU communication latency.`
                  : `يمكن تشغيل نموذج ${selectedModel.name} بكفاءة كاملة على كارت ${selectedGpu.name} واحد دون الحاجة لتقسيم الشبكة، مما يمنحك زمن استجابة صفري في نقل البيانات بين الكروت (Zero Inter-GPU Comm Latency).`)
              : (language === 'en'
                  ? `${selectedModel.name} exceeds single-card capacity (${totalInferenceVramGb.toFixed(1)}GB > ${selectedGpu.vramGb}GB). Implement Tensor Parallelism across ${requiredGpusInference} GPUs over NVLink high-speed interconnects (900 GB/s).`
                  : `نموذج ${selectedModel.name} يفيض عن سعة الكارت الواحد (${totalInferenceVramGb.toFixed(1)}GB > ${selectedGpu.vramGb}GB). الحل الهندسي هو تطبيق تقنية Tensor Parallelism لتقسيم مصفوفات الـ MLP و Attention عبر ${requiredGpusInference} كروت عبر جسور NVLink فائقة السرعة (900 GB/s).`)}
          </p>
        </div>
      </div>
    </div>
  );
};
