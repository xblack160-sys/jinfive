import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Layers, Bot, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LessonView } from './components/LessonView';
import { AiMentorDrawer } from './components/AiMentorDrawer';
import { QuizModal } from './components/QuizModal';
import { VramCalculatorModal } from './components/VramCalculatorModal';
import { CertificateModal } from './components/CertificateModal';
import { DiplomaBanner } from './components/DiplomaBanner';
import { DiplomaSyllabusModal } from './components/DiplomaSyllabusModal';
import { StudentNotesDrawer } from './components/StudentNotesDrawer';
import { BooksLibraryModal } from './components/BooksLibraryModal';
import { FullAiStudioIDE } from './components/FullAiStudioIDE';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LessonQuizModal } from './components/LessonQuizModal';
import { GrandDefenseExamModal } from './components/GrandDefenseExamModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminConsoleView } from './components/AdminConsoleView';
import { AdsControlModal } from './components/AdsControlModal';
import { InstructionsModal } from './components/InstructionsModal';
import { SecurityShield } from './components/SecurityShield';
import { InteractiveClickWave } from './components/InteractiveClickWave';
import { InteractiveBackgroundMesh } from './components/InteractiveBackgroundMesh';
import { allChapters, getLessonById } from './data/curriculumData';
import { UserProgress, AdsConfig } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { 
  initAuthListener, 
  loadProgressFromCloud, 
  saveProgressToCloud, 
  testFirestoreConnection 
} from './lib/firebase';
import type { User } from 'firebase/auth';

const PROGRESS_STORAGE_KEY = 'ai_systems_platform_progress_v1';

