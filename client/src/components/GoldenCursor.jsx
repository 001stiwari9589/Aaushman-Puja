import React, { useEffect, useState } from 'react';

export default function GoldenCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isSmall = window.matchMedia('(max-width: 1023px)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || isSmall || prefersReduced) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleInteractiveOver = (e) => {
      setIsHovered(Boolean(e.target.closest('button, a, input, select, textarea, [role="button"]')));
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleInteractiveOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleInteractiveOver);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let animId;
    const follow = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(follow);
    };
    animId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animId);
  }, [position, enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <>
      <div
        className="custom-cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.5 : 1})`,
        }}
      />
      <div
        className="custom-cursor-ring"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.35 : 1})`,
          borderColor: isHovered ? '#E65100' : 'rgba(200, 150, 30, 0.55)',
          background: isHovered ? 'rgba(230, 81, 0, 0.08)' : 'transparent',
        }}
      />
    </>
  );
}
