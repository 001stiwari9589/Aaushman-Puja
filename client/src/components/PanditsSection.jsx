import React, { useEffect, useRef, useState } from 'react';
import { Award, MapPin, Languages, Flame, Sparkles, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { DEFAULT_PANDITS } from '../data/pandits';
import { useLanguage } from '../context/LanguageContext';
import { useBookingPopup } from '../context/BookingPopupContext';

export default function PanditsSection({ onOpenBrahminModal }) {
  const { language } = useLanguage();
  const { openBookingPopup } = useBookingPopup();
  const [approvedPandits, setApprovedPandits] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetch('/api/brahmins/public')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && Array.isArray(data.brahmins)) {
          setApprovedPandits(data.brahmins);
        }
      })
      .catch(() => {
        // Fallback smoothly to default pandits
      });
    return () => {
      active = false;
    };
  }, []);

  const allPandits = [...DEFAULT_PANDITS, ...approvedPandits];

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const distance = Math.max(carouselRef.current.clientWidth * 0.78, 260);
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const renderPanditCard = (pandit, extraClass = '') => {
    const isHi = language === 'hi';
    const name = isHi && pandit.nameHi ? pandit.nameHi : pandit.name;
    const specialization =
      isHi && pandit.specializationHi ? pandit.specializationHi : pandit.specialization;
    const experience = isHi && pandit.experienceHi ? pandit.experienceHi : pandit.experience;
    const city = isHi && pandit.cityHi ? pandit.cityHi : pandit.city;
    const languages = isHi && pandit.languagesHi ? pandit.languagesHi : pandit.languages;

    const initials = (pandit.name || 'A')
      .replace(/^(Acharya|Pandit)\s+/i, '')
      .trim()
      .charAt(0)
      .toUpperCase();

    return (
      <article
        key={pandit.id}
        className={`vedic-card rounded-2xl p-5 flex flex-col justify-between ${extraClass}`}
      >
        <div>
          {/* Top Profile Header (No Phone/Email Exposed) */}
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFF8EC] to-[#FBEBD0] border-2 border-[#C8961E] flex items-center justify-center shrink-0 text-[#E65100] font-heading font-bold text-xl shadow-sm">
              {initials || 'ॐ'}
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-lg font-bold text-[#4A1C0C] leading-snug truncate">
                {name}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E65100] bg-[#FFF8EC] border border-[#EBD5B0] rounded-full px-2.5 py-0.5 mt-1">
                <UserCheck className="w-3 h-3 shrink-0" />
                <span>{isHi ? 'सत्यापित वैदिक आचार्य' : 'Verified Vedic Acharya'}</span>
              </span>
            </div>
          </div>

          {/* Specialization Box */}
          <div className="bg-[#FFF8EC] border border-[#EBD5B0] rounded-xl p-3 mb-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C8961E] mb-0.5">
              {isHi ? 'विशेषज्ञता' : 'Specialization'}
            </div>
            <div className="font-sans text-sm font-semibold text-[#4A1C0C] leading-snug">
              {specialization}
            </div>
          </div>

          {/* Meta Info */}
          <div className="space-y-1.5 text-xs text-[#5D4037] mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#C8961E] shrink-0" />
              <span>{experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C8961E] shrink-0" />
              <span>{city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="w-3.5 h-3.5 text-[#C8961E] shrink-0" />
              <span>{languages}</span>
            </div>
          </div>
        </div>

        {/* Book Pandit Ji Button (No Phone Number Shown) */}
        <button
          type="button"
          onClick={() => openBookingPopup(pandit.defaultPuja || '', pandit)}
          className="btn-saffron-primary w-full py-2.5 text-xs sm:text-sm min-h-[42px]"
        >
          <Flame className="w-4 h-4 shrink-0" />
          <span>{isHi ? 'पंडित जी बुक करें' : 'Book Pandit Ji'}</span>
        </button>
      </article>
    );
  };

  return (
    <section id="pandits" className="py-12 md:py-16 bg-[#FBEBD0]/45 border-y border-[#EBD5B0] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="font-sans text-xs sm:text-sm tracking-[0.16em] text-[#C8961E] font-bold uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'hi' ? 'गुरुकुल-प्रशिक्षित आचार्य' : 'Gurukul-Trained Acharyas'}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1C0C] mb-3">
            {language === 'hi' ? 'हमारे अनुभवी वैदिक पंडित जी' : 'Our Verified Vedic Pandits'}
          </h2>

          <div className="vedic-divider">
            <Flame className="w-5 h-5 text-[#C8961E]" />
          </div>

          <p className="font-sans text-sm sm:text-base text-[#5D4037] leading-relaxed">
            {language === 'hi'
              ? 'अपनी पूजा की आवश्यकता के अनुसार विशेषज्ञ आचार्य चुनें और सीधे ऑनलाइन बुकिंग करें।'
              : 'Choose an experienced Acharya specialized in your ceremony and book directly online.'}
          </p>
        </div>

        {/* Unified Horizontal Carousel (Mobile & Laptop) with Left/Right Arrows */}
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollCarousel('left')}
            aria-label="Previous pandit"
            className="absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-[#FFF8EC]/95 border border-[#C8961E]/70 shadow-md flex items-center justify-center text-[#4A1C0C] hover:border-[#E65100] hover:text-[#E65100] active:scale-95 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 scroll-smooth no-scrollbar px-1 lg:px-2"
          >
            {allPandits.map((p) =>
              renderPanditCard(p, 'w-[78vw] sm:w-[300px] lg:w-[340px] lg:min-h-[345px] lg:p-6 shrink-0')
            )}
          </div>

          <button
            type="button"
            onClick={() => scrollCarousel('right')}
            aria-label="Next pandit"
            className="absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-[#FFF8EC]/95 border border-[#C8961E]/70 shadow-md flex items-center justify-center text-[#4A1C0C] hover:border-[#E65100] hover:text-[#E65100] active:scale-95 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>

        {/* Join as Brahmin CTA */}
        {onOpenBrahminModal && (
          <div className="text-center mt-9">
            <button
              type="button"
              onClick={onOpenBrahminModal}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#4A1C0C] via-[#7B280D] to-[#E65100] text-[#FFF8EC] border-2 border-[#C8961E] font-sans text-xs sm:text-sm font-bold shadow-[0_8px_22px_rgba(230,81,0,0.28)] hover:shadow-[0_12px_28px_rgba(230,81,0,0.38)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFD54F] shrink-0" />
              <span>
                {language === 'hi'
                  ? 'क्या आप वैदिक आचार्य हैं? आउष्मान पूजा से जुड़ें →'
                  : 'Are you a Vedic Acharya? Join Aaushman Puja →'}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
