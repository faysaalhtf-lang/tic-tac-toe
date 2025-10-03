// services/hapticService.ts

export const triggerHapticFeedback = (pattern: VibratePattern = 10) => {
  if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
    try {
      // Use navigator.vibrate for haptic feedback
      window.navigator.vibrate(pattern);
    } catch (e) {
      console.warn("Haptic feedback failed.", e);
    }
  }
};

export const hapticMove = () => triggerHapticFeedback(20);
export const hapticWin = () => triggerHapticFeedback([100, 30, 100, 30, 100]);
export const hapticDraw = () => triggerHapticFeedback([50, 50, 50]);
export const hapticClick = () => triggerHapticFeedback(10);
