import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Preload lazy route/modal chunks while the preloader runs
    import('./Testimonials').catch(() => {});
    import('./BrahminModal').catch(() => {});

    // Smooth ~2.6 second preloader
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 85);

    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem('divine_vedic_visited', '1');
      } catch {
        // ignore storage errors
      }
      onComplete?.();
    }, 2600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] bg-[#FFF8EC] flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Large Rotating Chakra with Sacred Om Dead-Center */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-4">
        <motion.svg
          viewBox="0 0 200 200"
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-full h-full text-[#C8961E]/35 pointer-events-none select-none"
        >
          <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="100" cy="100" r="32" fill="none" stroke="currentColor" strokeWidth="2" />
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 22.5} 100 100)`}>
              <line x1="100" y1="22" x2="100" y2="68" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="100" cy="13" r="3.2" fill="currentColor" />
            </g>
          ))}
        </motion.svg>

        {/* Sacred Om Emblem Exact Center Inside Chakra */}
        <motion.div
          initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#FFF8EC] to-[#FBEBD0] border-2 border-[#C8961E] shadow-[0_8px_26px_rgba(230,81,0,0.22)] flex items-center justify-center"
        >
          <span className="font-heading text-4xl sm:text-5xl font-bold text-[#E65100] leading-none select-none">
            ॐ
          </span>
        </motion.div>
      </div>

      {/* Brand Name & Progress Bar Below */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="font-heading text-3xl sm:text-5xl font-bold text-[#4A1C0C] tracking-wider mb-1.5">
          Aaushman Puja
        </div>
        <p className="font-sans text-sm sm:text-base text-[#5D4037] mb-5">
          Authentic Vedic Rituals &amp; Sacred Ceremonies
        </p>

        <div className="w-56 h-1.5 bg-[#FBEBD0] rounded-full overflow-hidden border border-[#EBD5B0]">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            className="h-full bg-[#E65100] rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
