import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Phone, Menu, X, Globe, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBookingPopup } from '../context/BookingPopupContext';
import BrandLogo from './ui/BrandLogo';

export default function Navbar({ activeSection, isMobileView, onMobileNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef(null);
  const { language, setLanguage, t, LANGUAGES } = useLanguage();
  const { openBookingPopup } = useBookingPopup();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: t.nav.home, href: '#hero' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.faqs, href: '#faqs' },
    { name: t.nav.contact, href: '#contact' },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFF8EC]/95 backdrop-blur-md border-b border-[#EBD5B0] shadow-[0_4px_20px_rgba(74,28,12,0.08)] h-16'
            : 'bg-[#FFF8EC]/85 backdrop-blur-sm border-b border-[#EBD5B0]/60 h-16 lg:h-20'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap no-underline min-h-[44px]"
          >
            <BrandLogo />

            <div className="text-left">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-wide block leading-tight text-[#4A1C0C]">
                Aaushman Puja
              </span>
              <span className="font-sans text-[10px] tracking-[0.18em] text-[#8D6E63] block uppercase font-semibold">
                {t.brandSub}
              </span>
            </div>
          </a>

          {/* Laptop Horizontal Navigation (>=1024px) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 shrink-0 whitespace-nowrap">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative font-sans text-sm font-semibold py-2 transition-colors no-underline ${
                    isActive ? 'text-[#E65100]' : 'text-[#4A1C0C] hover:text-[#E65100]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId={shouldReduceMotion ? undefined : 'activeNavUnderline'}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E65100] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right Actions (>=1024px) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="bg-[#FFFFFF] border border-[#EBD5B0] hover:border-[#E65100] rounded-xl px-3 py-1.5 shadow-[0_4px_12px_rgba(74,28,12,0.06)] transition-all">
              <a
                href="tel:+919589018011"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#4A1C0C] hover:text-[#E65100] no-underline min-h-[32px]"
              >
                <span className="w-7 h-7 rounded-full bg-[#FBEBD0] flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-[#E65100]" />
                </span>
                <span>+91 9589018011</span>
              </a>
            </div>

            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                aria-label="Select Website Language"
                className="min-h-[44px] min-w-[44px] px-3 rounded-lg border border-[#EBD5B0] bg-[#FFFFFF] text-[#4A1C0C] hover:border-[#E65100] flex items-center justify-center gap-1.5 font-sans text-xs font-bold cursor-pointer transition-colors"
              >
                <Globe className="w-4 h-4 text-[#C8961E]" />
                <span>{currentLang.short}</span>
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 rounded-xl bg-[#FFFFFF] border border-[#EBD5B0] shadow-[0_8px_24px_rgba(74,28,12,0.12)] py-1 z-50"
                  >
                    {LANGUAGES.map((lang) => {
                      const active = language === lang.code;
                      return (
                        <button
                          type="button"
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between text-sm font-sans font-semibold cursor-pointer border-none ${
                            active
                              ? 'bg-[#FBEBD0] text-[#E65100]'
                              : 'bg-transparent text-[#4A1C0C] hover:bg-[#FFF8EC]'
                          }`}
                        >
                          <span>{lang.native}</span>
                          {active && <Check className="w-4 h-4 text-[#E65100]" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile: Logo + Hamburger ONLY (<1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden w-11 h-11 rounded-lg bg-[#FFFFFF] border border-[#EBD5B0] text-[#4A1C0C] flex items-center justify-center cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Slide-In Menu (<1024px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden fixed inset-0 bg-[#FFF8EC] z-50 p-5 flex flex-col overflow-y-auto overscroll-contain"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EBD5B0]">
              <div className="flex items-center gap-2.5">
                <BrandLogo size="sm" />
                <span className="font-heading font-bold text-[#4A1C0C] text-xl">
                  Aaushman Puja
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 rounded-lg bg-[#FFFFFF] border border-[#EBD5B0] flex items-center justify-center text-[#4A1C0C] cursor-pointer"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2.5">
              {[
                { key: 'home', name: t.nav.home },
                { key: 'services', name: t.nav.services },
                { key: 'about', name: t.nav.about },
                { key: 'booking', name: t.nav.bookPuja },
                { key: 'testimonials', name: t.testimonials.title },
                { key: 'faqs', name: t.nav.faqs },
                { key: 'contact', name: t.nav.contact },
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isMobileView && onMobileNavigate) {
                      onMobileNavigate(item.key);
                    }
                  }}
                  className={`min-h-[50px] font-sans font-semibold text-base flex items-center justify-between px-4 rounded-xl border cursor-pointer text-left ${
                    activeSection === item.key
                      ? 'bg-[#FBEBD0] border-[#E65100] text-[#E65100]'
                      : 'bg-[#FFFFFF] border-[#EBD5B0] text-[#4A1C0C] hover:text-[#E65100]'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-[#E65100]">→</span>
                </button>
              ))}
            </nav>

            {/* Language Toggle inside Mobile Menu */}
            <div className="mt-6 pt-4 border-t border-[#EBD5B0]">
              <div className="flex items-center gap-2 text-xs text-[#8D6E63] font-sans font-bold uppercase tracking-wider mb-2.5">
                <Globe className="w-4 h-4 text-[#C8961E]" />
                <span>{t.nav.languageLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((lang) => (
                  <button
                    type="button"
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`min-h-[48px] rounded-xl text-sm font-sans font-bold border cursor-pointer ${
                      language === lang.code
                        ? 'bg-[#E65100] text-white border-[#E65100]'
                        : 'bg-[#FFFFFF] text-[#4A1C0C] border-[#EBD5B0]'
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number inside Mobile Menu */}
            <div className="mt-auto pt-6">
              <a
                href="tel:+919589018011"
                className="btn-saffron-outline w-full min-h-[50px] text-base"
              >
                <Phone className="w-4 h-4" />
                <span>+91 9589018011</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
