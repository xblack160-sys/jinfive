import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, BookOpen, Clock, FileText, ChevronDown, 
  ShieldCheck, Sparkles, Layers
} from 'lucide-react';
import { UserProgress } from '../types';
import { getTotalCurriculumStats } from '../data/curriculumData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface DiplomaBannerProps {
  progress: UserProgress;
  onOpenSyllabus: () => void;
  onOpenCertificate: () => void;
  onOpenNotes: () => void;
}

export const DiplomaBanner: React.FC<DiplomaBannerProps> = ({
  progress,
  onOpenSyllabus,
  onOpenCertificate,
  onOpenNotes
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const isLight = theme === 'light';

  const stats = getTotalCurriculumStats();
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / (stats.totalLessons || 1)) * 100);

  // Count passed quizzes
  const passedQuizzesCount = Object.values(progress.completedQuizzes || {}).filter((q: any) => Boolean(q?.passed)).length;

  return (
    <div className={`border-b transition-colors ${
      isLight 
        ? 'bg-slate-50/90 border-slate-200' 
        : 'bg-[#0E1526] border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left / Specialization title */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-1.5 rounded-lg flex items-center justify-center bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 shrink-0">
              <Layers className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {t('diploma.title')}
              </span>
              <span className="font-semibold text-cyan-400 flex items-center gap-1">
                <span>{t('diploma.subtitle')}</span>
                <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/25">
                  {t('diploma.level_tag')}
                </span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {t('diploma.accredited_tag')}
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            {/* Syllabus Roadmap Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSyllabus}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-[#131D33] hover:bg-[#1A2644] text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{t('diploma.syllabus_btn')}</span>
            </motion.button>

            {/* Student Notebook */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenNotes}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-[#131D33] hover:bg-[#1A2644] text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{t('diploma.notes_btn')}</span>
            </motion.button>

            {/* Verified Certificate Readiness */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenCertificate}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                progressPercent === 100
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-amber-400 shadow-xs'
                  : isLight
                    ? 'bg-white hover:bg-slate-100 text-amber-700 border-amber-200'
                    : 'bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 border-amber-500/30'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {t('diploma.certificate_btn')} ({passedQuizzesCount}/{stats.totalChapters} {t('diploma.passed_quizzes')})
              </span>
            </motion.button>

            {/* Collapse toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-md text-slate-400 hover:text-slate-200 transition-colors ${
                isLight ? 'hover:bg-slate-200' : 'hover:bg-slate-800'
              }`}
              title={isExpanded ? t('diploma.details_hide') : t('diploma.details_show')}
            >
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Collapsible details with fluid motion */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-slate-800">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mt-1 ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}>
                  <div className={`p-3 rounded-xl border ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#131D33] border-slate-800'
                  }`}>
                    <div className="font-semibold flex items-center gap-1.5 text-[#EF4444]">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>{t('diploma.instructor_title')}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed">
                      {t('diploma.instructor_desc')}
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#131D33] border-slate-800'
                  }`}>
                    <div className="font-semibold flex items-center gap-1.5 text-emerald-400">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{t('diploma.hours_title')}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed">
                      {language === 'en'
                        ? `11 Specialized courses equivalent to ${stats.totalHours} accredited hours across university lectures, YouTube curated series & Colab labs.`
                        : `${stats.totalChapters} مقررات تخصصية تعادل ${stats.totalHours} ساعة من المحاضرات الجامعية وقوائم تشغيل YouTube ومعامل Colab.`
                      }
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#131D33] border-slate-800'
                  }`}>
                    <div className="font-semibold flex items-center gap-1.5 text-cyan-400">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>{t('diploma.labs_title')}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed">
                      {t('diploma.labs_desc')}
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#131D33] border-slate-800'
                  }`}>
                    <div className="font-semibold flex items-center gap-1.5 text-amber-400">
                      <Award className="w-4 h-4 shrink-0" />
                      <span>{t('diploma.conditions_title')}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed">
                      {t('diploma.conditions_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
