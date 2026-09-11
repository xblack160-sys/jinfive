import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock, AlertTriangle, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SecurityShield: React.FC = () => {
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [screenshotAttempted, setScreenshotAttempted] = useState(false);
  const [securityToast, setSecurityToast] = useState<string | null>(null);

  // Show temporary toast notification
  const triggerToast = (msg: string) => {
    setSecurityToast(msg);
    setTimeout(() => {
      setSecurityToast(null);
    }, 2800);
  };

  useEffect(() => {
    // 1. Block Keyboard Shortcuts for Inspection & DevTools & Screenshots
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // F12 (Standard DevTools key)
      if (key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        triggerToast('⚠️ تم حظر مفتاح F12 لحماية الأصول والأكواد البرمجية');
        return false;
      }

      // PrintScreen / Screenshot Keys
      if (key === 'PrintScreen' || key === 'Snapshot') {
        e.preventDefault();
        // Clear clipboard immediately so screenshot buffer is wiped
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('').catch(() => {});
        }
        setScreenshotAttempted(true);
        triggerToast('🔒 تم حظر التقاط الشاشة (Screenshot Blocked) لحماية الخصوصية');
        setTimeout(() => setScreenshotAttempted(false), 1800);
        return false;
      }

      // Windows + Shift + S or Mac Command + Shift + 3/4
      if (ctrlOrMeta && e.shiftKey && (key === 'S' || key === 's' || key === '3' || key === '4')) {
        setScreenshotAttempted(true);
        triggerToast('🔒 تم حظر اختصارات تصوير الشاشة للحماية الأكاديمية');
        setTimeout(() => setScreenshotAttempted(false), 1800);
      }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools Inspect)
      if (ctrlOrMeta && e.shiftKey && (key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        triggerToast('🛡️ تم حظر فحص العناصر (Inspect Element Blocked)');
        return false;
      }

      // Ctrl+U (View Page Source)
      if (ctrlOrMeta && (key === 'u' || key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        triggerToast('🔒 تم حظر عرض السورس كود (View Source Blocked)');
        return false;
      }

      // Ctrl+S (Save Webpage)
      if (ctrlOrMeta && (key === 's' || key === 'S') && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        triggerToast('🛡️ تم حظر حفظ الصفحة محلياً (Save Blocked)');
        return false;
      }

      // Ctrl+P (Print Webpage) - allow only inside print dialogs handled specifically
      if (ctrlOrMeta && (key === 'p' || key === 'P')) {
        // If not printing certificate specifically, block it
        const certCard = document.getElementById('certificate-printable-card');
        if (!certCard) {
          e.preventDefault();
          e.stopPropagation();
          triggerToast('🔒 الطباعة العامة محظورة لحماية المحتوى');
          return false;
        }
      }
    };

    // 2. Block Right Click (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      // Don't block if user is clicking inside an editable input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      triggerToast('🔒 القائمة الجانبية معطلة لحماية المحتوى والامتحانات');
      return false;
    };

    // 3. DevTools Open Detection via Dimension / Timing Heuristics
    const checkDevTools = () => {
      // Dimension threshold test (when DevTools is docked to side or bottom)
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      // If window size is abnormal due to open DevTools dock
      if (widthThreshold || heightThreshold) {
        // Only trigger if not in standard mobile iframe view
        if (window.outerWidth > 600) {
          setDevToolsDetected(true);
        }
      } else {
        setDevToolsDetected(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('resize', checkDevTools);

    // Initial check
    checkDevTools();

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('resize', checkDevTools);
    };
  }, []);

  return (
    <>
      {/* Privacy Curtain on Screenshot Attempt */}
      <AnimatePresence>
        {screenshotAttempted && (
          <motion.div
            className="fixed inset-0 z-[99999] bg-black/98 flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <EyeOff className="w-16 h-16 text-cyan-400 mb-4 animate-pulse" />
            <h2 className="text-2xl font-black text-white mb-2">درع الخصوصية النشط</h2>
            <p className="text-slate-300 max-w-md text-sm font-medium">
              تم حجب الشاشة لمنع التقاط وتسريب المحتوى أو أسئلة الامتحانات وفق معايير النزاهة الأكاديمية لمنصة JINNA 5.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DevTools Lockout Warning (If DevTools is opened on Desktop) */}
      <AnimatePresence>
        {devToolsDetected && (
          <motion.div
            className="fixed inset-0 z-[99998] bg-[#070913]/96 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl select-none"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 shadow-2xl shadow-red-500/20">
              <ShieldAlert className="w-10 h-10 text-red-400 animate-bounce" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 mb-3">
              SECURITY SHIELD ACTIVE • JINNA 5
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
              تم رصد فتح أدوات التطوير والفحص (DevTools)
            </h2>

            <p className="text-slate-300 max-w-lg text-sm sm:text-base leading-relaxed mb-6">
              لحماية الملكية الفكرية، ومحاكيات الذاكرة، وبنك أسئلة الامتحانات، يُمنع فتح أدوات فحص الأكواد داخل المنصة.
              يرجى إغلاق نافذة الـ DevTools للمتابعة.
            </p>

            <button
              onClick={() => setDevToolsDetected(false)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              لقد أغلقت أدوات الفحص • استئناف
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Toast Alert for Blocked Actions */}
      <AnimatePresence>
        {securityToast && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-4 py-2.5 rounded-2xl bg-[#0F1424]/95 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-bold shadow-2xl shadow-cyan-500/20 flex items-center gap-2.5 backdrop-blur-md pointer-events-none"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
            <span>{securityToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
