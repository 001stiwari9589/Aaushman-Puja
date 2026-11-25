import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const BookingPopupContext = createContext();

export function BookingPopupProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedPuja, setPreselectedPuja] = useState('');
  const [pagePreselectedPuja, setPagePreselectedPuja] = useState('');
  const triggerElementRef = useRef(null);

  const openBookingPopup = useCallback((pujaName = '') => {
    triggerElementRef.current = document.activeElement;
    const cleanName = typeof pujaName === 'string' ? pujaName : '';
    setPreselectedPuja(cleanName);
    if (cleanName) {
      setPagePreselectedPuja(cleanName);
    }
    setIsOpen(true);
  }, []);

  const closeBookingPopup = useCallback(() => {
    setIsOpen(false);
    const el = triggerElementRef.current;
    if (el && typeof el.focus === 'function') {
      requestAnimationFrame(() => el.focus());
    }
  }, []);

  return (
    <BookingPopupContext.Provider
      value={{
        isOpen,
        preselectedPuja,
        pagePreselectedPuja,
        setPagePreselectedPuja,
        openBookingPopup,
        closeBookingPopup,
      }}
    >
      {children}
    </BookingPopupContext.Provider>
  );
}

export function useBookingPopup() {
  const ctx = useContext(BookingPopupContext);
  if (!ctx) {
    throw new Error('useBookingPopup must be used within a BookingPopupProvider');
  }
  return ctx;
}
