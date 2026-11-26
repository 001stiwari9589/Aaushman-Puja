import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingActions() {
  const waMessage = encodeURIComponent(
    'Namaste Pandit Ji! I would like to enquire about booking a Vedic Puja.'
  );

  return (
    <>
      {/* Mobile (<1024px): Fixed Bottom Left & Right Pill Buttons */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-5 pt-1 pointer-events-none"
        style={{ paddingBottom: 'calc(0.2rem + env(safe-area-inset-bottom))' }}
      >
        <div className="w-full flex items-center justify-between gap-4">
          <a
            href="tel:+919589018011"
            aria-label="Call Pandit Ji"
            className="pointer-events-auto min-w-[138px] h-11 px-5 rounded-full bg-[#E65100] hover:bg-[#BF360C] text-white font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(230,81,0,0.45)] border-2 border-white no-underline active:scale-95 transition-transform animate-vibrate"
          >
            <Phone className="w-4 h-4 text-white shrink-0" />
            <span>Call Now</span>
          </a>

          <a
            href={`https://wa.me/919589018011?text=${waMessage}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="pointer-events-auto min-w-[138px] h-11 px-5 rounded-full bg-[#25D366] hover:opacity-95 text-white font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.45)] border-2 border-white no-underline active:scale-95 transition-transform animate-vibrate"
            style={{ animationDelay: '0.4s' }}
          >
            <MessageCircle className="w-5 h-5 text-white shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Desktop (>=1024px): Fixed (Non-Movable) Vibrating Call Button */}
      <div
        className="hidden lg:block fixed left-6 z-30"
        style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        <a
          href="tel:+919589018011"
          aria-label="Call Pandit Ji"
          className="w-14 h-14 rounded-full bg-[#E65100] hover:bg-[#BF360C] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(230,81,0,0.45)] border-2 border-white transition-transform hover:scale-105 no-underline animate-vibrate"
        >
          <Phone className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Desktop (>=1024px): Fixed (Non-Movable) Vibrating WhatsApp Button */}
      <div
        className="hidden lg:block fixed right-6 z-30"
        style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        <a
          href={`https://wa.me/919589018011?text=${waMessage}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:opacity-95 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.45)] border-2 border-white transition-transform hover:scale-105 no-underline animate-vibrate"
          style={{ animationDelay: '0.4s' }}
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      </div>
    </>
  );
}
