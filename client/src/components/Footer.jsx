import React from 'react';
import { Phone } from 'lucide-react';
import { PUJAS_DATA } from '../data/pujas';
import { useLanguage } from '../context/LanguageContext';
import { useBookingPopup } from '../context/BookingPopupContext';
import BrandLogo from './ui/BrandLogo';

export default function Footer({ onOpenBrahminModal, isMobileView, onMobileNavigate }) {
  const { t, language } = useLanguage();
  const { openBookingPopup } = useBookingPopup();

  const handleNavClick = (e, pageKey) => {
    if (isMobileView && onMobileNavigate) {
      e.preventDefault();
      onMobileNavigate(pageKey);
    }
  };

  return (
    <footer className="bg-[#3B1208] text-[#FFF1D6] pt-10 lg:pt-14 pb-24 lg:pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benediction Bar */}
        <div className="text-center pb-6 mb-8 border-b border-[#FFF1D6]/15">
          <div className="font-heading text-base sm:text-xl text-[#FFF1D6] leading-relaxed mb-1">
            {t.footer.shloka}
          </div>
          <div className="font-sans text-xs sm:text-sm text-[#C8961E] font-medium">
            {t.footer.shlokaMeaning}
          </div>
        </div>

        {/* 3 Footer Columns: On mobile Col 1 full width + Col 2 & Col 3 side-by-side in 1 row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 lg:mb-10">
          {/* Col 1: Brand + Phone & Email underneath */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <BrandLogo size="sm" />
              <span className="font-heading text-xl font-bold text-white">
                Aaushman Puja
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-4 text-[#FFF1D6]/85">
              {t.footer.bio}
            </p>

            {/* Call Now button under first column */}
            <div className="pt-2">
              <a
                href="tel:+919589018011"
                aria-label="Call Now"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E65100] hover:bg-[#BF360C] text-white font-sans font-bold text-sm shadow-[0_4px_14px_rgba(230,81,0,0.4)] border border-[#C8961E]/50 transition-all hover:-translate-y-0.5 no-underline"
              >
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>{language === 'hi' ? 'कॉल करें' : 'Call Now'}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 uppercase tracking-wider">
              {t.footer.quickNav}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm list-none p-0 m-0">
              <li>
                <a
                  href="#hero"
                  onClick={(e) => handleNavClick(e, 'home')}
                  className="text-[#FFF1D6]/85 hover:text-white no-underline"
                >
                  {t.footer.home}
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleNavClick(e, 'services')}
                  className="text-[#FFF1D6]/85 hover:text-white no-underline"
                >
                  {t.footer.catalog}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="text-[#FFF1D6]/85 hover:text-white no-underline"
                >
                  {t.footer.about}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openBookingPopup('')}
                  className="bg-transparent border-none p-0 text-[#FFF1D6]/85 hover:text-white text-xs sm:text-sm cursor-pointer"
                >
                  {t.footer.bookNow}
                </button>
              </li>
              <li>
                <a
                  href="#faqs"
                  onClick={(e) => handleNavClick(e, 'faqs')}
                  className="text-[#FFF1D6]/85 hover:text-white no-underline"
                >
                  {t.footer.faqs}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="text-[#FFF1D6]/85 hover:text-white no-underline"
                >
                  {t.footer.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Ceremonies */}
          <div>
            <h4 className="font-heading text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 uppercase tracking-wider">
              {t.footer.sacredCeremonies}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm list-none p-0 m-0">
              {PUJAS_DATA.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, 'services')}
                    className="text-[#FFF1D6]/85 hover:text-white no-underline"
                  >
                    {t.services.items?.[p.id]?.name || p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright & Developer Credit */}
        <div className="border-t border-[#FFF1D6]/15 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#FFF1D6]/75 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Aaushman Puja. All Rights Reserved.
          </div>
          <div>
            Developed by <span className="font-semibold text-[#FFF1D6]">Satyam Tiwari</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
