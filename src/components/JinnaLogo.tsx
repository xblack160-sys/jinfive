import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface JinnaLogoProps {
  theme?: 'dark' | 'light';
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const JinnaLogo: React.FC<JinnaLogoProps> = ({ 
  theme = 'dark', 
  collapsed = false,
  size = 'md'
}) => {
  const isLight = theme === 'light';
  const [clicked, setClicked] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  // Trigger interactive burst on click
  const handleClick = (e: React.MouseEvent) => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);

    // Create 8 micro particles shooting out
    const rect = e.currentTarget.getBoundingClientRect();
    const newSparks = Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * 40,
        y: Math.sin(angle) * 40,
        color: i % 2 === 0 ? '#06B6D4' : '#D946EF'
      };
    });
    setSparks(newSparks);
    setTimeout(() => setSparks([]), 800);
  };

  const emblemSizeClasses = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-16 h-16' : 'w-11 h-11 sm:w-12 sm:h-12';

  return (
    <motion.div 
      className="relative flex items-center gap-3 select-none cursor-pointer group"
      dir="ltr" // CRITICAL: Strict LTR isolation so RTL never flips "JINNA 5" into "A JINN 5"!
      onClick={handleClick}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* ==================== BRAND TYPOGRAPHY: JINNA 5 (ON THE LEFT) ==================== */}
      {!collapsed && (
        <div className="flex flex-col text-right items-end select-none" dir="ltr">
          <div className="flex items-center gap-2">
            {/* Official Diploma Pill Badge with Animated Pulse */}
            <motion.div 
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-xs"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
              </span>
              <span className="font-mono uppercase tracking-wider text-[9.5px]">AI Platform</span>
            </motion.div>

            {/* JINNA 5 Name - Exclusive Futuristic Cyber Holographic Display */}
            <div className="flex items-center text-2xl sm:text-3xl font-black tracking-tight font-sans relative group/name cursor-pointer">
              {/* JINNA Brand Typography with Letter-by-letter Hover & Micro Synapse Link */}
              <div className="flex items-center tracking-wider font-extrabold relative">
                {/* J */}
                <motion.span 
                  className={`inline-block transition-colors duration-300 ${isLight ? 'text-[#061838]' : 'text-white'}`}
                  whileHover={{ y: -3, scale: 1.12, color: '#38BDF8' }}
                >
                  J
                </motion.span>
                {/* I */}
                <motion.span 
                  className={`inline-block transition-colors duration-300 ${isLight ? 'text-[#061838]' : 'text-white'}`}
                  whileHover={{ y: -3, scale: 1.12, color: '#818CF8' }}
                >
                  I
                </motion.span>
                {/* N */}
                <motion.span 
                  className={`inline-block transition-colors duration-300 ${isLight ? 'text-[#061838]' : 'text-white'}`}
                  whileHover={{ y: -3, scale: 1.12, color: '#A855F7' }}
                >
                  N
                </motion.span>
                {/* N */}
                <motion.span 
                  className={`inline-block transition-colors duration-300 ${isLight ? 'text-[#061838]' : 'text-white'}`}
                  whileHover={{ y: -3, scale: 1.12, color: '#C084FC' }}
                >
                  N
                </motion.span>
                {/* A with Cyber Circuit Crossbar (Matching the original logo drawing) */}
                <motion.span 
                  className="relative inline-flex items-center justify-center transition-colors duration-300"
                  whileHover={{ y: -3, scale: 1.15 }}
                >
                  <span className={`${isLight ? 'text-[#061838]' : 'text-white'}`}>A</span>
                  {/* Cyber Bar Node shooting toward 5 */}
                  <span className="absolute -right-2 top-[58%] -translate-y-1/2 flex items-center pointer-events-none">
                    <span className="w-2.5 h-[2px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-sm" />
                    <span className="relative flex h-1.5 w-1.5 -ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-300" />
                    </span>
                  </span>
                </motion.span>
              </div>

              {/* Number 5 with Dynamic Aurora Gradient, Pulsing Glow, and Holographic Glint */}
              <motion.div 
                className="relative ml-3.5 inline-flex items-center justify-center select-none"
                whileHover={{ scale: 1.25, rotate: [0, -5, 5, 0] }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
              >
                {/* Ambient Radial Pulsing Light Behind 5 */}
                <motion.div
                  className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 blur-md pointer-events-none"
                  animate={{
                    scale: [0.9, 1.25, 0.9],
                    opacity: [0.5, 0.9, 0.5]
                  }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                />

                {/* The Animated Aurora 5 */}
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tighter bg-gradient-to-tr from-[#00E5FF] via-[#7C3AED] to-[#FF007A] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(0,229,255,0.7)]">
                  5
                </span>

                {/* Micro Quantum Sparkle Orbiting the 5 */}
                <motion.span 
                  className="absolute w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#00E5FF]"
                  animate={{
                    x: [8, -8, 8],
                    y: [-12, 12, -12],
                    opacity: [0.2, 1, 0.2]
                  }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>

          {/* Subtitles (Exact match from official logo) */}
          <div className="relative overflow-hidden flex flex-col text-right items-end text-[9.5px] leading-tight mt-1 font-bold tracking-wider group/sub">
            <span className={`tracking-widest ${isLight ? 'text-[#0A1E4A]' : 'text-slate-200'}`}>
              DIPLOMA IN ARTIFICIAL INTELLIGENCE
            </span>
            <span className="text-cyan-400 font-bold tracking-[0.2em] text-[8.5px] bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent">
              | LEARN FROM SCRATCH
            </span>
            {/* Ambient Laser Underline Sweep */}
            <span className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-cyan-400/80 via-fuchsia-400/50 to-transparent transform translate-x-full group-hover/sub:translate-x-0 transition-transform duration-700" />
          </div>
        </div>
      )}

      {/* ==================== THE EMBLEM WITH ENERGY AURA (ON THE RIGHT) ==================== */}
      <div className="relative flex-shrink-0">
        {/* Ambient Breathing Energy Aura (Cyan & Magenta Violet) */}
        <motion.div 
          className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#0284C7]/50 via-[#A855F7]/40 to-[#06B6D4]/50 blur-md pointer-events-none"
          animate={{ 
            opacity: [0.4, 0.85, 0.4],
            scale: [0.95, 1.1, 0.95]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        />

        {/* Rotating Orbital Tech Ring */}
        <motion.div
          className="absolute -inset-1.5 rounded-2xl border border-cyan-400/30 border-dashed pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        />

        {/* The Emblem Image Container */}
        <motion.div 
          className={`relative ${emblemSizeClasses} rounded-2xl flex items-center justify-center p-1 border transition-all overflow-hidden shadow-xl ${
            isLight 
              ? 'bg-white/95 border-cyan-500/40 shadow-cyan-500/10' 
              : 'bg-[#080D1A]/95 border-cyan-500/50 shadow-black/80'
          }`}
          animate={clicked ? { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Exact Logo Emblem from Image */}
          <img 
            src="/jinna-emblem.png" 
            alt="JINNA 5 Emblem" 
            className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback to full logo if needed
              (e.currentTarget as HTMLImageElement).src = '/jinna-logo.png';
            }}
          />

          {/* Shimmering Light Sweep Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          />
        </motion.div>

        {/* Sparkle Particles on Click */}
        <AnimatePresence>
          {sparks.map(s => (
            <motion.span
              key={s.id}
              className="absolute w-2 h-2 rounded-full pointer-events-none z-50 shadow-md"
              style={{ backgroundColor: s.color, left: '50%', top: '50%' }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: s.x, y: s.y, scale: 0, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
