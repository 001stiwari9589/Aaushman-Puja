import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerBookingCelebration } from '../utils/celebrate';
import { PUJAS_DATA } from '../data/pujas';
import { Flame, Sparkles, CheckCircle2, AlertCircle, Loader2, Send, MessageCircle, Clock, PackageCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PujaSelect } from './ui/CustomSelect';

export default function BookingForm({ preselectedPuja }) {
  const { t, language } = useLanguage();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    puja: preselectedPuja || '',
    city: '',
    preferredDate: '',
    additionalRequirements: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [asideVideoFailed, setAsideVideoFailed] = useState(false);
  const asideVideoRef = useRef(null);

  useEffect(() => {
    const vid = asideVideoRef.current;
    if (!vid || asideVideoFailed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(vid);
    return () => observer.disconnect();
  }, [asideVideoFailed, formData.puja]);

  useEffect(() => {
    if (preselectedPuja) {
      setFormData((prev) => ({ ...prev, puja: preselectedPuja }));
      setFieldErrors((prev) => ({ ...prev, puja: '' }));
    }
  }, [preselectedPuja]);

  const selectedPujaObj = PUJAS_DATA.find((p) => p.name === formData.puja) || null;

  const validateField = (name, value) => {
    const val = typeof value === 'string' ? value.trim() : '';
    switch (name) {
      case 'fullName':
        if (!val) return t.booking.errors.fullNameReq;
        if (val.length < 2 || !/^[a-zA-Z\s.\u0900-\u097F]+$/.test(val)) return t.booking.errors.fullNameMin;
        return '';
      case 'mobile': {
        if (!val) return t.booking.errors.mobileReq;
        const digits = val.replace(/\D/g, '');
        const normalized = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
        if (!/^[6-9]\d{9}$/.test(normalized)) return t.booking.errors.mobileInvalid;
        return '';
      }
      case 'puja':
        if (!val) return t.booking.errors.pujaReq;
        return '';
      case 'city':
        if (!val || val.length < 2) return t.booking.errors.cityReq;
        return '';
      case 'preferredDate':
        if (val && val < today) return t.booking.errors.datePast;
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'fullName') {
      value = value.replace(/[^a-zA-Z\s.\u0900-\u097F]/g, '');
    } else if (name === 'mobile') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    if (errorMsg) setErrorMsg('');
  };

  const validateAll = () => {
    const requiredFields = ['fullName', 'mobile', 'puja', 'city'];
    const errors = {};
    requiredFields.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) errors[field] = err;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const triggerCelebration = () => {
    triggerBookingCelebration();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      setErrorMsg(language === 'hi' ? 'कृपया लाल रंग में चिह्नित फ़ील्ड सही करें।' : 'Please fix the highlighted fields below.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: '',
          preferredTime: 'Morning (06:00 AM - 09:00 AM)',
          language: language === 'hi' ? 'Hindi & Sanskrit' : 'English & Hindi',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessData(data.booking);
        triggerCelebration();
        setFormData({
          fullName: '',
          mobile: '',
          puja: '',
          city: '',
          preferredDate: '',
          additionalRequirements: '',
        });
        setFieldErrors({});
      } else {
        setErrorMsg(data.message || 'Unable to submit booking enquiry. Please try again.');
      }
    } catch {
      setErrorMsg('Failed to connect with backend server. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `vedic-input ${fieldErrors[name] ? '!border-red-600 focus:!ring-red-200' : ''}`;

  const whatsappBookingUrl = successData
    ? `https://wa.me/919589018011?text=${encodeURIComponent(
        `Namaste Pandit Ji! I have submitted a Puja booking.\nReference ID: #${successData._id}\nName: ${successData.fullName}\nPuja: ${successData.puja}\nCity: ${successData.city}`
      )}`
    : '';

  return (
    <section id="booking" className="py-10 md:py-16 bg-[#FFF8EC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-7 md:mb-10">
          <div className="font-sans text-xs sm:text-sm tracking-[0.16em] text-[#C8961E] font-bold uppercase mb-1.5 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.booking.badge}</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-[#4A1C0C] mb-2">
            {t.booking.title}
          </h2>

          <div className="vedic-divider">
            <Flame className="w-5 h-5 text-[#C8961E]" />
          </div>

          <p className="font-sans text-sm sm:text-base text-[#5D4037] leading-relaxed">
            {t.booking.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Compact Booking Form (1 field per row on laptop to match right card height) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#EBD5B0] rounded-2xl p-4 sm:p-6 lg:p-7 shadow-[0_8px_24px_rgba(74,28,12,0.08)] flex flex-col justify-center">
            <form onSubmit={handleSubmit} noValidate>
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-800 mb-4 flex items-center gap-2.5 text-xs sm:text-sm"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 gap-3.5 sm:gap-4 mb-5">
                <div>
                  <label className="vedic-label text-xs sm:text-sm" htmlFor="fullName">
                    {t.booking.fullName}
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t.booking.fullNamePh}
                    className={inputClass('fullName')}
                    required
                  />
                  {fieldErrors.fullName && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="vedic-label text-xs sm:text-sm" htmlFor="mobile">
                    {t.booking.mobile}
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-[10px] border border-r-0 border-[#EBD5B0] bg-[#FFF8EC] text-[#4A1C0C] font-semibold text-sm min-h-[44px]">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      inputMode="numeric"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder={t.booking.mobilePh}
                      className={`${inputClass('mobile')} !rounded-l-none`}
                      required
                    />
                  </div>
                  {fieldErrors.mobile && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.mobile}</p>
                  )}
                </div>

                <PujaSelect
                  id="puja"
                  name="puja"
                  label={t.booking.selectPuja}
                  value={formData.puja}
                  onChange={(val) => handleChange({ target: { name: 'puja', value: val } })}
                  options={PUJAS_DATA.map((p) => ({
                    value: p.name,
                    label: t.services.items?.[p.id]?.name || p.name,
                    subtitle: p.duration,
                    icon: Flame,
                  }))}
                  placeholder={language === 'hi' ? 'अपनी पूजा चुनें' : 'Select your puja'}
                  error={fieldErrors.puja}
                  required
                />

                <div>
                  <label className="vedic-label text-xs sm:text-sm" htmlFor="city">
                    {language === 'hi' ? 'शहर / स्थान *' : 'City / Location *'}
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={language === 'hi' ? 'अपना शहर / पता दर्ज करें' : 'Enter your city / location'}
                    className={inputClass('city')}
                    required
                  />
                  {fieldErrors.city && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.city}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-saffron-primary px-7 py-2.5 text-sm min-h-[42px] whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.booking.submitting}</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4" />
                      <span>{language === 'hi' ? 'पूजा बुक करें' : 'Book Puja'}</span>
                      <Send className="w-3.5 h-3.5 ml-0.5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] sm:text-xs text-[#8D6E63] mt-2.5 text-center m-0">
                {t.booking.privacyNote}
              </p>
            </form>
          </div>

          {/* Right Side Panel: All Pujas Overview (default) or Selected Puja Details */}
          <aside className="lg:col-span-5 bg-[#FFFFFF] border border-[#EBD5B0] rounded-2xl p-6 shadow-[0_8px_24px_rgba(74,28,12,0.08)]">
            {selectedPujaObj ? (
              <>
                <div className="text-xs font-bold uppercase tracking-wider text-[#E65100] mb-2">
                  {language === 'hi' ? 'चयनित पूजा विवरण' : 'Selected Puja Summary'}
                </div>

                <picture>
                  <source srcSet={selectedPujaObj.image} type="image/webp" />
                  <img
                    src={selectedPujaObj.fallbackImage}
                    alt={selectedPujaObj.name}
                    loading="lazy"
                    width="800"
                    height="533"
                    className="w-full h-44 object-cover rounded-xl mb-4 border border-[#EBD5B0]"
                  />
                </picture>

                <h3 className="font-heading text-2xl font-bold text-[#4A1C0C] mb-1">
                  {t.services.items?.[selectedPujaObj.id]?.name || selectedPujaObj.name}
                </h3>

                <div className="flex items-center justify-between text-xs font-semibold text-[#5D4037] py-2.5 border-y border-[#EBD5B0] my-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#C8961E]" />
                    {selectedPujaObj.duration}
                  </span>
                  <span className="text-[#E65100] font-bold">
                    {language === 'hi' ? 'मूल्य हेतु संपर्क करें' : selectedPujaObj.priceInfo}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4A1C0C] flex items-center gap-1.5 mb-2">
                    <PackageCheck className="w-4 h-4 text-[#C8961E]" />
                    <span>{language === 'hi' ? 'क्या-क्या शामिल है / सामग्री:' : 'What is Included / Samagri:'}</span>
                  </div>
                  <ul className="space-y-1.5 text-sm text-[#5D4037] list-none p-0 m-0">
                    {selectedPujaObj.samagriItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8961E] mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs font-bold uppercase tracking-wider text-[#E65100] mb-2">
                  {language === 'hi' ? 'सभी वैदिक पूजाएं उपलब्ध' : 'All Vedic Pujas & Kathas'}
                </div>

                {asideVideoFailed ? (
                  <picture>
                    <source srcSet="/images/about-ritual.webp" type="image/webp" />
                    <img
                      src="/images/about-ritual.jpg"
                      alt="All Vedic Pujas & Sacred Ceremonies"
                      loading="lazy"
                      width="800"
                      height="533"
                      className="w-full h-44 object-cover rounded-xl mb-4 border border-[#EBD5B0]"
                    />
                  </picture>
                ) : (
                  <video
                    ref={asideVideoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/images/about-ritual.jpg"
                    onError={() => setAsideVideoFailed(true)}
                    className="w-full h-44 object-cover rounded-xl mb-4 border border-[#EBD5B0] bg-[#3B1208]"
                  >
                    <source src="/videos/vedic-havan.mp4" type="video/mp4" />
                  </video>
                )}

                <h3 className="font-heading text-2xl font-bold text-[#4A1C0C] mb-2">
                  {language === 'hi' ? 'हर प्रकार की पूजा, कथा एवं हवन' : 'Every Puja, Katha & Havan Under One Roof'}
                </h3>

                <p className="text-sm text-[#5D4037] mb-4">
                  {language === 'hi'
                    ? 'गृह प्रवेश, सत्यनारायण कथा, श्रीमद् भागवत कथा, सुंदरकांड पाठ, रुद्राभिषेक, वास्तु शांति, विवाह संस्कार व अन्य सभी अनुष्ठान।'
                    : 'Choose from Griha Pravesh, Satyanarayan Katha, Bhagwat Katha, Sundarkand, Rudrabhishek, Vastu Shanti, Vivah & more.'}
                </p>

                <ul className="space-y-2 text-sm text-[#5D4037] list-none p-0 m-0 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8961E] shrink-0" />
                    <span>{language === 'hi' ? 'गुरुकुल-प्रशिक्षित अनुभवी पंडित' : 'Gurukul-trained Vedic Acharyas'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8961E] shrink-0" />
                    <span>{language === 'hi' ? 'शुद्ध पूजन सामग्री व्यवस्था' : 'Complete pure Puja Samagri included'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8961E] shrink-0" />
                    <span>{language === 'hi' ? 'सटीक शुभ मुहूर्त परामर्श' : 'Accurate Shubh Muhurat guidance'}</span>
                  </li>
                </ul>
              </>
            )}

            <div className="bg-[#FFF8EC] border border-[#EBD5B0] rounded-xl p-3.5 text-xs text-[#5D4037]">
              {language === 'hi'
                ? 'सीधी बात करने के लिए +91 9589018011 पर कॉल करें।'
                : 'Need help choosing a Puja or Muhurat? Call +91 9589018011.'}
            </div>
          </aside>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {successData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#3B1208]/65 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSuccessData(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full bg-[#FFFFFF] border border-[#EBD5B0] rounded-2xl p-6 sm:p-8 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#FFF8EC] to-[#FBEBD0] border-2 border-[#C8961E] shadow-[0_8px_24px_rgba(230,81,0,0.22)] flex items-center justify-center mx-auto mb-4 text-[#E65100]"
              >
                <CheckCircle2 className="w-10 h-10" />
                <Sparkles className="w-5 h-5 text-[#C8961E] absolute -top-1 -right-1 animate-pulse" />
              </motion.div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBEBD0] text-[#E65100] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'शुभम् भवतु!' : 'Shubham Bhavatu!'}</span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A1C0C] mb-2">
                {language === 'hi' ? 'बुकिंग कन्फर्म हो गई!' : 'Booking Confirmed!'}
              </h3>

              <p className="text-[#5D4037] text-sm sm:text-base mb-6 leading-relaxed">
                {language === 'hi'
                  ? `धन्यवाद ${successData.fullName} जी! हमारे आचार्य शीघ्र ही आपसे संपर्क करेंगे।`
                  : `Thank you, ${successData.fullName}! Our Acharya ji will contact you shortly.`}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[48px] w-full rounded-xl bg-[#25D366] hover:opacity-95 text-white font-sans font-bold text-sm inline-flex items-center justify-center gap-2 no-underline"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{language === 'hi' ? 'व्हाट्सएप पर विवरण भेजें' : 'Chat on WhatsApp'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="btn-saffron-outline w-full text-sm"
                >
                  {language === 'hi' ? 'बंद करें' : 'Done'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
