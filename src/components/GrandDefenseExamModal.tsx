import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Award, ShieldCheck, Clock, CheckCircle2, AlertTriangle, 
  ChevronRight, ChevronLeft, HelpCircle, Check, RotateCcw,
  Sparkles, Lock, ArrowLeft, Brain, Cpu, BookOpen, AlertOctagon,
  EyeOff, ShieldAlert, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  generateRandomizedGrandDefenseExam, 
  ExamQuestionPoolItem,
  GRAND_EXAM_PASSING_PERCENTAGE, 
  GRAND_EXAM_TOTAL_QUESTIONS, 
  GRAND_EXAM_DURATION_MINUTES 
} from '../data/grandExamData';

interface GrandDefenseExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGrandExamResult: (score: number, total: number, percentage: number, passed: boolean) => void;
  studentName?: string;
  previousResult?: {
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    completedAt: string;
  };
  onOpenCertificateAfterPass: () => void;
}

export const GrandDefenseExamModal: React.FC<GrandDefenseExamModalProps> = ({
  isOpen,
  onClose,
  onSaveGrandExamResult,
  studentName = 'Engineer',
  previousResult,
  onOpenCertificateAfterPass
}) => {
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestionPoolItem[]>(() => generateRandomizedGrandDefenseExam());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(GRAND_EXAM_DURATION_MINUTES * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Anti-cheat Proctoring State
  const [cheatStrikes, setCheatStrikes] = useState(0);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const [isDisqualified, setIsDisqualified] = useState(false);

  const examActiveRef = useRef(false);
  examActiveRef.current = examStarted && !isSubmitted && !isDisqualified;

  // Generate fresh random exam when opened fresh
  useEffect(() => {
    if (isOpen) {
      if (!previousResult || !previousResult.passed) {
        setQuestions(generateRandomizedGrandDefenseExam());
      }
    }
  }, [isOpen]);

  // Anti-Cheat: Tab Switch & Window Blur Detection
  useEffect(() => {
    if (!isOpen) return;

    const handleVisibilityOrBlur = () => {
      if (!examActiveRef.current) return;

      setCheatStrikes(prev => {
        const newStrikes = prev + 1;
        if (newStrikes >= 3) {
          setIsDisqualified(true);
          setIsSubmitted(true);
          onSaveGrandExamResult(0, questions.length, 0, false);
          setSecurityWarning("🚫 تم إلغاء الامتحان ورسوب الطالب فوراً بسبب ارتكاب 3 مخالفات أمنية ومغادرة شاشة التقييم.");
        } else {
          setSecurityWarning(`⚠️ إنذار أمني رقم (${newStrikes} من 3)! تم رصد مغادرة شاشة الامتحان أو التبديل لنافذة خارجية. يُمنع منعاً باتاً البحث في جوجل أو سؤال الذكاء الاصطناعي أثناء الامتحان.`);
        }
        return newStrikes;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleVisibilityOrBlur();
      }
    };

    window.addEventListener('blur', handleVisibilityOrBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleVisibilityOrBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen, questions.length, onSaveGrandExamResult]);

  // Countdown timer when exam is started
  useEffect(() => {
    if (!examStarted || isSubmitted || isDisqualified) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isSubmitted, isDisqualified]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted || isDisqualified) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const calculateScore = () => {
    if (isDisqualified) return 0;
    let sc = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        sc++;
      }
    });
    return sc;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  const isPassed = !isDisqualified && percentage >= GRAND_EXAM_PASSING_PERCENTAGE;
  const minCorrectRequired = Math.ceil((questions.length * GRAND_EXAM_PASSING_PERCENTAGE) / 100);

  const handleSubmitExam = () => {
    if (isSubmitted) return;
    const finalScore = calculateScore();
    const finalPct = Math.round((finalScore / questions.length) * 100);
    const passed = !isDisqualified && finalPct >= GRAND_EXAM_PASSING_PERCENTAGE;

    setIsSubmitted(true);
    onSaveGrandExamResult(finalScore, questions.length, finalPct, passed);

    if (passed) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRestartExam = () => {
    // Generate an entirely fresh set of 25 questions with shuffled options from the bank
    const newQuestions = generateRandomizedGrandDefenseExam();
    setQuestions(newQuestions);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(GRAND_EXAM_DURATION_MINUTES * 60);
    setIsSubmitted(false);
    setIsDisqualified(false);
    setCheatStrikes(0);
    setSecurityWarning(null);
    setExamStarted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  // Group performance by engineering domain (diagnostic only, without revealing answers)
  const categoryStats: Record<string, { total: number; correct: number }> = {};
  questions.forEach((q, idx) => {
    const cat = q.category || "General AI Systems";
    if (!categoryStats[cat]) {
      categoryStats[cat] = { total: 0, correct: 0 };
    }
    categoryStats[cat].total++;
    if (selectedAnswers[idx] === q.correctIndex) {
      categoryStats[cat].correct++;
    }
  });

  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 overflow-y-auto select-none" 
      dir="rtl"
      onCopy={(e) => {
        e.preventDefault();
        setSecurityWarning("🚫 تم حظر النسخ تلقائياً حمايةً لمعايير النزاهة الأكاديمية ونظام الامتحان.");
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="bg-[#0A0D17] border-2 border-amber-500/40 rounded-2xl max-w-4xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden my-auto text-right">
        
        {/* Top Grand Defense Exam Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#121729] via-[#0E1322] to-[#121729] border-b border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  امتحان الدفاع الأكاديمي الكبير الشامل (Grand Defense Exam)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  85% شرط النجاح
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold hidden sm:inline">
                  🛡️ درع المراقبة الأكاديمية نشط
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                إشراف: المهندس يوسف الباز (Automation Ai Yousuf Albaz) • بنك أسئلة ديناميكي متبدل
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {examStarted && !isSubmitted && (
              <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold ${
                timeLeft < 300 
                  ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 animate-pulse' 
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            {examStarted && !isSubmitted && (
              <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1 ${
                cheatStrikes > 0 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-bounce' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>إنذارات: {cheatStrikes}/3</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Alert Toast */}
        {securityWarning && (
          <div className="bg-rose-950/90 border-b border-rose-500/60 p-3 px-5 text-xs text-rose-200 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 font-medium">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{securityWarning}</span>
            </div>
            <button
              onClick={() => setSecurityWarning(null)}
              className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-white font-bold text-[11px]"
            >
              أدركت ذلك
            </button>
          </div>
        )}

        {/* Exam Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[82vh] bg-[#070912]">
          
          {/* STATE 1: Introduction & Readiness Gate */}
          {!examStarted && (
            <div className="max-w-2xl mx-auto py-4 space-y-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-500/5 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-2xl shadow-amber-500/20">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  OFFICIAL SCIENTIFIC FELLOWSHIP DEFENSE
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  امتحان الدفاع الأكاديمي الشامل لشهادة الزمالة العليا
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  هذا الامتحان الأكاديمي الصارم مخصص لقياس الكفاءة الحقيقية في هندسة النظم العميقة (CUDA, ZeRO-3, FlashAttention, LLMs from Scratch). الامتحان محمي بدرع مراقبة مشدد ولا يمكن تكرار أسئلته.
                </p>
              </div>

              {/* Anti-Cheat & Rules Card */}
              <div className="p-4 rounded-2xl bg-[#0D1222] border border-amber-500/20 text-xs space-y-2.5 text-right">
                <div className="text-[11px] font-mono font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>بروتوكول النزاهة الأكاديمية الصارم (Anti-Cheating Shield):</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>بنك أسئلة ديناميكي متبدل:</strong> يتم توليد 25 سؤالاً عشوائياً مختلفاً في كل محاولة مع خلط اختيارات الإجابة تلقائياً، فلا تتكرر الأسئلة نفسها.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>حظر كشف الإجابات:</strong> لن تظهر الإجابات النموذجية بعد الانتهاء مطلقاً لمنع الغش أو الحفظ، ويُعرض فقط تقرير الكفاءات الهندسية.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>كشف مغادرة الشاشة (3 إنذارات):</strong> رصد فوري للتبديل بين النوافذ أو فتح برامج خارجية أو سؤال الذكاء الاصطناعي. بعد 3 مخالفات يُلغى الامتحان فوراً برسوب كامل.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>زمن الامتحان:</strong> 45 دقيقة كاملة (مؤقت متناقص يسلم تلقائياً عند النفاد).</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>درجة الاجتياز:</strong> 85% كحد أدنى (22 سؤالاً صحيحاً من أصل 25).</span>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setTimeLeft(GRAND_EXAM_DURATION_MINUTES * 60);
                    setSelectedAnswers({});
                    setCurrentIndex(0);
                    setExamStarted(true);
                    setIsSubmitted(false);
                    setIsDisqualified(false);
                    setCheatStrikes(0);
                    setSecurityWarning(null);
                  }}
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black font-black text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 mx-auto"
                >
                  <Brain className="w-5 h-5 text-black" />
                  <span>بدء الامتحان الرسمي بحزمة أسئلة مخصصة الآن 🚀</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: Active Exam Mode */}
          {examStarted && !isSubmitted && (
            <div className="space-y-5">
              {/* Question Navigation Matrix (1 to 25) */}
              <div className="p-3 rounded-xl bg-[#0E1220] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>لوحة الأسئلة ({answeredCount} من {questions.length} تم الإجابة):</span>
                  <span className="font-mono text-cyan-400">السؤال {currentIndex + 1} / {questions.length}</span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-25 gap-1.5">
                  {questions.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-8 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center ${
                          isCurrent
                            ? 'bg-amber-400 text-black ring-2 ring-amber-300'
                            : isAnswered
                              ? 'bg-cyan-900/70 text-cyan-200 border border-cyan-500/50'
                              : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Box */}
              {currentQ && (
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0F1424] border border-amber-500/20 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-[11px]">
                      المجال: {currentQ.category}
                    </span>
                    <span className="text-amber-400 font-mono">السؤال {currentIndex + 1} من {questions.length}</span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {currentQ.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-right transition-all flex items-start gap-3 leading-relaxed ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold shadow-md shadow-amber-950/50'
                              : 'bg-[#141A2D] border-white/[0.06] text-slate-300 hover:bg-[#1A223B] hover:border-amber-500/40'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5 ${
                            isSelected
                              ? 'bg-amber-400 text-black border-amber-400'
                              : 'border-white/20 text-slate-400'
                          }`}>
                            {['أ', 'ب', 'ج', 'د'][optIdx]}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Exam Navigation Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السؤال السابق</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex(prev => prev + 1)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-md"
                    >
                      <span>السؤال التالي</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>إنهاء وتسليم الامتحان ({answeredCount}/{questions.length})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: Final Diagnostic Screen (NO ANSWERS LEAKED) */}
          {isSubmitted && (
            <div className="space-y-6">
              {/* Verdict Header */}
              <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 ${
                isDisqualified
                  ? 'bg-gradient-to-b from-rose-950/60 via-[#180A12] to-[#0A0D17] border-rose-500'
                  : isPassed
                    ? 'bg-gradient-to-b from-emerald-950/50 via-[#0E1722] to-[#0A0D17] border-emerald-500/60'
                    : 'bg-gradient-to-b from-rose-950/40 via-[#180F17] to-[#0A0D17] border-rose-500/60'
              }`}>
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center border shadow-xl ${
                  isDisqualified
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                    : isPassed
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-400 text-rose-300'
                }`}>
                  {isDisqualified ? <AlertOctagon className="w-10 h-10" /> : isPassed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                </div>

                <div className="space-y-1.5">
                  <span className={`text-xs font-mono font-bold tracking-wider uppercase ${
                    isDisqualified ? 'text-rose-400' : isPassed ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isDisqualified 
                      ? "DISQUALIFIED: PROTOCOL BREACH DETECTED" 
                      : isPassed 
                        ? "OFFICIAL FELLOWSHIP ACCREDITATION: PASSED" 
                        : "DEFENSE RESULT: NOT MET (FAIL)"}
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isDisqualified
                      ? `تم إلغاء الامتحان ورسوبك بسبب تكرار محاولات الغش!`
                      : isPassed
                        ? `مبروك يا باشمهندس ${studentName}! لقد اجتزت امتحان الدفاع الكبير بمرتبة الشرف!`
                        : `لم تحقق النسبة المطلوبة (85%) للاعتماد يا ${studentName}`}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    {isDisqualified
                      ? `تم رصد 3 مخالفات لمغادرة شاشة التقييم ومحاولة البحث الخارجي. تم قفل النتيجة وإلغاء هذه المحاولة لضمان النزاهة الأكاديمية التامة.`
                      : isPassed
                        ? `حققت ${score} إجابة صحيحة من أصل ${questions.length} بنسبة (${percentage}%). لقد أثبتت تمكنك الفائق وقدرتك الهندسية الصلبة، والشهادة أصبحت الآن موثقة ومعتمدة رسمياً ومتاحة للتحميل والطباعة!`
                        : `حققت ${score} إجابة صحيحة من أصل ${questions.length} بنسبة (${percentage}%). الحد الأدنى المطلوب للاعتماد هو ${GRAND_EXAM_PASSING_PERCENTAGE}% (${minCorrectRequired} سؤالاً صحيحاً).`}
                  </p>
                </div>

                {/* Score Stats Bar */}
                <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-xs font-mono">
                  <div>
                    <span className="text-slate-400">درجتك النهائية: </span>
                    <span className={`font-bold text-base ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {percentage}% ({score}/{questions.length})
                    </span>
                  </div>
                  <span>•</span>
                  <div>
                    <span className="text-slate-400">الحد الأدنى للنجاح: </span>
                    <span className="text-amber-300 font-bold">{GRAND_EXAM_PASSING_PERCENTAGE}% ({minCorrectRequired}/{questions.length})</span>
                  </div>
                </div>

                {/* Confidentiality Notice */}
                <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 max-w-lg mx-auto text-[11px] text-amber-200/90 leading-relaxed flex items-center gap-2 text-right">
                  <EyeOff className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    <strong>إشعار النزاهة الأكاديمية:</strong> طبقاً لتعليمات المهندس يوسف الباز، يتم حجب الإجابات النموذجية والأسئلة المفصلة تماماً لمنع حفظها وتداولها، وتتغير حزمة الأسئلة عشوائياً عند كل محاولة لضمان الاستحقاق الحقيقي.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {isPassed ? (
                    <button
                      onClick={onOpenCertificateAfterPass}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
                    >
                      <Award className="w-4 h-4 text-black" />
                      <span>فتح وثيقة الشهادة والاعتماد الدولي المعتمد 🎓</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleRestartExam}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                    >
                      <RotateCcw className="w-4 h-4 text-black" />
                      <span>إعادة المحاولة بحزمة أسئلة جديدة كلياً 🔄</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Engineering Competency Diagnostics (NO ANSWER REVELATION) */}
              <div className="p-5 rounded-2xl bg-[#0C101D] border border-white/[0.08] space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>تقرير تشخيص الكفاءات والمحاور الهندسية:</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    تحليل الأداء دون كشف إجابات الأسئلة
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(categoryStats).map(([catName, data]) => {
                    const pct = Math.round((data.correct / data.total) * 100);
                    const isDomainPassed = pct >= 80;
                    return (
                      <div 
                        key={catName}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          isDomainPassed 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                            : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-100">{catName}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {isDomainPassed ? "✓ تم إتقان المحور بنجاح" : "⚠️ بحاجة لمراجعة وتعمق"}
                          </div>
                        </div>
                        <div className="text-left font-mono font-bold">
                          <span className={isDomainPassed ? 'text-emerald-400' : 'text-amber-400'}>
                            {data.correct} / {data.total}
                          </span>
                          <span className="text-[10px] text-slate-400 mr-1">({pct}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
