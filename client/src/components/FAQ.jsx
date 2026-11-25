import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faqs" className="py-14 md:py-20 bg-[#FFF8EC] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="font-sans text-xs sm:text-sm tracking-[0.16em] text-[#C8961E] font-bold uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.faqs.badge}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1C0C] mb-3">
            {t.faqs.title}
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
            {t.faqs.subtitle}
          </p>
        </motion.div>

        <div className="flex flex-col gap-3.5">
          {t.faqs.items.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all overflow-hidden bg-[#FFFFFF] ${
                  isOpen
                    ? 'border-[#E65100] shadow-[0_8px_24px_rgba(74,28,12,0.08)]'
                    : 'border-[#EBD5B0] hover:border-[#C8961E]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[56px] px-4 sm:px-5 py-4 flex items-center justify-between gap-4 bg-transparent border-none text-left cursor-pointer"
                >
                  <span className="font-heading text-base sm:text-lg font-bold text-[#4A1C0C]">
                    {faq.question}
                  </span>

                  <motion.div
                    animate={shouldReduceMotion ? undefined : { rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                      isOpen
                        ? 'bg-[#E65100] border-[#E65100] text-white'
                        : 'bg-[#FFF8EC] border-[#EBD5B0] text-[#E65100]'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-[#EBD5B0] text-sm sm:text-base text-[#5D4037] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
