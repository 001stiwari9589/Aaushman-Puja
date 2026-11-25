import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBookingPopup } from '../context/BookingPopupContext';

const HERO_SLIDES = [
  { src: '/images/about-ritual.webp', fallback: '/images/about-ritual.jpg', alt: 'Vedic Havan Ritual' },
  { src: '/images/griha-pravesh.webp', fallback: '/images/griha-pravesh.jpg', alt: 'Griha Pravesh Puja' },
  { src: '/images/satyanarayan-katha.webp', fallback: '/images/satyanarayan-katha.jpg', alt: 'Satyanarayan Katha' },
  { src: '/images/rudrabhishek.webp', fallback: '/images/rudrabhishek.jpg', alt: 'Maha Rudrabhishek' },
  { src: '/images/ganesh-puja.webp', fallback: '/images/ganesh-puja.jpg', alt: 'Ganesh Puja & Havan' },
];

export default function Hero() {
  const { t, language } = useLanguage();
  const { openBookingPopup } = useBookingPopup();
  const shouldReduceMotion = useReducedMotion();

  const videoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [bgVideoFailed, setBgVideoFailed] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const saveData = Boolean(navigator.connection?.saveData);
    if (shouldReduceMotion || (isMobile && saveData)) {
      setPosterOnly(true);
    }
  }, [shouldReduceMotion]);

  // Fallback slideshow if card video fails
  useEffect(() => {
    if (!videoFailed || posterOnly || shouldReduceMotion) return;
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [videoFailed, posterOnly, shouldReduceMotion]);

  // Pause both videos when Hero is off-screen
  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el || posterOnly) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        [videoRef.current, bgVideoRef.current].forEach((vid) => {
          if (!vid) return;
          if (entry.isIntersecting) {
            vid.play().catch(() => { });
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [posterOnly, videoFailed, bgVideoFailed]);

  const currentSlide = HERO_SLIDES[slideIdx];

  return (
    <section
      ref={heroSectionRef}
      id="hero"
      className="relative min-h-[auto] lg:min-h-[68dvh] w-full flex items-center overflow-hidden bg-[#3B1208] pt-24 pb-10 lg:pt-32 lg:pb-14"
    >
      {/* Hero Background HD Video with WebP/JPG fallback */}
      {posterOnly || bgVideoFailed ? (
        <picture className="absolute inset-0 z-0 pointer-events-none">
          <source srcSet="/images/hero-temple.webp" type="image/webp" />
          <img
            src="/images/hero-temple.jpg"
            alt="Traditional Indian Hindu Temple and Sacred Diya Lighting"
            width="1600"
            height="900"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      ) : (
        <video
          ref={bgVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-temple.jpg"
          onError={() => setBgVideoFailed(true)}
          className="absolute inset-0 z-0 w-full h-full object-cover object-center pointer-events-none"
        >
          <source src="/videos/temple-background.mp4" type="video/mp4" />
        </video>
      )}

      {/* Maroon Gradient Overlay (#3B1208) */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(105deg, rgba(59, 18, 8, 0.90) 0%, rgba(59, 18, 8, 0.80) 55%, rgba(59, 18, 8, 0.68) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-left">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 bg-[#FFF1D6]/15 border border-[#C8961E]/60 rounded-full px-4 py-1.5 mb-4 lg:mb-6"
            >
              <Flame className="w-4 h-4 text-[#C8961E]" />
              <span className="font-sans text-xs sm:text-sm text-[#FFF1D6] font-semibold tracking-wide">
                {language === 'hi'
                  ? 'नॉर्थ हिंदी, बिहारी एवं वैदिक पंडित जी ऑनलाइन पूजा सेवा'
                  : 'North Hindi Pandit, Bihari Pandit & Vedic Pandit Services'}
              </span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="font-heading text-[30px] sm:text-4xl lg:text-5xl xl:text-[52px] font-bold leading-[1.16] mb-4 lg:mb-6 text-[#FFFFFF]"
            >
              {language === 'hi'
                ? 'गृह प्रवेश, विवाह, नामकरण एवं सभी पूजा हेतु ऑनलाइन पंडित जी'
                : 'Book North Hindi, Bihari & Vedic Pandit Ji for All Online Puja Services'}
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="font-sans text-sm sm:text-base lg:text-lg text-[#FFF1D6] leading-relaxed max-w-2xl mb-5 lg:mb-7 line-clamp-3 sm:line-clamp-none"
            >
              {t.hero.subtitlePrefix}{' '}
              <strong className="text-white font-semibold">{t.hero.subtitleHighlight}</strong>
              {t.hero.subtitleSuffix}
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 max-w-lg"
            >
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                onClick={() => openBookingPopup('')}
                className="btn-saffron-primary w-full sm:w-auto min-h-[48px] px-7 text-base"
              >
                <Flame className="w-4 h-4" />
                <span>{t.hero.bookNow}</span>
              </motion.button>

              <motion.a
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                href="https://wa.me/919589018011?text=Namaste%20Pandit%20Ji,%20I%20would%20like%20to%20book%20a%20Vedic%20Puja."
                target="_blank"
                rel="noreferrer"
                className="min-h-[48px] w-full sm:w-auto px-6 rounded-[10px] bg-[#25D366] hover:opacity-95 text-white font-sans font-semibold text-base inline-flex items-center justify-center gap-2 no-underline transition-opacity"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.hero.whatsappBtn}</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column: All Vedic Pujas HD Video Card */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-[#FFFFFF] border border-[#E65100]/35 rounded-2xl p-4 sm:p-5 shadow-[0_14px_36px_rgba(0,0,0,0.28)]">
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] lg:aspect-[16/10] border border-[#E65100]/40 shadow-md mb-3.5 bg-[#3B1208]">
                {posterOnly ? (
                  <img
                    src="/images/puja-hero-poster.jpg"
                    alt="Sacred Vedic Pujas & Havan Rituals"
                    width="800"
                    height="500"
                    className="w-full h-full object-cover"
                  />
                ) : videoFailed ? (
                  <AnimatePresence mode="wait">
                    <motion.picture
                      key={currentSlide.src}
                      initial={{ opacity: 0.4, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.4 }}
                      transition={{ duration: 0.6 }}
                      className="block w-full h-full"
                    >
                      <source srcSet={currentSlide.src} type="image/webp" />
                      <img
                        src={currentSlide.fallback}
                        alt={currentSlide.alt}
                        width="800"
                        height="500"
                        className="w-full h-full object-cover"
                      />
                    </motion.picture>
                  </AnimatePresence>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/images/puja-hero-poster.jpg"
                    onError={() => setVideoFailed(true)}
                    className="w-full h-full object-cover"
                  >
                    <source src="/videos/vedic-havan.mp4" type="video/mp4" />
                  </video>
                )}

                <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider text-white bg-[#E65100] px-3 py-1 rounded-full shadow">
                  {language === 'hi' ? 'सभी वैदिक पूजाएं उपलब्ध' : 'ALL VEDIC PUJAS AVAILABLE'}
                </span>
              </div>

              <h2 className="font-heading text-xl font-bold text-[#4A1C0C] mb-1">
                {language === 'hi' ? 'संपूर्ण वैदिक पूजा एवं अनुष्ठान' : 'All Vedic Pujas, Katha & Havan'}
              </h2>

              <p className="text-sm text-[#5D4037] mb-3">
                {language === 'hi'
                  ? 'गृह प्रवेश, सत्यनारायण कथा, रुद्राभिषेक, वास्तु शांति, विवाह संस्कार, हवन व अन्य सभी पूजाएं।'
                  : 'Griha Pravesh, Satyanarayan Katha, Rudrabhishek, Vastu Shanti, Bhagwat Katha, Vivah & more.'}
              </p>

              <ul className="space-y-1 text-xs text-[#5D4037] mb-3.5 list-none p-0 m-0">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8961E] shrink-0" />
                  <span>{language === 'hi' ? 'गुरुकुल-प्रशिक्षित अनुभवी आचार्य' : 'Gurukul-trained experienced Acharyas'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8961E] shrink-0" />
                  <span>{language === 'hi' ? 'शुभ मुहूर्त एवं शुद्ध पूजा सामग्री सहित' : 'Shubh Muhurat & pure Samagri arrangements'}</span>
                </li>
              </ul>

              <motion.button
                type="button"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                onClick={() => openBookingPopup('')}
                className="btn-saffron-primary w-full min-h-[44px] text-sm"
              >
                <span>{language === 'hi' ? 'पूजा बुक करें' : 'Book a Puja'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
