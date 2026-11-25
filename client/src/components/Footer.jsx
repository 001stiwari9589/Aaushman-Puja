import React from 'react';
import { Mail, Phone, Sparkles } from 'lucide-react';
import { PUJAS_DATA } from '../data/pujas';
import { useLanguage } from '../context/LanguageContext';
import { useBookingPopup } from '../context/BookingPopupContext';
import BrandLogo from './ui/BrandLogo';

export default function Footer({ onOpenBrahminModal }) {
  const { t, language } = useLanguage();
  const { openBookingPopup } = useBookingPopup();

  return (
    <footer className="bg-[#3B1208] text-[#FFF1D6] pt-14 pb-24 lg:pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benediction Bar */}
        <div className="text-center pb-8 mb-10 border-b border-[#FFF1D6]/15">
          <div className="font-heading text-lg sm:text-xl text-[#FFF1D6] leading-relaxed mb-1">
            {t.footer.shloka}
          </div>
          <div className="font-sans text-xs sm:text-sm text-[#C8961E] font-medium">
            {t.footer.shlokaMeaning}
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <BrandLogo size="sm" />
              <span className="font-heading text-xl font-bold text-white">
                Aaushman Puja
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-4 text-[#FFF1D6]/85">
              {t.footer.bio}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading text-base font-bold text-white mb-4 uppercase tracking-wider">
              {t.footer.quickNav}
            </h4>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              <li><a href="#hero" className="text-[#FFF1D6]/85 hover:text-white no-underline">{t.footer.home}</a></li>
              <li><a href="#services" className="text-[#FFF1D6]/85 hover:text-white no-underline">{t.footer.catalog}</a></li>
              <li><a href="#about" className="text-[#FFF1D6]/85 hover:text-white no-underline">{t.footer.about}</a></li>
              <li>
                <button
                  type="button"
                  onClick={() => openBookingPopup('')}
                  className="bg-transparent border-none p-0 text-[#FFF1D6]/85 hover:text-white text-sm cursor-pointer"
                >
                  {t.footer.bookNow}
                </button>
              </li>
              <li><a href="#faqs" className="text-[#FFF1D6]/85 hover:text-white no-underline">{t.footer.faqs}</a></li>
              <li><a href="#contact" className="text-[#FFF1D6]/85 hover:text-white no-underline">{t.footer.contact}</a></li>
              <li>
                <button
                  onClick={onOpenBrahminModal}
                  className="bg-transparent border-none p-0 text-[#C8961E] hover:text-white text-sm font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'ब्राह्मण के रूप में जुड़ें' : 'Join as Brahmin'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Ceremonies */}
          <div>
            <h4 className="font-heading text-base font-bold text-white mb-4 uppercase tracking-wider">
              {t.footer.sacredCeremonies}
            </h4>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              {PUJAS_DATA.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <a href="#services" className="text-[#FFF1D6]/85 hover:text-white no-underline">
                    {t.services.items?.[p.id]?.name || p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Visible Helpline */}
          <div>
            <h4 className="font-heading text-base font-bold text-white mb-4 uppercase tracking-wider">
              {t.footer.vedicHelpline}
            </h4>

            <div className="space-y-3 text-sm">
              <a
                href="tel:+919589018011"
                className="flex items-center gap-2.5 text-white hover:text-[#C8961E] no-underline font-bold"
              >
                <Phone className="w-4 h-4 text-[#C8961E] shrink-0" />
                <span>+91 9589018011</span>
              </a>

              <a
                href="mailto:001stiwari9589@gmail.com"
                className="flex items-center gap-2.5 text-[#FFF1D6]/90 hover:text-white no-underline break-all"
              >
                <Mail className="w-4 h-4 text-[#C8961E] shrink-0" />
                <span>001stiwari9589@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Developer Credit */}
        <div className="border-t border-[#FFF1D6]/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFF1D6]/75">
          <div>
            © {new Date().getFullYear()} Divine Vedic Puja Sansthan. All Rights Reserved.
          </div>
          <div>
            Developed by <span className="font-semibold text-[#FFF1D6]">Satyam Tiwari</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
