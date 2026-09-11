import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface LanguageToggleProps {
  compact?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ compact = false }) => {
  const { language, toggleLanguage } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 cursor-pointer ${
        isLight
          ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 shadow-xs'
          : 'bg-[#151622] hover:bg-[#1E2032] text-cyan-300 border-white/[0.1] hover:border-cyan-400/40 shadow-sm'
      }`}
      title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-cyan-400" />
      <span className="font-mono font-bold tracking-wider">
        {language === 'ar' ? 'EN' : 'عربي'}
      </span>
      {!compact && (
        <span className="hidden lg:inline text-[10px] text-slate-400 font-normal">
          {language === 'ar' ? 'English' : 'العربية'}
        </span>
      )}
    </button>
  );
};
