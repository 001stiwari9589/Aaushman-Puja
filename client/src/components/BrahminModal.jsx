import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Flame, CheckCircle2, AlertCircle, Loader2, Award } from 'lucide-react';
import CustomSelect from './ui/CustomSelect';

export default function BrahminModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    city: '',
    experience: '5-10 Years',
    qualification: '',
    languages: 'Sanskrit & Hindi',
    gotra: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    const val = typeof value === 'string' ? value.trim() : '';
    switch (name) {
      case 'fullName':
        if (!val) return 'Full name is required.';
        if (val.length < 2) return 'Please enter at least 2 characters.';
        return '';
      case 'mobile':
        if (!val) return 'Mobile number is required.';
        if (!/^[6-9]\d{9}$/.test(val)) return 'Enter a valid 10-digit Indian mobile number.';
        return '';
      case 'email':
        if (!val) return 'Email address is required.';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) return 'Enter a valid email address.';
        return '';
      case 'city':
        if (!val || val.length < 2) return 'City / State is required.';
        return '';
      case 'qualification':
        if (!val || val.length < 3) return 'Please enter your Vedic qualification / specialization.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'fullName' || name === 'gotra') {
      value = value.replace(/[^a-zA-Z\s.\u0900-\u097F]/g, '');
    } else if (name === 'mobile') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['fullName', 'mobile', 'email', 'city', 'qualification'];
    const errors = {};
    required.forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) errors[key] = err;
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/brahmins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setErrorMsg('Server connection failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#3B1208]/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 16 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] border border-[#EBD5B0] rounded-2xl p-6 sm:p-8 relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[#FFF8EC] border border-[#EBD5B0] flex items-center justify-center text-[#4A1C0C] hover:border-[#E65100] cursor-pointer"
          aria-label="Close Brahmin registration modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#FBEBD0] border-2 border-[#C8961E] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-[#E65100]" />
            </div>

            <h3 className="font-heading text-2xl font-bold text-[#4A1C0C] mb-3">
              Pranam Acharya Ji!
            </h3>

            <p className="text-[#5D4037] text-base leading-relaxed mb-6 max-w-md mx-auto">
              Your application to join the Divine Vedic Puja Acharya Council has been received. Our team will review your details and contact you.
            </p>

            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="btn-saffron-primary text-sm mx-auto"
            >
              <span>Close</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-[#C8961E] mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="font-sans text-xs font-bold uppercase tracking-widest">
                Vedic Scholar Registration
              </span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A1C0C] mb-2 pr-10">
              Join as Vedic Brahmin / Pandit
            </h2>

            <p className="text-[#5D4037] text-sm leading-relaxed mb-6">
              Join our council of Gurukul-trained Acharyas serving families in Jabalpur, Madhya Pradesh and across India.
            </p>

            {errorMsg && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-3.5 text-red-800 text-sm mb-5 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="font-sans" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="vedic-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`vedic-input ${fieldErrors.fullName ? '!border-red-600 focus:!ring-red-200' : ''}`}
                    required
                  />
                  {fieldErrors.fullName && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="vedic-label">Mobile Number *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    className={`vedic-input ${fieldErrors.mobile ? '!border-red-600 focus:!ring-red-200' : ''}`}
                    required
                  />
                  {fieldErrors.mobile && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="vedic-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`vedic-input ${fieldErrors.email ? '!border-red-600 focus:!ring-red-200' : ''}`}
                    required
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="vedic-label">City / State *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city and state"
                    className={`vedic-input ${fieldErrors.city ? '!border-red-600 focus:!ring-red-200' : ''}`}
                    required
                  />
                  {fieldErrors.city && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.city}</p>
                  )}
                </div>

                <CustomSelect
                  label="Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={(val) => handleChange({ target: { name: 'experience', value: val } })}
                  options={[
                    { value: '3-5 Years', label: '3 - 5 Years', icon: Award },
                    { value: '5-10 Years', label: '5 - 10 Years', icon: Award },
                    { value: '10-15 Years', label: '10 - 15 Years', icon: Award },
                    { value: '15+ Years', label: '15+ Years (Senior Acharya)', icon: Award },
                  ]}
                  placeholder="Select experience"
                />

                <div>
                  <label className="vedic-label">Gotra</label>
                  <input
                    type="text"
                    name="gotra"
                    value={formData.gotra}
                    onChange={handleChange}
                    placeholder="Enter your Gotra"
                    className="vedic-input"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="vedic-label">Vedic Qualification &amp; Gurukul *</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="Enter your Vedic qualification &amp; Gurukul"
                  className={`vedic-input ${fieldErrors.qualification ? '!border-red-600 focus:!ring-red-200' : ''}`}
                  required
                />
                {fieldErrors.qualification && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.qualification}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="vedic-label">Fluent Languages</label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="Enter fluent languages"
                  className="vedic-input"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-saffron-outline text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-saffron-primary text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4" />
                      <span>Submit Acharya Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
