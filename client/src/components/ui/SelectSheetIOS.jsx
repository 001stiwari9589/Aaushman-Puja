import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function SelectSheetIOS({
  label,
  options,
  value,
  onSelect,
  onClose,
  listboxId,
}) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 pb-20"
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[360px] max-h-[68dvh] bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#EBD5B0] flex flex-col overflow-hidden"
      >
        {/* Clean White Header with Close Button (Image 3 style) */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#EBD5B0] bg-[#FFFFFF] shrink-0">
          <span className="font-heading text-base font-bold text-[#4A1C0C]">
            {label || 'Choose a Vedic Puja'}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close puja list"
            className="w-8 h-8 rounded-full bg-[#FFF8EC] border border-[#EBD5B0] flex items-center justify-center text-[#4A1C0C] hover:border-[#E65100] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean White List with Radio Circle on Right */}
        <ul
          id={listboxId}
          role="listbox"
          className="flex-1 overflow-y-auto overscroll-contain m-0 p-0 list-none divide-y divide-[#F3E6D0] bg-[#FFFFFF]"
        >
          {options.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-[#8D6E63]">
              No puja found
            </li>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelect(opt.value)}
                  className={`px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#FFF8EC]' : 'bg-[#FFFFFF] hover:bg-[#FFF8EC]/50'
                  }`}
                >
                  <span
                    className={`font-sans text-sm leading-snug ${
                      isSelected ? 'font-bold text-[#E65100]' : 'font-medium text-[#4A1C0C]'
                    }`}
                  >
                    {opt.label}
                  </span>

                  <span
                    className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border-2 transition-colors ${
                      isSelected
                        ? 'bg-[#E65100] border-[#E65100] text-white'
                        : 'border-[#8D6E63]/50 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
