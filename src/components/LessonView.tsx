import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Code2, Video, FileText, Circle, 
  Sparkles, Clock, ChevronRight, ChevronLeft, 
  Lightbulb, Eye, EyeOff, CheckCircle2, Award,
  ExternalLink, Github, Cpu, Play, Terminal, Layers, 
  Download, Check, AlertCircle, BookMarked, Maximize2,
  RotateCcw, MonitorPlay, Shield, Lock, HelpCircle
} from 'lucide-react';
import { Lesson, Chapter, AdsConfig } from '../types';
import { CodePlayground } from './CodePlayground';
import { ArchitectureSimulatorTab } from './ArchitectureSimulatorTab';
import { AdSlot } from './AdSlot';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface LessonViewProps {
  lesson: Lesson;
  chapter: Chapter;
  isCompleted: boolean;
  onToggleComplete: (lessonId: string) => void;
  onOpenAiMentor?: () => void;
  onOpenNotes?: () => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onOpenIDE?: () => void;
  onOpenBooks?: () => void;
  isLessonQuizPassed?: boolean;
  lessonQuizResult?: { score: number; total: number; passed: boolean };
  onOpenLessonQuiz?: (lessonId: string) => void;
  isNextLessonLocked?: boolean;
  nextLessonLockReason?: string;
  adsConfig?: AdsConfig;
  onOpenAdsSettings?: () => void;
}

