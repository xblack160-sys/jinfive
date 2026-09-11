import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Wave {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
}

export const InteractiveClickWave: React.FC = () => {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      // Generate colorful wave ID
      const waveId = Date.now() + Math.random();
      const colors = ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];

      const newWave: Wave = {
        id: waveId,
        x: clientX,
        y: clientY,
        color: chosenColor,
      };

      setWaves((prev) => [...prev.slice(-4), newWave]);

      // Generate 5 mini sparks around click
      const newParticles: Particle[] = Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * (360 / 5) * Math.PI) / 180 + Math.random() * 0.4;
        const dist = 24 + Math.random() * 26;
        return {
          id: waveId + i + 1,
          x: clientX,
          y: clientY,
          targetX: clientX + Math.cos(angle) * dist,
          targetY: clientY + Math.sin(angle) * dist,
          color: chosenColor,
        };
      });

      setParticles((prev) => [...prev.slice(-10), ...newParticles]);

      // Clear wave after 600ms
      setTimeout(() => {
        setWaves((prev) => prev.filter((w) => w.id !== waveId));
      }, 650);

      // Clear particles after 500ms
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
      }, 500);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99990] overflow-hidden">
      {/* Shockwave Rings on Click */}
      <AnimatePresence>
        {waves.map((wave) => (
          <React.Fragment key={wave.id}>
            {/* Inner Fast Ring */}
            <motion.div
              className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 border-2"
              style={{
                left: wave.x,
                top: wave.y,
                borderColor: wave.color,
                boxShadow: `0 0 16px ${wave.color}`,
              }}
              initial={{ width: 0, height: 0, opacity: 0.9, scale: 0.5 }}
              animate={{ width: 80, height: 80, opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            {/* Outer Soft Glow Halo */}
            <motion.div
              className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                left: wave.x,
                top: wave.y,
                background: `radial-gradient(circle, ${wave.color}40 0%, transparent 70%)`,
              }}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 140, height: 140, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* Bursting Sparks */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              left: p.x,
              top: p.y,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              width: 4,
              height: 4,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              left: p.targetX,
              top: p.targetY,
              opacity: 0,
              scale: 0.2,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
