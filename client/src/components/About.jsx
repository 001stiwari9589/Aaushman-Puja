import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, BookOpen, Compass, Award, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const icons = [
    <Award className="w-5 h-5 text-[#C8961E]" />,
    <BookOpen className="w-5 h-5 text-[#C8961E]" />,
    <Compass className="w-5 h-5 text-[#C8961E]" />,
    <ShieldCheck className="w-5 h-5 text-[#C8961E]" />,
  ];
  const highlights = t.about.highlights.map((item, idx) => ({
    ...item,
    icon: icons[idx],
  }));

  return (
    <section
      id="about"
      className="py-14 md:py-20 bg-[#FBEBD0] relative border-y border-[#EBD5B0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Column: Authentic Ritual Imagery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="rounded-2xl p-2.5 bg-[#FFFFFF] border border-[#EBD5B0] shadow-[0_8px_24px_rgba(74,28,12,0.08)]">
              <picture>
                <source srcSet="/images/about-ritual.webp" type="image/webp" />
                <img
                  src="/images/about-ritual.jpg"
                  alt="North Hindi Pandit, Bihari Pandit and Vedic Pandit Havan Ceremony"
                  loading="lazy"
                  width="800"
                  height="600"
                  className="w-full h-72 sm:h-96 object-cover rounded-xl"
                />
              </picture>

              <div className="mt-3 bg-[#FFF8EC] border border-[#EBD5B0] rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FBEBD0] flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-[#E65100]" />
                </div>
                <div>
                  <div className="font-heading font-bold text-base text-[#4A1C0C]">
                    {t.about.shastraTitle}
                  </div>
                  <div className="text-xs text-[#8D6E63] uppercase tracking-wider font-semibold">
                    {t.about.shastraSub}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: About Vedic Sansthan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-sans text-xs sm:text-sm tracking-[0.16em] text-[#C8961E] font-bold uppercase mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{t.about.badge}</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1C0C] leading-tight mb-4">
              {t.about.title}
            </h2>

            <p className="text-[#5D4037] text-base leading-relaxed mb-4">
              {t.about.p1Prefix}
              <strong className="text-[#4A1C0C] font-semibold">{t.about.p1Brand}</strong>
              {t.about.p1Suffix}
            </p>

            <p className="text-[#5D4037] text-base leading-relaxed mb-7">
              {t.about.p2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#EBD5B0] rounded-xl p-4 shadow-[0_4px_14px_rgba(74,28,12,0.06)]"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF8EC] border border-[#EBD5B0] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#4A1C0C]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#5D4037] leading-relaxed m-0">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
