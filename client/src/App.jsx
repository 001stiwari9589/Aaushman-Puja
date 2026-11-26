import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import BookingForm from './components/BookingForm';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import FloatingActions from './components/FloatingActions';
import QuickBookingPopup from './components/QuickBookingPopup';
import { BookingPopupProvider, useBookingPopup } from './context/BookingPopupContext';

const Testimonials = lazy(() => import('./components/Testimonials'));
const BrahminModal = lazy(() => import('./components/BrahminModal'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

function MainAppContent() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    () => window.location.pathname === '/admin'
  );
  const [loading, setLoading] = useState(true);
  const [isBrahminModalOpen, setIsBrahminModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [mobilePage, setMobilePage] = useState('home');
  const { pagePreselectedPuja } = useBookingPopup();

  useEffect(() => {
    const checkViewport = () => setIsMobileView(window.innerWidth < 1024);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const handleMobileNavigate = (pageKey) => {
    setMobilePage(pageKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => {
      setIsAdminRoute(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (isAdminRoute) return;
    const handleScroll = () => {
      const sections = ['hero', 'services', 'about', 'why-us', 'how-it-works', 'booking', 'testimonials', 'faqs', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-dvh bg-[#FFF8EC] flex items-center justify-center text-[#4A1C0C] font-sans">Loading Admin Portal...</div>}>
        <AdminDashboard
          isOpen={true}
          onClose={() => {
            window.history.pushState({}, '', '/');
            setIsAdminRoute(false);
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="vedic-app min-h-dvh bg-[#FFF8EC] text-[#5D4037] relative font-sans overflow-x-hidden">
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Navbar
        activeSection={isMobileView ? mobilePage : activeSection}
        isMobileView={isMobileView}
        onMobileNavigate={handleMobileNavigate}
      />

      <main className={isMobileView && mobilePage !== 'home' ? 'pt-16' : ''}>
        {isMobileView ? (
          <>
            {mobilePage !== 'home' && (
              <div className="bg-[#FBEBD0] border-b border-[#EBD5B0] px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => handleMobileNavigate('home')}
                  className="text-sm font-bold text-[#E65100] bg-transparent border-none p-0 cursor-pointer"
                >
                  ← Back to Home
                </button>
              </div>
            )}
            {mobilePage === 'home' && (
              <>
                <Hero />
                <Services />
                <BookingForm preselectedPuja={pagePreselectedPuja} />
                <Suspense fallback={<div className="py-12 text-center text-[#8D6E63] font-sans">Loading reviews...</div>}>
                  <Testimonials />
                </Suspense>
              </>
            )}
            {mobilePage === 'services' && <Services />}
            {mobilePage === 'about' && <About />}
            {mobilePage === 'booking' && <BookingForm preselectedPuja={pagePreselectedPuja} />}
            {mobilePage === 'testimonials' && (
              <Suspense fallback={<div className="py-16 text-center text-[#8D6E63] font-sans">Loading reviews...</div>}>
                <Testimonials />
              </Suspense>
            )}
            {mobilePage === 'faqs' && <FAQ />}
            {mobilePage === 'contact' && <Contact />}
          </>
        ) : (
          <>
            <Hero />
            <Services />
            <About />
            <BookingForm preselectedPuja={pagePreselectedPuja} />

            <Suspense fallback={<div className="py-16 text-center text-[#8D6E63] font-sans">Loading reviews...</div>}>
              <Testimonials />
            </Suspense>

            <FAQ />
            <Contact />
          </>
        )}
      </main>

      <Footer
        onOpenBrahminModal={() => setIsBrahminModalOpen(true)}
        isMobileView={isMobileView}
        onMobileNavigate={handleMobileNavigate}
      />

      <FloatingActions />
      <QuickBookingPopup />

      <Suspense fallback={null}>
        {isBrahminModalOpen && (
          <BrahminModal
            isOpen={isBrahminModalOpen}
            onClose={() => setIsBrahminModalOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BookingPopupProvider>
        <MainAppContent />
      </BookingPopupProvider>
    </MotionConfig>
  );
}