// Helper to sanitize and extract strict 11-character YouTube video ID
function extractYouTubeId(input?: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) return match[1];
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const match11 = trimmed.match(/([\w-]{11})/);
  return match11 ? match11[1] : trimmed;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  chapter,
  isCompleted,
  onToggleComplete,
  onOpenAiMentor,
  onOpenNotes,
  onNextLesson,
  onPrevLesson,
  hasNext,
  hasPrev,
  onOpenIDE,
  onOpenBooks,
  isLessonQuizPassed = false,
  lessonQuizResult,
  onOpenLessonQuiz,
  isNextLessonLocked = false,
  nextLessonLockReason,
  adsConfig,
  onOpenAdsSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'theory' | 'code' | 'practice' | 'simulator'>('resources');
  const [showSolution, setShowSolution] = useState(false);
  const [selectedLectureIds, setSelectedLectureIds] = useState<Record<number, string>>({});
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [useNoCookieDomain, setUseNoCookieDomain] = useState(true);
  const { theme } = useTheme();
  const { language, isRtl, t, getLessonContent, getChapterContent } = useLanguage();
  const isLight = theme === 'light';

  const lessonContent = getLessonContent(lesson, chapter.id);
  const chapterContent = getChapterContent(chapter);

  // Reset tab, solution, and lecture choices on lesson change
  React.useEffect(() => {
    setActiveTab('resources');
    setShowSolution(false);
    setSelectedLectureIds({});
  }, [lesson.id]);

  return (
    <main 
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`flex-1 p-4 lg:p-8 overflow-y-auto max-h-[88vh] transition-colors ${
        isLight ? 'bg-slate-50' : 'bg-[#0B1120]'
      }`}
    >
      <motion.div 
        key={lesson.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Lesson Top Breadcrumb & Header */}
        <div className={`space-y-3 pb-5 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className={`font-semibold ${isLight ? 'text-[#EF4444]' : 'text-[#EF4444]'}`}>
                {chapter.id === 0 
                  ? (language === 'en' ? 'Foundational Course (Zero):' : 'المقرر التمهيدي (من الصفر):')
                  : (language === 'en' ? `Course ${chapter.id}:` : `المقرر ${chapter.id}:`)
                }
              </span>
              <span>{chapterContent.title}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isLessonQuizPassed ? (
                <button
                  onClick={() => onOpenLessonQuiz?.(lesson.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isLight
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50 shadow-sm shadow-emerald-950/50 hover:bg-emerald-900/60'
                  }`}
                  title={language === 'en' ? 'Retake quiz for review' : 'اضغط لإعادة الاختبار للتدريب والمراجعة'}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>
                    {language === 'en' 
                      ? `Verified (${lessonQuizResult ? `${lessonQuizResult.score}/${lessonQuizResult.total}` : 'Passed'})`
                      : `تم تأكيد الاستيعاب (${lessonQuizResult ? `${lessonQuizResult.score}/${lessonQuizResult.total}` : 'ناجح'})`}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenLessonQuiz?.(lesson.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-sm bg-amber-500 hover:bg-amber-400 text-black border-amber-400"
                  title={language === 'en' ? 'Take lesson quiz to unlock next topic' : 'إجراء اختبار استيعاب الدرس لتأكيد الإتقان وفتح الدرس التالي'}
                >
                  <HelpCircle className="w-4 h-4 text-black" />
                  <span>{t('lesson.quiz_take')}</span>
                </button>
              )}

              {onOpenNotes && (
                <button
                  onClick={onOpenNotes}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-[#131D33] hover:bg-[#1A2644] text-slate-200 border-slate-700'
                  }`}
                  title={language === 'en' ? 'My notes for this lesson' : 'ملاحظاتي الدراسية لهذا الدرس'}
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('lesson.notes_btn')}</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {lessonContent.title}
            </h1>
            <p className={`text-sm sm:text-base mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {lessonContent.subtitle}
            </p>
          </div>

          <div className={`flex items-center gap-4 text-xs pt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {lessonContent.duration}
            </span>
            <span>•</span>
            <span>{lessonContent.readTime}</span>
            <span>•</span>
            <span className="opacity-70 font-mono">ID: {lesson.id}</span>
          </div>
          {/* AdSlot In-Lesson (if enabled by admin) */}
          {adsConfig && adsConfig.enabled && adsConfig.showLessonAd && (
            <div className="pt-2">
              <AdSlot config={adsConfig} slotType="lesson" onOpenSettings={onOpenAdsSettings} />
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className={`flex items-center gap-1 border-b pb-px overflow-x-auto no-scrollbar ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          {[
            { id: 'resources', label: t('lesson.tab_resources'), icon: Video },
            { id: 'theory', label: t('lesson.tab_theory'), icon: BookOpen },
            { id: 'code', label: t('lesson.tab_code'), icon: Code2 },
            { id: 'practice', label: t('lesson.tab_practice'), icon: Lightbulb },
            { id: 'simulator', label: t('lesson.tab_simulator'), icon: Cpu },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? isLight
                      ? 'border-cyan-600 text-cyan-600 bg-white shadow-xs'
                      : 'border-cyan-400 text-cyan-300 bg-[#131D33]'
                    : isLight
                      ? 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0E1526]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content with Fluid Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Tab 1: Theory and Math */}
            {activeTab === 'theory' && (
              <div className="space-y-6">
            {lesson.sections.map((sec) => {
              const displaySectionTitle = lessonContent.getSectionTitle(sec.id, sec.title);
              return (
              <div 
                key={sec.id} 
                className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xs ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-900' 
                    : 'bg-[#111117] border-white/[0.07] text-slate-100'
                }`}
              >
                <h2 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>{displaySectionTitle}</span>
                </h2>

                <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {sec.content}
                </div>

                {/* Mathematical Formulas Box */}
                {sec.mathFormulas && sec.mathFormulas.length > 0 && (
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300' 
                      : 'bg-[#07070A] border-cyan-500/25'
                  }`}>
                    <span className={`text-xs font-mono font-bold block ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>
                      {t('lesson.math_title')}
                    </span>
                    <div className={`space-y-2 font-mono text-xs sm:text-sm p-3 rounded-lg border overflow-x-auto ${
                      isLight 
                        ? 'bg-white text-slate-900 border-slate-200' 
                        : 'bg-[#0C0C10] text-cyan-100 border-white/[0.06]'
                    }`} dir="ltr">
                      {sec.mathFormulas.map((f, i) => (
                        <div key={i} className="py-1">{f}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architecture Flow Diagram */}
                {sec.architectureDiagram && (
                  <div className={`p-3.5 rounded-xl border font-mono text-xs space-y-1 ${
                    isLight 
                      ? 'bg-slate-900 text-slate-200 border-slate-800' 
                      : 'bg-[#07070A] text-slate-300 border-white/[0.08]'
                  }`} dir="ltr">
                    <div className="text-cyan-400 font-bold mb-1">[Architecture & Hardware Data Path]</div>
                    <div className="text-cyan-200 overflow-x-auto whitespace-pre p-2 bg-black/40 rounded border border-white/[0.05]">
                      {sec.architectureDiagram}
                    </div>
                  </div>
                )}

                {/* Key Takeaway Callout */}
                <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  isLight
                    ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                    : 'bg-[#10111D] border-indigo-500/30 text-indigo-200'
                }`}>
                  <Lightbulb className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className={`font-bold block mb-0.5 ${isLight ? 'text-indigo-900' : 'text-white'}`}>
                      {t('lesson.takeaway_title')}
                    </span>
                    <span>{sec.takeaway}</span>
                  </div>
                </div>
              </div>
              );
            })}

            {/* Video Lecture Summary & Key Mental Models (ملخص الفيديو بعد الشرح) */}
            {lesson.videoResources && lesson.videoResources.length > 0 && (
              <div className={`p-5 rounded-2xl border transition-all shadow-md ${
                isLight 
                  ? 'bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 border-indigo-200/80 shadow-indigo-100/50' 
                  : 'bg-gradient-to-br from-[#0F101E] via-[#0D0D14] to-[#121326] border-indigo-500/30 shadow-black/40'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20 mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                      <Video className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-indigo-950' : 'text-indigo-200'}`}>
                        <span>{t('lesson.video_summary_title')}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Video Lecture Summary
                        </span>
                      </h3>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t('lesson.video_summary_sub')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('resources')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    <span>{t('lesson.watch_video_btn')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-4">
                  {lesson.videoResources.map((vid, vIdx) => (
                    <div 
                      key={vIdx}
                      className={`p-4 rounded-xl border ${
                        isLight 
                          ? 'bg-white/80 border-slate-200 shadow-xs' 
                          : 'bg-[#090A10] border-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div>
                          <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                            {vid.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 flex-wrap">
                            <span className="font-semibold text-cyan-400">{t('lesson.instructor_label')} {vid.instructor}</span>
                            <span>•</span>
                            <span className="font-mono">{vid.duration}</span>
                            <span>•</span>
                            <span className="px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/20 text-[10px]">
                              {vid.platform}
                            </span>
                          </div>
                        </div>

                        <a
                          href={vid.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium underline"
                        >
                          <span>{t('lesson.direct_link')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <p className={`text-xs leading-relaxed mb-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {vid.summary}
                      </p>

                      {vid.keyTakeaways && vid.keyTakeaways.length > 0 && (
                        <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#10111A] border-white/[0.06]'
                        }`}>
                          <span className="font-bold text-[11px] text-indigo-400 block mb-1">
                            {language === 'en' ? 'Key Video Insights:' : 'النقاط المستخلصة من الفيديو (Key Video Insights):'}
                          </span>
                          <ul className="space-y-1">
                            {vid.keyTakeaways.map((takeaway, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2 text-slate-300">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comprehensive Engineering Deep-Dive & Mental Model Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`p-6 rounded-2xl border space-y-5 shadow-lg ${
                isLight 
                  ? 'bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 border-amber-200/80 shadow-amber-100/30' 
                  : 'bg-gradient-to-br from-[#121422] via-[#0E101A] to-[#161726] border-amber-500/25 shadow-black/50'
              }`}
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className={`text-sm sm:text-base font-extrabold flex items-center gap-2 ${isLight ? 'text-amber-950' : 'text-amber-300'}`}>
                      <span>{t('lesson.deep_dive_title')}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {t('lesson.deep_dive_badge')}
                      </span>
                    </h3>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {t('lesson.deep_dive_desc')}
                    </p>
                  </div>
                </div>

                {onOpenBooks && (
                  <button
                    onClick={onOpenBooks}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t('lesson.books_btn')}</span>
                  </button>
                )}
              </div>

              {/* In-depth 3-Pillar Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${
                  isLight ? 'bg-white border-amber-200' : 'bg-[#0A0D18] border-white/[0.08]'
                }`}>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                    <Cpu className="w-4 h-4" />
                    <span>{t('lesson.why_need')}</span>
                  </span>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {t('lesson.why_need_desc')}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isLight ? 'bg-white border-amber-200' : 'bg-[#0A0D18] border-white/[0.08]'
                }`}>
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-2">
                    <Layers className="w-4 h-4" />
                    <span>{t('lesson.math_intuition')}</span>
                  </span>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {t('lesson.math_intuition_desc')}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isLight ? 'bg-white border-amber-200' : 'bg-[#0A0D18] border-white/[0.08]'
                }`}>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t('lesson.avoid_errors')}</span>
                  </span>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {t('lesson.avoid_errors_desc')}
                  </p>
                </div>
              </div>

              {/* Senior Engineering Quote / Rule of Thumb */}
              <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                isLight ? 'bg-amber-100/60 border-amber-300 text-amber-950' : 'bg-[#151928] border-amber-500/30 text-amber-200'
              }`}>
                <span className="font-semibold leading-relaxed">
                  💡 <strong>{t('lesson.senior_tip_title')}</strong> {t('lesson.senior_tip_desc')}
                </span>
              </div>
            </motion.div>

            {/* Inline Code Preview Shortcut */}
            <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xs ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-gradient-to-r from-[#111117] to-[#141522] border-white/[0.08] text-white'
            }`}>
              <div>
                <h3 className="text-xs font-bold">{t('lesson.try_code_title')}</h3>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t('lesson.try_code_sub')}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('code')}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-950/40 border border-cyan-400/30"
              >
                {t('lesson.open_code_btn')}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Code Editor */}
        {activeTab === 'code' && (
          <div className="space-y-4 animate-fadeIn">
            {onOpenIDE && (
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
                isLight 
                  ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-300 text-emerald-950'
                  : 'bg-gradient-to-r from-[#0D1A16] via-[#0F221D] to-[#0A1412] border-emerald-500/40 text-emerald-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                      <span>{t('lesson.ide_title')}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Sandbox Full Stack
                      </span>
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {t('lesson.ide_desc')}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenIDE}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 flex items-center gap-2 self-start sm:self-center cursor-pointer flex-shrink-0"
                >
                  <Terminal className="w-4 h-4" />
                  <span>{t('lesson.ide_launch_btn')}</span>
                </motion.button>
              </div>
            )}

            <CodePlayground
              initialSnippet={lesson.pythonCode}
              lessonId={lesson.id}
            />
          </div>
        )}

        {/* Tab 3: University Courses, Playlists & Hands-On Labs Hub */}
        {activeTab === 'resources' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Transparent Verified Hours Accounting Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isLight 
                ? 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border-blue-200' 
                : 'bg-gradient-to-r from-[#12131F] via-[#101426] to-[#0D101C] border-cyan-500/20'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <span>{t('lesson.hours_breakdown')}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {t('lesson.hours_verified')}
                      </span>
                    </h4>
                    <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {t('lesson.hours_sub')}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-baseline gap-1.5 font-mono">
                  <span className="text-2xl font-black text-cyan-400">
                    {lesson.hoursBreakdown?.totalHours || 28}
                  </span>
                  <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t('lesson.accredited_hours')}
                  </span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-black/30 border-white/[0.06]'}`}>
                  <span className={`text-[11px] block font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    🎥 {t('lesson.video_lectures')}
                  </span>
                  <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
                    {lesson.hoursBreakdown?.lecturesHours || 14} {language === 'en' ? 'Hours' : 'ساعة'}
                  </div>
                  <span className="text-[10px] text-slate-500">{language === 'en' ? 'Full University Courses' : 'سلاسل جامعية كاملة'}</span>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-black/30 border-white/[0.06]'}`}>
                  <span className={`text-[11px] block font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    💻 {t('lesson.lab_work')}
                  </span>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                    {lesson.hoursBreakdown?.labHours || 8} {language === 'en' ? 'Hours' : 'ساعات'}
                  </div>
                  <span className="text-[10px] text-slate-500">Google Colab & PyTorch</span>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-black/30 border-white/[0.06]'}`}>
                  <span className={`text-[11px] block font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    📑 {t('lesson.reading_hours')}
                  </span>
                  <div className="text-lg font-bold font-mono text-purple-400 mt-1">
                    {lesson.hoursBreakdown?.readingHours || 3} {language === 'en' ? 'Hours' : 'ساعات'}
                  </div>
                  <span className="text-[10px] text-slate-500">{language === 'en' ? 'arXiv Research Papers' : 'أوراق بحثية من arXiv'}</span>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-black/30 border-white/[0.06]'}`}>
                  <span className={`text-[11px] block font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    🚀 {t('lesson.project_hours')}
                  </span>
                  <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                    {lesson.hoursBreakdown?.projectHours || 3} {language === 'en' ? 'Hours' : 'ساعات'}
                  </div>
                  <span className="text-[10px] text-slate-500">{language === 'en' ? 'Applied Code & Benchmark' : 'تطبيق عملي واختبار'}</span>
                </div>
              </div>
            </div>

            {/* University Masterclasses & Course Playlists */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <Video className="w-4 h-4 text-cyan-500" />
                  <span>{language === 'en' ? 'Full University Courses & Accredited Lectures (20 to 35 Hours)' : 'الكورسات الجامعية الكاملة والمحاضرات المعتمدة (Full University Courses - 20 to 35 Hours)'}</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {lesson.videoResources.length} {language === 'en' ? 'Full Courses' : 'كورسات وسلاسل كاملة'}
                </span>
              </div>

              {lesson.videoResources.map((vid, idx) => {
                const activeLectureId = selectedLectureIds[idx] || (vid.lectures && vid.lectures.length > 0 ? (vid.lectures[0].id || 'lec-0') : undefined);
                const activeLecture = vid.lectures ? (vid.lectures.find(l => (l.id || `lec-${vid.lectures?.indexOf(l)}`) === activeLectureId) || vid.lectures[0]) : undefined;
                const rawEmbed = (activeLecture ? activeLecture.embedId : undefined) || vid.embedId || vid.videoUrl;
                const currentActiveEmbed = extractYouTubeId(rawEmbed);
                const startSeconds = activeLecture?.startTime || 0;

                return (
                  <div 
                    key={idx} 
                    className={`p-5 rounded-2xl border space-y-4 shadow-xs ${
                      isLight 
                        ? 'bg-white border-slate-200 text-slate-900' 
                        : 'bg-[#111117] border-white/[0.07] text-slate-100'
                    }`}
                  >
                    {/* Course Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {vid.institution || vid.platform}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {vid.courseType || 'Full University Course'}
                          </span>
                          {vid.totalCourseHours && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ⏱ {vid.totalCourseHours}
                            </span>
                          )}
                        </div>
                        <h4 className={`text-base sm:text-lg font-bold mt-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {vid.title}
                        </h4>
                        <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          المحاضر: <span className={isLight ? 'text-blue-700 font-semibold' : 'text-cyan-300 font-semibold'}>{vid.instructor}</span>
                          {vid.lectures && vid.lectures.length > 0 && ` • السلسلة تضم ${vid.lectures.length} محاضرات تفصيلية`}
                        </p>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={vid.playlistUrl || vid.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            isLight 
                              ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' 
                              : 'bg-red-950/40 hover:bg-red-900/50 text-red-300 border-red-700/50'
                          }`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>السلسلة الكاملة على YouTube</span>
                        </a>

                        {vid.slidesUrl && (
                          <a
                            href={vid.slidesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isLight 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                                : 'bg-[#181824] hover:bg-[#222234] text-slate-300 border-white/[0.08]'
                            }`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>سلايدات المحاضرات (PDF)</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Smart Modular Course Guide Banner for Long Videos (>20-25 hrs) */}
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl border transition-all ${
                        isLight
                          ? 'bg-gradient-to-r from-blue-50 via-indigo-50/70 to-slate-50 border-blue-200 text-slate-900 shadow-sm'
                          : 'bg-gradient-to-r from-[#0C1425] via-[#101B33] to-[#0A0E1A] border-blue-500/30 text-slate-100 shadow-md'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                            <Sparkles className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-xs sm:text-sm text-blue-400">
                                نظام الدراسة الذكية المجزأة (Smart Modular Learning)
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                مرجع جامعي مكثف يتجاوز 25 ساعة
                              </span>
                            </div>
                            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                              هذا المساق المعتمد مقدم كمرجع مرئي كامل وضخم من أعرق الجامعات العالمية. 
                              <span className="font-semibold text-cyan-400"> لتفادي الإرهاق والملل</span>، قمنا بتفكيكه وفهرسته داخلياً إلى محاضرات مستقلة ومحددة أدناه. 
                              عند نقرك على أي محاضرة، سينتقل المشغل فوراً للدقيقة والثانية المخصصة لها لتدرس كل جزئية بتركيز وبسرعتك الخاصة.
                            </p>
                          </div>
                        </div>

                        {onOpenIDE && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onOpenIDE}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 flex-shrink-0 self-start sm:self-center cursor-pointer"
                          >
                            <Terminal className="w-4 h-4 text-white" />
                            <span>تطبيق المشروع في الـ IDE</span>
                          </motion.button>
                        )}
                      </div>

                      {/* Micro stats strip */}
                      <div className="mt-3 pt-2.5 border-t border-blue-500/20 flex items-center justify-between gap-2 text-[11px] text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>إجمالي مدة المرجع الكامل: <strong className="text-slate-200 font-mono">{vid.totalCourseHours || vid.duration || '25+ ساعة'}</strong></span>
                        </span>
                        {vid.lectures && vid.lectures.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-emerald-400" />
                            <span>مقسم إلى: <strong className="text-slate-200 font-mono">{vid.lectures.length} محاضرات نموذجية</strong></span>
                          </span>
                        )}
                        <span className="text-cyan-400 font-mono">تحديث زمني فوري عند الاختيار ✓</span>
                      </div>
                    </motion.div>

                    {/* YouTube Embed Player with In-Platform Controls */}
                    {currentActiveEmbed && (
                      <motion.div 
                        className="space-y-2.5"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Video Player Action Ribbon */}
                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs px-1">
                          <div className="flex items-center gap-2 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse" />
                            <span className={isLight ? 'text-slate-800 font-bold' : 'text-slate-200 font-bold'}>
                              مشغل المنصة عالي الدقة (HD Live Stream)
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hidden sm:inline">
                              يعمل مباشرة داخل المنصة
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Toggle Server Mode (No-Cookie vs Direct) */}
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                setUseNoCookieDomain(prev => !prev);
                                setReloadKey(prev => prev + 1);
                              }}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                                useNoCookieDomain 
                                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' 
                                  : isLight ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100' : 'bg-[#181824] text-slate-300 border-white/[0.1] hover:bg-[#222232]'
                              }`}
                              title="التبديل بين سيرفر البث المشفر No-Cookie وسيرفر Direct في حال وجود حجب من الشبكة"
                            >
                              <Shield className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="hidden sm:inline">{useNoCookieDomain ? 'سيرفر No-Cookie' : 'سيرفر مباشر'}</span>
                            </motion.button>

                            {/* Toggle Theater Mode */}
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setIsTheaterMode(!isTheaterMode)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                                isTheaterMode 
                                  ? 'bg-[#EF4444] text-white border-red-500 shadow-sm' 
                                  : isLight ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100' : 'bg-[#181824] text-slate-300 border-white/[0.1] hover:bg-[#222232]'
                              }`}
                              title="تبديل حجم الشاشة داخل المنصة"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>{isTheaterMode ? 'تصغير الحجم' : 'تكبير المشغل'}</span>
                            </motion.button>

                            {/* Reload Player Frame */}
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setReloadKey(prev => prev + 1)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                                isLight ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100' : 'bg-[#181824] text-slate-300 border-white/[0.1] hover:bg-[#222232]'
                              }`}
                              title="تحديث المشغل وإعادة تحميل الفيديو"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="hidden sm:inline">تحديث</span>
                            </motion.button>

                            {/* Direct 1-Click Launch Button for YouTube */}
                            <motion.a
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              href={`https://www.youtube.com/watch?v=${currentActiveEmbed}${startSeconds > 0 ? `&t=${startSeconds}s` : ''}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EF4444] hover:bg-red-600 text-white text-xs font-bold transition-all shadow-xs"
                              title="فتح في يوتيوب كخيار إضافي"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span className="hidden sm:inline">يوتيوب</span>
                              <ExternalLink className="w-3 h-3" />
                            </motion.a>
                          </div>
                        </div>

                        {/* Player Frame with Dynamic Key Remount */}
                        <div className={`relative rounded-2xl overflow-hidden border bg-black shadow-2xl transition-all duration-300 ${
                          isTheaterMode ? 'aspect-[16/9] sm:aspect-[21/9] ring-2 ring-[#EF4444]/40' : 'aspect-video'
                        } ${isLight ? 'border-slate-300' : 'border-white/[0.12]'}`}>
                          <iframe
                            key={`${currentActiveEmbed}-${startSeconds}-${reloadKey}-${useNoCookieDomain ? 'nc' : 'yt'}`}
                            src={`${useNoCookieDomain ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com'}/embed/${currentActiveEmbed}?rel=0&modestbranding=1&playsinline=1${startSeconds > 0 ? `&start=${startSeconds}` : ''}`}
                            title={activeLecture ? activeLecture.title : vid.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                            allowFullScreen
                          />
                        </div>

                        {/* Player Status & Active Lecture Note */}
                        <div className="flex items-center justify-between text-xs px-2 text-slate-400 flex-wrap gap-2">
                          <span className="font-semibold text-cyan-400 flex items-center gap-1">
                            <span>المحاضرة الحالية:</span>
                            <span className={isLight ? 'text-slate-800 font-bold' : 'text-white'}>
                              {activeLecture ? activeLecture.title : vid.title}
                            </span>
                          </span>
                          <div className="flex items-center gap-3">
                            {activeLecture?.duration && (
                              <span className="font-mono text-[11px]">المدة: {activeLecture.duration}</span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReloadKey(k => k + 1);
                              }}
                              className="text-[11px] text-cyan-400 hover:underline font-semibold cursor-pointer"
                            >
                              إعادة تحميل المشغل ↻
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Lecture Series Breakdown / Switcher */}
                    {vid.lectures && vid.lectures.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            <Layers className="w-3.5 h-3.5 text-cyan-400" />
                            <span>فهرس محاضرات هذه الدورة (انقر على أي محاضرة للتشغيل الفوري):</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {vid.lectures.length} محاضرات
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                          {vid.lectures.map((lec, lIdx) => {
                            const lecId = lec.id || `lec-${lIdx}`;
                            const isLecActive = activeLecture ? (lec.id ? lec.id === activeLecture.id : lIdx === 0) : false;
                            return (
                              <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                key={lecId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLectureIds(prev => ({ ...prev, [idx]: lecId }));
                                  setReloadKey(k => k + 1);
                                }}
                                className={`text-right p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                                  isLecActive
                                    ? isLight
                                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs'
                                      : 'bg-cyan-950/50 border-cyan-500/60 text-cyan-200 font-bold shadow-xs'
                                    : isLight
                                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                      : 'bg-[#14141d] hover:bg-[#1b1b26] border-white/[0.06] text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <div className={`p-1.5 rounded-lg shrink-0 ${isLecActive ? 'bg-[#EF4444] text-white' : 'bg-slate-800 text-slate-300'}`}>
                                    <Play className="w-3 h-3" />
                                  </div>
                                  <span className="truncate">{lec.title}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 shrink-0">{lec.duration}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{vid.summary}</p>

                    <div className={`p-3 rounded-lg border space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#07070A] border-white/[0.06]'
                    }`}>
                      <span className={`text-xs font-bold block ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>
                        أبرز النقاط المستخلصة (Key Takeaways):
                      </span>
                      <ul className={`list-disc list-inside space-y-1 text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {vid.keyTakeaways.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hands-On Labs & 1-Click Google Colab Notebooks */}
            {lesson.handsOnLabs && lesson.handsOnLabs.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    <span>المعامل البرمجية الحية ودفاتر Google Colab الرسمية (Hands-On Labs)</span>
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">تدريب عملي فوري</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lesson.handsOnLabs.map((lab, labIdx) => (
                    <div
                      key={labIdx}
                      className={`p-4 rounded-xl border space-y-3 shadow-xs ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#111117] border-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {lab.difficulty}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">⏱ {lab.estimatedHours}</span>
                          </div>
                          <h4 className={`text-sm font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {lab.title}
                          </h4>
                        </div>
                      </div>

                      <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {lab.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        {lab.colabUrl && (
                          <a
                            href={lab.colabUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>تشغيل في Google Colab</span>
                          </a>
                        )}

                        {lab.githubUrl && (
                          <a
                            href={lab.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isLight 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                                : 'bg-[#181822] hover:bg-[#20202F] text-slate-300 border-white/[0.08]'
                            }`}
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>مستودع GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Authoritative Papers & GitHub Repos */}
            <div className="space-y-3">
              <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <FileText className="w-4 h-4 text-purple-500" />
                <span>الأوراق البحثية التأسيسية والمستودعات المعتمدة (Foundational Papers & Repos)</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {lesson.referencePapers.map((paper, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border transition-all space-y-2 shadow-xs ${
                      isLight 
                        ? 'bg-white border-slate-200 hover:border-purple-300' 
                        : 'bg-[#111117] border-white/[0.06] hover:border-white/[0.14]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          isLight 
                            ? 'bg-purple-50 text-purple-800 border-purple-200' 
                            : 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                        }`}>
                          {paper.badge} • {paper.year}
                        </span>
                        <h4 className={`text-sm font-bold mt-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{paper.title}</h4>
                        <p className={`text-xs mt-0.5 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{paper.authors}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {paper.githubUrl && (
                          <a
                            href={paper.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg transition-colors border ${
                              isLight 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                                : 'bg-[#181822] hover:bg-[#20202F] text-slate-300 border-white/[0.08]'
                            }`}
                            title="مستودع GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={paper.arxivUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            isLight 
                              ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200' 
                              : 'bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border-purple-700/50'
                          }`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>رابط arXiv</span>
                        </a>
                      </div>
                    </div>
                    <p className={`text-xs italic ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>"{paper.citation}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Architecture & Hyperparameter Sandbox Simulator */}
        {activeTab === 'simulator' && (
          <ArchitectureSimulatorTab />
        )}

        {/* Tab 4: Practical Exercise & Interview Tips */}
        {activeTab === 'practice' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Practical Exercise Box */}
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xs ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#111117] border-white/[0.07] text-slate-100'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  <span>تمرين تطبيقي مصغر (Hands-on Challenge)</span>
                </h3>
                <span className={`text-xs font-mono font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>تطبيق حقيقي</span>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                {lesson.practicalExercise.prompt}
              </p>

              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                isLight 
                  ? 'bg-amber-50 border-amber-200 text-amber-800' 
                  : 'bg-[#07070A] border-amber-500/25 text-amber-300/90'
              }`}>
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>إشارة للحل (Hint): {lesson.practicalExercise.expectedOutputHint}</span>
              </div>

              <div className="relative">
                <pre className={`p-3.5 rounded-xl border font-mono text-xs overflow-x-auto ${
                  isLight 
                    ? 'bg-slate-900 text-slate-100 border-slate-800' 
                    : 'bg-[#07070A] text-slate-300 border-white/[0.06]'
                }`} dir="ltr">
                  {lesson.practicalExercise.initialCode}
                </pre>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' 
                      : 'bg-[#161622] hover:bg-[#202030] text-slate-200 border-white/[0.08]'
                  }`}
                >
                  {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSolution ? "إخفاء الحل النموذجي" : "إظهار الحل النموذجي"}</span>
                </button>
              </div>

              {showSolution && (
                <div className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                  isLight 
                    ? 'bg-emerald-50 border-emerald-300' 
                    : 'bg-emerald-950/20 border-emerald-700/40'
                }`}>
                  <span className={`text-xs font-bold block ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                    كود الحل النموذجي (Reference Solution):
                  </span>
                  <pre className={`p-3 rounded-lg font-mono text-xs overflow-x-auto border ${
                    isLight 
                      ? 'bg-white text-emerald-950 border-emerald-200' 
                      : 'bg-[#07070A] text-emerald-200 border-emerald-900/40'
                  }`} dir="ltr">
                    {lesson.practicalExercise.solutionCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Meta & OpenAI Interview Secrets */}
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-3 shadow-xs ${
              isLight 
                ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950' 
                : 'bg-gradient-to-r from-indigo-950/30 via-[#111117] to-indigo-950/30 border-indigo-500/30 text-white'
            }`}>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm sm:text-base font-bold">
                  أسرار المقابلات التقنية لشركات الذكاء الاصطناعي (Meta / OpenAI / DeepMind)
                </h3>
              </div>

              <div className="space-y-2 pt-1">
                {lesson.interviewTips.map((tip, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                      isLight 
                        ? 'bg-white border-indigo-100 text-slate-700' 
                        : 'bg-[#07070A] border-white/[0.06] text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-indigo-500 font-mono flex-shrink-0">[{idx + 1}]</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>

        {/* End-of-Lesson Mastery Verification Card (Required for Next Lesson) */}
        <div className={`mt-8 p-5 sm:p-6 rounded-2xl border transition-all ${
          isLessonQuizPassed
            ? isLight
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-gradient-to-r from-emerald-950/40 via-[#0B1410] to-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : isLight
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-gradient-to-r from-amber-950/30 via-[#14120A] to-amber-950/30 border-amber-500/40 text-amber-100'
        }`}>
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isLessonQuizPassed 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {isLessonQuizPassed ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <span>
                    {isLessonQuizPassed 
                      ? (language === 'en' ? 'Comprehension Verified & Quiz Successfully Passed' : 'تم تأكيد الاستيعاب واجتياز اختبار الدرس بنجاح')
                      : (language === 'en' ? 'Verify Lesson Comprehension (Mandatory for Progression)' : 'تأكيد استيعاب وإتمام الدرس (إلزامي للتقدم)')}
                  </span>
                  {isLessonQuizPassed && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                      PASSED {lessonQuizResult ? `${lessonQuizResult.score}/${lessonQuizResult.total}` : ''}
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  {isLessonQuizPassed 
                    ? (language === 'en' 
                        ? 'Outstanding! You demonstrated mastery of this lesson\'s engineering principles. The next lesson in the curriculum is now unlocked.' 
                        : 'أحسنت! تم إثبات استيعاب المفاهيم الهندسية لهذا الدرس. تم فتح الدرس التالي في المنهج تلقائياً.')
                    : (language === 'en'
                        ? 'Per rigorous accreditation standards established by Eng. Yousuf Albaz; advancing to subsequent lessons requires passing this lesson\'s assessment.'
                        : 'طبقاً لمعايير الاعتماد الهندسية المقررة من المهندس يوسف الباز؛ لا يمكن الانتقال للدرس التالي إلا بعد تأكيد استيعاب هذا الدرس واجتياز اختباره التقييمي.')}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenLessonQuiz?.(lesson.id)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                isLessonQuizPassed
                  ? isLight
                    ? 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                    : 'bg-[#151C26] hover:bg-[#1E293B] text-slate-200 border border-white/[0.1]'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-black shadow-amber-950/40'
              }`}
            >
              {isLessonQuizPassed ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Retake Quiz for Review' : 'إعادة الاختبار للمراجعة'}</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-black" />
                  <span>{language === 'en' ? 'Take Lesson Quiz Now (3 Questions) 🚀' : 'إجراء اختبار استيعاب الدرس الآن (3 أسئلة) 🚀'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AdSlot Bottom (if enabled by admin) */}
        {adsConfig && adsConfig.enabled && adsConfig.showBottomAd && (
          <div className="pt-2">
            <AdSlot config={adsConfig} slotType="bottom" onOpenSettings={onOpenAdsSettings} />
          </div>
        )}

        {/* Footer Navigation Bar (Next / Prev Lessons) */}
        <div className={`pt-6 border-t flex items-center justify-between gap-4 ${
          isLight ? 'border-slate-200' : 'border-white/[0.08]'
        }`}>
          <button
            onClick={onPrevLesson}
            disabled={!hasPrev}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors border ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-[#14141B] hover:bg-[#1C1D28] text-slate-300 border-white/[0.08]'
            }`}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{t('lesson.prev')}</span>
          </button>

          {isNextLessonLocked ? (
            <button
              onClick={() => onOpenLessonQuiz?.(lesson.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-semibold transition-all shadow-md"
              title={language === 'en' ? 'Click to take quiz and unlock next topic' : 'اضغط هنا لإجراء اختبار تأكيد هذا الدرس وفتح الدرس التالي'}
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{t('lesson.next_locked')}</span>
            </button>
          ) : (
            <button
              onClick={onNextLesson}
              disabled={!hasNext}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-cyan-950/50 border border-cyan-400/30"
            >
              <span>{t('lesson.next')}</span>
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </motion.div>
    </main>
  );
};
