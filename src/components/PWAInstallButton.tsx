import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  theme?: 'dark' | 'light';
  variant?: 'badge' | 'button' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  theme = 'dark',
  variant = 'badge' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const isLight = theme === 'light';

  // If already running as an installed PWA, show a subtle active badge or return null
  if (isInstalled) {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border select-none ${
          isLight 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
        }`}
        title="أنت تستخدم تطبيق JINNA 5 المثبت كنسخة أصلية"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">تطبيق مثبت</span>
        <span className="sm:hidden">مثبت</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
          variant === 'banner'
            ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white hover:shadow-cyan-500/25 border border-cyan-400/30'
            : isLight
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-cyan-200/50'
            : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white border border-cyan-400/40 shadow-cyan-500/20'
        }`}
        title="تثبيت منصة JINNA 5 كتطبيق مستقل على شاشة هاتفك المحمول"
      >
        <div className="relative">
          <Smartphone className="w-3.5 h-3.5" />
          <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
          </span>
        </div>
        <span className="font-semibold">تثبيت كتطبيق</span>
        <Download className="w-3 h-3 opacity-80 group-hover:translate-y-0.5 transition-transform" />
      </button>

      {/* Guided Mobile Installation Modal for Android / iPhone */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0F101A] border border-cyan-500/40 p-6 text-right shadow-2xl space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>تثبيت JINNA 5 على هاتفك</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400">
                  تجربة تطبيق أصلي كامل الشاشة وسريع دون الحاجة لمتجر تطبيقات
                </p>
              </div>
            </div>

            {/* Platform instructions */}
            <div className="space-y-3">
              {/* Android (Chrome) */}
              <div className="p-3.5 rounded-xl bg-[#141624] border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                  <span>لهواتف أندرويد (Google Chrome):</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Android
                  </span>
                </div>
                {isInstallable ? (
                  <button
                    onClick={async () => {
                      const res = await install();
                      if (res) setShowGuideModal(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>انقر هنا لتثبيت التطبيق فوراً</span>
                  </button>
                ) : (
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pr-1 leading-relaxed">
                    <li>اضغط على قائمة المتصفح <strong>(نقاط الخيارات الثلاث ⋮)</strong> أعلى الشاشة.</li>
                    <li>اختر <strong>"تثبيت التطبيق" (Install App)</strong> أو <strong>"الإضافة إلى الشاشة الرئيسية"</strong>.</li>
                    <li>أكّد التثبيت ليظهر التطبيق فوراً بين تطبيقات هاتفك.</li>
                  </ol>
                )}
              </div>

              {/* iOS (Safari) */}
              <div className="p-3.5 rounded-xl bg-[#141624] border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                  <span>لهواتف آيفون وآيباد (Apple Safari):</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                    iOS
                  </span>
                </div>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pr-1 leading-relaxed">
                  <li className="flex items-center gap-1.5">
                    <span>1. انقر على زر <strong>المشاركة (Share)</strong></span>
                    <Share2 className="w-3.5 h-3.5 text-blue-400 inline" />
                    <span>في أسفل متصفح Safari.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span>2. مرر للأسفل واختر <strong>"إضافة إلى الشاشة الرئيسية"</strong></span>
                    <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" />
                  </li>
                  <li>3. انقر على <strong>"إضافة" (Add)</strong> في الزاوية العلوية.</li>
                </ol>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-around text-center">
              <div>
                <strong className="text-slate-200 block">شاشة كاملة</strong>
                <span>بدون شريط المتصفح</span>
              </div>
              <div className="w-px h-6 bg-white/[0.1]" />
              <div>
                <strong className="text-slate-200 block">سرعة استجابة</strong>
                <span>تخزين مسبق للموارد</span>
              </div>
              <div className="w-px h-6 bg-white/[0.1]" />
              <div>
                <strong className="text-slate-200 block">وصول فوري</strong>
                <span>أيقونة خاصة على هاتفك</span>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1B1D2C] hover:bg-[#23263A] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors"
            >
              فهمت، حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
