import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Award, Calculator, Sparkles, BookOpen, CheckCircle2, 
  Cloud, BookMarked, Terminal, Shield, DollarSign, Lock, User
} from 'lucide-react';
import { UserProgress } from '../types';
import { getTotalCurriculumStats } from '../data/curriculumData';
import { JinnaLogo } from './JinnaLogo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { LivePlatformStats } from './LivePlatformStats';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  progress: UserProgress;
  onOpenCalculator: () => void;
  onOpenCertificate: () => void;
  onToggleAiMentor: () => void;
  onOpenAdsSettings?: () => void;
  onOpenBooks?: () => void;
  onOpenIDE?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenStudentAuth?: () => void;
  studentName?: string;
  isRegisteredStudent?: boolean;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  cloudSynced?: boolean;
  isAdminUnlocked?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onOpenCalculator,
  onOpenCertificate,
  onToggleAiMentor,
  onOpenAdsSettings,
  onOpenBooks,
  onOpenIDE,
  onOpenAdminPortal,
  onOpenStudentAuth,
  studentName = '',
  isRegisteredStudent = false,
  cloudSynced = true,
  isAdminUnlocked = false
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { t, isRtl } = useLanguage();

  const stats = getTotalCurriculumStats();
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / (stats.totalLessons || 1)) * 100);

  // Multi-click secret protection for Admin Portal (requires 5 consecutive clicks)
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleAdminSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If already unlocked, open immediately
    if (isAdminUnlocked && onOpenAdminPortal) {
      onOpenAdminPortal();
      return;
    }

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (nextCount >= 5) {
      setClickCount(0);
      if (onOpenAdminPortal) {
        onOpenAdminPortal();
      }
    } else {
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-3 sm:px-4 lg:px-8 py-2.5 transition-colors ${
      isLight 
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-xs' 
        : 'bg-[#0B1120]/95 border-slate-800 text-slate-100 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Side: Far-Left Hidden Admin Access + Logo + Theme & Language Switchers */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
          {/* Secret Admin Button: Placed at the far-left, discreet, requires 5 fast clicks */}
          {onOpenAdminPortal && (
            <button
              onClick={handleAdminSecretClick}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-all select-none cursor-pointer flex items-center justify-center ${
                isAdminUnlocked
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                  : isLight
                    ? 'bg-slate-100/60 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
                    : 'bg-[#0E1322]/60 border-white/[0.04] text-slate-500 hover:text-slate-300 hover:bg-[#13192C]'
              }`}
              title={isAdminUnlocked ? t('header.admin_tooltip_active') : t('header.admin_tooltip_locked')}
              aria-label="Admin Portal Gate"
            >
              <Shield className={`w-3.5 h-3.5 transition-transform ${clickCount > 0 ? 'scale-125 text-cyan-400' : ''}`} />
              {isAdminUnlocked && (
                <span className="hidden xl:inline text-[10px] font-bold mr-1">Admin</span>
              )}
            </button>
          )}

          {/* JINNA 5 Logo & Credential */}
          <JinnaLogo theme={theme} />

          {/* Quick Toggles: Language Switcher + Theme Toggle */}
          <div className="flex items-center gap-1.5">
            <LanguageToggle compact />
            <ThemeToggle compact />
          </div>
        </div>

        {/* Executive Navigation Actions (Right side in RTL) */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* Translated Books Library Button */}
          {onOpenBooks && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenBooks}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs cursor-pointer ${
                isLight
                  ? 'bg-blue-50/80 hover:bg-blue-100 text-blue-900 border-blue-200 hover:border-blue-300'
                  : 'bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border-blue-800/40'
              }`}
              title={t('header.books_tooltip')}
            >
              <BookMarked className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">{t('header.books')}</span>
            </motion.button>
          )}

          {/* Cloud AI Studio IDE Workstation Button */}
          {onOpenIDE && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenIDE}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border-emerald-700/50'
              }`}
              title={t('header.ide_tooltip')}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t('header.ide')}</span>
            </motion.button>
          )}

          {/* VRAM Calculator Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenCalculator}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs cursor-pointer ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                : 'bg-[#131D33] hover:bg-[#1A2644] text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title={t('header.vram_tooltip')}
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t('header.vram_calc')}</span>
          </motion.button>

          {/* Verified Certificate Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenCertificate}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-500/50 shadow-amber-950/30'
            }`}
            title={t('header.certificate_tooltip')}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="sm:hidden">{t('header.certificate')}</span>
            <span className="hidden sm:inline">{t('header.certificate')}</span>
          </motion.button>

          {/* Student Account & Cloud DB Profile Button */}
          {onOpenStudentAuth && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenStudentAuth}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isRegisteredStudent
                  ? isLight
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/50 shadow-emerald-950/30'
                  : isLight
                    ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-300'
                    : 'bg-[#131D33] hover:bg-[#1A2644] text-cyan-300 border-cyan-500/40'
              }`}
              title={isRegisteredStudent ? 'حساب الطالب موثق في قاعدة البيانات' : 'تسجيل حساب طالب في قاعدة البيانات'}
            >
              <User className={`w-3.5 h-3.5 ${isRegisteredStudent ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span className="truncate max-w-[90px] sm:max-w-[120px]">
                {studentName ? studentName.split(' ')[0] : (isRtl ? 'حسابي' : 'Account')}
              </span>
            </motion.button>
          )}

          {/* Monetization & Earnings Button for Ads & Bank Transfer Guide - ONLY if Admin Unlocked */}
          {isAdminUnlocked && onOpenAdsSettings && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenAdsSettings}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40 shadow-emerald-950/30'
              }`}
              title={t('header.ads_tooltip')}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="sm:hidden">{t('header.ads')}</span>
              <span className="hidden sm:inline">{t('header.ads')}</span>
            </motion.button>
          )}

          {/* JINNA AI Coach Unified Launcher */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleAiMentor}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-700 hover:from-indigo-500 hover:to-cyan-600 text-white border border-indigo-400/40 shadow-indigo-950/40 cursor-pointer"
            title={t('header.ai_coach_tooltip')}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </motion.div>
            <span className="font-medium">{t('header.ai_coach')}</span>
            <span className="hidden md:inline text-indigo-200 text-[11px]">{t('header.ai_coach_sub')}</span>
          </motion.button>
        </div>
      </div>

      {/* JINNA 5 Progress & Firestore Status Ribbon */}
      <div className={`max-w-7xl mx-auto mt-2 pt-2 border-t flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs ${
        isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-3 font-medium flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#EF4444]" />
            <span>
              {t('header.curriculum_path')}: {stats.totalChapters} {t('header.chapters_count')} • {stats.totalLessons} {t('header.lessons_count')} ({stats.totalHours} {t('header.hours_count')})
            </span>
          </div>

          {cloudSynced && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
            >
              <Cloud className="w-3 h-3" />
              <span>{t('header.firestore_connected')}</span>
              <motion.span 
                animate={{ scale: [1, 1.3, 1] }} 
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
              />
            </motion.span>
          )}
        </div>

        {/* Real-time active learners heartbeat ONLY shown if Admin Unlocked */}
        {isAdminUnlocked && (
          <div className="hidden xl:flex items-center">
            <LivePlatformStats variant="header" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('header.progress')}: {completedCount}/{stats.totalLessons}</span>
          </div>
          <div className={`w-20 sm:w-28 rounded-full h-2 overflow-hidden border ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-slate-700'
          }`}>
            <motion.div
              className="bg-gradient-to-r from-[#EF4444] via-orange-500 to-emerald-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="font-mono text-emerald-500 font-bold">{progressPercent}%</span>
        </div>
      </div>
    </header>
  );
};
