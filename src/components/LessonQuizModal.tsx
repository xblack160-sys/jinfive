import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, AlertCircle, ChevronLeft, 
  ChevronRight, Award, RotateCcw, ArrowLeft, EyeOff, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, QuizQuestion } from '../types';
import { getLessonQuiz } from '../data/lessonQuizzesData';

interface LessonQuizModalProps {
  isOpen: boolean;
  lesson: Lesson;
  chapterId: number;
  onClose: () => void;
  onPassLesson: (lessonId: string, score: number, total: number) => void;
  onGoToNextLesson?: () => void;
  hasNextLesson: boolean;
}

/**
 * Fisher-Yates array shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function prepareShuffledQuiz(rawQuestions: QuizQuestion[]): QuizQuestion[] {
  return rawQuestions.map(q => {
    const correctOption = q.options[q.correctIndex];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(correctOption);
    return {
      ...q,
      options: shuffledOptions,
      correctIndex: newCorrectIndex
    };
  });
}

export const LessonQuizModal: React.FC<LessonQuizModalProps> = ({
  isOpen,
  lesson,
  onClose,
  onPassLesson,
  onGoToNextLesson,
  hasNextLesson
}) => {
  const rawQuestions = getLessonQuiz(lesson.id);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => prepareShuffledQuiz(rawQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Re-shuffle when modal opens or lesson changes
  useEffect(() => {
    if (isOpen) {
      setQuestions(prepareShuffledQuiz(rawQuestions));
      setSelectedAnswers({});
      setCurrentIndex(0);
      setIsFinished(false);
    }
  }, [isOpen, lesson.id]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optIdx: number) => {
    if (isFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
  };

  const calculateScore = () => {
    let sc = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) sc++;
    });
    return sc;
  };

  const score = calculateScore();
  const passingScore = Math.ceil(questions.length * 0.67); // at least 2 out of 3
  const isPassed = score >= passingScore;

  const handleFinish = () => {
    setIsFinished(true);
    if (isPassed) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      onPassLesson(lesson.id, score, questions.length);
    }
  };

  const handleRestart = () => {
    // Generate fresh shuffled question order & options
    setQuestions(prepareShuffledQuiz(rawQuestions));
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none" dir="rtl">
      <div className="bg-[#0C101D] border border-cyan-500/40 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col my-auto text-right">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#111728] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-cyan-400 font-mono font-bold tracking-wider">
                اختبار التحقق من إتمام الدرس (تأكيد الاستيعاب)
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1">
                {lesson.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {!isFinished ? (
            <>
              {/* Progress and Question Counter */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-cyan-300">
                  السؤال {currentIndex + 1} من {questions.length}
                </span>
                <div className="flex items-center gap-1">
                  {questions.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentIndex
                          ? 'bg-cyan-400 ring-2 ring-cyan-400/40'
                          : selectedAnswers[i] !== undefined
                            ? 'bg-cyan-600'
                            : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question Box */}
              {currentQ && (
                <div className="space-y-4">
                  <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {currentQ.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentIndex] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full p-3 rounded-xl border text-xs sm:text-sm text-right transition-all flex items-start gap-2.5 leading-relaxed ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold shadow-md shadow-cyan-950/40'
                              : 'bg-[#141B30] border-white/[0.08] text-slate-200 hover:border-cyan-500/50 hover:bg-[#19223D]'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 font-mono text-[10px] mt-0.5 ${
                            isSelected
                              ? 'bg-cyan-400 text-black border-cyan-400 font-bold'
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

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    disabled={selectedAnswers[currentIndex] === undefined}
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-md"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled={selectedAnswers[currentIndex] === undefined}
                    onClick={handleFinish}
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black shadow-lg flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تسليم الاختبار وتأكيد الإتمام</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Result Screen (HIDDEN ANSWERS) */
            <div className="text-center space-y-4 py-4">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border shadow-xl ${
                isPassed 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                  : 'bg-rose-500/20 border-rose-500 text-rose-400'
              }`}>
                {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  {isPassed ? "تم تأكيد استيعاب الدرس واجتياز الاختبار بنجاح!" : "لم تحقق نسبة الاستيعاب المطلوبة"}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
                  {isPassed
                    ? `أحسنت يا هندسة! حققت درجة ${score} من ${questions.length}. تم توثيق إتمامك للدرس وفتح الدرس التالي تلقائياً.`
                    : `حققت ${score} من أصل ${questions.length}. شرط الانتقال للدرس القادم هو الإجابة على ${passingScore} أسئلة على الأقل بشكل صحيح.`}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#141B30] border border-white/[0.08] inline-flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">النتيجة:</span>
                <span className={`font-bold text-sm ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
                </span>
                <span>•</span>
                <span className="text-slate-400">شرط التأكيد:</span>
                <span className="text-amber-300 font-bold">{passingScore} من {questions.length}</span>
              </div>

              {/* Anti-cheat note */}
              {!isPassed && (
                <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed flex items-center gap-2 text-right">
                  <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    حمايةً للنزاهة، يتم حجب الإجابات الصحيحة وتغيير ترتيب الخيارات عشوائياً عند كل محاولة جديدة حتى تعتمد على الفهم وليس الحفظ.
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                {!isPassed ? (
                  <button
                    onClick={handleRestart}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة اختبار الدرس بترتيب عشوائي 🔄</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1D253F] hover:bg-[#252E4F] text-white text-xs font-semibold border border-white/[0.1]"
                    >
                      إغلاق والبقاء في الدرس
                    </button>
                    {hasNextLesson && onGoToNextLesson && (
                      <button
                        onClick={() => {
                          onClose();
                          onGoToNextLesson();
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 text-black text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>الانتقال للدرس التالي المفتوح 🔓</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
