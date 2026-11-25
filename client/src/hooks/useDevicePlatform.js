import { useState, useEffect } from 'react';

function detectPlatform() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'desktop';
  }
  const ua = navigator.userAgent || '';
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isDesktopWidth = window.innerWidth >= 1024;

  if (isIOS && (isCoarse || !isDesktopWidth)) return 'ios';
  if (isAndroid && isCoarse) return 'android';
  if (isAndroid && !isDesktopWidth) return 'android';
  if (!isCoarse && isDesktopWidth) return 'desktop';
  return isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';
}

export default function useDevicePlatform() {
  const [platform, setPlatform] = useState('desktop');

  useEffect(() => {
    setPlatform(detectPlatform());

    const handleResize = () => {
      const next = detectPlatform();
      setPlatform((prev) => {
        // Only switch between desktop and touch on resize
        if (prev === 'desktop' && next !== 'desktop') return next;
        if (prev !== 'desktop' && next === 'desktop') return 'desktop';
        return prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return platform;
}