function AppContent() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { isRtl } = useLanguage();

  // Load progress from localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
    return {
      completedLessons: ['1-1'],
      completedQuizzes: {},
      studentName: ''
    };
  });

  // Firebase Authentication & Cloud Database Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);

  // Initialize Firebase anonymous auth & test cloud connection
  useEffect(() => {
    testFirestoreConnection().then(ok => setIsCloudSynced(ok));

    const unsubscribe = initAuthListener(async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsCloudSynced(true);
        // Hydrate from cloud if existing record exists
        const cloudData = await loadProgressFromCloud(user.uid);
        if (cloudData && Array.isArray(cloudData.completedLessons)) {
          setProgress(prev => ({
            ...prev,
            completedLessons: Array.from(new Set([...prev.completedLessons, ...cloudData.completedLessons])),
            completedQuizzes: { ...prev.completedQuizzes, ...(cloudData.quizScores || {}) }
          }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Mobile navigation tab: 'lesson' (lesson on top) or 'sidebar' (browse chapters)
  const [mobileActiveTab, setMobileActiveTab] = useState<'lesson' | 'sidebar'>('lesson');

  // Current Active Lesson and Chapter - Starts from Chapter 0 (Computer Science from scratch)
  const [currentChapterId, setCurrentChapterId] = useState<number>(0);
  const [currentLessonId, setCurrentLessonId] = useState<string>('0-1');

  // Modals & Drawers state
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isBooksOpen, setIsBooksOpen] = useState(false);
  const [isIdeOpen, setIsIdeOpen] = useState(false);
  const [activeQuizChapterId, setActiveQuizChapterId] = useState<number | null>(null);
  const [activeLessonQuizId, setActiveLessonQuizId] = useState<string | null>(null);
  const [isGrandExamOpen, setIsGrandExamOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin and Developer Portal States
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isDevMode, setIsDevMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jinna5_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [isAdsSettingsOpen, setIsAdsSettingsOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const [adsConfig, setAdsConfig] = useState<AdsConfig>(() => {
    try {
      const saved = localStorage.getItem('jinna5_ads_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      enabled: false,
      publisherId: '',
      adSlotId: '',
      showLessonAd: true,
      showBottomAd: true,
      testMode: true
    };
  });

  const handleUnlockDevMode = (pin: string): boolean => {
    const cleaned = pin.trim().toLowerCase();
    if (cleaned === 'ujintwo' || cleaned === '2026') {
      setIsDevMode(true);
      try {
        localStorage.setItem('jinna5_admin_unlocked', 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const handleLockDevMode = () => {
    setIsDevMode(false);
    setShowAdminConsole(false);
    try {
      localStorage.removeItem('jinna5_admin_unlocked');
    } catch {
      // ignore
    }
  };

  const handleSaveAdsConfig = (newConfig: AdsConfig) => {
    setAdsConfig(newConfig);
    try {
      localStorage.setItem('jinna5_ads_config', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  // Check if opened via QR code or direct link with ?verify= parameter
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const verifyCode = params.get('verify') || params.get('cert');
        if (verifyCode) {
          setIsVerificationMode(true);
          setIsCertificateOpen(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save progress changes to both LocalStorage and Firebase Firestore Cloud
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
      if (currentUser) {
        saveProgressToCloud(
          currentUser.uid,
          progress.completedLessons,
          currentLessonId,
          progress.completedQuizzes
        );
      }
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  }, [progress, currentUser, currentLessonId]);

  // Current lesson & chapter details
  const resolved = getLessonById(currentLessonId) || {
    lesson: allChapters[0].lessons[0],
    chapter: allChapters[0]
  };
  const { lesson: currentLesson, chapter: currentChapter } = resolved;

  // Flattened list of all lessons for linear navigation
  const allLessonsFlat = allChapters.flatMap(c => c.lessons.map(l => ({ lessonId: l.id, chapterId: c.id })));
  const currentIndex = allLessonsFlat.findIndex(x => x.lessonId === currentLessonId);
  const hasNext = currentIndex < allLessonsFlat.length - 1;
  const hasPrev = currentIndex > 0;

  // Check if current lesson's quiz is passed or verified
  const isCurrentLessonQuizPassed = Boolean(
    progress.bypassLocking ||
    progress.completedLessonQuizzes?.[currentLesson.id]?.passed ||
    progress.completedLessons.includes(currentLesson.id)
  );

  // Is next lesson locked? Yes if current lesson is not yet passed/confirmed
  const isNextLessonLocked = hasNext && !isCurrentLessonQuizPassed;

  const handleNextLesson = () => {
    if (hasNext) {
      if (isNextLessonLocked) {
        // Enforce student confirmation: take the lesson quiz first!
        setActiveLessonQuizId(currentLesson.id);
        return;
      }
      const next = allLessonsFlat[currentIndex + 1];
      setCurrentChapterId(next.chapterId);
      setCurrentLessonId(next.lessonId);
      setMobileActiveTab('lesson');
      window.scrollTo(0, 0);
    }
  };

  const handlePrevLesson = () => {
    if (hasPrev) {
      const prev = allLessonsFlat[currentIndex - 1];
      setCurrentChapterId(prev.chapterId);
      setCurrentLessonId(prev.lessonId);
      setMobileActiveTab('lesson');
      window.scrollTo(0, 0);
    }
  };

  // When a lesson or chapter is clicked, ensure it is immediately on top and active
  const handleSelectLesson = (chapterId: number, lessonId: string) => {
    setCurrentChapterId(chapterId);
    setCurrentLessonId(lessonId);
    setMobileActiveTab('lesson');
    window.scrollTo(0, 0);
  };

  const handleToggleCompleteLesson = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.completedLessons.includes(lessonId);
      const updated = exists
        ? prev.completedLessons.filter(id => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      return { ...prev, completedLessons: updated };
    });
  };

  const handlePassLessonQuiz = (lessonId: string, score: number, total: number) => {
    setProgress(prev => {
      const isAlreadyIn = prev.completedLessons.includes(lessonId);
      return {
        ...prev,
        completedLessons: isAlreadyIn ? prev.completedLessons : [...prev.completedLessons, lessonId],
        completedLessonQuizzes: {
          ...(prev.completedLessonQuizzes || {}),
          [lessonId]: {
            score,
            total,
            passed: true,
            completedAt: new Date().toISOString()
          }
        }
      };
    });
  };

  const handleSaveGrandExamResult = (score: number, total: number, percentage: number, passed: boolean) => {
    setProgress(prev => ({
      ...prev,
      grandExamResult: {
        score,
        total,
        percentage,
        passed,
        completedAt: new Date().toISOString()
      }
    }));
  };

  const handleSaveQuizScore = (chapterId: number, score: number, total: number) => {
    const passed = score >= Math.ceil(total * 0.7);
    setProgress(prev => ({
      ...prev,
      completedQuizzes: {
        ...prev.completedQuizzes,
        [chapterId]: { score, total, passed }
      }
    }));
  };

  const handleSaveStudentName = (name: string) => {
    setProgress(prev => ({
      ...prev,
      studentName: name
    }));
  };

  const activeQuizChapter = activeQuizChapterId ? allChapters.find(c => c.id === activeQuizChapterId) : null;
  const activeLessonForQuiz = activeLessonQuizId ? (getLessonById(activeLessonQuizId)?.lesson || null) : null;

  // If Admin Console is activated, render the advanced Admin Console view
  if (showAdminConsole && isDevMode) {
    return (
      <div dir={isRtl ? "rtl" : "ltr"}>
        <AdminConsoleView
          adsConfig={adsConfig}
          onSaveAdsConfig={handleSaveAdsConfig}
          onBackToStudentView={() => setShowAdminConsole(false)}
          onLockDevMode={handleLockDevMode}
          onOpenInstructions={() => setIsInstructionsOpen(true)}
          onOpenAdsSettings={() => setIsAdsSettingsOpen(true)}
          isLight={isLight}
        />
        {/* Instructions Modal within Admin Console */}
        <InstructionsModal
          isOpen={isInstructionsOpen}
          onClose={() => setIsInstructionsOpen(false)}
        />
      </div>
    );
  }

  // The app always renders the world-class learning platform directly.
  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors ${
      isLight 
        ? 'bg-slate-50 text-slate-900' 
        : 'bg-[#0B1120] text-slate-100'
    }`} dir={isRtl ? "rtl" : "ltr"}>
      {/* JINNA Executive Header */}
      <Header
        progress={progress}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenAdsSettings={() => setIsAdsSettingsOpen(true)}
        onToggleAiMentor={() => setIsAiMentorOpen(prev => !prev)}
        onOpenBooks={() => setIsBooksOpen(true)}
        onOpenIDE={() => setIsIdeOpen(true)}
        onOpenAdminPortal={() => {
          if (isDevMode) {
            setShowAdminConsole(true);
          } else {
            setIsAdminAuthOpen(true);
          }
        }}
        cloudSynced={isCloudSynced}
        isAdminUnlocked={isDevMode}
      />

      {/* edX / Coursera Style Accredited Diploma Banner */}
      <DiplomaBanner
        progress={progress}
        onOpenSyllabus={() => setIsSyllabusOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      {/* Mobile Top View Switcher (Puts Lesson on top or lets student browse chapters) */}
      <div className={`lg:hidden sticky top-[57px] z-30 px-3 py-2 border-b flex items-center justify-center gap-2 ${
        isLight ? 'bg-white/95 border-slate-200 shadow-xs' : 'bg-[#0E1017]/95 border-white/[0.08] shadow-md'
      }`}>
        <button
          onClick={() => {
            setMobileActiveTab('lesson');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            mobileActiveTab === 'lesson'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950/40'
              : isLight 
                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                : 'bg-[#151722] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>عرض الدرس</span>
        </button>
        <button
          onClick={() => setMobileActiveTab('sidebar')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            mobileActiveTab === 'sidebar'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/40'
              : isLight
                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                : 'bg-[#151722] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>فصول المنهج ({allChapters.length})</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chapters & Lessons Sidebar */}
        <div className={`w-full lg:w-84 xl:w-96 flex-shrink-0 ${mobileActiveTab === 'sidebar' ? 'block' : 'hidden lg:block'}`}>
          <Sidebar
            chapters={allChapters}
            currentChapterId={currentChapterId}
            currentLessonId={currentLessonId}
            progress={progress}
            onSelectLesson={handleSelectLesson}
            onOpenQuiz={(chapterId) => setActiveQuizChapterId(chapterId)}
            searchQuery={searchQuery}
            onOpenAdminPortal={() => {
              if (isDevMode) {
                setShowAdminConsole(true);
              } else {
                setIsAdminAuthOpen(true);
              }
            }}
          />
        </div>

        {/* Core Lesson Display & Code Playground */}
        <div id="lesson-scroll-target" className={`flex-1 min-w-0 ${mobileActiveTab === 'lesson' ? 'block' : 'hidden lg:block'}`}>
          <div key={currentLesson.id} className="w-full">
            <LessonView
              lesson={currentLesson}
              chapter={currentChapter}
              isCompleted={progress.completedLessons.includes(currentLesson.id)}
              onToggleComplete={handleToggleCompleteLesson}
              onOpenAiMentor={() => setIsAiMentorOpen(true)}
              onOpenNotes={() => setIsNotesOpen(true)}
              onOpenIDE={() => setIsIdeOpen(true)}
              onOpenBooks={() => setIsBooksOpen(true)}
              onNextLesson={handleNextLesson}
              onPrevLesson={handlePrevLesson}
              hasNext={hasNext}
              hasPrev={hasPrev}
              isLessonQuizPassed={isCurrentLessonQuizPassed}
              lessonQuizResult={progress.completedLessonQuizzes?.[currentLesson.id]}
              onOpenLessonQuiz={(lessonId) => setActiveLessonQuizId(lessonId)}
              isNextLessonLocked={isNextLessonLocked}
              nextLessonLockReason="يتطلب اجتياز اختبار استيعاب الدرس الحالي أولاً"
              adsConfig={adsConfig}
              onOpenAdsSettings={() => setIsAdsSettingsOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Slide-over AI Mentor Drawer */}
      <AiMentorDrawer
        isOpen={isAiMentorOpen}
        onClose={() => setIsAiMentorOpen(false)}
        currentLesson={currentLesson}
        currentChapter={currentChapter}
      />

      {/* Student Notes Drawer */}
      <StudentNotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        currentLesson={currentLesson}
        currentChapter={currentChapter}
      />

      {/* Diploma Curriculum & Roadmap Modal */}
      <DiplomaSyllabusModal
        isOpen={isSyllabusOpen}
        onClose={() => setIsSyllabusOpen(false)}
        onSelectChapter={(chapterId, lessonId) => {
          handleSelectLesson(chapterId, lessonId);
          setIsSyllabusOpen(false);
        }}
      />

      {/* Chapter Quiz Assessment Modal */}
      {activeQuizChapter && (
        <QuizModal
          chapter={activeQuizChapter}
          onClose={() => setActiveQuizChapterId(null)}
          onSaveScore={(score, total) => handleSaveQuizScore(activeQuizChapter.id, score, total)}
          initialPassed={progress.completedQuizzes[activeQuizChapter.id]?.passed}
        />
      )}

      {/* Individual Lesson Quiz Modal (Mandatory to unlock next lesson) */}
      {activeLessonForQuiz && (
        <LessonQuizModal
          isOpen={Boolean(activeLessonQuizId)}
          lesson={activeLessonForQuiz}
          chapterId={currentChapterId}
          onClose={() => setActiveLessonQuizId(null)}
          onPassLesson={(lessonId, score, total) => handlePassLessonQuiz(lessonId, score, total)}
          onGoToNextLesson={() => {
            setActiveLessonQuizId(null);
            if (hasNext) {
              const next = allLessonsFlat[currentIndex + 1];
              setCurrentChapterId(next.chapterId);
              setCurrentLessonId(next.lessonId);
              setMobileActiveTab('lesson');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          hasNextLesson={hasNext}
        />
      )}

      {/* Grand Academic Defense Exam for Certificate Modal */}
      <GrandDefenseExamModal
        isOpen={isGrandExamOpen}
        onClose={() => setIsGrandExamOpen(false)}
        onSaveGrandExamResult={handleSaveGrandExamResult}
        studentName={progress.studentName}
        previousResult={progress.grandExamResult}
      />

      {/* GPU & VRAM Memory Budgeter Modal */}
      <VramCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Certificate of Completion Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => {
          setIsCertificateOpen(false);
          setIsVerificationMode(false);
        }}
        progress={progress}
        onSaveName={handleSaveStudentName}
        initialVerificationMode={isVerificationMode}
        onOpenGrandExam={() => setIsGrandExamOpen(true)}
      />

      {/* Translated Books & Reference Library Modal */}
      <BooksLibraryModal
        isOpen={isBooksOpen}
        onClose={() => setIsBooksOpen(false)}
      />

      {/* Cloud AI Studio IDE Workstation for Big Projects */}
      <FullAiStudioIDE
        isOpen={isIdeOpen}
        onClose={() => setIsIdeOpen(false)}
      />

      {/* Admin Authentication & Control Center Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        isDevMode={isDevMode}
        onUnlockDevMode={handleUnlockDevMode}
        onLockDevMode={handleLockDevMode}
        onOpenAdsSettings={() => setIsAdsSettingsOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onOpenAdminConsole={() => {
          setIsAdminAuthOpen(false);
          setShowAdminConsole(true);
        }}
        adsConfig={adsConfig}
      />

      {/* Ads & Monetization Settings Modal */}
      <AdsControlModal
        isOpen={isAdsSettingsOpen}
        onClose={() => setIsAdsSettingsOpen(false)}
        config={adsConfig}
        onSaveConfig={handleSaveAdsConfig}
      />

      {/* Engineering Directives & System Standards Modal */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* PWA Offline Mode Indicator */}
      <OfflineIndicator />

      {/* Cybernetic Security & Anti-Inspection Shield */}
      <SecurityShield />

      {/* Interactive Cyber Ambient Mesh Background */}
      <InteractiveBackgroundMesh />

      {/* Global Interactive Click/Tap Wave & Sparkle Engine */}
      <InteractiveClickWave />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
