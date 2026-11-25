import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Send, Flame, Sparkles, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateField = (field, value) => {
    const val = value.trim();
    switch (field) {
      case 'name':
        if (!val) return t.booking.errors.fullNameReq;
        if (val.length < 2 || !/^[a-zA-Z\s.\u0900-\u097F]+$/.test(val)) return t.booking.errors.fullNameMin;
        return '';
      case 'phone':
        if (!val) return t.booking.errors.mobileReq;
        if (!/^[6-9]\d{9}$/.test(val)) return t.booking.errors.mobileInvalid;
        return '';
      case 'email':
        if (!val) return t.booking.errors.emailReq;
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) return t.booking.errors.emailInvalid;
        return '';
      case 'message':
        if (!val || val.length < 10) {
          return language === 'hi'
            ? 'कृपया कम से कम 10 अक्षरों का संदेश लिखें।'
            : 'Please enter a message of at least 10 characters.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const errors = {
      name: validateField('name', form.name),
      phone: validateField('phone', form.phone),
      email: validateField('email', form.email),
      message: validateField('message', form.message),
    };
    const filtered = Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
    setFieldErrors(filtered);

    if (Object.keys(filtered).length > 0) {
      setErrorMsg(language === 'hi' ? 'कृपया सभी फ़ील्ड सही से भरें।' : 'Please enter valid details in all highlighted fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        setForm({ name: '', email: '', phone: '', message: '' });
        setFieldErrors({});
      } else {
        setErrorMsg(data.message || 'Unable to send message.');
      }
    } catch {
      setErrorMsg('Failed to connect to server. Please call +91 9589018011 directly.');
    } finally {
      setLoading(false);
      setTimeout(() => setSent(false), 6000);
    }
  };

  const mailtoHref =
    'mailto:001stiwari9589@gmail.com?subject=' +
    encodeURIComponent('Vedic Puja Inquiry - Divine Vedic Puja') +
    '&body=' +
    encodeURIComponent('Namaste Pandit Ji,\n\nI would like to enquire about booking a Puja in Jabalpur.\n\nName:\nPhone:\nPreferred Date:');

  const gmailHref =
    'https://mail.google.com/mail/?view=cm&fs=1&to=001stiwari9589@gmail.com&su=' +
    encodeURIComponent('Vedic Puja Inquiry - Divine Vedic Puja');

  const inputClass = (name) =>
    `vedic-input ${fieldErrors[name] ? '!border-red-600 focus:!ring-red-200' : ''}`;

  return (
    <section
      id="contact"
      className="py-14 md:py-20 bg-[#FBEBD0] relative border-t border-[#EBD5B0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="font-sans text-xs sm:text-sm tracking-[0.16em] text-[#C8961E] font-bold uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.contact.badge}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1C0C] mb-3">
            {t.contact.title}
          </h2>

          <div className="vedic-divider">
            <Flame className="w-5 h-5 text-[#C8961E]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Visible Phone, WhatsApp, Email */}
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A1C0C] mb-3">
              {t.contact.subheading}
            </h3>

            <p className="text-[#5D4037] text-base leading-relaxed mb-6">
              {t.contact.desc}
            </p>

            <div className="flex flex-col gap-4">
              {/* Visible Phone Number */}
              <a
                href="tel:+919589018011"
                className="flex items-center gap-4 bg-[#FFFFFF] p-4 rounded-xl border border-[#EBD5B0] hover:border-[#E65100] shadow-[0_4px_14px_rgba(74,28,12,0.06)] transition-colors no-underline min-h-[64px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#FBEBD0] flex items-center justify-center text-[#E65100] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider">
                    {t.contact.callLabel}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-[#4A1C0C]">
                    +91 9589018011
                  </div>
                </div>
              </a>

              {/* Visible WhatsApp */}
              <a
                href="https://wa.me/919589018011?text=Namaste%20Pandit%20Ji,%20I%20would%20like%20to%20enquire%20about%20booking%20a%20Vedic%20Puja."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 bg-[#FFFFFF] p-4 rounded-xl border border-[#EBD5B0] hover:border-[#25D366] shadow-[0_4px_14px_rgba(74,28,12,0.06)] transition-colors no-underline min-h-[64px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider">
                    {t.contact.whatsappLabel}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-[#4A1C0C]">
                    +91 9589018011
                  </div>
                </div>
              </a>

              {/* Visible Email + Gmail Compose Fallback */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-xl border border-[#EBD5B0] hover:border-[#E65100] shadow-[0_4px_14px_rgba(74,28,12,0.06)] transition-colors">
                <a
                  href={mailtoHref}
                  className="flex items-center gap-4 no-underline flex-1 min-w-0"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FBEBD0] flex items-center justify-center text-[#E65100] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider">
                      {t.contact.emailLabel}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-[#4A1C0C] truncate">
                      001stiwari9589@gmail.com
                    </div>
                  </div>
                </a>

                <a
                  href={gmailHref}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FFF8EC] border border-[#EBD5B0] text-[#E65100] hover:bg-[#E65100] hover:text-white text-xs font-bold transition-colors no-underline shrink-0"
                >
                  <span>{t.contact.gmailBtn}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Quick Message Form */}
          <div className="bg-[#FFFFFF] border border-[#EBD5B0] rounded-2xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(74,28,12,0.08)]">
            <h4 className="font-heading text-2xl font-bold text-[#4A1C0C] mb-1.5">
              {t.contact.formTitle}
            </h4>
            <p className="text-sm text-[#5D4037] mb-5">
              {t.contact.formSubtitle}
            </p>

            {errorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-800 text-sm rounded-lg p-3 mb-4">
                {errorMsg}
              </div>
            )}

            {sent ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto mb-3" />
                <h5 className="font-heading text-xl font-bold text-[#4A1C0C] mb-1">
                  {t.contact.sentTitle}
                </h5>
                <p className="text-sm text-[#5D4037] m-0">
                  {t.contact.sentDesc}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div>
                  <label className="vedic-label">{t.contact.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^a-zA-Z\s.\u0900-\u097F]/g, '');
                      setForm({ ...form, name: cleaned });
                      setFieldErrors({ ...fieldErrors, name: validateField('name', cleaned) });
                    }}
                    placeholder={t.contact.namePh}
                    className={inputClass('name')}
                  />
                  {fieldErrors.name && <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="vedic-label">{t.contact.phoneLabel}</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    value={form.phone}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setForm({ ...form, phone: cleaned });
                      setFieldErrors({ ...fieldErrors, phone: validateField('phone', cleaned) });
                    }}
                    placeholder={t.contact.phonePh}
                    className={inputClass('phone')}
                  />
                  {fieldErrors.phone && <p className="text-red-600 text-xs mt-1">{fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="vedic-label">{t.contact.emailInputLabel}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => {
                      const val = e.target.value.trimStart();
                      setForm({ ...form, email: val });
                      setFieldErrors({ ...fieldErrors, email: validateField('email', val) });
                    }}
                    placeholder={t.contact.emailPh}
                    className={inputClass('email')}
                  />
                  {fieldErrors.email && <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="vedic-label">{t.contact.messageLabel}</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      setFieldErrors({ ...fieldErrors, message: validateField('message', e.target.value) });
                    }}
                    placeholder={t.contact.messagePh}
                    className={`${inputClass('message')} resize-y`}
                  />
                  {fieldErrors.message && <p className="text-red-600 text-xs mt-1">{fieldErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-saffron-primary w-full text-sm mt-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.contact.sendingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.contact.sendBtn}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
