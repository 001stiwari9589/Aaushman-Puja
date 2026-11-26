import React, { useRef, useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

function useHoldDrag() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const stateRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    const onMouseMove = (e) => {
      const s = stateRef.current;
      if (!s.active) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      if (!s.moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        s.moved = true;
        setIsDragging(true);
      }
      if (s.moved) {
        setPos({ x: s.originX + dx, y: s.originY + dy });
      }
    };

    const stopDrag = () => {
      if (!stateRef.current.active) return;
      stateRef.current.active = false;
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('blur', stopDrag);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('blur', stopDrag);
    };
  }, []);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    stateRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    };
  };

  const wasDragged = () => stateRef.current.moved;

  return { pos, isDragging, onMouseDown, wasDragged };
}

export default function FloatingActions() {
  const shouldReduceMotion = useReducedMotion();
  const callDrag = useHoldDrag();
  const waDrag = useHoldDrag();

  const waMessage = encodeURIComponent(
    'Namaste Pandit Ji! I would like to enquire about booking a Vedic Puja.'
  );

  return (
    <>
      {/* Mobile (<1024px): Fixed Bottom Side-by-Side Call & WhatsApp Pill Buttons */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-5 pt-1 pointer-events-none"
        style={{ paddingBottom: 'calc(0.45rem + env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-md mx-auto flex items-center gap-3">
          <a
            href="tel:+919589018011"
            aria-label="Call Pandit Ji"
            className={`pointer-events-auto flex-1 h-11 rounded-full bg-[#E65100] hover:bg-[#BF360C] text-white font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(230,81,0,0.45)] border-2 border-white no-underline active:scale-95 transition-transform ${
              shouldReduceMotion ? '' : 'animate-vibrate'
            }`}
          >
            <Phone className="w-4 h-4 text-white shrink-0" />
            <span>Call Now</span>
          </a>

          <a
            href={`https://wa.me/919589018011?text=${waMessage}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className={`pointer-events-auto flex-1 h-11 rounded-full bg-[#25D366] hover:opacity-95 text-white font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(37,211,102,0.45)] border-2 border-white no-underline active:scale-95 transition-transform ${
              shouldReduceMotion ? '' : 'animate-vibrate'
            }`}
            style={shouldReduceMotion ? undefined : { animationDelay: '0.4s' }}
          >
            <MessageCircle className="w-5 h-5 text-white shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Desktop (>=1024px): Hold-and-Drag Movable & Vibrating Call Button (No Hover Tooltip) */}
      <div
        onMouseDown={callDrag.onMouseDown}
        className={`hidden lg:block fixed left-6 z-30 select-none ${
          callDrag.isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          bottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
          transform: `translate3d(${callDrag.pos.x}px, ${callDrag.pos.y}px, 0)`,
        }}
      >
        <button
          type="button"
          aria-label="Call Pandit Ji"
          onClick={() => {
            if (!callDrag.wasDragged()) {
              window.location.href = 'tel:+919589018011';
            }
          }}
          className={`w-14 h-14 rounded-full bg-[#E65100] hover:bg-[#BF360C] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(230,81,0,0.45)] border-2 border-white transition-transform hover:scale-105 cursor-inherit ${
            shouldReduceMotion || callDrag.isDragging ? '' : 'animate-vibrate'
          }`}
        >
          <Phone className="w-6 h-6 text-white pointer-events-none" />
        </button>
      </div>

      {/* Desktop (>=1024px): Hold-and-Drag Movable & Vibrating WhatsApp Button (No Hover Tooltip) */}
      <div
        onMouseDown={waDrag.onMouseDown}
        className={`hidden lg:block fixed right-6 z-30 select-none ${
          waDrag.isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          bottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
          transform: `translate3d(${waDrag.pos.x}px, ${waDrag.pos.y}px, 0)`,
        }}
      >
        <button
          type="button"
          aria-label="Chat on WhatsApp"
          onClick={() => {
            if (!waDrag.wasDragged()) {
              window.open(`https://wa.me/919589018011?text=${waMessage}`, '_blank', 'noopener,noreferrer');
            }
          }}
          className={`w-14 h-14 rounded-full bg-[#25D366] hover:opacity-95 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.45)] border-2 border-white transition-transform hover:scale-105 cursor-inherit ${
            shouldReduceMotion || waDrag.isDragging ? '' : 'animate-vibrate'
          }`}
          style={shouldReduceMotion || waDrag.isDragging ? undefined : { animationDelay: '0.4s' }}
        >
          <MessageCircle className="w-7 h-7 text-white pointer-events-none" />
        </button>
      </div>
    </>
  );
}
