import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Max 1.2 seconds preloader on first visit per session
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 85);

    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem('divine_vedic_visited', '1');
      } catch {
        // ignore storage errors
      }
      onComplete?.();
    }, 1150);

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
      className="fixed inset-0 z-[99999] bg-[#FFF8EC] flex flex-col items-center justify-center p-6"
    >
      <div className="font-heading text-4xl sm:text-5xl font-bold text-[#4A1C0C] tracking-wider mb-2">
        Aaushman Puja
      </div>
      <p className="font-sans text-sm sm:text-base text-[#5D4037] mb-6 text-center">
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
    </motion.div>
  );
}
