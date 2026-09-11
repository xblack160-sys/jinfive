import React, { useEffect } from 'react';
import { Megaphone, ExternalLink, Settings, Sparkles } from 'lucide-react';
import { AdsConfig } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AdSlotProps {
  config: AdsConfig;
  slotType: 'lesson' | 'bottom';
  onOpenSettings?: () => void;
  showAdminControls?: boolean;
}

export const AdSlot: React.FC<AdSlotProps> = ({ 
  config, 
  slotType, 
  onOpenSettings,
  showAdminControls = false 
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // If ads are completely disabled globally, render nothing
  if (!config.enabled) {
    return null;
  }

  // Check if slot type is enabled
  if (slotType === 'lesson' && !config.showLessonAd) return null;
  if (slotType === 'bottom' && !config.showBottomAd) return null;

  // Real AdSense script injection if publisherId is provided and not strictly in testMode
  useEffect(() => {
    if (config.enabled && !config.testMode && config.publisherId && config.publisherId.startsWith('ca-pub-')) {
      try {
        const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }

        // Trigger adsbygoogle push
        const win = window as unknown as { adsbygoogle?: unknown[] };
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
      } catch (err) {
        console.warn('AdSense execution hint:', err);
      }
    }
  }, [config.enabled, config.testMode, config.publisherId, config.adSlotId]);

  // Live Google AdSense Container
  if (!config.testMode && config.publisherId && config.publisherId.startsWith('ca-pub-')) {
    return (
      <div className={`my-4 p-3 rounded-xl border text-center overflow-hidden transition-all ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0E0F14] border-white/[0.06]'
      }`}>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-1">
          <span className="flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-cyan-400" />
            <span>مساحة إعلانية معتمدة (Google AdSense)</span>
          </span>
          {showAdminControls && onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px]"
            >
              <Settings className="w-2.5 h-2.5" />
              <span>إدارة الإعلانات</span>
            </button>
          )}
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: slotType === 'bottom' ? '90px' : '100px' }}
          data-ad-client={config.publisherId}
          data-ad-slot={config.adSlotId || undefined}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Preview / Partner / Test Slot (Before AdSense approval or while testing)
  return (
    <div className={`my-4 p-3.5 sm:p-4 rounded-xl border transition-all ${
      isLight 
        ? 'bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-cyan-50/70 border-blue-200/80 shadow-xs text-slate-800' 
        : 'bg-gradient-to-r from-[#0D121F] via-[#101426] to-[#0D151E] border-cyan-500/20 text-slate-200 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 mt-0.5 sm:mt-0 ${
            isLight ? 'bg-blue-100 text-blue-700' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                isLight ? 'bg-blue-200/70 text-blue-800' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                إعلان برعاية الذكاء الاصطناعي
              </span>
              <span className="text-[10px] text-slate-500">
                {config.testMode ? 'وضع التجربة (Test Mode)' : 'مساحة جاهزة للربح'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold mt-1">
              مخدمات الذكاء الاصطناعي واستئجار كروت الشاشة GPU بنقرة واحدة
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              خصومات حصرية لطلاب منصة JINNA 5 لتشغيل نماذج Llama 3 و DeepSeek بأعلى سرعة معالجة.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {showAdminControls && onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700' 
                  : 'bg-[#151722] hover:bg-[#1E2130] border-white/[0.1] text-slate-300'
              }`}
              title="لوحة تحكم وتفعيل/إلغاء الإعلانات (خاص بالمهندس يوسف)"
            >
              <Settings className="w-3.5 h-3.5 text-cyan-400" />
              <span>تحكم الإعلانات</span>
            </button>
          )}

          <a
            href="https://runpod.io"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ${
              isLight
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
            }`}
          >
            <span>استكشف السيرفرات</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
