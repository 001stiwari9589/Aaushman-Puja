import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Flame, Search } from 'lucide-react';

export default function SelectSheetIOS({
  options,
  value,
  onSelect,
  onClose,
  searchQuery,
  onSearchChange,
  showSearch,
  listboxId,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [initialValue] = useState(value);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleCancel = () => {
    onSelect(initialValue, false);
    onClose();
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/35 flex items-end justify-center"
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
        animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag={shouldReduceMotion ? false : 'y'}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 90 || info.velocity.y > 400) {
            onClose();
          }
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        }}
        className="w-full max-h-[72dvh] bg-white/90 rounded-t-[14px] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* iOS Small Grey Grabber */}
        <div className="pt-2 pb-1 flex justify-center shrink-0">
          <div className="w-9 h-1 rounded-full bg-[#C7C7CC]" />
        </div>

        {/* iOS Picker Top Bar */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#E5E5EA] shrink-0">
          <button
            type="button"
            onClick={handleCancel}
            className="min-h-[44px] px-2 text-base font-normal text-[#8E8E93] bg-transparent border-none cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDone}
            className="min-h-[44px] px-2 text-base font-bold text-[#E65100] bg-transparent border-none cursor-pointer"
          >
            Done
          </button>
        </div>

        {showSearch && (
          <div className="px-4 py-2 border-b border-[#E5E5EA] shrink-0">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#F2F2F7] border border-transparent text-[16px] text-[#4A1C0C] focus:outline-none focus:border-[#E65100]"
              />
            </div>
          </div>
        )}

        {/* Inset Grouped List */}
        <ul
          id={listboxId}
          role="listbox"
          className="flex-1 overflow-y-auto overscroll-contain m-0 p-0 list-none divide-y divide-[#E5E5EA]"
        >
          {options.length === 0 ? (
            <li className="px-4 py-8 text-center text-base text-[#8D6E63]">
              No puja found
            </li>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              const IconComp = opt.icon || Flame;

              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelect(opt.value, false)}
                  className={`min-h-[52px] px-4 py-2 flex items-center justify-between gap-3 cursor-pointer active:bg-[#F2F2F7] transition-colors ${
                    isSelected ? 'bg-[#FFF1E0]/70' : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#E65100]' : 'text-[#C8961E]'}`} />
                    <div className="min-w-0">
                      <div className={`text-[16px] font-bold truncate ${isSelected ? 'text-[#E65100]' : 'text-[#4A1C0C]'}`}>
                        {opt.label}
                      </div>
                      {opt.subtitle && (
                        <div className="text-xs text-[#8D6E63] truncate">{opt.subtitle}</div>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#E65100] shrink-0" />}
                </li>
              );
            })
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
