import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Flame, Search } from 'lucide-react';

export default function SelectSheetAndroid({
  label,
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

  // Android hardware back button closes sheet via history state + body scroll lock
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.history.pushState({ androidSheet: true }, '');
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.androidSheet) {
        window.history.back();
      }
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/40 flex items-end justify-center"
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
        animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 340 }}
        drag={shouldReduceMotion ? false : 'y'}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 90 || info.velocity.y > 400) {
            onClose();
          }
        }}
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}
        className="w-full max-h-[70dvh] bg-[#FFFFFF] rounded-t-[28px] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Material 3 Drag Handle */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-9 h-1 rounded-full bg-[#8D6E63]/40" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#EBD5B0] shrink-0">
          <h3 className="font-heading text-lg font-bold text-[#4A1C0C] m-0">
            {label || 'Select Option'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close options"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#5D4037] active:bg-[#E65100]/12 bg-transparent border-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showSearch && (
          <div className="px-4 py-2.5 border-b border-[#EBD5B0] bg-[#FFF8EC]/60 shrink-0">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#8D6E63] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#FFFFFF] border border-[#EBD5B0] text-base text-[#4A1C0C] focus:outline-none focus:border-[#E65100]"
              />
            </div>
          </div>
        )}

        {/* Scrollable Option List */}
        <ul
          id={listboxId}
          role="listbox"
          className="flex-1 overflow-y-auto overscroll-contain m-0 p-0 list-none"
        >
          {options.length === 0 ? (
            <li className="px-5 py-8 text-center text-base text-[#8D6E63]">
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
                  onClick={() => onSelect(opt.value)}
                  className={`min-h-[56px] w-full px-5 py-2 flex items-center justify-between gap-3 cursor-pointer active:bg-[#E65100]/12 transition-colors ${isSelected ? 'bg-[#FFF1E0]' : 'bg-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#FFF1E0] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5 text-[#E65100]" />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-[16px] font-bold truncate ${isSelected ? 'text-[#E65100]' : 'text-[#4A1C0C]'}`}>
                        {opt.label}
                      </div>
                      {opt.subtitle && (
                        <div className="text-xs text-[#8D6E63] truncate">{opt.subtitle}</div>
                      )}
                    </div>
                  </div>

                  {/* Material Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#E65100]' : 'border-[#8D6E63]/60'
                      }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#E65100]" />}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
