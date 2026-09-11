import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Trophy, RotateCcw, ChevronRight, ChevronLeft, HelpCircle, EyeOff, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter, QuizQuestion } from '../types';

interface QuizModalProps {
  chapter: Chapter;
  onClose: () => void;
  onSaveScore: (score: number, total: number) => void;
  initialPassed?: boolean;
}

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

export const QuizModal: React.FC<QuizModalProps> = ({
  chapter,
  onClose,
  onSaveScore,
  initialPassed = false
}) => {
  const rawQuestions = chapter.quiz || [];
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => prepareShuffledQuiz(rawQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setQuestions(prepareShuffledQuiz(rawQuestions));
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  }, [chapter.id]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isFinished) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleFinish = () => {
    const finalScore = calculateScore();
    setIsFinished(true);
    onSaveScore(finalScore, questions.length);

    if (finalScore >= Math.ceil(questions.length * 0.7)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setQuestions(prepareShuffledQuiz(rawQuestions));
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  if (!currentQ && !isFinished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center max-w-md w-full">
          <p className="text-slate-300">لا يوجد اختبار مسجل لهذا الفصل حالياً.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-sm text-white">إغلاق</button>
        </div>
      </div>
    );
  }

  const score = calculateScore();
  const passingScore = Math.ceil(questions.length * 0.7);
  const passed = score >= passingScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 select-none" dir="rtl">
      <div className="bg-[#0E0E14] border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#121218] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                اختبار تقييم المفاهيم: {chapter.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isFinished ? 'النتيجة النهائية' : `السؤال ${currentIndex + 1} من ${questions.length}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {isFinished ? (
            <div className="text-center py-6 space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border shadow-xl ${
                passed
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                  : 'bg-rose-500/20 border-rose-500/60 text-rose-400'
              }`}>
                {passed ? <Trophy className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-100">
                  {passed ? 'أحسنت! تم اجتياز تقييم الفصل بنجاح' : 'لم يتم اجتياز الاختبار بنجاح'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  {passed
                    ? `حققت ${score} من أصل ${questions.length} أسئلة صحيحة. تم اعتماد فهمك لهذا الفصل الهندسي!`
                    : `حققت ${score} من أصل ${questions.length}. الحد الأدنى المطلوب للاجتياز هو ${passingScore} أسئلة. راجع محتوى الفصل وأعد المحاولة.`}
                </p>
              </div>

              <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-[#14141E] border border-white/[0.08] text-xs font-mono">
                <div>
                  <span className="text-slate-400">النتيجة: </span>
                  <span className={`font-bold ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
                  </span>
                </div>
                <span>•</span>
                <div>
                  <span className="text-slate-400">المطلوب للنجاح: </span>
                  <span className="text-amber-300 font-bold">{passingScore} / {questions.length}</span>
                </div>
              </div>

              {/* Anti-cheat note */}
              {!passed && (
                <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 max-w-md mx-auto text-[11px] text-amber-200/90 leading-relaxed flex items-center gap-2 text-right">
                  <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    يتم حجب الإجابات الصحيحة وتغيير ترتيب الخيارات تلقائياً عند كل محاولة جديدة لضمان الفهم الهندسي الحقيقي.
                  </span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-950"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار بترتيب جديد 🔄</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-[#181822] hover:bg-[#20202F] text-slate-300 text-xs font-medium border border-white/[0.06]"
                >
                  إغلاق
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/[0.06]">
                <span className="font-mono text-cyan-400 font-semibold">
                  السؤال {currentIndex + 1} من {questions.length}
                </span>
                <span className="text-slate-500 text-[11px]">
                  اختر الإجابة الصحيحة
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentIndex] === idx;

                  let buttonStyle = 'bg-[#121218] border-white/[0.08] hover:border-cyan-500/40 text-slate-200';
                  if (isSelected) {
                    buttonStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-right p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-md border flex items-center justify-center font-mono text-xs ${
                          isSelected ? 'bg-cyan-500 text-black border-cyan-500 font-bold' : 'bg-[#1B1B26] border-white/[0.08] text-slate-300'
                        }`}>
                          {['أ', 'ب', 'ج', 'د'][idx]}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isFinished && (
          <div className="px-5 py-3 bg-[#121218] border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#20202F] disabled:opacity-40 text-slate-300 text-xs transition-colors border border-white/[0.06]"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                disabled={selectedAnswers[currentIndex] === undefined}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 disabled:opacity-40 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-950 border border-cyan-400/30"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={selectedAnswers[currentIndex] === undefined}
                className="flex items-center gap-1 px-5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md border border-emerald-400/30 transition-all"
              >
                <span>إنهاء وتسليم الاختبار</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
