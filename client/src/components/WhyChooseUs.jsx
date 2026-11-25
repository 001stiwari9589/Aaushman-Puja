import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Shield, CalendarCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WhyChooseUs() {
  const { t } = useLanguage();
  const icons = [
    <Shield className="w-6 h-6 text-[#C8961E]" />,
    <Flame className="w-6 h-6 text-[#C8961E]" />,
    <CalendarCheck className="w-6 h-6 text-[#C8961E]" />,
    <HeartHandshake className="w-6 h-6 text-[#C8961E]" />,
  ];
  const cards = t.whyUs.cards.map((card, idx) => ({
    ...card,
    number: `0${idx + 1}`,
    icon: icons[idx],
  }));

  return (
    <section id="why-us" className="py-14 md:py-20 bg-[#FFF8EC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="font-sans text-xs sm:text-sm tracking-[0.16em] text-[#C8961E] font-bold uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.whyUs.badge}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1C0C] mb-3">
            {t.whyUs.title}
          </h2>

          <div className="vedic-divider">
            <Flame className="w-5 h-5 text-[#C8961E]" />
          </div>

          <p className="font-sans text-base text-[#5D4037] leading-relaxed">
            {t.whyUs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="vedic-card rounded-2xl p-6 flex flex-col relative"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FBEBD0] border border-[#EBD5B0] flex items-center justify-center mb-4">
                {card.icon}
              </div>

              <div className="font-sans text-xs tracking-wider text-[#E65100] uppercase font-bold mb-1">
                {card.subtitle}
              </div>

              <h3 className="font-heading text-xl font-bold text-[#4A1C0C] mb-2">
                {card.title}
              </h3>

              <p className="font-sans text-sm text-[#5D4037] leading-relaxed m-0">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
