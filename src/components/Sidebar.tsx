import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Binary, GitBranch, Layers, Database, Network, 
  Sliders, Zap, Bot, Award, CheckCircle2, Circle, ChevronDown, ChevronLeft, 
  HelpCircle, Clock, Monitor, Lock
} from 'lucide-react';
import { Chapter, UserProgress } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  chapters: Chapter[];
  currentChapterId: number;
  currentLessonId: string;
  progress: UserProgress;
  onSelectLesson: (chapterId: number, lessonId: string) => void;
  onOpenQuiz: (chapterId: number) => void;
  searchQuery?: string;
  onOpenAdminPortal?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="w-4 h-4 text-emerald-400" />,
  Cpu: <Cpu className="w-4 h-4 text-cyan-400" />,
  Binary: <Binary className="w-4 h-4 text-blue-400" />,
  GitBranch: <GitBranch className="w-4 h-4 text-emerald-400" />,
  Layers: <Layers className="w-4 h-4 text-purple-400" />,
  Database: <Database className="w-4 h-4 text-amber-400" />,
  Network: <Network className="w-4 h-4 text-rose-400" />,
  Sliders: <Sliders className="w-4 h-4 text-indigo-400" />,
  Zap: <Zap className="w-4 h-4 text-yellow-400" />,
  Bot: <Bot className="w-4 h-4 text-teal-400" />,
  Award: <Award className="w-4 h-4 text-orange-400" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  chapters,
  currentChapterId,
  currentLessonId,
  progress,
  onSelectLesson,
  onOpenQuiz,
  searchQuery = '',
  onOpenAdminPortal
}) => {
  const { theme } = useTheme();
  const { t, language, isRtl, getChapterContent, getLessonContent } = useLanguage();
  const isLight = theme === 'light';

  const [expandedChapters, setExpandedChapters] = React.useState<Record<number, boolean>>({
    [currentChapterId]: true
  });
  const [lockAlert, setLockAlert] = React.useState<string | null>(null);

  // Flattened lesson list to track linear prerequisite progression
  const allLessonsFlat = React.useMemo(() => {
    return chapters.flatMap(c => c.lessons.map(l => ({ lessonId: l.id, chapterId: c.id })));
  }, [chapters]);

  const checkLessonLock = (lessonId: string, chapterId: number): { locked: boolean; reason?: string } => {
    if (progress.bypassLocking) return { locked: false };
    const index = allLessonsFlat.findIndex(x => x.lessonId === lessonId);
    if (index <= 0) return { locked: false }; // First lesson is always unlocked

    const prev = allLessonsFlat[index - 1];
    // Previous lesson must have quiz passed or be marked completed
    const prevQuizPassed = progress.completedLessonQuizzes?.[prev.lessonId]?.passed;
    const prevCompleted = progress.completedLessons.includes(prev.lessonId);
    
    if (!prevQuizPassed && !prevCompleted) {
      return { 
        locked: true, 
        reason: language === 'en'
          ? 'Locked 🔒: Complete preceding lesson and pass comprehension check first.'
          : 'هذا الدرس مقفل 🔒: يتطلب دراسة الدرس السابق واجتياز اختباره التأكيدي أولاً.' 
      };
    }

    // If moving across chapters, previous chapter's comprehensive quiz must also be passed
    if (prev.chapterId !== chapterId) {
      const prevChapterQuizPassed = progress.completedQuizzes?.[prev.chapterId]?.passed;
      if (!prevChapterQuizPassed) {
        return { 
          locked: true, 
          reason: language === 'en'
            ? 'Course Locked 🔒: Pass the comprehensive exam of preceding course first.'
            : 'هذا المقرر مقفل 🔒: يتطلب اجتياز الامتحان الشامل للمقرر السابق أولاً.' 
        };
      }
    }

    return { locked: false };
  };

  // Auto-expand active chapter
  React.useEffect(() => {
    setExpandedChapters(prev => ({ ...prev, [currentChapterId]: true }));
  }, [currentChapterId]);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const filteredChapters = chapters.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const chapterTrans = getChapterContent(c);
    const matchTitle = (c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)) ||
                       (chapterTrans.title.toLowerCase().includes(q) || chapterTrans.subtitle.toLowerCase().includes(q));
    const matchLesson = c.lessons.some(l => {
      const lessonTrans = getLessonContent(l);
      return l.title.toLowerCase().includes(q) || 
             l.subtitle.toLowerCase().includes(q) ||
             lessonTrans.title.toLowerCase().includes(q) ||
             lessonTrans.subtitle.toLowerCase().includes(q) ||
             l.sections.some(s => s.content.toLowerCase().includes(q));
    });
    return matchTitle || matchLesson;
  });

  return (
    <aside 
      className={`w-full lg:w-84 xl:w-96 shrink-0 border-b lg:border-b-0 ${isRtl ? 'lg:border-l' : 'lg:border-r'} p-3 lg:p-4 overflow-y-auto max-h-[88vh] select-none transition-colors`}
      style={{
        backgroundColor: isLight ? '#ffffff' : '#0B1120',
        borderColor: isLight ? '#e2e8f0' : '#1e293b',
        color: isLight ? '#0f172a' : '#f8fafc'
      }}
    >
      <div className="flex items-center justify-between mb-3 px-2">
        <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <span>{t('sidebar.curriculum_title')}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
            isLight ? 'bg-red-50 text-[#EF4444] border-red-200' : 'bg-[#131D33] text-[#EF4444] border-slate-700'
          }`}>
            {chapters.length} {t('sidebar.courses_count')}
          </span>
        </h2>
        <span className={`text-[11px] font-medium font-mono ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
          Zero → Ultimate Pro
        </span>
      </div>

      {/* Lock Alert Notification */}
      <AnimatePresence>
        {lockAlert && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="mb-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2 shadow-xs"
          >
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="font-bold block mb-0.5">{language === 'en' ? 'Academic Prerequisite Notice:' : 'تنبيه التقدم الأكاديمي:'}</span>
              <span>{lockAlert}</span>
            </div>
            <button
              onClick={() => setLockAlert(null)}
              className="text-amber-400 hover:text-white p-0.5"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {filteredChapters.map((chapter) => {
          const isExpanded = expandedChapters[chapter.id] ?? false;
          const isActive = chapter.id === currentChapterId;
          const completedInChapter = chapter.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
          const isChapterComplete = completedInChapter === chapter.lessons.length && chapter.lessons.length > 0;
          const quizResult = progress.completedQuizzes[chapter.id];
          const chapterContent = getChapterContent(chapter);

          return (
            <div
              key={chapter.id}
              className={`rounded-xl border transition-all duration-200 ${
                isActive
                  ? isLight
                    ? 'border-[#EF4444] bg-red-50/20 shadow-xs'
                    : 'border-[#EF4444]/60 bg-[#131D33] shadow-md'
                  : isLight
                    ? 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
                    : 'border-slate-800 bg-[#0E1526]/80 hover:border-slate-700 hover:bg-[#131D33]'
              }`}
            >
              {/* Chapter Header Card */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleChapter(chapter.id);
                }}
                className={`w-full ${isRtl ? 'text-right' : 'text-left'} p-3 flex items-start justify-between gap-2.5 focus:outline-none cursor-pointer`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg border shrink-0 mt-0.5 shadow-xs ${
                    isLight 
                      ? 'bg-white border-slate-200' 
                      : 'bg-[#1A2644] border-slate-700'
                  }`}>
                    {iconMap[chapter.iconName] || <Cpu className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[11px] font-mono font-semibold ${isLight ? 'text-[#EF4444]' : 'text-[#EF4444]'}`}>
                        {chapter.id === 0 
                          ? (language === 'en' ? 'Foundational Course (Zero)' : 'المقرر التمهيدي (من الصفر)')
                          : (language === 'en' ? `Course ${chapter.id}` : `المقرر ${chapter.id}`)
                        }
                      </span>
                      {isChapterComplete && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] border flex items-center gap-1 font-mono ${
                          isLight
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-emerald-950/70 text-emerald-400 border-emerald-700/50'
                        }`}>
                          <CheckCircle2 className="w-2.5 h-2.5" /> {t('sidebar.completed_badge')}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xs sm:text-sm font-bold mt-0.5 leading-snug ${
                      isLight ? 'text-slate-900' : 'text-slate-100'
                    }`}>
                      {chapterContent.title}
                    </h3>
                    <div className={`flex items-center gap-2 mt-1 text-[11px] ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        {chapter.estimatedHours} {t('sidebar.hours_abbrev')}
                      </span>
                      <span>•</span>
                      <span>{completedInChapter}/{chapter.lessons.length} {t('sidebar.lessons_count')}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-1 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : (isRtl ? 90 : -90) }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
              </button>

              {/* Collapsible Lessons List with Smooth Animation */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className={`overflow-hidden border-t rounded-b-xl ${
                      isLight 
                        ? 'border-slate-200 bg-white' 
                        : 'border-slate-800 bg-[#090E1A]'
                    }`}
                  >
                    <div className="p-2 space-y-1">
                      {chapter.lessons.map((lesson) => {
                        const isLessonActive = lesson.id === currentLessonId;
                        const isCompleted = progress.completedLessons.includes(lesson.id);
                        const lockStatus = checkLessonLock(lesson.id, chapter.id);
                        const isLocked = lockStatus.locked;
                        const lessonContent = getLessonContent(lesson);

                        return (
                          <motion.button
                            whileHover={isLocked ? {} : { x: isRtl ? -3 : 3 }}
                            whileTap={isLocked ? {} : { scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            type="button"
                            key={lesson.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isLocked) {
                                setLockAlert(lockStatus.reason || (language === 'en' ? 'Lesson locked' : 'هذا الدرس مقفل'));
                                setTimeout(() => setLockAlert(null), 4000);
                              } else {
                                onSelectLesson(chapter.id, lesson.id);
                              }
                            }}
                            className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                              isLessonActive
                                ? isLight
                                  ? 'bg-[#EF4444] text-white font-semibold shadow-xs'
                                  : 'bg-[#EF4444]/20 text-white border border-[#EF4444]/50 font-medium shadow-inner'
                                : isLocked
                                  ? isLight
                                    ? 'text-slate-400 bg-slate-100/60 hover:bg-slate-100 cursor-not-allowed opacity-75'
                                    : 'text-slate-500 bg-white/[0.02] hover:bg-white/[0.04] cursor-not-allowed opacity-75'
                                  : isLight
                                    ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              {isLocked ? (
                                <Lock className="w-3.5 h-3.5 shrink-0 text-amber-500/80" />
                              ) : isCompleted ? (
                                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isLessonActive && isLight ? 'text-white' : 'text-emerald-500'}`} />
                              ) : (
                                <Circle className={`w-3.5 h-3.5 shrink-0 ${isLessonActive && isLight ? 'text-white/70' : 'text-slate-400'}`} />
                              )}
                              <span className="truncate">{lessonContent.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isLocked && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  {language === 'en' ? 'Locked' : 'مقفل'}
                                </span>
                              )}
                              <span className={`text-[10px] font-mono ${
                                isLessonActive && isLight ? 'text-white/80' : 'text-slate-400'
                              }`}>
                                {lesson.duration}
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}

                      {/* End of Chapter Quiz Button */}
                      {chapter.quiz && chapter.quiz.length > 0 && (
                        <div className={`pt-1 mt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenQuiz(chapter.id);
                            }}
                            className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-3 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                              quizResult?.passed
                                ? isLight
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/40'
                                : isLight
                                  ? 'bg-red-50/50 text-[#EF4444] border-red-200 hover:bg-red-100/50'
                                  : 'bg-[#131D33] text-slate-300 border-slate-700 hover:bg-[#1A2644]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {quizResult?.passed
                                  ? (language === 'en'
                                      ? `Course Exam (Passed ${quizResult.score}/${quizResult.total})`
                                      : `اختبار المقرر (تم الاجتياز ${quizResult.score}/${quizResult.total})`)
                                  : (language === 'en'
                                      ? `Comprehensive Course Exam (${chapter.quiz.length} questions)`
                                      : `اختبار المقرر التقييمي (${chapter.quiz.length} أسئلة)`)}
                              </span>
                            </div>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                              isLight ? 'bg-white border-slate-300' : 'bg-[#0E1526] border-slate-700'
                            }`}>
                              {quizResult?.passed
                                ? (language === 'en' ? 'Retake' : 'إعادة')
                                : (language === 'en' ? 'Start' : 'ابدأ')}
                            </span>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
