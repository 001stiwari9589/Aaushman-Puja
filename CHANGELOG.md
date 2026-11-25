# Changelog

All notable changes to the **Divine Vedic Puja** full-stack platform are documented below.

## [2.1.0] - 2026-11-25

### Audio Removal & Floating Actions
- Completely removed the Web Audio Om drone toggle (`toggleSacredAudio`, `isAudioPlaying`, `audioContextRef`) from `App.jsx`, `Navbar.jsx`, and `Hero.jsx`.
- Replaced `MobileBottomBar` and `FloatingWhatsApp` with `FloatingActions.jsx`: fixed `56px` Call button (`#E65100`, bottom-left) and WhatsApp button (`#25D366`, bottom-right) with `env(safe-area-inset-bottom)` support, desktop hover tooltips, and a 10-second pulse that respects `prefers-reduced-motion`.

### Quick Booking Popup & Auto-Fill
- Added `BookingPopupContext.jsx` (`openBookingPopup(pujaName?)`) and `QuickBookingPopup.jsx` (centered `460px` modal on desktop, slide-up bottom sheet on mobile, focus trap, ESC/backdrop close, body scroll lock, and return-focus on close).
- Wired all "Book Puja" / "Book Now" CTAs (Navbar, Hero, Services cards, Services modal, Footer) to open the popup with automatic Puja preselection when triggered from a specific Puja.
- Updated `server/server.js` `bookingSchemaZod` and Mongoose schema so short quick-popup bookings (`fullName`, `mobile`, `city`, `puja`, optional `preferredDate`) succeed cleanly alongside detailed bookings.

### Hero HD Puja Video & Mobile Responsiveness
- Replaced the Hero right-side image with an HD `<video>` card (`/videos/puja-hero.mp4` + `/images/puja-hero-poster.jpg` fallback) featuring `IntersectionObserver` off-screen pause and mobile Data Saver / `prefers-reduced-motion` poster mode.
- Fixed mobile responsiveness across all sections (`1` col Services grid on mobile, `aspect-[16/10]` images, vertical timeline in `HowItWorks.jsx`, `dvh` hero height, `44px+` tap targets, logo + hamburger only in mobile navbar).
- Added `MotionConfig reducedMotion="user"` and performance-safe Framer Motion reveal, hover, and `layoutId` navbar underline animations.

## [2.0.0] - 2026-11-25
- Applied warm light saffron/ivory theme, Philosopher + Poppins typography, WebP images, Jabalpur/MP SEO, hidden `/admin` route, `helmet`, `express-rate-limit`, `zod`, `bcryptjs`, `httpOnly` JWT cookies, and real `/api/reviews` integration.
