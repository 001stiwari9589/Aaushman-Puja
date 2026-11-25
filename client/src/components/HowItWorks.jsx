import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, CheckCircle2, PhoneCall, CalendarCheck2, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const icons = [
    <Sparkles className="w-5 h-5 text-[#E65100]" />,
    <CalendarCheck2 className="w-5 h-5 text-[#E65100]" />,
    <PhoneCall className="w-5 h-5 text-[#E65100]" />,
    <CheckCircle2 className="w-5 h-5 text-[#E65100]" />,
  ];
  const steps = t.howItWorks.steps.map((step, idx) => ({
    ...step,
    num: `0${idx + 1}`,
    icon: icons[idx],
  }));

  return (
    <section
      id="how-it-works"
      className="py-14 md:py-20 bg-[#FBEBD0] relative border-y border-[#EBD5B0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="font-sans text-xs sm:text-sm tracking-[0.16em] text-[#C8961E] font-bold uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.howItWorks.badge}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1C0C] mb-3">
            {t.howItWorks.title}
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
            {t.howItWorks.subtitle}
          </p>
        </motion.div>

        {/* Vertical Timeline on Mobile, 4-Column Grid on Laptop */}
        <div className="relative pl-6 sm:pl-0 border-l-2 sm:border-l-0 border-[#C8961E]/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="vedic-card rounded-2xl p-5 sm:p-6 flex flex-col sm:items-center sm:text-center relative"
            >
              {/* Mobile Timeline Dot */}
              <span className="sm:hidden absolute -left-[33px] top-6 w-4 h-4 rounded-full bg-[#E65100] border-2 border-[#FFF8EC]" />

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFF8EC] border-2 border-[#C8961E] flex flex-col items-center justify-center mb-4">
                <span className="font-heading text-base sm:text-lg font-bold text-[#4A1C0C] leading-none">
                  {step.num}
                </span>
                <div className="mt-0.5">{step.icon}</div>
              </div>

              <h3 className="font-heading text-xl font-bold text-[#4A1C0C] mb-2">
                {step.title}
              </h3>

              <p className="font-sans text-sm text-[#5D4037] leading-relaxed m-0">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
