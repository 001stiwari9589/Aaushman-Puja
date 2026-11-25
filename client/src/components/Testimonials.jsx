import React, { useState, useEffect } from 'react';
import { TESTIMONIALS_DATA } from '../data/testimonials';
import { Star, ChevronLeft, ChevronRight, Quote, Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Testimonials() {
  const [reviews, setReviews] = useState(TESTIMONIALS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews([...data.reviews, ...TESTIMONIALS_DATA]);
        }
      })
      .catch(() => {
        // Keep default reviews
      });
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 6500);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const current = reviews[currentIndex] || reviews[0];

  return (
    <section
      id="testimonials"
      className="py-14 md:py-20 bg-[#FBEBD0] relative border-y border-[#EBD5B0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="font-sans text-xs sm:text-sm tracking-[0.16em] text-[#C8961E] font-bold uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.testimonials.badge}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1C0C] mb-3">
            {t.testimonials.title}
          </h2>

          <div className="vedic-divider">
            <Flame className="w-5 h-5 text-[#C8961E]" />
          </div>
        </div>

        {/* Review Slider Card */}
        {current && (
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-[#FFFFFF] border border-[#EBD5B0] rounded-2xl p-6 sm:p-10 shadow-[0_8px_24px_rgba(74,28,12,0.08)] text-center relative">
              <div className="absolute top-4 left-6 text-[#EBD5B0] pointer-events-none">
                <Quote className="w-10 h-10" />
              </div>

              <div className="flex justify-center gap-1.5 mb-4">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#C8961E] text-[#C8961E]" />
                ))}
              </div>

              <p className="font-sans text-base sm:text-lg text-[#5D4037] leading-relaxed italic max-w-2xl mx-auto mb-6">
                "{current.comment}"
              </p>

              <div className="flex items-center justify-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#FBEBD0] border border-[#C8961E] flex items-center justify-center font-heading text-base font-bold text-[#4A1C0C] shrink-0">
                  {current.name.split(' ').filter((w) => w !== '&').slice(0, 2).map((w) => w[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="font-heading text-lg font-bold text-[#4A1C0C]">
                    {current.name}
                  </div>
                  <div className="text-xs sm:text-sm text-[#8D6E63] font-medium">
                    {current.puja} • {current.location}
                  </div>
                </div>
              </div>
            </div>

            {reviews.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Review"
                  className="w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#EBD5B0] text-[#4A1C0C] flex items-center justify-center hover:border-[#E65100] cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`Go to review ${i + 1}`}
                      className={`h-2.5 rounded-full transition-all cursor-pointer border-none ${
                        currentIndex === i ? 'w-6 bg-[#E65100]' : 'w-2.5 bg-[#C8961E]/40'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  aria-label="Next Review"
                  className="w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#EBD5B0] text-[#4A1C0C] flex items-center justify-center hover:border-[#E65100] cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
