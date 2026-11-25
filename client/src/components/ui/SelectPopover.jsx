import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Flame, Search, X } from 'lucide-react';

export default function SelectPopover({
  triggerRef,
  options,
  value,
  activeIndex,
  onSelect,
  onClose,
  searchQuery,
  onSearchChange,
  showSearch,
  listboxId,
}) {
  const shouldReduceMotion = useReducedMotion();
  const popoverRef = useRef(null);
  const searchInputRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 300, openUpward: false });

  useEffect(() => {
    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 8;
      const maxHeight = showSearch ? 340 : 288;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUpward = spaceBelow < maxHeight && spaceAbove > spaceBelow;

      setCoords({
        left: rect.left,
        width: rect.width,
        top: openUpward ? rect.top - gap : rect.bottom + gap,
        openUpward,
      });
    };

    updatePosition();

    const handleOutsideClick = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    const handleScroll = (e) => {
      if (popoverRef.current && popoverRef.current.contains(e.target)) return;
      onClose();
    };

    const handleResize = () => onClose();

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    if (showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 20);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [triggerRef, onClose, showSearch]);

  return (
    <motion.div
      ref={popoverRef}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: coords.openUpward ? 6 : -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: coords.openUpward ? 6 : -6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        top: coords.openUpward ? 'auto' : `${coords.top}px`,
        bottom: coords.openUpward ? `${window.innerHeight - coords.top}px` : 'auto',
        zIndex: 100,
      }}
      className="bg-[#FFFFFF] border border-[#EBD5B0] rounded-[14px] shadow-[0_16px_40px_rgba(74,28,12,0.18)] overflow-hidden"
    >
      {showSearch ? (
        <div className="p-2 border-b border-[#EBD5B0] bg-[#FFF8EC]/60 flex items-center gap-2">
          <div className="relative flex items-center flex-1">
            <Search className="w-4 h-4 text-[#8D6E63] absolute left-2.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full h-9 pl-8 pr-3 rounded-lg bg-[#FFFFFF] border border-[#EBD5B0] text-sm text-[#4A1C0C] focus:outline-none focus:border-[#E65100]"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dropdown"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5D4037] hover:text-[#E65100] hover:bg-[#FBEBD0] bg-transparent border-none cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="px-3 py-1.5 border-b border-[#EBD5B0]/70 bg-[#FFF8EC]/60 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D6E63]">
            Select Option
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dropdown"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#5D4037] hover:text-[#E65100] hover:bg-[#FBEBD0] bg-transparent border-none cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <ul
        id={listboxId}
        role="listbox"
        className="max-h-[288px] overflow-y-auto py-1 m-0 list-none"
      >
        {options.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-[#8D6E63]">
            No puja found
          </li>
        ) : (
          options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isActive = idx === activeIndex;
            const IconComp = opt.icon || Flame;

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect(opt.value)}
                className={`min-h-[44px] px-3 py-2 flex items-center justify-between gap-2.5 cursor-pointer transition-colors border-l-4 ${
                  isSelected
                    ? 'bg-[#FFF1E0] text-[#E65100] border-[#E65100] font-semibold'
                    : isActive
                    ? 'bg-[#FBEBD0] text-[#4A1C0C] border-transparent'
                    : 'bg-transparent text-[#4A1C0C] hover:bg-[#FBEBD0] border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#E65100]' : 'text-[#C8961E]'}`} />
                  <div className="min-w-0">
                    <div className="text-sm font-bold leading-snug truncate">{opt.label}</div>
                    {opt.subtitle && (
                      <div className="text-xs text-[#8D6E63] font-medium truncate">{opt.subtitle}</div>
                    )}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#E65100] shrink-0" />}
              </li>
            );
          })
        )}
      </ul>
    </motion.div>
  );
}
