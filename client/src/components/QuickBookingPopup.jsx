import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Flame, CheckCircle2, AlertCircle, Loader2, MessageCircle, RotateCcw, Calendar } from 'lucide-react';
import { PUJAS_DATA } from '../data/pujas';
import { useBookingPopup } from '../context/BookingPopupContext';
import { useLanguage } from '../context/LanguageContext';
import { PujaSelect } from './ui/CustomSelect';

export default function QuickBookingPopup() {
  const { isOpen, preselectedPuja, closeBookingPopup } = useBookingPopup();
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const today = new Date().toISOString().split('T')[0];

  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    city: '',
    puja: '',
    preferredDate: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Sync preselected puja whenever popup opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        mobile: '',
        city: '',
        puja: preselectedPuja || '',
        preferredDate: '',
      });
      setFieldErrors({});
      setErrorMsg('');
      setSuccessData(null);
    }
  }, [isOpen, preselectedPuja]);

  // Body scroll lock, initial focus, ESC key & Tab focus trap
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 60);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeBookingPopup();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeBookingPopup]);

  const validateField = (name, value) => {
    const val = typeof value === 'string' ? value.trim() : '';
    switch (name) {
      case 'fullName':
        if (!val) return t.booking.errors.fullNameReq;
        if (val.length < 2 || !/^[a-zA-Z\s.\u0900-\u097F]+$/.test(val)) return t.booking.errors.fullNameMin;
        return '';
      case 'mobile': {
        if (!val) return t.booking.errors.mobileReq;
        if (!/^[6-9]\d{9}$/.test(val)) return t.booking.errors.mobileInvalid;
        return '';
      }
      case 'city':
        if (!val || val.length < 2) return t.booking.errors.cityReq;
        return '';
      case 'puja':
        if (!val) return t.booking.errors.pujaReq;
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
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      fullName: validateField('fullName', formData.fullName),
      mobile: validateField('mobile', formData.mobile),
      city: validateField('city', formData.city),
      puja: validateField('puja', formData.puja),
      preferredDate: validateField('preferredDate', formData.preferredDate),
    };
    const activeErrors = Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
    setFieldErrors(activeErrors);
    if (Object.keys(activeErrors).length > 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          mobile: formData.mobile.trim(),
          city: formData.city.trim(),
          puja: formData.puja,
          preferredDate: formData.preferredDate || '',
          preferredTime: 'Morning (06:00 AM - 09:00 AM)',
          language: language === 'hi' ? 'Hindi & Sanskrit' : 'English & Hindi',
          email: '',
        }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessData(data.booking);
      } else {
        setErrorMsg(data.message || 'Unable to submit booking. Please try again.');
      }
    } catch {
      setErrorMsg('Network error while submitting booking. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = successData
    ? `https://wa.me/919589018011?text=${encodeURIComponent(
        `Namaste Pandit Ji! I just booked a Puja.\nReference ID: #${successData._id}\nName: ${successData.fullName}\nPuja: ${successData.puja}\nCity: ${successData.city}`
      )}`
    : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-[#3B1208]/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
          onClick={closeBookingPopup}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-booking-title"
        >
          <motion.div
            ref={dialogRef}
            initial={shouldReduceMotion ? { opacity: 1 } : { y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: 40, scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-[460px] max-h-[90dvh] overflow-y-auto bg-[#FFFFFF] border border-[#EBD5B0] rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 relative"
          >
            {/* Mobile drag handle */}
            <div className="sm:hidden w-12 h-1.5 bg-[#EBD5B0] rounded-full mx-auto mb-3" />

            <button
              type="button"
              onClick={closeBookingPopup}
              aria-label="Close booking popup"
              className="absolute top-3.5 right-3.5 w-11 h-11 rounded-full bg-[#FFF8EC] border border-[#EBD5B0] flex items-center justify-center text-[#4A1C0C] hover:border-[#E65100] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {successData ? (
              <div className="text-center py-4">
                <motion.div
                  initial={shouldReduceMotion ? false : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4 text-emerald-600"
                >
                  <CheckCircle2 className="w-9 h-9" />
                </motion.div>

                <h2 id="quick-booking-title" className="font-heading text-2xl font-bold text-[#4A1C0C] mb-1.5">
                  {language === 'hi' ? 'बुकिंग की पुष्टि हुई!' : 'Booking Request Received!'}
                </h2>
                <p className="text-sm text-[#5D4037] mb-4">
                  {language === 'hi'
                    ? 'हमारे आचार्य शीघ्र ही आपसे संपर्क करेंगे।'
                    : 'Our Vedic coordinator will contact you shortly.'}
                </p>

                <div className="bg-[#FFF8EC] border border-[#EBD5B0] rounded-xl p-3.5 text-left text-sm space-y-1.5 mb-5">
                  <div className="flex justify-between">
                    <span className="text-[#8D6E63]">Reference ID:</span>
                    <span className="font-bold text-[#4A1C0C]">#{successData._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8D6E63]">Puja:</span>
                    <span className="font-bold text-[#E65100]">{successData.puja}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8D6E63]">City:</span>
                    <span className="font-medium text-[#4A1C0C]">{successData.city}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[48px] w-full rounded-xl bg-[#25D366] hover:opacity-95 text-white font-sans font-bold text-sm inline-flex items-center justify-center gap-2 no-underline"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{language === 'hi' ? 'व्हाट्सएप पर चैट करें' : 'Chat on WhatsApp'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={closeBookingPopup}
                    className="btn-saffron-outline w-full text-sm"
                  >
                    {language === 'hi' ? 'बंद करें' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="pr-10 mb-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#E65100] mb-0.5">
                    {language === 'hi' ? 'त्वरित पूजा बुकिंग' : 'Quick Puja Booking'}
                  </div>
                  <h2 id="quick-booking-title" className="font-heading text-2xl font-bold text-[#4A1C0C] m-0">
                    {language === 'hi' ? 'पंडित जी बुक करें' : 'Book Your Vedic Pandit'}
                  </h2>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-800 text-xs mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-1 text-red-700 font-bold underline bg-transparent border-none cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                  <div>
                    <label className="vedic-label" htmlFor="qb-fullName">
                      {t.booking.fullName}
                    </label>
                    <input
                      ref={firstInputRef}
                      id="qb-fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t.booking.fullNamePh}
                      className={`vedic-input ${fieldErrors.fullName ? '!border-red-600' : ''}`}
                      required
                    />
                    {fieldErrors.fullName && (
                      <p className="text-red-600 text-xs mt-1">{fieldErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="vedic-label" htmlFor="qb-mobile">
                      {t.booking.mobile}
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-[10px] border border-r-0 border-[#EBD5B0] bg-[#FFF8EC] text-[#4A1C0C] font-semibold text-sm min-h-[44px]">
                        +91
                      </span>
                      <input
                        id="qb-mobile"
                        name="mobile"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder={t.booking.mobilePh}
                        className={`vedic-input !rounded-l-none ${fieldErrors.mobile ? '!border-red-600' : ''}`}
                        required
                      />
                    </div>
                    {fieldErrors.mobile && (
                      <p className="text-red-600 text-xs mt-1">{fieldErrors.mobile}</p>
                    )}
                  </div>

                  <div>
                    <label className="vedic-label" htmlFor="qb-city">
                      {language === 'hi' ? 'शहर / स्थान *' : 'City / Location *'}
                    </label>
                    <input
                      id="qb-city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={language === 'hi' ? 'अपना शहर / पता दर्ज करें' : 'Enter your city / location'}
                      className={`vedic-input ${fieldErrors.city ? '!border-red-600' : ''}`}
                      required
                    />
                    {fieldErrors.city && (
                      <p className="text-red-600 text-xs mt-1">{fieldErrors.city}</p>
                    )}
                  </div>

                  <PujaSelect
                    id="qb-puja"
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
                    <label className="vedic-label" htmlFor="qb-date">
                      {language === 'hi' ? 'पसंदीदा तिथि (वैकल्पिक)' : 'Preferred Date (Optional)'}
                    </label>
                    <input
                      id="qb-date"
                      name="preferredDate"
                      type="date"
                      min={today}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className={`w-full min-h-[48px] px-4 py-2.5 rounded-[12px] bg-[#FFFFFF] border text-[16px] text-[#4A1C0C] font-sans outline-none transition-all ${
                        fieldErrors.preferredDate
                          ? 'border-red-600 focus:ring-2 focus:ring-red-200'
                          : 'border-[#EBD5B0] focus:border-[#E65100] focus:ring-[3px] focus:ring-[#E65100]/15'
                      }`}
                    />
                    {fieldErrors.preferredDate && (
                      <p className="text-red-600 text-xs mt-1">{fieldErrors.preferredDate}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-saffron-primary w-full min-h-[48px] text-base mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t.booking.submitting}</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-4 h-4" />
                        <span>{language === 'hi' ? 'बुकिंग कन्फर्म करें' : 'Confirm Quick Booking'}</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
