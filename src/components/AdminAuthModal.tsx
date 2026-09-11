import React, { useState } from 'react';
import { 
  X, Lock, KeyRound, Eye, EyeOff, ShieldAlert, CheckCircle2, 
  Crown, Terminal, DollarSign, Download, LayoutDashboard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDevMode: boolean;
  onUnlockDevMode: (pin: string) => boolean;
  onLockDevMode: () => void;
  onOpenAdsSettings: () => void;
  onOpenAdminConsole?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  isDevMode,
  onUnlockDevMode,
  onLockDevMode,
  onOpenAdsSettings,
  onOpenAdminConsole
}) => {
  const { theme } = useTheme();
  const { language, isRtl } = useLanguage();
  const isLight = theme === 'light';

  const [enteredPin, setEnteredPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  if (!isOpen) return null;

  const handleSubmitPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const success = onUnlockDevMode(enteredPin.trim());
    if (success) {
      setSuccessAnimation(true);
      setTimeout(() => {
        setSuccessAnimation(false);
        setEnteredPin('');
      }, 900);
    } else {
      // Secure, discreet error message with ZERO credentials or hint leak
      setErrorMessage(
        language === 'en'
          ? 'Invalid master passcode. Access restricted to authorized personnel.'
          : 'رمز الدخول السري غير صحيح! تم رفض الوصول.'
      );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className={`relative w-full max-w-md rounded-2xl border shadow-2xl p-6 transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0F0F14] border-white/10 text-slate-100'
      }`}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-3 rounded-xl border ${
            isDevMode 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}>
            {isDevMode ? <Crown className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif flex items-center gap-2">
              <span>{language === 'en' ? 'Administration Console' : 'لوحة التحكم الإدارية'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                JINNA 5 Core
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'en'
                ? 'Engineering Control Enclave — Eng. Yousuf Albaz'
                : 'خاصة بالمهندس المؤسس يوسف الباز (Automation Ai Yousuf Albaz)'}
            </p>
          </div>
        </div>

        {/* State 1: Already Authenticated as Admin */}
        {isDevMode ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">
                  {language === 'en' ? 'Full administrative & root access granted!' : 'أنت متصل الآن بصلاحيات الإدارة والتحكم الكامل!'}
                </p>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  {language === 'en'
                    ? 'All admin telemetry, monetisation, and API switches are now active in the header.'
                    : 'كافة أزرار التحكم والإعلانات والـ API مفعلة لك في الشريط العلوي.'}
                </p>
              </div>
            </div>

            {/* Quick Admin Actions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">
                {language === 'en' ? 'Administrative Access Shortcuts:' : 'الوصول السريع للأدوات الإدارية:'}
              </p>

              {/* JINNA Cloud Console Direct Launcher */}
              {onOpenAdminConsole && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminConsole();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-cyan-900/60 via-blue-900/50 to-indigo-900/60 hover:from-cyan-800/70 hover:to-indigo-800/70 border border-cyan-500/40 text-xs transition-all shadow-md group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{language === 'en' ? 'Open Cloud Operations Dashboard' : 'فتح لوحة القيادة السحابية (Cloud Console)'}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-mono">LIVE</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5">
                        {language === 'en'
                          ? 'Real-time student telemetry, server monitoring & JINNA 5 inference testing'
                          : 'إحصائيات الطلاب الحية، مراقبة الخادم، وتجربة ذكاء JINNA 5'}
                      </div>
                    </div>
                  </div>
                  <LayoutDashboard className={`w-4 h-4 text-cyan-300 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onClose(); onOpenAdsSettings(); }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#14141E] hover:bg-[#1A1A28] border border-white/5 text-xs transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <div className="font-bold text-slate-200">
                      {language === 'en' ? 'AdSense & Ads' : 'إعلانات Google'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {language === 'en' ? 'Monetization controls' : 'التحكم في المساحات الإعلانية'}
                    </div>
                  </div>
                </button>

                <a
                  href="/jinna5_source_code.zip"
                  download="jinna5_source_code.zip"
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#14141E] hover:bg-[#1A1A28] border border-white/5 text-xs transition-colors"
                >
                  <Download className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <div className="font-bold text-slate-200">
                      {language === 'en' ? 'Export Code ZIP' : 'تحميل الكود (ZIP)'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {language === 'en' ? 'Full codebase archive' : 'نسخة كاملة ومفتوحة المصدر'}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Lock / Exit Admin Button */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  onLockDevMode();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {language === 'en'
                    ? 'Lock Console & Return to Student View'
                    : 'قفل لوحة التحكم والتحول لوضع الطالب العادي'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* State 2: Locked - Needs PIN */
          <form onSubmit={handleSubmitPin} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-200/90 text-xs">
              <div className="flex items-center gap-2 font-bold mb-1 text-amber-300">
                <ShieldAlert className="w-4 h-4" />
                <span>{language === 'en' ? 'Restricted Engineering Area' : 'منطقة محظورة للزوار والطلاب'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {language === 'en'
                  ? 'Access strictly restricted to Eng. Yousuf Albaz. Enter your master authorization key to unlock platform controls.'
                  : 'لوحة التحكم الإدارية مخصصة فقط للمهندس يوسف الباز. يرجى إدخال الرمز السري المعتمد لفتح أدوات التحكم والإعلانات والـ API.'}
              </p>
            </div>

            {/* Pin Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'en' ? 'Master Passcode:' : 'رمز الدخول السري (Master Passcode):'}</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder={language === 'en' ? 'Enter master passcode...' : 'أدخل الرمز السري هنا...'}
                  autoFocus
                  className={`w-full ${isRtl ? 'px-3.5 pr-3.5 pl-10' : 'px-3.5 pl-3.5 pr-10'} py-2.5 rounded-xl bg-[#14141E] border border-white/10 text-sm font-mono tracking-widest text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-500/30 flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successAnimation && (
              <div className="text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Authentication verified! Launching administration console...'
                    : 'تم تأكيد الرمز بنجاح! جاري فتح لوحة التحكم...'}
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{language === 'en' ? 'Authorize & Unlock Console' : 'تسجيل الدخول والتحكم بالمنصة'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
