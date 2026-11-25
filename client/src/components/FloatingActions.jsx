import React, { useEffect, useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

export default function FloatingActions() {
  const shouldReduceMotion = useReducedMotion();
  const [pulsing, setPulsing] = useState(true);

  useEffect(() => {
    if (shouldReduceMotion) {
      setPulsing(false);
      return;
    }
    const timer = setTimeout(() => setPulsing(false), 10000);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  const waMessage = encodeURIComponent(
    'Namaste Pandit Ji! I would like to enquire about booking a Vedic Puja.'
  );

  return (
    <>
      {/* Fixed Bottom-Left Call Button (56px circle) */}
      <div
        className="fixed left-4 z-30 group"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <span className="hidden lg:block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#3B1208] text-[#FFF1D6] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md">
          Call +91 9589018011
        </span>
        <a
          href="tel:+919589018011"
          aria-label="Call Pandit Ji"
          className={`w-14 h-14 rounded-full bg-[#E65100] hover:bg-[#BF360C] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(230,81,0,0.45)] border-2 border-white transition-transform hover:scale-105 no-underline ${
            pulsing ? 'animate-pulse' : ''
          }`}
        >
          <Phone className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Fixed Bottom-Right WhatsApp Button (56px circle) */}
      <div
        className="fixed right-4 z-30 group"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <span className="hidden lg:block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#3B1208] text-[#FFF1D6] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md">
          Chat on WhatsApp
        </span>
        <a
          href={`https://wa.me/919589018011?text=${waMessage}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className={`w-14 h-14 rounded-full bg-[#25D366] hover:opacity-95 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.45)] border-2 border-white transition-transform hover:scale-105 no-underline ${
            pulsing ? 'animate-pulse' : ''
          }`}
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      </div>
    </>
  );
}
