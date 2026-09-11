import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Play, 
  Copy, 
  RotateCcw, 
  FolderTree, 
  FileCode2, 
  Save, 
  Plus, 
  X, 
  Maximize2, 
  Minimize2, 
  Cpu, 
  Activity, 
  HardDrive, 
  Check, 
  Download, 
  Sparkles,
  ChevronRight,
  Code2
} from 'lucide-react';
import { ideProjects, IDEProject, ProjectFile } from '../data/ideProjectsData';
import { useTheme } from '../context/ThemeContext';

interface FullAiStudioIDEProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: string;
}

export const FullAiStudioIDE: React.FC<FullAiStudioIDEProps> = ({
  isOpen,
  onClose,
  initialProjectId
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Projects & Files state
  const [selectedProject, setSelectedProject] = useState<IDEProject>(() => {
    if (initialProjectId) {
      const found = ideProjects.find(p => p.id === initialProjectId);
      if (found) return found;
    }
    return ideProjects[0];
  });

  const [activeFileName, setActiveFileName] = useState<string>(selectedProject.defaultFile);
  const [openTabs, setOpenTabs] = useState<string[]>([selectedProject.defaultFile]);
  const [fileContents, setFileContents] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    selectedProject.files.forEach(f => {
      initial[f.name] = f.content;
    });
    return initial;
  });

  // Terminal & execution state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "=== [JINNA 5 Cloud AI Studio IDE - Enterprise Workstation] ===",
    "> Environment: Linux Ubuntu 22.04 LTS (x86_64) | CUDA 12.4 | PyTorch 2.4.0+cu124",
    "> GPU Accelerated Node: 1x NVIDIA A100-SXM4-80GB HBM2e (Available VRAM: 80GB)",
    "> اكتب 'help' لعرض الأوامر المتاحة أو اضغط 'تشغيل المشروع' لبدء التدريب الحقيقي."
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(false);

  if (!isOpen) return null;

  const currentFile = selectedProject.files.find(f => f.name === activeFileName) || selectedProject.files[0];
  const currentCode = fileContents[activeFileName] ?? currentFile.content;

  // Handle switching project
  const handleSwitchProject = (proj: IDEProject) => {
    setSelectedProject(proj);
    setActiveFileName(proj.defaultFile);
    setOpenTabs([proj.defaultFile]);
    const initial: Record<string, string> = {};
    proj.files.forEach(f => {
      initial[f.name] = f.content;
    });
    setFileContents(initial);
    setTerminalLogs(prev => [
      ...prev,
      `\n[Workspace Switched]: Loaded project "${proj.title}"`,
      `> Current Directory: /workspaces/${proj.id}`,
      `> Type '${proj.runCommand}' or click 'تشغيل المشروع' to execute.`
    ]);
  };

  const handleOpenFile = (fileName: string) => {
    setActiveFileName(fileName);
    if (!openTabs.includes(fileName)) {
      setOpenTabs(prev => [...prev, fileName]);
    }
  };

  const handleCloseTab = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabs.filter(t => t !== fileName);
    if (remaining.length === 0) return;
    setOpenTabs(remaining);
    if (activeFileName === fileName) {
      setActiveFileName(remaining[remaining.length - 1]);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setFileContents(prev => ({
      ...prev,
      [activeFileName]: newCode
    }));
  };

  const handleSave = () => {
    setSaveIndicator(true);
    setTerminalLogs(prev => [...prev, `[File Saved]: ${activeFileName} committed to local workspace.`]);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetFile = () => {
    setFileContents(prev => ({
      ...prev,
      [activeFileName]: currentFile.content
    }));
    setTerminalLogs(prev => [...prev, `[File Reset]: ${activeFileName} restored to template state.`]);
  };

  const handleRunProject = async () => {
    setIsRunning(true);
    setTerminalLogs(prev => [
      ...prev,
      `\n$ ${selectedProject.runCommand}`,
      `[GPU Launcher]: Allocating CUDA streams on Device 0...`,
      `[Compiler]: JIT Warmup & Tensor Allocation...`
    ]);

    // Simulate realistic execution delay with step-by-step terminal output
    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        selectedProject.simulationOutput
      ]);
      setIsRunning(false);
    }, 1200);
  };

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    const newLogs = [...terminalLogs, `$ ${cmd}`];

    if (cmd === 'clear') {
      setTerminalLogs([]);
      setCommandInput('');
      return;
    } else if (cmd === 'help') {
      newLogs.push(
        "Available Commands:",
        "  run            - تشغيل المشروع الرئيسي",
        "  ls             - عرض ملفات المجلد الحالي",
        "  cat <file>     - قراءة محتوى ملف معين",
        "  nvidia-smi     - عرض حالة معالج الرسوميات والذاكرة VRAM",
        "  clear          - مسح شاشة الطرفية",
        "  help           - عرض هذه المساعدة"
      );
    } else if (cmd === 'ls') {
      newLogs.push(selectedProject.files.map(f => f.name).join('    '));
    } else if (cmd.startsWith('cat ')) {
      const target = cmd.replace('cat ', '').trim();
      const content = fileContents[target];
      if (content) {
        newLogs.push(content);
      } else {
        newLogs.push(`cat: ${target}: No such file in project`);
      }
    } else if (cmd === 'nvidia-smi') {
      newLogs.push(
        "+-----------------------------------------------------------------------------+",
        "| NVIDIA-SMI 550.54.14              Driver Version: 550.54.14   CUDA: 12.4     |",
        "| GPU  Name        Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |",
        "| Fan  Temp  Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |",
        "|   0  NVIDIA A100-SXM4...   On   | 00000000:00:04.0 Off |                    0 |",
        "| N/A   42C    P0             84W / 400W |   4812MiB / 81920MiB |     98%      Default |",
        "+-----------------------------------------------------------------------------+"
      );
    } else if (cmd === 'run' || cmd === selectedProject.runCommand) {
      handleRunProject();
      setCommandInput('');
      return;
    } else {
      newLogs.push(`bash: ${cmd}: command executed in simulated environment.`);
    }

    setTerminalLogs(newLogs);
    setCommandInput('');
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 bg-black/85 backdrop-blur-md ${
      isFullscreen ? 'p-0' : ''
    }`} dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className={`w-full flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isFullscreen ? 'h-full rounded-none' : 'h-[95vh] max-w-7xl'
        } ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#090D16] border-slate-800 text-slate-100'}`}
      >
        {/* Top Workstation Header Bar */}
        <div className={`px-4 py-3 border-b flex items-center justify-between gap-3 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0E1524] border-slate-800'
        }`}>
          {/* Workstation Title & Project Picker */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base">JINNA 5 Cloud AI Studio IDE</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  A100 GPU Cluster
                </span>
              </div>
              <p className="text-[11px] text-slate-400">لوحة عمل هندسية متكاملة لتطبيق وتدريب المشاريع الضخمة</p>
            </div>
          </div>

          {/* Project Switcher Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedProject.id}
              onChange={(e) => {
                const proj = ideProjects.find(p => p.id === e.target.value);
                if (proj) handleSwitchProject(proj);
              }}
              className={`text-xs rounded-xl px-3 py-1.5 border font-semibold focus:outline-none transition-all ${
                isLight 
                  ? 'bg-white border-slate-300 text-slate-800' 
                  : 'bg-[#152033] border-slate-700 text-slate-200'
              }`}
            >
              {ideProjects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>

            {/* Run Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRunProject}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'جاري التدريب...' : 'تشغيل المشروع (Run)'}</span>
            </motion.button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className={`p-1.5 rounded-xl border hidden sm:block ${
                isLight ? 'border-slate-300 hover:bg-slate-200 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-300'
              }`}
              title="ملء الشاشة"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-all ${
                isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workstation Body: File Tree + Editor + Terminal */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Tree Explorer */}
          <div className={`w-full md:w-64 border-b md:border-b-0 md:border-l flex flex-col flex-shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0B101D] border-slate-800'
          }`}>
            <div className="p-3 border-b border-slate-700/40 flex items-center justify-between text-xs text-slate-400 font-bold">
              <span className="flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span>مستكشف الملفات</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">{selectedProject.level}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="px-2 py-1 text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-cyan-400" />
                <span>/workspaces/{selectedProject.id}</span>
              </div>

              {selectedProject.files.map(file => {
                const isActive = activeFileName === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => handleOpenFile(file.name)}
                    className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between gap-2 transition-all ${
                      isActive
                        ? isLight
                          ? 'bg-blue-100 text-blue-900 font-bold'
                          : 'bg-blue-600/20 text-cyan-300 border border-blue-500/40 font-bold'
                        : isLight
                          ? 'hover:bg-slate-200 text-slate-700'
                          : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate" dir="ltr">
                      <FileCode2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 opacity-70 uppercase">{file.language}</span>
                  </button>
                );
              })}
            </div>

            {/* Hardware Benchmark Stats Pill */}
            <div className={`p-3 border-t text-[11px] space-y-1.5 ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0E1524] border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>مقاييس الأداء التقديرية</span>
                </span>
              </div>
              <div className="text-[10px] font-mono space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>TFLOPS:</span>
                  <span className="text-cyan-400">{selectedProject.benchmarkStats.tflops}</span>
                </div>
                <div className="flex justify-between">
                  <span>VRAM:</span>
                  <span className="text-amber-400">{selectedProject.benchmarkStats.vramUsage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Throughput:</span>
                  <span className="text-emerald-400">{selectedProject.benchmarkStats.throughput}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Work Area: Code Editor (Top) & Terminal (Bottom) */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Editor Tab Bar */}
            <div className={`px-2 pt-2 border-b flex items-center justify-between gap-2 overflow-x-auto ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0B101D] border-slate-800'
            }`}>
              <div className="flex items-center gap-1 overflow-x-auto">
                {openTabs.map(tabName => {
                  const isActive = activeFileName === tabName;
                  return (
                    <div
                      key={tabName}
                      onClick={() => setActiveFileName(tabName)}
                      className={`px-3 py-1.5 rounded-t-lg text-xs font-mono flex items-center gap-2 cursor-pointer border-t border-x transition-all ${
                        isActive
                          ? isLight
                            ? 'bg-white border-slate-300 text-slate-900 font-bold'
                            : 'bg-[#121929] border-slate-700 text-cyan-300 font-bold'
                          : isLight
                            ? 'border-transparent text-slate-600 hover:bg-slate-200'
                            : 'border-transparent text-slate-400 hover:bg-slate-800'
                      }`}
                      dir="ltr"
                    >
                      <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{tabName}</span>
                      {openTabs.length > 1 && (
                        <button
                          onClick={(e) => handleCloseTab(tabName, e)}
                          className="hover:text-red-400 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Editor Actions */}
              <div className="flex items-center gap-1.5 pb-1">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    isLight 
                      ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                      : 'bg-[#152033] hover:bg-[#1B2942] border-slate-700 text-slate-300'
                  }`}
                  title="حفظ التعديلات"
                >
                  {saveIndicator ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">حفظ</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    isLight 
                      ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                      : 'bg-[#152033] hover:bg-[#1B2942] border-slate-700 text-slate-300'
                  }`}
                  title="نسخ الكود"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">نسخ</span>
                </button>

                <button
                  onClick={handleResetFile}
                  className={`p-1 rounded-lg border transition-all ${
                    isLight 
                      ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                      : 'bg-[#152033] hover:bg-[#1B2942] border-slate-700 text-slate-300'
                  }`}
                  title="استعادة الكود الأصلي"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Textarea with Line Numbers */}
            <div className={`flex-1 relative flex overflow-hidden font-mono text-xs ${
              isLight ? 'bg-white' : 'bg-[#090D16]'
            }`} dir="ltr">
              <textarea
                value={currentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck={false}
                className={`w-full h-full p-4 resize-none focus:outline-none font-mono text-xs leading-relaxed ${
                  isLight 
                    ? 'bg-white text-slate-900 selection:bg-blue-100' 
                    : 'bg-[#090D16] text-emerald-300 selection:bg-cyan-900/60'
                }`}
              />
            </div>

            {/* Bottom Interactive Terminal */}
            <div className={`h-48 sm:h-56 border-t flex flex-col font-mono text-xs ${
              isLight ? 'bg-slate-900 text-slate-100 border-slate-700' : 'bg-[#070A12] text-slate-200 border-slate-800'
            }`} dir="ltr">
              <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 bg-black/40">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold">Execution Terminal & GPU Cluster Log</span>
                </div>
                <button
                  onClick={() => setTerminalLogs([])}
                  className="hover:text-slate-200 text-[10px]"
                >
                  Clear Console
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {terminalLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`whitespace-pre-wrap leading-relaxed ${
                      log.startsWith('===') || log.startsWith('==') 
                        ? 'text-cyan-400 font-bold' 
                        : log.startsWith('>') || log.startsWith('$')
                          ? 'text-amber-300 font-semibold'
                          : log.includes('Loss') || log.includes('Epoch')
                            ? 'text-emerald-300'
                            : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>

              {/* Terminal Command Input */}
              <form onSubmit={handleExecuteCommand} className="p-2 border-t border-slate-800 flex items-center gap-2 bg-black/30">
                <span className="text-cyan-400 font-bold">$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="type command (e.g. 'run', 'nvidia-smi', 'ls', 'help')..."
                  className="flex-1 bg-transparent text-xs text-slate-100 focus:outline-none font-mono placeholder-slate-600"
                />
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
