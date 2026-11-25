import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PUJAS_DATA } from '../data/pujas';
import { Sparkles, Clock, Users, Flame, X, Check, ArrowRight, PackageCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBookingPopup } from '../context/BookingPopupContext';

export default function Services() {
  const [selectedPuja, setSelectedPuja] = useState(null);
  const { t, language } = useLanguage();
  const { openBookingPopup } = useBookingPopup();
  const shouldReduceMotion = useReducedMotion();
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  const half = Math.ceil(PUJAS_DATA.length / 2);
  const mobileRow1 = PUJAS_DATA.slice(0, half);
  const mobileRow2 = PUJAS_DATA.slice(half);

  const scrollRow = (ref, direction) => {
    if (!ref.current) return;
    const distance = Math.max(ref.current.clientWidth * 0.78, 260);
    ref.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!selectedPuja) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedPuja(null);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [selectedPuja]);

  const handleBookNow = (pujaName) => {
    setSelectedPuja(null);
    openBookingPopup(pujaName);
  };

  const renderPujaCard = (puja, index, extraClass = '') => {
    const localized = t.services.items?.[puja.id] || {};
    const displayName = localized.name || puja.name;
    const displayCategory = localized.category || puja.category;
    const displayTagline = localized.tagline || puja.tagline;

    return (
      <motion.article
        key={puja.id}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.32) }}
        className={`vedic-card rounded-2xl flex flex-col overflow-hidden group lg:hover:-translate-y-1.5 ${extraClass}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b border-[#EBD5B0]">
          <picture>
            <source srcSet={puja.image} type="image/webp" />
            <img
              src={puja.fallbackImage}
              alt={`${displayName} - North Hindi Pandit & Vedic Pandit Service`}
              loading="lazy"
              width="800"
              height="500"
              className="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-105"
            />
          </picture>

          <span className="absolute top-2.5 left-2.5 bg-[#FFF8EC]/95 border border-[#EBD5B0] rounded-full px-2.5 py-0.5 font-sans font-bold text-[11px] text-[#4A1C0C]">
            {displayCategory}
          </span>
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <h3 className="font-heading text-xl font-bold text-[#4A1C0C] mb-1.5">
            {displayName}
          </h3>

          <p className="font-sans text-sm text-[#5D4037] leading-relaxed mb-3 line-clamp-2 flex-1">
            {displayTagline}
          </p>

          <div className="bg-[#FFF8EC] border border-[#EBD5B0] rounded-lg p-2.5 mb-3 text-xs text-[#5D4037]">
            <div className="font-semibold text-[#4A1C0C] flex items-center gap-1 mb-1">
              <PackageCheck className="w-3.5 h-3.5 text-[#C8961E]" />
              <span>{language === 'hi' ? 'सामग्री शामिल:' : 'Samagri Included:'}</span>
            </div>
            <p className="m-0 line-clamp-1 text-[#5D4037]">
              {puja.samagriItems.slice(0, 2).join(' • ')}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-[#EBD5B0] mb-3.5 text-xs text-[#8D6E63] font-medium">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C8961E]" />
              {puja.duration}
            </span>
            <span className="font-bold text-[#E65100]">
              {language === 'hi' ? 'मूल्य हेतु संपर्क करें' : puja.priceInfo}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedPuja(puja)}
              className="btn-saffron-outline text-xs py-2 px-2 min-h-[44px] whitespace-nowrap"
            >
              {t.services.viewVidhi}
            </button>

            <motion.button
              type="button"
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              onClick={() => handleBookNow(puja.name)}
              className="btn-saffron-primary text-xs py-2 px-2 min-h-[44px] whitespace-nowrap"
            >
              <span>{t.services.bookPuja}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </motion.button>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <section id="services" className="py-14 md:py-20 bg-[#FFF8EC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="font-sans text-xs sm:text-sm tracking-[0.16em] text-[#C8961E] font-bold uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.services.badge}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1C0C] mb-3">
            {t.services.title}
          </h2>

          <motion.div
            initial={shouldReduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="vedic-divider origin-center"
          >
            <Flame className="w-5 h-5 text-[#C8961E]" />
          </motion.div>

          <p className="font-sans text-base text-[#5D4037] leading-relaxed">
            {t.services.subtitle}
          </p>
        </motion.div>

        {/* Mobile (<1024px): 2 Independent Horizontal Rows with Left/Right Arrows */}
        <div className="lg:hidden space-y-6">
          {[
            { items: mobileRow1, ref: row1Ref, label: language === 'hi' ? 'प्रमुख पूजाएं' : 'Popular Pujas' },
            { items: mobileRow2, ref: row2Ref, label: language === 'hi' ? 'अन्य वैदिक अनुष्ठान' : 'More Vedic Rituals' },
          ].map((row, rowIdx) => (
            <div key={rowIdx} className="relative">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="font-heading text-base font-bold text-[#4A1C0C]">
                  {row.label}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollRow(row.ref, 'left')}
                    aria-label="Scroll pujas left"
                    className="w-9 h-9 rounded-full bg-white border border-[#EBD5B0] shadow-sm flex items-center justify-center text-[#4A1C0C] active:scale-95 hover:border-[#E65100] hover:text-[#E65100] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRow(row.ref, 'right')}
                    aria-label="Scroll pujas right"
                    className="w-9 h-9 rounded-full bg-white border border-[#EBD5B0] shadow-sm flex items-center justify-center text-[#4A1C0C] active:scale-95 hover:border-[#E65100] hover:text-[#E65100] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => scrollRow(row.ref, 'left')}
                  aria-label="Previous puja"
                  className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#FFF8EC]/95 border border-[#C8961E]/60 shadow-md flex items-center justify-center text-[#4A1C0C] active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                  ref={row.ref}
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth no-scrollbar px-1"
                >
                  {row.items.map((puja, idx) =>
                    renderPujaCard(puja, idx, 'w-[76vw] sm:w-[290px] shrink-0 snap-start')
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => scrollRow(row.ref, 'right')}
                  aria-label="Next puja"
                  className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#FFF8EC]/95 border border-[#C8961E]/60 shadow-md flex items-center justify-center text-[#4A1C0C] active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Laptop & Desktop (>=1024px): 3-4 Column Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {PUJAS_DATA.map((puja, index) => renderPujaCard(puja, index))}
        </div>
      </div>

      {/* Puja Detail Modal: Bottom Sheet on Mobile (<640px), Centered Modal on Tablet/Desktop */}
      <AnimatePresence>
        {selectedPuja && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#3B1208]/65 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
            onClick={() => setSelectedPuja(null)}
          >
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { y: 40, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { y: 40, scale: 0.97, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-2xl max-h-[88dvh] overflow-y-auto bg-[#FFFFFF] border border-[#EBD5B0] rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 relative"
            >
              <div className="sm:hidden w-12 h-1.5 bg-[#EBD5B0] rounded-full mx-auto mb-4" />

              <button
                type="button"
                onClick={() => setSelectedPuja(null)}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[#FFF8EC] border border-[#EBD5B0] flex items-center justify-center text-[#4A1C0C] hover:border-[#E65100] cursor-pointer"
                aria-label="Close details modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-xs font-bold uppercase tracking-wider text-[#E65100] mb-1">
                {t.services.items?.[selectedPuja.id]?.category || selectedPuja.category}
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A1C0C] mb-2 pr-10">
                {t.services.items?.[selectedPuja.id]?.name || selectedPuja.name}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5D4037] mb-4">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#C8961E]" />
                  {selectedPuja.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-4 h-4 text-[#C8961E]" />
                  {selectedPuja.pandits}
                </span>
                <span className="text-[#E65100] font-bold">
                  {language === 'hi' ? 'मूल्य हेतु संपर्क करें' : selectedPuja.priceInfo}
                </span>
              </div>

              <p className="text-[#5D4037] text-base leading-relaxed mb-5">
                {selectedPuja.description}
              </p>

              <div className="bg-[#FBEBD0]/60 border-l-4 border-[#E65100] p-4 rounded-r-xl mb-5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4A1C0C] mb-1">
                  {t.services.benefits}
                </div>
                <p className="text-sm text-[#5D4037] m-0">{selectedPuja.significance}</p>
              </div>

              <div className="mb-5">
                <h4 className="font-heading text-base font-bold text-[#4A1C0C] mb-2.5">
                  {t.services.keyRitualsTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPuja.keyRituals.map((ritual, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-[#5D4037]">
                      <Check className="w-4 h-4 text-[#E65100] shrink-0 mt-1" />
                      <span>{ritual}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 bg-[#FFF8EC] p-4 rounded-xl border border-[#EBD5B0]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4A1C0C] mb-2">
                  {language === 'hi' ? 'पूजन सामग्री में शामिल:' : 'What is Included / Samagri:'}
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-[#5D4037] list-none p-0 m-0">
                  {selectedPuja.samagriItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8961E] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPuja(null)}
                  className="btn-saffron-outline w-full sm:w-auto text-sm"
                >
                  {language === 'hi' ? 'बंद करें' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => handleBookNow(selectedPuja.name)}
                  className="btn-saffron-primary w-full sm:w-auto text-sm"
                >
                  <Flame className="w-4 h-4" />
                  <span>{t.services.bookThis}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
