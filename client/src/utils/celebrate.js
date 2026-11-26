import confetti from 'canvas-confetti';

const CELEBRATION_COLORS = ['#E65100', '#C8961E', '#FFD54F', '#25D366', '#FFF1D6'];

/**
 * Fires a multi-burst Vedic celebration confetti shower above all modals.
 */
export function triggerBookingCelebration() {
  try {
    confetti({
      particleCount: 95,
      spread: 80,
      startVelocity: 42,
      ticks: 240,
      scalar: 1.15,
      zIndex: 99999,
      origin: { x: 0.5, y: 0.55 },
      colors: CELEBRATION_COLORS,
    });

    setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 65,
        startVelocity: 40,
        ticks: 220,
        scalar: 1.1,
        zIndex: 99999,
        origin: { x: 0.12, y: 0.65 },
        colors: CELEBRATION_COLORS,
      });
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 65,
        startVelocity: 40,
        ticks: 220,
        scalar: 1.1,
        zIndex: 99999,
        origin: { x: 0.88, y: 0.65 },
        colors: CELEBRATION_COLORS,
      });
    }, 220);

    setTimeout(() => {
      confetti({
        particleCount: 65,
        spread: 100,
        startVelocity: 35,
        ticks: 220,
        scalar: 1.1,
        zIndex: 99999,
        origin: { x: 0.5, y: 0.4 },
        colors: CELEBRATION_COLORS,
      });
    }, 520);
  } catch {
    // safe fallback if canvas is unavailable
  }
}
