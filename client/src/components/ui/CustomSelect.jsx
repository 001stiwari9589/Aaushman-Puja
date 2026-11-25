import React, { useState, useRef, useId, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Flame, X } from 'lucide-react';
import useDevicePlatform from '../../hooks/useDevicePlatform';
import SelectPopover from './SelectPopover';
import SelectSheetAndroid from './SelectSheetAndroid';
import SelectSheetIOS from './SelectSheetIOS';

export function CustomSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select your puja',
  error,
  required = false,
  name,
  id,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef(null);
  const typeAheadRef = useRef({ buffer: '', timer: null });
  const generatedId = useId();
  const selectId = id || `custom-select-${generatedId}`;
  const listboxId = `${selectId}-listbox`;
  const platform = useDevicePlatform();
  const shouldReduceMotion = useReducedMotion();

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  const showSearch = options.length > 6;

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subtitle && o.subtitle.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setActiveIndex(-1);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const handleSelect = useCallback(
    (newVal, shouldClose = true) => {
      onChange?.(newVal);
      if (shouldClose) {
        closeMenu();
      }
    },
    [onChange, closeMenu]
  );

  const openMenu = () => {
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
    setIsOpen(true);
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (isOpen) setIsOpen(false);
      return;
    }

    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          filteredOptions.length === 0 ? -1 : (prev + 1) % filteredOptions.length
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) =>
          filteredOptions.length === 0
            ? -1
            : (prev - 1 + filteredOptions.length) % filteredOptions.length
        );
        break;
      case 'Home':
        e.preventDefault();
        if (filteredOptions.length > 0) setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        if (filteredOptions.length > 0) setActiveIndex(filteredOptions.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          handleSelect(filteredOptions[activeIndex].value);
        }
        break;
      default:
        // Type-ahead letters
        if (e.key.length === 1 && /\S/.test(e.key) && !showSearch) {
          clearTimeout(typeAheadRef.current.timer);
          typeAheadRef.current.buffer += e.key.toLowerCase();
          const matchIdx = filteredOptions.findIndex((o) =>
            o.label.toLowerCase().startsWith(typeAheadRef.current.buffer)
          );
          if (matchIdx >= 0) setActiveIndex(matchIdx);
          typeAheadRef.current.timer = setTimeout(() => {
            typeAheadRef.current.buffer = '';
          }, 500);
        }
        break;
    }
  };

  const SelectedIcon = selectedOption?.icon || Flame;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={selectId} className="vedic-label">
          {label}
        </label>
      )}

      {/* Visually hidden native select for form compatibility & autofill */}
      <select
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        value={value || ''}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
        className="sr-only"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom Combobox Trigger */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={`w-full min-h-[48px] px-4 py-2.5 rounded-[12px] bg-[#FFFFFF] border text-left text-[16px] font-sans flex items-center justify-between gap-2 transition-all cursor-pointer outline-none ${error
            ? 'border-red-600 focus:ring-2 focus:ring-red-200'
            : isOpen
              ? 'border-[#E65100] ring-[3px] ring-[#E65100]/15'
              : 'border-[#EBD5B0] focus:border-[#E65100] focus:ring-[3px] focus:ring-[#E65100]/15'
          }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {selectedOption && (
            <SelectedIcon className="w-4 h-4 text-[#E65100] shrink-0" />
          )}
          <span className={`truncate ${selectedOption ? 'text-[#4A1C0C] font-bold' : 'text-[#8D6E63] font-medium'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0">
          {selectedOption && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear selection"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.('');
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#8D6E63] hover:text-[#E65100] hover:bg-[#FBEBD0] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <motion.span
            animate={shouldReduceMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.18 }}
            className="text-[#8D6E63] flex items-center"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </span>
      </button>

      {error && <p className="text-red-600 text-xs mt-1 font-medium">{error}</p>}

      {/* Portal Dropdown / Bottom Sheet */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && platform === 'desktop' && (
              <SelectPopover
                triggerRef={triggerRef}
                options={filteredOptions}
                value={value}
                activeIndex={activeIndex}
                onSelect={(val) => handleSelect(val, true)}
                onClose={closeMenu}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showSearch={showSearch}
                listboxId={listboxId}
              />
            )}
            {isOpen && platform === 'android' && (
              <SelectSheetAndroid
                label={label}
                options={filteredOptions}
                value={value}
                onSelect={(val) => handleSelect(val, true)}
                onClose={closeMenu}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showSearch={showSearch}
                listboxId={listboxId}
              />
            )}
            {isOpen && platform === 'ios' && (
              <SelectSheetIOS
                options={filteredOptions}
                value={value}
                onSelect={handleSelect}
                onClose={closeMenu}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showSearch={showSearch}
                listboxId={listboxId}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

export const PujaSelect = CustomSelect;
export default CustomSelect;
